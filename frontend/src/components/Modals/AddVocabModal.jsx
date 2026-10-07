import React, { useState } from "react";
import {
  Plus,
  X,
  Sparkles,
  BookOpen,
  Loader2,
  Volume2,
  Image as ImageIcon,
  RotateCw,
} from "../Icons";
import { useAuth } from "../../context/AuthContext";
import {
  createVocabWord,
  fetchPhoneticLookup,
  fetchWordTranslation,
  fetchImageCandidates,
} from "../../services/authVocabService";
import { getVoiceLang } from "../../utils/languageVoices";

export const AddVocabModal = ({ isOpen, onClose, onSuccess }) => {
  const { token, refreshStreak, refreshSavedVocab, showToast } = useAuth();
  const [word, setWord] = useState("");
  const [phonetic, setPhonetic] = useState("");
  const [meaning, setMeaning] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [contextSentence, setContextSentence] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAutoEnriching, setIsAutoEnriching] = useState(false);
  const [isSearchingImages, setIsSearchingImages] = useState(false);
  const [imgLoadError, setImgLoadError] = useState(false);

  if (!isOpen) return null;

  const handleTestPronounce = (textToSpeak) => {
    if (!textToSpeak || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = getVoiceLang(null, textToSpeak);
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const handleAutoEnrich = async () => {
    const clean = word.trim();
    if (!clean) {
      showToast("Vui lòng nhập từ vựng trước", "warning");
      return;
    }

    setIsAutoEnriching(true);
    showToast(`Đang tra cứu phiên âm, nghĩa và ảnh cho "${clean}"...`, "info");

    try {
      const [phoneticRes, transRes, candidates] = await Promise.all([
        fetchPhoneticLookup(clean, token),
        fetchWordTranslation(clean, "vi", token),
        fetchImageCandidates(clean, contextSentence, token),
      ]);

      if (phoneticRes?.phonetic) {
        setPhonetic(phoneticRes.phonetic);
      }
      if (transRes?.meaning && transRes.meaning.toLowerCase() !== clean.toLowerCase()) {
        setMeaning(transRes.meaning);
      }
      if (candidates && candidates.length > 0) {
        setImageUrl(candidates[0]);
        setImgLoadError(false);
      }

      showToast(`Đã tự động điền phiên âm, dịch & ảnh cho "${clean}"!`, "success");
    } catch (e) {
      console.warn("Auto enrich failed:", e);
      showToast("Không thể tự động tra cứu, bạn hãy nhập thủ công nhé", "warning");
    } finally {
      setIsAutoEnriching(false);
    }
  };

  const handleFindAlternativeImages = async () => {
    const clean = word.trim();
    if (!clean) return;

    setIsSearchingImages(true);
    try {
      const candidates = await fetchImageCandidates(clean, contextSentence, token);
      if (candidates && candidates.length > 0) {
        const available = candidates.filter((u) => u !== imageUrl);
        const nextImg = available[Math.floor(Math.random() * available.length)] || candidates[0];
        setImageUrl(nextImg);
        setImgLoadError(false);
        showToast("Đã chọn ảnh gợi ý mới", "info");
      } else {
        showToast("Không tìm thấy ảnh gợi ý", "info");
      }
    } catch {
      showToast("Lỗi khi tìm ảnh gợi ý", "error");
    } finally {
      setIsSearchingImages(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanWord = word.trim();
    if (!cleanWord) {
      showToast("Vui lòng nhập từ vựng", "warning");
      return;
    }

    if (!token) {
      showToast("Vui lòng đăng nhập để lưu từ vựng", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      await createVocabWord(
        {
          word: cleanWord,
          phonetic: phonetic.trim() || undefined,
          meaning: meaning.trim() || undefined,
          image_url: imageUrl.trim() || undefined,
          context_sentence: contextSentence.trim() || "",
          source_lang: "en",
          target_lang: "vi",
        },
        token
      );

      showToast(`Đã thêm "${cleanWord}" vào Sổ tay từ vựng!`, "success");
      setWord("");
      setPhonetic("");
      setMeaning("");
      setImageUrl("");
      setContextSentence("");
      if (refreshStreak) refreshStreak();
      if (refreshSavedVocab) refreshSavedVocab();
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      showToast(err.message || "Không thể thêm từ này", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`modal-overlay ${isOpen ? "active" : ""}`} onClick={onClose}>
      <div
        className="settings-modal add-vocab-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "520px",
          maxWidth: "94vw",
          borderRadius: "16px",
          overflow: "hidden",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div className="modal-header" style={{ padding: "16px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "8px",
                background: "rgba(99, 102, 241, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6366f1",
              }}
            >
              <Plus size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="modal-title" style={{ margin: 0, fontSize: "1.1rem" }}>
                Thêm từ mới vào Sổ tay
              </h3>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted, #64748b)" }}>
                Đồng bộ tự động phiên âm IPA, nghĩa tiếng Việt & ảnh minh họa
              </div>
            </div>
          </div>
          <button className="btn btn-secondary btn-icon" onClick={onClose} aria-label="Đóng">
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Body Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            padding: "18px 22px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          {/* Word & Auto Enrich Button */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <label
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "var(--text-primary, #1e293b)",
                }}
              >
                Từ vựng <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <button
                type="button"
                onClick={handleAutoEnrich}
                disabled={isAutoEnriching || !word.trim()}
                style={{
                  background: "rgba(99, 102, 241, 0.1)",
                  color: "#6366f1",
                  border: "1px solid rgba(99, 102, 241, 0.25)",
                  borderRadius: "6px",
                  padding: "3px 8px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
                title="Tự động tra cứu phiên âm, dịch nghĩa và tìm ảnh"
              >
                {isAutoEnriching ? <Loader2 size={12} className="spinning" /> : <Sparkles size={12} />}
                <span>{isAutoEnriching ? "Đang tra..." : "⚡ Tra cứu tự động cả 3"}</span>
              </button>
            </div>
            <input
              type="text"
              className="dict-input"
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid var(--border-color, #e2e8f0)",
                background: "var(--bg-input, #fff)",
                color: "var(--text-primary, #0f172a)",
                fontSize: "1rem",
                fontWeight: 600,
                boxSizing: "border-box",
              }}
              placeholder="Ví dụ: flourishing, resilience, perseverance..."
              value={word}
              onChange={(e) => setWord(e.target.value)}
              autoFocus
              required
            />
          </div>

          {/* Phonetic & Meaning (2 Columns) */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "12px" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label style={{ fontSize: "0.83rem", fontWeight: 600, color: "var(--text-primary, #1e293b)" }}>
                  Phiên âm IPA
                </label>
                {word.trim() && (
                  <button
                    type="button"
                    onClick={() => handleTestPronounce(word)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#2563eb",
                      cursor: "pointer",
                      padding: "2px 4px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "3px",
                      fontSize: "0.72rem",
                    }}
                    title="Nghe thử phát âm Web Speech"
                  >
                    <Volume2 size={13} />
                    <span>Nghe</span>
                  </button>
                )}
              </div>
              <input
                type="text"
                className="dict-input"
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-color, #e2e8f0)",
                  background: "var(--bg-input, #fff)",
                  color: "var(--text-primary, #0f172a)",
                  fontSize: "0.9rem",
                  fontFamily: "monospace",
                  boxSizing: "border-box",
                }}
                placeholder="Tự động nếu để trống"
                value={phonetic}
                onChange={(e) => setPhonetic(e.target.value)}
              />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label style={{ fontSize: "0.83rem", fontWeight: 600, color: "var(--text-primary, #1e293b)" }}>
                  Nghĩa tiếng Việt
                </label>
                <span style={{ fontSize: "0.72rem", color: "#6366f1" }}>Tự động nếu để trống</span>
              </div>
              <input
                type="text"
                className="dict-input"
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-color, #e2e8f0)",
                  background: "var(--bg-input, #fff)",
                  color: "#16a34a",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  boxSizing: "border-box",
                }}
                placeholder="Ví dụ: sự kiên cường..."
                value={meaning}
                onChange={(e) => setMeaning(e.target.value)}
              />
            </div>
          </div>

          {/* Image URL & Live Preview */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <label style={{ fontSize: "0.83rem", fontWeight: 600, color: "var(--text-primary, #1e293b)" }}>
                Link ảnh minh họa (Tùy chọn)
              </label>
              <button
                type="button"
                onClick={handleFindAlternativeImages}
                disabled={isSearchingImages || !word.trim()}
                style={{
                  background: "none",
                  border: "none",
                  color: "#0891b2",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                }}
                title="Tìm ảnh minh họa liên quan"
              >
                <RotateCw size={12} className={isSearchingImages ? "spinning" : ""} />
                <span>{isSearchingImages ? "Đang tìm..." : "Tìm ảnh gợi ý"}</span>
              </button>
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-color, #cbd5e1)",
                  overflow: "hidden",
                  flexShrink: 0,
                  background: "var(--bg-secondary, #f8fafc)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {imageUrl && !imgLoadError ? (
                  <img
                    src={imageUrl}
                    alt="Preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={() => setImgLoadError(true)}
                  />
                ) : (
                  <div style={{ textAlign: "center", color: "#94a3b8" }}>
                    <ImageIcon size={20} />
                    <div style={{ fontSize: "0.58rem" }}>{imgLoadError ? "Lỗi link" : "Tự tìm"}</div>
                  </div>
                )}
              </div>

              <div style={{ flex: 1 }}>
                <input
                  type="url"
                  className="dict-input"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color, #e2e8f0)",
                    background: "var(--bg-input, #fff)",
                    color: "var(--text-primary, #0f172a)",
                    fontSize: "0.82rem",
                    boxSizing: "border-box",
                  }}
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setImgLoadError(false);
                  }}
                  placeholder="Dán link ảnh hoặc để trống để AI tự động tìm"
                />
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted, #64748b)", marginTop: "4px" }}>
                  💡 Để trống hệ thống sẽ tự động gán ảnh minh họa phù hợp với nghĩa của từ.
                </div>
              </div>
            </div>
          </div>

          {/* Context Sentence */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.83rem",
                fontWeight: 600,
                color: "var(--text-primary, #1e293b)",
                marginBottom: "6px",
              }}
            >
              Câu ví dụ minh họa (Tùy chọn)
            </label>
            <textarea
              className="dict-input"
              rows={2}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid var(--border-color, #e2e8f0)",
                background: "var(--bg-input, #fff)",
                color: "var(--text-primary, #0f172a)",
                fontSize: "0.85rem",
                resize: "vertical",
                boxSizing: "border-box",
                fontFamily: "inherit",
              }}
              placeholder="Ví dụ: She showed remarkable resilience throughout the project."
              value={contextSentence}
              onChange={(e) => setContextSentence(e.target.value)}
            />
          </div>

          {/* Footer Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginTop: "4px",
              paddingTop: "12px",
              borderTop: "1px solid var(--border-color, #e2e8f0)",
            }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              style={{ padding: "8px 16px", borderRadius: "8px" }}
              onClick={onClose}
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-with-icon"
              style={{
                padding: "8px 20px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                border: "none",
                fontWeight: 600,
              }}
              disabled={isSubmitting || !word.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="spinner" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Plus size={16} strokeWidth={2.5} />
                  <span>Lưu từ vựng</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
