"""Comprehensive Unit Tests for Extracted Vocabulary Submodules.
Covers Happy path, edge cases, boundary conditions, and error cases.
"""
from datetime import datetime, timezone, timedelta
from app.application.vocab_srs_service import (
    calculate_srs_progress,
    generate_quiz_options,
    resolve_mastered_at_timestamp,
    compute_time_range_bounds,
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
from app.presentation.vocab_api_helpers import (
    format_definition_as_context,
    fetch_dictionary_example_sentence,
    resolve_word_context_helper,
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


# ============================================================================
# 5. Mastered Timestamp & Time Range Bounds Unit Tests
# ============================================================================

def test_resolve_mastered_at_timestamp():
    """Test setting mastered_at when status becomes MASTERED and clearing to None otherwise."""
    ref_now = datetime(2026, 11, 8, 10, 0, 0, tzinfo=timezone.utc)

    # Happy path: MASTERED sets timestamp
    assert resolve_mastered_at_timestamp("MASTERED", now=ref_now) == ref_now
    assert resolve_mastered_at_timestamp("  mastered ", now=ref_now) == ref_now
    auto_ts = resolve_mastered_at_timestamp("MASTERED")
    assert isinstance(auto_ts, datetime)

    # Internal logic: non-MASTERED clears column to None
    assert resolve_mastered_at_timestamp("NEW", now=ref_now) is None
    assert resolve_mastered_at_timestamp("LEARNING", now=ref_now) is None

    # Boundary & bad input cases
    assert resolve_mastered_at_timestamp("", now=ref_now) is None
    assert resolve_mastered_at_timestamp("   ", now=ref_now) is None
    assert resolve_mastered_at_timestamp(None, now=ref_now) is None
    assert resolve_mastered_at_timestamp(123, now=ref_now) is None  # type: ignore


def test_compute_time_range_bounds():
    """Test computing UTC datetime bounds for ALL, TODAY, 3DAYS, 7DAYS, 30DAYS, and CUSTOM."""
    ref_now = datetime(2026, 11, 8, 14, 30, 0, tzinfo=timezone.utc)

    assert compute_time_range_bounds("ALL", now=ref_now) == (None, None)
    assert compute_time_range_bounds(None, now=ref_now) == (None, None)
    assert compute_time_range_bounds("", now=ref_now) == (None, None)
    assert compute_time_range_bounds("UNKNOWN", now=ref_now) == (None, None)

    s_today, e_today = compute_time_range_bounds("TODAY", now=ref_now)
    assert s_today == datetime(2026, 11, 8, 0, 0, 0, tzinfo=timezone.utc)
    assert e_today is None

    s_3d, e_3d = compute_time_range_bounds("3DAYS", now=ref_now)
    assert s_3d == ref_now - timedelta(days=3)
    assert e_3d is None

    s_7d, e_7d = compute_time_range_bounds("7DAYS", now=ref_now)
    assert s_7d == ref_now - timedelta(days=7)
    assert e_7d is None

    s_30d, e_30d = compute_time_range_bounds("30DAYS", now=ref_now)
    assert s_30d == ref_now - timedelta(days=30)
    assert e_30d is None

    # Custom date range
    s_cust, e_cust = compute_time_range_bounds(
        "CUSTOM",
        start_date="2026-11-01",
        end_date="2026-11-08",
        now=ref_now
    )
    assert s_cust == datetime(2026, 11, 1, 0, 0, 0, tzinfo=timezone.utc)
    assert e_cust == datetime(2026, 11, 8, 23, 59, 59, 999999, tzinfo=timezone.utc)

    # Custom with malformed date strings
    s_bad, e_bad = compute_time_range_bounds(
        "CUSTOM",
        start_date="not-a-date",
        end_date="invalid",
        now=ref_now
    )
    assert s_bad is None
    assert e_bad is None


# ============================================================================
# 6. Auto Context Sentence & Definition Cloze Helper Unit Tests
# ============================================================================

def test_format_definition_as_context():
    """Test formatting English dictionary definition into cloze-ready sentence."""
    res = format_definition_as_context(
        "resilient",
        "(of systems or people) Returning quickly to normal after damaging events."
    )
    assert res == 'In English, "resilient" means: returning quickly to normal after damaging events.'

    # Without trailing period
    res2 = format_definition_as_context("fragile", "Easily broken")
    assert res2 == 'In English, "fragile" means: easily broken.'

    # Edge / bad cases
    assert format_definition_as_context("", "Valid def") == ""
    assert format_definition_as_context("word", "") == ""
    assert format_definition_as_context("word", None) == ""
    assert format_definition_as_context("word", "(only parens)") == ""


def test_resolve_word_context_helper():
    """Test resolving user context sentence or falling back to dictionary example lookup."""
    # 1. User provided context takes priority
    assert resolve_word_context_helper("reluctant", "  She was reluctant to go.  ") == "She was reluctant to go."

    # 2. Auto-enrichment via injected lookup function for English
    mock_fn = lambda w: f"Example with {w} in context."
    assert resolve_word_context_helper("reluctant", "", "en", fetch_example_fn=mock_fn) == "Example with reluctant in context."
    assert resolve_word_context_helper("reluctant", None, "auto", fetch_example_fn=mock_fn) == "Example with reluctant in context."

    # 3. Non-English languages skip English dictionary lookup
    assert resolve_word_context_helper("bonjour", "", "fr", fetch_example_fn=mock_fn) == ""

    # 4. Empty word or exception handling
    assert resolve_word_context_helper("", "", "en", fetch_example_fn=mock_fn) == ""
    def failing_fn(_w):
        raise RuntimeError("Network error")
    assert resolve_word_context_helper("reluctant", "", "en", fetch_example_fn=failing_fn) == ""
    assert fetch_dictionary_example_sentence("") is None
    assert fetch_dictionary_example_sentence(None) is None  # type: ignore


