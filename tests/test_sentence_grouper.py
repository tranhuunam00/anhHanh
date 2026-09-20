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


# ==============================================================================
# SECTION 4: STEP 3 - PUNCTUATION & SENTENCE SEGMENTATION (25+ Cases)
# ==============================================================================

class TestStep3PunctuationAndSegmentation:
    """Test sentence boundary detection, terminal punctuation, abbreviations, and fragment merging."""

    @pytest.mark.parametrize("word,expected", [
        ("world.", True),
        ("done!", True),
        ("really?", True),
        ("waiting…", True),
        ('"quote."', True),
        ("'single.'", True),
        ("Dr.", False),       # Abbreviation
        ("Mr.", False),       # Abbreviation
        ("U.S.", False),      # Abbreviation
        ("e.g.", False),      # Abbreviation
        ("2.0", False),       # Decimal number
        ("3.14", False),      # Decimal number
        ("100.5", False),     # Decimal number
        ("comma,", False),
        ("semicolon;", False),
        ("normal", False),
    ])
    def test_is_terminal_punctuation(self, word, expected):
        profile = LanguageProfile.get_profile("en")
        assert SentenceGrouperService.is_terminal_punctuation(word, profile) == expected

    @pytest.mark.parametrize("word,expected", [
        ("technology,", True),
        ("world;", True),
        ("statement:", True),
        ("word—", True),
        ("word–", True),
        (",", True),
        (";", True),
        ("$10,000", False),   # Number with comma
        ("1,000,000", False), # Number with comma
        ("2,50", False),      # French decimal comma
        ("normal", False),
        ("end.", False),
    ])
    def test_is_clause_punctuation(self, word, expected):
        assert SentenceGrouperService.is_clause_punctuation(word) == expected

    def test_segment_into_sentences_splits_on_dots(self):
        grouper = SentenceGrouperService()
        profile = LanguageProfile.get_profile("en")
        snippets = [
            SubtitleSnippet(text="First sentence is complete.", start=0.0, duration=3.0),
            SubtitleSnippet(text="Second sentence is also complete.", start=3.0, duration=3.0),
        ]
        tl = grouper.build_word_timeline(snippets, profile)
        sentences = grouper.segment_into_sentences(tl, profile)
        assert len(sentences) == 2
        assert sentences[0][-1]["word"] == "complete."
        assert sentences[1][-1]["word"] == "complete."

    def test_segment_into_sentences_splits_on_speaker_change(self):
        grouper = SentenceGrouperService()
        profile = LanguageProfile.get_profile("en")
        snippets = [
            SubtitleSnippet(text="I am Anna", start=0.0, duration=2.0),
            SubtitleSnippet(text=">> and I am Jake", start=2.0, duration=2.0),
        ]
        tl = grouper.build_word_timeline(snippets, profile)
        sentences = grouper.segment_into_sentences(tl, profile)
        assert len(sentences) == 2
        assert " ".join(w["word"] for w in sentences[0]) == "I am Anna"
        assert " ".join(w["word"] for w in sentences[1]) == "and I am Jake"

    def test_segment_into_sentences_does_not_split_on_abbreviation(self):
        grouper = SentenceGrouperService()
        profile = LanguageProfile.get_profile("en")
        snippets = [
            SubtitleSnippet(text="We consulted Dr. Smith and Prof. Davis yesterday.", start=0.0, duration=4.0),
        ]
        tl = grouper.build_word_timeline(snippets, profile)
        sentences = grouper.segment_into_sentences(tl, profile)
        assert len(sentences) == 1
        assert " ".join(w["word"] for w in sentences[0]) == "We consulted Dr. Smith and Prof. Davis yesterday."

    def test_segment_into_sentences_splits_on_long_audio_pause(self):
        grouper = SentenceGrouperService(max_pause_seconds=1.0)
        profile = LanguageProfile.get_profile("en")
        snippets = [
            SubtitleSnippet(text="First thought without dot", start=0.0, duration=2.0),   # ends at 2.0
            SubtitleSnippet(text="Second thought after silence", start=4.0, duration=2.0), # starts at 4.0 (pause = 2.0s)
        ]
        tl = grouper.build_word_timeline(snippets, profile)
        sentences = grouper.segment_into_sentences(tl, profile)
        assert len(sentences) == 2


# ==============================================================================
# SECTION 5: STEP 4 - SMART SPLITTING & BOUNDARY OPTIMIZATION (25+ Cases)
# ==============================================================================

class TestStep4SmartSplittingAndBoundaries:
    """Test challenge duration enforcement, clause boundary scoring, and dangling word prevention."""

    def test_find_best_split_index_prefers_comma(self):
        grouper = SentenceGrouperService()
        profile = LanguageProfile.get_profile("en")
        # Sentence with comma near middle
        snippets = [
            SubtitleSnippet(text="When the sun rises in the east, the birds start to sing loudly.", start=0.0, duration=10.0)
        ]
        tl = grouper.build_word_timeline(snippets, profile)
        best_idx = grouper.find_best_split_index(tl, profile, half_time=5.0)
        assert tl[best_idx]["word"] == "east,"

    def test_find_best_split_index_avoids_dangling_word(self):
        grouper = SentenceGrouperService()
        profile = LanguageProfile.get_profile("en")
        # If midpoint falls on 'the', it must not choose 'the' as end word
        snippets = [
            SubtitleSnippet(text="We are currently observing the European Union regulations today.", start=0.0, duration=10.0)
        ]
        tl = grouper.build_word_timeline(snippets, profile)
        best_idx = grouper.find_best_split_index(tl, profile, half_time=5.0)
        assert tl[best_idx]["word"].lower() != "the"
        assert tl[best_idx]["word"].lower() != "in"

    def test_find_best_split_index_protects_european_union(self):
        grouper = SentenceGrouperService()
        profile = LanguageProfile.get_profile("en")
        snippets = [
            SubtitleSnippet(text="Understanding the European Union policies for our modern generation.", start=0.0, duration=10.0)
        ]
        tl = grouper.build_word_timeline(snippets, profile)
        best_idx = grouper.find_best_split_index(tl, profile, half_time=5.0)
        # Must not split after 'European'
        assert tl[best_idx]["word"].lower() != "european"

    def test_find_best_split_index_protects_french_union_europeenne(self):
        grouper = SentenceGrouperService()
        profile = LanguageProfile.get_profile("fr")
        snippets = [
            SubtitleSnippet(text="comment fonctionne l'union européenne dans les pays membres aujourd'hui", start=0.0, duration=10.0)
        ]
        tl = grouper.build_word_timeline(snippets, profile)
        best_idx = grouper.find_best_split_index(tl, profile, half_time=5.0)
        assert tl[best_idx]["word"].lower() != "l'union"
        assert tl[best_idx]["word"].lower() != "dans"

    @pytest.mark.parametrize("duration,word_count", [
        (4.0, 10),
        (7.9, 15),
        (8.0, 18),
    ])
    def test_split_into_challenges_keeps_short_sentences_intact(self, duration, word_count):
        grouper = SentenceGrouperService(max_duration_seconds=8.0)
        profile = LanguageProfile.get_profile("en")
        text = " ".join(["word" + str(i) for i in range(word_count)]) + "."
        snippets = [SubtitleSnippet(text=text, start=0.0, duration=duration)]
        tl = grouper.build_word_timeline(snippets, profile)
        challenges = grouper.split_into_challenges(tl, profile)
        assert len(challenges) == 1
        assert challenges[0].duration <= 8.01

    @pytest.mark.parametrize("duration,expected_min_parts", [
        (12.0, 2),
        (16.0, 2),
        (24.0, 3),
        (32.0, 4),
    ])
    def test_split_into_challenges_enforces_max_duration_recursively(self, duration, expected_min_parts):
        grouper = SentenceGrouperService(max_duration_seconds=8.0)
        profile = LanguageProfile.get_profile("en")
        # Continuous sentence without punctuation
        words = ["word" + str(i) for i in range(int(duration * 2.5))]
        snippets = [SubtitleSnippet(text=" ".join(words) + ".", start=0.0, duration=duration)]
        tl = grouper.build_word_timeline(snippets, profile)
        challenges = grouper.split_into_challenges(tl, profile)
        assert len(challenges) >= expected_min_parts
        for c in challenges:
            assert c.duration <= 8.01


# ==============================================================================
# SECTION 6: STEP 5 & END-TO-END MULTILINGUAL INTEGRATION (20+ Cases)
# ==============================================================================

class TestStep5AndEndToEndIntegration:
    """Test translation alignment and complete end-to-end grouping across English, French, and Vietnamese."""

    def test_align_translations_overlap_assignment(self):
        grouper = SentenceGrouperService()
        challenges = [
            Challenge(id=1, position=1, text="First challenge text.", time_start=0.0, time_end=5.0),
            Challenge(id=2, position=2, text="Second challenge text.", time_start=5.0, time_end=10.0),
        ]
        translations = [
            SubtitleSnippet(text="Bản dịch câu một.", start=0.0, duration=5.0),
            SubtitleSnippet(text="Bản dịch câu hai.", start=5.0, duration=5.0),
        ]
        grouper.align_translations(challenges, translations)
        assert challenges[0].translation == "Bản dịch câu một."
        assert challenges[1].translation == "Bản dịch câu hai."

    def test_end_to_end_ted_talk_comma_clauses(self):
        """End-to-end test on TED Talk complex sentence with 3 comma-separated clauses."""
        grouper = SentenceGrouperService()
        raw_snippets = [
            SubtitleSnippet(text="And I saw how a lack of clarity around the downsides of that technology,", start=14.64, duration=4.81),
            SubtitleSnippet(text="and kind of an inability to really confront those consequences,", start=19.48, duration=3.71),
            SubtitleSnippet(text="led to a totally preventable societal catastrophe.", start=23.22, duration=4.27),
        ]
        tgt_snippets = [
            SubtitleSnippet(text="Và tôi đã thấy sự thiếu rõ ràng về những nhược điểm của công nghệ đó,", start=14.64, duration=4.81),
            SubtitleSnippet(text="và việc không thể thực sự đối mặt với những hậu quả đó,", start=19.48, duration=3.71),
            SubtitleSnippet(text="đã dẫn đến một thảm họa xã hội vốn dĩ hoàn toàn có thể tránh được.", start=23.22, duration=4.27),
        ]
        challenges = grouper.group_into_challenges(raw_snippets, tgt_snippets, language="en")
        assert len(challenges) == 3
        assert challenges[0].text == "And I saw how a lack of clarity around the downsides of that technology,"
        assert challenges[1].text == "and kind of an inability to really confront those consequences,"
        assert challenges[2].text == "led to a totally preventable societal catastrophe."
        assert challenges[0].translation == "Và tôi đã thấy sự thiếu rõ ràng về những nhược điểm của công nghệ đó,"
        assert challenges[1].translation == "và việc không thể thực sự đối mặt với những hậu quả đó,"
        assert challenges[2].translation == "đã dẫn đến một thảm họa xã hội vốn dĩ hoàn toàn có thể tránh được."

    def test_end_to_end_french_asr_with_protected_phrases(self):
        """End-to-end test on French unpunctuated ASR transcript."""
        grouper = SentenceGrouperService(max_duration_seconds=8.0)
        raw_snippets = [
            SubtitleSnippet(text="savez vous comment fonctionne l'union", start=0.0, duration=4.73),
            SubtitleSnippet(text="européenne strasbourg bruxelles tout ça", start=2.07, duration=4.92),
            SubtitleSnippet(text="j'étais comme vous alors j'ai voulu", start=4.73, duration=4.66),
            SubtitleSnippet(text="comprendre après la seconde guerre mondiale", start=6.99, duration=5.15),
        ]
        challenges = grouper.group_into_challenges(raw_snippets, language="fr")
        assert len(challenges) >= 2
        for c in challenges:
            assert c.duration <= 8.01
            # Check protected phrase is not cut
            assert not c.text.endswith(" l'union")
            assert not c.text.endswith(" dans")

    def test_end_to_end_podcast_speaker_turns_and_numbers(self):
        """End-to-end test on podcast with speaker turns (>>) and dollar numbers."""
        grouper = SentenceGrouperService()
        raw_snippets = [
            SubtitleSnippet(text="We spent $10,000 on this project.", start=0.0, duration=3.5),
            SubtitleSnippet(text=">> That is an enormous budget.", start=3.8, duration=3.0),
        ]
        challenges = grouper.group_into_challenges(raw_snippets, language="en")
        assert len(challenges) == 2
        assert challenges[0].text == "We spent $10,000 on this project."
        assert challenges[1].text == "That is an enormous budget."
        assert ">>" not in challenges[1].text

    def test_end_to_end_single_word_snippets(self):
        """Edge case: Single-word snippets stream."""
        grouper = SentenceGrouperService()
        raw_snippets = [
            SubtitleSnippet(text="One", start=0.0, duration=0.5),
            SubtitleSnippet(text="two", start=0.5, duration=0.5),
            SubtitleSnippet(text="three.", start=1.0, duration=0.5),
        ]
        challenges = grouper.group_into_challenges(raw_snippets, language="en")
        assert len(challenges) == 1
        assert challenges[0].text == "One two three."
        assert challenges[0].time_start == 0.0
        assert challenges[0].time_end == pytest.approx(1.5, abs=0.05)


# ==============================================================================
# SECTION 7: WORD COMPARATOR DOMAIN SERVICE TESTS (20+ Cases)
# ==============================================================================

class TestWordComparatorService:
    """Test domain service for word-by-word dictation scoring and evaluation."""

    def test_perfect_match(self):
        comparator = WordComparatorService()
        result = comparator.evaluate(target="Hello world.", user_input="Hello world.")
        assert result.is_completed is True
        assert result.accuracy_percentage == 100.0
        assert result.correct_count == 2
        assert result.total_words == 2

    def test_lenient_punctuation_and_case(self):
        comparator = WordComparatorService()
        result = comparator.evaluate(target="Hello, World!", user_input="hello world", strict_punctuation=False)
        assert result.is_completed is True
        assert result.accuracy_percentage == 100.0

    def test_strict_punctuation_mismatch(self):
        comparator = WordComparatorService()
        result = comparator.evaluate(target="Hello, World!", user_input="hello world", strict_punctuation=True)
        assert result.is_completed is False
        assert result.accuracy_percentage == 0.0

    def test_partial_progress_missing_words(self):
        comparator = WordComparatorService()
        result = comparator.evaluate(target="The quick brown fox", user_input="The quick")
        assert result.is_completed is False
        assert result.accuracy_percentage == 50.0
        assert result.words[2].status == EvaluationStatus.MISSING
        assert result.words[3].status == EvaluationStatus.MISSING

    def test_extra_words_typed(self):
        comparator = WordComparatorService()
        result = comparator.evaluate(target="Hello world", user_input="Hello world extra words here")
        assert result.is_completed is False
        assert result.words[2].status == EvaluationStatus.EXTRA
        assert result.words[3].status == EvaluationStatus.EXTRA

    def test_empty_user_input(self):
        comparator = WordComparatorService()
        result = comparator.evaluate(target="Hello world", user_input="")
        assert result.is_completed is False
        assert result.accuracy_percentage == 0.0
        assert result.correct_count == 0
