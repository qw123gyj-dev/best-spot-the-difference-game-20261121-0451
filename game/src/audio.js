// audio.js — tiny WebAudio sound effects, synthesized live (no audio files).
// The AudioContext is created lazily on the first user gesture so the game
// stays silent (and error-free) in headless screenshots.

let ctx = null;
let muted = false;

function ensureCtx() {
  if (!ctx) {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      ctx = new AC();
    } catch (e) {
      ctx = null;
    }
  }
  if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

function tone(freq, startAt, dur, type, vol) {
  const ac = ensureCtx();
  if (!ac || muted) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type || 'sine';
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, ac.currentTime + startAt);
  gain.gain.exponentialRampToValueAtTime(vol || 0.12, ac.currentTime + startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + startAt + dur);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(ac.currentTime + startAt);
  osc.stop(ac.currentTime + startAt + dur + 0.05);
}

export const sfx = {
  unlock() {
    ensureCtx();
  },
  click() {
    tone(660, 0, 0.06, 'triangle', 0.05);
  },
  found() {
    tone(880, 0, 0.12, 'sine', 0.12);
    tone(1318, 0.09, 0.18, 'sine', 0.12);
  },
  wrong() {
    tone(160, 0, 0.18, 'sawtooth', 0.07);
  },
  hint() {
    tone(523, 0, 0.1, 'sine', 0.08);
    tone(784, 0.08, 0.14, 'sine', 0.08);
  },
  levelDone() {
    [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.11, 0.22, 'triangle', 0.1));
  },
  gameDone() {
    [523, 659, 784, 1046, 1318, 1568].forEach((f, i) => tone(f, i * 0.12, 0.3, 'triangle', 0.1));
  },
  timeUp() {
    [392, 330, 262].forEach((f, i) => tone(f, i * 0.16, 0.25, 'triangle', 0.09));
  },
  isMuted() {
    return muted;
  },
  toggleMute() {
    muted = !muted;
    return muted;
  },
};
