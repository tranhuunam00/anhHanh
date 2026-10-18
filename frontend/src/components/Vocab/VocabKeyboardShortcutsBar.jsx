import React, { useState } from "react";
import { HelpCircle, ChevronUp, ChevronDown } from "../Icons";

/**
 * Compact keyboard shortcut guide bar for Vocabulary Notebook
 */
export const VocabKeyboardShortcutsBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="vocab-keyboard-shortcuts-bar">
      <div className="shortcuts-bar-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="shortcuts-bar-left">
          <HelpCircle size={14} color="var(--primary, #6366f1)" />
          <span className="shortcuts-bar-title">Phím tắt thao tác nhanh:</span>
          <div className="shortcuts-chips-preview">
            <span className="shortcut-chip"><kbd>←</kbd><kbd>→</kbd><kbd>↑</kbd><kbd>↓</kbd> Di chuyển</span>
            <span className="shortcut-chip"><kbd>Enter</kbd> Chi tiết</span>
            <span className="shortcut-chip"><kbd>Space</kbd>/<kbd>Ctrl</kbd> Phát âm</span>
            <span className="shortcut-chip"><kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> Đổi trạng thái</span>
          </div>
        </div>

        <button
          type="button"
          className="shortcuts-toggle-btn"
          aria-label={isExpanded ? "Thu gọn phím tắt" : "Mở rộng chi tiết phím tắt"}
          title={isExpanded ? "Thu gọn phím tắt" : "Xem tất cả phím tắt"}
        >
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {isExpanded && (
        <div className="shortcuts-bar-body">
          <div className="shortcuts-grid">
            <div className="shortcut-item">
              <span className="shortcut-keys"><kbd>←</kbd> <kbd>→</kbd> <kbd>↑</kbd> <kbd>↓</kbd></span>
              <span className="shortcut-desc">Di chuyển chọn thẻ từ vựng (tự lật trang ở mép)</span>
            </div>
            <div className="shortcut-item">
              <span className="shortcut-keys"><kbd>Enter</kbd></span>
              <span className="shortcut-desc">Mở cửa sổ chi tiết & chỉnh sửa từ vựng</span>
            </div>
            <div className="shortcut-item">
              <span className="shortcut-keys"><kbd>Space</kbd> hoặc <kbd>Ctrl</kbd></span>
              <span className="shortcut-desc">Nghe phát âm chuẩn (Audio)</span>
            </div>
            <div className="shortcut-item">
              <span className="shortcut-keys"><kbd>1</kbd></span>
              <span className="shortcut-desc">Chuyển sang <strong>Mới lưu</strong> (NEW)</span>
            </div>
            <div className="shortcut-item">
              <span className="shortcut-keys"><kbd>2</kbd></span>
              <span className="shortcut-desc">Chuyển sang <strong>Đang nhớ</strong> (LEARNING)</span>
            </div>
            <div className="shortcut-item">
              <span className="shortcut-keys"><kbd>3</kbd></span>
              <span className="shortcut-desc">Chuyển sang <strong>Đã thuộc</strong> (MASTERED)</span>
            </div>
            <div className="shortcut-item">
              <span className="shortcut-keys"><kbd>S</kbd></span>
              <span className="shortcut-desc">Chuyển đổi vòng tròn: Mới lưu ➔ Đang nhớ ➔ Đã thuộc</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
