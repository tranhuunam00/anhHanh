import React from "react";
import { CheckCircle } from "../../Icons";

/**
 * Exercise Component: Multiple Choice (Trắc nghiệm 4 lựa chọn A, B, C, D)
 * Dùng cho các bài như Unit 1 Ex E...
 * Rule 1: Internal icons only.
 * Rule 4: Max 500 lines.
 */
export const MultipleChoiceExercise = ({
  items = [],
  userAnswers = {},
  result = null,
  onAnswerChange,
}) => {
  const letters = ["A", "B", "C", "D"];

  const getItemResult = (itemKey, idx) => {
    return result?.results?.find(
      (r) => String(r.item_key) === String(itemKey) || r.item_number === idx + 1
    );
  };

  return (
    <div className="b2-mcq-twocol">
      {items.map((item, idx) => {
        const itemKey = String(item.id || idx + 1);
        const currentAns = userAnswers[itemKey] || "";
        const itemRes = getItemResult(itemKey, idx);

        return (
          <div key={itemKey} className="b2-mcq-card">
            <div style={{ fontSize: "0.96rem", lineHeight: "1.6", color: "var(--text-primary)" }}>
              <strong style={{ color: "var(--primary)", marginRight: "8px" }}>{item.id || idx + 1}</strong>
              {item.text}
            </div>

            <div className="b2-mcq-options-stack">
              {(item.options || []).map((opt, oIdx) => {
                const letter = letters[oIdx] || "";
                const isSelected =
                  currentAns.toLowerCase() === opt.toLowerCase() ||
                  currentAns.toUpperCase() === letter;

                return (
                  <button
                    key={oIdx}
                    type="button"
                    disabled={!!result}
                    className={`b2-mcq-option-pill ${isSelected ? "selected" : ""}`}
                    onClick={() => onAnswerChange(itemKey, opt)}
                  >
                    <span className="b2-mcq-option-letter">{letter}</span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {itemRes && (
              <div className={`b2-answer-feedback ${itemRes.is_correct ? "correct" : "incorrect"}`}>
                {itemRes.is_correct ? (
                  <>
                    <CheckCircle size={16} />
                    <span>Chính xác!</span>
                  </>
                ) : (
                  <span>Đáp án: <strong>{itemRes.correct_answer}</strong></span>
                )}
                {itemRes.explanation && (
                  <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                    — {itemRes.explanation}
                  </span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
