import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeB2Answer,
  expandEquivalentB2Answers,
  checkSingleB2Answer,
  gradeB2ExerciseSubmission,
  getB2StoredProgress,
  saveB2StoredProgress,
} from "../src/utils/destinationB2Grading.js";

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

test("destinationB2Grading - normalizeB2Answer", async (t) => {
  await t.test("Input Coverage: handles standard, null, undefined, and non-string inputs", () => {
    assert.strictEqual(normalizeB2Answer(null), "");
    assert.strictEqual(normalizeB2Answer(undefined), "");
    assert.strictEqual(normalizeB2Answer(123), "123");
    assert.strictEqual(normalizeB2Answer(""), "");
  });

  await t.test("Internal Logic: normalizes smart quotes and curly apostrophes", () => {
    assert.strictEqual(normalizeB2Answer("don’t"), "don't");
    assert.strictEqual(normalizeB2Answer("it‘s"), "it's");
    assert.strictEqual(normalizeB2Answer("we`re"), "we're");
  });

  await t.test("Internal Logic: collapses multiple spaces and strips trailing punctuation", () => {
    assert.strictEqual(normalizeB2Answer("   usually    goes .  "), "usually goes");
    assert.strictEqual(normalizeB2Answer("have you ever been?"), "have you ever been");
    assert.strictEqual(normalizeB2Answer("is taking!"), "is taking");
  });

  await t.test("Output Verification: returns lowercase trimmed clean string", () => {
    assert.strictEqual(normalizeB2Answer("  Do You Speak  "), "do you speak");
  });
});

test("destinationB2Grading - expandEquivalentB2Answers", async (t) => {
  await t.test("Input Coverage: handles null, empty string safely", () => {
    assert.deepStrictEqual(expandEquivalentB2Answers(null), []);
    assert.deepStrictEqual(expandEquivalentB2Answers(""), []);
  });

  await t.test("Internal Logic: expands short form contractions to long form", () => {
    const expanded = expandEquivalentB2Answers("haven't");
    assert.ok(expanded.includes("haven't"));
    assert.ok(expanded.includes("have not"));
  });

  await t.test("Internal Logic: expands long form contractions to short form", () => {
    const expanded = expandEquivalentB2Answers("I have ever eaten");
    assert.ok(expanded.includes("i have ever eaten"));
    assert.ok(expanded.includes("i've ever eaten"));
  });

  await t.test("Internal Logic: splits slash alternatives into individual options", () => {
    const expanded = expandEquivalentB2Answers("have already bought / 've already bought");
    assert.ok(expanded.includes("have already bought"));
    assert.ok(expanded.includes("'ve already bought"));
  });
});

test("destinationB2Grading - checkSingleB2Answer", async (t) => {
  const itemWithSingleAnswer = {
    id: 1,
    answer: "is talking",
    explanation: "Present continuous",
  };

  const itemWithMultipleAnswers = {
    id: 2,
    answers: ["I've ever eaten", "I have ever eaten", "'ve ever eaten"],
    answer: "I've ever eaten",
  };

  await t.test("Happy Path: evaluates exact and case-insensitive matches correctly", () => {
    const res1 = checkSingleB2Answer("is talking", itemWithSingleAnswer);
    assert.strictEqual(res1.isCorrect, true);

    const res2 = checkSingleB2Answer("IS TALKING", itemWithSingleAnswer);
    assert.strictEqual(res2.isCorrect, true);
  });

  await t.test("Contraction matching: accepts equivalent contraction forms", () => {
    const res = checkSingleB2Answer("I have ever eaten", itemWithMultipleAnswers);
    assert.strictEqual(res.isCorrect, true);

    const res2 = checkSingleB2Answer("i've ever eaten", itemWithMultipleAnswers);
    assert.strictEqual(res2.isCorrect, true);
  });

  await t.test("Boundary & Bad cases: handles empty, whitespace, and wrong answers", () => {
    const emptyRes = checkSingleB2Answer("", itemWithSingleAnswer);
    assert.strictEqual(emptyRes.isCorrect, false);

    const wrongRes = checkSingleB2Answer("talks", itemWithSingleAnswer);
    assert.strictEqual(wrongRes.isCorrect, false);
    assert.strictEqual(wrongRes.standardAnswer, "is talking");
  });

  await t.test("Edge case: handles targetItem with no answer safely", () => {
    const noAnswerItem = { id: 99 };
    const res = checkSingleB2Answer("something", noAnswerItem);
    assert.strictEqual(res.isCorrect, false);
  });
});

test("destinationB2Grading - gradeB2ExerciseSubmission", async (t) => {
  const mockExercise = {
    id: "test_ex_1",
    exercise_code: "A",
    items: [
      { id: 1, answer: "goes", explanation: "habit" },
      { id: 2, answer: "is talking", explanation: "now" },
      { id: 3, answer: "aren't eating", explanation: "temporary" },
      { id: 4, answer: "is air travel getting", explanation: "trend" },
    ],
  };

  await t.test("Happy Path: perfect score returns 100% and marks all correct", () => {
    const answers = {
      "1": "goes",
      "2": "is talking",
      "3": "are not eating", // contraction equivalent
      "4": "is air travel getting",
    };
    const result = gradeB2ExerciseSubmission(mockExercise, answers);
    assert.strictEqual(result.score, 100);
    assert.strictEqual(result.total_items, 4);
    assert.strictEqual(result.correct_items, 4);
    assert.strictEqual(result.results.length, 4);
    assert.ok(result.results.every((r) => r.is_correct));
  });

  await t.test("Partial score: calculates correct ratio accurately", () => {
    const answers = {
      "1": "goes", // correct
      "2": "talks", // incorrect
      "3": "", // unattempted
      "4": "is air travel getting", // correct
    };
    const result = gradeB2ExerciseSubmission(mockExercise, answers);
    assert.strictEqual(result.score, 50);
    assert.strictEqual(result.correct_items, 2);
    assert.strictEqual(result.total_items, 4);
  });

  await t.test("Boundary & Bad cases: handles empty exercise or empty items safely", () => {
    const emptyResult = gradeB2ExerciseSubmission({ id: "empty", items: [] }, {});
    assert.strictEqual(emptyResult.score, 0);
    assert.strictEqual(emptyResult.total_items, 0);
  });
});

test("destinationB2Grading - getB2StoredProgress & saveB2StoredProgress", async (t) => {
  localStorage.clear();

  await t.test("Output Verification: returns empty object or null when storage is empty", () => {
    assert.deepStrictEqual(getB2StoredProgress(), {});
    assert.strictEqual(getB2StoredProgress("non_existent"), null);
  });

  await t.test("Roundtrip persistence: saves and retrieves progress data", () => {
    const mockData = { score: 90, total_items: 10, correct_items: 9 };
    saveB2StoredProgress("u01_ex_a", mockData);

    const retrieved = getB2StoredProgress("u01_ex_a");
    assert.deepStrictEqual(retrieved, mockData);

    const all = getB2StoredProgress();
    assert.ok(all.u01_ex_a);
  });

  await t.test("Deletion: passing null removes the progress for an exercise", () => {
    saveB2StoredProgress("u01_ex_a", null);
    assert.strictEqual(getB2StoredProgress("u01_ex_a"), null);
  });
});
