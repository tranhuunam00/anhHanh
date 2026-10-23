import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  escapeRegExp,
  buildFlexiblePhrasePattern,
  extractSentenceFromText,
  parseHighlightedStorySegments,
  checkTargetWordsCoverage,
} from "../src/utils/storyHighlightUtils.js";

describe("storyHighlightUtils - escapeRegExp", () => {
  test("escapes regex metacharacters correctly", () => {
    assert.equal(escapeRegExp("word (test) [1] + 2 * 3?"), "word \\(test\\) \\[1\\] \\+ 2 \\* 3\\?");
    assert.equal(escapeRegExp("^start$ | end"), "\\^start\\$ \\| end");
  });

  test("handles empty, non-string, or boundary inputs", () => {
    assert.equal(escapeRegExp(""), "");
    assert.equal(escapeRegExp(null), "");
    assert.equal(escapeRegExp(undefined), "");
    assert.equal(escapeRegExp(123), "");
  });
});

describe("storyHighlightUtils - buildFlexiblePhrasePattern", () => {
  test("joins tokens with hyphen/space flexible matcher", () => {
    assert.equal(buildFlexiblePhrasePattern("paint splashes"), "paint[-\\s]+splashes");
    assert.equal(buildFlexiblePhrasePattern("ultra-violet rays"), "ultra[-\\s]+violet[-\\s]+rays");
  });

  test("handles single words and irregular spacing", () => {
    assert.equal(buildFlexiblePhrasePattern("correlation"), "correlation");
    assert.equal(buildFlexiblePhrasePattern("  high   school   diploma  "), "high[-\\s]+school[-\\s]+diploma");
  });

  test("handles empty or invalid inputs", () => {
    assert.equal(buildFlexiblePhrasePattern(""), "");
    assert.equal(buildFlexiblePhrasePattern("   "), "");
    assert.equal(buildFlexiblePhrasePattern(null), "");
    assert.equal(buildFlexiblePhrasePattern(undefined), "");
  });
});

describe("storyHighlightUtils - extractSentenceFromText", () => {
  const story = "Maya wiped paint splashes from her apron. Her art class was a welcome break. She loved designing.";

  test("extracts correct sentence containing multi-word target", () => {
    const s1 = extractSentenceFromText(story, "paint splashes");
    assert.equal(s1, "Maya wiped paint splashes from her apron.");
  });

  test("extracts sentence containing single word case-insensitively", () => {
    const s2 = extractSentenceFromText(story, "Art Class");
    assert.equal(s2, "Her art class was a welcome break.");
  });

  test("falls back to full text if word is not found", () => {
    const s3 = extractSentenceFromText(story, "nonexistent");
    assert.equal(s3, story);
  });

  test("handles edge cases and null/empty inputs", () => {
    assert.equal(extractSentenceFromText("", "word"), "");
    assert.equal(extractSentenceFromText(null, "word"), "");
    assert.equal(extractSentenceFromText(story, ""), story);
    assert.equal(extractSentenceFromText(story, null), story);
  });
});

describe("storyHighlightUtils - parseHighlightedStorySegments", () => {
  const sampleStory =
    "Maya wiped accidental paint splashes from her apron. She received a high school diploma and reviewed a diploma course prospectus.";

  const targets = [
    { word: "paint splashes", meaning: "vệt sơn" },
    { word: "high school diploma", meaning: "bằng cấp 3" },
    { word: "diploma course prospectus", meaning: "bản cáo bạch" },
    { word: "diploma", meaning: "văn bằng" },
  ];

  test("happy path: accurately matches multi-word phrases and longer phrases first", () => {
    const segments = parseHighlightedStorySegments(sampleStory, targets);
    assert.ok(segments.length > 1);

    const targetSegments = segments.filter((s) => s.isTarget);
    assert.equal(targetSegments.length, 3);
    assert.equal(targetSegments[0].text, "paint splashes");
    assert.equal(targetSegments[0].targetWord, "paint splashes");

    assert.equal(targetSegments[1].text, "high school diploma");
    assert.equal(targetSegments[1].targetWord, "high school diploma");

    // "diploma course prospectus" should match as the longer phrase instead of subphrase "diploma"
    assert.equal(targetSegments[2].text, "diploma course prospectus");
    assert.equal(targetSegments[2].targetWord, "diploma course prospectus");
  });

  test("handles hyphenated and case-variant matches", () => {
    const text = "Levels of ultra-violet radiation and MICROPLASTIC particles were alarming.";
    const vocab = ["ultra violet radiation", "microplastic particles"];
    const segments = parseHighlightedStorySegments(text, vocab);

    const targetsFound = segments.filter((s) => s.isTarget);
    assert.equal(targetsFound.length, 2);
    assert.equal(targetsFound[0].text, "ultra-violet radiation");
    assert.equal(targetsFound[1].text, "MICROPLASTIC particles");
  });

  test("boundary & edge cases: empty target words or empty story", () => {
    assert.deepEqual(parseHighlightedStorySegments("", targets), []);
    assert.deepEqual(parseHighlightedStorySegments(null, targets), []);

    const noTargets = parseHighlightedStorySegments("Hello world.", []);
    assert.equal(noTargets.length, 1);
    assert.equal(noTargets[0].isTarget, false);
    assert.equal(noTargets[0].text, "Hello world.");
  });

  test("boundary case: target word at start and end of string", () => {
    const text = "paint splashes on the table fins";
    const vocab = ["paint splashes", "fins"];
    const segments = parseHighlightedStorySegments(text, vocab);

    assert.equal(segments[0].isTarget, true);
    assert.equal(segments[0].text, "paint splashes");
    assert.equal(segments[segments.length - 1].isTarget, true);
    assert.equal(segments[segments.length - 1].text, "fins");
  });
});

describe("storyHighlightUtils - checkTargetWordsCoverage", () => {
  const story = "Maya wiped paint splashes. She studied correlation and pliable material.";
  const targets = [
    { word: "paint splashes" },
    { word: "correlation" },
    { word: "pliable material" },
    { word: "missing target" },
  ];

  test("calculates coverage and lists missing target words accurately", () => {
    const stats = checkTargetWordsCoverage(story, targets);
    assert.equal(stats.foundWords.size, 3);
    assert.ok(stats.foundWords.has("paint splashes"));
    assert.ok(stats.foundWords.has("correlation"));
    assert.ok(stats.foundWords.has("pliable material"));
    assert.deepEqual(stats.missingWords, ["missing target"]);
    assert.equal(stats.coveragePercent, 75); // 3 out of 4
  });

  test("handles empty inputs safely", () => {
    const emptyStats = checkTargetWordsCoverage("", []);
    assert.equal(emptyStats.coveragePercent, 0);
    assert.deepEqual(emptyStats.missingWords, []);
  });
});
