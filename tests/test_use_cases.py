import pytest
from app.domain.models import SubtitleSnippet
from app.application.dtos import GetLessonRequest, EvaluateRequest
from app.application.use_cases import GetLessonUseCase, EvaluateSubmissionUseCase
from app.application.interfaces import ITranscriptService, ICacheRepository

class MockTranscriptService(ITranscriptService):
    def fetch_transcripts(self, video_id: str):
        en_snippets = [
            SubtitleSnippet(text="Hello world.", start=0.0, duration=2.0),
            SubtitleSnippet(text="Welcome to dictation practice.", start=2.0, duration=3.0)
        ]
        vi_snippets = [
            SubtitleSnippet(text="Xin chào thế giới.", start=0.0, duration=2.0),
            SubtitleSnippet(text="Chào mừng bạn đến với luyện nghe chép chính tả.", start=2.0, duration=3.0)
        ]
        return "Test Video Title", en_snippets, vi_snippets

class MockCacheRepository(ICacheRepository):
    def __init__(self):
        self.storage = {}
    def get(self, video_id: str):
        return self.storage.get(video_id)
    def save(self, lesson):
        self.storage[lesson.video_id] = lesson

def test_get_lesson_use_case():
    service = MockTranscriptService()
    cache = MockCacheRepository()
    use_case = GetLessonUseCase(transcript_service=service, cache_repo=cache)
    
    response = use_case.execute(GetLessonRequest(url_or_id="test1234567"))
    assert response.video_id == "test1234567"
    assert response.title == "Test Video Title"
    assert response.total_challenges == 2
    assert response.challenges[0].position == 1
    assert response.challenges[0].text == "Hello world."
    assert response.challenges[0].translation == "Xin chào thế giới."
    
    # Check cache hit
    assert cache.get("test1234567") is not None

def test_evaluate_submission_use_case():
    use_case = EvaluateSubmissionUseCase()
    req = EvaluateRequest(
        target_text="Hello world.",
        user_input="hello world"
    )
    res = use_case.execute(req)
    assert res.is_completed is True
    assert res.accuracy_percentage == 100.0
