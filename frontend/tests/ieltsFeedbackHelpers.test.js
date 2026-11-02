import test from "node:test";
import assert from "node:assert/strict";
import { isSingleLetterLabel, getFeedbackClass } from "../src/utils/ieltsFeedbackUtils.js";

test("isSingleLetterLabel Unit Tests", async (t) => {
  await t.test("happy path: identifies uppercase single letters", () => {
    assert.equal(isSingleLetterLabel("A"), true);
    assert.equal(isSingleLetterLabel("B"), true);
    assert.equal(isSingleLetterLabel("Z"), true);
    assert.equal(isSingleLetterLabel("G"), true);
    assert.equal(isSingleLetterLabel(" A "), true); // trimmed
    assert.equal(isSingleLetterLabel("F\n"), true); // trimmed
  });

  await t.test("negative cases: phrases, multiple letters, lowercase, or digits", () => {
    assert.equal(isSingleLetterLabel("Paragraph 1"), false);
    assert.equal(isSingleLetterLabel("Section A"), false);
    assert.equal(isSingleLetterLabel("AB"), false);
    assert.equal(isSingleLetterLabel("a"), false);
    assert.equal(isSingleLetterLabel("1"), false);
    assert.equal(isSingleLetterLabel(""), false);
    assert.equal(isSingleLetterLabel("   "), false);
  });

  await t.test("boundary & bad inputs: null, undefined, non-string types", () => {
    assert.equal(isSingleLetterLabel(null), false);
    assert.equal(isSingleLetterLabel(undefined), false);
    assert.equal(isSingleLetterLabel(123), false);
    assert.equal(isSingleLetterLabel({}), false);
    assert.equal(isSingleLetterLabel(["A"]), false);
    assert.equal(isSingleLetterLabel(true), false);
  });
});

test("getFeedbackClass Unit Tests", async (t) => {
  await t.test("happy path: returns input-correct or input-incorrect when in review mode", () => {
    const evalData = {
      1: { isCorrect: true, accepted: ["whales"] },
      2: { isCorrect: false, accepted: ["dolphins"] }
    };
    assert.equal(getFeedbackClass(evalData, 1, true), "input-correct");
    assert.equal(getFeedbackClass(evalData, 2, true), "input-incorrect");
  });

  await t.test("returns empty string when isReview is false", () => {
    const evalData = { 1: { isCorrect: true } };
    assert.equal(getFeedbackClass(evalData, 1, false), "");
    assert.equal(getFeedbackClass(evalData, 1), "");
  });

  await t.test("returns empty string on missing or invalid evaluation objects", () => {
    assert.equal(getFeedbackClass(null, 1, true), "");
    assert.equal(getFeedbackClass(undefined, 1, true), "");
    assert.equal(getFeedbackClass({}, 1, true), "");
    assert.equal(getFeedbackClass({ 2: { isCorrect: true } }, 1, true), "");
  });
});
