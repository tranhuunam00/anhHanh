"""Domain service to detect systematic timestamp offsets between manual and auto-generated subtitles.

When videos have intro bumpers added or trimmed cuts (common with TED talks),
manual subtitles can drift or start too early compared to the video audio.
YouTube auto-generated subtitles are synthesized directly from video audio,
providing the ground-truth audio timeline to resynchronize manual captions.
"""
import re
import logging
from typing import List, Optional
from app.domain.models import SubtitleSnippet

logger = logging.getLogger(__name__)


class SubtitleOffsetDetector:
    """Detects and compensates for systematic time offsets in subtitle tracks."""

    MIN_WORDS_FOR_MATCH: int = 2
    MIN_OVERLAP_SCORE: float = 0.35
    MIN_OFFSET_THRESHOLD: float = 1.5  # Only apply shift if |offset| >= 1.5s
    MAX_SEARCH_SNIPPETS: int = 20

    @staticmethod
    def normalize_text(text: str) -> str:
        """Strip punctuation, annotations, lowercase, and collapse whitespace."""
        if not text:
            return ""
        clean = re.sub(r"\[.*?\]|\(.*?\)", "", text)
        clean = re.sub(r"[^a-zA-Z0-9\s]", " ", clean.lower())
        return re.sub(r"\s+", " ", clean).strip()

    @classmethod
    def calculate_offset(
        cls,
        manual_snippets: List[SubtitleSnippet],
        auto_snippets: List[SubtitleSnippet],
        threshold: float = MIN_OFFSET_THRESHOLD,
    ) -> float:
        """Calculate time difference: audio_start - manual_start.

        Returns offset in seconds if |offset| >= threshold, else 0.0.
        Positive offset means manual subtitles start too early (ahead of video).
        """
        if not manual_snippets or not auto_snippets:
            return 0.0

        m_list = [
            s for s in manual_snippets[: cls.MAX_SEARCH_SNIPPETS]
            if cls.normalize_text(s.text)
        ]
        a_list = [
            s for s in auto_snippets[: cls.MAX_SEARCH_SNIPPETS * 2]
            if cls.normalize_text(s.text)
        ]

        if not m_list or not a_list:
            return 0.0

        diffs: List[float] = []

        for m in m_list:
            m_words = cls.normalize_text(m.text).split()
            if len(m_words) < cls.MIN_WORDS_FOR_MATCH:
                continue
            m_set = set(m_words)

            best_match_diff: Optional[float] = None
            best_match_score = 0.0

            for a in a_list:
                a_words = cls.normalize_text(a.text).split()
                if not a_words:
                    continue
                a_set = set(a_words)

                common = m_set & a_set
                if len(common) < cls.MIN_WORDS_FOR_MATCH:
                    continue

                score = len(common) / min(len(m_set), len(a_set))
                if score >= cls.MIN_OVERLAP_SCORE and score > best_match_score:
                    diff = a.start - m.start
                    if -60.0 <= diff <= 120.0:
                        best_match_score = score
                        best_match_diff = diff

            if best_match_diff is not None:
                diffs.append(best_match_diff)

        if not diffs:
            return 0.0

        diffs.sort()
        median_diff = diffs[len(diffs) // 2]

        consistent_matches = [d for d in diffs if abs(d - median_diff) <= 1.5]
        if len(consistent_matches) >= 1 and abs(median_diff) >= threshold:
            logger.info(
                f"Detected systematic subtitle audio offset of {median_diff:+.2f}s "
                f"(matched {len(consistent_matches)} snippets)."
            )
            return round(median_diff, 2)

        return 0.0

    @classmethod
    def apply_offset(
        cls,
        snippets: List[SubtitleSnippet],
        offset: float,
    ) -> List[SubtitleSnippet]:
        """Apply timestamp offset to a list of snippets, clamping start >= 0.0."""
        if not snippets or abs(offset) < 0.05:
            return snippets

        shifted = []
        for s in snippets:
            new_start = max(0.0, round(s.start + offset, 2))
            shifted.append(SubtitleSnippet(text=s.text, start=new_start, duration=s.duration))
        return shifted
