"""Groq Whisper-large-v3 Audio Transcription Service.
Provides ultra-fast Speech-to-Text with sentence segments and word-level timestamps.
"""
import os
import io
import logging
from typing import Dict, Any, List, Optional
import httpx

logger = logging.getLogger(__name__)

GROQ_TRANSCRIPTION_URL = "https://api.groq.com/openai/v1/audio/transcriptions"


class GroqWhisperService:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key

    def get_api_key(self) -> str:
        key = self.api_key or os.getenv("GROQ_API_KEY", "")
        return key.strip() if key else ""

    def is_configured(self) -> bool:
        key = self.get_api_key()
        return bool(key and key.startswith("gsk_"))

    async def transcribe(
        self,
        audio_bytes: bytes,
        filename: str = "audio.mp3",
        language: str = "en",
        prompt: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Transcribes audio using Groq Whisper-large-v3.
        Returns parsed segments with start/end timestamps and word-level timings.
        """
        api_key = self.get_api_key()
        if not self.is_configured():
            raise ValueError(
                "GROQ_API_KEY chưa được cấu hình hoặc không hợp lệ. "
                "Vui lòng kiểm tra lại file .env!"
            )

        headers = {
            "Authorization": f"Bearer {api_key}",
        }

        # Content type determination based on extension
        ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else "mp3"
        content_type = {
            "mp3": "audio/mpeg",
            "wav": "audio/wav",
            "m4a": "audio/m4a",
            "ogg": "audio/ogg",
            "webm": "audio/webm",
            "flac": "audio/flac",
        }.get(ext, "audio/mpeg")

        files = {
            "file": (filename, audio_bytes, content_type)
        }

        data = {
            "model": "whisper-large-v3",
            "response_format": "verbose_json",
            "timestamp_granularities[]": ["segment", "word"],
            "language": language or "en",
        }
        if prompt:
            data["prompt"] = prompt

        try:
            async with httpx.AsyncClient(timeout=90.0) as client:
                response = await client.post(
                    GROQ_TRANSCRIPTION_URL,
                    headers=headers,
                    files=files,
                    data=data,
                )

                if response.status_code != 200:
                    error_text = response.text
                    logger.error(f"Groq Whisper API error [{response.status_code}]: {error_text}")
                    raise RuntimeError(f"Groq API Error ({response.status_code}): {error_text}")

                res_json = response.json()
                return self._normalize_transcription_result(res_json)
        except httpx.TimeoutException:
            raise TimeoutError("Quá thời gian chờ phản hồi từ Groq Whisper API (Timeout 90s).")
        except Exception as e:
            logger.error(f"Exception during Groq transcription: {str(e)}")
            raise

    def _normalize_transcription_result(self, raw: Dict[str, Any]) -> Dict[str, Any]:
        """Formats the raw verbose_json output into clean normalized structures."""
        duration = float(raw.get("duration", 0.0))
        full_text = raw.get("text", "").strip()

        raw_segments = raw.get("segments", [])
        raw_words = raw.get("words", [])

        segments: List[Dict[str, Any]] = []
        for i, seg in enumerate(raw_segments):
            start = round(float(seg.get("start", 0.0)), 2)
            end = round(float(seg.get("end", 0.0)), 2)
            text = seg.get("text", "").strip()

            # Filter out empty or whitespace segments
            if not text:
                continue

            # Associated words within this segment
            seg_words = [
                {
                    "word": w.get("word", "").strip(),
                    "start": round(float(w.get("start", 0.0)), 2),
                    "end": round(float(w.get("end", 0.0)), 2),
                }
                for w in raw_words
                if w.get("start") is not None and start <= float(w.get("start")) <= end + 0.1
            ]

            segments.append({
                "id": i + 1,
                "position": i + 1,
                "start": start,
                "end": end,
                "duration": round(max(0.0, end - start), 2),
                "text": text,
                "words": seg_words,
            })

        return {
            "duration": duration,
            "full_text": full_text,
            "total_sentences": len(segments),
            "segments": segments,
        }
