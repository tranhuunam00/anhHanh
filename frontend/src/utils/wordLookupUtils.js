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

  const isZh = /[\u4e00-\u9fff]/.test(word) || (sourceLang && sourceLang.toLowerCase().startsWith("zh"));
  const resolvedSourceLang = isZh ? "zh" : (sourceLang || "en").trim().toLowerCase();

  return {
    word,
    context_sentence: (contextSentence || "").trim(),
    meaning,
    phonetic: (phonetic || "").trim(),
    part_of_speech: (partOfSpeech || "").trim(),
    video_id: videoId || "",
    timestamp: typeof timestamp === "number" ? timestamp : Number(timestamp) || 0,
    source_lang: resolvedSourceLang,
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

/**
 * Resolves the initial display context sentence prioritizing current lookup context prop, then saved notebook data, then empty string.
 * @param {string} contextSentence
 * @param {object|null} savedItem
 * @returns {string}
 */
export function resolveInitialContextSentence(contextSentence = "", savedItem = null) {
  if (typeof contextSentence === "string" && contextSentence.trim()) {
    return contextSentence.trim();
  }
  if (savedItem && typeof savedItem.context_sentence === "string" && savedItem.context_sentence.trim()) {
    return savedItem.context_sentence.trim();
  }
  return "";
}

/**
 * Checks whether user has modified the context sentence compared to the initial context sentence or saved notebook context.
 * @param {boolean} isSaved
 * @param {string} customContext
 * @param {string} initialContext
 * @param {string} savedContext
 * @returns {boolean}
 */
export function isContextModified(isSaved, customContext = "", initialContext = "", savedContext = "") {
  if (!isSaved) return false;
  const custom = (customContext || "").trim();
  const initial = (initialContext || "").trim();
  const saved = (savedContext || "").trim();

  if (initial && custom !== initial) return true;
  if (saved && custom !== saved) return true;
  if (!initial && !saved && custom) return true;
  if (initial && !custom) return true;

  return false;
}

/**
 * Determines whether any editable vocab field (meaning, POS, context sentence) has been modified for a saved item.
 * @param {object} params
 * @returns {boolean}
 */
export function hasVocabChanges({
  isSaved = false,
  customMeaning = "",
  savedMeaning = "",
  customPos = "",
  initialPos = "",
  customContext = "",
  initialContext = "",
  savedContext = "",
} = {}) {
  if (!isSaved) return false;
  const meaningChanged = isMeaningModified(isSaved, customMeaning, savedMeaning);
  const posChanged = (customPos || "").trim() !== (initialPos || "").trim();
  const contextChanged = isContextModified(isSaved, customContext, initialContext, savedContext);
  return meaningChanged || posChanged || contextChanged;
}

/**
 * Cleans extracted sentence and isolates the actual sentence or line containing the target word,
 * stripping extraneous UI labels (e.g. "Câu 1", "Có gợi ý nâng cấp...", "Luyện câu này").
 * @param {string} rawText
 * @param {string} targetWord
 * @returns {string}
 */
export function cleanTargetSentence(rawText = "", targetWord = "") {
  if (typeof rawText !== "string" || !rawText) return "";
  let clean = rawText
    .replace(/^\[\d{2}:\d{2}\s*-\s*\d{2}:\d{2}\]\s*/, "")
    .replace(/Luyện câu này\s*➔?/gi, "")
    .trim();

  if (!clean) return "";

  const cleanTarget = (targetWord || "").trim().toLowerCase();
  if (!cleanTarget) {
    return clean.replace(/^["'“‘]+|["'”’]+$/g, "").trim();
  }

  // 1. If text has newlines, try to find the line that contains targetWord
  if (clean.includes("\n")) {
    const lines = clean.split("\n").map((l) => l.trim()).filter(Boolean);
    const lineWithTarget = lines.find((l) => l.toLowerCase().includes(cleanTarget));
    if (lineWithTarget) {
      clean = lineWithTarget;
    }
  }

  // 2. If text contains known section labels (e.g. from Writing cards), split by labels
  const labelRegex = /(?:NÂNG CẤP CÂU HỌC THUẬT[^:]*:|SỬA ĐÚNG NGỮ PHÁP:|SAI Ở ĐÂU[^:]*:|Nhận xét ngữ pháp:|Câu \d+|Có gợi ý nâng cấp[^:]*|Có lỗi ngữ pháp)/gi;
  if (labelRegex.test(clean)) {
    const sections = clean.split(labelRegex).map((s) => s.trim()).filter(Boolean);
    const secWithTarget = sections.find((s) => s.toLowerCase().includes(cleanTarget));
    if (secWithTarget) {
      clean = secWithTarget;
    }
  }

  // 3. If clean still contains multiple sentences ending in . or ! or ?, isolate the specific sentence containing targetWord
  const sentenceRegex = /(?<=[.!?]["'”’]?)\s+(?=[A-Z"“'‘0-9])/;
  if (sentenceRegex.test(clean)) {
    const sentences = clean.split(sentenceRegex).map((s) => s.trim()).filter(Boolean);
    const sentWithTarget = sentences.find((s) => s.toLowerCase().includes(cleanTarget));
    if (sentWithTarget) {
      clean = sentWithTarget;
    }
  }

  // 4. Strip any trailing explanation note (e.g., "Used 'integrating' and...")
  clean = clean.replace(/\s+Used\s+['"].*$/i, "");

  // 5. Strip wrapping quotes
  clean = clean.replace(/^["'“‘]+|["'”’]+$/g, "").trim();

  return clean;
}

/**
 * Escapes regex special characters in a string.
 * @param {string} str
 * @returns {string}
 */
export function escapeRegex(str) {
  if (typeof str !== "string") return "";
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Splits a context sentence into highlighted word tokens and plain text segments.
 * Useful for lean, interactive context sentence previews with keyword emphasis.
 * @param {string} sentence
 * @param {string} targetWord
 * @returns {Array<{ text: string, isMatch: boolean }>}
 */
export function highlightWordInSentence(sentence = "", targetWord = "") {
  if (typeof sentence !== "string" || !sentence) return [];
  const cleanTarget = (targetWord || "").trim();
  if (!cleanTarget) return [{ text: sentence, isMatch: false }];

  const escaped = escapeRegex(cleanTarget);
  // Match with word boundaries where feasible, or whole substring match
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = sentence.split(regex);

  return parts
    .filter((part) => part.length > 0)
    .map((part) => ({
      text: part,
      isMatch: part.toLowerCase() === cleanTarget.toLowerCase(),
    }));
}

export const STATUS_MAP = {
  NEW: { label: "Mới lưu", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.12)" },
  LEARNING: { label: "Đang học", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.12)" },
  MASTERED: { label: "Đã thuộc", color: "#10b981", bg: "rgba(16, 185, 129, 0.12)" },
};


