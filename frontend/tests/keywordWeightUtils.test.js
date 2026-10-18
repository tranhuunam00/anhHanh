import test, { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  calculateWordWeight,
  checkKeywordUsageInText,
  extractRelevantVocabFromNotebook,
  rankKeywordsByNewWordWeight,
  calculateKeywordUsageStats,
} from "../src/utils/keywordWeightUtils.js";

describe("keywordWeightUtils Unit Tests", () => {
  describe("calculateWordWeight", () => {
    it("happy path: calculates weight for a new notebook word in prompt", () => {
      const vocabItem = {
        word: "paradigmatic breakthrough",
        status: "NEW",
        meaning: "bước đột phá mang tính hệ hình",
        mastery_score: 0,
        next_review_at: new Date(Date.now() - 10000).toISOString(),
      };
      const promptContext = {
        keywords: ["paradigmatic breakthrough", "telecommunication"],
        prompt: "The impact of significant inventions",
        topic_category: "technology",
      };

      const res = calculateWordWeight("paradigmatic breakthrough", vocabItem, promptContext);
      assert.ok(res !== null);
      assert.equal(res.word, "paradigmatic breakthrough");
      assert.equal(res.status, "NEW");
      assert.equal(res.isSaved, true);
      assert.equal(res.isPromptKeyword, true);
      assert.equal(res.isOverdue, true);
      assert.ok(res.weightScore >= 80, `Expected score >= 80, got ${res.weightScore}`);
      assert.ok(res.reasons.length >= 3);
    });

    it("calculates weight for learning status with mastery score", () => {
      const vocabItem = {
        word: "sedentary",
        status: "LEARNING",
        mastery_score: 20,
      };
      const res = calculateWordWeight("sedentary", vocabItem);
      assert.ok(res !== null);
      assert.equal(res.status, "LEARNING");
      assert.equal(res.masteryScore, 20);
      assert.ok(res.weightScore >= 35);
    });

    it("calculates weight for unsaved academic prompt keyword", () => {
      const promptContext = {
        keywords: ["unprecedented connectivity"],
      };
      const res = calculateWordWeight("unprecedented connectivity", null, promptContext);
      assert.ok(res !== null);
      assert.equal(res.isSaved, false);
      assert.equal(res.status, "UNSAVED");
      assert.equal(res.isPromptKeyword, true);
      assert.ok(res.weightScore >= 50);
    });

    it("edge case: null, empty or invalid word inputs return null gracefully", () => {
      assert.equal(calculateWordWeight(null), null);
      assert.equal(calculateWordWeight(""), null);
      assert.equal(calculateWordWeight("   "), null);
      assert.equal(calculateWordWeight(12345), null);
      assert.equal(calculateWordWeight(undefined), null);
    });
  });

  describe("checkKeywordUsageInText", () => {
    it("accurately detects full keyword phrase within essay text", () => {
      const text = "This breakthrough represents an unprecedented connectivity in global trade.";
      assert.equal(checkKeywordUsageInText("unprecedented connectivity", text), true);
      assert.equal(checkKeywordUsageInText("breakthrough", text), true);
    });

    it("is case-insensitive and handles multi-spaces", () => {
      const text = "We are witnessing PARADIGMATIC   BREAKTHROUGH today.";
      assert.equal(checkKeywordUsageInText("paradigmatic breakthrough", text), true);
    });

    it("does not trigger false positive on partial substrings inside longer words", () => {
      const text = "He is an internetworking engineer.";
      assert.equal(checkKeywordUsageInText("network", text), false);
    });

    it("edge case: returns false for empty or non-string inputs", () => {
      assert.equal(checkKeywordUsageInText("", "some text"), false);
      assert.equal(checkKeywordUsageInText("word", ""), false);
      assert.equal(checkKeywordUsageInText(null, null), false);
      assert.equal(checkKeywordUsageInText(undefined, "abc"), false);
    });
  });

  describe("extractRelevantVocabFromNotebook", () => {
    it("extracts and prioritizes new or overdue notebook vocabulary", () => {
      const savedVocabMap = {
        "telecommunication": {
          word: "telecommunication",
          status: "NEW",
          meaning: "viễn thông",
        },
        "apple": {
          word: "apple",
          status: "MASTERED",
          meaning: "quả táo",
        },
      };

      const extracted = extractRelevantVocabFromNotebook(savedVocabMap, { prompt: "Modern telecommunication systems" }, 3);
      assert.ok(extracted.length > 0);
      assert.equal(extracted[0].word, "telecommunication");
    });

    it("edge case: handles empty or invalid notebook map", () => {
      assert.deepEqual(extractRelevantVocabFromNotebook(null), []);
      assert.deepEqual(extractRelevantVocabFromNotebook({}), []);
      assert.deepEqual(extractRelevantVocabFromNotebook("invalid"), []);
    });
  });

  describe("rankKeywordsByNewWordWeight", () => {
    it("ranks keywords by descending weightScore and deduplicates case-insensitively", () => {
      const promptKeywords = [
        "instantaneous telecommunication",
        "cybersecurity vulnerabilities",
        "INSTANTANEOUS TELECOMMUNICATION", // duplicate test
      ];
      const savedVocabMap = {
        "cybersecurity vulnerabilities": {
          word: "cybersecurity vulnerabilities",
          status: "NEW",
          meaning: "lỗ hổng an ninh mạng",
        },
      };

      const ranked = rankKeywordsByNewWordWeight(promptKeywords, savedVocabMap, {}, { includeNotebookVocab: false });
      assert.equal(ranked.length, 2);
      // "cybersecurity vulnerabilities" has status NEW in savedVocabMap so it should rank first
      assert.equal(ranked[0].word.toLowerCase(), "cybersecurity vulnerabilities");
      assert.ok(ranked[0].weightScore >= ranked[1].weightScore);
    });

    it("edge case: handles empty prompt keywords gracefully", () => {
      const ranked = rankKeywordsByNewWordWeight([], {}, {}, { includeNotebookVocab: false });
      assert.deepEqual(ranked, []);
    });
  });

  describe("calculateKeywordUsageStats", () => {
    it("correctly computes usage stats and percentage", () => {
      const rankedKeywords = [
        { word: "paradigmatic breakthrough", normalizedWord: "paradigmatic breakthrough" },
        { word: "cybersecurity vulnerabilities", normalizedWord: "cybersecurity vulnerabilities" },
      ];
      const text = "Modern scientists achieved a paradigmatic breakthrough recently.";

      const stats = calculateKeywordUsageStats(rankedKeywords, text);
      assert.equal(stats.total, 2);
      assert.equal(stats.usedCount, 1);
      assert.equal(stats.percentUsed, 50);
      assert.equal(stats.usedMap["paradigmatic breakthrough"], true);
      assert.equal(stats.usedMap["cybersecurity vulnerabilities"], false);
    });

    it("edge case: handles empty keywords list or empty text", () => {
      const stats = calculateKeywordUsageStats([], "some text");
      assert.equal(stats.total, 0);
      assert.equal(stats.usedCount, 0);
      assert.equal(stats.percentUsed, 0);
    });
  });
});
