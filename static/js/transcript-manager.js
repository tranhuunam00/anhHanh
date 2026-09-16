/**
 * TranscriptManager: Quản lý Tab 2 Toàn bộ bài nghe & Trình phát Audio đồng bộ
 */
class TranscriptManager {
  constructor(playerController) {
    this.playerController = playerController;
    this.transcriptList = document.getElementById("transcript-list");
    this.fullAudioHeader = document.getElementById("full-audio-header");
    this.fullAudioContent = document.getElementById("full-audio-content");
    this.fullAudioIcon = document.getElementById("full-audio-icon");
    this.fullAudioPlayBtn = document.getElementById("full-audio-play-btn");
    this.fullAudioCurrentTime = document.getElementById("full-audio-current-time");
    this.fullAudioTotalTime = document.getElementById("full-audio-total-time");
    this.fullAudioProgress = document.getElementById("full-audio-progress");

    this.isFullAudioPlaying = false;
    this.fullAudioUpdateTimer = null;
    this.currentLesson = null;
    this.onSelectChallenge = null;

    this._bindEvents();
  }

  _bindEvents() {
    this.fullAudioHeader?.addEventListener("click", () => {
      const isCollapsed = this.fullAudioContent.classList.toggle("collapsed");
      if (this.fullAudioIcon) this.fullAudioIcon.textContent = isCollapsed ? "▼" : "▲";
    });

    this.fullAudioPlayBtn?.addEventListener("click", () => {
      if (!this.isFullAudioPlaying) {
        this.isFullAudioPlaying = true;
        this.fullAudioPlayBtn.textContent = "⏸";
        this.playerController.playFull();
        if (!this.fullAudioUpdateTimer) {
          this.fullAudioUpdateTimer = setInterval(() => this.updateFullAudioUI(), 250);
        }
      } else {
        this.isFullAudioPlaying = false;
        this.fullAudioPlayBtn.textContent = "▶";
        this.playerController.pauseFull();
      }
    });

    this.fullAudioProgress?.addEventListener("input", () => {
      const dur = this.playerController.getDuration() || 1;
      const seekSec = (parseFloat(this.fullAudioProgress.value) / 100) * dur;
      this.playerController.seekTo(seekSec);
      if (this.fullAudioCurrentTime) this.fullAudioCurrentTime.textContent = this.formatTime(seekSec);
    });
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  render(lesson, currentPos, onSelectChallenge) {
    this.currentLesson = lesson;
    this.onSelectChallenge = onSelectChallenge;
    if (!lesson || !this.transcriptList) return;

    this.transcriptList.innerHTML = "";

    lesson.challenges.forEach((c) => {
      const div = document.createElement("div");
      div.className = "transcript-item" + (c.position === currentPos ? " current" : "");
      div.id = `t-item-${c.position}`;
      div.innerHTML = `
        <div class="transcript-header-meta">
          <span class="transcript-time">Câu ${c.position} [${this.formatTime(c.time_start)} - ${this.formatTime(c.time_end)}]</span>
        </div>
        <div class="transcript-en">${c.text}</div>
        <div class="transcript-vi">${c.translation || ""}</div>
      `;
      div.addEventListener("click", () => {
        if (this.onSelectChallenge) this.onSelectChallenge(c.position);
        document.querySelector('[data-target="tab-dictation"]')?.click();
      });
      this.transcriptList.appendChild(div);
    });
  }

  updateFullAudioUI() {
    if (!this.playerController.isReady) return;
    const cur = this.playerController.getCurrentTime();
    const dur = this.playerController.getDuration() || 1;

    if (this.fullAudioCurrentTime) this.fullAudioCurrentTime.textContent = this.formatTime(cur);
    if (this.fullAudioTotalTime) this.fullAudioTotalTime.textContent = this.formatTime(dur);
    if (this.fullAudioProgress) this.fullAudioProgress.value = Math.min(100, (cur / dur) * 100);

    if (this.currentLesson) {
      const activeC = this.currentLesson.challenges.find(
        (c) => cur >= c.time_start && cur <= c.time_end
      );
      if (activeC) {
        document.querySelectorAll(".transcript-item").forEach((el) => el.classList.remove("current"));
        const itemEl = document.getElementById(`t-item-${activeC.position}`);
        if (itemEl) itemEl.classList.add("current");
      }
    }
  }

  resetAudioPlayer() {
    this.isFullAudioPlaying = false;
    if (this.fullAudioPlayBtn) this.fullAudioPlayBtn.textContent = "▶";
    if (this.fullAudioUpdateTimer) {
      clearInterval(this.fullAudioUpdateTimer);
      this.fullAudioUpdateTimer = null;
    }
  }
}

window.TranscriptManager = TranscriptManager;
