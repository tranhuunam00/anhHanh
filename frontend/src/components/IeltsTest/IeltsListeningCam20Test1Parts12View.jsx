import React from "react";
import { getFeedbackClass, renderFeedback } from "./ieltsFeedbackHelpers.jsx";

export function renderCam20Test1Part1(part, answers, onChange, evaluation, isReview) {
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

      <div className="ielts-table-container">
        <h4 className="ielts-table-heading">Restaurant recommendations</h4>
        <table className="ielts-exercise-table">
          <thead>
            <tr>
              <th style={{ width: "20%" }}>Name of restaurant</th>
              <th style={{ width: "26%" }}>Location</th>
              <th style={{ width: "27%" }}>Reason for recommendation</th>
              <th style={{ width: "27%" }}>Other comments</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>The Junction</strong></td>
              <td>Greyson Street, near the station</td>
              <td>
                Good for people who are especially keen on{" "}
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
              </td>
              <td>
                <div style={{ marginBottom: "6px" }}>Quite expensive</div>
                <div>
                  The{" "}
                  <span className="ielts-inline-input-wrapper">
                    <span className="ielts-q-pill">2</span>
                    <input
                      type="text"
                      value={answers[2] || ""}
                      onChange={(e) => onChange(2, e.target.value)}
                      className={`ielts-real-input ${getFeedbackClass(evaluation, 2, isReview)}`}
                    />
                  </span>{" "}
                  is a good place for a drink
                  {renderFeedback(evaluation, 2, isReview)}
                </div>
              </td>
            </tr>
            <tr>
              <td><strong>Paloma</strong></td>
              <td>In Bow Street next to the cinema</td>
              <td>
                <div style={{ marginBottom: "6px" }}>
                  Food, good for sharing -{" "}
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
                </div>
                <div>A famous chef</div>
              </td>
              <td>
                <div style={{ marginBottom: "6px" }}>Staff are very friendly</div>
                <div style={{ marginBottom: "6px" }}>Need to pay £50 deposit</div>
                <div>
                  A limited selection of{" "}
                  <span className="ielts-inline-input-wrapper">
                    <span className="ielts-q-pill">4</span>
                    <input
                      type="text"
                      value={answers[4] || ""}
                      onChange={(e) => onChange(4, e.target.value)}
                      className={`ielts-real-input ${getFeedbackClass(evaluation, 4, isReview)}`}
                    />
                  </span>{" "}
                  food on the menu
                  {renderFeedback(evaluation, 4, isReview)}
                </div>
              </td>
            </tr>
            <tr>
              <td>
                The{" "}
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
              </td>
              <td>
                At the top of a{" "}
                <span className="ielts-inline-input-wrapper">
                  <span className="ielts-q-pill">6</span>
                  <input
                    type="text"
                    value={answers[6] || ""}
                    onChange={(e) => onChange(6, e.target.value)}
                    className={`ielts-real-input ${getFeedbackClass(evaluation, 6, isReview)}`}
                  />
                </span>
                {renderFeedback(evaluation, 6, isReview)}
              </td>
              <td>
                <div style={{ marginBottom: "6px" }}>
                  All the{" "}
                  <span className="ielts-inline-input-wrapper">
                    <span className="ielts-q-pill">7</span>
                    <input
                      type="text"
                      value={answers[7] || ""}
                      onChange={(e) => onChange(7, e.target.value)}
                      className={`ielts-real-input ${getFeedbackClass(evaluation, 7, isReview)}`}
                    />
                  </span>{" "}
                  are very good
                  {renderFeedback(evaluation, 7, isReview)}
                </div>
                <div>
                  Only uses{" "}
                  <span className="ielts-inline-input-wrapper">
                    <span className="ielts-q-pill">8</span>
                    <input
                      type="text"
                      value={answers[8] || ""}
                      onChange={(e) => onChange(8, e.target.value)}
                      className={`ielts-real-input ${getFeedbackClass(evaluation, 8, isReview)}`}
                    />
                  </span>{" "}
                  ingredients
                  {renderFeedback(evaluation, 8, isReview)}
                </div>
              </td>
              <td>
                <div style={{ marginBottom: "6px" }}>
                  Set lunch costs £{" "}
                  <span className="ielts-inline-input-wrapper">
                    <span className="ielts-q-pill">9</span>
                    <input
                      type="text"
                      value={answers[9] || ""}
                      onChange={(e) => onChange(9, e.target.value)}
                      className={`ielts-real-input ${getFeedbackClass(evaluation, 9, isReview)}`}
                    />
                  </span>{" "}
                  per person
                  {renderFeedback(evaluation, 9, isReview)}
                </div>
                <div>
                  Portions probably of{" "}
                  <span className="ielts-inline-input-wrapper">
                    <span className="ielts-q-pill">10</span>
                    <input
                      type="text"
                      value={answers[10] || ""}
                      onChange={(e) => onChange(10, e.target.value)}
                      className={`ielts-real-input ${getFeedbackClass(evaluation, 10, isReview)}`}
                    />
                  </span>{" "}
                  size
                  {renderFeedback(evaluation, 10, isReview)}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function renderCam20Test1Part2(part, answers, onChange, onChooseTwoToggle, evaluation, isReview) {
  if (!part) return null;
  const mcGroup = part.groups?.[0];
  const chooseTwo1 = part.groups?.[1];
  const chooseTwo2 = part.groups?.[2];

  return (
    <div className="ielts-part-content">
      <div className="ielts-instructions-banner">
        <h4>{part.title}</h4>
        <p className="ielts-instructions-text">
          Questions 11-16: Choose the correct letter, A, B or C.<br />
          Questions 17-20: Choose TWO letters, A-E.
        </p>
      </div>

      {mcGroup && (
        <div className="ielts-question-group">
          <h5>Questions 11–16</h5>
          <p className="ielts-group-instructions">{mcGroup.instructions}</p>
          <div className="ielts-mc-list">
            {mcGroup.items?.map((item) => (
              <div key={item.number} id={`ielts-q-${item.number}`} className="ielts-mc-item">
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

      {chooseTwo1 && (
        <div className="ielts-question-group" style={{ marginTop: "24px" }}>
          <h5>Questions 17 and 18</h5>
          <p className="ielts-group-instructions">{chooseTwo1.instructions}</p>
          <p className="ielts-choose-two-question">
            <strong>17 – 18</strong> {chooseTwo1.question}
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
          {renderFeedback(evaluation, 17, isReview)}
          {renderFeedback(evaluation, 18, isReview)}
        </div>
      )}

      {chooseTwo2 && (
        <div className="ielts-question-group" style={{ marginTop: "24px" }}>
          <h5>Questions 19 and 20</h5>
          <p className="ielts-group-instructions">{chooseTwo2.instructions}</p>
          <p className="ielts-choose-two-question">
            <strong>19 – 20</strong> {chooseTwo2.question}
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
          {renderFeedback(evaluation, 19, isReview)}
          {renderFeedback(evaluation, 20, isReview)}
        </div>
      )}
    </div>
  );
}

