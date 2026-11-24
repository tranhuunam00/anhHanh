import { test, describe, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  createUiIntentStore,
  queueUiIntent,
  consumeUiIntent,
  clearUiIntents,
  UI_INTENTS,
} from "../src/utils/uiIntents.js";

describe("createUiIntentStore", () => {
  test("queued intent is consumed exactly once", () => {
    const store = createUiIntentStore();
    store.queue("open", { now: 0 });
    assert.equal(store.consume("open", { now: 10 }), true);
    assert.equal(store.consume("open", { now: 11 }), false);
    assert.equal(store.size(), 0);
  });

  test("consuming without a queued intent returns false", () => {
    const store = createUiIntentStore();
    assert.equal(store.consume("never"), false);
  });

  test("expired intent returns false and is removed", () => {
    const store = createUiIntentStore();
    store.queue("open", { ttlMs: 100, now: 1000 });
    assert.equal(store.consume("open", { now: 1101 }), false);
    assert.equal(store.size(), 0);
  });

  test("intent is valid exactly at the TTL boundary", () => {
    const store = createUiIntentStore();
    store.queue("open", { ttlMs: 100, now: 1000 });
    assert.equal(store.consume("open", { now: 1100 }), true);
  });

  test("invalid ttl falls back to the 10s default", () => {
    const store = createUiIntentStore();
    store.queue("a", { ttlMs: -1, now: 0 });
    store.queue("b", { ttlMs: Number.NaN, now: 0 });
    assert.equal(store.consume("a", { now: 9999 }), true);
    assert.equal(store.consume("b", { now: 10001 }), false);
  });

  test("re-queueing refreshes expiry and names are trimmed", () => {
    const store = createUiIntentStore();
    store.queue(" open ", { ttlMs: 10, now: 0 });
    store.queue("open", { ttlMs: 10, now: 100 });
    assert.equal(store.size(), 1);
    assert.equal(store.consume("open", { now: 105 }), true);
  });

  test("clear removes all intents; stores are isolated", () => {
    const a = createUiIntentStore();
    const b = createUiIntentStore();
    a.queue("x");
    a.queue("y");
    assert.equal(b.size(), 0);
    a.clear();
    assert.equal(a.size(), 0);
  });

  test("throws TypeError for invalid intent names", () => {
    const store = createUiIntentStore();
    assert.throws(() => store.queue(""), TypeError);
    assert.throws(() => store.queue("   "), TypeError);
    assert.throws(() => store.queue(null), TypeError);
    assert.throws(() => store.consume(42), TypeError);
  });
});

describe("shared intent helpers", () => {
  beforeEach(() => clearUiIntents());

  test("queue/consume via module-level helpers", () => {
    queueUiIntent(UI_INTENTS.OPEN_EXERCISE_HUB);
    assert.equal(consumeUiIntent(UI_INTENTS.OPEN_EXERCISE_HUB), true);
    assert.equal(consumeUiIntent(UI_INTENTS.OPEN_EXERCISE_HUB), false);
  });

  test("clearUiIntents drops pending intents", () => {
    queueUiIntent(UI_INTENTS.OPEN_EXERCISE_HUB);
    clearUiIntents();
    assert.equal(consumeUiIntent(UI_INTENTS.OPEN_EXERCISE_HUB), false);
  });

  test("UI_INTENTS is frozen and matches the legacy DOM event name", () => {
    assert.equal(Object.isFrozen(UI_INTENTS), true);
    assert.equal(UI_INTENTS.OPEN_EXERCISE_HUB, "open-exercise-hub-modal");
  });
});
