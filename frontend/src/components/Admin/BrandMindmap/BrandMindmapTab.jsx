import React, { useState, useMemo } from "react";
import { BRAND_MINDMAP_PARTS } from "../../../data/brandMindmap/index.js";
import { BrandMindmapNode } from "./BrandMindmapNode.jsx";
import { BrandExamFormulaView } from "./BrandExamFormulaView.jsx";
import {
  Network,
  Search,
  BookOpen,
  FileText,
  ChevronDown,
  ChevronUp,
  RotateCw,
} from "../../Icons";
import "../../../styles/brand-mindmap.css";

export const BrandMindmapTab = () => {
  const [viewMode, setViewMode] = useState("mindmap"); // 'mindmap' | 'formula'
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPartId, setSelectedPartId] = useState("all");
  const [expandAll, setExpandAll] = useState(false);
  const [collapsedParts, setCollapsedParts] = useState({});

  // Filter parts and questions based on partId and searchQuery
  const filteredParts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return BRAND_MINDMAP_PARTS.filter((part) => {
      if (selectedPartId !== "all" && part.id !== selectedPartId) return false;
      return true;
    }).map((part) => {
      if (!q) return part;
      const matchedQuestions = part.questions.filter((item) => {
        const inTitle = item.title.toLowerCase().includes(q);
        const inSummary = item.summary.toLowerCase().includes(q);
        const inBranches = item.branches?.some(
          (b) =>
            b.title.toLowerCase().includes(q) ||
            b.items?.some((it) => it.toLowerCase().includes(q))
        );
        return inTitle || inSummary || inBranches;
      });
      return {
        ...part,
        questions: matchedQuestions,
      };
    }).filter((part) => part.questions.length > 0);
  }, [searchQuery, selectedPartId]);

  const togglePartCollapse = (partId) => {
    setCollapsedParts((prev) => ({
      ...prev,
      [partId]: !prev[partId],
    }));
  };

  const handleExpandAll = () => {
    setExpandAll(true);
    setCollapsedParts({});
  };

  const handleCollapseAll = () => {
    setExpandAll(false);
    const allCollapsed = {};
    BRAND_MINDMAP_PARTS.forEach((p) => {
      allCollapsed[p.id] = true;
    });
    setCollapsedParts(allCollapsed);
  };

  return (
    <div className="brand-mindmap-wrapper">
      {/* Header Bar */}
      <div className="brand-mindmap-header">
        <div className="brand-mindmap-title">
          <h2>
            <Network size={20} style={{ color: "var(--primary)" }} />
            <span>Sơ Đồ Tư Duy: Xây Dựng Thương Hiệu</span>
          </h2>
          <p>
            Đề cương ôn tập chi tiết 18 câu hỏi cốt lõi – Chuẩn xác 100% theo học liệu chính khóa
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="brand-mindmap-view-switcher">
          <button
            type="button"
            className={`brand-mindmap-view-btn ${viewMode === "mindmap" ? "active" : ""}`}
            onClick={() => setViewMode("mindmap")}
          >
            <Network size={14} />
            <span>Sơ đồ tư duy (18 câu)</span>
          </button>
          <button
            type="button"
            className={`brand-mindmap-view-btn ${viewMode === "formula" ? "active" : ""}`}
            onClick={() => setViewMode("formula")}
          >
            <FileText size={14} />
            <span>Công thức thi & Bảng nhớ</span>
          </button>
        </div>
      </div>

      {viewMode === "formula" ? (
        <BrandExamFormulaView />
      ) : (
        <>
          {/* Toolbar & Filters */}
          <div className="brand-mindmap-toolbar">
            <div className="brand-mindmap-search-row">
              <div style={{ position: "relative", flex: 1, display: "flex", alignItems: "center" }}>
                <Search
                  size={15}
                  style={{
                    position: "absolute",
                    left: 10,
                    color: "var(--text-muted)",
                    pointerEvents: "none",
                  }}
                />
                <input
                  type="text"
                  className="brand-mindmap-search-input"
                  style={{ paddingLeft: "32px" }}
                  placeholder="Tìm kiếm theo từ khóa (VD: vinamilk, 3C, aaker, keller, 131/2025, chin-su, bitis, pop, pod...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    style={{
                      position: "absolute",
                      right: 10,
                      background: "none",
                      border: "none",
                      color: "var(--text-muted)",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>

              <button
                type="button"
                className="brand-mindmap-action-btn"
                onClick={handleExpandAll}
                title="Mở rộng toàn bộ các câu hỏi"
              >
                <ChevronDown size={14} />
                <span>Mở hết</span>
              </button>
              <button
                type="button"
                className="brand-mindmap-action-btn"
                onClick={handleCollapseAll}
                title="Thu gọn toàn bộ"
              >
                <ChevronUp size={14} />
                <span>Thu gọn</span>
              </button>
            </div>

            {/* Filter Pills */}
            <div className="brand-mindmap-filter-pills">
              <button
                type="button"
                className={`brand-mindmap-pill ${selectedPartId === "all" ? "active" : ""}`}
                onClick={() => setSelectedPartId("all")}
              >
                Tất cả (18 câu)
              </button>
              {BRAND_MINDMAP_PARTS.map((part) => (
                <button
                  key={part.id}
                  type="button"
                  className={`brand-mindmap-pill ${selectedPartId === part.id ? "active" : ""}`}
                  onClick={() => setSelectedPartId(part.id)}
                >
                  {part.partNumber} ({part.questions.length})
                </button>
              ))}
            </div>
          </div>

          {/* Tree Sections */}
          <div className="brand-mindmap-tree">
            {filteredParts.length === 0 ? (
              <div
                style={{
                  padding: "40px 20px",
                  textAlign: "center",
                  borderRadius: "12px",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-secondary)",
                }}
              >
                <BookOpen size={32} style={{ marginBottom: 8, opacity: 0.5 }} />
                <p style={{ margin: "0 0 6px 0", fontWeight: 700 }}>
                  Không tìm thấy nội dung phù hợp với "{searchQuery}"
                </p>
                <button
                  type="button"
                  className="brand-mindmap-action-btn"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedPartId("all");
                  }}
                >
                  <RotateCw size={12} />
                  <span>Đặt lại bộ lọc</span>
                </button>
              </div>
            ) : (
              filteredParts.map((part) => {
                const isPartCollapsed = collapsedParts[part.id] || false;
                return (
                  <div key={part.id} className="brand-mindmap-part-section">
                    {/* Part Header */}
                    <div
                      className="brand-mindmap-part-header"
                      onClick={() => togglePartCollapse(part.id)}
                    >
                      <div className="brand-mindmap-part-title-wrap">
                        <span
                          className="brand-mindmap-part-badge"
                          style={{
                            backgroundColor: part.badgeBg,
                            color: part.color,
                          }}
                        >
                          {part.partNumber}
                        </span>
                        <h3 className="brand-mindmap-part-heading">{part.title}</h3>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                          {part.questions.length} câu hỏi
                        </span>
                        {isPartCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                      </div>
                    </div>

                    {/* Questions in Part */}
                    {!isPartCollapsed && (
                      <div className="brand-mindmap-questions-list">
                        {part.questions.map((q) => (
                          <BrandMindmapNode
                            key={q.id}
                            question={q}
                            isExpanded={expandAll}
                            borderLeftColor={part.color}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
};
