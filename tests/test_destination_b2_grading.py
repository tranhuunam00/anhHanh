"""Unit tests for Destination B2 Exercise Grading Engine.

Follows AGENTS.md:
- Rule 4: File strictly under 500 lines.
- Rule 6: Mandatory function-level unit testing with full 4-aspect coverage:
  1. Input Coverage (happy path, empty/None, punctuation, casing, contractions)
  2. Output Verification (types, score calculation, result items structure)
  3. Internal Logic Coverage (exact match, variant matching, slash alternatives)
  4. Error & Exception Handling (empty list, missing answer key, invalid items)
"""
import pytest
from app.application.destination_b2_grading import (
    normalize_answer_string,
    expand_equivalent_answers,
    check_single_answer,
    grade_exercise_submission,
)


# ==========================================
# 1. normalize_answer_string Tests
# ==========================================
def test_normalize_answer_string_happy_path():
    """Test standard normalizations."""
    assert normalize_answer_string("Travel") == "travel"
    assert normalize_answer_string("  have been working  ") == "have been working"
    assert normalize_answer_string("goes.") == "goes"
    assert normalize_answer_string("journey,") == "journey"


def test_normalize_answer_string_edge_and_empty_inputs():
    """Test empty, None, and whitespace strings."""
    assert normalize_answer_string(None) == ""
    assert normalize_answer_string("") == ""
    assert normalize_answer_string("   ") == ""
    assert normalize_answer_string(123) == "123"


def test_normalize_answer_string_apostrophes():
    """Test curly apostrophes normalization to straight single quote."""
    assert normalize_answer_string("didn’t") == "didn't"
    assert normalize_answer_string("haven‘t") == "haven't"
    assert normalize_answer_string("it`s") == "it's"


# ==========================================
# 2. expand_equivalent_answers Tests
# ==========================================
def test_expand_equivalent_answers_contractions():
    """Test bidirectional expansion of contractions."""
    exp1 = expand_equivalent_answers("don't")
    assert "don't" in exp1
    assert "do not" in exp1

    exp2 = expand_equivalent_answers("do not")
    assert "don't" in exp2
    assert "do not" in exp2

    exp3 = expand_equivalent_answers("I've")
    assert "i've" in exp3
    assert "i have" in exp3


def test_expand_equivalent_answers_slashes():
    """Test expanding slash-separated alternatives in answer keys."""
    exp = expand_equivalent_answers("have known / have been knowing")
    assert "have known" in exp
    assert "have been knowing" in exp


def test_expand_equivalent_answers_empty():
    """Test empty or None inputs to expand_equivalent_answers."""
    assert expand_equivalent_answers("") == []
    assert expand_equivalent_answers(None) == []


# ==========================================
# 3. check_single_answer Tests
# ==========================================
def test_check_single_answer_correct_matches():
    """Test exact match and contraction tolerance."""
    item = {"correct_answer": "have been thinking"}
    is_corr, ref = check_single_answer("Have Been Thinking", item)
    assert is_corr is True
    assert ref == "have been thinking"

    # Contraction match
    item2 = {"correct_answer": "do not know"}
    is_corr2, _ = check_single_answer("don't know", item2)
    assert is_corr2 is True

    # Array of accepted answers
    item3 = {"answers": ["saw", "'d seen", "had seen"]}
    is_corr3, ref3 = check_single_answer("saw", item3)
    assert is_corr3 is True
    assert ref3 == "saw"

    is_corr4, _ = check_single_answer("had seen", item3)
    assert is_corr4 is True


def test_check_single_answer_incorrect_matches():
    """Test wrong answers."""
    item = {"correct_answer": "voyage"}
    is_corr, ref = check_single_answer("journey", item)
    assert is_corr is False
    assert ref == "voyage"

    # Empty user answer
    is_corr_empty, _ = check_single_answer("", item)
    assert is_corr_empty is False

    is_corr_none, _ = check_single_answer(None, item)
    assert is_corr_none is False


def test_check_single_answer_missing_target_key():
    """Test item without answer keys safely returns False."""
    item_empty = {"text": "What is life?"}
    is_corr, ref = check_single_answer("anything", item_empty)
    assert is_corr is False
    assert ref == ""


# ==========================================
# 4. grade_exercise_submission Tests
# ==========================================
def test_grade_exercise_submission_full_score():
    """Test 100% correct answers."""
    items = [
        {"id": 1, "correct_answer": "goes", "explanation": "Habitual action"},
        {"id": 2, "correct_answer": "is playing", "explanation": "Action happening now"},
    ]
    user_answers = {"1": "goes", "2": "is playing"}
    result = grade_exercise_submission(items, user_answers)

    assert result["score"] == 100.0
    assert result["total_items"] == 2
    assert result["correct_items"] == 2
    assert len(result["results"]) == 2
    assert result["results"][0]["is_correct"] is True
    assert result["results"][0]["explanation"] == "Habitual action"


def test_grade_exercise_submission_partial_score():
    """Test partial score and multiple key formats (string vs int key)."""
    items = [
        {"id": 1, "correct_answer": "journey"},
        {"id": 2, "correct_answer": "trip"},
        {"id": 3, "correct_answer": "voyage"},
        {"id": 4, "correct_answer": "flight"},
    ]
    user_answers = {
        "1": "journey",
        2: "trip",        # int key
        "3": "cruise",    # wrong
        # 4 omitted (unanswered)
    }
    result = grade_exercise_submission(items, user_answers)

    assert result["score"] == 50.0
    assert result["total_items"] == 4
    assert result["correct_items"] == 2
    assert result["results"][2]["is_correct"] is False
    assert result["results"][3]["is_correct"] is False
    assert result["results"][3]["user_answer"] == ""


def test_grade_exercise_submission_empty_items():
    """Test empty items returns 0 score cleanly without divide by zero."""
    result = grade_exercise_submission([], {"1": "foo"})
    assert result["score"] == 0.0
    assert result["total_items"] == 0
    assert result["correct_items"] == 0
    assert result["results"] == []


def test_grade_exercise_submission_none_answers():
    """Test None user_answers dictionary handled gracefully."""
    items = [{"id": 1, "correct_answer": "test"}]
    result = grade_exercise_submission(items, None)
    assert result["score"] == 0.0
    assert result["total_items"] == 1
    assert result["correct_items"] == 0
