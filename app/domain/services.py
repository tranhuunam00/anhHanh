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
        max_pause_seconds: float = 1.0,
        max_sentence_duration: float = 5.0,
        max_words_per_challenge: int = 11,
    ):
        self.max_pause_seconds = max_pause_seconds
        self.max_sentence_duration = max_sentence_duration
        self.max_words_per_challenge = max_words_per_challenge

    def group_into_challenges(
        self,
        snippets: List[SubtitleSnippet],
        translations: Optional[List[SubtitleSnippet]] = None,
    ) -> List[Challenge]:
        if not snippets:
            return []

        challenges: List[Challenge] = []
        current_texts: List[str] = []
        start_time: Optional[float] = None
        last_end_time: Optional[float] = None

        for item in snippets:
            raw = TextNormalizer.normalize_quotes(item.text).replace("\n", " ").strip()
            # Remove audio annotations like [music], [applause], (French)
            clean_text = re.sub(r"\[.*?\]", "", raw).strip()
            if not clean_text:
                continue

            # Pause gap check
            if (
                last_end_time is not None
                and (item.start - last_end_time) > self.max_pause_seconds
                and current_texts
            ):
                self._commit_challenge(
                    challenges, current_texts, start_time, last_end_time, translations
                )
                current_texts = []
                start_time = None

            if start_time is None:
                start_time = item.start

            current_texts.append(clean_text)
            last_end_time = item.end
            current_duration = last_end_time - start_time
            current_words = len(" ".join(current_texts).split())

            # Break on terminal punctuation or reasonable short chunk limit
            ends_with_terminal = bool(re.search(r'[.!?]["\']?$', clean_text))
            reached_duration = current_duration >= self.max_sentence_duration
            reached_words = current_words >= self.max_words_per_challenge

            if ends_with_terminal or reached_duration or reached_words:
                self._commit_challenge(
                    challenges, current_texts, start_time, last_end_time, translations
                )
                current_texts = []
                start_time = None

        if current_texts and start_time is not None and last_end_time is not None:
            self._commit_challenge(
                challenges, current_texts, start_time, last_end_time, translations
            )

        return challenges

    def _commit_challenge(
        self,
        challenges: List[Challenge],
        texts: List[str],
        start: Optional[float],
        end: Optional[float],
        translations: Optional[List[SubtitleSnippet]],
    ) -> None:
        if start is None or end is None or not texts:
            return

        combined_text = " ".join(texts).strip()
        combined_text = re.sub(r"\s+", " ", combined_text)
        if not combined_text:
            return

        pos = len(challenges) + 1

        # Match translation snippet within overlapping time window
        translation_text = None
        if translations:
            overlapping = [
                t.text
                for t in translations
                if max(start, t.start) < min(end, t.end)
            ]
            if overlapping:
                raw_trans = " ".join(overlapping).replace("\n", " ")
                translation_text = re.sub(r"\s+", " ", raw_trans).strip()

        challenges.append(
            Challenge(
                id=pos,
                position=pos,
                text=combined_text,
                time_start=round(start, 2),
                time_end=round(end, 2),
                translation=translation_text,
            )
        )
