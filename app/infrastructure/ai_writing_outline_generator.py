"""AI Writing Outline Generator using Gemini AI
Tạo dàn bài phân tích chi tiết 100% Tiếng Việt theo từng dạng bài và ngôn ngữ.
"""

import json
import logging
import re
from typing import Any, Dict, List, Optional
import httpx

from app.infrastructure.ai_writing_evaluator import LANGUAGES_CONFIG

logger = logging.getLogger(__name__)


def build_outline_system_prompt(
    topic: str,
    genre: str = "ielts_task2",
    sub_type: Optional[str] = "opinion",
    language: str = "en",
    target_band: float = 7.0
) -> str:
    """Build structured prompt instructing Gemini to output 100% Vietnamese outline."""
    cfg = LANGUAGES_CONFIG.get(language, LANGUAGES_CONFIG["en"])
    lang_name = cfg["name"]

    is_task2 = genre == "ielts_task2"

    if is_task2:
        task2_rule = """
BẮT BUỘC ĐỦ 4 PHẦN VÀ TUÂN THỦ NGHIÊM NGẶT QUY CÁCH:
1. Mở bài (Intro): Gồm 2 ý: Dẫn dắt đề bài (Paraphrase) và Luận đề (Thesis Statement).
2. Thân bài 1 (Body 1): BẮT BUỘC CÓ 3 MỤC:
   - main_idea: Ý chính của đoạn thân bài 1 (câu chủ đề rõ ràng).
   - supporting: Luận cứ phân tích cơ chế, nguyên nhân hoặc lợi ích.
   - example: Dẫn chứng / ví dụ thực tế cụ thể minh chứng cho ý chính.
3. Thân bài 2 (Body 2): BẮT BUỘC CÓ 3 MỤC:
   - main_idea: Ý chính của đoạn thân bài 2 (luận điểm đối trọng hoặc sâu sắc hơn).
   - supporting: Luận cứ phân tích chiều sâu, tác động dài hạn.
   - example: Dẫn chứng / ví dụ thực tế cụ thể.
4. Kết bài (Conclusion): Tái khẳng định lập trường và đúc kết 2 luận điểm cốt lõi.
"""
    else:
        task2_rule = """
Xây dựng dàn bài đúng cấu trúc chuẩn mực của thể loại này:
- Nếu là IELTS Task 1: Gồm Mở bài (Paraphrase), Overview (Tổng quan 2 điểm nổi bật không kèm số liệu), Thân bài 1 và Thân bài 2 (Phân tích chi tiết kèm số liệu đối chiếu).
- Nếu là Business Email: Tiêu đề thư, Lời chào, Mục đích viết thư, Nội dung chi tiết, Kêu gọi hành động & Thời hạn, Lời kết & Ký tên.
- Nếu là Đoạn văn ngắn (Paragraph): Câu chủ đề, Luận giải, Dẫn chứng, Câu kết đoạn.
- Nếu là Viết tự do (Free): Khởi nguồn, Diễn biến trải nghiệm, Suy ngẫm, Đúc kết.
"""

    return f"""Bạn là một chuyên gia khảo thí và sư phạm ngôn ngữ hàng đầu.
Nhiệm vụ của bạn là lập một DÀN BÀI BÀI VIẾT CHI TIẾT 100% BẰNG TIẾNG VIỆT dành cho đề bài dưới đây.

ĐỀ BÀI (TOPIC):
\"\"\"{topic}\"\"\"

THỂ LOẠI: {genre}
DẠNG CHI TIẾT: {sub_type or 'Chung'}
NGÔN NGỮ ĐÍCH CỦA BÀI VIẾT: {lang_name} ({language})
MỤC TIÊU BAND ĐIỂM: {target_band}

QUY TẮC CỐT LÕI (BẮT BUỘC TUÂN THỦ):
1. TOÀN BỘ DÀN Ý, GỢI Ý VÀ NỘI DUNG PHẢI VIẾT 100% BẰNG TIẾNG VIỆT rõ ràng, súc tích, mang tính định hướng cao.
2. {task2_rule}
3. Cung cấp thêm 1-2 lưu ý phương pháp viết và tư duy lập luận đặc trưng của {lang_name}.

BẮT BUỘC TRẢ VỀ DUY NHẤT ĐỊNH DẠNG JSON THEO CẤU TRÚC SAU:
{{
  "genre": "{genre}",
  "sub_type": "{sub_type or 'opinion'}",
  "language": "{language}",
  "title": "Dàn bài chi tiết dạng {sub_type or genre}",
  "description": "Tóm tắt định hướng phương pháp viết cho đề bài này bằng tiếng Việt",
  "sections": [
    {{
      "id": "intro",
      "name": "1. Mở bài (Introduction)",
      "wordTarget": "40 - 50 từ",
      "components": [
        {{ "label": "Dẫn dắt & Paraphrase", "guide": "...", "content": "..." }},
        {{ "label": "Luận đề (Thesis Statement)", "guide": "...", "content": "..." }}
      ]
    }},
    {{
      "id": "body1",
      "name": "2. Thân bài 1 (Body 1)",
      "wordTarget": "90 - 100 từ",
      "main_idea": "Ý chính luận điểm 1 bằng tiếng Việt...",
      "supporting": "Luận cứ phân tích cơ chế bằng tiếng Việt...",
      "example": "Dẫn chứng / ví dụ thực tế cụ thể..."
    }},
    {{
      "id": "body2",
      "name": "3. Thân bài 2 (Body 2)",
      "wordTarget": "90 - 100 từ",
      "main_idea": "Ý chính luận điểm 2 bằng tiếng Việt...",
      "supporting": "Luận cứ phân tích chiều sâu bằng tiếng Việt...",
      "example": "Dẫn chứng / ví dụ thực tế cụ thể..."
    }},
    {{
      "id": "conclusion",
      "name": "4. Kết bài (Conclusion)",
      "wordTarget": "30 - 40 từ",
      "components": [
        {{ "label": "Tái khẳng định quan điểm", "guide": "...", "content": "..." }},
        {{ "label": "Tóm lược 2 luận điểm", "guide": "...", "content": "..." }}
      ]
    }}
  ],
  "language_note": "Lưu ý phương pháp tư duy cho {lang_name}...",
  "high_score_tips": [
    "Tip 1...",
    "Tip 2..."
  ]
}}
"""


def normalize_outline_result(
    data: Any,
    genre: str = "ielts_task2",
    sub_type: Optional[str] = "opinion",
    language: str = "en"
) -> Dict[str, Any]:
    """Validate and normalize outline object into standard format."""
    if not isinstance(data, dict):
        data = {}

    title = str(data.get("title") or f"Dàn bài chuẩn dạng {sub_type or genre}").strip()
    description = str(data.get("description") or "").strip()
    sections = data.get("sections")

    normalized_sections = []
    if isinstance(sections, list) and len(sections) > 0:
        for s in sections:
            if isinstance(s, dict):
                normalized_sections.append({
                    "id": str(s.get("id") or "section").strip(),
                    "name": str(s.get("name") or "Phần bài viết").strip(),
                    "wordTarget": str(s.get("wordTarget") or "").strip(),
                    "main_idea": str(s.get("main_idea") or "").strip(),
                    "supporting": str(s.get("supporting") or "").strip(),
                    "example": str(s.get("example") or "").strip(),
                    "components": s.get("components") if isinstance(s.get("components"), list) else []
                })

    # Nếu AI trả về rỗng, tạo khung chuẩn tối thiểu
    if not normalized_sections:
        if genre == "ielts_task2":
            normalized_sections = [
                {
                    "id": "intro",
                    "name": "1. Mở bài (Introduction)",
                    "wordTarget": "40 - 50 từ",
                    "components": [
                        {"label": "Dẫn dắt & Paraphrase", "guide": "Diễn giải lại đề bài khách quan", "content": ""},
                        {"label": "Luận đề (Thesis Statement)", "guide": "Nêu rõ lập trường quan điểm cá nhân", "content": ""}
                    ]
                },
                {
                    "id": "body1",
                    "name": "2. Thân bài 1 (Body 1)",
                    "wordTarget": "90 - 100 từ",
                    "main_idea": "Luận điểm chính thứ nhất củng cố cho quan điểm",
                    "supporting": "Giải thích chi tiết tại sao và tác động thế nào",
                    "example": "Ví dụ thực tế minh họa sinh động"
                },
                {
                    "id": "body2",
                    "name": "3. Thân bài 2 (Body 2)",
                    "wordTarget": "90 - 100 từ",
                    "main_idea": "Luận điểm chính thứ hai sâu sắc hơn",
                    "supporting": "Phân tích tác động dài hạn và tính thuyết phục",
                    "example": "Ví dụ thực tế minh họa chứng minh"
                },
                {
                    "id": "conclusion",
                    "name": "4. Kết bài (Conclusion)",
                    "wordTarget": "30 - 40 từ",
                    "components": [
                        {"label": "Tái khẳng định quan điểm", "guide": "Khẳng định lại lập trường", "content": ""},
                        {"label": "Tóm lược luận điểm", "guide": "Đúc kết 2 lý do cốt lõi", "content": ""}
                    ]
                }
            ]

    high_score_tips = data.get("high_score_tips")
    if not isinstance(high_score_tips, list):
        high_score_tips = [
            "Đảm bảo mỗi đoạn thân bài có câu chủ đề (Topic Sentence) rõ ràng.",
            "Liên kết mạch lạc giữa luận điểm, luận cứ và ví dụ thực tế.",
            "Sử dụng từ nối tự nhiên chỉ quan hệ nhân - quả."
        ]

    return {
        "success": True,
        "genre": genre,
        "sub_type": sub_type or "opinion",
        "language": language,
        "title": title,
        "description": description,
        "sections": normalized_sections,
        "language_note": str(data.get("language_note") or "").strip(),
        "high_score_tips": high_score_tips
    }


async def generate_outline_impl(
    topic: str,
    genre: str = "ielts_task2",
    sub_type: Optional[str] = "opinion",
    language: str = "en",
    target_band: float = 7.0,
    api_key: Optional[str] = None
) -> Dict[str, Any]:
    """Call Gemini to generate detailed Vietnamese outline."""
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY chưa được cấu hình trên máy chủ.")

    prompt_instruction = build_outline_system_prompt(
        topic=topic,
        genre=genre,
        sub_type=sub_type,
        language=language,
        target_band=target_band
    )

    models_to_try = ["gemini-2.5-flash", "gemini-1.5-flash"]
    last_error = None

    async with httpx.AsyncClient(timeout=120.0) as client:
        for model_name in models_to_try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent"
            headers = {"x-goog-api-key": api_key}
            payload = {
                "contents": [{"parts": [{"text": prompt_instruction}]}],
                "generationConfig": {
                    "responseMimeType": "application/json",
                    "temperature": 0.3
                }
            }
            try:
                resp = await client.post(url, json=payload, headers=headers)
                if resp.status_code == 200:
                    data = resp.json()
                    raw_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
                    raw_text = re.sub(r"^```json\s*", "", raw_text)
                    raw_text = re.sub(r"\s*```$", "", raw_text)
                    parsed = json.loads(raw_text)
                    return normalize_outline_result(
                        parsed,
                        genre=genre,
                        sub_type=sub_type,
                        language=language
                    )
                else:
                    last_error = f"HTTP {resp.status_code}: {resp.text[:200]}"
            except Exception as e:
                last_error = str(e)
                continue

    raise RuntimeError(f"Không thể tạo dàn bài AI: {last_error}")
