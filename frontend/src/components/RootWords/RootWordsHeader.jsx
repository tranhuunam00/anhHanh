import React, { useRef, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, Sparkles, RefreshCw } from "../Icons";
import { ROOT_CATEGORIES } from "../../data/rootWords";

/**
 * Thanh điều hướng, bộ lọc thể loại, tìm kiếm & thanh tiến độ cho 100 Gốc từ
 */
export const RootWordsHeader = ({
  searchQuery,
  onSearchChange,
  activeCategory,
  onSelectCategory,
  categoryStats,
  progress,
  onPrevRoot,
  onNextRoot,
  onRandomRoot,
  currentRootIndex,
  totalRootsCount,
}) => {
  const activePillRef = useRef(null);

  useEffect(() => {
    if (activePillRef.current) {
      activePillRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeCategory]);
  return (
    <div className="root-words-header-container">
      {/* Top Banner: Tiêu đề & Tiến độ tổng thể */}
      <div className="root-header-top-row">
        <div className="root-header-title-group">
          <div className="root-badge-tag">
            <Sparkles size={14} className="tag-sparkle" />
            <span>Chuyên đề Từ vựng Cốt lõi</span>
          </div>
          <h1 className="root-header-main-title">100 Gốc Từ Tiếng Anh (Word Roots)</h1>
          <p className="root-header-desc">
            Hiểu rõ bản chất ngữ nghĩa thông qua tiền tố, gốc từ Latin - Hy Lạp & bài tập thực hành phản xạ
          </p>
        </div>

        {/* Thống kê tiến độ học viên */}
        <div className="root-header-progress-box">
          <div className="progress-info-row">
            <span className="progress-label">Tiến độ 100 Gốc:</span>
            <strong className="progress-numbers">
              {progress.completedCount}/{progress.totalCount} ({progress.percentage}%)
            </strong>
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Middle Controls Row: Tìm kiếm & Điều hướng Next/Prev */}
      <div className="root-controls-row">
        {/* Ô tìm kiếm */}
        <div className="root-search-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="root-search-input"
            placeholder="Tìm theo gốc (spect, dict...), nghĩa tiếng Việt hoặc từ..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              className="btn-clear-search"
              onClick={() => onSearchChange("")}
              type="button"
              title="Xóa tìm kiếm"
            >
              ✕
            </button>
          )}
        </div>

        {/* Nút điều hướng Next, Prev, Ngẫu nhiên */}
        <div className="root-nav-buttons-group">
          <button
            className="btn-root-nav"
            onClick={onPrevRoot}
            title="Gốc từ trước đó (Phím tắt: mũi tên trái)"
            type="button"
          >
            <ChevronLeft size={16} />
            <span>Gốc trước</span>
          </button>

          <span className="root-index-pill">
            Gốc {currentRootIndex + 1}/{totalRootsCount}
          </span>

          <button
            className="btn-root-nav"
            onClick={onNextRoot}
            title="Gốc từ tiếp theo (Phím tắt: mũi tên phải)"
            type="button"
          >
            <span>Gốc tiếp</span>
            <ChevronRight size={16} />
          </button>

          <button
            className="btn-root-random"
            onClick={onRandomRoot}
            title="Học ngẫu nhiên 1 gốc từ"
            type="button"
          >
            <RefreshCw size={14} />
            <span>Ngẫu nhiên</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills Bar */}
      <div className="root-categories-wrapper">
        <div className="root-categories-scroll-bar">
          {ROOT_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            const count = cat.id === "all" ? 100 : (categoryStats[cat.id] || 0);

            return (
              <button
                key={cat.id}
                ref={isActive ? activePillRef : null}
                className={`cat-pill-btn ${isActive ? "active" : ""}`}
                onClick={() => onSelectCategory(cat.id)}
                type="button"
              >
                <span>{cat.label}</span>
                <span className="cat-count-badge">{count}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
