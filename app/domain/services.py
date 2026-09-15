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
    ):
        self.max_pause_seconds = max_pause_seconds
        self.max_sentence_duration = max_sentence_duration
        self.max_words_per_challenge = max_words_per_challenge
        self.min_sentence_duration = min_sentence_duration
        self.min_words_per_challenge = min_words_per_challenge

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
        if not snippets:
            return []

        # 1. Clean annotations and normalize overlapping durations
        cleaned_snippets: List[SubtitleSnippet] = []
        for i, item in enumerate(snippets):
            raw = TextNormalizer.normalize_quotes(item.text).replace("\n", " ").strip()
            clean_text = re.sub(r"\[.*?\]|\(.*?\)", "", raw).strip()
            if not clean_text:
                continue

            s_start = item.start
            s_duration = item.duration

            if i + 1 < len(snippets):
                next_start = snippets[i + 1].start
                if next_start > s_start and (s_start + s_duration) > next_start:
                    s_duration = max(0.4, next_start - s_start)

            sub_items = self._split_snippet_by_terminal_punctuation(
                SubtitleSnippet(text=clean_text, start=s_start, duration=s_duration)
            )
            cleaned_snippets.extend(sub_items)

        if not cleaned_snippets:
            return []

        # 2. Group snippets into natural complete sentences (ended by . ! ? or significant pause)
        sentences: List[List[SubtitleSnippet]] = []
        current_sentence: List[SubtitleSnippet] = []

        for i, s in enumerate(cleaned_snippets):
            current_sentence.append(s)
            ends_terminal = bool(re.search(r'[.!?]["\']?$', s.text))
            has_next = i + 1 < len(cleaned_snippets)
            next_pause = (cleaned_snippets[i + 1].start - s.end) if has_next else 999.0

            curr_words = sum(len(x.text.split()) for x in current_sentence)
            is_micro = curr_words < 2 and has_next and next_pause <= 0.8

            if (ends_terminal and not is_micro) or next_pause > self.max_pause_seconds or not has_next:
                sentences.append(current_sentence)
                current_sentence = []

        if current_sentence:
            sentences.append(current_sentence)

        # 3. Merge consecutive short sentences into coherent chunks (<= 20 words) to avoid fragmented sentences
        merged_sentences: List[List[SubtitleSnippet]] = []
        buf_sent: List[SubtitleSnippet] = []

        for s_list in sentences:
            if not buf_sent:
                buf_sent = list(s_list)
                continue

            buf_words = sum(len(x.text.split()) for x in buf_sent)
            s_words = sum(len(x.text.split()) for x in s_list)
            pause = s_list[0].start - buf_sent[-1].end

            # Merge if previous sentence is short (< 10 words), pause is natural (<= 1.2s),
            # and combined word count does not exceed max_words (20 words)
            can_merge = (
                buf_words < 10
                and pause <= 1.2
                and (buf_words + s_words <= self.max_words_per_challenge)
            )

            if can_merge:
                buf_sent.extend(s_list)
            else:
                merged_sentences.append(buf_sent)
                buf_sent = list(s_list)

        if buf_sent:
            merged_sentences.append(buf_sent)

        # 4. For each natural sentence:
        # - If total words <= max_words (20): keep 100% COMPLETE (DO NOT split at comma!)
        # - If total words > max_words (20): split into chunks <= 20 words prioritizing commas
        challenges: List[Challenge] = []

        def commit_chunk(chunk_snips: List[SubtitleSnippet]) -> None:
            if not chunk_snips:
                return
            txt = " ".join(x.text for x in chunk_snips).strip()
            txt = re.sub(r"\s+", " ", txt)
            if not txt:
                return
            st = chunk_snips[0].start
            en = chunk_snips[-1].end
            pos = len(challenges) + 1
            challenges.append(
                Challenge(
                    id=pos,
                    position=pos,
                    text=txt,
                    time_start=round(st, 2),
                    time_end=round(en, 2),
                    translation=None,
                )
            )

        for sent_snips in merged_sentences:
            sent_words = sum(len(x.text.split()) for x in sent_snips)
            # A complete sentence <= 20 words is NEVER split
            if sent_words <= self.max_words_per_challenge:
                commit_chunk(sent_snips)
            else:
                # Sentence > 20 words: intelligently partition at commas / sub-snippets <= 20 words
                chunk: List[SubtitleSnippet] = []
                for j, s in enumerate(sent_snips):
                    words_count = len(s.text.split())
                    chunk_words = sum(len(x.text.split()) for x in chunk)

                    # If this individual snippet itself has > 20 words, split text at last comma or space <= 20 words
                    if words_count > self.max_words_per_challenge:
                        if chunk:
                            commit_chunk(chunk)
                            chunk = []
                        s_tokens = s.text.split()
                        s_parts = []
                        buf = []
                        for tok in s_tokens:
                            buf.append(tok)
                            if len(buf) >= self.max_words_per_challenge or (len(buf) >= 10 and re.search(r'[,;:]["\']?$', tok)):
                                s_parts.append(" ".join(buf))
                                buf = []
                        if buf:
                            if s_parts and len(buf) < 3 and len(s_parts[-1].split()) + len(buf) <= self.max_words_per_challenge:
                                s_parts[-1] += " " + " ".join(buf)
                            else:
                                s_parts.append(" ".join(buf))

                        tot_sw = sum(len(p.split()) for p in s_parts)
                        c_t = s.start
                        for p in s_parts:
                            p_len = len(p.split())
                            p_d = max(0.4, s.duration * (p_len / tot_sw))
                            commit_chunk([SubtitleSnippet(text=p, start=round(c_t, 2), duration=round(p_d, 2))])
                            c_t += p_d
                        continue

                    if chunk and (chunk_words + words_count > self.max_words_per_challenge):
                        commit_chunk(chunk)
                        chunk = [s]
                    else:
                        chunk.append(s)
                        chunk_words += words_count
                        ends_comma = bool(re.search(r'[,;:]["\']?$', s.text))
                        rem_words = sum(len(x.text.split()) for x in sent_snips[j + 1:])
                        # Split at comma if chunk has reached solid length (>= 8 words) and remaining is also solid (>= 3 words)
                        if ends_comma and chunk_words >= 8 and rem_words >= 3:
                            commit_chunk(chunk)
                            chunk = []

                if chunk:
                    commit_chunk(chunk)

        # Clean and attach translations without credits and without cross-challenge duplication
        if translations and challenges:
            cleaned_translations: List[SubtitleSnippet] = []
            for t in translations:
                raw_lines = t.text.split("\n")
                good_lines = []
                for line in raw_lines:
                    cleaned_line = self.clean_credits(line)
                    if cleaned_line:
                        good_lines.append(cleaned_line)
                if good_lines:
                    cleaned_translations.append(
                        SubtitleSnippet(
                            text=" ".join(good_lines), start=t.start, duration=t.duration
                        )
                    )

            # Assign each translation snippet exclusively to the challenge with maximum time overlap
            challenge_trans_map = {c.id: [] for c in challenges}
            for t in cleaned_translations:
                best_c = None
                best_overlap = 0.0
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
                    clean_combined = re.sub(r"\s+", " ", " ".join(t_texts)).strip()
                    c.translation = self.clean_credits(clean_combined) if clean_combined else None
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
