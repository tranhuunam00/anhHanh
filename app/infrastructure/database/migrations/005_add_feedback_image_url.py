"""Migration 005: Add image_url column to feedbacks table."""
from sqlalchemy import text

async def upgrade(conn):
    """Add image_url column if it does not already exist."""
    is_sqlite = conn.dialect.name == "sqlite"
    if is_sqlite:
        # SQLite doesn't support IF NOT EXISTS in ALTER TABLE
        try:
            await conn.execute(text("ALTER TABLE feedbacks ADD COLUMN image_url TEXT;"))
        except Exception:
            pass  # Column already exists
    else:
        await conn.execute(text("ALTER TABLE feedbacks ADD COLUMN IF NOT EXISTS image_url TEXT;"))
