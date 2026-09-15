"""Infrastructure adapter for YouTube transcripts and metadata."""
import json
import urllib.request
from typing import List, Optional, Tuple
from youtube_transcript_api import YouTubeTranscriptApi
from app.domain.models import SubtitleSnippet
from app.domain.exceptions import TranscriptNotFoundException
from app.application.interfaces import ITranscriptService


class YouTubeTranscriptAdapter(ITranscriptService):
    """Adapter to fetch YouTube metadata and captions using youtube_transcript_api and oEmbed."""

    def __init__(self, user_agent: Optional[str] = None):
        self.user_agent = user_agent or (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
            "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )

    def fetch_transcripts(
        self, video_id: str
    ) -> Tuple[str, List[SubtitleSnippet], Optional[List[SubtitleSnippet]]]:
        title = self._fetch_video_title(video_id)
        en_snippets = self._fetch_english_transcript(video_id)
        vi_snippets = self._fetch_vietnamese_transcript(video_id)
        return title, en_snippets, vi_snippets

    def _fetch_video_title(self, video_id: str) -> str:
        """Fetch video title using YouTube oEmbed endpoint without needing an API key."""
        oembed_url = (
            f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={video_id}&format=json"
        )
        try:
            req = urllib.request.Request(
                oembed_url, headers={"User-Agent": self.user_agent}
            )
            with urllib.request.urlopen(req, timeout=5) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                return data.get("title", f"YouTube Video ({video_id})")
        except Exception:
            return f"YouTube Video ({video_id})"

    def _fetch_english_transcript(self, video_id: str) -> List[SubtitleSnippet]:
        """Fetch English transcript (manual or auto-generated)."""
        try:
            api = YouTubeTranscriptApi()
            transcript_list = api.list(video_id)

            # Try finding English transcript
            try:
                t = transcript_list.find_transcript(["en", "en-US", "en-GB"])
            except Exception:
                # If no English transcript found, try first available and translate to English
                t = next(iter(transcript_list))
                if t.language_code != "en":
                    t = t.translate("en")

            raw_data = t.fetch()
            return [
                SubtitleSnippet(
                    text=item.text,
                    start=float(item.start),
                    duration=float(item.duration),
                )
                for item in raw_data
                if item.text and item.text.strip()
            ]
        except Exception as e:
            raise TranscriptNotFoundException(
                f"Không thể tải phụ đề cho video {video_id}: {str(e)}"
            )

    def _fetch_vietnamese_transcript(
        self, video_id: str
    ) -> Optional[List[SubtitleSnippet]]:
        """Fetch Vietnamese translation transcript if available."""
        try:
            api = YouTubeTranscriptApi()
            transcript_list = api.list(video_id)

            # 1. Try finding native Vietnamese transcript
            vi_t = None
            try:
                vi_t = transcript_list.find_transcript(["vi", "vi-VN"])
            except Exception:
                pass

            # 2. If not found, try translating English (en, en-US, en-GB) to Vietnamese
            if not vi_t:
                try:
                    en_t = transcript_list.find_transcript(["en", "en-US", "en-GB"])
                    if en_t and en_t.is_translatable:
                        vi_t = en_t.translate("vi")
                except Exception:
                    pass

            # 3. If still not found, try translating any first available translatable transcript
            if not vi_t:
                try:
                    for t in transcript_list:
                        if t.is_translatable:
                            vi_t = t.translate("vi")
                            break
                except Exception:
                    pass

            if vi_t:
                raw_data = vi_t.fetch()
                return [
                    SubtitleSnippet(
                        text=item.text,
                        start=float(item.start),
                        duration=float(item.duration),
                    )
                    for item in raw_data
                    if item.text and item.text.strip()
                ]
        except Exception:
            pass
        return None
