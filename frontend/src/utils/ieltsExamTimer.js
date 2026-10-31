/**
 * IELTS Exam Timer & Session Persistence Utilities
 * Manages official computer-delivered IELTS countdown timers,
 * skill auto-submission on timeout, and locking completed skills.
 */

// Official IELTS Skill Durations in Seconds
export const IELTS_SKILL_DURATIONS = {
  listening: 30 * 60, // 30 minutes = 1800s
  reading: 60 * 60,   // 60 minutes = 3600s
  writing: 60 * 60,   // 60 minutes = 3600s
  speaking: 14 * 60   // 14 minutes = 840s
};

export const IELTS_SKILL_ORDER = ["listening", "reading", "writing", "speaking"];

/**
 * Formats countdown seconds into MM:SS or HH:MM:SS string
 * @param {number} secs 
 * @returns {string}
 */
export const formatCountdownTime = (secs) => {
  if (typeof secs !== "number" || isNaN(secs) || !isFinite(secs) || secs <= 0) {
    return "00:00";
  }
  const total = Math.floor(secs);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;

  if (h > 0) {
    return `${h < 10 ? "0" : ""}${h}:${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  }
  return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
};

/**
 * LocalStorage key for an exam session
 */
export const getSessionStorageKey = (testId) => `ielts_exam_session_${testId}`;

/**
 * Creates a default blank exam session
 */
export const createDefaultSession = (testId) => ({
  testId,
  isConfirmed: false,
  confirmedAt: null,
  skills: {
    listening: {
      status: "not_started",
      duration: IELTS_SKILL_DURATIONS.listening,
      remainingSeconds: IELTS_SKILL_DURATIONS.listening,
      targetEndTime: null,
      completedAt: null,
      result: null
    },
    reading: {
      status: "not_started",
      duration: IELTS_SKILL_DURATIONS.reading,
      remainingSeconds: IELTS_SKILL_DURATIONS.reading,
      targetEndTime: null,
      completedAt: null,
      result: null
    },
    writing: {
      status: "not_started",
      duration: IELTS_SKILL_DURATIONS.writing,
      remainingSeconds: IELTS_SKILL_DURATIONS.writing,
      targetEndTime: null,
      completedAt: null,
      result: null
    },
    speaking: {
      status: "not_started",
      duration: IELTS_SKILL_DURATIONS.speaking,
      remainingSeconds: IELTS_SKILL_DURATIONS.speaking,
      targetEndTime: null,
      completedAt: null,
      result: null
    }
  }
});

/**
 * Loads exam session from localStorage
 */
export const getExamSessionState = (testId) => {
  try {
    if (typeof localStorage === "undefined" || !testId) {
      return createDefaultSession(testId);
    }
    const item = localStorage.getItem(getSessionStorageKey(testId));
    if (!item) return createDefaultSession(testId);
    const parsed = JSON.parse(item);
    return { ...createDefaultSession(testId), ...parsed };
  } catch (err) {
    console.warn("Failed to load exam session state:", err);
    return createDefaultSession(testId);
  }
};

/**
 * Saves exam session to localStorage
 */
export const saveExamSessionState = (testId, state) => {
  try {
    if (typeof localStorage === "undefined" || !testId || !state) return;
    localStorage.setItem(getSessionStorageKey(testId), JSON.stringify(state));
  } catch (err) {
    console.warn("Failed to persist exam session state:", err);
  }
};

/**
 * Starts countdown for a specific skill (if not already started or completed)
 */
export const activateSkillTimer = (session, skill) => {
  if (!session || !session.skills || !session.skills[skill]) return session;
  const sk = session.skills[skill];

  if (sk.status === "completed") return session;

  const now = Date.now();
  let targetEndTime = sk.targetEndTime;

  if (!targetEndTime || sk.status === "not_started") {
    targetEndTime = now + (sk.remainingSeconds || IELTS_SKILL_DURATIONS[skill]) * 1000;
  }

  const updatedSkills = {
    ...session.skills,
    [skill]: {
      ...sk,
      status: "in_progress",
      targetEndTime
    }
  };

  const nextSession = {
    ...session,
    isConfirmed: true,
    confirmedAt: session.confirmedAt || new Date().toISOString(),
    skills: updatedSkills
  };

  saveExamSessionState(session.testId, nextSession);
  return nextSession;
};

/**
 * Computes remaining seconds using wall-clock time vs targetEndTime
 */
export const getSkillRemainingSeconds = (session, skill) => {
  if (!session || !session.skills || !session.skills[skill]) {
    return IELTS_SKILL_DURATIONS[skill] || 0;
  }
  const sk = session.skills[skill];
  if (sk.status === "completed") return 0;
  if (sk.status === "not_started") return sk.remainingSeconds || IELTS_SKILL_DURATIONS[skill];

  if (!sk.targetEndTime) return sk.remainingSeconds || 0;

  const diffMs = sk.targetEndTime - Date.now();
  return Math.max(0, Math.ceil(diffMs / 1000));
};

/**
 * Marks a skill as completed and locked
 */
export const completeAndLockSkill = (session, skill, resultData = null) => {
  if (!session || !session.skills || !session.skills[skill]) return session;

  const updatedSkills = {
    ...session.skills,
    [skill]: {
      ...session.skills[skill],
      status: "completed",
      remainingSeconds: 0,
      targetEndTime: null,
      completedAt: new Date().toISOString(),
      result: resultData
    }
  };

  const nextSession = {
    ...session,
    skills: updatedSkills
  };

  saveExamSessionState(session.testId, nextSession);
  return nextSession;
};

/**
 * Checks if a skill is completed and locked
 */
export const isSkillCompletedAndLocked = (session, skill) => {
  if (!session || !session.skills || !session.skills[skill]) return false;
  return session.skills[skill].status === "completed";
};

/**
 * Resets exam session completely for a test
 */
export const resetExamSessionState = (testId) => {
  const fresh = createDefaultSession(testId);
  saveExamSessionState(testId, fresh);
  return fresh;
};

