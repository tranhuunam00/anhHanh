"""Helper functions for Smart Vocabulary API endpoints.

Extracts auto-enrichment and caching routines to maintain Single Responsibility
and keep presentation API controllers modular and well within line limits.
"""
import logging
from typing import Optional, Tuple, Dict, Any
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.infrastructure.image_search_service import ImageSearchService
from app.infrastructure.pos_service import normalize_pos_string
from app.infrastructure.database.models import DictionaryWord

logger = logging.getLogger(__name__)


def resolve_word_meaning_helper(
    clean_word: str,
    provided_meaning: Optional[str],
    src_lang: str,
    tgt_lang: str,
    translation_service: Any
) -> str:
    """Resolve and sanitize Vietnamese/target language translation for a vocabulary word."""
    if provided_meaning and provided_meaning.strip():
        return provided_meaning.strip()

    meaning = None
    try:
        translated = translation_service.translate(clean_word, source_lang=src_lang, target_lang=tgt_lang)
        if (not translated or translated.lower().strip() == clean_word.lower().strip()) and src_lang != 'auto':
            auto_trans = translation_service.translate(clean_word, source_lang='auto', target_lang=tgt_lang)
            if auto_trans and auto_trans.lower().strip() != clean_word.lower().strip():
                translated = auto_trans
        if translated and translated.strip():
            meaning = translated.strip()
    except Exception as e:
        logger.warning(f"Translation failed for word '{clean_word}' ({src_lang}->{tgt_lang}): {e}")

    return meaning if (meaning and meaning.strip()) else clean_word


def resolve_word_pos_helper(
    clean_word: str,
    provided_pos: Optional[str]
) -> Optional[str]:
    """Normalize and format single or multiple parts of speech for any language."""
    if provided_pos and provided_pos.strip():
        return normalize_pos_string(provided_pos.strip())

    # Fallback for multi-word phrases
    if " " in clean_word.strip():
        return "phrase"

    # Query details from image/dictionary service
    details = ImageSearchService.get_word_details(clean_word.strip().lower())
    found_pos = details.get("part_of_speech")
    if found_pos:
        return normalize_pos_string(found_pos)

    return None


def resolve_word_image_helper(
    clean_word: str,
    provided_image_url: Optional[str],
    context_sentence: str,
    meaning: str
) -> Optional[str]:
    """Auto-search relevant thumbnail illustration candidates for a word."""
    if provided_image_url and provided_image_url.strip():
        return provided_image_url.strip()

    try:
        candidates = ImageSearchService.get_image_candidates(
            word=clean_word,
            context_sentence=context_sentence or "",
            meaning=meaning or "",
            max_results=3
        )
        if candidates:
            return candidates[0]
    except Exception as img_err:
        logger.warning(f"Image search failed for '{clean_word}': {img_err}")

    return None


async def cache_dictionary_word_safely(
    db: AsyncSession,
    clean_word: str,
    ipa: Optional[str],
    ipa_uk: Optional[str],
    ipa_us: Optional[str],
    part_of_speech: Optional[str],
    definition: Optional[str],
    meaning: str
) -> None:
    """Idempotently insert newly fetched dictionary metadata into cache."""
    try:
        dict_check = await db.execute(select(DictionaryWord).where(DictionaryWord.word == clean_word.lower()))
        if not dict_check.scalars().first():
            db.add(DictionaryWord(
                word=clean_word.lower(),
                ipa=ipa,
                ipa_uk=ipa_uk,
                ipa_us=ipa_us,
                part_of_speech=normalize_pos_string(part_of_speech),
                definition=definition,
                meaning=meaning,
            ))
            await db.commit()
    except Exception as e:
        await db.rollback()
        logger.debug(f"Could not cache dictionary word '{clean_word}': {e}")
