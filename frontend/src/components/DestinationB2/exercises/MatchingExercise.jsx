import React from "react";

/**
 * Exercise Component: Matching Sentences (Ghép 2 vế câu cột trái và cột phải)
 * Dùng cho các bài như Unit 1 Ex G...
 * Rule 1: Internal icons only.
 * Rule 4: Max 500 lines.
 */
export const MatchingExercise = ({
  items = [],
  exercise = {},
  userAnswers = {},
  result = null,
  onAnswerChange,
}) => {
  const matchOptions = exercise.matching_options || {};

  const getItemResult = (itemKey, idx) => {
    return result?.results?.find(
      (r) => String(r.item_key) === String(itemKey) || r.item_number === idx + 1
    );
  };

  return (
    <div className="b2-matching-grid-container">
      {/* Left Column: Questions 1 to N */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-muted)" }}>
          Vế câu bắt đầu (1 - {items.length}):
        </div>
        {items.map((item, idx) => {
          const itemKey = String(item.id || idx + 1);
          const currentAns = userAnswers[itemKey] || "";
          const itemRes = getItemResult(itemKey, idx);

          return (
            <div key={itemKey} className="b2-match-left-item">
              <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.92rem" }}>
                {item.text}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <select
                  disabled={!!result}
                  value={currentAns.toUpperCase()}
                  onChange={(e) => onAnswerChange(itemKey, e.target.value)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "6px",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  <option value="">Chọn...</option>
                  {Object.keys(matchOptions).map((letter) => (
                    <option key={letter} value={letter}>
                      {letter}
                    </option>
                  ))}
                </select>
                {itemRes && (
                  <span
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: itemRes.is_correct ? "#10b981" : "#ef4444",
                    }}
                  >
                    {itemRes.is_correct ? "✓" : `(ĐA: ${itemRes.correct_answer})`}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Right Column: Options A to H */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-muted)" }}>
          Vế câu kết thúc ({Object.keys(matchOptions)[0]} - {Object.keys(matchOptions).slice(-1)[0]}):
        </div>
        {Object.entries(matchOptions).map(([letter, text]) => (
          <div key={letter} className="b2-match-right-item">
            <strong style={{ color: "var(--primary)", width: "22px", fontSize: "1rem" }}>{letter}</strong>
            <span style={{ color: "var(--text-primary)" }}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
