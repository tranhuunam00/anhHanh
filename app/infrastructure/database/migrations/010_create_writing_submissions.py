"""Migration 010: Create writing_submissions table for AI Writing Studio.

Stores user essay practice submissions, draft versions, IELTS Band 0-9 scores,
detailed criteria scores (TR, CC, LR, GRA), and Gemini AI academic evaluations.
"""
import logging
from sqlalchemy import text

logger = logging.getLogger(__name__)

MIGRATION_ID = "010_create_writing_submissions"


async def upgrade(conn) -> None:
    """Create writing_submissions table and relevant indexes."""
    is_sqlite = conn.dialect.name == "sqlite"
    ts_type = "DATETIME" if is_sqlite else "TIMESTAMP WITH TIME ZONE"
    float_type = "REAL" if is_sqlite else "DOUBLE PRECISION"

    stmt = f"""
    CREATE TABLE IF NOT EXISTS writing_submissions (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        topic TEXT NOT NULL,
        genre VARCHAR(50) DEFAULT 'ielts_task2' NOT NULL,
        content TEXT NOT NULL,
        word_count INTEGER DEFAULT 0 NOT NULL,
        target_band {float_type} DEFAULT 7.0 NULL,
        overall_score {float_type} NULL,
        task_response_score {float_type} NULL,
        coherence_score {float_type} NULL,
        lexical_score {float_type} NULL,
        grammar_score {float_type} NULL,
        feedback_json TEXT NULL,
        created_at {ts_type} DEFAULT CURRENT_TIMESTAMP NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );
    """
    await conn.execute(text(stmt))

    indexes = [
        "CREATE INDEX IF NOT EXISTS ix_writing_submissions_user_id ON writing_submissions (user_id);",
        "CREATE INDEX IF NOT EXISTS ix_writing_submissions_created_at ON writing_submissions (created_at);",
        "CREATE INDEX IF NOT EXISTS ix_writing_submissions_genre ON writing_submissions (genre);"
    ]
    for idx_sql in indexes:
        try:
            await conn.execute(text(idx_sql))
        except Exception as e:
            logger.debug(f"Index notice for {idx_sql}: {e}")

    logger.info(f"Migration {MIGRATION_ID} (Writing Submissions) applied successfully.")
