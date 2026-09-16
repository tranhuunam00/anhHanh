import React from "react";
import { SOURCE_LANGUAGES, TARGET_LANGUAGES } from "../../constants/languages";

export const Header = ({
  urlInput,
  setUrlInput,
  sourceLang,
  setSourceLang,
  targetLang,
  setTargetLang,
  autoDetectedLang,
  isLoading,
  onLoadLesson,
  theme,
  onToggleTheme,
  onOpenSettings,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (urlInput && !isLoading) {
      onLoadLesson(urlInput);
    }
  };

  return (
    <header className="app-header">
      <div className="header-inner">
        <a href="/" className="brand" onClick={(e) => e.preventDefault()}>
          <svg className="brand-icon" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
            <path d="M9 13v2a3 3 0 0 0 6 0v-2" />
          </svg>
          <span>DailyDictation <strong>Studio</strong></span>
        </a>

        {/* URL Input Form */}
        <form className="url-input-form" onSubmit={handleSubmit}>
          <div className="url-input-container">
            <svg className="input-url-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            <input
              type="text"
              className="url-input"
              placeholder="Dán link YouTube (ví dụ: https://www.youtube.com/watch?v=qe9QSCF-d88)..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Language Selector Group */}
          <div className="lang-selector-group" title="Chọn ngôn ngữ bài nghe và ngôn ngữ dịch">
            <div className="lang-select-wrapper">
              <span className="lang-select-label">Nghe:</span>
              <select
                className="header-lang-select"
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                disabled={isLoading}
              >
                {SOURCE_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.code === "auto" && autoDetectedLang
                      ? `🌐 Tự động phát hiện (${autoDetectedLang.toUpperCase()})`
                      : lang.label}
                  </option>
                ))}
              </select>
            </div>

            <span className="lang-arrow">➔</span>

            <div className="lang-select-wrapper">
              <span className="lang-select-label">Dịch:</span>
              <select
                className="header-lang-select"
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                disabled={isLoading}
              >
                {TARGET_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-with-icon" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner-sm"></span>
                <span>Đang tải...</span>
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span>Tải bài tập</span>
              </>
            )}
          </button>
        </form>

        {/* Theme Toggle */}
        <button
          className="btn btn-secondary btn-icon-text"
          onClick={onToggleTheme}
          title="Chuyển chế độ Sáng / Tối"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {theme === "dark" ? (
              <circle cx="12" cy="12" r="5" />
            ) : (
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            )}
          </svg>
          <span>{theme === "dark" ? "Sáng" : "Tối"}</span>
        </button>
      </div>
    </header>
  );
};
