import React from "react";
import { CheckCircle } from "../../constants/icons.js";

/**
 * Returns CSS class for input element based on review mode and evaluation state.
 * @param {object|null|undefined} evaluation
 * @param {number|string} qNum
 * @param {boolean} isReview
 * @returns {string}
 */
export function getFeedbackClass(evaluation, qNum, isReview = false) {
  if (!isReview || !evaluation || !evaluation[qNum]) return "";
  return evaluation[qNum].isCorrect ? "input-correct" : "input-incorrect";
}

/**
 * Renders feedback badge (correct / answer display) for review mode.
 * @param {object|null|undefined} evaluation
 * @param {number|string} qNum
 * @param {boolean} isReview
 * @returns {React.ReactNode|null}
 */
export function renderFeedback(evaluation, qNum, isReview) {
  if (!evaluation || !evaluation[qNum] || !isReview) return null;
  const res = evaluation[qNum];
  return (
    <span className={`ielts-eval-badge ${res.isCorrect ? "correct" : "incorrect"}`}>
      {res.isCorrect ? (
        <span><CheckCircle className="w-3.5 h-3.5 inline mr-1" /> Đúng</span>
      ) : (
        <span>Đáp án: <strong>{res.accepted?.join(" / ")}</strong></span>
      )}
    </span>
  );
}

