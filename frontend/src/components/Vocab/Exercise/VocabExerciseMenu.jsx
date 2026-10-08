import React, { useState } from "react";
import {
  X,
  Target,
  Sparkles,
  Check,
  Eye,
  ArrowRight,
  Lightbulb,
  Globe,
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
    { key: EXERCISE_CATEGORIES.RECALL, label: "Gợi nhớ chủ động (Active Recall)", icon: Sparkles },
    { key: EXERCISE_CATEGORIES.CONTEXT, label: "Ứng dụng ngữ cảnh (Context Cloze)", icon: Lightbulb },
  ];

  const showD1 =
    activeCategory === EXERCISE_CATEGORIES.ALL || activeCategory === EXERCISE_CATEGORIES.RECOGNITION;
  const showD2 =
    activeCategory === EXERCISE_CATEGORIES.ALL || activeCategory === EXERCISE_CATEGORIES.RECALL;
  const showD3 =
    activeCategory === EXERCISE_CATEGORIES.ALL || activeCategory === EXERCISE_CATEGORIES.CONTEXT;

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
              <p>Rèn luyện trí nhớ từ vựng qua phản xạ trắc nghiệm đa chiều &amp; hỗ trợ đa ngôn ngữ.</p>
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

            {/* Format Cards Grid */}
            <div className="ex-cards-grid">
              {/* DẠNG 1: TỪ VỰNG -> NGHĨA TIẾNG VIỆT */}
              {showD1 && (
                <div
                  className={`ex-format-card ${selectedFormat === EXERCISE_FORMATS.D1 ? "active" : ""}`}
                  onClick={() => onSelectFormat(EXERCISE_FORMATS.D1)}
                >
                  <div className="ex-format-badge">
                    <span className={`ex-pill-badge ${selectedFormat === EXERCISE_FORMATS.D1 ? "active" : ""}`}>
                      <Target size={14} />
                      <span>Dạng 1 • Nhận diện nghĩa</span>
                    </span>
                    <span className="ex-pill-tag">Từ vựng ➔ Nghĩa tiếng Việt</span>
                  </div>

                  <h3 className="ex-format-title">Từ vựng ➔ Nghĩa tiếng Việt</h3>
                  <p className="ex-format-desc">
                    Quan sát từ vựng &amp; phiên âm IPA, suy luận nghĩa tiếng Việt qua 4 phương án.
                    Có nút <strong>con mắt gợi ý ngữ cảnh đầy đủ</strong> (mặc định ẩn • Phím Esc).
                  </p>

                  {/* Visual Preview Box */}
                  <div className="ex-preview-box">
                    <div className="ex-preview-word-row">
                      <span className="ex-preview-word">desperate need</span>
                      <span className="ex-preview-ipa">/dˈɛsprɪt nˈid/</span>
                    </div>
                    <div className="ex-preview-eye-demo">
                      <Eye size={13} />
                      <span>Gợi ý câu ngữ cảnh (Mặc định ẩn • Phím Esc)</span>
                    </div>
                    <div className="ex-preview-options-grid">
                      <div className="ex-preview-opt">A. tràn ngập</div>
                      <div className="ex-preview-opt correct">
                        B. nhu cầu cấp bách <Check size={12} color="#10b981" style={{ verticalAlign: "middle", marginLeft: 4 }} />
                      </div>
                      <div className="ex-preview-opt">C. thanh lịch, tao nhã</div>
                      <div className="ex-preview-opt">D. được coi là đương nhiên</div>
                    </div>
                  </div>
                </div>
              )}

              {/* DẠNG 2: NGHĨA TIẾNG VIỆT -> CHỌN TỪ VỰNG (ACTIVE RECALL) */}
              {showD2 && (
                <div
                  className={`ex-format-card ${selectedFormat === EXERCISE_FORMATS.D2 ? "active" : ""}`}
                  onClick={() => onSelectFormat(EXERCISE_FORMATS.D2)}
                >
                  <div className="ex-format-badge">
                    <span className={`ex-pill-badge ${selectedFormat === EXERCISE_FORMATS.D2 ? "active" : ""}`}>
                      <Sparkles size={14} />
                      <span>Dạng 2 • Gợi nhớ chủ động (Active Recall)</span>
                    </span>
                    <span className="ex-pill-tag">
                      <Globe size={12} style={{ marginRight: 3, verticalAlign: "middle" }} />
                      Đa ngôn ngữ
                    </span>
                  </div>

                  <h3 className="ex-format-title">Nghĩa tiếng Việt ➔ Chọn Từ vựng</h3>
                  <p className="ex-format-desc">
                    Quan sát nghĩa tiếng Việt &amp; hình ảnh minh họa, chủ động gợi nhớ mặt chữ và chọn từ vựng đúng.
                    Có nút <strong>gợi ý câu ví dụ được che từ mục tiêu [ ______ ]</strong> (mặc định ẩn • Phím Esc).
                  </p>

                  {/* Visual Preview Box */}
                  <div className="ex-preview-box">
                    <div className="ex-preview-word-row">
                      <span className="ex-preview-meaning-target">"nhu cầu cấp bách"</span>
                    </div>
                    <div className="ex-preview-eye-demo">
                      <Eye size={13} />
                      <span>Gợi ý câu có che từ: "They are in [ ______ ] of shelter."</span>
                    </div>
                    <div className="ex-preview-options-grid">
                      <div className="ex-preview-opt correct">
                        A. desperate need <Check size={12} color="#10b981" style={{ verticalAlign: "middle", marginLeft: 4 }} />
                      </div>
                      <div className="ex-preview-opt">B. sustainable</div>
                      <div className="ex-preview-opt">C. comprehensive</div>
                      <div className="ex-preview-opt">D. inevitable</div>
                    </div>
                  </div>
                </div>
              )}

              {/* DẠNG 3: ĐIỀN TỪ VÀO CÂU NGỮ CẢNH (CONTEXT CLOZE) */}
              {showD3 && (
                <div
                  className={`ex-format-card ${selectedFormat === EXERCISE_FORMATS.D3 ? "active" : ""}`}
                  onClick={() => onSelectFormat(EXERCISE_FORMATS.D3)}
                >
                  <div className="ex-format-badge">
                    <span className={`ex-pill-badge ${selectedFormat === EXERCISE_FORMATS.D3 ? "active" : ""}`}>
                      <Lightbulb size={14} />
                      <span>Dạng 3 • Ứng dụng ngữ cảnh (Context Cloze)</span>
                    </span>
                    <span className="ex-pill-tag">
                      <Globe size={12} style={{ marginRight: 3, verticalAlign: "middle" }} />
                      Điền từ vào câu
                    </span>
                  </div>

                  <h3 className="ex-format-title">Điền từ vào câu ngữ cảnh</h3>
                  <p className="ex-format-desc">
                    Quan sát câu ví dụ thực tế có chỗ trống <strong>[ ______ ]</strong> và gợi ý nghĩa tiếng Việt,
                    chọn từ vựng chuẩn xác nhất để hoàn thiện câu hoàn chỉnh.
                  </p>

                  {/* Visual Preview Box */}
                  <div className="ex-preview-box">
                    <div className="ex-preview-word-row">
                      <span className="ex-preview-cloze-demo">
                        "Vietnam and Laos reaffirmed their <span className="ex-cloze-target-blank">[ ______ ]</span> and mutual ties."
                      </span>
                    </div>
                    <div className="ex-preview-meaning-hint">
                      <Lightbulb size={13} color="var(--primary)" />
                      <span>Gợi ý nghĩa: "đoàn kết đặc biệt"</span>
                    </div>
                    <div className="ex-preview-options-grid">
                      <div className="ex-preview-opt correct">
                        A. special solidarity <Check size={12} color="#10b981" style={{ verticalAlign: "middle", marginLeft: 4 }} />
                      </div>
                      <div className="ex-preview-opt">B. sustainable</div>
                      <div className="ex-preview-opt">C. comprehensive</div>
                      <div className="ex-preview-opt">D. inevitable</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quantity Selector Section */}
            <div className="ex-quantity-section">
              <div className="ex-quantity-label">
                <span>Chọn số lượng câu hỏi luyện tập:</span>
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
                  Nếu chọn số lượng nhỏ hơn tổng số ({totalWords} từ), hệ thống sẽ tự động <strong>random ngẫu nhiên</strong> từ trong Sổ tay của bạn.
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
                    Bắt đầu Luyện tập {selectedFormat === EXERCISE_FORMATS.D2 ? "Dạng 2" : "Dạng 1"} ({selectedLimit === "ALL" ? totalWords : Math.min(selectedLimit, totalWords || selectedLimit)} từ)
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
