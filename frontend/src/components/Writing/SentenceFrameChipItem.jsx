import React, { useState } from "react";
import { Check, Plus, Info } from "../Icons";

/**
 * Component hiển thị 1 chip Dạng câu theo chủ đề (Sentence Pattern / Frame)
 * - Bấm vào thân chip: Chèn khung câu vào bài viết tại vị trí con trỏ
 * - Bấm vào ⓘ: Hiển thị giải thích nghĩa tiếng Việt & cách áp dụng
 * - Bấm vào +: Thêm mẫu câu vào sổ từ vựng / ghi chú
 */
export function SentenceFrameChipItem({
  item,
  isUsed,
  onInsertSentence,
  onAddVocab,
  showToast,
  isTooltipOpen,
  onToggleTooltip,
}) {
  const [isSavedLocally, setIsSavedLocally] = useState(false);

  const phraseText = item.phrase || item.template || "";

  const handleChipClick = () => {
    if (onInsertSentence) {
      onInsertSentence(item.template || phraseText);
    }
  };

  const handleSaveToNotebook = (e) => {
    e.stopPropagation();
    if (isSavedLocally) {
      if (showToast) showToast(`Mẫu câu "${phraseText.slice(0, 30)}..." đã có trong sổ!`, "info");
      return;
    }

    if (onAddVocab) {
      onAddVocab({
        word: phraseText,
        meaning: item.meaning || "Khung cấu trúc câu học thuật theo chủ đề",
        context_sentence: item.usage || "Mẫu câu luận điểm chuẩn Band 7.5 - 8.5",
      });
      setIsSavedLocally(true);
      if (showToast) {
        showToast(`Đã lưu mẫu câu vào Sổ tay từ vựng!`, "success");
      }
    }
  };

  // Render các phần của câu, làm nổi bật chỗ trống `[...]`
  const renderHighlightedPhrase = (text) => {
    if (!text) return "";
    const parts = text.split(/(\[.*?\])/g);
    return parts.map((part, pIdx) => {
      if (part.startsWith("[") && part.endsWith("]")) {
        return (
          <span key={pIdx} className="sentence-slot-highlight">
            {part}
          </span>
        );
      }
      return <span key={pIdx}>{part}</span>;
    });
  };

  return (
    <div
      className={`keyword-chip-v2 sentence-chip-v2 ${isUsed ? "is-used" : ""} ${
        isSavedLocally ? "is-saved" : ""
      }`}
      onClick={handleChipClick}
      title="Nhấp để chèn khung câu vào vị trí con trỏ trong bài viết"
    >
      {/* Checkmark khi đã dùng trong bài viết */}
      {isUsed && (
        <span className="chip-used-icon" title="Đã dùng câu này trong bài viết">
          <Check size={11} strokeWidth={2.8} />
        </span>
      )}

      {/* Text khung câu */}
      <span className="chip-word-text chip-sentence-text">
        {renderHighlightedPhrase(phraseText)}
      </span>

      {/* Badge Band / Category */}
      {item.band && (
        <span className="chip-status-tag badge-sentence-band">
          {item.band}
        </span>
      )}

      {/* Nút + thêm vào sổ từ vựng */}
      <button
        type="button"
        className={`chip-action-btn chip-save-btn ${isSavedLocally ? "is-already-saved" : ""}`}
        onClick={handleSaveToNotebook}
        title={isSavedLocally ? "Đã lưu trong Sổ từ vựng" : "Thêm mẫu câu vào sổ (+)"}
      >
        {isSavedLocally ? <Check size={11} color="var(--success)" /> : <Plus size={11} />}
      </button>

      {/* Info Button xem nghĩa tiếng Việt & cách dùng */}
      <button
        type="button"
        className={`chip-action-btn chip-info-btn ${isTooltipOpen ? "active" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleTooltip();
        }}
        title="Xem giải thích nghĩa tiếng Việt & hướng dẫn sử dụng"
      >
        <Info size={11} />
      </button>

      {/* Popover Tooltip khi click info */}
      {isTooltipOpen && (
        <div
          className="keyword-chip-popover sentence-popover"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="popover-header">
            <strong>Mẫu câu:</strong>
            <span className="popover-sentence-full">{phraseText}</span>
          </div>

          <div className="popover-meaning">
            <span className="popover-label">Nghĩa tiếng Việt:</span>
            <strong className="meaning-highlight">
              {item.meaning || "Cấu trúc câu biểu đạt luận điểm học thuật"}
            </strong>
          </div>

          {item.usage && (
            <div className="popover-usage">
              <span className="popover-label">Cách áp dụng:</span>
              <span>{item.usage}</span>
            </div>
          )}

          <div className="popover-tip">
            💡 Nhấp vào khung câu để chèn vào bài viết. Bấm <strong>+</strong> để lưu vào sổ tay.
          </div>
        </div>
      )}
    </div>
  );
}
