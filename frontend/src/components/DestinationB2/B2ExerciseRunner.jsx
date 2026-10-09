import React, { useState, useEffect } from "react";
import { Check, CheckCircle, RotateCcw, Trophy } from "../Icons";
import { submitB2Exercise } from "../../services/destinationB2Service";
import {
  gradeB2ExerciseSubmission,
  getB2StoredProgress,
  saveB2StoredProgress,
} from "../../utils/destinationB2Grading";
import { B2ExerciseItemsRenderer } from "./B2ExerciseItemsRenderer";
import "../../styles/destination-b2-workbook.css";

/**
 * Destination B2 Exercise Runner.
 * Fully client-side autonomous grading & offline storage.
 * Rule 1: Internal icons only.
 * Rule 4: File strictly under 500 lines.
 */
export const B2ExerciseRunner = ({ exercise, token, onExerciseCompleted }) => {
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Load cached progress or reset state when exercise changes
  useEffect(() => {
    if (!exercise?.id) {
      setUserAnswers({});
      setResult(null);
      return;
    }

    const saved = getB2StoredProgress(exercise.id);
    if (saved && saved.results) {
      setResult(saved);
      // Restore user answers from saved results
      const restored = {};
      saved.results.forEach((r) => {
        if (r.item_key && r.user_answer) {
          restored[r.item_key] = r.user_answer;
        }
      });
      setUserAnswers(restored);
    } else {
      setUserAnswers({});
      setResult(null);
    }
    setErrorMessage("");
  }, [exercise?.id]);

  if (!exercise) {
    return (
      <div className="b2-exercise-card">
        <p style={{ color: "var(--text-muted)" }}>
          Chọn một bài tập từ danh sách bên trái để bắt đầu luyện tập.
        </p>
      </div>
    );
  }

  const items = exercise.items || [];
  const bankWords = exercise.word_bank || [];

  const handleAnswerChange = (key, value) => {
    if (result) return; // Locked after grading
    setUserAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      // 1. Instant client-side grading (0ms latency, zero backend requirement)
      const evaluation = gradeB2ExerciseSubmission(exercise, userAnswers);
      setResult(evaluation);
      saveB2StoredProgress(exercise.id, evaluation);

      if (onExerciseCompleted) {
        onExerciseCompleted(evaluation);
      }

      // 2. Background optional sync to backend if available
      if (token && exercise.id) {
        submitB2Exercise(exercise.id, userAnswers, token).catch(() => {
          // Gracefully ignore backend sync errors; client is primary source of truth
        });
      }
    } catch (err) {
      setErrorMessage(err.message || "Đã xảy ra lỗi khi chấm điểm bài tập.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setUserAnswers({});
    setResult(null);
    setErrorMessage("");
    saveB2StoredProgress(exercise.id, null);
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

      {/* Authentic Word Bank Box (Ex D, Ex F) */}
      {bankWords.length > 0 && (
        <div className="b2-wb-box-header">
          {bankWords.map((word, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="b2-wb-bullet">•</span>}
              <span className="b2-wb-word-pill">{word}</span>
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Authentic Blue Reading Passage Box (Ex F, Ex I) */}
      {exercise.passage_text && exercise.exercise_code !== "H" && (
        <div className="b2-passage-blue-box">
          {exercise.passage_title && (
            <div className="b2-passage-heading">
              {exercise.passage_title}
            </div>
          )}
          <div style={{ whiteSpace: "pre-line" }}>
            {exercise.passage_text}
          </div>
        </div>
      )}

      {/* Interactive Items Form */}
      <B2ExerciseItemsRenderer
        exercise={exercise}
        userAnswers={userAnswers}
        result={result}
        onAnswerChange={handleAnswerChange}
      />

      {/* Error Notice */}
      {errorMessage && (
        <div style={{ color: "#ef4444", fontSize: "0.9rem", padding: "10px", background: "rgba(239, 68, 68, 0.1)", borderRadius: "8px" }}>
          {errorMessage}
        </div>
      )}

      {/* Actions & Results Bar */}
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
              Đã làm: {Object.values(userAnswers).filter(Boolean).length}/{items.length} câu
            </span>
            <button
              type="button"
              className="btn btn-primary btn-with-icon"
              disabled={isSubmitting || items.length === 0}
              onClick={handleSubmit}
            >
              <Check size={16} />
              <span>{isSubmitting ? "Đang chấm..." : "Nộp bài kiểm tra"}</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
