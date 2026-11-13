import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getReadingExplanation } from "../src/utils/ieltsReadingExplanations.js";
import { cam20Test1ReadingExplanations } from "../src/data/ielts/explanations/cam20Test1ReadingExplanations.js";
import { cam20Test2ReadingExplanations } from "../src/data/ielts/explanations/cam20Test2ReadingExplanations.js";
import { cam20Test3ReadingExplanations } from "../src/data/ielts/explanations/cam20Test3ReadingExplanations.js";
import { cam20Test4ReadingExplanations } from "../src/data/ielts/explanations/cam20Test4ReadingExplanations.js";
import { cam21Test1ReadingExplanations } from "../src/data/ielts/explanations/cam21Test1ReadingExplanations.js";
import { cam21Test2ReadingExplanations } from "../src/data/ielts/explanations/cam21Test2ReadingExplanations.js";
import { cam21Test3ReadingExplanations } from "../src/data/ielts/explanations/cam21Test3ReadingExplanations.js";
import { cam21Test4ReadingExplanations } from "../src/data/ielts/explanations/cam21Test4ReadingExplanations.js";

describe("Cambridge 20 & 21 Reading Explanations & Evidence - Unit Tests", () => {
  const tests = [
    { id: "cambridge-20-test-1", data: cam20Test1ReadingExplanations },
    { id: "cambridge-20-test-2", data: cam20Test2ReadingExplanations },
    { id: "cambridge-20-test-3", data: cam20Test3ReadingExplanations },
    { id: "cambridge-20-test-4", data: cam20Test4ReadingExplanations },
    { id: "cambridge-21-test-1", data: cam21Test1ReadingExplanations },
    { id: "cambridge-21-test-2", data: cam21Test2ReadingExplanations },
    { id: "cambridge-21-test-3", data: cam21Test3ReadingExplanations },
    { id: "cambridge-21-test-4", data: cam21Test4ReadingExplanations },
  ];

  for (const t of tests) {
    it(`${t.id} has all 40 curated questions with rich metadata`, () => {
      const keys = Object.keys(t.data);
      assert.equal(keys.length, 40, `${t.id} must have exactly 40 questions`);

      for (let q = 1; q <= 40; q++) {
        const item = t.data[q];
        assert.ok(item, `Question ${q} must exist in ${t.id}`);
        assert.equal(item.qNum, q);
        assert.ok(typeof item.answer === "string" && item.answer.trim().length > 0, `Q${q} must have answer`);
        assert.ok(typeof item.location === "string" && item.location.trim().length > 0, `Q${q} must have location`);
        assert.ok(typeof item.evidence === "string" && item.evidence.trim().length > 0, `Q${q} must have evidence`);
        assert.ok(typeof item.explanation === "string" && item.explanation.trim().length > 0, `Q${q} must have explanation`);
        assert.ok(Array.isArray(item.keywords) && item.keywords.length > 0, `Q${q} must have keywords`);

        // Verify zero identity mappings (no kw ↔ kw)
        for (const kw of item.keywords) {
          assert.ok(kw.question && kw.passage, `Q${q} keywords must have question and passage`);
          assert.notEqual(
            kw.question.trim().toLowerCase(),
            kw.passage.trim().toLowerCase(),
            `Q${q} keyword cannot map identical word to itself: "${kw.question}"`
          );
        }
      }
    });

    it(`getReadingExplanation properly retrieves ${t.id} questions`, () => {
      for (const q of [1, 14, 25, 40]) {
        const exp = getReadingExplanation(t.id, q);
        assert.equal(exp.qNum, q);
        assert.ok(exp.evidence.length > 0);
        assert.ok(exp.explanation.length > 0);
      }
    });
  }
});
