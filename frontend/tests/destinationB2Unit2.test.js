import test from "node:test";
import assert from "node:assert/strict";
import { UNIT_2_THEORY } from "../src/data/destinationB2/unit2Theory.js";
import { UNIT_2_EXERCISES } from "../src/data/destinationB2/unit2Exercises.js";
import { gradeB2ExerciseSubmission } from "../src/utils/destinationB2Grading.js";

// Mock localStorage for Node test environment
global.localStorage = {
  store: {},
  getItem(key) {
    return this.store[key] || null;
  },
  setItem(key, value) {
    this.store[key] = String(value);
  },
  removeItem(key) {
    delete this.store[key];
  },
  clear() {
    this.store = {};
  },
};

test("destinationB2Unit2 - Theory Integrity", async (t) => {
  await t.test("Unit 2 metadata is valid", () => {
    assert.strictEqual(UNIT_2_THEORY.unit_number, 2);
    assert.strictEqual(UNIT_2_THEORY.unit_type, "vocabulary");
    assert.strictEqual(UNIT_2_THEORY.title, "Travel and transport");
    assert.ok(Array.isArray(UNIT_2_THEORY.sections));
    assert.strictEqual(UNIT_2_THEORY.sections.length, 5);
  });

  await t.test("All 5 core vocabulary sections exist with rules", () => {
    const sectionIds = UNIT_2_THEORY.sections.map((s) => s.id);
    assert.ok(sectionIds.includes("topic_vocabulary_in_contrast"));
    assert.ok(sectionIds.includes("phrasal_verbs"));
    assert.ok(sectionIds.includes("phrases_and_collocations"));
    assert.ok(sectionIds.includes("word_patterns"));
    assert.ok(sectionIds.includes("word_formation"));

    UNIT_2_THEORY.sections.forEach((sec) => {
      assert.ok(sec.title && sec.title.length > 0);
      assert.ok(Array.isArray(sec.rules));
      assert.ok(sec.rules.length > 0);
      sec.rules.forEach((r) => {
        assert.ok(r.use && r.use.length > 0);
        assert.ok(r.example && r.example.length > 0);
      });
    });
  });
});

test("destinationB2Unit2 - Exercises Data Integrity", async (t) => {
  await t.test("Unit 2 contains exactly 9 exercises A through I", () => {
    assert.strictEqual(UNIT_2_EXERCISES.length, 9);
    const codes = UNIT_2_EXERCISES.map((e) => e.exercise_code);
    assert.deepStrictEqual(codes, ["A", "B", "C", "D", "E", "F", "G", "H", "I"]);
  });

  await t.test("Each exercise has non-empty items and valid answers", () => {
    UNIT_2_EXERCISES.forEach((ex) => {
      assert.ok(ex.id && ex.id.startsWith("u02_ex_"));
      assert.ok(ex.title && ex.title.length > 0);
      assert.ok(ex.instruction && ex.instruction.length > 0);
      assert.ok(Array.isArray(ex.items));
      assert.ok(ex.items.length > 0);

      ex.items.forEach((item) => {
        assert.ok(item.id != null);
        assert.ok(item.answer || (item.answers && item.answers.length > 0));
        assert.ok(item.explanation && item.explanation.length > 0);
      });
    });
  });
});

test("destinationB2Unit2 - Exercise Grading Evaluation", async (t) => {
  await t.test("Exercise A: Multiple choice evaluates 100% on book answers", () => {
    const exA = UNIT_2_EXERCISES.find((e) => e.exercise_code === "A");
    const perfectAnswers = {
      "1": "border",
      "2": "staying",
      "3": "reach",
      "4": "season",
      "5": "takes",
      "6": "trip",
      "7": "miss",
      "8": "view",
      "9": "bring",
      "10": "distance",
      "11": "book",
      "12": "home",
    };
    const res = gradeB2ExerciseSubmission(exA, perfectAnswers);
    assert.strictEqual(res.score, 100);
    assert.strictEqual(res.correct_items, 12);
    assert.strictEqual(res.total_items, 12);
  });

  await t.test("Exercise B: Binary choice evaluates accurately", () => {
    const exB = UNIT_2_EXERCISES.find((e) => e.exercise_code === "B");
    const perfectAnswers = {
      "1": "world",
      "2": "area",
      "3": "guide",
      "4": "fare",
      "5": "voyage",
      "6": "fee",
      "7": "sight",
    };
    const res = gradeB2ExerciseSubmission(exB, perfectAnswers);
    assert.strictEqual(res.score, 100);
    assert.strictEqual(res.correct_items, 7);
  });

  await t.test("Exercise C: Phrasal verbs box evaluates accurately", () => {
    const exC = UNIT_2_EXERCISES.find((e) => e.exercise_code === "C");
    const perfectAnswers = {
      "1": "see",
      "2": "make",
      "3": "check",
      "4": "pull",
      "5": "picks",
      "6": "gone",
      "7": "catch",
      "8": "get",
    };
    const res = gradeB2ExerciseSubmission(exC, perfectAnswers);
    assert.strictEqual(res.score, 100);
    assert.strictEqual(res.correct_items, 8);
  });

  await t.test("Exercise D: Phrasal verb replacement accepts alternative forms", () => {
    const exD = UNIT_2_EXERCISES.find((e) => e.exercise_code === "D");
    const answers1 = {
      "1": "set out",
      "2": "checked in",
      "3": "drop me off",
      "4": "turn round",
      "5": "takes off",
      "6": "run over",
      "7": "keep up with",
    };
    const res1 = gradeB2ExerciseSubmission(exD, answers1);
    assert.strictEqual(res1.score, 100);

    const answers2 = {
      "1": "set off", // valid alternative
      "2": "checked in",
      "3": "drop me off",
      "4": "turn around", // valid alternative
      "5": "takes off",
      "6": "run over",
      "7": "keep up with",
    };
    const res2 = gradeB2ExerciseSubmission(exD, answers2);
    assert.strictEqual(res2.score, 100);
  });

  await t.test("Exercise G: Extra word finder evaluates all 10 lines", () => {
    const exG = UNIT_2_EXERCISES.find((e) => e.exercise_code === "G");
    const answers = {
      "1": "be",
      "2": "it",
      "3": "in",
      "4": "being",
      "5": "to",
      "6": "so",
      "7": "it",
      "8": "been",
      "9": "of",
      "10": "to",
    };
    const res = gradeB2ExerciseSubmission(exG, answers);
    assert.strictEqual(res.score, 100);
    assert.strictEqual(res.correct_items, 10);
  });

  await t.test("Exercise H: Word formation passage evaluates all 6 gaps", () => {
    const exH = UNIT_2_EXERCISES.find((e) => e.exercise_code === "H");
    const answers = {
      "1": "tourist",
      "2": "arrangements",
      "3": "timetable",
      "4": "cultural",
      "5": "photographer",
      "6": "inhabitants",
    };
    const res = gradeB2ExerciseSubmission(exH, answers);
    assert.strictEqual(res.score, 100);
    assert.strictEqual(res.correct_items, 6);
  });

  await t.test("Exercise I: Word formation sentences evaluates with suffixes", () => {
    const exI = UNIT_2_EXERCISES.find((e) => e.exercise_code === "I");
    const answers = {
      "1": "unrecognisable",
      "2": "worldwide",
      "3": "different",
      "4": "broaden",
      "5": "direct",
      "6": "arrival",
      "7": "distance",
      "8": "entrance",
    };
    const res = gradeB2ExerciseSubmission(exI, answers);
    assert.strictEqual(res.score, 100);
    assert.strictEqual(res.correct_items, 8);
  });
});
