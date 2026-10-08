"""Vocabulary Study and SRS Review API Endpoints."""
import re
import random
from typing import Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_

from app.infrastructure.database.connection import get_db
from app.infrastructure.database.models import User, UserVocabulary
from app.application.auth_service import get_current_user
from app.infrastructure.translation_service import TranslationService
from app.presentation.vocab_schemas import ReviewResultRequest
from app.application.vocab_srs_service import (
    calculate_srs_progress,
    generate_quiz_options,
    FALLBACK_DISTRACTORS,
)

router = APIRouter()
_translation_service = TranslationService()


@router.get('/due-session')
async def get_due_vocab_session(
    limit: int = Query(20, ge=1, le=50),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve words due for review today, enriched with multiple-choice distractors."""
    now = datetime.now(timezone.utc)
    stmt = (
        select(UserVocabulary)
        .where(
            UserVocabulary.user_id == current_user.id,
            or_(
                UserVocabulary.next_review_at == None,
                UserVocabulary.next_review_at <= now,
                UserVocabulary.status != 'MASTERED'
            )
        )
        .order_by(UserVocabulary.created_at.desc())
        .limit(limit)
    )
    res = await db.execute(stmt)
    due_words = res.scalars().all()

    if not due_words:
        stmt_fallback = (
            select(UserVocabulary)
            .where(UserVocabulary.user_id == current_user.id)
            .order_by(UserVocabulary.created_at.desc())
            .limit(limit)
        )
        res_fb = await db.execute(stmt_fallback)
        due_words = res_fb.scalars().all()

    all_meanings_res = await db.execute(
        select(UserVocabulary.meaning)
        .where(
            UserVocabulary.user_id == current_user.id,
            UserVocabulary.meaning != None,
            UserVocabulary.meaning != ""
        )
    )
    user_meanings = [
        m[0] for m in all_meanings_res.all() 
        if m[0] and not re.match(r'^[a-zA-Z\s\-]+$', m[0].strip())
    ]
    combined_pool = list(set(user_meanings + FALLBACK_DISTRACTORS))

    session_items = []
    for w in due_words:
        correct_meaning = w.meaning or ""
        if not correct_meaning or correct_meaning.lower().strip() == w.word.lower().strip():
            try:
                translated = _translation_service.translate(w.word, source_lang='auto', target_lang='vi')
                if translated and translated.lower().strip() != w.word.lower().strip():
                    correct_meaning = translated
                    w.meaning = translated
                    await db.commit()
                else:
                    correct_meaning = "Chưa có nghĩa tiếng Việt"
            except Exception:
                correct_meaning = "Chưa có nghĩa tiếng Việt"

        w_dict = w.to_dict()
        w_dict['meaning'] = correct_meaning
        w_dict['options'] = generate_quiz_options(w.word, correct_meaning, combined_pool)
        session_items.append(w_dict)

    return {'total_due': len(due_words), 'items': session_items}


@router.get('/practice-session')
async def get_practice_session(
    limit: Optional[int] = Query(None, ge=1),
    status_filter: Optional[str] = Query(None, alias='status'),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve words for practice session with multiple-choice distractors."""
    stmt = select(UserVocabulary).where(UserVocabulary.user_id == current_user.id)
    if status_filter and status_filter.upper() != 'ALL':
        stmt = stmt.where(UserVocabulary.status == status_filter.upper())

    res = await db.execute(stmt)
    all_words = list(res.scalars().all())
    total_available = len(all_words)

    if not all_words:
        return {'total_available': 0, 'count': 0, 'items': []}

    if limit and limit < total_available:
        selected_words = random.sample(all_words, limit)
    else:
        selected_words = list(all_words)
        random.shuffle(selected_words)

    all_meanings_res = await db.execute(
        select(UserVocabulary.meaning)
        .where(
            UserVocabulary.user_id == current_user.id,
            UserVocabulary.meaning != None,
            UserVocabulary.meaning != ""
        )
    )
    user_meanings = [
        m[0] for m in all_meanings_res.all() 
        if m[0] and not re.match(r'^[a-zA-Z\s\-]+$', m[0].strip())
    ]
    combined_pool = list(set(user_meanings + FALLBACK_DISTRACTORS))

    session_items = []
    for w in selected_words:
        correct_meaning = (w.meaning or "").strip()
        if not correct_meaning or correct_meaning.lower() == w.word.lower().strip():
            try:
                translated = _translation_service.translate(w.word, source_lang='auto', target_lang='vi')
                if translated and translated.lower().strip() != w.word.lower().strip():
                    correct_meaning = translated
                    w.meaning = translated
                    await db.commit()
                else:
                    correct_meaning = "Chưa có nghĩa tiếng Việt"
            except Exception:
                correct_meaning = "Chưa có nghĩa tiếng Việt"

        w_dict = w.to_dict()
        w_dict['meaning'] = correct_meaning
        w_dict['options'] = generate_quiz_options(w.word, correct_meaning, combined_pool)
        session_items.append(w_dict)

    return {
        'total_available': total_available,
        'count': len(session_items),
        'items': session_items
    }


@router.post('/review-result')
async def submit_vocab_review_result(
    payload: ReviewResultRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Process review outcome (correct/incorrect) and update SRS schedule."""
    res = await db.execute(
        select(UserVocabulary).where(
            UserVocabulary.id == payload.vocab_id,
            UserVocabulary.user_id == current_user.id
        )
    )
    vocab = res.scalar_one_or_none()
    if not vocab:
        raise HTTPException(status_code=404, detail='Từ vựng không tồn tại')

    srs_update = calculate_srs_progress(
        is_correct=payload.is_correct,
        current_score=vocab.mastery_score,
        current_interval=vocab.review_interval_days
    )
    vocab.mastery_score = srs_update["mastery_score"]
    vocab.review_interval_days = srs_update["review_interval_days"]
    vocab.next_review_at = srs_update["next_review_at"]
    vocab.status = srs_update["status"]

    await db.commit()
    await db.refresh(vocab)
    return {'message': 'Đã cập nhật tiến độ học', 'vocab': vocab.to_dict()}
