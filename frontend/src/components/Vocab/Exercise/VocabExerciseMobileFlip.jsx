import React, { useState, useEffect, useCallback } from "react";
import {
  Volume2,
  Check,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Eye,
  ArrowLeft,
  X,
} from "../../Icons";
import { getVoiceLang } from "../../../utils/languageVoices";
import "./VocabExerciseMobileFlip.css";

export const VocabExerciseMobileFlip = ({
  items = [],
  currentIndex = 0,
  onProceed,
  onBackToMenu,
  onClose,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [autoPronounce, setAutoPronounce] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const currentItem = items[currentIndex];

  const playAudio = useCallback(
    (textToSpeak, lang = null) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window) || !textToSpeak) return;
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(textToSpeak);
        utter.lang = getVoiceLang(lang || currentItem?.source_lang, textToSpeak);
        utter.rate = 0.9;
        utter.onstart = () => setIsPlayingAudio(true);
        utter.onend = () => setIsPlayingAudio(false);
        utter.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utter);
      } catch (err) {
        setIsPlayingAudio(false);
      }
    },
    [currentItem]
  );

  // Auto pronounce front word on card transition
  useEffect(() => {
    setIsFlipped(false);
    if (autoPronounce && currentItem?.word) {
      const timer = setTimeout(() => {
        playAudio(currentItem.word, currentItem.source_lang);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, currentItem, autoPronounce, playAudio]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.code === "Space") {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === "1") {
        handleReview(false);
      } else if (e.key === "2") {
        handleReview(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const [touchStartX, setTouchStartX] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null || touchStartY === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    const deltaY = e.changedTouches[0].clientY - touchStartY;
    setTouchStartX(null);
    setTouchStartY(null);

    // If swipe horizontal distance is significant and greater than vertical movement
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        // Swipe Left -> Next word
        onProceed(false, null, 1);
      } else if (currentIndex > 0) {
        // Swipe Right -> Prev word
        onProceed(false, null, -1);
      }
    }
  };

  const handleCardClick = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleReview = (isMastered) => {
    if (!currentItem) return;
    onProceed(isMastered, isMastered ? currentItem.meaning : null);
  };

  if (!currentItem) {
    return null;
  }

  const progressPercent = items.length > 0 ? Math.round(((currentIndex + 1) / items.length) * 100) : 0;

  return (
    <div className="exercise-modal-backdrop" onClick={onClose}>
      <div
        className="exercise-modal-window"
        style={{ maxWidth: "620px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="exercise-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              className="ex-back-menu-btn"
              onClick={onBackToMenu}
              title="Quay lại danh mục chọn dạng bài tập"
            >
              <ArrowLeft size={16} />
              <span>Menu</span>
            </button>
            <div className="ex-header-divider" />
            <div className="ex-progress-bar-wrap" style={{ minWidth: "120px" }}>
              <div className="ex-progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <div className="ex-header-meta">
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--primary)" }}>
              {currentIndex + 1} / {items.length}
            </span>
            <button className="btn-ex-close" onClick={onClose} title="Thoát bài tập">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Sub Banner */}
        <div className="ex-mode-banner">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="ex-mode-tag">
              <Smartphone size={14} />
              <span>Dạng 5: Thẻ di động đi đường</span>
            </span>
          </div>

          <label className="mobile-auto-play-toggle">
            <input
              type="checkbox"
              checked={autoPronounce}
              onChange={(e) => setAutoPronounce(e.target.checked)}
            />
            <span>Tự đọc từ vựng</span>
          </label>
        </div>

        {/* Main 3D Flip Arena */}
        <div className="mobile-flip-container">
          <div
            className="flip-card-scene"
            onClick={handleCardClick}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            title="Chạm bất kỳ đâu trên thẻ để lật mặt xem nghĩa, hoặc vuốt trái/phải để chuyển từ"
          >
            <div className={`flip-card-inner ${isFlipped ? "flipped" : ""}`}>
              {/* Mặt trước: Từ vựng */}
              <div className="flip-card-face flip-card-front">
                <div className="flip-card-badge-row">
                  <span className="flip-pos-pill">
                    {currentItem.part_of_speech || "Từ vựng"}
                  </span>
                  <span className="flip-hint-tap">
                    <Eye size={14} /> Chạm lật nghĩa
                  </span>
                </div>

                <div className="flip-card-center">
                  <h2 className="flip-word-title">{currentItem.word}</h2>
                  <div className="flip-phonetic-row">
                    {currentItem.phonetic && (
                      <span className="flip-phonetic-text">{currentItem.phonetic}</span>
                    )}
                    <button
                      type="button"
                      className="flip-btn-audio"
                      onClick={(e) => {
                        e.stopPropagation();
                        playAudio(currentItem.word, currentItem.source_lang);
                      }}
                      title="Nghe phát âm"
                    >
                      <Volume2 size={20} />
                    </button>
                  </div>
                </div>

                <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                  💡 Phím tắt: <strong>Space</strong> (Lật thẻ) • <strong>1</strong> (Chưa nhớ) • <strong>2</strong> (Đã thuộc)
                </div>
              </div>

              {/* Mặt sau: Nghĩa tiếng Việt & Câu ví dụ */}
              <div className="flip-card-face flip-card-back">
                <div className="flip-card-badge-row">
                  <span className="flip-pos-pill" style={{ background: "rgba(16, 185, 129, 0.1)", color: "#059669" }}>
                    Nghĩa Tiếng Việt
                  </span>
                  <span className="flip-hint-tap">
                    <RotateCcw size={14} /> Chạm lật lại
                  </span>
                </div>

                <div className="flip-card-center">
                  <h3 className="flip-meaning-title">{currentItem.meaning}</h3>

                  {currentItem.context_sentence && (
                    <div className="flip-sentence-box">
                      <div className="flip-sentence-en">{currentItem.context_sentence}</div>
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", justifyContent: "center" }}>
                  <button
                    type="button"
                    className="flip-btn-audio"
                    style={{ width: "36px", height: "36px", background: "#059669" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      playAudio(currentItem.context_sentence || currentItem.word, currentItem.source_lang);
                    }}
                    title="Nghe câu ví dụ"
                  >
                    <Volume2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Review Buttons */}
          <div className="mobile-flip-controls">
            <div className="mobile-action-buttons">
              <button
                type="button"
                className="btn-mobile-review forgot"
                onClick={() => handleReview(false)}
              >
                <RotateCcw size={18} />
                <span>Chưa nhớ (1)</span>
              </button>
              <button
                type="button"
                className="btn-mobile-review mastered"
                onClick={() => handleReview(true)}
              >
                <Check size={18} />
                <span>Đã thuộc (2)</span>
              </button>
            </div>

            <div className="mobile-nav-subrow">
              <button
                type="button"
                className="btn-flip-nav"
                disabled={currentIndex === 0}
                onClick={() => onProceed(false, null, -1)}
              >
                <ChevronLeft size={16} />
                <span>Từ trước</span>
              </button>

              <button
                type="button"
                className="btn-flip-nav"
                onClick={() => onProceed(false, null, 1)}
              >
                <span>Bỏ qua / Kế tiếp</span>
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="flip-swipe-guide">
              <span>👈 Vuốt sang trái để qua từ • Vuốt sang phải để lùi 👉</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
