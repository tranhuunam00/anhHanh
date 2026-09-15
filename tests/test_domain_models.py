import pytest
from app.domain.models import Challenge, Lesson, WordEvaluation, EvaluationStatus, EvaluationResult
from app.domain.services import WordComparatorService

def test_challenge_creation():
    challenge = Challenge(
        id=1,
        position=1,
        text="When my son Patrick was around three or four years old,",
        translation="Khi con trai Patrick của tôi khoảng ba hoặc bốn tuổi,",
        time_start=4.37,
        time_end=14.95
    )
    assert challenge.id == 1
    assert challenge.position == 1
    assert challenge.duration == pytest.approx(10.58)
    assert len(challenge.clean_words) == 11

def test_word_comparator_exact_match():
    comparator = WordComparatorService()
    target = "When my son Patrick was around three"
    user_input = "When my son Patrick was around three"
    
    result = comparator.evaluate(target=target, user_input=user_input, strict_punctuation=False)
    assert result.is_completed is True
    assert result.accuracy_percentage == 100.0
    assert all(w.status == EvaluationStatus.CORRECT for w in result.words)

def test_word_comparator_partial_and_mistakes():
    comparator = WordComparatorService()
    target = "When my son Patrick was around three"
    user_input = "when my sun patrick was"
    
    result = comparator.evaluate(target=target, user_input=user_input, strict_punctuation=False)
    assert result.is_completed is False
    # 'sun' instead of 'son'
    statuses = [w.status for w in result.words]
    assert statuses[0] == EvaluationStatus.CORRECT # when
    assert statuses[1] == EvaluationStatus.CORRECT # my
    assert statuses[2] == EvaluationStatus.INCORRECT # sun vs son
    assert statuses[3] == EvaluationStatus.CORRECT # patrick
    assert statuses[4] == EvaluationStatus.CORRECT # was
    assert statuses[5] == EvaluationStatus.MISSING # around
    assert statuses[6] == EvaluationStatus.MISSING # three

def test_word_comparator_ignores_punctuation_in_lenient_mode():
    comparator = WordComparatorService()
    target = "\"Look, Daddy, I've made an apple!\""
    user_input = "Look Daddy I've made an apple"
    
    result = comparator.evaluate(target=target, user_input=user_input, strict_punctuation=False)
    assert result.is_completed is True
    assert result.accuracy_percentage == 100.0

def test_lesson_creation():
    c1 = Challenge(id=1, position=1, text="Hello world.", translation="Xin chào thế giới.", time_start=0.0, time_end=2.0)
    c2 = Challenge(id=2, position=2, text="How are you?", translation="Bạn khỏe không?", time_start=2.0, time_end=4.0)
    lesson = Lesson(video_id="test123", title="Test Video", challenges=[c1, c2])
    
    assert lesson.total_challenges == 2
    assert lesson.get_challenge(1) == c1
    assert lesson.get_challenge(2) == c2
    assert lesson.get_challenge(99) is None
