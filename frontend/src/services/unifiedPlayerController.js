import { YouTubePlayerController } from "./youtubePlayer.js";
import { AudioPlayerController } from "./audioPlayerController.js";

/**
 * Unified Player Controller
 * Seamlessly routes playback to either YouTube Player (for YouTube URLs)
 * or HTML5 Audio Player (for local authentic Cambridge IELTS audio files).
 */
export class UnifiedPlayerController {
  constructor(containerId = "youtube-player") {
    this.containerId = containerId;
    this.ytPlayer = new YouTubePlayerController(containerId);
    this.audioPlayer = new AudioPlayerController();
    this.mode = "yt"; // "yt" | "audio"
    this.onStateChangeCallbacks = [];
    this.onEmbedRestricted = null;

    // Forward YouTube state changes
    this.ytPlayer.onStateChange((isPlaying, state) => {
      if (this.mode === "yt") {
        this.onStateChangeCallbacks.forEach((cb) => cb(isPlaying, state));
      }
    });

    // Forward Audio state changes
    this.audioPlayer.onStateChange((isPlaying, state) => {
      if (this.mode === "audio") {
        this.onStateChangeCallbacks.forEach((cb) => cb(isPlaying, state));
      }
    });

    // Forward YouTube embed restriction
    this.ytPlayer.onEmbedRestricted = (id) => {
      if (this.onEmbedRestricted && this.mode === "yt") {
        this.onEmbedRestricted(id);
      }
    };
  }

  isAudioSource(src) {
    if (!src || typeof src !== "string") return false;
    const lower = src.toLowerCase();
    return (
      lower.startsWith("/audio/") ||
      lower.includes(".mp3") ||
      lower.includes(".m4a") ||
      lower.includes(".wav") ||
      lower.includes(".ogg")
    );
  }

  get activePlayer() {
    return this.mode === "audio" ? this.audioPlayer : this.ytPlayer;
  }

  get currentLoopStart() {
    return this.activePlayer.currentLoopStart;
  }

  set currentLoopStart(val) {
    this.activePlayer.currentLoopStart = val;
  }

  get currentLoopEnd() {
    return this.activePlayer.currentLoopEnd;
  }

  set currentLoopEnd(val) {
    this.activePlayer.currentLoopEnd = val;
  }

  get isReady() {
    return this.activePlayer.isReady;
  }

  get isAudioMode() {
    return this.mode === "audio";
  }

  setAudioPadding(seconds) {
    this.ytPlayer.setAudioPadding(seconds);
    this.audioPlayer.setAudioPadding(seconds);
  }

  setSourceLang(lang) {
    this.ytPlayer.setSourceLang(lang);
    this.audioPlayer.setSourceLang(lang);
  }

  setReplayInterval(seconds) {
    this.ytPlayer.setReplayInterval(seconds);
    this.audioPlayer.setReplayInterval(seconds);
  }

  onStateChange(cb) {
    if (typeof cb === "function") {
      this.onStateChangeCallbacks.push(cb);
    }
  }

  load(urlOrId, startSeconds = 0, autoplay = false, fallbackDuration = 0) {
    if (!urlOrId) return;

    if (this.isAudioSource(urlOrId)) {
      this.mode = "audio";
      if (typeof window !== "undefined") {
        this.ytPlayer.pause();
      }
      this.audioPlayer.loadAudio(urlOrId, startSeconds, autoplay, fallbackDuration);
    } else {
      this.mode = "yt";
      this.audioPlayer.pause();
      if (typeof window !== "undefined") {
        this.ytPlayer.loadVideo(urlOrId, startSeconds, autoplay);
      }
    }
  }

  loadVideo(urlOrId, startSeconds = 0, autoplay = false, fallbackDuration = 0) {
    this.load(urlOrId, startSeconds, autoplay, fallbackDuration);
  }

  loadAudio(urlOrId, startSeconds = 0, autoplay = false, fallbackDuration = 0) {
    this.load(urlOrId, startSeconds, autoplay, fallbackDuration);
  }

  playSegment(start, end, loop = true, prevEnd = null, nextStart = null) {
    this.activePlayer.playSegment(start, end, loop, prevEnd, nextStart);
  }

  cueSegment(start, end, loop = true, prevEnd = null, nextStart = null) {
    this.activePlayer.cueSegment(start, end, loop, prevEnd, nextStart);
  }

  playFull(time) {
    this.activePlayer.playFull(time);
  }

  play() {
    this.activePlayer.play();
  }

  playVideo() {
    this.activePlayer.playVideo();
  }

  pause() {
    this.activePlayer.pause();
  }

  pauseVideo() {
    this.activePlayer.pauseVideo();
  }

  pauseFull() {
    this.activePlayer.pauseFull();
  }

  togglePlayPause() {
    this.activePlayer.togglePlayPause();
  }

  replayCurrentSegment() {
    this.activePlayer.replayCurrentSegment();
  }

  seekTo(seconds) {
    this.activePlayer.seekTo(seconds);
  }

  seekRelative(seconds) {
    this.activePlayer.seekRelative(seconds);
  }

  setPlaybackRate(speed) {
    this.activePlayer.setPlaybackRate(speed);
  }

  getCurrentTime() {
    const p = this.activePlayer;
    if (!p) return 0;
    try {
      const t = p.getCurrentTime?.();
      return typeof t === "number" && !isNaN(t) ? t : 0;
    } catch (e) {
      return 0;
    }
  }

  getDuration() {
    const p = this.activePlayer;
    if (!p) return 0;
    try {
      const d = p.getDuration?.();
      return typeof d === "number" && !isNaN(d) ? d : 0;
    } catch (e) {
      return 0;
    }
  }

  isPlaying() {
    const p = this.activePlayer;
    if (!p) return false;
    if (typeof p.isPlaying === "function") {
      try {
        return Boolean(p.isPlaying());
      } catch (e) {
        return false;
      }
    }
    return Boolean(p.isPlaying || p._isPlayingState || p._isPlaying);
  }

  setLooping(enabled) {
    this.activePlayer.setLooping(enabled);
  }

  speakText(text, lang) {
    this.ytPlayer.speakText(text, lang);
  }

  destroy() {
    this.ytPlayer.destroy();
    this.audioPlayer.destroy();
  }
}
