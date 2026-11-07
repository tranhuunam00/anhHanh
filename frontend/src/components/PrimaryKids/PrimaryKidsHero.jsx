import React from "react";
import { STAGE4_MASCOTS, STAGE4_ALL_UNITS } from "../../data/primaryKids/stage4Data.js";
import { Star } from "../../constants/icons.js";

/**
 * Primary Kids Safari Hero Banner & Unit Selector
 */
export const PrimaryKidsHero = ({
  activeUnitId = 1,
  onSelectUnit,
  activeMascotId = "fox",
  onSelectMascot,
  totalStars = 0,
  streak = 0
}) => {
  const currentMascot = STAGE4_MASCOTS.find((m) => m.id === activeMascotId) || STAGE4_MASCOTS[0];

  return (
    <div className="kids-hero-banner">
      {/* Top Banner with Logo & Stats */}
      <div className="kids-hero-top">
        <div className="kids-title-group">
          <div className="kids-main-logo">🦁</div>
          <div className="kids-title-text">
            <h1>
              Tiểu Học Safari • Global English 4
              <span style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--primary)" }}>
                (Stage 4)
              </span>
            </h1>
            <p>
              Ôn tập Cuối học kì 1 (End of Term Test 1) • Cùng các bạn thú cưng chinh phục tiếng Anh!
            </p>
          </div>
        </div>

        {/* Gamified Stars & Streak Counter */}
        <div className="kids-stats-pill">
          <div className="kids-star-badge" title="Tổng số sao đạt được">
            <Star size={18} fill="#f59e0b" color="#f59e0b" />
            <span>{totalStars} Sao</span>
          </div>
          <div className="kids-streak-badge" title="Chuỗi chiến thắng liên tiếp">
            <span>🔥 {streak} Chuỗi</span>
          </div>
        </div>
      </div>

      {/* Animal Companions Mascots Strip */}
      <div className="kids-mascots-strip">
        {STAGE4_MASCOTS.map((m) => {
          const isSelected = m.id === activeMascotId;
          return (
            <button
              key={m.id}
              className={`kids-mascot-chip ${isSelected ? "active" : ""}`}
              onClick={() => onSelectMascot(m.id)}
              style={isSelected ? { borderColor: m.color } : {}}
            >
              <span className="kids-mascot-avatar">{m.avatar}</span>
              <span>{m.name}</span>
            </button>
          );
        })}
      </div>

      {/* Mascot Speech Bubble */}
      <div className="kids-feedback-box" style={{ marginTop: 0 }}>
        <span className="kids-feedback-avatar">{currentMascot.avatar}</span>
        <div>
          <strong style={{ color: currentMascot.color }}>{currentMascot.name}</strong> ({currentMascot.role}):
          <div style={{ fontStyle: "italic", marginTop: "0.2rem" }}>"{currentMascot.quote}"</div>
        </div>
      </div>

      {/* 4 Units Selection Cards */}
      <div className="kids-unit-tabs">
        {STAGE4_ALL_UNITS.map((unit) => {
          const isSelected = unit.id === activeUnitId;
          return (
            <div
              key={unit.id}
              className={`kids-unit-card ${isSelected ? "active" : ""}`}
              onClick={() => onSelectUnit(unit.id)}
            >
              <div className="kids-unit-icon">{unit.icon}</div>
              <div className="kids-unit-info">
                <h4>{unit.unitNumber}: {unit.title}</h4>
                <p>{unit.titleVi}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

