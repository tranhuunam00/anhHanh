import React from "react";
import { CheckCircle } from "../../Icons";

/**
 * Exercise Component: Passage Cloze Fill (Bài đọc / hội thoại điền từ vào chỗ trống)
 * Dùng cho các bài như Unit 1 Ex F (Ancient aviators?), Ex I (Holiday Blues)...
 * Rule 1: Internal icons only.
 * Rule 4: Max 500 lines.
 */
export const PassageClozeExercise = ({
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
        const itemKey = String(item.gap_number || item.id || idx + 1);
        const currentAns = userAnswers[itemKey] || "";
        const itemRes = getItemResult(itemKey, idx);

        return (
          <div key={itemKey} className="b2-question-item">
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
              <div style={{ fontSize: "1rem", lineHeight: "1.7", color: "var(--text-primary)" }}>
                <strong style={{ color: "var(--primary)", marginRight: "8px" }}>
                  Chỗ trống ({item.gap_number || item.id || idx + 1}):
                </strong>
                <span>{item.text || item.sentence}</span>
              </div>

              <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                <input
                  type="text"
                  disabled={!!result}
                  className={`b2-dotted-input ${itemRes ? (itemRes.is_correct ? "correct" : "incorrect") : ""}`}
                  style={{ width: "260px" }}
                  placeholder="Gõ từ cần điền..."
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
          </div>
        );
      })}
    </div>
  );
};
