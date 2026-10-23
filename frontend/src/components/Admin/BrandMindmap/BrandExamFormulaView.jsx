import React from "react";
import { BRAND_PART_6 } from "../../../data/brandMindmap/part6.js";
import { CheckCircle2, AlertCircle, FileText, BookOpen } from "../../Icons";

export const BrandExamFormulaView = () => {
  const { quickTable, essayFormula } = BRAND_PART_6;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* 4 Mandatory Rules Card */}
      <div
        style={{
          padding: "16px",
          borderRadius: "12px",
          background: "linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(245, 158, 11, 0.08))",
          border: "1px solid rgba(239, 68, 68, 0.25)",
        }}
      >
        <h4
          style={{
            margin: "0 0 10px 0",
            fontSize: "0.95rem",
            fontWeight: 800,
            color: "#ef4444",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <AlertCircle size={16} />
          <span>Lưu Ý Cực Kỳ Quan Trọng Đối Với Các Câu Có Số Lượng Cố Định</span>
        </h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "8px" }}>
          {essayFormula.mandatoryQuantities.map((item, idx) => (
            <div
              key={idx}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                fontSize: "0.78rem",
                lineHeight: 1.45,
              }}
            >
              <span style={{ fontWeight: 800, color: "var(--primary)" }}>{item.question}: </span>
              <span style={{ color: "var(--text-secondary)" }}>{item.rule}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Essay Writing Formula */}
      <div className="brand-mindmap-part-section" style={{ padding: "16px" }}>
        <h3
          style={{
            margin: "0 0 12px 0",
            fontSize: "0.98rem",
            fontWeight: 800,
            color: "var(--text-primary)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <FileText size={16} style={{ color: "var(--primary)" }} />
          <span>Công Thức 3 Bước Triển Khai Câu Tự Luận</span>
        </h3>
        <div className="brand-mindmap-formula-grid">
          {essayFormula.steps.map((st, i) => (
            <div key={i} className="brand-mindmap-step-card">
              <div className="brand-mindmap-step-badge">
                Bước {i + 1}: {st.step}
              </div>
              <p className="brand-mindmap-step-text">{st.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 18 Questions Quick Cheat Table */}
      <div className="brand-mindmap-part-section" style={{ padding: "16px" }}>
        <h3
          style={{
            margin: "0 0 12px 0",
            fontSize: "0.98rem",
            fontWeight: 800,
            color: "var(--text-primary)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <BookOpen size={16} style={{ color: "var(--primary)" }} />
          <span>Bảng Ghi Nhớ Nhanh 18 Câu Trọng Tâm (Cheat Sheet)</span>
        </h3>
        <div style={{ overflowX: "auto" }}>
          <table className="brand-mindmap-sheet-table">
            <thead>
              <tr>
                <th style={{ width: "80px" }}>Câu số</th>
                <th>Nội dung cốt lõi phải nhớ</th>
              </tr>
            </thead>
            <tbody>
              {quickTable.map((row) => (
                <tr key={row.num}>
                  <td>
                    <span className="brand-mindmap-qnum-badge">Câu {row.num}</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{row.topic}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
