import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Volume2,
  Check,
  X,
  Eye,
  EyeOff,
  Lightbulb,
  ArrowRight,
  HelpCircle,
  Keyboard,
} from "../../Icons";
import { maskTargetWordInSentence } from "../../../utils/vocabExerciseGenerators";
import {
  checkSpellerAnswer,
  getNextSpellerHint,
  getSpellerLetterSlots,
} from "../../../utils/spellerUtils";
import "./VocabExerciseSpeller.css";

export const VocabExerciseSpeller = ({
  currentItem,
  isAnswered,
  selectedOption,
  onSubmitAnswer,
  onProceedNext,
  playAudio,
  isPlayingAudio,
  showContext,
  setShowContext,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [shakeError, setShakeError] = useState(false);
  const inputRef = useRef(null);

  // Reset input and autofocus whenever question changes
  useEffect(() => {
    setInputValue("");
    setShakeError(false);
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 150);
    return () => clearTimeout(timer);
  }, [currentItem?.id, currentItem?.word]);

  const targetWord = currentItem?.word || "";
  const isCorrect = useMemo(() => {
    if (!isAnswered) return false;
    return checkSpellerAnswer(selectedOption, targetWord);
  }, [isAnswered, selectedOption, targetWord]);

  // Letter slots for visual guide
  const letterSlots = useMemo(() => {
    return getSpellerLetterSlots(targetWord, inputValue);
  }, [targetWord, inputValue]);

  // Handle giving a progressive hint letter
  const handleTriggerHint = () => {
    if (isAnswered || !targetWord) return;
    const nextHint = getNextSpellerHint(targetWord, inputValue);
    setInputValue(nextHint);
    inputRef.current?.focus();
  };

  // Handle form submit / verify
  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    if (isAnswered) {
      if (onProceedNext) onProceedNext();
      return;
    }

    const trimmed = inputValue.trim();
    if (!trimmed) {
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
      return;
    }

    const correct = checkSpellerAnswer(trimmed, targetWord);
    if (!correct) {
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
    }
    onSubmitAnswer(trimmed);
  };

  // Handle giving up / revealing answer
  const handleGiveUp = () => {
    if (isAnswered) return;
    onSubmitAnswer(""); // empty string triggers wrong answer & reveals target
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      handleTriggerHint();
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setShowContext((prev) => !prev);
      return;
    }
  };

  if (!currentItem) return null;

  return (
    <div className="ex-speller-arena">
      {/* 1. Target Meaning Card */}
      <div className="ex-target-meaning-wrap">
        <div className="ex-target-meaning-label">
          <span>Nghĩa tiếng Việt cần gõ chính tả:</span>
          {currentItem.part_of_speech && (
            <span className="ex-speller-pos-badge">{currentItem.part_of_speech}</span>
          )}
        </div>

        <div className="ex-target-meaning-text">
          “{currentItem.meaning}”
        </div>

        {/* Audio pronunciation helper */}
        <div style={{ marginTop: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            type="button"
            className={`ex-audio-mini-btn ${isPlayingAudio ? "playing" : ""}`}
            onClick={() => playAudio(currentItem.word, currentItem.source_lang)}
            title="Nghe phát âm từ này (Phím Space / Ctrl)"
          >
            <Volume2 size={16} />
          </button>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            Bấm loa hoặc phím Space để nghe phát âm
          </span>
        </div>
      </div>

      {/* 2. Context Sentence Hint */}
      {currentItem.context_sentence && (
        <div className="ex-context-container" style={{ margin: "14px 0" }}>
          <button
            type="button"
            className={`ex-eye-hint-btn ${showContext ? "active" : ""}`}
            onClick={() => setShowContext((prev) => !prev)}
            title="Nhấn phím Esc hoặc bấm để bật/tắt gợi ý câu ví dụ"
          >
            {showContext ? (
              <><EyeOff size={15} /><span>Ẩn gợi ý câu ngữ cảnh (Phím Esc)</span></>
            ) : (
              <><Eye size={15} /><span>Gợi ý câu ngữ cảnh [ ______ ] (Phím Esc)</span></>
            )}
          </button>

          {showContext && (
            <div className="ex-context-quote">
              “{maskTargetWordInSentence(currentItem.context_sentence, currentItem.word)}”
            </div>
          )}
        </div>
      )}

      {/* 3. Visual Letter Slots Progress */}
      <div className="ex-speller-slots-wrap">
        <div className="ex-speller-slots-list">
          {letterSlots.map((slot) => (
            <span
              key={slot.index}
              className={`ex-speller-slot ${slot.isSpace ? "space" : ""} ${slot.isRevealed ? "revealed" : ""}`}
            >
              {slot.isSpace ? " " : slot.isRevealed ? slot.char : "_"}
            </span>
          ))}
        </div>
        <span className="ex-speller-len-hint">
          ({targetWord.length} ký tự)
        </span>
      </div>

      {/* 4. Active Typing Input Form */}
      <form onSubmit={handleSubmit} className="ex-speller-form">
        <div className={`ex-speller-input-wrapper ${shakeError ? "shake" : ""} ${isAnswered ? (isCorrect ? "correct" : "wrong") : ""}`}>
          <div className="ex-speller-input-icon">
            <Keyboard size={20} color="var(--primary)" />
          </div>

          <input
            ref={inputRef}
            type="text"
            className="ex-speller-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isAnswered}
            placeholder={`Gõ từ tiếng Anh tại đây (Enter để kiểm tra)...`}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />

          {isAnswered && (
            <div className="ex-speller-feedback-badge">
              {isCorrect ? (
                <span className="badge-correct"><Check size={18} /> Chính xác!</span>
              ) : (
                <span className="badge-wrong"><X size={18} /> Chưa chính xác</span>
              )}
            </div>
          )}
        </div>

        {/* 5. Answer Reveal Card (if answered and wrong/give up) */}
        {isAnswered && !isCorrect && (
          <div className="ex-speller-reveal-box">
            <div className="reveal-header">
              <span>Đáp án chính xác:</span>
            </div>
            <div className="reveal-body">
              <strong className="reveal-word">{targetWord}</strong>
              {currentItem.phonetic && (
                <span className="reveal-ipa">{currentItem.phonetic}</span>
              )}
              <button
                type="button"
                className="ex-audio-mini-btn"
                onClick={() => playAudio(targetWord, currentItem.source_lang)}
                title="Nghe lại phát âm"
              >
                <Volume2 size={16} />
              </button>
            </div>
          </div>
        )}

        {/* 6. Action Button Bar */}
        <div className="ex-speller-actions-bar">
          {!isAnswered ? (
            <>
              <button
                type="button"
                className="btn-ex-hint-letter"
                onClick={handleTriggerHint}
                title="Gợi ý thêm 1 ký tự (Phím Tab)"
              >
                <Lightbulb size={16} />
                <span>Gợi ý chữ cái (Tab)</span>
              </button>

              <button
                type="button"
                className="btn-ex-giveup"
                onClick={handleGiveUp}
                title="Xem đáp án nếu không nhớ"
              >
                <HelpCircle size={16} />
                <span>Không nhớ (Bỏ qua)</span>
              </button>

              <button
                type="submit"
                className="btn-ex-submit-typing"
              >
                <span>Kiểm tra</span>
                <ArrowRight size={16} />
              </button>
            </>
          ) : (
            <button
              type="button"
              className="btn-ex-submit-typing next-btn"
              onClick={onProceedNext}
              autoFocus
            >
              <span>{isCorrect ? "Tuyệt vời, sang từ tiếp theo" : "Đã hiểu, sang từ tiếp theo"}</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
