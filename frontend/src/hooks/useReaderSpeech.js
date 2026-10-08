import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { PITCH_PRESETS } from "../utils/readerVoices";

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

  // Available Web Speech voices and Accent / Persona customization
  const [voices, setVoices] = useState([]);
  const [selectedVoiceUri, setSelectedVoiceUri] = useState(
    () => localStorage.getItem("shotlang_reader_voice_uri") || ""
  );
  const [selectedAccent, setSelectedAccent] = useState(
    () => localStorage.getItem("shotlang_reader_accent") || "ALL"
  );
  const [pitchPreset, setPitchPreset] = useState(
    () => localStorage.getItem("shotlang_reader_pitch_preset") || "standard"
  );

  useEffect(() => {
    onlyCurrentSentenceRef.current = onlyCurrentSentence;
    localStorage.setItem("shotlang_reader_single_sentence", onlyCurrentSentence);
  }, [onlyCurrentSentence]);

  // Load browser speech synthesis voices
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices() || [];
      if (available.length > 0) {
        setVoices(available);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Compute active pitch value from persona preset
  const speechPitch = useMemo(() => {
    const found = PITCH_PRESETS.find((p) => p.id === pitchPreset);
    return found ? found.pitch : 1.0;
  }, [pitchPreset]);

  // Compute active SpeechSynthesisVoice object
  const selectedVoice = useMemo(() => {
    if (!voices || voices.length === 0) return null;
    if (selectedVoiceUri) {
      const match = voices.find((v) => (v.voiceURI || v.name) === selectedVoiceUri);
      if (match) return match;
    }
    // Fallback: accent match or general English voice
    if (selectedAccent && selectedAccent !== "ALL") {
      const accentMatch = voices.find((v) =>
        (v.lang || "").toLowerCase().startsWith(selectedAccent.toLowerCase())
      );
      if (accentMatch) return accentMatch;
    }
    const enMatch = voices.find((v) => (v.lang || "").toLowerCase().startsWith("en"));
    return enMatch || voices[0] || null;
  }, [voices, selectedVoiceUri, selectedAccent]);

  const handleSelectVoiceUri = useCallback((uri) => {
    setSelectedVoiceUri(uri);
    localStorage.setItem("shotlang_reader_voice_uri", uri);
  }, []);

  const handleSelectAccent = useCallback((accent) => {
    setSelectedAccent(accent);
    localStorage.setItem("shotlang_reader_accent", accent);
  }, []);

  const handleSelectPitchPreset = useCallback((presetId) => {
    setPitchPreset(presetId);
    localStorage.setItem("shotlang_reader_pitch_preset", presetId);
  }, []);

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
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang || "en-US";
      } else {
        utterance.lang = "en-US";
      }
      utterance.rate = speechRate;
      utterance.pitch = speechPitch;

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
    [
      sentencesList,
      speechRate,
      speechPitch,
      selectedVoice,
      highlightSentenceInDOM,
      clearSentenceHighlights,
      showToast,
    ]
  );

  // Quick test voice sample
  const handleTestVoice = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const testUtterance = new SpeechSynthesisUtterance(
      "Hello! This is a speech sample. Welcome to Smart Reader!"
    );
    if (selectedVoice) {
      testUtterance.voice = selectedVoice;
      testUtterance.lang = selectedVoice.lang || "en-US";
    } else {
      testUtterance.lang = "en-US";
    }
    testUtterance.rate = speechRate;
    testUtterance.pitch = speechPitch;
    window.speechSynthesis.speak(testUtterance);
    if (showToast) {
      showToast(`Đang thử giọng: ${selectedVoice ? selectedVoice.name : "Hệ thống"}`, "info");
    }
  }, [selectedVoice, speechRate, speechPitch, showToast]);

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
    } else {
      speakSentence(currentSentenceIdx, true);
    }
  };

  const handleToggleSingleSentenceMode = () => {
    setOnlyCurrentSentence((prev) => !prev);
  };

  const handlePrevSentence = () => {
    if (currentSentenceIdx > 0) {
      speakSentence(currentSentenceIdx - 1, isSpeaking);
    }
  };

  const handleNextSentence = () => {
    if (currentSentenceIdx < (sentencesList?.length || 1) - 1) {
      speakSentence(currentSentenceIdx + 1, isSpeaking);
    }
  };

  const handleRestartSpeech = () => {
    speakSentence(0, true);
  };

  const handleRateChange = (newRate) => {
    setSpeechRate(newRate);
    if (isSpeaking) {
      speakSentence(currentSentenceIdx, true);
    }
  };

  const handleSeekChange = (newTime) => {
    if (!sentencesList || sentencesList.length === 0) return;
    const scaledTime = newTime * speechRate;
    let targetIdx = sentencesList.findIndex(
      (s) => s.startTime <= scaledTime && scaledTime <= s.endTime
    );
    if (targetIdx === -1) {
      targetIdx = sentencesList.findIndex((s) => s.startTime >= scaledTime);
    }
    if (targetIdx === -1) targetIdx = sentencesList.length - 1;
    if (targetIdx < 0) targetIdx = 0;
    speakSentence(targetIdx, isSpeaking);
  };

  // Real-time animation loop for progress bar
  useEffect(() => {
    let animId;
    const updateProgress = () => {
      if (isSpeaking && sentenceStartRef.current) {
        const { baseElapsed, startTime, duration } = sentenceStartRef.current;
        const now = Date.now();
        const diffSec = (now - startTime) / 1000;
        const currentProgress = baseElapsed + Math.min(diffSec, duration);
        setElapsedSeconds(Number(Math.min(currentProgress, totalDuration).toFixed(1)));
      }
      animId = requestAnimationFrame(updateProgress);
    };

    if (isSpeaking) {
      animId = requestAnimationFrame(updateProgress);
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
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
    voices,
    selectedVoiceUri,
    selectedAccent,
    pitchPreset,
    handleSelectVoiceUri,
    handleSelectAccent,
    handleSelectPitchPreset,
    handleTestVoice,
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
