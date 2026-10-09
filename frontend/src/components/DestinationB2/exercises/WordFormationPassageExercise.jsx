import React from "react";
import { CheckCircle } from "../../Icons";

/**
 * Exercise Component: Word Formation Passage (Cambridge B2 Format)
 * Dùng cho các bài đọc cấu tạo từ như Unit 2 Ex H (Holiday at home)...
 * Hiển thị đoạn văn chuẩn với chỗ trống (1)-(N) và TỪ GỐC IN HOA ở bên phải mỗi dòng.
 * Rule 1: Internal icons only.
 * Rule 4: Max 500 lines.
 */
export const WordFormationPassageExercise = ({
  items = [],
  exercise = {},
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
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Passage Header / Title */}
      {exercise.passage_title && (
        <div
          style={{
            textAlign: "center",
            fontWeight: 800,
            fontSize: "1.2rem",
            color: "var(--text-primary)",
            padding: "8px 0",
            borderBottom: "1px dashed var(--border-color)",
          }}
        >
          {exercise.passage_title}
        </div>
      )}

      {/* Form Items List */}
      <div className="b2-question-list">
        {items.map((item, idx) => {
          const itemKey = String(item.gap_number || item.id || idx + 1);
          const currentAns = userAnswers[itemKey] || "";
          const itemRes = getItemResult(itemKey, idx);
          const rootWord = (item.prompt || "").replace(/[()]/g, "").trim();

          return (
            <div
              key={itemKey}
              className={`b2-question-item ${itemRes ? (itemRes.is_correct ? "correct" : "incorrect") : ""}`}
              style={{ padding: "14px 18px" }}
            >
              {/* Row with Sentence Context + Prominent Root Word Badge */}
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
                    ({item.gap_number || item.id || idx + 1})
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
                      fontSize: "0.88rem",
                      letterSpacing: "1px",
                      padding: "4px 12px",
                      borderRadius: "6px",
                      alignSelf: "flex-start",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {rootWord}
                  </div>
                )}
              </div>

              {/* Dotted Underline Input */}
              <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginTop: "8px" }}>
                <input
                  type="text"
                  disabled={!!result}
                  className={`b2-dotted-input ${itemRes ? (itemRes.is_correct ? "correct" : "incorrect") : ""}`}
                  style={{ width: "100%", maxWidth: "340px" }}
                  placeholder={`Biến đổi từ "${rootWord}"...`}
                  value={currentAns}
                  onChange={(e) => onAnswerChange(itemKey, e.target.value)}
                />
              </div>

              {/* Feedback Banner */}
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
    </div>
  );
};
