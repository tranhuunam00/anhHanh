import time
import pytest
from unittest.mock import AsyncMock, MagicMock
from app.infrastructure.gemini_model_helper import (
    DEFAULT_GEMINI_MODELS,
    get_default_candidate_models,
    filter_and_prioritize_models,
    clear_model_cache,
    discover_gemini_models,
    get_candidate_gemini_models,
)


def test_get_default_candidate_models():
    """Verify returns a new copy of DEFAULT_GEMINI_MODELS containing active flash models."""
    models = get_default_candidate_models()
    assert isinstance(models, list)
    assert "gemini-2.5-flash" in models
    assert "gemini-2.0-flash" in models
    assert "gemini-1.5-flash" in models
    # Modifying the returned list should not mutate DEFAULT_GEMINI_MODELS
    models.append("custom-model")
    assert "custom-model" not in DEFAULT_GEMINI_MODELS


def test_filter_and_prioritize_models_inputs():
    """Test input coverage: None, empty list, non-dict elements, invalid types."""
    assert filter_and_prioritize_models(None) == []
    assert filter_and_prioritize_models([]) == []
    assert filter_and_prioritize_models("invalid") == []
    assert filter_and_prioritize_models([123, None, "string"]) == []


def test_filter_and_prioritize_models_filtering_logic():
    """Test internal logic: only models supporting generateContent are kept."""
    raw = [
        {"name": "models/embedding-001", "supportedGenerationMethods": ["embedContent"]},
        {"name": "models/gemini-2.0-flash", "supportedGenerationMethods": ["generateContent", "countTokens"]},
        {"name": "models/gemini-1.5-pro", "supportedGenerationMethods": ["generateContent"]},
        {"name": "models/no-methods"},
    ]
    result = filter_and_prioritize_models(raw)
    assert "embedding-001" not in result
    assert "gemini-2.0-flash" in result
    assert "gemini-1.5-pro" in result
    # Flash should precede Pro
    assert result.index("gemini-2.0-flash") < result.index("gemini-1.5-pro")


def test_filter_and_prioritize_models_prefix_and_dedup():
    """Test models/ prefix stripping and duplicate elimination."""
    raw = [
        {"name": "models/gemini-2.5-flash", "supportedGenerationMethods": ["generateContent"]},
        {"name": "gemini-2.5-flash", "supportedGenerationMethods": ["generateContent"]},
        {"name": "models/gemini-2.0-flash", "supportedGenerationMethods": ["generateContent"]},
    ]
    result = filter_and_prioritize_models(raw)
    assert result.count("gemini-2.5-flash") == 1
    assert result[0] == "gemini-2.5-flash"
    assert result[1] == "gemini-2.0-flash"


@pytest.mark.asyncio
async def test_discover_gemini_models_empty_key():
    """Test discover_gemini_models returns empty list when API key is empty/None."""
    mock_client = AsyncMock()
    assert await discover_gemini_models("", mock_client) == []
    assert await discover_gemini_models(None, mock_client) == []


@pytest.mark.asyncio
async def test_discover_gemini_models_successful_v1beta():
    """Test discover_gemini_models caches and returns parsed models from v1beta."""
    clear_model_cache()
    mock_resp = MagicMock()
    mock_resp.status_code = 200
    mock_resp.json.return_value = {
        "models": [
            {"name": "models/gemini-2.0-flash", "supportedGenerationMethods": ["generateContent"]},
            {"name": "models/gemini-1.5-pro", "supportedGenerationMethods": ["generateContent"]}
        ]
    }
    mock_client = AsyncMock()
    mock_client.get.return_value = mock_resp

    models = await discover_gemini_models("test-api-key-123", mock_client)
    assert models == ["gemini-2.0-flash", "gemini-1.5-pro"]
    assert mock_client.get.call_count == 1

    # Second call should use in-memory cache and not call HTTP get again
    cached = await discover_gemini_models("test-api-key-123", mock_client)
    assert cached == ["gemini-2.0-flash", "gemini-1.5-pro"]
    assert mock_client.get.call_count == 1


@pytest.mark.asyncio
async def test_discover_gemini_models_v1beta_fail_v1_fallback():
    """Test discovery falls back to v1 when v1beta returns non-200."""
    clear_model_cache()
    mock_resp_v1beta = MagicMock()
    mock_resp_v1beta.status_code = 404
    mock_resp_v1beta.text = "Not Found"

    mock_resp_v1 = MagicMock()
    mock_resp_v1.status_code = 200
    mock_resp_v1.json.return_value = {
        "models": [
            {"name": "models/gemini-2.5-flash", "supportedGenerationMethods": ["generateContent"]}
        ]
    }

    mock_client = AsyncMock()
    mock_client.get.side_effect = [mock_resp_v1beta, mock_resp_v1]

    models = await discover_gemini_models("test-fallback-key", mock_client)
    assert models == ["gemini-2.5-flash"]
    assert mock_client.get.call_count == 2


@pytest.mark.asyncio
async def test_discover_gemini_models_all_fail():
    """Test discovery returns empty list and handles network exceptions cleanly."""
    clear_model_cache()
    mock_client = AsyncMock()
    mock_client.get.side_effect = Exception("Network timeout")

    models = await discover_gemini_models("test-error-key", mock_client)
    assert models == []


@pytest.mark.asyncio
async def test_get_candidate_gemini_models():
    """Test get_candidate_gemini_models returns discovered or defaults on fallback."""
    clear_model_cache()
    # Without client
    assert await get_candidate_gemini_models("my-key", None) == DEFAULT_GEMINI_MODELS

    # With client error -> falls back to defaults
    mock_client = AsyncMock()
    mock_client.get.side_effect = Exception("Conn error")
    assert await get_candidate_gemini_models("my-key", mock_client) == DEFAULT_GEMINI_MODELS

