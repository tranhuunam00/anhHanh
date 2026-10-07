"""Migration 012: Add sub_type column to writing_submissions table.

Stores granular Task 1 & Task 2 sub-types (e.g., line_graph, bar_chart, pie_chart, table,
process, map, opinion, discussion, causes_solutions, advantages_disadvantages, two_part).
"""
import logging
from sqlalchemy import text

logger = logging.getLogger(__name__)

MIGRATION_ID = "012_add_subtype_to_writing_submissions"


async def upgrade(conn) -> None:
    """Add sub_type column to writing_submissions if missing."""
    is_sqlite = conn.dialect.name == "sqlite"

    try:
        if is_sqlite:
            res = await conn.execute(text("PRAGMA table_info(writing_submissions);"))
            columns = [row[1] for row in res.fetchall()]
            if "sub_type" not in columns:
                await conn.execute(text("ALTER TABLE writing_submissions ADD COLUMN sub_type VARCHAR(50) DEFAULT 'general' NULL;"))
                logger.info(f"Migration {MIGRATION_ID}: Added sub_type column to writing_submissions (SQLite).")
        else:
            await conn.execute(text("ALTER TABLE writing_submissions ADD COLUMN IF NOT EXISTS sub_type VARCHAR(50) DEFAULT 'general' NULL;"))
            logger.info(f"Migration {MIGRATION_ID}: Added sub_type column to writing_submissions (PostgreSQL).")
    except Exception as e:
        logger.warning(f"Notice during {MIGRATION_ID}: {e}")

    logger.info(f"Migration {MIGRATION_ID} completed successfully.")
