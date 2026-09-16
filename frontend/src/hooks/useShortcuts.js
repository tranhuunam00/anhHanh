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

      // Shift + Space or Ctrl + Space -> Play/Pause (works even when typing inside textarea)
      if ((e.shiftKey && e.code === "Space") || ((e.ctrlKey || e.metaKey) && e.code === "Space")) {
        e.preventDefault();
        if (onPlayPause) onPlayPause();
        return;
      }

      // Play/Pause Key (` / Escape / Custom Key)
      if (e.code === playPauseKey || e.key === playPauseKey) {
        if (!isInputOrTextarea || playPauseKey === "Escape" || playPauseKey === "Backquote") {
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

      // Enter -> Check (only inside dictation input or when active)
      if (e.key === "Enter" && !e.shiftKey) {
        if (activeEl && activeEl.id === "dictation-input") {
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
