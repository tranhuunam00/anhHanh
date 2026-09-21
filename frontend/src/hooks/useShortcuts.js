import { useEffect, useRef } from "react";

export const useShortcuts = ({
  replayKey = "Control",
  playPauseKey = "Backquote",
  onReplay,
  onPlayPause,
  onPrev,
  onNext,
  onCheck,
  onSkip,
  onHintLetter,
  onHintWord,
  enabled = true,
}) => {
  const modifierStateRef = useRef({ key: null, comboUsed: false, time: 0 });

  useEffect(() => {
    if (!enabled) return;

    const isModifierReplay = replayKey === "Control" || replayKey === "Alt";

    const handleKeyDown = (e) => {
      const activeEl = document.activeElement;
      const isInputOrTextarea =
        activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA" || activeEl.isContentEditable);

      // Nếu replayKey là phím bổ trợ (Ctrl hoặc Alt):
      // Khi nhấn xuống, chỉ ghi nhận state và KHÔNG gọi preventDefault để không chặn các phím tắt hệ thống (Ctrl+A, C, V, Z...)
      if (isModifierReplay) {
        if (e.key === replayKey) {
          modifierStateRef.current = { key: e.key, comboUsed: false, time: Date.now() };
          return;
        } else if (modifierStateRef.current.key) {
          // Bất kỳ phím nào được bấm kèm trong lúc đang giữ modifier -> đánh dấu là combo
          modifierStateRef.current.comboUsed = true;
        }
      }

      // Tab -> Hint 1 Word (Gợi ý 1 từ)
      if (e.key === "Tab" || e.code === "Tab") {
        e.preventDefault();
        if (onHintWord) onHintWord();
        return;
      }

      // Replay Key nếu là phím thông thường (không phải Ctrl/Alt, ví dụ KeyR hoặc Space khi không ở ô gõ)
      if (!isModifierReplay && (e.key === replayKey || e.code === replayKey)) {
        if (!isInputOrTextarea) {
          e.preventDefault();
          if (onReplay) onReplay();
          return;
        }
      }

      // Ctrl + Space or Shift + Space -> Play/Pause (works anywhere including inside input)
      if (((e.ctrlKey || e.metaKey) && e.code === "Space") || (e.shiftKey && e.code === "Space")) {
        e.preventDefault();
        if (onPlayPause) onPlayPause();
        return;
      }

      // Space / Backquote / PlayPauseKey -> Play/Pause (only when NOT focused inside text input/textarea)
      if (e.code === "Space" || e.code === playPauseKey || e.key === playPauseKey) {
        if (!isInputOrTextarea) {
          e.preventDefault();
          if (onPlayPause) onPlayPause();
          return;
        }
      }

      // Alt + LeftArrow -> Prev
      if (e.altKey && e.code === "ArrowLeft") {
        e.preventDefault();
        if (onPrev) onPrev();
        return;
      }

      // Alt + RightArrow -> Next
      if (e.altKey && e.code === "ArrowRight") {
        e.preventDefault();
        if (onNext) onNext();
        return;
      }

      // Enter -> Check / Advance (when NOT typing inside text input/textarea; dictation textarea handles its own Enter)
      if (e.key === "Enter" && !e.shiftKey) {
        if (!isInputOrTextarea) {
          e.preventDefault();
          if (onCheck) onCheck();
          return;
        }
      }

      // Esc -> Skip
      if (e.key === "Escape") {
        if (onSkip) onSkip();
        return;
      }

      // Ctrl + H or Alt + H -> Hint Letter
      if (((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === "h") || (e.altKey && e.key.toLowerCase() === "h")) {
        e.preventDefault();
        if (onHintLetter) onHintLetter();
        return;
      }

      // Alt + W or Ctrl + Shift + H -> Hint Word
      if (
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "h") ||
        (e.altKey && e.key.toLowerCase() === "w")
      ) {
        e.preventDefault();
        if (onHintWord) onHintWord();
        return;
      }
    };

    const handleKeyUp = (e) => {
      // Khi nhả phím modifier (Ctrl / Alt): nếu được ấn nhả đơn lẻ (không bấm kèm phím khác) -> Tua lại audio
      if (isModifierReplay && e.key === modifierStateRef.current.key) {
        const { comboUsed, time } = modifierStateRef.current;
        modifierStateRef.current = { key: null, comboUsed: false, time: 0 };
        if (!comboUsed && Date.now() - time < 800) {
          if (onReplay) onReplay();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [replayKey, playPauseKey, onReplay, onPlayPause, onPrev, onNext, onCheck, onSkip, onHintLetter, onHintWord, enabled]);
};
