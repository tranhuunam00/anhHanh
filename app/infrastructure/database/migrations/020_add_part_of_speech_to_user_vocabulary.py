"""Migration 020: Add part_of_speech column to user_vocabulary table.

Allows storing single or multiple parts of speech (e.g., 'noun', 'verb', 'noun, verb')
for all supported languages (English, French, German, Japanese, Chinese, Vietnamese, etc.).
"""
import logging
from sqlalchemy import text

logger = logging.getLogger(__name__)

MIGRATION_ID = "020_add_part_of_speech_to_user_vocabulary"


async def upgrade(conn) -> None:
    """Add part_of_speech column to user_vocabulary if missing."""
    is_sqlite = conn.dialect.name == "sqlite"

    try:
        if is_sqlite:
            res = await conn.execute(text("PRAGMA table_info(user_vocabulary);"))
            columns = [row[1] for row in res.fetchall()]
            if "part_of_speech" not in columns:
                await conn.execute(text("ALTER TABLE user_vocabulary ADD COLUMN part_of_speech VARCHAR(100) NULL;"))
                logger.info(f"Migration {MIGRATION_ID}: Added part_of_speech column to user_vocabulary (SQLite).")
        else:
            await conn.execute(text("ALTER TABLE user_vocabulary ADD COLUMN IF NOT EXISTS part_of_speech VARCHAR(100) NULL;"))
            logger.info(f"Migration {MIGRATION_ID}: Added part_of_speech column to user_vocabulary (PostgreSQL).")
    except Exception as e:
        logger.warning(f"Notice during {MIGRATION_ID}: {e}")

    logger.info(f"Migration {MIGRATION_ID} completed successfully.")


async def downgrade(conn) -> None:
    """Revert migration if supported by dialect."""
    is_sqlite = conn.dialect.name == "sqlite"
    try:
        if not is_sqlite:
            await conn.execute(text("ALTER TABLE user_vocabulary DROP COLUMN IF EXISTS part_of_speech;"))
            logger.info(f"Migration {MIGRATION_ID} downgraded successfully (PostgreSQL).")
        else:
            logger.info(f"Migration {MIGRATION_ID}: SQLite doesn't natively drop column, skipping.")
    except Exception as e:
        logger.warning(f"Notice during rollback {MIGRATION_ID}: {e}")
