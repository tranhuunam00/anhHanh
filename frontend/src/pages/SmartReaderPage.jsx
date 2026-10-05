import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  Newspaper,
  ClipboardPaste,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Trash2,
  Type,
  Maximize2,
  CheckCircle2,
  Bookmark,
  ExternalLink,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Info,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { WordLookupPopover } from "../components/Vocab/WordLookupPopover";
import "../styles/smart-reader.css";

// Sample article for instant 1-click testing
const SAMPLE_ARTICLE = `
<h1>Cold snap triggers heavy rain, temperatures to plunge below 18°C</h1>
<p><strong>The cold air mass reached the northeastern region</strong>, the northern province of Thanh Hóa and parts of the northwest on Monday morning, pushing temperatures at 7am to 21-24 degrees Celsius.</p>

<img src="https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=900&auto=format&fit=crop&q=80" alt="Hanoians wear long-sleeved shirts and raincoats to keep warm during a cold day" />
<p style="font-size:0.88rem; color:#64748b; text-align:center; margin-top:-8px; font-style:italic;">Hanoians wear long-sleeved shirts and raincoats to keep warm during a cold day. — Photo VNA</p>

<h2>Heavy Rain and Temperature Drops</h2>
<p>HÀ NỘI — A strengthening cold air mass is bringing heavy to torrential rain and thunderstorms across the northern and central regions, with temperatures forecast to fall to as low as 14-17 degrees Celsius in high mountainous areas and rainfall of more than 200mm possible in parts of the central region.</p>

<p>The cold air mass reached the northeastern region, the northern province of Thanh Hóa and parts of the northwest on Monday morning, pushing temperatures at 7am to 21-24 degrees Celsius.</p>

<p>The meteorological agency advised local residents to stay alert against potential flash floods, landslides, and high winds during the extreme weather interval.</p>
`;

// Clean & sanitize pasted HTML safely using DOMParser
function sanitizePastedHtml(rawHtml) {
  if (!rawHtml || typeof rawHtml !== "string") return "";
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawHtml, "text/html");

    // Remove unsafe or noisy tags
    const unsafeTags = doc.querySelectorAll("script, style, iframe, object, embed, form, input, button, textarea, meta, link");
    unsafeTags.forEach((el) => el.remove());

    // Handle lazy loaded images from news sites (data-src, data-original, srcset)
    const imgs = doc.querySelectorAll("img");
    imgs.forEach((img) => {
      const realSrc =
        img.getAttribute("data-src") ||
        img.getAttribute("data-original") ||
        img.getAttribute("data-lazy-src") ||
        img.getAttribute("src");
      if (realSrc) {
        img.setAttribute("src", realSrc);
      }
    });

    // Clean inline attributes except safe ones
    const allEls = doc.body.querySelectorAll("*");
    allEls.forEach((el) => {
      Array.from(el.attributes).forEach((attr) => {
        const name = attr.name.toLowerCase();
        if (name.startsWith("on")) {
          el.removeAttribute(attr.name);
        }
      });

      if (el.tagName.toLowerCase() === "a") {
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener noreferrer");
      }
    });

    return doc.body.innerHTML || "";
  } catch (err) {
    console.error("Sanitizing HTML error:", err);
    return rawHtml;
  }
}

// Extract base lemmas / inflection stems for smart matching
function getWordVariants(word) {
  const w = word.toLowerCase().trim();
  const variants = [w];

  if (w.endsWith("ies") && w.length > 4) variants.push(w.slice(0, -3) + "y");
  if (w.endsWith("es") && w.length > 4) variants.push(w.slice(0, -2));
  if (w.endsWith("s") && !w.endsWith("ss") && w.length > 3) variants.push(w.slice(0, -1));
  if (w.endsWith("ed") && w.length > 4) {
    variants.push(w.slice(0, -1));
    variants.push(w.slice(0, -2));
  }
  if (w.endsWith("ing") && w.length > 5) {
    variants.push(w.slice(0, -3));
    variants.push(w.slice(0, -3) + "e");
  }
  if (w.endsWith("ly") && w.length > 4) variants.push(w.slice(0, -2));

  return variants;
}

export function SmartReaderPage({ isActive = true }) {
  const { savedVocabMap, showToast } = useAuth();

  // Mode: "paste" (Màn hình dán bài mới) vs "reading" (Giao diện đọc bài)
  // Mặc định luôn mở màn hình Dán bài mới để người dùng paste vào trước
  const [mode, setMode] = useState("paste");

  // Content state
  const [editorContent, setEditorContent] = useState("");
  const [articleHtml, setArticleHtml] = useState(() => {
    return localStorage.getItem("shotlang_reader_article") || "";
  });

  // Display Customization State
  const [fontSize, setFontSize] = useState(() => Number(localStorage.getItem("shotlang_reader_fontsize")) || 18);
  const [fontFamily, setFontFamily] = useState(() => localStorage.getItem("shotlang_reader_fontfamily") || "sans");
  const [readerTheme, setReaderTheme] = useState(() => localStorage.getItem("shotlang_reader_theme") || "default");

  // Interaction State
  const [activeWordPopover, setActiveWordPopover] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);

  const editorBoxRef = useRef(null);
  const articleContainerRef = useRef(null);

  // Sync editorContent to editorBoxRef when editorContent changes from outside
  useEffect(() => {
    if (editorBoxRef.current && mode === "paste") {
      if (editorBoxRef.current.innerHTML !== editorContent) {
        editorBoxRef.current.innerHTML = editorContent;
      }
    }
  }, [editorContent, mode]);

  // Save changes to localStorage
  useEffect(() => {
    if (articleHtml) {
      localStorage.setItem("shotlang_reader_article", articleHtml);
    } else {
      localStorage.removeItem("shotlang_reader_article");
    }
  }, [articleHtml]);

  useEffect(() => {
    localStorage.setItem("shotlang_reader_fontsize", fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem("shotlang_reader_fontfamily", fontFamily);
  }, [fontFamily]);

  useEffect(() => {
    localStorage.setItem("shotlang_reader_theme", readerTheme);
  }, [readerTheme]);

  // Clean and import new text/HTML into editor
  const handleInsertIntoEditor = useCallback((rawHtmlOrText) => {
    if (!rawHtmlOrText || !rawHtmlOrText.trim()) return;

    let clean = rawHtmlOrText.trim();
    if (!clean.includes("<p>") && !clean.includes("<div>") && !clean.includes("<h")) {
      clean = clean
        .split(/\n\s*\n/)
        .map((p) => `<p>${p.trim().replace(/\n/g, "<br>")}</p>`)
        .join("");
    } else {
      clean = sanitizePastedHtml(clean);
    }

    setEditorContent(clean);
    if (editorBoxRef.current) {
      editorBoxRef.current.innerHTML = clean;
    }
    if (showToast) {
      showToast("Đã dán bài viết! Hãy bấm 'Bắt đầu đọc bài' để đọc.", "success");
    }
  }, [showToast]);

  // Paste Event Handler on the editor box
  const handleEditorPaste = (e) => {
    e.preventDefault();
    const clipboardData = e.clipboardData;
    if (!clipboardData) return;

    const html = clipboardData.getData("text/html");
    const text = clipboardData.getData("text/plain");

    if (html || text) {
      handleInsertIntoEditor(html || text);
    }
  };

  // Input Event inside editor box
  const handleEditorInput = () => {
    if (editorBoxRef.current) {
      const html = editorBoxRef.current.innerHTML || "";
      const text = editorBoxRef.current.innerText || "";
      const hasImg = Boolean(editorBoxRef.current.querySelector("img"));
      if (!text.trim() && !hasImg) {
        setEditorContent("");
      } else {
        setEditorContent(html);
      }
    }
  };

  // Button handler: Paste from Clipboard API
  const handlePasteFromClipboardBtn = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.read) {
        const items = await navigator.clipboard.read();
        for (const item of items) {
          if (item.types.includes("text/html")) {
            const blob = await item.getType("text/html");
            const html = await blob.text();
            handleInsertIntoEditor(html);
            return;
          }
        }
      }
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          handleInsertIntoEditor(text);
          return;
        }
      }
      alert("Hãy bấm chuột vào khung bên dưới và nhấn phím Ctrl + V (hoặc Cmd + V trên Mac) để dán bài báo!");
    } catch {
      alert("Hãy bấm chuột vào khung bên dưới và nhấn phím Ctrl + V (hoặc Cmd + V trên Mac) để dán bài báo!");
    }
  };

  // Start Reading: Switch from paste mode to reading mode
  const handleStartReading = () => {
    const content = (editorBoxRef.current?.innerHTML || editorContent || "").trim();
    if (!content || content === "<br>" || content === "<p></p>") {
      alert("Vui lòng dán nội dung bài báo vào ô trước khi bấm đọc bài!");
      return;
    }

    setArticleHtml(content);
    setMode("reading");
    if (showToast) {
      showToast("Đang mở chế độ đọc và quét từ vựng...", "info");
    }
  };

  // Switch to paste mode to paste a new article
  const handleSwitchToPaste = () => {
    setEditorContent(articleHtml || "");
    setMode("paste");
    if (isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
    }
  };

  // Text-To-Speech Controller
  const handleToggleSpeech = () => {
    if (!window.speechSynthesis) {
      alert("Trình duyệt không hỗ trợ Web Speech Synthesis.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = articleContainerRef.current?.innerText || "";
    if (!textToRead.trim()) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToRead.slice(0, 3000));
    utterance.lang = "en-US";
    utterance.rate = speechRate;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  useEffect(() => {
    if (!isActive && isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
    }
  }, [isActive, isSpeaking]);

  // Compute matched words & stats for Reading Mode
  const { processedHtml, matchedWords, totalWordsCount } = useMemo(() => {
    if (!articleHtml || mode !== "reading") {
      return { processedHtml: "", matchedWords: [], totalWordsCount: 0 };
    }

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(articleHtml, "text/html");
      const matchedSet = new Map();
      let totalWordCount = 0;

      const walker = doc.createTreeWalker(
        doc.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );

      const textNodes = [];
      let currentNode;
      while ((currentNode = walker.nextNode())) {
        if (currentNode.nodeValue.trim().length > 0) {
          textNodes.push(currentNode);
        }
      }

      textNodes.forEach((node) => {
        const text = node.nodeValue;
        const wordsInNode = text.match(/\b[a-zA-Z0-9'’-]+\b/g) || [];
        totalWordCount += wordsInNode.length;

        if (!savedVocabMap || Object.keys(savedVocabMap).length === 0) {
          return;
        }

        const tokens = text.split(/([a-zA-Z0-9'’-]+)/g);
        let hasReplacement = false;
        const fragment = doc.createDocumentFragment();

        let i = 0;
        const len = tokens.length;
        const maxPhrase = 4;

        while (i < len) {
          const t = tokens[i];
          if (!t) {
            i++;
            continue;
          }

          const isWord = /^[a-zA-Z0-9'’-]+$/.test(t);
          if (!isWord) {
            fragment.appendChild(doc.createTextNode(t));
            i++;
            continue;
          }

          // Check multi-word phrase
          let matchedPhrase = null;
          let phraseSkip = 0;

          for (let pLen = maxPhrase; pLen >= 2; pLen--) {
            const sliceTokens = [];
            let wCount = 0;
            for (let j = i; j < len && wCount < pLen; j++) {
              sliceTokens.push(tokens[j]);
              if (/^[a-zA-Z0-9'’-]+$/.test(tokens[j])) wCount++;
            }
            if (wCount === pLen) {
              const phraseStr = sliceTokens.join("").toLowerCase().trim().replace(/['’]/g, "'");
              if (savedVocabMap[phraseStr]) {
                matchedPhrase = savedVocabMap[phraseStr];
                phraseSkip = sliceTokens.length;
                break;
              }
            }
          }

          if (matchedPhrase) {
            hasReplacement = true;
            const span = doc.createElement("mark");
            span.className = `smart-vocab-mark status-${(matchedPhrase.status || "NEW").toLowerCase()}`;
            span.setAttribute("data-word", matchedPhrase.word);
            span.setAttribute("data-status", matchedPhrase.status || "NEW");
            span.textContent = tokens.slice(i, i + phraseSkip).join("");
            
            const star = doc.createElement("span");
            star.className = "smart-vocab-star";
            star.textContent = "⭐";
            span.appendChild(star);

            fragment.appendChild(span);
            matchedSet.set(matchedPhrase.word.toLowerCase(), matchedPhrase);
            i += phraseSkip;
            continue;
          }

          // Check single word & inflections
          const variants = getWordVariants(t);
          let matchItem = null;
          for (const v of variants) {
            if (savedVocabMap[v]) {
              matchItem = savedVocabMap[v];
              break;
            }
          }

          if (matchItem) {
            hasReplacement = true;
            const span = doc.createElement("mark");
            span.className = `smart-vocab-mark status-${(matchItem.status || "NEW").toLowerCase()}`;
            span.setAttribute("data-word", matchItem.word);
            span.setAttribute("data-status", matchItem.status || "NEW");
            span.textContent = t;

            const star = doc.createElement("span");
            star.className = "smart-vocab-star";
            star.textContent = "⭐";
            span.appendChild(star);

            fragment.appendChild(span);
            matchedSet.set(matchItem.word.toLowerCase(), matchItem);
          } else {
            fragment.appendChild(doc.createTextNode(t));
          }
          i++;
        }

        if (hasReplacement && node.parentNode) {
          node.parentNode.replaceChild(fragment, node);
        }
      });

      return {
        processedHtml: doc.body.innerHTML,
        matchedWords: Array.from(matchedSet.values()),
        totalWordsCount: totalWordCount,
      };
    } catch (e) {
      console.error("Error processing reader HTML:", e);
      return { processedHtml: articleHtml, matchedWords: [], totalWordsCount: 0 };
    }
  }, [articleHtml, savedVocabMap, mode]);

  // Click on highlighted mark inside article
  const handleArticleClick = (e) => {
    const markEl = e.target.closest(".smart-vocab-mark");
    if (!markEl) return;

    e.preventDefault();
    e.stopPropagation();

    const word = markEl.getAttribute("data-word") || markEl.textContent.replace("⭐", "").trim();
    const parentSentence = markEl.closest("p, li, h1, h2, h3, h4, blockquote")?.innerText || "";

    setActiveWordPopover({
      word,
      element: markEl,
      contextSentence: parentSentence,
    });
  };

  // Scroll to word from chip
  const handleScrollToWord = (word) => {
    if (!articleContainerRef.current) return;
    const marks = articleContainerRef.current.querySelectorAll(".smart-vocab-mark");
    for (const m of marks) {
      if ((m.getAttribute("data-word") || "").toLowerCase() === word.toLowerCase()) {
        m.scrollIntoView({ behavior: "smooth", block: "center" });
        m.classList.add("reader-tts-active");
        setTimeout(() => m.classList.remove("reader-tts-active"), 2000);
        break;
      }
    }
  };

  const isEditorEmpty = !editorContent || (!editorContent.trim() && !editorContent.includes("<img"));

  return (
    <div className="smart-reader-container">
      {/* ======================================================== */}
      {/* BƯỚC 1: MÀN HÌNH DÁN BÀI VIẾT (PASTE & PREVIEW MODE)     */}
      {/* ======================================================== */}
      {mode === "paste" && (
        <div className="reader-editor-card">
          <div className="reader-editor-header">
            <div>
              <div className="reader-editor-title">
                <Newspaper size={24} style={{ color: "#10b981" }} />
                <span>Dán bài báo / Tài liệu tiếng Anh mới</span>
              </div>
              <p className="reader-editor-desc">
                Nhấp chuột vào ô bên dưới rồi nhấn <strong>Ctrl + V</strong> (hoặc Cmd + V). Hệ thống hỗ trợ dán đầy đủ cả văn bản lẫn hình ảnh từ bất kỳ trang báo nào!
              </p>
            </div>

            <div className="reader-editor-actions-right">
              {articleHtml && (
                <button
                  className="btn btn-secondary btn-with-icon"
                  onClick={() => setMode("reading")}
                  title="Quay lại bài báo đang đọc trước đó"
                >
                  <ArrowRight size={16} />
                  <span>Quay lại bài đang đọc</span>
                </button>
              )}
            </div>
          </div>

          {/* Ô nhập / dán trực tiếp (ContentEditable) */}
          <div
            ref={editorBoxRef}
            className="reader-editor-box"
            contentEditable={true}
            onPaste={handleEditorPaste}
            onInput={handleEditorInput}
            data-empty={isEditorEmpty}
            data-placeholder="👉 Nhấp chuột vào đây và nhấn Ctrl + V để dán bài báo (hỗ trợ cả chữ, tiêu đề và hình ảnh)..."
            suppressContentEditableWarning={true}
          />

          {/* Toolbar bên dưới ô nhập */}
          <div className="reader-editor-actions">
            <div className="reader-editor-actions-left">
              {/* NÚT CHÍNH: BẮT ĐẦU ĐỌC BÀI */}
              <button
                className="btn btn-primary btn-with-icon"
                style={{ padding: "9px 22px", fontSize: "0.95rem", fontWeight: 700 }}
                onClick={handleStartReading}
                disabled={isEditorEmpty}
                title="Chuyển sang chế độ đọc và tự động highlight từ vựng đã lưu"
              >
                <BookOpen size={18} strokeWidth={2.4} />
                <span>Bắt đầu đọc bài ➔</span>
              </button>

              <button
                className="btn btn-secondary btn-with-icon"
                onClick={handlePasteFromClipboardBtn}
                title="Dán nhanh nội dung từ Clipboard"
              >
                <ClipboardPaste size={16} strokeWidth={2} />
                <span>Dán từ Clipboard</span>
              </button>

              <button
                className="btn btn-secondary btn-with-icon"
                onClick={() => handleInsertIntoEditor(SAMPLE_ARTICLE)}
                title="Tải bài báo mẫu thời tiết (Việt Nam News) có ảnh để xem thử"
              >
                <Sparkles size={15} strokeWidth={2} style={{ color: "#f59e0b" }} />
                <span>Thử bài báo mẫu</span>
              </button>
            </div>

            <div className="reader-editor-actions-right">
              {!isEditorEmpty && (
                <button
                  className="btn btn-secondary btn-with-icon"
                  onClick={() => {
                    setEditorContent("");
                    if (editorBoxRef.current) editorBoxRef.current.innerHTML = "";
                  }}
                  style={{ color: "#ef4444" }}
                  title="Xóa toàn bộ nội dung trong ô dán"
                >
                  <Trash2 size={15} />
                  <span>Xóa trắng</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* BƯỚC 2: MÀN HÌNH ĐỌC BÀI VIẾT (READER MODE & HIGHLIGHTS)  */}
      {/* ======================================================== */}
      {mode === "reading" && (
        <>
          {/* Header Card in Reader Mode */}
          <div className="reader-header-card">
            {/* Top row with Back button */}
            <div className="reader-nav-back-row">
              <button
                className="btn btn-secondary btn-with-icon"
                onClick={handleSwitchToPaste}
                title="Dán bài báo khác hoặc bài mới"
              >
                <ArrowLeft size={16} strokeWidth={2.2} />
                <span>Dán bài khác / Bài mới</span>
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className="reader-badge-sparkle">
                  <Sparkles size={13} />
                  Chế độ Đọc & Ôn từ
                </span>

                <button
                  className="btn btn-secondary btn-icon"
                  onClick={() => {
                    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
                      setArticleHtml("");
                      setEditorContent("");
                      setMode("paste");
                      if (isSpeaking) {
                        window.speechSynthesis?.cancel();
                        setIsSpeaking(false);
                      }
                    }
                  }}
                  title="Xóa bài viết này"
                  style={{ color: "#ef4444" }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Stats Ribbon */}
            <div className="reader-stats-ribbon">
              <div className="reader-stats-group">
                <div className="reader-stat-item">
                  <BookOpen size={16} style={{ color: "#0284c7" }} />
                  <span>Tổng số từ: <strong>{totalWordsCount}</strong> từ</span>
                </div>

                <div className="reader-stat-item">
                  <span className="reader-matched-badge">
                    ⭐ <strong>{matchedWords.length} từ đã lưu</strong> xuất hiện trong bài
                  </span>
                </div>
              </div>

              {/* Quick Word Chips */}
              {matchedWords.length > 0 && (
                <div className="reader-chips-bar">
                  {matchedWords.slice(0, 12).map((item, idx) => (
                    <button
                      key={idx}
                      className="reader-word-chip"
                      onClick={() => handleScrollToWord(item.word)}
                      title={`Chạm để cuộn đến từ "${item.word}" trong bài báo`}
                    >
                      <span className={`chip-dot status-${(item.status || "NEW").toLowerCase()}`}></span>
                      <span>{item.word}</span>
                    </button>
                  ))}
                  {matchedWords.length > 12 && (
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", alignSelf: "center" }}>
                      +{matchedWords.length - 12} từ khác
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Toolbar (Font, Theme, TTS) */}
            <div className="reader-toolbar">
              <div className="reader-toolbar-left">
                {/* Text to Speech Control */}
                <button
                  className={`btn btn-secondary btn-with-icon ${isSpeaking ? "btn-primary" : ""}`}
                  onClick={handleToggleSpeech}
                  title={isSpeaking ? "Dừng đọc" : "Đọc toàn bộ bài viết bằng giọng AI"}
                >
                  {isSpeaking ? <Pause size={15} /> : <Play size={15} />}
                  <span>{isSpeaking ? "Tạm dừng đọc" : "Nghe đọc bài"}</span>
                </button>

                {/* Speech Rate Toggle */}
                {isSpeaking && (
                  <div className="reader-control-btn-group">
                    {[0.8, 1.0, 1.25].map((rate) => (
                      <button
                        key={rate}
                        className={`reader-control-btn ${speechRate === rate ? "active" : ""}`}
                        onClick={() => {
                          setSpeechRate(rate);
                          if (isSpeaking) {
                            window.speechSynthesis?.cancel();
                            setIsSpeaking(false);
                            setTimeout(handleToggleSpeech, 100);
                          }
                        }}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="reader-toolbar-right">
                {/* Font Size A- / A+ */}
                <div className="reader-control-btn-group">
                  <button
                    className="reader-control-btn"
                    onClick={() => setFontSize((s) => Math.max(15, s - 1))}
                    title="Giảm kích thước chữ"
                  >
                    A-
                  </button>
                  <span style={{ fontSize: "0.8rem", padding: "0 4px", color: "var(--text-muted)" }}>
                    {fontSize}px
                  </span>
                  <button
                    className="reader-control-btn"
                    onClick={() => setFontSize((s) => Math.min(26, s + 1))}
                    title="Tăng kích thước chữ"
                  >
                    A+
                  </button>
                </div>

                {/* Font Family (Sans vs Serif) */}
                <div className="reader-control-btn-group">
                  <button
                    className={`reader-control-btn ${fontFamily === "sans" ? "active" : ""}`}
                    onClick={() => setFontFamily("sans")}
                    title="Font chữ hiện đại (Sans-serif)"
                  >
                    Sans
                  </button>
                  <button
                    className={`reader-control-btn ${fontFamily === "serif" ? "active" : ""}`}
                    onClick={() => setFontFamily("serif")}
                    title="Font chữ báo chí (Serif)"
                  >
                    Serif
                  </button>
                </div>

                {/* Reader Theme (Default, Sepia, Dark) */}
                <div className="reader-control-btn-group">
                  <button
                    className={`reader-control-btn ${readerTheme === "default" ? "active" : ""}`}
                    onClick={() => setReaderTheme("default")}
                    title="Giao diện mặc định"
                  >
                    Chuẩn
                  </button>
                  <button
                    className={`reader-control-btn ${readerTheme === "sepia" ? "active" : ""}`}
                    onClick={() => setReaderTheme("sepia")}
                    title="Nền giấy vàng ấm (Sepia - Đọc ban đêm không mỏi mắt)"
                  >
                    📜 Giấy
                  </button>
                  <button
                    className={`reader-control-btn ${readerTheme === "dark" ? "active" : ""}`}
                    onClick={() => setReaderTheme("dark")}
                    title="Nền tối OLED"
                  >
                    🌙 Tối
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Article Reading View */}
          <div
            className={`reader-article-card theme-${readerTheme} font-${fontFamily}`}
            style={{ fontSize: `${fontSize}px` }}
          >
            <div
              ref={articleContainerRef}
              className="reader-article-body"
              dangerouslySetInnerHTML={{ __html: processedHtml }}
              onClick={handleArticleClick}
            />
          </div>
        </>
      )}

      {/* Interactive Word Lookup Popover */}
      {activeWordPopover && (
        <WordLookupPopover
          word={activeWordPopover.word}
          targetElement={activeWordPopover.element}
          contextSentence={activeWordPopover.contextSentence}
          onClose={() => setActiveWordPopover(null)}
        />
      )}
    </div>
  );
}
