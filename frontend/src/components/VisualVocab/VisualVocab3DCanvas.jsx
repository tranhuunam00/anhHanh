import React, { useState, useRef, useCallback } from "react";
import { ZoomIn, ZoomOut, RotateCcw, Sparkles } from "../Icons";
import { getZoomTransformStyle } from "../../utils/visualVocabUtils";
import "./VisualVocab3D.css";

export const VisualVocab3DCanvas = ({
  topic,
  items = [],
  activeItemId = null,
  onSelectHotspot,
  showLabels = true,
  mode = "EXPLORE",
  quizFeedback = null,
  masteredIds = null,
}) => {
  const isExplore = mode === "EXPLORE";
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });

  // 3D Tilt State
  const [is3DMode, setIs3DMode] = useState(true);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  const containerRef = useRef(null);

  const handleZoomIn = () => setScale((s) => Math.min(3, +(s + 0.25).toFixed(2)));
  const handleZoomOut = () => setScale((s) => Math.max(0.75, +(s - 0.25).toFixed(2)));
  const handleResetZoom = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  };

  // Drag Pan Handlers
  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0 || scale <= 1) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { ...pan };
  }, [scale, pan]);

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setPan({
        x: panStartRef.current.x + dx,
        y: panStartRef.current.y + dy,
      });
      return;
    }

    // 3D Parallax Tilt calculation when not dragging
    if (!is3DMode || scale > 1.2) return;
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const normX = (mouseX / rect.width) * 2 - 1; // -1 to +1
    const normY = (mouseY / rect.height) * 2 - 1;

    setTilt({
      rotateX: +(normY * -10).toFixed(2), // Tilt up/down
      rotateY: +(normX * 12).toFixed(2),  // Tilt left/right
      glareX: +((mouseX / rect.width) * 100).toFixed(1),
      glareY: +((mouseY / rect.height) * 100).toFixed(1),
    });
  }, [isDragging, is3DMode, scale]);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
    // Smooth reset tilt
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Base pan/zoom transform
  const baseTransform = getZoomTransformStyle(scale, pan.x, pan.y);

  // 3D perspective transform
  const perspective3DStyle = is3DMode
    ? {
        transform: `${baseTransform.transform} perspective(1200px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
        transformStyle: "preserve-3d",
        transition: isDragging ? "none" : "transform 0.16s ease-out",
      }
    : baseTransform;

  return (
    <div className="vv-canvas-wrapper vv-3d-wrapper">
      <div
        ref={containerRef}
        className={`vv-canvas-viewport vv-3d-viewport ${isDragging ? "dragging" : ""} ${is3DMode ? "mode-3d-active" : ""}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div className="vv-image-layer-container vv-3d-scene-container" style={perspective3DStyle}>
          {/* Main 3D Illustrated Ocean Map (100% Solid & High-Fidelity) */}
          <img
            src={topic.image || "/images/visual_vocab/ocean_marine_map.jpg"}
            alt={topic.title}
            className="vv-diagram-image vv-3d-base-layer"
            draggable={false}
          />

          {/* Dynamic 3D Glare Light overlay */}
          {is3DMode && (
            <div
              className="vv-3d-glare"
              style={{
                background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0) 65%)`,
              }}
            />
          )}

          {/* Hotspot Pins Layer (Elevated in 3D Space) */}
          {items.map((item, idx) => {
            const isActive = item.id === activeItemId;
            const isMastered = masteredIds
              ? masteredIds.has
                ? masteredIds.has(item.id)
                : masteredIds.includes(item.id)
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
                className={`vv-hotspot-pin vv-3d-pin ${isActive ? "active" : ""} ${feedbackClass.trim()}`}
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  transform: `translate(-50%, -50%) translateZ(${isActive ? "45px" : "25px"})`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectHotspot(item);
                }}
                title={isExplore ? `${item.word} (${item.meaning})` : `Điểm ghim #${idx + 1}`}
              >
                <div className="vv-pin-dot">{dotContent}</div>

                {/* Floating Word Label - ONLY in Explore mode */}
                {isExplore && (showLabels || isActive) && (
                  <div className="vv-hotspot-label vv-3d-label">
                    <span>{item.word}</span>
                    {item.ipa && <span className="vv-ipa">{item.ipa}</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 3D Mode Badge Indicator */}
        <div className="vv-3d-badge">
          <Sparkles size={14} color="#0284c7" />
          <span>Sa bàn 3D Phối Cảnh</span>
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
          <button
            type="button"
            className={is3DMode ? "active-3d-btn" : ""}
            onClick={() => setIs3DMode((v) => !v)}
            title={is3DMode ? "Tắt phối cảnh 3D" : "Bật phối cảnh 3D"}
          >
            <span style={{ fontSize: "0.72rem", fontWeight: 800 }}>3D</span>
          </button>
          <button type="button" onClick={handleResetZoom} title="Mặc định">
            <RotateCcw size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
