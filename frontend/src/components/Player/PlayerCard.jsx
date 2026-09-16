import React, { useState } from "react";

export const PlayerCard = ({
  playerController,
  isEmbedRestricted,
  currentSentenceText,
  sourceLang,
  onReplay,
  onPlayPause,
  onSeekRelative,
  onSpeakSentence,
  videoUrl,
}) => {
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (playerController) {
      playerController.setPlaybackRate(speed);
    }
  };

  return (
    <section className="card player-card">
      {/* Embed Warning Banner (YouTube Error 150/101) */}
      {isEmbedRestricted && (
        <div style={{ background: "var(--warning-bg)", border: "1px solid var(--warning)", borderRadius: "8px", padding: "12px", marginBottom: "14px" }}>
          <div style={{ fontWeight: 600, color: "var(--warning)", display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span>Chủ kênh giới hạn nhúng video trên website (Mã lỗi YouTube 150)</span>
          </div>
          <div style={{ marginTop: "10px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button className="btn btn-primary btn-with-icon" style={{ padding: "6px 12px", fontSize: "0.85rem" }} onClick={onSpeakSentence}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
              <span>Nghe phát âm giọng mẫu (TTS)</span>
            </button>
            <a href={videoUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-with-icon" style={{ padding: "6px 12px", fontSize: "0.85rem", textDecoration: "none" }}>
              <span>Mở YouTube tại mốc câu này ↗</span>
            </a>
          </div>
        </div>
      )}

      {/* Video Container */}
      <div className="video-wrapper">
        <div id="youtube-player"></div>
      </div>

      {/* Playback Controls */}
      <div className="playback-controls">
        <div className="controls-row">
          <button className="btn btn-primary btn-with-icon" title="Phát lại câu này (Ctrl)" onClick={onReplay}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
            <span>Lặp lại (Ctrl)</span>
          </button>

          <button className="btn btn-secondary btn-with-icon" title="Lùi 3 giây" onClick={() => onSeekRelative(-3)}>
            <span>-3s</span>
          </button>

          <button className="btn btn-secondary btn-with-icon" title="Tạm dừng / Phát (`)" onClick={onPlayPause}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
            <span>Tạm dừng</span>
          </button>

          <button className="btn btn-secondary btn-with-icon" title="Tiến 3 giây" onClick={() => onSeekRelative(3)}>
            <span>+3s</span>
          </button>

          <div className="speed-group">
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
    </section>
  );
};
