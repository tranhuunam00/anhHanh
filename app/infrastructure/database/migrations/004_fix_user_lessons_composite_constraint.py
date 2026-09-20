"""Migration 004: Fix user_lessons unique constraint to support multiple language pairs.

Changes:
- user_lessons: Drop old uq_user_lesson constraint (user_id, lesson_id)
- user_lessons: Ensure uq_user_lesson_lang constraint on (user_id, lesson_id, source_lang, target_lang)
"""
import logging
from sqlalchemy import text

logger = logging.getLogger(__name__)

MIGRATION_ID = "004_fix_user_lessons_composite_constraint"


async def upgrade(conn) -> None:
    is_sqlite = conn.dialect.name == "sqlite"

    if is_sqlite:
        # SQLite: Inspect table definition to check if old constraint exists
        res = await conn.execute(text("SELECT sql FROM sqlite_master WHERE type='table' AND name='user_lessons';"))
        row = res.fetchone()
        table_sql = row[0] if row else ""

        if "uq_user_lesson UNIQUE" in table_sql or "UNIQUE (user_id, lesson_id)" in table_sql:
            logger.info("Rebuilding user_lessons table in SQLite to remove legacy unique constraint...")
            await conn.execute(text("PRAGMA foreign_keys = OFF;"))
            await conn.execute(text("""
                CREATE TABLE IF NOT EXISTS user_lessons_new (
                    id VARCHAR(36) PRIMARY KEY,
                    user_id VARCHAR(36) NOT NULL,
                    lesson_id VARCHAR(36) NOT NULL,
                    source_lang VARCHAR(20) NOT NULL DEFAULT 'en',
                    target_lang VARCHAR(20) NOT NULL DEFAULT 'vi',
                    current_position INTEGER DEFAULT 1 NOT NULL,
                    is_completed BOOLEAN DEFAULT 0 NOT NULL,
                    started_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
                    last_studied_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
                    FOREIGN KEY (lesson_id) REFERENCES lessons (id) ON DELETE CASCADE,
                    CONSTRAINT uq_user_lesson_lang UNIQUE (user_id, lesson_id, source_lang, target_lang)
                );
            """))
            await conn.execute(text("""
                INSERT INTO user_lessons_new (id, user_id, lesson_id, source_lang, target_lang, current_position, is_completed, started_at, last_studied_at)
                SELECT id, user_id, lesson_id,
                       COALESCE(source_lang, 'en'),
                       COALESCE(target_lang, 'vi'),
                       current_position, is_completed, started_at, last_studied_at
                FROM user_lessons;
            """))
            await conn.execute(text("DROP TABLE user_lessons;"))
            await conn.execute(text("ALTER TABLE user_lessons_new RENAME TO user_lessons;"))
            await conn.execute(text("CREATE INDEX IF NOT EXISTS ix_user_lessons_user_id ON user_lessons (user_id);"))
            await conn.execute(text("CREATE INDEX IF NOT EXISTS ix_user_lessons_lesson_id ON user_lessons (lesson_id);"))
            await conn.execute(text("CREATE UNIQUE INDEX IF NOT EXISTS uq_user_lesson_lang ON user_lessons (user_id, lesson_id, source_lang, target_lang);"))
            await conn.execute(text("PRAGMA foreign_keys = ON;"))
            logger.info("SQLite user_lessons table rebuilt with uq_user_lesson_lang constraint.")
    else:
        # PostgreSQL
        try:
            await conn.execute(text("ALTER TABLE user_lessons DROP CONSTRAINT IF EXISTS uq_user_lesson;"))
            logger.info("Dropped old uq_user_lesson constraint.")
        except Exception as e:
            logger.debug(f"Drop constraint notice: {e}")

        try:
            await conn.execute(text("""
                ALTER TABLE user_lessons
                DROP CONSTRAINT IF EXISTS uq_user_lesson_lang;
                ALTER TABLE user_lessons
                ADD CONSTRAINT uq_user_lesson_lang
                UNIQUE (user_id, lesson_id, source_lang, target_lang);
            """))
            logger.info("Added uq_user_lesson_lang constraint on user_lessons.")
        except Exception as e:
            logger.debug(f"Constraint notice: {e}")

    logger.info(f"Migration {MIGRATION_ID} applied successfully.")
