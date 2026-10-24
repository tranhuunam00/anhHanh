import React, { useState, useRef, useCallback } from "react";
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2 } from "../Icons";
import { getZoomTransformStyle } from "../../utils/visualVocabUtils";

export const VisualVocabCanvas = ({
  topic,
  items = [],
  activeItemId = null,
  onSelectHotspot,
  showLabels = true,
  mode = "EXPLORE",
  // Quiz states
  quizFeedback = null, // { clickedId, correctId, isCorrect }
  masteredIds = null, // Set or Array of mastered word IDs
}) => {
  const isExplore = mode === "EXPLORE";
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });

  const handleZoomIn = () => setScale((s) => Math.min(3, +(s + 0.25).toFixed(2)));
  const handleZoomOut = () => setScale((s) => Math.max(0.75, +(s - 0.25).toFixed(2)));
  const handleResetZoom = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { ...pan };
  }, [pan]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPan({
      x: panStartRef.current.x + dx,
      y: panStartRef.current.y + dy,
    });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((e) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    setIsDragging(true);
    dragStartRef.current = { x: touch.clientX, y: touch.clientY };
    panStartRef.current = { ...pan };
  }, [pan]);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const dx = touch.clientX - dragStartRef.current.x;
    const dy = touch.clientY - dragStartRef.current.y;
    setPan({
      x: panStartRef.current.x + dx,
      y: panStartRef.current.y + dy,
    });
  }, [isDragging]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const transformStyle = getZoomTransformStyle(scale, pan.x, pan.y);

  return (
    <div className={`vv-canvas-wrapper ${isFullscreen ? "is-fullscreen" : ""}`}>
      <div
        className={`vv-canvas-viewport ${isDragging ? "dragging" : ""}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        <div className="vv-image-layer-container" style={transformStyle}>
          {/* Main Diagram Illustration */}
          <img
            src={topic.image}
            alt={topic.title}
            className="vv-diagram-image"
            draggable={false}
          />

          {/* Hotspot Pins Layer */}
          {items.map((item, idx) => {
            const isActive = item.id === activeItemId;
            const isMastered = masteredIds
              ? (masteredIds.has ? masteredIds.has(item.id) : masteredIds.includes(item.id))
              : false;

            let feedbackClass = "";
            let dotContent = idx + 1;

            if (isMastered) {
              feedbackClass += " mastered";
              dotContent = "✓";
            }

            if (quizFeedback) {
              if (quizFeedback.clickedId === item.id) {
                if (quizFeedback.isCorrect) {
                  feedbackClass += " correct";
                  dotContent = "✓";
                } else {
                  feedbackClass += " wrong";
                  dotContent = "✕";
                }
              } else if (!quizFeedback.isCorrect && quizFeedback.correctId === item.id) {
                feedbackClass += " hint-pulse";
              }
            }

            return (
              <div
                key={item.id}
                className={`vv-hotspot-pin ${isActive ? "active" : ""} ${feedbackClass.trim()}`}
                style={{ left: `${item.x}%`, top: `${item.y}%` }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectHotspot(item);
                }}
                title={isExplore ? `${item.word} (${item.meaning})` : `Điểm ghim #${idx + 1}`}
              >
                <div className="vv-pin-dot">{dotContent}</div>

                {/* Floating Word Label - ONLY in Explore mode */}
                {isExplore && (showLabels || isActive) && (
                  <div className="vv-hotspot-label">
                    <span>{item.word}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Floating Controls at bottom-right of canvas */}
        <div className="vv-canvas-floating-controls">
          <button type="button" onClick={handleZoomOut} title="Thu nhỏ">
            <ZoomOut size={16} />
          </button>
          <span className="vv-zoom-indicator">{Math.round(scale * 100)}%</span>
          <button type="button" onClick={handleZoomIn} title="Phóng to">
            <ZoomIn size={16} />
          </button>
          <button type="button" onClick={handleResetZoom} title="Mặc định">
            <RotateCcw size={15} />
          </button>
          <button
            type="button"
            className="vv-btn-fullscreen"
            onClick={() => {
              setIsFullscreen((f) => !f);
              if (!isFullscreen && scale <= 1) {
                setScale(1.25);
              }
            }}
            title={isFullscreen ? "Thu nhỏ lại" : "Phóng to toàn màn hình"}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};
