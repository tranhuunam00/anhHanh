"""Comprehensive Unit Tests for Extracted Vocabulary Submodules.
Covers Happy path, edge cases, boundary conditions, and error cases.
"""
from datetime import datetime, timezone, timedelta
from app.application.vocab_srs_service import (
    calculate_srs_progress,
    generate_quiz_options,
    FALLBACK_DISTRACTORS,
)
from app.application.vocab_import_service import (
    check_vocabulary_duplicates_data,
    plan_batch_import,
)
from app.application.vocab_file_service import (
    validate_file_extension,
    prepare_file_for_ai_extraction,
)


# ============================================================================
# 1. Spaced Repetition System (SRS) Unit Tests
# ============================================================================

def test_calculate_srs_progress_consecutive_ladder():
    """Happy path: test full ladder progression (1 -> 3 -> 7 -> 14 -> 30) and promotion to MASTERED."""
    now = datetime(2026, 1, 1, 12, 0, tzinfo=timezone.utc)

    # Step 1: from initial 1 day
    r1 = calculate_srs_progress(is_correct=True, current_score=0, current_interval=1, now=now)
    assert r1["mastery_score"] == 1
    assert r1["review_interval_days"] == 3
    assert r1["status"] == "LEARNING"
    assert r1["next_review_at"] == now + timedelta(days=3)

    # Step 2: from 3 days
    r2 = calculate_srs_progress(is_correct=True, current_score=1, current_interval=3, now=now)
    assert r2["mastery_score"] == 2
    assert r2["review_interval_days"] == 7
    assert r2["status"] == "LEARNING"

    # Step 3: from 7 days
    r3 = calculate_srs_progress(is_correct=True, current_score=2, current_interval=7, now=now)
    assert r3["mastery_score"] == 3
    assert r3["review_interval_days"] == 14
    assert r3["status"] == "LEARNING"

    # Step 4: from 14 days -> score 4 reaches MASTERED!
    r4 = calculate_srs_progress(is_correct=True, current_score=3, current_interval=14, now=now)
    assert r4["mastery_score"] == 4
    assert r4["review_interval_days"] == 30
    assert r4["status"] == "MASTERED"

    # Step 5: already at 30 days -> stays at 30 days
    r5 = calculate_srs_progress(is_correct=True, current_score=4, current_interval=30, now=now)
    assert r5["mastery_score"] == 5
    assert r5["review_interval_days"] == 30
    assert r5["status"] == "MASTERED"


def test_calculate_srs_progress_incorrect_reset():
    """Failure path: incorrect answer drops interval to 1 day and status to LEARNING."""
    now = datetime(2026, 1, 1, 12, 0, tzinfo=timezone.utc)

    # Incorrect while at score 4 and 30 days
    r = calculate_srs_progress(is_correct=False, current_score=4, current_interval=30, now=now)
    assert r["mastery_score"] == 3
    assert r["review_interval_days"] == 1
    assert r["status"] == "LEARNING"
    assert r["next_review_at"] == now + timedelta(days=1)


def test_calculate_srs_progress_boundary_zero_score():
    """Boundary test: score cannot drop below 0 on failure."""
    r = calculate_srs_progress(is_correct=False, current_score=0, current_interval=1)
    assert r["mastery_score"] == 0
    assert r["review_interval_days"] == 1
    assert r["status"] == "LEARNING"

    # None values gracefully defaulted
    r_none = calculate_srs_progress(is_correct=True, current_score=None, current_interval=None)
    assert r_none["mastery_score"] == 1
    assert r_none["review_interval_days"] == 3


# ============================================================================
# 2. Quiz Options Generation Unit Tests
# ============================================================================

def test_generate_quiz_options_happy_path():
    """Happy path: generates 4 distinct options containing the correct meaning."""
    pool = ["bắt đầu", "kết thúc", "cố gắng", "nghỉ ngơi", "học tập"]
    opts = generate_quiz_options("start", "bắt đầu", pool, num_options=4)
    assert len(opts) == 4
    assert "bắt đầu" in opts
    assert len(set(opts)) == 4


def test_generate_quiz_options_empty_pool_uses_fallbacks():
    """Edge case: empty candidate pool automatically pulls from fallback distractors."""
    opts = generate_quiz_options("challenge", "thách thức", [], num_options=4)
    assert len(opts) == 4
    assert "thách thức" in opts
    assert len(set(opts)) == 4


def test_generate_quiz_options_filters_out_word_and_english():
    """Logic test: candidate pool entries that match the word or are raw English are filtered out."""
    pool = ["start", "English Word", "kế hoạch", "ý tưởng"]
    opts = generate_quiz_options("start", "bắt đầu", pool, num_options=4)
    assert len(opts) == 4
    assert "start" not in opts
    assert "English Word" not in opts
    assert "bắt đầu" in opts


# ============================================================================
# 3. Duplicate Detection and Batch Import Unit Tests
# ============================================================================

class DummyVocab:
    def __init__(self, id, word, meaning, phonetic=None, context_sentence=None, status="NEW", source_lang="en"):
        self.id = id
        self.word = word
        self.meaning = meaning
        self.phonetic = phonetic
        self.context_sentence = context_sentence
        self.status = status
        self.source_lang = source_lang
        self.image_url = None


def test_check_vocabulary_duplicates_data():
    """Test duplicate detection logic for empty and populated matches."""
    empty_res = check_vocabulary_duplicates_data([], [])
    assert empty_res["has_duplicates"] is False
    assert empty_res["duplicates_count"] == 0

    existing = [DummyVocab("v1", "serendipity", "sự tình cờ may mắn")]
    res = check_vocabulary_duplicates_data(["serendipity", "ephemeral"], existing)
    assert res["has_duplicates"] is True
    assert res["duplicates_count"] == 1
    assert res["duplicates"][0]["word"] == "serendipity"


def test_plan_batch_import_skip_existing():
    """Test skip_existing conflict resolution: ignores duplicate, keeps new."""
    existing_vocab = DummyVocab("v1", "ubiquitous", "phổ biến")
    existing_map = {"ubiquitous": existing_vocab}

    items = [
        {"word": "ubiquitous", "meaning": "có mặt ở khắp nơi"},
        {"word": "resilient", "meaning": "kiên cường"}
    ]
    plan = plan_batch_import(items, existing_map, conflict_resolution="skip_existing")
    assert plan["skipped_count"] == 1
    assert plan["added_count"] == 1
    assert plan["updated_count"] == 0
    assert len(plan["to_add"]) == 1
    assert plan["to_add"][0]["word"] == "resilient"


def test_plan_batch_import_overwrite():
    """Test overwrite conflict resolution: updates existing record."""
    existing_vocab = DummyVocab("v1", "ubiquitous", "phổ biến")
    existing_map = {"ubiquitous": existing_vocab}

    items = [
        {"word": "ubiquitous", "meaning": "có mặt ở khắp nơi", "phonetic": "/juːˈbɪk.wə.təs/"}
    ]
    plan = plan_batch_import(items, existing_map, conflict_resolution="overwrite")
    assert plan["updated_count"] == 1
    assert plan["added_count"] == 0
    assert plan["skipped_count"] == 0
    assert len(plan["to_update"]) == 1
    assert plan["to_update"][0]["meaning"] == "có mặt ở khắp nơi"


def test_plan_batch_import_keep_both():
    """Test keep_both conflict resolution: adds as new independent record."""
    existing_vocab = DummyVocab("v1", "ubiquitous", "phổ biến")
    existing_map = {"ubiquitous": existing_vocab}

    items = [
        {"word": "ubiquitous", "meaning": "có mặt ở khắp nơi"}
    ]
    plan = plan_batch_import(items, existing_map, conflict_resolution="keep_both")
    assert plan["added_count"] == 1
    assert plan["updated_count"] == 0
    assert plan["skipped_count"] == 0


def test_plan_batch_import_auto_phonetic_enrichment():
    """Test auto-fetching phonetic IPA when source_lang is 'en'."""
    items = [{"word": "eloquent", "meaning": "hùng hồn", "phonetic": ""}]
    mock_ipa_fn = lambda w: "/ˈel.ə.kwənt/" if w == "eloquent" else None

    plan = plan_batch_import(
        items,
        existing_map={},
        conflict_resolution="skip_existing",
        default_source_lang="en",
        get_phonetic_fn=mock_ipa_fn
    )
    assert plan["added_count"] == 1
    assert plan["to_add"][0]["phonetic"] == "/ˈel.ə.kwənt/"


# ============================================================================
# 4. File Validation and Preprocessing Unit Tests
# ============================================================================

def test_validate_file_extension():
    """Test allowed and disallowed file extension recognition."""
    assert validate_file_extension("document.pdf") is True
    assert validate_file_extension("notes.DOCX") is True
    assert validate_file_extension("list.txt") is True
    assert validate_file_extension("scan.PNG") is True
    assert validate_file_extension("data.csv") is True

    assert validate_file_extension("script.exe") is False
    assert validate_file_extension("archive.zip") is False
    assert validate_file_extension("audio.mp3") is False


def test_prepare_file_for_ai_extraction_image_bytes():
    """Test image file returns raw bytes for Gemini Vision OCR."""
    fake_img = b"\x89PNG\r\n\x1a\n\x00fake"
    text, imgs = prepare_file_for_ai_extraction(fake_img, "test.png")
    assert text is None
    assert len(imgs) == 1
    assert imgs[0] == fake_img
