"""Domain Services for Sentence Grouping and Word-by-Word Dictation Evaluation."""
import re
from typing import List, Optional
from app.domain.models import (
    Challenge,
    SubtitleSnippet,
    WordEvaluation,
    EvaluationStatus,
    EvaluationResult,
)


class TextNormalizer:
    """Helper to normalize text tokens, handling curly quotes and punctuation."""

    @staticmethod
    def normalize_quotes(text: str) -> str:
        """Replace typographical quotes/apostrophes with standard ASCII characters."""
        return (
            text.replace("’", "'")
            .replace("‘", "'")
            .replace("“", '"')
            .replace("”", '"')
            .replace("«", '"')
            .replace("»", '"')
            .replace("„", '"')
            .replace("…", "...")
            .replace("—", " - ")
            .replace("–", " - ")
        )

    @staticmethod
    def strip_punctuation(token: str) -> str:
        """Strip leading/trailing punctuation from a word token, keeping internal apostrophes/hyphens."""
        return re.sub(r"^[^\w']+|[^\w']+$", "", token)

    @staticmethod
    def clean_word(token: str) -> str:
        """Normalize and lowercase token for lenient comparison."""
        clean = TextNormalizer.normalize_quotes(token)
        clean = TextNormalizer.strip_punctuation(clean)
        return clean.strip().lower()


class WordComparatorService:
    """Domain service to compare user typed text with the target sentence word-by-word."""

    def evaluate(
        self,
        target: str,
        user_input: str,
        strict_punctuation: bool = False,
    ) -> EvaluationResult:
        normalized_target = TextNormalizer.normalize_quotes(target).strip()
        normalized_user = TextNormalizer.normalize_quotes(user_input).strip()

        target_tokens = normalized_target.split()
        user_tokens = normalized_user.split() if normalized_user else []

        evaluations: List[WordEvaluation] = []
        correct_count = 0
        total_target_words = len(target_tokens)

        max_len = max(len(target_tokens), len(user_tokens))

        for i in range(max_len):
            if i < len(target_tokens) and i < len(user_tokens):
                t_token = target_tokens[i]
                u_token = user_tokens[i]

                is_match = self._tokens_match(t_token, u_token, strict_punctuation)
                if is_match:
                    evaluations.append(
                        WordEvaluation(
                            target_word=t_token,
                            user_word=u_token,
                            status=EvaluationStatus.CORRECT,
                        )
                    )
                    correct_count += 1
                else:
                    evaluations.append(
                        WordEvaluation(
                            target_word=t_token,
                            user_word=u_token,
                            status=EvaluationStatus.INCORRECT,
                        )
                    )
            elif i < len(target_tokens):
                # User hasn't typed this target word yet
                evaluations.append(
                    WordEvaluation(
                        target_word=target_tokens[i],
                        user_word=None,
                        status=EvaluationStatus.MISSING,
                    )
                )
            else:
                # User typed extra words beyond target length
                evaluations.append(
                    WordEvaluation(
                        target_word="",
                        user_word=user_tokens[i],
                        status=EvaluationStatus.EXTRA,
                    )
                )

        accuracy = 0.0
        if total_target_words > 0:
            accuracy = round((correct_count / total_target_words) * 100.0, 1)

        is_completed = (
            correct_count == total_target_words
            and len(user_tokens) == total_target_words
        )

        message = "Chính xác 100%! Hãy đọc to câu này để luyện phát âm." if is_completed else ""

        return EvaluationResult(
            is_completed=is_completed,
            accuracy_percentage=accuracy,
            words=evaluations,
            correct_count=correct_count,
            total_words=total_target_words,
            feedback_message=message,
        )

    def _tokens_match(
        self, target: str, user: str, strict_punctuation: bool
    ) -> bool:
        if strict_punctuation:
            return target.strip() == user.strip()
        return TextNormalizer.clean_word(target) == TextNormalizer.clean_word(user)


class SentenceGrouperService:
    """Domain service to group raw subtitle snippets into coherent sentences for dictation."""

    def __init__(
        self,
        max_pause_seconds: float = 1.2,
        max_sentence_duration: float = 10.0,
        max_words_per_challenge: int = 20,
        min_sentence_duration: float = 1.2,
        min_words_per_challenge: int = 2,
        max_duration_seconds: float = 20.0,  # force-split any challenge longer than this
    ):
        self.max_pause_seconds = max_pause_seconds
        self.max_sentence_duration = max_sentence_duration
        self.max_words_per_challenge = max_words_per_challenge
        self.min_sentence_duration = min_sentence_duration
        self.min_words_per_challenge = min_words_per_challenge
        self.max_duration_seconds = max_duration_seconds

    @staticmethod
    def clean_credits(text: str) -> str:
        """Thoroughly remove TED / subtitle credits from Vietnamese translation."""
        if not text:
            return ""
        cleaned = re.sub(r"\[.*?\]|\(.*?\)", "", text).strip()
        starters = r"(?:Khi|Tôi|Chúng|Bạn|Hôm|Đó|Và|Năm|Trong|Một|Chào|Cảm|Nếu|Tại|Để|Mỗi|Có|Sau|Trước|Theo|Với|Là|Đây|Ở|[0-9]|\"|“)"
        cleaned = re.sub(
            rf"(?i)^.*?(?:reviewer|translator|subtitles?\s+by|phụ\s+đề\s+bởi|dịch\s+bởi|biên\s+dịch|hiệu\s+đính)[:\s].*?(?=\s+{starters})",
            "",
            cleaned,
        ).strip()
        cleaned = re.sub(
            rf"(?i)^.*?(?:reviewer|translator)[:\s].*?(?=\s+{starters})",
            "",
            cleaned,
        ).strip()
        if re.match(
            r"(?i)^(?:translator|reviewer|subtitles?\s+by|phụ\s+đề\s+bởi|dịch\s+bởi|biên\s+dịch|hiệu\s+đính)\b",
            cleaned,
        ):
            return ""
        return cleaned

    @staticmethod
    def _split_snippet_by_terminal_punctuation(item: SubtitleSnippet) -> List[SubtitleSnippet]:
        """Split a snippet only if it contains internal sentence boundary (. ! ? followed by space)."""
        text = item.text.strip()
        words = text.split()
        if len(words) <= 3 or not re.search(r'[.!?]["\']?\s+[A-Z0-9"\u201c]', text):
            return [item]

        sub_parts = []
        buf = []
        for w in words:
            buf.append(w)
            if re.search(r'[.!?]["\']?$', w) and len(buf) >= 2:
                sub_parts.append(" ".join(buf))
                buf = []
        if buf:
            if sub_parts:
                sub_parts[-1] += " " + " ".join(buf)
            else:
                sub_parts.append(" ".join(buf))

        tot_w = sum(max(1, len(p.split())) for p in sub_parts)
        sub_snippets = []
        cur_t = item.start
        for p in sub_parts:
            pw = max(1, len(p.split()))
            dur = max(0.4, item.duration * (pw / tot_w))
            sub_snippets.append(SubtitleSnippet(text=p, start=round(cur_t, 2), duration=round(dur, 2)))
            cur_t += dur

        return sub_snippets

    def group_into_challenges(
        self,
        snippets: List[SubtitleSnippet],
        translations: Optional[List[SubtitleSnippet]] = None,
    ) -> List[Challenge]:
        """Group raw subtitle snippets into dictation challenges.

        Algorithm:
          1. Clean & normalise snippets.
          2. Build a word-level timeline so sentence boundaries can be detected
             across snippet boundaries (YouTube cuts snippets at fixed intervals,
             not at sentence ends).
          3. Segment words into COMPLETE sentences:
             - ends when a word ends with terminal punctuation (.!?) and the
               sentence already has >= 3 words, OR
             - ends on a large inter-snippet pause (>= max_pause_seconds) even
               without terminal punctuation (speaker stopped talking).
          4. Turn each complete sentence into a challenge:
             - <= max_words  → one challenge, never split mid-sentence.
             - >  max_words  → split at commas/semicolons; fallback: hard-cut at
               max_words boundary.
          5. Attach translations via maximum-overlap assignment.
        """
        if not snippets:
            return []

        # ── Phase 1: Clean & normalise ───────────────────────────────────────
        cleaned: List[SubtitleSnippet] = []
        for i, item in enumerate(snippets):
            raw = TextNormalizer.normalize_quotes(item.text).replace("\n", " ").strip()
            # Remove bracketed/parenthesised annotations (e.g. [music], (applause))
            clean_text = re.sub(r"\[.*?\]|\(.*?\)", "", raw).strip()
            # Remove musical notation symbols (♪ ♩ ♫ ♬) — music-only snippets become empty
            clean_text = re.sub(r"[♪♩♫♬]", "", clean_text).strip()
            if not clean_text:
                continue
            s_start = item.start
            s_dur = item.duration
            if i + 1 < len(snippets):
                nxt = snippets[i + 1].start
                if nxt > s_start and (s_start + s_dur) > nxt:
                    s_dur = max(0.4, nxt - s_start)
            cleaned.append(SubtitleSnippet(text=clean_text, start=s_start, duration=s_dur))

        if not cleaned:
            return []

        # ── Phase 2: Build word timeline ─────────────────────────────────────
        # word_tl entries: word text, approximate start/end time,
        # which snippet it belongs to, whether it is the last word in its snippet,
        # and the gap (pause) after its snippet.
        word_tl: List[dict] = []
        for si, snip in enumerate(cleaned):
            words = snip.text.split()
            if not words:
                continue
            n = len(words)
            next_snip_start = cleaned[si + 1].start if si + 1 < len(cleaned) else None
            inter_pause = (
                max(0.0, next_snip_start - snip.end)
                if next_snip_start is not None
                else 999.0
            )
            for j, w in enumerate(words):
                w_s = snip.start + snip.duration * (j / n)
                w_e = snip.start + snip.duration * ((j + 1) / n)
                is_last_in_snip = j == n - 1
                word_tl.append({
                    "word": w,
                    "start": w_s,
                    "end": w_e,
                    "is_last_in_snip": is_last_in_snip,
                    # pause to next snippet is only meaningful on the last word of a snippet
                    "inter_pause": inter_pause if is_last_in_snip else 0.0,
                })

        # ── Phase 3: Segment into complete sentences ──────────────────────────
        sentences: List[List[dict]] = []
        cur_sent: List[dict] = []

        for i, wd in enumerate(word_tl):
            cur_sent.append(wd)
            n_cur = len(cur_sent)
            is_last_word = i == len(word_tl) - 1

            ends_terminal = bool(re.search(r'[.!?]["\u2019\u201d\'"]?$', wd["word"]))
            big_pause = wd["inter_pause"] > self.max_pause_seconds

            if is_last_word:
                sentences.append(cur_sent)
                cur_sent = []
            elif ends_terminal and n_cur >= 3:
                # Complete sentence found
                sentences.append(cur_sent)
                cur_sent = []
            elif big_pause and n_cur >= 2:
                # Speaker paused long enough — treat as sentence boundary even
                # without terminal punctuation (e.g. mid-sentence in audio)
                sentences.append(cur_sent)
                cur_sent = []

        if cur_sent:
            sentences.append(cur_sent)

        # ── Phase 3.5: Merge short consecutive sentences ──────────────────────
        # A short complete sentence (< 10 words) can be merged with the next if:
        #   - combined word count stays <= max_words (20)
        #   - pause between the last word of current and first word of next is small
        merged: List[List[dict]] = []
        buf: List[dict] = list(sentences[0]) if sentences else []

        for s_list in sentences[1:]:
            buf_n = len(buf)
            s_n = len(s_list)
            # Pause = gap between last word of buf and first word of next sentence
            pause = s_list[0]["start"] - buf[-1]["end"] if buf else 0.0
            can_merge = (
                buf_n < 10
                and pause <= self.max_pause_seconds
                and buf_n + s_n <= self.max_words_per_challenge
            )
            if can_merge:
                buf.extend(s_list)
            else:
                merged.append(buf)
                buf = list(s_list)

        if buf:
            merged.append(buf)

        sentences = merged

        # ── Phase 4: Build challenges ─────────────────────────────────────────
        challenges: List[Challenge] = []

        def commit_words(wds: List[dict]) -> None:
            if not wds:
                return
            # Force-split at comma if duration exceeds max_duration_seconds
            duration = wds[-1]["end"] - wds[0]["start"]
            if duration > self.max_duration_seconds and len(wds) > 1:
                comma_splits = [
                    i for i, w in enumerate(wds[:-1]) if w["word"].endswith(",")
                ]
                if comma_splits:
                    mid = len(wds) // 2
                    best = min(comma_splits, key=lambda i: abs(i - mid))
                    commit_words(wds[: best + 1])
                    commit_words(wds[best + 1 :])
                    return
                # No comma — split at time midpoint
                half_time = wds[0]["start"] + duration / 2
                pivot = max(1, next(
                    (i for i, w in enumerate(wds) if w["start"] >= half_time),
                    len(wds) // 2,
                ))
                commit_words(wds[:pivot])
                commit_words(wds[pivot:])
                return
            txt = re.sub(r"\s+", " ", " ".join(w["word"] for w in wds)).strip()
            if not txt:
                return
            pos = len(challenges) + 1
            challenges.append(Challenge(
                id=pos,
                position=pos,
                text=txt,
                time_start=round(wds[0]["start"], 2),
                time_end=round(wds[-1]["end"], 2),
                translation=None,
            ))

        for sent in sentences:
            # Every complete sentence → one challenge, always kept whole.
            # Real speech sentences are naturally bounded; no need to hard-cut.
            commit_words(sent)

        # ── Phase 5: Attach translations ─────────────────────────────────────
        if translations and challenges:
            cleaned_translations: List[SubtitleSnippet] = []
            for t in translations:
                raw_lines = t.text.split("\n")
                good_lines = [self.clean_credits(ln) for ln in raw_lines if self.clean_credits(ln)]
                if good_lines:
                    cleaned_translations.append(
                        SubtitleSnippet(text=" ".join(good_lines), start=t.start, duration=t.duration)
                    )

            # Assign each translation snippet to the challenge with max time overlap
            challenge_trans_map: dict = {c.id: [] for c in challenges}
            for t in cleaned_translations:
                best_c, best_overlap = None, 0.0
                for c in challenges:
                    overlap = min(c.time_end, t.end) - max(c.time_start, t.start)
                    if overlap > best_overlap:
                        best_overlap = overlap
                        best_c = c
                if best_c and best_overlap > 0:
                    challenge_trans_map[best_c.id].append(t.text)

            for c in challenges:
                t_texts = challenge_trans_map.get(c.id, [])
                if t_texts:
                    combined = re.sub(r"\s+", " ", " ".join(t_texts)).strip()
                    c.translation = self.clean_credits(combined) if combined else None
                else:
                    c.translation = None

        return challenges

    def _commit_challenge(
        self,
        challenges: List[Challenge],
        texts: List[str],
        start: Optional[float],
        end: Optional[float],
    ) -> None:
        if start is None or end is None or not texts:
            return

        combined_text = " ".join(texts).strip()
        combined_text = re.sub(r"\s+", " ", combined_text)
        if not combined_text:
            return

        pos = len(challenges) + 1

        challenges.append(
            Challenge(
                id=pos,
                position=pos,
                text=combined_text,
                time_start=round(start, 2),
                time_end=round(end, 2),
                translation=None,
            )
        )
