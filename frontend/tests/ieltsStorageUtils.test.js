import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  canUseIeltsAiGrading,
  getIeltsStorageKey,
  saveIeltsSubmission,
  getIeltsSubmission,
  clearIeltsSubmission,
  formatAudioTime
} from "../src/utils/ieltsStorageUtils.js";

describe("ieltsStorageUtils - canUseIeltsAiGrading", () => {
  test("authorizes designated primary gmail accounts and variants", () => {
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
  });
});

describe("ieltsStorageUtils - storage helpers", () => {
  test("generates expected localStorage key", () => {
    assert.equal(getIeltsStorageKey("cambridge-18-test-1", "listening"), "ielts_sub_cambridge-18-test-1_listening");
  });

  test("handles storage persistence gracefully in node environment", () => {
    assert.doesNotThrow(() => saveIeltsSubmission("test", "reading", { score: 30 }));
    assert.equal(getIeltsSubmission("test", "reading"), null);
    assert.doesNotThrow(() => clearIeltsSubmission("test"));
    assert.doesNotThrow(() => clearIeltsSubmission("test", "reading"));
  });
});

describe("ieltsStorageUtils - formatAudioTime", () => {
  test("formats standard seconds to MM:SS format", () => {
    assert.equal(formatAudioTime(0), "00:00");
    assert.equal(formatAudioTime(59), "00:59");
    assert.equal(formatAudioTime(60), "01:00");
    assert.equal(formatAudioTime(125), "02:05");
    assert.equal(formatAudioTime(1980), "33:00");
  });

  test("boundary & bad inputs: handles NaN, Infinity, negative, null", () => {
    assert.equal(formatAudioTime(NaN), "00:00");
    assert.equal(formatAudioTime(Infinity), "00:00");
    assert.equal(formatAudioTime(-10), "00:00");
    assert.equal(formatAudioTime(null), "00:00");
    assert.equal(formatAudioTime("120"), "00:00");
  });
});

