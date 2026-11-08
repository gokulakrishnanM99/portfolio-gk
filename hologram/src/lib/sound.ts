/* Tiny synthesized UI sound kit (WebAudio, no assets). Off by default. */
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = false;

try { enabled = localStorage.getItem('gkos-sound') === 'on'; } catch { /* storage blocked */ }

function ac() {
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.16;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export const sound = {
  get enabled() { return enabled; },
  set(on: boolean) {
    enabled = on;
    try { localStorage.setItem('gkos-sound', on ? 'on' : 'off'); } catch { /* ignore */ }
    if (on) this.blip(880);
  },
  blip(freq = 1320, dur = 0.06) {
    if (!enabled) return;
    const c = ac(); if (!c || !master) return;
    const o = c.createOscillator(), g = c.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(freq, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(freq * 1.5, c.currentTime + dur);
    g.gain.setValueAtTime(0.0001, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.35, c.currentTime + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
    o.connect(g).connect(master);
    o.start(); o.stop(c.currentTime + dur + 0.02);
  },
  tick() { this.blip(2400, 0.025); },
  whoosh(dur = 1.2) {
    if (!enabled) return;
    const c = ac(); if (!c || !master) return;
    const len = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource(); src.buffer = buf;
    const f = c.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 1.2;
    f.frequency.setValueAtTime(260, c.currentTime);
    f.frequency.exponentialRampToValueAtTime(2400, c.currentTime + dur * 0.5);
    f.frequency.exponentialRampToValueAtTime(400, c.currentTime + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.5, c.currentTime + dur * 0.45);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
    src.connect(f).connect(g).connect(master);
    src.start();
    this.blip(520, 0.12);
  },
  chord() {
    if (!enabled) return;
    [523.25, 783.99, 1046.5].forEach((f, i) => setTimeout(() => this.blip(f, 0.18), i * 90));
  },
};
