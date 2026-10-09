/**
 * Client-Side Destination B2 Grading & Progress Storage.
 * Enables 100% offline-ready, instant grading without any backend requirement.
 * Rule 4: File strictly under 500 lines.
 */

export const normalizeB2Answer = (text) => {
  if (text == null) return "";
  let s = String(text).trim().toLowerCase();
  s = s.replace(/[’’‘`]/g, "'");
  s = s.replace(/\s+/g, " ");
  s = s.replace(/[.,!?;:]+$/, "");
  return s.trim();
};

const CONTRACTION_PAIRS = [
  ["don't", "do not"],
  ["doesn't", "does not"],
  ["didn't", "did not"],
  ["isn't", "is not"],
  ["aren't", "are not"],
  ["wasn't", "was not"],
  ["weren't", "were not"],
  ["haven't", "have not"],
  ["hasn't", "has not"],
  ["hadn't", "had not"],
  ["won't", "will not"],
  ["wouldn't", "would not"],
  ["can't", "cannot"],
  ["couldn't", "could not"],
  ["i'm", "i am"],
  ["you're", "you are"],
  ["he's", "he is"],
  ["she's", "she is"],
  ["it's", "it is"],
  ["we're", "we are"],
  ["they're", "they are"],
  ["i've", "i have"],
  ["you've", "you have"],
  ["we've", "we have"],
  ["they've", "they have"],
  ["i'll", "i will"],
  ["you'll", "you will"],
  ["he'll", "he will"],
  ["she'll", "she will"],
  ["they'll", "they will"],
  ["i'd", "i would"],
  ["you'd", "you would"],
  ["he'd", "he would"],
  ["she'd", "she would"],
  ["they'd", "they would"],
];

export const expandEquivalentB2Answers = (answer) => {
  const norm = normalizeB2Answer(answer);
  if (!norm) return [];

  const set = new Set([norm]);

  CONTRACTION_PAIRS.forEach(([shortForm, longForm]) => {
    if (norm.includes(shortForm)) {
      set.add(norm.replace(shortForm, longForm));
    }
    if (norm.includes(longForm)) {
      set.add(norm.replace(longForm, shortForm));
    }
  });

  if (norm.includes("/")) {
    norm.split("/").forEach((part) => {
      const p = normalizeB2Answer(part);
      if (p) set.add(p);
    });
  }

  return Array.from(set);
};

export const checkSingleB2Answer = (userAnswer, targetItem) => {
  const userNorm = normalizeB2Answer(userAnswer);
  if (!userNorm) {
    return {
      isCorrect: false,
      standardAnswer: targetItem.answer || (targetItem.answers && targetItem.answers[0]) || "",
    };
  }

  const validAnswers = [];
  if (targetItem.answer != null) {
    if (Array.isArray(targetItem.answer)) validAnswers.push(...targetItem.answer);
    else validAnswers.push(String(targetItem.answer));
  }
  if (targetItem.answers != null) {
    if (Array.isArray(targetItem.answers)) validAnswers.push(...targetItem.answers);
    else validAnswers.push(String(targetItem.answers));
  }

  if (validAnswers.length === 0) {
    return { isCorrect: false, standardAnswer: "" };
  }

  const standardAnswer = String(validAnswers[0]);
  const acceptable = new Set();

  validAnswers.forEach((ans) => {
    expandEquivalentB2Answers(ans).forEach((v) => acceptable.add(v));
  });

  const isCorrect = acceptable.has(userNorm);
  return { isCorrect, standardAnswer };
};

export const gradeB2ExerciseSubmission = (exercise, userAnswers = {}) => {
  const items = exercise.items || [];
  if (items.length === 0) {
    return {
      exercise_id: exercise?.id,
      exerciseId: exercise?.id,
      exercise_code: exercise?.exercise_code,
      exerciseCode: exercise?.exercise_code,
      score: 0.0,
      total_items: 0,
      totalItems: 0,
      correct_items: 0,
      correctItems: 0,
      results: [],
    };
  }

  let correctCount = 0;
  const results = items.map((item, index) => {
    const itemKey = String(item.id || item.gap_number || item.line || index + 1);
    const uAns = userAnswers[itemKey] || userAnswers[String(index + 1)] || userAnswers[index + 1] || "";
    const { isCorrect, standardAnswer } = checkSingleB2Answer(uAns, item);

    if (isCorrect) correctCount += 1;

    return {
      item_key: itemKey,
      itemKey,
      item_number: index + 1,
      itemNumber: index + 1,
      user_answer: uAns,
      userAnswer: uAns,
      correct_answer: standardAnswer,
      correctAnswer: standardAnswer,
      is_correct: isCorrect,
      isCorrect,
      explanation: item.explanation || "",
    };
  });

  const score = Math.round((correctCount / items.length) * 1000) / 10;

  const evaluationResult = {
    exercise_id: exercise.id,
    exerciseId: exercise.id,
    exercise_code: exercise.exercise_code,
    exerciseCode: exercise.exercise_code,
    score,
    total_items: items.length,
    totalItems: items.length,
    correct_items: correctCount,
    correctItems: correctCount,
    results,
    userAnswers,
    completedAt: new Date().toISOString(),
  };

  saveB2StoredProgress(exercise.id, evaluationResult);

  return evaluationResult;
};

const STORAGE_KEY = "shotlang_destination_b2_progress";

export const getB2StoredProgress = (exerciseId) => {
  if (typeof localStorage === "undefined") return exerciseId ? null : {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all = raw ? JSON.parse(raw) : {};
    return exerciseId ? (all[exerciseId] || null) : all;
  } catch (e) {
    return exerciseId ? null : {};
  }
};

export const saveB2StoredProgress = (exerciseId, progressData) => {
  if (typeof localStorage === "undefined" || !exerciseId) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all = raw ? JSON.parse(raw) : {};
    if (progressData === null) {
      delete all[exerciseId];
    } else {
      all[exerciseId] = progressData;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (e) {
    // Quota or incognito
  }
};

export const saveB2ExerciseProgress = saveB2StoredProgress;

