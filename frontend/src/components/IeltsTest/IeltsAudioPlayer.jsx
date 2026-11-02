import React, { useState, useRef, useEffect, useCallback } from "react";
import { Play, Volume2, Check, AlertCircle } from "../../constants/icons.js";
import { formatAudioTime } from "../../utils/ieltsScoring.js";

/**
 * IELTS Listening Exam Audio Player (Exam-Standard Compact UI)
 * Strict exam mode:
 * - NO scrub/seeking (không cho tua).
 * - NO pause once started (không cho dừng).
 * - Plays continuously to simulate authentic computer-delivered IELTS conditions.
 * - Compact toolbar height to give maximum screen space for questions and maps.
 */
export const IeltsAudioPlayer = ({
  audioUrl = "",
  fallbackAudioUrl = "",
  className = ""
}) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentSource, setCurrentSource] = useState(audioUrl || "");
  const [volume, setVolume] = useState(1);
  const [isEnded, setIsEnded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const src = audioUrl || "";
    setCurrentSource(src);
    setHasStarted(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setIsEnded(false);
    setLoadError(false);

    if (audioRef.current) {
      audioRef.current.load();
    }
  }, [audioUrl]);

  const updateDuration = useCallback(() => {
    if (audioRef.current) {
      const d = audioRef.current.duration;
      if (isFinite(d) && d > 0) {
        setDuration(d);
        setLoadError(false);
      }
    }
  }, []);

  const handleAudioError = () => {
    if (fallbackAudioUrl && currentSource !== fallbackAudioUrl) {
      console.warn("Primary audio failed to load, trying fallback:", fallbackAudioUrl);
      setCurrentSource(fallbackAudioUrl);
      if (audioRef.current) {
        audioRef.current.load();
      }
    } else {
      console.warn("Audio file could not be loaded:", currentSource);
      setLoadError(true);
    }
  };

  const handleStartExam = () => {
    if (!audioRef.current) return;
    audioRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
        setHasStarted(true);
        setIsEnded(false);
        setLoadError(false);
      })
      .catch((err) => {
        console.warn("Audio play prevented:", err);
        if (fallbackAudioUrl && currentSource !== fallbackAudioUrl) {
          setCurrentSource(fallbackAudioUrl);
          if (audioRef.current) {
            audioRef.current.load();
            audioRef.current
              .play()
              .then(() => {
                setIsPlaying(true);
                setHasStarted(true);
              })
              .catch(() => setLoadError(true));
          }
        } else {
          setLoadError(true);
        }
      });
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (duration === 0) {
        updateDuration();
      }
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
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={updateDuration}
        onDurationChange={updateDuration}
        onCanPlay={updateDuration}
        onCanPlayThrough={updateDuration}
        onError={handleAudioError}
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
          <span className="ielts-compact-time">
            {duration > 0 ? formatAudioTime(duration) : loadError ? "--:--" : "..."}
          </span>
        </div>

        {/* Volume Controls */}
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

          {loadError && (
            <span className="ielts-audio-error-pill text-xs text-danger flex items-center" title="Không tìm thấy file audio">
              <AlertCircle className="w-3 h-3 mr-1 inline" />
              Lỗi audio
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
