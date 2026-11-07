import React, { useState } from "react";
import { FOX_SENTENCE_DRILLS } from "../../data/primaryKids/stage4QuizData.js";
import { validateSentenceOrder, playEnglishSpeech } from "../../utils/primaryKidsUtils.js";
import { Star, IconRotate } from "../../constants/icons.js";

/**
 * Felix the Fox River Jump: Sentence Order & Grammar Builder
 */
export const PrimaryKidsFoxRunner = ({ onAwardStar }) => {
  const [drillIndex, setDrillIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState([]);
  const [poolWords, setPoolWords] = useState(() => {
    return [...FOX_SENTENCE_DRILLS[0].words];
  });
  const [feedback, setFeedback] = useState(null);
  const [isDone, setIsDone] = useState(false);
  const [score, setScore] = useState(0);

  const currentDrill = FOX_SENTENCE_DRILLS[drillIndex];

  // Pick word from pool into assembled sentence
  const handlePickWord = (word, poolIndex) => {
    if (feedback?.isCorrect) return;
    const nextPool = [...poolWords];
    nextPool.splice(poolIndex, 1);
    setPoolWords(nextPool);
    setSelectedWords([...selectedWords, word]);
    playEnglishSpeech(word);
  };

  // Remove word from assembled sentence back to pool
  const handleRemoveWord = (word, selIndex) => {
    if (feedback?.isCorrect) return;
    const nextSelected = [...selectedWords];
    nextSelected.splice(selIndex, 1);
    setSelectedWords(nextSelected);
    setPoolWords([...poolWords, word]);
  };

  // Verify answer
  const handleCheck = () => {
    const isCorrect = validateSentenceOrder(selectedWords, currentDrill.target);
    if (isCorrect) {
      playEnglishSpeech(currentDrill.target);
      setScore((s) => s + 10);
      setFeedback({
        isCorrect: true,
        message: `Xuất sắc! Cáo Felix đã nhảy qua sông an toàn! 🦊🎉`,
        ruleVi: currentDrill.ruleVi
      });
      if (onAwardStar) onAwardStar(1);
    } else {
      setFeedback({
        isCorrect: false,
        message: `Chưa đúng thứ tự rồi! Hãy đọc kĩ quy tắc ngữ pháp và xếp lại nhé.`,
        ruleVi: currentDrill.ruleVi
      });
    }
  };

  // Reset words in current drill
  const handleResetWords = () => {
    setSelectedWords([]);
    setPoolWords([...currentDrill.words]);
    setFeedback(null);
  };

  // Move to next drill
  const handleNext = () => {
    if (drillIndex + 1 >= FOX_SENTENCE_DRILLS.length) {
      setIsDone(true);
    } else {
      const nextIdx = drillIndex + 1;
      setDrillIndex(nextIdx);
      setSelectedWords([]);
      setPoolWords([...FOX_SENTENCE_DRILLS[nextIdx].words]);
      setFeedback(null);
    }
  };

  const handleRestartAll = () => {
    setDrillIndex(0);
    setSelectedWords([]);
    setPoolWords([...FOX_SENTENCE_DRILLS[0].words]);
    setFeedback(null);
    setIsDone(false);
    setScore(0);
  };

  return (
    <div className="kids-game-box">
      <div className="kids-game-header">
        <h2>🦊 Cáo Felix Vượt Sông • Trật Tự Từ & Ngữ Pháp</h2>
        <p>Bé hãy xếp các từ thành câu đúng để tạo thành các viên đá giúp Cáo Felix nhảy qua sông nhé!</p>
      </div>

      {!isDone ? (
        <div style={{ maxWidth: "750px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <span style={{ fontWeight: 700, color: "var(--primary)" }}>
              Thử thách {drillIndex + 1} / {FOX_SENTENCE_DRILLS.length}
            </span>
            <span style={{ color: "#f59e0b", fontWeight: 700 }}>
              Điểm: {score} ⭐
            </span>
          </div>

          {/* River Stage */}
          <div className="kids-river-stage">
            <div style={{ textAlign: "center", fontSize: "2.5rem", marginBottom: "0.5rem" }}>
              {feedback?.isCorrect ? "🦊💨 🌊 🪨" : "🦊 🌊 🪨"}
            </div>

            {/* Target Sentence Drop Box */}
            <div className="kids-sentence-target-box">
              {selectedWords.length === 0 ? (
                <span style={{ color: "var(--text-muted)", fontStyle: "italic", margin: "auto" }}>
                  Bấm vào các từ bên dưới để ghép câu vào đây...
                </span>
              ) : (
                selectedWords.map((word, idx) => (
                  <div
                    key={idx}
                    className="kids-word-stone"
                    onClick={() => handleRemoveWord(word, idx)}
                    title="Bấm để trả từ lại"
                  >
                    {word}
                  </div>
                ))
              )}
            </div>

            {/* Word Pool */}
            <div className="kids-word-pool">
              {poolWords.map((word, idx) => (
                <div
                  key={idx}
                  className="kids-word-stone in-pool"
                  onClick={() => handlePickWord(word, idx)}
                  title="Bấm để chọn từ"
                >
                  {word}
                </div>
              ))}
            </div>
          </div>

          {/* Feedback & Rule Box */}
          {feedback && (
            <div
              className="kids-feedback-box"
              style={{
                borderColor: feedback.isCorrect ? "#10b981" : "#ef4444",
                background: feedback.isCorrect ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.08)"
              }}
            >
              <span className="kids-feedback-avatar">
                {feedback.isCorrect ? "🦊🎉" : "🦊💡"}
              </span>
              <div>
                <strong>{feedback.message}</strong>
                {feedback.ruleVi && (
                  <div style={{ fontSize: "0.85rem", marginTop: "0.25rem", color: "var(--text-secondary)" }}>
                    💡 <em>Quy tắc:</em> {feedback.ruleVi}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="kids-action-row">
            <button className="kids-btn-secondary" onClick={handleResetWords} disabled={feedback?.isCorrect}>
              <IconRotate size={16} />
              <span>Xếp Lại Từ Đầu</span>
            </button>

            {!feedback?.isCorrect ? (
              <button
                className="kids-btn-primary"
                onClick={handleCheck}
                disabled={selectedWords.length === 0}
              >
                <span>Kiểm Tra Đáp Án ➔</span>
              </button>
            ) : (
              <button className="kids-btn-primary" onClick={handleNext}>
                <span>Câu Tiếp Theo ➔</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Completed Screen */
        <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
          <div style={{ fontSize: "4.5rem", marginBottom: "0.5rem" }}>🏆🦊🌟</div>
          <h2 style={{ fontSize: "1.75rem", margin: "0 0 0.5rem 0" }}>
            Cáo Felix Đã Vượt Sông Thành Công!
          </h2>
          <p style={{ color: "var(--text-secondary)" }}>
            Bé nắm vững trật tự từ, trạng từ tần suất và câu mệnh lệnh cực đỉnh!
          </p>
          <div style={{ display: "inline-flex", gap: "0.5rem", margin: "1rem 0", color: "#f59e0b" }}>
            <Star size={24} fill="#f59e0b" color="#f59e0b" />
            <Star size={24} fill="#f59e0b" color="#f59e0b" />
            <Star size={24} fill="#f59e0b" color="#f59e0b" />
          </div>
          <div>
            <button className="kids-btn-primary" onClick={handleRestartAll} style={{ margin: "1rem auto 0 auto" }}>
              <IconRotate size={16} />
              <span>Chơi Lại Toàn Bộ</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

