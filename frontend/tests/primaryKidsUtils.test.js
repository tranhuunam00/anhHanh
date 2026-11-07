import test, { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  calculateGameScore,
  getStarRating,
  shuffleArray,
  validateSentenceOrder,
  classifyFoodNoun,
  getAnimalEncouragement,
  formatUnitProgress,
  playEnglishSpeech
} from "../src/utils/primaryKidsUtils.js";

describe("primaryKidsUtils Unit Tests", () => {
  describe("getStarRating", () => {
    it("returns 3 stars for scores 85% and above", () => {
      assert.strictEqual(getStarRating(85), 3);
      assert.strictEqual(getStarRating(100), 3);
      assert.strictEqual(getStarRating(90), 3);
    });

    it("returns 2 stars for scores between 60% and 84%", () => {
      assert.strictEqual(getStarRating(60), 2);
      assert.strictEqual(getStarRating(84), 2);
      assert.strictEqual(getStarRating(75), 2);
    });

    it("returns 1 star for scores between 30% and 59%", () => {
      assert.strictEqual(getStarRating(30), 1);
      assert.strictEqual(getStarRating(59), 1);
      assert.strictEqual(getStarRating(45), 1);
    });

    it("returns 0 stars for scores below 30% or invalid values", () => {
      assert.strictEqual(getStarRating(29), 0);
      assert.strictEqual(getStarRating(0), 0);
      assert.strictEqual(getStarRating(-10), 0);
      assert.strictEqual(getStarRating(null), 0);
      assert.strictEqual(getStarRating(undefined), 0);
      assert.strictEqual(getStarRating("abc"), 0);
    });
  });

  describe("calculateGameScore", () => {
    it("calculates 100% score with 3 stars when all answers are correct", () => {
      const res = calculateGameScore(10, 10, 2);
      assert.strictEqual(res.percent, 100);
      assert.strictEqual(res.stars, 3);
      assert.strictEqual(res.points, 104); // 10*10 + 2*2
      assert.strictEqual(res.passed, true);
    });

    it("calculates partial score and correct pass flag", () => {
      const passRes = calculateGameScore(6, 10, 0);
      assert.strictEqual(passRes.percent, 60);
      assert.strictEqual(passRes.stars, 2);
      assert.strictEqual(passRes.passed, true);

      const failRes = calculateGameScore(5, 10, 0);
      assert.strictEqual(failRes.percent, 50);
      assert.strictEqual(failRes.stars, 1);
      assert.strictEqual(failRes.passed, false);
    });

    it("handles boundary, zero, and invalid inputs gracefully", () => {
      const zero = calculateGameScore(0, 0, 0);
      assert.strictEqual(zero.percent, 0);
      assert.strictEqual(zero.stars, 0);
      assert.strictEqual(zero.points, 0);
      assert.strictEqual(zero.passed, false);

      const excess = calculateGameScore(15, 10, -5);
      assert.strictEqual(excess.percent, 100);
      assert.strictEqual(excess.stars, 3);
      assert.strictEqual(excess.points, 100);
    });
  });

  describe("shuffleArray", () => {
    it("returns a new array preserving all original elements", () => {
      const orig = [1, 2, 3, 4, 5, 6, 7];
      const shuffled = shuffleArray(orig);
      assert.strictEqual(shuffled.length, orig.length);
      assert.deepStrictEqual([...shuffled].sort(), [...orig].sort());
      // Original remains untouched
      assert.deepStrictEqual(orig, [1, 2, 3, 4, 5, 6, 7]);
    });

    it("handles empty array or non-array inputs safely", () => {
      assert.deepStrictEqual(shuffleArray([]), []);
      assert.deepStrictEqual(shuffleArray(null), []);
      assert.deepStrictEqual(shuffleArray(undefined), []);
      assert.deepStrictEqual(shuffleArray("string"), []);
    });
  });

  describe("validateSentenceOrder", () => {
    const target = "She always gets up early.";

    it("returns true for exact matching words array", () => {
      const userWords = ["She", "always", "gets", "up", "early."];
      assert.strictEqual(validateSentenceOrder(userWords, target), true);
    });

    it("is tolerant to trailing punctuation and case difference", () => {
      const userWords = ["she", "always", "gets", "up", "early"];
      assert.strictEqual(validateSentenceOrder(userWords, target), true);
    });

    it("returns false when word order is incorrect", () => {
      const userWords = ["Always", "she", "gets", "up", "early."];
      assert.strictEqual(validateSentenceOrder(userWords, target), false);
    });

    it("handles empty or missing inputs safely", () => {
      assert.strictEqual(validateSentenceOrder([], target), false);
      assert.strictEqual(validateSentenceOrder(null, target), false);
      assert.strictEqual(validateSentenceOrder(["word"], null), false);
      assert.strictEqual(validateSentenceOrder("", ""), false);
    });
  });

  describe("classifyFoodNoun", () => {
    it("correctly identifies countable food nouns", () => {
      const apples = classifyFoodNoun("apples");
      assert.strictEqual(apples.isCountable, true);
      assert.strictEqual(apples.label, "Đếm được (Countable)");
      assert.ok(apples.recommendedQuantifiers.includes("many"));
      assert.ok(apples.recommendedQuantifiers.includes("a few"));

      const banana = classifyFoodNoun("banana");
      assert.strictEqual(banana.isCountable, true);
    });

    it("correctly identifies uncountable food nouns", () => {
      const rice = classifyFoodNoun("rice");
      assert.strictEqual(rice.isCountable, false);
      assert.strictEqual(rice.label, "Không đếm được (Uncountable)");
      assert.ok(rice.recommendedQuantifiers.includes("much"));
      assert.ok(rice.recommendedQuantifiers.includes("little"));

      const water = classifyFoodNoun("water");
      assert.strictEqual(water.isCountable, false);
    });

    it("handles empty, null or undefined input gracefully", () => {
      const empty = classifyFoodNoun("");
      assert.strictEqual(empty.isCountable, false);
      assert.strictEqual(empty.label, "Không xác định");

      const nil = classifyFoodNoun(null);
      assert.strictEqual(nil.isCountable, false);
    });
  });

  describe("getAnimalEncouragement", () => {
    it("returns mascot avatar and motivational text for correct answers", () => {
      const fox = getAnimalEncouragement(true, "fox");
      assert.strictEqual(fox.avatar, "🦊");
      assert.ok(fox.text.length > 5);

      const panda = getAnimalEncouragement(true, "panda");
      assert.strictEqual(panda.avatar, "🐼");
    });

    it("returns gentle cheer up message for wrong answers", () => {
      const lion = getAnimalEncouragement(false, "lion");
      assert.strictEqual(lion.avatar, "🦁");
      assert.ok(
        lion.text.includes("Sư Tử Leo") ||
        lion.text.includes("Cố lên") ||
        lion.text.includes("Thử lại") ||
        lion.text.includes("Gần đúng rồi")
      );
    });

    it("falls back to fox when mascotId is unknown", () => {
      const unknown = getAnimalEncouragement(true, "unknown_animal");
      assert.strictEqual(unknown.avatar, "🦊");
    });
  });

  describe("formatUnitProgress", () => {
    it("calculates 0% for fresh untouched unit", () => {
      const res = formatUnitProgress(1, {});
      assert.strictEqual(res.completedCount, 0);
      assert.strictEqual(res.totalGames, 5);
      assert.strictEqual(res.percent, 0);
      assert.strictEqual(res.rank, "Tập sự Safari 🐾");
    });

    it("calculates 100% and top badge when all 5 games passed", () => {
      const full = {
        u1_safari: { passed: true },
        u1_panda: { passed: true },
        u1_fox: { passed: true },
        u1_space: { passed: true },
        u1_exam: { passed: true }
      };
      const res = formatUnitProgress(1, full);
      assert.strictEqual(res.completedCount, 5);
      assert.strictEqual(res.percent, 100);
      assert.strictEqual(res.rank, "Chiến Binh Hoàng Gia 🏆");
    });

    it("calculates intermediate ranks accurately", () => {
      const mid = {
        u2_safari: { passed: true },
        u2_panda: { passed: true },
        u2_fox: { passed: true }
      };
      const res = formatUnitProgress(2, mid);
      assert.strictEqual(res.completedCount, 3);
      assert.strictEqual(res.percent, 60);
      assert.strictEqual(res.rank, "Hiệp Sĩ Rừng Xanh 🦁");
    });

    it("handles null or undefined data without errors", () => {
      const safe = formatUnitProgress(3, null);
      assert.strictEqual(safe.percent, 0);
    });
  });

  describe("playEnglishSpeech", () => {
    it("returns false safely in Node.js test environment without window.speechSynthesis", () => {
      const res = playEnglishSpeech("hello");
      assert.strictEqual(res, false);
    });

    it("returns false for empty or non-string input", () => {
      assert.strictEqual(playEnglishSpeech(""), false);
      assert.strictEqual(playEnglishSpeech(null), false);
      assert.strictEqual(playEnglishSpeech(123), false);
    });
  });
});

