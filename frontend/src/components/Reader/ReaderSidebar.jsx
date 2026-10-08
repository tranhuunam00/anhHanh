import React from "react";
import {
  ArrowLeft,
  Trash2,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  RotateCcw,
} from "../Icons";
import { formatTime } from "../../utils/readerUtils";

export function ReaderSidebar({
  onSwitchToPaste,
  onDeleteArticle,
  currentSentenceIdx,
  sentencesCount,
  isSpeaking,
  onlyCurrentSentence,
  onToggleSpeech,
  onPrevSentence,
  onNextSentence,
  onRestartSpeech,
  onToggleSingleSentenceMode,
  speechRate,
  onRateChange,
  elapsedSeconds,
  totalDuration,
  onSeekChange,
  totalWordsCount,
  matchedWords,
  onScrollToWord,
  fontSize,
  setFontSize,
  fontFamily,
  setFontFamily,
  setOnlyCurrentSentence,
  autoScroll,
  setAutoScroll,
  readerTheme,
  setReaderTheme,
}) {
  return (
    <aside className="reader-sidebar-panel">
      {/* Top row: Nút Quay lại & Xóa bài */}
      <div className="reader-sidebar-nav">
        <button
          className="btn btn-secondary btn-with-icon"
          onClick={onSwitchToPaste}
          title="Dán bài báo khác hoặc bài mới"
        >
          <ArrowLeft size={16} strokeWidth={2.2} />
          <span>Dán bài khác</span>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span className="reader-badge-sparkle">Đọc & Ôn từ</span>

          <button
            className="btn btn-secondary btn-icon"
            onClick={onDeleteArticle}
            title="Xóa bài viết này"
            style={{ color: "#ef4444" }}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Trình phát âm thanh & Thanh tua thời gian */}
      <div className="reader-player-section">
        {/* Row 1: Player controls & sentence counter */}
        <div className="reader-player-main-row">
          <div className="reader-player-controls-left">
            <button
              className="btn btn-secondary btn-icon"
              onClick={onPrevSentence}
              disabled={currentSentenceIdx <= 0}
              title="Lùi về câu trước"
            >
              <SkipBack size={15} />
            </button>

            <button
              className={`btn ${isSpeaking ? "btn-primary" : "btn-secondary"} btn-with-icon reader-play-btn`}
              onClick={onToggleSpeech}
              title={
                isSpeaking
                  ? "Tạm dừng đọc"
                  : onlyCurrentSentence
                  ? "Đọc câu chỉ định hiện tại"
                  : "Bắt đầu nghe đọc bài viết bằng AI"
              }
            >
              {isSpeaking ? <Pause size={15} /> : <Play size={15} />}
              <span>{isSpeaking ? "Tạm dừng" : onlyCurrentSentence ? "Đọc câu này" : "Nghe đọc"}</span>
            </button>

            <button
              className="btn btn-secondary btn-icon"
              onClick={onNextSentence}
              disabled={currentSentenceIdx >= (sentencesCount || 1) - 1}
              title="Chuyển sang câu tiếp theo"
            >
              <SkipForward size={15} />
            </button>

            <button
              className="btn btn-secondary btn-icon"
              onClick={onRestartSpeech}
              title="Đọc lại từ đầu bài viết"
            >
              <RotateCcw size={14} />
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              className={`reader-single-sentence-pill ${onlyCurrentSentence ? "active" : ""}`}
              onClick={onToggleSingleSentenceMode}
              title={
                onlyCurrentSentence
                  ? "Đang bật: Chỉ đọc câu chỉ định rồi dừng (Bấm để chuyển sang đọc cả bài)"
                  : "Đang tắt: Đọc liên tục cả bài (Bấm để chỉ đọc 1 câu chỉ định)"
              }
            >
              <span>{onlyCurrentSentence ? "Chỉ đọc câu này" : "Chỉ đọc câu chỉ định"}</span>
            </button>

            <span className="reader-sentence-badge">
              <span>
                Câu <strong>{sentencesCount > 0 ? currentSentenceIdx + 1 : 0}</strong> /{" "}
                {sentencesCount}
              </span>
            </span>
          </div>
        </div>

        {/* Row 2: Tốc độ đọc */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>Tốc độ đọc:</span>
          <div className="reader-control-btn-group">
            {[0.8, 1.0, 1.25, 1.5].map((rate) => (
              <button
                key={rate}
                className={`reader-control-btn ${speechRate === rate ? "active" : ""}`}
                onClick={() => onRateChange(rate)}
                title={`Tốc độ đọc ${rate}x`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>

        {/* Row 3: Timeline Scrubber Bar */}
        <div className="reader-scrubber-row">
          <span className="reader-time-badge current-time">{formatTime(elapsedSeconds)}</span>

          <div className="reader-range-wrap">
            <input
              type="range"
              className="reader-seek-range"
              min="0"
              max={Math.max(1, totalDuration)}
              step="0.5"
              value={elapsedSeconds}
              onChange={onSeekChange}
              style={{
                "--progress-percent": `${totalDuration > 0 ? Math.min(100, (elapsedSeconds / totalDuration) * 100) : 0}%`,
              }}
              title="Kéo hoặc nhấp vào thanh để tua thời gian bài đọc"
              aria-label="Thanh tua thời gian bài đọc"
            />
          </div>

          <span className="reader-time-badge total-time">{formatTime(totalDuration)}</span>
        </div>

        {/* Row 4: Scrubber helper hint */}
        <div className="reader-scrubber-hint">
          <span>Kéo thanh tua hoặc <strong>bấm vào câu bất kỳ</strong> bên phải để nghe</span>
        </div>
      </div>

      {/* Thống kê bài viết & Danh sách từ vựng cần ôn */}
      <div className="reader-sidebar-stats-card">
        <div className="reader-sidebar-stats-row">
          <div className="reader-stat-item">
            <span>Tổng số: <strong>{totalWordsCount}</strong> từ</span>
          </div>

          <span className="reader-matched-badge">
            <strong>{matchedWords.length}</strong> từ đã lưu
          </span>
        </div>

        {/* Danh sách chip từ vựng */}
        {matchedWords.length > 0 && (
          <div className="reader-sidebar-chips-wrap">
            <span className="reader-sidebar-chips-label">
              Từ vựng đã lưu trong bài:
            </span>
            <div className="reader-chips-bar sidebar-chips">
              {matchedWords.map((item, idx) => (
                <button
                  key={idx}
                  className="reader-word-chip"
                  onClick={() => onScrollToWord(item.word)}
                  title={`Chạm để cuộn đến từ "${item.word}" trong bài báo`}
                >
                  <span className={`chip-dot status-${(item.status || "NEW").toLowerCase()}`}></span>
                  <span>{item.word}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tùy chỉnh hiển thị (Cỡ chữ, Font, Giao diện) */}
      <div className="reader-sidebar-display-card">
        <span className="reader-sidebar-display-title">
          Tùy chỉnh hiển thị:
        </span>

        <div className="reader-display-rows">
          {/* Kích cỡ chữ */}
          <div className="reader-display-row-item">
            <span className="reader-display-row-label">Cỡ chữ:</span>
            <div className="reader-control-btn-group">
              <button
                className="reader-control-btn"
                onClick={() => setFontSize((s) => Math.max(14, s - 1))}
                title="Giảm kích thước chữ"
              >
                A-
              </button>
              <span style={{ fontSize: "0.8rem", padding: "0 6px", color: "var(--text-muted)", minWidth: "32px", textAlign: "center", fontWeight: 700 }}>
                {fontSize}px
              </span>
              <button
                className="reader-control-btn"
                onClick={() => setFontSize((s) => Math.min(30, s + 1))}
                title="Tăng kích thước chữ"
              >
                A+
              </button>
            </div>
          </div>

          {/* Kiểu chữ */}
          <div className="reader-display-row-item">
            <span className="reader-display-row-label">Kiểu chữ:</span>
            <div className="reader-control-btn-group">
              <button
                className={`reader-control-btn ${fontFamily === "sans" ? "active" : ""}`}
                onClick={() => setFontFamily("sans")}
                title="Font chữ hiện đại (Sans-serif)"
              >
                Sans
              </button>
              <button
                className={`reader-control-btn ${fontFamily === "serif" ? "active" : ""}`}
                onClick={() => setFontFamily("serif")}
                title="Font chữ báo chí (Serif)"
              >
                Serif
              </button>
            </div>
          </div>

          {/* Chế độ phát âm: Cả bài / Chỉ câu chỉ định */}
          <div className="reader-display-row-item">
            <span className="reader-display-row-label">Chế độ đọc:</span>
            <div className="reader-control-btn-group">
              <button
                className={`reader-control-btn ${!onlyCurrentSentence ? "active" : ""}`}
                onClick={() => setOnlyCurrentSentence(false)}
                title="Đọc liên tục từ câu hiện tại đến hết bài"
              >
                Cả bài
              </button>
              <button
                className={`reader-control-btn ${onlyCurrentSentence ? "active" : ""}`}
                onClick={() => setOnlyCurrentSentence(true)}
                title="Chỉ đọc câu được chỉ định rồi dừng lại"
              >
                Chỉ 1 câu
              </button>
            </div>
          </div>

          {/* Tự động cuộn trang khi đọc */}
          <div className="reader-display-row-item">
            <span className="reader-display-row-label">Khi phát âm:</span>
            <div className="reader-control-btn-group">
              <button
                className={`reader-control-btn ${autoScroll ? "active" : ""}`}
                onClick={() => setAutoScroll(true)}
                title="Tự động cuộn khung đọc theo câu đang phát âm"
              >
                Tự cuộn
              </button>
              <button
                className={`reader-control-btn ${!autoScroll ? "active" : ""}`}
                onClick={() => setAutoScroll(false)}
                title="Giữ nguyên vị trí khung đọc, không tự động cuộn trang"
              >
                Để im
              </button>
            </div>
          </div>

          {/* Màu nền giao diện */}
          <div className="reader-display-row-item">
            <span className="reader-display-row-label">Màu nền:</span>
            <div className="reader-control-btn-group">
              <button
                className={`reader-control-btn ${readerTheme === "default" ? "active" : ""}`}
                onClick={() => setReaderTheme("default")}
                title="Giao diện mặc định"
              >
                Chuẩn
              </button>
              <button
                className={`reader-control-btn ${readerTheme === "sepia" ? "active" : ""}`}
                onClick={() => setReaderTheme("sepia")}
                title="Nền giấy vàng ấm (Sepia)"
              >
                Giấy
              </button>
              <button
                className={`reader-control-btn ${readerTheme === "dark" ? "active" : ""}`}
                onClick={() => setReaderTheme("dark")}
                title="Nền tối OLED"
              >
                Tối
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
