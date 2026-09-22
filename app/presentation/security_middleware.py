"""Security middleware: Rate limiting (global + per-group), payload guard, HTTP security headers.

Architecture:
- SlowAPIMiddleware applies `default_limits` automatically to every endpoint.
- @limiter.limit() decorators on individual endpoints OVERRIDE the default for stricter limits.
- RouteRateLimitMiddleware enforces additional IP-based limits for sensitive route prefixes
  at the middleware layer (before hitting the route handler).
"""
import time
import logging
from collections import defaultdict
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from fastapi import Request, Response
from slowapi import Limiter
from slowapi.util import get_remote_address

logger = logging.getLogger(__name__)

# ── Rate Limiter (SlowAPI) ──────────────────────────────────────────────────
# default_limits applies to ALL endpoints via SlowAPIMiddleware (added in server.py).
# Specific endpoints can use @limiter.limit('X/Y') to be MORE restrictive.
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=['200/minute'],          # global ceiling — every endpoint
    strategy='fixed-window',
)

MAX_PAYLOAD_BYTES = 512 * 1024  # 512 KB
MAX_AUDIO_PAYLOAD_BYTES = 25 * 1024 * 1024  # 25 MB for custom audio uploads

# ── Per-route-group hard limits (enforced at middleware, no decorator needed) ──
# Format: (path_prefix, max_requests, window_seconds)
_ROUTE_LIMITS = [
    ('/api/auth/login',      10,  900),   # 10 req / 15 min  (brute-force guard)
    ('/api/auth/google',     10,  900),   # 10 req / 15 min
    ('/api/auth/register',    5,  900),   # 5  req / 15 min
    ('/api/auth',            60,   60),   # 60 req / min  (general auth routes: config, me)
    ('/api/lesson/preview',  20,   60),   # 20 req / min
    ('/api/lesson/start',    15,   60),   # 15 req / min
    ('/api/lesson/progress', 60,   60),   # 60 req / min
    ('/api/lesson',          20,   60),   # 20 req / min  (POST /api/lesson)
    ('/api/translate',       30,   60),   # 30 req / min  (external translation guard)
    ('/api/video-languages', 30,   60),   # 30 req / min
    ('/api/evaluate',       120,   60),   # 120 req / min
    ('/api/streak',          60,   60),   # 60 req / min
    ('/api/feedback',         5,   60),   # 5  req / min  (POST only handled below)
    ('/api/admin',           60,   60),   # 60 req / min
    ('/api/vocab',          120,   60),   # 120 req / min
]

# In-memory sliding-window counters: { (ip, prefix): [timestamp, ...] }
_counters: dict = defaultdict(list)


def _is_rate_limited(ip: str, path: str, method: str) -> tuple:
    """Check all route limits. Returns (limited: bool, detail: str)."""
    now = time.monotonic()
    for prefix, max_req, window in _ROUTE_LIMITS:
        if path.startswith(prefix):
            # For feedback, only rate-limit POST (submitting)
            if prefix == '/api/feedback' and method != 'POST':
                break
            key = (ip, prefix)
            # Evict entries outside the window
            _counters[key] = [t for t in _counters[key] if now - t < window]
            if len(_counters[key]) >= max_req:
                return True, (
                    "Qua nhieu yeu cau. "
                    "Gioi han: " + str(max_req) + " lan / " + str(window) + "s. Vui long thu lai sau."
                )
            _counters[key].append(now)
            break   # Only apply the most-specific matching prefix
    return False, ''


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Unified security middleware: payload guard + route rate limits + HTTP headers."""

    async def dispatch(self, request: Request, call_next):
        path = request.url.path
        method = request.method

        # 1. Payload size guard (all methods with body)
        content_length = request.headers.get('content-length')
        if content_length:
            try:
                allowed_max = MAX_AUDIO_PAYLOAD_BYTES if path.startswith('/api/audio-studio/') else MAX_PAYLOAD_BYTES
                if int(content_length) > allowed_max:
                    max_mb = allowed_max // (1024 * 1024) or (allowed_max // 1024)
                    unit = "MB" if allowed_max >= 1024 * 1024 else "KB"
                    return JSONResponse(
                        status_code=413,
                        content={'detail': f'Dung lượng yêu cầu vượt quá giới hạn cho phép (tối đa {max_mb}{unit}).'}
                    )
            except ValueError:
                pass

        # 2. Route-group rate limiting (IP-based, sliding window) - skipped during tests if limiter.enabled is False
        if path.startswith('/api/') and getattr(limiter, 'enabled', True):
            ip = '0.0.0.0'
            if request.client:
                ip = request.client.host
            # Respect X-Forwarded-For when behind a trusted reverse proxy (nginx/Cloudflare)
            forwarded_for = request.headers.get('x-forwarded-for')
            if forwarded_for:
                ip = forwarded_for.split(',')[0].strip()

            limited, detail = _is_rate_limited(ip, path, method)
            if limited:
                logger.warning("Rate limited [%s] %s %s", ip, method, path)
                return JSONResponse(
                    status_code=429,
                    content={'detail': detail},
                    headers={'Retry-After': '60'},
                )

        # 3. Process request
        response: Response = await call_next(request)

        # 4. HTTP Security Headers (Helmet equivalent)
        response.headers['X-Frame-Options'] = 'SAMEORIGIN'
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-XSS-Protection'] = '1; mode=block'
        response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        response.headers['Permissions-Policy'] = 'camera=(), microphone=(), geolocation=()'
        response.headers['X-Permitted-Cross-Domain-Policies'] = 'none'

        return response
