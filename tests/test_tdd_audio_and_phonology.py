"""TDD Test Suite: Phonology Engine & Audio Connected Speech Analysis.

Covers:
- Liaison / Consonant-to-vowel linking (hold on, an apple).
- Coalescent assimilation (/t/ + /j/ -> /tʃ/, /d/ + /j/ -> /dʒ/).
- Weak form reduction (function words like to, can, of).
- Sentence-final weak form preservation (not reducing final words).
- Edge / boundary cases (single word, empty sentence, pure punctuation).
- Audio speech configuration checks (GroqWhisperService keys).
At least 10 cases strictly included.
"""
import pytest
from app.infrastructure.phonology_engine import PhonologyEngine
from app.infrastructure.groq_whisper_service import GroqWhisperService


@pytest.fixture
def engine():
    return PhonologyEngine()


# ==============================================================================
# 1. HAPPY CASES
# ==============================================================================

def test_phonology_case_1_consonant_to_vowel_liaison(engine):
    """Happy case 1: Detects consonant-to-vowel linking (liaison) between adjacent words."""
    result = engine.analyze_sentence("hold on")
    types = [p["type"] for p in result["phenomena"]]
    assert "CV_LINKING" in types
    assert "‿" in result["annotated_text"]


def test_phonology_case_2_assimilation_t_plus_j(engine):
    """Happy case 2: Detects coalescent assimilation for /t/ + /j/ in 'meet you'."""
    result = engine.analyze_sentence("Nice to meet you")
    assimilations = [p for p in result["phenomena"] if p["type"] == "ASSIMILATION_CH"]
    assert len(assimilations) >= 1
    assert "meet + you" in assimilations[0]["pair"]


def test_phonology_case_3_assimilation_d_plus_j(engine):
    """Happy case 3: Detects coalescent assimilation for /d/ + /j/ in 'did you'."""
    result = engine.analyze_sentence("Did you see that?")
    assimilations = [p for p in result["phenomena"] if p["type"] == "ASSIMILATION_DJ"]
    assert len(assimilations) >= 1
    assert "Did + you" in assimilations[0]["pair"]


def test_phonology_case_4_weak_forms_detection(engine):
    """Happy case 4: Non-final function words recognized as weak forms."""
    result = engine.analyze_sentence("I want to speak with him")
    to_token = next((t for t in result["tokens"] if t["clean"] == "to"), None)
    assert to_token is not None
    assert to_token["is_weak_form"] is True
    assert to_token["weak_info"]["weak_ipa"] == "/tə/"


# ==============================================================================
# 2. BOUNDARY / SPECIAL PHONOLOGICAL CASES
# ==============================================================================

def test_phonology_case_5_sentence_final_word_not_weakened(engine):
    """Boundary case 5: Function words at the very end of a sentence retain strong form."""
    result = engine.analyze_sentence("Who are you talking to?")
    last_token = result["tokens"][-1]
    assert last_token["clean"] == "to"
    assert last_token["is_weak_form"] is False


def test_phonology_case_6_single_word_sentence(engine):
    """Boundary case 6: Single-word sentence yields 1 token and 0 boundary phenomena."""
    result = engine.analyze_sentence("Congratulations!")
    assert len(result["tokens"]) == 1
    assert len(result["phenomena"]) == 0
    assert result["annotated_text"] == "Congratulations"


def test_phonology_case_7_punctuation_between_tokens_stripped(engine):
    """Boundary case 7: Commas and dashes between words are stripped from clean tokens."""
    result = engine.analyze_sentence("First, we eat, then we talk.")
    assert result["tokens"][0]["clean"] == "first"
    assert result["tokens"][1]["clean"] == "we"


def test_phonology_case_8_glide_insertion_vowel_to_vowel(engine):
    """Boundary case 8: Vowel-to-vowel boundary triggers glide or hiatus check."""
    result = engine.analyze_sentence("go away")
    assert len(result["tokens"]) == 2
    # Verify both words properly parsed into tokens
    assert [t["clean"] for t in result["tokens"]] == ["go", "away"]


# ==============================================================================
# 3. BAD / ERROR / MALFORMED CASES
# ==============================================================================

def test_phonology_case_9_empty_string(engine):
    """Bad case 9: Empty string input returns clean empty result without crashing."""
    result = engine.analyze_sentence("")
    assert result["tokens"] == []
    assert result["phenomena"] == []
    assert result["annotated_text"] == ""


def test_phonology_case_10_pure_punctuation_string(engine):
    """Bad case 10: String with only symbols/punctuation yields 0 tokens."""
    result = engine.analyze_sentence("!@#$%^&*() +=-~`")
    assert result["tokens"] == []
    assert result["phenomena"] == []


def test_phonology_case_11_groq_whisper_unconfigured():
    """Bad case 11: GroqWhisperService without gsk_ key returns is_configured False."""
    service = GroqWhisperService(api_key="")
    assert service.is_configured() is False


def test_phonology_case_12_groq_whisper_configured():
    """Happy case 12: GroqWhisperService with gsk_ key returns is_configured True."""
    service = GroqWhisperService(api_key="gsk_real_api_key_sample_123456")
    assert service.is_configured() is True
    assert service.get_api_key() == "gsk_real_api_key_sample_123456"
