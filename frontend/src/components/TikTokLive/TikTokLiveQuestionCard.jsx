import React from "react";
import { Clock, CheckCircle, Sparkles } from "../Icons";
import { calculateVotePercentages } from "../../utils/tiktokLiveUtils";

export const TikTokLiveQuestionCard = React.memo(({
  question,
  questionIndex = 0,
  totalQuestions = 1,
  isRoundActive = false,
  timeLeft = 0,
  voteCounts = {},
  firstWinner = null,
}) => {
  if (!question) {
    return (
      <div className="tiktok-card-empty">
        <p>Chưa có câu hỏi nào được kích hoạt.</p>
      </div>
    );
  }

  const percentages = calculateVotePercentages(voteCounts);
  const targetAnswer = question.answer?.toUpperCase();

  return (
    <div className="tiktok-question-card">
      {/* Top Header: Question Counter & Live Countdown */}
      <div className="tiktok-card-top-bar">
        <span className="tiktok-badge-question-num">
          CÂU {questionIndex + 1}/{totalQuestions}
        </span>
        <div className={`tiktok-timer-pill ${timeLeft <= 5 && isRoundActive ? "urgent" : ""}`}>
          <Clock size={15} />
          <span>{isRoundActive ? `${timeLeft}s` : "HẾT GIỜ"}</span>
        </div>
      </div>

      {/* Main Question Text */}
      <h3 className="tiktok-question-title">{question.question}</h3>

      {/* Multiple Choice Options with Realtime Vote Percentages */}
      <div className="tiktok-options-list">
        {question.options?.map((opt, idx) => {
          const letter = ["A", "B", "C", "D"][idx] || "";
          const isCorrectAnswer = !isRoundActive && letter === targetAnswer;
          const pct = percentages[letter] || 0;
          const votes = voteCounts[letter] || 0;

          return (
            <div
              key={letter}
              className={`tiktok-option-item ${isCorrectAnswer ? "is-correct" : ""}`}
            >
              <div
                className="tiktok-option-progress-bar"
                style={{ width: `${pct}%` }}
              />
              <div className="tiktok-option-content">
                <span className="tiktok-opt-letter">{letter}</span>
                <span className="tiktok-opt-text">{opt.replace(/^[A-D]\.\s*/, "")}</span>
              </div>
              <div className="tiktok-opt-stats">
                <span className="tiktok-opt-pct">{pct}%</span>
                <span className="tiktok-opt-votes">({votes} vote)</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Round End Result Box */}
      {!isRoundActive && (
        <div className="tiktok-answer-reveal-box">
          <div className="tiktok-reveal-header">
            <CheckCircle size={18} color="#10b981" />
            <span>ĐÁP ÁN ĐÚNG: <strong>{targetAnswer}</strong></span>
          </div>
          {question.explanation && (
            <p className="tiktok-reveal-explanation">{question.explanation}</p>
          )}

          {firstWinner && (
            <div className="tiktok-first-winner-banner">
              <Sparkles size={16} color="#eab308" />
              <span>
                Nhất chặng: <strong>{firstWinner.nickname || firstWinner.user_id}</strong> (+100 pts)
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

