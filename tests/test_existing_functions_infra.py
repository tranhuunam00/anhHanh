"""Comprehensive Unit Tests for Existing Infrastructure Services in DailyDictation.
Covers TranslationService, GroqWhisperService, and AIVocabService.
All tests satisfy Rule 6: Input Coverage, Output Verification, Logic Coverage, and Error Handling.
"""
import os
import json
import tempfile
import pytest

# 1. Translation Service
from app.infrastructure.translation_service import TranslationService

# 2. Groq Whisper Audio Service
from app.infrastructure.groq_whisper_service import GroqWhisperService

# 3. AI Vocab Service
from app.infrastructure.ai_vocab_service import (
    AIVocabService,
    get_gemini_api_key,
    get_groq_api_key,
)


# ============================================================================
# Section 1: TranslationService Unit Tests
# ============================================================================

def test_translation_service_clean_text():
    """Verify clean_text removes bracketed annotations and collapses whitespace."""
    with tempfile.TemporaryDirectory() as tmpdir:
        cache_path = os.path.join(tmpdir, "trans_cache.json")
        svc = TranslationService(cache_file=cache_path)

        # Brackets and parentheses
        assert svc.clean_text("[Applause] Thank you very much (cheers)") == "Thank you very much"
        assert svc.clean_text("  Multiple   spaces \n\n and tabs\t ") == "Multiple spaces and tabs"
        assert svc.clean_text("") == ""
        assert svc.clean_text("   ") == ""


def test_translation_service_clean_credits():
    """Verify clean_credits removes subtitle credits and preserves real content."""
    with tempfile.TemporaryDirectory() as tmpdir:
        cache_path = os.path.join(tmpdir, "trans_cache.json")
        svc = TranslationService(cache_file=cache_path)

        # Vietnamese credit removal with starter word "Chào"
        credit_vi = "Phụ đề bởi: Nam Trần Chào mừng các bạn đến với buổi nói chuyện."
        assert svc.clean_credits(credit_vi) == "Chào mừng các bạn đến với buổi nói chuyện."

        # Vietnamese credit removal with starter word "Hôm"
        credit_vi2 = "Dịch bởi: Ban Biên Tập Hôm nay chúng ta cùng tìm hiểu..."
        assert svc.clean_credits(credit_vi2) == "Hôm nay chúng ta cùng tìm hiểu..."

        # Standalone credit line is stripped completely
        only_credit = "Subtitles by TED Conferences"
        assert svc.clean_credits(only_credit) == ""

        # None or empty
        assert svc.clean_credits("") == ""
        assert svc.clean_credits(None) == ""


def test_translation_service_translate_logic_and_cache():
    """Verify translate branches: same language, none target, cache hit, and empty text."""
    with tempfile.TemporaryDirectory() as tmpdir:
        cache_path = os.path.join(tmpdir, "trans_cache.json")
        svc = TranslationService(cache_file=cache_path)

        # 1. Empty text
        assert svc.translate("", "en", "vi") == ""
        assert svc.translate("   ", "en", "vi") == ""

        # 2. Target is 'none' -> returns cleaned text
        assert svc.translate("Hello world", "en", "none") == "Hello world"

        # 3. Source == Target -> returns cleaned text as-is
        assert svc.translate("Hello world", "en", "en") == "Hello world"

        # 4. Cache hit
        svc.memory_cache["en_vi_Good morning"] = "Chào buổi sáng"
        assert svc.translate("Good morning", "en", "vi") == "Chào buổi sáng"

        # 5. translate_to_vietnamese helper
        assert svc.translate_to_vietnamese("Good morning") == "Chào buổi sáng"


# ============================================================================
# Section 2: GroqWhisperService Unit Tests
# ============================================================================

def test_groq_whisper_configuration_and_key():
    """Verify get_api_key and is_configured logic."""
    # Key provided via constructor
    svc_valid = GroqWhisperService(api_key="gsk_valid_test_token_12345")
    assert svc_valid.get_api_key() == "gsk_valid_test_token_12345"
    assert svc_valid.is_configured() is True

    # Invalid key without gsk_ prefix
    svc_invalid = GroqWhisperService(api_key="invalid_token")
    assert svc_invalid.is_configured() is False

    # Empty key
    svc_empty = GroqWhisperService(api_key="")
    assert svc_empty.is_configured() is False


def test_groq_whisper_normalize_transcription_result():
    """Verify _normalize_transcription_result calculates segments and word mapping."""
    svc = GroqWhisperService()

    raw_response = {
        "duration": 5.4,
        "text": "Hello world. Welcome to dictation practice.",
        "segments": [
            {"id": 0, "start": 0.0, "end": 2.1, "text": "Hello world."},
            {"id": 1, "start": 2.2, "end": 5.3, "text": "Welcome to dictation practice."},
            {"id": 2, "start": 5.3, "end": 5.4, "text": "   "},  # empty segment should be skipped
        ],
        "words": [
            {"word": "Hello", "start": 0.0, "end": 0.9},
            {"word": "world.", "start": 1.0, "end": 2.0},
            {"word": "Welcome", "start": 2.2, "end": 3.0},
            {"word": "to", "start": 3.1, "end": 3.5},
            {"word": "dictation", "start": 3.6, "end": 4.5},
            {"word": "practice.", "start": 4.6, "end": 5.3},
        ]
    }

    normalized = svc._normalize_transcription_result(raw_response)
    assert normalized["duration"] == 5.4
    assert normalized["full_text"] == "Hello world. Welcome to dictation practice."
    assert normalized["total_sentences"] == 2  # third empty segment was omitted

    seg1 = normalized["segments"][0]
    assert seg1["position"] == 1
    assert seg1["start"] == 0.0
    assert seg1["end"] == 2.1
    assert seg1["duration"] == 2.1
    # 3 words mapped due to 0.1s overlap window (start <= w.start <= end + 0.1)
    assert len(seg1["words"]) == 3
    assert seg1["words"][0]["word"] == "Hello"

    seg2 = normalized["segments"][1]
    assert seg2["position"] == 2
    assert seg2["duration"] == 3.1
    assert len(seg2["words"]) == 4


@pytest.mark.asyncio
async def test_groq_whisper_transcribe_unconfigured_raises():
    """Verify transcribe raises ValueError when API key is not configured."""
    svc = GroqWhisperService(api_key="")
    with pytest.raises(ValueError) as exc:
        await svc.transcribe(b"fake_audio_bytes", filename="test.mp3")
    assert "GROQ_API_KEY chưa được cấu hình" in str(exc.value)


# ============================================================================
# Section 3: AIVocabService Unit Tests
# ============================================================================

def test_ai_vocab_extract_text_from_plain_and_markdown_files():
    """Verify extract_text_from_file handles text, markdown, and csv formats."""
    # Plain text utf-8
    txt_content = "Word, Meaning\nEphemeral, Phù du\nSerendipity, Duyên may".encode("utf-8")
    res_txt = AIVocabService.extract_text_from_file(txt_content, "vocab.txt")
    assert "Ephemeral, Phù du" in res_txt

    # Markdown file
    md_content = "# Vocabulary\n- **Ambiguity**: Sự mơ hồ".encode("utf-8")
    res_md = AIVocabService.extract_text_from_file(md_content, "notes.md")
    assert "Ambiguity" in res_md

    # CSV file
    csv_content = "word,meaning\nperseverance,sự kiên trì".encode("utf-8")
    res_csv = AIVocabService.extract_text_from_file(csv_content, "words.csv")
    assert "perseverance" in res_csv

    # Empty file
    assert AIVocabService.extract_text_from_file(b"", "empty.txt") == ""


@pytest.mark.asyncio
async def test_ai_vocab_extract_vocabulary_empty_input():
    """Verify extract_vocabulary returns empty list when text and images are empty."""
    res1 = await AIVocabService.extract_vocabulary(text="")
    assert res1 == []

    res2 = await AIVocabService.extract_vocabulary(text="   ", images=None)
    assert res2 == []


def test_ai_vocab_api_key_getters():
    """Verify get_gemini_api_key and get_groq_api_key return strings without crashing."""
    gemini_key = get_gemini_api_key()
    groq_key = get_groq_api_key()
    assert isinstance(gemini_key, str)
    assert isinstance(groq_key, str)
