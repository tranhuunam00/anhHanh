import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  getNextStatus,
  getStatusFromKey,
  calculateNextFocusIndex,
  isTextInputElement,
  getStatusFeedbackText,
  STATUS_SEQUENCE,
  STATUS_LABELS,
} from "../src/utils/vocabKeyboardUtils.js";

describe("vocabKeyboardUtils", () => {
  describe("getNextStatus", () => {
    test("cycles through NEW -> LEARNING -> MASTERED -> NEW", () => {
      assert.equal(getNextStatus("NEW"), "LEARNING");
      assert.equal(getNextStatus("LEARNING"), "MASTERED");
      assert.equal(getNextStatus("MASTERED"), "NEW");
    });

    test("handles lowercase and whitespace inputs gracefully", () => {
      assert.equal(getNextStatus("new"), "LEARNING");
      assert.equal(getNextStatus(" learning "), "MASTERED");
      assert.equal(getNextStatus(" mastered "), "NEW");
    });

    test("handles invalid, empty, or non-string inputs with safe fallbacks", () => {
      assert.equal(getNextStatus(""), "LEARNING");
      assert.equal(getNextStatus(null), "LEARNING");
      assert.equal(getNextStatus(undefined), "LEARNING");
      assert.equal(getNextStatus(123), "LEARNING");
      assert.equal(getNextStatus("UNKNOWN_STATUS"), "NEW");
    });
  });

  describe("getStatusFromKey", () => {
    test("correctly maps valid numeric keys '1', '2', '3'", () => {
      assert.equal(getStatusFromKey("1"), "NEW");
      assert.equal(getStatusFromKey("2"), "LEARNING");
      assert.equal(getStatusFromKey("3"), "MASTERED");
    });

    test("handles keys with leading/trailing spaces", () => {
      assert.equal(getStatusFromKey(" 1 "), "NEW");
      assert.equal(getStatusFromKey(" 2 "), "LEARNING");
      assert.equal(getStatusFromKey(" 3 "), "MASTERED");
    });

    test("returns null for non-status keys, invalid types, or empty inputs", () => {
      assert.equal(getStatusFromKey("4"), null);
      assert.equal(getStatusFromKey("0"), null);
      assert.equal(getStatusFromKey("a"), null);
      assert.equal(getStatusFromKey("Enter"), null);
      assert.equal(getStatusFromKey(""), null);
      assert.equal(getStatusFromKey(null), null);
      assert.equal(getStatusFromKey(undefined), null);
      assert.equal(getStatusFromKey(1), null);
    });
  });

  describe("calculateNextFocusIndex", () => {
    test("handles totalItems <= 0 edge cases", () => {
      assert.equal(calculateNextFocusIndex(0, 0, "ArrowRight"), 0);
      assert.equal(calculateNextFocusIndex(5, -1, "ArrowLeft"), 0);
      assert.equal(calculateNextFocusIndex(0, null, "ArrowDown"), 0);
    });

    test("navigates ArrowRight within boundaries", () => {
      assert.equal(calculateNextFocusIndex(0, 10, "ArrowRight", 3), 1);
      assert.equal(calculateNextFocusIndex(8, 10, "ArrowRight", 3), 9);
      assert.equal(calculateNextFocusIndex(9, 10, "ArrowRight", 3), 9); // Boundary cap
    });

    test("navigates ArrowLeft within boundaries", () => {
      assert.equal(calculateNextFocusIndex(5, 10, "ArrowLeft", 3), 4);
      assert.equal(calculateNextFocusIndex(1, 10, "ArrowLeft", 3), 0);
      assert.equal(calculateNextFocusIndex(0, 10, "ArrowLeft", 3), 0); // Boundary floor
    });

    test("navigates ArrowDown across rows", () => {
      // 3 columns: 0,1,2 in row 0; 3,4,5 in row 1; 6,7,8 in row 2; 9 in row 3
      assert.equal(calculateNextFocusIndex(0, 10, "ArrowDown", 3), 3);
      assert.equal(calculateNextFocusIndex(5, 10, "ArrowDown", 3), 8);
      // Jumping down from row 2 (index 7 or 8) when row 3 only has index 9
      assert.equal(calculateNextFocusIndex(7, 10, "ArrowDown", 3), 9);
      // Already on last row (index 9)
      assert.equal(calculateNextFocusIndex(9, 10, "ArrowDown", 3), 9);
    });

    test("navigates ArrowUp across rows", () => {
      assert.equal(calculateNextFocusIndex(5, 10, "ArrowUp", 3), 2);
      assert.equal(calculateNextFocusIndex(3, 10, "ArrowUp", 3), 0);
      // At top row (index 1), moving up stays in column 1 (1 % 3 = 1)
      assert.equal(calculateNextFocusIndex(1, 10, "ArrowUp", 3), 1);
      assert.equal(calculateNextFocusIndex(2, 10, "ArrowUp", 3), 2);
    });

    test("handles unhandled keys or default case", () => {
      assert.equal(calculateNextFocusIndex(4, 10, "KeyA", 3), 4);
      assert.equal(calculateNextFocusIndex(4, 10, "Enter", 3), 4);
    });

    test("handles irregular columns parameter", () => {
      assert.equal(calculateNextFocusIndex(0, 5, "ArrowDown", 0), 1); // fallback cols >= 1
      assert.equal(calculateNextFocusIndex(0, 5, "ArrowDown", -2), 1);
    });
  });

  describe("isTextInputElement", () => {
    test("returns true for INPUT, TEXTAREA, SELECT, and contentEditable", () => {
      assert.equal(isTextInputElement({ tagName: "INPUT" }), true);
      assert.equal(isTextInputElement({ tagName: "input" }), true);
      assert.equal(isTextInputElement({ tagName: "TEXTAREA" }), true);
      assert.equal(isTextInputElement({ tagName: "SELECT" }), true);
      assert.equal(isTextInputElement({ tagName: "DIV", isContentEditable: true }), true);
    });

    test("returns false for non-input elements and falsy targets", () => {
      assert.equal(isTextInputElement({ tagName: "BUTTON" }), false);
      assert.equal(isTextInputElement({ tagName: "DIV" }), false);
      assert.equal(isTextInputElement({ tagName: "SPAN" }), false);
      assert.equal(isTextInputElement(null), false);
      assert.equal(isTextInputElement(undefined), false);
      assert.equal(isTextInputElement("string"), false);
    });
  });

  describe("getStatusFeedbackText", () => {
    test("returns localized labels for known statuses", () => {
      assert.equal(getStatusFeedbackText("NEW"), "Mới lưu");
      assert.equal(getStatusFeedbackText("LEARNING"), "Đang nhớ");
      assert.equal(getStatusFeedbackText("MASTERED"), "Đã thuộc");
      assert.equal(getStatusFeedbackText("new"), "Mới lưu");
    });

    test("returns fallback string for unknown or falsy statuses", () => {
      assert.equal(getStatusFeedbackText("CUSTOM"), "CUSTOM");
      assert.equal(getStatusFeedbackText(""), "Không xác định");
      assert.equal(getStatusFeedbackText(null), "Không xác định");
    });
  });
});
