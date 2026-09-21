"""Feedback API Endpoints for DailyDictation Studio.
Enforces authenticated user submission, OWASP input validation, rate limiting, and MinIO image attachments.
"""
import os
import re
import html
import logging

from datetime import datetime, timezone, timedelta
from typing import Optional
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException, Request, Response, UploadFile, File, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload

from app.infrastructure.database.connection import get_db
from app.infrastructure.database.models import User, Feedback, FeedbackMessage
from app.application.auth_service import get_current_user
from app.presentation.security_middleware import limiter
from app.infrastructure.minio_service import upload_feedback_image, get_feedback_image

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/feedback", tags=["Feedback"])

VALID_FEEDBACK_TYPES = {"SUGGESTION", "BUG", "CONTENT", "GENERAL"}


class CreateFeedbackRequest(BaseModel):
    content: Optional[str] = Field("", max_length=2000, description="Nội dung phản hồi hoặc mô tả lỗi")
    feedback_type: Optional[str] = Field("GENERAL", max_length=50, description="Loại phản hồi")
    category: Optional[str] = Field(None, max_length=50, description="Alias cho feedback_type")
    rating: Optional[int] = Field(None, ge=1, le=5, description="Đánh giá 1 - 5 sao")
    image_url: Optional[str] = Field(None, max_length=1000, description="URL hoặc đường dẫn ảnh đính kèm từ MinIO")


class ReplyFeedbackRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000, description="Nội dung phản hồi")
    image_url: Optional[str] = Field(None, max_length=1000, description="URL ảnh đính kèm từ MinIO")


def sanitize_text(text: str) -> str:
    """Strip raw HTML tags, escape special characters and normalize whitespace."""
    no_html = re.sub(r"<[^>]*>", "", text)
    cleaned = html.escape(no_html).strip()
    return re.sub(r"\s+", " ", cleaned)


@router.post("/upload")
@limiter.limit("10/minute")
async def upload_image_for_feedback(
    request: Request,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    """Upload screenshot/image for feedback to MinIO storage."""
    try:
        content_type = file.content_type or "image/jpeg"
        file_bytes = await file.read()
        if not file_bytes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Tập tin tải lên không chứa dữ liệu."
            )

        image_url = upload_feedback_image(
            file_data=file_bytes,
            original_filename=file.filename or "image.jpg",
            content_type=content_type,
        )

        return {
            "message": "Đã tải ảnh lên thành công!",
            "image_url": image_url,
            "filename": file.filename,
        }
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except Exception as e:
        logger.error(f"Failed to upload image to MinIO: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Không thể lưu trữ ảnh vào MinIO. Vui lòng kiểm tra lại dịch vụ MinIO."
        )


@router.get("/images/{filename}")
async def get_image(filename: str):
    """Serve feedback screenshot from MinIO with public caching."""
    # Security check: sanitize filename to prevent path traversal
    safe_filename = os.path.basename(filename)
    try:
        data, content_type = get_feedback_image(safe_filename)
        return Response(
            content=data,
            media_type=content_type,
            headers={
                "Cache-Control": "public, max-age=86400",
            },
        )
    except FileNotFoundError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy ảnh")
    except Exception as e:
        logger.error(f"Error serving image {safe_filename}: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Lỗi khi truy xuất ảnh")


@router.post("", status_code=status.HTTP_201_CREATED)
@limiter.limit("20/minute")
async def submit_feedback(
    request: Request,
    payload: CreateFeedbackRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Submit user feedback with strict authentication, rate-limiting, and MinIO image attachment."""
    cleaned_content = sanitize_text(payload.content or "")
    if not payload.image_url and len(cleaned_content) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vui lòng nhập nội dung góp ý ít nhất 2 ký tự hoặc đính kèm ảnh minh họa."
        )
    if not cleaned_content and payload.image_url:
        cleaned_content = "Đính kèm ảnh phản hồi / báo lỗi"

    fb_type_raw = payload.category or payload.feedback_type or "GENERAL"
    fb_type = fb_type_raw.strip().upper()
    if fb_type not in VALID_FEEDBACK_TYPES:
        fb_type = "GENERAL"

    # Daily anti-abuse check: Max 30 submissions per user per 24 hours
    try:
        since_24h = datetime.now(timezone.utc) - timedelta(hours=24)
        count_res = await db.execute(
            select(func.count(Feedback.id)).where(
                Feedback.user_id == current_user.id,
                Feedback.created_at >= since_24h,
            )
        )
        daily_count = count_res.scalar() or 0
        if daily_count >= 30:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Bạn đã gửi tối đa phản hồi cho phép trong 24 giờ. Cảm ơn bạn đã đóng góp!"
            )
    except HTTPException:
        raise
    except Exception as count_err:
        logger.warning(f"Could not verify 24h feedback limit (proceeding): {count_err}")

    try:
        new_feedback = Feedback(
            user_id=current_user.id,
            feedback_type=fb_type,
            rating=payload.rating,
            content=cleaned_content,
            image_url=payload.image_url,
            status="PENDING",
        )
        db.add(new_feedback)
        await db.commit()
        await db.refresh(new_feedback)

        logger.info(f"User {current_user.email} submitted feedback [{fb_type}]: {new_feedback.id}")

        fb_dict = new_feedback.to_dict()
        fb_dict["user_name"] = current_user.name
        fb_dict["user_email"] = current_user.email

        return {
            "message": "Cảm ơn bạn đã gửi phản hồi! Đội ngũ phát triển sẽ ghi nhận và xử lý sớm nhất.",
            "feedback": fb_dict,
        }
    except Exception as e:
        await db.rollback()
        logger.error(f"Error saving feedback to database: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi lưu phản hồi vào cơ sở dữ liệu: {str(e)}"
        )


@router.get("/unread-count")
async def get_feedback_unread_count(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get total unread replies count for current user or admin."""
    try:
        if current_user.role == "ADMIN":
            # For admin: unread messages from USER
            res = await db.execute(
                select(func.count(FeedbackMessage.id)).where(
                    FeedbackMessage.sender_role == "USER",
                    FeedbackMessage.is_read == False,
                )
            )
        else:
            # For user: unread messages from ADMIN on user's feedbacks
            res = await db.execute(
                select(func.count(FeedbackMessage.id))
                .join(Feedback, FeedbackMessage.feedback_id == Feedback.id)
                .where(
                    Feedback.user_id == current_user.id,
                    FeedbackMessage.sender_role == "ADMIN",
                    FeedbackMessage.is_read == False,
                )
            )
        unread = res.scalar() or 0
        return {"unread_count": unread, "role": current_user.role}
    except Exception as e:
        logger.error(f"Error fetching unread feedback count: {e}")
        return {"unread_count": 0, "role": current_user.role}


@router.get("/my")
async def get_my_feedbacks(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List feedbacks submitted by current user with messages preloaded."""
    res = await db.execute(
        select(Feedback)
        .options(
            selectinload(Feedback.messages).selectinload(FeedbackMessage.user)
        )
        .where(Feedback.user_id == current_user.id)
        .order_by(Feedback.created_at.desc())
        .limit(30)
    )
    feedbacks = res.scalars().all()
    return {
        "total": len(feedbacks),
        "feedbacks": [f.to_dict() for f in feedbacks],
    }


@router.get("/{feedback_id}/messages")
async def get_feedback_messages(
    feedback_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve full conversation thread for a feedback and mark as read."""
    res = await db.execute(
        select(Feedback)
        .options(
            selectinload(Feedback.user),
            selectinload(Feedback.messages).selectinload(FeedbackMessage.user),
        )
        .where(Feedback.id == feedback_id)
    )
    fb = res.scalar_one_or_none()
    if not fb:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy phản hồi này.")

    if current_user.role != "ADMIN" and fb.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Bạn không có quyền xem phản hồi này.")

    # Auto mark incoming unread messages as read
    needs_commit = False
    for msg in fb.messages:
        if not msg.is_read:
            if current_user.role == "ADMIN" and msg.sender_role == "USER":
                msg.is_read = True
                needs_commit = True
            elif current_user.role != "ADMIN" and msg.sender_role == "ADMIN":
                msg.is_read = True
                needs_commit = True

    if needs_commit:
        await db.commit()

    return {
        "feedback": fb.to_dict(),
        "messages": [m.to_dict() for m in fb.messages],
    }


@router.post("/{feedback_id}/reply", status_code=status.HTTP_201_CREATED)
@limiter.limit("30/minute")
async def reply_to_feedback(
    request: Request,
    feedback_id: str,
    payload: ReplyFeedbackRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Send reply in a feedback conversation thread (both Admin and Ticket Owner)."""
    cleaned_msg = sanitize_text(payload.message or "")
    if not payload.image_url and len(cleaned_msg) < 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vui lòng nhập nội dung phản hồi."
        )
    if not cleaned_msg and payload.image_url:
        cleaned_msg = "Đính kèm ảnh minh họa"

    res = await db.execute(
        select(Feedback).where(Feedback.id == feedback_id)
    )
    fb = res.scalar_one_or_none()
    if not fb:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy phản hồi này.")

    is_admin = current_user.role == "ADMIN"
    if not is_admin and fb.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Bạn không có quyền trả lời phản hồi này.")

    sender_role = "ADMIN" if is_admin else "USER"

    # If Admin replies to a PENDING feedback, automatically update status to REVIEWED
    if is_admin and fb.status == "PENDING":
        fb.status = "REVIEWED"

    new_msg = FeedbackMessage(
        feedback_id=fb.id,
        user_id=current_user.id,
        sender_role=sender_role,
        message=cleaned_msg,
        image_url=payload.image_url,
        is_read=False,
    )
    db.add(new_msg)
    await db.commit()
    await db.refresh(new_msg)

    logger.info(f"Feedback {fb.id} new reply from [{sender_role}] {current_user.email}")
    msg_dict = new_msg.to_dict()
    msg_dict["sender_name"] = current_user.name
    msg_dict["sender_avatar"] = current_user.avatar_url

    return {
        "message": "Đã gửi phản hồi thành công!",
        "reply": msg_dict,
        "feedback_status": fb.status,
    }

