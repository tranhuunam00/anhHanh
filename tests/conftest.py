"""Pytest configuration and fixtures for DailyDictation test suite."""
import pytest
from app.presentation.security_middleware import limiter


@pytest.fixture(autouse=True)
def disable_rate_limiting_during_tests():
    """Disable rate limiting in test runs so rapid sequential API calls don't trigger 429."""
    limiter.enabled = False
    yield
    limiter.enabled = True
