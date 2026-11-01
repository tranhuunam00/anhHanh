import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { cambridge21Test1 } from "../src/data/ielts/cambridge21Test1Data.js";
import {
  gradeListeningTest,
  gradeReadingTest
} from "../src/utils/ieltsScoring.js";

describe("Cambridge IELTS 21 Test 1 - Full Data Integrity", () => {
  test("test structure contains all 4 skills and meta fields", () => {
    assert.equal(cambridge21Test1.id, "cambridge-21-test-1");
    assert.equal(cambridge21Test1.testNumber, 1);
    assert.ok(cambridge21Test1.skills.listening);
    assert.ok(cambridge21Test1.skills.reading);
    assert.ok(cambridge21Test1.skills.writing);
    assert.ok(cambridge21Test1.skills.speaking);
  });

  test("writing module has task 1 image and both tasks prompts", () => {
    const writing = cambridge21Test1.skills.writing;
    assert.equal(writing.tasks.length, 2);
    assert.equal(writing.tasks[0].image, "/images/ielts/cam21_test1_writing_task1.png");
    assert.ok(writing.tasks[0].prompt.includes("number of jobs in four sectors"));
    assert.ok(writing.tasks[1].prompt.includes("tall apartment blocks"));
  });

  test("speaking module has 3 parts with questions and cue card", () => {
    const speaking = cambridge21Test1.skills.speaking;
    assert.equal(speaking.parts.length, 3);
    assert.equal(speaking.parts[0].topic, "Hairstyles");
    assert.ok(speaking.parts[1].cueCard.topic.includes("information for tourists"));
    assert.equal(speaking.parts[2].sections.length, 2);
  });
});

describe("Cambridge IELTS 21 Test 1 - Listening Grading (40 Questions)", () => {
  const officialAnswers = {
    1: "10",
    2: "weather",
    3: "safety",
    4: "discount",
    5: "dictionary",
    6: "certificate",
    7: "towel",
    8: "cafe",
    9: "videos",
    10: "lockers",
    11: "A",
    12: "B",
    13: "A",
    14: "A",
    15: "A",
    16: "C",
    17: "C",
    18: "A",
    19: "B",
    20: "C",
    21: "B",
    22: "D",
    23: "C",
    24: "E",
    25: "G",
    26: "B",
    27: "F",
    28: "H",
    29: "A",
    30: "E",
    31: "metal",
    32: "slow",
    33: "demand",
    34: "equator",
    35: "recycle",
    36: "fungus",
    37: "weather",
    38: "strong",
    39: "roots",
    40: "soil"
  };

  test("happy path: achieves perfect 40/40 and Band 9.0 with official keys", () => {
    const res = gradeListeningTest(cambridge21Test1.skills.listening, officialAnswers);
    assert.equal(res.correctCount, 40);
    assert.equal(res.bandScore, 9.0);
    for (let q = 1; q <= 40; q++) {
      assert.equal(res.evalMap[q]?.isCorrect, true, `Question ${q} should be correct`);
    }
  });

  test("alternative accepted answers: word numbers, accents, and plurals", () => {
    const altAnswers = {
      ...officialAnswers,
      1: "ten",
      8: "café",
      10: "Lockers",
      21: "D",
      22: "B", // reversed choose two
      23: "E",
      24: "C", // reversed choose two
      31: "metals"
    };
    const res = gradeListeningTest(cambridge21Test1.skills.listening, altAnswers);
    assert.equal(res.correctCount, 40);
    assert.equal(res.bandScore, 9.0);
  });

  test("boundary & bad cases: empty inputs and wrong answers", () => {
    const emptyRes = gradeListeningTest(cambridge21Test1.skills.listening, {});
    assert.equal(emptyRes.correctCount, 0);
    assert.equal(emptyRes.bandScore, 1.0);

    const wrongAnswers = { 1: "wrong", 2: "wrong", 21: "A", 22: "A" };
    const wrongRes = gradeListeningTest(cambridge21Test1.skills.listening, wrongAnswers);
    assert.equal(wrongRes.correctCount, 0);
  });
});

describe("Cambridge IELTS 21 Test 1 - Reading Grading (40 Questions)", () => {
  const officialAnswers = {
    1: "mining",
    2: "education",
    3: "notes",
    4: "journals",
    5: "Venice",
    6: "canteen",
    7: "friends",
    8: "TRUE",
    9: "NOT GIVEN",
    10: "FALSE",
    11: "NOT GIVEN",
    12: "TRUE",
    13: "TRUE",
    14: "C",
    15: "B",
    16: "A",
    17: "G",
    18: "breath",
    19: "questionnaire",
    20: "wellbeing",
    21: "depression",
    22: "C",
    23: "A",
    24: "B",
    25: "D",
    26: "C",
    27: "B",
    28: "A",
    29: "C",
    30: "A",
    31: "H",
    32: "E",
    33: "I",
    34: "A",
    35: "G",
    36: "C",
    37: "YES",
    38: "NOT GIVEN",
    39: "NO",
    40: "YES"
  };

  test("happy path: achieves perfect 40/40 and Band 9.0 with official keys", () => {
    const res = gradeReadingTest(cambridge21Test1.skills.reading, officialAnswers);
    assert.equal(res.correctCount, 40);
    assert.equal(res.bandScore, 9.0);
    for (let q = 1; q <= 40; q++) {
      assert.equal(res.evalMap[q]?.isCorrect, true, `Question ${q} should be correct`);
    }
  });

  test("case insensitivity and whitespace handling", () => {
    const formattedAnswers = {
      ...officialAnswers,
      1: "  MINING  ",
      5: "venice",
      8: "true",
      10: "false",
      37: "yes",
      39: "no"
    };
    const res = gradeReadingTest(cambridge21Test1.skills.reading, formattedAnswers);
    assert.equal(res.correctCount, 40);
    assert.equal(res.bandScore, 9.0);
  });

  test("boundary & bad cases: empty answers produce Band 1.0", () => {
    const res = gradeReadingTest(cambridge21Test1.skills.reading, {});
    assert.equal(res.correctCount, 0);
    assert.equal(res.bandScore, 1.0);
  });
});

