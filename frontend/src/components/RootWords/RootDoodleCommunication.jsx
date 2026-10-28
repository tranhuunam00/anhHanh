import React from "react";

/**
 * Bộ vẽ Doodle SVG chuyên biệt cho Cụm 2: Nói & Viết (Communication & Language)
 * Đảm bảo 100% vector SVG vẽ tay tinh gọn, sắc nét cả Light/Dark Mode
 * Tuyệt đối không dùng ảnh người que chấm hỏi
 */
export function renderCommunicationDoodle(doodleKey, strokeColor = "var(--text-primary, #1e293b)") {
  const key = String(doodleKey || "").toLowerCase().trim();

  switch (key) {
    case "predict":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Quả cầu pha lê tiên tri */}
          <circle cx="100" cy="80" r="38" stroke={strokeColor} strokeWidth="3" fill="rgba(147, 51, 234, 0.12)" />
          {/* Chân đế quả cầu */}
          <path d="M80 120 L120 120 L128 140 L72 140 Z" stroke={strokeColor} strokeWidth="3" fill="var(--bg-card, #ffffff)" />
          {/* Ánh sáng sao lấp lánh bên trong */}
          <path d="M100 62 L103 72 L113 72 L105 78 L108 88 L100 82 L92 88 L95 78 L87 72 L97 72 Z" fill="#fbbf24" />
          <circle cx="118" cy="68" r="3" fill="#60a5fa" />
          <circle cx="82" cy="94" r="2.5" fill="#ec4899" />
          {/* Vầng hào quang tương lai */}
          <path d="M70 45 Q100 30 130 45" stroke="#a855f7" strokeWidth="2.5" strokeDasharray="3 3" />
        </svg>
      );

    case "contradict":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Hai mũi tên đối đầu ngược chiều nhau */}
          <path d="M45 65 L115 65 M105 52 L118 65 L105 78" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M155 95 L85 95 M95 82 L82 95 L95 108" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          {/* Dấu X mâu thuẫn ở giữa */}
          <line x1="88" y1="68" x2="112" y2="92" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />
          <line x1="112" y1="68" x2="88" y2="92" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />
          {/* Bong bóng lời nói va chạm */}
          <circle cx="100" cy="80" r="46" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 4" />
        </svg>
      );

    case "dictate":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Micro cổ điển */}
          <rect x="60" y="35" width="28" height="45" rx="14" fill="#3b82f6" stroke={strokeColor} strokeWidth="3" />
          <path d="M50 55 A24 24 0 0 0 98 55" stroke={strokeColor} strokeWidth="3" fill="none" />
          <line x1="74" y1="79" x2="74" y2="105" stroke={strokeColor} strokeWidth="3" />
          <line x1="58" y1="105" x2="90" y2="105" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          {/* Sóng âm truyền sang sổ chép */}
          <path d="M102 50 Q112 58 102 66" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M108 42 Q122 58 108 74" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
          {/* Sổ ghi chép chính tả */}
          <rect x="125" y="40" width="50" height="70" rx="6" fill="var(--bg-card, #ffffff)" stroke={strokeColor} strokeWidth="2.5" />
          <line x1="135" y1="55" x2="165" y2="55" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="135" y1="68" x2="165" y2="68" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="135" y1="81" x2="155" y2="81" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case "dictionary":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Cuốn từ điển dày dặn */}
          <rect x="55" y="30" width="85" height="105" rx="8" fill="#1e40af" stroke={strokeColor} strokeWidth="3" />
          {/* Gáy sách và trang giấy */}
          <path d="M55 30 Q50 82 55 135 L62 135 Q58 82 62 30 Z" fill="#1d4ed8" stroke={strokeColor} strokeWidth="2" />
          <rect x="68" y="40" width="60" height="85" rx="4" fill="var(--bg-card, #ffffff)" stroke={strokeColor} strokeWidth="2" />
          {/* Chữ A Z trên bìa từ điển */}
          <text x="98" y="70" fontSize="22" fontWeight="900" fill="#2563eb" textAnchor="middle">A-Z</text>
          <text x="98" y="92" fontSize="9" fontWeight="700" fill="#64748b" textAnchor="middle">DICT</text>
          {/* Dây ruy băng đánh dấu trang */}
          <path d="M110 30 L110 85 L116 78 L122 85 L122 30 Z" fill="#ef4444" />
        </svg>
      );

    case "verdict":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Búa thẩm phán gõ phán quyết */}
          <rect x="65" y="45" width="50" height="26" rx="6" fill="#854d0e" stroke={strokeColor} strokeWidth="3" transform="rotate(-25 90 58)" />
          <line x1="90" y1="58" x2="135" y2="95" stroke="#713f12" strokeWidth="6" strokeLinecap="round" />
          {/* Đế gỗ gõ búa */}
          <ellipse cx="65" cy="115" rx="36" ry="14" fill="#a16207" stroke={strokeColor} strokeWidth="3" />
          {/* Sóng tác động phán quyết dứt khoát */}
          <path d="M35 105 Q25 95 30 85" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M95 105 Q105 95 100 85" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case "describe":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Giá vẽ chân dung miêu tả chi tiết */}
          <rect x="55" y="30" width="75" height="90" rx="6" fill="var(--bg-card, #ffffff)" stroke={strokeColor} strokeWidth="3" />
          {/* Hình người trên tranh vẽ */}
          <circle cx="92" cy="62" r="14" stroke="#3b82f6" strokeWidth="2.5" />
          <path d="M76 95 C76 80 108 80 108 95" stroke="#3b82f6" strokeWidth="2.5" fill="none" />
          {/* Cây bút chì đang vẽ miêu tả */}
          <line x1="145" y1="40" x2="120" y2="75" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
          <polygon points="120,75 114,83 124,80" fill="#334155" />
        </svg>
      );

    case "prescribe":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Bảng đơn thuốc của bác sĩ với ký hiệu Rx */}
          <rect x="55" y="30" width="65" height="95" rx="6" fill="var(--bg-card, #ffffff)" stroke={strokeColor} strokeWidth="3" />
          <rect x="75" y="24" width="25" height="12" rx="3" fill="#94a3b8" stroke={strokeColor} strokeWidth="2" />
          <text x="80" y="65" fontSize="18" fontWeight="900" fill="#dc2626">Rx</text>
          <line x1="70" y1="80" x2="105" y2="80" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="70" y1="92" x2="100" y2="92" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
          {/* Lọ thuốc con nhộng kế bên */}
          <rect x="128" y="70" width="30" height="50" rx="8" fill="#10b981" stroke={strokeColor} strokeWidth="2.5" />
          <path d="M135 60 L151 60 L151 70 L135 70 Z" fill="#ffffff" stroke={strokeColor} strokeWidth="2" />
          <line x1="128" y1="95" x2="158" y2="95" stroke="#ffffff" strokeWidth="2.5" />
        </svg>
      );

    case "subscribe":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Quả chuông đăng ký thông báo */}
          <path
            d="M100 40 C85 40 75 55 75 75 L68 98 L132 98 L125 75 C125 55 115 40 100 40 Z"
            fill="#fbbf24"
            stroke={strokeColor}
            strokeWidth="3"
          />
          <circle cx="100" cy="35" r="5" fill="#f59e0b" stroke={strokeColor} strokeWidth="2" />
          <path d="M92 103 A10 10 0 0 0 108 103" stroke={strokeColor} strokeWidth="3" fill="none" />
          {/* Nút đăng ký với dấu tick xanh */}
          <rect x="58" y="115" width="84" height="24" rx="12" fill="#ef4444" />
          <text x="100" y="131" fontSize="10" fontWeight="800" fill="#ffffff" textAnchor="middle">SUBSCRIBE</text>
          {/* Sóng rung phát chuông */}
          <path d="M55 70 Q45 80 55 90" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M145 70 Q155 80 145 90" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case "vocal":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Chú chim ca hát cất giọng */}
          <ellipse cx="85" cy="85" rx="25" ry="18" fill="#60a5fa" stroke={strokeColor} strokeWidth="3" />
          <circle cx="102" cy="72" r="14" fill="#93c5fd" stroke={strokeColor} strokeWidth="2.5" />
          <polygon points="115,70 128,74 115,78" fill="#f59e0b" stroke={strokeColor} strokeWidth="2" />
          <circle cx="106" cy="69" r="2.5" fill={strokeColor} />
          {/* Cánh chim */}
          <path d="M72 82 Q85 70 95 85" stroke={strokeColor} strokeWidth="2.5" fill="#3b82f6" />
          {/* Các nốt nhạc bay bổng */}
          <circle cx="140" cy="55" r="5" fill="#ec4899" />
          <line x1="145" y1="55" x2="145" y2="35" stroke={strokeColor} strokeWidth="2.5" />
          <circle cx="160" cy="45" r="5" fill="#ec4899" />
          <line x1="165" y1="45" x2="165" y2="25" stroke={strokeColor} strokeWidth="2.5" />
          <line x1="145" y1="35" x2="165" y2="25" stroke={strokeColor} strokeWidth="2.5" />
        </svg>
      );

    case "revoke":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Giấy phép bị đóng dấu VOID thu hồi */}
          <rect x="55" y="35" width="90" height="95" rx="8" fill="var(--bg-card, #ffffff)" stroke={strokeColor} strokeWidth="3" />
          <line x1="70" y1="52" x2="130" y2="52" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="70" y1="66" x2="130" y2="66" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
          {/* Dấu đỏ thu hồi lớn REVOKED */}
          <rect x="45" y="70" width="110" height="32" rx="4" fill="#fee2e2" stroke="#ef4444" strokeWidth="3" transform="rotate(-15 100 86)" />
          <text x="100" y="92" fontSize="14" fontWeight="900" fill="#dc2626" textAnchor="middle" transform="rotate(-15 100 86)">REVOKED</text>
        </svg>
      );

    case "exclaim":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Bong bóng thoại nổ tung thốt lên */}
          <polygon
            points="100,25 115,50 145,35 135,65 165,75 140,95 160,125 125,115 115,145 95,120 70,140 75,110 40,115 60,90 35,70 65,60 55,30 85,45"
            fill="#fef08a"
            stroke={strokeColor}
            strokeWidth="3"
          />
          {/* Dấu chấm than lớn phấn khích */}
          <line x1="100" y1="55" x2="100" y2="92" stroke="#ef4444" strokeWidth="7" strokeLinecap="round" />
          <circle cx="100" cy="107" r="4.5" fill="#ef4444" />
        </svg>
      );

    case "bilingual":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Hai quả cầu ngôn ngữ song song kết nối */}
          <circle cx="70" cy="75" r="30" fill="rgba(37, 99, 235, 0.1)" stroke="#2563eb" strokeWidth="3" />
          <text x="70" y="80" fontSize="11" fontWeight="800" fill="#2563eb" textAnchor="middle">EN</text>
          <circle cx="130" cy="75" r="30" fill="rgba(219, 39, 119, 0.1)" stroke="#db2777" strokeWidth="3" />
          <text x="130" y="80" fontSize="11" fontWeight="800" fill="#db2777" textAnchor="middle">VI</text>
          {/* Cầu nối song ngữ hai chiều */}
          <path d="M85 55 Q100 45 115 55" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
          <path d="M115 95 Q100 105 85 95" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case "eloquent":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Bục diễn thuyết hùng biện với lá nguyệt quế */}
          <polygon points="75,60 125,60 115,130 85,130" fill="var(--bg-card, #ffffff)" stroke={strokeColor} strokeWidth="3" />
          <rect x="68" y="52" width="64" height="12" rx="3" fill="#e2e8f0" stroke={strokeColor} strokeWidth="2.5" />
          {/* Vòng nguyệt quế tài năng */}
          <path d="M80 90 Q70 100 80 110" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
          <path d="M120 90 Q130 100 120 110" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
          {/* Ngôi sao tỏa sáng */}
          <path d="M100 30 L103 38 L111 38 L105 43 L107 51 L100 46 L93 51 L95 43 L89 38 L97 38 Z" fill="#fbbf24" />
        </svg>
      );

    case "proverb":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Cuộn giấy cổ tục ngữ */}
          <rect x="55" y="45" width="90" height="70" rx="4" fill="#fef3c7" stroke={strokeColor} strokeWidth="3" />
          <path d="M45 45 C45 35 60 35 60 45 L60 115 C60 125 45 125 45 115 Z" fill="#fde68a" stroke={strokeColor} strokeWidth="2.5" />
          <path d="M145 45 C145 35 160 35 160 45 L160 115 C160 125 145 125 145 115 Z" fill="#fde68a" stroke={strokeColor} strokeWidth="2.5" />
          {/* Các dòng chữ danh ngôn */}
          <line x1="72" y1="65" x2="132" y2="65" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="72" y1="80" x2="132" y2="80" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="72" y1="95" x2="115" y2="95" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    default:
      return null;
  }
}
