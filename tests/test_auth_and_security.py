"""Unit & Integration Tests for Authentication, RBAC, and Security Shield."""
import pytest
from fastapi.testclient import TestClient
from server import app
from app.application.auth_service import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password
)

client = TestClient(app)


def test_password_hashing_and_verification():
    """Verify bcrypt hashes passwords properly and verifies correctly."""
    plain = "SecurePassword123!"
    hashed = hash_password(plain)
    assert hashed != plain
    assert verify_password(plain, hashed) is True
    assert verify_password("WrongPassword!", hashed) is False


def test_jwt_token_lifecycle():
    """Verify JWT encodes and decodes subject and expiration."""
    payload = {"sub": "user-uuid-123", "email": "test@example.com", "role": "USER"}
    token = create_access_token(payload)
    assert isinstance(token, str)

    decoded = decode_access_token(token)
    assert decoded is not None
    assert decoded["sub"] == "user-uuid-123"
    assert decoded["email"] == "test@example.com"
    assert decoded["role"] == "USER"
    assert "exp" in decoded


def test_register_and_login_flow():
    """Verify user registration and subsequent login."""
    test_email = "newlearner@example.com"
    reg_res = client.post("/api/auth/register", json={
        "email": test_email,
        "password": "Password123!",
        "name": "New Learner"
    })
    # If already created in prior run, login should work
    if reg_res.status_code == 200:
        data = reg_res.json()
        assert "access_token" in data
        assert data["user"]["email"] == test_email
        assert data["user"]["role"] == "USER"

    # Now Login
    login_res = client.post("/api/auth/login", json={
        "email": test_email,
        "password": "Password123!"
    })
    assert login_res.status_code == 200
    login_data = login_res.json()
    assert "access_token" in login_data
    token = login_data["access_token"]

    # Access /api/auth/me
    me_res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    assert me_res.json()["user"]["email"] == test_email


def test_honeypot_bot_trap():
    """Verify honeypot field catches bots and rejects registration."""
    res = client.post("/api/auth/register", json={
        "email": "bot@spammer.com",
        "password": "Password123!",
        "name": "Spam Bot",
        "b_trap": "I am a hidden bot entry"
    })
    assert res.status_code == 400
    assert "rejected" in res.json()["detail"].lower()


def test_security_headers_present():
    """Verify SecurityHeadersMiddleware sets modern security headers."""
    res = client.get("/api/presets")
    assert res.status_code == 200
    assert res.headers.get("X-Frame-Options") == "SAMEORIGIN"
    assert res.headers.get("X-Content-Type-Options") == "nosniff"
    assert res.headers.get("X-XSS-Protection") == "1; mode=block"


def test_payload_size_limit_guard():
    """Verify requests exceeding 512KB are rejected with 413 Payload Too Large."""
    huge_data = "A" * (550 * 1024)
    res = client.post(
        "/api/auth/register",
        content=huge_data,
        headers={"Content-Type": "application/json", "Content-Length": str(len(huge_data))}
    )
    assert res.status_code == 413
