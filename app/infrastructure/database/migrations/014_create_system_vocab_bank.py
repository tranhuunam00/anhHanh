"""Migration 014: Create system_vocab_bank table and seed 6,000 curated terms across 30 categories.

Supports multi-language learning: English (en) and French (fr).
Includes both single words and rich context phrases with Vietnamese definitions and IPA.
"""
import os
import gzip
import json
import logging
from sqlalchemy import text

logger = logging.getLogger(__name__)

MIGRATION_ID = "014_create_system_vocab_bank"


async def upgrade(conn) -> None:
    """Create system_vocab_bank table and batch seed 6,000 curated items."""
    is_sqlite = conn.dialect.name == "sqlite"

    logger.info(f"Migration {MIGRATION_ID}: Creating system_vocab_bank table...")

    create_table_sql = """
    CREATE TABLE IF NOT EXISTS system_vocab_bank (
        id VARCHAR(36) PRIMARY KEY,
        word VARCHAR(255) NOT NULL,
        phonetic VARCHAR(100) NULL,
        meaning TEXT NOT NULL,
        context_sentence TEXT NULL,
        source_lang VARCHAR(10) NOT NULL DEFAULT 'en',
        category VARCHAR(50) NOT NULL,
        word_type VARCHAR(20) NOT NULL DEFAULT 'single_word',
        level VARCHAR(10) NULL DEFAULT 'B1',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
    """
    await conn.execute(text(create_table_sql))

    # Create optimized lookup indexes
    indexes = [
        "CREATE INDEX IF NOT EXISTS idx_sys_vocab_word ON system_vocab_bank (word);",
        "CREATE INDEX IF NOT EXISTS idx_sys_vocab_lang_cat ON system_vocab_bank (source_lang, category);",
        "CREATE INDEX IF NOT EXISTS idx_sys_vocab_lang_type ON system_vocab_bank (source_lang, word_type);",
    ]
    for idx_sql in indexes:
        try:
            await conn.execute(text(idx_sql))
        except Exception as e:
            logger.warning(f"Notice creating index: {e}")

    logger.info(f"Migration {MIGRATION_ID} completed: Created system_vocab_bank table.")


async def downgrade(conn) -> None:
    """Drop system_vocab_bank table."""
    logger.info(f"Reverting {MIGRATION_ID}...")
    await conn.execute(text("DROP TABLE IF EXISTS system_vocab_bank;"))
    logger.info(f"Migration {MIGRATION_ID} downgraded successfully.")
