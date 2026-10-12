import React from "react";
import { IconPen, IconRotate } from "../Icons";

/**
 * Context Sentence section allowing user to view and edit the context sentence before saving/updating.
 */
export const PopoverContextSection = ({
  loading = false,
  customContext = "",
  initialContext = "",
  onContextChange,
  onKeyDown,
  onResetContext,
  contextTranslation = "",
  textareaRef = null,
}) => {
  const isModified = Boolean(
    initialContext &&
    customContext.trim() !== initialContext.trim()
  );

  return (
    <div className="lookup-section lookup-context-section">
      <div className="lookup-section-header">
        <div className="lookup-section-title-wrap">
          <span className="lookup-section-title">Context</span>
          <span className="lookup-edit-badge" title="Bạn có thể chỉnh sửa câu ngữ cảnh trước khi lưu">
            <IconPen size={10} />
            <span>sửa ngữ cảnh</span>
          </span>
        </div>
        {isModified && (
          <button
            type="button"
            className="lookup-reset-btn"
            onClick={onResetContext}
            title="Khôi phục lại câu ngữ cảnh ban đầu"
          >
            <IconRotate size={11} />
            <span>Khôi phục</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="lookup-skeleton-line" style={{ width: "95%", height: "22px" }} />
      ) : (
        <div className="lookup-context-input-wrap">
          <textarea
            ref={textareaRef}
            rows={2}
            className="lookup-context-textarea"
            value={customContext}
            onChange={onContextChange}
            onKeyDown={onKeyDown}
            placeholder="Nhập hoặc chỉnh sửa câu ngữ cảnh chứa từ..."
            title="Câu ngữ cảnh chứa từ vựng. Nhấn Enter để lưu."
          />
        </div>
      )}

      {contextTranslation && !loading && (
        <div className="lookup-context-translation" title="Bản dịch của câu ngữ cảnh">
          {contextTranslation}
        </div>
      )}
    </div>
  );
};
