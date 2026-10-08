import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { analyzeSentencePhonology } from "../src/utils/phonologyEngine.js";

describe("phonologyEngine - analyzeSentencePhonology input coverage", () => {
  test("handles null, undefined, empty, and non-string inputs", () => {
    assert.deepEqual(analyzeSentencePhonology(null), { phenomena: [], tokens: [] });
    assert.deepEqual(analyzeSentencePhonology(undefined), { phenomena: [], tokens: [] });
    assert.deepEqual(analyzeSentencePhonology(""), { phenomena: [], tokens: [] });
    assert.deepEqual(analyzeSentencePhonology(12345), { phenomena: [], tokens: [] });
    assert.deepEqual(analyzeSentencePhonology("   ...   "), { phenomena: [], tokens: [] });
  });

  test("handles single word without phenomena", () => {
    const res = analyzeSentencePhonology("Hello");
    assert.equal(res.tokens.length, 1);
    assert.equal(res.phenomena.length, 0);
  });
});

describe("phonologyEngine - Connected speech phenomena detection", () => {
  test("detects Coalescent Assimilation for /t/ + you", () => {
    const res = analyzeSentencePhonology("Nice to meet you");
    const assimilation = res.phenomena.find((p) => p.type === "ASSIMILATION");
    assert.ok(assimilation, "Should detect assimilation in 'meet you'");
    assert.equal(assimilation.pair, "meet you");
    assert.equal(assimilation.symbol, "⚡");
  });

  test("detects Coalescent Assimilation for /d/ + you", () => {
    const res = analyzeSentencePhonology("Would you help me?");
    const assimilation = res.phenomena.find((p) => p.type === "ASSIMILATION");
    assert.ok(assimilation, "Should detect assimilation in 'Would you'");
    assert.equal(assimilation.pair, "Would you");
  });

  test("detects Elision of t/d between consonants", () => {
    const res = analyzeSentencePhonology("last night was cold");
    const elision = res.phenomena.find((p) => p.type === "ELISION");
    assert.ok(elision, "Should detect elision in 'last night'");
    assert.equal(elision.pair, "last night");
    assert.equal(elision.symbol, "✕");
  });

  test("detects Consonant to Vowel Linking", () => {
    const res = analyzeSentencePhonology("pick up the book");
    const linking = res.phenomena.find((p) => p.type === "LINKING");
    assert.ok(linking, "Should detect linking in 'pick up'");
    assert.equal(linking.pair, "pick up");
    assert.equal(linking.symbol, "‿");
  });

  test("detects weak forms for grammatical function words", () => {
    const res = analyzeSentencePhonology("I want to go for a walk");
    const toToken = res.tokens.find((t) => t.word === "to");
    assert.ok(toToken);
    assert.equal(toToken.weakForm, "/tə/");

    const forToken = res.tokens.find((t) => t.word === "for");
    assert.ok(forToken);
    assert.equal(forToken.weakForm, "/fər/");
  });
});
