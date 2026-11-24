"""Tests for the Google AI word-overview latency fixes (AGENTS.md Rule 6):
- is_text_generation_model: skips TTS/image/audio/embedding variants
- filter_and_prioritize_models: base model name before longer preview/variant names
- build_generation_config: thinking disabled only on 2.5 Flash
- fetch_google_ai_word_overview: attempt cap, overall deadline, per-model payload
"""
import pytest
from unittest.mock import AsyncMock, MagicMock, patch

from app.infrastructure.gemini_model_helper import (
    is_text_generation_model,
    filter_and_prioritize_models,
)
from app.infrastructure import ai_vocab_overview_service as svc
from app.infrastructure.ai_vocab_overview_service import (
    build_generation_config,
    clear_overview_cache,
    fetch_google_ai_word_overview,
)

SVC = "app.infrastructure.ai_vocab_overview_service"


# ---------- is_text_generation_model ----------

@pytest.mark.parametrize("name", [
    "gemini-2.5-flash", "gemini-2.0-flash-lite", "gemini-1.5-pro", "gemini-2.5-flash-preview-09-2025",
])
def test_text_models_accepted(name):
    assert is_text_generation_model(name) is True


@pytest.mark.parametrize("name", [
    "gemini-2.5-flash-preview-tts", "gemini-2.5-flash-image", "gemini-2.5-flash-native-audio-dialog",
    "gemini-2.0-flash-live-001", "text-embedding-004", "imagen-4.0-generate", "veo-3.0", "aqa",
    "GEMINI-2.5-FLASH-PREVIEW-TTS",
])
def test_specialised_models_rejected(name):
    assert is_text_generation_model(name) is False


@pytest.mark.parametrize("bad", ["", "   ", None, 123, ["gemini-2.5-flash"]])
def test_bad_inputs_rejected(bad):
    assert is_text_generation_model(bad) is False


# ---------- filter_and_prioritize_models ordering ----------

def _m(name):
    return {"name": f"models/{name}", "supportedGenerationMethods": ["generateContent"]}


def test_base_model_before_long_variants_and_specialised_dropped():
    raw = [_m("gemini-2.5-flash-preview-tts"), _m("gemini-2.5-flash-image-preview"),
           _m("gemini-2.5-flash-preview-09-2025"), _m("gemini-2.5-flash"), _m("gemini-2.5-pro")]
    result = filter_and_prioritize_models(raw)
    assert result[0] == "gemini-2.5-flash"
    assert result[1] == "gemini-2.5-flash-preview-09-2025"
    assert result[-1] == "gemini-2.5-pro"
    assert not any("tts" in m or "image" in m for m in result)


def test_only_specialised_models_yields_empty():
    assert filter_and_prioritize_models([_m("gemini-2.5-flash-preview-tts")]) == []


# ---------- build_generation_config ----------

def test_generation_config_disables_thinking_on_25_flash():
    cfg = build_generation_config("gemini-2.5-flash")
    assert cfg["responseMimeType"] == "application/json"
    assert cfg["temperature"] == 0.3
    assert cfg["thinkingConfig"] == {"thinkingBudget": 0}
    assert "thinkingConfig" in build_generation_config("gemini-2.5-flash-lite")


@pytest.mark.parametrize("name", ["gemini-2.5-pro", "gemini-2.0-flash", "gemini-1.5-flash", "", None])
def test_generation_config_leaves_other_models_untouched(name):
    cfg = build_generation_config(name)
    assert "thinkingConfig" not in cfg
    assert cfg == {"responseMimeType": "application/json", "temperature": 0.3}


# ---------- fetch_google_ai_word_overview latency guards ----------

def _err_resp():
    r = MagicMock()
    r.status_code = 500
    r.text = "boom"
    return r


@pytest.mark.asyncio
async def test_attempts_capped_at_max_models():
    clear_overview_cache()
    client = AsyncMock()
    client.post.return_value = _err_resp()
    models = [f"gemini-2.5-flash-{i}" for i in range(6)]
    with patch(f"{SVC}.get_gemini_api_key", return_value="k"), \
         patch(f"{SVC}.get_candidate_gemini_models", return_value=models):
        result = await fetch_google_ai_word_overview("capped", client=client)
    assert client.post.call_count == svc.MAX_MODEL_ATTEMPTS
    assert result["is_ai_generated"] is False


@pytest.mark.asyncio
async def test_each_call_gets_bounded_timeout_and_model_specific_payload():
    clear_overview_cache()
    client = AsyncMock()
    client.post.return_value = _err_resp()
    with patch(f"{SVC}.get_gemini_api_key", return_value="k"), \
         patch(f"{SVC}.get_candidate_gemini_models", return_value=["gemini-2.5-flash", "gemini-2.0-flash"]):
        await fetch_google_ai_word_overview("bounded", client=client)
    first, second = client.post.call_args_list
    assert 0 < first.kwargs["timeout"] <= svc.PER_MODEL_TIMEOUT_SECONDS
    assert "thinkingConfig" in first.kwargs["json"]["generationConfig"]
    assert "thinkingConfig" not in second.kwargs["json"]["generationConfig"]


@pytest.mark.asyncio
async def test_overall_deadline_stops_further_attempts():
    clear_overview_cache()
    client = AsyncMock()
    client.post.return_value = _err_resp()
    # Clock: start=0 -> deadline 25; first check at 0 (ok), second at 30 (past deadline).
    clock = iter([0.0, 0.0, 30.0, 30.0])
    with patch(f"{SVC}.get_gemini_api_key", return_value="k"), \
         patch(f"{SVC}.get_candidate_gemini_models", return_value=["a-flash", "b-flash", "c-flash"]), \
         patch(f"{SVC}.time.monotonic", side_effect=lambda: next(clock)):
        result = await fetch_google_ai_word_overview("deadline", client=client)
    assert client.post.call_count == 1
    assert result["is_ai_generated"] is False
    assert result["word"] == "deadline"
