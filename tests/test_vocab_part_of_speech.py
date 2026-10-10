"""Unit tests for Part of Speech (Từ loại) normalization, persistence, and multi-language support.

Covers:
1. Input coverage: happy path, edge cases, None/empty/whitespace, multi-POS combinations, foreign languages.
2. Output verification: canonical tokens, deduplicated strings, localized Vietnamese labels.
3. Internal logic: branching, case insensitivity, multi-delimiters.
4. Error handling: invalid types, empty sets, fallback mechanisms.
"""
import pytest
from unittest.mock import MagicMock, patch

from app.infrastructure.pos_service import (
    parse_pos_tokens,
    normalize_single_pos,
    normalize_pos_string,
    format_pos_display,
    STANDARD_POS_MAP,
    VIETNAMESE_POS_LABELS,
)
from app.presentation.vocab_api_helpers import (
    resolve_word_meaning_helper,
    resolve_word_pos_helper,
    resolve_word_image_helper,
)
from app.infrastructure.database.models import UserVocabulary


class TestPosServiceUnit:
    """Detailed unit tests for POS parsing, normalization, and display."""

    def test_parse_pos_tokens_happy_path(self):
        assert parse_pos_tokens("noun, verb") == ["noun", "verb"]
        assert parse_pos_tokens("adj / adv") == ["adj", "adv"]
        assert parse_pos_tokens("noun; verb; adjective") == ["noun", "verb", "adjective"]

    def test_parse_pos_tokens_edge_cases(self):
        assert parse_pos_tokens(None) == []
        assert parse_pos_tokens("") == []
        assert parse_pos_tokens("   ") == []
        assert parse_pos_tokens(",,,;;;///") == []
        # Deduplication preserving order (case-insensitive deduplication)
        assert parse_pos_tokens("noun, Noun, NOUN, verb") == ["noun", "verb"]

    def test_normalize_single_pos(self):
        assert normalize_single_pos("n") == "noun"
        assert normalize_single_pos("N") == "noun"
        assert normalize_single_pos("v") == "verb"
        assert normalize_single_pos("adj") == "adjective"
        assert normalize_single_pos("adv") == "adverb"
        assert normalize_single_pos("prep") == "preposition"
        assert normalize_single_pos("danh từ") == "noun"
        assert normalize_single_pos("động từ") == "verb"
        # Foreign languages
        assert normalize_single_pos("verbe") == "verb"
        assert normalize_single_pos("adjektiv") == "adjective"
        assert normalize_single_pos("名詞") == "noun"
        assert normalize_single_pos("动词") == "verb"
        assert normalize_single_pos("명사") == "noun"
        # Custom/unknown preserved
        assert normalize_single_pos("custom_pos") == "custom_pos"
        assert normalize_single_pos("") == ""

    def test_normalize_pos_string_multi_pos(self):
        # A word can have multiple parts of speech
        raw = "N, v, Adjective"
        assert normalize_pos_string(raw) == "noun, verb, adjective"

        # Duplicate variants unified
        assert normalize_pos_string("noun, n, Danh từ") == "noun"

        # None/empty
        assert normalize_pos_string(None) is None
        assert normalize_pos_string("   ") is None

    def test_format_pos_display(self):
        # Vietnamese display
        assert format_pos_display("noun, verb", lang="vi") == "Danh từ, Động từ"
        assert format_pos_display("adjective", lang="vi") == "Tính từ"
        assert format_pos_display(None, lang="vi") == ""
        assert format_pos_display("", lang="vi") == ""

        # Fallback for non-standard or foreign
        assert format_pos_display("phrase", lang="vi") == "Cụm từ"
        assert format_pos_display("unknown_type", lang="vi") == "unknown_type"


class TestVocabApiHelpersUnit:
    """Unit tests for vocab API helper functions."""

    def test_resolve_word_meaning_helper(self):
        mock_trans = MagicMock()
        mock_trans.translate.return_value = "chạy"

        # When provided_meaning exists
        assert resolve_word_meaning_helper("run", "chạy bộ", "en", "vi", mock_trans) == "chạy bộ"

        # When provided_meaning is empty
        assert resolve_word_meaning_helper("run", "", "en", "vi", mock_trans) == "chạy"

        # When translation fails
        mock_trans.translate.side_effect = Exception("Network error")
        assert resolve_word_meaning_helper("run", None, "en", "vi", mock_trans) == "run"

    def test_resolve_word_pos_helper(self):
        # Explicit POS provided
        assert resolve_word_pos_helper("run", "v, n") == "verb, noun"

        # Phrase auto-detection
        assert resolve_word_pos_helper("take off", None) == "phrase"

        # Fallback to dictionary service
        with patch("app.infrastructure.image_search_service.ImageSearchService.get_word_details") as mock_details:
            mock_details.return_value = {"part_of_speech": "noun, verb"}
            assert resolve_word_pos_helper("record", None) == "noun, verb"

    def test_resolve_word_image_helper(self):
        # Provided image
        assert resolve_word_image_helper("cat", "http://cat.png", "", "con mèo") == "http://cat.png"

        # Auto search fallback
        with patch("app.infrastructure.image_search_service.ImageSearchService.get_image_candidates") as mock_img:
            mock_img.return_value = ["http://auto.png"]
            assert resolve_word_image_helper("cat", None, "", "con mèo") == "http://auto.png"


class TestUserVocabularyModelPos:
    """Verify UserVocabulary model serialization includes part_of_speech."""

    def test_user_vocabulary_to_dict_includes_pos(self):
        vocab = UserVocabulary(
            id="test-uuid",
            user_id="user-123",
            word="consumables",
            phonetic="/kʌnsˈumʌbʌɫz/",
            part_of_speech="noun",
            meaning="hàng tiêu dùng",
            context_sentence="These goods are consumables.",
            status="NEW"
        )
        data = vocab.to_dict()
        assert "part_of_speech" in data
        assert data["part_of_speech"] == "noun"
        assert data["word"] == "consumables"
