"""In-memory cache repository for lessons (cleared on server restart).

Same video+language combo is cached in RAM for the life of the server process.
Restarting the server always fetches fresh from YouTube.
This prevents YouTube rate-limiting from repeated identical requests.
"""
from typing import Optional, Dict
from app.domain.models import Lesson
from app.application.interfaces import ICacheRepository


class FileCacheRepository(ICacheRepository):
    """Stores lessons in a process-level dict — no disk writes."""

    def __init__(self, cache_dir: str = "data/cache"):
        # cache_dir kept for interface compatibility; not used
        self._store: Dict[str, Lesson] = {}

    def _key(self, video_id: str, cache_key: Optional[str]) -> str:
        return cache_key if cache_key else video_id

    def get(self, video_id: str, cache_key: Optional[str] = None) -> Optional[Lesson]:
        return self._store.get(self._key(video_id, cache_key))

    def save(self, lesson: Lesson, cache_key: Optional[str] = None) -> None:
        self._store[self._key(lesson.video_id, cache_key)] = lesson
