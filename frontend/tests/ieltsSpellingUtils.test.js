import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  cleanTextSymbols,
  getHyphenVariations,
  getSpellingVariations,
  getNumberVariations,
  UK_US_SPELLING_MAP,
  WORD_TO_NUMBER_MAP
} from "../src/utils/ieltsSpellingUtils.js";

describe("ieltsSpellingUtils - cleanTextSymbols", () => {
  test("happy path: removes thousands comma from numbers", () => {
    assert.equal(cleanTextSymbols("1,000"), "1000");
    assert.equal(cleanTextSymbols("1,000 kg"), "1000 kg");
    assert.equal(cleanTextSymbols("25,500 words"), "25500 words");
  });

  test("input coverage: handles null, undefined, empty, and regular text", () => {
    assert.equal(cleanTextSymbols(null), "");
    assert.equal(cleanTextSymbols(undefined), "");
    assert.equal(cleanTextSymbols(""), "");
    assert.equal(cleanTextSymbols("hello, world"), "hello, world"); // comma followed by space is preserved
  });
});

describe("ieltsSpellingUtils - getHyphenVariations", () => {
  test("happy path: generates hyphenated, spaced, and merged variations", () => {
    const res = getHyphenVariations("ice-cream");
    assert.ok(res.includes("ice-cream"));
    assert.ok(res.includes("ice cream"));
    assert.ok(res.includes("icecream"));
  });

  test("spaced phrase variation: generates hyphenated equivalent", () => {
    const res = getHyphenVariations("well being");
    assert.ok(res.includes("well being"));
    assert.ok(res.includes("well-being"));
  });

  test("boundary & bad inputs: handles empty and null gracefully", () => {
    assert.deepEqual(getHyphenVariations(""), [""]);
    assert.deepEqual(getHyphenVariations(null), [""]);
  });
});

describe("ieltsSpellingUtils - getSpellingVariations", () => {
  test("happy path: generates UK and US spelling alternates", () => {
    const res1 = getSpellingVariations("flavour");
    assert.ok(res1.includes("flavour"));
    assert.ok(res1.includes("flavor"));

    const res2 = getSpellingVariations("theater");
    assert.ok(res2.includes("theater"));
    assert.ok(res2.includes("theatre"));

    const res3 = getSpellingVariations("organise a programme");
    assert.ok(res3.includes("organise a programme"));
    assert.ok(res3.includes("organize a programme") || res3.includes("organize a program"));
  });

  test("unaffected words: returns single original variation", () => {
    assert.deepEqual(getSpellingVariations("apple"), ["apple"]);
  });

  test("boundary & bad inputs: handles null and empty text", () => {
    assert.deepEqual(getSpellingVariations(""), [""]);
    assert.deepEqual(getSpellingVariations(null), [""]);
  });
});

describe("ieltsSpellingUtils - getNumberVariations", () => {
  test("happy path: converts number words to digits and digits to words", () => {
    const fromWord = getNumberVariations("ten");
    assert.ok(fromWord.includes("ten"));
    assert.ok(fromWord.includes("10"));

    const fromDigit = getNumberVariations("10");
    assert.ok(fromDigit.includes("10"));
    assert.ok(fromDigit.includes("ten"));

    const ordinal = getNumberVariations("first");
    assert.ok(ordinal.includes("1st"));
  });

  test("boundary & bad inputs: non-numeric words and empty strings", () => {
    assert.deepEqual(getNumberVariations("banana"), ["banana"]);
    assert.deepEqual(getNumberVariations(""), [""]);
    assert.deepEqual(getNumberVariations(null), [""]);
  });
});

describe("ieltsSpellingUtils - dictionaries sanity check", () => {
  test("UK_US_SPELLING_MAP is non-empty and bidirectional", () => {
    assert.ok(Object.keys(UK_US_SPELLING_MAP).length > 20);
    assert.equal(UK_US_SPELLING_MAP.colour, "color");
    assert.equal(UK_US_SPELLING_MAP.color, "colour");
  });

  test("WORD_TO_NUMBER_MAP contains essential numbers", () => {
    assert.equal(WORD_TO_NUMBER_MAP.one, "1");
    assert.equal(WORD_TO_NUMBER_MAP.hundred, "100");
  });
});

