"""AI Writing Evaluator using Google Gemini for essay scoring and feedback."""
import re
import json
import logging
from typing import List, Dict, Any, Optional
import httpx
from app.infrastructure.writing_prompts_catalog import LANGUAGES_CONFIG

logger = logging.getLogger(__name__)


def generate_fallback_sentence_breakdown(content: str, corrections: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Split essay into sequential sentences and evaluate each sentence thoroughly."""
    raw_sentences = re.split(r'(?<=[.!?])\s+', content.strip())
    breakdown = []
    for idx, s in enumerate(raw_sentences, 1):
        s_clean = s.strip()
        if not s_clean:
            continue
        matching_corr = next((c for c in corrections if c.get("original") and c["original"] in s_clean), None)
        if matching_corr:
            orig_err = matching_corr.get("original", "")
            fixed_snippet = matching_corr.get("corrected", "")
            fixed_s = s_clean.replace(orig_err, fixed_snippet) if orig_err else s_clean
            breakdown.append({
                "sentence_num": idx,
                "original": s_clean,
                "is_grammar_correct": False,
                "grammar_analysis": f"Lỗi ở cụm '{orig_err}': {matching_corr.get('explanation', 'Lỗi ngữ pháp cần chỉnh sửa.')}",
                "grammar_fix": fixed_s,
                "upgrade_needed": True,
                "upgraded_sentence": fixed_s,
                "upgrade_notes": "Sửa đúng ngữ pháp cơ bản trước, sau đó có thể nâng cấp cấu trúc học thuật."
            })
        else:
            breakdown.append({
                "sentence_num": idx,
                "original": s_clean,
                "is_grammar_correct": True,
                "grammar_analysis": "Đúng hoàn toàn về mặt ngữ pháp rồi.",
                "grammar_fix": s_clean,
                "upgrade_needed": False,
                "upgraded_sentence": s_clean,
                "upgrade_notes": "Câu đã tự nhiên, gãy gọn, không cần bổ sung."
            })
    return breakdown


async def evaluate_writing_impl(
    topic: str,
    content: str,
    genre: str = "ielts_task2",
    target_band: float = 7.0,
    language: str = "en",
    images: Optional[List[str]] = None,
    api_key: Optional[str] = None
) -> Dict[str, Any]:
    """Grade and thoroughly evaluate a student's writing submission using Gemini AI."""
    if not content or len(content.strip().split()) < 15:
        raise ValueError("Bài viết quá ngắn (tối thiểu 15 từ) để AI có thể đánh giá và chấm điểm chính xác.")

    if not api_key:
        raise RuntimeError("GEMINI_API_KEY chưa được cấu hình trên máy chủ.")

    word_count = len(content.strip().split())
    cfg = LANGUAGES_CONFIG.get(language, LANGUAGES_CONFIG["en"])
    lang_name = cfg["name"]
    examiner = cfg["examiner"]
    system_scale = cfg["system"]

    eval_prompt = f"""Bạn là {examiner}.
Nhiệm vụ của bạn là đánh giá, chấm điểm cực kỳ khách quan, tỉ mỉ và đưa ra nhận xét sửa lỗi chi tiết cho bài viết bằng {lang_name} của học viên dưới đây theo thang điểm {system_scale}.

ĐỀ BÀI (PROMPT):
\"\"\"{topic}\"\"\"

NGÔN NGỮ BÀI VIẾT: {lang_name} ({language})
THỂ LOẠI (GENRE): {genre} (ielts_task2, ielts_task1, email, paragraph, hoặc free)
MỤC TIÊU BAND / ĐIỂM: {target_band}
ĐỘ DÀI THỰC TẾ: {word_count} từ/ký tự

BÀI VIẾT CỦA HỌC VIÊN:
\"\"\"
{content}
\"\"\"

YÊU CẦU CHẤM ĐIỂM & ĐÁNH GIÁ (BẮT BUỘC ĐỦ 5 PHẦN):
1. Chấm điểm theo thang điểm chuẩn IELTS 0.0 - 9.0 (làm tròn đến 0.5):
   - overall_score: Điểm tổng kết (ví dụ: 6.5, 7.0, 7.5...).
   - task_response: Điểm và nhận xét mức độ hoàn thành đề bài, luận điểm, dẫn chứng.
   - coherence_cohesion: Điểm và nhận xét mạch lạc, cấu trúc đoạn, từ nối (linking devices).
   - lexical_resource: Điểm và nhận xét vốn từ, collocations, tính tự nhiên, độ đa dạng.
   - grammatical_range_accuracy: Điểm và nhận xét độ đa dạng cấu trúc ngữ pháp và độ chính xác câu.

2. Danh sách sửa lỗi chi tiết (corrections):
   - Tìm ra TẤT CẢ các lỗi ngữ pháp, chính tả, dùng từ vụng về, câu cồng kềnh trong bài.
   - Với mỗi lỗi: "original", "corrected", "type", "explanation".

3. Bài viết mẫu viết lại nâng cấp (model_essay):
   - Viết lại toàn bộ bài viết này ở trình độ Band 8.5 - 9.0 (Native Academic / Professional level).

4. Gợi ý từ vựng & Collocations nâng cấp (vocab_upgrades):
   - Trích xuất 5 đến 8 từ vựng hoặc collocations học thuật cao cấp (C1/C2) phù hợp với bài viết này.

5. PHÂN TÍCH VÀ SỬA TỪNG CÂU MỘT (sentence_breakdown):
   - Chia toàn bộ bài viết của học viên thành danh sách tuần tự TỪNG CÂU MỘT.
   - Với MỖI CÂU: sentence_num, original, is_grammar_correct, grammar_analysis, grammar_fix, upgrade_needed, upgraded_sentence, upgrade_notes.

ĐỊNH DẠNG TRẢ VỀ:
BẮT BUỘC là JSON duy nhất:
{{
  "overall_score": 7.0,
  "max_score": 9.0,
  "summary_review": "Nhận xét tổng quan...",
  "strengths": ["Điểm mạnh 1"],
  "weaknesses": ["Điểm cần khắc phục 1"],
  "criteria_scores": {{
    "task_response": {{"score": 7.0, "feedback": "..."}},
    "coherence_cohesion": {{"score": 6.5, "feedback": "..."}},
    "lexical_resource": {{"score": 7.0, "feedback": "..."}},
    "grammatical_range_accuracy": {{"score": 7.5, "feedback": "..."}}
  }},
  "corrections": [],
  "sentence_breakdown": [],
  "model_essay": "...",
  "vocab_upgrades": []
}}
"""
    if images and len(images) > 0:
        eval_prompt += """
LƯU Ý ĐẶC BIỆT VỀ HÌNH ẢNH ĐỀ BÀI ĐÍNH KÈM:
- Học viên ĐÃ ĐÍNH KÈM HÌNH ẢNH ĐỀ BÀI.
- BẠN BẮT BUỘC PHẢI QUAN SÁT KỸ HÌNH ẢNH ĐƯỢC GỬI KÈM để chấm Task Response / Task Achievement chính xác 100%.
"""

    content_parts = [{"text": eval_prompt}]
    if images and len(images) > 0:
        for img_item in images:
            if isinstance(img_item, str) and img_item.startswith("data:"):
                try:
                    header, b64_str = img_item.split(",", 1)
                    mime_type = header.split(";")[0].replace("data:", "").strip()
                    content_parts.append({
                        "inline_data": {
                            "mime_type": mime_type,
                            "data": b64_str.strip()
                        }
                    })
                except Exception as parse_ex:
                    logger.warning(f"Failed to parse base64 image part: {parse_ex}")

    models_to_try = ["gemini-2.5-flash", "gemini-1.5-flash"]
    last_error = None

    async with httpx.AsyncClient(timeout=300.0) as client:
        for model_name in models_to_try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
            payload = {
                "contents": [{"parts": content_parts}],
                "generationConfig": {
                    "responseMimeType": "application/json",
                    "temperature": 0.2
                }
            }
            try:
                logger.info(f"Submitting essay evaluation ({word_count} words) to {model_name}...")
                response = await client.post(url, json=payload)
                if response.status_code == 200:
                    data = response.json()
                    raw_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
                    raw_text = re.sub(r"^```json\s*", "", raw_text)
                    raw_text = re.sub(r"\s*```$", "", raw_text)

                    parsed = json.loads(raw_text)
                    if "sentence_breakdown" not in parsed or not isinstance(parsed["sentence_breakdown"], list):
                        parsed["sentence_breakdown"] = generate_fallback_sentence_breakdown(content, parsed.get("corrections", []))

                    logger.info(f"Essay successfully evaluated by {model_name}.")
                    return parsed
                else:
                    logger.warning(f"Model {model_name} returned HTTP {response.status_code}: {response.text[:200]}")
                    last_error = f"HTTP {response.status_code}: {response.text[:200]}"
            except Exception as e:
                logger.warning(f"Error evaluating essay with {model_name}: {e}")
                last_error = str(e)

    raise RuntimeError(f"Không thể kết nối hoặc xử lý kết quả với Gemini AI: {last_error}")
