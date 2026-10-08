/**
 * Reader Voices & Accent Configuration Utility
 * Provides accent filtering, gender heuristic detection, and tone/pitch presets
 * for Web Speech Synthesis in Smart Reader.
 */

export const ACCENT_OPTIONS = [
  { code: "ALL", label: "Tất cả" },
  { code: "en-US", label: "Mỹ" },
  { code: "en-GB", label: "Anh" },
  { code: "en-IN", label: "Ấn Độ" },
  { code: "en-AU", label: "Úc" },
];

export const PITCH_PRESETS = [
  { id: "standard", label: "Chuẩn" },
  { id: "deep", label: "Trầm ấm" },
  { id: "energetic", label: "Trẻ trung" },
  { id: "indian_style", label: "Ấn Độ 🇮🇳" },
];

/**
 * Detect voice gender from voice name heuristics
 */
export const detectVoiceGender = (voiceName = "") => {
  if (!voiceName || typeof voiceName !== "string") return "Neutral";
  const lower = voiceName.toLowerCase();

  const femaleMarkers = [
    "female", "woman", "girl", "zira", "jenny", "sonia", "natasha",
    "neerja", "heera", "veena", "samantha", "karen", "moira", "tessa",
    "victoria", "susan", "hazel", "aria", "steffan", "clara", "catherine"
  ];
  if (femaleMarkers.some((m) => lower.includes(m))) {
    return "Nữ";
  }

  const maleMarkers = [
    "male", "man", "boy", "david", "guy", "ryan", "george",
    "mark", "daniel", "rishi", "ravi", "prabhat", "rajesh", "oliver", "james"
  ];
  if (maleMarkers.some((m) => lower.includes(m))) {
    return "Nam";
  }

  return "Tự nhiên";
};

/**
 * Filter list of voices by selected accent code
 * If Indian accent is chosen but OS has no local voice, provides virtual presets.
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

  if (target === "en-in") {
    const indianMatches = voices.filter((v) => {
      if (!v) return false;
      const lang = (v.lang || "").toLowerCase();
      const name = (v.name || "").toLowerCase();
      return (
        lang === "en-in" ||
        lang === "en_in" ||
        lang.startsWith("hi") ||
        name.includes("india") ||
        name.includes("indian") ||
        name.includes("ravi") ||
        name.includes("heera") ||
        name.includes("neerja") ||
        name.includes("veena") ||
        name.includes("prabhat") ||
        name.includes("hindi")
      );
    });

    if (indianMatches.length === 0) {
      // Virtual fallback entries when OS has no local Indian voice package installed
      return [
        {
          voiceURI: "virtual_indian_male",
          name: "Ravi • Ấn Độ (Nam • Indian English)",
          lang: "en-IN",
          isVirtual: true,
        },
        {
          voiceURI: "virtual_indian_female",
          name: "Neerja • Ấn Độ (Nữ • Indian English)",
          lang: "en-IN",
          isVirtual: true,
        },
      ];
    }
    return indianMatches;
  }

  return voices.filter((v) => v && (v.lang || "").toLowerCase().startsWith(target));
};

/**
 * Format a clean, human-readable voice title
 */
export const formatVoiceLabel = (voice) => {
  if (!voice) return "Giọng mặc định";
  if (voice.isVirtual) return voice.name;

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
    .replace(/\s*\(India\)/i, "")
    .trim();

  let region = "Quốc tế";
  if (lang.includes("us")) region = "Mỹ";
  else if (lang.includes("gb")) region = "Anh";
  else if (lang.includes("in") || name.toLowerCase().includes("india")) region = "Ấn Độ";
  else if (lang.includes("au")) region = "Úc";
  else if (lang.includes("ca")) region = "Canada";
  else if (lang.includes("ie")) region = "Ireland";

  const isNatural = /natural/i.test(name) ? " • AI" : "";
  return `${cleanName} (${region} • ${gender}${isNatural})`;
};
