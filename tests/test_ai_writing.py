import pytest
from unittest.mock import patch, AsyncMock
from app.infrastructure.database.models import User, WritingSubmission
from app.application.auth_service import is_ai_writing_allowed
from app.infrastructure.ai_writing_service import AIWritingService, CURATED_PROMPTS


def test_ai_writing_access_control():
    """Verify strictly only tranhuunam23022000 & vuthiquynhtrangbl6d can use AI writing."""
    user1 = User(email="tranhuunam23022000@gmail.com", name="Tran Huu Nam", role="ADMIN")
    user2 = User(email="vuthiquynhtrangbl6d@gmail.com", name="Quynh Trang", role="USER")
    user3 = User(email="vuthiquynhtrang@gmail.com", name="Trang", role="USER")
    unauthorized_user = User(email="student123@gmail.com", name="Nguyen Van A", role="USER")

    assert is_ai_writing_allowed(user1) is True
    assert is_ai_writing_allowed(user2) is True
    assert is_ai_writing_allowed(user3) is True
    assert is_ai_writing_allowed(unauthorized_user) is False
    assert unauthorized_user.can_use_ai_writing is False


def test_prompts_library_content():
    """Verify prompt library contains all required genres and high-quality prompt templates."""
    library = AIWritingService.get_prompts_library()
    assert "ielts_task2" in library
    assert "ielts_task1" in library
    assert "email" in library
    assert "paragraph" in library
    assert "free" in library

    t2 = library["ielts_task2"]
    assert len(t2) >= 3
    assert all("min_words" in p and "prompt" in p and "keywords" in p for p in t2)


@pytest.mark.asyncio
async def test_evaluate_writing_short_content_error():
    """Verify evaluation rejects essays that are too short to be assessed."""
    with pytest.raises(ValueError, match="quá ngắn"):
        await AIWritingService.evaluate_writing(
            topic="Test Topic",
            content="Too short essay only five words here.",
            genre="ielts_task2"
        )


@pytest.mark.asyncio
async def test_evaluate_writing_success_mock():
    """Verify evaluate_writing correctly formats prompt and returns structured evaluation."""
    mock_response = {
        "overall_score": 7.5,
        "max_score": 9.0,
        "summary_review": "Bài viết có lập luận mạch lạc, ý tứ phong phú và vốn từ tốt.",
        "strengths": ["Lập luận chặt chẽ", "Từ vựng học thuật đa dạng"],
        "weaknesses": ["Một vài lỗi mạo từ nhỏ"],
        "criteria_scores": {
            "task_response": {"score": 7.5, "feedback": "Đạt yêu cầu"},
            "coherence_cohesion": {"score": 7.5, "feedback": "Liên kết tốt"},
            "lexical_resource": {"score": 8.0, "feedback": "Vốn từ phong phú"},
            "grammatical_range_accuracy": {"score": 7.0, "feedback": "Kiểm soát tốt"}
        },
        "corrections": [
            {
                "original": "people is good",
                "corrected": "people are beneficial",
                "type": "grammar",
                "explanation": "People là danh từ số nhiều"
            }
        ],
        "model_essay": "This is a model essay rewritten at Band 8.5+.",
        "vocab_upgrades": [
            {
                "word": "paramount",
                "meaning": "tối quan trọng",
                "phonetic": "/ˈpær.ə.maʊnt/",
                "replace_for": "very important",
                "context_sentence": "Education is of paramount significance."
            }
        ]
    }

    with patch("app.infrastructure.ai_writing_service.get_gemini_api_key", return_value="dummy_key"), \
         patch("httpx.AsyncClient.post") as mock_post:
        
        mock_post.return_value = AsyncMock(
            status_code=200,
            json=lambda: {
                "candidates": [{
                    "content": {
                        "parts": [{
                            "text": f"```json\n{pytest.importorskip('json').dumps(mock_response)}\n```"
                        }]
                    }
                }]
            }
        )

        result = await AIWritingService.evaluate_writing(
            topic="Should homework be banned for primary students?",
            content="In recent years, the question of whether primary students should be assigned homework has sparked intense debate among educators and parents. While some argue that homework reinforces academic discipline, others believe it causes unnecessary stress and robs children of leisure time.",
            genre="ielts_task2",
            target_band=7.5
        )

        assert result["overall_score"] == 7.5
        assert len(result["corrections"]) == 1
        assert len(result["vocab_upgrades"]) == 1
        assert result["vocab_upgrades"][0]["word"] == "paramount"
