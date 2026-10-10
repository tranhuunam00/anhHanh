/**
 * Utilities for Word Lookup Popover meaning resolution, validation and payload construction.
 */

/**
 * Resolves the initial display meaning prioritizing saved notebook data, then lookup response, then clean word fallback.
 * @param {string} cleanWord
 * @param {object|null} lookupData
 * @param {object|null} savedItem
 * @returns {string}
 */
export function resolveInitialMeaning(cleanWord = "", lookupData = null, savedItem = null) {
  if (savedItem && typeof savedItem.meaning === "string" && savedItem.meaning.trim()) {
    return savedItem.meaning.trim();
  }
  if (lookupData && typeof lookupData.meaning === "string" && lookupData.meaning.trim()) {
    return lookupData.meaning.trim();
  }
  return (cleanWord || "").trim();
}

/**
 * Checks whether user has edited the meaning compared to the existing saved meaning.
 * @param {boolean} isSaved
 * @param {string} customMeaning
 * @param {string} savedMeaning
 * @returns {boolean}
 */
export function isMeaningModified(isSaved, customMeaning = "", savedMeaning = "") {
  if (!isSaved) return false;
  const custom = (customMeaning || "").trim();
  const saved = (savedMeaning || "").trim();
  if (!custom) return false;
  return custom !== saved;
}

/**
 * Part of speech catalog with bilingual Vietnamese/English labels.
 */
export const POS_CATALOG = [
  { key: "noun", vi: "Danh từ", en: "Noun", abbr: "n." },
  { key: "verb", vi: "Động từ", en: "Verb", abbr: "v." },
  { key: "adjective", vi: "Tính từ", en: "Adj", abbr: "adj." },
  { key: "adverb", vi: "Trạng từ", en: "Adv", abbr: "adv." },
  { key: "phrase", vi: "Cụm từ", en: "Phrase", abbr: "phr." },
  { key: "preposition", vi: "Giới từ", en: "Prep", abbr: "prep." },
  { key: "conjunction", vi: "Liên từ", en: "Conj", abbr: "conj." },
  { key: "pronoun", vi: "Đại từ", en: "Pron", abbr: "pron." },
  { key: "idiom", vi: "Thành ngữ", en: "Idiom", abbr: "idm." },
];

const POS_LOOKUP_MAP = {
  n: "noun",
  noun: "noun",
  "danh từ": "noun",
  v: "verb",
  verb: "verb",
  "động từ": "verb",
  adj: "adjective",
  adjective: "adjective",
  "tính từ": "adjective",
  adv: "adverb",
  adverb: "adverb",
  "trạng từ": "adverb",
  prep: "preposition",
  preposition: "preposition",
  "giới từ": "preposition",
  conj: "conjunction",
  conjunction: "conjunction",
  "liên từ": "conjunction",
  pron: "pronoun",
  pronoun: "pronoun",
  "đại từ": "pronoun",
  phrase: "phrase",
  "cụm từ": "phrase",
  idiom: "idiom",
  "thành ngữ": "idiom",
};

/**
 * Splits POS string into clean, unique array of tokens.
 */
export function parsePosTokens(posStr) {
  if (!posStr || typeof posStr !== "string") return [];
  const parts = posStr.split(/[,;/|•+\n]+/);
  const result = [];
  const seen = new Set();
  for (const p of parts) {
    const clean = p.trim();
    if (!clean) continue;
    const lower = clean.toLowerCase();
    const canonical = POS_LOOKUP_MAP[lower] || clean;
    if (!seen.has(canonical.toLowerCase())) {
      seen.add(canonical.toLowerCase());
      result.push(canonical);
    }
  }
  return result;
}

/**
 * Formats POS tokens for user display (e.g., "Danh từ, Động từ").
 */
export function formatPosDisplay(posStr, lang = "vi") {
  const tokens = parsePosTokens(posStr);
  if (!tokens.length) return "";
  const viMap = {
    noun: "Danh từ",
    verb: "Động từ",
    adjective: "Tính từ",
    adverb: "Trạng từ",
    preposition: "Giới từ",
    conjunction: "Liên từ",
    pronoun: "Đại từ",
    phrase: "Cụm từ",
    idiom: "Thành ngữ",
  };
  return tokens.map((t) => (lang === "vi" ? viMap[t.toLowerCase()] || t : t)).join(", ");
}

/**
 * Toggles a POS key in a comma-separated POS string (supports multi-POS selection).
 */
export function togglePosInList(currentPosStr, posKey) {
  const tokens = parsePosTokens(currentPosStr);
  const targetLower = posKey.trim().toLowerCase();
  const exists = tokens.some((t) => t.toLowerCase() === targetLower);
  const updated = exists
    ? tokens.filter((t) => t.toLowerCase() !== targetLower)
    : [...tokens, posKey.trim()];
  return updated.join(", ");
}

/**
 * Constructs the payload for saving or creating a notebook vocabulary word.
 * @param {object} params
 * @returns {object}
 */
export function getMeaningSavePayload({
  cleanWord = "",
  customMeaning = "",
  lookupMeaning = "",
  partOfSpeech = "",
  contextSentence = "",
  phonetic = "",
  videoId = "",
  timestamp = 0,
  sourceLang = "en",
  targetLang = "vi",
} = {}) {
  const word = (cleanWord || "").trim();
  const custom = (customMeaning || "").trim();
  const lookup = (lookupMeaning || "").trim();
  const meaning = custom || lookup || word;

  return {
    word,
    context_sentence: (contextSentence || "").trim(),
    meaning,
    phonetic: (phonetic || "").trim(),
    part_of_speech: (partOfSpeech || "").trim(),
    video_id: videoId || "",
    timestamp: typeof timestamp === "number" ? timestamp : Number(timestamp) || 0,
    source_lang: (sourceLang || "en").trim().toLowerCase(),
    target_lang: (targetLang || "vi").trim().toLowerCase(),
  };
}

/**
 * Computes a clamped height for auto-growing meaning textarea.
 * @param {number} scrollHeight
 * @param {number} minHeight
 * @param {number} maxHeight
 * @returns {number}
 */
export function calculateAutoTextareaHeight(scrollHeight, minHeight = 38, maxHeight = 120) {
  const num = typeof scrollHeight === "number" && !isNaN(scrollHeight) ? scrollHeight : minHeight;
  return Math.max(minHeight, Math.min(num, maxHeight));
}

/**
 * Calculates popover position coords and arrow position relative to target bounding rect.
 * @param {object|null} rect
 * @param {number} viewportWidth
 * @param {number} viewportHeight
 * @returns {{ top: number, left: number, placement: string, arrowLeft: number }}
 */
export function computePopoverCoords(rect, viewportWidth = 1024, viewportHeight = 768) {
  if (!rect || ((rect.width === 0 || rect.width === undefined) && (rect.height === 0 || rect.height === undefined))) {
    return { top: 0, left: 12, placement: "bottom", arrowLeft: 140 };
  }

  const popoverWidth = Math.min(320, Math.max(200, viewportWidth - 24));
  const popoverEstimatedHeight = 250;

  const targetCenterX = (rect.left || 0) + (rect.width || 0) / 2;
  let left = targetCenterX - popoverWidth / 2;

  if (left < 12) left = 12;
  if (left + popoverWidth > viewportWidth - 12) {
    left = viewportWidth - 12 - popoverWidth;
  }

  let placement = "bottom";
  let top = (rect.bottom || 0) + 8;

  if (top + popoverEstimatedHeight > viewportHeight && (rect.top || 0) > popoverEstimatedHeight + 10) {
    placement = "top";
    top = (rect.top || 0) - 8;
  }

  const arrowLeft = Math.max(16, Math.min(popoverWidth - 16, targetCenterX - left));

  return { top, left, placement, arrowLeft };
}

