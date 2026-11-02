/**
 * Checks whether a paragraph label is a single uppercase letter (e.g., "A", "B")
 * versus a heading phrase (e.g., "Paragraph 1").
 * @param {string|null|undefined} id
 * @returns {boolean}
 */
export function isSingleLetterLabel(id) {
  if (!id || typeof id !== "string") return false;
  return /^[A-Z]$/.test(id.trim());
}

/**
 * Returns CSS class for input element based on review mode and evaluation state.
 * @param {object|null|undefined} evaluation
 * @param {number|string} qNum
 * @param {boolean} isReview
 * @returns {string}
 */
export function getFeedbackClass(evaluation, qNum, isReview = false) {
  if (!isReview || !evaluation || !evaluation[qNum]) return "";
  return evaluation[qNum].isCorrect ? "input-correct" : "input-incorrect";
}

