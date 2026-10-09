import React from "react";
import { BookOpen, CheckCircle, IconAlert } from "../Icons";

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
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", borderBottom: "1px solid var(--border-color)", paddingBottom: "16px" }}>
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            background: "rgba(99, 102, 241, 0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--primary)",
          }}
        >
          <BookOpen size={24} />
        </div>
        <div>
          <h2 style={{ margin: "0 0 4px", fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary)" }}>
            Lý thuyết trọng tâm: Unit {unit.unit_number}
          </h2>
          <span style={{ fontSize: "0.92rem", color: "var(--text-secondary)" }}>
            {unit.title}
          </span>
        </div>
      </div>

      {/* Sections List */}
      {sections.map((section, idx) => (
        <div key={section.id || idx} className="b2-theory-section">
          {/* Section Heading */}
          <h3 className="b2-theory-section-title">
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "rgba(99, 102, 241, 0.12)",
                color: "var(--primary)",
                fontSize: "0.85rem",
                fontWeight: 700,
              }}
            >
              {idx + 1}
            </span>
            <span>{section.title}</span>
          </h3>

          {/* 1. Forms / Structure */}
          {(section.forms || section.form) && (
            <div style={{ marginBottom: "18px" }}>
              <div
                style={{
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "8px",
                }}
              >
                Cấu trúc (Form)
              </div>
              <table className="b2-theory-table">
                <tbody>
                  {Object.entries(section.forms || section.form).map(([key, val]) => (
                    <tr key={key}>
                      <td
                        style={{
                          width: "130px",
                          fontWeight: 700,
                          color: "var(--primary)",
                          textTransform: "capitalize",
                          verticalAlign: "top",
                        }}
                      >
                        {key}
                      </td>
                      <td style={{ color: "var(--text-primary)", fontWeight: 500 }}>
                        <code>{val}</code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 2. Rules / Uses & Examples */}
          {(section.rules || section.usages) && (
            <div style={{ marginBottom: "18px" }}>
              <div
                style={{
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "8px",
                }}
              >
                Cách dùng & Ví dụ (Uses & Examples)
              </div>
              <table className="b2-theory-table">
                <thead>
                  <tr>
                    <th style={{ width: "42%" }}>Cách dùng (Use)</th>
                    <th>Ví dụ minh họa (Example)</th>
                  </tr>
                </thead>
                <tbody>
                  {(section.rules || section.usages).map((item, uIdx) => (
                    <tr key={uIdx}>
                      <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                        {item.use || item.rule}
                      </td>
                      <td style={{ color: "var(--text-secondary)", fontStyle: "italic" }}>
                        {item.example}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 3. Vocabulary Categories (for Unit 2) */}
          {section.categories && Array.isArray(section.categories) && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "18px" }}>
              <div
                style={{
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Phân loại từ vựng & ngữ cảnh
              </div>
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

          {/* 4. Watch Out / Helpful Notes */}
          {((section.watch_out && section.watch_out.length > 0) || section.note) && (
            <div
              style={{
                marginTop: "14px",
                padding: "14px 18px",
                borderRadius: "10px",
                background: "rgba(245, 158, 11, 0.08)",
                borderLeft: "4px solid #f59e0b",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, color: "#d97706", fontSize: "0.92rem" }}>
                <IconAlert size={18} />
                <span>Watch Out! (Lưu ý quan trọng từ sách)</span>
              </div>
              {section.note && (
                <div style={{ fontSize: "0.88rem", color: "var(--text-primary)", lineHeight: "1.5" }}>
                  {section.note}
                </div>
              )}
              {section.watch_out &&
                section.watch_out.map((tip, tIdx) => (
                  <div
                    key={tIdx}
                    style={{
                      fontSize: "0.88rem",
                      color: "var(--text-primary)",
                      lineHeight: "1.6",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {tip}
                  </div>
                ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
