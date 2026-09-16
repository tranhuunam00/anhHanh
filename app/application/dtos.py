"""Data Transfer Objects for the Application Layer."""
from dataclasses import dataclass
from typing import List, Optional
from app.domain.models import EvaluationStatus


@dataclass
class GetLessonRequest:
    url_or_id: str
    grouping_mode: str = "sentence"  # "sentence" or "snippet"
    source_lang: Optional[str] = "en"
    target_lang: Optional[str] = "vi"


@dataclass
class ChallengeDTO:
    id: int
    position: int
    text: str
    time_start: float
    time_end: float
    duration: float
    translation: Optional[str] = None


@dataclass
class LessonResponse:
    video_id: str
    title: str
    total_challenges: int
    challenges: List[ChallengeDTO]
    source_lang: Optional[str] = "en"
    detected_source_lang: Optional[str] = "en"
    target_lang: Optional[str] = "vi"


@dataclass
class EvaluateRequest:
    target_text: str
    user_input: str
    strict_punctuation: bool = False


@dataclass
class WordEvaluationDTO:
    target_word: str
    user_word: Optional[str]
    status: EvaluationStatus


@dataclass
class EvaluateResponse:
    is_completed: bool
    accuracy_percentage: float
    words: List[WordEvaluationDTO]
    correct_count: int
    total_words: int
    feedback_message: str
