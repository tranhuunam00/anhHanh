import React, { useState } from "react";
import { OLIVER_GRAND_EXAM_QUESTIONS } from "../../data/primaryKids/stage4QuizData.js";
import { playEnglishSpeech, getStarRating } from "../../utils/primaryKidsUtils.js";
import { Star, IconRotate, IconCheckCircle, IconVolume } from "../../constants/icons.js";

/**
 * Oliver the Owl's Grand Term Exam (20 Comprehensive Questions)
 */
export const PrimaryKidsGrandExam = ({ onAwardStar }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  const currentQ = OLIVER_GRAND_EXAM_QUESTIONS[currentIdx];
  const totalQuestions = OLIVER_GRAND_EXAM_QUESTIONS.length;
  const isAnswered = userAnswers[currentQ.id] !== undefined;

  const handleSelectOption = (optIndex) => {
    if (isAnswered) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optIndex
    }));

    if (optIndex === currentQ.correct && onAwardStar) {
      onAwardStar(1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < totalQuestions) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setShowResult(true);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  // Calculate results
  const correctCount = OLIVER_GRAND_EXAM_QUESTIONS.filter(
    (q) => userAnswers[q.id] === q.correct
  ).length;
  const scorePercent = Math.round((correctCount / totalQuestions) * 100);
  const starsEarned = getStarRating(scorePercent);

  const handleRestart = () => {
    setUserAnswers({});
    setCurrentIdx(0);
    setShowResult(false);
  };

  return (
    <div className="kids-game-box">
      <div className="kids-game-header">
        <h2>🦉 Đấu Trường Cú Thông Thái • Đề Thi Tổng Hợp Cuối Kì 1</h2>
        <p>Bộ 20 câu hỏi trọng tâm bao phủ toàn bộ 4 Units chuẩn giáo trình Global English 4!</p>
      </div>

      {!showResult ? (
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          {/* Progress Bar & Question Counter */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <span style={{ fontWeight: 700, color: "var(--primary)" }}>
              Câu hỏi {currentIdx + 1} / {totalQuestions} • (Unit {currentQ.unit})
            </span>
            <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              Đã làm: {Object.keys(userAnswers).length} / {totalQuestions}
            </span>
          </div>

          <div style={{ width: "100%", height: "8px", background: "var(--bg-secondary)", borderRadius: "9999px", overflow: "hidden", marginBottom: "1.25rem" }}>
            <div
              style={{
                width: `${((currentIdx + 1) / totalQuestions) * 100}%`,
                height: "100%",
                background: "var(--primary)",
                transition: "width 0.3s ease"
              }}
            />
          </div>

          {/* Question Box */}
          <div style={{ background: "var(--bg-secondary)", padding: "1.25rem", borderRadius: "1rem", border: "1.5px solid var(--border-color)", marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
              <div style={{ fontSize: "1.15rem", fontWeight: 700, lineHeight: 1.5 }}>
                {currentQ.question}
              </div>
              <button
                className="kids-sound-btn"
                onClick={() => playEnglishSpeech(currentQ.question)}
                title="Nghe câu hỏi"
              >
                <IconVolume size={16} />
              </button>
            </div>
          </div>

          {/* Options Grid */}
          <div className="kids-options-grid">
            {currentQ.options.map((optionText, idx) => {
              const selectedIdx = userAnswers[currentQ.id];
              let cls = "kids-option-card";
              if (selectedIdx !== undefined) {
                if (idx === currentQ.correct) cls += " correct";
                else if (idx === selectedIdx) cls += " wrong";
              }
              return (
                <div
                  key={idx}
                  className={cls}
                  onClick={() => handleSelectOption(idx)}
                >
                  <span className="kids-option-letter">{String.fromCharCode(65 + idx)}</span>
                  <span>{optionText}</span>
                </div>
              );
            })}
          </div>

          {/* Feedback & Explanation */}
          {isAnswered && (
            <div
              className="kids-feedback-box"
              style={{
                borderColor: userAnswers[currentQ.id] === currentQ.correct ? "#10b981" : "#ef4444",
                background: userAnswers[currentQ.id] === currentQ.correct ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.08)"
              }}
            >
              <span className="kids-feedback-avatar">
                {userAnswers[currentQ.id] === currentQ.correct ? "🦉⭐" : "🦉💡"}
              </span>
              <div>
                <strong>
                  {userAnswers[currentQ.id] === currentQ.correct
                    ? "Chính xác 100%! Cú Oliver khen con học bài rất kĩ!"
                    : "Chưa đúng rồi! Cùng xem giải thích bên dưới nhé:"}
                </strong>
                <div style={{ fontSize: "0.875rem", marginTop: "0.25rem", color: "var(--text-secondary)" }}>
                  💡 <em>Giải thích:</em> {currentQ.explanation}
                </div>
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="kids-action-row">
            <button
              className="kids-btn-secondary"
              onClick={handlePrev}
              disabled={currentIdx === 0}
            >
              <span>⬅ Câu Trước</span>
            </button>

            {isAnswered && (
              <button className="kids-btn-primary" onClick={handleNext}>
                <span>{currentIdx + 1 === totalQuestions ? "Xem Bảng Điểm ➔" : "Câu Tiếp Theo ➔"}</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results & Certificate Screen */
        <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto", padding: "1.5rem" }}>
          <div style={{ fontSize: "4.5rem", marginBottom: "0.5rem" }}>
            {scorePercent >= 80 ? "🏆🦉✨" : "🌟🦉💖"}
          </div>

          <h2 style={{ fontSize: "1.85rem", margin: "0 0 0.5rem 0" }}>
            Chứng Chỉ Vinh Danh Safari Star!
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>
            Bé đã hoàn thành bài thi Ôn tập Cuối kì 1 (Global English 4)
          </p>

          {/* Score Box */}
          <div style={{ background: "var(--bg-secondary)", padding: "1.5rem", borderRadius: "1.25rem", border: "2px solid var(--border-color)", margin: "1.5rem 0" }}>
            <div style={{ fontSize: "2.75rem", fontWeight: 800, color: scorePercent >= 60 ? "#10b981" : "#f59e0b" }}>
              {correctCount} / {totalQuestions}
            </div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0.25rem 0 0.75rem 0" }}>
              Điểm số: {scorePercent}%
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", color: "#f59e0b" }}>
              {[1, 2, 3].map((starIdx) => (
                <Star
                  key={starIdx}
                  size={32}
                  fill={starIdx <= starsEarned ? "#f59e0b" : "none"}
                  color="#f59e0b"
                />
              ))}
            </div>

            <div style={{ marginTop: "1rem", fontStyle: "italic", color: "var(--text-secondary)" }}>
              {scorePercent >= 85
                ? "🌟 Tuyệt đỉnh! Con xứng đáng nhận Huy chương Vàng Safari Hoàng Gia!"
                : scorePercent >= 60
                ? "🎉 Làm rất tốt! Con đã nắm chắc hầu hết kiến thức 4 Units!"
                : "🌱 Cố gắng lên nhé! Con hãy ôn lại từ vựng và thử sức lần nữa nha!"}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
            <button className="kids-btn-primary" onClick={handleRestart}>
              <IconRotate size={16} />
              <span>Làm Lại Đề Thi</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

