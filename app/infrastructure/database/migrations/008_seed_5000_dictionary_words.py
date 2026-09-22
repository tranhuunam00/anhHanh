"""Migration 008: Seed 5000 essential Oxford dictionary words into dictionary_words table.

Loads the bundled Oxford 5000 English-Vietnamese dataset with IPA phonetics (UK/US),
parts of speech, definitions, and translations.
Uses ON CONFLICT (word) DO UPDATE to seamlessly insert or update existing words.
"""
import os
import gzip
import json
import uuid
import logging
from sqlalchemy import text

logger = logging.getLogger(__name__)

MIGRATION_ID = "008_seed_5000_dictionary_words"


async def upgrade(conn) -> None:
    """Batch seed 5,000 dictionary words with upsert support."""
    data_file = os.path.join(os.path.dirname(__file__), "..", "data", "common_5000_words.json.gz")
    if not os.path.exists(data_file):
        logger.warning(f"Dictionary seed file not found at {data_file}. Skipping seed.")
        return

    logger.info("Loading 5000 common English words dataset...")
    try:
        with gzip.open(data_file, "rt", encoding="utf-8") as f:
            words_data = json.load(f)
    except Exception as e:
        logger.error(f"Failed to read {data_file}: {e}")
        return

    if not words_data:
        return

    upsert_sql = text("""
        INSERT INTO dictionary_words (
            id, word, ipa, ipa_uk, ipa_us, part_of_speech, definition, meaning, created_at, updated_at
        ) VALUES (
            :id, :word, :ipa, :ipa_uk, :ipa_us, :part_of_speech, :definition, :meaning, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        )
        ON CONFLICT (word) DO UPDATE SET
            ipa = COALESCE(EXCLUDED.ipa, dictionary_words.ipa),
            ipa_uk = COALESCE(EXCLUDED.ipa_uk, dictionary_words.ipa_uk),
            ipa_us = COALESCE(EXCLUDED.ipa_us, dictionary_words.ipa_us),
            part_of_speech = COALESCE(EXCLUDED.part_of_speech, dictionary_words.part_of_speech),
            definition = COALESCE(EXCLUDED.definition, dictionary_words.definition),
            meaning = COALESCE(EXCLUDED.meaning, dictionary_words.meaning),
            updated_at = CURRENT_TIMESTAMP;
    """)

    batch_size = 250
    total = len(words_data)
    seeded_count = 0

    for i in range(0, total, batch_size):
        batch = words_data[i : i + batch_size]
        params = [
            {
                "id": str(uuid.uuid4()),
                "word": item["word"].lower().strip(),
                "ipa": item.get("ipa"),
                "ipa_uk": item.get("ipa_uk"),
                "ipa_us": item.get("ipa_us"),
                "part_of_speech": item.get("part_of_speech"),
                "definition": item.get("definition"),
                "meaning": item.get("meaning") or item["word"],
            }
            for item in batch
        ]
        await conn.execute(upsert_sql, params)
        seeded_count += len(batch)

    logger.info(f"Migration {MIGRATION_ID} completed: Seeded/Updated {seeded_count} words successfully.")
