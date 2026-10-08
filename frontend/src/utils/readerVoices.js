/**
 * Reader Voices & Accent Configuration Utility
 * Provides accent filtering, gender heuristic detection, and tone/pitch presets
 * for Web Speech Synthesis in Smart Reader.
 */

export const ACCENT_OPTIONS = [
  { code: "ALL", label: "Tất cả Accent", flag: "🌐" },
  { code: "en-US", label: "Mỹ (US)", flag: "🇺🇸" },
  { code: "en-GB", label: "Anh (UK)", flag: "🇬🇧" },
  { code: "en-AU", label: "Úc (Australia)", flag: "🇦🇺" },
  { code: "en-CA", label: "Canada", flag: "🇨🇦" },
  { code: "en-IN", label: "Ấn Độ (India)", flag: "🇮🇳" },
  { code: "en-IE", label: "Ireland", flag: "🇮🇪" },
];

export const PITCH_PRESETS = [
  { id: "standard", label: "Chuẩn mẫu", pitch: 1.0 },
  { id: "deep", label: "Trầm ấm (Radio)", pitch: 0.8 },
  { id: "energetic", label: "Trẻ trung", pitch: 1.25 },
  { id: "story", label: "Kể chuyện", pitch: 0.9 },
];

/**
 * Detect voice gender from voice name heuristics
 */
export const detectVoiceGender = (voiceName = "") => {
  if (!voiceName || typeof voiceName !== "string") return "Neutral";
  const lower = voiceName.toLowerCase();

  const femaleMarkers = [
    "female", "woman", "girl", "zira", "jenny", "sonia", "natasha",
    "neerja", "samantha", "karen", "moira", "tessa", "victoria",
    "susan", "hazel", "aria", "steffan", "clara", "catherine"
  ];
  if (femaleMarkers.some((m) => lower.includes(m))) {
    return "Nữ";
  }

  const maleMarkers = [
    "male", "man", "boy", "david", "guy", "ryan", "george",
    "mark", "daniel", "rishi", "ravi", "oliver", "james"
  ];
  if (maleMarkers.some((m) => lower.includes(m))) {
    return "Nam";
  }

  return "Tự nhiên";
};

/**
 * Filter list of voices by selected accent code
 */
export const filterVoicesByAccent = (voices = [], accentCode = "ALL") => {
  if (!Array.isArray(voices)) return [];
  if (!accentCode || accentCode === "ALL") {
    // Return all English voices first, then others
    return [...voices].sort((a, b) => {
      const aIsEn = (a.lang || "").toLowerCase().startsWith("en");
      const bIsEn = (b.lang || "").toLowerCase().startsWith("en");
      if (aIsEn && !bIsEn) return -1;
      if (!aIsEn && bIsEn) return 1;
      return (a.name || "").localeCompare(b.name || "");
    });
  }

  const target = accentCode.toLowerCase();
  return voices.filter((v) => v && (v.lang || "").toLowerCase().startsWith(target));
};

/**
 * Format a clean, human-readable voice title
 * e.g. "Microsoft Jenny Online (Natural) - English (United States)" -> "Jenny (Mỹ • Nữ • Tự nhiên)"
 */
export const formatVoiceLabel = (voice) => {
  if (!voice) return "Giọng mặc định";
  const name = voice.name || "Default Voice";
  const lang = (voice.lang || "").toLowerCase();
  const gender = detectVoiceGender(name);

  // Clean brand prefixes
  let cleanName = name
    .replace(/^Microsoft\s+/i, "")
    .replace(/^Google\s+/i, "")
    .replace(/^Apple\s+/i, "")
    .replace(/Online\s+\(Natural\)/i, "")
    .replace(/\s*-\s*English\s*\(.*?\)/i, "")
    .replace(/\s*\(United States\)/i, "")
    .replace(/\s*\(United Kingdom\)/i, "")
    .trim();

  let region = "Quốc tế";
  if (lang.includes("us")) region = "Mỹ";
  else if (lang.includes("gb")) region = "Anh";
  else if (lang.includes("au")) region = "Úc";
  else if (lang.includes("ca")) region = "Canada";
  else if (lang.includes("in")) region = "Ấn Độ";
  else if (lang.includes("ie")) region = "Ireland";

  const isNatural = /natural/i.test(name) ? " • AI" : "";
  return `${cleanName} (${region} • ${gender}${isNatural})`;
};
