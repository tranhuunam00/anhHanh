/**
 * Settings Manager & Keybinding Configuration (DailyDictation Style)
 */
class SettingsManager {
  constructor() {
    this.storageKey = "yt_dictation_settings";
    this.defaults = {
      replayKey: "Control", // "Control", "Tab", "Alt", "KeyR", "Space"
      playPauseKey: "Backquote", // "`" backtick, "Space", "Escape"
      autoReplay: "yes", // "yes", "no"
      replayInterval: 1.0, // seconds
      wordSuggestions: "enabled", // "enabled", "disabled"
      strictPunctuation: "no", // "yes", "no"
      autoAdvance: "yes", // "yes", "no"
    };
    this.settings = this.load();
  }

  load() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) return { ...this.defaults, ...JSON.parse(saved) };
    } catch (e) {
      console.warn("Could not load settings", e);
    }
    return { ...this.defaults };
  }

  save(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.settings));
    } catch (e) {
      console.warn("Could not save settings", e);
    }
  }

  get(key) {
    return this.settings[key] !== undefined ? this.settings[key] : this.defaults[key];
  }

  set(key, value) {
    this.settings[key] = value;
    this.save(this.settings);
  }

  bindUI(onSettingsChanged) {
    const openBtn = document.getElementById("open-settings-btn");
    const closeBtn = document.getElementById("close-settings-btn");
    const modal = document.getElementById("settings-modal-overlay");
    const selects = {
      replayKey: document.getElementById("setting-replay-key"),
      playPauseKey: document.getElementById("setting-playpause-key"),
      autoReplay: document.getElementById("setting-auto-replay"),
      replayInterval: document.getElementById("setting-replay-interval"),
      autoAdvance: document.getElementById("setting-auto-advance"),
      wordSuggestions: document.getElementById("setting-word-suggestions"),
      strictPunctuation: document.getElementById("setting-strict-punct"),
    };

    const sync = () => {
      for (const [k, el] of Object.entries(selects)) {
        if (el) el.value = String(this.get(k));
      }
    };

    openBtn?.addEventListener("click", () => {
      sync();
      modal?.classList.add("active");
    });
    closeBtn?.addEventListener("click", () => modal?.classList.remove("active"));
    modal?.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("active");
    });

    for (const [k, el] of Object.entries(selects)) {
      el?.addEventListener("change", () => {
        const val = k === "replayInterval" ? parseFloat(el.value) : el.value;
        this.set(k, val);
        if (onSettingsChanged) onSettingsChanged(k, val);
      });
    }
  }

  isReplayKey(event) {
    const key = this.get("replayKey");
    if (key === "Control" && (event.key === "Control" || (event.ctrlKey && event.code === "Space"))) return true;
    if (key === "Tab" && event.key === "Tab") return true;
    if (key === "Alt" && event.key === "Alt") return true;
    if (key === "KeyR" && event.code === "KeyR" && !event.ctrlKey) return true;
    if (key === "Space" && event.code === "Space" && event.ctrlKey) return true;
    return false;
  }

  isPlayPauseKey(event) {
    const key = this.get("playPauseKey");
    if (key === "Backquote" && (event.code === "Backquote" || event.key === "`")) return true;
    if (key === "Escape" && event.key === "Escape") return true;
    if (key === "Space" && event.code === "Space" && event.altKey) return true;
    return false;
  }
}
