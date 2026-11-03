import React from "react";
import { getFeedbackClass, renderFeedback } from "./ieltsFeedbackHelpers.jsx";

export function renderCam20Test2Passage1Questions(groups, answers, onChange, evaluation, isReview) {
  const notesGroup = groups?.find((g) => g.groupType === "fill_notes");
  const tfGroup = groups?.find((g) => g.groupType === "true_false_not_given");

  const renderNoteInput = (num) => (
    <span className="ielts-inline-input-wrapper">
      <span className="ielts-q-pill">{num}</span>
      <input
        type="text"
        value={answers[num] || ""}
        onChange={(e) => onChange(num, e.target.value)}
        className={`ielts-real-input ${getFeedbackClass(evaluation, num, isReview)}`}
      />
      {renderFeedback(evaluation, num, isReview)}
    </span>
  );

  return (
    <div className="ielts-questions-inner">
      {notesGroup && (
        <section className="ielts-question-group" style={{ marginBottom: "28px" }}>
          <h4 className="ielts-group-title">Questions 1–6</h4>
          <p className="ielts-instructions-text">{notesGroup.instructions}</p>
          <div className="ielts-notes-form">
            <h5 className="ielts-form-title">{notesGroup.title}</h5>

            {notesGroup.sections?.map((sec, sIdx) => (
              <div key={sIdx} className="ielts-form-section">
                <h6>{sec.heading}</h6>
                <ul className="ielts-bullets">
                  {sec.items?.map((item) => (
                    <li key={item.number}>
                      {item.prefix}
                      {renderNoteInput(item.number)}
                      {item.suffix}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {tfGroup && (
        <section className="ielts-question-group">
          <h4 className="ielts-group-title">Questions 7–13</h4>
          <p className="ielts-instructions-text">{tfGroup.instructions}</p>
          <div className="ielts-tf-list">
            {tfGroup.items?.map((it) => (
              <div key={it.number} className="ielts-tf-item" style={{ marginBottom: "16px" }}>
                <p className="ielts-tf-statement">
                  <span className="ielts-q-pill">{it.number}</span> {it.statement}
                </p>
                <div className="ielts-tf-options">
                  {["TRUE", "FALSE", "NOT GIVEN"].map((val) => (
                    <label
                      key={val}
                      className={`ielts-tf-label ${answers[it.number] === val ? "selected" : ""} ${getFeedbackClass(evaluation, it.number, isReview)}`}
                    >
                      <input
                        type="radio"
                        name={`q_${it.number}`}
                        value={val}
                        checked={answers[it.number] === val}
                        onChange={() => onChange(it.number, val)}
                        className="ielts-radio-input"
                      />
                      <span>{val}</span>
                    </label>
                  ))}
                </div>
                {renderFeedback(evaluation, it.number, isReview)}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export function renderCam20Test2Passage2Questions(groups, answers, onChange, onChooseTwoToggle, evaluation, isReview) {
  const matchInfoGroup = groups?.find((g) => g.groupType === "matching_information");
  const notesGroup = groups?.find((g) => g.groupType === "fill_notes");
  const chooseTwo1 = groups?.[2];
  const chooseTwo2 = groups?.[3];

  return (
    <div className="ielts-questions-inner">
      {matchInfoGroup && (
        <section className="ielts-question-group" style={{ marginBottom: "28px" }}>
          <h4 className="ielts-group-title">Questions 14–16</h4>
          <p className="ielts-instructions-text">{matchInfoGroup.instructions}</p>
          <div className="ielts-match-info-list">
            {matchInfoGroup.items?.map((it) => (
              <div key={it.number} className="ielts-match-info-item" style={{ marginBottom: "14px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <span className="ielts-q-pill">{it.number}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: "0 0 6px 0", fontSize: "0.95rem" }}>{it.statement}</p>
                    <select
                      value={answers[it.number] || ""}
                      onChange={(e) => onChange(it.number, e.target.value)}
                      className={`ielts-select-input ${getFeedbackClass(evaluation, it.number, isReview)}`}
                      style={{ minWidth: "90px" }}
                    >
                      <option value="">Chọn A-F</option>
                      {["A", "B", "C", "D", "E", "F"].map((letter) => (
                        <option key={letter} value={letter}>{letter}</option>
                      ))}
                    </select>
                    {renderFeedback(evaluation, it.number, isReview)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {notesGroup && (
        <section className="ielts-question-group" style={{ marginBottom: "28px" }}>
          <h4 className="ielts-group-title">Questions 17–22</h4>
          <p className="ielts-instructions-text">{notesGroup.instructions}</p>
          <div className="ielts-notes-form">
            <h5 className="ielts-form-title">{notesGroup.title}</h5>
            <ul className="ielts-bullets">
              {notesGroup.items?.map((it) => (
                <li key={it.number}>
                  {it.prefix}
                  <span className="ielts-inline-input-wrapper">
                    <span className="ielts-q-pill">{it.number}</span>
                    <input
                      type="text"
                      value={answers[it.number] || ""}
                      onChange={(e) => onChange(it.number, e.target.value)}
                      className={`ielts-real-input ${getFeedbackClass(evaluation, it.number, isReview)}`}
                    />
                    {renderFeedback(evaluation, it.number, isReview)}
                  </span>
                  {it.suffix}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {chooseTwo1 && (
        <div className="ielts-question-group" style={{ marginBottom: "24px" }}>
          <h4 className="ielts-group-title">Questions 23 and 24</h4>
          <p className="ielts-group-instructions">{chooseTwo1.instructions}</p>
          <p className="ielts-choose-two-question">
            <strong>23 – 24</strong> {chooseTwo1.question}
          </p>
          <div className="ielts-choose-two-options">
            {chooseTwo1.options?.map((opt) => {
              const [q1, q2] = chooseTwo1.numbers;
              const isSelected = answers[q1] === opt.letter || answers[q2] === opt.letter;
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
          {renderFeedback(evaluation, 23, isReview)}
          {renderFeedback(evaluation, 24, isReview)}
        </div>
      )}

      {chooseTwo2 && (
        <div className="ielts-question-group">
          <h4 className="ielts-group-title">Questions 25 and 26</h4>
          <p className="ielts-group-instructions">{chooseTwo2.instructions}</p>
          <p className="ielts-choose-two-question">
            <strong>25 – 26</strong> {chooseTwo2.question}
          </p>
          <div className="ielts-choose-two-options">
            {chooseTwo2.options?.map((opt) => {
              const [q1, q2] = chooseTwo2.numbers;
              const isSelected = answers[q1] === opt.letter || answers[q2] === opt.letter;
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
          {renderFeedback(evaluation, 25, isReview)}
          {renderFeedback(evaluation, 26, isReview)}
        </div>
      )}
    </div>
  );
}

export function renderCam20Test2Passage3Questions(groups, answers, onChange, evaluation, isReview) {
  const ynGroup = groups?.find((g) => g.groupType === "yes_no_not_given");
  const summaryBoxGroup = groups?.find((g) => g.groupType === "summary_with_box");
  const mcGroup = groups?.find((g) => g.groupType === "multiple_choice");

  return (
    <div className="ielts-questions-inner">
      {ynGroup && (
        <section className="ielts-question-group" style={{ marginBottom: "28px" }}>
          <h4 className="ielts-group-title">Questions 27–32</h4>
          <p className="ielts-instructions-text">{ynGroup.instructions}</p>
          <div className="ielts-tf-list">
            {ynGroup.items?.map((it) => (
              <div key={it.number} className="ielts-tf-item" style={{ marginBottom: "16px" }}>
                <p className="ielts-tf-statement">
                  <span className="ielts-q-pill">{it.number}</span> {it.statement}
                </p>
                <div className="ielts-tf-options">
                  {["YES", "NO", "NOT GIVEN"].map((val) => (
                    <label
                      key={val}
                      className={`ielts-tf-label ${answers[it.number] === val ? "selected" : ""} ${getFeedbackClass(evaluation, it.number, isReview)}`}
                    >
                      <input
                        type="radio"
                        name={`q_${it.number}`}
                        value={val}
                        checked={answers[it.number] === val}
                        onChange={() => onChange(it.number, val)}
                        className="ielts-radio-input"
                      />
                      <span>{val}</span>
                    </label>
                  ))}
                </div>
                {renderFeedback(evaluation, it.number, isReview)}
              </div>
            ))}
          </div>
        </section>
      )}

      {summaryBoxGroup && (
        <section className="ielts-question-group" style={{ marginBottom: "28px" }}>
          <h4 className="ielts-group-title">Questions 33–37</h4>
          <p className="ielts-instructions-text">{summaryBoxGroup.instructions}</p>

          <div className="ielts-options-box" style={{ marginBottom: "16px", padding: "12px", background: "var(--bg-secondary)", borderRadius: "8px" }}>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
              {summaryBoxGroup.optionsList?.map((opt) => (
                <li key={opt.letter}>
                  <strong>{opt.letter}</strong>. {opt.text}
                </li>
              ))}
            </ul>
          </div>

          <div className="ielts-notes-form">
            <h5 className="ielts-form-title">{summaryBoxGroup.title}</h5>
            <div style={{ lineHeight: "2.1", fontSize: "0.95rem" }}>
              {summaryBoxGroup.items?.map((it) => (
                <span key={it.number}>
                  {it.prefix}
                  <span className="ielts-inline-input-wrapper">
                    <span className="ielts-q-pill">{it.number}</span>
                    <select
                      value={answers[it.number] || ""}
                      onChange={(e) => onChange(it.number, e.target.value)}
                      className={`ielts-select-input ${getFeedbackClass(evaluation, it.number, isReview)}`}
                      style={{ minWidth: "90px" }}
                    >
                      <option value="">A-H</option>
                      {summaryBoxGroup.optionsList?.map((opt) => (
                        <option key={opt.letter} value={opt.letter}>{opt.letter} - {opt.text}</option>
                      ))}
                    </select>
                    {renderFeedback(evaluation, it.number, isReview)}
                  </span>
                  {it.suffix}{" "}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {mcGroup && (
        <section className="ielts-question-group">
          <h4 className="ielts-group-title">Questions 38–40</h4>
          <p className="ielts-instructions-text">{mcGroup.instructions}</p>
          <div className="ielts-mc-list">
            {mcGroup.items?.map((item) => (
              <div key={item.number} id={`ielts-q-${item.number}`} className="ielts-mc-item" style={{ marginBottom: "18px" }}>
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
        </section>
      )}
    </div>
  );
}

