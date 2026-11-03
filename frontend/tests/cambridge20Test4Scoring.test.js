import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { cambridge20Test4 } from "../src/data/ielts/cambridge20Test4Data.js";
import { gradeListeningTest, gradeReadingTest } from "../src/utils/ieltsScoring.js";

describe("Cambridge IELTS 20 Test 4 - Data & Scoring Integrity", () => {
  test("Test schema integrity: contains all 4 skills and metadata", () => {
    assert.equal(cambridge20Test4.id, "cambridge-20-test-4");
    assert.equal(cambridge20Test4.book, "Cambridge IELTS 20");
    assert.equal(cambridge20Test4.testNumber, 4);
    assert.ok(cambridge20Test4.skills.listening);
    assert.ok(cambridge20Test4.skills.reading);
    assert.ok(cambridge20Test4.skills.writing);
    assert.ok(cambridge20Test4.skills.speaking);

    assert.equal(cambridge20Test4.skills.listening.parts.length, 4);
    assert.equal(cambridge20Test4.skills.reading.passages.length, 3);
    assert.equal(cambridge20Test4.skills.writing.tasks.length, 2);
    assert.equal(cambridge20Test4.skills.writing.tasks[0].image, "/images/ielts/cam20_test4_writing_task1.png");
    assert.equal(cambridge20Test4.skills.speaking.parts.length, 3);
  });

  test("Listening: achieves 40/40 and Band 9.0 with perfect official answers", () => {
    const perfectAnswers = {
      1: "King's",
      2: "125",
      3: "walking",
      4: "boat",
      5: "Tuesday",
      6: "space",
      7: "vegetarian",
      8: "2.30",
      9: "75",
      10: "port",
      11: "B",
      12: "C",
      13: "A",
      14: "C",
      15: "D",
      16: "F",
      17: "B",
      18: "H",
      19: "C",
      20: "G",
      21: "C",
      22: "E",
      23: "A",
      24: "C",
      25: "C",
      26: "A",
      27: "A",
      28: "B",
      29: "B",
      30: "C",
      31: "rats",
      32: "snakes",
      33: "tourism",
      34: "traffic",
      35: "rain",
      36: "poison",
      37: "building",
      38: "dog",
      39: "noise",
      40: "combination"
    };

    const result = gradeListeningTest(cambridge20Test4.skills.listening, perfectAnswers);
    assert.equal(result.correctCount, 40, `Expected 40 correct, got ${result.correctCount}`);
    assert.equal(result.bandScore, 9.0);

    for (let q = 1; q <= 40; q++) {
      assert.equal(result.evalMap[q]?.isCorrect, true, `Question ${q} should be evaluated as correct`);
    }
  });

  test("Listening: handles empty or invalid answers with score 0 and Band 1.0", () => {
    const emptyResult = gradeListeningTest(cambridge20Test4.skills.listening, {});
    assert.equal(emptyResult.correctCount, 0);
    assert.equal(emptyResult.bandScore, 1.0);
  });

  test("Reading: achieves 40/40 and Band 9.0 with perfect official answers", () => {
    const perfectAnswers = {
      1: "teacher",
      2: "charcoal",
      3: "skyscrapers",
      4: "flowers",
      5: "bones",
      6: "landscape",
      7: "rivers",
      8: "FALSE",
      9: "TRUE",
      10: "FALSE",
      11: "TRUE",
      12: "NOT GIVEN",
      13: "NOT GIVEN",
      14: "C",
      15: "A",
      16: "D",
      17: "F",
      18: "pumps",
      19: "dams",
      20: "float",
      21: "crops",
      22: "trees",
      23: "B",
      24: "E",
      25: "A",
      26: "C",
      27: "D",
      28: "G",
      29: "B",
      30: "C",
      31: "B",
      32: "D",
      33: "E",
      34: "B",
      35: "C",
      36: "A",
      37: "jackals",
      38: "diseases",
      39: "food",
      40: "foxes"
    };

    const result = gradeReadingTest(cambridge20Test4.skills.reading, perfectAnswers);
    assert.equal(result.correctCount, 40, `Expected 40 correct, got ${result.correctCount}`);
    assert.equal(result.bandScore, 9.0);

    for (let q = 1; q <= 40; q++) {
      assert.equal(result.evalMap[q]?.isCorrect, true, `Question ${q} should be evaluated as correct`);
    }
  });

  test("Reading: handles empty or invalid answers with score 0 and Band 1.0", () => {
    const emptyResult = gradeReadingTest(cambridge20Test4.skills.reading, {});
    assert.equal(emptyResult.correctCount, 0);
    assert.equal(emptyResult.bandScore, 1.0);
  });
});

