import React from "react";
import { RotateCw, Image as ImageIcon, Lightbulb } from "../Icons";
import { fetchImageCandidates } from "../../services/authVocabService";

export const VocabImagePickerField = ({
  word,
  contextSentence = "",
  imageUrl,
  setImageUrl,
  imgLoadError,
  setImgLoadError,
  isSearchingImages,
  setIsSearchingImages,
  showToast,
  token,
}) => {
  const handleFindAlternativeImages = async () => {
    const clean = (word || "").trim();
    if (!clean) {
      if (showToast) showToast("Vui lòng nhập từ vựng trước", "warning");
      return;
    }

    if (setIsSearchingImages) setIsSearchingImages(true);
    try {
      const candidates = await fetchImageCandidates(clean, contextSentence, token);
      if (candidates && candidates.length > 0) {
        const otherImgs = candidates.filter((c) => c !== imageUrl);
        const nextImg = otherImgs[0] || candidates[0];
        setImageUrl(nextImg);
        if (setImgLoadError) setImgLoadError(false);
        if (showToast) showToast("Đã đổi sang ảnh gợi ý mới", "info");
      } else {
        if (showToast) showToast("Không tìm thấy ảnh gợi ý phù hợp", "info");
      }
    } catch (e) {
      if (showToast) showToast("Lỗi khi tìm ảnh gợi ý", "error");
    } finally {
      if (setIsSearchingImages) setIsSearchingImages(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
        <label style={{ fontSize: "0.83rem", fontWeight: 600, color: "var(--text-primary, #1e293b)" }}>
          Link ảnh minh họa (Tùy chọn)
        </label>
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
          title="Tìm ảnh minh họa liên quan"
        >
          <RotateCw size={12} className={isSearchingImages ? "spinning" : ""} />
          <span>{isSearchingImages ? "Đang tìm..." : "Tìm ảnh gợi ý"}</span>
        </button>
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
              <div style={{ fontSize: "0.58rem" }}>{imgLoadError ? "Lỗi link" : "Tự tìm"}</div>
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
            placeholder="Dán link ảnh hoặc để trống để AI tự động tìm"
          />
          <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.72rem", color: "var(--text-muted, #64748b)", marginTop: "4px" }}>
            <Lightbulb size={12} style={{ flexShrink: 0 }} />
            <span>Để trống hệ thống sẽ tự động gán ảnh minh họa phù hợp với nghĩa của từ.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
