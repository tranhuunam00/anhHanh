import React from "react";
import { getFeedbackClass, renderFeedback } from "./ieltsFeedbackHelpers.jsx";

export function renderCam20Test2Part1(part, answers, onChange, evaluation, isReview) {
  if (!part) return null;
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
        <h4 className="ielts-notes-title">Support for Carers</h4>
        <p style={{ fontStyle: "italic", marginBottom: "14px" }}>
          Local councils can arrange practical support to help those caring for elderly people at home.
        </p>

        <div className="ielts-notes-section">
          <h5>This can give the carer:</h5>
          <ul className="ielts-notes-list">
            <li>
              a{" "}
              <span className="ielts-inline-input-wrapper">
                <span className="ielts-q-pill">1</span>
                <input
                  type="text"
                  value={answers[1] || ""}
                  onChange={(e) => onChange(1, e.target.value)}
                  className={`ielts-real-input ${getFeedbackClass(evaluation, 1, isReview)}`}
                />
              </span>
              {renderFeedback(evaluation, 1, isReview)}
            </li>
            <li>time for other responsibilities</li>
          </ul>
        </div>

        <div className="ielts-notes-section" style={{ marginTop: "16px" }}>
          <h5>Assessment of mother's needs</h5>
          <p style={{ margin: "4px 0 8px 0" }}>This may include discussion of:</p>
          <ul className="ielts-notes-list">
            <li>
              how much{" "}
              <span className="ielts-inline-input-wrapper">
                <span className="ielts-q-pill">2</span>
                <input
                  type="text"
                  value={answers[2] || ""}
                  onChange={(e) => onChange(2, e.target.value)}
                  className={`ielts-real-input ${getFeedbackClass(evaluation, 2, isReview)}`}
                />
              </span>{" "}
              the caring involves
              {renderFeedback(evaluation, 2, isReview)}
            </li>
            <li>
              what types of tasks are involved, e.g.
              <ul style={{ marginTop: "6px", marginLeft: "20px" }}>
                <li>help with dressing</li>
                <li>
                  helping her have a{" "}
                  <span className="ielts-inline-input-wrapper">
                    <span className="ielts-q-pill">3</span>
                    <input
                      type="text"
                      value={answers[3] || ""}
                      onChange={(e) => onChange(3, e.target.value)}
                      className={`ielts-real-input ${getFeedbackClass(evaluation, 3, isReview)}`}
                    />
                  </span>
                  {renderFeedback(evaluation, 3, isReview)}
                </li>
                <li>shopping</li>
                <li>helping with meals</li>
                <li>
                  dealing with{" "}
                  <span className="ielts-inline-input-wrapper">
                    <span className="ielts-q-pill">4</span>
                    <input
                      type="text"
                      value={answers[4] || ""}
                      onChange={(e) => onChange(4, e.target.value)}
                      className={`ielts-real-input ${getFeedbackClass(evaluation, 4, isReview)}`}
                    />
                  </span>
                  {renderFeedback(evaluation, 4, isReview)}
                </li>
              </ul>
            </li>
            <li style={{ marginTop: "8px" }}>
              any aspects of caring that are especially difficult, e.g.
              <ul style={{ marginTop: "6px", marginLeft: "20px" }}>
                <li>
                  loss of{" "}
                  <span className="ielts-inline-input-wrapper">
                    <span className="ielts-q-pill">5</span>
                    <input
                      type="text"
                      value={answers[5] || ""}
                      onChange={(e) => onChange(5, e.target.value)}
                      className={`ielts-real-input ${getFeedbackClass(evaluation, 5, isReview)}`}
                    />
                  </span>
                  {renderFeedback(evaluation, 5, isReview)}
                </li>
                <li>
                  <span className="ielts-inline-input-wrapper">
                    <span className="ielts-q-pill">6</span>
                    <input
                      type="text"
                      value={answers[6] || ""}
                      onChange={(e) => onChange(6, e.target.value)}
                      className={`ielts-real-input ${getFeedbackClass(evaluation, 6, isReview)}`}
                    />
                  </span>{" "}
                  her
                  {renderFeedback(evaluation, 6, isReview)}
                </li>
                <li>
                  preventing a{" "}
                  <span className="ielts-inline-input-wrapper">
                    <span className="ielts-q-pill">7</span>
                    <input
                      type="text"
                      value={answers[7] || ""}
                      onChange={(e) => onChange(7, e.target.value)}
                      className={`ielts-real-input ${getFeedbackClass(evaluation, 7, isReview)}`}
                    />
                  </span>
                  {renderFeedback(evaluation, 7, isReview)}
                </li>
              </ul>
            </li>
          </ul>
        </div>

        <div className="ielts-notes-section" style={{ marginTop: "16px" }}>
          <h5>Types of support that may be offered to carers</h5>
          <ul className="ielts-notes-list">
            <li>
              transport costs, e.g. cost of a{" "}
              <span className="ielts-inline-input-wrapper">
                <span className="ielts-q-pill">8</span>
                <input
                  type="text"
                  value={answers[8] || ""}
                  onChange={(e) => onChange(8, e.target.value)}
                  className={`ielts-real-input ${getFeedbackClass(evaluation, 8, isReview)}`}
                />
              </span>
              {renderFeedback(evaluation, 8, isReview)}
            </li>
            <li>
              car-related costs, e.g. fuel and{" "}
              <span className="ielts-inline-input-wrapper">
                <span className="ielts-q-pill">9</span>
                <input
                  type="text"
                  value={answers[9] || ""}
                  onChange={(e) => onChange(9, e.target.value)}
                  className={`ielts-real-input ${getFeedbackClass(evaluation, 9, isReview)}`}
                />
              </span>
              {renderFeedback(evaluation, 9, isReview)}
            </li>
            <li>help with housework</li>
            <li>
              help to reduce{" "}
              <span className="ielts-inline-input-wrapper">
                <span className="ielts-q-pill">10</span>
                <input
                  type="text"
                  value={answers[10] || ""}
                  onChange={(e) => onChange(10, e.target.value)}
                  className={`ielts-real-input ${getFeedbackClass(evaluation, 10, isReview)}`}
                />
              </span>
              {renderFeedback(evaluation, 10, isReview)}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export function renderCam20Test2Part2(part, answers, onChange, evaluation, isReview) {
  if (!part) return null;
  const matchGroup = part.groups?.[0];
  const mcGroup = part.groups?.[1];

  return (
    <div className="ielts-part-content">
      <div className="ielts-instructions-banner">
        <h4>{part.title}</h4>
        <p className="ielts-instructions-text">
          Questions 11-16: Choose SIX answers from the box and write the correct letter, A-I, next to Questions 11-16.<br />
          Questions 17-20: Choose the correct letter, A, B or C.
        </p>
      </div>

      {matchGroup && (
        <div className="ielts-question-group" style={{ marginBottom: "28px" }}>
          <h5>Questions 11–16</h5>
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
                  <span style={{ flex: 1, fontSize: "0.95rem" }}>{it.duty}</span>
                  <select
                    value={answers[it.number] || ""}
                    onChange={(e) => onChange(it.number, e.target.value)}
                    className={`ielts-select-input ${getFeedbackClass(evaluation, it.number, isReview)}`}
                    style={{ minWidth: "90px" }}
                  >
                    <option value="">Chọn A-I</option>
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

      {mcGroup && (
        <div className="ielts-question-group">
          <h5>Questions 17–20</h5>
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
    </div>
  );
}

