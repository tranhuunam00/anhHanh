import React from "react";

/**
 * Bộ vẽ Doodle SVG chuyên biệt cho Cụm 2: Nói & Viết - Phần 1
 * Gốc: dict, scrib, voc, clam, lingua, loqu, verb
 * Đảm bảo 100% vector SVG vẽ tay tinh gọn, sắc nét cả Light/Dark Mode
 */
export function renderCommunicationDoodlePart1(doodleKey, strokeColor = "var(--text-primary, #1e293b)") {
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
          <path d="M108 50 Q116 57 108 65" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M115 42 Q126 57 115 72" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
          {/* Quyển sổ tốc ký */}
          <rect x="126" y="45" width="36" height="50" rx="3" fill="var(--bg-card, #ffffff)" stroke={strokeColor} strokeWidth="2.5" />
          <line x1="134" y1="58" x2="152" y2="58" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          <line x1="134" y1="68" x2="152" y2="68" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          <line x1="134" y1="78" x2="148" y2="78" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case "dictionary":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Quyển từ điển bách khoa dày cộp */}
          <rect x="55" y="35" width="75" height="95" rx="6" fill="#3b82f6" stroke={strokeColor} strokeWidth="3" />
          {/* Gáy sách & trang sách */}
          <path d="M130 42 L142 45 L142 136 L130 130 Z" fill="#f8fafc" stroke={strokeColor} strokeWidth="2.5" />
          <path d="M55 130 Q92 136 130 130" stroke={strokeColor} strokeWidth="3" />
          {/* Chữ A-Z nổi bật trên bìa từ điển */}
          <text x="75" y="75" fontSize="24" fontWeight="900" fill="#ffffff" fontFamily="serif">A</text>
          <text x="89" y="86" fontSize="16" fontWeight="700" fill="#fde047" fontFamily="sans-serif">-</text>
          <text x="96" y="98" fontSize="24" fontWeight="900" fill="#ffffff" fontFamily="serif">Z</text>
          {/* Dải ruy băng đánh dấu trang */}
          <path d="M102 35 L102 60 L110 52 L118 60 L118 35" fill="#ef4444" stroke={strokeColor} strokeWidth="1.5" />
        </svg>
      );

    case "verdict":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Búa công lý thẩm phán phán quyết */}
          <rect x="65" y="50" width="70" height="28" rx="4" fill="#854d0e" stroke={strokeColor} strokeWidth="3" transform="rotate(-25 100 64)" />
          <rect x="94" y="68" width="12" height="65" rx="3" fill="#a16207" stroke={strokeColor} strokeWidth="2.5" transform="rotate(-25 100 100)" />
          {/* Đế gỗ gõ búa */}
          <ellipse cx="130" cy="125" rx="40" ry="14" fill="#ca8a04" stroke={strokeColor} strokeWidth="3" />
          {/* Tia sóng phán quyết lan tỏa */}
          <path d="M95 105 Q130 90 165 105" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="3 3" />
        </svg>
      );

    case "describe":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Bức tranh phong cảnh miêu tả chi tiết */}
          <rect x="50" y="35" width="75" height="90" rx="4" fill="var(--bg-card, #ffffff)" stroke={strokeColor} strokeWidth="3" />
          {/* Núi và mặt trời trong tranh */}
          <polygon points="56,110 75,75 95,110" fill="#10b981" stroke={strokeColor} strokeWidth="2" />
          <polygon points="85,110 105,65 120,110" fill="#059669" stroke={strokeColor} strokeWidth="2" />
          <circle cx="108" cy="55" r="8" fill="#fbbf24" stroke={strokeColor} strokeWidth="1.5" />
          {/* Cây bút lông đang vẽ tô điểm */}
          <path d="M135 45 L155 25 L165 35 L145 55 Z" fill="#3b82f6" stroke={strokeColor} strokeWidth="2" />
          <polygon points="135,45 130,55 140,55" fill="#f59e0b" stroke={strokeColor} strokeWidth="1.5" />
          <circle cx="127" cy="60" r="2.5" fill="#f59e0b" />
        </svg>
      );

    case "prescribe":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Toa thuốc bác sĩ ký gửi */}
          <rect x="55" y="32" width="65" height="95" rx="5" fill="var(--bg-card, #ffffff)" stroke={strokeColor} strokeWidth="3" />
          {/* Biểu tượng chữ Rx y tế */}
          <text x="68" y="62" fontSize="24" fontWeight="900" fill="#ef4444" fontFamily="serif">℞</text>
          {/* Các dòng chữ kê đơn */}
          <line x1="68" y1="78" x2="105" y2="78" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="68" y1="90" x2="105" y2="90" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="68" y1="102" x2="95" y2="102" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
          {/* Lọ thuốc viên nén kế bên */}
          <rect x="128" y="65" width="30" height="55" rx="4" fill="#3b82f6" stroke={strokeColor} strokeWidth="2.5" />
          <rect x="132" y="55" width="22" height="10" rx="2" fill="#e2e8f0" stroke={strokeColor} strokeWidth="2" />
          {/* Dấu thập đỏ trên nhãn lọ */}
          <rect x="133" y="78" width="20" height="25" fill="#ffffff" rx="2" />
          <line x1="143" y1="83" x2="143" y2="97" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
          <line x1="136" y1="90" x2="150" y2="90" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case "subscribe":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Nút bấm Subscribe rực rỡ */}
          <rect x="45" y="60" width="110" height="42" rx="21" fill="#ef4444" stroke={strokeColor} strokeWidth="3" />
          {/* Chuông thông báo rung lắc */}
          <path d="M72 72 A6 6 0 0 1 84 72 L86 82 L70 82 Z" fill="#fde047" stroke={strokeColor} strokeWidth="2" />
          <circle cx="78" cy="85" r="2" fill="#f59e0b" />
          {/* Chữ SUB */}
          <text x="96" y="88" fontSize="16" fontWeight="900" fill="#ffffff" fontFamily="sans-serif">SUB</text>
          {/* Con trỏ chuột click vào nút */}
          <polygon points="125,92 135,115 142,108 152,118 156,114 146,104 155,98" fill="#ffffff" stroke={strokeColor} strokeWidth="2" />
          {/* Tia lấp lánh khi đăng ký */}
          <path d="M155 55 L160 62 M168 70 L176 72" stroke="#eab308" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case "vocal":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Biểu tượng miệng hát phát ra nốt nhạc du dương */}
          <ellipse cx="85" cy="80" rx="35" ry="25" fill="rgba(239, 68, 68, 0.15)" stroke={strokeColor} strokeWidth="3" />
          {/* Khuôn miệng hé mở ngân nga */}
          <path d="M62 80 Q85 100 108 80 Q85 86 62 80 Z" fill="#ef4444" stroke={strokeColor} strokeWidth="2" />
          {/* Các nốt nhạc bay lượn trên cao */}
          <circle cx="130" cy="55" r="5" fill="#3b82f6" />
          <line x1="135" y1="55" x2="135" y2="35" stroke="#3b82f6" strokeWidth="2.5" />
          <path d="M135 35 Q145 38 148 45" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="155" cy="75" r="4.5" fill="#10b981" />
          <line x1="159.5" y1="75" x2="159.5" y2="58" stroke="#10b981" strokeWidth="2.5" />
          <circle cx="120" cy="110" r="4" fill="#a855f7" />
          <line x1="124" y1="110" x2="124" y2="92" stroke="#a855f7" strokeWidth="2" />
        </svg>
      );

    case "revoke":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Con dấu hủy bỏ REVOKED đóng chéo qua tấm bằng */}
          <rect x="50" y="35" width="80" height="95" rx="5" fill="var(--bg-card, #ffffff)" stroke={strokeColor} strokeWidth="3" />
          <line x1="65" y1="55" x2="115" y2="55" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="65" y1="70" x2="115" y2="70" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="65" y1="85" x2="100" y2="85" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
          {/* Dấu đỏ REVOKED chéo */}
          <rect x="40" y="70" width="115" height="30" rx="4" fill="#fee2e2" stroke="#ef4444" strokeWidth="3" transform="rotate(-18 97 85)" />
          <text x="52" y="92" fontSize="16" fontWeight="900" fill="#dc2626" transform="rotate(-18 97 85)">REVOKED</text>
        </svg>
      );

    case "exclaim":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Bong bóng lời nói thốt lên dấu chấm than kinh ngạc */}
          <path d="M50 40 Q100 20 150 40 Q170 80 140 110 L145 130 L120 115 Q100 125 50 100 Q30 70 50 40 Z" fill="#fef08a" stroke={strokeColor} strokeWidth="3" />
          {/* Dấu chấm than to đùng nổi bật */}
          <polygon points="94,45 106,45 103,85 97,85" fill="#ef4444" stroke={strokeColor} strokeWidth="1.5" />
          <circle cx="100" cy="98" r="5" fill="#ef4444" stroke={strokeColor} strokeWidth="1.5" />
          {/* Tia sốc bất ngờ */}
          <line x1="35" y1="40" x2="22" y2="35" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          <line x1="165" y1="40" x2="178" y2="35" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case "bilingual":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Hai quả cầu ngôn ngữ A và 文 kết nối */}
          <circle cx="75" cy="80" r="32" fill="#dbeafe" stroke={strokeColor} strokeWidth="3" />
          <text x="75" y="90" fontSize="26" fontWeight="900" fill="#2563eb" textAnchor="middle">EN</text>
          <circle cx="125" cy="80" r="32" fill="#dcfce7" stroke={strokeColor} strokeWidth="3" />
          <text x="125" y="90" fontSize="26" fontWeight="900" fill="#16a34a" textAnchor="middle">VI</text>
          {/* Cầu nối song ngữ */}
          <path d="M85 65 Q100 55 115 65" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
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

