import React from "react";
import { CheckCircle } from "../../Icons";

/**
 * Exercise Component: Rewrite Correction (Viết lại câu / sửa cụm từ in đậm)
 * Dùng cho các bài như Unit 1 Ex B...
 * Rule 1: Internal icons only.
 * Rule 4: Max 500 lines.
 */
export const RewriteCorrectionExercise = ({
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

        let renderedText = item.text;
        if (item.bold_phrase && item.text?.includes(item.bold_phrase)) {
          const parts = item.text.split(item.bold_phrase);
          renderedText = (
            <span>
              {parts[0]}
              <span className="b2-bold-target">{item.bold_phrase}</span>
              {parts[1]}
            </span>
          );
        }

        return (
          <div key={itemKey} className="b2-rewrite-item">
            <div style={{ fontSize: "1rem", color: "var(--text-primary)", fontWeight: 500 }}>
              <strong style={{ color: "var(--primary)", marginRight: "10px" }}>{item.id || idx + 1}</strong>
              {renderedText}
            </div>

            <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginTop: "4px" }}>
              <input
                type="text"
                disabled={!!result}
                className={`b2-dotted-input ${itemRes ? (itemRes.is_correct ? "correct" : "incorrect") : ""}`}
                style={{ width: "100%" }}
                placeholder="Viết lại cụm từ hoặc cả câu chính xác..."
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
