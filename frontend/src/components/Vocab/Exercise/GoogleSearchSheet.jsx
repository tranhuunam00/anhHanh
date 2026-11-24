import React, { useEffect, useState } from "react";
import { Google, ExternalLink, X } from "../../Icons";
import { buildGoogleEmbedUrl, buildGoogleSearchUrl } from "../../../utils/googleAiWordModalUtils";
import "./GoogleSearchSheet.css";

/**
 * Full-screen in-app panel showing real Google Search (incl. "AI Overview") in an iframe,
 * so the learner never leaves ShotLang. Google allows framing via the igu=1 mode.
 */
export const GoogleSearchSheet = ({ word, onClose }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const embedUrl = buildGoogleEmbedUrl(word);

  useEffect(() => {
    setIsLoaded(false);
  }, [embedUrl]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    // Capture phase so ESC closes this panel first, not the modal underneath.
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [onClose]);

  if (!embedUrl) return null;

  return (
    <div className="google-sheet-overlay" role="dialog" aria-modal="true" aria-label={`Google: ${word}`}>
      <div className="google-sheet-header">
        <span className="google-sheet-title">
          <Google size={16} />
          <span className="google-sheet-word">{word}</span>
        </span>
        <a
          className="google-sheet-btn-secondary"
          href={buildGoogleSearchUrl(word)}
          target="_blank"
          rel="noopener noreferrer"
          title="Mở trong tab mới (khi cần đăng nhập Google)"
        >
          <ExternalLink size={14} />
        </a>
        <button type="button" className="google-sheet-btn-close" onClick={onClose} aria-label="Đóng Google">
          <X size={18} />
          <span>Đóng</span>
        </button>
      </div>
      <div className="google-sheet-body">
        {!isLoaded && <div className="google-sheet-loading">Đang tải Google…</div>}
        <iframe
          key={embedUrl}
          className="google-sheet-frame"
          src={embedUrl}
          title={`Google: ${word}`}
          referrerPolicy="no-referrer"
          onLoad={() => setIsLoaded(true)}
        />
      </div>
    </div>
  );
};

export default GoogleSearchSheet;
