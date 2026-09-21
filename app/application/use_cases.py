"""Application Use Cases."""
import re
import logging
from typing import Optional
from app.domain.exceptions import InvalidVideoIdException
from app.domain.models import Lesson, Challenge
from app.domain.services import SentenceGrouperService, WordComparatorService
from app.application.interfaces import ITranscriptService, ICacheRepository
from app.application.dtos import (
    GetLessonRequest,
    LessonResponse,
    ChallengeDTO,
    EvaluateRequest,
    EvaluateResponse,
    WordEvaluationDTO,
)

from app.infrastructure.translation_service import TranslationService

logger = logging.getLogger(__name__)


def extract_youtube_id(url_or_id: str) -> str:
    """Extract YouTube 11-char video ID from various URL formats."""
    text = url_or_id.strip()
    if re.fullmatch(r"^[a-zA-Z0-9_-]{11}$", text):
        return text

    patterns = [
        r"(?:v=|\/v\/|youtu\.be\/|\/embed\/|\/shorts\/)([a-zA-Z0-9_-]{11})",
        r"[?&]v=([a-zA-Z0-9_-]{11})",
    ]
    for p in patterns:
        match = re.search(p, text)
        if match:
            return match.group(1)

    raise InvalidVideoIdException(f"Không thể nhận diện Video ID từ: {url_or_id}")


class GetLessonUseCase:
    """Use case to retrieve or generate a dictation lesson from YouTube URL/ID.

    Raw subtitles are cached in the `lesson_subtitles` DB table.
    YouTube is only called when no cached row exists for the requested language pair.
    """

    def __init__(
        self,
        transcript_service: ITranscriptService,
        cache_repo: Optional[ICacheRepository] = None,  # kept for interface compat (unused)
        sentence_grouper: Optional[SentenceGrouperService] = None,
        translation_service: Optional[TranslationService] = None,
    ):
        self.transcript_service = transcript_service
        self.sentence_grouper = sentence_grouper or SentenceGrouperService()
        self.translation_service = translation_service or TranslationService()

    def execute(self, request: GetLessonRequest) -> LessonResponse:
        """Synchronous execution without DB — used only for preview (no DB access needed yet).

        Full DB-backed execution is in execute_with_db() called from lesson_api.py.
        """
        video_id = extract_youtube_id(request.url_or_id)
        source_lang = (request.source_lang or "en").strip().lower()
        target_lang = (request.target_lang or "vi").strip().lower()

        # Fetch directly from YouTube (no DB, no file cache)
        title, src_snippets, tgt_snippets, detected_source_lang = (
            self.transcript_service.fetch_transcripts(
                video_id, source_lang=source_lang, target_lang=target_lang
            )
        )

        return self._build_response(
            video_id, title, src_snippets, tgt_snippets,
            source_lang=source_lang,
            detected_source_lang=detected_source_lang,
            target_lang=target_lang,
            grouping_mode=request.grouping_mode,
        )

    async def execute_with_db(
        self,
        request: GetLessonRequest,
        subtitle_repo,  # LessonSubtitleRepo instance
    ) -> tuple:
        """DB-backed execution: check lesson_subtitles first, fetch YouTube only if missing.

        Returns: (LessonResponse, lesson_record)
        """
        video_id = extract_youtube_id(request.url_or_id)
        source_lang = (request.source_lang or "en").strip().lower()
        target_lang = (request.target_lang or "vi").strip().lower()
        tgt_key = f"{source_lang}_tgt_{target_lang}"

        # 1. Ensure lesson row exists in DB
        youtube_url = f"https://www.youtube.com/watch?v={video_id}"
        lesson = await subtitle_repo.get_or_create_lesson(video_id, youtube_url=youtube_url)

        # 2. Check DB for source subtitle cache
        src_snippets = None
        tgt_snippets_from_yt = None
        detected_source_lang = source_lang
        title = lesson.title

        if source_lang and source_lang != "auto":
            src_snippets = await subtitle_repo.get_raw(lesson.id, source_lang)
            if src_snippets:
                detected_source_lang = source_lang
        else:
            # If source_lang is 'auto', check if DB already has any cached source subtitle
            cached = await subtitle_repo.get_any_cached_raw(lesson.id)
            if cached:
                detected_source_lang, src_snippets = cached
                logger.info(f"Using cached source subtitles from DB for {video_id} (detected lang={detected_source_lang})")

        if src_snippets is None:
            logger.info(f"No cached source subtitles for {video_id} lang={source_lang} — fetching YouTube")
            title, src_snippets, tgt_snippets_from_yt, detected_source_lang = (
                self.transcript_service.fetch_transcripts(
                    video_id, source_lang=source_lang, target_lang=target_lang
                )
            )
            save_lang = detected_source_lang if (detected_source_lang and detected_source_lang != "auto") else source_lang
            await subtitle_repo.save_raw(lesson.id, save_lang, src_snippets)
            if tgt_snippets_from_yt:
                await subtitle_repo.save_raw(lesson.id, f"{save_lang}_tgt_{target_lang}", tgt_snippets_from_yt)
        else:
            logger.info(f"Using cached source subtitles for {video_id} lang={detected_source_lang} from DB")

        # 3. Check DB for target subtitle cache
        effective_src = detected_source_lang or source_lang or "en"
        tgt_snippets = await subtitle_repo.get_raw(lesson.id, tgt_key)
        if tgt_snippets is None and target_lang not in ("none", ""):
            tgt_snippets = await subtitle_repo.get_any_target_raw(lesson.id, target_lang)

        if tgt_snippets is None and tgt_snippets_from_yt is not None:
            tgt_snippets = tgt_snippets_from_yt
        elif tgt_snippets is None and target_lang not in ("none", "", effective_src):
            # Target not cached and not fetched yet — fetch separately
            logger.info(f"Fetching target subtitles for {video_id} lang={target_lang}")
            try:
                _, _, tgt_snippets, _ = self.transcript_service.fetch_transcripts(
                    video_id, source_lang=effective_src, target_lang=target_lang
                )
                if tgt_snippets:
                    await subtitle_repo.save_raw(lesson.id, tgt_key, tgt_snippets)
            except Exception as e:
                logger.warning(f"Could not fetch target subtitles for {video_id}: {e}")
                tgt_snippets = None

        # 4. Build challenges and update lesson metadata in DB
        lesson_response = self._build_response(
            video_id, title, src_snippets, tgt_snippets,
            source_lang=source_lang,
            detected_source_lang=detected_source_lang,
            target_lang=target_lang,
            grouping_mode=request.grouping_mode,
        )
        sentences_list = [
            {
                "position": c.id,
                "text": c.text,
                "time_start": c.time_start,
                "time_end": c.time_end,
                "translation": c.translation or "",
            }
            for c in lesson_response.challenges
        ]
        await subtitle_repo.update_lesson_meta(
            lesson,
            title=title,
            total_challenges=len(sentences_list),
            sentences_data=sentences_list,
        )

        return lesson_response, lesson

    def _build_response(
        self,
        video_id: str,
        title: str,
        src_snippets,
        tgt_snippets,
        source_lang: str,
        detected_source_lang: str,
        target_lang: str,
        grouping_mode: str = "sentence",
    ) -> LessonResponse:
        if grouping_mode == "snippet":
            challenges = [
                Challenge(
                    id=i + 1,
                    position=i + 1,
                    text=s.text.replace("\n", " ").strip(),
                    time_start=round(s.start, 2),
                    time_end=round(s.end, 2),
                    translation=tgt_snippets[i].text.replace("\n", " ").strip()
                    if tgt_snippets and i < len(tgt_snippets)
                    else None,
                )
                for i, s in enumerate(src_snippets)
            ]
        else:
            challenges = self.sentence_grouper.group_into_challenges(
                snippets=src_snippets,
                translations=tgt_snippets,
                language=detected_source_lang,
            )

        # Clean subtitle credits
        for c in challenges:
            if c.translation:
                c.translation = SentenceGrouperService.clean_credits(c.translation)

        # Auto-translate first 12 if translation missing
        if target_lang not in ("none", "", detected_source_lang):
            for c in challenges[:12]:
                if not c.translation:
                    translated = self.translation_service.translate(
                        c.text, source_lang=detected_source_lang, target_lang=target_lang
                    )
                    if translated:
                        c.translation = translated

        lesson = Lesson(
            video_id=video_id,
            title=title,
            challenges=challenges,
            detected_source_lang=detected_source_lang,
        )
        return self._to_response(lesson, source_lang, detected_source_lang, target_lang)

    def _to_response(
        self,
        lesson: Lesson,
        source_lang: Optional[str] = "auto",
        detected_source_lang: Optional[str] = "en",
        target_lang: Optional[str] = "vi",
    ) -> LessonResponse:
        dto_challenges = [
            ChallengeDTO(
                id=c.id,
                position=c.position,
                text=c.text,
                time_start=c.time_start,
                time_end=c.time_end,
                duration=c.duration,
                translation=c.translation,
            )
            for c in lesson.challenges
        ]
        return LessonResponse(
            video_id=lesson.video_id,
            title=lesson.title,
            total_challenges=lesson.total_challenges,
            challenges=dto_challenges,
            source_lang=source_lang,
            detected_source_lang=detected_source_lang,
            target_lang=target_lang,
        )


class EvaluateSubmissionUseCase:
    """Use case to evaluate user's typed dictation answer."""

    def __init__(self, comparator: Optional[WordComparatorService] = None):
        self.comparator = comparator or WordComparatorService()

    def execute(self, request: EvaluateRequest) -> EvaluateResponse:
        eval_result = self.comparator.evaluate(
            target=request.target_text,
            user_input=request.user_input,
            strict_punctuation=request.strict_punctuation,
        )
        return EvaluateResponse(
            is_completed=eval_result.is_completed,
            accuracy_percentage=eval_result.accuracy_percentage,
            words=[
                WordEvaluationDTO(
                    target_word=w.target_word,
                    user_word=w.user_word,
                    status=w.status,
                )
                for w in eval_result.words
            ],
            correct_count=eval_result.correct_count,
            total_words=eval_result.total_words,
            feedback_message=eval_result.feedback_message,
        )
