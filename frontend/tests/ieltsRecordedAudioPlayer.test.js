import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { formatAudioTime } from "../src/utils/ieltsScoring.js";

describe("IeltsRecordedAudioPlayer - formatAudioTime", () => {
  it("formats zero and standard seconds correctly", () => {
    assert.strictEqual(formatAudioTime(0), "00:00");
    assert.strictEqual(formatAudioTime(8), "00:08");
    assert.strictEqual(formatAudioTime(45), "00:45");
    assert.strictEqual(formatAudioTime(60), "01:00");
    assert.strictEqual(formatAudioTime(125), "02:05");
  });

  it("handles decimal seconds by rounding down to integer seconds", () => {
    assert.strictEqual(formatAudioTime(8.75), "00:08");
    assert.strictEqual(formatAudioTime(65.2), "01:05");
  });

  it("handles negative numbers, NaN, Infinity gracefully", () => {
    assert.strictEqual(formatAudioTime(-5), "00:00");
    assert.strictEqual(formatAudioTime(NaN), "00:00");
    assert.strictEqual(formatAudioTime(Infinity), "00:00");
    assert.strictEqual(formatAudioTime(-Infinity), "00:00");
    assert.strictEqual(formatAudioTime(null), "00:00");
    assert.strictEqual(formatAudioTime(undefined), "00:00");
  });
});
