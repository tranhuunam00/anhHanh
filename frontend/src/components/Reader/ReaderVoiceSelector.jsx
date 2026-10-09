import React, { useMemo } from "react";
import { Volume2, Globe, ChevronDown } from "../Icons";
import {
  ACCENT_OPTIONS,
  PITCH_PRESETS,
  filterVoicesByAccent,
  formatVoiceLabel,
} from "../../utils/readerVoices";

export const ReaderVoiceSelector = ({
  voices = [],
  selectedVoiceUri = "",
  onSelectVoiceUri,
  selectedAccent = "ALL",
  onSelectAccent,
  pitchPreset = "standard",
  onSelectPitchPreset,
  onTestVoice,
}) => {
  // Filter available voices based on selected accent (including high-fidelity Edge Neural AI voices)
  const filteredVoices = useMemo(() => {
    return filterVoicesByAccent(voices, selectedAccent, { includeEdgeAI: true });
  }, [voices, selectedAccent]);

  return (
    <div className="reader-voice-control-box">
      {/* Row 1: Title & Test Voice button */}
      <div className="reader-voice-header">
        <div className="reader-voice-title-wrap">
          <Globe size={13} color="var(--primary)" />
          <span className="reader-voice-title">Giọng đọc</span>
        </div>

        {onTestVoice && (
          <button
            type="button"
            className="reader-voice-test-btn"
            onClick={onTestVoice}
            title="Nghe thử giọng đọc"
          >
            <Volume2 size={12} />
            <span>Thử giọng</span>
          </button>
        )}
      </div>

      {/* Row 2: Segmented Accent Tabs (5 equal-width columns) */}
      <div className="reader-accent-segmented-bar" role="tablist">
        {ACCENT_OPTIONS.map((acc) => {
          const isSelected = selectedAccent === acc.code;
          return (
            <button
              key={acc.code}
              type="button"
              className={`reader-accent-seg-btn ${isSelected ? "active" : ""} ${acc.code === "en-IN" ? "is-indian" : ""}`}
              onClick={() => onSelectAccent(acc.code)}
              title={`Ngữ điệu ${acc.label}`}
            >
              {acc.label}
            </button>
          );
        })}
      </div>

      {/* Row 3: Voice dropdown select */}
      <div className="reader-voice-dropdown-wrapper">
        <select
          className="reader-voice-dropdown"
          value={selectedVoiceUri}
          onChange={(e) => onSelectVoiceUri(e.target.value)}
          title="Chọn diễn đọc viên"
        >
          {filteredVoices.length === 0 ? (
            <option value="">Giọng hệ thống mặc định</option>
          ) : (
            filteredVoices.map((v) => (
              <option key={v.voiceURI || v.name} value={v.voiceURI || v.name}>
                {formatVoiceLabel(v)}
              </option>
            ))
          )}
        </select>
        <span className="reader-dropdown-arrow-icon" aria-hidden="true">
          <ChevronDown size={13} color="var(--text-muted)" />
        </span>
      </div>

      {/* Row 4: Tone / Pitch Persona Segmented Bar (4 equal-width columns) */}
      <div className="reader-pitch-block">
        <div className="reader-pitch-header">
          <span className="reader-pitch-label">Ngữ điệu:</span>
        </div>
        <div className="reader-pitch-segmented-bar" role="tablist">
          {PITCH_PRESETS.map((p) => {
            const isSelected = pitchPreset === p.id;
            return (
              <button
                key={p.id}
                type="button"
                className={`reader-pitch-seg-btn ${isSelected ? "active" : ""} ${p.id === "indian_style" ? "is-indian" : ""}`}
                onClick={() => onSelectPitchPreset(p.id)}
                title={`Phong cách đọc ${p.label}`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
