"""TDD Test Suite: Authentication, Passwords, JWT Tokens & RBAC Security.

Covers:
- Password hashing & verification (bcrypt).
- JWT generation, decoding, expiry checks.
- RBAC permissions (Admin vs Regular User).
- Special permission flags (can_use_ai_import, can_use_ai_writing).
- Boundary cases: exact expiry boundaries, min/max password lengths.
- Bad cases: wrong password, expired token, tampered token, unauthorized role escalation.
At least 10 cases strictly included.
"""
from datetime import datetime, timezone, timedelta
from app.application.auth_service import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token,
    is_ai_import_allowed,
    is_ai_writing_allowed,
)
from app.infrastructure.database.models import User


# ==============================================================================
# 1. HAPPY CASES
# ==============================================================================

def test_auth_case_1_hash_and_verify_password():
    """Happy case 1: Password hashes into secure string and verifies correctly."""
    plain = "SuperSecret123!"
    hashed = hash_password(plain)
    assert hashed != plain
    assert verify_password(plain, hashed) is True


def test_auth_case_2_jwt_roundtrip():
    """Happy case 2: Create JWT token and successfully decode user claims."""
    payload = {"sub": "123", "email": "test@example.com", "role": "USER"}
    token = create_access_token(payload)
    decoded = decode_access_token(token)

    assert decoded is not None
    assert decoded["sub"] == "123"
    assert decoded["email"] == "test@example.com"
    assert decoded["role"] == "USER"


def test_auth_case_3_authorized_admin_access():
    """Happy case 3: Authorized admin emails pass AI permissions."""
    admin_user = User(email="tranhuunam23022000@gmail.com", role="ADMIN")
    assert is_ai_import_allowed(admin_user) is True
    assert is_ai_writing_allowed(admin_user) is True


def test_auth_case_4_quynhtrang_special_operator():
    """Happy case 4: Co-operator Quynh Trang has authorized access."""
    trang = User(email="vuthiquynhtrangbl6d@gmail.com", role="USER")
    assert is_ai_import_allowed(trang) is True
    assert is_ai_writing_allowed(trang) is True


# ==============================================================================
# 2. BOUNDARY CASES
# ==============================================================================

def test_auth_case_5_token_custom_expiry():
    """Boundary case 5: Token with custom 10-minute expiry delta sets proper exp timestamp."""
    delta = timedelta(minutes=10)
    token = create_access_token({"sub": "user_1"}, expires_delta=delta)
    decoded = decode_access_token(token)
    assert decoded is not None
    assert "exp" in decoded


def test_auth_case_6_min_length_password():
    """Boundary case 6: Short 6-character password hashes and verifies."""
    pwd = "123456"
    hashed = hash_password(pwd)
    assert verify_password(pwd, hashed) is True


def test_auth_case_7_long_password_boundary():
    """Boundary case 7: Long 72-character password hashes without truncation issues."""
    long_pwd = "a" * 72
    hashed = hash_password(long_pwd)
    assert verify_password(long_pwd, hashed) is True


def test_auth_case_8_token_with_unicode_claims():
    """Boundary case 8: User claims containing Vietnamese unicode characters preserved."""
    token = create_access_token({"sub": "1", "name": "Trần Hữu Nam"})
    decoded = decode_access_token(token)
    assert decoded["name"] == "Trần Hữu Nam"


# ==============================================================================
# 3. BAD / FAILURE / SECURITY CASES
# ==============================================================================

def test_auth_case_9_wrong_password_rejected():
    """Bad case 9: Incorrect password verification returns False."""
    hashed = hash_password("CorrectPassword123")
    assert verify_password("WrongPassword456", hashed) is False


def test_auth_case_10_expired_jwt_rejected():
    """Bad case 10: Expired token returns None when decoded."""
    negative_delta = timedelta(seconds=-10)
    expired_token = create_access_token({"sub": "user_old"}, expires_delta=negative_delta)
    assert decode_access_token(expired_token) is None


def test_auth_case_11_tampered_jwt_rejected():
    """Bad case 11: Tampered JWT token signature fails validation."""
    valid_token = create_access_token({"sub": "legit_user"})
    tampered_token = valid_token[:-4] + "fake"
    assert decode_access_token(tampered_token) is None


def test_auth_case_12_unauthorized_user_blocked_from_ai():
    """Bad case 12: Regular unauthorized user blocked from AI features."""
    regular_user = User(email="intruder@random.com", role="USER")
    assert is_ai_import_allowed(regular_user) is False
    assert is_ai_writing_allowed(regular_user) is False
