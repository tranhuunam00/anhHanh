/**
 * Routing helper for the IELTS Reading module.
 * Cambridge 16–19 are drawn by the data-driven renderer (layout comes from the test data),
 * so each test shows its own summaries/notes/tables instead of the hard-coded layout of another test.
 */
const DATA_DRIVEN_READING_PREFIXES = ["cambridge-16-", "cambridge-17-", "cambridge-18-", "cambridge-19-"];

/**
 * @param {string} testId
 * @returns {boolean}
 */
export function usesDataDrivenReadingRenderer(testId) {
  if (!testId || typeof testId !== "string") return false;
  return DATA_DRIVEN_READING_PREFIXES.some((prefix) => testId.startsWith(prefix));
}
