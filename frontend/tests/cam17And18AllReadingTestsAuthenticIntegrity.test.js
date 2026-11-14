import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseOption } from "../src/utils/cambridgeOptionUtils.js";

// Cambridge 17 Passages
import { cambridge17Test1ReadingPassage1 } from "../src/data/ielts/cambridge17Test1ReadingPassage1.js";
import { cambridge17Test1ReadingPassage2 } from "../src/data/ielts/cambridge17Test1ReadingPassage2.js";
import { cambridge17Test1ReadingPassage3 } from "../src/data/ielts/cambridge17Test1ReadingPassage3.js";
import { cambridge17Test2ReadingPassage1 } from "../src/data/ielts/cambridge17Test2ReadingPassage1.js";
import { cambridge17Test2ReadingPassage2 } from "../src/data/ielts/cambridge17Test2ReadingPassage2.js";
import { cambridge17Test2ReadingPassage3 } from "../src/data/ielts/cambridge17Test2ReadingPassage3.js";
import { cambridge17Test3ReadingPassage1 } from "../src/data/ielts/cambridge17Test3ReadingPassage1.js";
import { cambridge17Test3ReadingPassage2 } from "../src/data/ielts/cambridge17Test3ReadingPassage2.js";
import { cambridge17Test3ReadingPassage3 } from "../src/data/ielts/cambridge17Test3ReadingPassage3.js";
import { cambridge17Test4ReadingPassage1 } from "../src/data/ielts/cambridge17Test4ReadingPassage1.js";
import { cambridge17Test4ReadingPassage2 } from "../src/data/ielts/cambridge17Test4ReadingPassage2.js";
import { cambridge17Test4ReadingPassage3 } from "../src/data/ielts/cambridge17Test4ReadingPassage3.js";

// Cambridge 18 Passages
import { cambridge18Test1ReadingPassage1 } from "../src/data/ielts/cambridge18Test1ReadingPassage1.js";
import { cambridge18Test1ReadingPassage2 } from "../src/data/ielts/cambridge18Test1ReadingPassage2.js";
import { cambridge18Test1ReadingPassage3 } from "../src/data/ielts/cambridge18Test1ReadingPassage3.js";
import { cambridge18Test2ReadingPassage1 } from "../src/data/ielts/cambridge18Test2ReadingPassage1.js";
import { cambridge18Test2ReadingPassage2 } from "../src/data/ielts/cambridge18Test2ReadingPassage2.js";
import { cambridge18Test2ReadingPassage3 } from "../src/data/ielts/cambridge18Test2ReadingPassage3.js";
import { cambridge18Test3ReadingPassage1 } from "../src/data/ielts/cambridge18Test3ReadingPassage1.js";
import { cambridge18Test3ReadingPassage2 } from "../src/data/ielts/cambridge18Test3ReadingPassage2.js";
import { cambridge18Test3ReadingPassage3 } from "../src/data/ielts/cambridge18Test3ReadingPassage3.js";
import { cambridge18Test4ReadingPassage1 } from "../src/data/ielts/cambridge18Test4ReadingPassage1.js";
import { cambridge18Test4ReadingPassage2 } from "../src/data/ielts/cambridge18Test4ReadingPassage2.js";
import { cambridge18Test4ReadingPassage3 } from "../src/data/ielts/cambridge18Test4ReadingPassage3.js";

describe("Cambridge 17 & 18 Reading Authentic Integrity & Options Audit", () => {
  it("should verify Cambridge 17 matching question options and paragraph bounds", () => {
    // Test 1 Passage 2: A-G
    const c17t1p2 = cambridge17Test1ReadingPassage2;
    assert.deepEqual(c17t1p2.paragraphs.map(p => p.id), ["A", "B", "C", "D", "E", "F", "G"]);
    assert.deepEqual(c17t1p2.groups[0].options, ["A", "B", "C", "D", "E", "F", "G"]);

    // Test 2 Passage 2: A-E
    const c17t2p2 = cambridge17Test2ReadingPassage2;
    assert.deepEqual(c17t2p2.paragraphs.map(p => p.id), ["A", "B", "C", "D", "E"]);
    assert.deepEqual(c17t2p2.groups[0].options, ["A", "B", "C", "D", "E"]);

    // Test 4 Passage 2: A-F
    const c17t4p2 = cambridge17Test4ReadingPassage2;
    assert.deepEqual(c17t4p2.paragraphs.map(p => p.id), ["A", "B", "C", "D", "E", "F"]);
    assert.deepEqual(c17t4p2.groups[0].options, ["A", "B", "C", "D", "E", "F"]);

    // Test 4 Passage 3: A-H
    const c17t4p3 = cambridge17Test4ReadingPassage3;
    assert.deepEqual(c17t4p3.paragraphs.map(p => p.id), ["A", "B", "C", "D", "E", "F", "G", "H"]);
    assert.deepEqual(c17t4p3.groups[0].options, ["A", "B", "C", "D", "E", "F", "G", "H"]);
  });

  it("should verify Cambridge 18 matching question options and paragraph bounds", () => {
    // Test 1 Passage 2: A-G
    const c18t1p2 = cambridge18Test1ReadingPassage2;
    assert.deepEqual(c18t1p2.paragraphs.map(p => p.id), ["A", "B", "C", "D", "E", "F", "G"]);
    assert.deepEqual(c18t1p2.groups[0].options, ["A", "B", "C", "D", "E", "F", "G"]);

    // Test 1 Passage 3: A-F
    const c18t1p3 = cambridge18Test1ReadingPassage3;
    assert.deepEqual(c18t1p3.paragraphs.map(p => p.id), ["A", "B", "C", "D", "E", "F"]);
    assert.deepEqual(c18t1p3.groups[0].options, ["A", "B", "C", "D", "E", "F"]);

    // Test 3 Passage 1: A-H
    const c18t3p1 = cambridge18Test3ReadingPassage1;
    assert.deepEqual(c18t3p1.paragraphs.map(p => p.id), ["A", "B", "C", "D", "E", "F", "G", "H"]);
    assert.deepEqual(c18t3p1.groups[0].options, ["A", "B", "C", "D", "E", "F", "G", "H"]);

    // Test 4 Passage 1: A-E
    const c18t4p1 = cambridge18Test4ReadingPassage1;
    assert.deepEqual(c18t4p1.paragraphs.map(p => p.id), ["A", "B", "C", "D", "E"]);
    assert.deepEqual(c18t4p1.groups[0].options, ["A", "B", "C", "D", "E"]);
  });

  it("should verify Cambridge 18 Test 3 & 4 authentic official answer keys", () => {
    // Cam 18 Test 3 Passage 2 Q16 & Q17
    const c18t3p2 = cambridge18Test3ReadingPassage2;
    const q16 = c18t3p2.groups.flatMap(g => g.items).find(it => it.number === 16);
    const q17 = c18t3p2.groups.flatMap(g => g.items).find(it => it.number === 17);
    assert.deepEqual(q16.answers, ["vi"], "Q16 must be heading vi");
    assert.deepEqual(q17.answers, ["v"], "Q17 must be heading v");

    // Cam 18 Test 4 Passage 1 Q12 & Q13
    const c18t4p1 = cambridge18Test4ReadingPassage1;
    const q12 = c18t4p1.groups.flatMap(g => g.items).find(it => it.number === 12);
    const q13 = c18t4p1.groups.flatMap(g => g.items).find(it => it.number === 13);
    assert.deepEqual(q12.answers, ["A", "D"], "Q12 must accept A or D");
    assert.deepEqual(q13.answers, ["A", "D"], "Q13 must accept A or D");

    // Cam 18 Test 4 Passage 3 Q38
    const c18t4p3 = cambridge18Test4ReadingPassage3;
    const q38 = c18t4p3.groups.flatMap(g => g.items).find(it => it.number === 38);
    assert.deepEqual(q38.answers, ["A"], "Q38 must be A according to Cambridge 18 Page 128");
  });

  it("should verify all 8 tests have exactly 40 questions uniquely numbered 1 to 40", () => {
    const allTests = [
      [cambridge17Test1ReadingPassage1, cambridge17Test1ReadingPassage2, cambridge17Test1ReadingPassage3],
      [cambridge17Test2ReadingPassage1, cambridge17Test2ReadingPassage2, cambridge17Test2ReadingPassage3],
      [cambridge17Test3ReadingPassage1, cambridge17Test3ReadingPassage2, cambridge17Test3ReadingPassage3],
      [cambridge17Test4ReadingPassage1, cambridge17Test4ReadingPassage2, cambridge17Test4ReadingPassage3],
      [cambridge18Test1ReadingPassage1, cambridge18Test1ReadingPassage2, cambridge18Test1ReadingPassage3],
      [cambridge18Test2ReadingPassage1, cambridge18Test2ReadingPassage2, cambridge18Test2ReadingPassage3],
      [cambridge18Test3ReadingPassage1, cambridge18Test3ReadingPassage2, cambridge18Test3ReadingPassage3],
      [cambridge18Test4ReadingPassage1, cambridge18Test4ReadingPassage2, cambridge18Test4ReadingPassage3]
    ];

    for (const testPassages of allTests) {
      const qNums = [];
      for (const p of testPassages) {
        for (const g of p.groups) {
          for (const it of g.items) {
            qNums.push(it.number);
            if (it.pairNumber) {
              qNums.push(it.pairNumber);
            }
          }
        }
      }
      const uniqueSorted = Array.from(new Set(qNums)).sort((a, b) => a - b);
      assert.equal(uniqueSorted.length, 40, "Must have exactly 40 unique question numbers");
      assert.equal(uniqueSorted[0], 1);
      assert.equal(uniqueSorted[39], 40);
    }
  });

  it("should verify parseOption eliminates duplicate letter representations (e.g., 'A - A')", () => {
    const testCases = ["A", "B", "C", "D", "E", "F", "G", "H"];
    for (const letter of testCases) {
      const { letter: parsedLetter, text } = parseOption(letter);
      assert.equal(parsedLetter, letter);
      assert.equal(text, "");
      const displayLabel = text && text.toUpperCase() !== parsedLetter.toUpperCase()
        ? `${parsedLetter} - ${text}`
        : parsedLetter;
      assert.equal(displayLabel, letter);
    }
  });
});
