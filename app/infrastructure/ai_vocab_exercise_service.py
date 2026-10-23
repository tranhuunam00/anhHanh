"""AI Vocabulary Storytelling and Context Challenge Service.
Generates engaging short stories and interactive cloze challenges using Gemini AI.
"""
import os
import re
import json
import logging
from typing import List, Dict, Any, Optional
import httpx
from dotenv import load_dotenv

load_dotenv(override=True)
logger = logging.getLogger(__name__)


def get_gemini_api_key() -> str:
    """Dynamically get GEMINI_API_KEY from environment or .env, reloading on demand."""
    load_dotenv(override=True)
    return (os.getenv("GEMINI_API_KEY", "") or "").strip()


def build_fallback_story(words_list: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Provide a reliable fallback story structure when AI service is unavailable."""
    extracted_words = [str(w.get("word", "")).strip() for w in words_list if w.get("word")]
    target_words_meta = [
        {"word": w.get("word", ""), "meaning": w.get("meaning", ""), "found_in_story": True}
        for w in words_list[:6]
    ]

    sample_words = ", ".join(extracted_words[:5]) if extracted_words else "curiosity, progress"
    story_en = (
        f"In their pursuit of knowledge, modern explorers realized that {sample_words} "
        "form the cornerstone of meaningful discoveries. Every step forward opened up new horizons, "
        "proving that persistence and dedicated practice always overcome uncertainty."
    )
    story_vi = (
        f"Trong hành trình khám phá tri thức, những nhà thám hiểm hiện đại nhận ra rằng {sample_words} "
        "tạo nên nền tảng của mọi khám phá ý nghĩa. Mỗi bước tiến đều mở ra chân trời mới, "
        "chứng minh rằng sự kiên trì và luyện tập tận tâm luôn vượt qua mọi bấp bênh."
    )

    cloze_questions = []
    for item in words_list[:4]:
        w = str(item.get("word", "")).strip()
        m = str(item.get("meaning", "")).strip()
        if w:
            cloze_questions.append({
                "sentence": f"Every scholar agrees that [ ______ ] is essential for real growth.",
                "correct_word": w,
                "options": [w, "uncertainty", "hesitation", "distraction"],
                "hint": m or w
            })

    return {
        "title": "The Journey of Discovery",
        "story_en": story_en,
        "story_vi": story_vi,
        "target_words": target_words_meta,
        "cloze_questions": cloze_questions,
        "comprehension_question": {
            "question": "What is the key factor emphasized in the passage?",
            "options": [
                "Continuous learning and practice",
                "Giving up when facing difficulties",
                "Avoiding all challenges",
                "Relying solely on sheer luck"
            ],
            "correct_answer": "Continuous learning and practice"
        },
        "comprehension_questions": [
            {
                "question": "What is the key factor emphasized in the passage?",
                "options": [
                    "Continuous learning and practice",
                    "Giving up when facing difficulties",
                    "Avoiding all challenges",
                    "Relying solely on sheer luck"
                ],
                "correct_answer": "Continuous learning and practice",
                "explanation": "Đoạn văn nhấn mạnh sự kiên trì và luyện tập tận tâm luôn vượt qua mọi bấp bênh."
            }
        ]
    }


class AIVocabExerciseService:
    @staticmethod
    async def generate_vocab_story(
        words: List[Dict[str, Any]],
        theme: str = "daily_life",
        level: str = "B1-B2"
    ) -> Dict[str, Any]:
        """Call Gemini to craft a cohesive short story and cloze quiz containing target vocabulary."""
        valid_words = [w for w in words if isinstance(w, dict) and w.get("word")]
        if not valid_words:
            raise ValueError("Danh sách từ vựng không được để trống")

        words_summary = "\n".join([
            f"- {w.get('word')}: {w.get('meaning', '')} ({w.get('part_of_speech', 'word')})"
            for w in valid_words[:15]
        ])

        prompt = f"""Bạn là một chuyên gia ngôn ngữ và tác giả viết truyện ngắn luyện từ vựng tiếng Anh (CEFR {level}).
Nhiệm vụ của bạn là sáng tác một mẩu truyện ngắn (khoảng 120 - 180 từ) cực kỳ tự nhiên, lôi cuốn theo chủ đề '{theme}', lồng ghép khéo léo và chuẩn xác ngữ cảnh các từ vựng mục tiêu sau:

DANH SÁCH TỪ VỰNG MỤC TIÊU:
{words_summary}

YÊU CẦU ĐẦU RA (Output Format):
Bắt buộc trả về đúng định dạng JSON duy nhất (không có markdown code fences hay văn bản thừa), với cấu trúc sau:
{{
  "title": "Tiêu đề tiếng Anh hấp dẫn của câu chuyện",
  "story_en": "Đoạn văn câu chuyện hoàn chỉnh bằng tiếng Anh (120 - 180 từ, lồng ghép các từ vựng trên)",
  "story_vi": "Bản dịch tiếng Việt chuẩn xác, mượt mà và tự nhiên của câu chuyện",
  "target_words": [
    {{ "word": "từ mục tiêu", "meaning": "nghĩa tiếng Việt", "found_in_story": true }}
  ],
  "cloze_questions": [
    {{
      "sentence": "Trích một câu từ câu chuyện và thay từ vựng đó bằng [ ______ ]",
      "correct_word": "từ đúng",
      "options": ["từ đúng", "từ gây nhiễu 1", "từ gây nhiễu 2", "từ gây nhiễu 3"],
      "hint": "Gợi ý nghĩa tiếng Việt"
    }}
  ],
  "comprehension_questions": [
    {{
      "question": "Câu hỏi đọc hiểu bằng tiếng Anh về câu chuyện",
      "options": ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
      "correct_answer": "Đáp án đúng chính xác",
      "explanation": "Giải thích ngắn gọn tại sao chọn đáp án này bằng tiếng Việt"
    }}
  ]
}}
Lưu ý quan trọng:
1. BẮT BUỘC phải lồng ghép đầy đủ tất cả các từ vựng mục tiêu vào story_en một cách tự nhiên. Giữ nguyên dạng từ hoặc biến thể ngữ pháp chuẩn.
2. Tạo từ 3 đến 5 cloze_questions từ chính câu chuyện trên. Các options phải có đúng 4 lựa chọn.
3. Tạo từ 1 đến 2 comprehension_questions kiểm tra khả năng đọc hiểu nội dung câu chuyện.
"""

        api_key = get_gemini_api_key()
        if not api_key:
            logger.warning("GEMINI_API_KEY missing. Falling back to local story generator.")
            return build_fallback_story(valid_words)

        models_to_try = ["gemini-2.5-flash", "gemini-1.5-flash"]
        last_error = None

        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "responseMimeType": "application/json",
                "temperature": 0.4
            }
        }

        async with httpx.AsyncClient(timeout=60.0) as client:
            for model_name in models_to_try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent"
                headers = {"x-goog-api-key": api_key}
                try:
                    response = await client.post(url, json=payload, headers=headers)
                    if response.status_code == 200:
                        res_json = response.json()
                        candidates = res_json.get("candidates", [])
                        if candidates and "content" in candidates[0]:
                            parts = candidates[0]["content"].get("parts", [])
                            if parts and "text" in parts[0]:
                                raw_text = parts[0]["text"].strip()
                                raw_text = re.sub(r"^```(?:json)?\s*", "", raw_text, flags=re.MULTILINE)
                                raw_text = re.sub(r"\s*```$", "", raw_text, flags=re.MULTILINE)
                                parsed_data = json.loads(raw_text)
                                if isinstance(parsed_data, dict) and "story_en" in parsed_data:
                                    comp_list = []
                                    if "comprehension_questions" in parsed_data and isinstance(parsed_data["comprehension_questions"], list):
                                        comp_list = parsed_data["comprehension_questions"]
                                    elif "comprehension_question" in parsed_data and isinstance(parsed_data["comprehension_question"], dict):
                                        comp_list = [parsed_data["comprehension_question"]]
                                    if not comp_list:
                                        comp_list = [{
                                            "question": f"What is the central theme of '{parsed_data.get('title', 'the passage')}'?",
                                            "options": [
                                                "Continuous observation and dedication",
                                                "Giving up when facing difficulties",
                                                "Ignoring environmental impacts",
                                                "Relying solely on coincidence"
                                            ],
                                            "correct_answer": "Continuous observation and dedication",
                                            "explanation": "Câu chuyện nêu bật tinh thần quan sát thực tế và kiên trì học hỏi."
                                        }]
                                    parsed_data["comprehension_questions"] = comp_list
                                    parsed_data["comprehension_question"] = comp_list[0]
                                    return parsed_data
                    else:
                        last_error = f"Gemini API ({model_name}) HTTP {response.status_code}: {response.text}"
                        logger.warning(last_error)
                except Exception as e:
                    last_error = str(e)
                    logger.warning(f"Error calling {model_name} for vocab story: {e}")

        logger.warning(f"Gemini API story generation failed ({last_error}). Using fallback story.")
        return build_fallback_story(valid_words)
