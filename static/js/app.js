/**
 * Main Application Orchestrator for DailyDictation Studio
 */
document.addEventListener("DOMContentLoaded", () => {
  const playerController = new YouTubePlayerController("youtube-player");
  const dictationManager = new DictationManager();
  const settingsManager = new SettingsManager();

  // State
  let currentLesson = null;
  let currentPosition = 1;
  let autoLoop = settingsManager.get("autoReplay") === "yes";
  let autoAdvance = settingsManager.get("autoAdvance") === "yes";

  playerController.setLooping(autoLoop);
  playerController.setReplayInterval(settingsManager.get("replayInterval"));

  // DOM Elements
  const urlInput = document.getElementById("url-input");
  const loadBtn = document.getElementById("load-btn");
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const challengeTitle = document.getElementById("challenge-title");
  const challengeTime = document.getElementById("challenge-time");
  const progressBarFill = document.getElementById("progress-bar-fill");
  const diffPreview = document.getElementById("diff-preview");
  const dictationInput = document.getElementById("dictation-input");
  const checkBtn = document.getElementById("check-btn");
  const skipBtn = document.getElementById("skip-btn");
  const micBtn = document.getElementById("mic-btn");
  const hintLetterBtn = document.getElementById("hint-letter-btn");
  const hintWordBtn = document.getElementById("hint-word-btn");
  const showAnswerBtn = document.getElementById("show-answer-btn");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const replayBtn = document.getElementById("replay-btn");
  const playPauseBtn = document.getElementById("play-pause-btn");
  const completionCard = document.getElementById("completion-card");
  const originalSentence = document.getElementById("original-sentence");
  const translationSentence = document.getElementById("translation-sentence");
  const nextChallengeBtn = document.getElementById("next-challenge-btn");
  const openDrawerBtn = document.getElementById("open-drawer-btn");
  const closeDrawerBtn = document.getElementById("close-drawer-btn");
  const drawer = document.getElementById("drawer");
  const drawerOverlay = document.getElementById("drawer-overlay");
  const questionGrid = document.getElementById("question-grid");
  const transcriptList = document.getElementById("transcript-list");
  const presetPills = document.querySelectorAll(".preset-pill");
  const embedWarningBanner = document.getElementById("embed-warning-banner");
  const ttsSpeakBtn = document.getElementById("tts-speak-btn");
  const externalYtLink = document.getElementById("external-yt-link");
  const speakSentenceBtn = document.getElementById("speak-sentence-btn");

  // Full Audio Accordion Elements
  const fullAudioHeader = document.getElementById("full-audio-header");
  const fullAudioContent = document.getElementById("full-audio-content");
  const fullAudioIcon = document.getElementById("full-audio-icon");
  const fullAudioPlayBtn = document.getElementById("full-audio-play-btn");
  const fullAudioCurrentTime = document.getElementById("full-audio-current-time");
  const fullAudioTotalTime = document.getElementById("full-audio-total-time");
  const fullAudioProgress = document.getElementById("full-audio-progress");
  const plainTranscriptContainer = document.getElementById("plain-transcript-container");
  let isFullAudioPlaying = false;
  let fullAudioUpdateTimer = null;

  // Settings Manager
  settingsManager.bindUI((key, val) => {
    if (key === "autoReplay") {
      autoLoop = val === "yes";
      playerController.setLooping(autoLoop);
    } else if (key === "replayInterval") {
      playerController.setReplayInterval(val);
    } else if (key === "autoAdvance") {
      autoAdvance = val === "yes";
    } else if (key === "strictPunctuation" || key === "wordSuggestions") {
      evaluateAndRender();
    }
  });

  // Tab switching
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => b.classList.remove("active"));
      tabContents.forEach((c) => (c.style.display = "none"));
      btn.classList.add("active");
      const target = document.getElementById(btn.dataset.target);
      if (target) target.style.display = "block";
    });
  });

  // Speed controls
  document.querySelectorAll(".speed-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".speed-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      playerController.setPlaybackRate(parseFloat(btn.dataset.speed));
    });
  });

  // Theme Toggle
  themeToggleBtn.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const nextTheme = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
    themeToggleBtn.innerHTML = nextTheme === "dark" ? "☀️ Sáng" : "🌙 Tối";
  });
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    themeToggleBtn.innerHTML = "☀️ Sáng";
  }

  // Load lesson handler
  async function loadLesson(urlOrId) {
    if (!urlOrId) return;
    if (embedWarningBanner) embedWarningBanner.style.display = "none";
    loadBtn.disabled = true;
    loadBtn.textContent = "⏳ Đang tải...";

    try {
      const response = await fetch("/api/lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url_or_id: urlOrId, grouping_mode: "sentence" }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Không thể tải bài học");
      }

      currentLesson = await response.json();
      onLessonLoaded(currentLesson);
    } catch (e) {
      alert("Lỗi tải video: " + e.message);
    } finally {
      loadBtn.disabled = false;
      loadBtn.textContent = "🚀 Tải bài tập";
    }
  }

  function onLessonLoaded(lesson) {
    // Setup restriction listener
    playerController.onEmbedRestricted = () => {
      if (embedWarningBanner) embedWarningBanner.style.display = "block";
    };

    // Initialize YouTube Player
    playerController.loadVideo(lesson.video_id);

    // Check saved progress
    const progress = dictationManager.loadProgress(lesson.video_id);
    currentPosition = progress.lastPosition || 1;

    renderQuestionDrawer();
    renderTranscriptTab();
    renderPlainTranscript();
    goToChallenge(currentPosition);
  }

  function getCurrentChallenge() {
    if (!currentLesson || !currentLesson.challenges) return null;
    return currentLesson.challenges.find((c) => c.position === currentPosition);
  }

  function goToChallenge(position) {
    if (!currentLesson || !currentLesson.challenges.length) return;
    if (position < 1) position = 1;
    if (position > currentLesson.total_challenges) position = currentLesson.total_challenges;

    currentPosition = position;
    const challenge = getCurrentChallenge();
    if (!challenge) return;

    // Update external link if restriction occurs
    if (externalYtLink && currentLesson) {
      const startSec = Math.floor(challenge.time_start);
      externalYtLink.href = `https://www.youtube.com/watch?v=${currentLesson.video_id}&t=${startSec}s`;
    }

    // Update UI headers
    challengeTitle.textContent = `Câu ${challenge.position} / ${currentLesson.total_challenges}`;
    const startFmt = formatTime(challenge.time_start);
    const endFmt = formatTime(challenge.time_end);
    challengeTime.textContent = `[${startFmt} - ${endFmt}]`;

    // Highlight line in plain transcript
    document.querySelectorAll(".plain-transcript-line").forEach((el) => el.classList.remove("current"));
    const activePlainLine = document.getElementById(`plain-line-${challenge.position}`);
    if (activePlainLine) {
      activePlainLine.classList.add("current");
      activePlainLine.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    // Update progress bar
    const percent = Math.round((currentPosition / currentLesson.total_challenges) * 100);
    progressBarFill.style.width = `${percent}%`;

    // Load saved input or clear
    const saved = dictationManager.loadProgress(currentLesson.video_id);
    const challengeState = saved.challenges?.[currentPosition] || {};
    dictationInput.value = challengeState.input || "";

    // Play video segment
    playerController.playSegment(challenge.time_start, challenge.time_end, autoLoop);

    // Evaluate current state
    evaluateAndRender();

    // Auto-focus input
    dictationInput.focus();
    updateDrawerActiveState();
  }

  function evaluateAndRender() {
    const challenge = getCurrentChallenge();
    if (!challenge) return;

    const userInput = dictationInput.value;
    const isStrict = settingsManager.get("strictPunctuation") === "yes";

    // DailyDictation Masked Asterisk evaluation (*** ***)
    const maskedResult = dictationManager.evaluateMasked(challenge.text, userInput);
    const evalResult = dictationManager.evaluate(challenge.text, userInput, isStrict);

    // Render diff preview as DailyDictation masked text
    diffPreview.innerHTML = "";
    const container = document.createElement("div");
    container.className = "masked-sentence";

    maskedResult.words.forEach((word) => {
      const wordSpan = document.createElement("span");
      wordSpan.className = "masked-word";
      word.forEach((item) => {
        const charSpan = document.createElement("span");
        charSpan.className = `char-box char-${item.status}`;
        charSpan.textContent = item.display;
        wordSpan.appendChild(charSpan);
      });
      container.appendChild(wordSpan);
    });
    diffPreview.appendChild(container);

    // Handle completed
    const isDone = maskedResult.isCompleted || evalResult.isCompleted;
    if (isDone) {
      dictationManager.saveProgress(currentLesson.video_id, currentPosition, userInput, true);
      completionCard.classList.add("active");
      originalSentence.textContent = challenge.text;
      translationSentence.textContent = challenge.translation || "(Không có bản dịch phụ đề)";
      updateDrawerActiveState();
    } else {
      completionCard.classList.remove("active");
      dictationManager.saveProgress(currentLesson.video_id, currentPosition, userInput, false);
    }
  }

  // Formatting helper
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  // Drawer Render
  function renderQuestionDrawer() {
    if (!currentLesson) return;
    questionGrid.innerHTML = "";
    const progress = dictationManager.loadProgress(currentLesson.video_id);

    currentLesson.challenges.forEach((c) => {
      const btn = document.createElement("button");
      btn.className = "q-btn";
      btn.id = `q-btn-${c.position}`;
      btn.textContent = `Câu ${c.position}`;

      if (progress.challenges?.[c.position]?.isCompleted) {
        btn.classList.add("completed");
      }
      if (c.position === currentPosition) {
        btn.classList.add("current");
      }

      btn.addEventListener("click", () => {
        goToChallenge(c.position);
        closeDrawer();
      });
      questionGrid.appendChild(btn);
    });
  }

  function updateDrawerActiveState() {
    const allBtns = questionGrid.querySelectorAll(".q-btn");
    const progress = dictationManager.loadProgress(currentLesson?.video_id || "");

    allBtns.forEach((btn, idx) => {
      const pos = idx + 1;
      btn.classList.toggle("current", pos === currentPosition);
      if (progress.challenges?.[pos]?.isCompleted) {
        btn.classList.add("completed");
      }
    });
  }

  // Full Transcript Render
  function renderTranscriptTab() {
    if (!currentLesson) return;
    transcriptList.innerHTML = "";

    currentLesson.challenges.forEach((c) => {
      const div = document.createElement("div");
      div.className = "transcript-item";
      div.id = `t-item-${c.position}`;
      div.innerHTML = `
        <div class="transcript-time">Câu ${c.position} [${formatTime(c.time_start)} - ${formatTime(c.time_end)}]</div>
        <div class="transcript-en">${c.text}</div>
        <div class="transcript-vi">${c.translation || ""}</div>
      `;
      div.addEventListener("click", () => {
        goToChallenge(c.position);
        // Switch back to dictation tab
        document.querySelector('[data-target="tab-dictation"]').click();
      });
      transcriptList.appendChild(div);
    });
  }

  // Plain Transcript Render & Full Audio Sync
  function renderPlainTranscript() {
    if (!currentLesson || !plainTranscriptContainer) return;
    plainTranscriptContainer.innerHTML = "";

    currentLesson.challenges.forEach((c) => {
      const line = document.createElement("div");
      line.className = "plain-transcript-line";
      line.id = `plain-line-${c.position}`;
      line.textContent = c.text;
      line.title = `Click để nghe từ câu ${c.position} [${formatTime(c.time_start)}]`;
      line.addEventListener("click", () => {
        goToChallenge(c.position);
      });
      plainTranscriptContainer.appendChild(line);
    });
  }

  // Full Audio Accordion Toggle
  fullAudioHeader?.addEventListener("click", () => {
    const isCollapsed = fullAudioContent.classList.toggle("collapsed");
    fullAudioIcon.textContent = isCollapsed ? "▼" : "▲";
  });

  function updateFullAudioUI() {
    if (!playerController.isReady) return;
    const cur = playerController.getCurrentTime();
    const dur = playerController.getDuration() || 1;
    if (fullAudioCurrentTime) fullAudioCurrentTime.textContent = formatTime(cur);
    if (fullAudioTotalTime) fullAudioTotalTime.textContent = formatTime(dur);
    if (fullAudioProgress) fullAudioProgress.value = Math.min(100, (cur / dur) * 100);

    // Highlight matching line in plain transcript
    if (currentLesson) {
      const activeC = currentLesson.challenges.find(
        (c) => cur >= c.time_start && cur <= c.time_end
      );
      if (activeC) {
        document.querySelectorAll(".plain-transcript-line").forEach((el) => el.classList.remove("current"));
        const lineEl = document.getElementById(`plain-line-${activeC.position}`);
        if (lineEl) {
          lineEl.classList.add("current");
        }
      }
    }
  }

  fullAudioPlayBtn?.addEventListener("click", () => {
    if (!isFullAudioPlaying) {
      isFullAudioPlaying = true;
      fullAudioPlayBtn.textContent = "⏸";
      playerController.playFull();
      if (!fullAudioUpdateTimer) {
        fullAudioUpdateTimer = setInterval(updateFullAudioUI, 250);
      }
    } else {
      isFullAudioPlaying = false;
      fullAudioPlayBtn.textContent = "▶";
      playerController.pauseFull();
    }
  });

  fullAudioProgress?.addEventListener("input", () => {
    const dur = playerController.getDuration() || 1;
    const seekSec = (parseFloat(fullAudioProgress.value) / 100) * dur;
    playerController.seekTo(seekSec);
    if (fullAudioCurrentTime) fullAudioCurrentTime.textContent = formatTime(seekSec);
  });

  // Event Listeners
  loadBtn.addEventListener("click", () => loadLesson(urlInput.value));
  urlInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") loadLesson(urlInput.value);
  });

  dictationInput.addEventListener("input", () => {
    evaluateAndRender();
  });

  if (speakSentenceBtn) {
    speakSentenceBtn.addEventListener("click", () => {
      const challenge = getCurrentChallenge();
      if (challenge) playerController.speakText(challenge.text);
    });
  }

  if (ttsSpeakBtn) {
    ttsSpeakBtn.addEventListener("click", () => {
      const challenge = getCurrentChallenge();
      if (challenge) playerController.speakText(challenge.text);
    });
  }

  checkBtn.addEventListener("click", () => {
    evaluateAndRender();
    const challenge = getCurrentChallenge();
    const result = dictationManager.evaluate(challenge.text, dictationInput.value, false);
    if (result.isCompleted && autoAdvance && currentPosition < currentLesson.total_challenges) {
      setTimeout(() => goToChallenge(currentPosition + 1), 600);
    }
  });

  hintLetterBtn.addEventListener("click", () => {
    const challenge = getCurrentChallenge();
    if (!challenge) return;
    dictationInput.value = dictationManager.getNextLetterHint(challenge.text, dictationInput.value);
    evaluateAndRender();
    dictationInput.focus();
  });

  hintWordBtn.addEventListener("click", () => {
    const challenge = getCurrentChallenge();
    if (!challenge) return;
    dictationInput.value = dictationManager.getNextWordHint(challenge.text, dictationInput.value);
    evaluateAndRender();
    dictationInput.focus();
  });

  showAnswerBtn.addEventListener("click", () => {
    const challenge = getCurrentChallenge();
    if (!challenge) return;
    dictationInput.value = challenge.text;
    evaluateAndRender();
    dictationInput.focus();
  });

  prevBtn.addEventListener("click", () => goToChallenge(currentPosition - 1));
  nextBtn.addEventListener("click", () => goToChallenge(currentPosition + 1));
  nextChallengeBtn.addEventListener("click", () => goToChallenge(currentPosition + 1));

  replayBtn.addEventListener("click", () => playerController.replayCurrentSegment());
  playPauseBtn.addEventListener("click", () => playerController.togglePlayPause());
  document.getElementById("backward-btn").addEventListener("click", () => playerController.seekRelative(-3));
  document.getElementById("forward-btn").addEventListener("click", () => playerController.seekRelative(3));

  // Drawer handlers
  function openDrawer() {
    drawer.classList.add("active");
    drawerOverlay.classList.add("active");
  }
  function closeDrawer() {
    drawer.classList.remove("active");
    drawerOverlay.classList.remove("active");
  }
  openDrawerBtn.addEventListener("click", openDrawer);
  closeDrawerBtn.addEventListener("click", closeDrawer);
  drawerOverlay.addEventListener("click", closeDrawer);

  // Preset pills
  presetPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      presetPills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      urlInput.value = pill.dataset.url;
      loadLesson(pill.dataset.url);
    });
  });

  skipBtn?.addEventListener("click", () => goToChallenge(currentPosition + 1));

  // Speech-to-Text Microphone (Voice Dictation)
  if (micBtn && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognizer = new SpeechRecognition();
    recognizer.lang = "en-US";
    let isListening = false;

    micBtn.addEventListener("click", () => {
      if (isListening) {
        recognizer.stop();
        return;
      }
      try {
        recognizer.start();
        isListening = true;
        micBtn.classList.add("listening");
      } catch (e) { console.warn(e); }
    });
    recognizer.onresult = (evt) => {
      const txt = evt.results[0][0].transcript;
      dictationInput.value = (dictationInput.value ? dictationInput.value + " " : "") + txt;
      evaluateAndRender();
    };
    recognizer.onend = () => { isListening = false; micBtn.classList.remove("listening"); };
    recognizer.onerror = () => { isListening = false; micBtn.classList.remove("listening"); };
  }

  // Global Keyboard Shortcuts (Configurable via Settings)
  window.addEventListener("keydown", (e) => {
    // Configured Replay Key (Ctrl / Space / Tab / Alt / R)
    if (settingsManager.isReplayKey(e)) {
      e.preventDefault();
      playerController.replayCurrentSegment();
      return;
    }
    // Configured Play/Pause Key (` / Esc / Space)
    if (settingsManager.isPlayPauseKey(e)) {
      e.preventDefault();
      playerController.togglePlayPause();
      return;
    }
    // Esc: Show full answer immediately (Hiện full câu luôn)
    if (e.key === "Escape" || e.code === "Escape") {
      e.preventDefault();
      showAnswerBtn.click();
      return;
    }
    // Ctrl + H: Hint letter
    if (e.ctrlKey && e.key.toLowerCase() === "h") {
      e.preventDefault();
      hintLetterBtn.click();
      return;
    }
    // Alt + ArrowRight: Next challenge
    if (e.altKey && e.key === "ArrowRight") {
      e.preventDefault();
      goToChallenge(currentPosition + 1);
      return;
    }
    // Alt + ArrowLeft: Previous challenge
    if (e.altKey && e.key === "ArrowLeft") {
      e.preventDefault();
      goToChallenge(currentPosition - 1);
      return;
    }
  });

  // Auto load default video on start!
  if (urlInput.value) {
    loadLesson(urlInput.value);
  }
});
