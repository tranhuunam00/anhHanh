import { CAMBRIDGE_17_LESSONS, CAMBRIDGE_17_FULL_LESSONS } from "../constants/ieltsCambridge17Presets.js";
import { CAMBRIDGE_18_LESSONS, CAMBRIDGE_18_FULL_LESSONS } from "../constants/ieltsCambridge18Presets.js";
import { CAMBRIDGE_19_LESSONS, CAMBRIDGE_19_FULL_LESSONS } from "../constants/ieltsCambridge19Presets.js";
import { CAMBRIDGE_20_LESSONS, CAMBRIDGE_20_FULL_LESSONS } from "../constants/ieltsCambridge20Presets.js";
import { CAMBRIDGE_21_LESSONS, CAMBRIDGE_21_FULL_LESSONS } from "../constants/ieltsCambridge21Presets.js";

const ALL_IELTS_AUDIO_PRESETS = [
  ...CAMBRIDGE_17_LESSONS,
  ...CAMBRIDGE_17_FULL_LESSONS,
  ...CAMBRIDGE_18_LESSONS,
  ...CAMBRIDGE_18_FULL_LESSONS,
  ...CAMBRIDGE_19_LESSONS,
  ...CAMBRIDGE_19_FULL_LESSONS,
  ...CAMBRIDGE_20_LESSONS,
  ...CAMBRIDGE_20_FULL_LESSONS,
  ...CAMBRIDGE_21_LESSONS,
  ...CAMBRIDGE_21_FULL_LESSONS,
];

/**
 * Normalize an audio URL so "/audio/Cambridge%2021%20-%20Test%201.mp3" and
 * "/audio/Cambridge 21 - Test 1.mp3" compare equal.
 */
export function normalizeAudioUrl(url) {
  if (!url || typeof url !== "string") return "";
  let clean = url.trim().split(/[?#]/)[0];
  try {
    clean = decodeURIComponent(clean);
  } catch {
    // keep raw value when URL contains malformed escapes
  }
  return clean.toLowerCase();
}

/**
 * Find the real Cambridge preset (with id, book, duration, task metadata) that owns an audio URL.
 * Returns null when the URL is not a known preset audio.
 */
export function findIeltsPresetByAudioUrl(url) {
  const target = normalizeAudioUrl(url);
  if (!target) return null;
  return (
    ALL_IELTS_AUDIO_PRESETS.find(
      (p) => normalizeAudioUrl(p.audioUrl) === target || normalizeAudioUrl(p.url) === target
    ) || null
  );
}

/**
 * Build the preset object used to restore a lesson from a saved audio URL (F5 reload / sync button).
 * Prefers the authentic preset so the full transcript is loaded instead of a generic placeholder.
 */
export function resolveAudioPresetFromUrl(url) {
  const found = findIeltsPresetByAudioUrl(url);
  if (found) return found;
  return {
    id: url,
    url,
    audioUrl: url,
    title: "Cambridge IELTS Authentic Audio",
    duration: "05:00",
  };
}

