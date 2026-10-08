"""Unit tests for System Vocabulary Seeding and Self-Healing mechanism.
Rule 6: Mandatory function-level unit testing covering input, output, logic, and error handling.
"""
import os
import gzip
import json
import pytest
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

from app.infrastructure.database.models import Base
from app.infrastructure.database.seed_system_vocab import (
    load_seed_items,
    seed_system_vocab_batch,
    ensure_system_vocab_seeded,
)


@pytest.fixture
def sample_vocab_items():
    return [
        {
            "id": f"test-seed-{i}",
            "word": f"word_{i}",
            "phonetic": f"/w_{i}/",
            "meaning": f"nghĩa {i}",
            "context_sentence": f"Example sentence for word_{i}.",
            "source_lang": "en" if i % 2 == 0 else "fr",
            "category": "politics_diplomacy" if i % 2 == 0 else "economy_trade",
            "word_type": "single_word",
            "level": "B2",
        }
        for i in range(10)
    ]


@pytest.mark.asyncio
async def test_load_seed_items_coverage(tmp_path):
    """Test load_seed_items across all input and edge cases."""
    # 1. Non-existent path
    assert load_seed_items(str(tmp_path / "non_existent.json.gz")) == []

    # 2. Corrupted file
    corrupt_file = tmp_path / "corrupt.json.gz"
    corrupt_file.write_bytes(b"not a valid gzip stream")
    assert load_seed_items(str(corrupt_file)) == []

    # 3. Valid file with list
    valid_file = tmp_path / "valid.json.gz"
    with gzip.open(str(valid_file), "wt", encoding="utf-8") as f:
        json.dump([{"id": "1", "word": "apple"}], f)
    result = load_seed_items(str(valid_file))
    assert len(result) == 1
    assert result[0]["word"] == "apple"

    # 4. Valid file with non-list (dict)
    dict_file = tmp_path / "dict.json.gz"
    with gzip.open(str(dict_file), "wt", encoding="utf-8") as f:
        json.dump({"not": "a list"}, f)
    assert load_seed_items(str(dict_file)) == []

    # 5. Default bundled file
    bundled = load_seed_items()
    assert len(bundled) >= 1000


@pytest.mark.asyncio
async def test_seed_system_vocab_batch_and_ensure(sample_vocab_items, tmp_path):
    """Test batch seeding, conflict handling, and ensure_system_vocab_seeded."""
    db_path = tmp_path / "test_seed_db.sqlite"
    test_url = f"sqlite+aiosqlite:///{db_path}"
    engine = create_async_engine(test_url)

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

        # 1. Empty items returns 0
        assert await seed_system_vocab_batch(conn, [], is_sqlite=True) == 0

        # 2. Seed batch
        seeded = await seed_system_vocab_batch(conn, sample_vocab_items, is_sqlite=True)
        assert seeded == len(sample_vocab_items)

        res = await conn.execute(text("SELECT count(*) FROM system_vocab_bank;"))
        assert res.scalar() == len(sample_vocab_items)

        # 3. Duplicate handling (INSERT OR IGNORE)
        re_seeded = await seed_system_vocab_batch(conn, sample_vocab_items, is_sqlite=True)
        assert re_seeded == len(sample_vocab_items)
        res_after = await conn.execute(text("SELECT count(*) FROM system_vocab_bank;"))
        assert res_after.scalar() == len(sample_vocab_items)

    # 4. Test ensure_system_vocab_seeded skips when count > 0
    count = await ensure_system_vocab_seeded(engine, force_reseed=False)
    assert count >= len(sample_vocab_items)

    await engine.dispose()
