import React from "react";
import { getFeedbackClass, renderFeedback } from "./ieltsFeedbackHelpers.jsx";

export function renderCam20Test2Part3(part, answers, onChange, evaluation, isReview) {
  if (!part) return null;
  const matchGroup = part.groups?.[0];
  const mcGroup = part.groups?.[1];

  return (
    <div className="ielts-part-content">
      <div className="ielts-instructions-banner">
        <h4>{part.title}</h4>
        <p className="ielts-instructions-text">
          Questions 21-25: Choose FIVE answers from the box and write the correct letter, A-G, next to Questions 21-25.<br />
          Questions 26-30: Choose the correct letter, A, B or C.
        </p>
      </div>

      {matchGroup && (
        <div className="ielts-question-group" style={{ marginBottom: "28px" }}>
          <h5>Questions 21–25</h5>
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
                  <span style={{ flex: 1, fontSize: "0.95rem" }}>{it.title}</span>
                  <select
                    value={answers[it.number] || ""}
                    onChange={(e) => onChange(it.number, e.target.value)}
                    className={`ielts-select-input ${getFeedbackClass(evaluation, it.number, isReview)}`}
                    style={{ minWidth: "90px" }}
                  >
                    <option value="">Chọn A-G</option>
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
          <h5>Questions 26–30</h5>
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

export function renderCam20Test2Part4(part, answers, onChange, evaluation, isReview) {
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
        <h4 className="ielts-notes-title">Developing food trends</h4>

        <div className="ielts-notes-section">
          <ul className="ielts-notes-list">
            <li>
              The growth in interest in food fashions started with{" "}
              <span className="ielts-inline-input-wrapper">
                <span className="ielts-q-pill">31</span>
                <input
                  type="text"
                  value={answers[31] || ""}
                  onChange={(e) => onChange(31, e.target.value)}
                  className={`ielts-real-input ${getFeedbackClass(evaluation, 31, isReview)}`}
                />
              </span>{" "}
              of food being shared on social media.
              {renderFeedback(evaluation, 31, isReview)}
            </li>
            <li>The UK food industry is constantly developing products which are new or different.</li>
            <li>
              Influencers on social media become 'ambassadors' for a brand.
              <ul style={{ marginTop: "6px", marginLeft: "20px" }}>
                <li>
                  sales of{" "}
                  <span className="ielts-inline-input-wrapper">
                    <span className="ielts-q-pill">32</span>
                    <input
                      type="text"
                      value={answers[32] || ""}
                      onChange={(e) => onChange(32, e.target.value)}
                      className={`ielts-real-input ${getFeedbackClass(evaluation, 32, isReview)}`}
                    />
                  </span>{" "}
                  food brands have grown this way.
                  {renderFeedback(evaluation, 32, isReview)}
                </li>
                <li>
                  Famous{" "}
                  <span className="ielts-inline-input-wrapper">
                    <span className="ielts-q-pill">33</span>
                    <input
                      type="text"
                      value={answers[33] || ""}
                      onChange={(e) => onChange(33, e.target.value)}
                      className={`ielts-real-input ${getFeedbackClass(evaluation, 33, isReview)}`}
                    />
                  </span>{" "}
                  are influential.
                  {renderFeedback(evaluation, 33, isReview)}
                </li>
              </ul>
            </li>
            <li>Supermarkets track demand for ingredients on social media.</li>
          </ul>
        </div>

        <div className="ielts-notes-section" style={{ marginTop: "16px" }}>
          <h5>Marketing campaigns</h5>
          <ul className="ielts-notes-list">
            <li>
              <strong>The avocado:</strong>
              <ul style={{ marginTop: "6px", marginLeft: "20px" }}>
                <li>
                  <span className="ielts-inline-input-wrapper">
                    <span className="ielts-q-pill">34</span>
                    <input
                      type="text"
                      value={answers[34] || ""}
                      onChange={(e) => onChange(34, e.target.value)}
                      className={`ielts-real-input ${getFeedbackClass(evaluation, 34, isReview)}`}
                    />
                  </span>{" "}
                  were invited to visit growers in South Africa.
                  {renderFeedback(evaluation, 34, isReview)}
                </li>
                <li>
                  Advertising focused on its{" "}
                  <span className="ielts-inline-input-wrapper">
                    <span className="ielts-q-pill">35</span>
                    <input
                      type="text"
                      value={answers[35] || ""}
                      onChange={(e) => onChange(35, e.target.value)}
                      className={`ielts-real-input ${getFeedbackClass(evaluation, 35, isReview)}`}
                    />
                  </span>{" "}
                  benefits.
                  {renderFeedback(evaluation, 35, isReview)}
                </li>
              </ul>
            </li>
            <li style={{ marginTop: "8px" }}>
              <strong>Oat milk:</strong>
              <ul style={{ marginTop: "6px", marginLeft: "20px" }}>
                <li>A Swedish brand's media campaign received publicity by upsetting competitors.</li>
                <li>
                  Promotion in the USA through{" "}
                  <span className="ielts-inline-input-wrapper">
                    <span className="ielts-q-pill">36</span>
                    <input
                      type="text"
                      value={answers[36] || ""}
                      onChange={(e) => onChange(36, e.target.value)}
                      className={`ielts-real-input ${getFeedbackClass(evaluation, 36, isReview)}`}
                    />
                  </span>{" "}
                  shops reduced the need for advertising.
                  {renderFeedback(evaluation, 36, isReview)}
                </li>
                <li>
                  It appealed to consumers who are concerned about the{" "}
                  <span className="ielts-inline-input-wrapper">
                    <span className="ielts-q-pill">37</span>
                    <input
                      type="text"
                      value={answers[37] || ""}
                      onChange={(e) => onChange(37, e.target.value)}
                      className={`ielts-real-input ${getFeedbackClass(evaluation, 37, isReview)}`}
                    />
                  </span>
                  .
                  {renderFeedback(evaluation, 37, isReview)}
                </li>
              </ul>
            </li>
            <li style={{ marginTop: "8px" }}>
              <strong>Norwegian skrei:</strong> has helped strengthen the{" "}
              <span className="ielts-inline-input-wrapper">
                <span className="ielts-q-pill">38</span>
                <input
                  type="text"
                  value={answers[38] || ""}
                  onChange={(e) => onChange(38, e.target.value)}
                  className={`ielts-real-input ${getFeedbackClass(evaluation, 38, isReview)}`}
                />
              </span>{" "}
              of Norwegian seafood.
              {renderFeedback(evaluation, 38, isReview)}
            </li>
          </ul>
        </div>

        <div className="ielts-notes-section" style={{ marginTop: "16px" }}>
          <h5>Ethical concerns</h5>
          <ul className="ielts-notes-list">
            <li>
              <strong>Quinoa:</strong>
              <ul style={{ marginTop: "6px", marginLeft: "20px" }}>
                <li>
                  Its success led to an increase in its{" "}
                  <span className="ielts-inline-input-wrapper">
                    <span className="ielts-q-pill">39</span>
                    <input
                      type="text"
                      value={answers[39] || ""}
                      onChange={(e) => onChange(39, e.target.value)}
                      className={`ielts-real-input ${getFeedbackClass(evaluation, 39, isReview)}`}
                    />
                  </span>
                  .
                  {renderFeedback(evaluation, 39, isReview)}
                </li>
                <li>
                  Overuse of resources resulted in poor quality{" "}
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
                  {renderFeedback(evaluation, 40, isReview)}
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

