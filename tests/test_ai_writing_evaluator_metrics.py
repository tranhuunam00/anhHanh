"""Unit tests for AI writing evaluator metrics and sentence reconciliation integration."""
import pytest
import json
from unittest.mock import patch, MagicMock
from app.infrastructure.ai_writing_evaluator import evaluate_writing_impl


@pytest.mark.asyncio
async def test_evaluate_writing_impl_under_length_warning():
    """Verify that when a submission is under minimum required words,
    the returned payload contains is_under_length=True and informative warning.
    """
    sample_text = (
        "The pie charts show the figure of Australian household energy use and Greenhouse gas emissions. "
        "Overall, heating is the primary source."
    )
    mock_gemini_payload = {
        "overall_score": 5.5,
        "max_score": 9.0,
        "summary_review": "Bài viết chưa đủ số lượng từ tối thiểu.",
        "criteria_scores": {
            "task_response": {"score": 5.0, "feedback": "Under-length penalty"},
            "coherence_cohesion": {"score": 6.0, "feedback": "Good"},
            "lexical_resource": {"score": 6.0, "feedback": "Good"},
            "grammatical_range_accuracy": {"score": 6.0, "feedback": "Good"}
        },
        "corrections": [],
        "sentence_breakdown": [
            {
                "sentence_num": 1,
                "original": "The pie charts show the figure of Australian household energy use and Greenhouse gas emissions.",
                "is_grammar_correct": True,
                "grammar_analysis": "Chính xác",
                "grammar_fix": "The pie charts show the figure of Australian household energy use and Greenhouse gas emissions.",
                "upgrade_needed": False,
                "upgraded_sentence": "The pie charts show the figure of Australian household energy use and Greenhouse gas emissions.",
                "upgrade_notes": "Tốt"
            }
        ],
        "model_essay": " ".join(["word"] * 180),
        "vocab_upgrades": []
    }

    mock_resp = MagicMock()
    mock_resp.status_code = 200
    mock_resp.json.return_value = {
        "candidates": [{
            "content": {
                "parts": [{"text": json.dumps(mock_gemini_payload)}]
            }
        }]
    }

    with patch("httpx.AsyncClient.post", return_value=mock_resp):
        res = await evaluate_writing_impl(
            topic="Test Topic",
            content=sample_text,
            genre="ielts_task1",
            target_band=7.0,
            api_key="fake-test-key",
            scoring_only=False
        )

        assert res["is_under_length"] is True
        assert res["min_required_words"] == 150
        assert res["student_word_count"] == 21
        assert "under_length_message" in res
        assert "150 từ" in res["under_length_message"]
        assert res["model_essay_word_count"] == 180
        # Reconcile backfilled sentence 2
        assert len(res["sentence_breakdown"]) == 2
        assert res["sentence_breakdown"][1]["sentence_num"] == 2
