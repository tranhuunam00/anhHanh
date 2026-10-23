import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  VISUAL_VOCAB_TOPICS,
  getVisualVocabTopicById,
  VISUAL_VOCAB_LANGUAGES,
  getLocalizedTopic,
} from "../../data/visualVocab";
import { filterItemsByQuery } from "../../utils/visualVocabUtils";
import { VisualVocabHeader } from "./VisualVocabHeader";
import { VisualVocabCanvas } from "./VisualVocabCanvas";
import { VisualVocab3DCanvas } from "./VisualVocab3DCanvas";
import { VisualVocabDetailCard } from "./VisualVocabDetailCard";
import { VisualVocabPractice } from "./VisualVocabPractice";
import "./VisualVocab.css";

export const VisualVocabPage = ({ isActive = true, token = null }) => {
  const [currentTopicId, setCurrentTopicId] = useState("mountain_landforms");
  const [currentLang, setCurrentLang] = useState("en");
  const [activeMode, setActiveMode] = useState("EXPLORE");
  const [activeItemId, setActiveItemId] = useState("landscape");
  const [searchQuery, setSearchQuery] = useState("");
  const [showLabels, setShowLabels] = useState(true);
  const [quizFeedback, setQuizFeedback] = useState(null);
  const [lastClickedHotspot, setLastClickedHotspot] = useState(null);
  const [masteredIds, setMasteredIds] = useState(new Set());

  const rawTopic = useMemo(() => {
    return getVisualVocabTopicById(currentTopicId);
  }, [currentTopicId]);

  const currentTopic = useMemo(() => {
    return getLocalizedTopic(rawTopic, currentLang);
  }, [rawTopic, currentLang]);

  // When switching topic, select first word and reset mastery
  useEffect(() => {
    if (currentTopic && currentTopic.items && currentTopic.items.length > 0) {
      setActiveItemId(currentTopic.items[0].id);
      setSearchQuery("");
      setQuizFeedback(null);
      setMasteredIds(new Set());
    }
  }, [currentTopicId]);

  // Filtered items based on search query
  const filteredItems = useMemo(() => {
    return filterItemsByQuery(currentTopic.items || [], searchQuery);
  }, [currentTopic, searchQuery]);

  const activeItemIndex = useMemo(() => {
    return (currentTopic.items || []).findIndex((it) => it.id === activeItemId);
  }, [currentTopic, activeItemId]);

  const activeItem = useMemo(() => {
    if (activeItemIndex >= 0) return currentTopic.items[activeItemIndex];
    return currentTopic.items?.[0] || null;
  }, [currentTopic, activeItemIndex]);

  const handleChangeMode = (newMode) => {
    setActiveMode(newMode);
    if (newMode !== "EXPLORE") {
      setShowLabels(false);
    } else {
      setShowLabels(true);
    }
  };

  const handleSelectHotspot = (item) => {
    setActiveItemId(item.id);
    if (activeMode === "SPOT_TAP") {
      setLastClickedHotspot(item);
      setTimeout(() => setLastClickedHotspot(null), 100);
    }
  };

  const handleSelectPrev = useCallback(() => {
    if (activeItemIndex > 0) {
      setActiveItemId(currentTopic.items[activeItemIndex - 1].id);
    }
  }, [activeItemIndex, currentTopic]);

  const handleSelectNext = useCallback(() => {
    if (activeItemIndex < (currentTopic.items?.length || 0) - 1) {
      setActiveItemId(currentTopic.items[activeItemIndex + 1].id);
    }
  }, [activeItemIndex, currentTopic]);

  // Keyboard shortcut: ArrowLeft and ArrowRight to navigate words in Explore mode
  useEffect(() => {
    if (activeMode !== "EXPLORE") return;

    const handleKeyDown = (e) => {
      const targetTag = e.target?.tagName?.toUpperCase();
      if (
        targetTag === "INPUT" ||
        targetTag === "TEXTAREA" ||
        targetTag === "SELECT" ||
        e.target?.isContentEditable
      ) {
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handleSelectPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleSelectNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeMode, handleSelectPrev, handleSelectNext]);

  // Auto scroll active item in quick word list into view
  useEffect(() => {
    if (!activeItemId) return;
    const activeBtn = document.querySelector(`.vv-list-item-btn[data-id="${activeItemId}"]`);
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [activeItemId]);

  if (!isActive) return null;

  return (
    <div className="visual-vocab-container">
      {/* Top Header & Toolbar */}
      <VisualVocabHeader
        topics={VISUAL_VOCAB_TOPICS}
        currentTopicId={currentTopicId}
        onSelectTopic={setCurrentTopicId}
        activeMode={activeMode}
        onChangeMode={handleChangeMode}
        currentLang={currentLang}
        onChangeLang={setCurrentLang}
        languages={VISUAL_VOCAB_LANGUAGES}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showLabels={showLabels}
        onToggleLabels={() => setShowLabels((v) => !v)}
        totalCount={currentTopic.items?.length || 0}
      />

      {/* Main Grid: Diagram Canvas + Sidebar Inspector */}
      <div className="vv-content-layout">
        {/* Left: Interactive Diagram or 3D World Canvas */}
        {currentTopic.is3D ? (
          <VisualVocab3DCanvas
            topic={currentTopic}
            items={filteredItems}
            activeItemId={activeItemId}
            onSelectHotspot={handleSelectHotspot}
            showLabels={showLabels}
            mode={activeMode}
            quizFeedback={quizFeedback}
            masteredIds={masteredIds}
          />
        ) : (
          <VisualVocabCanvas
            topic={currentTopic}
            items={filteredItems}
            activeItemId={activeItemId}
            onSelectHotspot={handleSelectHotspot}
            showLabels={showLabels}
            mode={activeMode}
            quizFeedback={quizFeedback}
            masteredIds={masteredIds}
          />
        )}

        {/* Right Sidebar: Active Word Inspector or Practice Mode */}
        <div className="vv-sidebar">
          {activeMode === "EXPLORE" ? (
            <>
              <VisualVocabDetailCard
                activeItem={activeItem}
                currentLang={currentLang}
                onSelectPrev={handleSelectPrev}
                onSelectNext={handleSelectNext}
                hasPrev={activeItemIndex > 0}
                hasNext={activeItemIndex < (currentTopic.items?.length || 0) - 1}
                currentIndex={Math.max(0, activeItemIndex)}
                totalItems={currentTopic.items?.length || 0}
                token={token}
              />

              {/* Quick Word List */}
              <div className="vv-word-list-box">
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", padding: "4px 8px" }}>
                  Danh sách từ trong chủ đề ({currentTopic.items?.length || 0})
                </div>
                {currentTopic.items.map((item, idx) => (
                  <button
                    key={item.id}
                    data-id={item.id}
                    type="button"
                    className={`vv-list-item-btn ${item.id === activeItemId ? "active" : ""}`}
                    onClick={() => setActiveItemId(item.id)}
                  >
                    <span>
                      <strong>{idx + 1}. {item.word}</strong>
                    </span>
                    <span className="vv-list-vn">{item.meaning}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <VisualVocabPractice
              topic={currentTopic}
              items={currentTopic.items || []}
              mode={activeMode}
              currentLang={currentLang}
              lastClickedHotspot={lastClickedHotspot}
              onHighlightHotspot={(id) => setActiveItemId(id)}
              onQuizFeedback={setQuizFeedback}
              onUpdateMasteredIds={setMasteredIds}
              onResetToExplore={() => handleChangeMode("EXPLORE")}
            />
          )}
        </div>
      </div>
    </div>
  );
};
