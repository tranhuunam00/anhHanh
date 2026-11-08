"""Spaced Repetition System (SRS) and Review Quiz Generation Service."""
import re
import random
from datetime import datetime, timedelta, timezone
from typing import List, Dict, Any, Optional, Tuple

FALLBACK_DISTRACTORS = [
    "thành công", "phát triển", "bắt đầu", "kết quả", "thay đổi",
    "quan trọng", "di chuyển", "tự nhiên", "hoàn thành", "kinh nghiệm",
    "cơ hội", "mục tiêu", "thử thách", "kiến thức", "quyết định"
]


def calculate_srs_progress(
    is_correct: bool,
    current_score: Optional[int] = 0,
    current_interval: Optional[int] = 1,
    now: Optional[datetime] = None
) -> Dict[str, Any]:
    """Calculate the next SRS interval, mastery score, and status based on review result.
    
    Ladder:
    1 -> 3 -> 7 -> 14 -> 30 days
    Score >= 4 promotes to 'MASTERED', otherwise 'LEARNING'.
    Failure resets interval to 1 day and status to 'LEARNING'.
    """
    if now is None:
        now = datetime.now(timezone.utc)

    score = current_score if current_score is not None else 0
    curr_int = current_interval if current_interval is not None else 1

    if is_correct:
        new_score = score + 1
        if curr_int == 1:
            next_int = 3
        elif curr_int == 3:
            next_int = 7
        elif curr_int == 7:
            next_int = 14
        else:
            next_int = 30

        new_status = 'MASTERED' if new_score >= 4 else 'LEARNING'
    else:
        new_score = max(0, score - 1)
        next_int = 1
        new_status = 'LEARNING'

    next_review_at = now + timedelta(days=next_int)

    return {
        "mastery_score": new_score,
        "review_interval_days": next_int,
        "next_review_at": next_review_at,
        "status": new_status,
    }


def generate_quiz_options(
    word: str,
    correct_meaning: str,
    candidate_pool: List[str],
    fallback_distractors: Optional[List[str]] = None,
    num_options: int = 4
) -> List[str]:
    """Generate multiple-choice options with 1 correct meaning and (num_options - 1) distinct distractors."""
    fallbacks = fallback_distractors or FALLBACK_DISTRACTORS
    clean_correct = (correct_meaning or "").strip()
    clean_word = (word or "").strip().lower()

    # Filter out empty, non-Vietnamese or matching meanings
    other_candidates = [
        m.strip() for m in candidate_pool
        if m and m.strip()
        and m.strip().lower() != clean_correct.lower()
        and m.strip().lower() != clean_word
        and not re.match(r'^[a-zA-Z\s\-]+$', m.strip())
    ]
    other_candidates = list(dict.fromkeys(other_candidates))

    num_distractors_needed = max(1, num_options - 1)
    selected_distractors = random.sample(other_candidates, min(num_distractors_needed, len(other_candidates)))

    fb_idx = 0
    while len(selected_distractors) < num_distractors_needed and fb_idx < len(fallbacks) * 2:
        dummy = fallbacks[fb_idx % len(fallbacks)]
        fb_idx += 1
        if (
            dummy.lower() != clean_correct.lower()
            and dummy not in selected_distractors
        ):
            selected_distractors.append(dummy)

    options = selected_distractors + [clean_correct or "Chưa có nghĩa tiếng Việt"]
    random.shuffle(options)
    return options


def resolve_mastered_at_timestamp(
    new_status: Optional[str],
    now: Optional[datetime] = None
) -> Optional[datetime]:
    """Resolve the mastered_at timestamp when updating a vocabulary word's status.

    - When new_status is 'MASTERED' (case-insensitive): returns current UTC timestamp (or `now`).
    - When new_status is 'NEW', 'LEARNING', or any non-MASTERED status: returns None (clears column).
    """
    if not new_status or not isinstance(new_status, str):
        return None
    normalized = new_status.strip().upper()
    if normalized == 'MASTERED':
        return now if now is not None else datetime.now(timezone.utc)
    return None


def compute_time_range_bounds(
    time_range: Optional[str],
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    now: Optional[datetime] = None
) -> Tuple[Optional[datetime], Optional[datetime]]:
    """Compute (start_dt, end_dt) UTC datetime bounds for vocabulary time filtering."""
    if not time_range or not isinstance(time_range, str):
        return (None, None)

    tr = time_range.strip().upper()
    if tr == 'ALL' or not tr:
        return (None, None)

    ref_now = now if now is not None else datetime.now(timezone.utc)
    if ref_now.tzinfo is None:
        ref_now = ref_now.replace(tzinfo=timezone.utc)

    if tr == 'TODAY':
        today_start = datetime(ref_now.year, ref_now.month, ref_now.day, 0, 0, 0, tzinfo=timezone.utc)
        return (today_start, None)
    if tr == '3DAYS':
        return (ref_now - timedelta(days=3), None)
    if tr == '7DAYS':
        return (ref_now - timedelta(days=7), None)
    if tr == '30DAYS':
        return (ref_now - timedelta(days=30), None)
    if tr == 'CUSTOM':
        s_dt: Optional[datetime] = None
        e_dt: Optional[datetime] = None
        if start_date and isinstance(start_date, str) and start_date.strip():
            try:
                parsed_s = datetime.fromisoformat(start_date.strip())
                s_dt = parsed_s.replace(hour=0, minute=0, second=0, microsecond=0, tzinfo=timezone.utc)
            except Exception:
                s_dt = None
        if end_date and isinstance(end_date, str) and end_date.strip():
            try:
                parsed_e = datetime.fromisoformat(end_date.strip())
                e_dt = parsed_e.replace(hour=23, minute=59, second=59, microsecond=999999, tzinfo=timezone.utc)
            except Exception:
                e_dt = None
        return (s_dt, e_dt)

    return (None, None)

