import React from "react";
import {
  X,
  Target,
  Sparkles,
  Check,
  ArrowRight,
  Lightbulb,
} from "../../Icons";
import { EXERCISE_FORMATS } from "../../../utils/vocabExerciseGenerators";

const QUANTITY_OPTIONS = [20, 40, 60, 80, "ALL"];

export const VocabExerciseMenu = ({
  totalWords = 0,
  selectedFormat = EXERCISE_FORMATS.D1,
  onSelectFormat,
  selectedLimit = 20,
  onSelectLimit,
  onStart,
  isLoading = false,
  onClose,
}) => {
  const getFormatLabel = () => {
    switch (selectedFormat) {
      case EXERCISE_FORMATS.D2:
        return "Dạng 2 (Nghĩa TV ➔ Từ vựng)";
      case EXERCISE_FORMATS.D3:
        return "Dạng 3 (Điền từ vào câu)";
      default:
        return "Dạng 1 (Từ vựng ➔ Nghĩa TV)";
    }
  };

  const currentLimitDisplay =
    selectedLimit === "ALL"
      ? totalWords
      : Math.min(selectedLimit, totalWords || selectedLimit);

  return (
    <div className="exercise-modal-backdrop" onClick={onClose}>
      <div className="exercise-modal-window" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="exercise-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div className="ex-header-icon-badge">
              <Sparkles size={18} color="var(--primary)" />
            </div>
            <div>
              <h3 className="ex-header-title">Luyện Tập Từ Vựng</h3>
              <span className="ex-header-subtitle">
                Sổ tay có <strong>{totalWords} từ vựng</strong> • Chọn dạng bài tập để bắt đầu
              </span>
            </div>
          </div>
          <button className="btn-ex-close" onClick={onClose} title="Đóng">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="exercise-body">
          <div className="ex-menu-container">
            <div className="ex-menu-headline">
              <h4>Chọn hình thức bài tập luyện tập</h4>
            </div>

            {/* Format Cards Grid: 3 cards per row */}
            <div className="ex-cards-grid">
              {/* DẠNG 1: TỪ VỰNG -> NGHĨA TIẾNG VIỆT */}
              <div
                className={`ex-format-card ${selectedFormat === EXERCISE_FORMATS.D1 ? "active" : ""}`}
                onClick={() => onSelectFormat(EXERCISE_FORMATS.D1)}
              >
                <div className="ex-card-top">
                  <div className="ex-card-icon-wrap d1">
                    <Target size={18} />
                  </div>
                  <div className="ex-card-status">
                    {selectedFormat === EXERCISE_FORMATS.D1 ? (
                      <span className="ex-selected-chip">
                        <Check size={12} /> Đang chọn
                      </span>
                    ) : (
                      <span className="ex-format-code">Dạng 1</span>
                    )}
                  </div>
                </div>

                <div className="ex-card-main">
                  <h4 className="ex-card-title">Từ vựng ➔ Nghĩa TV</h4>
                  <p className="ex-card-desc">
                    Nhìn từ vựng &amp; phiên âm IPA, chọn nghĩa tiếng Việt chính xác.
                  </p>
                </div>

                <div className="ex-card-footer">
                  <span className="ex-card-tag">Gợi ý câu Esc</span>
                </div>
              </div>

              {/* DẠNG 2: NGHĨA TIẾNG VIỆT -> CHỌN TỪ VỰNG (ACTIVE RECALL) */}
              <div
                className={`ex-format-card ${selectedFormat === EXERCISE_FORMATS.D2 ? "active" : ""}`}
                onClick={() => onSelectFormat(EXERCISE_FORMATS.D2)}
              >
                <div className="ex-card-top">
                  <div className="ex-card-icon-wrap d2">
                    <Sparkles size={18} />
                  </div>
                  <div className="ex-card-status">
                    {selectedFormat === EXERCISE_FORMATS.D2 ? (
                      <span className="ex-selected-chip">
                        <Check size={12} /> Đang chọn
                      </span>
                    ) : (
                      <span className="ex-format-code">Dạng 2</span>
                    )}
                  </div>
                </div>

                <div className="ex-card-main">
                  <h4 className="ex-card-title">Nghĩa TV ➔ Chọn Từ</h4>
                  <p className="ex-card-desc">
                    Gợi nhớ mặt chữ từ tiếng Việt, che từ trong câu ngữ cảnh.
                  </p>
                </div>

                <div className="ex-card-footer">
                  <span className="ex-card-tag">Active Recall</span>
                </div>
              </div>

              {/* DẠNG 3: ĐIỀN TỪ VÀO CÂU NGỮ CẢNH (CONTEXT CLOZE) */}
              <div
                className={`ex-format-card ${selectedFormat === EXERCISE_FORMATS.D3 ? "active" : ""}`}
                onClick={() => onSelectFormat(EXERCISE_FORMATS.D3)}
              >
                <div className="ex-card-top">
                  <div className="ex-card-icon-wrap d3">
                    <Lightbulb size={18} />
                  </div>
                  <div className="ex-card-status">
                    {selectedFormat === EXERCISE_FORMATS.D3 ? (
                      <span className="ex-selected-chip">
                        <Check size={12} /> Đang chọn
                      </span>
                    ) : (
                      <span className="ex-format-code">Dạng 3</span>
                    )}
                  </div>
                </div>

                <div className="ex-card-main">
                  <h4 className="ex-card-title">Điền từ vào câu</h4>
                  <p className="ex-card-desc">
                    Quan sát câu ví dụ khuyết từ [ ___ ] &amp; gợi ý nghĩa để hoàn thiện câu.
                  </p>
                </div>

                <div className="ex-card-footer">
                  <span className="ex-card-tag">Context Cloze</span>
                </div>
              </div>
            </div>

            {/* Quantity Selector Section */}
            <div className="ex-quantity-section">
              <div className="ex-quantity-label">
                <span>Số lượng câu hỏi:</span>
                <span className="ex-quantity-subtext">
                  {selectedLimit === "ALL"
                    ? `Tất cả (${totalWords} từ)`
                    : `${Math.min(selectedLimit, totalWords || selectedLimit)} từ`}
                </span>
              </div>

              <div className="ex-quantity-pills">
                {QUANTITY_OPTIONS.map((opt) => {
                  const isSelected = selectedLimit === opt;
                  const label = opt === "ALL" ? `Tất cả (${totalWords})` : `${opt} từ`;
                  return (
                    <button
                      key={opt}
                      type="button"
                      className={`ex-quantity-btn ${isSelected ? "selected" : ""}`}
                      onClick={() => onSelectLimit(opt)}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <div className="ex-quantity-helper">
                <Lightbulb size={14} style={{ verticalAlign: "middle", marginRight: 4, flexShrink: 0 }} />
                <span>
                  Hệ thống tự động <strong>random ngẫu nhiên</strong> từ trong Sổ tay của bạn khi luyện tập.
                </span>
              </div>
            </div>

            {/* Action Start Button */}
            <button
              type="button"
              className="ex-start-btn"
              onClick={onStart}
              disabled={isLoading || totalWords === 0}
            >
              {isLoading ? (
                <span>Đang chuẩn bị câu hỏi ngẫu nhiên...</span>
              ) : (
                <>
                  <span>
                    Bắt đầu Luyện tập {getFormatLabel()} ({currentLimitDisplay} từ)
                  </span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
