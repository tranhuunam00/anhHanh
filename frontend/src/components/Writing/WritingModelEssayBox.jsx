import React, { useState, useMemo } from "react";
import { IconSparkles, IconCopy, IconCheckCircle, IconAlert } from "../Icons";

export function WritingModelEssayBox({ modelEssay, minRequiredWords = 150, showToast }) {
  const [copied, setCopied] = useState(false);

  const wordCount = useMemo(() => {
    if (!modelEssay) return 0;
    return modelEssay.trim().split(/\s+/).filter(Boolean).length;
  }, [modelEssay]);

  const isCompliant = wordCount >= minRequiredWords;

  const handleCopy = () => {
    if (!modelEssay) return;
    navigator.clipboard.writeText(modelEssay);
    setCopied(true);
    if (showToast) {
      showToast("Đã sao chép bài viết mẫu Band 8.5+!", "success");
    }
    setTimeout(() => setCopied(false), 2000);
  };

  if (!modelEssay) return null;

  return (
    <div className="section-block model-essay-section">
      <div className="section-title space-between">
        <div className="title-left" style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <IconSparkles size={16} className="text-primary" />
            <span style={{ fontWeight: 700 }}>Bài viết mẫu Band 8.5+ (AI Polished Version)</span>
          </div>
          <span className={`model-word-pill ${isCompliant ? "compliant" : "warning"}`}>
            {isCompliant ? <IconCheckCircle size={12} /> : <IconAlert size={12} />}
            <span>{wordCount} từ {isCompliant ? `• Chuẩn IELTS (≥ ${minRequiredWords} từ)` : `• Cần ≥ ${minRequiredWords} từ`}</span>
          </span>
        </div>
        <button
          type="button"
          className="btn-copy-model"
          onClick={handleCopy}
          title="Sao chép bài viết mẫu vào bộ nhớ tạm"
        >
          <IconCopy size={13} />
          <span>{copied ? "Đã chép" : "Sao chép"}</span>
        </button>
      </div>
      <div className="model-essay-box">
        {modelEssay}
      </div>
    </div>
  );
}

