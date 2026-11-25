// Persists an in-progress "Thẻ di động đi đường" (flip card) session so a page reload —
// pull-to-refresh, the phone discarding the tab while locked, leaving and coming back —
// resumes at the same card instead of dropping the learner back to the vocab list.
// Pure + storage-injectable so node --test can cover it.

export const FLIP_SESSION_STORAGE_KEY = "shotlang_vocab_flip_session_v1";
export const FLIP_SESSION_VERSION = 1;
export const FLIP_SESSION_TTL_MS = 12 * 60 * 60 * 1000;
// Small allowance for clock drift between the save and the load.
const FUTURE_SKEW_MS = 60 * 1000;

/** Stable owner key of a snapshot: the user's id, or "guest" when signed out. */
export function resolveFlipSessionOwner(userId) {
  if (userId === null || userId === undefined) return "guest";
  const key = String(userId).trim();
  return key ? key : "guest";
}

const toCount = (value) => (Number.isInteger(value) && value > 0 ? value : 0);

/**
 * Snapshot of a running flip session, or null when there is nothing worth resuming
 * (no words, or the current index is outside the word list).
 */
export function buildFlipSessionSnapshot(session, now = Date.now()) {
  if (!session || typeof session !== "object") return null;
  const { items, currentIndex } = session;
  if (!Array.isArray(items) || items.length === 0) return null;
  if (!Number.isInteger(currentIndex) || currentIndex < 0 || currentIndex >= items.length) return null;
  return {
    v: FLIP_SESSION_VERSION,
    owner: resolveFlipSessionOwner(session.userId),
    savedAt: now,
    items,
    currentIndex,
    score: toCount(session.score),
    combo: toCount(session.combo),
    maxCombo: toCount(session.maxCombo),
    resultsHistory: Array.isArray(session.resultsHistory) ? session.resultsHistory : [],
  };
}

/**
 * Validate a stored snapshot (object or JSON string) for this user.
 * Returns a clean snapshot, or null when it is broken, someone else's, or expired.
 */
export function parseFlipSessionSnapshot(raw, userId, now = Date.now(), ttlMs = FLIP_SESSION_TTL_MS) {
  let data = raw;
  if (typeof raw === "string") {
    try {
      data = JSON.parse(raw);
    } catch {
      return null;
    }
  }
  if (!data || typeof data !== "object" || data.v !== FLIP_SESSION_VERSION) return null;
  if (data.owner !== resolveFlipSessionOwner(userId)) return null;
  const { savedAt } = data;
  if (typeof savedAt !== "number" || !Number.isFinite(savedAt)) return null;
  if (now - savedAt > ttlMs || savedAt - now > FUTURE_SKEW_MS) return null;
  return buildFlipSessionSnapshot({ ...data, userId }, savedAt);
}

/** window.localStorage when usable; null in node, private mode or blocked storage. */
export function getFlipSessionStorage() {
  try {
    if (typeof window === "undefined" || !window.localStorage) return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

/** Save a snapshot. Returns true on success; never throws (quota / blocked storage). */
export function saveFlipSession(snapshot, storage = getFlipSessionStorage()) {
  if (!snapshot || !storage) return false;
  try {
    storage.setItem(FLIP_SESSION_STORAGE_KEY, JSON.stringify(snapshot));
    return true;
  } catch {
    return false;
  }
}

/** Load this user's resumable snapshot, or null. Never throws. */
export function loadFlipSession(userId, storage = getFlipSessionStorage(), now = Date.now()) {
  if (!storage) return null;
  try {
    return parseFlipSessionSnapshot(storage.getItem(FLIP_SESSION_STORAGE_KEY), userId, now);
  } catch {
    return null;
  }
}

/** Forget the saved session (explicit exit, back to menu, finished). Returns true when cleared. */
export function clearFlipSession(storage = getFlipSessionStorage()) {
  if (!storage) return false;
  try {
    storage.removeItem(FLIP_SESSION_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

/**
 * Whether the practice hub should open by itself when the vocab tab mounts:
 * a queued "open exercise" intent, the ?openExercise=true link, or a flip session to resume.
 */
export function shouldAutoOpenExerciseHub({ queuedIntent = false, search = "", hasResumableSession = false } = {}) {
  if (queuedIntent === true || hasResumableSession === true) return true;
  return typeof search === "string" && search.includes("openExercise=true");
}
