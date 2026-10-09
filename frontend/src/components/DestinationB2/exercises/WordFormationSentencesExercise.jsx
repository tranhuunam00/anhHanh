import React from "react";
import { CheckCircle } from "../../Icons";

/**
 * Exercise Component: Word Formation Sentences
 * Dùng cho các câu biến đổi từ loại đơn lẻ như Unit 2 Ex I...
 * Rule 1: Internal icons only.
 * Rule 4: Max 500 lines.
 */
export const WordFormationSentencesExercise = ({
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
        const rootWord = (item.prompt || "").replace(/[()]/g, "").trim();

        return (
          <div
            key={itemKey}
            className={`b2-question-item ${itemRes ? (itemRes.is_correct ? "correct" : "incorrect") : ""}`}
            style={{ padding: "14px 18px" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: 1, fontSize: "0.98rem", lineHeight: "1.7", color: "var(--text-primary)" }}>
                <strong style={{ color: "var(--primary)", marginRight: "8px" }}>
                  {item.id || idx + 1}.
                </strong>
                <span>{item.text || item.sentence}</span>
              </div>

              {rootWord && (
                <div
                  style={{
                    background: "rgba(99, 102, 241, 0.12)",
                    border: "1.5px solid var(--primary)",
                    color: "var(--primary)",
                    fontWeight: 800,
                    fontSize: "0.85rem",
                    letterSpacing: "1px",
                    padding: "3px 10px",
                    borderRadius: "6px",
                    alignSelf: "flex-start",
                    whiteSpace: "nowrap",
                  }}
                >
                  {rootWord}
                </div>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginTop: "8px" }}>
              <input
                type="text"
                disabled={!!result}
                className={`b2-dotted-input ${itemRes ? (itemRes.is_correct ? "correct" : "incorrect") : ""}`}
                style={{ width: "100%", maxWidth: "340px" }}
                placeholder={`Dạng từ của "${rootWord}"...`}
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
