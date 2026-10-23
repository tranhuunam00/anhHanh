import React, { useState, useMemo } from "react";
import {
  BRAND_MINDMAP_PARTS,
  BRAND_PART_6
} from "../../../data/brandMindmap/index.js";
import {
  Network,
  ChevronDown,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  BookOpen,
  Lightbulb,
  Shield,
  CheckCircle2,
  FileText
} from "../../Icons";

export const BrandVisualTreeCanvas = ({ searchQuery = "" }) => {
  // Store expanded node IDs. Default to expanding Root and Parts.
  const [expandedNodes, setExpandedNodes] = useState(() => {
    const init = { root: true };
    BRAND_MINDMAP_PARTS.forEach((p) => {
      init[p.id] = true;
    });
    return init;
  });

  const [zoomLevel, setZoomLevel] = useState(1);

  const toggleNode = (nodeId) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  const handleExpandAll = () => {
    const all = { root: true, "part-6": true };
    BRAND_MINDMAP_PARTS.forEach((p) => {
      all[p.id] = true;
      p.questions.forEach((q) => {
        all[q.id] = true;
        q.branches?.forEach((b, bIdx) => {
          all[`${q.id}-b-${bIdx}`] = true;
        });
      });
    });
    setExpandedNodes(all);
  };

  const handleCollapseToParts = () => {
    const partsOnly = { root: true };
    BRAND_MINDMAP_PARTS.forEach((p) => {
      partsOnly[p.id] = false;
    });
    setExpandedNodes(partsOnly);
  };

  const handleCollapseToRoot = () => {
    setExpandedNodes({ root: true });
  };

  const q = searchQuery.trim().toLowerCase();

  const getBranchBadge = (type) => {
    switch (type) {
      case "concept":
        return { label: "Khái niệm", bg: "rgba(99, 102, 241, 0.15)", color: "#6366f1", icon: BookOpen };
      case "comparison":
        return { label: "So sánh", bg: "rgba(16, 185, 129, 0.15)", color: "#10b981", icon: Shield };
      case "formula":
        return { label: "Mô hình", bg: "rgba(245, 158, 11, 0.15)", color: "#f59e0b", icon: CheckCircle2 };
      case "example":
        return { label: "Ví dụ", bg: "rgba(236, 72, 153, 0.15)", color: "#ec4899", icon: Lightbulb };
      default:
        return { label: "Ý chính", bg: "rgba(99, 102, 241, 0.15)", color: "#6366f1", icon: BookOpen };
    }
  };

  return (
    <div className="brand-mindmap-tree-wrapper">
      {/* Zoom and Controls Toolbar */}
      <div className="brand-mindmap-tree-controls">
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "0.76rem", fontWeight: 700, color: "var(--text-secondary)" }}>
            Thao tác cây:
          </span>
          <button
            type="button"
            className="brand-mindmap-action-btn"
            onClick={handleExpandAll}
            title="Mở toàn bộ tất cả nhánh con"
          >
            Mở bung tất cả
          </button>
          <button
            type="button"
            className="brand-mindmap-action-btn"
            onClick={handleCollapseToParts}
            title="Thu về 6 Phần lớn"
          >
            Thu về 6 Phần
          </button>
          <button
            type="button"
            className="brand-mindmap-action-btn"
            onClick={handleCollapseToRoot}
            title="Thu gọn về nút Gốc"
          >
            Thu về Gốc
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <button
            type="button"
            className="brand-mindmap-action-btn"
            onClick={() => setZoomLevel((z) => Math.max(0.65, z - 0.1))}
            title="Thu nhỏ cây"
          >
            <ZoomOut size={13} />
          </button>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, minWidth: "42px", textAlign: "center" }}>
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            type="button"
            className="brand-mindmap-action-btn"
            onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
            title="Phóng to cây"
          >
            <ZoomIn size={13} />
          </button>
          <button
            type="button"
            className="brand-mindmap-action-btn"
            onClick={() => setZoomLevel(1)}
            title="Đặt lại 100%"
          >
            <RotateCw size={12} />
          </button>
        </div>
      </div>

      {/* Interactive Mindmap Tree Container */}
      <div className="brand-mindmap-canvas-viewport">
        <div
          className="brand-mindmap-interactive-tree"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: "top left" }}
        >
          {/* LEVEL 0: ROOT NODE */}
          <div className="tree-node-group root-group">
            <div
              className={`tree-node-pill root-pill ${expandedNodes.root ? "is-expanded" : ""}`}
              onClick={() => toggleNode("root")}
            >
              <span className="tree-node-toggle-btn">
                {expandedNodes.root ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </span>
              <Network size={16} style={{ color: "#fff" }} />
              <span className="tree-node-label" style={{ fontWeight: 800 }}>
                XÂY DỰNG THƯƠNG HIỆU (18 CÂU)
              </span>
              <span className="tree-node-count-badge">6 Phần</span>
            </div>

            {/* LEVEL 1: PARTS */}
            {expandedNodes.root && (
              <div className="tree-children-container">
                {BRAND_MINDMAP_PARTS.map((part) => {
                  const isPartOpen = expandedNodes[part.id] ?? false;
                  return (
                    <div key={part.id} className="tree-node-group part-group">
                      <div
                        className={`tree-node-pill part-pill ${isPartOpen ? "is-expanded" : ""}`}
                        style={{ borderLeftColor: part.color }}
                        onClick={() => toggleNode(part.id)}
                      >
                        <span className="tree-node-toggle-btn">
                          {isPartOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                        </span>
                        <span
                          className="tree-part-tag"
                          style={{ backgroundColor: part.badgeBg, color: part.color }}
                        >
                          {part.partNumber}
                        </span>
                        <span className="tree-node-label">{part.title}</span>
                        <span className="tree-node-count-badge">{part.questions.length} câu</span>
                      </div>

                      {/* LEVEL 2: QUESTIONS */}
                      {isPartOpen && (
                        <div className="tree-children-container">
                          {part.questions.map((question) => {
                            const isQOpen = expandedNodes[question.id] ?? false;
                            const hasMatch = q && (
                              question.title.toLowerCase().includes(q) ||
                              question.summary.toLowerCase().includes(q)
                            );
                            return (
                              <div key={question.id} className="tree-node-group question-group">
                                <div
                                  className={`tree-node-pill question-pill ${isQOpen ? "is-expanded" : ""} ${hasMatch ? "highlight-match" : ""}`}
                                  onClick={() => toggleNode(question.id)}
                                >
                                  <span className="tree-node-toggle-btn">
                                    {isQOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                  </span>
                                  <span className="tree-qnum-tag">{question.number}</span>
                                  <span className="tree-node-label">{question.title}</span>
                                  <span className="tree-node-count-badge">
                                    {question.branches?.length || 0} nhánh
                                  </span>
                                </div>

                                {/* LEVEL 3: BRANCHES */}
                                {isQOpen && question.branches && (
                                  <div className="tree-children-container">
                                    {question.branches.map((branch, bIdx) => {
                                      const branchKey = `${question.id}-b-${bIdx}`;
                                      const isBranchOpen = expandedNodes[branchKey] ?? true;
                                      const badgeInfo = getBranchBadge(branch.type);
                                      const TagIcon = badgeInfo.icon;
                                      return (
                                        <div key={bIdx} className="tree-node-group branch-group">
                                          <div
                                            className={`tree-node-pill branch-pill ${isBranchOpen ? "is-expanded" : ""}`}
                                            onClick={() => toggleNode(branchKey)}
                                          >
                                            <span className="tree-node-toggle-btn">
                                              {isBranchOpen ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                                            </span>
                                            <TagIcon size={12} style={{ color: badgeInfo.color }} />
                                            <span className="tree-node-label">{branch.title}</span>
                                            <span
                                              className="tree-branch-badge"
                                              style={{ backgroundColor: badgeInfo.bg, color: badgeInfo.color }}
                                            >
                                              {badgeInfo.label}
                                            </span>
                                          </div>

                                          {/* LEVEL 4: DETAILS & BULLETS */}
                                          {isBranchOpen && branch.items && (
                                            <div className="tree-children-container details-container">
                                              {branch.items.map((it, itemIdx) => (
                                                <div key={itemIdx} className="tree-detail-leaf">
                                                  <span className="tree-leaf-bullet" style={{ background: part.color }} />
                                                  <span className="tree-leaf-text">{it}</span>
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* PART VI: EXAM & CHEAT SHEET */}
                <div className="tree-node-group part-group">
                  <div
                    className={`tree-node-pill part-pill ${expandedNodes["part-6"] ? "is-expanded" : ""}`}
                    style={{ borderLeftColor: BRAND_PART_6.color }}
                    onClick={() => toggleNode("part-6")}
                  >
                    <span className="tree-node-toggle-btn">
                      {expandedNodes["part-6"] ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                    </span>
                    <span
                      className="tree-part-tag"
                      style={{ backgroundColor: BRAND_PART_6.badgeBg, color: BRAND_PART_6.color }}
                    >
                      {BRAND_PART_6.partNumber}
                    </span>
                    <span className="tree-node-label">{BRAND_PART_6.title}</span>
                    <span className="tree-node-count-badge">Công thức thi</span>
                  </div>

                  {expandedNodes["part-6"] && (
                    <div className="tree-children-container">
                      <div className="tree-node-group branch-group">
                        <div className="tree-node-pill branch-pill is-expanded">
                          <FileText size={12} style={{ color: BRAND_PART_6.color }} />
                          <span className="tree-node-label">3 Bước triển khai câu tự luận</span>
                        </div>
                        <div className="tree-children-container details-container">
                          {BRAND_PART_6.essayFormula.steps.map((st, i) => (
                            <div key={i} className="tree-detail-leaf">
                              <span className="tree-leaf-bullet" style={{ background: BRAND_PART_6.color }} />
                              <span className="tree-leaf-text">
                                <strong>Bước {i + 1} ({st.step}):</strong> {st.desc}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
