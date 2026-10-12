/**
 * Visual Vocabulary Translations Index & Localization Helpers
 */
import { MOUNTAIN_TRANSLATIONS } from "./mountainTranslations.js";
import { UNIVERSITY_TRANSLATIONS } from "./universityTranslations.js";
import { DISTRACTOR_TRANSLATIONS } from "./distractorTranslations.js";

export const VISUAL_VOCAB_LANGUAGES = [
  {
    code: "en",
    label: "Tiếng Anh",
    shortLabel: "Anh",
    flag: "🇬🇧",
    voice: "en-US",
    ttsLang: "us",
  },
  {
    code: "fr",
    label: "Tiếng Pháp",
    shortLabel: "Pháp",
    flag: "🇫🇷",
    voice: "fr-FR",
    ttsLang: "fr",
  },
  {
    code: "zh",
    label: "Tiếng Trung",
    shortLabel: "Trung",
    flag: "🇨🇳",
    voice: "zh-CN",
    ttsLang: "zh",
  },
];

const ALL_ITEM_TRANSLATIONS = {
  ...MOUNTAIN_TRANSLATIONS,
  ...UNIVERSITY_TRANSLATIONS,
};

/**
 * Localizes a single vocabulary item into target language
 */
export const getLocalizedItem = (item, lang = "en") => {
  if (!item) return null;
  if (!lang || lang === "en") {
    return {
      ...item,
      lang: "en",
    };
  }

  const itemDict = ALL_ITEM_TRANSLATIONS[item.id];
  const trans = itemDict?.[lang];

  if (!trans) {
    return {
      ...item,
      lang: "en",
    };
  }

  return {
    ...item,
    word: trans.word || item.word,
    ipa: trans.pinyin || trans.ipa || item.ipa,
    rawIpa: trans.ipa || item.ipa,
    pinyin: trans.pinyin || "",
    pos: trans.pos || item.pos,
    example: trans.example || item.example,
    meaning: trans.meaning || item.meaning,
    lang,
  };
};

/**
 * Localizes a single distractor into target language
 */
export const getLocalizedDistractor = (distractor, lang = "en") => {
  if (!distractor) return null;
  if (!lang || lang === "en") {
    return {
      ...distractor,
      lang: "en",
    };
  }

  const distDict = DISTRACTOR_TRANSLATIONS[distractor.id];
  const trans = distDict?.[lang];

  if (!trans) {
    return {
      ...distractor,
      lang: "en",
    };
  }

  return {
    ...distractor,
    word: trans.word || distractor.word,
    ipa: trans.pinyin || trans.ipa || distractor.ipa,
    pinyin: trans.pinyin || "",
    meaning: trans.meaning || distractor.meaning,
    lang,
  };
};

/**
 * Localizes an entire topic (items + distractors) into target language
 */
export const getLocalizedTopic = (topic, lang = "en") => {
  if (!topic) return null;

  const items = (topic.items || []).map((it) => getLocalizedItem(it, lang));
  const distractors = (topic.distractors || []).map((d) =>
    getLocalizedDistractor(d, lang)
  );

  return {
    ...topic,
    currentLang: lang || "en",
    items,
    distractors,
  };
};
