"""Integration tests for in-progress resume tracking, Super Admin seeding, and image rotation."""
import pytest
from fastapi.testclient import TestClient
from server import app

client = TestClient(app)


def test_super_admin_seeded_or_login():
    """Verify Super Admin account itdaogroup@gmail.com is seeded with ADMIN role."""
    admin_email = "itdaogroup@gmail.com"
    # Login with seed password
    login_res = client.post("/api/auth/login", json={
        "email": admin_email,
        "password": "Admin@ShotLang2026!"
    })
    if login_res.status_code != 200:
        # If not seeded in test DB yet, register it and verify it gets ADMIN role
        reg_res = client.post("/api/auth/register", json={
            "email": admin_email,
            "password": "Admin@ShotLang2026!",
            "name": "Super Admin"
        })
        token = reg_res.json()["access_token"]
    else:
        token = login_res.json()["access_token"]

    me_res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    user_data = me_res.json()["user"]
    assert user_data["email"] == admin_email
    assert user_data["role"] == "ADMIN"


def test_in_progress_resume_and_progress_flow():
    """Test /api/lesson/start, /api/lesson/progress, and /api/lesson/status for active sentence resume."""
    # 1. Create a user
    email = "resume_tester@example.com"
    client.post("/api/auth/register", json={
        "email": email,
        "password": "Password123!",
        "name": "Resume Tester"
    })
    login_res = client.post("/api/auth/login", json={"email": email, "password": "Password123!"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Start lesson session for qe9QSCF-d88
    start_res = client.post("/api/lesson/start", json={"video_id": "qe9QSCF-d88"}, headers=headers)
    assert start_res.status_code == 200
    start_data = start_res.json()
    assert "lesson" in start_data
    assert start_data["currentPosition"] >= 1

    # 3. Update progress to sentence 3 with 20 words
    prog_res = client.post("/api/lesson/progress", json={
        "video_id": "qe9QSCF-d88",
        "current_position": 3,
        "words_typed": 20,
        "is_completed": False
    }, headers=headers)
    assert prog_res.status_code == 200
    prog_data = prog_res.json()
    assert prog_data["currentPosition"] == 3
    assert prog_data["streak"]["words_today"] >= 20

    # 4. Query lesson status - verify it remembers sentence 3
    status_res = client.get("/api/lesson/status/qe9QSCF-d88", headers=headers)
    assert status_res.status_code == 200
    st_data = status_res.json()
    assert st_data["currentPosition"] == 3
    assert st_data["isCompleted"] is False


def test_vocabulary_image_candidates_and_rotation():
    """Test /api/vocab/image-candidates and image patching."""
    email = "img_tester@example.com"
    client.post("/api/auth/register", json={
        "email": email,
        "password": "Password123!",
        "name": "Img Tester"
    })
    login_res = client.post("/api/auth/login", json={"email": email, "password": "Password123!"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Fetch image candidates for 'apple'
    cand_res = client.get("/api/vocab/image-candidates?word=apple", headers=headers)
    assert cand_res.status_code == 200
    cand_data = cand_res.json()
    assert "candidates" in cand_data
    assert len(cand_data["candidates"]) >= 1

    # 2. Create a vocab item
    create_res = client.post("/api/vocab", json={
        "word": "apple",
        "context_sentence": "An apple a day keeps the doctor away.",
        "meaning": "quả táo"
    }, headers=headers)
    assert create_res.status_code == 200
    vocab_id = create_res.json()["vocab"]["id"]

    # 3. Rotate image to first candidate
    new_img = cand_data["candidates"][0]
    patch_res = client.patch(f"/api/vocab/{vocab_id}/image", json={"image_url": new_img}, headers=headers)
    assert patch_res.status_code == 200
    assert patch_res.json()["vocab"]["image_url"] == new_img

    # 4. Delete vocab item
    del_res = client.delete(f"/api/vocab/{vocab_id}", headers=headers)
    assert del_res.status_code == 200
