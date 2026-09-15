"""File-based cache repository for lessons."""
import json
import os
from typing import Optional
from app.domain.models import Lesson, Challenge
from app.application.interfaces import ICacheRepository


class FileCacheRepository(ICacheRepository):
    """Caches lessons as JSON files in a cache directory."""

    def __init__(self, cache_dir: str = "data/cache"):
        self.cache_dir = cache_dir
        os.makedirs(self.cache_dir, exist_ok=True)

    def _get_path(self, video_id: str) -> str:
        return os.path.join(self.cache_dir, f"{video_id}.json")

    def get(self, video_id: str) -> Optional[Lesson]:
        path = self._get_path(video_id)
        if not os.path.isfile(path):
            return None

        try:
            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)

            challenges = [
                Challenge(
                    id=c["id"],
                    position=c["position"],
                    text=c["text"],
                    time_start=c["time_start"],
                    time_end=c["time_end"],
                    translation=c.get("translation"),
                )
                for c in data.get("challenges", [])
            ]
            return Lesson(
                video_id=data["video_id"],
                title=data["title"],
                challenges=challenges,
            )
        except Exception:
            return None

    def save(self, lesson: Lesson) -> None:
        path = self._get_path(lesson.video_id)
        try:
            data = {
                "video_id": lesson.video_id,
                "title": lesson.title,
                "total_challenges": lesson.total_challenges,
                "challenges": [
                    {
                        "id": c.id,
                        "position": c.position,
                        "text": c.text,
                        "time_start": c.time_start,
                        "time_end": c.time_end,
                        "translation": c.translation,
                    }
                    for c in lesson.challenges
                ],
            }
            with open(path, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
        except Exception:
            pass
