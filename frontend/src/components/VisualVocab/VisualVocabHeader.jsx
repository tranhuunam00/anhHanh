import React from "react";
import {
  Compass,
  Search,
  Eye,
  EyeOff,
  Target,
  Sparkles,
  Pencil,
  Book,
} from "../Icons";

export const VisualVocabHeader = ({
  topics = [],
  currentTopicId,
  onSelectTopic,
  activeMode = "EXPLORE", // "EXPLORE" | "SPOT_TAP" | "MATCH" | "SPELL"
  onChangeMode,
  currentLang = "en",
  onChangeLang,
  languages = [],
  searchQuery = "",
  onSearchChange,
  showLabels = true,
  onToggleLabels,
  completedCount = 0,
  totalCount = 0,
}) => {
  return (
    <div className="vv-header">
      {/* Row 1: Title, Icon & Topic Selector Pills */}
      <div className="vv-header-main">
        <div className="vv-title-group">
          <div className="vv-title-icon-badge">
            <Compass size={24} />
          </div>
          <div className="vv-title-text">
            <h2>
              Sơ Đồ Từ Vựng Hình Ảnh
              <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--primary)", background: "rgba(99, 102, 241, 0.1)", padding: "2px 8px", borderRadius: "6px" }}>
                Interactive Diagram
              </span>
            </h2>
            <p>Học từ vựng trực quan theo ngữ cảnh không gian qua tranh minh họa</p>
          </div>
        </div>

        {/* Topic Selector Tabs */}
        <div className="vv-topic-selector">
          {topics.map((t) => {
            const isSelected = t.id === currentTopicId;
            return (
              <button
                key={t.id}
                className={`vv-topic-pill ${isSelected ? "active" : ""}`}
                onClick={() => onSelectTopic(t.id)}
                type="button"
              >
                <span>{t.id === "mountain_landforms" ? "🏔️" : "🎓"}</span>
                <span>{t.title}</span>
                <span className="vv-badge">{t.items?.length || 0} từ</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 2: Sub-toolbar with Modes, Language, Search, and Display toggles */}
      <div className="vv-subtoolbar">
        {/* Mode Selector */}
        <div className="vv-mode-tabs">
          <button
            type="button"
            className={`vv-mode-btn ${activeMode === "EXPLORE" ? "active" : ""}`}
            onClick={() => onChangeMode("EXPLORE")}
            title="Khám phá tự do & Nghe phát âm"
          >
            <Book size={15} />
            <span>Khám Phá</span>
          </button>
          <button
            type="button"
            className={`vv-mode-btn ${activeMode === "SPOT_TAP" ? "active" : ""}`}
            onClick={() => onChangeMode("SPOT_TAP")}
            title="Thử thách: Tìm đúng vị trí trên ảnh"
          >
            <Target size={15} />
            <span>Chỉ Điểm</span>
          </button>
          <button
            type="button"
            className={`vv-mode-btn ${activeMode === "MATCH" ? "active" : ""}`}
            onClick={() => onChangeMode("MATCH")}
            title="Luyện tập: Nối nhãn từ vựng"
          >
            <Sparkles size={15} />
            <span>Nối Nhãn</span>
          </button>
          <button
            type="button"
            className={`vv-mode-btn ${activeMode === "SPELL" ? "active" : ""}`}
            onClick={() => onChangeMode("SPELL")}
            title="Gõ từ chính xác theo vị trí"
          >
            <Pencil size={15} />
            <span>Gõ Từ</span>
          </button>
        </div>

        {/* Language Selector: English, French, Chinese */}
        {languages && languages.length > 0 && (
          <div className="vv-lang-tabs" role="radiogroup" aria-label="Chọn ngôn ngữ học">
            {languages.map((l) => (
              <button
                key={l.code}
                type="button"
                className={`vv-lang-btn ${currentLang === l.code ? "active" : ""}`}
                onClick={() => onChangeLang && onChangeLang(l.code)}
                title={`Học từ vựng bằng ${l.label}`}
              >
                <span>{l.flag}</span>
                <span>{l.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Tools: Search + Toggle Labels */}
        <div className="vv-tools-group">
          <div className="vv-search-box">
            <Search size={14} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Tìm từ hoặc nghĩa..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <button
            type="button"
            className={`vv-toggle-labels-btn ${showLabels ? "active" : ""}`}
            onClick={onToggleLabels}
            title={showLabels ? "Ẩn nhãn từ trên ảnh" : "Hiện nhãn từ trên ảnh"}
          >
            {showLabels ? <Eye size={14} /> : <EyeOff size={14} />}
            <span>{showLabels ? "Hiện nhãn" : "Ẩn nhãn"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
