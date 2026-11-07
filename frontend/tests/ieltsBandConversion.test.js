import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  roundToIeltsBand,
  getListeningBandScore,
  getReadingBandScore,
  calculateWritingBandScore,
  calculateOverallIeltsBand
} from "../src/utils/ieltsBandConversion.js";

describe("ieltsBandConversion - roundToIeltsBand (Official IELTS Rounding)", () => {
  test("happy path: standard whole and half bands", () => {
    assert.equal(roundToIeltsBand(6.0), 6.0);
    assert.equal(roundToIeltsBand(6.5), 6.5);
    assert.equal(roundToIeltsBand(7.0), 7.0);
  });

  test("official rule: fractional parts ending in .125, .25, .375, .625, .75, .875", () => {
    // .125 rounds down to .0
    assert.equal(roundToIeltsBand(6.125), 6.0);
    // .25 rounds up to .5
    assert.equal(roundToIeltsBand(6.25), 6.5);
    // .375 rounds up to .5
    assert.equal(roundToIeltsBand(6.375), 6.5);
    // .5 stays .5
    assert.equal(roundToIeltsBand(6.5), 6.5);
    // .625 rounds down to .5
    assert.equal(roundToIeltsBand(6.625), 6.5);
    // .75 rounds up to next whole band
    assert.equal(roundToIeltsBand(6.75), 7.0);
    // .875 rounds up to next whole band
    assert.equal(roundToIeltsBand(6.875), 7.0);
  });

  test("boundary cases: min 1.0, max 9.0, negative numbers", () => {
    assert.equal(roundToIeltsBand(0), 1.0);
    assert.equal(roundToIeltsBand(-2.5), 1.0);
    assert.equal(roundToIeltsBand(9.5), 9.0);
    assert.equal(roundToIeltsBand(10.0), 9.0);
  });

  test("bad inputs: handles null, undefined, NaN, and non-numeric strings", () => {
    assert.equal(roundToIeltsBand(null), 1.0);
    assert.equal(roundToIeltsBand(undefined), 1.0);
    assert.equal(roundToIeltsBand(NaN), 1.0);
    assert.equal(roundToIeltsBand("invalid"), 1.0);
  });
});

describe("ieltsBandConversion - getListeningBandScore (Academic & General Listening)", () => {
  test("happy path: all major band score thresholds", () => {
    assert.equal(getListeningBandScore(40), 9.0);
    assert.equal(getListeningBandScore(39), 9.0);
    assert.equal(getListeningBandScore(38), 8.5);
    assert.equal(getListeningBandScore(37), 8.5);
    assert.equal(getListeningBandScore(36), 8.0);
    assert.equal(getListeningBandScore(35), 8.0);
    assert.equal(getListeningBandScore(34), 7.5);
    assert.equal(getListeningBandScore(32), 7.5);
    assert.equal(getListeningBandScore(31), 7.0);
    assert.equal(getListeningBandScore(30), 7.0);
    assert.equal(getListeningBandScore(29), 6.5);
    assert.equal(getListeningBandScore(26), 6.5);
    assert.equal(getListeningBandScore(25), 6.0);
    assert.equal(getListeningBandScore(23), 6.0);
    assert.equal(getListeningBandScore(22), 5.5);
    assert.equal(getListeningBandScore(18), 5.5);
    assert.equal(getListeningBandScore(17), 5.0);
    assert.equal(getListeningBandScore(16), 5.0);
    assert.equal(getListeningBandScore(15), 4.5);
    assert.equal(getListeningBandScore(13), 4.5);
    assert.equal(getListeningBandScore(12), 4.0);
    assert.equal(getListeningBandScore(10), 4.0);
    assert.equal(getListeningBandScore(9), 3.5);
    assert.equal(getListeningBandScore(8), 3.5);
    assert.equal(getListeningBandScore(7), 3.0);
    assert.equal(getListeningBandScore(6), 3.0);
    assert.equal(getListeningBandScore(5), 2.5);
    assert.equal(getListeningBandScore(4), 2.5);
    assert.equal(getListeningBandScore(3), 2.0);
    assert.equal(getListeningBandScore(1), 2.0);
    assert.equal(getListeningBandScore(0), 1.0);
  });

  test("boundary & bad inputs: clamps values correctly", () => {
    assert.equal(getListeningBandScore(-5), 1.0);
    assert.equal(getListeningBandScore(55), 9.0);
    assert.equal(getListeningBandScore("30"), 7.0);
    assert.equal(getListeningBandScore(null), 1.0);
  });
});

describe("ieltsBandConversion - getReadingBandScore (Academic Reading)", () => {
  test("happy path: all major band score thresholds for Academic Reading", () => {
    assert.equal(getReadingBandScore(40), 9.0);
    assert.equal(getReadingBandScore(39), 9.0);
    assert.equal(getReadingBandScore(38), 8.5);
    assert.equal(getReadingBandScore(37), 8.5);
    assert.equal(getReadingBandScore(36), 8.0);
    assert.equal(getReadingBandScore(35), 8.0);
    assert.equal(getReadingBandScore(34), 7.5);
    assert.equal(getReadingBandScore(33), 7.5);
    assert.equal(getReadingBandScore(32), 7.0);
    assert.equal(getReadingBandScore(30), 7.0);
    assert.equal(getReadingBandScore(29), 6.5);
    assert.equal(getReadingBandScore(27), 6.5);
    assert.equal(getReadingBandScore(26), 6.0);
    assert.equal(getReadingBandScore(23), 6.0);
    assert.equal(getReadingBandScore(22), 5.5);
    assert.equal(getReadingBandScore(19), 5.5);
    assert.equal(getReadingBandScore(18), 5.0);
    assert.equal(getReadingBandScore(15), 5.0);
    assert.equal(getReadingBandScore(14), 4.5);
    assert.equal(getReadingBandScore(13), 4.5);
    assert.equal(getReadingBandScore(12), 4.0);
    assert.equal(getReadingBandScore(10), 4.0);
    assert.equal(getReadingBandScore(9), 3.5);
    assert.equal(getReadingBandScore(8), 3.5);
    assert.equal(getReadingBandScore(7), 3.0);
    assert.equal(getReadingBandScore(6), 3.0);
    assert.equal(getReadingBandScore(5), 2.5);
    assert.equal(getReadingBandScore(4), 2.5);
    assert.equal(getReadingBandScore(3), 2.0);
    assert.equal(getReadingBandScore(1), 2.0);
    assert.equal(getReadingBandScore(0), 1.0);
  });
});

describe("ieltsBandConversion - calculateWritingBandScore (Task 1: 1/3 + Task 2: 2/3)", () => {
  test("happy path: weighted formula calculation and rounding", () => {
    // (6.0 + 2*7.0) / 3 = 20 / 3 = 6.666... -> rounds to 6.5
    assert.equal(calculateWritingBandScore(6.0, 7.0), 6.5);
    // (6.5 + 2*7.0) / 3 = 20.5 / 3 = 6.833... -> rounds to 7.0
    assert.equal(calculateWritingBandScore(6.5, 7.0), 7.0);
    // (7.0 + 2*6.0) / 3 = 19 / 3 = 6.333... -> rounds to 6.5
    assert.equal(calculateWritingBandScore(7.0, 6.0), 6.5);
    // Both 7.0 -> 7.0
    assert.equal(calculateWritingBandScore(7.0, 7.0), 7.0);
  });

  test("single task fallbacks: when only one task is evaluated", () => {
    assert.equal(calculateWritingBandScore(null, 7.0), 7.0);
    assert.equal(calculateWritingBandScore(6.5, null), 6.5);
    assert.equal(calculateWritingBandScore(0, 7.5), 7.5);
  });

  test("boundary & bad inputs: handles empty or invalid strings", () => {
    assert.equal(calculateWritingBandScore(null, null), 1.0);
    assert.equal(calculateWritingBandScore("abc", "xyz"), 1.0);
    assert.equal(calculateWritingBandScore("6.5", "7.5"), 7.0);
  });
});

describe("ieltsBandConversion - calculateOverallIeltsBand (Multi-Skill Averaging)", () => {
  test("happy path: array of 4 skill scores with official IELTS rounding", () => {
    // [6.5, 6.5, 5.5, 6.0] -> avg = 24.5 / 4 = 6.125 -> 6.0
    assert.equal(calculateOverallIeltsBand([6.5, 6.5, 5.5, 6.0]), 6.0);
    // [6.5, 6.5, 6.0, 6.5] -> avg = 25.5 / 4 = 6.375 -> 6.5
    assert.equal(calculateOverallIeltsBand([6.5, 6.5, 6.0, 6.5]), 6.5);
    // [6.5, 7.0, 6.5, 6.5] -> avg = 26.5 / 4 = 6.625 -> 6.5
    assert.equal(calculateOverallIeltsBand([6.5, 7.0, 6.5, 6.5]), 6.5);
    // [7.0, 7.0, 6.5, 7.0] -> avg = 27.5 / 4 = 6.875 -> 7.0
    assert.equal(calculateOverallIeltsBand([7.0, 7.0, 6.5, 7.0]), 7.0);
  });

  test("object input: accepts { listening, reading, writing, speaking }", () => {
    const scores = {
      listening: 8.0,
      reading: 7.5,
      writing: 6.5,
      speaking: 7.0
    };
    // sum = 29, avg = 7.25 -> rounds up to 7.5
    assert.equal(calculateOverallIeltsBand(scores), 7.5);
  });

  test("partial skills completed: calculates average of completed skills only", () => {
    // Only Listening (7.0) and Reading (8.0) -> avg = 7.5
    assert.equal(calculateOverallIeltsBand([7.0, 8.0]), 7.5);
  });

  test("boundary & bad inputs: empty array, null, undefined", () => {
    assert.equal(calculateOverallIeltsBand([]), 1.0);
    assert.equal(calculateOverallIeltsBand(null), 1.0);
    assert.equal(calculateOverallIeltsBand(undefined), 1.0);
  });
});

