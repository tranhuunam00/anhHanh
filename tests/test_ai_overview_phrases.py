"""Tests for phrase-aware Google AI word overview (AGENTS.md Rule 6):
is_multi_word_phrase, extract_phrase_key_words, normalize_key_words, build_overview_prompt,
plus key_words wiring in fallback and AI paths."""
import json
import pytest
from unittest.mock import AsyncMock, MagicMock, patch

from app.infrastructure.ai_vocab_overview_service import (
    MAX_KEY_WORDS,
    build_fallback_word_overview,
    build_overview_prompt,
    clear_overview_cache,
    extract_phrase_key_words,
    fetch_google_ai_word_overview,
    is_multi_word_phrase,
    normalize_key_words,
)

SVC = "app.infrastructure.ai_vocab_overview_service"
FIELDS = {"word", "pos", "phonetic", "meaning", "example_en", "example_vi"}


# ---------- is_multi_word_phrase ----------

@pytest.mark.parametrize("text,expected", [
    ("reward", False), ("  reward  ", False), ("well-known", False),
    ("burial ground", True), ("tend to have much higher representation", True), ("a  b", True),
    ("", False), ("   ", False), (None, False), (42, False), (["a", "b"], False),
])
def test_is_multi_word_phrase(text, expected):
    assert is_multi_word_phrase(text) is expected


# ---------- extract_phrase_key_words ----------

def test_extract_drops_stopwords_keeps_order():
    assert extract_phrase_key_words("tend to have much higher representation") == ["tend", "higher", "representation"]


def test_extract_limit_keeps_longest_in_original_order():
    assert extract_phrase_key_words("specifying poorly defined reward", limit=2) == ["specifying", "defined"]
    assert len(extract_phrase_key_words("alpha bravo charlie delta echoes foxtrot")) == MAX_KEY_WORDS


def test_extract_strips_punctuation_dedupes_and_skips_short_or_numeric():
    assert extract_phrase_key_words('"Reward, reward!" in 2024 ok go') == ["Reward"]


@pytest.mark.parametrize("bad", ["reward", "", "   ", None, 7, "the of to"])
def test_extract_returns_empty_for_single_word_or_bad_input(bad):
    assert extract_phrase_key_words(bad) == []


def test_extract_non_positive_limit():
    assert extract_phrase_key_words("poorly defined reward", limit=0) == []
    assert extract_phrase_key_words("poorly defined reward", limit=-1) == []


# ---------- normalize_key_words ----------

def test_normalize_cleans_valid_items():
    raw = [{"word": " reward ", "meaning": "phần thưởng", "pos": None, "extra": "x"}]
    out = normalize_key_words(raw, "poorly defined reward")
    assert out == [{"word": "reward", "pos": "", "phonetic": "", "meaning": "phần thưởng", "example_en": "", "example_vi": ""}]


def test_normalize_skips_invalid_items_and_caps_length():
    raw = ["str", None, {"word": ""}, {"meaning": "no word"}] + [{"word": f"w{i}"} for i in range(10)]
    out = normalize_key_words(raw, "a phrase here")
    assert [k["word"] for k in out] == ["w0", "w1", "w2", "w3"]
    assert all(set(k) == FIELDS for k in out)


def test_normalize_falls_back_to_heuristic_for_phrase():
    for raw in (None, [], "bad", [{"word": ""}]):
        out = normalize_key_words(raw, "poorly defined reward")
        assert [k["word"] for k in out] == ["poorly", "defined", "reward"]
        assert all(k["meaning"] == "" and set(k) == FIELDS for k in out)


def test_normalize_single_word_without_ai_items_is_empty():
    assert normalize_key_words(None, "reward") == []
    assert normalize_key_words(None, "") == []
    assert normalize_key_words(None, None) == []


# ---------- build_overview_prompt ----------

def test_prompt_single_word_has_no_phrase_section():
    p = build_overview_prompt("reward")
    assert '"reward"' in p
    assert "key_words" not in p
    assert "CỤM TỪ" not in p


def test_prompt_phrase_requests_key_words_with_examples():
    p = build_overview_prompt("tend to have much higher representation")
    assert "CỤM TỪ" in p
    assert '"key_words"' in p
    assert "example_en" in p and "example_vi" in p
    assert f"2-{MAX_KEY_WORDS}" in p
    assert "{{" not in p  # f-string braces fully resolved


def test_prompt_schema_is_valid_json_shape():
    p = build_overview_prompt("poorly defined reward")
    schema = p[p.index("{\n"):].replace("/.../", "x").replace("...", "x")
    parsed = json.loads(schema)
    assert parsed["word"] == "poorly defined reward"
    assert set(parsed["key_words"][0]) == FIELDS


@pytest.mark.parametrize("bad", ["", "   ", None])
def test_prompt_rejects_empty(bad):
    with pytest.raises(ValueError):
        build_overview_prompt(bad)


# ---------- wiring ----------

def test_fallback_includes_key_words_for_phrases_only():
    assert [k["word"] for k in build_fallback_word_overview("poorly defined reward")["key_words"]] == ["poorly", "defined", "reward"]
    assert build_fallback_word_overview("reward")["key_words"] == []


@pytest.mark.asyncio
async def test_ai_result_gets_normalized_key_words():
    clear_overview_cache()
    ai_json = {"word": "poorly defined reward", "overview": "phần thưởng được định nghĩa kém",
               "key_words": [{"word": "reward", "meaning": "phần thưởng", "example_en": "A big reward.", "example_vi": "Phần thưởng lớn."}, "junk"]}
    resp = MagicMock()
    resp.status_code = 200
    resp.json.return_value = {"candidates": [{"content": {"parts": [{"text": json.dumps(ai_json)}]}}]}
    client = AsyncMock()
    client.post.return_value = resp
    with patch(f"{SVC}.get_gemini_api_key", return_value="k"), \
         patch(f"{SVC}.get_candidate_gemini_models", return_value=["gemini-2.5-flash"]):
        out = await fetch_google_ai_word_overview("poorly defined reward", client=client)
    assert out["is_ai_generated"] is True
    assert out["key_words"] == [{"word": "reward", "pos": "", "phonetic": "", "meaning": "phần thưởng",
                                 "example_en": "A big reward.", "example_vi": "Phần thưởng lớn."}]
    sent_prompt = client.post.call_args.kwargs["json"]["contents"][0]["parts"][0]["text"]
    assert "key_words" in sent_prompt
