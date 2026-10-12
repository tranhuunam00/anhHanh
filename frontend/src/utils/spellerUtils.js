/**
 * Utility functions for Speller / Active Typing Vocabulary Practice
 */

/**
 * Normalizes a word for typing comparison (lowercased, trimmed, collapses whitespace).
 * @param {string} str
 * @returns {string}
 */
export function normalizeSpellerWord(str) {
  if (!str || typeof str !== "string") return "";
  return str.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Checks whether user input matches the target word.
 * Tolerant to leading/trailing whitespace and case.
 * @param {string} inputWord
 * @param {string} targetWord
 * @returns {boolean}
 */
export function checkSpellerAnswer(inputWord, targetWord) {
  if (!inputWord || !targetWord) return false;
  return normalizeSpellerWord(inputWord) === normalizeSpellerWord(targetWord);
}

/**
 * Generates the next progressive hint for the target word.
 * Returns the target prefix with one more character than currently matched.
 * @param {string} targetWord
 * @param {string} currentInput
 * @returns {string}
 */
export function getNextSpellerHint(targetWord, currentInput = "") {
  if (!targetWord || typeof targetWord !== "string") return "";
  const target = targetWord.trim();
  const input = typeof currentInput === "string" ? currentInput.trim() : "";

  if (!input) {
    return target.slice(0, 1);
  }

  // Find how many characters from input match the start of target (case-insensitive)
  let matchCount = 0;
  while (
    matchCount < input.length &&
    matchCount < target.length &&
    input[matchCount].toLowerCase() === target[matchCount].toLowerCase()
  ) {
    matchCount++;
  }

  // Return the prefix up to matchCount + 1 from original target word
  const nextLen = Math.min(target.length, matchCount + 1);
  return target.slice(0, nextLen);
}

/**
 * Generates letter slot representation for visual indicator.
 * @param {string} targetWord
 * @param {string} currentInput
 * @returns {Array<{ index: number, char: string, isRevealed: boolean, isSpace: boolean }>}
 */
export function getSpellerLetterSlots(targetWord, currentInput = "") {
  if (!targetWord || typeof targetWord !== "string") return [];
  const target = targetWord.trim();
  const input = typeof currentInput === "string" ? currentInput.trim() : "";

  return target.split("").map((ch, idx) => {
    const isSpace = ch === " " || ch === "-";
    const hasMatch =
      idx < input.length &&
      ch.toLowerCase() === input[idx].toLowerCase();

    return {
      index: idx,
      char: ch,
      isRevealed: isSpace || hasMatch,
      isSpace,
    };
  });
}
