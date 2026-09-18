"""Pytest configuration and fixtures for DailyDictation test suite."""
import asyncio
import pytest
from app.infrastructure.database.connection import init_db
from app.presentation.security_middleware import limiter


@pytest.fixture(scope="session", autouse=True)
def initialize_test_database():
    """Ensure database tables and columns are initialized before running tests."""
    asyncio.run(init_db())


@pytest.fixture(autouse=True)
def disable_rate_limiting_during_tests():
    """Disable rate limiting in test runs so rapid sequential API calls don't trigger 429."""
    limiter.enabled = False
    yield
    limiter.enabled = True

