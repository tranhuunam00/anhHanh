"""Sentence splitting, reconciliation, and word count utility for AI Writing Studio."""
import re
from typing import List, Dict, Any, Optional


def split_essay_into_sentences(text: Optional[str]) -> List[str]:
    """Split an essay into sequential sentences accurately, preserving abbreviations and decimals."""
    if not text or not str(text).strip():
        return []

    cleaned = str(text).replace('\r\n', '\n').replace('\r', '\n')
    p = cleaned

    # 1. Decimal dots: e.g., 40.5% or 3.14
    p = re.sub(r'(\d+)\.(\d+)', r'\1___DOT___\2', p)

    # 2. Titles: Mr. Mrs. Ms. Dr. Prof. Fig. No.
    p = re.sub(r'\b(Mr|Mrs|Ms|Dr|Prof|Fig|No)\.', r'\1___DOT___', p, flags=re.IGNORECASE)

    # 3. Inner dots of acronyms like U.S. -> U___DOT___S., U.K. -> U___DOT___K.
    p = re.sub(r'\b([A-Z])\.([A-Z])\.', r'\1___DOT___\2.', p)

    # 4. Inline abbreviations not ending a sentence
    p = re.sub(r'\be\.g\.', 'e___DOT___g___DOT___', p, flags=re.IGNORECASE)
    p = re.sub(r'\bi\.e\.', 'i___DOT___e___DOT___', p, flags=re.IGNORECASE)
    p = re.sub(r'\bvs\.', 'vs___DOT___', p, flags=re.IGNORECASE)

    # 5. Acronym followed by lowercase is mid-sentence, protect outer dot
    p = re.sub(r'(\b[A-Za-z]___DOT___[A-Za-z])\.(?=\s+[a-z])', r'\1___DOT___', p)

    # Split by sentence-ending punctuation followed by whitespace, or multiple newlines
    raw_chunks = re.split(r'(?<=[.!?])\s+|\n{2,}', p)

    sentences: List[str] = []
    for chunk in raw_chunks:
        # Also split single newlines if they are separate lines
        lines = chunk.split('\n')
        for line in lines:
            s = line.strip()
            if not s:
                continue
            restored = s.replace('___DOT___', '.').strip()
            if restored:
                sentences.append(restored)

    return sentences


def get_genre_word_count_limits(genre: Optional[str]) -> Dict[str, Any]:
    """Return IELTS/genre-specific word count standards and model essay targets."""
    g = (genre or "").lower().strip()
    if g == "ielts_task1":
        return {
            "genre": "ielts_task1",
            "name": "IELTS Writing Task 1",
            "min_words": 150,
            "target_min": 170,
            "target_max": 215,
        }
    if g == "ielts_task2":
        return {
            "genre": "ielts_task2",
            "name": "IELTS Writing Task 2",
            "min_words": 250,
            "target_min": 275,
            "target_max": 340,
        }
    if g == "email":
        return {
            "genre": "email",
            "name": "Thư tín thương mại (Email)",
            "min_words": 150,
            "target_min": 160,
            "target_max": 220,
        }
    if g == "paragraph":
        return {
            "genre": "paragraph",
            "name": "Đoạn văn học thuật (Paragraph)",
            "min_words": 100,
            "target_min": 120,
            "target_max": 180,
        }
    return {
        "genre": "free",
        "name": "Bài viết tự do",
        "min_words": 100,
        "target_min": 150,
        "target_max": 250,
    }


def compute_word_count(text: Optional[str]) -> int:
    """Compute standard word count by splitting whitespace."""
    if not text:
        return 0
    return len(str(text).strip().split())


def reconcile_sentence_breakdown(
    sentences: List[str],
    ai_breakdown: Optional[List[Dict[str, Any]]],
    corrections: Optional[List[Dict[str, Any]]] = None,
    target_band: float = 7.0
) -> List[Dict[str, Any]]:
    """Ensure 100% of user sentences are present in sentence_breakdown without omission.

    If the AI model skips or omits any sentences, backfill them with accurate
    grammar checks against the corrections list and appropriate upgrade advice.
    """
    if not sentences:
        return []

    corrections_list = corrections if isinstance(corrections, list) else []
    ai_items = ai_breakdown if isinstance(ai_breakdown, list) else []

    # Map AI items by sentence index or fuzzy original matching
    mapped_ai: Dict[int, Dict[str, Any]] = {}
    used_ai_indices = set()

    # Pass 1: match by sentence_num if within range
    for ai_idx, item in enumerate(ai_items):
        if not isinstance(item, dict):
            continue
        s_num = item.get("sentence_num")
        if isinstance(s_num, int) and 1 <= s_num <= len(sentences):
            idx_0 = s_num - 1
            if idx_0 not in mapped_ai:
                mapped_ai[idx_0] = item
                used_ai_indices.add(ai_idx)

    # Pass 2: match remaining AI items by content similarity
    for s_idx, s_text in enumerate(sentences):
        if s_idx in mapped_ai:
            continue
        s_lower = s_text.lower()
        for ai_idx, item in enumerate(ai_items):
            if ai_idx in used_ai_indices or not isinstance(item, dict):
                continue
            orig = str(item.get("original", "")).strip().lower()
            if orig and (orig in s_lower or s_lower in orig):
                mapped_ai[s_idx] = item
                used_ai_indices.add(ai_idx)
                break

    # Build final reconciled list
    final_breakdown: List[Dict[str, Any]] = []
    upgrade_target = min(9.0, round((float(target_band) + 0.5) * 2) / 2)

    for idx, s_text in enumerate(sentences, 1):
        idx_0 = idx - 1
        if idx_0 in mapped_ai:
            item = mapped_ai[idx_0]
            final_breakdown.append({
                "sentence_num": idx,
                "original": s_text,
                "is_grammar_correct": bool(item.get("is_grammar_correct", True)),
                "grammar_analysis": str(item.get("grammar_analysis") or "Ngữ pháp chuẩn xác."),
                "grammar_fix": str(item.get("grammar_fix") or s_text),
                "upgrade_needed": bool(item.get("upgrade_needed", False)),
                "upgraded_sentence": str(item.get("upgraded_sentence") or s_text),
                "upgrade_notes": str(item.get("upgrade_notes") or "Câu tự nhiên, diễn đạt tốt.")
            })
        else:
            # Backfill missing sentence
            matching_corr = next(
                (c for c in corrections_list if isinstance(c, dict) and c.get("original") and str(c["original"]).lower() in s_text.lower()),
                None
            )
            if matching_corr:
                orig_err = str(matching_corr.get("original", ""))
                fixed_snippet = str(matching_corr.get("corrected", ""))
                fixed_s = s_text.replace(orig_err, fixed_snippet) if orig_err else s_text
                final_breakdown.append({
                    "sentence_num": idx,
                    "original": s_text,
                    "is_grammar_correct": False,
                    "grammar_analysis": f"Lỗi ở cụm '{orig_err}': {matching_corr.get('explanation', 'Lỗi ngữ pháp cần chỉnh sửa.')}",
                    "grammar_fix": fixed_s,
                    "upgrade_needed": True,
                    "upgraded_sentence": fixed_s,
                    "upgrade_notes": f"Sửa đúng ngữ pháp cơ bản trước, sau đó nâng cấp cấu trúc lên Band {upgrade_target:.1f}."
                })
            else:
                final_breakdown.append({
                    "sentence_num": idx,
                    "original": s_text,
                    "is_grammar_correct": True,
                    "grammar_analysis": "Đúng hoàn toàn về mặt ngữ pháp rồi.",
                    "grammar_fix": s_text,
                    "upgrade_needed": False,
                    "upgraded_sentence": s_text,
                    "upgrade_notes": f"Câu đã gãy gọn, chuẩn xác ở mục tiêu Band {target_band}."
                })

    return final_breakdown
