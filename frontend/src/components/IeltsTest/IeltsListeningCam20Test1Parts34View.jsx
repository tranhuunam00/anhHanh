import React from "react";
import { getFeedbackClass, renderFeedback } from "./ieltsFeedbackHelpers.jsx";

export function renderCam20Test1Part3(part, answers, onChange, onChooseTwoToggle, evaluation, isReview) {
  if (!part) return null;
  const [ct1, ct2, ct3, mcGroup] = part.groups || [];

  return (
    <div className="ielts-part-content">
      <div className="ielts-instructions-banner">
        <h4>{part.title}</h4>
        <p className="ielts-instructions-text">
          Questions 21-26: Choose TWO letters, A-E.<br />
          Questions 27-30: Choose the correct letter, A, B or C.
        </p>
      </div>

      {[ct1, ct2, ct3].map((g, idx) => {
        if (!g) return null;
        const [q1, q2] = g.numbers;
        return (
          <div key={idx} className="ielts-question-group" style={{ marginBottom: "24px" }}>
            <h5>Questions {q1} and {q2}</h5>
            <p className="ielts-group-instructions">{g.instructions}</p>
            <p className="ielts-choose-two-question">
              <strong>{q1} – {q2}</strong> {g.question}
            </p>
            <div className="ielts-choose-two-options">
              {g.options?.map((opt) => {
                const isSelected = answers[q1] === opt.letter || answers[q2] === opt.letter;
                return (
                  <label
                    key={opt.letter}
                    className={`ielts-choose-two-label ${isSelected ? "selected" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onChooseTwoToggle(g.numbers, opt.letter)}
                      className="ielts-checkbox-input"
                    />
                    <span className="ielts-option-letter">{opt.letter}</span>
                    <span className="ielts-option-text">{opt.text}</span>
                  </label>
                );
              })}
            </div>
            {renderFeedback(evaluation, q1, isReview)}
            {renderFeedback(evaluation, q2, isReview)}
          </div>
        );
      })}

      {mcGroup && (
        <div className="ielts-question-group">
          <h5>Questions 27–30</h5>
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

export function renderCam20Test1Part4(part, answers, onChange, evaluation, isReview) {
  if (!part) return null;
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
        <h4 className="ielts-notes-title">Reclaiming urban rivers</h4>

        <div className="ielts-notes-section">
          <h5>Historical background</h5>
          <ul className="ielts-notes-list">
            <li>Nearly all major cities were built on a river.</li>
            <li>Rivers were traditionally used by city dwellers for transport, fishing and recreation.</li>
            <li>
              Industrial development and rising populations later led to:
              <ul style={{ marginTop: "6px", marginLeft: "20px" }}>
                <li>more sewage from houses being discharged into the river</li>
                <li>
                  pollution from{" "}
                  <span className="ielts-inline-input-wrapper">
                    <span className="ielts-q-pill">31</span>
                    <input
                      type="text"
                      value={answers[31] || ""}
                      onChange={(e) => onChange(31, e.target.value)}
                      className={`ielts-real-input ${getFeedbackClass(evaluation, 31, isReview)}`}
                    />
                  </span>{" "}
                  on the river bank.
                  {renderFeedback(evaluation, 31, isReview)}
                </li>
              </ul>
            </li>
            <li>
              In 1957, the River Thames in London was declared biologically{" "}
              <span className="ielts-inline-input-wrapper">
                <span className="ielts-q-pill">32</span>
                <input
                  type="text"
                  value={answers[32] || ""}
                  onChange={(e) => onChange(32, e.target.value)}
                  className={`ielts-real-input ${getFeedbackClass(evaluation, 32, isReview)}`}
                />
              </span>
              .
              {renderFeedback(evaluation, 32, isReview)}
            </li>
          </ul>
        </div>

        <div className="ielts-notes-section" style={{ marginTop: "16px" }}>
          <h5>Recent improvements</h5>
          <ul className="ielts-notes-list">
            <li>
              Seals and even a{" "}
              <span className="ielts-inline-input-wrapper">
                <span className="ielts-q-pill">33</span>
                <input
                  type="text"
                  value={answers[33] || ""}
                  onChange={(e) => onChange(33, e.target.value)}
                  className={`ielts-real-input ${getFeedbackClass(evaluation, 33, isReview)}`}
                />
              </span>{" "}
              have been seen in the River Thames.
              {renderFeedback(evaluation, 33, isReview)}
            </li>
            <li>
              Riverside warehouses are converted to restaurants and{" "}
              <span className="ielts-inline-input-wrapper">
                <span className="ielts-q-pill">34</span>
                <input
                  type="text"
                  value={answers[34] || ""}
                  onChange={(e) => onChange(34, e.target.value)}
                  className={`ielts-real-input ${getFeedbackClass(evaluation, 34, isReview)}`}
                />
              </span>
              .
              {renderFeedback(evaluation, 34, isReview)}
            </li>
            <li>
              In Los Angeles, there are plans to:
              <ul style={{ marginTop: "6px", marginLeft: "20px" }}>
                <li>
                  build a riverside{" "}
                  <span className="ielts-inline-input-wrapper">
                    <span className="ielts-q-pill">35</span>
                    <input
                      type="text"
                      value={answers[35] || ""}
                      onChange={(e) => onChange(35, e.target.value)}
                      className={`ielts-real-input ${getFeedbackClass(evaluation, 35, isReview)}`}
                    />
                  </span>
                  {renderFeedback(evaluation, 35, isReview)}
                </li>
                <li>
                  display{" "}
                  <span className="ielts-inline-input-wrapper">
                    <span className="ielts-q-pill">36</span>
                    <input
                      type="text"
                      value={answers[36] || ""}
                      onChange={(e) => onChange(36, e.target.value)}
                      className={`ielts-real-input ${getFeedbackClass(evaluation, 36, isReview)}`}
                    />
                  </span>{" "}
                  projects.
                  {renderFeedback(evaluation, 36, isReview)}
                </li>
              </ul>
            </li>
            <li>
              In Paris,{" "}
              <span className="ielts-inline-input-wrapper">
                <span className="ielts-q-pill">37</span>
                <input
                  type="text"
                  value={answers[37] || ""}
                  onChange={(e) => onChange(37, e.target.value)}
                  className={`ielts-real-input ${getFeedbackClass(evaluation, 37, isReview)}`}
                />
              </span>{" "}
              are created on the sides of the river every summer.
              {renderFeedback(evaluation, 37, isReview)}
            </li>
          </ul>
        </div>

        <div className="ielts-notes-section" style={{ marginTop: "16px" }}>
          <h5>Transport possibilities</h5>
          <ul className="ielts-notes-list">
            <li>
              Over 2 billion passengers already travel by{" "}
              <span className="ielts-inline-input-wrapper">
                <span className="ielts-q-pill">38</span>
                <input
                  type="text"
                  value={answers[38] || ""}
                  onChange={(e) => onChange(38, e.target.value)}
                  className={`ielts-real-input ${getFeedbackClass(evaluation, 38, isReview)}`}
                />
              </span>{" "}
              in cities round the world.
              {renderFeedback(evaluation, 38, isReview)}
            </li>
            <li>Changes in shopping habits mean the number of deliveries that are made is increasing.</li>
            <li>
              Instead of road transport, goods could be transported by large freight barges and electric{" "}
              <span className="ielts-inline-input-wrapper">
                <span className="ielts-q-pill">39</span>
                <input
                  type="text"
                  value={answers[39] || ""}
                  onChange={(e) => onChange(39, e.target.value)}
                  className={`ielts-real-input ${getFeedbackClass(evaluation, 39, isReview)}`}
                />
              </span>{" "}
              or, in future, by{" "}
              <span className="ielts-inline-input-wrapper">
                <span className="ielts-q-pill">40</span>
                <input
                  type="text"
                  value={answers[40] || ""}
                  onChange={(e) => onChange(40, e.target.value)}
                  className={`ielts-real-input ${getFeedbackClass(evaluation, 40, isReview)}`}
                />
              </span>
              .
              {renderFeedback(evaluation, 39, isReview)}
              {renderFeedback(evaluation, 40, isReview)}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

