import React from "react";
import { getFeedbackClass, renderFeedback } from "./ieltsFeedbackHelpers.jsx";

export function renderTest1Passage1Questions(groups, answers, onChange, evaluation, isReview) {
  const notesGroup = groups?.find((g) => g.groupType === "notes_completion");
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
          <h4 className="ielts-group-title">{notesGroup.title}</h4>
          <p className="ielts-instructions-text">{notesGroup.instructions}</p>
          <div className="ielts-notes-form">
            <h5 className="ielts-form-title">{notesGroup.topic}</h5>

            <div className="ielts-form-section">
              <h6>Family and early life</h6>
              <ul className="ielts-bullets">
                <li>their grandfather's wealth came from {renderNoteInput(1)} and transportation businesses</li>
                <li>their upbringing gave them a sense of social responsibility</li>
                <li>their {renderNoteInput(2)} was designed to give them an interest in activities such as collecting art</li>
                <li>their governess took them on trips to art galleries</li>
                <li>they took lengthy {renderNoteInput(3)} about the things they saw in art galleries</li>
              </ul>
            </div>

            <div className="ielts-form-section">
              <h6>The sisters as art collectors</h6>
              <ul className="ielts-bullets">
                <li>their {renderNoteInput(4)} showed they liked Old Master paintings, but they were expensive to buy</li>
                <li>their early purchases were safe, popular paintings</li>
                <li>the first Impressionist paintings they bought showed places in {renderNoteInput(5)} .</li>
              </ul>
            </div>

            <div className="ielts-form-section">
              <h6>Impact of First World War</h6>
              <ul className="ielts-bullets">
                <li>they helped bring artists from Belgium to Wales</li>
                <li>they worked in a {renderNoteInput(6)} for soldiers in France</li>
              </ul>
            </div>

            <div className="ielts-form-section">
              <h6>Opinions about the sisters as art collectors</h6>
              <ul className="ielts-bullets">
                <li>were not considered typical collectors - they lived in isolation in the countryside and did not have any {renderNoteInput(7)} who were artists</li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {tfGroup && (
        <section className="ielts-question-group">
          <h4 className="ielts-group-title">{tfGroup.title}</h4>
          <p className="ielts-instructions-text">{tfGroup.instructions}</p>
          <div className="ielts-tf-list">
            {tfGroup.items.map((it) => (
              <div key={it.number} className="ielts-tf-item" style={{ marginBottom: "16px" }}>
                <p className="ielts-tf-statement">
                  <span className="ielts-q-pill">{it.number}</span> {it.statement}
                </p>
                <div className="ielts-tf-options">
                  {["TRUE", "FALSE", "NOT GIVEN"].map((val) => (
                    <label
                      key={val}
                      className={`ielts-tf-option ${answers[it.number] === val ? "selected" : ""}`}
                    >
                      <input
                        type="radio"
                        name={`q_${it.number}`}
                        value={val}
                        checked={answers[it.number] === val}
                        onChange={() => onChange(it.number, val)}
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

export function renderTest1Passage2Questions(groups, answers, onChange, evaluation, isReview) {
  const matchInfoGroup = groups?.find((g) => g.groupType === "matching_information");
  const summaryGroup = groups?.find((g) => g.groupType === "summary_completion");
  const matchPeopleGroup = groups?.find((g) => g.groupType === "matching_people");

  const renderSummaryInput = (num) => (
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
      {matchInfoGroup && (
        <section className="ielts-question-group" style={{ marginBottom: "28px" }}>
          <h4 className="ielts-group-title">{matchInfoGroup.title}</h4>
          <p className="ielts-instructions-text">{matchInfoGroup.instructions}</p>
          <div className="ielts-matching-list">
            {matchInfoGroup.items.map((it) => (
              <div key={it.number} className="ielts-matching-item" style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "14px" }}>
                <span className="ielts-q-pill">{it.number}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: "0 0 6px" }}>{it.text}</p>
                  <select
                    value={answers[it.number] || ""}
                    onChange={(e) => onChange(it.number, e.target.value)}
                    className={`ielts-select-input ${getFeedbackClass(evaluation, it.number, isReview)}`}
                    style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid var(--border-color)", background: "var(--bg-card)", color: "var(--text-primary)" }}
                  >
                    <option value="">-- Chọn Section A-G --</option>
                    {["A", "B", "C", "D", "E", "F", "G"].map((sec) => (
                      <option key={sec} value={sec}>Section {sec}</option>
                    ))}
                  </select>
                  {renderFeedback(evaluation, it.number, isReview)}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {summaryGroup && (
        <section className="ielts-question-group" style={{ marginBottom: "28px" }}>
          <h4 className="ielts-group-title">{summaryGroup.title}</h4>
          <p className="ielts-instructions-text">{summaryGroup.instructions}</p>
          <div className="ielts-summary-box" style={{ background: "var(--bg-secondary)", padding: "16px", borderRadius: "8px", border: "1px solid var(--border-color)", lineHeight: "1.8" }}>
            <h5 style={{ fontWeight: 600, marginBottom: "12px" }}>{summaryGroup.topic}</h5>
            <p style={{ margin: 0 }}>
              According to Justin Feinstein, flotation tanks allow people to concentrate on their own {renderSummaryInput(18)}, which helps them relax and enables them to meditate.
            </p>
            <p style={{ margin: "12px 0 0" }}>
              Feinstein and his colleagues conducted an experiment in which 50 people, who were all suffering from stress and related issues, were given a {renderSummaryInput(19)} to complete before and after using a flotation tank. Participants reported a reduction in their symptoms after an hour in the tank, together with signs of relaxation and improved general {renderSummaryInput(20)} .
            </p>
            <p style={{ margin: "12px 0 0" }}>
              In another experiment, the researchers had 48 people spend periods of 90 minutes either lying back in a chair or floating in a tank. Brain scans then revealed that those people who had been in a tank had decreased activity in parts of the brain associated with {renderSummaryInput(21)} .
            </p>
          </div>
        </section>
      )}

      {matchPeopleGroup && (
        <section className="ielts-question-group">
          <h4 className="ielts-group-title">{matchPeopleGroup.title}</h4>
          <p className="ielts-instructions-text">{matchPeopleGroup.instructions}</p>
          <div className="ielts-options-box" style={{ background: "var(--bg-secondary)", padding: "14px", borderRadius: "8px", marginBottom: "16px", border: "1px solid var(--border-color)" }}>
            <h5 style={{ fontWeight: 600, marginBottom: "8px" }}>List of People</h5>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {matchPeopleGroup.peopleList.map((p) => (
                <div key={p.letter}><strong>{p.letter}</strong> {p.name}</div>
              ))}
            </div>
          </div>
          <div className="ielts-matching-list">
            {matchPeopleGroup.items.map((it) => (
              <div key={it.number} className="ielts-matching-item" style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "14px" }}>
                <span className="ielts-q-pill">{it.number}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: "0 0 6px" }}>{it.statement}</p>
                  <select
                    value={answers[it.number] || ""}
                    onChange={(e) => onChange(it.number, e.target.value)}
                    className={`ielts-select-input ${getFeedbackClass(evaluation, it.number, isReview)}`}
                    style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid var(--border-color)", background: "var(--bg-card)", color: "var(--text-primary)" }}
                  >
                    <option value="">-- Chọn Người (A-D) --</option>
                    {matchPeopleGroup.peopleList.map((p) => (
                      <option key={p.letter} value={p.letter}>{p.letter} - {p.name}</option>
                    ))}
                  </select>
                  {renderFeedback(evaluation, it.number, isReview)}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export function renderTest1Passage3Questions(groups, answers, onChange, evaluation, isReview) {
  const mcGroup = groups?.find((g) => g.groupType === "multiple_choice");
  const summaryBoxGroup = groups?.find((g) => g.groupType === "summary_box");
  const ynnGroup = groups?.find((g) => g.groupType === "yes_no_not_given");

  return (
    <div className="ielts-questions-inner">
      {mcGroup && (
        <section className="ielts-question-group" style={{ marginBottom: "28px" }}>
          <h4 className="ielts-group-title">{mcGroup.title}</h4>
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
        </section>
      )}

      {summaryBoxGroup && (
        <section className="ielts-question-group" style={{ marginBottom: "28px" }}>
          <h4 className="ielts-group-title">{summaryBoxGroup.title}</h4>
          <p className="ielts-instructions-text">{summaryBoxGroup.instructions}</p>
          <div className="ielts-options-box" style={{ background: "var(--bg-secondary)", padding: "14px", borderRadius: "8px", marginBottom: "16px", border: "1px solid var(--border-color)" }}>
            <h5 style={{ fontWeight: 600, marginBottom: "8px" }}>Word Bank</h5>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {summaryBoxGroup.optionsList.map((opt) => (
                <div key={opt.letter}><strong>{opt.letter}</strong> {opt.text}</div>
              ))}
            </div>
          </div>
          <div className="ielts-summary-box" style={{ background: "var(--bg-secondary)", padding: "16px", borderRadius: "8px", border: "1px solid var(--border-color)", lineHeight: "1.8" }}>
            <h5 style={{ fontWeight: 600, marginBottom: "12px" }}>{summaryBoxGroup.topic}</h5>
            <p style={{ margin: 0 }}>
              The book The World of Sugar points out the similarities in the way that sugar was cultivated around the world. In the big industries in both Germany and the US, sugar farming depended on{" "}
              <select
                value={answers[31] || ""}
                onChange={(e) => onChange(31, e.target.value)}
                className={`ielts-select-input ${getFeedbackClass(evaluation, 31, isReview)}`}
                style={{ padding: "4px 8px", borderRadius: "6px", margin: "0 4px" }}
              >
                <option value="">(31)</option>
                {summaryBoxGroup.optionsList.map((o) => (
                  <option key={o.letter} value={o.letter}>{o.letter} - {o.text}</option>
                ))}
              </select>
              {renderFeedback(evaluation, 31, isReview)}
              .
            </p>
            <p style={{ margin: "12px 0 0" }}>
              However, in other parts of the world such as South Asia and Latin America,{" "}
              <select
                value={answers[32] || ""}
                onChange={(e) => onChange(32, e.target.value)}
                className={`ielts-select-input ${getFeedbackClass(evaluation, 32, isReview)}`}
                style={{ padding: "4px 8px", borderRadius: "6px", margin: "0 4px" }}
              >
                <option value="">(32)</option>
                {summaryBoxGroup.optionsList.map((o) => (
                  <option key={o.letter} value={o.letter}>{o.letter} - {o.text}</option>
                ))}
              </select>
              {renderFeedback(evaluation, 32, isReview)}
              {" "}continued.
            </p>
            <p style={{ margin: "12px 0 0" }}>
              Sugar production has also involved{" "}
              <select
                value={answers[33] || ""}
                onChange={(e) => onChange(33, e.target.value)}
                className={`ielts-select-input ${getFeedbackClass(evaluation, 33, isReview)}`}
                style={{ padding: "4px 8px", borderRadius: "6px", margin: "0 4px" }}
              >
                <option value="">(33)</option>
                {summaryBoxGroup.optionsList.map((o) => (
                  <option key={o.letter} value={o.letter}>{o.letter} - {o.text}</option>
                ))}
              </select>
              {renderFeedback(evaluation, 33, isReview)}
              {" "}who were eager to protect their markets. In countries such as Cuba the sugar industry therefore had a major influence on{" "}
              <select
                value={answers[34] || ""}
                onChange={(e) => onChange(34, e.target.value)}
                className={`ielts-select-input ${getFeedbackClass(evaluation, 34, isReview)}`}
                style={{ padding: "4px 8px", borderRadius: "6px", margin: "0 4px" }}
              >
                <option value="">(34)</option>
                {summaryBoxGroup.optionsList.map((o) => (
                  <option key={o.letter} value={o.letter}>{o.letter} - {o.text}</option>
                ))}
              </select>
              {renderFeedback(evaluation, 34, isReview)}
              {" "}governments.
            </p>
            <p style={{ margin: "12px 0 0" }}>
              To support the interests of sugar producers,{" "}
              <select
                value={answers[35] || ""}
                onChange={(e) => onChange(35, e.target.value)}
                className={`ielts-select-input ${getFeedbackClass(evaluation, 35, isReview)}`}
                style={{ padding: "4px 8px", borderRadius: "6px", margin: "0 4px" }}
              >
                <option value="">(35)</option>
                {summaryBoxGroup.optionsList.map((o) => (
                  <option key={o.letter} value={o.letter}>{o.letter} - {o.text}</option>
                ))}
              </select>
              {renderFeedback(evaluation, 35, isReview)}
              {" "}were established. As a result of this,{" "}
              <select
                value={answers[36] || ""}
                onChange={(e) => onChange(36, e.target.value)}
                className={`ielts-select-input ${getFeedbackClass(evaluation, 36, isReview)}`}
                style={{ padding: "4px 8px", borderRadius: "6px", margin: "0 4px" }}
              >
                <option value="">(36)</option>
                {summaryBoxGroup.optionsList.map((o) => (
                  <option key={o.letter} value={o.letter}>{o.letter} - {o.text}</option>
                ))}
              </select>
              {renderFeedback(evaluation, 36, isReview)}
              {" "}were penalised.
            </p>
          </div>
        </section>
      )}

      {ynnGroup && (
        <section className="ielts-question-group">
          <h4 className="ielts-group-title">{ynnGroup.title}</h4>
          <p className="ielts-instructions-text">{ynnGroup.instructions}</p>
          <div className="ielts-tf-list">
            {ynnGroup.items.map((it) => (
              <div key={it.number} className="ielts-tf-item" style={{ marginBottom: "16px" }}>
                <p className="ielts-tf-statement">
                  <span className="ielts-q-pill">{it.number}</span> {it.statement}
                </p>
                <div className="ielts-tf-options">
                  {["YES", "NO", "NOT GIVEN"].map((val) => (
                    <label
                      key={val}
                      className={`ielts-tf-option ${answers[it.number] === val ? "selected" : ""}`}
                    >
                      <input
                        type="radio"
                        name={`q_${it.number}`}
                        value={val}
                        checked={answers[it.number] === val}
                        onChange={() => onChange(it.number, val)}
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

