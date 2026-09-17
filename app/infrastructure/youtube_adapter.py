import os
import json
import logging
import urllib.request
from typing import List, Optional, Tuple
import requests
from http.cookiejar import MozillaCookieJar
from youtube_transcript_api import YouTubeTranscriptApi
from app.domain.models import SubtitleSnippet
from app.domain.exceptions import TranscriptNotFoundException
from app.application.interfaces import ITranscriptService

logger = logging.getLogger(__name__)


class YouTubeTranscriptAdapter(ITranscriptService):
    """Adapter to fetch YouTube metadata and captions using youtube_transcript_api and oEmbed."""

    def __init__(self, user_agent: Optional[str] = None):
        self.user_agent = user_agent or (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
            "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        self.proxy = os.getenv("YOUTUBE_PROXY")
        self.cookie_file = os.getenv("YOUTUBE_COOKIE_FILE")
        if not self.cookie_file or not os.path.isfile(self.cookie_file):
            for candidate in ["/app/data/cookies.txt", "/app/cookies.txt", "data/cookies.txt", "cookies.txt"]:
                if os.path.isfile(candidate):
                    self.cookie_file = candidate
                    break
        if self.cookie_file and os.path.isfile(self.cookie_file):
            logger.info(f"YouTubeTranscriptAdapter initialized with cookie file: {self.cookie_file}")
        if self.proxy:
            logger.info("YouTubeTranscriptAdapter initialized with configured proxy.")

    def _get_api(self) -> YouTubeTranscriptApi:
        session = requests.Session()
        session.headers.update({"User-Agent": self.user_agent})

        proxy = os.getenv("YOUTUBE_PROXY") or self.proxy
        if proxy:
            session.proxies = {"http": proxy, "https": proxy}
            safe_proxy = proxy.split("@")[-1] if "@" in proxy else proxy
            logger.info(f"YouTube requests routing via proxy: {safe_proxy}")

        # Check candidate locations dynamically if cookie file was copied after start
        active_cookie = self.cookie_file
        if not active_cookie or not os.path.isfile(active_cookie):
            for candidate in ["/app/data/cookies.txt", "/app/cookies.txt", "data/cookies.txt", "cookies.txt"]:
                if os.path.isfile(candidate):
                    active_cookie = candidate
                    self.cookie_file = candidate
                    break

        if active_cookie and os.path.isfile(active_cookie):
            try:
                jar = MozillaCookieJar()
                jar.load(active_cookie, ignore_discard=True, ignore_expires=True)
                session.cookies = jar
                logger.info(f"Successfully loaded {len(jar)} cookies from {active_cookie} into session")
            except Exception as err:
                logger.warning(f"Could not load cookies from {active_cookie}: {err}")

        return YouTubeTranscriptApi(http_client=session)

    def fetch_transcripts(
        self,
        video_id: str,
        source_lang: Optional[str] = "auto",
        target_lang: Optional[str] = "vi",
    ) -> Tuple[str, List[SubtitleSnippet], Optional[List[SubtitleSnippet]], str]:
        title = self._fetch_video_title(video_id)
        source_snippets, detected_source_lang = self._fetch_source_transcript(
            video_id, source_lang
        )
        target_snippets = self._fetch_target_transcript(
            video_id, target_lang, detected_source_lang
        )
        return title, source_snippets, target_snippets, detected_source_lang

    def get_available_languages(self, video_id: str) -> dict:
        """Returns available subtitle tracks and detected source language for a video."""
        try:
            api = self._get_api()
            transcript_list = api.list(video_id)
            tracks = []
            detected_lang = "en"
            first_track = None

            for t in transcript_list:
                if first_track is None:
                    first_track = t
                if not t.is_generated and detected_lang == "en":
                    detected_lang = t.language_code.split("-")[0].lower()

                tracks.append(
                    {
                        "code": t.language_code,
                        "name": t.language,
                        "is_generated": t.is_generated,
                        "is_translatable": t.is_translatable,
                    }
                )

            if first_track and detected_lang == "en":
                first_code = first_track.language_code.split("-")[0].lower()
                if first_code != "en":
                    detected_lang = first_code

            return {
                "video_id": video_id,
                "detected_source_lang": detected_lang,
                "tracks": tracks,
            }
        except Exception as e:
            return {
                "video_id": video_id,
                "detected_source_lang": "en",
                "tracks": [],
                "error": str(e),
            }

    def _fetch_video_title(self, video_id: str) -> str:
        """Fetch video title using YouTube oEmbed endpoint without needing an API key."""
        oembed_url = (
            f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={video_id}&format=json"
        )
        try:
            proxy = os.getenv("YOUTUBE_PROXY") or self.proxy
            proxies = {"http": proxy, "https": proxy} if proxy else None
            resp = requests.get(
                oembed_url,
                headers={"User-Agent": self.user_agent},
                proxies=proxies,
                timeout=5,
            )
            if resp.status_code == 200:
                data = resp.json()
                return data.get("title", f"YouTube Video ({video_id})")
        except Exception as e:
            logger.warning(f"Could not fetch video title for {video_id}: {e}")
        return f"YouTube Video ({video_id})"

    def _fetch_source_transcript(
        self, video_id: str, source_lang: Optional[str] = "auto"
    ) -> Tuple[List[SubtitleSnippet], str]:
        """Fetch source transcript (manual preferred, or auto-generated, or translated)."""
        src = (source_lang or "auto").strip().lower()
        try:
            api = self._get_api()
            transcript_list = api.list(video_id)
            selected_t = None

            if src == "auto":
                # 1. Prefer manual transcript
                for t in transcript_list:
                    if not t.is_generated:
                        selected_t = t
                        break
                # 2. Fall back to first available transcript (often auto-generated)
                if not selected_t:
                    for t in transcript_list:
                        selected_t = t
                        break
            else:
                # Specific language requested
                candidates = [
                    t
                    for t in transcript_list
                    if t.language_code.lower() == src
                    or t.language_code.lower().startswith(f"{src}-")
                ]
                if candidates:
                    # Prefer manual transcript if available
                    selected_t = next(
                        (t for t in candidates if not t.is_generated), candidates[0]
                    )
                else:
                    # Try translating any translatable transcript to src
                    for t in transcript_list:
                        if t.is_translatable:
                            try:
                                selected_t = t.translate(src)
                                break
                            except Exception:
                                pass

            if not selected_t:
                selected_t = next(iter(transcript_list))

            detected_lang = selected_t.language_code.split("-")[0].lower()
            raw_data = selected_t.fetch()
            snippets = [
                SubtitleSnippet(
                    text=item.text,
                    start=float(item.start),
                    duration=float(item.duration),
                )
                for item in raw_data
                if item.text and item.text.strip()
            ]
            return snippets, detected_lang
        except Exception as e:
            raise TranscriptNotFoundException(
                f"Không thể tải phụ đề cho video {video_id}: {str(e)}"
            )

    def _fetch_target_transcript(
        self,
        video_id: str,
        target_lang: Optional[str],
        detected_source_lang: str,
    ) -> Optional[List[SubtitleSnippet]]:
        """Fetch target translation transcript from YouTube if available."""
        tgt = (target_lang or "").strip().lower()
        if not tgt or tgt == "none" or tgt == detected_source_lang:
            return None

        try:
            api = self._get_api()
            transcript_list = api.list(video_id)

            # 1. Try finding native transcript for target_lang
            target_t = None
            for t in transcript_list:
                if t.language_code.lower() == tgt or t.language_code.lower().startswith(f"{tgt}-"):
                    target_t = t
                    break

            # 2. Try translating from detected source transcript
            if not target_t:
                for t in transcript_list:
                    if (
                        t.language_code.lower() == detected_source_lang
                        or t.language_code.lower().startswith(f"{detected_source_lang}-")
                    ) and t.is_translatable:
                        try:
                            target_t = t.translate(tgt)
                            break
                        except Exception:
                            pass

            # 3. Try translating from any translatable transcript
            if not target_t:
                for t in transcript_list:
                    if t.is_translatable:
                        try:
                            target_t = t.translate(tgt)
                            break
                        except Exception:
                            pass

            if target_t:
                raw_data = target_t.fetch()
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
