"""English Connected Speech & Phonology Breakdown Engine.
Analyzes sentences for phonological phenomena:
- Consonant-to-Vowel Linking (Liaison)
- Vowel-to-Vowel Glides (/j/ and /w/)
- Elision (T/D deletion between consonants)
- Coalescent Assimilation (/t, d/ + /j/ -> /tʃ, dʒ/)
- Weak Forms (Function words reduced to Schwa /ə/)
"""
import re
from typing import List, Dict, Any, Optional, Tuple


# List of common unstressed function words and their weak forms
WEAK_FORM_RULES: Dict[str, Dict[str, str]] = {
    "to": {"strong": "/tuː/", "weak": "/tə/", "note": "Phát âm thành Schwa /tə/ trước phụ âm"},
    "for": {"strong": "/fɔːr/", "weak": "/fər/", "note": "Giảm âm thành /fər/"},
    "can": {"strong": "/kæn/", "weak": "/kən/", "note": "Trợ động từ 'can' phát âm nhẹ thành /kən/"},
    "and": {"strong": "/ænd/", "weak": "/ən/", "note": "Thường nuốt âm /d/, phát âm thành /ən/ hoặc /nd/"},
    "of": {"strong": "/ɒv/", "weak": "/əv/", "note": "Giảm âm thành /əv/"},
    "at": {"strong": "/æt/", "weak": "/ət/", "note": "Giảm âm thành /ət/"},
    "from": {"strong": "/frɒm/", "weak": "/frəm/", "note": "Giảm âm thành /frəm/"},
    "have": {"strong": "/hæv/", "weak": "/həv/ hoặc /əv/", "note": "Trợ động từ 'have' giảm âm thành /həv/"},
    "has": {"strong": "/hæz/", "weak": "/həz/ hoặc /əz/", "note": "Trợ động từ 'has' giảm âm thành /həz/"},
    "had": {"strong": "/hæd/", "weak": "/həd/", "note": "Trợ động từ 'had' giảm âm thành /həd/"},
    "was": {"strong": "/wɒz/", "weak": "/wəz/", "note": "Động từ to be 'was' giảm âm thành /wəz/"},
    "are": {"strong": "/ɑːr/", "weak": "/ər/", "note": "Động từ to be 'are' giảm âm thành /ər/"},
    "that": {"strong": "/ðæt/", "weak": "/ðət/", "note": "Liên từ 'that' giảm âm thành /ðət/"},
    "them": {"strong": "/ðem/", "weak": "/ðəm/", "note": "Đại từ 'them' giảm âm thành /ðəm/ hoặc /əm/"},
    "as": {"strong": "/æz/", "weak": "/əz/", "note": "Giảm âm thành /əz/"},
    "than": {"strong": "/ðæn/", "weak": "/ðən/", "note": "Giảm âm thành /ðən/"},
    "some": {"strong": "/sʌm/", "weak": "/səm/", "note": "Từ chỉ định 'some' giảm âm thành /səm/"},
    "but": {"strong": "/bʌt/", "weak": "/bət/", "note": "Liên từ 'but' giảm âm thành /bət/"},
    "you": {"strong": "/juː/", "weak": "/jə/", "note": "Trong văn nói nhanh thường phát âm nhẹ /jə/"},
    "your": {"strong": "/jɔːr/", "weak": "/jər/", "note": "Tính từ sở hữu 'your' giảm âm thành /jər/"},
    "do": {"strong": "/duː/", "weak": "/də/", "note": "Trợ động từ 'do' giảm âm thành /də/ trước phụ âm"},
    "does": {"strong": "/dʌz/", "weak": "/dəz/", "note": "Trợ động từ 'does' giảm âm thành /dəz/"},
    "been": {"strong": "/biːn/", "weak": "/bɪn/", "note": "Giảm âm thành /bɪn/"},
}

# Letters/phonemes heuristics when offline IPA is not available
VOWELS = set("aeiouAEIOU")
FRONT_VOWEL_ENDINGS = ("ee", "y", "ie", "ea", "ay", "ey", "i")
BACK_VOWEL_ENDINGS = ("oo", "ow", "o", "ew", "ue", "ou")
CONSONANTS_NO_ELISION = set("bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ")


class PhonologyEngine:
    """Offline Rule-Based Phonological Breakdown Engine."""

    def __init__(self, ipa_lookup_func=None):
        """
        :param ipa_lookup_func: optional async or sync function(word) -> {ipa, ipa_uk, ipa_us}
        """
        self.ipa_lookup_func = ipa_lookup_func

    def analyze_sentence(self, sentence: str, ipa_dict: Optional[Dict[str, str]] = None) -> Dict[str, Any]:
        """
        Takes an English sentence string and analyzes all word boundaries and tokens.
        Returns:
            - tokens: list of word tokens with position, IPA, weak form flags
            - phenomena: list of detected connected speech phenomena between words
            - annotated_text: string representation with liaison symbols (‿, ᵂ, ᴶ, ⚡, ✕)
            - connected_ipa_preview: approximated smooth IPA representation
        """
        ipa_dict = ipa_dict or {}
        raw_words = re.findall(r"\b[\w'-]+\b", sentence)
        if not raw_words:
            return {
                "original_text": sentence,
                "tokens": [],
                "phenomena": [],
                "annotated_text": sentence,
                "connected_ipa": "",
            }

        # 1. Build Token List & Check Weak Forms
        tokens = []
        for idx, w in enumerate(raw_words):
            clean_lower = w.lower().strip("'")
            word_ipa = ipa_dict.get(clean_lower) or ipa_dict.get(w) or ""
            
            weak_info = None
            if clean_lower in WEAK_FORM_RULES:
                # Last word in sentence is usually not weak form
                is_sentence_final = (idx == len(raw_words) - 1)
                if not is_sentence_final:
                    rule = WEAK_FORM_RULES[clean_lower]
                    weak_info = {
                        "strong_ipa": rule["strong"],
                        "weak_ipa": rule["weak"],
                        "note": rule["note"]
                    }

            tokens.append({
                "index": idx,
                "word": w,
                "clean": clean_lower,
                "ipa": word_ipa,
                "is_weak_form": weak_info is not None,
                "weak_info": weak_info,
            })

        # 2. Analyze Boundaries Between Consecutive Words
        phenomena = []
        boundary_symbols = {}  # index -> symbol

        for i in range(len(tokens) - 1):
            w1 = tokens[i]
            w2 = tokens[i + 1]
            
            boundary_res = self._check_boundary(w1, w2)
            if boundary_res:
                boundary_res["word1_index"] = i
                boundary_res["word2_index"] = i + 1
                phenomena.append(boundary_res)
                boundary_symbols[i] = boundary_res["symbol"]

        # 3. Construct Visual Annotated Text
        # Insert connecting symbols between words in sentence
        annotated_parts = []
        for i, tok in enumerate(tokens):
            annotated_parts.append(tok["word"])
            if i in boundary_symbols:
                sym = boundary_symbols[i]
                annotated_parts.append(f" {sym} ")
            elif i < len(tokens) - 1:
                annotated_parts.append(" ")
        
        annotated_text = "".join(annotated_parts)

        # 4. Construct Connected IPA Preview
        connected_ipa = self._build_connected_ipa(tokens, phenomena)

        return {
            "original_text": sentence,
            "tokens": tokens,
            "phenomena": phenomena,
            "annotated_text": annotated_text,
            "connected_ipa": connected_ipa,
        }

    def _check_boundary(self, w1: Dict[str, Any], w2: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Evaluates two adjacent words for phonological processes."""
        t1 = w1["clean"]
        t2 = w2["clean"]
        ipa1 = w1.get("ipa", "")
        ipa2 = w2.get("ipa", "")

        # -------------------------------------------------------------
        # Rule 1: Coalescent Assimilation (/t, d, s, z/ + /j/ in 'you' / 'your')
        # -------------------------------------------------------------
        if t2 in ("you", "your", "yours", "yourself", "yet"):
            if t1.endswith("t"):
                return {
                    "type": "ASSIMILATION_CH",
                    "symbol": "⚡",
                    "name_vi": "Biến âm /t/ + /j/ ➔ /tʃ/",
                    "pair": f"{w1['word']} + {w2['word']}",
                    "connected_sound": f"/{t1[:-1]}-tʃuː/",
                    "explanation": f"Âm kết thúc /t/ của '{w1['word']}' gặp âm đầu /j/ của '{w2['word']}' hòa nhập thành âm /tʃ/ ('ch'). Ví dụ '{w1['word']} {w2['word']}' đọc thành '{t1[:-1]}ch-oo'.",
                }
            elif t1.endswith("d"):
                return {
                    "type": "ASSIMILATION_DJ",
                    "symbol": "⚡",
                    "name_vi": "Biến âm /d/ + /j/ ➔ /dʒ/",
                    "pair": f"{w1['word']} + {w2['word']}",
                    "connected_sound": f"/{t1[:-1]}-dʒuː/",
                    "explanation": f"Âm kết thúc /d/ của '{w1['word']}' gặp âm đầu /j/ của '{w2['word']}' hòa nhập thành âm /dʒ/ ('dj'). Ví dụ '{w1['word']} {w2['word']}' đọc thành '{t1[:-1]}j-oo'.",
                }
            elif t1.endswith("s"):
                return {
                    "type": "ASSIMILATION_SH",
                    "symbol": "⚡",
                    "name_vi": "Biến âm /s/ + /j/ ➔ /ʃ/",
                    "pair": f"{w1['word']} + {w2['word']}",
                    "connected_sound": f"/{t1[:-1]}-ʃuː/",
                    "explanation": f"Âm /s/ gặp /j/ biến đổi thành âm /ʃ/ ('sh').",
                }

        # -------------------------------------------------------------
        # Rule 2: Elision (Nuốt âm /t/ hoặc /d/ giữa các phụ âm)
        # Ví dụ: "last night", "next door", "hold tight", "stand there"
        # -------------------------------------------------------------
        if (t1.endswith("st") or t1.endswith("xt") or t1.endswith("nd") or t1.endswith("ld") or t1.endswith("ct")) and len(t1) >= 3:
            # Check if word2 starts with a consonant
            if t2[0] not in VOWELS and t2[0] not in ("w", "y", "h"):
                elided_letter = t1[-1]
                return {
                    "type": "ELISION_TD",
                    "symbol": "✕",
                    "name_vi": f"Nuốt âm (Elision) /{elided_letter}/",
                    "pair": f"{w1['word']} + {w2['word']}",
                    "connected_sound": f"{t1[:-1]}' {t2}",
                    "explanation": f"Âm /{elided_letter}/ ở cuối từ '{w1['word']}' nằm giữa 2 phụ âm sẽ bị nuốt/lược bỏ hoàn toàn khi nói nhanh để câu tự nhiên và mượt hơn.",
                }

        # -------------------------------------------------------------
        # Rule 3: Vowel-to-Vowel Glide (/w/ glide hoặc /j/ glide)
        # -------------------------------------------------------------
        is_vowel_start_w2 = t2[0] in VOWELS
        is_vowel_end_w1 = t1[-1] in VOWELS or any(t1.endswith(sfx) for sfx in FRONT_VOWEL_ENDINGS + BACK_VOWEL_ENDINGS)

        if is_vowel_end_w1 and is_vowel_start_w2:
            # Front vowel ending -> /j/ glide
            if any(t1.endswith(sfx) for sfx in ("ee", "y", "ie", "ea", "ay", "ey", "i")) or t1 in ("be", "he", "she", "we", "me", "see", "the"):
                return {
                    "type": "VV_GLIDE_J",
                    "symbol": "ᴶ",
                    "name_vi": "Nối nguyên âm bằng âm lướt /j/ (y-glide)",
                    "pair": f"{w1['word']} + {w2['word']}",
                    "connected_sound": f"{t1}-/j/-{t2}",
                    "explanation": f"Từ '{w1['word']}' kết thúc bằng nguyên âm trước (front vowel), khi gặp nguyên âm đầu của '{w2['word']}' sẽ tự nhiên chèn một âm lướt nhẹ /j/ để không bị ngắt hơi.",
                }
            # Back vowel ending -> /w/ glide
            elif any(t1.endswith(sfx) for sfx in ("oo", "ow", "ew", "ue", "ou")) or t1 in ("go", "no", "so", "do", "to", "who", "two", "you"):
                return {
                    "type": "VV_GLIDE_W",
                    "symbol": "ᵂ",
                    "name_vi": "Nối nguyên âm bằng âm lướt /w/ (w-glide)",
                    "pair": f"{w1['word']} + {w2['word']}",
                    "connected_sound": f"{t1}-/w/-{t2}",
                    "explanation": f"Từ '{w1['word']}' kết thúc bằng nguyên âm tròn môi (back rounded vowel), khi nối sang nguyên âm của '{w2['word']}' sẽ chèn một âm lướt nhẹ /w/.",
                }

        # -------------------------------------------------------------
        # Rule 4: Consonant-to-Vowel Linking (Liaison kinh điển)
        # Ví dụ: "pick it up", "hold on", "turn off", "read a book"
        # -------------------------------------------------------------
        # Word 1 ends in consonant sound (and not silent 'e' unless pronounced consonant)
        last_char = t1[-1]
        is_consonant_end = (last_char in CONSONANTS_NO_ELISION) or (last_char == "e" and len(t1) > 2 and t1[-2] in CONSONANTS_NO_ELISION and t1 not in ("the", "she", "he", "be", "we"))
        
        if is_consonant_end and is_vowel_start_w2:
            # Ending consonant sound
            sound_c = last_char if last_char != "e" else t1[-2]
            return {
                "type": "CV_LINKING",
                "symbol": "‿",
                "name_vi": "Nối phụ âm sang nguyên âm (C-V Linking)",
                "pair": f"{w1['word']} + {w2['word']}",
                "connected_sound": f"{t1[:-1] if last_char == sound_c else t1}-{sound_c}{t2}",
                "explanation": f"Phụ âm cuối /{sound_c}/ của '{w1['word']}' được bắt sang làm âm đầu cho nguyên âm của '{w2['word']}', tạo thành một chuỗi âm liền mạch.",
            }

        return None

    def _build_connected_ipa(self, tokens: List[Dict[str, Any]], phenomena: List[Dict[str, Any]]) -> str:
        """Constructs an aligned connected IPA string with linking markers."""
        phenom_by_w1 = {p["word1_index"]: p for p in phenomena}
        ipa_parts = []

        for i, tok in enumerate(tokens):
            # Prefer weak form IPA if available
            tok_ipa = tok.get("ipa") or ""
            if tok.get("is_weak_form") and tok.get("weak_info"):
                tok_ipa = tok["weak_info"]["weak_ipa"]
            
            # Clean slashes
            clean_ipa = tok_ipa.strip("/").strip() if tok_ipa else tok["clean"]
            ipa_parts.append(clean_ipa)

            if i in phenom_by_w1:
                sym = phenom_by_w1[i]["symbol"]
                ipa_parts.append(f"{sym}")
            elif i < len(tokens) - 1:
                ipa_parts.append(" ")

        return "/" + "".join(ipa_parts) + "/"
