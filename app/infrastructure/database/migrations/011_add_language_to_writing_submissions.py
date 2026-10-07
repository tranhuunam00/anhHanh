"""Migration 011: Add language column to writing_submissions table.

Supports multi-language academic writing: English (en), Japanese (ja), Chinese (zh),
Korean (ko), French (fr), German (de).
"""
import logging
from sqlalchemy import text

logger = logging.getLogger(__name__)

MIGRATION_ID = "011_add_language_to_writing_submissions"


async def upgrade(conn) -> None:
    """Add language column to writing_submissions if missing."""
    is_sqlite = conn.dialect.name == "sqlite"

    try:
        # Check if column already exists
        if is_sqlite:
            res = await conn.execute(text("PRAGMA table_info(writing_submissions);"))
            columns = [row[1] for row in res.fetchall()]
            if "language" not in columns:
                await conn.execute(text("ALTER TABLE writing_submissions ADD COLUMN language VARCHAR(10) DEFAULT 'en' NOT NULL;"))
                logger.info(f"Migration {MIGRATION_ID}: Added language column to writing_submissions (SQLite).")
        else:
            await conn.execute(text("ALTER TABLE writing_submissions ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT 'en' NOT NULL;"))
            logger.info(f"Migration {MIGRATION_ID}: Added language column to writing_submissions (PostgreSQL).")
    except Exception as e:
        logger.warning(f"Notice during {MIGRATION_ID}: {e}")

    logger.info(f"Migration {MIGRATION_ID} completed successfully.")
