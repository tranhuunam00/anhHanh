"""Pydantic request and response schemas for Vocabulary endpoints."""
from typing import Optional, List
from pydantic import BaseModel, Field


class CreateVocabRequest(BaseModel):
    word: str = Field(..., min_length=1, max_length=100)
    context_sentence: Optional[str] = ""
    meaning: Optional[str] = None
    phonetic: Optional[str] = None
    image_url: Optional[str] = None
    video_id: Optional[str] = None
    video_timestamp: Optional[float] = None
    timestamp: Optional[float] = None
    source_lang: Optional[str] = "en"
    target_lang: Optional[str] = "vi"

    @property
    def effective_timestamp(self) -> Optional[float]:
        if self.video_timestamp is not None:
            return self.video_timestamp
        return self.timestamp


class UpdateStatusRequest(BaseModel):
    status: str = Field(..., pattern='^(NEW|LEARNING|MASTERED)$')


class UpdateImageRequest(BaseModel):
    image_url: str


class UpdateVocabDetailsRequest(BaseModel):
    word: Optional[str] = None
    meaning: Optional[str] = None
    phonetic: Optional[str] = None
    image_url: Optional[str] = None
    context_sentence: Optional[str] = None
    status: Optional[str] = None


class ReviewResultRequest(BaseModel):
    vocab_id: str
    is_correct: bool


class AIExtractTextRequest(BaseModel):
    text: str = Field(..., min_length=2)
    source_lang: Optional[str] = "en"
    target_lang: Optional[str] = "vi"
    mode: Optional[str] = "auto"
    vocab_level: Optional[str] = "intermediate"


class BatchImportVocabItem(BaseModel):
    word: str = Field(..., min_length=1, max_length=150)
    meaning: str
    phonetic: Optional[str] = None
    context_sentence: Optional[str] = ""
    image_url: Optional[str] = None
    source_lang: Optional[str] = "en"


class CheckVocabDuplicatesRequest(BaseModel):
    words: List[str]


class BatchImportVocabRequest(BaseModel):
    items: List[BatchImportVocabItem]
    source_lang: Optional[str] = None
    conflict_resolution: Optional[str] = "skip_existing"  # "skip_existing" | "overwrite" | "keep_both"
