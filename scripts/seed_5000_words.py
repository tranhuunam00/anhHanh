"""Standalone CLI script to seed/update 5000 common English words into dictionary_words table.
Works across SQLite (local development) and PostgreSQL (Docker / Production).

Usage:
    Local:
        python scripts/seed_5000_words.py
    Production / Docker:
        docker exec -it dailydictation_web python scripts/seed_5000_words.py
"""
import os
import sys
import asyncio
import importlib
import logging
import time

# Ensure project root is in python path
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from sqlalchemy import text
from app.infrastructure.database.connection import engine

seed_module = importlib.import_module("app.infrastructure.database.migrations.008_seed_5000_dictionary_words")
seed_words = seed_module.upgrade

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("seed_dictionary")


async def main():
    logger.info("Starting dictionary seeding process...")
    t0 = time.time()
    try:
        async with engine.begin() as conn:
            await seed_words(conn)

            # Count total words in database
            res = await conn.execute(text("SELECT COUNT(*) FROM dictionary_words;"))
            count = res.scalar()
            logger.info(f"Database now contains {count} dictionary words.")

        elapsed = round(time.time() - t0, 2)
        print(f"\n Seeding completed in {elapsed}s! Total words in database: {count}")
    finally:
        await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())
