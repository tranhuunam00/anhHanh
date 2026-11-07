/**
 * IELTS Scoring & Evaluation Utilities
 * Official Band Conversion (Listening & Academic Reading), Answer Normalization,
 * Official Overall & Writing Band Computation, and AI Access Authorization.
 */

import {
  cleanTextSymbols,
  getHyphenVariations,
  getSpellingVariations,
  getNumberVariations
} from "./ieltsSpellingUtils.js";

import {
  roundToIeltsBand,
  getListeningBandScore,
  getReadingBandScore,
  calculateWritingBandScore,
  calculateOverallIeltsBand
} from "./ieltsBandConversion.js";

import {
  canUseIeltsAiGrading,
  getIeltsStorageKey,
  saveIeltsSubmission,
  getIeltsSubmission,
  clearIeltsSubmission,
  formatAudioTime
} from "./ieltsStorageUtils.js";

// Re-export band conversion and storage utilities for seamless backward compatibility
export {
  roundToIeltsBand,
  getListeningBandScore,
  getReadingBandScore,
  calculateWritingBandScore,
  calculateOverallIeltsBand,
  canUseIeltsAiGrading,
  getIeltsStorageKey,
  saveIeltsSubmission,
  getIeltsSubmission,
  clearIeltsSubmission,
  formatAudioTime
};

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
    match = parenRegex.exec(variations[0]);
  }

  return [...new Set(variations.map(normalizeIeltsAnswer))];
};

/**
 * Checks if a user's answer matches any of the accepted answer patterns
 * Handles US/UK spelling variants, hyphens/spaces, numeric symbols, and official abbreviations.
 *
 * @param {string} userAnswer 
 * @param {string|string[]} acceptedAnswers 
 * @returns {boolean}
 */
export const checkIeltsAnswer = (userAnswer, acceptedAnswers) => {
  const userClean = normalizeIeltsAnswer(userAnswer);
  if (!userClean) return false;

  const acceptedList = Array.isArray(acceptedAnswers) ? acceptedAnswers : [acceptedAnswers];

  // Candidates for user answer
  const userCandidates = new Set([userClean]);
  const userCleanSym = cleanTextSymbols(userClean);
  userCandidates.add(userCleanSym);
  getHyphenVariations(userClean).forEach((v) => userCandidates.add(v));
  getSpellingVariations(userClean).forEach((v) => userCandidates.add(v));
  getNumberVariations(userClean).forEach((v) => userCandidates.add(v));

  // Safe handling of standard IELTS abbreviations (T/F/NG and Y/N)
  const tfMap = { t: "true", f: "false", ng: "not given", notgiven: "not given", y: "yes", n: "no" };
  const userAbbr = tfMap[userClean];
  if (userAbbr) userCandidates.add(userAbbr);

  for (const rawAccepted of acceptedList) {
    if (!rawAccepted) continue;
    
    // Split slash alternatives (e.g. "48 / forty-eight")
    const subOptions = rawAccepted.includes("/")
      ? rawAccepted.split("/").map((s) => s.trim())
      : [rawAccepted.trim()];

    for (const opt of subOptions) {
      const expanded = expandOptionalParens(opt);
      const fullExpanded = new Set();
      for (const exp of expanded) {
        fullExpanded.add(exp);
        fullExpanded.add(cleanTextSymbols(exp));
        getHyphenVariations(exp).forEach((v) => fullExpanded.add(v));
        getSpellingVariations(exp).forEach((v) => fullExpanded.add(v));
        getNumberVariations(exp).forEach((v) => fullExpanded.add(v));
      }

      for (const u of userCandidates) {
        if (fullExpanded.has(u)) return true;
      }

      // Currency stripping comparison (e.g., "£48" vs "48", "67.50" vs "67.5")
      const stripCurrency = (str) => str.replace(/^[£$€¥]\s*/, "");
      const cleanUserNoCur = stripCurrency(userClean);

      for (const exp of expanded) {
        if (cleanUserNoCur === stripCurrency(exp)) return true;
        const numUser = parseFloat(cleanUserNoCur.replace(/,/g, ""));
        const numAccepted = parseFloat(stripCurrency(exp).replace(/,/g, ""));
        if (!isNaN(numUser) && !isNaN(numAccepted) && numUser === numAccepted) {
          return true;
        }
      }
    }
  }

  return false;
};

/**
 * Evaluates Listening answers against test data with duplicate prevention on paired selections
 * @param {object} listeningData 
 * @param {object} answers { [qNum]: userVal }
 * @returns {{ correctCount: number, bandScore: number, evalMap: object }}
 */
export const gradeListeningTest = (listeningData, answers = {}) => {
  if (!listeningData || !listeningData.parts) {
    return { correctCount: 0, bandScore: 1.0, evalMap: {} };
  }
  const evalMap = {};
  let correctCount = 0;

  const checkItem = (qNum, acceptedAnswers) => {
    if (!qNum || evalMap[qNum]) return;
    const userAns = answers[qNum] || "";
    const isCorrect = checkIeltsAnswer(userAns, acceptedAnswers);
    if (isCorrect) correctCount++;
    evalMap[qNum] = {
      isCorrect,
      userAns,
      accepted: Array.isArray(acceptedAnswers) ? acceptedAnswers : [acceptedAnswers]
    };
  };

  const evaluatePair = (q1, q2, acceptedList) => {
    if (evalMap[q1] && evalMap[q2]) return;
    const accepted = (acceptedList || []).map((a) => String(a).trim().toUpperCase());
    const u1 = String(answers[q1] || "").trim().toUpperCase();
    const u2 = String(answers[q2] || "").trim().toUpperCase();

    const correct1 = Boolean(u1 && accepted.includes(u1));
    const correct2 = Boolean(u2 && accepted.includes(u2) && u2 !== u1);

    if (correct1) correctCount++;
    if (correct2) correctCount++;
    evalMap[q1] = { isCorrect: correct1, userAns: answers[q1] || "", accepted };
    evalMap[q2] = { isCorrect: correct2, userAns: answers[q2] || "", accepted };
  };

  listeningData.parts.forEach((part) => {
    part?.items?.forEach((it) => {
      if (it?.pairNumber) {
        evaluatePair(it.number, it.pairNumber, it.answers || it.acceptedAnswers || [it.answer]);
      } else {
        checkItem(it.number, it.answers || [it.answer]);
      }
    });

    part?.sections?.forEach((sec) => {
      sec?.items?.forEach((it) => {
        if (it?.pairNumber) {
          evaluatePair(it.number, it.pairNumber, it.answers || it.acceptedAnswers || [it.answer]);
        } else if (it?.number) {
          checkItem(it.number, it.answers || [it.answer]);
        }
      });
    });

    part?.groups?.forEach((g) => {
      if (g.groupType === "choose_two" && Array.isArray(g.numbers) && g.numbers.length >= 2) {
        const pairAnswers = g.answers || g.items?.[0]?.answers || g.items?.[0]?.acceptedAnswers || [];
        evaluatePair(g.numbers[0], g.numbers[1], pairAnswers);
      } else if (g.groupType === "choose_three" && Array.isArray(g.numbers) && g.numbers.length >= 3) {
        const [q1, q2, q3] = g.numbers;
        const rawAnswers = g.answers || g.items?.[0]?.answers || g.items?.[0]?.acceptedAnswers || [];
        const accepted = rawAnswers.map((a) => String(a).trim().toUpperCase());
        const u1 = String(answers[q1] || "").trim().toUpperCase();
        const u2 = String(answers[q2] || "").trim().toUpperCase();
        const u3 = String(answers[q3] || "").trim().toUpperCase();
        const used = new Set();

        [ { q: q1, u: u1 }, { q: q2, u: u2 }, { q: q3, u: u3 } ].forEach(({ q, u }) => {
          const isCorrect = Boolean(u && accepted.includes(u) && !used.has(u));
          if (isCorrect) {
            used.add(u);
            correctCount++;
          }
          evalMap[q] = { isCorrect, userAns: answers[q] || "", accepted };
        });
      } else if (g.groupType === "map_labeling" || g.groupType === "flowchart_completion" || g.groupType === "flow_chart") {
        (g.steps || g.items || []).forEach((it) => checkItem(it.number, it.answers || [it.answer]));
      } else if (g.steps) {
        g.steps.forEach((it) => checkItem(it.number, it.answers || [it.answer]));
      } else if (g.sections) {
        g.sections.forEach((sec) => {
          sec?.items?.forEach((it) => {
            if (it?.number) checkItem(it.number, it.answers || [it.answer]);
          });
        });
      } else if (g.items) {
        g.items.forEach((it) => checkItem(it.number, it.answers || [it.answer]));
      }
    });
  });

  const bandScore = getListeningBandScore(correctCount);
  return { correctCount, bandScore, evalMap };
};

/**
 * Evaluates Academic Reading answers against test data with duplicate prevention on paired selections
 * @param {object} readingData 
 * @param {object} answers { [qNum]: userVal }
 * @returns {{ correctCount: number, bandScore: number, evalMap: object }}
 */
export const gradeReadingTest = (readingData, answers = {}) => {
  if (!readingData || !readingData.passages) {
    return { correctCount: 0, bandScore: 1.0, evalMap: {} };
  }
  const evalMap = {};
  let correctCount = 0;

  const checkItem = (qNum, acceptedAnswers) => {
    if (!qNum || evalMap[qNum]) return;
    const userAns = answers[qNum] || "";
    const isCorrect = checkIeltsAnswer(userAns, acceptedAnswers);
    if (isCorrect) correctCount++;
    evalMap[qNum] = {
      isCorrect,
      userAns,
      accepted: Array.isArray(acceptedAnswers) ? acceptedAnswers : [acceptedAnswers]
    };
  };

  const evaluatePair = (q1, q2, acceptedList) => {
    if (evalMap[q1] && evalMap[q2]) return;
    const accepted = (acceptedList || []).map((a) => String(a).trim().toUpperCase());
    const u1 = String(answers[q1] || "").trim().toUpperCase();
    const u2 = String(answers[q2] || "").trim().toUpperCase();

    const correct1 = Boolean(u1 && accepted.includes(u1));
    const correct2 = Boolean(u2 && accepted.includes(u2) && u2 !== u1);

    if (correct1) correctCount++;
    if (correct2) correctCount++;
    evalMap[q1] = { isCorrect: correct1, userAns: answers[q1] || "", accepted };
    evalMap[q2] = { isCorrect: correct2, userAns: answers[q2] || "", accepted };
  };

  readingData.passages.forEach((p) => {
    p?.items?.forEach((it) => {
      if (it?.pairNumber) {
        evaluatePair(it.number, it.pairNumber, it.answers || it.acceptedAnswers || [it.answer]);
      } else {
        checkItem(it.number, it.answers || [it.answer]);
      }
    });

    p?.sections?.forEach((sec) => {
      sec?.items?.forEach((it) => {
        if (it?.pairNumber) {
          evaluatePair(it.number, it.pairNumber, it.answers || it.acceptedAnswers || [it.answer]);
        } else if (it?.number) {
          checkItem(it.number, it.answers || [it.answer]);
        }
      });
    });

    p?.groups?.forEach((g) => {
      if (g.groupType === "choose_two" && Array.isArray(g.numbers) && g.numbers.length >= 2) {
        const pairAnswers = g.answers || g.items?.[0]?.answers || g.items?.[0]?.acceptedAnswers || [];
        evaluatePair(g.numbers[0], g.numbers[1], pairAnswers);
      } else if (g.groupType === "choose_three" && Array.isArray(g.numbers) && g.numbers.length >= 3) {
        const [q1, q2, q3] = g.numbers;
        const rawAnswers = g.answers || g.items?.[0]?.answers || g.items?.[0]?.acceptedAnswers || [];
        const accepted = rawAnswers.map((a) => String(a).trim().toUpperCase());
        const u1 = String(answers[q1] || "").trim().toUpperCase();
        const u2 = String(answers[q2] || "").trim().toUpperCase();
        const u3 = String(answers[q3] || "").trim().toUpperCase();
        const used = new Set();

        [ { q: q1, u: u1 }, { q: q2, u: u2 }, { q: q3, u: u3 } ].forEach(({ q, u }) => {
          const isCorrect = Boolean(u && accepted.includes(u) && !used.has(u));
          if (isCorrect) {
            used.add(u);
            correctCount++;
          }
          evalMap[q] = { isCorrect, userAns: answers[q] || "", accepted };
        });
      } else if (g.groupType === "table_completion") {
        (g.tableItems || g.items || []).forEach((it) => {
          if (it?.number) checkItem(it.number, it.answers || [it.answer]);
        });
        g.rows?.forEach((row) => {
          if (row.subjectQuestion) checkItem(row.subjectQuestion, row.answers || [row.answer]);
          if (row.questionNumber) checkItem(row.questionNumber, row.answers || [row.answer]);
          if (row.number) checkItem(row.number, row.answers || [row.answer]);
          row.questions?.forEach((q) => {
            if (q.number) checkItem(q.number, q.answers || [q.answer]);
          });
        });
      } else if (g.steps) {
        g.steps.forEach((it) => checkItem(it.number, it.answers || [it.answer]));
      } else if (g.sections) {
        g.sections.forEach((sec) => {
          sec?.items?.forEach((it) => {
            if (it?.number) checkItem(it.number, it.answers || [it.answer]);
          });
        });
      } else if (g.items) {
        g.items.forEach((it) => checkItem(it.number, it.answers || [it.answer]));
      }
    });
  });

  const bandScore = getReadingBandScore(correctCount);
  return { correctCount, bandScore, evalMap };
};
