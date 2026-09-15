/**
 * YouTube Player Controller with Sentence Segment Looping & Error Fallback
 */
class YouTubePlayerController {
  constructor(containerId = "youtube-player") {
    this.containerId = containerId;
    this.player = null;
    this.isReady = false;
    this.currentLoopStart = 0;
    this.currentLoopEnd = 0;
    this.isLooping = true;
    this.replayInterval = 1.0;
    this.isWaitingReplay = false;
    this.replayTimeout = null;
    this.pendingPlay = false;
    this.loopInterval = null;
    this.currentVideoId = null;
    this.onReadyCallbacks = [];
    this.onEmbedRestricted = null;
  }

  init(videoId, onReady) {
    this.currentVideoId = videoId;
    if (onReady) this.onReadyCallbacks.push(onReady);

    if (window.YT && window.YT.Player) {
      this._createPlayer(videoId);
    } else {
      if (!window._ytScriptLoading) {
        window._ytScriptLoading = true;
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }
      window.onYouTubeIframeAPIReady = () => {
        this._createPlayer(videoId);
      };
    }
  }

  _createPlayer(videoId) {
    if (this.player) {
      try {
        this.player.loadVideoById(videoId);
        return;
      } catch (e) {
        // Recreate if load fails
      }
    }

    const origin = window.location.origin || "http://127.0.0.1:8000";

    this.player = new window.YT.Player(this.containerId, {
      videoId: videoId,
      host: "https://www.youtube.com",
      playerVars: {
        playsinline: 1,
        rel: 0,
        modestbranding: 1,
        enablejsapi: 1,
        origin: origin,
        widget_referrer: window.location.href,
      },
      events: {
        onReady: () => {
          this.isReady = true;
          this._startLoopMonitor();
          if (this.pendingPlay) {
            this.pendingPlay = false;
            try {
              this.player.seekTo(this.currentLoopStart, true);
              this.player.playVideo();
            } catch (e) {}
          }
          this.onReadyCallbacks.forEach((cb) => cb());
          this.onReadyCallbacks = [];
        },
        onError: (e) => {
          console.warn("YouTube Player error event:", e.data);
          // 101 or 150 = The owner does not allow embedding
          if (e.data === 101 || e.data === 150 || e.data === 2) {
            if (this.onEmbedRestricted) {
              this.onEmbedRestricted(this.currentVideoId);
            }
          }
        },
      },
    });
  }

  loadVideo(videoId) {
    this.currentVideoId = videoId;
    if (this.isReady && this.player && this.player.loadVideoById) {
      try {
        this.player.loadVideoById(videoId);
      } catch (e) {
        this.init(videoId);
      }
    } else {
      this.init(videoId);
    }
  }

  setReplayInterval(seconds) {
    this.replayInterval = Math.max(0.1, parseFloat(seconds) || 1.0);
  }

  playSegment(start, end, loop = true) {
    this.isFullMode = false;
    // Audio pre-roll and post-roll padding to compensate for YouTube player seek latency & audio trailing
    const paddingStart = 0.25;
    const paddingEnd = 0.35;
    this.currentLoopStart = Math.max(0, start - paddingStart);
    this.currentLoopEnd = end + paddingEnd;
    this.isLooping = loop;
    this.isWaitingReplay = false;
    if (this.replayTimeout) clearTimeout(this.replayTimeout);

    if (!this.isReady || !this.player || !this.player.seekTo) {
      this.pendingPlay = true;
      return;
    }
    try {
      this.player.seekTo(this.currentLoopStart, true);
      this.player.playVideo();
    } catch (e) {
      console.warn("Could not play segment", e);
    }
  }

  playFull(time) {
    this.isFullMode = true;
    this.isWaitingReplay = false;
    if (this.replayTimeout) clearTimeout(this.replayTimeout);

    if (!this.isReady || !this.player) return;
    try {
      if (typeof time === "number") {
        this.player.seekTo(time, true);
      }
      this.player.playVideo();
    } catch (e) {
      console.warn("Could not play full audio", e);
    }
  }

  pauseFull() {
    if (!this.isReady || !this.player) return;
    try {
      this.player.pauseVideo();
    } catch (e) {}
  }

  getCurrentTime() {
    if (this.isReady && this.player && typeof this.player.getCurrentTime === "function") {
      try {
        return this.player.getCurrentTime() || 0;
      } catch (e) {}
    }
    return 0;
  }

  getDuration() {
    if (this.isReady && this.player && typeof this.player.getDuration === "function") {
      try {
        return this.player.getDuration() || 0;
      } catch (e) {}
    }
    return 0;
  }

  seekTo(seconds) {
    if (this.isReady && this.player && typeof this.player.seekTo === "function") {
      try {
        this.player.seekTo(seconds, true);
      } catch (e) {}
    }
  }

  replayCurrentSegment() {
    this.isFullMode = false;
    if (this.replayTimeout) clearTimeout(this.replayTimeout);
    this.isWaitingReplay = false;
    if (!this.isReady || !this.player || !this.player.seekTo) return;
    try {
      this.player.seekTo(this.currentLoopStart, true);
      this.player.playVideo();
    } catch (e) {
      console.warn("Could not replay segment", e);
    }
  }

  togglePlayPause() {
    if (!this.isReady || !this.player || !this.player.getPlayerState) return;
    try {
      const state = this.player.getPlayerState();
      if (state === window.YT.PlayerState.PLAYING) {
        this.player.pauseVideo();
      } else {
        this.player.playVideo();
      }
    } catch (e) {
      console.warn("Could not toggle play/pause", e);
    }
  }

  seekRelative(seconds) {
    if (!this.isReady || !this.player || !this.player.getCurrentTime) return;
    try {
      const cur = this.player.getCurrentTime();
      this.player.seekTo(Math.max(0, cur + seconds), true);
    } catch (e) {
      console.warn("Could not seek", e);
    }
  }

  setPlaybackRate(rate) {
    if (!this.isReady || !this.player || !this.player.setPlaybackRate) return;
    try {
      this.player.setPlaybackRate(rate);
    } catch (e) {
      console.warn("Could not set rate", e);
    }
  }

  setLooping(enabled) {
    this.isLooping = enabled;
  }

  /**
   * Browser Text-To-Speech Fallback (Web Speech API)
   */
  speakText(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }

  _startLoopMonitor() {
    if (this.loopInterval) clearInterval(this.loopInterval);
    this.loopInterval = setInterval(() => {
      if (!this.isReady || !this.player) return;
      if (this.isFullMode) return; // In Full Audio mode, don't stop/loop on segments
      if (this.currentLoopEnd <= this.currentLoopStart) return;
      if (this.isWaitingReplay) return;

      try {
        if (typeof this.player.getPlayerState === "function") {
          const state = this.player.getPlayerState();
          if (state === window.YT.PlayerState.PLAYING) {
            const currentTime = this.player.getCurrentTime();
            if (currentTime >= this.currentLoopEnd) {
              if (this.isLooping) {
                // Auto Replay is ON: pause, wait replayInterval, then replay
                this.isWaitingReplay = true;
                this.player.pauseVideo();
                if (this.replayTimeout) clearTimeout(this.replayTimeout);
                this.replayTimeout = setTimeout(() => {
                  this.isWaitingReplay = false;
                  if (this.isReady && this.player && this.isLooping && !this.isFullMode) {
                    try {
                      this.player.seekTo(this.currentLoopStart, true);
                      this.player.playVideo();
                    } catch (err) {
                      console.warn("Replay failed", err);
                    }
                  }
                }, Math.max(100, this.replayInterval * 1000));
              } else {
                // Auto Replay is OFF: Stop (pause) at sentence end and prime start time
                this.player.pauseVideo();
                this.player.seekTo(this.currentLoopStart, true);
              }
            }
          }
        }
      } catch (e) {
        // Player reinitializing
      }
    }, 100);
  }
}
