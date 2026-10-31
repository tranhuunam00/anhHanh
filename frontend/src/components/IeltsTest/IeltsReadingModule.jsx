import React, { useState } from "react";
import { IeltsSplitPane } from "./IeltsSplitPane.jsx";
import { IeltsQuestionPalette } from "./IeltsQuestionPalette.jsx";
import {
  renderPassage1Questions,
  renderPassage2Questions,
  renderPassage3Questions
} from "./IeltsReadingQuestionsViews.jsx";

/**
 * IELTS Academic Reading Test Module
 * Left pane: Reading Passage text (Passages 1, 2, 3)
 * Right pane: Questions with independent scrolling & synchronized height
 */
export const IeltsReadingModule = ({
  readingData,
  answers = {},
  onAnswerChange,
  evaluation = null,
  isReview = false
}) => {
  const [activePassage, setActivePassage] = useState(1);
  const passages = readingData?.passages || [];
  const currentPassage = passages.find((p) => p.passageNumber === activePassage) || passages[0];

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

  // Left Pane: Passage Text with Passage Switcher
  const leftPaneContent = (
    <div className="ielts-left-scroll-pane ielts-reading-text-pane">
      {/* Passage Selector Tabs */}
      <div className="ielts-reading-nav-tabs">
        {passages.map((p) => (
          <button
            key={p.passageNumber}
            type="button"
            className={`ielts-part-tab-btn ${activePassage === p.passageNumber ? "active" : ""}`}
            onClick={() => setActivePassage(p.passageNumber)}
          >
            Passage {p.passageNumber}
            <span className="ielts-tab-subrange">Q{p.questionsRange[0]}-{p.questionsRange[1]}</span>
          </button>
        ))}
      </div>

      {/* Passage Body */}
      {currentPassage && (
        <article className="ielts-passage-article">
          <header className="ielts-passage-header">
            <span className="ielts-badge">READING PASSAGE {currentPassage.passageNumber}</span>
            <h2 className="ielts-passage-title">{currentPassage.title}</h2>
            {currentPassage.subtitle && (
              <p className="ielts-passage-subtitle">{currentPassage.subtitle}</p>
            )}
          </header>

          <div className="ielts-passage-content">
            {currentPassage.paragraphs ? (
              // Structured paragraphs with letters (Passage 2)
              currentPassage.paragraphs.map((para) => (
                <div key={para.id} className="ielts-paragraph-block">
                  <span className="ielts-paragraph-label">{para.id}</span>
                  <p className="ielts-paragraph-text">{para.text}</p>
                </div>
              ))
            ) : (
              // Continuous text with linebreaks (Passage 1 & 3)
              currentPassage.text?.split("\n\n").map((para, idx) => (
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
      <div className="ielts-reading-questions-header">
        <h4 className="ielts-pane-header-title">
          Câu hỏi Passage {activePassage} (Q{currentPassage?.questionsRange[0]} - Q{currentPassage?.questionsRange[1]})
        </h4>
      </div>

      <div className="ielts-questions-body">
        {activePassage === 1 &&
          renderPassage1Questions(currentPassage.groups, answers, handleInputChange, evaluation, isReview)}
        {activePassage === 2 &&
          renderPassage2Questions(currentPassage.groups, answers, handleInputChange, handleChooseTwoToggle, evaluation, isReview)}
        {activePassage === 3 &&
          renderPassage3Questions(currentPassage.groups, answers, handleInputChange, evaluation, isReview)}
      </div>

      <IeltsQuestionPalette
        totalQuestions={40}
        answers={answers}
        evaluation={evaluation}
        onSelectQuestion={(num) => {
          if (num <= 13) setActivePassage(1);
          else if (num <= 26) setActivePassage(2);
          else setActivePassage(3);
        }}
        className="ielts-reading-palette-footer"
      />
    </div>
  );

  return (
    <IeltsSplitPane
      leftPane={leftPaneContent}
      rightPane={rightPaneContent}
      storageKey="ielts_split_reading"
      className="ielts-reading-split"
    />
  );
};

