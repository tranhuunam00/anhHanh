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

  playSegment(start, end, loop = true) {
    this.currentLoopStart = Math.max(0, start);
    this.currentLoopEnd = end;
    this.isLooping = loop;

    if (!this.isReady || !this.player || !this.player.seekTo) return;
    try {
      this.player.seekTo(this.currentLoopStart, true);
      this.player.playVideo();
    } catch (e) {
      console.warn("Could not play segment", e);
    }
  }

  replayCurrentSegment() {
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
      if (!this.isReady || !this.player || !this.isLooping) return;
      if (this.currentLoopEnd <= this.currentLoopStart) return;

      try {
        if (typeof this.player.getPlayerState === "function") {
          const state = this.player.getPlayerState();
          if (state === window.YT.PlayerState.PLAYING) {
            const currentTime = this.player.getCurrentTime();
            if (currentTime >= this.currentLoopEnd) {
              this.player.seekTo(this.currentLoopStart, true);
            }
          }
        }
      } catch (e) {
        // Player reinitializing
      }
    }, 150);
  }
}
