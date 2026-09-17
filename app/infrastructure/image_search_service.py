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


BAD_PATTERNS = [
    'flag', 'icon', 'logo', 'coat_of_arms', 'symbol', 'map', 'chart', 'diagram',
    'pathway', 'sensitiv', 'syndrome', 'autism', 'specimen', 'histology', 'microscop',
    'spider', 'insect', 'fly', 'bug', 'spoiler', 'disclaimer', 'locomotive', 'diesel', 'paraffin',
    '.pdf', '.djvu', '.tif', '.svg', 'ia ', 'dlibra', 'bulletin', 'journal', 'report',
    'manuscript', 'sermon', 'library', 'handbook', 'manual', 'gazette', 'volume', 'edition',
    'portrait', 'monument', 'statue', 'grave', 'tomb', 'cemetery', 'census'
]

ABSTRACT_WORDS = {
    'none', 'less', 'more', 'all', 'any', 'some', 'much', 'many', 'such', 'so',
    'far', 'ever', 'never', 'well', 'quite', 'just', 'too', 'very', 'once', 'least',
    'way', 'thing', 'item', 'something', 'anything', 'nothing'
}


class ImageSearchService:
    @classmethod
    def get_image_candidates(
        cls,
        word: str,
        context_sentence: str = "",
        meaning: str = "",
        max_results: int = 6
    ) -> List[str]:
        clean_word = word.strip().lower()
        candidates: List[str] = []
        seen = set()

        tokens = [w for w in re.findall(r'[a-zA-Z]+', clean_word) if w not in STOP_WORDS]
        meaningful_tokens = [w for w in tokens if w not in ABSTRACT_WORDS and len(w) > 2]
        token_set = set(tokens)

        # Build list of contextual search queries
        queries: List[str] = []

        # 1. Exact phrase query
        if len(tokens) > 1:
            queries.append(f'"{clean_word}"')

        # 2. Semantic expansions for common phrases / idioms
        if 'home' in token_set and any(w in token_set for w in ('way', 'walk', 'commute', 'go', 'drive', 'heading')):
            queries.append('commute home')
            queries.append('walking home')
            queries.append('evening street')
        elif 'care' in token_set and 'take' in token_set:
            queries.append('caring nursing')
            queries.append('helping hand')
        elif 'look' in token_set and 'forward' in token_set:
            queries.append('anticipation celebration')
        elif meaningful_tokens:
            if len(meaningful_tokens) > 1:
                queries.append(' '.join(meaningful_tokens))
            queries.append(meaningful_tokens[-1])
        else:
            queries.append(clean_word)

        # 3. Context sentence fallback: extract concrete nouns/adjectives if phrase is abstract
        if (not meaningful_tokens or clean_word in ('none the less', 'nonetheless', 'as well as', 'in addition to')) and context_sentence:
            c_words = [
                w for w in re.findall(r'[a-zA-Z]+', context_sentence.lower())
                if len(w) > 3 and w not in STOP_WORDS and w not in ABSTRACT_WORDS and w not in token_set
            ]
            if c_words:
                queries.append(c_words[0])
                if len(c_words) > 1:
                    queries.append(f'{c_words[0]} {c_words[1]}')

        headers = {'User-Agent': 'DailyDictationStudio/2.0 (Smart Vocabulary Learning Tool)'}

        for q in queries:
            if len(candidates) >= max_results:
                break
            encoded = urllib.parse.quote(q)

            # 1. Query Wikipedia PageImages (curated, highest semantic accuracy)
            try:
                wiki_url = (
                    "https://en.wikipedia.org/w/api.php?action=query&generator=search"
                    f"&gsrsearch={encoded}&gsrlimit=5&prop=pageimages&pithumbsize=800&format=json"
                )
                req = urllib.request.Request(wiki_url, headers=headers)
                with urllib.request.urlopen(req, timeout=3.0) as resp:
                    data = json.loads(resp.read().decode('utf-8'))
                    pages = data.get('query', {}).get('pages', {})
                    for p in pages.values():
                        title = p.get('title', '').lower()
                        if any(bad in title for bad in BAD_PATTERNS):
                            continue
                        thumb = p.get('thumbnail', {}).get('source')
                        if thumb and thumb not in seen:
                            lower = thumb.lower()
                            if not any(bad in lower for bad in BAD_PATTERNS):
                                seen.add(thumb)
                                candidates.append(thumb)
            except Exception as e:
                logger.debug(f"Wikipedia search error for '{q}': {e}")

            if len(candidates) >= max_results:
                break

            # 2. Query Wikimedia Commons Search for photos with bitmap filter
            try:
                search_q = f"{q} filetype:bitmap"
                commons_url = (
                    "https://commons.wikimedia.org/w/api.php?action=query&generator=search"
                    f"&gsrsearch={urllib.parse.quote(search_q)}&gsrnamespace=6&gsrlimit=8&prop=imageinfo"
                    "&iiprop=url&iiurlwidth=800&format=json"
                )
                req = urllib.request.Request(commons_url, headers=headers)
                with urllib.request.urlopen(req, timeout=3.0) as resp:
                    data = json.loads(resp.read().decode('utf-8'))
                    pages = data.get('query', {}).get('pages', {})
                    for p in pages.values():
                        title = p.get('title', '').lower()
                        if any(bad in title for bad in BAD_PATTERNS):
                            continue
                        info = p.get('imageinfo', [])
                        if info:
                            img_url = info[0].get('thumburl') or info[0].get('url')
                            if img_url and img_url not in seen:
                                lower = img_url.lower()
                                if any(ext in lower for ext in ['.jpg', '.jpeg', '.png', '.webp']):
                                    if not any(bad in lower for bad in BAD_PATTERNS):
                                        seen.add(img_url)
                                        candidates.append(img_url)
            except Exception as e:
                logger.debug(f"Wikimedia Commons search error for '{q}': {e}")

        # 3. Fallback high-quality diverse photos
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

