"""Domain Models and Value Objects for the Dictation Bounded Context."""
from dataclasses import dataclass, field
from enum import Enum
import re
from typing import List, Optional


class EvaluationStatus(str, Enum):
    CORRECT = "correct"
    INCORRECT = "incorrect"
    MISSING = "missing"
    EXTRA = "extra"


@dataclass(frozen=True)
class SubtitleSnippet:
    """Raw snippet fetched from video subtitles."""
    text: str
    start: float
    duration: float

    @property
    def end(self) -> float:
        return self.start + self.duration


@dataclass(frozen=True)
class WordEvaluation:
    """Represents evaluation of a single word in the challenge."""
    target_word: str
    user_word: Optional[str]
    status: EvaluationStatus
    char_diff: Optional[str] = None


@dataclass(frozen=True)
class EvaluationResult:
    """Overall result of comparing user's submission with target sentence."""
    is_completed: bool
    accuracy_percentage: float
    words: List[WordEvaluation]
    correct_count: int
    total_words: int
    feedback_message: str = ""


@dataclass
class Challenge:
    """A single dictation challenge (representing a sentence/part to type)."""
    id: int
    position: int
    text: str
    time_start: float
    time_end: float
    translation: Optional[str] = None
    hints_used: int = 0
    is_completed: bool = False

    @property
    def duration(self) -> float:
        return max(0.0, self.time_end - self.time_start)

    @property
    def clean_words(self) -> List[str]:
        """Extract words without surrounding punctuation for counting."""
        raw_tokens = self.text.split()
        return [re.sub(r'^[^\w]+|[^\w]+$', '', token) for token in raw_tokens if token]


@dataclass
class Lesson:
    """An aggregate root representing a full dictation lesson created from a video."""
    video_id: str
    title: str
    challenges: List[Challenge] = field(default_factory=list)
    author: Optional[str] = None
    thumbnail_url: Optional[str] = None

    @property
    def total_challenges(self) -> int:
        return len(self.challenges)

    def get_challenge(self, position: int) -> Optional[Challenge]:
        for c in self.challenges:
            if c.position == position:
                return c
        return None
