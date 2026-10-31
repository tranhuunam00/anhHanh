/**
 * IELTS Scoring & Evaluation Utilities
 * Official Band Conversion (Listening & Academic Reading), Answer Normalization,
 * and AI Access Authorization.
 */

/**
 * Normalizes an answer string for robust IELTS grading
 * @param {string|number|null|undefined} ans 
 * @returns {string}
 */
export const normalizeIeltsAnswer = (ans) => {
  if (ans === null || ans === undefined) return "";
  let s = String(ans).trim().toLowerCase();
  
  // Replace curly apostrophes and quotes
  s = s.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
  
  // Strip trailing period or comma
  s = s.replace(/[.,;]+$/, "").trim();
  
  // Collapse whitespace
  s = s.replace(/\s+/g, " ");
  
  return s;
};

/**
 * Expands all combinations of optional parts marked with parentheses
 * E.g. "(the) 13(th) (of) January" -> generates combinations
 * @param {string} text 
 * @returns {string[]}
 */
export const expandOptionalParens = (text) => {
  if (!text) return [""];
  let variations = [text];
  
  // Find all paren blocks
  const parenRegex = /\(([^)]+)\)/;
  let match = parenRegex.exec(text);

  while (match) {
    const fullMatch = match[0];
    const innerText = match[1];
    const nextVars = [];
    for (const v of variations) {
      nextVars.push(v.replace(fullMatch, ""));
      nextVars.push(v.replace(fullMatch, innerText));
    }
    variations = nextVars;
    // Check if any pattern still has parentheses
    match = parenRegex.exec(variations[0]);
  }

  return [...new Set(variations.map(normalizeIeltsAnswer))];
};

/**
 * Checks if a user's answer matches any of the accepted answer patterns
 * @param {string} userAnswer 
 * @param {string|string[]} acceptedAnswers 
 * @returns {boolean}
 */
export const checkIeltsAnswer = (userAnswer, acceptedAnswers) => {
  const userClean = normalizeIeltsAnswer(userAnswer);
  if (!userClean) return false;

  const acceptedList = Array.isArray(acceptedAnswers) ? acceptedAnswers : [acceptedAnswers];

  for (const rawAccepted of acceptedList) {
    if (!rawAccepted) continue;
    
    // Split slash alternatives (e.g. "48 / forty-eight")
    const subOptions = rawAccepted.includes("/")
      ? rawAccepted.split("/").map((s) => s.trim())
      : [rawAccepted.trim()];

    for (const opt of subOptions) {
      const expanded = expandOptionalParens(opt);
      if (expanded.includes(userClean)) return true;

      // Currency stripping comparison (e.g., "£48" vs "48", "67.50" vs "67.5")
      const stripCurrency = (str) => str.replace(/^[£$€¥]\s*/, "");
      const cleanUserNoCur = stripCurrency(userClean);

      for (const exp of expanded) {
        if (cleanUserNoCur === stripCurrency(exp)) return true;
        const numUser = parseFloat(cleanUserNoCur);
        const numAccepted = parseFloat(stripCurrency(exp));
        if (!isNaN(numUser) && !isNaN(numAccepted) && numUser === numAccepted) {
          return true;
        }
      }
    }
  }

  return false;
};

/**
 * Converts Listening raw score (0-40) to IELTS Band Score (1.0 - 9.0)
 * @param {number} rawScore 
 * @returns {number}
 */
export const getListeningBandScore = (rawScore) => {
  const score = Math.max(0, Math.min(40, Math.round(Number(rawScore) || 0)));
  if (score >= 39) return 9.0;
  if (score >= 37) return 8.5;
  if (score >= 35) return 8.0;
  if (score >= 32) return 7.5;
  if (score >= 30) return 7.0;
  if (score >= 26) return 6.5;
  if (score >= 23) return 6.0;
  if (score >= 18) return 5.5;
  if (score >= 16) return 5.0;
  if (score >= 13) return 4.5;
  if (score >= 10) return 4.0;
  if (score >= 8) return 3.5;
  if (score >= 6) return 3.0;
  if (score >= 4) return 2.5;
  if (score >= 1) return 2.0;
  return 1.0;
};

/**
 * Converts Academic Reading raw score (0-40) to IELTS Band Score (1.0 - 9.0)
 * @param {number} rawScore 
 * @returns {number}
 */
export const getReadingBandScore = (rawScore) => {
  const score = Math.max(0, Math.min(40, Math.round(Number(rawScore) || 0)));
  if (score >= 39) return 9.0;
  if (score >= 37) return 8.5;
  if (score >= 35) return 8.0;
  if (score >= 33) return 7.5;
  if (score >= 30) return 7.0;
  if (score >= 27) return 6.5;
  if (score >= 23) return 6.0;
  if (score >= 19) return 5.5;
  if (score >= 15) return 5.0;
  if (score >= 13) return 4.5;
  if (score >= 10) return 4.0;
  if (score >= 8) return 3.5;
  if (score >= 6) return 3.0;
  if (score >= 4) return 2.5;
  if (score >= 1) return 2.0;
  return 1.0;
};

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
  
  return (
    handle === "tranhuunam23022000" ||
    handle === "vuthiquynhtrang" ||
    handle === "vuthiquynhtrangbl6d" ||
    email === "itdaogroup@gmail.com"
  );
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
