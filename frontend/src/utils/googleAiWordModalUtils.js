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

export const GOOGLE_QUERY_SUFFIX = " là gì và gốc, họ của nó";

/** Normal Google Search URL for a word (opens in a browser tab). Returns "" for empty words. */
export function buildGoogleSearchUrl(word) {
  const clean = cleanGoogleAiWord(word);
  if (!clean) return "";
  return `https://www.google.com/search?q=${encodeURIComponent(clean + GOOGLE_QUERY_SUFFIX)}`;
}

/**
 * Frame-embeddable Google Search URL. Google serves igu=1 pages without X-Frame-Options,
 * so they can be shown inside the app (iframe). Returns "" for empty words.
 */
export function buildGoogleEmbedUrl(word, lang = "vi") {
  const clean = cleanGoogleAiWord(word);
  if (!clean) return "";
  const hl = typeof lang === "string" && /^[a-z]{2}(-[A-Za-z]{2})?$/.test(lang) ? lang : "vi";
  return `https://www.google.com/search?igu=1&hl=${hl}&q=${encodeURIComponent(clean + GOOGLE_QUERY_SUFFIX)}`;
}
