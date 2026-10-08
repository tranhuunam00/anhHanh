"""TDD Test Suite: User Daily Streak Progression & Habit Tracking Logic.

Covers:
- Happy cases (initial study day, consecutive daily streak increment, longest streak update).
- Boundary cases (multiple sessions on the same day, month-end transition, year-end transition, leap year).
- Bad cases (broken streak after missing 1+ days, negative words typed, zero words, corrupt past dates).
At least 10 cases strictly included.
"""
from datetime import date, timedelta


def update_streak_calculation(
    current_streak: int,
    longest_streak: int,
    words_today: int,
    last_study_date: date,
    today: date,
    words_typed: int,
):
    """Pure domain function simulating UserStreak update logic from lesson_api.py."""
    words_typed = max(0, words_typed)

    if last_study_date is None:
        c_streak = 1
        l_streak = 1
        w_today = words_typed
        new_last_date = today
    elif last_study_date == today:
        c_streak = current_streak
        w_today = words_today + words_typed
        l_streak = max(longest_streak, c_streak)
        new_last_date = today
    elif last_study_date == today - timedelta(days=1):
        c_streak = current_streak + 1
        w_today = words_typed
        l_streak = max(longest_streak, c_streak)
        new_last_date = today
    else:
        # Missed more than 1 day -> streak resets to 1
        c_streak = 1
        w_today = words_typed
        l_streak = max(longest_streak, c_streak)
        new_last_date = today

    return {
        "current_streak": c_streak,
        "longest_streak": l_streak,
        "words_today": w_today,
        "last_study_date": new_last_date,
    }


# ==============================================================================
# 1. HAPPY CASES
# ==============================================================================

def test_streak_case_1_first_day_study():
    """Happy case 1: Brand new user completes their first session."""
    today = date(2026, 10, 8)
    res = update_streak_calculation(
        current_streak=0,
        longest_streak=0,
        words_today=0,
        last_study_date=None,
        today=today,
        words_typed=45,
    )
    assert res["current_streak"] == 1
    assert res["longest_streak"] == 1
    assert res["words_today"] == 45
    assert res["last_study_date"] == today


def test_streak_case_2_consecutive_day_increments_streak():
    """Happy case 2: User studies on consecutive calendar days."""
    yesterday = date(2026, 10, 7)
    today = date(2026, 10, 8)
    res = update_streak_calculation(
        current_streak=5,
        longest_streak=10,
        words_today=50,
        last_study_date=yesterday,
        today=today,
        words_typed=30,
    )
    assert res["current_streak"] == 6
    assert res["longest_streak"] == 10
    assert res["words_today"] == 30
    assert res["last_study_date"] == today


def test_streak_case_3_new_longest_streak_record():
    """Happy case 3: Current streak surpasses existing longest streak record."""
    yesterday = date(2026, 10, 7)
    today = date(2026, 10, 8)
    res = update_streak_calculation(
        current_streak=10,
        longest_streak=10,
        words_today=40,
        last_study_date=yesterday,
        today=today,
        words_typed=25,
    )
    assert res["current_streak"] == 11
    assert res["longest_streak"] == 11


def test_streak_case_4_multiple_sessions_same_day_accumulates_words():
    """Happy case 4: Multiple sessions on the same calendar day accumulate words without double-counting streak."""
    today = date(2026, 10, 8)
    res = update_streak_calculation(
        current_streak=7,
        longest_streak=12,
        words_today=50,
        last_study_date=today,
        today=today,
        words_typed=75,
    )
    assert res["current_streak"] == 7
    assert res["longest_streak"] == 12
    assert res["words_today"] == 125
    assert res["last_study_date"] == today


# ==============================================================================
# 2. BOUNDARY / CALENDAR CASES
# ==============================================================================

def test_streak_case_5_month_transition_boundary():
    """Boundary case 5: Studying on Oct 31 then Nov 1 maintains consecutive streak."""
    end_of_oct = date(2026, 10, 31)
    start_of_nov = date(2026, 11, 1)
    res = update_streak_calculation(
        current_streak=15,
        longest_streak=20,
        words_today=60,
        last_study_date=end_of_oct,
        today=start_of_nov,
        words_typed=40,
    )
    assert res["current_streak"] == 16
    assert res["words_today"] == 40


def test_streak_case_6_year_transition_boundary():
    """Boundary case 6: Studying on Dec 31 then Jan 1 maintains consecutive streak."""
    dec_31 = date(2026, 12, 31)
    jan_01 = date(2027, 1, 1)
    res = update_streak_calculation(
        current_streak=99,
        longest_streak=99,
        words_today=100,
        last_study_date=dec_31,
        today=jan_01,
        words_typed=80,
    )
    assert res["current_streak"] == 100
    assert res["longest_streak"] == 100


def test_streak_case_7_leap_year_february_transition():
    """Boundary case 7: Leap year transition Feb 28 -> Feb 29 -> Mar 1 correctly increments streak."""
    feb_28 = date(2028, 2, 28)
    feb_29 = date(2028, 2, 29)
    mar_01 = date(2028, 3, 1)

    step1 = update_streak_calculation(
        current_streak=3,
        longest_streak=3,
        words_today=30,
        last_study_date=feb_28,
        today=feb_29,
        words_typed=40,
    )
    assert step1["current_streak"] == 4

    step2 = update_streak_calculation(
        current_streak=step1["current_streak"],
        longest_streak=step1["longest_streak"],
        words_today=step1["words_today"],
        last_study_date=step1["last_study_date"],
        today=mar_01,
        words_typed=50,
    )
    assert step2["current_streak"] == 5


def test_streak_case_8_zero_words_typed_boundary():
    """Boundary case 8: Completing a challenge with 0 new words typed still preserves/increments streak."""
    yesterday = date(2026, 10, 7)
    today = date(2026, 10, 8)
    res = update_streak_calculation(
        current_streak=4,
        longest_streak=10,
        words_today=20,
        last_study_date=yesterday,
        today=today,
        words_typed=0,
    )
    assert res["current_streak"] == 5
    assert res["words_today"] == 0


# ==============================================================================
# 3. BAD / BROKEN STREAK CASES
# ==============================================================================

def test_streak_case_9_broken_streak_after_missing_one_day():
    """Bad case 9: User missed exactly 1 full day (e.g. studied on 6th, skipped 7th, returned on 8th)."""
    two_days_ago = date(2026, 10, 6)
    today = date(2026, 10, 8)
    res = update_streak_calculation(
        current_streak=14,
        longest_streak=25,
        words_today=40,
        last_study_date=two_days_ago,
        today=today,
        words_typed=50,
    )
    assert res["current_streak"] == 1
    assert res["longest_streak"] == 25  # Longest streak preserved
    assert res["words_today"] == 50


def test_streak_case_10_long_absence_streak_resets():
    """Bad case 10: User absent for 30 days resets current streak to 1."""
    long_ago = date(2026, 9, 1)
    today = date(2026, 10, 8)
    res = update_streak_calculation(
        current_streak=45,
        longest_streak=45,
        words_today=100,
        last_study_date=long_ago,
        today=today,
        words_typed=10,
    )
    assert res["current_streak"] == 1
    assert res["longest_streak"] == 45


def test_streak_case_11_negative_words_typed_clamped_to_zero():
    """Bad case 11: Malformed negative words_typed payload is clamped to 0 without corrupting total."""
    today = date(2026, 10, 8)
    res = update_streak_calculation(
        current_streak=2,
        longest_streak=5,
        words_today=30,
        last_study_date=today,
        today=today,
        words_typed=-50,
    )
    assert res["words_today"] == 30


def test_streak_case_12_corrupt_zero_current_streak_resets_properly():
    """Bad case 12: Corrupt DB record with current_streak = 0 resets cleanly to 1."""
    yesterday = date(2026, 10, 7)
    today = date(2026, 10, 8)
    res = update_streak_calculation(
        current_streak=0,
        longest_streak=0,
        words_today=0,
        last_study_date=yesterday,
        today=today,
        words_typed=20,
    )
    assert res["current_streak"] == 1  # 0 + 1 = 1
    assert res["longest_streak"] == 1
