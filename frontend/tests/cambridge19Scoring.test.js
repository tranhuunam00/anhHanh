import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { cambridge19Test1 } from "../src/data/ielts/cambridge19Test1Data.js";
import { cambridge19Test2 } from "../src/data/ielts/cambridge19Test2Data.js";
import { cambridge19Test3 } from "../src/data/ielts/cambridge19Test3Data.js";
import { cambridge19Test4 } from "../src/data/ielts/cambridge19Test4Data.js";
import { gradeListeningTest, gradeReadingTest } from "../src/utils/ieltsScoring.js";

describe("Cambridge IELTS 19 - Full Tests Integrity & 100% Authentic Scoring", () => {
  describe("Test 1 Schema & Scoring Integrity", () => {
    test("Schema contains all 4 skills and metadata", () => {
      assert.equal(cambridge19Test1.id, "cambridge-19-test-1");
      assert.equal(cambridge19Test1.book, "Cambridge IELTS 19");
      assert.equal(cambridge19Test1.testNumber, 1);
      assert.equal(cambridge19Test1.skills.listening.parts.length, 4);
      assert.equal(cambridge19Test1.skills.reading.passages.length, 3);
      assert.equal(cambridge19Test1.skills.writing.tasks.length, 2);
      assert.equal(cambridge19Test1.skills.speaking.parts.length, 3);
    });

    test("Listening: achieves 40/40 and Band 9.0 with authentic keys", () => {
      const answers = {
        1: "69", 2: "stream", 3: "data", 4: "map", 5: "visitors",
        6: "sounds", 7: "freedom", 8: "skills", 9: "4.95", 10: "leaders",
        11: "B", 12: "A", 13: "B", 14: "C", 15: "A",
        16: "G", 17: "C", 18: "B", 19: "D", 20: "A",
        21: "B", 22: "D", 23: "A", 24: "D", 25: "D",
        26: "G", 27: "C", 28: "B", 29: "F", 30: "H",
        31: "walls", 32: "son", 33: "fuel", 34: "oxygen", 35: "rectangular",
        36: "lamps", 37: "family", 38: "winter", 39: "soil", 40: "rain"
      };
      const result = gradeListeningTest(cambridge19Test1.skills.listening, answers);
      assert.equal(result.correctCount, 40);
      assert.equal(result.bandScore, 9.0);
    });

    test("Reading: achieves 40/40 and Band 9.0 with authentic keys", () => {
      const answers = {
        1: "FALSE", 2: "FALSE", 3: "NOT GIVEN", 4: "FALSE", 5: "NOT GIVEN", 6: "TRUE", 7: "TRUE",
        8: "paint", 9: "topspin", 10: "training", 11: "intestines", 12: "weights", 13: "grips",
        14: "D", 15: "G", 16: "C", 17: "A", 18: "G", 19: "B",
        20: "B", 21: "D", 22: "C", 23: "E",
        24: "grain", 25: "punishment", 26: "ransom",
        27: "D", 28: "A", 29: "C", 30: "D",
        31: "G", 32: "J", 33: "H", 34: "B", 35: "E", 36: "C",
        37: "YES", 38: "NOT GIVEN", 39: "NO", 40: "NOT GIVEN"
      };
      const result = gradeReadingTest(cambridge19Test1.skills.reading, answers);
      assert.equal(result.correctCount, 40);
      assert.equal(result.bandScore, 9.0);
    });
  });

  describe("Test 2 Schema & Scoring Integrity", () => {
    test("Schema contains all 4 skills and metadata", () => {
      assert.equal(cambridge19Test2.id, "cambridge-19-test-2");
      assert.equal(cambridge19Test2.skills.listening.parts.length, 4);
      assert.equal(cambridge19Test2.skills.reading.passages.length, 3);
      assert.equal(cambridge19Test2.skills.writing.tasks.length, 2);
      assert.equal(cambridge19Test2.skills.speaking.parts.length, 3);
    });

    test("Listening: achieves 40/40 and Band 9.0 with authentic keys", () => {
      const answers = {
        1: "Mathieson", 2: "beginners", 3: "college", 4: "New", 5: "11", 6: "instrument",
        7: "ear", 8: "clapping", 9: "recording", 10: "alone",
        11: "A", 12: "B", 13: "A", 14: "B", 15: "C", 16: "A",
        17: "C", 18: "E", 19: "B", 20: "D",
        21: "A", 22: "C", 23: "B", 24: "B",
        25: "C", 26: "F", 27: "D", 28: "A", 29: "C", 30: "C",
        31: "move", 32: "short", 33: "discs", 34: "oxygen", 35: "tube",
        36: "temperatures", 37: "protein", 38: "space", 39: "seaweed", 40: "endangered"
      };
      const result = gradeListeningTest(cambridge19Test2.skills.listening, answers);
      assert.equal(result.correctCount, 40);
      assert.equal(result.bandScore, 9.0);
    });

    test("Reading: achieves 40/40 and Band 9.0 with authentic keys", () => {
      const answers = {
        1: "piston", 2: "coal", 3: "workshops", 4: "labour", 5: "quality", 6: "railways", 7: "sanitation",
        8: "NOT GIVEN", 9: "FALSE", 10: "NOT GIVEN", 11: "TRUE", 12: "TRUE", 13: "NOT GIVEN",
        14: "C", 15: "F", 16: "A", 17: "D", 18: "F",
        19: "injury", 20: "serves", 21: "excitement", 22: "Visualisation",
        23: "B", 24: "D", 25: "A", 26: "E",
        27: "H", 28: "A", 29: "F", 30: "B", 31: "D", 32: "K",
        33: "YES", 34: "NOT GIVEN", 35: "YES", 36: "NOT GIVEN", 37: "NO",
        38: "C", 39: "B", 40: "D"
      };
      const result = gradeReadingTest(cambridge19Test2.skills.reading, answers);
      assert.equal(result.correctCount, 40);
      assert.equal(result.bandScore, 9.0);
    });
  });

  describe("Test 3 Schema & Scoring Integrity", () => {
    test("Schema contains all 4 skills and metadata", () => {
      assert.equal(cambridge19Test3.id, "cambridge-19-test-3");
      assert.equal(cambridge19Test3.skills.listening.parts.length, 4);
      assert.equal(cambridge19Test3.skills.reading.passages.length, 3);
      assert.equal(cambridge19Test3.skills.writing.tasks.length, 2);
      assert.equal(cambridge19Test3.skills.speaking.parts.length, 3);
    });

    test("Listening: achieves 40/40 and Band 9.0 with authentic keys", () => {
      const answers = {
        1: "harbour", 2: "bridge", 3: "3.30", 4: "Rose", 5: "Sign", 6: "purple",
        7: "samphire", 8: "melon", 9: "coconut", 10: "strawberry",
        11: "C", 12: "D", 13: "F", 14: "G", 15: "B", 16: "H",
        17: "C", 18: "D", 19: "B", 20: "D",
        21: "C", 22: "B", 23: "A", 24: "A", 25: "C",
        26: "C", 27: "H", 28: "E", 29: "B", 30: "F",
        31: "clothing", 32: "mouths", 33: "salt", 34: "toothpaste", 35: "fertilisers",
        36: "nutrients", 37: "growth", 38: "weight", 39: "acid", 40: "society"
      };
      const result = gradeListeningTest(cambridge19Test3.skills.listening, answers);
      assert.equal(result.correctCount, 40);
      assert.equal(result.bandScore, 9.0);
    });

    test("Reading: achieves 40/40 and Band 9.0 with authentic keys", () => {
      const answers = {
        1: "FALSE", 2: "FALSE", 3: "TRUE", 4: "NOT GIVEN", 5: "TRUE", 6: "NOT GIVEN", 7: "FALSE",
        8: "caves", 9: "stone", 10: "bones", 11: "beads", 12: "pottery", 13: "spices",
        14: "G", 15: "B", 16: "H", 17: "A",
        18: "carbon", 19: "fires", 20: "biodiversity", 21: "ditches", 22: "subsidence",
        23: "C", 24: "D", 25: "B", 26: "A",
        27: "D", 28: "A", 29: "C", 30: "B",
        31: "E", 32: "C", 33: "F", 34: "B",
        35: "NO", 36: "YES", 37: "NO", 38: "NOT GIVEN", 39: "NOT GIVEN", 40: "YES"
      };
      const result = gradeReadingTest(cambridge19Test3.skills.reading, answers);
      assert.equal(result.correctCount, 40);
      assert.equal(result.bandScore, 9.0);
    });
  });

  describe("Test 4 Schema & Scoring Integrity", () => {
    test("Schema contains all 4 skills and metadata", () => {
      assert.equal(cambridge19Test4.id, "cambridge-19-test-4");
      assert.equal(cambridge19Test4.skills.listening.parts.length, 4);
      assert.equal(cambridge19Test4.skills.reading.passages.length, 3);
      assert.equal(cambridge19Test4.skills.writing.tasks.length, 2);
      assert.equal(cambridge19Test4.skills.speaking.parts.length, 3);
    });

    test("Listening: achieves 40/40 and Band 9.0 with authentic keys", () => {
      const answers = {
        1: "Kaeden", 2: "locker", 3: "passport", 4: "uniform", 5: "third", 6: "0412 665 903",
        7: "yellow", 8: "plastic", 9: "ice", 10: "gloves",
        11: "C", 12: "E", 13: "A", 14: "D",
        15: "A", 16: "B", 17: "C", 18: "A",
        19: "C", 20: "B",
        21: "C", 22: "C", 23: "A", 24: "B", 25: "C",
        26: "D", 27: "F", 28: "A", 29: "C", 30: "G",
        31: "competition", 32: "food", 33: "disease", 34: "agriculture", 35: "maps",
        36: "cattle", 37: "speed", 38: "monkeys", 39: "fishing", 40: "flooding"
      };
      const result = gradeListeningTest(cambridge19Test4.skills.listening, answers);
      assert.equal(result.correctCount, 40);
      assert.equal(result.bandScore, 9.0);
    });

    test("Reading: achieves 40/40 and Band 9.0 with authentic keys", () => {
      const answers = {
        1: "FALSE", 2: "TRUE", 3: "FALSE", 4: "NOT GIVEN", 5: "FALSE", 6: "TRUE",
        7: "colonies", 8: "spring", 9: "endangered", 10: "habitats", 11: "Europe", 12: "southern", 13: "diet",
        14: "B", 15: "D", 16: "C", 17: "F",
        18: "D", 19: "B", 20: "A", 21: "E", 22: "C", 23: "C",
        24: "waste", 25: "machinery", 26: "caution",
        27: "C", 28: "C", 29: "B", 30: "A",
        31: "egalitarianism", 32: "status", 33: "hunting", 34: "domineering", 35: "autonomy",
        36: "NOT GIVEN", 37: "NO", 38: "YES", 39: "NOT GIVEN", 40: "NO"
      };
      const result = gradeReadingTest(cambridge19Test4.skills.reading, answers);
      assert.equal(result.correctCount, 40);
      assert.equal(result.bandScore, 9.0);
    });
  });
});
