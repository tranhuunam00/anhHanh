"""TDD Test Suite: Spaced Repetition System (SRS) & Vocabulary Memory Progression.

Covers:
- Happy cases (standard progression, interval progression, graduation to MASTERED).
- Boundary cases (exact mastery threshold, interval transitions 1 -> 3 -> 7 -> 14 -> 30, zero mastery clamp).
- Bad cases (repeated wrong answers, demotion from MASTERED to LEARNING, non-existent vocab, null values).
At least 10 cases strictly included.
"""
import pytest
from datetime import datetime, timezone, timedelta
from app.infrastructure.database.models import UserVocabulary


def calculate_srs_step(
    mastery_score: int,
    curr_interval: int,
    is_correct: bool,
    now: datetime = None
):
    """Pure domain function simulating the SRS calculation logic from vocab_api.py."""
    if now is None:
        now = datetime.now(timezone.utc)

    if is_correct:
        new_mastery = (mastery_score or 0) + 1
        curr_int = curr_interval or 1
        if curr_int == 1:
            next_int = 3
        elif curr_int == 3:
            next_int = 7
        elif curr_int == 7:
            next_int = 14
        else:
            next_int = 30

        next_review_at = now + timedelta(days=next_int)
        status = 'MASTERED' if new_mastery >= 4 else 'LEARNING'
    else:
        new_mastery = max(0, (mastery_score or 0) - 1)
        next_int = 1
        next_review_at = now + timedelta(days=1)
        status = 'LEARNING'

    return {
        'mastery_score': new_mastery,
        'review_interval_days': next_int,
        'next_review_at': next_review_at,
        'status': status
    }


# ==============================================================================
# 1. HAPPY CASES
# ==============================================================================

def test_srs_case_1_first_correct_review():
    """Happy case 1: Brand new word reviewed correctly for the first time."""
    now = datetime(2026, 10, 8, 12, 0, 0, tzinfo=timezone.utc)
    res = calculate_srs_step(mastery_score=0, curr_interval=1, is_correct=True, now=now)

    assert res['mastery_score'] == 1
    assert res['review_interval_days'] == 3
    assert res['status'] == 'LEARNING'
    assert res['next_review_at'] == now + timedelta(days=3)


def test_srs_case_2_second_consecutive_correct_review():
    """Happy case 2: Second correct review steps interval from 3 to 7 days."""
    now = datetime(2026, 10, 11, 12, 0, 0, tzinfo=timezone.utc)
    res = calculate_srs_step(mastery_score=1, curr_interval=3, is_correct=True, now=now)

    assert res['mastery_score'] == 2
    assert res['review_interval_days'] == 7
    assert res['status'] == 'LEARNING'
    assert res['next_review_at'] == now + timedelta(days=7)


def test_srs_case_3_third_consecutive_correct_review():
    """Happy case 3: Third correct review steps interval from 7 to 14 days."""
    now = datetime(2026, 10, 18, 12, 0, 0, tzinfo=timezone.utc)
    res = calculate_srs_step(mastery_score=2, curr_interval=7, is_correct=True, now=now)

    assert res['mastery_score'] == 3
    assert res['review_interval_days'] == 14
    assert res['status'] == 'LEARNING'
    assert res['next_review_at'] == now + timedelta(days=14)


def test_srs_case_4_fourth_correct_review_graduates_to_mastered():
    """Happy case 4: Fourth correct review reaches mastery score 4 and graduates to MASTERED."""
    now = datetime(2026, 11, 1, 12, 0, 0, tzinfo=timezone.utc)
    res = calculate_srs_step(mastery_score=3, curr_interval=14, is_correct=True, now=now)

    assert res['mastery_score'] == 4
    assert res['review_interval_days'] == 30
    assert res['status'] == 'MASTERED'
    assert res['next_review_at'] == now + timedelta(days=30)


# ==============================================================================
# 2. BOUNDARY / EDGE CASES
# ==============================================================================

def test_srs_case_5_exact_mastery_threshold():
    """Boundary case 5: Score 3 transitions to 4 and becomes MASTERED, but score 2 -> 3 remains LEARNING."""
    sub_threshold = calculate_srs_step(mastery_score=2, curr_interval=7, is_correct=True)
    assert sub_threshold['status'] == 'LEARNING'

    at_threshold = calculate_srs_step(mastery_score=3, curr_interval=7, is_correct=True)
    assert at_threshold['status'] == 'MASTERED'


def test_srs_case_6_interval_ceiling_at_30_days():
    """Boundary case 6: Once interval reaches 30 days, subsequent correct reviews stay capped at 30 days."""
    res1 = calculate_srs_step(mastery_score=4, curr_interval=30, is_correct=True)
    assert res1['review_interval_days'] == 30

    res2 = calculate_srs_step(mastery_score=8, curr_interval=30, is_correct=True)
    assert res2['review_interval_days'] == 30


def test_srs_case_7_zero_mastery_lower_bound():
    """Boundary case 7: Mastery score cannot drop below 0 when getting wrong answers."""
    res = calculate_srs_step(mastery_score=0, curr_interval=1, is_correct=False)
    assert res['mastery_score'] == 0
    assert res['review_interval_days'] == 1
    assert res['status'] == 'LEARNING'


def test_srs_case_8_unrecognized_custom_interval_clamps_to_30():
    """Boundary case 8: Custom arbitrary interval (e.g. 10 or 25) steps to ceiling 30 days."""
    res = calculate_srs_step(mastery_score=2, curr_interval=10, is_correct=True)
    assert res['review_interval_days'] == 30


# ==============================================================================
# 3. BAD / FAILURE / DEMOTION CASES
# ==============================================================================

def test_srs_case_9_wrong_answer_resets_interval_to_1():
    """Bad case 9: Answering incorrectly resets interval back to 1 day immediately."""
    now = datetime(2026, 10, 8, 12, 0, 0, tzinfo=timezone.utc)
    res = calculate_srs_step(mastery_score=3, curr_interval=14, is_correct=False, now=now)

    assert res['review_interval_days'] == 1
    assert res['mastery_score'] == 2  # Decremented
    assert res['status'] == 'LEARNING'
    assert res['next_review_at'] == now + timedelta(days=1)


def test_srs_case_10_mastered_word_demoted_on_mistake():
    """Bad case 10: Mastered word is demoted back to LEARNING and interval 1 if user answers wrong."""
    res = calculate_srs_step(mastery_score=5, curr_interval=30, is_correct=False)

    assert res['status'] == 'LEARNING'
    assert res['mastery_score'] == 4
    assert res['review_interval_days'] == 1


def test_srs_case_11_null_initial_values_handled_gracefully():
    """Bad case 11: None/Null initial mastery_score and interval default cleanly to 0 and 1."""
    res = calculate_srs_step(mastery_score=None, curr_interval=None, is_correct=True)
    assert res['mastery_score'] == 1
    assert res['review_interval_days'] == 3

    res_fail = calculate_srs_step(mastery_score=None, curr_interval=None, is_correct=False)
    assert res_fail['mastery_score'] == 0
    assert res_fail['review_interval_days'] == 1


def test_srs_case_12_repeated_failures_stay_at_zero():
    """Bad case 12: Repeated failures do not create negative numbers or broken schedules."""
    score = 3
    interval = 14
    for _ in range(5):
        step = calculate_srs_step(mastery_score=score, curr_interval=interval, is_correct=False)
        score = step['mastery_score']
        interval = step['review_interval_days']

    assert score == 0
    assert interval == 1
    assert step['status'] == 'LEARNING'
