import React, { useCallback } from "react";
import {
  X,
  Trophy,
  Flame,
  Volume2,
  ArrowLeft,
  RotateCcw,
  Check,
  Globe,
} from "../../Icons";
import { getVoiceLang, getLanguageLabel } from "../../../utils/languageVoices";

export const VocabExerciseSummary = ({
  score = 0,
  totalCount = 0,
  maxCombo = 0,
  resultsHistory = [],
  onBackToMenu,
  onRestart,
  onClose,
}) => {
  const accuracy = totalCount > 0 ? Math.round((score / totalCount) * 100) : 0;

  const playAudio = useCallback((word, sourceLang) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window) || !word) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(word);
      utter.lang = getVoiceLang(sourceLang, word);
      utter.rate = 0.9;
      window.speechSynthesis.speak(utter);
    } catch (err) {}
  }, []);

  return (
    <div className="exercise-modal-backdrop" onClick={onClose}>
      <div className="exercise-modal-window" onClick={(e) => e.stopPropagation()}>
        <div className="exercise-header">
          <h3 className="ex-header-title">Kết Quả Luyện Tập Từ Vựng</h3>
          <button className="btn-ex-close" onClick={onClose} title="Đóng">
            <X size={20} />
          </button>
        </div>

        <div className="ex-summary-wrap">
          <div className="ex-trophy-badge">
            <Trophy size={42} />
          </div>
          <h2 style={{ margin: "10px 0 4px", fontSize: "1.6rem", fontWeight: 800 }}>
            {accuracy >= 80 ? "Xuất sắc! Bạn đã làm chủ bài tập!" : "Hoàn thành bài luyện tập!"}
          </h2>
          <p style={{ color: "var(--text-muted)", margin: "0 0 16px", fontSize: "0.9rem" }}>
            Đã ghi nhận kết quả vào bộ nhớ ngắt quãng SRS để củng cố trí nhớ dài hạn.
          </p>

          <div className="ex-stats-row">
            <div className="ex-stat-card">
              <span className="ex-stat-num">
                {score} / {totalCount}
              </span>
              <span className="ex-stat-title">Trả lời đúng</span>
            </div>
            <div className="ex-stat-card">
              <span className="ex-stat-num">{accuracy}%</span>
              <span className="ex-stat-title">Độ chính xác</span>
            </div>
            <div className="ex-stat-card">
              <span
                className="ex-stat-num"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  justifyContent: "center",
                }}
              >
                {maxCombo} <Flame size={18} color="#f97316" fill="#f97316" />
              </span>
              <span className="ex-stat-title">Combo cao nhất</span>
            </div>
          </div>

          {/* List of reviewed words with status */}
          <div className="ex-history-list">
            <div className="ex-history-title">
              Danh sách từ đã luyện tập ({resultsHistory.length} từ):
            </div>
            <div className="ex-history-items-box">
              {resultsHistory.map((item, idx) => (
                <div key={idx} className={`ex-history-row ${item.isCorrect ? "correct" : "wrong"}`}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    <span className={`ex-status-pill ${item.isCorrect ? "correct" : "wrong"}`}>
                      {item.isCorrect ? "ĐÚNG" : "CHƯA ĐÚNG"}
                    </span>
                    <strong style={{ fontSize: "0.95rem" }}>{item.word}</strong>
                    {item.phonetic && <span className="ex-history-ipa">{item.phonetic}</span>}
                    {item.source_lang && item.source_lang !== "en" && (
                      <span className="ex-lang-mini-pill">
                        <Globe size={11} style={{ marginRight: 2 }} />
                        {getLanguageLabel(item.source_lang)}
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                      {item.meaning}
                    </span>
                    <button
                      type="button"
                      onClick={() => playAudio(item.word, item.source_lang)}
                      className="ex-audio-mini-btn"
                      title="Nghe phát âm"
                    >
                      <Volume2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "18px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <button
              type="button"
              className="ex-btn-secondary"
              onClick={onBackToMenu}
              style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
            >
              <ArrowLeft size={16} /> Chọn dạng / số lượng khác
            </button>
            <button
              type="button"
              className="ex-btn-secondary"
              onClick={onRestart}
              style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
            >
              <RotateCcw size={16} /> Luyện tập lại danh sách này
            </button>
            <button
              type="button"
              className="ex-btn-primary"
              onClick={onClose}
              style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
            >
              <Check size={16} /> Hoàn Thành &amp; Trở Về Sổ Tay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
