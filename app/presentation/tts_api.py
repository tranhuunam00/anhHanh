"""Text-to-Speech (TTS) Streaming API via Microsoft Edge Neural Voices."""
import logging
from typing import Optional
from fastapi import APIRouter, Query, HTTPException
from fastapi.responses import StreamingResponse

from app.infrastructure.edge_tts_service import (
    SUPPORTED_EDGE_VOICES,
    DEFAULT_EDGE_VOICE,
    format_edge_rate,
    format_edge_pitch,
    resolve_edge_voice,
    generate_edge_tts_stream,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/tts", tags=["Text-to-Speech"])


@router.get("/voices")
def get_supported_voices():
    """List available Edge Neural TTS voices with metadata."""
    return [
        {
            "id": k,
            **v
        }
        for k, v in SUPPORTED_EDGE_VOICES.items()
    ]


@router.get("/stream")
async def stream_tts(
    text: str = Query(..., min_length=1, max_length=3000, description="Text to synthesize"),
    voice: Optional[str] = Query(None, description="Edge voice ID (e.g. en-US-JennyNeural)"),
    rate: Optional[str] = Query("1.0", description="Speed rate (e.g. 1.0, 0.8, 1.25)"),
    pitch: Optional[str] = Query("standard", description="Pitch preset or string (e.g. standard, deep, energetic)"),
):
    """Stream synthesized audio directly as MP3 chunk stream."""
    cleaned = (text or "").strip()
    if not cleaned:
        raise HTTPException(status_code=400, detail="Text cannot be empty.")

    rate_str = format_edge_rate(rate)
    pitch_str = format_edge_pitch(pitch)
    resolved_voice = resolve_edge_voice(voice)

    return StreamingResponse(
        generate_edge_tts_stream(
            text=cleaned,
            voice=resolved_voice,
            rate=rate_str,
            pitch=pitch_str,
        ),
        media_type="audio/mpeg",
        headers={
            "Cache-Control": "public, max-age=86400",
            "Content-Disposition": "inline; filename=speech.mp3",
        }
    )
