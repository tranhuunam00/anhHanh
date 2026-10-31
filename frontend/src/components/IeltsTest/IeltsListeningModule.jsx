import React, { useState } from "react";
import { IeltsSplitPane } from "./IeltsSplitPane.jsx";
import { IeltsAudioPlayer } from "./IeltsAudioPlayer.jsx";
import { IeltsQuestionPalette } from "./IeltsQuestionPalette.jsx";
import {
  renderPart1,
  renderPart2,
  renderPart3,
  renderPart4
} from "./IeltsListeningPartsViews.jsx";

/**
 * IELTS Listening Test Module
 * Left pane: Audio player & Visual map illustration
 * Right pane: 4 Parts questions with interactive input controls
 */
export const IeltsListeningModule = ({
  listeningData,
  answers = {},
  onAnswerChange,
  evaluation = null,
  isReview = false
}) => {
  const [activePart, setActivePart] = useState(1);
  const parts = listeningData?.parts || [];

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

  // Left Pane: Audio player + Map/Diagram if in Part 2
  const leftPaneContent = (
    <div className="ielts-left-scroll-pane">
      <div className="ielts-pane-section">
        <h3 className="ielts-pane-header-title">🎧 IELTS Listening Player</h3>
        <IeltsAudioPlayer
          audioUrl={listeningData?.audioUrl}
          fallbackAudioUrl={listeningData?.fallbackAudioUrl}
        />
      </div>

      {/* Part 2 Map Visual */}
      <div className="ielts-pane-section ielts-visual-card">
        <div className="ielts-visual-header">
          <span className="ielts-badge">Bản đồ Part 2 (Câu 15-20)</span>
          <h4 className="ielts-visual-title">Melby Coal Mine Site Map</h4>
        </div>
        <div className="ielts-map-image-wrap">
          <img
            src="/images/ielts/cam21_test2_listening_map.png"
            alt="Melby Coal Mine map diagram"
            className="ielts-map-image"
          />
        </div>
        <p className="ielts-visual-hint">
          Đối chiếu các vị trí chữ cái <strong>A - I</strong> trên bản đồ để điền cho câu hỏi 15 - 20 bên phải.
        </p>
      </div>
    </div>
  );

  // Right Pane: Questions
  const rightPaneContent = (
    <div className="ielts-right-scroll-pane">
      {/* Sub-tabs for Parts 1, 2, 3, 4 */}
      <div className="ielts-part-nav-tabs">
        {parts.map((p) => (
          <button
            key={p.partNumber}
            type="button"
            className={`ielts-part-tab-btn ${activePart === p.partNumber ? "active" : ""}`}
            onClick={() => setActivePart(p.partNumber)}
          >
            Part {p.partNumber}
            <span className="ielts-tab-subrange">Q{p.questionsRange[0]}-{p.questionsRange[1]}</span>
          </button>
        ))}
      </div>

      {/* Questions container */}
      <div className="ielts-questions-body">
        {activePart === 1 && renderPart1(parts[0], answers, handleInputChange, evaluation, isReview)}
        {activePart === 2 && renderPart2(parts[1], answers, handleInputChange, handleChooseTwoToggle, evaluation, isReview)}
        {activePart === 3 && renderPart3(parts[2], answers, handleInputChange, handleChooseTwoToggle, evaluation, isReview)}
        {activePart === 4 && renderPart4(parts[3], answers, handleInputChange, evaluation, isReview)}
      </div>

      <IeltsQuestionPalette
        totalQuestions={40}
        answers={answers}
        evaluation={evaluation}
        onSelectQuestion={(num) => {
          if (num <= 10) setActivePart(1);
          else if (num <= 20) setActivePart(2);
          else if (num <= 30) setActivePart(3);
          else setActivePart(4);
        }}
        className="ielts-listening-palette-footer"
      />
    </div>
  );

  return (
    <IeltsSplitPane
      leftPane={leftPaneContent}
      rightPane={rightPaneContent}
      storageKey="ielts_split_listening"
      className="ielts-listening-split"
    />
  );
};
