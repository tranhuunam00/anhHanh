import React, { useState } from "react";
import { Target, HelpCircle, Check, X } from "../../Icons";
import { playSoundFeedback } from "../../../utils/vocabAudioFeedback";

export const VocabExerciseAIStoryQuiz = ({
  clozeQuestions = [],
  comprehensionQuestions = [],
}) => {
  // Cloze answers: { [qIdx]: { chosen: string, isCorrect: boolean } }
  const [clozeAnswers, setClozeAnswers] = useState({});
  const [clozeScore, setClozeScore] = useState(0);

  // Comprehension answers: { [qIdx]: { chosen: string, isCorrect: boolean } }
  const [compAnswers, setCompAnswers] = useState({});
  const [compScore, setCompScore] = useState(0);

  // Handle Cloze answer
  const handleSelectClozeOption = (qIdx, chosenOpt, correctWord) => {
    if (clozeAnswers[qIdx] !== undefined) return;

    const isCorrect = chosenOpt.trim().toLowerCase() === correctWord.trim().toLowerCase();
    playSoundFeedback(isCorrect);

    setClozeAnswers((prev) => ({
      ...prev,
      [qIdx]: { chosen: chosenOpt, isCorrect },
    }));

    if (isCorrect) {
      setClozeScore((s) => s + 1);
    }
  };

  // Handle Comprehension answer
  const handleSelectCompOption = (qIdx, chosenOpt, correctAnswer) => {
    if (compAnswers[qIdx] !== undefined) return;

    const isCorrect = chosenOpt.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
    playSoundFeedback(isCorrect);

    setCompAnswers((prev) => ({
      ...prev,
      [qIdx]: { chosen: chosenOpt, isCorrect },
    }));

    if (isCorrect) {
      setCompScore((s) => s + 1);
    }
  };

  const hasCloze = Array.isArray(clozeQuestions) && clozeQuestions.length > 0;
  const hasComp = Array.isArray(comprehensionQuestions) && comprehensionQuestions.length > 0;

  if (!hasCloze && !hasComp) {
    return null;
  }

  return (
    <div className="ai-quiz-section">
      {/* 1. CLOZE FILL-IN-THE-BLANK CHALLENGE */}
      {hasCloze && (
        <div className="ai-quiz-block">
          <div className="ai-quiz-block-header">
            <div className="ai-quiz-icon-badge">
              <Target size={18} color="var(--primary)" />
            </div>
            <h4 className="ai-quiz-section-title">
              Thử thách điền từ khuyết theo ngữ cảnh ({clozeScore} / {clozeQuestions.length})
            </h4>
          </div>

          <div className="ai-quiz-list">
            {clozeQuestions.map((q, qIdx) => {
              const answered = clozeAnswers[qIdx];
              return (
                <div key={qIdx} className="ai-quiz-card">
                  <div className="ai-quiz-question-text">
                    <span className="ai-quiz-num">{qIdx + 1}.</span> {q.sentence}
                    {q.hint && (
                      <span className="ai-quiz-hint">
                        (Gợi ý: {q.hint})
                      </span>
                    )}
                  </div>

                  <div className="ai-quiz-options-grid">
                    {(q.options || []).map((opt, optIdx) => {
                      let btnClass = "btn-ai-option";
                      const isOptionCorrect = opt.trim().toLowerCase() === q.correct_word.trim().toLowerCase();

                      if (answered) {
                        if (isOptionCorrect) {
                          btnClass += " correct";
                        } else if (answered.chosen === opt) {
                          btnClass += " wrong";
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          className={btnClass}
                          disabled={Boolean(answered)}
                          onClick={() => handleSelectClozeOption(qIdx, opt, q.correct_word)}
                        >
                          <span className="ai-opt-label">{String.fromCharCode(65 + optIdx)}.</span>
                          <span className="ai-opt-text">{opt}</span>
                          {answered && isOptionCorrect && <Check size={16} className="ai-feedback-icon" />}
                          {answered && !isOptionCorrect && answered.chosen === opt && (
                            <X size={16} className="ai-feedback-icon" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. READING COMPREHENSION QUESTIONS */}
      {hasComp && (
        <div className="ai-quiz-block ai-comp-block">
          <div className="ai-quiz-block-header">
            <div className="ai-quiz-icon-badge">
              <HelpCircle size={18} color="var(--primary)" />
            </div>
            <h4 className="ai-quiz-section-title">
              Câu hỏi đọc hiểu bài đọc ({compScore} / {comprehensionQuestions.length})
            </h4>
          </div>

          <div className="ai-quiz-list">
            {comprehensionQuestions.map((cq, cqIdx) => {
              const answered = compAnswers[cqIdx];
              const isCorrectAnswer = (opt) =>
                opt.trim().toLowerCase() === (cq.correct_answer || "").trim().toLowerCase();

              return (
                <div key={cqIdx} className="ai-quiz-card ai-comp-card">
                  <div className="ai-quiz-question-text ai-comp-question-text">
                    <span className="ai-quiz-num">Q{cqIdx + 1}.</span> {cq.question}
                  </div>

                  <div className="ai-quiz-options-grid">
                    {(cq.options || []).map((opt, optIdx) => {
                      let btnClass = "btn-ai-option";
                      const optIsRight = isCorrectAnswer(opt);

                      if (answered) {
                        if (optIsRight) {
                          btnClass += " correct";
                        } else if (answered.chosen === opt) {
                          btnClass += " wrong";
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          className={btnClass}
                          disabled={Boolean(answered)}
                          onClick={() => handleSelectCompOption(cqIdx, opt, cq.correct_answer)}
                        >
                          <span className="ai-opt-label">{String.fromCharCode(65 + optIdx)}.</span>
                          <span className="ai-opt-text">{opt}</span>
                          {answered && optIsRight && <Check size={16} className="ai-feedback-icon" />}
                          {answered && !optIsRight && answered.chosen === opt && (
                            <X size={16} className="ai-feedback-icon" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {answered && cq.explanation && (
                    <div className="ai-comp-explanation">
                      <strong>Giải thích:</strong> {cq.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
