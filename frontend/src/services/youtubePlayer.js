/**
 * Encapsulated YouTube Player Controller with Sentence Segment Looping & Error Fallback
 */
export class YouTubePlayerController {
  constructor(containerId = "youtube-player") {
    this.containerId = containerId;
    this.player = null;
    this.isReady = false;
    this.currentLoopStart = 0;
    this.currentLoopEnd = 0;
    this.isLooping = false;
    this.replayInterval = 1.0;
    this.audioPadding = 0.1;
    this.sourceLang = "en";
    this.isWaitingReplay = false;
    this.replayTimeout = null;
    this.pendingPlay = false;
    this.loopInterval = null;
    this.currentVideoId = null;
    this.onReadyCallbacks = [];
    this.onStateChangeCallbacks = [];
    this.onEmbedRestricted = null;
    this.isFullMode = false;
    this.isPlaying = false;
  }

  setAudioPadding(seconds) {
    this.audioPadding = Math.max(0.0, parseFloat(seconds) ?? 0.1);
  }

  setSourceLang(lang) {
    if (lang) this.sourceLang = lang;
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
    const start = typeof this.currentLoopStart === "number" ? Math.max(0, this.currentLoopStart) : 0;
    if (this.player) {
      try {
        if (this.pendingCue && this.player.cueVideoById) {
          this.player.cueVideoById({
            videoId: videoId,
            startSeconds: start,
          });
          return;
        } else if (this.player.loadVideoById) {
          this.player.loadVideoById({
            videoId: videoId,
            startSeconds: start,
          });
          return;
        }
      } catch (e) {}
    }

    const origin = window.location.origin || "http://127.0.0.1:5101";

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
        start: Math.floor(start),
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
          } else if (this.pendingCue) {
            this.pendingCue = false;
            try {
              this.player.seekTo(this.currentLoopStart, true);
              this.player.pauseVideo();
            } catch (e) {}
          }
          this.onReadyCallbacks.forEach((cb) => cb());
          this.onReadyCallbacks = [];
        },
        onStateChange: (event) => {
          if (window.YT && window.YT.PlayerState) {
            this.isPlaying = event.data === window.YT.PlayerState.PLAYING;
            this.onStateChangeCallbacks.forEach((cb) => cb(this.isPlaying, event.data));
          }
        },
        onError: (e) => {
          if (e.data === 101 || e.data === 150 || e.data === 2) {
            if (this.onEmbedRestricted) {
              this.onEmbedRestricted(this.currentVideoId);
            }
          }
        },
      },
    });
  }

  onStateChange(cb) {
    if (typeof cb === "function") {
      this.onStateChangeCallbacks.push(cb);
    }
  }

  _ensureCorrectVideo(autoplay = false) {
    if (!this.player || !this.currentVideoId) return false;
    try {
      const currentData = typeof this.player.getVideoData === "function" ? this.player.getVideoData() : null;
      const loadedId = currentData?.video_id;
      if (loadedId && loadedId !== this.currentVideoId) {
        const start = typeof this.currentLoopStart === "number" ? Math.max(0, this.currentLoopStart) : 0;
        if (autoplay && typeof this.player.loadVideoById === "function") {
          this.player.loadVideoById({
            videoId: this.currentVideoId,
            startSeconds: start,
          });
        } else if (typeof this.player.cueVideoById === "function") {
          this.player.cueVideoById({
            videoId: this.currentVideoId,
            startSeconds: start,
          });
        }
        return false;
      }
    } catch (e) {
      console.warn("Could not verify loaded video:", e);
    }
    return true;
  }

  loadVideo(videoId, startSeconds = 0, autoplay = false) {
    if (!videoId) return;
    this.currentVideoId = videoId;
    const start = typeof startSeconds === "number" ? Math.max(0, startSeconds) : 0;
    this.currentLoopStart = start;

    if (this.replayTimeout) clearTimeout(this.replayTimeout);
    this.isWaitingReplay = false;

    if (this.isReady && this.player) {
      try {
        const currentData = typeof this.player.getVideoData === "function" ? this.player.getVideoData() : null;
        const loadedId = currentData?.video_id;

        if (loadedId === videoId) {
          this.player.seekTo(start, true);
          if (autoplay) {
            this.player.playVideo();
          } else {
            this.player.pauseVideo();
          }
          return;
        }

        if (autoplay && typeof this.player.loadVideoById === "function") {
          this.player.loadVideoById({
            videoId: videoId,
            startSeconds: start,
          });
        } else if (typeof this.player.cueVideoById === "function") {
          this.player.cueVideoById({
            videoId: videoId,
            startSeconds: start,
          });
        }
      } catch (e) {
        console.warn("loadVideo error, reinitializing player:", e);
        this.init(videoId);
      }
    } else {
      this.pendingPlay = autoplay;
      this.pendingCue = !autoplay;
      this.init(videoId);
    }
  }

  setReplayInterval(seconds) {
    this.replayInterval = Math.max(0.1, parseFloat(seconds) || 1.0);
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

    if (!this.isReady || !this.player || !this.player.seekTo) {
      this.pendingPlay = true;
      return;
    }
    try {
      const isCorrect = this._ensureCorrectVideo(true);
      if (!isCorrect) return;
      this.player.seekTo(this.currentLoopStart, true);
      this.player.playVideo();
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

    if (!this.isReady || !this.player || !this.player.seekTo) {
      this.pendingPlay = false;
      this.pendingCue = true;
      return;
    }
    try {
      const isCorrect = this._ensureCorrectVideo(false);
      if (!isCorrect) return;
      this.player.seekTo(this.currentLoopStart, true);
      this.player.pauseVideo();
    } catch (e) {
      console.warn("Could not cue segment", e);
    }
  }

  playFull(time) {
    this.isFullMode = true;
    this.isWaitingReplay = false;
    if (this.replayTimeout) clearTimeout(this.replayTimeout);

    if (!this.isReady || !this.player) return;
    try {
      const isCorrect = this._ensureCorrectVideo(true);
      if (!isCorrect) return;
      if (typeof time === "number") {
        this.player.seekTo(time, true);
      }
      this.player.playVideo();
    } catch (e) {
      console.warn("Could not play full audio", e);
    }
  }

  pause() {
    this.isWaitingReplay = false;
    if (this.replayTimeout) clearTimeout(this.replayTimeout);
    if (!this.isReady || !this.player) return;
    try {
      if (typeof this.player.pauseVideo === "function") {
        this.player.pauseVideo();
      }
    } catch (e) {
      console.warn("Could not pause video", e);
    }
  }

  pauseFull() {
    this.pause();
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
      const isCorrect = this._ensureCorrectVideo(true);
      if (!isCorrect) return;
      this.player.seekTo(this.currentLoopStart, true);
      this.player.playVideo();
    } catch (e) {
      console.warn("Could not replay segment", e);
    }
  }

  togglePlayPause() {
    if (!this.isReady || !this.player || !this.player.getPlayerState) return;
    try {
      const isCorrect = this._ensureCorrectVideo(true);
      if (!isCorrect) return;

      const state = this.player.getPlayerState();
      if (state === window.YT.PlayerState.PLAYING) {
        this.player.pauseVideo();
      } else {
        if (this.replayTimeout) clearTimeout(this.replayTimeout);
        this.isWaitingReplay = false;

        if (!this.isFullMode && typeof this.currentLoopStart === "number") {
          const cur = typeof this.player.getCurrentTime === "function" ? (this.player.getCurrentTime() || 0) : 0;
          const isUnstartedOrCued = state === -1 || state === 5 || state === 0;
          if (isUnstartedOrCued || cur < this.currentLoopStart || (this.currentLoopEnd && cur >= this.currentLoopEnd - 0.15)) {
            this.player.seekTo(this.currentLoopStart, true);
          }
        }
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

  speakText(text, lang) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const code = (lang || this.sourceLang || "en").toLowerCase();
    const langMap = {
      en: "en-US", fr: "fr-FR", ja: "ja-JP", ko: "ko-KR", zh: "zh-CN",
      de: "de-DE", es: "es-ES", vi: "vi-VN", ru: "ru-RU", it: "it-IT", pt: "pt-BR",
    };
    utterance.lang = langMap[code] || langMap[code.split("-")[0]] || "en-US";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }

  destroy() {
    if (this.loopInterval) clearInterval(this.loopInterval);
    if (this.replayTimeout) clearTimeout(this.replayTimeout);
    if (this.player && this.player.destroy) {
      try {
        this.player.destroy();
      } catch (e) {}
    }
  }

  _startLoopMonitor() {
    if (this.loopInterval) clearInterval(this.loopInterval);
    this.loopInterval = setInterval(() => {
      if (!this.isReady || !this.player) return;
      if (this.isFullMode) return;
      if (this.currentLoopEnd <= this.currentLoopStart) return;
      if (this.isWaitingReplay) return;

      try {
        if (typeof this.player.getPlayerState === "function") {
          const state = this.player.getPlayerState();
          if (state === window.YT.PlayerState.PLAYING) {
            // Guard: if somehow playing wrong video, don't execute loop monitor
            const data = typeof this.player.getVideoData === "function" ? this.player.getVideoData() : null;
            if (data?.video_id && this.currentVideoId && data.video_id !== this.currentVideoId) {
              return;
            }
            const currentTime = this.player.getCurrentTime();
            if (currentTime >= this.currentLoopEnd) {
              if (this.isLooping) {
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
                this.player.pauseVideo();
                this.player.seekTo(this.currentLoopStart, true);
              }
            }
          }
        }
      } catch (e) {}
    }, 50);
  }
}

