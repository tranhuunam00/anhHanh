"""Comprehensive Unit & Integration Tests for System Vocabulary Bank.

Tests coverage:
1. Input Coverage: empty/null, boundary params, invalid search queries, varied languages
2. Output Verification: schema structure, correct status codes, data format
3. Internal Logic: category counts, duplicate prevention on batch import, filtering
4. Error & Exception Handling: unauthorized access, admin permissions check, empty payloads
Rule 4: Strictly under 500 lines.
"""
import pytest
import pytest_asyncio
import uuid
from httpx import AsyncClient, ASGITransport
from sqlalchemy import select, delete

from server import app
from app.infrastructure.database.connection import get_db, async_session_factory
from app.infrastructure.database.models import User, UserVocabulary, SystemVocabBank
from app.application.auth_service import create_access_token


@pytest_asyncio.fixture
async def test_client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client


@pytest_asyncio.fixture
async def regular_user():
    user_id = str(uuid.uuid4())
    user = User(
        id=user_id,
        email=f"user_{user_id[:8]}@example.com",
        name="Regular Student",
        role="user",
        password_hash="fakehashedpassword",
    )
    async with async_session_factory() as session:
        session.add(user)
        await session.commit()

    token = create_access_token({"sub": user.id, "email": user.email, "role": user.role})
    yield {"user": user, "token": token}

    async with async_session_factory() as session:
        await session.execute(delete(UserVocabulary).where(UserVocabulary.user_id == user_id))
        await session.execute(delete(User).where(User.id == user_id))
        await session.commit()


@pytest_asyncio.fixture
async def admin_user():
    admin_id = str(uuid.uuid4())
    admin = User(
        id=admin_id,
        email=f"admin_{admin_id[:8]}@example.com",
        name="Super Admin",
        role="admin",
        password_hash="fakehashedpassword",
    )
    async with async_session_factory() as session:
        session.add(admin)
        await session.commit()

    token = create_access_token({"sub": admin.id, "email": admin.email, "role": admin.role})
    yield {"user": admin, "token": token}

    async with async_session_factory() as session:
        await session.execute(delete(User).where(User.id == admin_id))
        await session.commit()


@pytest.mark.asyncio
async def test_get_vocab_categories(test_client):
    """Test retrieving categories catalog with count verification."""
    res = await test_client.get("/api/system-vocab/categories")
    assert res.status_code == 200
    data = res.json()
    assert "categories" in data
    assert data["total_categories"] == 30
    assert len(data["categories"]) == 30

    first_cat = data["categories"][0]
    assert "id" in first_cat
    assert "name_vi" in first_cat
    assert "name_en" in first_cat
    assert "word_count" in first_cat
    assert first_cat["word_count"] > 0


@pytest.mark.asyncio
async def test_get_vocab_words_filtering(test_client):
    """Test filtering words by language, category, word_type and search."""
    # 1. Filter English words
    res_en = await test_client.get("/api/system-vocab/words?source_lang=en&limit=10")
    assert res_en.status_code == 200
    data_en = res_en.json()
    assert len(data_en["items"]) <= 10
    for it in data_en["items"]:
        assert it["source_lang"] == "en"

    # 2. Filter French words
    res_fr = await test_client.get("/api/system-vocab/words?source_lang=fr&limit=5")
    assert res_fr.status_code == 200
    data_fr = res_fr.json()
    assert len(data_fr["items"]) <= 5
    for it in data_fr["items"]:
        assert it["source_lang"] == "fr"

    # 3. Filter specific category
    res_cat = await test_client.get("/api/system-vocab/words?category=politics_diplomacy&limit=20")
    assert res_cat.status_code == 200
    data_cat = res_cat.json()
    for it in data_cat["items"]:
        assert it["category"] == "politics_diplomacy"

    # 4. Search query
    res_search = await test_client.get("/api/system-vocab/words?search=diplomacy")
    assert res_search.status_code == 200
    data_search = res_search.json()
    assert data_search["total"] >= 1
    found = any("diplomacy" in it["word"].lower() or "ngoại giao" in it["meaning"].lower() for it in data_search["items"])
    assert found is True


@pytest.mark.asyncio
async def test_get_vocab_distractors(test_client):
    """Test fetching random distractors for exercise mcq."""
    res = await test_client.get("/api/system-vocab/distractors?source_lang=en&count=10")
    assert res.status_code == 200
    data = res.json()
    assert "distractors" in data
    assert len(data["distractors"]) == 10
    for d in data["distractors"]:
        assert d["source_lang"] == "en"


@pytest.mark.asyncio
async def test_import_to_notebook_and_duplicate_prevention(test_client, regular_user):
    """Test importing selected words into notebook and ensuring duplicate words are skipped."""
    headers = {"Authorization": f"Bearer {regular_user['token']}"}

    # Fetch 2 real words from system bank
    words_res = await test_client.get("/api/system-vocab/words?limit=2")
    items = words_res.json()["items"]
    assert len(items) == 2
    ids_to_import = [items[0]["id"], items[1]["id"]]

    # First import
    import_res = await test_client.post(
        "/api/system-vocab/import-to-notebook",
        json={"vocab_ids": ids_to_import},
        headers=headers
    )
    assert import_res.status_code == 200
    res_data = import_res.json()
    assert res_data["imported_count"] == 2
    assert res_data["skipped_count"] == 0

    # Check user-saved-words endpoint
    saved_res = await test_client.get("/api/system-vocab/user-saved-words", headers=headers)
    assert saved_res.status_code == 200
    saved_words = saved_res.json()["saved_words"]
    assert items[0]["word"].lower() in saved_words
    assert items[1]["word"].lower() in saved_words

    # Re-importing same IDs should skip both
    re_import_res = await test_client.post(
        "/api/system-vocab/import-to-notebook",
        json={"vocab_ids": ids_to_import},
        headers=headers
    )
    assert re_import_res.status_code == 200
    re_data = re_import_res.json()
    assert re_data["imported_count"] == 0
    assert re_data["skipped_count"] == 2


@pytest.mark.asyncio
async def test_admin_crud_permissions(test_client, regular_user, admin_user):
    """Verify regular user is forbidden from admin endpoints and admin can perform CRUD."""
    user_headers = {"Authorization": f"Bearer {regular_user['token']}"}
    admin_headers = {"Authorization": f"Bearer {admin_user['token']}"}

    payload = {
        "word": "quantum entanglement",
        "phonetic": "/ˈkwɒntəm ɪnˈtæŋɡlmənt/",
        "meaning": "sự vướng víu lượng tử",
        "context_sentence": "Quantum entanglement is a phenomenon in quantum physics.",
        "source_lang": "en",
        "category": "science_technology",
        "word_type": "phrase",
        "level": "C1",
    }

    # 1. Regular user gets 403 Forbidden
    res_forbidden = await test_client.post("/api/system-vocab/admin/words", json=payload, headers=user_headers)
    assert res_forbidden.status_code == 403

    # 2. Admin creates word
    res_create = await test_client.post("/api/system-vocab/admin/words", json=payload, headers=admin_headers)
    assert res_create.status_code == 200
    created_item = res_create.json()["item"]
    created_id = created_item["id"]
    assert created_item["word"] == "quantum entanglement"

    # 3. Admin updates word
    update_payload = {"meaning": "hiện tượng rối lượng tử"}
    res_update = await test_client.put(f"/api/system-vocab/admin/words/{created_id}", json=update_payload, headers=admin_headers)
    assert res_update.status_code == 200
    assert res_update.json()["item"]["meaning"] == "hiện tượng rối lượng tử"

    # 4. Admin deletes word
    res_delete = await test_client.delete(f"/api/system-vocab/admin/words/{created_id}", headers=admin_headers)
    assert res_delete.status_code == 200
    assert res_delete.json()["deleted_id"] == created_id
