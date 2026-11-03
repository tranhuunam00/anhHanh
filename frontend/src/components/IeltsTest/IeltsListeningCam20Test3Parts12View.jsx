import React from "react";
import { getFeedbackClass, renderFeedback } from "./ieltsFeedbackHelpers.jsx";

export function renderCam20Test3Part1(part, answers, onChange, evaluation, isReview) {
  if (!part) return null;
  const tableGroup = part.groups?.[0];

  return (
    <div className="ielts-part-content">
      <div className="ielts-instructions-banner">
        <h4>{part.title}</h4>
        <p className="ielts-instructions-text">
          Complete the table below.<br />
          Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.
        </p>
      </div>

      <div className="ielts-notes-block">
        <h4 className="ielts-notes-title">Furniture Rental Companies</h4>

        <div className="ielts-table-container" style={{ marginTop: "16px", overflowX: "auto" }}>
          <table className="ielts-exam-table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--bg-secondary)", borderBottom: "2px solid var(--border-color)" }}>
                <th style={{ padding: "10px", textAlign: "left" }}>Name of company</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Information about costs</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Additional notes</th>
              </tr>
            </thead>
            <tbody>
              {/* Row 1: Peak Rentals */}
              <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                <td style={{ padding: "10px", fontWeight: "600", verticalAlign: "top" }}>Peak Rentals</td>
                <td style={{ padding: "10px", verticalAlign: "top" }}>
                  Prices range from $105 to ${" "}
                  <span className="ielts-inline-input-wrapper">
                    <span className="ielts-q-pill">1</span>
                    <input
                      type="text"
                      value={answers[1] || ""}
                      onChange={(e) => onChange(1, e.target.value)}
                      className={`ielts-real-input ${getFeedbackClass(evaluation, 1, isReview)}`}
                      style={{ width: "80px" }}
                    />
                  </span>
                  {renderFeedback(evaluation, 1, isReview)}
                  <br />per room per month
                </td>
                <td style={{ padding: "10px", verticalAlign: "top" }}>
                  <ul style={{ margin: 0, paddingLeft: "18px" }}>
                    <li>
                      The furniture is very{" "}
                      <span className="ielts-inline-input-wrapper">
                        <span className="ielts-q-pill">2</span>
                        <input
                          type="text"
                          value={answers[2] || ""}
                          onChange={(e) => onChange(2, e.target.value)}
                          className={`ielts-real-input ${getFeedbackClass(evaluation, 2, isReview)}`}
                        />
                      </span>
                      {renderFeedback(evaluation, 2, isReview)}
                    </li>
                    <li style={{ marginTop: "6px" }}>Delivers in 1-2 days</li>
                    <li style={{ marginTop: "6px" }}>
                      Special offer: Free{" "}
                      <span className="ielts-inline-input-wrapper">
                        <span className="ielts-q-pill">3</span>
                        <input
                          type="text"
                          value={answers[3] || ""}
                          onChange={(e) => onChange(3, e.target.value)}
                          className={`ielts-real-input ${getFeedbackClass(evaluation, 3, isReview)}`}
                        />
                      </span>
                      {renderFeedback(evaluation, 3, isReview)}{" "}
                      with every living room set
                    </li>
                  </ul>
                </td>
              </tr>

              {/* Row 2: Aaron and Oliver */}
              <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                <td style={{ padding: "10px", verticalAlign: "top" }}>
                  <span className="ielts-inline-input-wrapper">
                    <span className="ielts-q-pill">4</span>
                    <input
                      type="text"
                      value={answers[4] || ""}
                      onChange={(e) => onChange(4, e.target.value)}
                      className={`ielts-real-input ${getFeedbackClass(evaluation, 4, isReview)}`}
                    />
                  </span>
                  {renderFeedback(evaluation, 4, isReview)}{" "}
                  <strong>and Oliver</strong>
                </td>
                <td style={{ padding: "10px", verticalAlign: "top" }}>
                  Mid-range prices
                  <br />
                  12% monthly fee for{" "}
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
                <td style={{ padding: "10px", verticalAlign: "top" }}>
                  Also offers a cleaning service
                </td>
              </tr>

              {/* Row 3: Larch Furniture */}
              <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                <td style={{ padding: "10px", fontWeight: "600", verticalAlign: "top" }}>Larch Furniture</td>
                <td style={{ padding: "10px", verticalAlign: "top" }}>
                  Offers cheapest prices for renting{" "}
                  <span className="ielts-inline-input-wrapper">
                    <span className="ielts-q-pill">6</span>
                    <input
                      type="text"
                      value={answers[6] || ""}
                      onChange={(e) => onChange(6, e.target.value)}
                      className={`ielts-real-input ${getFeedbackClass(evaluation, 6, isReview)}`}
                    />
                  </span>
                  {renderFeedback(evaluation, 6, isReview)}{" "}
                  items
                </td>
                <td style={{ padding: "10px", verticalAlign: "top" }}>
                  <ul style={{ margin: 0, paddingLeft: "18px" }}>
                    <li>
                      Must have own{" "}
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
                    <li style={{ marginTop: "6px" }}>Minimum contract length: Six months</li>
                  </ul>
                </td>
              </tr>

              {/* Row 4: Space Rentals */}
              <tr>
                <td style={{ padding: "10px", verticalAlign: "top" }}>
                  <span className="ielts-inline-input-wrapper">
                    <span className="ielts-q-pill">8</span>
                    <input
                      type="text"
                      value={answers[8] || ""}
                      onChange={(e) => onChange(8, e.target.value)}
                      className={`ielts-real-input ${getFeedbackClass(evaluation, 8, isReview)}`}
                    />
                  </span>
                  {renderFeedback(evaluation, 8, isReview)}{" "}
                  <strong>Rentals</strong>
                </td>
                <td style={{ padding: "10px", verticalAlign: "top" }}>
                  See the most up-to-date prices on their{" "}
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
                </td>
                <td style={{ padding: "10px", verticalAlign: "top" }}>
                  <span className="ielts-inline-input-wrapper">
                    <span className="ielts-q-pill">10</span>
                    <input
                      type="text"
                      value={answers[10] || ""}
                      onChange={(e) => onChange(10, e.target.value)}
                      className={`ielts-real-input ${getFeedbackClass(evaluation, 10, isReview)}`}
                    />
                  </span>
                  {renderFeedback(evaluation, 10, isReview)}{" "}
                  are allowed within 7 days of delivery
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function renderCam20Test3Part2(part, answers, onChange, evaluation, isReview) {
  if (!part) return null;
  const mcGroup = part.groups?.[0];
  const mapGroup = part.groups?.[1];

  return (
    <div className="ielts-part-content">
      <div className="ielts-instructions-banner">
        <h4>{part.title}</h4>
        <p className="ielts-instructions-text">
          Questions 11-16: Choose the correct letter, A, B or C.<br />
          Questions 17-20: Label the map below. Choose the correct letter, A-G, next to Questions 17-20.
        </p>
      </div>

      {mcGroup && (
        <div className="ielts-question-group" style={{ marginBottom: "28px" }}>
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

      {mapGroup && (
        <div className="ielts-question-group">
          <h5>Questions 17–20</h5>
          <p className="ielts-group-instructions">{mapGroup.instructions}</p>

          <div style={{ textAlign: "center", margin: "16px 0" }}>
            <img
              src={mapGroup.imageSrc}
              alt={mapGroup.mapTitle}
              style={{ maxWidth: "100%", height: "auto", borderRadius: "8px", border: "1px solid var(--border-color)" }}
            />
          </div>

          <div className="ielts-match-list" style={{ marginTop: "16px" }}>
            {mapGroup.items?.map((it) => (
              <div key={it.number} className="ielts-match-item" style={{ marginBottom: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span className="ielts-q-pill">{it.number}</span>
                  <span style={{ flex: 1, fontSize: "0.95rem" }}>{it.feature}</span>
                  <select
                    value={answers[it.number] || ""}
                    onChange={(e) => onChange(it.number, e.target.value)}
                    className={`ielts-select-input ${getFeedbackClass(evaluation, it.number, isReview)}`}
                    style={{ minWidth: "90px" }}
                  >
                    <option value="">Chọn A-G</option>
                    {mapGroup.options?.map((letter) => (
                      <option key={letter} value={letter}>{letter}</option>
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

