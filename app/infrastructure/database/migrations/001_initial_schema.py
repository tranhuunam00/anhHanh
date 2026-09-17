"""Migration 001: Initial Full Database Schema for DailyDictation Studio.
Creates all 6 core tables: users, lessons, user_lessons, user_vocabulary, user_streaks, feedbacks.
Compatible with SQLite (local development) and PostgreSQL (production deployment).
"""
import logging
from sqlalchemy import text

logger = logging.getLogger(__name__)

MIGRATION_ID = "001_initial_schema"


async def upgrade(conn) -> None:
    """Create all core database tables, foreign keys, and indexes if they do not exist."""
    is_sqlite = conn.dialect.name == "sqlite"
    ts_type = "DATETIME" if is_sqlite else "TIMESTAMP WITH TIME ZONE"
    json_type = "JSON" if not is_sqlite else "JSON"
    bool_default = "0" if is_sqlite else "FALSE"

    statements = [
        # 1. users
        f"""
        CREATE TABLE IF NOT EXISTS users (
            id VARCHAR(36) PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NULL,
            google_id VARCHAR(100) UNIQUE NULL,
            name VARCHAR(100) NOT NULL,
            role VARCHAR(20) DEFAULT 'USER' NOT NULL,
            avatar_url TEXT NULL,
            created_at {ts_type} DEFAULT CURRENT_TIMESTAMP NOT NULL
        );
        """,

        # 2. lessons
        f"""
        CREATE TABLE IF NOT EXISTS lessons (
            id VARCHAR(36) PRIMARY KEY,
            video_id VARCHAR(50) UNIQUE NOT NULL,
            title VARCHAR(500) NOT NULL,
            thumbnail_url TEXT NOT NULL,
            total_challenges INTEGER DEFAULT 0 NOT NULL,
            sentences_data {json_type} NOT NULL,
            created_at {ts_type} DEFAULT CURRENT_TIMESTAMP NOT NULL
        );
        """,

        # 3. user_lessons
        f"""
        CREATE TABLE IF NOT EXISTS user_lessons (
            id VARCHAR(36) PRIMARY KEY,
            user_id VARCHAR(36) NOT NULL,
            lesson_id VARCHAR(36) NOT NULL,
            current_position INTEGER DEFAULT 1 NOT NULL,
            is_completed BOOLEAN DEFAULT {bool_default} NOT NULL,
            started_at {ts_type} DEFAULT CURRENT_TIMESTAMP NOT NULL,
            last_studied_at {ts_type} DEFAULT CURRENT_TIMESTAMP NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
            FOREIGN KEY (lesson_id) REFERENCES lessons (id) ON DELETE CASCADE,
            CONSTRAINT uq_user_lesson UNIQUE (user_id, lesson_id)
        );
        """,

        # 4. user_vocabulary
        f"""
        CREATE TABLE IF NOT EXISTS user_vocabulary (
            id VARCHAR(36) PRIMARY KEY,
            user_id VARCHAR(36) NOT NULL,
            word VARCHAR(100) NOT NULL,
            phonetic VARCHAR(100) NULL,
            meaning TEXT NOT NULL,
            context_sentence TEXT NOT NULL,
            image_url TEXT NULL,
            video_id VARCHAR(50) NULL,
            video_timestamp FLOAT NULL,
            status VARCHAR(20) DEFAULT 'NEW' NOT NULL,
            created_at {ts_type} DEFAULT CURRENT_TIMESTAMP NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        );
        """,

        # 5. user_streaks
        f"""
        CREATE TABLE IF NOT EXISTS user_streaks (
            id VARCHAR(36) PRIMARY KEY,
            user_id VARCHAR(36) UNIQUE NOT NULL,
            current_streak INTEGER DEFAULT 0 NOT NULL,
            longest_streak INTEGER DEFAULT 0 NOT NULL,
            words_today INTEGER DEFAULT 0 NOT NULL,
            last_study_date DATE NULL,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        );
        """,

        # 6. feedbacks
        f"""
        CREATE TABLE IF NOT EXISTS feedbacks (
            id VARCHAR(36) PRIMARY KEY,
            user_id VARCHAR(36) NOT NULL,
            feedback_type VARCHAR(50) DEFAULT 'GENERAL' NOT NULL,
            rating INTEGER NULL,
            content TEXT NOT NULL,
            status VARCHAR(20) DEFAULT 'PENDING' NOT NULL,
            created_at {ts_type} DEFAULT CURRENT_TIMESTAMP NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        );
        """
    ]

    indexes = [
        "CREATE INDEX IF NOT EXISTS ix_users_email ON users (email);",
        "CREATE INDEX IF NOT EXISTS ix_users_google_id ON users (google_id);",
        "CREATE INDEX IF NOT EXISTS ix_lessons_video_id ON lessons (video_id);",
        "CREATE INDEX IF NOT EXISTS ix_user_lessons_user_id ON user_lessons (user_id);",
        "CREATE INDEX IF NOT EXISTS ix_user_lessons_lesson_id ON user_lessons (lesson_id);",
        "CREATE INDEX IF NOT EXISTS ix_user_vocabulary_user_id ON user_vocabulary (user_id);",
        "CREATE INDEX IF NOT EXISTS ix_user_vocabulary_word ON user_vocabulary (word);",
        "CREATE INDEX IF NOT EXISTS ix_user_streaks_user_id ON user_streaks (user_id);",
        "CREATE INDEX IF NOT EXISTS ix_feedbacks_user_id ON feedbacks (user_id);",
        "CREATE INDEX IF NOT EXISTS ix_feedbacks_status ON feedbacks (status);"
    ]

    for stmt in statements:
        await conn.execute(text(stmt))

    for idx_stmt in indexes:
        try:
            await conn.execute(text(idx_stmt))
        except Exception as e:
            logger.debug(f"Index notice for {idx_stmt}: {e}")

    logger.info(f"Migration {MIGRATION_ID} (Initial Clean Schema) applied successfully.")
