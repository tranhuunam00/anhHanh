import pytest
from app.domain.services import SentenceGrouperService
from app.domain.models import SubtitleSnippet

def test_sentence_grouper_groups_by_punctuation():
    grouper = SentenceGrouperService()
    raw_snippets = [
        SubtitleSnippet(text="When my son Patrick", start=4.37, duration=4.30),
        SubtitleSnippet(text="was around three or four years old,", start=8.70, duration=2.13),
        SubtitleSnippet(text="I came regularly into his playroom.", start=10.87, duration=4.07),
        SubtitleSnippet(text="And he said,", start=14.95, duration=3.30),
        SubtitleSnippet(text="\"Pa.\"", start=18.28, duration=2.97),
    ]
    
    challenges = grouper.group_into_challenges(raw_snippets)
    assert len(challenges) == 2
    assert challenges[0].position == 1
    assert challenges[0].text == "When my son Patrick was around three or four years old, I came regularly into his playroom."
    assert challenges[0].time_start == 4.37
    assert challenges[0].time_end == pytest.approx(14.94, abs=0.1)
    
    assert challenges[1].position == 2
    assert challenges[1].text == "And he said, \"Pa.\""
    assert challenges[1].time_start == 14.95
    assert challenges[1].time_end == pytest.approx(21.25, abs=0.1)

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
