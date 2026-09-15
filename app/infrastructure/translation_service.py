"""Translation service with caching and multiple fallbacks for accurate English-to-Vietnamese translation."""
import html
import json
import os
import re
import urllib.parse
import urllib.request
from typing import Dict, Optional


class TranslationService:
    """Provides high-quality English to Vietnamese translations with disk caching."""

    def __init__(self, cache_file: str = "data/cache/translations_dict.json"):
        self.cache_file = cache_file
        self.memory_cache: Dict[str, str] = {}
        self._load_cache()

    def _load_cache(self) -> None:
        if os.path.exists(self.cache_file):
            try:
                with open(self.cache_file, "r", encoding="utf-8") as f:
                    self.memory_cache = json.load(f)
            except Exception:
                self.memory_cache = {}

    def _save_cache(self) -> None:
        try:
            os.makedirs(os.path.dirname(self.cache_file), exist_ok=True)
            with open(self.cache_file, "w", encoding="utf-8") as f:
                json.dump(self.memory_cache, f, ensure_ascii=False, indent=2)
        except Exception:
            pass

    def clean_text(self, text: str) -> str:
        """Remove bracketed annotations and redundant whitespace."""
        cleaned = re.sub(r"\[.*?\]|\(.*?\)", "", text)
        cleaned = re.sub(r"\s+", " ", cleaned).strip()
        return cleaned

    def clean_credits(self, text: str) -> str:
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

    def translate_to_vietnamese(self, text: str) -> str:
        """Translate English sentence to Vietnamese using cache or MyMemory translation API."""
        cleaned = self.clean_text(text)
        if not cleaned:
            return ""

        # Check cache
        if cleaned in self.memory_cache:
            return self.memory_cache[cleaned]

        # Call translation provider (MyMemory API)
        translated = self._fetch_mymemory(cleaned)
        if translated:
            cleaned_trans = self.clean_credits(translated)
            self.memory_cache[cleaned] = cleaned_trans
            self._save_cache()
            return cleaned_trans

        return ""

    def _fetch_mymemory(self, text: str) -> Optional[str]:
        """Fetch translation from MyMemory API."""
        try:
            q = urllib.parse.quote(text)
            url = f"https://api.mymemory.translated.net/get?q={q}&langpair=en|vi"
            req = urllib.request.Request(
                url,
                headers={
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
                },
            )
            with urllib.request.urlopen(req, timeout=5) as res:
                data = json.loads(res.read().decode("utf-8"))
                trans = data.get("responseData", {}).get("translatedText", "")
                if trans and "MYMEMORY WARNING" not in trans:
                    return html.unescape(trans).strip()
        except Exception:
            pass
        return None
