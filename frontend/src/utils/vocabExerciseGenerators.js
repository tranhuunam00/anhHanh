/**
 * Vocabulary Exercise Generator & Distractor Engine
 * Supports Multi-language vocabulary (EN, FR, DE, JA, ZH, KO, ES)
 * Pure, side-effect-free helper functions for Dạng 1 & Dạng 2
 */

export const EXERCISE_FORMATS = {
  D1: "FORMAT_D1", // Dạng 1: Từ vựng -> Nghĩa tiếng Việt (Recognition)
  D2: "FORMAT_D2", // Dạng 2: Nghĩa tiếng Việt -> Chọn Từ vựng (Active Recall)
};

export const EXERCISE_CATEGORIES = {
  ALL: "ALL",
  RECOGNITION: "RECOGNITION",
  RECALL: "RECALL",
};

export const FALLBACK_DISTRACTORS_VI = [
  "nhu cầu cấp bách",
  "phát triển bền vững",
  "cơ hội tiềm năng",
  "thành tựu đáng kể",
  "nỗ lực không ngừng",
  "chính sách đổi mới",
  "kết quả bất ngờ",
  "tác động tiêu cực",
  "sự cải thiện",
  "quyết định quan trọng",
  "bằng chứng rõ ràng",
  "nguồn cảm hứng",
  "thách thức lớn",
  "sự cân bằng",
  "tiến trình thực hiện",
  "giải pháp tối ưu",
  "phương pháp tiếp cận",
  "mục tiêu dài hạn",
  "trách nhiệm xã hội",
  "sự tin cậy",
  "được coi là đương nhiên",
  "thanh lịch, tao nhã",
  "tràn ngập, dồi dào",
  "tập trung cao độ",
];

export const FALLBACK_DISTRACTORS_BY_LANG = {
  en: [
    "sustainable",
    "comprehensive",
    "significant",
    "unprecedented",
    "fundamental",
    "inevitable",
    "promising",
    "substantial",
    "indispensable",
    "remarkable",
    "perspective",
    "consequence",
    "implementation",
    "enhancement",
    "collaboration",
  ],
  fr: [
    "durable",
    "essentiel",
    "considérable",
    "remarquable",
    "indispensable",
    "perspective",
    "collaboration",
    "amélioration",
    "opportunité",
    "stratégie",
  ],
  de: [
    "nachhaltig",
    "wesentlich",
    "bedeutend",
    "bemerkenswert",
    "unverzichtbar",
    "Perspektive",
    "Zusammenarbeit",
    "Verbesserung",
    "Gelegenheit",
    "Strategie",
  ],
  ja: [
    "持続可能",
    "重要",
    "包括的",
    "不可欠",
    "改善",
    "機会",
    "戦略",
    "成果",
  ],
  zh: [
    "可持续",
    "显著",
    "全面",
    "不可或缺",
    "改进",
    "机遇",
    "战略",
    "成就",
  ],
  ko: [
    "지속 가능한",
    "중요한",
    "포괄적인",
    "필수적인",
    "개선",
    "기회",
    "전략",
    "성과",
  ],
  es: [
    "sostenible",
    "fundamental",
    "significativo",
    "indispensable",
    "mejora",
    "oportunidad",
    "estrategia",
    "logro",
  ],
};

/**
 * Mask target word in a sentence for Dạng 2 context hints
 * e.g. "We are in desperate need of help." -> "We are in [ ______ ] of help."
 */
export const maskTargetWordInSentence = (sentence, targetWord) => {
  if (!sentence || typeof sentence !== "string") return "";
  if (!targetWord || typeof targetWord !== "string") return sentence;

  const cleanWord = targetWord.trim();
  if (!cleanWord) return sentence;

  // Escape special regex characters in the target word
  const escaped = cleanWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Attempt word boundary matching first (supports Latin scripts)
  const wordBoundaryRegex = new RegExp(`\\b${escaped}\\b`, "i");
  if (wordBoundaryRegex.test(sentence)) {
    return sentence.replace(wordBoundaryRegex, "[ ______ ]");
  }

  // Fallback: non-boundary match (useful for CJK scripts or hyphenated terms)
  const looseRegex = new RegExp(escaped, "i");
  if (looseRegex.test(sentence)) {
    return sentence.replace(looseRegex, "[ ______ ]");
  }

  return sentence;
};

/**
 * Generate 4 multiple-choice options for Dạng 1 (Target: Vietnamese Meaning)
 */
export const generateD1Options = (currentItem, pool = []) => {
  if (!currentItem || !currentItem.meaning) return [];

  // If options already enriched by BE
  if (Array.isArray(currentItem.options) && currentItem.options.length >= 4) {
    return currentItem.options;
  }

  const correctMeaning = currentItem.meaning.trim();
  const poolArray = Array.isArray(pool) ? pool : [];

  // Collect other meanings from pool
  const otherMeanings = poolArray
    .filter((it) => it && it.id !== currentItem.id && it.meaning && it.meaning.trim() !== correctMeaning)
    .map((it) => it.meaning.trim());

  // Merge with fallback Vietnamese distractors
  const candidateDistractors = Array.from(new Set([...otherMeanings, ...FALLBACK_DISTRACTORS_VI]))
    .filter((m) => m && m.toLowerCase() !== correctMeaning.toLowerCase())
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  const combined = [...candidateDistractors, correctMeaning];
  return combined.sort(() => Math.random() - 0.5);
};

/**
 * Generate 4 multiple-choice options for Dạng 2 (Target: Target Word in source language)
 */
export const generateD2Options = (currentItem, pool = []) => {
  if (!currentItem || !currentItem.word) return [];

  const correctWord = currentItem.word.trim();
  const poolArray = Array.isArray(pool) ? pool : [];
  const sourceLang = (currentItem.source_lang || "en").toLowerCase();

  // 1. Collect candidate words from pool with same language priority
  const sameLangWords = poolArray
    .filter((it) => it && it.id !== currentItem.id && it.word && it.word.trim().toLowerCase() !== correctWord.toLowerCase())
    .map((it) => it.word.trim());

  // 2. Fallbacks for target language
  const langFallbacks = FALLBACK_DISTRACTORS_BY_LANG[sourceLang] || FALLBACK_DISTRACTORS_BY_LANG.en;

  // 3. Assemble at least 3 distinct distractors
  const candidateDistractors = Array.from(new Set([...sameLangWords, ...langFallbacks]))
    .filter((w) => w && w.toLowerCase() !== correctWord.toLowerCase())
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  const combined = [...candidateDistractors, correctWord];
  return combined.sort(() => Math.random() - 0.5);
};

/**
 * Verify if selected answer is correct
 */
export const isAnswerCorrect = (selected, currentItem, format = EXERCISE_FORMATS.D1) => {
  if (!selected || !currentItem) return false;
  const sel = String(selected).trim().toLowerCase();

  if (format === EXERCISE_FORMATS.D2) {
    return sel === String(currentItem.word || "").trim().toLowerCase();
  }

  // Default Dạng 1: check meaning
  return sel === String(currentItem.meaning || "").trim().toLowerCase();
};
