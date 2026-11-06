import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  parseDurationToSeconds,
  extractItemsFromPart,
  formatChallengeText,
  buildIeltsAudioLesson
} from "../src/utils/ieltsDictationChallengeBuilder.js";
import { CAMBRIDGE_19_LESSONS, CAMBRIDGE_19_FULL_LESSONS } from "../src/constants/ieltsCambridge19Presets.js";
import { CAMBRIDGE_20_LESSONS, CAMBRIDGE_20_FULL_LESSONS } from "../src/constants/ieltsCambridge20Presets.js";
import { CAMBRIDGE_21_LESSONS } from "../src/constants/ieltsCambridge21Presets.js";

describe("ieltsDictationChallengeBuilder - Unit Tests", () => {
  describe("parseDurationToSeconds", () => {
    test("Parses MM:SS string correctly", () => {
      assert.equal(parseDurationToSeconds("05:12"), 312);
      assert.equal(parseDurationToSeconds("06:49"), 409);
      assert.equal(parseDurationToSeconds("01:30"), 90);
      assert.equal(parseDurationToSeconds("30:45"), 1845);
    });

    test("Parses HH:MM:SS string correctly", () => {
      assert.equal(parseDurationToSeconds("01:05:20"), 3920);
      assert.equal(parseDurationToSeconds("00:10:00"), 600);
    });

    test("Falls back to 300 for null, empty or invalid strings", () => {
      assert.equal(parseDurationToSeconds(""), 300);
      assert.equal(parseDurationToSeconds(null), 300);
      assert.equal(parseDurationToSeconds(undefined), 300);
      assert.equal(parseDurationToSeconds("invalid"), 300);
    });
  });

  describe("extractItemsFromPart", () => {
    test("Extracts items from flat .items array", () => {
      const part = {
        items: [{ number: 1, type: "fill_notes" }, { number: 2, type: "fill_notes" }]
      };
      const items = extractItemsFromPart(part);
      assert.equal(items.length, 2);
      assert.equal(items[0].number, 1);
    });

    test("Extracts items from nested .groups[].items array", () => {
      const part = {
        groups: [
          { items: [{ number: 1 }, { number: 2 }] },
          { items: [{ number: 3 }, { number: 4 }] }
        ]
      };
      const items = extractItemsFromPart(part);
      assert.equal(items.length, 4);
      assert.equal(items[2].number, 3);
    });

    test("Handles empty or invalid part gracefully", () => {
      assert.deepEqual(extractItemsFromPart(null), []);
      assert.deepEqual(extractItemsFromPart({}), []);
    });
  });

  describe("formatChallengeText", () => {
    test("Formats fill_notes with prefix, answer and suffix", () => {
      const item = {
        prefix: "Area: covers ",
        suffix: " hectares",
        answers: ["69"]
      };
      const result = formatChallengeText(item, 1);
      assert.equal(result, "Area: covers 69 hectares.");
    });

    test("Formats multiple choice with question and matching option", () => {
      const item = {
        question: "During the visit to Malmedy, participants will stay",
        options: ["A. in a hotel.", "B. with local families.", "C. on a campsite."],
        answers: ["B"]
      };
      const result = formatChallengeText(item, 11);
      assert.equal(result, "During the visit to Malmedy, participants will stay - B. with local families.");
    });

    test("Formats statement items", () => {
      const item = { statement: "The park is open year round" };
      const result = formatChallengeText(item, 5);
      assert.equal(result, "The park is open year round.");
    });

    test("Fallback when item has no recognized structure", () => {
      const result = formatChallengeText({}, 7);
      assert.equal(result, "Cambridge IELTS Listening Task Question 7.");
    });
  });

  describe("buildIeltsAudioLesson", () => {
    test("Builds lesson for Cambridge 19 split task with authentic challenges", () => {
      const preset = CAMBRIDGE_19_LESSONS[0]; // Cam 19 Test 1 Task 1
      const lesson = buildIeltsAudioLesson(preset);

      assert.ok(lesson);
      assert.equal(lesson.video_id, preset.id);
      assert.equal(lesson.title, preset.title);
      assert.equal(lesson.isAudio, true);
      assert.equal(lesson.audioUrl, preset.audioUrl);
      assert.ok(lesson.challenges.length >= 10);

      // Verify first challenge properties
      const c1 = lesson.challenges[0];
      assert.equal(c1.position, 1);
      assert.equal(typeof c1.time_start, "number");
      assert.equal(typeof c1.time_end, "number");
      assert.ok(c1.time_end > c1.time_start);
      assert.ok(c1.text.length > 5);
      assert.ok(c1.words.length > 0);
    });

    test("Builds lesson for Cambridge 19 full combined test", () => {
      const preset = CAMBRIDGE_19_FULL_LESSONS[0]; // Cam 19 Test 1 Full
      const lesson = buildIeltsAudioLesson(preset);

      assert.ok(lesson);
      assert.equal(lesson.isAudio, true);
      assert.equal(lesson.challenges.length, 40);
      assert.equal(lesson.total_challenges, 40);
      assert.equal(lesson.audioUrl, "/audio/Cambridge 19 - Test 1.mp3");
    });

    test("Builds lesson for Cambridge 20 split task and full test", () => {
      const splitPreset = CAMBRIDGE_20_LESSONS[0];
      const splitLesson = buildIeltsAudioLesson(splitPreset);
      assert.ok(splitLesson);
      assert.equal(splitLesson.isAudio, true);
      assert.ok(splitLesson.challenges.length > 0);

      const fullPreset = CAMBRIDGE_20_FULL_LESSONS[0];
      const fullLesson = buildIeltsAudioLesson(fullPreset);
      assert.ok(fullLesson);
      assert.ok(fullLesson.challenges.length >= 30);
    });

    test("Builds lesson for Cambridge 21 full test", () => {
      const preset = CAMBRIDGE_21_LESSONS[0];
      const lesson = buildIeltsAudioLesson(preset);
      assert.ok(lesson);
      assert.equal(lesson.isAudio, true);
      assert.ok(lesson.challenges.length >= 30);
    });

    test("Returns null for null or invalid preset", () => {
      assert.equal(buildIeltsAudioLesson(null), null);
      assert.equal(buildIeltsAudioLesson(undefined), null);
    });
  });
});
