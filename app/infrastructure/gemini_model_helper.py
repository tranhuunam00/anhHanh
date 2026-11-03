import hashlib
import logging
import time
from typing import Dict, List, Optional, Tuple
import httpx

logger = logging.getLogger(__name__)

# Default candidate models prioritized for speed, cost, and reliability
DEFAULT_GEMINI_MODELS: List[str] = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-2.5-pro",
]

_CACHED_MODELS: Dict[str, Tuple[List[str], float]] = {}
CACHE_TTL_SECONDS = 3600.0  # Cache model list for 1 hour


def get_default_candidate_models() -> List[str]:
    """Return a fresh copy of default candidate models."""
    return list(DEFAULT_GEMINI_MODELS)


def clear_model_cache() -> None:
    """Clear in-memory cache of discovered models (useful for testing or key rotation)."""
    global _CACHED_MODELS
    _CACHED_MODELS.clear()


def filter_and_prioritize_models(raw_models: Optional[List[dict]]) -> List[str]:
    """
    Filter raw models from ModelService.ListModels for generateContent support
    and prioritize flash models over pro models.
    """
    if not raw_models or not isinstance(raw_models, list):
        return []

    valid_models: List[str] = []
    for m in raw_models:
        if not isinstance(m, dict):
            continue
        methods = m.get("supportedGenerationMethods", [])
        if isinstance(methods, list) and "generateContent" in methods:
            name = str(m.get("name", "")).strip()
            if name.startswith("models/"):
                name = name[7:]
            if name and name not in valid_models:
                valid_models.append(name)

    if not valid_models:
        return []

    # Sort priorities:
    # Tier 1: Gemini 2.5/2.0 Flash
    # Tier 2: Other Flash models
    # Tier 3: Pro models
    # Tier 4: Other models
    def sort_key(model_name: str) -> Tuple[int, int, str]:
        name_lower = model_name.lower()
        if "flash" in name_lower:
            if "2.5" in name_lower:
                tier = 0
            elif "2.0" in name_lower:
                tier = 1
            else:
                tier = 2
        elif "pro" in name_lower:
            tier = 3
        else:
            tier = 4
        return (tier, -len(model_name), model_name)

    return sorted(valid_models, key=sort_key)


async def discover_gemini_models(api_key: str, client: httpx.AsyncClient) -> List[str]:
    """
    Dynamically discover available models supporting generateContent for the provided API key
    using ModelService.ListModels. Results are cached for 1 hour.
    """
    if not api_key or not isinstance(api_key, str) or not api_key.strip():
        return []

    clean_key = api_key.strip()
    key_hash = hashlib.sha256(clean_key.encode("utf-8")).hexdigest()
    now = time.time()

    # Check cache
    if key_hash in _CACHED_MODELS:
        models, timestamp = _CACHED_MODELS[key_hash]
        if now - timestamp < CACHE_TTL_SECONDS and models:
            return list(models)

    headers = {"x-goog-api-key": clean_key}

    # Try v1beta first, fallback to v1
    for api_version in ["v1beta", "v1"]:
        url = f"https://generativelanguage.googleapis.com/{api_version}/models?key={clean_key}"
        try:
            resp = await client.get(url, headers=headers, timeout=10.0)
            if resp.status_code == 200:
                data = resp.json()
                raw_models = data.get("models", [])
                prioritized = filter_and_prioritize_models(raw_models)
                if prioritized:
                    _CACHED_MODELS[key_hash] = (prioritized, now)
                    logger.info(f"Discovered {len(prioritized)} Gemini models from {api_version}: {prioritized[:4]}")
                    return prioritized
            else:
                logger.warning(
                    f"ModelService.ListModels on {api_version} returned HTTP {resp.status_code}: {resp.text[:150]}"
                )
        except Exception as ex:
            logger.warning(f"Failed to query ModelService.ListModels on {api_version}: {ex}")

    return []


async def get_candidate_gemini_models(
    api_key: str, client: Optional[httpx.AsyncClient] = None
) -> List[str]:
    """
    Return candidate model names to try. Attempts dynamic discovery via ListModels,
    and falls back to DEFAULT_GEMINI_MODELS if discovery returns empty.
    """
    if not api_key or not isinstance(api_key, str) or not api_key.strip():
        return get_default_candidate_models()

    if client is not None:
        try:
            discovered = await discover_gemini_models(api_key, client)
            if discovered:
                return discovered
        except Exception as ex:
            logger.warning(f"Error during dynamic model discovery: {ex}")

    return get_default_candidate_models()

