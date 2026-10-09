import React, { useState, useEffect } from "react";
import { Check, CheckCircle, RotateCcw, Trophy, IconAlert } from "../Icons";
import { submitB2Exercise } from "../../services/destinationB2Service";

export const B2ExerciseRunner = ({ exercise, token, onExerciseCompleted }) => {
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Reset answer state when exercise changes
  useEffect(() => {
    setUserAnswers({});
    setResult(null);
    setErrorMessage("");
  }, [exercise?.id]);

  if (!exercise) {
    return (
      <div className="b2-exercise-card">
        <p style={{ color: "var(--text-muted)" }}>Chọn một bài tập từ danh sách bên trái để bắt đầu luyện tập.</p>
      </div>
    );
  }

  const items = exercise.items || [];
  const bankWords = exercise.word_bank || [];

  const handleInputChange = (key, value) => {
    if (result) return; // Prevent editing after submission
    setUserAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      const res = await submitB2Exercise(exercise.id, userAnswers, token);
      setResult(res);
      if (onExerciseCompleted) {
        onExerciseCompleted(res);
      }
    } catch (err) {
      setErrorMessage(err.message || "Đã xảy ra lỗi khi nộp bài.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setUserAnswers({});
    setResult(null);
    setErrorMessage("");
  };

  return (
    <div className="b2-exercise-card">
      {/* Exercise Header */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          <span className="b2-ex-badge" style={{ width: "36px", height: "36px", fontSize: "1.1rem" }}>
            {exercise.exercise_code}
          </span>
          <h2 style={{ margin: 0, fontSize: "1.3rem", color: "var(--text-primary)" }}>
            {exercise.title}
          </h2>
        </div>
        <div className="b2-instruction-box">
          {exercise.instruction}
        </div>
      </div>

      {/* Word Bank cloud (Ex D, Ex F) */}
      {bankWords.length > 0 && (
        <div className="b2-word-bank-cloud">
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)", alignSelf: "center", marginRight: "4px" }}>
            Hộp từ gợi ý (Word Box):
          </span>
          {bankWords.map((word, idx) => (
            <span key={idx} className="b2-word-bank-pill">
              {word}
            </span>
          ))}
        </div>
      )}

      {/* Passage Card for Reading / Cloze Exercises (Ex F, Ex I) */}
      {exercise.passage_text && (
        <div
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: "12px",
            padding: "18px 22px",
            lineHeight: "1.8",
            fontSize: "0.96rem",
            color: "var(--text-primary)",
          }}
        >
          {exercise.passage_title && (
            <div
              style={{
                fontSize: "1.1rem",
                fontWeight: 800,
                color: "var(--primary)",
                marginBottom: "12px",
                borderBottom: "1px dashed var(--border-color)",
                paddingBottom: "8px",
              }}
            >
              📖 {exercise.passage_title}
            </div>
          )}
          <div style={{ whiteSpace: "pre-line", fontStyle: "normal" }}>
            {exercise.passage_text}
          </div>
        </div>
      )}

      {/* Matching Options Legend (Ex G) */}
      {exercise.matching_options && (
        <div
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: "12px",
            padding: "16px 20px",
          }}
        >
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px" }}>
            Vế câu ghép (A - H):
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "8px" }}>
            {Object.entries(exercise.matching_options).map(([letter, text]) => (
              <div key={letter} style={{ fontSize: "0.88rem", color: "var(--text-primary)" }}>
                <strong style={{ color: "var(--primary)", marginRight: "6px" }}>{letter}.</strong>
                {text}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="b2-question-list">
        {items.map((item, index) => {
          const itemKey = String(item.id || item.gap_number || item.line || index + 1);
          const currentAns = userAnswers[itemKey] || "";
          const itemResult = result?.results?.find((r) => String(r.item_key) === itemKey || r.item_number === index + 1);

          let statusClass = "";
          if (itemResult) {
            statusClass = itemResult.is_correct ? "correct" : "incorrect";
          }

          return (
            <div key={itemKey} className={`b2-question-item ${statusClass}`}>
              {/* Question Text / Prompt */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {/* For Key Word Transformation (Ex J) */}
                {item.key_word && (
                  <div style={{ fontSize: "0.95rem", color: "var(--text-primary)" }}>
                    <div style={{ marginBottom: "6px" }}>
                      <strong style={{ color: "var(--primary)", marginRight: "8px" }}>{index + 1}.</strong>
                      {item.first_sentence}
                    </div>
                    <div style={{ display: "inline-block", background: "rgba(99, 102, 241, 0.12)", color: "var(--primary)", fontWeight: 700, padding: "2px 8px", borderRadius: "6px", fontSize: "0.85rem", marginBottom: "6px" }}>
                      Từ khóa: {item.key_word.toUpperCase()}
                    </div>
                    <div style={{ fontWeight: 500, color: "var(--text-secondary)" }}>
                      {item.second_sentence_prefix} <strong>[ . . . ]</strong> {item.second_sentence_suffix}
                    </div>
                  </div>
                )}

                {/* For Rewrite with Bold Words (Ex B) */}
                {item.bold_phrase && (
                  <div style={{ fontSize: "0.95rem", color: "var(--text-primary)" }}>
                    <strong style={{ color: "var(--primary)", marginRight: "8px" }}>{index + 1}.</strong>
                    {item.text}
                    <div style={{ marginTop: "4px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      Cụm từ in đậm cần sửa: <strong style={{ color: "#f59e0b" }}>{item.bold_phrase}</strong>
                    </div>
                  </div>
                )}

                {/* For Standard Text items (Ex A, C, D, E, F, G, H, I) */}
                {!item.key_word && !item.bold_phrase && (
                  <div className="b2-q-text">
                    <strong style={{ color: "var(--primary)", marginRight: "8px" }}>
                      {item.line ? `Dòng ${item.line}.` : item.gap_number ? `Chỗ trống (${item.gap_number}).` : `${index + 1}.`}
                    </strong>
                    {item.text || item.sentence || `Câu hỏi số ${index + 1}`}
                    {item.prompt && (
                      <span style={{ marginLeft: "8px", fontWeight: 700, color: "var(--primary)" }}>
                        {item.prompt}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Input Area based on Question Type */}
              {item.options && Array.isArray(item.options) ? (
                <div className="b2-choice-options">
                  {item.options.map((opt, optIdx) => {
                    const isSelected = currentAns.toLowerCase() === opt.toLowerCase();
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={!!result}
                        className={`b2-option-btn ${isSelected ? "selected" : ""}`}
                        onClick={() => handleInputChange(itemKey, opt)}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              ) : exercise.matching_options ? (
                /* Matching selection (A-H) */
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {Object.keys(exercise.matching_options).map((letter) => {
                    const isSelected = currentAns.toUpperCase() === letter.toUpperCase();
                    return (
                      <button
                        key={letter}
                        type="button"
                        disabled={!!result}
                        className={`b2-option-btn ${isSelected ? "selected" : ""}`}
                        style={{ minWidth: "40px", fontWeight: 700 }}
                        onClick={() => handleInputChange(itemKey, letter)}
                      >
                        {letter}
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* Fill in the blank input */
                <div>
                  <input
                    type="text"
                    disabled={!!result}
                    className="b2-input-fill"
                    placeholder={
                      exercise.exercise_type === "extra_word"
                        ? "Nhập từ thừa trong dòng này (hoặc 'correct' nếu đúng)..."
                        : item.key_word
                        ? "Nhập từ biến đổi (từ 2 đến 5 từ)..."
                        : "Nhập câu trả lời của bạn..."
                    }
                    value={currentAns}
                    onChange={(e) => handleInputChange(itemKey, e.target.value)}
                  />
                </div>
              )}

              {/* Evaluation Feedback Banner */}
              {itemResult && (
                <div className={`b2-answer-feedback ${itemResult.is_correct ? "correct" : "incorrect"}`}>
                  {itemResult.is_correct ? (
                    <>
                      <CheckCircle size={16} />
                      <span>Chính xác!</span>
                    </>
                  ) : (
                    <>
                      <span>Chưa đúng. Đáp án: <strong>{itemResult.correct_answer}</strong></span>
                    </>
                  )}
                  {itemResult.explanation && (
                    <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginLeft: "8px" }}>
                      — {itemResult.explanation}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Error message */}
      {errorMessage && (
        <div style={{ color: "#ef4444", fontSize: "0.9rem", padding: "10px", background: "rgba(239, 68, 68, 0.1)", borderRadius: "8px" }}>
          {errorMessage}
        </div>
      )}

      {/* Actions Bar */}
      <div className="b2-actions-bar">
        {result ? (
          <>
            <div className="b2-score-banner">
              <Trophy size={20} color="#f59e0b" />
              <span>
                Kết quả: <strong style={{ color: result.score >= 80 ? "#10b981" : "#f59e0b" }}>{result.score}%</strong> ({result.correct_items}/{result.total_items} câu đúng)
              </span>
            </div>
            <button type="button" className="btn btn-secondary btn-with-icon" onClick={handleRetry}>
              <RotateCcw size={16} />
              <span>Làm lại bài này</span>
            </button>
          </>
        ) : (
          <>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Đã điền {Object.values(userAnswers).filter(Boolean).length}/{items.length} câu
            </span>
            <button
              type="button"
              className="btn btn-primary btn-with-icon"
              disabled={isSubmitting || items.length === 0}
              onClick={handleSubmit}
            >
              <Check size={16} />
              <span>{isSubmitting ? "Đang chấm điểm..." : "Nộp bài kiểm tra"}</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
