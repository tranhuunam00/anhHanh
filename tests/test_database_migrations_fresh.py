"""Comprehensive Unit & Integration Tests for Database Migrations and Fresh Schema Initialization.
Verifies from-scratch migration execution, idempotency, column completeness, and ORM model compatibility.
"""
import pytest
import os
import tempfile
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy import text, inspect
from app.infrastructure.database.migrate import run_migrations
from app.infrastructure.database.models import (
    User, Lesson, UserLesson, UserVocabulary, UserStreak,
    Feedback, FeedbackMessage, DictionaryWord, WritingSubmission
)


@pytest.mark.asyncio
async def test_fresh_database_full_migration_run():
    """Test running all 13 migrations from scratch on a completely blank database."""
    with tempfile.TemporaryDirectory() as tmpdir:
        db_path = os.path.join(tmpdir, "test_fresh_migrated.db")
        db_url = f"sqlite+aiosqlite:///{db_path}"
        engine = create_async_engine(db_url, connect_args={"check_same_thread": False})

        try:
            # 1. Run migrations on empty database
            applied_count = await run_migrations(engine)
            assert applied_count >= 13, f"Expected at least 13 migrations to run, but got {applied_count}"

            # 2. Verify idempotency - second run must apply 0 migrations
            second_run_count = await run_migrations(engine)
            assert second_run_count == 0, "Idempotency check failed: pending migrations on second run"

            # 3. Verify schema_migrations table
            async with engine.connect() as conn:
                res = await conn.execute(text("SELECT id FROM schema_migrations ORDER BY id ASC;"))
                recorded_migrations = [row[0] for row in res.fetchall()]
                assert "001_initial_schema" in recorded_migrations
                assert "002_subtitle_cache_and_lang_progress" in recorded_migrations
                assert "003_vocab_srs_fields" in recorded_migrations
                assert "006_feedback_conversations" in recorded_migrations
                assert "007_create_dictionary_words" in recorded_migrations
                assert "010_create_writing_submissions" in recorded_migrations
                assert "011_add_language_to_writing_submissions" in recorded_migrations
                assert "012_add_subtype_to_writing_submissions" in recorded_migrations
                assert "013_add_source_lang_to_user_vocabulary" in recorded_migrations

                # 4. Verify all tables exist
                tables_res = await conn.execute(
                    text("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';")
                )
                tables = {row[0] for row in tables_res.fetchall()}
                expected_tables = {
                    "schema_migrations", "users", "lessons", "lesson_subtitles",
                    "user_lessons", "user_vocabulary", "user_streaks",
                    "feedbacks", "feedback_messages", "dictionary_words",
                    "writing_submissions"
                }
                for expected in expected_tables:
                    assert expected in tables, f"Missing table in fresh migration: {expected}"

                # 5. Check columns on critical tables
                # user_vocabulary: source_lang, next_review_at, mastery_score
                v_cols_res = await conn.execute(text("PRAGMA table_info(user_vocabulary);"))
                v_cols = {row[1] for row in v_cols_res.fetchall()}
                assert "source_lang" in v_cols
                assert "next_review_at" in v_cols
                assert "mastery_score" in v_cols
                assert "review_interval_days" in v_cols

                # writing_submissions: language, sub_type
                w_cols_res = await conn.execute(text("PRAGMA table_info(writing_submissions);"))
                w_cols = {row[1] for row in w_cols_res.fetchall()}
                assert "language" in w_cols
                assert "sub_type" in w_cols
                assert "genre" in w_cols
                assert "feedback_json" in w_cols

                # feedbacks: image_url, sender_name, sender_email
                f_cols_res = await conn.execute(text("PRAGMA table_info(feedbacks);"))
                f_cols = {row[1] for row in f_cols_res.fetchall()}
                assert "image_url" in f_cols
                assert "sender_name" in f_cols
                assert "sender_email" in f_cols

            # 6. Test ORM operations on this freshly migrated database
            session_factory = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
            async with session_factory() as session:
                user = User(
                    email="test_fresh@example.com",
                    name="Fresh User",
                    role="USER"
                )
                session.add(user)
                await session.flush()

                # Add vocabulary with all new fields
                vocab = UserVocabulary(
                    user_id=user.id,
                    word="ephemeral",
                    meaning="phù du",
                    context_sentence="Life is ephemeral.",
                    source_lang="en",
                    mastery_score=2,
                    review_interval_days=7
                )
                session.add(vocab)

                # Add writing submission with language and sub_type
                writing = WritingSubmission(
                    user_id=user.id,
                    topic="AI in Education",
                    genre="ielts_task2",
                    content="This is a test essay written for fresh migration verification.",
                    word_count=10,
                    language="en",
                    sub_type="discussion",
                    overall_score=7.5
                )
                session.add(writing)

                await session.commit()

                # Query back
                q_vocab = await session.get(UserVocabulary, vocab.id)
                assert q_vocab is not None
                assert q_vocab.word == "ephemeral"
                assert q_vocab.source_lang == "en"

                q_writing = await session.get(WritingSubmission, writing.id)
                assert q_writing is not None
                assert q_writing.language == "en"
                assert q_writing.sub_type == "discussion"
                assert q_writing.overall_score == 7.5

        finally:
            await engine.dispose()
