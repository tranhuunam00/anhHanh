/**
 * Central registry of code-split screens and modals.
 * Every entry is a memoized loader (see utils/lazyModule.js) so the same
 * chunk can be preloaded on hover/idle and rendered through React.lazy.
 */
import { lazy } from "react";
import { createModuleLoader, preloadFromRegistry } from "../utils/lazyModule";

/** tab id -> loader */
const TAB_PAGE_LOADERS = {
  "tab-transcript": createModuleLoader(() => import("./TranscriptPage"), "TranscriptPage"),
  "tab-vocab": createModuleLoader(() => import("../components/Vocab/VocabTab"), "VocabTab"),
  "tab-history": createModuleLoader(() => import("../components/History/HistoryTab"), "HistoryTab"),
  "tab-audio-studio": createModuleLoader(() => import("./AudioStudioPage"), ["AudioStudioPage", "default"]),
  "tab-reader": createModuleLoader(() => import("./SmartReaderPage"), "SmartReaderPage"),
  "tab-writing": createModuleLoader(() => import("./WritingPage"), "WritingPage"),
  "tab-destination-b2": createModuleLoader(() => import("../components/DestinationB2/DestinationB2Page"), "DestinationB2Page"),
  "tab-visual-vocab": createModuleLoader(() => import("../components/VisualVocab/VisualVocabPage"), "VisualVocabPage"),
  "tab-root-words": createModuleLoader(() => import("../components/RootWords/RootWordsPage"), "RootWordsPage"),
  "tab-ielts-test": createModuleLoader(() => import("./IeltsTestPage"), "IeltsTestPage"),
  "tab-primary": createModuleLoader(() => import("../components/PrimaryKids/PrimaryKidsPage"), "PrimaryKidsPage"),
  "tab-buddy": createModuleLoader(() => import("../components/StudyBuddy/StudyBuddyView"), ["StudyBuddyView", "default"]),
  "tab-tiktok-live": createModuleLoader(() => import("../components/TikTokLive/TikTokLiveStudio"), "TikTokLiveStudio"),
  "tab-admin": createModuleLoader(() => import("../components/Admin/AdminPortal"), "AdminPortal"),
};

/** Modals that are closed on first paint; small ones are warmed up when idle. */
const MODAL_LOADERS = {
  SettingsModal: createModuleLoader(() => import("../components/Modals/SettingsModal"), "SettingsModal"),
  ShortcutsModal: createModuleLoader(() => import("../components/Modals/ShortcutsModal"), "ShortcutsModal"),
  FeedbackModal: createModuleLoader(() => import("../components/Modals/FeedbackModal"), "FeedbackModal"),
  LessonCompleteModal: createModuleLoader(() => import("../components/Modals/LessonCompleteModal"), "LessonCompleteModal"),
  MicrophonePermissionModal: createModuleLoader(() => import("../components/Modals/MicrophonePermissionModal"), "MicrophonePermissionModal"),
  VideoErrorModal: createModuleLoader(() => import("../components/Modals/VideoErrorModal"), "VideoErrorModal"),
};

const IDLE_PRELOAD_MODALS = ["SettingsModal", "ShortcutsModal", "LessonCompleteModal", "VideoErrorModal"];

const toLazyMap = (loaders, keyFn = (k) => k) =>
  Object.fromEntries(Object.entries(loaders).map(([key, loader]) => [keyFn(key), lazy(loader)]));

const TAB_TO_COMPONENT_NAME = {
  "tab-transcript": "TranscriptPage",
  "tab-vocab": "VocabTab",
  "tab-history": "HistoryTab",
  "tab-audio-studio": "AudioStudioPage",
  "tab-reader": "SmartReaderPage",
  "tab-writing": "WritingPage",
  "tab-destination-b2": "DestinationB2Page",
  "tab-visual-vocab": "VisualVocabPage",
  "tab-root-words": "RootWordsPage",
  "tab-ielts-test": "IeltsTestPage",
  "tab-primary": "PrimaryKidsPage",
  "tab-buddy": "StudyBuddyView",
  "tab-tiktok-live": "TikTokLiveStudio",
  "tab-admin": "AdminPortal",
};

/** Lazy page components keyed by component name. */
export const LazyPages = toLazyMap(TAB_PAGE_LOADERS, (tab) => TAB_TO_COMPONENT_NAME[tab]);

/** Lazy modal components keyed by component name. */
export const LazyModals = toLazyMap(MODAL_LOADERS);

/** Best-effort preload of a tab's chunk (hover / focus on its nav button). */
export const preloadTabPage = (tabId) => preloadFromRegistry(TAB_PAGE_LOADERS, tabId);

/** Best-effort preload of light modal chunks (run when the browser is idle). */
export const preloadDeferredModals = () =>
  Promise.all(IDLE_PRELOAD_MODALS.map((name) => preloadFromRegistry(MODAL_LOADERS, name)));
