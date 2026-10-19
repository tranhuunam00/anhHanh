import test, { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  getDefaultStructuresByGenre,
  DEFAULT_TASK2_STRUCTURES,
  DEFAULT_TASK1_STRUCTURES,
  getFallbackCollocations,
  getFallbackSentenceFrames,
} from "../src/utils/writingDefaultStructures.js";

describe("writingDefaultStructures Unit Tests", () => {
  it("happy path: returns Task 2 structures by default or when genre is ielts_task2", () => {
    const defaultRes = getDefaultStructuresByGenre();
    assert.ok(Array.isArray(defaultRes));
    assert.equal(defaultRes.length, DEFAULT_TASK2_STRUCTURES.length);
    assert.equal(defaultRes[0].id, "def_t2_1");
    assert.ok(defaultRes[0].meaning.includes("thuyết phục"));

    const task2Res = getDefaultStructuresByGenre("ielts_task2");
    assert.deepEqual(task2Res, DEFAULT_TASK2_STRUCTURES);
  });

  it("happy path: returns Task 1 structures when genre is ielts_task1", () => {
    const task1Res = getDefaultStructuresByGenre("ielts_task1");
    assert.ok(Array.isArray(task1Res));
    assert.equal(task1Res.length, DEFAULT_TASK1_STRUCTURES.length);
    assert.equal(task1Res[0].id, "def_t1_1");
    assert.ok(task1Res[0].meaning.includes("Biểu đồ"));
  });

  it("boundary / fallback: handles unknown genre by falling back to Task 2", () => {
    const unknownRes = getDefaultStructuresByGenre("unknown_genre");
    assert.deepEqual(unknownRes, DEFAULT_TASK2_STRUCTURES);

    const emptyRes = getDefaultStructuresByGenre("");
    assert.deepEqual(emptyRes, DEFAULT_TASK2_STRUCTURES);

    const nullRes = getDefaultStructuresByGenre(null);
    assert.deepEqual(nullRes, DEFAULT_TASK2_STRUCTURES);
  });

  it("item structure verification: each item contains required fields with Vietnamese meaning", () => {
    [...DEFAULT_TASK2_STRUCTURES, ...DEFAULT_TASK1_STRUCTURES].forEach((item) => {
      assert.ok(item.id, "Item must have id");
      assert.ok(item.phrase, "Item must have phrase");
      assert.ok(item.meaning, "Item must have Vietnamese meaning");
      assert.ok(item.template, "Item must have template");
      assert.ok(item.band, "Item must have band");
      assert.ok(item.usage, "Item must have usage guide");
    });
  });

  it("fallback collocations: extracts collocations and avoids duplicates", () => {
    const collocations = getFallbackCollocations("young professionals career work", ["retention incentives"]);
    assert.ok(Array.isArray(collocations));
    assert.ok(collocations.length > 0);
    assert.ok(!collocations.some((c) => c.word === "retention incentives"));
    assert.ok(collocations[0].meaning);
    assert.equal(collocations[0].isGenerated, true);
  });

  it("fallback sentence frames: generates high band patterns without duplicate", () => {
    const frames = getFallbackSentenceFrames(["Under no circumstances should the significance of [...] be underestimated."]);
    assert.ok(Array.isArray(frames));
    assert.ok(frames.length > 0);
    assert.ok(!frames.some((f) => f.phrase === "Under no circumstances should the significance of [...] be underestimated."));
    assert.ok(frames[0].meaning);
    assert.ok(frames[0].band);
  });
});

