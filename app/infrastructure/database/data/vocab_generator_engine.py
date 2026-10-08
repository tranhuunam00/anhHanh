"""Vocab Bank Data Engine for building bilingual terms across 30 topics.
Supports English (en) and French (fr) with single words and phrases.
"""
from typing import List, Dict, Any
from app.constants.vocab_topics import VOCAB_TOPICS, get_vocab_topics

CATEGORIES_CATALOG = VOCAB_TOPICS

def get_categories_catalog() -> List[Dict[str, Any]]:
    """Return catalog of 30 standard categories with icons and dual names."""
    return get_vocab_topics()
