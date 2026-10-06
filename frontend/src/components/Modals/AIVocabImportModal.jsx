import React, { useState, useRef } from "react";
import {
  Sparkles,
  X,
  FileText,
  Upload,
  Check,
  CheckSquare,
  Square,
  Trash2,
  Plus,
  Loader2,
  Lock,
  Volume2,
  AlertCircle,
  FileSpreadsheet,
  ArrowRight,
  SlidersHorizontal,
  Layers,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  aiExtractVocabFromText,
  aiExtractVocabFromFile,
  batchImportVocab,
} from "../../services/authVocabService";
import { getPdfPageCount, extractPdfTextClient } from "../../utils/pdfExtractor";
import "./AIVocabImportModal.css";

// Diverse samples for quick testing across all domains
const SAMPLE_NEWS = `Artificial intelligence is rapidly revolutionizing the global healthcare landscape. Cutting-edge diagnostic algorithms and predictive models now assist clinicians in detecting anomalies earlier than ever before. However, regulatory frameworks must keep pace with these groundbreaking innovations to safeguard data privacy and patient autonomy.`;

const SAMPLE_IELTS = `Biodiversity loss poses an existential threat to ecological resilience. Habitat fragmentation and rampant deforestation have driven countless indigenous species to the brink of extinction. Conservationists advocate for sustainable reforestation initiatives and stricter environmental legislation to mitigate catastrophic biodiversity decline.`;

const SAMPLE_DIPLOMATIC = `Unit 1
1. Điện mừng: message of congratulations
2. Đồng chí: comrade
3. Bí thư thứ nhất: First Secretary of the Central Committee
4. Tổng Bí thư: General Secretary
5. Đại hội toàn quốc: National Congress
6. Dưới sự lãnh đạo: under the leadership
7. Hiệp định miễn thị thực: Agreement on Visa Exemption
8. Hộ chiếu phổ thông: ordinary passport
9. Có hiệu lực: enter into force
10. Nhân dịp trọng đại này: On this momentous occasion`;

export const AIVocabImportModal = ({ isOpen, onClose, onSuccess }) => {
  const { user, token, showToast, refreshStreak, refreshSavedVocab } = useAuth();
  const [activeTab, setActiveTab] = useState("paste"); // "paste" | "file"
  const [inputText, setInputText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [extractedItems, setExtractedItems] = useState([]);
  const [selectedIndices, setSelectedIndices] = useState(new Set());
  const [dragOver, setDragOver] = useState(false);

  // Selective Page Range State (for PDF & documents)
  const [totalPages, setTotalPages] = useState(null);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);
  const [usePageRange, setUsePageRange] = useState(true);
  const [isReadingPdf, setIsReadingPdf] = useState(false);

  const fileInputRef = useRef(null);

  // Real-time word count calculation
  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const isOverWordLimit = wordCount > 5000;

  if (!isOpen) return null;

  // Strict check for allowed users: tranhuunam23022000 & vuthiquynhtrangbl6d
  const isAllowed = Boolean(
    user?.can_use_ai_import ||
      (user?.email &&
        (user.email.toLowerCase().includes("tranhuunam23022000") ||
          user.email.toLowerCase().includes("vuthiquynhtrang") ||
          user.email.toLowerCase().includes("vuthiquynhtrangbl6d"))) ||
      (user?.name &&
        (user.name.toLowerCase().includes("tranhuunam23022000") ||
          user.name.toLowerCase().includes("vuthiquynhtrang") ||
          user.name.toLowerCase().includes("vuthiquynhtrangbl6d")))
  );

  const handleSpeech = (text) => {
    if (!text || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    utter.rate = 0.9;
    window.speechSynthesis.speak(utter);
  };

  const processSelectedFile = async (file) => {
    if (!file) return;
    setSelectedFile(file);
    setTotalPages(null);
    setStartPage(1);
    setEndPage(1);

    const isPdf = file.name.toLowerCase().endsWith(".pdf");
    if (isPdf) {
      setIsReadingPdf(true);
      try {
        const count = await getPdfPageCount(file);
        if (count && count > 0) {
          setTotalPages(count);
          setStartPage(1);
          setEndPage(Math.min(count, 5));
        }
      } catch (err) {
        console.warn("Could not read pdf pages:", err);
      } finally {
        setIsReadingPdf(false);
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const handleRunAnalysis = async () => {
    if (activeTab === "paste" && !inputText.trim()) {
      showToast("Vui lòng dán nội dung văn bản hoặc danh sách từ vựng cần bóc tách", "warning");
      return;
    }
    if (activeTab === "file" && !selectedFile) {
      showToast("Vui lòng chọn tệp tài liệu (.pdf, .docx, .txt) cần bóc tách", "warning");
      return;
    }

    setIsAnalyzing(true);
    setExtractedItems([]);
    setSelectedIndices(new Set());

    try {
      let result;
      if (activeTab === "file") {
        const isPdf = selectedFile.name.toLowerCase().endsWith(".pdf");

        // Nếu là PDF và bật chọn khoảng trang: FE tự cắt trang trước rồi mới gửi lên AI
        if (isPdf && usePageRange) {
          const s = Math.max(1, parseInt(startPage) || 1);
          const e = Math.max(s, parseInt(endPage) || s);

          showToast(`⚡ Trình duyệt đang cắt trang ${s} → ${e} để tiết kiệm token...`, "info");
          try {
            const clientResult = await extractPdfTextClient(selectedFile, s, e);
            if (clientResult.text && clientResult.text.trim()) {
              const textToProcess = clientResult.text.trim();
              showToast(`AI đang bóc tách từ vựng từ ${clientResult.wordCount} chữ (Trang ${s} - ${e})...`, "info");
              result = await aiExtractVocabFromText(textToProcess, "en", "vi", "auto", token);
            } else {
              // Fallback qua backend nếu PDF không có text layer (ví dụ ảnh scan)
              result = await aiExtractVocabFromFile(selectedFile, token, s, e);
            }
          } catch (clientErr) {
            console.warn("Client PDF extraction fallback to backend:", clientErr);
            result = await aiExtractVocabFromFile(selectedFile, token, s, e);
          }
        } else {
          showToast(`AI đang phân tích tệp "${selectedFile.name}"...`, "info");
          result = await aiExtractVocabFromFile(
            selectedFile,
            token,
            usePageRange ? Number(startPage) : null,
            usePageRange ? Number(endPage) : null
          );
        }
      } else {
        showToast("AI đang trích xuất thuật ngữ & từ vựng từ văn bản...", "info");
        result = await aiExtractVocabFromText(inputText.trim(), "en", "vi", "auto", token);
      }

      const items = result.items || [];
      if (items.length === 0) {
        showToast("AI không tìm thấy từ vựng hoặc thuật ngữ nào trong nội dung này.", "warning");
      } else {
        setExtractedItems(items);
        setSelectedIndices(new Set(items.map((_, i) => i)));
        showToast(`AI đã bóc tách thành công ${items.length} từ vựng & thuật ngữ!`, "success");
      }
    } catch (err) {
      console.error("AI Extraction failed:", err);
      showToast(err.message || "Lỗi khi AI bóc tách từ vựng", "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIndices.size === extractedItems.length) {
      setSelectedIndices(new Set());
    } else {
      setSelectedIndices(new Set(extractedItems.map((_, i) => i)));
    }
  };

  const toggleItem = (idx) => {
    setSelectedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const updateItemField = (idx, field, value) => {
    setExtractedItems((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const removeItem = (idx) => {
    setExtractedItems((prev) => prev.filter((_, i) => i !== idx));
    setSelectedIndices((prev) => {
      const next = new Set();
      prev.forEach((i) => {
        if (i < idx) next.add(i);
        else if (i > idx) next.add(i - 1);
      });
      return next;
    });
  };

  const addNewBlankRow = () => {
    setExtractedItems((prev) => [
      ...prev,
      {
        word: "",
        meaning: "",
        phonetic: "",
        part_of_speech: "phrase",
        context_sentence: "",
      },
    ]);
    setSelectedIndices((prev) => new Set([...prev, extractedItems.length]));
  };

  const handleSaveToNotebook = async () => {
    const selectedList = extractedItems.filter((_, idx) => selectedIndices.has(idx));
    const validItems = selectedList.filter((it) => it.word && it.word.trim());

    if (validItems.length === 0) {
      showToast("Vui lòng chọn ít nhất 1 từ vựng hợp lệ để lưu vào Sổ tay", "warning");
      return;
    }

    setIsSaving(true);
    try {
      const res = await batchImportVocab(validItems, token);
      showToast(res.message || `Đã lưu thành công ${validItems.length} từ vào Sổ từ mới!`, "success");

      if (onSuccess) onSuccess();
      if (refreshStreak) refreshStreak();
      if (refreshSavedVocab) refreshSavedVocab();

      onClose();
    } catch (err) {
      console.error("Batch import error:", err);
      showToast(err.message || "Không thể lưu danh sách từ vựng", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="ai-import-modal-overlay" onClick={onClose}>
      <div className="ai-import-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="ai-import-header">
          <div className="ai-import-title-group">
            <div className="ai-import-icon-badge">
              <Sparkles size={22} />
            </div>
            <div>
              <h2 className="ai-import-title">
                AI Smart Vocabulary Extractor
                <span className="ai-badge-vip">Gemini AI</span>
              </h2>
              <p className="ai-import-subtitle">
                Tự động nhận diện, bóc tách thuật ngữ, phiên âm & nghĩa từ tài liệu PDF/Word hoặc văn bản song ngữ
              </p>
            </div>
          </div>
          <button className="ai-import-close-btn" onClick={onClose} title="Đóng">
            <X size={20} />
          </button>
        </div>

        {/* Access Restriction Screen */}
        {!isAllowed ? (
          <div className="ai-restricted-box">
            <div className="ai-restricted-icon">
              <Lock size={32} />
            </div>
            <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700 }}>
              Tính năng Giới hạn Quyền Truy cập
            </h3>
            <p style={{ maxWidth: "520px", color: "var(--text-muted, #64748b)", lineHeight: 1.6, margin: 0 }}>
              Để kiểm soát chi phí API Gemini cao cấp, tính năng <strong>AI Tự động bóc tách & Import từ vựng</strong> chỉ được kích hoạt riêng cho 2 tài khoản quản trị viên:
            </p>
            <div
              style={{
                background: "rgba(99, 102, 241, 0.08)",
                padding: "10px 18px",
                borderRadius: "10px",
                border: "1px dashed #6366f1",
                fontWeight: 600,
                color: "#4f46e5",
                fontSize: "0.9rem",
              }}
            >
              tranhuunam23022000 & vuthiquynhtrangbl6d
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted, #94a3b8)" }}>
              Tài khoản hiện tại của bạn: <strong>{user?.email || user?.name || "Khách"}</strong>
            </p>
            <button className="btn btn-secondary" onClick={onClose} style={{ marginTop: "12px", borderRadius: "10px" }}>
              Đóng cửa sổ
            </button>
          </div>
        ) : (
          /* Main Workflow Screen */
          <>
            <div className="ai-import-body">
              {/* Tab Selector */}
              <div className="ai-import-tabs">
                <button
                  className={`ai-tab-btn ${activeTab === "paste" ? "active" : ""}`}
                  onClick={() => setActiveTab("paste")}
                >
                  <FileText size={16} />
                  <span>Dán Văn bản / Bảng song ngữ</span>
                </button>
                <button
                  className={`ai-tab-btn ${activeTab === "file" ? "active" : ""}`}
                  onClick={() => setActiveTab("file")}
                >
                  <Upload size={16} />
                  <span>Tải tệp tài liệu (.pdf, .docx, .txt)</span>
                </button>
              </div>

              {/* Tab 1: Paste Text */}
              {activeTab === "paste" && (
                <div className="ai-paste-wrapper">
                  <div className="ai-quick-samples-bar">
                    <span style={{ fontSize: "0.82rem", color: "var(--text-muted, #64748b)" }}>
                      Dán <strong>bất kỳ văn bản nào</strong> (báo chí, đọc hiểu, hội thoại, truyện, tài liệu chuyên ngành... tối đa 5.000 từ):
                    </span>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      <button
                        className="ai-sample-btn"
                        onClick={() => setInputText(SAMPLE_NEWS)}
                        title="Dán mẫu đoạn báo chí công nghệ"
                      >
                        📰 Báo chí / Tech
                      </button>
                      <button
                        className="ai-sample-btn"
                        onClick={() => setInputText(SAMPLE_IELTS)}
                        title="Dán mẫu đọc hiểu IELTS/Academic"
                      >
                        🎓 Đọc hiểu IELTS
                      </button>
                      <button
                        className="ai-sample-btn"
                        onClick={() => setInputText(SAMPLE_DIPLOMATIC)}
                        title="Dán mẫu danh sách từ vựng song ngữ"
                      >
                        📜 Song ngữ / Unit 1
                      </button>
                    </div>
                  </div>
                  <textarea
                    className="ai-textarea"
                    placeholder="Dán bất kỳ đoạn văn bản tiếng Anh nào bạn muốn học từ vựng (bài báo, truyện ngắn, email công việc, bài đọc thi, danh sách từ vựng song ngữ... tối đa 5.000 từ)..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    rows={6}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.8rem" }}>
                    <span style={{ color: "var(--text-muted, #94a3b8)" }}>
                      AI sẽ tự động nhận diện từ vựng đắt giá, collocations, phrasal verbs, phiên âm IPA & nghĩa tiếng Việt.
                    </span>
                    <span
                      style={{
                        fontWeight: 700,
                        color: isOverWordLimit ? "#ef4444" : wordCount > 0 ? "#10b981" : "var(--text-muted, #94a3b8)",
                        background: isOverWordLimit ? "rgba(239, 68, 68, 0.1)" : "rgba(255, 255, 255, 0.05)",
                        padding: "2px 8px",
                        borderRadius: "6px",
                      }}
                    >
                      {wordCount.toLocaleString()} / 5.000 từ {isOverWordLimit && "(sẽ lấy 5.000 từ đầu tiên)"}
                    </span>
                  </div>
                </div>
              )}

              {/* Tab 2: File Upload */}
              {activeTab === "file" && (
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.docx,.txt,.md,.csv"
                    style={{ display: "none" }}
                  />
                  <div
                    className={`ai-dropzone ${dragOver ? "dragover" : ""}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                  >
                    <div className="ai-dropzone-icon">
                      <Upload size={24} />
                    </div>
                    {selectedFile ? (
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "1rem", color: "#6366f1" }}>
                          {selectedFile.name}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted, #64748b)", marginTop: "4px" }}>
                          Kích thước: {(selectedFile.size / 1024).toFixed(1)} KB {totalPages ? `• Đã nhận diện: ${totalPages} trang` : ""}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                          Kéo thả tệp PDF, Word (.docx) hoặc Text vào đây (không quá 5.000 từ)
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted, #64748b)", marginTop: "4px" }}>
                          Hỗ trợ định dạng: .pdf, .docx, .txt, .md, .csv (Bất kỳ tài liệu, giáo trình, đề thi, báo cáo nào)
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Selective Page Range Box (Frontend cuts pages before sending to AI to save tokens) */}
                  {selectedFile && (
                    <div className="ai-page-range-card">
                      <div className="ai-page-range-header">
                        <div className="ai-page-range-title">
                          <SlidersHorizontal size={16} className="text-primary" />
                          <span>Chọn số trang cần bóc tách (Từ → Đến):</span>
                        </div>
                        <div className="ai-page-range-badge">
                          {isReadingPdf ? (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                              <Loader2 size={12} className="spin" /> Đang đọc số trang...
                            </span>
                          ) : totalPages ? (
                            <span>Tệp có <strong>{totalPages}</strong> trang</span>
                          ) : (
                            <span>Trang tùy chỉnh</span>
                          )}
                        </div>
                      </div>

                      <div className="ai-page-range-inputs">
                        <div className="ai-page-field">
                          <label className="ai-page-label">Từ trang:</label>
                          <input
                            type="number"
                            min="1"
                            max={endPage || totalPages || 9999}
                            value={startPage}
                            onChange={(e) => {
                              const val = Math.max(1, parseInt(e.target.value) || 1);
                              setStartPage(val);
                              if (val > endPage) setEndPage(val);
                            }}
                            className="ai-page-number-input"
                          />
                        </div>

                        <span className="ai-page-arrow">➔</span>

                        <div className="ai-page-field">
                          <label className="ai-page-label">Đến trang:</label>
                          <input
                            type="number"
                            min={startPage || 1}
                            max={totalPages || 9999}
                            value={endPage}
                            onChange={(e) => {
                              const val = Math.max(startPage, parseInt(e.target.value) || startPage);
                              setEndPage(val);
                            }}
                            className="ai-page-number-input"
                          />
                        </div>

                        {totalPages && (
                          <button
                            type="button"
                            className="ai-btn-all-pages"
                            onClick={() => {
                              setStartPage(1);
                              setEndPage(totalPages);
                            }}
                            title="Chọn toàn bộ tài liệu"
                          >
                            Toàn bộ ({totalPages} trang)
                          </button>
                        )}
                      </div>

                      <div className="ai-page-range-notice">
                        ⚡ <strong>Tiết kiệm Token tối đa:</strong> Trình duyệt sẽ tự động cắt <em>đúng từ trang {startPage} đến trang {endPage}</em> và chỉ gửi phần chữ này lên AI. Không gửi các trang thừa, vừa nhanh vừa không tốn chi phí API!
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Trigger */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  className="ai-btn-analyze"
                  onClick={handleRunAnalysis}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 size={18} className="spin" />
                      <span>AI đang bóc tách từ vựng & IPA...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      <span>Bắt đầu AI Phân tích & Tách từ</span>
                    </>
                  )}
                </button>
              </div>

              {/* Extracted Words Review Table */}
              {extractedItems.length > 0 && (
                <div className="ai-results-section">
                  <div className="ai-results-toolbar">
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <button
                        className="btn btn-secondary"
                        onClick={toggleSelectAll}
                        style={{ padding: "5px 12px", fontSize: "0.8rem", borderRadius: "8px" }}
                      >
                        {selectedIndices.size === extractedItems.length ? (
                          <>
                            <Square size={13} style={{ marginRight: "4px" }} /> Bỏ chọn tất cả
                          </>
                        ) : (
                          <>
                            <CheckSquare size={13} style={{ marginRight: "4px" }} /> Chọn tất cả
                          </>
                        )}
                      </button>
                      <span className="ai-results-count">
                        Đã chọn {selectedIndices.size} / {extractedItems.length} từ vựng
                      </span>
                    </div>

                    <button
                      className="btn btn-secondary"
                      onClick={addNewBlankRow}
                      style={{ padding: "5px 12px", fontSize: "0.8rem", borderRadius: "8px" }}
                    >
                      <Plus size={13} style={{ marginRight: "4px" }} /> Thêm hàng thủ công
                    </button>
                  </div>

                  <div className="ai-table-container">
                    <table className="ai-vocab-table">
                      <thead>
                        <tr>
                          <th style={{ width: "40px", textAlign: "center" }}>
                            <input
                              type="checkbox"
                              checked={selectedIndices.size === extractedItems.length && extractedItems.length > 0}
                              onChange={toggleSelectAll}
                            />
                          </th>
                          <th style={{ width: "28%" }}>Từ / Cụm từ tiếng Anh</th>
                          <th style={{ width: "28%" }}>Nghĩa tiếng Việt</th>
                          <th style={{ width: "18%" }}>Phiên âm IPA</th>
                          <th style={{ width: "20%" }}>Ngữ cảnh / Ví dụ</th>
                          <th style={{ width: "40px", textAlign: "center" }}>Xóa</th>
                        </tr>
                      </thead>
                      <tbody>
                        {extractedItems.map((item, idx) => {
                          const isSelected = selectedIndices.has(idx);
                          return (
                            <tr key={idx} style={{ opacity: isSelected ? 1 : 0.45 }}>
                              <td style={{ textAlign: "center" }}>
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleItem(idx)}
                                />
                              </td>
                              <td>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                  <input
                                    className="ai-inline-input"
                                    value={item.word || ""}
                                    onChange={(e) => updateItemField(idx, "word", e.target.value)}
                                    placeholder="English word/phrase..."
                                    style={{ fontWeight: 600 }}
                                  />
                                  {item.word && (
                                    <button
                                      type="button"
                                      onClick={() => handleSpeech(item.word)}
                                      style={{
                                        border: "none",
                                        background: "transparent",
                                        cursor: "pointer",
                                        color: "#6366f1",
                                        padding: "2px",
                                      }}
                                      title="Nghe phát âm"
                                    >
                                      <Volume2 size={14} />
                                    </button>
                                  )}
                                </div>
                              </td>
                              <td>
                                <input
                                  className="ai-inline-input"
                                  value={item.meaning || ""}
                                  onChange={(e) => updateItemField(idx, "meaning", e.target.value)}
                                  placeholder="Nghĩa tiếng Việt..."
                                />
                              </td>
                              <td>
                                <input
                                  className="ai-inline-input"
                                  value={item.phonetic || ""}
                                  onChange={(e) => updateItemField(idx, "phonetic", e.target.value)}
                                  placeholder="/IPA/..."
                                  style={{ fontFamily: "monospace", color: "#6366f1" }}
                                />
                              </td>
                              <td>
                                <input
                                  className="ai-inline-input"
                                  value={item.context_sentence || ""}
                                  onChange={(e) => updateItemField(idx, "context_sentence", e.target.value)}
                                  placeholder="Câu ví dụ..."
                                />
                              </td>
                              <td style={{ textAlign: "center" }}>
                                <button
                                  type="button"
                                  onClick={() => removeItem(idx)}
                                  style={{
                                    border: "none",
                                    background: "transparent",
                                    cursor: "pointer",
                                    color: "#ef4444",
                                    padding: "4px",
                                  }}
                                  title="Xóa hàng này"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="ai-import-footer">
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted, #64748b)" }}>
                💡 Từ vựng được lưu sẽ tự động gán vào Sổ tay, hỗ trợ SRS và 20 dạng bài tập tương tác.
              </span>
              <div style={{ display: "flex", gap: "10px" }}>
                <button className="btn btn-secondary" onClick={onClose} disabled={isSaving}>
                  Hủy
                </button>
                <button
                  className="ai-btn-save"
                  onClick={handleSaveToNotebook}
                  disabled={isSaving || selectedIndices.size === 0}
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={16} className="spin" />
                      <span>Đang lưu vào Sổ tay...</span>
                    </>
                  ) : (
                    <>
                      <Check size={16} strokeWidth={2.5} />
                      <span>Lưu {selectedIndices.size} từ vào Sổ từ mới</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
