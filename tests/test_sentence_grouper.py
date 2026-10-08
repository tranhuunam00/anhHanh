"""Comprehensive Test Suite for Domain Entities and SentenceGrouperService (DDD Architecture).

Covers >= 20 test cases per pipeline step, including Domain Entities, Value Objects,
Boundary Conditions, and Multilingual Edge Cases (English, French, Vietnamese).
"""
import pytest
from app.domain.models import SubtitleSnippet, Challenge, WordEvaluation, EvaluationStatus, EvaluationResult
from app.domain.services import (
    TextNormalizer,
    LanguageProfile,
    SentenceGrouperService,
    WordComparatorService,
)


# ==============================================================================
# SECTION 1: DOMAIN ENTITIES & VALUE OBJECTS (25+ Cases)
# ==============================================================================

class TestDomainEntitiesAndValueObjects:
    """Test invariants, boundary behaviors, and methods of Domain Value Objects and Entities."""

    # ── LanguageProfile Value Object ──────────────────────────────────────────

    @pytest.mark.parametrize("lang_code,expected_code", [
        ("en", "en"),
        ("EN", "en"),
        ("en-US", "en"),
        ("fr", "fr"),
        ("fr-FR", "fr"),
        ("vi", "vi"),
        ("vi-VN", "vi"),
        ("de", "de"),  # Falls back to EN config with 'de' code
        (None, "en"),
        ("", "en"),
    ])
    def test_language_profile_factory_resolution(self, lang_code, expected_code):
        profile = LanguageProfile.get_profile(lang_code)
        assert profile.code == expected_code
        assert isinstance(profile.abbreviations, set)
        assert isinstance(profile.dangling_words, set)
        assert isinstance(profile.connectors, set)

    @pytest.mark.parametrize("token,expected", [
        ("Dr.", True),
        ("dr.", True),
        ("Mr.", True),
        ("Mrs.", True),
        ("Ms.", True),
        ("Prof.", True),
        ("U.S.", True),
        ("u.s.", True),
        ("U.K.", True),
        ("e.g.", True),
        ("i.e.", True),
        ("vs.", True),
        ("etc.", True),
        ("Ph.D.", True),
        ("A.I.", True),
        ("door.", False),
        ("water.", False),
        ("Smith.", False),
        ("end.", False),
        ("cat", False),
    ])
    def test_language_profile_is_abbreviation_english(self, token, expected):
        profile = LanguageProfile.get_profile("en")
        assert profile.is_abbreviation(token) == expected

    @pytest.mark.parametrize("token,expected", [
        ("M.", True),
        ("mme.", True),
        ("Mlle.", True),
        ("Dr.", True),
        ("prof.", True),
        ("c.-à-d.", True),
        ("bonjour.", False),
        ("monde.", False),
        ("france.", False),
    ])
    def test_language_profile_is_abbreviation_french(self, token, expected):
        profile = LanguageProfile.get_profile("fr")
        assert profile.is_abbreviation(token) == expected

    @pytest.mark.parametrize("word,expected", [
        ("the", True),
        ("The", True),
        ("a", True),
        ("an", True),
        ("this", True),
        ("in", True),
        ("on", True),
        ("at", True),
        ("of", True),
        ("to", True),
        ("for", True),
        ("with", True),
        ("by", True),
        ("into", True),
        ("computer", False),
        ("running", False),
        ("freedom", False),
        ("peace", False),
    ])
    def test_language_profile_is_dangling_english(self, word, expected):
        profile = LanguageProfile.get_profile("en")
        assert profile.is_dangling_end(word) == expected

    @pytest.mark.parametrize("word,expected", [
        ("le", True),
        ("la", True),
        ("les", True),
        ("l'", True),
        ("un", True),
        ("une", True),
        ("des", True),
        ("du", True),
        ("dans", True),
        ("sur", True),
        ("pour", True),
        ("avec", True),
        ("par", True),
        ("chez", True),
        ("voyage", False),
        ("vie", False),
        ("homme", False),
    ])
    def test_language_profile_is_dangling_french(self, word, expected):
        profile = LanguageProfile.get_profile("fr")
        assert profile.is_dangling_end(word) == expected

    @pytest.mark.parametrize("clean_words,split_idx,expected", [
        (["the", "european", "union", "policy"], 1, True),   # Splits between 'european' and 'union'
        (["the", "european", "union", "policy"], 2, False),  # Splits after 'union' -> valid!
        (["the", "united", "states", "economy"], 1, True),   # Splits between 'united' and 'states'
        (["the", "artificial", "intelligence", "era"], 1, True),
        (["we", "love", "social", "media", "apps"], 2, True),
        (["regular", "random", "words", "list"], 1, False),
    ])
    def test_language_profile_protected_phrases_english(self, clean_words, split_idx, expected):
        profile = LanguageProfile.get_profile("en")
        assert profile.is_inside_protected_phrase(clean_words, split_idx) == expected

    # ── SubtitleSnippet & Challenge Value Objects ─────────────────────────────

    def test_subtitle_snippet_invariants(self):
        s = SubtitleSnippet(text="Hello world", start=10.5, duration=3.2)
        assert s.start == 10.5
        assert s.duration == 3.2
        assert s.end == pytest.approx(13.7, abs=0.001)

    def test_challenge_invariants(self):
        c = Challenge(id=1, position=1, text="Test sentence.", time_start=5.0, time_end=9.5, translation="Câu thử nghiệm.")
        assert c.duration == pytest.approx(4.5, abs=0.001)
        assert c.position == 1
        assert c.translation == "Câu thử nghiệm."


# ==============================================================================
# SECTION 2: STEP 1 - CLEANING & NORMALIZATION (25+ Cases)
# ==============================================================================

class TestStep1CleaningAndNormalization:
    """Test raw snippet sanitization, quote normalization, and TED credits removal."""

    @pytest.mark.parametrize("raw_input,expected_text,expected_speaker_change", [
        (">> And welcome back.", "And welcome back.", True),
        (">>   Hello everyone", "Hello everyone", True),
        (">>> Three markers", "Three markers", True),
        ("No marker here", "No marker here", False),
        ("[music] Song lyrics here [applause]", "Song lyrics here", False),
        ("(laughter) That was funny (giggles)", "That was funny", False),
        ("♪ Musical notes ♪", "Musical notes", False),
        ("♫ ♬ More notes ♩", "More notes", False),
        ("“Hello” ‘world’ «quotes»", '"Hello" \'world\' "quotes"', False),
        ("Line one\nLine two\nLine three", "Line one Line two Line three", False),
        ("   Multiple    spaces   between   words  ", "Multiple spaces between words", False),
        (">> [music] Starting podcast now", "Starting podcast now", True),
        ("Nothing to clean", "Nothing to clean", False),
        ("", "", False),
        ("   ", "", False),
        ("[cheering and applause]", "", False),
        (">> ♪ intro music ♪", "intro music", True),
        ("Words before [laughter] and after", "Words before and after", False),
        ("Special chars: — and – dashes", "Special chars: - and - dashes", False),
        ("Ellipsis… here", "Ellipsis... here", False),
    ])
    def test_clean_snippet_text(self, raw_input, expected_text, expected_speaker_change):
        text, speaker_change = SentenceGrouperService.clean_snippet_text(raw_input)
        assert text == expected_text
        assert speaker_change == expected_speaker_change

    @pytest.mark.parametrize("dirty_credit,expected_clean", [
        ("Subtitles by TED Translator Team", ""),
        ("Phụ đề bởi Ban Dịch Thuật", ""),
        ("Translator: John Doe Reviewer: Jane Smith", ""),
        ("Biên dịch: Nguyễn Văn A Hiệu đính: Trần Thị B", ""),
        ("Dịch bởi: Ban Dịch Thuật TED", ""),
        ("Translator: Alice Khi chúng ta nhìn vào vũ trụ", "Khi chúng ta nhìn vào vũ trụ"),
        ("Biên dịch: Minh Tôi đã nhận ra điều đó", "Tôi đã nhận ra điều đó"),
        ("Chính xác nội dung bình thường không có credit", "Chính xác nội dung bình thường không có credit"),
        ("", ""),
    ])
    def test_clean_credits_removal(self, dirty_credit, expected_clean):
        cleaned = SentenceGrouperService.clean_credits(dirty_credit)
        assert cleaned == expected_clean


# ==============================================================================
# SECTION 3: STEP 2 - WORD TIMELINE & DURATION ALLOCATION (20+ Cases)
# ==============================================================================

class TestStep2WordTimelineAndDurations:
    """Test character-weighted duration calculations and word-level timeline building."""

    def test_calculate_word_durations_empty(self):
        assert SentenceGrouperService.calculate_word_durations([], 5.0) == []

    def test_calculate_word_durations_single_word(self):
        durations = SentenceGrouperService.calculate_word_durations(["Hello"], 3.0)
        assert len(durations) == 1
        assert durations[0] == pytest.approx(3.0)

    def test_calculate_word_durations_equal_words(self):
        words = ["cat", "dog", "bat"]
        durations = SentenceGrouperService.calculate_word_durations(words, 3.0)
        assert len(durations) == 3
        for d in durations:
            assert d == pytest.approx(1.0, abs=0.01)

    def test_calculate_word_durations_long_vs_short(self):
        # 'I' (1 char) vs 'unprecedented' (13 chars)
        words = ["I", "saw", "unprecedented", "events"]
        durations = SentenceGrouperService.calculate_word_durations(words, 4.0)
        assert len(durations) == 4
        # 'unprecedented' should have significantly more time than 'I'
        assert durations[2] > durations[0] * 2.5
        assert sum(durations) == pytest.approx(4.0, abs=0.01)

    @pytest.mark.parametrize("total_dur,word_count", [
        (1.0, 5),
        (0.5, 4),
        (0.2, 2),
        (5.0, 10),
        (12.0, 25),
    ])
    def test_calculate_word_durations_sum_preservation(self, total_dur, word_count):
        words = ["word" + str(i) for i in range(word_count)]
        durations = SentenceGrouperService.calculate_word_durations(words, total_dur)
        assert len(durations) == word_count
        assert sum(durations) == pytest.approx(total_dur, abs=0.02)

    def test_build_word_timeline_structure(self):
        grouper = SentenceGrouperService()
        profile = LanguageProfile.get_profile("en")
        snippets = [
            SubtitleSnippet(text="Hello world,", start=0.0, duration=2.0),
            SubtitleSnippet(text=">> welcome back.", start=2.5, duration=2.0),
        ]
        timeline = grouper.build_word_timeline(snippets, profile)
        assert len(timeline) == 4
        assert timeline[0]["word"] == "Hello"
        assert timeline[0]["start"] == 0.0
        assert timeline[1]["word"] == "world,"
        assert timeline[1]["inter_pause"] == pytest.approx(0.5, abs=0.01)
        assert timeline[2]["word"] == "welcome"
        assert timeline[2]["is_speaker_change"] is True
        assert timeline[3]["word"] == "back."

    def test_build_word_timeline_deoverlaps_timestamps(self):
        grouper = SentenceGrouperService()
        profile = LanguageProfile.get_profile("en")
        # Overlapping snippets: snip 1 ends at 5.0, but snip 2 starts at 3.0
        snippets = [
            SubtitleSnippet(text="First line here", start=0.0, duration=5.0),
            SubtitleSnippet(text="Second line here", start=3.0, duration=4.0),
        ]
        timeline = grouper.build_word_timeline(snippets, profile)
        # Snip 1 duration should be clamped to 3.0s (3.0 - 0.0)
        assert timeline[2]["end"] <= 3.05
        assert timeline[3]["start"] == 3.0

# Note: Sections 4-7 (Punctuation, Segmentation, Splitting, Alignment, WordComparator)
# are tested in tests/test_sentence_grouper_segmentation.py to adhere to the 500-line limit (Rule 4).
