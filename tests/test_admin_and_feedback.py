"""Integration Tests for Feedback API, Security Limits, and Admin Portal."""
import uuid
import pytest
from fastapi.testclient import TestClient
from server import app

client = TestClient(app)


def get_or_create_admin():
    """Ensure an admin user exists and return their login token."""
    email = "itdaogroup@gmail.com"
    pwd = "Admin@ShotLang2026!"
    # Try login first
    login_res = client.post("/api/auth/login", json={"email": email, "password": pwd})
    if login_res.status_code == 200:
        return login_res.json()["access_token"]
    
    # Otherwise try register
    reg_res = client.post("/api/auth/register", json={
        "email": email,
        "password": pwd,
        "name": "Super Admin"
    })
    if reg_res.status_code == 200:
        return reg_res.json()["access_token"]
    
    # Try another admin email
    admin_email_2 = "tranhuunam23022000@gmail.com"
    reg2 = client.post("/api/auth/register", json={
        "email": admin_email_2,
        "password": pwd,
        "name": "Nam Tran Admin"
    })
    if reg2.status_code == 200:
        return reg2.json()["access_token"]
    
    login2 = client.post("/api/auth/login", json={"email": admin_email_2, "password": pwd})
    if login2.status_code == 200:
        return login2.json()["access_token"]
        
    raise RuntimeError(f"Could not authenticate as admin in test: login1={login_res.status_code} {login_res.text}")


def create_regular_user():
    """Create a regular member user and return token and email."""
    uid = uuid.uuid4().hex[:8]
    email = f"user_{uid}@example.com"
    pwd = "UserPass123!"
    reg_res = client.post("/api/auth/register", json={
        "email": email,
        "password": pwd,
        "name": f"Regular User {uid}"
    })
    assert reg_res.status_code == 200
    login_res = client.post("/api/auth/login", json={"email": email, "password": pwd})
    assert login_res.status_code == 200
    return login_res.json()["access_token"], email


def test_feedback_unauthorized():
    """Guest users cannot submit feedback without authentication."""
    res = client.post("/api/feedback", json={
        "category": "SUGGESTION",
        "title": "Unauthenticated feedback",
        "content": "This should fail because no token is provided."
    })
    assert res.status_code == 401


def test_feedback_submit_and_view_my():
    """Authenticated user submits feedback and views own feedback list."""
    token, email = create_regular_user()
    headers = {"Authorization": f"Bearer {token}"}

    # Submit feedback
    payload = {
        "category": "BUG",
        "rating": 5,
        "title": "Bug in audio playback",
        "content": "When pressing spacebar, audio paused unexpectedly.",
        "page_url": "http://localhost:5101/#/dictate"
    }
    res = client.post("/api/feedback", json=payload, headers=headers)
    assert res.status_code == 201
    data = res.json()
    assert "feedback" in data
    assert data["feedback"]["status"] == "PENDING"
    assert data["feedback"]["feedback_type"] == "BUG"
    assert data["feedback"]["rating"] == 5
    fb_id = data["feedback"]["id"]

    # View my feedbacks
    my_res = client.get("/api/feedback/my", headers=headers)
    assert my_res.status_code == 200
    my_data = my_res.json()
    assert "feedbacks" in my_data
    feedbacks_list = my_data["feedbacks"]
    assert len(feedbacks_list) >= 1
    found = [f for f in feedbacks_list if f["id"] == fb_id]
    assert len(found) == 1
    assert found[0]["content"] == "When pressing spacebar, audio paused unexpectedly."


def test_admin_access_control():
    """Non-admin users cannot access admin endpoints."""
    token, email = create_regular_user()
    headers = {"Authorization": f"Bearer {token}"}

    # 403 on admin overview
    res_overview = client.get("/api/admin/overview", headers=headers)
    assert res_overview.status_code == 403

    # 403 on admin users
    res_users = client.get("/api/admin/users", headers=headers)
    assert res_users.status_code == 403

    # 403 on admin feedbacks
    res_feedbacks = client.get("/api/admin/feedbacks", headers=headers)
    assert res_feedbacks.status_code == 403


def test_admin_portal_data_and_status_update():
    """Admin can fetch overview, users list with lesson progress, and update feedback status."""
    admin_token = get_or_create_admin()
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # 1. Overview
    overview_res = client.get("/api/admin/overview", headers=admin_headers)
    assert overview_res.status_code == 200
    overview = overview_res.json()
    assert "users_count" in overview
    assert "feedbacks_total" in overview
    assert "feedbacks_pending" in overview
    assert "feedbacks_active" in overview
    assert "lessons_count" in overview

    # 1b. Feedback count for badge
    count_res = client.get("/api/admin/feedback-count", headers=admin_headers)
    assert count_res.status_code == 200
    count_data = count_res.json()
    assert "pending" in count_data
    assert "in_progress" in count_data
    assert "total_active" in count_data
    assert count_data["total_active"] == count_data["pending"] + count_data["in_progress"]

    # 2. Users list with lesson breakdown
    users_res = client.get("/api/admin/users", headers=admin_headers)
    assert users_res.status_code == 200
    users_data = users_res.json()
    assert "users" in users_data
    assert len(users_data["users"]) > 0
    # Check structure of user
    first_user = users_data["users"][0]
    assert "email" in first_user
    assert "total_lessons_attempted" in first_user
    assert "completed_lessons" in first_user
    assert "lessons" in first_user
    # If user has lessons, check completion_rate field
    if first_user["lessons"]:
        assert "completion_rate" in first_user["lessons"][0]

    # 3. Feedbacks list
    fb_res = client.get("/api/admin/feedbacks", headers=admin_headers)
    assert fb_res.status_code == 200
    feedbacks = fb_res.json()["feedbacks"]
    assert len(feedbacks) >= 1
    target_fb = feedbacks[0]
    target_id = target_fb["id"]

    # 4. Update feedback status
    update_res = client.patch(
        f"/api/admin/feedbacks/{target_id}/status",
        json={"status": "RESOLVED", "admin_notes": "Fixed in version 2.1"},
        headers=admin_headers
    )
    assert update_res.status_code == 200
    updated_fb = update_res.json()
    assert "feedback" in updated_fb
    assert updated_fb["feedback"]["status"] == "RESOLVED"


def test_quynh_trang_admin_privilege():
    """Verify vuthiquynhtrangbl6d@gmail.com is automatically recognized as ADMIN."""
    email = "vuthiquynhtrangbl6d@gmail.com"
    pwd = "QuynhTrangPass123!"
    reg_res = client.post("/api/auth/register", json={
        "email": email,
        "password": pwd,
        "name": "Vu Thi Quynh Trang"
    })
    if reg_res.status_code == 200:
        user_data = reg_res.json()["user"]
        token = reg_res.json()["access_token"]
    else:
        login_res = client.post("/api/auth/login", json={"email": email, "password": pwd})
        assert login_res.status_code == 200
        user_data = login_res.json()["user"]
        token = login_res.json()["access_token"]

    assert user_data["role"] == "ADMIN"

    # Verify she can access admin endpoint
    res = client.get("/api/admin/overview", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200

