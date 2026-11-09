import {
  CAMBRIDGE_17_LESSONS,
  CAMBRIDGE_18_LESSONS,
  CAMBRIDGE_19_LESSONS,
  CAMBRIDGE_20_LESSONS,
  CAMBRIDGE_21_LESSONS,
  CAMBRIDGE_21_FULL_LESSONS
} from "../constants/ieltsCambridgePresets.js";

/**
 * Returns a curated list of featured IELTS spotlight lessons.
 * Always prioritizes the newest Cambridge 21 full test and top split tasks.
 *
 * @param {Array|null|undefined} customList - Optional override list for testing or customized highlights
 * @param {number} limit - Maximum number of spotlight items to return (default: 4)
 * @returns {Array} List of valid spotlight lessons
 */
export function getIeltsSpotlightLessons(customList = null, limit = 4) {
  const safeLimit = typeof limit === "number" && limit > 0 ? limit : 4;

  if (Array.isArray(customList) && customList.length > 0) {
    return customList
      .filter((item) => item && typeof item === "object" && (item.audioUrl || item.url))
      .slice(0, safeLimit);
  }

  const defaultPool = [
    CAMBRIDGE_21_FULL_LESSONS?.[0],
    CAMBRIDGE_21_LESSONS?.[0],
    CAMBRIDGE_20_LESSONS?.[0],
    CAMBRIDGE_19_LESSONS?.[0],
    CAMBRIDGE_18_LESSONS?.[0],
    CAMBRIDGE_17_LESSONS?.[0]
  ].filter(Boolean);

  return defaultPool.slice(0, safeLimit);
}

/**
 * Formats a user-friendly badge count for the IELTS library.
 *
 * @param {number|null|undefined} count - Total number of lessons
 * @returns {string} Formatted label (e.g. "80+ bài luyện", "16 bài luyện")
 */
export function formatIeltsSpotlightCount(count) {
  if (count === null || count === undefined || typeof count !== "number" || isNaN(count) || count <= 0) {
    return "80+ bài luyện";
  }
  if (count >= 80) return "80+ bài luyện";
  if (count >= 50) return "50+ bài luyện";
  return `${Math.floor(count)} bài luyện`;
}

/**
 * Computes toggle state for expanding/collapsing IELTS spotlight section.
 *
 * @param {boolean} currentState
 * @param {boolean|null|undefined} nextState - Explicit next state if provided
 * @returns {boolean} Updated boolean state
 */
export function computeIeltsExpandState(currentState, nextState = null) {
  if (typeof nextState === "boolean") {
    return nextState;
  }
  return !Boolean(currentState);
}

