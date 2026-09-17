"r""Async Database Engine & Session Management for DailyDictation Studio."""
import os
import logging
from typing import AsyncGenerator
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base

load_dotenv()

#Logging
logger = logging.getLogger(__name__)

# Base Model
Base = declarative_base()

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
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Database tables verified/created successfully.")
    except Exception as e:
        logger.warning(f"Failed to connect to primary DB ({e}). Falling back to SQLite...")
        fallback_url = LOCAL_DATABASE_URL
        engine = create_async_engine(fallback_url, connect_args={"check_same_thread": False})
        async_session_factory = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Fallback SQLite tables initialized.")

    # Automatically seed Super Admin account
    try:
        async with async_session_factory() as session:
            await seed_super_admin(session)
    except Exception as e:
        logger.warning(f"Could not seed admin: {e}")
