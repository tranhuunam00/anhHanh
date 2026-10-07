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
  Globe,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  aiExtractVocabFromText,
  aiExtractVocabFromFile,
  batchImportVocab,
} from "../../services/authVocabService";
import { getPdfPageCount, extractPdfTextClient, slicePdfClient } from "../../utils/pdfExtractor";
import "./AIVocabImportModal.css";

// 6 Supported Languages
export const EXTRACT_LANGUAGES = [
  { id: "en", label: "Tiếng Anh", native: "English", flag: "🇬🇧" },
  { id: "ja", label: "Tiếng Nhật", native: "日本語", flag: "🇯🇵" },
  { id: "zh", label: "Tiếng Trung", native: "中文", flag: "🇨🇳" },
  { id: "ko", label: "Tiếng Hàn", native: "한국어", flag: "🇰🇷" },
  { id: "fr", label: "Tiếng Pháp", native: "Français", flag: "🇫🇷" },
  { id: "de", label: "Tiếng Đức", native: "Deutsch", flag: "🇩🇪" },
];

// Diverse samples by language for quick testing
const SAMPLES_BY_LANG = {
  en: [
    {
      label: "📰 Báo chí / Tech",
      text: `Artificial intelligence is rapidly revolutionizing the global healthcare landscape. Cutting-edge diagnostic algorithms and predictive models now assist clinicians in detecting anomalies earlier than ever before. However, regulatory frameworks must keep pace with these groundbreaking innovations to safeguard data privacy and patient autonomy.`,
    },
    {
      label: "🎓 Đọc hiểu IELTS",
      text: `Biodiversity loss poses an existential threat to ecological resilience. Habitat fragmentation and rampant deforestation have driven countless indigenous species to the brink of extinction. Conservationists advocate for sustainable reforestation initiatives and stricter environmental legislation to mitigate catastrophic biodiversity decline.`,
    },
    {
      label: "📜 Song ngữ / Unit 1",
      text: `Unit 1
1. Điện mừng: message of congratulations
2. Đồng chí: comrade
3. Bí thư thứ nhất: First Secretary of the Central Committee
4. Tổng Bí thư: General Secretary
5. Đại hội toàn quốc: National Congress
6. Dưới sự lãnh đạo: under the leadership
7. Hiệp định miễn thị thực: Agreement on Visa Exemption
8. Hộ chiếu phổ thông: ordinary passport
9. Có hiệu lực: enter into force
10. Nhân dịp trọng đại này: On this momentous occasion`,
    },
  ],
  ja: [
    {
      label: "📰 Tin tức Nhật (NHK)",
      text: `人工知能（AI）の急速な普及に伴い、医療分野における診断支援システムの導入が進んでいます。最新の画像認識技術を活用することで、医師が病気の早期兆候を見逃すリスクを減らすことが期待されています。しかし、患者の個人情報保護やアルゴリズムの透明性確保など、解決すべき倫理的課題も多く残されています。`,
    },
    {
      label: "📜 Song ngữ Nhật - Việt",
      text: `1. 人工知能: trí tuệ nhân tạo
2. 早期発見: phát hiện sớm
3. 個人情報保護: bảo vệ thông tin cá nhân
4. 透明性: tính minh bạch
5. 持続可能な開発: phát triển bền vững
6. 画像認識技術: công nghệ nhận dạng hình ảnh`,
    },
  ],
  zh: [
    {
      label: "📰 Tin tức / Khoa học",
      text: `随着人工智能技术的飞速发展，现代医疗领域正在经历前所未有的深刻变革。先进的算法模型不仅能够辅助临床医生进行精准诊断，还能大幅提高疾病筛查的效率。然而，数据安全与隐私保护依然是亟待解决的关键问题。`,
    },
    {
      label: "📜 Song ngữ Trung - Việt",
      text: `1. 人工智能: trí tuệ nhân tạo
2. 临床诊断: chẩn đoán lâm sàng
3. 隐私保护: bảo vệ quyền riêng tư
4. 可持续发展: phát triển bền vững
5. 深刻变革: sự chuyển biến sâu sắc`,
    },
  ],
  ko: [
    {
      label: "📰 Tin tức / Đọc hiểu",
      text: `인공지능 기술의 눈부신 발전으로 의료 분야에 커다란 혁신이 일어나고 있습니다. 첨단 딥러닝 알고리즘은 의사들의 정밀 진단을 보조하여 질병의 조기 발견 가능성을 획기적으로 높이고 있습니다.`,
    },
    {
      label: "📜 Song ngữ Hàn - Việt",
      text: `1. 인공지능: trí tuệ nhân tạo
2. 정밀 진단: chẩn đoán chính xác
3. 조기 발견: phát hiện sớm
4. 개인정보 보호: bảo vệ thông tin cá nhân`,
    },
  ],
  fr: [
    {
      label: "📰 Tin tức Pháp (Le Monde)",
      text: `L'intelligence artificielle transforme profondément les systèmes de santé mondiaux. Les algorithmes d'apprentissage automatique permettent désormais d'assister les praticiens dans le dépistage précoce des maladies.`,
    },
    {
      label: "📜 Song ngữ Pháp - Việt",
      text: `1. l'intelligence artificielle: trí tuệ nhân tạo
2. le dépistage précoce: sự tầm soát sớm
3. le développement durable: phát triển bền vững`,
    },
  ],
  de: [
    {
      label: "📰 Tin tức Đức (Spiegel)",
      text: `Die künstliche Intelligenz revolutioniert derzeit das moderne Gesundheitswesen weltweit. Leistungsstarke Algorithmen unterstützen Ärztinnen und Ärzte bei der frühzeitigen Erkennung von Krankheiten.`,
    },
    {
      label: "📜 Song ngữ Đức - Việt",
      text: `1. die künstliche Intelligenz: trí tuệ nhân tạo
2. das Gesundheitswesen: hệ thống y tế
3. die nachhaltige Entwicklung: phát triển bền vững`,
    },
  ],
};

const PLACEHOLDERS = {
  en: "Dán bất kỳ đoạn văn bản tiếng Anh nào bạn muốn học từ vựng (bài báo, truyện ngắn, email công việc, bài đọc thi, danh sách song ngữ... tối đa 5.000 từ)...",
  ja: "Dán bất kỳ đoạn văn bản tiếng Nhật nào (bài báo NHK, truyện, tài liệu JLPT, danh sách từ vựng song ngữ Nhật - Việt... tối đa 5.000 từ)...",
  zh: "Dán bất kỳ đoạn văn bản tiếng Trung nào (tin tức, tài liệu HSK, bài đọc, danh sách từ vựng song ngữ Trung - Việt... tối đa 5.000 từ)...",
  ko: "Dán bất kỳ đoạn văn bản tiếng Hàn nào (tin tức, tài liệu TOPIK, danh sách từ vựng song ngữ Hàn - Việt... tối đa 5.000 từ)...",
  fr: "Dán bất kỳ đoạn văn bản tiếng Pháp nào (bài báo, tài liệu DELF/DALF, danh sách từ vựng song ngữ Pháp - Việt... tối đa 5.000 từ)...",
  de: "Dán bất kỳ đoạn văn bản tiếng Đức nào (bài báo, tài liệu Goethe, danh sách từ vựng song ngữ Đức - Việt... tối đa 5.000 từ)...",
};

// Size limits
const MAX_FE_FILE_SIZE = 500 * 1024 * 1024; // 500MB max on Frontend
const MAX_BE_FILE_SIZE = 5 * 1024 * 1024;   // 5MB max direct upload to Backend

export const AIVocabImportModal = ({ isOpen, onClose, onSuccess }) => {
  const { user, token, showToast, refreshStreak, refreshSavedVocab } = useAuth();
  const [activeTab, setActiveTab] = useState("paste"); // "paste" | "file"
  const [selectedLang, setSelectedLang] = useState("en"); // "en" | "ja" | "zh" | "ko" | "fr" | "de"
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
    const langMap = {
      en: "en-US",
      ja: "ja-JP",
      zh: "zh-CN",
      ko: "ko-KR",
      fr: "fr-FR",
      de: "de-DE",
    };
    utter.lang = langMap[selectedLang] || "en-US";
    utter.rate = 0.9;
    window.speechSynthesis.speak(utter);
  };

  const processSelectedFile = async (file) => {
    if (!file) return;

    // FE 500MB Size Limit Check
    if (file.size > MAX_FE_FILE_SIZE) {
      showToast(
        `Kích thước tệp vượt quá 500MB (${(file.size / (1024 * 1024)).toFixed(1)}MB). Vui lòng chọn tệp nhỏ hơn 500MB.`,
        "error"
      );
      return;
    }

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

    const currentLangObj = EXTRACT_LANGUAGES.find((l) => l.id === selectedLang) || EXTRACT_LANGUAGES[0];

    try {
      let result;
      if (activeTab === "file") {
        const isPdf = selectedFile.name.toLowerCase().endsWith(".pdf");

        // Nếu là PDF: FE CẮT TỆP TRỰC TIẾP TRÊN TRÌNH DUYỆT VÀ CHỈ ĐẨY TỆP ĐÃ CẮT LÊN BE
        if (isPdf) {
          const s = Math.max(1, parseInt(startPage) || 1);
          const e = Math.max(s, parseInt(endPage) || s);

          showToast(
            `⚡ Trình duyệt đang cắt trang ${s} → ${e} thành tệp nhẹ (hỗ trợ tệp gốc đến 500MB)...`,
            "info"
          );

          let fileToSend = selectedFile;

          try {
            // FE CẮT TỆP BẰNG PDF-LIB
            const slicedFile = await slicePdfClient(selectedFile, s, e);
            fileToSend = slicedFile;
            showToast(
              `✓ Đã cắt thành công ${e - s + 1} trang (${(slicedFile.size / 1024).toFixed(1)} KB). Đang đẩy tệp cắt lên máy chủ...`,
              "info"
            );
          } catch (sliceErr) {
            console.warn("Lỗi khi cắt PDF trên client:", sliceErr);
            // Fallback: nếu tệp gốc > 5MB mà cắt nhị phân bị lỗi, đọc text trực tiếp trên client
            if (selectedFile.size > MAX_BE_FILE_SIZE) {
              const clientResult = await extractPdfTextClient(selectedFile, s, e);
              if (clientResult.text && clientResult.text.trim()) {
                showToast(
                  `AI đang bóc tách từ vựng từ ${clientResult.wordCount} chữ (Trang ${s} - ${e})...`,
                  "info"
                );
                result = await aiExtractVocabFromText(clientResult.text.trim(), selectedLang, "vi", "auto", token);
                const items = result.items || [];
                if (items.length === 0) {
                  showToast("AI không tìm thấy từ vựng hoặc thuật ngữ nào trong nội dung này.", "warning");
                } else {
                  setExtractedItems(items);
                  setSelectedIndices(new Set(items.map((_, i) => i)));
                  showToast(`AI đã bóc tách thành công ${items.length} từ vựng (${currentLangObj.label})!`, "success");
                }
                return;
              }
            }
          }

          // Kiểm tra dung lượng tệp trước khi đẩy lên BE (BE tối đa 5MB)
          if (fileToSend.size > MAX_BE_FILE_SIZE) {
            throw new Error(
              `Tệp cắt vẫn vượt quá 5MB (${(fileToSend.size / (1024 * 1024)).toFixed(1)}MB). Vui lòng chọn ít trang hơn (ví dụ 1 - 5 trang).`
            );
          }

          showToast(
            `Đang gửi tệp cắt "${fileToSend.name}" (${(fileToSend.size / 1024).toFixed(1)} KB) lên AI...`,
            "info"
          );
          // Gửi đúng tệp đã cắt lên backend
          result = await aiExtractVocabFromFile(
            fileToSend,
            token,
            null,
            null,
            selectedLang,
            "vi"
          );
        } else {
          // Xử lý tệp không phải PDF (.docx, .txt, .md, .csv)
          let fileToSend = selectedFile;
          if (selectedFile.size > MAX_BE_FILE_SIZE) {
            // Nếu là tệp text/md/csv lớn: FE tự cắt văn bản dưới 5MB
            const isTextType = /\.(txt|md|csv)$/i.test(selectedFile.name);
            if (isTextType) {
              const textContent = await selectedFile.text();
              const words = textContent.trim().split(/\s+/).slice(0, 5000).join(" ");
              const cleanBaseName = selectedFile.name.replace(/\.[^/.]+$/, "");
              fileToSend = new File([words], `${cleanBaseName}_sliced.txt`, { type: "text/plain" });
              showToast(
                `⚡ Đã cắt tệp text xuống ${(fileToSend.size / 1024).toFixed(1)} KB để tải lên máy chủ.`,
                "info"
              );
            } else {
              throw new Error(
                `Tệp "${selectedFile.name}" có dung lượng ${(selectedFile.size / (1024 * 1024)).toFixed(1)}MB, vượt quá giới hạn tải lên máy chủ 5MB. Vui lòng chuyển sang định dạng PDF để chọn trang hoặc dán văn bản trực tiếp.`
              );
            }
          }

          showToast(
            `AI đang phân tích tệp "${fileToSend.name}" (${(fileToSend.size / 1024).toFixed(1)} KB - ${currentLangObj.label})...`,
            "info"
          );
          result = await aiExtractVocabFromFile(
            fileToSend,
            token,
            null,
            null,
            selectedLang,
            "vi"
          );
        }
      } else {
        showToast(
          `AI đang trích xuất thuật ngữ & từ vựng (${currentLangObj.label} → Tiếng Việt)...`,
          "info"
        );
        result = await aiExtractVocabFromText(inputText.trim(), selectedLang, "vi", "auto", token);
      }

      const items = result.items || [];
      if (items.length === 0) {
        showToast("AI không tìm thấy từ vựng hoặc thuật ngữ nào trong nội dung này.", "warning");
      } else {
        setExtractedItems(items);
        setSelectedIndices(new Set(items.map((_, i) => i)));
        showToast(`AI đã bóc tách thành công ${items.length} từ vựng (${currentLangObj.label})!`, "success");
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
    const selectedList = extractedItems
      .filter((_, idx) => selectedIndices.has(idx))
      .filter((item) => item.word && item.word.trim());

    if (selectedList.length === 0) {
      showToast("Vui lòng chọn ít nhất một từ vựng hợp lệ để lưu vào Sổ từ", "warning");
      return;
    }

    setIsSaving(true);
    try {
      const res = await batchImportVocab(selectedList, token);
      const added = res.added_count || 0;
      const updated = res.updated_count || 0;
      showToast(
        `Đã lưu thành công ${added} từ mới${updated > 0 ? ` (cập nhật ${updated} từ đã có)` : ""} vào Sổ từ!`,
        "success"
      );

      if (refreshStreak) refreshStreak();
      if (refreshSavedVocab) refreshSavedVocab();
      if (onSuccess) onSuccess({ added, updated });
      onClose();
    } catch (err) {
      console.error("Batch save failed:", err);
      showToast(err.message || "Không thể lưu danh sách từ vựng", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const activeSamples = SAMPLES_BY_LANG[selectedLang] || SAMPLES_BY_LANG.en;
  const currentPlaceholder = PLACEHOLDERS[selectedLang] || PLACEHOLDERS.en;

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
              {/* Controls Bar: Tabs + 6 Languages Selector */}
              <div className="ai-import-controls-bar">
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

                {/* 6 Languages Selector */}
                <div className="ai-lang-selector-group">
                  <span className="ai-lang-label">
                    <Globe size={14} /> Ngôn ngữ:
                  </span>
                  <div className="ai-lang-pills">
                    {EXTRACT_LANGUAGES.map((lang) => (
                      <button
                        key={lang.id}
                        type="button"
                        className={`ai-lang-pill-btn ${selectedLang === lang.id ? "active" : ""}`}
                        onClick={() => setSelectedLang(lang.id)}
                        title={`${lang.label} (${lang.native})`}
                      >
                        <span className="ai-lang-flag">{lang.flag}</span>
                        <span className="ai-lang-name">{lang.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tab 1: Paste Text */}
              {activeTab === "paste" && (
                <div className="ai-paste-wrapper">
                  <div className="ai-quick-samples-bar">
                    <span style={{ fontSize: "0.82rem", color: "var(--text-muted, #64748b)" }}>
                      Dán văn bản <strong>{EXTRACT_LANGUAGES.find((l) => l.id === selectedLang)?.label}</strong> (tối đa 5.000 từ):
                    </span>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {activeSamples.map((sample, sIdx) => (
                        <button
                          key={sIdx}
                          className="ai-sample-btn"
                          onClick={() => setInputText(sample.text)}
                          title={`Dán mẫu: ${sample.label}`}
                        >
                          {sample.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    className="ai-textarea"
                    placeholder={currentPlaceholder}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    rows={6}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.8rem" }}>
                    <span style={{ color: "var(--text-muted, #94a3b8)" }}>
                      AI sẽ tự động nhận diện từ vựng đắt giá, collocations, phiên âm & dịch nghĩa tiếng Việt chuẩn xác.
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
                          Kích thước: {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB ({(selectedFile.size / 1024).toFixed(0)} KB)
                          {totalPages ? ` • Đã nhận diện: ${totalPages} trang` : ""}
                        </div>
                        {selectedFile.size > MAX_BE_FILE_SIZE ? (
                          <div className="ai-large-file-badge">
                            ⚡ Tệp lớn &gt;5MB: Trình duyệt sẽ đọc & trích xuất văn bản trực tiếp trên máy (hỗ trợ tệp đến 500MB) để không làm nặng máy chủ.
                          </div>
                        ) : (
                          <div className="ai-normal-file-badge">
                            ✓ Kích thước phù hợp (dưới 5MB)
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                          Kéo thả tệp PDF, Word (.docx) hoặc Text vào đây (Hỗ trợ tệp lớn đến 500MB)
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted, #64748b)", marginTop: "4px" }}>
                          Hỗ trợ định dạng: .pdf, .docx, .txt, .md, .csv (Sách, giáo trình, đề thi, báo cáo mọi dung lượng)
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
                        ⚡ <strong>Tiết kiệm Token & Băng thông tối đa:</strong> Trình duyệt sẽ tự động cắt <em>đúng từ trang {startPage} đến trang {endPage}</em> và chỉ gửi phần chữ này lên AI. Tệp PDF dù nặng đến 500MB vẫn xử lý siêu tốc!
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Trigger */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                  Ngôn ngữ đang chọn: <strong>{EXTRACT_LANGUAGES.find((l) => l.id === selectedLang)?.flag} {EXTRACT_LANGUAGES.find((l) => l.id === selectedLang)?.label}</strong> (Dịch sang Tiếng Việt)
                </div>
                <button
                  className="ai-btn-analyze"
                  onClick={handleRunAnalysis}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 size={18} className="spin" />
                      <span>AI đang bóc tách từ vựng...</span>
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
                        {selectedIndices.size === extractedItems.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                      </button>
                      <span style={{ fontSize: "0.85rem", color: "var(--text-muted, #64748b)" }}>
                        Đã chọn: <strong>{selectedIndices.size}</strong> / {extractedItems.length} từ
                      </span>
                    </div>

                    <button
                      className="btn btn-secondary"
                      onClick={addNewBlankRow}
                      style={{ padding: "5px 12px", fontSize: "0.8rem", borderRadius: "8px", gap: "4px" }}
                    >
                      <Plus size={14} /> Thêm từ mới
                    </button>
                  </div>

                  <div className="ai-table-container">
                    <table className="ai-vocab-table">
                      <thead>
                        <tr>
                          <th style={{ width: "40px", textAlign: "center" }}>
                            <button
                              type="button"
                              onClick={toggleSelectAll}
                              style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", padding: 0 }}
                            >
                              {selectedIndices.size === extractedItems.length ? (
                                <CheckSquare size={16} color="#6366f1" />
                              ) : (
                                <Square size={16} color="var(--text-muted)" />
                              )}
                            </button>
                          </th>
                          <th style={{ width: "180px" }}>Thuật ngữ / Từ vựng</th>
                          <th style={{ width: "130px" }}>Phiên âm / Cách đọc</th>
                          <th style={{ width: "100px" }}>Loại từ</th>
                          <th style={{ width: "220px" }}>Nghĩa Tiếng Việt</th>
                          <th>Câu ngữ cảnh</th>
                          <th style={{ width: "40px" }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {extractedItems.map((item, idx) => {
                          const isChecked = selectedIndices.has(idx);
                          return (
                            <tr key={idx} className={isChecked ? "selected-row" : "unselected-row"}>
                              <td style={{ textAlign: "center" }}>
                                <button
                                  type="button"
                                  onClick={() => toggleItem(idx)}
                                  style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", padding: 0 }}
                                >
                                  {isChecked ? (
                                    <CheckSquare size={16} color="#6366f1" />
                                  ) : (
                                    <Square size={16} color="var(--text-muted)" />
                                  )}
                                </button>
                              </td>
                              <td>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                  <input
                                    type="text"
                                    value={item.word}
                                    onChange={(e) => updateItemField(idx, "word", e.target.value)}
                                    className="ai-cell-input bold"
                                    placeholder="Từ / Cụm từ"
                                  />
                                  {item.word && (
                                    <button
                                      type="button"
                                      onClick={() => handleSpeech(item.word)}
                                      className="ai-speech-btn"
                                      title="Phát âm"
                                    >
                                      <Volume2 size={13} />
                                    </button>
                                  )}
                                </div>
                              </td>
                              <td>
                                <input
                                  type="text"
                                  value={item.phonetic || ""}
                                  onChange={(e) => updateItemField(idx, "phonetic", e.target.value)}
                                  className="ai-cell-input italic"
                                  placeholder="Phiên âm"
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  value={item.part_of_speech || ""}
                                  onChange={(e) => updateItemField(idx, "part_of_speech", e.target.value)}
                                  className="ai-cell-input text-center"
                                  placeholder="Loại từ"
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  value={item.meaning || ""}
                                  onChange={(e) => updateItemField(idx, "meaning", e.target.value)}
                                  className="ai-cell-input bold text-success"
                                  placeholder="Nghĩa tiếng Việt"
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  value={item.context_sentence || ""}
                                  onChange={(e) => updateItemField(idx, "context_sentence", e.target.value)}
                                  className="ai-cell-input"
                                  placeholder="Câu ví dụ thực tế..."
                                />
                              </td>
                              <td style={{ textAlign: "center" }}>
                                <button
                                  type="button"
                                  onClick={() => removeItem(idx)}
                                  className="ai-cell-delete-btn"
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

            {/* Footer */}
            <div className="ai-import-footer">
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.82rem", color: "var(--text-muted, #64748b)" }}>
                <span>💡 Từ vựng được lưu sẽ tự động gắn vào Sổ tay, hỗ trợ SRS và 20 dạng bài tập tương tác.</span>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button className="btn btn-secondary" onClick={onClose} disabled={isSaving}>
                  Hủy
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSaveToNotebook}
                  disabled={isSaving || selectedIndices.size === 0}
                  style={{ minWidth: "180px", gap: "6px" }}
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={16} className="spin" />
                      <span>Đang lưu từ vựng...</span>
                    </>
                  ) : (
                    <>
                      <Check size={16} />
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
