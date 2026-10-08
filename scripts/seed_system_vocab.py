"""Standalone CLI script to seed 6,000 curated words into system_vocab_bank table.
Works across SQLite and PostgreSQL (Production VPS).

Usage:
    Local / VPS:
        python scripts/seed_system_vocab.py
    Docker:
        docker exec -it shotlang python scripts/seed_system_vocab.py
"""
import os
import sys
import asyncio
import logging
import time

# Ensure project root is in python path
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from app.infrastructure.database.connection import engine
from app.infrastructure.database.seed_system_vocab import ensure_system_vocab_seeded

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("seed_system_vocab")


async def main():
    logger.info("Starting System Vocabulary Bank Seeding...")
    t0 = time.time()
    try:
        count = await ensure_system_vocab_seeded(engine, force_reseed=True)
        elapsed = round(time.time() - t0, 2)
        print(f"\n✅ Seeding completed in {elapsed}s! Total system vocab bank items: {count}")
    finally:
        await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())
