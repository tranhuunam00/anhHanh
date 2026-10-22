import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  TIME_RANGE_OPTIONS,
  filterVocabByTimeRange,
  countVocabByTimeRanges,
} from "../src/utils/vocabTimeFilterUtils.js";

describe("vocabTimeFilterUtils Unit Tests", () => {
  const refDate = new Date("2026-10-22T12:00:00Z");

  const mockWords = [
    // Today (2 hours ago)
    { id: "1", word: "ubiquitous", created_at: "2026-10-22T10:00:00Z" },
    // Yesterday (1 day ago)
    { id: "2", word: "ephemeral", created_at: "2026-10-21T12:00:00Z" },
    // 2.5 days ago
    { id: "3", word: "serendipity", created_at: "2026-10-20T00:00:00Z" },
    // 5 days ago
    { id: "4", word: "meticulous", created_at: "2026-10-17T12:00:00Z" },
    // 15 days ago
    { id: "5", word: "pragmatic", created_at: "2026-10-07T12:00:00Z" },
    // 40 days ago
    { id: "6", word: "obsolete", created_at: "2026-09-10T12:00:00Z" },
    // Word without created_at (legacy / fallback)
    { id: "7", word: "timeless" },
  ];

  describe("filterVocabByTimeRange", () => {
    test("happy path: 'ALL' returns all words without mutation", () => {
      const res = filterVocabByTimeRange(mockWords, "ALL", null, null, refDate);
      assert.equal(res.length, 7);
      assert.deepEqual(res.map((w) => w.id), ["1", "2", "3", "4", "5", "6", "7"]);
    });

    test("happy path: 'TODAY' returns words created on reference day plus items without created_at", () => {
      const res = filterVocabByTimeRange(mockWords, "TODAY", null, null, refDate);
      // Item 1 is today, item 7 has no created_at
      const ids = res.map((w) => w.id);
      assert.ok(ids.includes("1"));
      assert.ok(ids.includes("7"));
      assert.ok(!ids.includes("2"));
    });

    test("happy path: '3DAYS' includes words within last 3 days", () => {
      const res = filterVocabByTimeRange(mockWords, "3DAYS", null, null, refDate);
      const ids = res.map((w) => w.id);
      // Item 1 (today), Item 2 (1d ago), Item 3 (2.5d ago), Item 7 (no timestamp)
      assert.ok(ids.includes("1"));
      assert.ok(ids.includes("2"));
      assert.ok(ids.includes("3"));
      assert.ok(ids.includes("7"));
      assert.ok(!ids.includes("4")); // 5d ago
    });

    test("happy path: '7DAYS' includes words within last 7 days", () => {
      const res = filterVocabByTimeRange(mockWords, "7DAYS", null, null, refDate);
      const ids = res.map((w) => w.id);
      assert.ok(ids.includes("1"));
      assert.ok(ids.includes("2"));
      assert.ok(ids.includes("3"));
      assert.ok(ids.includes("4"));
      assert.ok(!ids.includes("5")); // 15d ago
    });

    test("happy path: '30DAYS' includes words within last 30 days", () => {
      const res = filterVocabByTimeRange(mockWords, "30DAYS", null, null, refDate);
      const ids = res.map((w) => w.id);
      assert.ok(ids.includes("5")); // 15d ago
      assert.ok(!ids.includes("6")); // 40d ago
    });

    test("happy path: 'CUSTOM' filters correctly between customStart and customEnd", () => {
      const res = filterVocabByTimeRange(mockWords, "CUSTOM", "2026-10-15", "2026-10-21", refDate);
      const ids = res.map((w) => w.id);
      assert.ok(ids.includes("2")); // Oct 21
      assert.ok(ids.includes("3")); // Oct 20
      assert.ok(ids.includes("4")); // Oct 17
      assert.ok(!ids.includes("1")); // Oct 22 (after range)
      assert.ok(!ids.includes("5")); // Oct 07 (before range)
    });

    test("edge case: customStart only (from date to infinity)", () => {
      const res = filterVocabByTimeRange(mockWords, "CUSTOM", "2026-10-20", null, refDate);
      const ids = res.map((w) => w.id);
      assert.ok(ids.includes("1"));
      assert.ok(ids.includes("2"));
      assert.ok(ids.includes("3"));
      assert.ok(!ids.includes("4"));
    });

    test("edge case: customEnd only (from beginning to date)", () => {
      const res = filterVocabByTimeRange(mockWords, "CUSTOM", null, "2026-10-10", refDate);
      const ids = res.map((w) => w.id);
      assert.ok(ids.includes("5")); // Oct 07
      assert.ok(ids.includes("6")); // Sep 10
      assert.ok(!ids.includes("1"));
    });

    test("boundary cases: empty, null, and non-array inputs", () => {
      assert.deepEqual(filterVocabByTimeRange([], "TODAY"), []);
      assert.deepEqual(filterVocabByTimeRange(null, "TODAY"), []);
      assert.deepEqual(filterVocabByTimeRange(undefined, "TODAY"), []);
      assert.deepEqual(filterVocabByTimeRange("not an array", "TODAY"), []);
    });

    test("fallback: handles unknown timeRange gracefully by returning all words", () => {
      const res = filterVocabByTimeRange(mockWords, "UNKNOWN_RANGE", null, null, refDate);
      assert.equal(res.length, 7);
    });

    test("error handling: malformed created_at strings are treated gracefully", () => {
      const dirtyWords = [
        { id: "bad1", word: "foo", created_at: "INVALID_DATE" },
        { id: "good1", word: "bar", created_at: "2026-10-22T08:00:00Z" },
      ];
      const res = filterVocabByTimeRange(dirtyWords, "TODAY", null, null, refDate);
      assert.ok(res.length >= 1);
    });
  });

  describe("countVocabByTimeRanges", () => {
    test("calculates counts for each option properly", () => {
      const counts = countVocabByTimeRanges(mockWords, refDate);
      assert.equal(counts.ALL, 7);
      assert.ok(counts.TODAY >= 1);
      assert.ok(counts["3DAYS"] >= counts.TODAY);
      assert.ok(counts["7DAYS"] >= counts["3DAYS"]);
      assert.ok(counts["30DAYS"] >= counts["7DAYS"]);
      assert.equal(counts.CUSTOM, 0);
    });

    test("handles empty or non-array safely", () => {
      const emptyCounts = {
        ALL: 0,
        TODAY: 0,
        "3DAYS": 0,
        "7DAYS": 0,
        "30DAYS": 0,
        CUSTOM: 0,
      };
      assert.deepEqual(countVocabByTimeRanges(null), emptyCounts);
      assert.deepEqual(countVocabByTimeRanges(undefined), emptyCounts);
      assert.deepEqual(countVocabByTimeRanges([]), emptyCounts);
    });
  });

  describe("TIME_RANGE_OPTIONS", () => {
    test("contains standard required options", () => {
      const keys = TIME_RANGE_OPTIONS.map((o) => o.key);
      assert.deepEqual(keys, ["ALL", "TODAY", "3DAYS", "7DAYS", "30DAYS", "CUSTOM"]);
    });
  });
});
