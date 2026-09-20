import React, { useState, useEffect, useRef } from "react";
import {
  Link2,
  Play,
  BookOpen,
  Shield,
  LogOut,
  LogIn,
  MessageSquarePlus,
  Sun,
  Moon,
  ArrowRight,
  Globe,
  Settings,
} from "lucide-react";
import { SOURCE_LANGUAGES, TARGET_LANGUAGES } from "../../constants/languages";
import { useAuth } from "../../context/AuthContext";

export const Header = React.memo(({
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
  onOpenAuth,
  onOpenVocabTab,
  onOpenFeedback,
  onOpenAdminTab,
}) => {

  const { user, isAuthenticated, unlearnedWords, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (urlInput && !isLoading) {
      onLoadLesson(urlInput);
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header className="app-header">
      <div className="header-inner">
        <a href="/" className="brand" onClick={(e) => e.preventDefault()}>
          <img
            src="/linguagun_logo.jpg"
            alt="ShotLang Logo"
            style={{ width: "30px", height: "30px", borderRadius: "7px", objectFit: "cover", boxShadow: "0 0 8px rgba(37, 99, 235, 0.35)" }}
          />
          <span style={{ fontSize: "1.25rem", fontWeight: 800, letterSpacing: "-0.3px" }}>Shot<strong style={{ color: "var(--primary)" }}>Lang</strong></span>
        </a>

        {/* URL Input Form */}
        <form className="url-input-form" onSubmit={handleSubmit}>
          <div className="url-input-container">
            <Link2 className="input-url-icon" size={17} strokeWidth={2.2} />
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
            <div className="lang-select-wrapper" title="Ngôn ngữ bài nghe">
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
                      ? `Tự động (${autoDetectedLang.toUpperCase()})`
                      : lang.label}
                  </option>
                ))}
              </select>
            </div>

            <ArrowRight size={14} className="lang-arrow-icon" style={{ color: "var(--text-muted, #94a3b8)", flexShrink: 0 }} />

            <div className="lang-select-wrapper" title="Ngôn ngữ dịch">
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
                <Play size={16} fill="currentColor" />
                <span>Tải bài tập</span>
              </>
            )}
          </button>
        </form>

        {/* Unlearned Vocab Badge */}
        <div
          className="header-streak-badge header-vocab-badge"
          title="Số từ vựng chưa học xong trong Sổ tay (Nhấp để mở Sổ tay)"
          onClick={() => onOpenVocabTab && onOpenVocabTab()}
          style={{ cursor: "pointer", userSelect: "none" }}
        >
          <BookOpen size={15} color="#6366f1" />
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <strong style={{ color: "#6366f1", fontWeight: 700 }}>{unlearnedWords}</strong> từ chưa học xong
          </span>
        </div>

        {/* User Auth Container */}
        <div ref={menuRef} style={{ display: "flex", alignItems: "center" }}>
          {isAuthenticated ? (
            <div className="user-profile-menu">
              <button
                className="user-avatar-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen((prev) => !prev);
                }}
              >
                {user.avatar_url ? (
                  <img src={user.avatar_url} className="user-avatar-img" alt={user.name} />
                ) : (
                  <div className="user-avatar-img">
                    {(user.name || user.email || "U").charAt(0).toUpperCase()}
                  </div>
                )}
                <span>{user.name || user.email}</span>
                {user.role === "ADMIN" && (
                  <small style={{ color: "#0284c7", fontWeight: 700 }}>★ ADMIN</small>
                )}
              </button>

              {isMenuOpen && (
                <div className="user-dropdown-menu show">
                  <div style={{ padding: "8px 16px", fontSize: "0.75rem", color: "#64748b", borderBottom: "1px solid #f1f5f9" }}>
                    {user.email}
                  </div>
                  <div
                    className="user-dropdown-item"
                    style={{ display: "flex", alignItems: "center", gap: "8px" }}
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenVocabTab && onOpenVocabTab();
                    }}
                  >
                    <BookOpen size={15} color="#6366f1" />
                    <span>Sổ tay từ vựng</span>
                  </div>
                  {user.role === "ADMIN" && (
                    <div
                      className="user-dropdown-item"
                      style={{ color: "#0284c7", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}
                      onClick={() => {
                        setIsMenuOpen(false);
                        onOpenAdminTab && onOpenAdminTab();
                      }}
                    >
                      <Shield size={15} color="#0284c7" />
                      <span>Bảng Quản trị</span>
                    </div>
                  )}
                  <div className="user-dropdown-divider"></div>
                  <div
                    className="user-dropdown-item"
                    style={{ color: "#dc2626", display: "flex", alignItems: "center", gap: "8px" }}
                    onClick={() => {
                      setIsMenuOpen(false);
                      logout();
                    }}
                  >
                    <LogOut size={15} color="#dc2626" />
                    <span>Đăng xuất</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              className="btn btn-primary btn-with-icon"
              onClick={onOpenAuth}
              style={{ padding: "6px 14px", fontSize: "0.85rem" }}
            >
              <LogIn size={15} />
              <span>Đăng nhập / Đăng ký</span>
            </button>
          )}
        </div>

        {/* Feedback Button */}
        <button
          className="btn btn-secondary btn-icon-text"
          onClick={onOpenFeedback}
          title="Gửi góp ý & báo lỗi"
          style={{ padding: "6px 12px", fontSize: "0.85rem" }}
        >
          <MessageSquarePlus size={15} />
          <span>Góp ý</span>
        </button>

        {/* Theme Toggle */}
        <button
          className="btn btn-secondary btn-icon-text"
          onClick={onToggleTheme}
          title="Chuyển chế độ Sáng / Tối"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          <span>{theme === "dark" ? "Sáng" : "Tối"}</span>
        </button>
      </div>
    </header>
  );
});


