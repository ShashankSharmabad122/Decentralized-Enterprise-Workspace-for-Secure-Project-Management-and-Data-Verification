// =======================================================
//  dOS · Igloo.inc Audio FX Synthesizer
//  Web Audio API — Tactical Soundscapes
// =======================================================

class IglooAudio {
  private ctx: AudioContext | null = null;
  private muted = false;

  private boot() {
    if (!this.ctx) {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    if (this.ctx?.state === 'suspended') this.ctx.resume();
  }

  toggle(): boolean { this.muted = !this.muted; return this.muted; }
  isMuted(): boolean { return this.muted; }

  // Crisp crystal interaction click
  click() {
    if (this.muted) return;
    this.boot();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(2200, t);
    o.frequency.exponentialRampToValueAtTime(4400, t + 0.04);
    g.gain.setValueAtTime(0.08, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
    o.connect(g); g.connect(this.ctx.destination);
    o.start(t); o.stop(t + 0.07);
  }

  // Camera warp / portal zoom
  warp() {
    if (this.muted) return;
    this.boot();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    o.type = 'sine';
    o.frequency.setValueAtTime(90, t);
    o.frequency.exponentialRampToValueAtTime(1800, t + 0.5);
    filter.type = 'bandpass'; filter.frequency.value = 800;
    g.gain.setValueAtTime(0.15, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
    o.connect(filter); filter.connect(g); g.connect(this.ctx.destination);
    o.start(t); o.stop(t + 0.55);
  }

  // Ice shatter / burst
  shatter() {
    if (this.muted) return;
    this.boot();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const buf = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 0.35), this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.25));
    const src = this.ctx.createBufferSource(); src.buffer = buf;
    const hp = this.ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 2800;
    const g = this.ctx.createGain(); g.gain.setValueAtTime(0.2, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    src.connect(hp); hp.connect(g); g.connect(this.ctx.destination);
    src.start(t);
  }

  // Ambient ice hum (low drone)
  hum() {
    if (this.muted) return;
    this.boot();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = 'sine'; o.frequency.value = 55;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.04, t + 0.8);
    g.gain.linearRampToValueAtTime(0, t + 3);
    o.connect(g); g.connect(this.ctx.destination);
    o.start(t); o.stop(t + 3);
  }
}

export const audioFX = new IglooAudio();
