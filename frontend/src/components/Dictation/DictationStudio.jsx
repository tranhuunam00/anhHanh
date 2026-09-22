import React, { useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  ListFilter,
  RefreshCw,
  Mic,
  MicOff,
  Check,
  SkipForward,
  Volume2,
  Lightbulb,
  KeyRound,
  ArrowRight,
  Sparkles,
  BookOpen,
  Trophy,
} from "lucide-react";
import { evaluateMasked } from "../../utils/diffCalculator";
import { analyzeSentencePhonology } from "../../utils/phonologyEngine";
import { translateText } from "../../services/api";
import { HighlightedVocabSentence } from "../Vocab/HighlightedVocabSentence";

// Sub-component: Masked Character & Word Preview (Memoized to prevent DOM thrashing)
const MaskedPreview = React.memo(({ maskedWords, hasInput }) => {
  if (!hasInput && (!maskedWords || maskedWords.length === 0)) {
    return (
      <div className="diff-preview-container">
        <span className="token-missing">Gõ những gì bạn nghe được vào ô bên dưới...</span>
      </div>
    );
  }

  return (
    <div className="diff-preview-container">
      <div className="masked-sentence">
        {maskedWords.map((word, wIdx) => (
          <span key={wIdx} className="masked-word">
            {word.map((item, cIdx) => (
              <span key={cIdx} className={`char-box char-${item.status}`}>
                {item.display}
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
});

export const DictationStudio = React.memo(({
  currentChallenge,
  currentIndex,
  totalChallenges,
  videoId = "",
  targetLang = "vi",
  sourceLang = "en",
  userInput = "",
  setUserInput,
  onInputChange,
  isListening,
  isPlaying = false,
  onToggleMic,
  onCheck,
  onSkip,
  onReplay,
  onPlayPause,
  onSpeakSentence,
  onHintLetter,
  onHintWord,
  onPrev,
  onNext,
  onOpenDrawer,
  onRestartLesson,
  isCompleted,
  strictPunctuation = false,
  onNextChallenge,
  onRetryChallenge,
  onCompleteLesson,
}) => {
  const isLastChallenge = totalChallenges > 0 && currentIndex >= totalChallenges - 1;
  const targetText = currentChallenge ? currentChallenge.text : "";

  const [dynamicTranslation, setDynamicTranslation] = React.useState(null);

  React.useEffect(() => {
    setDynamicTranslation(null);
  }, [currentChallenge?.id, currentChallenge?.text]);

  React.useEffect(() => {
    if (
      isCompleted &&
      currentChallenge &&
      !currentChallenge.translation &&
      !dynamicTranslation &&
      targetLang &&
      targetLang !== "none"
    ) {
      let isMounted = true;
      translateText(currentChallenge.text, sourceLang || "auto", targetLang)
        .then((res) => {
          if (isMounted && res?.translation) {
            setDynamicTranslation(res.translation);
            currentChallenge.translation = res.translation;
          }
        })
        .catch(() => { });
      return () => {
        isMounted = false;
      };
    }
  }, [isCompleted, currentChallenge, targetLang, sourceLang, dynamicTranslation]);

  // Cô lập local state để khi gõ phím CHỈ re-render DictationStudio, không re-render toàn bộ App
  const [localInput, setLocalInput] = React.useState(userInput || "");

  // Đồng bộ khi cha truyền input mới (chuyển câu, gợi ý, bỏ qua, làm lại, mic nói)
  React.useEffect(() => {
    setLocalInput(userInput || "");
  }, [userInput]);

  // Hoãn nhẹ phần diff sang frame sau bằng useDeferredValue để ưu tiên gõ phím mượt 60fps
  const deferredInput = React.useDeferredValue(localInput);
  const maskedEvaluation = useMemo(() => {
    if (!targetText) return { words: [], isCompleted: false };
    return evaluateMasked(targetText, deferredInput, strictPunctuation);
  }, [targetText, deferredInput, strictPunctuation]);

  const phonologyData = useMemo(() => {
    if (!isCompleted || !targetText) return null;
    return analyzeSentencePhonology(targetText);
  }, [isCompleted, targetText]);

  const progressPercent = totalChallenges > 0 ? Math.round(((currentIndex + 1) / totalChallenges) * 100) : 0;

  const formatTime = (seconds) => {
    if (typeof seconds !== "number") return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleInputChange = (e) => {
    // Triệt tiêu nhiều dấu cách liên tiếp (2 space trở lên) ngay khi gõ
    const cleanVal = e.target.value.replace(/ {2,}/g, " ");
    setLocalInput(cleanVal);
    if (onInputChange) {
      onInputChange(cleanVal);
    }
    if (setUserInput) {
      // Giữ tương thích nếu có component nào đọc setUserInput
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      if (onCheck) onCheck(localInput);
      return;
    }
    if (e.code === "Backquote" || e.key === "`" || e.key === "~") {
      e.preventDefault();
      e.stopPropagation();
      if (onHintLetter) onHintLetter();
      return;
    }
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
            <ChevronLeft size={18} strokeWidth={2.2} />
          </button>

          <button className="btn btn-secondary btn-icon" title={isPlaying ? "Tạm dừng (Space / Shift+Space)" : "Phát / Tiếp tục (Space / Shift+Space)"} onClick={onPlayPause}>
            {isPlaying ? (
              <Pause size={17} fill="currentColor" />
            ) : (
              <Play size={17} fill="currentColor" style={{ marginLeft: "2px" }} />
            )}
          </button>

          <button className="btn btn-secondary btn-icon" title="Phát lại câu hiện tại (Ctrl)" onClick={onReplay}>
            <RotateCcw size={16} strokeWidth={2.2} />
          </button>

          <button
            className="btn btn-secondary btn-icon"
            title={isLastChallenge ? (isCompleted ? "Hoàn thành bài học 🎉" : "Đã đến câu cuối cùng") : "Câu sau (Alt+→)"}
            onClick={isLastChallenge ? (isCompleted ? (onCompleteLesson || onNextChallenge) : undefined) : onNext}
            disabled={isLastChallenge && !isCompleted}
          >
            <ChevronRight size={18} strokeWidth={2.2} />
          </button>

          <button className="btn btn-secondary btn-with-icon" title="Danh sách tất cả các câu" onClick={onOpenDrawer}>
            <ListFilter size={16} strokeWidth={2} />
            <span>Danh sách câu</span>
          </button>

          {onRestartLesson && (
            <button
              className="btn btn-secondary btn-with-icon"
              title="Làm lại bài này từ câu số 1"
              onClick={onRestartLesson}
              style={{ color: "#ef4444", borderColor: "#fecaca" }}
            >
              <RefreshCw size={14} strokeWidth={2} />
              <span>Làm lại bài này</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar-container">
        <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
      </div>

      {/* Live Diff / Masked Card */}
      <div className="masked-card">
        <MaskedPreview
          maskedWords={maskedEvaluation.words}
          hasInput={Boolean(localInput)}
        />
      </div>

      {/* Textarea Input */}
      <div className="input-wrapper">
        <textarea
          id="dictation-input"
          className="dictation-input"
          rows={3}
          placeholder="Gõ chính xác những từ bạn nghe được tại đây (Type what you hear)..."
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          value={localInput}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
        />
        <button
          type="button"
          className={`mic-btn ${isListening ? "listening" : ""}`}
          title={isListening ? "Đang bật Micro (Đang nghe)... Nhấp để TẮT Micro" : "BẬT Micro để nói (Speech to text)"}
          aria-label={isListening ? "Tắt Micro" : "Bật Micro"}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onToggleMic) {
              onToggleMic(localInput);
            }
          }}
        >
          {isListening ? (
            <MicOff size={18} strokeWidth={2.2} className="mic-icon-active" />
          ) : (
            <Mic size={18} strokeWidth={2.2} />
          )}
        </button>
        {isListening && (
          <div className="mic-listening-pill" title="Đang ghi âm giọng nói của bạn...">
            <span className="mic-listening-dot"></span>
            <span>Đang nghe... Nói để gõ chữ</span>
          </div>
        )}
      </div>

      {/* Action Buttons Toolbar */}
      <div className="dictation-actions">
        <button
          className="btn btn-secondary btn-with-icon"
          title="Kiểm tra câu vừa gõ (Enter)"
          onClick={() => onCheck && onCheck(localInput)}
        >
          <Check size={16} strokeWidth={2.5} />
          <span>Kiểm tra</span>
        </button>

        <button className="btn btn-secondary btn-with-icon" title="Bỏ qua (Esc + Enter)" onClick={onSkip}>
          <SkipForward size={15} strokeWidth={2.2} />
          <span>Bỏ qua</span>
        </button>

        <button className="btn btn-secondary btn-with-icon" title="Phát lại câu hiện tại (Ctrl)" onClick={onReplay}>
          <RotateCcw size={15} strokeWidth={2.2} />
          <span>Lặp lại</span>
        </button>

        <button className="btn btn-secondary btn-with-icon" title="Nghe phát âm giọng mẫu câu này" onClick={onSpeakSentence}>
          <Volume2 size={16} strokeWidth={2} />
          <span>Nghe câu</span>
        </button>

        <button className="btn btn-secondary btn-with-icon" title="Mở 1 ký tự tiếp theo (~ / ` / Enter 2 lần / Ctrl+H / Alt+H)" onClick={onHintLetter}>
          <KeyRound size={15} strokeWidth={2} />
          <span>Gợi ý chữ</span>
        </button>

        <button className="btn btn-secondary btn-with-icon" title="Mở 1 từ tiếp theo (Tab / Alt+W / Ctrl+Shift+H)" onClick={onHintWord}>
          <Lightbulb size={15} strokeWidth={2} />
          <span>Gợi ý từ</span>
        </button>
      </div>

      {/* Sentence Completion Card */}
      {isCompleted && (
        <div className="completion-card active">
          <div className="original-sentence">
            <HighlightedVocabSentence
              text={currentChallenge?.text}
              contextSentence={currentChallenge?.text}
              contextTranslation={currentChallenge?.translation || dynamicTranslation}
              videoId={videoId || currentChallenge?.video_id || ""}
              timestamp={currentChallenge?.time_start || 0}
            />
          </div>
          {(currentChallenge?.translation || dynamicTranslation) && (
            <div className="translation-sentence">{currentChallenge?.translation || dynamicTranslation}</div>
          )}
          <div className="vocab-save-hint-card">
            <span>💡 Chạm vào từ để xem phát âm & nghĩa, hoặc bôi đen cụm từ để lưu</span>
          </div>
          <div style={{ marginTop: "10px", display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            {isLastChallenge ? (
              <button
                className="btn btn-primary btn-with-icon"
                style={{
                  padding: "8px 22px",
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  border: "none",
                  color: "#ffffff",
                  fontWeight: 600,
                  borderRadius: "10px",
                  boxShadow: "0 4px 14px rgba(16, 185, 129, 0.4)",
                  cursor: "pointer",
                }}
                onClick={onCompleteLesson || onNextChallenge}
                title="Hoàn thành bài học (hoặc ấn Enter)"
              >
                <Trophy size={17} strokeWidth={2.4} style={{ color: "#fef08a" }} />
                <span>Hoàn thành bài học 🎉</span>
                <kbd style={{ fontSize: "0.72rem", opacity: 0.9, padding: "1px 6px", background: "rgba(255,255,255,0.25)", borderRadius: "4px", marginLeft: "6px" }}>Enter</kbd>
              </button>
            ) : (
              <button
                className="btn btn-primary btn-with-icon"
                style={{ padding: "7px 18px" }}
                onClick={onNextChallenge}
                title="Sang câu tiếp theo (hoặc ấn Enter)"
              >
                <span>Sang câu tiếp theo</span>
                <ArrowRight size={16} strokeWidth={2.2} />
                <kbd style={{ fontSize: "0.72rem", opacity: 0.85, padding: "1px 6px", background: "rgba(255,255,255,0.25)", borderRadius: "4px", marginLeft: "4px" }}>Enter</kbd>
              </button>
            )}
            <button className="btn btn-secondary btn-with-icon" style={{ padding: "7px 14px", fontSize: "0.85rem" }} onClick={onRetryChallenge}>
              <RotateCcw size={14} strokeWidth={2} />
              <span>Luyện lại câu này</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
});


