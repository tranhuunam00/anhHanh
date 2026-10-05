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
  SkipBack,
  SkipForward,
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

      if (el.hasAttribute("style")) {
        el.style.removeProperty("font-size");
        el.style.removeProperty("font-family");
        el.style.removeProperty("line-height");
        if (!el.getAttribute("style") || !el.getAttribute("style").trim()) {
          el.removeAttribute("style");
        }
      }

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

// Split text into readable sentence segments protecting abbreviations and decimals
function splitTextIntoSentences(text) {
  if (!text || typeof text !== "string") return [];
  const trimmed = text.trim();
  if (!trimmed) return [];

  // Protect common abbreviations and titles from premature splitting
  const protectedText = trimmed
    .replace(
      /\b(Mr|Mrs|Ms|Dr|Prof|Sr|Jr|Inc|Ltd|Co|Corp|U\.S|U\.K|e\.g|i\.e|vs|etc|No|St|Dept|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\./gi,
      (m) => m.replace(/\./g, "\uE000")
    )
    .replace(/(\d+)\.(\d+)/g, "$1\uE000$2");

  // Split on sentence boundaries: punctuation (. ! ?) followed by whitespace and a start char
  const rawParts = protectedText.split(/(?<=[.?!])\s+(?=[A-Z0-9"“'‘(])/);

  const sentences = [];
  for (const part of rawParts) {
    const restored = part.replace(/\uE000/g, ".").trim();
    if (restored.length > 0) {
      sentences.push(restored);
    }
  }

  return sentences.length > 0 ? sentences : [trimmed];
}

// Format duration seconds to mm:ss
function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// Group leaf block children into identifiable sentence spans
function groupBlockIntoSentences(block, getNextIndex, addSentence, doc) {
  const fullText = block.textContent.trim();
  if (!fullText) return;

  const sentenceStrings = splitTextIntoSentences(fullText);
  if (sentenceStrings.length === 0) return;

  // Single sentence block: wrap all children directly
  if (sentenceStrings.length === 1) {
    const sIdx = getNextIndex();
    const span = doc.createElement("span");
    span.className = "reader-sentence";
    span.setAttribute("data-s-idx", String(sIdx));
    while (block.firstChild) {
      span.appendChild(block.firstChild);
    }
    block.appendChild(span);
    addSentence(sIdx, sentenceStrings[0]);
    return;
  }

  // Multiple sentences: split child nodes into sentence spans
  const originalChildren = Array.from(block.childNodes);
  block.innerHTML = "";

  let sIdx = getNextIndex();
  let currentSpan = doc.createElement("span");
  currentSpan.className = "reader-sentence";
  currentSpan.setAttribute("data-s-idx", String(sIdx));

  let currentSentenceIdx = 0;

  originalChildren.forEach((child) => {
    if (child.nodeType !== Node.TEXT_NODE) {
      currentSpan.appendChild(child);
      return;
    }

    let remainingText = child.nodeValue;
    while (remainingText.length > 0 && currentSentenceIdx < sentenceStrings.length - 1) {
      const match = remainingText.match(/([.?!]+(?:\s+|$))/);
      if (match && match.index !== undefined) {
        const cutIdx = match.index + match[0].length;
        const partBefore = remainingText.slice(0, cutIdx);
        remainingText = remainingText.slice(cutIdx);

        if (partBefore) {
          currentSpan.appendChild(doc.createTextNode(partBefore));
        }

        block.appendChild(currentSpan);
        addSentence(sIdx, sentenceStrings[currentSentenceIdx]);

        currentSentenceIdx++;
        sIdx = getNextIndex();
        currentSpan = doc.createElement("span");
        currentSpan.className = "reader-sentence";
        currentSpan.setAttribute("data-s-idx", String(sIdx));
      } else {
        break;
      }
    }

    if (remainingText.length > 0) {
      currentSpan.appendChild(doc.createTextNode(remainingText));
    }
  });

  if (currentSpan.childNodes.length > 0) {
    block.appendChild(currentSpan);
    addSentence(sIdx, sentenceStrings[currentSentenceIdx] || currentSpan.textContent.trim());
  }
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

  // Interaction & Audio Player State
  const [activeWordPopover, setActiveWordPopover] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [autoScroll, setAutoScroll] = useState(() => localStorage.getItem("shotlang_reader_autoscroll") !== "false");

  const editorBoxRef = useRef(null);
  const articleContainerRef = useRef(null);
  const articleScrollParentRef = useRef(null);
  const sentenceStartRef = useRef(null);

  // Lock body/window scroll completely while in reading mode
  useEffect(() => {
    if (mode === "reading" && isActive) {
      const prevBodyOverflow = document.body.style.overflow;
      const prevHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevBodyOverflow;
        document.documentElement.style.overflow = prevHtmlOverflow;
      };
    }
  }, [mode, isActive]);

  useEffect(() => {
    localStorage.setItem("shotlang_reader_autoscroll", autoScroll);
  }, [autoScroll]);

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
    clearSentenceHighlights();
  };

  // Compute matched words, parsed sentences, and stats for Reading Mode
  const { processedHtml, matchedWords, totalWordsCount, sentencesList } = useMemo(() => {
    if (!articleHtml || mode !== "reading") {
      return { processedHtml: "", matchedWords: [], totalWordsCount: 0, sentencesList: [] };
    }

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(articleHtml, "text/html");
      const matchedSet = new Map();
      let totalWordCount = 0;

      // Clean inline font overrides so user fontSize and fontFamily settings always work
      doc.body.querySelectorAll("*").forEach((el) => {
        if (el.style) {
          el.style.removeProperty("font-size");
          el.style.removeProperty("font-family");
          el.style.removeProperty("line-height");
        }
      });

      // 1. Highlight saved vocabulary tokens on all text nodes first
      const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, null, false);
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

      // 2. Wrap direct text nodes in <p> if needed
      Array.from(doc.body.childNodes).forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim().length > 0) {
          const p = doc.createElement("p");
          p.textContent = node.nodeValue;
          doc.body.replaceChild(p, node);
        }
      });

      // 3. Find leaf blocks and segment them into sentence spans (.reader-sentence)
      const blockSelector = "p, h1, h2, h3, h4, h5, h6, li, blockquote, figcaption, dt, dd, div";
      let leafBlocks = Array.from(doc.body.querySelectorAll(blockSelector)).filter((el) => {
        const hasChildBlock = el.querySelector(blockSelector);
        return !hasChildBlock && el.textContent.trim().length > 0;
      });

      if (leafBlocks.length === 0 && doc.body.textContent.trim().length > 0) {
        const p = doc.createElement("p");
        while (doc.body.firstChild) {
          p.appendChild(doc.body.firstChild);
        }
        doc.body.appendChild(p);
        leafBlocks = [p];
      }

      const rawSentences = [];
      let nextSentenceIndex = 0;
      const getNextIndex = () => nextSentenceIndex++;
      const addSentence = (index, text) => {
        const clean = text.replace(/⭐/g, "").trim();
        if (clean.length > 0) {
          rawSentences.push({ index, text: clean });
        }
      };

      leafBlocks.forEach((block) => {
        groupBlockIntoSentences(block, getNextIndex, addSentence, doc);
      });

      // 4. Enrich sentences with duration, cumulative timestamps
      let cumulative = 0;
      const parsedSentencesList = rawSentences.map((s, idx) => {
        const words = s.text.match(/\b[a-zA-Z0-9'’-]+\b/g) || [];
        const wordCount = words.length;
        const duration = Math.max(1.2, Number(((wordCount / 2.33) + 0.35).toFixed(1)));
        const startTime = cumulative;
        const endTime = Number((cumulative + duration).toFixed(1));
        cumulative = endTime;

        return {
          index: idx,
          text: s.text,
          wordCount,
          duration,
          startTime,
          endTime,
        };
      });

      return {
        processedHtml: doc.body.innerHTML,
        matchedWords: Array.from(matchedSet.values()),
        totalWordsCount: totalWordCount,
        sentencesList: parsedSentencesList,
      };
    } catch (e) {
      console.error("Error processing reader HTML:", e);
      return { processedHtml: articleHtml, matchedWords: [], totalWordsCount: 0, sentencesList: [] };
    }
  }, [articleHtml, savedVocabMap, mode]);

  // Total audio duration at current speechRate
  const totalDuration = useMemo(() => {
    if (!sentencesList || sentencesList.length === 0) return 0;
    const last = sentencesList[sentencesList.length - 1];
    return Number((last.endTime / speechRate).toFixed(1));
  }, [sentencesList, speechRate]);

  // Remove speaking highlight from all sentences
  const clearSentenceHighlights = useCallback(() => {
    if (!articleContainerRef.current) return;
    const activeEls = articleContainerRef.current.querySelectorAll(".reader-sentence.active-speaking");
    activeEls.forEach((el) => el.classList.remove("active-speaking"));
  }, []);

  // Highlight specific sentence in DOM and smoothly scroll container ONLY if autoScroll is enabled
  const highlightSentenceInDOM = useCallback((index) => {
    if (!articleContainerRef.current) return;
    const prevActive = articleContainerRef.current.querySelectorAll(".reader-sentence.active-speaking");
    prevActive.forEach((el) => el.classList.remove("active-speaking"));

    const target = articleContainerRef.current.querySelector(`.reader-sentence[data-s-idx="${index}"]`);
    if (target) {
      target.classList.add("active-speaking");
      if (autoScroll && articleScrollParentRef.current) {
        const container = articleScrollParentRef.current;
        const containerRect = container.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const relativeTop = targetRect.top - containerRect.top + container.scrollTop;
        const targetScrollTop = relativeTop - (container.clientHeight / 2) + (targetRect.height / 2);
        container.scrollTo({
          top: Math.max(0, targetScrollTop),
          behavior: "smooth",
        });
      }
    }
  }, [autoScroll]);

  // Text-To-Speech: Speak sentence at index
  const speakSentence = useCallback(
    (index, autoPlay = true) => {
      if (!window.speechSynthesis) {
        alert("Trình duyệt không hỗ trợ Web Speech Synthesis.");
        return;
      }

      if (!sentencesList || sentencesList.length === 0) return;

      if (index < 0 || index >= sentencesList.length) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setCurrentSentenceIdx(0);
        setElapsedSeconds(0);
        clearSentenceHighlights();
        return;
      }

      window.speechSynthesis.cancel();
      setCurrentSentenceIdx(index);

      const sentence = sentencesList[index];
      const sentenceStartSec = Number((sentence.startTime / speechRate).toFixed(1));
      setElapsedSeconds(sentenceStartSec);

      highlightSentenceInDOM(index);

      if (!autoPlay) {
        setIsSpeaking(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(sentence.text);
      utterance.lang = "en-US";
      utterance.rate = speechRate;

      sentenceStartRef.current = {
        index,
        startTime: Date.now(),
        baseElapsed: sentenceStartSec,
        duration: sentence.duration / speechRate,
      };

      utterance.onend = () => {
        if (index + 1 < sentencesList.length) {
          speakSentence(index + 1, true);
        } else {
          setIsSpeaking(false);
          setCurrentSentenceIdx(0);
          setElapsedSeconds(0);
          clearSentenceHighlights();
          if (showToast) {
            showToast("Đã nghe xong bài viết!", "success");
          }
        }
      };

      utterance.onerror = (e) => {
        if (e.error !== "interrupted" && e.error !== "canceled") {
          console.warn("Speech synthesis error:", e);
          setIsSpeaking(false);
        }
      };

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    },
    [sentencesList, speechRate, clearSentenceHighlights, highlightSentenceInDOM, showToast]
  );

  // Play / Pause Toggle
  const handleToggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const startIdx = currentSentenceIdx >= (sentencesList?.length || 0) ? 0 : currentSentenceIdx;
      speakSentence(startIdx, true);
    }
  };

  // Jump to previous sentence
  const handlePrevSentence = () => {
    const prevIdx = Math.max(0, currentSentenceIdx - 1);
    speakSentence(prevIdx, isSpeaking);
  };

  // Jump to next sentence
  const handleNextSentence = () => {
    const nextIdx = Math.min((sentencesList?.length || 1) - 1, currentSentenceIdx + 1);
    speakSentence(nextIdx, isSpeaking);
  };

  // Restart from beginning
  const handleRestartSpeech = () => {
    speakSentence(0, true);
  };

  // Change speech playback rate
  const handleRateChange = (rate) => {
    setSpeechRate(rate);
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setTimeout(() => {
        speakSentence(currentSentenceIdx, true);
      }, 50);
    }
  };

  // Interactive timeline scrubber
  const handleSeekChange = (e) => {
    const newTime = Number(e.target.value);
    setElapsedSeconds(newTime);

    if (!sentencesList || sentencesList.length === 0) return;

    const baseTime = newTime * speechRate;
    const targetIdx = sentencesList.findIndex((s) => baseTime >= s.startTime && baseTime < s.endTime);
    const finalIdx = targetIdx >= 0 ? targetIdx : (newTime >= totalDuration ? sentencesList.length - 1 : 0);

    if (finalIdx !== currentSentenceIdx) {
      setCurrentSentenceIdx(finalIdx);
      highlightSentenceInDOM(finalIdx);
    }

    if (isSpeaking) {
      speakSentence(finalIdx, true);
    }
  };

  // Smooth seeker progress ticker while speaking
  useEffect(() => {
    if (!isSpeaking) return;

    const timer = setInterval(() => {
      if (sentenceStartRef.current) {
        const { baseElapsed, startTime, duration } = sentenceStartRef.current;
        const elapsedInSentence = (Date.now() - startTime) / 1000;
        const current = Math.min(totalDuration, baseElapsed + Math.min(duration, elapsedInSentence));
        setElapsedSeconds(Number(current.toFixed(1)));
      }
    }, 150);

    return () => clearInterval(timer);
  }, [isSpeaking, totalDuration]);

  // Cleanup on tab switch or unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (!isActive && isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      clearSentenceHighlights();
    }
  }, [isActive, isSpeaking, clearSentenceHighlights]);

  // Click on highlighted mark inside article OR click on sentence to speak
  const handleArticleClick = (e) => {
    // 1. Click on saved vocab word -> open popover
    const markEl = e.target.closest(".smart-vocab-mark");
    if (markEl) {
      e.preventDefault();
      e.stopPropagation();

      const word = markEl.getAttribute("data-word") || markEl.textContent.replace("⭐", "").trim();
      const parentSentence = markEl.closest(".reader-sentence, p, li, h1, h2, h3, h4, blockquote")?.innerText || "";

      setActiveWordPopover({
        word,
        element: markEl,
        contextSentence: parentSentence,
      });
      return;
    }

    // 2. Click on sentence -> jump audio playback to this sentence
    const sentenceEl = e.target.closest(".reader-sentence");
    if (sentenceEl) {
      const sIdxAttr = sentenceEl.getAttribute("data-s-idx");
      if (sIdxAttr !== null) {
        const sIdx = Number(sIdxAttr);
        if (!isNaN(sIdx) && sentencesList && sIdx >= 0 && sIdx < sentencesList.length) {
          speakSentence(sIdx, true);
        }
      }
    }
  };

  // Scroll to word from chip within article reading container
  const handleScrollToWord = (word) => {
    if (!articleContainerRef.current) return;
    const marks = articleContainerRef.current.querySelectorAll(".smart-vocab-mark");
    for (const m of marks) {
      if ((m.getAttribute("data-word") || "").toLowerCase() === word.toLowerCase()) {
        if (articleScrollParentRef.current) {
          const container = articleScrollParentRef.current;
          const containerRect = container.getBoundingClientRect();
          const mRect = m.getBoundingClientRect();
          const relativeTop = mRect.top - containerRect.top + container.scrollTop;
          const targetScrollTop = relativeTop - (container.clientHeight / 2) + (mRect.height / 2);
          container.scrollTo({
            top: Math.max(0, targetScrollTop),
            behavior: "smooth",
          });
        }
        m.classList.add("reader-tts-active");
        setTimeout(() => m.classList.remove("reader-tts-active"), 2000);
        break;
      }
    }
  };

  const isEditorEmpty = !editorContent || (!editorContent.trim() && !editorContent.includes("<img"));

  return (
    <div className={`smart-reader-container ${mode === "reading" ? "reader-split-mode" : ""}`}>
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
      {/* ======================================================== */}
      {/* BƯỚC 2: MÀN HÌNH ĐỌC BÀI VIẾT (CHIA 2 CỘT: TRÁI & PHẢI)  */}
      {/* ======================================================== */}
      {mode === "reading" && (
        <div className="reader-split-layout">
          {/* CỘT TRÁI (STICKY SIDEBAR): BẢNG ĐIỀU KHIỂN & AUDIO PLAYER */}
          <aside className="reader-sidebar-panel">
            {/* Top row: Nút Quay lại & Xóa bài */}
            <div className="reader-sidebar-nav">
              <button
                className="btn btn-secondary btn-with-icon"
                onClick={handleSwitchToPaste}
                title="Dán bài báo khác hoặc bài mới"
              >
                <ArrowLeft size={16} strokeWidth={2.2} />
                <span>Dán bài khác</span>
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span className="reader-badge-sparkle">
                  <Sparkles size={12} />
                  Đọc & Ôn từ
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
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            {/* Trình phát âm thanh & Thanh tua thời gian */}
            <div className="reader-player-section">
              {/* Row 1: Player controls & sentence counter */}
              <div className="reader-player-main-row">
                <div className="reader-player-controls-left">
                  <button
                    className="btn btn-secondary btn-icon"
                    onClick={handlePrevSentence}
                    disabled={currentSentenceIdx <= 0}
                    title="Lùi về câu trước"
                  >
                    <SkipBack size={15} />
                  </button>

                  <button
                    className={`btn ${isSpeaking ? "btn-primary" : "btn-secondary"} btn-with-icon reader-play-btn`}
                    onClick={handleToggleSpeech}
                    title={isSpeaking ? "Tạm dừng đọc" : "Bắt đầu nghe đọc bài viết bằng AI"}
                  >
                    {isSpeaking ? <Pause size={15} /> : <Play size={15} />}
                    <span>{isSpeaking ? "Tạm dừng" : "Nghe đọc"}</span>
                  </button>

                  <button
                    className="btn btn-secondary btn-icon"
                    onClick={handleNextSentence}
                    disabled={currentSentenceIdx >= (sentencesList?.length || 1) - 1}
                    title="Chuyển sang câu tiếp theo"
                  >
                    <SkipForward size={15} />
                  </button>

                  <button
                    className="btn btn-secondary btn-icon"
                    onClick={handleRestartSpeech}
                    title="Đọc lại từ đầu bài viết"
                  >
                    <RotateCcw size={14} />
                  </button>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <button
                    className={`reader-autoscroll-pill ${autoScroll ? "active" : ""}`}
                    onClick={() => setAutoScroll(!autoScroll)}
                    title={autoScroll ? "Đang bật tự cuộn theo giọng đọc (Bấm để giữ im)" : "Đang giữ im màn hình (Bấm để tự cuộn)"}
                  >
                    {autoScroll ? "🔽 Tự cuộn" : "⏸️ Để im"}
                  </button>

                  <span className="reader-sentence-badge">
                    <Volume2 size={13} style={{ color: isSpeaking ? "#10b981" : "var(--text-muted)" }} />
                    <span>
                      Câu <strong>{sentencesList && sentencesList.length > 0 ? currentSentenceIdx + 1 : 0}</strong> /{" "}
                      {sentencesList?.length || 0}
                    </span>
                  </span>
                </div>
              </div>

              {/* Row 2: Tốc độ đọc */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>Tốc độ đọc:</span>
                <div className="reader-control-btn-group">
                  {[0.8, 1.0, 1.25, 1.5].map((rate) => (
                    <button
                      key={rate}
                      className={`reader-control-btn ${speechRate === rate ? "active" : ""}`}
                      onClick={() => handleRateChange(rate)}
                      title={`Tốc độ đọc ${rate}x`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 3: Timeline Scrubber Bar */}
              <div className="reader-scrubber-row">
                <span className="reader-time-badge current-time">{formatTime(elapsedSeconds)}</span>

                <div className="reader-range-wrap">
                  <input
                    type="range"
                    className="reader-seek-range"
                    min="0"
                    max={Math.max(1, totalDuration)}
                    step="0.5"
                    value={elapsedSeconds}
                    onChange={handleSeekChange}
                    style={{
                      "--progress-percent": `${totalDuration > 0 ? Math.min(100, (elapsedSeconds / totalDuration) * 100) : 0}%`,
                    }}
                    title="Kéo hoặc nhấp vào thanh để tua thời gian bài đọc"
                    aria-label="Thanh tua thời gian bài đọc"
                  />
                </div>

                <span className="reader-time-badge total-time">{formatTime(totalDuration)}</span>
              </div>

              {/* Row 4: Scrubber helper hint */}
              <div className="reader-scrubber-hint">
                <span>💡 Kéo thanh tua hoặc <strong>bấm vào câu bất kỳ</strong> bên phải để nghe</span>
              </div>
            </div>

            {/* Thống kê bài viết & Danh sách từ vựng cần ôn */}
            <div className="reader-sidebar-stats-card">
              <div className="reader-sidebar-stats-row">
                <div className="reader-stat-item">
                  <BookOpen size={15} style={{ color: "#0284c7" }} />
                  <span>Tổng số: <strong>{totalWordsCount}</strong> từ</span>
                </div>

                <span className="reader-matched-badge">
                  ⭐ <strong>{matchedWords.length} từ đã lưu</strong>
                </span>
              </div>

              {/* Danh sách chip từ vựng */}
              {matchedWords.length > 0 && (
                <div className="reader-sidebar-chips-wrap">
                  <span className="reader-sidebar-chips-label">
                    Từ vựng đã lưu trong bài:
                  </span>
                  <div className="reader-chips-bar sidebar-chips">
                    {matchedWords.map((item, idx) => (
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
                  </div>
                </div>
              )}
            </div>

            {/* Tùy chỉnh hiển thị (Cỡ chữ, Font, Giao diện) */}
            <div className="reader-sidebar-display-card">
              <span className="reader-sidebar-display-title">
                <Type size={14} /> Tùy chỉnh hiển thị:
              </span>

              <div className="reader-display-rows">
                {/* Kích cỡ chữ */}
                <div className="reader-display-row-item">
                  <span className="reader-display-row-label">Cỡ chữ:</span>
                  <div className="reader-control-btn-group">
                    <button
                      className="reader-control-btn"
                      onClick={() => setFontSize((s) => Math.max(14, s - 1))}
                      title="Giảm kích thước chữ"
                    >
                      A-
                    </button>
                    <span style={{ fontSize: "0.8rem", padding: "0 6px", color: "var(--text-muted)", minWidth: "32px", textAlign: "center", fontWeight: 700 }}>
                      {fontSize}px
                    </span>
                    <button
                      className="reader-control-btn"
                      onClick={() => setFontSize((s) => Math.min(30, s + 1))}
                      title="Tăng kích thước chữ"
                    >
                      A+
                    </button>
                  </div>
                </div>

                {/* Kiểu chữ */}
                <div className="reader-display-row-item">
                  <span className="reader-display-row-label">Kiểu chữ:</span>
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
                </div>

                {/* Tự động cuộn trang khi đọc */}
                <div className="reader-display-row-item">
                  <span className="reader-display-row-label">Khi phát âm:</span>
                  <div className="reader-control-btn-group">
                    <button
                      className={`reader-control-btn ${autoScroll ? "active" : ""}`}
                      onClick={() => setAutoScroll(true)}
                      title="Tự động cuộn khung đọc theo câu đang phát âm"
                    >
                      🔽 Tự cuộn
                    </button>
                    <button
                      className={`reader-control-btn ${!autoScroll ? "active" : ""}`}
                      onClick={() => setAutoScroll(false)}
                      title="Giữ nguyên vị trí khung đọc, không tự động cuộn trang"
                    >
                      ⏸️ Để im
                    </button>
                  </div>
                </div>

                {/* Màu nền giao diện */}
                <div className="reader-display-row-item">
                  <span className="reader-display-row-label">Màu nền:</span>
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
                      title="Nền giấy vàng ấm (Sepia)"
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
          </aside>

          {/* CỘT PHẢI: BÀI TEXT ĐỌC */}
          <main className="reader-content-panel">
            <div
              ref={articleScrollParentRef}
              className={`reader-article-card theme-${readerTheme} font-${fontFamily}`}
              style={{
                fontSize: `${fontSize}px`,
                "--reader-font-size": `${fontSize}px`,
              }}
            >
              <div
                ref={articleContainerRef}
                className="reader-article-body"
                dangerouslySetInnerHTML={{ __html: processedHtml }}
                onClick={handleArticleClick}
              />
            </div>
          </main>
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
