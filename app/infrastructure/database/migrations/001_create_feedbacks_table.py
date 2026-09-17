"""Migration 001: Create feedbacks table.
Compatible with SQLite and PostgreSQL.
"""
import logging
from sqlalchemy import text

logger = logging.getLogger(__name__)

MIGRATION_ID = "001_create_feedbacks_table"


async def upgrade(conn) -> None:
    """Create feedbacks table if it does not exist."""
    # Check if table already exists (works for both SQLite and PostgreSQL)
    is_sqlite = conn.dialect.name == "sqlite"

    create_table_sql = """
    CREATE TABLE IF NOT EXISTS feedbacks (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        feedback_type VARCHAR(50) DEFAULT 'GENERAL' NOT NULL,
        rating INTEGER NULL,
        content TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'PENDING' NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );
    """
    if is_sqlite:
        create_table_sql = """
        CREATE TABLE IF NOT EXISTS feedbacks (
            id VARCHAR(36) PRIMARY KEY,
            user_id VARCHAR(36) NOT NULL,
            feedback_type VARCHAR(50) DEFAULT 'GENERAL' NOT NULL,
            rating INTEGER NULL,
            content TEXT NOT NULL,
            status VARCHAR(20) DEFAULT 'PENDING' NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        );
        """

    await conn.execute(text(create_table_sql))

    # Create index on user_id and status
    try:
        await conn.execute(text("CREATE INDEX IF NOT EXISTS ix_feedbacks_user_id ON feedbacks (user_id);"))
        await conn.execute(text("CREATE INDEX IF NOT EXISTS ix_feedbacks_status ON feedbacks (status);"))
    except Exception as e:
        logger.debug(f"Index creation note: {e}")

    logger.info(f"Migration {MIGRATION_ID} applied successfully.")
