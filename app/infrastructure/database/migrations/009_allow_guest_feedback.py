"""Migration 009: Allow guest / unauthenticated feedback with sender_name and sender_email.

Changes:
- feedbacks: user_id becomes nullable (NULL for guest users)
- feedbacks: add sender_name VARCHAR(100) DEFAULT 'Ẩn danh'
- feedbacks: add sender_email VARCHAR(255) NULL
"""
import logging
from sqlalchemy import text

logger = logging.getLogger(__name__)

MIGRATION_ID = "009_allow_guest_feedback"


async def upgrade(conn) -> None:
    is_sqlite = conn.dialect.name == "sqlite"

    if is_sqlite:
        # Check existing columns in SQLite feedbacks
        res = await conn.execute(text("PRAGMA table_info(feedbacks);"))
        columns = {row[1]: row for row in res.fetchall()}

        # 1. Add sender_name if missing
        if "sender_name" not in columns:
            await conn.execute(text("ALTER TABLE feedbacks ADD COLUMN sender_name VARCHAR(100) DEFAULT 'Ẩn danh';"))
            logger.info("Added sender_name column to feedbacks table (SQLite).")

        # 2. Add sender_email if missing
        if "sender_email" not in columns:
            await conn.execute(text("ALTER TABLE feedbacks ADD COLUMN sender_email VARCHAR(255) NULL;"))
            logger.info("Added sender_email column to feedbacks table (SQLite).")

        # 3. Check if user_id is marked NOT NULL (row[3] == 1 in pragma table_info)
        user_id_col = columns.get("user_id")
        if user_id_col and user_id_col[3] == 1:
            logger.info("Rebuilding feedbacks table in SQLite to allow NULL user_id for guest feedbacks...")
            await conn.execute(text("PRAGMA foreign_keys = OFF;"))
            await conn.execute(text("""
                CREATE TABLE IF NOT EXISTS feedbacks_new (
                    id VARCHAR(36) PRIMARY KEY,
                    user_id VARCHAR(36) NULL,
                    sender_name VARCHAR(100) DEFAULT 'Ẩn danh',
                    sender_email VARCHAR(255) NULL,
                    feedback_type VARCHAR(50) DEFAULT 'GENERAL' NOT NULL,
                    rating INTEGER NULL,
                    content TEXT NOT NULL,
                    image_url TEXT NULL,
                    status VARCHAR(20) DEFAULT 'PENDING' NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
                );
            """))
            await conn.execute(text("""
                INSERT INTO feedbacks_new (id, user_id, sender_name, sender_email, feedback_type, rating, content, image_url, status, created_at)
                SELECT id, user_id,
                       COALESCE(sender_name, 'Ẩn danh'),
                       sender_email,
                       feedback_type, rating, content, image_url, status, created_at
                FROM feedbacks;
            """))
            await conn.execute(text("DROP TABLE feedbacks;"))
            await conn.execute(text("ALTER TABLE feedbacks_new RENAME TO feedbacks;"))
            await conn.execute(text("CREATE INDEX IF NOT EXISTS ix_feedbacks_user_id ON feedbacks (user_id);"))
            await conn.execute(text("CREATE INDEX IF NOT EXISTS ix_feedbacks_status ON feedbacks (status);"))
            await conn.execute(text("PRAGMA foreign_keys = ON;"))
            logger.info("SQLite feedbacks table rebuilt with nullable user_id.")
    else:
        # PostgreSQL
        try:
            await conn.execute(text("ALTER TABLE feedbacks ALTER COLUMN user_id DROP NOT NULL;"))
            await conn.execute(text("ALTER TABLE feedbacks ADD COLUMN IF NOT EXISTS sender_name VARCHAR(100) DEFAULT 'Ẩn danh';"))
            await conn.execute(text("ALTER TABLE feedbacks ADD COLUMN IF NOT EXISTS sender_email VARCHAR(255) NULL;"))
            logger.info("Updated PostgreSQL feedbacks table: user_id is now nullable, sender_name & sender_email added.")
        except Exception as e:
            logger.warning(f"PostgreSQL alter feedbacks table notice: {e}")

    logger.info(f"Migration {MIGRATION_ID} applied successfully.")
