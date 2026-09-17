"""Lesson Session and Video Preview API Endpoints for DailyDictation Studio.
Enables Video Preview Cards, Start Session, and In-progress Sentence Resume.
"""
import logging
from datetime import datetime, date, timedelta, timezone
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.infrastructure.database.connection import get_db
from app.infrastructure.database.models import User, Lesson, UserLesson, UserStreak
from app.application.auth_service import get_current_user_optional, get_current_user
from app.application.dtos import GetLessonRequest
from app.application.use_cases import extract_youtube_id, GetLessonUseCase
from app.infrastructure.youtube_adapter import YouTubeTranscriptAdapter
from app.infrastructure.cache_repository import FileCacheRepository
from app.presentation.security_middleware import limiter

logger = logging.getLogger(__name__)

router = APIRouter(prefix='/api/lesson', tags=['Lessons'])

_youtube_adapter = YouTubeTranscriptAdapter()
_cache_repo = FileCacheRepository()
_get_lesson_uc = GetLessonUseCase(transcript_service=_youtube_adapter, cache_repo=_cache_repo)


class PreviewApiRequest(BaseModel):
    url_or_id: str = Field(..., description='YouTube URL hoặc video ID')
    source_lang: Optional[str] = 'en'
    target_lang: Optional[str] = 'vi'


class StartLessonRequest(BaseModel):
    video_id: str
    source_lang: Optional[str] = 'en'
    target_lang: Optional[str] = 'vi'


class ProgressApiRequest(BaseModel):
    video_id: str
    current_position: Optional[int] = None
    current_challenge_index: Optional[int] = None
    is_completed: bool = False
    words_typed: int = Field(default=0, ge=0)

    @property
    def target_position(self) -> int:
        if self.current_position is not None:
            return max(1, self.current_position)
        if self.current_challenge_index is not None:
            return max(1, self.current_challenge_index)
        return 1


@router.post('/preview')
@limiter.limit('20/minute')
async def preview_video(
    request: Request,
    payload: PreviewApiRequest,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db)
):
    """Return video preview metadata before starting dictation session, including resumePosition if already studied."""
    try:
        vid = extract_youtube_id(payload.url_or_id)
        req = GetLessonRequest(
            url_or_id=vid,
            grouping_mode='sentence',
            source_lang=payload.source_lang or 'en',
            target_lang=payload.target_lang or 'vi'
        )
        lesson_dto = _get_lesson_uc.execute(req)
        total_challenges = len(lesson_dto.challenges)
        est_minutes = max(1, round(total_challenges * 0.25))

        resume_pos = 1
        is_done = False

        if current_user:
            stmt = (
                select(UserLesson)
                .join(Lesson, Lesson.id == UserLesson.lesson_id)
                .where(UserLesson.user_id == current_user.id, Lesson.video_id == vid)
            )
            ul_res = await db.execute(stmt)
            user_lesson = ul_res.scalar_one_or_none()
            if user_lesson:
                resume_pos = user_lesson.current_position
                is_done = user_lesson.is_completed

        return {
            'videoId': vid,
            'title': lesson_dto.title,
            'thumbnailUrl': f'https://i.ytimg.com/vi/{vid}/hqdefault.jpg',
            'totalChallenges': total_challenges,
            'estimatedMinutes': est_minutes,
            'sourceLang': getattr(lesson_dto, 'source_lang', payload.source_lang or 'en'),
            'targetLang': getattr(lesson_dto, 'target_lang', payload.target_lang or 'vi'),
            'resumePosition': resume_pos,
            'isCompleted': is_done
        }
    except Exception as e:
        logger.warning(f'Preview video failed: {e}')
        raise HTTPException(status_code=400, detail=f'Không thể tải thông tin video: {str(e)}')


@router.post('/start')
async def start_lesson_session(
    payload: StartLessonRequest,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db)
):
    """Start a study session, ensure lesson in DB, and retrieve current_position for resume."""
    vid = extract_youtube_id(payload.video_id)

    # 1. Fetch or get lesson from DB
    res = await db.execute(select(Lesson).where(Lesson.video_id == vid))
    lesson_record = res.scalar_one_or_none()

    if not lesson_record:
        req = GetLessonRequest(
            url_or_id=vid,
            grouping_mode='sentence',
            source_lang=payload.source_lang or 'en',
            target_lang=payload.target_lang or 'vi'
        )
        lesson_dto = _get_lesson_uc.execute(req)
        sentences_list = [
            {
                'position': c.id,
                'text': c.text,
                'time_start': c.time_start,
                'time_end': c.time_end,
                'translation': c.translation or ''
            }
            for c in lesson_dto.challenges
        ]
        lesson_record = Lesson(
            video_id=vid,
            title=lesson_dto.title,
            thumbnail_url=f'https://i.ytimg.com/vi/{vid}/hqdefault.jpg',
            total_challenges=len(sentences_list),
            sentences_data=sentences_list
        )
        db.add(lesson_record)
        await db.flush()

    # 2. Check user session for resume position
    current_pos = 1
    is_done = False

    if current_user:
        ul_res = await db.execute(
            select(UserLesson).where(
                UserLesson.user_id == current_user.id,
                UserLesson.lesson_id == lesson_record.id
            )
        )
        user_lesson = ul_res.scalar_one_or_none()
        if user_lesson:
            current_pos = user_lesson.current_position
            is_done = user_lesson.is_completed
        else:
            user_lesson = UserLesson(
                user_id=current_user.id,
                lesson_id=lesson_record.id,
                current_position=1,
                is_completed=False
            )
            db.add(user_lesson)
            await db.commit()

    return {
        'lesson': {
            'id': lesson_record.id,
            'videoId': lesson_record.video_id,
            'title': lesson_record.title,
            'thumbnailUrl': lesson_record.thumbnail_url,
            'totalChallenges': lesson_record.total_challenges,
            'sentences': lesson_record.sentences_data
        },
        'currentPosition': current_pos,
        'isCompleted': is_done
    }


@router.post('/progress')
async def update_lesson_progress(
    payload: ProgressApiRequest,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db)
):
    """Update active sentence current_position and update daily streak & words counter."""
    vid = extract_youtube_id(payload.video_id)
    streak_info = {'current_streak': 0, 'words_today': payload.words_typed}

    if current_user:
        # 1. Update UserLesson
        l_res = await db.execute(select(Lesson).where(Lesson.video_id == vid))
        lesson = l_res.scalar_one_or_none()
        if lesson:
            ul_res = await db.execute(
                select(UserLesson).where(
                    UserLesson.user_id == current_user.id,
                    UserLesson.lesson_id == lesson.id
                )
            )
            user_lesson = ul_res.scalar_one_or_none()
            if user_lesson:
                user_lesson.current_position = payload.target_position
                if payload.is_completed:
                    user_lesson.is_completed = True
                user_lesson.last_studied_at = datetime.now(timezone.utc)

        # 2. Update UserStreak
        s_res = await db.execute(select(UserStreak).where(UserStreak.user_id == current_user.id))
        streak = s_res.scalar_one_or_none()
        today = date.today()

        if not streak:
            streak = UserStreak(
                user_id=current_user.id,
                current_streak=1,
                longest_streak=1,
                words_today=payload.words_typed,
                last_study_date=today
            )
            db.add(streak)
        else:
            if streak.last_study_date == today:
                streak.words_today += payload.words_typed
            else:
                yesterday = today - timedelta(days=1)
                if streak.last_study_date == yesterday:
                    streak.current_streak += 1
                else:
                    streak.current_streak = 1

                streak.words_today = payload.words_typed
                streak.last_study_date = today

            streak.longest_streak = max(streak.longest_streak, streak.current_streak)

        await db.commit()
        streak_info = {
            'current_streak': streak.current_streak,
            'longest_streak': streak.longest_streak,
            'words_today': streak.words_today
        }

    return {
        'videoId': vid,
        'currentPosition': payload.target_position,
        'isCompleted': payload.is_completed,
        'streak': streak_info
    }


@router.get('/status/{video_id}')
async def get_lesson_status(
    video_id: str,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve resume position for active user on given video."""
    vid = extract_youtube_id(video_id)
    if not current_user:
        return {'videoId': vid, 'currentPosition': 1, 'isCompleted': False}

    res = await db.execute(
        select(UserLesson)
        .join(Lesson, Lesson.id == UserLesson.lesson_id)
        .where(UserLesson.user_id == current_user.id, Lesson.video_id == vid)
    )
    user_lesson = res.scalar_one_or_none()
    if user_lesson:
        return {
            'videoId': vid,
            'currentPosition': user_lesson.current_position,
            'isCompleted': user_lesson.is_completed
        }
    return {'videoId': vid, 'currentPosition': 1, 'isCompleted': False}


@router.get('/history')
async def get_user_lesson_history(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve all dictation lessons practiced by current user with progress & completion status."""
    stmt = (
        select(UserLesson, Lesson)
        .join(Lesson, Lesson.id == UserLesson.lesson_id)
        .where(UserLesson.user_id == current_user.id)
        .order_by(UserLesson.last_studied_at.desc())
    )
    res = await db.execute(stmt)
    records = res.all()

    history = []
    for ul, l in records:
        total = l.total_challenges or 1
        pos = min(ul.current_position, total)
        percent = 100 if ul.is_completed else min(99, round((pos / total) * 100))
        history.append({
            'id': ul.id,
            'lessonId': l.id,
            'videoId': l.video_id,
            'title': l.title,
            'thumbnailUrl': l.thumbnail_url or f"https://i.ytimg.com/vi/{l.video_id}/hqdefault.jpg",
            'totalChallenges': l.total_challenges,
            'currentPosition': ul.current_position,
            'isCompleted': ul.is_completed,
            'percent': percent,
            'lastStudiedAt': ul.last_studied_at.isoformat() if ul.last_studied_at else None,
            'startedAt': ul.started_at.isoformat() if ul.started_at else None,
        })

    return history


@router.delete('/history/{video_id}')
async def delete_user_lesson_history(
    video_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Remove a lesson from user's study history."""
    vid = extract_youtube_id(video_id)
    stmt = (
        select(UserLesson)
        .join(Lesson, Lesson.id == UserLesson.lesson_id)
        .where(UserLesson.user_id == current_user.id, Lesson.video_id == vid)
    )
    res = await db.execute(stmt)
    ul = res.scalar_one_or_none()
    if ul:
        await db.delete(ul)
        await db.commit()
        return {'message': 'Đã xóa bài khỏi lịch sử học tập'}
    return {'message': 'Bài học không tồn tại trong lịch sử'}
