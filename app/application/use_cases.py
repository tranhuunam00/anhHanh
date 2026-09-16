"""Application Use Cases."""
import re
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
from app.infrastructure.raw_subtitle_cache import RawSubtitleFileCache
from app.infrastructure.translation_service import TranslationService


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
    """Use case to retrieve or generate a dictation lesson from YouTube URL/ID."""

    def __init__(
        self,
        transcript_service: ITranscriptService,
        cache_repo: Optional[ICacheRepository] = None,
        sentence_grouper: Optional[SentenceGrouperService] = None,
        translation_service: Optional[TranslationService] = None,
        raw_sub_cache: Optional[RawSubtitleFileCache] = None,
    ):
        self.transcript_service = transcript_service
        self.cache_repo = cache_repo  # kept for interface compat, not used for lesson caching
        self.sentence_grouper = sentence_grouper or SentenceGrouperService()
        self.translation_service = translation_service or TranslationService()
        self.raw_sub_cache = raw_sub_cache or RawSubtitleFileCache()

    def execute(self, request: GetLessonRequest) -> LessonResponse:
        video_id = extract_youtube_id(request.url_or_id)
        source_lang = (request.source_lang or "en").strip().lower()
        target_lang = (request.target_lang or "vi").strip().lower()

        # --- Step 1: Get raw source subtitles (file cache or YouTube) ---
        cached_src = self.raw_sub_cache.get(video_id, source_lang)
        if cached_src:
            title, src_snippets = cached_src
            detected_source_lang = source_lang
            # Target subs: try cache, else fetch separately
            cached_tgt = self.raw_sub_cache.get(video_id, f"{source_lang}_tgt_{target_lang}")
            if cached_tgt:
                tgt_snippets = cached_tgt[1]
            elif target_lang and target_lang not in ("none", "", source_lang):
                _, _, tgt_snippets, _ = self.transcript_service.fetch_transcripts(
                    video_id, source_lang=source_lang, target_lang=target_lang
                )
                if tgt_snippets:
                    self.raw_sub_cache.save(
                        video_id,
                        f"{source_lang}_tgt_{target_lang}",
                        title,
                        tgt_snippets,
                    )
            else:
                tgt_snippets = None
        else:
            # Fetch fresh from YouTube
            title, src_snippets, tgt_snippets, detected_source_lang = (
                self.transcript_service.fetch_transcripts(
                    video_id, source_lang=source_lang, target_lang=target_lang
                )
            )
            # Save raw subs to file cache
            self.raw_sub_cache.save(video_id, source_lang, title, src_snippets)
            if tgt_snippets:
                self.raw_sub_cache.save(
                    video_id,
                    f"{source_lang}_tgt_{target_lang}",
                    title,
                    tgt_snippets,
                )

        # --- Step 2: Always run grouping fresh (so algorithm changes take effect) ---
        if request.grouping_mode == "snippet":
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
                snippets=src_snippets, translations=tgt_snippets
            )

        # Ensure all translations are clean of credits
        for c in challenges:
            if c.translation:
                c.translation = SentenceGrouperService.clean_credits(c.translation)

        # Auto-translate first 12 challenges if target_lang differs from source
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

        return self._to_response(
            lesson,
            source_lang=source_lang,
            detected_source_lang=detected_source_lang,
            target_lang=target_lang,
        )

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
