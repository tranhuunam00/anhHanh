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
  { id: "standard", label: "Chuẩn", pitch: 1.0 },
  { id: "deep", label: "Trầm ấm", pitch: 0.82 },
  { id: "energetic", label: "Trẻ trung", pitch: 1.2 },
  { id: "indian_style", label: "Ấn Độ 🇮🇳", pitch: 1.15 },
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

export const EDGE_AI_VOICES = [
  {
    voiceURI: "edge:en-US-JennyNeural",
    name: "Jenny • Mỹ (Nữ • AI Tự Nhiên ✨)",
    lang: "en-US",
    isEdgeAI: true,
  },
  {
    voiceURI: "edge:en-US-GuyNeural",
    name: "Guy • Mỹ (Nam • AI Tự Nhiên ✨)",
    lang: "en-US",
    isEdgeAI: true,
  },
  {
    voiceURI: "edge:en-US-AriaNeural",
    name: "Aria • Mỹ (Nữ • AI Diễn Cảm ✨)",
    lang: "en-US",
    isEdgeAI: true,
  },
  {
    voiceURI: "edge:en-GB-SoniaNeural",
    name: "Sonia • Anh (Nữ • AI Chuẩn London ✨)",
    lang: "en-GB",
    isEdgeAI: true,
  },
  {
    voiceURI: "edge:en-GB-RyanNeural",
    name: "Ryan • Anh (Nam • AI Chuẩn London ✨)",
    lang: "en-GB",
    isEdgeAI: true,
  },
  {
    voiceURI: "edge:en-AU-NatashaNeural",
    name: "Natasha • Úc (Nữ • AI Tự Nhiên ✨)",
    lang: "en-AU",
    isEdgeAI: true,
  },
  {
    voiceURI: "edge:en-IN-NeerjaNeural",
    name: "Neerja • Ấn Độ (Nữ • AI Tự Nhiên ✨)",
    lang: "en-IN",
    isEdgeAI: true,
  },
];

/**
 * Filter list of voices by selected accent code
 * If Indian accent is chosen but OS has no local voice, provides virtual presets.
 * If options.includeEdgeAI is true, prepends matching Neural Edge-TTS voices at the top.
 */
export const filterVoicesByAccent = (voices = [], accentCode = "ALL", options = {}) => {
  const includeEdgeAI = Boolean(options && options.includeEdgeAI);
  let edgeMatches = [];
  if (includeEdgeAI) {
    if (!accentCode || accentCode === "ALL") {
      edgeMatches = [...EDGE_AI_VOICES];
    } else {
      const targetLang = accentCode.toLowerCase();
      edgeMatches = EDGE_AI_VOICES.filter((v) =>
        (v.lang || "").toLowerCase().startsWith(targetLang)
      );
    }
  }

  if (!Array.isArray(voices)) return edgeMatches;
  if (!accentCode || accentCode === "ALL") {
    // Return all English voices first, then others
    const sortedBrowser = [...voices].sort((a, b) => {
      const aIsEn = (a.lang || "").toLowerCase().startsWith("en");
      const bIsEn = (b.lang || "").toLowerCase().startsWith("en");
      if (aIsEn && !bIsEn) return -1;
      if (!aIsEn && bIsEn) return 1;
      return (a.name || "").localeCompare(b.name || "");
    });
    return [...edgeMatches, ...sortedBrowser];
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
        ...edgeMatches,
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
    return [...edgeMatches, ...indianMatches];
  }

  const filtered = voices.filter((v) => v && (v.lang || "").toLowerCase().startsWith(target));
  return [...edgeMatches, ...filtered];
};

/**
 * Format a clean, human-readable voice title
 */
export const formatVoiceLabel = (voice) => {
  if (!voice) return "Giọng mặc định";
  if (voice.isVirtual || voice.isEdgeAI) return voice.name;

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

/**
 * Resolves active SpeechSynthesisVoice object matching selected voice URI or accent fallback.
 * @param {SpeechSynthesisVoice[]} voices
 * @param {string} selectedVoiceUri
 * @param {string} selectedAccent
 * @returns {SpeechSynthesisVoice|null}
 */
export const resolveSpeechVoice = (voices = [], selectedVoiceUri = "", selectedAccent = "ALL") => {
  if (!voices || voices.length === 0) return null;

  // Handle virtual Indian voice options when no native voice is installed
  if (selectedVoiceUri === "virtual_indian_male") {
    const realIndianMale = voices.find((v) => {
      const n = (v.name || "").toLowerCase();
      const l = (v.lang || "").toLowerCase();
      return (l.includes("in") || n.includes("india")) && (n.includes("ravi") || n.includes("male") || n.includes("prabhat"));
    });
    if (realIndianMale) return realIndianMale;
    const maleEn = voices.find((v) => {
      const n = (v.name || "").toLowerCase();
      return (v.lang || "").toLowerCase().startsWith("en") && (n.includes("male") || n.includes("david") || n.includes("guy") || n.includes("george"));
    });
    return maleEn || voices[0] || null;
  }

  if (selectedVoiceUri === "virtual_indian_female") {
    const realIndianFemale = voices.find((v) => {
      const n = (v.name || "").toLowerCase();
      const l = (v.lang || "").toLowerCase();
      return (l.includes("in") || n.includes("india")) && (n.includes("neerja") || n.includes("female") || n.includes("heera") || n.includes("veena"));
    });
    if (realIndianFemale) return realIndianFemale;
    const femaleEn = voices.find((v) => {
      const n = (v.name || "").toLowerCase();
      return (v.lang || "").toLowerCase().startsWith("en") && (n.includes("female") || n.includes("zira") || n.includes("jenny") || n.includes("samantha"));
    });
    return femaleEn || voices[0] || null;
  }

  if (selectedVoiceUri) {
    const match = voices.find((v) => (v.voiceURI || v.name) === selectedVoiceUri);
    if (match) return match;
  }

  // Fallback: accent match or general English voice
  if (selectedAccent && selectedAccent !== "ALL") {
    if (selectedAccent === "en-IN") {
      const inMatch = voices.find((v) => {
        const l = (v.lang || "").toLowerCase();
        const n = (v.name || "").toLowerCase();
        return l.includes("in") || n.includes("india") || n.includes("ravi") || n.includes("neerja");
      });
      if (inMatch) return inMatch;
    } else {
      const accentMatch = voices.find((v) =>
        (v.lang || "").toLowerCase().startsWith(selectedAccent.toLowerCase())
      );
      if (accentMatch) return accentMatch;
    }
  }

  const enMatch = voices.find((v) => (v.lang || "").toLowerCase().startsWith("en"));
  return enMatch || voices[0] || null;
};
