import React from "react";

// Standard base wrapper for consistent SVG rendering
const BaseIcon = ({
  size = 18,
  color = "currentColor",
  strokeWidth = 1.8,
  className = "",
  style = {},
  children,
  viewBox = "0 0 24 24",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox={viewBox}
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`app-icon ${className}`}
    style={{ verticalAlign: "middle", display: "inline-block", flexShrink: 0, ...style }}
    {...props}
  >
    {children}
  </svg>
);

// 1. Pen / Writing Nib
export const IconPen = (props) => (
  <BaseIcon {...props}>
    <path d="M12 19l7-7 3 3-7 7-3-3z" />
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18" />
    <circle cx="11" cy="11" r="2" />
  </BaseIcon>
);

// 2. AI Sparkles (refined minimalist starbursts)
export const IconSparkles = (props) => (
  <BaseIcon {...props}>
    <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
    <path d="M12 8c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4z" />
    <path d="M18.5 5.5l1.5 1.5M4 20l1.5-1.5" />
  </BaseIcon>
);

// 3. Book / Vocabulary & Structures
export const IconBook = (props) => (
  <BaseIcon {...props}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    <line x1="12" y1="6" x2="16" y2="6" />
    <line x1="12" y1="10" x2="16" y2="10" />
  </BaseIcon>
);

// 4. Clock / Timer
export const IconClock = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15 14" />
  </BaseIcon>
);

// 5. Rotate / Reset / Reload
export const IconRotate = (props) => (
  <BaseIcon {...props}>
    <path d="M3 12a9 9 0 1 0 2.6-6.4L3 8" />
    <polyline points="3 3 3 8 8 8" />
  </BaseIcon>
);

// 6. Checkmark / Success
export const IconCheck = (props) => (
  <BaseIcon {...props}>
    <polyline points="20 6 9 17 4 12" />
  </BaseIcon>
);

export const IconCheckCircle = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="9" />
    <polyline points="9 12 11 14 15 10" />
  </BaseIcon>
);

// 7. Alert / Warning
export const IconAlert = (props) => (
  <BaseIcon {...props}>
    <path d="M10.3 3.4L1.7 18.2C1.4 18.8 1.8 19.5 2.5 19.5h19c.7 0 1.1-.7.8-1.3L13.7 3.4c-.4-.6-1.3-.6-1.7 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <circle cx="12" cy="16.5" r="0.7" fill="currentColor" />
  </BaseIcon>
);

// 8. Copy / Duplicate
export const IconCopy = (props) => (
  <BaseIcon {...props}>
    <rect x="9" y="9" width="12" height="12" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </BaseIcon>
);

// 9. Plus / Add
export const IconPlus = (props) => (
  <BaseIcon {...props}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </BaseIcon>
);

// 10. Trash / Delete
export const IconTrash = (props) => (
  <BaseIcon {...props}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </BaseIcon>
);

// 11. History / Clock Counter
export const IconHistory = (props) => (
  <BaseIcon {...props}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <polyline points="3 3 3 8 8 8" />
    <polyline points="12 7 12 12 15 15" />
  </BaseIcon>
);

// 12. Shield / Security
export const IconShield = (props) => (
  <BaseIcon {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </BaseIcon>
);

// 13. Arrow Right
export const IconArrowRight = (props) => (
  <BaseIcon {...props}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </BaseIcon>
);

// 14. Close / X
export const IconClose = (props) => (
  <BaseIcon {...props}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </BaseIcon>
);

// 15. File / Document
export const IconFile = (props) => (
  <BaseIcon {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="13" y2="17" />
  </BaseIcon>
);

// 16. Bookmark / Save
export const IconBookmark = (props) => (
  <BaseIcon {...props}>
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </BaseIcon>
);

// 17. Search / Magnifier
export const IconSearch = (props) => (
  <BaseIcon {...props}>
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16" y2="16" />
  </BaseIcon>
);

// 18. Globe / Languages
export const IconGlobe = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="9" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <path d="M12 3a14.5 14.5 0 0 0 0 18" />
    <path d="M12 3a14.5 14.5 0 0 1 0 18" />
  </BaseIcon>
);

// 19. Chevron Down
export const IconChevronDown = (props) => (
  <BaseIcon {...props}>
    <polyline points="6 9 12 15 18 9" />
  </BaseIcon>
);

// 20. Lightbulb / Tips
export const IconLightbulb = (props) => (
  <BaseIcon {...props}>
    <path d="M9 18h6" />
    <path d="M10 21h4" />
    <path d="M12 3a6 6 0 0 0-6 6c0 2.2 1.2 4.1 3 5.2V16h6v-1.8c1.8-1.1 3-3 3-5.2a6 6 0 0 0-6-6z" />
  </BaseIcon>
);

// 21. Volume / Speaker
export const IconVolume = (props) => (
  <BaseIcon {...props}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.5 8.5a5 5 0 0 1 0 7" />
    <path d="M18.5 5.5a9 9 0 0 1 0 13" />
  </BaseIcon>
);

// 22. Headphones / Listening
export const IconHeadphones = (props) => (
  <BaseIcon {...props}>
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3v5z" />
    <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3v5z" />
  </BaseIcon>
);

// 23. Flame / Streak
export const IconFlame = (props) => (
  <BaseIcon {...props}>
    <path d="M8.5 14.5A4.5 4.5 0 0 0 13 19a4.5 4.5 0 0 0 4.5-4.5c0-3-2-5-4.5-8.5-2.5 3.5-4.5 5.5-4.5 8.5z" />
  </BaseIcon>
);

// 24. Bell / Notifications
export const IconBell = (props) => (
  <BaseIcon {...props}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </BaseIcon>
);

// 25. Settings / Gear
export const IconSettings = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </BaseIcon>
);

// 26. Sun / Light Mode
export const IconSun = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </BaseIcon>
);

// 27. Moon / Dark Mode
export const IconMoon = (props) => (
  <BaseIcon {...props}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </BaseIcon>
);

// 28. Log In
export const IconLogIn = (props) => (
  <BaseIcon {...props}>
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" y1="12" x2="3" y2="12" />
  </BaseIcon>
);

// 29. Log Out
export const IconLogOut = (props) => (
  <BaseIcon {...props}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </BaseIcon>
);

// 30. Link / URL
export const IconLink = (props) => (
  <BaseIcon {...props}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </BaseIcon>
);

// 31. Message / Feedback
export const IconMessage = (props) => (
  <BaseIcon {...props}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </BaseIcon>
);

// 32. Eye (Show / Reveal)
export const IconEye = (props) => (
  <BaseIcon {...props}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </BaseIcon>
);

// 33. Eye Off (Hide / Conceal)
export const IconEyeOff = (props) => (
  <BaseIcon {...props}>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </BaseIcon>
);

// 34. Trophy / Achievement Cup
export const IconTrophy = (props) => (
  <BaseIcon {...props}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.45 1-1 1H7c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1h10c.55 0 1-.45 1-1v-1c0-.55-.45-1-1-1h-2c-.55 0-1-.45-1-1v-2.34" />
    <path d="M6 4h12a2 2 0 0 1 2 2v3a6 6 0 0 1-6 6h0a6 6 0 0 1-6-6V6a2 2 0 0 1 2-2z" />
  </BaseIcon>
);

// 35. Target / Goal Bullseye
export const IconTarget = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </BaseIcon>
);

// 36. Zap / Lightning Fast
export const IconZap = (props) => (
  <BaseIcon {...props}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </BaseIcon>
);

// 37. Microphone / Voice Input
export const IconMic = (props) => (
  <BaseIcon {...props}>
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </BaseIcon>
);

// 38. Arrow Left
export const IconArrowLeft = (props) => (
  <BaseIcon {...props}>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </BaseIcon>
);

// 39. Chevron Up
export const IconChevronUp = (props) => (
  <BaseIcon {...props}>
    <polyline points="18 15 12 9 6 15" />
  </BaseIcon>
);

// 40. Chevron Left
export const IconChevronLeft = (props) => (
  <BaseIcon {...props}>
    <polyline points="15 18 9 12 15 6" />
  </BaseIcon>
);

// 41. Chevron Right
export const IconChevronRight = (props) => (
  <BaseIcon {...props}>
    <polyline points="9 18 15 12 9 6" />
  </BaseIcon>
);

// 42. Info Circle
export const IconInfo = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </BaseIcon>
);

// 43. Help / Question Circle
export const IconHelpCircle = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </BaseIcon>
);

// 44. Download
export const IconDownload = (props) => (
  <BaseIcon {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </BaseIcon>
);

// 45. File Spreadsheet (CSV / Excel)
export const IconFileSpreadsheet = (props) => (
  <BaseIcon {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M8 13h8" />
    <path d="M8 17h8" />
    <path d="M12 11v8" />
  </BaseIcon>
);

// 46. Layers
export const IconLayers = (props) => (
  <BaseIcon {...props}>
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </BaseIcon>
);

// 47. Play
export const IconPlay = (props) => (
  <BaseIcon {...props}>
    <polygon points="5 3 19 12 5 21 5 3" />
  </BaseIcon>
);

// 48. Pause
export const IconPause = (props) => (
  <BaseIcon {...props}>
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </BaseIcon>
);

// 49. Sliders / Controls
export const IconSliders = (props) => (
  <BaseIcon {...props}>
    <line x1="4" y1="21" x2="4" y2="14" />
    <line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" />
    <line x1="20" y1="12" x2="20" y2="3" />
    <line x1="1" y1="14" x2="7" y2="14" />
    <line x1="9" y1="8" x2="15" y2="8" />
    <line x1="17" y1="16" x2="23" y2="16" />
  </BaseIcon>
);

// 50. Loader / Spinner
export const IconLoader = (props) => (
  <BaseIcon {...props}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </BaseIcon>
);

// 51. Lock
export const IconLock = (props) => (
  <BaseIcon {...props}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </BaseIcon>
);

// 52. Upload
export const IconUpload = (props) => (
  <BaseIcon {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </BaseIcon>
);

// 53. Image
export const IconImage = (props) => (
  <BaseIcon {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </BaseIcon>
);

// 54. Scissors / Split
export const IconScissors = (props) => (
  <BaseIcon {...props}>
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <line x1="20" y1="4" x2="8.12" y2="15.88" />
    <line x1="14.47" y1="14.48" x2="20" y2="20" />
    <line x1="8.12" y1="8.12" x2="12" y2="12" />
  </BaseIcon>
);

// 55. Graduation Cap / Academic
export const IconGraduationCap = (props) => (
  <BaseIcon {...props}>
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </BaseIcon>
);

// 56. Square (Unchecked)
export const IconSquare = (props) => (
  <BaseIcon {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
  </BaseIcon>
);

// 57. Check Square (Checked)
export const IconCheckSquare = (props) => (
  <BaseIcon {...props}>
    <polyline points="9 11 12 14 22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </BaseIcon>
);

// 58. Minus
export const IconMinus = (props) => (
  <BaseIcon {...props}>
    <line x1="5" y1="12" x2="19" y2="12" />
  </BaseIcon>
);

// 59. File Check
export const IconFileCheck = (props) => (
  <BaseIcon {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <polyline points="9 15 11 17 15 13" />
  </BaseIcon>
);

// 60. File Text
export const IconFileText = (props) => (
  <BaseIcon {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </BaseIcon>
);

/* ============================================================
   DIRECT LUCIDE-COMPATIBLE ALIASES
   Allows components to drop-in replace `from "lucide-react"`
   without altering existing tag names!
   ============================================================ */
export const X = IconClose;
export const Close = IconClose;
export const Eye = IconEye;
export const EyeOff = IconEyeOff;
export const Trophy = IconTrophy;
export const Target = IconTarget;
export const Zap = IconZap;
export const Mic = IconMic;
export const Volume = IconVolume;
export const Volume2 = IconVolume;
export const Check = IconCheck;
export const CheckCircle = IconCheckCircle;
export const CheckCircle2 = IconCheckCircle;
export const Sparkles = IconSparkles;
export const Flame = IconFlame;
export const RotateCw = IconRotate;
export const RotateCcw = IconRotate;
export const ArrowLeft = IconArrowLeft;
export const ArrowRight = IconArrowRight;
export const ChevronDown = IconChevronDown;
export const ChevronUp = IconChevronUp;
export const ChevronLeft = IconChevronLeft;
export const ChevronRight = IconChevronRight;
export const Book = IconBook;
export const BookOpen = IconBook;
export const Info = IconInfo;
export const HelpCircle = IconHelpCircle;
export const Plus = IconPlus;
export const Trash = IconTrash;
export const Trash2 = IconTrash;
export const Pencil = IconPen;
export const Download = IconDownload;
export const FileSpreadsheet = IconFileSpreadsheet;
export const Layers = IconLayers;
export const Play = IconPlay;
export const Pause = IconPause;
export const Sliders = IconSliders;
export const SlidersHorizontal = IconSliders;
export const Search = IconSearch;
export const Bookmark = IconBookmark;
export const History = IconHistory;
export const Loader2 = IconLoader;
export const Lock = IconLock;
export const Upload = IconUpload;
export const Image = IconImage;
export const Scissors = IconScissors;
export const GraduationCap = IconGraduationCap;
export const Square = IconSquare;
export const CheckSquare = IconCheckSquare;
export const Minus = IconMinus;
export const FileCheck = IconFileCheck;
export const FileText = IconFileText;
export const AlertCircle = IconAlert;
export const Globe = IconGlobe;




