"""Admin Management API Endpoints for DailyDictation Studio.
Strictly protected by require_admin dependency (Role-Based Access Control).
Provides user progress tracking, completion rates, and feedback moderation.
"""
import logging
from typing import Optional, List
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from sqlalchemy.orm import selectinload

from app.infrastructure.database.connection import get_db
from app.infrastructure.database.models import (
    User,
    Lesson,
    UserLesson,
    UserVocabulary,
    UserStreak,
    Feedback,
    FeedbackMessage,
)
from app.application.auth_service import require_admin

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/admin", tags=["Admin"])


class UpdateFeedbackStatusRequest(BaseModel):
    status: str = Field(..., description="Trạng thái: PENDING, REVIEWED, RESOLVED")


class UpdateUserRoleRequest(BaseModel):
    role: str = Field(..., description="Quyền: USER hoặc ADMIN")


@router.get("/overview")
async def get_admin_overview(
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve high-level system analytics for admin dashboard."""
    # 1. Total users
    users_count = (await db.execute(select(func.count(User.id)))).scalar() or 0

    # 2. Total lessons & user practice sessions
    lessons_count = (await db.execute(select(func.count(Lesson.id)))).scalar() or 0
    sessions_count = (await db.execute(select(func.count(UserLesson.id)))).scalar() or 0
    completed_sessions_count = (
        await db.execute(select(func.count(UserLesson.id)).where(UserLesson.is_completed == True))
    ).scalar() or 0

    # 3. Total feedbacks & pending/in-progress
    feedbacks_total = (await db.execute(select(func.count(Feedback.id)))).scalar() or 0
    feedbacks_pending = (
        await db.execute(select(func.count(Feedback.id)).where(Feedback.status == "PENDING"))
    ).scalar() or 0
    feedbacks_reviewed = (
        await db.execute(
            select(func.count(Feedback.id)).where(Feedback.status.in_(["REVIEWED", "IN_PROGRESS"]))
        )
    ).scalar() or 0
    feedbacks_resolved = (
        await db.execute(select(func.count(Feedback.id)).where(Feedback.status == "RESOLVED"))
    ).scalar() or 0
    feedbacks_active = feedbacks_pending + feedbacks_reviewed

    # 4. Total vocabulary saved
    vocab_total = (await db.execute(select(func.count(UserVocabulary.id)))).scalar() or 0

    return {
        "users_count": users_count,
        "lessons_count": lessons_count,
        "sessions_count": sessions_count,
        "completed_sessions_count": completed_sessions_count,
        "feedbacks_total": feedbacks_total,
        "feedbacks_pending": feedbacks_pending,
        "feedbacks_reviewed": feedbacks_reviewed,
        "feedbacks_active": feedbacks_active,
        "feedbacks_resolved": feedbacks_resolved,
        "vocab_total": vocab_total,
    }


@router.get("/feedback-count")
async def get_admin_feedback_count(
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve count of new (PENDING) and in-progress (REVIEWED/IN_PROGRESS) feedbacks for admin notification badge."""
    pending_count = (
        await db.execute(select(func.count(Feedback.id)).where(Feedback.status == "PENDING"))
    ).scalar() or 0
    in_progress_count = (
        await db.execute(
            select(func.count(Feedback.id)).where(Feedback.status.in_(["REVIEWED", "IN_PROGRESS"]))
        )
    ).scalar() or 0
    return {
        "pending": pending_count,
        "in_progress": in_progress_count,
        "total_active": pending_count + in_progress_count,
    }


@router.get("/feedbacks")
async def list_admin_feedbacks(
    status_filter: Optional[str] = Query(None),
    status_val: Optional[str] = Query(None, alias="status"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """List all submitted feedbacks with submitter user details and status filtering."""
    try:
        active_filter = status_filter or status_val
        query = (
            select(Feedback)
            .options(
                selectinload(Feedback.user),
                selectinload(Feedback.messages).selectinload(FeedbackMessage.user),
            )
            .order_by(desc(Feedback.created_at))
        )
        if active_filter and active_filter.upper() != "ALL":
            query = query.where(Feedback.status == active_filter.upper())

        # Count total
        count_query = select(func.count(Feedback.id))
        if active_filter and active_filter.upper() != "ALL":
            count_query = count_query.where(Feedback.status == active_filter.upper())
        total = (await db.execute(count_query)).scalar() or 0

        # Paginate
        query = query.limit(limit).offset(offset)
        res = await db.execute(query)
        feedbacks = res.scalars().all()

        return {
            "total": total,
            "limit": limit,
            "offset": offset,
            "feedbacks": [f.to_dict() for f in feedbacks],
        }
    except Exception as e:
        logger.error(f"Error fetching feedbacks for admin: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi tải danh sách phản hồi: {str(e)}"
        )


@router.patch("/feedbacks/{feedback_id}/status")
async def update_feedback_status(
    feedback_id: str,
    payload: UpdateFeedbackStatusRequest,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Admin updates feedback handling status: PENDING, REVIEWED, RESOLVED."""
    new_status = payload.status.strip().upper()
    if new_status not in {"PENDING", "REVIEWED", "IN_PROGRESS", "RESOLVED"}:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Trạng thái không hợp lệ. Cho phép: PENDING, REVIEWED, IN_PROGRESS, RESOLVED."
        )

    res = await db.execute(
        select(Feedback).options(selectinload(Feedback.user)).where(Feedback.id == feedback_id)
    )
    fb = res.scalar_one_or_none()
    if not fb:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy phản hồi này")

    fb.status = new_status
    await db.commit()
    await db.refresh(fb)

    logger.info(f"Admin {admin.email} marked feedback {feedback_id} as {new_status}")
    return {"message": "Đã cập nhật trạng thái phản hồi", "feedback": fb.to_dict()}


@router.get("/users")
async def list_admin_users(
    search: Optional[str] = Query(None),
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """List all registered users with their practice counts and detailed lesson completion rates."""
    query = (
        select(User)
        .options(
            selectinload(User.lessons).selectinload(UserLesson.lesson),
            selectinload(User.streak),
            selectinload(User.vocabulary),
        )
        .order_by(desc(User.created_at))
    )

    if search:
        s = f"%{search.strip().lower()}%"
        query = query.where((User.email.ilike(s)) | (User.name.ilike(s)))

    res = await db.execute(query)
    users = res.scalars().all()

    user_list = []
    for u in users:
        lessons_detail = []
        completed_count = 0

        for ul in u.lessons:
            l = ul.lesson
            if not l:
                continue

            total_ch = max(1, l.total_challenges)
            if ul.is_completed:
                rate = 100.0
                completed_count += 1
            else:
                rate = round((min(ul.current_position, total_ch) / total_ch) * 100, 1)

            lessons_detail.append({
                "lesson_id": l.id,
                "video_id": l.video_id,
                "title": l.title,
                "thumbnail_url": l.thumbnail_url,
                "current_position": ul.current_position,
                "total_challenges": l.total_challenges,
                "completion_rate": rate,
                "is_completed": ul.is_completed,
                "started_at": ul.started_at.isoformat() if ul.started_at else None,
                "last_studied_at": ul.last_studied_at.isoformat() if ul.last_studied_at else None,
            })

        # Sort user's lessons by last_studied_at desc
        lessons_detail.sort(key=lambda x: x["last_studied_at"] or "", reverse=True)

        user_list.append({
            "id": u.id,
            "email": u.email,
            "name": u.name,
            "role": u.role,
            "avatar_url": u.avatar_url,
            "created_at": u.created_at.isoformat() if u.created_at else None,
            "total_lessons_started": len(u.lessons),
            "total_lessons_attempted": len(u.lessons),
            "total_lessons_completed": completed_count,
            "completed_lessons": completed_count,
            "total_vocab_count": len(u.vocabulary) if u.vocabulary else 0,
            "streak": u.streak.to_dict() if u.streak else None,
            "lessons": lessons_detail,
        })

    return {
        "total": len(user_list),
        "users": user_list,
    }


@router.patch("/users/{user_id}/role")
async def update_user_role(
    user_id: str,
    payload: UpdateUserRoleRequest,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Admin promotes or demotes a user's role (USER ↔ ADMIN).

    Guard: Admin cannot change their own role.
    """
    new_role = payload.role.strip().upper()
    if new_role not in {"USER", "ADMIN"}:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Quyền không hợp lệ. Chỉ chấp nhận: USER, ADMIN."
        )

    if user_id == admin.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không thể thay đổi quyền của chính bạn."
        )

    res = await db.execute(select(User).where(User.id == user_id))
    target_user = res.scalar_one_or_none()
    if not target_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy người dùng.")

    old_role = target_user.role
    target_user.role = new_role
    await db.commit()
    await db.refresh(target_user)

    logger.info(f"Admin {admin.email} changed user {target_user.email} role: {old_role} → {new_role}")
    return {
        "message": f"Đã cập nhật quyền thành {new_role}",
        "user": {
            "id": target_user.id,
            "email": target_user.email,
            "name": target_user.name,
            "role": target_user.role,
        }
    }
