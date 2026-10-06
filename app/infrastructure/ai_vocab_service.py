"""AI Vocabulary Extraction Service using Google Gemini 2.5 Flash.
Specialized for bilingual vocabulary lists, diplomatic/technical documents, tables, and raw texts.
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

def get_groq_api_key() -> str:
    load_dotenv(override=True)
    return (os.getenv("GROQ_API_KEY", "") or "").strip()


class AIVocabService:
    @staticmethod
    def extract_text_from_file(file_bytes: bytes, filename: str) -> str:
        """Extract plain text from PDF, DOCX, TXT, or Markdown file bytes with multiple engine fallbacks."""
        fname_lower = filename.lower()
        if fname_lower.endswith(".pdf"):
            extracted_pages = []

            # Engine 1: Try PyMuPDF (fitz)
            try:
                import fitz
                doc = fitz.open(stream=file_bytes, filetype="pdf")
                for i in range(len(doc)):
                    p_text = doc[i].get_text()
                    if p_text and p_text.strip():
                        extracted_pages.append(p_text)
                if extracted_pages:
                    return "\n".join(extracted_pages).strip()
            except ImportError:
                logger.debug("PyMuPDF (fitz) is not installed, trying pypdf...")
            except Exception as e:
                logger.warning(f"PyMuPDF extraction failed: {e}")

            # Engine 2: Try pypdf (pure Python fallback)
            try:
                import pypdf
                import io
                reader = pypdf.PdfReader(io.BytesIO(file_bytes))
                for page in reader.pages:
                    p_text = page.extract_text()
                    if p_text and p_text.strip():
                        extracted_pages.append(p_text)
                if extracted_pages:
                    return "\n".join(extracted_pages).strip()
            except ImportError:
                logger.debug("pypdf is not installed, trying pdfminer...")
            except Exception as e:
                logger.warning(f"pypdf extraction failed: {e}")

            # Engine 3: Try pdfminer.six
            try:
                import pdfminer.high_level
                import io
                text = pdfminer.high_level.extract_text(io.BytesIO(file_bytes))
                if text and text.strip():
                    return text.strip()
            except ImportError:
                pass
            except Exception as e:
                logger.warning(f"pdfminer extraction failed: {e}")

            if not extracted_pages:
                raise RuntimeError(
                    "Máy chủ chưa cài thư viện đọc PDF (PyMuPDF hoặc pypdf). "
                    "Vui lòng cài 'pip install pypdf PyMuPDF' trên máy chủ hoặc dán trực tiếp nội dung văn bản vào ô Dán Văn Bản."
                )

        elif fname_lower.endswith(".docx"):
            try:
                import docx
                import io
                doc = docx.Document(io.BytesIO(file_bytes))
                lines = [p.text for p in doc.paragraphs if p.text.strip()]
                for table in doc.tables:
                    for row in table.rows:
                        row_text = " | ".join([cell.text.strip() for cell in row.cells if cell.text.strip()])
                        if row_text:
                            lines.append(row_text)
                return "\n".join(lines).strip()
            except ImportError:
                raise RuntimeError(
                    "Máy chủ chưa cài thư viện đọc Word (python-docx). "
                    "Vui lòng cài 'pip install python-docx' trên máy chủ hoặc dán trực tiếp nội dung văn bản vào ô Dán Văn Bản."
                )
        
        else:
            # Assume text/markdown/csv
            for enc in ["utf-8", "utf-16", "cp1252", "latin-1"]:
                try:
                    return file_bytes.decode(enc).strip()
                except UnicodeDecodeError:
                    continue
            return file_bytes.decode("utf-8", errors="replace").strip()

    @classmethod
    async def extract_vocabulary(
        cls,
        text: str,
        source_lang: str = "en",
        target_lang: str = "vi",
        mode: str = "auto"
    ) -> List[Dict[str, Any]]:
        """Call Gemini to extract, normalize, and enrich vocabulary pairs from ANY document text (up to 5,000 words)."""
        if not text or not text.strip():
            return []

        # Enforce maximum 5,000 words limit
        words = text.strip().split()
        if len(words) > 5000:
            cleaned_input = " ".join(words[:5000])
            logger.info(f"Input text exceeded 5,000 words ({len(words)} words). Truncated to first 5,000 words.")
        else:
            cleaned_input = text.strip()

        prompt = f"""Bạn là một chuyên gia ngôn ngữ học và giảng dạy tiếng Anh thông minh hàng đầu.
Nhiệm vụ của bạn là đọc và phân tích KỸ LƯỠNG BẤT KỲ văn bản nào dưới đây (bài báo tin tức, truyện ngắn, đoạn văn học thuật IELTS/TOEIC, hội thoại giao tiếp, văn bản kỹ thuật/công nghệ, thư từ, ghi chú, danh sách từ vựng song ngữ, hoặc tài liệu chuyên ngành bất kỳ - tối đa 5.000 từ).

Hãy tự động nhận diện và trích xuất TOÀN BỘ các từ vựng quan trọng, cụm từ đắt giá (phrasal verbs, collocations, idioms), cấu trúc câu hay, và thuật ngữ hữu ích cho người học.

Yêu cầu bóc tách chi tiết:
1. Áp dụng linh hoạt cho MỌI thể loại văn bản:
   - Nếu là đoạn văn bản tự do (báo, truyện, bài đọc): Chọn lọc các từ vựng cốt lõi, từ vựng nâng cao (B1-C2), phrasal verbs và collocations xuất hiện trong bài.
   - Nếu là danh sách từ vựng/bảng song ngữ: Tách chính xác từng cặp từ tiếng Anh và nghĩa tiếng Việt tương ứng.
2. Tách rõ ràng từng mục:
   - "word": Từ hoặc cụm từ TIẾNG ANH chuẩn (nguyên thể hoặc theo cụm tự nhiên, bỏ số thứ tự).
   - "meaning": Nghĩa TIẾNG VIỆT chính xác, tự nhiên, sát ngữ cảnh của bài.
   - "phonetic": Phiên âm quốc tế IPA chuẩn của từ/cụm từ (ví dụ: "/ˈpræk.tɪs/").
   - "part_of_speech": Loại từ (noun, verb, adjective, adverb, phrasal verb, idiom, phrase...).
   - "context_sentence": Câu ví dụ trích trực tiếp từ văn bản đầu vào (hoặc câu ví dụ tự nhiên minh họa cách dùng từ này).
3. Loại bỏ các từ quá cơ bản không cần học (như "the", "a", "an", "is", "of" đứng riêng rẽ).
4. Định dạng trả về BẮT BUỘC là JSON Array thuần túy chứa danh sách các object, ví dụ:
[
  {{
    "word": "artificial intelligence",
    "meaning": "trí tuệ nhân tạo",
    "phonetic": "/ˌɑː.tɪ.fɪʃ.əl ɪnˈtel.ɪ.dʒəns/",
    "part_of_speech": "noun phrase",
    "context_sentence": "Artificial intelligence is transforming education and modern industries."
  }}
]

VĂN BẢN ĐẦU VÀO:
\"\"\"
{cleaned_input}
\"\"\"
"""
        api_key = get_gemini_api_key()
        if not api_key:
            raise RuntimeError("GEMINI_API_KEY chưa được cấu hình trên máy chủ.")

        models_to_try = ["gemini-2.5-flash", "gemini-1.5-flash"]
        last_error = None

        async with httpx.AsyncClient(timeout=300.0) as client:
            for model_name in models_to_try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
                payload = {
                    "contents": [{"parts": [{"text": prompt}]}],
                    "generationConfig": {
                        "responseMimeType": "application/json",
                        "temperature": 0.2
                    }
                }
                try:
                    response = await client.post(url, json=payload)
                    if response.status_code == 200:
                        res_json = response.json()
                        candidates = res_json.get("candidates", [])
                        if candidates and "content" in candidates[0]:
                            parts = candidates[0]["content"].get("parts", [])
                            if parts and "text" in parts[0]:
                                raw_text = parts[0]["text"].strip()
                                # Clean markdown code fences if present
                                raw_text = re.sub(r"^```(?:json)?\s*", "", raw_text, flags=re.MULTILINE)
                                raw_text = re.sub(r"\s*```$", "", raw_text, flags=re.MULTILINE)
                                parsed_list = json.loads(raw_text)
                                if isinstance(parsed_list, list):
                                    # Normalize each item
                                    results = []
                                    seen_words = set()
                                    for item in parsed_list:
                                        if not isinstance(item, dict):
                                            continue
                                        w = str(item.get("word", "")).strip()
                                        m = str(item.get("meaning", "")).strip()
                                        if not w:
                                            continue
                                        if w.lower() in seen_words:
                                            continue
                                        seen_words.add(w.lower())
                                        results.append({
                                            "word": w,
                                            "meaning": m or w,
                                            "phonetic": str(item.get("phonetic", "")).strip() or None,
                                            "part_of_speech": str(item.get("part_of_speech", "phrase")).strip(),
                                            "context_sentence": str(item.get("context_sentence", "")).strip()
                                        })
                                    return results
                    else:
                        last_error = f"Gemini API ({model_name}) error HTTP {response.status_code}: {response.text}"
                        logger.warning(last_error)
                except Exception as e:
                    last_error = str(e)
                    logger.warning(f"Error calling {model_name}: {e}")

        raise RuntimeError(f"Không thể kết nối hoặc bóc tách từ AI: {last_error}")
