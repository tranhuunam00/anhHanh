import React, { useState, useMemo } from "react";
import { gradeListeningTest } from "../../utils/ieltsScoring.js";
import { IeltsAudioPlayer } from "./IeltsAudioPlayer.jsx";
import { IeltsQuestionPalette } from "./IeltsQuestionPalette.jsx";
import {
  renderPart1,
  renderPart2,
  renderPart3,
  renderPart4
} from "./IeltsListeningPartsViews.jsx";
import {
  renderTest1Part1,
  renderTest1Part2,
  renderTest1Part3,
  renderTest1Part4
} from "./IeltsListeningTest1PartsViews.jsx";
import {
  renderTest3Part1,
  renderTest3Part2,
  renderTest3Part3,
  renderTest3Part4
} from "./IeltsListeningTest3PartsViews.jsx";
import {
  renderTest4Part1,
  renderTest4Part2,
  renderTest4Part3,
  renderTest4Part4
} from "./IeltsListeningTest4PartsViews.jsx";

/**
 * IELTS Listening Test Module (Exam-Standard Full-Width UI)
 * Features:
 * - Full-Width Question Layout: No distracting left sidebar; questions take 100% full screen
 * - Top Audio Player: Full-width continuous audio strip at the top
 * - Single-row Top Navigation & Question Palette: 4 Parts + all 40 questions dàn hàng ngang
 * - Integrated Map in Part 2 alongside questions 15-20
 * - Glowing answered indicators with instant scroll
 */
export const IeltsListeningModule = ({
  listeningData,
  answers = {},
  onAnswerChange,
  evaluation = null,
  isReview = false
}) => {
  const [activePart, setActivePart] = useState(1);

  // Live evaluation resolution: heals stale localStorage cache dynamically
  const effectiveEval = useMemo(() => {
    if (!isReview || !listeningData) return evaluation;
    try {
      const { evalMap } = gradeListeningTest(listeningData, answers);
      return evalMap;
    } catch {
      return evaluation;
    }
  }, [isReview, listeningData, answers, evaluation]);

  const parts = listeningData?.parts || [];

  const handleSelectPart = (num) => {
    setActivePart(num);
  };

  const handleInputChange = (questionNumber, value) => {
    if (onAnswerChange) {
      onAnswerChange(questionNumber, value);
    }
  };

  const handleChooseTwoToggle = (qNums, letter) => {
    const [q1, q2] = qNums;
    const current = [answers[q1], answers[q2]].filter(Boolean);
    let updated;
    if (current.includes(letter)) {
      updated = current.filter((l) => l !== letter);
    } else {
      if (current.length >= 2) {
        updated = [current[1], letter];
      } else {
        updated = [...current, letter];
      }
    }
    handleInputChange(q1, updated[0] || "");
    handleInputChange(q2, updated[1] || "");
  };

  return (
    <div className="ielts-module-container ielts-listening-full-module">
      {/* Top Bar 1: Continuous Audio Player at the Top */}
      <IeltsAudioPlayer
        audioUrl={listeningData?.audioUrl}
        fallbackAudioUrl={listeningData?.fallbackAudioUrl}
        className="ielts-listening-top-audio"
      />

      {/* Top Bar 2: Sleek Single-Row Top Question Palette (Dàn hàng ngang trên đầu) */}
      <IeltsQuestionPalette
        totalQuestions={40}
        answers={answers}
        evaluation={isReview ? effectiveEval : null}
        skill="listening"
        activePart={activePart}
        onSelectPart={handleSelectPart}
        onSelectQuestion={(num) => {
          const targetPart = num <= 10 ? 1 : num <= 20 ? 2 : num <= 30 ? 3 : 4;
          handleSelectPart(targetPart);
        }}
      />

      {/* Full-Screen Questions Scroll Area */}
      <div className="ielts-listening-full-scroll">
        <div className="ielts-listening-full-body">
          {listeningData?.testId === "cambridge-21-test-1" ? (
            <>
              {activePart === 1 && renderTest1Part1(parts[0], answers, handleInputChange, effectiveEval, isReview)}
              {activePart === 2 && renderTest1Part2(parts[1], answers, handleInputChange, effectiveEval, isReview)}
              {activePart === 3 && renderTest1Part3(parts[2], answers, handleInputChange, handleChooseTwoToggle, effectiveEval, isReview)}
              {activePart === 4 && renderTest1Part4(parts[3], answers, handleInputChange, effectiveEval, isReview)}
            </>
          ) : listeningData?.testId === "cambridge-21-test-3" ? (
            <>
              {activePart === 1 && renderTest3Part1(parts[0], answers, handleInputChange, effectiveEval, isReview)}
              {activePart === 2 && renderTest3Part2(parts[1], answers, handleInputChange, handleChooseTwoToggle, effectiveEval, isReview)}
              {activePart === 3 && renderTest3Part3(parts[2], answers, handleInputChange, handleChooseTwoToggle, effectiveEval, isReview)}
              {activePart === 4 && renderTest3Part4(parts[3], answers, handleInputChange, effectiveEval, isReview)}
            </>
          ) : listeningData?.testId === "cambridge-21-test-4" ? (
            <>
              {activePart === 1 && renderTest4Part1(parts[0], answers, handleInputChange, effectiveEval, isReview)}
              {activePart === 2 && renderTest4Part2(parts[1], answers, handleInputChange, handleChooseTwoToggle, effectiveEval, isReview)}
              {activePart === 3 && renderTest4Part3(parts[2], answers, handleInputChange, effectiveEval, isReview)}
              {activePart === 4 && renderTest4Part4(parts[3], answers, handleInputChange, effectiveEval, isReview)}
            </>
          ) : (
            <>
              {activePart === 1 && renderPart1(parts[0], answers, handleInputChange, effectiveEval, isReview)}
              {activePart === 2 && renderPart2(parts[1], answers, handleInputChange, handleChooseTwoToggle, effectiveEval, isReview)}
              {activePart === 3 && renderPart3(parts[2], answers, handleInputChange, handleChooseTwoToggle, effectiveEval, isReview)}
              {activePart === 4 && renderPart4(parts[3], answers, handleInputChange, effectiveEval, isReview)}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
