import React, { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, MapPin } from "../../constants/icons.js";
import {
  isQuestionAnswered,
  calculateScrollBounds,
  calculateCenteredScrollPosition,
  calculateDragScroll,
  shouldPreventClickAfterDrag,
  calculateStepScroll
} from "../../utils/ieltsPaletteUtils.js";
import { scrollToEvidenceMark } from "../../utils/ieltsEvidenceHighlightUtils.js";

export { isQuestionAnswered };

/**
 * IELTS Question Palette (Top Horizontal Bar Standard)
 * Laid out in a single streamlined row at the top of the test module.
 * Combines Part switcher chips with all 40 question numbers arranged horizontally.
 * Supports smooth horizontal drag-to-scroll, wheel scrolling, step navigation, and active centering.
 */
export const IeltsQuestionPalette = ({
  totalQuestions = 40,
  answers = {},
  evaluation = null,
  activeNumber = null,
  activePart = 1,
  onSelectPart = null,
  onSelectQuestion,
  skill = "reading",
  className = ""
}) => {
  const numbers = Array.from({ length: totalQuestions }, (_, i) => i + 1);
  const answeredCount = numbers.filter((n) => isQuestionAnswered(answers, n)).length;

  const stripRef = useRef(null);
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const [isDragging, setIsDragging] = useState(false);
  const [scrollState, setScrollState] = useState({
    canScrollLeft: false,
    canScrollRight: false,
    hasOverflow: false
  });

  const updateScrollState = useCallback(() => {
    const el = stripRef.current;
    if (!el) return;
    const bounds = calculateScrollBounds(el.scrollLeft, el.scrollWidth, el.clientWidth);
    setScrollState((prev) => {
      if (
        prev.canScrollLeft === bounds.canScrollLeft &&
        prev.canScrollRight === bounds.canScrollRight &&
        prev.hasOverflow === bounds.hasOverflow
      ) {
        return prev;
      }
      return bounds;
    });
  }, []);

  // Sync scroll bounds on resize, scroll, and content changes
  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState, { passive: true });

    let ro = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => updateScrollState());
      ro.observe(el);
    }

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
      if (ro) ro.disconnect();
    };
  }, [updateScrollState]);

  // Support mouse wheel horizontal scrolling
  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      if (Math.abs(e.deltaY) >= Math.abs(e.deltaX) && e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // Auto-center the active question badge in view
  useEffect(() => {
    if (activeNumber === null || activeNumber === undefined || !stripRef.current) return;
    const el = stripRef.current;
    const badge = el.querySelector(`#ielts-badge-${activeNumber}`);
    if (badge) {
      const maxScroll = el.scrollWidth - el.clientWidth;
      const target = calculateCenteredScrollPosition(badge.offsetLeft, badge.offsetWidth, el.clientWidth, maxScroll);
      el.scrollTo({ left: target, behavior: "smooth" });
    }
  }, [activeNumber]);

  // Handle pointer drag-to-scroll
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    const el = stripRef.current;
    if (!el) return;

    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX;
    scrollLeftRef.current = el.scrollLeft;
    setIsDragging(true);

    const handleMouseMove = (moveEvent) => {
      if (!isDraggingRef.current) return;
      const distance = moveEvent.pageX - startXRef.current;
      if (shouldPreventClickAfterDrag(distance, 5)) {
        hasDraggedRef.current = true;
      }
      const maxScroll = el.scrollWidth - el.clientWidth;
      el.scrollLeft = calculateDragScroll(scrollLeftRef.current, startXRef.current, moveEvent.pageX, maxScroll);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      setIsDragging(false);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      setTimeout(() => {
        hasDraggedRef.current = false;
      }, 60);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleScrollStep = (direction) => {
    const el = stripRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const target = calculateStepScroll(el.scrollLeft, direction, 180, maxScroll);
    el.scrollTo({ left: target, behavior: "smooth" });
  };

  const handlePartClick = (grp) => {
    if (onSelectPart) {
      onSelectPart(grp.partNumber);
    }
    const el = stripRef.current;
    if (el) {
      const firstNum = grp.range[0];
      const badge = el.querySelector(`#ielts-badge-${firstNum}`);
      if (badge) {
        const maxScroll = el.scrollWidth - el.clientWidth;
        const target = calculateCenteredScrollPosition(badge.offsetLeft, badge.offsetWidth, el.clientWidth, maxScroll);
        el.scrollTo({ left: target, behavior: "smooth" });
      }
    }
  };

  const handleClick = (n, targetPart) => {
    if (hasDraggedRef.current) {
      return;
    }
    if (onSelectPart && targetPart && targetPart !== activePart) {
      onSelectPart(targetPart);
    }
    if (onSelectQuestion) {
      onSelectQuestion(n);
    }
    setTimeout(() => {
      const elem = document.getElementById(`ielts-q-${n}`);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      scrollToEvidenceMark(n);
    }, 50);
  };

  const groups =
    skill === "reading"
      ? [
          { partNumber: 1, label: "Part 1", range: [1, 13] },
          { partNumber: 2, label: "Part 2", range: [14, 26] },
          { partNumber: 3, label: "Part 3", range: [27, 40] }
        ]
      : [
          { partNumber: 1, label: "Part 1", range: [1, 10] },
          { partNumber: 2, label: "Part 2", range: [11, 20], hasMap: true },
          { partNumber: 3, label: "Part 3", range: [21, 30] },
          { partNumber: 4, label: "Part 4", range: [31, 40] }
        ];

  return (
    <div className={`ielts-top-palette-bar ${className}`}>
      {/* Left: Quick Part Switcher Pills */}
      <div className="ielts-top-palette-parts">
        {groups.map((grp) => {
          const isActive = activePart === grp.partNumber;
          const [start, end] = grp.range;
          let count = 0;
          for (let i = start; i <= end; i++) {
            if (isQuestionAnswered(answers, i)) count++;
          }
          const totalInGroup = end - start + 1;

          return (
            <button
              key={grp.partNumber}
              type="button"
              className={`ielts-top-part-chip ${isActive ? "active" : ""}`}
              onClick={() => handlePartClick(grp)}
              title={`Chuyển đến ${grp.label} (Câu ${start}-${end})`}
            >
              <span className="ielts-chip-name">{grp.label}</span>
              {grp.hasMap && <MapPin className="w-3 h-3 inline ml-1 text-primary" />}
              <span className={`ielts-chip-count ${count === totalInGroup ? "done" : ""}`}>
                {count}/{totalInGroup}
              </span>
            </button>
          );
        })}
      </div>

      {/* Middle: Draggable Question Strip with Step Navigation Buttons */}
      <div className="ielts-top-palette-strip-wrapper">
        {scrollState.hasOverflow && (
          <button
            type="button"
            className="ielts-palette-scroll-btn left"
            onClick={() => handleScrollStep("left")}
            disabled={!scrollState.canScrollLeft}
            title="Cuộn sang trái"
            aria-label="Cuộn sang trái"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        )}

        <div
          ref={stripRef}
          className={`ielts-top-palette-strip ${isDragging ? "is-dragging" : ""}`}
          onMouseDown={handleMouseDown}
        >
          {groups.map((grp, gIdx) => {
            const groupNums = numbers.filter(
              (n) => n >= grp.range[0] && n <= grp.range[1]
            );

            return (
              <div key={grp.partNumber} className="ielts-top-palette-group">
                {gIdx > 0 && <div className="ielts-palette-divider-v" />}
                <div className="ielts-palette-badges-row">
                  {groupNums.map((n) => {
                    const answered = isQuestionAnswered(answers, n);
                    const isCurrent = activeNumber === n;
                    const evalResult = evaluation ? evaluation[n] : null;

                    let statusClass = "unanswered";
                    if (evaluation) {
                      statusClass = evalResult?.isCorrect ? "correct" : "incorrect";
                    } else if (answered) {
                      statusClass = "answered glowing";
                    }

                    return (
                      <button
                        key={n}
                        id={`ielts-badge-${n}`}
                        type="button"
                        className={`ielts-palette-badge ${statusClass} ${isCurrent ? "current" : ""}`}
                        onClick={() => handleClick(n, grp.partNumber)}
                        title={`Câu ${n}: ${answered ? "Đã điền" : "Chưa điền"}`}
                      >
                        {n}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {scrollState.hasOverflow && (
          <button
            type="button"
            className="ielts-palette-scroll-btn right"
            onClick={() => handleScrollStep("right")}
            disabled={!scrollState.canScrollRight}
            title="Cuộn sang phải"
            aria-label="Cuộn sang phải"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Right: Answered Progress Summary */}
      <div className="ielts-top-palette-summary">
        <span className="ielts-summary-text">
          Đã làm: <strong>{answeredCount}</strong>/{totalQuestions}
        </span>
        <div className="ielts-summary-progress">
          <div
            className="ielts-summary-fill"
            style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
