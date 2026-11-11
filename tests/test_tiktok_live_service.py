"""Unit tests for TikTok LIVE Interactive Classroom Service."""
import pytest
from app.application.tiktok_live_service import (
    normalize_answer_input,
    TikTokLiveSession,
    DEFAULT_LIVE_QUESTIONS
)


class TestTikTokLiveAnswerNormalization:
    """Tests for normalizing answer input from TikTok chat comments."""

    def test_single_letter_happy_path(self):
        assert normalize_answer_input("A") == "A"
        assert normalize_answer_input("b") == "B"
        assert normalize_answer_input("C") == "C"
        assert normalize_answer_input("d") == "D"

    def test_answers_with_dots_or_brackets(self):
        assert normalize_answer_input("A.") == "A"
        assert normalize_answer_input("B)") == "B"
        assert normalize_answer_input("C. Careless") == "C"

    def test_answers_with_words(self):
        assert normalize_answer_input("dap an B") == "B"
        assert normalize_answer_input("Chon C") == "C"

    def test_empty_or_whitespace_input(self):
        assert normalize_answer_input("") == ""
        assert normalize_answer_input("   ") == ""
        assert normalize_answer_input(None) == ""


class TestTikTokLiveSessionRounds:
    """Tests for session questions and round lifecycle."""

    def test_session_initial_state(self):
        session = TikTokLiveSession(room_id="test_room")
        assert session.status == "disconnected"
        assert session.current_question_index == 0
        assert session.is_round_active is False
        assert len(session.questions) == len(DEFAULT_LIVE_QUESTIONS)
        assert session.get_current_question() is not None

    def test_start_and_end_round(self):
        session = TikTokLiveSession(room_id="test_room")
        start_evt = session.start_round()
        assert session.is_round_active is True
        assert start_evt["type"] == "ROUND_START"
        assert start_evt["question_index"] == 0

        # Simulate answers
        session.process_comment("user1", "Nam", "B")
        session.process_comment("user2", "Lan", "A")

        end_evt = session.end_round()
        assert session.is_round_active is False
        assert end_evt["type"] == "ROUND_END"
        assert end_evt["vote_counts"]["B"] == 1
        assert end_evt["vote_counts"]["A"] == 1

    def test_next_question_advances(self):
        session = TikTokLiveSession(room_id="test_room")
        assert session.current_question_index == 0
        session.next_question()
        assert session.current_question_index == 1
        assert session.is_round_active is True

    def test_prev_question_goes_back(self):
        session = TikTokLiveSession(room_id="test_room")
        session.next_question()
        assert session.current_question_index == 1
        session.prev_question()
        assert session.current_question_index == 0
        assert session.is_round_active is True
        # Wrap around to end
        session.prev_question()
        assert session.current_question_index == len(session.questions) - 1


class TestTikTokLiveScoringAndLeaderboard:
    """Tests for scoring rules, rankings, and gift boosts."""

    def test_first_place_gets_100_points(self):
        session = TikTokLiveSession(room_id="test_room")
        session.start_round()
        target_ans = session.get_current_question()["answer"]  # e.g. "B"

        res1 = session.process_comment("u1", "First Winner", target_ans)
        assert res1["is_correct"] is True
        assert res1["points"] == 100

        res2 = session.process_comment("u2", "Second Winner", target_ans)
        assert res2["is_correct"] is True
        assert res2["points"] == 80

        # Wrong answer gives 0
        wrong_ans = "A" if target_ans != "A" else "C"
        res3 = session.process_comment("u3", "Wrong Answerer", wrong_ans)
        assert res3["is_correct"] is False
        assert res3["points"] == 0

    def test_leaderboard_sorted_descending(self):
        session = TikTokLiveSession(room_id="test_room")
        session.start_round()
        target_ans = session.get_current_question()["answer"]

        session.process_comment("u1", "Player One", target_ans)  # 100
        session.process_comment("u2", "Player Two", target_ans)  # 80

        leaderboard = session.get_leaderboard_sorted(10)
        assert len(leaderboard) == 2
        assert leaderboard[0]["user_id"] == "u1"
        assert leaderboard[0]["score"] == 100
        assert leaderboard[1]["user_id"] == "u2"
        assert leaderboard[1]["score"] == 80

    def test_likes_and_gifts(self):
        session = TikTokLiveSession(room_id="test_room")
        session.process_like("u1", "Fan", 15)
        assert session.total_likes == 15

        session.process_gift("u1", "Supporter", "Rose", diamond_count=2)
        assert session.total_gifts == 2
        # Diamond count 2 * 50 = 100 bonus points
        assert session.leaderboard["u1"]["score"] == 100


class TestTikTokLiveApiEndpoints:
    """Integration tests for FastAPI endpoints under /api/tiktok-live."""

    @pytest.fixture(autouse=True)
    def setup_client(self):
        from starlette.testclient import TestClient
        from server import app
        self.client = TestClient(app)

    def test_get_snapshot_success(self):
        res = self.client.get("/api/tiktok-live/snapshot")
        assert res.status_code == 200
        data = res.json()
        assert data["type"] == "SNAPSHOT"
        assert "current_question" in data
        assert "leaderboard" in data
        assert "vote_counts" in data

    def test_start_and_end_round_endpoints(self):
        res_start = self.client.post("/api/tiktok-live/start-round")
        assert res_start.status_code == 200
        assert res_start.json()["status"] == "started"

        res_end = self.client.post("/api/tiktok-live/end-round")
        assert res_end.status_code == 200
        assert res_end.json()["status"] == "ended"

    def test_next_question_endpoint(self):
        res = self.client.post("/api/tiktok-live/next-question")
        assert res.status_code == 200
        assert res.json()["status"] == "next"

    def test_simulate_comment_and_gift(self):
        res_comment = self.client.post("/api/tiktok-live/simulate", json={
            "event_type": "comment",
            "comment": "A",
            "nickname": "Test Học Viên"
        })
        assert res_comment.status_code == 200
        assert res_comment.json()["status"] == "ok"

        res_gift = self.client.post("/api/tiktok-live/simulate", json={
            "event_type": "gift",
            "gift_name": "Trái Tim",
            "diamond_count": 5
        })
        assert res_gift.status_code == 200
        assert res_gift.json()["status"] == "ok"

    def test_simulate_invalid_type_raises_400(self):
        res = self.client.post("/api/tiktok-live/simulate", json={
            "event_type": "invalid_event"
        })
        assert res.status_code == 400

    def test_connect_empty_unique_id_raises_400(self):
        res = self.client.post("/api/tiktok-live/connect", json={
            "unique_id": ""
        })
        assert res.status_code == 400

    def test_disconnect_success(self):
        res = self.client.post("/api/tiktok-live/disconnect")
        assert res.status_code == 200
        assert res.json()["status"] == "disconnected"

    def test_websocket_receives_snapshot(self):
        with self.client.websocket_connect("/api/tiktok-live/ws") as ws:
            data = ws.receive_json()
            assert data["type"] == "SNAPSHOT"
            assert "current_question" in data


