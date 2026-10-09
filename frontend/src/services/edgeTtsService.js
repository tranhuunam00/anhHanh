/**
 * Edge-TTS Audio Player Service for Smart Reader
 * Streams and plays neural AI voices from backend /api/tts/stream
 */

let activeAudio = null;

export const buildEdgeTtsUrl = ({ text, voice, rate = 1.0, pitch = "standard" }) => {
  if (!text || typeof text !== "string") return "";
  const cleanText = text.trim();
  if (!cleanText) return "";

  // Extract raw voice ID from "edge:en-US-JennyNeural" -> "en-US-JennyNeural"
  const rawVoiceId = voice ? voice.replace(/^edge:/, "") : "en-US-JennyNeural";
  const params = new URLSearchParams({
    text: cleanText,
    voice: rawVoiceId,
    rate: String(rate || 1.0),
    pitch: String(pitch || "standard"),
  });

  return `/api/tts/stream?${params.toString()}`;
};

export const stopEdgeAudio = () => {
  if (activeAudio) {
    try {
      activeAudio.pause();
      activeAudio.currentTime = 0;
      activeAudio.src = "";
    } catch {
      // Ignore cleanup error
    }
    activeAudio = null;
  }
};

export const playEdgeTtsAudio = ({
  text,
  voice,
  rate = 1.0,
  pitch = "standard",
  onStart,
  onEnd,
  onError,
}) => {
  stopEdgeAudio();

  const url = buildEdgeTtsUrl({ text, voice, rate, pitch });
  if (!url) {
    if (onError) onError(new Error("Empty text for TTS"));
    return null;
  }

  const audio = new Audio(url);
  activeAudio = audio;

  audio.onplay = () => {
    if (onStart) onStart();
  };

  audio.onended = () => {
    if (activeAudio === audio) {
      activeAudio = null;
    }
    if (onEnd) onEnd();
  };

  audio.onerror = (err) => {
    if (activeAudio === audio) {
      activeAudio = null;
    }
    if (onError) onError(err);
  };

  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.catch((err) => {
      if (err.name !== "AbortError") {
        console.warn("Edge-TTS Audio play error:", err);
        if (onError) onError(err);
      }
    });
  }

  return audio;
};

export const isEdgeVoice = (voiceUri) => {
  return typeof voiceUri === "string" && voiceUri.startsWith("edge:");
};
