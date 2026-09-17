"""Feedback API Endpoints for DailyDictation Studio.
Enforces authenticated user submission, OWASP input validation, and rate limiting.
"""
import re
import html
import logging
from datetime import datetime, timezone, timedelta
from typing import Optional, List
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.infrastructure.database.connection import get_db
from app.infrastructure.database.models import User, Feedback
from app.application.auth_service import get_current_user
from app.presentation.security_middleware import limiter

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/feedback", tags=["Feedback"])

VALID_FEEDBACK_TYPES = {"SUGGESTION", "BUG", "CONTENT", "GENERAL"}


class CreateFeedbackRequest(BaseModel):
    content: str = Field(..., min_length=5, max_length=2000, description="Nội dung phản hồi hoặc báo lỗi")
    feedback_type: Optional[str] = Field("GENERAL", max_length=50, description="Loại phản hồi")
    category: Optional[str] = Field(None, max_length=50, description="Alias cho feedback_type")
    rating: Optional[int] = Field(None, ge=1, le=5, description="Đánh giá 1 - 5 sao")


def sanitize_text(text: str) -> str:
    """Strip raw HTML tags, escape special characters and normalize whitespace."""
    no_html = re.sub(r"<[^>]*>", "", text)
    cleaned = html.escape(no_html).strip()
    return re.sub(r"\s+", " ", cleaned)


@router.post("", status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
async def submit_feedback(
    request: Request,
    payload: CreateFeedbackRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Submit user feedback with strict authentication, rate-limiting, and abuse protection."""
    cleaned_content = sanitize_text(payload.content)
    if len(cleaned_content) < 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Nội dung phản hồi phải có ít nhất 5 ký tự hợp lệ."
        )

    fb_type_raw = payload.category or payload.feedback_type or "GENERAL"
    fb_type = fb_type_raw.strip().upper()
    if fb_type not in VALID_FEEDBACK_TYPES:
        fb_type = "GENERAL"

    # Daily anti-abuse check: Max 15 submissions per user per 24 hours
    since_24h = datetime.now(timezone.utc) - timedelta(hours=24)
    count_res = await db.execute(
        select(func.count(Feedback.id)).where(
            Feedback.user_id == current_user.id,
            Feedback.created_at >= since_24h,
        )
    )
    daily_count = count_res.scalar() or 0
    if daily_count >= 15:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Bạn đã gửi tối đa 15 phản hồi trong vòng 24 giờ. Cảm ơn bạn đã đóng góp!"
        )

    new_feedback = Feedback(
        user_id=current_user.id,
        feedback_type=fb_type,
        rating=payload.rating,
        content=cleaned_content,
        status="PENDING",
    )
    db.add(new_feedback)
    await db.commit()
    await db.refresh(new_feedback)

    logger.info(f"User {current_user.email} submitted feedback [{fb_type}]: {new_feedback.id}")

    return {
        "message": "Cảm ơn bạn đã gửi phản hồi! Đội ngũ phát triển sẽ ghi nhận và xử lý sớm nhất.",
        "feedback": new_feedback.to_dict(),
    }


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
