"""Unit tests for Chinese & Multilingual Word Lookup in TranslationService."""
import pytest
from app.infrastructure.translation_service import TranslationService


@pytest.fixture
def service(tmp_path):
    cache_file = str(tmp_path / "test_translations.json")
    return TranslationService(cache_file=cache_file)


def test_resolve_word_details_chinese(service, monkeypatch):
    """Test Chinese word lookup resolves Pinyin, translation, and source_lang='zh'."""
    # Mock _fetch_google_details to test deterministic behavior
    monkeypatch.setattr(
        service,
        "_fetch_google_details",
        lambda text, source_lang="zh", target_lang="vi": {
            "translated": "Xin chào",
            "pinyin": "Nǐ hǎo",
            "detected_source": "zh-CN",
        },
    )

    result = service.resolve_word_details("你好", target_lang="vi")

    assert result["meaning"] == "Xin chào"
    assert result["pinyin"] == "Nǐ hǎo"
    assert result["ipa"] == "Nǐ hǎo"
    assert result["source_lang"] == "zh"
    assert "Pinyin: Nǐ hǎo" in result["definition"]
    assert result["part_of_speech"] == "Từ vựng tiếng Trung"


def test_resolve_word_details_chinese_fallback_to_clean(service, monkeypatch):
    """Test Chinese word lookup fallback when translation returns empty."""
    monkeypatch.setattr(
        service,
        "_fetch_google_details",
        lambda text, source_lang="zh", target_lang="vi": {
            "translated": "",
            "pinyin": None,
            "detected_source": "zh",
        },
    )

    result = service.resolve_word_details("未知词", target_lang="vi")

    assert result["meaning"] == "未知词"
    assert result["pinyin"] is None
    assert result["source_lang"] == "zh"


def test_resolve_word_details_english(service, monkeypatch):
    """Test English word lookup uses standard English translation and Datamuse IPA."""
    monkeypatch.setattr(
        service,
        "translate",
        lambda text, source_lang="en", target_lang="vi": "quả táo" if text == "apple" else "",
    )

    result = service.resolve_word_details("apple", target_lang="vi")

    assert result["meaning"] == "quả táo"
    assert result["source_lang"] == "en"
    assert result["pinyin"] is None


def test_resolve_word_details_empty_and_whitespace(service):
    """Test boundary cases with whitespace and empty strings."""
    result = service.resolve_word_details("   ", target_lang="vi")
    assert result["meaning"] == ""


def test_fetch_google_details_structure(service):
    """Test _fetch_google_details returns required dictionary keys even upon mock error."""
    # Test error handling fallback
    result = service._fetch_google_details("")
    assert "translated" in result
    assert "pinyin" in result
    assert "detected_source" in result
