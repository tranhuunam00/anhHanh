import { describe, it } from "node:test";
import assert from "node:assert/strict";

// Cambridge 19 Passages
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

// Cambridge 19 Explanations
import { cam19Test1ReadingExplanations } from "../src/data/ielts/explanations/cam19Test1ReadingExplanations.js";
import { cam19Test2ReadingExplanations } from "../src/data/ielts/explanations/cam19Test2ReadingExplanations.js";
import { cam19Test3ReadingExplanations } from "../src/data/ielts/explanations/cam19Test3ReadingExplanations.js";
import { cam19Test4ReadingExplanations } from "../src/data/ielts/explanations/cam19Test4ReadingExplanations.js";

describe("Cambridge 19 Reading Explanations 100% Verbatim Evidence & Accuracy", () => {
  const tests = [
    {
      testNum: 1,
      explanations: cam19Test1ReadingExplanations,
      passages: [cambridge19Test1ReadingPassage1, cambridge19Test1ReadingPassage2, cambridge19Test1ReadingPassage3]
    },
    {
      testNum: 2,
      explanations: cam19Test2ReadingExplanations,
      passages: [cambridge19Test2ReadingPassage1, cambridge19Test2ReadingPassage2, cambridge19Test2ReadingPassage3]
    },
    {
      testNum: 3,
      explanations: cam19Test3ReadingExplanations,
      passages: [cambridge19Test3ReadingPassage1, cambridge19Test3ReadingPassage2, cambridge19Test3ReadingPassage3]
    },
    {
      testNum: 4,
      explanations: cam19Test4ReadingExplanations,
      passages: [cambridge19Test4ReadingPassage1, cambridge19Test4ReadingPassage2, cambridge19Test4ReadingPassage3]
    }
  ];

  for (const { testNum, explanations, passages } of tests) {
    it(`should verify Cambridge 19 Test ${testNum} has 40/40 questions with 100% verbatim passage evidence`, () => {
      const pTexts = {
        1: passages[0].paragraphs.map(p => p.text).join("\n\n"),
        2: passages[1].paragraphs.map(p => p.text).join("\n\n"),
        3: passages[2].paragraphs.map(p => p.text).join("\n\n"),
      };

      for (let q = 1; q <= 40; q++) {
        const pIndex = q <= 13 ? 1 : q <= 26 ? 2 : 3;
        const exp = explanations[q];
        assert.ok(exp, `Test ${testNum} Q${q} must have an explanation object`);
        assert.equal(exp.qNum, q, `Test ${testNum} Q${q} qNum must match`);
        assert.ok(exp.answer, `Test ${testNum} Q${q} must have an answer`);
        assert.ok(exp.location, `Test ${testNum} Q${q} must have a location`);
        assert.ok(exp.explanation, `Test ${testNum} Q${q} must have a detailed explanation`);
        assert.ok(Array.isArray(exp.keywords) && exp.keywords.length > 0, `Test ${testNum} Q${q} must have keywords`);

        const ev = exp.evidence;
        assert.ok(typeof ev === "string" && ev.trim().length >= 15, `Test ${testNum} Q${q} evidence must be at least 15 chars`);
        const foundIndex = pTexts[pIndex].indexOf(ev.trim());
        assert.notEqual(
          foundIndex,
          -1,
          `Test ${testNum} Q${q} evidence MUST exist verbatim in Passage ${pIndex}. Failed quote: "${ev.slice(0, 60)}..."`
        );
      }
    });
  }
});

