import React from "react";
import { GraduationCap, Headphones, BookOpen, PenTool, Mic } from "../../constants/icons.js";

/**
 * Authentication Gate for IELTS Test
 * Displayed when user is not logged in.
 */
export const IeltsAuthGate = ({ onOpenAuth }) => {
  return (
    <div className="ielts-auth-gate-container">
      <div className="ielts-auth-gate-card">
        <div className="ielts-auth-gate-icon-circle">
          <GraduationCap className="w-10 h-10 text-primary" />
        </div>

        <h2 className="ielts-auth-gate-title">
          Đề Thi Thật IELTS Thực Chiến
        </h2>
        <p className="ielts-auth-gate-subtitle">
          Tính năng yêu cầu đăng nhập để lưu trữ kết quả làm bài, phân tích band điểm 4 kỹ năng và chấm điểm học thuật.
        </p>

        <div className="ielts-features-grid">
          <div className="ielts-feature-item">
            <Headphones className="w-5 h-5 text-primary" />
            <div>
              <strong>IELTS Listening</strong>
              <p>Trình phát audio chuẩn đề Cam, chia 4 Parts với bản đồ tương tác</p>
            </div>
          </div>
          <div className="ielts-feature-item">
            <BookOpen className="w-5 h-5 text-primary" />
            <div>
              <strong>IELTS Reading</strong>
              <p>Đoạn văn 1 bên, câu hỏi 1 bên với scroll riêng biệt, 3 Passages</p>
            </div>
          </div>
          <div className="ielts-feature-item">
            <PenTool className="w-5 h-5 text-primary" />
            <div>
              <strong>IELTS Writing</strong>
              <p>Đầu bài 1 bên, làm bài 1 bên, đếm số từ tự động & AI chấm điểm</p>
            </div>
          </div>
          <div className="ielts-feature-item">
            <Mic className="w-5 h-5 text-primary" />
            <div>
              <strong>IELTS Speaking</strong>
              <p>Cue Card, bộ đếm thời gian 1 phút chuẩn bị / 2 phút nói & ghi âm</p>
            </div>
          </div>
        </div>

        <div className="ielts-auth-gate-actions">
          <button
            type="button"
            className="ielts-auth-login-btn"
            onClick={onOpenAuth}
          >
            Đăng nhập để bắt đầu làm bài
          </button>
        </div>
      </div>
    </div>
  );
};

