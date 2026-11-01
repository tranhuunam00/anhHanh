import React from "react";
import { getFeedbackClass, renderFeedback } from "./ieltsFeedbackHelpers.jsx";

export function renderTest1Part1(part, answers, onChange, evaluation, isReview) {
  if (!part) return null;
  return (
    <div className="ielts-part-content">
      <div className="ielts-instructions-banner">
        <h4>{part.title}</h4>
        <p className="ielts-instructions-text">
          Complete the table below.<br />
          Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.
        </p>
      </div>

      <div className="ielts-table-container">
        <h4 className="ielts-table-heading">Oyster Bay Sailing Club Courses</h4>
        <table className="ielts-exercise-table">
          <thead>
            <tr>
              <th style={{ width: "20%" }}>Name of course</th>
              <th style={{ width: "32%" }}>What you learn</th>
              <th style={{ width: "24%" }}>Cost</th>
              <th style={{ width: "24%" }}>Other information</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Taster day</strong></td>
              <td>introduction to sailing</td>
              <td>£120 if booking one place</td>
              <td>
                small groups (max{" "}
                <span className="ielts-inline-input-wrapper">
                  <span className="ielts-q-pill">1</span>
                  <input
                    type="text"
                    value={answers[1] || ""}
                    onChange={(e) => onChange(1, e.target.value)}
                    className={`ielts-real-input ${getFeedbackClass(evaluation, 1, isReview)}`}
                  />
                </span>{" "}
                people)
                {renderFeedback(evaluation, 1, isReview)}
              </td>
            </tr>
            <tr>
              <td><strong>Level 1</strong></td>
              <td>
                <div style={{ marginBottom: "8px" }}>
                  basic theory e.g. understanding the{" "}
                  <span className="ielts-inline-input-wrapper">
                    <span className="ielts-q-pill">2</span>
                    <input
                      type="text"
                      value={answers[2] || ""}
                      onChange={(e) => onChange(2, e.target.value)}
                      className={`ielts-real-input ${getFeedbackClass(evaluation, 2, isReview)}`}
                    />
                  </span>{" "}
                  and tides
                  {renderFeedback(evaluation, 2, isReview)}
                </div>
                <div>
                  basic sailing skills including{" "}
                  <span className="ielts-inline-input-wrapper">
                    <span className="ielts-q-pill">3</span>
                    <input
                      type="text"
                      value={answers[3] || ""}
                      onChange={(e) => onChange(3, e.target.value)}
                      className={`ielts-real-input ${getFeedbackClass(evaluation, 3, isReview)}`}
                    />
                  </span>{" "}
                  information
                  {renderFeedback(evaluation, 3, isReview)}
                </div>
              </td>
              <td>
                <div style={{ marginBottom: "6px" }}>£200</div>
                <div style={{ marginBottom: "6px" }}>
                  <span className="ielts-inline-input-wrapper">
                    <span className="ielts-q-pill">4</span>
                    <input
                      type="text"
                      value={answers[4] || ""}
                      onChange={(e) => onChange(4, e.target.value)}
                      className={`ielts-real-input ${getFeedbackClass(evaluation, 4, isReview)}`}
                    />
                  </span>{" "}
                  available for club members
                  {renderFeedback(evaluation, 4, isReview)}
                </div>
                <div>
                  all inclusive (plus a useful{" "}
                  <span className="ielts-inline-input-wrapper">
                    <span className="ielts-q-pill">5</span>
                    <input
                      type="text"
                      value={answers[5] || ""}
                      onChange={(e) => onChange(5, e.target.value)}
                      className={`ielts-real-input ${getFeedbackClass(evaluation, 5, isReview)}`}
                    />
                  </span>
                  )
                  {renderFeedback(evaluation, 5, isReview)}
                </div>
              </td>
              <td>
                a{" "}
                <span className="ielts-inline-input-wrapper">
                  <span className="ielts-q-pill">6</span>
                  <input
                    type="text"
                    value={answers[6] || ""}
                    onChange={(e) => onChange(6, e.target.value)}
                    className={`ielts-real-input ${getFeedbackClass(evaluation, 6, isReview)}`}
                  />
                </span>{" "}
                at the end of the course for all participants
                {renderFeedback(evaluation, 6, isReview)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="ielts-notes-container" style={{ marginTop: "24px" }}>
        <h4 className="ielts-subheading">Questions 7–10</h4>
        <p className="ielts-instructions-text">
          Complete the notes below.<br />
          Write <strong>ONE WORD ONLY</strong> for each answer.
        </p>
        <h5 style={{ fontWeight: 600, margin: "12px 0 8px" }}>General information</h5>
        <ul className="ielts-notes-list">
          <li>Participants must be able to swim.</li>
          <li>
            Bring suitable clothing, a{" "}
            <span className="ielts-inline-input-wrapper">
              <span className="ielts-q-pill">7</span>
              <input
                type="text"
                value={answers[7] || ""}
                onChange={(e) => onChange(7, e.target.value)}
                className={`ielts-real-input ${getFeedbackClass(evaluation, 7, isReview)}`}
              />
            </span>{" "}
            and toiletries (e.g. shampoo).
            {renderFeedback(evaluation, 7, isReview)}
          </li>
          <li>
            There is a{" "}
            <span className="ielts-inline-input-wrapper">
              <span className="ielts-q-pill">8</span>
              <input
                type="text"
                value={answers[8] || ""}
                onChange={(e) => onChange(8, e.target.value)}
                className={`ielts-real-input ${getFeedbackClass(evaluation, 8, isReview)}`}
              />
            </span>{" "}
            at the club.
            {renderFeedback(evaluation, 8, isReview)}
          </li>
          <li>
            Online training{" "}
            <span className="ielts-inline-input-wrapper">
              <span className="ielts-q-pill">9</span>
              <input
                type="text"
                value={answers[9] || ""}
                onChange={(e) => onChange(9, e.target.value)}
                className={`ielts-real-input ${getFeedbackClass(evaluation, 9, isReview)}`}
              />
            </span>{" "}
            are recommended.
            {renderFeedback(evaluation, 9, isReview)}
          </li>
          <li>
            <span className="ielts-inline-input-wrapper">
              <span className="ielts-q-pill">10</span>
              <input
                type="text"
                value={answers[10] || ""}
                onChange={(e) => onChange(10, e.target.value)}
                className={`ielts-real-input ${getFeedbackClass(evaluation, 10, isReview)}`}
              />
            </span>{" "}
            are available for course participants.
            {renderFeedback(evaluation, 10, isReview)}
          </li>
        </ul>
      </div>
    </div>
  );
}

export function renderTest1Part2(part, answers, onChange, evaluation, isReview) {
  if (!part) return null;
  const mcGroup = part.groups?.find((g) => g.groupType === "multiple_choice");
  const matchGroup = part.groups?.find((g) => g.groupType === "matching_options");

  return (
    <div className="ielts-part-content">
      <div className="ielts-instructions-banner">
        <h4>{part.title}</h4>
      </div>

      {mcGroup && (
        <div className="ielts-mc-section" style={{ marginBottom: "28px" }}>
          <h4 className="ielts-subheading">Questions 11–16</h4>
          <p className="ielts-instructions-text">{mcGroup.instructions}</p>
          <div className="ielts-mc-list">
            {mcGroup.items.map((it) => (
              <div key={it.number} className="ielts-mc-item" style={{ marginBottom: "18px" }}>
                <p className="ielts-mc-question">
                  <span className="ielts-q-pill">{it.number}</span> {it.question}
                </p>
                <div className="ielts-mc-options">
                  {it.options.map((opt) => (
                    <label
                      key={opt.letter}
                      className={`ielts-mc-option ${answers[it.number] === opt.letter ? "selected" : ""}`}
                    >
                      <input
                        type="radio"
                        name={`q_${it.number}`}
                        value={opt.letter}
                        checked={answers[it.number] === opt.letter}
                        onChange={() => onChange(it.number, opt.letter)}
                      />
                      <span className="ielts-mc-letter">{opt.letter}</span>
                      <span className="ielts-mc-text">{opt.text}</span>
                    </label>
                  ))}
                </div>
                {renderFeedback(evaluation, it.number, isReview)}
              </div>
            ))}
          </div>
        </div>
      )}

      {matchGroup && (
        <div className="ielts-matching-section">
          <h4 className="ielts-subheading">Questions 17–20</h4>
          <p className="ielts-instructions-text">{matchGroup.instructions}</p>
          <div className="ielts-options-box" style={{ background: "var(--bg-secondary)", padding: "14px", borderRadius: "8px", marginBottom: "16px", border: "1px solid var(--border-color)" }}>
            <h5 style={{ fontWeight: 600, marginBottom: "8px" }}>Abilities</h5>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", gap: "24px", flexWrap: "wrap" }}>
              {matchGroup.optionsList.map((opt) => (
                <li key={opt.letter}><strong>{opt.letter}</strong> {opt.text}</li>
              ))}
            </ul>
          </div>
          <h5 style={{ fontWeight: 600, margin: "12px 0 8px" }}>Duties</h5>
          <div className="ielts-matching-items">
            {matchGroup.items.map((it) => (
              <div key={it.number} className="ielts-matching-row" style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                <span className="ielts-q-pill">{it.number}</span>
                <span style={{ minWidth: "160px" }}>{it.duty}</span>
                <select
                  value={answers[it.number] || ""}
                  onChange={(e) => onChange(it.number, e.target.value)}
                  className={`ielts-select-input ${getFeedbackClass(evaluation, it.number, isReview)}`}
                  style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid var(--border-color)", background: "var(--bg-card)", color: "var(--text-primary)" }}
                >
                  <option value="">-- Chọn đáp án --</option>
                  {matchGroup.optionsList.map((opt) => (
                    <option key={opt.letter} value={opt.letter}>
                      {opt.letter} - {opt.text}
                    </option>
                  ))}
                </select>
                {renderFeedback(evaluation, it.number, isReview)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function renderTest1Part3(part, answers, onChange, onChooseTwoToggle, evaluation, isReview) {
  if (!part) return null;
  const groups = part.groups || [];
  const chooseTwoGroups = groups.filter((g) => g.groupType === "choose_two");
  const matchGroup = groups.find((g) => g.groupType === "matching_opinions");

  return (
    <div className="ielts-part-content">
      <div className="ielts-instructions-banner">
        <h4>{part.title}</h4>
      </div>

      {chooseTwoGroups.map((ctg, idx) => {
        const [q1, q2] = ctg.numbers;
        const currentVals = [answers[q1], answers[q2]].filter(Boolean);
        return (
          <div key={idx} className="ielts-choose-two-box" style={{ marginBottom: "24px" }}>
            <h4 className="ielts-subheading">Questions {q1} and {q2}</h4>
            <p className="ielts-instructions-text">{ctg.instructions}</p>
            <p className="ielts-question-text" style={{ fontWeight: 600, marginBottom: "10px" }}>{ctg.question}</p>
            <div className="ielts-choose-two-options">
              {ctg.options.map((opt) => {
                const checked = currentVals.includes(opt.letter);
                return (
                  <label
                    key={opt.letter}
                    className={`ielts-checkbox-option ${checked ? "selected" : ""}`}
                    style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--border-color)", marginBottom: "6px", cursor: "pointer", background: checked ? "rgba(37,99,235,0.08)" : "var(--bg-card)" }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onChooseTwoToggle(ctg.numbers, opt.letter)}
                    />
                    <span className="ielts-opt-letter" style={{ fontWeight: 600 }}>{opt.letter}</span>
                    <span className="ielts-opt-text">{opt.text}</span>
                  </label>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <span>Câu {q1}: {renderFeedback(evaluation, q1, isReview)}</span>
              <span>Câu {q2}: {renderFeedback(evaluation, q2, isReview)}</span>
            </div>
          </div>
        );
      })}

      {matchGroup && (
        <div className="ielts-matching-opinions-section" style={{ marginTop: "24px" }}>
          <h4 className="ielts-subheading">Questions 25–30</h4>
          <p className="ielts-instructions-text">{matchGroup.instructions}</p>
          <div className="ielts-opinions-box" style={{ background: "var(--bg-secondary)", padding: "14px", borderRadius: "8px", marginBottom: "16px", border: "1px solid var(--border-color)" }}>
            <h5 style={{ fontWeight: 600, marginBottom: "8px" }}>Opinions</h5>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {matchGroup.optionsList.map((opt) => (
                <div key={opt.letter}><strong>{opt.letter}</strong> {opt.text}</div>
              ))}
            </div>
          </div>
          <h5 style={{ fontWeight: 600, margin: "12px 0 8px" }}>Resources</h5>
          <div className="ielts-matching-items">
            {matchGroup.items.map((it) => (
              <div key={it.number} className="ielts-matching-row" style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                <span className="ielts-q-pill">{it.number}</span>
                <span style={{ minWidth: "260px" }}>{it.title}</span>
                <select
                  value={answers[it.number] || ""}
                  onChange={(e) => onChange(it.number, e.target.value)}
                  className={`ielts-select-input ${getFeedbackClass(evaluation, it.number, isReview)}`}
                  style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid var(--border-color)", background: "var(--bg-card)", color: "var(--text-primary)" }}
                >
                  <option value="">-- Chọn A - H --</option>
                  {matchGroup.optionsList.map((opt) => (
                    <option key={opt.letter} value={opt.letter}>
                      {opt.letter} - {opt.text}
                    </option>
                  ))}
                </select>
                {renderFeedback(evaluation, it.number, isReview)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function renderTest1Part4(part, answers, onChange, evaluation, isReview) {
  if (!part) return null;
  const items = part.items || [];
  const qMap = {};
  items.forEach((it) => { qMap[it.number] = it; });

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
    <div className="ielts-part-content">
      <div className="ielts-instructions-banner">
        <h4>{part.title}</h4>
        <p className="ielts-instructions-text">{part.instructions}</p>
      </div>

      <div className="ielts-notes-form">
        <h3 className="ielts-form-title">Sources of rubber</h3>
        <div className="ielts-form-section">
          <h5>Three resources which are essential for industrial civilisation</h5>
          <ul className="ielts-bullets">
            <li>{renderNoteInput(31)}</li>
            <li>fossil fuels</li>
            <li>rubber</li>
          </ul>
        </div>

        <div className="ielts-form-section">
          <h5>Natural rubber</h5>
          <p style={{ fontStyle: "italic", marginBottom: "8px" }}>This mainly comes from the Para rubber tree, now cultivated in South-East Asia.</p>
          <p style={{ fontWeight: 600, marginBottom: "4px" }}>The supply is limited because</p>
          <ul className="ielts-bullets">
            <li>the growth of the tree is {renderNoteInput(32)} .</li>
            <li>production cannot easily be adjusted because of increasing or decreasing {renderNoteInput(33)} .</li>
            <li>the tree only grows near the {renderNoteInput(34)} .</li>
            <li>extracting the latex (rubber) is labour-intensive</li>
            <li>it is very difficult to {renderNoteInput(35)} rubber after production.</li>
          </ul>
          <p style={{ fontWeight: 600, margin: "10px 0 4px" }}>New threats include</p>
          <ul className="ielts-bullets">
            <li>lack of genetic diversity, leading to danger of disease caused by a {renderNoteInput(36)} .</li>
            <li>a shift to the cultivation of palm oil</li>
            <li>extreme {renderNoteInput(37)} events.</li>
          </ul>
        </div>

        <div className="ielts-form-section">
          <h5>Synthetic rubber</h5>
          <ul className="ielts-bullets">
            <li>may be used for engine parts and cooking utensils</li>
            <li>is less {renderNoteInput(38)} than natural rubber</li>
            <li>is unsuitable for many purposes e.g. the tyres of aircraft.</li>
          </ul>
        </div>

        <div className="ielts-form-section">
          <h5>An alternative source of natural rubber</h5>
          <ul className="ielts-bullets">
            <li>A wild flower (a type of dandelion) has rubber in its {renderNoteInput(39)} .</li>
            <li>It can be grown in many locations and does not require good {renderNoteInput(40)} .</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

