"""Unit tests for ai_writing_sentence_splitter module.
Covers input coverage, output verification, internal logic, and boundary conditions.
"""
import pytest
from app.infrastructure.ai_writing_sentence_splitter import (
    split_essay_into_sentences,
    get_genre_word_count_limits,
    compute_word_count,
    reconcile_sentence_breakdown,
)


def test_split_essay_empty_and_whitespace():
    """Input boundary test: empty, None, and whitespace-only text."""
    assert split_essay_into_sentences("") == []
    assert split_essay_into_sentences("   \n\t  ") == []
    assert split_essay_into_sentences(None) == []


def test_split_essay_abbreviations_and_decimals():
    """Happy path: splits sentences while preserving abbreviations and decimals."""
    text = (
        "The chart illustrates data from the U.S. and U.K. "
        "Energy consumption rose by 40.5% in 2020. "
        "For example, Mr. Smith and Dr. Jones studied e.g. solar power vs. coal. "
        "The results are shown in Fig. 1 etc."
    )
    sentences = split_essay_into_sentences(text)
    assert len(sentences) == 4
    assert "U.S." in sentences[0] and "U.K." in sentences[0]
    assert "40.5%" in sentences[1]
    assert "Mr. Smith" in sentences[2] and "Dr. Jones" in sentences[2] and "vs." in sentences[2]
    assert "Fig. 1" in sentences[3] and "etc." in sentences[3]


def test_split_essay_multiline_paragraphs():
    """Logic test: multi-paragraph splitting across line breaks."""
    text = "Paragraph one sentence one. Sentence two.\n\nParagraph two sentence three. Sentence four."
    sentences = split_essay_into_sentences(text)
    assert len(sentences) == 4
    assert sentences[0] == "Paragraph one sentence one."
    assert sentences[1] == "Sentence two."
    assert sentences[2] == "Paragraph two sentence three."
    assert sentences[3] == "Sentence four."


def test_compute_word_count():
    """Verify word count computation handles edge cases."""
    assert compute_word_count("") == 0
    assert compute_word_count(None) == 0
    assert compute_word_count("   hello   world   ") == 2
    assert compute_word_count("One two three four five.") == 5


def test_get_genre_word_count_limits():
    """Verify IELTS limits are strictly defined."""
    t1 = get_genre_word_count_limits("ielts_task1")
    assert t1["min_words"] == 150
    assert t1["target_min"] >= 160

    t2 = get_genre_word_count_limits("ielts_task2")
    assert t2["min_words"] == 250
    assert t2["target_min"] >= 270

    free = get_genre_word_count_limits("unknown")
    assert free["genre"] == "free"


def test_reconcile_sentence_breakdown_full_ai_match():
    """Happy path: AI returns all sentences matching 1-to-1."""
    sentences = [
        "First sentence is clear.",
        "Second sentence is also fine."
    ]
    ai_breakdown = [
        {
            "sentence_num": 1,
            "original": "First sentence is clear.",
            "is_grammar_correct": True,
            "grammar_analysis": "Chính xác",
            "grammar_fix": "First sentence is clear.",
            "upgrade_needed": False,
            "upgraded_sentence": "First sentence is exceptionally clear.",
            "upgrade_notes": "Added adverb"
        },
        {
            "sentence_num": 2,
            "original": "Second sentence is also fine.",
            "is_grammar_correct": True,
            "grammar_analysis": "Chính xác",
            "grammar_fix": "Second sentence is also fine.",
            "upgrade_needed": False,
            "upgraded_sentence": "Second sentence is also fine.",
            "upgrade_notes": "Good"
        }
    ]
    res = reconcile_sentence_breakdown(sentences, ai_breakdown, [], 7.0)
    assert len(res) == 2
    assert res[0]["sentence_num"] == 1
    assert res[1]["sentence_num"] == 2
    assert res[0]["upgraded_sentence"] == "First sentence is exceptionally clear."


def test_reconcile_sentence_breakdown_ai_omits_sentences():
    """Critical bug fix test: AI only returns 2 sentences, but user wrote 4.
    Reconcile MUST guarantee 100% of sentences (len == 4) are returned!
    """
    sentences = [
        "First sentence.",
        "Second sentence has error.",
        "Third sentence omitted by AI.",
        "Fourth sentence also omitted."
    ]
    ai_breakdown = [
        {
            "sentence_num": 1,
            "original": "First sentence.",
            "is_grammar_correct": True,
            "grammar_analysis": "Tốt",
            "grammar_fix": "First sentence.",
            "upgrade_needed": False,
            "upgraded_sentence": "First sentence.",
            "upgrade_notes": "OK"
        },
        {
            "sentence_num": 2,
            "original": "Second sentence has error.",
            "is_grammar_correct": False,
            "grammar_analysis": "Lỗi sai",
            "grammar_fix": "Second sentence is corrected.",
            "upgrade_needed": True,
            "upgraded_sentence": "Second sentence is perfected.",
            "upgrade_notes": "Fixed"
        }
    ]
    corrections = [
        {"original": "omitted by AI", "corrected": "evaluated properly", "explanation": "Grammar bug"}
    ]
    res = reconcile_sentence_breakdown(sentences, ai_breakdown, corrections, 7.0)
    assert len(res) == 4
    # All sentences re-numbered sequentially
    assert [r["sentence_num"] for r in res] == [1, 2, 3, 4]
    # Sentence 3 matched corrections
    assert res[2]["is_grammar_correct"] is False
    assert "evaluated properly" in res[2]["grammar_fix"]
    # Sentence 4 was backfilled as clean
    assert res[3]["is_grammar_correct"] is True
    assert res[3]["original"] == "Fourth sentence also omitted."


def test_reconcile_sentence_breakdown_empty_cases():
    """Boundary test: empty sentences list returns empty."""
    assert reconcile_sentence_breakdown([], None) == []
    assert reconcile_sentence_breakdown([], []) == []

