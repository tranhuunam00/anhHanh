"""Daily Streak and Habit Tracking API Endpoints for DailyDictation Studio."""
from datetime import date
from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.infrastructure.database.connection import get_db
from app.infrastructure.database.models import User, UserStreak
from app.application.auth_service import get_current_user_optional

router = APIRouter(prefix='/api/streak', tags=['Streak & Habits'])


@router.get('')
async def get_user_streak(
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve current streak days and words typed today for the header display."""
    if not current_user:
        return {
            'current_streak': 0,
            'longest_streak': 0,
            'words_today': 0,
            'is_authenticated': False
        }

    res = await db.execute(select(UserStreak).where(UserStreak.user_id == current_user.id))
    streak = res.scalar_one_or_none()
    today = date.today()

    if not streak:
        return {
            'current_streak': 0,
            'longest_streak': 0,
            'words_today': 0,
            'is_authenticated': True
        }

    # If last study date was before today, words_today resets to 0
    words_today = streak.words_today if streak.last_study_date == today else 0

    return {
        'current_streak': streak.current_streak,
        'longest_streak': streak.longest_streak,
        'words_today': words_today,
        'last_study_date': streak.last_study_date.isoformat() if streak.last_study_date else None,
        'is_authenticated': True
    }
