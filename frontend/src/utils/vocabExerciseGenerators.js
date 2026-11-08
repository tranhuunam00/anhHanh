/**
 * Vocabulary Exercise Generator & Distractor Engine
 * Supports Multi-language vocabulary (EN, FR, DE, JA, ZH, KO, ES)
 * Pure, side-effect-free helper functions for Dạng 1 & Dạng 2
 */

export const EXERCISE_FORMATS = {
  D1: "FORMAT_D1", // Dạng 1: Từ vựng -> Nghĩa tiếng Việt (Recognition)
  D2: "FORMAT_D2", // Dạng 2: Nghĩa tiếng Việt -> Chọn Từ vựng (Active Recall)
  D3: "FORMAT_D3", // Dạng 3: Điền từ vào câu ngữ cảnh (Context Cloze / Sentence Completion)
  D4: "FORMAT_D4", // Dạng 4: Nghe phát âm -> Chọn từ vựng (Listening Recall)
  D5_FLIP: "FORMAT_D5_FLIP", // Dạng 5: Thẻ Flashcard di động (Walking / Mobile 1-Tap)
  D6_AI_STORY: "FORMAT_D6_AI_STORY", // Dạng 6: AI Kể chuyện nối từ (AI Storytelling Cloze)
  D7_STRESS: "FORMAT_D7_STRESS", // Dạng 7: Trọng âm từ vựng (Word Stress Quiz)
  D8_SHADOWING: "FORMAT_D8_SHADOWING", // Dạng 8: Luyện Shadowing chuẩn ngữ điệu (Shadowing Practice)
};

export const EXERCISE_CATEGORIES = {
  ALL: "ALL",
  RECOGNITION: "RECOGNITION",
  RECALL: "RECALL",
  CONTEXT: "CONTEXT",
  LISTENING: "LISTENING",
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
    "strategic partnership",
    "bilateral relations",
    "mutual trust",
    "supply chain",
    "work-life balance",
    "artificial intelligence",
    "purchasing power",
  ],
  fr: [
    "durable",
    "essentiel",
    "considérable",
    "remarquable",
    "indispensable",
    "relations bilatérales",
    "partenariat stratégique",
    "confiance mutuelle",
    "pouvoir d'achat",
    "chaîne d'approvisionnement",
    "équilibre de vie",
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

import {
  maskTargetWordInSentence,
  getD3ClozeSentence,
  inferWordPosCategory,
  buildInflectionRegex,
  hashWordToIndex,
} from "./vocabClozeGenerator.js";

export {
  maskTargetWordInSentence,
  getD3ClozeSentence,
  inferWordPosCategory,
  buildInflectionRegex,
  hashWordToIndex,
};

/**
 * Generate 4 multiple-choice options for Dạng 1 (Target: Vietnamese Meaning)
 */
export const generateD1Options = (currentItem, pool = [], extraDistractors = []) => {
  if (!currentItem || !currentItem.meaning) return [];

  // If options already enriched by BE
  if (Array.isArray(currentItem.options) && currentItem.options.length >= 4) {
    return currentItem.options;
  }

  const correctMeaning = currentItem.meaning.trim();
  const poolArray = Array.isArray(pool) ? pool : [];
  const extraArray = Array.isArray(extraDistractors) ? extraDistractors : [];

  // Collect other meanings from pool and extra bank distractors
  const otherMeanings = Array.from(
    new Set([
      ...poolArray.filter((it) => it && it.id !== currentItem.id && it.meaning).map((it) => it.meaning.trim()),
      ...extraArray.filter((it) => it && it.meaning).map((it) => it.meaning.trim()),
    ])
  ).filter((m) => m && m.toLowerCase() !== correctMeaning.toLowerCase());

  // Shuffle pool/bank distractors first
  const prioritized = otherMeanings.sort(() => Math.random() - 0.5);

  // If fewer than 3, backfill from fallback Vietnamese distractors
  const needed = 3 - prioritized.length;
  const fallbacks = needed > 0
    ? FALLBACK_DISTRACTORS_VI
        .filter((m) => m && m.toLowerCase() !== correctMeaning.toLowerCase() && !prioritized.includes(m))
        .sort(() => Math.random() - 0.5)
        .slice(0, needed)
    : [];

  const candidateDistractors = [...prioritized.slice(0, 3), ...fallbacks].slice(0, 3);
  const combined = [...candidateDistractors, correctMeaning];
  return combined.sort(() => Math.random() - 0.5);
};

/**
 * Generate 4 multiple-choice options for Dạng 2 (Target: Target Word in source language)
 */
export const generateD2Options = (currentItem, pool = [], extraDistractors = []) => {
  if (!currentItem || !currentItem.word) return [];

  const correctWord = currentItem.word.trim();
  const poolArray = Array.isArray(pool) ? pool : [];
  const extraArray = Array.isArray(extraDistractors) ? extraDistractors : [];
  const sourceLang = (currentItem.source_lang || "en").toLowerCase();

  // 1. Collect candidate words from pool and bank distractors with same language priority
  const sameLangWords = Array.from(
    new Set([
      ...poolArray.filter((it) => it && it.id !== currentItem.id && it.word).map((it) => it.word.trim()),
      ...extraArray
        .filter((it) => it && it.word && (!it.source_lang || it.source_lang.toLowerCase() === sourceLang))
        .map((it) => it.word.trim()),
    ])
  ).filter((w) => w && w.toLowerCase() !== correctWord.toLowerCase());

  // Prioritize pool and bank words
  const prioritized = sameLangWords.sort(() => Math.random() - 0.5);

  // 2. If fewer than 3, backfill from language-specific fallbacks
  const needed = 3 - prioritized.length;
  const langFallbacks = FALLBACK_DISTRACTORS_BY_LANG[sourceLang] || FALLBACK_DISTRACTORS_BY_LANG.en;
  const fallbacks = needed > 0
    ? langFallbacks
        .filter((w) => w && w.toLowerCase() !== correctWord.toLowerCase() && !prioritized.includes(w))
        .sort(() => Math.random() - 0.5)
        .slice(0, needed)
    : [];

  const candidateDistractors = [...prioritized.slice(0, 3), ...fallbacks].slice(0, 3);
  const combined = [...candidateDistractors, correctWord];
  return combined.sort(() => Math.random() - 0.5);
};

/**
 * Generate 4 multiple-choice options for Dạng 3 (Target: Word to fit cloze blank)
 * Prioritizes distractors matching the target word's POS category when available.
 */
export const generateD3Options = (currentItem, pool = [], extraDistractors = []) => {
  if (!currentItem || !currentItem.word) return [];

  const targetPos = inferWordPosCategory(currentItem);
  const poolArray = Array.isArray(pool) ? pool : [];
  const extraArray = Array.isArray(extraDistractors) ? extraDistractors : [];

  if (targetPos && targetPos !== "general") {
    const samePosPool = poolArray.filter(
      (it) => it && it.id !== currentItem.id && it.word && inferWordPosCategory(it) === targetPos
    );
    const samePosExtra = extraArray.filter(
      (it) => it && it.word && inferWordPosCategory(it) === targetPos
    );
    if (samePosPool.length + samePosExtra.length >= 3) {
      return generateD2Options(currentItem, samePosPool, samePosExtra);
    }
  }

  return generateD2Options(currentItem, poolArray, extraArray);
};

/**
 * Generate 4 multiple-choice options for Dạng 4 (Listening Recall)
 */
export const generateD4Options = (currentItem, pool = []) => {
  return generateD2Options(currentItem, pool);
};

/**
 * Verify if selected answer is correct
 */
export const isAnswerCorrect = (selected, currentItem, format = EXERCISE_FORMATS.D1) => {
  if (!selected || !currentItem) return false;
  const sel = String(selected).trim().toLowerCase();

  if (format === EXERCISE_FORMATS.D2 || format === EXERCISE_FORMATS.D3 || format === EXERCISE_FORMATS.D4) {
    return sel === String(currentItem.word || "").trim().toLowerCase();
  }

  // Default Dạng 1: check meaning
  return sel === String(currentItem.meaning || "").trim().toLowerCase();
};
