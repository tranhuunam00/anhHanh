"""Comprehensive Unit Tests for Existing Core Functions in DailyDictation.
Covers extract_youtube_id, models to_dict/permissions, seed hash/verify,
auth_service access controls, lesson_api language validation, feedback_api sanitization,
and vocab_schemas timestamp resolution.
All tests satisfy Rule 6: Input Coverage, Output Verification, Logic Coverage, and Error Handling.
"""
import uuid
from datetime import datetime, timezone
import pytest
from fastapi import HTTPException

# 1. Application Use Cases
from app.domain.exceptions import InvalidVideoIdException
from app.application.use_cases import extract_youtube_id

# 2. Database Models
from app.infrastructure.database.models import (
    generate_uuid,
    User,
    Lesson,
    LessonSubtitle,
    UserLesson,
    UserVocabulary,
    UserStreak,
    Feedback,
    FeedbackMessage,
    DictionaryWord,
    WritingSubmission,
)

# 3. Database Seed & Password Hashing
from app.infrastructure.database.seed import hash_password, verify_password

# 4. Auth Service Permissions & Access Control
from app.application.auth_service import (
    get_google_client_id,
    is_ai_import_allowed,
    is_ai_writing_allowed,
    require_admin,
    require_ai_import_permission,
    require_ai_writing_permission,
)

# 5. Lesson API Language Code Validator
from app.presentation.lesson_api import _validate_lang

# 6. Feedback API Text Sanitizer
from app.presentation.feedback_api import sanitize_text

# 7. Vocab Schemas Effective Timestamp
from app.presentation.vocab_schemas import CreateVocabRequest


# ============================================================================
# Section 1: extract_youtube_id Unit Tests
# ============================================================================

def test_extract_youtube_id_direct_11_char():
    """Happy path: direct 11-char video ID."""
    assert extract_youtube_id("dQw4w9WgXcQ") == "dQw4w9WgXcQ"
    assert extract_youtube_id("a1B2c3D4e5F") == "a1B2c3D4e5F"
    assert extract_youtube_id("  dQw4w9WgXcQ  ") == "dQw4w9WgXcQ"


def test_extract_youtube_id_standard_urls():
    """Happy path: various standard YouTube URL patterns."""
    assert extract_youtube_id("https://www.youtube.com/watch?v=dQw4w9WgXcQ") == "dQw4w9WgXcQ"
    assert extract_youtube_id("http://youtube.com/watch?v=dQw4w9WgXcQ&t=42s") == "dQw4w9WgXcQ"
    assert extract_youtube_id("https://youtu.be/dQw4w9WgXcQ") == "dQw4w9WgXcQ"
    assert extract_youtube_id("https://www.youtube.com/embed/dQw4w9WgXcQ") == "dQw4w9WgXcQ"
    assert extract_youtube_id("https://www.youtube.com/shorts/dQw4w9WgXcQ") == "dQw4w9WgXcQ"
    assert extract_youtube_id("https://www.youtube.com/v/dQw4w9WgXcQ") == "dQw4w9WgXcQ"
    assert extract_youtube_id("https://www.youtube.com/watch?feature=shared&v=dQw4w9WgXcQ") == "dQw4w9WgXcQ"


def test_extract_youtube_id_invalid_and_error_cases():
    """Error handling: invalid URLs, short/long IDs, and empty inputs raise InvalidVideoIdException."""
    with pytest.raises(InvalidVideoIdException):
        extract_youtube_id("")

    with pytest.raises(InvalidVideoIdException):
        extract_youtube_id("   ")

    with pytest.raises(InvalidVideoIdException):
        extract_youtube_id("https://google.com")

    with pytest.raises(InvalidVideoIdException):
        extract_youtube_id("https://youtube.com/watch?other=123")

    with pytest.raises(InvalidVideoIdException):
        extract_youtube_id("short123")  # only 8 chars


# ============================================================================
# Section 2: Database Models & UUID Unit Tests
# ============================================================================

def test_generate_uuid_format():
    """Verify generate_uuid returns standard valid UUID4 string format."""
    uid = generate_uuid()
    assert isinstance(uid, str)
    assert len(uid) == 36
    # Validates parseable by uuid.UUID
    parsed = uuid.UUID(uid)
    assert str(parsed) == uid


def test_user_permissions_logic():
    """Verify User.can_use_ai_import and can_use_ai_writing logic branches."""
    # Authorized user by email handle
    user_authorized_1 = User(email="tranhuunam23022000@gmail.com", name="Nam Tran", role="USER")
    assert user_authorized_1.can_use_ai_import is True
    assert user_authorized_1.can_use_ai_writing is True

    # Authorized user by alias
    user_authorized_2 = User(email="vuthiquynhtrangbl6d@gmail.com", name="Trang Vu", role="USER")
    assert user_authorized_2.can_use_ai_import is True
    assert user_authorized_2.can_use_ai_writing is True

    # Authorized user by name contain
    user_authorized_3 = User(email="random@domain.com", name="tranhuunam23022000 user", role="USER")
    assert user_authorized_3.can_use_ai_import is True
    assert user_authorized_3.can_use_ai_writing is True

    # Regular learner
    user_regular = User(email="regular.learner@school.edu", name="Student", role="USER")
    assert user_regular.can_use_ai_import is False
    assert user_regular.can_use_ai_writing is False

    # Empty email / None email
    user_empty = User(email="", name="No Email", role="USER")
    assert user_empty.can_use_ai_import is False


def test_models_to_dict_coverage():
    """Verify to_dict methods across all core ORM models."""
    now = datetime(2026, 1, 1, 10, 0, 0, tzinfo=timezone.utc)

    # 1. User.to_dict()
    u = User(id="u-1", email="u@a.com", name="User A", role="ADMIN", created_at=now)
    u_d = u.to_dict()
    assert u_d["id"] == "u-1"
    assert u_d["email"] == "u@a.com"
    assert u_d["role"] == "ADMIN"
    assert u_d["created_at"] == now.isoformat()

    # 2. Lesson.to_dict()
    les = Lesson(
        id="l-1", video_id="vid123", youtube_url="https://youtu.be/vid123",
        title="Lesson 1", thumbnail_url="https://img.jpg", total_challenges=5, created_at=now
    )
    l_d = les.to_dict()
    assert l_d["video_id"] == "vid123"
    assert l_d["total_challenges"] == 5

    # 3. LessonSubtitle.to_dict()
    sub = LessonSubtitle(id="s-1", lesson_id="l-1", lang_code="en", fetched_at=now)
    s_d = sub.to_dict()
    assert s_d["lang_code"] == "en"
    assert s_d["lesson_id"] == "l-1"

    # 4. UserLesson.to_dict()
    ul = UserLesson(
        id="ul-1", user_id="u-1", lesson_id="l-1", source_lang="en",
        target_lang="vi", current_position=3, is_completed=True,
        started_at=now, last_studied_at=now
    )
    ul_d = ul.to_dict()
    assert ul_d["current_position"] == 3
    assert ul_d["is_completed"] is True
    assert ul_d["source_lang"] == "en"

    # 5. UserVocabulary.to_dict()
    uv = UserVocabulary(
        id="v-1", user_id="u-1", word="lucid", meaning="rõ ràng",
        context_sentence="A lucid dream.", source_lang="en", status="LEARNING",
        mastery_score=3, review_interval_days=7, created_at=now
    )
    uv_d = uv.to_dict()
    assert uv_d["word"] == "lucid"
    assert uv_d["source_lang"] == "en"
    assert uv_d["mastery_score"] == 3

    # 6. UserStreak.to_dict()
    stk = UserStreak(
        id="stk-1", user_id="u-1", current_streak=5, longest_streak=10,
        words_today=25, last_study_date=now.date()
    )
    stk_d = stk.to_dict()
    assert stk_d["current_streak"] == 5
    assert stk_d["longest_streak"] == 10
    assert stk_d["last_study_date"] == now.date().isoformat()

    # 7. Feedback & FeedbackMessage.to_dict()
    fb = Feedback(
        id="fb-1", user_id="u-1", content="Great app!", feedback_type="SUGGESTION",
        rating=5, status="OPEN", sender_name="Tester", created_at=now
    )
    fb_d = fb.to_dict()
    assert fb_d["content"] == "Great app!"
    assert fb_d["rating"] == 5

    fbm = FeedbackMessage(
        id="fbm-1", feedback_id="fb-1", user_id="u-1", sender_role="USER",
        message="Thank you", created_at=now
    )
    fbm_d = fbm.to_dict()
    assert fbm_d["message"] == "Thank you"
    assert fbm_d["sender_role"] == "USER"

    # 8. DictionaryWord.to_dict()
    dw = DictionaryWord(
        id="dw-1", word="harmony", meaning="sự hòa hợp", ipa="/ˈhɑːməni/",
        part_of_speech="noun", definition="a pleasing combination of elements"
    )
    dw_d = dw.to_dict()
    assert dw_d["word"] == "harmony"
    assert dw_d["ipa"] == "/ˈhɑːməni/"
    assert dw_d["part_of_speech"] == "noun"

    # 9. WritingSubmission.to_dict()
    ws = WritingSubmission(
        id="ws-1", user_id="u-1", topic="Technology", genre="ielts_task2",
        language="en", sub_type="opinion", word_count=260, overall_score=7.0, created_at=now
    )
    ws_d = ws.to_dict()
    assert ws_d["topic"] == "Technology"
    assert ws_d["sub_type"] == "opinion"
    assert ws_d["overall_score"] == 7.0


# ============================================================================
# Section 3: Password Hashing & Verification Unit Tests
# ============================================================================

def test_hash_and_verify_password_edge_cases():
    """Verify hash_password & verify_password with boundary and edge cases."""
    raw = "MyComplexPassword@2026!"
    hashed = hash_password(raw)
    assert hashed != raw
    assert hashed.startswith("$2b$") or hashed.startswith("$2a$")

    # Correct password
    assert verify_password(raw, hashed) is True

    # Wrong password
    assert verify_password("WrongPassword", hashed) is False

    # Empty plain password
    assert verify_password("", hashed) is False

    # Empty or None hashed password returns False without crashing
    assert verify_password(raw, "") is False
    assert verify_password(raw, None) is False

    # Corrupt or malformed hash returns False safely
    assert verify_password(raw, "invalid_non_bcrypt_hash") is False


# ============================================================================
# Section 4: Auth Service Permissions Unit Tests
# ============================================================================

def test_get_google_client_id():
    """Verify get_google_client_id returns non-empty string."""
    cid = get_google_client_id()
    assert isinstance(cid, str)
    assert len(cid) > 0


def test_is_ai_import_and_writing_allowed_helpers():
    """Verify permission helper functions."""
    auth_user = User(email="tranhuunam23022000@gmail.com", name="Admin Nam", role="ADMIN")
    regular_user = User(email="student@gmail.com", name="Student", role="USER")

    assert is_ai_import_allowed(auth_user) is True
    assert is_ai_writing_allowed(auth_user) is True

    assert is_ai_import_allowed(regular_user) is False
    assert is_ai_writing_allowed(regular_user) is False

    # None user
    assert is_ai_import_allowed(None) is False
    assert is_ai_writing_allowed(None) is False


@pytest.mark.asyncio
async def test_require_admin_access_control():
    """Verify require_admin allows ADMIN and raises 403 Forbidden for USER."""
    admin_u = User(id="u-admin", email="admin@example.com", role="ADMIN")
    user_u = User(id="u-normal", email="user@example.com", role="USER")

    # Happy path: Admin passes
    result = await require_admin(admin_u)
    assert result.id == "u-admin"

    # Forbidden path: Regular user raises HTTPException 403
    with pytest.raises(HTTPException) as exc:
        await require_admin(user_u)
    assert exc.value.status_code == 403
    assert "Quản trị viên" in exc.value.detail


@pytest.mark.asyncio
async def test_require_ai_permissions_access_control():
    """Verify require_ai_import_permission and require_ai_writing_permission."""
    authorized = User(id="u-auth", email="tranhuunam23022000@gmail.com", role="USER")
    unauthorized = User(id="u-unauth", email="stranger@example.com", role="USER")

    # Import permission:
    assert (await require_ai_import_permission(authorized)).id == "u-auth"
    with pytest.raises(HTTPException) as exc:
        await require_ai_import_permission(unauthorized)
    assert exc.value.status_code == 403

    # Writing permission:
    assert (await require_ai_writing_permission(authorized)).id == "u-auth"
    with pytest.raises(HTTPException) as exc:
        await require_ai_writing_permission(unauthorized)
    assert exc.value.status_code == 403


# ============================================================================
# Section 5: Lesson API Language Code Validator
# ============================================================================

def test_validate_lang_happy_and_fallbacks():
    """Verify _validate_lang default fallback and standard normalization."""
    # Fallback to default
    assert _validate_lang(None) == "en"
    assert _validate_lang("") == "en"
    assert _validate_lang(None, default="vi") == "vi"

    # Standard codes
    assert _validate_lang("en") == "en"
    assert _validate_lang("VI") == "vi"
    assert _validate_lang("  ja  ") == "ja"
    assert _validate_lang("zh-TW") == "zh-tw"
    assert _validate_lang("pt-BR") == "pt-br"


def test_validate_lang_invalid_inputs():
    """Verify _validate_lang raises HTTPException 400 on malformed language codes."""
    with pytest.raises(HTTPException) as exc1:
        _validate_lang("a")  # too short
    assert exc1.value.status_code == 400

    with pytest.raises(HTTPException) as exc2:
        _validate_lang("toolonglanguagecode")  # too long
    assert exc2.value.status_code == 400

    with pytest.raises(HTTPException) as exc3:
        _validate_lang("en-US-extra-segment")  # malformed pattern
    assert exc3.value.status_code == 400

    with pytest.raises(HTTPException) as exc4:
        _validate_lang("123")  # numbers not allowed
    assert exc4.value.status_code == 400


# ============================================================================
# Section 6: Feedback API Text Sanitizer
# ============================================================================

def test_sanitize_text_strips_html_and_escapes():
    """Verify sanitize_text removes HTML tags, normalizes whitespace, and escapes entities."""
    # Basic HTML tags
    dirty = "<p>Hello <b>World</b></p>"
    assert sanitize_text(dirty) == "Hello World"

    # Script tags injection attempt: script tags stripped, single quotes escaped as &#x27;
    malicious = "<script>alert('XSS')</script> Safe text"
    assert sanitize_text(malicious) == "alert(&#x27;XSS&#x27;) Safe text"

    # Excessive whitespace and newlines
    messy = "  Line 1   \n\n\t  Line 2   "
    assert sanitize_text(messy) == "Line 1 Line 2"

    # Empty string
    assert sanitize_text("") == ""
    assert sanitize_text("     ") == ""


# ============================================================================
# Section 7: Vocab Schemas Effective Timestamp
# ============================================================================

def test_effective_timestamp_precedence():
    """Verify CreateVocabRequest.effective_timestamp prefers video_timestamp over timestamp."""
    # Both present -> video_timestamp wins
    req1 = CreateVocabRequest(word="test", video_timestamp=15.5, timestamp=10.0)
    assert req1.effective_timestamp == 15.5

    # Only timestamp present
    req2 = CreateVocabRequest(word="test", video_timestamp=None, timestamp=8.2)
    assert req2.effective_timestamp == 8.2

    # Neither present
    req3 = CreateVocabRequest(word="test")
    assert req3.effective_timestamp is None
