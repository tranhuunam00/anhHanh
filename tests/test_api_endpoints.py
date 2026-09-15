import pytest
from fastapi.testclient import TestClient
from server import app
from app.application.dtos import LessonResponse, ChallengeDTO
from app.application.use_cases import GetLessonUseCase

client = TestClient(app)

def test_api_presets():
    response = client.get("/api/presets")
    assert response.status_code == 200
    presets = response.json()
    assert len(presets) > 0
    assert any(p["videoId"] == "qe9QSCF-d88" for p in presets)

def test_api_evaluate():
    payload = {
        "target_text": "When my son Patrick was around three",
        "user_input": "when my son patrick was around three",
        "strict_punctuation": False
    }
    response = client.post("/api/evaluate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["is_completed"] is True
    assert data["accuracy_percentage"] == 100.0

def test_api_invalid_url():
    payload = {"url_or_id": "invalid_url_with_no_id"}
    response = client.post("/api/lesson", json=payload)
    assert response.status_code == 400
