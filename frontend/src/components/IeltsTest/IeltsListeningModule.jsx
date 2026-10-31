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
 * IELTS Listening Test Module (Exam-Standard UI)
 * Features:
 * - Top Audio Player: Full-width continuous audio strip at the top (frees left column space)
 * - Single-row Top Navigation & Question Palette: 4 Parts + all 40 questions dàn hàng ngang
 * - Maximum vertical space: Left pane (Map / Overview) & Right pane (Questions)
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
  const [leftPart, setLeftPart] = useState(1);
  const [rightPart, setRightPart] = useState(1);

  const parts = listeningData?.parts || [];

  const handleSelectPart = (num) => {
    setActivePart(num);
    setLeftPart(num);
    setRightPart(num);
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

  const handleOpenMapOnLeft = () => {
    setLeftPart(2);
  };

  // Left Pane: Material context for leftPart (100% free of audio player!)
  const leftPaneContent = (
    <div className="ielts-left-scroll-pane">
      {/* Left Pane Part Material Selector */}
      <div className="ielts-left-part-selector compact">
        <span className="ielts-left-nav-label">Tài liệu cột trái:</span>
        <div className="ielts-left-tabs-group">
          {parts.map((p) => (
            <button
              key={p.partNumber}
              type="button"
              className={`ielts-part-tab-btn ${leftPart === p.partNumber ? "active" : ""}`}
              onClick={() => setLeftPart(p.partNumber)}
            >
              Part {p.partNumber}
              {p.partNumber === 2 && <span className="ielts-tab-img-tag"> (Bản đồ)</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Left Content: Part 2 map gets full screen height; others show concise overview */}
      {leftPart === 1 && (
        <div className="ielts-pane-section ielts-info-card compact">
          <div className="ielts-visual-header">
            <span className="ielts-badge">Part 1</span>
            <h4 className="ielts-visual-title">One-day classes at Steynford College</h4>
          </div>
          <p className="ielts-info-desc">
            Cuộc hội thoại giữa nhân viên tư vấn và học viên hỏi về các khóa học một ngày tại Steynford College.
          </p>
          <div className="ielts-test-tips-box compact">
            <h6>Yêu cầu:</h6>
            <ul>
              <li>Điền vào bảng: <strong>ONE WORD AND/OR A NUMBER</strong> cho mỗi câu trả lời.</li>
            </ul>
          </div>
        </div>
      )}

      {leftPart === 2 && (
        <div className="ielts-pane-section ielts-visual-card full-map">
          <div className="ielts-visual-header">
            <span className="ielts-badge">Sơ đồ Part 2 (Câu 15-20)</span>
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
            Đối chiếu các vị trí chữ cái <strong>A - I</strong> trên sơ đồ để điền cho câu hỏi 15 - 20 bên phải.
          </p>
        </div>
      )}

      {leftPart === 3 && (
        <div className="ielts-pane-section ielts-info-card compact">
          <div className="ielts-visual-header">
            <span className="ielts-badge">Part 3</span>
            <h4 className="ielts-visual-title">Food Safety & New Food Product Project</h4>
          </div>
          <p className="ielts-info-desc">
            Hai sinh viên Nadia và Fergus thảo luận về dự án phát triển sản phẩm mới và an toàn thực phẩm.
          </p>
          <div className="ielts-test-tips-box compact">
            <h6>Cấu trúc:</h6>
            <ul>
              <li>Câu 21-26: Chọn 2 chữ cái A-E cho mỗi nhóm câu hỏi.</li>
              <li>Câu 27-30: Hoàn thành lưu đồ từ danh sách A-F.</li>
            </ul>
          </div>
        </div>
      )}

      {leftPart === 4 && (
        <div className="ielts-pane-section ielts-info-card compact">
          <div className="ielts-visual-header">
            <span className="ielts-badge">Part 4</span>
            <h4 className="ielts-visual-title">Challenges facing the cruise ship industry</h4>
          </div>
          <p className="ielts-info-desc">
            Bài giảng học thuật về các thách thức ngành du thuyền đang đối mặt (quá tải du lịch, nhận thức, môi trường).
          </p>
          <div className="ielts-test-tips-box compact">
            <h6>Yêu cầu:</h6>
            <ul>
              <li>Hoàn thành ghi chú: <strong>WRITE ONE WORD ONLY</strong> cho mỗi chỗ trống.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );

  // Right Pane: Questions (Full vertical height)
  const rightPaneContent = (
    <div className="ielts-right-scroll-pane">
      <div className="ielts-questions-body">
        {rightPart === 1 && renderPart1(parts[0], answers, handleInputChange, evaluation, isReview)}
        {rightPart === 2 && renderPart2(parts[1], answers, handleInputChange, handleChooseTwoToggle, evaluation, isReview, handleOpenMapOnLeft)}
        {rightPart === 3 && renderPart3(parts[2], answers, handleInputChange, handleChooseTwoToggle, evaluation, isReview)}
        {rightPart === 4 && renderPart4(parts[3], answers, handleInputChange, evaluation, isReview)}
      </div>
    </div>
  );

  return (
    <div className="ielts-module-container">
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
        evaluation={evaluation}
        skill="listening"
        activePart={activePart}
        onSelectPart={handleSelectPart}
        onSelectQuestion={(num) => {
          const targetPart = num <= 10 ? 1 : num <= 20 ? 2 : num <= 30 ? 3 : 4;
          handleSelectPart(targetPart);
        }}
      />

      {/* Resizable 2-Column Split Pane - Fills 100% of remaining vertical height */}
      <IeltsSplitPane
        leftPane={leftPaneContent}
        rightPane={rightPaneContent}
        storageKey="ielts_split_listening"
        className="ielts-listening-split"
      />
    </div>
  );
};
