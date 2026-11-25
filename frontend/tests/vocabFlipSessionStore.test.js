import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  FLIP_SESSION_STORAGE_KEY,
  FLIP_SESSION_VERSION,
  FLIP_SESSION_TTL_MS,
  resolveFlipSessionOwner,
  buildFlipSessionSnapshot,
  parseFlipSessionSnapshot,
  getFlipSessionStorage,
  saveFlipSession,
  loadFlipSession,
  clearFlipSession,
  shouldAutoOpenExerciseHub,
} from "../src/utils/vocabFlipSessionStore.js";

const NOW = 1_800_000_000_000;
const WORDS = Array.from({ length: 20 }, (_, i) => ({ id: i + 1, word: `word${i + 1}`, meaning: `nghĩa ${i + 1}` }));

/** In-memory Storage double; `fail` makes the chosen method throw. */
const makeStorage = (fail = {}) => {
  const map = new Map();
  return {
    map,
    getItem: (k) => {
      if (fail.get) throw new Error("blocked");
      return map.has(k) ? map.get(k) : null;
    },
    setItem: (k, v) => {
      if (fail.set) throw new Error("QuotaExceededError");
      map.set(k, String(v));
    },
    removeItem: (k) => {
      if (fail.remove) throw new Error("blocked");
      map.delete(k);
    },
  };
};

const session = (over = {}) => ({
  userId: 7,
  items: WORDS,
  currentIndex: 9,
  score: 6,
  combo: 2,
  maxCombo: 4,
  resultsHistory: [{ id: 1, isCorrect: true }],
  ...over,
});

describe("resolveFlipSessionOwner", () => {
  test("numeric and string ids become the same trimmed string key", () => {
    assert.equal(resolveFlipSessionOwner(7), "7");
    assert.equal(resolveFlipSessionOwner("7"), "7");
    assert.equal(resolveFlipSessionOwner("  abc-1 "), "abc-1");
  });
  test("missing / empty ids fall back to guest", () => {
    for (const v of [null, undefined, "", "   "]) assert.equal(resolveFlipSessionOwner(v), "guest");
  });
  test("id 0 is a real id, not guest", () => {
    assert.equal(resolveFlipSessionOwner(0), "0");
  });
});

describe("buildFlipSessionSnapshot", () => {
  test("happy path: card 10/20 is captured with all counters", () => {
    const snap = buildFlipSessionSnapshot(session(), NOW);
    assert.deepEqual(snap, {
      v: FLIP_SESSION_VERSION,
      owner: "7",
      savedAt: NOW,
      items: WORDS,
      currentIndex: 9,
      score: 6,
      combo: 2,
      maxCombo: 4,
      resultsHistory: [{ id: 1, isCorrect: true }],
    });
  });
  test("first and last card are valid boundaries", () => {
    assert.equal(buildFlipSessionSnapshot(session({ currentIndex: 0 }), NOW).currentIndex, 0);
    assert.equal(buildFlipSessionSnapshot(session({ currentIndex: 19 }), NOW).currentIndex, 19);
  });
  test("index outside the word list or not an integer gives null", () => {
    for (const currentIndex of [-1, 20, 1.5, "3", null, undefined, NaN]) {
      assert.equal(buildFlipSessionSnapshot(session({ currentIndex }), NOW), null);
    }
  });
  test("no words (empty / not an array) gives null", () => {
    assert.equal(buildFlipSessionSnapshot(session({ items: [] }), NOW), null);
    assert.equal(buildFlipSessionSnapshot(session({ items: "abc" }), NOW), null);
    assert.equal(buildFlipSessionSnapshot(session({ items: undefined }), NOW), null);
  });
  test("bad counters are normalised to 0, bad history to []", () => {
    const snap = buildFlipSessionSnapshot(session({ score: -3, combo: "2", maxCombo: 1.2, resultsHistory: "x" }), NOW);
    assert.equal(snap.score, 0);
    assert.equal(snap.combo, 0);
    assert.equal(snap.maxCombo, 0);
    assert.deepEqual(snap.resultsHistory, []);
  });
  test("signed-out learner is stored as guest", () => {
    assert.equal(buildFlipSessionSnapshot(session({ userId: null }), NOW).owner, "guest");
  });
  test("bad input (null, string, number) gives null", () => {
    for (const v of [null, undefined, "session", 42]) assert.equal(buildFlipSessionSnapshot(v, NOW), null);
  });
});

describe("parseFlipSessionSnapshot", () => {
  const stored = () => buildFlipSessionSnapshot(session(), NOW);

  test("round-trips a JSON string for the same user", () => {
    const parsed = parseFlipSessionSnapshot(JSON.stringify(stored()), 7, NOW + 1000);
    assert.equal(parsed.currentIndex, 9);
    assert.equal(parsed.items.length, 20);
    assert.equal(parsed.savedAt, NOW);
  });
  test("accepts an already-parsed object", () => {
    assert.equal(parseFlipSessionSnapshot(stored(), "7", NOW).currentIndex, 9);
  });
  test("another user's session is never resumed", () => {
    assert.equal(parseFlipSessionSnapshot(stored(), 8, NOW), null);
    assert.equal(parseFlipSessionSnapshot(stored(), null, NOW), null);
  });
  test("expires after the TTL (boundary: exactly TTL still valid)", () => {
    assert.notEqual(parseFlipSessionSnapshot(stored(), 7, NOW + FLIP_SESSION_TTL_MS), null);
    assert.equal(parseFlipSessionSnapshot(stored(), 7, NOW + FLIP_SESSION_TTL_MS + 1), null);
  });
  test("custom TTL is respected", () => {
    assert.equal(parseFlipSessionSnapshot(stored(), 7, NOW + 5001, 5000), null);
    assert.notEqual(parseFlipSessionSnapshot(stored(), 7, NOW + 5000, 5000), null);
  });
  test("a snapshot from the far future (clock jump) is rejected, small skew allowed", () => {
    assert.notEqual(parseFlipSessionSnapshot(stored(), 7, NOW - 30 * 1000), null);
    assert.equal(parseFlipSessionSnapshot(stored(), 7, NOW - 10 * 60 * 1000), null);
  });
  test("wrong version or broken savedAt is rejected", () => {
    assert.equal(parseFlipSessionSnapshot({ ...stored(), v: 2 }, 7, NOW), null);
    assert.equal(parseFlipSessionSnapshot({ ...stored(), savedAt: "yesterday" }, 7, NOW), null);
    assert.equal(parseFlipSessionSnapshot({ ...stored(), savedAt: Infinity }, 7, NOW), null);
  });
  test("tampered content (index past the end) is rejected", () => {
    assert.equal(parseFlipSessionSnapshot({ ...stored(), currentIndex: 99 }, 7, NOW), null);
  });
  test("garbage input returns null without throwing", () => {
    for (const raw of [null, undefined, "", "{not json", "42", "null", 5, []]) {
      assert.equal(parseFlipSessionSnapshot(raw, 7, NOW), null);
    }
  });
});

describe("saveFlipSession / loadFlipSession / clearFlipSession", () => {
  test("save then load resumes at the same card (happy path)", () => {
    const storage = makeStorage();
    assert.equal(saveFlipSession(buildFlipSessionSnapshot(session(), NOW), storage), true);
    assert.ok(storage.map.has(FLIP_SESSION_STORAGE_KEY));
    const loaded = loadFlipSession(7, storage, NOW + 60 * 1000);
    assert.equal(loaded.currentIndex, 9);
    assert.equal(loaded.score, 6);
  });
  test("clear removes the session so the next load is empty", () => {
    const storage = makeStorage();
    saveFlipSession(buildFlipSessionSnapshot(session(), NOW), storage);
    assert.equal(clearFlipSession(storage), true);
    assert.equal(loadFlipSession(7, storage, NOW), null);
  });
  test("load with nothing stored returns null", () => {
    assert.equal(loadFlipSession(7, makeStorage(), NOW), null);
  });
  test("saving a null snapshot or without storage returns false", () => {
    assert.equal(saveFlipSession(null, makeStorage()), false);
    assert.equal(saveFlipSession(buildFlipSessionSnapshot(session(), NOW), null), false);
  });
  test("storage errors (quota, blocked) never throw", () => {
    const snap = buildFlipSessionSnapshot(session(), NOW);
    assert.equal(saveFlipSession(snap, makeStorage({ set: true })), false);
    assert.equal(loadFlipSession(7, makeStorage({ get: true }), NOW), null);
    assert.equal(clearFlipSession(makeStorage({ remove: true })), false);
  });
  test("no storage available: load null, clear false", () => {
    assert.equal(loadFlipSession(7, null, NOW), null);
    assert.equal(clearFlipSession(null), false);
  });
});

describe("getFlipSessionStorage", () => {
  test("returns null in node (no window)", () => {
    assert.equal(typeof window, "undefined");
    assert.equal(getFlipSessionStorage(), null);
  });
  test("returns window.localStorage when present, null when access throws", () => {
    const fake = makeStorage();
    globalThis.window = { localStorage: fake };
    try {
      assert.equal(getFlipSessionStorage(), fake);
      globalThis.window = Object.defineProperty({}, "localStorage", {
        get() {
          throw new Error("SecurityError");
        },
      });
      assert.equal(getFlipSessionStorage(), null);
    } finally {
      delete globalThis.window;
    }
  });
});

describe("shouldAutoOpenExerciseHub", () => {
  test("opens for a queued intent, the openExercise link, or a session to resume", () => {
    assert.equal(shouldAutoOpenExerciseHub({ queuedIntent: true }), true);
    assert.equal(shouldAutoOpenExerciseHub({ search: "?openExercise=true" }), true);
    assert.equal(shouldAutoOpenExerciseHub({ search: "?a=1&openExercise=true" }), true);
    assert.equal(shouldAutoOpenExerciseHub({ hasResumableSession: true }), true);
  });
  test("stays closed when nothing asks for it", () => {
    assert.equal(shouldAutoOpenExerciseHub({}), false);
    assert.equal(shouldAutoOpenExerciseHub(), false);
    assert.equal(shouldAutoOpenExerciseHub({ search: "?openExercise=false" }), false);
  });
  test("only exactly true flags count; non-string search is ignored", () => {
    assert.equal(shouldAutoOpenExerciseHub({ queuedIntent: "yes", hasResumableSession: 1 }), false);
    assert.equal(shouldAutoOpenExerciseHub({ search: null }), false);
    assert.equal(shouldAutoOpenExerciseHub({ search: 123 }), false);
  });
});
