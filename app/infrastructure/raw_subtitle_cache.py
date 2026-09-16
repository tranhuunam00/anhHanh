"""File-based cache for raw subtitle snippets.

Caches the raw YouTube transcript data (before any grouping/processing).
This allows:
  - Avoiding repeated YouTube API calls for the same video/language
  - Running updated grouping logic fresh against cached raw subtitles
  - Persisting across server restarts (unlike in-memory lesson cache)
"""
import json
import os
from typing import Optional, List, Tuple
from app.domain.models import SubtitleSnippet


class RawSubtitleFileCache:
    """Stores raw subtitle snippets as JSON files per (video_id, lang) pair."""

    def __init__(self, cache_dir: str = "data/cache/raw"):
        self.cache_dir = cache_dir
        os.makedirs(self.cache_dir, exist_ok=True)

    def _path(self, video_id: str, lang: str) -> str:
        safe_vid = "".join(c for c in video_id if c.isalnum() or c in "-_")
        safe_lang = "".join(c for c in lang if c.isalnum() or c in "-_")
        return os.path.join(self.cache_dir, f"{safe_vid}_{safe_lang}.json")

    def get(
        self, video_id: str, lang: str
    ) -> Optional[Tuple[str, List[SubtitleSnippet]]]:
        """Return (title, snippets) if cached, else None."""
        path = self._path(video_id, lang)
        if not os.path.isfile(path):
            return None
        try:
            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)
            snippets = [
                SubtitleSnippet(
                    text=s["text"],
                    start=s["start"],
                    duration=s["duration"],
                )
                for s in data.get("snippets", [])
            ]
            return data.get("title", ""), snippets
        except Exception:
            return None

    def save(
        self,
        video_id: str,
        lang: str,
        title: str,
        snippets: List[SubtitleSnippet],
    ) -> None:
        """Persist raw snippets to disk."""
        path = self._path(video_id, lang)
        try:
            data = {
                "video_id": video_id,
                "lang": lang,
                "title": title,
                "snippets": [
                    {"text": s.text, "start": s.start, "duration": s.duration}
                    for s in snippets
                ],
            }
            with open(path, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
        except Exception:
            pass
