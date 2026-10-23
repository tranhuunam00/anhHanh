import React, { useRef, useEffect, useState, useCallback } from "react";
import * as THREE from "three";
import { ZoomIn, ZoomOut, RotateCcw, Volume2 } from "../Icons";
import { playPronunciationAudio } from "../../services/authVocabService";
import { buildOcean3DScene } from "./ocean3dSceneBuilder";
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
  currentLang = "en",
}) => {
  const isExplore = mode === "EXPLORE";
  const containerRef = useRef(null);
  const mountRef = useRef(null);

  // Screen positions of 3D pins: { [id]: { x: number, y: number, visible: boolean } }
  const [pinScreenCoords, setPinScreenCoords] = useState({});
  const [isAutoRotate, setIsAutoRotate] = useState(false);

  // Instant Hover Info Popover state
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoverPopupPos, setHoverPopupPos] = useState({ x: 0, y: 0 });
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Three.js and Orbit state refs
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const sceneHandleRef = useRef(null);
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseNormRef = useRef(new THREE.Vector2());

  // Camera spherical coordinates (azimuth, elevation, distance)
  // Initial wide panoramic view showing all 15 objects comfortably
  const orbitRef = useRef({
    radius: 54,
    theta: Math.PI / 3.6,
    phi: Math.PI / 3.3,
    target: new THREE.Vector3(0, 0, 2),
    targetTarget: new THREE.Vector3(0, 0, 2),
    targetRadius: 54,
  });

  // Camera smooth fly-to when active item changes
  useEffect(() => {
    if (!activeItemId || !items) return;
    const targetItem = items.find((it) => it.id === activeItemId);
    if (!targetItem || !targetItem.pos3d) return;

    const [px, py, pz] = targetItem.pos3d;
    orbitRef.current.targetTarget.set(px, py + 0.5, pz);
    orbitRef.current.targetRadius = 22; // Smooth zoom into focused 3D object
  }, [activeItemId, items]);

  // Audio pronunciation on hover popup
  const handlePlayHoverAudio = (e, word) => {
    e.stopPropagation();
    if (!word || isPlayingAudio) return;
    setIsPlayingAudio(true);
    playPronunciationAudio(word, currentLang || "us")
      .catch((err) => console.warn("TTS error:", err))
      .finally(() => setIsPlayingAudio(false));
  };

  // Setup Three.js Scene, Camera, Renderer, & Animation Loop
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 180);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    if (mountRef.current) {
      mountRef.current.innerHTML = "";
      mountRef.current.appendChild(renderer.domElement);
    }

    // Build the 3D Ocean ecosystem
    const sceneHandle = buildOcean3DScene(scene);
    sceneHandleRef.current = sceneHandle;

    let animationFrameId;
    let clock = new THREE.Clock();

    const renderLoop = () => {
      animationFrameId = requestAnimationFrame(renderLoop);
      const elapsed = clock.getElapsedTime();

      // Update animated 3D elements (waves, lighthouse beam, dolphins, whale spout, etc.)
      sceneHandle.update(elapsed);

      // Auto-rotation when enabled
      if (isAutoRotate && !isDraggingRef.current) {
        orbitRef.current.theta += 0.0025;
      }

      // Smooth camera interpolation (lerp)
      const orbit = orbitRef.current;
      orbit.radius += (orbit.targetRadius - orbit.radius) * 0.08;
      orbit.target.lerp(orbit.targetTarget, 0.08);

      const sinPhi = Math.sin(orbit.phi);
      camera.position.x = orbit.target.x + orbit.radius * sinPhi * Math.sin(orbit.theta);
      camera.position.y = orbit.target.y + orbit.radius * Math.cos(orbit.phi);
      camera.position.z = orbit.target.z + orbit.radius * sinPhi * Math.cos(orbit.theta);
      camera.lookAt(orbit.target);

      renderer.render(scene, camera);

      // Project 3D item coordinates to 2D screen positions for DOM pins
      const coords = {};
      const tempVec = new THREE.Vector3();
      const rect = container.getBoundingClientRect();

      for (const it of items) {
        if (!it.pos3d) continue;
        tempVec.set(it.pos3d[0], it.pos3d[1] + 0.8, it.pos3d[2]);
        tempVec.project(camera);

        const isVisible = tempVec.z < 1.0;
        const screenX = ((tempVec.x + 1) * rect.width) / 2;
        const screenY = ((-tempVec.y + 1) * rect.height) / 2;

        coords[it.id] = {
          x: Math.round(screenX),
          y: Math.round(screenY),
          visible: isVisible,
        };
      }
      setPinScreenCoords(coords);
    };

    renderLoop();

    // Resize Handler
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      sceneHandle.dispose();
      renderer.dispose();
      if (mountRef.current) {
        mountRef.current.innerHTML = "";
      }
    };
  }, [isAutoRotate, items]);

  const clearHoverTimeoutRef = useRef(null);

  // Mouse & Touch Orbit Controls (Smooth drag to view from any angle)
  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    isDraggingRef.current = true;
    prevMouseRef.current = { x: e.clientX, y: e.clientY };
    if (containerRef.current) {
      containerRef.current.style.cursor = "grabbing";
    }
  }, []);

  const handleMouseMove = useCallback((e) => {
    const container = containerRef.current;
    if (!container) return;

    // Raycast on 3D meshes when hovering to detect 3D object directly
    if (!isDraggingRef.current && isExplore && cameraRef.current && sceneHandleRef.current) {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouseNormRef.current.set(normX, normY);

      raycasterRef.current.setFromCamera(mouseNormRef.current, cameraRef.current);
      const hits = raycasterRef.current.intersectObjects(sceneHandleRef.current.interactiveMeshes, true);

      let foundId = null;
      if (hits.length > 0) {
        for (const hit of hits) {
          let curr = hit.object;
          while (curr && !foundId) {
            if (curr.userData?.itemId) {
              foundId = curr.userData.itemId;
            }
            curr = curr.parent;
          }
          if (foundId) break;
        }
      }

      if (foundId) {
        if (clearHoverTimeoutRef.current) {
          clearTimeout(clearHoverTimeoutRef.current);
          clearHoverTimeoutRef.current = null;
        }
        const match = items.find((it) => it.id === foundId);
        if (match) {
          setHoveredItem(match);
          setHoverPopupPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
          container.style.cursor = "pointer";
        }
      } else {
        container.style.cursor = "grab";
        if (!clearHoverTimeoutRef.current) {
          clearHoverTimeoutRef.current = setTimeout(() => {
            setHoveredItem(null);
            clearHoverTimeoutRef.current = null;
          }, 180);
        }
      }
    }

    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - prevMouseRef.current.x;
    const deltaY = e.clientY - prevMouseRef.current.y;
    prevMouseRef.current = { x: e.clientX, y: e.clientY };

    const orbit = orbitRef.current;
    orbit.theta -= deltaX * 0.007;
    orbit.phi = Math.max(0.18, Math.min(Math.PI / 2.05, orbit.phi - deltaY * 0.007));
  }, [isExplore, items]);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    if (containerRef.current) {
      containerRef.current.style.cursor = "grab";
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    isDraggingRef.current = false;
    if (clearHoverTimeoutRef.current) {
      clearTimeout(clearHoverTimeoutRef.current);
      clearHoverTimeoutRef.current = null;
    }
    setHoveredItem(null);
    if (containerRef.current) {
      containerRef.current.style.cursor = "grab";
    }
  }, []);

  // Wheel Zoom
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const orbit = orbitRef.current;
    const zoomDelta = e.deltaY * 0.03;
    orbit.targetRadius = Math.max(14, Math.min(65, orbit.targetRadius + zoomDelta));
  }, []);

  const handleZoomIn = () => {
    const orbit = orbitRef.current;
    orbit.targetRadius = Math.max(14, orbit.targetRadius - 6);
  };

  const handleZoomOut = () => {
    const orbit = orbitRef.current;
    orbit.targetRadius = Math.min(65, orbit.targetRadius + 6);
  };

  const handleResetCamera = () => {
    const orbit = orbitRef.current;
    orbit.targetRadius = 54;
    orbit.targetTarget.set(0, 0, 2);
    orbit.theta = Math.PI / 3.6;
    orbit.phi = Math.PI / 3.3;
  };

  return (
    <div className="vv-canvas-wrapper vv-3d-wrapper">
      <div
        ref={containerRef}
        className={`vv-canvas-viewport vv-3d-viewport ${isDraggingRef.current ? "dragging" : ""}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
      >
        {/* Three.js Canvas Mount */}
        <div ref={mountRef} className="vv-3d-mount" />

        {/* 3D Floating Word Hotspot Pins projected to 2D screen */}
        {items.map((item, idx) => {
          const coords = pinScreenCoords[item.id];
          if (!coords || !coords.visible) return null;

          const isActive = item.id === activeItemId;
          const isHovered = hoveredItem?.id === item.id;
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
              className={`vv-hotspot-pin vv-3d-pin ${isActive ? "active" : ""} ${isHovered ? "hovered" : ""} ${feedbackClass.trim()}`}
              style={{
                left: `${coords.x}px`,
                top: `${coords.y}px`,
                transform: "translate(-50%, -100%)",
              }}
              onMouseEnter={(e) => {
                const container = containerRef.current;
                if (!container) return;
                const rect = container.getBoundingClientRect();
                setHoveredItem(item);
                setHoverPopupPos({ x: coords.x, y: coords.y - 12 });
              }}
              onClick={(e) => {
                e.stopPropagation();
                onSelectHotspot(item);
              }}
              title={isExplore ? `${item.word} (${item.meaning})` : `Điểm 3D #${idx + 1}`}
            >
              <div className="vv-pin-dot">{dotContent}</div>

              {/* Floating Word Label - in Explore mode (Short word only, no IPA to avoid long clutter) */}
              {isExplore && (showLabels || isActive || isHovered) && (
                <div className="vv-hotspot-label vv-3d-label">
                  <span>{item.word}</span>
                </div>
              )}
            </div>
          );
        })}

        {/* INSTANT 3D HOVER INFO CARD (Hover vào thì hiện thông tin luôn) */}
        {isExplore && hoveredItem && (
          <div
            className="vv-3d-hover-card"
            style={{
              left: `${Math.min(Math.max(16, hoverPopupPos.x), (containerRef.current?.clientWidth || 600) - 270)}px`,
              top: `${Math.max(16, hoverPopupPos.y - 170)}px`,
            }}
            onMouseEnter={() => {
              if (clearHoverTimeoutRef.current) {
                clearTimeout(clearHoverTimeoutRef.current);
                clearHoverTimeoutRef.current = null;
              }
              setHoveredItem(hoveredItem);
            }}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={(e) => {
              e.stopPropagation();
              onSelectHotspot(hoveredItem);
            }}
          >
            {hoveredItem.thumbnail && (
              <div className="vv-3d-hover-thumb-container">
                <img src={hoveredItem.thumbnail} alt={hoveredItem.word} className="vv-3d-hover-thumb" />
              </div>
            )}
            <div className="vv-3d-hover-header">
              <div className="vv-3d-hover-word-box">
                <h4 className="vv-3d-hover-word">{hoveredItem.word}</h4>
                {hoveredItem.pos && <span className="vv-3d-hover-pos">{hoveredItem.pos}</span>}
              </div>
              <button
                type="button"
                className="btn-vv-hover-audio"
                onClick={(e) => handlePlayHoverAudio(e, hoveredItem.word)}
                title="Nghe phát âm chuẩn"
              >
                <Volume2 size={15} color="var(--primary)" />
              </button>
            </div>

            {hoveredItem.ipa && (
              <div className="vv-3d-hover-ipa">
                <span>{hoveredItem.pinyin || hoveredItem.ipa}</span>
              </div>
            )}

            {hoveredItem.meaning && (
              <div className="vv-3d-hover-meaning">{hoveredItem.meaning}</div>
            )}

            {hoveredItem.example && (
              <div className="vv-3d-hover-example">"{hoveredItem.example}"</div>
            )}

            <div className="vv-3d-hover-tip">💡 Click để chọn &amp; lưu vào sổ từ vựng</div>
          </div>
        )}

        {/* Floating Controls at bottom-right of canvas */}
        <div className="vv-canvas-floating-controls">
          <button type="button" onClick={handleZoomOut} title="Thu nhỏ">
            <ZoomOut size={16} />
          </button>
          <button type="button" onClick={handleZoomIn} title="Phóng to">
            <ZoomIn size={16} />
          </button>
          <button
            type="button"
            className={isAutoRotate ? "active-3d-btn" : ""}
            onClick={() => setIsAutoRotate((v) => !v)}
            title={isAutoRotate ? "Tắt tự xoay 360" : "Bật tự xoay 360"}
          >
            <RotateCcw size={15} />
          </button>
          <button type="button" onClick={handleResetCamera} title="Đặt lại góc nhìn">
            <span style={{ fontSize: "0.72rem", fontWeight: 700 }}>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
