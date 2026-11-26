import test from "node:test";
import assert from "node:assert/strict";
import { cambridge17DictationData } from "../src/data/ielts/cambridge17DictationData.js";
import { cambridge18DictationData } from "../src/data/ielts/cambridge18DictationData.js";
import { cambridge19DictationData } from "../src/data/ielts/cambridge19DictationData.js";
import { cambridge21DictationData } from "../src/data/ielts/cambridge21DictationData.js";

// Books whose part transcripts were re-checked against the printed audioscripts.
const BOOKS = {
  17: cambridge17DictationData,
  18: cambridge18DictationData,
  19: cambridge19DictationData,
  21: cambridge21DictationData,
};

const CONTRACTION_STUB = /\b(don|doesn|didn|isn|wasn|aren|weren|wouldn|couldn|shouldn|hasn|haven|hadn)\b(?!['’])/;
const MARGIN_MARKER = /(^|\s)(Q\s?[0-9IilLoO|]{1,3}(\/[0-9IilLoO|]{1,3})?|O\s?\d{1,3}(\/\d{1,3})?|0\d{1,2}\/\d{1,2})(?=[\s.,]|$)/;

function partEntries(data) {
  return Object.entries(data).filter(([id]) => /-s\d$/.test(id));
}

for (const [book, data] of Object.entries(BOOKS)) {
  test(`Cambridge ${book} dictation transcripts`, async (t) => {
    const parts = partEntries(data);

    await t.test("has all 16 parts", () => {
      assert.equal(parts.length, 16);
    });

    await t.test("no Whisper contraction stubs (\"don seem\", \"doesn she\")", () => {
      for (const [id, part] of parts) {
        for (const c of part.challenges) {
          assert.doesNotMatch(c.text, CONTRACTION_STUB, `${id}#${c.position}: ${c.text}`);
        }
      }
    });

    await t.test("no audioscript margin markers (\"Q21/22\", \"Q 13/14\")", () => {
      for (const [id, part] of parts) {
        for (const c of part.challenges) {
          assert.doesNotMatch(c.text, MARGIN_MARKER, `${id}#${c.position}: ${c.text}`);
        }
      }
    });

    await t.test("no line merges several turns without punctuation (24+ words)", () => {
      // Lines cut mid-sentence can legitimately be ~20 words with no punctuation.
      for (const [id, part] of parts) {
        for (const c of part.challenges) {
          const words = c.text.split(/\s+/).length;
          assert.ok(words < 24 || /[.?!,]/.test(c.text), `${id}#${c.position}: ${c.text}`);
        }
      }
    });

    await t.test("timings are ordered, positive and inside the part", () => {
      for (const [id, part] of parts) {
        part.challenges.forEach((c, i) => {
          assert.ok(c.time_end > c.time_start, `${id}#${c.position} end > start`);
          assert.ok(c.time_end - c.time_start <= 35, `${id}#${c.position} no huge silent stretch`);
          if (i > 0) assert.ok(c.time_start >= part.challenges[i - 1].time_start, `${id}#${c.position} order`);
          assert.ok(c.time_end <= part.duration + 0.5, `${id}#${c.position} inside audio`);
        });
      }
    });

    await t.test("ids, positions and words follow the challenge", () => {
      for (const [id, part] of parts) {
        assert.equal(part.total_challenges, part.challenges.length);
        part.challenges.forEach((c, i) => {
          assert.equal(c.position, i + 1);
          assert.equal(c.id, `${id}-c${i + 1}`);
          assert.ok(c.words.length > 0, `${id}#${c.position} has words`);
          assert.ok(c.words.every((w) => w.id.startsWith(`${c.id}-w`)), `${id}#${c.position} word ids`);
        });
      }
    });
  });
}

test("Cambridge 17 Test 4 Part 3: Jeanne/Thomas turns are split like the audioscript", () => {
  const lines = cambridge17DictationData["cam17-t4-s3"].challenges.filter((c) => c.time_start >= 94 && c.time_start < 108.5);
  assert.deepEqual(
    lines.map((c) => c.text),
    [
      "Exactly.",
      "So what happened? Did your mum and dad want you to be more 'academic'?",
      "Not at all. Perhaps they should have pushed me harder, though.",
      "What do you mean?",
      "I think I should have practised more.",
      "What makes you say that?",
    ]
  );
  // Each turn ends at a pause in the recording and starts where the previous one ends.
  for (let i = 1; i < 5; i++) assert.equal(lines[i].time_start, lines[i - 1].time_end);
});
