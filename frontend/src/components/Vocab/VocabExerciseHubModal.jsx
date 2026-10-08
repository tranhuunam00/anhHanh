import React, { useState, useCallback } from "react";
import { submitVocabReviewResult, fetchPracticeSession } from "../../services/authVocabService";
import { EXERCISE_FORMATS } from "../../utils/vocabExerciseGenerators";
import { VocabExerciseMenu } from "./Exercise/VocabExerciseMenu";
import { VocabExercisePractice } from "./Exercise/VocabExercisePractice";
import { VocabExerciseSummary } from "./Exercise/VocabExerciseSummary";
import "./VocabExerciseHubModal.css";

export default function VocabExerciseHubModal({
  vocabPool = [],
  token = null,
  onClose,
  onFinished,
}) {
  // Navigation View: "MENU" (Card selection) | "PRACTICE" (Interactive session) | "SUMMARY" (Results)
  const [viewMode, setViewMode] = useState("MENU");

  // Selected format: D1 (Từ vựng -> Nghĩa VN) or D2 (Nghĩa VN -> Từ vựng)
  const [selectedFormat, setSelectedFormat] = useState(EXERCISE_FORMATS.D1);

  // Selected word quantity: 20, 40, 60, 80 or "ALL"
  const [selectedLimit, setSelectedLimit] = useState(20);
  const [isLoadingSession, setIsLoadingSession] = useState(false);

  // Active practice session words and score tracking
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [resultsHistory, setResultsHistory] = useState([]);

  const currentItem = items[currentIndex];

  // Start practice session with selected format & quantity
  const handleStartPractice = async () => {
    setIsLoadingSession(true);
    try {
      let sessionWords = [];

      // 1. If user is authenticated, request BE to randomly sample
      if (token) {
        const limitParam = selectedLimit === "ALL" ? null : selectedLimit;
        const res = await fetchPracticeSession(limitParam, "ALL", token);
        if (res && Array.isArray(res.items) && res.items.length > 0) {
          sessionWords = res.items;
        }
      }

      // 2. Fallback to client pool if not logged in or BE returned empty
      if (sessionWords.length === 0 && vocabPool && vocabPool.length > 0) {
        let poolCopy = [...vocabPool];
        poolCopy.sort(() => Math.random() - 0.5);

        if (selectedLimit !== "ALL" && typeof selectedLimit === "number") {
          sessionWords = poolCopy.slice(0, selectedLimit);
        } else {
          sessionWords = poolCopy;
        }
      }

      if (sessionWords.length === 0) {
        alert("Sổ tay của bạn chưa có từ vựng nào để luyện tập!");
        setIsLoadingSession(false);
        return;
      }

      setItems(sessionWords);
      setCurrentIndex(0);
      setScore(0);
      setCombo(0);
      setMaxCombo(0);
      setResultsHistory([]);
      setViewMode("PRACTICE");
    } catch (err) {
      console.error("Error starting practice session:", err);
      if (vocabPool.length > 0) {
        const shuffled = [...vocabPool].sort(() => Math.random() - 0.5);
        const limitCount =
          selectedLimit === "ALL"
            ? shuffled.length
            : Math.min(selectedLimit, shuffled.length);
        setItems(shuffled.slice(0, limitCount));
        setCurrentIndex(0);
        setScore(0);
        setCombo(0);
        setMaxCombo(0);
        setResultsHistory([]);
        setViewMode("PRACTICE");
      }
    } finally {
      setIsLoadingSession(false);
    }
  };

  // Handle proceeding after answering a question
  const handleProceed = useCallback(
    async (correct, selectedOpt) => {
      if (correct) {
        setScore((s) => s + 1);
        setCombo((c) => {
          const next = c + 1;
          setMaxCombo((m) => Math.max(m, next));
          return next;
        });
      } else {
        setCombo(0);
      }

      // Sync SRS progress to backend if authenticated
      if (token && currentItem && currentItem.id) {
        try {
          await submitVocabReviewResult(currentItem.id, correct, token);
        } catch (err) {
          console.debug("SRS result sync skipped:", err);
        }
      }

      // Record in local history
      if (currentItem) {
        setResultsHistory((prev) => [
          ...prev,
          {
            id: currentItem.id,
            word: currentItem.word,
            meaning: currentItem.meaning,
            phonetic: currentItem.phonetic,
            source_lang: currentItem.source_lang,
            isCorrect: correct,
            selectedOption: selectedOpt,
          },
        ]);
      }

      // Move to next word or finish
      if (currentIndex + 1 < items.length) {
        setCurrentIndex((i) => i + 1);
      } else {
        setViewMode("SUMMARY");
        if (onFinished) onFinished();
      }
    },
    [currentIndex, currentItem, items.length, onFinished, token]
  );

  // Restart practice session with current items
  const handleRestart = () => {
    setItems((prev) => [...prev].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setResultsHistory([]);
    setViewMode("PRACTICE");
  };

  // Back to Menu view
  const handleBackToMenu = () => {
    setViewMode("MENU");
  };

  // View 1: Menu selection
  if (viewMode === "MENU") {
    return (
      <VocabExerciseMenu
        totalWords={vocabPool.length}
        selectedFormat={selectedFormat}
        onSelectFormat={setSelectedFormat}
        selectedLimit={selectedLimit}
        onSelectLimit={setSelectedLimit}
        onStart={handleStartPractice}
        isLoading={isLoadingSession}
        onClose={onClose}
      />
    );
  }

  // View 2: Summary results
  if (viewMode === "SUMMARY") {
    return (
      <VocabExerciseSummary
        score={score}
        totalCount={items.length}
        maxCombo={maxCombo}
        resultsHistory={resultsHistory}
        onBackToMenu={handleBackToMenu}
        onRestart={handleRestart}
        onClose={onClose}
      />
    );
  }

  // View 3: Practice interactive arena
  return (
    <VocabExercisePractice
      format={selectedFormat}
      items={items}
      currentIndex={currentIndex}
      score={score}
      combo={combo}
      onProceed={handleProceed}
      onBackToMenu={handleBackToMenu}
      onClose={onClose}
    />
  );
}
