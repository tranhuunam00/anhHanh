/**
 * Vocabulary Time Range Filter Utilities
 * Provides functions to filter vocabulary items by creation date or custom date range.
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
 * Filter an array of vocabulary items by time range
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

  const now = referenceDate instanceof Date && !isNaN(referenceDate.getTime())
    ? new Date(referenceDate)
    : new Date();

  let startTimestamp = null;
  let endTimestamp = null;

  switch (timeRange) {
    case "TODAY": {
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
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
      return words;
  }

  return words.filter((item) => {
    if (!item) return false;
    // If no created_at timestamp is present, default to include
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
 * Counts words available in each predefined time range option
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
