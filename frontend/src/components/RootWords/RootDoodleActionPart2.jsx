import React from "react";

/**
 * Bộ vẽ Doodle SVG chuyên biệt cho Cụm 3: Hành động & Di chuyển - Phần 2
 * Gốc: mit, vert, mot, ced, ven, pel
 * Đảm bảo 100% vector SVG vẽ tay tinh gọn, sắc nét cả Light/Dark Mode
 * Tuân thủ Rule 4: File code < 500 dòng
 */
export function renderActionDoodlePart2(doodleKey, strokeColor = "var(--text-primary, #1e293b)") {
  const key = String(doodleKey || "").toLowerCase().trim();

  switch (key) {
    case "transmit":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Tháp ăng-ten phát sóng */}
          <polygon points="100,35 85,125 115,125" stroke={strokeColor} strokeWidth="3" fill="none" />
          <line x1="88" y1="95" x2="112" y2="95" stroke={strokeColor} strokeWidth="2.5" />
          <line x1="92" y1="65" x2="108" y2="65" stroke={strokeColor} strokeWidth="2.5" />
          <circle cx="100" cy="35" r="5" fill="#ef4444" />
          {/* Sóng vô tuyến phát truyền hai bên */}
          <path d="M80 30 Q70 35 80 40" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M70 20 Q55 35 70 50" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M120 30 Q130 35 120 40" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M130 20 Q145 35 130 50" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case "submit":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Khay đựng tài liệu Inbox */}
          <path d="M45 85 L65 115 L135 115 L155 85 L135 85 L125 98 L75 98 L65 85 Z" fill="var(--bg-card, #ffffff)" stroke={strokeColor} strokeWidth="3" />
          {/* Trang giấy bài tập đang được thả vào khay */}
          <rect x="75" y="35" width="50" height="55" rx="3" fill="#dbeafe" stroke={strokeColor} strokeWidth="2.5" />
          <line x1="85" y1="50" x2="115" y2="50" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
          <line x1="85" y1="62" x2="115" y2="62" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
          {/* Mũi tên nộp bài hướng xuống */}
          <path d="M100 20 L100 32 M95 27 L100 32 L105 27" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case "dismiss":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Cánh cửa mở ra đón nắng */}
          <rect x="55" y="40" width="45" height="85" rx="2" fill="var(--bg-card, #ffffff)" stroke={strokeColor} strokeWidth="3" />
          <polygon points="55,40 95,30 95,115 55,125" fill="#e0e7ff" stroke={strokeColor} strokeWidth="2.5" />
          <circle cx="88" cy="75" r="3" fill="#f59e0b" />
          {/* Mũi tên cho phép ra về vui vẻ */}
          <path d="M110 80 L145 80 M135 70 L145 80 L135 90" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case "convert":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Vòng tuần hoàn chuyển đổi 2 mũi tên đối xứng */}
          <path d="M70 65 A35 35 0 0 1 130 65" stroke="#3b82f6" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <polygon points="130,55 142,65 130,75" fill="#3b82f6" />
          <path d="M130 95 A35 35 0 0 1 70 95" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <polygon points="70,105 58,95 70,85" fill="#10b981" />
          {/* Biểu tượng tiền tệ / định dạng chuyển đổi ở giữa */}
          <circle cx="100" cy="80" r="16" fill="var(--bg-card, #ffffff)" stroke={strokeColor} strokeWidth="2" />
          <text x="100" y="86" fontSize="14" fontWeight="800" fill="#f59e0b" textAnchor="middle">⇄</text>
        </svg>
      );

    case "divert":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Ngã rẽ chuyển hướng đường */}
          <path d="M100 135 L100 95 Q100 65 65 65" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" strokeDasharray="4 4" fill="none" />
          <path d="M100 95 Q100 65 135 65" stroke="#3b82f6" strokeWidth="5" strokeLinecap="round" fill="none" />
          <polygon points="135,55 150,65 135,75" fill="#3b82f6" />
          {/* Biển báo chuyển hướng màu vàng */}
          <polygon points="50,45 65,30 80,45 65,60" fill="#fde047" stroke={strokeColor} strokeWidth="2" />
          <text x="65" y="49" fontSize="12" fontWeight="900" fill="#000000" textAnchor="middle">!</text>
        </svg>
      );

    case "introvert":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Đèn bàn ấm cúng rọi vào cuốn sách bình yên */}
          <ellipse cx="100" cy="120" rx="40" ry="12" fill="rgba(254, 240, 138, 0.35)" />
          {/* Đèn bàn */}
          <path d="M70 120 L75 75 L95 65" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" fill="none" />
          <polygon points="90,55 115,50 110,72 85,77" fill="#f59e0b" stroke={strokeColor} strokeWidth="2" />
          {/* Cuốn sách mở dưới ánh đèn */}
          <path d="M85 110 Q105 105 105 115 Q105 105 125 110 L123 120 Q105 115 105 125 Q105 115 87 120 Z" fill="#ffffff" stroke={strokeColor} strokeWidth="2" />
        </svg>
      );

    case "extrovert":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Vầng thái dương tỏa tia sáng năng lượng */}
          <circle cx="100" cy="80" r="28" fill="#fde047" stroke={strokeColor} strokeWidth="3" />
          <circle cx="92" cy="75" r="3" fill="#1e293b" />
          <circle cx="108" cy="75" r="3" fill="#1e293b" />
          <path d="M92 85 Q100 95 108 85" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
          {/* Các tia sáng hướng ngoại tỏa ra bốn phương */}
          <line x1="100" y1="42" x2="100" y2="28" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          <line x1="100" y1="118" x2="100" y2="132" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          <line x1="62" y1="80" x2="48" y2="80" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          <line x1="138" y1="80" x2="152" y2="80" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          <line x1="72" y1="52" x2="60" y2="40" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          <line x1="128" y1="108" x2="140" y2="120" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case "promote":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Bục vinh quang 3 bậc với mũi tên thăng tiến */}
          <rect x="45" y="90" width="35" height="35" fill="#93c5fd" stroke={strokeColor} strokeWidth="2.5" />
          <rect x="80" y="65" width="40" height="60" fill="#3b82f6" stroke={strokeColor} strokeWidth="2.5" />
          <rect x="120" y="105" width="35" height="20" fill="#bfdbfe" stroke={strokeColor} strokeWidth="2.5" />
          {/* Ngôi sao chiến thắng trên bậc cao nhất */}
          <path d="M100 35 L103 43 L111 43 L105 48 L107 56 L100 51 L93 56 L95 48 L89 43 L97 43 Z" fill="#fbbf24" />
          <path d="M135 70 L155 45 M145 45 L155 45 L155 55" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case "motivate":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Quả pin năng lượng tràn đầy 100% */}
          <rect x="65" y="55" width="70" height="42" rx="8" stroke={strokeColor} strokeWidth="3" fill="var(--bg-card, #ffffff)" />
          <rect x="135" y="68" width="8" height="16" rx="3" fill={strokeColor} />
          {/* Mức năng lượng xanh lá sạc đầy */}
          <rect x="71" y="61" width="56" height="30" rx="5" fill="#22c55e" />
          {/* Tia sét động lực bừng sáng */}
          <polygon points="100,64 92,76 101,76 96,88 108,74 99,74" fill="#ffffff" />
        </svg>
      );

    case "locomotive":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Đầu máy xe lửa */}
          <rect x="55" y="70" width="75" height="40" rx="4" fill="#ef4444" stroke={strokeColor} strokeWidth="3" />
          <rect x="100" y="50" width="35" height="40" rx="3" fill="#3b82f6" stroke={strokeColor} strokeWidth="2.5" />
          {/* Ống khói */}
          <rect x="65" y="50" width="14" height="20" fill="#1e293b" stroke={strokeColor} strokeWidth="2" />
          {/* Làn khói tròn bay lên */}
          <circle cx="72" cy="40" r="7" fill="#cbd5e1" />
          <circle cx="85" cy="30" r="10" fill="#e2e8f0" />
          {/* Bánh xe lửa */}
          <circle cx="70" cy="115" r="12" fill="#334155" stroke={strokeColor} strokeWidth="3" />
          <circle cx="100" cy="115" r="12" fill="#334155" stroke={strokeColor} strokeWidth="3" />
          <circle cx="130" cy="115" r="12" fill="#334155" stroke={strokeColor} strokeWidth="3" />
          <line x1="70" y1="115" x2="130" y2="115" stroke="#f59e0b" strokeWidth="3" />
        </svg>
      );

    case "proceed":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Đèn giao thông màu xanh báo hiệu tiến lên */}
          <rect x="80" y="30" width="40" height="95" rx="10" fill="#1e293b" stroke={strokeColor} strokeWidth="3" />
          <circle cx="100" cy="50" r="10" fill="#475569" />
          <circle cx="100" cy="77" r="10" fill="#475569" />
          <circle cx="100" cy="105" r="10" fill="#22c55e" stroke="#15803d" strokeWidth="2" />
          {/* Tia sáng xanh */}
          <path d="M125 105 L145 105 M135 95 L145 105 L135 115" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case "recede":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Sóng nước rút lui khỏi bờ cát */}
          <path d="M30 115 Q70 100 110 115 Q150 130 170 115" stroke="#0284c7" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M40 95 Q80 80 120 95 Q160 110 180 95" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* Mũi tên nước rút lùi lại biển */}
          <path d="M130 80 L95 80 M105 72 L95 80 L105 88" stroke="#0369a1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case "exceed":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Đường giới hạn nằm ngang đứt nét */}
          <line x1="35" y1="80" x2="165" y2="80" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="6 6" />
          <text x="170" y="84" fontSize="10" fontWeight="800" fill="#ef4444">LIMIT</text>
          {/* Tên lửa phóng vượt qua giới hạn */}
          <path d="M100 35 L115 65 L85 65 Z" fill="#3b82f6" stroke={strokeColor} strokeWidth="2.5" />
          <rect x="90" y="65" width="20" height="30" fill="#60a5fa" stroke={strokeColor} strokeWidth="2" />
          <polygon points="90,95 100,115 110,95" fill="#f97316" />
        </svg>
      );

    case "access":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Chiếc chìa khóa vàng mở ổ khóa thành công */}
          <circle cx="80" cy="70" r="18" stroke="#ca8a04" strokeWidth="4" fill="var(--bg-card, #ffffff)" />
          <line x1="95" y1="78" x2="140" y2="115" stroke="#ca8a04" strokeWidth="5" strokeLinecap="round" />
          <line x1="125" y1="102" x2="135" y2="92" stroke="#ca8a04" strokeWidth="4" strokeLinecap="round" />
          <line x1="135" y1="110" x2="145" y2="100" stroke="#ca8a04" strokeWidth="4" strokeLinecap="round" />
          {/* Tia sáng mở khóa */}
          <circle cx="140" cy="55" r="3" fill="#22c55e" />
          <circle cx="155" cy="70" r="2.5" fill="#22c55e" />
        </svg>
      );

    case "prevent":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Chiếc ô che mưa chắn giọt nước từ trước */}
          <path d="M50 80 A50 50 0 0 1 150 80 Z" fill="#3b82f6" stroke={strokeColor} strokeWidth="3" />
          <line x1="100" y1="80" x2="100" y2="120" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" />
          <path d="M100 120 C100 130 85 130 85 120" stroke={strokeColor} strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Giọt mưa bị chặn lại */}
          <path d="M65 40 Q65 50 62 55 Q59 50 59 40 Z" fill="#38bdf8" />
          <path d="M135 40 Q135 50 132 55 Q129 50 129 40 Z" fill="#38bdf8" />
        </svg>
      );

    case "invent":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Bóng đèn phát minh sáng bừng */}
          <path d="M80 65 C80 45 120 45 120 65 C120 78 112 85 112 95 L88 95 C88 85 80 78 80 65 Z" fill="#fef08a" stroke={strokeColor} strokeWidth="3" />
          <rect x="90" y="95" width="20" height="12" rx="2" fill="#94a3b8" stroke={strokeColor} strokeWidth="2" />
          {/* Dây tóc bóng đèn chữ M */}
          <path d="M93 72 L97 60 L103 60 L107 72" stroke="#f59e0b" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Tia sáng ý tưởng phát minh */}
          <line x1="100" y1="32" x2="100" y2="20" stroke="#eab308" strokeWidth="3" strokeLinecap="round" />
          <line x1="65" y1="45" x2="55" y2="38" stroke="#eab308" strokeWidth="3" strokeLinecap="round" />
          <line x1="135" y1="45" x2="145" y2="38" stroke="#eab308" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case "propel":
    case "compel":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Cánh quạt chân vịt tàu thủy tạo lực đẩy mạnh */}
          <circle cx="100" cy="80" r="14" fill="#334155" stroke={strokeColor} strokeWidth="3" />
          <ellipse cx="100" cy="45" rx="12" ry="22" fill="#3b82f6" stroke={strokeColor} strokeWidth="2.5" />
          <ellipse cx="100" cy="115" rx="12" ry="22" fill="#3b82f6" stroke={strokeColor} strokeWidth="2.5" />
          <ellipse cx="65" cy="80" rx="22" ry="12" fill="#3b82f6" stroke={strokeColor} strokeWidth="2.5" />
          <ellipse cx="135" cy="80" rx="22" ry="12" fill="#3b82f6" stroke={strokeColor} strokeWidth="2.5" />
          {/* Vòng xoáy lực đẩy */}
          <path d="M125 50 Q145 65 140 85" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case "repel":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Hai cực cùng dấu đẩy nhau ra xa */}
          <circle cx="65" cy="80" r="24" fill="#fee2e2" stroke="#ef4444" strokeWidth="3" />
          <text x="65" y="88" fontSize="22" fontWeight="900" fill="#dc2626" textAnchor="middle">+</text>
          <circle cx="135" cy="80" r="24" fill="#fee2e2" stroke="#ef4444" strokeWidth="3" />
          <text x="135" y="88" fontSize="22" fontWeight="900" fill="#dc2626" textAnchor="middle">+</text>
          {/* Hai mũi tên đẩy nhau ra xa */}
          <path d="M40 80 L25 80 M32 73 L25 80 L32 87" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M160 80 L175 80 M168 73 L175 80 L168 87" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case "pulse":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          {/* Đường điện tâm đồ nhịp tim mạch đập */}
          <path d="M30 80 L70 80 L80 60 L90 115 L105 35 L118 95 L128 80 L170 80" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Trái tim hồng nhỏ đập rộn ràng */}
          <path d="M105 25 C105 20 98 17 94 22 C90 17 83 20 83 25 C83 33 94 40 94 40 C94 40 105 33 105 25 Z" fill="#ec4899" stroke={strokeColor} strokeWidth="1.5" />
        </svg>
      );

    default:
      return null;
  }
}

