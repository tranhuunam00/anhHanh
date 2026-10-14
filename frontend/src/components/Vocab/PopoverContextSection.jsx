import React, { useState } from "react";
import { IconPen, IconRotate, IconCheckCircle } from "../Icons";
import { highlightWordInSentence } from "../../utils/wordLookupUtils";

/**
 * Context Sentence section allowing user to view and edit the context sentence before saving/updating.
 * Renders as a sleek, keyword-highlighted quote by default, and switches to inline edit on demand.
 */
export const PopoverContextSection = ({
  loading = false,
  cleanWord = "",
  customContext = "",
  initialContext = "",
  savedContext = "",
  onContextChange,
  onKeyDown,
  onResetContext,
  onSaveContext,
  isSaved = false,
  isSaving = false,
  isEditing: controlledIsEditing = undefined,
  onToggleEdit = null,
  contextTranslation = "",
  textareaRef = null,
}) => {
  const [internalIsEditing, setInternalIsEditing] = useState(false);
  const isEditing = controlledIsEditing !== undefined ? controlledIsEditing : internalIsEditing;
  const setIsEditing = (val) => {
    if (onToggleEdit) {
      onToggleEdit(val);
    } else {
      setInternalIsEditing(val);
    }
  };

  const isModified = Boolean(
    (initialContext && customContext.trim() !== initialContext.trim()) ||
    (savedContext && customContext.trim() !== savedContext.trim())
  );

  const segments = highlightWordInSentence(customContext, cleanWord);

  const handleToggleEdit = async () => {
    if (isEditing) {
      setIsEditing(false);
      if (onSaveContext) {
        await onSaveContext();
      }
    } else {
      setIsEditing(true);
    }
  };

  return (
    <div className="lookup-section lookup-context-section">
      <div className="lookup-section-header">
        <span className="lookup-section-label">Ngữ cảnh</span>

        <div className="lookup-context-actions">
          {isModified && (
            <button
              type="button"
              className="lookup-reset-btn"
              onClick={onResetContext}
              title="Khôi phục lại câu ngữ cảnh ban đầu"
              disabled={isSaving}
            >
              <IconRotate size={10} />
              <span>Khôi phục</span>
            </button>
          )}

          <button
            type="button"
            className={`lookup-edit-toggle-btn ${isEditing ? "active" : ""}`}
            onClick={handleToggleEdit}
            disabled={isSaving}
            title={isEditing ? (isSaved ? "Lưu ngữ cảnh vào Sổ tay" : "Xong chỉnh sửa") : "Chỉnh sửa câu ngữ cảnh"}
          >
            {isEditing ? (
              <>
                <IconCheckCircle size={11} />
                <span>{isSaving ? "Đang lưu..." : "Xong"}</span>
              </>
            ) : (
              <>
                <IconPen size={10} />
                <span>Sửa</span>
              </>
            )}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="lookup-skeleton-line" style={{ width: "95%", height: "20px" }} />
      ) : isEditing ? (
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
            autoFocus
          />
        </div>
      ) : customContext ? (
        <div
          className="lookup-context-quote"
          onClick={() => setIsEditing(true)}
          title="Bấm để chỉnh sửa câu ngữ cảnh"
        >
          {segments.map((seg, idx) =>
            seg.isMatch ? (
              <mark key={idx} className="lookup-context-highlight">
                {seg.text}
              </mark>
            ) : (
              <span key={idx}>{seg.text}</span>
            )
          )}
        </div>
      ) : (
        <div
          className="lookup-context-empty"
          onClick={() => setIsEditing(true)}
          title="Bấm để thêm câu ngữ cảnh"
        >
          + Thêm ngữ cảnh ví dụ...
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

