"""Unit tests for app.presentation.static_serving (AGENTS.md Rule 6).

Covers: input coverage, output verification, internal branches, error handling
for cache-control validation, CachedStaticFiles headers, and path-traversal-safe
SPA file resolution.
"""
import os

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.presentation.static_serving import (
    CachedStaticFiles,
    HTML_REVALIDATE_CACHE_CONTROL,
    IMMUTABLE_CACHE_CONTROL,
    MEDIA_CACHE_CONTROL,
    resolve_safe_static_path,
    validate_cache_control,
)


# ---------------------------------------------------------------------------
# validate_cache_control
# ---------------------------------------------------------------------------
class TestValidateCacheControl:
    def test_returns_trimmed_value(self):
        assert validate_cache_control("  public, max-age=60  ") == "public, max-age=60"

    def test_accepts_policy_constants(self):
        for value in (IMMUTABLE_CACHE_CONTROL, MEDIA_CACHE_CONTROL, HTML_REVALIDATE_CACHE_CONTROL):
            assert validate_cache_control(value) == value

    @pytest.mark.parametrize("bad", ["", "   ", "\t"])
    def test_rejects_empty_or_whitespace(self, bad):
        with pytest.raises(ValueError, match="non-empty"):
            validate_cache_control(bad)

    @pytest.mark.parametrize("bad", [None, 123, ["no-cache"], b"no-cache"])
    def test_rejects_non_string(self, bad):
        with pytest.raises(ValueError, match="must be a string"):
            validate_cache_control(bad)

    @pytest.mark.parametrize("bad", ["no-cache\r\nX-Evil: 1", "public\nmax-age=1"])
    def test_rejects_header_injection(self, bad):
        with pytest.raises(ValueError, match="line breaks"):
            validate_cache_control(bad)


# ---------------------------------------------------------------------------
# CachedStaticFiles
# ---------------------------------------------------------------------------
def _make_client(directory, **kwargs):
    app = FastAPI()
    app.mount("/static", CachedStaticFiles(directory=str(directory), **kwargs), name="static")
    return TestClient(app)


class TestCachedStaticFiles:
    def test_default_policy_is_immutable(self, tmp_path):
        (tmp_path / "index-abc123.js").write_text("console.log(1)", encoding="utf-8")
        response = _make_client(tmp_path).get("/static/index-abc123.js")
        assert response.status_code == 200
        assert response.headers["cache-control"] == IMMUTABLE_CACHE_CONTROL
        assert response.text == "console.log(1)"

    def test_custom_policy_is_applied(self, tmp_path):
        (tmp_path / "track.mp3").write_bytes(b"ID3" + b"\x00" * 64)
        response = _make_client(tmp_path, cache_control=MEDIA_CACHE_CONTROL).get("/static/track.mp3")
        assert response.status_code == 200
        assert response.headers["cache-control"] == MEDIA_CACHE_CONTROL
        assert response.headers["content-type"].startswith("audio/")

    def test_range_requests_still_supported(self, tmp_path):
        (tmp_path / "track.mp3").write_bytes(bytes(range(256)))
        response = _make_client(tmp_path, cache_control=MEDIA_CACHE_CONTROL).get(
            "/static/track.mp3", headers={"Range": "bytes=0-9"}
        )
        assert response.status_code == 206
        assert response.content == bytes(range(10))
        assert response.headers["cache-control"] == MEDIA_CACHE_CONTROL

    def test_etag_revalidation_returns_304(self, tmp_path):
        (tmp_path / "a.css").write_text("body{}", encoding="utf-8")
        client = _make_client(tmp_path)
        first = client.get("/static/a.css")
        etag = first.headers.get("etag")
        assert etag
        second = client.get("/static/a.css", headers={"If-None-Match": etag})
        assert second.status_code == 304

    def test_missing_file_returns_404(self, tmp_path):
        response = _make_client(tmp_path).get("/static/missing.js")
        assert response.status_code == 404

    def test_invalid_policy_raises(self, tmp_path):
        with pytest.raises(ValueError):
            CachedStaticFiles(directory=str(tmp_path), cache_control="")


# ---------------------------------------------------------------------------
# resolve_safe_static_path
# ---------------------------------------------------------------------------
@pytest.fixture
def dist_dir(tmp_path):
    dist = tmp_path / "dist"
    (dist / "nested").mkdir(parents=True)
    (dist / "logo.jpg").write_bytes(b"\xff\xd8")
    (dist / "nested" / "sw.js").write_text("//sw", encoding="utf-8")
    (tmp_path / "secret.env").write_text("TOKEN=1", encoding="utf-8")
    return dist


class TestResolveSafeStaticPath:
    def test_resolves_file_in_root(self, dist_dir):
        result = resolve_safe_static_path(str(dist_dir), "logo.jpg")
        assert result == os.path.realpath(dist_dir / "logo.jpg")
        assert isinstance(result, str)

    def test_resolves_nested_file_and_leading_slash(self, dist_dir):
        expected = os.path.realpath(dist_dir / "nested" / "sw.js")
        assert resolve_safe_static_path(str(dist_dir), "nested/sw.js") == expected
        assert resolve_safe_static_path(str(dist_dir), "/nested/sw.js") == expected

    @pytest.mark.parametrize("value", [None, "", 0])
    def test_empty_request_returns_none(self, dist_dir, value):
        assert resolve_safe_static_path(str(dist_dir), value) is None

    def test_directory_returns_none(self, dist_dir):
        assert resolve_safe_static_path(str(dist_dir), "nested") is None
        assert resolve_safe_static_path(str(dist_dir), ".") is None

    def test_missing_file_returns_none(self, dist_dir):
        assert resolve_safe_static_path(str(dist_dir), "nope.png") is None

    @pytest.mark.parametrize(
        "attack",
        ["../secret.env", "nested/../../secret.env", "..\\secret.env", "nested/../../../etc/passwd"],
    )
    def test_blocks_path_traversal(self, dist_dir, attack):
        assert resolve_safe_static_path(str(dist_dir), attack) is None

    def test_blocks_absolute_path_outside_base(self, dist_dir, tmp_path):
        assert resolve_safe_static_path(str(dist_dir), str(tmp_path / "secret.env")) is None

    def test_blocks_null_byte(self, dist_dir):
        assert resolve_safe_static_path(str(dist_dir), "logo.jpg\x00.txt") is None

    def test_sibling_dir_with_same_prefix_is_blocked(self, tmp_path):
        base = tmp_path / "dist"
        sibling = tmp_path / "dist-private"
        base.mkdir()
        sibling.mkdir()
        (sibling / "x.txt").write_text("x", encoding="utf-8")
        assert resolve_safe_static_path(str(base), "../dist-private/x.txt") is None

    @pytest.mark.parametrize("bad_base", ["", None, 42])
    def test_invalid_base_raises(self, bad_base):
        with pytest.raises(ValueError, match="base_dir"):
            resolve_safe_static_path(bad_base, "logo.jpg")
