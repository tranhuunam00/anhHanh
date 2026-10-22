import React, { useState } from "react";
import { RotateCw, Image as ImageIcon, Lightbulb, Trash2, Check } from "../Icons";
import { fetchImageCandidates } from "../../services/authVocabService";

export const VocabImagePickerField = ({
  word,
  contextSentence = "",
  meaning = "",
  imageUrl,
  setImageUrl,
  imgLoadError,
  setImgLoadError,
  isSearchingImages,
  setIsSearchingImages,
  showToast,
  token,
}) => {
  const [candidates, setCandidates] = useState([]);

  const handleFindAlternativeImages = async () => {
    const clean = (word || "").trim();
    if (!clean) {
      if (showToast) showToast("Vui lòng nhập từ vựng trước", "warning");
      return;
    }

    if (setIsSearchingImages) setIsSearchingImages(true);
    try {
      const results = await fetchImageCandidates(clean, contextSentence, meaning, token);
      if (results && results.length > 0) {
        setCandidates(results);
        const otherImgs = results.filter((c) => c !== imageUrl);
        const nextImg = otherImgs[0] || results[0];
        setImageUrl(nextImg);
        if (setImgLoadError) setImgLoadError(false);
        if (showToast) showToast(`Đã tìm thấy ${results.length} ảnh gợi ý liên quan`, "info");
      } else {
        setCandidates([]);
        if (showToast) showToast("Không tìm thấy ảnh gợi ý phù hợp, bạn có thể để trống", "info");
      }
    } catch (e) {
      if (showToast) showToast("Lỗi khi tìm ảnh gợi ý", "error");
    } finally {
      if (setIsSearchingImages) setIsSearchingImages(false);
    }
  };

  const handleClearImage = () => {
    setImageUrl("");
    setCandidates([]);
    if (setImgLoadError) setImgLoadError(false);
    if (showToast) showToast("Đã bỏ ảnh minh họa cho thẻ từ", "info");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
        <label style={{ fontSize: "0.83rem", fontWeight: 600, color: "var(--text-primary, #1e293b)" }}>
          Link ảnh minh họa (Tùy chọn)
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {imageUrl && (
            <button
              type="button"
              onClick={handleClearImage}
              style={{
                background: "none",
                border: "none",
                color: "#ef4444",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "0.75rem",
                fontWeight: 600,
              }}
              title="Xóa link ảnh hiện tại (không dùng ảnh)"
            >
              <Trash2 size={12} />
              <span>Bỏ ảnh</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleFindAlternativeImages}
            disabled={isSearchingImages || !word.trim()}
            style={{
              background: "none",
              border: "none",
              color: "#0891b2",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
            title="Tìm ảnh minh họa phù hợp theo ngữ cảnh"
          >
            <RotateCw size={12} className={isSearchingImages ? "spinning" : ""} />
            <span>{isSearchingImages ? "Đang tìm..." : "Tìm ảnh gợi ý"}</span>
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "8px",
            border: "1px solid var(--border-color, #cbd5e1)",
            overflow: "hidden",
            flexShrink: 0,
            background: "var(--bg-secondary, #f8fafc)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {imageUrl && !imgLoadError ? (
            <img
              src={imageUrl}
              alt="Preview"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={() => setImgLoadError && setImgLoadError(true)}
            />
          ) : (
            <div style={{ textAlign: "center", color: "#94a3b8" }}>
              <ImageIcon size={20} />
              <div style={{ fontSize: "0.58rem" }}>{imgLoadError ? "Lỗi link" : "Không ảnh"}</div>
            </div>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <input
            type="url"
            className="dict-input"
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid var(--border-color, #e2e8f0)",
              background: "var(--bg-input, #fff)",
              color: "var(--text-primary, #0f172a)",
              fontSize: "0.82rem",
              boxSizing: "border-box",
            }}
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              if (setImgLoadError) setImgLoadError(false);
            }}
            placeholder="Dán link ảnh hoặc bấm 'Tìm ảnh gợi ý' (để trống nếu không dùng ảnh)"
          />
          <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.72rem", color: "var(--text-muted, #64748b)", marginTop: "4px" }}>
            <Lightbulb size={12} style={{ flexShrink: 0 }} />
            <span>Để trống nếu không muốn dùng ảnh minh họa, hoặc chọn ảnh đúng ngữ cảnh.</span>
          </div>
        </div>
      </div>

      {/* Candidate image thumbnails strip */}
      {candidates.length > 0 && (
        <div style={{ marginTop: "10px", padding: "8px", borderRadius: "8px", background: "var(--bg-secondary, #f8fafc)", border: "1px solid var(--border-color, #e2e8f0)" }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--text-secondary, #64748b)", marginBottom: "6px" }}>
            Chọn 1 trong các ảnh gợi ý phù hợp nhất:
          </div>
          <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "2px" }}>
            {candidates.map((candUrl, idx) => {
              const isSelected = candUrl === imageUrl;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    setImageUrl(candUrl);
                    if (setImgLoadError) setImgLoadError(false);
                  }}
                  style={{
                    position: "relative",
                    width: "56px",
                    height: "56px",
                    borderRadius: "6px",
                    overflow: "hidden",
                    cursor: "pointer",
                    flexShrink: 0,
                    border: isSelected ? "2px solid var(--primary, #6366f1)" : "1px solid var(--border-color, #cbd5e1)",
                    boxShadow: isSelected ? "0 0 0 2px rgba(99, 102, 241, 0.2)" : "none",
                  }}
                  title="Nhấp để chọn ảnh này"
                >
                  <img
                    src={candUrl}
                    alt={`Candidate ${idx + 1}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  {isSelected && (
                    <div
                      style={{
                        position: "absolute",
                        top: 2,
                        right: 2,
                        background: "var(--primary, #6366f1)",
                        color: "white",
                        borderRadius: "50%",
                        width: "16px",
                        height: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Check size={10} strokeWidth={3} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
