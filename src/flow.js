// ===================== Save upgrade & shared quest flow =====================
// Chapter one saved only save.book and save.item. Everything after it lives in these fields.
function migrateSave() {
  if (!Array.isArray(save.books)) save.books = save.book ? [Object.assign({ q: 'animal' }, save.book)] : [];
  if (!save.items) save.items = { library: save.item ? [save.item] : [], studio: [], bath: [] };
  for (const r of ['library', 'studio', 'bath']) if (!Array.isArray(save.items[r])) save.items[r] = [];
  if (!save.active) save.active = { read: null, art: null };
  if (!save.doneQ) save.doneQ = { read: save.book ? ['animal'] : [], art: [] };
  if (!Array.isArray(save.arts)) save.arts = [];
  if (!save.routines) save.routines = {};
  if (typeof save.jar !== 'number') save.jar = 0;
  if (!save.flags) save.flags = {};
  if (!save.counts) save.counts = { read: save.book ? 1 : 0, art: 0, brush: 0, floss: 0 };
  persist();
}
const pad2 = (n) => String(n).padStart(2, '0');
function todayKey(d = new Date()) { return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; }
// brushing counts once in the morning and once at night; 3pm is the line
function slotNow(d = new Date()) { return d.getHours() < 15 ? 'am' : 'pm'; }
function todayRoutines() { return save.routines[todayKey()] || {}; }
function markRoutine(key) {
  const k = todayKey();
  save.routines[k] = Object.assign({}, save.routines[k], { [key]: true });
  // keep about a month of history
  const keys = Object.keys(save.routines).sort();
  while (keys.length > 40) delete save.routines[keys.shift()];
}
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function pickNextQuest(kind) {
  const list = kind === 'read' ? READ_QUESTS : ART_QUESTS, done = save.doneQ[kind];
  const left = list.filter((q) => !done.includes(q.id));
  if (left.length) return kind === 'art' ? left[0] : left[Math.floor(Math.random() * left.length)];
  // everything done once: any quest again, just not the one she did last
  const last = done[done.length - 1];
  const again = list.filter((q) => q.id !== last && q.id !== 'animal');
  return again[Math.floor(Math.random() * again.length)];
}
function artQuest(id) { return ART_QUESTS.find((q) => q.id === id) || ART_QUESTS[0]; }
function questOf(kind, id) { return kind === 'read' ? readQuest(id) : artQuest(id); }
const ROOM_OF = { read: 'library', art: 'studio' };

// ---------------- Presents (shared by every room) ----------------
const WRAPS = [['#DB95B5', '#DCA438'], ['#A1AF7C', '#612C48'], ['#7E93A3', '#FE9B5B']];
const PREVIEW = { lightsK: 1, squash: 0, dj: null };
const Presents = {
  // returns false when the room already has everything
  offer(S, room, spots, opts = {}) {
    let p = save.pending && save.pending.room === room ? save.pending : null;
    if (!p) {
      const pool = opts.items || shuffle(ROOM_POOL(room).filter((k) => !save.items[room].includes(k))).slice(0, 3);
      if (!pool.length) return false;
      p = save.pending = { room, items: pool, golden: !!opts.golden }; persist();
    }
    S.presents = p.items.map((item, i) => ({
      x: spots[i][0], y: spots[i][1], item, lid: 0,
      wrap: p.golden ? '#F2C230' : WRAPS[i % 3][0], ribbon: p.golden ? '#C8323C' : WRAPS[i % 3][1],
    }));
    AU.sfx('poof');
    for (const q of S.presents) burst(q.x, q.y - 6, 10, { speed: 30, c: '#FFF6C8', extra: { layer: 'front' } });
    return true;
  },
  hotspot(S) {
    return {
      hit: (x, y) => !!S.presents && S.presents.some((p) => !p.gone && Math.abs(p.x - x) < 9 && y > p.y - 18 && y < p.y + 2),
      act: async () => {
        const live = S.presents.filter((p) => !p.gone);
        const p = live.sort((a, b) => Math.abs(a.x - S._tapX) - Math.abs(b.x - S._tapX))[0];
        if (p) await Presents.peek(S, p);
      },
    };
  },
  async peek(S, p) {
    if (S.choosing) return;
    S.choosing = true;
    AU.sfx('pop');
    await tween(300, (k) => { p.lid = Math.round(k * 8); });
    S.preview = p.item; p.peeked = true;
    AU.sfx('sparkle');
    const info = ITEMS[p.item].lines, host = S.host || 'greg';
    if (S[host]) S[host].expr = 'happy';
    await say(host, info[0]);
    const c = await ask(host, info[1], ['Keep it!', 'Peek at another one.']);
    if (c === 0) await Presents.place(S, p);
    else { S.preview = null; await tween(250, (k) => { p.lid = Math.round((1 - k) * 8); }); }
    S.choosing = false;
  },
  async place(S, p) {
    const room = save.pending ? save.pending.room : S.room;
    S.preview = null;
    AU.sfx('poof');
    for (const q of S.presents) { q.gone = true; burst(q.x, q.y - 6, 12, { speed: 30, c: '#FFF6C8', extra: { layer: 'front' } }); }
    if (!save.items[room].includes(p.item)) save.items[room].push(p.item);
    if (room === 'library') save.item = save.item || p.item;
    save.pending = null; persist();
    const at = ROOM_ITEMS[room][p.item].at;
    burst(at[0], at[1] - 6, 22, { speed: 34, c: '#FFE38A', extra: { layer: 'front' } });
    S.presents = null;
    if (S.onPlaced) await S.onPlaced(p.item);
  },
  drawBg(S, g) {
    const R = ROOM_ITEMS[S.room];
    for (const k of save.items[S.room]) { const it = R[k]; if (it && !it.fg) it.draw(g, S); }
    if (S.preview && R[S.preview] && !R[S.preview].fg) this.drawPreview(S, g);
    if (S.presents) for (const p of S.presents) if (!p.gone) {
      drawPresent(g, p.x, p.y, p.wrap, p.ribbon, p.lid);
      if (p.peeked && !p.lid) { D.r(g, p.x + 5, p.y - 6, 4, 4, C.parch); D.p(g, p.x + 6, p.y - 5, C.ink); }
    }
  },
  drawFg(S, g) {
    const R = ROOM_ITEMS[S.room];
    for (const k of save.items[S.room]) { const it = R[k]; if (it && it.fg) it.draw(g, S); }
    if (S.preview && R[S.preview] && R[S.preview].fg) this.drawPreview(S, g);
  },
  drawPreview(S, g) {
    const it = ROOM_ITEMS[S.room][S.preview];
    g.globalAlpha = 0.55 + 0.25 * Math.sin(T * 8);
    if (it.preview) it.preview(g, S); else it.draw(g, PREVIEW);
    g.globalAlpha = 1;
  },
  // a Sparkee goes to admire something new
  async admire(S, item, lines) {
    const at = ROOM_ITEMS[S.room][item].at;
    const s = (S.sps || []).filter((x) => x.visible).sort((a, b) => Math.hypot(a.x - at[0], a.y - at[1]) - Math.hypot(b.x - at[0], b.y - at[1]))[0];
    if (s) {
      s.sitting = false; s.mode = 'goto';
      await s.goto(clamp(at[0] + (at[0] > 144 ? -16 : 16), 30, 258), clamp(at[1] + 24, 172, 194), 60);
      s.look = { x: at[0], y: at[1] }; s.expr = 'star'; s.jump(80);
      bubble(s, lines[Math.floor(Math.random() * lines.length)], 1800, true);
      await sleep(1700);
      s.look = zoe; s.expr = 'happy';
    } else await sleep(600);
  },
};

// paint, story glyphs, and other streams of magic from Zoe to a target
function streamMagic(from, to, n, opts = {}) {
  const [sx, sy] = from;
  for (let i = 0; i < n; i++) {
    setTimeout(() => {
      const p0 = [sx + (Math.random() - 0.5) * 10, sy + (Math.random() - 0.5) * 8];
      const p1 = [lerp(sx, to[0], 0.5) + (Math.random() - 0.5) * 50, Math.min(sy, to[1]) - 30 - Math.random() * 30];
      const p = { kind: 'glyph', gi: Math.floor(Math.random() * GLYPHS.length), p0, p1, p2: [to[0] + (Math.random() - 0.5) * 16, to[1] + (Math.random() - 0.5) * 8], life: 1.2 + Math.random() * 0.5, layer: 'front' };
      if (opts.colors) p.blob = opts.colors[i % opts.colors.length];
      emit(p);
      if (i % 6 === 0) AU.sfx('blip', 900 + Math.random() * 600);
    }, i * (opts.gap || 45));
  }
  return sleep(n * (opts.gap || 45) + 1500);
}
// reveal a "living" room from a drab one: a circle grows out from (cx, cy)
function drawReveal(g, drabC, aliveC, cx, cy, r) {
  if (r >= 340) { g.drawImage(aliveC, 0, 0); return; }
  g.drawImage(drabC, 0, 0);
  if (r <= 0) return;
  for (let y = 0; y < H; y++) {
    const dy = y - cy; if (Math.abs(dy) >= r) continue;
    const dx = Math.round(Math.sqrt(r * r - dy * dy));
    const x0 = Math.max(0, cx - dx), x1 = Math.min(W, cx + dx);
    if (x1 > x0) g.drawImage(aliveC, x0, y, x1 - x0, 1, x0, y, x1 - x0, 1);
  }
  for (let i = 0; i < 3; i++) { const a = Math.random() * Math.PI * 2; emit({ kind: 'spark', x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, vy: -10, life: 0.6, c: '#FFF6B8', layer: 'front' }); }
}
async function wakeRoom(S, cx, cy, actors) {
  AU.sfx('fwoomp');
  FX.flashColor = '#FFE9A8';
  tween(700, (k) => { FX.flash = 0.7 * (1 - k); });
  burst(cx, cy, 40, { speed: 70, c: '#FFD84A', up: 30, life: 1.2, extra: { layer: 'front' } });
  await sleep(250);
  AU.setSong('warm');
  await tween(2600, (k) => {
    S.reveal = ease(k) * 340;
    for (const s of actors) {
      const d = Math.hypot(s.x - cx, s.y - cy);
      if (d < S.reveal && s.glow < 1) { s.glow = 1; s.expr = 'happy'; s.sitting = false; s.jump(90); burst(s.x, s.y - 8, 6, { speed: 20, c: '#FFF6B8', extra: { layer: 'front' } }); AU.sfx('pop'); }
    }
  });
  S.reveal = 999;
}
