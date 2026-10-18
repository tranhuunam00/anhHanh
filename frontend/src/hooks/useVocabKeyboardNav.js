import { useState, useEffect, useCallback, useRef } from "react";
import {
  calculateNextFocusIndex,
  getNextStatus,
  getStatusFromKey,
  isTextInputElement,
  getStatusFeedbackText,
} from "../utils/vocabKeyboardUtils";

/**
 * Custom hook providing rich keyboard navigation and shortcut actions for Vocabulary Notebook
 *
 * Shortcuts:
 * - Arrow keys (←, →, ↑, ↓): Navigate between vocabulary cards
 * - Enter: Open vocabulary details / edit modal
 * - Space / Ctrl / P: Play audio pronunciation for focused card
 * - 1: Set status to "Mới lưu" (NEW)
 * - 2: Set status to "Đang nhớ" (LEARNING)
 * - 3: Set status to "Đã thuộc" (MASTERED)
 * - S: Cycle through statuses (NEW -> LEARNING -> MASTERED)
 */
export function useVocabKeyboardNav({
  items = [],
  isActive = true,
  isModalOpen = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange = null,
  onOpenDetail = null,
  onSpeak = null,
  onStatusChange = null,
  showToast = null,
}) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const cardRefs = useRef([]);

  // Bounded index validation
  const safeFocusedIndex = items.length === 0 ? -1 : Math.max(0, Math.min(focusedIndex, items.length - 1));

  // Reset focus to 0 on page or items change
  useEffect(() => {
    setFocusedIndex(0);
  }, [currentPage]);

  // Ensure index stays in bounds if items count changes
  useEffect(() => {
    if (items.length > 0 && focusedIndex >= items.length) {
      setFocusedIndex(items.length - 1);
    }
  }, [items.length, focusedIndex]);

  // Scroll focused card into view smoothly
  useEffect(() => {
    if (safeFocusedIndex >= 0 && cardRefs.current[safeFocusedIndex]) {
      const el = cardRefs.current[safeFocusedIndex];
      if (el && typeof el.scrollIntoView === "function") {
        el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
      }
    }
  }, [safeFocusedIndex]);

  const handleKeyDown = useCallback(
    (e) => {
      // Only active if tab is visible and no overlay modal is open
      if (!isActive || isModalOpen || items.length === 0) return;

      // Ignore shortcut keys when typing inside input / textarea / select
      if (isTextInputElement(e.target)) return;

      const currentItem = items[safeFocusedIndex];
      const key = e.key;

      // 1. Arrow Navigation
      if (key === "ArrowRight" || key === "ArrowLeft" || key === "ArrowDown" || key === "ArrowUp") {
        e.preventDefault();

        // Page flip on boundary right
        if (key === "ArrowRight" && safeFocusedIndex === items.length - 1 && currentPage < totalPages && onPageChange) {
          onPageChange(currentPage + 1);
          setFocusedIndex(0);
          return;
        }

        // Page flip on boundary left
        if (key === "ArrowLeft" && safeFocusedIndex === 0 && currentPage > 1 && onPageChange) {
          onPageChange(currentPage - 1);
          setFocusedIndex(items.length - 1);
          return;
        }

        // Compute grid columns dynamically based on container or default to 3
        let cols = 3;
        try {
          const gridEl = document.querySelector(".vocab-grid");
          if (gridEl) {
            const gridStyle = window.getComputedStyle(gridEl);
            const templateCols = gridStyle.getPropertyValue("grid-template-columns");
            if (templateCols) {
              const matchedCols = templateCols.split(" ").filter(Boolean).length;
              if (matchedCols > 0) cols = matchedCols;
            }
          }
        } catch (_) {}

        const nextIdx = calculateNextFocusIndex(safeFocusedIndex, items.length, key, cols);
        setFocusedIndex(nextIdx);
        return;
      }

      // 2. Open Detail Modal with Enter
      if (key === "Enter") {
        if (currentItem && onOpenDetail) {
          e.preventDefault();
          onOpenDetail(currentItem);
        }
        return;
      }

      // 3. Audio Pronunciation replay with Ctrl or Space or P
      if (key === "Control" || key === " " || key === "p" || key === "P") {
        if (currentItem && onSpeak) {
          e.preventDefault();
          onSpeak(currentItem.word, currentItem.source_lang);
        }
        return;
      }

      // 4. Change Status via Number Keys 1, 2, 3
      const mappedStatus = getStatusFromKey(key);
      if (mappedStatus && currentItem && onStatusChange) {
        e.preventDefault();
        onStatusChange(currentItem.id, mappedStatus);
        if (showToast) {
          showToast(`Đã chuyển "${currentItem.word}" ➔ ${getStatusFeedbackText(mappedStatus)}`, "success");
        }
        return;
      }

      // 5. Cycle Status via Key 'S' or 's'
      if (key === "s" || key === "S") {
        if (currentItem && onStatusChange) {
          e.preventDefault();
          const nextStatus = getNextStatus(currentItem.status);
          onStatusChange(currentItem.id, nextStatus);
          if (showToast) {
            showToast(`Đã chuyển "${currentItem.word}" ➔ ${getStatusFeedbackText(nextStatus)}`, "success");
          }
        }
      }
    },
    [
      isActive,
      isModalOpen,
      items,
      safeFocusedIndex,
      currentPage,
      totalPages,
      onPageChange,
      onOpenDetail,
      onSpeak,
      onStatusChange,
      showToast,
    ]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const setCardRef = (index) => (el) => {
    cardRefs.current[index] = el;
  };

  return {
    focusedIndex: safeFocusedIndex,
    setFocusedIndex,
    setCardRef,
  };
}
