import React, { useState } from "react";
import { Search, Link2, Copy, Check, RotateCw, Mail, Users, X } from "../Icons";
import { StudyBuddyCard } from "./StudyBuddyCard";
import { searchStudyBuddies } from "../../services/studyBuddyService";
import { generateBuddyShareLink, sanitizeBuddiesList } from "../../utils/studyBuddyUtils";

/**
 * StudyBuddySearchPanel - Molecule Component
 * Chức năng tìm kiếm bạn học bằng Email hoặc Link chia sẻ (Invite Link),
 * đồng thời cung cấp công cụ sao chép link mời kết bạn cá nhân.
 */
export const StudyBuddySearchPanel = ({
  token,
  currentUser,
  onSendRequest,
  onRespond,
  onUnfriend,
  processingId,
  showToast,
  initialQuery = "",
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const shareLink = generateBuddyShareLink(currentUser?.id);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;

    // If user pasted a full URL with ?buddy_invite=xyz
    let cleanQuery = q;
    try {
      if (q.includes("?")) {
        const urlObj = new URL(q.startsWith("http") ? q : `http://localhost/${q}`);
        cleanQuery = urlObj.searchParams.get("buddy_invite") || urlObj.searchParams.get("invite") || q;
      }
    } catch {
      cleanQuery = q;
    }

    setIsSearching(true);
    setHasSearched(true);
    try {
      const res = await searchStudyBuddies(token, cleanQuery);
      if (res?.ok && Array.isArray(res.results)) {
        setResults(sanitizeBuddiesList(res.results));
      } else {
        setResults([]);
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleCopyLink = () => {
    if (!shareLink) return;
    navigator.clipboard.writeText(shareLink).then(() => {
      setCopiedLink(true);
      if (showToast) showToast("Đã sao chép link mời kết bạn vào bộ nhớ tạm!", "success");
      setTimeout(() => setCopiedLink(false), 2500);
    }).catch(() => {
      if (showToast) showToast("Không thể sao chép tự động. Vui lòng copy thủ công.", "warning");
    });
  };

  return (
    <div className="buddy-search-panel-container">
      {/* 1. Share Invite Link Card */}
      <div className="buddy-share-invite-card">
        <div className="buddy-share-header">
          <div className="buddy-share-icon">
            <Link2 size={18} />
          </div>
          <div>
            <h4 className="buddy-share-title">Link Mời Kết Bạn Của Bạn</h4>
            <p className="buddy-share-sub">
              Gửi liên kết này cho bạn bè qua Zalo, Messenger hoặc Email để kết nối học tập 1 chạm.
            </p>
          </div>
        </div>

        <div className="buddy-share-input-row">
          <input
            type="text"
            readOnly
            value={shareLink || "Đang tạo liên kết..."}
            className="buddy-share-readonly-input"
            onClick={(e) => e.target.select()}
          />
          <button
            type="button"
            className="btn-copy-invite-link"
            onClick={handleCopyLink}
            title="Sao chép liên kết"
          >
            {copiedLink ? (
              <>
                <Check size={14} className="text-emerald-500" />
                <span>Đã chép!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Sao chép link</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Search by Email or Link Input Form */}
      <div className="buddy-email-search-section">
        <div className="buddy-search-form-header">
          <Mail size={16} className="text-primary inline mr-1" />
          <span>Tìm Kiếm Bạn Học Bằng Email Hoặc Mã Mời</span>
        </div>

        <form onSubmit={handleSearch} className="buddy-email-search-form">
          <div className="buddy-email-input-wrap">
            <Search size={15} className="buddy-email-search-icon" />
            <input
              type="text"
              placeholder="Nhập địa chỉ email chính xác hoặc dán link mời kết bạn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="buddy-email-real-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="btn-clear-search"
                onClick={() => {
                  setSearchQuery("");
                  setResults([]);
                  setHasSearched(false);
                }}
              >
                <X size={13} />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="btn-submit-email-search"
            disabled={isSearching || !searchQuery.trim()}
          >
            {isSearching ? <RotateCw size={14} className="spin" /> : <Search size={14} />}
            <span>{isSearching ? "Đang tìm..." : "Tìm bạn"}</span>
          </button>
        </form>
      </div>

      {/* 3. Search Results */}
      <div className="buddy-search-results-area">
        {isSearching ? (
          <div className="study-buddy-loading-row">
            <RotateCw size={22} className="spin text-primary" />
            <span>Đang tra cứu người dùng...</span>
          </div>
        ) : hasSearched && results.length === 0 ? (
          <div className="study-buddy-empty-card">
            <Users size={32} className="empty-icon text-muted" />
            <h4>Không tìm thấy người dùng phù hợp</h4>
            <p>Vui lòng kiểm tra lại email hoặc liên kết mời bạn vừa nhập.</p>
          </div>
        ) : results.length > 0 ? (
          <div>
            <div className="buddy-results-count-tag">
              Tìm thấy <strong>{results.length}</strong> kết quả phù hợp:
            </div>
            <div className="study-buddy-grid">
              {results.map((item) => (
                <StudyBuddyCard
                  key={item.id}
                  buddy={item}
                  onSendRequest={onSendRequest}
                  onRespond={onRespond}
                  onUnfriend={onUnfriend}
                  isProcessing={processingId === item.id}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default StudyBuddySearchPanel;

