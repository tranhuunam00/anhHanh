"""Migration 006: Create feedback_messages table for two-way conversations between Admin and Users.

Maintains full threaded message history with MinIO attachments and read status tracking.
"""
import logging
from sqlalchemy import text

logger = logging.getLogger(__name__)

MIGRATION_ID = "006_feedback_conversations"


async def upgrade(conn) -> None:
    """Create feedback_messages table and relevant indexes."""
    is_sqlite = conn.dialect.name == "sqlite"
    ts_type = "DATETIME" if is_sqlite else "TIMESTAMP WITH TIME ZONE"
    bool_type = "BOOLEAN"

    stmt = f"""
    CREATE TABLE IF NOT EXISTS feedback_messages (
        id VARCHAR(36) PRIMARY KEY,
        feedback_id VARCHAR(36) NOT NULL,
        user_id VARCHAR(36) NOT NULL,
        sender_role VARCHAR(20) NOT NULL,
        message TEXT NOT NULL,
        image_url TEXT NULL,
        is_read {bool_type} DEFAULT FALSE NOT NULL,
        created_at {ts_type} DEFAULT CURRENT_TIMESTAMP NOT NULL,
        FOREIGN KEY (feedback_id) REFERENCES feedbacks (id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );
    """
    await conn.execute(text(stmt))

    indexes = [
        "CREATE INDEX IF NOT EXISTS ix_feedback_messages_feedback_id ON feedback_messages (feedback_id);",
        "CREATE INDEX IF NOT EXISTS ix_feedback_messages_user_id ON feedback_messages (user_id);",
        "CREATE INDEX IF NOT EXISTS ix_feedback_messages_is_read ON feedback_messages (is_read);"
    ]
    for idx_sql in indexes:
        try:
            await conn.execute(text(idx_sql))
        except Exception as e:
            logger.debug(f"Index notice for {idx_sql}: {e}")

    logger.info(f"Migration {MIGRATION_ID} (Feedback Conversations) applied successfully.")
