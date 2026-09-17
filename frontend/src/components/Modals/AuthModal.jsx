import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";

export const AuthModal = ({ isOpen, onClose, initialRegister = false }) => {
  const [isRegister, setIsRegister] = useState(initialRegister);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { isAuthenticated, loginEmail, registerEmail, loginGoogle, googleClientId } = useAuth();
  const googleBtnRef = useRef(null);

  // Auto-close modal whenever user is authenticated
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      setIsLoading(false);
      onClose();
    }
  }, [isAuthenticated, isOpen, onClose]);

  useEffect(() => {
    setIsRegister(initialRegister);
    setError("");
  }, [initialRegister, isOpen]);

  // Render Google Sign-in button when modal opens
  useEffect(() => {
    if (!isOpen || !googleBtnRef.current) return;

    if (typeof window.google !== "undefined" && window.google.accounts && window.google.accounts.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (res) => {
            if (res && res.credential) {
              try {
                setIsLoading(true);
                await loginGoogle(res.credential);
                onClose();
              } catch (e) {
                setError(e.message || "Đăng nhập Google thất bại");
              } finally {
                setIsLoading(false);
              }
            }
          },
        });

        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: "outline",
          size: "large",
          text: isRegister ? "signup_with" : "signin_with",
          shape: "rectangular",
          width: 320,
        });
      } catch (err) {
        console.warn("Error rendering Google button:", err);
      }
    }
  }, [isOpen, isRegister, googleClientId, loginGoogle, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isRegister) {
        await registerEmail(email.trim(), password, name.trim(), honeypot);
      } else {
        await loginEmail(email.trim(), password);
      }
      onClose();
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="preview-card-modal" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="preview-card-content" style={{ maxWidth: "420px", padding: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h3 style={{ margin: 0, fontSize: "1.25rem", color: "var(--text, #0f172a)" }}>
            {isRegister ? "Đăng Ký Tài Khoản" : "Đăng Nhập"}
          </h3>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "#64748b" }}
          >
            &times;
          </button>
        </div>

        {error && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#dc2626",
              padding: "10px 14px",
              borderRadius: "8px",
              fontSize: "0.85rem",
              marginBottom: "1rem",
            }}
          >
            {error}
          </div>
        )}

        {/* Google Sign-in Container */}
        <div style={{ marginBottom: "1.25rem", display: "flex", justifyContent: "center" }}>
          <div ref={googleBtnRef}></div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "1.25rem 0", color: "#94a3b8", fontSize: "0.8rem" }}>
          <hr style={{ flex: 1, border: "none", borderTop: "1px solid #e2e8f0" }} />
          <span>HOẶC DÙNG EMAIL</span>
          <hr style={{ flex: 1, border: "none", borderTop: "1px solid #e2e8f0" }} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {isRegister && (
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#475569" }}>Họ và Tên</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nguyễn Văn A"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", marginTop: "4px" }}
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#475569" }}>Địa chỉ Email</label>
            <input
              type="email"
              required
              className="form-control"
              placeholder="hocvien@shotlang.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", marginTop: "4px" }}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#475569" }}>Mật khẩu</label>
            <input
              type="password"
              required
              minLength={6}
              className="form-control"
              placeholder="Tối thiểu 6 ký tự"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", marginTop: "4px" }}
            />
          </div>

          {/* Honeypot field */}
          <input
            type="text"
            name="b_trap"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            style={{ display: "none" }}
            tabIndex={-1}
            autoComplete="off"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
            style={{ padding: "10px", fontWeight: 700, marginTop: "8px" }}
          >
            {isLoading ? "Đang xử lý..." : isRegister ? "Tạo Tài Khoản" : "Đăng Nhập"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.85rem", color: "#64748b" }}>
          <span>{isRegister ? "Đã có tài khoản?" : "Chưa có tài khoản?"}</span>
          <a
            href="#switch"
            onClick={(e) => {
              e.preventDefault();
              setIsRegister(!isRegister);
              setError("");
            }}
            style={{ color: "#2563eb", fontWeight: 600, marginLeft: "4px", textDecoration: "none" }}
          >
            {isRegister ? "Đăng nhập ngay" : "Đăng ký miễn phí"}
          </a>
        </div>
      </div>
    </div>
  );
};
