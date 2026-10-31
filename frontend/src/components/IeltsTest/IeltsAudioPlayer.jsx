import React, { useState, useRef, useEffect } from "react";
import { Play, Volume2, Check } from "../../constants/icons.js";
import { formatAudioTime } from "../../utils/ieltsScoring.js";

/**
 * IELTS Listening Exam Audio Player (Compact Standard UI)
 * Strict exam mode:
 * - NO scrub/seeking (không cho tua).
 * - NO pause once started (không cho dừng).
 * - Plays continuously to simulate authentic computer-delivered IELTS conditions.
 * - Compact toolbar height to give maximum screen space for questions and maps.
 */
export const IeltsAudioPlayer = ({
  audioUrl = "/audio/Cambridge 21 - Test 2.mp3",
  fallbackAudioUrl = "/audio/Cambridge 21 - Test 1.mp3",
  className = ""
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

  useEffect(() => {
    if (audioRef.current && isFinite(audioRef.current.duration) && audioRef.current.duration > 0) {
      setDuration(audioRef.current.duration);
    }
  }, [currentSource]);

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
    <div className={`ielts-audio-player-card compact ${className}`}>
      <audio
        ref={audioRef}
        src={currentSource}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onDurationChange={handleLoadedMetadata}
        onCanPlay={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      <div className="ielts-compact-player-bar">
        {/* Play Action / Live Exam Status */}
        <div className="ielts-compact-action">
          {!hasStarted ? (
            <button
              type="button"
              className="ielts-compact-start-btn"
              onClick={handleStartExam}
              title="Bắt đầu phát audio bài thi IELTS"
            >
              <Play className="w-3.5 h-3.5 mr-1.5 inline" />
              <span>Bắt đầu nghe</span>
            </button>
          ) : isEnded ? (
            <span className="ielts-compact-status-ended">
              <Check className="w-3.5 h-3.5 mr-1 inline text-success" />
              Bài nghe đã kết thúc
            </span>
          ) : (
            <div className="ielts-compact-status-playing" title="Đang phát bài thi IELTS - Không tua/dừng">
              <span className="ielts-recording-dot" />
              <span className="ielts-playing-text">Đang phát (Chuẩn thi thật)</span>
            </div>
          )}
        </div>

        {/* Read-Only Timeline (No Scrubbing) */}
        <div className="ielts-compact-timeline">
          <span className="ielts-compact-time">{formatAudioTime(currentTime)}</span>
          <div className="ielts-exam-progress-bar compact" title="Không thể tua theo quy chế thi">
            <div className="ielts-exam-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <span className="ielts-compact-time">{formatAudioTime(duration)}</span>
        </div>

        {/* Volume & Audio Source */}
        <div className="ielts-compact-controls">
          <div className="ielts-compact-volume" title="Âm lượng tai nghe">
            <Volume2 className="w-3.5 h-3.5 text-muted" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="ielts-volume-slider compact"
              title="Âm lượng tai nghe"
              aria-label="Âm lượng tai nghe"
            />
            <span className="ielts-volume-percent compact">{Math.round(volume * 100)}%</span>
          </div>

          {!hasStarted && fallbackAudioUrl && (
            <select
              value={currentSource}
              onChange={(e) => setCurrentSource(e.target.value)}
              className="ielts-source-dropdown compact"
              title="Chọn file audio"
            >
              <option value={audioUrl}>Cam 21 Test 2</option>
              <option value={fallbackAudioUrl}>Cam 21 Test 1</option>
            </select>
          )}
        </div>
      </div>
    </div>
  );
};
