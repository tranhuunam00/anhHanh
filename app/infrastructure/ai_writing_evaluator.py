"""AI Writing Evaluator using Google Gemini for essay scoring and feedback."""
import re
import json
import logging
from typing import List, Dict, Any, Optional
import httpx
from app.infrastructure.gemini_model_helper import get_candidate_gemini_models
from app.infrastructure.writing_prompts_catalog import LANGUAGES_CONFIG
from app.infrastructure.ai_writing_sentence_splitter import (
    split_essay_into_sentences,
    reconcile_sentence_breakdown,
    get_genre_word_count_limits,
    compute_word_count,
)

logger = logging.getLogger(__name__)


def generate_fallback_sentence_breakdown(content: str, corrections: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Split essay into sequential sentences and evaluate each sentence thoroughly."""
    sentences = split_essay_into_sentences(content)
    return reconcile_sentence_breakdown(sentences, [], corrections, 7.0)


def normalize_vocab_upgrades(vocab_upgrades: Any) -> List[Dict[str, Any]]:
    """Normalize vocab_upgrades to ensure every item has word, phonetic, meaning, replace_for, context_sentence."""
    if not vocab_upgrades or not isinstance(vocab_upgrades, list):
        return []

    normalized = []
    for item in vocab_upgrades:
        if isinstance(item, str):
            clean = item.strip()
            if not clean:
                continue
            parts = re.split(r'[:\-–—]\s*', clean, maxsplit=1)
            word = parts[0].strip().strip('"*`')
            meaning = parts[1].strip() if len(parts) > 1 else ""
            if word:
                normalized.append({
                    "word": word,
                    "phonetic": "",
                    "meaning": meaning,
                    "replace_for": "",
                    "context_sentence": ""
                })
        elif isinstance(item, dict):
            word = str(
                item.get("word")
                or item.get("term")
                or item.get("vocabulary")
                or item.get("vocab")
                or item.get("collocation")
                or item.get("phrase")
                or ""
            ).strip().strip('"*`')
            if not word:
                continue
            meaning = str(
                item.get("meaning")
                or item.get("definition")
                or item.get("vietnamese")
                or item.get("meaning_vi")
                or item.get("explanation")
                or ""
            ).strip()
            phonetic = str(
                item.get("phonetic")
                or item.get("ipa")
                or item.get("pronunciation")
                or ""
            ).strip()
            replace_for = str(
                item.get("replace_for")
                or item.get("original")
                or item.get("replace")
                or item.get("replaces")
                or ""
            ).strip()
            context_sentence = str(
                item.get("context_sentence")
                or item.get("example")
                or item.get("sentence")
                or item.get("context")
                or ""
            ).strip()
            normalized.append({
                "word": word,
                "phonetic": phonetic,
                "meaning": meaning,
                "replace_for": replace_for if replace_for.lower() not in ("none", "null") else "",
                "context_sentence": context_sentence
            })
    return normalized


async def evaluate_writing_impl(
    topic: str,
    content: str,
    genre: str = "ielts_task2",
    target_band: float = 7.0,
    language: str = "en",
    images: Optional[List[str]] = None,
    api_key: Optional[str] = None,
    scoring_only: bool = False
) -> Dict[str, Any]:
    """Grade and thoroughly evaluate a student's writing submission using Gemini AI."""
    word_count = compute_word_count(content)
    if not content or word_count < 15:
        raise ValueError("Bài viết quá ngắn (tối thiểu 15 từ) để AI có thể đánh giá và chấm điểm chính xác.")

    if not api_key:
        raise RuntimeError("GEMINI_API_KEY chưa được cấu hình trên máy chủ.")

    sentences = split_essay_into_sentences(content)
    sentence_count = len(sentences)
    genre_limits = get_genre_word_count_limits(genre)
    min_required_words = genre_limits["min_words"]

    cfg = LANGUAGES_CONFIG.get(language, LANGUAGES_CONFIG["en"])
    lang_name = cfg["name"]
    examiner = cfg["examiner"]
    system_scale = cfg["system"]
    upgrade_target = min(9.0, round((float(target_band) + 0.5) * 2) / 2)

    numbered_sentences_text = "\n".join(
        f"Câu {i}: \"{s}\"" for i, s in enumerate(sentences, 1)
    )

    if scoring_only:
        task_label = "Task 1 (Task Achievement)" if genre == "ielts_task1" else "Task 2 (Task Response)"
        eval_prompt = f"""Bạn là {examiner}.
Nhiệm vụ của bạn là CHẤM ĐIỂM BÀI THI IELTS WRITING ({task_label}) của học viên theo đúng thang điểm chuẩn Cambridge IELTS 0.0 - 9.0 (làm tròn 0.5).
LƯU Ý: Đây là chế độ THI THỬ. Chỉ cần chấm điểm và nhận xét tổng quan 4 tiêu chí.

ĐỀ BÀI (PROMPT):
\"\"\"{topic}\"\"\"

THỂ LOẠI: {genre} | ĐỘ DÀI: {word_count} từ

BÀI VIẾT CỦA HỌC VIÊN:
\"\"\"
{content}
\"\"\"

ĐỊNH DẠNG TRẢ VỀ JSON:
{{
  "overall_score": 6.5,
  "max_score": 9.0,
  "overall_feedback": "Nhận xét tổng quan...",
  "criteria_scores": {{
    "task_response": {{"score": 6.5, "feedback": "Nhận xét tiêu chí..."}},
    "coherence_cohesion": {{"score": 6.5, "feedback": "Nhận xét tiêu chí..."}},
    "lexical_resource": {{"score": 6.5, "feedback": "Nhận xét tiêu chí..."}},
    "grammatical_range_accuracy": {{"score": 6.0, "feedback": "Nhận xét tiêu chí..."}}
  }}
}}
"""
    else:
        # Construct task-specific model essay guidelines
        if genre == "ielts_task1":
            model_essay_req = f"""3. BÀI VIẾT MẪU NÂNG CẤP BAND 8.5+ (model_essay):
   - ĐỘ DÀI BẮT BUỘC: Đạt từ {genre_limits['target_min']} đến {genre_limits['target_max']} từ (TUYỆT ĐỐI KHÔNG ĐƯỢC DƯỚI 150 TỪ).
   - BẮT BUỘC ĐỦ 4 ĐOẠN VĂN HỌC THUẬT CHUẨN MỰC:
     + Đoạn 1 (Introduction): Paraphrase lại đề bài một cách tự nhiên bằng từ vựng C1/C2.
     + Đoạn 2 (Overview): Nêu bật 2-3 xu hướng chính, điểm nổi bật nhất hoặc so sánh tổng quát (không đưa số liệu cụ thể).
     + Đoạn 3 (Body 1): Phân tích chi tiết nhóm số liệu/đối tượng thứ nhất kèm số liệu %, đối chiếu so sánh.
     + Đoạn 4 (Body 2): Phân tích chi tiết nhóm số liệu/đối tượng còn lại kèm so sánh đối chiếu và liên từ mạch lạc.
   - LƯU Ý ĐẶC BIỆT: Dù bài của học viên viết ngắn hoặc thiếu ý, bài mẫu Band 8.5+ VẪN BẮT BUỘC là 1 bài hoàn chỉnh đủ 4 đoạn đạt tối thiểu 160-200 từ."""
        elif genre == "ielts_task2":
            model_essay_req = f"""3. BÀI VIẾT MẪU NÂNG CẤP BAND 8.5+ (model_essay):
   - ĐỘ DÀI BẮT BUỘC: Đạt từ {genre_limits['target_min']} đến {genre_limits['target_max']} từ (TUYỆT ĐỐI KHÔNG ĐƯỢC DƯỚI 250 TỪ).
   - BẮT BUỘC ĐỦ 4 ĐOẠN VĂN:
     + Đoạn 1 (Introduction): Dẫn dắt ngữ cảnh + Thesis statement nêu rõ quan điểm cá nhân.
     + Đoạn 2 (Body 1): Luận điểm 1 sâu sắc + phân tích nguyên nhân + ví dụ thực tế thuyết phục.
     + Đoạn 3 (Body 2): Luận điểm 2 hoặc phản biện + lập luận chặt chẽ + ví dụ minh họa.
     + Đoạn 4 (Conclusion): Khẳng định lại quan điểm bằng cách diễn đạt mới + kết luận tương lai.
   - LƯU Ý ĐẶC BIỆT: Dù học viên viết ngắn, bài mẫu Band 8.5+ VẪN BẮT BUỘC là bài luận hoàn chỉnh đầy đủ luận điểm sâu sắc đạt tối thiểu 270-320 từ."""
        else:
            model_essay_req = f"""3. BÀI VIẾT MẪU NÂNG CẤP BAND 8.5+ (model_essay):
   - ĐỘ DÀI BẮT BUỘC: Đạt từ {genre_limits['target_min']} đến {genre_limits['target_max']} từ (tối thiểu {genre_limits['min_words']} từ).
   - Viết lại ở trình độ Band 8.5 - 9.0 hoàn chỉnh, tự nhiên và học thuật."""

        eval_prompt = f"""Bạn là {examiner}.
Nhiệm vụ của bạn là đánh giá, chấm điểm khách quan, tỉ mỉ và đưa ra nhận xét sửa lỗi chi tiết cho bài viết bằng {lang_name} của học viên dưới đây theo thang điểm {system_scale}.

ĐỀ BÀI (PROMPT):
\"\"\"{topic}\"\"\"

NGÔN NGỮ: {lang_name} ({language}) | THỂ LOẠI: {genre} | MỤC TIÊU: Band {target_band}
ĐỘ DÀI THỰC TẾ: {word_count} từ ({sentence_count} câu)

BÀI VIẾT CỦA HỌC VIÊN:
\"\"\"
{content}
\"\"\"

DANH SÁCH {sentence_count} CÂU TRONG BÀI VIẾT ĐÃ ĐƯỢC ĐÁNH SỐ:
{numbered_sentences_text}

YÊU CẦU CHẤM ĐIỂM & ĐÁNH GIÁ (BẮT BUỘC ĐỦ 5 PHẦN):
1. Chấm điểm theo thang điểm chuẩn IELTS 0.0 - 9.0 (làm tròn đến 0.5):
   - overall_score, task_response, coherence_cohesion, lexical_resource, grammatical_range_accuracy.

2. Danh sách sửa lỗi chi tiết (corrections):
   - Tìm ra TẤT CẢ các lỗi ngữ pháp, chính tả, dùng từ vụng về, câu cồng kềnh trong bài.
   - Mỗi lỗi: "original", "corrected", "type", "explanation".

{model_essay_req}

4. Gợi ý từ vựng & Collocations nâng cấp (vocab_upgrades):
   - Trích xuất 5 đến 8 từ vựng hoặc collocations học thuật cao cấp (C1/C2) phù hợp với bài viết này.
   - Mỗi phần tử có: "word", "phonetic", "meaning", "replace_for", "context_sentence".

5. PHÂN TÍCH VÀ SỬA TỪNG CÂU MỘT (sentence_breakdown):
   - BÀI VIẾT NÀY CÓ CHÍNH XÁC {sentence_count} CÂU ĐÃ ĐƯỢC ĐÁNH SỐ Ở TRÊN.
   - BẠN BẮT BUỘC PHẢI TRẢ VỀ ĐỦ {sentence_count} PHẦN TỬ trong mảng `sentence_breakdown` (từ Câu 1 đến Câu {sentence_count}).
   - TUYỆT ĐỐI KHÔNG ĐƯỢC BỎ SÓT BẤT KỲ CÂU NÀO (KHÔNG ĐƯỢC CHỈ CHẤM 2-3 CÂU ĐẦU RỒI DỪNG LẠI).
   - Với MỖI CÂU:
     + "sentence_num": số thứ tự từ 1 đến {sentence_count}
     + "original": đúng nguyên văn câu của học viên
     + "is_grammar_correct": true nếu đúng ngữ pháp, false nếu có lỗi
     + "grammar_analysis": phân tích chi tiết lỗi sai nếu có, hoặc nhận xét tích cực nếu đúng
     + "grammar_fix": câu đã sửa đúng ngữ pháp
     + "upgrade_needed": true nếu cần nâng cấp học thuật
     + "upgraded_sentence": câu viết lại nâng cấp ở mức Band {upgrade_target:.1f}
     + "upgrade_notes": giải thích từ vựng hoặc cấu trúc nâng cấp
   - QUY TẮC NÂNG CẤP HỌC THUẬT: Chỉ nâng cấp vượt nửa band (+0.5 band) so với mục tiêu Band {target_band} của học viên (mức Band {upgrade_target:.1f}).

ĐỊNH DẠNG TRẢ VỀ JSON DUY NHẤT:
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

    last_error = None

    async with httpx.AsyncClient(timeout=300.0) as client:
        models_to_try = await get_candidate_gemini_models(api_key, client)
        for model_name in models_to_try:
            for api_version in ["v1beta", "v1"]:
                url = f"https://generativelanguage.googleapis.com/{api_version}/models/{model_name}:generateContent"
                headers = {"x-goog-api-key": api_key}
                payload = {
                    "contents": [{"parts": content_parts}],
                    "generationConfig": {
                        "responseMimeType": "application/json",
                        "temperature": 0.2
                    }
                }
                try:
                    logger.info(f"Submitting essay evaluation ({word_count} words, {sentence_count} sentences) to {model_name} ({api_version})...")
                    response = await client.post(url, json=payload, headers=headers)
                    if response.status_code == 200:
                        data = response.json()
                        raw_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
                        raw_text = re.sub(r"^```json\s*", "", raw_text)
                        raw_text = re.sub(r"\s*```$", "", raw_text)

                        parsed = json.loads(raw_text)
                        if scoring_only:
                            parsed.setdefault("sentence_breakdown", [])
                            parsed.setdefault("corrections", [])
                            parsed.setdefault("vocab_upgrades", [])
                        else:
                            # Strict reconciliation guarantees 100% sentence coverage
                            parsed["sentence_breakdown"] = reconcile_sentence_breakdown(
                                sentences=sentences,
                                ai_breakdown=parsed.get("sentence_breakdown"),
                                corrections=parsed.get("corrections"),
                                target_band=target_band
                            )
                            parsed["vocab_upgrades"] = normalize_vocab_upgrades(parsed.get("vocab_upgrades", []))

                        # Attach word count statistics and IELTS compliance
                        model_text = str(parsed.get("model_essay") or "")
                        model_word_count = compute_word_count(model_text)
                        parsed["model_essay_word_count"] = model_word_count
                        parsed["min_required_words"] = min_required_words
                        parsed["student_word_count"] = word_count
                        parsed["student_sentence_count"] = sentence_count
                        parsed["is_under_length"] = word_count < min_required_words
                        if parsed["is_under_length"]:
                            parsed["under_length_message"] = (
                                f"Bài viết của bạn chỉ có {word_count} từ, chưa đạt mức tối thiểu chuẩn "
                                f"{min_required_words} từ của {genre_limits['name']}. Trong bài thi IELTS thật, "
                                f"điều này sẽ bị trừ điểm nặng ở tiêu chí Task Achievement/Task Response."
                            )

                        logger.info(f"Essay successfully evaluated by {model_name}: {len(parsed['sentence_breakdown'])} sentences, model essay {model_word_count} words.")
                        return parsed
                    elif response.status_code == 404:
                        logger.warning(f"Model {model_name} on {api_version} returned HTTP 404: {response.text[:150]}")
                        last_error = f"HTTP {response.status_code}: {response.text[:200]}"
                        continue
                    else:
                        logger.warning(f"Model {model_name} on {api_version} returned HTTP {response.status_code}: {response.text[:200]}")
                        last_error = f"HTTP {response.status_code}: {response.text[:200]}"
                        break
                except Exception as e:
                    logger.warning(f"Error evaluating essay with {model_name} ({api_version}): {e}")
                    last_error = str(e)
                    break

    raise RuntimeError(f"Không thể kết nối hoặc xử lý kết quả với Gemini AI: {last_error}")
