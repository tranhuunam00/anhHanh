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
    ):
        self.transcript_service = transcript_service
        self.cache_repo = cache_repo
        self.sentence_grouper = sentence_grouper or SentenceGrouperService()
        self.translation_service = translation_service or TranslationService()

    def execute(self, request: GetLessonRequest) -> LessonResponse:
        video_id = extract_youtube_id(request.url_or_id)

        # Check cache
        if self.cache_repo:
            cached_lesson = self.cache_repo.get(video_id)
            if cached_lesson:
                for c in cached_lesson.challenges:
                    if c.translation:
                        c.translation = SentenceGrouperService.clean_credits(c.translation)
                return self._to_response(cached_lesson)

        # Fetch from transcript service
        title, en_snippets, vi_snippets = self.transcript_service.fetch_transcripts(video_id)

        # Group snippets into natural sentences
        if request.grouping_mode == "snippet":
            challenges = [
                Challenge(
                    id=i + 1,
                    position=i + 1,
                    text=s.text.replace("\n", " ").strip(),
                    time_start=round(s.start, 2),
                    time_end=round(s.end, 2),
                    translation=vi_snippets[i].text.replace("\n", " ").strip()
                    if vi_snippets and i < len(vi_snippets)
                    else None,
                )
                for i, s in enumerate(en_snippets)
            ]
        else:
            challenges = self.sentence_grouper.group_into_challenges(
                snippets=en_snippets, translations=vi_snippets
            )

        # Ensure all translations are clean of credits
        for c in challenges:
            if c.translation:
                c.translation = SentenceGrouperService.clean_credits(c.translation)

        lesson = Lesson(video_id=video_id, title=title, challenges=challenges)

        # Save to cache
        if self.cache_repo:
            self.cache_repo.save(lesson)

        return self._to_response(lesson)

    def _to_response(self, lesson: Lesson) -> LessonResponse:
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
