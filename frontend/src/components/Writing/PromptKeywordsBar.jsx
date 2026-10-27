import React, { useState, useMemo, useEffect, useRef } from "react";
import { Sparkles, BookOpen, Layers, ArrowUpDown } from "../Icons";
import {
  rankKeywordsByNewWordWeight,
  calculateKeywordUsageStats,
  checkKeywordUsageInText,
  sortKeywordsByOption,
  sortSentencesByOption,
} from "../../utils/keywordWeightUtils";
import {
  getDefaultStructuresByGenre,
  getFallbackCollocations,
  getFallbackSentenceFrames,
} from "../../utils/writingDefaultStructures";
import { formatBandLabel } from "../../utils/bandVocabularyUtils";
import { suggestWritingStructures } from "../../services/writingService";
import {
  computePromptKey,
  shouldResetTabItems,
  getEffectiveTopicText,
} from "../../utils/writingTabPersistenceUtils";
import { KeywordChipItem } from "./KeywordChipItem";
import { SentenceFrameChipItem } from "./SentenceFrameChipItem";

/**
 * Component hiển thị gợi ý Từ khóa & Dạng câu theo chủ đề (chia 2 bên)
 * - Bên trái: Từ / Cụm từ theo chủ đề (có nút Gen thêm, Sort thời gian asc/desc)
 * - Bên phải: Dạng câu theo chủ đề (có nút Gen thêm, Sort thời gian asc/desc)
 * - Hỗ trợ Click để chèn nhanh vào bài viết tại vị trí con trỏ
 * - Click (i) giải thích nghĩa tiếng Việt
 * - Click (+) lưu vào sổ từ vựng
 */
export function PromptKeywordsBar({
  currentPrompt,
  effectivePromptText = "",
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

  // Thứ tự sắp xếp từ vựng và câu (thời gian asc / desc / mặc định)
  const [vocabSortOrder, setVocabSortOrder] = useState("time_desc");
  const [sentenceSortOrder, setSentenceSortOrder] = useState("default");

  // Danh sách từ/cụm từ bổ sung do AI sinh thêm
  const [extraKeywords, setExtraKeywords] = useState([]);
  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false);

  // Danh sách dạng câu (mặc định + do AI sinh thêm)
  const [customSentences, setCustomSentences] = useState([]);
  const [isGeneratingSentences, setIsGeneratingSentences] = useState(false);

  // Reset extra items chỉ khi thực sự đổi đề bài (giữ nguyên khi chuyển tab)
  const currentKey = computePromptKey(currentPrompt, effectivePromptText);
  const lastPromptKeyRef = useRef(currentKey);

  useEffect(() => {
    if (shouldResetTabItems(currentKey, lastPromptKeyRef.current)) {
      lastPromptKeyRef.current = currentKey;
      setExtraKeywords([]);
      setCustomSentences([]);
      setActiveTooltipId(null);
    }
  }, [currentKey]);

  // Đóng tooltip khi click ra ngoài
  useEffect(() => {
    const handleGlobalClick = () => {
      setActiveTooltipId(null);
    };
    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  // 1. Tính toán danh sách Từ / Cụm từ theo trọng số từ mới và Mục tiêu Band
  const rankedKeywords = useMemo(() => {
    const basePromptKeywords = currentPrompt?.keywords || [];
    // Đặt extraKeywords lên trước để ưu tiên hiển thị ngay khi vừa gen thêm
    const combinedKeywords = [...extraKeywords, ...basePromptKeywords];

    return rankKeywordsByNewWordWeight(
      combinedKeywords,
      savedVocabMap,
      currentPrompt || {},
      { includeNotebookVocab, maxKeywords: 35, targetBand }
    );
  }, [currentPrompt, savedVocabMap, includeNotebookVocab, extraKeywords, targetBand]);

  // Danh sách Từ / Cụm từ sau khi áp dụng Sắp xếp (Thời gian ASC / DESC / Trọng số)
  const displayedKeywords = useMemo(() => {
    return sortKeywordsByOption(rankedKeywords, vocabSortOrder);
  }, [rankedKeywords, vocabSortOrder]);

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

  // Danh sách Dạng câu sau khi áp dụng Sắp xếp (Thời gian ASC / DESC / Khuyên dùng)
  const displayedSentences = useMemo(() => {
    return sortSentencesByOption(sentenceList, sentenceSortOrder);
  }, [sentenceList, sentenceSortOrder]);

  // 3. Tính toán thống kê sử dụng từ khóa
  const keywordStats = useMemo(() => {
    return calculateKeywordUsageStats(rankedKeywords, essayText);
  }, [rankedKeywords, essayText]);

  // 4. Tính toán thống kê sử dụng dạng câu
  const sentenceStats = useMemo(() => {
    let usedCount = 0;
    const usedMap = {};
    sentenceList.forEach((item) => {
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
    const topicText = getEffectiveTopicText(effectivePromptText, currentPrompt);
    setIsGeneratingKeywords(true);
    const existing = rankedKeywords.map((k) => k.word);

    try {
      let newItems = [];
      try {
        const res = await suggestWritingStructures({
          topic: topicText,
          language,
          targetBand,
          genre,
          requestKind: "collocation",
          existingPhrases: existing,
          token,
        });
        const list = res?.suggestions || res?.structures || [];
        if (list.length > 0) {
          newItems = list.map((item, idx) => ({
            word: item.phrase || item.template || item.word,
            meaning: item.meaning || "Cụm từ học thuật theo đề bài",
            kind: "collocation",
            band: formatBandLabel(item.band, targetBand),
            isGenerated: true,
            createdAt: new Date(Date.now() + idx * 100).toISOString(),
          }));
        }
      } catch (apiErr) {
        console.debug("API suggest-structures failed, using smart fallback:", apiErr);
      }

      // Nếu API không trả về hoặc bị lỗi, sử dụng fallback đa dạng theo chủ đề và Band
      if (newItems.length === 0) {
        newItems = getFallbackCollocations(topicText, existing, targetBand);
      }

      if (newItems.length > 0) {
        setExtraKeywords((prev) => [...newItems, ...prev]);
        if (showToast) {
          showToast(`Đã bổ sung thêm ${newItems.length} từ & cụm từ đắt giá theo đề!`, "success");
        }
      } else {
        if (showToast) showToast("Đã cập nhật bộ từ vựng đề bài.", "info");
      }
    } catch (e) {
      console.error("Lỗi sinh thêm từ vựng:", e);
      // Fallback an toàn
      const fallbackList = getFallbackCollocations(topicText, existing, targetBand);
      if (fallbackList.length > 0) {
        setExtraKeywords((prev) => [...fallbackList, ...prev]);
        if (showToast) showToast(`Đã bổ sung thêm ${fallbackList.length} cụm từ học thuật!`, "success");
      }
    } finally {
      setIsGeneratingKeywords(false);
    }
  };

  // Handler: Sinh thêm Dạng câu theo chủ đề
  const handleGenerateMoreSentences = async () => {
    const topicText = getEffectiveTopicText(effectivePromptText, currentPrompt);
    setIsGeneratingSentences(true);
    const existing = sentenceList.map((s) => s.phrase);

    try {
      let newSentences = [];
      try {
        const res = await suggestWritingStructures({
          topic: topicText,
          language,
          targetBand,
          genre,
          requestKind: "structure",
          existingPhrases: existing,
          token,
        });
        const list = res?.suggestions || res?.structures || [];
        if (list.length > 0) {
          newSentences = list.map((item, idx) => ({
            id: `ai_gen_${Date.now()}_${idx}`,
            kind: "structure",
            band: item.band || `Band ${targetBand >= 8 ? "8.0" : "7.5"}`,
            phrase: item.phrase || item.template,
            meaning: item.meaning || "Khung câu học thuật bổ sung theo đề",
            usage: item.usage || "Dùng triển khai ý",
            template: item.template || item.phrase,
            createdAt: new Date(Date.now() + idx * 100).toISOString(),
          }));
        }
      } catch (apiErr) {
        console.debug("API suggest-structures sentences failed, using smart fallback:", apiErr);
      }

      // Nếu API lỗi, dùng fallback các câu cao cấp Band 8.0 - 8.5
      if (newSentences.length === 0) {
        newSentences = getFallbackSentenceFrames(existing);
      }

      if (newSentences.length > 0) {
        setCustomSentences((prev) => [...newSentences, ...prev]);
        if (showToast) {
          showToast(`Đã bổ sung ${newSentences.length} khung cấu trúc câu mới!`, "success");
        }
      } else {
        if (showToast) showToast("Đã cập nhật khung câu cho đề bài.", "info");
      }
    } catch (e) {
      console.error("Lỗi sinh thêm dạng câu:", e);
      const fallbackFrames = getFallbackSentenceFrames(existing);
      if (fallbackFrames.length > 0) {
        setCustomSentences((prev) => [...fallbackFrames, ...prev]);
        if (showToast) showToast(`Đã bổ sung ${fallbackFrames.length} khung câu chuẩn!`, "success");
      }
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
            {/* Bộ điều khiển Sort theo thời gian asc/desc */}
            <div className="column-sort-box" title="Sắp xếp danh sách từ vựng theo thời gian hoặc độ ưu tiên">
              <ArrowUpDown size={11} className="sort-icon" />
              <select
                className="column-sort-select"
                value={vocabSortOrder}
                onChange={(e) => setVocabSortOrder(e.target.value)}
                aria-label="Sắp xếp từ vựng"
              >
                <option value="time_desc">Mới nhất (DESC)</option>
                <option value="time_asc">Cũ nhất (ASC)</option>
                <option value="weight">Trọng số (Mặc định)</option>
              </select>
            </div>

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
          {displayedKeywords.map((kw, idx) => {
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
            {/* Bộ điều khiển Sort dạng câu theo thời gian asc/desc */}
            <div className="column-sort-box" title="Sắp xếp dạng câu theo thời gian hoặc mặc định">
              <ArrowUpDown size={11} className="sort-icon" />
              <select
                className="column-sort-select"
                value={sentenceSortOrder}
                onChange={(e) => setSentenceSortOrder(e.target.value)}
                aria-label="Sắp xếp dạng câu"
              >
                <option value="default">Khuyên dùng (Mặc định)</option>
                <option value="time_desc">Mới nhất (DESC)</option>
                <option value="time_asc">Cũ nhất (ASC)</option>
              </select>
            </div>

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
          {displayedSentences.map((item, idx) => {
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
