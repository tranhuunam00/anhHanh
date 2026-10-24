import React, { useState, useEffect } from "react";
import { Pencil, X, Volume2, Check, Loader2, Zap } from "../Icons";
import { useAuth } from "../../context/AuthContext";
import {
  updateVocabWord,
  fetchPhoneticLookup,
  fetchWordTranslation,
  fetchImageCandidates,
} from "../../services/authVocabService";
import { getVoiceLang } from "../../utils/languageVoices";
import { cleanContextSentenceForSpeech, buildVocabPayload } from "../../utils/vocabModalUtils";
import { VocabImagePickerField } from "../Vocab/VocabImagePickerField";
import { VocabPosPickerField } from "../Vocab/VocabPosPickerField";
import { EditVocabModalHeader } from "./EditVocabModalHeader";

export const EditVocabModal = ({ isOpen, vocab, onClose, onSuccess, sourceLang: initialSourceLang }) => {
  const { token, refreshStreak, refreshSavedVocab, showToast } = useAuth();

  const [word, setWord] = useState("");
  const [phonetic, setPhonetic] = useState("");
  const [meaning, setMeaning] = useState("");
  const [partOfSpeech, setPartOfSpeech] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [contextSentence, setContextSentence] = useState("");
  const [vocabStatus, setVocabStatus] = useState("LEARNING");
  const [sourceLang, setSourceLang] = useState("en");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAutoEnriching, setIsAutoEnriching] = useState(false);
  const [isSearchingImages, setIsSearchingImages] = useState(false);
  const [imgLoadError, setImgLoadError] = useState(false);

  // Sync form inputs when active vocab item changes
  useEffect(() => {
    if (vocab) {
      setWord(vocab.word || "");
      setPhonetic(vocab.phonetic || "");
      setPartOfSpeech(vocab.part_of_speech || "");
      setMeaning(vocab.meaning || "");
      setImageUrl(vocab.image_url || "");
      setContextSentence(vocab.context_sentence || "");
      setVocabStatus(vocab.status || "LEARNING");
      setSourceLang(vocab.source_lang || initialSourceLang || "en");
      setImgLoadError(false);
    }
  }, [vocab, initialSourceLang]);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !vocab) return null;

  // Audio preview helper using browser Speech Synthesis
  const handleTestPronounce = (textToSpeak) => {
    if (!textToSpeak || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = getVoiceLang(sourceLang || vocab?.source_lang, textToSpeak);
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // 1-Click Auto Enrich: Re-fetch IPA, Meaning, and Images for the word
  const handleAutoEnrich = async () => {
    const clean = word.trim();
    if (!clean) {
      showToast("Vui lòng nhập từ vựng trước", "warning");
      return;
    }

    setIsAutoEnriching(true);
    showToast(`Đang tra cứu phiên âm, dịch và ảnh cho "${clean}"...`, "info");

    try {
      const [phoneticRes, transRes, candidates] = await Promise.all([
        fetchPhoneticLookup(clean, token),
        fetchWordTranslation(clean, "vi", token),
        fetchImageCandidates(clean, contextSentence, meaning, token),
      ]);

      if (phoneticRes?.phonetic) {
        setPhonetic(phoneticRes.phonetic);
      }
      if (transRes?.meaning && transRes.meaning.toLowerCase() !== clean.toLowerCase()) {
        setMeaning(transRes.meaning);
      }
      if (candidates && candidates.length > 0) {
        if (!imageUrl || imageUrl.includes("unsplash.com/photo-1456513080510")) {
          setImageUrl(candidates[0]);
          setImgLoadError(false);
        }
      } else if (imageUrl && imageUrl.includes("unsplash.com/photo-1456513080510")) {
        setImageUrl("");
      }

      showToast(`Đã tự động cập nhật phiên âm & dịch cho "${clean}"!`, "success");
    } catch (e) {
      console.warn("Auto enrich failed:", e);
      showToast("Không thể tự động tra cứu, hãy nhập thủ công nhé", "warning");
    } finally {
      setIsAutoEnriching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanWord = word.trim();
    if (!cleanWord) {
      showToast("Từ vựng không được để trống", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      const updatePayload = buildVocabPayload({
        word: cleanWord,
        phonetic,
        partOfSpeech,
        meaning,
        imageUrl,
        contextSentence,
        status: vocabStatus,
        sourceLang,
      });

      const res = await updateVocabWord(vocab.id, updatePayload, token);

      showToast(`Đã cập nhật từ "${cleanWord}" thành công!`, "success");
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
      <div className="settings-modal edit-vocab-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <EditVocabModalHeader onClose={onClose} />

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="edit-vocab-form">
          {/* Row 1: Word & Auto Enrich Button */}
          <div>
            <div className="edit-vocab-field-header">
              <label className="edit-vocab-label">
                Từ vựng <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <div className="edit-vocab-actions-group">
                <button
                  type="button"
                  onClick={() => handleTestPronounce(word)}
                  disabled={!word.trim()}
                  className="edit-vocab-btn-action edit-vocab-btn-listen"
                  title="Nghe phát âm từ vựng"
                >
                  <Volume2 size={13} />
                  <span className="btn-label-desktop">Nghe từ</span>
                  <span className="btn-label-mobile">Nghe</span>
                </button>
                <button
                  type="button"
                  onClick={handleAutoEnrich}
                  disabled={isAutoEnriching || !word.trim()}
                  className="edit-vocab-btn-action edit-vocab-btn-enrich"
                  title="Tự động tra cứu phiên âm IPA, dịch nghĩa và tìm ảnh"
                >
                  {isAutoEnriching ? <Loader2 size={12} className="spinning" /> : <Zap size={12} />}
                  <span className="btn-label-desktop">{isAutoEnriching ? "Đang tra..." : "Tra cứu tự động cả 3"}</span>
                  <span className="btn-label-mobile">{isAutoEnriching ? "Tra..." : "Tra cứu 3-in-1"}</span>
                </button>
              </div>
            </div>
            <input
              type="text"
              className="dict-input edit-vocab-word-input"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="Nhập từ gốc..."
              required
            />
          </div>

          {/* Row 2: Phonetic IPA & Meaning (2 Columns) */}
          <div className="edit-vocab-grid-2col">
            {/* Phonetic */}
            <div>
              <div className="edit-vocab-field-header">
                <label className="edit-vocab-label">Phiên âm IPA</label>
                <button
                  type="button"
                  onClick={() => handleTestPronounce(word)}
                  className="edit-vocab-btn-action edit-vocab-btn-listen-mini"
                  title="Nghe thử phát âm Web Speech"
                >
                  <Volume2 size={12} />
                  <span className="btn-label-desktop">Nghe thử</span>
                </button>
              </div>
              <input
                type="text"
                className="dict-input edit-vocab-input edit-vocab-phonetic-input"
                value={phonetic}
                onChange={(e) => setPhonetic(e.target.value)}
                placeholder="/ˈflʌr.ɪ.ʃɪŋ/"
              />
            </div>

            {/* Meaning */}
            <div>
              <div className="edit-vocab-field-header">
                <label className="edit-vocab-label">
                  Nghĩa tiếng Việt <span style={{ color: "#ef4444" }}>*</span>
                </label>
              </div>
              <input
                type="text"
                className="dict-input edit-vocab-input edit-vocab-meaning-input"
                value={meaning}
                onChange={(e) => setMeaning(e.target.value)}
                placeholder="Nghĩa tiếng Việt..."
                required
              />
            </div>
          </div>

          {/* Row 2.5: Part of Speech Picker */}
          <VocabPosPickerField value={partOfSpeech} onChange={setPartOfSpeech} />

          {/* Row 3: Image Picker */}
          <VocabImagePickerField
            word={word}
            contextSentence={contextSentence}
            meaning={meaning}
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            imgLoadError={imgLoadError}
            setImgLoadError={setImgLoadError}
            isSearchingImages={isSearchingImages}
            setIsSearchingImages={setIsSearchingImages}
            showToast={showToast}
            token={token}
          />

          {/* Row 4: Context Sentence */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
              <label className="edit-vocab-label">
                Câu ví dụ ngữ cảnh (Context sentence)
              </label>
              <button
                type="button"
                onClick={() => {
                  const cleanSentence = cleanContextSentenceForSpeech(contextSentence);
                  if (cleanSentence) handleTestPronounce(cleanSentence);
                }}
                disabled={!contextSentence.trim()}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--primary, #6366f1)",
                  cursor: "pointer",
                  padding: "2px 4px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "0.74rem",
                  fontWeight: 600,
                }}
                title="Nghe phát âm câu ví dụ minh họa"
              >
                <Volume2 size={13} />
                <span>Nghe câu ví dụ</span>
              </button>
            </div>
            <textarea
              className="dict-input edit-vocab-context-textarea"
              rows={3}
              value={contextSentence}
              onChange={(e) => setContextSentence(e.target.value)}
              placeholder="Câu văn chứa từ vựng này..."
            />
          </div>

          {/* Row 5: Status */}
          <div>
            <label className="edit-vocab-label" style={{ display: "block", marginBottom: "4px" }}>
              Trạng thái ghi nhớ
            </label>
            <select
              className="dict-input edit-vocab-input"
              style={{ cursor: "pointer" }}
              value={vocabStatus}
              onChange={(e) => setVocabStatus(e.target.value)}
            >
              <option value="NEW">Mới lưu (NEW)</option>
              <option value="LEARNING">Đang nhớ (LEARNING)</option>
              <option value="MASTERED">Đã thuộc (MASTERED)</option>
            </select>
          </div>

          {/* Footer Actions */}
          <div className="edit-vocab-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
              style={{ padding: "8px 16px", fontSize: "0.85rem" }}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-with-icon"
              disabled={isSubmitting}
              style={{ padding: "8px 18px", fontSize: "0.85rem", fontWeight: 700 }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={15} className="spinning" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Check size={15} strokeWidth={2.5} />
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
