// ===================== Save upgrade & shared quest flow =====================
// Chapter one saved only save.book and save.item. Everything after it lives in these fields.
function migrateSave() {
  if (!Array.isArray(save.books)) save.books = save.book ? [Object.assign({ q: 'animal' }, save.book)] : [];
  if (!save.items) save.items = { library: save.item ? [save.item] : [], studio: [], bath: [] };
  for (const r of ['library', 'studio', 'bath', 'kitchen', 'tower']) if (!Array.isArray(save.items[r])) save.items[r] = [];
  if (!save.active) save.active = {};
  if (!save.doneQ) save.doneQ = { read: save.book ? ['animal'] : [] };
  for (const k of ['read', 'art', 'food']) { if (!(k in save.active)) save.active[k] = null; if (!Array.isArray(save.doneQ[k])) save.doneQ[k] = []; }
  // quests that were renamed since
  if (save.active.art === 'kitchen') save.active.art = 'door';
  if (save.active.art && !ART_QUESTS.some((q) => q.id === save.active.art)) save.active.art = null;
  if (!Array.isArray(save.arts)) save.arts = [];
  if (!save.routines) save.routines = {};
  if (typeof save.jar !== 'number') save.jar = 0;
  if (!save.flags) save.flags = {};
  if (!save.counts) save.counts = { read: save.book ? 1 : 0, art: 0, brush: 0, floss: 0 };
  if (!save.lib) save.lib = { level: 1, build: 0 };
  if (save.daily && !save.daily.food) { save.daily.food = []; save.daily.done.food = []; }
  if (save.pending && !save.pending.at) { save.pending.at = save.pending.room; save.pending.keep = 1; }
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

// ---------------- Quest kinds ----------------
const QUEST_LISTS = { read: () => READ_QUESTS, art: () => ART_QUESTS, food: () => FOOD_QUESTS };
const ROOM_OF = { read: 'library', art: 'studio', food: 'kitchen' };
const WHERE_OF = { read: 'bookshelf', art: 'easel', food: 'stove' };
const HOST_OF = { library: 'greg', studio: 'dot', kitchen: 'noodle', bath: 'bubbles', tower: 'pip' };
function artQuest(id) { return ART_QUESTS.find((q) => q.id === id) || ART_QUESTS[0]; }
function foodQuest(id) { return FOOD_QUESTS.find((q) => q.id === id) || FOOD_QUESTS[0]; }
function questOf(kind, id) { return kind === 'read' ? readQuest(id) : kind === 'art' ? artQuest(id) : foodQuest(id); }

// ---------------- Today's three quests per room ----------------
// Each room offers three quests a day. Finish one, or all three; then that room rests until tomorrow.
const DAILY_N = 3;
function makeDailySet(kind) {
  const list = QUEST_LISTS[kind](), done = save.doneQ[kind] || [], set = [];
  if (save.active && save.active[kind]) set.push(save.active[kind]);
  const last = done[done.length - 1];
  const fresh = (q) => !done.includes(q.id) && !set.includes(q.id);
  const again = (q) => !set.includes(q.id) && q.id !== 'animal' && q.id !== last;
  const add = (cands) => { for (const q of cands) { if (set.length >= DAILY_N) break; if (!set.includes(q.id)) set.push(q.id); } };
  if (kind === 'art') {
    // at most one big project a day; the rest are quick doodles. New quests first.
    const hasProject = () => set.some((id) => artQuest(id).size === 'project');
    const pool = (size) => list.filter((q) => q.size === size);
    if (!hasProject()) add([...pool('project').filter(fresh), ...shuffle(pool('project').filter(again))].slice(0, 1));
    add([...shuffle(pool('doodle').filter(fresh)), ...shuffle(pool('doodle').filter(again))]);
    // the family tree comes first for a brand-new studio
    if (!done.includes('family') && !set.includes('family')) set[0] = 'family';
    return set;
  }
  add(shuffle(list.filter(fresh)));
  add(shuffle(list.filter(again)));
  return set;
}
function daily() {
  const k = todayKey();
  if (!save.daily || save.daily.date !== k) { save.daily = { date: k, read: makeDailySet('read'), art: makeDailySet('art'), food: makeDailySet('food'), done: { read: [], art: [], food: [] } }; persist(); }
  return save.daily;
}
function dayOpen(kind) { const d = daily(); return d[kind].filter((id) => !d.done[kind].includes(id)); }
function dayDone(kind) { return dayOpen(kind).length === 0; }
function markDayDone(kind, id) { const d = daily(); if (d[kind].includes(id) && !d.done[kind].includes(id)) d.done[kind].push(id); }
// what the room's helper says after a quest: how many are left today
function leftLines(kind) {
  const n = dayOpen(kind).length, where = WHERE_OF[kind];
  if (!n) return ['That is all three quests for today!', `The ${where} is taking a nap now. Three new quests tomorrow.`];
  return [`${n === 1 ? 'One more quest' : 'Two more quests'} on the ${where} today, if you want ${n === 1 ? 'it' : 'them'}.`];
}
// a quest was just accepted: remember it so the "quest in progress" card can come back
function startQuest(kind, id) { save.active[kind] = id; save.lastStarted = kind; persist(); updateHud(true); }

// ---------------- Rooms, levels and keys ----------------
// The library: level 1 holds 9 presents; the last present is the kitchen key.
// Then three building quests add the Reading Tower (level 2), which holds 8 more.
function roomFull(room) { return ROOM_POOL(room).every((k) => save.items[room].includes(k)); }
function presentRoom(kind) { return kind === 'read' ? (save.lib.level >= 2 ? 'tower' : 'library') : ROOM_OF[kind]; }
const ROOMS = {
  hall: { name: 'Home', open: () => true },
  forest: { name: 'The Forest', open: () => true },
  library: { name: 'The Library', open: () => true },
  tower: { name: 'The Reading Tower', open: () => save.lib.level >= 2 },
  studio: { name: 'The Art Studio', open: () => !!save.flags.hatch },
  bath: { name: 'The Bathroom', open: () => !!save.flags.hatch },
  kitchen: { name: 'The Kitchen', open: () => !!save.flags.kitchenKey },
};
function roomProgress(room) {
  const pool = ROOM_POOL(room);
  return { have: pool.filter((k) => save.items[room].includes(k)).length, total: pool.length };
}
// how to get into a room that is still locked
function unlockHint(room) {
  if (room === 'kitchen') { const p = roomProgress('library'); return p.have >= p.total ? 'The next library present is the key!' : `The last library present is the key. ${p.total - p.have} to go!`; }
  if (room === 'tower') { if (!save.flags.kitchenKey) return 'Fill the library with presents first.'; return `The Sparkees are building it! ${save.lib.build} of 3 building quests done.`; }
  if (room === 'studio' || room === 'bath') return 'Finish the first library quest.';
  return '';
}

// ---------------- Presents (shared by every room) ----------------
const WRAPS = [['#DB95B5', '#DCA438'], ['#A1AF7C', '#612C48'], ['#7E93A3', '#FE9B5B']];
const PREVIEW = { lightsK: 1, squash: 0, dj: null };
const Presents = {
  // put presents on the floor; returns false when the room already has everything
  // opts: items (fixed list), golden (gold wrapping), keep (how many to choose, default 1), room (where they go)
  offer(S, room, spots, opts = {}) {
    let p = save.pending && save.pending.at === S.room ? save.pending : null;
    if (!p) {
      const pool = opts.items || shuffle(ROOM_POOL(room).filter((k) => !save.items[room].includes(k))).slice(0, 3);
      if (!pool.length) return false;
      p = save.pending = { room, at: S.room, items: pool, golden: !!opts.golden, keep: Math.min(opts.keep || 1, pool.length) }; persist();
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
      hit: (x, y) => !!S.presents && S.presents.some((p) => !p.gone && Math.abs(p.x - x) < 10 && y > p.y - 20 && y < p.y + 3),
      act: () => Presents.choose(S),
    };
  },
  // open all the presents at once and pick
  async choose(S) {
    if (S.choosing || !save.pending) return;
    S.choosing = true;
    AU.sfx('pop');
    await tween(300, (k) => { for (const p of S.presents || []) if (!p.gone) p.lid = Math.round(k * 8); });
    AU.sfx('sparkle');
    const p = save.pending;
    const left = p.items.filter((k) => !save.items[p.room].includes(k));
    const pick = await openPresentCard(p.room, left, { golden: p.golden, keepLeft: p.keep, host: S.host });
    if (!pick) { await tween(250, (k) => { for (const q of S.presents || []) if (!q.gone) q.lid = Math.round((1 - k) * 8); }); S.choosing = false; return; }
    p.keep--; persist();
    const vis = S.presents.find((q) => q.item === pick);
    if (vis) { vis.gone = true; burst(vis.x, vis.y - 6, 12, { speed: 30, c: '#FFF6C8', extra: { layer: 'front' } }); }
    await Presents.place(S, pick, p.keep <= 0);
    S.choosing = false;
    // a golden present lets you keep two
    if (save.pending && save.pending.keep > 0) {
      await say(S.host || 'greg', 'Golden presents! Pick one more!');
      return Presents.choose(S);
    }
  },
  async place(S, item, last) {
    const room = save.pending ? save.pending.room : S.room;
    AU.sfx('poof');
    if (last) for (const q of S.presents || []) if (!q.gone) { q.gone = true; burst(q.x, q.y - 6, 12, { speed: 30, c: '#FFF6C8', extra: { layer: 'front' } }); }
    if (!save.items[room].includes(item)) save.items[room].push(item);
    if (room === 'library') save.item = save.item || item;
    if (last) { save.pending = null; S.presents = null; }
    persist();
    // presents for another room fly there (the Reading Tower gets the library's presents)
    if (room !== S.room) {
      await say(S.host || 'greg', `It is for ${ROOMS[room].name}! Come see!`);
      await fadeOut(400);
      goScene(room, { placing: item });
      return;
    }
    const at = ROOM_ITEMS[room][item].at;
    burst(at[0], at[1] - 6, 22, { speed: 34, c: '#FFE38A', extra: { layer: 'front' } });
    applyWearables(S);
    if (S.onPlaced) await S.onPlaced(item, last);
  },
  drawBg(S, g) {
    const R = ROOM_ITEMS[S.room] || {};
    for (const k of save.items[S.room] || []) { const it = R[k]; if (it && !it.fg) it.draw(g, S); }
    if (S.presents) for (const p of S.presents) if (!p.gone) {
      drawPresent(g, p.x, p.y, p.wrap, p.ribbon, p.lid);
    }
  },
  drawFg(S, g) {
    const R = ROOM_ITEMS[S.room] || {};
    for (const k of save.items[S.room] || []) { const it = R[k]; if (it && it.fg) it.draw(g, S); }
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
// clothing presents are worn: every Sparkee in the room puts it on (headphones go to the one at the record table)
function applyWearables(S) {
  const room = S.room, all = [S[HOST_OF[room]], ...(S.sps || [])].filter(Boolean);
  const uniq = [...new Set(all)];
  for (const k of save.items[room] || []) {
    const w = ITEMS[k] && ITEMS[k].wear; if (!w) continue;
    const who = w === 'headphones' ? (S.dj ? [S.dj] : []) : uniq;
    for (const s of who) { const acc = (s.acc || '').split(' ').filter(Boolean); if (!acc.includes(w)) { acc.push(w); s.acc = acc.join(' '); } }
  }
}

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
