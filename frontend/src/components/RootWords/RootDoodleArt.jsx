import React, { useState } from "react";
import { renderPerceptionDoodle } from "./RootDoodlePerception";
import { renderActionDoodle } from "./RootDoodleAction";
import { renderCommunicationDoodle } from "./RootDoodleCommunication";

/**
 * Cute Minimalist Doodle Art Component
 * Tự động ưu tiên minh họa vector SVG đặc thù cho từng từ vựng
 * Đảm bảo 100% không dùng ảnh người que dấu chấm hỏi
 */
export const RootDoodleArt = ({ doodleKey, customImage, word }) => {
  const [imageError, setImageError] = useState(false);
  const strokeColor = "var(--text-primary, #1e293b)";
  const searchKey = doodleKey || word || "";

  // 1. Nếu có hình ảnh custom và tải thành công, ưu tiên hiển thị
  if (customImage && !imageError) {
    return (
      <div className="root-doodle-container">
        <img
          src={customImage}
          alt={word || "Doodle illustration"}
          className="root-doodle-img"
          onError={() => setImageError(true)}
          loading="lazy"
        />
      </div>
    );
  }

  // 2. Kiểm tra bộ vẽ SVG chuyên biệt cho Cụm 1: Nhìn & Cảm nhận
  const perceptionSvg = renderPerceptionDoodle(searchKey, strokeColor);
  if (perceptionSvg) {
    return <div className="root-doodle-container">{perceptionSvg}</div>;
  }

  // 3. Kiểm tra bộ vẽ SVG chuyên biệt cho các từ Hành động (gốc tract...)
  const actionSvg = renderActionDoodle(searchKey, strokeColor);
  if (actionSvg) {
    return <div className="root-doodle-container">{actionSvg}</div>;
  }

  // 4. Kiểm tra bộ vẽ SVG chuyên biệt cho Cụm 2: Nói & Viết
  const commSvg = renderCommunicationDoodle(searchKey, strokeColor);
  if (commSvg) {
    return <div className="root-doodle-container">{commSvg}</div>;
  }

  // 5. Fallback nghệ thuật tối giản: Biểu tượng tri thức từ vựng trang nhã (không dùng người que ?)
  const renderElegantFallbackSvg = () => {
    const initial = (word || "W").charAt(0).toUpperCase();

    return (
      <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
        {/* Khung huân chương từ vựng bo tròn nghệ thuật */}
        <rect
          x="55"
          y="28"
          width="90"
          height="104"
          rx="18"
          fill="rgba(37, 99, 235, 0.05)"
          stroke="#2563eb"
          strokeWidth="2.5"
          strokeDasharray="6 4"
        />
        {/* Quyển sách mở ở chân đế */}
        <path
          d="M60 115 Q100 105 100 125 Q100 105 140 115 L140 128 Q100 118 100 135 Q100 118 60 128 Z"
          fill="var(--bg-card, #ffffff)"
          stroke={strokeColor}
          strokeWidth="2.5"
        />
        {/* Vòng tròn hào quang chữ cái đầu */}
        <circle cx="100" cy="72" r="28" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2.5" />
        <text
          x="100"
          y="82"
          fontSize="28"
          fontWeight="900"
          fill="#2563eb"
          textAnchor="middle"
          fontFamily="system-ui, sans-serif"
        >
          {initial}
        </text>
        {/* Ngôi sao lấp lánh trang trí góc */}
        <path d="M72 40 L74 46 L80 46 L75 50 L77 56 L72 52 L67 56 L69 50 L64 46 L70 46 Z" fill="#fbbf24" />
        <path d="M128 40 L130 46 L136 46 L131 50 L133 56 L128 52 L123 56 L125 50 L120 46 L126 46 Z" fill="#ec4899" />
      </svg>
    );
  };

  return <div className="root-doodle-container">{renderElegantFallbackSvg()}</div>;
};
