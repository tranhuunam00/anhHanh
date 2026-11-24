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

const KEY_WORD_FIELDS = ["word", "pos", "phonetic", "meaning", "example_en", "example_vi"];
export const MAX_OVERVIEW_KEY_WORDS = 4;

/** Defensive cleanup of the API's key_words: string fields, non-empty unique words, max 4. */
export function normalizeOverviewKeyWords(raw) {
  if (!Array.isArray(raw)) return [];
  const seen = new Set();
  const out = [];
  for (const item of raw) {
    if (!item || typeof item !== "object" || Array.isArray(item)) continue;
    const entry = {};
    for (const f of KEY_WORD_FIELDS) {
      const v = item[f];
      entry[f] = typeof v === "string" || typeof v === "number" ? String(v).trim() : "";
    }
    const key = entry.word.toLowerCase();
    if (!entry.word || seen.has(key)) continue;
    seen.add(key);
    out.push(entry);
    if (out.length >= MAX_OVERVIEW_KEY_WORDS) break;
  }
  return out;
}

export const GOOGLE_LOOKUP_MODE_GOOGLE = "google";
export const GOOGLE_LOOKUP_MODE_AI = "ai";

/**
 * Lookup mode for the "Gốc từ" button. Default is real Google (no API key / Gemini call);
 * the AI overview is opt-in and only when useAiOverview is exactly true.
 */
export function resolveGoogleLookupMode(useAiOverview) {
  return useAiOverview === true ? GOOGLE_LOOKUP_MODE_AI : GOOGLE_LOOKUP_MODE_GOOGLE;
}

/**
 * Keep a click inside a lookup overlay from bubbling to the exercise backdrop around it
 * (whose onClick closes the whole practice session and loses the learner's progress).
 * Returns true when the event was stopped, false for missing/odd events.
 */
export function stopLookupEventBubble(event) {
  if (!event || typeof event.stopPropagation !== "function") return false;
  event.stopPropagation();
  return true;
}
