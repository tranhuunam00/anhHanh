import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  fetchLiveSnapshot,
  connectTikTok,
  disconnectTikTok,
  startQuestionRound,
  endQuestionRound,
  nextQuestion,
  prevQuestion,
  setLiveTopic,
  setLiveTimer,
  simulateLiveEvent,
  createTikTokLiveWebSocket,
} from "../../services/tiktokLiveService";
import { TikTokLiveQuestionCard } from "./TikTokLiveQuestionCard";
import { TikTokLiveLeaderboard } from "./TikTokLiveLeaderboard";
import { TikTokLiveControls } from "./TikTokLiveControls";
import { playWebAudioChime } from "../../utils/tiktokLiveUtils";
import { Radio, Maximize2, Minimize2, ArrowLeft, X, Play, Check, FastForward, Smartphone, Monitor } from "../Icons";
import "../../styles/tiktokLive.css";

export const TikTokLiveStudio = ({ isActive = true, onBackToHome }) => {
  const [session, setSession] = useState({
    unique_id: "",
    status: "disconnected",
    error_message: "",
    current_topic: "all",
    available_topics: [],
    current_question: null,
    current_question_index: 0,
    total_questions: 1,
    custom_timer_seconds: 20,
    is_round_active: false,
    vote_counts: { A: 0, B: 0, C: 0, D: 0 },
    leaderboard: [],
    total_comments: 0,
    total_likes: 0,
    total_gifts: 0,
    recent_events: [],
  });

  const [timeLeft, setTimeLeft] = useState(20);
  const [viewMode, setViewMode] = useState(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      return "landscape";
    }
    return "portrait";
  });
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [firstWinner, setFirstWinner] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const wsRef = useRef(null);
  const timerRef = useRef(null);

  // Native fullscreen toggle to completely hide browser URL/address bar
  const handleToggleFullScreen = useCallback(async () => {
    try {
      if (!isFullScreen) {
        if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
        setIsFullScreen(true);
      } else {
        if (document.fullscreenElement && document.exitFullscreen) await document.exitFullscreen();
        setIsFullScreen(false);
      }
    } catch {
      setIsFullScreen((prev) => !prev);
    }
  }, [isFullScreen]);

  // Sync fullscreen state with browser native ESC or gesture
  useEffect(() => {
    const handleFsChange = () => setIsFullScreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // 1. Initial snapshot fetch
  const loadSnapshot = useCallback(async () => {
    try {
      const data = await fetchLiveSnapshot();
      setSession(data);
      if (data.current_question) {
        setTimeLeft(data.current_question.timer_seconds || 20);
      }
    } catch (err) {
      console.warn("Failed to load initial TikTok Live snapshot:", err);
    }
  }, []);

  // 2. Setup WebSocket connection
  useEffect(() => {
    if (!isActive) return;

    loadSnapshot();

    const handleWsMessage = (msg) => {
      if (msg.type === "SNAPSHOT") {
        setSession(msg);
      } else if (msg.type === "TOPIC_CHANGE") {
        setSession((prev) => ({
          ...prev,
          current_topic: msg.current_topic,
          current_question: msg.current_question,
          total_questions: msg.total_questions,
          current_question_index: 0,
          is_round_active: false,
          vote_counts: { A: 0, B: 0, C: 0, D: 0 },
        }));
        if (msg.current_question) {
          setTimeLeft(msg.current_question.timer_seconds || 20);
        }
        setFirstWinner(null);
      } else if (msg.type === "ROUND_START") {
        setSession((prev) => ({
          ...prev,
          is_round_active: true,
          current_question: msg.question,
          current_question_index: msg.question_index,
          total_questions: msg.total_questions,
          vote_counts: { A: 0, B: 0, C: 0, D: 0 },
        }));
        setTimeLeft(msg.timer_seconds || 20);
        setFirstWinner(null);
      } else if (msg.type === "ROUND_END") {
        setSession((prev) => ({
          ...prev,
          is_round_active: false,
          vote_counts: msg.vote_counts || prev.vote_counts,
        }));
        if (msg.first_winner) {
          setFirstWinner(msg.first_winner);
          if (isActive) playWebAudioChime("correct");
        }
      } else if (msg.type === "NEW_COMMENT") {
        setSession((prev) => {
          const events = [...prev.recent_events, msg].slice(-20);
          return {
            ...prev,
            total_comments: prev.total_comments + 1,
            vote_counts: msg.vote_counts || prev.vote_counts,
            recent_events: events,
          };
        });
        if (msg.is_correct && !firstWinner) {
          setFirstWinner(msg);
          if (isActive) playWebAudioChime("correct");
        }
      } else if (msg.type === "NEW_GIFT") {
        setSession((prev) => ({
          ...prev,
          total_gifts: prev.total_gifts + (msg.diamond_count || 1),
          recent_events: [...prev.recent_events, msg].slice(-20),
        }));
        if (isActive) playWebAudioChime("gift");
      } else if (msg.type === "NEW_LIKE") {
        setSession((prev) => ({
          ...prev,
          total_likes: msg.total_likes,
        }));
      } else if (msg.type === "STATUS_CHANGE") {
        setSession((prev) => ({
          ...prev,
          status: msg.status,
          unique_id: msg.unique_id,
          error_message: msg.error || "",
        }));
        setIsConnecting(false);
      } else if (msg.type === "TIMER_SETTING_CHANGE") {
        setSession((prev) => ({ ...prev, custom_timer_seconds: msg.custom_timer_seconds }));
      }
    };

    wsRef.current = createTikTokLiveWebSocket(
      handleWsMessage,
      (err) => console.warn("TikTok Live WS Error:", err),
      () => console.info("TikTok Live WS Closed")
    );

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [isActive, loadSnapshot, firstWinner]);

  // 3. Countdown timer loop (only runs when actively viewing this tab)
  useEffect(() => {
    if (!isActive) return;
    if (session.is_round_active && timeLeft > 0) {
      // Crisp countdown tick during final 5 seconds
      if (timeLeft <= 5) {
        playWebAudioChime("tick");
      }
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (session.is_round_active && timeLeft === 0) {
      // Time is up sound & end round
      playWebAudioChime("timeout");
      endQuestionRound();
    }
    return () => clearTimeout(timerRef.current);
  }, [session.is_round_active, timeLeft, isActive]);

  // Actions
  const handleConnect = async (username) => {
    setIsConnecting(true);
    try {
      await connectTikTok(username);
    } catch (err) {
      setIsConnecting(false);
      setSession((prev) => ({ ...prev, status: "error", error_message: err.message }));
    }
  };

  const handleDisconnect = async () => {
    try { await disconnectTikTok(); } catch (err) { console.warn("Disconnect error:", err); }
  };

  const handleStartRound = useCallback(async () => {
    if (isActive) playWebAudioChime("start");
    await startQuestionRound();
  }, [isActive]);

  const handleEndRound = useCallback(async () => {
    if (isActive) playWebAudioChime("timeout");
    await endQuestionRound();
  }, [isActive]);

  const handleNextQuestion = useCallback(async () => {
    if (isActive) playWebAudioChime("start");
    await nextQuestion();
  }, [isActive]);

  const handlePrevQuestion = useCallback(async () => {
    if (isActive) playWebAudioChime("start");
    await prevQuestion();
  }, [isActive]);

  const handleSelectTopic = useCallback(async (topicId) => {
    try {
      const res = await setLiveTopic(topicId);
      if (res?.event) {
        setSession((prev) => ({
          ...prev,
          current_topic: res.event.current_topic,
          current_question: res.event.current_question,
          total_questions: res.event.total_questions,
          current_question_index: 0,
          is_round_active: false,
          vote_counts: { A: 0, B: 0, C: 0, D: 0 },
        }));
        if (res.event.current_question) {
          setTimeLeft(res.event.current_question.timer_seconds || 20);
        }
        setFirstWinner(null);
      }
    } catch (err) {
      console.warn("Error setting live topic:", err);
    }
  }, []);

  const handleSetTimer = useCallback(async (seconds) => {
    try {
      await setLiveTimer(seconds);
      setSession((prev) => ({ ...prev, custom_timer_seconds: seconds }));
      setTimeLeft(seconds);
    } catch (err) {
      console.warn("Error setting timer:", err);
    }
  }, []);

  const handleSimulate = async (type, data) => {
    await simulateLiveEvent({ event_type: type, ...data });
  };

  // 4. Keyboard Hotkeys (Space = Start/End, N/ArrowRight = Next, P/ArrowLeft = Prev, ESC = Exit Fullscreen)
  useEffect(() => {
    if (!isActive) return;
    const handleKeyDown = (e) => {
      // Ignore if user is focused inside an input or textarea
      if (["INPUT", "TEXTAREA"].includes(e.target?.tagName)) return;

      if (e.key === "Escape" && isFullScreen) {
        setIsFullScreen(false);
      } else if (e.code === "Space") {
        e.preventDefault();
        if (session.is_round_active) {
          handleEndRound();
        } else {
          handleStartRound();
        }
      } else if (e.key === "ArrowRight" || e.key === "n" || e.key === "N") {
        e.preventDefault();
        handleNextQuestion();
      } else if (e.key === "ArrowLeft" || e.key === "p" || e.key === "P") {
        e.preventDefault();
        handlePrevQuestion();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive, isFullScreen, session.is_round_active, handleEndRound, handleStartRound, handleNextQuestion, handlePrevQuestion]);

  return (
    <div className={`tiktok-live-page-root ${isFullScreen ? "is-fullscreen" : ""}`}>
      {/* Top Banner Bar */}
      <div className="tiktok-page-header">
        <div className="tiktok-header-brand">
          <span className="tiktok-live-pulse-badge">
            <Radio size={14} className="pulse-icon" />
            <span>TIKTOK LIVE INTERACTIVE</span>
          </span>
          <span className="tiktok-subhead">
            Màn hình phát lớp học tương tác thời gian thực cho OBS &amp; TikTok Studio
          </span>
        </div>

        <div className="tiktok-header-actions">
          {onBackToHome && (
            <button
              type="button"
              className="btn-tiktok-back-home"
              onClick={onBackToHome}
              title="Trở về màn hình chính"
            >
              <ArrowLeft size={16} />
              <span>Trở về màn hình chính</span>
            </button>
          )}
          <button
            type="button"
            className="btn-fullscreen-toggle"
            onClick={handleToggleFullScreen}
            title={isFullScreen ? "Thu nhỏ" : "Toàn màn hình (Ẩn thanh duyệt web)"}
          >
            {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            <span>{isFullScreen ? "Thoát toàn màn hình" : "Chế độ Livestream Full"}</span>
          </button>
        </div>
      </div>

      {/* Floating Exit Bar for Fullscreen mode (Clean, non-intrusive, zero website leakage) */}
      {isFullScreen && (
        <div className="tiktok-fullscreen-floating-bar">
          {onBackToHome && (
            <button
              type="button"
              className="btn-fullscreen-back-home"
              onClick={onBackToHome}
              title="Thoát Live về màn hình chính"
            >
              <ArrowLeft size={14} />
              <span>Thoát Live</span>
            </button>
          )}
          <button
            type="button"
            className="btn-fullscreen-exit-float"
            onClick={handleToggleFullScreen}
            title="Thoát toàn màn hình (phím ESC)"
          >
            <X size={14} />
            <span>Thu nhỏ (ESC)</span>
          </button>
        </div>
      )}

      {/* Main Studio Work Area */}
      <div className={`tiktok-studio-layout ${viewMode}`}>
        {/* Left / Center: Interactive Live Screen (9:16 Portrait Canvas) */}
        <div className={`tiktok-live-screen-canvas ${viewMode}`}>
          {/* Top Host Brand Header on Canvas */}
          <div className="tiktok-canvas-header">
            <div className="tiktok-host-badge">
              <span className="live-dot" />
              <span>LỚP HỌC TƯƠNG TÁC TIẾNG ANH</span>
            </div>
            <div className="tiktok-header-mode-actions">
              <button
                type="button"
                className={`btn-canvas-mode-toggle ${viewMode === "portrait" ? "active" : ""}`}
                onClick={() => setViewMode(viewMode === "portrait" ? "landscape" : "portrait")}
                title={viewMode === "portrait" ? "Đang ở chế độ Live Điện Thoại (9:16). Bấm để chuyển sang Máy Tính (16:9)" : "Đang ở chế độ Live Máy Tính (16:9). Bấm để chuyển sang Điện Thoại (9:16)"}
              >
                {viewMode === "portrait" ? (
                  <>
                    <Smartphone size={13} style={{ marginRight: 4, verticalAlign: "middle" }} />
                    <span>Live Điện Thoại (9:16)</span>
                  </>
                ) : (
                  <>
                    <Monitor size={13} style={{ marginRight: 4, verticalAlign: "middle" }} />
                    <span>Live Máy Tính (16:9)</span>
                  </>
                )}
              </button>
              <div className="tiktok-current-channel">
                {session.unique_id ? `@${session.unique_id}` : "Test Mode"}
              </div>
            </div>
          </div>

          {/* Canvas Body: 1 Column in 9:16 Portrait, 2 Columns in 16:9 Landscape */}
          <div className="tiktok-canvas-body">
            {/* Interactive Question Card with Vote Bars */}
            <TikTokLiveQuestionCard
              question={session.current_question}
              questionIndex={session.current_question_index}
              totalQuestions={session.total_questions}
              isRoundActive={session.is_round_active}
              timeLeft={timeLeft}
              voteCounts={session.vote_counts}
              firstWinner={firstWinner}
            />

            {/* Leaderboard & Comment Ticker */}
            <TikTokLiveLeaderboard
              leaderboard={session.leaderboard}
              recentEvents={session.recent_events}
              totalComments={session.total_comments}
              totalLikes={session.total_likes}
              totalGifts={session.total_gifts}
            />
          </div>
        </div>

        {/* Right / Bottom: Control & Simulation Dashboard (Hidden in Fullscreen for clean capture) */}
        {!isFullScreen && (
          <div className="tiktok-studio-side-controls">
            <TikTokLiveControls
              uniqueId={session.unique_id}
              status={session.status}
              errorMessage={session.error_message}
              isRoundActive={session.is_round_active}
              viewMode={viewMode}
              currentTopic={session.current_topic || "all"}
              availableTopics={session.available_topics || []}
              customTimerSeconds={session.custom_timer_seconds || 20}
              onSetTimer={handleSetTimer}
              onSelectTopic={handleSelectTopic}
              onToggleViewMode={setViewMode}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              onStartRound={handleStartRound}
              onEndRound={handleEndRound}
              onNextQuestion={handleNextQuestion}
              onSimulate={handleSimulate}
              isConnecting={isConnecting}
            />
          </div>
        )}
      </div>

      {/* Floating Quick Control Dock for Streamer in Fullscreen */}
      {isFullScreen && (
        <div className="tiktok-fullscreen-dock">
          {session.is_round_active ? (
            <button
              type="button"
              className="btn-dock-action end"
              onClick={handleEndRound}
              title="Chốt đáp án (Phím Space)"
            >
              <Check size={16} />
              <span>Chốt đáp án (Space)</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn-dock-action start"
              onClick={handleStartRound}
              title="Bắt đầu câu hỏi (Phím Space)"
            >
              <Play size={16} />
              <span>Bắt đầu (Space)</span>
            </button>
          )}

          <button
            type="button"
            className="btn-dock-action next"
            onClick={handleNextQuestion}
            title="Câu tiếp theo (Phím N hoặc →)"
          >
            <FastForward size={16} />
            <span>Câu tiếp (N / →)</span>
          </button>
        </div>
      )}
    </div>
  );
};

