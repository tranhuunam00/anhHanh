import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { cambridge18Test1 } from "../src/data/ielts/cambridge18Test1Data.js";
import { cambridge18Test2 } from "../src/data/ielts/cambridge18Test2Data.js";
import { cambridge18Test3 } from "../src/data/ielts/cambridge18Test3Data.js";
import { cambridge18Test4 } from "../src/data/ielts/cambridge18Test4Data.js";
import { IELTS_TESTS } from "../src/data/ielts/index.js";
import { gradeListeningTest, gradeReadingTest } from "../src/utils/ieltsScoring.js";

describe("Cambridge IELTS 18 - Full Tests Integrity & 100% Authentic Scoring", () => {
  test("IELTS_TESTS array contains all 4 Cambridge 18 tests", () => {
    const ids = IELTS_TESTS.map((t) => t.id);
    assert.ok(ids.includes("cambridge-18-test-1"));
    assert.ok(ids.includes("cambridge-18-test-2"));
    assert.ok(ids.includes("cambridge-18-test-3"));
    assert.ok(ids.includes("cambridge-18-test-4"));
  });

  describe("Test 1 Schema & Scoring Integrity", () => {
    test("Schema contains all 4 skills and metadata", () => {
      assert.equal(cambridge18Test1.id, "cambridge-18-test-1");
      assert.equal(cambridge18Test1.book, "Cambridge IELTS 18");
      assert.equal(cambridge18Test1.testNumber, 1);
      assert.equal(cambridge18Test1.skills.listening.parts.length, 4);
      assert.equal(cambridge18Test1.skills.reading.passages.length, 3);
      assert.equal(cambridge18Test1.skills.writing.tasks.length, 2);
      assert.equal(cambridge18Test1.skills.speaking.parts.length, 3);
    });

    test("Listening: achieves 40/40 and Band 9.0 with authentic keys", () => {
      const answers = {
        1: "DW30 7YZ", 2: "24th April", 3: "dentist", 4: "parking", 5: "Claxby",
        6: "late", 7: "evening", 8: "supermarket", 9: "pollution", 10: "storage",
        11: "C", 12: "A", 13: "A", 14: "B", 15: "E",
        16: "B", 17: "G", 18: "D", 19: "A", 20: "F",
        21: "A", 22: "B", 23: "A", 24: "C", 25: "B", 26: "A",
        27: "B", 28: "E", 29: "A", 30: "C",
        31: "fences", 32: "family", 33: "helicopters", 34: "stress", 35: "sides",
        36: "breathing", 37: "feet", 38: "employment", 39: "weapons", 40: "tourism"
      };
      const result = gradeListeningTest(cambridge18Test1.skills.listening, answers);
      assert.equal(result.correctCount, 40);
      assert.equal(result.bandScore, 9.0);
    });

    test("Reading: achieves 40/40 and Band 9.0 with authentic keys", () => {
      const answers = {
        1: "lettuces", 2: "1,000 kg", 3: "consumption",
        4: "pesticides", 5: "journeys", 6: "producers", 7: "flavour",
        8: "TRUE", 9: "NOT GIVEN", 10: "FALSE", 11: "TRUE", 12: "FALSE", 13: "NOT GIVEN",
        14: "B", 15: "A", 16: "C", 17: "E", 18: "B",
        19: "B", 20: "C", 21: "C",
        22: "fire", 23: "nutrients", 24: "cavities", 25: "hawthorn", 26: "rare",
        27: "C", 28: "F", 29: "A", 30: "E", 31: "B",
        32: "sustainability", 33: "fuel", 34: "explosions", 35: "bankrupt",
        36: "C", 37: "D", 38: "B", 39: "D", 40: "A"
      };
      const result = gradeReadingTest(cambridge18Test1.skills.reading, answers);
      assert.equal(result.correctCount, 40);
      assert.equal(result.bandScore, 9.0);
    });
  });

  describe("Test 2 Schema & Scoring Integrity", () => {
    test("Schema contains all 4 skills and metadata", () => {
      assert.equal(cambridge18Test2.id, "cambridge-18-test-2");
      assert.equal(cambridge18Test2.skills.listening.parts.length, 4);
      assert.equal(cambridge18Test2.skills.reading.passages.length, 3);
      assert.equal(cambridge18Test2.skills.writing.tasks.length, 2);
      assert.equal(cambridge18Test2.skills.speaking.parts.length, 3);
    });

    test("Listening: achieves 40/40 and Band 9.0 with authentic keys", () => {
      const answers = {
        1: "training", 2: "discount", 3: "taxi", 4: "service", 5: "English",
        6: "Wivenhoe", 7: "equipment", 8: "9.75", 9: "deliveries", 10: "Sunday",
        11: "B", 12: "E", 13: "B", 14: "C",
        15: "H", 16: "C", 17: "D", 18: "B", 19: "A", 20: "I",
        21: "C", 22: "A", 23: "B", 24: "B", 25: "A", 26: "B",
        27: "D", 28: "A", 29: "C", 30: "F",
        31: "convenient", 32: "suits", 33: "tailor", 34: "profession", 35: "visible",
        36: "strings", 37: "waists", 38: "perfume", 39: "image", 40: "handbag"
      };
      const result = gradeListeningTest(cambridge18Test2.skills.listening, answers);
      assert.equal(result.correctCount, 40);
      assert.equal(result.bandScore, 9.0);
    });

    test("Reading: achieves 40/40 and Band 9.0 with authentic keys", () => {
      const answers = {
        1: "deer antlers", 2: "timber posts", 3: "tree trunks", 4: "oxen", 5: "glaciers",
        6: "druids", 7: "burial", 8: "calendar",
        9: "TRUE", 10: "FALSE", 11: "FALSE", 12: "TRUE", 13: "NOT GIVEN",
        14: "C", 15: "A", 16: "B", 17: "B", 18: "A", 19: "B",
        20: "YES", 21: "NOT GIVEN", 22: "NO", 23: "YES",
        24: "C", 25: "A", 26: "B",
        27: "NOT GIVEN", 28: "NOT GIVEN", 29: "TRUE", 30: "FALSE", 31: "TRUE", 32: "NOT GIVEN", 33: "FALSE",
        34: "transport", 35: "staircases", 36: "engineering", 37: "rule", 38: "Roman", 39: "Paris", 40: "outwards"
      };
      const result = gradeReadingTest(cambridge18Test2.skills.reading, answers);
      assert.equal(result.correctCount, 40);
      assert.equal(result.bandScore, 9.0);
    });
  });

  describe("Test 3 Schema & Scoring Integrity", () => {
    test("Schema contains all 4 skills and metadata", () => {
      assert.equal(cambridge18Test3.id, "cambridge-18-test-3");
      assert.equal(cambridge18Test3.skills.listening.parts.length, 4);
      assert.equal(cambridge18Test3.skills.reading.passages.length, 3);
      assert.equal(cambridge18Test3.skills.writing.tasks.length, 2);
      assert.equal(cambridge18Test3.skills.speaking.parts.length, 3);
    });

    test("Listening: achieves 40/40 and Band 9.0 with authentic keys", () => {
      const answers = {
        1: "Marrowfield", 2: "relative", 3: "socialise", 4: "full",
        5: "Domestic Life", 6: "clouds", 7: "timing", 8: "Animal Magic", 9: "movement", 10: "dark",
        11: "B", 12: "D", 13: "B", 14: "D",
        15: "C", 16: "B", 17: "B", 18: "C", 19: "A", 20: "A",
        21: "C", 22: "E", 23: "B", 24: "D",
        25: "A", 26: "F", 27: "A", 28: "C", 29: "G", 30: "A",
        31: "technical", 32: "cheap", 33: "thousands", 34: "identification", 35: "tracking",
        36: "military", 37: "location", 38: "prediction", 39: "database", 40: "trust"
      };
      const result = gradeListeningTest(cambridge18Test3.skills.listening, answers);
      assert.equal(result.correctCount, 40);
      assert.equal(result.bandScore, 9.0);
    });

    test("Reading: achieves 40/40 and Band 9.0 with authentic keys", () => {
      const answers = {
        1: "G", 2: "D", 3: "C", 4: "F",
        5: "architects", 6: "moisture", 7: "layers", 8: "speed",
        9: "C", 10: "A", 11: "B", 12: "D", 13: "A",
        14: "iii", 15: "viii", 16: "v", 17: "vi", 18: "vii", 19: "i", 20: "iv",
        21: "A", 22: "C", 23: "B",
        24: "speed", 25: "fifty", 26: "strict",
        27: "B", 28: "A", 29: "C", 30: "C",
        31: "H", 32: "D", 33: "F", 34: "E", 35: "B",
        36: "NO", 37: "NOT GIVEN", 38: "YES", 39: "NO", 40: "NOT GIVEN"
      };
      const result = gradeReadingTest(cambridge18Test3.skills.reading, answers);
      assert.equal(result.correctCount, 40);
      assert.equal(result.bandScore, 9.0);
    });
  });

  describe("Test 4 Schema & Scoring Integrity", () => {
    test("Schema contains all 4 skills and metadata", () => {
      assert.equal(cambridge18Test4.id, "cambridge-18-test-4");
      assert.equal(cambridge18Test4.skills.listening.parts.length, 4);
      assert.equal(cambridge18Test4.skills.reading.passages.length, 3);
      assert.equal(cambridge18Test4.skills.writing.tasks.length, 2);
      assert.equal(cambridge18Test4.skills.speaking.parts.length, 3);
    });

    test("Listening: achieves 40/40 and Band 9.0 with authentic keys", () => {
      const answers = {
        1: "receptionist", 2: "Medical", 3: "Chastons", 4: "appointments", 5: "database",
        6: "experience", 7: "confident", 8: "temporary", 9: "1.15", 10: "parking",
        11: "B", 12: "A", 13: "A", 14: "C",
        15: "F", 16: "G", 17: "E", 18: "A", 19: "C", 20: "B",
        21: "D", 22: "E", 23: "D", 24: "A", 25: "C", 26: "G", 27: "F",
        28: "A", 29: "B", 30: "C",
        31: "plot", 32: "poverty", 33: "Europe", 34: "poetry", 35: "drawings",
        36: "furniture", 37: "lamps", 38: "harbour", 39: "children", 40: "relatives"
      };
      const result = gradeListeningTest(cambridge18Test4.skills.listening, answers);
      assert.equal(result.correctCount, 40);
      assert.equal(result.bandScore, 9.0);
    });

    test("Reading: achieves 40/40 and Band 9.0 with authentic keys", () => {
      const answers = {
        1: "D", 2: "C", 3: "C", 4: "B", 5: "D",
        6: "energy", 7: "food", 8: "gardening", 9: "obesity",
        10: "C", 11: "D", 12: "C", 13: "D",
        14: "B", 15: "C", 16: "D",
        17: "C", 18: "B", 19: "A", 20: "E", 21: "B", 22: "D",
        23: "YES", 24: "NO", 25: "NOT GIVEN", 26: "YES",
        27: "YES", 28: "NOT GIVEN", 29: "NO", 30: "NO",
        31: "I", 32: "F", 33: "A", 34: "C", 35: "H", 36: "E",
        37: "B", 38: "C", 39: "D", 40: "C"
      };
      const result = gradeReadingTest(cambridge18Test4.skills.reading, answers);
      assert.equal(result.correctCount, 40);
      assert.equal(result.bandScore, 9.0);
    });
  });
});

