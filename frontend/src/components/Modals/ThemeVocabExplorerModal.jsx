import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  X,
  Search,
  Check,
  Plus,
  Volume2,
  BookOpen,
  Filter,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Globe,
} from "../Icons";
import {
  fetchVocabCategories,
  fetchSystemVocabWords,
  fetchUserSavedWords,
  importSystemVocabToNotebook,
} from "../../services/systemVocabService";
import { getVoiceLang } from "../../utils/languageVoices";
import "./ThemeVocabExplorerModal.css";

const QUANTITY_OPTIONS = [20, 50, 100, 200];

export const ThemeVocabExplorerModal = ({
  isOpen = false,
  onClose,
  token = null,
  showToast = () => {},
  onSuccessImport = () => {},
}) => {
  const [categories, setCategories] = useState([]);
  const [selectedLang, setSelectedLang] = useState("en"); // 'en' | 'fr'
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedWordType, setSelectedWordType] = useState("all"); // 'all' | 'single_word' | 'phrase'
  const [selectedLimit, setSelectedLimit] = useState(50);
  const [searchQuery, setSearchQuery] = useState("");

  const [words, setWords] = useState([]);
  const [totalWords, setTotalWords] = useState(0);
  const [savedWordsSet, setSavedWordsSet] = useState(new Set());
  const [selectedIds, setSelectedIds] = useState(new Set());

  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // 1. Load categories catalog
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    (async () => {
      const catData = await fetchVocabCategories(selectedLang);
      if (isMounted && catData?.categories) {
        setCategories(catData.categories);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [isOpen, selectedLang]);

  // 2. Load user's saved words set to flag duplicates
  const loadSavedWords = useCallback(async () => {
    if (!token) return;
    const res = await fetchUserSavedWords(token);
    if (res?.saved_words) {
      setSavedWordsSet(new Set(res.saved_words.map((w) => w.toLowerCase())));
    }
  }, [token]);

  useEffect(() => {
    if (isOpen) {
      loadSavedWords();
    }
  }, [isOpen, loadSavedWords]);

  // 3. Fetch words when filters change
  const loadWords = useCallback(async () => {
    if (!isOpen) return;
    setIsLoading(true);
    setSelectedIds(new Set());
    try {
      const res = await fetchSystemVocabWords({
        source_lang: selectedLang,
        category: selectedCategory || null,
        word_type: selectedWordType,
        search: searchQuery,
        limit: selectedLimit,
        offset: 0,
      });
      setWords(res.items || []);
      setTotalWords(res.total || 0);
    } catch (e) {
      showToast(e.message || "Lỗi khi tải từ vựng", "error");
    } finally {
      setIsLoading(false);
    }
  }, [isOpen, selectedLang, selectedCategory, selectedWordType, searchQuery, selectedLimit, showToast]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        loadWords();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, loadWords]);

  // Pronounce word
  const speakWord = (word, lang) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window) || !word) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(word);
      utter.lang = getVoiceLang(lang, word);
      utter.rate = 0.9;
      window.speechSynthesis.speak(utter);
    } catch {}
  };

  // Selectable words (excluding already saved)
  const selectableWords = useMemo(() => {
    return words.filter((w) => !savedWordsSet.has(w.word.trim().toLowerCase()));
  }, [words, savedWordsSet]);

  const handleToggleSelectAll = () => {
    if (selectedIds.size === selectableWords.length && selectableWords.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(selectableWords.map((w) => w.id)));
    }
  };

  const handleToggleItem = (id, isAlreadySaved) => {
    if (isAlreadySaved) return;
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Batch import to personal notebook
  const handleImport = async () => {
    if (selectedIds.size === 0) return;
    setIsImporting(true);
    try {
      const res = await importSystemVocabToNotebook(Array.from(selectedIds), token);
      showToast(res.message || `Đã thêm ${res.imported_count} từ vào Sổ tay`, "success");
      await loadSavedWords();
      setSelectedIds(new Set());
      if (onSuccessImport) onSuccessImport();
    } catch (err) {
      showToast(err.message || "Lỗi khi thêm từ vào Sổ tay", "error");
    } finally {
      setIsImporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="theme-vocab-modal-backdrop" onClick={onClose}>
      <div className="theme-vocab-modal-window" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="theme-vocab-header">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div className="theme-vocab-icon-badge">
              <Layers size={20} color="var(--primary)" />
            </div>
            <div>
              <h3 className="theme-vocab-title">Khám Phá Từ Vựng Theo Chủ Đề</h3>
              <p className="theme-vocab-subtitle">
                Ngân hàng 6,000 từ &amp; cụm từ chuẩn (Anh &amp; Pháp) • Chọn và thêm vào Sổ tay cá nhân
              </p>
            </div>
          </div>
          <button className="theme-vocab-close-btn" onClick={onClose} title="Đóng">
            <X size={20} />
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="theme-vocab-filter-bar">
          {/* Language Selector */}
          <div className="theme-filter-pill-group">
            <button
              type="button"
              className={`theme-lang-btn ${selectedLang === "en" ? "active" : ""}`}
              onClick={() => setSelectedLang("en")}
            >
              <Globe size={14} />
              <span>Tiếng Anh (EN)</span>
            </button>
            <button
              type="button"
              className={`theme-lang-btn ${selectedLang === "fr" ? "active" : ""}`}
              onClick={() => setSelectedLang("fr")}
            >
              <Globe size={14} />
              <span>Tiếng Pháp (FR)</span>
            </button>
          </div>

          {/* Category Dropdown */}
          <div className="theme-select-wrap">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="theme-dropdown-select"
            >
              <option value="">Tất cả 30 chủ đề</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name_vi} ({c.name_en}) - {c.word_count || 0} từ
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="theme-select-arrow" />
          </div>

          {/* Word Type Filter */}
          <div className="theme-type-pills">
            {[
              { key: "all", label: "Tất cả dạng" },
              { key: "single_word", label: "Từ đơn" },
              { key: "phrase", label: "Cụm từ" },
            ].map((t) => (
              <button
                key={t.key}
                type="button"
                className={`theme-type-btn ${selectedWordType === t.key ? "active" : ""}`}
                onClick={() => setSelectedWordType(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="theme-search-box">
            <Search size={14} className="theme-search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm từ hoặc nghĩa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="theme-search-input"
            />
          </div>
        </div>

        {/* Action & Stats Control Bar */}
        <div className="theme-vocab-actions-bar">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <button
              type="button"
              className="theme-select-all-btn"
              onClick={handleToggleSelectAll}
              disabled={selectableWords.length === 0}
            >
              <Check size={14} />
              <span>
                {selectedIds.size === selectableWords.length && selectableWords.length > 0
                  ? "Bỏ chọn tất cả"
                  : `Chọn tất cả từ mới (${selectableWords.length})`}
              </span>
            </button>

            <span className="theme-stats-label">
              Hiển thị: <strong>{words.length}</strong> / {totalWords} từ • Đã chọn:{" "}
              <strong>{selectedIds.size}</strong> từ
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Limit Selector */}
            <div className="theme-limit-pills">
              {QUANTITY_OPTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  className={`theme-limit-btn ${selectedLimit === q ? "active" : ""}`}
                  onClick={() => setSelectedLimit(q)}
                >
                  {q} từ
                </button>
              ))}
            </div>

            {/* Batch Import Button */}
            <button
              type="button"
              className="theme-import-action-btn"
              onClick={handleImport}
              disabled={selectedIds.size === 0 || isImporting}
            >
              {isImporting ? (
                <span>Đang thêm...</span>
              ) : (
                <>
                  <Plus size={15} strokeWidth={2.5} />
                  <span>Thêm vào từ mới của tôi ({selectedIds.size})</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Word Grid Body */}
        <div className="theme-vocab-modal-body">
          {isLoading ? (
            <div className="theme-vocab-loading-state">
              <div className="theme-spinner" />
              <span>Đang tải danh sách từ vựng...</span>
            </div>
          ) : words.length === 0 ? (
            <div className="theme-vocab-empty-state">
              <AlertCircle size={32} color="var(--text-muted)" />
              <p>Không tìm thấy từ vựng phù hợp với bộ lọc hiện tại.</p>
            </div>
          ) : (
            <div className="theme-vocab-cards-grid">
              {words.map((item) => {
                const normWord = item.word.trim().toLowerCase();
                const isAlreadySaved = savedWordsSet.has(normWord);
                const isChecked = selectedIds.has(item.id);

                return (
                  <div
                    key={item.id}
                    className={`theme-word-card ${isAlreadySaved ? "already-saved" : ""} ${
                      isChecked ? "selected" : ""
                    }`}
                    onClick={() => handleToggleItem(item.id, isAlreadySaved)}
                  >
                    <div className="theme-card-top-row">
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={isAlreadySaved}
                          onChange={() => handleToggleItem(item.id, isAlreadySaved)}
                          className="theme-checkbox"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span className="theme-word-text">{item.word}</span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        {isAlreadySaved ? (
                          <span className="theme-badge-saved">
                            <CheckCircle2 size={12} /> Đã có
                          </span>
                        ) : (
                          <span className="theme-badge-level">{item.level || "B1"}</span>
                        )}

                        <button
                          type="button"
                          className="theme-audio-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            speakWord(item.word, item.source_lang);
                          }}
                          title="Nghe phát âm"
                        >
                          <Volume2 size={14} />
                        </button>
                      </div>
                    </div>

                    {item.phonetic && <div className="theme-word-ipa">{item.phonetic}</div>}

                    <div className="theme-word-meaning">{item.meaning}</div>

                    {item.context_sentence && (
                      <div className="theme-word-context">“{item.context_sentence}”</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
