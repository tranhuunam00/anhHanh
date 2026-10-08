"""AI Writing Prompt and Structure Generation using Google Gemini."""
import re
import json
import logging
import random
from typing import Dict, Any, Optional
import httpx
from app.infrastructure.writing_prompts_catalog import CURATED_PROMPTS_BY_LANG, LANGUAGES_CONFIG

logger = logging.getLogger(__name__)


async def generate_prompt_impl(
    genre: str,
    topic_area: Optional[str] = None,
    language: str = "en",
    sub_type: Optional[str] = None,
    api_key: Optional[str] = None
) -> Dict[str, Any]:
    """Generate a brand new realistic writing prompt in chosen language & sub-type using Gemini."""
    cfg = LANGUAGES_CONFIG.get(language, LANGUAGES_CONFIG["en"])
    lang_name = cfg["name"]

    if not api_key:
        lang_dict = CURATED_PROMPTS_BY_LANG.get(language, CURATED_PROMPTS_BY_LANG["en"])
        prompts = lang_dict.get(genre, lang_dict.get("ielts_task2", []))
        if sub_type and sub_type != "all":
            matched = [p for p in prompts if p.get("sub_type") == sub_type]
            if matched:
                prompts = matched
        return random.choice(prompts)

    area_hint = (
        f"BẮT BUỘC BÁM SÁT CHỦ ĐỀ / Ý TƯỞNG ĐƯỢC YÊU CẦU: '{topic_area.strip()}' (xây dựng đề thi khảo thí chuẩn chỉnh xoay quanh chủ đề này)"
        if topic_area and topic_area.strip()
        else "về một chủ đề mang tính thời sự hoặc khoa học xã hội phổ biến trong kỳ thi IELTS"
    )

    sub_type_rule = ""
    min_words = 250
    rec_time = 40

    if genre == "ielts_task1":
        min_words = 150
        rec_time = 20
        base_task1_rule = """
YÊU CẦU CHUNG IELTS TASK 1:
- Trường 'prompt' CHỈ CHỨA 1-2 CÂU ĐẦU BÀI CHUẨN ĐỀ THI CAMBRIDGE.
- TUYỆT ĐỐI KHÔNG VIẾT TÓM TẮT SỐ LIỆU, ĐÁP ÁN HOẶC PHÂN TÍCH VÀO 'prompt'!
- Toàn bộ dữ liệu BẮT BUỘC ĐƯA VÀO TRƯỜNG 'visual_data'.
"""
        if sub_type == "map":
            sub_type_rule = base_task1_rule + """
YÊU CẦU ĐẶC BIỆT DẠNG BẢN ĐỒ (MAP):
- IELTS Task 1 dạng bản đồ THƯỜNG XUYÊN và BẮT BUỘC có 2 bản đồ so sánh 2 mốc thời gian (Trước & Sau: ví dụ 1990 vs 2020, hoặc Hiện tại vs Kế hoạch quy hoạch tương lai).
- Trường 'prompt' BẮT BUỘC mở đầu bằng: "The two maps show/illustrate [địa điểm/thị trấn/trường học/đảo] in [Năm A] and [Năm B] (hoặc present day and future development plans)... Summarise the information by selecting and reporting the main features, and make comparisons where relevant."
- visual_data BẮT BUỘC có:
  + "type": "map"
  + "title": "Bản đồ quy hoạch [Địa điểm] ([Năm A] so với [Năm B])"
  + "period_a": {"year": "mốc năm A hoặc Hiện tại", "zones": [danh sách 5-7 khu vực/địa điểm chi tiết]}
  + "period_b": {"year": "mốc năm B hoặc Sau quy hoạch", "zones": [danh sách 5-7 khu vực tương ứng]}
  + Mỗi zone trong zones gồm: {"area": "vị trí (Đông/Tây/Nam/Bắc/Trung tâm)", "name": "mô tả chi tiết công trình/khu vực", "status": "new" (xây mới) / "demolished" (phá bỏ) / "expanded" (mở rộng) / "converted" (chuyển đổi công năng) / "unchanged" (giữ nguyên)}.
- Đảm bảo có đầy đủ dữ liệu so sánh cụ thể để học viên có cơ sở viết bài 150+ từ.
"""
        elif sub_type == "process":
            sub_type_rule = base_task1_rule + """
YÊU CẦU ĐẶC BIỆT DẠNG QUY TRÌNH (PROCESS):
- visual_data BẮT BUỘC có type "process" và trường "process_a" chứa "steps" (5-7 bước).
- Mỗi step gồm: {"step": số thứ tự, "title": "tên bước", "desc": "mô tả chi tiết", "icon": "crush/mix/heat/grind/pack"}.
- Đề bài mô tả quy trình sản xuất công nghiệp, tái chế hoặc chu trình sinh học.
"""
        elif sub_type in ["line_graph", "bar_chart", "pie_chart", "table", "mixed"]:
            sub_type_rule = base_task1_rule + f"""
YÊU CẦU ĐẶC BIỆT DẠNG BIỂU ĐỒ ({sub_type}):
- visual_data BẮT BUỘC chứa dữ liệu số liệu cụ thể (3-5 danh mục, 2-4 series số liệu).
- Số liệu phải thực tế, có xu hướng rõ ràng để thí sinh phân tích.
"""
        else:
            sub_type_rule = base_task1_rule
    elif genre == "ielts_task2":
        min_words = 250
        rec_time = 40
        if sub_type == "opinion":
            sub_type_rule = "YÊU CẦU: Dạng 'Agree or Disagree' (To what extent do you agree or disagree?)."
        elif sub_type == "discussion":
            sub_type_rule = "YÊU CẦU: Dạng 'Discuss both views and give your own opinion'."
        elif sub_type == "causes_solutions":
            sub_type_rule = "YÊU CẦU: Dạng 'Causes and Solutions' (What are the causes, and what measures can be taken?)."
        elif sub_type == "advantages_disadvantages":
            sub_type_rule = "YÊU CẦU: Dạng 'Do the advantages outweigh the disadvantages?'."
        elif sub_type == "two_part":
            sub_type_rule = "YÊU CẦU: Dạng 'Two-part Question' (2 câu hỏi trực tiếp)."

    ielts_real_exam_rule = ""
    if language == "en" and genre in ["ielts_task1", "ielts_task2"]:
        ielts_real_exam_rule = """
ĐẶC BIỆT BẮT BUỘC ĐỐI VỚI IELTS TIẾNG ANH:
- Đề bài PHẢI BÁM SÁT 100% ĐỀ THI THẬT IELTS CHÍNH THỨC (Cambridge IELTS Past Examination Papers hoặc IDP/British Council official tests).
- KHÔNG TỰ BỊA RA những câu hỏi không thực tế hoặc xa rời chuẩn đề thi IELTS.
- TUYỆT ĐỐI KHÔNG VIẾT ĐÁP ÁN HOẶC GỢI Ý NỘI DUNG VÀO ĐỀ BÀI. Người dùng cần tự nhìn biểu đồ (Task 1) hoặc tự suy nghĩ luận điểm (Task 2) để viết!
"""

    prompt_instruction = f"""Bạn là một chuyên gia khảo thí ngôn ngữ và giảng viên luyện viết học thuật hàng đầu ({cfg['examiner']}).
Hãy tạo MỘT đề bài luyện viết {area_hint}.
Thể loại: {genre}
Dạng đề: {sub_type or 'tự chọn phù hợp'}
Ngôn ngữ của đề bài: BẮT BUỘC VIẾT TOÀN BỘ BẰNG {lang_name} ({cfg['native']})!

{sub_type_rule}
{ielts_real_exam_rule}

QUY TẮC BẮT BUỘC VỀ ĐỘ DÀI VÀ NỘI DUNG:
- Trường 'prompt' CHỈ CHỨA DUY NHẤT CÂU HỎI ĐẦU BÀI (1-2 câu). TUYỆT ĐỐI KHÔNG KÈM SỐ LIỆU CHI TIẾT, KHÔNG CÓ [Data Summary], KHÔNG CÓ BÀI MẪU HAY ĐÁP ÁN.
- Với Task 1: Bắt buộc cung cấp trường 'visual_data' chứa dữ liệu để hệ thống vẽ biểu đồ cho thí sinh xem.

Trả về kết quả DUY NHẤT định dạng JSON:
{{
  "id": "gen_{genre}_{language}_{sub_type or 'custom'}",
  "title": "Tiêu đề ngắn gọn bằng {lang_name}",
  "prompt": "Chỉ duy nhất nội dung câu hỏi đầu bài bằng {lang_name} (KHÔNG CÓ số liệu tóm tắt, KHÔNG CÓ đáp án)",
  "type": "Tên dạng đề bằng Tiếng Việt hoặc {lang_name}",
  "sub_type": "{sub_type or 'general'}",
  "keywords": ["từ khóa 1", "từ khóa 2", "từ khóa 3", "từ khóa 4", "từ khóa 5"],
  "min_words": {min_words},
  "recommended_time": {rec_time},
  "visual_data": null
}}
"""
    models_to_try = ["gemini-2.5-flash", "gemini-1.5-flash"]
    async with httpx.AsyncClient(timeout=60.0) as client:
        for model_name in models_to_try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
            payload = {
                "contents": [{"parts": [{"text": prompt_instruction}]}],
                "generationConfig": {
                    "responseMimeType": "application/json",
                    "temperature": 0.7
                }
            }
            try:
                resp = await client.post(url, json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    raw_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
                    raw_text = re.sub(r"^```json\s*", "", raw_text)
                    raw_text = re.sub(r"\s*```$", "", raw_text)
                    parsed = json.loads(raw_text)
                    if isinstance(parsed, dict) and "prompt" in parsed and isinstance(parsed["prompt"], str):
                        cleaned = re.split(r"\[Data Summary\]|\[Data\]|Data Summary:", parsed["prompt"], flags=re.IGNORECASE)[0].strip()
                        parsed["prompt"] = cleaned
                    return parsed
            except Exception as e:
                logger.warning(f"Generate prompt failed with {model_name}: {e}")
                continue

    lang_dict = CURATED_PROMPTS_BY_LANG.get(language, CURATED_PROMPTS_BY_LANG["en"])
    prompts = lang_dict.get(genre, lang_dict.get("ielts_task2", []))
    return random.choice(prompts)


async def suggest_structures_impl(
    topic: str,
    language: str = "en",
    target_band: float = 7.0,
    genre: str = "ielts_task2",
    api_key: Optional[str] = None
) -> Dict[str, Any]:
    """Generate tailored collocations, argument patterns and structures specifically for this topic."""
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY chưa được cấu hình trên máy chủ.")

    cfg = LANGUAGES_CONFIG.get(language, LANGUAGES_CONFIG["en"])
    lang_name = cfg["name"]
    examiner = cfg["examiner"]

    prompt_instruction = f"""Bạn là {examiner}.
Nhiệm vụ của bạn là phân tích đề bài luyện viết dưới đây và đề xuất bộ GỢI Ý CỤM TỪ (COLLOCATIONS) & KHUNG CẤU TRÚC CÂU (SENTENCE FRAMES) đắt giá nhất dành cho đề bài này bằng {lang_name}.

ĐỀ BÀI (TOPIC):
\"\"\"{topic}\"\"\"

NGÔN NGỮ BÀI VIẾT: {lang_name} ({language})
THỂ LOẠI: {genre}
MỤC TIÊU BAND: {target_band}

QUY TẮC CỐT LÕI (BẮT BUỘC TUÂN THỦ NGHIÊM NGẶT):
1. TUYỆT ĐỐI KHÔNG ĐƯỢC VIẾT CẢ CÂU HOÀN CHỈNH ĐÃ VIẾT SẴN HẾT NỘI DUNG / NGUYÊN CÂU DÀI 25-40 TỪ.
2. CHỈ CUNG CẤP ĐÚNG 2 LOẠI GỢI Ý:
   - Loại A: "collocation" (Cụm từ đắt giá theo chủ đề): 2 - 5 từ kết hợp tự nhiên.
   - Loại B: "structure" (Khung cấu trúc câu): BẮT BUỘC DÙNG DẤU NGOẶC VUÔNG `[...]` làm chỗ trống.

Hãy đề xuất khoảng 10 đến 14 gợi ý theo "intro", "body", "counter", "conclusion".

TRẢ VỀ DUY NHẤT ĐỊNH DẠNG JSON:
{{
  "topic": "{topic[:150]}",
  "language": "{language}",
  "suggestions": []
}}
"""
    models_to_try = ["gemini-2.5-flash", "gemini-1.5-flash"]
    last_error = None

    async with httpx.AsyncClient(timeout=120.0) as client:
        for model_name in models_to_try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
            payload = {
                "contents": [{"parts": [{"text": prompt_instruction}]}],
                "generationConfig": {
                    "responseMimeType": "application/json",
                    "temperature": 0.4
                }
            }
            try:
                resp = await client.post(url, json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    raw_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
                    raw_text = re.sub(r"^```json\s*", "", raw_text)
                    raw_text = re.sub(r"\s*```$", "", raw_text)
                    parsed = json.loads(raw_text)
                    return parsed
                else:
                    last_error = f"HTTP {resp.status_code}: {resp.text[:200]}"
            except Exception as e:
                last_error = str(e)
                continue

    raise RuntimeError(f"Không thể tạo gợi ý cấu trúc AI: {last_error}")
