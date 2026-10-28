import React from "react";

/**
 * Bộ vẽ Doodle SVG chuyên biệt cho các từ thuộc Gốc Hành động (Action Roots: tract, port, ject, mot...)
 * Đảm bảo 100% không dùng ảnh placeholder người que dấu chấm hỏi
 */
export function renderActionDoodle(doodleKey, strokeColor = "var(--text-primary, #1e293b)") {
  const key = String(doodleKey || "").toLowerCase().trim();

  switch (key) {
    case "attract":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Nam châm móng ngựa chữ U màu đỏ */}
          <path
            d="M50 40 L50 90 A30 30 0 0 0 110 90 L110 40"
            stroke="#ef4444"
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
          />
          {/* Cực bạc của nam châm */}
          <line x1="50" y1="40" x2="50" y2="52" stroke="#94a3b8" strokeWidth="16" strokeLinecap="round" />
          <line x1="110" y1="40" x2="110" y2="52" stroke="#94a3b8" strokeWidth="16" strokeLinecap="round" />
          {/* Chữ N và S */}
          <text x="46" y="58" fontSize="11" fontWeight="800" fill="#ffffff" textAnchor="middle">N</text>
          <text x="114" y="58" fontSize="11" fontWeight="800" fill="#ffffff" textAnchor="middle">S</text>
          {/* Từ trường hút các hạt lấp lánh và trái tim */}
          <path d="M130 50 Q150 70 140 100" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="3 3" />
          <path d="M145 40 Q170 65 155 110" stroke="#3b82f6" strokeWidth="2" strokeDasharray="3 3" />
          {/* Trái tim bị hút về */}
          <path
            d="M150 65 C150 60 142 56 137 62 C132 56 124 60 124 65 C124 75 137 84 137 84 C137 84 150 75 150 65 Z"
            fill="#ec4899"
            stroke={strokeColor}
            strokeWidth="2"
          />
          {/* Ngôi sao lấp lánh */}
          <path d="M165 85 L168 92 L175 92 L169 96 L171 103 L165 99 L159 103 L161 96 L155 92 L162 92 Z" fill="#eab308" />
          <path d="M135 115 L137 120 L142 120 L138 123 L140 128 L135 125 L130 128 L132 123 L128 120 L133 120 Z" fill="#eab308" />
        </svg>
      );

    case "extract":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Bình thủy tinh chứa tinh chất chiết xuất */}
          <path d="M85 85 L85 125 A25 25 0 0 0 135 125 L135 85 Z" fill="rgba(245, 158, 11, 0.15)" stroke={strokeColor} strokeWidth="3" />
          <rect x="95" y="70" width="30" height="15" rx="3" stroke={strokeColor} strokeWidth="3" fill="var(--bg-card, #ffffff)" />
          {/* Nước tinh chất màu vàng hổ phách */}
          <path d="M86 110 Q110 105 134 110 L134 125 A24 24 0 0 1 86 125 Z" fill="#f59e0b" />
          {/* Ống nhỏ giọt rút tinh chất từ trên xuống */}
          <rect x="106" y="25" width="8" height="35" stroke={strokeColor} strokeWidth="2.5" fill="var(--bg-card, #ffffff)" />
          <path d="M102 25 C102 15 118 15 118 25 Z" fill="#ef4444" stroke={strokeColor} strokeWidth="2.5" />
          <path d="M106 60 L110 72 L114 60 Z" fill={strokeColor} />
          {/* Giọt tinh chất chiết xuất đang rơi vào bình */}
          <path d="M110 82 C106 88 104 92 104 96 C104 100 107 103 110 103 C113 103 116 100 116 96 C116 92 114 88 110 82 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
          {/* Lá thảo mộc tự nhiên kế bên bình */}
          <path d="M55 125 Q50 95 80 95 Q80 125 55 125 Z" fill="#10b981" stroke={strokeColor} strokeWidth="2.5" />
          <path d="M55 125 Q70 105 80 95" stroke="#047857" strokeWidth="2" />
        </svg>
      );

    case "distract":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Quyển sách đang mở nằm dưới bàn */}
          <path d="M40 120 Q70 110 100 120 Q130 110 160 120 L155 138 Q130 128 100 138 Q70 128 45 138 Z" fill="#f8fafc" stroke={strokeColor} strokeWidth="2.5" />
          <line x1="100" y1="120" x2="100" y2="138" stroke={strokeColor} strokeWidth="2.5" />
          {/* Mèo con quay đầu nhìn theo cánh bướm */}
          <circle cx="85" cy="75" r="22" stroke={strokeColor} strokeWidth="3" fill="var(--bg-card, #ffffff)" />
          {/* Tai mèo */}
          <polygon points="68,60 74,40 85,55" fill="#f59e0b" stroke={strokeColor} strokeWidth="2" />
          <polygon points="102,60 96,40 85,55" fill="#f59e0b" stroke={strokeColor} strokeWidth="2" />
          {/* Mắt mèo nhìn lệch sang phải */}
          <circle cx="80" cy="72" r="3" fill={strokeColor} />
          <circle cx="94" cy="72" r="3" fill={strokeColor} />
          <path d="M84 79 Q87 83 90 79" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          {/* Con bướm bay lượn gây xao nhãng */}
          <path d="M140 45 C130 35 130 55 140 50 C150 55 150 35 140 45 Z" fill="#ec4899" stroke={strokeColor} strokeWidth="2" />
          <path d="M140 40 Q145 35 148 37" stroke={strokeColor} strokeWidth="1.5" />
          {/* Vệt bay lượn vòng tròn */}
          <path d="M105 70 Q120 50 135 60 T140 45" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />
        </svg>
      );

    case "contract":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Bản hợp đồng pháp lý có dấu sáp */}
          <rect x="65" y="30" width="70" height="95" rx="6" fill="var(--bg-card, #ffffff)" stroke={strokeColor} strokeWidth="3" />
          {/* Các dòng điều khoản văn bản */}
          <line x1="78" y1="48" x2="122" y2="48" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
          <line x1="78" y1="62" x2="122" y2="62" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
          <line x1="78" y1="76" x2="110" y2="76" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
          {/* Chữ ký bút máy */}
          <path d="M78 95 Q88 88 95 98 T115 92" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
          {/* Con dấu sáp đỏ uy tín */}
          <circle cx="118" cy="108" r="12" fill="#ef4444" stroke={strokeColor} strokeWidth="2" />
          <circle cx="118" cy="108" r="7" fill="#dc2626" />
          {/* Mũi tên co lại từ hai phía */}
          <path d="M35 80 L52 80 M46 74 L52 80 L46 86" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M165 80 L148 80 M154 74 L148 80 L154 86" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case "retract":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Chú rùa con rụt đầu vào mai an toàn */}
          <ellipse cx="100" cy="95" rx="42" ry="30" fill="#10b981" stroke={strokeColor} strokeWidth="3" />
          {/* Hoa văn trên mai rùa */}
          <path d="M100 68 L100 122 M70 85 L130 85 M75 108 L125 108" stroke="#047857" strokeWidth="2.5" />
          {/* Đầu rùa thụt sâu vào trong mai */}
          <path d="M135 95 Q145 95 140 102 Q132 102 135 95" fill="#a7f3d0" stroke={strokeColor} strokeWidth="2" />
          <circle cx="137" cy="97" r="1.5" fill={strokeColor} />
          {/* 4 chân ngắn nhỏ */}
          <ellipse cx="72" cy="120" rx="8" ry="5" fill="#a7f3d0" stroke={strokeColor} strokeWidth="2" />
          <ellipse cx="128" cy="120" rx="8" ry="5" fill="#a7f3d0" stroke={strokeColor} strokeWidth="2" />
          {/* Mũi tên thụt lùi lại */}
          <path d="M158 88 L142 88 M148 82 L142 88 L148 94" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case "abstract":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Khung tranh nghệ thuật trừu tượng */}
          <rect x="40" y="25" width="120" height="110" rx="8" stroke={strokeColor} strokeWidth="3" fill="var(--bg-card, #ffffff)" />
          {/* Hình khối hình học lơ lửng sáng tạo */}
          <circle cx="80" cy="65" r="22" fill="#60a5fa" stroke={strokeColor} strokeWidth="2.5" />
          <polygon points="120,45 145,85 95,85" fill="#f43f5e" stroke={strokeColor} strokeWidth="2.5" />
          <rect x="75" y="90" width="36" height="30" rx="4" fill="#fbbf24" stroke={strokeColor} strokeWidth="2.5" transform="rotate(-12 93 105)" />
          <line x1="55" y1="110" x2="145" y2="60" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <circle cx="135" cy="105" r="7" fill="#8b5cf6" stroke={strokeColor} strokeWidth="2" />
        </svg>
      );

    case "subtract":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Dấu trừ toán học lớn đáng yêu */}
          <rect x="40" y="45" width="40" height="12" rx="6" fill="#ef4444" stroke={strokeColor} strokeWidth="2" />
          {/* 3 quả táo, 1 quả bị nhấc đi */}
          {/* Quả táo 1 */}
          <circle cx="110" cy="115" r="16" fill="#ef4444" stroke={strokeColor} strokeWidth="2.5" />
          <path d="M110 99 Q113 93 118 95" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
          {/* Quả táo 2 */}
          <circle cx="145" cy="115" r="16" fill="#ef4444" stroke={strokeColor} strokeWidth="2.5" />
          <path d="M145 99 Q148 93 153 95" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
          {/* Quả táo bị trừ (nhấc bổng lên cao với mũi tên) */}
          <circle cx="130" cy="55" r="16" fill="rgba(239, 68, 68, 0.5)" stroke={strokeColor} strokeWidth="2" strokeDasharray="3 3" />
          <path d="M130 90 L130 75 M125 80 L130 75 L135 80" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case "protract":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Thước đo độ bán nguyệt kéo dài góc */}
          <path d="M45 110 A55 55 0 0 1 155 110 Z" fill="rgba(37, 99, 235, 0.1)" stroke={strokeColor} strokeWidth="3" />
          <line x1="40" y1="110" x2="160" y2="110" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <circle cx="100" cy="110" r="4" fill="#2563eb" />
          {/* Các vạch độ trên thước */}
          <line x1="100" y1="55" x2="100" y2="65" stroke={strokeColor} strokeWidth="2" />
          <line x1="65" y1="72" x2="72" y2="79" stroke={strokeColor} strokeWidth="2" />
          <line x1="135" y1="72" x2="128" y2="79" stroke={strokeColor} strokeWidth="2" />
          {/* Cây kim/bút chì vẽ góc mở rộng kéo dài */}
          <line x1="100" y1="110" x2="145" y2="45" stroke="#db2777" strokeWidth="3" strokeLinecap="round" />
          <circle cx="145" cy="45" r="3" fill="#db2777" />
          {/* Vòng cung kéo dài */}
          <path d="M115 110 A15 15 0 0 0 110 97" stroke="#db2777" strokeWidth="2" strokeDasharray="2 2" />
        </svg>
      );

    default:
      return null;
  }
}
