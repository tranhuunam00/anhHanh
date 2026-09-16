/**
 * DrawerManager: Quản lý danh sách câu hỏi trong sidebar drawer
 */
class DrawerManager {
  constructor() {
    this.drawer = document.getElementById("drawer");
    this.drawerOverlay = document.getElementById("drawer-overlay");
    this.questionGrid = document.getElementById("question-grid");
    this.openBtn = document.getElementById("open-drawer-btn");
    this.closeBtn = document.getElementById("close-drawer-btn");
    this.onSelectCallback = null;

    this._bindEvents();
  }

  _bindEvents() {
    this.openBtn?.addEventListener("click", () => this.open());
    this.closeBtn?.addEventListener("click", () => this.close());
    this.drawerOverlay?.addEventListener("click", () => this.close());
  }

  open() {
    this.drawer?.classList.add("active");
    this.drawerOverlay?.classList.add("active");
  }

  close() {
    this.drawer?.classList.remove("active");
    this.drawerOverlay?.classList.remove("active");
  }

  isOpen() {
    return this.drawer?.classList.contains("active") || false;
  }

  render(lesson, currentPos, progress, onSelectChallenge) {
    if (!lesson || !this.questionGrid) return;
    this.onSelectCallback = onSelectChallenge;
    this.questionGrid.innerHTML = "";

    lesson.challenges.forEach((c) => {
      const btn = document.createElement("button");
      btn.className = "q-btn";
      btn.id = `q-btn-${c.position}`;
      btn.textContent = `Câu ${c.position}`;

      if (progress.challenges?.[c.position]?.isCompleted) {
        btn.classList.add("completed");
      }
      if (c.position === currentPos) {
        btn.classList.add("current");
      }

      btn.addEventListener("click", () => {
        if (this.onSelectCallback) this.onSelectCallback(c.position);
        this.close();
      });
      this.questionGrid.appendChild(btn);
    });
  }

  updateActive(currentPos, progress) {
    if (!this.questionGrid) return;
    const allBtns = this.questionGrid.querySelectorAll(".q-btn");

    allBtns.forEach((btn, idx) => {
      const pos = idx + 1;
      btn.classList.toggle("current", pos === currentPos);
      if (progress.challenges?.[pos]?.isCompleted) {
        btn.classList.add("completed");
      } else {
        btn.classList.remove("completed");
      }
    });
  }
}

window.DrawerManager = DrawerManager;
