"""Audio & Phonology Studio API Router.
Completely isolated endpoints for:
- Custom audio upload and Groq Whisper-large-v3 Speech-to-Text
- Sentence-level & word-level timestamp segmentation
- Phonology & Connected Speech breakdown (Linking, Glides, Elision, Assimilation, Weak Forms)
- Audio streaming for seamless playback and segment looping
"""
import os
import uuid
import logging
from typing import Optional, List, Dict, Any
from pathlib import Path
from pydantic import BaseModel, Field
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends, Request
from fastapi.responses import StreamingResponse, FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.infrastructure.database.connection import get_db
from app.infrastructure.database.models import DictionaryWord
from app.infrastructure.groq_whisper_service import GroqWhisperService
from app.infrastructure.phonology_engine import PhonologyEngine

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/audio-studio", tags=["Audio Studio"])

# Directory to store uploaded audio files
AUDIO_UPLOAD_DIR = Path("data/uploads/audio")
AUDIO_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_EXTENSIONS = {".mp3", ".wav", ".m4a", ".ogg", ".webm", ".flac", ".aac"}
whisper_service = GroqWhisperService()
phonology_engine = PhonologyEngine()


class TextAnalyzeRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=1000, description="Đoạn văn hoặc câu tiếng Anh cần phân tích")


async def _fetch_word_ipas_from_db(db: AsyncSession, words: List[str]) -> Dict[str, str]:
    """Batch fetch IPA transcriptions from dictionary_words database table."""
    clean_words = list(set(w.lower().strip("'\".,!?") for w in words if w.strip()))
    if not clean_words:
        return {}

    stmt = select(DictionaryWord.word, DictionaryWord.ipa, DictionaryWord.ipa_uk, DictionaryWord.ipa_us).where(
        DictionaryWord.word.in_(clean_words)
    )
    res = await db.execute(stmt)
    rows = res.all()

    ipa_dict = {}
    for word, ipa, ipa_uk, ipa_us in rows:
        chosen_ipa = ipa_us or ipa_uk or ipa or ""
        if chosen_ipa:
            ipa_dict[word] = chosen_ipa
    return ipa_dict


@router.post("/transcribe")
async def transcribe_and_analyze_audio(
    audio_file: UploadFile = File(...),
    language: Optional[str] = Form("en"),
    prompt: Optional[str] = Form(None),
    db: AsyncSession = Depends(get_db),
):
    """Upload an audio file (mp3, wav, m4a, etc.), transcribe it via Groq Whisper-large-v3,
    and generate a rich Connected Speech & Phonology breakdown for every sentence.
    """
    if not whisper_service.is_configured():
        raise HTTPException(
            status_code=500,
            detail="GROQ_API_KEY chưa được cấu hình trên máy chủ. Vui lòng thêm GROQ_API_KEY vào .env!",
        )

    # 1. Validate File Extension
    original_filename = audio_file.filename or "audio.mp3"
    ext = os.path.splitext(original_filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Định dạng file không được hỗ trợ ({ext}). Chỉ chấp nhận: {', '.join(sorted(ALLOWED_EXTENSIONS))}",
        )

    # 2. Read Audio Bytes
    try:
        audio_bytes = await audio_file.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Không thể đọc file audio: {str(e)}")

    if not audio_bytes:
        raise HTTPException(status_code=400, detail="File tải lên rỗng (0 bytes).")

    # 3. Save to local storage
    file_id = f"audio_{uuid.uuid4().hex[:12]}"
    saved_filename = f"{file_id}{ext}"
    saved_path = AUDIO_UPLOAD_DIR / saved_filename

    try:
        with open(saved_path, "wb") as f:
            f.write(audio_bytes)
    except Exception as e:
        logger.error(f"Failed to save audio file to {saved_path}: {e}")
        raise HTTPException(status_code=500, detail="Lỗi khi lưu trữ file âm thanh trên máy chủ.")

    # 4. Transcribe via Groq Whisper-large-v3
    try:
        stt_result = await whisper_service.transcribe(
            audio_bytes=audio_bytes,
            filename=original_filename,
            language=language or "en",
            prompt=prompt,
        )
    except Exception as e:
        logger.error(f"Groq Whisper transcription failed: {e}")
        raise HTTPException(status_code=502, detail=f"Lỗi nhận diện âm thanh từ AI: {str(e)}")

    # 5. Extract all unique words across segments to query dictionary_words in 1 DB query
    all_words = []
    for seg in stt_result.get("segments", []):
        all_words.extend(seg.get("text", "").split())

    ipa_dict = await _fetch_word_ipas_from_db(db, all_words)

    # 6. Analyze Phonological Processes for each segment
    analyzed_segments = []
    for seg in stt_result.get("segments", []):
        text = seg.get("text", "")
        phonology_data = phonology_engine.analyze_sentence(text, ipa_dict=ipa_dict)
        
        analyzed_segments.append({
            "id": seg["id"],
            "position": seg["position"],
            "start": seg["start"],
            "end": seg["end"],
            "duration": seg["duration"],
            "text": text,
            "words": seg.get("words", []),
            "phonology": phonology_data,
        })

    return {
        "success": True,
        "audio_id": file_id,
        "audio_url": f"/api/audio-studio/stream/{saved_filename}",
        "filename": original_filename,
        "duration": stt_result.get("duration", 0.0),
        "full_text": stt_result.get("full_text", ""),
        "total_sentences": len(analyzed_segments),
        "segments": analyzed_segments,
    }


@router.get("/stream/{filename}")
async def stream_audio_file(filename: str, request: Request):
    """Streams local audio files with HTTP 206 Range support for audio scrubbing & looping."""
    # Prevent directory traversal
    safe_name = os.path.basename(filename)
    file_path = AUDIO_UPLOAD_DIR / safe_name

    if not file_path.is_file():
        raise HTTPException(status_code=404, detail="Không tìm thấy file audio trên máy chủ.")

    file_size = file_path.stat().st_size
    range_header = request.headers.get("range")

    ext = file_path.suffix.lower()
    media_types = {
        ".mp3": "audio/mpeg",
        ".wav": "audio/wav",
        ".m4a": "audio/m4a",
        ".ogg": "audio/ogg",
        ".webm": "audio/webm",
        ".flac": "audio/flac",
    }
    media_type = media_types.get(ext, "audio/mpeg")

    if not range_header:
        return FileResponse(file_path, media_type=media_type)

    # Parse byte range header
    try:
        range_value = range_header.strip().lower().replace("bytes=", "")
        start_str, end_str = range_value.split("-")
        start = int(start_str) if start_str else 0
        end = int(end_str) if end_str else file_size - 1
        end = min(end, file_size - 1)
        content_length = end - start + 1

        def iterfile():
            with open(file_path, "rb") as f:
                f.seek(start)
                bytes_left = content_length
                chunk_size = 64 * 1024
                while bytes_left > 0:
                    read_size = min(chunk_size, bytes_left)
                    data = f.read(read_size)
                    if not data:
                        break
                    bytes_left -= len(data)
                    yield data

        headers = {
            "Content-Range": f"bytes {start}-{end}/{file_size}",
            "Accept-Ranges": "bytes",
            "Content-Length": str(content_length),
            "Content-Type": media_type,
        }
        return StreamingResponse(iterfile(), status_code=206, headers=headers)
    except Exception as e:
        logger.warning(f"Error handling Range request for {filename}: {e}")
        return FileResponse(file_path, media_type=media_type)


@router.post("/analyze-text")
async def analyze_text_phonology(
    body: TextAnalyzeRequest,
    db: AsyncSession = Depends(get_db),
):
    """Directly analyze any English sentence for connected speech & phonology rules."""
    text = body.text.strip()
    words = text.split()
    ipa_dict = await _fetch_word_ipas_from_db(db, words)
    breakdown = phonology_engine.analyze_sentence(text, ipa_dict=ipa_dict)
    return {
        "success": True,
        "text": text,
        "breakdown": breakdown,
    }


@router.get("/samples")
def get_sample_phrases():
    """Returns curated conversational examples demonstrating various connected speech phenomena."""
    return [
        {
            "id": "sample-1",
            "title": "Nối âm Phụ âm - Nguyên âm (C-V Linking)",
            "text": "I picked it up and put it on the table.",
            "highlight": "picked‿it‿up / put‿it‿on",
            "category": "Linking",
        },
        {
            "id": "sample-2",
            "title": "Biến âm kết hợp (Coalescent Assimilation)",
            "text": "Did you know that I want you to meet your friend?",
            "highlight": "did you ➔ did-joo / want you ➔ wan-choo",
            "category": "Assimilation",
        },
        {
            "id": "sample-3",
            "title": "Nuốt âm giữa các phụ âm (Elision /t, d/)",
            "text": "Last night we walked past next door.",
            "highlight": "last' night / next' door",
            "category": "Elision",
        },
        {
            "id": "sample-4",
            "title": "Âm lướt nguyên âm (V-V Glides /w/ & /j/)",
            "text": "Go out and see it for yourself.",
            "highlight": "go ᵂ out / see ᴶ it",
            "category": "Glides",
        },
        {
            "id": "sample-5",
            "title": "Dạng giảm âm yếu (Weak Forms Schwa /ə/)",
            "text": "I can go to the market for some fruit and bread.",
            "highlight": "can /kən/ - to /tə/ - for /fər/ - and /ən/",
            "category": "Weak Forms",
        },
    ]
