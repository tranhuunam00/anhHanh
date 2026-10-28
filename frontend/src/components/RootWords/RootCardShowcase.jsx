import React, { useState } from "react";
import { RootDoodleArt } from "./RootDoodleArt";
import { Headphones, CheckSquare, Sparkles } from "../Icons";
import { playPronunciationAudio } from "../../services/authVocabService";

/**
 * Thẻ hiển thị Gốc Từ Flashcard theo đúng chuẩn thiết kế
 * Prefix xanh dương, Root hồng/đỏ tím, Suffix tím
 * Minh họa doodle nét vẽ tay nhỏ xinh
 * Công thức phân tích ngữ nghĩa 1:1 theo ảnh mẫu
 */
export const RootCardShowcase = ({
  currentRoot,
  selectedWordIndex,
  onSelectWordIndex,
  isMastered,
  onToggleMastered,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!currentRoot || !Array.isArray(currentRoot.words) || currentRoot.words.length === 0) {
    return null;
  }

  const wordObj = currentRoot.words[selectedWordIndex] || currentRoot.words[0];

  const handlePlayAudio = (e) => {
    e.stopPropagation();
    if (!wordObj || isPlayingAudio) return;
    setIsPlayingAudio(true);
    playPronunciationAudio(wordObj.word, "us")
      .catch(() => {})
      .finally(() => setIsPlayingAudio(false));
  };

  // Render từng phần của từ với màu sắc tương ứng
  const renderColoredWord = () => {
    const prefixText = wordObj.prefix ? wordObj.prefix.replace(/[-]/g, "") : "";
    const rootText = wordObj.root ? wordObj.root.replace(/[-]/g, "") : "";
    const suffixText = wordObj.suffix ? wordObj.suffix.replace(/[-]/g, "") : "";

    return (
      <h1 className="root-main-word">
        {prefixText && <span className="word-part-prefix">{prefixText}</span>}
        <span className="word-part-root">{rootText}</span>
        {suffixText && <span className="word-part-suffix">{suffixText}</span>}
      </h1>
    );
  };

  return (
    <div className="root-card-showcase-wrapper">
      {/* Selector chọn từ trong cùng họ gốc từ */}
      {currentRoot.words.length > 1 && (
        <div className="root-word-pills-bar">
          <span className="root-family-label">Họ từ vựng:</span>
          <div className="root-word-pills">
            {currentRoot.words.map((w, idx) => (
              <button
                key={w.word}
                className={`root-word-pill ${idx === selectedWordIndex ? "active" : ""}`}
                onClick={() => onSelectWordIndex(idx)}
                type="button"
              >
                {w.word}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Flashcard Container */}
      <div className="root-flashcard">
        {/* Header Badge */}
        <div className="root-card-header">
          <span className="root-card-badge">{wordObj.badge}</span>
          <button
            className={`btn-mastered-toggle ${isMastered ? "mastered" : ""}`}
            onClick={onToggleMastered}
            title={isMastered ? "Đã thuộc gốc này" : "Đánh dấu đã thuộc"}
            type="button"
          >
            <CheckSquare size={16} />
            <span>{isMastered ? "Đã thuộc" : "Đánh dấu thuộc"}</span>
          </button>
        </div>

        {/* Word Title with Colored Morphemes */}
        <div className="root-word-hero-row">
          {renderColoredWord()}
          <button
            className={`btn-root-audio ${isPlayingAudio ? "playing" : ""}`}
            onClick={handlePlayAudio}
            title="Nghe phát âm chuẩn"
            type="button"
          >
            <Headphones size={20} />
          </button>
        </div>

        {/* IPA Pronunciation & Part of Speech */}
        <div className="root-ipa-meta">
          <span className="root-ipa-text">{wordObj.ipa}</span>
          {wordObj.partOfSpeech && (
            <span className="root-pos-badge">{wordObj.partOfSpeech}</span>
          )}
        </div>

        {/* Breakdown Formula Equation */}
        <div className="root-formula-box">
          {wordObj.prefix && (
            <>
              <span className="formula-prefix">
                {wordObj.prefix} = {wordObj.prefixMeaning || "tiền tố"}
              </span>
              <span className="formula-plus">+</span>
            </>
          )}
          <span className="formula-root">
            {wordObj.root} = {wordObj.rootMeaning || currentRoot.meaningVi}
          </span>
          {wordObj.suffix && (
            <>
              <span className="formula-plus">+</span>
              <span className="formula-suffix">
                {wordObj.suffix} = {wordObj.suffixMeaning || "hậu tố"}
              </span>
            </>
          )}
        </div>

        {/* Minimalist Cute Doodle Illustration */}
        <div className="root-doodle-wrapper">
          <RootDoodleArt
            doodleKey={wordObj.doodleKey || currentRoot.root}
            customImage={wordObj.customImage}
            word={wordObj.word}
          />
        </div>

        {/* Divider Line */}
        <div className="root-card-divider" />

        {/* Word Definition Equation */}
        <div className="root-meaning-equation">
          <span className="eq-word">{wordObj.word}</span>
          <span className="eq-sign">=</span>
          <span className="eq-meaning">{wordObj.meaningVi}</span>
        </div>

        {/* Example Sentence with English & Vietnamese */}
        <div className="root-example-container">
          <p className="root-example-en">"{wordObj.exampleEn}"</p>
          <p className="root-example-vi">{wordObj.exampleVi}</p>
        </div>

        {/* Bottom Root Origin Tip */}
        <div className="root-origin-tip">
          <Sparkles size={14} className="sparkle-icon" />
          <span>
            Gốc từ <strong>{currentRoot.root}</strong> ({currentRoot.origin}):{" "}
            <em>{currentRoot.meaningVi}</em> ({currentRoot.meaningEn})
          </span>
        </div>
      </div>
    </div>
  );
};
