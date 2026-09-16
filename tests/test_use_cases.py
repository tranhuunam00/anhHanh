import pytest
from app.domain.models import SubtitleSnippet
from app.application.dtos import GetLessonRequest, EvaluateRequest
from app.application.use_cases import GetLessonUseCase, EvaluateSubmissionUseCase
from app.application.interfaces import ITranscriptService, ICacheRepository

class MockTranscriptService(ITranscriptService):
    def fetch_transcripts(
        self,
        video_id: str,
        source_lang: str = "auto",
        target_lang: str = "vi",
    ):
        if source_lang == "fr":
            src_snippets = [
                SubtitleSnippet(text="Bonjour les amis.", start=0.0, duration=2.0),
                SubtitleSnippet(text="Bienvenue dans la leçon.", start=2.0, duration=3.0),
            ]
            detected = "fr"
        else:
            src_snippets = [
                SubtitleSnippet(text="Hello world.", start=0.0, duration=2.0),
                SubtitleSnippet(text="Welcome to dictation practice.", start=2.0, duration=3.0),
            ]
            detected = "en"

        tgt_snippets = [
            SubtitleSnippet(text="Xin chào.", start=0.0, duration=2.0),
            SubtitleSnippet(text="Chào mừng bạn đến với bài học.", start=2.0, duration=3.0),
        ] if target_lang == "vi" else None

        return "Test Video Title", src_snippets, tgt_snippets, detected

    def get_available_languages(self, video_id: str) -> dict:
        return {
            "video_id": video_id,
            "detected_source_lang": "en",
            "tracks": [{"code": "en", "name": "English", "is_generated": False, "is_translatable": True}],
        }


class MockCacheRepository(ICacheRepository):
    def __init__(self):
        self.storage = {}

    def get(self, video_id: str, cache_key: str = None):
        key = cache_key or video_id
        return self.storage.get(key)

    def save(self, lesson, cache_key: str = None):
        key = cache_key or lesson.video_id
        self.storage[key] = lesson


def test_get_lesson_use_case():
    service = MockTranscriptService()
    cache = MockCacheRepository()
    use_case = GetLessonUseCase(transcript_service=service, cache_repo=cache)

    response = use_case.execute(GetLessonRequest(url_or_id="test1234567"))
    assert response.video_id == "test1234567"
    assert response.total_challenges == 1
    assert response.challenges[0].position == 1
    assert response.challenges[0].text == "Hello world. Welcome to dictation practice."
    # Lesson successfully created
    assert response.total_challenges == 1


def test_get_lesson_french():
    service = MockTranscriptService()
    cache = MockCacheRepository()
    use_case = GetLessonUseCase(transcript_service=service, cache_repo=cache)

    response = use_case.execute(
        GetLessonRequest(url_or_id="test1234567", source_lang="fr", target_lang="vi")
    )
    assert response.video_id == "test1234567"
    assert response.detected_source_lang == "fr"
    assert "Bonjour" in response.challenges[0].text

def test_evaluate_submission_use_case():
    use_case = EvaluateSubmissionUseCase()
    req = EvaluateRequest(
        target_text="Hello world.",
        user_input="hello world"
    )
    res = use_case.execute(req)
    assert res.is_completed is True
    assert res.accuracy_percentage == 100.0
