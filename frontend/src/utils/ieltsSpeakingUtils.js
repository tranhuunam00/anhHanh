/**
 * IELTS Speaking Module Utilities
 * Provides data normalization, time formatting, and progress tracking for the
 * interactive IELTS Computer-Delivered Speaking simulator.
 */

/**
 * Returns a normalized flat array of questions for any IELTS Speaking part.
 * - Part 1: list of interview questions.
 * - Part 2: returns a single Cue Card item.
 * - Part 3: flattens sections if present, or returns questions list.
 */
export const getPartQuestions = (part) => {
  if (!part) return [];
  if (part.partNumber === 2) {
    if (part.cueCard) {
      return [
        {
          id: 1,
          topic: part.cueCard.topic,
          prompts: part.cueCard.prompts || [],
          isCueCard: true,
          prepTimeSeconds: part.prepTimeSeconds || 60,
          speakingTimeSeconds: part.speakingTimeSeconds || 120
        }
      ];
    }
    return [];
  }

  if (part.partNumber === 3) {
    if (Array.isArray(part.sections) && part.sections.length > 0) {
      const flattened = [];
      let counter = 1;
      part.sections.forEach((sec) => {
        const theme = sec.theme || "";
        (sec.questions || []).forEach((q) => {
          flattened.push({
            id: counter++,
            originalId: q.id,
            text: q.text || "",
            theme
          });
        });
      });
      return flattened;
    }
    return (part.questions || []).map((q, idx) => ({
      id: idx + 1,
      originalId: q.id,
      text: q.text || ""
    }));
  }

  // Part 1
  return (part.questions || []).map((q, idx) => ({
    id: idx + 1,
    originalId: q.id,
    text: q.text || ""
  }));
};

/**
 * Returns default answering time limit in seconds according to official IELTS standards:
 * - Part 1: 45s per response
 * - Part 2: 120s (2 minutes speaking)
 * - Part 3: 60s per response
 */
export const getDefaultQuestionTimeLimit = (partNumber) => {
  if (partNumber === 1) return 45;
  if (partNumber === 2) return 120;
  if (partNumber === 3) return 60;
  return 45;
};

/**
 * Formats seconds into MM:SS display
 */
export const formatSpeakingTimer = (seconds) => {
  const s = Math.max(0, Math.floor(Number(seconds) || 0));
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

/**
 * Computes overall completion statistics across all Speaking parts
 */
export const computeSpeakingProgress = (parts = [], answeredMap = {}) => {
  let total = 0;
  let answered = 0;

  (parts || []).forEach((p) => {
    const pNumber = p.partNumber;
    const questions = getPartQuestions(p);
    total += questions.length;
    questions.forEach((q) => {
      const key = `p${pNumber}_q${q.id}`;
      if (answeredMap[key]) {
        answered++;
      }
    });
  });

  const percentage = total > 0 ? Math.round((answered / total) * 100) : 0;
  return { total, answered, percentage };
};

