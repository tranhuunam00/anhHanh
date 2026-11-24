import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Header } from "./components/Header/Header";
import { PlayerCard } from "./components/Player/PlayerCard";
import { DictationStudio } from "./components/Dictation/DictationStudio";
import { IeltsSpotlightSection } from "./components/Presets/IeltsSpotlightSection";
import { PresetsSection } from "./components/Presets/PresetsSection";
import { QuestionsDrawer } from "./components/Drawer/QuestionsDrawer";
import { AuthModal } from "./components/Modals/AuthModal";
import { PreviewModal } from "./components/Modals/PreviewModal";
import { FloatingVocabSaver } from "./components/Vocab/FloatingVocabSaver";

import { Footer } from "./components/Footer/Footer";
import { AuthGateScreen } from "./components/Auth/AuthGateScreen";
import { AppTabsNav } from "./components/Navigation/AppTabsNav";
import { LazyTabPanel } from "./components/Navigation/LazyTabPanel";
import { DeferredMount } from "./components/Navigation/DeferredMount";
import { LazyPages, LazyModals, preloadTabPage, preloadDeferredModals } from "./pages/lazyRegistry";
import { initDailyReminderScheduler } from "./utils/dailyReminderManager";
import { getTabFromLocation, getPathFromTab, normalizeTabId } from "./utils/tabRouting";
import { queueUiIntent, UI_INTENTS } from "./utils/uiIntents";
import { scheduleIdleTask } from "./utils/lazyModule";
import { loadIeltsAudioLesson } from "./utils/ieltsDictationDataLoader";
import "./styles/admin-and-feedback.css";

const {
  TranscriptPage, VocabTab, HistoryTab, AudioStudioPage, SmartReaderPage, WritingPage,
  DestinationB2Page, VisualVocabPage, RootWordsPage, IeltsTestPage, PrimaryKidsPage,
  StudyBuddyView, TikTokLiveStudio, AdminPortal,
} = LazyPages;
const {
  SettingsModal, ShortcutsModal, FeedbackModal, LessonCompleteModal,
  MicrophonePermissionModal, VideoErrorModal,
} = LazyModals;

import { useTheme } from "./hooks/useTheme";
import { useSettings } from "./hooks/useSettings";
import { useShortcuts } from "./hooks/useShortcuts";
import { useAuth } from "./context/AuthContext";

import { fetchLesson, fetchVideoLanguages } from "./services/api";
import {
  fetchLessonPreview,
  startLessonSession,
  updateLessonProgress,
} from "./services/authVocabService";
import { UnifiedPlayerController } from "./services/unifiedPlayerController";
import { resolveAudioPresetFromUrl } from "./utils/ieltsPresetResolver";
import { SpeechRecognitionService } from "./services/speechRecognition";

import { evaluateMasked, getNextLetterHint, getNextWordHint } from "./utils/diffCalculator";
import { loadLessonProgress, saveLessonProgress, getStorageItem, setStorageItem } from "./utils/storage";
import { extractYouTubeId, toCanonicalYouTubeUrl, cleanYouTubeUrl } from "./utils/textNormalizer";
import { SPEECH_LANG_MAP } from "./constants/languages";

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { settings, updateSetting, resetSettings } = useSettings();
  const { token, user, isAuthenticated, refreshStreak, showToast, streak } = useAuth();

  // Helper to map URL path to active tab
  const getTabFromPath = () => {
    if (typeof window === "undefined") return "tab-dictation";
    return getTabFromLocation(window.location.pathname, window.location.search);
  };

  // Navigation & Modal State
  const [activeTab, setActiveTabState] = useState(getTabFromPath);
  const activeTabRef = useRef(activeTab);
  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  // Keep track of visited tabs to lazy-load & preserve tab state without eagerly mounting unvisited tabs
  const [visitedTabs, setVisitedTabs] = useState(() => new Set([getTabFromPath()]));

  useEffect(() => {
    setVisitedTabs((prev) => {
      if (prev.has(activeTab)) return prev;
      const next = new Set(prev);
      next.add(activeTab);
      return next;
    });
  }, [activeTab]);

  const setActiveTab = useCallback((tabOrFn) => {
    setActiveTabState((prev) => {
      const nextTab = normalizeTabId(typeof tabOrFn === "function" ? tabOrFn(prev) : tabOrFn);
      activeTabRef.current = nextTab;
      const targetPath = getPathFromTab(nextTab);
      if (typeof window !== "undefined" && window.location.pathname !== targetPath) {
        window.history.pushState({ tab: nextTab }, "", targetPath);
      }
      return nextTab;
    });
  }, []);

  // Listen to browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setActiveTabState(getTabFromPath());
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Khởi động Daily Vocab Reminder Background Scheduler & Service Worker
  useEffect(() => {
    const cleanupScheduler = initDailyReminderScheduler();

    const handleOpenExerciseHub = () => {
      // VocabTab is lazy: queue a sticky intent it consumes on mount, and
      // dispatch the event for the case where it is already mounted.
      queueUiIntent(UI_INTENTS.OPEN_EXERCISE_HUB);
      setActiveTab("tab-vocab");
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent(UI_INTENTS.OPEN_EXERCISE_HUB));
      }, 150);
    };

    // Warm up small, frequently opened modal chunks once the app is idle
    const cancelIdlePreload = scheduleIdleTask(() => preloadDeferredModals(), { timeout: 4000 });

    window.addEventListener("open-exercise-hub", handleOpenExerciseHub);

    return () => {
      if (cleanupScheduler) cleanupScheduler();
      cancelIdlePreload();
      window.removeEventListener("open-exercise-hub", handleOpenExerciseHub);
    };
  }, [setActiveTab]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isLessonCompleteModalOpen, setIsLessonCompleteModalOpen] = useState(false);
  const [isMicPermissionModalOpen, setIsMicPermissionModalOpen] = useState(false);
  const [videoErrorData, setVideoErrorData] = useState(null);
  const [previewData, setPreviewData] = useState(null);

  // Lesson & Player State
  const [urlInput, setUrlInput] = useState(() => getStorageItem("lastUrl", "https://www.youtube.com/watch?v=qe9QSCF-d88"));
  const [sourceLang, setSourceLang] = useState(
    settings.sourceLang && settings.sourceLang !== "auto" ? settings.sourceLang : "en"
  );
  const [targetLang, setTargetLang] = useState(settings.targetLang || "vi");
  const [autoDetectedLang, setAutoDetectedLang] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmbedRestricted, setIsEmbedRestricted] = useState(false);

  const [currentLesson, setCurrentLesson] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxReachedIndex, setMaxReachedIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const userInputRef = useRef("");
  const [inputVersion, setInputVersion] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const updateUserInput = useCallback((newVal) => {
    const val = typeof newVal === "string" ? newVal : "";
    userInputRef.current = val;
    setUserInput(val);
    setInputVersion((v) => v + 1);
    if (speechRef.current) {
      speechRef.current.setBaseText(val);
    }
  }, []);
  const [progressMap, setProgressMap] = useState({});
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Draggable Split Ratio between Player and Dictation Studio (clamped 25% - 75%)
  const [splitRatio, setSplitRatio] = useState(() => {
    const saved = getStorageItem("shotlang_split_ratio", 50);
    const num = Number(saved);
    return isNaN(num) || num < 25 || num > 75 ? 50 : num;
  });
  const [isDraggingSplit, setIsDraggingSplit] = useState(false);
  const splitContainerRef = useRef(null);
  const isDraggingSplitRef = useRef(false);
  const splitRatioRef = useRef(splitRatio);
  splitRatioRef.current = splitRatio;

  const handleSplitMouseDown = (e) => {
    e.preventDefault();
    setIsDraggingSplit(true);
    isDraggingSplitRef.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  const handleResetSplitRatio = () => {
    setSplitRatio(50);
    setStorageItem("shotlang_split_ratio", 50);
    showToast("Đã đặt lại tỷ lệ 2 bên 50% / 50%", "info");
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDraggingSplitRef.current || !splitContainerRef.current) return;
      const rect = splitContainerRef.current.getBoundingClientRect();
      if (!rect.width) return;
      const newRatio = ((e.clientX - rect.left) / rect.width) * 100;
      const clamped = Math.max(25, Math.min(75, Math.round(newRatio * 10) / 10));
      setSplitRatio(clamped);
    };

    const handleMouseUp = () => {
      if (isDraggingSplitRef.current) {
        isDraggingSplitRef.current = false;
        setIsDraggingSplit(false);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        setStorageItem("shotlang_split_ratio", splitRatioRef.current);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, []);

  // Controller Refs
  const playerRef = useRef(null);
  const speechRef = useRef(null);

  if (!playerRef.current) {
    playerRef.current = new UnifiedPlayerController("youtube-player");
  }
  const playerController = playerRef.current;

  // Sync settings with player controller & handle audio crosstalk
  useEffect(() => {
    if (playerController) {
      playerController.setLooping(settings.autoReplay === "yes");
      playerController.setReplayInterval(settings.replayInterval);
      playerController.setAudioPadding(settings.audioPadding);
      playerController.onStateChange((playing) => {
        setIsPlaying(playing);
        if (playing && typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("shotlang:pause-other-audio"));
        }
      });
    }
  }, [settings, playerController]);

  // Listen for signal to pause YouTube when AudioStudio plays
  useEffect(() => {
    const handlePauseYouTube = () => {
      if (playerController) {
        playerController.pause();
      }
    };
    window.addEventListener("shotlang:pause-youtube-player", handlePauseYouTube);
    return () => window.removeEventListener("shotlang:pause-youtube-player", handlePauseYouTube);
  }, [playerController]);

  // Initialize Speech Recognition
  useEffect(() => {
    speechRef.current = new SpeechRecognitionService(
      (transcript) => {
        userInputRef.current = transcript;
        setUserInput(transcript);
      },
      (status) => setIsListening(status),
      (err) => showToast(err, "error"),
      () => setIsMicPermissionModalOpen(true)
    );

    const handleMicPerm = () => setIsMicPermissionModalOpen(true);
    window.addEventListener("shotlang:mic-permission-required", handleMicPerm);
    return () => {
      window.removeEventListener("shotlang:mic-permission-required", handleMicPerm);
    };
  }, []);

  // Sync speech recognition language whenever source language changes
  useEffect(() => {
    if (speechRef.current) {
      const activeSrc = (currentLesson?.detected_source_lang || sourceLang || "en").toLowerCase();
      const speechLang = SPEECH_LANG_MAP[activeSrc] || "en-US";
      speechRef.current.setLang(speechLang);
    }
  }, [sourceLang, currentLesson?.detected_source_lang]);

  // Update YouTube embed restriction callback
  useEffect(() => {
    if (playerController) {
      playerController.onEmbedRestricted = () => setIsEmbedRestricted(true);
    }
  }, [playerController]);

  // Auto pause playback when switching tabs away from dictation tab
  useEffect(() => {
    if (activeTab !== "tab-dictation") {
      playerController.pause();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    }
  }, [activeTab, playerController]);

  // Auto pause playback when switching browser tabs or minimizing window
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        playerController.pause();
        if (window.speechSynthesis) window.speechSynthesis.cancel();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [playerController]);

  // Auto-restore last lesson on mount (F5 reload or initial visit)
  const initialLoadDoneRef = useRef(false);
  useEffect(() => {
    if (!initialLoadDoneRef.current && urlInput) {
      initialLoadDoneRef.current = true;
      executeLoadLesson(urlInput, sourceLang, targetLang, 0);
    }
  }, [urlInput, token]);

  // Step 1: User requests loading a lesson -> Fetch preview first
  const handleRequestPreview = async (urlOrId, reqSourceLang, reqTargetLang) => {
    if (!urlOrId || isLoading) return;
    setIsLoading(true);

    const cleanUrl = cleanYouTubeUrl(urlOrId);
    if (cleanUrl.startsWith("/audio/") || cleanUrl.includes(".mp3") || cleanUrl.includes(".m4a")) {
      handleSelectLocalAudioPreset(resolveAudioPresetFromUrl(cleanUrl), "dictation");
      return;
    }
    const sLang = reqSourceLang !== undefined ? reqSourceLang : sourceLang;
    const tLang = reqTargetLang !== undefined ? reqTargetLang : targetLang;

    try {
      // Async language detection check
      fetchVideoLanguages(cleanUrl).then((langData) => {
        if (langData && langData.detected_source_lang) {
          setAutoDetectedLang(langData.detected_source_lang);
        }
      });

      const preview = await fetchLessonPreview(cleanUrl, sLang, tLang, token);
      setPreviewData(preview);
      setIsPreviewOpen(true);
    } catch (e) {
      // If preview fails, fall back to direct load
      console.warn("Preview failed, falling back to direct load:", e);
      await executeLoadLesson(cleanUrl, sLang, tLang, 0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    if (currentLesson?.video_id) {
      setUrlInput(toCanonicalYouTubeUrl(currentLesson.video_id));
    }
  };

  // Step 2: Confirm start lesson from preview modal (or direct load)
  const executeLoadLesson = async (urlOrId, reqSourceLang, reqTargetLang, startPos = 0, forceRefresh = false) => {
    setIsLoading(true);
    setIsEmbedRestricted(false);

    const cleanUrl = cleanYouTubeUrl(urlOrId);
    if (cleanUrl.startsWith("/audio/") || cleanUrl.includes(".mp3") || cleanUrl.includes(".m4a")) {
      handleSelectLocalAudioPreset(resolveAudioPresetFromUrl(cleanUrl), "dictation");
      return;
    }
    const sLang = reqSourceLang !== undefined ? reqSourceLang : sourceLang;
    const tLang = reqTargetLang !== undefined ? reqTargetLang : targetLang;

    try {
      const lessonData = await fetchLesson({
        urlOrId: cleanUrl,
        sourceLang: sLang,
        targetLang: tLang,
        forceRefresh,
      });

      // 1. Unified Global State Synchronization: Set lesson and canonical YouTube URL
      setCurrentLesson(lessonData);
      const canonicalUrl = toCanonicalYouTubeUrl(lessonData.video_id);
      setUrlInput(canonicalUrl);
      setStorageItem("lastUrl", canonicalUrl);

      // 2. Language synchronization
      const effectiveSourceLang = (sLang && sLang !== "auto") ? sLang : (lessonData.detected_source_lang || "en");
      setSourceLang(effectiveSourceLang);
      updateSetting("sourceLang", effectiveSourceLang);
      if (lessonData.detected_source_lang) {
        setAutoDetectedLang(lessonData.detected_source_lang);
      }
      if (tLang) {
        setTargetLang(tLang);
        updateSetting("targetLang", tLang);
      }

      // 3. Record session start in backend and retrieve saved currentPosition
      let effectivePos = Number(startPos) || 0;
      try {
        const sessionData = await startLessonSession(lessonData.video_id, token, effectiveSourceLang, tLang);
        if (effectivePos <= 0 && sessionData && sessionData.currentPosition) {
          effectivePos = Number(sessionData.currentPosition);
        }
      } catch (err) {
        console.warn("Could not start session:", err);
      }

      // 4. Load progress map from localStorage as fallback
      const prog = loadLessonProgress(lessonData.video_id, effectiveSourceLang, tLang);
      setProgressMap(prog);

      if (effectivePos <= 0 && prog && prog.lastPosition) {
        effectivePos = Number(prog.lastPosition);
      }

      // Resilient fallback: if challenges map has completed questions, pick maxCompleted + 1
      if (prog?.challenges && Object.keys(prog.challenges).length > 0) {
        const completedNums = Object.keys(prog.challenges)
          .map(Number)
          .filter((n) => !isNaN(n) && prog.challenges[n]?.isCompleted);
        if (completedNums.length > 0) {
          effectivePos = Math.max(effectivePos, Math.max(...completedNums) + 1);
        }
      }

      // 5. Calculate initial question index (0-indexed)
      const finalPos = Math.max(1, effectivePos || 1);
      const targetIndex = finalPos <= lessonData.challenges.length ? finalPos - 1 : 0;
      setMaxReachedIndex(targetIndex);
      setCurrentIndex(targetIndex);
      userInputRef.current = "";
      setUserInput("");
      setIsCompleted(false);

      // 6. Setup Player & Speech Recognition
      playerController.setSourceLang(effectiveSourceLang);
      if (speechRef.current) {
        const langCode = SPEECH_LANG_MAP[effectiveSourceLang.toLowerCase()] || "en-US";
        speechRef.current.setLang(langCode);
      }

      // 7. CRITICAL: Load video in the player controller so it points to the new video ID
      const targetChallenge = lessonData.challenges && lessonData.challenges[targetIndex];
      const targetStartTime = targetChallenge ? targetChallenge.time_start : 0;
      const isDictationActive = activeTabRef.current === "tab-dictation";
      playerController.loadVideo(lessonData.video_id, targetStartTime, isDictationActive);

      // 8. Only play segment if currently on dictation tab; otherwise cue and pause
      if (isDictationActive) {
        playChallengeAtIndex(lessonData, targetIndex);
      } else {
        cueChallengeAtIndex(lessonData, targetIndex);
        playerController.pause();
      }
    } catch (e) {
      setVideoErrorData({
        videoId: extractYouTubeId(cleanUrl) || cleanUrl,
        message: e.message || "Không thể tải phụ đề cho video này.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Cue segment for challenge at specific index (ready and paused, no autoplay)
  const cueChallengeAtIndex = (lessonObj, index) => {
    if (!lessonObj || !lessonObj.challenges || !lessonObj.challenges[index]) return;
    const c = lessonObj.challenges[index];
    const prevC = index > 0 ? lessonObj.challenges[index - 1] : null;
    const nextC = index < lessonObj.challenges.length - 1 ? lessonObj.challenges[index + 1] : null;

    playerController.cueSegment(
      c.time_start,
      c.time_end,
      settings.autoReplay === "yes",
      prevC ? prevC.time_end : null,
      nextC ? nextC.time_start : null
    );
  };

  const handleSelectLocalAudioPreset = async (preset, mode = "dictation") => {
    if (!preset) return;
    setIsLoading(true);
    let lesson = null;
    try {
      lesson = await loadIeltsAudioLesson(preset);
    } catch (err) {
      console.error("Failed to build IELTS audio lesson:", err);
      showToast("Không tải được dữ liệu bài nghe. Vui lòng kiểm tra mạng và thử lại.", "error");
    }
    if (!lesson) {
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setIsEmbedRestricted(false);
    setCurrentLesson(lesson);
    setUrlInput(lesson.audioUrl);
    setStorageItem("lastUrl", lesson.audioUrl);

    const sLang = lesson.sourceLang || "en";
    const tLang = lesson.targetLang || "vi";
    setSourceLang(sLang);
    setTargetLang(tLang);

    const prog = loadLessonProgress(lesson.video_id, sLang, tLang);
    setProgressMap(prog || { challenges: {}, lastPosition: 1 });

    const totalChallenges = lesson.challenges?.length || 1;
    let effectivePos = Number(prog?.lastPosition) || 1;

    // Resilient fallback: if challenges map has completed questions, pick maxCompleted + 1
    if (prog?.challenges && Object.keys(prog.challenges).length > 0) {
      const completedNums = Object.keys(prog.challenges)
        .map(Number)
        .filter((n) => !isNaN(n) && prog.challenges[n]?.isCompleted);
      if (completedNums.length > 0) {
        effectivePos = Math.max(effectivePos, Math.max(...completedNums) + 1);
      }
    }

    const targetIndex = Math.min(totalChallenges - 1, Math.max(0, effectivePos - 1));
    setMaxReachedIndex(targetIndex);
    setCurrentIndex(targetIndex);
    userInputRef.current = "";
    setUserInput("");
    setIsCompleted(false);

    playerController.setSourceLang(sLang);
    if (speechRef.current) {
      const langCode = SPEECH_LANG_MAP[sLang.toLowerCase()] || "en-US";
      speechRef.current.setLang(langCode);
    }

    const targetChallenge = lesson.challenges?.[targetIndex];
    const targetStartTime = targetChallenge ? targetChallenge.time_start : 0;
    const fallbackDuration = lesson.challenges?.length
      ? Math.max(...lesson.challenges.map((c) => c.time_end || 0))
      : 0;
    const isDictation = mode === "dictation";
    playerController.load(lesson.audioUrl, targetStartTime, isDictation, fallbackDuration);

    if (isDictation) {
      activeTabRef.current = "tab-dictation";
      setActiveTab("tab-dictation");
      playChallengeAtIndex(lesson, targetIndex, true);
    } else {
      activeTabRef.current = "tab-transcript";
      setActiveTab("tab-transcript");
      cueChallengeAtIndex(lesson, targetIndex);
      playerController.pause();
    }

    // Sync session and resume position with backend DB if authenticated
    if (token) {
      startLessonSession(lesson.video_id, token, sLang, tLang).then((sessionData) => {
        if (sessionData && sessionData.currentPosition) {
          const dbPos = Number(sessionData.currentPosition);
          if (dbPos > 0 && dbPos > effectivePos) {
            const dbIndex = Math.min(totalChallenges - 1, Math.max(0, dbPos - 1));
            setMaxReachedIndex((prev) => Math.max(prev, dbIndex));
            setCurrentIndex(dbIndex);
            if (isDictation) {
              playChallengeAtIndex(lesson, dbIndex, true);
            }
          }
        }
      }).catch(() => {});
    }
  };

  // Play segment for challenge at specific index
  const playChallengeAtIndex = (lessonObj, index, force = false) => {
    if (!lessonObj || !lessonObj.challenges || !lessonObj.challenges[index]) return;
    if (!force && activeTabRef.current !== "tab-dictation") return; // Safety guard: never play if not on dictation tab
    const c = lessonObj.challenges[index];
    const prevC = index > 0 ? lessonObj.challenges[index - 1] : null;
    const nextC = index < lessonObj.challenges.length - 1 ? lessonObj.challenges[index + 1] : null;

    playerController.playSegment(
      c.time_start,
      c.time_end,
      settings.autoReplay === "yes",
      prevC ? prevC.time_end : null,
      nextC ? nextC.time_start : null
    );
  };

  // Trigger lesson completion celebration & persist completion status
  const handleCompleteLesson = () => {
    if (!currentLesson) return;
    setIsCompleted(true);

    const sL = currentLesson.source_lang || sourceLang;
    const tL = currentLesson.target_lang || targetLang;
    const totalCount = currentLesson.challenges?.length || 1;

    // Save completion state in local storage progress
    const newProg = { ...progressMap };
    if (!newProg.challenges) newProg.challenges = {};
    newProg.challenges[totalCount] = { isCompleted: true, lastUpdated: Date.now() };
    newProg.lastPosition = totalCount;
    newProg.isCompleted = true;
    setProgressMap(newProg);
    saveLessonProgress(currentLesson.video_id, newProg, sL, tL);

    // Sync completion with backend
    updateLessonProgress(currentLesson.video_id, totalCount, true, token, 0, sL, tL);
    refreshStreak();

    // Show celebration modal
    setIsLessonCompleteModalOpen(true);
  };

  // Navigate to specific challenge index
  const goToChallenge = (index) => {
    if (!currentLesson) return;
    if (index >= currentLesson.challenges.length) {
      if (isCompleted || maxReachedIndex >= currentLesson.challenges.length - 1) {
        handleCompleteLesson();
      }
      return;
    }
    if (index < 0) return;
    setCurrentIndex(index);
    playChallengeAtIndex(currentLesson, index, true);

    // If user goes back to a previously reached sentence: auto-fill and mark completed!
    // User requirement: "các câu trước đó mặc định đã điền, chỉ cần quan tâm đang đến câu nào thôi, cái đáp án đó tự fill"
    if (index < maxReachedIndex) {
      const challengeText = currentLesson.challenges[index].text;
      updateUserInput(challengeText);
      setIsCompleted(true);
    } else {
      updateUserInput("");
      setIsCompleted(false);
      if (index > maxReachedIndex) {
        setMaxReachedIndex(index);
      }
    }

    // Sync progress with backend (never downgrade saved position if user is just reviewing earlier questions)
    if (currentLesson.video_id) {
      const posToSync = Math.max(index + 1, maxReachedIndex + 1);
      updateLessonProgress(
        currentLesson.video_id,
        posToSync,
        false,
        token,
        0,
        currentLesson.source_lang || sourceLang,
        currentLesson.target_lang || targetLang
      );
    }
  };

  // Restart lesson from câu 1
  const handleRestartLesson = () => {
    if (!currentLesson) return;
    const confirmReset = window.confirm("Bạn có chắc chắn muốn làm lại bài học này từ câu số 1?");
    if (!confirmReset) return;

    setMaxReachedIndex(0);
    setCurrentIndex(0);
    updateUserInput("");
    setIsCompleted(false);

    const sL = currentLesson.source_lang || sourceLang;
    const tL = currentLesson.target_lang || targetLang;
    const newProg = { challenges: {}, lastPosition: 1 };
    setProgressMap(newProg);
    saveLessonProgress(currentLesson.video_id, newProg, sL, tL);
    updateLessonProgress(currentLesson.video_id, 1, false, token, 0, sL, tL);
    playChallengeAtIndex(currentLesson, 0);
  };

  const handleReloadSubtitles = async () => {
    if (!currentLesson?.video_id || isLoading) return;
    const confirmReload = window.confirm(
      "Bạn có muốn xóa toàn bộ bộ nhớ đệm và tải lại phụ đề chuẩn mới nhất từ YouTube cho bài này không?"
    );
    if (!confirmReload) return;

    await executeLoadLesson(currentLesson.video_id, sourceLang, targetLang, 0, true);
  };

  const currentChallenge = useMemo(() => {
    return currentLesson?.challenges?.[currentIndex] || null;
  }, [currentLesson, currentIndex]);

  const enterTrackerRef = useRef({ count: 0, lastTime: 0, lastInput: "" });

  // Handle checking answers
  const handleCheck = (inputOverride) => {
    if (!currentChallenge) return;

    if (isCompleted) {
      enterTrackerRef.current = { count: 0, lastTime: 0, lastInput: "" };
      if (currentIndex < (currentLesson?.challenges?.length || 0) - 1) {
        goToChallenge(currentIndex + 1);
      } else {
        handleCompleteLesson();
      }
      return;
    }

    const currentVal = typeof inputOverride === "string" ? inputOverride : (userInputRef.current || userInput);
    const evalResult = evaluateMasked(currentChallenge.text, currentVal, settings.strictPunctuation);

    if (evalResult.isCompleted) {
      enterTrackerRef.current = { count: 0, lastTime: 0, lastInput: "" };
      setIsCompleted(true);
      updateUserInput(currentVal);

      const isAllDone = currentIndex === (currentLesson?.challenges?.length || 0) - 1;

      if (currentLesson) {
        const nextPos = Math.min((currentLesson.challenges?.length || 1), currentIndex + 2);
        const newMax = Math.max(maxReachedIndex, currentIndex + 1);
        setMaxReachedIndex(newMax);

        const sL = currentLesson.source_lang || sourceLang;
        const tL = currentLesson.target_lang || targetLang;

        const newProg = { ...progressMap };
        if (!newProg.challenges) newProg.challenges = {};
        newProg.challenges[currentIndex + 1] = { isCompleted: true, lastUpdated: Date.now() };
        newProg.lastPosition = Math.max(nextPos, (newProg.lastPosition || 1));
        setProgressMap(newProg);
        saveLessonProgress(currentLesson.video_id, newProg, sL, tL);

        // Record progress in backend DB
        updateLessonProgress(currentLesson.video_id, nextPos, isAllDone, token, 0, sL, tL);
        refreshStreak();
      }

      if (settings.autoAdvance === "yes") {
        if (currentIndex < (currentLesson?.challenges?.length || 0) - 1) {
          setTimeout(() => {
            goToChallenge(currentIndex + 1);
          }, 800);
        } else {
          setTimeout(() => {
            handleCompleteLesson();
          }, 800);
        }
      }
    } else {
      const now = Date.now();
      const tracker = enterTrackerRef.current;

      if (now - tracker.lastTime < 1500 && tracker.lastInput === currentVal) {
        tracker.count += 1;
      } else {
        tracker.count = 1;
      }
      tracker.lastTime = now;

      if (tracker.count >= 2) {
        handleHintLetter();
        tracker.count = 0;
      } else {
        tracker.lastInput = currentVal;
      }
    }
  };

  const handleSkip = () => {
    if (!currentChallenge || !currentLesson) return;

    // Tự động điền lại toàn bộ đáp án chuẩn và đánh dấu hoàn thành câu (không tự ý nhảy sang câu tiếp theo)
    updateUserInput(currentChallenge.text);
    setIsCompleted(true);

    const isAllDone = currentIndex === (currentLesson?.challenges?.length || 0) - 1;
    const nextPos = Math.min((currentLesson.challenges?.length || 1), currentIndex + 2);
    const newMax = Math.max(maxReachedIndex, currentIndex + 1);
    setMaxReachedIndex(newMax);

    const sL = currentLesson.source_lang || sourceLang;
    const tL = currentLesson.target_lang || targetLang;

    const newProg = { ...progressMap };
    if (!newProg.challenges) newProg.challenges = {};
    newProg.challenges[currentIndex + 1] = { isCompleted: true, lastUpdated: Date.now() };
    newProg.lastPosition = Math.max(nextPos, (newProg.lastPosition || 1));
    if (isAllDone) {
      newProg.isCompleted = true;
    }
    setProgressMap(newProg);
    saveLessonProgress(currentLesson.video_id, newProg, sL, tL);

    updateLessonProgress(currentLesson.video_id, nextPos, isAllDone, token, 0, sL, tL);
    if (isAllDone) {
      refreshStreak();
    }
  };

  const handleHintLetter = () => {
    if (!currentChallenge) return;
    const currentVal = userInputRef.current || userInput;
    const nextVal = getNextLetterHint(currentChallenge.text, currentVal, settings.strictPunctuation);
    updateUserInput(nextVal);
  };

  const handleHintWord = () => {
    if (!currentChallenge) return;
    const currentVal = userInputRef.current || userInput;
    const nextVal = getNextWordHint(currentChallenge.text, currentVal);
    updateUserInput(nextVal);
  };

  const handleSpeakSentence = () => {
    if (currentChallenge) {
      if (playerController?.isAudioMode) {
        playerController.replayCurrentSegment();
      } else {
        playerController.speakText(currentChallenge.text, currentLesson?.detected_source_lang);
      }
    }
  };

  const handleToggleMic = (currentInput) => {
    if (speechRef.current) {
      const base =
        typeof currentInput === "string"
          ? currentInput
          : (typeof userInputRef.current === "string"
              ? userInputRef.current
              : (typeof userInput === "string" ? userInput : ""));
      speechRef.current.toggle(base);
    }
  };

  const isAnyModalOpen =
    isSettingsOpen ||
    isShortcutsOpen ||
    isDrawerOpen ||
    isAuthOpen ||
    isPreviewOpen ||
    isFeedbackOpen ||
    isLessonCompleteModalOpen ||
    isMicPermissionModalOpen;

  // Đóng popup/modal đang mở khi ấn phím Escape (không làm nhảy/skip câu của bài học)
  useEffect(() => {
    if (!isAnyModalOpen) return;
    const handleModalEsc = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsSettingsOpen(false);
        setIsShortcutsOpen(false);
        setIsDrawerOpen(false);
        setIsAuthOpen(false);
        setIsPreviewOpen(false);
        setIsFeedbackOpen(false);
        setIsLessonCompleteModalOpen(false);
        setIsMicPermissionModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleModalEsc);
    return () => window.removeEventListener("keydown", handleModalEsc);
  }, [isAnyModalOpen]);

  // Keyboard Shortcuts Hook
  useShortcuts({
    replayKey: settings.replayKey,
    playPauseKey: settings.playPauseKey,
    onReplay: () => playerController.replayCurrentSegment(),
    onPlayPause: () => playerController.togglePlayPause(),
    onPrev: () => goToChallenge(currentIndex - 1),
    onNext: () => goToChallenge(currentIndex + 1),
    onCheck: () => handleCheck(userInputRef.current),
    onSkip: handleSkip,
    onHintLetter: handleHintLetter,
    onHintWord: handleHintWord,
    enabled: activeTab === "tab-dictation" && !isAnyModalOpen,
  });

  return (
    <div className="app-root">
      <Header
        urlInput={urlInput}
        setUrlInput={setUrlInput}
        sourceLang={sourceLang}
        setSourceLang={(val) => {
          setSourceLang(val);
          updateSetting("sourceLang", val);
        }}
        targetLang={targetLang}
        setTargetLang={(val) => {
          setTargetLang(val);
          updateSetting("targetLang", val);
        }}
        autoDetectedLang={autoDetectedLang}
        isLoading={isLoading}
        onLoadLesson={(url) => {
          if (!isAuthenticated) {
            setIsAuthOpen(true);
            return;
          }
          handleRequestPreview(url, sourceLang, targetLang);
        }}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenVocabTab={() => setActiveTab("tab-vocab")}
        onOpenBuddyTab={() => setActiveTab("tab-buddy")}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        onOpenAdminTab={() => setActiveTab("tab-admin")}
      />

      {!isAuthenticated ? (
        <AuthGateScreen
          onOpenLogin={() => setIsAuthOpen(true)}
          onOpenRegister={() => setIsAuthOpen(true)}
        />
      ) : (
        <main className="main-container">
        {/* Navigation Tabs Header - Compact Single-Row Layout */}
        <AppTabsNav
          activeTab={activeTab}
          isAdmin={user?.role === "ADMIN"}
          onSelectTab={setActiveTab}
          onSelectDictation={() => {
            setActiveTab("tab-dictation");
            if (currentLesson) cueChallengeAtIndex(currentLesson, currentIndex);
          }}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onPreloadTab={preloadTabPage}
        />

        {/* TAB 1: Dictation Practice */}
        <div style={{ display: activeTab === "tab-dictation" ? "block" : "none" }}>
          <div className="exercise-split-container" ref={splitContainerRef}>
            {/* Overlay shield while dragging to prevent YouTube iframe from capturing mouse */}
            {isDraggingSplit && <div className="split-drag-overlay" />}

            {/* Left Column: Player Card */}
            <div
              className="exercise-pane exercise-pane-left"
              style={{ flex: `0 0 calc(${splitRatio}% - 9px)` }}
            >
              <PlayerCard
                playerController={playerController}
                isEmbedRestricted={isEmbedRestricted}
                currentSentenceText={currentChallenge?.text}
                sourceLang={sourceLang}
                isPlaying={isPlaying}
                onReplay={() => playerController.replayCurrentSegment()}
                onPlayPause={() => playerController.togglePlayPause()}
                onSeekRelative={(sec) => playerController.seekRelative(sec)}
                onSpeakSentence={handleSpeakSentence}
                videoUrl={urlInput}
              />
            </div>

            {/* Draggable Divider Bar */}
            <div
              className={`split-divider ${isDraggingSplit ? "active" : ""}`}
              onMouseDown={handleSplitMouseDown}
              onDoubleClick={handleResetSplitRatio}
              title="Kéo thả để điều chỉnh tỷ lệ 2 bên (Nhấp đúp để đặt lại 50/50)"
            >
              <div className="split-divider-line">
                <div className="split-divider-handle">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>

            {/* Right Column: Dictation Studio */}
            <div
              className="exercise-pane exercise-pane-right"
              style={{ flex: `1 1 0` }}
            >
              <DictationStudio
                currentChallenge={currentChallenge}
                currentIndex={currentIndex}
                videoId={currentLesson?.video_id || ""}
                totalChallenges={currentLesson?.total_challenges || 0}
                targetLang={currentLesson?.target_lang || targetLang}
                sourceLang={currentLesson?.source_lang || sourceLang}
                userInput={userInput}
                setUserInput={setUserInput}
                inputVersion={inputVersion}
                onInputChange={(val) => {
                  userInputRef.current = val;
                  if (speechRef.current) {
                    speechRef.current.setBaseText(val);
                  }
                }}
                isListening={isListening}
                isPlaying={isPlaying}
                onToggleMic={handleToggleMic}
                onCheck={handleCheck}
                onSkip={handleSkip}
                onReplay={() => playerController.replayCurrentSegment()}
                onPlayPause={() => playerController.togglePlayPause()}
                onSpeakSentence={handleSpeakSentence}
                onHintLetter={handleHintLetter}
                onHintWord={handleHintWord}
                onPrev={() => goToChallenge(currentIndex - 1)}
                onNext={() => goToChallenge(currentIndex + 1)}
                onOpenDrawer={() => setIsDrawerOpen(true)}
                onRestartLesson={handleRestartLesson}
                onReloadSubtitles={handleReloadSubtitles}
                isCompleted={isCompleted}
                strictPunctuation={settings.strictPunctuation}
                onNextChallenge={() => {
                  if (currentIndex >= (currentLesson?.challenges?.length || 1) - 1) {
                    handleCompleteLesson();
                  } else {
                    goToChallenge(currentIndex + 1);
                  }
                }}
                onCompleteLesson={handleCompleteLesson}
                onRetryChallenge={() => {
                  updateUserInput("");
                  setIsCompleted(false);
                  playerController.replayCurrentSegment();
                }}
              />
            </div>
          </div>

          {/* Khoảng riêng luyện thi IELTS Cambridge đặt ngay trên "Thử ngay – Luyện đa ngôn ngữ" */}
          <IeltsSpotlightSection
            activeUrl={urlInput}
            isLoading={isLoading}
            onSelectPreset={(preset, mode = "dictation") => {
              handleSelectLocalAudioPreset(preset, mode);
            }}
            onGoToIeltsExam={() => setActiveTab("tab-ielts-test")}
          />

          <PresetsSection
            activeUrl={urlInput}
            isLoading={isLoading}
            onSelectPreset={(preset, mode = "dictation") => {
              if (
                preset.audioUrl ||
                (preset.url && (preset.url.startsWith("/audio/") || preset.url.includes(".mp3") || preset.url.includes(".m4a")))
              ) {
                handleSelectLocalAudioPreset(preset, mode);
              } else {
                handleRequestPreview(preset.url, preset.sourceLang, preset.targetLang);
                if (mode === "transcript") {
                  setActiveTab("tab-transcript");
                } else {
                  setActiveTab("tab-dictation");
                }
              }
            }}
          />
        </div>

        {/* TAB 2: Transcript & Full Audio (unmounted when hidden: it drives the shared player) */}
        <LazyTabPanel tabId="tab-transcript" activeTab={activeTab} keepMounted={false} loadingLabel="Đang tải transcript...">
          <TranscriptPage
            lesson={currentLesson}
            playerController={playerController}
            isActive={activeTab === "tab-transcript"}
            onGoToChallenge={(pos) => {
              activeTabRef.current = "tab-dictation";
              setActiveTab("tab-dictation");
              goToChallenge(pos - 1);
            }}
          />
        </LazyTabPanel>

        {/* TAB 3: Smart Vocabulary Notebook */}
        <LazyTabPanel tabId="tab-vocab" activeTab={activeTab} visited={visitedTabs.has("tab-vocab")} loadingLabel="Đang tải sổ từ vựng...">
          <VocabTab
            isActive={activeTab === "tab-vocab"}
            onOpenGuide={() => setIsShortcutsOpen(true)}
          />
        </LazyTabPanel>

        {/* TAB: Smart News & Vocab Reader */}
        <LazyTabPanel tabId="tab-reader" activeTab={activeTab} visited={visitedTabs.has("tab-reader")}>
          <SmartReaderPage isActive={activeTab === "tab-reader"} />
        </LazyTabPanel>

        {/* TAB 4: Study History */}
        <LazyTabPanel tabId="tab-history" activeTab={activeTab} visited={visitedTabs.has("tab-history")} loadingLabel="Đang tải lịch sử học...">
          <HistoryTab
            isActive={activeTab === "tab-history"}
            onSelectLesson={(videoId, targetPos, srcLang, tgtLang) => {
              setActiveTab("tab-dictation");
              executeLoadLesson(videoId, srcLang, tgtLang, targetPos);
            }}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        </LazyTabPanel>

        {/* TAB 5: Admin Management Portal */}
        <LazyTabPanel tabId="tab-admin" activeTab={activeTab} visited={visitedTabs.has("tab-admin")}>
          <AdminPortal
            user={user}
            token={token}
            showToast={showToast}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        </LazyTabPanel>

        {/* TAB 6: Audio & Phonology Studio (Isolated Screen) */}
        <LazyTabPanel tabId="tab-audio-studio" activeTab={activeTab} visited={visitedTabs.has("tab-audio-studio")}>
          <AudioStudioPage isActive={activeTab === "tab-audio-studio"} />
        </LazyTabPanel>

        {/* TAB 7: AI Writing Studio */}
        <LazyTabPanel tabId="tab-writing" activeTab={activeTab} visited={visitedTabs.has("tab-writing")}>
          <WritingPage isActive={activeTab === "tab-writing"} />
        </LazyTabPanel>

        {/* TAB 8: Destination B2 (Unit 1 & 2) */}
        <LazyTabPanel tabId="tab-destination-b2" activeTab={activeTab} visited={visitedTabs.has("tab-destination-b2")}>
          <DestinationB2Page isActive={activeTab === "tab-destination-b2"} token={token} />
        </LazyTabPanel>

        {/* TAB 9: Visual Diagram Vocabulary (Mountain & University) */}
        <LazyTabPanel tabId="tab-visual-vocab" activeTab={activeTab} visited={visitedTabs.has("tab-visual-vocab")}>
          <VisualVocabPage isActive={activeTab === "tab-visual-vocab"} token={token} />
        </LazyTabPanel>

        {/* TAB 10: 100 Gốc Từ Tiếng Anh (Word Roots) */}
        <LazyTabPanel tabId="tab-root-words" activeTab={activeTab} visited={visitedTabs.has("tab-root-words")}>
          <RootWordsPage isActive={activeTab === "tab-root-words"} />
        </LazyTabPanel>

        {/* TAB 11: Đề thi thật IELTS (Cambridge Practice Tests) */}
        <LazyTabPanel
          tabId="tab-ielts-test"
          activeTab={activeTab}
          visited={visitedTabs.has("tab-ielts-test")}
          loadingLabel="Đang tải đề thi IELTS..."
          style={{ height: activeTab === "tab-ielts-test" ? "calc(100vh - 56px)" : "auto", overflow: "hidden" }}
        >
          <IeltsTestPage
            isActive={activeTab === "tab-ielts-test"}
            user={user}
            token={token}
            onOpenAuth={() => setIsAuthOpen(true)}
            showToast={showToast}
          />
        </LazyTabPanel>

        {/* TAB 12: Tiểu Học - Global English 4 Gamified Safari */}
        <LazyTabPanel tabId="tab-primary" activeTab={activeTab} visited={visitedTabs.has("tab-primary")}>
          <PrimaryKidsPage isActive={activeTab === "tab-primary"} />
        </LazyTabPanel>

        {/* TAB 13: Bạn học quanh đây (GPS Study Buddies) */}
        <LazyTabPanel tabId="tab-buddy" activeTab={activeTab} visited={visitedTabs.has("tab-buddy")}>
          <StudyBuddyView
            token={token}
            currentUser={user}
            showToast={showToast}
          />
        </LazyTabPanel>

        {/* TAB 14: TikTok LIVE Interactive Classroom (unmounted when hidden) */}
        <LazyTabPanel tabId="tab-tiktok-live" activeTab={activeTab} keepMounted={false}>
          <TikTokLiveStudio
            isActive={activeTab === "tab-tiktok-live"}
            onBackToHome={() => setActiveTab("tab-dictation")}
          />
        </LazyTabPanel>
      </main>
      )}

      {/* Professional ShotLang Footer (Hidden during IELTS exam mode to prevent window scroll) */}
      {activeTab !== "tab-ielts-test" && (
        <Footer
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
          onOpenFeedback={() => setIsFeedbackOpen(true)}
        />
      )}

      {/* Floating Vocab Selection Saver Tooltip */}
      {isAuthenticated && (
        <FloatingVocabSaver
          currentSentence={currentChallenge?.text || ""}
          currentVideoId={currentLesson?.video_id || ""}
          currentTimestamp={currentChallenge?.time_start || 0}
          sourceLang={currentLesson?.source_lang || sourceLang || "en"}
          targetLang={targetLang || "vi"}
        />
      )}

      {/* Feedback Modal */}
      <DeferredMount when={isFeedbackOpen}>
        <FeedbackModal
          isOpen={isFeedbackOpen}
          onClose={() => setIsFeedbackOpen(false)}
          user={user}
          token={token}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenAdminTab={() => setActiveTab("tab-admin")}
          showToast={showToast}
        />
      </DeferredMount>

      {/* Auth Modal (Login / Register) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Video Preview Modal */}
      <PreviewModal
        isOpen={isPreviewOpen}
        previewData={previewData}
        onClose={handleClosePreview}
        onConfirmStart={(videoId, targetPos, sLang, tLang) => {
          executeLoadLesson(videoId, sLang, tLang, targetPos);
        }}
      />

      {/* Questions Sidebar Drawer */}
      <QuestionsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        totalChallenges={currentLesson?.total_challenges || 0}
        currentIndex={currentIndex}
        progressMap={progressMap}
        maxReachedIndex={maxReachedIndex}
        onRestartLesson={handleRestartLesson}
        onReloadSubtitles={handleReloadSubtitles}
        onSelectQuestion={(pos) => goToChallenge(pos - 1)}
      />

      {/* Settings Modal */}
      <DeferredMount when={isSettingsOpen}>
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          onUpdateSetting={updateSetting}
          onResetSettings={resetSettings}
        />
      </DeferredMount>

      {/* Shortcuts Modal */}
      <DeferredMount when={isShortcutsOpen}>
        <ShortcutsModal
          isOpen={isShortcutsOpen}
          onClose={() => setIsShortcutsOpen(false)}
        />
      </DeferredMount>

      {/* Lesson Complete Celebration Modal */}
      <DeferredMount when={isLessonCompleteModalOpen}>
        <LessonCompleteModal
          isOpen={isLessonCompleteModalOpen}
          onClose={() => setIsLessonCompleteModalOpen(false)}
          lesson={currentLesson}
          streak={{ current_streak: streak }}
          onRestartLesson={handleRestartLesson}
          onViewTranscript={() => {
            setIsLessonCompleteModalOpen(false);
            setActiveTab("tab-transcript");
          }}
          onOpenVocab={() => {
            setIsLessonCompleteModalOpen(false);
            setActiveTab("tab-vocab");
          }}
        />
      </DeferredMount>

      {/* Microphone Permission Guide Modal */}
      <DeferredMount when={isMicPermissionModalOpen}>
        <MicrophonePermissionModal
          isOpen={isMicPermissionModalOpen}
          onClose={() => setIsMicPermissionModalOpen(false)}
          onRetry={() => {
            setIsMicPermissionModalOpen(false);
            handleToggleMic();
          }}
        />
      </DeferredMount>

      {/* Video Load Error Modal */}
      <DeferredMount when={Boolean(videoErrorData)}>
        <VideoErrorModal
          isOpen={Boolean(videoErrorData)}
          onClose={() => setVideoErrorData(null)}
          errorData={videoErrorData}
          onSwitchToAudioStudio={() => {
            setVideoErrorData(null);
            setActiveTab("tab-audio-studio");
          }}
          onOpenPresets={() => {
            setVideoErrorData(null);
            const presetsEl = document.querySelector(".presets-section");
            if (presetsEl) {
              presetsEl.scrollIntoView({ behavior: "smooth" });
            }
          }}
        />
      </DeferredMount>
    </div>
  );
}
