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
import { splitContextSentence } from "../../utils/textNormalizer";

export const VocabTab = ({ isActive = false }) => {
  const { token, isAuthenticated, refreshStreak, showToast } = useAuth();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [refreshingMeaningId, setRefreshingMeaningId] = useState(null);
  const [dueItems, setDueItems] = useState([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [showGuide, setShowGuide] = useState(() => localStorage.getItem("shotlang_vocab_guide_expanded") !== "false");

  const toggleGuide = () => {
    setShowGuide((prev) => {
      const next = !prev;
      localStorage.setItem("shotlang_vocab_guide_expanded", String(next));
      return next;
    });
  };

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

  const handleStatusChange = async (vocabId, newStatus) => {
    try {
      await updateVocabStatus(vocabId, newStatus, token);
      showToast("Đã cập nhật trạng thái từ vựng", "success");
      setItems((prev) =>
        prev.map((item) => (item.id === vocabId ? { ...item, status: newStatus } : item))
      );
      if (refreshStreak) refreshStreak();
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
          </div>
        </div>
      </div>

      {/* VOCABULARY SAVING INSTRUCTIONS & GUIDE */}
      <div className="vocab-guide-banner">
        <div className="vocab-guide-header">
          <div className="vocab-guide-title">
            <Sparkles size={18} color="#6366f1" />
            <span>Hướng dẫn: Cách lưu từ mới vào Sổ tay</span>
          </div>
          <button
            type="button"
            className="vocab-guide-toggle-btn"
            onClick={toggleGuide}
          >
            {showGuide ? (
              <>
                <ChevronUp size={14} />
                <span>Thu gọn hướng dẫn</span>
              </>
            ) : (
              <>
                <ChevronDown size={14} />
                <span>Xem hướng dẫn lưu từ</span>
              </>
            )}
          </button>
        </div>

        {showGuide && (
          <>
            <div className="vocab-guide-steps">
              {/* Step 1 */}
              <div className="vocab-guide-step-card">
                <div className="vocab-step-number">1</div>
                <div className="vocab-step-content">
                  <h4>Quét chọn (bôi đen) từ</h4>
                  <p>
                    Khi luyện nghe (Dictation) hoặc đọc lời thoại (Transcript), hãy <strong>dùng chuột bôi đen</strong> bất kỳ từ hoặc cụm từ tiếng Anh nào bạn muốn lưu.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="vocab-guide-step-card">
                <div className="vocab-step-number">2</div>
                <div className="vocab-step-content">
                  <h4>Nhấp nút "✨ Lưu từ"</h4>
                  <p>
                    Nút nổi thông minh <strong>✨ Lưu [từ đã chọn]</strong> sẽ lập tức xuất hiện ngay phía trên con trỏ chuột. Nhấp vào để lưu từ vào sổ tay.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="vocab-guide-step-card">
                <div className="vocab-step-number">3</div>
                <div className="vocab-step-content">
                  <h4>AI tự động phân tích</h4>
                  <p>
                    Hệ thống tự động tra <strong>nghĩa tiếng Việt</strong>, phiên âm chuẩn <strong>IPA</strong>, lưu lại <strong>ngữ cảnh câu gốc</strong> và tìm <strong>ảnh minh họa AI</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div className="vocab-guide-interactive-hint">
              <span>💡 <strong>Thử ngay tại đây:</strong> Hãy dùng chuột quét chọn (bôi đen) từ này 👉</span>
              <mark
                style={{
                  background: "#fef08a",
                  color: "#854d0e",
                  padding: "2px 8px",
                  borderRadius: "5px",
                  fontWeight: 700,
                  userSelect: "all",
                  cursor: "text",
                }}
              >
                extraordinary
              </mark>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted, #64748b)" }}>
                để thấy nút "✨ Lưu từ" nổi lên ngay lập tức!
              </span>
            </div>
          </>
        )}
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
          <p style={{ margin: 0, fontSize: "0.9rem" }}>
            Khi luyện nghe chính tả, hãy bôi đen bất kỳ từ nào bạn chưa biết để lưu ngay kèm ảnh minh họa!
          </p>
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
                      title="Phát âm từ này"
                    >
                      <Volume2 size={14} strokeWidth={2} />
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
    </div>
  );
};

