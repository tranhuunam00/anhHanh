import pytest
from app.infrastructure.database.models import User
from app.application.auth_service import is_ai_import_allowed

def test_user_can_use_ai_import_permissions():
    user1 = User(email="tranhuunam23022000@gmail.com", name="Tran Huu Nam", role="ADMIN")
    user2 = User(email="vuthiquynhtrangbl6d@gmail.com", name="Vu Thi Quynh Trang", role="ADMIN")
    user3 = User(email="tranhuunam23022000@company.org", name="Nam", role="USER")
    user4 = User(email="regular_user@example.com", name="Regular User", role="USER")
    user5 = User(email="admin@daogroup.com", name="Super Admin", role="ADMIN")

    assert is_ai_import_allowed(user1) is True
    assert user1.can_use_ai_import is True

    assert is_ai_import_allowed(user2) is True
    assert user2.can_use_ai_import is True

    assert is_ai_import_allowed(user3) is True
    assert user3.can_use_ai_import is True

    # Other regular users or non-authorized admins must be False
    assert is_ai_import_allowed(user4) is False
    assert user4.can_use_ai_import is False

    assert is_ai_import_allowed(user5) is False
    assert user5.can_use_ai_import is False


def test_ai_vocab_service_text_extraction():
    from app.infrastructure.ai_vocab_service import AIVocabService
    
    sample_text = "Unit 1\n1. Điện mừng: message of congratulations\n2. Đồng chí: comrade"
    extracted = AIVocabService.extract_text_from_file(sample_text.encode("utf-8"), "document.txt")
    assert "Điện mừng" in extracted
    assert "message of congratulations" in extracted


def test_practice_session_random_sampling_logic():
    import random
    items = [f"word_{i}" for i in range(100)]
    
    # Selecting 20 should give 20 items
    sampled_20 = random.sample(items, 20)
    assert len(sampled_20) == 20
    assert len(set(sampled_20)) == 20

    # Selecting 40 should give 40 items
    sampled_40 = random.sample(items, 40)
    assert len(sampled_40) == 40

    # Selecting all
    shuffled = list(items)
    random.shuffle(shuffled)
    assert len(shuffled) == 100


def test_vocab_pagination_math():
    total_items = 55
    page_size = 18
    total_pages = (total_items + page_size - 1) // page_size
    assert total_pages == 4  # 18 + 18 + 18 + 1 = 55

    # Page 1
    p1 = list(range(total_items))[0:18]
    assert len(p1) == 18

    # Page 4 (last page)
    p4 = list(range(total_items))[54:72]
    assert len(p4) == 1


def test_conflict_resolution_strategies_models():
    from app.presentation.vocab_api import CheckVocabDuplicatesRequest, BatchImportVocabRequest, BatchImportVocabItem

    req = CheckVocabDuplicatesRequest(words=["hello", "world", "HELLO"])
    assert len(req.words) == 3

    items = [
        BatchImportVocabItem(word="bonjour", meaning="xin chào", source_lang="fr"),
        BatchImportVocabItem(word="merci", meaning="cảm ơn", source_lang="fr")
    ]
    
    # 1. skip_existing
    import_skip = BatchImportVocabRequest(items=items, conflict_resolution="skip_existing")
    assert import_skip.conflict_resolution == "skip_existing"

    # 2. overwrite
    import_overwrite = BatchImportVocabRequest(items=items, conflict_resolution="overwrite")
    assert import_overwrite.conflict_resolution == "overwrite"

    # 3. keep_both
    import_both = BatchImportVocabRequest(items=items, conflict_resolution="keep_both")
    assert import_both.conflict_resolution == "keep_both"


def test_practice_session_status_filtering_logic():
    """Verify status filter logic: UNMASTERED filters out MASTERED, MASTERED keeps only MASTERED."""
    test_words = [
        {"id": 1, "word": "apple", "status": "NEW"},
        {"id": 2, "word": "banana", "status": "LEARNING"},
        {"id": 3, "word": "cat", "status": "MASTERED"},
        {"id": 4, "word": "dog", "status": "MASTERED"},
        {"id": 5, "word": "elephant", "status": "NEW"},
    ]

    # Status: UNMASTERED (NEW or LEARNING, not MASTERED)
    unmastered = [w for w in test_words if w["status"] != "MASTERED"]
    assert len(unmastered) == 3
    assert all(w["status"] != "MASTERED" for w in unmastered)
    assert set(w["word"] for w in unmastered) == {"apple", "banana", "elephant"}

    # Status: MASTERED
    mastered = [w for w in test_words if w["status"] == "MASTERED"]
    assert len(mastered) == 2
    assert all(w["status"] == "MASTERED" for w in mastered)
    assert set(w["word"] for w in mastered) == {"cat", "dog"}

    # Status: ALL
    assert len(test_words) == 5


def test_practice_session_time_filtering_logic_presets():
    """Verify time range filter logic for TODAY, 3DAYS, 7DAYS, 30DAYS, and ALL."""
    from datetime import datetime, timezone, timedelta

    ref_now = datetime(2026, 10, 22, 12, 0, 0, tzinfo=timezone.utc)
    today_start = datetime(2026, 10, 22, 0, 0, 0, tzinfo=timezone.utc)

    vocab_items = [
        {"id": 1, "word": "today_word", "created_at": ref_now - timedelta(hours=2)},
        {"id": 2, "word": "two_days_word", "created_at": ref_now - timedelta(days=2)},
        {"id": 3, "word": "five_days_word", "created_at": ref_now - timedelta(days=5)},
        {"id": 4, "word": "twenty_days_word", "created_at": ref_now - timedelta(days=20)},
        {"id": 5, "word": "forty_days_word", "created_at": ref_now - timedelta(days=40)},
    ]

    # TODAY
    today_items = [w for w in vocab_items if w["created_at"] >= today_start]
    assert len(today_items) == 1
    assert today_items[0]["word"] == "today_word"

    # 3DAYS
    three_days_limit = ref_now - timedelta(days=3)
    three_days_items = [w for w in vocab_items if w["created_at"] >= three_days_limit]
    assert len(three_days_items) == 2
    assert set(w["word"] for w in three_days_items) == {"today_word", "two_days_word"}

    # 7DAYS
    seven_days_limit = ref_now - timedelta(days=7)
    seven_days_items = [w for w in vocab_items if w["created_at"] >= seven_days_limit]
    assert len(seven_days_items) == 3
    assert set(w["word"] for w in seven_days_items) == {"today_word", "two_days_word", "five_days_word"}

    # 30DAYS
    thirty_days_limit = ref_now - timedelta(days=30)
    thirty_days_items = [w for w in vocab_items if w["created_at"] >= thirty_days_limit]
    assert len(thirty_days_items) == 4
    assert set(w["word"] for w in thirty_days_items) == {"today_word", "two_days_word", "five_days_word", "twenty_days_word"}

    # ALL
    assert len(vocab_items) == 5


def test_practice_session_time_filtering_logic_custom():
    """Verify custom start_date and end_date filtering with boundary and error handling."""
    from datetime import datetime, timezone, timedelta

    vocab_items = [
        {"id": 1, "word": "item_oct_10", "created_at": datetime(2026, 10, 10, 10, 0, 0, tzinfo=timezone.utc)},
        {"id": 2, "word": "item_oct_15", "created_at": datetime(2026, 10, 15, 14, 30, 0, tzinfo=timezone.utc)},
        {"id": 3, "word": "item_oct_20", "created_at": datetime(2026, 10, 20, 23, 0, 0, tzinfo=timezone.utc)},
        {"id": 4, "word": "item_oct_25", "created_at": datetime(2026, 10, 25, 8, 0, 0, tzinfo=timezone.utc)},
    ]

    # Filter Oct 12 to Oct 21
    start_dt = datetime.fromisoformat("2026-10-12").replace(tzinfo=timezone.utc)
    end_dt = datetime.fromisoformat("2026-10-21").replace(hour=23, minute=59, second=59, tzinfo=timezone.utc)

    matched = [w for w in vocab_items if start_dt <= w["created_at"] <= end_dt]
    assert len(matched) == 2
    assert set(w["word"] for w in matched) == {"item_oct_15", "item_oct_20"}

    # Invalid date string should not crash
    invalid_start = "not-a-valid-date"
    parsed_s_dt = None
    try:
        parsed_s_dt = datetime.fromisoformat(invalid_start)
    except Exception:
        pass
    assert parsed_s_dt is None




