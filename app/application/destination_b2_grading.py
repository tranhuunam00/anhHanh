"""Destination B2 Exercise Grading Engine.

Follows AGENTS.md:
- Rule 4: File strictly under 500 lines.
- Rule 6: Mandatory function-level unit testing with full 4-aspect coverage.
"""
import re
from typing import Any, Dict, List, Tuple, Union


def normalize_answer_string(text: Union[str, None]) -> str:
    """Normalize student or reference answer for robust comparison.
    
    - Handles None/empty input
    - Strips whitespace
    - Lowercases text
    - Normalizes standard English apostrophes and common contractions
    - Strips trailing/leading punctuation
    """
    if text is None:
        return ""
    
    s = str(text).strip().lower()
    # Normalize curly apostrophes to straight apostrophe
    s = s.replace("’", "'").replace("‘", "'").replace("`", "'")
    # Collapse multiple whitespaces
    s = re.sub(r"\s+", " ", s)
    # Strip optional full stop at the end
    s = s.rstrip(".").rstrip(",")
    return s.strip()


def expand_equivalent_answers(answer: str) -> List[str]:
    """Generate common equivalent variations (e.g., full form vs contraction)."""
    norm = normalize_answer_string(answer)
    if not norm:
        return []

    variations = {norm}

    # Contraction expansions/substitutions
    contraction_pairs = [
        ("don't", "do not"),
        ("doesn't", "does not"),
        ("didn't", "did not"),
        ("isn't", "is not"),
        ("aren't", "are not"),
        ("wasn't", "was not"),
        ("weren't", "were not"),
        ("haven't", "have not"),
        ("hasn't", "has not"),
        ("hadn't", "had not"),
        ("won't", "will not"),
        ("wouldn't", "would not"),
        ("can't", "cannot"),
        ("couldn't", "could not"),
        ("i'm", "i am"),
        ("you're", "you are"),
        ("he's", "he is"),
        ("she's", "she is"),
        ("it's", "it is"),
        ("we're", "we are"),
        ("they're", "they are"),
        ("i've", "i have"),
        ("you've", "you have"),
        ("we've", "we have"),
        ("they've", "they have"),
        ("i'll", "i will"),
        ("you'll", "you will"),
        ("he'll", "he will"),
        ("she'll", "she will"),
        ("they'll", "they will"),
        ("i'd", "i would"),
        ("you'd", "you would"),
        ("he'd", "he would"),
        ("she'd", "she would"),
        ("they'd", "they would"),
    ]

    for short_form, long_form in contraction_pairs:
        if short_form in norm:
            variations.add(norm.replace(short_form, long_form))
        if long_form in norm:
            variations.add(norm.replace(long_form, short_form))

    # Also handle slash options in answer keys (e.g. "have known / have been knowing" or "haven't / have not")
    if "/" in norm:
        for part in norm.split("/"):
            p_clean = part.strip()
            if p_clean:
                variations.add(p_clean)

    return list(variations)


def check_single_answer(user_answer: Any, target_item: Dict[str, Any]) -> Tuple[bool, str]:
    """Check a single answer against target item.
    
    Returns:
        (is_correct: bool, standard_answer_str: str)
    """
    user_norm = normalize_answer_string(user_answer)
    
    # Identify possible correct answers from target_item
    valid_answers: List[str] = []
    
    if "correct_answer" in target_item and target_item["correct_answer"] is not None:
        ca = target_item["correct_answer"]
        if isinstance(ca, list):
            valid_answers.extend(ca)
        else:
            valid_answers.append(str(ca))

    if "answers" in target_item and target_item["answers"] is not None:
        ans_list = target_item["answers"]
        if isinstance(ans_list, list):
            valid_answers.extend(ans_list)
        else:
            valid_answers.append(str(ans_list))

    if "answer" in target_item and target_item["answer"] is not None:
        ans = target_item["answer"]
        if isinstance(ans, list):
            valid_answers.extend(ans)
        else:
            valid_answers.append(str(ans))

    if not valid_answers:
        # No answer key defined, fail-safe
        return False, ""

    standard_display_answer = str(valid_answers[0])

    # Build set of all acceptable normalized answers
    all_acceptable: set = set()
    for ref_ans in valid_answers:
        for variant in expand_equivalent_answers(ref_ans):
            all_acceptable.add(variant)

    is_correct = user_norm in all_acceptable
    return is_correct, standard_display_answer


def grade_exercise_submission(
    exercise_items: List[Dict[str, Any]],
    user_answers: Dict[str, Any]
) -> Dict[str, Any]:
    """Grade an entire exercise submission.
    
    Args:
        exercise_items: List of items from DestinationB2Exercise
        user_answers: Mapping of item key (e.g., "1", "2") to user's answer
        
    Returns:
        Dictionary with score, total_items, correct_items, and detailed results.
    """
    if not exercise_items:
        return {
            "score": 0.0,
            "total_items": 0,
            "correct_items": 0,
            "results": [],
        }

    user_answers = user_answers or {}
    total_items = len(exercise_items)
    correct_count = 0
    results: List[Dict[str, Any]] = []

    for index, item in enumerate(exercise_items, 1):
        # Determine lookup key (try "1", 1, "id", "gap_id", "line")
        item_key = str(item.get("id") or item.get("gap_id") or item.get("line") or index)
        
        # Check user answer by key or by 1-based index
        u_ans = user_answers.get(item_key)
        if u_ans is None and str(index) in user_answers:
            u_ans = user_answers[str(index)]
        if u_ans is None and index in user_answers:
            u_ans = user_answers[index]

        is_correct, ref_ans = check_single_answer(u_ans, item)
        if is_correct:
            correct_count += 1

        results.append({
            "item_key": item_key,
            "item_number": index,
            "user_answer": u_ans if u_ans is not None else "",
            "correct_answer": ref_ans,
            "is_correct": is_correct,
            "explanation": item.get("explanation") or "",
        })

    score = round((correct_count / total_items) * 100.0, 1) if total_items > 0 else 0.0

    return {
        "score": score,
        "total_items": total_items,
        "correct_items": correct_count,
        "results": results,
    }
