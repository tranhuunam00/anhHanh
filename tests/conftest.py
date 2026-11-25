"""Pytest configuration and fixtures for DailyDictation test suite."""
import asyncio
import pytest
from app.infrastructure.database.connection import engine, init_db
from app.presentation.security_middleware import limiter
from thread_leak_guard import force_exit_if_leaked

_session_exit_status = 0


@pytest.fixture(scope="session", autouse=True)
def initialize_test_database():
    """Initialize tables before the run and close every pooled DB connection after it.

    aiosqlite runs each connection in a non-daemon worker thread; a connection left in
    the engine pool keeps that thread alive and Python waits for it forever at exit.
    """
    asyncio.run(init_db())
    yield
    asyncio.run(engine.dispose())


@pytest.fixture(autouse=True)
def disable_rate_limiting_during_tests():
    """Disable rate limiting in test runs so rapid sequential API calls don't trigger 429."""
    limiter.enabled = False
    yield
    limiter.enabled = True


def pytest_sessionfinish(session, exitstatus):
    global _session_exit_status
    _session_exit_status = int(exitstatus)


def pytest_unconfigure(config):
    """Last line of defence: a leaked non-daemon thread must never hang the test process."""
    force_exit_if_leaked(_session_exit_status)
