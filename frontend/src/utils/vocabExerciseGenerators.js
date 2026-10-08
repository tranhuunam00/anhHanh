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
 * Extract or generate cloze sentence with target word masked as [ ______ ]
 * Handles context_sentence splitting and multi-language template fallbacks
 */
export const getD3ClozeSentence = (currentItem) => {
  if (!currentItem) {
    return {
      clozeSentence: "[ ______ ]",
      originalSentence: "",
      translation: "",
      masked: true,
    };
  }

  const rawSentence = (currentItem.context_sentence || "").trim();
  const word = (currentItem.word || "").trim();

  if (rawSentence) {
    let orig = rawSentence;
    let trans = "";

    const bracketIdx = rawSentence.indexOf("[");
    if (bracketIdx > 0 && rawSentence.endsWith("]")) {
      orig = rawSentence.substring(0, bracketIdx).trim();
      trans = rawSentence.substring(bracketIdx + 1, rawSentence.length - 1).trim();
    } else {
      orig = rawSentence.replace(/^"+|"+$/g, "").trim();
    }

    const masked = maskTargetWordInSentence(orig, word);
    if (masked.includes("[ ______ ]")) {
      return {
        clozeSentence: masked,
        originalSentence: orig,
        translation: trans,
        masked: true,
      };
    }

    return {
      clozeSentence: `${orig} ➔ Điền: [ ______ ]`,
      originalSentence: orig,
      translation: trans,
      masked: true,
    };
  }

  // Fallback sentence when no context_sentence was recorded
  const sourceLang = (currentItem.source_lang || "en").toLowerCase();
  const fallbacksByLang = {
    en: "The speaker emphasized that [ ______ ] is vital for achieving this goal.",
    fr: "L'orateur a souligné que [ ______ ] est essentiel pour atteindre cet objectif.",
    de: "Der Sprecher betonte, dass [ ______ ] für dieses Ziel unerlässlich ist.",
    ja: "目標を達成するためには、[ ______ ] が極めて重要であると強調された。",
    zh: "发言人强调，[ ______ ] 对于实现这一目标至关重要。",
    ko: "발표자는 이 목표를 달성하기 위해 [ ______ ] 이/가 필수적이라고 강조했습니다.",
    es: "El orador enfatizó que [ ______ ] es fundamental para lograr este objetivo.",
  };

  const template = fallbacksByLang[sourceLang] || fallbacksByLang.en;
  return {
    clozeSentence: template,
    originalSentence: template.replace("[ ______ ]", word),
    translation: currentItem.meaning ? `Nghĩa: ${currentItem.meaning}` : "",
    masked: true,
  };
};

/**
 * Generate 4 multiple-choice options for Dạng 3 (Target: Word to fit cloze blank)
 */
export const generateD3Options = (currentItem, pool = [], extraDistractors = []) => {
  return generateD2Options(currentItem, pool, extraDistractors);
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
