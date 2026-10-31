import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  normalizeIeltsAnswer,
  checkIeltsAnswer,
  getListeningBandScore,
  getReadingBandScore,
  canUseIeltsAiGrading,
  getIeltsStorageKey,
  saveIeltsSubmission,
  getIeltsSubmission
} from "../src/utils/ieltsScoring.js";

describe("ieltsScoring - normalizeIeltsAnswer", () => {
  test("happy path: trims, lowercases, and cleans basic string", () => {
    assert.equal(normalizeIeltsAnswer("  Hello World  "), "hello world");
    assert.equal(normalizeIeltsAnswer("VIETNAMESE FOOD."), "vietnamese food");
  });

  test("input coverage: handles null, undefined, numbers, and boolean gracefully", () => {
    assert.equal(normalizeIeltsAnswer(null), "");
    assert.equal(normalizeIeltsAnswer(undefined), "");
    assert.equal(normalizeIeltsAnswer(48), "48");
    assert.equal(normalizeIeltsAnswer(0), "0");
    assert.equal(normalizeIeltsAnswer(true), "true");
  });

  test("internal logic: converts curly apostrophes and collapses extra spaces", () => {
    assert.equal(normalizeIeltsAnswer("don’t   worry"), "don't worry");
    assert.equal(normalizeIeltsAnswer("“special”   deal"), '"special" deal');
  });

  test("boundary & bad cases: strips trailing punctuation marks", () => {
    assert.equal(normalizeIeltsAnswer("natural;"), "natural");
    assert.equal(normalizeIeltsAnswer("pizza..."), "pizza");
    assert.equal(normalizeIeltsAnswer("   "), "");
  });
});

describe("ieltsScoring - checkIeltsAnswer", () => {
  test("happy path: matches exact and case-insensitive strings", () => {
    assert.equal(checkIeltsAnswer("pizza", ["pizza"]), true);
    assert.equal(checkIeltsAnswer("PIZZA", "pizza"), true);
    assert.equal(checkIeltsAnswer("India", ["India"]), true);
  });

  test("slash alternatives: correctly handles slash separated keys", () => {
    assert.equal(checkIeltsAnswer("jewelry", ["jewellery / jewelry"]), true);
    assert.equal(checkIeltsAnswer("jewellery", ["jewellery / jewelry"]), true);
    assert.equal(checkIeltsAnswer("forty-eight", ["48 / forty-eight"]), true);
    assert.equal(checkIeltsAnswer("48", ["48 / forty-eight"]), true);
  });

  test("parentheses optional parts: correctly accepts answers with or without optional text", () => {
    const accepted = ["(the) 13(th) (of) January / 13.01 / 13.1"];
    assert.equal(checkIeltsAnswer("13.01", accepted), true);
    assert.equal(checkIeltsAnswer("13.1", accepted), true);
    assert.equal(checkIeltsAnswer("13th of January", ["(the) 13(th) (of) January"]), true);
    assert.equal(checkIeltsAnswer("the 13th of January", ["(the) 13(th) (of) January"]), true);
    assert.equal(checkIeltsAnswer("13 January", ["(the) 13(th) (of) January"]), true);
  });

  test("currency and numeric formatting: matches with or without currency signs and decimal zeroes", () => {
    assert.equal(checkIeltsAnswer("£48", ["48"]), true);
    assert.equal(checkIeltsAnswer("48", ["£48"]), true);
    assert.equal(checkIeltsAnswer("67.5", ["67.50"]), true);
    assert.equal(checkIeltsAnswer("67.50", ["67.5"]), true);
  });

  test("boundary & bad cases: returns false on wrong, empty, null or undefined input", () => {
    assert.equal(checkIeltsAnswer("", ["pizza"]), false);
    assert.equal(checkIeltsAnswer(null, ["pizza"]), false);
    assert.equal(checkIeltsAnswer("burger", ["pizza"]), false);
    assert.equal(checkIeltsAnswer("pizza", []), false);
  });
});

describe("ieltsScoring - getListeningBandScore", () => {
  test("happy path: standard score conversion", () => {
    assert.equal(getListeningBandScore(40), 9.0);
    assert.equal(getListeningBandScore(39), 9.0);
    assert.equal(getListeningBandScore(37), 8.5);
    assert.equal(getListeningBandScore(35), 8.0);
    assert.equal(getListeningBandScore(32), 7.5);
    assert.equal(getListeningBandScore(30), 7.0);
    assert.equal(getListeningBandScore(26), 6.5);
    assert.equal(getListeningBandScore(23), 6.0);
    assert.equal(getListeningBandScore(18), 5.5);
    assert.equal(getListeningBandScore(16), 5.0);
  });

  test("boundary cases: min, max, clamp outside boundaries", () => {
    assert.equal(getListeningBandScore(50), 9.0);
    assert.equal(getListeningBandScore(-5), 1.0);
    assert.equal(getListeningBandScore(0), 1.0);
    assert.equal(getListeningBandScore(3), 2.0);
    assert.equal(getListeningBandScore(5), 2.5);
    assert.equal(getListeningBandScore(7), 3.0);
  });

  test("bad inputs: handles null, undefined, non-numeric strings safely", () => {
    assert.equal(getListeningBandScore(null), 1.0);
    assert.equal(getListeningBandScore(undefined), 1.0);
    assert.equal(getListeningBandScore("invalid"), 1.0);
    assert.equal(getListeningBandScore("30"), 7.0);
  });
});

describe("ieltsScoring - getReadingBandScore", () => {
  test("happy path: standard Academic Reading score conversion", () => {
    assert.equal(getReadingBandScore(39), 9.0);
    assert.equal(getReadingBandScore(37), 8.5);
    assert.equal(getReadingBandScore(35), 8.0);
    assert.equal(getReadingBandScore(33), 7.5);
    assert.equal(getReadingBandScore(30), 7.0);
    assert.equal(getReadingBandScore(27), 6.5);
    assert.equal(getReadingBandScore(23), 6.0);
    assert.equal(getReadingBandScore(19), 5.5);
    assert.equal(getReadingBandScore(15), 5.0);
  });

  test("boundary & bad inputs: clamp, min, max, non-numeric", () => {
    assert.equal(getReadingBandScore(40), 9.0);
    assert.equal(getReadingBandScore(100), 9.0);
    assert.equal(getReadingBandScore(0), 1.0);
    assert.equal(getReadingBandScore(-10), 1.0);
    assert.equal(getReadingBandScore(null), 1.0);
    assert.equal(getReadingBandScore("NaN"), 1.0);
  });
});

describe("ieltsScoring - canUseIeltsAiGrading", () => {
  test("authorizes the 3 designated primary gmail accounts and variants", () => {
    assert.equal(canUseIeltsAiGrading({ email: "tranhuunam23022000@gmail.com" }), true);
    assert.equal(canUseIeltsAiGrading({ email: "TRANHUUNAM23022000@GMAIL.COM" }), true);
    assert.equal(canUseIeltsAiGrading({ email: "vuthiquynhtrangbl6d@gmail.com" }), true);
    assert.equal(canUseIeltsAiGrading({ email: "vuthiquynhtrang@gmail.com" }), true);
    assert.equal(canUseIeltsAiGrading({ email: "itdaogroup@gmail.com" }), true);
  });

  test("authorizes users with explicit permissions or ADMIN role", () => {
    assert.equal(canUseIeltsAiGrading({ email: "other@gmail.com", can_use_ai_writing: true }), true);
    assert.equal(canUseIeltsAiGrading({ email: "student@school.edu", role: "ADMIN" }), true);
  });

  test("denies access to unauthorized users or missing user object", () => {
    assert.equal(canUseIeltsAiGrading(null), false);
    assert.equal(canUseIeltsAiGrading(undefined), false);
    assert.equal(canUseIeltsAiGrading({ email: "student_ielts@gmail.com" }), false);
    assert.equal(canUseIeltsAiGrading({ email: "random_user@yahoo.com" }), false);
  });
});

describe("ieltsScoring - storage helpers", () => {
  test("generates expected localStorage key", () => {
    assert.equal(getIeltsStorageKey("cambridge-21-test-2", "listening"), "ielts_sub_cambridge-21-test-2_listening");
  });

  test("handles storage persistence gracefully in node environment", () => {
    // In node test environment without browser localStorage, functions do not throw
    assert.doesNotThrow(() => saveIeltsSubmission("test", "reading", { score: 30 }));
    assert.equal(getIeltsSubmission("test", "reading"), null);
  });
});

