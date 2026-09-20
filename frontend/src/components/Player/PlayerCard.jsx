import React, { useState } from "react";
import {
  AlertTriangle,
  Volume2,
  ExternalLink,
  RotateCcw,
  RotateCw,
  Play,
  Pause,
  Repeat,
} from "lucide-react";

export const PlayerCard = ({
  playerController,
  isEmbedRestricted,
  currentSentenceText,
  sourceLang,
  isPlaying = false,
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

  const youtubeTimestampUrl = React.useMemo(() => {
    if (!videoUrl) return "#";
    const sec = Math.floor(playerController?.currentLoopStart || 0);
    const cleanUrl = videoUrl.replace(/[?&]t=\d+s?/, "");
    const sep = cleanUrl.includes("?") ? "&" : "?";
    return `${cleanUrl}${sep}t=${sec}s`;
  }, [videoUrl, playerController?.currentLoopStart]);

  return (
    <section className="card player-card">
      {/* Embed Warning Banner (YouTube Error 150/101) */}
      {isEmbedRestricted && (
        <div style={{ background: "var(--warning-bg)", border: "1px solid var(--warning)", borderRadius: "8px", padding: "12px", marginBottom: "14px" }}>
          <div style={{ fontWeight: 600, color: "var(--warning)", display: "flex", alignItems: "center", gap: "8px" }}>
            <AlertTriangle size={18} strokeWidth={2.2} />
            <span>Chủ kênh giới hạn nhúng video trên website (Mã lỗi YouTube 150)</span>
          </div>
          <div style={{ marginTop: "10px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button className="btn btn-primary btn-with-icon" style={{ padding: "6px 12px", fontSize: "0.85rem" }} onClick={onSpeakSentence}>
              <Volume2 size={16} strokeWidth={2} />
              <span>Nghe phát âm giọng mẫu (TTS)</span>
            </button>
            <a href={youtubeTimestampUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-with-icon" style={{ padding: "6px 12px", fontSize: "0.85rem", textDecoration: "none" }}>
              <span>Mở YouTube tại mốc câu này</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      )}

      {/* Video Container */}
      <div className="video-wrapper">
        <div id="youtube-player"></div>
      </div>

      {/* Playback Controls & Speed */}
      <div className="playback-controls">
        <div className="controls-row" style={{ justifyContent: "center", gap: "8px", width: "100%" }}>
          <button className="btn btn-secondary btn-icon" title="Tua lùi 3 giây (←)" onClick={() => onSeekRelative && onSeekRelative(-3)}>
            <RotateCcw size={16} strokeWidth={2.2} />
          </button>

          <button className="btn btn-secondary btn-icon" title={isPlaying ? "Tạm dừng (Space)" : "Phát video (Space)"} onClick={onPlayPause}>
            {isPlaying ? (
              <Pause size={17} fill="currentColor" />
            ) : (
              <Play size={17} fill="currentColor" style={{ marginLeft: "2px" }} />
            )}
          </button>

          <button className="btn btn-secondary btn-icon" title="Phát lại đoạn câu này (Ctrl)" onClick={onReplay}>
            <Repeat size={16} strokeWidth={2.2} />
          </button>

          <button className="btn btn-secondary btn-icon" title="Tua tới 3 giây (→)" onClick={() => onSeekRelative && onSeekRelative(3)}>
            <RotateCw size={16} strokeWidth={2.2} />
          </button>

          <div className="speed-group" style={{ marginLeft: "4px" }}>
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

