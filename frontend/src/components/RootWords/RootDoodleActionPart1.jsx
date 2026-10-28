import React from "react";

/**
 * Bộ vẽ Doodle SVG chuyên biệt cho Cụm 3: Hành động & Di chuyển - Phần 1
 * Gốc: tract, port, duc
 * Đảm bảo 100% vector SVG vẽ tay tinh gọn, sắc nét cả Light/Dark Mode
 * Tuân thủ Rule 4: File code < 500 dòng
 */
export function renderActionDoodlePart1(doodleKey, strokeColor = "var(--text-primary, #1e293b)") {
  const key = String(doodleKey || "").toLowerCase().trim();

  switch (key) {
    case "attract":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Nam châm móng ngựa chữ U màu đỏ */}
          <path d="M50 40 L50 90 A30 30 0 0 0 110 90 L110 40" stroke="#ef4444" strokeWidth="16" strokeLinecap="round" fill="none" />
          <line x1="50" y1="40" x2="50" y2="52" stroke="#94a3b8" strokeWidth="16" strokeLinecap="round" />
          <line x1="110" y1="40" x2="110" y2="52" stroke="#94a3b8" strokeWidth="16" strokeLinecap="round" />
          <text x="46" y="58" fontSize="11" fontWeight="800" fill="#ffffff" textAnchor="middle">N</text>
          <text x="114" y="58" fontSize="11" fontWeight="800" fill="#ffffff" textAnchor="middle">S</text>
          {/* Từ trường hút trái tim */}
          <path d="M130 50 Q150 70 140 100" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="3 3" />
          <path d="M150 65 C150 60 142 56 137 62 C132 56 124 60 124 65 C124 75 137 84 137 84 C137 84 150 75 150 65 Z" fill="#ec4899" stroke={strokeColor} strokeWidth="2" />
        </svg>
      );

    case "extract":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <path d="M85 85 L85 125 A25 25 0 0 0 135 125 L135 85 Z" fill="rgba(245, 158, 11, 0.15)" stroke={strokeColor} strokeWidth="3" />
          <rect x="95" y="70" width="30" height="15" rx="3" stroke={strokeColor} strokeWidth="3" fill="var(--bg-card, #ffffff)" />
          <path d="M86 110 Q110 105 134 110 L134 125 A24 24 0 0 1 86 125 Z" fill="#f59e0b" />
          <rect x="106" y="25" width="8" height="35" stroke={strokeColor} strokeWidth="2.5" fill="var(--bg-card, #ffffff)" />
          <path d="M102 25 C102 15 118 15 118 25 Z" fill="#ef4444" stroke={strokeColor} strokeWidth="2.5" />
          <path d="M110 82 C106 88 104 92 104 96 C104 100 107 103 110 103 C113 103 116 100 116 96 C116 92 114 88 110 82 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
        </svg>
      );

    case "distract":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <path d="M40 120 Q70 110 100 120 Q130 110 160 120 L155 138 Q130 128 100 138 Q70 128 45 138 Z" fill="#f8fafc" stroke={strokeColor} strokeWidth="2.5" />
          <circle cx="85" cy="75" r="22" stroke={strokeColor} strokeWidth="3" fill="var(--bg-card, #ffffff)" />
          <polygon points="68,60 74,40 85,55" fill="#f59e0b" stroke={strokeColor} strokeWidth="2" />
          <polygon points="102,60 96,40 85,55" fill="#f59e0b" stroke={strokeColor} strokeWidth="2" />
          <circle cx="80" cy="72" r="3" fill={strokeColor} />
          <circle cx="94" cy="72" r="3" fill={strokeColor} />
          <path d="M140 45 C130 35 130 55 140 50 C150 55 150 35 140 45 Z" fill="#ec4899" stroke={strokeColor} strokeWidth="2" />
        </svg>
      );

    case "contract":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <rect x="65" y="30" width="70" height="95" rx="6" fill="var(--bg-card, #ffffff)" stroke={strokeColor} strokeWidth="3" />
          <line x1="78" y1="48" x2="122" y2="48" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
          <line x1="78" y1="62" x2="122" y2="62" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
          <circle cx="118" cy="108" r="12" fill="#ef4444" stroke={strokeColor} strokeWidth="2" />
          <path d="M35 80 L52 80 M46 74 L52 80 L46 86" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M165 80 L148 80 M154 74 L148 80 L154 86" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case "retract":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <ellipse cx="100" cy="95" rx="42" ry="30" fill="#10b981" stroke={strokeColor} strokeWidth="3" />
          <path d="M100 68 L100 122 M70 85 L130 85" stroke="#047857" strokeWidth="2.5" />
          <path d="M135 95 Q145 95 140 102 Q132 102 135 95" fill="#a7f3d0" stroke={strokeColor} strokeWidth="2" />
          <ellipse cx="72" cy="120" rx="8" ry="5" fill="#a7f3d0" stroke={strokeColor} strokeWidth="2" />
          <ellipse cx="128" cy="120" rx="8" ry="5" fill="#a7f3d0" stroke={strokeColor} strokeWidth="2" />
        </svg>
      );

    case "abstract":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <rect x="40" y="25" width="120" height="110" rx="8" stroke={strokeColor} strokeWidth="3" fill="var(--bg-card, #ffffff)" />
          <circle cx="80" cy="65" r="22" fill="#60a5fa" stroke={strokeColor} strokeWidth="2.5" />
          <polygon points="120,45 145,85 95,85" fill="#f43f5e" stroke={strokeColor} strokeWidth="2.5" />
          <rect x="75" y="90" width="36" height="30" rx="4" fill="#fbbf24" stroke={strokeColor} strokeWidth="2.5" transform="rotate(-12 93 105)" />
        </svg>
      );

    case "subtract":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <rect x="40" y="45" width="40" height="12" rx="6" fill="#ef4444" stroke={strokeColor} strokeWidth="2" />
          <circle cx="110" cy="115" r="16" fill="#ef4444" stroke={strokeColor} strokeWidth="2.5" />
          <circle cx="145" cy="115" r="16" fill="#ef4444" stroke={strokeColor} strokeWidth="2.5" />
          <circle cx="130" cy="55" r="16" fill="rgba(239, 68, 68, 0.5)" stroke={strokeColor} strokeWidth="2" strokeDasharray="3 3" />
          <path d="M130 90 L130 75 M125 80 L130 75 L135 80" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case "protract":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <path d="M45 110 A55 55 0 0 1 155 110 Z" fill="rgba(37, 99, 235, 0.1)" stroke={strokeColor} strokeWidth="3" />
          <line x1="40" y1="110" x2="160" y2="110" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <line x1="100" y1="110" x2="145" y2="45" stroke="#db2777" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case "transport":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Xe tải chở hàng vận chuyển */}
          <rect x="40" y="55" width="75" height="50" rx="4" fill="#3b82f6" stroke={strokeColor} strokeWidth="3" />
          <path d="M115 70 L135 70 L150 90 L150 105 L115 105 Z" fill="#60a5fa" stroke={strokeColor} strokeWidth="3" />
          {/* Cửa sổ cabin */}
          <polygon points="120,75 133,75 142,90 120,90" fill="#e0f2fe" stroke={strokeColor} strokeWidth="1.5" />
          {/* Bánh xe */}
          <circle cx="65" cy="112" r="14" fill="#1e293b" stroke={strokeColor} strokeWidth="3" />
          <circle cx="65" cy="112" r="5" fill="#94a3b8" />
          <circle cx="135" cy="112" r="14" fill="#1e293b" stroke={strokeColor} strokeWidth="3" />
          <circle cx="135" cy="112" r="5" fill="#94a3b8" />
          {/* Vạch đường chuyển động */}
          <line x1="25" y1="126" x2="175" y2="126" stroke="#94a3b8" strokeWidth="3" strokeDasharray="10 8" />
        </svg>
      );

    case "import":
    case "export":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Thùng hàng container xuất nhập khẩu */}
          <rect x="65" y="55" width="70" height="60" rx="5" fill="#f59e0b" stroke={strokeColor} strokeWidth="3" />
          <line x1="88" y1="55" x2="88" y2="115" stroke={strokeColor} strokeWidth="2" />
          <line x1="112" y1="55" x2="112" y2="115" stroke={strokeColor} strokeWidth="2" />
          {/* Dấu mũi tên xuất khẩu (ra ngoài) / nhập khẩu (vào trong) */}
          <path d="M35 85 L55 85 M45 75 L55 85 L45 95" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M165 85 L145 85 M155 75 L145 85 L155 95" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case "portable":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Chiếc vali xách tay gọn nhẹ */}
          <rect x="55" y="50" width="90" height="65" rx="8" fill="#10b981" stroke={strokeColor} strokeWidth="3" />
          {/* Quai xách */}
          <path d="M85 50 L85 35 A15 15 0 0 1 115 35 L115 50" stroke={strokeColor} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          {/* Dải nẹp bảo vệ vali */}
          <line x1="82" y1="50" x2="82" y2="115" stroke="#047857" strokeWidth="2.5" />
          <line x1="118" y1="50" x2="118" y2="115" stroke="#047857" strokeWidth="2.5" />
          {/* Bánh xe di động */}
          <circle cx="70" cy="118" r="4" fill="#1e293b" />
          <circle cx="130" cy="118" r="4" fill="#1e293b" />
        </svg>
      );

    case "support":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Hai bàn tay nâng đỡ mầm cây phát triển */}
          <path d="M50 115 C55 95 80 90 95 105 C85 115 70 120 50 115 Z" fill="#fde047" stroke={strokeColor} strokeWidth="2.5" />
          <path d="M150 115 C145 95 120 90 105 105 C115 115 130 120 150 115 Z" fill="#fde047" stroke={strokeColor} strokeWidth="2.5" />
          {/* Mầm cây vươn lên */}
          <path d="M100 105 L100 60" stroke="#16a34a" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M100 75 Q85 60 85 75 Q100 80 100 75 Z" fill="#22c55e" stroke={strokeColor} strokeWidth="1.5" />
          <path d="M100 65 Q115 50 115 65 Q100 70 100 65 Z" fill="#22c55e" stroke={strokeColor} strokeWidth="1.5" />
        </svg>
      );

    case "conduct":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Dây đồng dẫn điện phát tia sáng */}
          <line x1="40" y1="80" x2="160" y2="80" stroke="#b45309" strokeWidth="6" strokeLinecap="round" />
          <line x1="45" y1="80" x2="155" y2="80" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          {/* Tia điện phát sáng lấp lánh */}
          <polygon points="95,50 105,75 97,75 107,105 92,82 100,82" fill="#eab308" stroke={strokeColor} strokeWidth="1.5" />
          <circle cx="160" cy="80" r="14" fill="rgba(234, 179, 8, 0.2)" stroke="#eab308" strokeWidth="2" strokeDasharray="2 2" />
        </svg>
      );

    case "produce":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Dây chuyền sản xuất băng tải và bánh răng */}
          <ellipse cx="60" cy="100" rx="14" ry="14" fill="#64748b" stroke={strokeColor} strokeWidth="2.5" />
          <ellipse cx="140" cy="100" rx="14" ry="14" fill="#64748b" stroke={strokeColor} strokeWidth="2.5" />
          <line x1="60" y1="86" x2="140" y2="86" stroke={strokeColor} strokeWidth="3" />
          <line x1="60" y1="114" x2="140" y2="114" stroke={strokeColor} strokeWidth="3" />
          {/* Sản phẩm hộp quà vừa hoàn thành */}
          <rect x="85" y="58" width="30" height="28" rx="3" fill="#ef4444" stroke={strokeColor} strokeWidth="2" />
          <line x1="100" y1="58" x2="100" y2="86" stroke="#fef08a" strokeWidth="2" />
        </svg>
      );

    case "educate":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Mũ cử nhân tốt nghiệp và quyển sách */}
          <polygon points="100,45 155,62 100,80 45,62" fill="#1e293b" stroke={strokeColor} strokeWidth="2.5" />
          <rect x="75" y="75" width="50" height="20" rx="4" fill="#334155" stroke={strokeColor} strokeWidth="2" />
          <line x1="140" y1="65" x2="145" y2="95" stroke="#f59e0b" strokeWidth="2.5" />
          <circle cx="145" cy="98" r="3.5" fill="#f59e0b" />
          {/* Quyển sách giáo dục bên dưới */}
          <path d="M60 115 Q100 105 100 120 Q100 105 140 115" stroke={strokeColor} strokeWidth="3" fill="none" />
        </svg>
      );

    case "introduce":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Hai người bắt tay giới thiệu nhau */}
          <path d="M60 90 L85 90 L100 105 L115 90 L140 90" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="65" cy="65" r="12" fill="#60a5fa" stroke={strokeColor} strokeWidth="2.5" />
          <circle cx="135" cy="65" r="12" fill="#34d399" stroke={strokeColor} strokeWidth="2.5" />
          {/* Dấu bắt tay nồng nhiệt */}
          <circle cx="100" cy="100" r="16" fill="rgba(245, 158, 11, 0.2)" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
        </svg>
      );

    default:
      return null;
  }
}

