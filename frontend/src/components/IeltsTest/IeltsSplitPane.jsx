import React, { useState, useEffect, useRef, useCallback } from "react";

/**
 * Resizable Two-Column Split Pane
 * Allows users to adjust the width of the left and right panels by dragging the divider.
 * Double click resets to default ratio (50%).
 */
export const IeltsSplitPane = ({
  leftPane,
  rightPane,
  defaultRatio = 50,
  storageKey = "ielts_split_ratio",
  minRatio = 20,
  maxRatio = 80,
  className = ""
}) => {
  const [splitRatio, setSplitRatio] = useState(() => {
    try {
      if (typeof localStorage !== "undefined" && storageKey) {
        const saved = localStorage.getItem(storageKey);
        if (saved !== null) {
          const parsed = parseFloat(saved);
          if (!isNaN(parsed) && parsed >= minRatio && parsed <= maxRatio) {
            return parsed;
          }
        }
      }
    } catch {
      // Fallback
    }
    return defaultRatio;
  });

  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const splitRatioRef = useRef(splitRatio);

  splitRatioRef.current = splitRatio;

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
    isDraggingRef.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  const handleReset = useCallback(() => {
    setSplitRatio(defaultRatio);
    try {
      if (storageKey) {
        localStorage.setItem(storageKey, defaultRatio.toString());
      }
    } catch {
      // ignore
    }
  }, [defaultRatio, storageKey]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDraggingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width <= 0) return;
      
      const newRatio = ((e.clientX - rect.left) / rect.width) * 100;
      const clamped = Math.min(Math.max(newRatio, minRatio), maxRatio);
      setSplitRatio(clamped);
    };

    const handleMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        setIsDragging(false);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        try {
          if (storageKey) {
            localStorage.setItem(storageKey, splitRatioRef.current.toString());
          }
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [minRatio, maxRatio, storageKey]);

  return (
    <div
      ref={containerRef}
      className={`ielts-split-container ${isDragging ? "is-resizing" : ""} ${className}`}
    >
      {/* Left Column */}
      <div
        className="ielts-split-pane ielts-split-left"
        style={{ flex: `0 0 calc(${splitRatio}% - 6px)` }}
      >
        {leftPane}
      </div>

      {/* Draggable Divider */}
      <div
        className={`ielts-split-divider ${isDragging ? "active" : ""}`}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleReset}
        title="Kéo để thay đổi độ rộng 2 bên (Nhấp đúp để đặt lại 50/50)"
      >
        <div className="ielts-divider-line" />
        <div className="ielts-divider-handle">
          <span className="ielts-divider-dots">⋮</span>
        </div>
      </div>

      {/* Right Column */}
      <div
        className="ielts-split-pane ielts-split-right"
        style={{ flex: `0 0 calc(${100 - splitRatio}% - 6px)` }}
      >
        {rightPane}
      </div>

      {/* Drag overlay shield to prevent mouse capture by iframes/inputs */}
      {isDragging && <div className="ielts-split-drag-overlay" />}
    </div>
  );
};

