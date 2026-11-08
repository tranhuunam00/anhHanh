"""Migration 021: Add mastered_at column to user_vocabulary table.

Stores the exact timestamp when a vocabulary word's status is updated to 'MASTERED'.
Cleared (set to NULL) whenever the word's status is changed back to 'NEW' or 'LEARNING'.
"""
import logging
from sqlalchemy import text

logger = logging.getLogger(__name__)

MIGRATION_ID = "021_add_mastered_at_to_user_vocabulary"


async def upgrade(conn) -> None:
    """Add mastered_at column to user_vocabulary if missing and backfill existing MASTERED words."""
    is_sqlite = conn.dialect.name == "sqlite"
    ts_type = "DATETIME" if is_sqlite else "TIMESTAMP WITH TIME ZONE"

    try:
        if is_sqlite:
            res = await conn.execute(text("PRAGMA table_info(user_vocabulary);"))
            columns = [row[1] for row in res.fetchall()]
            if "mastered_at" not in columns:
                await conn.execute(text(f"ALTER TABLE user_vocabulary ADD COLUMN mastered_at {ts_type} NULL;"))
                logger.info(f"Migration {MIGRATION_ID}: Added mastered_at column to user_vocabulary (SQLite).")
        else:
            await conn.execute(text(f"ALTER TABLE user_vocabulary ADD COLUMN IF NOT EXISTS mastered_at {ts_type} NULL;"))
            logger.info(f"Migration {MIGRATION_ID}: Added mastered_at column to user_vocabulary (PostgreSQL).")

        # Backfill existing MASTERED words where mastered_at is NULL using created_at
        await conn.execute(
            text("UPDATE user_vocabulary SET mastered_at = created_at WHERE status = 'MASTERED' AND mastered_at IS NULL;")
        )
    except Exception as e:
        logger.warning(f"Notice during {MIGRATION_ID}: {e}")

    logger.info(f"Migration {MIGRATION_ID} completed successfully.")


async def downgrade(conn) -> None:
    """Revert migration if supported by dialect."""
    is_sqlite = conn.dialect.name == "sqlite"
    try:
        if not is_sqlite:
            await conn.execute(text("ALTER TABLE user_vocabulary DROP COLUMN IF EXISTS mastered_at;"))
            logger.info(f"Migration {MIGRATION_ID} downgraded successfully (PostgreSQL).")
        else:
            logger.info(f"Migration {MIGRATION_ID}: SQLite doesn't natively drop column, skipping.")
    except Exception as e:
        logger.warning(f"Notice during rollback {MIGRATION_ID}: {e}")

