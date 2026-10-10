"""Vocabulary Import, Duplicate Detection and Conflict Resolution Service."""
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional, Callable


def check_vocabulary_duplicates_data(
    candidate_words: List[str],
    existing_items: List[Any]
) -> Dict[str, Any]:
    """Identify duplicate vocabulary entries from candidates matching existing database records."""
    raw_words = [w.strip() for w in candidate_words if w and w.strip()]
    if not raw_words:
        return {'has_duplicates': False, 'duplicates_count': 0, 'duplicates': []}

    duplicates = [
        {
            'id': getattr(item, 'id', None),
            'word': getattr(item, 'word', ''),
            'meaning': getattr(item, 'meaning', None),
            'phonetic': getattr(item, 'phonetic', None),
            'context_sentence': getattr(item, 'context_sentence', None),
            'status': getattr(item, 'status', None),
            'source_lang': getattr(item, 'source_lang', 'en') or 'en',
        }
        for item in existing_items
    ]

    return {
        'has_duplicates': len(duplicates) > 0,
        'duplicates_count': len(duplicates),
        'total_checked': len(raw_words),
        'duplicates': duplicates
    }


def plan_batch_import(
    items: List[Any],
    existing_map: Dict[str, Any],
    conflict_resolution: str = "skip_existing",
    now: Optional[datetime] = None,
    default_source_lang: Optional[str] = "en",
    get_phonetic_fn: Optional[Callable[[str], Optional[str]]] = None
) -> Dict[str, Any]:
    """Plan batch import actions (add, update, skip) according to chosen conflict resolution strategy.
    
    Strategies:
    - 'skip_existing': Keep old record, ignore newly extracted duplicate.
    - 'overwrite': Update existing record with newly extracted info.
    - 'keep_both': Create a brand-new independent record regardless of existing matches.
    """
    if now is None:
        now = datetime.now(timezone.utc)

    conflict_mode = (conflict_resolution or "skip_existing").lower().strip()
    to_add: List[Dict[str, Any]] = []
    to_update: List[Dict[str, Any]] = []
    skipped_count = 0
    added_count = 0
    updated_count = 0

    for item in items:
        word = getattr(item, 'word', None) or item.get('word', '')
        clean_word = word.strip()
        if not clean_word:
            continue

        raw_meaning = getattr(item, 'meaning', None) or (item.get('meaning') if isinstance(item, dict) else '')
        clean_meaning = (raw_meaning or "").strip() or clean_word

        raw_phonetic = getattr(item, 'phonetic', None) or (item.get('phonetic') if isinstance(item, dict) else None)
        phonetic = (raw_phonetic or "").strip() or None

        raw_pos = getattr(item, 'part_of_speech', None) or (item.get('part_of_speech') if isinstance(item, dict) else None)
        part_of_speech = (raw_pos or "").strip() or None

        raw_context = getattr(item, 'context_sentence', None) or (item.get('context_sentence') if isinstance(item, dict) else "")
        context = (raw_context or "").strip()

        raw_img = getattr(item, 'image_url', None) or (item.get('image_url') if isinstance(item, dict) else None)
        image_url = (raw_img or "").strip() or None

        raw_lang = getattr(item, 'source_lang', None) or (item.get('source_lang') if isinstance(item, dict) else None)
        item_lang = (raw_lang or default_source_lang or "en").strip().lower()

        # Enrich IPA for English words if needed
        if not phonetic and item_lang in ("en", "auto") and get_phonetic_fn:
            phonetic = get_phonetic_fn(clean_word)

        key = clean_word.lower()
        is_existing = key in existing_map

        if is_existing and conflict_mode == "skip_existing":
            skipped_count += 1
            continue
        elif is_existing and conflict_mode == "overwrite":
            to_update.append({
                "target": existing_map[key],
                "clean_word": clean_word,
                "meaning": clean_meaning,
                "phonetic": phonetic,
                "part_of_speech": part_of_speech,
                "context_sentence": context,
                "image_url": image_url,
                "source_lang": item_lang,
            })
            updated_count += 1
        else:
            new_record_data = {
                "word": clean_word,
                "phonetic": phonetic,
                "part_of_speech": part_of_speech,
                "meaning": clean_meaning,
                "context_sentence": context,
                "image_url": image_url,
                "source_lang": item_lang,
                "status": 'NEW',
                "next_review_at": now,
                "review_interval_days": 1,
                "mastery_score": 0,
            }
            to_add.append(new_record_data)
            added_count += 1

    return {
        "to_add": to_add,
        "to_update": to_update,
        "added_count": added_count,
        "updated_count": updated_count,
        "skipped_count": skipped_count,
        "conflict_mode": conflict_mode,
    }
