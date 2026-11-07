/**
 * HTML5 Audio Player Controller for Local Audio Files (Cambridge IELTS Audio, etc.)
 * Provides identical API interface to YouTubePlayerController for seamless plug-and-play dictation.
 */
export class AudioPlayerController {
  constructor() {
    this.audio = null;
    this.isReady = false;
    this.currentLoopStart = 0;
    this.currentLoopEnd = 0;
    this.isLooping = false;
    this.replayInterval = 1.0;
    this.audioPadding = 0.1;
    this.sourceLang = "en";
    this.isWaitingReplay = false;
    this.replayTimeout = null;
    this.isFullMode = false;
    this.loopInterval = null;
    this.onStateChangeCallbacks = [];
    this._isPlaying = false;
    this.currentSrc = null;
    this.fallbackDuration = 0;
    this.pendingSeek = null;
    this.pendingPlay = false;
  }

  setAudioPadding(seconds) {
    const parsed = parseFloat(seconds);
    this.audioPadding = isNaN(parsed) ? 0.1 : Math.max(0.0, parsed);
  }

  setSourceLang(lang) {
    if (lang) this.sourceLang = lang;
  }

  setReplayInterval(seconds) {
    this.replayInterval = Math.max(0.1, parseFloat(seconds) || 1.0);
  }

  onStateChange(cb) {
    if (typeof cb === "function") {
      this.onStateChangeCallbacks.push(cb);
    }
  }

  _notifyStateChange(isPlaying, stateCode) {
    this._isPlaying = isPlaying;
    this.onStateChangeCallbacks.forEach((cb) => {
      try {
        cb(isPlaying, stateCode);
      } catch (e) {
        console.warn("State change callback error:", e);
      }
    });
  }

  _normalizeSrc(src) {
    if (!src) return "";
    try {
      return decodeURI(src).trim();
    } catch (e) {
      return (src || "").trim();
    }
  }

  _initAudioElement() {
    if (this.audio) return;
    if (typeof Audio === "undefined") return;

    this.audio = new Audio();
    this.audio.preload = "auto";

    this.audio.addEventListener("loadedmetadata", () => {
      this.isReady = true;
      if (this.pendingSeek !== null) {
        try {
          this.audio.currentTime = this.pendingSeek;
        } catch (e) {
          console.warn("Error seeking on loadedmetadata:", e);
        }
        this.pendingSeek = null;
      }
      if (this.pendingPlay) {
        this.pendingPlay = false;
        this.audio.play().catch((err) => {
          console.warn("Pending play on loadedmetadata blocked or error:", err);
        });
      }
      this._notifyStateChange(this._isPlaying, 100);
    });

    this.audio.addEventListener("canplay", () => {
      this.isReady = true;
      if (this.pendingSeek !== null) {
        try {
          this.audio.currentTime = this.pendingSeek;
        } catch (e) {}
        this.pendingSeek = null;
      }
      if (this.pendingPlay) {
        this.pendingPlay = false;
        this.audio.play().catch(() => {});
      }
    });

    this.audio.addEventListener("playing", () => {
      this._notifyStateChange(true, 1);
    });

    this.audio.addEventListener("pause", () => {
      this._notifyStateChange(false, 2);
    });

    this.audio.addEventListener("ended", () => {
      this._notifyStateChange(false, 0);
    });

    this.audio.addEventListener("error", (e) => {
      console.warn("Audio element error:", e, "src:", this.audio?.src);
      this._notifyStateChange(false, -1);
    });
  }

  loadAudio(src, startSeconds = 0, autoplay = false, fallbackDuration = 0) {
    if (!src) return;
    this.currentSrc = src;
    const start = typeof startSeconds === "number" ? Math.max(0, startSeconds) : 0;
    this.currentLoopStart = start;
    if (typeof fallbackDuration === "number" && fallbackDuration > 0) {
      this.fallbackDuration = fallbackDuration;
    }

    if (this.replayTimeout) clearTimeout(this.replayTimeout);
    this.isWaitingReplay = false;

    this._initAudioElement();
    if (!this.audio) return;

    const currentNormalized = this._normalizeSrc(this.audio.src);
    const targetNormalized = this._normalizeSrc(src);

    if (!currentNormalized.endsWith(targetNormalized)) {
      this.audio.src = encodeURI(decodeURI(src));
      this.isReady = false;
      this.pendingSeek = start;
      this.pendingPlay = autoplay;
    } else {
      if (this.audio.readyState >= 1) {
        try {
          this.audio.currentTime = start;
        } catch (e) {}
      } else {
        this.pendingSeek = start;
        this.pendingPlay = autoplay;
      }
      this.isReady = true;
    }

    this._startLoopMonitor();

    if (autoplay && this.audio.readyState >= 1) {
      this.audio.play().catch((err) => {
        console.warn("Autoplay audio blocked or error:", err);
      });
    }
  }

  loadVideo(src, startSeconds = 0, autoplay = false) {
    this.loadAudio(src, startSeconds, autoplay);
  }

  playSegment(start, end, loop = true, prevEnd = null, nextStart = null) {
    this.isFullMode = false;
    const padding = typeof this.audioPadding === "number" ? this.audioPadding : 0.1;
    let loopStart = Math.max(0, start - padding);
    if (typeof prevEnd === "number" && !isNaN(prevEnd)) {
      loopStart = Math.max(loopStart, prevEnd);
    }
    let loopEnd = end + padding;
    if (typeof nextStart === "number" && !isNaN(nextStart)) {
      loopEnd = Math.min(loopEnd, nextStart);
    }
    this.currentLoopStart = Math.max(0, loopStart);
    this.currentLoopEnd = Math.max(this.currentLoopStart + 0.1, loopEnd);
    this.isLooping = loop;
    this.isWaitingReplay = false;
    if (this.replayTimeout) clearTimeout(this.replayTimeout);

    this.pendingSeek = this.currentLoopStart;
    this.pendingPlay = true;

    this._initAudioElement();
    if (!this.audio) return;

    if (this.audio.readyState >= 1) {
      try {
        this.audio.currentTime = this.currentLoopStart;
      } catch (e) {}
    }

    // Call play() immediately to capture user gesture
    try {
      this.audio.play().catch((err) => console.warn("playSegment error:", err));
    } catch (e) {
      console.warn("Could not play segment", e);
    }
  }

  cueSegment(start, end, loop = true, prevEnd = null, nextStart = null) {
    this.isFullMode = false;
    const padding = typeof this.audioPadding === "number" ? this.audioPadding : 0.1;
    let loopStart = Math.max(0, start - padding);
    if (typeof prevEnd === "number" && !isNaN(prevEnd)) {
      loopStart = Math.max(loopStart, prevEnd);
    }
    let loopEnd = end + padding;
    if (typeof nextStart === "number" && !isNaN(nextStart)) {
      loopEnd = Math.min(loopEnd, nextStart);
    }
    this.currentLoopStart = Math.max(0, loopStart);
    this.currentLoopEnd = Math.max(this.currentLoopStart + 0.1, loopEnd);
    this.isLooping = loop;
    this.isWaitingReplay = false;
    if (this.replayTimeout) clearTimeout(this.replayTimeout);

    this.pendingSeek = this.currentLoopStart;
    this.pendingPlay = false;

    this._initAudioElement();
    if (!this.audio) return;

    try {
      this.audio.pause();
      if (this.audio.readyState >= 1) {
        this.audio.currentTime = this.currentLoopStart;
      }
    } catch (e) {
      console.warn("Could not cue segment", e);
    }
  }

  playFull(time) {
    this.isFullMode = true;
    this.isLooping = false;
    this.isWaitingReplay = false;
    if (this.replayTimeout) clearTimeout(this.replayTimeout);

    const targetTime = typeof time === "number" ? Math.max(0, time) : null;
    if (targetTime !== null) {
      this.pendingSeek = targetTime;
    }
    this.pendingPlay = true;

    this._initAudioElement();
    if (!this.audio) return;

    if (this.audio.readyState >= 1) {
      try {
        if (targetTime !== null) {
          this.audio.currentTime = targetTime;
        } else if (this.audio.ended) {
          this.audio.currentTime = 0;
        }
      } catch (e) {}
    }

    // Call play() immediately to capture user gesture
    try {
      this.audio.play().catch((err) => console.warn("playFull error:", err));
    } catch (e) {
      console.warn("Could not play full audio", e);
    }
  }

  play() {
    this.pendingPlay = true;
    if (!this.audio) return;
    this.audio.play().catch((err) => console.warn("play error:", err));
  }

  playVideo() {
    this.play();
  }

  pause() {
    this.isWaitingReplay = false;
    this.pendingPlay = false;
    if (this.replayTimeout) clearTimeout(this.replayTimeout);
    if (!this.audio) return;
    try {
      this.audio.pause();
    } catch (e) {
      console.warn("Could not pause audio", e);
    }
  }

  pauseVideo() {
    this.pause();
  }

  pauseFull() {
    this.pause();
  }

  togglePlayPause() {
    if (!this.audio) {
      this.pendingPlay = !this.pendingPlay;
      return;
    }
    if (this.audio.paused) {
      if (!this.isFullMode && typeof this.currentLoopStart === "number") {
        const cur = this.audio.currentTime || 0;
        if (cur < this.currentLoopStart || (this.currentLoopEnd && cur >= this.currentLoopEnd - 0.15)) {
          try {
            this.audio.currentTime = this.currentLoopStart;
          } catch (e) {}
        }
      }
      this.play();
    } else {
      this.pause();
    }
  }

  replayCurrentSegment() {
    this.isFullMode = false;
    if (this.replayTimeout) clearTimeout(this.replayTimeout);
    this.isWaitingReplay = false;
    this.pendingSeek = this.currentLoopStart;
    this.pendingPlay = true;

    this._initAudioElement();
    if (!this.audio) return;

    if (this.audio.readyState >= 1) {
      try {
        this.audio.currentTime = this.currentLoopStart;
        this.audio.play().catch((err) => console.warn("replayCurrentSegment error:", err));
      } catch (e) {
        console.warn("Could not replay segment", e);
      }
    }
  }

  seekTo(seconds) {
    if (!this.audio) return;
    try {
      const target = Math.max(0, seconds);
      if (this.audio.readyState >= 1) {
        this.audio.currentTime = target;
      } else {
        this.pendingSeek = target;
      }
    } catch (e) {
      console.warn("seekTo error:", e);
    }
  }

  seekRelative(seconds) {
    if (!this.audio) return;
    try {
      const target = Math.max(0, (this.audio.currentTime || 0) + seconds);
      if (this.audio.readyState >= 1) {
        this.audio.currentTime = target;
      } else {
        this.pendingSeek = target;
      }
    } catch (e) {
      console.warn("seekRelative error:", e);
    }
  }

  setPlaybackRate(speed) {
    if (!this.audio) return;
    try {
      this.audio.playbackRate = speed;
    } catch (e) {
      console.warn("setPlaybackRate error:", e);
    }
  }

  getCurrentTime() {
    return this.audio ? this.audio.currentTime || 0 : 0;
  }

  getDuration() {
    if (this.audio && typeof this.audio.duration === "number" && !isNaN(this.audio.duration) && this.audio.duration > 0) {
      return this.audio.duration;
    }
    return this.fallbackDuration || 0;
  }

  isPlaying() {
    return Boolean(this.audio && !this.audio.paused && !this.audio.ended);
  }

  setLooping(enabled) {
    this.isLooping = enabled;
  }

  destroy() {
    if (this.loopInterval) clearInterval(this.loopInterval);
    if (this.replayTimeout) clearTimeout(this.replayTimeout);
    if (this.audio) {
      try {
        this.audio.pause();
        this.audio.src = "";
      } catch (e) {}
      this.audio = null;
    }
  }

  _startLoopMonitor() {
    if (this.loopInterval) clearInterval(this.loopInterval);
    this.loopInterval = setInterval(() => {
      if (!this.audio || this.audio.paused) return;
      if (this.isFullMode) return;
      if (this.currentLoopEnd <= this.currentLoopStart) return;
      if (this.isWaitingReplay) return;

      const currentTime = this.audio.currentTime;
      if (currentTime >= this.currentLoopEnd) {
        if (this.isLooping) {
          this.isWaitingReplay = true;
          this.audio.pause();
          if (this.replayTimeout) clearTimeout(this.replayTimeout);
          this.replayTimeout = setTimeout(() => {
            this.isWaitingReplay = false;
            if (this.audio && this.isLooping && !this.isFullMode) {
              try {
                this.audio.currentTime = this.currentLoopStart;
                this.audio.play().catch((err) => console.warn("Loop replay error:", err));
              } catch (err) {
                console.warn("Replay failed", err);
              }
            }
          }, Math.max(100, this.replayInterval * 1000));
        } else {
          this.audio.pause();
          this.audio.currentTime = this.currentLoopStart;
        }
      }
    }, 50);
  }
}
