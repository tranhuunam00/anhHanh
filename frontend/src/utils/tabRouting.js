/**
 * URL <-> tab mapping for the single-page app shell.
 * Pure functions so routing stays testable outside React.
 */

export const DEFAULT_TAB = "tab-dictation";

/** Ordered list: [tabId, canonicalPath, ...aliasPaths] */
const TAB_ROUTES = [
  ["tab-admin", "/admin"],
  ["tab-vocab", "/vocab"],
  ["tab-transcript", "/transcript"],
  ["tab-reader", "/reader"],
  ["tab-writing", "/writing"],
  ["tab-destination-b2", "/destination-b2"],
  ["tab-visual-vocab", "/visual-vocab"],
  ["tab-root-words", "/roots", "/root-words"],
  ["tab-history", "/history"],
  ["tab-audio-studio", "/audio-studio"],
  ["tab-buddy", "/buddy", "/ban-hoc"],
  ["tab-ielts-test", "/ielts", "/ielts-test"],
  ["tab-primary", "/kids", "/tieu-hoc", "/primary"],
  ["tab-tiktok-live", "/tiktok-live"],
];

/** All tab ids known to the router (including the default tab). */
export const KNOWN_TABS = Object.freeze([DEFAULT_TAB, ...TAB_ROUTES.map(([tab]) => tab)]);

/**
 * @param {string} path Lower-cased pathname
 * @param {string} base Route base path (e.g. "/vocab")
 * @returns {boolean} true for exact match or a sub-path ("/vocab/123")
 */
export function matchesRoute(path, base) {
  if (typeof path !== "string" || typeof base !== "string" || !base) return false;
  return path === base || path.startsWith(`${base}/`);
}

/**
 * Resolves the active tab from a URL location.
 * @param {string} [pathname]
 * @param {string} [search]
 * @returns {string} tab id
 */
export function getTabFromLocation(pathname = "/", search = "") {
  const query = typeof search === "string" ? search : "";
  if (query.includes("buddy_invite=") || query.includes("invite=")) {
    return "tab-buddy";
  }

  const raw = typeof pathname === "string" ? pathname.trim().toLowerCase() : "";
  if (!raw) return DEFAULT_TAB;
  // Normalise trailing slash ("/vocab/" -> "/vocab") but keep root "/"
  const path = raw.length > 1 ? raw.replace(/\/+$/, "") : raw;

  for (const [tab, ...paths] of TAB_ROUTES) {
    if (paths.some((base) => matchesRoute(path, base))) return tab;
  }
  return DEFAULT_TAB;
}

/**
 * Canonical path for a tab. Unknown tabs map to "/".
 * @param {string} tab
 * @returns {string}
 */
export function getPathFromTab(tab) {
  const route = TAB_ROUTES.find(([id]) => id === tab);
  return route ? route[1] : "/";
}

/**
 * Finds the tab id of the nav button containing `element` (event delegation).
 * @param {Element|null} element Event target
 * @returns {string|null}
 */
export function getTabIdFromElement(element) {
  if (!element || typeof element.closest !== "function") return null;
  const button = element.closest("[data-tab]");
  if (!button || typeof button.getAttribute !== "function") return null;
  const tabId = button.getAttribute("data-tab");
  return typeof tabId === "string" && tabId.trim() ? tabId.trim() : null;
}

/**
 * Normalises a requested tab id, mapping legacy aliases and unknown ids to a
 * real tab so the UI never ends up on a blank screen.
 * @param {string} tab
 * @returns {string}
 */
export function normalizeTabId(tab) {
  if (tab === "tab-ielts") return "tab-ielts-test";
  return KNOWN_TABS.includes(tab) ? tab : DEFAULT_TAB;
}
