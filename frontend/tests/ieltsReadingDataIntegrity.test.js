import test from "node:test";
import assert from "node:assert/strict";
import { getLayoutGapNumbers, getReadingGroupLayout, getReferenceOptions } from "../src/utils/ieltsReadingLayoutUtils.js";
import { getChooseTwoBlocks } from "../src/utils/ieltsReadingChooseTwoUtils.js";
import { gradeReadingTest } from "../src/utils/ieltsScoring.js";
import { getReadingExplanation } from "../src/utils/ieltsReadingExplanations.js";

const BOOKS = [16, 17, 18];
const TESTS = [1, 2, 3, 4];

async function loadReading(book, testNo) {
  const mod = await import(`../src/data/ielts/cambridge${book}Test${testNo}Reading.js`);
  return Object.values(mod)[0];
}

for (const book of BOOKS) {
  for (const testNo of TESTS) {
    test(`Cambridge ${book} Test ${testNo} reading data integrity`, async (t) => {
      const reading = await loadReading(book, testNo);
      const groups = reading.passages.flatMap((p) => p.groups);

      await t.test("questions 1–40 each appear exactly once", () => {
        const numbers = groups.flatMap((g) => (g.items || []).map((it) => it.number)).sort((a, b) => a - b);
        assert.deepEqual(numbers, Array.from({ length: 40 }, (_, i) => i + 1));
      });

      await t.test("every question has an accepted answer", () => {
        for (const g of groups) {
          const pairAnswers = g.items?.[0]?.answers || [];
          for (const it of g.items || []) {
            const answers = it.answers || (it.pairNumber ? pairAnswers : []);
            assert.ok(Array.isArray(answers) && answers.length > 0, `Q${it.number} has no answers`);
          }
        }
      });

      await t.test("group numbers match item numbers", () => {
        for (const g of groups) {
          if (!Array.isArray(g.numbers)) continue;
          assert.deepEqual(g.numbers, (g.items || []).map((it) => it.number), `group ${g.numbers[0]}`);
        }
      });

      await t.test("summary / notes / table gaps match the group's questions", () => {
        for (const g of groups) {
          if (getReadingGroupLayout(g) === "items") continue;
          assert.deepEqual(getLayoutGapNumbers(g), g.numbers, `layout gaps of group ${g.numbers?.[0]}`);
        }
      });

      await t.test("letter answers exist in the word box / heading list", () => {
        for (const g of groups) {
          const values = getReferenceOptions(g).map((o) => o.value.toLowerCase());
          if (values.length === 0) continue;
          for (const it of g.items || []) {
            for (const a of it.answers || []) {
              assert.ok(values.includes(String(a).toLowerCase()), `Q${it.number} answer ${a} not in box`);
            }
          }
        }
      });

      await t.test("choose-two groups render exactly one block with options", () => {
        for (const g of groups.filter((x) => x.groupType === "choose_two" || x.groupType === "pick_multiple")) {
          const blocks = getChooseTwoBlocks(g);
          assert.equal(blocks.length, 1, `group ${g.numbers?.[0]}`);
          assert.ok(blocks[0].options.length >= 5);
        }
      });

      await t.test("passages have no leftover OCR artefacts", () => {
        for (const p of reading.passages) {
          const text = p.paragraphs.map((x) => x.text).join(" ");
          assert.doesNotMatch(text, /\s[,.;:]\s|\{\d+\}|\bIfthe\b|\bofa\b|othenuise|strawbeny/, p.title);
        }
      });

      if (book !== 18 || testNo === 1) {
        await t.test("explanations quote sentences from the real passage (no stale curated set)", () => {
          const testId = `cambridge-${book}-test-${testNo}`;
          reading.passages.forEach((p) => {
            const passageText = p.paragraphs.map((x) => x.text).join("\n\n");
            for (const g of p.groups) {
              for (const it of g.items || []) {
                const exp = getReadingExplanation(testId, it.number, passageText, it);
                assert.equal(exp.qNum, it.number);
                if (exp.evidence && !exp.evidence.startsWith("Vui lòng")) {
                  assert.ok(passageText.includes(exp.evidence.replace(/^"|"$/g, "").slice(0, 40)), `${testId} Q${it.number}`);
                }
              }
            }
          });
        });
      }

      await t.test("grading the official answers scores 40/40", () => {
        const answers = {};
        for (const g of groups) {
          const items = g.items || [];
          items.forEach((it, idx) => {
            const list = it.answers || items[0]?.answers || [];
            answers[it.number] = it.pairNumber ? list[idx % list.length] : list[0];
          });
        }
        const { correctCount } = gradeReadingTest(reading, answers);
        assert.equal(correctCount, 40);
      });
    });
  }
}
