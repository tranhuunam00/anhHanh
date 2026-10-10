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
    <div className="lookup-section">
      <div className="lookup-section-header">
        <div className="lookup-section-title-wrap">
          <span className="lookup-section-title">Translation</span>
          <span className="lookup-edit-badge" title="Bạn có thể chỉnh sửa trực tiếp nghĩa này trước khi lưu">
            <IconPen size={10} />
            <span>sửa nghĩa</span>
          </span>
        </div>
        {isModified && (
          <button
            type="button"
            className="lookup-reset-btn"
            onClick={onResetMeaning}
            title="Khôi phục lại bản dịch ban đầu"
          >
            <IconRotate size={11} />
            <span>Khôi phục</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="lookup-skeleton-line" style={{ width: "85%", height: "20px" }} />
      ) : (
        <div className="lookup-meaning-input-wrap">
          <textarea
            ref={textareaRef}
            rows={2}
            className="lookup-meaning-textarea"
            value={customMeaning}
            onChange={onMeaningChange}
            onKeyDown={onKeyDown}
            placeholder="Nhập hoặc chỉnh sửa bản dịch tiếng Việt..."
            title="Bạn có thể chỉnh sửa bản dịch này trước khi lưu. Nhấn Enter để lưu."
          />
        </div>
      )}

      {/* English definition (if available) for deeper learning */}
      {definition && !loading && (
        <div className="lookup-definition-text" title="English definition">
          {definition}
        </div>
      )}
    </div>
  );
};
