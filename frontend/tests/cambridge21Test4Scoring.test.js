import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { cambridge21Test4 } from "../src/data/ielts/cambridge21Test4Data.js";
import {
  gradeListeningTest,
  gradeReadingTest
} from "../src/utils/ieltsScoring.js";

describe("Cambridge IELTS 21 Test 4 - Full Data Integrity", () => {
  test("test structure contains all 4 skills and meta fields", () => {
    assert.equal(cambridge21Test4.id, "cambridge-21-test-4");
    assert.equal(cambridge21Test4.testNumber, 4);
    assert.equal(cambridge21Test4.pages, "75-96");
    assert.ok(cambridge21Test4.skills.listening);
    assert.ok(cambridge21Test4.skills.reading);
    assert.ok(cambridge21Test4.skills.writing);
    assert.ok(cambridge21Test4.skills.speaking);
  });

  test("listening module contains 4 parts and valid audio paths", () => {
    const listening = cambridge21Test4.skills.listening;
    assert.equal(listening.parts.length, 4);
    assert.equal(listening.audioUrl, "/audio/Cambridge 21 - Test 4.mp3");
  });

  test("writing module has task 1 image and both tasks prompts", () => {
    const writing = cambridge21Test4.skills.writing;
    assert.equal(writing.tasks.length, 2);
    assert.equal(writing.tasks[0].image, "/images/ielts/cam21_test4_writing_task1.png");
    assert.ok(writing.tasks[0].prompt.includes("survey of library users"));
    assert.ok(writing.tasks[1].prompt.includes("primary schools focus too much on formal learning"));
  });

  test("speaking module has 3 parts with questions and cue card", () => {
    const speaking = cambridge21Test4.skills.speaking;
    assert.equal(speaking.parts.length, 3);
    assert.equal(speaking.parts[0].topic, "Bread");
    assert.ok(speaking.parts[1].cueCard.topic.includes("person you know who is very competitive"));
    assert.equal(speaking.parts[2].sections.length, 2);
  });
});

describe("Cambridge IELTS 21 Test 4 - Listening Grading (40 Questions)", () => {
  const officialAnswers = {
    1: "Leigh",
    2: "motorbike",
    3: "hairdresser",
    4: "suit",
    5: "laptop",
    6: "Monday",
    7: "coffee",
    8: "books",
    9: "plants",
    10: "cinema",
    11: "C",
    12: "E",
    13: "A",
    14: "B",
    15: "C",
    16: "G",
    17: "D",
    18: "A",
    19: "F",
    20: "B",
    21: "B",
    22: "A",
    23: "B",
    24: "B",
    25: "E",
    26: "I",
    27: "A",
    28: "D",
    29: "H",
    30: "G",
    31: "routine",
    32: "trials",
    33: "calming",
    34: "pillows",
    35: "anxiety",
    36: "medication",
    37: "awake",
    38: "distraction",
    39: "nature",
    40: "volume"
  };

  test("should score 40/40 and Band 9.0 with official answers", () => {
    const result = gradeListeningTest(cambridge21Test4.skills.listening, officialAnswers);
    assert.equal(result.correctCount, 40);
    assert.equal(result.bandScore, 9.0);
  });

  test("should accept alternate case variations", () => {
    const alternateAnswers = {
      ...officialAnswers,
      1: "leigh",
      2: "MOTORBIKE",
      31: "Routine",
      39: "Nature"
    };
    const result = gradeListeningTest(cambridge21Test4.skills.listening, alternateAnswers);
    assert.equal(result.correctCount, 40);
    assert.equal(result.bandScore, 9.0);
  });

  test("should handle choose-two in reversed order", () => {
    const reversedOrder = {
      ...officialAnswers,
      11: "E",
      12: "C",
      13: "B",
      14: "A"
    };
    const result = gradeListeningTest(cambridge21Test4.skills.listening, reversedOrder);
    assert.equal(result.correctCount, 40);
    assert.equal(result.bandScore, 9.0);
  });

  test("should correctly score partial and empty answers", () => {
    const emptyResult = gradeListeningTest(cambridge21Test4.skills.listening, {});
    assert.equal(emptyResult.correctCount, 0);
    assert.equal(emptyResult.bandScore, 1.0);

    const partial = { 1: "Leigh", 2: "motorbike" };
    const partialResult = gradeListeningTest(cambridge21Test4.skills.listening, partial);
    assert.equal(partialResult.correctCount, 2);
    assert.equal(partialResult.bandScore, 2.0);
  });
});

describe("Cambridge IELTS 21 Test 4 - Reading Grading (40 Questions)", () => {
  const officialAnswers = {
    1: "TRUE",
    2: "FALSE",
    3: "TRUE",
    4: "NOT GIVEN",
    5: "NOT GIVEN",
    6: "FALSE",
    7: "TRUE",
    8: "cow dung",
    9: "fermentation",
    10: "pipes",
    11: "time",
    12: "money",
    13: "price",
    14: "I",
    15: "J",
    16: "H",
    17: "B",
    18: "E",
    19: "F",
    20: "NO",
    21: "NOT GIVEN",
    22: "YES",
    23: "NO",
    24: "C",
    25: "D",
    26: "D",
    27: "G",
    28: "J",
    29: "I",
    30: "C",
    31: "A",
    32: "E",
    33: "NO",
    34: "NOT GIVEN",
    35: "NOT GIVEN",
    36: "YES",
    37: "B",
    38: "C",
    39: "D",
    40: "A"
  };

  test("should score 40/40 and Band 9.0 with official answers", () => {
    const result = gradeReadingTest(cambridge21Test4.skills.reading, officialAnswers);
    assert.equal(result.correctCount, 40);
    assert.equal(result.bandScore, 9.0);
  });

  test("should accept accepted alternative for question 9 (fermentation process)", () => {
    const altAnswers = {
      ...officialAnswers,
      9: "fermentation process"
    };
    const result = gradeReadingTest(cambridge21Test4.skills.reading, altAnswers);
    assert.equal(result.correctCount, 40);
    assert.equal(result.bandScore, 9.0);
  });

  test("should handle case-insensitivity on true/false/not given & yes/no/not given", () => {
    const lowerAnswers = {
      ...officialAnswers,
      1: "true",
      2: "false",
      4: "not given",
      20: "no",
      22: "yes"
    };
    const result = gradeReadingTest(cambridge21Test4.skills.reading, lowerAnswers);
    assert.equal(result.correctCount, 40);
    assert.equal(result.bandScore, 9.0);
  });

  test("should score partial and empty answers correctly", () => {
    const emptyResult = gradeReadingTest(cambridge21Test4.skills.reading, {});
    assert.equal(emptyResult.correctCount, 0);
    assert.equal(emptyResult.bandScore, 1.0);

    const partial = { 1: "TRUE", 2: "FALSE", 8: "cow dung" };
    const partialResult = gradeReadingTest(cambridge21Test4.skills.reading, partial);
    assert.equal(partialResult.correctCount, 3);
  });
});

