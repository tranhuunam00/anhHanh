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
