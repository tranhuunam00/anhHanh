"""Unit tests for Edge-TTS Neural Speech Synthesis and API Endpoints."""
import pytest
from httpx import AsyncClient, ASGITransport
from server import app

from app.infrastructure.edge_tts_service import (
    format_edge_rate,
    format_edge_pitch,
    resolve_edge_voice,
    generate_edge_tts_stream,
    clean_tts_text,
    SUPPORTED_EDGE_VOICES,
    DEFAULT_EDGE_VOICE,
)


# =========================================================================
# 1. Tests for format_edge_rate
# =========================================================================
def test_format_edge_rate_standard_inputs():
    """Verify conversion of standard speed multipliers to Edge-TTS percentage strings."""
    assert format_edge_rate(1.0) == "+0%"
    assert format_edge_rate("1.0") == "+0%"
    assert format_edge_rate(0.8) == "-20%"
    assert format_edge_rate("0.8") == "-20%"
    assert format_edge_rate(1.25) == "+25%"
    assert format_edge_rate(1.5) == "+50%"


def test_format_edge_rate_boundaries_and_clamping():
    """Verify rate bounds are clamped between 0.5x (-50%) and 2.0x (+100%)."""
    # Below min boundary 0.5
    assert format_edge_rate(0.2) == "-50%"
    assert format_edge_rate(-1.0) == "-50%"
    # Above max boundary 2.0
    assert format_edge_rate(3.5) == "+100%"
    assert format_edge_rate(10.0) == "+100%"


def test_format_edge_rate_invalid_and_empty_inputs():
    """Verify fallback to +0% when rate is None, empty string, or invalid type."""
    assert format_edge_rate(None) == "+0%"
    assert format_edge_rate("") == "+0%"
    assert format_edge_rate("invalid") == "+0%"
    assert format_edge_rate([]) == "+0%"


# =========================================================================
# 2. Tests for format_edge_pitch
# =========================================================================
def test_format_edge_pitch_named_presets():
    """Verify named intonation presets translate to corresponding Hz shifts."""
    assert format_edge_pitch("standard") == "+0Hz"
    assert format_edge_pitch("chuẩn") == "+0Hz"
    assert format_edge_pitch("deep") == "-15Hz"
    assert format_edge_pitch("trầm ấm") == "-15Hz"
    assert format_edge_pitch("energetic") == "+15Hz"
    assert format_edge_pitch("trẻ trung") == "+15Hz"
    assert format_edge_pitch("indian_style") == "+10Hz"


def test_format_edge_pitch_explicit_units_and_numeric():
    """Verify explicit Hz/percent strings and numeric multiplier values."""
    assert format_edge_pitch("+12Hz") == "+12Hz"
    assert format_edge_pitch("-8Hz") == "-8Hz"
    assert format_edge_pitch("+10%") == "+10%"

    # Numeric ratio modulation
    assert format_edge_pitch(1.2) == "+10Hz"
    assert format_edge_pitch(0.8) == "-10Hz"


def test_format_edge_pitch_empty_and_fallback():
    """Verify fallback to +0Hz on null or unrecognized non-numeric inputs."""
    assert format_edge_pitch(None) == "+0Hz"
    assert format_edge_pitch("") == "+0Hz"
    assert format_edge_pitch("unknown_style") == "+0Hz"


# =========================================================================
# 3. Tests for resolve_edge_voice
# =========================================================================
def test_resolve_edge_voice_valid_voice_id():
    """Verify explicitly provided valid voice IDs are preserved directly."""
    assert resolve_edge_voice("en-US-JennyNeural") == "en-US-JennyNeural"
    assert resolve_edge_voice("en-GB-SoniaNeural") == "en-GB-SoniaNeural"
    assert resolve_edge_voice("en-IN-NeerjaNeural") == "en-IN-NeerjaNeural"
    assert resolve_edge_voice("en-AU-NatashaNeural") == "en-AU-NatashaNeural"


def test_resolve_edge_voice_fallback_by_accent():
    """Verify voice resolution by accent code when voice ID is missing or unknown."""
    assert resolve_edge_voice(None, accent="en-GB") == "en-GB-SoniaNeural"
    assert resolve_edge_voice("invalid_voice", accent="en-IN") == "en-IN-NeerjaNeural"
    assert resolve_edge_voice(None, accent="en-AU") == "en-AU-NatashaNeural"


def test_resolve_edge_voice_default_fallback():
    """Verify fallback to DEFAULT_EDGE_VOICE (Jenny) on completely unknown input."""
    assert resolve_edge_voice(None, None) == DEFAULT_EDGE_VOICE
    assert resolve_edge_voice("non_existent_voice", "non_existent_accent") == DEFAULT_EDGE_VOICE


def test_clean_tts_text_strips_underscores_and_symbols():
    """Verify clean_tts_text completely strips ASCII and Unicode underscores and line symbols."""
    assert clean_tts_text("____________________") == ""
    assert clean_tts_text("＿＿＿＿＿＿＿＿＿＿") == ""
    assert clean_tts_text("Hello ___ world") == "Hello world"
    assert clean_tts_text("Hello _ world") == "Hello world"
    assert clean_tts_text("Fill in [Q1] ________ with the word.") == "Fill in Q1 with the word."
    assert clean_tts_text("*** Title ***") == "Title"
    assert clean_tts_text(None) == ""
    assert clean_tts_text("") == ""


# =========================================================================
# 4. Tests for generate_edge_tts_stream
# =========================================================================
@pytest.mark.asyncio
async def test_generate_edge_tts_stream_empty_text():
    """Verify empty or whitespace-only text yields no chunks safely."""
    chunks = []
    async for chunk in generate_edge_tts_stream("   "):
        chunks.append(chunk)
    assert len(chunks) == 0

    chunks_none = []
    async for chunk in generate_edge_tts_stream(""):
        chunks_none.append(chunk)
    assert len(chunks_none) == 0


@pytest.mark.asyncio
async def test_generate_edge_tts_stream_valid_audio():
    """Verify actual generation yields non-empty audio byte chunks."""
    chunks = []
    async for chunk in generate_edge_tts_stream(
        text="Hello, this is an automated unit test.",
        voice="en-US-JennyNeural",
        rate="+0%",
        pitch="+0Hz",
    ):
        chunks.append(chunk)

    assert len(chunks) > 0
    total_bytes = sum(len(c) for c in chunks)
    assert total_bytes > 500


# =========================================================================
# 5. Tests for API Router Endpoints (/api/tts)
# =========================================================================
@pytest.mark.asyncio
async def test_api_tts_voices_list():
    """Verify /api/tts/voices returns metadata for all supported Edge Neural voices."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/tts/voices")
        assert resp.status_code == 200
        data = resp.json()
        assert isinstance(data, list)
        assert len(data) >= len(SUPPORTED_EDGE_VOICES)
        ids = [v["id"] for v in data]
        assert "en-US-JennyNeural" in ids
        assert "en-GB-SoniaNeural" in ids
        assert "en-IN-NeerjaNeural" in ids


@pytest.mark.asyncio
async def test_api_tts_stream_success():
    """Verify /api/tts/stream returns streaming MP3 audio with 200 status."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get(
            "/api/tts/stream",
            params={
                "text": "The cold air mass reached Hanoi on Monday morning.",
                "voice": "en-US-JennyNeural",
                "rate": "1.0",
                "pitch": "standard",
            },
        )
        assert resp.status_code == 200
        assert "audio/mpeg" in resp.headers.get("content-type", "")
        content = resp.content
        assert len(content) > 1000


@pytest.mark.asyncio
async def test_api_tts_stream_empty_text_error():
    """Verify /api/tts/stream rejects empty text with 400 or 422 error."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get(
            "/api/tts/stream",
            params={"text": "   "},
        )
        assert resp.status_code in (400, 422)
