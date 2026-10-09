"""Destination B2 Models.

Independent tables for Destination B2: Grammar & Vocabulary learning.
Follows AGENTS.md:
- Fully isolated tables: destination_b2_units, destination_b2_exercises, destination_b2_progress
- Rule 4: File strictly under 500 lines.
"""
import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Text,
    Integer,
    Float,
    DateTime,
    ForeignKey,
    JSON,
    func,
    Index
)
from sqlalchemy.orm import relationship
from app.infrastructure.database.connection import Base


def generate_uuid() -> str:
    """Generate RFC 4122 compliant UUID string."""
    return str(uuid.uuid4())


class DestinationB2Unit(Base):
    """Destination B2 Unit model (Unit 1: Grammar, Unit 2: Vocabulary, etc.)."""
    __tablename__ = "destination_b2_units"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    unit_number = Column(Integer, unique=True, nullable=False, index=True)
    title = Column(String(255), nullable=False)
    unit_type = Column(String(50), nullable=False)  # 'grammar' or 'vocabulary'
    cefr_level = Column(String(10), default="B2", nullable=False)
    summary = Column(Text, nullable=True)
    theory = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now(), nullable=False)

    exercises = relationship(
        "DestinationB2Exercise",
        back_populates="unit",
        cascade="all, delete-orphan",
        order_by="DestinationB2Exercise.order_num"
    )

    def to_dict(self, include_theory: bool = True, include_exercises: bool = False):
        """Serialize unit to dictionary."""
        data = {
            "id": self.id,
            "unit_number": self.unit_number,
            "title": self.title,
            "unit_type": self.unit_type,
            "cefr_level": self.cefr_level,
            "summary": self.summary,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
        if include_theory:
            th = self.theory or {}
            if isinstance(th, str):
                try:
                    th = json.loads(th)
                except Exception:
                    pass
            data["theory"] = th
        if include_exercises and self.exercises:
            data["exercises"] = [ex.to_dict(include_answers=False) for ex in self.exercises]
        return data


class DestinationB2Exercise(Base):
    """Destination B2 Exercise model (Exercise A, B, C, etc. within a Unit)."""
    __tablename__ = "destination_b2_exercises"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    unit_id = Column(String(36), ForeignKey("destination_b2_units.id", ondelete="CASCADE"), nullable=False, index=True)
    exercise_code = Column(String(10), nullable=False)  # 'A', 'B', 'C', etc.
    title = Column(String(255), nullable=False)
    instruction = Column(Text, nullable=False)
    exercise_type = Column(String(50), nullable=False)
    order_num = Column(Integer, default=1, nullable=False)
    items = Column(JSON, nullable=False)  # List of exercise items
    created_at = Column(DateTime(timezone=True), default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now(), nullable=False)

    unit = relationship("DestinationB2Unit", back_populates="exercises")
    progress = relationship("DestinationB2Progress", back_populates="exercise", cascade="all, delete-orphan")

    def to_dict(self, include_answers: bool = True):
        """Serialize exercise to dictionary. Strip answers if include_answers is False."""
        exercise_items = self.items or []
        if isinstance(exercise_items, str):
            try:
                exercise_items = json.loads(exercise_items)
            except Exception:
                exercise_items = []

        if not include_answers:
            sanitized_items = []
            for item in exercise_items:
                copy_item = dict(item)
                copy_item.pop("correct_answer", None)
                copy_item.pop("answers", None)
                copy_item.pop("answer", None)
                sanitized_items.append(copy_item)
            exercise_items = sanitized_items

        return {
            "id": self.id,
            "unit_id": self.unit_id,
            "exercise_code": self.exercise_code,
            "title": self.title,
            "instruction": self.instruction,
            "exercise_type": self.exercise_type,
            "order_num": self.order_num,
            "items": exercise_items,
            "total_items": len(self.items or []),
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


class DestinationB2Progress(Base):
    """Destination B2 user progress and submission history."""
    __tablename__ = "destination_b2_progress"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True)
    exercise_id = Column(String(36), ForeignKey("destination_b2_exercises.id", ondelete="CASCADE"), nullable=False, index=True)
    score = Column(Float, nullable=False, default=0.0)  # Percentage 0.0 - 100.0
    total_items = Column(Integer, nullable=False, default=0)
    correct_items = Column(Integer, nullable=False, default=0)
    user_answers = Column(JSON, nullable=True)
    completed_at = Column(DateTime(timezone=True), default=func.now(), nullable=False)

    exercise = relationship("DestinationB2Exercise", back_populates="progress")

    def to_dict(self):
        """Serialize user progress to dictionary."""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "exercise_id": self.exercise_id,
            "score": self.score,
            "total_items": self.total_items,
            "correct_items": self.correct_items,
            "user_answers": self.user_answers or {},
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
        }
