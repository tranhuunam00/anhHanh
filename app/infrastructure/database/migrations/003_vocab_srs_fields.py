"""Migration 003: Add SRS review fields (next_review_at, review_interval_days, mastery_score) to user_vocabulary table."""
import logging
from sqlalchemy import text

logger = logging.getLogger(__name__)

MIGRATION_ID = "003_vocab_srs_fields"


async def upgrade(conn) -> None:
    is_sqlite = conn.dialect.name == "sqlite"
    ts_type = "DATETIME" if is_sqlite else "TIMESTAMP WITH TIME ZONE"

    # 1. Add next_review_at to user_vocabulary (idempotent)
    try:
        await conn.execute(text(f"ALTER TABLE user_vocabulary ADD COLUMN next_review_at {ts_type} NULL;"))
        logger.info("Added next_review_at column to user_vocabulary.")
    except Exception:
        logger.debug("next_review_at column already exists on user_vocabulary — skipping.")

    # 2. Add review_interval_days
    try:
        await conn.execute(text("ALTER TABLE user_vocabulary ADD COLUMN review_interval_days INTEGER DEFAULT 1 NOT NULL;"))
        logger.info("Added review_interval_days column to user_vocabulary.")
    except Exception:
        logger.debug("review_interval_days column already exists on user_vocabulary — skipping.")

    # 3. Add mastery_score
    try:
        await conn.execute(text("ALTER TABLE user_vocabulary ADD COLUMN mastery_score INTEGER DEFAULT 0 NOT NULL;"))
        logger.info("Added mastery_score column to user_vocabulary.")
    except Exception:
        logger.debug("mastery_score column already exists on user_vocabulary — skipping.")

    logger.info(f"Migration {MIGRATION_ID} applied successfully.")
