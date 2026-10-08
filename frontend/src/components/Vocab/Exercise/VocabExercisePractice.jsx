import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  X,
  Volume2,
  Trophy,
  Flame,
  Check,
  Eye,
  EyeOff,
  ArrowLeft,
  Target,
  Sparkles,
  Lightbulb,
  Globe,
} from "../../Icons";
import {
  EXERCISE_FORMATS,
  generateD1Options,
  generateD2Options,
  generateD3Options,
  getD3ClozeSentence,
  maskTargetWordInSentence,
  isAnswerCorrect,
} from "../../../utils/vocabExerciseGenerators";
import { playSoundFeedback } from "../../../utils/vocabAudioFeedback";
import { getVoiceLang, getLanguageLabel } from "../../../utils/languageVoices";

export const VocabExercisePractice = ({
  format = EXERCISE_FORMATS.D1,
  items = [],
  currentIndex = 0,
  score = 0,
  combo = 0,
  onProceed,
  onBackToMenu,
  onClose,
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showContext, setShowContext] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const currentItem = items[currentIndex];

  // Helper: native audio speech synthesis
  const playAudio = useCallback(
    (wordToSpeak, wordLang = null) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window) || !wordToSpeak) return;
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(wordToSpeak);
        utter.lang = getVoiceLang(wordLang || currentItem?.source_lang, wordToSpeak);
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

  // Generate 4 randomized multiple-choice options according to format
  const mcqOptions = useMemo(() => {
    if (!currentItem) return [];
    if (format === EXERCISE_FORMATS.D3) {
      return generateD3Options(currentItem, items);
    }
    if (format === EXERCISE_FORMATS.D2) {
      return generateD2Options(currentItem, items);
    }
    return generateD1Options(currentItem, items);
  }, [currentItem, format, items]);

  // Compute cloze sentence data for Dạng 3
  const clozeData = useMemo(() => {
    if (format !== EXERCISE_FORMATS.D3 || !currentItem) return null;
    return getD3ClozeSentence(currentItem);
  }, [currentItem, format]);

  // Reset per-question state and auto-play audio for Dạng 1
  useEffect(() => {
    setSelectedOption(null);
    setIsAnswered(false);
    setShowContext(false);

    if (format === EXERCISE_FORMATS.D1 && currentItem?.word) {
      const timer = setTimeout(() => {
        playAudio(currentItem.word, currentItem.source_lang);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, currentItem, format, playAudio]);

  // Handle user selecting an option
  const handleSelectOption = useCallback(
    (opt) => {
      if (isAnswered || !currentItem) return;

      setSelectedOption(opt);
      setIsAnswered(true);

      const correct = isAnswerCorrect(opt, currentItem, format);

      // Phát âm thanh phản hồi đúng/sai tức thì qua Web Audio API
      playSoundFeedback(correct);

      // Ở Dạng 2 & Dạng 3, phát âm thanh từ vựng chuẩn ngay khi chọn
      if ((format === EXERCISE_FORMATS.D2 || format === EXERCISE_FORMATS.D3) && currentItem.word) {
        playAudio(currentItem.word, currentItem.source_lang);
      }

      // Tự động chuyển câu sau 950ms để người học kịp quan sát kết quả
      setTimeout(() => {
        onProceed(correct, opt);
      }, 950);
    },
    [currentItem, format, isAnswered, onProceed, playAudio]
  );

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isAnswered) return;

      // Escape: toggle context hint
      if (e.key === "Escape" || e.key === "Esc") {
        e.preventDefault();
        setShowContext((prev) => !prev);
        return;
      }

      // Ctrl or Space: replay audio
      if (e.key === "Control" || (e.ctrlKey && !e.altKey && !e.shiftKey) || e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        if (currentItem?.word) playAudio(currentItem.word, currentItem.source_lang);
        return;
      }

      // Number keys 1-4: select option
      const keyIndex = ["1", "2", "3", "4"].indexOf(e.key);
      if (keyIndex !== -1 && mcqOptions[keyIndex]) {
        e.preventDefault();
        handleSelectOption(mcqOptions[keyIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentItem, handleSelectOption, isAnswered, mcqOptions, playAudio]);

  if (!currentItem) return null;

  const progressPercent = items.length > 0 ? Math.round(((currentIndex + 1) / items.length) * 100) : 0;
  const isD1 = format === EXERCISE_FORMATS.D1;
  const isD2 = format === EXERCISE_FORMATS.D2;
  const isD3 = format === EXERCISE_FORMATS.D3;
  const langLabel = getLanguageLabel(currentItem.source_lang);

  return (
    <div className="exercise-modal-backdrop" onClick={onClose}>
      <div className="exercise-modal-window" onClick={(e) => e.stopPropagation()}>
        {/* Top Header */}
        <div className="exercise-header">
          <button
            type="button"
            className="ex-back-menu-btn"
            onClick={onBackToMenu}
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
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <span className="ex-mode-tag">
              {isD3 ? (
                <>
                  <Lightbulb size={14} />
                  <span>Dạng 3: Điền từ vào câu ngữ cảnh</span>
                </>
              ) : isD2 ? (
                <>
                  <Sparkles size={14} />
                  <span>Dạng 2: Nghĩa VN ➔ Chọn Từ vựng</span>
                </>
              ) : (
                <>
                  <Target size={14} />
                  <span>Dạng 1: Từ vựng ➔ Nghĩa tiếng Việt</span>
                </>
              )}
            </span>

            <span className="ex-lang-tag">
              <Globe size={13} />
              <span>{langLabel}</span>
            </span>
          </div>

          <div className="ex-counter-tag">
            Câu <strong>{currentIndex + 1}</strong> / {items.length}
          </div>
        </div>

        {/* Main Exercise Arena */}
        <div className="exercise-body">
          <div className="ex-question-card">
            {/* Question Display for Dạng 1 vs Dạng 2 vs Dạng 3 */}
            {isD3 ? (
              /* DẠNG 3: ĐIỀN TỪ VÀO CÂU NGỮ CẢNH (CLOZE TEST) */
              <div className="ex-target-cloze-wrap">
                <div className="ex-cloze-prompt-label">
                  <Lightbulb size={14} color="var(--primary)" />
                  <span>Chọn từ vựng thích hợp nhất để điền vào chỗ trống:</span>
                </div>

                <div className="ex-cloze-sentence-display">
                  “
                  {(() => {
                    const clozeText = clozeData?.clozeSentence || maskTargetWordInSentence(currentItem.context_sentence, currentItem.word);
                    const parts = clozeText.split("[ ______ ]");
                    if (isAnswered) {
                      return (
                        <>
                          {parts.map((p, idx) => (
                            <React.Fragment key={idx}>
                              {p}
                              {idx < parts.length - 1 && (
                                <span className="ex-cloze-blank-filled">
                                  {currentItem.word}
                                </span>
                              )}
                            </React.Fragment>
                          ))}
                        </>
                      );
                    }
                    return (
                      <>
                        {parts.map((p, idx) => (
                          <React.Fragment key={idx}>
                            {p}
                            {idx < parts.length - 1 && (
                              <span className="ex-cloze-blank-box">[ ______ ]</span>
                            )}
                          </React.Fragment>
                        ))}
                      </>
                    );
                  })()}
                  ”
                </div>

                <div className="ex-cloze-hint-row">
                  <div className="ex-cloze-meaning-badge">
                    <span className="ex-cloze-hint-tag">Nghĩa:</span>
                    <strong>{currentItem.meaning}</strong>
                  </div>

                  {currentItem.phonetic && (
                    <span className="ex-cloze-ipa-badge">{currentItem.phonetic}</span>
                  )}

                  {isAnswered && (
                    <button
                      type="button"
                      className={`ex-audio-mini-btn ${isPlayingAudio ? "playing" : ""}`}
                      onClick={() => playAudio(currentItem.word, currentItem.source_lang)}
                      title="Nghe phát âm từ này"
                    >
                      <Volume2 size={16} />
                    </button>
                  )}
                </div>

                {isAnswered && clozeData?.translation && (
                  <div className="ex-cloze-translation-box">
                    <span className="ex-cloze-trans-label">Dịch câu:</span> “{clozeData.translation}”
                  </div>
                )}
              </div>
            ) : isD2 ? (
              /* DẠNG 2: HIỂN THỊ NGHĨA TIẾNG VIỆT CẦN GỢI NHỚ */
              <div className="ex-target-meaning-wrap">
                <div className="ex-target-meaning-label">Nghĩa tiếng Việt cần gợi nhớ:</div>
                <div className="ex-target-meaning-text">“{currentItem.meaning}”</div>

                {/* Optional thumbnail image if word has an image */}
                {currentItem.image_url && (
                  <div className="ex-target-thumb-wrap">
                    <img
                      src={currentItem.image_url}
                      alt={currentItem.word}
                      className="ex-target-thumb"
                    />
                  </div>
                )}

                {/* Speaker button to listen after answering */}
                {isAnswered && (
                  <div className="ex-target-revealed-row">
                    <span className="ex-revealed-word">{currentItem.word}</span>
                    {currentItem.phonetic && (
                      <span className="ex-revealed-ipa">{currentItem.phonetic}</span>
                    )}
                    <button
                      type="button"
                      className={`ex-audio-mini-btn ${isPlayingAudio ? "playing" : ""}`}
                      onClick={() => playAudio(currentItem.word, currentItem.source_lang)}
                      title="Nghe phát âm từ này"
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* DẠNG 1: HIỂN THỊ TỪ VỰNG TIẾNG ANH / NGUỒN */
              <>
                <div className="ex-target-word">
                  <span>{currentItem.word}</span>
                  <button
                    type="button"
                    className={`ex-audio-circle-btn ${isPlayingAudio ? "playing" : ""}`}
                    onClick={() => playAudio(currentItem.word, currentItem.source_lang)}
                    title="Nghe phát âm (Phím Ctrl)"
                  >
                    <Volume2 size={22} />
                  </button>
                </div>

                {currentItem.phonetic && (
                  <div className="ex-target-ipa">{currentItem.phonetic}</div>
                )}
              </>
            )}

            {/* GỢI Ý CÂU NGỮ CẢNH CHO DẠNG 1 & DẠNG 2 (MẶC ĐỊNH ẨN) */}
            {!isD3 && currentItem.context_sentence && (
              <div className="ex-context-container">
                <button
                  type="button"
                  className={`ex-eye-hint-btn ${showContext ? "active" : ""}`}
                  onClick={() => setShowContext((prev) => !prev)}
                  title="Nhấn phím Esc hoặc bấm để bật/tắt gợi ý câu ví dụ"
                >
                  {showContext ? (
                    <>
                      <EyeOff size={15} />
                      <span>Ẩn gợi ý ngữ cảnh (Phím Esc)</span>
                    </>
                  ) : (
                    <>
                      <Eye size={15} />
                      <span>
                        {isD2
                          ? "Gợi ý câu có che từ [ ______ ] (Phím Esc)"
                          : "Gợi ý trong câu (Mặc định ẩn • Phím Esc)"}
                      </span>
                    </>
                  )}
                </button>

                {showContext && (
                  <div className="ex-context-quote">
                    “
                    {isD2
                      ? maskTargetWordInSentence(currentItem.context_sentence, currentItem.word)
                      : currentItem.context_sentence}
                    ”
                  </div>
                )}
              </div>
            )}

            {/* 4 Multiple Choice Options (2x2 Grid) */}
            <div className="ex-mcq-grid">
              {mcqOptions.map((opt, i) => {
                const isSelected = selectedOption === opt;
                const isCorrectOption = isAnswerCorrect(opt, currentItem, format);

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
              <Lightbulb size={14} style={{ verticalAlign: "middle", marginRight: 4 }} />
              <span>
                Mẹo: Bấm <strong>1, 2, 3, 4</strong> để chọn • <strong>Ctrl</strong> nghe lại • <strong>Esc</strong> bật/tắt gợi ý
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
