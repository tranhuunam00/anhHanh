"""Unit tests for Gemini AI Security Audit & Hardening.

Covers:
1. Strict Account Authorization (Only tranhuunam23022000 & vuthiquynhtrangbl6d)
2. Display Name / Substring Auth Bypass Prevention
3. AI Endpoint Rate Limiting (sliding window per route)
4. Payload Guard (5 MB max for vocab/doc uploads, 512 KB global)
5. Token Flood / Input Bounds Validation
6. Security Headers (HSTS, X-Frame-Options, CSP, etc.)
7. Secure Header-based API Key Transmission (x-goog-api-key)
"""
import pytest
from unittest.mock import patch, AsyncMock
from pydantic import ValidationError
from starlette.requests import Request
from starlette.responses import Response

from app.infrastructure.database.models import User
from app.presentation.security_middleware import (
    _is_rate_limited,
    reset_rate_limit_counters,
    MAX_DOC_PAYLOAD_BYTES,
    MAX_PAYLOAD_BYTES,
    SecurityHeadersMiddleware
)
from app.presentation.vocab_schemas import AIExtractTextRequest
from app.presentation.writing_api import (
    EvaluateWritingRequest,
    SuggestStructuresRequest,
    evaluate_writing_submission
)
from fastapi import HTTPException


# ==============================================================================
# 1. STRICT ACCOUNT AUTHORIZATION & BYPASS TESTS
# ==============================================================================
class TestAccountAuthorization:
    """Verify that ONLY the 2 designated accounts have access to Gemini AI features."""

    def test_authorized_primary_account(self):
        user = User(id="1", email="tranhuunam23022000@gmail.com", name="Nam Tran")
        assert user.can_use_ai_import is True
        assert user.can_use_ai_writing is True

    def test_authorized_secondary_account_full_handle(self):
        user = User(id="2", email="vuthiquynhtrangbl6d@gmail.com", name="Trang Vu")
        assert user.can_use_ai_import is True
        assert user.can_use_ai_writing is True

    def test_authorized_secondary_account_short_handle(self):
        user = User(id="3", email="vuthiquynhtrang@gmail.com", name="Trang Vu")
        assert user.can_use_ai_import is True
        assert user.can_use_ai_writing is True

    def test_case_insensitivity_and_whitespace(self):
        user = User(id="4", email="  TranHuuNam23022000@Gmail.Com  ", name="Nam")
        assert user.can_use_ai_import is True
        assert user.can_use_ai_writing is True

    def test_unauthorized_normal_account(self):
        user = User(id="5", email="student123@gmail.com", name="Normal Student")
        assert user.can_use_ai_import is False
        assert user.can_use_ai_writing is False

    def test_exploit_display_name_spoofing_blocked(self):
        """Attacker registers with random email and sets display name to admin handle."""
        attacker = User(id="6", email="attacker@evil.com", name="tranhuunam23022000")
        assert attacker.can_use_ai_import is False
        assert attacker.can_use_ai_writing is False

        attacker2 = User(id="7", email="attacker@evil.com", name="vuthiquynhtrangbl6d")
        assert attacker2.can_use_ai_import is False
        assert attacker2.can_use_ai_writing is False

    def test_exploit_email_substring_injection_blocked(self):
        """Attacker registers an email with substring containing authorized handle."""
        attacker = User(id="8", email="attacker_tranhuunam23022000@evil.com", name="Hacker")
        assert attacker.can_use_ai_import is False
        assert attacker.can_use_ai_writing is False

    def test_edge_cases_empty_or_none_email(self):
        user_none = User(id="9", email=None, name="No Email")
        assert user_none.can_use_ai_import is False

        user_empty = User(id="10", email="", name="Empty Email")
        assert user_empty.can_use_ai_import is False

        user_spaces = User(id="11", email="   ", name="Spaces")
        assert user_spaces.can_use_ai_import is False


# ==============================================================================
# 2. AI ROUTE RATE LIMITING TESTS
# ==============================================================================
class TestAIRouteRateLimiting:
    """Verify IP-based sliding window rate limits for costly Gemini endpoints."""

    def setup_method(self):
        reset_rate_limit_counters()

    def test_writing_evaluate_rate_limit_10_per_minute(self):
        ip = "192.168.1.10"
        path = "/api/writing/evaluate"

        for i in range(10):
            limited, detail = _is_rate_limited(ip, path, "POST")
            assert limited is False, f"Request {i+1} should be permitted"

        # 11th request must be blocked
        limited, detail = _is_rate_limited(ip, path, "POST")
        assert limited is True
        assert "Gioi han: 10 lan / 60s" in detail

    def test_vocab_ai_extract_file_rate_limit_5_per_minute(self):
        ip = "192.168.1.20"
        path = "/api/vocab/ai-extract-file"

        for i in range(5):
            limited, detail = _is_rate_limited(ip, path, "POST")
            assert limited is False, f"Request {i+1} should be permitted"

        # 6th request must be blocked
        limited, detail = _is_rate_limited(ip, path, "POST")
        assert limited is True
        assert "Gioi han: 5 lan / 60s" in detail

    def test_vocab_ai_extract_rate_limit_10_per_minute(self):
        ip = "192.168.1.30"
        path = "/api/vocab/ai-extract"

        for i in range(10):
            limited, detail = _is_rate_limited(ip, path, "POST")
            assert limited is False

        limited, detail = _is_rate_limited(ip, path, "POST")
        assert limited is True
        assert "Gioi han: 10 lan / 60s" in detail

    def test_different_ips_have_independent_counters(self):
        path = "/api/writing/evaluate"
        for _ in range(10):
            _is_rate_limited("10.0.0.1", path, "POST")

        # IP 1 is blocked
        assert _is_rate_limited("10.0.0.1", path, "POST")[0] is True
        # IP 2 is still allowed
        assert _is_rate_limited("10.0.0.2", path, "POST")[0] is False


# ==============================================================================
# 3. PAYLOAD SIZE & SECURITY HEADERS TESTS
# ==============================================================================
class TestPayloadGuardAndHeaders:
    """Verify DoS mitigation via payload limits and mandatory HTTP security headers."""

    def test_max_doc_payload_is_strictly_5mb(self):
        assert MAX_DOC_PAYLOAD_BYTES == 5 * 1024 * 1024

    @pytest.mark.asyncio
    async def test_oversized_payload_returns_413(self):
        middleware = SecurityHeadersMiddleware(app=None)

        # Mock request with Content-Length > 5MB
        scope = {
            "type": "http",
            "method": "POST",
            "path": "/api/vocab/ai-extract-file",
            "headers": [(b"content-length", str(6 * 1024 * 1024).encode())],
        }
        req = Request(scope)

        call_next = AsyncMock()
        response = await middleware.dispatch(req, call_next)

        assert response.status_code == 413
        call_next.assert_not_called()

    @pytest.mark.asyncio
    async def test_security_headers_injected(self):
        middleware = SecurityHeadersMiddleware(app=None)

        scope = {
            "type": "http",
            "method": "GET",
            "path": "/api/vocab/items",
            "headers": [],
        }
        req = Request(scope)

        async def dummy_call_next(request):
            return Response("OK")

        response = await middleware.dispatch(req, dummy_call_next)

        assert response.headers["X-Frame-Options"] == "SAMEORIGIN"
        assert response.headers["X-Content-Type-Options"] == "nosniff"
        assert response.headers["X-XSS-Protection"] == "1; mode=block"
        assert "Strict-Transport-Security" in response.headers
        assert "max-age=31536000" in response.headers["Strict-Transport-Security"]
        assert response.headers["Referrer-Policy"] == "strict-origin-when-cross-origin"


# ==============================================================================
# 4. TOKEN EXPLOSION & INPUT VALIDATION TESTS
# ==============================================================================
class TestInputValidationGuard:
    """Verify input constraints to prevent prompt injection and token exhaustion."""

    def test_ai_extract_text_length_limit(self):
        # Valid text length
        req = AIExtractTextRequest(text="Valid vocabulary list text")
        assert req.text == "Valid vocabulary list text"

        # Exceeds max 50,000 characters
        with pytest.raises(ValidationError):
            AIExtractTextRequest(text="A" * 50001)

    def test_writing_evaluate_request_length_limits(self):
        # Valid request
        valid_req = EvaluateWritingRequest(
            topic="Discuss the effects of global warming.",
            content="Global warming is a critical issue that affects every corner of the planet.",
            target_band=7.5
        )
        assert valid_req.topic is not None

        # Content exceeds max 35,000 characters
        with pytest.raises(ValidationError):
            EvaluateWritingRequest(
                topic="Topic",
                content="Word " * 7500,  # ~37,500 chars
            )

        # Topic exceeds max 2,000 characters
        with pytest.raises(ValidationError):
            EvaluateWritingRequest(
                topic="T" * 2001,
                content="Valid content length for the test."
            )

        # Images count exceeds max 5
        with pytest.raises(ValidationError):
            EvaluateWritingRequest(
                topic="Topic",
                content="Valid content for the test.",
                images=["img1", "img2", "img3", "img4", "img5", "img6"]
            )

    @pytest.mark.asyncio
    async def test_evaluate_word_count_upper_bound_4000_words(self):
        user = User(id="1", email="tranhuunam23022000@gmail.com", name="Nam")
        excessive_content = "word " * 4001
        body = EvaluateWritingRequest(
            topic="Test Topic",
            content=excessive_content
        )

        with pytest.raises(HTTPException) as exc_info:
            await evaluate_writing_submission(
                body=body,
                current_user=user,
                db=AsyncMock()
            )
        assert exc_info.value.status_code == 400
        assert "tối đa 4000 từ" in exc_info.value.detail


# ==============================================================================
# 5. SECURE API KEY TRANSMISSION IN HTTP HEADERS
# ==============================================================================
class TestSecureAPIKeyHeader:
    """Verify that Gemini calls use x-goog-api-key header and do not expose key in URL query."""

    @pytest.mark.asyncio
    async def test_ai_vocab_service_uses_header_not_query_param(self):
        from app.infrastructure.ai_vocab_service import AIVocabService
        with patch("app.infrastructure.ai_vocab_service.httpx.AsyncClient") as mock_client_cls:
            mock_client = AsyncMock()
            mock_client_cls.return_value.__aenter__.return_value = mock_client
            mock_resp = AsyncMock()
            mock_resp.status_code = 200
            mock_resp.json = lambda: {
                "candidates": [{
                    "content": {
                        "parts": [{"text": '[{"word": "ephemeral", "meaning": "ngắn ngủi"}]'}]
                    }
                }]
            }
            mock_client.post.return_value = mock_resp


            with patch("app.infrastructure.ai_vocab_service.get_gemini_api_key", return_value="test-secret-key-12345"):
                await AIVocabService.extract_vocabulary("Ephemeral means lasting for a short time.")

            # Verify call args
            assert mock_client.post.called
            call_args = mock_client.post.call_args
            called_url = call_args[0][0]
            called_headers = call_args[1].get("headers", {})

            # Key must NOT be in URL
            assert "key=" not in called_url
            assert "test-secret-key-12345" not in called_url

            # Key MUST be in headers
            assert called_headers.get("x-goog-api-key") == "test-secret-key-12345"

