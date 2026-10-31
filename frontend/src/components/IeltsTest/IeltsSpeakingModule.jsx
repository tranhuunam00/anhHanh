import React, { useState, useRef, useEffect } from "react";
import { IeltsSplitPane } from "./IeltsSplitPane.jsx";
import { canUseIeltsAiGrading } from "../../utils/ieltsScoring.js";
import { Mic, Pause, RotateCcw, Sparkles, Clock, Volume2 } from "../../constants/icons.js";

/**
 * IELTS Speaking Test Module (Computer-Delivered UI)
 * Features:
 * - Prominent Top Part Bar: Part 1 (Interview), Part 2 (Cue Card), Part 3 (Discussion)
 * - Authentic Physical Cue Card styling for Part 2 with 1-min prep & 2-min speaking timers
 * - Right Pane: Speaking Studio with voice recording, audio playback, AI Evaluation, and Candidate Scratchpad
 */
export const IeltsSpeakingModule = ({
  speakingData,
  user = null
}) => {
  const [activePart, setActivePart] = useState(1);
  const parts = speakingData?.parts || [];
  const currentPart = parts.find((p) => p.partNumber === activePart) || parts[0];

  // Candidate prep notes per part
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
      alert("Không thể truy cập microphone. Vui lòng cấp quyền ghi âm trong trình duyệt.");
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

  // Vocabulary prompts for Part 1 questions
  const part1IdeaTags = {
    1: ["bustling metropolis", "historic landmarks", "commercial hub"],
    2: ["vibrant nightlife", "career opportunities", "public transport"],
    3: ["air pollution", "cost of living", "traffic congestion"],
    4: ["broaden horizons", "architectural wonder", "cultural diversity"]
  };

  // Left Pane: Questions, Cue Card, Timers
  const leftPaneContent = (
    <div className="ielts-left-scroll-pane ielts-speaking-cues-pane">
      <div className="ielts-speaking-card">
        <div className="ielts-speaking-card-header">
          <span className="ielts-prompt-tag-badge">IELTS SPEAKING • {currentPart.title.toUpperCase()}</span>
          <span className="ielts-time-hint">
            <Clock className="w-4 h-4 mr-1 text-primary inline" />
            {currentPart.duration}
          </span>
        </div>
        <p className="ielts-speaking-desc">{currentPart.description}</p>

        {/* Part 1: Introduction & Interview */}
        {activePart === 1 && (
          <div className="ielts-speaking-questions-list">
            <div className="ielts-topic-label-bar">
              <span>Chủ đề phỏng vấn:</span>
              <strong>{currentPart.topic}</strong>
            </div>

            {currentPart.questions.map((q) => (
              <div key={q.id} className="ielts-speaking-question-item">
                <div className="ielts-speaking-q-header">
                  <span className="ielts-speaking-q-num">Q{q.id}</span>
                  <p className="ielts-speaking-q-text">{q.text}</p>
                </div>
                {part1IdeaTags[q.id] && (
                  <div className="ielts-speaking-idea-tags">
                    {part1IdeaTags[q.id].map((tag, idx) => (
                      <span key={idx} className="ielts-idea-tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Part 2: Individual Long Turn Cue Card */}
        {activePart === 2 && currentPart.cueCard && (
          <div className="ielts-cue-card-container">
            <div className="ielts-cue-card">
              <span className="ielts-cue-card-badge">CANDIDATE CUE CARD</span>
              <h4 className="ielts-cue-topic">{currentPart.cueCard.topic}</h4>
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
                <Clock className="w-5 h-5 text-primary" />
                <span className="ielts-timer-digits">{formatTimer(timerSeconds)}</span>
                <span className="ielts-timer-tag">({timerMode === "prep" ? "1 phút chuẩn bị" : "2 phút nói"})</span>
              </div>
              <div className="ielts-timer-actions">
                <button
                  type="button"
                  className={`ielts-timer-btn ${timerMode === "prep" && isTimerRunning ? "active" : ""}`}
                  onClick={() => startTimer("prep")}
                >
                  Bắt đầu 1p chuẩn bị
                </button>
                <button
                  type="button"
                  className={`ielts-timer-btn ${timerMode === "speak" && isTimerRunning ? "active" : ""}`}
                  onClick={() => startTimer("speak")}
                >
                  Bắt đầu 2p nói
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

        {/* Part 3: Two-way Discussion */}
        {activePart === 3 && currentPart.sections && (
          <div className="ielts-part3-sections">
            {currentPart.sections.map((sec, sIdx) => (
              <div key={sIdx} className="ielts-part3-theme-group">
                <h5 className="ielts-theme-title">Chủ đề thảo luận: {sec.theme}</h5>
                {sec.questions.map((q) => (
                  <div key={q.id} className="ielts-speaking-question-item">
                    <div className="ielts-speaking-q-header">
                      <span className="ielts-speaking-q-num">Q{q.id}</span>
                      <p className="ielts-speaking-q-text">{q.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Right Pane: Speaking Studio & Candidate Scratchpad
  const rightPaneContent = (
    <div className="ielts-right-scroll-pane ielts-speaking-workspace-pane">
      {/* Speaking Studio Voice Recorder Card */}
      <div className="ielts-recorder-card">
        <div className="ielts-recorder-header">
          <h4 className="ielts-studio-title">
            <Mic className="w-4 h-4 text-primary mr-1" />
            Phòng thu âm IELTS Speaking (Studio Recorder)
          </h4>
          {isRecording && (
            <div className="ielts-recording-live-indicator">
              <span className="ielts-pulse-dot" />
              <span>Đang ghi âm: {formatTimer(recordSeconds)}</span>
            </div>
          )}
        </div>

        <div className="ielts-recorder-controls">
          {!isRecording ? (
            <button
              type="button"
              className="ielts-record-btn-start"
              onClick={startRecording}
            >
              <Mic className="w-4 h-4" />
              <span>Bắt đầu ghi âm câu trả lời</span>
            </button>
          ) : (
            <button
              type="button"
              className="ielts-record-btn-stop"
              onClick={stopRecording}
            >
              <Pause className="w-4 h-4" />
              <span>Dừng & Lưu bản thu âm</span>
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
              onClick={() => alert("Tính năng AI phân tích phát âm (Pronunciation & Fluency) đang kết nối Gemini Model.")}
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              Chấm điểm Speaking AI (Gemini 2.0)
            </button>
          ) : (
            <span className="ielts-ai-restricted-badge">
              🔒 AI chấm Speaking (Dành riêng cho 3 tài khoản được cấp phép)
            </span>
          )}
        </div>
      </div>

      {/* Candidate Scratchpad Notepad */}
      <div className="ielts-notepad-card">
        <div className="ielts-notepad-header">
          <h5 className="ielts-studio-title">📝 Giấy nháp điện tử (Candidate Scratchpad Part {activePart})</h5>
          <span className="ielts-notepad-hint">✓ Tự động lưu vào trình duyệt</span>
        </div>
        <textarea
          value={notes[activePart] || ""}
          onChange={(e) => handleNotesChange(e.target.value)}
          placeholder={`Ghi nhanh ý tưởng, từ vựng hoặc dàn ý cho Part ${activePart} tại đây...`}
          className="ielts-notepad-textarea"
          rows={14}
        />
      </div>
    </div>
  );

  return (
    <div className="ielts-module-container">
      {/* Prominent Full-Width Top Bar for the 3 Speaking Parts */}
      <div className="ielts-module-top-bar">
        <div className="ielts-module-nav-title">
          <Volume2 className="w-4 h-4 text-primary mr-1" />
          <span>IELTS Speaking (3 Parts):</span>
        </div>
        <div className="ielts-module-parts-tabs">
          {parts.map((p) => {
            const isActive = activePart === p.partNumber;
            const shortLabel =
              p.partNumber === 1
                ? "Interview (4-5 mins)"
                : p.partNumber === 2
                ? "Long Turn (3-4 mins)"
                : "Discussion (4-5 mins)";

            return (
              <button
                key={p.partNumber}
                type="button"
                className={`ielts-main-part-btn ${isActive ? "active" : ""}`}
                onClick={() => setActivePart(p.partNumber)}
              >
                <span className="ielts-part-badge-tag">Part {p.partNumber}</span>
                <span>{shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Resizable 2-Column Split Pane */}
      <IeltsSplitPane
        leftPane={leftPaneContent}
        rightPane={rightPaneContent}
        storageKey="ielts_split_speaking"
        className="ielts-speaking-split"
      />
    </div>
  );
};
