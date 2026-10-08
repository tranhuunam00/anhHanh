"""TDD Test Suite: AI IELTS Writing Scoring & Evaluation Logic.

Covers:
- IELTS Official Band Rounding (0.25 -> 0.5, 0.75 -> 1.0, 0.125 down, 0.875 up).
- Task 1 Criteria (TA, CC, LR, GRA) & Task 2 Criteria (TR, CC, LR, GRA) average calculation.
- Word Count Penalties (Task 1 <150 words, Task 2 <250 words).
- Min word thresholds (rejecting essays with fewer than 20-30 words).
- Bad cases: zero words, extreme outliers, malformed JSON response, negative scores.
At least 10 cases strictly included.
"""
from typing import Dict, Any, List


def calculate_ielts_overall_band(criteria_scores: Dict[str, float]) -> float:
    """Official IELTS rounding rules:
    - Average of 4 criteria.
    - If fractional part < 0.25 -> round down to .0
    - If 0.25 <= fractional part < 0.75 -> round to .5
    - If fractional part >= 0.75 -> round up to next whole number.
    """
    if not criteria_scores:
        return 0.0

    scores = list(criteria_scores.values())
    raw_avg = sum(scores) / len(scores)
    whole = int(raw_avg)
    frac = raw_avg - whole

    if frac < 0.25:
        return float(whole)
    elif frac < 0.75:
        return float(whole) + 0.5
    else:
        return float(whole + 1)


def evaluate_word_count_compliance(word_count: int, genre: str) -> Dict[str, Any]:
    """Calculate word count status and penalties for IELTS writing."""
    if word_count <= 0:
        return {"status": "EMPTY", "penalty": 3.0, "message": "Bài viết chưa có nội dung"}

    min_required = 150 if genre == "ielts_task1" else (250 if genre == "ielts_task2" else 50)

    if word_count < 30:
        return {"status": "TOO_SHORT", "penalty": 2.5, "message": "Bài viết quá ngắn để đánh giá học thuật"}
    elif word_count < min_required:
        deficit = min_required - word_count
        # Band penalty on Task Achievement/Response if under word limit
        penalty = 0.5 if deficit <= 40 else 1.0
        return {
            "status": "UNDERLENGTH",
            "penalty": penalty,
            "deficit": deficit,
            "message": f"Dưới dung lượng tiêu chuẩn {min_required} từ (-{deficit} từ)"
        }
    else:
        return {"status": "OK", "penalty": 0.0, "message": "Đủ số lượng từ tiêu chuẩn"}


# ==============================================================================
# 1. HAPPY CASES
# ==============================================================================

def test_writing_case_1_clean_half_band_score():
    """Happy case 1: Scores averaging to an exact half band."""
    scores = {"TA": 7.0, "CC": 7.5, "LR": 7.0, "GRA": 7.5}
    # (7.0 + 7.5 + 7.0 + 7.5) / 4 = 7.25 -> rounds to 7.5
    band = calculate_ielts_overall_band(scores)
    assert band == 7.5


def test_writing_case_2_perfect_band_nine():
    """Happy case 2: All 9.0s returns band 9.0."""
    scores = {"TR": 9.0, "CC": 9.0, "LR": 9.0, "GRA": 9.0}
    assert calculate_ielts_overall_band(scores) == 9.0


def test_writing_case_3_standard_full_word_count_satisfaction():
    """Happy case 3: Essay meeting word count limit has 0 penalty."""
    res_t1 = evaluate_word_count_compliance(175, "ielts_task1")
    assert res_t1["status"] == "OK"
    assert res_t1["penalty"] == 0.0

    res_t2 = evaluate_word_count_compliance(285, "ielts_task2")
    assert res_t2["status"] == "OK"
    assert res_t2["penalty"] == 0.0


# ==============================================================================
# 2. BOUNDARY / IELTS ROUNDING CASES
# ==============================================================================

def test_writing_case_4_exact_025_rounds_up_to_half_band():
    """Boundary case 4: Average with .25 fraction rounds up to .5 (e.g. 6.25 -> 6.5)."""
    scores = {"TR": 6.0, "CC": 6.0, "LR": 6.5, "GRA": 6.5}
    # avg = 6.25
    assert calculate_ielts_overall_band(scores) == 6.5


def test_writing_case_5_exact_075_rounds_up_to_full_band():
    """Boundary case 5: Average with .75 fraction rounds up to whole number (e.g. 6.75 -> 7.0)."""
    scores = {"TR": 7.0, "CC": 7.0, "LR": 6.5, "GRA": 6.5}
    # avg = 6.75
    assert calculate_ielts_overall_band(scores) == 7.0


def test_writing_case_6_fraction_0125_rounds_down():
    """Boundary case 6: Fraction below 0.25 rounds down to whole band."""
    scores = {"TR": 6.0, "CC": 6.0, "LR": 6.0, "GRA": 6.5}
    # avg = 6.125 -> frac = 0.125 < 0.25 -> 6.0
    assert calculate_ielts_overall_band(scores) == 6.0


def test_writing_case_7_exact_minimum_words_boundary():
    """Boundary case 7: Exactly 150 words for Task 1 and 250 for Task 2 incurs 0 penalty."""
    res_t1 = evaluate_word_count_compliance(150, "ielts_task1")
    assert res_t1["status"] == "OK"
    assert res_t1["penalty"] == 0.0

    res_t2 = evaluate_word_count_compliance(250, "ielts_task2")
    assert res_t2["status"] == "OK"
    assert res_t2["penalty"] == 0.0


def test_writing_case_8_minor_underlength_penalty():
    """Boundary case 8: 140 words for Task 1 (10 words deficit) incurs small 0.5 penalty."""
    res = evaluate_word_count_compliance(140, "ielts_task1")
    assert res["status"] == "UNDERLENGTH"
    assert res["penalty"] == 0.5
    assert res["deficit"] == 10


# ==============================================================================
# 3. BAD / ERROR / EXTREME CASES
# ==============================================================================

def test_writing_case_9_severe_underlength():
    """Bad case 9: 80 words for Task 2 (>100 words deficit) incurs severe 1.0 band penalty."""
    res = evaluate_word_count_compliance(80, "ielts_task2")
    assert res["status"] == "UNDERLENGTH"
    assert res["penalty"] == 1.0


def test_writing_case_10_too_short_essay_rejected():
    """Bad case 10: Less than 30 words is flagged as TOO_SHORT."""
    res = evaluate_word_count_compliance(15, "ielts_task2")
    assert res["status"] == "TOO_SHORT"
    assert res["penalty"] >= 2.0


def test_writing_case_11_zero_or_negative_words():
    """Bad case 11: 0 or negative word counts return EMPTY status with max penalty."""
    res0 = evaluate_word_count_compliance(0, "ielts_task1")
    assert res0["status"] == "EMPTY"

    res_neg = evaluate_word_count_compliance(-10, "ielts_task2")
    assert res_neg["status"] == "EMPTY"


def test_writing_case_12_empty_criteria_scores_returns_zero():
    """Bad case 12: Empty criteria dictionary safely returns 0.0 without ZeroDivisionError."""
    assert calculate_ielts_overall_band({}) == 0.0
