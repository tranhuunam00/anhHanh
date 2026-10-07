"""AI Writing Studio API Endpoints.
Provides prompt library, prompt generation, comprehensive AI essay evaluation,
and submission history tracking.
Strictly restricted to authorized accounts: tranhuunam23022000 & vuthiquynhtrangbl6d.
"""
import json
import logging
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from app.infrastructure.database.connection import get_db
from app.infrastructure.database.models import User, WritingSubmission
from app.application.auth_service import (
    get_current_user,
    get_current_user_optional,
    require_ai_writing_permission,
    is_ai_writing_allowed,
)
from app.infrastructure.ai_writing_service import AIWritingService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/writing", tags=["Writing"])


class EvaluateWritingRequest(BaseModel):
    submission_id: Optional[str] = Field(default=None, description="ID bài viết nếu đã lưu trước đó")
    topic: str = Field(..., min_length=2, description="Đề bài cần làm")
    content: str = Field(..., min_length=15, description="Bài viết của học viên")
    genre: Optional[str] = Field(default="ielts_task2", description="Thể loại bài viết")
    target_band: Optional[float] = Field(default=7.0, description="Mục tiêu band điểm (e.g. 6.5, 7.0, 7.5, 8.0)")
    language: Optional[str] = Field(default="en", description="Ngôn ngữ bài viết (en, ja, zh, ko, fr, de)")
    images: Optional[List[str]] = Field(default=[], description="Danh sách ảnh đề bài đính kèm (base64 data URL hoặc URL)")


class SaveWritingRequest(BaseModel):
    submission_id: Optional[str] = Field(default=None, description="ID bài viết nếu cập nhật")
    topic: str = Field(..., min_length=2, description="Đề bài cần làm")
    content: str = Field(..., min_length=1, description="Nội dung bài viết")
    genre: Optional[str] = Field(default="ielts_task2", description="Thể loại bài viết")
    target_band: Optional[float] = Field(default=7.0, description="Mục tiêu band điểm")
    language: Optional[str] = Field(default="en", description="Ngôn ngữ bài viết")


class GeneratePromptRequest(BaseModel):
    genre: Optional[str] = Field(default="ielts_task2")
    topic_area: Optional[str] = Field(default=None)
    language: Optional[str] = Field(default="en", description="Ngôn ngữ đề bài")
    sub_type: Optional[str] = Field(default=None, description="Dạng đề chi tiết (line_graph, bar_chart, process, map, opinion, discussion...)")


class SuggestStructuresRequest(BaseModel):
    topic: str = Field(..., min_length=2, description="Đề bài cần gợi ý cụm từ")
    language: Optional[str] = Field(default="en", description="Ngôn ngữ bài viết")
    target_band: Optional[float] = Field(default=7.0, description="Mục tiêu điểm")
    genre: Optional[str] = Field(default="ielts_task2", description="Thể loại bài viết")


@router.get("/prompts")
async def get_writing_prompts(language: Optional[str] = Query(default=None)):
    """Retrieve curated library of writing prompts grouped by genre and language (Free for all users)."""
    return {
        "success": True,
        "prompts": AIWritingService.get_prompts_library(language=language)
    }


@router.post("/save")
async def save_writing_submission(
    body: SaveWritingRequest,
    current_user: User = Depends(require_ai_writing_permission),
    db: AsyncSession = Depends(get_db)
):
    """Save or update a writing draft/submission without triggering AI evaluation."""
    words = body.content.strip().split()
    word_count = len(words)

    if body.submission_id:
        stmt = select(WritingSubmission).where(
            WritingSubmission.id == body.submission_id,
            WritingSubmission.user_id == current_user.id
        )
        res = await db.execute(stmt)
        submission = res.scalar_one_or_none()
        if submission:
            submission.topic = body.topic
            submission.genre = body.genre or "ielts_task2"
            submission.language = body.language or "en"
            submission.content = body.content
            submission.word_count = word_count
            submission.target_band = body.target_band or 7.0
            await db.commit()
            await db.refresh(submission)
            return {
                "success": True,
                "submission_id": submission.id,
                "message": "Đã lưu bản nháp bài viết thành công",
                "item": submission.to_dict()
            }

    submission = WritingSubmission(
        user_id=current_user.id,
        topic=body.topic,
        genre=body.genre or "ielts_task2",
        language=body.language or "en",
        content=body.content,
        word_count=word_count,
        target_band=body.target_band or 7.0,
        overall_score=None,
        feedback_json=None
    )
    db.add(submission)
    await db.commit()
    await db.refresh(submission)

    return {
        "success": True,
        "submission_id": submission.id,
        "message": "Đã lưu bản nháp bài viết thành công",
        "item": submission.to_dict()
    }


@router.post("/generate-prompt")
async def generate_custom_prompt(
    body: GeneratePromptRequest,
    current_user: User = Depends(require_ai_writing_permission)
):
    """Generate a dynamic writing prompt using AI.
    Strictly restricted to authorized accounts: tranhuunam23022000 & vuthiquynhtrangbl6d.
    """
    try:
        prompt_data = await AIWritingService.generate_prompt(
            genre=body.genre or "ielts_task2",
            topic_area=body.topic_area,
            language=body.language or "en",
            sub_type=body.sub_type
        )
        return {
            "success": True,
            "prompt": prompt_data
        }
    except Exception as e:
        logger.error(f"Error generating prompt: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi tạo đề bài AI: {str(e)}"
        )


@router.post("/suggest-structures")
async def suggest_writing_structures(
    body: SuggestStructuresRequest,
    current_user: User = Depends(require_ai_writing_permission)
):
    """AI automatically generates tailored collocations, phrases, and sentence structures specifically for this topic."""
    try:
        result = await AIWritingService.suggest_structures(
            topic=body.topic,
            language=body.language or "en",
            target_band=body.target_band or 7.0,
            genre=body.genre or "ielts_task2"
        )
        return {
            "success": True,
            "topic": result.get("topic", body.topic),
            "language": result.get("language", body.language),
            "suggestions": result.get("suggestions", [])
        }
    except Exception as e:
        logger.error(f"Error suggesting structures: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi AI gợi ý cấu trúc theo đề: {str(e)}"
        )


@router.post("/evaluate")
async def evaluate_writing_submission(
    body: EvaluateWritingRequest,
    current_user: User = Depends(require_ai_writing_permission),
    db: AsyncSession = Depends(get_db)
):
    """Thoroughly evaluate, grade (IELTS Band 0-9), fix errors, and suggest vocabulary upgrades using Gemini AI.
    Strictly restricted to authorized accounts: tranhuunam23022000 & vuthiquynhtrangbl6d.
    """
    words = body.content.strip().split()
    word_count = len(words)
    if word_count < 15:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bài viết quá ngắn (tối thiểu 15 từ) để AI có thể đánh giá học thuật chuẩn xác."
        )

    try:
        evaluation = await AIWritingService.evaluate_writing(
            topic=body.topic,
            content=body.content,
            genre=body.genre or "ielts_task2",
            target_band=body.target_band or 7.0,
            language=body.language or "en",
            images=body.images
        )

        overall_score = evaluation.get("overall_score")
        criteria = evaluation.get("criteria_scores", {})
        tr_score = criteria.get("task_response", {}).get("score")
        cc_score = criteria.get("coherence_cohesion", {}).get("score")
        lr_score = criteria.get("lexical_resource", {}).get("score")
        gr_score = criteria.get("grammatical_range_accuracy", {}).get("score")

        submission = None
        if body.submission_id:
            stmt = select(WritingSubmission).where(
                WritingSubmission.id == body.submission_id,
                WritingSubmission.user_id == current_user.id
            )
            res = await db.execute(stmt)
            submission = res.scalar_one_or_none()

        if submission:
            submission.topic = body.topic
            submission.genre = body.genre or "ielts_task2"
            submission.language = body.language or "en"
            submission.content = body.content
            submission.word_count = word_count
            submission.target_band = body.target_band or 7.0
            submission.overall_score = overall_score
            submission.task_response_score = tr_score
            submission.coherence_score = cc_score
            submission.lexical_score = lr_score
            submission.grammar_score = gr_score
            submission.feedback_json = json.dumps(evaluation, ensure_ascii=False)
        else:
            # Save new submission to database for history tracking
            submission = WritingSubmission(
                user_id=current_user.id,
                topic=body.topic,
                genre=body.genre or "ielts_task2",
                language=body.language or "en",
                content=body.content,
                word_count=word_count,
                target_band=body.target_band or 7.0,
                overall_score=overall_score,
                task_response_score=tr_score,
                coherence_score=cc_score,
                lexical_score=lr_score,
                grammar_score=gr_score,
                feedback_json=json.dumps(evaluation, ensure_ascii=False)
            )
            db.add(submission)

        await db.commit()
        await db.refresh(submission)

        return {
            "success": True,
            "submission_id": submission.id,
            "word_count": word_count,
            "evaluation": evaluation,
            "created_at": submission.created_at.isoformat() if submission.created_at else None
        }

    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error during essay evaluation: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi hệ thống khi chấm bài: {str(e)}"
        )


@router.get("/history")
async def get_writing_history(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve past writing submissions and scores of the current authenticated user."""
    stmt = (
        select(WritingSubmission)
        .where(WritingSubmission.user_id == current_user.id)
        .order_by(desc(WritingSubmission.created_at))
        .limit(50)
    )
    result = await db.execute(stmt)
    submissions = result.scalars().all()

    return {
        "success": True,
        "items": [s.to_dict() for s in submissions]
    }


@router.get("/submission/{submission_id}")
async def get_submission_detail(
    submission_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve full feedback detail of a specific writing submission."""
    stmt = (
        select(WritingSubmission)
        .where(
            WritingSubmission.id == submission_id,
            WritingSubmission.user_id == current_user.id
        )
    )
    result = await db.execute(stmt)
    submission = result.scalar_one_or_none()

    if not submission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy bài viết này.")

    return {
        "success": True,
        "submission": submission.to_dict()
    }


@router.delete("/submission/{submission_id}")
async def delete_submission(
    submission_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a writing submission."""
    stmt = (
        select(WritingSubmission)
        .where(
            WritingSubmission.id == submission_id,
            WritingSubmission.user_id == current_user.id
        )
    )
    result = await db.execute(stmt)
    submission = result.scalar_one_or_none()

    if not submission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy bài viết này.")

    await db.delete(submission)
    await db.commit()

    return {
        "success": True,
        "message": "Đã xóa bài viết thành công."
    }
