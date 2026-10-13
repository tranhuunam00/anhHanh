import React from "react";
import { IconPen, IconRotate } from "../Icons";

/**
 * Translation section allowing user to view and edit the translated meaning before saving.
 */
export const PopoverTranslationSection = ({
  loading = false,
  customMeaning = "",
  initialMeaning = "",
  onMeaningChange,
  onKeyDown,
  onResetMeaning,
  definition = null,
  textareaRef = null,
}) => {
  const isModified = Boolean(
    initialMeaning &&
    customMeaning.trim() !== initialMeaning.trim()
  );

  return (
    <div className="lookup-section lookup-translation-section">
      <div className="lookup-section-header">
        <span className="lookup-section-label">Bản dịch</span>
        {isModified && (
          <button
            type="button"
            className="lookup-reset-btn"
            onClick={onResetMeaning}
            title="Khôi phục lại bản dịch ban đầu"
          >
            <IconRotate size={10} />
            <span>Khôi phục</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="lookup-skeleton-line" style={{ width: "80%", height: "18px" }} />
      ) : (
        <div className="lookup-meaning-input-wrap">
          <textarea
            ref={textareaRef}
            rows={1}
            className="lookup-meaning-textarea"
            value={customMeaning}
            onChange={onMeaningChange}
            onKeyDown={onKeyDown}
            placeholder="Nhập nghĩa tiếng Việt..."
            title="Bấm để chỉnh sửa nghĩa. Nhấn Enter để lưu."
          />
        </div>
      )}

      {/* English definition (if available) */}
      {definition && !loading && (
        <div className="lookup-definition-text" title="English definition">
          {definition}
        </div>
      )}
    </div>
  );
};
