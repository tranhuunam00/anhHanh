import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Volume2,
  Check,
  X,
  ArrowLeft,
  ArrowRight,
  Zap,
  Target,
} from "../../Icons";
import { analyzeWordStress } from "../../../utils/wordStressUtils";
import { getVoiceLang } from "../../../utils/languageVoices";
import "./VocabExerciseStress.css";

export const VocabExerciseStress = ({
  items = [],
  currentIndex = 0,
  score = 0,
  combo = 0,
  onProceed,
  onBackToMenu,
  onClose,
}) => {
  const currentItem = items[currentIndex];

  const [selectedIdx, setSelectedIdx] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Analyze syllables and stress
  const stressData = useMemo(() => {
    if (!currentItem) return null;
    return analyzeWordStress(currentItem.word, currentItem.phonetic);
  }, [currentItem]);

  // Audio pronunciation
  const playWordAudio = useCallback(
    (textToSpeak) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window) || !textToSpeak) return;
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(textToSpeak);
        utter.lang = getVoiceLang(currentItem?.source_lang, textToSpeak);
        utter.rate = 0.85;
        window.speechSynthesis.speak(utter);
      } catch (err) {
        console.warn("Speech playback error:", err);
      }
    },
    [currentItem]
  );

  // Reset question state on card transition
  useEffect(() => {
    setSelectedIdx(null);
    setIsAnswered(false);
    setIsCorrect(false);

    if (currentItem?.word) {
      const timer = setTimeout(() => {
        playWordAudio(currentItem.word);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, currentItem, playWordAudio]);

  // Syllable selection handler
  const handleSelectSyllable = (idx) => {
    if (isAnswered || !stressData) return;
    setSelectedIdx(idx);
    setIsAnswered(true);

    const correct = idx === stressData.stressIndex;
    setIsCorrect(correct);

    // If incorrect, replay audio for listening reinforcement
    if (!correct && currentItem?.word) {
      setTimeout(() => {
        playWordAudio(currentItem.word);
      }, 500);
    }
  };

  const handleNextWord = () => {
    if (!isAnswered) return;
    onProceed(isCorrect, stressData?.stressSyllable);
  };

  // Keyboard shortcuts (1, 2, 3, 4 for syllables, Enter/Space for next)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (!isAnswered && stressData?.options) {
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= stressData.options.length) {
          handleSelectSyllable(num - 1);
        }
      } else if (isAnswered && (e.code === "Space" || e.code === "Enter")) {
        e.preventDefault();
        handleNextWord();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  if (!currentItem || !stressData) {
    return null;
  }

  const progressPercent = items.length > 0 ? Math.round(((currentIndex + 1) / items.length) * 100) : 0;

  return (
    <div className="exercise-modal-backdrop" onClick={onClose}>
      <div
        className="exercise-modal-window"
        style={{ maxWidth: "640px" }}
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
            {combo > 1 && (
              <span className="ex-combo-badge">
                <Zap size={14} color="#f59e0b" /> {combo} Combo
              </span>
            )}
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
            <span className="ex-mode-tag" style={{ background: "rgba(245, 158, 11, 0.12)", color: "#d97706" }}>
              <Target size={14} />
              <span>Dạng 7: Trọng âm từ vựng (Word Stress)</span>
            </span>
          </div>
          <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            Điểm: <strong>{score}</strong>
          </span>
        </div>

        {/* Stress Quiz Arena */}
        <div className="stress-quiz-arena">
          <div className="stress-card">
            <div className="stress-word-display">
              <h2 className="stress-main-word">{currentItem.word}</h2>
              <button
                type="button"
                className="stress-audio-btn"
                onClick={() => playWordAudio(currentItem.word)}
                title="Nghe phát âm"
              >
                <Volume2 size={20} />
              </button>
            </div>

            {stressData.phonetic && (
              <div className="stress-ipa-text">{stressData.phonetic}</div>
            )}

            <div className="stress-question-title">
              🎯 Trọng âm chính rơi vào âm tiết thứ mấy?
            </div>

            {/* Syllables Interactive Buttons */}
            <div className="stress-syllables-grid">
              {stressData.options.map((opt) => {
                let btnCls = "stress-syllable-btn";
                if (isAnswered) {
                  if (opt.index === stressData.stressIndex) {
                    btnCls += " correct";
                  } else if (opt.index === selectedIdx) {
                    btnCls += " incorrect";
                  }
                }
                return (
                  <button
                    key={opt.index}
                    type="button"
                    className={btnCls}
                    disabled={isAnswered}
                    onClick={() => handleSelectSyllable(opt.index)}
                    title={`Chọn âm tiết ${opt.syllableNumber} (Phím ${opt.syllableNumber})`}
                  >
                    <span className="stress-syl-num">Âm {opt.syllableNumber}</span>
                    <span className="stress-syl-text">{opt.syllableText.toUpperCase()}</span>
                  </button>
                );
              })}
            </div>

            {/* Answer Feedback & Stress Rules */}
            {isAnswered && (
              <div className={`stress-feedback-card ${isCorrect ? "correct" : "incorrect"}`}>
                <div className="stress-feedback-title">
                  {isCorrect ? (
                    <>
                      <Check size={18} color="#059669" />
                      <span style={{ color: "#059669" }}>Chính xác! Trọng âm rơi vào âm {stressData.stressNumber} ({stressData.stressSyllable.toUpperCase()})</span>
                    </>
                  ) : (
                    <>
                      <X size={18} color="#dc2626" />
                      <span style={{ color: "#dc2626" }}>Chưa chính xác! Trọng âm rơi vào âm {stressData.stressNumber} ({stressData.stressSyllable.toUpperCase()})</span>
                    </>
                  )}
                </div>
                <div className="stress-feedback-rule">{stressData.ruleExplanation}</div>

                <div className="stress-next-row">
                  <button type="button" className="btn-stress-next" onClick={handleNextWord}>
                    <span>Tiếp tục (Enter)</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
