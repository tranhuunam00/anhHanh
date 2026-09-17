"""Smart Vocabulary API Endpoints for DailyDictation Studio.
Handles word selection saving, automatic image fetching, IPA phonetic querying,
Vietnamese translation, flashcard status management, and alternative image rotation.
"""
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
    context_sentence: str = Field(..., min_length=1)
    meaning: Optional[str] = None
    phonetic: Optional[str] = None
    image_url: Optional[str] = None
    video_id: Optional[str] = None
    video_timestamp: Optional[float] = None


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

    # 2. Auto-translate meaning if not provided
    meaning = payload.meaning
    if not meaning:
        try:
            meaning = _translation_service.translate(clean_word, source_lang='en', target_lang='vi')
        except Exception:
            meaning = clean_word

    # 3. Auto-fetch image if not provided
    image_url = payload.image_url
    if not image_url:
        candidates = ImageSearchService.get_image_candidates(clean_word, max_results=1)
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
        context_sentence=payload.context_sentence,
        image_url=image_url,
        video_id=payload.video_id,
        video_timestamp=payload.video_timestamp,
        status='NEW'
    )
    db.add(new_vocab)
    await db.commit()
    await db.refresh(new_vocab)

    return {'message': 'Đã lưu từ vựng vào Sổ tay', 'vocab': new_vocab.to_dict()}


@router.get('')
async def list_vocabulary(
    video_id: Optional[str] = None,
    status_filter: Optional[str] = Query(None, alias='status'),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List words saved in current user's vocabulary notebook, strictly isolated by user ID."""
    stmt = select(UserVocabulary).where(UserVocabulary.user_id == current_user.id)

    if video_id:
        stmt = stmt.where(UserVocabulary.video_id == video_id)
    if status_filter:
        stmt = stmt.where(UserVocabulary.status == status_filter.upper())

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
    for s, count in stats_res.all():
        key = s.lower()
        if key in status_counts:
            status_counts[key] = count
        status_counts['total'] += count

    return {
        'stats': status_counts,
        'vocabulary': [w.to_dict() for w in words]
    }


@router.get('/image-candidates')
async def get_image_candidates(
    word: str = Query(..., min_length=1),
    current_user: User = Depends(get_current_user)
):
    """Retrieve multiple image options so user can cycle through and pick their preferred image."""
    candidates = ImageSearchService.get_image_candidates(word.strip(), max_results=6)
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
