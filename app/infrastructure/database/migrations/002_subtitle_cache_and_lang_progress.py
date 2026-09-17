"""Migration 002: Add lesson_subtitles table and source_lang/target_lang to user_lessons.

Changes:
- lessons: add youtube_url column
- lesson_subtitles: new table to cache raw YouTube subtitles per lang_code
- user_lessons: add source_lang + target_lang columns, replace unique constraint
"""
import logging
from sqlalchemy import text

logger = logging.getLogger(__name__)

MIGRATION_ID = "002_subtitle_cache_and_lang_progress"


async def upgrade(conn) -> None:
    is_sqlite = conn.dialect.name == "sqlite"
    ts_type = "DATETIME" if is_sqlite else "TIMESTAMP WITH TIME ZONE"
    json_type = "JSON"

    # 1. Add youtube_url to lessons (idempotent)
    try:
        await conn.execute(text("ALTER TABLE lessons ADD COLUMN youtube_url TEXT NULL;"))
        logger.info("Added youtube_url column to lessons.")
    except Exception:
        logger.debug("youtube_url column already exists on lessons — skipping.")

    # 2. Create lesson_subtitles table
    await conn.execute(text(f"""
        CREATE TABLE IF NOT EXISTS lesson_subtitles (
            id VARCHAR(36) PRIMARY KEY,
            lesson_id VARCHAR(36) NOT NULL,
            lang_code VARCHAR(20) NOT NULL,
            raw_data {json_type} NOT NULL,
            fetched_at {ts_type} DEFAULT CURRENT_TIMESTAMP NOT NULL,
            FOREIGN KEY (lesson_id) REFERENCES lessons (id) ON DELETE CASCADE,
            CONSTRAINT uq_lesson_subtitle UNIQUE (lesson_id, lang_code)
        );
    """))

    try:
        await conn.execute(text(
            "CREATE INDEX IF NOT EXISTS ix_lesson_subtitles_lesson_id ON lesson_subtitles (lesson_id);"
        ))
    except Exception as e:
        logger.debug(f"Index notice: {e}")

    # 3. Add source_lang + target_lang to user_lessons (idempotent)
    for col, default in [("source_lang", "en"), ("target_lang", "vi")]:
        try:
            await conn.execute(text(
                f"ALTER TABLE user_lessons ADD COLUMN {col} VARCHAR(20) NOT NULL DEFAULT '{default}';"
            ))
            logger.info(f"Added {col} column to user_lessons.")
        except Exception:
            logger.debug(f"{col} column already exists on user_lessons — skipping.")

    # 4. Drop old unique constraint (user_id, lesson_id) and create new one
    # PostgreSQL: use pg_constraint; SQLite doesn't support DROP CONSTRAINT → recreate table not needed
    # since the new constraint is a superset (more permissive than the old one)
    if not is_sqlite:
        try:
            await conn.execute(text(
                "ALTER TABLE user_lessons DROP CONSTRAINT IF EXISTS uq_user_lesson;"
            ))
            logger.info("Dropped old uq_user_lesson constraint.")
        except Exception as e:
            logger.debug(f"Drop old constraint notice: {e}")

        try:
            await conn.execute(text("""
                ALTER TABLE user_lessons
                ADD CONSTRAINT uq_user_lesson_lang
                UNIQUE (user_id, lesson_id, source_lang, target_lang);
            """))
            logger.info("Added new uq_user_lesson_lang constraint.")
        except Exception as e:
            logger.debug(f"New constraint notice (may already exist): {e}")
    else:
        # SQLite: just create a unique index (no ALTER CONSTRAINT)
        try:
            await conn.execute(text(
                "CREATE UNIQUE INDEX IF NOT EXISTS uq_user_lesson_lang "
                "ON user_lessons (user_id, lesson_id, source_lang, target_lang);"
            ))
        except Exception as e:
            logger.debug(f"SQLite unique index notice: {e}")

    logger.info(f"Migration {MIGRATION_ID} applied successfully.")
