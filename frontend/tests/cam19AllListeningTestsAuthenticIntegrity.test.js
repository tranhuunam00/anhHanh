import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { cambridge19Test1 } from "../src/data/ielts/cambridge19Test1Data.js";
import { cambridge19Test2 } from "../src/data/ielts/cambridge19Test2Data.js";
import { cambridge19Test3 } from "../src/data/ielts/cambridge19Test3Data.js";
import { cambridge19Test4 } from "../src/data/ielts/cambridge19Test4Data.js";
import { gradeListeningTest } from "../src/utils/ieltsScoring.js";

describe("Cambridge IELTS 19 - All 4 Listening Tests Complete 160-Question Integrity", () => {
  describe("Test 1 Listening Fidelity", () => {
    test("Structure, question count and types", () => {
      const parts = cambridge19Test1.skills.listening.parts;
      assert.equal(parts.length, 4);
      const allItems = parts.flatMap((p) => p.items);
      assert.equal(allItems.length, 40);
    });

    test("Authentic answer key grades 40/40 Band 9.0", () => {
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
      const res = gradeListeningTest(cambridge19Test1.skills.listening, answers);
      assert.equal(res.correctCount, 40);
      assert.equal(res.bandScore, 9.0);
    });
  });

  describe("Test 2 Listening Fidelity", () => {
    test("Structure, question count and types", () => {
      const parts = cambridge19Test2.skills.listening.parts;
      assert.equal(parts.length, 4);
      const allItems = parts.flatMap((p) => p.items);
      assert.equal(allItems.length, 40);
      // Q6 is instrument
      const q6 = allItems.find((it) => it.number === 6);
      assert.ok(q6.answers.includes("instrument"));
    });

    test("Authentic answer key grades 40/40 Band 9.0", () => {
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
      const res = gradeListeningTest(cambridge19Test2.skills.listening, answers);
      assert.equal(res.correctCount, 40);
      assert.equal(res.bandScore, 9.0);
    });
  });

  describe("Test 3 Listening Fidelity", () => {
    test("Structure, question count and types", () => {
      const parts = cambridge19Test3.skills.listening.parts;
      assert.equal(parts.length, 4);
      const allItems = parts.flatMap((p) => p.items);
      assert.equal(allItems.length, 40);
      // Q11-16 matching box
      assert.equal(parts[1].boxOptions.length, 8);
      // Q24, Q25, Q27, Q28 authentic answers
      const q24 = allItems.find((it) => it.number === 24);
      const q25 = allItems.find((it) => it.number === 25);
      const q27 = allItems.find((it) => it.number === 27);
      const q28 = allItems.find((it) => it.number === 28);
      assert.deepEqual(q24.answers, ["A"]);
      assert.deepEqual(q25.answers, ["C"]);
      assert.deepEqual(q27.answers, ["H"]);
      assert.deepEqual(q28.answers, ["E"]);
    });

    test("Authentic answer key grades 40/40 Band 9.0", () => {
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
      const res = gradeListeningTest(cambridge19Test3.skills.listening, answers);
      assert.equal(res.correctCount, 40);
      assert.equal(res.bandScore, 9.0);
    });
  });

  describe("Test 4 Listening Fidelity", () => {
    test("Questions 15-18 are matching with boxOptions and clean names", () => {
      const parts = cambridge19Test4.skills.listening.parts;
      const part2 = parts[1];
      assert.equal(part2.boxTitle, "Reasons (Questions 15–18)");
      assert.equal(part2.boxOptions.length, 3);
      const q15 = part2.items.find((it) => it.number === 15);
      const q16 = part2.items.find((it) => it.number === 16);
      const q17 = part2.items.find((it) => it.number === 17);
      const q18 = part2.items.find((it) => it.number === 18);
      assert.equal(q15.type, "matching");
      assert.equal(q15.question, "Ceri");
      assert.deepEqual(q15.answers, ["A"]);
      assert.equal(q16.type, "matching");
      assert.equal(q16.question, "James");
      assert.deepEqual(q16.answers, ["B"]);
      assert.equal(q17.type, "matching");
      assert.equal(q17.question, "Leo");
      assert.deepEqual(q17.answers, ["C"]);
      assert.equal(q18.type, "matching");
      assert.equal(q18.question, "Mark");
      assert.deepEqual(q18.answers, ["A"]);
    });

    test("Authentic answer key grades 40/40 Band 9.0", () => {
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
      const res = gradeListeningTest(cambridge19Test4.skills.listening, answers);
      assert.equal(res.correctCount, 40);
      assert.equal(res.bandScore, 9.0);
    });
  });
});

