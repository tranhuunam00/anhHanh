import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { cambridge20Test1 } from "../src/data/ielts/cambridge20Test1Data.js";
import { gradeListeningTest, gradeReadingTest } from "../src/utils/ieltsScoring.js";

describe("Cambridge IELTS 20 Test 1 - Data & Scoring Integrity", () => {
  test("Test schema integrity: contains all 4 skills and metadata", () => {
    assert.equal(cambridge20Test1.id, "cambridge-20-test-1");
    assert.equal(cambridge20Test1.book, "Cambridge IELTS 20");
    assert.equal(cambridge20Test1.testNumber, 1);
    assert.ok(cambridge20Test1.skills.listening);
    assert.ok(cambridge20Test1.skills.reading);
    assert.ok(cambridge20Test1.skills.writing);
    assert.ok(cambridge20Test1.skills.speaking);

    assert.equal(cambridge20Test1.skills.listening.parts.length, 4);
    assert.equal(cambridge20Test1.skills.reading.passages.length, 3);
    assert.equal(cambridge20Test1.skills.writing.tasks.length, 2);
    assert.equal(cambridge20Test1.skills.writing.tasks[0].image, "/images/ielts/cam20_test1_writing_task1.png");
    assert.equal(cambridge20Test1.skills.speaking.parts.length, 3);
  });

  test("Listening: achieves 40/40 and Band 9.0 with perfect official answers", () => {
    const perfectAnswers = {
      1: "fish",
      2: "roof",
      3: "Spanish",
      4: "vegetarian",
      5: "Audley",
      6: "hotel",
      7: "reviews",
      8: "local",
      9: "30",
      10: "average",
      11: "A",
      12: "B",
      13: "C",
      14: "A",
      15: "B",
      16: "C",
      17: "A",
      18: "E",
      19: "C",
      20: "E",
      21: "C",
      22: "E",
      23: "A",
      24: "C",
      25: "A",
      26: "B",
      27: "A",
      28: "B",
      29: "A",
      30: "C",
      31: "factories",
      32: "dead",
      33: "whale",
      34: "apartments",
      35: "park",
      36: "art",
      37: "beaches",
      38: "ferry",
      39: "bikes",
      40: "drone"
    };

    const result = gradeListeningTest(cambridge20Test1.skills.listening, perfectAnswers);
    assert.equal(result.correctCount, 40, `Expected 40 correct, got ${result.correctCount}`);
    assert.equal(result.bandScore, 9.0);

    for (let q = 1; q <= 40; q++) {
      assert.equal(result.evalMap[q]?.isCorrect, true, `Question ${q} should be evaluated as correct`);
    }
  });

  test("Listening: handles empty or invalid answers with score 0 and Band 1.0", () => {
    const emptyResult = gradeListeningTest(cambridge20Test1.skills.listening, {});
    assert.equal(emptyResult.correctCount, 0);
    assert.equal(emptyResult.bandScore, 1.0);
  });

  test("Reading: achieves 40/40 and Band 9.0 with perfect official answers", () => {
    const perfectAnswers = {
      1: "FALSE",
      2: "FALSE",
      3: "FALSE",
      4: "NOT GIVEN",
      5: "TRUE",
      6: "TRUE",
      7: "bulbs",
      8: "soil",
      9: "feathers",
      10: "deer",
      11: "1980",
      12: "funding",
      13: "stakeholders",
      14: "C",
      15: "G",
      16: "B",
      17: "E",
      18: "C",
      19: "B",
      20: "A",
      21: "B",
      22: "C",
      23: "A",
      24: "oak",
      25: "flooring",
      26: "keel",
      27: "C",
      28: "A",
      29: "D",
      30: "C",
      31: "B",
      32: "G",
      33: "F",
      34: "E",
      35: "D",
      36: "YES",
      37: "NOT GIVEN",
      38: "NO",
      39: "YES",
      40: "YES"
    };

    const result = gradeReadingTest(cambridge20Test1.skills.reading, perfectAnswers);
    assert.equal(result.correctCount, 40, `Expected 40 correct, got ${result.correctCount}`);
    assert.equal(result.bandScore, 9.0);

    for (let q = 1; q <= 40; q++) {
      assert.equal(result.evalMap[q]?.isCorrect, true, `Question ${q} should be evaluated as correct`);
    }
  });

  test("Reading: handles empty or invalid answers with score 0 and Band 1.0", () => {
    const emptyResult = gradeReadingTest(cambridge20Test1.skills.reading, {});
    assert.equal(emptyResult.correctCount, 0);
    assert.equal(emptyResult.bandScore, 1.0);
  });
});

