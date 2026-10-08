"""Domain Value Object holding language-specific syntax rules, abbreviations, and protected phrases."""
import re
from typing import List, Optional
from app.domain.text_normalizer import TextNormalizer


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
