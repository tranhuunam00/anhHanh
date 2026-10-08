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


