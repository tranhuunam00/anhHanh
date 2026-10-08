/**
 * Web Audio API Feedback Sound Synthesizer
 * Produces zero-latency, crisp harmonic chords for correct answers
 * and snappy double-thud tones for incorrect answers.
 */

let cachedAudioCtx = null;

export const getFeedbackAudioCtx = () => {
  if (typeof window === "undefined") return null;

  if (!cachedAudioCtx || cachedAudioCtx.state === "closed") {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      cachedAudioCtx = new AudioCtx();
    }
  }
  if (cachedAudioCtx && cachedAudioCtx.state === "suspended") {
    cachedAudioCtx.resume().catch(() => {});
  }
  return cachedAudioCtx;
};

export const playSoundFeedback = (isCorrect) => {
  try {
    const ctx = getFeedbackAudioCtx();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (isCorrect) {
      // Âm thanh ĐÚNG: Hợp âm sáng đi lên trong trẻo (D5 -> A5 & A4 -> E5)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc2.type = "sine";

      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.1); // A5

      osc2.frequency.setValueAtTime(440, now); // A4
      osc2.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.32);
      osc2.stop(now + 0.32);
    } else {
      // Âm thanh SAI: 2 nhịp đầm dứt khoát (Double-tap low thud)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      const filter1 = ctx.createBiquadFilter();

      osc1.type = "sawtooth";
      filter1.type = "lowpass";
      filter1.frequency.setValueAtTime(420, now);

      osc1.frequency.setValueAtTime(175, now);
      osc1.frequency.exponentialRampToValueAtTime(110, now + 0.07);

      gain1.gain.setValueAtTime(0.25, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc1.connect(filter1);
      filter1.connect(gain1);
      gain1.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.08);

      // Nhịp 2 sau 0.09s
      const t2 = now + 0.09;
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      const filter2 = ctx.createBiquadFilter();

      osc2.type = "sawtooth";
      filter2.type = "lowpass";
      filter2.frequency.setValueAtTime(380, t2);

      osc2.frequency.setValueAtTime(125, t2);
      osc2.frequency.exponentialRampToValueAtTime(80, t2 + 0.11);

      gain2.gain.setValueAtTime(0.25, t2);
      gain2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.13);

      osc2.connect(filter2);
      filter2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.start(t2);
      osc2.stop(t2 + 0.13);
    }
  } catch (err) {
    // Graceful fallback if Web Audio is muted/blocked
  }
};
