/**
 * Routing helper for the IELTS Listening module.
 * Cambridge 18 & 19 are rendered by the data-driven renderer (layout comes from the test data),
 * so each test shows its own notes/tables instead of a hard-coded layout of another test.
 */
const DATA_DRIVEN_LISTENING_PREFIXES = ["cambridge-18-", "cambridge-19-"];

export function usesDataDrivenListeningRenderer(testId) {
  if (!testId || typeof testId !== "string") return false;
  return DATA_DRIVEN_LISTENING_PREFIXES.some((prefix) => testId.startsWith(prefix));
}

