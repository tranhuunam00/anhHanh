"""AI Writing Service Facade coordinating prompt generation, essay scoring and evaluation."""
import os
import logging
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

from app.infrastructure.writing_prompts_catalog import (
    CURATED_PROMPTS_BY_LANG,
    CURATED_PROMPTS,
    LANGUAGES_CONFIG,
)
from app.infrastructure.ai_writing_generator import (
    generate_prompt_impl,
    suggest_structures_impl,
)
from app.infrastructure.ai_writing_evaluator import (
    generate_fallback_sentence_breakdown,
    evaluate_writing_impl,
)

load_dotenv(override=True)
logger = logging.getLogger(__name__)


def get_gemini_api_key() -> str:
    """Dynamically get GEMINI_API_KEY from environment or .env, reloading on demand."""
    load_dotenv(override=True)
    return (os.getenv("GEMINI_API_KEY", "") or "").strip()


class AIWritingService:
    @classmethod
    def get_prompts_library(cls, language: Optional[str] = None) -> Any:
        """Return curated prompts library, either by specific language or backward-compatible dictionary."""
        if language and language in CURATED_PROMPTS_BY_LANG:
            return CURATED_PROMPTS_BY_LANG[language]
        res = dict(CURATED_PROMPTS_BY_LANG["en"])
        for lang_code, lang_data in CURATED_PROMPTS_BY_LANG.items():
            res[lang_code] = lang_data
        return res

    @classmethod
    async def generate_prompt(
        cls,
        genre: str,
        topic_area: Optional[str] = None,
        language: str = "en",
        sub_type: Optional[str] = None
    ) -> Dict[str, Any]:
        """Generate a brand new realistic writing prompt in chosen language & sub-type."""
        api_key = get_gemini_api_key()
        return await generate_prompt_impl(
            genre=genre,
            topic_area=topic_area,
            language=language,
            sub_type=sub_type,
            api_key=api_key,
        )

    @classmethod
    async def suggest_structures(
        cls,
        topic: str,
        language: str = "en",
        target_band: float = 7.0,
        genre: str = "ielts_task2"
    ) -> Dict[str, Any]:
        """Generate tailored collocations, argument patterns and structures specifically for this topic."""
        api_key = get_gemini_api_key()
        return await suggest_structures_impl(
            topic=topic,
            language=language,
            target_band=target_band,
            genre=genre,
            api_key=api_key,
        )

    @classmethod
    def _generate_fallback_sentence_breakdown(cls, content: str, corrections: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Split essay into sequential sentences and evaluate each sentence thoroughly."""
        return generate_fallback_sentence_breakdown(content=content, corrections=corrections)

    @classmethod
    async def evaluate_writing(
        cls,
        topic: str,
        content: str,
        genre: str = "ielts_task2",
        target_band: float = 7.0,
        language: str = "en",
        images: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """Grade and thoroughly evaluate a student's writing submission using Gemini AI."""
        api_key = get_gemini_api_key()
        return await evaluate_writing_impl(
            topic=topic,
            content=content,
            genre=genre,
            target_band=target_band,
            language=language,
            images=images,
            api_key=api_key,
        )


__all__ = [
    "AIWritingService",
    "get_gemini_api_key",
    "CURATED_PROMPTS_BY_LANG",
    "CURATED_PROMPTS",
    "LANGUAGES_CONFIG",
    "generate_fallback_sentence_breakdown",
    "generate_prompt_impl",
    "suggest_structures_impl",
    "evaluate_writing_impl",
]
