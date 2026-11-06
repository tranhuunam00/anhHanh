import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { cambridge19Test1 } from "../src/data/ielts/cambridge19Test1Data.js";
import { cambridge19Test2 } from "../src/data/ielts/cambridge19Test2Data.js";
import { cambridge19Test3 } from "../src/data/ielts/cambridge19Test3Data.js";
import { cambridge19Test4 } from "../src/data/ielts/cambridge19Test4Data.js";
import { gradeListeningTest, gradeReadingTest } from "../src/utils/ieltsScoring.js";

describe("Cambridge IELTS 19 - Full Tests Integrity & Scoring", () => {
  describe("Test 1 Schema & Scoring Integrity", () => {
    test("Schema contains all 4 skills and metadata", () => {
      assert.equal(cambridge19Test1.id, "cambridge-19-test-1");
      assert.equal(cambridge19Test1.book, "Cambridge IELTS 19");
      assert.equal(cambridge19Test1.testNumber, 1);
      assert.ok(cambridge19Test1.skills.listening);
      assert.ok(cambridge19Test1.skills.reading);
      assert.ok(cambridge19Test1.skills.writing);
      assert.ok(cambridge19Test1.skills.speaking);

      assert.equal(cambridge19Test1.skills.listening.parts.length, 4);
      assert.equal(cambridge19Test1.skills.reading.passages.length, 3);
      assert.equal(cambridge19Test1.skills.writing.tasks.length, 2);
      assert.equal(cambridge19Test1.skills.speaking.parts.length, 3);
    });

    test("Listening: achieves 40/40 and Band 9.0 with perfect answers", () => {
      const answers = {
        1: "69", 2: "stream", 3: "data", 4: "map", 5: "visitors",
        6: "sounds", 7: "freedom", 8: "skills", 9: "4.95", 10: "leaders",
        11: "B", 12: "A", 13: "B", 14: "C", 15: "A",
        16: "G", 17: "C", 18: "B", 19: "D", 20: "A",
        21: "B", 22: "D", 23: "A", 24: "E", 25: "D",
        26: "G", 27: "C", 28: "B", 29: "F", 30: "H",
        31: "walls", 32: "son", 33: "fuel", 34: "oxygen", 35: "rectangular",
        36: "lamps", 37: "family", 38: "winter", 39: "soil", 40: "rain"
      };
      const result = gradeListeningTest(cambridge19Test1.skills.listening, answers);
      assert.equal(result.correctCount, 40);
      assert.equal(result.bandScore, 9.0);
    });

    test("Reading: achieves 40/40 and Band 9.0 with perfect answers", () => {
      const answers = {
        1: "TRUE", 2: "NOT GIVEN", 3: "FALSE", 4: "TRUE", 5: "FALSE", 6: "TRUE",
        7: "gut", 8: "pressure", 9: "Connors", 10: "aluminum", 11: "sweet", 12: "stiffness", 13: "elbow",
        14: "iv", 15: "vi", 16: "ii", 17: "vii",
        18: "B", 19: "C", 20: "A", 21: "B", 22: "B",
        23: "grain", 24: "thirteen", 25: "signal", 26: "hegemony",
        27: "B", 28: "B", 29: "A", 30: "B",
        31: "YES", 32: "NO", 33: "YES", 34: "NOT GIVEN", 35: "NO",
        36: "C", 37: "A", 38: "E", 39: "B", 40: "D"
      };
      const result = gradeReadingTest(cambridge19Test1.skills.reading, answers);
      assert.equal(result.correctCount, 40);
      assert.equal(result.bandScore, 9.0);
    });
  });

  describe("Tests 2, 3, 4 Schema Integrity", () => {
    test("Test 2 schema and skills are complete", () => {
      assert.equal(cambridge19Test2.id, "cambridge-19-test-2");
      assert.equal(cambridge19Test2.skills.listening.parts.length, 4);
      assert.equal(cambridge19Test2.skills.reading.passages.length, 3);
      assert.equal(cambridge19Test2.skills.writing.tasks.length, 2);
      assert.equal(cambridge19Test2.skills.speaking.parts.length, 3);
    });

    test("Test 3 schema and skills are complete", () => {
      assert.equal(cambridge19Test3.id, "cambridge-19-test-3");
      assert.equal(cambridge19Test3.skills.listening.parts.length, 4);
      assert.equal(cambridge19Test3.skills.reading.passages.length, 3);
      assert.equal(cambridge19Test3.skills.writing.tasks.length, 2);
      assert.equal(cambridge19Test3.skills.speaking.parts.length, 3);
    });

    test("Test 4 schema and skills are complete", () => {
      assert.equal(cambridge19Test4.id, "cambridge-19-test-4");
      assert.equal(cambridge19Test4.skills.listening.parts.length, 4);
      assert.equal(cambridge19Test4.skills.reading.passages.length, 3);
      assert.equal(cambridge19Test4.skills.writing.tasks.length, 2);
      assert.equal(cambridge19Test4.skills.speaking.parts.length, 3);
    });
  });
});
