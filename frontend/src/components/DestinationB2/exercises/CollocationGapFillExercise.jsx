import React from "react";
import { CheckCircle } from "../../Icons";

/**
 * Exercise Component: Collocation Gap Fill
 * Dùng cho các bài điền 1 từ vào câu đơn như Unit 2 Ex E...
 * Rule 1: Internal icons only.
 * Rule 4: Max 500 lines.
 */
export const CollocationGapFillExercise = ({
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
          <div
            key={itemKey}
            className={`b2-question-item ${itemRes ? (itemRes.is_correct ? "correct" : "incorrect") : ""}`}
            style={{ padding: "14px 18px" }}
          >
            <div style={{ fontSize: "0.98rem", lineHeight: "1.7", color: "var(--text-primary)" }}>
              <strong style={{ color: "var(--primary)", marginRight: "8px" }}>
                {item.id || idx + 1}.
              </strong>
              <span>{item.text || item.sentence}</span>
            </div>

            <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginTop: "8px" }}>
              <input
                type="text"
                disabled={!!result}
                className={`b2-dotted-input ${itemRes ? (itemRes.is_correct ? "correct" : "incorrect") : ""}`}
                style={{ width: "220px" }}
                placeholder="Điền 1 từ..."
                value={currentAns}
                onChange={(e) => onAnswerChange(itemKey, e.target.value)}
              />
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
