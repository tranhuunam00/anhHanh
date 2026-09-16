import React, { useMemo } from "react";
import { evaluateMasked } from "../../utils/diffCalculator";

export const DictationStudio = ({
  currentChallenge,
  currentIndex,
  totalChallenges,
  userInput,
  setUserInput,
  isListening,
  onToggleMic,
  onCheck,
  onSkip,
  onSpeakSentence,
  onHintLetter,
  onHintWord,
  onPrev,
  onNext,
  onOpenDrawer,
  strictPunctuation = false,
  onNextChallenge,
  onRetryChallenge,
}) => {
  const targetText = currentChallenge ? currentChallenge.text : "";

  // Compute live masked diff evaluation
  const maskedEvaluation = useMemo(() => {
    if (!targetText) return { words: [], isCompleted: false };
    return evaluateMasked(targetText, userInput, strictPunctuation);
  }, [targetText, userInput, strictPunctuation]);

  const progressPercent = totalChallenges > 0 ? Math.round(((currentIndex + 1) / totalChallenges) * 100) : 0;

  const formatTime = (seconds) => {
    if (typeof seconds !== "number") return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <section className="card dictation-card">
      <div className="challenge-header">
        <div>
          <h2 className="challenge-title">
            Câu {currentIndex + 1} / {totalChallenges || "..."}
          </h2>
          <div className="challenge-time">
            [{currentChallenge ? formatTime(currentChallenge.time_start) : "00:00"} -{" "}
            {currentChallenge ? formatTime(currentChallenge.time_end) : "00:00"}]
          </div>
        </div>

        <div className="challenge-nav-buttons">
          <button className="btn btn-secondary btn-icon" title="Câu trước (Alt+←)" onClick={onPrev} disabled={currentIndex === 0}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button className="btn btn-secondary btn-icon" title="Câu sau (Alt+→)" onClick={onNext} disabled={currentIndex >= totalChallenges - 1}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
          <button className="btn btn-secondary btn-with-icon" title="Danh sách tất cả các câu" onClick={onOpenDrawer}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            <span>Danh sách câu</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar-container">
        <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
      </div>

      {/* Live Diff / Masked Card */}
      <div className="masked-card">
        <div className="diff-preview-container">
          {!userInput && maskedEvaluation.words.length === 0 ? (
            <span className="token-missing">Gõ những gì bạn nghe được vào ô bên dưới...</span>
          ) : (
            <div className="masked-sentence">
              {maskedEvaluation.words.map((word, wIdx) => (
                <span key={wIdx} className="masked-word">
                  {word.map((item, cIdx) => (
                    <span
                      key={cIdx}
                      className={`char-box char-${item.status}`}
                    >
                      {item.display}
                    </span>
                  ))}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Textarea Input (Default 3 rows, vertical resize, mic button) */}
      <div className="input-wrapper">
        <textarea
          id="dictation-input"
          className="dictation-input"
          rows={3}
          placeholder="Gõ chính xác những từ bạn nghe được tại đây (Type what you hear)..."
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button
          className={`mic-btn ${isListening ? "listening" : ""}`}
          title="Nói để chuyển thành chữ (Speech to text)"
          onClick={onToggleMic}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="22" />
          </svg>
        </button>
      </div>

      {/* Action Buttons Toolbar */}
      <div className="dictation-actions">
        <button className="btn btn-primary btn-with-icon" style={{ padding: "7px 18px" }} onClick={onCheck}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Kiểm tra (Enter)</span>
        </button>

        <button className="btn btn-secondary btn-with-icon" title="Bỏ qua (Esc + Enter)" onClick={onSkip}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5 4 15 12 5 20 5 4" />
            <line x1="19" y1="5" x2="19" y2="19" />
          </svg>
          <span>Bỏ qua</span>
        </button>

        <button className="btn btn-secondary btn-with-icon" title="Nghe phát âm giọng mẫu câu này" onClick={onSpeakSentence}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
          <span>Nghe câu</span>
        </button>

        <button className="btn btn-secondary btn-with-icon" title="Mở 1 ký tự tiếp theo (Ctrl+H)" onClick={onHintLetter}>
          <span>Gợi ý chữ</span>
        </button>

        <button className="btn btn-secondary btn-with-icon" title="Mở 1 từ tiếp theo" onClick={onHintWord}>
          <span>Gợi ý từ</span>
        </button>
      </div>

      {/* Sentence Completion Card */}
      {isCompleted && (
        <div className="completion-card active">
          <div className="original-sentence">{currentChallenge?.text}</div>
          {currentChallenge?.translation && (
            <div className="translation-sentence">{currentChallenge.translation}</div>
          )}
          <div style={{ marginTop: "10px", display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <button className="btn btn-primary btn-with-icon" style={{ padding: "7px 18px" }} onClick={onNextChallenge}>
              <span>Sang câu tiếp theo</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            <button className="btn btn-secondary btn-with-icon" style={{ padding: "7px 14px", fontSize: "0.85rem" }} onClick={onRetryChallenge}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              <span>Luyện lại câu này</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
