import React, { useState, useEffect, useMemo, useRef } from "react";
import { Headphones, ChevronsDown, Play, Pause, ArrowRight, Sparkles } from "lucide-react";
import { HighlightedVocabSentence } from "../components/Vocab/HighlightedVocabSentence";

export const TranscriptPage = ({ lesson, playerController, onGoToChallenge }) => {
  const [isPlayingFull, setIsPlayingFull] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isAutoScroll, setIsAutoScroll] = useState(true);

  const activeItemRef = useRef(null);

  useEffect(() => {
    let interval;
    if (playerController) {
      interval = setInterval(() => {
        setCurrentTime(playerController.getCurrentTime() || 0);
        setDuration(playerController.getDuration() || 0);
      }, 300);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [playerController]);

  // Compute active sentence index dynamically based on current audio time
  const activeIndex = useMemo(() => {
    if (!lesson || !lesson.challenges || lesson.challenges.length === 0) return -1;
    // 1. Exact range match
    const exactIdx = lesson.challenges.findIndex(
      (c) => currentTime >= c.time_start && currentTime <= c.time_end
    );
    if (exactIdx !== -1) return exactIdx;

    // 2. Fallback to latest challenge whose time_start <= currentTime
    let lastStartedIdx = -1;
    for (let i = 0; i < lesson.challenges.length; i++) {
      if (currentTime >= lesson.challenges[i].time_start) {
        lastStartedIdx = i;
      } else {
        break;
      }
    }
    return lastStartedIdx !== -1 ? lastStartedIdx : 0;
  }, [lesson, currentTime]);

  // Smoothly scroll active sentence into view when autoScroll is enabled
  useEffect(() => {
    if (isAutoScroll && activeIndex !== -1 && activeItemRef.current) {
      activeItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [activeIndex, isAutoScroll]);

  const formatTime = (seconds) => {
    if (typeof seconds !== "number" || isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleFullPlay = () => {
    if (!playerController) return;
    if (isPlayingFull) {
      playerController.pauseFull();
      setIsPlayingFull(false);
    } else {
      playerController.playFull();
      setIsPlayingFull(true);
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (playerController) {
      playerController.seekTo(newTime);
    }
  };

  if (!lesson || !lesson.challenges) {
    return (
      <div className="card" style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
        Vui lòng tải một bài học YouTube để xem toàn bộ bài nghe và bản dịch transcript song ngữ.
      </div>
    );
  }

  return (
    <div id="tab-transcript" className="tab-content">
      {/* Full Audio Hero Card */}
      <div className="card full-audio-hero-card">
        <div className="full-audio-hero-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <div className="hero-header-title" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Headphones size={22} color="#3b82f6" />
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>{lesson.title}</h3>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Toàn bộ audio bài nghe ({lesson.total_challenges} câu)
              </div>
            </div>
          </div>

          <button
            className={`btn ${isAutoScroll ? "btn-primary" : "btn-secondary"} btn-with-icon`}
            style={{ padding: "6px 14px", fontSize: "0.83rem" }}
            onClick={() => setIsAutoScroll(!isAutoScroll)}
            title="Bật/Tắt tự động cuộn danh sách câu theo thời gian audio"
          >
            <ChevronsDown size={15} />
            <span>{isAutoScroll ? "Tự cuộn: BẬT" : "Tự cuộn: TẮT"}</span>
          </button>
        </div>

        <div className="full-audio-player-bar">
          <button className="full-audio-play-btn" onClick={toggleFullPlay}>
            {isPlayingFull ? (
              <Pause size={17} fill="currentColor" />
            ) : (
              <Play size={17} fill="currentColor" style={{ marginLeft: "2px" }} />
            )}
          </button>
          <span className="full-audio-time">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          <input
            type="range"
            className="full-audio-progress"
            min="0"
            max={duration || 100}
            step="0.1"
            value={currentTime}
            onInput={handleSeek}
            onChange={handleSeek}
            title="Kéo để tua thời gian audio"
          />
        </div>
      </div>

      {/* Vocab Tip Banner */}
      <div className="vocab-save-hint-card" style={{ marginTop: "10px", marginBottom: "4px" }}>
        <Sparkles size={13} color="#6366f1" style={{ flexShrink: 0 }} />
        <span>💡 Bôi đen từ bất kỳ trong lời thoại để lưu vào Sổ tay</span>
      </div>

      {/* Transcript Items List */}
      <div className="transcript-list" style={{ marginTop: "16px" }}>
        {lesson.challenges.map((c, idx) => {
          const isActive = idx === activeIndex;
          return (
            <div
              key={c.id || idx}
              ref={isActive ? activeItemRef : null}
              className={`transcript-item ${isActive ? "active-sentence" : ""}`}
              onClick={() => {
                if (playerController) playerController.playFull(c.time_start);
              }}
            >
              <div className="transcript-header-meta">
                <span className="transcript-time">
                  [{formatTime(c.time_start)} - {formatTime(c.time_end)}]
                </span>
                <button
                  className="btn btn-secondary btn-with-icon"
                  style={{ padding: "4px 10px", fontSize: "0.8rem" }}
                  title="Luyện chép câu này"
                  onClick={(e) => {
                    e.stopPropagation();
                    onGoToChallenge(idx + 1);
                  }}
                >
                  <span>Luyện câu này</span>
                  <ArrowRight size={13} />
                </button>
              </div>
              <div className="transcript-en">
                <HighlightedVocabSentence text={c.text} />
              </div>
              {c.translation && <div className="transcript-vi">{c.translation}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

