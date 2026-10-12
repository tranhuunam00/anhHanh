import React from "react";
import { IconVolume, IconClose } from "../Icons";
import { PopoverPosSelector } from "./PopoverPosSelector";

/**
 * Popover Header component containing the clean word name, multi-POS selector,
 * UK/US audio pronunciation buttons, and close button.
 */
export const PopoverHeader = ({
  cleanWord = "",
  customPos = "",
  onChangePos,
  activeAudio = null,
  onPlayAudio,
  onClose,
}) => {
  return (
    <div className="lookup-popover-header">
      <div className="lookup-word-title-group">
        <span className="lookup-word-name" title={cleanWord}>
          {cleanWord}
        </span>
        <PopoverPosSelector
          partOfSpeech={customPos}
          onChangePos={onChangePos}
          cleanWord={cleanWord}
        />
      </div>

      <div className="lookup-audio-actions">
        <button
          type="button"
          className={`lookup-audio-btn uk ${activeAudio === "uk" ? "playing" : ""}`}
          onClick={() => onPlayAudio("uk")}
          title="Phát âm giọng Anh - Anh (UK)"
        >
          <span className="accent-label">UK</span>
          <IconVolume size={14} className={activeAudio === "uk" ? "pulse-anim" : ""} />
        </button>

        <button
          type="button"
          className={`lookup-audio-btn us ${activeAudio === "us" ? "playing" : ""}`}
          onClick={() => onPlayAudio("us")}
          title="Phát âm giọng Anh - Mỹ (US)"
        >
          <span className="accent-label">US</span>
          <IconVolume size={14} className={activeAudio === "us" ? "pulse-anim" : ""} />
        </button>

        <button type="button" className="lookup-close-btn" onClick={onClose} title="Đóng (Esc)">
          <IconClose size={15} />
        </button>
      </div>
    </div>
  );
};
