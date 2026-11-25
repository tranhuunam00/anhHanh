import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { DICTATION_DATASET_LOADERS } from "../src/utils/ieltsDictationDataLoader.js";

/**
 * Data-integrity guard for the Whisper-generated Cambridge dictation transcripts.
 * Whisper used to skip whole stretches of dialogue inside a 30 s window and invent
 * "Thank you." over the silent reading pauses; these tests keep that from coming back.
 */

const BOOKS = [16, 17, 18, 19, 20, 21];
const FILLER = /^(thank you|thanks|you|bye)[.!]?$/i;
// Cam21 full-test transcripts come from the full audio file, not from the parts.
const FULL_BUILT_FROM_PARTS = [16, 17, 18, 19, 20];

const datasets = new Map();
async function loadBook(book) {
  if (!datasets.has(book)) datasets.set(book, await DICTATION_DATASET_LOADERS[book]());
  return datasets.get(book);
}

const splitIds = (book, data) => Object.keys(data).filter((id) => new RegExp(`^cam${book}-t\\d-s\\d$`).test(id));

describe("Cambridge dictation datasets: structure", () => {
  for (const book of BOOKS) {
    test(`cam${book}: every entry has sequential positions, unique ids and matching totals`, async () => {
      const data = await loadBook(book);
      for (const [presetId, entry] of Object.entries(data)) {
        assert.equal(entry.id, presetId);
        assert.ok(Array.isArray(entry.challenges) && entry.challenges.length > 0, `${presetId} has challenges`);
        assert.equal(entry.total_challenges, entry.challenges.length, `${presetId} total_challenges`);
        const ids = new Set();
        entry.challenges.forEach((c, i) => {
          assert.equal(c.position, i + 1, `${presetId} position at index ${i}`);
          assert.equal(typeof c.text, "string");
          assert.ok(c.text.trim().length > 0, `${c.id} text is not empty`);
          assert.ok(c.time_end > c.time_start, `${c.id} ends after it starts`);
          assert.ok(!ids.has(c.id), `${c.id} is unique`);
          ids.add(c.id);
        });
      }
    });

    test(`cam${book}: challenges of each part are in playback order`, async () => {
      const data = await loadBook(book);
      for (const presetId of splitIds(book, data)) {
        const starts = data[presetId].challenges.map((c) => c.time_start);
        for (let i = 1; i < starts.length; i += 1) {
          assert.ok(starts[i] >= starts[i - 1], `${presetId} challenge ${i + 1} starts after challenge ${i}`);
        }
      }
    });

    test(`cam${book}: no filler hallucination stretched over a silent pause`, async () => {
      const data = await loadBook(book);
      for (const [presetId, entry] of Object.entries(data)) {
        for (const c of entry.challenges) {
          const span = c.time_end - c.time_start;
          assert.ok(!(FILLER.test(c.text.trim()) && span > 5), `${presetId}: "${c.text}" spans ${span.toFixed(1)}s`);
        }
      }
    });
  }
});

describe("Cambridge dictation datasets: full tests mirror their parts", () => {
  for (const book of FULL_BUILT_FROM_PARTS) {
    test(`cam${book}: each full test is the four parts in order, offset by part durations`, async () => {
      const data = await loadBook(book);
      for (let t = 1; t <= 4; t += 1) {
        const full = data[`cam${book}-t${t}-full`];
        const expected = [];
        let offset = 0;
        for (let p = 1; p <= 4; p += 1) {
          const part = data[`cam${book}-t${t}-s${p}`];
          part.challenges.forEach((c) => expected.push([c.text, Math.round((c.time_start + offset) * 100) / 100]));
          offset += part.duration;
        }
        const actual = full.challenges.map((c) => [c.text, c.time_start]);
        assert.deepEqual(actual, expected, `cam${book}-t${t}-full`);
      }
    });
  }
});

describe("Cambridge dictation datasets: previously skipped dialogue is present", () => {
  const findBetween = (entry, from, to) => entry.challenges.filter((c) => c.time_start >= from && c.time_start < to);

  test("cam18-t1-s3 has the opening of the Hugo/Chantal dialogue (01:06-01:34)", async () => {
    const data = await loadBook(18);
    const opening = findBetween(data["cam18-t1-s3"], 66, 94).map((c) => c.text).join(" ");
    assert.match(opening, /what did you think of the talk/i);
    assert.match(opening, /moved seats/i);
    assert.match(opening, /he was so tall/i);
    assert.match(opening, /hard to see through people's heads/i);
  });

  test("cam18-t1-s3 no longer starts a challenge with the cut-off fragment 'all.'", async () => {
    const data = await loadBook(18);
    assert.ok(!data["cam18-t1-s3"].challenges.some((c) => /^all\./.test(c.text)));
  });

  test("cam19-t2-s2 has the lifeboat volunteer's opening lines (01:06-01:30)", async () => {
    const data = await loadBook(19);
    const opening = findBetween(data["cam19-t2-s2"], 66, 92).map((c) => c.text).join(" ");
    assert.match(opening, /never really planned to be a lifeboat volunteer/i);
    assert.match(opening, /website designer/i);
  });

  test("cam21-t1-s1 has the start of the sailing-club phone call (01:54-02:20)", async () => {
    const data = await loadBook(21);
    const opening = findBetween(data["cam21-t1-s1"], 110, 140).map((c) => c.text).join(" ");
    assert.match(opening, /Oyster Bay Sailing Club/);
    assert.match(opening, /sailing courses for beginners/i);
  });

  test("cam18-t1-full carries the same repaired dialogue as its part", async () => {
    const data = await loadBook(18);
    const texts = data["cam18-t1-full"].challenges.map((c) => c.text).join(" ");
    assert.match(texts, /I thought it was good once I'd moved seats/i);
  });
});
