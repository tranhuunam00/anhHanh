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
from app.infrastructure.database.models import User, UserVocabulary, DictionaryWord
from app.application.auth_service import get_current_user, get_current_user_optional
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
    source_lang: Optional[str] = "en"
    target_lang: Optional[str] = "vi"

    @property
    def effective_timestamp(self) -> Optional[float]:
        if self.video_timestamp is not None:
            return self.video_timestamp
        return self.timestamp


class UpdateStatusRequest(BaseModel):
    status: str = Field(..., pattern='^(NEW|LEARNING|MASTERED)$')


class UpdateImageRequest(BaseModel):
    image_url: str


class UpdateVocabDetailsRequest(BaseModel):
    word: Optional[str] = None
    meaning: Optional[str] = None
    phonetic: Optional[str] = None
    image_url: Optional[str] = None
    context_sentence: Optional[str] = None
    status: Optional[str] = None


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
    src_lang = (payload.source_lang or 'auto').strip().lower()
    tgt_lang = 'vi'  # Mặc định dịch sang tiếng Việt
    meaning = payload.meaning
    if not meaning:
        try:
            translated = _translation_service.translate(clean_word, source_lang=src_lang, target_lang=tgt_lang)
            if (not translated or translated.lower().strip() == clean_word.lower().strip()) and src_lang != 'auto':
                auto_trans = _translation_service.translate(clean_word, source_lang='auto', target_lang=tgt_lang)
                if auto_trans and auto_trans.lower().strip() != clean_word.lower().strip():
                    translated = auto_trans

            if translated and translated.strip():
                meaning = translated.strip()
        except Exception as e:
            logger.warning(f"Translation failed for word '{clean_word}' ({src_lang}->{tgt_lang}): {e}")
            meaning = None

    # Guarantee meaning is never null/empty to satisfy DB constraints
    if not meaning or not meaning.strip():
        meaning = clean_word

    # 3. Auto-fetch image if not provided
    image_url = payload.image_url
    if not image_url:
        try:
            candidates = ImageSearchService.get_image_candidates(
                word=clean_word,
                context_sentence=payload.context_sentence or "",
                meaning=meaning or "",
                max_results=3
            )
            if candidates:
                image_url = candidates[0]
        except Exception as img_err:
            logger.warning(f"Image search failed for '{clean_word}': {img_err}")
            image_url = None

    # Check if word already saved by this user for the same video
    query = select(UserVocabulary).where(
        UserVocabulary.user_id == current_user.id,
        UserVocabulary.word.ilike(clean_word)
    )
    if payload.video_id:
        query = query.where(UserVocabulary.video_id == payload.video_id)

    res = await db.execute(query)
    existing = res.scalars().first()

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

    # Also cache into global DictionaryWord table if not already present
    try:
        dict_check = await db.execute(select(DictionaryWord).where(DictionaryWord.word == clean_word.lower()))
        if not dict_check.scalars().first():
            db.add(DictionaryWord(
                word=clean_word.lower(),
                ipa=phonetic,
                ipa_uk=phonetic,
                ipa_us=phonetic,
                meaning=meaning,
            ))
            await db.commit()
    except Exception:
        pass

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


@router.get('/lookup')
async def quick_lookup_word(
    word: str = Query(..., min_length=1),
    context: Optional[str] = Query(None),
    target_lang: str = Query('vi'),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db)
):
    """Instant dictionary & vocabulary lookup for interactive clicking.
    Checks persistent database table (dictionary_words) first for sub-millisecond retrieval.
    If not cached, fetches from external providers and stores permanently in database.
    """
    clean_word = word.strip().lower()
    if not clean_word:
        raise HTTPException(status_code=400, detail="Word cannot be empty")

    # 1. Check persistent database cache table first (0-1ms query)
    dict_stmt = select(DictionaryWord).where(DictionaryWord.word == clean_word)
    dict_res = await db.execute(dict_stmt)
    cached_dict = dict_res.scalars().first()

    if cached_dict:
        # Instant cache hit from database!
        ipa = cached_dict.ipa
        ipa_uk = cached_dict.ipa_uk
        ipa_us = cached_dict.ipa_us
        part_of_speech = cached_dict.part_of_speech
        definition = cached_dict.definition
        meaning = cached_dict.meaning
    else:
        # Cache miss: query Datamuse & TranslationService
        details = ImageSearchService.get_word_details(clean_word)
        ipa = details.get('ipa')
        ipa_uk = details.get('ipa_uk') or ipa
        ipa_us = details.get('ipa_us') or ipa
        part_of_speech = details.get('part_of_speech')
        definition = details.get('definition')

        meaning = None
        try:
            translated = _translation_service.translate(clean_word, source_lang='en', target_lang=target_lang)
            if not translated or translated.lower().strip() == clean_word.lower().strip():
                auto_trans = _translation_service.translate(clean_word, source_lang='auto', target_lang=target_lang)
                if auto_trans and auto_trans.lower().strip() != clean_word.lower().strip():
                    translated = auto_trans
            if translated and translated.strip():
                meaning = translated.strip()
        except Exception as e:
            logger.warning(f"Translation failed for lookup '{clean_word}': {e}")

        if not meaning or not meaning.strip():
            meaning = clean_word

        # Save to dictionary_words table permanently for instant subsequent lookups
        try:
            new_dict_word = DictionaryWord(
                word=clean_word,
                ipa=ipa,
                ipa_uk=ipa_uk,
                ipa_us=ipa_us,
                part_of_speech=part_of_speech,
                definition=definition,
                meaning=meaning,
            )
            db.add(new_dict_word)
            await db.commit()
        except Exception as db_err:
            await db.rollback()
            logger.debug(f"Could not cache dictionary word '{clean_word}' to DB: {db_err}")

    # 2. Check if already saved in current user's personal notebook
    is_saved = False
    saved_vocab = None
    if current_user:
        query = select(UserVocabulary).where(
            UserVocabulary.user_id == current_user.id,
            UserVocabulary.word.ilike(clean_word)
        )
        res = await db.execute(query)
        existing = res.scalars().first()
        if existing:
            is_saved = True
            saved_vocab = existing.to_dict()
            if existing.meaning:
                meaning = existing.meaning

    return {
        'word': clean_word,
        'ipa': ipa,
        'ipa_uk': ipa_uk,
        'ipa_us': ipa_us,
        'part_of_speech': part_of_speech,
        'definition': definition,
        'meaning': meaning,
        'is_saved': is_saved,
        'saved_vocab': saved_vocab
    }


@router.get('/phonetic')
async def get_word_phonetic_lookup(
    word: str = Query(..., min_length=1),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """Lookup standard IPA phonetic notation for a word or phrase."""
    clean_word = word.strip()
    ipa = ImageSearchService.get_word_phonetic(clean_word)
    return {'word': clean_word, 'phonetic': ipa}


@router.get('/translate')
async def get_word_translation_lookup(
    word: str = Query(..., min_length=1),
    target_lang: str = Query('vi'),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """Translate word to Vietnamese or target language."""
    clean_word = _translation_service.clean_text(word.strip())
    trans = _translation_service.translate(clean_word, source_lang='auto', target_lang=target_lang)
    return {'word': clean_word, 'meaning': trans or clean_word}


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


@router.patch('/{vocab_id}')
async def update_vocabulary_details(
    vocab_id: str,
    payload: UpdateVocabDetailsRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Comprehensive update for vocabulary item (word, IPA phonetic, meaning, image URL, context sentence)."""
    res = await db.execute(
        select(UserVocabulary).where(
            UserVocabulary.id == vocab_id,
            UserVocabulary.user_id == current_user.id
        )
    )
    vocab = res.scalar_one_or_none()
    if not vocab:
        raise HTTPException(status_code=404, detail='Từ vựng không tồn tại')

    word_changed = False
    if payload.word is not None and payload.word.strip():
        new_word = payload.word.strip()
        if new_word.lower() != vocab.word.lower():
            word_changed = True
            vocab.word = new_word

    if payload.meaning is not None:
        clean_meaning = payload.meaning.strip()
        vocab.meaning = clean_meaning or vocab.word
    elif word_changed:
        # Auto-translate if word changed and no custom meaning provided
        try:
            trans = _translation_service.translate(vocab.word, source_lang='auto', target_lang='vi')
            if trans and trans.lower().strip() != vocab.word.lower().strip():
                vocab.meaning = trans.strip()
        except Exception as e:
            logger.warning(f"Auto-translate error on word update: {e}")

    if payload.phonetic is not None:
        clean_ipa = payload.phonetic.strip()
        vocab.phonetic = clean_ipa or None
    elif word_changed:
        # Auto-fetch new IPA if word changed and no custom phonetic provided
        new_ipa = ImageSearchService.get_word_phonetic(vocab.word)
        if new_ipa:
            vocab.phonetic = new_ipa

    if payload.image_url is not None:
        clean_img = payload.image_url.strip()
        vocab.image_url = clean_img or None

    if payload.context_sentence is not None:
        vocab.context_sentence = payload.context_sentence.strip()

    if payload.status is not None and payload.status in ['NEW', 'LEARNING', 'MASTERED']:
        vocab.status = payload.status

    await db.commit()
    await db.refresh(vocab)
    return {'message': 'Đã cập nhật từ vựng thành công', 'vocab': vocab.to_dict()}


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

