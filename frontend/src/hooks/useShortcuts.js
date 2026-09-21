import { useEffect } from "react";

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
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e) => {
      const activeEl = document.activeElement;
      const isInputOrTextarea =
        activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA" || activeEl.isContentEditable);

      // Tab -> Hint 1 Word (Gợi ý 1 từ)
      if (e.key === "Tab" || e.code === "Tab") {
        e.preventDefault();
        if (onHintWord) onHintWord();
        return;
      }

      // Replay Key (Control / Alt / KeyR / Space)
      if (e.key === replayKey || e.code === replayKey) {
        if (!isInputOrTextarea || replayKey === "Control" || replayKey === "Alt") {
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

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [replayKey, playPauseKey, onReplay, onPlayPause, onPrev, onNext, onCheck, onSkip, onHintLetter, onHintWord, enabled]);
};
