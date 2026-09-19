import pytest
from app.domain.services import SentenceGrouperService
from app.domain.models import SubtitleSnippet

def test_sentence_grouper_groups_by_punctuation():
    grouper = SentenceGrouperService()
    raw_snippets = [
        SubtitleSnippet(text="When my son Patrick", start=4.37, duration=2.30),
        SubtitleSnippet(text="came regularly into his playroom.", start=6.70, duration=2.13),
        SubtitleSnippet(text="And he said,", start=9.50, duration=2.00),
        SubtitleSnippet(text="\"Pa.\"", start=11.60, duration=1.50),
    ]
    
    challenges = grouper.group_into_challenges(raw_snippets)
    assert len(challenges) == 2
    assert challenges[0].position == 1
    assert challenges[0].text == "When my son Patrick came regularly into his playroom."
    assert challenges[0].time_start == 4.37
    assert challenges[0].time_end == pytest.approx(8.83, abs=0.1)

    assert challenges[1].position == 2
    assert challenges[1].text == "And he said, \"Pa.\""
    assert challenges[1].time_start == 9.50
    assert challenges[1].time_end == pytest.approx(13.10, abs=0.1)

def test_sentence_grouper_handles_empty_snippets():
    grouper = SentenceGrouperService()
    challenges = grouper.group_into_challenges([])
    assert challenges == []

def test_sentence_grouper_splits_on_large_pauses():
    grouper = SentenceGrouperService(max_pause_seconds=2.0)
    raw_snippets = [
        SubtitleSnippet(text="First thought without period", start=1.0, duration=2.0), # ends at 3.0
        SubtitleSnippet(text="Second thought after long silence", start=6.0, duration=2.0), # starts at 6.0 (pause 3.0s)
    ]
    challenges = grouper.group_into_challenges(raw_snippets)
    assert len(challenges) == 2

def test_sentence_grouper_enforces_strict_8s_max():
    grouper = SentenceGrouperService(max_duration_seconds=8.0)
    # A long 16s unpunctuated continuous French speech snippet
    raw_snippets = [
        SubtitleSnippet(
            text="savez vous comment fonctionne l'union européenne strasbourg bruxelles tout ça j'étais comme vous alors j'ai voulu comprendre après la seconde guerre mondiale",
            start=0.0,
            duration=16.0,
        )
    ]
    challenges = grouper.group_into_challenges(raw_snippets)
    assert len(challenges) >= 2
    for c in challenges:
        assert (c.time_end - c.time_start) <= 8.01
