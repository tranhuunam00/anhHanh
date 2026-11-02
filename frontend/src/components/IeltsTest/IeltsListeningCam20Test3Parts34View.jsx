import React from "react";
import { getFeedbackClass, renderFeedback } from "./ieltsFeedbackHelpers.jsx";

export function renderCam20Test3Part3(part, answers, onChange, evaluation, isReview) {
  if (!part) return null;
  const mcGroup = part.groups?.[0];
  const matchGroup = part.groups?.[1];

  return (
    <div className="ielts-part-content">
      <div className="ielts-instructions-banner">
        <h4>{part.title}</h4>
        <p className="ielts-instructions-text">
          Questions 21-26: Choose the correct letter, A, B or C.<br />
          Questions 27-30: Choose FOUR answers from the box and write the correct letter, A-F, next to Questions 27-30.
        </p>
      </div>

      {mcGroup && (
        <div className="ielts-question-group" style={{ marginBottom: "28px" }}>
          <h5>Questions 21–26</h5>
          <p className="ielts-group-instructions">{mcGroup.instructions}</p>
          <div className="ielts-mc-list">
            {mcGroup.items?.map((item) => (
              <div key={item.number} className="ielts-mc-item">
                <div className="ielts-mc-question-row">
                  <span className="ielts-q-pill">{item.number}</span>
                  <p className="ielts-mc-question-text">{item.question}</p>
                </div>
                <div className="ielts-mc-options-list">
                  {item.options?.map((opt) => (
                    <label
                      key={opt.letter}
                      className={`ielts-mc-option-label ${
                        answers[item.number] === opt.letter ? "selected" : ""
                      } ${getFeedbackClass(evaluation, item.number, isReview)}`}
                    >
                      <input
                        type="radio"
                        name={`q_${item.number}`}
                        value={opt.letter}
                        checked={answers[item.number] === opt.letter}
                        onChange={() => onChange(item.number, opt.letter)}
                        className="ielts-radio-input"
                      />
                      <span className="ielts-option-letter">{opt.letter}</span>
                      <span className="ielts-option-text">{opt.text}</span>
                    </label>
                  ))}
                </div>
                {renderFeedback(evaluation, item.number, isReview)}
              </div>
            ))}
          </div>
        </div>
      )}

      {matchGroup && (
        <div className="ielts-question-group">
          <h5>Questions 27–30</h5>
          <p className="ielts-group-instructions">{matchGroup.instructions}</p>

          <div className="ielts-options-box" style={{ marginBottom: "16px", padding: "12px", background: "var(--bg-secondary)", borderRadius: "8px" }}>
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
                  <span style={{ flex: 1, fontSize: "0.95rem" }}>{it.show}</span>
                  <select
                    value={answers[it.number] || ""}
                    onChange={(e) => onChange(it.number, e.target.value)}
                    className={`ielts-select-input ${getFeedbackClass(evaluation, it.number, isReview)}`}
                    style={{ minWidth: "90px" }}
                  >
                    <option value="">Chọn A-F</option>
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

export function renderCam20Test3Part4(part, answers, onChange, evaluation, isReview) {
  if (!part) return null;
  const notesGroup = part.groups?.[0];

  return (
    <div className="ielts-part-content">
      <div className="ielts-instructions-banner">
        <h4>{part.title}</h4>
        <p className="ielts-instructions-text">
          Complete the notes below.<br />
          Write <strong>ONE WORD ONLY</strong> for each answer.
        </p>
      </div>

      <div className="ielts-notes-block">
        <h4 className="ielts-notes-title">{notesGroup?.title || "Inclusive design"}</h4>

        {notesGroup?.sections?.map((sec, sIdx) => (
          <div key={sIdx} className="ielts-notes-section" style={{ marginTop: sIdx > 0 ? "18px" : "10px" }}>
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

