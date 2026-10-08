"""Migration 016: Seed 3,000 curated vocabulary bank items across 30 categories.
Data source: app/infrastructure/database/data/vocab_bank_3000.csv
Rule 4: Strictly under 500 lines.
"""
import os
import csv
import logging
from sqlalchemy import text

logger = logging.getLogger(__name__)

MIGRATION_ID = "016_seed_curated_vocab_bank"


async def upgrade(conn) -> None:
    """Batch seed 3,000 curated vocabulary bank terms from vocab_bank_3000.csv."""
    is_sqlite = conn.dialect.name == "sqlite"

    data_file = os.path.join(os.path.dirname(__file__), "..", "data", "vocab_bank_3000.csv")
    if not os.path.exists(data_file):
        logger.warning(f"Vocab bank seed file not found at {data_file}. Skipping seed.")
        return

    logger.info("Migration 016: Loading 3,000 curated vocabulary items from CSV...")
    items = []
    with open(data_file, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            items.append({
                "id": row["id"],
                "word": row["word"],
                "phonetic": row["phonetic"] or None,
                "meaning": row["meaning"],
                "context_sentence": row["context_sentence"] or None,
                "source_lang": row.get("source_lang") or "en",
                "category": row["category"],
                "word_type": row.get("word_type") or "single_word",
                "level": row.get("level") or "B1",
            })

    if not items:
        logger.warning("No items found in vocab_bank_3000.csv. Skipping seed.")
        return

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

    logger.info(f"Migration {MIGRATION_ID} completed: Seeded {total} curated items into system_vocab_bank.")


async def downgrade(conn) -> None:
    """Clear seeded data from system_vocab_bank."""
    logger.info(f"Reverting {MIGRATION_ID}...")
    await conn.execute(text("DELETE FROM system_vocab_bank;"))
    logger.info(f"Migration {MIGRATION_ID} downgraded successfully.")
