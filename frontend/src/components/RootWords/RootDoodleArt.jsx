import React, { useState } from "react";

/**
 * Cute Minimalist Doodle Art Component
 * Hỗ trợ ảnh tùy chỉnh (như respect.jpg, inspect.jpg, predict.jpg)
 * và tự sinh SVG doodle nét vẽ tay nhỏ xinh, tối giản chuẩn phong cách.
 */
export const RootDoodleArt = ({ doodleKey, customImage, word }) => {
  const [imageError, setImageError] = useState(false);

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

  // Render SVG doodle theo chủ đề từ vựng
  const renderSvgDoodle = () => {
    const strokeColor = "var(--text-primary, #1e293b)";

    switch (doodleKey) {
      case "respect":
      case "sympathy":
      case "consent":
        // 2 nhân vật que nắm tay nhau, có trái tim hồng ở giữa (chuẩn mẫu ảnh)
        return (
          <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
            {/* Trái tim hồng ở giữa */}
            <path
              d="M100 45 C100 35 90 25 80 25 C70 25 65 35 65 45 C65 65 100 85 100 85 C100 85 135 65 135 45 C135 35 130 25 120 25 C110 25 100 35 100 45 Z"
              fill="#ec4899"
              opacity="0.9"
            />
            {/* Nhân vật trái */}
            <circle cx="60" cy="70" r="22" stroke={strokeColor} strokeWidth="3" fill="var(--bg-card, #ffffff)" />
            <path d="M52 68 Q55 65 58 68" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M64 68 Q67 65 70 68" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M55 78 Q60 83 66 78" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M38 140 C40 100 80 100 82 140" stroke={strokeColor} strokeWidth="3" fill="none" />
            
            {/* Nhân vật phải */}
            <circle cx="140" cy="70" r="22" stroke={strokeColor} strokeWidth="3" fill="var(--bg-card, #ffffff)" />
            <path d="M132 68 Q135 65 138 68" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M144 68 Q147 65 150 68" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M135 78 Q140 83 146 78" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M118 140 C120 100 160 100 162 140" stroke={strokeColor} strokeWidth="3" fill="none" />

            {/* Tay nắm lấy nhau */}
            <path d="M75 110 Q100 125 125 110" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" />
          </svg>
        );

      case "inspect":
      case "telescope":
      case "microscope":
        // Nhân vật que cầm kính lúp soi bông hoa
        return (
          <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
            {/* Nhân vật */}
            <circle cx="65" cy="55" r="20" stroke={strokeColor} strokeWidth="3" fill="var(--bg-card, #ffffff)" />
            <circle cx="60" cy="53" r="2.5" fill={strokeColor} />
            <circle cx="72" cy="53" r="2.5" fill={strokeColor} />
            <path d="M62 63 Q66 67 70 63" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
            <path d="M65 75 L65 125 M65 125 L50 150 M65 125 L80 150" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
            <path d="M65 90 L95 85" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
            
            {/* Kính lúp to */}
            <circle cx="120" cy="80" r="24" stroke={strokeColor} strokeWidth="3.5" fill="rgba(59, 130, 246, 0.1)" />
            <line x1="105" y1="95" x2="95" y2="105" stroke={strokeColor} strokeWidth="4.5" strokeLinecap="round" />
            {/* Bông hoa nhỏ đáng yêu */}
            <circle cx="145" cy="130" r="6" fill="#f59e0b" />
            <path d="M145 136 L145 152" stroke="#10b981" strokeWidth="2.5" />
            <path d="M145 144 Q152 140 154 146" stroke="#10b981" strokeWidth="2" fill="none" />
          </svg>
        );

      case "predict":
      case "logic":
      case "philosophy":
        // Nhân vật que với quả cầu pha lê và ngôi sao sáng
        return (
          <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
            <circle cx="70" cy="55" r="20" stroke={strokeColor} strokeWidth="3" fill="var(--bg-card, #ffffff)" />
            <circle cx="65" cy="53" r="2.5" fill={strokeColor} />
            <circle cx="77" cy="53" r="2.5" fill={strokeColor} />
            <path d="M67 63 Q72 67 77 63" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
            <path d="M70 75 L70 125 M70 125 L55 150 M70 125 L85 150" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
            <path d="M70 90 L105 100" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
            
            {/* Quả cầu pha lê */}
            <circle cx="135" cy="95" r="26" stroke={strokeColor} strokeWidth="3" fill="rgba(147, 51, 234, 0.12)" />
            <path d="M120 125 L150 125 L145 145 L125 145 Z" stroke={strokeColor} strokeWidth="2.5" fill="var(--bg-card, #ffffff)" />
            {/* Ngôi sao lấp lánh */}
            <path d="M135 83 L138 90 L145 90 L139 94 L142 101 L135 97 L128 101 L131 94 L125 90 L132 90 Z" fill="#fbbf24" />
          </svg>
        );

      case "construct":
      case "structure":
      case "factory":
        // Nhân vật que đội mũ bảo hộ xếp gạch xây tháp
        return (
          <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
            <circle cx="65" cy="60" r="18" stroke={strokeColor} strokeWidth="3" fill="var(--bg-card, #ffffff)" />
            {/* Mũ bảo hộ */}
            <path d="M46 54 C46 40 84 40 84 54 Z" fill="#f59e0b" stroke={strokeColor} strokeWidth="2.5" />
            <line x1="42" y1="54" x2="88" y2="54" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
            <circle cx="61" cy="62" r="2" fill={strokeColor} />
            <circle cx="71" cy="62" r="2" fill={strokeColor} />
            <path d="M63 68 Q66 72 70 68" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
            <path d="M65 78 L65 125 M65 125 L50 150 M65 125 L80 150" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
            <path d="M65 92 L105 85" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />

            {/* Các khối gạch xếp chồng */}
            <rect x="115" y="115" width="30" height="15" rx="3" stroke={strokeColor} strokeWidth="2.5" fill="#60a5fa" />
            <rect x="148" y="115" width="30" height="15" rx="3" stroke={strokeColor} strokeWidth="2.5" fill="#60a5fa" />
            <rect x="130" y="98" width="32" height="15" rx="3" stroke={strokeColor} strokeWidth="2.5" fill="#38bdf8" />
            <rect x="138" y="81" width="18" height="15" rx="3" stroke={strokeColor} strokeWidth="2.5" fill="#fbbf24" />
          </svg>
        );

      case "transport":
      case "export":
      case "produce":
        // Nhân vật di chuyển mang theo gói quà
        return (
          <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
            <circle cx="70" cy="55" r="19" stroke={strokeColor} strokeWidth="3" fill="var(--bg-card, #ffffff)" />
            <circle cx="66" cy="53" r="2.5" fill={strokeColor} />
            <circle cx="76" cy="53" r="2.5" fill={strokeColor} />
            <path d="M67 63 Q72 67 76 63" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
            <path d="M70 74 L70 120 M70 120 L55 145 M70 120 L88 145" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
            <path d="M70 90 L105 85" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
            
            {/* Hộp kiện hàng */}
            <rect x="105" y="70" width="35" height="30" rx="4" stroke={strokeColor} strokeWidth="2.5" fill="#fef08a" />
            <line x1="122" y1="70" x2="122" y2="100" stroke="#f59e0b" strokeWidth="2" />
            <line x1="105" y1="85" x2="140" y2="85" stroke="#f59e0b" strokeWidth="2" />
            {/* Làn khói tốc độ */}
            <path d="M35 120 Q20 120 15 125 M30 132 Q18 132 10 137" stroke="var(--text-muted, #94a3b8)" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        );

      case "describe":
      case "autograph":
      case "document":
        // Nhân vật que cầm bút lông viết chữ
        return (
          <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
            <circle cx="70" cy="55" r="19" stroke={strokeColor} strokeWidth="3" fill="var(--bg-card, #ffffff)" />
            <circle cx="65" cy="53" r="2" fill={strokeColor} />
            <circle cx="75" cy="53" r="2" fill={strokeColor} />
            <path d="M67 63 Q71 67 76 63" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
            <path d="M70 74 L70 122 M70 122 L55 148 M70 122 L85 148" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
            
            {/* Tờ giấy & bút viết */}
            <rect x="105" y="80" width="45" height="55" rx="3" stroke={strokeColor} strokeWidth="2.5" fill="var(--bg-card, #ffffff)" />
            <line x1="115" y1="95" x2="140" y2="95" stroke="var(--text-muted, #94a3b8)" strokeWidth="2" strokeLinecap="round" />
            <line x1="115" y1="107" x2="135" y2="107" stroke="var(--text-muted, #94a3b8)" strokeWidth="2" strokeLinecap="round" />
            <line x1="115" y1="119" x2="138" y2="119" stroke="var(--text-muted, #94a3b8)" strokeWidth="2" strokeLinecap="round" />
            <path d="M70 90 L110 88" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          </svg>
        );

      default:
        // Biểu tượng stick figure vui tươi ăn mừng với bóng đèn sáng tạo
        return (
          <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
            <circle cx="100" cy="65" r="22" stroke={strokeColor} strokeWidth="3" fill="var(--bg-card, #ffffff)" />
            <circle cx="93" cy="62" r="2.5" fill={strokeColor} />
            <circle cx="107" cy="62" r="2.5" fill={strokeColor} />
            <path d="M94 74 Q100 80 106 74" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M100 87 L100 135 M100 135 L82 155 M100 135 L118 155" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
            {/* Hai tay giơ cao mừng vui */}
            <path d="M70 95 L100 102 L130 95" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
            
            {/* Bóng đèn ý tưởng phía trên đầu */}
            <path d="M94 28 C94 20 106 20 106 28 C106 32 103 34 100 37 L100 40" stroke="#f59e0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <line x1="97" y1="41" x2="103" y2="41" stroke="#f59e0b" strokeWidth="2" />
            {/* Tia sáng */}
            <line x1="88" y1="20" x2="84" y2="16" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
            <line x1="112" y1="20" x2="116" y2="16" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
            <line x1="100" y1="14" x2="100" y2="10" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
    }
  };

  return <div className="root-doodle-container">{renderSvgDoodle()}</div>;
};
