// ===================== HUD =====================
function updateHud(newQuest) {
  const onTitle = scene === SCENES.title;
  $('#hud').hidden = onTitle;
  const q = $('#hQuest');
  q.hidden = !activeQuests().length;
  if (newQuest) { q.classList.remove('pulse'); void q.offsetWidth; q.classList.add('pulse'); }
  $('#hMusic').classList.toggle('off', !AU.musicOn);
}
function mountHud() {
  $('#hQuest').append(pixImg(ICONS.scroll, 1, 'hicon'));
  $('#hMusic').append(pixImg(ICONS.note, 1, 'hicon'));
  $('#hQuest').addEventListener('click', async () => {
    if (isBusy() || Dlg.active || Modal.open || scene === SCENES.title) return;
    AU.sfx('page');
    const list = activeQuests();
    if (!list.length) return;
    const pick = list.length === 1 ? list[0] : await openQuestChooser(list);
    if (!pick) return;
    const r = await openQuestPage(pick.q, pick.kind, true);
    if (r === 'done') goTell(pick.kind);
  });
  $('#hMusic').addEventListener('click', () => { AU.init(); AU.setMusic(!AU.musicOn); save.musicOn = AU.musicOn; persist(); updateHud(); });
}

// ===================== Overlays =====================
function speakBtn() { return null; }
function card(cls, ...kids) { return h('div', { class: 'card ui ' + cls }, ...kids); }

async function openMirror() {
  const L = save.look;
  const prev = h('div', { class: 'mirror-glass' });
  const redraw = () => { zoe.rebuild(); prev.innerHTML = ''; prev.append(pixImg(zoe.F.front, 3, 'mirror-zoe')); };
  const row = (label, items, key) => {
    const wrap = h('div', { class: 'mrow' }, h('div', { class: 'mlabel' }, label));
    const btns = h('div', { class: 'mbtns' });
    items.forEach((it, i) => {
      const b = h('button', { class: 'sw' + (L[key] === i ? ' on' : ''), type: 'button', 'aria-label': `${label} ${i + 1}` });
      if (it.color) b.style.background = it.color; else b.append(it.node);
      b.addEventListener('click', () => { L[key] = i; AU.sfx('tap'); [...btns.children].forEach((c, j) => c.classList.toggle('on', j === i)); redraw(); });
      btns.append(b);
    });
    wrap.append(btns);
    return wrap;
  };
  const styleThumb = (i) => { const look = Object.assign({}, L, { hair: i }); const F = zoeFrames(look); const [c, g] = mk(24, 16); g.drawImage(F.front, 0, 0); return pixImg(c, 0.9); };
  const done = h('button', { class: 'big', type: 'button' }, "That's me!");
  const node = card('mirror',
    h('div', { class: 'mframe' }, prev),
    h('div', { class: 'mside' },
      h('div', { class: 'mtitle' }, 'The Mirror ', speakBtn('Tap the buttons to look like you. Then tap, that\'s me!')),
      row('Hair', HAIRS.map((_, i) => ({ node: styleThumb(i) })), 'hair'),
      row('Hair color', HAIRC.map((c) => ({ color: c.h })), 'hairColor'),
      row('Skin', SKINS.map((c) => ({ color: c.s })), 'skin'),
      row('Shirt', SHIRTS.map((c) => ({ color: c.t })), 'shirt'),
      done));
  redraw();
  done.addEventListener('click', () => { AU.sfx('sparkle'); persist(); Modal.close(); });
  Voice.say('Tap the buttons to look like you.', 'n');
  await Modal.show(node, 'dim');
  zoe.rebuild(); rebuildPeopleIcons();
}

function activeQuests() {
  const out = [];
  if (save.stage === 'quest') out.push({ kind: 'read', q: READ_QUESTS[0] });
  if (save.active && save.active.read) out.push({ kind: 'read', q: readQuest(save.active.read) });
  if (save.active && save.active.art) out.push({ kind: 'art', q: artQuest(save.active.art) });
  return out;
}
// "I did it!" from the quest scroll: go to the right room and start telling
async function goTell(kind) {
  const room = ROOM_OF[kind];
  if (save.stage === 'quest') {
    if (scene !== SCENES.library) { await fadeOut(400); goScene('library'); return; }
    const hs = SCENES.library.hotspots.find((x) => x.when && x.rect && x.rect[0] === 170 && x.when());
    if (hs) runHotspot(hs);
    return;
  }
  if (scene === SCENES[room]) {
    runHotspot({ stand: kind === 'read' ? [134, 186] : [144, 186], act: () => (kind === 'read' ? scene.tellRead(true) : scene.tellArt(true)) });
    return;
  }
  await fadeOut(400);
  goScene(room, { tell: kind });
}
// the room's three quests for today
async function openQuestBoard(kind) {
  const d = daily(), ids = d[kind], doneIds = d.done[kind], act = save.active[kind];
  const row = h('div', { class: 'brow' });
  for (const id of ids) {
    const q = questOf(kind, id), isDone = doneIds.includes(id), isAct = id === act;
    const ic = kind === 'read' ? (ICONS['e_' + q.cover.emblem] || ICONS.openbook) : (ICONS[(q.icons || [])[1]] || ICONS.e_splash);
    const tag = isDone ? h('span', { class: 'btag done' }, 'Done ✓') : isAct ? h('span', { class: 'btag now' }, 'Your quest') : h('span', { class: 'btag' }, 'Pick me!');
    const b = h('button', { class: 'bcard' + (isDone ? ' isdone' : '') + (isAct ? ' isact' : ''), type: 'button' }, pixImg(ic, 1.6), h('span', { class: 'bt' }, q.title), tag);
    if (isDone) b.setAttribute('disabled', '');
    else b.addEventListener('click', () => { AU.sfx('page'); Modal.close(id); });
    row.append(b);
  }
  const n = doneIds.length;
  const dots = h('div', { class: 'bprog' }, ids.map((_, i) => h('i', { class: i < n ? 'on' : '' })), h('span', {}, n >= ids.length ? 'All done for today! New quests tomorrow.' : `${n} of ${ids.length} done today`));
  const x = h('button', { class: 'ghostbtn', type: 'button' }, 'Close');
  x.addEventListener('click', () => { AU.sfx('tap'); Modal.close(null); });
  const node = card('board' + (kind === 'art' ? ' art' : ''), h('div', { class: 'qkicker' }, kind === 'read' ? "Today's quests from the bookshelf" : "Today's quests from the easel"), row, dots, x);
  AU.sfx('page');
  return Modal.show(node, 'dim');
}
async function openQuestChooser(list) {
  const node = card('chooser', h('div', { class: 'ptitle' }, 'Which quest?'));
  const row = h('div', { class: 'chrow' });
  for (const it of list) {
    const ic = it.kind === 'read' ? ICONS.openbook : ICONS.e_splash;
    const b = h('button', { class: 'chbtn', type: 'button' }, pixImg(ic, 1.4), h('span', { class: 'chk' }, it.kind === 'read' ? 'From the bookshelf' : 'From the easel'), h('span', { class: 'cht' }, it.q.title));
    b.addEventListener('click', () => { AU.sfx('tap'); Modal.close(it); });
    row.append(b);
  }
  const x = h('button', { class: 'ghostbtn', type: 'button' }, 'Close');
  x.addEventListener('click', () => { AU.sfx('tap'); Modal.close(null); });
  node.append(row, x);
  return Modal.show(node, 'dim');
}
async function openQuestPage(q, kind = 'read', fromHud = false) {
  const icons = q.icons ? q.icons.map((k) => ICONS[k]) : [ICONS.magnifier, ICONS.openbook, ICONS.talk];
  const steps = h('ol', { class: 'qsteps' }, q.steps.map((t, i) => h('li', {}, pixImg(icons[i] || ICONS.seal, i === 1 && kind === 'read' ? 1.1 : 1.2), h('span', {}, t))));
  const btns = h('div', { class: 'qbtns' });
  const node = card('quest' + (kind === 'art' ? ' art' : ''),
    h('div', { class: 'qkicker' }, kind === 'read' ? 'A quest from the bookshelf' : 'A quest from the easel'),
    h('h2', {}, q.title),
    h('p', { class: 'qlead' }, q.lead),
    steps,
    h('p', { class: 'qaside' }, q.aside || '(Grown-ups can help with big words. That is what grown-ups are for.)'),
    btns);
  if (!fromHud) {
    const b = h('button', { class: 'seal', type: 'button' }, pixImg(ICONS.seal, 1.4), h('span', {}, "I'll do it!"));
    b.addEventListener('click', () => { AU.sfx('chime'); Modal.close('ok'); });
    btns.append(b);
    if (save.stage === 'done') {
      const l = h('button', { class: 'ghostbtn', type: 'button' }, 'Maybe later');
      l.addEventListener('click', () => { AU.sfx('tap'); Modal.close('later'); });
      btns.append(l);
    }
  } else {
    const b1 = h('button', { class: 'big', type: 'button' }, kind === 'read' ? 'I did it!' : 'I made it!');
    const b2 = h('button', { class: 'ghostbtn', type: 'button' }, 'Not yet');
    b1.addEventListener('click', () => { AU.sfx('tap'); Modal.close('done'); });
    b2.addEventListener('click', () => { AU.sfx('tap'); Modal.close('later'); });
    btns.append(b1, b2);
  }
  AU.sfx('page');
  return Modal.show(node, 'dim');
}
// a grid of picture choices: options = [[key, label, iconKey], ...]
async function openPicker(title, options) {
  const grid = h('div', { class: 'agrid' });
  const n = options.length, cols = n <= 5 ? n : n === 6 ? 3 : 5;
  grid.style.gridTemplateColumns = `repeat(${cols}, calc(var(--u) * ${n <= 4 ? 44 : 38}))`;
  for (const [k, label, ic] of options) {
    const b = h('button', { class: 'acell big2', type: 'button' }, ICONS[ic] ? pixImg(ICONS[ic], 1.4) : '', h('span', {}, label));
    b.addEventListener('click', () => { AU.sfx('sparkle'); Modal.close(k); });
    grid.append(b);
  }
  return Modal.show(card('picker', h('div', { class: 'ptitle' }, title), grid), 'dim');
}
async function openColorPicker(title) {
  const grid = h('div', { class: 'cgrid' });
  for (const [k, label, hex] of COVER_COLORS) {
    const sw = h('i', { class: 'cswatch' }); sw.style.background = hex;
    const b = h('button', { class: 'acell ccell', type: 'button' }, sw, h('span', {}, label));
    b.addEventListener('click', () => { AU.sfx('sparkle'); Modal.close(k); });
    grid.append(b);
  }
  return Modal.show(card('picker', h('div', { class: 'ptitle' }, title), grid), 'dim');
}
async function openPeoplePicker() {
  const chosen = new Set();
  const grid = h('div', { class: 'agrid people' });
  const done = h('button', { class: 'big', type: 'button', disabled: '' }, "That's everyone!");
  for (const [k, label, ic] of FAMILY) {
    const b = h('button', { class: 'acell', type: 'button', 'aria-pressed': 'false' }, pixImg(ICONS[ic], 1.25), h('span', {}, label), h('b', { class: 'tick', 'aria-hidden': 'true' }, '✓'));
    b.addEventListener('click', () => {
      if (chosen.has(k)) { chosen.delete(k); AU.sfx('tap'); } else { chosen.add(k); AU.sfx('pop'); }
      b.classList.toggle('on', chosen.has(k)); b.setAttribute('aria-pressed', chosen.has(k) ? 'true' : 'false');
      if (chosen.size) done.removeAttribute('disabled'); else done.setAttribute('disabled', '');
    });
    grid.append(b);
  }
  done.addEventListener('click', () => { if (!chosen.size) return; AU.sfx('sparkle'); Modal.close(FAMILY.map((f) => f[0]).filter((k) => chosen.has(k))); });
  const node = card('picker peoplecard', h('div', { class: 'ptitle' }, 'Who is on your family tree?'), h('p', { class: 'psub' }, 'Tap everybody. Tap again to take someone off.'), grid, h('div', { class: 'pfoot' }, done));
  return Modal.show(node, 'dim');
}
async function openAnimalPicker() {
  const grid = h('div', { class: 'agrid' });
  const q = 'What animal was on the cover?';
  for (const [k, label] of ANIMALS) {
    const b = h('button', { class: 'acell', type: 'button' }, pixImg(ICONS['a_' + k], 1.25), h('span', {}, label));
    b.addEventListener('click', () => { AU.sfx('sparkle'); Voice.say(label === 'Something else' ? 'A mystery animal!' : 'A ' + label.toLowerCase() + '!', 'sp'); Modal.close(k); });
    grid.append(b);
  }
  const node = card('picker', h('div', { class: 'ptitle' }, q, ' ', speakBtn(q, 'greg')), grid);
  Voice.say(q, 'greg');
  return Modal.show(node, 'dim');
}
async function openFeelingPicker(list, title) {
  const q = title || 'How did the story make you feel?';
  const row = h('div', { class: 'frow' });
  for (const [k, label, ex] of list || [['funny', 'Funny', 'laugh'], ['exciting', 'Exciting', 'star'], ['cozy', 'Cozy', 'cozy'], ['sad', 'Sad', 'sad']]) {
    const b = h('button', { class: 'fcell', type: 'button' }, pixImg(sparkeeFace(ex), 2.2), h('span', {}, label));
    b.addEventListener('click', () => { AU.sfx('tap'); Voice.say(label, 'sp'); Modal.close(k); });
    row.append(b);
  }
  const node = card('picker feel', h('div', { class: 'ptitle' }, q, ' ', speakBtn(q, 'greg')), row);
  Voice.say(q, 'greg');
  return Modal.show(node, 'dim');
}
function animalName(k) { const a = ANIMALS.find((x) => x[0] === k); return a ? (k === 'other' ? 'a mystery animal' : 'a ' + a[1].toLowerCase()) : 'an animal'; }
async function openChapterCard() {
  AU.sfx('chime');
  const b = save.book || { animal: 'other' };
  const items = ['Found the tiny door', 'Met the Sparkees (and Greg)', `Read a book about ${animalName(b.animal)}`, 'Lit the library fire'];
  const btn = h('button', { class: 'big', type: 'button' }, 'Keep exploring');
  const text = `Chapter one, complete! The library wakes up.`;
  const node = card('chapter',
    h('div', { class: 'ckicker' }, 'Chapter One ', speakBtn(text)),
    h('h2', {}, 'The Library Wakes Up'),
    h('ul', { class: 'clist' }, items.map((t) => h('li', {}, h('i', { 'aria-hidden': 'true' }, '✦'), t))),
    h('p', { class: 'cnext' }, 'Every day, the bookshelf will have three new quests. And something upstairs is rumbling...'),
    btn);
  btn.addEventListener('click', () => { AU.sfx('tap'); Modal.close(); });
  Voice.say(text, 'n');
  await Modal.show(node, 'dim');
}
function bookTitle(b) {
  const q = readQuest(b.q || 'animal');
  if (q.id === 'animal') return `A book about ${animalName(b.animal)}`;
  if (q.id === 'color' && b.color) { const c = COVER_COLORS.find((x) => x[0] === b.color); if (c) return `A ${c[1].toLowerCase()} book`; }
  return q.title;
}
function bookDetail(b) {
  const q = readQuest(b.q || 'animal'), out = [];
  for (const st of q.tell) if (st.type === 'pick' && b.picks && b.picks[st.key]) { const o = st.options.find((x) => x[0] === b.picks[st.key]); if (o) out.push(`${st.q} ${o[1]}.`); }
  return out;
}
async function openBookCard(b) {
  b = b || save.books[save.books.length - 1]; if (!b) return;
  const [c, g] = mk(24, 24); drawBookCover(g, 0, 0, b);
  const feelWord = { funny: 'funny', exciting: 'excited', cozy: 'cozy', sad: 'a little sad' }[b.feel];
  const who = save.name === 'Visitor' ? 'the Visitor' : 'Zoe';
  const btn = h('button', { class: 'big', type: 'button' }, 'Put it back');
  const node = card('bookcard',
    pixImg(c, 3.2, 'bcover'),
    h('div', { class: 'binfo' },
      h('div', { class: 'ckicker' }, `Book ${save.books.indexOf(b) + 1} on the library shelf`),
      h('h2', {}, bookTitle(b)),
      h('p', {}, `Read by ${who}.`),
      bookDetail(b).map((t) => h('p', {}, t)),
      feelWord ? h('p', {}, `It made you feel ${feelWord}.`) : null,
      h('p', { class: 'stars' }, '★★★★★★★★★'),
      h('p', { class: 'qaside' }, "(The Sparkees don't know when to stop.)"),
      btn));
  btn.addEventListener('click', () => { AU.sfx('tap'); Modal.close(); });
  await Modal.show(node, 'dim');
}
function famLabel(k) { const f = FAMILY.find((x) => x[0] === k); return f ? f[1] : k; }
async function openArtCard(a) {
  if (!a) return;
  const q = artQuest(a.q);
  let pic;
  if (a.photo) { pic = h('img', { class: 'aphoto', src: a.photo, alt: q.title }); }
  else pic = pixImg(artCanvas(a), 2.5, 'apix');
  const lines = [];
  if (a.people && a.people.length) lines.push(`On the tree: ${a.people.map(famLabel).join(', ')}.`);
  if (a.who) lines.push(`Made for: ${famLabel(a.who)}.`);
  const feel = { fun: 'fun', proud: 'proud', calm: 'calm', tricky: 'tricky (but you did it)' }[a.feel];
  if (feel) lines.push(`Making it felt ${feel}.`);
  const btn = h('button', { class: 'big', type: 'button' }, 'Lovely');
  const node = card('artcard',
    h('div', { class: 'aframe' }, pic),
    h('div', { class: 'binfo' },
      h('div', { class: 'ckicker' }, 'In the art studio'),
      h('h2', {}, q.title),
      h('p', {}, `By ${save.name === 'Visitor' ? 'the Visitor' : 'Zoe'}.`),
      lines.map((t) => h('p', {}, t)),
      h('p', { class: 'qaside' }, '(Dot rating: magnificent. Dot only has one rating.)'),
      btn));
  btn.addEventListener('click', () => { AU.sfx('tap'); Modal.close(); });
  await Modal.show(node, 'dim');
}
// take a picture of real art and turn it into pixel art
function openPhotoModal(q) {
  return new Promise((resolve) => {
    const input = h('input', { type: 'file', accept: 'image/*', capture: 'environment', class: 'hiddenfile' });
    const area = h('div', { class: 'pharea' });
    const btns = h('div', { class: 'qbtns' });
    const take = h('button', { class: 'big', type: 'button' }, pixImg(ICONS.e_camera, 0.8, 'inl'), ' Take a picture');
    const skip = h('button', { class: 'ghostbtn', type: 'button' }, 'Skip the picture');
    const node = card('photo', h('div', { class: 'qkicker' }, 'Show Dot'), h('h2', {}, q.title), area, btns, input);
    const reset = () => {
      area.innerHTML = '';
      area.append(h('div', { class: 'phempty' }, pixImg(ICONS.e_camera, 2.6), h('p', {}, 'Hold your art up flat, in good light.')));
      btns.innerHTML = ''; btns.append(take, skip);
    };
    take.addEventListener('click', () => { AU.sfx('tap'); input.value = ''; input.click(); });
    skip.addEventListener('click', () => { AU.sfx('tap'); Modal.close(null); });
    input.addEventListener('change', () => {
      const f = input.files && input.files[0]; if (!f) return;
      area.innerHTML = ''; area.append(h('p', { class: 'phwait' }, 'Dot is looking...'));
      const url = URL.createObjectURL(f);
      const img = new Image();
      img.onload = () => {
        let res;
        try { res = photoToArt(img); } catch (e) { console.error(e); reset(); return; }
        URL.revokeObjectURL(url);
        const small = h('img', { class: 'phpix', src: res.pix, alt: 'Your art as pixel art' });
        const real = h('img', { class: 'phreal', src: res.photo, alt: 'Your photo' });
        area.innerHTML = '';
        area.append(h('div', { class: 'phpair' }, h('figure', {}, real, h('figcaption', {}, 'Your art')), h('span', { class: 'pharrow', 'aria-hidden': 'true' }, '→'), h('figure', {}, small, h('figcaption', {}, 'In the treehouse'))));
        const use = h('button', { class: 'big', type: 'button' }, 'Show Dot!');
        const again = h('button', { class: 'ghostbtn', type: 'button' }, 'Try again');
        use.addEventListener('click', () => { AU.sfx('sparkle'); Modal.close(res); });
        again.addEventListener('click', () => { AU.sfx('tap'); input.value = ''; input.click(); });
        btns.innerHTML = ''; btns.append(use, again);
      };
      img.onerror = () => { reset(); area.prepend(h('p', { class: 'phwait' }, "Hmm, that picture didn't work. Try again?")); };
      img.src = url;
    });
    reset();
    Modal.show(node, 'dim').then(resolve);
  });
}
async function openSinkCard() {
  const t = todayRoutines(), slot = slotNow();
  const mark = (ok) => h('b', { class: ok ? 'yes' : 'no' }, ok ? '✓' : '○');
  const bBrush = h('button', { class: 'big', type: 'button' }, t[slot + '_brush'] ? 'I brushed again!' : 'I brushed!');
  const bAlong = h('button', { class: 'ghost2', type: 'button' }, 'Brush along (2 minutes)');
  const bFloss = h('button', { class: 'big', type: 'button' }, 'I flossed!');
  const node = card('sink',
    h('div', { class: 'qkicker' }, 'The sink'),
    h('h2', {}, 'Teeth Time'),
    h('div', { class: 'srow' }, pixImg(ICONS.e_brush, 1.5), h('div', { class: 'sinfo' }, h('div', { class: 'sname' }, 'Brush my teeth'), h('div', { class: 'sstat' }, h('span', { class: slot === 'am' ? 'now' : '' }, 'Morning ', mark(t.am_brush)), h('span', { class: slot === 'pm' ? 'now' : '' }, 'Night ', mark(t.pm_brush)))), h('div', { class: 'sbtns' }, bBrush, bAlong)),
    h('div', { class: 'srow' }, pixImg(ICONS.e_floss, 1.5), h('div', { class: 'sinfo' }, h('div', { class: 'sname' }, 'Floss'), h('div', { class: 'sstat' }, h('span', {}, 'Today ', mark(t.floss)))), h('div', { class: 'sbtns' }, bFloss)),
    h('p', { class: 'qaside' }, '(Morning lasts until 3 in the afternoon. After that, it counts as night.)'));
  const close = h('button', { class: 'ghostbtn', type: 'button' }, 'Not now');
  node.append(close);
  bBrush.addEventListener('click', () => { AU.sfx('tap'); Modal.close('brushed'); });
  bAlong.addEventListener('click', () => { AU.sfx('tap'); Modal.close('along'); });
  bFloss.addEventListener('click', () => { AU.sfx('tap'); Modal.close('floss'); });
  close.addEventListener('click', () => { AU.sfx('tap'); Modal.close(null); });
  return Modal.show(node, 'dim');
}
async function openChapterTwoCard(art) {
  AU.sfx('chime');
  const items = ['Found the hatch in the ceiling', 'Met Dot, the artist', art && art.q === 'family' ? 'Made a family tree' : 'Made real art', 'Brought the colors back'];
  const btn = h('button', { class: 'big', type: 'button' }, 'Keep exploring');
  const node = card('chapter',
    h('div', { class: 'ckicker' }, 'Chapter Two'),
    h('h2', {}, 'The Art Studio Opens'),
    h('ul', { class: 'clist' }, items.map((t) => h('li', {}, h('i', { 'aria-hidden': 'true' }, '✦'), t))),
    h('p', { class: 'cnext' }, 'The easel has more art quests. And the door marked BATH is waiting...'),
    btn);
  btn.addEventListener('click', () => { AU.sfx('tap'); Modal.close(); });
  await Modal.show(node, 'dim');
}

// ===================== Title & boot =====================
function routeByStage() {
  const s = save.stage;
  if (s === 'new' || s === 'hallway') return goScene('hall');
  if (s === 'stairs') return goScene('stairs', { arrive: false });
  if (s === 'forest' || s === 'met') return goScene('forest');
  if (s === 'done' && save.lastRoom === 'studio' && save.flags.hatch) return goScene('studio');
  if (s === 'done' && save.lastRoom === 'bath' && save.flags.hatch) return goScene('bath');
  return goScene('library');
}
function showTitle() {
  goScene('title');
  const t = $('#title');
  t.hidden = false;
  const has = save.stage !== 'new';
  $('#bStart').textContent = has ? 'Keep playing' : 'Tap to begin';
  $('#bNew').hidden = !has;
  $('#confirm').hidden = true;
}
function begin() {
  AU.init(); Voice.unlock();
  if (save.musicOn === false) AU.setMusic(false);
  $('#title').hidden = true;
  zoe.rebuild();
  routeByStage();
}
function boot() {
  loadSave();
  migrateSave();
  AU.musicOn = save.musicOn !== false;
  makeIcons();
  for (const [k] of ANIMALS) ICONS['a_' + k] = animalIcon(k);
  makeIcons2();
  zoe.rebuild();
  mountHud();
  layout();
  $('#bStart').addEventListener('click', (e) => { e.stopPropagation(); begin(); });
  $('#title').addEventListener('pointerdown', (e) => { if (!e.target.closest('button')) { AU.init(); } });
  $('#bNew').addEventListener('click', (e) => { e.stopPropagation(); $('#confirm').hidden = false; $('#tbtns').hidden = true; });
  $('#bYes').addEventListener('click', (e) => { e.stopPropagation(); wipeSave(); migrateSave(); for (const k in BG) if (k.startsWith('forest')) delete BG[k]; $('#tbtns').hidden = false; begin(); });
  $('#bNo').addEventListener('click', (e) => { e.stopPropagation(); $('#confirm').hidden = true; $('#tbtns').hidden = false; });
  $('#bAnyway').addEventListener('click', () => { playAnyway = true; layout(); });
  document.addEventListener('visibilitychange', () => {
    if (!AU.ctx) return;
    if (document.hidden) AU.ctx.suspend(); else AU.ctx.resume();
  });
  showTitle();
  requestAnimationFrame(frame);
  window.__dbg = { save, goScene, SCENES, zoe, persist, begin, get scene() { return scene; }, get busy() { return isBusy(); }, Dlg, Modal };
}
boot();
