import React, { useState, useMemo, useEffect } from "react";
import { Sparkles, BookOpen, Layers } from "../Icons";
import {
  rankKeywordsByNewWordWeight,
  calculateKeywordUsageStats,
  checkKeywordUsageInText,
} from "../../utils/keywordWeightUtils";
import { getDefaultStructuresByGenre } from "../../utils/writingDefaultStructures";
import { suggestWritingStructures } from "../../services/writingService";
import { KeywordChipItem } from "./KeywordChipItem";
import { SentenceFrameChipItem } from "./SentenceFrameChipItem";

/**
 * Component hiển thị gợi ý Từ khóa & Dạng câu theo chủ đề (chia 2 bên)
 * - Bên trái: Từ / Cụm từ theo chủ đề (có nút Gen thêm)
 * - Bên phải: Dạng câu theo chủ đề (có nút Gen thêm)
 * - Hỗ trợ Click để chèn nhanh vào bài viết tại vị trí con trỏ
 * - Click (i) giải thích nghĩa tiếng Việt
 * - Click (+) lưu vào sổ từ vựng
 */
export function PromptKeywordsBar({
  currentPrompt,
  essayText = "",
  savedVocabMap = {},
  onInsertKeyword,
  onAddVocab,
  showToast,
  token,
  language = "en",
  targetBand = 7.0,
  genre = "ielts_task2",
  isAuthorized = true,
}) {
  const [includeNotebookVocab, setIncludeNotebookVocab] = useState(true);
  const [activeTooltipId, setActiveTooltipId] = useState(null);

  // Danh sách từ/cụm từ bổ sung do AI sinh thêm
  const [extraKeywords, setExtraKeywords] = useState([]);
  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false);

  // Danh sách dạng câu (mặc định + do AI sinh thêm)
  const [customSentences, setCustomSentences] = useState([]);
  const [isGeneratingSentences, setIsGeneratingSentences] = useState(false);

  // Reset extra items khi đổi đề bài
  useEffect(() => {
    setExtraKeywords([]);
    setCustomSentences([]);
    setActiveTooltipId(null);
  }, [currentPrompt?.prompt, currentPrompt?.id]);

  // Đóng tooltip khi click ra ngoài
  useEffect(() => {
    const handleGlobalClick = () => {
      setActiveTooltipId(null);
    };
    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  // 1. Tính toán danh sách Từ / Cụm từ theo trọng số từ mới
  const rankedKeywords = useMemo(() => {
    const basePromptKeywords = currentPrompt?.keywords || [];
    // Kết hợp keywords gốc với các collocations mới sinh
    const combinedKeywords = [...basePromptKeywords];
    extraKeywords.forEach((extra) => {
      const w = typeof extra === "string" ? extra : extra.phrase || extra.word;
      if (w && !combinedKeywords.some((k) => (typeof k === "string" ? k : k.word || k.phrase).toLowerCase() === w.toLowerCase())) {
        combinedKeywords.push(typeof extra === "object" ? extra : { word: w, kind: "collocation" });
      }
    });

    return rankKeywordsByNewWordWeight(
      combinedKeywords,
      savedVocabMap,
      currentPrompt || {},
      { includeNotebookVocab, maxKeywords: 16 }
    );
  }, [currentPrompt, savedVocabMap, includeNotebookVocab, extraKeywords]);

  // 2. Danh sách Dạng câu theo chủ đề
  const sentenceList = useMemo(() => {
    const defaultList = getDefaultStructuresByGenre(genre);
    if (customSentences.length === 0) {
      return defaultList;
    }
    const combined = [...customSentences];
    defaultList.forEach((def) => {
      if (!combined.some((s) => s.phrase === def.phrase)) {
        combined.push(def);
      }
    });
    return combined;
  }, [genre, customSentences]);

  // 3. Tính toán thống kê sử dụng từ khóa
  const keywordStats = useMemo(() => {
    return calculateKeywordUsageStats(rankedKeywords, essayText);
  }, [rankedKeywords, essayText]);

  // 4. Tính toán thống kê sử dụng dạng câu
  const sentenceStats = useMemo(() => {
    let usedCount = 0;
    const usedMap = {};
    sentenceList.forEach((item) => {
      // Tìm đoạn khóa chính trong câu (bỏ dấu [...])
      const cleanPattern = (item.phrase || item.template || "").replace(/\[.*?\]/g, "").trim();
      const firstChunk = cleanPattern.split(/\s{2,}|\.|\,/)[0]?.trim();
      const isUsed = firstChunk && firstChunk.length > 8 ? checkKeywordUsageInText(firstChunk, essayText) : false;
      usedMap[item.id || item.phrase] = isUsed;
      if (isUsed) usedCount++;
    });
    return { usedCount, total: sentenceList.length, usedMap };
  }, [sentenceList, essayText]);

  // Handler: Sinh thêm Từ / Cụm từ theo chủ đề
  const handleGenerateMoreKeywords = async () => {
    if (!currentPrompt?.prompt) {
      if (showToast) showToast("Vui lòng chọn đề bài trước khi sinh thêm từ vựng!", "warning");
      return;
    }
    try {
      setIsGeneratingKeywords(true);
      const existing = rankedKeywords.map((k) => k.word);
      const res = await suggestWritingStructures({
        topic: currentPrompt.prompt,
        language,
        targetBand,
        genre,
        requestKind: "collocation",
        existingPhrases: existing,
        token,
      });

      const list = res.suggestions || res.structures || [];
      if (list.length > 0) {
        setExtraKeywords((prev) => [...prev, ...list]);
        if (showToast) {
          showToast(`Đã thêm ${list.length} từ & cụm từ đắt giá theo đề!`, "success");
        }
      } else {
        if (showToast) showToast("Chưa tìm thêm được từ vựng mới, hãy thử lại.", "info");
      }
    } catch (e) {
      console.error("Lỗi sinh thêm từ vựng:", e);
      if (showToast) showToast("Không thể sinh thêm từ vựng lúc này.", "error");
    } finally {
      setIsGeneratingKeywords(false);
    }
  };

  // Handler: Sinh thêm Dạng câu theo chủ đề
  const handleGenerateMoreSentences = async () => {
    if (!currentPrompt?.prompt) {
      if (showToast) showToast("Vui lòng chọn đề bài trước khi sinh thêm dạng câu!", "warning");
      return;
    }
    try {
      setIsGeneratingSentences(true);
      const existing = sentenceList.map((s) => s.phrase);
      const res = await suggestWritingStructures({
        topic: currentPrompt.prompt,
        language,
        targetBand,
        genre,
        requestKind: "structure",
        existingPhrases: existing,
        token,
      });

      const list = res.suggestions || res.structures || [];
      if (list.length > 0) {
        const mapped = list.map((item, idx) => ({
          id: `ai_gen_${Date.now()}_${idx}`,
          kind: "structure",
          band: item.band || `Band ${targetBand >= 8 ? "8.0" : "7.5"}`,
          phrase: item.phrase || item.template,
          meaning: item.meaning || "Khung câu học thuật bổ sung theo đề",
          usage: item.usage || "Dùng triển khai ý",
          template: item.template || item.phrase,
        }));
        setCustomSentences((prev) => [...mapped, ...prev]);
        if (showToast) {
          showToast(`Đã bổ sung ${list.length} khung cấu trúc câu mới!`, "success");
        }
      } else {
        if (showToast) showToast("Chưa tìm thêm được khung câu mới, hãy thử lại.", "info");
      }
    } catch (e) {
      console.error("Lỗi sinh thêm dạng câu:", e);
      if (showToast) showToast("Không thể sinh thêm dạng câu lúc này.", "error");
    } finally {
      setIsGeneratingSentences(false);
    }
  };

  const handleInsertSentence = (text) => {
    if (onInsertKeyword) {
      onInsertKeyword(text);
      if (showToast) {
        showToast("Đã chèn khung câu vào bài viết!", "success");
      }
    }
  };

  const handleInsertWord = (word) => {
    if (onInsertKeyword) {
      onInsertKeyword(word);
      if (showToast) {
        showToast(`Đã chèn "${word}" vào bài viết!`, "success");
      }
    }
  };

  return (
    <div className="prompt-keywords-bar-v2 dual-columns-layout">
      {/* CỘT 1 (BÊN TRÁI): TỪ & CỤM TỪ THEO CHỦ ĐỀ */}
      <div className="keywords-dual-column column-vocab">
        <div className="keywords-column-header">
          <div className="column-title-group">
            <BookOpen size={14} color="var(--primary)" />
            <span className="column-title-text">Từ & Cụm từ theo chủ đề</span>
            {keywordStats.total > 0 && (
              <span
                className={`keywords-usage-badge ${keywordStats.usedCount > 0 ? "has-used" : ""}`}
                title="Số từ khóa đã dùng trong bài viết"
              >
                {keywordStats.usedCount}/{keywordStats.total}
              </span>
            )}
          </div>

          <div className="column-actions-group">
            <label className="toggle-notebook-vocab-label" title="Tự động lấy thêm các từ mới trong Sổ từ vựng">
              <input
                type="checkbox"
                checked={includeNotebookVocab}
                onChange={(e) => setIncludeNotebookVocab(e.target.checked)}
              />
              <span>Từ trong sổ</span>
            </label>

            <button
              type="button"
              className="btn-gen-more"
              onClick={handleGenerateMoreKeywords}
              disabled={isGeneratingKeywords}
              title="AI sinh thêm các từ và cụm từ đắt giá theo đề bài"
            >
              <Sparkles size={12} className={isGeneratingKeywords ? "spin-icon" : ""} />
              <span>{isGeneratingKeywords ? "Đang gen..." : "Gen thêm"}</span>
            </button>
          </div>
        </div>

        {/* Danh sách Chips từ / cụm từ */}
        <div className="keywords-list-v2">
          {rankedKeywords.map((kw, idx) => {
            const isUsed = !!keywordStats.usedMap[kw.normalizedWord];
            const isTooltipOpen = activeTooltipId === `kw_${kw.word}`;

            return (
              <KeywordChipItem
                key={`kw_${kw.word}_${idx}`}
                kw={kw}
                isUsed={isUsed}
                onInsertKeyword={handleInsertWord}
                onAddVocab={onAddVocab}
                token={token}
                showToast={showToast}
                isTooltipOpen={isTooltipOpen}
                onToggleTooltip={() =>
                  setActiveTooltipId((prev) => (prev === `kw_${kw.word}` ? null : `kw_${kw.word}`))
                }
              />
            );
          })}
        </div>
      </div>

      {/* CỘT 2 (BÊN PHẢI): DẠNG CÂU THEO CHỦ ĐỀ */}
      <div className="keywords-dual-column column-sentences">
        <div className="keywords-column-header">
          <div className="column-title-group">
            <Layers size={14} color="var(--primary)" />
            <span className="column-title-text">Dạng câu theo chủ đề</span>
            {sentenceStats.total > 0 && (
              <span
                className={`keywords-usage-badge ${sentenceStats.usedCount > 0 ? "has-used" : ""}`}
                title="Số dạng câu đã áp dụng vào bài viết"
              >
                {sentenceStats.usedCount}/{sentenceStats.total}
              </span>
            )}
          </div>

          <div className="column-actions-group">
            <button
              type="button"
              className="btn-gen-more"
              onClick={handleGenerateMoreSentences}
              disabled={isGeneratingSentences}
              title="AI sinh thêm khung cấu trúc câu theo đề bài"
            >
              <Sparkles size={12} className={isGeneratingSentences ? "spin-icon" : ""} />
              <span>{isGeneratingSentences ? "Đang gen..." : "Gen thêm"}</span>
            </button>
          </div>
        </div>

        {/* Danh sách Chips Dạng câu */}
        <div className="keywords-list-v2 sentences-list">
          {sentenceList.map((item, idx) => {
            const itemKey = item.id || `sent_${idx}`;
            const isUsed = !!sentenceStats.usedMap[item.id || item.phrase];
            const isTooltipOpen = activeTooltipId === `sent_${itemKey}`;

            return (
              <SentenceFrameChipItem
                key={itemKey}
                item={item}
                isUsed={isUsed}
                onInsertSentence={handleInsertSentence}
                onAddVocab={onAddVocab}
                showToast={showToast}
                isTooltipOpen={isTooltipOpen}
                onToggleTooltip={() =>
                  setActiveTooltipId((prev) => (prev === `sent_${itemKey}` ? null : `sent_${itemKey}`))
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
