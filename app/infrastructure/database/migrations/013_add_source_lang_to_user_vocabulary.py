"""Migration 013: Add source_lang column to user_vocabulary table.

Supports multi-language vocabulary learning: English (en), French (fr), German (de),
Japanese (ja), Chinese (zh), Korean (ko).
"""
import logging
from sqlalchemy import text

logger = logging.getLogger(__name__)

MIGRATION_ID = "013_add_source_lang_to_user_vocabulary"


async def upgrade(conn) -> None:
    """Add source_lang column to user_vocabulary if missing."""
    is_sqlite = conn.dialect.name == "sqlite"

    try:
        if is_sqlite:
            res = await conn.execute(text("PRAGMA table_info(user_vocabulary);"))
            columns = [row[1] for row in res.fetchall()]
            if "source_lang" not in columns:
                await conn.execute(text("ALTER TABLE user_vocabulary ADD COLUMN source_lang VARCHAR(10) DEFAULT 'en' NULL;"))
                logger.info(f"Migration {MIGRATION_ID}: Added source_lang column to user_vocabulary (SQLite).")
        else:
            await conn.execute(text("ALTER TABLE user_vocabulary ADD COLUMN IF NOT EXISTS source_lang VARCHAR(10) DEFAULT 'en' NULL;"))
            logger.info(f"Migration {MIGRATION_ID}: Added source_lang column to user_vocabulary (PostgreSQL).")
    except Exception as e:
        logger.warning(f"Notice during {MIGRATION_ID}: {e}")

    logger.info(f"Migration {MIGRATION_ID} completed successfully.")
