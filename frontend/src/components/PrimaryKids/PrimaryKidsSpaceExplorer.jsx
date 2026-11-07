import React, { useState } from "react";
import { SPACE_PLANET_DRILLS } from "../../data/primaryKids/stage4QuizData.js";
import { playEnglishSpeech } from "../../utils/primaryKidsUtils.js";
import { Star, IconRotate } from "../../constants/icons.js";

/**
 * Leo the Lion Space Explorer: 8 Solar System Planets & Comparatives
 */
export const PrimaryKidsSpaceExplorer = ({ onAwardStar }) => {
  const [activePlanetIdx, setActivePlanetIdx] = useState(0);
  const [answeredState, setAnsweredState] = useState({});
  const [score, setScore] = useState(0);

  const currentPlanet = SPACE_PLANET_DRILLS[activePlanetIdx];
  const isCurrentAnswered = !!answeredState[currentPlanet.id];

  const handleSelectPlanet = (idx) => {
    setActivePlanetIdx(idx);
    playEnglishSpeech(SPACE_PLANET_DRILLS[idx].planet);
  };

  const handleAnswer = (option) => {
    if (isCurrentAnswered) return;
    const isCorrect = option === currentPlanet.correct;

    setAnsweredState((prev) => ({
      ...prev,
      [currentPlanet.id]: {
        selected: option,
        isCorrect
      }
    }));

    if (isCorrect) {
      setScore((s) => s + 15);
      playEnglishSpeech(currentPlanet.correct);
      if (onAwardStar) onAwardStar(1);
    }
  };

  const answeredCount = Object.keys(answeredState).length;
  const isAllExplored = answeredCount === SPACE_PLANET_DRILLS.length;

  const handleRestart = () => {
    setAnsweredState({});
    setActivePlanetIdx(0);
    setScore(0);
  };

  return (
    <div className="kids-game-box">
      <div className="kids-game-header">
        <h2>🦁 Phi Hành Gia Sư Tử Leo • 8 Hành Tinh & So Sánh</h2>
        <p>Bé hãy cùng Sư Tử Leo du hành thám hiểm 8 hành tinh trong Hệ Mặt trời và trả lời các câu hỏi so sánh nhé!</p>
      </div>

      {/* Orbit Track of 8 Planets */}
      <div className="kids-planets-track">
        {SPACE_PLANET_DRILLS.map((p, idx) => {
          const isSelected = idx === activePlanetIdx;
          const status = answeredState[p.id];
          return (
            <div
              key={p.id}
              className={`kids-planet-pill ${isSelected ? "active" : ""}`}
              onClick={() => handleSelectPlanet(idx)}
              style={isSelected ? { borderColor: p.color } : {}}
            >
              <span className="kids-planet-icon">{p.icon}</span>
              <div>
                <strong style={{ fontSize: "0.95rem", display: "block" }}>{p.planet}</strong>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                  {status ? (status.isCorrect ? "⭐ Hoàn thành" : "❌ Thử lại") : `Hành tinh số ${p.distanceOrder}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Current Planet Mission Card */}
      <div style={{ maxWidth: "680px", margin: "0 auto", background: "var(--bg-secondary)", padding: "1.5rem", borderRadius: "1.25rem", border: "2px solid var(--border-color)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "3rem" }}>{currentPlanet.icon}</span>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.4rem" }}>
                {currentPlanet.planet} ({currentPlanet.planetVi})
              </h3>
              <p style={{ margin: "0.2rem 0 0 0", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                Vị trí số {currentPlanet.distanceOrder} tính từ Mặt trời
              </p>
            </div>
          </div>

          <button
            className="kids-sound-btn"
            onClick={() => playEnglishSpeech(currentPlanet.planet)}
            title="Nghe phát âm hành tinh"
            style={{ padding: "0.5rem 0.85rem", gap: "0.35rem" }}
          >
            🔊 Nghe tên
          </button>
        </div>

        {/* Fact Card */}
        <div style={{ background: "var(--bg-card)", padding: "0.85rem 1rem", borderRadius: "0.75rem", marginBottom: "1.25rem", borderLeft: `4px solid ${currentPlanet.color}` }}>
          <strong>🚀 Khám phá vũ trụ:</strong>
          <div style={{ fontStyle: "italic", marginTop: "0.25rem", fontSize: "0.9rem" }}>
            "{currentPlanet.fact}"
          </div>
        </div>

        {/* Challenge Question */}
        <div style={{ marginBottom: "1rem" }}>
          <strong style={{ fontSize: "1.05rem", color: "var(--text-primary)" }}>
            ❓ Câu hỏi thử thách: "{currentPlanet.question}"
          </strong>
        </div>

        <div className="kids-options-grid">
          {currentPlanet.options.map((opt, i) => {
            const ans = answeredState[currentPlanet.id];
            let cls = "kids-option-card";
            if (ans) {
              if (opt === currentPlanet.correct) cls += " correct";
              else if (opt === ans.selected) cls += " wrong";
            }
            return (
              <div
                key={i}
                className={cls}
                onClick={() => handleAnswer(opt)}
              >
                <span className="kids-option-letter">{String.fromCharCode(65 + i)}</span>
                <span>{opt}</span>
              </div>
            );
          })}
        </div>

        {/* Feedback Alert */}
        {isCurrentAnswered && (
          <div
            className="kids-feedback-box"
            style={{
              borderColor: answeredState[currentPlanet.id].isCorrect ? "#10b981" : "#ef4444",
              background: answeredState[currentPlanet.id].isCorrect ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.08)"
            }}
          >
            <span className="kids-feedback-avatar">
              {answeredState[currentPlanet.id].isCorrect ? "🦁🚀" : "🦁💡"}
            </span>
            <div>
              <strong>
                {answeredState[currentPlanet.id].isCorrect
                  ? `Chính xác! Sư Tử Leo đã cắm cờ phi hành gia trên ${currentPlanet.planet}!`
                  : `Chưa đúng! Đáp án chính xác là "${currentPlanet.correct}".`}
              </strong>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="kids-action-row">
          <span style={{ fontWeight: 600 }}>
            Đã khám phá: <strong style={{ color: "#eab308" }}>{answeredCount} / {SPACE_PLANET_DRILLS.length}</strong> hành tinh
          </span>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {activePlanetIdx + 1 < SPACE_PLANET_DRILLS.length && (
              <button
                className="kids-btn-primary"
                onClick={() => handleSelectPlanet(activePlanetIdx + 1)}
              >
                <span>Hành Tinh Tiếp Theo ➔</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {isAllExplored && (
        <div style={{ textAlign: "center", marginTop: "2rem", padding: "1.5rem", background: "var(--bg-secondary)", borderRadius: "1rem" }}>
          <div style={{ fontSize: "3.5rem" }}>🌌🦁🥇</div>
          <h3>Chúc Mừng Phi Hành Gia Nhí! Bé Đã Hoàn Thành Toàn Bộ 8 Hành Tinh!</h3>
          <p style={{ color: "var(--text-secondary)" }}>
            Tổng điểm thám hiểm vũ trụ: <strong>{score} điểm</strong>
          </p>
          <button className="kids-btn-primary" onClick={handleRestart} style={{ margin: "0 auto" }}>
            <IconRotate size={16} />
            <span>Thám Hiểm Lại Từ Đầu</span>
          </button>
        </div>
      )}
    </div>
  );
};

