import { describe, it } from "node:test";
import assert from "node:assert/strict";

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

// Cambridge 17 & 18 Explanations
import { cam17Test1ReadingExplanations } from "../src/data/ielts/explanations/cam17Test1ReadingExplanations.js";
import { cam17Test2ReadingExplanations } from "../src/data/ielts/explanations/cam17Test2ReadingExplanations.js";
import { cam17Test3ReadingExplanations } from "../src/data/ielts/explanations/cam17Test3ReadingExplanations.js";
import { cam17Test4ReadingExplanations } from "../src/data/ielts/explanations/cam17Test4ReadingExplanations.js";
import { cam18Test1ReadingExplanations } from "../src/data/ielts/explanations/cam18Test1ReadingExplanations.js";
import { cam18Test2ReadingExplanations } from "../src/data/ielts/explanations/cam18Test2ReadingExplanations.js";
import { cam18Test3ReadingExplanations } from "../src/data/ielts/explanations/cam18Test3ReadingExplanations.js";
import { cam18Test4ReadingExplanations } from "../src/data/ielts/explanations/cam18Test4ReadingExplanations.js";

describe("Cambridge 17 & 18 Reading Explanations - 100% Verbatim Evidence", () => {
  const tests = [
    { book: 17, testNum: 1, exp: cam17Test1ReadingExplanations, p: [cambridge17Test1ReadingPassage1, cambridge17Test1ReadingPassage2, cambridge17Test1ReadingPassage3] },
    { book: 17, testNum: 2, exp: cam17Test2ReadingExplanations, p: [cambridge17Test2ReadingPassage1, cambridge17Test2ReadingPassage2, cambridge17Test2ReadingPassage3] },
    { book: 17, testNum: 3, exp: cam17Test3ReadingExplanations, p: [cambridge17Test3ReadingPassage1, cambridge17Test3ReadingPassage2, cambridge17Test3ReadingPassage3] },
    { book: 17, testNum: 4, exp: cam17Test4ReadingExplanations, p: [cambridge17Test4ReadingPassage1, cambridge17Test4ReadingPassage2, cambridge17Test4ReadingPassage3] },
    { book: 18, testNum: 1, exp: cam18Test1ReadingExplanations, p: [cambridge18Test1ReadingPassage1, cambridge18Test1ReadingPassage2, cambridge18Test1ReadingPassage3] },
    { book: 18, testNum: 2, exp: cam18Test2ReadingExplanations, p: [cambridge18Test2ReadingPassage1, cambridge18Test2ReadingPassage2, cambridge18Test2ReadingPassage3] },
    { book: 18, testNum: 3, exp: cam18Test3ReadingExplanations, p: [cambridge18Test3ReadingPassage1, cambridge18Test3ReadingPassage2, cambridge18Test3ReadingPassage3] },
    { book: 18, testNum: 4, exp: cam18Test4ReadingExplanations, p: [cambridge18Test4ReadingPassage1, cambridge18Test4ReadingPassage2, cambridge18Test4ReadingPassage3] },
  ];

  for (const { book, testNum, exp, p } of tests) {
    it(`Cambridge ${book} Test ${testNum} has 40/40 questions with 100% verbatim passage evidence`, () => {
      const pTexts = {
        1: p[0].paragraphs.map(item => item.text).join("\n\n"),
        2: p[1].paragraphs.map(item => item.text).join("\n\n"),
        3: p[2].paragraphs.map(item => item.text).join("\n\n"),
      };

      for (let q = 1; q <= 40; q++) {
        const pIndex = q <= 13 ? 1 : q <= 26 ? 2 : 3;
        const item = exp[q];
        assert.ok(item, `Cam ${book} Test ${testNum} Q${q} must have an explanation object`);
        assert.equal(item.qNum, q);
        assert.ok(item.answer, `Cam ${book} Test ${testNum} Q${q} must have an answer`);
        assert.ok(item.location, `Cam ${book} Test ${testNum} Q${q} must have a location`);
        assert.ok(item.explanation, `Cam ${book} Test ${testNum} Q${q} must have an explanation`);
        assert.ok(Array.isArray(item.keywords) && item.keywords.length > 0);

        const ev = item.evidence;
        assert.ok(typeof ev === "string" && ev.trim().length >= 10);
        const idx = pTexts[pIndex].indexOf(ev.trim());
        assert.notEqual(
          idx,
          -1,
          `Cam ${book} Test ${testNum} Q${q} evidence must exist verbatim in Passage ${pIndex}. Failed: "${ev.slice(0, 50)}..."`
        );
      }
    });
  }
});
