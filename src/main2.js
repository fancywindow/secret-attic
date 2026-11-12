// ===================== Presents card, quest in progress, map =====================
// a picture of a present: clothing is shown on a big Sparkee; everything else is drawn and cropped
const THUMB_CACHE = {};
function itemThumb(room, k) {
  if (THUMB_CACHE[k]) return THUMB_CACHE[k];
  const it = ITEMS[k];
  if (it && it.wear) {
    const [c, g] = mk(44, 44);
    const s = new Sparkee({ r: 10, seed: 21, x: 22, y: 40, acc: it.wear, expr: 'happy' });
    s.t = 1.2; s.draw(g);
    return (THUMB_CACHE[k] = c);
  }
  if (k === 'kitchenkey') return (THUMB_CACHE[k] = ICONS.e_key);
  const R = ROOM_ITEMS[room] && ROOM_ITEMS[room][k];
  if (!R) return ICONS.e_star;
  const [c, g] = mk(W, H);
  if (R.thumb) R.thumb(g); else R.draw(g, PREVIEW);
  // crop to the drawn pixels
  const d = g.getImageData(0, 0, W, H).data;
  let x0 = W, y0 = H, x1 = 0, y1 = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (d[(y * W + x) * 4 + 3] > 20) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  if (x1 < x0) return ICONS.e_star;
  const [o, og] = mk(x1 - x0 + 3, y1 - y0 + 3);
  og.drawImage(c, x0 - 1, y0 - 1, x1 - x0 + 3, y1 - y0 + 3, 0, 0, x1 - x0 + 3, y1 - y0 + 3);
  return (THUMB_CACHE[k] = o);
}
function fitScale(c, w, h, max = 3) { return Math.max(0.2, Math.min(max, w / c.width, h / c.height)); }
async function openPresentCard(room, items, opts = {}) {
  const row = h('div', { class: 'prow' });
  for (const k of items) {
    const th = itemThumb(room, k), info = ITEMS[k];
    const b = h('button', { class: 'pcard', type: 'button' },
      h('div', { class: 'pthumb' }, pixImg(th, fitScale(th, 60, 44))),
      h('span', { class: 'pname' }, info.lines[0]),
      h('span', { class: 'pline' }, info.lines[1]),
      h('span', { class: 'ppick' }, items.length > 1 ? 'Pick this one' : 'Open it!'));
    b.addEventListener('click', () => { AU.sfx('sparkle'); Modal.close(k); });
    row.append(b);
  }
  const title = items.length === 1 ? 'A present!' : opts.keepLeft > 1 ? 'Golden presents! Pick TWO.' : opts.golden ? 'Golden presents! Pick one.' : 'Pick one present!';
  const x = h('button', { class: 'ghostbtn', type: 'button' }, 'Close the boxes');
  x.addEventListener('click', () => { AU.sfx('tap'); Modal.close(null); });
  const node = card('presents' + (opts.golden ? ' golden' : ''), h('div', { class: 'ptitle' }, title), row, x);
  return Modal.show(node, 'dim');
}
// after picking a quest: go do it, then tap the big button when you are done
async function openInProgress(kind, q, fresh) {
  const icons = q.icons ? q.icons.map((k) => ICONS[k]) : [ICONS.magnifier, ICONS.openbook, ICONS.talk];
  const go = { read: 'Go read! Then come back and tap the big button.', art: q.size === 'project' ? 'Big projects take a while. Come back when it is done!' : 'Go draw! Then come back and tap the big button.', food: 'Go try it! Then come back and tap the big button.' }[kind];
  const big = h('button', { class: 'big pbig', type: 'button' }, 'I did it!');
  const later = h('button', { class: 'ghostbtn', type: 'button' }, fresh ? "I'll do it later" : 'Later');
  const node = card('progress ' + kind,
    h('div', { class: 'qkicker' }, fresh ? (q.size === 'project' ? 'A new big project!' : 'A new quest!') : 'Quest in progress'),
    h('h2', {}, q.title),
    h('p', { class: 'qlead' }, q.lead),
    h('ol', { class: 'qsteps' }, q.steps.map((t, i) => h('li', {}, pixImg(icons[i] || ICONS.seal, 1), h('span', {}, t)))),
    h('p', { class: 'goline' }, go),
    big, later);
  big.addEventListener('click', () => { AU.sfx('chime'); Modal.close('done'); });
  later.addEventListener('click', () => { AU.sfx('tap'); Modal.close('later'); });
  return Modal.show(node, 'dim');
}
// accept a quest and go straight to the "in progress" card
async function acceptAndGo(kind, q) {
  startQuest(kind, q.id);
  const r = await openInProgress(kind, q, true);
  if (r === 'done') {
    const tell = { read: 'tellRead', art: 'tellArt', food: 'tellFood' }[kind];
    if (scene[tell]) await scene[tell](true);
  }
}
// on opening the app (or arriving in a room) with a quest still going, show its card
let RESUME_CHECK = false;
async function maybeResumeQuest() {
  if (!RESUME_CHECK) return;
  RESUME_CHECK = false;
  const list = activeQuests();
  if (!list.length || save.stage !== 'done') return;
  const here = list.find((x) => ROOM_OF[x.kind] === scene.room) || list.find((x) => x.kind === save.lastStarted) || list[0];
  const r = await openInProgress(here.kind, here.q);
  if (r === 'done') {
    if (ROOM_OF[here.kind] === scene.room) { const tell = { read: 'tellRead', art: 'tellArt', food: 'tellFood' }[here.kind]; zoe.walkTo(...TELL_SPOT[here.kind]); await scene[tell](true); }
    else goTell(here.kind);
  }
}

// ---------------- The map ----------------
const MAP_ORDER = ['hall', 'forest', 'library', 'tower', 'studio', 'bath', 'kitchen'];
const MAP_BG = { hall: ['hall', paintHall], forest: ['forestR', (g) => paintForest(g, true)], library: ['libAlive', paintLibrary], tower: ['towerAlive', paintTower], studio: ['stuAlive', (g) => { paintStudio(g); drawClothesline(g); }], bath: ['bathAlive', paintBath], kitchen: ['kitAlive', paintKitchen] };
function roomThumb(room, locked) {
  const [key, paint] = MAP_BG[room];
  const bg = bgOf(key, W, H, paint);
  const [c, g] = mk(72, 50);
  g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
  g.drawImage(bg, 0, 0, W, H, 0, 0, 72, 50);
  if (locked) { g.globalAlpha = 0.72; D.r(g, 0, 0, 72, 50, '#2C1A1E'); g.globalAlpha = 1; }
  return c;
}
function roomStatus(room) {
  if (room === 'hall') return 'Your house!';
  if (room === 'forest') return 'Where the Sparkees live';
  if (room === 'library') { const p = roomProgress('library'); return save.lib.level >= 2 ? 'Level 2 ★★' : `${p.have} of ${p.total} presents`; }
  if (room === 'tower' || room === 'studio' || room === 'bath' || room === 'kitchen') {
    const p = roomProgress(room);
    return p.have >= p.total ? 'Full! ★ More someday' : `${p.have} of ${p.total} presents`;
  }
  return '';
}
async function openMap() {
  const grid = h('div', { class: 'mapgrid' });
  const cur = scene && scene.room ? scene.room : Object.keys(SCENES).find((k) => SCENES[k] === scene);
  for (const room of MAP_ORDER) {
    const R = ROOMS[room], open = R.open();
    // keep the surprise: rooms you can't know about yet stay hidden
    if (!open && room === 'tower' && !save.flags.kitchenKey) continue;
    const th = h('div', { class: 'mthumb' }, pixImg(roomThumb(room, !open), 0.75));
    if (!open) th.append(h('div', { class: 'mlock' }, pixImg(ICONS.e_lock, 1.2)));
    const b = h('button', { class: 'mroom' + (room === cur ? ' here' : ''), type: 'button' }, th, h('span', { class: 'mname' }, R.name), h('span', { class: 'mstat' }, open ? (room === cur ? 'You are here' : roomStatus(room)) : unlockHint(room)));
    if (!open || room === cur) b.setAttribute('disabled', '');
    else b.addEventListener('click', () => { AU.sfx('sparkle'); Modal.close(room); });
    grid.append(b);
  }
  const x = h('button', { class: 'ghostbtn', type: 'button' }, 'Close');
  x.addEventListener('click', () => { AU.sfx('tap'); Modal.close(null); });
  return Modal.show(card('map', h('div', { class: 'ptitle' }, pixImg(ICONS.e_map, 0.9), ' Greg\'s Magic Map'), grid, x), 'dim');
}
// whoosh: Zoe poofs into sparkles and appears in the other room
async function travelTo(room) {
  if (isBusy()) return;
  busy = true;
  AU.sfx('whoosh');
  burst(zoe.x, zoe.y - 12, 24, { speed: 40, c: '#FFE38A', up: 20, extra: { layer: 'front' } });
  zoe.visible = false;
  await sleep(350);
  await fadeOut(350);
  busy = false;
  goScene(room, { map: true });
}

// ===================== Grown-ups: move a game to another device =====================
// Save the game as a file on one device, send it over (AirDrop works), and load it on the other.
function saveFileName() { return `secret-attic-${(save.name || 'game').toLowerCase()}-${todayKey()}.json`; }
function downloadSave() {
  const blob = new Blob([JSON.stringify({ secretAttic: 1, savedAt: new Date().toISOString(), save })], { type: 'application/json' });
  const a = h('a', { href: URL.createObjectURL(blob), download: saveFileName() });
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
function readSaveFile(file) {
  return new Promise((resolve) => {
    const r = new FileReader();
    r.onload = () => { try { const d = JSON.parse(r.result); const s = d && d.secretAttic ? d.save : d; resolve(s && typeof s === 'object' && s.stage ? s : null); } catch (e) { resolve(null); } };
    r.onerror = () => resolve(null);
    r.readAsText(file);
  });
}
function describeSave(s) {
  const n = (k) => (s.items && s.items[k] ? s.items[k].length : 0);
  const presents = ['library', 'tower', 'studio', 'bath', 'kitchen'].reduce((t, k) => t + n(k), 0);
  const pl = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
  return `${s.name || 'A game'}: ${pl((s.books || []).length, 'book')}, ${pl((s.arts || []).length, 'picture')}, ${pl(presents, 'present')}`;
}
async function openGrownups() {
  $('#title').hidden = true;
  const msg = h('p', { class: 'gmsg' });
  const input = h('input', { type: 'file', accept: '.json,application/json,text/plain', class: 'hiddenfile' });
  const bSave = h('button', { class: 'big', type: 'button' }, 'Save this game to a file');
  const bLoad = h('button', { class: 'ghost2', type: 'button' }, 'Load a game from a file');
  const close = h('button', { class: 'ghostbtn', type: 'button' }, 'Done');
  const node = card('grownups',
    h('div', { class: 'qkicker' }, 'For grown-ups'),
    h('h2', {}, 'Move a game'),
    h('p', { class: 'gnow' }, save.stage === 'new' ? 'This device has no game yet.' : 'On this device: ' + describeSave(save)),
    h('ol', { class: 'gsteps' },
      h('li', {}, 'On the old device, tap ', h('b', {}, 'Save this game to a file'), '.'),
      h('li', {}, 'Send the file to the new device. AirDrop it, and choose "Save to Files."'),
      h('li', {}, 'On the new device, open the Secret Attic from its home-screen icon, tap Grown-ups, then ', h('b', {}, 'Load a game from a file'), '.')),
    h('div', { class: 'gbtns' }, bSave, bLoad), msg, input, close);
  bSave.addEventListener('click', () => { AU.sfx('tap'); downloadSave(); msg.textContent = 'Saved! Look for it in your Downloads.'; });
  bLoad.addEventListener('click', () => { AU.sfx('tap'); input.value = ''; input.click(); });
  input.addEventListener('change', async () => {
    const f = input.files && input.files[0]; if (!f) return;
    const s = await readSaveFile(f);
    if (!s) { msg.textContent = "Hmm, that file isn't a Secret Attic game."; return; }
    msg.innerHTML = '';
    const yes = h('button', { class: 'big', type: 'button' }, 'Yes, load it');
    const no = h('button', { class: 'ghostbtn', type: 'button' }, 'Cancel');
    msg.append(h('span', {}, `Load ${describeSave(s)}? This replaces the game on this device.`), yes, no);
    no.addEventListener('click', () => { msg.textContent = ''; });
    yes.addEventListener('click', () => {
      for (const k of Object.keys(save)) delete save[k];
      Object.assign(save, s);
      migrateSave(); persist();
      for (const k in BG) delete BG[k];
      zoe.rebuild(); rebuildPeopleIcons();
      for (const k in THUMB_CACHE) delete THUMB_CACHE[k];
      AU.sfx('cheer');
      msg.textContent = `Loaded! Welcome back, ${save.name || 'friend'}.`;
    });
  });
  close.addEventListener('click', () => { AU.sfx('tap'); Modal.close(); });
  await Modal.show(node, 'dim');
  showTitle();
}
