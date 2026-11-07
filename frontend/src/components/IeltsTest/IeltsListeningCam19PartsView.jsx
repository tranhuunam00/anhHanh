import React from "react";
import { getFeedbackClass, renderFeedback } from "./ieltsFeedbackHelpers.jsx";

export function renderCam19ListeningPart(part, answers, onChange, onChooseTwoToggle, evaluation, isReview) {
  if (!part) return null;

  const isMapPart = Boolean(part.mapImage);
  const mapItems = isMapPart
    ? (part.items?.filter((it) => it.type === "map_labeling" || it.type === "matching") || [])
    : [];
  const regularItems = isMapPart
    ? (part.items?.filter((it) => !mapItems.includes(it)) || [])
    : (part.items || []);

  const renderItem = (item) => {
    if (item.type === "fill_notes" || item.type === "fill_table") {
      return (
        <div
          key={item.number}
          className="ielts-notes-item"
          style={{
            marginBottom: "14px",
            lineHeight: "2.2",
            fontSize: "1.02rem"
          }}
        >
          <span>{item.prefix}</span>
          <span className="ielts-inline-input-wrapper">
            <span className="ielts-q-pill">{item.number}</span>
            <input
              type="text"
              value={answers[item.number] || ""}
              onChange={(e) => onChange(item.number, e.target.value)}
              className={`ielts-real-input ${getFeedbackClass(evaluation, item.number, isReview)}`}
            />
          </span>
          <span>{item.suffix}</span>
          {renderFeedback(evaluation, item.number, isReview)}
        </div>
      );
    }

    if (item.type === "multiple_choice") {
      return (
        <div key={item.number} className="ielts-mcq-group" style={{ marginBottom: "20px" }}>
          <p className="ielts-mcq-question" style={{ fontWeight: 600, marginBottom: "8px" }}>
            <span className="ielts-q-pill">{item.number}</span> {item.question}
          </p>
          <div className="ielts-mcq-options" style={{ display: "flex", flexDirection: "column", gap: "8px", marginLeft: "28px" }}>
            {item.options?.map((opt) => {
              const letter = opt.charAt(0);
              const isSelected = answers[item.number] === letter;
              return (
                <label
                  key={letter}
                  className={`ielts-mcq-label ${isSelected ? "selected" : ""} ${getFeedbackClass(evaluation, item.number, isReview)}`}
                  style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <input
                    type="radio"
                    name={`q_${item.number}`}
                    value={letter}
                    checked={isSelected}
                    onChange={() => onChange(item.number, letter)}
                    className="ielts-radio-input"
                  />
                  <span>{opt}</span>
                </label>
              );
            })}
          </div>
          {renderFeedback(evaluation, item.number, isReview)}
        </div>
      );
    }

    if (item.type === "choose_two") {
      const currentSelected = answers[item.number] || "";
      return (
        <div key={item.number} className="ielts-mcq-group" style={{ marginBottom: "20px" }}>
          <p className="ielts-mcq-question" style={{ fontWeight: 600, marginBottom: "8px" }}>
            <span className="ielts-q-pill">{item.number}</span> {item.question}
          </p>
          <div className="ielts-mcq-options" style={{ display: "flex", flexDirection: "column", gap: "8px", marginLeft: "28px" }}>
            {item.options?.map((opt) => {
              const letter = opt.charAt(0);
              const isChecked = currentSelected === letter;
              return (
                <label
                  key={letter}
                  className={`ielts-mcq-label ${isChecked ? "selected" : ""} ${getFeedbackClass(evaluation, item.number, isReview)}`}
                  style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {
                      if (onChooseTwoToggle && item.pairNumber) {
                        onChooseTwoToggle([item.number, item.pairNumber], letter);
                      } else {
                        onChange(item.number, isChecked ? "" : letter);
                      }
                    }}
                    className="ielts-checkbox-input"
                  />
                  <span>{opt}</span>
                </label>
              );
            })}
          </div>
          {renderFeedback(evaluation, item.number, isReview)}
        </div>
      );
    }

    if (item.type === "matching") {
      return (
        <div
          key={item.number}
          className="ielts-matching-item"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "12px",
            padding: "8px 12px",
            background: "var(--bg-secondary)",
            borderRadius: "6px"
          }}
        >
          <span style={{ fontSize: "0.95rem" }}>
            <span className="ielts-q-pill">{item.number}</span> {item.question}
          </span>
          <span className="ielts-inline-input-wrapper">
            <input
              type="text"
              maxLength={2}
              value={answers[item.number] || ""}
              onChange={(e) => onChange(item.number, e.target.value.toUpperCase())}
              placeholder="Letter"
              className={`ielts-real-input ielts-short-input ${getFeedbackClass(evaluation, item.number, isReview)}`}
              style={{ width: "60px", textAlign: "center", textTransform: "uppercase" }}
            />
            {renderFeedback(evaluation, item.number, isReview)}
          </span>
        </div>
      );
    }

    if (item.type === "map_labeling") {
      return (
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
            borderRadius: "8px",
            marginBottom: "10px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
            <span className="ielts-q-pill">{item.number}</span>
            <span style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--text-primary)" }}>{item.question || item.feature}</span>
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
            <option value="">Chọn vị trí</option>
            {(item.options || part.mapLetters || ["A", "B", "C", "D", "E", "F", "G", "H"]).map((letter) => (
              <option key={letter} value={letter}>Vị trí {letter}</option>
            ))}
          </select>
          {renderFeedback(evaluation, item.number, isReview)}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="ielts-part-content">
      <div className="ielts-instructions-banner">
        <h4>{part.title}</h4>
        <p className="ielts-instructions-text" style={{ whiteSpace: "pre-line" }}>
          {part.instructions}
        </p>
      </div>

      {regularItems.length > 0 && (
        <div className="ielts-questions-inner" style={{ marginTop: "16px" }}>
          {regularItems.map(renderItem)}
        </div>
      )}

      {isMapPart && mapItems.length > 0 && (
        <div className="ielts-question-group" style={{ marginTop: "24px" }}>
          <h5 style={{ fontWeight: 700, marginBottom: "8px", color: "var(--text-primary)" }}>
            Questions {mapItems[0]?.number}–{mapItems[mapItems.length - 1]?.number}
          </h5>
          <p className="ielts-group-instructions" style={{ color: "var(--text-secondary)", marginBottom: "16px" }}>
            Label the map below. Choose the correct letter next to Questions {mapItems[0]?.number}–{mapItems[mapItems.length - 1]?.number}.
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

            {/* Right Column: Question Cards */}
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
                    <span style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--text-primary)" }}>{item.question || item.feature}</span>
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
                    <option value="">Chọn vị trí</option>
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
