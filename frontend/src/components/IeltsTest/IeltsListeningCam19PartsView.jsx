import React from "react";
import { getFeedbackClass, renderFeedback } from "./ieltsFeedbackHelpers.jsx";

export function renderCam19ListeningPart(part, answers, onChange, onChooseTwoToggle, evaluation, isReview) {
  if (!part) return null;

  return (
    <div className="ielts-part-content">
      <div className="ielts-instructions-banner">
        <h4>{part.title}</h4>
        <p className="ielts-instructions-text" style={{ whiteSpace: "pre-line" }}>
          {part.instructions}
        </p>
      </div>

      <div className="ielts-questions-inner" style={{ marginTop: "16px" }}>
        {part.items?.map((item) => {
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
                            if (onChooseTwoToggle) {
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

          return null;
        })}
      </div>
    </div>
  );
}
