"""Official IELTS Writing Prompts Bank unifying Task 1 and Task 2 authentically."""
from typing import List, Dict, Any
from app.infrastructure.ielts_prompts_task2_recent import IELTS_TASK2_PROMPTS_RECENT
from app.infrastructure.ielts_prompts_task2_archive import IELTS_TASK2_PROMPTS_ARCHIVE
from app.infrastructure.ielts_prompts_task1 import IELTS_TASK1_AUTHENTIC_PROMPTS

IELTS_TASK2_AUTHENTIC_PROMPTS: List[Dict[str, Any]] = (
    IELTS_TASK2_PROMPTS_RECENT + IELTS_TASK2_PROMPTS_ARCHIVE
)


def get_all_authentic_ielts_prompts() -> Dict[str, List[Dict[str, Any]]]:
    """Retrieve all authentic IELTS prompts partitioned by task."""
    return {
        "ielts_task2": IELTS_TASK2_AUTHENTIC_PROMPTS,
        "ielts_task1": IELTS_TASK1_AUTHENTIC_PROMPTS,
    }


__all__ = [
    "IELTS_TASK2_AUTHENTIC_PROMPTS",
    "IELTS_TASK1_AUTHENTIC_PROMPTS",
    "get_all_authentic_ielts_prompts",
]
