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


DANGLING_WORDS_BY_LANG = {
    "fr": {
        # Pronouns & subject elisions
        "je", "j'", "tu", "il", "elle", "on", "nous", "vous", "ils", "elles",
        "j'ai", "j'étais", "j'avais", "c'est", "ce", "cet", "cette", "ces", "qu'il", "qu'elle", "qu'on", "d'un", "d'une",
        # Articles & determiners
        "le", "la", "les", "l'", "un", "une", "des", "du", "de", "d'", "au", "aux",
        "mon", "ton", "son", "ma", "ta", "sa", "mes", "tes", "ses", "notre", "votre", "leur", "leurs",
        # Prepositions
        "à", "en", "pour", "dans", "sur", "sous", "avec", "sans", "par", "vers", "chez", "après", "avant", "entre",
        # Conjunctions & connectors
        "et", "mais", "ou", "donc", "or", "ni", "car", "alors", "parce", "que", "qu'", "qui", "dont", "où", "si", "comme", "quand", "lorsque", "puisque"
    },
    "en": {
        # Pronouns
        "i", "you", "he", "she", "it", "we", "they", "i'm", "i've", "i'll", "i'd", "it's", "there's", "that's",
        # Articles & determiners
        "the", "a", "an", "this", "that", "these", "those", "my", "your", "his", "her", "its", "our", "their",
        # Prepositions
        "to", "for", "with", "in", "on", "at", "by", "from", "of", "about", "into", "through", "during", "before", "after", "between",
        # Conjunctions & connectors
        "and", "but", "or", "so", "because", "although", "while", "when", "if", "which", "that", "who", "whom", "whose", "where", "then", "as"
    },
    "de": {
        "ich", "du", "er", "sie", "es", "wir", "ihr", "der", "die", "das", "ein", "eine", "einen", "einem", "einer", "eines", "dem", "den",
        "und", "aber", "oder", "denn", "weil", "dass", "wenn", "als", "mit", "zu", "in", "von", "auf", "für", "bei", "nach"
    },
    "es": {
        "yo", "tú", "él", "ella", "nosotros", "vosotros", "ellos", "ellas", "el", "la", "los", "las", "un", "una", "unos", "unas",
        "mi", "tu", "su", "nuestro", "vuestro", "y", "pero", "o", "porque", "que", "si", "como", "cuando", "de", "a", "en", "con", "por", "para"
    },
    "vi": {
        "và", "nhưng", "hoặc", "vì", "nên", "nếu", "khi", "mà", "để", "với", "của", "tại", "trong", "cho", "tôi", "bạn", "chúng", "anh", "chị", "em", "là"
    },
}


class SentenceGrouperService:
    """Domain service to group raw subtitle snippets into coherent sentences for dictation."""

    def __init__(
        self,
        max_pause_seconds: float = 1,
        max_sentence_duration: float = 8.0,
        max_words_per_challenge: int = 25,
        min_sentence_duration: float = 1.0,
        min_words_per_challenge: int = 2,
        max_duration_seconds: float = 8.0,
    ):
        self.max_pause_seconds = max_pause_seconds
        self.max_sentence_duration = max_sentence_duration
        self.max_words_per_challenge = max_words_per_challenge
        self.min_sentence_duration = min_sentence_duration
        self.min_words_per_challenge = min_words_per_challenge
        self.max_duration_seconds = max_duration_seconds

    @staticmethod
    def is_dangling_word(word: str, lang: str = "en") -> bool:
        """Check if a word is an open-ended/dangling connector or pronoun that should not end a sentence."""
        if not word:
            return False
        clean = TextNormalizer.clean_word(word)
        lang_code = (lang or "en").split("-")[0].lower()
        lang_set = DANGLING_WORDS_BY_LANG.get(lang_code)
        if lang_set and clean in lang_set:
            return True
        for s in DANGLING_WORDS_BY_LANG.values():
            if clean in s:
                return True
        return False

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
        lang: str = "en",
    ) -> List[Challenge]:
        """Group raw subtitle snippets into dictation challenges with a strict 8.0s maximum limit.

        Algorithm:
          1. Clean & normalise snippets.
          2. Build a word-level timeline with timing and inter-snippet pauses.
          3. Segment words into complete phrases/sentences (ends on .!?, big pause >= 1s,
             or max duration threshold 8.0s without trailing dangling words).
          4. Turn each phrase into challenges <= 8.0s by splitting intelligently at
             clause punctuation, audio pauses, or midpoints without cutting dangling words.
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
                    "inter_pause": inter_pause if is_last_in_snip else 0.0,
                })

        # ── Phase 3: Segment into sentences ──────────────────────────────────
        sentences: List[List[dict]] = []
        cur_sent: List[dict] = []

        for i, wd in enumerate(word_tl):
            cur_sent.append(wd)
            n_cur = len(cur_sent)
            cur_dur = cur_sent[-1]["end"] - cur_sent[0]["start"]
            is_last_word = i == len(word_tl) - 1

            ends_terminal = bool(re.search(r'[.!?…]["\u2019\u201d\'»"]?$', wd["word"]))
            big_pause = wd["inter_pause"] >= self.max_pause_seconds

            if is_last_word:
                sentences.append(cur_sent)
                cur_sent = []
            elif ends_terminal and n_cur >= self.min_words_per_challenge:
                sentences.append(cur_sent)
                cur_sent = []
            elif big_pause and n_cur >= self.min_words_per_challenge:
                sentences.append(cur_sent)
                cur_sent = []
            elif cur_dur >= self.max_sentence_duration:
                # Trim trailing dangling words so sentence doesn't end on an open-ended token
                popped = []
                while len(cur_sent) > 2 and self.is_dangling_word(cur_sent[-1]["word"], lang):
                    popped.insert(0, cur_sent.pop())
                sentences.append(cur_sent)
                cur_sent = list(popped)

        if cur_sent:
            sentences.append(cur_sent)

        # ── Phase 3.5: Merge short consecutive fragments ─────────────────────
        merged: List[List[dict]] = []
        buf: List[dict] = list(sentences[0]) if sentences else []

        for s_list in sentences[1:]:
            buf_n = len(buf)
            buf_dur = buf[-1]["end"] - buf[0]["start"] if buf else 0.0
            s_dur = s_list[-1]["end"] - s_list[0]["start"] if s_list else 0.0
            pause = s_list[0]["start"] - buf[-1]["end"] if buf else 0.0
            
            can_merge = (
                buf_n < 5
                and pause <= 0.4
                and (buf_dur + pause + s_dur) <= self.max_sentence_duration
            )
            if can_merge:
                buf.extend(s_list)
            else:
                merged.append(buf)
                buf = list(s_list)

        if buf:
            merged.append(buf)

        sentences = merged

        # ── Phase 4: Build challenges (Strictly <= 8.0s) ──────────────────────
        challenges: List[Challenge] = []

        def commit_words(wds: List[dict]) -> None:
            if not wds:
                return
            duration = wds[-1]["end"] - wds[0]["start"]
            if duration > self.max_duration_seconds and len(wds) > 1:
                half_time = wds[0]["start"] + duration / 2

                # 1. Punctuation / clause splits (, ; : — –) near half_time
                clause_splits = [
                    idx for idx, w in enumerate(wds[:-1])
                    if re.search(r'[,;:\-—–]["\u2019\u201d\'»"]?$', w["word"]) or w["word"] in [",", ";", ":", "—", "–"]
                ]
                if clause_splits:
                    best_idx = min(clause_splits, key=lambda idx: abs(wds[idx]["start"] - half_time))
                    commit_words(wds[: best_idx + 1])
                    commit_words(wds[best_idx + 1 :])
                    return

                # 2. Micro-pause splits near half_time (avoid dangling word at split)
                pauses = [
                    (idx, w["inter_pause"]) for idx, w in enumerate(wds[:-1])
                    if w.get("inter_pause", 0) > 0.15
                ]
                if pauses:
                    best_idx = min(pauses, key=lambda x: abs(wds[x[0]]["start"] - half_time))[0]
                    while best_idx > 1 and self.is_dangling_word(wds[best_idx]["word"], lang):
                        best_idx -= 1
                    commit_words(wds[: best_idx + 1])
                    commit_words(wds[best_idx + 1 :])
                    return

                # 3. Fallback midpoint by time (avoid dangling word at split)
                pivot = max(1, min(len(wds) - 1, next(
                    (idx for idx, w in enumerate(wds) if w["start"] >= half_time),
                    len(wds) // 2,
                )))
                while pivot > 1 and self.is_dangling_word(wds[pivot - 1]["word"], lang):
                    pivot -= 1
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
