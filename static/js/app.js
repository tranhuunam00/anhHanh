/**
 * Main Application Orchestrator for DailyDictation Studio
 */
document.addEventListener("DOMContentLoaded", () => {
  const playerController = new YouTubePlayerController("youtube-player");
  const dictationManager = new DictationManager();
  const settingsManager = new SettingsManager();
  const drawerManager = new DrawerManager();
  const transcriptManager = new TranscriptManager(playerController);

  // State
  let currentLesson = null;
  let currentPosition = 1;
  let autoLoop = settingsManager.get("autoReplay") === "yes";
  let autoAdvance = settingsManager.get("autoAdvance") === "yes";

  playerController.setLooping(autoLoop);
  playerController.setReplayInterval(settingsManager.get("replayInterval"));
  playerController.setAudioPadding(settingsManager.get("audioPadding"));

  // DOM Elements
  const urlInput = document.getElementById("url-input");
  const loadBtn = document.getElementById("load-btn");
  const sourceLangSelect = document.getElementById("source-lang-select");
  const targetLangSelect = document.getElementById("target-lang-select");
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
  const retryChallengeBtn = document.getElementById("retry-challenge-btn");
  const presetCards = document.querySelectorAll(".preset-card");
  const embedWarningBanner = document.getElementById("embed-warning-banner");
  const ttsSpeakBtn = document.getElementById("tts-speak-btn");
  const externalYtLink = document.getElementById("external-yt-link");
  const speakSentenceBtn = document.getElementById("speak-sentence-btn");

  // Sync initial language dropdowns with settings
  if (sourceLangSelect) sourceLangSelect.value = settingsManager.get("sourceLang") || "auto";
  if (targetLangSelect) targetLangSelect.value = settingsManager.get("targetLang") || "vi";

  sourceLangSelect?.addEventListener("change", () => {
    settingsManager.set("sourceLang", sourceLangSelect.value);
  });
  targetLangSelect?.addEventListener("change", () => {
    settingsManager.set("targetLang", targetLangSelect.value);
  });

  // Settings Manager bindings
  settingsManager.bindUI((key, val) => {
    if (key === "autoReplay") {
      autoLoop = val === "yes";
      playerController.setLooping(autoLoop);
    } else if (key === "replayInterval") {
      playerController.setReplayInterval(val);
    } else if (key === "audioPadding") {
      playerController.setAudioPadding(val);
    } else if (key === "sourceLang") {
      if (sourceLangSelect) sourceLangSelect.value = val;
    } else if (key === "targetLang") {
      if (targetLangSelect) targetLangSelect.value = val;
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

  function getSpeechLangCode(code) {
    if (!code) return "en-US";
    const map = { en: "en-US", fr: "fr-FR", ja: "ja-JP", ko: "ko-KR", zh: "zh-CN", de: "de-DE", es: "es-ES", vi: "vi-VN", ru: "ru-RU", it: "it-IT", pt: "pt-BR" };
    return map[code.toLowerCase().split("-")[0]] || "en-US";
  }

  // Load lesson
  async function loadLesson(urlOrId) {
    if (!urlOrId || loadBtn.disabled) return;
    // Remember last loaded URL so we can restore on next page visit
    localStorage.setItem("lastUrl", urlOrId);
    if (embedWarningBanner) embedWarningBanner.style.display = "none";

    loadBtn.disabled = true;
    loadBtn.innerHTML = '<span class="spinner-sm"></span> <span>Đang tải...</span>';
    presetCards.forEach((c) => {
      c.style.pointerEvents = "none";
      c.style.opacity = "0.6";
    });

    const srcLang = sourceLangSelect ? sourceLangSelect.value : (settingsManager.get("sourceLang") || "auto");
    const tgtLang = targetLangSelect ? targetLangSelect.value : (settingsManager.get("targetLang") || "vi");

    // Match preset card active state if URL matches
    presetCards.forEach((c) => {
      c.classList.toggle("active", c.dataset.url === urlOrId);
    });

    fetch(`/api/video-languages?url_or_id=${encodeURIComponent(urlOrId)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((langData) => {
        if (langData && langData.detected_source_lang && sourceLangSelect && sourceLangSelect.value === "auto") {
          const autoOpt = sourceLangSelect.querySelector('option[value="auto"]');
          if (autoOpt) {
            autoOpt.textContent = `🌐 Tự động phát hiện (${langData.detected_source_lang.toUpperCase()})`;
          }
        }
      })
      .catch(() => {});

    try {
      const response = await fetch("/api/lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url_or_id: urlOrId,
          grouping_mode: "sentence",
          source_lang: srcLang,
          target_lang: tgtLang,
        }),
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
      loadBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
          <span>Tải bài tập</span>`;
      presetCards.forEach((c) => {
        c.style.pointerEvents = "";
        c.style.opacity = "";
      });
    }
  }

  function onLessonLoaded(lesson) {
    playerController.onEmbedRestricted = () => {
      if (embedWarningBanner) embedWarningBanner.style.display = "block";
    };

    const detected = lesson.detected_source_lang || "en";
    playerController.setSourceLang(detected);
    if (speechRecognizer) {
      speechRecognizer.lang = getSpeechLangCode(detected);
    }

    playerController.loadVideo(lesson.video_id);

    currentPosition = 1; // Always start from the beginning
    const progress = dictationManager.loadProgress(lesson.video_id); // for sidebar completion state only

    drawerManager.render(lesson, currentPosition, progress, (pos) => goToChallenge(pos));
    transcriptManager.render(lesson, currentPosition, (pos) => goToChallenge(pos));
    goToChallenge(currentPosition);
  }

  function getCurrentChallenge() {
    if (!currentLesson || !currentLesson.challenges) return null;
    return currentLesson.challenges.find((c) => c.position === currentPosition);
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  function goToChallenge(position) {
    if (!currentLesson || !currentLesson.challenges.length) return;
    if (position < 1) position = 1;
    if (position > currentLesson.total_challenges) position = currentLesson.total_challenges;

    currentPosition = position;
    const challenge = getCurrentChallenge();
    if (!challenge) return;

    if (externalYtLink && currentLesson) {
      const startSec = Math.floor(challenge.time_start);
      externalYtLink.href = `https://www.youtube.com/watch?v=${currentLesson.video_id}&t=${startSec}s`;
    }

    challengeTitle.textContent = `Câu ${currentPosition} / ${currentLesson.total_challenges}`;
    challengeTime.textContent = `[${formatTime(challenge.time_start)} - ${formatTime(challenge.time_end)}]`;

    const percent = Math.round((currentPosition / currentLesson.total_challenges) * 100);
    progressBarFill.style.width = `${percent}%`;

    const saved = dictationManager.loadProgress(currentLesson.video_id);
    dictationInput.value = ""; // Always start fresh — don't restore saved input

    const prevChallenge = currentPosition > 1 ? currentLesson.challenges[currentPosition - 2] : null;
    const nextChallenge = currentPosition < currentLesson.total_challenges ? currentLesson.challenges[currentPosition] : null;
    const prevEnd = prevChallenge ? prevChallenge.time_end : null;
    const nextStart = nextChallenge ? nextChallenge.time_start : null;

    playerController.playSegment(challenge.time_start, challenge.time_end, autoLoop, prevEnd, nextStart);

    evaluateAndRender();
    dictationInput.focus();
    drawerManager.updateActive(currentPosition, saved);
  }

  function evaluateAndRender() {
    const challenge = getCurrentChallenge();
    if (!challenge) return;

    const userInput = dictationInput.value;
    const isStrict = settingsManager.get("strictPunctuation") === "yes";

    const maskedResult = dictationManager.evaluateMasked(challenge.text, userInput);
    const evalResult = dictationManager.evaluate(challenge.text, userInput, isStrict);

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

    const hasInput = Boolean(userInput && userInput.trim().length > 0);
    const isDone = hasInput && (maskedResult.isCompleted || evalResult.isCompleted);

    if (isDone) {
      dictationManager.saveProgress(currentLesson.video_id, currentPosition, userInput, true);
      completionCard.classList.add("active");
      originalSentence.textContent = challenge.text;

      const tgtLang = targetLangSelect ? targetLangSelect.value : (settingsManager.get("targetLang") || "vi");
      if (!challenge.translation && tgtLang !== "none") {
        translationSentence.textContent = "⏳ Đang dịch nghĩa...";
        fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: challenge.text,
            source_lang: currentLesson.detected_source_lang || "auto",
            target_lang: tgtLang,
          }),
        })
          .then((r) => r.json())
          .then((d) => {
            if (d.translation) {
              challenge.translation = d.translation;
              translationSentence.textContent = d.translation;
              const tItemVi = document.querySelector(`#t-item-${challenge.position} .transcript-vi`);
              if (tItemVi) tItemVi.textContent = d.translation;
            } else {
              translationSentence.textContent = "(Không có bản dịch phụ đề)";
            }
          })
          .catch(() => {
            translationSentence.textContent = "(Không có bản dịch phụ đề)";
          });
      } else {
        translationSentence.textContent = challenge.translation || (tgtLang === "none" ? "" : "(Không có bản dịch phụ đề)");
      }
      const p = dictationManager.loadProgress(currentLesson.video_id);
      drawerManager.updateActive(currentPosition, p);
    } else {
      completionCard.classList.remove("active");
      dictationManager.saveProgress(currentLesson.video_id, currentPosition, userInput, false);
      const p = dictationManager.loadProgress(currentLesson.video_id);
      drawerManager.updateActive(currentPosition, p);
    }
  }

  // Event Listeners
  loadBtn.addEventListener("click", () => loadLesson(urlInput.value));
  urlInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") loadLesson(urlInput.value);
  });

  dictationInput.addEventListener("input", () => evaluateAndRender());

  // Enter: kiểm tra và chuyển câu tức thì (0ms nếu đã xong, 120ms nếu vừa hoàn tất)
  dictationInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const alreadyDone = completionCard.classList.contains("active");
      if (alreadyDone && currentPosition < (currentLesson ? currentLesson.total_challenges : 1)) {
        goToChallenge(currentPosition + 1);
      } else {
        checkBtn.click();
      }
    }
  });

  checkBtn.addEventListener("click", () => {
    const challenge = getCurrentChallenge();
    if (!challenge) return;

    const alreadyDone = completionCard.classList.contains("active");
    evaluateAndRender();
    const result = dictationManager.evaluate(challenge.text, dictationInput.value, false);

    if ((alreadyDone || result.isCompleted) && autoAdvance && currentPosition < currentLesson.total_challenges) {
      const delay = alreadyDone ? 0 : 120;
      if (delay === 0) {
        goToChallenge(currentPosition + 1);
      } else {
        setTimeout(() => goToChallenge(currentPosition + 1), delay);
      }
    }
  });

  // Bỏ qua = Esc (hiện đáp án) + Enter (sang câu tiếp theo)
  skipBtn?.addEventListener("click", () => {
    const challenge = getCurrentChallenge();
    if (!challenge) return;
    dictationInput.value = challenge.text;
    evaluateAndRender();
    if (currentPosition < (currentLesson ? currentLesson.total_challenges : 1)) {
      goToChallenge(currentPosition + 1);
    }
  });

  // Luyện lại câu này
  if (retryChallengeBtn) {
    retryChallengeBtn.addEventListener("click", () => {
      dictationInput.value = "";
      evaluateAndRender();
      dictationInput.focus();
      playerController.replayCurrentSegment();
    });
  }

  // Gợi ý
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

  if (showAnswerBtn) {
    showAnswerBtn.addEventListener("click", () => {
      const challenge = getCurrentChallenge();
      if (!challenge) return;
      dictationInput.value = challenge.text;
      evaluateAndRender();
      dictationInput.focus();
    });
  }

  // Navigation buttons
  prevBtn.addEventListener("click", () => goToChallenge(currentPosition - 1));
  nextBtn.addEventListener("click", () => goToChallenge(currentPosition + 1));
  nextChallengeBtn.addEventListener("click", () => goToChallenge(currentPosition + 1));

  replayBtn.addEventListener("click", () => playerController.replayCurrentSegment());
  playPauseBtn.addEventListener("click", () => playerController.togglePlayPause());
  document.getElementById("backward-btn").addEventListener("click", () => playerController.seekRelative(-3));
  document.getElementById("forward-btn").addEventListener("click", () => playerController.seekRelative(3));

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

  // Preset Cards click handler (Sửa lỗi không bấm được vào các bài mẫu)
  presetCards.forEach((card) => {
    card.addEventListener("click", () => {
      presetCards.forEach((c) => c.classList.remove("active"));
      card.classList.add("active");

      // Apply language pair from card's data attributes
      const srcLang = card.dataset.sourceLang;
      const tgtLang = card.dataset.targetLang;
      if (srcLang && sourceLangSelect) {
        sourceLangSelect.value = srcLang;
        settingsManager.set("sourceLang", srcLang);
      }
      if (tgtLang && targetLangSelect) {
        targetLangSelect.value = tgtLang;
        settingsManager.set("targetLang", tgtLang);
      }

      urlInput.value = card.dataset.url;
      loadLesson(card.dataset.url);
    });
  });

  // Speech Recognition Microphone
  let speechRecognizer = null;
  if (micBtn && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    speechRecognizer = new SpeechRecognition();
    speechRecognizer.lang = "en-US";
    let isListening = false;

    micBtn.addEventListener("click", () => {
      if (isListening) {
        speechRecognizer.stop();
        return;
      }
      try {
        speechRecognizer.start();
        isListening = true;
        micBtn.classList.add("listening");
      } catch (e) { console.warn(e); }
    });
    speechRecognizer.onresult = (evt) => {
      const txt = evt.results[0][0].transcript;
      dictationInput.value = (dictationInput.value ? dictationInput.value + " " : "") + txt;
      evaluateAndRender();
    };
    speechRecognizer.onend = () => { isListening = false; micBtn.classList.remove("listening"); };
    speechRecognizer.onerror = () => { isListening = false; micBtn.classList.remove("listening"); };
  }

  // Global Keyboard Shortcuts (Esc = xem đáp án, Enter = sang câu, Ctrl = replay,...)
  new ShortcutManager({
    settingsManager,
    playerController,
    drawerManager,
    dictationInput,
    getCurrentChallenge: () => getCurrentChallenge(),
    evaluateAndRender: () => evaluateAndRender(),
    goToChallenge: (pos) => goToChallenge(pos),
    getCurrentPosition: () => currentPosition,
    hintLetterBtn,
  });

  // Restore last used URL from localStorage (overrides hardcoded HTML default)
  const lastUrl = localStorage.getItem("lastUrl");
  if (lastUrl) urlInput.value = lastUrl;

  // Auto load initial video
  if (urlInput.value) {
    loadLesson(urlInput.value);
  }
});
