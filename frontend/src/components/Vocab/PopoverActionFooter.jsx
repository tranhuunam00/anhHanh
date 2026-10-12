import React from "react";
import { IconSparkles, IconBookmark, IconCheckCircle } from "../Icons";

/**
 * Action footer for WordLookupPopover with save, update, and status cycle interactions.
 */
export const PopoverActionFooter = ({
  isSaved = false,
  hasChanges = false,
  isSaving = false,
  loading = false,
  customMeaning = "",
  statusConfig = null,
  onCycleStatus,
  onUpdateSavedVocab,
  onSaveToNotebook,
}) => {
  return (
    <div className="lookup-action-footer">
      {isSaved && !hasChanges ? (
        <div className="lookup-saved-bar">
          <div className="saved-indicator-group">
            <IconBookmark size={16} className="text-emerald-500" />
            <span className="saved-text">Đã có trong Sổ tay</span>
            {statusConfig && (
              <span
                className="saved-status-tag"
                style={{ color: statusConfig.color, background: statusConfig.bg }}
                onClick={onCycleStatus}
                title="Bấm để đổi trạng thái học"
              >
                {statusConfig.label} ↻
              </span>
            )}
          </div>
        </div>
      ) : isSaved && hasChanges ? (
        <button
          type="button"
          className="lookup-save-btn lookup-update-btn"
          onClick={onUpdateSavedVocab}
          disabled={isSaving || loading || !customMeaning.trim()}
          title="Lưu các thay đổi đã chỉnh sửa vào Sổ tay"
        >
          <IconCheckCircle size={14} />
          <span>{isSaving ? "Đang lưu..." : "Cập nhật vào Sổ tay"}</span>
        </button>
      ) : (
        <button
          type="button"
          className="lookup-save-btn"
          onClick={onSaveToNotebook}
          disabled={isSaving || loading}
        >
          <IconSparkles size={14} />
          <span>{isSaving ? "Đang lưu..." : "Lưu vào Sổ tay"}</span>
        </button>
      )}
    </div>
  );
};
