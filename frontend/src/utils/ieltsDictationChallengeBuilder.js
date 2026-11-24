import { IELTS_TESTS } from "../data/ielts/index.js";
import { cambridge16DictationData } from "../data/ielts/cambridge16DictationData.js";
import { cambridge17DictationData } from "../data/ielts/cambridge17DictationData.js";
import { cambridge18DictationData } from "../data/ielts/cambridge18DictationData.js";
import { cambridge19DictationData } from "../data/ielts/cambridge19DictationData.js";
import { cambridge20DictationData } from "../data/ielts/cambridge20DictationData.js";
import { cambridge21DictationData } from "../data/ielts/cambridge21DictationData.js";
import { buildIeltsAudioLessonFromSources } from "./ieltsAudioLessonCore.js";

/**
 * Synchronous, eager variant (all Cambridge 16-21 datasets bundled together).
 * The app uses the lazy `loadIeltsAudioLesson` from ieltsDictationDataLoader.js
 * instead; this module stays for scripts/tests that need a sync API.
 */
export {
  parseDurationToSeconds,
  extractItemsFromPart,
  formatChallengeText,
} from "./ieltsAudioLessonCore.js";

const ALL_DICTATION_DATASETS = [
  cambridge16DictationData,
  cambridge17DictationData,
  cambridge18DictationData,
  cambridge19DictationData,
  cambridge20DictationData,
  cambridge21DictationData,
];

/**
 * Looks up the authentic transcribed dictation entry for a preset id across all books.
 * @param {string} presetId
 * @returns {object|null}
 */
export function findAuthenticDictationEntry(presetId) {
  if (typeof presetId !== "string" || !presetId) return null;
  for (const dataset of ALL_DICTATION_DATASETS) {
    if (dataset && dataset[presetId]) return dataset[presetId];
  }
  return null;
}

/**
 * Builds a complete lesson object with challenges for Cambridge local audio presets
 */
export function buildIeltsAudioLesson(preset) {
  if (!preset) return null;
  return buildIeltsAudioLessonFromSources(preset, {
    authenticData: findAuthenticDictationEntry(preset.id),
    tests: IELTS_TESTS,
  });
}
