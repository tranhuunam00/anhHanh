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
  Eye,
  EyeOff,
  ArrowLeft,
  BookOpen,
  ArrowRight,
  Layers,
} from "../Icons";
import { submitVocabReviewResult, fetchPracticeSession } from "../../services/authVocabService";
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

const QUANTITY_OPTIONS = [20, 40, 60, 80, "ALL"];

export default function VocabExerciseHubModal({
  vocabPool = [],
  token = null,
  onClose,
  onFinished,
}) {
  // Navigation View: "MENU" (Card selection) | "PRACTICE" (Interactive session) | "SUMMARY" (Results)
  const [viewMode, setViewMode] = useState("MENU");

  // Quantity option selected in Dạng 1 card: 20, 40, 60, 80 or "ALL"
  const [selectedLimit, setSelectedLimit] = useState(20);
  const [isLoadingSession, setIsLoadingSession] = useState(false);

  // Active practice session words
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);

  // Per-question interactive state
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Eye toggle: Mặc định là ẨN (false)
  const [showContext, setShowContext] = useState(false);

  // Review history tracking for summary
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

    // If backend already enriched options, use them directly
    if (Array.isArray(currentItem.options) && currentItem.options.length >= 4) {
      return currentItem.options;
    }

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

  // Reset per-question state and auto-play audio when moving to a new word
  useEffect(() => {
    if (viewMode !== "PRACTICE") return;

    setSelectedOption(null);
    setIsAnswered(false);
    setShowContext(false); // Mặc định ẩn ngữ cảnh cho câu mới

    if (currentItem && currentItem.word) {
      const timer = setTimeout(() => {
        playAudio(currentItem.word);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, currentItem, playAudio, viewMode]);

  // Start practice session with selected quantity
  const handleStartPractice = async () => {
    setIsLoadingSession(true);
    try {
      let sessionWords = [];

      // 1. If user is authenticated, request BE to randomly sample
      if (token) {
        const limitParam = selectedLimit === "ALL" ? null : selectedLimit;
        const res = await fetchPracticeSession(limitParam, "ALL", token);
        if (res && Array.isArray(res.items) && res.items.length > 0) {
          sessionWords = res.items;
        }
      }

      // 2. Fallback to client pool if not logged in or BE returned empty
      if (sessionWords.length === 0 && vocabPool && vocabPool.length > 0) {
        let poolCopy = [...vocabPool];
        // Shuffle pool
        poolCopy.sort(() => Math.random() - 0.5);

        if (selectedLimit !== "ALL" && typeof selectedLimit === "number") {
          sessionWords = poolCopy.slice(0, selectedLimit);
        } else {
          sessionWords = poolCopy;
        }
      }

      if (sessionWords.length === 0) {
        alert("Sổ tay của bạn chưa có từ vựng nào để luyện tập!");
        setIsLoadingSession(false);
        return;
      }

      setItems(sessionWords);
      setCurrentIndex(0);
      setScore(0);
      setCombo(0);
      setMaxCombo(0);
      setSelectedOption(null);
      setIsAnswered(false);
      setShowContext(false);
      setResultsHistory([]);
      setViewMode("PRACTICE");
    } catch (err) {
      console.error("Error starting practice session:", err);
      // Fallback: use whatever is in vocabPool
      if (vocabPool.length > 0) {
        const shuffled = [...vocabPool].sort(() => Math.random() - 0.5);
        const limitCount = selectedLimit === "ALL" ? shuffled.length : Math.min(selectedLimit, shuffled.length);
        setItems(shuffled.slice(0, limitCount));
        setViewMode("PRACTICE");
      }
    } finally {
      setIsLoadingSession(false);
    }
  };

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
        setViewMode("SUMMARY");
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

  // Keyboard navigation shortcuts: keys 1, 2, 3, 4 to select, Space to replay audio, H to toggle hint
  useEffect(() => {
    if (viewMode !== "PRACTICE") return;

    const handleKeyDown = (e) => {
      if (isAnswered) return;

      // Spacebar: replay audio
      if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        if (currentItem?.word) playAudio(currentItem.word);
        return;
      }

      // H key: toggle context sentence hint
      if (e.key === "h" || e.key === "H") {
        e.preventDefault();
        setShowContext((prev) => !prev);
        return;
      }

      // 1-4 keys: select option
      const keyIndex = ["1", "2", "3", "4"].indexOf(e.key);
      if (keyIndex !== -1 && mcqOptions[keyIndex]) {
        e.preventDefault();
        handleSelectOption(mcqOptions[keyIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSelectOption, isAnswered, mcqOptions, currentItem, playAudio, viewMode]);

  // Restart practice session
  const handleRestart = () => {
    setItems((prev) => [...prev].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowContext(false);
    setResultsHistory([]);
    setViewMode("PRACTICE");
  };

  // Back to Menu view
  const handleBackToMenu = () => {
    setViewMode("MENU");
  };

  const totalPoolWords = vocabPool.length;

  // -------------------------------------------------------------
  // VIEW 1: MENU CARD SELECTION (Chọn dạng bài tập & Số lượng)
  // -------------------------------------------------------------
  if (viewMode === "MENU") {
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
                  Sổ tay có <strong>{totalPoolWords} từ vựng</strong> • Chọn dạng bài tập để bắt đầu
                </span>
              </div>
            </div>
            <button className="btn-ex-close" onClick={onClose} title="Đóng">
              <X size={20} />
            </button>
          </div>

          {/* Menu Body */}
          <div className="exercise-body">
            <div className="ex-menu-container">
              <div className="ex-menu-headline">
                <h4>Chọn hình thức bài tập luyện tập</h4>
                <p>Hệ thống hỗ trợ rèn luyện trí nhớ từ vựng qua phản xạ trắc nghiệm chuẩn phương pháp.</p>
              </div>

              {/* Format Cards Grid: Currently 1 active format */}
              <div className="ex-cards-grid">
                {/* DẠNG 1: CARD DUY NHẤT HIỆN TẠI */}
                <div className="ex-format-card active">
                  <div className="ex-format-badge">
                    <span className="ex-pill-badge active">
                      🎯 Dạng 1 • Chuẩn phương pháp
                    </span>
                    <span className="ex-pill-tag">Trắc nghiệm Phản xạ</span>
                  </div>

                  <h3 className="ex-format-title">Từ tiếng Anh ➔ Nghĩa tiếng Việt</h3>
                  <p className="ex-format-desc">
                    Quan sát từ tiếng Anh & phiên âm IPA, suy luận nghĩa tiếng Việt qua 4 phương án.
                    Có nút <strong>con mắt 👁️ gợi ý câu ngữ cảnh</strong> (mặc định ẩn).
                  </p>

                  {/* Visual Preview Box */}
                  <div className="ex-preview-box">
                    <div className="ex-preview-word-row">
                      <span className="ex-preview-word">desperate need</span>
                      <span className="ex-preview-ipa">/dˈɛsprɪt nˈid/</span>
                    </div>
                    <div className="ex-preview-eye-demo">
                      <Eye size={13} />
                      <span>Gợi ý câu ngữ cảnh (Mặc định ẩn, bấm để mở)</span>
                    </div>
                    <div className="ex-preview-options-grid">
                      <div className="ex-preview-opt">A. tràn ngập</div>
                      <div className="ex-preview-opt correct">B. nhu cầu tuyệt vọng ✓</div>
                      <div className="ex-preview-opt">C. thanh lịch, tao nhã</div>
                      <div className="ex-preview-opt">D. được coi là đương nhiên</div>
                    </div>
                  </div>

                  {/* Quantity Selector: 20, 40, 60, 80 hoặc Tất cả */}
                  <div className="ex-quantity-section">
                    <div className="ex-quantity-label">
                      <span>Chọn số lượng câu hỏi luyện tập:</span>
                      <span className="ex-quantity-subtext">
                        {selectedLimit === "ALL"
                          ? `Tất cả (${totalPoolWords} từ)`
                          : `${Math.min(selectedLimit, totalPoolWords || selectedLimit)} từ`}
                      </span>
                    </div>

                    <div className="ex-quantity-pills">
                      {QUANTITY_OPTIONS.map((opt) => {
                        const isSelected = selectedLimit === opt;
                        const label = opt === "ALL" ? `Tất cả (${totalPoolWords})` : `${opt} từ`;
                        return (
                          <button
                            key={opt}
                            type="button"
                            className={`ex-quantity-btn ${isSelected ? "selected" : ""}`}
                            onClick={() => setSelectedLimit(opt)}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>

                    <div className="ex-quantity-helper">
                      💡 Nếu chọn số lượng nhỏ hơn tổng số từ ({totalPoolWords} từ), hệ thống sẽ tự động <strong>random ngẫu nhiên</strong> từ trong Sổ tay của bạn.
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    type="button"
                    className="ex-start-btn"
                    onClick={handleStartPractice}
                    disabled={isLoadingSession || totalPoolWords === 0}
                  >
                    {isLoadingSession ? (
                      <span>Đang chuẩn bị câu hỏi ngẫu nhiên...</span>
                    ) : (
                      <>
                        <span>Bắt đầu Luyện tập ngay</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: SUMMARY SCREEN (Sau khi làm xong bài)
  // -------------------------------------------------------------
  if (viewMode === "SUMMARY") {
    const accuracy = Math.round((score / items.length) * 100);
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
                      <strong style={{ fontSize: "0.95rem" }}>{item.word}</strong>
                      {item.phonetic && <span className="ex-history-ipa">{item.phonetic}</span>}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{item.meaning}</span>
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
                onClick={handleBackToMenu}
                style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
              >
                <ArrowLeft size={16} /> Chọn dạng / số lượng khác
              </button>
              <button
                type="button"
                className="ex-btn-secondary"
                onClick={handleRestart}
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
                <Check size={16} /> Hoàn Thành & Trở Về Sổ Tay
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 3: PRACTICE SESSION (DẠNG 1 CHUẨN HOÁ)
  // -------------------------------------------------------------
  const progressPercent = items.length > 0 ? Math.round(((currentIndex + 1) / items.length) * 100) : 0;

  return (
    <div className="exercise-modal-backdrop" onClick={onClose}>
      <div className="exercise-modal-window" onClick={(e) => e.stopPropagation()}>
        {/* Top Header with Back to Menu, Progress, Score & Close */}
        <div className="exercise-header">
          <button
            type="button"
            className="ex-back-menu-btn"
            onClick={handleBackToMenu}
            title="Quay lại menu chọn dạng"
          >
            <ArrowLeft size={16} />
            <span>Menu dạng</span>
          </button>

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
              🎯 Dạng 1: Trắc nghiệm Từ ➔ Nghĩa
            </span>
          </div>
          <div className="ex-counter-tag">
            Câu <strong>{currentIndex + 1}</strong> / {items.length}
          </div>
        </div>

        {/* Main Exercise Arena */}
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

            {/* CON MẮT GỢI Ý CÂU NGỮ CẢNH: MẶC ĐỊNH ẨN */}
            {currentItem.context_sentence && (
              <div className="ex-context-container">
                <button
                  type="button"
                  className={`ex-eye-hint-btn ${showContext ? "active" : ""}`}
                  onClick={() => setShowContext((prev) => !prev)}
                  title="Nhấn phím H hoặc bấm để bật/tắt gợi ý câu ví dụ"
                >
                  {showContext ? (
                    <>
                      <EyeOff size={15} />
                      <span>Ẩn gợi ý ngữ cảnh (Phím H)</span>
                    </>
                  ) : (
                    <>
                      <Eye size={15} />
                      <span>Gợi ý trong câu (Mặc định ẩn • Phím H)</span>
                    </>
                  )}
                </button>

                {showContext && (
                  <div className="ex-context-quote">
                    “{currentItem.context_sentence}”
                  </div>
                )}
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
                          <Check size={18} color="var(--success, #10b981)" />
                        ) : isSelected ? (
                          <X size={18} color="var(--danger, #ef4444)" />
                        ) : null}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Keyboard shortcut tip */}
            <div className="ex-keyboard-hint">
              <span>💡 Mẹo: Bấm <strong>1, 2, 3, 4</strong> để chọn • <strong>Space</strong> nghe lại • <strong>H</strong> bật/tắt mắt gợi ý</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
