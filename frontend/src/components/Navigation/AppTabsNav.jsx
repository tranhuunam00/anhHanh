import React, { useCallback } from "react";
import { GraduationCap } from "../../constants/icons";
import { Users, Radio } from "../Icons";
import { getTabIdFromElement } from "../../utils/tabRouting";

/**
 * Main tab navigation bar. Hovering/focusing a tab preloads its code chunk
 * so the click feels instant.
 */
export function AppTabsNav({
  activeTab,
  isAdmin = false,
  onSelectTab,
  onSelectDictation,
  onOpenShortcuts,
  onOpenSettings,
  onPreloadTab,
}) {
  const handlePreloadIntent = useCallback(
    (event) => {
      if (!onPreloadTab) return;
      const tabId = getTabIdFromElement(event.target);
      if (tabId && tabId !== activeTab) onPreloadTab(tabId);
    },
    [onPreloadTab, activeTab]
  );

  return (
    <div className="tabs-header">
      <div className="tabs-nav-group" onPointerOver={handlePreloadIntent} onFocus={handlePreloadIntent}>
        <button
          className={`tab-btn ${activeTab === "tab-dictation" ? "active" : ""}`}
          data-tab="tab-dictation"
          aria-current={activeTab === "tab-dictation" ? "page" : undefined}
          onClick={onSelectDictation}
          title="Luyện chép chính tả (Dictation)"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          <span>Chép chính tả</span>
        </button>

        <button
          className={`tab-btn ${activeTab === "tab-transcript" ? "active" : ""}`}
          data-tab="tab-transcript"
          aria-current={activeTab === "tab-transcript" ? "page" : undefined}
          onClick={() => onSelectTab("tab-transcript")}
          title="Toàn bộ bài nghe & Transcript"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
          <span>Transcript</span>
        </button>

        <button
          className={`tab-btn ${activeTab === "tab-vocab" ? "active" : ""}`}
          data-tab="tab-vocab"
          aria-current={activeTab === "tab-vocab" ? "page" : undefined}
          onClick={() => onSelectTab("tab-vocab")}
          title="Sổ tay từ vựng cá nhân"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <span>Sổ từ vựng</span>
        </button>

        <button
          className={`tab-btn ${activeTab === "tab-reader" ? "active" : ""}`}
          data-tab="tab-reader"
          aria-current={activeTab === "tab-reader" ? "page" : undefined}
          onClick={() => onSelectTab("tab-reader")}
          style={activeTab === "tab-reader" ? { borderColor: "#10b981" } : {}}
          title="Đọc báo song ngữ & Ôn từ"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
            <path d="M18 14h-8" />
            <path d="M15 18h-5" />
            <path d="M10 6h8v4h-8V6Z" />
          </svg>
          <span>Đọc báo</span>
        </button>

        <button
          className={`tab-btn ${activeTab === "tab-writing" ? "active" : ""}`}
          data-tab="tab-writing"
          aria-current={activeTab === "tab-writing" ? "page" : undefined}
          onClick={() => onSelectTab("tab-writing")}
          style={activeTab === "tab-writing" ? { borderColor: "#8b5cf6" } : {}}
          title="Luyện viết tiếng Anh AI (Writing Studio - Chuẩn IELTS)"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19l7-7 3 3-7 7-3-3z" />
            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
            <path d="M2 2l7.586 7.586" />
            <circle cx="11" cy="11" r="2" />
          </svg>
          <span>Luyện viết AI</span>
        </button>

        <button
          className={`tab-btn ${activeTab === "tab-destination-b2" ? "active" : ""}`}
          data-tab="tab-destination-b2"
          aria-current={activeTab === "tab-destination-b2" ? "page" : undefined}
          onClick={() => onSelectTab("tab-destination-b2")}
          style={activeTab === "tab-destination-b2" ? { borderColor: "#6366f1" } : {}}
          title="Destination B2: Grammar & Vocabulary (Unit 1 & 2)"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            <path d="M12 6v10" />
          </svg>
          <span>Destination B2</span>
        </button>

        <button
          className={`tab-btn ${activeTab === "tab-visual-vocab" ? "active" : ""}`}
          data-tab="tab-visual-vocab"
          aria-current={activeTab === "tab-visual-vocab" ? "page" : undefined}
          onClick={() => onSelectTab("tab-visual-vocab")}
          style={activeTab === "tab-visual-vocab" ? { borderColor: "#6366f1" } : {}}
          title="Học từ vựng qua sơ đồ tranh minh họa trực quan (Visual Diagram)"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </svg>
          <span>Sơ đồ từ vựng</span>
        </button>

        <button
          className={`tab-btn ${activeTab === "tab-ielts-test" ? "active" : ""}`}
          data-tab="tab-ielts-test"
          aria-current={activeTab === "tab-ielts-test" ? "page" : undefined}
          onClick={() => onSelectTab("tab-ielts-test")}
          style={activeTab === "tab-ielts-test" ? { borderColor: "#f59e0b" } : {}}
          title="Đề Thi Thật IELTS (Cambridge IELTS 21 - Test 2)"
        >
          <GraduationCap className="tab-btn-icon" />
          <span>Đề thi thật IELTS</span>
        </button>

        <button
          className={`tab-btn ${activeTab === "tab-buddy" ? "active" : ""}`}
          data-tab="tab-buddy"
          aria-current={activeTab === "tab-buddy" ? "page" : undefined}
          onClick={() => onSelectTab("tab-buddy")}
          style={activeTab === "tab-buddy" ? { borderColor: "#10b981" } : {}}
          title="Tìm bạn học quanh đây (Định vị GPS thực tế)"
        >
          <Users size={16} />
          <span>Bạn học quanh đây</span>
        </button>

        <button
          className={`tab-btn ${activeTab === "tab-tiktok-live" ? "active" : ""}`}
          data-tab="tab-tiktok-live"
          aria-current={activeTab === "tab-tiktok-live" ? "page" : undefined}
          onClick={() => onSelectTab("tab-tiktok-live")}
          style={activeTab === "tab-tiktok-live" ? { borderColor: "#ef4444" } : {}}
          title="Phòng học tương tác TikTok LIVE (OBS & TikTok Live Studio)"
        >
          <Radio size={16} color="#ef4444" />
          <span>TikTok Live</span>
          <span style={{ background: "#ef4444", color: "#ffffff", fontSize: "0.68rem", fontWeight: 800, padding: "1px 5px", borderRadius: "4px", marginLeft: "4px" }}>HOT</span>
        </button>


        <button
          className={`tab-btn ${activeTab === "tab-root-words" ? "active" : ""}`}
          data-tab="tab-root-words"
          aria-current={activeTab === "tab-root-words" ? "page" : undefined}
          onClick={() => onSelectTab("tab-root-words")}
          style={activeTab === "tab-root-words" ? { borderColor: "#2563eb" } : {}}
          title="100 Gốc Từ Tiếng Anh (Word Roots & Morphemes)"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 3v6m0 6v6M3 12h6m6 0h6" />
            <circle cx="12" cy="3" r="1" />
            <circle cx="12" cy="21" r="1" />
            <circle cx="3" cy="12" r="1" />
            <circle cx="21" cy="12" r="1" />
          </svg>
          <span>100 Gốc từ</span>
        </button>

        <button
          className={`tab-btn ${activeTab === "tab-history" ? "active" : ""}`}
          data-tab="tab-history"
          aria-current={activeTab === "tab-history" ? "page" : undefined}
          onClick={() => onSelectTab("tab-history")}
          title="Lịch sử học tập & tiến độ"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>Lịch sử</span>
        </button>

        <button
          className={`tab-btn ${activeTab === "tab-audio-studio" ? "active" : ""}`}
          data-tab="tab-audio-studio"
          aria-current={activeTab === "tab-audio-studio" ? "page" : undefined}
          onClick={() => onSelectTab("tab-audio-studio")}
          style={activeTab === "tab-audio-studio" ? { borderColor: "#0284c7" } : {}}
          title="Audio & Phân tích nối âm AI"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
          </svg>
          <span>Audio AI</span>
        </button>

        {(isAdmin || activeTab === "tab-admin") && (
          <button
            className={`tab-btn ${activeTab === "tab-admin" ? "active" : ""}`}
            data-tab="tab-admin"
            aria-current={activeTab === "tab-admin" ? "page" : undefined}
            onClick={() => onSelectTab("tab-admin")}
            style={{ borderColor: "#38bdf8" }}
            title="Quản trị hệ thống"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            <span>Quản trị</span>
          </button>
        )}
      </div>

      <div className="tabs-actions-group">
        <button
          className="tab-action-btn"
          onClick={() => onOpenShortcuts()}
          title="Bảng phím tắt nhanh"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M6 8h.001M10 8h.001M14 8h.001M18 8h.001M8 12h.001M12 12h.001M16 12h.001M6 16h12" />
          </svg>
          <span>Phím tắt</span>
        </button>

        <button
          className="tab-action-btn"
          onClick={() => onOpenSettings()}
          title="Cài đặt hệ thống & giao diện"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <span>Cài đặt</span>
        </button>
      </div>
    </div>
  );
}
