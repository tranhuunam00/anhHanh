import test from "node:test";
import assert from "node:assert/strict";
import {
  clamp,
  normalizeHotspotCoords,
  calculateDistancePercent,
  isPointNearHotspot,
  shuffleArray,
  generateSpotChallengeList,
  generateDistractorOptions,
  filterItemsByQuery,
  calculateCompletionRate,
  isSpellingMatch,
  getZoomTransformStyle,
} from "../src/utils/visualVocabUtils.js";

test("clamp - limits values correctly and handles bad inputs", () => {
  assert.equal(clamp(50, 0, 100), 50);
  assert.equal(clamp(-10, 0, 100), 0);
  assert.equal(clamp(150, 0, 100), 100);
  assert.equal(clamp(NaN, 0, 100), 0);
  assert.equal(clamp("abc", 0, 100), 0);
  assert.equal(clamp(null, 10, 20), 10);
});

test("normalizeHotspotCoords - normalizes values to 0-100 range", () => {
  assert.deepEqual(normalizeHotspotCoords(25.5, 80.2), { x: 25.5, y: 80.2 });
  assert.deepEqual(normalizeHotspotCoords(-5, 120), { x: 0, y: 100 });
  assert.deepEqual(normalizeHotspotCoords("30", "40"), { x: 30, y: 40 });
  assert.deepEqual(normalizeHotspotCoords(null, undefined), { x: 0, y: 0 });
});

test("calculateDistancePercent - calculates Euclidean distance in percent", () => {
  const dist = calculateDistancePercent(0, 0, 3, 4);
  assert.equal(dist, 5);

  const zeroDist = calculateDistancePercent(50, 50, 50, 50);
  assert.equal(zeroDist, 0);

  const stringCoords = calculateDistancePercent("0", "0", "6", "8");
  assert.equal(stringCoords, 10);
});

test("isPointNearHotspot - detects proximity within tolerance radius", () => {
  // Near enough
  assert.equal(isPointNearHotspot(50, 50, 52, 53, 5.0), true);
  // Exactly on point
  assert.equal(isPointNearHotspot(10, 20, 10, 20, 2.0), true);
  // Too far
  assert.equal(isPointNearHotspot(10, 10, 80, 80, 5.0), false);
  // Missing inputs fallback safely to false
  assert.equal(isPointNearHotspot(null, 50, 50, 50), false);
  assert.equal(isPointNearHotspot(50, undefined, 50, 50), false);
});

test("shuffleArray - immutably shuffles arrays and handles bad inputs", () => {
  const input = [1, 2, 3, 4, 5];
  const result = shuffleArray(input);
  assert.equal(result.length, 5);
  // Original array is untouched
  assert.deepEqual(input, [1, 2, 3, 4, 5]);
  // Bad inputs
  assert.deepEqual(shuffleArray(null), []);
  assert.deepEqual(shuffleArray(undefined), []);
  assert.deepEqual(shuffleArray([]), []);
});

test("generateSpotChallengeList - generates questions with limits", () => {
  const mockItems = [
    { id: "a", word: "apple" },
    { id: "b", word: "banana" },
    { id: "c", word: "cherry" },
    { id: "d", word: "date" },
  ];

  const full = generateSpotChallengeList(mockItems);
  assert.equal(full.length, 4);

  const limited = generateSpotChallengeList(mockItems, 2);
  assert.equal(limited.length, 2);

  // Edge cases
  assert.deepEqual(generateSpotChallengeList([]), []);
  assert.deepEqual(generateSpotChallengeList(null), []);
});

test("generateDistractorOptions - creates options containing target item", () => {
  const mockItems = [
    { id: "1", word: "peak" },
    { id: "2", word: "valley" },
    { id: "3", word: "ridge" },
    { id: "4", word: "glacier" },
    { id: "5", word: "slope" },
  ];

  const target = mockItems[0];
  const options = generateDistractorOptions(target, mockItems, 4);
  assert.equal(options.length, 4);
  assert.ok(options.some((opt) => opt.id === "1"));

  // Empty or invalid input
  assert.deepEqual(generateDistractorOptions(null, mockItems), []);
  assert.deepEqual(generateDistractorOptions(target, []), [target]);
});

test("filterItemsByQuery - matches words, meanings and IPA", () => {
  const items = [
    { id: "1", word: "glacier", ipa: "/ˈɡlæsiər/", meaning: "Sông băng" },
    { id: "2", word: "peak", ipa: "/piːk/", meaning: "Đỉnh núi" },
    { id: "3", word: "valley", ipa: "/ˈvæli/", meaning: "Thung lũng" },
  ];

  // Match English word
  const matchWord = filterItemsByQuery(items, "glac");
  assert.equal(matchWord.length, 1);
  assert.equal(matchWord[0].id, "1");

  // Match Vietnamese meaning
  const matchMeaning = filterItemsByQuery(items, "núi");
  assert.equal(matchMeaning.length, 1);
  assert.equal(matchMeaning[0].id, "2");

  // Match IPA
  const matchIpa = filterItemsByQuery(items, "væli");
  assert.equal(matchIpa.length, 1);
  assert.equal(matchIpa[0].id, "3");

  // Empty query returns all
  assert.equal(filterItemsByQuery(items, "").length, 3);
  assert.equal(filterItemsByQuery(items, "   ").length, 3);

  // Bad inputs
  assert.deepEqual(filterItemsByQuery(null, "test"), []);
});

test("calculateCompletionRate - calculates accurate percentage", () => {
  assert.equal(calculateCompletionRate(["a", "b"], 4), 50);
  assert.equal(calculateCompletionRate(new Set(["a", "b", "c"]), 3), 100);
  assert.equal(calculateCompletionRate([], 10), 0);
  assert.equal(calculateCompletionRate(["a"], 0), 0);
  assert.equal(calculateCompletionRate(null, 5), 0);
});

test("isSpellingMatch - normalizes casing, hyphens, and whitespace", () => {
  assert.equal(isSpellingMatch("peak", "Peak"), true);
  assert.equal(isSpellingMatch("  clock tower  ", "clock tower"), true);
  assert.equal(isSpellingMatch("lecture-hall", "lecture hall"), true);
  assert.equal(isSpellingMatch("auditorium", "library"), false);
  assert.equal(isSpellingMatch("", "peak"), false);
  assert.equal(isSpellingMatch(null, "peak"), false);
  assert.equal(isSpellingMatch("peak", undefined), false);
});

test("getZoomTransformStyle - outputs proper CSS transform strings", () => {
  const style1 = getZoomTransformStyle(1.5, 20, -10);
  assert.equal(style1.transform, "translate(20px, -10px) scale(1.5)");
  assert.equal(style1.transformOrigin, "center center");

  // Clamps scale boundaries
  const styleClamped = getZoomTransformStyle(10, 0, 0);
  assert.equal(styleClamped.transform, "translate(0px, 0px) scale(4)");

  const styleMin = getZoomTransformStyle(0.1, 0, 0);
  assert.equal(styleMin.transform, "translate(0px, 0px) scale(0.5)");

  // Handles bad inputs
  const styleBad = getZoomTransformStyle("invalid", null, undefined);
  assert.equal(styleBad.transform, "translate(0px, 0px) scale(1)");
});
