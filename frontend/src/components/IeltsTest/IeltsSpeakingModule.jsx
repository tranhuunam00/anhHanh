import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { IeltsRecordedAudioPlayer } from "./IeltsRecordedAudioPlayer.jsx";
import { IeltsSpeakingBottomNav } from "./IeltsSpeakingBottomNav.jsx";
import {
  getPartQuestions,
  getDefaultQuestionTimeLimit,
  formatSpeakingTimer
} from "../../utils/ieltsSpeakingUtils.js";
import {
  Eye,
  Volume2,
  Mic,
  Square,
  RotateCcw,
  Clock,
  FileText,
  Check,
  CheckCircle,
  X
} from "../../constants/icons.js";

/**
 * IELTS Academic Speaking Simulator (Computer-Delivered Standard UI)
 * Features:
 * - Hidden question behind "Show question" with Eye icon
 * - Examiner SpeechSynthesis: reads the question aloud with natural English accent
 * - Countdown timer starts automatically after the examiner finishes speaking
 * - Minimalist circular mic recorder for capturing responses
 * - Segmented Bottom Question Strip with Part 1, Part 2, and Part 3 indicators
 * - Candidate Scratchpad Notepad for Part 2 prep and ideas
 */
export const IeltsSpeakingModule = ({
  speakingData,
  user = null,
  isLocked = false
}) => {
  const parts = useMemo(() => speakingData?.parts || [], [speakingData]);
  const [activePart, setActivePart] = useState(1);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);

  // Current Part & Questions
  const currentPart = parts.find((p) => p.partNumber === activePart) || parts[0];
  const currentQuestions = useMemo(() => getPartQuestions(currentPart), [currentPart]);
  const currentQuestion = currentQuestions[activeQuestionIdx] || currentQuestions[0];
  const currentKey = `p${activePart}_q${currentQuestion?.id || 1}`;

  // Revealed Map: which questions have been opened with "Show question"
  const [revealedMap, setRevealedMap] = useState({});

  // Examiner speaking status
  const [isExaminerSpeaking, setIsExaminerSpeaking] = useState(false);

  // Time remaining per question { [currentKey]: seconds }
  const [timeRemainingMap, setTimeRemainingMap] = useState({});
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Part 2 prep/speak mode
  const [cueCardMode, setCueCardMode] = useState("prep"); // "prep" (60s) or "speak" (120s)

  // Audio recording state per question
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [recordingsMap, setRecordingsMap] = useState({});
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordIntervalRef = useRef(null);

  // Candidate prep notes per part
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem("ielts_speaking_notes_cam21_t2");
      return saved ? JSON.parse(saved) : { 1: "", 2: "", 3: "" };
    } catch {
      return { 1: "", 2: "", 3: "" };
    }
  });
  const [isNotepadOpen, setIsNotepadOpen] = useState(false);

  // SpeechSynthesis English Speaker
  const speakExaminerQuestion = useCallback((text, onEnd) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      if (onEnd) onEnd();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const enVoice =
      voices.find((v) => v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Daniel") || v.name.includes("Samantha"))) ||
      voices.find((v) => v.lang.startsWith("en"));
    if (enVoice) utterance.voice = enVoice;

    utterance.onend = () => {
      setIsExaminerSpeaking(false);
      if (onEnd) onEnd();
    };
    utterance.onerror = () => {
      setIsExaminerSpeaking(false);
      if (onEnd) onEnd();
    };

    setIsExaminerSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, []);

  // Time limit for current question
  const currentRemainingTime = useMemo(() => {
    if (timeRemainingMap[currentKey] !== undefined) {
      return timeRemainingMap[currentKey];
    }
    if (activePart === 2) {
      return cueCardMode === "prep" ? (currentPart?.prepTimeSeconds || 60) : (currentPart?.speakingTimeSeconds || 120);
    }
    return getDefaultQuestionTimeLimit(activePart);
  }, [timeRemainingMap, currentKey, activePart, cueCardMode, currentPart]);

  // Click "Show question"
  const handleShowQuestion = () => {
    if (isLocked) return;
    setRevealedMap((prev) => ({ ...prev, [currentKey]: true }));
    setIsTimerRunning(false);

    let textToSpeak = "";
    if (currentQuestion?.isCueCard) {
      textToSpeak = `Here is your topic. ${currentQuestion.topic}. You should say: ${currentQuestion.prompts.join(", ")}`;
    } else {
      textToSpeak = currentQuestion?.text || "";
    }

    // Auto-read question aloud, then trigger timer countdown ("xong bắt đầu đồng hồ bấm")
    speakExaminerQuestion(textToSpeak, () => {
      setIsTimerRunning(true);
    });
  };

  // Re-read examiner question manually
  const handleReReadQuestion = () => {
    if (isExaminerSpeaking) return;
    const textToSpeak = currentQuestion?.isCueCard
      ? `${currentQuestion.topic}. You should say: ${currentQuestion.prompts.join(", ")}`
      : currentQuestion?.text || "";
    speakExaminerQuestion(textToSpeak);
  };

  // Per-question countdown ticker
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setTimeRemainingMap((prev) => {
        const prevSec = prev[currentKey] !== undefined ? prev[currentKey] : currentRemainingTime;
        if (prevSec <= 1) {
          clearInterval(interval);
          setIsTimerRunning(false);
          // For Part 2: If prep time ends, auto-switch to 2-min speaking mode
          if (activePart === 2 && cueCardMode === "prep") {
            setCueCardMode("speak");
            return { ...prev, [currentKey]: currentPart?.speakingTimeSeconds || 120 };
          }
          return { ...prev, [currentKey]: 0 };
        }
        return { ...prev, [currentKey]: prevSec - 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, currentKey, currentRemainingTime, activePart, cueCardMode, currentPart]);

  // Clean Voice Recording Handlers
  const startRecording = async () => {
    if (isLocked) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setRecordingsMap((prev) => ({
          ...prev,
          [currentKey]: { url, duration: recordSeconds }
        }));
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordSeconds(0);

      recordIntervalRef.current = setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
    } catch {
      alert("Vui lòng cấp quyền Microphone trên trình duyệt để ghi âm câu trả lời.");
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current || !isRecording) return;
    clearInterval(recordIntervalRef.current);
    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    setIsRecording(false);
  };

  // Navigation handlers
  const handleSelectQuestion = (partNum, qIdx) => {
    if (isExaminerSpeaking && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsExaminerSpeaking(false);
    }
    if (isRecording) stopRecording();
    setActivePart(partNum);
    setActiveQuestionIdx(qIdx);
    setIsTimerRunning(false);
  };

  const handleNextQuestion = () => {
    if (activeQuestionIdx < currentQuestions.length - 1) {
      handleSelectQuestion(activePart, activeQuestionIdx + 1);
    } else if (activePart < 3) {
      handleSelectQuestion(activePart + 1, 0);
    }
  };

  const handlePrevQuestion = () => {
    if (activeQuestionIdx > 0) {
      handleSelectQuestion(activePart, activeQuestionIdx - 1);
    } else if (activePart > 1) {
      const prevPart = parts.find((p) => p.partNumber === activePart - 1);
      const prevQs = getPartQuestions(prevPart);
      handleSelectQuestion(activePart - 1, Math.max(0, prevQs.length - 1));
    }
  };

  const handleNotesChange = (val) => {
    if (isLocked) return;
    setNotes((prev) => {
      const next = { ...prev, [activePart]: val };
      try {
        localStorage.setItem("ielts_speaking_notes_cam21_t2", JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const isCurrentRevealed = Boolean(revealedMap[currentKey]) || isLocked;
  const recordedItem = recordingsMap[currentKey];

  return (
    <div className="ielts-speaking-stage-container">
      {/* Top Header Information */}
      <header className="ielts-speaking-stage-header">
        <div className="ielts-speaking-part-title-wrap">
          <span className="ielts-speaking-pill-badge">Part {activePart}</span>
          <h3 className="ielts-speaking-main-title">{currentPart?.title}</h3>
          {currentPart?.topic && (
            <span className="ielts-speaking-topic-tag">Chủ đề: {currentPart.topic}</span>
          )}
        </div>

        {/* Scratchpad Toggle Button */}
        <button
          type="button"
          className={`ielts-notepad-toggle-btn ${isNotepadOpen ? "active" : ""}`}
          onClick={() => setIsNotepadOpen(!isNotepadOpen)}
          title="Mở giấy nháp điện tử để ghi chú"
        >
          <FileText className="w-4 h-4 mr-1.5" />
          <span>Giấy nháp (Part {activePart})</span>
        </button>
      </header>

      {/* Center Speaking Stage */}
      <div className="ielts-speaking-center-stage">
        {!isCurrentRevealed ? (
          /* Initial Screen: Centered "Show question" Button */
          <div className="ielts-speaking-curtain">
            <p className="ielts-curtain-hint">
              Nhấn nút bên dưới để nghe giám khảo đọc câu hỏi và bắt đầu tính giờ trả lời:
            </p>
            <button
              type="button"
              className="ielts-show-question-btn"
              onClick={handleShowQuestion}
            >
              <Eye className="w-6 h-6 mr-2 text-primary" />
              <span>Show question</span>
            </button>
          </div>
        ) : (
          /* Question Revealed Card */
          <div className="ielts-speaking-card-wrapper">
            {/* Examiner Speaking Waves Banner */}
            {isExaminerSpeaking && (
              <div className="ielts-examiner-speaking-banner">
                <Volume2 className="w-5 h-5 mr-2 text-primary animate-pulse" />
                <span>Giám khảo đang đọc câu hỏi... Hãy lắng nghe kỹ!</span>
              </div>
            )}

            {/* Question Text / Cue Card */}
            {currentQuestion?.isCueCard ? (
              <div className="ielts-cue-card">
                <span className="ielts-cue-card-badge">CANDIDATE CUE CARD</span>
                <h4 className="ielts-cue-topic">{currentQuestion.topic}</h4>
                <p className="ielts-cue-intro">You should say:</p>
                <ul className="ielts-cue-prompts">
                  {currentQuestion.prompts.map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
                <div className="ielts-cue-mode-indicator">
                  {cueCardMode === "prep" ? (
                    <span>⏳ Đang trong 1 phút chuẩn bị dàn ý...</span>
                  ) : (
                    <span>🎙️ Đang trong 2 phút trình bày bài nói...</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="ielts-question-text-box">
                {currentQuestion?.theme && (
                  <span className="ielts-q-theme-badge">Chủ đề: {currentQuestion.theme}</span>
                )}
                <h3 className="ielts-question-prompt-text">{currentQuestion?.text}</h3>

                <button
                  type="button"
                  className="ielts-re-read-audio-btn"
                  onClick={handleReReadQuestion}
                  title="Nghe lại câu hỏi từ giám khảo"
                  disabled={isExaminerSpeaking}
                >
                  <Volume2 className="w-4 h-4 mr-1 text-primary" />
                  <span>Nghe lại</span>
                </button>
              </div>
            )}

            {/* Center Time Limit Pill (Soft Red/Orange Pill) */}
            <div className="ielts-question-time-limit-pill">
              <span className="ielts-time-limit-dot" />
              <span>Time limit {formatSpeakingTimer(currentRemainingTime)}</span>
            </div>

            {/* Minimalist Mic Recording Area */}
            <div className="ielts-speaking-recorder-row">
              {!isRecording ? (
                <button
                  type="button"
                  className="ielts-mic-btn"
                  onClick={startRecording}
                  disabled={isLocked}
                  title={isLocked ? "Đã khóa bài nói" : "Bắt đầu ghi âm câu trả lời"}
                  aria-label="Ghi âm"
                >
                  <Mic className="w-5 h-5" />
                </button>
              ) : (
                <div className="ielts-recording-active-wrap">
                  <button
                    type="button"
                    className="ielts-mic-btn recording"
                    onClick={stopRecording}
                    title="Dừng ghi âm"
                    aria-label="Dừng ghi âm"
                  >
                    <Square className="w-4 h-4 text-white" />
                  </button>
                  <div className="ielts-recording-live-indicator">
                    <span className="ielts-pulse-dot" />
                    <span>Đang thu: {formatSpeakingTimer(recordSeconds)}</span>
                  </div>
                </div>
              )}

              {/* Audio playback when recorded */}
              {recordedItem && !isRecording && (
                <div className="ielts-playback-bar">
                  <IeltsRecordedAudioPlayer
                    audioUrl={recordedItem.url}
                    duration={recordedItem.duration || recordSeconds}
                    downloadName={`ielts_speaking_${currentKey}.webm`}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating Scratchpad Notepad Drawer */}
      {isNotepadOpen && (
        <aside className="ielts-floating-notepad-drawer">
          <div className="ielts-floating-notepad-header">
            <h5>
              <FileText className="w-4 h-4 mr-1 text-primary inline" />
              Giấy nháp điện tử (Part {activePart})
            </h5>
            <button
              type="button"
              className="ielts-notepad-close-btn"
              onClick={() => setIsNotepadOpen(false)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <textarea
            value={notes[activePart] || ""}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Ghi chú ý tưởng, từ vựng hoặc dàn bài tại đây (tự động lưu)..."
            className="ielts-floating-notepad-textarea"
            rows={10}
            readOnly={isLocked}
          />
        </aside>
      )}

      {/* Bottom Navigation Strip (Exact Match with user screenshot) */}
      <IeltsSpeakingBottomNav
        parts={parts}
        activePart={activePart}
        activeQuestionIdx={activeQuestionIdx}
        answeredMap={recordingsMap}
        onSelectQuestion={handleSelectQuestion}
        onPrevQuestion={handlePrevQuestion}
        onNextQuestion={handleNextQuestion}
        isLocked={isLocked}
      />
    </div>
  );
};
