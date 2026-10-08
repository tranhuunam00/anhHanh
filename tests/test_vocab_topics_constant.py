"""Unit tests for vocab_topics constant and Migration 015.
Strictly under 500 lines. Rule 6 compliance.
"""
import pytest
from app.constants.vocab_topics import VOCAB_TOPICS, get_vocab_topics
from app.infrastructure.database.data.vocab_generator_engine import get_categories_catalog


def test_vocab_topics_structure_and_count():
    """Verify standard 30 topics are defined with required attributes."""
    topics = get_vocab_topics()
    assert len(topics) == 30
    assert len(VOCAB_TOPICS) == 30

    ids = set()
    for t in topics:
        assert "id" in t and isinstance(t["id"], str) and len(t["id"]) > 0
        assert "name_vi" in t and isinstance(t["name_vi"], str) and len(t["name_vi"]) > 0
        assert "name_en" in t and isinstance(t["name_en"], str) and len(t["name_en"]) > 0
        assert "icon" in t and isinstance(t["icon"], str)
        assert t["id"] not in ids, f"Duplicate topic ID: {t['id']}"
        ids.add(t["id"])


def test_vocab_generator_engine_matches_constants():
    """Verify vocab_generator_engine delegates correctly to VOCAB_TOPICS."""
    cats = get_categories_catalog()
    assert len(cats) == 30
    assert cats[0]["id"] == "politics_diplomacy"
    assert cats[4]["id"] == "ai_digital_future"


@pytest.mark.asyncio
async def test_migration_015_upgrade_and_downgrade():
    """Test migration 015 upgrade and downgrade logic."""
    import importlib
    from app.infrastructure.database.connection import get_db
    m015 = importlib.import_module("app.infrastructure.database.migrations.015_clean_and_truncate_system_vocab_bank")

    async for session in get_db():
        conn = await session.connection()
        await m015.upgrade(conn)
        await m015.downgrade(conn)
        break
