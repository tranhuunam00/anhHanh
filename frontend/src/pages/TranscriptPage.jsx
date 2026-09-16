import React, { useState, useEffect, useMemo, useRef } from "react";

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
          <div className="hero-header-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
              <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
            </svg>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>{lesson.title}</h3>
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
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="7 13 12 18 17 13" />
              <polyline points="7 6 12 11 17 6" />
            </svg>
            <span>{isAutoScroll ? "Tự cuộn: BẬT" : "Tự cuộn: TẮT"}</span>
          </button>
        </div>

        <div className="full-audio-player-bar">
          <button className="full-audio-play-btn" onClick={toggleFullPlay}>
            {isPlayingFull ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: "2px" }}>
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
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
                  className="btn btn-secondary btn-icon"
                  title="Luyện chép câu này"
                  onClick={(e) => {
                    e.stopPropagation();
                    onGoToChallenge(idx + 1);
                  }}
                >
                  Luyện câu này ➔
                </button>
              </div>
              <div className="transcript-en">{c.text}</div>
              {c.translation && <div className="transcript-vi">{c.translation}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
