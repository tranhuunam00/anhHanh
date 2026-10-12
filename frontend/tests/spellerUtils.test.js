import test, { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  normalizeSpellerWord,
  checkSpellerAnswer,
  getNextSpellerHint,
  getSpellerLetterSlots,
} from "../src/utils/spellerUtils.js";

describe("spellerUtils Unit Tests", () => {
  describe("normalizeSpellerWord", () => {
    it("handles null, undefined, empty, and non-string inputs safely", () => {
      assert.equal(normalizeSpellerWord(null), "");
      assert.equal(normalizeSpellerWord(undefined), "");
      assert.equal(normalizeSpellerWord(""), "");
      assert.equal(normalizeSpellerWord(123), "");
    });

    it("lowercases, trims, and collapses multiple whitespace", () => {
      assert.equal(normalizeSpellerWord("  Pillars  "), "pillars");
      assert.equal(normalizeSpellerWord("TAKE   CARE   OF"), "take care of");
      assert.equal(normalizeSpellerWord("Hello\t\nWorld"), "hello world");
    });
  });

  describe("checkSpellerAnswer", () => {
    it("returns true for exact match, case-insensitively and with outer whitespace", () => {
      assert.equal(checkSpellerAnswer("pillars", "pillars"), true);
      assert.equal(checkSpellerAnswer("Pillars", "pillars"), true);
      assert.equal(checkSpellerAnswer("  pillars  ", "PILLARS"), true);
      assert.equal(checkSpellerAnswer("Take Care Of", "take care of"), true);
    });

    it("returns false for typos, partial words, or different words", () => {
      assert.equal(checkSpellerAnswer("pillar", "pillars"), false);
      assert.equal(checkSpellerAnswer("pilar", "pillars"), false);
      assert.equal(checkSpellerAnswer("column", "pillars"), false);
    });

    it("handles empty or null inputs safely by returning false", () => {
      assert.equal(checkSpellerAnswer("", "pillars"), false);
      assert.equal(checkSpellerAnswer(null, "pillars"), false);
      assert.equal(checkSpellerAnswer("pillars", null), false);
      assert.equal(checkSpellerAnswer(undefined, undefined), false);
    });
  });

  describe("getNextSpellerHint", () => {
    it("handles empty and invalid inputs gracefully", () => {
      assert.equal(getNextSpellerHint(null, ""), "");
      assert.equal(getNextSpellerHint("", ""), "");
      assert.equal(getNextSpellerHint(123, ""), "");
    });

    it("reveals first letter when input is empty", () => {
      assert.equal(getNextSpellerHint("pillars", ""), "p");
      assert.equal(getNextSpellerHint("Education", ""), "E");
    });

    it("progressively adds the next character when prefix matches", () => {
      assert.equal(getNextSpellerHint("pillars", "p"), "pi");
      assert.equal(getNextSpellerHint("pillars", "pi"), "pil");
      assert.equal(getNextSpellerHint("pillars", "pil"), "pill");
    });

    it("corrects diverging input by returning the valid prefix plus next char", () => {
      // If user typed 'piz' instead of 'pil', it matches 'pi', so next hint is 'pil'
      assert.equal(getNextSpellerHint("pillars", "piz"), "pil");
    });

    it("returns entire word when already fully matched", () => {
      assert.equal(getNextSpellerHint("pillars", "pillars"), "pillars");
    });
  });

  describe("getSpellerLetterSlots", () => {
    it("returns empty array for invalid target word", () => {
      assert.deepEqual(getSpellerLetterSlots(null), []);
      assert.deepEqual(getSpellerLetterSlots(""), []);
    });

    it("marks slots as revealed based on matching input characters", () => {
      const slots = getSpellerLetterSlots("cat", "c");
      assert.equal(slots.length, 3);
      assert.equal(slots[0].char, "c");
      assert.equal(slots[0].isRevealed, true);
      assert.equal(slots[1].char, "a");
      assert.equal(slots[1].isRevealed, false);
      assert.equal(slots[2].char, "t");
      assert.equal(slots[2].isRevealed, false);
    });

    it("marks spaces and hyphens as revealed automatically", () => {
      const slots = getSpellerLetterSlots("ice-cream", "");
      assert.equal(slots.length, 9);
      const hyphenSlot = slots.find((s) => s.char === "-");
      assert.ok(hyphenSlot);
      assert.equal(hyphenSlot.isRevealed, true);
      assert.equal(hyphenSlot.isSpace, true);
    });
  });
});
