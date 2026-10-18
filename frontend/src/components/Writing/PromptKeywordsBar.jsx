import React, { useState, useMemo } from "react";
import {
  Check,
  Plus,
  BookmarkPlus,
  Info,
  Sparkles,
  BookOpen,
} from "../Icons";
import {
  rankKeywordsByNewWordWeight,
  calculateKeywordUsageStats,
} from "../../utils/keywordWeightUtils";

/**
 * Component hiển thị gợi ý từ khóa dựa trên trọng số từ mới
 * - Tính điểm trọng số (weightScore) theo độ mới, Spaced Repetition (SRS), và mức độ liên quan đề bài.
 * - Live check xem học viên đã áp dụng từ khóa vào bài viết (essayText) chưa.
 * - Hỗ trợ Click để chèn nhanh từ khóa vào bài viết.
 * - Tooltip xem chi tiết nghĩa, phiên âm và điểm trọng số.
 * - 1-Click lưu từ khóa vào Sổ từ vựng nếu chưa có.
 */
export function PromptKeywordsBar({
  currentPrompt,
  essayText = "",
  savedVocabMap = {},
  onInsertKeyword,
  onAddVocab,
  showToast,
}) {
  const [includeNotebookVocab, setIncludeNotebookVocab] = useState(true);
  const [activeTooltipWord, setActiveTooltipWord] = useState(null);

  // 1. Tính toán danh sách từ khóa theo trọng số từ mới
  const rankedKeywords = useMemo(() => {
    const promptKeywords = currentPrompt?.keywords || [];
    return rankKeywordsByNewWordWeight(
      promptKeywords,
      savedVocabMap,
      currentPrompt || {},
      { includeNotebookVocab, maxKeywords: 10 }
    );
  }, [currentPrompt, savedVocabMap, includeNotebookVocab]);

  // 2. Tính toán độ phủ và thống kê sử dụng từ khóa trong bài viết theo thời gian thực
  const usageStats = useMemo(() => {
    return calculateKeywordUsageStats(rankedKeywords, essayText);
  }, [rankedKeywords, essayText]);

  if (!rankedKeywords || rankedKeywords.length === 0) {
    return null;
  }

  const handleChipClick = (kw) => {
    if (onInsertKeyword) {
      onInsertKeyword(kw.word);
      if (showToast) {
        showToast(`Đã chèn "${kw.word}" vào bài viết!`, "success");
      }
    }
  };

  const handleQuickSaveVocab = (e, kw) => {
    e.stopPropagation();
    if (onAddVocab) {
      onAddVocab({
        word: kw.word,
        meaning: kw.meaning || "Từ vựng đề bài IELTS",
        phonetic: kw.phonetic || "",
        context_sentence: currentPrompt?.prompt || "",
      });
      if (showToast) {
        showToast(`Đã lưu "${kw.word}" vào sổ từ vựng!`, "success");
      }
    }
  };

  const toggleTooltip = (e, word) => {
    e.stopPropagation();
    setActiveTooltipWord((prev) => (prev === word ? null : word));
  };

  return (
    <div className="prompt-keywords-bar-v2">
      {/* Header Bar */}
      <div className="keywords-bar-header">
        <div className="keywords-header-left">
          <span className="keywords-label-v2">
            <Sparkles size={13} color="var(--primary)" />
            <span>Gợi ý từ khóa & Trọng số từ mới:</span>
          </span>

          {usageStats.total > 0 && (
            <span
              className={`keywords-usage-badge ${
                usageStats.usedCount > 0 ? "has-used" : ""
              }`}
              title="Số lượng từ khóa đã được bạn áp dụng vào bài viết"
            >
              Đã áp dụng: <strong>{usageStats.usedCount}/{usageStats.total}</strong> ({usageStats.percentUsed}%)
            </span>
          )}
        </div>

        <div className="keywords-header-right">
          <label className="toggle-notebook-vocab-label" title="Tự động lấy thêm các từ mới trong Sổ từ vựng phù hợp với đề bài">
            <input
              type="checkbox"
              checked={includeNotebookVocab}
              onChange={(e) => setIncludeNotebookVocab(e.target.checked)}
            />
            <span>Từ mới trong sổ</span>
          </label>
        </div>
      </div>

      {/* Keywords Chips Grid */}
      <div className="keywords-list-v2">
        {rankedKeywords.map((kw, idx) => {
          const isUsed = !!usageStats.usedMap[kw.normalizedWord];
          const isTooltipOpen = activeTooltipWord === kw.word;

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
          }

          return (
            <div
              key={idx}
              className={`keyword-chip-v2 ${isUsed ? "is-used" : ""} ${
                kw.isSaved ? "is-saved" : ""
              }`}
              onClick={() => handleChipClick(kw)}
              title="Nhấp để chèn từ khóa vào vị trí con trỏ trong bài viết"
            >
              {/* Checkmark khi đã dùng trong bài viết */}
              {isUsed && (
                <span className="chip-used-icon" title="Đã dùng trong bài viết">
                  <Check size={12} strokeWidth={2.8} />
                </span>
              )}

              {/* Text từ khóa */}
              <span className="chip-word-text">{kw.word}</span>

              {/* Badge trạng thái */}
              <span className={`chip-status-tag ${badgeClass}`}>
                {badgeText}
              </span>

              {/* Badge điểm trọng số từ mới */}
              <span
                className="chip-weight-score"
                title={`Trọng số từ mới: ${kw.weightScore} điểm (càng cao càng nên ưu tiên áp dụng)`}
              >
                {kw.weightScore}đ
              </span>

              {/* Quick Save to Notebook nếu chưa lưu */}
              {!kw.isSaved && onAddVocab && (
                <button
                  type="button"
                  className="chip-action-btn chip-save-btn"
                  onClick={(e) => handleQuickSaveVocab(e, kw)}
                  title="Lưu từ khóa này vào sổ từ vựng cá nhân"
                >
                  <Plus size={11} />
                </button>
              )}

              {/* Info Button xem nghĩa & chi tiết */}
              <button
                type="button"
                className="chip-action-btn chip-info-btn"
                onClick={(e) => toggleTooltip(e, kw.word)}
                title="Xem nghĩa và lý do trọng số"
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
                    {kw.phonetic && <span className="popover-phonetic">/{kw.phonetic}/</span>}
                  </div>
                  {kw.meaning && (
                    <div className="popover-meaning">
                      <span>Nghĩa:</span> <strong>{kw.meaning}</strong>
                    </div>
                  )}
                  <div className="popover-weight-info">
                    <span>Trọng số: <strong>{kw.weightScore}/100đ</strong></span>
                    <div className="popover-reasons">
                      {kw.reasons.map((r, rIdx) => (
                        <span key={rIdx} className="reason-pill">{r}</span>
                      ))}
                    </div>
                  </div>
                  <div className="popover-tip">
                    💡 Nhấp vào từ khóa để tự động chèn vào bài viết.
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
