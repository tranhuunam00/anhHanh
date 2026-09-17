"""Image Search and Smart Vocabulary Enrichment Service for DailyDictation Studio.
Fetches relevant contextual images from Wikimedia Commons / Wikipedia PageImages
and queries accurate IPA phonetics via Datamuse API & DictionaryAPI.
"""
import logging
import urllib.parse
import urllib.request
import json
import re
from typing import List, Optional

logger = logging.getLogger(__name__)

STOP_WORDS = {
    'a', 'an', 'the', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'and', 'or', 'but', 'is', 'are', 'was', 'were', 'it', 'its', 'my', 'your',
    'his', 'her', 'their', 'our', 'this', 'that', 'these', 'those'
}


class ImageSearchService:
    @staticmethod
    def get_image_candidates(word: str, max_results: int = 6) -> List[str]:
        clean_word = word.strip().lower()
        candidates: List[str] = []
        seen = set()

        # Build list of search queries: full phrase, filtered keywords, and last noun
        queries = [clean_word]
        tokens = [w for w in re.findall(r'[a-zA-Z]+', clean_word) if len(w) > 2 and w not in STOP_WORDS]
        if len(tokens) > 1:
            queries.append(' '.join(tokens))
            queries.append(tokens[-1])  # e.g., 'home' in 'on your way home'
        elif len(tokens) == 1 and tokens[0] != clean_word:
            queries.append(tokens[0])

        headers = {'User-Agent': 'DailyDictationStudio/2.0 (Smart Vocabulary Learning Tool)'}

        for q in queries:
            if len(candidates) >= max_results:
                break
            encoded = urllib.parse.quote(q)

            # 1. Query Wikimedia Commons Search for free photos
            try:
                commons_url = (
                    "https://commons.wikimedia.org/w/api.php?action=query&generator=search"
                    f"&gsrsearch={encoded}&gsrnamespace=6&gsrlimit=8&prop=imageinfo"
                    "&iiprop=url&iiurlwidth=800&format=json"
                )
                req = urllib.request.Request(commons_url, headers=headers)
                with urllib.request.urlopen(req, timeout=3.5) as resp:
                    data = json.loads(resp.read().decode('utf-8'))
                    pages = data.get('query', {}).get('pages', {})
                    for p in pages.values():
                        info = p.get('imageinfo', [])
                        if info:
                            img_url = info[0].get('thumburl') or info[0].get('url')
                            if img_url and img_url not in seen:
                                lower = img_url.lower()
                                if any(ext in lower for ext in ['.jpg', '.jpeg', '.png', '.webp']):
                                    if not any(bad in lower for bad in ['flag', 'icon', 'logo', 'coat_of_arms', 'symbol']):
                                        seen.add(img_url)
                                        candidates.append(img_url)
            except Exception as e:
                logger.debug(f"Wikimedia Commons search error for '{q}': {e}")

            # 2. Query Wikipedia PageImages
            try:
                wiki_url = (
                    "https://en.wikipedia.org/w/api.php?action=query&generator=search"
                    f"&gsrsearch={encoded}&gsrlimit=5&prop=pageimages&pithumbsize=800&format=json"
                )
                req = urllib.request.Request(wiki_url, headers=headers)
                with urllib.request.urlopen(req, timeout=3.5) as resp:
                    data = json.loads(resp.read().decode('utf-8'))
                    pages = data.get('query', {}).get('pages', {})
                    for p in pages.values():
                        thumb = p.get('thumbnail', {}).get('source')
                        if thumb and thumb not in seen:
                            seen.add(thumb)
                            candidates.append(thumb)
            except Exception as e:
                logger.debug(f"Wikipedia search error for '{q}': {e}")

        # Fallback high-quality diverse photos (nature, cities, objects, lifestyle)
        fallback_pool = [
            "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1493612276216-ee3925520721?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
        ]
        for fb in fallback_pool:
            if len(candidates) >= max_results:
                break
            if fb not in seen:
                seen.add(fb)
                candidates.append(fb)

        return candidates[:max_results]

    @staticmethod
    def _fetch_single_word_ipa(clean_token: str) -> Optional[str]:
        """Fetch IPA pronunciation for a single English word via Datamuse API and DictionaryAPI."""
        if not clean_token:
            return None

        # 1. Primary: Datamuse API (fast, reliable, returns ipa_pron tag)
        try:
            url = f"https://api.datamuse.com/words?sp={urllib.parse.quote(clean_token)}&qe=sp&md=r&ipa=1"
            req = urllib.request.Request(url, headers={'User-Agent': 'DailyDictationStudio/2.0'})
            with urllib.request.urlopen(req, timeout=2.5) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                if data and isinstance(data, list):
                    for item in data:
                        if item.get('word', '').lower() == clean_token.lower():
                            for t in item.get('tags', []):
                                if t.startswith('ipa_pron:'):
                                    return t.split(':', 1)[1].strip()
        except Exception:
            pass

        # 2. Secondary fallback: DictionaryAPI
        try:
            url = f"https://api.dictionaryapi.dev/api/v2/entries/en/{urllib.parse.quote(clean_token)}"
            req = urllib.request.Request(url, headers={'User-Agent': 'DailyDictationStudio/2.0'})
            with urllib.request.urlopen(req, timeout=2.0) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                if isinstance(data, list) and len(data) > 0:
                    phonetic = data[0].get('phonetic')
                    if not phonetic and 'phonetics' in data[0]:
                        for p in data[0]['phonetics']:
                            if p.get('text'):
                                return p['text'].strip('/')
                    if phonetic:
                        return phonetic.strip('/')
        except Exception:
            pass

        return None

    @classmethod
    def get_word_phonetic(cls, word: str) -> Optional[str]:
        """Query and format standard IPA phonetic notation for words or compound phrases."""
        clean = word.strip().lower()
        tokens = [w for w in re.findall(r"[a-zA-Z']+", clean) if w]
        if not tokens:
            return None

        if len(tokens) == 1:
            ipa = cls._fetch_single_word_ipa(tokens[0])
            if ipa:
                clean_ipa = ipa.strip("/[] ").replace("'", "ˈ").replace(",", "ˌ")
                return f"/{clean_ipa}/"
            return None

        # Multi-word phrase: fetch standard IPA for each word and assemble
        ipa_parts = []
        for token in tokens:
            token_ipa = cls._fetch_single_word_ipa(token)
            if token_ipa:
                clean_token = token_ipa.strip("/[] ").replace("'", "ˈ").replace(",", "ˌ")
                ipa_parts.append(clean_token)
            else:
                ipa_parts.append(token)

        if ipa_parts:
            return f"/{' '.join(ipa_parts)}/"
        return None

