/**
 * Lazy, per-book loading of Cambridge IELTS dictation datasets.
 * Each book's transcript (~1.7-2.4 MB) is downloaded only when the learner
 * opens a preset from that book, instead of shipping all six books at once.
 */
import { buildIeltsAudioLessonFromSources, hasAuthenticChallenges } from "./ieltsAudioLessonCore.js";

/** book number -> loader returning that book's `{ [presetId]: entry }` map */
export const DICTATION_DATASET_LOADERS = Object.freeze({
  16: () => import("../data/ielts/cambridge16DictationData.js").then((m) => m.cambridge16DictationData),
  17: () => import("../data/ielts/cambridge17DictationData.js").then((m) => m.cambridge17DictationData),
  18: () => import("../data/ielts/cambridge18DictationData.js").then((m) => m.cambridge18DictationData),
  19: () => import("../data/ielts/cambridge19DictationData.js").then((m) => m.cambridge19DictationData),
  20: () => import("../data/ielts/cambridge20DictationData.js").then((m) => m.cambridge20DictationData),
  21: () => import("../data/ielts/cambridge21DictationData.js").then((m) => m.cambridge21DictationData),
});

/**
 * Extracts the Cambridge book number from a preset id ("cam19-t2-s3" -> 19).
 * @param {string} presetId
 * @returns {number|null}
 */
export function resolveCambridgeBookNumber(presetId) {
  if (typeof presetId !== "string") return null;
  const match = presetId.trim().match(/^cam(\d{1,2})-/i);
  if (!match) return null;
  const book = Number(match[1]);
  return Number.isInteger(book) && book > 0 ? book : null;
}

/**
 * Creates a cached entry loader. Each book is fetched at most once; a failed
 * fetch is evicted from the cache so it can be retried.
 * @param {Record<number, () => Promise<object>>} [loaders]
 * @returns {(presetId: string) => Promise<object|null>}
 */
export function createDictationEntryLoader(loaders = DICTATION_DATASET_LOADERS) {
  if (!loaders || typeof loaders !== "object") {
    throw new TypeError("loaders must be an object mapping book number to loader function");
  }
  const cache = new Map();

  const loadBook = (book) => {
    if (!cache.has(book)) {
      const promise = Promise.resolve()
        .then(() => loaders[book]())
        .catch((err) => {
          cache.delete(book);
          throw err;
        });
      cache.set(book, promise);
    }
    return cache.get(book);
  };

  return async (presetId) => {
    const book = resolveCambridgeBookNumber(presetId);
    if (book === null || typeof loaders[book] !== "function") return null;
    const dataset = await loadBook(book);
    return (dataset && dataset[presetId]) || null;
  };
}

/** Shared loader used by the app. */
export const loadDictationEntry = createDictationEntryLoader();

const loadIeltsTests = () => import("../data/ielts/index.js").then((m) => m.IELTS_TESTS || []);

/**
 * Async counterpart of buildIeltsAudioLesson that only downloads what it needs:
 * the preset's own book dataset, plus the test catalogue only as a fallback.
 * @param {object} preset
 * @param {{ loadEntry?: Function, loadTests?: Function }} [deps] Injectable for tests
 * @returns {Promise<object|null>}
 */
export async function loadIeltsAudioLesson(preset, deps) {
  if (!preset) return null;
  const { loadEntry = loadDictationEntry, loadTests = loadIeltsTests } = deps || {};

  const authenticData = await loadEntry(preset.id);
  if (hasAuthenticChallenges(authenticData)) {
    return buildIeltsAudioLessonFromSources(preset, { authenticData, tests: [] });
  }

  const tests = await loadTests();
  return buildIeltsAudioLessonFromSources(preset, { authenticData: null, tests });
}
