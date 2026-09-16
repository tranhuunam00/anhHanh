"""Application layer interfaces and ports."""
from abc import ABC, abstractmethod
from typing import List, Optional, Tuple
from app.domain.models import SubtitleSnippet, Lesson


class ITranscriptService(ABC):
    """Port for fetching video title and raw subtitles in any language."""

    @abstractmethod
    def fetch_transcripts(
        self,
        video_id: str,
        source_lang: Optional[str] = "auto",
        target_lang: Optional[str] = "vi",
    ) -> Tuple[str, List[SubtitleSnippet], Optional[List[SubtitleSnippet]], str]:
        """Returns (video_title, source_snippets, optional_target_snippets, detected_source_lang)."""
        pass

    @abstractmethod
    def get_available_languages(self, video_id: str) -> dict:
        """Returns available subtitle tracks and translation languages for the video."""
        pass


class ICacheRepository(ABC):
    """Port for caching parsed lessons."""

    @abstractmethod
    def get(self, video_id: str, cache_key: Optional[str] = None) -> Optional[Lesson]:
        pass

    @abstractmethod
    def save(self, lesson: Lesson, cache_key: Optional[str] = None) -> None:
        pass
