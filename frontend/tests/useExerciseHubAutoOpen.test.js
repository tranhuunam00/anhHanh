import { test, describe, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { useExerciseHubAutoOpen } from "../src/hooks/useExerciseHubAutoOpen.js";
import { queueUiIntent, clearUiIntents, UI_INTENTS } from "../src/utils/uiIntents.js";
import {
  FLIP_SESSION_STORAGE_KEY,
  buildFlipSessionSnapshot,
} from "../src/utils/vocabFlipSessionStore.js";

const WORDS = [{ id: 1, word: "a" }, { id: 2, word: "b" }, { id: 3, word: "c" }];
const GLOBAL_KEYS = ["window", "document", "IS_REACT_ACT_ENVIRONMENT"];

let dom;
let saved;
let root;

const setup = (url = "https://shotlang.test/vocab") => {
  dom = new JSDOM("<!doctype html><div id='root'></div>", { url });
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
};

const renderHook = (onOpen, userId) => {
  const Probe = () => {
    useExerciseHubAutoOpen(onOpen, userId);
    return null;
  };
  root = createRoot(document.getElementById("root"));
  act(() => root.render(React.createElement(Probe)));
};

const storeSession = (userId, savedAt = Date.now()) => {
  const snap = buildFlipSessionSnapshot({ userId, items: WORDS, currentIndex: 1 }, savedAt);
  window.localStorage.setItem(FLIP_SESSION_STORAGE_KEY, JSON.stringify(snap));
};

describe("useExerciseHubAutoOpen", () => {
  beforeEach(() => {
    saved = Object.fromEntries(GLOBAL_KEYS.map((k) => [k, globalThis[k]]));
    clearUiIntents();
  });
  afterEach(() => {
    if (root) act(() => root.unmount());
    root = null;
    clearUiIntents();
    for (const k of GLOBAL_KEYS) {
      if (saved[k] === undefined) delete globalThis[k];
      else globalThis[k] = saved[k];
    }
    dom?.window.close();
  });

  test("does not open the hub when nothing asks for it", () => {
    setup();
    let opens = 0;
    renderHook(() => opens++, 7);
    assert.equal(opens, 0);
  });

  test("resumes: opens on mount when this user has a saved flip session (reload case)", () => {
    setup();
    storeSession(7);
    let opens = 0;
    renderHook(() => opens++, 7);
    assert.equal(opens, 1);
  });

  test("ignores another user's saved session", () => {
    setup();
    storeSession(8);
    let opens = 0;
    renderHook(() => opens++, 7);
    assert.equal(opens, 0);
  });

  test("ignores an expired saved session", () => {
    setup();
    storeSession(7, Date.now() - 13 * 60 * 60 * 1000);
    let opens = 0;
    renderHook(() => opens++, 7);
    assert.equal(opens, 0);
  });

  test("opens for an intent queued before mount, and consumes it", () => {
    setup();
    queueUiIntent(UI_INTENTS.OPEN_EXERCISE_HUB);
    let opens = 0;
    renderHook(() => opens++, 7);
    assert.equal(opens, 1);
    act(() => root.unmount());
    root = null;
    renderHook(() => opens++, 7);
    assert.equal(opens, 1, "intent must be single-use");
  });

  test("opens for the ?openExercise=true link", () => {
    setup("https://shotlang.test/vocab?openExercise=true");
    let opens = 0;
    renderHook(() => opens++, null);
    assert.equal(opens, 1);
  });

  test("opens when the open-exercise event fires after mount, using the latest callback", () => {
    setup();
    const calls = [];
    const Probe = ({ onOpen }) => {
      useExerciseHubAutoOpen(onOpen, 7);
      return null;
    };
    root = createRoot(document.getElementById("root"));
    act(() => root.render(React.createElement(Probe, { onOpen: () => calls.push("first") })));
    act(() => root.render(React.createElement(Probe, { onOpen: () => calls.push("second") })));
    act(() => window.dispatchEvent(new window.CustomEvent(UI_INTENTS.OPEN_EXERCISE_HUB)));
    assert.deepEqual(calls, ["second"]);
  });

  test("stops listening after unmount", () => {
    setup();
    let opens = 0;
    renderHook(() => opens++, 7);
    act(() => root.unmount());
    root = null;
    window.dispatchEvent(new window.CustomEvent(UI_INTENTS.OPEN_EXERCISE_HUB));
    assert.equal(opens, 0);
  });

  test("a throwing onOpen surfaces as an error (not swallowed)", () => {
    setup();
    storeSession(7);
    assert.throws(() =>
      renderHook(() => {
        throw new TypeError("open failed");
      }, 7)
    );
  });
});
