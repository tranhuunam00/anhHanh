"""Migration 017: Seed 3,000 additional curated vocabulary bank items across 30 categories.
Data source: app/infrastructure/database/data/vocab_bank_expansion_3000.csv
Expands system_vocab_bank to 6,000 items (100 single words + 100 phrases per topic across all 30 topics).
Rule 4: Strictly under 500 lines.
"""
import os
import csv
import logging
from sqlalchemy import text

logger = logging.getLogger(__name__)

MIGRATION_ID = "017_seed_expanded_vocab_bank"


async def upgrade(conn) -> None:
    """Batch seed 3,000 expansion vocabulary items from vocab_bank_expansion_3000.csv."""
    is_sqlite = conn.dialect.name == "sqlite"

    data_file = os.path.join(os.path.dirname(__file__), "..", "data", "vocab_bank_expansion_3000.csv")
    if not os.path.exists(data_file):
        logger.warning(f"Vocab bank expansion file not found at {data_file}. Skipping seed.")
        return

    logger.info("Migration 017: Loading 3,000 expansion vocabulary items from CSV...")
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
                "word_type": row.get("word_type") or "phrase",
                "level": row.get("level") or "B2",
            })

    if not items:
        logger.warning("No items found in vocab_bank_expansion_3000.csv. Skipping seed.")
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

    logger.info(f"Migration {MIGRATION_ID} completed: Seeded {total} expansion items into system_vocab_bank.")


async def downgrade(conn) -> None:
    """Remove expansion items loaded from vocab_bank_expansion_3000.csv, preserving earlier seeds."""
    logger.info(f"Reverting {MIGRATION_ID}...")
    data_file = os.path.join(os.path.dirname(__file__), "..", "data", "vocab_bank_expansion_3000.csv")
    if os.path.exists(data_file):
        ids = []
        with open(data_file, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                ids.append(row["id"])

        batch_size = 500
        for i in range(0, len(ids), batch_size):
            chunk = ids[i : i + batch_size]
            placeholders = ", ".join(f":id_{j}" for j in range(len(chunk)))
            params = {f"id_{j}": val for j, val in enumerate(chunk)}
            await conn.execute(
                text(f"DELETE FROM system_vocab_bank WHERE id IN ({placeholders});"),
                params
            )
    else:
        logger.warning("Expansion file not found during downgrade. No records deleted.")

    logger.info(f"Migration {MIGRATION_ID} downgraded successfully.")
