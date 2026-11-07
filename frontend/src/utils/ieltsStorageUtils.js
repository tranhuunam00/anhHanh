/**
 * IELTS Storage & User Authorization Utilities
 * Manages localStorage session persistence, AI grading authorization,
 * and audio time formatting.
 */

/**
 * Checks if user is authorized to use AI evaluation for Writing and Speaking
 * Strictly permitted: itdaogroup@gmail.com, tranhuunam23022000@gmail.com, vuthiquynhtrangbl6d@gmail.com (and variants)
 * @param {object|null|undefined} user 
 * @returns {boolean}
 */
export const canUseIeltsAiGrading = (user) => {
  if (!user) return false;
  if (user.can_use_ai_writing || user.can_use_ai_import || user.role === "ADMIN") {
    return true;
  }
  const email = (user.email || "").toLowerCase().trim();
  const handle = email.split("@")[0];

  const allowedEmails = [
    "itdaogroup@gmail.com",
    "tranhuunam23022000@gmail.com",
    "vuthiquynhtrangbl6d@gmail.com",
    "vuthiquynhtrang@gmail.com"
  ];
  const allowedHandles = [
    "itdaogroup",
    "tranhuunam23022000",
    "vuthiquynhtrang",
    "vuthiquynhtrangbl6d"
  ];

  return allowedEmails.includes(email) || allowedHandles.includes(handle);
};

/**
 * LocalStorage key generator for IELTS test submissions
 */
export const getIeltsStorageKey = (testId, skill) => `ielts_sub_${testId}_${skill}`;

export const saveIeltsSubmission = (testId, skill, data) => {
  try {
    if (typeof localStorage === "undefined") return;
    const key = getIeltsStorageKey(testId, skill);
    localStorage.setItem(key, JSON.stringify({ ...data, savedAt: new Date().toISOString() }));
  } catch (err) {
    console.warn("Failed to persist IELTS submission to localStorage:", err);
  }
};

export const getIeltsSubmission = (testId, skill) => {
  try {
    if (typeof localStorage === "undefined") return null;
    const key = getIeltsStorageKey(testId, skill);
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
};

/**
 * Clears saved IELTS submission for a specific skill or all skills
 * @param {string} testId
 * @param {string} [skill] - Optional. If omitted, clears all 4 skills.
 */
export const clearIeltsSubmission = (testId, skill) => {
  try {
    if (typeof localStorage === "undefined") return;
    if (skill) {
      localStorage.removeItem(getIeltsStorageKey(testId, skill));
    } else {
      ["listening", "reading", "writing", "speaking"].forEach((s) => {
        localStorage.removeItem(getIeltsStorageKey(testId, s));
      });
    }
  } catch (err) {
    console.warn("Failed to clear IELTS submission from localStorage:", err);
  }
};

/**
 * Formats seconds into MM:SS format safely handling edge cases (NaN, Infinity, negatives)
 * @param {number} secs
 * @returns {string}
 */
export const formatAudioTime = (secs) => {
  if (typeof secs !== "number" || isNaN(secs) || !isFinite(secs) || secs < 0) {
    return "00:00";
  }
  const total = Math.floor(secs);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
};

