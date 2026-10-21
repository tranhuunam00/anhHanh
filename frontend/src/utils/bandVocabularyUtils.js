/**
 * Utility functions for Band-based Vocabulary Estimation, Formatting, and Ranking.
 * Ensures topic vocabulary recommendations align with the user's selected Target Band.
 */

/**
 * Normalizes any band representation into standard "Band X.X" format.
 * @param {string|number|null} rawBand
 * @param {number|string} [fallbackBand=7.0]
 * @returns {string} e.g. "Band 8.0", "Band 7.5", "Band 6.5"
 */
export function formatBandLabel(rawBand, fallbackBand = 7.0) {
  if (rawBand === null || rawBand === undefined || rawBand === "") {
    const numFallback = typeof fallbackBand === "number" ? fallbackBand : parseFloat(fallbackBand) || 7.0;
    return `Band ${numFallback.toFixed(1)}`;
  }

  const str = String(rawBand).trim();

  // Match existing "Band X.X" or "BAND X.X"
  const bandMatch = str.match(/band\s*([0-9]+(?:\.[0-9]+)?)/i);
  if (bandMatch) {
    const val = parseFloat(bandMatch[1]);
    return `Band ${val.toFixed(1)}`;
  }

  // Handle shorthands "band8", "band7", "band6"
  const lower = str.toLowerCase();
  if (lower === "band8" || lower === "8" || lower === "8.0") return "Band 8.0";
  if (lower === "band7" || lower === "7" || lower === "7.0") return "Band 7.0";
  if (lower === "band6" || lower === "6" || lower === "6.0") return "Band 6.0";
  if (lower === "band8.5" || lower === "8.5") return "Band 8.5";
  if (lower === "band7.5" || lower === "7.5") return "Band 7.5";
  if (lower === "band6.5" || lower === "6.5") return "Band 6.5";

  // Try matching any digit in string (e.g. "Target 8.0 Level", "Band 8", etc.)
  const numMatch = str.match(/([0-9]+(?:\.[0-9]+)?)/);
  if (numMatch) {
    const val = parseFloat(numMatch[1]);
    if (!isNaN(val) && val >= 1 && val <= 9) {
      return `Band ${val.toFixed(1)}`;
    }
  }

  const numFallback = typeof fallbackBand === "number" ? fallbackBand : parseFloat(fallbackBand) || 7.0;
  return `Band ${numFallback.toFixed(1)}`;
}

/**
 * Extracts a numeric float band score from any band string or number.
 * @param {string|number|null} bandVal
 * @param {number} [fallback=7.0]
 * @returns {number}
 */
export function parseBandScore(bandVal, fallback = 7.0) {
  if (typeof bandVal === "number" && !isNaN(bandVal)) {
    return bandVal;
  }
  if (!bandVal) return fallback;

  const str = String(bandVal);
  const match = str.match(/([0-9]+(?:\.[0-9]+)?)/);
  if (match) {
    const num = parseFloat(match[1]);
    if (!isNaN(num) && num >= 1 && num <= 9) {
      return num;
    }
  }
  return fallback;
}

// Set of advanced academic lexical stems that signal C1/C2 IELTS vocabulary (Band 8.0+)
const ADVANCED_ACADEMIC_STEMS = new Set([
  "exponential", "revitaliz", "deficit", "stagnat", "disparity",
  "predominant", "exorbitant", "infrastruct", "ubiquitous", "equilibrium",
  "proliferat", "mitigat", "profound", "indispensable", "paramount",
  "deteriorat", "counterpart", "autonomy", "framework", "imperative",
  "repertoire", "paradigm", "disproportion", "trajectory", "adversity",
  "substantiat", "correlat", "underpin", "remunerat", "hollow-out",
  "decentraliz", "incentiv", "adaptab", "pedagog", "ecolog", "bespoke",
  "disincentiv", "regressive", "homogeniz", "provenance", "non-communicable"
]);

/**
 * Estimate the IELTS Band level for a vocabulary item or collocation.
 * @param {string|Object} rawWord
 * @param {Object} [promptContext={}]
 * @param {number} [targetBand=7.0]
 * @returns {string} e.g. "Band 8.0", "Band 7.5", "Band 7.0"
 */
export function estimateWordBand(rawWord, promptContext = {}, targetBand = 7.0) {
  if (!rawWord) return formatBandLabel(targetBand);

  // If explicit band exists on object, use it directly
  if (typeof rawWord === "object" && rawWord !== null) {
    if (rawWord.band) {
      return formatBandLabel(rawWord.band, targetBand);
    }
  }

  const word = typeof rawWord === "string" ? rawWord.trim() : (rawWord?.word || rawWord?.phrase || "").trim();
  if (!word) return formatBandLabel(targetBand);

  const lower = word.toLowerCase();
  const words = lower.split(/[\s-]+/).filter(Boolean);
  const wordCount = words.length;

  // Check advanced stems
  let hasAdvancedStem = false;
  for (const stem of ADVANCED_ACADEMIC_STEMS) {
    if (lower.includes(stem)) {
      hasAdvancedStem = true;
      break;
    }
  }

  if (hasAdvancedStem) {
    return wordCount >= 3 ? "Band 8.5" : "Band 8.0";
  }

  // Multi-word academic collocations (3+ words)
  if (wordCount >= 3) {
    return "Band 8.0";
  }

  // 2-word academic collocations
  if (wordCount === 2) {
    // Check if contains academic suffixes (-tion, -ment, -ity, -ive, -al, -ence, -ance)
    const hasAcademicSuffix = words.some((w) =>
      /(tion|ment|ity|ive|al|ence|ance|able|ible|ized|ised)$/.test(w) && w.length >= 6
    );
    if (hasAcademicSuffix) {
      return targetBand >= 8.0 ? "Band 8.0" : "Band 7.5";
    }
    return targetBand <= 6.5 ? "Band 6.5" : "Band 7.0";
  }

  // Single word
  if (word.length >= 10) {
    return targetBand >= 7.5 ? "Band 7.5" : "Band 7.0";
  }
  if (word.length >= 7) {
    return targetBand <= 6.5 ? "Band 6.5" : "Band 7.0";
  }

  return "Band 6.0";
}

/**
 * Calculates priority bonus score based on how closely a word's band matches the target band.
 * @param {string|number} wordBand
 * @param {number|string} targetBand
 * @returns {number} Bonus points (0 - 25)
 */
export function calculateBandMatchBonus(wordBand, targetBand = 7.0) {
  const wScore = parseBandScore(wordBand, 7.0);
  const tScore = parseBandScore(targetBand, 7.0);
  const diff = Math.abs(wScore - tScore);

  if (diff <= 0.1) return 25; // Exact match
  if (diff <= 0.6) return 16; // Very close (within 0.5 band)
  if (diff <= 1.1) return 8;  // Close (within 1.0 band)
  return 0;
}

/**
 * Filter or prioritize a list of keywords based on targetBand.
 * @param {Array<Object>} keywords
 * @param {number|string} targetBand
 * @param {boolean} [strictFilter=false]
 * @returns {Array<Object>}
 */
export function filterKeywordsByTargetBand(keywords = [], targetBand = 7.0, strictFilter = false) {
  if (!Array.isArray(keywords)) return [];
  const target = parseBandScore(targetBand, 7.0);

  if (!strictFilter) {
    return [...keywords].sort((a, b) => {
      const diffA = Math.abs(parseBandScore(a.band, 7.0) - target);
      const diffB = Math.abs(parseBandScore(b.band, 7.0) - target);
      return diffA - diffB;
    });
  }

  return keywords.filter((k) => {
    const bandNum = parseBandScore(k.band, 7.0);
    return Math.abs(bandNum - target) <= 0.6;
  });
}
