"""Unit and integration tests for Migration 019 (Create Destination B2 tables & seed Units 1 & 2).

Follows AGENTS.md:
- Rule 3: Database Migrations Rule (upgrade & downgrade testing).
- Rule 4: File strictly under 500 lines.
- Rule 6: Mandatory function-level unit testing covering input, output, logic, and error handling.
"""
import os
import json
import importlib
import pytest
from sqlalchemy import select, func, text

from app.infrastructure.database.connection import get_db
from app.infrastructure.database.destination_b2_models import (
    DestinationB2Unit,
    DestinationB2Exercise,
    DestinationB2Progress,
    generate_uuid,
)


def test_destination_b2_seed_json_integrity():
    """Verify seed JSON structure: 2 units (Unit 1 & 2), 19 exercises, 175 questions."""
    json_path = os.path.join(
        os.path.dirname(__file__), "..", "app", "infrastructure", "database", "data", "destination_b2_seed_data.json"
    )
    assert os.path.exists(json_path), f"Seed JSON not found at {json_path}"

    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    units = data.get("units", [])
    assert len(units) == 2, f"Expected 2 units, found {len(units)}"

    u1 = next(u for u in units if u["unit_number"] == 1)
    u2 = next(u for u in units if u["unit_number"] == 2)

    # Unit 1 check
    assert u1["unit_type"] == "grammar"
    assert "Present time" in u1["title"]
    assert len(u1["exercises"]) == 10
    assert len(u1.get("theory", {}).get("sections", [])) == 5

    # Unit 2 check
    assert u2["unit_type"] == "vocabulary"
    assert "Travel and transport" in u2["title"]
    assert len(u2["exercises"]) == 9
    assert len(u2.get("theory", {}).get("sections", [])) == 5

    total_exercises = len(u1["exercises"]) + len(u2["exercises"])
    assert total_exercises == 19

    total_items = 0
    for u in units:
        for ex in u["exercises"]:
            assert ex["exercise_code"] in "ABCDEFGHIJ"
            assert ex["title"]
            assert ex["instruction"]
            assert ex["exercise_type"]
            assert len(ex["items"]) > 0
            for item in ex["items"]:
                total_items += 1
                assert (
                    item.get("id") is not None
                    or item.get("gap_id") is not None
                    or item.get("line") is not None
                )
                assert (
                    item.get("correct_answer") is not None
                    or item.get("answers") is not None
                    or item.get("answer") is not None
                )

    assert total_items == 175, f"Expected 175 total items, got {total_items}"


@pytest.mark.asyncio
async def test_migration_019_upgrade_and_downgrade():
    """Verify migration 019 upgrade, downgrade and idempotency."""
    mig_019 = importlib.import_module("app.infrastructure.database.migrations.019_create_destination_b2_tables")

    async for session in get_db():
        conn = await session.connection()

        # Test downgrade
        await mig_019.downgrade(conn)
        res = await session.execute(
            text("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='destination_b2_units';")
        )
        assert res.scalar() == 0

        # Test upgrade
        await mig_019.upgrade(conn)
        res_u = await session.execute(text("SELECT count(*) FROM destination_b2_units;"))
        assert res_u.scalar() == 2

        res_e = await session.execute(text("SELECT count(*) FROM destination_b2_exercises;"))
        assert res_e.scalar() == 19

        # Test idempotency (running upgrade again does not throw error)
        await mig_019.upgrade(conn)
        res_u2 = await session.execute(text("SELECT count(*) FROM destination_b2_units;"))
        assert res_u2.scalar() == 2
        await session.commit()
        break


@pytest.mark.asyncio
async def test_migration_019_missing_file_handling(monkeypatch):
    """Verify migration handles missing seed JSON file safely without crashing."""
    mig_019 = importlib.import_module("app.infrastructure.database.migrations.019_create_destination_b2_tables")

    orig_exists = os.path.exists
    monkeypatch.setattr(
        os.path,
        "exists",
        lambda p: False if "destination_b2_seed_data.json" in p else orig_exists(p)
    )

    async for session in get_db():
        conn = await session.connection()
        await mig_019.upgrade(conn)
        break


@pytest.mark.asyncio
async def test_destination_b2_models_and_queries():
    """Test SQLAlchemy ORM models, relationships, and serialization."""
    async for session in get_db():
        # Query Unit 1 with exercises
        stmt = (
            select(DestinationB2Unit)
            .where(DestinationB2Unit.unit_number == 1)
        )
        res = await session.execute(stmt)
        unit1 = res.scalar_one_or_none()
        assert unit1 is not None
        assert unit1.unit_type == "grammar"

        dict_with_theory = unit1.to_dict(include_theory=True, include_exercises=False)
        assert "theory" in dict_with_theory
        assert "sections" in dict_with_theory["theory"]

        dict_without_theory = unit1.to_dict(include_theory=False)
        assert "theory" not in dict_without_theory

        # Query exercises for Unit 1
        stmt_ex = (
            select(DestinationB2Exercise)
            .where(DestinationB2Exercise.unit_id == unit1.id)
            .order_by(DestinationB2Exercise.order_num)
        )
        res_ex = await session.execute(stmt_ex)
        exercises = res_ex.scalars().all()
        assert len(exercises) == 10

        first_ex = exercises[0]
        # Test serialization with and without answers
        full_dict = first_ex.to_dict(include_answers=True)
        assert "correct_answer" in full_dict["items"][0] or "answers" in full_dict["items"][0] or "answer" in full_dict["items"][0]

        student_dict = first_ex.to_dict(include_answers=False)
        assert "correct_answer" not in student_dict["items"][0]
        assert "answers" not in student_dict["items"][0]
        assert "answer" not in student_dict["items"][0]

        # Test DestinationB2Progress creation
        progress = DestinationB2Progress(
            user_id=None,
            exercise_id=first_ex.id,
            score=90.0,
            total_items=10,
            correct_items=9,
            user_answers={"1": "have been thinking"},
        )
        session.add(progress)
        await session.flush()

        assert progress.id is not None
        p_dict = progress.to_dict()
        assert p_dict["score"] == 90.0
        assert p_dict["correct_items"] == 9

        # Clean up test progress
        await session.delete(progress)
        await session.flush()
        break


def test_generate_uuid_helper():
    """Test RFC 4122 UUID generation helper."""
    uid1 = generate_uuid()
    uid2 = generate_uuid()
    assert isinstance(uid1, str)
    assert len(uid1) == 36
    assert uid1 != uid2
