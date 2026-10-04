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
  const callbacksRef = useRef({
    onReplay,
    onPlayPause,
    onPrev,
    onNext,
    onCheck,
    onSkip,
    onHintLetter,
    onHintWord,
  });

  useEffect(() => {
    callbacksRef.current = {
      onReplay,
      onPlayPause,
      onPrev,
      onNext,
      onCheck,
      onSkip,
      onHintLetter,
      onHintWord,
    };
  });

  useEffect(() => {
    if (!enabled) return;

    const isModifierReplay = replayKey === "Control" || replayKey === "Alt";

    const handleKeyDown = (e) => {
      const activeEl = document.activeElement;
      const isInputOrTextarea =
        activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA" || activeEl.isContentEditable);

      // Nếu replayKey là phím bổ trợ (Ctrl hoặc Alt):
      if (isModifierReplay) {
        if (e.key === replayKey) {
          modifierStateRef.current = { key: e.key, comboUsed: false, time: Date.now() };
          return;
        } else if (modifierStateRef.current.key) {
          modifierStateRef.current.comboUsed = true;
        }
      }

      // Tab -> Hint 1 Word (Gợi ý 1 từ)
      if (e.key === "Tab" || e.code === "Tab") {
        e.preventDefault();
        callbacksRef.current.onHintWord?.();
        return;
      }

      // Replay Key nếu là phím thông thường (không phải Ctrl/Alt)
      if (!isModifierReplay && (e.key === replayKey || e.code === replayKey)) {
        if (!isInputOrTextarea) {
          e.preventDefault();
          callbacksRef.current.onReplay?.();
          return;
        }
      }

      // Ctrl + Space or Shift + Space -> Play/Pause
      if (((e.ctrlKey || e.metaKey) && e.code === "Space") || (e.shiftKey && e.code === "Space")) {
        e.preventDefault();
        callbacksRef.current.onPlayPause?.();
        return;
      }

      // Space / PlayPauseKey -> Play/Pause
      if (e.code === "Space" || (playPauseKey !== "Backquote" && (e.code === playPauseKey || e.key === playPauseKey))) {
        if (!isInputOrTextarea) {
          e.preventDefault();
          callbacksRef.current.onPlayPause?.();
          return;
        }
      }

      // Backquote / Tilde (` or ~) -> Hint Letter
      if (e.code === "Backquote" || e.key === "`" || e.key === "~") {
        e.preventDefault();
        callbacksRef.current.onHintLetter?.();
        return;
      }

      // Alt + LeftArrow -> Prev
      if (e.altKey && e.code === "ArrowLeft") {
        e.preventDefault();
        callbacksRef.current.onPrev?.();
        return;
      }

      // Alt + RightArrow -> Next
      if (e.altKey && e.code === "ArrowRight") {
        e.preventDefault();
        callbacksRef.current.onNext?.();
        return;
      }

      // Enter -> Check / Advance
      if (e.key === "Enter" && !e.shiftKey) {
        if (!isInputOrTextarea) {
          e.preventDefault();
          callbacksRef.current.onCheck?.();
          return;
        }
      }

      // Esc -> Skip
      if (e.key === "Escape") {
        callbacksRef.current.onSkip?.();
        return;
      }

      // Ctrl + H or Alt + H -> Hint Letter
      if (((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === "h") || (e.altKey && e.key.toLowerCase() === "h")) {
        e.preventDefault();
        callbacksRef.current.onHintLetter?.();
        return;
      }

      // Alt + W or Ctrl + Shift + H -> Hint Word
      if (
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "h") ||
        (e.altKey && e.key.toLowerCase() === "w")
      ) {
        e.preventDefault();
        callbacksRef.current.onHintWord?.();
        return;
      }
    };

    const handleKeyUp = (e) => {
      if (isModifierReplay && e.key === modifierStateRef.current.key) {
        const { comboUsed, time } = modifierStateRef.current;
        modifierStateRef.current = { key: null, comboUsed: false, time: 0 };
        if (!comboUsed && Date.now() - time < 800) {
          callbacksRef.current.onReplay?.();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [replayKey, playPauseKey, enabled]);
};
