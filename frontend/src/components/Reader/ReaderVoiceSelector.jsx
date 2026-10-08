import React, { useMemo } from "react";
import { Volume2, Sparkles, Globe } from "../Icons";
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
      <div className="reader-voice-header">
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Globe size={14} color="var(--primary)" />
          <span className="reader-voice-title">Giọng đọc &amp; Accent:</span>
        </div>

        {onTestVoice && (
          <button
            type="button"
            className="reader-voice-test-btn"
            onClick={onTestVoice}
            title="Nghe thử giọng đọc đã chọn"
          >
            <Volume2 size={12} />
            <span>Thử giọng</span>
          </button>
        )}
      </div>

      {/* Row 1: Accent quick pills (Mỹ, Anh, Úc, Ấn Độ...) */}
      <div className="reader-accent-pills-row">
        {ACCENT_OPTIONS.map((acc) => {
          const isSelected = selectedAccent === acc.code;
          return (
            <button
              key={acc.code}
              type="button"
              className={`reader-accent-pill ${isSelected ? "active" : ""}`}
              onClick={() => onSelectAccent(acc.code)}
              title={acc.label}
            >
              <span style={{ marginRight: 3 }}>{acc.flag}</span>
              <span>{acc.label}</span>
            </button>
          );
        })}
      </div>

      {/* Row 2: Voice dropdown select */}
      <div className="reader-voice-select-wrap">
        <select
          className="reader-voice-select"
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
      </div>

      {/* Row 3: Tone & Pitch Persona Presets (Trầm ấm, Trẻ trung, Kể chuyện...) */}
      <div className="reader-pitch-row">
        <span className="reader-pitch-label">
          <Sparkles size={12} style={{ marginRight: 3, verticalAlign: "middle" }} />
          Phong cách:
        </span>
        <div className="reader-pitch-pills">
          {PITCH_PRESETS.map((p) => {
            const isSelected = pitchPreset === p.id;
            return (
              <button
                key={p.id}
                type="button"
                className={`reader-pitch-pill ${isSelected ? "active" : ""}`}
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
