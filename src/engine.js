'use strict';
// ===================== Core =====================
const W = 288, H = 200;
const C = {
  ink: '#2C1A1E', ink2: '#1E0F14',
  plum: '#612C48', plumD: '#471631', plumL: '#864C69', rose: '#DB95B5', roseL: '#FBB1D3',
  pumpkin: '#C97034', orange: '#FE9B5B', rust: '#96490D',
  gold: '#DCA438', goldL: '#F2D27A', cream: '#FFF1C8', white: '#FFFDF4',
  moss: '#5D6A3E', mossD: '#36421B', mossL: '#A1AF7C', mossP: '#DAE9B2',
  slate: '#485E6E', slateD: '#2E3D4A', slateL: '#7E93A3',
  parch: '#F4EBD9', parch2: '#E8DCBE', parch3: '#CBBCA3',
  wood0: '#24140E', wood1: '#3B2418', wood2: '#5A3826', wood3: '#7A4E33', wood4: '#9C6B45', wood5: '#BD8C5E',
  lav: '#A28C9F',
};

const $ = (s) => document.querySelector(s);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

function mk(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d');
  g.imageSmoothingEnabled = false;
  return [c, g];
}
function rand(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hex2rgb(h) { h = h.replace('#', ''); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }
function rgb2hex(r, g, b) { return '#' + [r, g, b].map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join(''); }
function mix(a, b, t) { const A = hex2rgb(a), B = hex2rgb(b); return rgb2hex(lerp(A[0], B[0], t), lerp(A[1], B[1], t), lerp(A[2], B[2], t)); }

// ---- pixel drawing ----
const D = {
  r(g, x, y, w, h, c) { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); },
  p(g, x, y, c) { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), 1, 1); },
  line(g, x0, y0, x1, y1, c) {
    g.fillStyle = c; x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
    const dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1, dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
    let e = dx + dy;
    for (let n = 0; n < 2000; n++) {
      g.fillRect(x0, y0, 1, 1);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * e;
      if (e2 >= dy) { e += dy; x0 += sx; }
      if (e2 <= dx) { e += dx; y0 += sy; }
    }
  },
  ell(g, cx, cy, rx, ry, c) {
    g.fillStyle = c;
    for (let dy = -ry; dy <= ry; dy++) {
      const t = dy / ry;
      const dx = Math.round(rx * Math.sqrt(Math.max(0, 1 - t * t)));
      g.fillRect(Math.round(cx - dx), Math.round(cy + dy), dx * 2 + 1, 1);
    }
  },
  disc(g, cx, cy, r, c) { D.ell(g, cx, cy, r, r, c); },
  ring(g, cx, cy, r, c) {
    g.fillStyle = c;
    let x = r, y = 0, err = 1 - r;
    while (x >= y) {
      for (const [a, b] of [[x, y], [y, x], [-y, x], [-x, y], [-x, -y], [-y, -x], [y, -x], [x, -y]]) g.fillRect(Math.round(cx + a), Math.round(cy + b), 1, 1);
      y++;
      if (err < 0) err += 2 * y + 1; else { x--; err += 2 * (y - x) + 1; }
    }
  },
  dith(g, x, y, w, h, c, lvl) {
    g.fillStyle = c;
    const B = [[0, 2], [3, 1]];
    for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) {
      const X = Math.round(x) + xx, Y = Math.round(y) + yy;
      if (B[Y & 1][X & 1] < lvl) g.fillRect(X, Y, 1, 1);
    }
  },
  poly(g, pts, c) {
    g.fillStyle = c;
    let minY = Infinity, maxY = -Infinity;
    for (const [, y] of pts) { minY = Math.min(minY, y); maxY = Math.max(maxY, y); }
    for (let y = Math.floor(minY); y <= Math.ceil(maxY); y++) {
      const xs = [];
      for (let i = 0; i < pts.length; i++) {
        const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % pts.length];
        if ((y1 <= y + 0.5 && y2 > y + 0.5) || (y2 <= y + 0.5 && y1 > y + 0.5)) xs.push(x1 + ((y + 0.5 - y1) / (y2 - y1)) * (x2 - x1));
      }
      xs.sort((a, b) => a - b);
      for (let i = 0; i + 1 < xs.length; i += 2) {
        const a = Math.round(xs[i]), b = Math.round(xs[i + 1]);
        if (b > a) g.fillRect(a, y, b - a, 1);
      }
    }
  },
  // stepped additive glow
  glow(g, x, y, r, c, a, bands = 4) {
    g.save();
    g.globalCompositeOperation = 'lighter';
    for (let i = bands; i >= 1; i--) { g.globalAlpha = a / bands; D.disc(g, Math.round(x), Math.round(y), Math.max(1, Math.round((r * i) / bands)), c); }
    g.restore();
  },
  // 4-point twinkle
  twinkle(g, x, y, s, c) {
    x = Math.round(x); y = Math.round(y);
    D.p(g, x, y, c);
    for (let i = 1; i <= s; i++) { D.p(g, x + i, y, c); D.p(g, x - i, y, c); D.p(g, x, y + i, c); D.p(g, x, y - i, c); }
  },
};

function buildSprite(rows, map) {
  const h = rows.length, w = Math.max(...rows.map((r) => r.length));
  const [c, g] = mk(w, h);
  rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const col = map[r[x]]; if (col) { g.fillStyle = col; g.fillRect(x, y, 1, 1); } } });
  return c;
}
function flipped(src) {
  const [c, g] = mk(src.width, src.height);
  g.translate(src.width, 0); g.scale(-1, 1); g.drawImage(src, 0, 0);
  return c;
}
// recolor a canvas through a function on rgb
function recolor(src, fn) {
  const [c, g] = mk(src.width, src.height);
  g.drawImage(src, 0, 0);
  const id = g.getImageData(0, 0, c.width, c.height), d = id.data;
  for (let i = 0; i < d.length; i += 4) { if (!d[i + 3]) continue; const o = fn(d[i], d[i + 1], d[i + 2]); d[i] = o[0]; d[i + 1] = o[1]; d[i + 2] = o[2]; }
  g.putImageData(id, 0, 0);
  return c;
}
function drab(r, g, b) {
  const l = 0.3 * r + 0.59 * g + 0.11 * b;
  const k = 0.18; // keep a little color
  return [lerp(l, r, k) * 0.62 + 18, lerp(l, g, k) * 0.62 + 18, lerp(l, b, k) * 0.66 + 26];
}

// ===================== Save =====================
const SAVE_KEY = 'secretAttic.v1';
const save = { stage: 'new', look: { skin: 0, hair: 0, hairColor: 0, shirt: 0 }, name: null, book: null, item: null, seenMirror: false };
function loadSave() {
  try { const s = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); if (s && typeof s === 'object') Object.assign(save, s); } catch (e) { /* storage unavailable */ }
}
function persist() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) { /* storage unavailable */ } }
function wipeSave() {
  try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* storage unavailable */ }
  Object.assign(save, { stage: 'new', look: { skin: 0, hair: 0, hairColor: 0, shirt: 0 }, name: null, book: null, item: null, seenMirror: false });
}
const callName = () => (save.name === 'Visitor' ? 'Visitor' : 'Zoe');

// ===================== Audio =====================
const AU = {
  ctx: null, out: null, sfxBus: null, musBus: null, musGain: null, musicOn: true, noiseBuf: null,
  song: null, tracks: [], timer: null, songName: null,
  init() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const a = (this.ctx = new AC());
    this.out = a.createGain(); this.out.gain.value = 0.9; this.out.connect(a.destination);
    this.sfxBus = a.createGain(); this.sfxBus.gain.value = 0.55; this.sfxBus.connect(this.out);
    this.musGain = a.createGain(); this.musGain.gain.value = 0; this.musGain.connect(this.out);
    this.musBus = a.createGain(); this.musBus.gain.value = 1; this.musBus.connect(this.musGain);
    const dl = a.createDelay(); dl.delayTime.value = 0.32;
    const fb = a.createGain(); fb.gain.value = 0.28;
    const lp = a.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1800;
    this.musBus.connect(dl); dl.connect(lp); lp.connect(fb); fb.connect(dl); lp.connect(this.musGain);
    const len = a.sampleRate * 1;
    this.noiseBuf = a.createBuffer(1, len, a.sampleRate);
    const d = this.noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    this.timer = setInterval(() => this.pump(), 60);
  },
  f(n) {
    if (typeof n === 'number') return n;
    const m = /^([A-G])([#b]?)(-?\d)$/.exec(n);
    if (!m) return 0;
    const base = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 }[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0);
    return 440 * Math.pow(2, (base + (parseInt(m[3], 10) - 4) * 12) / 12);
  },
  tone({ f, t = 0, d = 0.2, type = 'triangle', v = 0.2, a = 0.005, slide = null, out = null, lp = null }) {
    if (!this.ctx) return;
    const ac = this.ctx, t0 = ac.currentTime + t;
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.setValueAtTime(this.f(f), t0);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, this.f(slide)), t0 + d);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, v), t0 + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
    let node = o;
    if (lp) { const fl = ac.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = lp; o.connect(fl); node = fl; }
    node.connect(g); g.connect(out || this.sfxBus);
    o.start(t0); o.stop(t0 + d + 0.05);
  },
  noise({ t = 0, d = 0.2, v = 0.2, f = 1000, fEnd = null, q = 1, type = 'lowpass', out = null }) {
    if (!this.ctx) return;
    const ac = this.ctx, t0 = ac.currentTime + t;
    const s = ac.createBufferSource(); s.buffer = this.noiseBuf; s.loop = true;
    const fl = ac.createBiquadFilter(); fl.type = type; fl.frequency.setValueAtTime(f, t0); fl.Q.value = q;
    if (fEnd) fl.frequency.exponentialRampToValueAtTime(fEnd, t0 + d);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(v, t0 + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
    s.connect(fl); fl.connect(g); g.connect(out || this.sfxBus);
    s.start(t0, Math.random() * 0.5); s.stop(t0 + d + 0.05);
  },
  sfx(name, p) { try { if (this.ctx) SFX[name] && SFX[name](p); } catch (e) { /* ignore audio errors */ } },
  setSong(name) {
    if (!this.ctx || name === this.songName) return;
    this.songName = name;
    const ac = this.ctx, now = ac.currentTime;
    this.musGain.gain.cancelScheduledValues(now);
    this.musGain.gain.setValueAtTime(this.musGain.gain.value, now);
    this.musGain.gain.linearRampToValueAtTime(0.0001, now + 0.6);
    setTimeout(() => {
      const s = SONGS[name];
      this.song = s;
      if (!s) { this.tracks = []; return; }
      const start = this.ctx.currentTime + 0.1;
      this.tracks = s.tracks.map((tr) => ({ ...tr, notes: parseSeq(tr.seq), i: 0, next: start }));
      const t2 = this.ctx.currentTime;
      this.musGain.gain.cancelScheduledValues(t2);
      this.musGain.gain.setValueAtTime(0.0001, t2);
      if (this.musicOn) this.musGain.gain.linearRampToValueAtTime(s.vol || 0.32, t2 + 1.2);
    }, 650);
  },
  setMusic(on) {
    this.musicOn = on;
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.musGain.gain.cancelScheduledValues(now);
    this.musGain.gain.setValueAtTime(this.musGain.gain.value, now);
    this.musGain.gain.linearRampToValueAtTime(on ? (this.song?.vol || 0.32) : 0.0001, now + 0.4);
  },
  pump() {
    if (!this.ctx || !this.song) return;
    const spb = 60 / this.song.bpm, horizon = this.ctx.currentTime + 0.3;
    for (const tr of this.tracks) {
      let guard = 0;
      while (tr.next < horizon && guard++ < 32) {
        const [n, beats] = tr.notes[tr.i];
        if (n !== '-') INST[tr.inst](n, tr.next - this.ctx.currentTime, beats * spb, tr.v);
        tr.next += beats * spb;
        tr.i = (tr.i + 1) % tr.notes.length;
      }
    }
  },
};
function parseSeq(s) { return s.trim().split(/\s+/).map((tok) => { const [n, b] = tok.split(':'); return [n, parseFloat(b)]; }); }
const INST = {
  box(n, t, d, v) { AU.tone({ f: n, t, d: Math.min(1.6, d * 1.6 + 0.3), type: 'triangle', v, a: 0.004, out: AU.musBus }); AU.tone({ f: AU.f(n) * 2, t, d: 0.5, type: 'sine', v: v * 0.25, out: AU.musBus }); },
  bass(n, t, d, v) { AU.tone({ f: n, t, d: Math.max(0.2, d * 0.95), type: 'triangle', v, a: 0.02, out: AU.musBus }); },
  pluck(n, t, d, v) { AU.tone({ f: n, t, d: 0.35, type: 'square', v, a: 0.003, lp: 1500, out: AU.musBus }); },
  pad(n, t, d, v) { AU.tone({ f: n, t, d: d * 1.05, type: 'sine', v, a: Math.min(0.4, d * 0.4), out: AU.musBus }); },
};
const SONGS = {
  night: { bpm: 74, vol: 0.3, tracks: [
    { inst: 'box', v: 0.15, seq: 'E5:2 D5:1 C5:3 A4:2 C5:1 B4:3 E5:1 G5:1 E5:1 D5:3 C5:1 A4:1 F4:1 G4:3' },
    { inst: 'bass', v: 0.1, seq: 'C3:1 G3:1 E4:1 A2:1 E3:1 C4:1 F2:1 C3:1 A3:1 G2:1 D3:1 B3:1 C3:1 G3:1 E4:1 G2:1 D3:1 B3:1 F2:1 C3:1 A3:1 G2:1 D3:1 G3:1' },
  ] },
  stairs: { bpm: 80, vol: 0.3, tracks: [
    { inst: 'box', v: 0.13, seq: 'C5:1 E5:1 G5:1 C6:1 B5:1 G5:1 E5:2 A4:1 C5:1 E5:1 A5:1 G5:2 -:2 F4:1 A4:1 C5:1 F5:1 E5:1 C5:1 A4:2 G4:1 B4:1 D5:1 G5:1 F5:2 -:2' },
    { inst: 'pad', v: 0.08, seq: 'C3:8 A2:8 F2:8 G2:8' },
  ] },
  forest: { bpm: 100, vol: 0.3, tracks: [
    { inst: 'box', v: 0.14, seq: 'G4:1 B4:1 D5:1 E5:1 D5:2 B4:1 A4:1 G4:1 A4:1 B4:2 -:2 E5:1 D5:1 B4:1 G4:1 A4:2 D5:2 B4:1 A4:1 G4:4 -:4' },
    { inst: 'bass', v: 0.1, seq: 'G2:2 D3:2 G2:2 D3:2 E2:2 B2:2 E2:2 B2:2 C3:2 G3:2 C3:2 G3:2 D3:2 A3:2 D3:2 F#3:2' },
    { inst: 'pluck', v: 0.025, seq: 'G4:.5 B4:.5 D5:.5 B4:.5 G4:.5 B4:.5 D5:.5 B4:.5 E4:.5 G4:.5 B4:.5 G4:.5 E4:.5 G4:.5 B4:.5 G4:.5 C4:.5 E4:.5 G4:.5 E4:.5 C4:.5 E4:.5 G4:.5 E4:.5 D4:.5 F#4:.5 A4:.5 F#4:.5 D4:.5 F#4:.5 A4:.5 F#4:.5' },
  ] },
  drab: { bpm: 58, vol: 0.28, tracks: [
    { inst: 'box', v: 0.1, seq: 'A4:3 -:1 G4:2 E4:2 -:4 C4:3 -:1 D4:2 E4:2 -:4' },
    { inst: 'pad', v: 0.07, seq: 'A2:4 E2:4 F2:4 C3:4 D2:4 E2:4' },
  ] },
  warm: { bpm: 96, vol: 0.32, tracks: [
    { inst: 'box', v: 0.14, seq: 'C5:2 A4:1 F4:2 A4:1 G4:3 C5:1 D5:1 E5:1 F5:2 E5:1 D5:2 C5:1 D5:3 -:3 A4:2 C5:1 F5:2 E5:1 D5:2 Bb4:1 G4:3 E5:1 F5:1 G5:1 F5:2 C5:1 A4:2 G4:1 F4:3 -:3' },
    { inst: 'bass', v: 0.1, seq: 'F2:1 A3:1 C4:1 F2:1 A3:1 C4:1 C3:1 G3:1 E4:1 C3:1 G3:1 E4:1 Bb2:1 F3:1 D4:1 Bb2:1 F3:1 D4:1 C3:1 G3:1 E4:1 C3:1 G3:1 Bb3:1 F2:1 A3:1 C4:1 D3:1 A3:1 F4:1 Bb2:1 F3:1 D4:1 C3:1 G3:1 E4:1 Bb2:1 F3:1 D4:1 C3:1 G3:1 E4:1 F2:1 A3:1 C4:1 F2:1 C3:1 F3:1' },
  ] },
};
const SFX = {
  tap() { AU.tone({ f: 1046, d: 0.06, type: 'triangle', v: 0.06 }); },
  blip(p) { AU.tone({ f: p || 520, d: 0.04, type: 'square', v: 0.018, lp: 2200 }); },
  knock() {
    for (const t of [0, 0.2]) { AU.noise({ t, d: 0.09, v: 0.6, f: 260 }); AU.tone({ f: 86, t, d: 0.12, type: 'sine', v: 0.5 }); }
  },
  knockFar() {
    for (const t of [0, 0.22]) { AU.noise({ t, d: 0.08, v: 0.35, f: 200 }); AU.tone({ f: 70, t, d: 0.1, type: 'sine', v: 0.3 }); }
  },
  creak() { AU.tone({ f: 120, slide: 210, d: 0.9, type: 'sawtooth', v: 0.035, a: 0.1, lp: 700 }); AU.tone({ f: 180, slide: 150, t: 0.3, d: 0.6, type: 'sawtooth', v: 0.025, a: 0.1, lp: 600 }); },
  sparkle() { ['C6', 'E6', 'G6', 'C7'].forEach((n, i) => AU.tone({ f: n, t: i * 0.07, d: 0.35, type: 'triangle', v: 0.06 })); },
  chime() { ['G5', 'C6', 'E6', 'G6', 'C7'].forEach((n, i) => AU.tone({ f: n, t: i * 0.09, d: 0.9, type: 'triangle', v: 0.07 })); },
  surprise() { AU.tone({ f: 880, d: 0.07, type: 'square', v: 0.04, lp: 3000 }); AU.tone({ f: 1320, t: 0.08, d: 0.12, type: 'square', v: 0.04, lp: 3000 }); },
  cheer() {
    ['C5', 'E5', 'G5', 'C6', 'E6'].forEach((n, i) => AU.tone({ f: n, t: i * 0.05, d: 0.18, type: 'square', v: 0.03, lp: 2500 }));
    AU.noise({ t: 0.05, d: 0.4, v: 0.05, f: 4000, type: 'highpass' });
  },
  whoosh() { AU.noise({ d: 0.7, v: 0.25, f: 300, fEnd: 3000, q: 2, type: 'bandpass' }); },
  fwoomp() { AU.noise({ d: 1.2, v: 0.5, f: 150, fEnd: 1800 }); AU.tone({ f: 65, d: 0.7, type: 'sine', v: 0.5, a: 0.05 }); ['F4', 'A4', 'C5', 'F5'].forEach((n, i) => AU.tone({ f: n, t: 0.3 + i * 0.09, d: 1.2, type: 'triangle', v: 0.06 })); },
  page() { AU.noise({ d: 0.12, v: 0.18, f: 2500, type: 'highpass' }); AU.noise({ t: 0.1, d: 0.1, v: 0.12, f: 3000, type: 'highpass' }); },
  poof() { AU.noise({ d: 0.3, v: 0.3, f: 2000, fEnd: 400 }); AU.tone({ f: 660, slide: 330, d: 0.2, type: 'sine', v: 0.08 }); },
  pop() { AU.tone({ f: 520, slide: 880, d: 0.08, type: 'sine', v: 0.12 }); },
  squish() { AU.tone({ f: 300, slide: 90, d: 0.25, type: 'sine', v: 0.2 }); AU.noise({ d: 0.15, v: 0.1, f: 600 }); },
  rattle() { for (let i = 0; i < 4; i++) AU.noise({ t: i * 0.07, d: 0.05, v: 0.25, f: 3000, type: 'bandpass', q: 4 }); },
  crackle() { AU.noise({ d: 0.03 + Math.random() * 0.03, v: 0.04 + Math.random() * 0.06, f: 2000 + Math.random() * 3000, type: 'bandpass', q: 3 }); },
  click() { AU.tone({ f: 1800, d: 0.03, type: 'square', v: 0.03, lp: 4000 }); },
  step() { AU.noise({ d: 0.025, v: 0.035, f: 1400, type: 'highpass' }); },
  climb() { for (let i = 0; i < 3; i++) AU.noise({ t: i * 0.14, d: 0.05, v: 0.06, f: 700 }); },
  twinkle() { ['E6', 'G6', 'B6', 'E7', 'B6', 'G6'].forEach((n, i) => AU.tone({ f: n, t: i * 0.11, d: 0.4, type: 'triangle', v: 0.05 })); },
  notes() { ['C5', 'E5', 'G5', 'E5'].forEach((n, i) => AU.tone({ f: n, t: i * 0.15, d: 0.25, type: 'square', v: 0.025, lp: 2000 })); },
};

// ===================== Speech =====================
const VOICES = {
  n: { pitch: 1.0, rate: 0.95 },
  greg: { pitch: 1.35, rate: 1.0 },
  sp: { pitch: 1.9, rate: 1.1 },
  all: { pitch: 1.8, rate: 1.05 },
};
// Read-aloud is switched off on purpose: Zoe reads the game herself.
const Voice = {
  on: false, v: null,
  supported: false,
  pick() {
    if (!this.supported) return;
    const vs = speechSynthesis.getVoices();
    const pref = ['Samantha', 'Ava', 'Allison', 'Karen', 'Moira', 'Google US English', 'Microsoft Aria', 'Microsoft Jenny', 'Microsoft Zira'];
    for (const p of pref) { const f = vs.find((v) => v.name.includes(p) && /^en/i.test(v.lang)); if (f) { this.v = f; return; } }
    this.v = vs.find((v) => /^en[-_]US/i.test(v.lang)) || vs.find((v) => /^en/i.test(v.lang)) || null;
  },
  unlock() {
    if (!this.supported) return;
    this.pick();
    speechSynthesis.onvoiceschanged = () => this.pick();
    try { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; speechSynthesis.speak(u); } catch (e) { /* ignore */ }
  },
  say(text, who) {
    if (!this.on || !this.supported) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(this.clean(text));
      if (this.v) u.voice = this.v;
      const p = VOICES[who] || VOICES.n;
      u.pitch = p.pitch; u.rate = p.rate;
      setTimeout(() => speechSynthesis.speak(u), 40);
    } catch (e) { /* ignore */ }
  },
  stop() { if (this.supported) try { speechSynthesis.cancel(); } catch (e) { /* ignore */ } },
  clean(t) { return t.replace(/[•*]/g, '').replace(/\.\.\./g, '... ').replace(/\bGREG\b/g, 'Greg'); },
};
