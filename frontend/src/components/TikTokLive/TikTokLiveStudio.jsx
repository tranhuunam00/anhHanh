import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  fetchLiveSnapshot,
  connectTikTok,
  disconnectTikTok,
  startQuestionRound,
  endQuestionRound,
  nextQuestion,
  simulateLiveEvent,
  createTikTokLiveWebSocket,
} from "../../services/tiktokLiveService";
import { TikTokLiveQuestionCard } from "./TikTokLiveQuestionCard";
import { TikTokLiveLeaderboard } from "./TikTokLiveLeaderboard";
import { TikTokLiveControls } from "./TikTokLiveControls";
import { playWebAudioChime } from "../../utils/tiktokLiveUtils";
import { Radio, Maximize2, Minimize2, ArrowLeft, X } from "../Icons";
import "../../styles/tiktokLive.css";

export const TikTokLiveStudio = ({ isActive = true, onBackToHome }) => {
  const [session, setSession] = useState({
    unique_id: "",
    status: "disconnected",
    error_message: "",
    current_question: null,
    current_question_index: 0,
    total_questions: 1,
    is_round_active: false,
    vote_counts: { A: 0, B: 0, C: 0, D: 0 },
    leaderboard: [],
    total_comments: 0,
    total_likes: 0,
    total_gifts: 0,
    recent_events: [],
  });

  const [timeLeft, setTimeLeft] = useState(20);
  const [viewMode, setViewMode] = useState("portrait"); // portrait (9:16) | landscape (16:9)
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [firstWinner, setFirstWinner] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const wsRef = useRef(null);
  const timerRef = useRef(null);

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
          playWebAudioChime("correct");
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
          playWebAudioChime("correct");
        }
      } else if (msg.type === "NEW_GIFT") {
        setSession((prev) => ({
          ...prev,
          total_gifts: prev.total_gifts + (msg.diamond_count || 1),
          recent_events: [...prev.recent_events, msg].slice(-20),
        }));
        playWebAudioChime("gift");
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

  // 3. Countdown timer loop
  useEffect(() => {
    if (session.is_round_active && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (session.is_round_active && timeLeft === 0) {
      endQuestionRound();
    }
    return () => clearTimeout(timerRef.current);
  }, [session.is_round_active, timeLeft]);

  // 4. Keyboard ESC listener to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isFullScreen) {
        setIsFullScreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullScreen]);

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
    try {
      await disconnectTikTok();
    } catch (err) {
      console.warn("Disconnect error:", err);
    }
  };

  const handleStartRound = async () => {
    await startQuestionRound();
  };

  const handleEndRound = async () => {
    await endQuestionRound();
  };

  const handleNextQuestion = async () => {
    await nextQuestion();
  };

  const handleSimulate = async (type, data) => {
    await simulateLiveEvent({ event_type: type, ...data });
  };

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
            onClick={() => setIsFullScreen((prev) => !prev)}
            title={isFullScreen ? "Thu nhỏ" : "Toàn màn hình OBS"}
          >
            {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            <span>{isFullScreen ? "Thoát toàn màn hình" : "Chế độ Livestream Full"}</span>
          </button>
        </div>
      </div>

      {/* Floating Exit & Home Bar for Fullscreen mode */}
      {isFullScreen && (
        <div className="tiktok-fullscreen-floating-bar">
          {onBackToHome && (
            <button
              type="button"
              className="btn-fullscreen-back-home"
              onClick={onBackToHome}
              title="Trở về trang chủ"
            >
              <ArrowLeft size={14} />
              <span>Trang chủ</span>
            </button>
          )}
          <button
            type="button"
            className="btn-fullscreen-exit-float"
            onClick={() => setIsFullScreen(false)}
            title="Thoát toàn màn hình (phím ESC)"
          >
            <X size={14} />
            <span>Thoát Fullscreen (ESC)</span>
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
              <span>SHOTLANG LIVE CLASSROOM</span>
            </div>
            <div className="tiktok-current-channel">
              {session.unique_id ? `@${session.unique_id}` : "Test Mode"}
            </div>
          </div>

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

        {/* Right / Bottom: Control & Simulation Dashboard (Hidden in Fullscreen for clean capture) */}
        {!isFullScreen && (
          <div className="tiktok-studio-side-controls">
            <TikTokLiveControls
              uniqueId={session.unique_id}
              status={session.status}
              errorMessage={session.error_message}
              isRoundActive={session.is_round_active}
              viewMode={viewMode}
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
    </div>
  );
};

