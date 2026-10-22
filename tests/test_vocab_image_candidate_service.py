"""Unit tests for ImageSearchService.get_image_candidates and resolve_word_image_helper.
Covers Input Coverage, Output Verification, Internal Logic Coverage, and Error Handling.
"""
from unittest.mock import patch, MagicMock
import io
import json
import pytest

from app.infrastructure.image_search_service import ImageSearchService, BAD_PATTERNS
from app.presentation.vocab_api_helpers import resolve_word_image_helper


# ============================================================================
# 1. resolve_word_image_helper Unit Tests
# ============================================================================

def test_resolve_word_image_helper_with_provided_url():
    """Happy path: provided non-empty URL is preserved."""
    url = "https://example.com/custom.jpg"
    res = resolve_word_image_helper("apple", url, "context", "trái táo")
    assert res == url


def test_resolve_word_image_helper_with_explicit_empty_url():
    """User choice: empty string explicitly provided returns None without auto-fetching."""
    with patch.object(ImageSearchService, "get_image_candidates") as mock_cand:
        res = resolve_word_image_helper("apple", "", "context", "trái táo")
        assert res is None
        mock_cand.assert_not_called()

    with patch.object(ImageSearchService, "get_image_candidates") as mock_cand:
        res = resolve_word_image_helper("apple", "   ", "context", "trái táo")
        assert res is None
        mock_cand.assert_not_called()


def test_resolve_word_image_helper_auto_search_when_none():
    """Auto search when image_url is None."""
    with patch.object(ImageSearchService, "get_image_candidates", return_value=["https://img.com/cand1.jpg"]):
        res = resolve_word_image_helper("apple", None, "eating an apple", "quả táo")
        assert res == "https://img.com/cand1.jpg"


def test_resolve_word_image_helper_fallback_none_when_empty_candidates():
    """Returns None when no candidates found without forcing random nature photo."""
    with patch.object(ImageSearchService, "get_image_candidates", return_value=[]):
        res = resolve_word_image_helper("manoeuvre", None, "", "")
        assert res is None


# ============================================================================
# 2. ImageSearchService.get_image_candidates Unit Tests
# ============================================================================

def test_get_image_candidates_empty_input():
    """Boundary case: empty or whitespace string returns empty list."""
    assert ImageSearchService.get_image_candidates("") == []
    assert ImageSearchService.get_image_candidates("   ") == []
    assert ImageSearchService.get_image_candidates(None) == []


def test_get_image_candidates_filters_bad_patterns():
    """Internal logic: filters medical, valsalva, cadastre, surgery thumbnails."""
    mock_wiki_resp = {
        "query": {
            "pages": {
                "1": {
                    "title": "Valsalva maneuver",
                    "thumbnail": {"source": "https://wiki.org/valsalva_maneuver.jpg"}
                },
                "2": {
                    "title": "Road Driving Maneuver",
                    "thumbnail": {"source": "https://wiki.org/road_driving.jpg"}
                }
            }
        }
    }

    raw_bytes = json.dumps(mock_wiki_resp).encode("utf-8")
    mock_fp = MagicMock()
    mock_fp.read.return_value = raw_bytes
    mock_fp.__enter__.return_value = mock_fp

    with patch("urllib.request.urlopen", return_value=mock_fp):
        candidates = ImageSearchService.get_image_candidates(
            word="manoeuvre",
            context_sentence="A driver had to make a sudden manoeuvre on the road.",
            max_results=5
        )
        assert "https://wiki.org/valsalva_maneuver.jpg" not in candidates
        assert "https://wiki.org/road_driving.jpg" in candidates


def test_get_image_candidates_chinese_word():
    """Internal logic: Chinese characters query zh.wikipedia.org."""
    mock_zh_resp = {
        "query": {
            "pages": {
                "10": {
                    "title": "苹果 (水果)",
                    "thumbnail": {"source": "https://zh.wikipedia.org/apple_fruit.jpg"}
                }
            }
        }
    }
    raw_bytes = json.dumps(mock_zh_resp).encode("utf-8")
    mock_fp = MagicMock()
    mock_fp.read.return_value = raw_bytes
    mock_fp.__enter__.return_value = mock_fp

    with patch("urllib.request.urlopen", return_value=mock_fp) as mock_urlopen:
        candidates = ImageSearchService.get_image_candidates(
            word="苹果",
            context_sentence="今天买了很多红色的苹果。",
            max_results=3
        )
        assert "https://zh.wikipedia.org/apple_fruit.jpg" in candidates
        # Verify call used zh.wikipedia.org
        first_call_args = mock_urlopen.call_args_list[0][0][0]
        assert "zh.wikipedia.org" in first_call_args.full_url


# ============================================================================
# 3. is_abstract_word and is_result_title_relevant Unit Tests
# ============================================================================

from app.infrastructure.image_search_service import is_abstract_word, is_result_title_relevant


def test_is_abstract_word_coverage():
    """Covers input coverage, output verification, logic coverage, and bad cases."""
    # English abstract concepts
    assert is_abstract_word("resilience") is True
    assert is_abstract_word("aspect") is True
    assert is_abstract_word("theory") is True
    assert is_abstract_word("concept") is True
    assert is_abstract_word("factor") is True
    assert is_abstract_word("perspective") is True

    # Chinese abstract concepts
    assert is_abstract_word("概念") is True
    assert is_abstract_word("理论") is True
    assert is_abstract_word("方面") is True
    assert is_abstract_word("韧性") is True

    # Concrete physical concepts
    assert is_abstract_word("apple") is False
    assert is_abstract_word("computer") is False
    assert is_abstract_word("cat") is False
    assert is_abstract_word("苹果") is False

    # Edge cases and bad inputs
    assert is_abstract_word("") is False
    assert is_abstract_word("   ") is False
    assert is_abstract_word(None) is False
    assert is_abstract_word(12345) is False


def test_is_result_title_relevant_coverage():
    """Covers input coverage, output verification, logic coverage, and bad cases."""
    # 1. English relevant matches
    assert is_result_title_relevant("apple", "Apple (fruit)", is_zh=False) is True
    assert is_result_title_relevant("apples", "Apple", is_zh=False) is True
    assert is_result_title_relevant("manoeuvre", "File:Road_manoeuvre_exercise.jpg", is_zh=False) is True

    # 2. Chinese relevant matches
    assert is_result_title_relevant("苹果", "苹果 (水果)", is_zh=True) is True
    assert is_result_title_relevant("跑步", "跑步机", is_zh=True) is True

    # 3. Disqualified qualifiers (media, vehicles, people)
    assert is_result_title_relevant("swift", "Taylor Swift (singer)", is_zh=False) is False
    assert is_result_title_relevant("resilience", "Crew Dragon Resilience", is_zh=False) is False
    assert is_result_title_relevant("foster", "Foster (film)", is_zh=False) is False

    # 4. Irrelevant/incidental titles
    assert is_result_title_relevant("manoeuvre", "Cadastre de France 1812", is_zh=False) is False
    assert is_result_title_relevant("苹果", "史蒂夫·乔布斯传记", is_zh=True) is False

    # 5. Bad / empty inputs
    assert is_result_title_relevant("", "Some Title", is_zh=False) is False
    assert is_result_title_relevant("apple", "", is_zh=False) is False
    assert is_result_title_relevant(None, None, is_zh=False) is False


def test_get_image_candidates_abstract_words_return_empty():
    """Verify abstract words return empty candidate list immediately without network requests."""
    with patch("urllib.request.urlopen") as mock_urlopen:
        assert ImageSearchService.get_image_candidates("resilience") == []
        assert ImageSearchService.get_image_candidates("aspect") == []
        assert ImageSearchService.get_image_candidates("theory") == []
        assert ImageSearchService.get_image_candidates("概念") == []
        mock_urlopen.assert_not_called()


def test_get_image_candidates_rejects_irrelevant_title():
    """Verify that search results with irrelevant titles are strictly rejected."""
    mock_wiki_resp = {
        "query": {
            "pages": {
                "1": {
                    "title": "SpaceX Crew Dragon Resilience",
                    "thumbnail": {"source": "https://wiki.org/dragon.jpg"}
                },
                "2": {
                    "title": "Unrelated Topic",
                    "thumbnail": {"source": "https://wiki.org/unrelated.jpg"}
                }
            }
        }
    }
    raw_bytes = json.dumps(mock_wiki_resp).encode("utf-8")
    mock_fp = MagicMock()
    mock_fp.read.return_value = raw_bytes
    mock_fp.__enter__.return_value = mock_fp

    with patch("urllib.request.urlopen", return_value=mock_fp):
        candidates = ImageSearchService.get_image_candidates("bicycle")
        # bicycle does not appear in "SpaceX Crew Dragon Resilience" nor "Unrelated Topic"
        assert candidates == []
