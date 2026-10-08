import test, { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  sanitizePastedHtml,
  getWordVariants,
  splitTextIntoSentences,
  formatTime,
} from "../src/utils/readerUtils.js";

describe("readerUtils Unit Tests", () => {
  describe("formatTime", () => {
    it("handles happy path seconds formatting", () => {
      assert.equal(formatTime(0), "00:00");
      assert.equal(formatTime(5), "00:05");
      assert.equal(formatTime(65), "01:05");
      assert.equal(formatTime(253), "04:13");
      assert.equal(formatTime(3600), "60:00");
    });

    it("handles boundary and invalid values gracefully", () => {
      assert.equal(formatTime(-10), "00:00");
      assert.equal(formatTime(NaN), "00:00");
      assert.equal(formatTime(null), "00:00");
      assert.equal(formatTime(undefined), "00:00");
    });
  });

  describe("getWordVariants", () => {
    it("generates inflection stems for plural and verb forms", () => {
      const berriesVariants = getWordVariants("berries");
      assert.ok(berriesVariants.includes("berry"));
      assert.ok(berriesVariants.includes("berries"));

      const boxesVariants = getWordVariants("boxes");
      assert.ok(boxesVariants.includes("box"));

      const catsVariants = getWordVariants("cats");
      assert.ok(catsVariants.includes("cat"));

      const walkedVariants = getWordVariants("walked");
      assert.ok(walkedVariants.includes("walk"));

      const runningVariants = getWordVariants("running");
      assert.ok(runningVariants.includes("runn"));

      const quicklyVariants = getWordVariants("quickly");
      assert.ok(quicklyVariants.includes("quick"));
    });

    it("handles short words, boundary cases and bad inputs safely", () => {
      assert.deepEqual(getWordVariants(""), []);
      assert.deepEqual(getWordVariants(null), []);
      assert.deepEqual(getWordVariants(undefined), []);
      assert.deepEqual(getWordVariants(123), []);

      // Short words should not be mangled
      const isVariants = getWordVariants("is");
      assert.deepEqual(isVariants, ["is"]);

      const asVariants = getWordVariants("as");
      assert.deepEqual(asVariants, ["as"]);
    });
  });

  describe("splitTextIntoSentences", () => {
    it("splits standard text on sentence boundaries", () => {
      const text = "Science is the common language. It bridges gaps across nations! Can we unite?";
      const res = splitTextIntoSentences(text);
      assert.equal(res.length, 3);
      assert.equal(res[0], "Science is the common language.");
      assert.equal(res[1], "It bridges gaps across nations!");
      assert.equal(res[2], "Can we unite?");
    });

    it("protects abbreviations and numbers with decimal points", () => {
      const text = "Dr. Smith met with Mr. Brown in the U.S. to discuss 18.5 degrees Celsius.";
      const res = splitTextIntoSentences(text);
      assert.equal(res.length, 1);
      assert.equal(res[0], "Dr. Smith met with Mr. Brown in the U.S. to discuss 18.5 degrees Celsius.");
    });

    it("handles empty, whitespace, and single-sentence inputs", () => {
      assert.deepEqual(splitTextIntoSentences(""), []);
      assert.deepEqual(splitTextIntoSentences("   "), []);
      assert.deepEqual(splitTextIntoSentences(null), []);
      assert.deepEqual(splitTextIntoSentences(undefined), []);

      const single = "This is a single sentence without terminal dot";
      assert.deepEqual(splitTextIntoSentences(single), [single]);
    });
  });

  describe("sanitizePastedHtml", () => {
    it("strips script tags and handles empty or non-string inputs", () => {
      assert.equal(sanitizePastedHtml(""), "");
      assert.equal(sanitizePastedHtml(null), "");
      assert.equal(sanitizePastedHtml(undefined), "");

      const dirty = "<p>Hello world</p><script>alert('xss')</script>";
      const clean = sanitizePastedHtml(dirty);
      assert.ok(!clean.includes("<script>"));
      assert.ok(clean.includes("<p>Hello world</p>"));
    });
  });
});
