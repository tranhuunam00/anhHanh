import { useState, useRef, useEffect, useMemo, useCallback } from "react";

export function useReaderSpeech({
  sentencesList,
  highlightSentenceInDOM,
  clearSentenceHighlights,
  showToast,
  isActive,
}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [onlyCurrentSentence, setOnlyCurrentSentence] = useState(
    () => localStorage.getItem("shotlang_reader_single_sentence") === "true"
  );
  const onlyCurrentSentenceRef = useRef(onlyCurrentSentence);
  const sentenceStartRef = useRef(null);

  useEffect(() => {
    onlyCurrentSentenceRef.current = onlyCurrentSentence;
    localStorage.setItem("shotlang_reader_single_sentence", onlyCurrentSentence);
  }, [onlyCurrentSentence]);

  // Total audio duration at current speechRate
  const totalDuration = useMemo(() => {
    if (!sentencesList || sentencesList.length === 0) return 0;
    const last = sentencesList[sentencesList.length - 1];
    return Number((last.endTime / speechRate).toFixed(1));
  }, [sentencesList, speechRate]);

  // Text-To-Speech: Speak sentence at index
  const speakSentence = useCallback(
    (index, autoPlay = true) => {
      if (!window.speechSynthesis) {
        alert("Trình duyệt không hỗ trợ Web Speech Synthesis.");
        return;
      }

      if (!sentencesList || sentencesList.length === 0) return;

      if (index < 0 || index >= sentencesList.length) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setCurrentSentenceIdx(0);
        setElapsedSeconds(0);
        clearSentenceHighlights();
        return;
      }

      window.speechSynthesis.cancel();
      setCurrentSentenceIdx(index);

      const sentence = sentencesList[index];
      const sentenceStartSec = Number((sentence.startTime / speechRate).toFixed(1));
      setElapsedSeconds(sentenceStartSec);

      highlightSentenceInDOM(index);

      if (!autoPlay) {
        setIsSpeaking(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(sentence.text);
      utterance.lang = "en-US";
      utterance.rate = speechRate;

      sentenceStartRef.current = {
        index,
        startTime: Date.now(),
        baseElapsed: sentenceStartSec,
        duration: sentence.duration / speechRate,
      };

      utterance.onend = () => {
        if (!onlyCurrentSentenceRef.current && index + 1 < sentencesList.length) {
          speakSentence(index + 1, true);
        } else {
          setIsSpeaking(false);
          sentenceStartRef.current = null;
          if (!onlyCurrentSentenceRef.current) {
            setCurrentSentenceIdx(0);
            setElapsedSeconds(0);
            clearSentenceHighlights();
            if (showToast) {
              showToast("Đã nghe xong bài viết!", "success");
            }
          }
        }
      };

      utterance.onerror = (e) => {
        if (e.error !== "interrupted" && e.error !== "canceled") {
          console.warn("Speech synthesis error:", e);
          setIsSpeaking(false);
        }
      };

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    },
    [sentencesList, speechRate, clearSentenceHighlights, highlightSentenceInDOM, showToast]
  );

  // Play / Pause Toggle
  const handleToggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const startIdx = currentSentenceIdx >= (sentencesList?.length || 0) ? 0 : currentSentenceIdx;
      speakSentence(startIdx, true);
    }
  };

  // Toggle between Continuous reading and Single designated sentence mode
  const handleToggleSingleSentenceMode = () => {
    const next = !onlyCurrentSentence;
    setOnlyCurrentSentence(next);
    if (next && !isSpeaking) {
      const targetIdx = currentSentenceIdx >= (sentencesList?.length || 0) ? 0 : currentSentenceIdx;
      speakSentence(targetIdx, true);
    }
  };

  // Jump to previous sentence
  const handlePrevSentence = () => {
    const prevIdx = Math.max(0, currentSentenceIdx - 1);
    speakSentence(prevIdx, isSpeaking);
  };

  // Jump to next sentence
  const handleNextSentence = () => {
    const nextIdx = Math.min((sentencesList?.length || 1) - 1, currentSentenceIdx + 1);
    speakSentence(nextIdx, isSpeaking);
  };

  // Restart from beginning
  const handleRestartSpeech = () => {
    speakSentence(0, true);
  };

  // Change speech playback rate
  const handleRateChange = (rate) => {
    setSpeechRate(rate);
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setTimeout(() => {
        speakSentence(currentSentenceIdx, true);
      }, 50);
    }
  };

  // Interactive timeline scrubber
  const handleSeekChange = (e) => {
    const newTime = Number(e.target.value);
    setElapsedSeconds(newTime);

    if (!sentencesList || sentencesList.length === 0) return;

    const baseTime = newTime * speechRate;
    const targetIdx = sentencesList.findIndex((s) => baseTime >= s.startTime && baseTime < s.endTime);
    const finalIdx = targetIdx >= 0 ? targetIdx : (newTime >= totalDuration ? sentencesList.length - 1 : 0);

    if (finalIdx !== currentSentenceIdx) {
      setCurrentSentenceIdx(finalIdx);
      highlightSentenceInDOM(finalIdx);
    }

    if (isSpeaking) {
      speakSentence(finalIdx, true);
    }
  };

  // Smooth seeker progress ticker while speaking
  useEffect(() => {
    if (!isSpeaking) return;

    const timer = setInterval(() => {
      if (sentenceStartRef.current) {
        const { baseElapsed, startTime, duration } = sentenceStartRef.current;
        const elapsedInSentence = (Date.now() - startTime) / 1000;
        const current = Math.min(totalDuration, baseElapsed + Math.min(duration, elapsedInSentence));
        setElapsedSeconds(Number(current.toFixed(1)));
      }
    }, 150);

    return () => clearInterval(timer);
  }, [isSpeaking, totalDuration]);

  // Cleanup on unmount or tab switch
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (!isActive && isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      clearSentenceHighlights();
    }
  }, [isActive, isSpeaking, clearSentenceHighlights]);

  return {
    isSpeaking,
    setIsSpeaking,
    speechRate,
    setSpeechRate,
    currentSentenceIdx,
    setCurrentSentenceIdx,
    elapsedSeconds,
    setElapsedSeconds,
    totalDuration,
    onlyCurrentSentence,
    setOnlyCurrentSentence,
    speakSentence,
    handleToggleSpeech,
    handleToggleSingleSentenceMode,
    handlePrevSentence,
    handleNextSentence,
    handleRestartSpeech,
    handleRateChange,
    handleSeekChange,
  };
}
