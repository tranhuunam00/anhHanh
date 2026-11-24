"""Static file serving helpers: HTTP caching policies and safe SPA file lookup."""
import os
from typing import Optional

from fastapi import Response
from fastapi.staticfiles import StaticFiles

# Content-hashed build output (/assets/index-abc123.js): safe to cache forever.
IMMUTABLE_CACHE_CONTROL = "public, max-age=31536000, immutable"
# Large media without hashed names (/audio/*.mp3): cache a week, ETag revalidation after.
MEDIA_CACHE_CONTROL = "public, max-age=604800"
# SPA shell (index.html): always revalidate (cheap 304 via ETag) so new deploys show up.
HTML_REVALIDATE_CACHE_CONTROL = "no-cache"


def validate_cache_control(cache_control: str) -> str:
    """Returns a trimmed Cache-Control value or raises ValueError for invalid input."""
    if not isinstance(cache_control, str):
        raise ValueError("cache_control must be a string")
    value = cache_control.strip()
    if not value:
        raise ValueError("cache_control must be a non-empty string")
    if "\r" in value or "\n" in value:
        raise ValueError("cache_control must not contain line breaks")
    return value


class CachedStaticFiles(StaticFiles):
    """StaticFiles that stamps a configurable Cache-Control header on every file response."""

    def __init__(self, *args, cache_control: str = IMMUTABLE_CACHE_CONTROL, **kwargs):
        self.cache_control = validate_cache_control(cache_control)
        super().__init__(*args, **kwargs)

    def file_response(self, *args, **kwargs) -> Response:
        response = super().file_response(*args, **kwargs)
        response.headers["Cache-Control"] = self.cache_control
        return response


def resolve_safe_static_path(base_dir: str, requested_path: Optional[str]) -> Optional[str]:
    """
    Resolves `requested_path` inside `base_dir` and returns the absolute file path,
    or None when the path is empty, not a regular file, or escapes `base_dir`
    (e.g. "../.env", absolute paths, drive letters) — blocks path traversal.
    """
    if not base_dir or not isinstance(base_dir, str):
        raise ValueError("base_dir must be a non-empty string")
    if not requested_path or not isinstance(requested_path, str):
        return None
    if "\x00" in requested_path:
        return None

    base_real = os.path.realpath(base_dir)
    candidate = os.path.realpath(os.path.join(base_real, requested_path.lstrip("/\\")))

    try:
        if os.path.commonpath([base_real, candidate]) != base_real:
            return None
    except ValueError:
        # Different drives on Windows
        return None

    if candidate == base_real or not os.path.isfile(candidate):
        return None
    return candidate
