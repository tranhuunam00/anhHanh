import React from "react";
import { BookOpen, CheckCircle } from "../Icons";

export const B2TheoryViewer = ({ unit }) => {
  if (!unit || !unit.theory || !unit.theory.sections) {
    return (
      <div className="b2-theory-card">
        <p style={{ color: "var(--text-muted)" }}>Đang tải lý thuyết...</p>
      </div>
    );
  }

  const { sections } = unit.theory;

  return (
    <div className="b2-theory-card">
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <BookOpen size={24} color="var(--primary)" />
        <div>
          <h2 style={{ margin: 0, fontSize: "1.3rem", color: "var(--text-primary)" }}>
            Lý thuyết trọng tâm: Unit {unit.unit_number}
          </h2>
          <span style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>
            {unit.title}
          </span>
        </div>
      </div>

      {sections.map((section, idx) => (
        <div key={idx} className="b2-theory-section">
          <h3 className="b2-theory-section-title">
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                background: "rgba(99, 102, 241, 0.12)",
                color: "var(--primary)",
                fontSize: "0.82rem",
                fontWeight: 700,
              }}
            >
              {idx + 1}
            </span>
            {section.title}
          </h3>

          {/* Form table if exists */}
          {section.form && (
            <div style={{ marginBottom: "14px" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "6px" }}>
                Cấu trúc (Form)
              </div>
              <table className="b2-theory-table">
                <tbody>
                  {Object.entries(section.form).map(([key, val]) => (
                    <tr key={key}>
                      <td style={{ width: "120px", fontWeight: 600, color: "var(--text-primary)" }}>
                        {key.toUpperCase()}
                      </td>
                      <td>
                        <code>{val}</code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Usages / Rules table if exists */}
          {section.usages && Array.isArray(section.usages) && (
            <div style={{ marginBottom: "14px" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "6px" }}>
                Cách dùng & Ví dụ (Uses & Examples)
              </div>
              <table className="b2-theory-table">
                <thead>
                  <tr>
                    <th style={{ width: "40%" }}>Cách dùng</th>
                    <th>Ví dụ minh họa</th>
                  </tr>
                </thead>
                <tbody>
                  {section.usages.map((u, uIdx) => (
                    <tr key={uIdx}>
                      <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{u.use}</td>
                      <td><em>{u.example}</em></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Categories for Vocabulary Units */}
          {section.categories && Array.isArray(section.categories) && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {section.categories.map((cat, cIdx) => (
                <div
                  key={cIdx}
                  style={{
                    background: "var(--bg-secondary)",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <div style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
                    {cat.words || cat.pattern || cat.word}
                  </div>
                  <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "4px" }}>
                    {cat.definition || cat.usage || cat.forms}
                  </div>
                  {cat.example && (
                    <div style={{ fontSize: "0.85rem", color: "var(--primary)", fontStyle: "italic" }}>
                      Ví dụ: {cat.example}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Helpful Note / Watch Out */}
          {section.note && (
            <div
              style={{
                marginTop: "12px",
                padding: "10px 14px",
                borderRadius: "8px",
                background: "rgba(245, 158, 11, 0.08)",
                borderLeft: "3px solid #f59e0b",
                fontSize: "0.88rem",
                color: "var(--text-primary)",
              }}
            >
              <strong>Lưu ý: </strong> {section.note}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
