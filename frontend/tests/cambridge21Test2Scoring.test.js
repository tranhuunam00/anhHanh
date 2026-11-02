import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { cambridge21Test2 } from "../src/data/ielts/cambridge21Test2Data.js";
import {
  gradeListeningTest,
  gradeReadingTest
} from "../src/utils/ieltsScoring.js";

describe("Cambridge IELTS 21 Test 2 - Full Data Integrity", () => {
  test("test structure contains all 4 skills and meta fields", () => {
    assert.equal(cambridge21Test2.id, "cambridge-21-test-2");
    assert.equal(cambridge21Test2.testNumber, 2);
    assert.ok(cambridge21Test2.skills.listening);
    assert.ok(cambridge21Test2.skills.reading);
    assert.ok(cambridge21Test2.skills.writing);
    assert.ok(cambridge21Test2.skills.speaking);
  });

  test("listening module contains 4 parts and valid audio paths", () => {
    const listening = cambridge21Test2.skills.listening;
    assert.equal(listening.parts.length, 4);
    assert.equal(listening.audioUrl, "/audio/Cambridge 21 - Test 2.mp3");
  });

  test("writing module has task 1 image and both tasks prompts", () => {
    const writing = cambridge21Test2.skills.writing;
    assert.equal(writing.tasks.length, 2);
    assert.equal(writing.tasks[0].image, "/images/ielts/cam21_test2_writing_task1.png");
  });

  test("speaking module has 3 parts with questions and cue card", () => {
    const speaking = cambridge21Test2.skills.speaking;
    assert.equal(speaking.parts.length, 3);
  });
});

describe("Cambridge IELTS 21 Test 2 - Listening Grading (40 Questions)", () => {
  const officialAnswers = {
    1: "13th of January",
    2: "48",
    3: "pizza",
    4: "India",
    5: "mirror",
    6: "6th of April",
    7: "natural",
    8: "67.50",
    9: "shirt",
    10: "hammer",
    11: "B",
    12: "E",
    13: "C",
    14: "D",
    15: "F",
    16: "B",
    17: "D",
    18: "A",
    19: "H",
    20: "E",
    21: "B",
    22: "E",
    23: "C",
    24: "D",
    25: "A",
    26: "C",
    27: "C",
    28: "D",
    29: "F",
    30: "A",
    31: "pollution",
    32: "tax",
    33: "chocolate",
    34: "timing",
    35: "cost",
    36: "rules",
    37: "diving",
    38: "vegan",
    39: "wifi",
    40: "videos"
  };

  test("should score 40/40 and Band 9.0 with official answers", () => {
    const result = gradeListeningTest(cambridge21Test2.skills.listening, officialAnswers);
    assert.equal(result.correctCount, 40);
    assert.equal(result.bandScore, 9.0);
    assert.equal(Object.keys(result.evalMap).length, 40);

    // Verify Part 4 specifically (Q31-40)
    for (let i = 31; i <= 40; i++) {
      assert.ok(result.evalMap[i], `Question ${i} must exist in evalMap`);
      assert.equal(result.evalMap[i].isCorrect, true, `Question ${i} must be correct`);
    }
  });

  test("should correctly score partial and incorrect answers in Part 4", () => {
    const userAnswers = {
      ...officialAnswers,
      31: "cost",        // incorrect for 31
      32: "destination", // incorrect for 32
      33: "cartering",   // incorrect for 33
      34: "development"  // incorrect for 34
    };
    const result = gradeListeningTest(cambridge21Test2.skills.listening, userAnswers);
    assert.equal(result.correctCount, 36);
    assert.equal(result.evalMap[31].isCorrect, false);
    assert.equal(result.evalMap[32].isCorrect, false);
    assert.equal(result.evalMap[33].isCorrect, false);
    assert.equal(result.evalMap[34].isCorrect, false);
    assert.equal(result.evalMap[35].isCorrect, true); // cost is correct for 35
  });
});

describe("Cambridge IELTS 21 Test 2 - Reading Grading (40 Questions)", () => {
  const officialAnswers = {
    1: "rats",
    2: "visual",
    3: "half",
    4: "temperature",
    5: "vivid",
    6: "TRUE",
    7: "FALSE",
    8: "NOT GIVEN",
    9: "FALSE",
    10: "TRUE",
    11: "FALSE",
    12: "NOT GIVEN",
    13: "NOT GIVEN",
    14: "E",
    15: "G",
    16: "C",
    17: "D",
    18: "B",
    19: "A",
    20: "B",
    21: "D",
    22: "prosperity",
    23: "whistles",
    24: "bodies",
    25: "ancestors",
    26: "jewellery",
    27: "B",
    28: "A",
    29: "C",
    30: "F",
    31: "G",
    32: "I",
    33: "C",
    34: "A",
    35: "D",
    36: "NO",
    37: "NOT GIVEN",
    38: "NO",
    39: "YES",
    40: "B"
  };

  test("should score 40/40 and Band 9.0 with official answers", () => {
    const result = gradeReadingTest(cambridge21Test2.skills.reading, officialAnswers);
    assert.equal(result.correctCount, 40);
    assert.equal(result.bandScore, 9.0);
    assert.equal(Object.keys(result.evalMap).length, 40);

    // Verify Passage 1 Table specifically (Q1-5)
    for (let i = 1; i <= 5; i++) {
      assert.ok(result.evalMap[i], `Question ${i} must exist in evalMap`);
      assert.equal(result.evalMap[i].isCorrect, true, `Question ${i} must be correct`);
    }
  });

  test("should handle case-insensitivity on true/false/not given & yes/no/not given", () => {
    const lowerAnswers = {
      ...officialAnswers,
      6: "true",
      7: "false",
      8: "not given",
      36: "no",
      39: "yes"
    };
    const result = gradeReadingTest(cambridge21Test2.skills.reading, lowerAnswers);
    assert.equal(result.correctCount, 40);
    assert.equal(result.evalMap[6].isCorrect, true);
    assert.equal(result.evalMap[36].isCorrect, true);
  });
});
