"""AI Word Overview Service: Generates comprehensive Google AI Overview style word summaries.
Includes definition, IPA phonetic, real-world examples, Latin/Greek etymology, and full word families.
Follows AGENTS.md:
- Strictly under 500 lines (Rule 4)
- Comprehensive test coverage for all functions (Rule 6)
"""
import os
import re
import json
import logging
import time
import urllib.parse
from typing import Dict, Any, Optional
import httpx
from dotenv import load_dotenv

from app.infrastructure.gemini_model_helper import get_candidate_gemini_models

load_dotenv()
logger = logging.getLogger(__name__)

# Latency budget: the modal is interactive, so fail over to the fallback quickly.
PER_MODEL_TIMEOUT_SECONDS = 15.0
OVERALL_DEADLINE_SECONDS = 25.0
MAX_MODEL_ATTEMPTS = 3

# In-memory LRU-like cache: { word.lower(): overview_dict }
_overview_cache: Dict[str, Dict[str, Any]] = {}


def clear_overview_cache() -> None:
    """Clear in-memory cache for unit test isolation."""
    _overview_cache.clear()


def get_gemini_api_key() -> str:
    """Dynamically get GEMINI_API_KEY from environment or .env."""
    return (os.getenv("GEMINI_API_KEY", "") or "").strip()


# Function words never worth a "key word" slot when splitting a long phrase.
PHRASE_STOPWORDS = frozenset("""
a an the and or but nor so yet of to in on at by for with from into onto upon about as than
that this these those it its is are was were be been being have has had do does did will would
can could should may might must shall not no very much many more most such which who whom whose
what when where why how if then there their them they he she his her we our you your i me my
""".split())
MAX_KEY_WORDS = 4


def is_multi_word_phrase(text: str) -> bool:
    """True when the entry has 2+ words (a phrase/collocation rather than a single word)."""
    if not isinstance(text, str):
        return False
    return len(text.split()) >= 2


def extract_phrase_key_words(text: str, limit: int = MAX_KEY_WORDS) -> list:
    """Heuristic content words of a phrase (stopwords dropped, longest first, original order kept)."""
    if not isinstance(text, str) or not is_multi_word_phrase(text) or limit <= 0:
        return []
    tokens = [re.sub(r"^[^\w]+|[^\w]+$", "", t) for t in text.split()]
    seen, candidates = set(), []
    for idx, tok in enumerate(tokens):
        low = tok.lower()
        if len(low) < 3 or low in PHRASE_STOPWORDS or low in seen or not low.isalpha():
            continue
        seen.add(low)
        candidates.append((idx, tok))
    top = sorted(candidates, key=lambda c: (-len(c[1]), c[0]))[:limit]
    return [tok for _, tok in sorted(top)]


def build_overview_prompt(word: str) -> str:
    """Gemini prompt; phrases additionally get a "key_words" breakdown with examples."""
    clean = (word or "").strip()
    if not clean:
        raise ValueError("Word cannot be empty")

    phrase_rules = ""
    phrase_schema = ""
    if is_multi_word_phrase(clean):
        phrase_rules = f"""
ĐÂY LÀ MỘT CỤM TỪ (nhiều từ). Bắt buộc:
- "overview": dịch nghĩa cả cụm sang tiếng Việt tự nhiên, nêu cụm thường gặp trong ngữ cảnh nào.
- "key_words": chọn 2-{MAX_KEY_WORDS} từ/collocation QUAN TRỌNG NHẤT trong cụm mà người học cần nhớ
  (bỏ qua từ chức năng như the, of, to, much, have...). Mỗi phần tử gồm từ, từ loại, IPA, nghĩa tiếng Việt
  trong cụm này, và 1 câu ví dụ ngắn KHÁC với cụm gốc dùng chính từ đó (kèm bản dịch).
- "etymology" và "word_family": phân tích cho các từ quan trọng trong "key_words" (không phải cả cụm).
- "phonetic": IPA cả cụm, GIỮ KHOẢNG TRẮNG giữa các từ (ví dụ: /tɛnd tə hæv/).
"""
        phrase_schema = """,
  "key_words": [
    {"word": "...", "pos": "...", "phonetic": "/.../", "meaning": "...", "example_en": "...", "example_vi": "..."}
  ]"""

    return f"""Bạn là một chuyên gia ngôn ngữ học và từ điển tiếng Anh cao cấp.
Hãy phân tích "{clean}" để tạo phần tóm tắt "Google AI Overview" (Tổng quan do AI tạo) chuẩn xác, chuyên sâu và thân thiện nhất cho người học:
1. "overview": Đoạn văn tổng quan (1-2 câu) nêu rõ từ loại, nghĩa tiếng Việt chính xác và sắc thái nghĩa so với các từ đồng nghĩa.
2. "phonetic": Phiên âm chuẩn quốc tế IPA (ví dụ: /ˌɪn.ədˈvɜː.tənt.li/).
3. "part_of_speech": Từ loại tiếng Việt (trạng từ, danh từ, tính từ, động từ, cụm từ...).
4. "examples": Mảng 1-2 câu ví dụ thực tế. Mỗi phần tử là object {{"en": "câu tiếng Anh", "vi": "bản dịch tiếng Việt"}}.
5. "etymology": Mảng các gạch đầu dòng phân tích Nguồn gốc từ: tiền tố (prefix), gốc từ (Latin/Hy Lạp), hậu tố (suffix) và sự phát triển nghĩa.
6. "word_family": Mảng các từ trong Họ từ (Word Family). Mỗi phần tử là object {{"word": "từ", "pos": "noun/verb/adj/adv", "meaning": "nghĩa tiếng Việt"}}.
{phrase_rules}
Trả về DUY NHẤT một chuỗi JSON chuẩn định dạng:
{{
  "word": "{clean}",
  "phonetic": "...",
  "part_of_speech": "...",
  "overview": "...",
  "examples": [{{"en": "...", "vi": "..."}}],
  "etymology": ["..."],
  "word_family": [{{"word": "...", "pos": "...", "meaning": "..."}}]{phrase_schema}
}}
"""


def normalize_key_words(raw: Any, phrase: str) -> list:
    """Clean AI key_words to a list of dicts with string fields; heuristic words if missing/invalid."""
    fields = ("word", "pos", "phonetic", "meaning", "example_en", "example_vi")
    result = []
    if isinstance(raw, list):
        for item in raw:
            if not isinstance(item, dict):
                continue
            word = str(item.get("word") or "").strip()
            if not word:
                continue
            entry = {f: str(item.get(f) or "").strip() for f in fields}
            entry["word"] = word
            result.append(entry)
            if len(result) >= MAX_KEY_WORDS:
                break
    if result or not is_multi_word_phrase(phrase or ""):
        return result
    return [{f: (kw if f == "word" else "") for f in fields} for kw in extract_phrase_key_words(phrase)]


def build_fallback_word_overview(word: str, source_lang: str = "en") -> Dict[str, Any]:
    """Generate structured fallback overview when offline or Gemini API is unavailable."""
    clean = (word or "").strip()
    if not clean:
        raise ValueError("Word cannot be empty")

    query_param = urllib.parse.quote(f"{clean} là gì và gốc, họ của nó")
    google_search_url = f"https://www.google.com/search?q={query_param}"

    lower = clean.lower()
    key_words = normalize_key_words(None, clean)
    # Simple etymology heuristic
    etymology_points = []
    if lower.endswith("ly"):
        base = lower[:-2]
        etymology_points.append(f"Hình thành từ gốc '{base}' kết hợp với hậu tố trạng từ '-ly'.")
    elif lower.endswith("tion") or lower.endswith("sion"):
        etymology_points.append(f"Từ có nguồn gốc từ hậu tố danh từ chỉ hành động hoặc trạng thái '-tion/-sion'.")
    elif lower.endswith("able") or lower.endswith("ible"):
        etymology_points.append(f"Từ phái sinh với hậu tố tính từ mang ý nghĩa 'có thể làm được' (-able/-ible).")
    else:
        etymology_points.append(f"Từ gốc vựng tiếng Anh chuẩn quốc tế '{clean}'.")

    etymology_points.append("Bắt nguồn từ gốc từ ngữ Ấn-Âu (Latin/Greek/Old French) thông qua quá trình giao lưu văn hóa và ngôn ngữ học.")

    return {
        "word": clean,
        "phonetic": "",
        "part_of_speech": "Từ vựng (Vocabulary)",
        "overview": f"{clean} là từ vựng quan trọng trong giao tiếp và các kỳ thi học thuật.",
        "examples": [
            {
                "en": f"You should practice using '{clean}' in your daily English sentences.",
                "vi": f"Bạn nên luyện tập sử dụng từ '{clean}' trong các câu tiếng Anh hàng ngày."
            }
        ],
        "etymology": etymology_points,
        "word_family": [
            {"word": clean, "pos": "gốc từ", "meaning": f"Hình thái từ vựng chuẩn của {clean}"}
        ],
        "key_words": key_words,
        "google_search_url": google_search_url,
        "is_ai_generated": False
    }


def build_generation_config(model_name: str) -> Dict[str, Any]:
    """JSON generation config; disables 'thinking' on 2.5 Flash models, which otherwise adds seconds."""
    config: Dict[str, Any] = {"responseMimeType": "application/json", "temperature": 0.3}
    lower = (model_name or "").lower()
    if "2.5" in lower and "flash" in lower:
        config["thinkingConfig"] = {"thinkingBudget": 0}
    return config


async def fetch_google_ai_word_overview(
    word: str,
    source_lang: str = "en",
    target_lang: str = "vi",
    client: Optional[httpx.AsyncClient] = None
) -> Dict[str, Any]:
    """Fetch comprehensive Google AI Overview for a word with etymology and word family."""
    clean = (word or "").strip()
    if not clean:
        raise ValueError("Word cannot be empty")

    cache_key = f"{clean.lower()}_{source_lang}_{target_lang}"
    if cache_key in _overview_cache:
        return _overview_cache[cache_key]

    query_param = urllib.parse.quote(f"{clean} là gì và gốc, họ của nó")
    google_search_url = f"https://www.google.com/search?q={query_param}"

    api_key = get_gemini_api_key()
    if not api_key:
        return build_fallback_word_overview(clean, source_lang)

    prompt = build_overview_prompt(clean)


    should_close_client = False
    if client is None:
        client = httpx.AsyncClient(timeout=PER_MODEL_TIMEOUT_SECONDS)
        should_close_client = True

    last_error = ""
    try:
        models_to_try = (await get_candidate_gemini_models(api_key, client))[:MAX_MODEL_ATTEMPTS]
        deadline = time.monotonic() + OVERALL_DEADLINE_SECONDS
        for model_name in models_to_try:
            remaining = deadline - time.monotonic()
            if remaining <= 1.0:
                last_error = "overall deadline exceeded"
                break
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent"
            headers = {"x-goog-api-key": api_key}
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": build_generation_config(model_name),
            }
            try:
                response = await client.post(
                    url, json=payload, headers=headers,
                    timeout=min(PER_MODEL_TIMEOUT_SECONDS, remaining),
                )
                if response.status_code == 200:
                    res_json = response.json()
                    candidates = res_json.get("candidates", [])
                    if candidates and "content" in candidates[0]:
                        parts = candidates[0]["content"].get("parts", [])
                        if parts and "text" in parts[0]:
                            raw_text = parts[0]["text"].strip()
                            raw_text = re.sub(r"^```(?:json)?\s*", "", raw_text, flags=re.MULTILINE)
                            raw_text = re.sub(r"\s*```$", "", raw_text, flags=re.MULTILINE)
                            parsed = json.loads(raw_text)
                            if isinstance(parsed, dict) and "overview" in parsed:
                                parsed["key_words"] = normalize_key_words(parsed.get("key_words"), clean)
                                parsed["google_search_url"] = google_search_url
                                parsed["is_ai_generated"] = True
                                _overview_cache[cache_key] = parsed
                                return parsed
                else:
                    last_error = f"Gemini HTTP {response.status_code}: {response.text}"
            except Exception as e:
                last_error = str(e)
                logger.debug(f"Error querying {model_name} for word overview: {e}")
    finally:
        if should_close_client:
            await client.aclose()

    logger.warning(f"Gemini API word overview fallback used ({last_error}).")
    # Not cached: a transient Gemini failure must not pin the generic fallback until restart.
    return build_fallback_word_overview(clean, source_lang)
