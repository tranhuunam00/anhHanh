import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { BookOpen, Info, HelpCircle } from "../Icons";
import { useAuth } from "../../context/AuthContext";
import {
  fetchVocabList,
  updateVocabStatus,
  rotateVocabImage,
  deleteVocabWord,
  refreshVocabMeaning,
} from "../../services/authVocabService";
import VocabExerciseHubModal from "./VocabExerciseHubModal";
import { AddVocabModal } from "../Modals/AddVocabModal";
import { EditVocabModal } from "../Modals/EditVocabModal";
import { AIVocabImportModal } from "../Modals/AIVocabImportModal";
import { ThemeVocabExplorerModal } from "../Modals/ThemeVocabExplorerModal";
import { markVocabStudiedToday } from "../../utils/dailyReminderManager";
import { getVoiceLang } from "../../utils/languageVoices";
import { VocabToolbar } from "./VocabToolbar";
import { VocabKeyboardShortcutsBar } from "./VocabKeyboardShortcutsBar";
import { VocabCard } from "./VocabCard";
import { VocabPagination } from "./VocabPagination";
import { useVocabKeyboardNav } from "../../hooks/useVocabKeyboardNav";

export const VocabTab = ({ isActive = false, onOpenGuide }) => {
  const { token, isAuthenticated, user, refreshStreak, showToast, refreshSavedVocab } = useAuth();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [refreshingMeaningId, setRefreshingMeaningId] = useState(null);
  const [isExerciseHubOpen, setIsExerciseHubOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAIImportModalOpen, setIsAIImportModalOpen] = useState(false);
  const [isThemeExplorerOpen, setIsThemeExplorerOpen] = useState(false);
  const [editingVocab, setEditingVocab] = useState(null);
  const [listeningWordId, setListeningWordId] = useState(null);
  const [pronounceResults, setPronounceResults] = useState({});

  // Pagination state for vocabulary list
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(18);
  const recognitionRef = useRef(null);

  // Reset to page 1 on filter or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(items.length / (pageSize === "ALL" ? items.length || 1 : pageSize)));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const displayedItems = useMemo(() => {
    if (pageSize === "ALL") return items;
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage, pageSize]);

  const handlePageChange = (p) => {
    if (p < 1 || p > totalPages) return;
    setCurrentPage(p);
    const container = document.querySelector(".vocab-tab-wrapper");
    if (container) {
      container.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const loadWords = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchVocabList(filterStatus, searchQuery, token);
      const list = data?.items || data?.vocabulary || [];
      setItems(list);
      setTotal(data?.total !== undefined ? data.total : (data?.stats?.total || list.length));
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

  // Handle external open-exercise trigger
  useEffect(() => {
    const handleOpenHub = () => {
      setIsExerciseHubOpen(true);
    };
    window.addEventListener("open-exercise-hub-modal", handleOpenHub);

    if (typeof window !== "undefined" && window.location.search.includes("openExercise=true")) {
      setIsExerciseHubOpen(true);
    }

    return () => {
      window.removeEventListener("open-exercise-hub-modal", handleOpenHub);
    };
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

  const speakWord = (word, sourceLang = null) => {
    if ("speechSynthesis" in window && word) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(word);
      utter.lang = getVoiceLang(sourceLang, word);
      utter.rate = 0.9;
      window.speechSynthesis.speak(utter);
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
    showToast(`Đang nghe... Hãy phát âm từ "${item.word}"`, "info");

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
        showToast(`Xuất sắc! Phát âm từ "${item.word}" chuẩn 100%!`, "success");
      } else {
        showToast(`Máy nghe được: "${heard}". Hãy nghe lại phát âm mẫu và thử lại nhé!`, "warning");
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

  // Keyboard navigation & status shortcuts hook
  const isAnyModalOpen =
    isAddModalOpen ||
    Boolean(editingVocab) ||
    isExerciseHubOpen ||
    isAIImportModalOpen ||
    isThemeExplorerOpen;

  const { focusedIndex, setFocusedIndex, setCardRef } = useVocabKeyboardNav({
    items: displayedItems,
    isActive,
    isModalOpen: isAnyModalOpen,
    currentPage,
    totalPages,
    onPageChange: handlePageChange,
    onOpenDetail: (vocabItem) => setEditingVocab(vocabItem),
    onSpeak: (w, lang) => speakWord(w, lang),
    onStatusChange: handleStatusChange,
    showToast,
  });

  return (
    <div className="vocab-tab-wrapper">
      {/* Top Toolbar: Search, Filters, and Action Buttons */}
      <VocabToolbar
        total={total}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
        onOpenGuide={onOpenGuide}
        onOpenAdd={() => setIsAddModalOpen(true)}
        onOpenAIImport={() => setIsAIImportModalOpen(true)}
        onOpenPractice={() => setIsExerciseHubOpen(true)}
        onOpenThemeExplorer={() => setIsThemeExplorerOpen(true)}
        items={items}
        showToast={showToast}
      />

      {/* Vocabulary Practice Exercise Modal (Dạng 1) */}
      {isExerciseHubOpen && (
        <VocabExerciseHubModal
          vocabPool={items}
          token={token}
          user={user}
          onUpdateWordStatus={handleStatusChange}
          onClose={() => {
            setIsExerciseHubOpen(false);
            loadWords();
            if (refreshStreak) refreshStreak();
          }}
          onFinished={() => {
            markVocabStudiedToday();
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

      {/* Keyboard Shortcuts Guidance Bar */}
      {items.length > 0 && <VocabKeyboardShortcutsBar />}

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
        <>
          <div className="vocab-grid">
            {displayedItems.map((v, idx) => (
              <VocabCard
                key={v.id}
                vocab={v}
                isFocused={focusedIndex === idx}
                cardRef={setCardRef(idx)}
                onClick={() => {
                  setFocusedIndex(idx);
                  setEditingVocab(v);
                }}
                onRotateImage={handleRotateImage}
                onEdit={(item) => setEditingVocab(item)}
                onSpeak={speakWord}
                onRefreshMeaning={handleRefreshMeaning}
                refreshingMeaningId={refreshingMeaningId}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                listeningWordId={listeningWordId}
                pronounceResults={pronounceResults}
                onStartPronouncePractice={handleStartPronouncePractice}
              />
            ))}
          </div>

          {/* Vocab List Pagination Bar */}
          <VocabPagination
            totalItems={items.length}
            currentPage={currentPage}
            pageSize={pageSize}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setCurrentPage(1);
            }}
          />
        </>
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

      {/* Full Edit Vocab Modal */}
      <EditVocabModal
        isOpen={!!editingVocab}
        vocab={editingVocab}
        onClose={() => setEditingVocab(null)}
        onSuccess={() => {
          loadWords();
          if (refreshStreak) refreshStreak();
          if (refreshSavedVocab) refreshSavedVocab();
        }}
      />

      {/* AI Smart Vocabulary Import Modal */}
      <AIVocabImportModal
        isOpen={isAIImportModalOpen}
        onClose={() => setIsAIImportModalOpen(false)}
        onSuccess={() => {
          loadWords();
          if (refreshStreak) refreshStreak();
          if (refreshSavedVocab) refreshSavedVocab();
        }}
      />

      {/* 30 Topics System Vocab Bank Explorer Modal */}
      <ThemeVocabExplorerModal
        isOpen={isThemeExplorerOpen}
        onClose={() => setIsThemeExplorerOpen(false)}
        token={token}
        showToast={showToast}
        onSuccessImport={() => {
          loadWords();
          if (refreshStreak) refreshStreak();
          if (refreshSavedVocab) refreshSavedVocab();
        }}
      />
    </div>
  );
};
