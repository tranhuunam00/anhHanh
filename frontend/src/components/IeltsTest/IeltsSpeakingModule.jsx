import React, { useState, useRef, useEffect } from "react";
import { IeltsSplitPane } from "./IeltsSplitPane.jsx";
import { canUseIeltsAiGrading } from "../../utils/ieltsScoring.js";
import { Mic, Play, Pause, RotateCcw, Sparkles, Clock, Volume2 } from "../../constants/icons.js";

/**
 * IELTS Speaking Test Module
 * Left pane: Part 1, 2, 3 questions, cue card, timers
 * Right pane: Prep notes & voice audio recorder
 */
export const IeltsSpeakingModule = ({
  speakingData,
  user = null
}) => {
  const [activePart, setActivePart] = useState(1);
  const parts = speakingData?.parts || [];
  const currentPart = parts.find((p) => p.partNumber === activePart) || parts[0];

  // Prep notes per part
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem("ielts_speaking_notes_cam21_t2");
      return saved ? JSON.parse(saved) : { 1: "", 2: "", 3: "" };
    } catch {
      return { 1: "", 2: "", 3: "" };
    }
  });

  // Timers for Part 2
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState("prep"); // "prep" (60s) or "speak" (120s)
  const timerRef = useRef(null);

  // Audio recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(null);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordIntervalRef = useRef(null);

  const isAuthorized = canUseIeltsAiGrading(user);

  const handleNotesChange = (val) => {
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

  // Timer countdown
  useEffect(() => {
    if (isTimerRunning && timerSeconds > 0) {
      timerRef.current = setTimeout(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
    }
    return () => clearTimeout(timerRef.current);
  }, [isTimerRunning, timerSeconds]);

  const startTimer = (mode) => {
    setTimerMode(mode);
    setTimerSeconds(mode === "prep" ? 60 : 120);
    setIsTimerRunning(true);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(timerMode === "prep" ? 60 : 120);
  };

  // Voice recording handlers
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordSeconds(0);

      recordIntervalRef.current = setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      alert("Không thể truy cập microphone. Vui lòng cấp quyền ghi âm.");
      console.warn("Microphone error:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      clearInterval(recordIntervalRef.current);
    }
  };

  const formatTimer = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const leftPaneContent = (
    <div className="ielts-left-scroll-pane ielts-speaking-cues-pane">
      <div className="ielts-speaking-nav-tabs">
        {parts.map((p) => (
          <button
            key={p.partNumber}
            type="button"
            className={`ielts-part-tab-btn ${activePart === p.partNumber ? "active" : ""}`}
            onClick={() => setActivePart(p.partNumber)}
          >
            Part {p.partNumber}
            <span className="ielts-tab-subrange">{p.duration}</span>
          </button>
        ))}
      </div>

      <div className="ielts-speaking-card">
        <div className="ielts-speaking-card-header">
          <span className="ielts-badge">{currentPart.title}</span>
          <span className="ielts-time-hint">{currentPart.duration}</span>
        </div>
        <p className="ielts-speaking-desc">{currentPart.description}</p>

        {/* Part 1 */}
        {activePart === 1 && (
          <div className="ielts-speaking-questions-list">
            <h5 className="ielts-topic-label">Chủ đề: {currentPart.topic}</h5>
            {currentPart.questions.map((q) => (
              <div key={q.id} className="ielts-speaking-question-item">
                <span className="ielts-speaking-q-num">Q{q.id}.</span>
                <p className="ielts-speaking-q-text">{q.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* Part 2 Cue Card */}
        {activePart === 2 && currentPart.cueCard && (
          <div className="ielts-cue-card-container">
            <div className="ielts-cue-card">
              <h5 className="ielts-cue-topic">{currentPart.cueCard.topic}</h5>
              <p className="ielts-cue-intro">You should say:</p>
              <ul className="ielts-cue-prompts">
                {currentPart.cueCard.prompts.map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            </div>

            {/* Timers for Part 2 */}
            <div className="ielts-cue-timers">
              <div className="ielts-timer-display">
                <Clock className="w-5 h-5 mr-1.5 text-primary" />
                <span className="ielts-timer-digits">{formatTimer(timerSeconds)}</span>
                <span className="ielts-timer-tag">({timerMode === "prep" ? "Chuẩn bị" : "Nói"})</span>
              </div>
              <div className="ielts-timer-actions">
                <button
                  type="button"
                  className={`ielts-timer-btn ${timerMode === "prep" ? "active" : ""}`}
                  onClick={() => startTimer("prep")}
                >
                  1 phút chuẩn bị
                </button>
                <button
                  type="button"
                  className={`ielts-timer-btn ${timerMode === "speak" ? "active" : ""}`}
                  onClick={() => startTimer("speak")}
                >
                  2 phút nói
                </button>
                <button
                  type="button"
                  className="ielts-timer-btn-reset"
                  onClick={resetTimer}
                  title="Đặt lại bộ đếm"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Part 3 Discussion */}
        {activePart === 3 && currentPart.sections && (
          <div className="ielts-part3-sections">
            {currentPart.sections.map((sec, sIdx) => (
              <div key={sIdx} className="ielts-part3-theme-group">
                <h5 className="ielts-theme-title">{sec.theme}</h5>
                {sec.questions.map((q) => (
                  <div key={q.id} className="ielts-speaking-question-item">
                    <span className="ielts-speaking-q-num">Q{q.id}.</span>
                    <p className="ielts-speaking-q-text">{q.text}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const rightPaneContent = (
    <div className="ielts-right-scroll-pane ielts-speaking-workspace-pane">
      {/* Voice Recorder Card */}
      <div className="ielts-recorder-card">
        <div className="ielts-recorder-header">
          <h4 className="ielts-pane-header-title">
            <Mic className="w-4 h-4 mr-1.5 inline text-primary" /> Ghi âm câu trả lời
          </h4>
          {isRecording && (
            <span className="ielts-recording-pulse">
              <span className="ielts-pulse-dot" /> Đang ghi âm: {formatTimer(recordSeconds)}
            </span>
          )}
        </div>

        <div className="ielts-recorder-controls">
          {!isRecording ? (
            <button
              type="button"
              className="ielts-record-btn-start"
              onClick={startRecording}
            >
              <Mic className="w-4 h-4 mr-1.5 inline" /> Bắt đầu ghi âm
            </button>
          ) : (
            <button
              type="button"
              className="ielts-record-btn-stop"
              onClick={stopRecording}
            >
              <Pause className="w-4 h-4 mr-1.5 inline" /> Dừng & Lưu bản thu
            </button>
          )}

          {recordedAudioUrl && (
            <div className="ielts-playback-bar">
              <audio src={recordedAudioUrl} controls className="ielts-preview-audio" />
              <a
                href={recordedAudioUrl}
                download={`ielts_speaking_part${activePart}_recording.webm`}
                className="ielts-download-audio-link"
              >
                Tải bản ghi (.webm)
              </a>
            </div>
          )}
        </div>

        {/* AI Scoring Privilege */}
        <div className="ielts-speaking-ai-bar">
          {isAuthorized ? (
            <button
              type="button"
              className="ielts-ai-eval-btn"
              onClick={() => alert("Tính năng AI phân tích phát âm & lưu lượng đang kết nối model.")}
            >
              <Sparkles className="w-4 h-4 mr-1.5" /> Chấm điểm Speaking AI
            </button>
          ) : (
            <span className="ielts-ai-restricted-badge">
              🔒 AI chấm Speaking (Dành riêng cho tài khoản được cấp phép)
            </span>
          )}
        </div>
      </div>

      {/* Note-Taking Notepad */}
      <div className="ielts-notepad-card">
        <div className="ielts-notepad-header">
          <h5>Ghi chú chuẩn bị (Notepad Part {activePart})</h5>
          <span className="ielts-notepad-hint">Tự động lưu vào trình duyệt</span>
        </div>
        <textarea
          value={notes[activePart] || ""}
          onChange={(e) => handleNotesChange(e.target.value)}
          placeholder={`Ghi nhanh ý tưởng, từ vựng trọng tâm cho Part ${activePart}...`}
          className="ielts-notepad-textarea"
          rows={12}
        />
      </div>
    </div>
  );

  return (
    <IeltsSplitPane
      leftPane={leftPaneContent}
      rightPane={rightPaneContent}
      storageKey="ielts_split_speaking"
      className="ielts-speaking-split"
    />
  );
};

