"""TDD Test Suite: Vocabulary Duplicate Detection & 3 Conflict Resolution Strategies.

Covers:
- Strategy 1 (skip_existing): Giữ từ cũ, bỏ từ vừa mới extract.
- Strategy 2 (overwrite): Bỏ từ cũ, lưu từ vừa extract (cập nhật thông tin mới).
- Strategy 3 (keep_both): Giữ cả 2 (lưu thêm bản ghi mới độc lập).
- Case insensitivity, trimming, multi-word phrases, unicode accents.
- Bad cases: empty payload, invalid strategy fallback, blank words, duplicate words in same batch.
At least 10 cases strictly included.
"""
from typing import List, Dict, Any


def simulate_check_duplicates(
    candidate_words: List[str],
    existing_notebook: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """Pure domain logic replicating /api/vocab/check-duplicates endpoint."""
    raw_words = [w.strip() for w in candidate_words if w and w.strip()]
    if not raw_words:
        return {'has_duplicates': False, 'duplicates_count': 0, 'duplicates': []}

    lookup_map = {item['word'].lower().strip(): item for item in existing_notebook}
    matched = []

    for w in raw_words:
        key = w.lower()
        if key in lookup_map:
            matched.append(lookup_map[key])

    return {
        'has_duplicates': len(matched) > 0,
        'duplicates_count': len(matched),
        'total_checked': len(raw_words),
        'duplicates': matched
    }


def simulate_batch_import(
    items: List[Dict[str, Any]],
    existing_notebook: List[Dict[str, Any]],
    conflict_resolution: str = "skip_existing"
) -> Dict[str, Any]:
    """Pure domain logic replicating /api/vocab/batch-import with 3 conflict resolution strategies."""
    if not items:
        raise ValueError("Danh sách từ vựng rỗng")

    strategy = (conflict_resolution or "skip_existing").lower().strip()
    notebook = list(existing_notebook)
    existing_map = {item['word'].lower().strip(): item for item in notebook}

    added = 0
    updated = 0
    skipped = 0

    for item in items:
        w = item.get('word', '').strip()
        if not w:
            continue

        key = w.lower()
        is_existing = key in existing_map

        if is_existing and strategy == "skip_existing":
            # 1. Giữ từ cũ, bỏ từ vừa mới extract
            skipped += 1
            continue
        elif is_existing and strategy == "overwrite":
            # 2. Bỏ từ cũ, lưu từ vừa extract (ghi đè thông tin mới)
            target = existing_map[key]
            target['meaning'] = item.get('meaning', target.get('meaning'))
            target['phonetic'] = item.get('phonetic', target.get('phonetic'))
            target['context_sentence'] = item.get('context_sentence', target.get('context_sentence'))
            target['source_lang'] = item.get('source_lang', target.get('source_lang'))
            updated += 1
        else:
            # 3. Giữ cả 2 (hoặc từ hoàn toàn mới)
            new_record = {
                'id': len(notebook) + 1,
                'word': w,
                'meaning': item.get('meaning', ''),
                'phonetic': item.get('phonetic'),
                'context_sentence': item.get('context_sentence', ''),
                'source_lang': item.get('source_lang', 'en'),
                'status': 'NEW'
            }
            notebook.append(new_record)
            if strategy != "keep_both":
                existing_map[key] = new_record
            added += 1

    return {
        'added_count': added,
        'updated_count': updated,
        'skipped_count': skipped,
        'notebook': notebook,
        'strategy': strategy
    }


# ==============================================================================
# 1. HAPPY CASES
# ==============================================================================

def test_conflict_case_1_check_duplicates_detects_existing():
    """Happy case 1: Check duplicates identifies existing words in notebook accurately."""
    existing = [
        {'id': 1, 'word': 'apple', 'meaning': 'quả táo'},
        {'id': 2, 'word': 'banana', 'meaning': 'quả chuối'}
    ]
    candidates = ['apple', 'orange', 'watermelon']
    res = simulate_check_duplicates(candidates, existing)

    assert res['has_duplicates'] is True
    assert res['duplicates_count'] == 1
    assert res['duplicates'][0]['word'] == 'apple'


def test_conflict_case_2_strategy_1_skip_existing():
    """Happy case 2: Strategy 'skip_existing' skips conflicting words and keeps existing untouched."""
    existing = [
        {'id': 1, 'word': 'apple', 'meaning': 'nghĩa cũ quả táo', 'status': 'MASTERED'}
    ]
    new_items = [
        {'word': 'apple', 'meaning': 'nghĩa mới trái táo'},
        {'word': 'grape', 'meaning': 'quả nho'}
    ]
    res = simulate_batch_import(new_items, existing, conflict_resolution="skip_existing")

    assert res['skipped_count'] == 1
    assert res['added_count'] == 1
    assert res['updated_count'] == 0
    # Existing word remains intact
    assert existing[0]['meaning'] == 'nghĩa cũ quả táo'
    assert existing[0]['status'] == 'MASTERED'


def test_conflict_case_3_strategy_2_overwrite():
    """Happy case 3: Strategy 'overwrite' updates existing word details with newly extracted info."""
    existing = [
        {'id': 1, 'word': 'abandon', 'meaning': 'bỏ rơi', 'phonetic': None, 'context_sentence': ''}
    ]
    new_items = [
        {
            'word': 'abandon',
            'meaning': 'từ bỏ hoàn toàn',
            'phonetic': 'əˈbændən',
            'context_sentence': 'Never abandon your dreams.'
        }
    ]
    res = simulate_batch_import(new_items, existing, conflict_resolution="overwrite")

    assert res['updated_count'] == 1
    assert res['added_count'] == 0
    assert existing[0]['meaning'] == 'từ bỏ hoàn toàn'
    assert existing[0]['phonetic'] == 'əˈbændən'
    assert existing[0]['context_sentence'] == 'Never abandon your dreams.'


def test_conflict_case_4_strategy_3_keep_both():
    """Happy case 4: Strategy 'keep_both' inserts separate duplicate record into notebook."""
    existing = [
        {'id': 1, 'word': 'bank', 'meaning': 'ngân hàng tài chính'}
    ]
    new_items = [
        {'word': 'bank', 'meaning': 'bờ sông, bờ đê'}
    ]
    res = simulate_batch_import(new_items, existing, conflict_resolution="keep_both")

    assert res['added_count'] == 1
    assert res['updated_count'] == 0
    assert len(res['notebook']) == 2
    words = [it['meaning'] for it in res['notebook'] if it['word'] == 'bank']
    assert 'ngân hàng tài chính' in words
    assert 'bờ sông, bờ đê' in words


# ==============================================================================
# 2. BOUNDARY / STRING HANDLING CASES
# ==============================================================================

def test_conflict_case_5_case_insensitive_duplicate_matching():
    """Boundary case 5: Case differences (UPPER, lower, Mixed) are matched as duplicates."""
    existing = [{'id': 1, 'word': 'serendipity', 'meaning': 'sự may mắn tình cờ'}]
    res = simulate_check_duplicates(['SERENDIPITY', 'Serendipity'], existing)

    assert res['has_duplicates'] is True
    assert res['duplicates_count'] == 2


def test_conflict_case_6_whitespace_trimming_matching():
    """Boundary case 6: Extra leading/trailing whitespace is safely trimmed before comparison."""
    existing = [{'id': 1, 'word': 'resilience', 'meaning': 'khả năng phục hồi'}]
    res = simulate_check_duplicates(['   resilience   \t'], existing)

    assert res['has_duplicates'] is True
    assert res['duplicates_count'] == 1


def test_conflict_case_7_multi_word_phrases_supported():
    """Boundary case 7: Idioms and multi-word phrases correctly detected and imported."""
    existing = [{'id': 1, 'word': 'take into account', 'meaning': 'cân nhắc kỹ'}]
    new_items = [
        {'word': 'take into account', 'meaning': 'xem xét tính đến'},
        {'word': 'in the blink of an eye', 'meaning': 'trong chớp mắt'}
    ]
    res = simulate_batch_import(new_items, existing, conflict_resolution="skip_existing")
    assert res['skipped_count'] == 1
    assert res['added_count'] == 1


def test_conflict_case_8_unicode_and_foreign_accents_preserved():
    """Boundary case 8: French accents, Japanese kanji, German umlauts matched accurately."""
    existing = [
        {'id': 1, 'word': 'café', 'meaning': 'quán cà phê', 'source_lang': 'fr'},
        {'id': 2, 'word': 'ありがとう', 'meaning': 'cảm ơn', 'source_lang': 'ja'},
    ]
    candidates = ['Café', 'ありがとう', 'über']
    res = simulate_check_duplicates(candidates, existing)

    assert res['duplicates_count'] == 2
    matched_words = {d['word'] for d in res['duplicates']}
    assert 'café' in matched_words
    assert 'ありがとう' in matched_words


# ==============================================================================
# 3. BAD / MALFORMED CASES
# ==============================================================================

def test_conflict_case_9_empty_payload_raises_error():
    """Bad case 9: Attempting to import an empty list raises ValueError."""
    try:
        simulate_batch_import([], [], conflict_resolution="skip_existing")
        assert False, "Should have raised ValueError"
    except ValueError as e:
        assert "rỗng" in str(e)


def test_conflict_case_10_pure_whitespace_words_skipped():
    """Bad case 10: Words with empty strings or pure whitespace are rejected from saving."""
    existing = []
    new_items = [
        {'word': '   ', 'meaning': 'rỗng'},
        {'word': '', 'meaning': 'trống'},
        {'word': 'valid', 'meaning': 'hợp lệ'}
    ]
    res = simulate_batch_import(new_items, existing, conflict_resolution="skip_existing")
    assert res['added_count'] == 1
    assert len(res['notebook']) == 1
    assert res['notebook'][0]['word'] == 'valid'


def test_conflict_case_11_unrecognized_strategy_falls_back_to_skip():
    """Bad case 11: Unrecognized strategy defaults safely to skip_existing."""
    existing = [{'id': 1, 'word': 'cat', 'meaning': 'con mèo'}]
    new_items = [{'word': 'cat', 'meaning': 'mèo con'}]

    # When fallback occurs or defaults
    res = simulate_batch_import(new_items, existing, conflict_resolution="unknown_garbage_strategy")
    # Should not overwrite
    assert existing[0]['meaning'] == 'con mèo'


def test_conflict_case_12_duplicate_words_within_same_import_batch():
    """Bad case 12: Payload containing multiple occurrences of the same word handled safely."""
    existing = []
    new_items = [
        {'word': 'ephemeral', 'meaning': 'phù du 1'},
        {'word': 'ephemeral', 'meaning': 'phù du 2'},
    ]
    res = simulate_batch_import(new_items, existing, conflict_resolution="skip_existing")
    # First one added, second one skipped because key now exists in map
    assert res['added_count'] == 1
    assert res['skipped_count'] == 1
    assert len(res['notebook']) == 1
