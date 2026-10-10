"""Part of Speech (Từ loại) normalization and multi-language dictionary service.

Supports multi-part-of-speech words (e.g., 'noun, verb') across all supported languages:
English, Vietnamese, French, German, Japanese, Chinese, Korean, etc.
"""
from typing import List, Optional, Set
import re

# Canonical English POS mapping
STANDARD_POS_MAP = {
    # English tokens & abbreviations
    "n": "noun",
    "noun": "noun",
    "v": "verb",
    "verb": "verb",
    "adj": "adjective",
    "adjective": "adjective",
    "adv": "adverb",
    "adverb": "adverb",
    "prep": "preposition",
    "preposition": "preposition",
    "conj": "conjunction",
    "conjunction": "conjunction",
    "pron": "pronoun",
    "pronoun": "pronoun",
    "interj": "interjection",
    "int": "interjection",
    "interjection": "interjection",
    "det": "determiner",
    "determiner": "determiner",
    "art": "article",
    "article": "article",
    "phrase": "phrase",
    "phr": "phrase",
    "idiom": "idiom",
    "phrasal verb": "phrasal verb",
    # Vietnamese terms
    "danh từ": "noun",
    "động từ": "verb",
    "tính từ": "adjective",
    "trạng từ": "adverb",
    "phó từ": "adverb",
    "giới từ": "preposition",
    "liên từ": "conjunction",
    "đại từ": "pronoun",
    "thán từ": "interjection",
    "từ hạn định": "determiner",
    "mạo từ": "article",
    "cụm từ": "phrase",
    "thành ngữ": "idiom",
    # French
    "nom": "noun",
    "verbe": "verb",
    "adjectif": "adjective",
    "adverbe": "adverb",
    "préposition": "preposition",
    "conjonction": "conjunction",
    "pronom": "pronoun",
    # German
    "nomen": "noun",
    "substantiv": "noun",
    "adjektiv": "adjective",
    "präposition": "preposition",
    "konjunktion": "conjunction",
    "pronomen": "pronoun",
    # Japanese
    "名詞": "noun",
    "動詞": "verb",
    "形容詞": "adjective",
    "副詞": "adverb",
    "助詞": "preposition",
    "連語": "phrase",
    # Chinese
    "名词": "noun",
    "动词": "verb",
    "形容词": "adjective",
    "副词": "adverb",
    "介词": "preposition",
    "词组": "phrase",
    # Korean
    "명사": "noun",
    "동사": "verb",
    "형용사": "adjective",
    "부사": "adverb",
    "전치사": "preposition",
    "구": "phrase",
}

VIETNAMESE_POS_LABELS = {
    "noun": "Danh từ",
    "verb": "Động từ",
    "adjective": "Tính từ",
    "adverb": "Trạng từ",
    "preposition": "Giới từ",
    "conjunction": "Liên từ",
    "pronoun": "Đại từ",
    "interjection": "Thán từ",
    "determiner": "Từ hạn định",
    "article": "Mạo từ",
    "phrase": "Cụm từ",
    "idiom": "Thành ngữ",
    "phrasal verb": "Cụm động từ",
}


def parse_pos_tokens(raw_pos: Optional[str]) -> List[str]:
    """Extract individual part-of-speech tokens from a string.
    Supports delimiters like comma, slash, semicolon, pipe, bullet.
    """
    if not raw_pos:
        return []
    
    # Split by common delimiters: comma, slash, semicolon, pipe, plus, or newline
    parts = re.split(r"[,;/|•+\n]+", str(raw_pos))
    tokens = []
    seen: Set[str] = set()

    for p in parts:
        clean = p.strip()
        if not clean:
            continue
        lower_clean = clean.lower()
        if lower_clean not in seen:
            seen.add(lower_clean)
            tokens.append(clean)

    return tokens


def normalize_single_pos(token: str) -> str:
    """Normalize a single POS token to canonical name, preserving custom foreign terms."""
    clean = token.strip()
    if not clean:
        return ""
    lower = clean.lower()
    return STANDARD_POS_MAP.get(lower, clean)


def normalize_pos_string(raw_pos: Optional[str]) -> Optional[str]:
    """Parse, canonicalize, deduplicate, and join POS tokens into a clean comma-separated string."""
    tokens = parse_pos_tokens(raw_pos)
    if not tokens:
        return None

    normalized_tokens: List[str] = []
    seen: Set[str] = set()

    for t in tokens:
        norm = normalize_single_pos(t)
        if norm and norm.lower() not in seen:
            seen.add(norm.lower())
            normalized_tokens.append(norm)

    if not normalized_tokens:
        return None
    return ", ".join(normalized_tokens)


def format_pos_display(pos_str: Optional[str], lang: str = "vi") -> str:
    """Format parts of speech nicely for display in Vietnamese or target language."""
    if not pos_str:
        return ""

    tokens = parse_pos_tokens(pos_str)
    if not tokens:
        return ""

    if lang == "vi":
        formatted = []
        for t in tokens:
            norm = normalize_single_pos(t).lower()
            vi_label = VIETNAMESE_POS_LABELS.get(norm, t)
            formatted.append(vi_label)
        return ", ".join(formatted)

    return ", ".join(tokens)
