import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { WordLookupPopover } from "../components/Vocab/WordLookupPopover";
import { ReaderSidebar } from "../components/Reader/ReaderSidebar";
import { ReaderPasteSection } from "../components/Reader/ReaderPasteSection";
import { SAMPLE_ARTICLE, sanitizePastedHtml } from "../utils/readerUtils";
import { processReaderArticle } from "../utils/readerHtmlProcessor";
import { useReaderSpeech } from "../hooks/useReaderSpeech";
import "../styles/smart-reader.css";

export function SmartReaderPage({ isActive = true }) {
  const { savedVocabMap, showToast } = useAuth();

  // Mode: "paste" (Màn hình dán bài mới) vs "reading" (Giao diện đọc bài)
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
  const [autoScroll, setAutoScroll] = useState(() => localStorage.getItem("shotlang_reader_autoscroll") !== "false");
  const [activeWordPopover, setActiveWordPopover] = useState(null);

  const editorBoxRef = useRef(null);
  const articleContainerRef = useRef(null);
  const articleScrollParentRef = useRef(null);

  // When switching to reading mode or opening the tab, scroll to top so Header is visible
  useEffect(() => {
    if (mode === "reading" && isActive) {
      window.scrollTo({ top: 0, behavior: "instant" });
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
    window.scrollTo({ top: 0, behavior: "instant" });
    if (showToast) {
      showToast("Đang mở chế độ đọc và quét từ vựng...", "info");
    }
  };

  // Switch to paste mode to paste a new article
  const handleSwitchToPaste = () => {
    setEditorContent(articleHtml || "");
    setMode("paste");
    window.scrollTo({ top: 0, behavior: "instant" });
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
    return processReaderArticle(articleHtml, savedVocabMap);
  }, [articleHtml, savedVocabMap, mode]);

  // Remove speaking highlight from all sentences
  const clearSentenceHighlights = useCallback(() => {
    if (!articleContainerRef.current) return;
    const activeEls = articleContainerRef.current.querySelectorAll(".reader-sentence.active-speaking");
    activeEls.forEach((el) => el.classList.remove("active-speaking"));
  }, []);

  // Highlight specific sentence in DOM and smoothly scroll into view if autoScroll is enabled
  const highlightSentenceInDOM = useCallback((index) => {
    if (!articleContainerRef.current) return;
    const prevActive = articleContainerRef.current.querySelectorAll(".reader-sentence.active-speaking");
    prevActive.forEach((el) => el.classList.remove("active-speaking"));

    const target = articleContainerRef.current.querySelector(`.reader-sentence[data-s-idx="${index}"]`);
    if (target) {
      target.classList.add("active-speaking");
      if (autoScroll) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [autoScroll]);

  // Speech synthesis hook
  const {
    isSpeaking,
    setIsSpeaking,
    speechRate,
    currentSentenceIdx,
    elapsedSeconds,
    totalDuration,
    onlyCurrentSentence,
    setOnlyCurrentSentence,
    voices,
    selectedVoiceUri,
    selectedAccent,
    pitchPreset,
    handleSelectVoiceUri,
    handleSelectAccent,
    handleSelectPitchPreset,
    handleTestVoice,
    speakSentence,
    handleToggleSpeech,
    handleToggleSingleSentenceMode,
    handlePrevSentence,
    handleNextSentence,
    handleRestartSpeech,
    handleRateChange,
    handleSeekChange,
  } = useReaderSpeech({
    sentencesList,
    highlightSentenceInDOM,
    clearSentenceHighlights,
    showToast,
    isActive,
  });

  // Keyboard shortcut: Space = play/pause, R = restart (only in reading mode, not when editor/input focused)
  useEffect(() => {
    if (mode !== "reading" || !isActive) return;

    const handleKeyDown = (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      const isEditing = tag === "input" || tag === "textarea" || document.activeElement?.isContentEditable;
      if (isEditing) return;

      if (e.code === "Space") {
        e.preventDefault();
        handleToggleSpeech();
      } else if (e.code === "KeyR" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        handleRestartSpeech();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mode, isActive, handleToggleSpeech, handleRestartSpeech]);

  // Single click inside article: Open vocab popover if clicking a saved mark;
  // If user is selecting text (bôi đen), ignore so selection isn't interrupted.
  const handleArticleClick = (e) => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      return;
    }

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
  };

  // Double click inside article: Speak the double-clicked sentence
  const handleArticleDoubleClick = (e) => {
    if (e.target.closest(".smart-vocab-mark")) {
      return;
    }

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
        m.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        m.classList.add("reader-tts-active");
        setTimeout(() => m.classList.remove("reader-tts-active"), 2000);
        break;
      }
    }
  };

  const isEditorEmpty = !editorContent || (!editorContent.trim() && !editorContent.includes("<img"));

  return (
    <div className={`smart-reader-container ${mode === "reading" ? "reader-split-mode" : ""}`}>
      {/* BƯỚC 1: MÀN HÌNH DÁN BÀI VIẾT (PASTE & PREVIEW MODE) */}
      {mode === "paste" && (
        <ReaderPasteSection
          editorBoxRef={editorBoxRef}
          editorContent={editorContent}
          articleHtml={articleHtml}
          isEditorEmpty={isEditorEmpty}
          onSwitchToReading={() => {
            setMode("reading");
            window.scrollTo({ top: 0, behavior: "instant" });
          }}
          onEditorPaste={handleEditorPaste}
          onEditorInput={handleEditorInput}
          onStartReading={handleStartReading}
          onPasteFromClipboard={handlePasteFromClipboardBtn}
          onInsertSample={() => handleInsertIntoEditor(SAMPLE_ARTICLE)}
          onClearEditor={() => {
            setEditorContent("");
            if (editorBoxRef.current) editorBoxRef.current.innerHTML = "";
          }}
        />
      )}

      {/* BƯỚC 2: MÀN HÌNH ĐỌC BÀI VIẾT (CHIA 2 CỘT: TRÁI & PHẢI) */}
      {mode === "reading" && (
        <div className="reader-split-layout">
          {/* CỘT TRÁI (STICKY SIDEBAR): BẢNG ĐIỀU KHIỂN & AUDIO PLAYER */}
          <ReaderSidebar
            onSwitchToPaste={handleSwitchToPaste}
            onDeleteArticle={() => {
              if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
                setArticleHtml("");
                setEditorContent("");
                setMode("paste");
                window.scrollTo({ top: 0, behavior: "instant" });
                if (isSpeaking) {
                  window.speechSynthesis?.cancel();
                  setIsSpeaking(false);
                }
              }
            }}
            currentSentenceIdx={currentSentenceIdx}
            sentencesCount={sentencesList?.length || 0}
            isSpeaking={isSpeaking}
            onlyCurrentSentence={onlyCurrentSentence}
            onToggleSpeech={handleToggleSpeech}
            onPrevSentence={handlePrevSentence}
            onNextSentence={handleNextSentence}
            onRestartSpeech={handleRestartSpeech}
            onToggleSingleSentenceMode={handleToggleSingleSentenceMode}
            speechRate={speechRate}
            onRateChange={handleRateChange}
            voices={voices}
            selectedVoiceUri={selectedVoiceUri}
            onSelectVoiceUri={handleSelectVoiceUri}
            selectedAccent={selectedAccent}
            onSelectAccent={handleSelectAccent}
            pitchPreset={pitchPreset}
            onSelectPitchPreset={handleSelectPitchPreset}
            onTestVoice={handleTestVoice}
            elapsedSeconds={elapsedSeconds}
            totalDuration={totalDuration}
            onSeekChange={handleSeekChange}
            totalWordsCount={totalWordsCount}
            matchedWords={matchedWords}
            onScrollToWord={handleScrollToWord}
            fontSize={fontSize}
            setFontSize={setFontSize}
            fontFamily={fontFamily}
            setFontFamily={setFontFamily}
            setOnlyCurrentSentence={setOnlyCurrentSentence}
            autoScroll={autoScroll}
            setAutoScroll={setAutoScroll}
            readerTheme={readerTheme}
            setReaderTheme={setReaderTheme}
          />

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
                onDoubleClick={handleArticleDoubleClick}
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
