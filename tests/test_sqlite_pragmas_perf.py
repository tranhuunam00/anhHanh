"""Unit tests for SQLite pragmas performance configuration.
Follows AGENTS.md Rule 6:
- 1. Input Coverage
- 2. Output Verification
- 3. Internal Logic Coverage
- 4. Error & Exception Handling
"""
import pytest
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine
from app.infrastructure.database.connection import configure_sqlite_pragmas


@pytest.mark.asyncio
async def test_configure_sqlite_pragmas_happy_path(tmp_path):
    """Happy path: successfully configures WAL, NORMAL synchronous, and memory cache."""
    db_file = tmp_path / "test_perf.db"
    db_url = f"sqlite+aiosqlite:///{db_file}"
    engine = create_async_engine(db_url)

    result_engine = configure_sqlite_pragmas(engine)
    assert result_engine is engine

    async with result_engine.connect() as conn:
        journal = (await conn.execute(text("PRAGMA journal_mode;"))).scalar()
        sync = (await conn.execute(text("PRAGMA synchronous;"))).scalar()
        busy = (await conn.execute(text("PRAGMA busy_timeout;"))).scalar()
        cache = (await conn.execute(text("PRAGMA cache_size;"))).scalar()

        assert journal.lower() == "wal"
        assert sync in (1, "1", "NORMAL")  # 1 corresponds to NORMAL
        assert busy == 5000
        assert cache == -64000

    await result_engine.dispose()


def test_configure_sqlite_pragmas_input_validation():
    """Input coverage: validates bad inputs and raises ValueError."""
    # None input
    with pytest.raises(ValueError, match="target_engine must be a valid SQLAlchemy async engine"):
        configure_sqlite_pragmas(None)

    # Object without sync_engine
    with pytest.raises(ValueError, match="target_engine must be a valid SQLAlchemy async engine"):
        configure_sqlite_pragmas("invalid_string_engine")

    with pytest.raises(ValueError, match="target_engine must be a valid SQLAlchemy async engine"):
        configure_sqlite_pragmas({})
