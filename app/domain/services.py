"""Domain Services for Sentence Grouping and Word-by-Word Dictation Evaluation."""
import re
import logging
from typing import List, Optional, Tuple, Set, Dict

logger = logging.getLogger(__name__)

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


class LanguageProfile:
    """Domain Value Object holding language-specific syntax rules, abbreviations, and protected phrases."""

    def __init__(
        self,
        code: str,
        abbreviations: set,
        dangling_words: set,
        connectors: set,
        protected_phrases: list,
    ):
        self.code = (code or "en").split("-")[0].lower()
        self.abbreviations = {w.lower() for w in abbreviations}
        self.dangling_words = {w.lower() for w in dangling_words}
        self.connectors = {w.lower() for w in connectors}
        # Store protected phrases as tuples of normalized words
        self.protected_phrases = [
            tuple(TextNormalizer.clean_word(tok) for tok in phrase.split())
            for phrase in protected_phrases
            if phrase.strip()
        ]

    def is_abbreviation(self, token: str) -> bool:
        """Check if a token with trailing dot is a recognized abbreviation (e.g. Dr., Mr., U.S., Ph.D.)."""
        norm = token.strip().rstrip(",;:—–").lower()
        if norm in self.abbreviations:
            return True
        # Regex for multi-letter acronyms like U.S. or e.g. or Ph.D.
        if re.fullmatch(r"(?:[a-zA-Z]+\.){2,}", norm):
            return True
        return False

    def is_dangling_end(self, token: str) -> bool:
        """Check if a word is an article, preposition, or determiner that cannot end a sentence."""
        clean = TextNormalizer.clean_word(token)
        return clean in self.dangling_words

    def is_connector(self, token: str) -> bool:
        """Check if a word is a natural clause connector / conjunction."""
        clean = TextNormalizer.clean_word(token)
        return clean in self.connectors

    def is_inside_protected_phrase(self, clean_words: List[str], split_idx: int) -> bool:
        """Check if splitting after clean_words[split_idx] breaks inside any protected multi-word phrase."""
        if not self.protected_phrases or split_idx < 0 or split_idx >= len(clean_words) - 1:
            return False

        for phrase in self.protected_phrases:
            p_len = len(phrase)
            if p_len < 2:
                continue
            # A split index is strictly inside the phrase if st <= split_idx < st + p_len - 1
            start_min = max(0, split_idx - p_len + 2)
            start_max = min(split_idx, len(clean_words) - p_len)
            for st in range(start_min, start_max + 1):
                if tuple(clean_words[st : st + p_len]) == phrase and st <= split_idx < st + p_len - 1:
                    return True
        return False

    @classmethod
    def get_profile(cls, lang_code: Optional[str] = "en") -> "LanguageProfile":
        """Factory method to get the LanguageProfile for a given language code."""
        code = (lang_code or "en").split("-")[0].lower()

        PROFILES = {
            "en": {
                "abbreviations": {
                    "dr.", "mr.", "mrs.", "ms.", "prof.", "sr.", "jr.", "st.",
                    "u.s.", "u.k.", "e.g.", "i.e.", "vs.", "etc.", "approx.",
                    "inc.", "ltd.", "co.", "corp.", "dept.", "est.", "fig.", "al."
                },
                "dangling_words": {
                    "the", "a", "an", "this", "that", "these", "those",
                    "my", "your", "his", "her", "its", "our", "their",
                    "in", "on", "at", "to", "for", "with", "of", "from",
                    "by", "into", "through", "during", "before", "after",
                    "above", "below", "between", "under", "about", "against",
                    "is", "are", "was", "were", "be", "been", "being",
                    "have", "has", "had", "will", "would", "can", "could", "should"
                },
                "connectors": {
                    "and", "but", "so", "because", "although", "when", "if",
                    "which", "that", "who", "whom", "whose", "where", "then",
                    "while", "since", "unless", "whereas", "however", "therefore"
                },
                "protected_phrases": [
                    "european union", "united states", "united kingdom",
                    "artificial intelligence", "social media", "climate change",
                    "high school", "real estate", "data center", "machine learning",
                    "deep learning", "silicon valley", "white house", "world war"
                ],
            },
            "fr": {
                "abbreviations": {
                    "m.", "mme.", "mlle.", "dr.", "prof.", "etc.", "st.", "ste.",
                    "av.", "bd.", "env.", "hab.", "p.ex.", "c.-à-d."
                },
                "dangling_words": {
                    "le", "la", "les", "l'", "un", "une", "des", "du", "de", "d'",
                    "ce", "cet", "cette", "ces", "mon", "ton", "son", "ma", "ta", "sa",
                    "mes", "tes", "ses", "notre", "votre", "leur", "nos", "vos", "leurs",
                    "dans", "sur", "sous", "pour", "avec", "par", "en", "chez", "vers",
                    "entre", "sans", "comme", "est", "sont", "était", "étaient",
                    "ont", "avoir", "être", "faire", "plus", "moins", "très"
                },
                "connectors": {
                    "alors", "mais", "car", "donc", "parce", "puisque", "quand",
                    "lorsque", "qui", "que", "qu'", "dont", "où", "comme", "après",
                    "avant", "pour", "si", "et", "ou", "ni", "cependant", "pourtant"
                },
                "protected_phrases": [
                    "union européenne", "l'union européenne", "états unis", "les états unis",
                    "intelligence artificielle", "l'intelligence artificielle", "réseaux sociaux",
                    "changement climatique", "seconde guerre mondiale", "première guerre mondiale",
                    "droits de l'homme", "communauté européenne"
                ],
            },
            "vi": {
                "abbreviations": {
                    "tp.", "ts.", "ths.", "bs.", "gs.", "đc.", "thk.", "k.", "nxb.", "ubnd."
                },
                "dangling_words": {
                    "các", "những", "cái", "chiếc", "người", "con", "bộ", "sự", "việc",
                    "trong", "trên", "dưới", "với", "của", "từ", "vào", "đến", "tại", "về",
                    "là", "đang", "đã", "sẽ", "được", "bị"
                },
                "connectors": {
                    "và", "nhưng", "vì", "nên", "nếu", "khi", "mà", "để", "tuy", "hoặc",
                    "cho", "rồi", "bởi", "do", "tuy nhiên", "đồng thời", "do đó"
                },
                "protected_phrases": [
                    "liên minh châu âu", "hợp chủng quốc hoa kỳ", "trí tuệ nhân tạo",
                    "mạng xã hội", "biến đổi khí hậu", "thế chiến thứ hai"
                ],
            },
        }

        cfg = PROFILES.get(code, PROFILES["en"])
        return cls(
            code=code,
            abbreviations=cfg.get("abbreviations", set()),
            dangling_words=cfg.get("dangling_words", set()),
            connectors=cfg.get("connectors", set()),
            protected_phrases=cfg.get("protected_phrases", []),
        )


class SentenceGrouperService:
    """Domain service to group raw subtitle snippets into coherent sentences for dictation."""

    def __init__(
        self,
        max_pause_seconds: float = 1.0,
        max_words_per_challenge: int = 25,
        min_sentence_duration: float = 1.0,
        min_words_per_challenge: int = 2,
        max_duration_seconds: float = 8.0,
    ):
        self.max_pause_seconds = max_pause_seconds
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
    def clean_snippet_text(raw_text: str) -> Tuple[str, bool]:
        """Clean noise, brackets, music symbols, and detect speaker change token (>>)."""
        raw = TextNormalizer.normalize_quotes(raw_text).replace("\n", " ").strip()
        # Remove bracketed/parenthesised annotations (e.g. [music], (applause))
        cleaned = re.sub(r"\[.*?\]|\(.*?\)", "", raw).strip()
        # Remove musical notation symbols (♪ ♩ ♫ ♬)
        cleaned = re.sub(r"[♪♩♫♬]", "", cleaned).strip()

        # Check and strip speaker change marker (>> or >)
        is_speaker_change = False
        if cleaned.startswith(">"):
            is_speaker_change = True
            cleaned = re.sub(r"^>+\s*", "", cleaned).strip()

        # Normalize multiple internal whitespaces
        cleaned = re.sub(r"\s+", " ", cleaned).strip()
        return cleaned, is_speaker_change

    @staticmethod
    def calculate_word_durations(words: List[str], total_duration: float) -> List[float]:
        """Distribute snippet duration across words weighted by character length."""
        if not words:
            return []
        if len(words) == 1:
            return [max(0.12, total_duration)]

        # Character weight (minimum 1 char per word)
        weights = [max(1, len(TextNormalizer.clean_word(w))) for w in words]
        total_weight = sum(weights)

        # Minimum time per word: 0.12s
        min_word_time = 0.12
        raw_durations = [(w / total_weight) * total_duration for w in weights]

        # Clamp durations gracefully if total_duration permits
        if total_duration >= min_word_time * len(words):
            adjusted = [max(min_word_time, d) for d in raw_durations]
            adj_sum = sum(adjusted)
            return [d * (total_duration / adj_sum) for d in adjusted]

        return raw_durations

    @staticmethod
    def is_terminal_punctuation(word: str, profile: LanguageProfile) -> bool:
        """Check if a word ends with a real sentence-ending punctuation (. ! ? …).

        Safely ignores abbreviations (Dr., U.S., e.g.) and decimal numbers (2.0).
        """
        # Decimal numbers like 2.0 or 3.14
        if re.search(r"\b\d+\.\d+$", word):
            return False

        # Recognized abbreviations like Dr., Mr., U.S.
        if profile.is_abbreviation(word):
            return False

        # Match terminal punctuation followed by optional quote
        return bool(re.search(r'[.!?…]["\u2019\u201d\'»"]?$', word))

    @staticmethod
    def is_clause_punctuation(word: str) -> bool:
        """Check if a word ends with clause punctuation (, ; : — –), ignoring numeric comma ($10,000)."""
        # Exclude numeric commas within digits
        if re.search(r"\d,\d", word):
            return False
        return bool(re.search(r'[,;:\-—–]["\u2019\u201d\'»"]?$', word)) or word in [",", ";", ":", "—", "–"]

    def build_word_timeline(
        self,
        snippets: List[SubtitleSnippet],
        profile: LanguageProfile,
    ) -> List[dict]:
        """Phase 1 & 2: Clean snippets and construct the word-level temporal timeline."""
        if not snippets:
            return []

        # ── Phase 1: Clean & clamp overlapping durations ─────────────────────
        cleaned_snippets: List[dict] = []
        for i, item in enumerate(snippets):
            clean_text, is_speaker_change = self.clean_snippet_text(item.text)
            if not clean_text:
                continue

            s_start = item.start
            s_dur = item.duration
            if i + 1 < len(snippets):
                nxt = snippets[i + 1].start
                if nxt > s_start and (s_start + s_dur) > nxt:
                    s_dur = max(0.4, nxt - s_start)

            cleaned_snippets.append({
                "text": clean_text,
                "start": s_start,
                "duration": s_dur,
                "end": s_start + s_dur,
                "is_speaker_change": is_speaker_change,
            })

        if not cleaned_snippets:
            return []

        # ── Phase 2: Build character-weighted word timeline ──────────────────
        word_tl: List[dict] = []
        for si, snip in enumerate(cleaned_snippets):
            words = snip["text"].split()
            if not words:
                continue

            durations = self.calculate_word_durations(words, snip["duration"])
            next_snip_start = cleaned_snippets[si + 1]["start"] if si + 1 < len(cleaned_snippets) else None
            inter_pause = (
                max(0.0, next_snip_start - snip["end"])
                if next_snip_start is not None
                else 999.0
            )

            cur_t = snip["start"]
            for j, w in enumerate(words):
                w_dur = durations[j]
                w_start = cur_t
                w_end = cur_t + w_dur
                cur_t = w_end

                is_first_in_snip = j == 0
                is_last_in_snip = j == len(words) - 1

                word_tl.append({
                    "word": w,
                    "start": w_start,
                    "end": w_end,
                    "is_speaker_change": is_first_in_snip and snip["is_speaker_change"],
                    "is_last_in_snip": is_last_in_snip,
                    "inter_pause": inter_pause if is_last_in_snip else 0.0,
                })

        return word_tl

    def segment_into_sentences(
        self,
        word_tl: List[dict],
        profile: LanguageProfile,
    ) -> List[List[dict]]:
        """Phase 3 & 3.5: Group words into semantic sentences bounded by terminal punct, pause, or speaker change."""
        if not word_tl:
            return []

        sentences: List[List[dict]] = []
        cur_sent: List[dict] = []

        for i, wd in enumerate(word_tl):
            # If speaker change occurs and we already have accumulated words, commit previous sentence
            if wd["is_speaker_change"] and cur_sent and len(cur_sent) >= self.min_words_per_challenge:
                sentences.append(cur_sent)
                cur_sent = []

            cur_sent.append(wd)
            n_cur = len(cur_sent)
            is_last_word = i == len(word_tl) - 1

            ends_terminal = self.is_terminal_punctuation(wd["word"], profile)
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

        if cur_sent:
            sentences.append(cur_sent)

        # ── Phase 3.5: Merge tiny non-terminal fragments (<= 8.0s) ────────────
        merged: List[List[dict]] = []
        buf: List[dict] = list(sentences[0]) if sentences else []

        for s_list in sentences[1:]:
            buf_n = len(buf)
            buf_dur = buf[-1]["end"] - buf[0]["start"] if buf else 0.0
            s_dur = s_list[-1]["end"] - s_list[0]["start"] if s_list else 0.0
            pause = s_list[0]["start"] - buf[-1]["end"] if buf else 0.0

            buf_ends_terminal = self.is_terminal_punctuation(buf[-1]["word"], profile) if buf else False
            is_new_speaker = bool(s_list and s_list[0].get("is_speaker_change", False))

            can_merge = (
                not buf_ends_terminal
                and not is_new_speaker
                and buf_n < 5
                and pause <= 0.4
                and (buf_dur + pause + s_dur) <= self.max_duration_seconds
            )
            if can_merge:
                buf.extend(s_list)
            else:
                merged.append(buf)
                buf = list(s_list)

        if buf:
            merged.append(buf)

        return merged

    def find_best_split_index(
        self,
        wds: List[dict],
        profile: LanguageProfile,
        half_time: float,
    ) -> int:
        """Phase 4 Helper: Find optimal boundary to split an overlong sentence <= 8.0s.

        Priority order:
          1. Clause punctuation (, ; : — –) not inside dangling/protected phrases.
          2. Natural clause connectors (and, but, because, alors...)
          3. Audio micro-pauses (> 0.15s)
          4. Fallback midpoint shifted away from dangling words and protected phrase interiors.
        """
        clean_words = [TextNormalizer.clean_word(w["word"]) for w in wds]

        # 1. Punctuation / clause splits (, ; : — –)
        clause_splits = [
            idx for idx, w in enumerate(wds[:-1])
            if self.is_clause_punctuation(w["word"])
            and not profile.is_inside_protected_phrase(clean_words, idx)
        ]
        if clause_splits:
            return min(clause_splits, key=lambda idx: abs(wds[idx]["start"] - half_time))

        # 2. Natural conjunctions & connectors
        conns = [
            idx - 1 for idx, w in enumerate(wds[1:-1], 1)
            if profile.is_connector(w["word"])
            and not profile.is_dangling_end(wds[idx - 1]["word"])
            and not profile.is_inside_protected_phrase(clean_words, idx - 1)
        ]
        if conns:
            return min(conns, key=lambda idx: abs(wds[idx]["start"] - half_time))

        # 3. Micro-pause splits (> 0.15s)
        pauses = [
            idx for idx, w in enumerate(wds[:-1])
            if w.get("inter_pause", 0) > 0.15
            and not profile.is_dangling_end(w["word"])
            and not profile.is_inside_protected_phrase(clean_words, idx)
        ]
        if pauses:
            return min(pauses, key=lambda idx: abs(wds[idx]["start"] - half_time))

        # 4. Fallback midpoint shifted away from dangling words & protected phrases
        base_pivot = max(0, min(len(wds) - 2, next(
            (idx for idx, w in enumerate(wds[:-1]) if w["start"] >= half_time),
            len(wds) // 2 - 1,
        )))

        # Shift pivot backwards if it falls on dangling end word or protected interior
        best_pivot = base_pivot
        for offset in [0, -1, 1, -2, 2]:
            candidate = base_pivot + offset
            if 0 <= candidate < len(wds) - 1:
                if not profile.is_dangling_end(wds[candidate]["word"]) and not profile.is_inside_protected_phrase(clean_words, candidate):
                    best_pivot = candidate
                    break

        return best_pivot

    def split_into_challenges(
        self,
        sentence_words: List[dict],
        profile: LanguageProfile,
    ) -> List[Challenge]:
        """Phase 4: Recursively partition sentences into challenges strictly <= max_duration_seconds."""
        challenges: List[Challenge] = []

        def commit_words(wds: List[dict]) -> None:
            if not wds:
                return

            duration = wds[-1]["end"] - wds[0]["start"]
            if duration > self.max_duration_seconds and len(wds) > 1:
                half_time = wds[0]["start"] + duration / 2
                split_idx = self.find_best_split_index(wds, profile, half_time)

                left = wds[: split_idx + 1]
                right = wds[split_idx + 1 :]

                if left and right:
                    commit_words(left)
                    commit_words(right)
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

        commit_words(sentence_words)
        return challenges

    def align_translations(
        self,
        challenges: List[Challenge],
        translations: Optional[List[SubtitleSnippet]],
    ) -> None:
        """Phase 5: Attach translation snippets via maximum temporal overlap alignment

        Includes automatic timestamp desync/offset detection & correction for subtracks
        that have shifted timestamps on YouTube (e.g. TED talks with/without intro clips).
        """
        if not translations or not challenges:
            return

        cleaned_translations: List[SubtitleSnippet] = []
        for t in translations:
            raw_lines = t.text.split("\n")
            good_lines = [self.clean_credits(ln) for ln in raw_lines if self.clean_credits(ln)]
            if good_lines:
                cleaned_translations.append(
                    SubtitleSnippet(text=" ".join(good_lines), start=t.start, duration=t.duration)
                )

        if not cleaned_translations:
            return

        # Automatic desync offset detection between source challenges and target snippets
        first_c = challenges[0] if challenges else None
        first_t = cleaned_translations[0] if cleaned_translations else None
        if first_c and first_t:
            time_diff = first_c.time_start - first_t.start
            if abs(time_diff) > 2.0:
                logger.warning(
                    f"Detected subtitle timestamp desync offset of {time_diff:.2f}s between source audio and target captions. Applying automatic timestamp shift!"
                )
                cleaned_translations = [
                    SubtitleSnippet(text=t.text, start=t.start + time_diff, duration=t.duration)
                    for t in cleaned_translations
                ]

        # Proportional multi-overlap matching per challenge
        for c in challenges:
            c_dur = max(0.1, c.time_end - c.time_start)
            matched_texts: List[str] = []
            for t in cleaned_translations:
                overlap = min(c.time_end, t.end) - max(c.time_start, t.start)
                t_dur = max(0.1, t.end - t.start)
                if overlap >= 0.2 or (overlap / t_dur) >= 0.15 or (overlap / c_dur) >= 0.15:
                    matched_texts.append(t.text)

            if matched_texts:
                combined = re.sub(r"\s+", " ", " ".join(matched_texts)).strip()
                c.translation = self.clean_credits(combined) if combined else None
            else:
                c.translation = None

    def group_into_challenges(
        self,
        snippets: List[SubtitleSnippet],
        translations: Optional[List[SubtitleSnippet]] = None,
        language: Optional[str] = "en",
    ) -> List[Challenge]:
        """Main Domain Service entrypoint: Transform raw snippets into structured dictation challenges."""
        if not snippets:
            return []

        profile = LanguageProfile.get_profile(language)

        # 1. Phase 1 & 2: Build Word Timeline
        word_tl = self.build_word_timeline(snippets, profile)
        if not word_tl:
            return []

        # 2. Phase 3 & 3.5: Segment into semantic sentences
        sentences = self.segment_into_sentences(word_tl, profile)

        # 3. Phase 4: Build challenges <= max_duration_seconds
        challenges: List[Challenge] = []
        for sent in sentences:
            sent_challenges = self.split_into_challenges(sent, profile)
            for c in sent_challenges:
                pos = len(challenges) + 1
                c.id = pos
                c.position = pos
                challenges.append(c)

        # 4. Phase 5: Align translations
        self.align_translations(challenges, translations)

        return challenges

