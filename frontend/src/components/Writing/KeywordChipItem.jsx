import React, { useState, useEffect } from "react";
import { Check, Plus, Info } from "../Icons";
import { fetchWordTranslation } from "../../services/authVocabService";

/**
 * Component hiển thị 1 chip Từ / Cụm từ theo chủ đề
 * - Bấm vào thân chip: Chèn từ vào bài viết
 * - Bấm vào ⓘ: Hiển thị nghĩa tiếng Việt & giải thích trọng số (tự tra cứu nếu chưa có)
 * - Bấm vào +: Thêm từ vựng vào sổ từ vựng kèm nghĩa tiếng Việt
 */
export function KeywordChipItem({
  kw,
  isUsed,
  onInsertKeyword,
  onAddVocab,
  token,
  showToast,
  isTooltipOpen,
  onToggleTooltip,
}) {
  const [vietnameseMeaning, setVietnameseMeaning] = useState(kw.meaning || "");
  const [isLoadingMeaning, setIsLoadingMeaning] = useState(false);
  const [isSavedLocally, setIsSavedLocally] = useState(kw.isSaved || false);

  // Tự động tra nghĩa tiếng Việt khi người dùng mở tooltip ⓘ mà chưa có nghĩa
  useEffect(() => {
    if (isTooltipOpen && !vietnameseMeaning && !isLoadingMeaning) {
      setIsLoadingMeaning(true);
      fetchWordTranslation(kw.word, "vi", token)
        .then((trans) => {
          if (trans && trans.toLowerCase() !== kw.word.toLowerCase()) {
            setVietnameseMeaning(trans);
          } else {
            setVietnameseMeaning("Thuật ngữ / Cụm từ học thuật chủ đề");
          }
        })
        .catch(() => {
          setVietnameseMeaning("Thuật ngữ / Cụm từ học thuật chủ đề");
        })
        .finally(() => {
          setIsLoadingMeaning(false);
        });
    }
  }, [isTooltipOpen, vietnameseMeaning, kw.word, token, isLoadingMeaning]);

  // Xác định nhãn badge và màu sắc
  let badgeText = "Đề bài";
  let badgeClass = "badge-prompt";

  if (kw.status === "NEW") {
    badgeText = "Từ mới";
    badgeClass = "badge-new";
  } else if (kw.isOverdue) {
    badgeText = "Cần ôn";
    badgeClass = "badge-overdue";
  } else if (kw.status === "LEARNING") {
    badgeText = "Đang học";
    badgeClass = "badge-learning";
  } else if (kw.status === "MASTERED") {
    badgeText = "Đã thuộc";
    badgeClass = "badge-mastered";
  } else if (kw.kind === "collocation") {
    badgeText = "Collocation";
    badgeClass = "badge-collocation";
  }

  const handleChipClick = () => {
    if (onInsertKeyword) {
      onInsertKeyword(kw.word);
    }
  };

  const handleSaveToNotebook = async (e) => {
    e.stopPropagation();
    if (isSavedLocally) {
      if (showToast) showToast(`Từ "${kw.word}" đã có trong sổ từ vựng!`, "info");
      return;
    }

    let finalMeaning = vietnameseMeaning || kw.meaning || "";
    if (!finalMeaning) {
      try {
        finalMeaning = await fetchWordTranslation(kw.word, "vi", token);
      } catch {
        finalMeaning = "Từ vựng theo chủ đề bài viết";
      }
    }

    if (onAddVocab) {
      onAddVocab({
        word: kw.word,
        meaning: finalMeaning || "Từ vựng theo chủ đề bài viết",
        phonetic: kw.phonetic || "",
        context_sentence: kw.context || "",
      });
      setIsSavedLocally(true);
    }
  };

  return (
    <div
      className={`keyword-chip-v2 ${isUsed ? "is-used" : ""} ${
        isSavedLocally ? "is-saved" : ""
      }`}
      onClick={handleChipClick}
      title="Nhấp để chèn từ khóa vào vị trí con trỏ trong bài viết"
    >
      {/* Checkmark khi đã dùng trong bài viết */}
      {isUsed && (
        <span className="chip-used-icon" title="Đã dùng trong bài viết">
          <Check size={11} strokeWidth={2.8} />
        </span>
      )}

      {/* Text từ khóa */}
      <span className="chip-word-text">{kw.word}</span>

      {/* Badge Band */}
      {kw.band && (
        <span
          className="chip-status-tag badge-word-band"
          title={`Cấp độ Band khuyến nghị: ${kw.band}`}
        >
          {kw.band}
        </span>
      )}

      {/* Badge trạng thái */}
      <span className={`chip-status-tag ${badgeClass}`}>{badgeText}</span>

      {/* Badge điểm trọng số */}
      {kw.weightScore && (
        <span
          className="chip-weight-score"
          title={`Trọng số từ mới: ${kw.weightScore} điểm`}
        >
          {kw.weightScore}đ
        </span>
      )}

      {/* Nút + thêm vào sổ từ vựng */}
      <button
        type="button"
        className={`chip-action-btn chip-save-btn ${isSavedLocally ? "is-already-saved" : ""}`}
        onClick={handleSaveToNotebook}
        title={isSavedLocally ? "Đã lưu trong Sổ từ vựng" : "Thêm vào sổ từ vựng (+)"}
      >
        {isSavedLocally ? <Check size={11} color="var(--success)" /> : <Plus size={11} />}
      </button>

      {/* Info Button xem nghĩa & chi tiết */}
      <button
        type="button"
        className={`chip-action-btn chip-info-btn ${isTooltipOpen ? "active" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleTooltip();
        }}
        title="Xem giải thích nghĩa tiếng Việt & trọng số"
      >
        <Info size={11} />
      </button>

      {/* Popover Tooltip khi click info */}
      {isTooltipOpen && (
        <div
          className="keyword-chip-popover"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="popover-header">
            <strong>{kw.word}</strong>
            {kw.band && <span className="popover-band-tag">{kw.band}</span>}
            {kw.phonetic && <span className="popover-phonetic">/{kw.phonetic}/</span>}
          </div>

          <div className="popover-meaning">
            <span className="popover-label">Nghĩa tiếng Việt:</span>
            {isLoadingMeaning ? (
              <span className="meaning-loading">Đang tra nghĩa tiếng Việt...</span>
            ) : (
              <strong className="meaning-highlight">
                {vietnameseMeaning || "Thuật ngữ học thuật theo chủ đề"}
              </strong>
            )}
          </div>

          {kw.weightScore && (
            <div className="popover-weight-info">
              <span>
                Trọng số ưu tiên: <strong>{kw.weightScore}/100đ</strong>
              </span>
              {kw.reasons && kw.reasons.length > 0 && (
                <div className="popover-reasons">
                  {kw.reasons.map((r, rIdx) => (
                    <span key={rIdx} className="reason-pill">{r}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="popover-tip">
            💡 Nhấp vào thẻ để tự động chèn vào bài viết. Bấm <strong>+</strong> để lưu vào sổ từ vựng.
          </div>
        </div>
      )}
    </div>
  );
}
