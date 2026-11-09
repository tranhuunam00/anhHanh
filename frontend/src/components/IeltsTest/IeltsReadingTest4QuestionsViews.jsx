import React from "react";
import { getFeedbackClass, renderFeedback } from "./ieltsFeedbackHelpers.jsx";
import { IeltsExerciseExplanationGroup } from "./IeltsReadingExplanationCard.jsx";

export function renderTest4Passage1Questions(groups, answers, onChange, evaluation, isReview, testId = "cambridge-21-test-4", passageText = "") {
  const tfGroup = groups?.find((g) => g.groupType === "true_false_not_given");
  const flowGroup = groups?.find((g) => g.groupType === "flowchart_completion");
  const notesGroup = groups?.find((g) => g.groupType === "notes_completion");

  const renderNoteInput = (num, placeholder = "") => (
    <span className="ielts-inline-input-wrapper">
      <span className="ielts-q-pill">{num}</span>
      <input
        type="text"
        placeholder={placeholder}
        value={answers[num] || ""}
        onChange={(e) => onChange(num, e.target.value)}
        className={`ielts-real-input ${getFeedbackClass(evaluation, num, isReview)}`}
      />
      {renderFeedback(evaluation, num, isReview)}
    </span>
  );

  return (
    <div className="ielts-questions-inner">
      {tfGroup && (
        <section className="ielts-question-group" style={{ marginBottom: "28px" }}>
          <h4 className="ielts-group-title">{tfGroup.title}</h4>
          <p className="ielts-instructions-text" style={{ whiteSpace: "pre-line" }}>{tfGroup.instruction}</p>
          <div className="ielts-tf-list">
            {tfGroup.items.map((it) => (
              <div key={it.number} className="ielts-tf-item" style={{ marginBottom: "16px" }} id={`ielts-q-${it.number}`}>
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
          <IeltsExerciseExplanationGroup group={tfGroup} evaluation={evaluation} isReview={isReview} testId={testId} passageText={passageText} />
        </section>
      )}

      {flowGroup && (
        <section className="ielts-question-group" style={{ marginBottom: "28px" }}>
          <h4 className="ielts-group-title">{flowGroup.title}</h4>
          <p className="ielts-instructions-text">{flowGroup.instruction}</p>
          <div className="ielts-flowchart-container">
            <h5 className="ielts-form-title">{flowGroup.heading}</h5>
            <div className="ielts-flowchart-steps">
              <div className="ielts-flowchart-step-box">
                <p>
                  First, place water hyacinth together with some {renderNoteInput(8)} into a digester
                </p>
              </div>
              <div className="ielts-flowchart-arrow">↓</div>
              <div className="ielts-flowchart-step-box">
                <p>
                  Leave the mixture until the {renderNoteInput(9)} is completed
                </p>
              </div>
              <div className="ielts-flowchart-arrow">↓</div>
              <div className="ielts-flowchart-step-box">
                <p>
                  Capture the gas emitted by the digester and use {renderNoteInput(10)} to transport it to individual homes
                </p>
              </div>
              <div className="ielts-flowchart-arrow">↓</div>
              <div className="ielts-flowchart-step-box final-step">
                <p>
                  Then use the gas for cooking as well as making water fit for human consumption
                </p>
              </div>
            </div>
          </div>
          <IeltsExerciseExplanationGroup group={flowGroup} evaluation={evaluation} isReview={isReview} testId={testId} passageText={passageText} />
        </section>
      )}

      {notesGroup && (
        <section className="ielts-question-group">
          <h4 className="ielts-group-title">{notesGroup.title}</h4>
          <p className="ielts-instructions-text">{notesGroup.instruction}</p>
          <div className="ielts-notes-form">
            <h5 className="ielts-form-title">{notesGroup.heading}</h5>

            <div className="ielts-form-section">
              <h6>Benefits for the women in the village of cooking with biogas</h6>
              <ul className="ielts-bullets">
                <li>no need for them to spend so much {renderNoteInput(11)} collecting fuel</li>
                <li>they can focus on different tasks that bring in {renderNoteInput(12)} .</li>
                <li>they are less likely to experience certain diseases connected to burning wood</li>
              </ul>
            </div>

            <div className="ielts-form-section">
              <h6>Drawbacks of changing to biogas</h6>
              <ul className="ielts-bullets">
                <li>the {renderNoteInput(13)} of the digesters is beyond the reach of most villages</li>
              </ul>
            </div>
          </div>
          <IeltsExerciseExplanationGroup group={notesGroup} evaluation={evaluation} isReview={isReview} testId={testId} passageText={passageText} />
        </section>
      )}
    </div>
  );
}

export function renderTest4Passage2Questions(groups, answers, onChange, evaluation, isReview, testId = "cambridge-21-test-4", passageText = "") {
  const summaryGroup = groups?.find((g) => g.groupType === "summary_words_box");
  const ynGroup = groups?.find((g) => g.groupType === "yes_no_not_given");
  const mcGroup = groups?.find((g) => g.groupType === "multiple_choice");

  return (
    <div className="ielts-questions-inner">
      {summaryGroup && (
        <section className="ielts-question-group" style={{ marginBottom: "28px" }}>
          <h4 className="ielts-group-title">{summaryGroup.title}</h4>
          <p className="ielts-instructions-text">{summaryGroup.instruction}</p>

          <div className="ielts-box-reference">
            <div className="ielts-box-options-grid">
              {summaryGroup.boxOptions.map((opt) => (
                <div key={opt.letter} className="ielts-box-option-item">
                  <span className="ielts-box-opt-letter">{opt.letter}</span>
                  <span className="ielts-box-opt-desc">{opt.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="ielts-notes-form" style={{ marginTop: "18px" }}>
            <h5 className="ielts-form-title">{summaryGroup.summaryTitle}</h5>
            <p className="ielts-summary-text-block" style={{ lineHeight: "2.1" }}>
              The city of Delhi has a{" "}
              <select
                value={answers[14] || ""}
                onChange={(e) => onChange(14, e.target.value)}
                className={`ielts-select-box-inline ${getFeedbackClass(evaluation, 14, isReview)}`}
              >
                <option value="">(14)...</option>
                {summaryGroup.boxOptions.map((opt) => (
                  <option key={opt.letter} value={opt.letter}>{opt.letter}: {opt.text}</option>
                ))}
              </select>
              {renderFeedback(evaluation, 14, isReview)} and as you walk through its streets you hear people speaking a variety of languages. Some of them have spent their entire life in Delhi, while others are{" "}
              <select
                value={answers[15] || ""}
                onChange={(e) => onChange(15, e.target.value)}
                className={`ielts-select-box-inline ${getFeedbackClass(evaluation, 15, isReview)}`}
              >
                <option value="">(15)...</option>
                {summaryGroup.boxOptions.map((opt) => (
                  <option key={opt.letter} value={opt.letter}>{opt.letter}: {opt.text}</option>
                ))}
              </select>
              {renderFeedback(evaluation, 15, isReview)} . Whether they have come from a{" "}
              <select
                value={answers[16] || ""}
                onChange={(e) => onChange(16, e.target.value)}
                className={`ielts-select-box-inline ${getFeedbackClass(evaluation, 16, isReview)}`}
              >
                <option value="">(16)...</option>
                {summaryGroup.boxOptions.map((opt) => (
                  <option key={opt.letter} value={opt.letter}>{opt.letter}: {opt.text}</option>
                ))}
              </select>
              {renderFeedback(evaluation, 16, isReview)} or have travelled from the other side of India, they have all come in search of things such as improved{" "}
              <select
                value={answers[17] || ""}
                onChange={(e) => onChange(17, e.target.value)}
                className={`ielts-select-box-inline ${getFeedbackClass(evaluation, 17, isReview)}`}
              >
                <option value="">(17)...</option>
                {summaryGroup.boxOptions.map((opt) => (
                  <option key={opt.letter} value={opt.letter}>{opt.letter}: {opt.text}</option>
                ))}
              </select>
              {renderFeedback(evaluation, 17, isReview)} .
            </p>

            <p className="ielts-summary-text-block" style={{ lineHeight: "2.1", marginTop: "14px" }}>
              A team of researchers led by Professor Ianthi Tsimpli of Cambridge University is collecting data on primary-age schoolchildren in Delhi and other Indian cities. The{" "}
              <select
                value={answers[18] || ""}
                onChange={(e) => onChange(18, e.target.value)}
                className={`ielts-select-box-inline ${getFeedbackClass(evaluation, 18, isReview)}`}
              >
                <option value="">(18)...</option>
                {summaryGroup.boxOptions.map((opt) => (
                  <option key={opt.letter} value={opt.letter}>{opt.letter}: {opt.text}</option>
                ))}
              </select>
              {renderFeedback(evaluation, 18, isReview)} of the research is to discover why multilingual Indian schoolchildren do not experience{" "}
              <select
                value={answers[19] || ""}
                onChange={(e) => onChange(19, e.target.value)}
                className={`ielts-select-box-inline ${getFeedbackClass(evaluation, 19, isReview)}`}
              >
                <option value="">(19)...</option>
                {summaryGroup.boxOptions.map((opt) => (
                  <option key={opt.letter} value={opt.letter}>{opt.letter}: {opt.text}</option>
                ))}
              </select>
              {renderFeedback(evaluation, 19, isReview)} to those that multilingual schoolchildren in Europe experience.
            </p>
          </div>
          <IeltsExerciseExplanationGroup group={summaryGroup} evaluation={evaluation} isReview={isReview} testId={testId} passageText={passageText} />
        </section>
      )}

      {ynGroup && (
        <section className="ielts-question-group" style={{ marginBottom: "28px" }}>
          <h4 className="ielts-group-title">{ynGroup.title}</h4>
          <p className="ielts-instructions-text" style={{ whiteSpace: "pre-line" }}>{ynGroup.instruction}</p>
          <div className="ielts-tf-list">
            {ynGroup.items.map((it) => (
              <div key={it.number} className="ielts-tf-item" style={{ marginBottom: "16px" }} id={`ielts-q-${it.number}`}>
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
          <IeltsExerciseExplanationGroup group={ynGroup} evaluation={evaluation} isReview={isReview} testId={testId} passageText={passageText} />
        </section>
      )}

      {mcGroup && (
        <section className="ielts-question-group">
          <h4 className="ielts-group-title">{mcGroup.title}</h4>
          <p className="ielts-instructions-text">{mcGroup.instruction}</p>
          {mcGroup.items.map((item) => (
            <div key={item.number} className="ielts-mc-item" id={`ielts-q-${item.number}`} style={{ marginBottom: "20px" }}>
              <p className="ielts-prompt-text">
                <span className="ielts-q-pill">{item.number}</span> {item.prompt}
              </p>
              <div className="ielts-options-list">
                {item.options.map((opt) => (
                  <label key={opt.letter} className={`ielts-radio-label ${answers[item.number] === opt.letter ? "checked" : ""}`}>
                    <input
                      type="radio"
                      name={`q_${item.number}`}
                      value={opt.letter}
                      checked={answers[item.number] === opt.letter}
                      onChange={() => onChange(item.number, opt.letter)}
                    />
                    <span className="ielts-opt-letter">{opt.letter}</span>
                    <span className="ielts-opt-text">{opt.text}</span>
                  </label>
                ))}
              </div>
              {renderFeedback(evaluation, item.number, isReview)}
            </div>
          ))}
          <IeltsExerciseExplanationGroup group={mcGroup} evaluation={evaluation} isReview={isReview} testId={testId} passageText={passageText} />
        </section>
      )}
    </div>
  );
}

export function renderTest4Passage3Questions(groups, answers, onChange, evaluation, isReview, testId = "cambridge-21-test-4", passageText = "") {
  const summaryGroup = groups?.find((g) => g.groupType === "summary_words_box");
  const ynGroup = groups?.find((g) => g.groupType === "yes_no_not_given");
  const mcGroup = groups?.find((g) => g.groupType === "multiple_choice");

  return (
    <div className="ielts-questions-inner">
      {summaryGroup && (
        <section className="ielts-question-group" style={{ marginBottom: "28px" }}>
          <h4 className="ielts-group-title">{summaryGroup.title}</h4>
          <p className="ielts-instructions-text">{summaryGroup.instruction}</p>

          <div className="ielts-box-reference">
            <div className="ielts-box-options-grid">
              {summaryGroup.boxOptions.map((opt) => (
                <div key={opt.letter} className="ielts-box-option-item">
                  <span className="ielts-box-opt-letter">{opt.letter}</span>
                  <span className="ielts-box-opt-desc">{opt.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="ielts-notes-form" style={{ marginTop: "18px" }}>
            <h5 className="ielts-form-title">{summaryGroup.summaryTitle}</h5>
            <p className="ielts-summary-text-block" style={{ lineHeight: "2.1" }}>
              Peter Bellerby's plan to give his father a globe for his birthday was an unexpectedly{" "}
              <select
                value={answers[27] || ""}
                onChange={(e) => onChange(27, e.target.value)}
                className={`ielts-select-box-inline ${getFeedbackClass(evaluation, 27, isReview)}`}
              >
                <option value="">(27)...</option>
                {summaryGroup.boxOptions.map((opt) => (
                  <option key={opt.letter} value={opt.letter}>{opt.letter}: {opt.text}</option>
                ))}
              </select>
              {renderFeedback(evaluation, 27, isReview)} for which he had to overcome{" "}
              <select
                value={answers[28] || ""}
                onChange={(e) => onChange(28, e.target.value)}
                className={`ielts-select-box-inline ${getFeedbackClass(evaluation, 28, isReview)}`}
              >
                <option value="">(28)...</option>
                {summaryGroup.boxOptions.map((opt) => (
                  <option key={opt.letter} value={opt.letter}>{opt.letter}: {opt.text}</option>
                ))}
              </select>
              {renderFeedback(evaluation, 28, isReview)} . He soon learnt that a straightforward{" "}
              <select
                value={answers[29] || ""}
                onChange={(e) => onChange(29, e.target.value)}
                className={`ielts-select-box-inline ${getFeedbackClass(evaluation, 29, isReview)}`}
              >
                <option value="">(29)...</option>
                {summaryGroup.boxOptions.map((opt) => (
                  <option key={opt.letter} value={opt.letter}>{opt.letter}: {opt.text}</option>
                ))}
              </select>
              {renderFeedback(evaluation, 29, isReview)} would not be possible. Some{" "}
              <select
                value={answers[30] || ""}
                onChange={(e) => onChange(30, e.target.value)}
                className={`ielts-select-box-inline ${getFeedbackClass(evaluation, 30, isReview)}`}
              >
                <option value="">(30)...</option>
                {summaryGroup.boxOptions.map((opt) => (
                  <option key={opt.letter} value={opt.letter}>{opt.letter}: {opt.text}</option>
                ))}
              </select>
              {renderFeedback(evaluation, 30, isReview)} that had been intended for{" "}
              <select
                value={answers[31] || ""}
                onChange={(e) => onChange(31, e.target.value)}
                className={`ielts-select-box-inline ${getFeedbackClass(evaluation, 31, isReview)}`}
              >
                <option value="">(31)...</option>
                {summaryGroup.boxOptions.map((opt) => (
                  <option key={opt.letter} value={opt.letter}>{opt.letter}: {opt.text}</option>
                ))}
              </select>
              {renderFeedback(evaluation, 31, isReview)} were available, as were some expensive antique globes, but these were beyond his budget. He even travelled to places where people might still have the{" "}
              <select
                value={answers[32] || ""}
                onChange={(e) => onChange(32, e.target.value)}
                className={`ielts-select-box-inline ${getFeedbackClass(evaluation, 32, isReview)}`}
              >
                <option value="">(32)...</option>
                {summaryGroup.boxOptions.map((opt) => (
                  <option key={opt.letter} value={opt.letter}>{opt.letter}: {opt.text}</option>
                ))}
              </select>
              {renderFeedback(evaluation, 32, isReview)} , but Bellerby could not find what he wanted.
            </p>
          </div>
          <IeltsExerciseExplanationGroup group={summaryGroup} evaluation={evaluation} isReview={isReview} testId={testId} passageText={passageText} />
        </section>
      )}

      {ynGroup && (
        <section className="ielts-question-group" style={{ marginBottom: "28px" }}>
          <h4 className="ielts-group-title">{ynGroup.title}</h4>
          <p className="ielts-instructions-text" style={{ whiteSpace: "pre-line" }}>{ynGroup.instruction}</p>
          <div className="ielts-tf-list">
            {ynGroup.items.map((it) => (
              <div key={it.number} className="ielts-tf-item" style={{ marginBottom: "16px" }} id={`ielts-q-${it.number}`}>
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
          <IeltsExerciseExplanationGroup group={ynGroup} evaluation={evaluation} isReview={isReview} testId={testId} passageText={passageText} />
        </section>
      )}

      {mcGroup && (
        <section className="ielts-question-group">
          <h4 className="ielts-group-title">{mcGroup.title}</h4>
          <p className="ielts-instructions-text">{mcGroup.instruction}</p>
          {mcGroup.items.map((item) => (
            <div key={item.number} className="ielts-mc-item" id={`ielts-q-${item.number}`} style={{ marginBottom: "20px" }}>
              <p className="ielts-prompt-text">
                <span className="ielts-q-pill">{item.number}</span> {item.prompt}
              </p>
              <div className="ielts-options-list">
                {item.options.map((opt) => (
                  <label key={opt.letter} className={`ielts-radio-label ${answers[item.number] === opt.letter ? "checked" : ""}`}>
                    <input
                      type="radio"
                      name={`q_${item.number}`}
                      value={opt.letter}
                      checked={answers[item.number] === opt.letter}
                      onChange={() => onChange(item.number, opt.letter)}
                    />
                    <span className="ielts-opt-letter">{opt.letter}</span>
                    <span className="ielts-opt-text">{opt.text}</span>
                  </label>
                ))}
              </div>
              {renderFeedback(evaluation, item.number, isReview)}
            </div>
          ))}
          <IeltsExerciseExplanationGroup group={mcGroup} evaluation={evaluation} isReview={isReview} testId={testId} passageText={passageText} />
        </section>
      )}
    </div>
  );
}

