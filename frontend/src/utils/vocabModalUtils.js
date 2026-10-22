/**
 * Utilities for Vocabulary Add & Edit Modals
 */

/**
 * Cleans context sentence for Text-to-Speech playback.
 * Strips translations, outer quotes, extra delimiters.
 * @param {string} raw
 * @returns {string}
 */
export const cleanContextSentenceForSpeech = (raw) => {
  if (!raw || typeof raw !== "string") return "";
  // Split on newline or common delimiters
  const firstPart = raw.split(/\n|---|::/)[0] || "";
  let cleaned = firstPart.trim();
  // Remove wrapping straight or smart quotes
  cleaned = cleaned.replace(/^["'“”«»]+|["'“”«»]+$/g, "").trim();
  return cleaned;
};

/**
 * Builds clean payload for creating or updating a vocabulary word.
 * Ensures image_url is properly cleared to empty string when not provided.
 * @param {Object} params
 * @returns {Object}
 */
export const buildVocabPayload = ({
  word = "",
  phonetic = "",
  partOfSpeech = "",
  meaning = "",
  imageUrl = "",
  contextSentence = "",
  status = "LEARNING",
  sourceLang = "en",
}) => {
  const cleanWord = (word || "").trim();
  const cleanPhonetic = (phonetic || "").trim();
  const cleanPos = (partOfSpeech || "").trim();
  const cleanMeaning = (meaning || "").trim() || cleanWord;
  const cleanImg = (imageUrl || "").trim();
  const cleanContext = (contextSentence || "").trim();

  return {
    word: cleanWord,
    phonetic: cleanPhonetic || undefined,
    part_of_speech: cleanPos || undefined,
    meaning: cleanMeaning,
    image_url: cleanImg ? cleanImg : "",
    context_sentence: cleanContext,
    status: status || "LEARNING",
    source_lang: sourceLang || "en",
  };
};
