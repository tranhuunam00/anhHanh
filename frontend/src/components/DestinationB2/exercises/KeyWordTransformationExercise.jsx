import React from "react";
import { CheckCircle } from "../../Icons";

/**
 * Exercise Component: Key Word Transformation (Biến đổi câu với từ khóa in hoa)
 * Dùng cho các bài như Unit 1 Ex J...
 * Rule 1: Internal icons only.
 * Rule 4: Max 500 lines.
 */
export const KeyWordTransformationExercise = ({
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

        return (
          <div key={itemKey} className="b2-question-item">
            <div style={{ fontSize: "1rem", color: "var(--text-primary)", lineHeight: "1.7" }}>
              <strong style={{ color: "var(--primary)", marginRight: "8px" }}>
                {item.id || idx + 1}
              </strong>
              <span>{item.first_sentence}</span>
            </div>

            <div>
              <span className="b2-key-badge-container">{item.key_word}</span>
            </div>

            <div
              style={{
                fontSize: "0.98rem",
                color: "var(--text-primary)",
                display: "flex",
                alignItems: "baseline",
                flexWrap: "wrap",
                gap: "6px",
              }}
            >
              <span>{item.second_sentence_prefix}</span>
              <input
                type="text"
                disabled={!!result}
                className={`b2-dotted-input ${itemRes ? (itemRes.is_correct ? "correct" : "incorrect") : ""}`}
                style={{ minWidth: "220px", flex: "1" }}
                placeholder="Điền từ 2 đến 5 từ..."
                value={currentAns}
                onChange={(e) => onAnswerChange(itemKey, e.target.value)}
              />
              <span>{item.second_sentence_suffix}</span>
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
