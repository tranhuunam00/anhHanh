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
