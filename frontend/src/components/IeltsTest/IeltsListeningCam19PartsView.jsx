import React from "react";
import { HighlightedVocabSentence } from "../Vocab/HighlightedVocabSentence.jsx";
import { getFeedbackClass, renderFeedback } from "./ieltsFeedbackHelpers.jsx";
import {
  parseOption,
  extractMatchingOptions,
  isChooseTwoSelected
} from "../../utils/cambridgeOptionUtils.js";
import {
  renderBlock,
  renderNoteBlock,
  renderFormBlock,
  renderTableBlock,
  extractAllHandledQuestionNumbers
} from "./IeltsListeningBlockRenderer.jsx";

export function renderCam19ListeningPart(part, answers, onChange, onChooseTwoToggle, evaluation, isReview) {
  if (!part) return null;

  const handledQuestionNumbers = extractAllHandledQuestionNumbers(part);
  const isMapPart = Boolean(part.mapImage);
  const mapItems = isMapPart
    ? (part.items?.filter((it) => it.type === "map_labeling") || [])
    : [];
  const regularItems = isMapPart
    ? (part.items?.filter((it) => !mapItems.includes(it) && !handledQuestionNumbers.has(it.number)) || [])
    : (part.items?.filter((it) => !handledQuestionNumbers.has(it.number)) || []);

  const renderItem = (item) => {
    // 1. Fill Notes / Table completion
    if (item.type === "fill_notes" || item.type === "fill_table") {
      return (
        <div
          key={item.number}
          id={`ielts-q-${item.number}`}
          className="ielts-notes-item"
          style={{
            marginBottom: "14px",
            lineHeight: "2.2",
            fontSize: "1.02rem"
          }}
        >
          <span>{isReview ? <HighlightedVocabSentence text={item.prefix} contextSentence={item.prefix} /> : item.prefix}</span>
          <span className="ielts-inline-input-wrapper">
            <span className="ielts-q-pill">{item.number}</span>
            <input
              type="text"
              value={answers[item.number] || ""}
              onChange={(e) => onChange(item.number, e.target.value)}
              className={`ielts-real-input ${getFeedbackClass(evaluation, item.number, isReview)}`}
            />
          </span>
          <span>{isReview ? <HighlightedVocabSentence text={item.suffix} contextSentence={item.suffix} /> : item.suffix}</span>
          {renderFeedback(evaluation, item.number, isReview)}
        </div>
      );
    }

    // 2. Multiple Choice (Cam 20 / 21 interactive cards with letter circle & text)
    if (item.type === "multiple_choice") {
      return (
        <div
          key={item.number}
          id={`ielts-q-${item.number}`}
          className="ielts-mc-item"
          style={{ marginBottom: "16px" }}
        >
          <div className="ielts-mc-question-row">
            <span className="ielts-q-pill">{item.number}</span>
            <p className="ielts-mc-question-text">
              {isReview ? <HighlightedVocabSentence text={item.question} contextSentence={item.question} /> : item.question}
            </p>
          </div>
          <div className="ielts-mc-options-list">
            {item.options?.map((rawOpt) => {
              const { letter, text } = parseOption(rawOpt);
              const isSelected = answers[item.number] === letter;
              return (
                <label
                  key={letter}
                  className={`ielts-mc-option-label ${isSelected ? "selected" : ""} ${getFeedbackClass(evaluation, item.number, isReview)}`}
                >
                  <input
                    type="radio"
                    name={`q_${item.number}`}
                    value={letter}
                    checked={isSelected}
                    onChange={() => onChange(item.number, letter)}
                    className="ielts-radio-input"
                  />
                  <span className="ielts-option-letter">{letter}</span>
                  <span className="ielts-option-text">
                    {isReview ? <HighlightedVocabSentence text={text} contextSentence={text} /> : text}
                  </span>
                </label>
              );
            })}
          </div>
          {renderFeedback(evaluation, item.number, isReview)}
        </div>
      );
    }

    // 3. Choose Two (Cam 20 / 21 multi-select card with checkboxes)
    if (item.type === "choose_two") {
      // Avoid duplicate question card when this is the second question of a pair
      if (item.pairNumber && item.number > item.pairNumber) {
        return null;
      }
      const pairNum = item.pairNumber;
      return (
        <div
          key={item.number}
          id={`ielts-q-${item.number}`}
          className="ielts-mc-item"
          style={{ marginBottom: "16px" }}
        >
          <div className="ielts-mc-question-row">
            <span className="ielts-q-pill">
              {item.number}{pairNum ? ` & ${pairNum}` : ""}
            </span>
            <p className="ielts-mc-question-text">
              {isReview ? <HighlightedVocabSentence text={item.question} contextSentence={item.question} /> : item.question}
            </p>
          </div>
          <div className="ielts-choose-two-options">
            {item.options?.map((rawOpt) => {
              const { letter, text } = parseOption(rawOpt);
              const isChecked = isChooseTwoSelected(answers, item.number, pairNum, letter);
              return (
                <label
                  key={letter}
                  className={`ielts-choose-two-label ${isChecked ? "selected" : ""} ${getFeedbackClass(evaluation, item.number, isReview)}`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {
                      if (onChooseTwoToggle && pairNum) {
                        onChooseTwoToggle([item.number, pairNum], letter);
                      } else {
                        onChange(item.number, isChecked ? "" : letter);
                      }
                    }}
                    className="ielts-checkbox-input"
                  />
                  <span className="ielts-option-letter">{letter}</span>
                  <span className="ielts-option-text">
                    {isReview ? <HighlightedVocabSentence text={text} contextSentence={text} /> : text}
                  </span>
                </label>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            {renderFeedback(evaluation, item.number, isReview)}
            {pairNum && renderFeedback(evaluation, pairNum, isReview)}
          </div>
        </div>
      );
    }

    // 4. Matching Questions (Cam 20 / 21 dropdown select)
    if (item.type === "matching") {
      const matchingOptions = extractMatchingOptions(item, part);
      return (
        <div
          key={item.number}
          id={`ielts-q-${item.number}`}
          className="ielts-match-item"
          style={{ marginBottom: "12px" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              justifyContent: "space-between"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
              <span className="ielts-q-pill">{item.number}</span>
              <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)" }}>
                {item.question || item.statement || item.title}
              </span>
            </div>
            <select
              value={answers[item.number] || ""}
              onChange={(e) => onChange(item.number, e.target.value)}
              className={`ielts-select-box ${getFeedbackClass(evaluation, item.number, isReview)}`}
              style={{
                minWidth: "120px",
                maxWidth: "280px",
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid var(--border-color)",
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              <option value="">Chọn đáp án...</option>
              {matchingOptions.map((opt) => {
                const { letter, text } = parseOption(opt);
                return (
                  <option key={letter} value={letter}>
                    {letter} {text ? `- ${text}` : ""}
                  </option>
                );
              })}
            </select>
          </div>
          {renderFeedback(evaluation, item.number, isReview)}
        </div>
      );
    }

    return null;
  };

  const firstMatchingIdx = regularItems.findIndex((it) => it.type === "matching");

  const renderBoxOptions = () => {
    if (!part.boxOptions || isMapPart) return null;
    return (
      <div
        className="ielts-box-options"
        style={{
          marginTop: "24px",
          marginBottom: "16px",
          padding: "16px 20px",
          background: "var(--bg-secondary)",
          borderRadius: "10px",
          border: "1px solid var(--border-color)"
        }}
      >
        <h6
          style={{
            margin: "0 0 12px",
            fontWeight: 700,
            fontSize: "0.98rem",
            color: "var(--text-primary)"
          }}
        >
          {part.boxTitle || "Options / Bảng lựa chọn:"}
        </h6>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "10px"
          }}
        >
          {part.boxOptions.map((opt) => {
            const { letter, text } = parseOption(opt);
            return (
              <div
                key={letter}
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "flex-start",
                  fontSize: "0.88rem",
                  color: "var(--text-secondary)",
                  lineHeight: "1.4"
                }}
              >
                <strong style={{ color: "var(--primary)", minWidth: "18px" }}>
                  {letter}.
                </strong>
                <span>{text}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="ielts-part-content">
      {/* Header Banner */}
      <div className="ielts-instructions-banner">
        <h4>{part.title}</h4>
        <p className="ielts-instructions-text" style={{ whiteSpace: "pre-line" }}>
          {part.instructions}
        </p>
      </div>

      {/* Structured Content Blocks (Notes, Forms, Tables) */}
      {part.contentBlocks && Array.isArray(part.contentBlocks) && (
        <div className="ielts-content-blocks" style={{ marginTop: "16px" }}>
          {part.contentBlocks.map((b, idx) => (
            <React.Fragment key={idx}>
              {renderBlock(b, answers, onChange, evaluation, isReview)}
            </React.Fragment>
          ))}
        </div>
      )}
      {!part.contentBlocks && part.noteBlock && (
        <div style={{ marginTop: "16px" }}>
          {renderNoteBlock(part.noteBlock, answers, onChange, evaluation, isReview)}
        </div>
      )}
      {!part.contentBlocks && part.formBlock && (
        <div style={{ marginTop: "16px" }}>
          {renderFormBlock(part.formBlock, answers, onChange, evaluation, isReview)}
        </div>
      )}
      {!part.contentBlocks && part.tableBlock && (
        <div style={{ marginTop: "16px" }}>
          {renderTableBlock(part.tableBlock, answers, onChange, evaluation, isReview)}
        </div>
      )}

      {/* Regular Questions (MCQ, Choose Two, Notes, Matching) */}
      {regularItems.length > 0 && (
        <div className="ielts-questions-inner" style={{ marginTop: "16px" }}>
          {regularItems.map((item, idx) => {
            const targetIdx = firstMatchingIdx !== -1 ? firstMatchingIdx : 0;
            const shouldRenderBox = idx === targetIdx;
            return (
              <React.Fragment key={item.number || idx}>
                {shouldRenderBox && renderBoxOptions()}
                {renderItem(item)}
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* Map Labeling Questions (Interactive 2-column sticky split layout) */}
      {isMapPart && mapItems.length > 0 && (
        <div className="ielts-question-group" style={{ marginTop: "24px" }}>
          <h5 style={{ fontWeight: 700, marginBottom: "8px", color: "var(--text-primary)" }}>
            Questions {mapItems[0]?.number}–{mapItems[mapItems.length - 1]?.number}
          </h5>
          <p className="ielts-group-instructions" style={{ color: "var(--text-secondary)", marginBottom: "16px" }}>
            Label the map below. Choose the correct letter, {part.mapLetters ? `${part.mapLetters[0]}–${part.mapLetters[part.mapLetters.length - 1]}` : "A–H"}, next to Questions {mapItems[0]?.number}–{mapItems[mapItems.length - 1]?.number}.
          </p>

          <div className="ielts-map-interactive-wrapper" style={{ marginTop: "16px" }}>
            {/* Left Column: Sticky Map Image */}
            <div className="ielts-map-image-container" style={{ position: "sticky", top: "16px", alignSelf: "start" }}>
              <img
                src={part.mapImage}
                alt="Listening Map / Plan Diagram"
                className="ielts-inline-map-image"
                style={{ width: "100%", height: "auto", maxHeight: "480px", objectFit: "contain" }}
              />
              <p
                className="ielts-visual-hint"
                style={{
                  marginTop: "10px",
                  textAlign: "center",
                  fontSize: "0.85rem",
                  color: "var(--text-muted)"
                }}
              >
                Đối chiếu các vị trí chữ cái <strong>{part.mapLetters ? `${part.mapLetters[0]} - ${part.mapLetters[part.mapLetters.length - 1]}` : "A - H"}</strong> trên sơ đồ để chọn địa điểm cho câu hỏi {mapItems[0]?.number} - {mapItems[mapItems.length - 1]?.number}.
              </p>
            </div>

            {/* Right Column: Question Cards with Dropdown Select */}
            <div className="ielts-map-questions-grid" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {mapItems.map((item) => (
                <div
                  key={item.number}
                  className="ielts-map-question-card"
                  id={`ielts-q-${item.number}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                    padding: "12px 16px",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
                    <span className="ielts-q-pill">{item.number}</span>
                    <span style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--text-primary)" }}>
                      {item.question || item.feature}
                    </span>
                  </div>
                  <select
                    value={answers[item.number] || ""}
                    onChange={(e) => onChange(item.number, e.target.value)}
                    className={`ielts-select-box ${getFeedbackClass(evaluation, item.number, isReview)}`}
                    style={{
                      minWidth: "110px",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1px solid var(--border-color)",
                      background: "var(--bg-secondary)",
                      color: "var(--text-primary)",
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    <option value="">
                      {part.mapLetters && part.mapLetters.length > 1
                        ? `Chọn ${part.mapLetters[0]}-${part.mapLetters[part.mapLetters.length - 1]}`
                        : "Chọn vị trí"}
                    </option>
                    {(item.options || part.mapLetters || ["A", "B", "C", "D", "E", "F", "G", "H"]).map((letter) => (
                      <option key={letter} value={letter}>Vị trí {letter}</option>
                    ))}
                  </select>
                  {renderFeedback(evaluation, item.number, isReview)}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
