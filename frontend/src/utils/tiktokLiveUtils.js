/**
 * Pure Utility functions for TikTok LIVE Interactive Studio
 */

/**
 * Extract clean single letter answer (A, B, C, D) from raw comment text.
 * Handles inputs like "A", "a", "dap an B", "chọn C.", "D)"
 */
export function normalizeTikTokAnswer(raw) {
  if (!raw || typeof raw !== "string") return "";
  const cleaned = raw.trim().toUpperCase();
  const match = cleaned.match(/\b([A-D])\b|^([A-D])[.\s\)]/);
  if (match) {
    return match[1] || match[2];
  }
  return cleaned;
}

/**
 * Calculate percentage share of votes across options A, B, C, D.
 */
export function calculateVotePercentages(voteCounts = {}) {
  const safeCounts = {
    A: Number(voteCounts?.A) || 0,
    B: Number(voteCounts?.B) || 0,
    C: Number(voteCounts?.C) || 0,
    D: Number(voteCounts?.D) || 0,
  };
  const total = safeCounts.A + safeCounts.B + safeCounts.C + safeCounts.D;
  if (total === 0) {
    return { A: 0, B: 0, C: 0, D: 0, total: 0 };
  }
  return {
    A: Math.round((safeCounts.A / total) * 100),
    B: Math.round((safeCounts.B / total) * 100),
    C: Math.round((safeCounts.C / total) * 100),
    D: Math.round((safeCounts.D / total) * 100),
    total,
  };
}

/**
 * Format score into display string (e.g. "1,200 pts").
 */
export function formatViewerPoints(score = 0) {
  const num = Number(score) || 0;
  return `${num.toLocaleString("vi-VN")} pts`;
}

/**
 * Return rank badge metadata (color, icon, label) for top racers.
 */
export function getRankBadge(index = 0) {
  if (index === 0) {
    return { label: "TOP 1", color: "#eab308", bg: "rgba(234, 179, 8, 0.15)", border: "#facc15" };
  }
  if (index === 1) {
    return { label: "TOP 2", color: "#94a3b8", bg: "rgba(148, 163, 184, 0.15)", border: "#cbd5e1" };
  }
  if (index === 2) {
    return { label: "TOP 3", color: "#b45309", bg: "rgba(180, 83, 9, 0.15)", border: "#d97706" };
  }
  return {
    label: `#${index + 1}`,
    color: "var(--text-secondary)",
    bg: "var(--bg-secondary)",
    border: "var(--border-color)",
  };
}

/**
 * Synthesize cheerful chime audio via Web Audio API (zero audio file dependencies).
 */
export function playWebAudioChime(type = "correct") {
  if (typeof window === "undefined" || !window.AudioContext && !window.webkitAudioContext) {
    return;
  }
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    if (type === "correct") {
      // 2-tone bright rising bell (E5 -> G#5)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(659.25, now); // E5
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(830.61, now + 0.1); // G#5

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.1);
      osc2.start(now + 0.1);
      osc2.stop(now + 0.5);
    } else if (type === "gift") {
      // Celebratory harp ripple
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.12, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.4);
      });
    } else if (type === "timeout") {
      // Dramatic game show "Time's Up" gong / buzzer (2-tone descending)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sawtooth";
      osc2.type = "triangle";
      osc1.frequency.setValueAtTime(320, now);
      osc1.frequency.exponentialRampToValueAtTime(140, now + 0.6);
      osc2.frequency.setValueAtTime(240, now);
      osc2.frequency.exponentialRampToValueAtTime(110, now + 0.6);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.7);
      osc2.start(now);
      osc2.stop(now + 0.7);
    } else if (type === "tick") {
      // Crisp countdown tick
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } else if (type === "start") {
      // Cheerful round start fanfare chime (C5 -> E5 -> G5)
      const notes = [523.25, 659.25, 783.99];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);
        gain.gain.setValueAtTime(0.15, now + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.3);
      });
    }
  } catch {
    // Non-fatal if audio context blocked by browser autoplay policy
  }
}

/**
 * Format raw TikTokLive errors into user-friendly Vietnamese guidance.
 */
export function formatTikTokErrorMessage(rawError = "", uniqueId = "") {
  if (!rawError) return "Không tìm thấy phòng Live. Hãy bật Chế độ Test bên dưới!";
  const err = String(rawError);
  const targetId = uniqueId ? `@${uniqueId.replace(/^@/, "")}` : "tài khoản này";

  if (err.includes("UserOfflineError") || err.toLowerCase().includes("offline")) {
    return `Tài khoản ${targetId} hiện chưa phát sóng Live trên TikTok. Hãy mở app TikTok và Bắt đầu Live trước, hoặc dùng Chế độ Test bên dưới!`;
  }
  if (err.includes("UserNotFound") || err.toLowerCase().includes("not found")) {
    return `Không tìm thấy ${targetId} trên TikTok. Vui lòng kiểm tra lại username.`;
  }
  if (err.includes("InitialCursorMissing") || err.toLowerCase().includes("captcha")) {
    return "TikTok yêu cầu kiểm tra xác thực. Vui lòng thử lại sau vài giây hoặc dùng Chế độ Test.";
  }
  return err;
}

