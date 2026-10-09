"""Edge-TTS High-Fidelity Neural Speech Synthesis Service."""
import logging
from typing import Optional, AsyncGenerator, Dict, Any
import edge_tts

logger = logging.getLogger(__name__)

SUPPORTED_EDGE_VOICES: Dict[str, Dict[str, Any]] = {
    # US English
    "en-US-JennyNeural": {
        "name": "Jenny",
        "accent": "en-US",
        "gender": "Female",
        "label": "Jenny • Mỹ (Nữ chuẩn)",
    },
    "en-US-GuyNeural": {
        "name": "Guy",
        "accent": "en-US",
        "gender": "Male",
        "label": "Guy • Mỹ (Nam chuẩn)",
    },
    "en-US-AriaNeural": {
        "name": "Aria",
        "accent": "en-US",
        "gender": "Female",
        "label": "Aria • Mỹ (Nữ truyền cảm)",
    },
    "en-US-ChristopherNeural": {
        "name": "Christopher",
        "accent": "en-US",
        "gender": "Male",
        "label": "Christopher • Mỹ (Nam truyền cảm)",
    },
    # UK English
    "en-GB-SoniaNeural": {
        "name": "Sonia",
        "accent": "en-GB",
        "gender": "Female",
        "label": "Sonia • Anh (Nữ chuẩn London)",
    },
    "en-GB-RyanNeural": {
        "name": "Ryan",
        "accent": "en-GB",
        "gender": "Male",
        "label": "Ryan • Anh (Nam chuẩn London)",
    },
    "en-GB-LibbyNeural": {
        "name": "Libby",
        "accent": "en-GB",
        "gender": "Female",
        "label": "Libby • Anh (Nữ tự nhiên)",
    },
    # AU English
    "en-AU-NatashaNeural": {
        "name": "Natasha",
        "accent": "en-AU",
        "gender": "Female",
        "label": "Natasha • Úc (Nữ chuẩn)",
    },
    "en-AU-WilliamNeural": {
        "name": "William",
        "accent": "en-AU",
        "gender": "Male",
        "label": "William • Úc (Nam chuẩn)",
    },
    # IN English
    "en-IN-NeerjaNeural": {
        "name": "Neerja",
        "accent": "en-IN",
        "gender": "Female",
        "label": "Neerja • Ấn Độ (Nữ chuẩn)",
    },
    "en-IN-PrabhatNeural": {
        "name": "Prabhat",
        "accent": "en-IN",
        "gender": "Male",
        "label": "Prabhat • Ấn Độ (Nam chuẩn)",
    },
    # Vietnamese
    "vi-VN-HoaiMyNeural": {
        "name": "HoaiMy",
        "accent": "vi-VN",
        "gender": "Female",
        "label": "Hoài My • Việt Nam (Nữ)",
    },
    "vi-VN-NamMinhNeural": {
        "name": "NamMinh",
        "accent": "vi-VN",
        "gender": "Male",
        "label": "Nam Minh • Việt Nam (Nam)",
    },
}

DEFAULT_EDGE_VOICE = "en-US-JennyNeural"


def format_edge_rate(rate: Any) -> str:
    """Format speed rate into Edge-TTS percentage string (e.g. 1.0 -> '+0%', 0.8 -> '-20%', 1.25 -> '+25%')."""
    if rate is None:
        return "+0%"
    try:
        val = float(rate)
    except (ValueError, TypeError):
        return "+0%"

    # Clamp bounds to safe playback range [0.5x, 2.0x]
    val = max(0.5, min(2.0, val))
    diff_percent = round((val - 1.0) * 100)
    if diff_percent >= 0:
        return f"+{diff_percent}%"
    return f"{diff_percent}%"


def format_edge_pitch(pitch: Any) -> str:
    """Format pitch/intonation into Edge-TTS Hz string."""
    if not pitch:
        return "+0Hz"
    if isinstance(pitch, str):
        p_lower = pitch.strip().lower()
        if p_lower in ("standard", "normal", "chuẩn"):
            return "+0Hz"
        if p_lower in ("deep", "trầm ấm"):
            return "-15Hz"
        if p_lower in ("energetic", "trẻ trung"):
            return "+15Hz"
        if p_lower in ("indian_style", "indian"):
            return "+10Hz"
        if p_lower.endswith("hz") or p_lower.endswith("%"):
            return pitch.strip()

    try:
        val = float(pitch)
        val = max(0.7, min(1.4, val))
        diff_hz = round((val - 1.0) * 50)
        if diff_hz >= 0:
            return f"+{diff_hz}Hz"
        return f"{diff_hz}Hz"
    except (ValueError, TypeError):
        return "+0Hz"


def resolve_edge_voice(voice: Optional[str], accent: Optional[str] = None) -> str:
    """Resolve and validate an Edge-TTS voice identifier with intelligent fallbacks."""
    if voice and voice in SUPPORTED_EDGE_VOICES:
        return voice

    if accent:
        acc = accent.strip().lower()
        for v_id, meta in SUPPORTED_EDGE_VOICES.items():
            if meta["accent"].lower() == acc:
                return v_id

    return DEFAULT_EDGE_VOICE


async def generate_edge_tts_stream(
    text: str,
    voice: str = DEFAULT_EDGE_VOICE,
    rate: str = "+0%",
    pitch: str = "+0Hz",
) -> AsyncGenerator[bytes, None]:
    """Generate audio chunks stream from Microsoft Edge Neural TTS."""
    cleaned_text = (text or "").strip()
    if not cleaned_text:
        return

    cleaned_text = cleaned_text[:3000]
    resolved_voice = resolve_edge_voice(voice)

    communicate = edge_tts.Communicate(
        cleaned_text,
        resolved_voice,
        rate=rate,
        pitch=pitch,
    )

    try:
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                yield chunk["data"]
    except Exception as e:
        logger.error(f"Error streaming Edge-TTS audio: {e}", exc_info=True)
        raise
