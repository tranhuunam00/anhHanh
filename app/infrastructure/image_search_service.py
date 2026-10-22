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
    'portrait', 'monument', 'statue', 'grave', 'tomb', 'cemetery', 'census',
    'valsalva', 'heimlich', 'cadastre', 'geologie', 'g%c3%a9ologie', 'hydro', 'natura_2000',
    'orthophoto', 'medical', 'surgery', 'patient', 'hospital', 'clinical', 'radiography', 'x-ray', 'anatomy', 'procedure'
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
        raw_word = (word or "").strip()
        if not raw_word:
            return []

        candidates: List[str] = []
        seen = set()
        headers = {'User-Agent': 'DailyDictationStudio/2.0 (Smart Vocabulary Learning Tool)'}

        is_zh = bool(re.search(r'[\u4e00-\u9fff]', raw_word))
        queries: List[str] = []

        if is_zh:
            queries.append(raw_word)
            if context_sentence and re.search(r'[\u4e00-\u9fff]', context_sentence):
                # Context words for Chinese if available
                zh_parts = re.findall(r'[\u4e00-\u9fff]{2,4}', context_sentence)
                for part in zh_parts:
                    if part != raw_word and part not in queries:
                        queries.append(part)
            wiki_domain = "zh.wikipedia.org"
        else:
            wiki_domain = "en.wikipedia.org"
            clean_word = raw_word.lower()
            tokens = [w for w in re.findall(r'[a-zA-Z]+', clean_word) if w not in STOP_WORDS]
            token_set = set(tokens)
            meaningful_tokens = [w for w in tokens if w not in ABSTRACT_WORDS and len(w) > 2]

            # Context sentence salient words extraction
            c_words = [
                w for w in re.findall(r'[a-zA-Z]+', (context_sentence or "").lower())
                if len(w) > 3 and w not in STOP_WORDS and w not in ABSTRACT_WORDS and w not in token_set
            ]

            # 1. High priority: Contextual noun/action + target word
            if c_words:
                queries.append(f"{c_words[0]} {clean_word}")
                if len(c_words) > 1:
                    queries.append(f"{c_words[1]} {clean_word}")
                queries.append(f"{c_words[0]} {c_words[1]}")

            # 2. Idiom expansions
            if 'home' in token_set and any(w in token_set for w in ('way', 'walk', 'commute', 'go', 'drive', 'heading')):
                queries.append('commute home')
                queries.append('walking home')
            elif 'care' in token_set and 'take' in token_set:
                queries.append('caring nursing')
            elif 'look' in token_set and 'forward' in token_set:
                queries.append('anticipation celebration')
            elif meaningful_tokens:
                if len(meaningful_tokens) > 1:
                    queries.append(' '.join(meaningful_tokens))
                queries.append(meaningful_tokens[-1])
            else:
                queries.append(clean_word)

        for q in queries:
            if len(candidates) >= max_results:
                break
            encoded = urllib.parse.quote(q)

            # 1. Query Wikipedia PageImages (curated semantic accuracy)
            try:
                wiki_url = (
                    f"https://{wiki_domain}/w/api.php?action=query&generator=search"
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

    @classmethod
    def get_word_details(cls, word: str) -> dict:
        """Fetch rich dictionary details including IPA (UK/US), part of speech, and English definition."""
        clean = word.strip().lower()
        tokens = [w for w in re.findall(r"[a-zA-Z']+", clean) if w]
        if not tokens:
            return {
                "word": word,
                "ipa": None,
                "ipa_uk": None,
                "ipa_us": None,
                "part_of_speech": None,
                "definition": None
            }

        target_token = tokens[0] if len(tokens) == 1 else clean
        ipa = None
        part_of_speech = None
        definition = None

        pos_map = {
            'n': 'noun',
            'v': 'verb',
            'adj': 'adjective',
            'adv': 'adverb',
            'prep': 'preposition',
            'conj': 'conjunction',
            'pron': 'pronoun',
            'interj': 'interjection',
            'det': 'determiner',
        }

        try:
            url = f"https://api.datamuse.com/words?sp={urllib.parse.quote(target_token)}&qe=sp&md=dr&ipa=1"
            req = urllib.request.Request(url, headers={'User-Agent': 'DailyDictationStudio/2.0'})
            with urllib.request.urlopen(req, timeout=2.5) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                if data and isinstance(data, list):
                    for item in data:
                        if item.get('word', '').lower() == target_token.lower():
                            for t in item.get('tags', []):
                                if t.startswith('ipa_pron:'):
                                    raw_ipa = t.split(':', 1)[1].strip()
                                    raw_ipa = raw_ipa.strip("/[] ").replace("'", "ˈ").replace(",", "ˌ")
                                    ipa = f"/{raw_ipa}/"
                                    break
                            defs = item.get('defs', [])
                            if defs and isinstance(defs, list) and len(defs) > 0:
                                collected_pos = []
                                seen_pos = set()
                                for d in defs:
                                    if '\t' in d:
                                        raw_pos, raw_desc = d.split('\t', 1)
                                        norm_pos = pos_map.get(raw_pos.strip().lower(), raw_pos.strip())
                                        if norm_pos and norm_pos.lower() not in seen_pos:
                                            seen_pos.add(norm_pos.lower())
                                            collected_pos.append(norm_pos)
                                        if not definition and raw_desc.strip():
                                            definition = raw_desc.strip()
                                    elif not definition and d.strip():
                                        definition = d.strip()

                                if collected_pos:
                                    part_of_speech = ", ".join(collected_pos)
                            break
        except Exception:
            pass

        if not part_of_speech and ' ' in clean:
            part_of_speech = "phrase"

        # Fallback to cls.get_word_phonetic if Datamuse direct call didn't yield IPA
        if not ipa:
            ipa = cls.get_word_phonetic(word)

        return {
            "word": word,
            "ipa": ipa,
            "ipa_uk": ipa,
            "ipa_us": ipa,
            "part_of_speech": part_of_speech,
            "definition": definition
        }

