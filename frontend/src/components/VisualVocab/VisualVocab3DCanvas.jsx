import React, { useRef, useEffect, useState, useCallback } from "react";
import * as THREE from "three";
import { ZoomIn, ZoomOut, RotateCcw, Sparkles } from "../Icons";
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
}) => {
  const isExplore = mode === "EXPLORE";
  const containerRef = useRef(null);
  const mountRef = useRef(null);

  // Screen positions of 3D pins: { [id]: { x: number, y: number, visible: boolean } }
  const [pinScreenCoords, setPinScreenCoords] = useState({});
  const [isAutoRotate, setIsAutoRotate] = useState(false);

  // Orbit state refs
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });

  // Camera spherical coordinates (azimuth, elevation, distance)
  const orbitRef = useRef({
    radius: 34,
    theta: Math.PI / 4, // Azimuth angle
    phi: Math.PI / 3.2, // Elevation angle
    target: new THREE.Vector3(0, 1.5, 2),
    targetTarget: new THREE.Vector3(0, 1.5, 2),
    targetRadius: 34,
  });

  // Camera smooth fly-to when active item changes
  useEffect(() => {
    if (!activeItemId || !items) return;
    const targetItem = items.find((it) => it.id === activeItemId);
    if (!targetItem || !targetItem.pos3d) return;

    const [px, py, pz] = targetItem.pos3d;
    orbitRef.current.targetTarget.set(px, py + 0.5, pz);

    if (targetItem.cameraOffset) {
      orbitRef.current.targetRadius = 20; // Zoom in slightly on the focused object
    }
  }, [activeItemId, items]);

  // Setup Three.js Scene, Camera, Renderer, & Animation Loop
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 150);
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

    let animationFrameId;
    let clock = new THREE.Clock();

    const renderLoop = () => {
      animationFrameId = requestAnimationFrame(renderLoop);
      const elapsed = clock.getElapsedTime();

      // Update animated elements (waves, lighthouse beam, dolphins, seagulls, etc.)
      sceneHandle.update(elapsed);

      // Auto-rotation when idle
      if (isAutoRotate && !isDraggingRef.current) {
        orbitRef.current.theta += 0.003;
      }

      // Smooth camera position interpolation
      const orbit = orbitRef.current;
      orbit.radius += (orbit.targetRadius - orbit.radius) * 0.08;
      orbit.target.lerp(orbit.targetTarget, 0.08);

      // Spherical to Cartesian coordinates
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

  // Mouse & Touch Dragging for Orbit Camera
  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    isDraggingRef.current = true;
    prevMouseRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - prevMouseRef.current.x;
    const deltaY = e.clientY - prevMouseRef.current.y;
    prevMouseRef.current = { x: e.clientX, y: e.clientY };

    const orbit = orbitRef.current;
    orbit.theta -= deltaX * 0.008;
    orbit.phi = Math.max(0.15, Math.min(Math.PI / 2.05, orbit.phi - deltaY * 0.008));
  }, []);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  // Wheel Zoom
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const orbit = orbitRef.current;
    const zoomDelta = e.deltaY * 0.03;
    orbit.targetRadius = Math.max(12, Math.min(60, orbit.targetRadius + zoomDelta));
  }, []);

  const handleZoomIn = () => {
    const orbit = orbitRef.current;
    orbit.targetRadius = Math.max(12, orbit.targetRadius - 6);
  };

  const handleZoomOut = () => {
    const orbit = orbitRef.current;
    orbit.targetRadius = Math.min(60, orbit.targetRadius + 6);
  };

  const handleResetCamera = () => {
    const orbit = orbitRef.current;
    orbit.targetRadius = 34;
    orbit.targetTarget.set(0, 1.5, 2);
    orbit.theta = Math.PI / 4;
    orbit.phi = Math.PI / 3.2;
  };

  return (
    <div className="vv-canvas-wrapper vv-3d-wrapper">
      <div
        ref={containerRef}
        className="vv-canvas-viewport vv-3d-viewport"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* Three.js Canvas Mount */}
        <div ref={mountRef} className="vv-3d-mount" />

        {/* 3D Floating Word Hotspot Pins projected to 2D screen */}
        {items.map((item, idx) => {
          const coords = pinScreenCoords[item.id];
          if (!coords || !coords.visible) return null;

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
                left: `${coords.x}px`,
                top: `${coords.y}px`,
                transform: "translate(-50%, -100%)",
              }}
              onClick={(e) => {
                e.stopPropagation();
                onSelectHotspot(item);
              }}
              title={isExplore ? `${item.word} (${item.meaning})` : `Điểm 3D #${idx + 1}`}
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

        {/* 3D Badge Indicator */}
        <div className="vv-3d-badge">
          <Sparkles size={14} color="#0284c7" />
          <span>Sa bàn 3D Tương Tác</span>
        </div>

        {/* Floating Controls at bottom-right of canvas */}
        <div className="vv-canvas-floating-controls">
          <button type="button" onClick={handleZoomOut} title="Thu nhỏ góc nhìn">
            <ZoomOut size={16} />
          </button>
          <button type="button" onClick={handleZoomIn} title="Phóng to gần vật thể">
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
          <button type="button" onClick={handleResetCamera} title="Đặt lại góc nhìn chuẩn">
            <span style={{ fontSize: "0.74rem", fontWeight: 700 }}>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
