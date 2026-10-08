import React, { useState } from "react";
import {
  X,
  Target,
  Sparkles,
  Check,
  ArrowRight,
  Lightbulb,
  Volume2,
  Layers,
} from "../../Icons";
import { EXERCISE_FORMATS, EXERCISE_CATEGORIES } from "../../../utils/vocabExerciseGenerators";

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
  const [activeCategory, setActiveCategory] = useState(EXERCISE_CATEGORIES.ALL);

  const categories = [
    { key: EXERCISE_CATEGORIES.ALL, label: "Tất cả hình thức", icon: Layers },
    { key: EXERCISE_CATEGORIES.RECOGNITION, label: "Nhận diện nghĩa", icon: Target },
    { key: EXERCISE_CATEGORIES.RECALL, label: "Gợi nhớ chủ động", icon: Sparkles },
    { key: EXERCISE_CATEGORIES.CONTEXT, label: "Điền câu ngữ cảnh", icon: Lightbulb },
    { key: EXERCISE_CATEGORIES.LISTENING, label: "Nghe phản xạ", icon: Volume2 },
  ];

  const showD1 =
    activeCategory === EXERCISE_CATEGORIES.ALL || activeCategory === EXERCISE_CATEGORIES.RECOGNITION;
  const showD2 =
    activeCategory === EXERCISE_CATEGORIES.ALL || activeCategory === EXERCISE_CATEGORIES.RECALL;
  const showD3 =
    activeCategory === EXERCISE_CATEGORIES.ALL || activeCategory === EXERCISE_CATEGORIES.CONTEXT;
  const showD4 =
    activeCategory === EXERCISE_CATEGORIES.ALL || activeCategory === EXERCISE_CATEGORIES.LISTENING;

  const getFormatLabel = () => {
    switch (selectedFormat) {
      case EXERCISE_FORMATS.D2:
        return "Dạng 2 (Nghĩa TV ➔ Từ vựng)";
      case EXERCISE_FORMATS.D3:
        return "Dạng 3 (Điền từ vào câu)";
      case EXERCISE_FORMATS.D4:
        return "Dạng 4 (Nghe phát âm chọn từ)";
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
              <p>Rèn luyện trí nhớ từ vựng qua phản xạ trắc nghiệm 4 dạng thông minh &amp; đa chiều.</p>
            </div>

            {/* Category Filter Pills */}
            <div className="ex-category-nav">
              {categories.map((cat) => {
                const IconComp = cat.icon;
                const isActive = activeCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    className={`ex-category-pill ${isActive ? "active" : ""}`}
                    onClick={() => setActiveCategory(cat.key)}
                  >
                    <IconComp size={14} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Format Cards Grid: 4 cards per row */}
            <div className="ex-cards-grid">
              {/* DẠNG 1: TỪ VỰNG -> NGHĨA TIẾNG VIỆT */}
              {showD1 && (
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
              )}

              {/* DẠNG 2: NGHĨA TIẾNG VIỆT -> CHỌN TỪ VỰNG (ACTIVE RECALL) */}
              {showD2 && (
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
              )}

              {/* DẠNG 3: ĐIỀN TỪ VÀO CÂU NGỮ CẢNH (CONTEXT CLOZE) */}
              {showD3 && (
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
              )}

              {/* DẠNG 4: NGHE PHÁT ÂM -> CHỌN TỪ (LISTENING RECALL) */}
              {showD4 && (
                <div
                  className={`ex-format-card ${selectedFormat === EXERCISE_FORMATS.D4 ? "active" : ""}`}
                  onClick={() => onSelectFormat(EXERCISE_FORMATS.D4)}
                >
                  <div className="ex-card-top">
                    <div className="ex-card-icon-wrap d4">
                      <Volume2 size={18} />
                    </div>
                    <div className="ex-card-status">
                      {selectedFormat === EXERCISE_FORMATS.D4 ? (
                        <span className="ex-selected-chip">
                          <Check size={12} /> Đang chọn
                        </span>
                      ) : (
                        <span className="ex-format-code">Dạng 4</span>
                      )}
                    </div>
                  </div>

                  <div className="ex-card-main">
                    <h4 className="ex-card-title">Nghe phát âm ➔ Chọn từ</h4>
                    <p className="ex-card-desc">
                      Nghe âm thanh phát âm bản ngữ chuẩn, rèn phản xạ nhận diện từ vựng.
                    </p>
                  </div>

                  <div className="ex-card-footer">
                    <span className="ex-card-tag">Luyện nghe phản xạ</span>
                  </div>
                </div>
              )}
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
