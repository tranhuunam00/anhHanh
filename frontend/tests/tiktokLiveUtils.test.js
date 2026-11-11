import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeTikTokAnswer,
  calculateVotePercentages,
  formatViewerPoints,
  getRankBadge,
} from "../src/utils/tiktokLiveUtils.js";

test("normalizeTikTokAnswer extracts single letter or raw text", () => {
  assert.equal(normalizeTikTokAnswer("A"), "A");
  assert.equal(normalizeTikTokAnswer("b"), "B");
  assert.equal(normalizeTikTokAnswer("C."), "C");
  assert.equal(normalizeTikTokAnswer("d)"), "D");
  assert.equal(normalizeTikTokAnswer("dap an B"), "B");
  assert.equal(normalizeTikTokAnswer("chọn c"), "C");
  assert.equal(normalizeTikTokAnswer(""), "");
  assert.equal(normalizeTikTokAnswer(null), "");
  assert.equal(normalizeTikTokAnswer(undefined), "");
});

test("calculateVotePercentages computes correct shares", () => {
  // Empty votes
  assert.deepEqual(calculateVotePercentages({}), { A: 0, B: 0, C: 0, D: 0, total: 0 });
  assert.deepEqual(calculateVotePercentages(null), { A: 0, B: 0, C: 0, D: 0, total: 0 });

  // Normal distribution
  const res = calculateVotePercentages({ A: 10, B: 20, C: 10, D: 10 });
  assert.equal(res.total, 50);
  assert.equal(res.A, 20);
  assert.equal(res.B, 40);
  assert.equal(res.C, 20);
  assert.equal(res.D, 20);
});

test("formatViewerPoints formats numbers into Vietnamese locale string with pts", () => {
  assert.ok(formatViewerPoints(100).includes("100 pts"));
  assert.ok(formatViewerPoints(0).includes("0 pts"));
  assert.ok(formatViewerPoints(null).includes("0 pts"));
});

test("getRankBadge returns proper metadata for top 3 and others", () => {
  const top1 = getRankBadge(0);
  assert.equal(top1.label, "TOP 1");
  assert.equal(top1.color, "#eab308");

  const top2 = getRankBadge(1);
  assert.equal(top2.label, "TOP 2");

  const top3 = getRankBadge(2);
  assert.equal(top3.label, "TOP 3");

  const top4 = getRankBadge(3);
  assert.equal(top4.label, "#4");
});

