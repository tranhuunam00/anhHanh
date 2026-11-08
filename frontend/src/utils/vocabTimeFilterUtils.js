/**
 * Vocabulary Time Range Filter Utilities
 * Provides functions to filter vocabulary items by creation date (created_at)
 * or mastery timestamp (mastered_at) across preset or custom date ranges.
 */

export const TIME_RANGE_OPTIONS = [
  { key: "ALL", label: "Tất cả thời gian", shortLabel: "Tất cả" },
  { key: "TODAY", label: "Hôm nay", shortLabel: "Hôm nay" },
  { key: "3DAYS", label: "3 ngày gần đây", shortLabel: "3 ngày" },
  { key: "7DAYS", label: "7 ngày qua", shortLabel: "7 ngày" },
  { key: "30DAYS", label: "30 ngày qua", shortLabel: "30 ngày" },
  { key: "CUSTOM", label: "Tùy chọn ngày", shortLabel: "Tùy chọn" },
];

/**
 * Resolve client-side mastered_at ISO string when updating vocabulary status.
 * Sets current timestamp when transitioning to MASTERED, clears to null otherwise.
 * @param {string} newStatus - "NEW" | "LEARNING" | "MASTERED"
 * @param {string|null} [nowIso] - Optional ISO timestamp override for deterministic tests
 * @returns {string|null}
 */
export const resolveMasteredAtClient = (newStatus, nowIso = null) => {
  if (!newStatus || typeof newStatus !== "string") return null;
  if (newStatus.trim().toUpperCase() === "MASTERED") {
    return nowIso || new Date().toISOString();
  }
  return null;
};

/**
 * Internal helper to compute [startTimestamp, endTimestamp] in milliseconds
 */
const computeTimeRangeTimestamps = (
  timeRange = "ALL",
  customStart = null,
  customEnd = null,
  referenceDate = null
) => {
  const now =
    referenceDate instanceof Date && !isNaN(referenceDate.getTime())
      ? new Date(referenceDate)
      : new Date();

  let startTimestamp = null;
  let endTimestamp = null;

  switch (timeRange) {
    case "TODAY": {
      const todayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0,
        0
      );
      startTimestamp = todayStart.getTime();
      break;
    }
    case "3DAYS": {
      startTimestamp = now.getTime() - 3 * 24 * 60 * 60 * 1000;
      break;
    }
    case "7DAYS": {
      startTimestamp = now.getTime() - 7 * 24 * 60 * 60 * 1000;
      break;
    }
    case "30DAYS": {
      startTimestamp = now.getTime() - 30 * 24 * 60 * 60 * 1000;
      break;
    }
    case "CUSTOM": {
      if (customStart) {
        const s = new Date(customStart);
        if (!isNaN(s.getTime())) {
          s.setHours(0, 0, 0, 0);
          startTimestamp = s.getTime();
        }
      }
      if (customEnd) {
        const e = new Date(customEnd);
        if (!isNaN(e.getTime())) {
          e.setHours(23, 59, 59, 999);
          endTimestamp = e.getTime();
        }
      }
      break;
    }
    default:
      break;
  }

  return { startTimestamp, endTimestamp, isKnownRange: ["TODAY", "3DAYS", "7DAYS", "30DAYS", "CUSTOM"].includes(timeRange) };
};

/**
 * Filter an array of vocabulary items by creation date (created_at)
 * @param {Array} words - Array of vocabulary items
 * @param {string} timeRange - "ALL" | "TODAY" | "3DAYS" | "7DAYS" | "30DAYS" | "CUSTOM"
 * @param {string|null} customStart - ISO Date string (YYYY-MM-DD) for start
 * @param {string|null} customEnd - ISO Date string (YYYY-MM-DD) for end
 * @param {Date} [referenceDate] - Optional reference date (defaults to new Date())
 * @returns {Array} Filtered array of words
 */
export const filterVocabByTimeRange = (
  words = [],
  timeRange = "ALL",
  customStart = null,
  customEnd = null,
  referenceDate = null
) => {
  if (!Array.isArray(words) || words.length === 0) return [];
  if (!timeRange || timeRange === "ALL") return words;

  const { startTimestamp, endTimestamp, isKnownRange } = computeTimeRangeTimestamps(
    timeRange,
    customStart,
    customEnd,
    referenceDate
  );
  if (!isKnownRange) return words;

  return words.filter((item) => {
    if (!item) return false;
    if (!item.created_at) return true;

    const itemTime = new Date(item.created_at).getTime();
    if (isNaN(itemTime)) return true;

    if (startTimestamp !== null && itemTime < startTimestamp) {
      return false;
    }
    if (endTimestamp !== null && itemTime > endTimestamp) {
      return false;
    }
    return true;
  });
};

/**
 * Filter an array of vocabulary items by mastery date (mastered_at)
 * Only matches words with status === "MASTERED" and a valid mastered_at within the range.
 * When masteredTimeRange is "ALL" or empty, returns words unchanged.
 * @param {Array} words - Array of vocabulary items
 * @param {string} masteredTimeRange - "ALL" | "TODAY" | "3DAYS" | "7DAYS" | "30DAYS" | "CUSTOM"
 * @param {string|null} customStart - ISO Date string (YYYY-MM-DD) for start
 * @param {string|null} customEnd - ISO Date string (YYYY-MM-DD) for end
 * @param {Date} [referenceDate] - Optional reference date
 * @returns {Array} Filtered array of words
 */
export const filterVocabByMasteredTimeRange = (
  words = [],
  masteredTimeRange = "ALL",
  customStart = null,
  customEnd = null,
  referenceDate = null
) => {
  if (!Array.isArray(words) || words.length === 0) return [];
  if (!masteredTimeRange || masteredTimeRange === "ALL") return words;

  const { startTimestamp, endTimestamp, isKnownRange } = computeTimeRangeTimestamps(
    masteredTimeRange,
    customStart,
    customEnd,
    referenceDate
  );
  if (!isKnownRange) return words;

  return words.filter((item) => {
    if (!item || item.status !== "MASTERED" || !item.mastered_at) return false;

    const itemTime = new Date(item.mastered_at).getTime();
    if (isNaN(itemTime)) return false;

    if (startTimestamp !== null && itemTime < startTimestamp) {
      return false;
    }
    if (endTimestamp !== null && itemTime > endTimestamp) {
      return false;
    }
    return true;
  });
};

/**
 * Counts words available in each predefined creation time range option
 * @param {Array} words - Array of vocabulary items
 * @param {Date} [referenceDate] - Optional reference date
 * @returns {Object} Map of time range keys to word counts
 */
export const countVocabByTimeRanges = (words = [], referenceDate = null) => {
  const safeWords = Array.isArray(words) ? words : [];
  const counts = {};
  TIME_RANGE_OPTIONS.forEach((opt) => {
    if (opt.key === "CUSTOM") {
      counts[opt.key] = 0;
    } else {
      counts[opt.key] = filterVocabByTimeRange(safeWords, opt.key, null, null, referenceDate).length;
    }
  });

  return counts;
};

/**
 * Counts mastered words available in each predefined mastered_at time range option
 * @param {Array} words - Array of vocabulary items
 * @param {Date} [referenceDate] - Optional reference date
 * @returns {Object} Map of time range keys to mastered word counts
 */
export const countVocabByMasteredTimeRanges = (words = [], referenceDate = null) => {
  const safeWords = Array.isArray(words) ? words : [];
  const masteredOnly = safeWords.filter((w) => w && w.status === "MASTERED");
  const counts = {};
  TIME_RANGE_OPTIONS.forEach((opt) => {
    if (opt.key === "CUSTOM") {
      counts[opt.key] = 0;
    } else if (opt.key === "ALL") {
      counts[opt.key] = masteredOnly.length;
    } else {
      counts[opt.key] = filterVocabByMasteredTimeRange(
        masteredOnly,
        opt.key,
        null,
        null,
        referenceDate
      ).length;
    }
  });

  return counts;
};
