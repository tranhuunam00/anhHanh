"""Comprehensive Unit Tests for Extracted Domain Services.

Covers:
- TextNormalizer: happy paths, curly quotes, exotic punctuation, empty/bad inputs
- WordComparatorService: strict vs lenient punctuation, missing, extra, 100% accuracy, empty inputs
- LanguageProfile: profile retrieval, abbreviations, dangling words, connectors, protected phrases
- SentenceGrouperService helper methods: clean_credits, clean_snippet_text, calculate_word_durations,
  is_terminal_punctuation, is_clause_punctuation.
"""
import pytest
from app.domain.text_normalizer import TextNormalizer
from app.domain.word_comparator import WordComparatorService
from app.domain.language_profile import LanguageProfile
from app.domain.sentence_grouper import SentenceGrouperService
from app.domain.models import EvaluationStatus


# ==============================================================================
# 1. Tests for TextNormalizer
# ==============================================================================

class TestTextNormalizer:
    def test_normalize_quotes_curly_and_guillemets(self):
        raw = "‘Hello’ “World” «Bonjour» „Guten Tag“ — test – dash…"
        expected = "'Hello' \"World\" \"Bonjour\" \"Guten Tag\"  -  test  -  dash..."
        assert TextNormalizer.normalize_quotes(raw) == expected

    def test_normalize_quotes_empty_and_plain(self):
        assert TextNormalizer.normalize_quotes("") == ""
        assert TextNormalizer.normalize_quotes("Simple ASCII text") == "Simple ASCII text"

    def test_strip_punctuation_edges_and_internal_apostrophes(self):
        assert TextNormalizer.strip_punctuation("...hello!") == "hello"
        assert TextNormalizer.strip_punctuation("don't") == "don't"
        assert TextNormalizer.strip_punctuation("state-of-the-art") == "state-of-the-art"
        assert TextNormalizer.strip_punctuation("?!?,") == ""

    def test_clean_word_normalizes_case_and_punctuation(self):
        assert TextNormalizer.clean_word("“Apple,”") == "apple"
        assert TextNormalizer.clean_word("  IT'S  ") == "it's"
        assert TextNormalizer.clean_word("") == ""
        assert TextNormalizer.clean_word("...—...") == ""


# ==============================================================================
# 2. Tests for WordComparatorService
# ==============================================================================

class TestWordComparatorService:
    def setup_method(self):
        self.service = WordComparatorService()

    def test_evaluate_perfect_match(self):
        target = "The quick brown fox jumps."
        user = "The quick brown fox jumps."
        result = self.service.evaluate(target, user)

        assert result.is_completed is True
        assert result.accuracy_percentage == 100.0
        assert result.correct_count == 5
        assert result.total_words == 5
        assert all(w.status == EvaluationStatus.CORRECT for w in result.words)

    def test_evaluate_case_insensitive_lenient_punctuation(self):
        target = "Hello, world!"
        user = "hello world"
        result = self.service.evaluate(target, user, strict_punctuation=False)

        assert result.is_completed is True
        assert result.accuracy_percentage == 100.0
        assert result.correct_count == 2

    def test_evaluate_strict_punctuation_mismatch(self):
        target = "Hello, world!"
        user = "hello world"
        result = self.service.evaluate(target, user, strict_punctuation=True)

        assert result.is_completed is False
        assert result.correct_count == 0
        assert all(w.status == EvaluationStatus.INCORRECT for w in result.words)

    def test_evaluate_missing_words(self):
        target = "One two three four"
        user = "One two"
        result = self.service.evaluate(target, user)

        assert result.is_completed is False
        assert result.accuracy_percentage == 50.0
        assert result.correct_count == 2
        assert result.total_words == 4
        assert result.words[2].status == EvaluationStatus.MISSING
        assert result.words[3].status == EvaluationStatus.MISSING

    def test_evaluate_extra_words(self):
        target = "Go home"
        user = "Go home right now"
        result = self.service.evaluate(target, user)

        assert result.is_completed is False
        assert result.correct_count == 2
        assert len(result.words) == 4
        assert result.words[2].status == EvaluationStatus.EXTRA
        assert result.words[3].status == EvaluationStatus.EXTRA

    def test_evaluate_empty_inputs(self):
        res1 = self.service.evaluate("", "")
        assert res1.is_completed is True
        assert res1.accuracy_percentage == 0.0
        assert res1.total_words == 0

        res2 = self.service.evaluate("Target text", "")
        assert res2.is_completed is False
        assert res2.accuracy_percentage == 0.0
        assert res2.correct_count == 0
        assert all(w.status == EvaluationStatus.MISSING for w in res2.words)


# ==============================================================================
# 3. Tests for LanguageProfile
# ==============================================================================

class TestLanguageProfile:
    def test_get_profile_en(self):
        profile = LanguageProfile.get_profile("en")
        assert profile.code == "en"
        assert profile.is_abbreviation("Dr.") is True
        assert profile.is_abbreviation("U.S.") is True
        assert profile.is_abbreviation("Ph.D.") is True
        assert profile.is_abbreviation("Apple.") is False

    def test_get_profile_fr(self):
        profile = LanguageProfile.get_profile("fr")
        assert profile.code == "fr"
        assert profile.is_abbreviation("M.") is True
        assert profile.is_abbreviation("Mme.") is True
        assert profile.is_dangling_end("dans") is True
        assert profile.is_connector("parce") is True

    def test_get_profile_vi(self):
        profile = LanguageProfile.get_profile("vi")
        assert profile.code == "vi"
        assert profile.is_abbreviation("TP.") is True
        assert profile.is_abbreviation("UBND.") is True
        assert profile.is_dangling_end("những") is True
        assert profile.is_connector("nhưng") is True

    def test_get_profile_fallback_to_en(self):
        profile = LanguageProfile.get_profile("xx-unknown")
        assert profile.code == "xx"
        # Falls back to English abbreviation set
        assert profile.is_abbreviation("mr.") is True

    def test_is_inside_protected_phrase(self):
        profile = LanguageProfile.get_profile("en")
        words = ["the", "white", "house", "spokesman", "said"]
        # Splitting after "white" (index 1) breaks inside "white house"
        assert profile.is_inside_protected_phrase(words, 1) is True
        # Splitting after "house" (index 2) is allowed (end of phrase)
        assert profile.is_inside_protected_phrase(words, 2) is False
        # Splitting after "the" (index 0) is before phrase
        assert profile.is_inside_protected_phrase(words, 0) is False


# ==============================================================================
# 4. Tests for SentenceGrouperService Helper Methods
# ==============================================================================

class TestSentenceGrouperHelpers:
    def test_clean_credits_ted_patterns(self):
        raw = "Người dịch: Nguyen Van A. Phụ đề bởi TED. Chào mừng các bạn đến với buổi nói chuyện."
        cleaned = SentenceGrouperService.clean_credits(raw)
        assert "Chào mừng các bạn" in cleaned
        assert "Người dịch" not in cleaned

    def test_clean_credits_empty_or_pure_credit(self):
        assert SentenceGrouperService.clean_credits("") == ""
        assert SentenceGrouperService.clean_credits("Translator: John Doe") == ""
        assert SentenceGrouperService.clean_credits("Subtitles by Community") == ""

    def test_clean_snippet_text_brackets_and_speaker_change(self):
        raw = ">> [Music playing] Hello everyone ♪"
        cleaned, is_speaker = SentenceGrouperService.clean_snippet_text(raw)
        assert is_speaker is True
        assert cleaned == "Hello everyone"

    def test_calculate_word_durations_distribution(self):
        words = ["Short", "ExtremelyLongWordHere"]
        durations = SentenceGrouperService.calculate_word_durations(words, 2.0)
        assert len(durations) == 2
        assert sum(durations) == pytest.approx(2.0, rel=1e-3)
        # Longer word gets more time
        assert durations[1] > durations[0]

    def test_calculate_word_durations_single_or_empty(self):
        assert SentenceGrouperService.calculate_word_durations([], 1.0) == []
        d = SentenceGrouperService.calculate_word_durations(["Solo"], 0.05)
        assert len(d) == 1
        assert d[0] >= 0.12  # Clamped minimum

    def test_is_terminal_punctuation(self):
        profile = LanguageProfile.get_profile("en")
        assert SentenceGrouperService.is_terminal_punctuation("world.", profile) is True
        assert SentenceGrouperService.is_terminal_punctuation("really?!", profile) is True
        assert SentenceGrouperService.is_terminal_punctuation('"quoted."', profile) is True
        assert SentenceGrouperService.is_terminal_punctuation("Dr.", profile) is False
        assert SentenceGrouperService.is_terminal_punctuation("3.14", profile) is False

    def test_is_clause_punctuation(self):
        assert SentenceGrouperService.is_clause_punctuation("well,") is True
        assert SentenceGrouperService.is_clause_punctuation("however;") is True
        assert SentenceGrouperService.is_clause_punctuation("$10,000") is False
        assert SentenceGrouperService.is_clause_punctuation("word") is False
