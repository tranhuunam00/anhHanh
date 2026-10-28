import React from "react";

/**
 * Minh họa SVG Doodle cho Cụm 1: Nhìn & Cảm nhận (Phần 1: spect, vid, aud)
 * Tuân thủ Rule 4: File code < 500 dòng
 */
export const renderPerceptionDoodlePart1 = (key, strokeColor) => {
  switch (key) {
    // --- SPECT / SPIC ---
    case "respect":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <path d="M100 45 C100 35 90 25 80 25 C70 25 65 35 65 45 C65 65 100 85 100 85 C100 85 135 65 135 45 C135 35 130 25 120 25 C110 25 100 35 100 45 Z" fill="#ec4899" opacity="0.9" />
          <circle cx="60" cy="70" r="22" stroke={strokeColor} strokeWidth="3" fill="var(--bg-card, #ffffff)" />
          <path d="M52 68 Q55 65 58 68 M64 68 Q67 65 70 68" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M55 78 Q60 83 66 78" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M38 140 C40 100 80 100 82 140" stroke={strokeColor} strokeWidth="3" fill="none" />
          <circle cx="140" cy="70" r="22" stroke={strokeColor} strokeWidth="3" fill="var(--bg-card, #ffffff)" />
          <path d="M132 68 Q135 65 138 68 M144 68 Q147 65 150 68" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M135 78 Q140 83 146 78" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M118 140 C120 100 160 100 162 140" stroke={strokeColor} strokeWidth="3" fill="none" />
          <path d="M75 110 Q100 125 125 110" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      );

    case "inspect":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <circle cx="65" cy="55" r="20" stroke={strokeColor} strokeWidth="3" fill="var(--bg-card, #ffffff)" />
          <circle cx="60" cy="53" r="2.5" fill={strokeColor} />
          <circle cx="72" cy="53" r="2.5" fill={strokeColor} />
          <path d="M62 63 Q66 67 70 63" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          <path d="M65 75 L65 125 M65 125 L50 150 M65 125 L80 150" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <path d="M65 90 L95 85" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <circle cx="120" cy="80" r="24" stroke={strokeColor} strokeWidth="3.5" fill="rgba(59, 130, 246, 0.1)" />
          <line x1="105" y1="95" x2="95" y2="105" stroke={strokeColor} strokeWidth="4.5" strokeLinecap="round" />
          <circle cx="145" cy="130" r="6" fill="#f59e0b" />
          <path d="M145 136 L145 152" stroke="#10b981" strokeWidth="2.5" />
          <path d="M145 144 Q152 140 154 146" stroke="#10b981" strokeWidth="2" fill="none" />
        </svg>
      );

    case "prospect":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <circle cx="60" cy="65" r="19" stroke={strokeColor} strokeWidth="3" fill="var(--bg-card, #ffffff)" />
          <circle cx="56" cy="63" r="2.5" fill={strokeColor} />
          <circle cx="66" cy="63" r="2.5" fill={strokeColor} />
          <path d="M58 72 Q62 76 66 72" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          <path d="M60 84 L60 125 M60 125 L45 150 M60 125 L75 150" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <rect x="75" y="58" width="28" height="14" rx="4" stroke={strokeColor} strokeWidth="2.5" fill="#93c5fd" />
          <path d="M60 92 L75 68" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <path d="M125 110 C140 70 170 70 185 110" fill="#fde68a" stroke={strokeColor} strokeWidth="2" />
          <circle cx="155" cy="55" r="14" fill="#f59e0b" opacity="0.9" />
          <line x1="155" y1="35" x2="155" y2="28" stroke="#f59e0b" strokeWidth="2.5" />
          <line x1="172" y1="42" x2="178" y2="38" stroke="#f59e0b" strokeWidth="2.5" />
        </svg>
      );

    case "suspect":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <path d="M70 42 C70 30 110 30 110 42 Z" fill="#64748b" stroke={strokeColor} strokeWidth="2.5" />
          <line x1="60" y1="42" x2="120" y2="42" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <circle cx="90" cy="58" r="18" stroke={strokeColor} strokeWidth="3" fill="var(--bg-card, #ffffff)" />
          <circle cx="85" cy="58" r="3" fill={strokeColor} />
          <circle cx="97" cy="58" r="3" fill={strokeColor} />
          <path d="M85 68 Q90 65 95 68" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          <path d="M70 76 L110 76 L118 140 L62 140 Z" fill="#94a3b8" stroke={strokeColor} strokeWidth="2.5" />
          <path d="M135 25 Q145 20 145 35 Q145 45 138 52 M138 60 L138 62" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      );

    case "spectator":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <circle cx="50" cy="85" r="15" stroke={strokeColor} strokeWidth="2.5" fill="var(--bg-card, #ffffff)" />
          <path d="M50 100 L50 135 M38 150 L50 135 L62 150" stroke={strokeColor} strokeWidth="2.5" />
          <path d="M50 108 L32 90" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="100" cy="70" r="17" stroke={strokeColor} strokeWidth="3" fill="var(--bg-card, #ffffff)" />
          <path d="M100 87 L100 135 M88 150 L100 135 L112 150" stroke={strokeColor} strokeWidth="3" />
          <path d="M78 68 L100 88 L122 68" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <circle cx="150" cy="85" r="15" stroke={strokeColor} strokeWidth="2.5" fill="var(--bg-card, #ffffff)" />
          <path d="M150 100 L150 135 M138 150 L150 135 L162 150" stroke={strokeColor} strokeWidth="2.5" />
          <path d="M150 108 L168 90" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M122 68 L128 45 L145 52 L128 58" fill="#ec4899" stroke={strokeColor} strokeWidth="2" />
        </svg>
      );

    case "spectacular":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <circle cx="100" cy="115" r="16" stroke={strokeColor} strokeWidth="2.5" fill="var(--bg-card, #ffffff)" />
          <path d="M100 131 L100 155 M90 155 L100 145 L110 155" stroke={strokeColor} strokeWidth="2.5" />
          <path d="M82 120 L100 133 L118 120" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="100" cy="50" r="5" fill="#f59e0b" />
          <line x1="100" y1="35" x2="100" y2="20" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="115" y1="42" x2="130" y2="30" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="120" y1="50" x2="135" y2="50" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="85" y1="42" x2="70" y2="30" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="80" y1="50" x2="65" y2="50" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="140" cy="25" r="3" fill="#ec4899" />
          <circle cx="60" cy="25" r="3" fill="#3b82f6" />
        </svg>
      );

    case "retrospect":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <circle cx="120" cy="65" r="18" stroke={strokeColor} strokeWidth="3" fill="var(--bg-card, #ffffff)" />
          <circle cx="112" cy="63" r="2.5" fill={strokeColor} />
          <path d="M112 72 Q117 76 122 72" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          <path d="M120 83 L120 128 M120 128 L105 150 M120 128 L135 150" stroke={strokeColor} strokeWidth="3" />
          <path d="M120 95 L80 95" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <rect x="45" y="75" width="38" height="48" rx="4" stroke={strokeColor} strokeWidth="2.5" fill="#fef08a" />
          <circle cx="64" cy="92" r="8" stroke={strokeColor} strokeWidth="2" fill="#93c5fd" />
          <path d="M95 40 C75 35 60 50 65 65" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" />
        </svg>
      );

    case "circumspect":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <circle cx="100" cy="60" r="19" stroke={strokeColor} strokeWidth="3" fill="var(--bg-card, #ffffff)" />
          <ellipse cx="94" cy="58" rx="3" ry="4" fill={strokeColor} />
          <ellipse cx="106" cy="58" rx="3" ry="4" fill={strokeColor} />
          <path d="M96 68 Q100 66 104 68" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          <path d="M100 79 L100 120 M100 120 L88 145 M100 120 L112 145" stroke={strokeColor} strokeWidth="3" />
          <path d="M78 95 L100 90 L122 95" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <path d="M60 60 Q50 60 45 65 M140 60 Q150 60 155 65" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    // --- VID / VIS ---
    case "visible":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <circle cx="100" cy="65" r="26" fill="#fef08a" stroke="#f59e0b" strokeWidth="3" />
          <circle cx="92" cy="62" r="3" fill="#b45309" />
          <circle cx="108" cy="62" r="3" fill="#b45309" />
          <path d="M93 74 Q100 80 107 74" stroke="#b45309" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="100" y1="28" x2="100" y2="18" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          <line x1="100" y1="102" x2="100" y2="112" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          <line x1="63" y1="65" x2="53" y2="65" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          <line x1="137" y1="65" x2="147" y2="65" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          <path d="M40 145 L80 115 L120 145 L150 125 L180 145" stroke={strokeColor} strokeWidth="2.5" fill="none" />
        </svg>
      );

    case "vision":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <circle cx="100" cy="65" r="22" stroke={strokeColor} strokeWidth="3" fill="var(--bg-card, #ffffff)" />
          <circle cx="92" cy="63" r="8" stroke="#2563eb" strokeWidth="2.5" fill="#dbeafe" />
          <circle cx="108" cy="63" r="8" stroke="#2563eb" strokeWidth="2.5" fill="#dbeafe" />
          <line x1="99" y1="63" x2="101" y2="63" stroke="#2563eb" strokeWidth="2" />
          <path d="M94 77 Q100 82 106 77" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          <path d="M100 87 L100 135 M100 135 L85 155 M100 135 L115 155" stroke={strokeColor} strokeWidth="3" />
          <path d="M150 40 L153 48 L162 48 L155 53 L157 61 L150 56 L143 61 L145 53 L138 48 L147 48 Z" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1.5" />
        </svg>
      );

    case "revise":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <circle cx="75" cy="55" r="18" stroke={strokeColor} strokeWidth="3" fill="var(--bg-card, #ffffff)" />
          <circle cx="70" cy="53" r="2.5" fill={strokeColor} />
          <circle cx="80" cy="53" r="2.5" fill={strokeColor} />
          <path d="M72 62 Q75 65 79 62" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          <path d="M75 73 L75 125 M75 125 L60 150 M75 125 L90 150" stroke={strokeColor} strokeWidth="3" />
          <path d="M75 90 L105 85" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <rect x="110" y="65" width="45" height="60" rx="4" stroke={strokeColor} strokeWidth="2.5" fill="#f8fafc" />
          <path d="M118 80 L122 84 L132 75" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M118 96 L122 100 L132 91" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case "supervise":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <circle cx="80" cy="50" r="18" stroke={strokeColor} strokeWidth="3" fill="var(--bg-card, #ffffff)" />
          <circle cx="75" cy="48" r="2.5" fill={strokeColor} />
          <circle cx="85" cy="48" r="2.5" fill={strokeColor} />
          <path d="M77 57 Q80 61 84 57" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          <path d="M80 68 L80 115 M80 115 L68 140 M80 115 L92 140" stroke={strokeColor} strokeWidth="3" />
          <path d="M80 82 L105 75" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <rect x="105" y="60" width="28" height="38" rx="3" stroke={strokeColor} strokeWidth="2.5" fill="#dbeafe" />
          <line x1="112" y1="70" x2="126" y2="70" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
          <line x1="112" y1="78" x2="124" y2="78" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
          <circle cx="150" cy="115" r="12" stroke={strokeColor} strokeWidth="2" fill="var(--bg-card, #ffffff)" />
          <path d="M150 127 L150 148 M142 148 L150 142 L158 148" stroke={strokeColor} strokeWidth="2" />
        </svg>
      );

    case "evident":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <circle cx="85" cy="70" r="26" stroke={strokeColor} strokeWidth="3.5" fill="rgba(37,99,235,0.08)" />
          <line x1="104" y1="89" x2="135" y2="120" stroke={strokeColor} strokeWidth="5" strokeLinecap="round" />
          <ellipse cx="80" cy="65" rx="5" ry="8" fill="#10b981" />
          <circle cx="76" cy="52" r="2" fill="#10b981" />
          <circle cx="81" cy="51" r="2" fill="#10b981" />
          <circle cx="86" cy="53" r="2" fill="#10b981" />
          <path d="M130 50 L140 55 L155 40" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case "provide":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <circle cx="65" cy="60" r="18" stroke={strokeColor} strokeWidth="3" fill="var(--bg-card, #ffffff)" />
          <circle cx="61" cy="58" r="2.5" fill={strokeColor} />
          <circle cx="71" cy="58" r="2.5" fill={strokeColor} />
          <path d="M63 67 Q66 71 70 67" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          <path d="M65 78 L65 125 M65 125 L50 150 M65 125 L78 150" stroke={strokeColor} strokeWidth="3" />
          <path d="M65 92 L95 90" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <rect x="95" y="78" width="34" height="30" rx="3" stroke={strokeColor} strokeWidth="2.5" fill="#f43f5e" />
          <line x1="112" y1="78" x2="112" y2="108" stroke="#ffffff" strokeWidth="2.5" />
          <line x1="95" y1="93" x2="129" y2="93" stroke="#ffffff" strokeWidth="2.5" />
          <circle cx="150" cy="75" r="16" stroke={strokeColor} strokeWidth="2.5" fill="var(--bg-card, #ffffff)" />
          <path d="M150 91 L150 135 M140 150 L150 135 L160 150" stroke={strokeColor} strokeWidth="2.5" />
        </svg>
      );

    case "invisible":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <path d="M75 50 C75 35 125 35 125 50 Z" fill="#94a3b8" stroke={strokeColor} strokeWidth="2.5" />
          <line x1="65" y1="50" x2="135" y2="50" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <circle cx="88" cy="72" r="5" stroke="#3b82f6" strokeWidth="2" strokeDasharray="2 2" fill="none" />
          <circle cx="112" cy="72" r="5" stroke="#3b82f6" strokeWidth="2" strokeDasharray="2 2" fill="none" />
          <path d="M92 85 Q100 90 108 85" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="85" cy="140" rx="12" ry="6" stroke={strokeColor} strokeWidth="2.5" fill="var(--bg-card, #ffffff)" />
          <ellipse cx="115" cy="140" rx="12" ry="6" stroke={strokeColor} strokeWidth="2.5" fill="var(--bg-card, #ffffff)" />
        </svg>
      );

    case "visual":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <line x1="70" y1="145" x2="95" y2="40" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <line x1="130" y1="145" x2="105" y2="40" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <line x1="100" y1="40" x2="100" y2="145" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
          <rect x="65" y="55" width="70" height="50" rx="4" stroke={strokeColor} strokeWidth="3" fill="#ffffff" />
          <circle cx="85" cy="75" r="7" fill="#f59e0b" />
          <path d="M70 98 L90 82 L105 95 L120 85 L130 98 Z" fill="#60a5fa" />
        </svg>
      );

    // --- AUD / AUDIT ---
    case "audience":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <circle cx="65" cy="65" r="16" stroke={strokeColor} strokeWidth="2.5" fill="var(--bg-card, #ffffff)" />
          <path d="M65 81 L65 110 M55 125 L65 110 L75 125" stroke={strokeColor} strokeWidth="2.5" />
          <circle cx="105" cy="60" r="18" stroke={strokeColor} strokeWidth="3" fill="var(--bg-card, #ffffff)" />
          <path d="M105 78 L105 115 M92 135 L105 115 L118 135" stroke={strokeColor} strokeWidth="3" />
          <circle cx="145" cy="65" r="16" stroke={strokeColor} strokeWidth="2.5" fill="var(--bg-card, #ffffff)" />
          <path d="M145 81 L145 110 M135 125 L145 110 L155 125" stroke={strokeColor} strokeWidth="2.5" />
          <rect x="40" y="115" width="120" height="20" rx="6" stroke="#ef4444" strokeWidth="2.5" fill="#fecaca" />
        </svg>
      );

    case "audible":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <polygon points="60,65 80,65 98,48 98,112 80,95 60,95" stroke={strokeColor} strokeWidth="3" fill="#93c5fd" />
          <path d="M112 65 Q122 80 112 95" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
          <path d="M125 55 Q140 80 125 105" stroke="#2563eb" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M138 45 Q158 80 138 115" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );

    case "inaudible":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <polygon points="60,65 80,65 98,48 98,112 80,95 60,95" stroke={strokeColor} strokeWidth="3" fill="#cbd5e1" />
          <line x1="115" y1="65" x2="135" y2="95" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="135" y1="65" x2="115" y2="95" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="160" cy="75" r="14" stroke={strokeColor} strokeWidth="2" fill="var(--bg-card, #ffffff)" />
          <path d="M152 75 Q148 70 148 80" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case "audition":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <circle cx="80" cy="55" r="18" stroke={strokeColor} strokeWidth="3" fill="var(--bg-card, #ffffff)" />
          <circle cx="75" cy="52" r="2.5" fill={strokeColor} />
          <circle cx="85" cy="52" r="2.5" fill={strokeColor} />
          <ellipse cx="80" cy="62" rx="4" ry="5" fill="#f43f5e" />
          <path d="M80 73 L80 120 M80 120 L68 145 M80 120 L92 145" stroke={strokeColor} strokeWidth="3" />
          <line x1="120" y1="65" x2="120" y2="135" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="120" cy="55" rx="8" ry="12" stroke={strokeColor} strokeWidth="2.5" fill="#e2e8f0" />
          <circle cx="140" cy="40" r="3" fill="#ec4899" />
          <circle cx="150" cy="50" r="2" fill="#ec4899" />
        </svg>
      );

    case "audio":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <rect x="55" y="50" width="90" height="60" rx="8" stroke={strokeColor} strokeWidth="3" fill="#dbeafe" />
          <circle cx="80" cy="80" r="12" stroke={strokeColor} strokeWidth="2.5" fill="#ffffff" />
          <circle cx="120" cy="80" r="12" stroke={strokeColor} strokeWidth="2.5" fill="#ffffff" />
          <line x1="80" y1="80" x2="120" y2="80" stroke={strokeColor} strokeWidth="2" strokeDasharray="3 3" />
          <path d="M150 40 L160 35 L160 50 M150 40 L150 55" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case "auditorium":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <path d="M40 30 C50 70 45 110 35 130 L65 130 C70 90 65 60 55 30 Z" fill="#ef4444" stroke={strokeColor} strokeWidth="2" />
          <path d="M160 30 C150 70 155 110 165 130 L135 130 C130 90 135 60 145 30 Z" fill="#ef4444" stroke={strokeColor} strokeWidth="2" />
          <ellipse cx="100" cy="115" rx="45" ry="16" stroke={strokeColor} strokeWidth="2.5" fill="#fef08a" />
          <polygon points="100,20 65,110 135,110" fill="rgba(254, 240, 138, 0.25)" />
        </svg>
      );

    case "audit":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <rect x="65" y="45" width="70" height="85" rx="5" stroke={strokeColor} strokeWidth="3" fill="#ffffff" />
          <line x1="75" y1="65" x2="125" y2="65" stroke="#cbd5e1" strokeWidth="2.5" />
          <line x1="75" y1="80" x2="125" y2="80" stroke="#cbd5e1" strokeWidth="2.5" />
          <line x1="75" y1="95" x2="125" y2="95" stroke="#cbd5e1" strokeWidth="2.5" />
          <path d="M110 60 L115 65 L125 55" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M110 75 L115 80 L125 70" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M110 90 L115 95 L125 85" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case "applaud":
      return (
        <svg viewBox="0 0 200 160" className="root-doodle-svg" fill="none">
          <path d="M70 110 C60 90 75 70 85 85 L95 105 Z" fill="#fed7aa" stroke={strokeColor} strokeWidth="2.5" />
          <path d="M130 110 C140 90 125 70 115 85 L105 105 Z" fill="#fed7aa" stroke={strokeColor} strokeWidth="2.5" />
          <path d="M85 65 L95 50 M115 65 L105 50 M100 45 L100 35" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    default:
      return null;
  }
};
