"r""Async Database Engine & Session Management for DailyDictation Studio."""
import os
import logging
from typing import AsyncGenerator
from dotenv import load_dotenv
from sqlalchemy import event
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base

load_dotenv()

#Logging
logger = logging.getLogger(__name__)

# Base Model
Base = declarative_base()


def configure_sqlite_pragmas(target_engine):
    """Enables WAL journal mode, busy timeout, and memory cache for SQLite."""
    if not target_engine or not hasattr(target_engine, "sync_engine"):
        raise ValueError("target_engine must be a valid SQLAlchemy async engine with sync_engine attribute")

    @event.listens_for(target_engine.sync_engine, "connect")
    def _set_sqlite_pragmas(dbapi_connection, connection_record):
        try:
            cursor = dbapi_connection.cursor()
            cursor.execute("PRAGMA journal_mode=WAL;")
            cursor.execute("PRAGMA synchronous=NORMAL;")
            cursor.execute("PRAGMA busy_timeout=5000;")
            cursor.execute("PRAGMA cache_size=-64000;")
            cursor.close()
        except Exception as err:
            logger.warning(f"Error applying SQLite pragmas: {err}")

    return target_engine

# Resolve Database URL
DATABASE_URL = os.getenv("DATABASE_URL", "")
LOCAL_DATABASE_URL = os.getenv("LOCAL_DATABASE_URL", "sqlite+aiosqlite:///./data/dailydictation.db")

# Ensure data directory exists
os.makedirs("data", exist_ok=True)

def is_in_docker() -> bool:
    return os.path.exists("/.dockerenv") or os.getenv("RUNNING_IN_DOCKER") == "1"

# Select active URL (PostgreSQL in Docker, SQLite on local host for instant local startup)
if is_in_docker() and "postgres" in DATABASE_URL and not os.getenv("FORCE_SQLITE"):
    active_url = DATABASE_URL
    logger.info("Running in Docker container. Using PostgreSQL database.")
else:
    active_url = LOCAL_DATABASE_URL
    logger.info("Running on local host. Using SQLite database.")

# Engine kwargs if SQLite vs Postgres
engine_kwargs = {"echo": False, "future": True}
if "sqlite" in active_url:
    engine_kwargs["connect_args"] = {"check_same_thread": False}
else:
    engine_kwargs["pool_size"] = 10
    engine_kwargs["max_overflow"] = 20

engine = create_async_engine(active_url, **engine_kwargs)
if "sqlite" in active_url:
    configure_sqlite_pragmas(engine)
async_session_factory = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency for FastAPI routes to yield an isolated async database session."""
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db() -> None:
    """Create all 5 tables if they do not exist, and seed Super Admin."""
    import app.infrastructure.database.models  # noqa: F401 - ensure models are registered
    from app.infrastructure.database.seed import seed_super_admin

    global engine, async_session_factory
    is_sqlite = "sqlite" in active_url
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
            from sqlalchemy import text
            if not is_sqlite:
                # PostgreSQL natively supports IF NOT EXISTS for ADD COLUMN
                pg_sqls = [
                    "ALTER TABLE lessons ADD COLUMN IF NOT EXISTS youtube_url TEXT;",
                    "ALTER TABLE user_lessons ADD COLUMN IF NOT EXISTS source_lang VARCHAR(20) NOT NULL DEFAULT 'en';",
                    "ALTER TABLE user_lessons ADD COLUMN IF NOT EXISTS target_lang VARCHAR(20) NOT NULL DEFAULT 'vi';",
                    "ALTER TABLE user_vocabulary ADD COLUMN IF NOT EXISTS next_review_at TIMESTAMP WITH TIME ZONE NULL;",
                    "ALTER TABLE user_vocabulary ADD COLUMN IF NOT EXISTS review_interval_days INTEGER NOT NULL DEFAULT 1;",
                    "ALTER TABLE user_vocabulary ADD COLUMN IF NOT EXISTS mastery_score INTEGER NOT NULL DEFAULT 0;",
                    "ALTER TABLE user_vocabulary ADD COLUMN IF NOT EXISTS source_lang VARCHAR(10) DEFAULT 'en';",
                    "ALTER TABLE feedbacks ADD COLUMN IF NOT EXISTS image_url TEXT NULL;",
                    "ALTER TABLE feedbacks ADD COLUMN IF NOT EXISTS sender_name VARCHAR(100) DEFAULT 'Ẩn danh';",
                    "ALTER TABLE feedbacks ADD COLUMN IF NOT EXISTS sender_email VARCHAR(255) NULL;",
                    "ALTER TABLE feedbacks ALTER COLUMN user_id DROP NOT NULL;",
                    "ALTER TABLE writing_submissions ADD COLUMN IF NOT EXISTS language VARCHAR(10) NOT NULL DEFAULT 'en';",
                    "ALTER TABLE writing_submissions ADD COLUMN IF NOT EXISTS sub_type VARCHAR(50) DEFAULT 'general' NULL;",
                ]
                for sql in pg_sqls:
                    try:
                        await conn.execute(text(sql))
                    except Exception:
                        pass
            else:
                for sql in [
                    "ALTER TABLE lessons ADD COLUMN youtube_url TEXT NULL;",
                    "ALTER TABLE user_lessons ADD COLUMN source_lang VARCHAR(20) NOT NULL DEFAULT 'en';",
                    "ALTER TABLE user_lessons ADD COLUMN target_lang VARCHAR(20) NOT NULL DEFAULT 'vi';",
                    "ALTER TABLE user_vocabulary ADD COLUMN next_review_at DATETIME NULL;",
                    "ALTER TABLE user_vocabulary ADD COLUMN review_interval_days INTEGER NOT NULL DEFAULT 1;",
                    "ALTER TABLE user_vocabulary ADD COLUMN mastery_score INTEGER NOT NULL DEFAULT 0;",
                    "ALTER TABLE user_vocabulary ADD COLUMN source_lang VARCHAR(10) DEFAULT 'en';",
                    "ALTER TABLE feedbacks ADD COLUMN image_url TEXT NULL;",
                    "ALTER TABLE feedbacks ADD COLUMN sender_name VARCHAR(100) DEFAULT 'Ẩn danh';",
                    "ALTER TABLE feedbacks ADD COLUMN sender_email VARCHAR(255) NULL;",
                    "ALTER TABLE writing_submissions ADD COLUMN language VARCHAR(10) NOT NULL DEFAULT 'en';",
                    "ALTER TABLE writing_submissions ADD COLUMN sub_type VARCHAR(50) DEFAULT 'general' NULL;",
                ]:
                    try:
                        await conn.execute(text(sql))
                    except Exception:
                        pass
        logger.info("Database tables verified/created successfully.")
    except Exception as e:
        if is_in_docker() and "postgres" in DATABASE_URL:
            logger.error(f"PostgreSQL database error during startup: {e}", exc_info=True)
            raise
        logger.warning(f"Failed to connect to primary DB ({e}). Falling back to SQLite...")
        fallback_url = LOCAL_DATABASE_URL
        engine = create_async_engine(fallback_url, connect_args={"check_same_thread": False})
        configure_sqlite_pragmas(engine)
        async_session_factory = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Fallback SQLite tables initialized.")

    # Run automated database migrations
    try:
        from app.infrastructure.database.migrate import run_migrations
        await run_migrations(engine)
    except Exception as e:
        logger.warning(f"Database migration runner warning: {e}")

    # Automatically seed Super Admin account
    try:
        async with async_session_factory() as session:
            await seed_super_admin(session)
    except Exception as e:
        logger.warning(f"Could not seed admin: {e}")

