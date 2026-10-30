/**
 * Word Stress Analyzer & Syllable Partitioning Engine
 * Accurately calculates syllable boundaries, extracts primary IPA stress (ˈ),
 * and provides pedagogically sound English stress rules.
 */

// Common English vowel digraphs & diphthongs
const VOWEL_DIPHTHONGS = [
  "ai", "ay", "ea", "ee", "ei", "ey", "ie", "oa", "oe", "oi", "oy",
  "oo", "ou", "ow", "au", "aw", "ue", "ui", "ew"
];

// IPA Vowel sounds & diphthongs
const IPA_VOWEL_REGEX = /(?:[iɪeæɑɒɔʊuʌɜə]ː?|[eao][ɪʊ]|aɪ|eɪ|ɔɪ|aʊ|əʊ|oʊ|ɪə|eə|ʊə)/g;

/**
 * Clean word text for analysis (strip punctuation, whitespace)
 */
export const sanitizeStressWord = (rawWord) => {
  if (!rawWord || typeof rawWord !== "string") return "";
  return rawWord.trim().toLowerCase().replace(/[^a-z]/g, "");
};

/**
 * Split an English word into syllables using phonetic & orthographic rules
 * Handles prefixes, suffixes, vowel clusters, and consonant boundaries
 */
export const splitWordIntoSyllables = (rawWord) => {
  const word = sanitizeStressWord(rawWord);
  if (!word) return [];
  if (word.length <= 3) return [word];

  // Specific common words overrides for 100% textbook accuracy
  const knownOverrides = {
    photograph: ["pho", "to", "graph"],
    photography: ["pho", "tog", "ra", "phy"],
    photographic: ["pho", "to", "graph", "ic"],
    environment: ["en", "vi", "ron", "ment"],
    technology: ["tech", "nol", "o", "gy"],
    important: ["im", "por", "tant"],
    decision: ["de", "ci", "sion"],
    candidate: ["can", "di", "date"],
    international: ["in", "ter", "na", "tion", "al"],
    education: ["ed", "u", "ca", "tion"],
    develop: ["de", "vel", "op"],
    development: ["de", "vel", "op", "ment"],
    success: ["suc", "cess"],
    comfortable: ["com", "for", "ta", "ble"],
    necessary: ["nec", "es", "sa", "ry"],
    participate: ["par", "tic", "i", "pate"],
    communicate: ["com", "mu", "ni", "cate"],
    generation: ["gen", "er", "a", "tion"],
    opportunity: ["op", "por", "tu", "ni", "ty"],
    responsibility: ["re", "spon", "si", "bil", "i", "ty"],
    economy: ["e", "con", "o", "my"],
    economic: ["e", "co", "nom", "ic"],
    polite: ["po", "lite"],
    suggest: ["sug", "gest"],
    arrive: ["ar", "rive"],
    prepare: ["pre", "pare"],
    family: ["fam", "i", "ly"],
    beautiful: ["beau", "ti", "ful"],
  };

  if (knownOverrides[word]) {
    return [...knownOverrides[word]];
  }

  // Syllable splitting algorithm based on vowel nuclei
  const vowels = "aeiouy";
  const syllables = [];
  let current = "";

  // Identify vowel positions (merging digraphs)
  const isVowelChar = (c) => vowels.includes(c);

  for (let i = 0; i < word.length; i++) {
    current += word[i];
    const nextChar = word[i + 1] || "";
    const nextNextChar = word[i + 2] || "";

    // Check if current two chars form a digraph
    const twoChars = word.slice(i, i + 2);
    const isDigraph = VOWEL_DIPHTHONGS.includes(twoChars);

    if (isVowelChar(word[i]) && !isDigraph) {
      // If trailing 'e' at word end (silent e)
      if (word[i] === "e" && i === word.length - 1 && current.length > 1 && syllables.length > 0) {
        // Attach to previous syllable
        syllables[syllables.length - 1] += current;
        current = "";
        break;
      }

      // Check following consonants
      if (nextChar && !isVowelChar(nextChar)) {
        if (nextNextChar && !isVowelChar(nextNextChar)) {
          // Double consonant: split between them (e.g., hap-pen, let-ter, suc-cess)
          if (nextChar === nextNextChar || (!"sh|ch|th|ph|wh".includes(nextChar + nextNextChar) && i + 3 < word.length)) {
            current += nextChar;
            i++;
            syllables.push(current);
            current = "";
            continue;
          }
        } else if (nextNextChar && isVowelChar(nextNextChar)) {
          // Single consonant between vowels: usually goes to next syllable (e.g., pa-per, ba-by)
          syllables.push(current);
          current = "";
          continue;
        }
      }
    } else if (isDigraph) {
      current += nextChar;
      i++;
      if (i + 1 < word.length && !isVowelChar(word[i + 1])) {
        syllables.push(current);
        current = "";
      }
    }
  }

  if (current) {
    if (syllables.length > 0 && current.length <= 2 && !current.split("").some((c) => vowels.includes(c))) {
      syllables[syllables.length - 1] += current;
    } else {
      syllables.push(current);
    }
  }

  return syllables.length > 0 ? syllables : [word];
};

/**
 * Extract stress syllable index from IPA phonetic transcription
 * Returns { stressIndex: number (0-based), totalSyllables: number }
 */
export const extractStressFromPhonetic = (phonetic) => {
  if (!phonetic || typeof phonetic !== "string") {
    return { stressIndex: 0, totalSyllables: 1 };
  }

  // Remove surrounding slashes or brackets
  const cleanIpa = phonetic.replace(/[/[\].]/g, " ").trim();
  if (!cleanIpa) return { stressIndex: 0, totalSyllables: 1 };

  // Find primary stress index: primary mark is ˈ (U+02C8) or straight quote '
  const primaryIdx = cleanIpa.search(/[ˈ']/);
  if (primaryIdx === -1) {
    // If no primary stress mark, count vowel nuclei
    const matches = cleanIpa.match(IPA_VOWEL_REGEX) || [];
    return { stressIndex: 0, totalSyllables: Math.max(1, matches.length) };
  }

  // Count vowel sounds before primary stress mark
  const textBeforeStress = cleanIpa.slice(0, primaryIdx);
  const vowelsBefore = (textBeforeStress.match(IPA_VOWEL_REGEX) || []).length;

  const totalVowels = (cleanIpa.match(IPA_VOWEL_REGEX) || []).length;
  const total = Math.max(1, totalVowels);
  const stressIdx = Math.min(vowelsBefore, total - 1);

  return { stressIndex: stressIdx, totalSyllables: total };
};

/**
 * English Pedagogical Stress Rules Explanation
 */
export const getStressRuleExplanation = (word, stressNumber, totalSyllables) => {
  const w = (word || "").toLowerCase().trim();

  if (/(?:tion|sion|cian)$/.test(w)) {
    return "💡 Quy tắc: Các từ có đuôi -tion, -sion, -cian luôn có trọng âm rơi vào âm tiết đứng ngay trước nó.";
  }
  if (/(?:ic|ical|ity|itive|ial|ian)$/.test(w)) {
    return "💡 Quy tắc: Hậu tố -ic, -ical, -ity, -ial có trọng âm rơi vào âm tiết đứng ngay liền kề phía trước.";
  }
  if (/(?:ee|eer|ese|ique|esque)$/.test(w)) {
    return "💡 Quy tắc: Các từ có tận cùng là -ee, -eer, -ese, -ique thường nhận trọng âm ngay tại chính đuôi này.";
  }
  if (/(?:logy|graphy|metry|nomy)$/.test(w)) {
    return "💡 Quy tắc: Các từ có hậu tố -logy, -graphy, -metry thường có trọng âm rơi vào âm tiết thứ 3 từ dưới đếm lên.";
  }
  if (totalSyllables === 2) {
    if (stressNumber === 1) {
      return "💡 Quy tắc: Đa số danh từ & tính từ 2 âm tiết có trọng âm rơi vào âm tiết thứ 1.";
    }
    return "💡 Quy tắc: Đa số động từ 2 âm tiết có trọng âm rơi vào âm tiết thứ 2 (hoặc âm tiết gốc).";
  }
  if (stressNumber === 1) {
    return "💡 Quy tắc: Các từ ghép hoặc từ có tiền tố nhẹ thường nhấn mạnh vào âm tiết gốc đầu tiên.";
  }
  if (stressNumber === 2) {
    return "💡 Quy tắc: Các từ có tiền tố (re-, un-, dis-, de-, im-) thường không nhận trọng âm, trọng âm rơi vào gốc từ thứ 2.";
  }

  return `💡 Từ này có ${totalSyllables} âm tiết và trọng âm chính rơi vào âm tiết thứ ${stressNumber}.`;
};

/**
 * Main Stress Analysis pipeline combining orthography, IPA, and grammar rules
 */
export const analyzeWordStress = (rawWord, rawPhonetic = null) => {
  const cleanWord = sanitizeStressWord(rawWord);
  if (!cleanWord) {
    return {
      word: "",
      cleanWord: "",
      syllables: [],
      stressIndex: 0,
      stressNumber: 1,
      stressSyllable: "",
      totalSyllables: 0,
      phonetic: rawPhonetic || "",
      ruleExplanation: "",
      options: [],
    };
  }

  let syllables = splitWordIntoSyllables(cleanWord);
  if (syllables.length === 0) syllables = [cleanWord];

  let { stressIndex, totalSyllables } = extractStressFromPhonetic(rawPhonetic);

  // Sync syllable counts if discrepancy exists
  if (syllables.length > 1 && totalSyllables !== syllables.length) {
    // Clamp stress index within valid syllables range
    stressIndex = Math.min(stressIndex, syllables.length - 1);
    totalSyllables = syllables.length;
  } else if (syllables.length === 1) {
    stressIndex = 0;
    totalSyllables = 1;
  }

  const stressNumber = stressIndex + 1;
  const stressSyllable = syllables[stressIndex] || cleanWord;
  const ruleExplanation = getStressRuleExplanation(cleanWord, stressNumber, syllables.length);

  // Generate interactive choice options for each syllable
  const options = syllables.map((syl, idx) => ({
    index: idx,
    syllableNumber: idx + 1,
    syllableText: syl,
    label: `Âm tiết ${idx + 1}: ${syl.toUpperCase()}`,
    isCorrect: idx === stressIndex,
  }));

  return {
    word: rawWord,
    cleanWord,
    phonetic: rawPhonetic || "",
    syllables,
    stressIndex,
    stressNumber,
    stressSyllable,
    totalSyllables: syllables.length,
    ruleExplanation,
    options,
  };
};
