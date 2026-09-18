"""Smart Vocabulary API Endpoints for DailyDictation Studio.
Handles word selection saving, automatic image fetching, IPA phonetic querying,
Vietnamese translation, flashcard status management, and alternative image rotation.
"""
import re
import logging
from typing import Optional, List
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.infrastructure.database.connection import get_db
from app.infrastructure.database.models import User, UserVocabulary
from app.application.auth_service import get_current_user
from app.infrastructure.image_search_service import ImageSearchService
from app.infrastructure.translation_service import TranslationService

logger = logging.getLogger(__name__)

router = APIRouter(prefix='/api/vocab', tags=['Vocabulary'])
_translation_service = TranslationService()


class CreateVocabRequest(BaseModel):
    word: str = Field(..., min_length=1, max_length=100)
    context_sentence: Optional[str] = ""
    meaning: Optional[str] = None
    phonetic: Optional[str] = None
    image_url: Optional[str] = None
    video_id: Optional[str] = None
    video_timestamp: Optional[float] = None
    timestamp: Optional[float] = None

    @property
    def effective_timestamp(self) -> Optional[float]:
        if self.video_timestamp is not None:
            return self.video_timestamp
        return self.timestamp


class UpdateStatusRequest(BaseModel):
    status: str = Field(..., pattern='^(NEW|LEARNING|MASTERED)$')


class UpdateImageRequest(BaseModel):
    image_url: str


@router.post('')
async def save_vocabulary_word(
    payload: CreateVocabRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Save a new word to the user's Smart Vocabulary notebook with auto-enriched metadata."""
    clean_word = payload.word.strip()

    # 1. Auto-fetch phonetic IPA if not provided
    phonetic = payload.phonetic
    if not phonetic:
        phonetic = ImageSearchService.get_word_phonetic(clean_word)

    # 2. Auto-translate meaning to Vietnamese if not provided
    meaning = payload.meaning
    if not meaning:
        try:
            translated = _translation_service.translate(clean_word, source_lang='auto', target_lang='vi')
            # Only accept translation if it's different from the source word (i.e., actually translated)
            if translated and translated.lower().strip() != clean_word.lower().strip():
                meaning = translated
            else:
                meaning = None  # Will display nothing rather than English word
        except Exception:
            meaning = None

    # 3. Auto-fetch image if not provided
    image_url = payload.image_url
    if not image_url:
        candidates = ImageSearchService.get_image_candidates(
            word=clean_word,
            context_sentence=payload.context_sentence or "",
            meaning=meaning or "",
            max_results=3
        )
        if candidates:
            image_url = candidates[0]

    # Check if word already saved by this user for the same video
    query = select(UserVocabulary).where(
        UserVocabulary.user_id == current_user.id,
        UserVocabulary.word.ilike(clean_word)
    )
    if payload.video_id:
        query = query.where(UserVocabulary.video_id == payload.video_id)

    res = await db.execute(query)
    existing = res.scalar_one_or_none()

    if existing:
        # Update existing record
        existing.meaning = meaning or existing.meaning
        if phonetic:
            existing.phonetic = phonetic
        if image_url:
            existing.image_url = image_url
        if payload.context_sentence:
            existing.context_sentence = payload.context_sentence
        await db.commit()
        await db.refresh(existing)
        return {'message': 'Đã cập nhật từ vựng', 'vocab': existing.to_dict()}

    new_vocab = UserVocabulary(
        user_id=current_user.id,
        word=clean_word,
        phonetic=phonetic,
        meaning=meaning,
        context_sentence=payload.context_sentence or "",
        image_url=image_url,
        video_id=payload.video_id,
        video_timestamp=payload.effective_timestamp,
        status='NEW',
        next_review_at=datetime.now(timezone.utc),
        review_interval_days=1,
        mastery_score=0
    )
    db.add(new_vocab)
    await db.commit()
    await db.refresh(new_vocab)

    return {'message': 'Đã lưu từ vựng vào Sổ tay', 'vocab': new_vocab.to_dict()}


@router.get('')
async def list_vocabulary(
    video_id: Optional[str] = None,
    status_filter: Optional[str] = Query(None, alias='status'),
    search: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List words saved in current user's vocabulary notebook, strictly isolated by user ID."""
    stmt = select(UserVocabulary).where(UserVocabulary.user_id == current_user.id)

    if video_id:
        stmt = stmt.where(UserVocabulary.video_id == video_id)
    if status_filter and status_filter.upper() != 'ALL':
        stmt = stmt.where(UserVocabulary.status == status_filter.upper())
    if search and search.strip():
        s = f"%{search.strip()}%"
        stmt = stmt.where((UserVocabulary.word.ilike(s)) | (UserVocabulary.meaning.ilike(s)))

    stmt = stmt.order_by(UserVocabulary.created_at.desc())
    res = await db.execute(stmt)
    words = res.scalars().all()

    # Calculate status counts
    stats_res = await db.execute(
        select(UserVocabulary.status, func.count(UserVocabulary.id))
        .where(UserVocabulary.user_id == current_user.id)
        .group_by(UserVocabulary.status)
    )
    status_counts = {'total': 0, 'new': 0, 'learning': 0, 'mastered': 0}
    for s_val, count in stats_res.all():
        key = s_val.lower()
        if key in status_counts:
            status_counts[key] = count
        status_counts['total'] += count

    word_dicts = [w.to_dict() for w in words]
    return {
        'items': word_dicts,
        'vocabulary': word_dicts,
        'total': status_counts['total'],
        'stats': status_counts
    }


@router.get('/image-candidates')
async def get_image_candidates(
    word: str = Query(..., min_length=1),
    context_sentence: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user)
):
    """Retrieve multiple image options so user can cycle through and pick their preferred image."""
    candidates = ImageSearchService.get_image_candidates(
        word=word.strip(),
        context_sentence=context_sentence or "",
        max_results=8
    )
    return {'word': word, 'candidates': candidates}


@router.patch('/{vocab_id}/status')
async def update_vocabulary_status(
    vocab_id: str,
    payload: UpdateStatusRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update learning status: NEW -> LEARNING -> MASTERED."""
    res = await db.execute(
        select(UserVocabulary).where(
            UserVocabulary.id == vocab_id,
            UserVocabulary.user_id == current_user.id
        )
    )
    vocab = res.scalar_one_or_none()
    if not vocab:
        raise HTTPException(status_code=404, detail='Từ vựng không tồn tại')

    vocab.status = payload.status
    await db.commit()
    await db.refresh(vocab)
    return {'message': 'Đã cập nhật trạng thái', 'vocab': vocab.to_dict()}


@router.patch('/{vocab_id}/image')
async def update_vocabulary_image(
    vocab_id: str,
    payload: UpdateImageRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update visual illustration image for flashcard."""
    res = await db.execute(
        select(UserVocabulary).where(
            UserVocabulary.id == vocab_id,
            UserVocabulary.user_id == current_user.id
        )
    )
    vocab = res.scalar_one_or_none()
    if not vocab:
        raise HTTPException(status_code=404, detail='Từ vựng không tồn tại')

    vocab.image_url = payload.image_url
    await db.commit()
    await db.refresh(vocab)
    return {'message': 'Đã đổi ảnh minh họa', 'vocab': vocab.to_dict()}


@router.patch('/{vocab_id}/meaning')
async def refresh_vocabulary_meaning(
    vocab_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Re-fetch Vietnamese meaning for an existing vocabulary word or phrase.

    Useful when old words were saved without translation or cached with bad fallback.
    """
    res = await db.execute(
        select(UserVocabulary).where(
            UserVocabulary.id == vocab_id,
            UserVocabulary.user_id == current_user.id
        )
    )
    vocab = res.scalar_one_or_none()
    if not vocab:
        raise HTTPException(status_code=404, detail='Từ vựng không tồn tại')

    clean_word = _translation_service.clean_text(vocab.word)

    # Invalidate cache entries across possible source language keys
    for prefix in ['auto', 'en', 'ja', 'fr', 'de', 'es', 'zh', 'ko']:
        cache_key = f"{prefix}_vi_{clean_word}"
        if cache_key in _translation_service.memory_cache:
            del _translation_service.memory_cache[cache_key]

    try:
        # Force fresh translation via Google Translate (auto-detect source language to Vietnamese)
        translated = _translation_service.translate(clean_word, source_lang='auto', target_lang='vi')
        if not translated:
            translated = _translation_service._fetch_google(clean_word, source_lang='auto', target_lang='vi')
        if not translated:
            translated = _translation_service._fetch_mymemory(clean_word, source_lang='en', target_lang='vi')

        if translated and translated.lower().strip() != clean_word.lower().strip():
            vocab.meaning = translated
            await db.commit()
            await db.refresh(vocab)
            return {'message': f'Đã cập nhật nghĩa: {translated}', 'vocab': vocab.to_dict()}
        else:
            raise HTTPException(status_code=400, detail='Không tìm được nghĩa tiếng Việt cho từ/cụm từ này')
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Lỗi khi dịch: {str(e)}')


@router.delete('/{vocab_id}')
async def delete_vocabulary_word(
    vocab_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a word from personal notebook."""
    res = await db.execute(
        select(UserVocabulary).where(
            UserVocabulary.id == vocab_id,
            UserVocabulary.user_id == current_user.id
        )
    )
    vocab = res.scalar_one_or_none()
    if not vocab:
        raise HTTPException(status_code=404, detail='Từ vựng không tồn tại')

    await db.delete(vocab)
    await db.commit()
    return {'message': 'Đã xóa từ khỏi Sổ tay'}


import random
from datetime import datetime, timezone, timedelta
from sqlalchemy import or_

FALLBACK_DISTRACTORS = [
    "thành công", "phát triển", "bắt đầu", "kết quả", "thay đổi",
    "quan trọng", "di chuyển", "tự nhiên", "hoàn thành", "kinh nghiệm",
    "cơ hội", "mục tiêu", "thử thách", "kiến thức", "quyết định"
]


class ReviewResultRequest(BaseModel):
    vocab_id: str
    is_correct: bool


@router.get('/due-session')
async def get_due_vocab_session(
    limit: int = Query(20, ge=1, le=50),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve words due for review today, enriched with multiple-choice distractors."""
    now = datetime.now(timezone.utc)

    # Query words due for review (next_review_at <= now OR next_review_at IS NULL OR status != 'MASTERED')
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

    # Fallback: if no strict due words, return latest notebook words for practice
    if not due_words:
        stmt_fallback = (
            select(UserVocabulary)
            .where(UserVocabulary.user_id == current_user.id)
            .order_by(UserVocabulary.created_at.desc())
            .limit(limit)
        )
        res_fb = await db.execute(stmt_fallback)
        due_words = res_fb.scalars().all()

    # Also fetch user's other meanings for realistic distractors (exclude English words where meaning == word)
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

        # Guard: If meaning is missing or identical to the English word (old data fallback), translate to Vietnamese
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

        # Filter candidates so distractors are strictly Vietnamese and distinct from correct_meaning & word
        other_candidates = [
            m for m in combined_pool 
            if m.lower().strip() != correct_meaning.lower().strip() 
            and m.lower().strip() != w.word.lower().strip()
            and not re.match(r'^[a-zA-Z\s\-]+$', m.strip())
        ]
        selected_distractors = random.sample(other_candidates, min(3, len(other_candidates)))

        fallback_idx = 0
        while len(selected_distractors) < 3:
            dummy = FALLBACK_DISTRACTORS[fallback_idx % len(FALLBACK_DISTRACTORS)]
            fallback_idx += 1
            if dummy.lower().strip() != correct_meaning.lower().strip() and dummy not in selected_distractors:
                selected_distractors.append(dummy)

        options = selected_distractors + [correct_meaning]
        random.shuffle(options)

        w_dict['options'] = options
        session_items.append(w_dict)

    return {
        'total_due': len(due_words),
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

    now = datetime.now(timezone.utc)

    if payload.is_correct:
        vocab.mastery_score = (vocab.mastery_score or 0) + 1
        curr_int = vocab.review_interval_days or 1
        if curr_int == 1:
            next_int = 3
        elif curr_int == 3:
            next_int = 7
        elif curr_int == 7:
            next_int = 14
        else:
            next_int = 30

        vocab.review_interval_days = next_int
        vocab.next_review_at = now + timedelta(days=next_int)

        if vocab.mastery_score >= 4:
            vocab.status = 'MASTERED'
        else:
            vocab.status = 'LEARNING'
    else:
        vocab.mastery_score = max(0, (vocab.mastery_score or 0) - 1)
        vocab.review_interval_days = 1
        vocab.next_review_at = now + timedelta(days=1)
        vocab.status = 'LEARNING'

    await db.commit()
    await db.refresh(vocab)
    return {'message': 'Đã cập nhật tiến độ học', 'vocab': vocab.to_dict()}

