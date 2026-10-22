import React from "react";
import {
  X,
  Target,
  Sparkles,
  Check,
  ArrowRight,
  Lightbulb,
  CheckCircle,
  Keyboard,
  Smartphone,
  Lock,
  Bot,
} from "../../Icons";
import { EXERCISE_FORMATS } from "../../../utils/vocabExerciseGenerators";
import { VocabTimeFilterSection } from "./VocabTimeFilterSection";

const QUANTITY_OPTIONS = [20, 40, 60, 80, "ALL"];

export const VocabExerciseMenu = ({
  totalWords = 0,
  unmasteredCount = 0,
  masteredCount = 0,
  availableWords = 0,
  statusFilter = "UNMASTERED",
  onSelectStatusFilter,
  timeRange = "ALL",
  onSelectTimeRange,
  customStartDate = "",
  onCustomStartDateChange,
  customEndDate = "",
  onCustomEndDateChange,
  timeCounts = {},
  selectedFormat = EXERCISE_FORMATS.D1,
  onSelectFormat,
  selectedLimit = 20,
  onSelectLimit,
  onStart,
  isLoading = false,
  onClose,
  user = null,
}) => {
  const isAIAuthorized = Boolean(
    user?.can_use_ai_import ||
      user?.can_use_ai_writing ||
      (user?.email &&
        ["tranhuunam23022000", "vuthiquynhtrang", "vuthiquynhtrangbl6d"].includes(
          user.email.toLowerCase().split("@")[0]
        ))
  );

  const getFormatLabel = () => {
    switch (selectedFormat) {
      case EXERCISE_FORMATS.D6_AI_STORY:
        return "Dạng 6 (AI Kể chuyện nối từ)";
      case EXERCISE_FORMATS.D5_FLIP:
        return "Dạng 5 (Thẻ di động đi đường)";
      case EXERCISE_FORMATS.D4:
        return "Dạng 4 (Gõ từ chính tả)";
      case EXERCISE_FORMATS.D2:
        return "Dạng 2 (Nghĩa TV ➔ Từ vựng)";
      case EXERCISE_FORMATS.D3:
        return "Dạng 3 (Điền từ vào câu)";
      default:
        return "Dạng 1 (Từ vựng ➔ Nghĩa TV)";
    }
  };

  const poolCount = typeof availableWords === "number" ? availableWords : totalWords;
  const currentLimitDisplay =
    selectedLimit === "ALL"
      ? poolCount
      : Math.min(selectedLimit, poolCount || selectedLimit);

  const getStatusText = () => {
    if (statusFilter === "UNMASTERED") return "từ chưa thuộc";
    if (statusFilter === "MASTERED") return "từ đã thuộc";
    return "từ";
  };

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
                Sổ tay có <strong>{totalWords} từ vựng</strong> (Chưa thuộc: <strong>{unmasteredCount}</strong> • Đã thuộc: <strong>{masteredCount}</strong>)
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

              {/* DẠNG 4: GÕ TỪ CHÍNH TẢ (ACTIVE TYPING / SPELLER) */}
              <div
                className={`ex-format-card ${selectedFormat === EXERCISE_FORMATS.D4 ? "active" : ""}`}
                onClick={() => onSelectFormat(EXERCISE_FORMATS.D4)}
              >
                <div className="ex-card-top">
                  <div className="ex-card-icon-wrap d4">
                    <Keyboard size={18} />
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
                  <h4 className="ex-card-title">Gõ từ chính tả</h4>
                  <p className="ex-card-desc">
                    Quan sát nghĩa tiếng Việt &amp; gợi ý ngữ cảnh, tự gõ chính xác mặt chữ.
                  </p>
                </div>

                <div className="ex-card-footer">
                  <span className="ex-card-tag">Active Typing</span>
                </div>
              </div>

              {/* DẠNG 5: THẺ FLASHCARD DI ĐỘNG (WALKING / 1-TAP MOBILE FLIP) */}
              <div
                className={`ex-format-card ${selectedFormat === EXERCISE_FORMATS.D5_FLIP ? "active" : ""}`}
                onClick={() => onSelectFormat(EXERCISE_FORMATS.D5_FLIP)}
              >
                <div className="ex-card-top">
                  <div className="ex-card-icon-wrap" style={{ background: "rgba(16, 185, 129, 0.12)", color: "#10b981" }}>
                    <Smartphone size={18} />
                  </div>
                  <div className="ex-card-status">
                    {selectedFormat === EXERCISE_FORMATS.D5_FLIP ? (
                      <span className="ex-selected-chip">
                        <Check size={12} /> Đang chọn
                      </span>
                    ) : (
                      <span className="ex-format-code">Dạng 5</span>
                    )}
                  </div>
                </div>

                <div className="ex-card-main">
                  <h4 className="ex-card-title">Thẻ di động đi đường</h4>
                  <p className="ex-card-desc">
                    Lật thẻ 3D toàn màn hình, chạm 1 ngón rảnh tay khi dạo bộ hoặc đi đường.
                  </p>
                </div>

                <div className="ex-card-footer">
                  <span className="ex-card-tag" style={{ color: "#059669" }}>Đi đường / 1 Chạm</span>
                </div>
              </div>

              {/* DẠNG 6: AI KỂ CHUYỆN NỐI TỪ (AI NARRATIVE CLOZE) */}
              <div
                className={`ex-format-card ${selectedFormat === EXERCISE_FORMATS.D6_AI_STORY ? "active" : ""}`}
                onClick={() => onSelectFormat(EXERCISE_FORMATS.D6_AI_STORY)}
              >
                <div className="ex-card-top">
                  <div className="ex-card-icon-wrap" style={{ background: "rgba(139, 92, 246, 0.12)", color: "#8b5cf6" }}>
                    <Bot size={18} />
                  </div>
                  <div className="ex-card-status">
                    {selectedFormat === EXERCISE_FORMATS.D6_AI_STORY ? (
                      <span className="ex-selected-chip">
                        <Check size={12} /> Đang chọn
                      </span>
                    ) : isAIAuthorized ? (
                      <span className="ex-format-code" style={{ color: "#8b5cf6" }}>AI Beta</span>
                    ) : (
                      <span className="ex-format-code" style={{ color: "#ef4444", display: "flex", alignItems: "center", gap: "3px" }}>
                        <Lock size={12} /> Khóa
                      </span>
                    )}
                  </div>
                </div>

                <div className="ex-card-main">
                  <h4 className="ex-card-title">AI Kể chuyện nối từ</h4>
                  <p className="ex-card-desc">
                    AI liên kết từ vựng thành câu chuyện tình huống sinh động &amp; tạo câu đố ngữ cảnh.
                  </p>
                </div>

                <div className="ex-card-footer">
                  <span className="ex-card-tag" style={{ color: "#8b5cf6" }}>
                    {isAIAuthorized ? "AI Đặc Quyền" : "Yêu cầu cấp quyền"}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Mastery Filter: Chưa thuộc vs Đã thuộc vs Tất cả */}
            <div className="ex-status-filter-section">
              <div className="ex-status-filter-header">
                <span className="ex-status-filter-title">Nhóm từ muốn luyện tập:</span>
                <span className="ex-status-filter-subtext">
                  {statusFilter === "UNMASTERED" && (
                    <span style={{ color: "var(--primary)" }}>
                      <strong>{unmasteredCount}</strong> từ chưa thuộc
                    </span>
                  )}
                  {statusFilter === "MASTERED" && (
                    <span style={{ color: "#10b981" }}>
                      <strong>{masteredCount}</strong> từ đã thuộc
                    </span>
                  )}
                  {statusFilter === "ALL" && (
                    <span style={{ color: "var(--text-secondary)" }}>
                      <strong>{totalWords}</strong> từ tổng cộng
                    </span>
                  )}
                </span>
              </div>

              <div className="ex-status-filter-pills">
                <button
                  type="button"
                  className={`ex-status-filter-btn unmastered ${statusFilter === "UNMASTERED" ? "selected" : ""}`}
                  onClick={() => onSelectStatusFilter("UNMASTERED")}
                >
                  <Target size={15} />
                  <span>Từ chưa thuộc</span>
                  <span className="ex-status-badge">{unmasteredCount}</span>
                </button>

                <button
                  type="button"
                  className={`ex-status-filter-btn mastered ${statusFilter === "MASTERED" ? "selected" : ""}`}
                  onClick={() => onSelectStatusFilter("MASTERED")}
                >
                  <CheckCircle size={15} />
                  <span>Từ đã thuộc</span>
                  <span className="ex-status-badge">{masteredCount}</span>
                </button>

                <button
                  type="button"
                  className={`ex-status-filter-btn all ${statusFilter === "ALL" ? "selected" : ""}`}
                  onClick={() => onSelectStatusFilter("ALL")}
                >
                  <Sparkles size={15} />
                  <span>Tất cả</span>
                  <span className="ex-status-badge">{totalWords}</span>
                </button>
              </div>

              {poolCount === 0 && (
                <div className="ex-status-empty-alert">
                  {statusFilter === "UNMASTERED"
                    ? "🎉 Tuyệt vời! Bạn đã thuộc toàn bộ từ vựng trong sổ tay."
                    : statusFilter === "MASTERED"
                    ? "💡 Bạn chưa có từ nào được đánh dấu là 'Đã thuộc'. Hãy luyện tập các từ 'Chưa thuộc' trước nhé!"
                    : "Sổ tay chưa có từ vựng nào."}
                </div>
              )}
            </div>

            {/* Time Range Filter Section: Lọc theo thời gian lưu từ vựng */}
            <VocabTimeFilterSection
              timeRange={timeRange}
              onSelectTimeRange={onSelectTimeRange}
              customStartDate={customStartDate}
              onCustomStartDateChange={onCustomStartDateChange}
              customEndDate={customEndDate}
              onCustomEndDateChange={onCustomEndDateChange}
              timeCounts={timeCounts}
              scannedCount={poolCount}
            />

            {/* Quantity Selector Section */}
            <div className="ex-quantity-section">
              <div className="ex-quantity-label">
                <span>Số lượng câu hỏi:</span>
                <span className="ex-quantity-subtext">
                  {selectedLimit === "ALL"
                    ? `Tất cả (${poolCount} từ)`
                    : `${Math.min(selectedLimit, poolCount || selectedLimit)} từ`}
                </span>
              </div>

              <div className="ex-quantity-pills">
                {QUANTITY_OPTIONS.map((opt) => {
                  const isSelected = selectedLimit === opt;
                  const label = opt === "ALL" ? `Tất cả (${poolCount})` : `${opt} từ`;
                  return (
                    <button
                      key={opt}
                      type="button"
                      className={`ex-quantity-btn ${isSelected ? "selected" : ""}`}
                      onClick={() => onSelectLimit(opt)}
                      disabled={poolCount === 0}
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
              disabled={isLoading || poolCount === 0}
            >
              {isLoading ? (
                <span>Đang chuẩn bị câu hỏi ngẫu nhiên...</span>
              ) : (
                <>
                  <span>
                    Bắt đầu {statusFilter === "MASTERED" ? "Ôn tập" : "Luyện tập"} {getFormatLabel()} ({currentLimitDisplay} {getStatusText()})
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
