import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { IELTS_TESTS, getIeltsTestById } from "../src/data/ielts/index.js";
import {
  CAMBRIDGE_17_LESSONS,
  CAMBRIDGE_17_FULL_LESSONS
} from "../src/constants/ieltsCambridge17Presets.js";
import {
  findIeltsPresetByAudioUrl,
  resolveAudioPresetFromUrl
} from "../src/utils/ieltsPresetResolver.js";
import { usesDataDrivenListeningRenderer } from "../src/utils/ieltsListeningRendererRouting.js";
import { buildIeltsAudioLesson } from "../src/utils/ieltsDictationChallengeBuilder.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.resolve(__dirname, "../public");

test("Cambridge 17 - All 4 tests registered in IELTS_TESTS", () => {
  for (let t = 1; t <= 4; t++) {
    const testId = `cambridge-17-test-${t}`;
    const testMeta = IELTS_TESTS.find((item) => item.id === testId);
    assert.ok(testMeta, `Test ${testId} must exist in IELTS_TESTS`);
    assert.equal(testMeta.book, "Cambridge 17");
    assert.equal(testMeta.testNumber, t);
    assert.ok(testMeta.data, "Must contain full test data");
  }
});

test("Cambridge 17 - Data-driven listening routing enabled", () => {
  for (let t = 1; t <= 4; t++) {
    const testId = `cambridge-17-test-${t}`;
    assert.equal(
      usesDataDrivenListeningRenderer(testId),
      true,
      `${testId} must use data-driven listening renderer`
    );
  }
});

test("Cambridge 17 - Audio files physically exist on disk", () => {
  // 4 Full test audio files
  for (let t = 1; t <= 4; t++) {
    const fullAudioPath = path.join(PUBLIC_DIR, "audio", `Cambridge 17 - Test ${t}.mp3`);
    assert.ok(
      fs.existsSync(fullAudioPath),
      `Full audio file must exist: ${fullAudioPath}`
    );
    const stat = fs.statSync(fullAudioPath);
    assert.ok(stat.size > 20_000_000, `Audio file must be > 20MB (got ${stat.size})`);
  }

  // 16 Split audio files
  for (let t = 1; t <= 4; t++) {
    for (let p = 1; p <= 4; p++) {
      const splitPath = path.join(
        PUBLIC_DIR,
        "audio/cambridge17/split",
        `Test${t} Part${p}.mp3`
      );
      assert.ok(
        fs.existsSync(splitPath),
        `Split audio file must exist: ${splitPath}`
      );
      const stat = fs.statSync(splitPath);
      assert.ok(stat.size > 4_000_000, `Split file must be > 4MB (got ${stat.size})`);
    }
  }
});

test("Cambridge 17 - Each test has exactly 40 Listening questions and 40 Reading questions", () => {
  for (let t = 1; t <= 4; t++) {
    const testId = `cambridge-17-test-${t}`;
    const testObj = getIeltsTestById(testId);
    assert.ok(testObj, `Found ${testId}`);

    // Listening
    const listening = testObj.data.skills.listening;
    assert.ok(listening, "Listening module must exist");
    const lQuestions = [];
    for (const part of listening.parts) {
      if (Array.isArray(part.items)) {
        for (const item of part.items) {
          lQuestions.push(item.number);
        }
      }
    }
    assert.equal(lQuestions.length, 40, `Test ${t} Listening must have exactly 40 questions`);
    for (let q = 1; q <= 40; q++) {
      assert.ok(lQuestions.includes(q), `Test ${t} Listening must include Q${q}`);
    }

    // Reading
    const reading = testObj.data.skills.reading;
    assert.ok(reading, "Reading module must exist");
    const rQuestions = [];
    for (const passage of reading.passages) {
      if (Array.isArray(passage.groups)) {
        for (const g of passage.groups) {
          if (Array.isArray(g.items)) {
            for (const item of g.items) {
              rQuestions.push(item.number);
            }
          }
        }
      }
    }
    assert.equal(rQuestions.length, 40, `Test ${t} Reading must have exactly 40 questions`);
    for (let q = 1; q <= 40; q++) {
      assert.ok(rQuestions.includes(q), `Test ${t} Reading must include Q${q}`);
    }
  }
});

test("Cambridge 17 - Writing task 1 images exist on disk", () => {
  for (let t = 1; t <= 4; t++) {
    const imgPath = path.join(
      PUBLIC_DIR,
      "images/ielts",
      `cam17_test${t}_writing_task1.png`
    );
    assert.ok(
      fs.existsSync(imgPath),
      `Writing Task 1 image must exist: ${imgPath}`
    );
    const stat = fs.statSync(imgPath);
    assert.ok(stat.size > 50_000, `Image size should be substantial (got ${stat.size})`);
  }
});

test("Cambridge 17 - Presets correctly resolve from audio URLs", () => {
  // Test full preset resolution
  for (let t = 1; t <= 4; t++) {
    const url = `/audio/Cambridge 17 - Test ${t}.mp3`;
    const preset = findIeltsPresetByAudioUrl(url);
    assert.ok(preset, `Preset should resolve for ${url}`);
    assert.equal(preset.id, `cam17-t${t}-full`);

    const resolved = resolveAudioPresetFromUrl(url);
    assert.ok(resolved, `Resolved preset for ${url}`);
    assert.equal(resolved.id, `cam17-t${t}-full`);
  }

  // Test split preset resolution
  for (let t = 1; t <= 4; t++) {
    for (let p = 1; p <= 4; p++) {
      const url = `/audio/cambridge17/split/Test${t} Part${p}.mp3`;
      const preset = findIeltsPresetByAudioUrl(url);
      assert.ok(preset, `Preset should resolve for ${url}`);
      assert.equal(preset.id, `cam17-t${t}-s${p}`);
    }
  }
});

test("Cambridge 17 - Dictation Challenge Builder loads full authentic challenges", () => {
  // Split presets should have 45-80 challenges each
  for (const preset of CAMBRIDGE_17_LESSONS) {
    const lesson = buildIeltsAudioLesson(preset);
    assert.ok(lesson, `Should build lesson for ${preset.id}`);
    assert.ok(
      lesson.challenges.length >= 40,
      `Preset ${preset.id} must have >= 40 challenges (got ${lesson.challenges.length})`
    );
    assert.ok(lesson.challenges[0].text, "First challenge must have text");
    assert.ok(lesson.challenges[0].time_start !== undefined, "Must have time_start");
  }

  // Full presets should have 230-270 challenges each
  for (const preset of CAMBRIDGE_17_FULL_LESSONS) {
    const lesson = buildIeltsAudioLesson(preset);
    assert.ok(lesson, `Should build lesson for ${preset.id}`);
    assert.ok(
      lesson.challenges.length >= 220,
      `Full preset ${preset.id} must have >= 220 challenges (got ${lesson.challenges.length})`
    );
  }
});

