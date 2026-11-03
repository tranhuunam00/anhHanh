import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  isQuestionAnswered,
  calculateScrollBounds,
  calculateCenteredScrollPosition,
  calculateDragScroll,
  shouldPreventClickAfterDrag,
  calculateStepScroll
} from "../src/utils/ieltsPaletteUtils.js";

describe("IeltsQuestionPalette Utils Test Suite (Rule 4 & Rule 6)", () => {
  describe("isQuestionAnswered", () => {
    it("should return false for invalid or missing answer objects", () => {
      assert.equal(isQuestionAnswered(null, 1), false);
      assert.equal(isQuestionAnswered(undefined, 1), false);
      assert.equal(isQuestionAnswered("", 1), false);
      assert.equal(isQuestionAnswered(123, 1), false);
    });

    it("should return false for uninitiated, null, empty or whitespace values", () => {
      const answers = { 1: null, 2: undefined, 3: "", 4: "   ", 5: [] };
      assert.equal(isQuestionAnswered(answers, 1), false);
      assert.equal(isQuestionAnswered(answers, 2), false);
      assert.equal(isQuestionAnswered(answers, 3), false);
      assert.equal(isQuestionAnswered(answers, 4), false);
      assert.equal(isQuestionAnswered(answers, 5), false);
      assert.equal(isQuestionAnswered(answers, 99), false);
    });

    it("should return true for valid string, non-empty array, numbers, or boolean values", () => {
      const answers = {
        1: "TRUE",
        "2": "fuel",
        3: ["A", "C"],
        4: 42,
        5: true
      };
      assert.equal(isQuestionAnswered(answers, 1), true);
      assert.equal(isQuestionAnswered(answers, 2), true);
      assert.equal(isQuestionAnswered(answers, "2"), true);
      assert.equal(isQuestionAnswered(answers, 3), true);
      assert.equal(isQuestionAnswered(answers, 4), true);
      assert.equal(isQuestionAnswered(answers, 5), true);
    });
  });

  describe("calculateScrollBounds", () => {
    it("should identify no overflow when content width fits container", () => {
      const result = calculateScrollBounds(0, 500, 600);
      assert.deepEqual(result, {
        canScrollLeft: false,
        canScrollRight: false,
        hasOverflow: false
      });
    });

    it("should detect canScrollRight when at start of overflowing content", () => {
      const result = calculateScrollBounds(0, 1000, 400);
      assert.deepEqual(result, {
        canScrollLeft: false,
        canScrollRight: true,
        hasOverflow: true
      });
    });

    it("should detect canScrollLeft and canScrollRight when in the middle of overflowing content", () => {
      const result = calculateScrollBounds(250, 1000, 400);
      assert.deepEqual(result, {
        canScrollLeft: true,
        canScrollRight: true,
        hasOverflow: true
      });
    });

    it("should detect canScrollLeft only when reaching the end of overflowing content", () => {
      const result = calculateScrollBounds(600, 1000, 400);
      assert.deepEqual(result, {
        canScrollLeft: true,
        canScrollRight: false,
        hasOverflow: true
      });
    });

    it("should handle edge cases and invalid parameters robustly", () => {
      const fallback = calculateScrollBounds(null, undefined, "invalid");
      assert.deepEqual(fallback, {
        canScrollLeft: false,
        canScrollRight: false,
        hasOverflow: false
      });
    });
  });

  describe("calculateCenteredScrollPosition", () => {
    it("should calculate centered scroll position accurately", () => {
      // badgeOffset = 500, badgeWidth = 25, containerWidth = 400
      // target = 500 - 200 + 12.5 = 312.5 -> 313
      const pos = calculateCenteredScrollPosition(500, 25, 400, 1000);
      assert.equal(pos, 313);
    });

    it("should clamp to 0 when target is negative (near start)", () => {
      const pos = calculateCenteredScrollPosition(50, 25, 400, 1000);
      assert.equal(pos, 0);
    });

    it("should clamp to maxScroll when target exceeds bounds (near end)", () => {
      const pos = calculateCenteredScrollPosition(950, 25, 400, 600);
      assert.equal(pos, 600);
    });

    it("should handle fallback and invalid numbers gracefully", () => {
      assert.equal(calculateCenteredScrollPosition(null, null, null), 0);
      assert.equal(calculateCenteredScrollPosition(100, undefined, 200), 13);
    });
  });

  describe("calculateDragScroll", () => {
    it("should scroll right (increase scrollLeft) when dragging pointer to the left", () => {
      // Start scroll at 100, pointer moves from 300 to 200 (distance = -100)
      // next = 100 - (-100) = 200
      const nextScroll = calculateDragScroll(100, 300, 200, 500);
      assert.equal(nextScroll, 200);
    });

    it("should scroll left (decrease scrollLeft) when dragging pointer to the right", () => {
      // Start scroll at 100, pointer moves from 200 to 250 (distance = 50)
      // next = 100 - 50 = 50
      const nextScroll = calculateDragScroll(100, 200, 250, 500);
      assert.equal(nextScroll, 50);
    });

    it("should clamp within [0, maxScroll]", () => {
      assert.equal(calculateDragScroll(10, 100, 300, 500), 0);
      assert.equal(calculateDragScroll(450, 300, 100, 500), 500);
    });

    it("should handle invalid inputs gracefully", () => {
      assert.equal(calculateDragScroll(null, undefined, 100, null), 0);
    });
  });

  describe("shouldPreventClickAfterDrag", () => {
    it("should return false for tiny movements within threshold (genuine click)", () => {
      assert.equal(shouldPreventClickAfterDrag(0), false);
      assert.equal(shouldPreventClickAfterDrag(2), false);
      assert.equal(shouldPreventClickAfterDrag(-3), false);
      assert.equal(shouldPreventClickAfterDrag(4.9), false);
    });

    it("should return true when distance exceeds threshold (intentional drag)", () => {
      assert.equal(shouldPreventClickAfterDrag(5), true);
      assert.equal(shouldPreventClickAfterDrag(15), true);
      assert.equal(shouldPreventClickAfterDrag(-25), true);
    });

    it("should handle custom thresholds and non-numbers", () => {
      assert.equal(shouldPreventClickAfterDrag(8, 10), false);
      assert.equal(shouldPreventClickAfterDrag(12, 10), true);
      assert.equal(shouldPreventClickAfterDrag(null), false);
    });
  });

  describe("calculateStepScroll", () => {
    it("should step left correctly and clamp to 0", () => {
      assert.equal(calculateStepScroll(300, "left", 180, 1000), 120);
      assert.equal(calculateStepScroll(100, "left", 180, 1000), 0);
    });

    it("should step right correctly and clamp to maxScroll", () => {
      assert.equal(calculateStepScroll(100, "right", 180, 500), 280);
      assert.equal(calculateStepScroll(400, "right", 180, 500), 500);
    });

    it("should handle default step and invalid values safely", () => {
      assert.equal(calculateStepScroll(0, "right"), 180);
      assert.equal(calculateStepScroll(null, "left"), 0);
    });
  });
});

