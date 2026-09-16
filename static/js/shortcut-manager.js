/**
 * ShortcutManager: Quản lý và xử lý phím tắt toàn cục cho DailyDictation Studio
 */
class ShortcutManager {
  constructor(options) {
    this.settingsManager = options.settingsManager;
    this.playerController = options.playerController;
    this.drawerManager = options.drawerManager;
    this.dictationInput = options.dictationInput;
    this.getCurrentChallenge = options.getCurrentChallenge;
    this.evaluateAndRender = options.evaluateAndRender;
    this.goToChallenge = options.goToChallenge;
    this.getCurrentPosition = options.getCurrentPosition;
    this.hintLetterBtn = options.hintLetterBtn;

    this._bindShortcuts();
  }

  _bindShortcuts() {
    window.addEventListener("keydown", (e) => {
      // Replay
      if (this.settingsManager.isReplayKey(e)) {
        e.preventDefault();
        this.playerController.replayCurrentSegment();
        return;
      }
      // Play/Pause
      if (this.settingsManager.isPlayPauseKey(e)) {
        e.preventDefault();
        this.playerController.togglePlayPause();
        return;
      }

      // Phím Esc: Ưu tiên đóng Modal/Drawer; nếu không thì hiện full đáp án câu hiện tại
      if (e.key === "Escape" || e.code === "Escape") {
        const settingsModal = document.getElementById("settings-modal-overlay");
        if (settingsModal && settingsModal.classList.contains("active")) {
          settingsModal.classList.remove("active");
          this.dictationInput.focus();
          return;
        }
        if (this.drawerManager && this.drawerManager.isOpen()) {
          this.drawerManager.close();
          this.dictationInput.focus();
          return;
        }

        // Hiện đáp án câu hiện tại (đáp ứng workflow: Esc = hiện đáp án, Enter = sang câu sau)
        e.preventDefault();
        const challenge = this.getCurrentChallenge();
        if (challenge) {
          this.dictationInput.value = challenge.text;
          this.evaluateAndRender();
          this.dictationInput.focus();
        }
        return;
      }

      // Ctrl + H: Gợi ý 1 chữ
      if (e.ctrlKey && e.key.toLowerCase() === "h") {
        e.preventDefault();
        this.hintLetterBtn?.click();
        return;
      }

      // Alt + ArrowRight: Câu kế tiếp
      if (e.altKey && e.key === "ArrowRight") {
        e.preventDefault();
        this.goToChallenge(this.getCurrentPosition() + 1);
        return;
      }

      // Alt + ArrowLeft: Câu trước đó
      if (e.altKey && e.key === "ArrowLeft") {
        e.preventDefault();
        this.goToChallenge(this.getCurrentPosition() - 1);
        return;
      }
    });
  }
}

window.ShortcutManager = ShortcutManager;
