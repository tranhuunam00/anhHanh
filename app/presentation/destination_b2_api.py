"""Destination B2 Presentation Layer / API Router.

Follows AGENTS.md:
- Rule 4: File strictly under 500 lines.
- Dedicated endpoints for Destination B2 Grammar & Vocabulary.
- Full 4-aspect coverage test suite.
"""
import json
import logging
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc

from app.infrastructure.database.connection import get_db
from app.infrastructure.database.destination_b2_models import (
    DestinationB2Unit,
    DestinationB2Exercise,
    DestinationB2Progress,
)
from app.infrastructure.database.models import User
from app.application.auth_service import get_current_user_optional
from app.application.destination_b2_grading import grade_exercise_submission

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/destination-b2", tags=["Destination B2"])


class SubmitExerciseRequest(BaseModel):
    answers: Dict[str, Any] = Field(..., description="Mapping of question index/ID to user answer")


@router.get("/units")
async def get_units(
    db: AsyncSession = Depends(get_db)
):
    """Get all Destination B2 units (Units 1 & 2) with exercise counts."""
    stmt = (
        select(DestinationB2Unit)
        .order_by(DestinationB2Unit.unit_number)
    )
    res = await db.execute(stmt)
    units = res.scalars().all()

    output = []
    for unit in units:
        # Count exercises for this unit
        ex_count_stmt = (
            select(func.count(DestinationB2Exercise.id))
            .where(DestinationB2Exercise.unit_id == unit.id)
        )
        count_res = await db.execute(ex_count_stmt)
        ex_count = count_res.scalar() or 0

        unit_dict = unit.to_dict(include_theory=False, include_exercises=False)
        unit_dict["exercises_count"] = ex_count
        output.append(unit_dict)

    return {"units": output, "total": len(output)}


@router.get("/units/{unit_identifier}")
async def get_unit_detail(
    unit_identifier: str,
    db: AsyncSession = Depends(get_db)
):
    """Get unit detail including theory sections and exercise list.
    
    Accepts unit_number (e.g. '1', '2') or UUID string.
    """
    if unit_identifier.isdigit():
        stmt = select(DestinationB2Unit).where(DestinationB2Unit.unit_number == int(unit_identifier))
    else:
        stmt = select(DestinationB2Unit).where(DestinationB2Unit.id == unit_identifier)

    res = await db.execute(stmt)
    unit = res.scalar_one_or_none()
    if not unit:
        raise HTTPException(status_code=404, detail="Unit not found")

    # Fetch exercises for this unit
    ex_stmt = (
        select(DestinationB2Exercise)
        .where(DestinationB2Exercise.unit_id == unit.id)
        .order_by(DestinationB2Exercise.order_num)
    )
    ex_res = await db.execute(ex_stmt)
    exercises = ex_res.scalars().all()

    unit_data = unit.to_dict(include_theory=True, include_exercises=False)
    unit_data["exercises"] = [
        {
            "id": ex.id,
            "exercise_code": ex.exercise_code,
            "title": ex.title,
            "instruction": ex.instruction,
            "exercise_type": ex.exercise_type,
            "order_num": ex.order_num,
            "total_items": len(ex.items or []),
        }
        for ex in exercises
    ]
    return unit_data


@router.get("/exercises/{exercise_id}")
async def get_exercise_detail(
    exercise_id: str,
    include_answers: bool = Query(False, description="Whether to include answer keys"),
    db: AsyncSession = Depends(get_db)
):
    """Get exercise questions with answers masked by default."""
    stmt = select(DestinationB2Exercise).where(DestinationB2Exercise.id == exercise_id)
    res = await db.execute(stmt)
    exercise = res.scalar_one_or_none()
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")

    return exercise.to_dict(include_answers=include_answers)


@router.post("/exercises/{exercise_id}/submit")
async def submit_exercise(
    exercise_id: str,
    payload: SubmitExerciseRequest,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db)
):
    """Submit answers for an exercise, grade them, and record progress."""
    stmt = select(DestinationB2Exercise).where(DestinationB2Exercise.id == exercise_id)
    res = await db.execute(stmt)
    exercise = res.scalar_one_or_none()
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")

    # Grade submission
    exercise_items = exercise.items or []
    if isinstance(exercise_items, str):
        try:
            exercise_items = json.loads(exercise_items)
        except Exception:
            exercise_items = []

    if isinstance(exercise_items, dict):
        exercise_items = exercise_items.get("items", [])

    grading_result = grade_exercise_submission(
        exercise_items=exercise_items,
        user_answers=payload.answers
    )

    # Record progress
    user_id = current_user.id if current_user else None
    progress = DestinationB2Progress(
        user_id=user_id,
        exercise_id=exercise.id,
        score=grading_result["score"],
        total_items=grading_result["total_items"],
        correct_items=grading_result["correct_items"],
        user_answers=payload.answers,
    )
    db.add(progress)
    await db.commit()
    await db.refresh(progress)

    return {
        "progress_id": progress.id,
        "exercise_id": exercise.id,
        "exercise_code": exercise.exercise_code,
        "score": grading_result["score"],
        "total_items": grading_result["total_items"],
        "correct_items": grading_result["correct_items"],
        "results": grading_result["results"],
    }


@router.get("/progress")
async def get_user_progress(
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db)
):
    """Get user's progress history across Destination B2 exercises."""
    if not current_user:
        return {"progress": [], "total_completed": 0}

    stmt = (
        select(DestinationB2Progress)
        .where(DestinationB2Progress.user_id == current_user.id)
        .order_by(desc(DestinationB2Progress.completed_at))
    )
    res = await db.execute(stmt)
    records = res.scalars().all()

    return {
        "progress": [r.to_dict() for r in records],
        "total_completed": len(records),
    }
