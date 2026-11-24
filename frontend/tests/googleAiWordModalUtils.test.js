import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { cleanGoogleAiWord, shouldShowGoogleAiModal } from "../src/utils/googleAiWordModalUtils.js";

describe("cleanGoogleAiWord", () => {
  test("returns plain word unchanged (happy path)", () => {
    assert.equal(cleanGoogleAiWord("burial ground"), "burial ground");
  });
  test("trims whitespace and edge punctuation", () => {
    assert.equal(cleanGoogleAiWord('  "excavated," '), "excavated");
    assert.equal(cleanGoogleAiWord("’curiosity.’"), "curiosity");
  });
  test("keeps inner punctuation", () => {
    assert.equal(cleanGoogleAiWord("well-known"), "well-known");
    assert.equal(cleanGoogleAiWord("Hawkins'"), "Hawkins");
  });
  test("empty / whitespace / punctuation-only become empty string", () => {
    assert.equal(cleanGoogleAiWord(""), "");
    assert.equal(cleanGoogleAiWord("   "), "");
    assert.equal(cleanGoogleAiWord("?!..."), "");
  });
  test("non-string inputs return empty string", () => {
    assert.equal(cleanGoogleAiWord(null), "");
    assert.equal(cleanGoogleAiWord(undefined), "");
    assert.equal(cleanGoogleAiWord(42), "");
    assert.equal(cleanGoogleAiWord({ word: "x" }), "");
  });
});

describe("shouldShowGoogleAiModal", () => {
  test("open with a word shows the modal", () => {
    assert.equal(shouldShowGoogleAiModal(true, "monument"), true);
  });
  test("closed never shows, even with a word (regression: modal stuck open)", () => {
    assert.equal(shouldShowGoogleAiModal(false, "monument"), false);
  });
  test("open but no word does not show (regression: empty loading modal on tab load)", () => {
    assert.equal(shouldShowGoogleAiModal(true, null), false);
    assert.equal(shouldShowGoogleAiModal(true, ""), false);
    assert.equal(shouldShowGoogleAiModal(true, "  ,. "), false);
  });
  test("non-boolean truthy isOpen is not treated as open", () => {
    assert.equal(shouldShowGoogleAiModal("true", "word"), false);
    assert.equal(shouldShowGoogleAiModal(1, "word"), false);
    assert.equal(shouldShowGoogleAiModal(undefined, "word"), false);
  });
  test("returns a boolean", () => {
    assert.equal(typeof shouldShowGoogleAiModal(true, "a"), "boolean");
  });
});

import {
  buildGooglePopupFeatures,
  openGoogleSidePopup,
  GOOGLE_POPUP_NAME,
  GOOGLE_POPUP_MIN_SCREEN_WIDTH,
} from "../src/utils/googleAiWordModalUtils.js";

describe("buildGooglePopupFeatures", () => {
  test("docks a 42%-wide popup on the right edge (happy path)", () => {
    const f = buildGooglePopupFeatures({ availWidth: 1600, availHeight: 900, availLeft: 0, availTop: 0 });
    assert.equal(f, "popup=yes,width=672,height=900,left=928,top=0");
  });
  test("clamps width to [480, 720]", () => {
    assert.match(buildGooglePopupFeatures({ availWidth: 1000, availHeight: 800 }), /width=480,/);
    assert.match(buildGooglePopupFeatures({ availWidth: 3000, availHeight: 800 }), /width=720,.*left=2280/);
  });
  test("respects multi-monitor offsets", () => {
    const f = buildGooglePopupFeatures({ availWidth: 1920, availHeight: 1040, availLeft: 1920, availTop: 40 });
    assert.equal(f, "popup=yes,width=720,height=1040,left=3120,top=40");
  });
  test("boundary: exactly min width allowed, one below is not", () => {
    assert.notEqual(buildGooglePopupFeatures({ availWidth: GOOGLE_POPUP_MIN_SCREEN_WIDTH, availHeight: 700 }), null);
    assert.equal(buildGooglePopupFeatures({ availWidth: GOOGLE_POPUP_MIN_SCREEN_WIDTH - 1, availHeight: 700 }), null);
  });
  test("phone-sized screen returns null", () => {
    assert.equal(buildGooglePopupFeatures({ availWidth: 393, availHeight: 852 }), null);
  });
  test("bad input returns null", () => {
    assert.equal(buildGooglePopupFeatures(null), null);
    assert.equal(buildGooglePopupFeatures(undefined), null);
    assert.equal(buildGooglePopupFeatures({}), null);
    assert.equal(buildGooglePopupFeatures({ availWidth: "abc", availHeight: 800 }), null);
    assert.equal(buildGooglePopupFeatures({ availWidth: 1600, availHeight: 0 }), null);
  });
  test("non-numeric offsets fall back to 0", () => {
    assert.match(buildGooglePopupFeatures({ availWidth: 1600, availHeight: 900, availLeft: "x", availTop: null }), /left=928,top=0$/);
  });
});

describe("openGoogleSidePopup", () => {
  const desktop = { availWidth: 1600, availHeight: 900 };
  const makeWin = (screen, openImpl) => {
    const calls = [];
    return { calls, screen, open: (...args) => { calls.push(args); return openImpl ? openImpl(...args) : { focus() {} }; } };
  };

  test("opens the named, reusable popup on desktop and returns true", () => {
    let focused = false;
    const win = makeWin(desktop, () => ({ focus() { focused = true; } }));
    assert.equal(openGoogleSidePopup("https://www.google.com/search?q=x", win), true);
    assert.equal(win.calls.length, 1);
    assert.equal(win.calls[0][1], GOOGLE_POPUP_NAME);
    assert.match(win.calls[0][2], /^popup=yes/);
    assert.equal(focused, true);
  });
  test("phone screen: does not call open, returns false (link falls back to new tab)", () => {
    const win = makeWin({ availWidth: 393, availHeight: 852 });
    assert.equal(openGoogleSidePopup("https://g", win), false);
    assert.equal(win.calls.length, 0);
  });
  test("popup blocked (open returns null) returns false", () => {
    assert.equal(openGoogleSidePopup("https://g", makeWin(desktop, () => null)), false);
  });
  test("open throwing returns false", () => {
    assert.equal(openGoogleSidePopup("https://g", makeWin(desktop, () => { throw new Error("blocked"); })), false);
  });
  test("popup without focus method still returns true", () => {
    assert.equal(openGoogleSidePopup("https://g", makeWin(desktop, () => ({}))), true);
  });
  test("bad url / window inputs return false", () => {
    assert.equal(openGoogleSidePopup("", makeWin(desktop)), false);
    assert.equal(openGoogleSidePopup(null, makeWin(desktop)), false);
    assert.equal(openGoogleSidePopup(42, makeWin(desktop)), false);
    assert.equal(openGoogleSidePopup("https://g", null), false);
    assert.equal(openGoogleSidePopup("https://g", { screen: desktop }), false);
  });
});
