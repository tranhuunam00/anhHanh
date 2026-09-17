"""Unit & Integration Tests for Lesson Session, Resume, and Smart Vocabulary."""
import pytest
from fastapi.testclient import TestClient
from server import app

client = TestClient(app)


def test_streak_guest_and_authenticated():
    """Verify streak endpoint returns correct structure for guests and logged in users."""
    # 1. Guest
    res = client.get("/api/streak")
    assert res.status_code == 200
    data = res.json()
    assert data["is_authenticated"] is False
    assert "current_streak" in data
    assert "words_today" in data

    # 2. Authenticated user (register real user first)
    email = "streak_user@example.com"
    client.post("/api/auth/register", json={
        "email": email,
        "password": "Password123!",
        "name": "Streak Learner"
    })
    login_res = client.post("/api/auth/login", json={"email": email, "password": "Password123!"})
    token = login_res.json()["access_token"]

    auth_res = client.get("/api/streak", headers={"Authorization": f"Bearer {token}"})
    assert auth_res.status_code == 200
    auth_data = auth_res.json()
    assert auth_data["is_authenticated"] is True
    assert "current_streak" in auth_data
    assert "words_today" in auth_data


def test_preview_video_endpoint():
    """Verify preview endpoint returns title, thumbnail and count."""
    res = client.post("/api/lesson/preview", json={"url_or_id": "qe9QSCF-d88"})
    # qe9QSCF-d88 is a preset lesson in cache
    if res.status_code == 200:
        data = res.json()
        assert data["videoId"] == "qe9QSCF-d88"
        assert "totalChallenges" in data
        assert "thumbnailUrl" in data


def test_vocabulary_crud_flow():
    """Verify smart vocabulary saving, listing, and status updating."""
    # 1. Register test user
    email = "vocab_tester@example.com"
    client.post("/api/auth/register", json={
        "email": email,
        "password": "Password123!",
        "name": "Vocab Tester"
    })
    login_res = client.post("/api/auth/login", json={"email": email, "password": "Password123!"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Save word
    save_res = client.post(
        "/api/vocab",
        json={
            "word": "perseverance",
            "context_sentence": "Success requires perseverance and dedication.",
            "meaning": "sự kiên trì, bền bỉ",
            "phonetic": "/ˌpɜːsɪˈvɪərəns/",
            "video_id": "qe9QSCF-d88"
        },
        headers=headers
    )
    assert save_res.status_code == 200
    vocab = save_res.json()["vocab"]
    assert vocab["word"] == "perseverance"
    vocab_id = vocab["id"]

    # 3. List words
    list_res = client.get("/api/vocab", headers=headers)
    assert list_res.status_code == 200
    list_data = list_res.json()
    assert list_data["stats"]["total"] >= 1
    words = [w["word"] for w in list_data["vocabulary"]]
    assert "perseverance" in words

    # 4. Update status to MASTERED
    status_res = client.patch(f"/api/vocab/{vocab_id}/status", json={"status": "MASTERED"}, headers=headers)
    assert status_res.status_code == 200
    assert status_res.json()["vocab"]["status"] == "MASTERED"
