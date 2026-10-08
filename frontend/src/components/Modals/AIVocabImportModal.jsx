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
  Minus,
  Loader2,
  Lock,
  Volume2,
  AlertCircle,
  FileSpreadsheet,
  ArrowRight,
  SlidersHorizontal,
  Layers,
  Globe,
  GraduationCap,
  Scissors,
  Download,
  Eye,
  RotateCcw,
  FileCheck,
  Lightbulb,
  Zap,
} from "../Icons";
import { useAuth } from "../../context/AuthContext";
import {
  aiExtractVocabFromText,
  aiExtractVocabFromFile,
  extractTextFromFile,
  batchImportVocab,
  checkVocabDuplicates,
} from "../../services/authVocabService";
import { getPdfPageCount, extractPdfTextClient, slicePdfClient } from "../../utils/pdfExtractor";
import { getVoiceLang } from "../../utils/languageVoices";
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

// Vocabulary Filtering Levels
export const VOCAB_LEVELS = [
  {
    id: "intermediate",
    label: "Trung cấp (B1 – C2)",
    badge: "Khuyên dùng",
    desc: "Tự động lọc bỏ các từ vựng quá dễ (say, note, tell, good, bad...)",
  },
  {
    id: "advanced",
    label: "Nâng cao & Học thuật (B2 – C2)",
    badge: "IELTS 6.5+",
    desc: "Chỉ chọn lọc từ vựng học thuật, collocations hay, idioms",
  },
  {
    id: "expert",
    label: "Chuyên sâu (C1 – C2)",
    badge: "IELTS 8.0+",
    desc: "Thuật ngữ chuyên ngành tinh tế, lối diễn đạt cao cấp",
  },
  {
    id: "all",
    label: "Tất cả (A1 – C2)",
    badge: "Mọi cấp độ",
    desc: "Lấy đầy đủ từ vựng từ cơ bản đến nâng cao",
  },
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
  const [vocabLevel, setVocabLevel] = useState("intermediate"); // "intermediate" | "advanced" | "expert" | "all"
  const [inputText, setInputText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [extractedItems, setExtractedItems] = useState([]);
  const [selectedIndices, setSelectedIndices] = useState(new Set());
  const [dragOver, setDragOver] = useState(false);

  // Duplicate Conflict Resolution State
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [duplicateList, setDuplicateList] = useState([]);
  const [pendingItems, setPendingItems] = useState([]);
  const [conflictStrategy, setConflictStrategy] = useState("skip_existing"); // "skip_existing" | "overwrite" | "keep_both"
  const [isCheckingDuplicates, setIsCheckingDuplicates] = useState(false);

  // Selective Page Range State (for PDF & documents)
  const [totalPages, setTotalPages] = useState(null);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);
  const [startPageInput, setStartPageInput] = useState("1");
  const [endPageInput, setEndPageInput] = useState("1");
  const [usePageRange, setUsePageRange] = useState(true);
  const [isReadingPdf, setIsReadingPdf] = useState(false);

  // Sliced File State (Cut PDF file review before AI call)
  const [slicedFile, setSlicedFile] = useState(null);
  const [slicedFileUrl, setSlicedFileUrl] = useState(null);
  const [isSlicing, setIsSlicing] = useState(false);
  const [isSliced, setIsSliced] = useState(false);
  const [slicedFileInfo, setSlicedFileInfo] = useState(null);

  const updateRange = (s, e, total = totalPages) => {
    let sNum = Math.max(1, parseInt(s, 10) || 1);
    let eNum = Math.max(sNum, parseInt(e, 10) || sNum);
    if (total) {
      sNum = Math.min(sNum, total);
      eNum = Math.min(Math.max(sNum, eNum), total);
    }
    setStartPage(sNum);
    setEndPage(eNum);
    setStartPageInput(String(sNum));
    setEndPageInput(String(eNum));
    setIsSliced(false);
  };

  const handleStartChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "");
    setStartPageInput(raw);
    if (raw !== "") {
      const num = parseInt(raw, 10);
      if (num >= 1) {
        setStartPage(num);
        if (num > endPage) {
          setEndPage(num);
          setEndPageInput(String(num));
        }
      }
    }
  };

  const handleStartBlur = () => {
    let num = parseInt(startPageInput, 10);
    if (!num || num < 1) num = 1;
    if (totalPages && num > totalPages) num = totalPages;
    setStartPage(num);
    setStartPageInput(String(num));
    if (num > endPage) {
      setEndPage(num);
      setEndPageInput(String(num));
    }
  };

  const handleEndChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "");
    setEndPageInput(raw);
    if (raw !== "") {
      const num = parseInt(raw, 10);
      if (num >= 1) {
        setEndPage(num);
      }
    }
  };

  const handleEndBlur = () => {
    let num = parseInt(endPageInput, 10);
    if (!num || num < 1) num = startPage;
    if (totalPages && num > totalPages) num = totalPages;
    if (num < startPage) num = startPage;
    setEndPage(num);
    setEndPageInput(String(num));
  };

  const stepStart = (delta) => {
    const next = Math.max(1, startPage + delta);
    const clamped = totalPages ? Math.min(next, totalPages) : next;
    const newEnd = Math.max(clamped, endPage);
    updateRange(clamped, newEnd);
  };

  const stepEnd = (delta) => {
    const next = Math.max(startPage, endPage + delta);
    const clamped = totalPages ? Math.min(next, totalPages) : next;
    updateRange(startPage, clamped);
  };

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

  const handleSpeech = (text, itemLang = null) => {
    if (!text || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = getVoiceLang(itemLang || selectedLang, text);
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

    if (slicedFileUrl) {
      URL.revokeObjectURL(slicedFileUrl);
      setSlicedFileUrl(null);
    }
    setSlicedFile(null);
    setIsSliced(false);
    setSlicedFileInfo(null);

    setSelectedFile(file);
    setTotalPages(null);
    updateRange(1, 1, null);

    const isPdf = file.name.toLowerCase().endsWith(".pdf");
    if (isPdf) {
      setIsReadingPdf(true);
      try {
        const count = await getPdfPageCount(file);
        if (count && count > 0) {
          setTotalPages(count);
          updateRange(1, Math.min(count, 5), count);
        } else {
          updateRange(1, 1, null);
        }
      } catch (err) {
        console.warn("Could not read pdf pages:", err);
        updateRange(1, 1, null);
      } finally {
        setIsReadingPdf(false);
      }
    } else {
      updateRange(1, 1, null);
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

  const handleSliceFile = async () => {
    if (!selectedFile) {
      showToast("Vui lòng chọn tệp tài liệu trước khi cắt", "warning");
      return;
    }

    setIsSlicing(true);
    try {
      const isPdf = selectedFile.name.toLowerCase().endsWith(".pdf");
      if (isPdf) {
        const s = Math.max(1, parseInt(startPageInput, 10) || startPage || 1);
        const e = Math.max(s, parseInt(endPageInput, 10) || endPage || s);

        showToast(`Đang cắt trang ${s} → ${e} của tệp "${selectedFile.name}"...`, "info");
        const cutFile = await slicePdfClient(selectedFile, s, e);

        if (slicedFileUrl) {
          URL.revokeObjectURL(slicedFileUrl);
        }
        const url = URL.createObjectURL(cutFile);

        setSlicedFile(cutFile);
        setSlicedFileUrl(url);
        setIsSliced(true);
        setSlicedFileInfo({
          name: cutFile.name,
          size: cutFile.size,
          startPage: s,
          endPage: e,
          pageCount: e - s + 1,
          isPdf: true,
        });

        showToast(
          `Đã cắt xong tệp "${cutFile.name}" (${(cutFile.size / 1024).toFixed(1)} KB)! Hãy kiểm tra file cắt bên dưới.`,
          "success"
        );
      } else {
        // Tệp không phải PDF (ảnh, text, word)
        if (slicedFileUrl) {
          URL.revokeObjectURL(slicedFileUrl);
        }
        const url = URL.createObjectURL(selectedFile);
        setSlicedFile(selectedFile);
        setSlicedFileUrl(url);
        setIsSliced(true);
        setSlicedFileInfo({
          name: selectedFile.name,
          size: selectedFile.size,
          isPdf: false,
        });
        showToast(`Tệp "${selectedFile.name}" đã sẵn sàng!`, "success");
      }
    } catch (err) {
      console.error("Lỗi khi cắt tệp:", err);
      showToast(err.message || "Không thể cắt tệp", "error");
    } finally {
      setIsSlicing(false);
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

    const isPdf = selectedFile?.name?.toLowerCase().endsWith(".pdf");
    if (activeTab === "file" && isPdf && !isSliced) {
      showToast("Đang cắt tệp theo khoảng trang đã chọn để bạn kiểm tra file cắt trước...", "info");
      await handleSliceFile();
      return;
    }

    setIsAnalyzing(true);
    setExtractedItems([]);
    setSelectedIndices(new Set());

    const currentLangObj = EXTRACT_LANGUAGES.find((l) => l.id === selectedLang) || EXTRACT_LANGUAGES[0];

    try {
      let result;
      if (activeTab === "file") {
        const fileToSend = slicedFile || selectedFile;
        const isPdfFile = fileToSend.name.toLowerCase().endsWith(".pdf");

        if (isPdfFile) {
          // 1. Thử đọc chữ trực tiếp trên client từ tệp đã cắt
          let clientResult = null;
          try {
            clientResult = await extractPdfTextClient(fileToSend, 1, slicedFileInfo?.pageCount || 5);
          } catch (cErr) {
            console.warn("Client read sliced pdf:", cErr);
          }

          if (clientResult && clientResult.text && clientResult.text.trim().length >= 10) {
            showToast(
              `Đã đọc ${clientResult.selectedPagesCount} trang (${clientResult.wordCount} chữ) từ file cắt. AI đang bóc tách...`,
              "info"
            );
            result = await aiExtractVocabFromText(
              clientResult.text.trim(),
              selectedLang,
              "vi",
              "auto",
              token,
              vocabLevel
            );
          } else {
            // 2. Nếu là PDF scan dạng ảnh: gửi file đã cắt lên BE Gemini Vision OCR
            showToast(
              `Đang gửi tệp cắt "${fileToSend.name}" (${(fileToSend.size / 1024).toFixed(0)} KB) lên Gemini Vision OCR...`,
              "info"
            );
            result = await aiExtractVocabFromFile(
              fileToSend,
              token,
              null,
              null,
              selectedLang,
              "vi",
              vocabLevel
            );
          }
        } else {
          // Xử lý tệp không phải PDF (ảnh, docx, txt)
          const isImage = /\.(png|jpg|jpeg|webp)$/i.test(fileToSend.name);
          if (isImage) {
            showToast(
              `Đang gửi ảnh "${fileToSend.name}" lên Gemini Vision OCR để đọc chữ & bóc tách từ vựng...`,
              "info"
            );
          } else {
            showToast(
              `AI đang phân tích tệp "${fileToSend.name}" (${(fileToSend.size / 1024).toFixed(0)} KB)...`,
              "info"
            );
          }

          result = await aiExtractVocabFromFile(
            fileToSend,
            token,
            null,
            null,
            selectedLang,
            "vi",
            vocabLevel
          );
        }
      } else {
        showToast(
          `AI đang trích xuất thuật ngữ & từ vựng (${currentLangObj.label} → Tiếng Việt)...`,
          "info"
        );
        result = await aiExtractVocabFromText(
          inputText.trim(),
          selectedLang,
          "vi",
          "auto",
          token,
          vocabLevel
        );
      }

      const items = (result.items || []).map((it) => ({
        ...it,
        source_lang: it.source_lang || selectedLang || "en",
      }));
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
        source_lang: selectedLang || "en",
      },
    ]);
    setSelectedIndices((prev) => new Set([...prev, extractedItems.length]));
  };

  const handleSaveToNotebook = async () => {
    const selectedList = extractedItems
      .filter((_, idx) => selectedIndices.has(idx))
      .filter((item) => item.word && item.word.trim())
      .map((item) => ({
        ...item,
        source_lang: item.source_lang || selectedLang || "en",
      }));

    if (selectedList.length === 0) {
      showToast("Vui lòng chọn ít nhất một từ vựng hợp lệ để lưu vào Sổ từ", "warning");
      return;
    }

    setIsCheckingDuplicates(true);
    setIsSaving(true);
    try {
      // 1. Kiểm tra xem các từ đã có trong Sổ từ của tài khoản hay chưa
      const wordsToCheck = selectedList.map((it) => it.word.trim());
      const checkRes = await checkVocabDuplicates(wordsToCheck, token);

      if (checkRes && checkRes.has_duplicates && checkRes.duplicates && checkRes.duplicates.length > 0) {
        // Có từ trùng lặp! Bật Modal lựa chọn 3 hướng giải quyết cho người dùng
        const dupMap = new Map(checkRes.duplicates.map((d) => [d.word.toLowerCase().trim(), d]));
        const mergedConflicts = selectedList
          .filter((it) => dupMap.has(it.word.toLowerCase().trim()))
          .map((it) => {
            const existing = dupMap.get(it.word.toLowerCase().trim());
            return {
              word: it.word,
              existingMeaning: existing.meaning,
              existingPhonetic: existing.phonetic,
              newMeaning: it.meaning,
              newPhonetic: it.phonetic,
            };
          });

        setDuplicateList(mergedConflicts);
        setPendingItems(selectedList);
        setConflictStrategy("skip_existing"); // mặc định phương án an toàn nhất
        setShowConflictModal(true);
        setIsSaving(false);
        return;
      }

      // Không có từ nào trùng: Lưu trực tiếp
      await executeSaveToNotebook(selectedList, "skip_existing");
    } catch (err) {
      console.warn("Check duplicates error, fallback saving directly:", err);
      await executeSaveToNotebook(selectedList, "skip_existing");
    } finally {
      setIsCheckingDuplicates(false);
    }
  };

  const executeSaveToNotebook = async (listToSave, strategy = "skip_existing") => {
    setIsSaving(true);
    try {
      const res = await batchImportVocab(listToSave, token, strategy);
      const added = res.added_count || 0;
      const updated = res.updated_count || 0;
      const skipped = res.skipped_count || 0;

      let msgParts = [];
      if (added > 0) msgParts.push(`thêm ${added} từ mới`);
      if (updated > 0) msgParts.push(`cập nhật ${updated} từ`);
      if (skipped > 0) msgParts.push(`giữ nguyên ${skipped} từ cũ`);

      const summaryText = msgParts.length > 0 ? msgParts.join(", ") : `${listToSave.length} từ`;
      showToast(`Đã lưu thành công (${summaryText}) vào Sổ từ!`, "success");

      if (refreshStreak) refreshStreak();
      if (refreshSavedVocab) refreshSavedVocab();
      if (onSuccess) onSuccess({ added, updated, skipped });

      setShowConflictModal(false);
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

              {/* Level Selector Bar */}
              <div className="ai-level-selector-bar">
                <div className="ai-level-label-group">
                  <GraduationCap size={15} className="text-primary" />
                  <span className="ai-level-title">Cấp độ từ vựng cần lọc:</span>
                </div>
                <div className="ai-level-pills">
                  {VOCAB_LEVELS.map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      className={`ai-level-pill-btn ${vocabLevel === lvl.id ? "active" : ""}`}
                      onClick={() => setVocabLevel(lvl.id)}
                      title={lvl.desc}
                    >
                      <span className="ai-level-name">{lvl.label}</span>
                      {lvl.badge && <span className="ai-level-badge">{lvl.badge}</span>}
                    </button>
                  ))}
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
                    accept=".pdf,.docx,.txt,.md,.csv,.png,.jpg,.jpeg,.webp"
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
                          {/\.(png|jpg|jpeg|webp)$/i.test(selectedFile.name) ? " • Định dạng hình ảnh (Gemini Vision OCR)" : ""}
                        </div>
                        {selectedFile.size > MAX_BE_FILE_SIZE ? (
                          <div className="ai-large-file-badge">
                            <Zap size={14} style={{ verticalAlign: "middle", marginRight: 5, flexShrink: 0 }} />
                            <span>Tệp lớn &gt;5MB: Trình duyệt sẽ đọc &amp; trích xuất văn bản trực tiếp trên máy (hỗ trợ tệp đến 500MB) để không làm nặng máy chủ.</span>
                          </div>
                        ) : (
                          <div className="ai-normal-file-badge">
                            <Check size={14} style={{ verticalAlign: "middle", marginRight: 5, flexShrink: 0 }} />
                            <span>Kích thước phù hợp (dưới 5MB)</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                          Kéo thả tệp PDF, Word (.docx), Text hoặc Ảnh chụp/scan vào đây (Hỗ trợ tệp đến 500MB)
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted, #64748b)", marginTop: "4px" }}>
                          Hỗ trợ định dạng: .pdf (kể cả scan), .docx, .txt, .md, .csv & hình ảnh/scan (.png, .jpg, .webp). Mọi tệp đều được AI tự động nhận diện!
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Selective Page Range Box (Frontend cuts pages before sending to AI to save tokens) */}
                  {selectedFile && selectedFile.name.toLowerCase().endsWith(".pdf") && (
                    <div className="ai-page-range-card">
                      <div className="ai-page-range-header">
                        <div className="ai-page-range-title">
                          <SlidersHorizontal size={16} className="text-primary" />
                          <span>Chọn trang cần bóc tách từ vựng:</span>
                        </div>
                        <div className="ai-page-range-badge">
                          {isReadingPdf ? (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                              <Loader2 size={12} className="spin" /> Đang kiểm tra số trang...
                            </span>
                          ) : totalPages ? (
                            <span>
                              {totalPages === 1
                                ? "Tệp có 1 trang duy nhất"
                                : `Tài liệu có ${totalPages} trang`}
                            </span>
                          ) : (
                            <span>Tùy chỉnh số trang</span>
                          )}
                        </div>
                      </div>

                      <div className="ai-page-range-inputs">
                        {/* Từ trang Stepper */}
                        <div className="ai-page-field">
                          <label className="ai-page-label">Từ trang:</label>
                          <div className="ai-page-stepper-box">
                            <button
                              type="button"
                              className="ai-stepper-btn"
                              onClick={() => stepStart(-1)}
                              disabled={startPage <= 1}
                              title="Giảm 1 trang"
                            >
                              <Minus size={13} />
                            </button>
                            <input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              value={startPageInput}
                              onChange={handleStartChange}
                              onBlur={handleStartBlur}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleStartBlur();
                                if (e.key === "ArrowUp") { e.preventDefault(); stepStart(1); }
                                if (e.key === "ArrowDown") { e.preventDefault(); stepStart(-1); }
                              }}
                              className="ai-page-number-input"
                              placeholder="1"
                            />
                            <button
                              type="button"
                              className="ai-stepper-btn"
                              onClick={() => stepStart(1)}
                              disabled={Boolean(totalPages && startPage >= totalPages)}
                              title="Tăng 1 trang"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                        </div>

                        <span className="ai-page-arrow">➔</span>

                        {/* Đến trang Stepper */}
                        <div className="ai-page-field">
                          <label className="ai-page-label">Đến trang:</label>
                          <div className="ai-page-stepper-box">
                            <button
                              type="button"
                              className="ai-stepper-btn"
                              onClick={() => stepEnd(-1)}
                              disabled={endPage <= startPage}
                              title="Giảm 1 trang"
                            >
                              <Minus size={13} />
                            </button>
                            <input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              value={endPageInput}
                              onChange={handleEndChange}
                              onBlur={handleEndBlur}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleEndBlur();
                                if (e.key === "ArrowUp") { e.preventDefault(); stepEnd(1); }
                                if (e.key === "ArrowDown") { e.preventDefault(); stepEnd(-1); }
                              }}
                              className="ai-page-number-input"
                              placeholder={String(startPage)}
                            />
                            <button
                              type="button"
                              className="ai-stepper-btn"
                              onClick={() => stepEnd(1)}
                              disabled={Boolean(totalPages && endPage >= totalPages)}
                              title="Tăng 1 trang"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                        </div>

                        {/* Quick Presets */}
                        <div className="ai-page-presets">
                          <button
                            type="button"
                            className={`ai-preset-chip ${startPage === 1 && endPage === 1 ? "active" : ""}`}
                            onClick={() => updateRange(1, 1)}
                            title="Chỉ chọn trang 1"
                          >
                            Trang 1
                          </button>

                          {(!totalPages || totalPages >= 3) && (
                            <button
                              type="button"
                              className={`ai-preset-chip ${startPage === 1 && endPage === 3 ? "active" : ""}`}
                              onClick={() => updateRange(1, 3)}
                              title="Chọn 3 trang đầu"
                            >
                              1 – 3
                            </button>
                          )}

                          {(!totalPages || totalPages >= 5) && (
                            <button
                              type="button"
                              className={`ai-preset-chip ${startPage === 1 && endPage === 5 ? "active" : ""}`}
                              onClick={() => updateRange(1, 5)}
                              title="Chọn 5 trang đầu"
                            >
                              1 – 5
                            </button>
                          )}

                          {(!totalPages || totalPages >= 10) && (
                            <button
                              type="button"
                              className={`ai-preset-chip ${startPage === 1 && endPage === 10 ? "active" : ""}`}
                              onClick={() => updateRange(1, 10)}
                              title="Chọn 10 trang đầu"
                            >
                              1 – 10
                            </button>
                          )}

                          {totalPages && totalPages > 1 && (
                            <button
                              type="button"
                              className={`ai-preset-chip ${startPage === 1 && endPage === totalPages ? "active" : ""}`}
                              onClick={() => updateRange(1, totalPages)}
                              title={`Chọn toàn bộ ${totalPages} trang`}
                            >
                              Toàn bộ ({totalPages} trang)
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="ai-page-range-notice">
                        <Zap size={14} style={{ verticalAlign: "middle", marginRight: 5, flexShrink: 0 }} />
                        <strong>Đang chọn {Math.max(1, endPage - startPage + 1)} trang (Trang {startPage} → {endPage}):</strong>{" "}
                        Trình duyệt trích xuất đúng phần nội dung này, tệp PDF lớn tới 500MB xử lý siêu tốc mà không tốn token thừa.
                      </div>
                    </div>
                  )}

                  {/* Step 1: Prompt to Slice / Cut File Before AI Call */}
                  {selectedFile && selectedFile.name.toLowerCase().endsWith(".pdf") && !isSliced && (
                    <div className="ai-file-slice-trigger-card">
                      <div className="ai-file-slice-info">
                        <div className="ai-file-slice-title">
                          <Scissors size={18} style={{ color: "#6366f1" }} />
                          <span>Cắt tệp trang <strong>{startPage} → {endPage}</strong> ({Math.max(1, endPage - startPage + 1)} trang)</span>
                        </div>
                        <div className="ai-file-slice-desc">
                          Hệ thống sẽ cắt riêng {Math.max(1, endPage - startPage + 1)} trang này thành 1 file PDF mới siêu nhẹ. Bạn kiểm tra file đã cắt xong thấy OK mới gửi AI cho chắc chắn!
                        </div>
                      </div>
                      <button
                        type="button"
                        className="ai-btn-slice-trigger"
                        onClick={handleSliceFile}
                        disabled={isSlicing}
                      >
                        {isSlicing ? (
                          <>
                            <Loader2 size={18} className="spin" />
                            <span>Đang cắt tệp...</span>
                          </>
                        ) : (
                          <>
                            <Scissors size={18} />
                            <span>Cắt tệp ngay</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Step 2: Display Sliced / Cut File Preview for User Inspection & Confirmation */}
                  {selectedFile && isSliced && (
                    <div className="ai-sliced-file-card">
                      <div className="ai-sliced-header">
                        <div className="ai-sliced-badge-success">
                          <Check size={14} /> ĐÃ CẮT FILE THÀNH CÔNG
                        </div>
                        <div className="ai-sliced-actions-bar">
                          <a
                            href={slicedFileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ai-btn-file-action preview"
                            title="Mở file đã cắt trong tab mới"
                          >
                            <Eye size={15} /> Xem trước file cắt
                          </a>
                          <a
                            href={slicedFileUrl}
                            download={slicedFileInfo?.name || "sliced_document.pdf"}
                            className="ai-btn-file-action download"
                            title="Tải file cắt về máy"
                          >
                            <Download size={15} /> Tải file cắt về
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              setIsSliced(false);
                              setSlicedFile(null);
                            }}
                            className="ai-btn-file-action reslice"
                            title="Đổi khoảng trang khác"
                          >
                            <RotateCcw size={14} /> Cắt lại trang khác
                          </button>
                        </div>
                      </div>

                      <div className="ai-sliced-meta-box">
                        <div className="ai-sliced-file-icon">
                          <FileCheck size={28} color="#10b981" />
                        </div>
                        <div className="ai-sliced-file-details">
                          <div className="ai-sliced-filename">{slicedFileInfo?.name}</div>
                          <div className="ai-sliced-meta-stats">
                            <span>Kích thước: <strong>{(slicedFileInfo?.size / 1024).toFixed(1)} KB</strong></span>
                            {slicedFileInfo?.isPdf && (
                              <>
                                <span>•</span>
                                <span>Số trang: <strong>{slicedFileInfo?.pageCount} trang (Trang {slicedFileInfo?.startPage} → {slicedFileInfo?.endPage})</strong></span>
                              </>
                            )}
                            <span>•</span>
                            <span className="text-success font-semibold">Đã sẵn sàng gửi AI</span>
                          </div>
                        </div>
                      </div>

                      {/* Khung nhúng xem trước file cắt trực tiếp trong modal */}
                      {slicedFileInfo?.isPdf ? (
                        <div className="ai-sliced-preview-embed">
                          <div className="ai-sliced-preview-header">
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                              <Eye size={14} />
                              <span>Xem trước nội dung file cắt:</span>
                            </span>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                              (Nếu trình duyệt không tải được khung nhúng, bấm "Xem trước file cắt" ở trên để mở tab mới)
                            </span>
                          </div>
                          <iframe
                            src={slicedFileUrl}
                            className="ai-sliced-iframe-viewer"
                            title="Xem trước file đã cắt"
                          />
                        </div>
                      ) : (
                        <div className="ai-image-preview-wrapper">
                          <img src={slicedFileUrl} alt="Xem trước tệp" className="ai-image-preview" />
                        </div>
                      )}

                      <div className="ai-sliced-ready-banner">
                        <span>✅ Bạn đã kiểm tra file cắt thấy OK ➔ Hãy bấm nút <strong>"Bắt đầu AI Phân tích & Tách từ"</strong> bên dưới để AI tiến hành bóc tách!</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Trigger */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <span>Ngôn ngữ: <strong>{EXTRACT_LANGUAGES.find((l) => l.id === selectedLang)?.flag} {EXTRACT_LANGUAGES.find((l) => l.id === selectedLang)?.label}</strong></span>
                  <span>•</span>
                  <span>Cấp độ: <strong style={{ color: "#4f46e5" }}>{VOCAB_LEVELS.find((v) => v.id === vocabLevel)?.label}</strong></span>
                </div>
                <button
                  className="ai-btn-analyze"
                  onClick={handleRunAnalysis}
                  disabled={isAnalyzing || isSlicing}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 size={18} className="spin" />
                      <span>AI đang bóc tách từ vựng...</span>
                    </>
                  ) : isSlicing ? (
                    <>
                      <Loader2 size={18} className="spin" />
                      <span>Đang cắt tệp...</span>
                    </>
                  ) : activeTab === "file" && selectedFile?.name?.toLowerCase().endsWith(".pdf") && !isSliced ? (
                    <>
                      <Scissors size={18} />
                      <span>Cắt tệp trang {startPage} → {endPage} trước</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      <span>
                        {activeTab === "file" && isSliced && slicedFileInfo?.pageCount
                          ? `Bắt đầu AI Phân tích (${slicedFileInfo.pageCount} trang đã cắt)`
                          : "Bắt đầu AI Phân tích & Tách từ"}
                      </span>
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
                                      onClick={() => handleSpeech(item.word, item.source_lang || selectedLang)}
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
                <Lightbulb size={14} style={{ flexShrink: 0 }} />
                <span>Từ vựng được lưu sẽ tự động gắn vào Sổ tay, hỗ trợ SRS và 20 dạng bài tập tương tác.</span>
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

      {/* DUPLICATE CONFLICT RESOLUTION MODAL */}
      {showConflictModal && (
        <div className="ai-conflict-modal-overlay" onClick={() => !isSaving && setShowConflictModal(false)}>
          <div className="ai-conflict-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="ai-conflict-header">
              <div className="ai-conflict-header-left">
                <div className="ai-conflict-badge-icon">
                  <Layers size={20} />
                </div>
                <div>
                  <h3 className="ai-conflict-title">
                    Phát hiện {duplicateList.length} từ đã có trong Sổ từ
                  </h3>
                  <p className="ai-conflict-subtitle">
                    Có <strong>{duplicateList.length}</strong> trong số <strong>{pendingItems.length}</strong> từ bạn chọn đã tồn tại trong Sổ tay từ vựng. Vui lòng chọn cách xử lý:
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="ai-modal-close-btn"
                onClick={() => !isSaving && setShowConflictModal(false)}
                disabled={isSaving}
                aria-label="Đóng"
              >
                <X size={18} />
              </button>
            </div>

            <div className="ai-conflict-body">
              {/* 3 Lựa chọn Card */}
              <div className="ai-conflict-options-list">
                {/* Lựa chọn 1 */}
                <div
                  className={`ai-conflict-card ${conflictStrategy === "skip_existing" ? "selected" : ""}`}
                  onClick={() => setConflictStrategy("skip_existing")}
                >
                  <div className="ai-conflict-radio">
                    <span className={`ai-radio-dot ${conflictStrategy === "skip_existing" ? "active" : ""}`} />
                  </div>
                  <div className="ai-conflict-card-info">
                    <div className="ai-conflict-card-head">
                      <span className="ai-conflict-card-name">1. Giữ từ cũ, bỏ từ vừa mới extract</span>
                      <span className="ai-strategy-badge badge-green">Giữ tiến độ SRS</span>
                    </div>
                    <p className="ai-conflict-card-desc">
                      Bỏ qua {duplicateList.length} từ trùng lặp, giữ nguyên nghĩa cũ và tiến độ học SRS đã có trong sổ từ. Chỉ lưu {Math.max(0, pendingItems.length - duplicateList.length)} từ hoàn toàn mới.
                    </p>
                  </div>
                </div>

                {/* Lựa chọn 2 */}
                <div
                  className={`ai-conflict-card ${conflictStrategy === "overwrite" ? "selected" : ""}`}
                  onClick={() => setConflictStrategy("overwrite")}
                >
                  <div className="ai-conflict-radio">
                    <span className={`ai-radio-dot ${conflictStrategy === "overwrite" ? "active" : ""}`} />
                  </div>
                  <div className="ai-conflict-card-info">
                    <div className="ai-conflict-card-head">
                      <span className="ai-conflict-card-name">2. Bỏ từ cũ, lưu từ vừa extract</span>
                      <span className="ai-strategy-badge badge-blue">Cập nhật nghĩa mới</span>
                    </div>
                    <p className="ai-conflict-card-desc">
                      Ghi đè {duplicateList.length} từ cũ trong Sổ tay bằng nghĩa tiếng Việt, phiên âm và câu ví dụ mới do AI vừa bóc tách.
                    </p>
                  </div>
                </div>

                {/* Lựa chọn 3 */}
                <div
                  className={`ai-conflict-card ${conflictStrategy === "keep_both" ? "selected" : ""}`}
                  onClick={() => setConflictStrategy("keep_both")}
                >
                  <div className="ai-conflict-radio">
                    <span className={`ai-radio-dot ${conflictStrategy === "keep_both" ? "active" : ""}`} />
                  </div>
                  <div className="ai-conflict-card-info">
                    <div className="ai-conflict-card-head">
                      <span className="ai-conflict-card-name">3. Giữ cả 2</span>
                      <span className="ai-strategy-badge badge-purple">Lưu bản ghi song song</span>
                    </div>
                    <p className="ai-conflict-card-desc">
                      Lưu thêm {duplicateList.length} từ vừa bóc tách thành các bản ghi mới độc lập. Sổ tay sẽ có cả bản ghi cũ lẫn mới để bạn đối chiếu nhiều ngữ cảnh.
                    </p>
                  </div>
                </div>
              </div>

              {/* Danh sách các từ trùng lặp */}
              <div className="ai-conflict-preview-box">
                <div className="ai-conflict-preview-title">
                  <span>Chi tiết {duplicateList.length} từ trùng lặp:</span>
                </div>
                <div className="ai-conflict-table-wrapper">
                  <table className="ai-conflict-table">
                    <thead>
                      <tr>
                        <th style={{ width: "26%" }}>Từ vựng</th>
                        <th style={{ width: "37%" }}>Nghĩa cũ trong Sổ tay</th>
                        <th style={{ width: "37%" }}>Nghĩa mới vừa bóc tách</th>
                      </tr>
                    </thead>
                    <tbody>
                      {duplicateList.map((item, idx) => (
                        <tr key={idx}>
                          <td>
                            <strong>{item.word}</strong>
                            {item.newPhonetic && <span className="ai-dup-ipa"> /{item.newPhonetic}/</span>}
                          </td>
                          <td className="ai-dup-old">{item.existingMeaning || "—"}</td>
                          <td className="ai-dup-new">{item.newMeaning || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="ai-conflict-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowConflictModal(false)}
                disabled={isSaving}
              >
                Quay lại kiểm tra
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => executeSaveToNotebook(pendingItems, conflictStrategy)}
                disabled={isSaving}
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
                    <span>Xác nhận &amp; Lưu</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
