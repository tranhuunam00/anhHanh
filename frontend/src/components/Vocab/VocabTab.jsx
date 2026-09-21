import React, { useState, useEffect, useCallback } from "react";
import {
  BookOpen,
  Search,
  Target,
  Zap,
  RotateCw,
  Volume2,
  Trash2,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Plus,
  Download,
  FileSpreadsheet,
  Layers,
  Mic,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  fetchVocabList,
  updateVocabStatus,
  rotateVocabImage,
  deleteVocabWord,
  refreshVocabMeaning,
  fetchDueVocabSession,
} from "../../services/authVocabService";
import VocabReviewModal from "./VocabReviewModal";
import { AddVocabModal } from "../Modals/AddVocabModal";
import { exportVocabToCSV, exportVocabToAnki } from "../../utils/vocabExporter";
import { splitContextSentence } from "../../utils/textNormalizer";

export const VocabTab = ({ isActive = false, onOpenGuide }) => {
  const { token, isAuthenticated, refreshStreak, showToast, refreshSavedVocab } = useAuth();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [refreshingMeaningId, setRefreshingMeaningId] = useState(null);
  const [dueItems, setDueItems] = useState([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [listeningWordId, setListeningWordId] = useState(null);
  const [pronounceResults, setPronounceResults] = useState({});

  const exportMenuRef = useRef(null);
  const recognitionRef = useRef(null);

  const loadWords = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchVocabList(filterStatus, searchQuery, token);
      const list = data?.items || data?.vocabulary || [];
      setItems(list);
      setTotal(data?.total !== undefined ? data.total : (data?.stats?.total || list.length));

      // Also load due review session items
      const dueRes = await fetchDueVocabSession(20, token);
      setDueItems(dueRes?.items || []);
    } catch (e) {
      console.error("Failed to load vocab:", e);
    } finally {
      setIsLoading(false);
    }
  }, [filterStatus, searchQuery, token]);

  useEffect(() => {
    loadWords();
  }, [loadWords]);

  useEffect(() => {
    if (isActive) {
      loadWords();
    }
  }, [isActive, loadWords]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target)) {
        setIsExportMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, []);

  const handleStartPronouncePractice = (item) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast("Trình duyệt của bạn không hỗ trợ Micro nhận diện giọng nói", "warning");
      return;
    }

    if (listeningWordId === item.id) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setListeningWordId(null);
      return;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    setListeningWordId(item.id);
    showToast(`🎙️ Đang nghe... Hãy phát âm từ "${item.word}"`, "info");

    recognition.onresult = (event) => {
      const heard = event.results[0][0]?.transcript?.trim() || "";
      const cleanTarget = item.word.toLowerCase().replace(/[^a-z0-9]/g, "");
      const cleanHeard = heard.toLowerCase().replace(/[^a-z0-9]/g, "");

      const isMatch =
        cleanHeard === cleanTarget ||
        cleanHeard.includes(cleanTarget) ||
        cleanTarget.includes(cleanHeard);

      setPronounceResults((prev) => ({
        ...prev,
        [item.id]: {
          isMatch,
          heard,
          timestamp: Date.now(),
        },
      }));

      if (isMatch) {
        showToast(`🎯 Xuất sắc! Phát âm từ "${item.word}" chuẩn 100%!`, "success");
      } else {
        showToast(`👂 Máy nghe được: "${heard}". Hãy nghe lại phát âm mẫu và thử lại nhé!`, "warning");
      }
      setListeningWordId(null);
    };

    recognition.onerror = (e) => {
      console.warn("Speech recognition error:", e);
      if (e.error !== "no-speech") {
        showToast(`Lỗi micro: ${e.error || "Không nhận diện được giọng nói"}`, "error");
      }
      setListeningWordId(null);
    };

    recognition.onend = () => {
      setListeningWordId(null);
    };

    try {
      recognition.start();
    } catch (err) {
      console.error("Cannot start recognition:", err);
      setListeningWordId(null);
    }
  };

  const handleStatusChange = async (vocabId, newStatus) => {
    try {
      await updateVocabStatus(vocabId, newStatus, token);
      showToast("Đã cập nhật trạng thái từ vựng", "success");
      setItems((prev) =>
        prev.map((item) => (item.id === vocabId ? { ...item, status: newStatus } : item))
      );
      if (refreshStreak) refreshStreak();
      if (refreshSavedVocab) refreshSavedVocab();
    } catch (e) {
      showToast(e.message || "Không thể cập nhật trạng thái", "error");
    }
  };

  const handleRotateImage = async (vocabId, word, currentImg, contextSentence = "") => {
    try {
      showToast("Đang tìm ảnh minh họa mới...", "info");
      const nextImg = await rotateVocabImage(vocabId, word, currentImg, token, contextSentence);
      setItems((prev) =>
        prev.map((item) => (item.id === vocabId ? { ...item, image_url: nextImg } : item))
      );
      showToast("Đã đổi ảnh minh họa mới!", "success");
    } catch (e) {
      showToast(e.message || "Không thể đổi ảnh", "error");
    }
  };

  const handleDelete = async (vocabId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa từ này khỏi Sổ tay?")) return;
    try {
      await deleteVocabWord(vocabId, token);
      showToast("Đã xóa từ khỏi Sổ tay", "info");
      setItems((prev) => prev.filter((item) => item.id !== vocabId));
      setTotal((prev) => Math.max(0, prev - 1));
      if (refreshStreak) refreshStreak();
      if (refreshSavedVocab) refreshSavedVocab();
    } catch (e) {
      showToast(e.message || "Lỗi khi xóa từ", "error");
    }
  };

  const handleRefreshMeaning = async (vocabId) => {
    try {
      setRefreshingMeaningId(vocabId);
      showToast("Đang tìm nghĩa tiếng Việt...", "info");
      const res = await refreshVocabMeaning(vocabId, token);
      const newMeaning = res?.vocab?.meaning;
      if (newMeaning) {
        setItems((prev) =>
          prev.map((item) => item.id === vocabId ? { ...item, meaning: newMeaning } : item)
        );
        showToast(`Đã lấy nghĩa: "${newMeaning}"`, "success");
      } else {
        showToast("Không tìm được nghĩa tiếng Việt cho từ này", "warning");
      }
    } catch (e) {
      showToast(e.message || "Lỗi khi lấy nghĩa", "error");
    } finally {
      setRefreshingMeaningId(null);
    }
  };

  const formatCleanIpa = (raw) => {
    if (!raw) return "";
    let clean = raw.trim();
    clean = clean.replace(/^[\[\/]+|[\]\/]+$/g, "").trim();
    clean = clean.replace(/['’]/g, "ˈ").replace(/\s+/g, " ");
    return `/${clean}/`;
  };

  const speakWord = (word, lang = "en-GB") => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(word);
      utter.lang = lang;
      window.speechSynthesis.speak(utter);
    }
  };

  return (
    <div className="vocab-tab-wrapper">
      <div className="vocab-header-bar">
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <BookOpen size={22} color="#6366f1" />
          <h2 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 800, color: "var(--text, #0f172a)" }}>
            Sổ Tay Từ Vựng Thông Minh
          </h2>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted, #64748b)" }}>
            ({total} từ đã lưu)
          </span>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          {/* Search Box */}
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Tìm kiếm từ hoặc nghĩa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: "6px 12px 6px 32px",
                borderRadius: "20px",
                border: "1px solid var(--border, #cbd5e1)",
                fontSize: "0.85rem",
                background: "var(--card-bg, #fff)",
                color: "var(--text, #1e293b)",
              }}
            />
            <Search
              size={14}
              style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}
            />
          </div>

          {/* Filter Pills */}
          <div className="vocab-filter-group">
            {[
              { key: "ALL", label: "Tất cả", color: null },
              { key: "NEW", label: "Mới lưu", color: "#ef4444" },
              { key: "LEARNING", label: "Đang học", color: "#f59e0b" },
              { key: "MASTERED", label: "Đã thuộc", color: "#10b981" },
            ].map((f) => (
              <button
                key={f.key}
                className={`vocab-filter-btn ${filterStatus === f.key ? "active" : ""}`}
                onClick={() => setFilterStatus(f.key)}
                style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                {f.color && (
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: f.color,
                      display: "inline-block",
                    }}
                  />
                )}
                {f.label}
              </button>
            ))}

            {onOpenGuide && (
              <button
                className="btn btn-secondary btn-with-icon"
                onClick={onOpenGuide}
                title="Xem hướng dẫn cách lưu từ & phím tắt"
                style={{ padding: "6px 12px", fontSize: "0.8rem", borderRadius: "20px" }}
              >
                <HelpCircle size={14} color="#6366f1" />
                <span>Hướng dẫn</span>
              </button>
            )}

            {/* Manual Add Word Button */}
            <button
              className="btn btn-primary btn-with-icon"
              onClick={() => setIsAddModalOpen(true)}
              style={{
                padding: "6px 14px",
                fontSize: "0.82rem",
                borderRadius: "20px",
                background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                fontWeight: 600,
                border: "none",
              }}
              title="Thêm từ mới thủ công vào Sổ tay"
            >
              <Plus size={14} strokeWidth={2.5} />
              <span>Thêm từ mới</span>
            </button>

            {/* Export Dropdown Menu */}
            <div className="vocab-export-container" ref={exportMenuRef}>
              <button
                className="btn btn-secondary btn-with-icon"
                onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                style={{ padding: "6px 12px", fontSize: "0.82rem", borderRadius: "20px" }}
                title="Xuất file từ vựng"
              >
                <Download size={14} />
                <span>Xuất từ vựng</span>
                <ChevronDown size={13} />
              </button>

              {isExportMenuOpen && (
                <div className="vocab-export-menu">
                  <button
                    className="vocab-export-item"
                    onClick={() => {
                      setIsExportMenuOpen(false);
                      const ok = exportVocabToCSV(items);
                      if (ok) showToast("Đã tải xuống file Excel/CSV thành công!", "success");
                      else showToast("Chưa có từ vựng nào để xuất", "warning");
                    }}
                  >
                    <FileSpreadsheet size={16} color="#10b981" />
                    <div>
                      <div>Xuất file Excel / CSV</div>
                      <small style={{ color: "var(--text-muted)", fontSize: "0.72rem" }}>UTF-8 hiển thị tiếng Việt chuẩn</small>
                    </div>
                  </button>

                  <button
                    className="vocab-export-item"
                    onClick={() => {
                      setIsExportMenuOpen(false);
                      const ok = exportVocabToAnki(items);
                      if (ok) showToast("Đã tải xuống file Anki Deck thành công!", "success");
                      else showToast("Chưa có từ vựng nào để xuất", "warning");
                    }}
                  >
                    <Layers size={16} color="#6366f1" />
                    <div>
                      <div>Xuất Anki Deck (.txt)</div>
                      <small style={{ color: "var(--text-muted)", fontSize: "0.72rem" }}>Nhập 1 chạm vào Anki Flashcards</small>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {dueItems.length > 0 && (
        <div
          style={{
            background: "linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(16, 185, 129, 0.15))",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            borderRadius: "14px",
            padding: "16px 20px",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "rgba(56, 189, 248, 0.15)",
                border: "1px solid rgba(56, 189, 248, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#38bdf8",
              }}
            >
              <Target size={24} strokeWidth={2} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--text, #f8fafc)" }}>
                Hôm nay bạn có <span style={{ color: "#38bdf8" }}>{dueItems.length} từ</span> đến hạn ôn tập!
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-secondary, #94a3b8)", marginTop: "2px" }}>
                Thực hành qua 4 dạng bài tập tương tác (Trắc nghiệm, Nghe đoán từ, Điền câu, Flashcard)
              </div>
            </div>
          </div>
          <button
            className="btn-primary"
            style={{
              padding: "10px 20px",
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "0.95rem",
              background: "linear-gradient(90deg, #3b82f6, #10b981)",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
            onClick={() => setIsReviewModalOpen(true)}
          >
            <Zap size={18} fill="currentColor" />
            Bắt đầu Ôn tập ({dueItems.length} từ)
          </button>
        </div>
      )}

      {isReviewModalOpen && (
        <VocabReviewModal
          dueItems={dueItems}
          token={token}
          onClose={() => {
            setIsReviewModalOpen(false);
            loadWords();
            if (refreshStreak) refreshStreak();
          }}
          onFinished={() => {
            loadWords();
            if (refreshStreak) refreshStreak();
          }}
        />
      )}

      {!isAuthenticated && (
        <div
          style={{
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            color: "#1e40af",
            padding: "12px 16px",
            borderRadius: "10px",
            fontSize: "0.9rem",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Info size={18} color="#2563eb" />
          <span>
            Bạn đang xem Sổ từ vựng mẫu hoặc khách. Hãy <strong>Đăng nhập</strong> để lưu giữ từ vựng vĩnh viễn trên tài khoản đám mây của bạn!
          </span>
        </div>
      )}

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted, #64748b)" }}>
          <div className="spinner-sm" style={{ display: "inline-block", marginRight: "8px" }}></div>
          Đang tải Sổ từ vựng...
        </div>
      ) : items.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "3.5rem 1rem",
            background: "var(--card-bg, #fff)",
            border: "1px dashed var(--border, #cbd5e1)",
            borderRadius: "12px",
            color: "var(--text-muted, #64748b)",
          }}
        >
          <BookOpen size={40} color="#94a3b8" style={{ marginBottom: "0.75rem" }} />
          <h3 style={{ margin: "0 0 0.5rem 0", color: "var(--text, #1e293b)" }}>Chưa có từ vựng nào trong mục này</h3>
          <p style={{ margin: "0 0 1rem 0", fontSize: "0.9rem" }}>
            Khi luyện nghe chính tả, hãy bôi đen bất kỳ từ nào bạn chưa biết để lưu ngay kèm ảnh minh họa!
          </p>
          {onOpenGuide && (
            <button
              type="button"
              className="btn btn-secondary btn-with-icon"
              onClick={onOpenGuide}
              style={{ margin: "0 auto", padding: "6px 14px", fontSize: "0.85rem" }}
            >
              <HelpCircle size={15} color="#6366f1" />
              <span>Xem hướng dẫn lưu từ mới</span>
            </button>
          )}
        </div>
      ) : (
        <div className="vocab-grid">
          {items.map((v) => (
            <div key={v.id} className="vocab-card">
              <div className="vocab-card-img-wrap">
                <img
                  src={
                    v.image_url ||
                    "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80"
                  }
                  className="vocab-card-img"
                  alt={v.word}
                />
                <button
                  className="vocab-img-rotate-btn"
                  onClick={() => handleRotateImage(v.id, v.word, v.image_url, v.context_sentence)}
                  title="Tìm ảnh minh họa khác theo ngữ cảnh"
                >
                  <RotateCw size={13} style={{ marginRight: 4 }} />
                  Đổi ảnh
                </button>
              </div>

              <div className="vocab-card-body">
                <div className="vocab-word-row">
                  <span className="vocab-word-text">{v.word}</span>
                </div>

                {v.phonetic && (
                  <div className="vocab-pronunciation-row">
                    <span className="vocab-pron-tag">UK</span>
                    <button
                      className="vocab-pron-speaker-btn"
                      onClick={() => speakWord(v.word, "en-GB")}
                      title="Nghe phát âm giọng UK"
                    >
                      <Volume2 size={13} strokeWidth={2.2} />
                    </button>
                    <span className="vocab-pron-ipa-text">
                      {formatCleanIpa(v.phonetic)}
                    </span>
                  </div>
                )}

                <div className="vocab-meaning-text">
                  {v.meaning && v.meaning.toLowerCase().trim() !== v.word.toLowerCase().trim()
                    ? v.meaning
                    : (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                        <span style={{ color: 'var(--text-secondary, #94a3b8)', fontStyle: 'italic', fontSize: '0.8em' }}>
                          Chưa có nghĩa tiếng Việt
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRefreshMeaning(v.id)}
                          disabled={refreshingMeaningId === v.id}
                          style={{
                            fontSize: '0.68rem', padding: '2px 6px', borderRadius: 4,
                            background: 'var(--primary, #6366f1)', color: 'white',
                            border: 'none', cursor: 'pointer', opacity: refreshingMeaningId === v.id ? 0.6 : 1,
                            display: 'inline-flex', alignItems: 'center', gap: 3
                          }}
                          title="Lấy nghĩa tiếng Việt cho từ này"
                        >
                          <RotateCw size={10} className={refreshingMeaningId === v.id ? 'spinning' : ''} />
                          <span>{refreshingMeaningId === v.id ? 'Đang lấy...' : 'Lấy nghĩa VN'}</span>
                        </button>
                      </span>
                    )
                  }
                </div>

                {v.context_sentence && (() => {
                  const { orig, trans } = splitContextSentence(v.context_sentence);
                  return (
                    <div className="vocab-context-box">
                      {orig && (
                        <div className="vocab-context-orig">
                          "{orig.replace(/^"+|"+$/g, '')}"
                        </div>
                      )}
                      {trans && (
                        <div className="vocab-context-trans">
                          {trans.replace(/^"+|"+$/g, '')}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Pronunciation Practice Result Badge */}
                {pronounceResults[v.id] && (
                  <div
                    className={`pronounce-result-badge ${pronounceResults[v.id].isMatch ? "success" : "retry"}`}
                  >
                    {pronounceResults[v.id].isMatch ? (
                      <>
                        <CheckCircle2 size={13} />
                        <span>Chuẩn 100%! ("{pronounceResults[v.id].heard}")</span>
                      </>
                    ) : (
                      <>
                        <Volume2 size={13} />
                        <span>Nghe thành: "{pronounceResults[v.id].heard}" - Thử lại</span>
                      </>
                    )}
                  </div>
                )}
                {listeningWordId === v.id && (
                  <div
                    className="pronounce-result-badge retry"
                    style={{ background: "rgba(239, 68, 68, 0.1)", color: "#dc2626", border: "1px solid rgba(239, 68, 68, 0.3)" }}
                  >
                    <Mic size={13} className="spinner" />
                    <span>Đang lắng nghe bạn nói...</span>
                  </div>
                )}

                <div className="vocab-card-footer">
                  <select
                    className={`vocab-status-select status-${v.status}`}
                    value={v.status}
                    onChange={(e) => handleStatusChange(v.id, e.target.value)}
                  >
                    <option value="NEW">Mới lưu</option>
                    <option value="LEARNING">Đang nhớ</option>
                    <option value="MASTERED">Đã thuộc</option>
                  </select>

                  <div style={{ display: "flex", gap: "4px" }}>
                    <button
                      className="vocab-audio-btn"
                      onClick={() => speakWord(v.word)}
                      title="Phát âm từ này (Audio)"
                    >
                      <Volume2 size={14} strokeWidth={2} />
                    </button>
                    <button
                      className={`vocab-audio-btn ${listeningWordId === v.id ? "listening" : ""}`}
                      onClick={() => handleStartPronouncePractice(v)}
                      title="Luyện phát âm qua Micro (AI nhận diện giọng nói)"
                      style={{
                        color: listeningWordId === v.id ? "#dc2626" : "#6366f1",
                        background: listeningWordId === v.id ? "rgba(239, 68, 68, 0.15)" : undefined,
                      }}
                    >
                      <Mic size={14} strokeWidth={2.2} />
                    </button>
                    <button
                      className="vocab-audio-btn"
                      style={{ color: "#dc2626" }}
                      onClick={() => handleDelete(v.id)}
                      title="Xóa từ khỏi sổ tay"
                    >
                      <Trash2 size={14} strokeWidth={2} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Manual Add Vocab Modal */}
      <AddVocabModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          loadWords();
          if (refreshStreak) refreshStreak();
          if (refreshSavedVocab) refreshSavedVocab();
        }}
      />
    </div>
  );
};

