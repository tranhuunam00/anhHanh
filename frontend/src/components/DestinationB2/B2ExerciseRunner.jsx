import React, { useState, useEffect } from "react";
import { Check, CheckCircle, RotateCcw, Trophy } from "../Icons";
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

  const handleInputChange = (key, value) => {
    if (result) return; // Prevent changing after submission
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

  // Find bank options if word bank exercise
  const bankWords = exercise.word_bank || [];

  return (
    <div className="b2-exercise-card">
      {/* Exercise Header */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          <span className="b2-ex-badge" style={{ width: "32px", height: "32px", fontSize: "1rem" }}>
            {exercise.exercise_code}
          </span>
          <h2 style={{ margin: 0, fontSize: "1.25rem", color: "var(--text-primary)" }}>
            {exercise.title}
          </h2>
        </div>
        <div className="b2-instruction-box">
          {exercise.instruction}
        </div>
      </div>

      {/* Word bank cloud if applicable */}
      {bankWords.length > 0 && (
        <div className="b2-word-bank-cloud">
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)", alignSelf: "center", marginRight: "4px" }}>
            Từ gợi ý:
          </span>
          {bankWords.map((word, idx) => (
            <span key={idx} className="b2-word-bank-pill">
              {word}
            </span>
          ))}
        </div>
      )}

      {/* Questions List */}
      <div className="b2-question-list">
        {items.map((item, index) => {
          const itemKey = String(item.id || item.gap_id || item.line || index + 1);
          const currentAns = userAnswers[itemKey] || "";
          const itemResult = result?.results?.find((r) => String(r.item_key) === itemKey || r.item_number === index + 1);

          let statusClass = "";
          if (itemResult) {
            statusClass = itemResult.is_correct ? "correct" : "incorrect";
          }

          return (
            <div key={itemKey} className={`b2-question-item ${statusClass}`}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
                <div className="b2-q-text">
                  <strong style={{ color: "var(--primary)", marginRight: "8px" }}>
                    {index + 1}.
                  </strong>
                  {item.text || item.sentence || item.line_text || `Câu hỏi số ${index + 1}`}
                  {item.key_word && (
                    <span style={{ marginLeft: "8px", fontWeight: 700, color: "var(--primary)" }}>
                      [{item.key_word}]
                    </span>
                  )}
                </div>
              </div>

              {/* Render input depending on item type */}
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
              ) : (
                <div>
                  <input
                    type="text"
                    disabled={!!result}
                    className="b2-input-fill"
                    placeholder="Nhập câu trả lời của bạn..."
                    value={currentAns}
                    onChange={(e) => handleInputChange(itemKey, e.target.value)}
                  />
                </div>
              )}

              {/* Evaluation result banner */}
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
                      ({itemResult.explanation})
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Error message if any */}
      {errorMessage && (
        <div style={{ color: "#ef4444", fontSize: "0.9rem", padding: "10px", background: "rgba(239, 68, 68, 0.1)", borderRadius: "8px" }}>
          {errorMessage}
        </div>
      )}

      {/* Footer / Actions Bar */}
      <div className="b2-actions-bar">
        {result ? (
          <>
            <div className="b2-score-banner">
              <Trophy size={20} color="#f59e0b" />
              <span>
                Điểm số: <strong style={{ color: result.score >= 80 ? "#10b981" : "#f59e0b" }}>{result.score}%</strong> ({result.correct_items}/{result.total_items} câu đúng)
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
              Đã làm {Object.values(userAnswers).filter(Boolean).length}/{items.length} câu
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
