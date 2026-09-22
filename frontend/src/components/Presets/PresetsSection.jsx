import React, { useState, useMemo } from "react";
import { PRESET_LANGUAGES, PRESET_LESSONS_BY_CATEGORY } from "../../constants/presets";
import { extractYouTubeId } from "../../utils/textNormalizer";

export const PresetsSection = React.memo(({ activeUrl, onSelectPreset, isLoading }) => {
  const [selectedLang, setSelectedLang] = useState("en");
  const [selectedSubcat, setSelectedSubcat] = useState("en_general");

  const activeId = extractYouTubeId(activeUrl);

  // Determine current active category key
  const activeCategoryKey = useMemo(() => {
    if (selectedLang === "en") {
      return selectedSubcat;
    }
    return selectedLang;
  }, [selectedLang, selectedSubcat]);

  const currentCategoryData = PRESET_LESSONS_BY_CATEGORY[activeCategoryKey] || PRESET_LESSONS_BY_CATEGORY.en_general;
  const currentLangObj = PRESET_LANGUAGES.find((l) => l.id === selectedLang) || PRESET_LANGUAGES[0];

  const handleLangChange = (lang) => {
    setSelectedLang(lang.id);
    if (lang.hasSubcategories && lang.subcategories?.length > 0) {
      setSelectedSubcat(lang.subcategories[0].id);
    } else {
      setSelectedSubcat(lang.defaultCategory || lang.id);
    }
  };

  return (
    <section className="bottom-presets-section">
      <div className="presets-section-header">
        <div className="presets-header-title">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polygon points="10 8 16 12 10 16 10 8" />
          </svg>
          <span>Thử ngay – Luyện đa ngôn ngữ</span>
          <span className="presets-header-badge">5 Cấp độ Dễ ➔ Khó</span>
        </div>
        <span className="presets-header-subtitle">
          Khám phá danh sách bài học tuyển chọn theo từng ngôn ngữ • Gọi video chuẩn có phụ đề để luyện ngay
        </span>
      </div>

      {/* Main Language Selector Tabs */}
      <div className="presets-lang-tabs" role="tablist">
        {PRESET_LANGUAGES.map((lang) => {
          const isLangActive = selectedLang === lang.id;
          return (
            <button
              key={lang.id}
              role="tab"
              aria-selected={isLangActive}
              className={`preset-lang-tab ${isLangActive ? "active" : ""}`}
              onClick={() => handleLangChange(lang)}
            >
              <span className="preset-lang-flag">{lang.flag}</span>
              <span className="preset-lang-name">{lang.name}</span>
            </button>
          );
        })}
      </div>

      {/* Subcategory Tabs (for English: General, TOEIC, IELTS) */}
      {currentLangObj.hasSubcategories && currentLangObj.subcategories && (
        <div className="presets-subcat-tabs" role="tablist">
          {currentLangObj.subcategories.map((sub) => {
            const isSubActive = selectedSubcat === sub.id;
            return (
              <button
                key={sub.id}
                role="tab"
                aria-selected={isSubActive}
                className={`preset-subcat-tab ${isSubActive ? "active" : ""}`}
                onClick={() => setSelectedSubcat(sub.id)}
              >
                <span className="preset-subcat-icon">{sub.icon}</span>
                <span className="preset-subcat-name">{sub.name}</span>
                <span className="preset-subcat-tag">{sub.tag}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Category Overview & Level Steps */}
      <div className="presets-level-overview">
        <div className="presets-category-info">
          <span className="presets-category-icon">{currentCategoryData.icon}</span>
          <span className="presets-category-desc">{currentCategoryData.desc}</span>
        </div>
        <div className="presets-level-stepper">
          <span className="step-tag step-1">1. Rất dễ</span>
          <span className="step-arrow">➔</span>
          <span className="step-tag step-2">2. Dễ</span>
          <span className="step-arrow">➔</span>
          <span className="step-tag step-3">3. Trung cấp</span>
          <span className="step-arrow">➔</span>
          <span className="step-tag step-4">4. Nâng cao</span>
          <span className="step-arrow">➔</span>
          <span className="step-tag step-5">5. Chuyên sâu</span>
        </div>
      </div>

      {/* Cards Grid: 5 lessons ranked from easy to hard */}
      <div className="presets-cards-grid">
        {currentCategoryData.lessons.map((lesson) => {
          const cardId = extractYouTubeId(lesson.url);
          const isActive = Boolean(activeId && cardId && activeId === cardId);

          return (
            <div
              key={lesson.id}
              className={`preset-card ${isActive ? "active" : ""}`}
              onClick={() => {
                if (!isLoading) {
                  onSelectPreset(lesson);
                }
              }}
              style={{
                pointerEvents: isLoading ? "none" : "",
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              {/* Level indicator chip */}
              <div className="preset-card-topbar">
                <div
                  className="preset-level-pill"
                  title={`Cấp ${lesson.levelNumber}: ${lesson.badge}`}
                  style={{
                    backgroundColor: `${lesson.diffColor}18`,
                    color: lesson.diffColor,
                    borderColor: `${lesson.diffColor}45`,
                  }}
                >
                  <span
                    className="preset-level-dot"
                    style={{ backgroundColor: lesson.diffColor }}
                  />
                  <span className="preset-level-text">Cấp {lesson.levelNumber}</span>
                </div>
                <span className="preset-card-duration">⏱️ {lesson.duration}</span>
              </div>

              {/* Title & summary */}
              <div className="preset-card-body">
                <div className="preset-card-title" title={lesson.title}>
                  {lesson.title}
                </div>
                <div className="preset-card-summary">
                  {lesson.summary}
                </div>
              </div>

              {/* Card footer */}
              <div className="preset-card-footer">
                <div className="preset-card-meta-left">
                  <span className="preset-card-channel">📺 {lesson.author}</span>
                  <span className="preset-card-lang-target">{lesson.langLabel}</span>
                </div>
                <button
                  className={`preset-card-action-btn ${isActive ? "btn-active" : ""}`}
                  disabled={isLoading}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPreset(lesson);
                  }}
                >
                  {isActive ? "Đang học" : "Luyện ngay ▶"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
});
