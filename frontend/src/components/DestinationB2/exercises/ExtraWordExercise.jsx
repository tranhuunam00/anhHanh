import React from "react";

/**
 * Exercise Component: Extra Word Finder (Tìm từ thừa theo từng dòng bài đọc)
 * Dùng cho các bài như Unit 1 Ex H (International friends)...
 * Rule 1: Internal icons only.
 * Rule 4: Max 500 lines.
 */
export const ExtraWordExercise = ({
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
    <div className="b2-notebook-paper">
      {exercise.passage_title && (
        <div className="b2-notebook-title">{exercise.passage_title}</div>
      )}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {items.map((item, idx) => {
          const itemKey = String(item.line || idx + 1);
          const currentAns = userAnswers[itemKey] || "";
          const itemRes = getItemResult(itemKey, idx);

          return (
            <div key={itemKey} className="b2-notebook-row">
              <div className="b2-notebook-row-left">
                <strong style={{ color: "var(--primary)", minWidth: "22px" }}>
                  {item.line || idx + 1}
                </strong>
                <input
                  type="text"
                  disabled={!!result}
                  className={`b2-dotted-input ${itemRes ? (itemRes.is_correct ? "correct" : "incorrect") : ""}`}
                  style={{ minWidth: "90px", width: "100px" }}
                  placeholder="Từ thừa..."
                  value={currentAns}
                  onChange={(e) => onAnswerChange(itemKey, e.target.value)}
                />
                {itemRes && (
                  <span
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      color: itemRes.is_correct ? "#10b981" : "#ef4444",
                    }}
                  >
                    {itemRes.is_correct ? "✓" : `(${itemRes.correct_answer})`}
                  </span>
                )}
              </div>
              <div className="b2-notebook-row-text">{item.text}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
