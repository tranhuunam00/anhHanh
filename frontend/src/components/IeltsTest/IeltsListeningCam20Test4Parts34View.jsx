import React from "react";
import { getFeedbackClass, renderFeedback } from "./ieltsFeedbackHelpers.jsx";

export function renderCam20Test4Part3(part, answers, onChange, onChooseTwoToggle, evaluation, isReview) {
  if (!part) return null;
  const chooseTwo1 = part.groups?.[0];
  const chooseTwo2 = part.groups?.[1];
  const mcGroup = part.groups?.[2];

  return (
    <div className="ielts-part-content">
      <div className="ielts-instructions-banner">
        <h4>{part.title}</h4>
        <p className="ielts-instructions-text">
          Questions 21-24: Choose TWO letters, A-E.<br />
          Questions 25-30: Choose the correct letter, A, B or C.
        </p>
      </div>

      {chooseTwo1 && (
        <div className="ielts-question-group" style={{ marginBottom: "24px" }}>
          <h5>Questions 21 and 22</h5>
          <p className="ielts-group-instructions">{chooseTwo1.instructions}</p>
          <div className="ielts-choose-two-list">
            {chooseTwo1.options?.map((opt) => {
              const isSelected =
                answers[21] === opt.letter || answers[22] === opt.letter;
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
          {renderFeedback(evaluation, 21, isReview)}
          {renderFeedback(evaluation, 22, isReview)}
        </div>
      )}

      {chooseTwo2 && (
        <div className="ielts-question-group" style={{ marginBottom: "28px" }}>
          <h5>Questions 23 and 24</h5>
          <p className="ielts-group-instructions">{chooseTwo2.instructions}</p>
          <div className="ielts-choose-two-list">
            {chooseTwo2.options?.map((opt) => {
              const isSelected =
                answers[23] === opt.letter || answers[24] === opt.letter;
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
          {renderFeedback(evaluation, 23, isReview)}
          {renderFeedback(evaluation, 24, isReview)}
        </div>
      )}

      {mcGroup && (
        <div className="ielts-question-group">
          <h5>Questions 25–30</h5>
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

export function renderCam20Test4Part4(part, answers, onChange, evaluation, isReview) {
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
        <h4 className="ielts-notes-title">{notesGroup?.title || "Research in the area around the Chembe Bird Sanctuary"}</h4>

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

