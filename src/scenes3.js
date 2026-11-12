// ===================== The Kitchen (Chef Noodle) =====================
SCENES.kitchen = {
  song: 'drab', walk: [40, 172, 262, 194], room: 'kitchen', host: 'noodle',
  enter(o = {}) {
    save.lastRoom = 'kitchen';
    this.alive = bgOf('kitAlive', W, H, paintKitchen);
    this.drab = bgOf('kitDrab', W, H, (g) => { g.drawImage(recolor(this.alive, drab), 0, 0); });
    const awake = !!save.flags.kitchenAwake;
    this.reveal = awake ? 999 : 0; this.song = awake ? 'warm' : 'drab';
    this.st = {}; this.presents = null; this.choosing = false; this.stoveK = awake ? 0.5 : 0; this.dish = save.flags.dish || null;
    zoe.visible = true;
    if (o.arrive) { zoe.x = 44; zoe.y = 188; zoe.face(1); } else { zoe.x = 150; zoe.y = 188; zoe.face(1); }
    this.noodle = new Sparkee({ r: 6, seed: 88, x: 96, y: 182, name: 'noodle', acc: 'chef' });
    this.noodle.glow = awake ? 1 : 0.22; this.noodle.look = zoe;
    if (!save.flags.chefMet) { this.noodle.visible = false; this.noodle.x = 88; this.noodle.y = 150; }
    this.sps = makeSparkees([{ x: 200, y: 186, seed: 61 }, { x: 240, y: 190, seed: 67 }]);
    this.sps.forEach((s, i) => { s.visible = awake; s.look = zoe; s.mode = 'wander'; s.speed = 20; s.area = [[190, 176, 230, 194], [220, 180, 262, 196]][i]; });
    this.actors = [zoe, this.noodle, ...this.sps];
    applyWearables(this);
    const self = this;
    hints = [
      { x: 88, y: 112, strong: true, when: () => save.flags.chefMet && !save.active.food && !dayDone('food') && !self.presents && !save.pending },
      { x: 150, y: 156, when: () => save.flags.chefMet && !!save.active.food && !self.presents },
      { x: 132, y: 186, strong: true, when: () => !!self.presents && !self.choosing },
    ];
    const line = (key, lines) => async () => { await say('n', cycle(lines, key, self.st)); };
    this.hotspots = [
      { rect: [2, 80, 36, 74], stand: [44, 188], act: () => self.toLibrary() },
      { rect: [54, 30, 70, 122], stand: [88, 184], face: 'front', act: () => self.stove() },
      { rect: [112, 154, 76, 24], stand: [150, 188], face: 'front', act: async () => {
        if (save.active.food) { const r = await openInProgress('food', foodQuest(save.active.food)); if (r === 'done') await self.tellFood(true); return; }
        await say('n', self.dish ? 'The dish of the day! It smells amazing. You are not allowed to eat it. It is pretend.' : 'The kitchen table. Room for everybody. Even Greg, if he sits on a book.');
      } },
      { rect: [126, 44, 44, 108], stand: [148, 184], face: 'front', act: line('pantry', ['The pantry. It is full of jars. One jar is labeled MYSTERY.', 'You open the pantry. A single noodle waves at you. You close the pantry.']) },
      { rect: [194, 42, 56, 48], stand: [222, 184], face: 'front', act: line('win', ['The kitchen window looks right out at the forest.', 'A bird is on the windowsill. It looks hungry. It is always hungry.']) },
      { rect: [176, 100, 104, 52], stand: [222, 184], face: 'front', act: line('counter', ['The counter. Very clean. Chef Noodle polishes it with his hat.', 'The sink drips. Drip. Drip. It is keeping time.']) },
      ...kitchenItemSpots(self),
      { hit: (x, y) => self.noodle.visible && Math.hypot(self.noodle.x - x, self.noodle.y - 8 - y) < 12, when: () => !self.presents, stand: () => [clamp(self.noodle.x + 22, 40, 250), clamp(self.noodle.y, 172, 194)], act: () => self.talkNoodle() },
      { hit: (x, y) => self.sps.some((s) => s.visible && Math.hypot(s.x - x, s.y - 5 - y) < 9), when: () => !self.presents, act: async () => {
        const s = self.sps.filter((q) => q.visible).sort((a, b) => Math.hypot(a.x - self._tapX, a.y - self._tapY) - Math.hypot(b.x - self._tapX, b.y - self._tapY))[0];
        s.jump(70); bubble(s, cycle(['I am the taster!', 'I tasted a spoon once. Not a food.', 'Is it snack time? It feels like snack time.', 'Chef Noodle makes the BEST toast.'], 'spk', self.st), 1600, true);
        await sleep(400);
      } },
      Presents.hotspot(self),
    ];
  },
  async toLibrary() {
    if (this.presents) { await say('noodle', 'Wait! Your present!'); return; }
    AU.sfx('creak');
    await fadeOut(400);
    goScene('library', { from: 'kitchen' });
  },
  async talkNoodle() {
    const N = this.noodle;
    N.expr = 'happy';
    if (save.active.food) { const q = foodQuest(save.active.food); await say('noodle', `Your food quest is ${q.title}. When you are done, tap the table and tell me everything!`); }
    else await say('noodle', cycle(['Chef Noodle knows one recipe. It is toast. It is perfect.', 'A secret: Chef Noodle is not a noodle. Chef Noodle just likes noodles.', 'Trying a new food is brave. Even one tiny lick. Licks count!', 'Greg came in here once and ate a whole lemon. He made a face for a week.', dayDone('food') ? 'Three food quests today! Your tummy must be so proud.' : 'My stove has food quests today. Tap it!'], 'nood', this.st));
    N.expr = 'norm';
  },
  async stove() {
    if (!save.flags.chefMet) return;
    if (this.presents || save.pending) { await say('noodle', 'Open your present first!'); return; }
    const pick = await openQuestBoard('food');
    if (!pick) { if (dayDone('food')) await say('noodle', 'All three food quests done today! The stove is having a little nap. New ones tomorrow.'); return; }
    if (pick === save.active.food) { const r = await openInProgress('food', foodQuest(pick)); if (r === 'done') await this.tellFood(true); return; }
    AU.sfx('chime');
    await acceptAndGo('food', foodQuest(pick));
  },
  async tellFood(skipAsk) {
    const q = foodQuest(save.active.food), N = this.noodle;
    if (Math.hypot(zoe.x - 150, zoe.y - 188) > 6) await zoe.walkTo(150, 188);
    zoe.face(-1);
    await N.goto(124, 186, 45); N.look = zoe;
    if (!skipAsk) {
      const r = await ask('noodle', q.ask, ['Yes! I did it!', 'Not yet.']);
      if (r === 1) { await say('noodle', 'No rush! Chef Noodle will be here. Making toast.'); return; }
    }
    N.expr = 'star'; N.jump(100); AU.sfx('cheer');
    const meal = { q: q.id, picks: {}, at: Date.now() };
    for (const st of q.tell) await this.tellStep(st, meal);
    await this.cookMagic(meal);
  },
  async tellStep(st, meal) {
    const N = this.noodle;
    if (st.type === 'pick') {
      const k = await openPicker(st.q, st.options);
      meal.picks[st.key] = k; AU.sfx('sparkle'); N.expr = 'happy';
      const lines = st.react[k] || ['Ooh!', 'Delicious answer.'];
      await say('noodle', lines[0]); await say('noodle', lines[1]);
    } else if (st.type === 'taste') {
      const k = await openPicker('What did it taste like?', TASTES);
      meal.taste = k; AU.sfx('sparkle'); N.expr = k === 'sour' ? 'wide' : 'happy';
      const [a, b] = TASTE_REACT[k]; await say('noodle', a); await say('noodle', b);
    } else if (st.type === 'verdict') {
      const k = await openPicker('So... what did you think?', VERDICT);
      meal.verdict = k; AU.sfx('sparkle'); N.expr = k === 'yum' ? 'star' : 'happy';
      const [a, b] = VERDICT_REACT[k]; await say('noodle', a); await say('noodle', b);
    } else if (st.type === 'colors') {
      const cols = await openColorMulti('Which colors did you eat?');
      meal.colors = cols; AU.sfx('sparkle'); N.expr = 'star';
      await say('noodle', cols.length >= 3 ? `${cols.length} colors! That is a real rainbow plate!` : cols.length === 2 ? 'Two colors! Half a rainbow. A rain-bow-tie.' : 'One color! A very focused plate.');
    }
  },
  async cookMagic(meal) {
    const N = this.noodle, first = this.reveal < 340;
    zoe.mode = 'cheer';
    AU.sfx('whoosh');
    await streamMagic([zoe.x, zoe.y - 24], KIT.stove, 30, { colors: ['#F2B030', '#E8682A', '#FFE38A'] });
    AU.sfx('fwoomp');
    await tween(500, (k) => { this.stoveK = 0.5 + k * 0.7; });
    if (first) await wakeRoom(this, KIT.stove[0], KIT.stove[1], [N]);
    else { FX.flashColor = '#FFE9A8'; tween(600, (k) => { FX.flash = 0.4 * (1 - k); }); burst(KIT.stove[0], KIT.stove[1], 24, { speed: 50, c: '#FFD84A', up: 20, extra: { layer: 'front' } }); await sleep(700); }
    zoe.mode = 'front';
    // the stove makes a dish of the day
    const dish = ['pie', 'cake', 'omelet'][Math.floor(Math.random() * 3)];
    AU.sfx('pop'); burst(140, 152, 14, { speed: 24, c: '#FFF1C8', extra: { layer: 'front' } });
    this.dish = dish; save.flags.dish = dish;
    tween(800, (k) => { this.stoveK = 1.2 - k * 0.7; });
    save.doneQ.food.push(meal.q); markDayDone('food', meal.q); save.active.food = null; save.counts.food = (save.counts.food || 0) + 1;
    save.meals = (save.meals || []).concat([meal]).slice(-60);
    persist(); updateHud();
    if (first) {
      save.flags.kitchenAwake = true; persist();
      AU.sfx('pop');
      for (const [i, s] of this.sps.entries()) { s.visible = true; s.glow = 1; s.x = 30; s.y = 188; s.mode = 'goto'; await sleep(250); s.jump(110); s.goto([206, 240][i], [184, 190][i], 70); }
      bubble(this.sps[0], 'Something smells GOOD!', 1800, true);
      await sleep(1500);
      N.expr = 'star';
      await say('noodle', 'The stove is warm! The kitchen is ALIVE! Chef Noodle is doing a happy dance. With a spoon.');
      this.sps.forEach((s, i) => { s.mode = 'wander'; s.area = [[190, 176, 230, 194], [220, 180, 262, 196]][i]; });
    }
    N.expr = 'happy';
    await say('noodle', { pie: 'The stove made a pie! A pie of bravery.', cake: 'The stove made a cake! A brave-bite cake.', omelet: 'The stove made an omelet! Shaped like a smile.' }[dish]);
    await this.reward();
  },
  async reward() {
    if (this.presents) return;
    const ok = Presents.offer(this, 'kitchen', [[110, 192], [132, 196], [154, 192]]);
    if (!ok) { await say('noodle', 'The kitchen has every present Chef Noodle can think of!'); await say('noodle', 'So here is the best one: a high five. Chef Noodle has no hands. Imagine it.'); return this.afterPresent(); }
    await zoe.walkTo(86, 188); zoe.face(1);
    await say('noodle', cycle(['Presents! Chef Noodle wrapped them in a tortilla. Tap them!', 'Thank-you presents! Tap them!'], 'thx', this.st));
  },
  async onPlaced(item) {
    const N = this.noodle;
    AU.sfx('twinkle');
    if (item === 'aprons') { for (const s of [N, ...this.sps]) { s.jump(100); burst(s.x, s.y - 10, 8, { speed: 20, c: '#E8628A', extra: { layer: 'front' } }); } await say('noodle', 'Aprons for everybody! Now we can spill in style.'); }
    else if (item === 'toaster') await say('noodle', 'A TOASTER! For Chef Noodle\'s one and only recipe! This is the best day of my life.');
    else await Presents.admire(this, item, ['Ooh!', 'Yummy!', 'So fancy!']);
    await this.afterPresent();
  },
  async afterPresent() {
    const N = this.noodle;
    N.expr = 'happy';
    for (const t of leftLines('food')) await say('noodle', t);
    N.expr = 'norm';
  },
  drawBg(g) {
    drawReveal(g, this.drab, this.alive, KIT.stove[0], KIT.stove[1], this.reveal);
    if (this.reveal >= 340) drawStoveGlow(g, this.stoveK, T);
    Presents.drawBg(this, g);
    if (this.reveal >= 340) drawDishOfTheDay(g, this.dish, T);
  },
  drawFg(g) { Presents.drawFg(this, g); },
  update(dt) {
    if (this.reveal < 340 && Math.random() < dt * 1.5) emit({ kind: 'mote', x: 20 + Math.random() * 250, y: 40 + Math.random() * 110, life: 5, c: '#B8B2C4', a: 0.6 });
    if (this.reveal >= 340 && Math.random() < dt * 1.2) emit({ kind: 'smoke', x: 88, y: 30, vy: -6, vx: 1, life: 2, c: '#E8DCCE' });
  },
  start(o = {}) {
    if (!save.flags.chefMet) {
      cut(async () => {
        FX.fade = 1; await fadeIn(500);
        await zoe.walkTo(70, 188); zoe.face(1);
        await narrate('A kitchen! A big one.', 'There is a stove, a pantry, and a table with room for everybody.', 'Everything is grey. Even the cookies. Grey cookies are the saddest cookies.');
        const N = this.noodle;
        N.visible = true; AU.sfx('pop'); N.jump(150);
        for (let i = 0; i < 10; i++) emit({ kind: 'smoke', x: 88 + (Math.random() - 0.5) * 20, y: 130, vy: -20, vx: (Math.random() - 0.5) * 10, life: 1.2, c: '#E8DCCE' });
        await N.goto(110, 184, 60);
        N.expr = 'star';
        await say('noodle', 'A GUEST! In my kitchen!');
        N.expr = 'happy';
        await say('noodle', 'I am Chef Noodle. I know one recipe. It is toast. It is perfect.');
        N.expr = 'sad';
        await say('noodle', 'But my stove went cold when the magic faded. A kitchen with a cold stove is just a room with spoons.');
        N.expr = 'happy';
        await say('noodle', 'Here is the thing. A kitchen gets its magic from BRAVE BITES. Trying new foods. Helping cook. Eating rainbows.');
        await say('noodle', 'And trying counts! Even if you do not like it. Especially if you do not like it. That is the brave part.');
        await say('noodle', 'My stove has three food quests every day. Tap it!');
        save.flags.chefMet = true; persist();
      });
    } else if (save.pending && save.pending.at === 'kitchen') {
      cut(async () => { FX.fade = 1; await fadeIn(500); await say('noodle', 'Your present is still here!'); await this.reward(); });
    } else if (o.tell && save.active.food) {
      cut(async () => { FX.fade = 1; await fadeIn(500); await this.tellFood(true); });
    } else cut(async () => { FX.fade = 1; await fadeIn(500); await maybeResumeQuest(); });
  },
};
function kitchenItemSpots(S) {
  const has = (k) => () => save.items.kitchen.includes(k);
  const line = (key, lines) => async () => { await say('n', cycle(lines, key, S.st)); };
  return [
    { rect: [56, 56, 66, 22], when: has('pots'), stand: [88, 184], act: line('pots', ['Shiny copper pots. You can see yourself in them. Hi, you!', 'You tap a pot. BONNNG. Chef Noodle claps.']) },
    { rect: [182, 94, 16, 20], when: has('cookiejar'), stand: [190, 184], act: async () => { AU.sfx('pop'); await say('n', cycle(['The cookie jar. Free cookies! Well. Pretend cookies.', 'You open the cookie jar. A Sparkee is inside. It says it is just checking.'], 'cj', S.st)); } },
    { rect: [200, 74, 44, 16], when: has('herbs'), stand: [222, 184], act: line('herb', ['Basil, mint, and Steve. Steve is the tall one.', 'You smell the mint. Fresh!']) },
    { rect: [256, 98, 22, 18], when: has('toaster'), stand: [256, 184], act: async () => { AU.sfx('pop'); await say('n', 'POP! Two pieces of toast. Chef Noodle bows.'); } },
    { rect: [96, 72, 22, 14], when: has('kettle'), stand: [96, 184], act: async () => { AU.sfx('twinkle'); await say('n', 'The kettle whistles a happy tune. Wheeee!'); } },
  ];
}
// tap every color you ate
async function openColorMulti(title) {
  const chosen = new Set();
  const grid = h('div', { class: 'cgrid' });
  const done = h('button', { class: 'big', type: 'button', disabled: '' }, 'Those are my colors!');
  for (const [k, label, hex] of COVER_COLORS) {
    const sw = h('i', { class: 'cswatch' }); sw.style.background = hex;
    const b = h('button', { class: 'acell ccell', type: 'button' }, sw, h('span', {}, label), h('b', { class: 'tick', 'aria-hidden': 'true' }, '✓'));
    b.addEventListener('click', () => {
      if (chosen.has(k)) chosen.delete(k); else chosen.add(k);
      AU.sfx(chosen.has(k) ? 'pop' : 'tap'); b.classList.toggle('on', chosen.has(k));
      if (chosen.size) done.removeAttribute('disabled'); else done.setAttribute('disabled', '');
    });
    grid.append(b);
  }
  done.addEventListener('click', () => { if (!chosen.size) return; AU.sfx('sparkle'); Modal.close([...chosen]); });
  return Modal.show(card('picker', h('div', { class: 'ptitle' }, title), h('p', { class: 'psub' }, 'Tap every color on your plate.'), grid, h('div', { class: 'pfoot' }, done)), 'dim');
}

// ===================== The Reading Tower (Pip) =====================
SCENES.tower = {
  song: 'warm', walk: [36, 166, 236, 196], room: 'tower', host: 'pip',
  enter(o = {}) {
    save.lastRoom = 'tower';
    this.bg = bgOf('towerAlive', W, H, paintTower);
    this.st = {}; this.presents = null; this.choosing = false;
    zoe.visible = true;
    if (o.arrive) { zoe.x = 44; zoe.y = 186; zoe.face(1); } else { zoe.x = 140; zoe.y = 186; zoe.face(1); }
    this.pip = new Sparkee({ r: 5, seed: 12, x: 150, y: 172, name: 'pip', acc: 'glasses' });
    this.sps = makeSparkees([{ x: 110, y: 186, seed: 71 }, { x: 196, y: 188, seed: 74 }]);
    this.sps.forEach((s, i) => { s.look = zoe; s.mode = 'wander'; s.speed = 18; s.area = [[90, 176, 130, 194], [170, 178, 220, 196]][i]; });
    this.actors = [zoe, this.pip, ...this.sps];
    applyWearables(this);
    const self = this;
    hints = [{ x: 132, y: 186, strong: true, when: () => !!self.presents && !self.choosing }];
    const line = (key, lines) => async () => { await say('n', cycle(lines, key, self.st)); };
    this.hotspots = [
      { rect: [10, 74, 40, 80], stand: [44, 186], act: () => self.toLibrary() },
      { rect: [56, 52, 56, 100], stand: [84, 184], face: 'front', act: line('shL', ['So many books. More books than you could read in a year. Maybe.', 'One book is upside down. Pip says it is reading itself.']) },
      { rect: [176, 52, 60, 100], stand: [206, 184], face: 'front', act: line('shR', ['Books all the way up. The tower is mostly books, with a little tower around them.', 'You find a book called "How to Be Greg." It is one page long. It says: Be Greg.']) },
      { rect: [114, 44, 60, 96], stand: [144, 184], face: 'front', act: line('win', ['Through the big window you can see the top of the forest!', 'A cloud floats by. It looks like a sandwich. Pip agrees.']) },
      { rect: [236, 20, 52, 134], stand: [232, 188], act: async () => { await say('n', cycle(['Spiral stairs. They go up, and up, and up...', 'The stairs stop at a door near the ceiling. A sign says: COMING SOMEDAY.'], 'stairs', self.st)); } },
      { rect: [120, 2, 48, 42], stand: [144, 184], face: 'front', act: line('sky', ['The skylight. You can see stars. In the daytime! Magic stars are like that.', 'A star winks at you. You wink back.']) },
      ...towerItemSpots(self),
      { hit: (x, y) => Math.hypot(self.pip.x - x, self.pip.y - 5 - y) < 10, when: () => !self.presents, stand: () => [clamp(self.pip.x - 20, 40, 230), clamp(self.pip.y, 172, 194)], act: () => self.talkPip() },
      { hit: (x, y) => self.sps.some((s) => Math.hypot(s.x - x, s.y - 5 - y) < 9), when: () => !self.presents, act: async () => {
        const s = self.sps.slice().sort((a, b) => Math.hypot(a.x - self._tapX, a.y - self._tapY) - Math.hypot(b.x - self._tapX, b.y - self._tapY))[0];
        s.jump(60); bubble(s, cycle(['(whispering) Hi!', '(whispering) I am reading a book about whispering.', '(whispering) This is my favorite room.', '(whispering) Pip says I am too loud. I am not.'], 'spk', self.st), 1700, true);
        await sleep(400);
      } },
      Presents.hotspot(self),
    ];
  },
  async toLibrary() {
    if (this.presents) { await say('pip', 'WAIT. Your present. (Sorry. Wait. Your present.)'); return; }
    AU.sfx('creak');
    await fadeOut(400);
    goScene('library', { from: 'tower' });
  },
  async talkPip() {
    const P = this.pip;
    P.expr = 'happy';
    await say('pip', cycle(['(whispering) Welcome to the Reading Tower. I am VERY GOOD AT BEING QUIET.', 'Every story you read now sends a present up here. Pip is in charge of unwrapping. Pip is very careful.', 'Pip has read every book in this tower. Twice. Except the upside-down one.', 'Greg comes up here to nap. He says he is "reading with his eyes closed."'], 'pip', this.st));
    P.expr = 'norm';
  },
  async onPlaced(item, last) {
    const P = this.pip;
    AU.sfx('twinkle');
    if (item === 'glasses') { for (const s of [P, ...this.sps]) { s.jump(90); burst(s.x, s.y - 10, 6, { speed: 18, c: '#9ACDE0', extra: { layer: 'front' } }); } await say('pip', 'Glasses for everybody! Now we all look extremely smart. We are not. But we look it.'); }
    else await Presents.admire(this, item, ['Ooh!', '(whispering) Wow!', 'So fancy!']);
    if (last === false) return;
    P.expr = 'happy';
    for (const t of leftLines('read')) await say('pip', t);
    P.expr = 'norm';
  },
  drawBg(g) {
    g.drawImage(this.bg, 0, 0);
    D.glow(g, 144, 22, 30, '#9AA8D8', 0.12, 3);
    Presents.drawBg(this, g);
  },
  drawFg(g) { Presents.drawFg(this, g); },
  update(dt) {
    if (Math.random() < dt * 1.5) emit({ kind: 'mote', x: 120 + Math.random() * 50, y: 50 + Math.random() * 80, vy: 2, life: 4, c: '#FFF1C8', a: 0.8 });
  },
  start(o = {}) {
    if (o.placing) {
      cut(async () => {
        FX.fade = 1; await fadeIn(500);
        const at = ROOM_ITEMS.tower[o.placing].at;
        AU.sfx('poof'); burst(at[0], at[1] - 6, 26, { speed: 36, c: '#FFE38A', extra: { layer: 'front' } });
        applyWearables(this);
        await this.onPlaced(o.placing, true);
      });
    } else if (!save.flags.towerSeen) {
      cut(async () => {
        FX.fade = 1; await fadeIn(700);
        await zoe.walkTo(96, 188); zoe.face(1);
        await narrate('Up the secret stairs...', 'A tower! Full of books. So many more books.', 'There is a big window, a skylight full of stars, and stairs that go even higher.');
        const P = this.pip; P.expr = 'wide';
        await say('pip', '(whispering) Oh! Hello!');
        P.expr = 'happy';
        await say('pip', 'Welcome to the Reading Tower. Library Level 2. I am Pip. I am the librarian.');
        await say('pip', 'I am VERY GOOD AT BEING QUIET.');
        await say('pip', 'From now on, every story you read sends a present up here. The tower has lots of room.');
        await say('pip', 'And to say thank you for building it... a present right now!');
        save.flags.towerSeen = true; persist();
        Presents.offer(this, 'tower', [[110, 192], [132, 196], [154, 192]]);
        await zoe.walkTo(86, 190); zoe.face(1);
      });
    } else if (save.pending && save.pending.at === 'tower') {
      cut(async () => { FX.fade = 1; await fadeIn(500); await say('pip', '(whispering) Your present is still here.'); Presents.offer(this, 'tower', [[110, 192], [132, 196], [154, 192]]); });
    } else cut(async () => { FX.fade = 1; await fadeIn(500); await maybeResumeQuest(); });
  },
};
function towerItemSpots(S) {
  const has = (k) => () => save.items.tower.includes(k);
  const line = (key, lines) => async () => { await say('n', cycle(lines, key, S.st)); };
  return [
    { rect: [52, 118, 62, 50], when: has('hammock'), stand: [82, 184], act: line('ham', ['The hammock swings a little. A Sparkee is asleep in it. Probably.', 'Swing, swing. Reading in a hammock is like reading on a cloud.']) },
    { rect: [194, 126, 38, 50], when: has('fishtank'), stand: [212, 188], act: line('fish', ['Sir Bubbles the fish blows a bubble at you. That means hello.', 'Sir Bubbles swims in a circle. He is very busy.']) },
    { rect: [68, 80, 32, 42], when: has('eggchair'), stand: [84, 184], act: line('egg', ['The egg chair. It is an egg. It is a chair. It is both.', 'You sit in the egg chair for a second. It feels like being a very cozy chick.']) },
    { rect: [236, 150, 40, 40], when: has('gramophone'), stand: [236, 192], act: async () => { AU.sfx('notes'); await say('n', 'The music player plays its one song. It is a very good song.'); } },
    { rect: [58, 150, 24, 40], when: has('rocket'), stand: [84, 190], act: line('rock', ['The rocket lamp glows. Pip says glowing is basically flying.', '3... 2... 1... It stays right there. Good rocket.']) },
  ];
}

// ===================== Walking home =====================
// the forest's little door leads back down the stairs to the hallway (and back again)
function patchWalkHome() {
  const F = SCENES.forest, St = SCENES.stairs, Hl = SCENES.hall;
  const fEnter = F.enter, fStart = F.start;
  F.enter = function (o = {}) {
    fEnter.call(this, o);
    if (save.stage === 'done') save.lastRoom = 'forest';
    if (o.fromStairs) { zoe.x = 18; zoe.y = 182; zoe.face(1); }
    const home = this.hotspots.find((x) => x.rect && x.rect[0] === 0 && x.rect[1] === 140);
    if (home) home.act = async () => {
      if (save.stage !== 'done') { await say('n', 'The way home. It will be right here when you need it.'); return; }
      const c = await ask('n', 'The little door back home. Go home?', ['Go home!', 'Stay here.']);
      if (c === 1) return;
      AU.sfx('creak');
      await zoe.walkTo(18, 178);
      await fadeOut(500);
      goScene('stairs', { fromTop: true });
    };
  };
  F.start = function (o = {}) {
    if (o.fromStairs) { cut(async () => { FX.fade = 1; await fadeIn(500); await zoe.walkTo(60, 184); await maybeResumeQuest(); }); return; }
    if (save.stage === 'done') { cut(async () => { FX.fade = 1; await fadeIn(500); await maybeResumeQuest(); }); return; }
    return fStart.call(this, o);
  };
  const sEnter = St.enter, sStart = St.start;
  St.enter = function (o = {}) {
    sEnter.call(this, o);
    const self = this;
    if (o.fromTop || o.fromHall === false) {
      const top = STAIR.path[STAIR.path.length - 1];
      zoe.x = top[0]; zoe.y = top[1]; zoe.face(-1);
      this.atTop = true; this.topOpen = 1; cam.y = clamp(zoe.y - 130, 40, 240);
    }
    if (save.stage === 'done') {
      // going down: tap the giant door at the bottom
      const bottom = this.hotspots.find((x) => x.rect && x.rect[0] === 6 && x.rect[1] === 296);
      bottom.act = async () => {
        if (self.atTop) { await self.walkDown(); }
        await fadeOut(500);
        goScene('hall', { fromAttic: true });
      };
      bottom.stand = null;
      this.hotspots.push({ rect: [80, 120, 200, 80], when: () => self.atTop, act: async () => { await self.walkDown(); } });
      const topDoor = this.hotspots.find((x) => x.rect && x.rect[0] === 228);
      topDoor.act = async () => { AU.sfx('creak'); FX.flashColor = '#F8F4C8'; await tween(600, (k) => { FX.flash = k; }); goScene('forest', { fromStairs: true }); };
      hints = [{ x: 104, y: 394, strong: true, when: () => !self.atTop }, { x: 252, y: 150, strong: true, when: () => self.atTop }, { x: 42, y: 350, when: () => !self.atTop }];
    }
  };
  St.onTapEmpty = function () { return !!this.atTop; };
  St.walkDown = async function () {
    zoe.speed = 50;
    await zoe.walkPath(STAIR.path.slice().reverse().concat([[50, 406]]));
    zoe.speed = 58; this.atTop = false;
  };
  St.start = function (o = {}) {
    if (o.fromTop) { cut(async () => { FX.fade = 1; await fadeIn(500); await this.walkDown(); await say('n', 'Down, down, down the spiral stairs. Tap the big door to go home.'); }); return; }
    if (save.stage === 'done') { cut(async () => { FX.flashColor = '#FFE9A8'; FX.flash = 1; await tween(700, (k) => { FX.flash = 1 - k; }); }); return; }
    return sStart.call(this, o);
  };
  const hEnter = Hl.enter, hStart = Hl.start, hGoIn = Hl.goIn;
  Hl.enter = function (o = {}) {
    hEnter.call(this, o);
    if (save.stage === 'done') {
      save.lastRoom = 'hall';
      this.doorOpen = 1; this.st.door = 3;
      if (o.fromAttic) { zoe.x = 156; zoe.y = 184; zoe.face('front'); }
      hints = [{ x: 170, y: 141, strong: true }];
      this.visit = (save.flags.homeVisits = (save.flags.homeVisits || 0) + 1) % 4;
      persist();
    }
  };
  Hl.goIn = async function () {
    if (save.stage !== 'done') return hGoIn.call(this);
    const c = await ask('n', 'Back to the Secret Attic?', ['Go in!', 'Stay home.']);
    if (c === 1) return;
    AU.sfx('whoosh');
    FX.zoom = { cx: 170, cy: 146, k: 1 };
    FX.flashColor = '#FFE9A8';
    await tween(1100, (k) => { FX.zoom.k = 1 + Math.pow(k, 2.2) * 16; FX.flash = clamp((k - 0.45) / 0.55, 0, 1); });
    FX.zoom = null;
    goScene('stairs', {});
  };
  Hl.start = function (o = {}) {
    if (save.stage !== 'done') return hStart.call(this, o);
    cut(async () => {
      FX.fade = 1; await fadeIn(600);
      // something small is different each time you come home
      const v = this.visit;
      if (v === 1) {
        this.peeker = new Sparkee({ r: 4, seed: 33, x: 174, y: 154 }); this.peeker.look = zoe;
        this.peek = 1;
        AU.sfx('pop');
        await sleep(500);
        await say('sp', 'Psst! {name}! Just checking you got home okay. Okay, bye!', { actor: this.peeker });
        this.peek = 0;
      } else if (v === 2) {
        this.note = true;
        await narrate('There is a tiny note on the floor.', 'It says: "Dear {name}. Greg was here. Greg says hi. Gregory says hi too. Love, Greg."');
      } else if (v === 3) {
        this.agnes = true;
        await say('n', 'Someone drew a tiny mustache on Great-Great-Aunt Agnes. It looks a lot like Gregory.');
      } else {
        this.trail = true;
        await say('n', 'A trail of tiny glowing footprints leads to the little door.');
      }
      await maybeResumeQuest();
    });
  };
  const hDraw = Hl.drawBg;
  Hl.drawBg = function (g) {
    hDraw.call(this, g);
    if (save.stage !== 'done') return;
    if (this.agnes) drawMustache(g, 85, 57, true);
    if (this.note) { D.r(g, 196, 186, 8, 6, '#F4EBD9'); D.r(g, 197, 188, 5, 1, '#8A7A60'); D.r(g, 197, 190, 4, 1, '#8A7A60'); }
    if (this.trail) for (let i = 0; i < 6; i++) { const x = 100 + i * 11, y = 186 - i * 6; D.r(g, x, y, 2, 1, '#FFE38A'); D.r(g, x + 3, y - 2, 2, 1, '#FFE38A'); }
  };
  const hFg = Hl.drawFg;
  Hl.drawFg = function (g) {
    if (hFg) hFg.call(this, g);
    if (this.peek) { const s = this.peeker || (this.peeker = new Sparkee({ r: 4, seed: 33, x: 174, y: 154 })); s.draw(g); }
  };
}
patchWalkHome();
