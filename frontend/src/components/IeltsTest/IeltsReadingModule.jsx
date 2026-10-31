import React, { useState } from "react";
import { BookOpen } from "../../constants/icons.js";
import { IeltsSplitPane } from "./IeltsSplitPane.jsx";
import { IeltsQuestionPalette, isQuestionAnswered } from "./IeltsQuestionPalette.jsx";
import {
  renderPassage1Questions,
  renderPassage2Questions,
  renderPassage3Questions
} from "./IeltsReadingQuestionsViews.jsx";

/**
 * IELTS Academic Reading Test Module
 * Features:
 * - Prominent Top Navigation Bar: Part 1, Part 2, Part 3 with real-time answered counters
 * - Resizable 2-Column Split Pane: Left (Passage text), Right (Questions)
 * - Docked Bottom Question Palette: All 40 questions with bright glowing indicators when answered
 * - Synchronized navigation when switching parts, with independent scroll containers
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

  const getAnsweredCountInRange = (start, end) => {
    let count = 0;
    for (let i = start; i <= end; i++) {
      if (isQuestionAnswered(answers, i)) count++;
    }
    return count;
  };

  // Left Pane: Passage Reading Text
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
              currentLeftPassage.paragraphs.map((para) => (
                <div key={para.id} className="ielts-paragraph-block">
                  <span className="ielts-paragraph-label">{para.id}</span>
                  <p className="ielts-paragraph-text">{para.text}</p>
                </div>
              ))
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

  // Right Pane: Questions
  const rightPaneContent = (
    <div className="ielts-right-scroll-pane ielts-reading-questions-pane">
      <div className="ielts-questions-body">
        {rightPassage === 1 &&
          renderPassage1Questions(currentRightPassage.groups, answers, handleInputChange, evaluation, isReview)}
        {rightPassage === 2 &&
          renderPassage2Questions(currentRightPassage.groups, answers, handleInputChange, handleChooseTwoToggle, evaluation, isReview)}
        {rightPassage === 3 &&
          renderPassage3Questions(currentRightPassage.groups, answers, handleInputChange, evaluation, isReview)}
      </div>
    </div>
  );

  return (
    <div className="ielts-module-container">
      {/* Prominent Full-Width Top Bar for the 3 Reading Parts */}
      <div className="ielts-module-top-bar">
        <div className="ielts-module-nav-title">
          <BookOpen className="w-4 h-4 text-primary mr-1" />
          <span>IELTS Reading (3 Parts):</span>
        </div>
        <div className="ielts-module-parts-tabs">
          {passages.map((p) => {
            const [qStart, qEnd] = p.questionsRange;
            const totalInPart = qEnd - qStart + 1;
            const answeredInPart = getAnsweredCountInRange(qStart, qEnd);
            const isActive = activePassage === p.passageNumber;

            return (
              <button
                key={p.passageNumber}
                type="button"
                className={`ielts-main-part-btn ${isActive ? "active" : ""}`}
                onClick={() => handleSelectPassage(p.passageNumber)}
              >
                <span className="ielts-part-badge-tag">Part {p.passageNumber}</span>
                <span>Passage {p.passageNumber}</span>
                <span className="ielts-part-q-range">(Q{qStart}-{qEnd})</span>
                <span className={`ielts-part-progress-pill ${answeredInPart === totalInPart ? "complete" : ""}`}>
                  {answeredInPart}/{totalInPart}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Resizable 2-Column Split Pane */}
      <IeltsSplitPane
        leftPane={leftPaneContent}
        rightPane={rightPaneContent}
        storageKey="ielts_split_reading"
        className="ielts-reading-split"
      />

      {/* Docked Question Palette at Bottom with glowing answered badges */}
      <IeltsQuestionPalette
        totalQuestions={40}
        answers={answers}
        evaluation={evaluation}
        skill="reading"
        onSelectQuestion={(num) => {
          const targetPassage = num <= 13 ? 1 : num <= 26 ? 2 : 3;
          handleSelectPassage(targetPassage);
        }}
        className="ielts-reading-docked-palette"
      />
    </div>
  );
};
