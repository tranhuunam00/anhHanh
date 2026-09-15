"""Application layer interfaces and ports."""
from abc import ABC, abstractmethod
from typing import List, Optional, Tuple
from app.domain.models import SubtitleSnippet, Lesson


class ITranscriptService(ABC):
    """Port for fetching video title and raw subtitles."""

    @abstractmethod
    def fetch_transcripts(
        self, video_id: str
    ) -> Tuple[str, List[SubtitleSnippet], Optional[List[SubtitleSnippet]]]:
        """Returns (video_title, english_snippets, optional_vietnamese_snippets)."""
        pass


class ICacheRepository(ABC):
    """Port for caching parsed lessons."""

    @abstractmethod
    def get(self, video_id: str) -> Optional[Lesson]:
        pass

    @abstractmethod
    def save(self, lesson: Lesson) -> None:
        pass
