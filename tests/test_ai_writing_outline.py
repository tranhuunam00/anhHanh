"""Unit tests for AI Writing Outline Generator and Service.
Covers 4 mandatory testing dimensions:
1. Input Coverage (happy path, empty, none, boundary, weird types)
2. Output Verification (exact return types, properties, array structures, text formats)
3. Internal Logic Coverage (branches: task2 vs task1/email/paragraph/free, fallbacks)
4. Error & Exception Handling (missing api key, HTTP exceptions, unexpected errors)
"""

import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from app.infrastructure.ai_writing_outline_generator import (
    build_outline_system_prompt,
    normalize_outline_result,
    generate_outline_impl,
)
from app.infrastructure.ai_writing_service import AIWritingService


class TestBuildOutlineSystemPrompt:
    """Tests for build_outline_system_prompt function."""

    def test_happy_path_task2(self):
        """Happy path: IELTS Task 2 prompt generation."""
        topic = "Some people think that university education should be free for all students."
        prompt = build_outline_system_prompt(
            topic=topic,
            genre="ielts_task2",
            sub_type="opinion",
            language="en",
            target_band=7.5
        )
        assert isinstance(prompt, str)
        assert topic in prompt
        assert "ielts_task2" in prompt
        assert "opinion" in prompt
        assert "7.5" in prompt
        assert "main_idea" in prompt
        assert "supporting" in prompt
        assert "example" in prompt
        assert "100% BẰNG TIẾNG VIỆT" in prompt

    def test_branch_task1(self):
        """Branch coverage: IELTS Task 1 prompt rules."""
        prompt = build_outline_system_prompt(
            topic="The chart below shows energy consumption in 2020.",
            genre="ielts_task1",
            sub_type="line_graph",
            language="ja",
            target_band=6.5
        )
        assert "IELTS Task 1" in prompt
        assert "Overview" in prompt

    def test_branch_email_and_other_genres(self):
        """Branch coverage: Business Email and paragraph."""
        email_prompt = build_outline_system_prompt(
            topic="Request project deadline extension",
            genre="email",
            sub_type=None,
            language="zh",
            target_band=7.0
        )
        assert "Business Email" in email_prompt

    def test_input_edge_cases(self):
        """Edge cases: empty strings, unknown language fallback."""
        prompt = build_outline_system_prompt(
            topic="",
            genre="unknown_genre",
            sub_type="",
            language="unsupported_lang",
            target_band=0.0
        )
        assert isinstance(prompt, str)
        assert "TIẾNG VIỆT" in prompt


class TestNormalizeOutlineResult:
    """Tests for normalize_outline_result function."""

    def test_happy_path_full_data(self):
        """Happy path: fully populated outline object."""
        raw = {
            "title": "Dàn bài chi tiết Agree / Disagree",
            "description": "Định hướng phân tích hai khía cạnh",
            "sections": [
                {
                    "id": "intro",
                    "name": "1. Mở bài",
                    "wordTarget": "40 từ",
                    "components": [{"label": "Paraphrase", "guide": "Dẫn dắt", "content": "Sample"}]
                },
                {
                    "id": "body1",
                    "name": "2. Thân bài 1",
                    "wordTarget": "90 từ",
                    "main_idea": "Luận điểm 1",
                    "supporting": "Luận cứ 1",
                    "example": "Ví dụ 1"
                }
            ],
            "language_note": "Ghi chú ngữ pháp",
            "high_score_tips": ["Tip 1", "Tip 2"]
        }
        res = normalize_outline_result(raw, genre="ielts_task2", sub_type="opinion", language="en")
        assert res["success"] is True
        assert res["title"] == "Dàn bài chi tiết Agree / Disagree"
        assert len(res["sections"]) == 2
        assert res["sections"][1]["main_idea"] == "Luận điểm 1"
        assert res["sections"][1]["supporting"] == "Luận cứ 1"
        assert res["sections"][1]["example"] == "Ví dụ 1"
        assert res["language_note"] == "Ghi chú ngữ pháp"
        assert len(res["high_score_tips"]) == 2

    def test_fallback_when_empty_or_invalid(self):
        """Internal logic fallback: empty or invalid dictionary."""
        res = normalize_outline_result({}, genre="ielts_task2", sub_type="discussion", language="ja")
        assert res["success"] is True
        assert res["genre"] == "ielts_task2"
        assert res["sub_type"] == "discussion"
        assert len(res["sections"]) == 4  # Fallback generates intro, body1, body2, conclusion
        section_ids = [s["id"] for s in res["sections"]]
        assert section_ids == ["intro", "body1", "body2", "conclusion"]
        assert len(res["high_score_tips"]) >= 3

    def test_non_dict_input(self):
        """Input coverage: string or None passed instead of dict."""
        res_none = normalize_outline_result(None)
        assert res_none["success"] is True
        assert isinstance(res_none["sections"], list)

        res_str = normalize_outline_result("invalid string json")
        assert res_str["success"] is True
        assert isinstance(res_str["sections"], list)


class TestGenerateOutlineImpl:
    """Tests for generate_outline_impl function."""

    @pytest.mark.asyncio
    async def test_missing_api_key_raises_runtime_error(self):
        """Error handling: missing api key raises RuntimeError."""
        with pytest.raises(RuntimeError, match="GEMINI_API_KEY chưa được cấu hình"):
            await generate_outline_impl(
                topic="Sample topic",
                api_key=None
            )

        with pytest.raises(RuntimeError, match="GEMINI_API_KEY chưa được cấu hình"):
            await generate_outline_impl(
                topic="Sample topic",
                api_key=""
            )

    @pytest.mark.asyncio
    async def test_mocked_successful_generation(self):
        """Happy path: Mocked Gemini API call returning valid outline JSON."""
        mock_payload = {
            "candidates": [
                {
                    "content": {
                        "parts": [
                            {
                                "text": '```json\n{"title": "Dàn bài AI", "sections": [{"id": "intro", "name": "Mở bài"}]}\n```'
                            }
                        ]
                    }
                }
            ]
        }
        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = mock_payload

        with patch("httpx.AsyncClient.post", new_callable=AsyncMock) as mock_post:
            mock_post.return_value = mock_resp
            result = await generate_outline_impl(
                topic="Artificial Intelligence in Education",
                genre="ielts_task2",
                sub_type="opinion",
                language="en",
                target_band=7.5,
                api_key="mock_key_123"
            )
            assert result["success"] is True
            assert result["title"] == "Dàn bài AI"
            assert len(result["sections"]) == 1

    @pytest.mark.asyncio
    async def test_all_models_fail_raises_runtime_error(self):
        """Error handling: All model attempts fail."""
        mock_resp = MagicMock()
        mock_resp.status_code = 500
        mock_resp.text = "Internal Server Error"

        with patch("httpx.AsyncClient.post", new_callable=AsyncMock) as mock_post:
            mock_post.return_value = mock_resp
            with pytest.raises(RuntimeError, match="Không thể tạo dàn bài AI"):
                await generate_outline_impl(
                    topic="Test topic",
                    api_key="mock_key_123"
                )


class TestAIWritingServiceOutlineIntegration:
    """Tests for AIWritingService.generate_outline facade method."""

    @pytest.mark.asyncio
    async def test_facade_delegates_to_impl(self):
        """Output verification: Facade successfully wraps generate_outline_impl."""
        expected = {"success": True, "title": "Facade Outline", "sections": []}
        with patch("app.infrastructure.ai_writing_service.get_gemini_api_key", return_value="test_key"):
            with patch("app.infrastructure.ai_writing_service.generate_outline_impl", new_callable=AsyncMock) as mock_impl:
                mock_impl.return_value = expected
                res = await AIWritingService.generate_outline(
                    topic="Test topic",
                    genre="ielts_task2",
                    sub_type="discussion",
                    language="en",
                    target_band=8.0
                )
                assert res == expected
                mock_impl.assert_called_once_with(
                    topic="Test topic",
                    genre="ielts_task2",
                    sub_type="discussion",
                    language="en",
                    target_band=8.0,
                    api_key="test_key"
                )
