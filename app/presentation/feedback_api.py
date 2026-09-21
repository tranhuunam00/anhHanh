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

from app.infrastructure.database.connection import get_db
from app.infrastructure.database.models import User, Feedback
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


@router.get("/my")
async def get_my_feedbacks(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List feedbacks submitted by current user."""
    res = await db.execute(
        select(Feedback)
        .where(Feedback.user_id == current_user.id)
        .order_by(Feedback.created_at.desc())
        .limit(20)
    )
    feedbacks = res.scalars().all()
    return {
        "total": len(feedbacks),
        "feedbacks": [f.to_dict() for f in feedbacks],
    }
