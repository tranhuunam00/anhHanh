"""Domain Services facade module for Dictation and Evaluation."""
from app.domain.text_normalizer import TextNormalizer
from app.domain.word_comparator import WordComparatorService
from app.domain.language_profile import LanguageProfile
from app.domain.sentence_grouper import SentenceGrouperService

__all__ = [
    "TextNormalizer",
    "WordComparatorService",
    "LanguageProfile",
    "SentenceGrouperService",
]
