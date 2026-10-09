"""Comprehensive Unit Tests for Extracted AI Writing Submodules.
Covers happy paths, edge cases, boundary conditions, and error states.
"""
import pytest
from unittest.mock import patch, AsyncMock
import json

from app.infrastructure.writing_prompts_catalog import (
    CURATED_PROMPTS_BY_LANG,
    CURATED_PROMPTS,
    LANGUAGES_CONFIG,
)
from app.infrastructure.ai_writing_evaluator import (
    generate_fallback_sentence_breakdown,
    evaluate_writing_impl,
)
from app.infrastructure.ai_writing_generator import (
    generate_prompt_impl,
    suggest_structures_impl,
    normalize_suggestion_item,
    normalize_suggestions,
)


def test_prompts_catalog_languages_coverage():
    """Verify all supported languages are present in catalog with required genres."""
    supported_langs = ["en", "ja", "zh", "ko", "fr", "de"]
    for lang in supported_langs:
        assert lang in CURATED_PROMPTS_BY_LANG
        assert lang in LANGUAGES_CONFIG
        catalog = CURATED_PROMPTS_BY_LANG[lang]
        for genre in ["ielts_task2", "ielts_task1", "email", "paragraph", "free"]:
            assert genre in catalog
            assert len(catalog[genre]) >= 1
            for prompt_item in catalog[genre]:
                assert "id" in prompt_item
                assert "title" in prompt_item
                assert "prompt" in prompt_item
                assert "min_words" in prompt_item
                assert "recommended_time" in prompt_item


def test_fallback_sentence_breakdown_empty_and_whitespace():
    """Boundary test: fallback breakdown handles empty or whitespace-only text."""
    res_empty = generate_fallback_sentence_breakdown("", [])
    assert res_empty == []

    res_spaces = generate_fallback_sentence_breakdown("   \n\t  ", [])
    assert res_spaces == []


def test_fallback_sentence_breakdown_all_correct_sentences():
    """Happy path: clean sentences without any correction records."""
    text = "The rapid development of technology has changed education. Teachers can leverage smart software. Students benefit greatly."
    breakdown = generate_fallback_sentence_breakdown(text, [])
    assert len(breakdown) == 3
    assert breakdown[0]["sentence_num"] == 1
    assert breakdown[0]["is_grammar_correct"] is True
    assert breakdown[0]["upgrade_needed"] is False
    assert breakdown[0]["grammar_fix"] == breakdown[0]["original"]


def test_fallback_sentence_breakdown_with_grammar_corrections():
    """Logic test: matching corrections replace original erroneous phrases in sentences."""
    text = "Students is happy today. They studies very hard."
    corrections = [
        {"original": "is happy", "corrected": "are happy", "explanation": "Subject-verb agreement"},
        {"original": "studies", "corrected": "study", "explanation": "Plural subject takes base verb"}
    ]
    breakdown = generate_fallback_sentence_breakdown(text, corrections)
    assert len(breakdown) == 2
    assert breakdown[0]["is_grammar_correct"] is False
    assert breakdown[0]["upgrade_needed"] is True
    assert "are happy" in breakdown[0]["grammar_fix"]
    assert "Subject-verb agreement" in breakdown[0]["grammar_analysis"]

    assert breakdown[1]["is_grammar_correct"] is False
    assert "study" in breakdown[1]["grammar_fix"]


@pytest.mark.asyncio
async def test_generate_prompt_without_api_key_fallback():
    """Edge case: when API key is empty, cleanly falls back to curated library."""
    prompt = await generate_prompt_impl(
        genre="ielts_task1",
        language="en",
        sub_type="line_graph",
        api_key=None,
    )
    assert isinstance(prompt, dict)
    assert "prompt" in prompt
    assert prompt["sub_type"] == "line_graph"


@pytest.mark.asyncio
async def test_generate_prompt_with_api_key_mock():
    """Happy path: generates brand-new prompt through Gemini JSON response."""
    mock_gemini_res = {
        "id": "gen_t2_en_opinion",
        "title": "Artificial Intelligence in Modern Medicine",
        "prompt": "Some believe AI will replace doctors. To what extent do you agree or disagree?",
        "type": "Opinion",
        "sub_type": "opinion",
        "keywords": ["healthcare", "diagnosis", "clinical", "empathy", "algorithms"],
        "min_words": 250,
        "recommended_time": 40,
        "visual_data": None
    }

    with patch("httpx.AsyncClient.post") as mock_post:
        mock_post.return_value = AsyncMock(
            status_code=200,
            json=lambda: {
                "candidates": [{
                    "content": {
                        "parts": [{"text": json.dumps(mock_gemini_res)}]
                    }
                }]
            }
        )

        res = await generate_prompt_impl(
            genre="ielts_task2",
            topic_area="Healthcare & AI",
            language="en",
            sub_type="opinion",
            api_key="valid_key"
        )
        assert res["id"] == "gen_t2_en_opinion"
        assert "replace doctors" in res["prompt"]


@pytest.mark.asyncio
async def test_suggest_structures_missing_api_key_raises():
    """Bad case: calling suggest_structures without API key raises RuntimeError."""
    with pytest.raises(RuntimeError, match="GEMINI_API_KEY chưa được cấu hình"):
        await suggest_structures_impl(topic="Climate change", api_key="")


@pytest.mark.asyncio
async def test_suggest_structures_success_mock():
    """Happy path: suggest_structures returns structured collocations and frames."""
    mock_data = {
        "topic": "Urbanization",
        "language": "en",
        "suggestions": [
            {
                "kind": "collocation",
                "category": "intro",
                "band": "band8",
                "phrase": "exponential urbanization",
                "meaning": "đô thị hóa theo cấp số nhân",
                "template": "exponential urbanization",
                "usage": "Mở đầu bối cảnh."
            }
        ]
    }
    with patch("httpx.AsyncClient.post") as mock_post:
        mock_post.return_value = AsyncMock(
            status_code=200,
            json=lambda: {
                "candidates": [{
                    "content": {
                        "parts": [{"text": f"```json\n{json.dumps(mock_data)}\n```"}]
                    }
                }]
            }
        )

        res = await suggest_structures_impl(topic="Urbanization", api_key="dummy_key")
        assert res["topic"] == "Urbanization"
        assert len(res["suggestions"]) == 1
        assert res["suggestions"][0]["phrase"] == "exponential urbanization"


def test_normalize_suggestion_item_various_inputs():
    """Verify normalize_suggestion_item input coverage, alternative keys, and heuristics."""
    # 1. Happy path standard item
    item1 = {
        "kind": "collocation",
        "category": "intro",
        "band": "band8",
        "phrase": "rapid economic growth",
        "meaning": "tăng trưởng kinh tế nhanh chóng",
        "template": "rapid economic growth",
        "usage": "Mở đầu bối cảnh"
    }
    norm1 = normalize_suggestion_item(item1)
    assert norm1["kind"] == "collocation"
    assert norm1["category"] == "intro"
    assert norm1["band"] == "band8"
    assert norm1["phrase"] == "rapid economic growth"
    assert norm1["meaning"] == "tăng trưởng kinh tế nhanh chóng"

    # 2. Alternative keys (sentence_frame, translation, type)
    item2 = {
        "type": "structure",
        "category": "counter_argument",
        "sentence_frame": "While it is argued that [X], others believe [Y].",
        "translation": "Trong khi một số lập luận rằng [X], người khác tin rằng [Y].",
        "target_band": "Band 8.0+",
    }
    norm2 = normalize_suggestion_item(item2)
    assert norm2["kind"] == "structure"
    assert norm2["category"] == "counter"
    assert norm2["band"] == "band8"
    assert norm2["phrase"] == "While it is argued that [X], others believe [Y]."
    assert norm2["meaning"] == "Trong khi một số lập luận rằng [X], người khác tin rằng [Y]."
    assert norm2["template"] == "While it is argued that [X], others believe [Y]."

    # 3. Heuristic kind detection: brackets in phrase -> structure
    item3 = {
        "phrase": "It is widely acknowledged that [fact]",
        "vietnamese_meaning": "Điều được công nhận rộng rãi là...",
        "level": "7.5"
    }
    norm3 = normalize_suggestion_item(item3)
    assert norm3["kind"] == "structure"
    assert norm3["band"] == "band7"

    # 4. Heuristic kind detection: short phrase without brackets -> collocation
    item4 = {
        "phrase": "foster creativity",
        "meaning": "thúc đẩy sáng tạo",
        "band": "6.5"
    }
    norm4 = normalize_suggestion_item(item4)
    assert norm4["kind"] == "collocation"
    assert norm4["band"] == "band6"

    # 5. Bad cases / Boundary inputs
    assert normalize_suggestion_item(None) is None
    assert normalize_suggestion_item({}) is None
    assert normalize_suggestion_item("invalid string") is None
    assert normalize_suggestion_item({"phrase": "", "meaning": ""}) is None


def test_normalize_suggestions_container_formats():
    """Verify normalize_suggestions handles lists, dicts, grouped categories, and band defaults."""
    # Dict with 'suggestions' list
    data1 = {
        "suggestions": [
            {"phrase": "curb emissions", "meaning": "cắt giảm khí thải"},
            {"sentence_frame": "One major factor is [reason].", "translation": "Một yếu tố chính là..."}
        ]
    }
    res1 = normalize_suggestions(data1, target_band=8.0)
    assert len(res1) == 2
    assert res1[0]["kind"] == "collocation"
    assert res1[0]["band"] == "band8"
    assert res1[1]["kind"] == "structure"
    assert res1[1]["band"] == "band8"

    # Dict with category grouped lists
    data2 = {
        "intro": [{"phrase": "pave the way for", "meaning": "mở đường cho"}],
        "conclusion": [{"sentence_frame": "In conclusion, [summary]", "meaning": "Tóm lại..."}]
    }
    res2 = normalize_suggestions(data2, target_band=6.5)
    assert len(res2) == 2
    assert res2[0]["category"] == "intro"
    assert res2[0]["band"] == "band6"
    assert res2[1]["category"] == "conclusion"

    # Empty and invalid containers
    assert normalize_suggestions([]) == []
    assert normalize_suggestions({}) == []
    assert normalize_suggestions(None) == []


@pytest.mark.asyncio
async def test_suggest_structures_legacy_gemini_format_normalized():
    """Verify suggest_structures_impl normalizes non-standard keys from Gemini."""
    legacy_mock = {
        "topic": "Renewable energy",
        "suggestions": [
            {
                "type": "collocation",
                "expression": "fossil fuel depletion",
                "vietnamese": "sự cạn kiệt nhiên liệu hóa thạch",
                "level": "8.0",
                "category": "body"
            },
            {
                "sentence_frame": "There is every reason to believe that [view].",
                "meaning_vi": "Có mọi lý do để tin rằng...",
                "band": "7.5",
                "category": "intro"
            }
        ]
    }
    with patch("httpx.AsyncClient.post") as mock_post:
        mock_post.return_value = AsyncMock(
            status_code=200,
            json=lambda: {
                "candidates": [{
                    "content": {
                        "parts": [{"text": json.dumps(legacy_mock)}]
                    }
                }]
            }
        )
        res = await suggest_structures_impl(topic="Renewable energy", api_key="dummy_key")
        assert len(res["suggestions"]) == 2
        assert res["suggestions"][0]["phrase"] == "fossil fuel depletion"
        assert res["suggestions"][0]["meaning"] == "sự cạn kiệt nhiên liệu hóa thạch"
        assert res["suggestions"][0]["kind"] == "collocation"
        assert res["suggestions"][0]["band"] == "band8"
        assert res["suggestions"][1]["phrase"] == "There is every reason to believe that [view]."
        assert res["suggestions"][1]["kind"] == "structure"
        assert res["suggestions"][1]["band"] == "band7"


@pytest.mark.asyncio
async def test_evaluate_writing_impl_short_content_rejected():
    """Boundary test: essays under 15 words are rejected."""
    with pytest.raises(ValueError, match="quá ngắn"):
        await evaluate_writing_impl(
            topic="Test Topic",
            content="Short essay under fifteen words here.",
            api_key="dummy_key"
        )


@pytest.mark.asyncio
async def test_evaluate_writing_impl_no_api_key_raises():
    """Bad case: valid essay length but missing API key raises RuntimeError."""
    long_essay = " ".join(["word"] * 30)
    with pytest.raises(RuntimeError, match="GEMINI_API_KEY chưa được cấu hình"):
        await evaluate_writing_impl(
            topic="Test Topic",
            content=long_essay,
            api_key=None
        )


@pytest.mark.asyncio
async def test_evaluate_writing_impl_multimodal_and_fallback_breakdown():
    """Logic test: handles multimodal images and automatically generates fallback breakdown when missing."""
    long_essay = "First sentence has error. Second sentence is perfectly correct and well composed in every way."
    mock_eval = {
        "overall_score": 7.0,
        "max_score": 9.0,
        "summary_review": "Good essay with minor mistakes.",
        "strengths": ["Clear flow"],
        "weaknesses": ["Minor tense issue"],
        "criteria_scores": {
            "task_response": {"score": 7.0, "feedback": "Good"},
            "coherence_cohesion": {"score": 7.0, "feedback": "Good"},
            "lexical_resource": {"score": 7.0, "feedback": "Good"},
            "grammatical_range_accuracy": {"score": 7.0, "feedback": "Good"}
        },
        "corrections": [{"original": "has error", "corrected": "has errors", "explanation": "Plural"}],
        "model_essay": "Band 9 model essay rewrite.",
        "vocab_upgrades": []
        # Notice: sentence_breakdown deliberately omitted to verify automatic fallback generation!
    }

    with patch("httpx.AsyncClient.post") as mock_post:
        mock_post.return_value = AsyncMock(
            status_code=200,
            json=lambda: {
                "candidates": [{
                    "content": {
                        "parts": [{"text": json.dumps(mock_eval)}]
                    }
                }]
            }
        )

        res = await evaluate_writing_impl(
            topic="Evaluate this chart",
            content=long_essay,
            genre="ielts_task1",
            images=["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="],
            api_key="valid_key"
        )

        assert res["overall_score"] == 7.0
        assert "sentence_breakdown" in res
        assert len(res["sentence_breakdown"]) >= 1
        assert res["sentence_breakdown"][0]["is_grammar_correct"] is False
