import React, { useState, useEffect, useRef, useMemo } from "react";
import { Header } from "./components/Header/Header";
import { PlayerCard } from "./components/Player/PlayerCard";
import { DictationStudio } from "./components/Dictation/DictationStudio";
import { PresetsSection } from "./components/Presets/PresetsSection";
import { QuestionsDrawer } from "./components/Drawer/QuestionsDrawer";
import { SettingsModal } from "./components/Modals/SettingsModal";
import { ShortcutsModal } from "./components/Modals/ShortcutsModal";
import { TranscriptPage } from "./pages/TranscriptPage";

import { useTheme } from "./hooks/useTheme";
import { useSettings } from "./hooks/useSettings";
import { useShortcuts } from "./hooks/useShortcuts";

import { fetchLesson, fetchVideoLanguages } from "./services/api";
import { YouTubePlayerController } from "./services/youtubePlayer";
import { SpeechRecognitionService } from "./services/speechRecognition";

import { getNextLetterHint, getNextWordHint } from "./utils/diffCalculator";
import { loadLessonProgress, saveLessonProgress, getStorageItem } from "./utils/storage";
import { SPEECH_LANG_MAP } from "./constants/languages";

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { settings, updateSetting, resetSettings } = useSettings();

  // Navigation & Modal State
  const [activeTab, setActiveTab] = useState("tab-dictation");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Lesson & Player State
  const [urlInput, setUrlInput] = useState(() => getStorageItem("lastUrl", "https://www.youtube.com/watch?v=qe9QSCF-d88"));
  const [sourceLang, setSourceLang] = useState(settings.sourceLang || "auto");
  const [targetLang, setTargetLang] = useState(settings.targetLang || "vi");
  const [autoDetectedLang, setAutoDetectedLang] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmbedRestricted, setIsEmbedRestricted] = useState(false);

  const [currentLesson, setCurrentLesson] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0); // Always start from Question 1
  const [userInput, setUserInput] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [progressMap, setProgressMap] = useState({});
  const [isListening, setIsListening] = useState(false);

  // Controller Refs
  const playerRef = useRef(null);
  const speechRef = useRef(null);

  // Instantiate Player Controller once
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
    }
  }, [settings, playerController]);

  // Initialize Speech Recognition
  useEffect(() => {
    speechRef.current = new SpeechRecognitionService(
      (transcript) => setUserInput(transcript),
      (status) => setIsListening(status)
    );
  }, []);

  // Update YouTube embed restriction callback
  useEffect(() => {
    if (playerController) {
      playerController.onEmbedRestricted = () => setIsEmbedRestricted(true);
    }
  }, [playerController]);

  // Load Lesson Handler (Explicitly pass source & target lang to avoid React state race condition)
  const handleLoadLesson = async (urlOrId, reqSourceLang, reqTargetLang) => {
    if (!urlOrId || isLoading) return;
    setIsLoading(true);
    setIsEmbedRestricted(false);

    const sLang = reqSourceLang !== undefined ? reqSourceLang : sourceLang;
    const tLang = reqTargetLang !== undefined ? reqTargetLang : targetLang;

    try {
      // Check detected source languages asynchronously
      fetchVideoLanguages(urlOrId).then((langData) => {
        if (langData && langData.detected_source_lang) {
          setAutoDetectedLang(langData.detected_source_lang);
        }
      });

      const lessonData = await fetchLesson({
        urlOrId,
        sourceLang: sLang,
        targetLang: tLang,
      });

      setCurrentLesson(lessonData);
      setCurrentIndex(0); // Always start from 0 (Question 1)
      setUserInput("");
      setIsCompleted(false);

      // Load progress map for sidebar drawer indicators
      const prog = loadLessonProgress(lessonData.video_id);
      setProgressMap(prog);

      // Setup Player & Speech Recognition
      const detected = lessonData.detected_source_lang || "en";
      playerController.setSourceLang(detected);
      if (speechRef.current) {
        const langCode = SPEECH_LANG_MAP[detected.toLowerCase()] || "en-US";
        speechRef.current.setLang(langCode);
      }

      playerController.loadVideo(lessonData.video_id);
      playChallengeAtIndex(lessonData, 0);
    } catch (e) {
      alert("Lỗi tải video: " + e.message);
    } finally {
      setIsLoading(false);
    }
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
    setUserInput("");
    setIsCompleted(false);
    playChallengeAtIndex(currentLesson, index);
  };

  const currentChallenge = useMemo(() => {
    return currentLesson?.challenges?.[currentIndex] || null;
  }, [currentLesson, currentIndex]);

  const enterTrackerRef = useRef({ count: 0, lastTime: 0, lastInput: "" });

  // Actions
  const handleCheck = () => {
    if (!currentChallenge) return;

    // If sentence is already marked completed, hitting Enter / clicking Check immediately advances to next challenge
    if (isCompleted) {
      enterTrackerRef.current = { count: 0, lastTime: 0, lastInput: "" };
      if (currentIndex < (currentLesson?.challenges?.length || 0) - 1) {
        goToChallenge(currentIndex + 1);
      }
      return;
    }

    const evalResult = evaluateMasked(currentChallenge.text, userInput, settings.strictPunctuation);

    if (evalResult.isCompleted) {
      enterTrackerRef.current = { count: 0, lastTime: 0, lastInput: "" };
      setIsCompleted(true);
      if (currentLesson) {
        const newProg = { ...progressMap };
        if (!newProg.challenges) newProg.challenges = {};
        newProg.challenges[currentIndex + 1] = { isCompleted: true, lastUpdated: Date.now() };
        setProgressMap(newProg);
        saveLessonProgress(currentLesson.video_id, newProg);
      }

      if (settings.autoAdvance === "yes" && currentIndex < (currentLesson?.challenges?.length || 0) - 1) {
        setTimeout(() => {
          goToChallenge(currentIndex + 1);
        }, 800);
      }
    } else {
      const now = Date.now();
      const tracker = enterTrackerRef.current;

      if (now - tracker.lastTime < 1500 && tracker.lastInput === userInput) {
        tracker.count += 1;
      } else {
        tracker.count = 1;
      }
      tracker.lastTime = now;

      if (tracker.count >= 2) {
        // 2nd consecutive Enter: auto trigger 1 letter hint!
        handleHintLetter();
        tracker.count = 0;
      } else {
        tracker.lastInput = userInput;
        // 1st Enter: Replay audio segment so user can listen again
        playerController.replayCurrentSegment();
      }
    }
  };

  const handleSkip = () => {
    if (!currentChallenge) return;
    setUserInput(currentChallenge.text);
    setIsCompleted(true);
  };

  const handleHintLetter = () => {
    if (!currentChallenge) return;
    setUserInput((prev) => getNextLetterHint(currentChallenge.text, prev));
  };

  const handleHintWord = () => {
    if (!currentChallenge) return;
    setUserInput((prev) => getNextWordHint(currentChallenge.text, prev));
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
    onCheck: handleCheck,
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
        onLoadLesson={(url) => handleLoadLesson(url, sourceLang, targetLang)}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <main className="main-container">
        {/* Navigation Tabs Header */}
        <div className="tabs-header">
          <div className="tabs-nav-group">
            <button
              className={`tab-btn ${activeTab === "tab-dictation" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("tab-dictation");
                if (currentLesson) playChallengeAtIndex(currentLesson, currentIndex);
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

        {/* Tab 1: Dictation Practice (Kept mounted via CSS display to preserve YouTube Player DOM) */}
        <div style={{ display: activeTab === "tab-dictation" ? "block" : "none" }}>
          <div className="exercise-grid">
            <PlayerCard
              playerController={playerController}
              isEmbedRestricted={isEmbedRestricted}
              currentSentenceText={currentChallenge?.text}
              sourceLang={sourceLang}
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
              isListening={isListening}
              onToggleMic={handleToggleMic}
              onCheck={handleCheck}
              onSkip={handleSkip}
              onReplay={() => playerController.replayCurrentSegment()}
              onSpeakSentence={handleSpeakSentence}
              onHintLetter={handleHintLetter}
              onHintWord={handleHintWord}
              onPrev={() => goToChallenge(currentIndex - 1)}
              onNext={() => goToChallenge(currentIndex + 1)}
              onOpenDrawer={() => setIsDrawerOpen(true)}
              isCompleted={isCompleted}
              strictPunctuation={settings.strictPunctuation}
              onNextChallenge={() => goToChallenge(currentIndex + 1)}
              onRetryChallenge={() => {
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
              setUrlInput(preset.url);
              setSourceLang(preset.sourceLang);
              setTargetLang(preset.targetLang);
              updateSetting("sourceLang", preset.sourceLang);
              updateSetting("targetLang", preset.targetLang);
              handleLoadLesson(preset.url, preset.sourceLang, preset.targetLang);
            }}
          />
        </div>

        {/* Tab 2: Transcript & Full Audio */}
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
      </main>

      {/* Questions Sidebar Drawer */}
      <QuestionsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        totalChallenges={currentLesson?.total_challenges || 0}
        currentIndex={currentIndex}
        progressMap={progressMap}
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
