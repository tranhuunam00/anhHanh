import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { cambridge16Test1 } from "../src/data/ielts/cambridge16Test1Data.js";
import { cambridge16Test2 } from "../src/data/ielts/cambridge16Test2Data.js";
import { cambridge16Test3 } from "../src/data/ielts/cambridge16Test3Data.js";
import { cambridge16Test4 } from "../src/data/ielts/cambridge16Test4Data.js";
import { gradeReadingTest } from "../src/utils/ieltsScoring.js";
import { getReadingExplanation } from "../src/utils/ieltsReadingExplanations.js";

describe("Cambridge IELTS 16 - All 4 Reading Tests Complete 160-Question Integrity", () => {
  describe("Test 1 Reading Fidelity & Explanations", () => {
    test("Structure, question count and types", () => {
      const passages = cambridge16Test1.skills.reading.passages;
      assert.equal(passages.length, 3);
      const allItems = passages.flatMap((p) => p.groups.flatMap((g) => g.items));
      assert.equal(allItems.length, 40);
    });

    test("Authentic answer key grades 40/40 Band 9.0", () => {
      const answers = {
        "1": "FALSE",
        "2": "FALSE",
        "3": "NOT GIVEN",
        "4": "TRUE",
        "5": "TRUE",
        "6": "FALSE",
        "7": "TRUE",
        "8": "violent",
        "9": "tool",
        "10": "meat",
        "11": "photographer",
        "12": "game",
        "13": "frustration",
        "14": "iv",
        "15": "vii",
        "16": "ii",
        "17": "v",
        "18": "i",
        "19": "viii",
        "20": "vi",
        "21": "city",
        "22": "priests",
        "23": "trench",
        "24": "location",
        "25": "B",
        "26": "D",
        "27": "B",
        "28": "D",
        "29": "C",
        "30": "D",
        "31": "G",
        "32": "E",
        "33": "C",
        "34": "F",
        "35": "B",
        "36": "A",
        "37": "C",
        "38": "A",
        "39": "B",
        "40": "C"
};
      const res = gradeReadingTest(cambridge16Test1.skills.reading, answers);
      assert.equal(res.correctCount, 40);
      assert.equal(res.bandScore, 9.0);
    });

    test("All 40 questions have verified explanations", () => {
      for (let q = 1; q <= 40; q++) {
        const exp = getReadingExplanation("cambridge-16-test-1", q);
        assert.ok(exp, `Missing explanation for Test 1 Q${q}`);
        assert.ok(exp.evidence, `Missing evidence for Test 1 Q${q}`);
        assert.ok(exp.explanation, `Missing explanation text for Test 1 Q${q}`);
      }
    });
  });

  describe("Test 2 Reading Fidelity & Explanations", () => {
    test("Structure, question count and types", () => {
      const passages = cambridge16Test2.skills.reading.passages;
      assert.equal(passages.length, 3);
      const allItems = passages.flatMap((p) => p.groups.flatMap((g) => g.items));
      assert.equal(allItems.length, 40);
    });

    test("Authentic answer key grades 40/40 Band 9.0", () => {
      const answers = {
        "1": "TRUE",
        "2": "NOT GIVEN",
        "3": "TRUE",
        "4": "FALSE",
        "5": "FALSE",
        "6": "TRUE",
        "7": "TRUE",
        "8": "NOT GIVEN",
        "9": "Ridgeway",
        "10": "documents",
        "11": "soil",
        "12": "fertility",
        "13": "Rhiannon",
        "14": "D",
        "15": "C",
        "16": "A",
        "17": "G",
        "18": "B",
        "19": "H",
        "20": "E",
        "21": "YES",
        "22": "NO",
        "23": "NOT GIVEN",
        "24": "YES",
        "25": "NOT GIVEN",
        "26": "NO",
        "27": "B",
        "28": "C",
        "29": "B",
        "30": "D",
        "31": "D",
        "32": "A",
        "33": "C",
        "34": "F",
        "35": "G",
        "36": "FALSE",
        "37": "NOT GIVEN",
        "38": "NOT GIVEN",
        "39": "TRUE",
        "40": "TRUE"
};
      const res = gradeReadingTest(cambridge16Test2.skills.reading, answers);
      assert.equal(res.correctCount, 40);
      assert.equal(res.bandScore, 9.0);
    });

    test("All 40 questions have verified explanations", () => {
      for (let q = 1; q <= 40; q++) {
        const exp = getReadingExplanation("cambridge-16-test-2", q);
        assert.ok(exp, `Missing explanation for Test 2 Q${q}`);
        assert.ok(exp.evidence, `Missing evidence for Test 2 Q${q}`);
        assert.ok(exp.explanation, `Missing explanation text for Test 2 Q${q}`);
      }
    });
  });

  describe("Test 3 Reading Fidelity & Explanations", () => {
    test("Structure, question count and types", () => {
      const passages = cambridge16Test3.skills.reading.passages;
      assert.equal(passages.length, 3);
      const allItems = passages.flatMap((p) => p.groups.flatMap((g) => g.items));
      assert.equal(allItems.length, 40);
    });

    test("Authentic answer key grades 40/40 Band 9.0", () => {
      const answers = {
        "1": "FALSE",
        "2": "NOT GIVEN",
        "3": "FALSE",
        "4": "TRUE",
        "5": "TRUE",
        "6": "lightweight",
        "7": "bronze",
        "8": "levels",
        "9": "hull",
        "10": "triangular",
        "11": "music",
        "12": "grain",
        "13": "towboats",
        "14": "D",
        "15": "C",
        "16": "F",
        "17": "H",
        "18": "G",
        "19": "B",
        "20": "microorganisms",
        "21": "reindeer",
        "22": "insects",
        "23": "B",
        "24": "C",
        "25": "A",
        "26": "C",
        "27": "NOT GIVEN",
        "28": "TRUE",
        "29": "TRUE",
        "30": "NOT GIVEN",
        "31": "FALSE",
        "32": "FALSE",
        "33": "H",
        "34": "D",
        "35": "G",
        "36": "C",
        "37": "A",
        "38": "warm winter",
        "39": "summer",
        "40": "mustard plant"
};
      const res = gradeReadingTest(cambridge16Test3.skills.reading, answers);
      assert.equal(res.correctCount, 40);
      assert.equal(res.bandScore, 9.0);
    });

    test("All 40 questions have verified explanations", () => {
      for (let q = 1; q <= 40; q++) {
        const exp = getReadingExplanation("cambridge-16-test-3", q);
        assert.ok(exp, `Missing explanation for Test 3 Q${q}`);
        assert.ok(exp.evidence, `Missing evidence for Test 3 Q${q}`);
        assert.ok(exp.explanation, `Missing explanation text for Test 3 Q${q}`);
      }
    });
  });

  describe("Test 4 Reading Fidelity & Explanations", () => {
    test("Structure, question count and types", () => {
      const passages = cambridge16Test4.skills.reading.passages;
      assert.equal(passages.length, 3);
      const allItems = passages.flatMap((p) => p.groups.flatMap((g) => g.items));
      assert.equal(allItems.length, 40);
    });

    test("Authentic answer key grades 40/40 Band 9.0", () => {
      const answers = {
        "1": "posts",
        "2": "canal",
        "3": "ventilation",
        "4": "lid",
        "5": "weight",
        "6": "climbing",
        "7": "FALSE",
        "8": "NOT GIVEN",
        "9": "FALSE",
        "10": "TRUE",
        "11": "gold",
        "12": "architect",
        "13": "harbour",
        "14": "A",
        "15": "B",
        "16": "D",
        "17": "B",
        "18": "D",
        "19": "H",
        "20": "F",
        "21": "B",
        "22": "C",
        "23": "YES",
        "24": "NO",
        "25": "NOT GIVEN",
        "26": "YES",
        "27": "iii",
        "28": "vi",
        "29": "ii",
        "30": "i",
        "31": "vii",
        "32": "v",
        "33": "C",
        "34": "B",
        "35": "A",
        "36": "NO",
        "37": "NOT GIVEN",
        "38": "YES",
        "39": "NO",
        "40": "YES"
};
      const res = gradeReadingTest(cambridge16Test4.skills.reading, answers);
      assert.equal(res.correctCount, 40);
      assert.equal(res.bandScore, 9.0);
    });

    test("All 40 questions have verified explanations", () => {
      for (let q = 1; q <= 40; q++) {
        const exp = getReadingExplanation("cambridge-16-test-4", q);
        assert.ok(exp, `Missing explanation for Test 4 Q${q}`);
        assert.ok(exp.evidence, `Missing evidence for Test 4 Q${q}`);
        assert.ok(exp.explanation, `Missing explanation text for Test 4 Q${q}`);
      }
    });
  });
});
