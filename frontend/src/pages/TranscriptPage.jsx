import React, { useState } from "react";

export const TranscriptPage = ({ lesson, playerController, onGoToChallenge }) => {
  const [isPlayingFull, setIsPlayingFull] = useState(false);

  const formatTime = (seconds) => {
    if (typeof seconds !== "number") return "00:00";
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
        <div className="full-audio-hero-header">
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
            {formatTime(playerController ? playerController.getCurrentTime() : 0)} /{" "}
            {formatTime(playerController ? playerController.getDuration() : 0)}
          </span>
        </div>
      </div>

      {/* Transcript Items List */}
      <div className="transcript-list" style={{ marginTop: "16px" }}>
        {lesson.challenges.map((c, idx) => (
          <div
            key={c.id || idx}
            className="transcript-item"
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
        ))}
      </div>
    </div>
  );
};
