// ===================== HUD =====================
function updateHud(newQuest) {
  const onTitle = scene === SCENES.title;
  $('#hud').hidden = onTitle;
  const q = $('#hQuest');
  q.hidden = save.stage !== 'quest';
  if (newQuest) { q.classList.remove('pulse'); void q.offsetWidth; q.classList.add('pulse'); }
  $('#hMusic').classList.toggle('off', !AU.musicOn);
}
function mountHud() {
  $('#hQuest').append(pixImg(ICONS.scroll, 1, 'hicon'));
  $('#hMusic').append(pixImg(ICONS.note, 1, 'hicon'));
  $('#hQuest').addEventListener('click', async () => {
    if (isBusy() || Dlg.active || Modal.open) return;
    AU.sfx('page');
    const r = await openQuestPage(true);
    if (r === 'done' && scene === SCENES.library) {
      const hs = SCENES.library.hotspots.find((h) => h.when && h.rect && h.rect[0] === 170 && h.when());
      if (hs) runHotspot(hs);
    }
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
  zoe.rebuild();
}

async function openQuestPage(fromHud) {
  const steps = h('ol', { class: 'qsteps' },
    h('li', {}, pixImg(ICONS.magnifier, 1.2), h('span', {}, 'Find it.')),
    h('li', {}, pixImg(ICONS.openbook, 1.1), h('span', {}, 'Read it.')),
    h('li', {}, pixImg(ICONS.talk, 1.2), h('span', {}, 'Tell the Sparkees all about it.')));
  const read = 'The Animal Book Hunt. Somewhere in your house, there is a book with an animal on the cover. Find it. Read it. Then come back and tell the Sparkees all about it.';
  const btns = h('div', { class: 'qbtns' });
  const node = card('quest',
    h('div', { class: 'qkicker' }, 'A quest from the bookshelf ', speakBtn(read)),
    h('h2', {}, 'The Animal Book Hunt'),
    h('p', { class: 'qlead' }, 'Somewhere in your house, there is a book with an animal on the cover.'),
    steps,
    h('p', { class: 'qaside' }, '(Grown-ups can help with big words. That is what grown-ups are for.)'),
    btns);
  if (!fromHud) {
    const b = h('button', { class: 'seal', type: 'button' }, pixImg(ICONS.seal, 1.4), h('span', {}, "I'll do it!"));
    b.addEventListener('click', () => { AU.sfx('chime'); Modal.close('ok'); });
    btns.append(b);
  } else {
    const b1 = h('button', { class: 'big', type: 'button' }, 'I read my book!');
    const b2 = h('button', { class: 'ghostbtn', type: 'button' }, 'Not yet');
    b1.addEventListener('click', () => { AU.sfx('tap'); Modal.close('done'); });
    b2.addEventListener('click', () => { AU.sfx('tap'); Modal.close('later'); });
    btns.append(b1, b2);
  }
  AU.sfx('page');
  Voice.say(read, 'n');
  const r = await Modal.show(node, 'dim');
  Voice.stop();
  return r;
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
async function openFeelingPicker() {
  const q = 'How did the story make you feel?';
  const row = h('div', { class: 'frow' });
  for (const [k, label, ex] of [['funny', 'Funny', 'laugh'], ['exciting', 'Exciting', 'star'], ['cozy', 'Cozy', 'cozy'], ['sad', 'Sad', 'sad']]) {
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
  const text = `Chapter one, complete! The library wakes up. Come back tomorrow for a new quest.`;
  const node = card('chapter',
    h('div', { class: 'ckicker' }, 'Chapter One ', speakBtn(text)),
    h('h2', {}, 'The Library Wakes Up'),
    h('ul', { class: 'clist' }, items.map((t) => h('li', {}, h('i', { 'aria-hidden': 'true' }, '✦'), t))),
    h('p', { class: 'cnext' }, 'Come back tomorrow for a new quest. The kitchen smells like cookies.'),
    btn);
  btn.addEventListener('click', () => { AU.sfx('tap'); Modal.close(); });
  Voice.say(text, 'n');
  await Modal.show(node, 'dim');
}
async function openBookCard() {
  const b = save.book; if (!b) return;
  const [c, g] = mk(24, 24); drawBookCover(g, 0, 0, b.animal);
  const feelWord = { funny: 'funny', exciting: 'excited', cozy: 'cozy', sad: 'a little sad' }[b.feel] || 'happy';
  const who = save.name === 'Visitor' ? 'the Visitor' : 'Zoe';
  const text = `A book about ${animalName(b.animal)}. Read by ${who}. It made you feel ${feelWord}. Sparkee rating: nine stars. They don't know when to stop.`;
  const btn = h('button', { class: 'big', type: 'button' }, 'Put it back');
  const node = card('bookcard',
    pixImg(c, 3.2, 'bcover'),
    h('div', { class: 'binfo' },
      h('div', { class: 'ckicker' }, 'On the library shelf ', speakBtn(text)),
      h('h2', {}, `A book about ${animalName(b.animal)}`),
      h('p', {}, `Read by ${who}.`),
      h('p', {}, `It made you feel ${feelWord}.`),
      h('p', { class: 'stars' }, '★★★★★★★★★'),
      h('p', { class: 'qaside' }, "(The Sparkees don't know when to stop.)"),
      btn));
  btn.addEventListener('click', () => { AU.sfx('tap'); Modal.close(); });
  await Modal.show(node, 'dim');
}

// ===================== Title & boot =====================
function routeByStage() {
  const s = save.stage;
  if (s === 'new' || s === 'hallway') return goScene('hall');
  if (s === 'stairs') return goScene('stairs', { arrive: false });
  if (s === 'forest' || s === 'met') return goScene('forest');
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
  AU.musicOn = save.musicOn !== false;
  makeIcons();
  for (const [k] of ANIMALS) ICONS['a_' + k] = animalIcon(k);
  zoe.rebuild();
  mountHud();
  layout();
  $('#bStart').addEventListener('click', (e) => { e.stopPropagation(); begin(); });
  $('#title').addEventListener('pointerdown', (e) => { if (!e.target.closest('button')) { AU.init(); } });
  $('#bNew').addEventListener('click', (e) => { e.stopPropagation(); $('#confirm').hidden = false; $('#tbtns').hidden = true; });
  $('#bYes').addEventListener('click', (e) => { e.stopPropagation(); wipeSave(); for (const k in BG) if (k.startsWith('forest')) delete BG[k]; $('#tbtns').hidden = false; begin(); });
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
