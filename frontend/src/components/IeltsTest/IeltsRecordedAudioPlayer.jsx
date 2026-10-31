import React, { useState, useRef, useEffect } from "react";
import { Play, Pause } from "../../constants/icons.js";

/**
 * Helper to format seconds into mm:ss
 */
export function formatAudioTime(seconds) {
  if (isNaN(seconds) || seconds < 0 || !isFinite(seconds)) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
}

/**
 * Custom Audio Player for WebM Voice Recordings
 * Resolves Chromium WebM duration bug (missing EBML header)
 * Shows exact currentTime and total duration with seekable progress bar.
 */
export const IeltsRecordedAudioPlayer = ({
  audioUrl,
  duration = 0,
  downloadName = "ielts_speaking_recording.webm",
  className = ""
}) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [effectiveDuration, setEffectiveDuration] = useState(duration || 0);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setEffectiveDuration(duration || 0);
  }, [audioUrl, duration]);

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isFinite(audio.duration) && audio.duration > 0) {
      setEffectiveDuration(audio.duration);
    } else if (audio.duration === Infinity) {
      // Chromium WebM duration fix trick
      audio.currentTime = 1e101;
      audio.ontimeupdate = () => {
        audio.ontimeupdate = null;
        audio.currentTime = 0;
        if (isFinite(audio.duration) && audio.duration > 0) {
          setEffectiveDuration(audio.duration);
        } else if (duration > 0) {
          setEffectiveDuration(duration);
        }
      };
    } else if (duration > 0) {
      setEffectiveDuration(duration);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      // Ensure effectiveDuration is non-zero
      if (
        isFinite(audioRef.current.duration) &&
        audioRef.current.duration > 0 &&
        (!effectiveDuration || effectiveDuration === 0)
      ) {
        setEffectiveDuration(audioRef.current.duration);
      }
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.warn("Playback prevented:", err));
    }
  };

  const handleSeek = (e) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  const total = effectiveDuration > 0 ? effectiveDuration : duration > 0 ? duration : 1;
  const progressPercent = Math.min(100, Math.max(0, (currentTime / total) * 100));

  return (
    <div className={`ielts-recorded-player-box ${className}`}>
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* Play/Pause Toggle */}
      <button
        type="button"
        className="ielts-recorded-play-btn"
        onClick={togglePlay}
        title={isPlaying ? "Tạm dừng" : "Phát bản ghi"}
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
      </button>

      {/* Current Elapsed Time */}
      <span className="ielts-recorded-time-text">
        {formatAudioTime(currentTime)}
      </span>

      {/* Seekable Progress Bar with Real-Time Fill */}
      <div className="ielts-recorded-timeline-wrap">
        <div
          className="ielts-recorded-timeline-fill"
          style={{ width: `${progressPercent}%` }}
        />
        <input
          type="range"
          min="0"
          max={total}
          step="0.05"
          value={currentTime}
          onChange={handleSeek}
          className="ielts-recorded-seek-input"
          title="Tua đến vị trí trong bài nói"
          aria-label="Thanh tua âm thanh bài nói"
        />
      </div>

      {/* Total Duration (Accurate) */}
      <span className="ielts-recorded-time-text total-time">
        {formatAudioTime(total)}
      </span>

      {/* Download file */}
      {audioUrl && (
        <a
          href={audioUrl}
          download={downloadName}
          className="ielts-recorded-download-btn"
          title="Tải file ghi âm về máy"
        >
          Tải .webm
        </a>
      )}
    </div>
  );
};
