"""File extraction and image preprocessing service for document AI parsing."""
import logging
from typing import Tuple, List, Optional
from app.infrastructure.ai_vocab_service import AIVocabService

logger = logging.getLogger(__name__)

ALLOWED_EXTENSIONS = (".pdf", ".docx", ".txt", ".md", ".csv", ".png", ".jpg", ".jpeg", ".webp")
MAX_FILE_BYTES = 5 * 1024 * 1024  # 5MB


def validate_file_extension(filename: str) -> bool:
    """Check if uploaded file has an allowed extension."""
    return any(filename.lower().endswith(ext) for ext in ALLOWED_EXTENSIONS)


def prepare_file_for_ai_extraction(
    content_bytes: bytes,
    filename: str,
    start_page: Optional[int] = None,
    end_page: Optional[int] = None
) -> Tuple[Optional[str], List[bytes]]:
    """Extract text from file or convert scanned pages/images into image byte streams for Gemini Vision OCR."""
    is_image_file = any(filename.lower().endswith(ext) for ext in (".png", ".jpg", ".jpeg", ".webp"))
    is_pdf_file = filename.lower().endswith(".pdf")

    if is_image_file:
        return None, [content_bytes]

    extracted_text: Optional[str] = None
    images: List[bytes] = []

    if is_pdf_file:
        try:
            extracted_text = AIVocabService.extract_text_from_file(
                content_bytes,
                filename,
                start_page=start_page,
                end_page=end_page
            )
        except Exception as ex:
            logger.info(f"Standard PDF text extraction notice ({ex}). Will attempt fallback to Gemini Vision OCR.")
            extracted_text = None

        if not extracted_text or not extracted_text.strip():
            try:
                import fitz
                doc = fitz.open(stream=content_bytes, filetype="pdf")
                total_p = len(doc)
                s_idx = max(0, (start_page - 1) if (start_page and start_page > 0) else 0)
                e_idx = min(total_p, end_page if (end_page and end_page > 0) else total_p)
                if s_idx >= total_p:
                    s_idx = 0
                for i in range(s_idx, min(s_idx + 5, e_idx)):
                    pix = doc[i].get_pixmap(dpi=150)
                    images.append(pix.tobytes("jpeg"))
                logger.info(f"Rendered {len(images)} PDF page(s) to images for Gemini Vision OCR.")
            except Exception as render_err:
                logger.warning(f"Failed to render scanned PDF page(s) for Vision OCR: {render_err}")
    else:
        extracted_text = AIVocabService.extract_text_from_file(
            content_bytes,
            filename,
            start_page=start_page,
            end_page=end_page
        )

    return extracted_text, images
