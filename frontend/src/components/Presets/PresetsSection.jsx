import React from "react";
import { PRESET_CARDS } from "../../constants/presets";
import { extractYouTubeId } from "../../utils/textNormalizer";

export const PresetsSection = ({ activeUrl, onSelectPreset, isLoading }) => {
  const activeId = extractYouTubeId(activeUrl);

  return (
    <section className="bottom-presets-section">
      <div className="presets-section-header">
        <div className="presets-header-title">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polygon points="10 8 16 12 10 16 10 8" />
          </svg>
          <span>Thử ngay – Luyện đa ngôn ngữ</span>
        </div>
        <span className="presets-header-subtitle">Nghe bất kỳ ngôn ngữ nào • Dịch sang bất kỳ ngôn ngữ nào</span>
      </div>

      <div className="presets-cards-grid">
        {PRESET_CARDS.map((card) => {
          const cardId = extractYouTubeId(card.url);
          const isActive = Boolean(activeId && cardId && activeId === cardId);
          return (
            <button
              key={card.id}
              className={`preset-card ${isActive ? "active" : ""}`}
              onClick={() => onSelectPreset(card)}
              disabled={isLoading}
              style={{
                pointerEvents: isLoading ? "none" : "",
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              <div className="preset-card-icon" style={{ fontSize: "1.4rem" }}>
                {card.icon}
              </div>
              <div className="preset-card-content">
                <div className="preset-card-title">{card.title}</div>
                <div className="preset-card-lang">{card.langLabel}</div>
                <div className="preset-card-meta">{card.meta}</div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
