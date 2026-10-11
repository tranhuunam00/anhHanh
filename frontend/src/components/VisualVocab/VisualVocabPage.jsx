import React, { useState, useMemo, useEffect } from "react";
import { VISUAL_VOCAB_TOPICS, getVisualVocabTopicById } from "../../data/visualVocab";
import { filterItemsByQuery } from "../../utils/visualVocabUtils";
import { VisualVocabHeader } from "./VisualVocabHeader";
import { VisualVocabCanvas } from "./VisualVocabCanvas";
import { VisualVocabDetailCard } from "./VisualVocabDetailCard";
import { VisualVocabPractice } from "./VisualVocabPractice";
import "./VisualVocab.css";

export const VisualVocabPage = ({ isActive = true, token = null }) => {
  const [currentTopicId, setCurrentTopicId] = useState("mountain_landforms");
  const [activeMode, setActiveMode] = useState("EXPLORE");
  const [activeItemId, setActiveItemId] = useState("landscape");
  const [searchQuery, setSearchQuery] = useState("");
  const [showLabels, setShowLabels] = useState(true);
  const [quizFeedback, setQuizFeedback] = useState(null);
  const [lastClickedHotspot, setLastClickedHotspot] = useState(null);
  const [masteredIds, setMasteredIds] = useState(new Set());

  const currentTopic = useMemo(() => {
    return getVisualVocabTopicById(currentTopicId);
  }, [currentTopicId]);

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

  const handleSelectPrev = () => {
    if (activeItemIndex > 0) {
      setActiveItemId(currentTopic.items[activeItemIndex - 1].id);
    }
  };

  const handleSelectNext = () => {
    if (activeItemIndex < (currentTopic.items?.length || 0) - 1) {
      setActiveItemId(currentTopic.items[activeItemIndex + 1].id);
    }
  };

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
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showLabels={showLabels}
        onToggleLabels={() => setShowLabels((v) => !v)}
        totalCount={currentTopic.items?.length || 0}
      />

      {/* Main Grid: Diagram Canvas + Sidebar Inspector */}
      <div className="vv-content-layout">
        {/* Left: Interactive Image Canvas */}
        <VisualVocabCanvas
          topic={currentTopic}
          items={filteredItems}
          activeItemId={activeItemId}
          onSelectHotspot={handleSelectHotspot}
          showLabels={showLabels}
          quizFeedback={quizFeedback}
          masteredIds={masteredIds}
        />

        {/* Right Sidebar: Active Word Inspector or Practice Mode */}
        <div className="vv-sidebar">
          {activeMode === "EXPLORE" ? (
            <>
              <VisualVocabDetailCard
                activeItem={activeItem}
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
