"""Unit and integration tests for Destination B2 presentation layer and API endpoints.

Follows AGENTS.md:
- Rule 4: File strictly under 500 lines.
- Rule 6: Mandatory function-level unit testing covering input, output, logic, error handling.
"""
import uuid
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy import select, delete

from server import app
from app.infrastructure.database.connection import async_session_factory
from app.infrastructure.database.destination_b2_models import (
    DestinationB2Unit,
    DestinationB2Exercise,
    DestinationB2Progress,
)
from app.infrastructure.database.models import User
from app.application.auth_service import create_access_token


@pytest_asyncio.fixture
async def test_client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client


@pytest_asyncio.fixture
async def test_user():
    user_id = str(uuid.uuid4())
    user = User(
        id=user_id,
        email=f"b2user_{user_id[:8]}@example.com",
        name="Destination B2 Learner",
        role="user",
        password_hash="fakehash",
    )
    async with async_session_factory() as session:
        session.add(user)
        await session.commit()

    token = create_access_token({"sub": user.id, "email": user.email, "role": user.role})
    yield {"user": user, "token": token}

    async with async_session_factory() as session:
        await session.execute(delete(DestinationB2Progress).where(DestinationB2Progress.user_id == user_id))
        await session.execute(delete(User).where(User.id == user_id))
        await session.commit()


@pytest.mark.asyncio
async def test_get_units_endpoint(test_client):
    """Test GET /api/destination-b2/units returns Units 1 and 2."""
    resp = await test_client.get("/api/destination-b2/units")
    assert resp.status_code == 200
    data = resp.json()
    assert "units" in data
    assert data["total"] == 2

    unit_numbers = [u["unit_number"] for u in data["units"]]
    assert unit_numbers == [1, 2]

    u1 = data["units"][0]
    assert u1["unit_type"] == "grammar"
    assert u1["exercises_count"] == 10

    u2 = data["units"][1]
    assert u2["unit_type"] == "vocabulary"
    assert u2["exercises_count"] == 9


@pytest.mark.asyncio
async def test_get_unit_detail_by_number_and_id(test_client):
    """Test GET /api/destination-b2/units/{id_or_number} happy path and 404."""
    # Test by unit number '1'
    resp1 = await test_client.get("/api/destination-b2/units/1")
    assert resp1.status_code == 200
    u1 = resp1.json()
    assert u1["unit_number"] == 1
    assert "theory" in u1
    assert len(u1["theory"]["sections"]) == 5
    assert len(u1["exercises"]) == 10

    # Test by UUID
    unit_id = u1["id"]
    resp_id = await test_client.get(f"/api/destination-b2/units/{unit_id}")
    assert resp_id.status_code == 200
    assert resp_id.json()["id"] == unit_id

    # Test 404 for non-existent unit
    resp_404 = await test_client.get("/api/destination-b2/units/999")
    assert resp_404.status_code == 404
    assert resp_404.json()["detail"] == "Unit not found"


@pytest.mark.asyncio
async def test_get_exercise_detail_masking(test_client):
    """Test GET /api/destination-b2/exercises/{id} strips answers by default."""
    async with async_session_factory() as session:
        stmt = select(DestinationB2Exercise).limit(1)
        res = await session.execute(stmt)
        ex = res.scalar_one()
        exercise_id = ex.id

    # Default: answers must be masked
    resp = await test_client.get(f"/api/destination-b2/exercises/{exercise_id}")
    assert resp.status_code == 200
    data = resp.json()
    assert data["id"] == exercise_id
    assert len(data["items"]) > 0
    first_item = data["items"][0]
    assert "correct_answer" not in first_item
    assert "answers" not in first_item

    # Include answers param
    resp_ans = await test_client.get(f"/api/destination-b2/exercises/{exercise_id}?include_answers=true")
    assert resp_ans.status_code == 200
    first_item_ans = resp_ans.json()["items"][0]
    assert (
        "correct_answer" in first_item_ans
        or "answers" in first_item_ans
        or "answer" in first_item_ans
    )

    # 404 for invalid exercise id
    resp_404 = await test_client.get(f"/api/destination-b2/exercises/{uuid.uuid4()}")
    assert resp_404.status_code == 404


@pytest.mark.asyncio
async def test_submit_exercise_endpoint(test_client, test_user):
    """Test POST /api/destination-b2/exercises/{id}/submit grades and saves progress."""
    async with async_session_factory() as session:
        stmt = (
            select(DestinationB2Exercise)
            .join(DestinationB2Unit)
            .where(DestinationB2Unit.unit_number == 1, DestinationB2Exercise.exercise_code == "A")
        )
        res = await session.execute(stmt)
        ex_a = res.scalar_one()
        exercise_id = ex_a.id

    # Submit answers as authenticated user
    headers = {"Authorization": f"Bearer {test_user['token']}"}
    payload = {
        "answers": {
            "1": "goes",              # correct
            "2": "is talking",        # correct
            "3": "wrong answer xyz",  # incorrect
        }
    }
    resp = await test_client.post(
        f"/api/destination-b2/exercises/{exercise_id}/submit",
        json=payload,
        headers=headers
    )
    assert resp.status_code == 200
    result = resp.json()
    assert result["exercise_id"] == exercise_id
    assert result["total_items"] == 10
    assert result["correct_items"] >= 2
    assert "score" in result
    assert len(result["results"]) == 10
    assert result["results"][0]["is_correct"] is True
    assert result["results"][1]["is_correct"] is True
    assert result["results"][2]["is_correct"] is False

    # Check progress endpoint for authenticated user
    prog_resp = await test_client.get("/api/destination-b2/progress", headers=headers)
    assert prog_resp.status_code == 200
    prog_data = prog_resp.json()
    assert prog_data["total_completed"] >= 1
    assert prog_data["progress"][0]["exercise_id"] == exercise_id


@pytest.mark.asyncio
async def test_submit_exercise_invalid_id(test_client):
    """Test 404 when submitting answers to non-existent exercise."""
    fake_id = str(uuid.uuid4())
    resp = await test_client.post(
        f"/api/destination-b2/exercises/{fake_id}/submit",
        json={"answers": {"1": "foo"}}
    )
    assert resp.status_code == 404
    assert resp.json()["detail"] == "Exercise not found"
