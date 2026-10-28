import React from "react";

/**
 * Bộ vẽ Doodle SVG chuyên biệt cho Cụm 2: Nói & Viết - Phần 2
 * Gốc 8: phon (âm thanh, tiếng nói), Gốc 9: graph/gram (viết, vẽ, ghi lại)
 * Đảm bảo 100% vector SVG vẽ tay tinh gọn, sắc nét cả Light/Dark Mode
 * Tuân thủ Rule 4: File code < 500 dòng
 */
export function renderCommunicationDoodlePart2(doodleKey, strokeColor = "var(--text-primary, #1e293b)") {
  const key = String(doodleKey || "").toLowerCase().trim();

  switch (key) {
    case "telephone":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Ống nghe điện thoại cổ điển */}
          <path
            d="M55 60 C55 45 75 40 85 55 L95 70 C100 78 95 85 88 88 C98 102 110 114 124 124 C127 117 134 112 142 117 L157 127 C172 137 167 157 152 157 C120 157 60 100 55 60 Z"
            fill="#3b82f6"
            stroke={strokeColor}
            strokeWidth="3"
            transform="scale(0.85) translate(20, -10)"
          />
          {/* Thân máy điện thoại bàn tròn */}
          <rect x="75" y="65" width="65" height="55" rx="10" fill="var(--bg-card, #ffffff)" stroke={strokeColor} strokeWidth="3" />
          {/* Vòng quay số cổ điển */}
          <circle cx="107" cy="92" r="18" fill="#f1f5f9" stroke={strokeColor} strokeWidth="2.5" />
          <circle cx="107" cy="92" r="6" fill="#64748b" />
          <circle cx="107" cy="79" r="2.5" fill="#3b82f6" />
          <circle cx="118" cy="85" r="2.5" fill="#3b82f6" />
          <circle cx="120" cy="97" r="2.5" fill="#3b82f6" />
          <circle cx="113" cy="106" r="2.5" fill="#3b82f6" />
          <circle cx="101" cy="106" r="2.5" fill="#3b82f6" />
          {/* Sóng âm chuông reo leng keng */}
          <path d="M45 40 Q35 55 45 70" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M35 32 Q20 55 35 78" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M155 40 Q165 55 155 70" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case "symphony":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Khóa Sol âm nhạc mềm mại */}
          <path
            d="M85 125 C80 125 75 120 75 115 C75 105 95 100 95 85 C95 65 85 45 85 30 C85 20 95 20 95 30 C95 50 70 85 70 105 C70 120 85 135 100 130"
            stroke="#a855f7"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <line x1="88" y1="25" x2="88" y2="135" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" />
          <circle cx="88" cy="138" r="4.5" fill="#a855f7" />
          {/* Gậy chỉ huy của nhạc trưởng */}
          <line x1="60" y1="130" x2="140" y2="40" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          <circle cx="58" cy="132" r="5" fill="#d97706" />
          {/* Các nốt nhạc bay múa trong không gian giao hưởng */}
          <circle cx="135" cy="75" r="5" fill="#3b82f6" />
          <line x1="140" y1="75" x2="140" y2="52" stroke="#3b82f6" strokeWidth="2.5" />
          <circle cx="160" cy="65" r="5" fill="#ec4899" />
          <line x1="165" y1="65" x2="165" y2="42" stroke="#ec4899" strokeWidth="2.5" />
          <line x1="140" y1="52" x2="165" y2="42" stroke="#3b82f6" strokeWidth="3" />
          {/* Ngôi sao lấp lánh */}
          <path d="M165 95 L168 102 L175 102 L169 106 L171 113 L165 109 L159 113 L161 106 L155 102 L162 102 Z" fill="#fbbf24" />
        </svg>
      );

    case "microphone":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Đầu micrô kim loại tròn */}
          <rect x="85" y="30" width="30" height="50" rx="15" fill="#3b82f6" stroke={strokeColor} strokeWidth="3" />
          {/* Lưới micrô */}
          <line x1="85" y1="45" x2="115" y2="45" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.8" />
          <line x1="85" y1="58" x2="115" y2="58" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.8" />
          <line x1="100" y1="30" x2="100" y2="70" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.8" />
          {/* Giá đỡ chữ U */}
          <path d="M72 55 A28 28 0 0 0 128 55" stroke={strokeColor} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          {/* Cột đứng và chân đế tròn */}
          <line x1="100" y1="83" x2="100" y2="120" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" />
          <ellipse cx="100" cy="125" rx="30" ry="8" fill="var(--bg-card, #ffffff)" stroke={strokeColor} strokeWidth="3" />
          {/* Sóng âm thanh tỏa đều */}
          <path d="M135 40 Q148 55 135 70" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M145 30 Q162 55 145 80" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case "phonetics":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Vòm miệng & sóng âm ký hiệu ngữ âm */}
          <path d="M60 80 Q75 60 90 80" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
          <path d="M60 80 Q75 100 90 80" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
          {/* Ký hiệu phiên âm quốc tế IPA /fəˈnetɪks/ trên bảng */}
          <rect x="95" y="45" width="80" height="70" rx="8" fill="rgba(59, 130, 246, 0.1)" stroke={strokeColor} strokeWidth="2.5" />
          <text x="135" y="75" fontSize="22" fontWeight="800" fill="#2563eb" textAnchor="middle">/f/</text>
          <text x="135" y="100" fontSize="18" fontWeight="700" fill="#a855f7" textAnchor="middle">/əʊ/</text>
          {/* Sóng dao động âm học */}
          <path d="M35 80 L42 65 L48 95 L54 75 L60 80" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case "cacophony":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Biểu tượng còi xe & loa phóng thanh phát âm thanh chói tai */}
          <path d="M50 70 L75 70 L100 50 L100 110 L75 90 L50 90 Z" fill="#ef4444" stroke={strokeColor} strokeWidth="3" />
          {/* Tia âm thanh zigzag sắc nhọn khó chịu */}
          <path d="M115 50 L130 65 L120 75 L145 70 L135 85 L160 80" stroke="#dc2626" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M115 105 L130 95 L122 110 L145 105 L138 120 L160 115" stroke="#dc2626" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Dấu chấm than cảnh báo chói tai */}
          <polygon points="172,45 180,45 178,75 174,75" fill="#f59e0b" stroke={strokeColor} strokeWidth="1" />
          <circle cx="176" cy="85" r="3" fill="#f59e0b" />
        </svg>
      );

    case "biography":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Quyển sách tiểu sử mở ra */}
          <path d="M40 40 Q100 30 100 45 Q100 30 160 40 L155 125 Q100 115 100 130 Q100 115 45 125 Z" fill="var(--bg-card, #ffffff)" stroke={strokeColor} strokeWidth="3" />
          <line x1="100" y1="45" x2="100" y2="130" stroke={strokeColor} strokeWidth="2.5" />
          {/* Khung chân dung người nổi tiếng bên trang trái */}
          <circle cx="72" cy="70" r="16" fill="#e2e8f0" stroke={strokeColor} strokeWidth="2" />
          <circle cx="72" cy="65" r="6" fill="#3b82f6" />
          <path d="M62 78 C62 72 82 72 82 78" stroke="#3b82f6" strokeWidth="2" fill="none" />
          {/* Các dòng chữ cuộc đời bên trang phải */}
          <line x1="112" y1="60" x2="148" y2="60" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="112" y1="75" x2="148" y2="75" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="112" y1="90" x2="138" y2="90" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
          {/* Ngôi sao tỏa sáng cuộc đời vĩ đại */}
          <path d="M72 102 L74 107 L80 107 L75 110 L77 115 L72 112 L67 115 L69 110 L64 107 L70 107 Z" fill="#fbbf24" />
        </svg>
      );

    case "autograph":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Bút máy cao cấp */}
          <path d="M125 35 L155 65 L85 135 L55 135 L55 105 Z" fill="#3b82f6" stroke={strokeColor} strokeWidth="2.5" />
          <polygon points="55,135 42,145 65,135" fill="#f59e0b" stroke={strokeColor} strokeWidth="2" />
          <circle cx="48" cy="140" r="1.5" fill={strokeColor} />
          {/* Chữ ký nghệ thuật uốn lượn bay bổng */}
          <path d="M45 100 Q70 65 95 95 T145 80 T170 110" stroke="#10b981" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* Ngôi sao chữ ký lưu niệm */}
          <path d="M150 40 L152 45 L157 45 L153 48 L155 53 L150 50 L145 53 L147 48 L143 45 L148 45 Z" fill="#eab308" />
        </svg>
      );

    case "photograph":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Máy ảnh retro chụp ảnh */}
          <rect x="55" y="55" width="90" height="65" rx="10" fill="#3b82f6" stroke={strokeColor} strokeWidth="3" />
          {/* Gờ kính ngắm trên nóc máy ảnh */}
          <rect x="80" y="42" width="40" height="14" rx="3" fill="#1d4ed8" stroke={strokeColor} strokeWidth="2.5" />
          {/* Nút bấm chụp */}
          <rect x="63" y="47" width="12" height="8" rx="2" fill="#ef4444" stroke={strokeColor} strokeWidth="2" />
          {/* Ống kính máy ảnh trung tâm */}
          <circle cx="100" cy="88" r="22" fill="#1e293b" stroke="#ffffff" strokeWidth="3" />
          <circle cx="100" cy="88" r="14" fill="#0f172a" />
          {/* Điểm lóe sáng thấu kính */}
          <circle cx="95" cy="83" r="4" fill="#38bdf8" />
          {/* Tia sáng flash bùng nổ */}
          <path d="M135 38 L142 30 M148 42 L158 38 M140 48 L150 50" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case "calligraphy":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Bút lông thư pháp truyền thống */}
          <rect x="130" y="25" width="12" height="75" rx="3" fill="#78350f" stroke={strokeColor} strokeWidth="2" transform="rotate(-30 136 62)" />
          {/* Lông cọ mềm uốn lượn có mực */}
          <path d="M100 85 Q92 105 82 120 Q92 110 106 95 Z" fill="#0f172a" stroke={strokeColor} strokeWidth="1.5" />
          {/* Nét chữ thư pháp đen huyền thoại trên cuộn giấy */}
          <path d="M50 70 Q70 50 85 80 Q95 115 65 125 Q45 130 65 95" stroke="#0f172a" strokeWidth="5" strokeLinecap="round" fill="none" />
          {/* Giọt mực tàu rơi nhẹ */}
          <circle cx="118" cy="125" r="4.5" fill="#0f172a" />
        </svg>
      );

    case "diagram":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Khối sơ đồ trung tâm */}
          <rect x="75" y="30" width="50" height="30" rx="6" fill="#3b82f6" stroke={strokeColor} strokeWidth="2.5" />
          <text x="100" y="50" fontSize="12" fontWeight="700" fill="#ffffff" textAnchor="middle">ROOT</text>
          {/* Mũi tên phân nhánh sang 2 bên */}
          <path d="M100 60 L100 78 M100 78 L55 78 L55 95" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M100 78 L145 78 L145 95" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
          {/* Hai khối con phân nhánh */}
          <rect x="35" y="95" width="40" height="28" rx="5" fill="#10b981" stroke={strokeColor} strokeWidth="2" />
          <rect x="125" y="95" width="40" height="28" rx="5" fill="#f59e0b" stroke={strokeColor} strokeWidth="2" />
          <text x="55" y="113" fontSize="10" fontWeight="700" fill="#ffffff" textAnchor="middle">SUB A</text>
          <text x="145" y="113" fontSize="10" fontWeight="700" fill="#ffffff" textAnchor="middle">SUB B</text>
        </svg>
      );

    case "telegram":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Băng giấy điện tín in chữ cổ điển */}
          <rect x="45" y="55" width="110" height="50" rx="4" fill="#fef9c3" stroke={strokeColor} strokeWidth="3" />
          {/* Dải đục lỗ mã Morse */}
          <circle cx="65" cy="72" r="3" fill="#b45309" />
          <line x1="75" y1="72" x2="88" y2="72" stroke="#b45309" strokeWidth="3" strokeLinecap="round" />
          <circle cx="98" cy="72" r="3" fill="#b45309" />
          <line x1="108" y1="72" x2="120" y2="72" stroke="#b45309" strokeWidth="3" strokeLinecap="round" />
          <circle cx="130" cy="72" r="3" fill="#b45309" />
          {/* Chữ URGENT TELEGRAM */}
          <text x="100" y="92" fontSize="11" fontWeight="800" fill="#92400e" textAnchor="middle">TELEGRAM</text>
          {/* Tia truyền tin từ xa */}
          <path d="M35 50 Q20 80 35 110" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" />
          <path d="M165 50 Q180 80 165 110" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" />
        </svg>
      );

    default:
      return null;
  }
}

