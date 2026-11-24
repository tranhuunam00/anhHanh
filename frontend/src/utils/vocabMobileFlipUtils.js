// Pure helpers for VocabExerciseMobileFlip (kept JSX-free so node --test can cover them).

export const FLIP_SHORTCUT_TOGGLE = "TOGGLE";
export const FLIP_SHORTCUT_FORGOT = "FORGOT";
export const FLIP_SHORTCUT_MASTERED = "MASTERED";

const TYPING_TAGS = new Set(["INPUT", "TEXTAREA"]);

/**
 * Map a keydown event to a flip-card action: Space flips, 1 = not yet, 2 = mastered.
 * Returns null when the key must be ignored: typing in a field, or a Google lookup is open
 * (so pressing keys while reading Google never skips/answers the current card).
 */
export function resolveFlipShortcut(event, isLookupOpen = false) {
  if (!event || typeof event !== "object" || isLookupOpen === true) return null;
  const tag = typeof event.target?.tagName === "string" ? event.target.tagName.toUpperCase() : "";
  if (TYPING_TAGS.has(tag)) return null;
  if (event.code === "Space") return FLIP_SHORTCUT_TOGGLE;
  if (event.key === "1") return FLIP_SHORTCUT_FORGOT;
  if (event.key === "2") return FLIP_SHORTCUT_MASTERED;
  return null;
}
