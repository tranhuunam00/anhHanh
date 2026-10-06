"""AI Writing Coach & Evaluation Service using Google Gemini 2.5 Flash.
Provides comprehensive essay grading (IELTS Band 0-9), inline error corrections,
model rewrites, and C1/C2 vocabulary upgrades.
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


CURATED_PROMPTS = {
    "ielts_task2": [
        {
            "id": "t2_1",
            "title": "Artificial Intelligence in Education",
            "prompt": "Some people believe that artificial intelligence will soon replace teachers in the classroom, while others think that human educators will always remain essential. Discuss both views and give your own opinion.",
            "type": "Discussion & Opinion",
            "keywords": ["automated tutoring", "pedagogical empathy", "personalized learning", "digital literacy", "irreplaceable guidance"],
            "min_words": 250,
            "recommended_time": 40
        },
        {
            "id": "t2_2",
            "title": "Environmental Protection vs Economic Growth",
            "prompt": "Many developing countries argue that economic development should take priority over environmental conservation. To what extent do you agree or disagree with this viewpoint?",
            "type": "Agree / Disagree",
            "keywords": ["sustainable development", "ecological degradation", "industrial expansion", "carbon footprint", "renewable transition"],
            "min_words": 250,
            "recommended_time": 40
        },
        {
            "id": "t2_3",
            "title": "Remote Working and Social Isolation",
            "prompt": "An increasing number of employees now work remotely from home rather than in traditional offices. Do the advantages of this trend outweigh the disadvantages?",
            "type": "Advantages & Disadvantages",
            "keywords": ["work-life balance", "geographical flexibility", "telecommuting", "social disconnect", "productivity metrics"],
            "min_words": 250,
            "recommended_time": 40
        },
        {
            "id": "t2_4",
            "title": "Youth Mental Health and Social Media",
            "prompt": "In recent years, anxiety and depression rates among young people have surged drastically. Many attribute this phenomenon to pervasive social media usage. What are the primary causes of this issue, and what feasible solutions can be implemented?",
            "type": "Causes & Solutions",
            "keywords": ["digital addiction", "cyberbullying", "peer validation", "psychological well-being", "screen time regulation"],
            "min_words": 250,
            "recommended_time": 40
        },
        {
            "id": "t2_5",
            "title": "Higher Education vs Vocational Training",
            "prompt": "Some people argue that universities should focus exclusively on providing graduates with practical skills needed for the job market, while others believe academic theoretical knowledge is more crucial. Discuss both views and state your perspective.",
            "type": "Discussion & Opinion",
            "keywords": ["vocational proficiency", "academic rigour", "employability", "theoretical groundwork", "holistic intellect"],
            "min_words": 250,
            "recommended_time": 40
        }
    ],
    "ielts_task1": [
        {
            "id": "t1_1",
            "title": "Renewable Energy Consumption Trends",
            "prompt": "The chart illustrates the percentage of total energy generated from renewable sources (solar, wind, hydroelectric) across four European countries between 2000 and 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
            "type": "Chart & Data Analysis",
            "keywords": ["exponential surge", "marginal decline", "fluctuating pattern", "predominant source", "plateaued"],
            "min_words": 150,
            "recommended_time": 20
        },
        {
            "id": "t1_2",
            "title": "Desalination Water Purification Process",
            "prompt": "The diagram displays the sequential stages involved in converting seawater into potable drinking water via modern reverse osmosis technology. Summarise the key operations and transition steps.",
            "type": "Process Diagram",
            "keywords": ["pretreatment filtration", "semi-permeable membrane", "high-pressure pump", "mineral remineralisation", "effluent brine"],
            "min_words": 150,
            "recommended_time": 20
        }
    ],
    "email": [
        {
            "id": "em_1",
            "title": "Professional Project Delay Notification",
            "prompt": "Write a formal business email to a client explaining that due to unexpected technical roadblocks, the delivery of the web application milestone will be delayed by one week. Offer an apology, explain the mitigation steps, and provide a revised timeline.",
            "type": "Formal Business Communication",
            "keywords": ["unforeseen impediments", "mitigation measures", "revised schedule", "sincere apologies", "quality assurance"],
            "min_words": 120,
            "recommended_time": 15
        },
        {
            "id": "em_2",
            "title": "Job Application Follow-Up Letter",
            "prompt": "You interviewed for a Senior Software Engineer position two weeks ago but have not yet received an update. Write a polite and professional follow-up email inquiring about the status of your application while reaffirming your enthusiasm for the role.",
            "type": "Inquiry & Professional Etiquette",
            "keywords": ["status inquiry", "reiterate enthusiasm", "core competencies", "hiring timeline", "further clarification"],
            "min_words": 120,
            "recommended_time": 15
        }
    ],
    "paragraph": [
        {
            "id": "pa_1",
            "title": "Why Reading Books Daily Improves Cognitive Function",
            "prompt": "Write a concise persuasive paragraph (100 - 150 words) arguing why establishing a daily reading habit enhances mental agility, critical thinking, and emotional empathy.",
            "type": "Short Opinion Paragraph",
            "keywords": ["cognitive stimulation", "analytical acuity", "neuroplasticity", "empathetic perspective"],
            "min_words": 80,
            "recommended_time": 10
        },
        {
            "id": "pa_2",
            "title": "The Impact of Urban Green Spaces",
            "prompt": "Write an explanatory paragraph (100 - 150 words) describing the multifaceted benefits that municipal parks and trees bring to city dwellers' psychological and physical wellness.",
            "type": "Explanatory Paragraph",
            "keywords": ["urban biodiversity", "stress alleviation", "air filtration", "communal cohesion"],
            "min_words": 80,
            "recommended_time": 10
        }
    ],
    "free": [
        {
            "id": "fr_1",
            "title": "Free Topic / Your Choice",
            "prompt": "Write freely about any topic, reflection, story, opinion, or journal entry that interests you today. AI will review grammar, lexical richness, and fluency regardless of length.",
            "type": "Free Writing",
            "keywords": ["spontaneous expression", "fluent narrative", "voice and tone"],
            "min_words": 50,
            "recommended_time": 20
        }
    ]
}


class AIWritingService:
    @classmethod
    def get_prompts_library(cls) -> Dict[str, List[Dict[str, Any]]]:
        """Return the curated library of writing prompts grouped by genre."""
        return CURATED_PROMPTS

    @classmethod
    async def generate_prompt(cls, genre: str, topic_area: Optional[str] = None) -> Dict[str, Any]:
        """Generate a brand new realistic writing prompt using Gemini."""
        api_key = get_gemini_api_key()
        if not api_key:
            # Fallback to random prompt from library
            prompts = CURATED_PROMPTS.get(genre, CURATED_PROMPTS["ielts_task2"])
            import random
            return random.choice(prompts)

        area_hint = f"về chủ đề liên quan đến: {topic_area}" if topic_area else "về một chủ đề thời sự, học thuật hiện đại hoặc đời sống phổ biến"

        prompt_instruction = f"""Bạn là một chuyên gia khảo thí Cambridge và giám khảo IELTS Writing hàng đầu.
Hãy tạo MỘT đề bài luyện viết tiếng Anh mới lạ, chuẩn mực và thực tế {area_hint}.
Thể loại bài viết yêu cầu: {genre} (ielts_task2, ielts_task1, email, paragraph, free).

Trả về kết quả BẮT BUỘC dưới dạng JSON duy nhất với cấu trúc sau:
{{
  "id": "gen_{genre}",
  "title": "Tiêu đề ngắn gọn tiếng Anh",
  "prompt": "Nội dung đề bài chi tiết bằng tiếng Anh chuẩn học thuật",
  "type": "Thể loại bài (ví dụ: Opinion Essay / Discussion / Process / Formal Email)",
  "keywords": ["từ khóa gợi ý 1", "từ khóa gợi ý 2", "từ khóa gợi ý 3", "từ khóa gợi ý 4", "từ khóa gợi ý 5"],
  "min_words": 250,
  "recommended_time": 40
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
                        return parsed
                except Exception as e:
                    logger.warning(f"Generate prompt failed with {model_name}: {e}")
                    continue

        prompts = CURATED_PROMPTS.get(genre, CURATED_PROMPTS["ielts_task2"])
        import random
        return random.choice(prompts)

    @classmethod
    async def evaluate_writing(
        cls,
        topic: str,
        content: str,
        genre: str = "ielts_task2",
        target_band: float = 7.0
    ) -> Dict[str, Any]:
        """Grade and thoroughly evaluate a student's writing submission using Gemini AI."""
        if not content or len(content.strip().split()) < 15:
            raise ValueError("Bài viết quá ngắn (tối thiểu 15 từ) để AI có thể đánh giá và chấm điểm chính xác.")

        api_key = get_gemini_api_key()
        if not api_key:
            raise RuntimeError("GEMINI_API_KEY chưa được cấu hình trên máy chủ.")

        word_count = len(content.strip().split())

        eval_prompt = f"""Bạn là một Giám khảo Khảo thí IELTS Quốc tế kỳ cựu và Chuyên gia Ngôn ngữ học Tiếng Anh cấp cao (Senior IELTS Examiner & Academic Writing Coach).
Nhiệm vụ của bạn là đánh giá, chấm điểm cực kỳ khách quan, tỉ mỉ và đưa ra nhận xét sửa lỗi chi tiết cho bài viết tiếng Anh của học viên dưới đây.

ĐỀ BÀI (PROMPT):
\"\"\"{topic}\"\"\"

THỂ LOẠI (GENRE): {genre} (IELTS Task 2, IELTS Task 1, Business Email, Paragraph, hoặc Free Writing)
MỤC TIÊU BAND ĐIỂM: {target_band}
SỐ TỪ THỰC TẾ: {word_count} từ

BÀI VIẾT CỦA HỌC VIÊN:
\"\"\"
{content}
\"\"\"

YÊU CẦU CHẤM ĐIỂM & ĐÁNH GIÁ:
1. Chấm điểm theo thang điểm chuẩn IELTS 0.0 - 9.0 (làm tròn đến 0.5):
   - overall_score: Điểm tổng kết (ví dụ: 6.5, 7.0, 7.5...).
   - task_response: Điểm và nhận xét mức độ hoàn thành đề bài, luận điểm, dẫn chứng.
   - coherence_cohesion: Điểm và nhận xét mạch lạc, cấu trúc đoạn, từ nối (linking devices).
   - lexical_resource: Điểm và nhận xét vốn từ, collocations, tính tự nhiên, độ đa dạng.
   - grammatical_range_accuracy: Điểm và nhận xét độ đa dạng cấu trúc ngữ pháp và độ chính xác câu.
2. Danh sách sửa lỗi chi tiết (corrections):
   - Tìm ra TẤT CẢ các lỗi ngữ pháp, chính tả, dùng từ vụng về, câu cồng kềnh trong bài.
   - Với mỗi lỗi, chỉ rõ:
     + "original": đoạn văn bản học viên viết
     + "corrected": phương án sửa chuẩn xác, tự nhiên
     + "type": loại lỗi ("grammar", "vocabulary", "spelling", "style", "cohesion")
     + "explanation": giải thích chi tiết bằng TIẾNG VIỆT vì sao sai và cách dùng đúng.
3. Bài viết mẫu viết lại nâng cấp (model_essay):
   - Viết lại toàn bộ bài viết này ở trình độ Band 8.5 - 9.0 (Native Academic / Professional level).
   - Giữ nguyên các ý tưởng và lập luận ban đầu của học viên nhưng diễn đạt lại bằng từ vựng đắt giá, cấu trúc câu đa dạng, mượt mà.
4. Gợi ý từ vựng & Collocations nâng cấp (vocab_upgrades):
   - Trích xuất 5 đến 8 từ vựng hoặc collocations học thuật cao cấp (C1/C2) phù hợp với bài viết này.
   - Mỗi từ gồm:
     + "word": Từ/cụm từ tiếng Anh
     + "meaning": Nghĩa tiếng Việt tự nhiên
     + "phonetic": Phiên âm quốc tế IPA (ví dụ: "/ˌɒb.lɪˈɡeɪ.ʃən/")
     + "replace_for": Cụm từ đơn giản trong bài của học viên mà từ này có thể thay thế (ví dụ: "big problem" -> "grave dilemma")
     + "context_sentence": Câu ví dụ minh họa cách dùng trong ngữ cảnh bài này.

ĐỊNH DẠNG TRẢ VỀ:
BẮT BUỘC là JSON duy nhất (không bọc text giải thích bên ngoài), theo schema:
{{
  "overall_score": 7.0,
  "max_score": 9.0,
  "summary_review": "Nhận xét tổng quan bằng tiếng Việt về ưu điểm và hạn chế cốt lõi của bài viết...",
  "strengths": ["Điểm mạnh 1", "Điểm mạnh 2"],
  "weaknesses": ["Điểm cần khắc phục 1", "Điểm cần khắc phục 2"],
  "criteria_scores": {{
    "task_response": {{
      "score": 7.0,
      "feedback": "Nhận xét chi tiết về Task Achievement/Response bằng tiếng Việt..."
    }},
    "coherence_cohesion": {{
      "score": 6.5,
      "feedback": "Nhận xét chi tiết về Coherence & Cohesion bằng tiếng Việt..."
    }},
    "lexical_resource": {{
      "score": 7.0,
      "feedback": "Nhận xét chi tiết về Lexical Resource bằng tiếng Việt..."
    }},
    "grammatical_range_accuracy": {{
      "score": 7.5,
      "feedback": "Nhận xét chi tiết về Grammar Range & Accuracy bằng tiếng Việt..."
    }}
  }},
  "corrections": [
    {{
      "original": "...",
      "corrected": "...",
      "type": "grammar",
      "explanation": "..."
    }}
  ],
  "model_essay": "Bài viết mẫu hoàn hảo viết lại ở Band 8.5-9.0...",
  "vocab_upgrades": [
    {{
      "word": "...",
      "meaning": "...",
      "phonetic": "...",
      "replace_for": "...",
      "context_sentence": "..."
    }}
  ]
}}
"""
        models_to_try = ["gemini-2.5-flash", "gemini-1.5-flash"]
        last_error = None

        async with httpx.AsyncClient(timeout=300.0) as client:
            for model_name in models_to_try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
                payload = {
                    "contents": [{"parts": [{"text": eval_prompt}]}],
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
                        logger.info(f"Essay successfully evaluated by {model_name}. Overall Score: {parsed.get('overall_score')}")
                        return parsed
                    else:
                        logger.warning(f"Model {model_name} returned HTTP {response.status_code}: {response.text[:200]}")
                        last_error = f"HTTP {response.status_code}: {response.text[:200]}"
                except Exception as e:
                    logger.warning(f"Error evaluating essay with {model_name}: {e}")
                    last_error = str(e)

        raise RuntimeError(f"Không thể kết nối hoặc xử lý kết quả với Gemini AI: {last_error}")
