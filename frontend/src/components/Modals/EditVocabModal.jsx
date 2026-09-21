import React, { useState, useEffect } from "react";
import {
  Pencil,
  X,
  Sparkles,
  Volume2,
  Image as ImageIcon,
  RotateCw,
  Check,
  Loader2,
  AlertCircle,
  BookOpen,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  updateVocabWord,
  fetchPhoneticLookup,
  fetchWordTranslation,
  fetchImageCandidates,
} from "../../services/authVocabService";

export const EditVocabModal = ({ isOpen, vocab, onClose, onSuccess }) => {
  const { token, refreshStreak, refreshSavedVocab, showToast } = useAuth();

  const [word, setWord] = useState("");
  const [phonetic, setPhonetic] = useState("");
  const [meaning, setMeaning] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [contextSentence, setContextSentence] = useState("");
  const [vocabStatus, setVocabStatus] = useState("LEARNING");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAutoEnriching, setIsAutoEnriching] = useState(false);
  const [isSearchingImages, setIsSearchingImages] = useState(false);
  const [imageCandidates, setImageCandidates] = useState([]);
  const [imgLoadError, setImgLoadError] = useState(false);

  // Sync form inputs when active vocab item changes
  useEffect(() => {
    if (vocab) {
      setWord(vocab.word || "");
      setPhonetic(vocab.phonetic || "");
      setMeaning(vocab.meaning || "");
      setImageUrl(vocab.image_url || "");
      setContextSentence(vocab.context_sentence || "");
      setVocabStatus(vocab.status || "LEARNING");
      setImageCandidates([]);
      setImgLoadError(false);
    }
  }, [vocab]);

  if (!isOpen || !vocab) return null;

  // Audio preview helper using browser Speech Synthesis
  const handleTestPronounce = (textToSpeak, lang = "en-US") => {
    if (!textToSpeak || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = lang;
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // 1-Click Auto Enrich: Re-fetch IPA, Meaning, and Images for the word
  const handleAutoEnrich = async () => {
    const clean = word.trim();
    if (!clean) {
      showToast("Vui lòng nhập từ tiếng Anh trước", "warning");
      return;
    }

    setIsAutoEnriching(true);
    showToast(`Đang tra cứu phiên âm, dịch và ảnh cho "${clean}"...`, "info");

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
        setImageCandidates(candidates);
        if (!imageUrl || imageUrl.includes("unsplash.com/photo-1456513080510")) {
          setImageUrl(candidates[0]);
          setImgLoadError(false);
        }
      }

      showToast(`✨ Đã tự động cập nhật phiên âm & dịch cho "${clean}"!`, "success");
    } catch (e) {
      console.warn("Auto enrich failed:", e);
      showToast("Không thể tự động tra cứu, hãy nhập thủ công nhé", "warning");
    } finally {
      setIsAutoEnriching(false);
    }
  };

  // Cycle or search alternative images
  const handleFindAlternativeImages = async () => {
    const clean = word.trim();
    if (!clean) return;

    setIsSearchingImages(true);
    try {
      const candidates = await fetchImageCandidates(clean, contextSentence, token);
      if (candidates && candidates.length > 0) {
        setImageCandidates(candidates);
        const available = candidates.filter((u) => u !== imageUrl);
        const nextImg = available[Math.floor(Math.random() * available.length)] || candidates[0];
        setImageUrl(nextImg);
        setImgLoadError(false);
        showToast("Đã đổi sang ảnh gợi ý mới", "info");
      } else {
        showToast("Không tìm thấy thêm ảnh gợi ý nào khác", "info");
      }
    } catch (e) {
      showToast("Lỗi khi tìm ảnh gợi ý", "error");
    } finally {
      setIsSearchingImages(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanWord = word.trim();
    if (!cleanWord) {
      showToast("Từ tiếng Anh không được để trống", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      const updatePayload = {
        word: cleanWord,
        phonetic: phonetic.trim() || undefined,
        meaning: meaning.trim() || cleanWord,
        image_url: imageUrl.trim() || undefined,
        context_sentence: contextSentence.trim() || "",
        status: vocabStatus,
      };

      const res = await updateVocabWord(vocab.id, updatePayload, token);

      showToast(`✨ Đã cập nhật từ "${cleanWord}" thành công!`, "success");
      if (refreshStreak) refreshStreak();
      if (refreshSavedVocab) refreshSavedVocab();
      if (onSuccess) onSuccess(res?.vocab);
      onClose();
    } catch (err) {
      showToast(err.message || "Không thể cập nhật từ vựng này", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`modal-overlay ${isOpen ? "active" : ""}`} onClick={onClose}>
      <div
        className="settings-modal edit-vocab-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "540px",
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
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(59, 130, 246, 0.2))",
                border: "1px solid rgba(99, 102, 241, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6366f1",
              }}
            >
              <Pencil size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="modal-title" style={{ margin: 0, fontSize: "1.1rem" }}>
                Chỉnh sửa thẻ từ vựng
              </h3>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted, #64748b)" }}>
                Cập nhật từ gốc, phiên âm IPA, nghĩa tiếng Việt và link ảnh
              </div>
            </div>
          </div>
          <button className="btn btn-secondary btn-icon" onClick={onClose} aria-label="Đóng">
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Scrollable Form Body */}
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
          {/* Row 1: Word & Auto Enrich Button */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <label
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "var(--text-primary, #1e293b)",
                }}
              >
                Từ vựng tiếng Anh <span style={{ color: "#ef4444" }}>*</span>
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
                title="Tự động tra cứu phiên âm IPA, dịch nghĩa và tìm ảnh"
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
                fontSize: "1.05rem",
                fontWeight: 600,
                boxSizing: "border-box",
              }}
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="Nhập từ gốc..."
              required
            />
          </div>

          {/* Row 2: Phonetic IPA & Meaning (2 Columns) */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "12px" }}>
            {/* Phonetic */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label style={{ fontSize: "0.83rem", fontWeight: 600, color: "var(--text-primary, #1e293b)" }}>
                  Phiên âm IPA
                </label>
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
                  <span>Nghe thử</span>
                </button>
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
                value={phonetic}
                onChange={(e) => setPhonetic(e.target.value)}
                placeholder="/ˈflʌr.ɪ.ʃɪŋ/"
              />
            </div>

            {/* Meaning */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label style={{ fontSize: "0.83rem", fontWeight: 600, color: "var(--text-primary, #1e293b)" }}>
                  Nghĩa tiếng Việt <span style={{ color: "#ef4444" }}>*</span>
                </label>
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
                value={meaning}
                onChange={(e) => setMeaning(e.target.value)}
                placeholder="Nghĩa tiếng Việt..."
                required
              />
            </div>
          </div>

          {/* Row 3: Image URL & Live Preview */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <label style={{ fontSize: "0.83rem", fontWeight: 600, color: "var(--text-primary, #1e293b)" }}>
                Link ảnh minh họa (Image URL)
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
                title="Tìm ảnh minh họa liên quan khác"
              >
                <RotateCw size={12} className={isSearchingImages ? "spinning" : ""} />
                <span>{isSearchingImages ? "Đang tìm..." : "Đổi ảnh khác"}</span>
              </button>
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
              {/* Thumbnail Live Preview */}
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "10px",
                  border: "1px solid var(--border-color, #cbd5e1)",
                  overflow: "hidden",
                  flexShrink: 0,
                  background: "var(--bg-secondary, #f8fafc)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
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
                    <ImageIcon size={22} />
                    <div style={{ fontSize: "0.6rem" }}>{imgLoadError ? "Lỗi link" : "Chưa có"}</div>
                  </div>
                )}
              </div>

              {/* URL Input */}
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
                  placeholder="https://... dán link ảnh trực tiếp tại đây"
                />
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted, #64748b)", marginTop: "4px" }}>
                  💡 Bạn có thể dán trực tiếp bất kỳ link ảnh nào (PNG, JPG, WebP) hoặc bấm nút "Đổi ảnh khác".
                </div>
              </div>
            </div>

            {/* Candidate image thumbnails strip if available */}
            {imageCandidates.length > 1 && (
              <div style={{ display: "flex", gap: "6px", marginTop: "8px", overflowX: "auto", paddingBottom: "4px" }}>
                {imageCandidates.slice(0, 5).map((candidate, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setImageUrl(candidate);
                      setImgLoadError(false);
                    }}
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "6px",
                      border: imageUrl === candidate ? "2px solid #2563eb" : "1px solid #cbd5e1",
                      padding: 0,
                      overflow: "hidden",
                      cursor: "pointer",
                      flexShrink: 0,
                      opacity: imageUrl === candidate ? 1 : 0.7,
                    }}
                    title={`Chọn ảnh gợi ý #${idx + 1}`}
                  >
                    <img src={candidate} alt="option" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Row 4: Context Sentence */}
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
              Câu ví dụ ngữ cảnh (Context sentence)
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
                boxSizing: "border-box",
                resize: "vertical",
                fontFamily: "inherit",
              }}
              value={contextSentence}
              onChange={(e) => setContextSentence(e.target.value)}
              placeholder="Câu văn chứa từ vựng này..."
            />
          </div>

          {/* Row 5: Status */}
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
              Trạng thái ghi nhớ
            </label>
            <select
              className="dict-input"
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid var(--border-color, #e2e8f0)",
                background: "var(--bg-input, #fff)",
                color: "var(--text-primary, #0f172a)",
                fontSize: "0.88rem",
                boxSizing: "border-box",
                cursor: "pointer",
              }}
              value={vocabStatus}
              onChange={(e) => setVocabStatus(e.target.value)}
            >
              <option value="NEW">Mới lưu (NEW)</option>
              <option value="LEARNING">Đang nhớ (LEARNING)</option>
              <option value="MASTERED">Đã thuộc (MASTERED)</option>
            </select>
          </div>

          {/* Footer Actions */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginTop: "8px",
              paddingTop: "12px",
              borderTop: "1px solid var(--border-color, #e2e8f0)",
            }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
              style={{ padding: "8px 16px", fontSize: "0.88rem" }}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-with-icon"
              disabled={isSubmitting}
              style={{ padding: "8px 20px", fontSize: "0.88rem", fontWeight: 700 }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="spinning" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Check size={16} strokeWidth={2.5} />
                  <span>Lưu thay đổi</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
