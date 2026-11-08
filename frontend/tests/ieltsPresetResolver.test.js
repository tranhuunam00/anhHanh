import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  normalizeAudioUrl,
  findIeltsPresetByAudioUrl,
  resolveAudioPresetFromUrl,
} from "../src/utils/ieltsPresetResolver.js";
import { buildIeltsAudioLesson } from "../src/utils/ieltsDictationChallengeBuilder.js";

describe("ieltsPresetResolver - normalizeAudioUrl", () => {
  test("decodes percent-encoding, strips query/hash and lowercases", () => {
    assert.equal(
      normalizeAudioUrl("/audio/Cambridge%2021%20-%20Test%201.mp3?v=1#x"),
      "/audio/cambridge 21 - test 1.mp3"
    );
  });

  test("handles empty, null and non-string input", () => {
    assert.equal(normalizeAudioUrl(""), "");
    assert.equal(normalizeAudioUrl(null), "");
    assert.equal(normalizeAudioUrl(123), "");
  });

  test("keeps raw value on malformed escape sequences", () => {
    assert.equal(normalizeAudioUrl("/audio/bad%E0%A4%A.mp3"), "/audio/bad%e0%a4%a.mp3");
  });
});

describe("ieltsPresetResolver - findIeltsPresetByAudioUrl / resolveAudioPresetFromUrl", () => {
  test("finds the Cambridge 21 full Test 1 preset by its audio url", () => {
    const p = findIeltsPresetByAudioUrl("/audio/Cambridge 21 - Test 1.mp3");
    assert.equal(p.id, "cam21-t1-full");
  });

  test("finds split task presets and encoded urls", () => {
    assert.equal(findIeltsPresetByAudioUrl("/audio/cambridge21/split/Test1%20Part1.mp3").id, "cam21-t1-s1");
  });

  test("returns null for unknown or empty urls", () => {
    assert.equal(findIeltsPresetByAudioUrl("/audio/unknown.mp3"), null);
    assert.equal(findIeltsPresetByAudioUrl(""), null);
  });

  test("resolve falls back to a generic preset for unknown urls", () => {
    const p = resolveAudioPresetFromUrl("/audio/unknown.mp3");
    assert.equal(p.id, "/audio/unknown.mp3");
    assert.equal(p.audioUrl, "/audio/unknown.mp3");
  });

  test("restoring the full Cam 21 Test 1 url yields the full transcript, not 10 placeholder sentences", () => {
    const lesson = buildIeltsAudioLesson(resolveAudioPresetFromUrl("/audio/Cambridge 21 - Test 1.mp3"));
    assert.equal(lesson.video_id, "cam21-t1-full");
    assert.equal(lesson.challenges.length > 200, true);
  });
});

