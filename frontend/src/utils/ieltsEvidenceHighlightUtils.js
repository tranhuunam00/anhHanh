/**
 * Utilities for splitting passage text and highlighting question evidence quotes
 * during review mode ("chữa đề").
 * Adheres to <= 500 lines rule.
 */

import { getReadingExplanation } from "./ieltsReadingExplanations.js";

/**
 * Parses a paragraph of text into alternating segments of normal text and question evidence marks.
 * @param {string} paragraphText - The full paragraph string.
 * @param {string} testId - Test identifier (e.g., 'cambridge-20-test-1').
 * @param {object} evaluation - Scoring map { [qNum]: { isCorrect: boolean, userAns, accepted } }.
 * @param {number[]} questionRange - Min and max question numbers for the current passage, e.g. [1, 13].
 * @returns {Array<{ type: 'text'|'evidence', text: string, qNum?: number, isCorrect?: boolean }>}
 */
export function segmentParagraphWithEvidences(
  paragraphText = "",
  testId = "",
  evaluation = null,
  questionRange = [1, 40]
) {
  if (!paragraphText || typeof paragraphText !== "string") {
    return [];
  }

  const [minQ, maxQ] = questionRange || [1, 40];
  const matchedEvidences = [];

  for (let q = minQ; q <= maxQ; q++) {
    const exp = getReadingExplanation(testId, q);
    const ev = exp?.evidence;
    if (typeof ev === "string" && ev.trim().length >= 10) {
      const trimmed = ev.trim();
      const idx = paragraphText.indexOf(trimmed);
      if (idx !== -1) {
        matchedEvidences.push({
          qNum: q,
          startIndex: idx,
          endIndex: idx + trimmed.length,
          evidenceText: trimmed,
          isCorrect: Boolean(evaluation?.[q]?.isCorrect),
        });
      }
    }
  }

  if (matchedEvidences.length === 0) {
    return [{ type: "text", text: paragraphText }];
  }

  // Sort by starting index and avoid overlapping collisions
  matchedEvidences.sort((a, b) => a.startIndex - b.startIndex);

  const segments = [];
  let cursor = 0;

  for (const item of matchedEvidences) {
    if (item.startIndex < cursor) {
      // Overlap with previous segment, skip or adjust
      continue;
    }

    if (item.startIndex > cursor) {
      segments.push({
        type: "text",
        text: paragraphText.slice(cursor, item.startIndex),
      });
    }

    segments.push({
      type: "evidence",
      text: item.evidenceText,
      qNum: item.qNum,
      isCorrect: item.isCorrect,
    });

    cursor = item.endIndex;
  }

  if (cursor < paragraphText.length) {
    segments.push({
      type: "text",
      text: paragraphText.slice(cursor),
    });
  }

  return segments;
}

/**
 * Attempts smooth scroll to the evidence mark in the passage left pane.
 * @param {number|string} qNum 
 * @param {string} containerSelector 
 */
export function scrollToEvidenceMark(qNum, containerSelector = ".ielts-reading-text-pane") {
  if (!qNum) return;
  const mark = document.getElementById(`ielts-evidence-${qNum}`);
  if (!mark) return;

  mark.scrollIntoView({ behavior: "smooth", block: "center" });

  mark.classList.add("is-focused");
  setTimeout(() => {
    mark.classList.remove("is-focused");
  }, 2200);
}

