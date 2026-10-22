"""Unit tests for AI Vocabulary Storytelling Service (AIVocabExerciseService).
Strictly adheres to Project Guideline 6 (Input, Output, Internal Logic, Error/Exception).
"""
import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from app.infrastructure.ai_vocab_exercise_service import (
    AIVocabExerciseService,
    build_fallback_story,
    get_gemini_api_key,
)


def test_build_fallback_story_structure():
    """Verify fallback story returns full valid structure with questions and translations."""
    sample_words = [
        {"word": "inevitable", "meaning": "không thể tránh khỏi"},
        {"word": "sustainable", "meaning": "bền vững"},
        {"word": "resilient", "meaning": "kiên cường"},
    ]

    result = build_fallback_story(sample_words)
    assert isinstance(result, dict)
    assert "title" in result and len(result["title"]) > 0
    assert "story_en" in result and "inevitable" in result["story_en"]
    assert "story_vi" in result
    assert isinstance(result["target_words"], list)
    assert len(result["target_words"]) == 3
    assert isinstance(result["cloze_questions"], list)
    assert len(result["cloze_questions"]) == 3
    assert "comprehension_question" in result
    assert "correct_answer" in result["comprehension_question"]


def test_build_fallback_story_empty_input():
    """Verify fallback story handles empty or malformed input smoothly."""
    result = build_fallback_story([])
    assert isinstance(result, dict)
    assert "title" in result
    assert "story_en" in result
    assert len(result["cloze_questions"]) == 0


@pytest.mark.asyncio
async def test_generate_vocab_story_empty_words_raises_value_error():
    """Verify generate_vocab_story raises ValueError when words list is empty."""
    with pytest.raises(ValueError, match="Danh sách từ vựng không được để trống"):
        await AIVocabExerciseService.generate_vocab_story([])

    with pytest.raises(ValueError, match="Danh sách từ vựng không được để trống"):
        await AIVocabExerciseService.generate_vocab_story([{"invalid": "data"}, {}])


@pytest.mark.asyncio
async def test_generate_vocab_story_no_api_key_uses_fallback(monkeypatch):
    """Verify generate_vocab_story falls back cleanly if GEMINI_API_KEY is not set."""
    monkeypatch.setenv("GEMINI_API_KEY", "")
    words = [{"word": "perseverance", "meaning": "sự kiên trì"}]

    result = await AIVocabExerciseService.generate_vocab_story(words)
    assert isinstance(result, dict)
    assert "title" in result
    assert "story_en" in result
    assert "perseverance" in result["story_en"]


@pytest.mark.asyncio
async def test_generate_vocab_story_gemini_success():
    """Verify generate_vocab_story parses Gemini response when API returns valid JSON."""
    mock_payload = {
        "title": "The Sustainable City",
        "story_en": "Building a sustainable future was an inevitable priority for the architects.",
        "story_vi": "Xây dựng tương lai bền vững là ưu tiên không thể tránh khỏi của các kiến trúc sư.",
        "target_words": [
            {"word": "sustainable", "meaning": "bền vững", "found_in_story": True},
            {"word": "inevitable", "meaning": "không thể tránh khỏi", "found_in_story": True}
        ],
        "cloze_questions": [
            {
                "sentence": "Building a [ ______ ] future was essential.",
                "correct_word": "sustainable",
                "options": ["sustainable", "fragile", "expensive", "temporary"],
                "hint": "bền vững"
            }
        ],
        "comprehension_question": {
            "question": "What was the main priority of the architects?",
            "options": ["A sustainable future", "Cutting corners", "Demolishing parks", "Building roads"],
            "correct_answer": "A sustainable future"
        }
    }

    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "candidates": [
            {
                "content": {
                    "parts": [{"text": f"```json\n{import_json(mock_payload)}\n```"}]
                }
            }
        ]
    }

    with patch("app.infrastructure.ai_vocab_exercise_service.get_gemini_api_key", return_value="fake_key"):
        with patch("httpx.AsyncClient.post", new_callable=AsyncMock) as mock_post:
            mock_post.return_value = mock_response
            result = await AIVocabExerciseService.generate_vocab_story(
                words=[{"word": "sustainable"}, {"word": "inevitable"}]
            )
            assert result["title"] == "The Sustainable City"
            assert len(result["cloze_questions"]) == 1


def import_json(data):
    import json
    return json.dumps(data)
