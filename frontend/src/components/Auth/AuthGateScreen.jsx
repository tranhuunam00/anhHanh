import React from "react";
import { Headphones, GraduationCap, MapPin, Flame, LogIn, UserPlus } from "../Icons";
import "./authGate.css";

/**
 * AuthGateScreen - Màn hình yêu cầu đăng nhập bắt buộc
 * Hiển thị khi người dùng chưa đăng nhập, bảo vệ toàn bộ tính năng học tập
 * và khuyến khích người dùng đăng nhập/đăng ký qua Google hoặc Email.
 */
export const AuthGateScreen = ({ onOpenLogin, onOpenRegister }) => {
  return (
    <div className="auth-gate-wrapper">
      <div className="auth-gate-card">
        {/* Brand Icon Header */}
        <div className="auth-gate-header">
          <div className="auth-gate-logo-badge">
            <img
              src="/shotlang_logo.png"
              alt="ShotLang"
              className="auth-gate-logo-img"
            />
          </div>
          <h1 className="auth-gate-title">
            Chào mừng bạn đến với <span>ShotLang</span>
          </h1>
          <p className="auth-gate-subtitle">
            Học thông minh qua chép chính tả video YouTube, thi thật IELTS 4 kỹ năng và kết nối bạn học quanh đây.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="auth-gate-features-grid">
          <div className="auth-gate-feature-item">
            <div className="auth-gate-feature-icon" style={{ color: "#38bdf8" }}>
              <Headphones size={20} />
            </div>
            <div>
              <strong>Luyện chép chính tả YouTube</strong>
              <span>Tự động tách câu, lặp lại mượt mà, tra cứu từ vựng tức thì.</span>
            </div>
          </div>

          <div className="auth-gate-feature-item">
            <div className="auth-gate-feature-icon" style={{ color: "#f59e0b" }}>
              <GraduationCap size={20} />
            </div>
            <div>
              <strong>Đề thi thật IELTS Cam 17–21</strong>
              <span>Đầy đủ 4 kỹ năng Listening, Reading, Writing AI, Speaking AI.</span>
            </div>
          </div>

          <div className="auth-gate-feature-item">
            <div className="auth-gate-feature-icon" style={{ color: "#10b981" }}>
              <MapPin size={20} />
            </div>
            <div>
              <strong>Tìm bạn học quanh đây</strong>
              <span>Định vị GPS thực tế, tìm bạn bè cùng trình độ để học cùng.</span>
            </div>
          </div>

          <div className="auth-gate-feature-item">
            <div className="auth-gate-feature-icon" style={{ color: "#ec4899" }}>
              <Flame size={20} />
            </div>
            <div>
              <strong>Bảo lưu tiến trình & Streak</strong>
              <span>Ghi nhận chuỗi ngày học liên tục và ôn tập từ vựng ngắt quãng SRS.</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="auth-gate-actions">
          <button
            type="button"
            className="auth-gate-btn-primary"
            onClick={onOpenLogin}
          >
            <LogIn size={18} />
            <span>Đăng nhập ngay</span>
          </button>

          <button
            type="button"
            className="auth-gate-btn-secondary"
            onClick={onOpenRegister}
          >
            <UserPlus size={18} />
            <span>Tạo tài khoản mới</span>
          </button>
        </div>

        <div className="auth-gate-footer-note">
          <span>Hỗ trợ đăng nhập nhanh bằng tài khoản <strong>Google</strong> (1 chạm)</span>
        </div>
      </div>
    </div>
  );
};

export default AuthGateScreen;

