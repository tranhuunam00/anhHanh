"""Helper functions for Smart Vocabulary API endpoints.

Extracts auto-enrichment and caching routines to maintain Single Responsibility
and keep presentation API controllers modular and well within line limits.
"""
import json
import logging
import re
import urllib.parse
import urllib.request
from typing import Optional, Tuple, Dict, Any, Callable
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.infrastructure.image_search_service import ImageSearchService
from app.infrastructure.pos_service import normalize_pos_string
from app.infrastructure.database.models import DictionaryWord

logger = logging.getLogger(__name__)


def format_definition_as_context(clean_word: str, raw_definition: Optional[str]) -> str:
    """Format an English dictionary definition into a clean cloze-ready context sentence."""
    if not clean_word or not isinstance(clean_word, str) or not clean_word.strip():
        return ""
    if not raw_definition or not isinstance(raw_definition, str) or not raw_definition.strip():
        return ""

    word_str = clean_word.strip()
    cleaned_def = re.sub(r"^\s*\([^)]+\)\s*", "", raw_definition.strip())
    cleaned_def = re.sub(r"\s*\([^)]+\)\s*$", "", cleaned_def).strip()
    if not cleaned_def:
        return ""

    if cleaned_def[0].isupper() and len(cleaned_def) > 1:
        cleaned_def = cleaned_def[0].lower() + cleaned_def[1:]
    if not cleaned_def.endswith("."):
        cleaned_def += "."

    return f'In English, "{word_str}" means: {cleaned_def}'


def fetch_dictionary_example_sentence(clean_word: str) -> Optional[str]:
    """Fetch a real English example sentence or definition-based context from DictionaryAPI / Datamuse."""
    if not clean_word or not isinstance(clean_word, str):
        return None
    word_str = clean_word.strip()
    if not word_str:
        return None

    stem = word_str.lower()[:4] if len(word_str) >= 4 else word_str.lower()
    fallback_def = None

    try:
        url = f"https://api.dictionaryapi.dev/api/v2/entries/en/{urllib.parse.quote(word_str.lower())}"
        req = urllib.request.Request(url, headers={"User-Agent": "DailyDictationStudio/2.0"})
        with urllib.request.urlopen(req, timeout=2.0) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            if isinstance(data, list):
                for entry in data:
                    for meaning_block in entry.get("meanings", []):
                        for d in meaning_block.get("definitions", []):
                            ex = (d.get("example") or "").strip()
                            if ex and stem in ex.lower():
                                return ex
                            if not fallback_def and d.get("definition"):
                                fallback_def = d.get("definition").strip()
    except Exception:
        pass

    if not fallback_def:
        try:
            details = ImageSearchService.get_word_details(word_str.lower())
            fallback_def = details.get("definition")
        except Exception:
            fallback_def = None

    if fallback_def:
        formatted = format_definition_as_context(word_str, fallback_def)
        return formatted if formatted else None

    return None


def resolve_word_context_helper(
    clean_word: str,
    provided_context: Optional[str],
    src_lang: str = "en",
    fetch_example_fn: Optional[Callable[[str], Optional[str]]] = None
) -> str:
    """Resolve user-provided context sentence or auto-fetch a real example/definition sentence."""
    if provided_context and isinstance(provided_context, str) and provided_context.strip():
        return provided_context.strip()

    if not clean_word or not isinstance(clean_word, str) or not clean_word.strip():
        return ""

    norm_lang = (src_lang or "en").strip().lower()
    if norm_lang not in ("en", "auto"):
        return ""

    lookup_fn = fetch_example_fn or fetch_dictionary_example_sentence
    try:
        auto_sentence = lookup_fn(clean_word.strip())
        if auto_sentence and isinstance(auto_sentence, str) and auto_sentence.strip():
            return auto_sentence.strip()
    except Exception as e:
        logger.debug(f"Auto example lookup skipped for '{clean_word}': {e}")

    return ""


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
    if provided_image_url is not None:
        clean_img = provided_image_url.strip()
        # If user explicitly provided empty string or whitespace, honor user's wish (no image)
        return clean_img if clean_img else None

    # Only auto-search if image_url was not provided (e.g. None from quick video save)
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
