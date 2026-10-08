import React, { useMemo } from "react";
import { Volume2, Sparkles, Globe, ChevronDown } from "../Icons";
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
  // Filter available voices based on selected accent
  const filteredVoices = useMemo(() => {
    return filterVoicesByAccent(voices, selectedAccent);
  }, [voices, selectedAccent]);

  return (
    <div className="reader-voice-control-box">
      {/* Header bar: Title & Test Voice button */}
      <div className="reader-voice-header">
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Globe size={15} color="var(--primary)" />
          <span className="reader-voice-title">Giọng đọc &amp; Accent:</span>
        </div>

        {onTestVoice && (
          <button
            type="button"
            className="reader-voice-test-btn"
            onClick={onTestVoice}
            title="Nghe thử âm sắc & giọng đọc hiện tại"
          >
            <Volume2 size={13} />
            <span>Nghe thử</span>
          </button>
        )}
      </div>

      {/* Row 1: Accent filter chips with custom badges */}
      <div className="reader-accent-chips-grid">
        {ACCENT_OPTIONS.map((acc) => {
          const isSelected = selectedAccent === acc.code;
          return (
            <button
              key={acc.code}
              type="button"
              className={`reader-accent-chip ${isSelected ? "active" : ""} ${acc.code === "en-IN" ? "accent-indian" : ""}`}
              onClick={() => onSelectAccent(acc.code)}
              title={`Lọc giọng ${acc.label}`}
            >
              <span className="reader-chip-badge">{acc.badge}</span>
              <span className="reader-chip-label">{acc.label}</span>
            </button>
          );
        })}
      </div>

      {/* Row 2: Voice dropdown select */}
      <div className="reader-voice-dropdown-wrapper">
        <select
          className="reader-voice-dropdown"
          value={selectedVoiceUri}
          onChange={(e) => onSelectVoiceUri(e.target.value)}
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
        <span className="reader-dropdown-arrow-icon" pointerEvents="none">
          <ChevronDown size={14} color="var(--text-muted)" />
        </span>
      </div>

      {/* Row 3: Tone & Pitch Persona Presets */}
      <div className="reader-pitch-section">
        <div className="reader-pitch-header">
          <Sparkles size={13} color="var(--primary)" />
          <span className="reader-pitch-label">Phong cách ngữ điệu:</span>
        </div>

        <div className="reader-pitch-chips-wrap">
          {PITCH_PRESETS.map((p) => {
            const isSelected = pitchPreset === p.id;
            return (
              <button
                key={p.id}
                type="button"
                className={`reader-pitch-chip ${isSelected ? "active" : ""} ${p.id === "indian_style" ? "chip-indian" : ""}`}
                onClick={() => onSelectPitchPreset(p.id)}
                title={`Phong cách đọc ${p.label}`}
              >
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
