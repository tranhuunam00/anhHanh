import React, { useState, useEffect } from "react";
import { CheckSquare, RefreshCw, Sparkles, BookOpen } from "../Icons";
import { checkAssemblyAnswer, checkQuizAnswer } from "../../utils/rootWordsUtils";

/**
 * Phần bài tập thực hành được tách riêng biệt ở phía dưới
 * 3 Chế độ: Ghép gốc tạo từ, Điền từ vào câu, Trắc nghiệm ý nghĩa
 */
export const RootExerciseSection = ({ currentRoot, onMasteredSuccess }) => {
  const [exerciseMode, setExerciseMode] = useState("assembly"); // assembly | fill_blank | meaning
  const [assemblySelected, setAssemblySelected] = useState([]);
  const [assemblyResult, setAssemblyResult] = useState(null); // 'correct' | 'wrong' | null

  const [quizSelected, setQuizSelected] = useState(null);
  const [quizResult, setQuizResult] = useState(null); // 'correct' | 'wrong' | null

  // Reset exercise states khi chuyển gốc từ hoặc chuyển bài tập
  useEffect(() => {
    setAssemblySelected([]);
    setAssemblyResult(null);
    setQuizSelected(null);
    setQuizResult(null);
  }, [currentRoot?.id, exerciseMode]);

  const exercises = currentRoot && Array.isArray(currentRoot.exercises) ? currentRoot.exercises : [];
  const assemblyEx = exercises.find((e) => e.type === "assembly") || exercises[0] || null;
  const fillBlankEx = exercises.find((e) => e.type === "fill_blank") || exercises[1] || exercises[0] || null;
  const meaningEx = exercises.find((e) => e.type === "meaning") || exercises[2] || exercises[0] || null;

  // Ghép các thẻ chip cho bài tập Assembly (gồm đáp án đúng + thẻ gây nhiễu)
  const assemblyChips = React.useMemo(() => {
    if (!assemblyEx) return [];
    const correctParts = (assemblyEx.parts || []).map((p) => p.text);
    const distractors = assemblyEx.distractors || [];
    const all = [...correctParts, ...distractors];
    return all.sort();
  }, [assemblyEx]);

  if (!currentRoot || exercises.length === 0) {
    return null;
  }

  // Logic Ghép Gốc Tạo Từ
  const handleChipClick = (partText) => {
    if (assemblyResult === "correct") return;
    if (assemblySelected.includes(partText)) {
      setAssemblySelected(assemblySelected.filter((p) => p !== partText));
    } else {
      setAssemblySelected([...assemblySelected, partText]);
    }
    setAssemblyResult(null);
  };

  const handleCheckAssembly = () => {
    if (!assemblyEx) return;
    const isCorrect = checkAssemblyAnswer(assemblySelected, assemblyEx.correctWord);
    setAssemblyResult(isCorrect ? "correct" : "wrong");
    if (isCorrect && onMasteredSuccess) {
      onMasteredSuccess();
    }
  };

  const handleResetAssembly = () => {
    setAssemblySelected([]);
    setAssemblyResult(null);
  };

  // Logic Chọn Trắc nghiệm / Điền từ
  const handleSelectQuizOption = (option, correctValue) => {
    if (quizResult === "correct") return;
    setQuizSelected(option);
    const isCorrect = checkQuizAnswer(option, correctValue);
    setQuizResult(isCorrect ? "correct" : "wrong");
    if (isCorrect && onMasteredSuccess) {
      onMasteredSuccess();
    }
  };

  return (
    <section className="root-exercise-section">
      <div className="exercise-section-header">
        <div className="exercise-title-badge">
          <BookOpen size={18} className="exercise-icon" />
          <h2 className="exercise-heading">
            BÀI TẬP THỰC HÀNH GỐC TỪ: <span className="highlight-root">{currentRoot.root}</span>
          </h2>
        </div>
        <p className="exercise-subtitle">
          Luyện phản xạ tư duy tiền tố & gốc từ ngay bên dưới để ghi nhớ sâu bản chất từ vựng
        </p>

        {/* Tab chuyển đổi dạng bài tập */}
        <div className="exercise-mode-tabs">
          <button
            className={`mode-tab-btn ${exerciseMode === "assembly" ? "active" : ""}`}
            onClick={() => setExerciseMode("assembly")}
            type="button"
          >
            1. Ghép Gốc Tạo Từ
          </button>
          <button
            className={`mode-tab-btn ${exerciseMode === "fill_blank" ? "active" : ""}`}
            onClick={() => setExerciseMode("fill_blank")}
            type="button"
          >
            2. Điền Từ Vào Câu
          </button>
          <button
            className={`mode-tab-btn ${exerciseMode === "meaning" ? "active" : ""}`}
            onClick={() => setExerciseMode("meaning")}
            type="button"
          >
            3. Trắc Nghiệm Ý Nghĩa
          </button>
        </div>
      </div>

      <div className="exercise-body-card">
        {/* DẠNG 1: GHÉP GỐC TẠO TỪ */}
        {exerciseMode === "assembly" && assemblyEx && (
          <div className="assembly-exercise-container">
            <p className="exercise-prompt-text">{assemblyEx.prompt}</p>

            {/* Khung lắp ráp từ vựng */}
            <div className="assembly-dropzone">
              <span className="dropzone-label">Các phần đã ghép:</span>
              <div className="assembled-parts-row">
                {assemblySelected.length === 0 ? (
                  <span className="assembled-placeholder">Nhấp vào các mảnh ghép bên dưới để xếp từ...</span>
                ) : (
                  assemblySelected.map((part) => (
                    <span
                      key={part}
                      className="assembled-tag"
                      onClick={() => handleChipClick(part)}
                      title="Nhấp để gỡ mảnh ghép"
                    >
                      {part}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Các mảnh ghép để chọn */}
            <div className="assembly-chips-palette">
              <span className="palette-label">Mảnh ghép khả dụng:</span>
              <div className="chips-grid">
                {assemblyChips.map((chip) => {
                  const isChosen = assemblySelected.includes(chip);
                  return (
                    <button
                      key={chip}
                      className={`assembly-chip-btn ${isChosen ? "chosen" : ""}`}
                      onClick={() => handleChipClick(chip)}
                      type="button"
                      disabled={isChosen}
                    >
                      {chip}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Nút hành động */}
            <div className="exercise-actions-bar">
              <button
                className="btn-exercise-check"
                onClick={handleCheckAssembly}
                disabled={assemblySelected.length === 0 || assemblyResult === "correct"}
                type="button"
              >
                <CheckSquare size={16} />
                <span>Kiểm tra đáp án</span>
              </button>
              <button
                className="btn-exercise-reset"
                onClick={handleResetAssembly}
                type="button"
                title="Làm lại bài ghép từ"
              >
                <RefreshCw size={15} />
                <span>Làm lại</span>
              </button>
            </div>

            {/* Thông báo kết quả */}
            {assemblyResult === "correct" && (
              <div className="exercise-feedback success">
                <Sparkles size={18} className="feedback-icon" />
                <div>
                  <strong>Chính xác!</strong> {assemblyEx.explanation}
                </div>
              </div>
            )}
            {assemblyResult === "wrong" && (
              <div className="exercise-feedback wrong">
                <div>
                  <strong>Chưa đúng rồi!</strong> Thử đổi thứ tự hoặc chọn lại các tiền tố/gốc từ khác nhé.
                </div>
              </div>
            )}
          </div>
        )}

        {/* DẠNG 2: ĐIỀN TỪ VÀO CÂU */}
        {exerciseMode === "fill_blank" && fillBlankEx && (
          <div className="fill-blank-exercise-container">
            <p className="exercise-prompt-text">
              Chọn từ thích hợp chứa gốc <strong>{currentRoot.root}</strong> để hoàn thành câu:
            </p>
            <div className="blank-sentence-box">
              <span className="quote-mark">“</span>
              {fillBlankEx.sentence}
              <span className="quote-mark">”</span>
            </div>

            <div className="quiz-options-grid">
              {(fillBlankEx.options || []).map((opt) => {
                const isSelected = quizSelected === opt;
                let optClass = "quiz-opt-btn";
                if (isSelected) {
                  optClass += quizResult === "correct" ? " correct" : " wrong";
                }
                return (
                  <button
                    key={opt}
                    className={optClass}
                    onClick={() => handleSelectQuizOption(opt, fillBlankEx.correctWord)}
                    type="button"
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {quizResult === "correct" && (
              <div className="exercise-feedback success">
                <Sparkles size={18} className="feedback-icon" />
                <div>
                  <strong>Tuyệt vời!</strong> {fillBlankEx.explanation}
                </div>
              </div>
            )}
            {quizResult === "wrong" && (
              <div className="exercise-feedback wrong">
                <div>
                  <strong>Chưa chính xác!</strong> Hãy đọc lại ngữ cảnh câu văn và thử lại lựa chọn khác.
                </div>
              </div>
            )}
          </div>
        )}

        {/* DẠNG 3: TRẮC NGHIỆM Ý NGHĨA GỐC TỪ */}
        {exerciseMode === "meaning" && meaningEx && (
          <div className="meaning-exercise-container">
            <p className="exercise-prompt-text">{meaningEx.question}</p>
            <div className="quiz-options-list">
              {(meaningEx.options || []).map((opt, idx) => {
                const isSelected = quizSelected === idx;
                let optClass = "quiz-list-btn";
                if (isSelected) {
                  optClass += quizResult === "correct" ? " correct" : " wrong";
                }
                return (
                  <button
                    key={opt}
                    className={optClass}
                    onClick={() => handleSelectQuizOption(idx, meaningEx.correctIndex)}
                    type="button"
                  >
                    <span className="opt-letter">{String.fromCharCode(65 + idx)}.</span>
                    <span className="opt-text">{opt}</span>
                  </button>
                );
              })}
            </div>

            {quizResult === "correct" && (
              <div className="exercise-feedback success">
                <Sparkles size={18} className="feedback-icon" />
                <div>
                  <strong>Chính xác!</strong> {meaningEx.explanation}
                </div>
              </div>
            )}
            {quizResult === "wrong" && (
              <div className="exercise-feedback wrong">
                <div>
                  <strong>Chưa chính xác!</strong> Hãy xem lại thẻ gốc từ ở phía trên để tìm gợi ý.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
