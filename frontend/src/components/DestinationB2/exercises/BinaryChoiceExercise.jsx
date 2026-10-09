import React from "react";
import { CheckCircle } from "../../Icons";

/**
 * Exercise Component: Binary Choice (Chọn 1 trong 2 từ/cụm từ in nghiêng/gạch chéo trong câu)
 * Dùng cho các bài như Unit 1 Ex A...
 * Rule 1: Internal icons only.
 * Rule 4: Max 500 lines.
 */
export const BinaryChoiceExercise = ({
  items = [],
  userAnswers = {},
  result = null,
  onAnswerChange,
}) => {
  const getItemResult = (itemKey, idx) => {
    return result?.results?.find(
      (r) => String(r.item_key) === String(itemKey) || r.item_number === idx + 1
    );
  };

  return (
    <div className="b2-question-list">
      {items.map((item, idx) => {
        const itemKey = String(item.id || idx + 1);
        const currentAns = userAnswers[itemKey] || "";
        const itemRes = getItemResult(itemKey, idx);

        let prefix = item.prefix || "";
        let suffix = item.suffix || "";
        let options = item.options || [];

        if (!item.prefix && !item.suffix && item.text && item.text.includes("[")) {
          const match = item.text.match(/^(.*?)\[(.*?)\](.*?)$/);
          if (match) {
            prefix = match[1];
            options = match[2].split("/").map((s) => s.trim());
            suffix = match[3];
          }
        }

        return (
          <div
            key={itemKey}
            className={`b2-question-item ${itemRes ? (itemRes.is_correct ? "correct" : "incorrect") : ""}`}
          >
            <div style={{ fontSize: "1rem", lineHeight: "1.8", color: "var(--text-primary)" }}>
              <strong style={{ color: "var(--primary)", marginRight: "10px", minWidth: "24px", display: "inline-block" }}>
                {item.id || idx + 1}
              </strong>
              <span>{prefix}</span>
              <span className="b2-inline-choice-wrapper">
                {options.map((opt, oIdx) => {
                  const isSelected = currentAns.toLowerCase() === opt.toLowerCase();
                  return (
                    <React.Fragment key={oIdx}>
                      {oIdx > 0 && <span style={{ fontWeight: 700, margin: "0 2px" }}>/</span>}
                      <button
                        type="button"
                        disabled={!!result}
                        className={`b2-inline-choice-btn ${isSelected ? "selected" : ""}`}
                        onClick={() => onAnswerChange(itemKey, opt)}
                      >
                        {opt}
                      </button>
                    </React.Fragment>
                  );
                })}
              </span>
              <span>{item.suffix}</span>
            </div>

            {itemRes && (
              <div className={`b2-answer-feedback ${itemRes.is_correct ? "correct" : "incorrect"}`}>
                {itemRes.is_correct ? (
                  <>
                    <CheckCircle size={16} />
                    <span>Chính xác: <strong>{itemRes.correct_answer}</strong></span>
                  </>
                ) : (
                  <span>Chưa đúng. Đáp án: <strong>{itemRes.correct_answer}</strong></span>
                )}
                {itemRes.explanation && (
                  <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginLeft: "8px" }}>
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
