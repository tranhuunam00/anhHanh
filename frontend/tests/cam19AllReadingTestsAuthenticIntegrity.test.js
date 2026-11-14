import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseOption } from "../src/utils/cambridgeOptionUtils.js";
import { cambridge19Test1ReadingPassage1 } from "../src/data/ielts/cambridge19Test1ReadingPassage1.js";
import { cambridge19Test1ReadingPassage2 } from "../src/data/ielts/cambridge19Test1ReadingPassage2.js";
import { cambridge19Test1ReadingPassage3 } from "../src/data/ielts/cambridge19Test1ReadingPassage3.js";
import { cambridge19Test2ReadingPassage1 } from "../src/data/ielts/cambridge19Test2ReadingPassage1.js";
import { cambridge19Test2ReadingPassage2 } from "../src/data/ielts/cambridge19Test2ReadingPassage2.js";
import { cambridge19Test2ReadingPassage3 } from "../src/data/ielts/cambridge19Test2ReadingPassage3.js";
import { cambridge19Test3ReadingPassage1 } from "../src/data/ielts/cambridge19Test3ReadingPassage1.js";
import { cambridge19Test3ReadingPassage2 } from "../src/data/ielts/cambridge19Test3ReadingPassage2.js";
import { cambridge19Test3ReadingPassage3 } from "../src/data/ielts/cambridge19Test3ReadingPassage3.js";
import { cambridge19Test4ReadingPassage1 } from "../src/data/ielts/cambridge19Test4ReadingPassage1.js";
import { cambridge19Test4ReadingPassage2 } from "../src/data/ielts/cambridge19Test4ReadingPassage2.js";
import { cambridge19Test4ReadingPassage3 } from "../src/data/ielts/cambridge19Test4ReadingPassage3.js";

describe("Cambridge 19 Reading Authentic Integrity & UI Option Formatting", () => {
  it("should parse single letter options cleanly without repeating text", () => {
    const singleA = parseOption("A");
    assert.equal(singleA.letter, "A");
    assert.equal(singleA.text, "");

    const singleH = parseOption("H");
    assert.equal(singleH.letter, "H");
    assert.equal(singleH.text, "");

    const descOpt = parseOption("A. Professor Mat Upton");
    assert.equal(descOpt.letter, "A");
    assert.equal(descOpt.text, "Professor Mat Upton");
  });

  it("should verify Test 4 Passage 2 has exactly 6 paragraphs (A-F) and NO G or H options in Q14-17", () => {
    const p2 = cambridge19Test4ReadingPassage2;
    assert.equal(p2.paragraphs.length, 6);
    const paragraphIds = p2.paragraphs.map((p) => p.id);
    assert.deepEqual(paragraphIds, ["A", "B", "C", "D", "E", "F"]);

    const q14_17 = p2.groups[0];
    assert.equal(q14_17.groupType, "matching_information");
    assert.deepEqual(q14_17.options, ["A", "B", "C", "D", "E", "F"]);
    assert.ok(!q14_17.options.includes("G"), "Must not include paragraph G");
    assert.ok(!q14_17.options.includes("H"), "Must not include paragraph H");

    // Check Question 22 in Test 4 Passage 2
    const q22 = p2.groups[1].items.find((item) => item.number === 22);
    assert.deepEqual(q22.answers, ["B"]);
  });

  it("should verify Test 3 Passage 2 has exactly 8 paragraphs (A-H) and correct Q14-17 answers", () => {
    const p2 = cambridge19Test3ReadingPassage2;
    assert.equal(p2.paragraphs.length, 8);
    const paragraphIds = p2.paragraphs.map((p) => p.id);
    assert.deepEqual(paragraphIds, ["A", "B", "C", "D", "E", "F", "G", "H"]);

    const q14_17 = p2.groups[0];
    assert.equal(q14_17.groupType, "matching_information");
    assert.deepEqual(q14_17.options, ["A", "B", "C", "D", "E", "F", "G", "H"]);

    const q14 = q14_17.items.find((it) => it.number === 14);
    assert.deepEqual(q14.answers, ["G"]);
    const q15 = q14_17.items.find((it) => it.number === 15);
    assert.deepEqual(q15.answers, ["A"]);
    const q16 = q14_17.items.find((it) => it.number === 16);
    assert.deepEqual(q16.answers, ["H"]);
    const q17 = q14_17.items.find((it) => it.number === 17);
    assert.deepEqual(q17.answers, ["B"]);
  });

  it("should verify Test 2 Passage 2 has exactly 6 paragraphs (A-F) and valid options", () => {
    const p2 = cambridge19Test2ReadingPassage2;
    assert.equal(p2.paragraphs.length, 6);
    const paragraphIds = p2.paragraphs.map((p) => p.id);
    assert.deepEqual(paragraphIds, ["A", "B", "C", "D", "E", "F"]);

    const q14_18 = p2.groups[0];
    assert.deepEqual(q14_18.options, ["A", "B", "C", "D", "E", "F"]);
  });

  it("should verify all 4 tests have all 40 questions uniquely numbered from 1 to 40", () => {
    const tests = [
      [cambridge19Test1ReadingPassage1, cambridge19Test1ReadingPassage2, cambridge19Test1ReadingPassage3],
      [cambridge19Test2ReadingPassage1, cambridge19Test2ReadingPassage2, cambridge19Test2ReadingPassage3],
      [cambridge19Test3ReadingPassage1, cambridge19Test3ReadingPassage2, cambridge19Test3ReadingPassage3],
      [cambridge19Test4ReadingPassage1, cambridge19Test4ReadingPassage2, cambridge19Test4ReadingPassage3],
    ];

    tests.forEach((passages, tIdx) => {
      const qNums = [];
      passages.forEach((p) => {
        p.groups.forEach((g) => {
          g.items.forEach((it) => {
            qNums.push(it.number);
            assert.ok(Array.isArray(it.answers) && it.answers.length > 0, `Q${it.number} in Test ${tIdx + 1} must have answers`);
          });
        });
      });
      assert.equal(qNums.length, 40, `Test ${tIdx + 1} must have 40 questions`);
      for (let i = 1; i <= 40; i++) {
        assert.ok(qNums.includes(i), `Test ${tIdx + 1} must include Q${i}`);
      }
    });
  });
});
