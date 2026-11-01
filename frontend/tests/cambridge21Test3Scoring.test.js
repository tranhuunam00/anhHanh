import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { cambridge21Test3 } from "../src/data/ielts/cambridge21Test3Data.js";
import {
  gradeListeningTest,
  gradeReadingTest
} from "../src/utils/ieltsScoring.js";

describe("Cambridge IELTS 21 Test 3 - Full Data Integrity", () => {
  test("test structure contains all 4 skills and meta fields", () => {
    assert.equal(cambridge21Test3.id, "cambridge-21-test-3");
    assert.equal(cambridge21Test3.testNumber, 3);
    assert.equal(cambridge21Test3.pages, "54-74");
    assert.ok(cambridge21Test3.skills.listening);
    assert.ok(cambridge21Test3.skills.reading);
    assert.ok(cambridge21Test3.skills.writing);
    assert.ok(cambridge21Test3.skills.speaking);
  });

  test("listening module contains 4 parts and valid audio paths", () => {
    const listening = cambridge21Test3.skills.listening;
    assert.equal(listening.parts.length, 4);
    assert.equal(listening.audioUrl, "/audio/Cambridge 21 - Test 3.mp3");
  });

  test("writing module has task 1 image and both tasks prompts", () => {
    const writing = cambridge21Test3.skills.writing;
    assert.equal(writing.tasks.length, 2);
    assert.equal(writing.tasks[0].image, "/images/ielts/cam21_test3_writing_task1.png");
    assert.ok(writing.tasks[0].prompt.includes("rain-shadow desert"));
    assert.ok(writing.tasks[1].prompt.includes("studying abroad or doing a work placement"));
  });

  test("speaking module has 3 parts with questions and cue card", () => {
    const speaking = cambridge21Test3.skills.speaking;
    assert.equal(speaking.parts.length, 3);
    assert.equal(speaking.parts[0].topic, "Spending and saving money");
    assert.ok(speaking.parts[1].cueCard.topic.includes("interesting garden or park"));
    assert.equal(speaking.parts[2].sections.length, 2);
  });
});

describe("Cambridge IELTS 21 Test 3 - Listening Grading (40 Questions)", () => {
  const officialAnswers = {
    1: "Northern",
    2: "week",
    3: "250",
    4: "voucher",
    5: "window",
    6: "books",
    7: "blanket",
    8: "dolphins",
    9: "Drum",
    10: "Italian",
    11: "C",
    12: "E",
    13: "B",
    14: "E",
    15: "B",
    16: "C",
    17: "F",
    18: "A",
    19: "B",
    20: "D",
    21: "B",
    22: "D",
    23: "D",
    24: "E",
    25: "G",
    26: "B",
    27: "F",
    28: "A",
    29: "H",
    30: "D",
    31: "disease",
    32: "ecosystem",
    33: "holiday",
    34: "pets",
    35: "sugar",
    36: "light",
    37: "virus",
    38: "behaviour",
    39: "database",
    40: "photograph"
  };

  test("should score 40/40 and Band 9.0 with official answers", () => {
    const result = gradeListeningTest(cambridge21Test3.skills.listening, officialAnswers);
    assert.equal(result.correctCount, 40);
    assert.equal(result.bandScore, 9.0);
  });

  test("should accept alternate accepted spellings / variations", () => {
    const alternateAnswers = {
      ...officialAnswers,
      1: "northern",
      3: "two hundred and fifty",
      33: "holidays",
      38: "behavior"
    };
    const result = gradeListeningTest(cambridge21Test3.skills.listening, alternateAnswers);
    assert.equal(result.correctCount, 40);
    assert.equal(result.bandScore, 9.0);
  });

  test("should handle choose-two in reversed order", () => {
    const reversedOrder = {
      ...officialAnswers,
      11: "E",
      12: "C",
      13: "E",
      14: "B",
      21: "D",
      22: "B",
      23: "E",
      24: "D"
    };
    const result = gradeListeningTest(cambridge21Test3.skills.listening, reversedOrder);
    assert.equal(result.correctCount, 40);
    assert.equal(result.bandScore, 9.0);
  });

  test("should correctly score partial and empty answers", () => {
    const emptyResult = gradeListeningTest(cambridge21Test3.skills.listening, {});
    assert.equal(emptyResult.correctCount, 0);
    assert.equal(emptyResult.bandScore, 1.0);

    const partial = { 1: "Northern", 2: "week" };
    const partialResult = gradeListeningTest(cambridge21Test3.skills.listening, partial);
    assert.equal(partialResult.correctCount, 2);
    assert.equal(partialResult.bandScore, 2.0);
  });
});

describe("Cambridge IELTS 21 Test 3 - Reading Grading (40 Questions)", () => {
  const officialAnswers = {
    1: "dust",
    2: "blood",
    3: "coat",
    4: "horns",
    5: "habitat",
    6: "routes",
    7: "streams",
    8: "FALSE",
    9: "FALSE",
    10: "TRUE",
    11: "NOT GIVEN",
    12: "TRUE",
    13: "NOT GIVEN",
    14: "NOT GIVEN",
    15: "FALSE",
    16: "NOT GIVEN",
    17: "TRUE",
    18: "FALSE",
    19: "lanes",
    20: "boarding",
    21: "wheelchairs",
    22: "fuel",
    23: "flood",
    24: "smartcards",
    25: "gates",
    26: "queues",
    27: "A",
    28: "A",
    29: "D",
    30: "A",
    31: "E",
    32: "F",
    33: "D",
    34: "B",
    35: "NO",
    36: "NOT GIVEN",
    37: "NOT GIVEN",
    38: "YES",
    39: "YES",
    40: "NO"
  };

  test("should score 40/40 and Band 9.0 with official answers", () => {
    const result = gradeReadingTest(cambridge21Test3.skills.reading, officialAnswers);
    assert.equal(result.correctCount, 40);
    assert.equal(result.bandScore, 9.0);
  });

  test("should handle case-insensitivity on true/false/not given & yes/no/not given", () => {
    const lowerAnswers = {
      ...officialAnswers,
      8: "false",
      10: "true",
      11: "not given",
      35: "no",
      38: "yes"
    };
    const result = gradeReadingTest(cambridge21Test3.skills.reading, lowerAnswers);
    assert.equal(result.correctCount, 40);
    assert.equal(result.bandScore, 9.0);
  });

  test("should score partial and empty answers correctly", () => {
    const emptyResult = gradeReadingTest(cambridge21Test3.skills.reading, {});
    assert.equal(emptyResult.correctCount, 0);
    assert.equal(emptyResult.bandScore, 1.0);

    const partial = { 1: "dust", 2: "blood", 8: "FALSE" };
    const partialResult = gradeReadingTest(cambridge21Test3.skills.reading, partial);
    assert.equal(partialResult.correctCount, 3);
  });
});

