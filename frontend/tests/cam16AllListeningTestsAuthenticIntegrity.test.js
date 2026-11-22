import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { cambridge16Test1 } from "../src/data/ielts/cambridge16Test1Data.js";
import { cambridge16Test2 } from "../src/data/ielts/cambridge16Test2Data.js";
import { cambridge16Test3 } from "../src/data/ielts/cambridge16Test3Data.js";
import { cambridge16Test4 } from "../src/data/ielts/cambridge16Test4Data.js";
import { gradeListeningTest } from "../src/utils/ieltsScoring.js";

describe("Cambridge IELTS 16 - All 4 Listening Tests Complete 160-Question Integrity", () => {
  describe("Test 1 Listening Fidelity", () => {
    test("Structure, question count and types", () => {
      const parts = cambridge16Test1.skills.listening.parts;
      assert.equal(parts.length, 4);
      const allItems = parts.flatMap((p) => p.items || (p.groups ? p.groups.flatMap(g => g.items) : []));
      assert.equal(allItems.length, 40);
    });

    test("Authentic answer key grades 40/40 Band 9.0", () => {
      const answers = {
        "1": "egg",
        "2": "tower",
        "3": "car",
        "4": "animals",
        "5": "bridge",
        "6": "movie",
        "7": "decorate",
        "8": "Wednesdays",
        "9": "Fradstone",
        "10": "parking",
        "11": "C",
        "12": "A",
        "13": "B",
        "14": "C",
        "15": "H",
        "16": "C",
        "17": "G",
        "18": "B",
        "19": "I",
        "20": "A",
        "21": "C",
        "22": "E",
        "23": "B",
        "24": "E",
        "25": "D",
        "26": "C",
        "27": "A",
        "28": "H",
        "29": "F",
        "30": "G",
        "31": "practical",
        "32": "publication",
        "33": "choices",
        "34": "negative",
        "35": "play",
        "36": "capitalism",
        "37": "depression",
        "38": "logic",
        "39": "opportunity",
        "40": "practice"
};
      const res = gradeListeningTest(cambridge16Test1.skills.listening, answers);
      assert.equal(res.correctCount, 40);
      assert.equal(res.bandScore, 9.0);
    });
  });

  describe("Test 2 Listening Fidelity", () => {
    test("Structure, question count and types", () => {
      const parts = cambridge16Test2.skills.listening.parts;
      assert.equal(parts.length, 4);
      const allItems = parts.flatMap((p) => p.items || (p.groups ? p.groups.flatMap(g => g.items) : []));
      assert.equal(allItems.length, 40);
    });

    test("Authentic answer key grades 40/40 Band 9.0", () => {
      const answers = {
        "1": "frame",
        "2": "195",
        "3": "payment",
        "4": "Grandparents",
        "5": "colour",
        "6": "hand",
        "7": "background",
        "8": "focus",
        "9": "ten",
        "10": "plastic",
        "11": "C",
        "12": "B",
        "13": "A",
        "14": "A",
        "15": "C",
        "16": "D",
        "17": "A",
        "18": "B",
        "19": "B",
        "20": "C",
        "21": "B",
        "22": "A",
        "23": "C",
        "24": "C",
        "25": "history",
        "26": "paper",
        "27": "humans",
        "28": "stress",
        "29": "graph",
        "30": "evaluate",
        "31": "creativity",
        "32": "therapy",
        "33": "fitness",
        "34": "balance",
        "35": "brain",
        "36": "motivation",
        "37": "isolation",
        "38": "calories",
        "39": "obesity",
        "40": "habit"
};
      const res = gradeListeningTest(cambridge16Test2.skills.listening, answers);
      assert.equal(res.correctCount, 40);
      assert.equal(res.bandScore, 9.0);
    });
  });

  describe("Test 3 Listening Fidelity", () => {
    test("Structure, question count and types", () => {
      const parts = cambridge16Test3.skills.listening.parts;
      assert.equal(parts.length, 4);
      const allItems = parts.flatMap((p) => p.items || (p.groups ? p.groups.flatMap(g => g.items) : []));
      assert.equal(allItems.length, 40);
    });

    test("Authentic answer key grades 40/40 Band 9.0", () => {
      const answers = {
        "1": "park",
        "2": "blue",
        "3": "reference",
        "4": "story",
        "5": "rain",
        "6": "snack",
        "7": "medication",
        "8": "helmet",
        "9": "tent",
        "10": "199",
        "11": "A",
        "12": "C",
        "13": "B",
        "14": "C",
        "15": "D",
        "16": "F",
        "17": "A",
        "18": "H",
        "19": "C",
        "20": "G",
        "21": "C",
        "22": "D",
        "23": "C",
        "24": "E",
        "25": "C",
        "26": "A",
        "27": "B",
        "28": "A",
        "29": "A",
        "30": "C",
        "31": "grandmother",
        "32": "decade",
        "33": "equipment",
        "34": "economic",
        "35": "basic",
        "36": "round",
        "37": "bone",
        "38": "rough",
        "39": "style",
        "40": "sheep"
};
      const res = gradeListeningTest(cambridge16Test3.skills.listening, answers);
      assert.equal(res.correctCount, 40);
      assert.equal(res.bandScore, 9.0);
    });
  });

  describe("Test 4 Listening Fidelity", () => {
    test("Structure, question count and types", () => {
      const parts = cambridge16Test4.skills.listening.parts;
      assert.equal(parts.length, 4);
      const allItems = parts.flatMap((p) => p.items || (p.groups ? p.groups.flatMap(g => g.items) : []));
      assert.equal(allItems.length, 40);
    });

    test("Authentic answer key grades 40/40 Band 9.0", () => {
      const answers = {
        "1": "28th",
        "2": "550",
        "3": "Chervil",
        "4": "garage",
        "5": "garden",
        "6": "parking",
        "7": "wood",
        "8": "bridge",
        "9": "monument",
        "10": "March",
        "11": "C",
        "12": "A",
        "13": "B",
        "14": "B",
        "15": "C",
        "16": "F",
        "17": "A",
        "18": "I",
        "19": "E",
        "20": "H",
        "21": "B",
        "22": "C",
        "23": "B",
        "24": "C",
        "25": "C",
        "26": "F",
        "27": "D",
        "28": "E",
        "29": "B",
        "30": "A",
        "31": "spices",
        "32": "colony",
        "33": "fat",
        "34": "head",
        "35": "movement",
        "36": "balance",
        "37": "brain",
        "38": "smell",
        "39": "rats",
        "40": "forest"
};
      const res = gradeListeningTest(cambridge16Test4.skills.listening, answers);
      assert.equal(res.correctCount, 40);
      assert.equal(res.bandScore, 9.0);
    });
  });
});
