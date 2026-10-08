"""Punctuation, Segmentation, Splitting & Integration Tests for SentenceGrouperService.
Split from test_sentence_grouper.py to maintain max 500 lines per file (Rule 4).
"""
import pytest
from app.domain.models import SubtitleSnippet, Challenge, EvaluationStatus
from app.domain.services import (
    LanguageProfile,
    SentenceGrouperService,
    WordComparatorService,
)


# ==============================================================================
# SECTION 4: STEP 3 - PUNCTUATION & SENTENCE SEGMENTATION
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
# SECTION 5: STEP 4 - SMART SPLITTING & BOUNDARY OPTIMIZATION
# ==============================================================================

class TestStep4SmartSplittingAndBoundaries:
    """Test challenge duration enforcement, clause boundary scoring, and dangling word prevention."""

    def test_find_best_split_index_prefers_comma(self):
        grouper = SentenceGrouperService()
        profile = LanguageProfile.get_profile("en")
        snippets = [
            SubtitleSnippet(text="When the sun rises in the east, the birds start to sing loudly.", start=0.0, duration=10.0)
        ]
        tl = grouper.build_word_timeline(snippets, profile)
        best_idx = grouper.find_best_split_index(tl, profile, half_time=5.0)
        assert tl[best_idx]["word"] == "east,"

    def test_find_best_split_index_avoids_dangling_word(self):
        grouper = SentenceGrouperService()
        profile = LanguageProfile.get_profile("en")
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
        words = ["word" + str(i) for i in range(int(duration * 2.5))]
        snippets = [SubtitleSnippet(text=" ".join(words) + ".", start=0.0, duration=duration)]
        tl = grouper.build_word_timeline(snippets, profile)
        challenges = grouper.split_into_challenges(tl, profile)
        assert len(challenges) >= expected_min_parts
        for c in challenges:
            assert c.duration <= 8.01


# ==============================================================================
# SECTION 6: STEP 5 & END-TO-END MULTILINGUAL INTEGRATION
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
# SECTION 7: WORD COMPARATOR DOMAIN SERVICE TESTS
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
