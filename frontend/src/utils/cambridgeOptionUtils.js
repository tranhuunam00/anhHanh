/**
 * Cambridge IELTS Option Parser & Helper Utilities
 * Standardizes option strings, letter extraction, and pair handling across tests
 */

/**
 * Parses raw option string (e.g., "A. in a hotel", "A going to a theme park", "A: coffee")
 * or object ({ letter, text }) into clean { letter, text }.
 *
 * @param {string|object|null|undefined} opt
 * @returns {{ letter: string, text: string }}
 */
export function parseOption(opt) {
  if (!opt) return { letter: "", text: "" };
  if (typeof opt === "object") {
    if (opt.letter || opt.val) {
      return {
        letter: String(opt.letter || opt.val).trim().toUpperCase(),
        text: String(opt.text || opt.name || opt.label || "").trim()
      };
    }
    return { letter: "", text: "" };
  }

  const str = String(opt).trim();
  if (!str) return { letter: "", text: "" };

  // Format: "A. text" or "A: text" or "A - text" or "A) text"
  const matchWithSeparator = str.match(/^([A-Za-z0-9ivxlcdm]+)[\.\:\s\-\)]+(.*)$/i);
  if (matchWithSeparator) {
    return {
      letter: matchWithSeparator[1].toUpperCase(),
      text: matchWithSeparator[2].trim()
    };
  }

  // Format: "A text" (single letter followed by space)
  const matchLetterSpace = str.match(/^([A-Za-z])\s+(.*)$/);
  if (matchLetterSpace) {
    return {
      letter: matchLetterSpace[1].toUpperCase(),
      text: matchLetterSpace[2].trim()
    };
  }

  // Single letter only or fallback
  return {
    letter: str.charAt(0).toUpperCase(),
    text: str.slice(1).trim() || str
  };
}

/**
 * Extracts matching options from item, part, or fallback range
 *
 * @param {object} item
 * @param {object} part
 * @returns {Array<string|object>}
 */
export function extractMatchingOptions(item, part) {
  if (Array.isArray(item?.options) && item.options.length > 0) {
    return item.options;
  }
  if (Array.isArray(part?.boxOptions) && part.boxOptions.length > 0) {
    return part.boxOptions;
  }
  if (Array.isArray(part?.matchingOptions) && part.matchingOptions.length > 0) {
    return part.matchingOptions;
  }
  if (Array.isArray(part?.mapLetters) && part.mapLetters.length > 0) {
    return part.mapLetters;
  }
  return ["A", "B", "C", "D", "E", "F", "G", "H"];
}

/**
 * Checks if a specific letter option is selected in a choose_two question pair
 *
 * @param {object} answers
 * @param {number} qNum
 * @param {number|null|undefined} pairNum
 * @param {string} letter
 * @returns {boolean}
 */
export function isChooseTwoSelected(answers, qNum, pairNum, letter) {
  if (!answers || !letter) return false;
  const targetLetter = String(letter).trim().toUpperCase();
  const qAns = String(answers[qNum] || "").trim().toUpperCase();
  if (qAns === targetLetter) return true;
  if (pairNum) {
    const pairAns = String(answers[pairNum] || "").trim().toUpperCase();
    if (pairAns === targetLetter) return true;
  }
  return false;
}
