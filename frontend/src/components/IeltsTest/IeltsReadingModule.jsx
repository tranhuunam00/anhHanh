import React, { useState, useMemo } from "react";
import { isSingleLetterLabel } from "./ieltsFeedbackHelpers.jsx";
import { gradeReadingTest } from "../../utils/ieltsScoring.js";
import { IeltsSplitPane } from "./IeltsSplitPane.jsx";
import { IeltsQuestionPalette } from "./IeltsQuestionPalette.jsx";
import {
  renderPassage1Questions,
  renderPassage2Questions,
  renderPassage3Questions
} from "./IeltsReadingQuestionsViews.jsx";
import {
  renderTest1Passage1Questions,
  renderTest1Passage2Questions,
  renderTest1Passage3Questions
} from "./IeltsReadingTest1QuestionsViews.jsx";
import {
  renderTest3Passage1Questions,
  renderTest3Passage2Questions,
  renderTest3Passage3Questions
} from "./IeltsReadingTest3QuestionsViews.jsx";
import {
  renderTest4Passage1Questions,
  renderTest4Passage2Questions,
  renderTest4Passage3Questions
} from "./IeltsReadingTest4QuestionsViews.jsx";
import {
  renderCam20Test1Passage1Questions,
  renderCam20Test1Passage2Questions,
  renderCam20Test1Passage3Questions
} from "./IeltsReadingCam20Test1QuestionsViews.jsx";
import {
  renderCam20Test2Passage1Questions,
  renderCam20Test2Passage2Questions,
  renderCam20Test2Passage3Questions
} from "./IeltsReadingCam20Test2QuestionsViews.jsx";

/**
 * IELTS Academic Reading Test Module
 * Features:
 * - Single-row Top Navigation & Question Palette: 3 Parts + all 40 questions dàn hàng ngang
 * - Resizable 2-Column Split Pane: Left (Passage text), Right (Questions)
 * - Maximum vertical reading & answering space with ZERO bottom obstruction
 * - Glowing answered indicators with instant scroll
 */
export const IeltsReadingModule = ({
  readingData,
  answers = {},
  onAnswerChange,
  evaluation = null,
  isReview = false
}) => {
  const [activePassage, setActivePassage] = useState(1);
  const [leftPassage, setLeftPassage] = useState(1);
  const [rightPassage, setRightPassage] = useState(1);

  // Live evaluation resolution: heals stale localStorage cache dynamically
  const effectiveEval = useMemo(() => {
    if (!isReview || !readingData) return evaluation;
    try {
      const { evalMap } = gradeReadingTest(readingData, answers);
      return evalMap;
    } catch {
      return evaluation;
    }
  }, [isReview, readingData, answers, evaluation]);

  const passages = readingData?.passages || [];
  const currentLeftPassage = passages.find((p) => p.passageNumber === leftPassage) || passages[0];
  const currentRightPassage = passages.find((p) => p.passageNumber === rightPassage) || passages[0];

  const handleSelectPassage = (num) => {
    setActivePassage(num);
    setLeftPassage(num);
    setRightPassage(num);
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

  // Left Pane: Passage Reading Text (Full vertical height)
  const leftPaneContent = (
    <div className="ielts-left-scroll-pane ielts-reading-text-pane">
      {currentLeftPassage && (
        <article className="ielts-passage-article">
          <header className="ielts-passage-header">
            <span className="ielts-badge">READING PASSAGE {currentLeftPassage.passageNumber} • PART {currentLeftPassage.passageNumber}</span>
            <h2 className="ielts-passage-title">{currentLeftPassage.title}</h2>
            {currentLeftPassage.subtitle && (
              <p className="ielts-passage-subtitle">{currentLeftPassage.subtitle}</p>
            )}
          </header>

          <div className="ielts-passage-content">
            {currentLeftPassage.paragraphs ? (
              currentLeftPassage.paragraphs.map((para) => {
                const isSingleLetter = isSingleLetterLabel(para.id);
                return (
                  <div
                    key={para.id}
                    className={`ielts-paragraph-block ${isSingleLetter ? "has-letter-label" : "has-heading-label"}`}
                  >
                    <span className={`ielts-paragraph-label ${isSingleLetter ? "is-letter" : "is-heading"}`}>
                      {para.id}
                    </span>
                    <p className="ielts-paragraph-text">{para.text}</p>
                  </div>
                );
              })
            ) : (
              currentLeftPassage.text?.split("\n\n").map((para, idx) => (
                <p key={idx} className="ielts-paragraph-text">{para}</p>
              ))
            )}
          </div>
        </article>
      )}
    </div>
  );

  // Right Pane: Questions (Full vertical height)
  const rightPaneContent = (
    <div className="ielts-right-scroll-pane ielts-reading-questions-pane">
      <div className="ielts-questions-body">
        {readingData?.testId === "cambridge-20-test-1" ? (
          <>
            {rightPassage === 1 &&
              renderCam20Test1Passage1Questions(currentRightPassage.groups, answers, handleInputChange, effectiveEval, isReview)}
            {rightPassage === 2 &&
              renderCam20Test1Passage2Questions(currentRightPassage.groups, answers, handleInputChange, effectiveEval, isReview)}
            {rightPassage === 3 &&
              renderCam20Test1Passage3Questions(currentRightPassage.groups, answers, handleInputChange, effectiveEval, isReview)}
          </>
        ) : readingData?.testId === "cambridge-20-test-2" ? (
          <>
            {rightPassage === 1 &&
              renderCam20Test2Passage1Questions(currentRightPassage.groups, answers, handleInputChange, effectiveEval, isReview)}
            {rightPassage === 2 &&
              renderCam20Test2Passage2Questions(currentRightPassage.groups, answers, handleInputChange, handleChooseTwoToggle, effectiveEval, isReview)}
            {rightPassage === 3 &&
              renderCam20Test2Passage3Questions(currentRightPassage.groups, answers, handleInputChange, effectiveEval, isReview)}
          </>
        ) : readingData?.testId === "cambridge-21-test-1" ? (
          <>
            {rightPassage === 1 &&
              renderTest1Passage1Questions(currentRightPassage.groups, answers, handleInputChange, effectiveEval, isReview)}
            {rightPassage === 2 &&
              renderTest1Passage2Questions(currentRightPassage.groups, answers, handleInputChange, effectiveEval, isReview)}
            {rightPassage === 3 &&
              renderTest1Passage3Questions(currentRightPassage.groups, answers, handleInputChange, effectiveEval, isReview)}
          </>
        ) : readingData?.testId === "cambridge-21-test-3" ? (
          <>
            {rightPassage === 1 &&
              renderTest3Passage1Questions(currentRightPassage.groups, answers, handleInputChange, effectiveEval, isReview)}
            {rightPassage === 2 &&
              renderTest3Passage2Questions(currentRightPassage.groups, answers, handleInputChange, effectiveEval, isReview)}
            {rightPassage === 3 &&
              renderTest3Passage3Questions(currentRightPassage.groups, answers, handleInputChange, effectiveEval, isReview)}
          </>
        ) : readingData?.testId === "cambridge-21-test-4" ? (
          <>
            {rightPassage === 1 &&
              renderTest4Passage1Questions(currentRightPassage.groups, answers, handleInputChange, effectiveEval, isReview)}
            {rightPassage === 2 &&
              renderTest4Passage2Questions(currentRightPassage.groups, answers, handleInputChange, effectiveEval, isReview)}
            {rightPassage === 3 &&
              renderTest4Passage3Questions(currentRightPassage.groups, answers, handleInputChange, effectiveEval, isReview)}
          </>
        ) : (
          <>
            {rightPassage === 1 &&
              renderPassage1Questions(currentRightPassage.groups, answers, handleInputChange, effectiveEval, isReview)}
            {rightPassage === 2 &&
              renderPassage2Questions(currentRightPassage.groups, answers, handleInputChange, handleChooseTwoToggle, effectiveEval, isReview)}
            {rightPassage === 3 &&
              renderPassage3Questions(currentRightPassage.groups, answers, handleInputChange, effectiveEval, isReview)}
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="ielts-module-container">
      {/* Sleek Single-Row Top Question Palette (Dàn hàng ngang trên đầu) */}
      <IeltsQuestionPalette
        totalQuestions={40}
        answers={answers}
        evaluation={isReview ? effectiveEval : null}
        skill="reading"
        activePart={activePassage}
        onSelectPart={handleSelectPassage}
        onSelectQuestion={(num) => {
          const targetPassage = num <= 13 ? 1 : num <= 26 ? 2 : 3;
          handleSelectPassage(targetPassage);
        }}
      />

      {/* Resizable 2-Column Split Pane - Fills 100% of remaining vertical height */}
      <IeltsSplitPane
        leftPane={leftPaneContent}
        rightPane={rightPaneContent}
        storageKey="ielts_split_reading"
        className="ielts-reading-split"
      />
    </div>
  );
};
