import test from "node:test";
import assert from "node:assert/strict";
import {
  SHADOWING_STATUS,
  normalizeShadowingToken,
  computeLevenshteinDistance,
  computeWordSimilarity,
  getEffectiveShadowingSentence,
  compareShadowingTranscript,
} from "../src/utils/shadowingAudioUtils.js";

test("shadowingAudioUtils - normalizeShadowingToken", async (t) => {
  await t.test("strips punctuation and converts to lowercase", () => {
    assert.strictEqual(normalizeShadowingToken("Hello!"), "hello");
    assert.strictEqual(normalizeShadowingToken("World, ...?"), "world");
    assert.strictEqual(normalizeShadowingToken('"Quoted"'), "quoted");
  });

  await t.test("handles null, empty and invalid types safely", () => {
    assert.strictEqual(normalizeShadowingToken(""), "");
    assert.strictEqual(normalizeShadowingToken(null), "");
    assert.strictEqual(normalizeShadowingToken(123), "");
  });
});

test("shadowingAudioUtils - computeLevenshteinDistance", async (t) => {
  await t.test("calculates distance between strings", () => {
    assert.strictEqual(computeLevenshteinDistance("kitten", "sitting"), 3);
    assert.strictEqual(computeLevenshteinDistance("hello", "hello"), 0);
    assert.strictEqual(computeLevenshteinDistance("", "abc"), 3);
  });
});

test("shadowingAudioUtils - computeWordSimilarity", async (t) => {
  await t.test("returns 1.0 for exact matches", () => {
    assert.strictEqual(computeWordSimilarity("important", "important"), 1.0);
    assert.strictEqual(computeWordSimilarity("Hello!", "hello"), 1.0);
  });

  await t.test("returns high similarity for minor misspellings or speech variants", () => {
    const sim = computeWordSimilarity("develop", "develope");
    assert.ok(sim >= 0.85);
  });

  await t.test("returns 0.0 for completely different words", () => {
    const sim = computeWordSimilarity("cat", "helicopter");
    assert.ok(sim <= 0.2);
  });
});

test("shadowingAudioUtils - getEffectiveShadowingSentence", async (t) => {
  await t.test("extracts english sentence from context sentence", () => {
    const item = {
      word: "success",
      context_sentence: "Hard work is key to success. - Chăm chỉ là chìa khóa.",
    };
    assert.strictEqual(getEffectiveShadowingSentence(item), "Hard work is key to success.");
  });

  await t.test("falls back to word when context is empty", () => {
    const item = { word: "develop", context_sentence: "" };
    assert.strictEqual(getEffectiveShadowingSentence(item), "The word is develop.");
  });

  await t.test("handles null item safely", () => {
    assert.strictEqual(getEffectiveShadowingSentence(null), "");
  });
});

test("shadowingAudioUtils - compareShadowingTranscript", async (t) => {
  await t.test("perfect match: returns 100% accuracy and 3 stars", () => {
    const ref = "Hard work leads to success";
    const spoken = "Hard work leads to success";
    const res = compareShadowingTranscript(ref, spoken);

    assert.strictEqual(res.accuracyScore, 100);
    assert.strictEqual(res.isPassed, true);
    assert.strictEqual(res.stars, 3);
    assert.ok(res.alignedTokens.every((t) => t.status === SHADOWING_STATUS.EXACT));
  });

  await t.test("partial match: marks missed words correctly", () => {
    const ref = "Hard work leads to great success";
    const spoken = "Hard work success";
    const res = compareShadowingTranscript(ref, spoken);

    assert.ok(res.accuracyScore < 100 && res.accuracyScore > 0);
    assert.strictEqual(res.alignedTokens[0].status, SHADOWING_STATUS.EXACT); // Hard
    assert.strictEqual(res.alignedTokens[1].status, SHADOWING_STATUS.EXACT); // work
  });

  await t.test("empty spoken text: returns 0% score and all missed tokens", () => {
    const ref = "Practice makes perfect";
    const res = compareShadowingTranscript(ref, "");

    assert.strictEqual(res.accuracyScore, 0);
    assert.strictEqual(res.isPassed, false);
    assert.strictEqual(res.stars, 0);
    assert.strictEqual(res.alignedTokens.length, 3);
    assert.ok(res.alignedTokens.every((t) => t.status === SHADOWING_STATUS.MISSED));
  });

  await t.test("empty reference sentence: handles safely", () => {
    const res = compareShadowingTranscript("", "Hello world");
    assert.strictEqual(res.accuracyScore, 0);
    assert.strictEqual(res.isPassed, false);
  });
});
