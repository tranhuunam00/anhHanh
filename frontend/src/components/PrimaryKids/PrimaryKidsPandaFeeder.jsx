import React, { useState } from "react";
import { PANDA_FOOD_ITEMS, PANDA_QUANTIFIER_DRILLS } from "../../data/primaryKids/stage4QuizData.js";
import { playEnglishSpeech, getAnimalEncouragement } from "../../utils/primaryKidsUtils.js";
import { Star, IconRotate } from "../../constants/icons.js";

/**
 * Panda Feeder: Countable vs Uncountable & Quantifiers Game
 */
export const PrimaryKidsPandaFeeder = ({ onAwardStar }) => {
  const [mode, setMode] = useState("sorting"); // 'sorting' | 'quantifiers'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  const currentFood = PANDA_FOOD_ITEMS[currentIndex % PANDA_FOOD_ITEMS.length];
  const currentDrill = PANDA_QUANTIFIER_DRILLS[currentIndex % PANDA_QUANTIFIER_DRILLS.length];

  // Handle Countable / Uncountable Choice
  const handleSortChoice = (choice) => {
    if (isAnswered) return;
    setIsAnswered(true);

    const isCorrect = choice === currentFood.type;
    playEnglishSpeech(currentFood.name);

    if (isCorrect) {
      setScore((s) => s + 10);
      setFeedback({
        isCorrect: true,
        message: `Chính xác! ${currentFood.name} là danh từ ${currentFood.type === "countable" ? "Đếm được" : "Không đếm được"}! 🐼 Yum yum!`,
        hint: currentFood.hint
      });
      if (onAwardStar) onAwardStar(1);
    } else {
      setFeedback({
        isCorrect: false,
        message: `Chưa đúng rồi! ${currentFood.name} là danh từ ${currentFood.type === "countable" ? "Đếm được" : "Không đếm được"}.`,
        hint: currentFood.hint
      });
    }
  };

  // Handle Quantifier Multiple Choice
  const handleQuantifierChoice = (opt) => {
    if (isAnswered) return;
    setIsAnswered(true);

    const isCorrect = opt === currentDrill.correct;
    if (isCorrect) {
      setScore((s) => s + 10);
      setFeedback({
        isCorrect: true,
        message: `Tuyệt vời! "${opt}" là đáp án chính xác! ⭐`,
        hint: currentDrill.explanation
      });
      if (onAwardStar) onAwardStar(1);
    } else {
      setFeedback({
        isCorrect: false,
        message: `Chưa đúng! Đáp án đúng là "${currentDrill.correct}".`,
        hint: currentDrill.explanation
      });
    }
  };

  const handleNext = () => {
    setIsAnswered(false);
    setFeedback(null);
    const maxItems = mode === "sorting" ? PANDA_FOOD_ITEMS.length : PANDA_QUANTIFIER_DRILLS.length;
    if (currentIndex + 1 >= maxItems) {
      setGameFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleRestart = (newMode) => {
    if (newMode) setMode(newMode);
    setCurrentIndex(0);
    setScore(0);
    setFeedback(null);
    setIsAnswered(false);
    setGameFinished(false);
  };

  return (
    <div className="kids-game-box">
      <div className="kids-game-header">
        <h2>🐼 Bếp Ăn Của Gấu Trúc Bao • Thức Ăn & Lượng Từ</h2>
        <p>Bé hãy giúp Gấu Trúc Bao phân loại đồ ăn và chọn lượng từ chính xác nhé!</p>
      </div>

      {/* Mode Switcher */}
      <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <button
          className={`kids-btn-secondary ${mode === "sorting" ? "active" : ""}`}
          onClick={() => handleRestart("sorting")}
          style={mode === "sorting" ? { background: "var(--primary)", color: "#fff", borderColor: "var(--primary)" } : {}}
        >
          🍱 Vòng 1: Đếm được & Không đếm được ({PANDA_FOOD_ITEMS.length} món)
        </button>
        <button
          className={`kids-btn-secondary ${mode === "quantifiers" ? "active" : ""}`}
          onClick={() => handleRestart("quantifiers")}
          style={mode === "quantifiers" ? { background: "var(--primary)", color: "#fff", borderColor: "var(--primary)" } : {}}
        >
          🥣 Vòng 2: Đố vui Lượng từ ({PANDA_QUANTIFIER_DRILLS.length} câu)
        </button>
      </div>

      {!gameFinished ? (
        <>
          {mode === "sorting" ? (
            /* Mode 1: Food Sorting */
            <div className="kids-panda-stage">
              <div className="kids-panda-mascot-big" title="Gấu Trúc Bao đang đói bụng!">
                {feedback ? (feedback.isCorrect ? "🐼😋" : "🐼🤔") : "🐼🍲"}
              </div>

              <div className="kids-food-card-current">
                <div className="kids-food-icon-big">{currentFood.icon}</div>
                <div className="kids-food-title">{currentFood.name}</div>
                <div style={{ color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                  🇻🇳 {currentFood.nameVi}
                </div>
                <button
                  className="kids-sound-btn"
                  onClick={() => playEnglishSpeech(currentFood.name)}
                  style={{ margin: "0.5rem auto 0 auto" }}
                  title="Nghe phát âm"
                >
                  🔊 Nghe từ
                </button>
              </div>

              {/* Bins: Countable vs Uncountable */}
              <div className="kids-bins-row">
                <button
                  className="kids-bin-btn"
                  onClick={() => handleSortChoice("countable")}
                  disabled={isAnswered}
                  style={isAnswered && currentFood.type === "countable" ? { borderColor: "#10b981", background: "rgba(16, 185, 129, 0.1)" } : {}}
                >
                  <div className="kids-bin-title">🍎 Countable</div>
                  <div className="kids-bin-desc">Đếm được (1 apple, 2 eggs...)</div>
                </button>

                <button
                  className="kids-bin-btn"
                  onClick={() => handleSortChoice("uncountable")}
                  disabled={isAnswered}
                  style={isAnswered && currentFood.type === "uncountable" ? { borderColor: "#10b981", background: "rgba(16, 185, 129, 0.1)" } : {}}
                >
                  <div className="kids-bin-title">🍚 Uncountable</div>
                  <div className="kids-bin-desc">Không đếm được (rice, sugar, milk...)</div>
                </button>
              </div>
            </div>
          ) : (
            /* Mode 2: Quantifiers Drills */
            <div style={{ maxWidth: "650px", margin: "0 auto" }}>
              <div style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "1rem", textAlign: "center" }}>
                Câu {currentIndex + 1} / {PANDA_QUANTIFIER_DRILLS.length}:
                <div style={{ fontSize: "1.3rem", color: "var(--primary)", marginTop: "0.5rem" }}>
                  "{currentDrill.question}"
                </div>
              </div>

              <div className="kids-options-grid">
                {currentDrill.options.map((opt, i) => {
                  let cls = "kids-option-card";
                  if (isAnswered) {
                    if (opt === currentDrill.correct) cls += " correct";
                    else cls += " wrong";
                  }
                  return (
                    <div
                      key={i}
                      className={cls}
                      onClick={() => handleQuantifierChoice(opt)}
                    >
                      <span className="kids-option-letter">{String.fromCharCode(65 + i)}</span>
                      <span>{opt}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Feedback Area */}
          {feedback && (
            <div
              className="kids-feedback-box"
              style={{
                borderColor: feedback.isCorrect ? "#10b981" : "#ef4444",
                background: feedback.isCorrect ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.08)"
              }}
            >
              <span className="kids-feedback-avatar">
                {feedback.isCorrect ? "🐼⭐" : "🐼💡"}
              </span>
              <div>
                <strong>{feedback.message}</strong>
                {feedback.hint && (
                  <div style={{ fontSize: "0.85rem", marginTop: "0.25rem", color: "var(--text-secondary)" }}>
                    💡 <em>Ghi nhớ:</em> {feedback.hint}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="kids-action-row">
            <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>
              Điểm đạt được: <strong style={{ color: "#f59e0b" }}>{score} điểm</strong>
            </span>
            {isAnswered && (
              <button className="kids-btn-primary" onClick={handleNext}>
                <span>Câu Tiếp Theo ➜</span>
              </button>
            )}
          </div>
        </>
      ) : (
        /* Game Completed Screen */
        <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
          <div style={{ fontSize: "4.5rem", marginBottom: "0.5rem" }}>🎉🐼🏆</div>
          <h2 style={{ fontSize: "1.75rem", margin: "0 0 0.5rem 0" }}>
            Hoan Hô Bé! Gấu Trúc Bao No Căng Bụng Rồi!
          </h2>
          <p style={{ color: "var(--text-secondary)" }}>
            Bé đã hoàn thành xuất sắc thử thách thực phẩm và lượng từ Unit 4!
          </p>
          <div style={{ display: "inline-flex", gap: "0.5rem", margin: "1rem 0", fontSize: "1.3rem", color: "#f59e0b" }}>
            <Star size={24} fill="#f59e0b" color="#f59e0b" />
            <Star size={24} fill="#f59e0b" color="#f59e0b" />
            <Star size={24} fill="#f59e0b" color="#f59e0b" />
          </div>
          <div>
            <button className="kids-btn-primary" onClick={() => handleRestart()} style={{ margin: "1rem auto 0 auto" }}>
              <IconRotate size={16} />
              <span>Chơi Lại Vòng Này</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

