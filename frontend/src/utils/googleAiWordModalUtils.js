// Pure helpers for GoogleAiWordModal (kept JSX-free so node --test can cover them).

const EDGE_PUNCTUATION = /^[’'".:,;!?-]+|[’'".:,;!?-]+$/g;

/** Trim whitespace and leading/trailing punctuation from a word; non-strings become "". */
export function cleanGoogleAiWord(word) {
  if (typeof word !== "string") return "";
  return word.trim().replace(EDGE_PUNCTUATION, "");
}

/** The modal shows only when explicitly open AND there is a real word to look up. */
export function shouldShowGoogleAiModal(isOpen, word) {
  return isOpen === true && cleanGoogleAiWord(word).length > 0;
}

export const GOOGLE_POPUP_NAME = "shotlang-google-lookup";
export const GOOGLE_POPUP_MIN_SCREEN_WIDTH = 900;

/**
 * Window features for a Google popup docked on the right side of the screen.
 * Returns null when the screen is too narrow (phones/tablets: popups become tabs anyway).
 */
export function buildGooglePopupFeatures(screenInfo) {
  const availWidth = Number(screenInfo?.availWidth);
  const availHeight = Number(screenInfo?.availHeight);
  if (!Number.isFinite(availWidth) || !Number.isFinite(availHeight) || availHeight <= 0) return null;
  if (availWidth < GOOGLE_POPUP_MIN_SCREEN_WIDTH) return null;

  const availLeft = Number.isFinite(Number(screenInfo?.availLeft)) ? Number(screenInfo.availLeft) : 0;
  const availTop = Number.isFinite(Number(screenInfo?.availTop)) ? Number(screenInfo.availTop) : 0;
  const width = Math.round(Math.min(720, Math.max(480, availWidth * 0.42)));
  const height = Math.round(availHeight);
  const left = Math.round(availLeft + availWidth - width);
  return `popup=yes,width=${width},height=${height},left=${left},top=${availTop}`;
}

/**
 * Open (or reuse) the docked Google popup. Returns true if it opened, false when the
 * caller should fall back to the normal new-tab link (narrow screen, blocked popup, no window).
 */
export function openGoogleSidePopup(url, win = typeof window !== "undefined" ? window : undefined) {
  if (!url || typeof url !== "string" || !win || typeof win.open !== "function") return false;
  const features = buildGooglePopupFeatures(win.screen);
  if (!features) return false;
  try {
    const popup = win.open(url, GOOGLE_POPUP_NAME, features);
    if (!popup) return false;
    if (typeof popup.focus === "function") popup.focus();
    return true;
  } catch {
    return false;
  }
}
