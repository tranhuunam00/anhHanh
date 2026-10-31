import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  IELTS_SKILL_DURATIONS,
  IELTS_SKILL_ORDER,
  formatCountdownTime,
  getSessionStorageKey,
  createDefaultSession,
  getExamSessionState,
  saveExamSessionState,
  activateSkillTimer,
  getSkillRemainingSeconds,
  completeAndLockSkill,
  isSkillCompletedAndLocked,
  resetExamSessionState
} from "../src/utils/ieltsExamTimer.js";

// Mock localStorage for node test runner
class MockStorage {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

globalThis.localStorage = new MockStorage();

describe("ieltsExamTimer - Constants & Key Generators", () => {
  it("Input & Output: verifies official skill durations", () => {
    assert.equal(IELTS_SKILL_DURATIONS.listening, 1800);
    assert.equal(IELTS_SKILL_DURATIONS.reading, 3600);
    assert.equal(IELTS_SKILL_DURATIONS.writing, 3600);
    assert.equal(IELTS_SKILL_DURATIONS.speaking, 840);
  });

  it("Input & Output: verifies key generator", () => {
    assert.equal(getSessionStorageKey("cam21_test2"), "ielts_exam_session_cam21_test2");
    assert.equal(getSessionStorageKey(""), "ielts_exam_session_");
  });
});

describe("ieltsExamTimer - formatCountdownTime", () => {
  it("Input Coverage & Output: handles happy path standard MM:SS", () => {
    assert.equal(formatCountdownTime(1800), "30:00");
    assert.equal(formatCountdownTime(65), "01:05");
    assert.equal(formatCountdownTime(9), "00:09");
  });

  it("Input Coverage: handles >= 3600 seconds with HH:MM:SS", () => {
    assert.equal(formatCountdownTime(3600), "01:00:00");
    assert.equal(formatCountdownTime(3665), "01:01:05");
  });

  it("Boundary & Error Handling: handles 0, negative, NaN, null, and non-numbers", () => {
    assert.equal(formatCountdownTime(0), "00:00");
    assert.equal(formatCountdownTime(-5), "00:00");
    assert.equal(formatCountdownTime(NaN), "00:00");
    assert.equal(formatCountdownTime(null), "00:00");
    assert.equal(formatCountdownTime(undefined), "00:00");
    assert.equal(formatCountdownTime("invalid"), "00:00");
  });
});

describe("ieltsExamTimer - Session State Management", () => {
  it("createDefaultSession creates valid structure with all 4 skills", () => {
    const s = createDefaultSession("test_1");
    assert.equal(s.testId, "test_1");
    assert.equal(s.isConfirmed, false);
    assert.equal(s.skills.listening.status, "not_started");
    assert.equal(s.skills.listening.remainingSeconds, 1800);
    assert.equal(s.skills.reading.remainingSeconds, 3600);
    assert.equal(s.skills.writing.remainingSeconds, 3600);
    assert.equal(s.skills.speaking.remainingSeconds, 840);
  });

  it("saveExamSessionState & getExamSessionState roundtrip", () => {
    localStorage.clear();
    const session = createDefaultSession("test_persist");
    session.isConfirmed = true;
    saveExamSessionState("test_persist", session);

    const loaded = getExamSessionState("test_persist");
    assert.equal(loaded.isConfirmed, true);
    assert.equal(loaded.testId, "test_persist");
  });

  it("getExamSessionState boundary fallback on empty or invalid json", () => {
    localStorage.clear();
    const fallback = getExamSessionState("non_existent");
    assert.equal(fallback.isConfirmed, false);
    assert.equal(fallback.skills.listening.status, "not_started");
  });

  it("resetExamSessionState clears and resets", () => {
    const session = createDefaultSession("test_reset");
    session.skills.listening.status = "completed";
    saveExamSessionState("test_reset", session);

    const reset = resetExamSessionState("test_reset");
    assert.equal(reset.skills.listening.status, "not_started");
    assert.equal(isSkillCompletedAndLocked(reset, "listening"), false);
  });
});

describe("ieltsExamTimer - activateSkillTimer & getSkillRemainingSeconds", () => {
  it("activateSkillTimer starts countdown and saves targetEndTime", () => {
    const session = createDefaultSession("test_timer");
    const activated = activateSkillTimer(session, "listening");

    assert.equal(activated.isConfirmed, true);
    assert.equal(activated.skills.listening.status, "in_progress");
    assert.ok(activated.skills.listening.targetEndTime > Date.now());

    const remaining = getSkillRemainingSeconds(activated, "listening");
    assert.ok(remaining > 1795 && remaining <= 1800);
  });

  it("activateSkillTimer does not overwrite if already completed", () => {
    const session = createDefaultSession("test_completed_lock");
    session.skills.listening.status = "completed";
    const result = activateSkillTimer(session, "listening");
    assert.equal(result.skills.listening.status, "completed");
  });

  it("getSkillRemainingSeconds returns 0 when completed", () => {
    const session = createDefaultSession("test_zero");
    session.skills.reading.status = "completed";
    assert.equal(getSkillRemainingSeconds(session, "reading"), 0);
  });
});

describe("ieltsExamTimer - completeAndLockSkill & isSkillCompletedAndLocked", () => {
  it("completeAndLockSkill locks skill and sets remaining to 0", () => {
    const session = createDefaultSession("test_lock");
    const locked = completeAndLockSkill(session, "listening", { rawScore: 35, bandScore: 8.0 });

    assert.equal(locked.skills.listening.status, "completed");
    assert.equal(locked.skills.listening.remainingSeconds, 0);
    assert.equal(locked.skills.listening.result.bandScore, 8.0);
    assert.equal(isSkillCompletedAndLocked(locked, "listening"), true);
  });

  it("isSkillCompletedAndLocked boundary cases", () => {
    assert.equal(isSkillCompletedAndLocked(null, "listening"), false);
    assert.equal(isSkillCompletedAndLocked({}, "listening"), false);
    assert.equal(isSkillCompletedAndLocked({ skills: {} }, "unknown"), false);
  });
});

