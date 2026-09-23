import React from "react";
import { Code2, PhoneCall, Keyboard, HelpCircle, MessageSquareHeart } from "lucide-react";
import "./footer.css";

export const Footer = React.memo(function Footer({ onOpenShortcuts, onOpenFeedback }) {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="shotlang-footer">
      <div className="footer-invite-banner">
        <span>Cần mở rộng tính năng riêng hoặc tìm &quot;cạ cứng&quot; học cùng? Cứ ới tác giả một tiếng nhé 😉</span>
        <a
          href="https://zalo.me/0961766816"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-invite-contact-link"
          title="Nhắn Zalo hoặc gọi tác giả (Namth: 0961.766.816)"
        >
          💬 Zalo/Call: 0961.766.816
        </a>
      </div>

      <div className="shotlang-footer-container">
        {/* Left: Brand Identity & Logo */}
        <div className="shotlang-footer-brand">
          <a href="/" className="footer-brand-link" onClick={(e) => e.preventDefault()}>
            <img
              src="/linguagun_logo.jpg"
              alt="ShotLang Logo"
              className="footer-brand-logo"
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "6px",
                objectFit: "cover",
                flexShrink: 0,
                boxShadow: "0 0 8px rgba(37, 99, 235, 0.35)",
              }}
            />
            <span className="footer-brand-name">
              Shot<strong>Lang</strong>
            </span>
          </a>
          <p className="shotlang-footer-desc">
            Smart YouTube Dictation & Multi-Language Mastery Platform
          </p>
        </div>

        {/* Center: Developer & Contact */}
        <div className="shotlang-footer-center">
          <div className="footer-author-card">
            <div className="author-row">
              <Code2 className="footer-icon-dev" size={15} strokeWidth={2.2} />
              <span className="author-title">Developed by</span>
              <span className="author-badge-name">Namth</span>
            </div>
            
            <a href="tel:0961766816" className="footer-contact-link" title="Call or Zalo Namth">
              <PhoneCall className="footer-icon-phone" size={14} strokeWidth={2.2} />
              <span className="contact-number">0961.766.816</span>
            </a>
          </div>
        </div>

        {/* Right: Quick Action Buttons & Copyright */}
        <div className="shotlang-footer-right">
          <div className="footer-actions-row">
            {onOpenShortcuts && (
              <button
                type="button"
                className="footer-action-btn"
                onClick={onOpenShortcuts}
                title="Hướng dẫn sử dụng & Phím tắt"
              >
                <HelpCircle size={14} strokeWidth={2} />
                <span>Hướng dẫn</span>
              </button>
            )}

            {onOpenFeedback && (
              <button
                type="button"
                className="footer-action-btn"
                onClick={onOpenFeedback}
                title="Send Feedback"
              >
                <MessageSquareHeart size={14} strokeWidth={2} />
                <span>Feedback</span>
              </button>
            )}
          </div>

          <div className="footer-copyright-text">
            © {currentYear} ShotLang. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
});



