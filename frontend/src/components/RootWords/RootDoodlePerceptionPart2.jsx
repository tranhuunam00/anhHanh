import React from "react";

/**
 * Minh họa SVG Doodle cho Cụm 1: Nhìn & Cảm nhận (Phần 2: sens, tang, scop, luc)
 * Tuân thủ Rule 4: File code < 500 dòng
 */
export const renderPerceptionDoodlePart2 = (key, strokeColor) => {
  switch (key) {
    // --- SENS / SENT ---
    case "sensitive":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <circle cx="80" cy="70" r="18" stroke={strokeColor} strokeWidth="3" fill="var(--bg-card, #ffffff)" />
          <circle cx="75" cy="68" r="2.5" fill={strokeColor} />
          <circle cx="85" cy="68" r="2.5" fill={strokeColor} />
          <path d="M77 77 Q80 80 83 77" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          <path d="M80 88 L80 130 M80 130 L70 150 M80 130 L90 150" stroke={strokeColor} strokeWidth="3" />
          <path d="M80 98 L115 80" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <path d="M125 70 C120 60 130 55 135 65 C140 55 150 60 145 70 C140 78 135 75 135 80 Z" fill="#ec4899" stroke={strokeColor} strokeWidth="1.5" />
        </svg>
      );

    case "consent":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <circle cx="65" cy="65" r="18" stroke={strokeColor} strokeWidth="3" fill="var(--bg-card, #ffffff)" />
          <circle cx="135" cy="65" r="18" stroke={strokeColor} strokeWidth="3" fill="var(--bg-card, #ffffff)" />
          <path d="M65 83 L65 125 M135 83 L135 125" stroke={strokeColor} strokeWidth="3" />
          <path d="M65 95 L100 105 L135 95" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" />
          <path d="M92 45 L98 52 L110 38" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case "resent":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <circle cx="100" cy="70" r="20" stroke={strokeColor} strokeWidth="3" fill="var(--bg-card, #ffffff)" />
          <line x1="90" y1="64" x2="96" y2="68" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="110" y1="64" x2="104" y2="68" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M93 80 Q100 74 107 80" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M100 90 L100 135 M90 155 L100 135 L110 155" stroke={strokeColor} strokeWidth="3" />
          <path d="M85 105 L115 105" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" />
          <path d="M90 35 C85 28 95 22 100 28 C105 22 115 28 110 35 Z" fill="#94a3b8" stroke={strokeColor} strokeWidth="1.5" />
        </svg>
      );

    case "sentiment":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <circle cx="100" cy="65" r="19" stroke={strokeColor} strokeWidth="3" fill="var(--bg-card, #ffffff)" />
          <circle cx="95" cy="63" r="2.5" fill={strokeColor} />
          <circle cx="105" cy="63" r="2.5" fill={strokeColor} />
          <path d="M96 73 Q100 77 104 73" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          <path d="M100 84 L100 130 M90 150 L100 130 L110 150" stroke={strokeColor} strokeWidth="3" />
          <path d="M82 98 L100 95 L118 98" stroke={strokeColor} strokeWidth="3" />
          <path d="M100 95 C100 90 92 85 88 90 C84 95 100 105 100 105 C100 105 116 95 112 90 C108 85 100 90 100 95 Z" fill="#f43f5e" />
        </svg>
      );

    case "sensation":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <circle cx="100" cy="70" r="18" stroke={strokeColor} strokeWidth="3" fill="var(--bg-card, #ffffff)" />
          <ellipse cx="94" cy="66" rx="2" ry="3" fill={strokeColor} />
          <ellipse cx="106" cy="66" rx="2" ry="3" fill={strokeColor} />
          <circle cx="100" cy="76" r="4" fill="#f43f5e" />
          <path d="M100 88 L100 130 M85 150 L100 130 L115 150" stroke={strokeColor} strokeWidth="3" />
          <path d="M75 70 L100 95 L125 70" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" />
          <path d="M65 40 L70 48 L80 48 L72 53 L75 62 L65 57 L55 62 L58 53 L50 48 L60 48 Z" fill="#f59e0b" />
          <path d="M140 40 L145 48 L155 48 L147 53 L150 62 L140 57 L130 62 L133 53 L125 48 L135 48 Z" fill="#f59e0b" />
        </svg>
      );

    case "sensible":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <circle cx="100" cy="65" r="18" stroke={strokeColor} strokeWidth="3" fill="var(--bg-card, #ffffff)" />
          <path d="M100 83 L100 130 M90 150 L100 130 L110 150" stroke={strokeColor} strokeWidth="3" />
          <path d="M100 95 L125 80" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <path d="M125 80 L125 50" stroke={strokeColor} strokeWidth="3" />
          <path d="M95 50 C95 25 155 25 155 50 Z" fill="#3b82f6" stroke={strokeColor} strokeWidth="2.5" />
        </svg>
      );

    case "dissent":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <circle cx="65" cy="85" r="14" stroke={strokeColor} strokeWidth="2.5" fill="var(--bg-card, #ffffff)" />
          <circle cx="135" cy="85" r="14" stroke={strokeColor} strokeWidth="2.5" fill="var(--bg-card, #ffffff)" />
          <circle cx="100" cy="65" r="18" stroke={strokeColor} strokeWidth="3" fill="var(--bg-card, #ffffff)" />
          <path d="M100 83 L100 130 M90 150 L100 130 L110 150" stroke={strokeColor} strokeWidth="3" />
          <path d="M100 95 L115 65 L115 45" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      );

    // --- TANG / TACT ---
    case "contact":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <rect x="50" y="55" width="35" height="60" rx="6" stroke={strokeColor} strokeWidth="3" fill="#dbeafe" />
          <rect x="115" y="55" width="35" height="60" rx="6" stroke={strokeColor} strokeWidth="3" fill="#fce7f3" />
          <path d="M88 85 L112 85" stroke="#2563eb" strokeWidth="3" strokeDasharray="3 3" />
          <circle cx="100" cy="85" r="5" fill="#f59e0b" />
        </svg>
      );

    case "intact":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <path d="M85 50 L115 50 L125 100 C125 125 75 125 75 100 Z" stroke={strokeColor} strokeWidth="3" fill="#e0f2fe" />
          <line x1="80" y1="50" x2="120" y2="50" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <path d="M135 60 L140 68 L150 68" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M60 70 L65 75" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case "tactile":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <path d="M70 120 L95 85 C100 78 110 85 105 92 L90 125 Z" fill="#fed7aa" stroke={strokeColor} strokeWidth="2.5" />
          <circle cx="120" cy="70" r="4" fill="#f43f5e" />
          <circle cx="135" cy="75" r="4" fill="#3b82f6" />
          <circle cx="125" cy="90" r="4" fill="#10b981" />
          <circle cx="140" cy="95" r="4" fill="#f59e0b" />
        </svg>
      );

    case "tangible":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <path d="M50 110 Q80 115 100 105 Q120 110 140 105" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <circle cx="95" cy="75" r="22" fill="#fbbf24" stroke="#f59e0b" strokeWidth="3" />
          <text x="95" y="83" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#b45309">$</text>
        </svg>
      );

    case "intangible":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <path d="M60 115 Q90 120 110 110" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <path d="M100 75 Q120 50 110 35 M120 70 Q140 45 130 30" stroke="#8b5cf6" strokeWidth="2.5" strokeDasharray="3 3" />
          <circle cx="105" cy="45" r="3" fill="#8b5cf6" />
          <circle cx="125" cy="40" r="3" fill="#ec4899" />
        </svg>
      );

    case "contagious":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <circle cx="70" cy="70" r="18" stroke={strokeColor} strokeWidth="3" fill="var(--bg-card, #ffffff)" />
          <ellipse cx="70" cy="74" rx="6" ry="8" fill="#f59e0b" />
          <circle cx="130" cy="70" r="18" stroke={strokeColor} strokeWidth="3" fill="var(--bg-card, #ffffff)" />
          <ellipse cx="130" cy="74" rx="6" ry="8" fill="#f59e0b" />
          <path d="M92 70 Q100 65 108 70" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case "tangent":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <circle cx="100" cy="85" r="32" stroke={strokeColor} strokeWidth="3" fill="rgba(59,130,246,0.08)" />
          <line x1="50" y1="53" x2="150" y2="53" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="100" cy="53" r="5" fill="#ef4444" />
        </svg>
      );

    // --- SCOP ---
    case "telescope":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <polygon points="65,95 135,45 145,55 75,105" stroke={strokeColor} strokeWidth="3" fill="#fbbf24" />
          <line x1="100" y1="80" x2="80" y2="145" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <line x1="100" y1="80" x2="120" y2="145" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <path d="M160 30 C155 20 170 15 175 25 C170 35 155 35 160 30 Z" fill="#fef08a" />
          <circle cx="185" cy="45" r="2.5" fill="#f59e0b" />
        </svg>
      );

    case "microscope":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <rect x="70" y="135" width="60" height="12" rx="4" stroke={strokeColor} strokeWidth="2.5" fill="#94a3b8" />
          <path d="M115 135 C135 110 135 70 115 50 L95 50" stroke={strokeColor} strokeWidth="3.5" fill="none" />
          <rect x="80" y="45" width="22" height="40" rx="3" stroke={strokeColor} strokeWidth="2.5" fill="#60a5fa" />
          <rect x="75" y="105" width="40" height="6" stroke={strokeColor} strokeWidth="2" fill="#ffffff" />
        </svg>
      );

    case "periscope":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <path d="M75 145 L75 55 L125 55 L125 70" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <circle cx="125" cy="70" r="10" stroke="#3b82f6" strokeWidth="2.5" fill="#93c5fd" />
          <path d="M35 125 Q55 115 75 125 T115 125 T155 125" stroke="#0284c7" strokeWidth="3" fill="none" />
        </svg>
      );

    case "stethoscope":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <path d="M70 40 L70 75 C70 105 130 105 130 75 L130 40" stroke={strokeColor} strokeWidth="3.5" fill="none" />
          <path d="M100 95 L100 120" stroke={strokeColor} strokeWidth="3" />
          <circle cx="100" cy="128" r="12" stroke="#2563eb" strokeWidth="3" fill="#dbeafe" />
          <path d="M140 105 C140 95 130 90 125 98 C120 90 110 95 110 105 C110 120 125 130 125 130 C125 130 140 120 140 105 Z" fill="#ef4444" opacity="0.8" />
        </svg>
      );

    case "kaleidoscope":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <circle cx="100" cy="80" r="38" stroke={strokeColor} strokeWidth="3" fill="#faf5ff" />
          <polygon points="100,50 110,75 135,80 110,85 100,110 90,85 65,80 90,75" fill="#ec4899" opacity="0.8" />
          <polygon points="100,60 107,75 122,80 107,85 100,100 93,85 78,80 93,75" fill="#a855f7" />
        </svg>
      );

    case "horoscope":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <circle cx="100" cy="80" r="35" stroke={strokeColor} strokeWidth="2.5" fill="rgba(147, 51, 234, 0.08)" />
          <line x1="75" y1="65" x2="95" y2="75" stroke="#f59e0b" strokeWidth="2" />
          <line x1="95" y1="75" x2="120" y2="65" stroke="#f59e0b" strokeWidth="2" />
          <line x1="95" y1="75" x2="105" y2="95" stroke="#f59e0b" strokeWidth="2" />
          <circle cx="75" cy="65" r="4" fill="#f59e0b" />
          <circle cx="95" cy="75" r="4" fill="#f59e0b" />
          <circle cx="120" cy="65" r="4" fill="#f59e0b" />
          <circle cx="105" cy="95" r="4" fill="#f59e0b" />
        </svg>
      );

    case "scope":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <circle cx="100" cy="80" r="36" stroke={strokeColor} strokeWidth="3" />
          <circle cx="100" cy="80" r="18" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2" />
          <line x1="100" y1="36" x2="100" y2="124" stroke="#ef4444" strokeWidth="2" />
          <line x1="56" y1="80" x2="144" y2="80" stroke="#ef4444" strokeWidth="2" />
        </svg>
      );

    // --- LUC / LUM ---
    case "illuminate":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <polygon points="100,30 60,85 140,85" fill="#fef08a" stroke={strokeColor} strokeWidth="2.5" />
          <polygon points="70,85 45,145 155,145 130,85" fill="rgba(254, 240, 138, 0.35)" />
          <line x1="100" y1="30" x2="100" y2="15" stroke={strokeColor} strokeWidth="2.5" />
        </svg>
      );

    case "lucid":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <circle cx="100" cy="75" r="20" stroke={strokeColor} strokeWidth="3" fill="var(--bg-card, #ffffff)" />
          <circle cx="94" cy="72" r="2.5" fill={strokeColor} />
          <circle cx="106" cy="72" r="2.5" fill={strokeColor} />
          <path d="M95 82 Q100 87 105 82" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          <path d="M94 38 C94 28 106 28 106 38 C106 42 103 45 100 48 L100 52" stroke="#f59e0b" strokeWidth="3" fill="#fef08a" />
          <line x1="88" y1="28" x2="82" y2="24" stroke="#f59e0b" strokeWidth="2" />
          <line x1="112" y1="28" x2="118" y2="24" stroke="#f59e0b" strokeWidth="2" />
        </svg>
      );

    case "translucent":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <rect x="65" y="45" width="70" height="75" rx="6" stroke={strokeColor} strokeWidth="3" fill="rgba(224, 242, 254, 0.45)" />
          <line x1="100" y1="45" x2="100" y2="120" stroke={strokeColor} strokeWidth="2" />
          <line x1="65" y1="82" x2="135" y2="82" stroke={strokeColor} strokeWidth="2" />
          <circle cx="100" cy="82" r="16" fill="#fef08a" opacity="0.6" />
        </svg>
      );

    case "luminous":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <circle cx="100" cy="80" r="18" fill="#a3e635" stroke="#65a30d" strokeWidth="2.5" />
          <circle cx="94" cy="76" r="2" fill="#365314" />
          <circle cx="106" cy="76" r="2" fill="#365314" />
          <path d="M85 65 C80 50 95 50 100 65" stroke={strokeColor} strokeWidth="2" fill="#dcfce7" />
          <path d="M115 65 C120 50 105 50 100 65" stroke={strokeColor} strokeWidth="2" fill="#dcfce7" />
          <circle cx="100" cy="80" r="30" stroke="#bef264" strokeWidth="2" strokeDasharray="4 4" fill="none" />
        </svg>
      );

    case "elucidate":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <circle cx="65" cy="70" r="18" stroke={strokeColor} strokeWidth="3" fill="var(--bg-card, #ffffff)" />
          <path d="M65 88 L65 135 M55 155 L65 135 L75 155" stroke={strokeColor} strokeWidth="3" />
          <path d="M65 98 L105 85" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <rect x="105" y="55" width="60" height="45" rx="4" stroke={strokeColor} strokeWidth="2.5" fill="#1e293b" />
          <line x1="115" y1="70" x2="145" y2="70" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
          <line x1="115" y1="80" x2="155" y2="80" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case "luminary":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <polygon points="100,30 112,65 148,68 120,92 128,128 100,108 72,128 80,92 52,68 88,65" fill="#facc15" stroke="#ca8a04" strokeWidth="3" />
          <circle cx="100" cy="80" r="8" fill="#ffffff" />
        </svg>
      );

    case "pellucid":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <circle cx="100" cy="85" r="36" stroke={strokeColor} strokeWidth="3" fill="rgba(224, 242, 254, 0.4)" />
          <path d="M90 85 C80 80 80 95 90 90 L110 90 C120 85 120 100 110 95 Z" fill="#f97316" />
          <circle cx="105" cy="87" r="1.5" fill="#ffffff" />
        </svg>
      );

    default:
      return null;
  }
};
