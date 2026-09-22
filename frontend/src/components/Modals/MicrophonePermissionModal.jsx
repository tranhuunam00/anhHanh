import React from "react";
import { Mic, X, RefreshCw } from "lucide-react";

export const MicrophonePermissionModal = ({ isOpen, onClose, onRetry }) => {
  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isOpen ? "active" : ""}`} onClick={onClose}>
      <div
        className="settings-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "540px" }}
      >
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                background: "rgba(239, 68, 68, 0.12)",
                color: "#ef4444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Mic size={20} strokeWidth={2.2} />
            </div>
            <div>
              <h3 className="modal-title" style={{ margin: 0, fontSize: "1.1rem" }}>
                Yêu cầu cấp quyền Microphone
              </h3>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Cần quyền truy cập Micro để luyện nghe và nói trực tiếp
              </p>
            </div>
          </div>
          <button className="btn btn-secondary btn-icon" onClick={onClose} title="Đóng">
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: "20px 24px" }}>
          <div
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: "10px",
              padding: "14px 16px",
              marginBottom: "18px",
              fontSize: "0.88rem",
              lineHeight: 1.5,
              color: "var(--text-secondary)",
            }}
          >
            Trình duyệt hiện đang <strong>chặn quyền Microphone</strong> hoặc chưa được kích hoạt.
            Để sử dụng chức năng chuyển giọng nói thành văn bản, bạn vui lòng cho phép quyền truy cập Micro:
          </div>

          <div style={{ fontSize: "0.88rem", fontWeight: 600, marginBottom: "12px", color: "var(--text-primary)" }}>
            👉 3 bước đơn giản để bật Micro trên trình duyệt:
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "22px" }}>
            <div
              style={{
                display: "flex",
                gap: "12px",
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                padding: "12px 14px",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background: "var(--primary-light)",
                  color: "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  flexShrink: 0,
                }}
              >
                1
              </div>
              <div style={{ fontSize: "0.85rem", lineHeight: 1.45 }}>
                Nhấp vào biểu tượng <strong>Cài đặt trang web</strong> hoặc <strong>Ổ khóa 🔒</strong> ở góc trái thanh địa chỉ URL (bên cạnh tên miền).
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                padding: "12px 14px",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background: "var(--primary-light)",
                  color: "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  flexShrink: 0,
                }}
              >
                2
              </div>
              <div style={{ fontSize: "0.85rem", lineHeight: 1.45 }}>
                Tại mục <strong>Microphone (Micro)</strong>, chọn trạng thái <strong>"Cho phép" (Allow)</strong> thay vì "Chặn".
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                padding: "12px 14px",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background: "var(--primary-light)",
                  color: "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  flexShrink: 0,
                }}
              >
                3
              </div>
              <div style={{ fontSize: "0.85rem", lineHeight: 1.45 }}>
                Bấm vào nút <strong>"Thử lại / Cấp quyền ngay"</strong> bên dưới hoặc phím <strong>F5</strong> để tải lại trang.
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              paddingTop: "14px",
              borderTop: "1px solid var(--border-color)",
            }}
          >
            <button className="btn btn-secondary" onClick={onClose}>
              Đóng
            </button>
            <button
              className="btn btn-primary btn-with-icon"
              onClick={() => {
                onClose();
                if (onRetry) onRetry();
              }}
              style={{ background: "var(--primary)", color: "#fff" }}
            >
              <RefreshCw size={15} strokeWidth={2.2} />
              <span>Thử lại / Cấp quyền ngay</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
