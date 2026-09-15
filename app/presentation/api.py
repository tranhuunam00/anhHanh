"""FastAPI Presentation Layer / API Router."""
from typing import List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.domain.exceptions import (
    InvalidVideoIdException,
    TranscriptNotFoundException,
)
from app.application.dtos import (
    GetLessonRequest,
    LessonResponse,
    EvaluateRequest,
    EvaluateResponse,
)
from app.application.use_cases import (
    GetLessonUseCase,
    EvaluateSubmissionUseCase,
)
from app.infrastructure.youtube_adapter import YouTubeTranscriptAdapter
from app.infrastructure.cache_repository import FileCacheRepository

api_router = APIRouter(prefix="/api")

# Dependency Injection setup
_youtube_adapter = YouTubeTranscriptAdapter()
_cache_repo = FileCacheRepository()
_get_lesson_uc = GetLessonUseCase(
    transcript_service=_youtube_adapter, cache_repo=_cache_repo
)
_evaluate_uc = EvaluateSubmissionUseCase()


class LessonApiRequest(BaseModel):
    url_or_id: str = Field(..., description="YouTube URL hoặc video ID")
    grouping_mode: str = Field(
        default="sentence", description="'sentence' hoặc 'snippet'"
    )


class EvaluateApiRequest(BaseModel):
    target_text: str = Field(..., description="Câu mẫu tiếng Anh")
    user_input: str = Field(..., description="Câu người dùng đã gõ")
    strict_punctuation: bool = Field(
        default=False, description="Có yêu cầu đúng dấu câu hay không"
    )


@api_router.post("/lesson", response_model=LessonResponse)
def get_or_create_lesson(body: LessonApiRequest):
    """Trích xuất bài tập chép chính tả theo từng câu từ link YouTube."""
    try:
        req = GetLessonRequest(
            url_or_id=body.url_or_id, grouping_mode=body.grouping_mode
        )
        return _get_lesson_uc.execute(req)
    except InvalidVideoIdException as e:
        raise HTTPException(status_code=400, detail=str(e))
    except TranscriptNotFoundException as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Lỗi khi xử lý video: {str(e)}"
        )


@api_router.post("/evaluate", response_model=EvaluateResponse)
def evaluate_submission(body: EvaluateApiRequest):
    """So khớp câu người dùng gõ với câu mẫu (tô màu xanh/đỏ, gợi ý)."""
    try:
        req = EvaluateRequest(
            target_text=body.target_text,
            user_input=body.user_input,
            strict_punctuation=body.strict_punctuation,
        )
        return _evaluate_uc.execute(req)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@api_router.get("/presets")
def get_preset_lessons():
    """Danh sách các video mẫu sẵn có để người dùng chọn nhanh."""
    return [
        {
            "videoId": "qe9QSCF-d88",
            "title": "The Catastrophic Risks of AI — and a Safer Path | Yoshua Bengio | TED",
            "level": "C1 - Advanced",
            "author": "TED Talks",
            "description": "Bài diễn thuyết nổi tiếng của giáo sư Yoshua Bengio về rủi ro và giải pháp an toàn cho Trí tuệ Nhân tạo.",
        },
        {
            "videoId": "h6fcK_fRYaI",
            "title": "The Egg - A Short Story",
            "level": "B2 - Upper Intermediate",
            "author": "Kurzgesagt",
            "description": "Câu chuyện triết học kinh điển về cuộc sống và vũ trụ.",
        },
        {
            "videoId": "UF8uR6Z6KLc",
            "title": "Steve Jobs' 2005 Stanford Commencement Address",
            "level": "B2 - Intermediate",
            "author": "Stanford",
            "description": "Bài phát biểu kinh điển 'Stay Hungry, Stay Foolish' của Steve Jobs.",
        },
    ]
