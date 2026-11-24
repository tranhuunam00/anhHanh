import React, { useState, useEffect, useCallback } from "react";
import {
  Google,
  Sparkles,
  ExternalLink,
  X,
  Volume2,
  Check,
  Search,
} from "../../Icons";
import { fetchGoogleAiWordOverview } from "../../../services/authVocabService";
import { getVoiceLang } from "../../../utils/languageVoices";
import { cleanGoogleAiWord, shouldShowGoogleAiModal } from "../../../utils/googleAiWordModalUtils";
import { GoogleSearchSheet } from "./GoogleSearchSheet";
import { GoogleAiKeyWords } from "./GoogleAiKeyWords";
import "./GoogleAiWordModal.css";

export const GoogleAiWordModal = ({
  isOpen = true,
  word,
  sourceLang = "en",
  targetLang = "vi",
  onClose,
}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSpeech, setActiveSpeech] = useState(null);
  const [googleSheetWord, setGoogleSheetWord] = useState("");
  const isGoogleSheetOpen = Boolean(googleSheetWord);

  const cleanWord = cleanGoogleAiWord(word);
  const isVisible = shouldShowGoogleAiModal(isOpen, word);

  const playAudio = useCallback(
    (textToSpeak, lang = "en") => {
      if (typeof window === "undefined" || !("speechSynthesis" in window) || !textToSpeak) return;
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(textToSpeak);
        utter.lang = getVoiceLang(lang, textToSpeak);
        utter.rate = 0.9;
        utter.onstart = () => setActiveSpeech(textToSpeak);
        utter.onend = () => setActiveSpeech(null);
        utter.onerror = () => setActiveSpeech(null);
        window.speechSynthesis.speak(utter);
      } catch {
        setActiveSpeech(null);
      }
    },
    []
  );

  useEffect(() => {
    let isMounted = true;
    if (!isVisible) return;

    setLoading(true);
    fetchGoogleAiWordOverview(cleanWord, sourceLang, targetLang).then((res) => {
      if (isMounted) {
        setData(res);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [isVisible, cleanWord, sourceLang, targetLang]);

  // Keyboard shortcut: ESC to dismiss immediately
  useEffect(() => {
    if (!isVisible || isGoogleSheetOpen) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, isGoogleSheetOpen, onClose]);

  const googleUrl =
    data?.google_search_url ||
    `https://www.google.com/search?q=${encodeURIComponent(cleanWord + " là gì và gốc, họ của nó")}`;

  // Show real Google inside the app (one-tap close) instead of switching tabs.
  const handleOpenGoogle = (e) => {
    e.preventDefault();
    setGoogleSheetWord(cleanWord);
  };
  const closeGoogleSheet = useCallback(() => setGoogleSheetWord(""), []);

  if (!isVisible) return null;

  return (
    <>
    <div className="google-ai-modal-backdrop" onClick={onClose}>
      <div
        className="google-ai-modal-window"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header Bar */}
        <div className="google-ai-header">
          <div className="google-ai-header-left">
            <span className="google-ai-logo-pill">
              <Google size={16} />
              <span>Google</span>
            </span>
            <span className="google-ai-search-query" title={`${cleanWord} là gì và gốc, họ của nó`}>
              {cleanWord} là gì và gốc, họ của nó
            </span>
          </div>

          <div className="google-ai-header-actions">
            <a
              href={googleUrl}
              onClick={handleOpenGoogle}
              target="_blank"
              rel="noopener noreferrer"
              className="google-ai-btn-external"
              title="Xem Google ngay trong ShotLang"
            >
              <span>Mở Google</span>
              <ExternalLink size={13} />
            </a>

            <button
              type="button"
              className="google-ai-btn-close"
              onClick={onClose}
              title="Đóng bảng tra cứu"
              aria-label="Đóng"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="google-ai-body">
          {/* AI Sparkle Badge */}
          <div className="google-ai-sparkle-badge">
            <Sparkles size={18} className="google-ai-sparkle-icon" />
            <span>Thông tin tổng quan do AI tạo</span>
          </div>

          {loading ? (
            <div className="google-ai-skeleton-wrap">
              <div className="google-ai-skeleton-line" style={{ width: "95%", height: "24px" }} />
              <div className="google-ai-skeleton-line" style={{ width: "85%" }} />
              <div className="google-ai-skeleton-line" style={{ width: "90%" }} />
              <div className="google-ai-skeleton-line" style={{ width: "70%", marginTop: "16px" }} />
              <div className="google-ai-skeleton-line" style={{ width: "80%" }} />
            </div>
          ) : data ? (
            <>
              {/* Definition & Phonetics Overview */}
              <div className="google-ai-overview-text">
                <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--primary)" }}>
                  {data.word}
                </span>

                {data.phonetic && (
                  <span className="google-ai-phonetic-pill">
                    <span>(phát âm: {data.phonetic})</span>
                    <button
                      type="button"
                      className="google-ai-speak-btn"
                      onClick={() => playAudio(data.word, sourceLang)}
                      title="Nghe phát âm từ vựng"
                    >
                      <Volume2 size={15} />
                    </button>
                  </span>
                )}

                {data.overview ? (
                  <div style={{ marginTop: "8px" }}>{data.overview}</div>
                ) : (
                  <div style={{ marginTop: "8px" }}>
                    là <strong>{data.part_of_speech || "từ vựng"}</strong> trong tiếng Anh.
                  </div>
                )}
              </div>

              {/* Key words of a long phrase, each with its own example */}
              <GoogleAiKeyWords
                keyWords={data.key_words}
                sourceLang={sourceLang}
                onSpeak={playAudio}
                onOpenGoogle={setGoogleSheetWord}
              />

              {/* Examples */}
              {Array.isArray(data.examples) && data.examples.length > 0 && (
                <div>
                  <h4 className="google-ai-section-title">
                    <span>Ví dụ thực tế</span>
                  </h4>
                  <ul className="google-ai-list">
                    {data.examples.map((ex, i) => (
                      <li key={i}>
                        <strong>{ex.en}</strong>
                        {ex.vi && (
                          <span style={{ color: "var(--text-muted)", marginLeft: "6px" }}>
                            ({ex.vi})
                          </span>
                        )}
                        <button
                          type="button"
                          className="google-ai-speak-btn"
                          style={{ marginLeft: "6px" }}
                          onClick={() => playAudio(ex.en, sourceLang)}
                          title="Nghe phát âm câu ví dụ"
                        >
                          <Volume2 size={13} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Etymology / Nguồn gốc từ */}
              {Array.isArray(data.etymology) && data.etymology.length > 0 && (
                <div>
                  <h4 className="google-ai-section-title">
                    <span>Nguồn gốc từ (Etymology)</span>
                  </h4>
                  <ul className="google-ai-list">
                    {data.etymology.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Word Family / Họ từ */}
              {Array.isArray(data.word_family) && data.word_family.length > 0 && (
                <div>
                  <h4 className="google-ai-section-title">
                    <span>Họ từ (Word Family)</span>
                  </h4>
                  <div className="google-ai-family-grid">
                    {data.word_family.map((item, i) => (
                      <div key={i} className="google-ai-family-card">
                        <div>
                          <div>
                            <span className="family-word-name">{item.word}</span>
                            {item.pos && <span className="family-word-pos">{item.pos}</span>}
                          </div>
                          {item.meaning && (
                            <div className="family-word-meaning">{item.meaning}</div>
                          )}
                        </div>

                        <button
                          type="button"
                          className="google-ai-speak-btn"
                          onClick={() => playAudio(item.word, sourceLang)}
                          title={`Nghe phát âm ${item.word}`}
                        >
                          <Volume2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "24px 0", color: "var(--text-muted)" }}>
              <p>Chưa tải được thông tin tra cứu do lỗi kết nối.</p>
              <a
                href={googleUrl}
                onClick={handleOpenGoogle}
                target="_blank"
                rel="noopener noreferrer"
                className="google-ai-btn-external"
                style={{ marginTop: "12px", display: "inline-flex" }}
              >
                Tra cứu trực tiếp trên Google ↗
              </a>
            </div>
          )}
        </div>

        {/* Bottom Quick-Dismiss Bar for Walking UX */}
        <div className="google-ai-footer-bar">
          <button
            type="button"
            className="google-ai-btn-dismiss"
            onClick={onClose}
          >
            <Check size={16} />
            <span>Đã hiểu, quay lại học tiếp</span>
          </button>
        </div>
      </div>
    </div>
    {isGoogleSheetOpen && <GoogleSearchSheet word={googleSheetWord} onClose={closeGoogleSheet} />}
    </>
  );
};
