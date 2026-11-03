import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { cambridge20Test2 } from "../src/data/ielts/cambridge20Test2Data.js";
import { gradeListeningTest, gradeReadingTest } from "../src/utils/ieltsScoring.js";

describe("Cambridge IELTS 20 Test 2 - Data & Scoring Integrity", () => {
  test("Test schema integrity: contains all 4 skills and metadata", () => {
    assert.equal(cambridge20Test2.id, "cambridge-20-test-2");
    assert.equal(cambridge20Test2.book, "Cambridge IELTS 20");
    assert.equal(cambridge20Test2.testNumber, 2);
    assert.ok(cambridge20Test2.skills.listening);
    assert.ok(cambridge20Test2.skills.reading);
    assert.ok(cambridge20Test2.skills.writing);
    assert.ok(cambridge20Test2.skills.speaking);

    assert.equal(cambridge20Test2.skills.listening.parts.length, 4);
    assert.equal(cambridge20Test2.skills.reading.passages.length, 3);
    assert.equal(cambridge20Test2.skills.writing.tasks.length, 2);
    assert.equal(cambridge20Test2.skills.writing.tasks[0].image, "/images/ielts/cam20_test2_writing_task1.png");
    assert.equal(cambridge20Test2.skills.speaking.parts.length, 3);
  });

  test("Listening: achieves 40/40 and Band 9.0 with perfect official answers", () => {
    const perfectAnswers = {
      1: "break",
      2: "time",
      3: "shower",
      4: "money",
      5: "memory",
      6: "lifting",
      7: "fall",
      8: "taxi",
      9: "insurance",
      10: "stress",
      11: "D",
      12: "I",
      13: "H",
      14: "E",
      15: "A",
      16: "B",
      17: "B",
      18: "A",
      19: "B",
      20: "A",
      21: "D",
      22: "G",
      23: "B",
      24: "A",
      25: "E",
      26: "C",
      27: "A",
      28: "A",
      29: "B",
      30: "C",
      31: "photos",
      32: "vegan",
      33: "chefs",
      34: "journalists",
      35: "health",
      36: "coffee",
      37: "environment",
      38: "reputation",
      39: "price",
      40: "soil"
    };

    const result = gradeListeningTest(cambridge20Test2.skills.listening, perfectAnswers);
    assert.equal(result.correctCount, 40, `Expected 40 correct, got ${result.correctCount}`);
    assert.equal(result.bandScore, 9.0);

    for (let q = 1; q <= 40; q++) {
      assert.equal(result.evalMap[q]?.isCorrect, true, `Question ${q} should be evaluated as correct`);
    }
  });

  test("Listening: handles empty or invalid answers with score 0 and Band 1.0", () => {
    const emptyResult = gradeListeningTest(cambridge20Test2.skills.listening, {});
    assert.equal(emptyResult.correctCount, 0);
    assert.equal(emptyResult.bandScore, 1.0);
  });

  test("Reading: achieves 40/40 and Band 9.0 with perfect official answers", () => {
    const perfectAnswers = {
      1: "tail",
      2: "flippers",
      3: "hair",
      4: "seagrasses",
      5: "lips",
      6: "buoyancy",
      7: "TRUE",
      8: "NOT GIVEN",
      9: "FALSE",
      10: "NOT GIVEN",
      11: "TRUE",
      12: "NOT GIVEN",
      13: "TRUE",
      14: "B",
      15: "F",
      16: "B",
      17: "laziness",
      18: "anxious",
      19: "threats",
      20: "exams",
      21: "perfectionists",
      22: "guilt",
      23: "A",
      24: "C",
      25: "A",
      26: "E",
      27: "NO",
      28: "YES",
      29: "NOT GIVEN",
      30: "NO",
      31: "NOT GIVEN",
      32: "YES",
      33: "F",
      34: "D",
      35: "H",
      36: "B",
      37: "G",
      38: "B",
      39: "D",
      40: "C"
    };

    const result = gradeReadingTest(cambridge20Test2.skills.reading, perfectAnswers);
    assert.equal(result.correctCount, 40, `Expected 40 correct, got ${result.correctCount}`);
    assert.equal(result.bandScore, 9.0);

    for (let q = 1; q <= 40; q++) {
      assert.equal(result.evalMap[q]?.isCorrect, true, `Question ${q} should be evaluated as correct`);
    }
  });

  test("Reading: handles empty or invalid answers with score 0 and Band 1.0", () => {
    const emptyResult = gradeReadingTest(cambridge20Test2.skills.reading, {});
    assert.equal(emptyResult.correctCount, 0);
    assert.equal(emptyResult.bandScore, 1.0);
  });
});

