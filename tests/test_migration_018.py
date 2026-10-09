"""Unit and integration tests for Migration 018 (Seed 9,000 Batch 3 Items from CSV).
Rule 4: Strictly under 500 lines. Rule 6: Function-level testing.
"""
import os
import csv
import importlib
import pytest
from sqlalchemy import select, func, text

from app.infrastructure.database.connection import get_db
from app.infrastructure.database.models import SystemVocabBank
from app.constants.vocab_topics import VOCAB_TOPICS


def test_vocab_bank_batch3_csv_integrity():
    """Verify batch 3 CSV exists, has 9,000 valid items, 30 topics, 150 words + 150 phrases each, no overlap."""
    csv_path = os.path.join(
        os.path.dirname(__file__), "..", "app", "infrastructure", "database", "data", "vocab_bank_batch3_3000.csv"
    )
    p016 = os.path.join(
        os.path.dirname(__file__), "..", "app", "infrastructure", "database", "data", "vocab_bank_3000.csv"
    )
    p017 = os.path.join(
        os.path.dirname(__file__), "..", "app", "infrastructure", "database", "data", "vocab_bank_expansion_3000.csv"
    )
    assert os.path.exists(csv_path), f"Batch 3 CSV not found at {csv_path}"

    with open(csv_path, "r", encoding="utf-8") as f:
        reader = list(csv.DictReader(f))

    assert len(reader) == 9000, f"Expected 9000 rows, got {len(reader)}"

    category_counts = {}
    type_counts = {}
    ids = set()
    for row in reader:
        assert row["id"], "Row missing id"
        assert row["id"] not in ids, f"Duplicate id: {row['id']}"
        ids.add(row["id"])
        assert row["word"], "Row missing word"
        assert row["meaning"], "Row meaning is missing"
        assert row["category"], "Row category is missing"
        assert row["word_type"] in ("single_word", "phrase"), f"Invalid word_type: {row['word_type']}"
        assert row["level"] in ("A1", "A2", "B1", "B2", "C1"), f"Invalid level: {row['level']}"

        cat = row["category"]
        category_counts[cat] = category_counts.get(cat, 0) + 1
        w_type = (cat, row["word_type"])
        type_counts[w_type] = type_counts.get(w_type, 0) + 1

    assert len(category_counts) == 30, f"Expected 30 categories, got {len(category_counts)}"
    for cat in VOCAB_TOPICS:
        cid = cat["id"]
        assert category_counts.get(cid) == 300, f"Category {cid} does not have 300 items"
        assert type_counts.get((cid, "single_word")) == 150, f"Category {cid} does not have 150 single words"
        assert type_counts.get((cid, "phrase")) == 150, f"Category {cid} does not have 150 phrases"

    prev_words = set()
    for prev_path in (p016, p017):
        if os.path.exists(prev_path):
            with open(prev_path, "r", encoding="utf-8") as f:
                for r in csv.DictReader(f):
                    prev_words.add(r["word"].lower())

    overlap = [r["word"] for r in reader if r["word"].lower() in prev_words]
    assert len(overlap) == 0, f"Found overlap with earlier batches: {overlap[:5]}"


@pytest.mark.asyncio
async def test_migration_018_upgrade_and_downgrade():
    """Verify migration 018 upgrade and downgrade logic."""
    m018 = importlib.import_module("app.infrastructure.database.migrations.018_seed_advanced_vocab_bank")

    async for session in get_db():
        conn = await session.connection()

        # Ensure clean state by running downgrade first
        await m018.downgrade(conn)
        base_count = (await session.execute(select(func.count(SystemVocabBank.id)))).scalar_one_or_none() or 0

        # 1. Upgrade seeds exactly 9,000 items
        await m018.upgrade(conn)
        count_after = (await session.execute(select(func.count(SystemVocabBank.id)))).scalar_one_or_none()
        assert count_after == base_count + 9000

        # 2. Idempotent re-run does not error or duplicate
        await m018.upgrade(conn)
        count_re = (await session.execute(select(func.count(SystemVocabBank.id)))).scalar_one_or_none()
        assert count_re == count_after

        # 3. Downgrade removes only batch 3 items
        await m018.downgrade(conn)
        count_down = (await session.execute(select(func.count(SystemVocabBank.id)))).scalar_one_or_none()
        assert count_down == base_count

        # 4. Re-upgrade so system_vocab_bank retains data
        await m018.upgrade(conn)
        break


@pytest.mark.asyncio
async def test_migration_018_missing_file_handling(monkeypatch):
    """Verify migration handles missing CSV file safely without throwing exceptions."""
    m018 = importlib.import_module("app.infrastructure.database.migrations.018_seed_advanced_vocab_bank")

    orig_exists = os.path.exists
    monkeypatch.setattr(os.path, "exists", lambda p: False if "vocab_bank_batch3_3000.csv" in p else orig_exists(p))

    async for session in get_db():
        conn = await session.connection()
        await m018.upgrade(conn)
        break
