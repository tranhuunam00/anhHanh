import React, { useState, useRef, useEffect } from "react";
import {
  BookOpen,
  Search,
  Zap,
  Sparkles,
  ChevronDown,
  HelpCircle,
  Plus,
  Download,
  FileSpreadsheet,
  Layers,
} from "../Icons";
import { exportVocabToCSV, exportVocabToAnki } from "../../utils/vocabExporter";

/**
 * Top toolbar for Vocabulary Notebook: Title, Search, Filter pills, and Action buttons
 */
export const VocabToolbar = ({
  total = 0,
  searchQuery = "",
  onSearchChange,
  filterStatus = "ALL",
  onFilterChange,
  onOpenGuide,
  onOpenAdd,
  onOpenBatchImport,
  onOpenAIImport,
  onOpenPractice,
  onOpenThemeExplorer,
  items = [],
  showToast,
}) => {
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const exportMenuRef = useRef(null);

  // Close export dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target)) {
        setIsExportMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="vocab-header-bar">
      <div className="vocab-title-wrap">
        <BookOpen size={22} color="var(--primary, #6366f1)" />
        <h2 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary, #0f172a)" }}>
          Sổ Tay Từ Vựng Thông Minh
        </h2>
        <span style={{ fontSize: "0.85rem", color: "var(--text-muted, #64748b)" }}>
          ({total} từ đã lưu)
        </span>
      </div>

      <div className="vocab-toolbar-container">
        {/* Search Box */}
        <div className="vocab-search-wrap">
          <Search size={15} className="vocab-search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm từ hoặc nghĩa..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="vocab-search-input"
          />
        </div>

        {/* Filter Pills */}
        <div className="vocab-filter-group">
          {[
            { key: "ALL", label: "Tất cả", color: null },
            { key: "NEW", label: "Mới lưu", color: "#ef4444" },
            { key: "LEARNING", label: "Đang học", color: "#f59e0b" },
            { key: "MASTERED", label: "Đã thuộc", color: "#10b981" },
          ].map((f) => (
            <button
              key={f.key}
              type="button"
              className={`vocab-filter-btn ${filterStatus === f.key ? "active" : ""}`}
              onClick={() => onFilterChange(f.key)}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              {f.color && (
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: f.color,
                    display: "inline-block",
                  }}
                />
              )}
              {f.label}
            </button>
          ))}
        </div>

        {/* Action Buttons Group */}
        <div className="vocab-actions-group">
          {onOpenGuide && (
            <button
              type="button"
              className="btn btn-secondary btn-with-icon vocab-action-btn vocab-guide-btn"
              onClick={onOpenGuide}
              title="Xem hướng dẫn cách lưu từ & phím tắt"
            >
              <HelpCircle size={14} color="var(--primary, #6366f1)" />
              <span>Hướng dẫn</span>
            </button>
          )}

          {/* Manual Add Word Button */}
          <button
            type="button"
            className="btn btn-primary btn-with-icon vocab-action-btn vocab-add-btn"
            onClick={onOpenAdd}
            title="Thêm từ mới thủ công vào Sổ tay"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>Thêm từ mới</span>
          </button>

          {/* Batch / Bulk Text Import from Excel/TSV Button */}
          {onOpenBatchImport && (
            <button
              type="button"
              className="btn btn-primary btn-with-icon vocab-action-btn vocab-batch-import-btn"
              onClick={onOpenBatchImport}
              title="Nhập hàng loạt từ vựng dạng bảng (Excel / Google Sheets / TSV)"
            >
              <FileSpreadsheet size={14} />
              <span>Import từ vựng</span>
            </button>
          )}

          {/* AI Extract & Import Vocabulary Button */}
          <button
            type="button"
            className="btn btn-primary btn-with-icon vocab-action-btn vocab-ai-import-btn"
            onClick={onOpenAIImport}
            title="AI Tự động trích xuất & chèn từ vựng từ tệp PDF/Word hoặc văn bản"
          >
            <Sparkles size={14} />
            <span>AI Tách & Import</span>
          </button>

          {/* Practice Vocabulary Button */}
          <button
            type="button"
            className="btn btn-primary btn-with-icon vocab-action-btn vocab-practice-btn"
            onClick={onOpenPractice}
            title="Luyện tập từ vựng chuẩn Dạng 1: Từ vựng ➔ Nghĩa tiếng Việt"
          >
            <Zap size={14} fill="currentColor" />
            <span>Luyện tập từ vựng</span>
          </button>

          {/* Theme Vocab Explorer Button */}
          <button
            type="button"
            className="btn btn-primary btn-with-icon vocab-action-btn vocab-theme-btn"
            onClick={onOpenThemeExplorer}
            title="Khám phá và thêm từ vựng theo 30 chủ đề (Tiếng Anh & Tiếng Pháp)"
          >
            <Layers size={14} />
            <span>Từ vựng theo chủ đề</span>
          </button>

          {/* Export Dropdown Menu */}
          <div className="vocab-export-container" ref={exportMenuRef}>
            <button
              type="button"
              className="btn btn-secondary btn-with-icon vocab-action-btn vocab-export-btn"
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              title="Xuất file từ vựng"
            >
              <Download size={14} />
              <span>Xuất từ vựng</span>
              <ChevronDown size={13} />
            </button>

            {isExportMenuOpen && (
              <div className="vocab-export-menu">
                <button
                  type="button"
                  className="vocab-export-item"
                  onClick={() => {
                    setIsExportMenuOpen(false);
                    const ok = exportVocabToCSV(items);
                    if (ok && showToast) showToast("Đã tải xuống file Excel/CSV thành công!", "success");
                    else if (showToast) showToast("Chưa có từ vựng nào để xuất", "warning");
                  }}
                >
                  <FileSpreadsheet size={16} color="#10b981" />
                  <div>
                    <div>Xuất file Excel / CSV</div>
                    <small style={{ color: "var(--text-muted, #64748b)", fontSize: "0.72rem" }}>UTF-8 hiển thị tiếng Việt chuẩn</small>
                  </div>
                </button>

                <button
                  type="button"
                  className="vocab-export-item"
                  onClick={() => {
                    setIsExportMenuOpen(false);
                    const ok = exportVocabToAnki(items);
                    if (ok && showToast) showToast("Đã tải xuống file Anki Deck thành công!", "success");
                    else if (showToast) showToast("Chưa có từ vựng nào để xuất", "warning");
                  }}
                >
                  <Layers size={16} color="#6366f1" />
                  <div>
                    <div>Xuất Anki Deck (.txt)</div>
                    <small style={{ color: "var(--text-muted, #64748b)", fontSize: "0.72rem" }}>Nhập 1 chạm vào Anki Flashcards</small>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
