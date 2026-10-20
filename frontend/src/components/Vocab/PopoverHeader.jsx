import React from "react";
import { IconVolume, IconClose } from "../Icons";
import { PopoverPosSelector } from "./PopoverPosSelector";

/**
 * Popover Header component containing the clean word name, multi-POS selector,
 * integrated IPA phonetic transcription, UK/US audio pronunciation buttons, and close button.
 */
export const PopoverHeader = ({
  cleanWord = "",
  customPos = "",
  onChangePos,
  activeAudio = null,
  onPlayAudio,
  onClose,
  ipa = "",
  ipaUk = "",
  ipaUs = "",
  pinyin = "",
  sourceLang = "en",
  loading = false,
}) => {
  const isChinese = /[\u4e00-\u9fff]/.test(cleanWord) || sourceLang === "zh";
  const displayPhonetic = pinyin || ipaUk || ipaUs || ipa || "";

  return (
    <div className="lookup-popover-header">
      {/* Row 1: Word Name (full width, no truncation) + Close Button */}
      <div className="lookup-popover-top-bar">
        <h4 className="lookup-word-name" title={cleanWord}>
          {cleanWord}
        </h4>
        <button
          type="button"
          className="lookup-close-btn"
          onClick={onClose}
          title="Đóng (Esc)"
        >
          <IconClose size={14} />
        </button>
      </div>

      {/* Row 2: Lean Meta Line (POS Badge + IPA/Pinyin Phonetic + Audio Chips) */}
      <div className="lookup-meta-row">
        <PopoverPosSelector
          partOfSpeech={customPos}
          onChangePos={onChangePos}
          cleanWord={cleanWord}
        />

        {!loading && displayPhonetic && (
          <span className="lookup-ipa-pill" title={isChinese ? "Phiên âm Pinyin" : "Phiên âm IPA"}>
            {displayPhonetic}
          </span>
        )}

        <div className="lookup-audio-actions">
          {isChinese ? (
            <button
              type="button"
              className={`lookup-audio-btn zh ${activeAudio === "zh" ? "playing" : ""}`}
              onClick={() => onPlayAudio("zh")}
              title="Phát âm tiếng Trung (Mandarin) • Phím tắt: Ctrl"
            >
              <span className="accent-label">ZH</span>
              <IconVolume size={11} className={activeAudio === "zh" ? "pulse-anim" : ""} />
            </button>
          ) : (
            <>
              <button
                type="button"
                className={`lookup-audio-btn uk ${activeAudio === "uk" ? "playing" : ""}`}
                onClick={() => onPlayAudio("uk")}
                title="Phát âm giọng Anh - Anh (UK)"
              >
                <span className="accent-label">UK</span>
                <IconVolume size={11} className={activeAudio === "uk" ? "pulse-anim" : ""} />
              </button>

              <button
                type="button"
                className={`lookup-audio-btn us ${activeAudio === "us" ? "playing" : ""}`}
                onClick={() => onPlayAudio("us")}
                title="Phát âm giọng Anh - Mỹ (US) • Phím tắt: Ctrl"
              >
                <span className="accent-label">US</span>
                <IconVolume size={11} className={activeAudio === "us" ? "pulse-anim" : ""} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

