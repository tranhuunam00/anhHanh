"""Migration 019: Create Destination B2 tables and seed Units 1 & 2.

Follows AGENTS.md:
- Rule 3: Database migrations rule with upgrade() and downgrade().
- Rule 4: File strictly under 500 lines.
- Zero impact on existing tables.
"""
import os
import json
import logging
from sqlalchemy import text

logger = logging.getLogger(__name__)

MIGRATION_ID = "019_create_destination_b2_tables"


async def upgrade(conn) -> None:
    """Create destination_b2 tables and seed Units 1 & 2."""
    is_sqlite = conn.dialect.name == "sqlite"
    json_type = "TEXT" if is_sqlite else "JSONB"

    logger.info(f"Migration {MIGRATION_ID}: Creating Destination B2 tables...")

    # 1. destination_b2_units table
    await conn.execute(text(f"""
    CREATE TABLE IF NOT EXISTS destination_b2_units (
        id VARCHAR(36) PRIMARY KEY,
        unit_number INTEGER NOT NULL UNIQUE,
        title VARCHAR(255) NOT NULL,
        unit_type VARCHAR(50) NOT NULL,
        cefr_level VARCHAR(10) NOT NULL DEFAULT 'B2',
        summary TEXT NULL,
        theory {json_type} NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
    """))

    # 2. destination_b2_exercises table
    await conn.execute(text(f"""
    CREATE TABLE IF NOT EXISTS destination_b2_exercises (
        id VARCHAR(36) PRIMARY KEY,
        unit_id VARCHAR(36) NOT NULL REFERENCES destination_b2_units(id) ON DELETE CASCADE,
        exercise_code VARCHAR(10) NOT NULL,
        title VARCHAR(255) NOT NULL,
        instruction TEXT NOT NULL,
        exercise_type VARCHAR(50) NOT NULL,
        order_num INTEGER NOT NULL DEFAULT 1,
        items {json_type} NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
    """))

    # 3. destination_b2_progress table
    await conn.execute(text(f"""
    CREATE TABLE IF NOT EXISTS destination_b2_progress (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NULL REFERENCES users(id) ON DELETE CASCADE,
        exercise_id VARCHAR(36) NOT NULL REFERENCES destination_b2_exercises(id) ON DELETE CASCADE,
        score FLOAT NOT NULL DEFAULT 0.0,
        total_items INTEGER NOT NULL DEFAULT 0,
        correct_items INTEGER NOT NULL DEFAULT 0,
        user_answers {json_type} NULL,
        completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
    """))

    # Indexes
    indexes = [
        "CREATE INDEX IF NOT EXISTS idx_dest_b2_unit_num ON destination_b2_units (unit_number);",
        "CREATE INDEX IF NOT EXISTS idx_dest_b2_ex_unit ON destination_b2_exercises (unit_id);",
        "CREATE INDEX IF NOT EXISTS idx_dest_b2_progress_user ON destination_b2_progress (user_id);",
        "CREATE INDEX IF NOT EXISTS idx_dest_b2_progress_ex ON destination_b2_progress (exercise_id);",
    ]
    for idx_sql in indexes:
        try:
            await conn.execute(text(idx_sql))
        except Exception as e:
            logger.warning(f"Notice creating index: {e}")

    # Seed data
    data_file = os.path.join(os.path.dirname(__file__), "..", "data", "destination_b2_seed_data.json")
    if not os.path.exists(data_file):
        logger.warning(f"Destination B2 seed file not found at {data_file}. Skipping seed.")
        return

    logger.info(f"Migration {MIGRATION_ID}: Seeding Units 1 & 2 into database...")
    with open(data_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    units = data.get("units", [])
    for unit in units:
        theory_val = json.dumps(unit.get("theory", {}), ensure_ascii=False)
        unit_params = {
            "id": unit["id"],
            "unit_number": unit["unit_number"],
            "title": unit["title"],
            "unit_type": unit["unit_type"],
            "cefr_level": unit.get("cefr_level", "B2"),
            "summary": unit.get("summary", ""),
            "theory": theory_val,
        }

        unit_insert_sql = text("""
            INSERT OR IGNORE INTO destination_b2_units (
                id, unit_number, title, unit_type, cefr_level, summary, theory, created_at, updated_at
            ) VALUES (
                :id, :unit_number, :title, :unit_type, :cefr_level, :summary, :theory, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            );
        """ if is_sqlite else """
            INSERT INTO destination_b2_units (
                id, unit_number, title, unit_type, cefr_level, summary, theory, created_at, updated_at
            ) VALUES (
                :id, :unit_number, :title, :unit_type, :cefr_level, :summary, :theory, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            )
            ON CONFLICT (id) DO NOTHING;
        """)
        await conn.execute(unit_insert_sql, unit_params)

        for ex in unit.get("exercises", []):
            items_val = json.dumps(ex.get("items", []), ensure_ascii=False)
            ex_params = {
                "id": ex["id"],
                "unit_id": unit["id"],
                "exercise_code": ex["exercise_code"],
                "title": ex["title"],
                "instruction": ex["instruction"],
                "exercise_type": ex["exercise_type"],
                "order_num": ex.get("order_num", 1),
                "items": items_val,
            }

            ex_insert_sql = text("""
                INSERT OR IGNORE INTO destination_b2_exercises (
                    id, unit_id, exercise_code, title, instruction, exercise_type, order_num, items, created_at, updated_at
                ) VALUES (
                    :id, :unit_id, :exercise_code, :title, :instruction, :exercise_type, :order_num, :items, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
                );
            """ if is_sqlite else """
                INSERT INTO destination_b2_exercises (
                    id, unit_id, exercise_code, title, instruction, exercise_type, order_num, items, created_at, updated_at
                ) VALUES (
                    :id, :unit_id, :exercise_code, :title, :instruction, :exercise_type, :order_num, :items, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
                )
                ON CONFLICT (id) DO NOTHING;
            """)
            await conn.execute(ex_insert_sql, ex_params)

    logger.info(f"Migration {MIGRATION_ID} completed successfully.")


async def downgrade(conn) -> None:
    """Drop destination_b2 tables cleanly."""
    logger.info(f"Reverting {MIGRATION_ID}...")
    await conn.execute(text("DROP TABLE IF EXISTS destination_b2_progress;"))
    await conn.execute(text("DROP TABLE IF EXISTS destination_b2_exercises;"))
    await conn.execute(text("DROP TABLE IF EXISTS destination_b2_units;"))
    logger.info(f"Migration {MIGRATION_ID} downgraded successfully.")
