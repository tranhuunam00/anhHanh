"""Unit tests for SubtitleOffsetDetector and sentence split refinements.

Covers:
1. SubtitleOffsetDetector (audio offset detection, normalization, applying offset).
2. SentenceGrouperService split refinements (preventing 1-2 word orphan fragments like 'In addition,').
"""
import pytest
from app.domain.models import SubtitleSnippet
from app.domain.subtitle_offset_detector import SubtitleOffsetDetector
from app.domain.sentence_grouper import SentenceGrouperService
from app.domain.language_profile import LanguageProfile


class TestSubtitleOffsetDetector:
    """Test suite for SubtitleOffsetDetector service."""

    def test_calculate_offset_ted_intro_desync(self):
        """Verify that a 12-second TED intro desync between manual and auto captions is accurately detected."""
        manual = [
            SubtitleSnippet(text="Thank you very much.", start=0.83, duration=1.5),
            SubtitleSnippet(text="Well, I would like to start with testicles.", start=2.37, duration=4.0),
            SubtitleSnippet(text="Men who sleep five hours a night", start=9.20, duration=2.75),
            SubtitleSnippet(text="have significantly smaller testicles", start=11.95, duration=5.25),
        ]
        auto = [
            SubtitleSnippet(text="Thank you very much.", start=12.84, duration=4.4),
            SubtitleSnippet(text="Um well, I would like to start with testicles.", start=14.40, duration=5.8),
            SubtitleSnippet(text="Men who sleep 5 hours a night have", start=21.20, duration=5.5),
            SubtitleSnippet(text="significantly smaller testicles than those", start=24.24, duration=6.8),
        ]

        offset = SubtitleOffsetDetector.calculate_offset(manual, auto)
        assert 11.8 <= offset <= 12.2

        shifted = SubtitleOffsetDetector.apply_offset(manual, offset)
        assert 12.7 <= shifted[0].start <= 13.0
        assert 14.2 <= shifted[1].start <= 14.6
        assert 21.0 <= shifted[2].start <= 21.4

    def test_calculate_offset_in_sync_returns_zero(self):
        """Verify that properly synced subtitles with micro jitter (< 1.5s) return 0.0."""
        manual = [
            SubtitleSnippet(text="Welcome everyone to our presentation today.", start=1.5, duration=3.0),
            SubtitleSnippet(text="We are going to explore deep learning concepts.", start=4.8, duration=3.5),
        ]
        auto = [
            SubtitleSnippet(text="Welcome everyone to our presentation today", start=1.6, duration=3.1),
            SubtitleSnippet(text="we are going to explore deep learning concepts", start=4.9, duration=3.6),
        ]
        offset = SubtitleOffsetDetector.calculate_offset(manual, auto)
        assert offset == 0.0

    def test_calculate_offset_empty_and_none(self):
        """Verify null-safety and empty inputs."""
        assert SubtitleOffsetDetector.calculate_offset([], []) == 0.0
        assert SubtitleOffsetDetector.calculate_offset(None, None) == 0.0
        assert SubtitleOffsetDetector.calculate_offset([SubtitleSnippet(text="", start=0.0, duration=1.0)], []) == 0.0

    def test_calculate_offset_no_matching_text(self):
        """Verify behavior when manual and auto text completely differ."""
        manual = [
            SubtitleSnippet(text="The quick brown fox jumps over the lazy dog.", start=1.0, duration=4.0),
        ]
        auto = [
            SubtitleSnippet(text="Completely different dialogue about space exploration.", start=15.0, duration=4.0),
        ]
        offset = SubtitleOffsetDetector.calculate_offset(manual, auto)
        assert offset == 0.0

    def test_apply_offset_bounds_and_clamping(self):
        """Verify offset application clamps negative starts to 0.0."""
        snippets = [
            SubtitleSnippet(text="Intro part", start=2.0, duration=2.0),
            SubtitleSnippet(text="Main part", start=10.0, duration=3.0),
        ]
        # Negative offset (video started later, subtitle was late)
        shifted = SubtitleOffsetDetector.apply_offset(snippets, -5.0)
        assert shifted[0].start == 0.0  # max(0.0, 2.0 - 5.0)
        assert shifted[1].start == 5.0

        # Zero offset returns original or identical
        assert SubtitleOffsetDetector.apply_offset(snippets, 0.0) == snippets

    def test_normalize_text_cleanups(self):
        """Verify normalize_text strips brackets, punctuation and collapses whitespace."""
        raw = "  [Applause]  Thank you,   VERY much! (Laughter)...  "
        clean = SubtitleOffsetDetector.normalize_text(raw)
        assert clean == "thank you very much"


class TestSentenceGrouperSplitRefinements:
    """Test suite for refined sentence splitting avoiding 1-2 word orphan fragments."""

    def test_find_best_split_avoids_in_addition_comma_orphan(self):
        """Ensure 'In addition,' at the start of an overlong sentence is NOT split off."""
        grouper = SentenceGrouperService(max_duration_seconds=8.0)
        profile = LanguageProfile.get_profile("en")

        sentence = (
            "In addition, men who routinely sleep just four to five hours a night "
            "will have a level of testosterone which is that of someone 10 years their senior."
        )
        words = sentence.split()
        wds = []
        cur_t = 20.08
        for w in words:
            wds.append({
                "word": w,
                "start": cur_t,
                "end": cur_t + 0.4,
                "inter_pause": 0.0,
                "is_speaker_change": False,
                "is_last_in_snip": False,
            })
            cur_t += 0.4

        half_time = 20.08 + (cur_t - 20.08) / 2
        split_idx = grouper.find_best_split_index(wds, profile, half_time)

        # split_idx must NOT be 1 ('addition,')
        assert split_idx > 1
        left_words = [w["word"] for w in wds[: split_idx + 1]]
        right_words = [w["word"] for w in wds[split_idx + 1 :]]

        # Left must have at least 3 words, right must have at least 3 words
        assert len(left_words) >= 3
        assert len(right_words) >= 3
        # In this specific sentence, it splits at 'which' (index of 'testosterone' is 18)
        assert "which" in right_words[0] or "testosterone" in left_words[-1]

    def test_find_best_split_valid_mid_sentence_comma(self):
        """Ensure commas that leave sufficient words on both sides are still valid split points."""
        grouper = SentenceGrouperService(max_duration_seconds=8.0)
        profile = LanguageProfile.get_profile("en")

        sentence = (
            "When sleep is consistently disrupted, the human immune system weakens rapidly and severely."
        )
        words = sentence.split()
        wds = []
        cur_t = 0.0
        for w in words:
            wds.append({
                "word": w,
                "start": cur_t,
                "end": cur_t + 0.7,
                "inter_pause": 0.0,
                "is_speaker_change": False,
                "is_last_in_snip": False,
            })
            cur_t += 0.7

        half_time = (cur_t) / 2
        split_idx = grouper.find_best_split_index(wds, profile, half_time)

        # Word at split_idx should be 'disrupted,' (index 4)
        assert wds[split_idx]["word"] == "disrupted,"
        assert len(wds[: split_idx + 1]) >= 3
        assert len(wds[split_idx + 1 :]) >= 3
