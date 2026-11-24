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


def build_fallback_word_overview(word: str, source_lang: str = "en") -> Dict[str, Any]:
    """Generate structured fallback overview when offline or Gemini API is unavailable."""
    clean = (word or "").strip()
    if not clean:
        raise ValueError("Word cannot be empty")

    query_param = urllib.parse.quote(f"{clean} là gì và gốc, họ của nó")
    google_search_url = f"https://www.google.com/search?q={query_param}"

    lower = clean.lower()
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
        fallback = build_fallback_word_overview(clean, source_lang)
        _overview_cache[cache_key] = fallback
        return fallback

    prompt = f"""Bạn là một chuyên gia ngôn ngữ học và từ điển tiếng Anh cao cấp.
Hãy phân tích từ "{clean}" để tạo phần tóm tắt "Google AI Overview" (Tổng quan do AI tạo) chuẩn xác, chuyên sâu và thân thiện nhất cho người học:
1. "overview": Đoạn văn tổng quan (1-2 câu) nêu rõ từ loại, phiên âm IPA, nghĩa tiếng Việt chính xác và sắc thái nghĩa so với các từ đồng nghĩa (như ảnh Google AI Overview).
2. "phonetic": Phiên âm chuẩn quốc tế IPA (ví dụ: /ˌɪn.ədˈvɜː.tənt.li/).
3. "part_of_speech": Từ loại tiếng Việt (trạng từ, danh từ, tính từ, động từ...).
4. "examples": Mảng 1-2 câu ví dụ thực tế. Mỗi phần tử là object {{"en": "câu tiếng Anh", "vi": "bản dịch tiếng Việt"}}.
5. "etymology": Mảng các gạch đầu dòng phân tích Nguồn gốc từ (Etymology) chi tiết: phân tích tiền tố (prefix), gốc từ (root từ tiếng Latin/Hy Lạp), hậu tố (suffix) và sự phát triển nghĩa gốc.
6. "word_family": Mảng các từ trong Họ từ (Word Family) của nó. Mỗi phần tử là object {{"word": "từ", "pos": "noun/verb/adj/adv", "meaning": "nghĩa tiếng Việt"}}.

Trả về DUY NHẤT một chuỗi JSON chuẩn định dạng:
{{
  "word": "{clean}",
  "phonetic": "...",
  "part_of_speech": "...",
  "overview": "...",
  "examples": [
    {{"en": "...", "vi": "..."}}
  ],
  "etymology": [
    "..."
  ],
  "word_family": [
    {{"word": "...", "pos": "...", "meaning": "..."}}
  ]
}}
"""


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
    fallback = build_fallback_word_overview(clean, source_lang)
    _overview_cache[cache_key] = fallback
    return fallback
