"""Unit and integration tests for Migration 016 (Seed 3,000 Curated Items from CSV).
Rule 4: Strictly under 500 lines. Rule 6: Function-level testing.
"""
import os
import csv
import importlib
import pytest
from sqlalchemy import select, func, text

from app.infrastructure.database.connection import get_db, async_session_factory
from app.infrastructure.database.models import SystemVocabBank
from app.constants.vocab_topics import VOCAB_TOPICS


def test_vocab_bank_csv_integrity():
    """Verify CSV file exists and contains exactly 3,000 valid items across 30 topics."""
    csv_path = os.path.join(
        os.path.dirname(__file__), "..", "app", "infrastructure", "database", "data", "vocab_bank_3000.csv"
    )
    assert os.path.exists(csv_path), f"CSV file not found at {csv_path}"

    with open(csv_path, "r", encoding="utf-8") as f:
        reader = list(csv.DictReader(f))

    assert len(reader) == 3000, f"Expected 3000 rows, got {len(reader)}"

    category_counts = {}
    type_counts = {}
    for row in reader:
        assert row["id"], "Row missing id"
        assert row["word"], "Row missing word"
        assert row["meaning"], "Row missing meaning"
        assert row["category"], "Row missing category"
        assert row["word_type"] in ("single_word", "phrase"), f"Invalid word_type: {row['word_type']}"
        assert row["level"] in ("A1", "A2", "B1", "B2", "C1"), f"Invalid level: {row['level']}"

        cat = row["category"]
        category_counts[cat] = category_counts.get(cat, 0) + 1
        w_type = (cat, row["word_type"])
        type_counts[w_type] = type_counts.get(w_type, 0) + 1

    # Exactly 30 categories, each with 100 items (50 single_word, 50 phrase)
    assert len(category_counts) == 30
    for cat in VOCAB_TOPICS:
        cid = cat["id"]
        assert category_counts.get(cid) == 100, f"Category {cid} does not have 100 items"
        assert type_counts.get((cid, "single_word")) == 50, f"Category {cid} does not have 50 single words"
        assert type_counts.get((cid, "phrase")) == 50, f"Category {cid} does not have 50 phrases"


@pytest.mark.asyncio
async def test_migration_016_upgrade_and_downgrade():
    """Verify migration 016 upgrade and downgrade logic."""
    m016 = importlib.import_module("app.infrastructure.database.migrations.016_seed_curated_vocab_bank")

    async for session in get_db():
        conn = await session.connection()

        # 1. Upgrade seeds 3,000 items
        await m016.upgrade(conn)

        count_res = await session.execute(select(func.count(SystemVocabBank.id)))
        count = count_res.scalar_one_or_none()
        assert count == 3000, f"Expected 3000 items in DB, got {count}"

        # 2. Idempotent re-run does not error or duplicate
        await m016.upgrade(conn)
        count_re = (await session.execute(select(func.count(SystemVocabBank.id)))).scalar_one_or_none()
        assert count_re == 3000

        # 3. Downgrade clears table
        await m016.downgrade(conn)
        count_down = (await session.execute(select(func.count(SystemVocabBank.id)))).scalar_one_or_none()
        assert count_down == 0

        # 4. Re-upgrade so system_vocab_bank has data for application usage
        await m016.upgrade(conn)
        break


@pytest.mark.asyncio
async def test_migration_016_missing_file_handling(monkeypatch):
    """Verify migration handles missing CSV file safely without throwing exceptions."""
    m016 = importlib.import_module("app.infrastructure.database.migrations.016_seed_curated_vocab_bank")

    # Point to nonexistent file
    orig_exists = os.path.exists
    monkeypatch.setattr(os.path, "exists", lambda p: False if "vocab_bank_3000.csv" in p else orig_exists(p))

    async for session in get_db():
        conn = await session.connection()
        # Should not raise exception
        await m016.upgrade(conn)
        break
