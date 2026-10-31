import React, { useState, useRef, useEffect } from "react";
import { Play, Volume2 } from "../../constants/icons.js";

/**
 * IELTS Listening Exam Audio Player (Real Test Standard)
 * Strict exam mode:
 * - NO scrub/seeking (không cho tua).
 * - NO pause once started (không cho dừng).
 * - Plays continuously to simulate authentic computer-delivered IELTS conditions.
 * - Volume control is adjustable.
 */
export const IeltsAudioPlayer = ({
  audioUrl = "/audio/Cambridge 21 - Test 2.mp3",
  fallbackAudioUrl = "/audio/Cambridge 21 - Test 1.mp3",
  isExamMode = true
}) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentSource, setCurrentSource] = useState(audioUrl);
  const [volume, setVolume] = useState(1);
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    setCurrentSource(audioUrl);
    setHasStarted(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setIsEnded(false);
  }, [audioUrl]);

  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return "00:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleStartExam = () => {
    if (!audioRef.current) return;
    audioRef.current.play().then(() => {
      setIsPlaying(true);
      setHasStarted(true);
      setIsEnded(false);
    }).catch((err) => {
      console.warn("Audio play prevented:", err);
    });
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setIsEnded(true);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="ielts-audio-player-card">
      <audio
        ref={audioRef}
        src={currentSource}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* Header Bar */}
      <div className="ielts-player-top">
        <div className="ielts-player-info">
          <span className={`ielts-audio-indicator ${isPlaying ? "live-pulse" : ""}`} />
          <span className="ielts-player-title">Bài thi IELTS Listening</span>
          <span className="ielts-exam-mode-badge">Chuẩn thi thật</span>
        </div>

        {!hasStarted && (
          <div className="ielts-player-source-select">
            <select
              value={currentSource}
              onChange={(e) => setCurrentSource(e.target.value)}
              className="ielts-source-dropdown"
              title="Chọn file audio"
            >
              <option value={audioUrl}>Cambridge 21 - Test 2 (Mặc định)</option>
              {fallbackAudioUrl && (
                <option value={fallbackAudioUrl}>Cambridge 21 - Test 1</option>
              )}
            </select>
          </div>
        )}
      </div>

      {/* Start Button or Playing Status */}
      <div className="ielts-player-main-action">
        {!hasStarted ? (
          <button
            type="button"
            className="ielts-start-audio-btn"
            onClick={handleStartExam}
          >
            <Play className="w-5 h-5 mr-2" />
            <span>Bắt đầu bài thi nghe (Audio thi thật)</span>
          </button>
        ) : (
          <div className="ielts-playing-status-banner">
            {isEnded ? (
              <span className="ielts-status-ended">✓ Bài nghe đã kết thúc</span>
            ) : (
              <div className="ielts-status-playing">
                <span className="ielts-recording-dot" />
                <span>Đang phát bài thi IELTS (Không thể tạm dừng hoặc tua)</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Read-Only Visual Progress Bar (No Scrubbing) */}
      <div className="ielts-progress-wrap">
        <div className="ielts-progress-time-row">
          <span className="ielts-time-label">{formatTime(currentTime)}</span>
          <span className="ielts-time-label">{formatTime(duration)}</span>
        </div>
        <div
          className="ielts-exam-progress-bar"
          title="Thanh tiến trình bài nghe (Không thể tua theo quy chế thi)"
        >
          <div
            className="ielts-exam-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Bottom Controls: Volume */}
      <div className="ielts-player-footer-bar">
        <div className="ielts-volume-control">
          <Volume2 className="w-4 h-4 text-muted" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            className="ielts-volume-slider"
            title="Âm lượng tai nghe"
            aria-label="Âm lượng tai nghe"
          />
          <span className="ielts-volume-percent">{Math.round(volume * 100)}%</span>
        </div>
        <div className="ielts-rule-notice">
          <span>* Quy chế: Audio thi thật chỉ phát 1 lần liên tục.</span>
        </div>
      </div>
    </div>
  );
};
