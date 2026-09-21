"""DB-backed repository for raw YouTube subtitle cache (lesson_subtitles table)."""
import logging
from typing import List, Optional, Tuple
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.models import SubtitleSnippet
from app.infrastructure.database.models import Lesson, LessonSubtitle, generate_uuid

logger = logging.getLogger(__name__)


class LessonSubtitleRepo:
    """Read/write raw subtitle cache from lesson_subtitles table."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_or_create_lesson(self, video_id: str, youtube_url: Optional[str] = None) -> Lesson:
        """Return existing Lesson row or create a minimal placeholder."""
        res = await self.db.execute(select(Lesson).where(Lesson.video_id == video_id))
        lesson = res.scalar_one_or_none()
        if not lesson:
            lesson = Lesson(
                video_id=video_id,
                youtube_url=youtube_url or f"https://www.youtube.com/watch?v={video_id}",
                title=f"YouTube Video ({video_id})",
                thumbnail_url=f"https://i.ytimg.com/vi/{video_id}/hqdefault.jpg",
                total_challenges=0,
                sentences_data=[],
            )
            self.db.add(lesson)
            await self.db.flush()  # get lesson.id without committing
        elif youtube_url and not lesson.youtube_url:
            lesson.youtube_url = youtube_url
        return lesson

    async def get_raw(
        self, lesson_id: str, lang_code: str
    ) -> Optional[List[SubtitleSnippet]]:
        """Return cached raw snippets for (lesson_id, lang_code), or None if not found."""
        res = await self.db.execute(
            select(LessonSubtitle).where(
                LessonSubtitle.lesson_id == lesson_id,
                LessonSubtitle.lang_code == lang_code,
            )
        )
        row = res.scalar_one_or_none()
        if row is None:
            return None
        try:
            return [
                SubtitleSnippet(
                    text=item["text"],
                    start=float(item["start"]),
                    duration=float(item["duration"]),
                )
                for item in (row.raw_data or [])
            ]
        except Exception as e:
            logger.warning(f"Failed to deserialize subtitles for lesson {lesson_id} lang {lang_code}: {e}")
            return None

    async def get_any_cached_raw(
        self, lesson_id: str
    ) -> Optional[Tuple[str, List[SubtitleSnippet]]]:
        """Return the first available cached raw source subtitle for a lesson, ignoring target translations."""
        res = await self.db.execute(
            select(LessonSubtitle).where(
                LessonSubtitle.lesson_id == lesson_id,
                ~LessonSubtitle.lang_code.contains("_tgt_"),
            )
        )
        row = res.scalars().first()
        if not row:
            return None
        try:
            snippets = [
                SubtitleSnippet(
                    text=item["text"],
                    start=float(item["start"]),
                    duration=float(item["duration"]),
                )
                for item in (row.raw_data or [])
            ]
            return row.lang_code, snippets
        except Exception as e:
            logger.warning(f"Failed to deserialize any subtitle for lesson {lesson_id}: {e}")
            return None

    async def get_any_target_raw(
        self, lesson_id: str, target_lang: str
    ) -> Optional[List[SubtitleSnippet]]:
        """Return any cached target translation ending with _tgt_{target_lang} for this lesson."""
        suffix = f"_tgt_{target_lang}"
        res = await self.db.execute(
            select(LessonSubtitle).where(
                LessonSubtitle.lesson_id == lesson_id,
                LessonSubtitle.lang_code.endswith(suffix),
            )
        )
        row = res.scalars().first()
        if not row:
            return None
        try:
            return [
                SubtitleSnippet(
                    text=item["text"],
                    start=float(item["start"]),
                    duration=float(item["duration"]),
                )
                for item in (row.raw_data or [])
            ]
        except Exception as e:
            logger.warning(f"Failed to deserialize target subtitle for lesson {lesson_id}: {e}")
            return None

    async def save_raw(
        self, lesson_id: str, lang_code: str, snippets: List[SubtitleSnippet]
    ) -> None:
        """Upsert raw subtitle rows for (lesson_id, lang_code)."""
        raw_list = [
            {"text": s.text, "start": s.start, "duration": s.duration}
            for s in snippets
        ]
        # Check if row exists
        res = await self.db.execute(
            select(LessonSubtitle).where(
                LessonSubtitle.lesson_id == lesson_id,
                LessonSubtitle.lang_code == lang_code,
            )
        )
        row = res.scalar_one_or_none()
        if row:
            row.raw_data = raw_list
        else:
            row = LessonSubtitle(
                id=generate_uuid(),
                lesson_id=lesson_id,
                lang_code=lang_code,
                raw_data=raw_list,
            )
            self.db.add(row)
        logger.info(
            f"Saved {len(snippets)} raw subtitle snippets for lesson {lesson_id} lang={lang_code}"
        )

    async def update_lesson_meta(
        self,
        lesson: Lesson,
        title: str,
        total_challenges: int,
        sentences_data: list,
    ) -> None:
        """Update lesson metadata after processing subtitles.

        Only overwrites sentences_data on first load (total_challenges == 0).
        Preserves existing sentences to avoid user current_position drift
        when grouping algorithm changes.
        """
        lesson.title = title
        if lesson.total_challenges == 0 or not lesson.sentences_data:
            lesson.total_challenges = total_challenges
            lesson.sentences_data = sentences_data
