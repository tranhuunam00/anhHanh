import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { cambridge20Test3 } from "../src/data/ielts/cambridge20Test3Data.js";
import { gradeListeningTest, gradeReadingTest } from "../src/utils/ieltsScoring.js";

describe("Cambridge IELTS 20 Test 3 - Data & Scoring Integrity", () => {
  test("Test schema integrity: contains all 4 skills and metadata", () => {
    assert.equal(cambridge20Test3.id, "cambridge-20-test-3");
    assert.equal(cambridge20Test3.book, "Cambridge IELTS 20");
    assert.equal(cambridge20Test3.testNumber, 3);
    assert.ok(cambridge20Test3.skills.listening);
    assert.ok(cambridge20Test3.skills.reading);
    assert.ok(cambridge20Test3.skills.writing);
    assert.ok(cambridge20Test3.skills.speaking);

    assert.equal(cambridge20Test3.skills.listening.parts.length, 4);
    assert.equal(cambridge20Test3.skills.reading.passages.length, 3);
    assert.equal(cambridge20Test3.skills.writing.tasks.length, 2);
    assert.equal(cambridge20Test3.skills.writing.tasks[0].image, "/images/ielts/cam20_test3_writing_task1.png");
    assert.equal(cambridge20Test3.skills.speaking.parts.length, 3);
  });

  test("Listening: achieves 40/40 and Band 9.0 with perfect official answers", () => {
    const perfectAnswers = {
      1: "239",
      2: "modern",
      3: "lamp",
      4: "Aaron",
      5: "damage",
      6: "electronic",
      7: "insurance",
      8: "Space",
      9: "app",
      10: "exchanges",
      11: "B",
      12: "A",
      13: "A",
      14: "C",
      15: "B",
      16: "C",
      17: "B",
      18: "A",
      19: "G",
      20: "E",
      21: "B",
      22: "A",
      23: "C",
      24: "A",
      25: "C",
      26: "B",
      27: "F",
      28: "E",
      29: "B",
      30: "D",
      31: "adaptation",
      32: "cognitive",
      33: "desks",
      34: "taps",
      35: "blue",
      36: "voice",
      37: "pregnant",
      38: "shoulders",
      39: "police",
      40: "temperature"
    };

    const result = gradeListeningTest(cambridge20Test3.skills.listening, perfectAnswers);
    assert.equal(result.correctCount, 40, `Expected 40 correct, got ${result.correctCount}`);
    assert.equal(result.bandScore, 9.0);

    for (let q = 1; q <= 40; q++) {
      assert.equal(result.evalMap[q]?.isCorrect, true, `Question ${q} should be evaluated as correct`);
    }
  });

  test("Listening: handles empty or invalid answers with score 0 and Band 1.0", () => {
    const emptyResult = gradeListeningTest(cambridge20Test3.skills.listening, {});
    assert.equal(emptyResult.correctCount, 0);
    assert.equal(emptyResult.bandScore, 1.0);
  });

  test("Reading: achieves 40/40 and Band 9.0 with perfect official answers", () => {
    const perfectAnswers = {
      1: "potatoes",
      2: "butter",
      3: "meat",
      4: "crystals",
      5: "cellophane",
      6: "tin",
      7: "refrigerator",
      8: "NOT GIVEN",
      9: "TRUE",
      10: "FALSE",
      11: "TRUE",
      12: "FALSE",
      13: "NOT GIVEN",
      14: "v",
      15: "ii",
      16: "iv",
      17: "vii",
      18: "iii",
      19: "vi",
      20: "C",
      21: "E",
      22: "B",
      23: "D",
      24: "tentacles",
      25: "protection",
      26: "color",
      27: "A",
      28: "C",
      29: "B",
      30: "C",
      31: "B",
      32: "A",
      33: "C",
      34: "C",
      35: "B",
      36: "D",
      37: "B",
      38: "C",
      39: "B",
      40: "C"
    };

    const result = gradeReadingTest(cambridge20Test3.skills.reading, perfectAnswers);
    assert.equal(result.correctCount, 40, `Expected 40 correct, got ${result.correctCount}`);
    assert.equal(result.bandScore, 9.0);

    for (let q = 1; q <= 40; q++) {
      assert.equal(result.evalMap[q]?.isCorrect, true, `Question ${q} should be evaluated as correct`);
    }
  });

  test("Reading: handles empty or invalid answers with score 0 and Band 1.0", () => {
    const emptyResult = gradeReadingTest(cambridge20Test3.skills.reading, {});
    assert.equal(emptyResult.correctCount, 0);
    assert.equal(emptyResult.bandScore, 1.0);
  });
});

