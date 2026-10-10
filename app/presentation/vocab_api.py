"""Smart Vocabulary Notebook Core API Endpoints for DailyDictation Studio."""
import logging
from typing import Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.infrastructure.database.connection import get_db
from app.infrastructure.database.models import User, UserVocabulary, DictionaryWord
from app.application.auth_service import get_current_user, get_current_user_optional
from app.infrastructure.image_search_service import ImageSearchService
from app.infrastructure.translation_service import TranslationService

from app.presentation.vocab_schemas import (
    CreateVocabRequest, UpdateStatusRequest, UpdateImageRequest,
    UpdateVocabDetailsRequest, CheckVocabDuplicatesRequest,
    BatchImportVocabRequest, BatchImportVocabItem,
)
from app.presentation.vocab_study_api import router as vocab_study_router
from app.presentation.vocab_import_api import router as vocab_import_router

logger = logging.getLogger(__name__)
router = APIRouter(prefix='/api/vocab', tags=['Vocabulary'])
_translation_service = TranslationService()

# Include sub-routers under the same /api/vocab namespace
router.include_router(vocab_study_router)
router.include_router(vocab_import_router)


from app.infrastructure.pos_service import normalize_pos_string
from app.presentation.vocab_api_helpers import (
    resolve_word_meaning_helper,
    resolve_word_pos_helper,
    resolve_word_image_helper,
    cache_dictionary_word_safely,
)


@router.post('')
async def save_vocabulary_word(
    payload: CreateVocabRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Save a new word to the user's Smart Vocabulary notebook with auto-enriched metadata."""
    clean_word = payload.word.strip()
    src_lang = (payload.source_lang or 'auto').strip().lower()
    tgt_lang = 'vi'

    phonetic = payload.phonetic
    if not phonetic and src_lang in ('en', 'auto'):
        phonetic = ImageSearchService.get_word_phonetic(clean_word)

    meaning = resolve_word_meaning_helper(clean_word, payload.meaning, src_lang, tgt_lang, _translation_service)
    part_of_speech = resolve_word_pos_helper(clean_word, payload.part_of_speech)
    image_url = resolve_word_image_helper(clean_word, payload.image_url, payload.context_sentence or "", meaning)

    query = select(UserVocabulary).where(
        UserVocabulary.user_id == current_user.id,
        UserVocabulary.word.ilike(clean_word)
    )
    if payload.video_id:
        query = query.where(UserVocabulary.video_id == payload.video_id)

    res = await db.execute(query)
    existing = res.scalars().first()

    if existing:
        existing.meaning = meaning or existing.meaning
        if phonetic:
            existing.phonetic = phonetic
        if part_of_speech:
            existing.part_of_speech = part_of_speech
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
        part_of_speech=part_of_speech,
        meaning=meaning,
        context_sentence=payload.context_sentence or "",
        image_url=image_url,
        video_id=payload.video_id,
        video_timestamp=payload.effective_timestamp,
        source_lang=src_lang if src_lang != 'auto' else 'en',
        status='NEW',
        next_review_at=datetime.now(timezone.utc),
        review_interval_days=1,
        mastery_score=0
    )
    db.add(new_vocab)
    await db.commit()
    await db.refresh(new_vocab)

    await cache_dictionary_word_safely(
        db=db,
        clean_word=clean_word,
        ipa=phonetic,
        ipa_uk=phonetic,
        ipa_us=phonetic,
        part_of_speech=part_of_speech,
        definition=None,
        meaning=meaning
    )

    return {'message': 'Đã lưu từ vựng vào Sổ tay', 'vocab': new_vocab.to_dict()}


@router.get('')
async def list_vocabulary(
    video_id: Optional[str] = None,
    source_lang: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias='status'),
    search: Optional[str] = Query(None),
    page: Optional[int] = Query(None, ge=1),
    page_size: Optional[int] = Query(None, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List words saved in current user's vocabulary notebook, strictly isolated by user ID."""
    stmt = select(UserVocabulary).where(UserVocabulary.user_id == current_user.id)
    if video_id:
        stmt = stmt.where(UserVocabulary.video_id == video_id)
    if source_lang and source_lang.strip() and source_lang.lower() != 'all':
        stmt = stmt.where(UserVocabulary.source_lang == source_lang.strip().lower())
    if status_filter and status_filter.upper() != 'ALL':
        stmt = stmt.where(UserVocabulary.status == status_filter.upper())
    if search and search.strip():
        s = f"%{search.strip()}%"
        stmt = stmt.where((UserVocabulary.word.ilike(s)) | (UserVocabulary.meaning.ilike(s)))

    stmt = stmt.order_by(UserVocabulary.created_at.desc())
    res = await db.execute(stmt)
    all_words = res.scalars().all()

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

    total_filtered = len(all_words)
    if page is not None and page_size is not None:
        offset = (page - 1) * page_size
        words = all_words[offset:offset + page_size]
        total_pages = (total_filtered + page_size - 1) // page_size if page_size > 0 else 1
    else:
        words = all_words
        total_pages = 1

    word_dicts = [w.to_dict() for w in words]
    return {
        'items': word_dicts,
        'vocabulary': word_dicts,
        'total': status_counts['total'],
        'filtered_total': total_filtered,
        'page': page or 1,
        'page_size': page_size or total_filtered,
        'total_pages': total_pages,
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
    """Instant dictionary & vocabulary lookup."""
    clean_word = word.strip().lower()
    if not clean_word:
        raise HTTPException(status_code=400, detail="Word cannot be empty")

    dict_stmt = select(DictionaryWord).where(DictionaryWord.word == clean_word)
    dict_res = await db.execute(dict_stmt)
    cached_dict = dict_res.scalars().first()

    if cached_dict:
        ipa, ipa_uk, ipa_us = cached_dict.ipa, cached_dict.ipa_uk, cached_dict.ipa_us
        part_of_speech, definition, meaning = cached_dict.part_of_speech, cached_dict.definition, cached_dict.meaning
        part_of_speech = normalize_pos_string(part_of_speech)
    else:
        details = ImageSearchService.get_word_details(clean_word)
        ipa = details.get('ipa')
        ipa_uk = details.get('ipa_uk') or ipa
        ipa_us = details.get('ipa_us') or ipa
        part_of_speech = normalize_pos_string(details.get('part_of_speech'))
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
            if existing.part_of_speech:
                part_of_speech = existing.part_of_speech

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
    """Re-fetch Vietnamese meaning for an existing vocabulary word or phrase."""
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
    for prefix in ['auto', 'en', 'ja', 'fr', 'de', 'es', 'zh', 'ko']:
        cache_key = f"{prefix}_vi_{clean_word}"
        if cache_key in _translation_service.memory_cache:
            del _translation_service.memory_cache[cache_key]

    try:
        translated = _translation_service.translate(clean_word, source_lang='auto', target_lang='vi')
        if not translated or translated.lower().strip() == clean_word.lower().strip():
            fallback_trans = _translation_service.translate(clean_word, source_lang='en', target_lang='vi')
            if fallback_trans and fallback_trans.lower().strip() != clean_word.lower().strip():
                translated = fallback_trans

        if translated and translated.strip():
            vocab.meaning = translated.strip()
            await db.commit()
            await db.refresh(vocab)
            return {'message': 'Đã cập nhật nghĩa tiếng Việt thành công', 'vocab': vocab.to_dict()}
    except Exception as e:
        logger.warning(f"Error refreshing meaning for word '{clean_word}': {e}")

    return {'message': 'Giữ nguyên nghĩa hiện tại', 'vocab': vocab.to_dict()}


@router.put('/{vocab_id}')
@router.patch('/{vocab_id}')
async def update_vocabulary_details(
    vocab_id: str,
    payload: UpdateVocabDetailsRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update all editable fields of a vocabulary word."""
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
        if new_word != vocab.word:
            vocab.word = new_word
            word_changed = True

    if payload.meaning is not None:
        clean_meaning = payload.meaning.strip()
        vocab.meaning = clean_meaning or vocab.word
    elif word_changed:
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

    if payload.part_of_speech is not None:
        vocab.part_of_speech = normalize_pos_string(payload.part_of_speech)

    if payload.source_lang is not None and payload.source_lang.strip():
        vocab.source_lang = payload.source_lang.strip().lower()

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
