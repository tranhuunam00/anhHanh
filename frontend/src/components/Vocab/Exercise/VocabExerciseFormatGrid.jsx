import React from "react";
import {
  Target,
  Sparkles,
  Check,
  Lightbulb,
  Keyboard,
  Smartphone,
  Lock,
  Bot,
  Mic,
} from "../../Icons";
import { EXERCISE_FORMATS } from "../../../utils/vocabExerciseGenerators";

export const VocabExerciseFormatGrid = ({
  selectedFormat,
  onSelectFormat,
  isAIAuthorized = false,
}) => {
  return (
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

      {/* DẠNG 7: TRỌNG ÂM TỪ VỰNG (WORD STRESS QUIZ) */}
      <div
        className={`ex-format-card ${selectedFormat === EXERCISE_FORMATS.D7_STRESS ? "active" : ""}`}
        onClick={() => onSelectFormat(EXERCISE_FORMATS.D7_STRESS)}
      >
        <div className="ex-card-top">
          <div className="ex-card-icon-wrap" style={{ background: "rgba(245, 158, 11, 0.12)", color: "#d97706" }}>
            <Target size={18} />
          </div>
          <div className="ex-card-status">
            {selectedFormat === EXERCISE_FORMATS.D7_STRESS ? (
              <span className="ex-selected-chip">
                <Check size={12} /> Đang chọn
              </span>
            ) : (
              <span className="ex-format-code">Dạng 7</span>
            )}
          </div>
        </div>
        <div className="ex-card-main">
          <h4 className="ex-card-title">Trọng âm từ vựng</h4>
          <p className="ex-card-desc">
            Xác định vị trí nhấn trọng âm chính theo âm tiết, phiên âm IPA &amp; quy tắc ngữ âm.
          </p>
        </div>
        <div className="ex-card-footer">
          <span className="ex-card-tag" style={{ color: "#d97706" }}>Word Stress</span>
        </div>
      </div>

      {/* DẠNG 8: LUYỆN SHADOWING CHUẨN NGỮ ĐIỆU (SHADOWING PRACTICE) */}
      <div
        className={`ex-format-card ${selectedFormat === EXERCISE_FORMATS.D8_SHADOWING ? "active" : ""}`}
        onClick={() => onSelectFormat(EXERCISE_FORMATS.D8_SHADOWING)}
      >
        <div className="ex-card-top">
          <div className="ex-card-icon-wrap" style={{ background: "rgba(16, 185, 129, 0.12)", color: "#059669" }}>
            <Mic size={18} />
          </div>
          <div className="ex-card-status">
            {selectedFormat === EXERCISE_FORMATS.D8_SHADOWING ? (
              <span className="ex-selected-chip">
                <Check size={12} /> Đang chọn
              </span>
            ) : (
              <span className="ex-format-code">Dạng 8</span>
            )}
          </div>
        </div>
        <div className="ex-card-main">
          <h4 className="ex-card-title">Luyện Shadowing</h4>
          <p className="ex-card-desc">
            Nói nhại theo câu mẫu bản ngữ, nhận diện giọng nói &amp; đối chiếu trực tiếp ngữ điệu.
          </p>
        </div>
        <div className="ex-card-footer">
          <span className="ex-card-tag" style={{ color: "#059669" }}>Speech Shadowing</span>
        </div>
      </div>
    </div>
  );
};
