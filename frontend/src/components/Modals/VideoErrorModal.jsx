import React from "react";
import { AlertTriangle, Headphones, Sparkles, X, ArrowRight } from "../Icons";

export const VideoErrorModal = ({
  isOpen,
  onClose,
  errorData,
  onSwitchToAudioStudio,
  onOpenPresets,
}) => {
  if (!isOpen || !errorData) return null;

  const rawMessage = errorData.message || "";
  const isSubtitlesDisabled =
    rawMessage.toLowerCase().includes("subtitles are disabled") ||
    rawMessage.toLowerCase().includes("tắt tính năng phụ đề") ||
    rawMessage.toLowerCase().includes("transcriptsdisabled");

  const videoId = errorData.videoId || "";

  return (
    <div
      className="preview-card-modal"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="preview-card-content" style={{ maxWidth: "520px" }}>
        <div style={{ padding: "1.5rem" }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  background: isSubtitlesDisabled
                    ? "rgba(245, 158, 11, 0.12)"
                    : "rgba(239, 68, 68, 0.12)",
                  color: isSubtitlesDisabled ? "#f59e0b" : "#ef4444",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "1.15rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                  }}
                >
                  {isSubtitlesDisabled
                    ? "Video chưa có phụ đề YouTube"
                    : "Không thể tải phụ đề video"}
                </h3>
                {videoId && (
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    ID: <code>{videoId}</code>
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                border: "none",
                background: "transparent",
                color: "var(--text-muted)",
                cursor: "pointer",
                padding: "4px",
                borderRadius: "6px",
              }}
              title="Đóng"
            >
              <X size={20} />
            </button>
          </div>

          {/* Explanation Alert Box */}
          <div
            style={{
              background: "var(--bg-secondary)",
              padding: "12px 14px",
              borderRadius: "10px",
              border: "1px solid var(--border-color)",
              marginBottom: "1rem",
              fontSize: "0.9rem",
              color: "var(--text-primary)",
              lineHeight: 1.5,
            }}
          >
            {isSubtitlesDisabled ? (
              <>
                <p
                  style={{
                    margin: "0 0 6px",
                    fontWeight: 600,
                    color: "#d97706",
                  }}
                >
                  Chủ kênh YouTube đã tắt tính năng phụ đề (Subtitles are disabled)
                </p>
                <p
                  style={{
                    margin: 0,
                    color: "var(--text-secondary)",
                    fontSize: "0.85rem",
                  }}
                >
                  Video này không có phụ đề CC nào trên YouTube để hệ thống có thể tải về luyện chép chính tả.
                </p>
              </>
            ) : (
              <p
                style={{
                  margin: 0,
                  color: "var(--text-secondary)",
                  fontSize: "0.88rem",
                }}
              >
                {rawMessage.split("\n\n")[0] ||
                  "Hệ thống không tìm thấy phụ đề cho video này."}
              </p>
            )}
          </div>

          {/* Solution Suggestions */}
          <div style={{ marginBottom: "1.25rem" }}>
            <span
              style={{
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                display: "block",
                marginBottom: "8px",
              }}
            >
              💡 Bạn có thể thử các giải pháp sau:
            </span>
            <ul
              style={{
                margin: 0,
                paddingLeft: "1.2rem",
                fontSize: "0.85rem",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
              }}
            >
              <li>
                <strong>Đổi video khác:</strong> Ưu tiên các video YouTube có bật biểu tượng <strong>[CC]</strong>.
              </li>
              <li>
                <strong>Studio Âm Thanh:</strong> Tải file âm thanh để <strong>AI Whisper</strong> tự động nhận diện và tạo phụ đề cho bạn.
              </li>
              <li>
                <strong>Thư viện video mẫu:</strong> Hơn 50+ video chuẩn có sẵn phụ đề được chia theo nhiều trình độ.
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "flex-end",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={onClose}
              className="preview-btn-cancel"
              style={{ padding: "8px 16px", fontSize: "0.88rem" }}
            >
              Đổi video khác
            </button>

            {onOpenPresets && (
              <button
                onClick={onOpenPresets}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "1.5px solid var(--border-color)",
                  background: "var(--bg-card)",
                  color: "var(--text-primary)",
                  fontWeight: 600,
                  fontSize: "0.88rem",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Sparkles size={14} color="var(--primary)" />
                  <span>Video mẫu</span>
                </span>
              </button>
            )}

            {onSwitchToAudioStudio && (
              <button
                onClick={onSwitchToAudioStudio}
                className="preview-btn-start"
                style={{ padding: "8px 18px", fontSize: "0.88rem" }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Headphones size={15} />
                  <span>Dùng AI Whisper</span>
                  <ArrowRight size={14} />
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
