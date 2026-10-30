import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Volume2,
  Mic,
  Check,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  X,
  Zap,
  Headphones,
  Sparkles,
} from "../../Icons";
import {
  getEffectiveShadowingSentence,
  compareShadowingTranscript,
  SHADOWING_STATUS,
} from "../../../utils/shadowingAudioUtils";
import { getVoiceLang } from "../../../utils/languageVoices";
import "./VocabExerciseShadowing.css";

export const VocabExerciseShadowing = ({
  items = [],
  currentIndex = 0,
  score = 0,
  combo = 0,
  onProceed,
  onBackToMenu,
  onClose,
}) => {
  const currentItem = items[currentIndex];

  const [playbackSpeed, setPlaybackSpeed] = useState(0.85);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(null);
  const [evaluation, setEvaluation] = useState(null);

  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Sentence to shadow
  const referenceSentence = useMemo(() => {
    return getEffectiveShadowingSentence(currentItem);
  }, [currentItem]);

  // Audio reference playback via SpeechSynthesis
  const playReferenceAudio = useCallback(
    (rate = playbackSpeed) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window) || !referenceSentence) return;
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(referenceSentence);
        utter.lang = getVoiceLang(currentItem?.source_lang, referenceSentence);
        utter.rate = rate;
        utter.onstart = () => setIsPlayingAudio(true);
        utter.onend = () => setIsPlayingAudio(false);
        utter.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utter);
      } catch (err) {
        setIsPlayingAudio(false);
      }
    },
    [referenceSentence, currentItem, playbackSpeed]
  );

  // Playback user's recorded audio
  const playRecordedAudio = useCallback(() => {
    if (!recordedAudioUrl) return;
    const audio = new Audio(recordedAudioUrl);
    audio.play().catch((e) => console.warn("Cannot play user recording:", e));
  }, [recordedAudioUrl]);

  // Reset state on question change
  useEffect(() => {
    setIsRecording(false);
    setTranscript("");
    setRecordedAudioUrl(null);
    setEvaluation(null);

    // Auto-play model sentence once
    const timer = setTimeout(() => {
      playReferenceAudio(0.85);
    }, 300);

    return () => {
      clearTimeout(timer);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        try {
          mediaRecorderRef.current.stop();
        } catch {}
      }
    };
  }, [currentIndex, currentItem, playReferenceAudio]);

  // Start Mic Recording & Speech Recognition
  const startRecording = async () => {
    if (isRecording) return;
    setTranscript("");
    setEvaluation(null);
    setRecordedAudioUrl(null);
    audioChunksRef.current = [];

    // 1. Setup MediaRecorder for voice playback
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          if (audioChunksRef.current.length > 0) {
            const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
            const url = URL.createObjectURL(blob);
            setRecordedAudioUrl(url);
          }
          // Stop media stream tracks
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.start();
      } catch (err) {
        console.warn("MediaRecorder mic access error:", err);
      }
    }

    // 2. Setup Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Trình duyệt của bạn chưa hỗ trợ Web Speech API. Hãy sử dụng Google Chrome!");
      return;
    }

    try {
      const recognizer = new SpeechRecognition();
      recognizer.lang = "en-US";
      recognizer.continuous = false;
      recognizer.interimResults = true;

      recognizer.onstart = () => {
        setIsRecording(true);
      };

      recognizer.onresult = (event) => {
        let currentTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognizer.onerror = (e) => {
        console.warn("Speech recognition error:", e.error);
        setIsRecording(false);
      };

      recognizer.onend = () => {
        setIsRecording(false);
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
          mediaRecorderRef.current.stop();
        }
      };

      recognitionRef.current = recognizer;
      recognizer.start();
    } catch (err) {
      console.warn("Could not start speech recognition:", err);
      setIsRecording(false);
    }
  };

  // Stop Recording & Evaluate
  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
    }
    setIsRecording(false);
  };

  // Run evaluation once recording finishes with transcript
  useEffect(() => {
    if (!isRecording && transcript && !evaluation) {
      const result = compareShadowingTranscript(referenceSentence, transcript);
      setEvaluation(result);
    }
  }, [isRecording, transcript, referenceSentence, evaluation]);

  // Proceed to next sentence
  const handleNextSentence = () => {
    const passed = evaluation?.isPassed || false;
    onProceed(passed, referenceSentence);
  };

  if (!currentItem) {
    return null;
  }

  const progressPercent = items.length > 0 ? Math.round(((currentIndex + 1) / items.length) * 100) : 0;

  return (
    <div className="exercise-modal-backdrop" onClick={onClose}>
      <div
        className="exercise-modal-window"
        style={{ maxWidth: "680px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="exercise-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              className="ex-back-menu-btn"
              onClick={onBackToMenu}
              title="Quay lại danh mục chọn dạng bài tập"
            >
              <ArrowLeft size={16} />
              <span>Menu</span>
            </button>
            <div className="ex-header-divider" />
            <div className="ex-progress-bar-wrap" style={{ minWidth: "120px" }}>
              <div className="ex-progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <div className="ex-header-meta">
            {combo > 1 && (
              <span className="ex-combo-badge">
                <Zap size={14} color="#f59e0b" /> {combo} Combo
              </span>
            )}
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--primary)" }}>
              {currentIndex + 1} / {items.length}
            </span>
            <button className="btn-ex-close" onClick={onClose} title="Thoát bài tập">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Sub Banner */}
        <div className="ex-mode-banner">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="ex-mode-tag" style={{ background: "rgba(16, 185, 129, 0.12)", color: "#059669" }}>
              <Sparkles size={14} />
              <span>Dạng 8: Luyện Shadowing Chuẩn Ngữ Điệu</span>
            </span>
          </div>
          <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            Điểm: <strong>{score}</strong>
          </span>
        </div>

        {/* Main Shadowing Arena */}
        <div className="shadowing-arena">
          <div className="shadowing-card">
            {/* Audio Control Bar */}
            <div className="shadowing-audio-section">
              <div className="shadowing-player-left">
                <button
                  type="button"
                  className="btn-shadow-listen"
                  onClick={() => playReferenceAudio()}
                  disabled={isPlayingAudio}
                  title="Nghe câu mẫu bản ngữ"
                >
                  <Volume2 size={22} />
                </button>
                <span style={{ fontWeight: 600, fontSize: "0.92rem", color: "var(--text-primary)" }}>
                  {isPlayingAudio ? "Đang phát câu mẫu..." : "Nghe câu mẫu"}
                </span>
              </div>

              {/* Speed Switcher */}
              <div className="shadowing-speed-toggle">
                <button
                  type="button"
                  className={`btn-speed-pill ${playbackSpeed === 0.75 ? "active" : ""}`}
                  onClick={() => {
                    setPlaybackSpeed(0.75);
                    playReferenceAudio(0.75);
                  }}
                  title="Tốc độ chậm rõ"
                >
                  0.75x
                </button>
                <button
                  type="button"
                  className={`btn-speed-pill ${playbackSpeed === 0.85 ? "active" : ""}`}
                  onClick={() => {
                    setPlaybackSpeed(0.85);
                    playReferenceAudio(0.85);
                  }}
                  title="Tốc độ tiêu chuẩn học viên"
                >
                  0.85x
                </button>
                <button
                  type="button"
                  className={`btn-speed-pill ${playbackSpeed === 1.0 ? "active" : ""}`}
                  onClick={() => {
                    setPlaybackSpeed(1.0);
                    playReferenceAudio(1.0);
                  }}
                  title="Tốc độ tự nhiên bản ngữ"
                >
                  1.0x
                </button>
              </div>
            </div>

            {/* Target Reference Sentence */}
            <div className="shadowing-target-box">
              <div className="shadowing-target-label">Câu mẫu cần Shadowing:</div>
              <div className="shadowing-sentence-tokens">
                {evaluation ? (
                  evaluation.alignedTokens.map((tok, idx) => {
                    let cls = "shadow-word-pill";
                    if (tok.status === SHADOWING_STATUS.EXACT) cls += " status-exact";
                    else if (tok.status === SHADOWING_STATUS.CLOSE) cls += " status-close";
                    else cls += " status-missed";

                    return (
                      <span key={idx} className={cls} title={`Bạn đọc: ${tok.spokenWord || "(chưa đọc)"}`}>
                        {tok.status === SHADOWING_STATUS.EXACT && <Check size={14} />}
                        {tok.word}
                      </span>
                    );
                  })
                ) : (
                  referenceSentence.split(/\s+/).map((w, idx) => (
                    <span key={idx} className="shadow-word-pill">
                      {w}
                    </span>
                  ))
                )}
              </div>

              {currentItem.meaning && (
                <div className="shadowing-meaning-sub">
                  "{currentItem.meaning}"
                </div>
              )}
            </div>

            {/* Recording Mic Control Area */}
            <div className="shadowing-action-center">
              <button
                type="button"
                className={`btn-shadow-mic ${isRecording ? "recording" : ""}`}
                onClick={isRecording ? stopRecording : startRecording}
                title={isRecording ? "Bấm để dừng nói & chấm điểm" : "Bấm Micro để bắt đầu Shadowing"}
              >
                <Mic size={36} />
              </button>

              <div className="shadow-mic-caption">
                {isRecording
                  ? "🔴 Đang lắng nghe... Hãy nói to, rõ theo nhịp câu mẫu!"
                  : evaluation
                  ? "Đã hoàn thành! Xem kết quả phía dưới."
                  : "Chạm Micro để bắt đầu nói đuổi (Shadowing)"}
              </div>

              {/* Live transcript during speech */}
              {(isRecording || transcript) && (
                <div className="shadow-live-transcript">
                  {transcript ? (
                    <span>"{transcript}"</span>
                  ) : (
                    <span style={{ color: "var(--text-muted)" }}>...</span>
                  )}
                </div>
              )}
            </div>

            {/* Evaluation Results Feedback Panel */}
            {evaluation && (
              <div className="shadow-result-panel">
                <div className="shadow-score-row">
                  <div>
                    <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Độ chính xác ngữ điệu:</span>
                    <div className="shadow-score-badge">{evaluation.accuracyScore}%</div>
                  </div>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: "1.3rem",
                          opacity: i < evaluation.stars ? 1 : 0.25,
                        }}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>

                <div className="shadow-feedback-text">{evaluation.feedbackMessage}</div>

                <div className="shadow-controls-row">
                  <div style={{ display: "flex", gap: "10px" }}>
                    {recordedAudioUrl && (
                      <button
                        type="button"
                        className="btn-shadow-secondary"
                        onClick={playRecordedAudio}
                        title="Nghe lại giọng vừa thu âm của bạn"
                      >
                        <Headphones size={16} />
                        <span>Nghe lại giọng bạn</span>
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn-shadow-secondary"
                      onClick={startRecording}
                      title="Nói lại câu này"
                    >
                      <RotateCcw size={16} />
                      <span>Nói lại</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    className="btn-shadow-next"
                    onClick={handleNextSentence}
                    title="Sang câu tiếp theo"
                  >
                    <span>Tiếp tục</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
