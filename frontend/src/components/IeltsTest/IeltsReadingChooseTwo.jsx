import React from "react";
import { HighlightedVocabSentence } from "../Vocab/HighlightedVocabSentence.jsx";
import { getFeedbackClass, renderFeedback } from "./ieltsFeedbackHelpers.jsx";
import { parseOption } from "../../utils/cambridgeOptionUtils.js";
import { getChooseTwoBlocks } from "../../utils/ieltsReadingChooseTwoUtils.js";

/**
 * "Choose TWO letters, A–E" block for reading.
 * Accepts both data shapes: per-item options with pairNumber, or options on the group.
 */
export function IeltsReadingChooseTwo({ group, answers, onChange, onChooseTwoToggle, evaluation, isReview }) {
  const blocks = getChooseTwoBlocks(group);
  if (blocks.length === 0) return null;

  return (
    <div className="ielts-choose-two-list">
      {blocks.map(({ numbers, question, options }) => {
        const [first, second] = numbers;
        return (
          <div key={first} id={`ielts-q-${first}`} className="ielts-mc-item" style={{ marginBottom: "16px" }}>
            <span id={second ? `ielts-q-${second}` : undefined} />
            <div className="ielts-mc-question-row">
              <span className="ielts-q-pill">
                {first}
                {second ? ` & ${second}` : ""}
              </span>
              {question && (
                <p className="ielts-mc-question-text">
                  {isReview ? <HighlightedVocabSentence text={question} contextSentence={question} /> : question}
                </p>
              )}
            </div>
            <div className="ielts-choose-two-options">
              {options.map((rawOpt) => {
                const { letter, text } = parseOption(rawOpt);
                const isChecked = answers[first] === letter || (second && answers[second] === letter);
                return (
                  <label
                    key={letter}
                    className={`ielts-choose-two-label ${isChecked ? "selected" : ""} ${getFeedbackClass(evaluation, first, isReview)}`}
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(isChecked)}
                      onChange={() => {
                        if (onChooseTwoToggle && second) {
                          onChooseTwoToggle([first, second], letter);
                        } else {
                          onChange(first, isChecked ? "" : letter);
                        }
                      }}
                      className="ielts-checkbox-input"
                    />
                    <span className="ielts-option-letter">{letter}</span>
                    <span className="ielts-option-text">
                      {isReview ? <HighlightedVocabSentence text={text} contextSentence={text} /> : text}
                    </span>
                  </label>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              {renderFeedback(evaluation, first, isReview)}
              {second && renderFeedback(evaluation, second, isReview)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
