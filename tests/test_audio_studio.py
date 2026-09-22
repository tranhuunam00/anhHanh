"""Unit tests for Audio & Phonology Studio (Speech-to-Text & Connected Speech Engine)."""
import pytest
from app.infrastructure.phonology_engine import PhonologyEngine
from app.infrastructure.groq_whisper_service import GroqWhisperService
from server import app
from httpx import AsyncClient, ASGITransport


@pytest.fixture
def engine():
    return PhonologyEngine()


def test_cv_linking_detection(engine):
    """Test Consonant-to-Vowel linking detection (pick it up)."""
    res = engine.analyze_sentence("I picked it up yesterday.")
    phenomena_types = [p["type"] for p in res["phenomena"]]
    assert "CV_LINKING" in phenomena_types
    # Check that 'picked it' or 'it up' is linked
    linked_pairs = [p["pair"] for p in res["phenomena"] if p["type"] == "CV_LINKING"]
    assert any("it + up" in pair.lower() or "picked + it" in pair.lower() for pair in linked_pairs)


def test_vv_glides_detection(engine):
    """Test Vowel-to-Vowel glides /w/ and /j/."""
    res_w = engine.analyze_sentence("We need to go out now.")
    phenomena_w = [p["type"] for p in res_w["phenomena"]]
    assert "VV_GLIDE_W" in phenomena_w

    res_j = engine.analyze_sentence("I can see it clearly.")
    phenomena_j = [p["type"] for p in res_j["phenomena"]]
    assert "VV_GLIDE_J" in phenomena_j


def test_elision_detection(engine):
    """Test Elision (deletion of /t, d/ between consonants)."""
    res = engine.analyze_sentence("He arrived last night at the party.")
    phenomena = [p["type"] for p in res["phenomena"]]
    assert "ELISION_TD" in phenomena
    elision_pair = next(p for p in res["phenomena"] if p["type"] == "ELISION_TD")
    assert "last" in elision_pair["pair"].lower() and "night" in elision_pair["pair"].lower()


def test_assimilation_detection(engine):
    """Test Coalescent Assimilation (/t, d/ + /j/ -> /tʃ, dʒ/)."""
    res_d = engine.analyze_sentence("Did you find what you need?")
    phenomena = [p["type"] for p in res_d["phenomena"]]
    assert "ASSIMILATION_DJ" in phenomena or "ASSIMILATION_CH" in phenomena


def test_weak_forms_flagged(engine):
    """Test weak forms reduction for function words."""
    res = engine.analyze_sentence("I can go to the store for some food.")
    weak_tokens = [t["word"].lower() for t in res["tokens"] if t.get("is_weak_form")]
    assert "can" in weak_tokens
    assert "to" in weak_tokens
    assert "for" in weak_tokens


def test_groq_whisper_configured():
    """Test GroqWhisperService config detection."""
    service = GroqWhisperService(api_key="gsk_test1234567890")
    assert service.is_configured() is True
    assert service.api_key == "gsk_test1234567890"

    empty_service = GroqWhisperService(api_key="")
    assert empty_service.is_configured() is False


@pytest.mark.asyncio
async def test_samples_endpoint():
    """Test GET /api/audio-studio/samples returns curated phonology samples."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/audio-studio/samples")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 3
        assert "text" in data[0]
        assert "highlight" in data[0]


@pytest.mark.asyncio
async def test_analyze_text_endpoint():
    """Test POST /api/audio-studio/analyze-text endpoint."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post(
            "/api/audio-studio/analyze-text",
            json={"text": "I picked it up and want you to see it."}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "breakdown" in data
        assert len(data["breakdown"]["phenomena"]) > 0
