import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { PITCH_PRESETS, resolveSpeechVoice } from "../utils/readerVoices";
import { isSilentOrDivider, cleanSpeechText } from "../utils/readerUtils";
import {
  playEdgeTtsAudio,
  stopEdgeAudio,
  isEdgeVoice,
} from "../services/edgeTtsService";

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
  const activeUtteranceRef = useRef(null);
  const dividerTimerRef = useRef(null);

  // Available Web Speech voices and Accent / Persona customization
  const [voices, setVoices] = useState([]);
  const [selectedVoiceUri, setSelectedVoiceUri] = useState(
    () => localStorage.getItem("shotlang_reader_voice_uri") || "edge:en-US-JennyNeural"
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
    const p = typeof found?.pitch === "number" ? found.pitch : 1.0;
    return Number.isFinite(p) ? p : 1.0;
  }, [pitchPreset]);

  // Compute active SpeechSynthesisVoice object via modular resolver
  const selectedVoice = useMemo(() => {
    return resolveSpeechVoice(voices, selectedVoiceUri, selectedAccent);
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
      if (!sentencesList || sentencesList.length === 0) return;

      if (dividerTimerRef.current) {
        clearTimeout(dividerTimerRef.current);
        dividerTimerRef.current = null;
      }

      if (typeof window !== "undefined" && window.speechSynthesis) {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
        }
      }
      stopEdgeAudio();

      if (index < 0 || index >= sentencesList.length) {
        setIsSpeaking(false);
        setCurrentSentenceIdx(0);
        setElapsedSeconds(0);
        clearSentenceHighlights();
        return;
      }

      setCurrentSentenceIdx(index);

      const sentence = sentencesList[index];
      const sentenceStartSec = Number((sentence.startTime / speechRate).toFixed(1));
      setElapsedSeconds(sentenceStartSec);

      highlightSentenceInDOM(index);

      if (!autoPlay) {
        setIsSpeaking(false);
        return;
      }

      sentenceStartRef.current = {
        index,
        startTime: Date.now(),
        baseElapsed: sentenceStartSec,
        duration: sentence.duration / speechRate,
      };

      const handleSpeechComplete = () => {
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

      // Check if sentence is purely a divider or decorative (e.g. ____________________, ----, ***)
      if (isSilentOrDivider(sentence.text)) {
        setIsSpeaking(true);
        dividerTimerRef.current = setTimeout(() => {
          handleSpeechComplete();
        }, 400);
        return;
      }

      const speechText = cleanSpeechText(sentence.text);
      if (!speechText) {
        handleSpeechComplete();
        return;
      }

      // 1. High-fidelity Neural Edge-TTS playback
      if (isEdgeVoice(selectedVoiceUri)) {
        setIsSpeaking(true);
        playEdgeTtsAudio({
          text: speechText,
          voice: selectedVoiceUri,
          rate: speechRate,
          pitch: pitchPreset,
          onStart: () => setIsSpeaking(true),
          onEnd: handleSpeechComplete,
          onError: (err) => {
            console.warn("Edge-TTS error, falling back to Web Speech:", err);
            // Fallback to Web Speech if network fails
            if (window.speechSynthesis) {
              const fallbackUtter = new SpeechSynthesisUtterance(speechText);
              activeUtteranceRef.current = fallbackUtter;
              if (selectedVoice) fallbackUtter.voice = selectedVoice;
              fallbackUtter.rate = Number.isFinite(speechRate) ? speechRate : 1.0;
              fallbackUtter.onend = () => {
                if (activeUtteranceRef.current === fallbackUtter) {
                  activeUtteranceRef.current = null;
                }
                handleSpeechComplete();
              };
              fallbackUtter.onerror = () => {
                if (activeUtteranceRef.current === fallbackUtter) {
                  activeUtteranceRef.current = null;
                }
                setIsSpeaking(false);
              };
              window.speechSynthesis.speak(fallbackUtter);
            }
          },
        });
        return;
      }

      // 2. Standard Web Speech Synthesis fallback
      if (!window.speechSynthesis) {
        alert("Trình duyệt không hỗ trợ Web Speech Synthesis.");
        return;
      }

      const utterance = new SpeechSynthesisUtterance(speechText);
      activeUtteranceRef.current = utterance;
      const isIndianMode =
        selectedVoiceUri.startsWith("virtual_indian") ||
        selectedAccent === "en-IN" ||
        pitchPreset === "indian_style" ||
        (selectedVoice?.lang || "").toLowerCase().includes("in");

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      utterance.lang = isIndianMode ? "en-IN" : selectedVoice?.lang || "en-US";

      // Indian accent rhythmic pitch and speed cadence modulation
      const rawPitch = Number.isFinite(speechPitch) ? speechPitch : 1.0;
      const rawRate = Number.isFinite(speechRate) ? speechRate : 1.0;

      const finalPitch = isIndianMode
        ? Math.min(1.4, rawPitch * 1.15)
        : rawPitch;
      const finalRate = isIndianMode ? rawRate * 1.05 : rawRate;

      utterance.rate = Number.isFinite(finalRate) ? finalRate : 1.0;
      utterance.pitch = Number.isFinite(finalPitch) ? finalPitch : 1.0;

      utterance.onend = () => {
        if (activeUtteranceRef.current === utterance) {
          activeUtteranceRef.current = null;
        }
        handleSpeechComplete();
      };

      utterance.onerror = (e) => {
        if (activeUtteranceRef.current === utterance) {
          activeUtteranceRef.current = null;
        }
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
      selectedVoiceUri,
      selectedAccent,
      pitchPreset,
      highlightSentenceInDOM,
      clearSentenceHighlights,
      showToast,
    ]
  );

  // Quick test voice sample
  const handleTestVoice = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    stopEdgeAudio();

    if (isEdgeVoice(selectedVoiceUri)) {
      const isIndian = selectedVoiceUri.includes("IN");
      const sampleText = isIndian
        ? "Namaste! Welcome to Smart Reader. Let's practice English with natural voice!"
        : "Hello! This is a natural AI speech sample with authentic intonation. Welcome to Smart Reader!";

      playEdgeTtsAudio({
        text: sampleText,
        voice: selectedVoiceUri,
        rate: speechRate,
        pitch: pitchPreset,
        onStart: () => {
          if (showToast) showToast("Đang phát thử giọng AI tự nhiên...", "info");
        },
        onError: (err) => {
          console.warn("Test voice error:", err);
        },
      });
      return;
    }

    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const isIndianMode =
      selectedVoiceUri.startsWith("virtual_indian") ||
      selectedAccent === "en-IN" ||
      pitchPreset === "indian_style" ||
      (selectedVoice?.lang || "").toLowerCase().includes("in");

    const sampleText = isIndianMode
      ? "Namaste! Welcome to Smart Reader. Let's practice English with Indian accent!"
      : "Hello! This is a speech sample. Welcome to Smart Reader!";

    const testUtterance = new SpeechSynthesisUtterance(sampleText);
    if (selectedVoice) {
      testUtterance.voice = selectedVoice;
    }
    testUtterance.lang = isIndianMode ? "en-IN" : selectedVoice?.lang || "en-US";
    const rawPitch = Number.isFinite(speechPitch) ? speechPitch : 1.0;
    const rawRate = Number.isFinite(speechRate) ? speechRate : 1.0;
    const finalPitch = isIndianMode ? Math.min(1.4, rawPitch * 1.15) : rawPitch;
    const finalRate = isIndianMode ? rawRate * 1.05 : rawRate;

    testUtterance.pitch = Number.isFinite(finalPitch) ? finalPitch : 1.0;
    testUtterance.rate = Number.isFinite(finalRate) ? finalRate : 1.0;

    window.speechSynthesis.speak(testUtterance);
    if (showToast) {
      const voiceTitle = isIndianMode
        ? (selectedVoiceUri === "virtual_indian_female" ? "Neerja • Ấn Độ (Nữ)" : "Ravi • Ấn Độ (Nam)")
        : (selectedVoice ? selectedVoice.name : "Hệ thống");
      showToast(`Đang thử giọng: ${voiceTitle}`, "info");
    }
  }, [
    selectedVoice,
    selectedVoiceUri,
    selectedAccent,
    pitchPreset,
    speechRate,
    speechPitch,
    showToast,
  ]);

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      stopEdgeAudio();
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
      stopEdgeAudio();
    };
  }, []);

  useEffect(() => {
    if (!isActive && isSpeaking) {
      window.speechSynthesis?.cancel();
      stopEdgeAudio();
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
