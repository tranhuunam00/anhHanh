import React, { useState } from "react";
import { ChevronDown, ChevronUp, BookOpen, Lightbulb, CheckCircle2, Shield } from "../../Icons";

export const BrandMindmapNode = ({ question, isExpanded: propIsExpanded, borderLeftColor = "#6366f1" }) => {
  const [isExpanded, setIsExpanded] = useState(propIsExpanded || false);

  // Sync prop changes if user clicks expand all / collapse all
  React.useEffect(() => {
    setIsExpanded(propIsExpanded);
  }, [propIsExpanded]);

  const getTypeLabel = (type) => {
    switch (type) {
      case "concept":
        return { label: "Khái niệm", class: "brand-mindmap-type-concept", icon: BookOpen };
      case "comparison":
        return { label: "So sánh", class: "brand-mindmap-type-comparison", icon: Shield };
      case "formula":
        return { label: "Mô hình / Quy tắc", class: "brand-mindmap-type-formula", icon: CheckCircle2 };
      case "example":
        return { label: "Ví dụ thực tiễn", class: "brand-mindmap-type-example", icon: Lightbulb };
      default:
        return { label: "Nội dung", class: "brand-mindmap-type-concept", icon: BookOpen };
    }
  };

  return (
    <div className="brand-mindmap-qnode">
      {/* Question Header */}
      <div className="brand-mindmap-qnode-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div style={{ flex: 1 }}>
          <div className="brand-mindmap-qnode-meta">
            <span className="brand-mindmap-qnum-badge">{question.number}</span>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
              {question.branches?.length || 0} nhánh nội dung
            </span>
          </div>
          <h4 className="brand-mindmap-qnode-title">{question.title}</h4>
          {question.summary && <p className="brand-mindmap-qnode-summary">{question.summary}</p>}
        </div>
        <div className="brand-mindmap-toggle-icon">
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {/* Expandable Branches */}
      {isExpanded && question.branches && question.branches.length > 0 && (
        <div className="brand-mindmap-branches">
          {question.branches.map((branch, idx) => {
            const meta = getTypeLabel(branch.type);
            const TagIcon = meta.icon;
            return (
              <div
                key={idx}
                className="brand-mindmap-branch-item"
                style={{ borderLeftColor }}
              >
                <div className="brand-mindmap-branch-header">
                  <div className="brand-mindmap-branch-title">
                    <TagIcon size={13} style={{ color: borderLeftColor }} />
                    <span>{branch.title}</span>
                  </div>
                  <span className={`brand-mindmap-type-tag ${meta.class}`}>
                    {meta.label}
                  </span>
                </div>
                {branch.items && branch.items.length > 0 && (
                  <ul className="brand-mindmap-branch-list">
                    {branch.items.map((item, itemIdx) => (
                      <li key={itemIdx}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
