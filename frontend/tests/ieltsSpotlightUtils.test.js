import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  getIeltsSpotlightLessons,
  formatIeltsSpotlightCount,
  computeIeltsExpandState
} from "../src/utils/ieltsSpotlightUtils.js";

describe("ieltsSpotlightUtils Unit Tests", () => {
  describe("getIeltsSpotlightLessons", () => {
    test("happy path: returns exactly 4 curated spotlight lessons by default", () => {
      const lessons = getIeltsSpotlightLessons();
      assert.equal(Array.isArray(lessons), true);
      assert.equal(lessons.length, 4);

      // Verify each lesson has required authentic fields
      lessons.forEach((l) => {
        assert.ok(l.id, "Lesson must have an id");
        assert.ok(l.title, "Lesson must have a title");
        assert.ok(l.audioUrl || l.url, "Lesson must have an audioUrl or url");
        assert.ok(l.badge, "Lesson must have a badge");
      });
    });

    test("input coverage: respects custom list and filters out invalid objects", () => {
      const custom = [
        { id: "custom-1", audioUrl: "/audio/test1.mp3", title: "Test 1" },
        null,
        undefined,
        "not-an-object",
        { id: "custom-2", url: "/audio/test2.mp3", title: "Test 2" },
        { id: "custom-without-url", title: "No URL" }
      ];

      const result = getIeltsSpotlightLessons(custom, 10);
      assert.equal(result.length, 2);
      assert.equal(result[0].id, "custom-1");
      assert.equal(result[1].id, "custom-2");
    });

    test("boundary cases: handles custom limit parameter correctly", () => {
      assert.equal(getIeltsSpotlightLessons(null, 2).length, 2);
      assert.equal(getIeltsSpotlightLessons(null, 1).length, 1);
      // Fallback to 4 for non-positive or invalid limits
      assert.equal(getIeltsSpotlightLessons(null, 0).length, 4);
      assert.equal(getIeltsSpotlightLessons(null, -5).length, 4);
      assert.equal(getIeltsSpotlightLessons(null, "invalid").length, 4);
    });

    test("error handling: gracefully handles null and non-array customList", () => {
      assert.equal(getIeltsSpotlightLessons(null).length, 4);
      assert.equal(getIeltsSpotlightLessons(undefined).length, 4);
      assert.equal(getIeltsSpotlightLessons("string").length, 4);
      assert.equal(getIeltsSpotlightLessons({}).length, 4);
    });
  });

  describe("formatIeltsSpotlightCount", () => {
    test("happy path: formats counts above 80 and between 50 and 80", () => {
      assert.equal(formatIeltsSpotlightCount(85), "80+ bài luyện");
      assert.equal(formatIeltsSpotlightCount(80), "80+ bài luyện");
      assert.equal(formatIeltsSpotlightCount(65), "50+ bài luyện");
      assert.equal(formatIeltsSpotlightCount(50), "50+ bài luyện");
    });

    test("boundary cases: formats counts under 50 with exact number", () => {
      assert.equal(formatIeltsSpotlightCount(16), "16 bài luyện");
      assert.equal(formatIeltsSpotlightCount(1), "1 bài luyện");
      assert.equal(formatIeltsSpotlightCount(49.9), "49 bài luyện");
    });

    test("fallback and invalid inputs: returns fallback '80+ bài luyện'", () => {
      assert.equal(formatIeltsSpotlightCount(0), "80+ bài luyện");
      assert.equal(formatIeltsSpotlightCount(-10), "80+ bài luyện");
      assert.equal(formatIeltsSpotlightCount(null), "80+ bài luyện");
      assert.equal(formatIeltsSpotlightCount(undefined), "80+ bài luyện");
      assert.equal(formatIeltsSpotlightCount(NaN), "80+ bài luyện");
      assert.equal(formatIeltsSpotlightCount("100"), "80+ bài luyện");
    });
  });

  describe("computeIeltsExpandState", () => {
    test("happy path: toggles boolean when nextState is null or undefined", () => {
      assert.equal(computeIeltsExpandState(false), true);
      assert.equal(computeIeltsExpandState(true), false);
      assert.equal(computeIeltsExpandState(false, null), true);
      assert.equal(computeIeltsExpandState(true, undefined), false);
    });

    test("explicit override: sets exact boolean nextState when provided", () => {
      assert.equal(computeIeltsExpandState(false, true), true);
      assert.equal(computeIeltsExpandState(true, true), true);
      assert.equal(computeIeltsExpandState(true, false), false);
      assert.equal(computeIeltsExpandState(false, false), false);
    });

    test("boundary cases: handles truthy/falsy non-boolean currentState", () => {
      assert.equal(computeIeltsExpandState(0), true);
      assert.equal(computeIeltsExpandState(1), false);
      assert.equal(computeIeltsExpandState(""), true);
      assert.equal(computeIeltsExpandState(null), true);
    });
  });
});

