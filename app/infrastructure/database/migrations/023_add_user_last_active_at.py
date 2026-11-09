"""Migration 023: Add last_active_at column to users table.

Enables tracking online status for study buddies and friends.
"""
import logging
from sqlalchemy import text

logger = logging.getLogger(__name__)

MIGRATION_ID = "023_add_user_last_active_at"


async def upgrade(conn) -> None:
    """Add last_active_at column to users table."""
    is_sqlite = conn.dialect.name == "sqlite"
    ts_type = "DATETIME" if is_sqlite else "TIMESTAMP WITH TIME ZONE"

    try:
        if is_sqlite:
            res = await conn.execute(text("PRAGMA table_info(users);"))
            columns = [row[1] for row in res.fetchall()]
            if "last_active_at" not in columns:
                await conn.execute(text(f"ALTER TABLE users ADD COLUMN last_active_at {ts_type} NULL;"))
            logger.info(f"Migration {MIGRATION_ID}: Added last_active_at column to users (SQLite).")
        else:
            await conn.execute(text(f"ALTER TABLE users ADD COLUMN IF NOT EXISTS last_active_at {ts_type} NULL;"))
            logger.info(f"Migration {MIGRATION_ID}: Added last_active_at column to users (PostgreSQL).")
    except Exception as e:
        logger.error(f"Migration {MIGRATION_ID} upgrade failed: {e}")
        raise


async def downgrade(conn) -> None:
    """Downgrade: Remove last_active_at column if on PostgreSQL."""
    is_sqlite = conn.dialect.name == "sqlite"
    if not is_sqlite:
        try:
            await conn.execute(text("ALTER TABLE users DROP COLUMN IF EXISTS last_active_at;"))
            logger.info(f"Migration {MIGRATION_ID}: Dropped last_active_at column from users.")
        except Exception as e:
            logger.warning(f"Migration {MIGRATION_ID} downgrade failed: {e}")

