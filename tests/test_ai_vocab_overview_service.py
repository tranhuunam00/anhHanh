"""Unit tests for AI Word Overview Service & Google Overview Endpoint.
Follows AGENTS.md Rule 6:
1. Input Coverage
2. Output Verification
3. Internal Logic Coverage
4. Error & Exception Handling
"""
import json
import pytest
from unittest.mock import patch, AsyncMock, MagicMock
from app.infrastructure.ai_vocab_overview_service import (
    build_fallback_word_overview,
    fetch_google_ai_word_overview,
    clear_overview_cache,
    get_gemini_api_key,
)


def test_build_fallback_word_overview_inputs_and_outputs():
    """Test fallback generator with various word morphology inputs."""
    # 1. Word ending in -ly
    adv = build_fallback_word_overview("inadvertently")
    assert adv["word"] == "inadvertently"
    assert "inadvertent" in adv["etymology"][0]
    assert "-ly" in adv["etymology"][0]
    assert "google_search_url" in adv
    assert "inadvertently" in adv["google_search_url"]

    # 2. Word ending in -tion
    noun = build_fallback_word_overview("dedication")
    assert "-tion" in noun["etymology"][0]

    # 3. Word ending in -able
    adj = build_fallback_word_overview("sustainable")
    assert "-able" in adj["etymology"][0]

    # 4. Standard word
    std = build_fallback_word_overview("observe")
    assert std["word"] == "observe"
    assert len(std["examples"]) >= 1

    # 5. Error handling: empty or whitespace
    with pytest.raises(ValueError, match="Word cannot be empty"):
        build_fallback_word_overview("")

    with pytest.raises(ValueError, match="Word cannot be empty"):
        build_fallback_word_overview("   ")


@pytest.mark.asyncio
async def test_fetch_google_ai_word_overview_cached():
    """Verify caching logic avoids repeated API calls."""
    clear_overview_cache()
    # First call without API key returns fallback and caches it
    with patch("app.infrastructure.ai_vocab_overview_service.get_gemini_api_key", return_value=""):
        res1 = await fetch_google_ai_word_overview("dummy")
        assert res1["word"] == "dummy"
        assert res1["is_ai_generated"] is False

        # Second call returns from cache
        res2 = await fetch_google_ai_word_overview("dummy")
        assert res2 is res1


@pytest.mark.asyncio
async def test_fetch_google_ai_word_overview_gemini_success():
    """Verify Gemini AI integration and structured parsing."""
    clear_overview_cache()
    mock_payload = {
        "word": "inadvertently",
        "phonetic": "/ˌɪn.ədˈvɜː.tənt.li/",
        "part_of_speech": "trạng từ (adverb)",
        "overview": "Inadvertently là trạng từ có nghĩa là vô tình, không cố ý.",
        "examples": [{"en": "She inadvertently deleted the file.", "vi": "Cô ấy vô tình xóa tệp tin."}],
        "etymology": ["Hình thành từ inadvertent + -ly."],
        "word_family": [{"word": "inadvertent", "pos": "adj", "meaning": "vô tình"}]
    }

    mock_payload_str = f"```json\n{json.dumps(mock_payload)}\n```"
    mock_resp = MagicMock()
    mock_resp.status_code = 200
    mock_resp.json.return_value = {
        "candidates": [
            {
                "content": {
                    "parts": [{"text": mock_payload_str}]
                }
            }
        ]
    }

    mock_client = AsyncMock()
    mock_client.post.return_value = mock_resp

    with patch("app.infrastructure.ai_vocab_overview_service.get_gemini_api_key", return_value="test_key"), \
         patch("app.infrastructure.ai_vocab_overview_service.get_candidate_gemini_models", return_value=["gemini-2.5-flash"]):
        result = await fetch_google_ai_word_overview("inadvertently", client=mock_client)
        assert result["word"] == "inadvertently"
        assert result["phonetic"] == "/ˌɪn.ədˈvɜː.tənt.li/"
        assert result["is_ai_generated"] is True
        assert "google_search_url" in result


@pytest.mark.asyncio
async def test_fetch_google_ai_word_overview_gemini_failure_fallback():
    """Verify robust fallback when Gemini API fails."""
    clear_overview_cache()
    mock_client = AsyncMock()
    mock_client.post.side_effect = Exception("Network timeout")

    with patch("app.infrastructure.ai_vocab_overview_service.get_gemini_api_key", return_value="test_key"), \
         patch("app.infrastructure.ai_vocab_overview_service.get_candidate_gemini_models", return_value=["gemini-2.5-flash"]):
        result = await fetch_google_ai_word_overview("resilience", client=mock_client)
        assert result["word"] == "resilience"
        assert result["is_ai_generated"] is False


from fastapi.testclient import TestClient
from server import app

client = TestClient(app)


def test_google_overview_api_endpoint():
    """Test GET /api/vocab/google-overview endpoint."""
    with patch("app.infrastructure.ai_vocab_overview_service.get_gemini_api_key", return_value=""):
        resp = client.get("/api/vocab/google-overview?word=inadvertently")
        assert resp.status_code == 200
        data = resp.json()
        assert data["word"] == "inadvertently"
        assert "google_search_url" in data
        assert "etymology" in data

    # Bad request on empty word
    resp_bad = client.get("/api/vocab/google-overview?word=")
    assert resp_bad.status_code in (400, 422)
