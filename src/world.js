// ===================== Stage & runtime =====================
const stage = $('#stage');
const cvs = $('#game');
const ctx = cvs.getContext('2d');
cvs.width = W; cvs.height = H;
ctx.imageSmoothingEnabled = false;
let SCALE = 4;
let playAnyway = false;

function layout() {
  const vw = window.innerWidth, vh = window.innerHeight;
  let s = Math.min(vw / W, vh / H);
  if (s >= 2 && Math.floor(s) / s >= 0.88) s = Math.floor(s);
  SCALE = s;
  stage.style.width = W * s + 'px';
  stage.style.height = H * s + 'px';
  document.documentElement.style.setProperty('--u', s + 'px');
  $('#rotate').hidden = playAnyway || !(vh > vw * 1.15);
}
window.addEventListener('resize', layout);

let scene = null;
let busy = false;
let cutN = 0;
const isBusy = () => busy || cutN > 0;
let T = 0;
const cam = { x: 0, y: 0 };
const FX = { fade: 0, fadeColor: C.ink2, iris: null, zoom: null, flash: 0, flashColor: '#FFF6C8' };
const PT = [];
let hints = [];

// ===================== Zoe =====================
const SKINS = [
  { s: '#F7D7BF', S: '#E4B396', c: '#EFA196' },
  { s: '#EBBB94', S: '#D09872', c: '#E08E7C' },
  { s: '#C98D62', S: '#A86F48', c: '#C9705E' },
  { s: '#8F5B3C', S: '#70432A', c: '#B05A46' },
];
const HAIRC = [
  { h: '#5A3220', H: '#7E4A2E', d: '#3A1E12' },
  { h: '#2A2230', H: '#4A4052', d: '#16111A' },
  { h: '#D9A848', H: '#F2CF7C', d: '#A57728' },
  { h: '#B4502A', H: '#D97A44', d: '#7E3218' },
  { h: '#8C5A34', H: '#B57E50', d: '#62401F' },
];
const SHIRTS = [
  { t: '#E98AA2', T: '#C76580' }, { t: '#F0903E', T: '#C8692A' }, { t: '#9A6AB0', T: '#74488A' },
  { t: '#7D9A4C', T: '#5C7536' }, { t: '#5A84C4', T: '#40639C' }, { t: '#F2C94C', T: '#C99A2E' },
];
const HAIRS = ['pigtails', 'long', 'curly'];

function zoeFrames(look) {
  const sk = SKINS[look.skin] || SKINS[0], hc = HAIRC[look.hairColor] || HAIRC[0], sh = SHIRTS[look.shirt] || SHIRTS[0];
  const st = HAIRS[look.hair] || HAIRS[0];
  const map = { o: C.ink, e: C.ink, w: C.ink, m: '#9C3B4A', b: C.plum, s: sk.s, S: sk.S, c: sk.c, t: sh.t, T: sh.T, h: hc.h, H: hc.H, d: hc.d };
  const hf = buildSprite(SPR.hairFront[st], map), hs = buildSprite(SPR.hairSide[st], map);
  const front = (rows, extra) => { const [c, g] = mk(24, 28); g.drawImage(buildSprite(rows, map), 3, 3); g.drawImage(hf, 0, 1); if (extra) g.drawImage(buildSprite(extra, map), 0, 1); return c; };
  const head = buildSprite(SPR.zoeSideHead, map);
  const side = (bodyRows, crouch) => {
    const [c, g] = mk(24, 28);
    if (crouch) { g.drawImage(buildSprite(bodyRows, map), 3, 20); g.drawImage(head, 3, 7); g.drawImage(hs, 0, 5); }
    else { g.drawImage(buildSprite(bodyRows, map), 3, 16); g.drawImage(head, 3, 3); g.drawImage(hs, 0, 1); }
    return c;
  };
  const F = {
    front: front(SPR.zoeFront),
    blink: front(SPR.zoeFront.map((r, i) => (i === 6 ? r.replace(/e/g, 's') : r))),
    cheer: front(SPR.zoeCheerBody, SPR.zoeArmsUp),
    stand: side(SPR.zoeSideBody.stand),
    walk: [side(SPR.zoeSideBody.walk1), side(SPR.zoeSideBody.walk2), side(SPR.zoeSideBody.walk3), side(SPR.zoeSideBody.walk2)],
    crouch: side(SPR.zoeSideBody.crouch, true),
  };
  const flipAll = (o) => { const r = {}; for (const k in o) r[k] = Array.isArray(o[k]) ? o[k].map(flipped) : flipped(o[k]); return r; };
  F.left = flipAll({ stand: F.stand, walk: F.walk, crouch: F.crouch });
  F.portrait = F.front;
  return F;
}

const zoe = {
  x: 100, y: 180, dir: 1, mode: 'front', visible: false, F: null, target: null, onArrive: null,
  speed: 58, wt: 0, blinkT: 2, blinking: 0, path: null,
  rebuild() { this.F = zoeFrames(save.look); },
  walkTo(x, y) {
    if (this.onArrive) { const f = this.onArrive; this.onArrive = null; f(); }
    return new Promise((res) => {
      const dx = x - this.x, dy = y - this.y;
      if (Math.hypot(dx, dy) < 1.5) { this.target = null; res(); return; }
      this.target = { x, y }; this.onArrive = res;
      if (this.mode !== 'cheer') this.mode = 'side';
    });
  },
  async walkPath(pts) { for (const [x, y] of pts) await this.walkTo(x, y); },
  face(dir) { if (dir === 'front') this.mode = 'front'; else { this.dir = dir; this.mode = 'side'; } },
  update(dt) {
    this.blinkT -= dt;
    if (this.blinkT < 0) { this.blinking = 0.12; this.blinkT = 2.5 + Math.random() * 3; }
    if (this.blinking > 0) this.blinking -= dt;
    if (!this.target) return;
    const dx = this.target.x - this.x, dy = this.target.y - this.y, d = Math.hypot(dx, dy), step = this.speed * dt;
    if (Math.abs(dx) > 0.5) this.dir = dx > 0 ? 1 : -1;
    if (this.mode === 'front' || this.mode === 'crouch') this.mode = 'side';
    if (d <= step) {
      this.x = this.target.x; this.y = this.target.y; this.target = null; this.wt = 0;
      const f = this.onArrive; this.onArrive = null; if (f) f();
    } else {
      this.x += (dx / d) * step; this.y += (dy / d) * step; this.wt += dt;
      if (Math.floor(this.wt * 8) !== Math.floor((this.wt - dt) * 8) && Math.floor(this.wt * 8) % 2 === 0) AU.sfx('step');
    }
  },
  draw(g) {
    if (!this.visible || !this.F) return;
    const x = Math.round(this.x), y = Math.round(this.y);
    g.globalAlpha = 0.28; D.ell(g, x, y, 6, 1, C.ink2); g.globalAlpha = 1;
    let img, ax = 10;
    const L = this.dir < 0;
    if (this.target) { const fr = Math.floor(this.wt * 8) % 4; img = L ? this.F.left.walk[fr] : this.F.walk[fr]; }
    else if (this.mode === 'cheer') { img = this.F.cheer; }
    else if (this.mode === 'front') { img = this.blinking > 0 ? this.F.blink : this.F.front; }
    else if (this.mode === 'crouch') { img = L ? this.F.left.crouch : this.F.crouch; }
    else { img = L ? this.F.left.stand : this.F.stand; }
    if (L && img !== this.F.front && img !== this.F.blink && img !== this.F.cheer) ax = 13;
    const hop = this.mode === 'cheer' ? Math.round(Math.abs(Math.sin(T * 9)) * -2) : 0;
    g.drawImage(img, x - ax, y - 28 + hop);
  },
  get top() { return this.y - 30; },
};

// ===================== Sparkees =====================
const SPK_CACHE = {};
function genSparkee(r, seed, dim) {
  const rnd = rand(seed * 7919 + r);
  const S = r * 2 + 7, cx = Math.floor(S / 2), cy = Math.floor(S / 2) + 1;
  const m = new Uint8Array(S * S);
  const set = (x, y) => { if (x >= 0 && y >= 0 && x < S && y < S) m[y * S + x] = 1; };
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const dx = x - cx, dy = (y - cy) * 1.08;
    if (dx * dx + dy * dy <= r * r + r * 0.4) set(x, y);
  }
  const tufts = Math.round(r * 2.6);
  for (let i = 0; i < tufts; i++) {
    const a = -Math.PI * (0.05 + rnd() * 0.9) + (rnd() < 0.3 ? Math.PI * (rnd() - 0.5) * 0.6 : 0);
    const len = rnd() < 0.35 ? 2 : 1;
    for (let k = 1; k <= len; k++) set(Math.round(cx + Math.cos(a) * (r + k)), Math.round(cy + Math.sin(a) * (r + k) / 1.08));
  }
  const pal = dim
    ? { hi: '#E9E0BE', base: '#C6B98C', sh: '#9E8C64', line: '#5E5142' }
    : { hi: '#FFF6B8', base: '#FFD84A', sh: '#F0A52C', line: '#7A4410' };
  const [c, g] = mk(S, S);
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    if (!m[y * S + x]) continue;
    const nx = (x - cx) / r, ny = (y - cy) / r;
    const l = -0.55 * nx - 0.75 * ny + (rnd() - 0.5) * 0.25;
    D.p(g, x, y, l > 0.5 ? pal.hi : l < -0.38 ? pal.sh : pal.base);
  }
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    if (m[y * S + x]) continue;
    const n = (xx, yy) => xx >= 0 && yy >= 0 && xx < S && yy < S && m[yy * S + xx];
    if (n(x + 1, y) || n(x - 1, y) || n(x, y + 1) || n(x, y - 1)) D.p(g, x, y, pal.line);
  }
  return { img: c, S, cx, cy };
}
function sparkeeBodies(r, seed) {
  const k = r + ':' + seed;
  if (!SPK_CACHE[k]) SPK_CACHE[k] = { bright: genSparkee(r, seed, false), dim: genSparkee(r, seed, true) };
  return SPK_CACHE[k];
}

class Sparkee {
  constructor(o) {
    Object.assign(this, {
      x: 0, y: 0, r: 5, seed: 1, greg: false, glow: 1, expr: 'norm', mode: 'idle', speed: 34, z: 0, vz: 0,
      look: null, visible: true, arms: 'down', emote: 0, tx: null, ty: null, onArrive: null, hopping: false,
      area: null, acc: null, name: 'sp', tear: 0, sitting: false,
    }, o);
    this.t = Math.random() * 10;
    this.B = sparkeeBodies(this.r, this.seed);
    this.blinkT = 1 + Math.random() * 3; this.blinking = 0; this.pauseT = Math.random() * 1.5;
  }
  goto(x, y, speed) {
    if (this.onArrive) { const f = this.onArrive; this.onArrive = null; f(); }
    if (speed) this.speed = speed;
    this.mode = 'goto';
    return new Promise((res) => { this.tx = x; this.ty = y; this.onArrive = res; });
  }
  async path(pts, speed) { for (const [x, y] of pts) await this.goto(x, y, speed); }
  jump(v = 95) { if (this.z <= 0) this.vz = v; }
  hop(on) { this.hopping = on; if (on) this.jump(70 + Math.random() * 40); }
  update(dt) {
    this.t += dt;
    this.blinkT -= dt;
    if (this.blinkT < 0) { this.blinking = 0.12; this.blinkT = 1.5 + Math.random() * 3.5; }
    if (this.blinking > 0) this.blinking -= dt;
    if (this.emote > 0) this.emote -= dt;
    if (this.tear > 0) this.tear -= dt;
    if (this.z > 0 || this.vz !== 0) {
      this.vz -= 430 * dt; this.z += this.vz * dt;
      if (this.z <= 0) { this.z = 0; this.vz = 0; if (this.hopping) this.vz = 70 + Math.random() * 45; }
    }
    if (this.mode === 'wander' && this.tx === null) {
      if (this.pauseT > 0) this.pauseT -= dt;
      else if (this.area) {
        const a = this.area;
        this.tx = a[0] + Math.random() * (a[2] - a[0]); this.ty = a[1] + Math.random() * (a[3] - a[1]);
      }
    }
    if (this.tx !== null) {
      const dx = this.tx - this.x, dy = this.ty - this.y, d = Math.hypot(dx, dy), step = this.speed * dt;
      if (d <= step) {
        this.x = this.tx; this.y = this.ty; this.tx = this.ty = null;
        if (this.mode === 'wander') this.pauseT = 0.3 + Math.random() * 1.6;
        const f = this.onArrive; this.onArrive = null; if (f) f();
      } else { this.x += (dx / d) * step; this.y += (dy / d) * step; }
    }
  }
  get moving() { return this.tx !== null; }
  get top() { return this.y - this.r * 2 - 4 - this.z; }
  draw(g) {
    if (!this.visible) return;
    const B = this.B.bright, S = B.S;
    const x = Math.round(this.x), y = Math.round(this.y);
    let bob = this.moving ? -Math.abs(Math.sin(this.t * 14)) * 1.6 : Math.sin(this.t * 2.2 + this.seed) * 0.7;
    if (Dlg.talker === this && Dlg.typing) bob -= Math.abs(Math.sin(this.t * 16)) * 1.4;
    const top = Math.round(y - 2 - (B.cy + this.r) - this.z + bob);
    const left = x - B.cx;
    g.globalAlpha = 0.25; D.ell(g, x, y - 1, Math.max(2, this.r - 1 - Math.round(this.z / 6)), 1, C.ink2); g.globalAlpha = 1;
    if (this.glow > 0.04) D.glow(g, x, top + B.cy, this.r + 7, '#FFC93A', 0.3 * this.glow, 3);
    g.drawImage(this.B.dim.img, left, top);
    if (this.glow > 0) { g.globalAlpha = clamp(this.glow, 0, 1); g.drawImage(B.img, left, top); g.globalAlpha = 1; }
    // feet
    const fy = top + B.cy + this.r + 1;
    const fo = this.moving ? Math.round(Math.sin(this.t * 14)) : 0;
    const fc = this.glow > 0.5 ? '#B5641E' : '#7A6A52';
    if (!this.sitting) { D.r(g, x - 3, fy + (fo > 0 ? -1 : 0), 2, 1, fc); D.r(g, x + 1, fy + (fo < 0 ? -1 : 0), 2, 1, fc); }
    // arms
    const ac = this.glow > 0.5 ? '#E89A2A' : '#9E8C64';
    const ay = top + B.cy + 1;
    if (this.arms === 'up') {
      D.p(g, left + B.cx - this.r - 1, ay - 2, ac); D.p(g, left + B.cx - this.r - 2, ay - 3, ac);
      D.p(g, left + B.cx + this.r + 1, ay - 2, ac); D.p(g, left + B.cx + this.r + 2, ay - 3, ac);
    } else {
      D.p(g, left + B.cx - this.r - 1, ay + 1, ac); D.p(g, left + B.cx + this.r + 1, ay + 1, ac);
    }
    this.drawFace(g, left + B.cx, top + B.cy);
    if (this.acc === 'headphones') {
      const hx = left + B.cx, hy = top + B.cy;
      D.line(g, hx - this.r, hy - 1, hx - this.r + 2, hy - this.r - 1, C.ink);
      D.line(g, hx - this.r + 2, hy - this.r - 1, hx + this.r - 2, hy - this.r - 1, C.ink);
      D.line(g, hx + this.r - 2, hy - this.r - 1, hx + this.r, hy - 1, C.ink);
      D.r(g, hx - this.r - 1, hy - 1, 2, 4, '#E8628A'); D.r(g, hx + this.r, hy - 1, 2, 4, '#E8628A');
    }
    if (this.emote > 0) {
      const ex = x - 2, ey = top - 10;
      D.r(g, ex - 1, ey - 1, 7, 10, C.ink); D.r(g, ex, ey, 5, 8, C.white);
      D.r(g, ex + 2, ey + 1, 1, 4, '#D8323C'); D.r(g, ex + 2, ey + 6, 1, 1, '#D8323C');
    }
  }
  drawFace(g, cx, cy) {
    const ink = this.glow > 0.5 ? '#3A2210' : '#4A4038';
    const mouthC = this.glow > 0.5 ? '#9A3A14' : '#5E5142';
    let lx = 0;
    if (this.look) { const dx = this.look.x - this.x; lx = Math.abs(dx) > 6 ? Math.sign(dx) : 0; }
    const greg = this.greg;
    const k = greg ? 3 : 2;
    const ey = cy - 1;
    const eyes = greg ? [cx - k - 1 + lx, cx + k - 1 + lx] : [cx - k + lx, cx + k + lx];
    const ew = greg ? 2 : 1;
    let e = this.expr;
    if (this.blinking > 0 && (e === 'norm' || e === 'sad')) e = e === 'sad' ? 'sadblink' : 'blink';
    for (const ex of eyes) {
      if (e === 'blink' || e === 'sadblink') D.r(g, ex, ey + 1, ew, 1, ink);
      else if (e === 'wide') { D.r(g, ex, ey - 1, ew + 1, greg ? 3 : 2, ink); D.p(g, ex, ey - 1, C.white); }
      else if (e === 'happy' || e === 'laugh') { D.p(g, ex - 1 + (greg ? 0 : 0), ey + 1, ink); D.r(g, ex, ey, ew, 1, ink); D.p(g, ex + ew, ey + 1, ink); }
      else if (e === 'cozy') { D.p(g, ex - 1, ey, ink); D.r(g, ex, ey + 1, ew, 1, ink); D.p(g, ex + ew, ey, ink); }
      else if (e === 'star') { D.twinkle(g, ex, ey, 1, '#FFFFFF'); D.p(g, ex, ey, '#E8A020'); }
      else { D.r(g, ex, ey, ew, 2, ink); if (greg) D.p(g, ex + 1, ey, '#FFF6D8'); }
    }
    if (e === 'sad' || e === 'sadblink') {
      D.p(g, eyes[0] - 1, ey - 2, ink); D.p(g, eyes[1] + ew, ey - 2, ink);
    }
    if ((e === 'happy' || e === 'laugh' || e === 'cozy' || e === 'star') && !greg) { D.p(g, cx - k - 2, cy + 1, '#FF9070'); D.p(g, cx + k + 2, cy + 1, '#FF9070'); }
    if (greg) {
      const mc = this.glow > 0.5 ? '#6E3B1A' : '#4E4236', mh = this.glow > 0.5 ? '#946030' : '#6A5E50';
      // mouth below mustache
      const my = cy + 3;
      if (e === 'laugh' || e === 'wide') { D.r(g, cx - 1, my, 2, 2, mouthC); }
      else if (e === 'sad' || e === 'sadblink') { D.r(g, cx - 1, my + 1, 2, 1, mouthC); }
      else D.r(g, cx - 1, my, 2, 1, mouthC);
      D.r(g, cx - 4, cy + 1, 3, 2, mc); D.r(g, cx, cy + 1, 3, 2, mc); D.r(g, cx - 1, cy + 1, 1, 1, mc);
      D.p(g, cx - 5, cy + 1, mc); D.p(g, cx - 6, cy, mc); D.p(g, cx + 3, cy + 1, mc); D.p(g, cx + 4, cy, mc);
      D.p(g, cx - 3, cy + 1, mh); D.p(g, cx + 1, cy + 1, mh);
    } else {
      const my = cy + 2;
      if (e === 'laugh') { D.r(g, cx - 1, my, 3, 2, mouthC); D.p(g, cx, my + 1, '#E86A6A'); }
      else if (e === 'wide') D.r(g, cx, my, 1, 2, mouthC);
      else if (e === 'happy' || e === 'star') { D.p(g, cx - 1, my, mouthC); D.p(g, cx, my + 1, mouthC); D.p(g, cx + 1, my, mouthC); }
      else if (e === 'sad' || e === 'sadblink') { D.p(g, cx - 1, my + 1, mouthC); D.p(g, cx, my, mouthC); D.p(g, cx + 1, my + 1, mouthC); }
      else D.r(g, cx, my, 1, 1, mouthC);
    }
    if (this.tear > 0) { const ty = ey + 2 + Math.floor((1.2 - this.tear) * 6) % 6; D.p(g, eyes[0], ty, '#8FD0F0'); }
  }
}

// ===================== Particles =====================
const GLYPHS = [
  ['010', '101', '111', '101'], ['110', '111', '101', '111'], ['011', '100', '100', '011'], ['111', '010', '010', '010'],
  ['101', '111', '101', '101'], ['010', '101', '101', '010'], ['111', '110', '100', '111'], ['101', '101', '101', '010'],
];
function emit(o) { PT.push(Object.assign({ x: 0, y: 0, vx: 0, vy: 0, ax: 0, ay: 0, life: 1, age: 0, kind: 'spark', c: C.goldL, s: 1, ph: Math.random() * 6 }, o)); }
function burst(x, y, n, o = {}) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, sp = (o.speed || 40) * (0.4 + Math.random() * 0.8);
    emit(Object.assign({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - (o.up || 0), ay: o.ay ?? 30, life: (o.life || 0.8) * (0.6 + Math.random() * 0.6), kind: 'spark', c: o.c || C.goldL }, o.extra || {}));
  }
}
function updateParticles(dt) {
  for (let i = PT.length - 1; i >= 0; i--) {
    const p = PT[i];
    p.age += dt;
    if (p.age >= p.life) { PT.splice(i, 1); if (p.onEnd) p.onEnd(p); continue; }
    if (p.kind === 'glyph') {
      const t = ease(p.age / p.life), u = 1 - t;
      p.x = u * u * p.p0[0] + 2 * u * t * p.p1[0] + t * t * p.p2[0];
      p.y = u * u * p.p0[1] + 2 * u * t * p.p1[1] + t * t * p.p2[1];
      continue;
    }
    p.vx += p.ax * dt; p.vy += p.ay * dt; p.x += p.vx * dt; p.y += p.vy * dt;
    if (p.kind === 'leaf') p.x += Math.sin(p.age * 2 + p.ph) * 12 * dt;
    if (p.kind === 'mote' || p.kind === 'firefly') { p.x += Math.sin(p.age * 0.9 + p.ph) * 4 * dt; p.y += Math.cos(p.age * 0.7 + p.ph) * 3 * dt; }
  }
}
function drawParticles(g, layer) {
  for (const p of PT) {
    if ((p.layer || 'mid') !== layer) continue;
    const k = 1 - p.age / p.life;
    const x = Math.round(p.x), y = Math.round(p.y);
    if (p.kind === 'spark') { g.globalAlpha = Math.min(1, k * 1.5); D.p(g, x, y, p.c); if (p.s > 1) D.twinkle(g, x, y, 1, p.c); g.globalAlpha = 1; }
    else if (p.kind === 'star') { g.globalAlpha = Math.min(1, k * 1.5); D.twinkle(g, x, y, k > 0.5 ? 2 : 1, p.c); g.globalAlpha = 1; }
    else if (p.kind === 'mote') { const a = (Math.sin(p.age * 2 + p.ph) * 0.5 + 0.5) * Math.min(1, k * 3, p.age * 2); g.globalAlpha = a * (p.a || 0.8); D.p(g, x, y, p.c); g.globalAlpha = 1; }
    else if (p.kind === 'firefly') { const a = Math.max(0, Math.sin(p.age * 2.5 + p.ph)) * Math.min(1, k * 3, p.age * 2); if (a > 0.05) { D.glow(g, x, y, 4, p.c, 0.35 * a, 2); g.globalAlpha = a; D.p(g, x, y, '#FFFBD0'); g.globalAlpha = 1; } }
    else if (p.kind === 'leaf') { g.globalAlpha = Math.min(1, k * 4); const f = Math.floor(p.age * 4 + p.ph) % 2; D.r(g, x, y, f ? 2 : 1, f ? 1 : 2, p.c); g.globalAlpha = 1; }
    else if (p.kind === 'smoke') { g.globalAlpha = k * 0.35; D.disc(g, x, y, Math.round(1 + (1 - k) * 3), p.c); g.globalAlpha = 1; }
    else if (p.kind === 'note') { g.globalAlpha = Math.min(1, k * 2); D.r(g, x, y - 3, 1, 4, p.c); D.r(g, x - 2, y, 2, 2, p.c); D.p(g, x + 1, y - 3, p.c); g.globalAlpha = 1; }
    else if (p.kind === 'glyph') {
      D.glow(g, x + 1, y + 2, 5, '#FFC93A', 0.35, 2);
      const gl = GLYPHS[p.gi];
      for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) if (gl[r][c] === '1') D.p(g, x + c, y + r, '#FFF6C8');
    }
  }
}

// ===================== Dialog =====================
const SPEAKERS = {
  n: { name: '', v: 'n' }, greg: { name: 'Greg', v: 'greg' }, sp: { name: 'A Sparkee', v: 'sp' },
  sp2: { name: 'Another Sparkee', v: 'sp' }, sp3: { name: 'A small Sparkee', v: 'sp' }, all: { name: 'The Sparkees', v: 'all' },
};
const Dlg = {
  active: false, typing: false, talker: null, res: null, full: '', shown: 0, acc: 0, opts: null, hold: 0,
  el: $('#dlg'), nm: $('#dlgName'), tx: $('#dlgText'), op: $('#dlgOpts'), more: $('#dlgMore'),
  open(who, text, o, res) {
    text = text.replace(/\{name\}/g, callName());
    const sp = SPEAKERS[who] || { name: who, v: 'sp' };
    this.full = text; this.shown = 0; this.acc = 0; this.typing = true; this.res = res; this.opts = o.options || null;
    this.who = who; this.narr = who === 'n';
    this.el.classList.toggle('narr', this.narr);
    this.el.classList.toggle('bottom', o.pos === 'bottom' || (o.pos !== 'top' && scene && scene.dlgPos === 'bottom'));
    this.nm.textContent = sp.name; this.nm.hidden = !sp.name;
    this.op.innerHTML = ''; this.op.hidden = true; this.more.hidden = true;
    this.el.hidden = false; this.active = true;
    this.talker = o.actor || (who === 'greg' ? scene && scene.greg : null) || null;
    this.render();
    Voice.say(text, sp.v);
  },
  render() {
    const a = this.full.slice(0, this.shown), b = this.full.slice(this.shown);
    this.tx.innerHTML = '';
    if (this.narr) { const bul = document.createElement('span'); bul.className = 'bul'; bul.textContent = '•'; this.tx.appendChild(bul); }
    const s1 = document.createElement('span'); s1.textContent = a;
    const s2 = document.createElement('span'); s2.className = 'ghost'; s2.textContent = b;
    this.tx.append(s1, s2);
  },
  update(dt) {
    if (!this.active || !this.typing) return;
    if (this.hold > 0) { this.hold -= dt; return; }
    this.acc += dt * 38;
    let changed = false;
    while (this.acc >= 1 && this.shown < this.full.length) {
      this.acc -= 1; this.shown++; changed = true;
      const ch = this.full[this.shown - 1];
      if (!Voice.on && this.shown % 2 === 0 && /\S/.test(ch)) AU.sfx('blip', this.who === 'greg' ? 330 : this.who === 'n' ? 440 : 760);
      if ('.!?'.includes(ch) && this.full[this.shown] === ' ') { this.hold = 0.18; break; }
    }
    if (changed) this.render();
    if (this.shown >= this.full.length) this.finish();
  },
  finish() {
    this.shown = this.full.length; this.typing = false; this.render();
    if (this.opts) {
      this.op.hidden = false; this.op.innerHTML = '';
      this.opts.forEach((t, i) => {
        const b = document.createElement('button');
        b.className = 'opt'; b.type = 'button'; b.textContent = t;
        b.addEventListener('click', (e) => { e.stopPropagation(); AU.sfx('tap'); this.close(i); });
        this.op.appendChild(b);
      });
    } else this.more.hidden = false;
  },
  tap() {
    if (this.typing) { this.finish(); return; }
    if (this.opts) return;
    AU.sfx('tap');
    this.close();
  },
  close(v) {
    this.active = false; this.typing = false; this.el.hidden = true; this.talker = null; Voice.stop();
    const r = this.res; this.res = null; if (r) r(v);
  },
};
$('#dlg').addEventListener('pointerdown', (e) => { e.stopPropagation(); if (!e.target.closest('.opt')) Dlg.tap(); });
function say(who, text, o = {}) { return new Promise((res) => Dlg.open(who, text, o, res)); }
function ask(who, text, options, o = {}) { return new Promise((res) => Dlg.open(who, text, Object.assign({}, o, { options }), res)); }
async function narrate(...lines) { for (const l of lines) await say('n', l); }

// ===================== Bubbles =====================
const BUBS = [];
function bubble(actor, text, ms = 1600, speak = false) {
  const el = document.createElement('div');
  el.className = 'bub'; el.textContent = text;
  $('#bubs').appendChild(el);
  BUBS.push({ actor, el, until: T + ms / 1000 });
  if (speak) Voice.say(text, 'sp');
  updateBubbles();
}
function updateBubbles() {
  for (let i = BUBS.length - 1; i >= 0; i--) {
    const b = BUBS[i];
    if (T > b.until || !scene) { b.el.remove(); BUBS.splice(i, 1); continue; }
    const x = b.actor.x - cam.x, y = b.actor.top - cam.y - 2;
    b.el.style.left = x * SCALE + 'px';
    b.el.style.top = y * SCALE + 'px';
  }
}
function clearBubbles() { for (const b of BUBS) b.el.remove(); BUBS.length = 0; }

// ===================== Modal =====================
const Modal = {
  open: false, el: $('#modal'), res: null,
  show(node, cls = '') {
    this.el.innerHTML = ''; this.el.className = 'modal ' + cls; this.el.appendChild(node); this.el.hidden = false; this.open = true;
    return new Promise((res) => { this.res = res; });
  },
  close(v) { this.el.hidden = true; this.el.innerHTML = ''; this.open = false; const r = this.res; this.res = null; if (r) r(v); },
};
function h(tag, attrs = {}, ...kids) {
  const e = document.createElement(tag);
  for (const k in attrs) {
    if (k === 'class') e.className = attrs[k];
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), attrs[k]);
    else e.setAttribute(k, attrs[k]);
  }
  for (const k of kids.flat()) if (k != null) e.append(k.nodeType ? k : document.createTextNode(k));
  return e;
}
// a canvas element that displays a pixel image scaled up crisply
function pixImg(src, scale, cls = '') {
  const c = document.createElement('canvas');
  c.width = src.width; c.height = src.height;
  const g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(src, 0, 0);
  c.className = 'pix ' + cls;
  c.style.width = `calc(var(--u) * ${src.width * scale})`;
  c.style.height = `calc(var(--u) * ${src.height * scale})`;
  return c;
}

// ===================== Transitions =====================
function tween(ms, fn) {
  return new Promise((res) => {
    const t0 = performance.now();
    const step = (now) => { const k = clamp((now - t0) / ms, 0, 1); fn(k); if (k < 1) requestAnimationFrame(step); else res(); };
    requestAnimationFrame(step);
  });
}
async function fadeOut(ms = 500, color = C.ink2) { FX.fadeColor = color; await tween(ms, (k) => { FX.fade = k; }); }
async function fadeIn(ms = 500) { const a = FX.fade; await tween(ms, (k) => { FX.fade = a * (1 - k); }); FX.fade = 0; }
async function irisOut(cx, cy, ms = 700) { FX.iris = { cx, cy, r: 340 }; await tween(ms, (k) => { FX.iris.r = 340 * (1 - ease(k)); }); }
async function irisIn(cx, cy, ms = 700) { FX.iris = { cx, cy, r: 0 }; await tween(ms, (k) => { FX.iris.r = 340 * ease(k); }); FX.iris = null; }
function drawIris(g) {
  const { cx, cy, r } = FX.iris;
  g.fillStyle = C.ink2;
  for (let y = 0; y < H; y++) {
    const dy = y - cy;
    if (Math.abs(dy) >= r) { g.fillRect(0, y, W, 1); continue; }
    const dx = Math.round(Math.sqrt(r * r - dy * dy));
    g.fillRect(0, y, Math.max(0, Math.round(cx - dx)), 1);
    g.fillRect(Math.round(cx + dx), y, W, 1);
  }
}

// ===================== Hints & hotspots =====================
function drawHints(g) {
  if (isBusy() || Dlg.active || Modal.open) return;
  for (const hn of hints) {
    if (hn.when && !hn.when()) continue;
    const per = hn.strong ? 1.8 : 3.2;
    const ph = ((T + (hn.off || 0)) % per) / per;
    if (ph > 0.35) continue;
    const k = ph / 0.35, s = Math.round(Math.sin(k * Math.PI) * 3);
    const x = hn.x - cam.x, y = hn.y - cam.y;
    D.glow(g, x, y, 6, '#FFE38A', 0.4 * Math.sin(k * Math.PI), 2);
    if (s > 0) D.twinkle(g, x, y, s, '#FFFBE0');
  }
}
function hitTest(x, y) {
  const hs = scene.hotspots || [];
  for (let i = hs.length - 1; i >= 0; i--) {
    const s = hs[i];
    if (s.when && !s.when()) continue;
    if (s.hit) { if (s.hit(x, y)) return s; continue; }
    const [rx, ry, rw, rh] = typeof s.rect === 'function' ? s.rect() : s.rect;
    if (x >= rx && x < rx + rw && y >= ry && y < ry + rh) return s;
  }
  return null;
}
async function runHotspot(hs) {
  busy = true;
  try {
    if (hs.stand && zoe.visible) {
      const st = typeof hs.stand === 'function' ? hs.stand() : hs.stand;
      await zoe.walkTo(st[0], st[1]);
      if (hs.face) zoe.face(hs.face);
      else {
        const [rx, , rw] = typeof hs.rect === 'function' ? hs.rect() : hs.rect || [zoe.x, 0, 0];
        const cxh = rx + rw / 2;
        if (Math.abs(cxh - zoe.x) > 4) zoe.face(cxh > zoe.x ? 1 : -1); else zoe.face('front');
      }
    }
    await hs.act();
  } catch (e) { console.error(e); }
  busy = false;
}
const ZOE_LINES = { n: 0 };
function zoeHit(x, y) {
  if (!zoe.visible || !scene.walk) return null;
  if (Math.abs(x - zoe.x) > 7 || y > zoe.y + 1 || y < zoe.y - 28) return null;
  return { act: async () => { zoe.face('front'); await say('n', cycle(["That's you!", "You're doing great.", 'Still you. Still great.', 'You poked yourself. Ow.', '(The game can see you poking. It is not mad. Just surprised.)'], 'n', ZOE_LINES)); } };
}
// cutscene wrapper
async function cut(fn) { cutN++; try { await fn(); } catch (e) { console.error(e); } finally { cutN--; } }

// ===================== Input =====================
function stageToWorld(e) {
  const r = cvs.getBoundingClientRect();
  return [((e.clientX - r.left) / r.width) * W + cam.x, ((e.clientY - r.top) / r.height) * H + cam.y];
}
stage.addEventListener('pointerdown', (e) => {
  if (e.target.closest('.ui')) return;
  AU.init();
  if (Modal.open) return;
  if (Dlg.active) { Dlg.tap(); return; }
  if (!scene || !scene.interactive) return;
  const [x, y] = stageToWorld(e);
  burst(x, y, 4, { speed: 16, life: 0.35, c: '#FFF6C8', ay: 0 });
  if (isBusy()) return;
  const hs = hitTest(x, y) || zoeHit(x, y);
  if (hs) { AU.sfx('tap'); runHotspot(hs); return; }
  if (scene.onTapEmpty && scene.onTapEmpty(x, y)) return;
  if (zoe.visible && scene.walk) {
    const w = scene.walk;
    zoe.walkTo(clamp(x, w[0], w[2]), clamp(y, w[1], w[3])).then(() => scene.onWalkEnd && scene.onWalkEnd());
  }
});

// ===================== Scenes =====================
const SCENES = {};
async function goScene(id, opts = {}) {
  clearBubbles();
  hints = [];
  PT.length = 0;
  cam.x = 0; cam.y = 0;
  FX.zoom = null;
  const s = SCENES[id];
  scene = s;
  s.interactive = false;
  s.enter(opts);
  if (s.song) AU.setSong(s.song);
  updateHud();
  s.interactive = true;
  if (s.start) s.start(opts);
}

// ===================== Loop =====================
let lastT = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - lastT) / 1000);
  lastT = now; T += dt;
  if (scene) {
    zoe.update(dt);
    for (const a of scene.actors || []) if (a !== zoe) a.update(dt);
    if (scene.update) scene.update(dt);
  }
  updateParticles(dt);
  Dlg.update(dt);
  updateBubbles();
  render();
  requestAnimationFrame(frame);
}
function render() {
  const g = ctx;
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.fillStyle = C.ink2; g.fillRect(0, 0, W, H);
  if (!scene) return;
  g.save();
  if (FX.zoom) { const z = FX.zoom; g.translate(z.cx, z.cy); g.scale(z.k, z.k); g.translate(-z.cx, -z.cy); }
  g.translate(-Math.round(cam.x), -Math.round(cam.y));
  scene.drawBg && scene.drawBg(g);
  drawParticles(g, 'back');
  const actors = (scene.actors || []).slice().sort((a, b) => a.y - b.y);
  for (const a of actors) a.draw(g);
  drawParticles(g, 'mid');
  scene.drawFg && scene.drawFg(g);
  drawParticles(g, 'front');
  g.restore();
  drawHints(g);
  if (FX.flash > 0) { g.globalAlpha = FX.flash; g.fillStyle = FX.flashColor; g.fillRect(0, 0, W, H); g.globalAlpha = 1; }
  if (FX.iris) drawIris(g);
  if (FX.fade > 0) { g.globalAlpha = FX.fade; g.fillStyle = FX.fadeColor; g.fillRect(0, 0, W, H); g.globalAlpha = 1; }
}
