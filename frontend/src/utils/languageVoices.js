/**
 * Language Voice & Pronunciation Helper
 * Maps ISO language code and word character heuristics to correct Web Speech API BCP-47 voice tags.
 * Ensures French words are pronounced with French voice, German with German voice, etc.
 */

export const getVoiceLang = (sourceLang = null, word = "") => {
  if (sourceLang && typeof sourceLang === "string") {
    const lang = sourceLang.toLowerCase().trim();
    if (lang === "fr" || lang.startsWith("fr-")) return "fr-FR";
    if (lang === "de" || lang.startsWith("de-")) return "de-DE";
    if (lang === "ja" || lang.startsWith("ja-")) return "ja-JP";
    if (lang === "zh" || lang.startsWith("zh-")) return "zh-CN";
    if (lang === "ko" || lang.startsWith("ko-")) return "ko-KR";
    if (lang === "es" || lang.startsWith("es-")) return "es-ES";
    if (lang === "it" || lang.startsWith("it-")) return "it-IT";
    if (lang === "ru" || lang.startsWith("ru-")) return "ru-RU";
    if (lang === "vi" || lang.startsWith("vi-")) return "vi-VN";
    if (lang === "en" || lang.startsWith("en-")) return "en-US";
  }

  // Heuristic detection based on unique script & accent markers if sourceLang is not specified
  if (word && typeof word === "string") {
    // Japanese Hiragana & Katakana
    if (/[\u3040-\u309F\u30A0-\u30FF]/.test(word)) return "ja-JP";
    // Korean Hangul
    if (/[\uAC00-\uD7AF\u1100-\u11FF]/.test(word)) return "ko-KR";
    // Chinese characters (Kanji/Hanzi)
    if (/[\u4E00-\u9FFF]/.test(word)) return "zh-CN";
    // French distinctive accents: œ, æ, è, é, ê, ë, à, â, î, ï, ô, ù, û, ü, ç
    if (/[œæèéêëàâîïôùûüç]/i.test(word)) return "fr-FR";
    // German umlauts & eszett: ä, ö, ü, ß
    if (/[äöüß]/i.test(word)) return "de-DE";
    // Spanish inverted marks or ñ
    if (/[ñ¡¿áíóú]/i.test(word)) return "es-ES";
  }

  return "en-US";
};

export const getLanguageLabel = (sourceLang) => {
  const map = {
    en: "Tiếng Anh",
    fr: "Tiếng Pháp",
    de: "Tiếng Đức",
    ja: "Tiếng Nhật",
    zh: "Tiếng Trung",
    ko: "Tiếng Hàn",
    es: "Tiếng Tây Ban Nha",
  };
  return map[sourceLang?.toLowerCase()] || "Từ vựng";
};
