import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { EXERCISE_FORMATS } from "../src/utils/vocabExerciseGenerators.js";

describe("vocabExerciseMobileAndAI - EXERCISE_FORMATS D5 and D6", () => {
  test("defines FORMAT_D5_FLIP for mobile/walking mode", () => {
    assert.equal(EXERCISE_FORMATS.D5_FLIP, "FORMAT_D5_FLIP");
  });

  test("defines FORMAT_D6_AI_STORY for AI narrative storytelling", () => {
    assert.equal(EXERCISE_FORMATS.D6_AI_STORY, "FORMAT_D6_AI_STORY");
  });
});

describe("vocabExerciseMobileAndAI - Authorization Logic Check", () => {
  const isAuthorizedCheck = (user) => {
    if (!user) return false;
    if (user.can_use_ai_import || user.can_use_ai_writing) return true;
    const em = (user.email || "").toLowerCase();
    const handle = em.split("@")[0];
    return (
      handle === "tranhuunam23022000" ||
      handle === "vuthiquynhtrang" ||
      handle === "vuthiquynhtrangbl6d"
    );
  };

  test("authorizes designated admin handles (happy path)", () => {
    assert.equal(isAuthorizedCheck({ email: "tranhuunam23022000@gmail.com" }), true);
    assert.equal(isAuthorizedCheck({ email: "vuthiquynhtrang@gmail.com" }), true);
    assert.equal(isAuthorizedCheck({ email: "vuthiquynhtrangbl6d@gmail.com" }), true);
    assert.equal(isAuthorizedCheck({ email: "TRANHUUNAM23022000@GMAIL.COM" }), true);
  });

  test("authorizes user with can_use_ai_import or can_use_ai_writing flags", () => {
    assert.equal(isAuthorizedCheck({ email: "other@gmail.com", can_use_ai_import: true }), true);
    assert.equal(isAuthorizedCheck({ email: "other@gmail.com", can_use_ai_writing: true }), true);
  });

  test("rejects unauthorized users, guest users, and empty objects", () => {
    assert.equal(isAuthorizedCheck(null), false);
    assert.equal(isAuthorizedCheck(undefined), false);
    assert.equal(isAuthorizedCheck({}), false);
    assert.equal(isAuthorizedCheck({ email: "random_student@gmail.com" }), false);
    assert.equal(isAuthorizedCheck({ email: "hacker_tranhuunam23022000@gmail.com" }), false);
  });
});
