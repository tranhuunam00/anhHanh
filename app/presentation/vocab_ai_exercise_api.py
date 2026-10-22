"""API Endpoint for AI Vocabulary Storytelling & Context Exercises."""
import logging
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException, status

from app.infrastructure.database.models import User
from app.application.auth_service import require_ai_import_permission
from app.infrastructure.ai_vocab_exercise_service import AIVocabExerciseService

logger = logging.getLogger(__name__)
router = APIRouter()


class VocabWordItemPayload(BaseModel):
    word: str
    meaning: Optional[str] = ""
    part_of_speech: Optional[str] = "phrase"
    phonetic: Optional[str] = None
    source_lang: Optional[str] = "en"


class AIVocabStoryRequest(BaseModel):
    words: List[VocabWordItemPayload] = Field(..., min_items=1)
    theme: Optional[str] = "daily_life"
    level: Optional[str] = "B1-B2"


@router.post("/ai-story")
async def generate_ai_vocab_story(
    payload: AIVocabStoryRequest,
    current_user: User = Depends(require_ai_import_permission)
):
    """Generate an AI-crafted narrative story and interactive cloze challenge.
    Strictly restricted to authorized beta accounts.
    """
    try:
        dict_words = [w.dict() for w in payload.words]
        story_data = await AIVocabExerciseService.generate_vocab_story(
            words=dict_words,
            theme=payload.theme or "daily_life",
            level=payload.level or "B1-B2"
        )
        return {
            "success": True,
            "data": story_data,
            "user_email": current_user.email
        }
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except Exception as e:
        logger.error(f"Error generating AI vocab story: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi tạo câu chuyện AI: {str(e)}"
        )
