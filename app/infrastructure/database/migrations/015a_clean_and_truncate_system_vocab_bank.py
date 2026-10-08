"""Migration 015: Truncate and clean all legacy dummy data in system_vocab_bank and user_vocabulary.
"""
import logging
from sqlalchemy import text

logger = logging.getLogger(__name__)

MIGRATION_ID = "015_clean_and_truncate_system_vocab_bank"


async def upgrade(conn) -> None:
    """Wipe all old dummy data from system_vocab_bank and polluted user_vocabulary."""
    logger.info(f"Migration {MIGRATION_ID}: Clearing system_vocab_bank table...")

    # 1. Truncate/Delete all data in system_vocab_bank
    await conn.execute(text("DELETE FROM system_vocab_bank;"))

    # 2. Clean polluted dummy words that were accidentally imported into user_vocabulary
    cleanup_user_vocab_sql = """
    DELETE FROM user_vocabulary 
    WHERE word LIKE '% core %' 
       OR word LIKE '%_key_%' 
       OR word LIKE '%_fr_%' 
       OR word LIKE '% élément %'
       OR meaning LIKE '% - mục %';
    """
    try:
        await conn.execute(text(cleanup_user_vocab_sql))
    except Exception as e:
        logger.warning(f"Notice cleaning user_vocabulary: {e}")

    logger.info(f"Migration {MIGRATION_ID} completed successfully.")


async def downgrade(conn) -> None:
    """Downgrade: No-op since deleted dummy data does not need restoration."""
    logger.info(f"Reverting {MIGRATION_ID}...")
