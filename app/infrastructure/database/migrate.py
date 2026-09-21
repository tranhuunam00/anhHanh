"""Automated, idempotent database migration runner for DailyDictation Studio.
Maintains schema_migrations tracking table and executes pending migration modules.
Supports SQLite, PostgreSQL, and standalone CLI execution.
"""
import os
import sys
import glob
import importlib
import importlib.util
import logging
import asyncio
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

logger = logging.getLogger(__name__)


async def run_migrations(target_engine=None) -> int:
    """Discover and execute all pending database migrations in order."""
    if target_engine is None:
        from app.infrastructure.database.connection import engine as conn_engine
        target_engine = conn_engine

    applied_count = 0
    migrations_dir = os.path.join(os.path.dirname(__file__), "migrations")

    async with target_engine.begin() as conn:
        # 1. Ensure schema_migrations tracking table exists
        is_sqlite = conn.dialect.name == "sqlite"
        ts_type = "DATETIME" if is_sqlite else "TIMESTAMP WITH TIME ZONE"
        await conn.execute(text(f"""
            CREATE TABLE IF NOT EXISTS schema_migrations (
                id VARCHAR(100) PRIMARY KEY,
                applied_at {ts_type} DEFAULT CURRENT_TIMESTAMP NOT NULL
            );
        """))

        # 2. Query already applied migrations
        res = await conn.execute(text("SELECT id FROM schema_migrations;"))
        applied_set = {row[0] for row in res.fetchall()}

        # 3. Discover migration files
        migration_files = sorted(glob.glob(os.path.join(migrations_dir, "[0-9]*.py")))

        for filepath in migration_files:
            filename = os.path.basename(filepath)
            mod_name = filename[:-3]  # strip .py

            if mod_name in applied_set:
                continue

            logger.info(f"Running database migration: {mod_name}...")

            # Import module dynamically
            spec = importlib.util.spec_from_file_location(f"app.infrastructure.database.migrations.{mod_name}", filepath)
            if spec and spec.loader:
                mod = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(mod)

                if hasattr(mod, "upgrade"):
                    await mod.upgrade(conn)
                    await conn.execute(
                        text("INSERT INTO schema_migrations (id) VALUES (:mid);"),
                        {"mid": mod_name}
                    )
                    applied_count += 1
                    logger.info(f"Migration {mod_name} completed successfully.")

    if applied_count > 0:
        logger.info(f"All database migrations applied. Total: {applied_count} new migration(s).")
    else:
        logger.debug("Database schema is up to date. No pending migrations.")

    return applied_count


async def _async_cli():
    from app.infrastructure.database.connection import engine
    print("Checking and applying database migrations...")
    try:
        count = await run_migrations(engine)
        print(f"Migrations run completed. {count} migration(s) applied.")
    finally:
        await engine.dispose()


def cli_main():
    """CLI runner: python -m app.infrastructure.database.migrate"""
    logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
    asyncio.run(_async_cli())


if __name__ == "__main__":
    cli_main()
