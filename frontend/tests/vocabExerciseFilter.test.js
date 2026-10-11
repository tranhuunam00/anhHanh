import test from "node:test";
import assert from "node:assert/strict";

/**
 * Filter vocabulary items based on mastery status filter
 */
export function filterVocabByStatus(pool, statusFilter = "UNMASTERED") {
  if (!Array.isArray(pool)) return [];
  if (statusFilter === "UNMASTERED") {
    return pool.filter((w) => w && w.status !== "MASTERED");
  }
  if (statusFilter === "MASTERED") {
    return pool.filter((w) => w && w.status === "MASTERED");
  }
  return pool.filter(Boolean);
}

/**
 * Compute counts for unmastered and mastered items
 */
export function getVocabStatusCounts(pool) {
  if (!Array.isArray(pool)) return { total: 0, unmastered: 0, mastered: 0 };
  const valid = pool.filter(Boolean);
  const mastered = valid.filter((w) => w.status === "MASTERED").length;
  const unmastered = valid.length - mastered;
  return {
    total: valid.length,
    unmastered,
    mastered,
  };
}

test("vocabExerciseFilter - filterVocabByStatus", async (t) => {
  const sampleWords = [
    { id: 1, word: "landscape", status: "NEW" },
    { id: 2, word: "peak", status: "LEARNING" },
    { id: 3, word: "glacier", status: "MASTERED" },
    { id: 4, word: "valley", status: "MASTERED" },
    { id: 5, word: "plateau", status: "NEW" },
  ];

  await t.test("filters UNMASTERED items correctly (default)", () => {
    const unmastered = filterVocabByStatus(sampleWords, "UNMASTERED");
    assert.equal(unmastered.length, 3);
    assert.deepEqual(
      unmastered.map((w) => w.word),
      ["landscape", "peak", "plateau"]
    );
    assert.ok(unmastered.every((w) => w.status !== "MASTERED"));
  });

  await t.test("filters MASTERED items correctly", () => {
    const mastered = filterVocabByStatus(sampleWords, "MASTERED");
    assert.equal(mastered.length, 2);
    assert.deepEqual(
      mastered.map((w) => w.word),
      ["glacier", "valley"]
    );
    assert.ok(mastered.every((w) => w.status === "MASTERED"));
  });

  await t.test("returns all items when status is ALL", () => {
    const all = filterVocabByStatus(sampleWords, "ALL");
    assert.equal(all.length, 5);
  });

  await t.test("handles null, undefined and empty array safely", () => {
    assert.deepEqual(filterVocabByStatus(null, "UNMASTERED"), []);
    assert.deepEqual(filterVocabByStatus(undefined, "MASTERED"), []);
    assert.deepEqual(filterVocabByStatus([], "ALL"), []);
  });
});

test("vocabExerciseFilter - getVocabStatusCounts", async (t) => {
  const sampleWords = [
    { id: 1, word: "a", status: "NEW" },
    { id: 2, word: "b", status: "LEARNING" },
    { id: 3, word: "c", status: "MASTERED" },
  ];

  await t.test("computes accurate counts for mixed status pool", () => {
    const counts = getVocabStatusCounts(sampleWords);
    assert.equal(counts.total, 3);
    assert.equal(counts.unmastered, 2);
    assert.equal(counts.mastered, 1);
  });

  await t.test("handles empty or invalid inputs", () => {
    assert.deepEqual(getVocabStatusCounts([]), { total: 0, unmastered: 0, mastered: 0 });
    assert.deepEqual(getVocabStatusCounts(null), { total: 0, unmastered: 0, mastered: 0 });
  });
});
