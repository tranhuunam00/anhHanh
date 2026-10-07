import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  X,
  Volume2,
  Trophy,
  Flame,
  Check,
  RotateCcw,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { submitVocabReviewResult } from "../../services/authVocabService";
import "./VocabExerciseHubModal.css";

// Rich fallback Vietnamese meanings for distractors if user has fewer than 4 saved words
const FALLBACK_DISTRACTORS = [
  "nhu cầu cấp bách",
  "phát triển bền vững",
  "cơ hội tiềm năng",
  "thành tựu đáng kể",
  "nỗ lực không ngừng",
  "chính sách đổi mới",
  "kết quả bất ngờ",
  "tác động tiêu cực",
  "sự cải thiện",
  "quyết định quan trọng",
  "bằng chứng rõ ràng",
  "nguồn cảm hứng",
  "thách thức lớn",
  "sự cân bằng",
  "tiến trình thực hiện",
  "giải pháp tối ưu",
  "phương pháp tiếp cận",
  "mục tiêu dài hạn",
  "trách nhiệm xã hội",
  "sự tin cậy",
  "được coi là đương nhiên",
  "thanh lịch, tao nhã",
  "tràn ngập, dồi dào",
  "tập trung cao độ",
];

export default function VocabExerciseHubModal({
  vocabPool = [],
  token = null,
  onClose,
  onFinished,
}) {
  const [items, setItems] = useState(() => {
    if (!vocabPool || vocabPool.length === 0) return [];
    // Shuffle the items for variety
    return [...vocabPool].sort(() => Math.random() - 0.5);
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Per-question interactive state
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Review history tracking for end-of-exercise summary
  const [resultsHistory, setResultsHistory] = useState([]);

  const currentItem = items[currentIndex];

  // Helper: native audio speech synthesis
  const playAudio = useCallback((wordToSpeak) => {
    if (!("speechSynthesis" in window) || !wordToSpeak) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(wordToSpeak);
      utter.lang = "en-US";
      utter.rate = 0.9;
      utter.onstart = () => setIsPlayingAudio(true);
      utter.onend = () => setIsPlayingAudio(false);
      utter.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utter);
    } catch (err) {
      console.warn("Audio playback notice:", err);
      setIsPlayingAudio(false);
    }
  }, []);

  // Generate 4 randomized multiple choice options (1 correct + 3 distinct distractors)
  const mcqOptions = useMemo(() => {
    if (!currentItem || !currentItem.meaning) return [];

    const correctMeaning = currentItem.meaning.trim();

    // 1. Collect candidate distractors from other words in the current pool
    const otherMeanings = items
      .filter((it) => it.id !== currentItem.id && it.meaning && it.meaning.trim() !== correctMeaning)
      .map((it) => it.meaning.trim());

    // 2. Add fallback distractors to ensure at least 3 distinct wrong options
    const candidateDistractors = Array.from(new Set([...otherMeanings, ...FALLBACK_DISTRACTORS]))
      .filter((m) => m !== correctMeaning)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    // 3. Combine with correct answer and shuffle
    const combined = [...candidateDistractors, correctMeaning];
    return combined.sort(() => Math.random() - 0.5);
  }, [currentItem, items]);

  // Reset and auto-play audio when moving to a new word
  useEffect(() => {
    setSelectedOption(null);
    setIsAnswered(false);

    if (currentItem && currentItem.word) {
      // Short delay for smooth modal mount / transition
      const timer = setTimeout(() => {
        playAudio(currentItem.word);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, currentItem, playAudio]);

  // Handle progression to the next question
  const proceedNext = useCallback(
    async (correct) => {
      if (correct) {
        setScore((s) => s + 1);
        setCombo((c) => {
          const next = c + 1;
          setMaxCombo((m) => Math.max(m, next));
          return next;
        });
      } else {
        setCombo(0);
      }

      // Sync SRS progress to backend if authenticated
      if (token && currentItem && currentItem.id) {
        try {
          await submitVocabReviewResult(currentItem.id, correct, token);
        } catch (err) {
          console.debug("SRS result sync skipped:", err);
        }
      }

      // Record in local history
      setResultsHistory((prev) => [
        ...prev,
        {
          id: currentItem.id,
          word: currentItem.word,
          meaning: currentItem.meaning,
          phonetic: currentItem.phonetic,
          isCorrect: correct,
        },
      ]);

      // Move to next word or finish
      if (currentIndex + 1 < items.length) {
        setCurrentIndex((i) => i + 1);
      } else {
        setIsFinished(true);
        if (onFinished) onFinished();
      }
    },
    [currentIndex, currentItem, items.length, onFinished, token]
  );

  // Handle user clicking an option
  const handleSelectOption = useCallback(
    (opt) => {
      if (isAnswered || !currentItem) return;

      setSelectedOption(opt);
      setIsAnswered(true);

      const correct = opt.trim().toLowerCase() === currentItem.meaning.trim().toLowerCase();

      // Auto-advance after 950ms so user can clearly see correct/wrong feedback
      setTimeout(() => {
        proceedNext(correct);
      }, 950);
    },
    [currentItem, isAnswered, proceedNext]
  );

  // Keyboard navigation shortcuts: keys 1, 2, 3, 4 to select, Space to replay audio
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isFinished || isAnswered) return;

      if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        if (currentItem?.word) playAudio(currentItem.word);
        return;
      }

      const keyIndex = ["1", "2", "3", "4"].indexOf(e.key);
      if (keyIndex !== -1 && mcqOptions[keyIndex]) {
        e.preventDefault();
        handleSelectOption(mcqOptions[keyIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSelectOption, isAnswered, isFinished, mcqOptions, currentItem, playAudio]);

  // Restart exercise from beginning
  const handleRestart = () => {
    setItems((prev) => [...prev].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setIsFinished(false);
    setSelectedOption(null);
    setIsAnswered(false);
    setResultsHistory([]);
  };

  // 1. Empty state
  if (items.length === 0) {
    return (
      <div className="exercise-modal-backdrop" onClick={onClose}>
        <div className="exercise-modal-window" onClick={(e) => e.stopPropagation()}>
          <div className="ex-summary-wrap">
            <CheckCircle2 size={54} color="#10b981" />
            <h2 style={{ margin: "14px 0 6px 0", fontWeight: 800 }}>Sổ tay của bạn chưa có từ vựng nào!</h2>
            <p style={{ color: "#94a3b8", fontSize: "0.95rem", maxWidth: "420px", margin: "0 auto 20px" }}>
              Hãy thêm từ mới hoặc sử dụng tính năng <strong>AI Tách & Import</strong> để đưa từ vựng vào sổ tay rồi bắt đầu luyện tập.
            </p>
            <button className="btn-primary" onClick={onClose} style={{ padding: "10px 24px", borderRadius: "12px" }}>
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Summary Screen (when all words are completed)
  if (isFinished) {
    const accuracy = Math.round((score / items.length) * 100);
    return (
      <div className="exercise-modal-backdrop" onClick={onClose}>
        <div className="exercise-modal-window" onClick={(e) => e.stopPropagation()}>
          <div className="exercise-header">
            <h3 style={{ margin: 0, fontWeight: 800, fontSize: "1.1rem" }}>Kết Quả Luyện Tập Từ Vựng</h3>
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
            <p style={{ color: "#94a3b8", margin: "0 0 16px", fontSize: "0.9rem" }}>
              Đã ghi nhận kết quả vào bộ nhớ ngắt quãng SRS để củng cố trí nhớ dài hạn.
            </p>

            <div className="ex-stats-row">
              <div className="ex-stat-card">
                <span className="ex-stat-num">
                  {score} / {items.length}
                </span>
                <span className="ex-stat-title">Trả lời đúng</span>
              </div>
              <div className="ex-stat-card">
                <span className="ex-stat-num">{accuracy}%</span>
                <span className="ex-stat-title">Độ chính xác</span>
              </div>
              <div className="ex-stat-card">
                <span className="ex-stat-num">{maxCombo} 🔥</span>
                <span className="ex-stat-title">Combo cao nhất</span>
              </div>
            </div>

            {/* List of reviewed words with status */}
            <div className="ex-history-list">
              <div className="ex-history-title">Danh sách từ đã luyện tập ({resultsHistory.length} từ):</div>
              <div className="ex-history-items-box">
                {resultsHistory.map((item, idx) => (
                  <div key={idx} className={`ex-history-row ${item.isCorrect ? "correct" : "wrong"}`}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span className={`ex-status-pill ${item.isCorrect ? "correct" : "wrong"}`}>
                        {item.isCorrect ? "ĐÚNG" : "CHƯA ĐÚNG"}
                      </span>
                      <strong style={{ color: "#f8fafc", fontSize: "0.95rem" }}>{item.word}</strong>
                      {item.phonetic && <span style={{ color: "#818cf8", fontSize: "0.82rem" }}>{item.phonetic}</span>}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ color: "#cbd5e1", fontSize: "0.9rem" }}>{item.meaning}</span>
                      <button
                        type="button"
                        onClick={() => playAudio(item.word)}
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

            <div style={{ display: "flex", gap: "12px", marginTop: "18px", flexWrap: "wrap", justifyContent: "center" }}>
              <button
                type="button"
                className="ex-btn-secondary"
                onClick={handleRestart}
                style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
              >
                <RotateCcw size={16} /> Luyện tập lại từ đầu
              </button>
              <button
                type="button"
                className="ex-btn-primary"
                onClick={onClose}
                style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
              >
                <Check size={16} /> Hoàn Thành & Trở Về Sổ Tay
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Question Card (Dạng 1: Từ tiếng Anh -> Nghĩa tiếng Việt)
  const progressPercent = Math.round(((currentIndex + 1) / items.length) * 100);

  return (
    <div className="exercise-modal-backdrop" onClick={onClose}>
      <div className="exercise-modal-window" onClick={(e) => e.stopPropagation()}>
        {/* Top Header with Progress & Score */}
        <div className="exercise-header">
          <div className="ex-progress-wrapper">
            <div className="ex-progress-track">
              <div className="ex-progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <div className="ex-header-meta">
            <div className="ex-score-badge">
              <Trophy size={14} />
              <span>
                {score} / {items.length}
              </span>
            </div>

            {combo > 1 && (
              <div className="ex-combo-badge">
                <Flame size={14} />
                <span>{combo} COMBO</span>
              </div>
            )}

            <button className="btn-ex-close" onClick={onClose} title="Thoát bài tập">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Sub-header Banner */}
        <div className="ex-mode-banner">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span className="ex-mode-tag">
              🎯 Trắc nghiệm Từ -&gt; Nghĩa
            </span>
            <span className="ex-group-tag">Nhóm: Trắc nghiệm</span>
          </div>
          <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
            Câu <strong>{currentIndex + 1}</strong> / {items.length}
          </div>
        </div>

        {/* Main Exercise Arena: DẠNG 1 EXACT LAYOUT */}
        <div className="exercise-body">
          <div className="ex-question-card">
            {/* Target English Word + Audio Speaker Button */}
            <div className="ex-target-word">
              <span>{currentItem.word}</span>
              <button
                type="button"
                className={`ex-audio-circle-btn ${isPlayingAudio ? "playing" : ""}`}
                onClick={() => playAudio(currentItem.word)}
                title="Nghe phát âm (Phím Space)"
              >
                <Volume2 size={22} />
              </button>
            </div>

            {/* IPA Phonetic */}
            {currentItem.phonetic && (
              <div className="ex-target-ipa">{currentItem.phonetic}</div>
            )}

            {/* Context Sentence Quote Box */}
            {currentItem.context_sentence && (
              <div className="ex-context-quote">
                “{currentItem.context_sentence}”
              </div>
            )}

            {/* 4 Multiple Choice Options (2x2 Grid) */}
            <div className="ex-mcq-grid">
              {mcqOptions.map((opt, i) => {
                const isSelected = selectedOption === opt;
                const isCorrectOption = opt.trim().toLowerCase() === currentItem.meaning.trim().toLowerCase();

                let stateClass = "";
                if (isAnswered) {
                  if (isSelected) {
                    stateClass = isCorrectOption ? "correct" : "wrong";
                  } else if (isCorrectOption) {
                    // Reveal the correct answer in green even if user chose wrong
                    stateClass = "correct";
                  }
                }

                return (
                  <button
                    key={i}
                    type="button"
                    className={`ex-mcq-btn ${stateClass}`}
                    onClick={() => handleSelectOption(opt)}
                    disabled={isAnswered}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span className="ex-mcq-key-badge">{i + 1}</span>
                      <span className="ex-mcq-text">{opt}</span>
                    </div>

                    {isAnswered && (
                      <span className="ex-mcq-feedback-icon">
                        {isCorrectOption ? (
                          <Check size={18} color="#10b981" />
                        ) : isSelected ? (
                          <X size={18} color="#ef4444" />
                        ) : null}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Keyboard shortcut tip */}
            <div className="ex-keyboard-hint">
              <span>💡 Mẹo: Bấm phím <strong>1, 2, 3, 4</strong> để chọn nhanh • Phím <strong>Space</strong> để nghe lại phát âm</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
