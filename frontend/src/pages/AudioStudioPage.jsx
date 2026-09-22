import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  Upload,
  Headphones,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Repeat,
  Volume2,
  FileAudio,
  Lightbulb,
  AlertCircle,
} from "lucide-react";
import { DictationStudio } from "../components/Dictation/DictationStudio";
import { WordLookupPopover } from "../components/Vocab/WordLookupPopover";
import { useShortcuts } from "../hooks/useShortcuts";
import { useSettings } from "../hooks/useSettings";
import { SpeechRecognitionService } from "../services/speechRecognition";
import { evaluateMasked, getNextLetterHint, getNextWordHint } from "../utils/diffCalculator";
import "../styles/audio-studio.css";

const API_BASE = "";

export function AudioStudioPage({ isActive = true }) {
  const { settings } = useSettings();

  // Mode: "upload" | "text"
  const [activeMode, setActiveMode] = useState("upload");

  // Audio Upload & Transcription State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState("");
  const [audioResult, setAudioResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Sentence Navigation & Player State
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isLoopingSegment, setIsLoopingSegment] = useState(false);

  // Dictation Exercise State
  const [userInput, setUserInput] = useState("");
  const userInputRef = useRef("");
  userInputRef.current = userInput;

  const [isCompleted, setIsCompleted] = useState(false);
  const [completedMap, setCompletedMap] = useState({});
  const enterTrackerRef = useRef({ count: 0, lastTime: 0, lastInput: "" });

  // Speech Recognition State
  const [isListening, setIsListening] = useState(false);
  const speechRef = useRef(null);

  // Word Lookup Popover State
  const [lookupTarget, setLookupTarget] = useState(null);

  // Text-Only Analyzer State
  const [customText, setCustomText] = useState("");
  const [textAnalysisResult, setTextAnalysisResult] = useState(null);
  const [isAnalyzingText, setIsAnalyzingText] = useState(false);

  // Refs
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);

  const notifyYouTubePause = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("shotlang:pause-youtube-player"));
    }
  };

  // Pause AudioStudio playback when leaving tab or receiving pause signal from YouTube player
  useEffect(() => {
    if (!isActive && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  useEffect(() => {
    const handlePauseOther = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };
    window.addEventListener("shotlang:pause-other-audio", handlePauseOther);
    return () => window.removeEventListener("shotlang:pause-other-audio", handlePauseOther);
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    speechRef.current = new SpeechRecognitionService(
      (transcript) => {
        userInputRef.current = transcript;
        setUserInput(transcript);
      },
      (status) => setIsListening(status)
    );
  }, []);

  const handleToggleMic = useCallback(() => {
    if (speechRef.current) {
      speechRef.current.toggle();
    }
  }, []);

  // Current active sentence object
  const currentSentence = audioResult?.segments?.[currentSentenceIndex] || null;

  // Convert currentSentence to Challenge object compatible with DictationStudio
  const currentChallenge = useMemo(() => {
    if (!currentSentence) return null;
    return {
      id: currentSentence.id,
      text: currentSentence.text,
      time_start: currentSentence.start,
      time_end: currentSentence.end,
      translation: "",
    };
  }, [currentSentence]);

  // Audio Playback Controls
  const togglePlayPause = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      notifyYouTubePause();
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const replayCurrentSegment = useCallback(() => {
    if (!audioRef.current || !currentSentence) return;
    notifyYouTubePause();
    audioRef.current.currentTime = currentSentence.start;
    audioRef.current.play().catch(() => {});
    setIsPlaying(true);
  }, [currentSentence]);

  const seekRelative = useCallback((sec) => {
    if (!audioRef.current) return;
    const next = Math.max(0, Math.min(audioRef.current.duration || 0, audioRef.current.currentTime + sec));
    audioRef.current.currentTime = next;
  }, []);

  const handleSpeedChange = useCallback((speed) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, []);

  // Sentence Navigation Handlers
  const goToPrevSentence = useCallback(() => {
    if (currentSentenceIndex > 0) {
      setCurrentSentenceIndex((prev) => prev - 1);
    }
  }, [currentSentenceIndex]);

  const goToNextSentence = useCallback(() => {
    if (audioResult?.segments && currentSentenceIndex < audioResult.segments.length - 1) {
      setCurrentSentenceIndex((prev) => prev + 1);
    }
  }, [audioResult, currentSentenceIndex]);

  // Sync Audio Playhead & Local Dictation State with Current Segment
  useEffect(() => {
    if (!audioRef.current || !currentSentence) return;
    const audio = audioRef.current;

    // Seek to start of current sentence
    audio.currentTime = currentSentence.start;
    setCurrentTime(currentSentence.start);

    // Restore completed state or reset input
    if (completedMap[currentSentenceIndex]) {
      setUserInput(currentSentence.text);
      userInputRef.current = currentSentence.text;
      setIsCompleted(true);
    } else {
      setUserInput("");
      userInputRef.current = "";
      setIsCompleted(false);
    }

    // Auto play segment
    audio.play().catch(() => {});
    setIsPlaying(true);
  }, [currentSentenceIndex, audioResult]);

  // Audio TimeUpdate Event (Loop segment logic)
  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    const now = audio.currentTime;
    setCurrentTime(now);

    if (currentSentence && isLoopingSegment) {
      if (now >= currentSentence.end) {
        audio.currentTime = currentSentence.start;
        audio.play().catch(() => {});
      }
    }
  };

  // Hint Letter Mechanism (Identical to DictationStudio)
  const handleHintLetter = useCallback(() => {
    if (!currentSentence) return;
    const currentVal = userInputRef.current || userInput;
    const nextVal = getNextLetterHint(currentSentence.text, currentVal, settings.strictPunctuation);
    userInputRef.current = nextVal;
    setUserInput(nextVal);
  }, [currentSentence, userInput, settings.strictPunctuation]);

  // Hint Word Mechanism (Identical to DictationStudio)
  const handleHintWord = useCallback(() => {
    if (!currentSentence) return;
    const currentVal = userInputRef.current || userInput;
    const nextVal = getNextWordHint(currentSentence.text, currentVal);
    userInputRef.current = nextVal;
    setUserInput(nextVal);
  }, [currentSentence, userInput]);

  // Skip Sentence Mechanism
  const handleSkip = useCallback(() => {
    if (!currentSentence) return;
    userInputRef.current = currentSentence.text;
    setUserInput(currentSentence.text);
    setIsCompleted(true);
    setCompletedMap((prev) => ({ ...prev, [currentSentenceIndex]: true }));
  }, [currentSentence, currentSentenceIndex]);

  // Retry Current Sentence
  const handleRetryCurrent = useCallback(() => {
    if (!currentSentence) return;
    userInputRef.current = "";
    setUserInput("");
    setIsCompleted(false);
    setCompletedMap((prev) => ({ ...prev, [currentSentenceIndex]: false }));
    replayCurrentSegment();
  }, [currentSentence, currentSentenceIndex, replayCurrentSegment]);

  // Check Answer Handler (Supports double-Enter for hint)
  const handleCheck = useCallback((inputOverride) => {
    if (!currentSentence) return;

    if (isCompleted) {
      enterTrackerRef.current = { count: 0, lastTime: 0, lastInput: "" };
      if (currentSentenceIndex < (audioResult?.segments?.length || 0) - 1) {
        goToNextSentence();
      }
      return;
    }

    const currentVal = typeof inputOverride === "string" ? inputOverride : (userInputRef.current || userInput);
    const evalResult = evaluateMasked(currentSentence.text, currentVal, settings.strictPunctuation);

    if (evalResult.isCompleted) {
      enterTrackerRef.current = { count: 0, lastTime: 0, lastInput: "" };
      setIsCompleted(true);
      setCompletedMap((prev) => ({ ...prev, [currentSentenceIndex]: true }));
      userInputRef.current = currentVal;
      setUserInput(currentVal);

      if (settings.autoAdvance === "yes" && currentSentenceIndex < (audioResult?.segments?.length || 0) - 1) {
        setTimeout(() => {
          goToNextSentence();
        }, 800);
      }
    } else {
      const now = Date.now();
      const tracker = enterTrackerRef.current;
      if (now - tracker.lastTime < 1500 && tracker.lastInput === currentVal) {
        tracker.count += 1;
      } else {
        tracker.count = 1;
      }
      tracker.lastTime = now;

      if (tracker.count >= 2) {
        handleHintLetter();
        tracker.count = 0;
      } else {
        tracker.lastInput = currentVal;
      }
    }
  }, [currentSentence, isCompleted, currentSentenceIndex, audioResult, userInput, settings, goToNextSentence, handleHintLetter]);

  // Keyboard Shortcuts Integration (100% Identical to Dictation Feature)
  useShortcuts({
    replayKey: settings.replayKey,
    playPauseKey: settings.playPauseKey,
    onReplay: replayCurrentSegment,
    onPlayPause: togglePlayPause,
    onPrev: goToPrevSentence,
    onNext: goToNextSentence,
    onCheck: () => handleCheck(userInputRef.current),
    onSkip: handleSkip,
    onHintLetter: handleHintLetter,
    onHintWord: handleHintWord,
    enabled: activeMode === "upload" && Boolean(audioResult),
  });

  // Upload Audio Handler
  const handleAudioUpload = async (file) => {
    if (!file) return;
    setIsUploading(true);
    setErrorMessage("");
    setUploadProgressText("Đang tải file âm thanh lên máy chủ...");

    const formData = new FormData();
    formData.append("audio_file", file);
    formData.append("language", "en");

    try {
      setUploadProgressText("Groq Whisper-large-v3 đang bóc tách phụ đề & mốc thời gian...");
      const res = await fetch(`${API_BASE}/api/audio-studio/transcribe`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `Lỗi tải audio (${res.status})`);
      }

      setUploadProgressText("Đang phân tích hiện tượng âm vị học & nối âm...");
      const data = await res.json();

      setAudioResult(data);
      setCurrentSentenceIndex(0);
      setCompletedMap({});
      setIsCompleted(false);
      setIsUploading(false);
    } catch (err) {
      console.error("Upload error:", err);
      setErrorMessage(err.message || "Đã xảy ra lỗi khi xử lý audio.");
      setIsUploading(false);
    }
  };

  // Drag and Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleAudioUpload(file);
    }
  };

  // Instant Text Analyzer
  const handleAnalyzeCustomText = async (textToAnalyze) => {
    const query = (textToAnalyze || customText).trim();
    if (!query) return;

    setIsAnalyzingText(true);
    try {
      const res = await fetch(`${API_BASE}/api/audio-studio/analyze-text`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: query }),
      });
      const data = await res.json();
      setTextAnalysisResult(data.breakdown);
      setIsAnalyzingText(false);
    } catch (err) {
      console.error(err);
      setIsAnalyzingText(false);
    }
  };

  // Helper formatting seconds to MM:SS
  const formatTime = (sec) => {
    if (isNaN(sec) || sec === null) return "00:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Render Connected Sentence with Symbols & Interactive Words
  const renderInteractiveSentence = (phonologyData) => {
    if (!phonologyData || !phonologyData.tokens) return null;

    const { tokens, phenomena } = phonologyData;
    const boundaryMap = {};
    (phenomena || []).forEach((p) => {
      boundaryMap[p.word1_index] = p;
    });

    return (
      <div className="connected-sentence-display">
        {tokens.map((tok, idx) => {
          const boundary = boundaryMap[idx];
          return (
            <React.Fragment key={idx}>
              <span
                className="word-interactive-link word-lookup-trigger"
                onClick={(e) => {
                  e.stopPropagation();
                  setLookupTarget({
                    word: tok.word,
                    element: e.currentTarget,
                    sentence: phonologyData.original_text,
                  });
                }}
                title="Bấm để tra nghĩa & nghe phát âm từ điển"
              >
                {tok.word}
              </span>

              {/* Boundary Symbol (‿, ᵂ, ᴶ, ✕, ⚡) */}
              {boundary && (
                <span
                  className={`phonology-symbol-chip ${
                    boundary.type === "CV_LINKING"
                      ? "symbol-cv"
                      : boundary.type === "VV_GLIDE_W"
                      ? "symbol-glide-w"
                      : boundary.type === "VV_GLIDE_J"
                      ? "symbol-glide-j"
                      : boundary.type === "ELISION_TD"
                      ? "symbol-elision"
                      : "symbol-assimilation"
                  }`}
                  title={`${boundary.name_vi}: ${boundary.explanation}`}
                >
                  {boundary.symbol}
                </span>
              )}

              {idx < tokens.length - 1 && !boundary && " "}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className="audio-studio-container">
      {/* Studio Header Hero */}
      <div className="audio-studio-hero">
        <div>
          <h1 className="audio-studio-hero-title">
            <Headphones size={28} color="#0284c7" />
            <span>Phòng Thu Âm & Luyện Nối Âm AI (Audio & Phonology Studio)</span>
          </h1>
          <p className="audio-studio-hero-subtitle">
            Tải lên bất kỳ file ghi âm hoặc audio tiếng Anh (MP3, WAV, M4A) — AI Whisper-large-v3 sẽ tự động bóc
            phụ đề từng câu, phân tích hiện tượng nối âm (Linking), nuốt âm (Elision), biến âm (Assimilation) và tạo bài luyện Dictation với đầy đủ phím tắt.
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            className={`btn ${activeMode === "upload" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => {
              setActiveMode("upload");
              setTimeout(() => {
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                  fileInputRef.current.click();
                }
              }, 0);
            }}
          >
            <Upload size={16} />
            <span>Tải file Audio</span>
          </button>
          <button
            className={`btn ${activeMode === "text" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setActiveMode("text")}
          >
            <Sparkles size={16} />
            <span>Phân tích văn bản nhanh</span>
          </button>
        </div>
      </div>

      {/* ====================================================================== */}
      {/* MODE 1: AUDIO UPLOAD & DICTATION STUDIO                                 */}
      {/* ====================================================================== */}
      {activeMode === "upload" && (
        <>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="audio/mp3,audio/wav,audio/m4a,audio/ogg,audio/webm,audio/flac"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleAudioUpload(e.target.files[0]);
              }
            }}
          />

          {/* Upload Dropzone (When no audio is loaded or user wants another) */}
          {!audioResult && (
            <div
              className="audio-upload-card"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
            >

              <div className="upload-icon-wrapper">
                {isUploading ? <Sparkles size={32} className="spin" /> : <Upload size={32} />}
              </div>

              <div className="upload-title">
                {isUploading ? uploadProgressText : "Kéo thả file âm thanh vào đây hoặc bấm để chọn file"}
              </div>

              <div className="upload-hint">
                Hỗ trợ audio hội thoại, bản tin, bài hát, podcast tiếng Anh (Tối đa 25MB)
              </div>

              <div className="supported-formats-chips">
                <span className="format-chip">.MP3</span>
                <span className="format-chip">.WAV</span>
                <span className="format-chip">.M4A</span>
                <span className="format-chip">.OGG</span>
                <span className="format-chip">.WEBM</span>
              </div>

              {errorMessage && (
                <div style={{ marginTop: "16px", color: "#ef4444", fontSize: "0.9rem" }}>
                  <AlertCircle size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
                  {errorMessage}
                </div>
              )}
            </div>
          )}

          {/* Main Studio View when Audio is Transcribed */}
          {audioResult && (
            <>
              {/* Native Audio Player Card */}
              <div className="audio-player-card">
                <audio
                  ref={audioRef}
                  src={`${API_BASE}${audioResult.audio_url}`}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={(e) => setDuration(e.target.duration || audioResult.duration)}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />

                <div className="audio-info-row">
                  <div className="audio-file-badge">
                    <FileAudio size={20} color="#0284c7" />
                    <span>{audioResult.filename}</span>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 400 }}>
                      ({audioResult.total_sentences} câu • {formatTime(audioResult.duration)})
                    </span>
                  </div>

                  <button
                    className="btn btn-secondary"
                    style={{ fontSize: "0.82rem", padding: "5px 12px" }}
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                        fileInputRef.current.click();
                      }
                    }}
                  >
                    <span>Tải file khác</span>
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="audio-progress-container">
                  <div
                    className="audio-progress-bar"
                    onClick={(e) => {
                      if (!audioRef.current || !duration) return;
                      const rect = e.currentTarget.getBoundingClientRect();
                      const pos = (e.clientX - rect.left) / rect.width;
                      audioRef.current.currentTime = pos * duration;
                    }}
                  >
                    <div
                      className="audio-progress-fill"
                      style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                    />
                  </div>
                  <div className="audio-progress-time">
                    <span>{formatTime(currentTime)}</span>
                    <span>
                      {currentSentence
                        ? `Câu ${currentSentenceIndex + 1}/${audioResult.total_sentences} (${formatTime(
                            currentSentence.start
                          )} - ${formatTime(currentSentence.end)})`
                        : formatTime(duration)}
                    </span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Player Controls */}
                <div className="player-controls-row">
                  <button
                    className="btn btn-secondary btn-icon"
                    title="Tua lùi 3 giây"
                    onClick={() => seekRelative(-3)}
                  >
                    <RotateCcw size={18} />
                  </button>

                  <button className="player-main-btn" onClick={togglePlayPause}>
                    {isPlaying ? <Pause size={22} /> : <Play size={22} style={{ marginLeft: "2px" }} />}
                  </button>

                  <button
                    className="btn btn-secondary btn-icon"
                    title="Phát lại đoạn câu này (Ctrl)"
                    onClick={replayCurrentSegment}
                  >
                    <Repeat size={18} />
                  </button>

                  <button
                    className="btn btn-secondary btn-icon"
                    title="Tua tới 3 giây"
                    onClick={() => seekRelative(3)}
                  >
                    <RotateCw size={18} />
                  </button>

                  <button
                    className={`btn btn-secondary ${isLoopingSegment ? "loop-badge-active" : ""}`}
                    style={{ fontSize: "0.82rem", padding: "6px 12px" }}
                    onClick={() => setIsLoopingSegment(!isLoopingSegment)}
                    title="Lặp lại câu hiện tại khi nghe xong"
                  >
                    <Repeat size={14} style={{ marginRight: "4px" }} />
                    <span>Lặp câu {isLoopingSegment ? "Bật" : "Tắt"}</span>
                  </button>

                  <div className="speed-group" style={{ marginLeft: "8px" }}>
                    {[0.75, 0.9, 1.0, 1.25].map((speed) => (
                      <button
                        key={speed}
                        className={`speed-btn ${playbackSpeed === speed ? "active" : ""}`}
                        onClick={() => handleSpeedChange(speed)}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Two-Column Studio Layout */}
              <div className="studio-split-layout">
                {/* Left Column: Identical Dictation Studio Component & Sentence Picker */}
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {/* Full Dictation Studio Card (100% Identical shortcuts & features) */}
                  <DictationStudio
                    currentChallenge={currentChallenge}
                    currentIndex={currentSentenceIndex}
                    totalChallenges={audioResult.segments.length}
                    targetLang="none"
                    sourceLang="en"
                    userInput={userInput}
                    setUserInput={(val) => {
                      setUserInput(val);
                      userInputRef.current = val;
                    }}
                    onInputChange={(val) => {
                      setUserInput(val);
                      userInputRef.current = val;
                    }}
                    isListening={isListening}
                    isPlaying={isPlaying}
                    onToggleMic={handleToggleMic}
                    onCheck={handleCheck}
                    onSkip={handleSkip}
                    onReplay={replayCurrentSegment}
                    onPlayPause={togglePlayPause}
                    onSpeakSentence={replayCurrentSegment}
                    onHintLetter={handleHintLetter}
                    onHintWord={handleHintWord}
                    onPrev={goToPrevSentence}
                    onNext={goToNextSentence}
                    isCompleted={isCompleted}
                    strictPunctuation={settings.strictPunctuation}
                    onNextChallenge={goToNextSentence}
                    onRetryChallenge={handleRetryCurrent}
                    onCompleteLesson={() => {
                      alert("Chúc mừng! Bạn đã hoàn thành bài nghe audio này! 🎉");
                    }}
                  />

                  {/* Sentence Picker List */}
                  <div className="phonology-card">
                    <div className="card-header-bar">
                      <div className="card-header-title">
                        <span>Danh sách câu trong bài ({audioResult.total_sentences})</span>
                      </div>
                    </div>

                    <div className="sentence-picker-list">
                      {audioResult.segments.map((seg, idx) => (
                        <div
                          key={seg.id}
                          className={`sentence-item-btn ${idx === currentSentenceIndex ? "active" : ""} ${
                            completedMap[idx] ? "completed-item" : ""
                          }`}
                          onClick={() => setCurrentSentenceIndex(idx)}
                        >
                          <div className="sentence-item-text">
                            <span style={{ color: "#0284c7", fontWeight: 700, marginRight: "8px" }}>
                              {idx + 1}.
                            </span>
                            <span>{seg.text}</span>
                          </div>
                          <div className="sentence-item-time">
                            {formatTime(seg.start)} - {formatTime(seg.end)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Phonology & Connected Speech Breakdown (Only shown when sentence is completed) */}
                <div>
                  <div className="phonology-card">
                    <div className="card-header-bar">
                      <div className="card-header-title">
                        <span>Phân tích Nối âm & Hiện tượng Âm vị học</span>
                      </div>
                    </div>

                    {currentSentence ? (
                      isCompleted ? (
                        <>
                          {/* Annotated Sentence Display */}
                          {renderInteractiveSentence(currentSentence.phonology)}

                          {/* Connected IPA Preview */}
                          {currentSentence.phonology?.connected_ipa && (
                            <div className="connected-ipa-box">
                              <Volume2 size={18} />
                              <span>Phiên âm nối thực tế: {currentSentence.phonology.connected_ipa}</span>
                            </div>
                          )}

                          {/* Phenomena List */}
                          <div className="phenomena-list">
                            {currentSentence.phonology?.phenomena?.length > 0 ? (
                              currentSentence.phonology.phenomena.map((p, pIdx) => (
                                <div key={pIdx} className="phenomenon-item">
                                  <div className="phenomenon-header">
                                    <span
                                      className={`phenomenon-badge ${
                                        p.type === "CV_LINKING"
                                          ? "badge-cv"
                                          : p.type.startsWith("VV_GLIDE")
                                          ? "badge-glide"
                                          : p.type.startsWith("ELISION")
                                          ? "badge-elision"
                                          : p.type.startsWith("ASSIMILATION")
                                          ? "badge-assimilation"
                                          : "badge-weak"
                                      }`}
                                    >
                                      {p.name_vi}
                                    </span>
                                    <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "#0284c7" }}>
                                      {p.connected_sound || p.pair}
                                    </span>
                                  </div>
                                  <div className="phenomenon-explanation">{p.explanation}</div>
                                </div>
                              ))
                            ) : (
                              <div style={{ color: "var(--text-muted)", fontSize: "0.9rem", padding: "12px 0" }}>
                                Câu này phát âm với các từ tách bạch chuẩn mực, không xuất hiện hiện tượng biến âm đặc biệt.
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        <div style={{ color: "var(--text-muted)", textAlign: "center", padding: "48px 20px" }}>
                          <p style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: "6px", color: "var(--text-main)" }}>
                            🔒 Chưa mở khóa phân tích
                          </p>
                          <p style={{ fontSize: "0.85rem" }}>
                            Hãy hoàn thành gõ chính xác câu này để xem phân tích nối âm & hiện tượng âm vị học chi tiết.
                          </p>
                        </div>
                      )
                    ) : (
                      <div style={{ color: "var(--text-muted)", textAlign: "center", padding: "40px 0" }}>
                        Chọn một câu để xem phân tích âm vị học chi tiết.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* ====================================================================== */}
      {/* MODE 2: INSTANT TEXT PHONOLOGY ANALYZER                                */}
      {/* ====================================================================== */}
      {activeMode === "text" && (
        <div className="phonology-card">
          <div className="card-header-bar">
            <div className="card-header-title">
              <Sparkles size={22} color="#0284c7" />
              <span>Phân Tích Nối Âm Trực Tiếp Cho Bất Kỳ Đoạn Văn / Câu Tiếng Anh</span>
            </div>
          </div>

          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "16px" }}>
            Nhập hoặc dán bất kỳ câu tiếng Anh nào để hệ thống tự động vẽ cung nối âm, chỉ điểm các vị trí nuốt âm
            (Elision), biến âm hòa nhập (Coalescent assimilation) và dạng giảm âm yếu (Weak forms).
          </p>

          <div className="instant-analyzer-box">
            <input
              type="text"
              className="analyzer-input"
              placeholder="Nhập câu tiếng Anh... Ví dụ: I picked it up and want you to see it."
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAnalyzeCustomText(customText);
                }
              }}
            />
            <button
              className="btn btn-primary"
              onClick={() => handleAnalyzeCustomText(customText)}
              disabled={isAnalyzingText}
            >
              <Sparkles size={16} />
              <span>{isAnalyzingText ? "Đang phân tích..." : "Phân tích ngay"}</span>
            </button>
          </div>

          {/* Render Result */}
          {textAnalysisResult && (
            <div style={{ marginTop: "24px" }}>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "12px" }}>
                Kết quả phân tích ngữ âm:
              </h3>

              {renderInteractiveSentence(textAnalysisResult)}

              {textAnalysisResult.connected_ipa && (
                <div className="connected-ipa-box">
                  <Volume2 size={18} />
                  <span>Phiên âm nối liền mạch: {textAnalysisResult.connected_ipa}</span>
                </div>
              )}

              <div className="phenomena-list">
                {textAnalysisResult.phenomena?.length > 0 ? (
                  textAnalysisResult.phenomena.map((p, pIdx) => (
                    <div key={pIdx} className="phenomenon-item">
                      <div className="phenomenon-header">
                        <span
                          className={`phenomenon-badge ${
                            p.type === "CV_LINKING"
                              ? "badge-cv"
                              : p.type.startsWith("VV_GLIDE")
                              ? "badge-glide"
                              : p.type.startsWith("ELISION")
                              ? "badge-elision"
                              : p.type.startsWith("ASSIMILATION")
                              ? "badge-assimilation"
                              : "badge-weak"
                          }`}
                        >
                          {p.name_vi}
                        </span>
                        <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "#0284c7" }}>
                          {p.connected_sound || p.pair}
                        </span>
                      </div>
                      <div className="phenomenon-explanation">{p.explanation}</div>
                    </div>
                  ))
                ) : (
                  <div style={{ color: "var(--text-muted)", fontSize: "0.9rem", padding: "12px 0" }}>
                    Câu này các từ phát âm riêng biệt, không có hiện tượng nối âm hoặc biến âm.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Global Interactive Word Lookup Popover */}
      {lookupTarget && (
        <WordLookupPopover
          word={lookupTarget.word}
          targetElement={lookupTarget.element}
          contextSentence={lookupTarget.sentence}
          onClose={() => setLookupTarget(null)}
        />
      )}
    </div>
  );
}

export default AudioStudioPage;
