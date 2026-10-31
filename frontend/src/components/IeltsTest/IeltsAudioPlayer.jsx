import React, { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw, Volume2, FastForward } from "../../constants/icons.js";

/**
 * Custom IELTS Audio Player
 * Includes quick part markers, speed controls, skip forward/backward, and source switching.
 */
export const IeltsAudioPlayer = ({
  audioUrl = "/audio/Cambridge 21 - Test 2.mp3",
  fallbackAudioUrl = "/audio/Cambridge 21 - Test 1.mp3",
  onPartJump
}) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentSource, setCurrentSource] = useState(audioUrl);
  const [volume, setVolume] = useState(1);

  // Sync source when prop changes
  useEffect(() => {
    setCurrentSource(audioUrl);
  }, [audioUrl]);

  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return "00:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => {
        console.warn("Audio play prevented:", err);
      });
    }
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

  const handleSeek = (e) => {
    const targetTime = parseFloat(e.target.value);
    setCurrentTime(targetTime);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
    }
  };

  const handleSkip = (seconds) => {
    if (!audioRef.current) return;
    const nextTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds));
    audioRef.current.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const handleSpeedChange = (rate) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const jumpToTime = useCallback((secs) => {
    if (audioRef.current) {
      audioRef.current.currentTime = secs;
      setCurrentTime(secs);
      if (!isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
    if (onPartJump) onPartJump(secs);
  }, [isPlaying, onPartJump]);

  return (
    <div className="ielts-audio-player-card">
      <audio
        ref={audioRef}
        src={currentSource}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Top row: Track Title & Source Selector */}
      <div className="ielts-player-top">
        <div className="ielts-player-info">
          <span className="ielts-audio-indicator" />
          <span className="ielts-player-title">IELTS Listening Audio Track</span>
        </div>
        <div className="ielts-player-source-select">
          <label htmlFor="ielts-audio-source" className="sr-only">Nguồn audio</label>
          <select
            id="ielts-audio-source"
            value={currentSource}
            onChange={(e) => {
              setCurrentSource(e.target.value);
              setIsPlaying(false);
            }}
            className="ielts-source-dropdown"
          >
            <option value={audioUrl}>Cambridge 21 - Test 2 (Gốc)</option>
            {fallbackAudioUrl && (
              <option value={fallbackAudioUrl}>Cambridge 21 - Test 1</option>
            )}
          </select>
        </div>
      </div>

      {/* Scrubber Timeline */}
      <div className="ielts-player-scrubber-row">
        <span className="ielts-time-label">{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={duration || 100}
          step="0.5"
          value={currentTime}
          onChange={handleSeek}
          className="ielts-scrubber-slider"
          aria-label="Audio scrubber"
        />
        <span className="ielts-time-label">{formatTime(duration)}</span>
      </div>

      {/* Controls Bar */}
      <div className="ielts-player-controls-bar">
        {/* Play/Pause & Skips */}
        <div className="ielts-playback-btns">
          <button
            type="button"
            className="ielts-ctrl-btn ielts-skip-btn"
            onClick={() => handleSkip(-5)}
            title="Lùi 5 giây"
          >
            <RotateCcw className="w-4 h-4" />
            <span>-5s</span>
          </button>

          <button
            type="button"
            className="ielts-ctrl-btn ielts-play-main-btn"
            onClick={togglePlay}
            title={isPlaying ? "Tạm dừng" : "Phát audio"}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>

          <button
            type="button"
            className="ielts-ctrl-btn ielts-skip-btn"
            onClick={() => handleSkip(5)}
            title="Tua 5 giây"
          >
            <FastForward className="w-4 h-4" />
            <span>+5s</span>
          </button>
        </div>

        {/* Speed Controls */}
        <div className="ielts-speed-group">
          {[0.75, 1, 1.25, 1.5].map((rate) => (
            <button
              key={rate}
              type="button"
              className={`ielts-speed-btn ${playbackRate === rate ? "active" : ""}`}
              onClick={() => handleSpeedChange(rate)}
            >
              {rate}x
            </button>
          ))}
        </div>

        {/* Volume */}
        <div className="ielts-volume-group">
          <Volume2 className="w-4 h-4 text-muted" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setVolume(val);
              if (audioRef.current) audioRef.current.volume = val;
            }}
            className="ielts-volume-slider"
            aria-label="Volume"
          />
        </div>
      </div>

      {/* Quick Jump Markers for Parts */}
      <div className="ielts-part-jump-bar">
        <span className="ielts-jump-label">Nhảy tới phần:</span>
        <div className="ielts-jump-btns">
          <button type="button" onClick={() => jumpToTime(0)} className="ielts-jump-btn">
            Part 1 (Q1-10)
          </button>
          <button type="button" onClick={() => jumpToTime(390)} className="ielts-jump-btn">
            Part 2 (Q11-20)
          </button>
          <button type="button" onClick={() => jumpToTime(810)} className="ielts-jump-btn">
            Part 3 (Q21-30)
          </button>
          <button type="button" onClick={() => jumpToTime(1260)} className="ielts-jump-btn">
            Part 4 (Q31-40)
          </button>
        </div>
      </div>
    </div>
  );
};

