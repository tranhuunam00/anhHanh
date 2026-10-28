import test, { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  filterRootsByCategory,
  normalizeSearchText,
  searchRoots,
  getWordBreakdownParts,
  calculateRootProgress,
  checkAssemblyAnswer,
  checkQuizAnswer,
  getNextRootId,
  getPrevRootId,
  formatBadgeIndex,
  getRootCategoryStats,
} from "../src/utils/rootWordsUtils.js";

const SAMPLE_ROOTS = [
  {
    id: 1,
    root: "spect",
    variants: ["spic"],
    meaningVi: "nhìn, quan sát",
    meaningEn: "to see, look",
    category: "perception",
    words: [
      { word: "respect", meaningVi: "tôn trọng" },
      { word: "inspect", meaningVi: "thanh tra" },
    ],
  },
  {
    id: 2,
    root: "dict",
    variants: ["dic"],
    meaningVi: "nói, tuyên bố",
    meaningEn: "to speak, say",
    category: "communication",
    words: [
      { word: "predict", meaningVi: "dự đoán" },
      { word: "contradict", meaningVi: "mâu thuẫn" },
    ],
  },
  {
    id: 3,
    root: "struct",
    variants: ["stru"],
    meaningVi: "xây dựng",
    meaningEn: "to build",
    category: "creation",
    words: [
      { word: "construct", meaningVi: "xây dựng" },
    ],
  },
];

describe("rootWordsUtils Unit Tests", () => {
  describe("filterRootsByCategory", () => {
    it("happy path: returns all roots when categoryId is 'all' or empty", () => {
      const resAll = filterRootsByCategory(SAMPLE_ROOTS, "all");
      assert.equal(resAll.length, 3);
      const resEmpty = filterRootsByCategory(SAMPLE_ROOTS, "");
      assert.equal(resEmpty.length, 3);
    });

    it("filters correctly by specific category", () => {
      const res = filterRootsByCategory(SAMPLE_ROOTS, "perception");
      assert.equal(res.length, 1);
      assert.equal(res[0].root, "spect");
    });

    it("handles non-matching category by returning empty array", () => {
      const res = filterRootsByCategory(SAMPLE_ROOTS, "non_existent");
      assert.deepEqual(res, []);
    });

    it("boundary cases: non-array input returns empty array safely", () => {
      assert.deepEqual(filterRootsByCategory(null, "perception"), []);
      assert.deepEqual(filterRootsByCategory(undefined, "all"), []);
      assert.deepEqual(filterRootsByCategory("not an array", "all"), []);
    });
  });

  describe("normalizeSearchText", () => {
    it("converts uppercase to lowercase and strips Vietnamese diacritics", () => {
      assert.equal(normalizeSearchText("Nhìn"), "nhin");
      assert.equal(normalizeSearchText("Tôn Trọng"), "ton trong");
      assert.equal(normalizeSearchText("Đồng bộ"), "dong bo");
    });

    it("handles empty or non-string inputs safely", () => {
      assert.equal(normalizeSearchText(""), "");
      assert.equal(normalizeSearchText(null), "");
      assert.equal(normalizeSearchText(undefined), "");
      assert.equal(normalizeSearchText(123), "");
    });
  });

  describe("searchRoots", () => {
    it("searches by root name", () => {
      const res = searchRoots(SAMPLE_ROOTS, "spect");
      assert.equal(res.length, 1);
      assert.equal(res[0].id, 1);
    });

    it("searches by root variant", () => {
      const res = searchRoots(SAMPLE_ROOTS, "spic");
      assert.equal(res.length, 1);
      assert.equal(res[0].id, 1);
    });

    it("searches by Vietnamese meaning with or without accents", () => {
      const resAccent = searchRoots(SAMPLE_ROOTS, "tôn trọng");
      assert.equal(resAccent.length, 1);
      assert.equal(resAccent[0].id, 1);

      const resNoAccent = searchRoots(SAMPLE_ROOTS, "ton trong");
      assert.equal(resNoAccent.length, 1);
      assert.equal(resNoAccent[0].id, 1);
    });

    it("searches by child word name", () => {
      const res = searchRoots(SAMPLE_ROOTS, "predict");
      assert.equal(res.length, 1);
      assert.equal(res[0].id, 2);
    });

    it("returns all roots when query is empty string or whitespace", () => {
      assert.equal(searchRoots(SAMPLE_ROOTS, "").length, 3);
      assert.equal(searchRoots(SAMPLE_ROOTS, "   ").length, 3);
    });

    it("boundary cases: returns empty array for null/empty roots", () => {
      assert.deepEqual(searchRoots(null, "spect"), []);
      assert.deepEqual(searchRoots([], "spect"), []);
    });
  });

  describe("getWordBreakdownParts", () => {
    it("structures prefix, root, and suffix correctly", () => {
      const wordObj = {
        prefix: "re-",
        prefixMeaning: "quay lại",
        root: "spect",
        rootMeaning: "nhìn",
        suffix: "-ful",
        suffixMeaning: "có tính chất",
      };
      const parts = getWordBreakdownParts(wordObj);
      assert.equal(parts.length, 3);
      assert.equal(parts[0].type, "prefix");
      assert.equal(parts[0].colorClass, "part-prefix");
      assert.equal(parts[1].type, "root");
      assert.equal(parts[1].colorClass, "part-root");
      assert.equal(parts[2].type, "suffix");
      assert.equal(parts[2].colorClass, "part-suffix");
    });

    it("omits empty prefix or suffix gracefully", () => {
      const wordObj = {
        prefix: "",
        root: "spect",
        rootMeaning: "nhìn",
        suffix: "",
      };
      const parts = getWordBreakdownParts(wordObj);
      assert.equal(parts.length, 1);
      assert.equal(parts[0].type, "root");
    });

    it("handles null or invalid wordObj", () => {
      assert.deepEqual(getWordBreakdownParts(null), []);
      assert.deepEqual(getWordBreakdownParts(undefined), []);
      assert.deepEqual(getWordBreakdownParts("string"), []);
    });
  });

  describe("calculateRootProgress", () => {
    it("calculates percentage and remaining count accurately", () => {
      const stats = calculateRootProgress([1, 2, 3], 10);
      assert.equal(stats.completedCount, 3);
      assert.equal(stats.totalCount, 10);
      assert.equal(stats.percentage, 30);
      assert.equal(stats.remainingCount, 7);
    });

    it("handles Set data structures", () => {
      const completedSet = new Set([1, 2]);
      const stats = calculateRootProgress(completedSet, 100);
      assert.equal(stats.completedCount, 2);
      assert.equal(stats.percentage, 2);
      assert.equal(stats.remainingCount, 98);
    });

    it("boundary cases: empty inputs, 0 total, or clamped bounds", () => {
      const statsEmpty = calculateRootProgress([], 0);
      assert.equal(statsEmpty.completedCount, 0);
      assert.equal(statsEmpty.totalCount, 100);

      const statsNull = calculateRootProgress(null, 100);
      assert.equal(statsNull.completedCount, 0);
    });
  });

  describe("checkAssemblyAnswer", () => {
    it("returns true when assembled parts match target word ignoring hyphens", () => {
      assert.equal(checkAssemblyAnswer(["re-", "spect"], "respect"), true);
      assert.equal(checkAssemblyAnswer(["con-", "struct"], "construct"), true);
      assert.equal(checkAssemblyAnswer(["PRE-", "DICT"], "predict"), true);
    });

    it("returns false when assembled parts are incorrect or incomplete", () => {
      assert.equal(checkAssemblyAnswer(["in-", "spect"], "respect"), false);
      assert.equal(checkAssemblyAnswer(["spect"], "respect"), false);
    });

    it("handles edge cases and invalid inputs gracefully", () => {
      assert.equal(checkAssemblyAnswer(null, "respect"), false);
      assert.equal(checkAssemblyAnswer([], "respect"), false);
      assert.equal(checkAssemblyAnswer(["re"], null), false);
    });
  });

  describe("checkQuizAnswer", () => {
    it("matches numbers and strings correctly", () => {
      assert.equal(checkQuizAnswer(1, 1), true);
      assert.equal(checkQuizAnswer(0, 1), false);
      assert.equal(checkQuizAnswer("spect", "spect"), true);
      assert.equal(checkQuizAnswer(" SPECT ", "spect"), true);
    });

    it("handles null or undefined safely", () => {
      assert.equal(checkQuizAnswer(null, 1), false);
      assert.equal(checkQuizAnswer(undefined, "abc"), false);
    });
  });

  describe("getNextRootId and getPrevRootId", () => {
    it("cycles forward to next ID and loops back to start", () => {
      assert.equal(getNextRootId(1, SAMPLE_ROOTS), 2);
      assert.equal(getNextRootId(2, SAMPLE_ROOTS), 3);
      assert.equal(getNextRootId(3, SAMPLE_ROOTS), 1);
    });

    it("cycles backward to prev ID and loops to end", () => {
      assert.equal(getPrevRootId(3, SAMPLE_ROOTS), 2);
      assert.equal(getPrevRootId(2, SAMPLE_ROOTS), 1);
      assert.equal(getPrevRootId(1, SAMPLE_ROOTS), 3);
    });

    it("handles unknown ID or empty lists", () => {
      assert.equal(getNextRootId(999, SAMPLE_ROOTS), 1);
      assert.equal(getNextRootId(1, []), 1);
      assert.equal(getPrevRootId(1, []), 1);
    });
  });

  describe("formatBadgeIndex", () => {
    it("formats 1-digit index with leading zero and label", () => {
      assert.equal(formatBadgeIndex(2, "NHÌN LẠI, COI TRỌNG"), "02 · NHÌN LẠI, COI TRỌNG");
      assert.equal(formatBadgeIndex(15, "viết chi tiết"), "15 · VIẾT CHI TIẾT");
    });

    it("handles missing label or invalid number gracefully", () => {
      assert.equal(formatBadgeIndex(5, ""), "05");
      assert.equal(formatBadgeIndex("abc", "TEST"), "01 · TEST");
    });
  });

  describe("getRootCategoryStats", () => {
    it("counts items per category accurately", () => {
      const stats = getRootCategoryStats(SAMPLE_ROOTS);
      assert.deepEqual(stats, {
        perception: 1,
        communication: 1,
        creation: 1,
      });
    });

    it("handles non-array or empty input", () => {
      assert.deepEqual(getRootCategoryStats(null), {});
      assert.deepEqual(getRootCategoryStats([]), {});
    });
  });
});
