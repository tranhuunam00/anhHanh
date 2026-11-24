import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  resolveFlipShortcut,
  FLIP_SHORTCUT_TOGGLE,
  FLIP_SHORTCUT_FORGOT,
  FLIP_SHORTCUT_MASTERED,
} from "../src/utils/vocabMobileFlipUtils.js";

const keyEvent = ({ key = "", code = "", tagName = "BODY" } = {}) => ({
  key,
  code,
  target: { tagName },
});

describe("resolveFlipShortcut", () => {
  test("action constants are distinct strings", () => {
    const all = [FLIP_SHORTCUT_TOGGLE, FLIP_SHORTCUT_FORGOT, FLIP_SHORTCUT_MASTERED];
    assert.ok(all.every((v) => typeof v === "string" && v.length > 0));
    assert.equal(new Set(all).size, 3);
  });

  test("Space flips the card (happy path)", () => {
    assert.equal(resolveFlipShortcut(keyEvent({ key: " ", code: "Space" })), FLIP_SHORTCUT_TOGGLE);
  });
  test("1 = not yet remembered, 2 = mastered", () => {
    assert.equal(resolveFlipShortcut(keyEvent({ key: "1", code: "Digit1" })), FLIP_SHORTCUT_FORGOT);
    assert.equal(resolveFlipShortcut(keyEvent({ key: "2", code: "Digit2" })), FLIP_SHORTCUT_MASTERED);
  });
  test("numpad 1/2 (same key value) also work", () => {
    assert.equal(resolveFlipShortcut(keyEvent({ key: "1", code: "Numpad1" })), FLIP_SHORTCUT_FORGOT);
    assert.equal(resolveFlipShortcut(keyEvent({ key: "2", code: "Numpad2" })), FLIP_SHORTCUT_MASTERED);
  });

  test("every shortcut is ignored while the Google lookup is open", () => {
    for (const ev of [
      keyEvent({ key: " ", code: "Space" }),
      keyEvent({ key: "1", code: "Digit1" }),
      keyEvent({ key: "2", code: "Digit2" }),
    ]) {
      assert.equal(resolveFlipShortcut(ev, true), null);
    }
  });
  test("only exactly true counts as 'lookup open' (truthy values do not)", () => {
    const ev = keyEvent({ key: "2", code: "Digit2" });
    assert.equal(resolveFlipShortcut(ev, false), FLIP_SHORTCUT_MASTERED);
    assert.equal(resolveFlipShortcut(ev, undefined), FLIP_SHORTCUT_MASTERED);
    assert.equal(resolveFlipShortcut(ev, "yes"), FLIP_SHORTCUT_MASTERED);
    assert.equal(resolveFlipShortcut(ev, 1), FLIP_SHORTCUT_MASTERED);
  });

  test("typing in an input or textarea is ignored (any case of tagName)", () => {
    assert.equal(resolveFlipShortcut(keyEvent({ key: "1", tagName: "INPUT" })), null);
    assert.equal(resolveFlipShortcut(keyEvent({ code: "Space", tagName: "TEXTAREA" })), null);
    assert.equal(resolveFlipShortcut(keyEvent({ key: "2", tagName: "input" })), null);
  });
  test("other elements (button, body, div) still trigger shortcuts", () => {
    assert.equal(resolveFlipShortcut(keyEvent({ key: "1", tagName: "BUTTON" })), FLIP_SHORTCUT_FORGOT);
    assert.equal(resolveFlipShortcut(keyEvent({ key: "2", tagName: "DIV" })), FLIP_SHORTCUT_MASTERED);
  });
  test("missing target or non-string tagName does not throw", () => {
    assert.equal(resolveFlipShortcut({ key: "1" }), FLIP_SHORTCUT_FORGOT);
    assert.equal(resolveFlipShortcut({ key: "2", target: null }), FLIP_SHORTCUT_MASTERED);
    assert.equal(resolveFlipShortcut({ code: "Space", target: { tagName: 42 } }), FLIP_SHORTCUT_TOGGLE);
  });

  test("unrelated keys return null", () => {
    for (const key of ["3", "0", "a", "Enter", "Escape", "ArrowRight", ""]) {
      assert.equal(resolveFlipShortcut(keyEvent({ key, code: key })), null);
    }
  });
  test("space detected by code only, not by key value", () => {
    assert.equal(resolveFlipShortcut(keyEvent({ key: " ", code: "" })), null);
  });

  test("bad input (undefined, null, string, number) returns null", () => {
    assert.equal(resolveFlipShortcut(undefined), null);
    assert.equal(resolveFlipShortcut(null), null);
    assert.equal(resolveFlipShortcut("1"), null);
    assert.equal(resolveFlipShortcut(2), null);
  });
});
