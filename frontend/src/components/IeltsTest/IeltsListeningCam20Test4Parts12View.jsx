import React from "react";
import { getFeedbackClass, renderFeedback } from "./ieltsFeedbackHelpers.jsx";

export function renderCam20Test4Part1(part, answers, onChange, evaluation, isReview) {
  if (!part) return null;
  const notesGroup = part.groups?.[0];

  return (
    <div className="ielts-part-content">
      <div className="ielts-instructions-banner">
        <h4>{part.title}</h4>
        <p className="ielts-instructions-text">
          Complete the notes below.<br />
          Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.
        </p>
      </div>

      <div className="ielts-notes-block">
        <h4 className="ielts-notes-title">{notesGroup?.title || "Advice on family visit"}</h4>

        {notesGroup?.sections?.map((sec, sIdx) => (
          <div key={sIdx} className="ielts-notes-section" style={{ marginTop: sIdx > 0 ? "16px" : "10px" }}>
            <h5>{sec.heading}</h5>
            <ul className="ielts-notes-list">
              {sec.items?.map((item) => (
                <li key={item.number} style={{ margin: "8px 0" }}>
                  {item.prefix}
                  <span className="ielts-inline-input-wrapper">
                    <span className="ielts-q-pill">{item.number}</span>
                    <input
                      type="text"
                      value={answers[item.number] || ""}
                      onChange={(e) => onChange(item.number, e.target.value)}
                      className={`ielts-real-input ${getFeedbackClass(evaluation, item.number, isReview)}`}
                    />
                  </span>
                  {item.suffix}
                  {renderFeedback(evaluation, item.number, isReview)}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export function renderCam20Test4Part2(part, answers, onChange, onChooseTwoToggle, evaluation, isReview) {
  if (!part) return null;
  const chooseTwo1 = part.groups?.[0];
  const chooseTwo2 = part.groups?.[1];
  const matchGroup = part.groups?.[2];

  return (
    <div className="ielts-part-content">
      <div className="ielts-instructions-banner">
        <h4>{part.title}</h4>
        <p className="ielts-instructions-text">
          Questions 11-14: Choose TWO letters, A-E.<br />
          Questions 15-20: Choose SIX answers from the box and write the correct letter, A-H, next to Questions 15-20.
        </p>
      </div>

      {chooseTwo1 && (
        <div className="ielts-question-group" style={{ marginBottom: "24px" }}>
          <h5>Questions 11 and 12</h5>
          <p className="ielts-group-instructions">{chooseTwo1.instructions}</p>
          <div className="ielts-choose-two-list">
            {chooseTwo1.options?.map((opt) => {
              const isSelected =
                answers[11] === opt.letter || answers[12] === opt.letter;
              return (
                <label
                  key={opt.letter}
                  className={`ielts-choose-two-label ${isSelected ? "selected" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onChooseTwoToggle(chooseTwo1.numbers, opt.letter)}
                    className="ielts-checkbox-input"
                  />
                  <span className="ielts-option-letter">{opt.letter}</span>
                  <span className="ielts-option-text">{opt.text}</span>
                </label>
              );
            })}
          </div>
          {renderFeedback(evaluation, 11, isReview)}
          {renderFeedback(evaluation, 12, isReview)}
        </div>
      )}

      {chooseTwo2 && (
        <div className="ielts-question-group" style={{ marginBottom: "28px" }}>
          <h5>Questions 13 and 14</h5>
          <p className="ielts-group-instructions">{chooseTwo2.instructions}</p>
          <div className="ielts-choose-two-list">
            {chooseTwo2.options?.map((opt) => {
              const isSelected =
                answers[13] === opt.letter || answers[14] === opt.letter;
              return (
                <label
                  key={opt.letter}
                  className={`ielts-choose-two-label ${isSelected ? "selected" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onChooseTwoToggle(chooseTwo2.numbers, opt.letter)}
                    className="ielts-checkbox-input"
                  />
                  <span className="ielts-option-letter">{opt.letter}</span>
                  <span className="ielts-option-text">{opt.text}</span>
                </label>
              );
            })}
          </div>
          {renderFeedback(evaluation, 13, isReview)}
          {renderFeedback(evaluation, 14, isReview)}
        </div>
      )}

      {matchGroup && (
        <div className="ielts-question-group">
          <h5>Questions 15–20</h5>
          <p className="ielts-group-instructions">{matchGroup.instructions}</p>

          <div className="ielts-options-box" style={{ marginBottom: "16px", padding: "12px", background: "var(--bg-secondary)", borderRadius: "8px" }}>
            <h5 style={{ margin: "0 0 8px 0" }}>Events in the history of football</h5>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {matchGroup.optionsList?.map((opt) => (
                <li key={opt.letter} style={{ margin: "4px 0" }}>
                  <strong>{opt.letter}</strong>. {opt.text}
                </li>
              ))}
            </ul>
          </div>

          <div className="ielts-match-list">
            {matchGroup.items?.map((it) => (
              <div key={it.number} className="ielts-match-item" style={{ marginBottom: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span className="ielts-q-pill">{it.number}</span>
                  <span style={{ flex: 1, fontSize: "0.95rem", fontWeight: "600" }}>{it.year}</span>
                  <select
                    value={answers[it.number] || ""}
                    onChange={(e) => onChange(it.number, e.target.value)}
                    className={`ielts-select-input ${getFeedbackClass(evaluation, it.number, isReview)}`}
                    style={{ minWidth: "90px" }}
                  >
                    <option value="">Chọn A-H</option>
                    {matchGroup.optionsList?.map((opt) => (
                      <option key={opt.letter} value={opt.letter}>{opt.letter} - {opt.text}</option>
                    ))}
                  </select>
                </div>
                {renderFeedback(evaluation, it.number, isReview)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

