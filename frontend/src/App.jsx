import React, { useState, useEffect, useRef, useMemo } from "react";
import { Header } from "./components/Header/Header";
import { PlayerCard } from "./components/Player/PlayerCard";
import { DictationStudio } from "./components/Dictation/DictationStudio";
import { PresetsSection } from "./components/Presets/PresetsSection";
import { QuestionsDrawer } from "./components/Drawer/QuestionsDrawer";
import { SettingsModal } from "./components/Modals/SettingsModal";
import { ShortcutsModal } from "./components/Modals/ShortcutsModal";
import { AuthModal } from "./components/Modals/AuthModal";
import { PreviewModal } from "./components/Modals/PreviewModal";
import { FeedbackModal } from "./components/Modals/FeedbackModal";
import { AdminPortal } from "./components/Admin/AdminPortal";
import { VocabTab } from "./components/Vocab/VocabTab";
import { HistoryTab } from "./components/History/HistoryTab";
import { FloatingVocabSaver } from "./components/Vocab/FloatingVocabSaver";
import { Footer } from "./components/Footer/Footer";
import { TranscriptPage } from "./pages/TranscriptPage";
import "./styles/admin-and-feedback.css";

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
import { YouTubePlayerController } from "./services/youtubePlayer";
import { SpeechRecognitionService } from "./services/speechRecognition";

import { evaluateMasked, getNextLetterHint, getNextWordHint } from "./utils/diffCalculator";
import { loadLessonProgress, saveLessonProgress, getStorageItem, setStorageItem } from "./utils/storage";
import { extractYouTubeId, toCanonicalYouTubeUrl } from "./utils/textNormalizer";
import { SPEECH_LANG_MAP } from "./constants/languages";

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { settings, updateSetting, resetSettings } = useSettings();
  const { token, user, refreshStreak, showToast } = useAuth();

  // Navigation & Modal State
  const [activeTab, setActiveTab] = useState("tab-dictation");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
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
  const [isCompleted, setIsCompleted] = useState(false);
  const [progressMap, setProgressMap] = useState({});
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Controller Refs
  const playerRef = useRef(null);
  const speechRef = useRef(null);

  if (!playerRef.current) {
    playerRef.current = new YouTubePlayerController("youtube-player");
  }
  const playerController = playerRef.current;

  // Sync settings with player controller
  useEffect(() => {
    if (playerController) {
      playerController.setLooping(settings.autoReplay === "yes");
      playerController.setReplayInterval(settings.replayInterval);
      playerController.setAudioPadding(settings.audioPadding);
      playerController.onStateChange((playing) => setIsPlaying(playing));
    }
  }, [settings, playerController]);

  // Initialize Speech Recognition
  useEffect(() => {
    speechRef.current = new SpeechRecognitionService(
      (transcript) => {
        userInputRef.current = transcript;
        setUserInput(transcript);
      },
      (status) => setIsListening(status)
    );
  }, []);

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

    const sLang = reqSourceLang !== undefined ? reqSourceLang : sourceLang;
    const tLang = reqTargetLang !== undefined ? reqTargetLang : targetLang;

    try {
      // Async language detection check
      fetchVideoLanguages(urlOrId).then((langData) => {
        if (langData && langData.detected_source_lang) {
          setAutoDetectedLang(langData.detected_source_lang);
        }
      });

      const preview = await fetchLessonPreview(urlOrId, sLang, tLang, token);
      setPreviewData(preview);
      setIsPreviewOpen(true);
    } catch (e) {
      // If preview fails, fall back to direct load
      console.warn("Preview failed, falling back to direct load:", e);
      await executeLoadLesson(urlOrId, sLang, tLang, 0);
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
  const executeLoadLesson = async (urlOrId, reqSourceLang, reqTargetLang, startPos = 0) => {
    setIsLoading(true);
    setIsEmbedRestricted(false);

    const sLang = reqSourceLang !== undefined ? reqSourceLang : sourceLang;
    const tLang = reqTargetLang !== undefined ? reqTargetLang : targetLang;

    try {
      const lessonData = await fetchLesson({
        urlOrId,
        sourceLang: sLang,
        targetLang: tLang,
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

      // 7. CRITICAL: Load video FIRST in the player controller so it points to the new video ID
      const targetChallenge = lessonData.challenges && lessonData.challenges[targetIndex];
      const targetStartTime = targetChallenge ? targetChallenge.time_start : 0;
      playerController.loadVideo(lessonData.video_id, targetStartTime, true);

      // 8. THEN play the segment boundaries for this target index (autoplay from resume position)
      playChallengeAtIndex(lessonData, targetIndex);
    } catch (e) {
      alert("Lỗi tải video: " + e.message);
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

  // Play segment for challenge at specific index
  const playChallengeAtIndex = (lessonObj, index) => {
    if (!lessonObj || !lessonObj.challenges || !lessonObj.challenges[index]) return;
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

  // Navigate to specific challenge index
  const goToChallenge = (index) => {
    if (!currentLesson || index < 0 || index >= currentLesson.challenges.length) return;
    setCurrentIndex(index);
    playChallengeAtIndex(currentLesson, index);

    // If user goes back to a previously reached sentence: auto-fill and mark completed!
    // User requirement: "các câu trước đó mặc định đã điền, chỉ cần quan tâm đang đến câu nào thôi, cái đáp án đó tự fill"
    if (index < maxReachedIndex) {
      const challengeText = currentLesson.challenges[index].text;
      userInputRef.current = challengeText;
      setUserInput(challengeText);
      setIsCompleted(true);
    } else {
      userInputRef.current = "";
      setUserInput("");
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
    userInputRef.current = "";
    setUserInput("");
    setIsCompleted(false);

    const sL = currentLesson.source_lang || sourceLang;
    const tL = currentLesson.target_lang || targetLang;
    const newProg = { challenges: {}, lastPosition: 1 };
    setProgressMap(newProg);
    saveLessonProgress(currentLesson.video_id, newProg, sL, tL);
    updateLessonProgress(currentLesson.video_id, 1, false, token, 0, sL, tL);
    playChallengeAtIndex(currentLesson, 0);
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
      }
      return;
    }

    const currentVal = typeof inputOverride === "string" ? inputOverride : (userInputRef.current || userInput);
    const evalResult = evaluateMasked(currentChallenge.text, currentVal, settings.strictPunctuation);

    if (evalResult.isCompleted) {
      enterTrackerRef.current = { count: 0, lastTime: 0, lastInput: "" };
      setIsCompleted(true);
      userInputRef.current = currentVal;
      setUserInput(currentVal);

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

      if (settings.autoAdvance === "yes" && currentIndex < (currentLesson?.challenges?.length || 0) - 1) {
        setTimeout(() => {
          goToChallenge(currentIndex + 1);
        }, 800);
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
    userInputRef.current = currentChallenge.text;
    setUserInput(currentChallenge.text);
    setIsCompleted(true);

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

    updateLessonProgress(currentLesson.video_id, nextPos, false, token, 0, sL, tL);
  };

  const handleHintLetter = () => {
    if (!currentChallenge) return;
    const currentVal = userInputRef.current || userInput;
    const nextVal = getNextLetterHint(currentChallenge.text, currentVal, settings.strictPunctuation);
    userInputRef.current = nextVal;
    setUserInput(nextVal);
  };

  const handleHintWord = () => {
    if (!currentChallenge) return;
    const currentVal = userInputRef.current || userInput;
    const nextVal = getNextWordHint(currentChallenge.text, currentVal);
    userInputRef.current = nextVal;
    setUserInput(nextVal);
  };

  const handleSpeakSentence = () => {
    if (currentChallenge) {
      playerController.speakText(currentChallenge.text, currentLesson?.detected_source_lang);
    }
  };

  const handleToggleMic = () => {
    if (speechRef.current) {
      speechRef.current.toggle();
    }
  };

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
    enabled: activeTab === "tab-dictation",
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
        onLoadLesson={(url) => handleRequestPreview(url, sourceLang, targetLang)}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenVocabTab={() => setActiveTab("tab-vocab")}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        onOpenAdminTab={() => setActiveTab("tab-admin")}
      />

      <main className="main-container">
        {/* Navigation Tabs Header */}
        <div className="tabs-header">
          <div className="tabs-nav-group">
            <button
              className={`tab-btn ${activeTab === "tab-dictation" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("tab-dictation");
                if (currentLesson) cueChallengeAtIndex(currentLesson, currentIndex);
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              <span>Luyện chép chính tả (Dictation)</span>
            </button>

            <button
              className={`tab-btn ${activeTab === "tab-transcript" ? "active" : ""}`}
              onClick={() => setActiveTab("tab-transcript")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              <span>Toàn bộ bài nghe & Transcript</span>
            </button>

            <button
              className={`tab-btn ${activeTab === "tab-vocab" ? "active" : ""}`}
              onClick={() => setActiveTab("tab-vocab")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <span>Sổ tay từ vựng</span>
            </button>

            <button
              className={`tab-btn ${activeTab === "tab-history" ? "active" : ""}`}
              onClick={() => setActiveTab("tab-history")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>Lịch sử học tập</span>
            </button>

            {user?.role === "ADMIN" && (
              <button
                className={`tab-btn ${activeTab === "tab-admin" ? "active" : ""}`}
                onClick={() => setActiveTab("tab-admin")}
                style={{ borderColor: "#38bdf8" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                <span>Quản trị</span>
              </button>
            )}

            <button
              className={`tab-btn ${activeTab === "tab-shortcuts" ? "active" : ""}`}
              onClick={() => setIsShortcutsOpen(true)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M6 8h.001M10 8h.001M14 8h.001M18 8h.001M8 12h.001M12 12h.001M16 12h.001M6 16h12" />
              </svg>
              <span>Phím tắt</span>
            </button>
          </div>

          <button
            className="btn btn-secondary btn-with-icon"
            style={{ fontSize: "0.85rem", padding: "7px 14px" }}
            onClick={() => setIsSettingsOpen(true)}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            <span>Cài đặt</span>
          </button>
        </div>

        {/* TAB 1: Dictation Practice */}
        <div style={{ display: activeTab === "tab-dictation" ? "block" : "none" }}>
          <div className="exercise-grid">
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

            <DictationStudio
              currentChallenge={currentChallenge}
              currentIndex={currentIndex}
              totalChallenges={currentLesson?.total_challenges || 0}
              userInput={userInput}
              setUserInput={setUserInput}
              onInputChange={(val) => {
                userInputRef.current = val;
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
              isCompleted={isCompleted}
              strictPunctuation={settings.strictPunctuation}
              onNextChallenge={() => goToChallenge(currentIndex + 1)}
              onRetryChallenge={() => {
                userInputRef.current = "";
                setUserInput("");
                setIsCompleted(false);
                playerController.replayCurrentSegment();
              }}
            />
          </div>

          <PresetsSection
            activeUrl={urlInput}
            isLoading={isLoading}
            onSelectPreset={(preset) => {
              handleRequestPreview(preset.url, preset.sourceLang, preset.targetLang);
            }}
          />
        </div>

        {/* TAB 2: Transcript & Full Audio */}
        <div style={{ display: activeTab === "tab-transcript" ? "block" : "none" }}>
          <TranscriptPage
            lesson={currentLesson}
            playerController={playerController}
            onGoToChallenge={(pos) => {
              setActiveTab("tab-dictation");
              goToChallenge(pos - 1);
            }}
          />
        </div>

        {/* TAB 3: Smart Vocabulary Notebook */}
        <div style={{ display: activeTab === "tab-vocab" ? "block" : "none" }}>
          <VocabTab isActive={activeTab === "tab-vocab"} />
        </div>

        {/* TAB 4: Study History */}
        <div style={{ display: activeTab === "tab-history" ? "block" : "none" }}>
          <HistoryTab
            isActive={activeTab === "tab-history"}
            onSelectLesson={(videoId, targetPos, srcLang, tgtLang) => {
              setActiveTab("tab-dictation");
              executeLoadLesson(videoId, srcLang, tgtLang, targetPos);
            }}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        </div>

        {/* TAB 5: Admin Management Portal */}
        {user?.role === "ADMIN" && (
          <div style={{ display: activeTab === "tab-admin" ? "block" : "none" }}>
            <AdminPortal user={user} token={token} showToast={showToast} />
          </div>
        )}
      </main>

      {/* Professional ShotLang Footer */}
      <Footer
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
      />

      {/* Floating Vocab Selection Saver Tooltip */}
      <FloatingVocabSaver
        currentSentence={currentChallenge?.text || ""}
        currentVideoId={currentLesson?.video_id || ""}
        currentTimestamp={currentChallenge?.time_start || 0}
        sourceLang={currentLesson?.source_lang || sourceLang || "en"}
        targetLang={targetLang || "vi"}
      />

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        user={user}
        token={token}
        onOpenAuth={() => setIsAuthOpen(true)}
        showToast={showToast}
      />

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
        onSelectQuestion={(pos) => goToChallenge(pos - 1)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSetting={updateSetting}
        onResetSettings={resetSettings}
      />

      {/* Shortcuts Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}
