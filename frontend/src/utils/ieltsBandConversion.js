/**
 * IELTS Band Score Conversion & Calculation Utilities
 * Official tables for Academic Listening and Reading (0-40 to Band 1.0-9.0),
 * official IELTS rounding rules, and multi-skill composite band computations.
 */

/**
 * Official Cambridge IELTS Band Rounding Rule:
 * Calculates overall band score from raw average:
 * - If average fractional part is < 0.25, round down to whole band (e.g. 6.125 -> 6.0).
 * - If average fractional part is >= 0.25 and < 0.75, round to half band (e.g. 6.25 -> 6.5, 6.375 -> 6.5, 6.625 -> 6.5).
 * - If average fractional part is >= 0.75, round up to next whole band (e.g. 6.75 -> 7.0, 6.875 -> 7.0).
 * Clamped between 1.0 and 9.0.
 *
 * @param {number} score
 * @returns {number}
 */
export const roundToIeltsBand = (score) => {
  if (typeof score !== "number" || isNaN(score) || score <= 0) return 1.0;
  // Eliminate floating point epsilon inaccuracies (e.g. 6.249999999999999)
  const cleanScore = Math.round(score * 1000) / 1000;
  const whole = Math.floor(cleanScore);
  const frac = cleanScore - whole;

  let band;
  if (frac < 0.25) {
    band = whole;
  } else if (frac < 0.75) {
    band = whole + 0.5;
  } else {
    band = whole + 1.0;
  }
  return Math.min(9.0, Math.max(1.0, band));
};

/**
 * Converts Listening raw score (0-40) to IELTS Band Score (1.0 - 9.0)
 * Official Cambridge IELTS Academic / General Listening Table
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
 * Official Cambridge IELTS Academic Reading Table
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
 * Calculates official IELTS Writing composite band score:
 * Task 1 is weighted 1/3 (33.3%), Task 2 is weighted 2/3 (66.7%).
 *
 * @param {number|string} task1Score
 * @param {number|string} task2Score
 * @returns {number}
 */
export const calculateWritingBandScore = (task1Score, task2Score) => {
  const t1 = parseFloat(task1Score);
  const t2 = parseFloat(task2Score);
  const hasT1 = !isNaN(t1) && t1 > 0;
  const hasT2 = !isNaN(t2) && t2 > 0;

  if (hasT1 && hasT2) {
    return roundToIeltsBand((t1 * 1 + t2 * 2) / 3);
  }
  if (hasT2) return roundToIeltsBand(t2);
  if (hasT1) return roundToIeltsBand(t1);
  return 1.0;
};

/**
 * Calculates official IELTS Overall Band Score across all 4 skills or available completed skills.
 *
 * @param {object|number[]} skillScores Object with { listening, reading, writing, speaking } or array of numbers
 * @returns {number}
 */
export const calculateOverallIeltsBand = (skillScores) => {
  if (!skillScores) return 1.0;
  let scores = [];
  if (Array.isArray(skillScores)) {
    scores = skillScores;
  } else if (typeof skillScores === "object") {
    scores = [
      skillScores.listening,
      skillScores.reading,
      skillScores.writing,
      skillScores.speaking
    ];
  }
  const valid = scores
    .map((s) => parseFloat(s))
    .filter((s) => !isNaN(s) && s > 0);

  if (valid.length === 0) return 1.0;
  const avg = valid.reduce((a, b) => a + b, 0) / valid.length;
  return roundToIeltsBand(avg);
};

