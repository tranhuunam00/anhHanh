import test, { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  formatBandLabel,
  parseBandScore,
  estimateWordBand,
  calculateBandMatchBonus,
  filterKeywordsByTargetBand,
} from "../src/utils/bandVocabularyUtils.js";

describe("bandVocabularyUtils Unit Tests", () => {
  describe("formatBandLabel", () => {
    it("happy path: standardizes various band formats into 'Band X.X'", () => {
      assert.equal(formatBandLabel("Band 8.0"), "Band 8.0");
      assert.equal(formatBandLabel("band8"), "Band 8.0");
      assert.equal(formatBandLabel("band7"), "Band 7.0");
      assert.equal(formatBandLabel("band6"), "Band 6.0");
      assert.equal(formatBandLabel("8.5"), "Band 8.5");
      assert.equal(formatBandLabel(7.5), "Band 7.5");
      assert.equal(formatBandLabel("6.5"), "Band 6.5");
    });

    it("handles null, undefined, empty string with fallback", () => {
      assert.equal(formatBandLabel(null, 7.5), "Band 7.5");
      assert.equal(formatBandLabel(undefined, 8.0), "Band 8.0");
      assert.equal(formatBandLabel("", 6.5), "Band 6.5");
      assert.equal(formatBandLabel(null), "Band 7.0");
    });

    it("handles unexpected string by extracting number or using fallback", () => {
      assert.equal(formatBandLabel("Target 8.0 Level"), "Band 8.0");
      assert.equal(formatBandLabel("InvalidBand", 7.0), "Band 7.0");
    });
  });

  describe("parseBandScore", () => {
    it("extracts float numbers accurately", () => {
      assert.equal(parseBandScore(8.0), 8.0);
      assert.equal(parseBandScore("Band 7.5"), 7.5);
      assert.equal(parseBandScore("band8"), 8.0);
      assert.equal(parseBandScore("6.5"), 6.5);
    });

    it("boundary and fallback cases", () => {
      assert.equal(parseBandScore(null, 7.0), 7.0);
      assert.equal(parseBandScore(undefined, 6.5), 6.5);
      assert.equal(parseBandScore("xyz", 7.5), 7.5);
    });
  });

  describe("estimateWordBand", () => {
    it("preserves explicit band if present on object", () => {
      const obj = { word: "simple word", band: "Band 8.5" };
      assert.equal(estimateWordBand(obj), "Band 8.5");
    });

    it("identifies advanced academic collocations as Band 8.0 - 8.5", () => {
      assert.equal(estimateWordBand("exponential growth"), "Band 8.0");
      assert.equal(estimateWordBand("rural revitalization"), "Band 8.0");
      assert.equal(estimateWordBand("digital infrastructure deficits"), "Band 8.5");
      assert.equal(estimateWordBand("urban hollow-out effect"), "Band 8.5");
    });

    it("identifies 2-word academic collocations as Band 7.5 when matching suffixes", () => {
      const band = estimateWordBand("sustainable management", {}, 7.5);
      assert.ok(band === "Band 7.5" || band === "Band 8.0");
    });

    it("assigns appropriate band to basic phrases", () => {
      const band = estimateWordBand("good job", {}, 6.5);
      assert.equal(band, "Band 6.5");
    });

    it("handles empty or null inputs gracefully", () => {
      assert.equal(estimateWordBand(null, {}, 7.0), "Band 7.0");
      assert.equal(estimateWordBand("", {}, 8.0), "Band 8.0");
    });
  });

  describe("calculateBandMatchBonus", () => {
    it("awards maximum bonus (25) for exact match", () => {
      assert.equal(calculateBandMatchBonus("Band 8.0", 8.0), 25);
      assert.equal(calculateBandMatchBonus("Band 7.0", 7.0), 25);
      assert.equal(calculateBandMatchBonus(6.5, 6.5), 25);
    });

    it("awards partial bonus (16) for close match (within 0.5 band)", () => {
      assert.equal(calculateBandMatchBonus("Band 8.0", 7.5), 16);
      assert.equal(calculateBandMatchBonus("Band 7.0", 6.5), 16);
    });

    it("awards minor bonus (8) for acceptable match (within 1.0 band)", () => {
      assert.equal(calculateBandMatchBonus("Band 8.0", 7.0), 8);
      assert.equal(calculateBandMatchBonus("Band 6.0", 7.0), 8);
    });

    it("awards 0 bonus for distant band differences", () => {
      assert.equal(calculateBandMatchBonus("Band 8.5", 6.0), 0);
    });
  });

  describe("filterKeywordsByTargetBand", () => {
    const sampleKeywords = [
      { word: "phraseA", band: "Band 8.5" },
      { word: "phraseB", band: "Band 7.0" },
      { word: "phraseC", band: "Band 6.5" },
      { word: "phraseD", band: "Band 8.0" },
    ];

    it("non-strict: sorts keywords by closeness to targetBand", () => {
      const sorted = filterKeywordsByTargetBand(sampleKeywords, 7.0, false);
      assert.equal(sorted[0].word, "phraseB"); // Exactly 7.0
      assert.equal(sorted[1].word, "phraseC"); // 6.5 (diff 0.5)
    });

    it("strict: filters keywords to only those within ±0.6 of targetBand", () => {
      const filtered = filterKeywordsByTargetBand(sampleKeywords, 7.0, true);
      const words = filtered.map((k) => k.word);
      assert.ok(words.includes("phraseB"));
      assert.ok(words.includes("phraseC"));
      assert.ok(!words.includes("phraseA")); // 8.5 is diff 1.5
    });

    it("handles empty or invalid inputs safely", () => {
      assert.deepEqual(filterKeywordsByTargetBand(null), []);
      assert.deepEqual(filterKeywordsByTargetBand([]), []);
    });
  });
});
