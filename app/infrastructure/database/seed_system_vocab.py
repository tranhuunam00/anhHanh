"""System Vocabulary Bank Data Seeder & Self-Healing Service.

Ensures the 6,000 curated terms across 30 categories for English and French
are populated into the system_vocab_bank table automatically.
Rule 4: Strictly under 500 lines.
"""
import os
import gzip
import json
import logging
from typing import List, Dict, Any, Optional
from sqlalchemy import text

logger = logging.getLogger(__name__)

DEFAULT_DATA_FILE = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "data", "system_vocab_bank.json.gz")
)


def load_seed_items(filepath: Optional[str] = None) -> List[Dict[str, Any]]:
    """Safely load vocabulary bank items from compressed gzip json file."""
    target_path = filepath or DEFAULT_DATA_FILE
    if not os.path.exists(target_path):
        logger.warning(f"Vocab bank seed file not found: {target_path}")
        return []

    try:
        with gzip.open(target_path, "rt", encoding="utf-8") as f:
            items = json.load(f)
            if isinstance(items, list):
                return items
            logger.error(f"Expected list in {target_path}, got {type(items)}")
            return []
    except Exception as e:
        logger.error(f"Error reading seed file {target_path}: {e}")
        return []


async def seed_system_vocab_batch(conn, items: List[Dict[str, Any]], is_sqlite: bool) -> int:
    """Insert items into system_vocab_bank in chunks with conflict protection."""
    if not items:
        return 0

    insert_sql = text("""
        INSERT OR IGNORE INTO system_vocab_bank (
            id, word, phonetic, meaning, context_sentence, source_lang, category, word_type, level, created_at, updated_at
        ) VALUES (
            :id, :word, :phonetic, :meaning, :context_sentence, :source_lang, :category, :word_type, :level, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        );
    """ if is_sqlite else """
        INSERT INTO system_vocab_bank (
            id, word, phonetic, meaning, context_sentence, source_lang, category, word_type, level, created_at, updated_at
        ) VALUES (
            :id, :word, :phonetic, :meaning, :context_sentence, :source_lang, :category, :word_type, :level, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        )
        ON CONFLICT (id) DO NOTHING;
    """)

    batch_size = 300
    total = len(items)
    for i in range(0, total, batch_size):
        batch = items[i : i + batch_size]
        await conn.execute(insert_sql, batch)

    return total


async def ensure_system_vocab_seeded(target_engine, force_reseed: bool = False) -> int:
    """Check database system_vocab_bank count; auto-seed if 0 or forced."""
    async with target_engine.begin() as conn:
        is_sqlite = conn.dialect.name == "sqlite"
        res = await conn.execute(text("SELECT count(*) FROM system_vocab_bank;"))
        count = res.scalar() or 0

        if count > 0 and not force_reseed:
            return count

        logger.info(f"system_vocab_bank count is {count}. Starting self-healing seeding...")
        items = load_seed_items()
        if not items:
            logger.error("No vocabulary items available to seed.")
            return count

        await seed_system_vocab_batch(conn, items, is_sqlite)

        verify_res = await conn.execute(text("SELECT count(*) FROM system_vocab_bank;"))
        new_count = verify_res.scalar() or 0
        logger.info(f"Self-healing seeding complete. Total words: {new_count}")
        return new_count
