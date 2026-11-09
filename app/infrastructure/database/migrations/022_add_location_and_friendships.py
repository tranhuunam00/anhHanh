"""Migration 022: Add location fields to users and create friendships table.

Enables location-based study buddies discovery and peer friendships.
Includes latitude, longitude, location_updated_at, is_location_sharing, study_target, bio.
"""
import logging
from sqlalchemy import text

logger = logging.getLogger(__name__)

MIGRATION_ID = "022_add_location_and_friendships"


async def upgrade(conn) -> None:
    """Add location columns to users and create friendships table."""
    is_sqlite = conn.dialect.name == "sqlite"
    ts_type = "DATETIME" if is_sqlite else "TIMESTAMP WITH TIME ZONE"
    bool_type = "BOOLEAN"

    try:
        # 1. Add columns to users table
        if is_sqlite:
            res = await conn.execute(text("PRAGMA table_info(users);"))
            columns = [row[1] for row in res.fetchall()]
            if "latitude" not in columns:
                await conn.execute(text("ALTER TABLE users ADD COLUMN latitude REAL NULL;"))
            if "longitude" not in columns:
                await conn.execute(text("ALTER TABLE users ADD COLUMN longitude REAL NULL;"))
            if "location_updated_at" not in columns:
                await conn.execute(text(f"ALTER TABLE users ADD COLUMN location_updated_at {ts_type} NULL;"))
            if "is_location_sharing" not in columns:
                await conn.execute(text(f"ALTER TABLE users ADD COLUMN is_location_sharing {bool_type} DEFAULT 1;"))
            if "study_target" not in columns:
                await conn.execute(text("ALTER TABLE users ADD COLUMN study_target VARCHAR(100) DEFAULT 'Luyện nghe & Chép chính tả';"))
            if "bio" not in columns:
                await conn.execute(text("ALTER TABLE users ADD COLUMN bio VARCHAR(255) NULL;"))
            logger.info(f"Migration {MIGRATION_ID}: Added location columns to users (SQLite).")
        else:
            await conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION NULL;"))
            await conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION NULL;"))
            await conn.execute(text(f"ALTER TABLE users ADD COLUMN IF NOT EXISTS location_updated_at {ts_type} NULL;"))
            await conn.execute(text(f"ALTER TABLE users ADD COLUMN IF NOT EXISTS is_location_sharing {bool_type} DEFAULT TRUE;"))
            await conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS study_target VARCHAR(100) DEFAULT 'Luyện nghe & Chép chính tả';"))
            await conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS bio VARCHAR(255) NULL;"))
            logger.info(f"Migration {MIGRATION_ID}: Added location columns to users (PostgreSQL).")

        # 2. Create friendships table
        if is_sqlite:
            await conn.execute(text(f"""
                CREATE TABLE IF NOT EXISTS friendships (
                    id VARCHAR(36) PRIMARY KEY,
                    sender_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    receiver_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
                    created_at {ts_type} NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    updated_at {ts_type} NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    CONSTRAINT uq_friendship_sender_receiver UNIQUE (sender_id, receiver_id)
                );
            """))
            await conn.execute(text("CREATE INDEX IF NOT EXISTS idx_friendships_receiver_status ON friendships(receiver_id, status);"))
            await conn.execute(text("CREATE INDEX IF NOT EXISTS idx_friendships_sender_status ON friendships(sender_id, status);"))
            logger.info(f"Migration {MIGRATION_ID}: Created friendships table (SQLite).")
        else:
            await conn.execute(text(f"""
                CREATE TABLE IF NOT EXISTS friendships (
                    id VARCHAR(36) PRIMARY KEY,
                    sender_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    receiver_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
                    created_at {ts_type} NOT NULL DEFAULT NOW(),
                    updated_at {ts_type} NOT NULL DEFAULT NOW(),
                    CONSTRAINT uq_friendship_sender_receiver UNIQUE (sender_id, receiver_id)
                );
            """))
            await conn.execute(text("CREATE INDEX IF NOT EXISTS idx_friendships_receiver_status ON friendships(receiver_id, status);"))
            await conn.execute(text("CREATE INDEX IF NOT EXISTS idx_friendships_sender_status ON friendships(sender_id, status);"))
            logger.info(f"Migration {MIGRATION_ID}: Created friendships table (PostgreSQL).")

    except Exception as e:
        logger.warning(f"Notice during {MIGRATION_ID}: {e}")

    logger.info(f"Migration {MIGRATION_ID} completed successfully.")


async def downgrade(conn) -> None:
    """Revert migration if supported by dialect."""
    is_sqlite = conn.dialect.name == "sqlite"
    try:
        await conn.execute(text("DROP TABLE IF EXISTS friendships;"))
        if not is_sqlite:
            await conn.execute(text("ALTER TABLE users DROP COLUMN IF EXISTS latitude;"))
            await conn.execute(text("ALTER TABLE users DROP COLUMN IF EXISTS longitude;"))
            await conn.execute(text("ALTER TABLE users DROP COLUMN IF EXISTS location_updated_at;"))
            await conn.execute(text("ALTER TABLE users DROP COLUMN IF EXISTS is_location_sharing;"))
            await conn.execute(text("ALTER TABLE users DROP COLUMN IF EXISTS study_target;"))
            await conn.execute(text("ALTER TABLE users DROP COLUMN IF EXISTS bio;"))
            logger.info(f"Migration {MIGRATION_ID} downgraded successfully (PostgreSQL).")
        else:
            logger.info(f"Migration {MIGRATION_ID}: Dropped friendships table (SQLite).")
    except Exception as e:
        logger.warning(f"Notice during rollback {MIGRATION_ID}: {e}")

