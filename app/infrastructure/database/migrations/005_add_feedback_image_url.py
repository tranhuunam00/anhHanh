"""Migration 005: Add image_url column to feedbacks table."""
import logging
from sqlalchemy import text

logger = logging.getLogger(__name__)

MIGRATION_ID = "005_add_feedback_image_url"

async def upgrade(conn):
    """Add image_url column if it does not already exist."""
    is_sqlite = conn.dialect.name == "sqlite"
    if is_sqlite:
        # SQLite doesn't support IF NOT EXISTS in ALTER TABLE
        try:
            await conn.execute(text("ALTER TABLE feedbacks ADD COLUMN image_url TEXT;"))
            logger.info("Added image_url column to feedbacks table (SQLite).")
        except Exception:
            pass  # Column already exists
    else:
        await conn.execute(text("ALTER TABLE feedbacks ADD COLUMN IF NOT EXISTS image_url TEXT;"))
        logger.info("Added image_url column to feedbacks table (PostgreSQL).")
