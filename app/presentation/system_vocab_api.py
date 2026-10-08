"""System Vocabulary Bank Presentation Layer / API Router.

Provides endpoints for exploring 30 curated categories, searching 6,000 terms in English and French,
batch importing into personal notebook, and Admin CRUD operations.
Rule 4: Strictly under 500 lines.
"""
import logging
import uuid
from typing import List, Optional
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_, delete, text

from app.infrastructure.database.connection import get_db
from app.infrastructure.database.models import User, UserVocabulary, SystemVocabBank
from app.application.auth_service import get_current_user, get_current_user_optional
from app.infrastructure.database.data.vocab_generator_engine import CATEGORIES_CATALOG

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/system-vocab", tags=["System Vocab Bank"])


class ImportToNotebookRequest(BaseModel):
    vocab_ids: List[str] = Field(..., description="Danh sách ID từ ngân hàng hệ thống muốn thêm vào sổ tay")


class AdminCreateVocabRequest(BaseModel):
    word: str = Field(..., min_length=1, max_length=255)
    phonetic: Optional[str] = None
    meaning: str = Field(..., min_length=1)
    context_sentence: Optional[str] = None
    source_lang: str = Field(default="en", max_length=10)
    category: str = Field(..., max_length=50)
    word_type: str = Field(default="single_word", max_length=20)
    level: Optional[str] = Field(default="B1", max_length=10)


class AdminUpdateVocabRequest(BaseModel):
    word: Optional[str] = None
    phonetic: Optional[str] = None
    meaning: Optional[str] = None
    context_sentence: Optional[str] = None
    source_lang: Optional[str] = None
    category: Optional[str] = None
    word_type: Optional[str] = None
    level: Optional[str] = None


@router.get("/categories")
async def get_vocab_categories(
    lang: Optional[str] = Query(None, description="Lọc ngôn ngữ ('en', 'fr')"),
    db: AsyncSession = Depends(get_db)
):
    """Return catalog of 30 categories with total count per category."""


    query = select(
        SystemVocabBank.category,
        func.count(SystemVocabBank.id).label("total_count")
    )
    if lang:
        query = query.where(SystemVocabBank.source_lang == lang.strip().lower())
    query = query.group_by(SystemVocabBank.category)

    res = await db.execute(query)
    count_map = {row.category: row.total_count for row in res.fetchall()}

    categories = []
    for cat in CATEGORIES_CATALOG:
        cid = cat["id"]
        categories.append({
            **cat,
            "word_count": count_map.get(cid, 0),
        })

    return {"categories": categories, "total_categories": len(categories)}


@router.get("/words")
async def get_system_vocab_words(
    source_lang: Optional[str] = Query("en", description="Ngôn ngữ ('en', 'fr', 'all')"),
    category: Optional[str] = Query(None, description="ID chủ đề trong 30 chủ đề"),
    word_type: Optional[str] = Query(None, description="'single_word', 'phrase', hoặc 'all'"),
    search: Optional[str] = Query(None, description="Từ khóa tìm kiếm theo từ hoặc nghĩa"),
    limit: int = Query(20, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db)
):
    """Query curated vocabulary items with filters and pagination."""
    query = select(SystemVocabBank)
    count_query = select(func.count(SystemVocabBank.id))

    filters = []
    if source_lang and source_lang.lower() != "all":
        filters.append(SystemVocabBank.source_lang == source_lang.strip().lower())

    if category and category.strip():
        filters.append(SystemVocabBank.category == category.strip())

    if word_type and word_type.lower() != "all":
        filters.append(SystemVocabBank.word_type == word_type.strip().lower())

    if search and search.strip():
        s = f"%{search.strip().lower()}%"
        filters.append(or_(
            func.lower(SystemVocabBank.word).like(s),
            func.lower(SystemVocabBank.meaning).like(s)
        ))

    if filters:
        for f in filters:
            query = query.where(f)
            count_query = count_query.where(f)

    # Count total matching
    total_res = await db.execute(count_query)
    total = total_res.scalar_one_or_none() or 0

    query = query.order_by(SystemVocabBank.created_at.asc(), SystemVocabBank.word.asc())
    query = query.offset(offset).limit(limit)

    res = await db.execute(query)
    items = [item.to_dict() for item in res.scalars().all()]

    return {
        "items": items,
        "total": total,
        "limit": limit,
        "offset": offset,
    }


@router.get("/distractors")
async def get_system_vocab_distractors(
    source_lang: str = Query("en", description="Ngôn ngữ ('en', 'fr')"),
    count: int = Query(30, ge=4, le=100),
    word_type: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve random vocabulary terms from system bank for exercise multiple-choice options."""
    query = select(SystemVocabBank).where(SystemVocabBank.source_lang == source_lang.strip().lower())
    if word_type and word_type != "all":
        query = query.where(SystemVocabBank.word_type == word_type.strip().lower())

    # Random selection in SQLite / Postgres
    query = query.order_by(func.random()).limit(count)
    res = await db.execute(query)
    items = [item.to_dict() for item in res.scalars().all()]
    return {"distractors": items}


@router.get("/user-saved-words")
async def get_user_saved_words(
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db)
):
    """Return set of normalized words user already has in personal notebook."""
    if not current_user:
        return {"saved_words": []}

    res = await db.execute(
        select(func.lower(UserVocabulary.word)).where(UserVocabulary.user_id == current_user.id)
    )
    saved = [row[0].strip() for row in res.fetchall() if row[0]]
    return {"saved_words": list(set(saved))}


@router.post("/import-to-notebook")
async def import_system_vocab_to_notebook(
    payload: ImportToNotebookRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Batch import selected system vocabulary bank words into current user's notebook."""
    if not payload.vocab_ids:
        raise HTTPException(status_code=400, detail="Danh sách từ vựng cần thêm không được để trống")

    # 1. Fetch system vocab items
    q = select(SystemVocabBank).where(SystemVocabBank.id.in_(payload.vocab_ids))
    res = await db.execute(q)
    system_items = res.scalars().all()

    if not system_items:
        raise HTTPException(status_code=404, detail="Không tìm thấy từ vựng tương ứng trong ngân hàng")

    # 2. Query existing user vocabulary to avoid duplicates
    existing_res = await db.execute(
        select(func.lower(UserVocabulary.word)).where(UserVocabulary.user_id == current_user.id)
    )
    existing_words = {row[0].strip() for row in existing_res.fetchall() if row[0]}

    imported_count = 0
    skipped_count = 0

    for item in system_items:
        norm_word = item.word.strip().lower()
        if norm_word in existing_words:
            skipped_count += 1
            continue

        new_vocab = UserVocabulary(
            id=str(uuid.uuid4()),
            user_id=current_user.id,
            word=item.word.strip(),
            phonetic=item.phonetic,
            meaning=item.meaning,
            context_sentence=item.context_sentence,
            source_lang=item.source_lang,
            status="LEARNING",
            mastery_score=0,
            review_interval_days=1,
        )
        db.add(new_vocab)
        existing_words.add(norm_word)
        imported_count += 1

    await db.commit()
    logger.info(f"User {current_user.email} imported {imported_count} words from system bank (skipped {skipped_count}).")

    return {
        "success": True,
        "imported_count": imported_count,
        "skipped_count": skipped_count,
        "message": f"Đã thêm thành công {imported_count} từ vào Sổ tay của bạn" + (f" ({skipped_count} từ đã có sẵn được bỏ qua)" if skipped_count > 0 else "")
    }


# =========================================================================
# ADMIN CRUD ENDPOINTS
# =========================================================================
def _require_admin(user: User):
    if user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Chỉ Quản trị viên (Admin) mới có quyền truy cập tính năng này")


@router.post("/admin/words")
async def admin_create_system_vocab(
    payload: AdminCreateVocabRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Admin creates a new word in the system vocabulary bank."""
    _require_admin(current_user)

    new_item = SystemVocabBank(
        id=str(uuid.uuid4()),
        word=payload.word.strip(),
        phonetic=payload.phonetic.strip() if payload.phonetic else None,
        meaning=payload.meaning.strip(),
        context_sentence=payload.context_sentence.strip() if payload.context_sentence else None,
        source_lang=payload.source_lang.strip().lower(),
        category=payload.category.strip(),
        word_type=payload.word_type.strip().lower(),
        level=payload.level.strip() if payload.level else "B1",
    )
    db.add(new_item)
    await db.commit()
    await db.refresh(new_item)
    return {"success": True, "item": new_item.to_dict()}


@router.put("/admin/words/{vocab_id}")
async def admin_update_system_vocab(
    vocab_id: str,
    payload: AdminUpdateVocabRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Admin updates an existing word in the system vocabulary bank."""
    _require_admin(current_user)

    res = await db.execute(select(SystemVocabBank).where(SystemVocabBank.id == vocab_id))
    item = res.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Không tìm thấy mục từ vựng trong ngân hàng")

    if payload.word is not None: item.word = payload.word.strip()
    if payload.phonetic is not None: item.phonetic = payload.phonetic.strip()
    if payload.meaning is not None: item.meaning = payload.meaning.strip()
    if payload.context_sentence is not None: item.context_sentence = payload.context_sentence.strip()
    if payload.source_lang is not None: item.source_lang = payload.source_lang.strip().lower()
    if payload.category is not None: item.category = payload.category.strip()
    if payload.word_type is not None: item.word_type = payload.word_type.strip().lower()
    if payload.level is not None: item.level = payload.level.strip()

    await db.commit()
    await db.refresh(item)
    return {"success": True, "item": item.to_dict()}


@router.delete("/admin/words/{vocab_id}")
async def admin_delete_system_vocab(
    vocab_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Admin deletes a word from the system vocabulary bank."""
    _require_admin(current_user)

    res = await db.execute(select(SystemVocabBank).where(SystemVocabBank.id == vocab_id))
    item = res.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Không tìm thấy mục từ vựng trong ngân hàng")

    await db.delete(item)
    await db.commit()
    return {"success": True, "deleted_id": vocab_id}

