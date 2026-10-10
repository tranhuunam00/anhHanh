"""Vocabulary AI Extraction and Batch Import API Endpoints."""
import logging
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.infrastructure.database.connection import get_db
from app.infrastructure.database.models import User, UserVocabulary
from app.application.auth_service import get_current_user, require_ai_import_permission
from app.infrastructure.image_search_service import ImageSearchService
from app.infrastructure.ai_vocab_service import AIVocabService

from app.presentation.vocab_schemas import (
    AIExtractTextRequest,
    CheckVocabDuplicatesRequest,
    BatchImportVocabRequest,
)
from app.application.vocab_import_service import (
    check_vocabulary_duplicates_data,
    plan_batch_import,
)
from app.application.vocab_file_service import (
    validate_file_extension,
    prepare_file_for_ai_extraction,
    MAX_FILE_BYTES,
    ALLOWED_EXTENSIONS,
)

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post('/ai-extract')
async def ai_extract_vocabulary_from_text(
    payload: AIExtractTextRequest,
    current_user: User = Depends(require_ai_import_permission)
):
    """AI Vocabulary Extraction from raw text or document snippet."""
    try:
        items = await AIVocabService.extract_vocabulary(
            text=payload.text,
            source_lang=payload.source_lang or "en",
            target_lang=payload.target_lang or "vi",
            mode=payload.mode or "auto",
            vocab_level=payload.vocab_level or "intermediate"
        )
        return {
            'success': True,
            'items': items,
            'total': len(items),
            'operator': current_user.email
        }
    except Exception as e:
        logger.error(f"AI Vocabulary extraction error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi AI trích xuất từ vựng: {str(e)}"
        )


@router.post('/extract-text')
async def extract_text_from_file_endpoint(
    file: UploadFile = File(...),
    start_page: Optional[int] = Form(None),
    end_page: Optional[int] = Form(None),
    current_user: User = Depends(require_ai_import_permission)
):
    """Extract raw text from document without invoking AI."""
    filename = file.filename or "uploaded_document"
    if not validate_file_extension(filename):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Định dạng tệp không được hỗ trợ. Vui lòng tải lên tệp: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    try:
        content_bytes = await file.read()
        is_image_file = any(filename.lower().endswith(ext) for ext in (".png", ".jpg", ".jpeg", ".webp"))
        if is_image_file:
            return {
                'success': True,
                'filename': filename,
                'is_image': True,
                'is_scanned': False,
                'text': '',
                'word_count': 0,
                'char_count': 0,
                'message': 'Tệp hình ảnh - sẽ dùng Gemini Vision OCR khi bấm phân tích AI.'
            }

        extracted_text = AIVocabService.extract_text_from_file(
            content_bytes,
            filename,
            start_page=start_page,
            end_page=end_page
        )
        words = extracted_text.split() if extracted_text else []
        return {
            'success': True,
            'filename': filename,
            'is_image': False,
            'is_scanned': False,
            'text': extracted_text or "",
            'word_count': len(words),
            'char_count': len(extracted_text) if extracted_text else 0
        }
    except RuntimeError as re_err:
        err_msg = str(re_err)
        if "không chứa lớp văn bản" in err_msg or "scan" in err_msg.lower():
            return {
                'success': True,
                'filename': filename,
                'is_image': False,
                'is_scanned': True,
                'text': "",
                'word_count': 0,
                'char_count': 0,
                'message': err_msg
            }
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=err_msg)
    except Exception as e:
        logger.error(f"Error in extract_text_from_file_endpoint: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Không thể đọc trích xuất tệp: {str(e)}"
        )


@router.post('/ai-extract-file')
async def ai_extract_vocabulary_from_file(
    file: UploadFile = File(...),
    start_page: Optional[int] = Form(None),
    end_page: Optional[int] = Form(None),
    source_lang: Optional[str] = Form("en"),
    target_lang: Optional[str] = Form("vi"),
    vocab_level: Optional[str] = Form("intermediate"),
    current_user: User = Depends(require_ai_import_permission)
):
    """AI Vocabulary Extraction from file with Gemini Vision OCR support."""
    filename = file.filename or "uploaded_document"
    if not validate_file_extension(filename):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Định dạng tệp không được hỗ trợ. Vui lòng tải lên tệp: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    try:
        content_bytes = await file.read()
        if len(content_bytes) > MAX_FILE_BYTES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Kích thước tệp gửi lên máy chủ vượt quá giới hạn 5MB."
            )

        extracted_text, images = prepare_file_for_ai_extraction(
            content_bytes,
            filename,
            start_page=start_page,
            end_page=end_page
        )

        if not extracted_text and not images:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Không thể đọc nội dung văn bản từ tệp này."
            )

        items = await AIVocabService.extract_vocabulary(
            text=extracted_text or "",
            source_lang=source_lang or "en",
            target_lang=target_lang or "vi",
            mode="auto",
            vocab_level=vocab_level or "intermediate",
            images=images
        )
        return {
            'success': True,
            'filename': filename,
            'source_lang': source_lang or "en",
            'vocab_level': vocab_level or "intermediate",
            'raw_text_length': len(extracted_text) if extracted_text else 0,
            'vision_ocr_used': bool(images),
            'items': items,
            'total': len(items),
            'operator': current_user.email
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"AI file extraction error on '{filename}': {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi xử lý tệp '{filename}': {str(e)}"
        )


@router.post('/check-duplicates')
async def check_vocabulary_duplicates(
    payload: CheckVocabDuplicatesRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Check which words from a candidate list already exist in the user's notebook."""
    raw_words = [w.strip() for w in payload.words if w and w.strip()]
    if not raw_words:
        return {'has_duplicates': False, 'duplicates_count': 0, 'duplicates': []}

    words_lower = list({w.lower() for w in raw_words})
    stmt = select(UserVocabulary).where(
        UserVocabulary.user_id == current_user.id,
        func.lower(UserVocabulary.word).in_(words_lower)
    )
    res = await db.execute(stmt)
    existing_items = res.scalars().all()
    return check_vocabulary_duplicates_data(raw_words, existing_items)


@router.post('/batch-import')
async def batch_import_vocabulary_words(
    payload: BatchImportVocabRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Batch import multiple vocabulary words into user notebook with 3 conflict resolution strategies."""
    if not payload.items:
        raise HTTPException(status_code=400, detail="Danh sách từ vựng rỗng")

    existing_res = await db.execute(
        select(UserVocabulary).where(UserVocabulary.user_id == current_user.id)
    )
    existing_map = {v.word.lower().strip(): v for v in existing_res.scalars().all()}

    plan = plan_batch_import(
        items=payload.items,
        existing_map=existing_map,
        conflict_resolution=payload.conflict_resolution or "skip_existing",
        default_source_lang=payload.source_lang or "en",
        get_phonetic_fn=ImageSearchService.get_word_phonetic
    )

    for upd in plan["to_update"]:
        target = upd["target"]
        target.meaning = upd["meaning"]
        if upd["phonetic"]:
            target.phonetic = upd["phonetic"]
        if upd.get("part_of_speech"):
            target.part_of_speech = upd["part_of_speech"]
        if upd["context_sentence"]:
            target.context_sentence = upd["context_sentence"]
        if upd["image_url"]:
            target.image_url = upd["image_url"]
        if hasattr(target, 'source_lang') and upd["source_lang"]:
            target.source_lang = upd["source_lang"]

    for add_data in plan["to_add"]:
        new_v = UserVocabulary(
            user_id=current_user.id,
            word=add_data["word"],
            phonetic=add_data["phonetic"],
            part_of_speech=add_data.get("part_of_speech"),
            meaning=add_data["meaning"],
            context_sentence=add_data["context_sentence"],
            image_url=add_data["image_url"],
            source_lang=add_data["source_lang"],
            status=add_data["status"],
            next_review_at=add_data["next_review_at"],
            review_interval_days=add_data["review_interval_days"],
            mastery_score=add_data["mastery_score"]
        )
        db.add(new_v)

    await db.commit()

    return {
        'success': True,
        'message': f"Đã lưu thành công: thêm mới {plan['added_count']} từ, cập nhật {plan['updated_count']} từ, bỏ qua {plan['skipped_count']} từ trùng.",
        'added_count': plan['added_count'],
        'updated_count': plan['updated_count'],
        'skipped_count': plan['skipped_count'],
        'conflict_mode': plan['conflict_mode'],
        'total_processed': len(payload.items)
    }
