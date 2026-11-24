// Pure helpers for GoogleAiWordModal (kept JSX-free so node --test can cover them).

const EDGE_PUNCTUATION = /^[’'".:,;!?-]+|[’'".:,;!?-]+$/g;

/** Trim whitespace and leading/trailing punctuation from a word; non-strings become "". */
export function cleanGoogleAiWord(word) {
  if (typeof word !== "string") return "";
  return word.trim().replace(EDGE_PUNCTUATION, "");
}

/** The modal shows only when explicitly open AND there is a real word to look up. */
export function shouldShowGoogleAiModal(isOpen, word) {
  return isOpen === true && cleanGoogleAiWord(word).length > 0;
}
