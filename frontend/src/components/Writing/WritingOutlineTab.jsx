import React, { useState, useMemo } from "react";
import {
  IconBook,
  IconSparkles,
  IconCopy,
  IconCheckCircle,
  IconLightbulb,
  IconFile,
  IconRotate,
  IconPen,
} from "../Icons";
import {
  getStandardOutline,
  formatOutlineAsText,
  formatOutlineAsDraftTemplate,
} from "../../utils/writingOutlineUtils";
import { generateWritingOutline } from "../../services/writingService";

export const WritingOutlineTab = ({
  genre = "ielts_task2",
  subType = "opinion",
  language = "en",
  targetBand = 7.0,
  effectivePromptText = "",
  token,
  isAuthorized = false,
  onInsertTemplate,
  showToast,
}) => {
  const [activeOutlineMode, setActiveOutlineMode] = useState("standard"); // "standard" | "ai_generated"
  const [aiOutline, setAiOutline] = useState(null);
  const [isLoadingAiOutline, setIsLoadingAiOutline] = useState(false);
  const [copiedState, setCopiedState] = useState(false);

  // Dàn bài chuẩn mặc định (100% Tiếng Việt)
  const standardOutline = useMemo(() => {
    return getStandardOutline({ genre, subType, language });
  }, [genre, subType, language]);

  // Dàn bài đang hiển thị
  const currentDisplayOutline = activeOutlineMode === "ai_generated" && aiOutline ? aiOutline : standardOutline;

  // Xử lý tạo dàn ý AI theo đề bài
  const handleGenerateAiOutline = async () => {
    if (!effectivePromptText || !effectivePromptText.trim()) {
      showToast("Vui lòng chọn hoặc nhập đề bài trước khi lập dàn ý AI.", "warning");
      return;
    }

    try {
      setIsLoadingAiOutline(true);
      const res = await generateWritingOutline({
        topic: effectivePromptText,
        genre,
        subType,
        language,
        targetBand,
        token,
      });

      if (res && res.sections && res.sections.length > 0) {
        setAiOutline(res);
        setActiveOutlineMode("ai_generated");
        showToast("Đã lập dàn ý AI chi tiết theo đề bài!", "success");
      } else {
        showToast("Không nhận được dữ liệu dàn ý từ AI, đang dùng dàn bài chuẩn.", "info");
      }
    } catch (e) {
      console.error("Lỗi lập dàn ý AI:", e);
      showToast(e.message || "Không thể lập dàn ý AI lúc này.", "error");
    } finally {
      setIsLoadingAiOutline(false);
    }
  };

  // Sao chép toàn bộ dàn bài dạng text tiếng Việt
  const handleCopyOutline = () => {
    const text = formatOutlineAsText(currentDisplayOutline, effectivePromptText);
    if (!text) return;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
    } else {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }

    setCopiedState(true);
    showToast("Đã sao chép dàn bài vào bộ nhớ tạm!", "success");
    setTimeout(() => setCopiedState(false), 2000);
  };

  // Chèn khung dàn bài vào trình soạn thảo bài viết
  const handleInsertDraft = () => {
    if (typeof onInsertTemplate !== "function") return;
    const template = formatOutlineAsDraftTemplate(currentDisplayOutline, effectivePromptText);
    if (template) {
      onInsertTemplate(template);
      showToast("Đã chèn khung dàn ý vào bài viết!", "success");
    }
  };

  return (
    <div className="writing-outline-tab-container" style={{ padding: "16px 14px", color: "var(--text-primary)" }}>
      {/* Header Toolbar: Mode selector & action buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "8px",
          marginBottom: "14px",
          background: "var(--bg-secondary)",
          padding: "8px 12px",
          borderRadius: "10px",
          border: "1px solid var(--border-color)",
        }}
      >
        {/* Toggle Mode */}
        <div style={{ display: "inline-flex", gap: "4px", background: "var(--bg-card)", padding: "3px", borderRadius: "8px" }}>
          <button
            type="button"
            onClick={() => setActiveOutlineMode("standard")}
            style={{
              padding: "5px 10px",
              fontSize: "0.78rem",
              fontWeight: 700,
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              background: activeOutlineMode === "standard" ? "var(--primary)" : "transparent",
              color: activeOutlineMode === "standard" ? "#ffffff" : "var(--text-muted)",
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              transition: "all 0.15s ease",
            }}
          >
            <IconBook size={13} />
            <span>Dàn bài chuẩn cấu trúc</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (!aiOutline) {
                handleGenerateAiOutline();
              } else {
                setActiveOutlineMode("ai_generated");
              }
            }}
            style={{
              padding: "5px 10px",
              fontSize: "0.78rem",
              fontWeight: 700,
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              background: activeOutlineMode === "ai_generated" ? "var(--primary)" : "transparent",
              color: activeOutlineMode === "ai_generated" ? "#ffffff" : "var(--text-muted)",
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              transition: "all 0.15s ease",
            }}
          >
            <IconSparkles size={13} />
            <span>Dàn bài AI theo đề {aiOutline ? "(Có sẵn)" : ""}</span>
          </button>
        </div>

        {/* Action Buttons: Generate AI, Copy, Insert */}
        <div style={{ display: "inline-flex", gap: "6px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={handleGenerateAiOutline}
            disabled={isLoadingAiOutline || !isAuthorized || !effectivePromptText}
            style={{
              padding: "5px 10px",
              fontSize: "0.75rem",
              fontWeight: 600,
              borderRadius: "6px",
              border: "1px solid rgba(124, 58, 237, 0.35)",
              background: "rgba(124, 58, 237, 0.08)",
              color: "var(--text-primary)",
              cursor: isLoadingAiOutline ? "wait" : "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
            title={effectivePromptText ? "AI phân tích đề này và viết dàn ý chi tiết" : "Vui lòng chọn đề bài trước"}
          >
            {isLoadingAiOutline ? <span className="spinner-xs" /> : <IconSparkles size={13} color="#7c3aed" />}
            <span>{aiOutline ? "Tạo lại dàn ý AI" : "AI Lập dàn ý theo đề"}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyOutline}
            style={{
              padding: "5px 9px",
              fontSize: "0.75rem",
              fontWeight: 600,
              borderRadius: "6px",
              border: "1px solid var(--border-color)",
              background: "var(--bg-card)",
              color: "var(--text-secondary)",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
            title="Sao chép toàn bộ dàn bài để dán vào ghi chú"
          >
            {copiedState ? <IconCheckCircle size={13} color="#10b981" /> : <IconCopy size={13} />}
            <span>{copiedState ? "Đã chép" : "Sao chép"}</span>
          </button>

          <button
            type="button"
            onClick={handleInsertDraft}
            style={{
              padding: "5px 10px",
              fontSize: "0.75rem",
              fontWeight: 700,
              borderRadius: "6px",
              border: "1px solid var(--primary)",
              background: "var(--bg-card)",
              color: "var(--primary)",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
            title="Chèn khung sườn dàn bài trực tiếp vào ô soạn thảo bên trái"
          >
            <IconPen size={12} />
            <span>Chèn vào bài</span>
          </button>
        </div>
      </div>

      {/* Title & Description Box */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "10px",
          padding: "12px 14px",
          marginBottom: "14px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <span style={{ fontSize: "1.1rem" }}>📋</span>
          <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 800, color: "var(--text-primary)" }}>
            {currentDisplayOutline.title}
          </h4>
        </div>
        {currentDisplayOutline.description && (
          <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
            {currentDisplayOutline.description}
          </p>
        )}
      </div>

      {/* Sections List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {currentDisplayOutline.sections &&
          currentDisplayOutline.sections.map((section, sIdx) => {
            const isBodySection = section.id === "body1" || section.id === "body2";

            return (
              <div
                key={section.id || sIdx}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "10px",
                  overflow: "hidden",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                }}
              >
                {/* Section Header */}
                <div
                  style={{
                    background: "var(--bg-secondary)",
                    padding: "9px 14px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid var(--border-color)",
                  }}
                >
                  <strong style={{ fontSize: "0.88rem", color: "var(--text-primary)" }}>
                    {section.name}
                  </strong>
                  {section.wordTarget && (
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "12px",
                        background: "var(--bg-card)",
                        border: "1px solid var(--border-color)",
                        color: "var(--text-muted)",
                      }}
                    >
                      {section.wordTarget}
                    </span>
                  )}
                </div>

                {/* Section Body */}
                <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {/* Task 2 Body: Main Idea, Supporting, Example */}
                  {isBodySection && (section.main_idea || section.supporting || section.example) ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {/* Main Idea */}
                      <div
                        style={{
                          background: "rgba(59, 130, 246, 0.08)",
                          borderLeft: "3px solid #3b82f6",
                          padding: "8px 10px",
                          borderRadius: "0 6px 6px 0",
                        }}
                      >
                        <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#2563eb", marginBottom: "3px" }}>
                          📌 Ý CHÍNH (MAIN IDEA / TOPIC SENTENCE)
                        </div>
                        <div style={{ fontSize: "0.82rem", color: "var(--text-primary)", lineHeight: 1.45 }}>
                          {section.main_idea}
                        </div>
                      </div>

                      {/* Supporting Idea */}
                      <div
                        style={{
                          background: "rgba(16, 185, 129, 0.08)",
                          borderLeft: "3px solid #10b981",
                          padding: "8px 10px",
                          borderRadius: "0 6px 6px 0",
                        }}
                      >
                        <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#059669", marginBottom: "3px" }}>
                          🔍 LUẬN CỨ GIẢI THÍCH (SUPPORTING IDEA / ELABORATION)
                        </div>
                        <div style={{ fontSize: "0.82rem", color: "var(--text-primary)", lineHeight: 1.45 }}>
                          {section.supporting}
                        </div>
                      </div>

                      {/* Example */}
                      <div
                        style={{
                          background: "rgba(245, 158, 11, 0.08)",
                          borderLeft: "3px solid #f59e0b",
                          padding: "8px 10px",
                          borderRadius: "0 6px 6px 0",
                        }}
                      >
                        <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#d97706", marginBottom: "3px" }}>
                          💡 DẪN CHỨNG THỰC TẾ (EXAMPLE / EVIDENCE)
                        </div>
                        <div style={{ fontSize: "0.82rem", color: "var(--text-primary)", lineHeight: 1.45 }}>
                          {section.example}
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {/* Components breakdown (Mở bài, kết bài hoặc dạng khác) */}
                  {Array.isArray(section.components) && section.components.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {section.components.map((c, cIdx) => (
                        <div
                          key={cIdx}
                          style={{
                            padding: "8px 10px",
                            borderRadius: "6px",
                            background: "var(--bg-secondary)",
                            border: "1px solid var(--border-color)",
                          }}
                        >
                          <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "3px" }}>
                            {c.label}
                          </div>
                          {c.guide && (
                            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                              {c.guide}
                            </div>
                          )}
                          {c.content && (
                            <div
                              style={{
                                marginTop: "5px",
                                fontSize: "0.82rem",
                                color: "var(--text-primary)",
                                background: "var(--bg-card)",
                                padding: "6px 8px",
                                borderRadius: "4px",
                                border: "1px dashed var(--border-color)",
                              }}
                            >
                              <strong>Gợi ý:</strong> {c.content}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {/* Language Thinking Guidelines (100% Tiếng Việt) */}
      {currentDisplayOutline.languageGuide && (
        <div
          style={{
            marginTop: "16px",
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            borderRadius: "10px",
            padding: "14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "8px" }}>
            <span style={{ fontSize: "1.1rem" }}>{currentDisplayOutline.languageGuide.flag}</span>
            <strong style={{ fontSize: "0.88rem", color: "var(--text-primary)" }}>
              Lưu Ý Phương Pháp Viết ({currentDisplayOutline.languageGuide.name})
            </strong>
          </div>
          <div style={{ fontSize: "0.8rem", color: "#2563eb", fontWeight: 700, marginBottom: "8px" }}>
            Tư duy: {currentDisplayOutline.languageGuide.thinkingMode}
          </div>
          <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.55 }}>
            {currentDisplayOutline.languageGuide.principles.map((pr, pIdx) => (
              <li key={pIdx} style={{ marginBottom: "4px" }}>
                {pr}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
