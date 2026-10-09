import React from "react";

/**
 * Exercise Component: Word Formation Passage (Cambridge B2 Format)
 * Dùng cho các bài đọc cấu tạo từ như Unit 2 Ex H (Holiday at home)...
 * Hiển thị đoạn văn chuẩn với chỗ trống (1)-(N) inline và TỪ GỐC IN HOA ở bên phải mỗi dòng.
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
      {/* Passage Card Container */}
      <div className="b2-wf-passage-card">
        {exercise.passage_title && (
          <div
            style={{
              textAlign: "center",
              fontWeight: 800,
              fontSize: "1.2rem",
              color: "var(--text-primary)",
              paddingBottom: "14px",
              marginBottom: "8px",
              borderBottom: "1px dashed var(--border-color)",
            }}
          >
            {exercise.passage_title}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column" }}>
          {items.map((item, idx) => {
            const itemKey = String(item.gap_number || item.gap_id || item.id || idx + 1);
            const currentAns = userAnswers[itemKey] || "";
            const itemRes = getItemResult(itemKey, idx);
            const rootWord = (item.capital_word || item.prompt || item.root || "")
              .replace(/[()]/g, "")
              .trim();

            const hasSegments = item.prefix !== undefined;

            return (
              <div key={itemKey} className="b2-wf-passage-row">
                {/* Passage Line with Inline Blank */}
                <div className="b2-wf-passage-text">
                  {hasSegments ? (
                    <>
                      {item.prefix && <span>{item.prefix} </span>}
                      <strong style={{ color: "var(--primary)", marginRight: "4px" }}>
                        ({item.gap_number || idx + 1})
                      </strong>
                      <input
                        type="text"
                        disabled={!!result}
                        className={`b2-dotted-input ${
                          itemRes ? (itemRes.is_correct ? "correct" : "incorrect") : ""
                        }`}
                        style={{ minWidth: "140px", maxWidth: "200px", textAlign: "center" }}
                        placeholder="..................................."
                        value={currentAns}
                        onChange={(e) => onAnswerChange(itemKey, e.target.value)}
                      />
                      {item.suffix && <span> {item.suffix}</span>}
                    </>
                  ) : (
                    <>
                      <strong style={{ color: "var(--primary)", marginRight: "6px" }}>
                        ({item.gap_number || idx + 1})
                      </strong>
                      <input
                        type="text"
                        disabled={!!result}
                        className={`b2-dotted-input ${
                          itemRes ? (itemRes.is_correct ? "correct" : "incorrect") : ""
                        }`}
                        style={{ minWidth: "140px", maxWidth: "200px", textAlign: "center" }}
                        placeholder="..................................."
                        value={currentAns}
                        onChange={(e) => onAnswerChange(itemKey, e.target.value)}
                      />
                      <span style={{ marginLeft: "8px" }}>{item.text || item.sentence}</span>
                    </>
                  )}

                  {/* Immediate Feedback Tag */}
                  {itemRes && (
                    <span
                      style={{
                        marginLeft: "10px",
                        fontSize: "0.88rem",
                        fontWeight: 700,
                        color: itemRes.is_correct ? "#10b981" : "#ef4444",
                      }}
                    >
                      {itemRes.is_correct ? "✓" : `(${itemRes.correct_answer})`}
                    </span>
                  )}
                </div>

                {/* Right-aligned CAPITAL ROOT WORD */}
                {rootWord && (
                  <div className="b2-wf-passage-cap">
                    {rootWord}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

