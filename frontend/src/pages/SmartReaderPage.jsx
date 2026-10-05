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
  Info,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { WordLookupPopover } from "../components/Vocab/WordLookupPopover";
import "../styles/smart-reader.css";

// Sample article for instant 1-click testing
const SAMPLE_ARTICLE = `
<h1>The AI Revolution in Everyday Language Learning</h1>
<p>In recent years, <strong>artificial intelligence</strong> and modern <strong>technology</strong> have completely transformed how students learn foreign languages across the globe. Rather than memorizing endless grammar rules in isolation, learners now have the <strong>potential</strong> to immerse themselves in authentic, real-world context.</p>

<img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&auto=format&fit=crop&q=80" alt="Students studying together with modern technology" />

<h2>Why Contextual Learning Matters</h2>
<p>Cognitive psychologists have repeatedly demonstrated that our memory retention increases dramatically when we encounter new vocabulary within meaningful stories. When you read a <em>fascinating</em> article about science, space exploration, or global culture, your brain naturally connects words with visual imagery and emotions.</p>

<blockquote>"Language is not a genetic gift, it is a social gift. Learning a new language is becoming a member of the club - the community of speakers of that language." — Frank Smith</blockquote>

<p>Moreover, modern digital platforms allow you to <strong>specify</strong> custom practice intervals, track your daily streak, and conquer pronunciation obstacles. The ultimate <strong>opportunity</strong> lies in making language acquisition a joyful, curiosity-driven habit rather than a tedious chore.</p>

<img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&auto=format&fit=crop&q=80" alt="Digital learning on laptop" />

<h2>Actionable Steps for Mastery</h2>
<ul>
  <li>Read at least 10 minutes of authentic news or blog posts every day.</li>
  <li>Save unfamiliar expressions directly to your personal notebook for spaced repetition.</li>
  <li>Listen to native pronunciation and practice shadowing sentences aloud.</li>
</ul>
<p>By combining curiosity with consistent practice, you unlock a <strong>revolutionary</strong> gateway to fluency and endless global opportunities.</p>
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
      // Remove all on* event handlers
      Array.from(el.attributes).forEach((attr) => {
        const name = attr.name.toLowerCase();
        if (name.startsWith("on") || name.startsWith("data-") && !name.startsWith("data-lang")) {
          el.removeAttribute(attr.name);
        }
      });

      // Secure links
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

  // Article State (persisted in localStorage)
  const [articleHtml, setArticleHtml] = useState(() => {
    return localStorage.getItem("shotlang_reader_article") || "";
  });

  // Display Customization State
  const [fontSize, setFontSize] = useState(() => Number(localStorage.getItem("shotlang_reader_fontsize")) || 18);
  const [fontFamily, setFontFamily] = useState(() => localStorage.getItem("shotlang_reader_fontfamily") || "sans");
  const [readerTheme, setReaderTheme] = useState(() => localStorage.getItem("shotlang_reader_theme") || "default");

  // Interaction State
  const [activeWordPopover, setActiveWordPopover] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);

  const articleContainerRef = useRef(null);

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

  // Clean and import new text/HTML
  const handleImportContent = useCallback((rawHtmlOrText) => {
    if (!rawHtmlOrText || !rawHtmlOrText.trim()) return;

    let clean = rawHtmlOrText.trim();
    if (!clean.includes("<p>") && !clean.includes("<div>") && !clean.includes("<h")) {
      // Plain text -> wrap paragraphs
      clean = clean
        .split(/\n\s*\n/)
        .map((p) => `<p>${p.trim().replace(/\n/g, "<br>")}</p>`)
        .join("");
    } else {
      clean = sanitizePastedHtml(clean);
    }

    setArticleHtml(clean);
    if (showToast) {
      showToast("Đã tải bài viết thành công! Bắt đầu quét từ vựng...", "success");
    }
  }, [showToast]);

  // Paste Event Handler (Clipboard)
  const handlePasteEvent = useCallback((e) => {
    if (!isActive) return;
    const activeEl = document.activeElement;
    if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA" || activeEl.isContentEditable)) {
      return;
    }

    const clipboardData = e.clipboardData;
    if (!clipboardData) return;

    const html = clipboardData.getData("text/html");
    const text = clipboardData.getData("text/plain");

    if (html || text) {
      e.preventDefault();
      handleImportContent(html || text);
    }
  }, [isActive, handleImportContent]);

  useEffect(() => {
    window.addEventListener("paste", handlePasteEvent);
    return () => window.removeEventListener("paste", handlePasteEvent);
  }, [handlePasteEvent]);

  // Clipboard button handler
  const handlePasteFromClipboardBtn = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.read) {
        const items = await navigator.clipboard.read();
        for (const item of items) {
          if (item.types.includes("text/html")) {
            const blob = await item.getType("text/html");
            const html = await blob.text();
            handleImportContent(html);
            return;
          }
        }
      }
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          handleImportContent(text);
          return;
        }
      }
      alert("Hãy bấm phím Ctrl + V (hoặc Cmd + V trên Mac) để dán nội dung bài báo vào đây!");
    } catch {
      alert("Hãy bấm phím Ctrl + V (hoặc Cmd + V trên Mac) để dán nội dung bài báo vào đây!");
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

  // Stop speech if tab inactive
  useEffect(() => {
    if (!isActive && isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
    }
  }, [isActive, isSpeaking]);

  // Compute matched words & stats
  const { processedHtml, matchedWords, totalWordsCount } = useMemo(() => {
    if (!articleHtml) {
      return { processedHtml: "", matchedWords: [], totalWordsCount: 0 };
    }

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(articleHtml, "text/html");
      const matchedSet = new Map();
      let totalWordCount = 0;

      // Extract all text nodes in reading elements
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

      // Process each text node and highlight matched words
      textNodes.forEach((node) => {
        const text = node.nodeValue;
        const wordsInNode = text.match(/\b[a-zA-Z0-9'’-]+\b/g) || [];
        totalWordCount += wordsInNode.length;

        if (!savedVocabMap || Object.keys(savedVocabMap).length === 0) {
          return;
        }

        // Tokenize by word boundaries
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
  }, [articleHtml, savedVocabMap]);

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

  return (
    <div className="smart-reader-container">
      {/* Top Header Card */}
      <div className="reader-header-card">
        <div className="reader-header-top">
          <div className="reader-header-titles">
            <h1>
              <Newspaper size={26} strokeWidth={2.4} style={{ color: "#10b981" }} />
              <span>Đọc Báo & Ôn Từ Vựng (Smart Reader)</span>
              <span className="reader-badge-sparkle">
                <Sparkles size={13} />
                Tự động Highlight
              </span>
            </h1>
            <p className="reader-header-desc">
              Dán bất kỳ bài báo hoặc tài liệu tiếng Anh nào (hỗ trợ cả chữ và hình ảnh), hệ thống sẽ tự động quét và highlight các từ vựng bạn đã lưu để ôn tập trong ngữ cảnh thực tế.
            </p>
          </div>

          <div className="reader-header-actions">
            <button
              className="btn btn-primary btn-with-icon"
              onClick={handlePasteFromClipboardBtn}
              title="Dán nội dung từ Clipboard (Ctrl + V)"
            >
              <ClipboardPaste size={16} strokeWidth={2.2} />
              <span>Dán bài viết (Ctrl + V)</span>
            </button>

            <button
              className="btn btn-secondary btn-with-icon"
              onClick={() => handleImportContent(SAMPLE_ARTICLE)}
              title="Tải bài báo mẫu tiếng Anh để xem thử tính năng"
            >
              <Sparkles size={15} strokeWidth={2} style={{ color: "#f59e0b" }} />
              <span>Bài báo mẫu</span>
            </button>

            {articleHtml && (
              <button
                className="btn btn-secondary btn-icon"
                onClick={() => {
                  if (window.confirm("Bạn có chắc chắn muốn xóa bài viết hiện tại để dán bài mới?")) {
                    setArticleHtml("");
                    if (isSpeaking) {
                      window.speechSynthesis?.cancel();
                      setIsSpeaking(false);
                    }
                  }
                }}
                title="Xóa bài viết hiện tại để dán bài mới"
                style={{ color: "#ef4444" }}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Stats Ribbon (if article loaded) */}
        {articleHtml && (
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
                {matchedWords.slice(0, 10).map((item, idx) => (
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
                {matchedWords.length > 10 && (
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", alignSelf: "center" }}>
                    +{matchedWords.length - 10} từ khác
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Toolbar (Font, Theme, TTS) */}
        {articleHtml && (
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
        )}
      </div>

      {/* Main Content Area */}
      {!articleHtml ? (
        /* Empty State Dropzone */
        <div className="reader-paste-dropzone" onClick={handlePasteFromClipboardBtn}>
          <div className="reader-dropzone-icon">
            <ClipboardPaste size={32} strokeWidth={2.2} />
          </div>
          <div className="reader-dropzone-title">Dán bài báo của bạn vào đây (Ctrl + V)</div>
          <p className="reader-dropzone-desc">
            Bạn có thể lên BBC, CNN, Medium, The Verge, Reddit... copy một đoạn bài viết bất kỳ (chọn cả chữ lẫn hình ảnh) rồi dán vào đây. Hệ thống sẽ tự động quét và highlight các từ vựng bạn đã lưu!
          </p>
          <div className="reader-dropzone-buttons" onClick={(e) => e.stopPropagation()}>
            <button className="btn btn-primary btn-with-icon" onClick={handlePasteFromClipboardBtn}>
              <ClipboardPaste size={16} strokeWidth={2} />
              <span>Dán từ Clipboard (Ctrl + V)</span>
            </button>
            <button
              className="btn btn-secondary btn-with-icon"
              onClick={() => handleImportContent(SAMPLE_ARTICLE)}
            >
              <Sparkles size={15} strokeWidth={2} style={{ color: "#f59e0b" }} />
              <span>Thử bài báo mẫu</span>
            </button>
          </div>
        </div>
      ) : (
        /* Article Reading View */
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
