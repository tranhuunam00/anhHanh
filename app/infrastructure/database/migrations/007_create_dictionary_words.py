"""Migration 007: Create dictionary_words table for instant persistent dictionary caching.

Stores single-word IPA phonetics (UK/US), part of speech, English definitions,
and Vietnamese translations to eliminate repetitive external API calls and deliver
sub-millisecond dictionary lookups.
"""
import logging
from sqlalchemy import text

logger = logging.getLogger(__name__)

MIGRATION_ID = "007_create_dictionary_words"


async def upgrade(conn) -> None:
    """Create dictionary_words table and relevant index."""
    is_sqlite = conn.dialect.name == "sqlite"
    ts_type = "DATETIME" if is_sqlite else "TIMESTAMP WITH TIME ZONE"

    stmt = f"""
    CREATE TABLE IF NOT EXISTS dictionary_words (
        id VARCHAR(36) PRIMARY KEY,
        word VARCHAR(100) UNIQUE NOT NULL,
        ipa VARCHAR(150) NULL,
        ipa_uk VARCHAR(150) NULL,
        ipa_us VARCHAR(150) NULL,
        part_of_speech VARCHAR(50) NULL,
        definition TEXT NULL,
        meaning TEXT NOT NULL,
        created_at {ts_type} DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at {ts_type} DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
    """
    await conn.execute(text(stmt))

    indexes = [
        "CREATE UNIQUE INDEX IF NOT EXISTS ix_dictionary_words_word ON dictionary_words (word);"
    ]
    for idx_sql in indexes:
        try:
            await conn.execute(text(idx_sql))
        except Exception as e:
            logger.debug(f"Index notice for {idx_sql}: {e}")

    logger.info(f"Migration {MIGRATION_ID} (Dictionary Words Cache) applied successfully.")
