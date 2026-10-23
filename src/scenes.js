// ===================== Scenes =====================
const BG = {};
function bgOf(name, w, h, fn) { if (!BG[name]) { const [c, g] = mk(w, h); fn(g); BG[name] = c; } return BG[name]; }
const cycle = (arr, key, st) => { const i = st[key] || 0; st[key] = i + 1; return arr[i % arr.length]; };
function speakerFor(a) { return a; }

// ---------------- Title ----------------
SCENES.title = {
  song: null, interactive: false,
  enter() { this.bg = bgOf('title', W, H, paintTitle); this.actors = []; this.hotspots = []; },
  drawBg(g) {
    g.drawImage(this.bg, 0, 0);
    const p = 0.75 + 0.25 * Math.sin(T * 1.6);
    D.glow(g, 146, 94, 22, '#FFB840', 0.3 * p, 4);
    const r = rand(3);
    for (let i = 0; i < 14; i++) { const x = r() * W, y = r() * 110, ph = r() * 6; if (Math.sin(T * 1.5 + ph) > 0.85) D.twinkle(g, x, y, 1, '#FFF1C8'); }
  },
  update(dt) {
    if (Math.random() < dt * 3) emit({ kind: 'mote', x: 140 + Math.random() * 12, y: 92, vy: -6 - Math.random() * 6, vx: (Math.random() - 0.5) * 4, life: 4 + Math.random() * 3, c: '#FFE38A', a: 1 });
    if (Math.random() < dt * 1.2) emit({ kind: 'firefly', x: Math.random() * W, y: 150 + Math.random() * 30, vx: (Math.random() - 0.5) * 6, vy: -2, life: 5, c: '#E8F070' });
  },
};

// ---------------- Hallway ----------------
SCENES.hall = {
  song: 'night', walk: [12, 168, 276, 194],
  enter() {
    this.bg = bgOf('hall', W, H, paintHall);
    zoe.visible = true; zoe.x = 96; zoe.y = 182; zoe.face('front');
    this.actors = [zoe];
    this.st = { door: 0 }; this.doorOpen = 0; this.shake = 0; this.lamp = true;
    const self = this;
    hints = [
      { x: 170, y: 141, strong: true },
      { x: 216, y: 52, off: 1.2, when: () => !save.seenMirror },
    ];
    this.hotspots = [
      { rect: [12, 16, 36, 142], stand: [50, 182], act: async () => { await say('n', cycle(['Tick. Tock. Tick. Tock.', "It's a clock. It doesn't know any other words.", "It's almost midnight. Very spooky. Very exciting."], 'clock', self.st)); } },
      { rect: [62, 26, 46, 68], stand: [86, 182], act: async () => { await say('n', cycle(['Great-Great-Aunt Agnes.', 'She looks like she has never had a snack in her life.', 'Her eyes follow you around the room. Rude.'], 'agnes', self.st)); } },
      { rect: [116, 86, 34, 72], stand: [138, 184], act: async () => {
        self.lamp = !self.lamp; AU.sfx('click');
        await say('n', self.lamp ? "Click. The lamp's back on. It's doing a great job." : 'Click. Very dark. Very dramatic.');
      } },
      { rect: [196, 46, 40, 52], stand: [214, 184], face: 'front', act: async () => {
        await say('n', save.seenMirror ? cycle(['Still you. Still great.', 'Looking good, adventurer.'], 'mirror', self.st) : "Hey, it's you! Probably.");
        await openMirror();
        if (!save.seenMirror) { save.seenMirror = true; persist(); await say('n', 'Perfect. Ready for anything.'); }
      } },
      { rect: [238, 14, 50, 96], stand: [252, 184], act: async () => { await say('n', cycle(['The moon is out. It looks like a big glowing button.', 'You tap the window. The moon does not respond.', 'Somewhere out there, a dog is barking at a leaf.'], 'win', self.st)); } },
      { rect: [158, 128, 26, 26], stand: [156, 184], act: () => self.door() },
    ];
  },
  async door() {
    zoe.dir = 1; zoe.mode = 'crouch';
    const st = this.st;
    if (st.door === 0) {
      await narrate('A tiny door. In the wall.', 'Has that always been there?', "It's way too small for a person. You'd have to be the size of a sandwich.");
      st.door = 1;
    } else if (st.door === 1) {
      await say('n', 'You knock.');
      AU.sfx('knock'); this.shake = 0.15;
      await sleep(1200);
      AU.sfx('knockFar'); this.shake = 0.45;
      await sleep(800);
      await narrate('Something knocked back!', "That's either magic or a very polite mouse.");
      st.door = 2;
    } else if (st.door === 2) {
      AU.sfx('creak');
      await tween(1500, (k) => { this.doorOpen = ease(k); });
      AU.sfx('sparkle');
      burst(170, 146, 18, { speed: 30, c: '#FFE38A', up: 10 });
      await narrate('The door opened all by itself.', 'There is a warm light inside. It smells like cookies and old books.');
      st.door = 3;
      await this.goIn();
    } else await this.goIn();
    if (zoe.mode === 'crouch') zoe.mode = 'side';
  },
  async goIn() {
    const c = await ask('n', 'Go in?', ['Go in!', 'Not yet.']);
    if (c === 1) { await say('n', 'The door waits. Doors are good at waiting.'); return; }
    await say('n', "You squeeze through. It's a tight fit, and then... it isn't.");
    save.stage = 'stairs'; persist();
    AU.sfx('whoosh');
    FX.zoom = { cx: 170, cy: 146, k: 1 };
    FX.flashColor = '#FFE9A8';
    await tween(1300, (k) => { FX.zoom.k = 1 + Math.pow(k, 2.2) * 16; FX.flash = clamp((k - 0.45) / 0.55, 0, 1); });
    FX.zoom = null;
    goScene('stairs', { arrive: true });
  },
  drawBg(g) {
    g.drawImage(this.bg, 0, 0);
    // pendulum
    const a = Math.sin(T * 2.6) * 0.1, px = 30, py = 72;
    const bx = px + Math.sin(a) * 50, by = py + Math.cos(a) * 50;
    D.line(g, px, py, bx, by, '#9A6A20'); D.disc(g, bx, by, 4, '#B8862E'); D.disc(g, bx - 1, by - 1, 2, '#E8B85A');
    // Agnes' eyes follow Zoe
    const lx = zoe.x < 70 ? -1 : zoe.x > 100 ? 1 : 0;
    D.r(g, 81, 53, 3, 1, '#ECCDB0'); D.r(g, 87, 53, 3, 1, '#ECCDB0');
    D.p(g, 82 + lx, 53, C.ink); D.p(g, 88 + lx, 53, C.ink);
    // lamp shade + light
    const shade = this.lamp ? '#F2B0BC' : '#7A4A5A', stripe = this.lamp ? '#E890A4' : '#5E3846';
    D.poly(g, [[124, 88], [142, 88], [148, 106], [118, 106]], shade);
    for (let x = 122; x < 146; x += 4) D.line(g, x + 2, 89, x, 105, stripe);
    D.r(g, 118, 105, 30, 2, this.lamp ? '#DCA438' : '#7A5A30');
    for (let x = 119; x < 148; x += 3) D.p(g, x, 107, this.lamp ? '#DCA438' : '#7A5A30');
    if (this.lamp) {
      D.glow(g, 133, 104, 70, '#FFA850', 0.11, 6);
      D.glow(g, 133, 166, 46, '#FFB060', 0.08, 3);
    } else {
      g.globalAlpha = 0.35; D.r(g, 0, 0, W, H, '#0E0814'); g.globalAlpha = 1;
    }
    // moonlight
    g.globalAlpha = 0.07 + 0.02 * Math.sin(T * 0.7); D.poly(g, [[246, 108], [282, 108], [288, 196], [214, 196]], '#C8D4FF'); g.globalAlpha = 1;
    // tiny door
    if (this.shake > 0) { g.save(); g.translate(Math.round(Math.sin(T * 60) * 1), 0); }
    drawTinyDoor(g, this.doorOpen, true);
    if (this.shake > 0) g.restore();
  },
  update(dt) {
    if (this.shake > 0) this.shake -= dt;
    if (this.lamp && Math.random() < dt * 1.5) emit({ kind: 'mote', x: 110 + Math.random() * 50, y: 100 + Math.random() * 50, vy: -1, life: 4, c: '#FFE0A0', a: 0.7 });
    if (this.doorOpen > 0.5 && Math.random() < dt * 4) emit({ kind: 'mote', x: 166 + Math.random() * 8, y: 140 + Math.random() * 10, vx: -2 - Math.random() * 4, vy: -3, life: 2.5, c: '#FFE38A', a: 1 });
  },
  start() {
    if (save.stage === 'new') {
      cut(async () => {
        FX.fade = 1; await fadeIn(1000);
        await narrate("It's the middle of the night.", 'The old house is creaking. Old houses love to creak.', "You're supposed to be asleep. But you heard a noise.");
        AU.sfx('knockFar'); this.shake = 0.5;
        await sleep(1000);
        await say('n', '...There it is again.');
        await say('n', 'Tap things to look at them. Tap the floor to walk.');
        if (!save.seenMirror) await say('n', "(That's a mirror over there. Adventures go better with good hair.)");
        save.stage = 'hallway'; persist();
      });
    } else { FX.fade = 1; fadeIn(600); }
  },
};

// ---------------- Stairs ----------------
SCENES.stairs = {
  song: 'stairs', walk: [30, 402, 92, 414], worldH: 440,
  enter() {
    this.bg = bgOf('stairs', W, 440, paintStairs);
    zoe.visible = true; zoe.x = 50; zoe.y = 406; zoe.face(1);
    this.actors = [zoe];
    cam.y = 240; this.camT = 240;
    this.st = {}; this.atTop = false; this.topOpen = 0; this.eyesT = 0;
    const self = this;
    hints = [{ x: 104, y: 394, strong: true, when: () => !self.atTop }, { x: 252, y: 150, strong: true, when: () => self.atTop }];
    this.hotspots = [
      { rect: [6, 296, 72, 108], stand: [56, 408], act: async () => { await say('n', cycle(['The tiny door. From this side, it is ENORMOUS.', 'Bigger on the inside. Your house is full of surprises.'], 'door', self.st)); } },
      { rect: [152, 282, 18, 22], when: () => !self.atTop, act: async () => { self.eyesT = 1.2; await say('n', cycle(['A pair of eyes blinks at you from the knothole.', "You blink back. It's a blinking contest.", 'You lose. The eyes are very good at this.'], 'eyes', self.st)); } },
      { rect: [80, 330, 160, 80], when: () => !self.atTop, act: () => self.climb() },
      { rect: [228, 126, 50, 50], when: () => self.atTop, stand: [226, 174], act: () => self.openTop() },
      { rect: [186, 124, 40, 34], when: () => self.atTop, stand: [210, 174], act: async () => { await narrate('SECRET ATTIC, says the sign.', 'Underneath, in tiny letters: (Not you. You\'re fine.)'); } },
    ];
  },
  async climb() {
    busy = true;
    zoe.speed = 46;
    await zoe.walkPath(STAIR.path);
    zoe.speed = 58;
    this.atTop = true; zoe.face(1);
    await narrate("There's a sign on the wall.", 'It says: SECRET ATTIC.', 'Someone scribbled underneath it, in very small letters:', "(Not you. You're fine.)");
    busy = false;
  },
  async openTop() {
    AU.sfx('creak');
    await tween(900, (k) => { this.topOpen = k; });
    await narrate('Bright light pours out.', 'It smells like... trees?');
    save.stage = 'forest'; persist();
    FX.flashColor = '#F8F4C8';
    await tween(900, (k) => { FX.flash = k; });
    goScene('forest');
  },
  drawBg(g) {
    g.drawImage(this.bg, 0, 0);
    for (const [x, y, s] of [[150, 362, 1], [40, 282, 2], [262, 214, 3], [120, 120, 4], [210, 400, 5]]) drawLantern(g, x, y, T, s);
    for (const [x, y] of [[34, 360], [196, 262], [112, 120], [272, 294]]) D.glow(g, x, y, 14, '#C890E0', 0.12 + 0.05 * Math.sin(T * 2 + x), 3);
    // knothole eyes
    const blink = (T % 4) < 0.15 || this.eyesT > 0;
    if (!blink) { D.r(g, 157, 290, 2, 2, '#F2E070'); D.r(g, 162, 290, 2, 2, '#F2E070'); D.p(g, 157, 290, C.ink); D.p(g, 162, 290, C.ink); }
    else { D.r(g, 157, 291, 2, 1, '#8A7A30'); D.r(g, 162, 291, 2, 1, '#8A7A30'); }
    // light leaking around the giant door
    const p = 0.6 + 0.4 * Math.sin(T * 2);
    g.globalAlpha = 0.5 * p; D.r(g, 6, 402, 72, 2, '#FFE9A8'); g.globalAlpha = 1;
    D.glow(g, 42, 400, 26, '#FFC060', 0.12 * p, 3);
    // top door
    if (this.topOpen > 0) {
      D.disc(g, 252, 152, Math.round(18 * this.topOpen), '#F8F4C8');
      D.glow(g, 252, 152, 50, '#F0F0A0', 0.4 * this.topOpen, 4);
    } else {
      D.ring(g, 252, 152, 18, '#F8E8A0');
      D.glow(g, 252, 152, 24, '#F0E890', 0.12 + 0.06 * Math.sin(T * 2), 3);
    }
  },
  update(dt) {
    if (this.eyesT > 0) this.eyesT -= dt;
    const target = clamp(zoe.y - 130, 40, 240);
    cam.y += (target - cam.y) * Math.min(1, dt * 3);
    if (Math.random() < dt * 3) emit({ kind: 'firefly', x: 20 + Math.random() * 250, y: cam.y + Math.random() * H, vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 4, life: 6, c: '#E8F070' });
  },
  start(o) {
    cut(async () => {
      FX.flashColor = '#FFE9A8'; FX.flash = 1;
      await tween(900, (k) => { FX.flash = 1 - k; });
      if (o && o.arrive) await narrate('Somehow, the door is much bigger on this side.', "That's not how doors work. But okay!", 'Stairs. They go up. That is usually what stairs do.');
    });
  },
};

// ---------------- Forest (the Secret Attic) ----------------
function makeSparkees(defs) { return defs.map((d, i) => new Sparkee(Object.assign({ seed: 10 + i * 7, r: 5 }, d))); }
SCENES.forest = {
  song: 'forest', walk: [30, 168, 266, 194],
  enter() {
    const restored = save.stage === 'done';
    this.bg = bgOf(restored ? 'forestR' : 'forest', W, H, (g) => paintForest(g, restored));
    this.fernsL = this.fernsL || (() => { const [c, g] = mk(W, H); const r = rand(3); paintFerns(g, r, 2, 168, false); paintFerns(g, r, 286, 170, true); return c; })();
    zoe.visible = true; zoe.face(1);
    this.st = {}; this.met = ['met', 'library', 'quest', 'reward', 'done'].includes(save.stage); this.meetReady = false;
    const area = [84, 166, 250, 194];
    this.greg = new Sparkee({ r: 7, seed: 99, greg: true, x: 200, y: 184, mode: 'wander', area, speed: 26, name: 'greg' });
    this.sps = makeSparkees([{ x: 110, y: 176 }, { x: 140, y: 190 }, { x: 170, y: 172 }, { x: 228, y: 178 }, { x: 96, y: 188 }, { x: 246, y: 190 }, { x: 186, y: 192 }]);
    for (const s of this.sps) { s.mode = 'wander'; s.area = area; s.speed = 30 + Math.random() * 16; s.glow = 0.75; }
    this.greg.glow = 0.75;
    if (this.met && save.stage !== 'done') { this.greg.visible = false; this.sps.forEach((s) => (s.visible = false)); }
    if (save.stage === 'done') { this.sps = this.sps.slice(0, 3); this.greg.visible = false; this.sps.forEach((s) => (s.glow = 1)); }
    this.actors = [zoe, this.greg, ...this.sps];
    if (this.met) { zoe.x = 150; zoe.y = 184; } else { zoe.x = 18; zoe.y = 178; }
    const self = this;
    hints = [
      { x: 156, y: 140, strong: true, when: () => self.met },
      { x: 160, y: 168, strong: true, when: () => self.meetReady },
    ];
    this.hotspots = [
      { rect: [0, 140, 30, 40], act: async () => { await say('n', cycle(['The way home. It will be right here when you need it.', 'The little door is still glowing. Good door.'], 'home', self.st)); } },
      { rect: [116, 4, 56, 22], act: async () => { await say('n', cycle(["Way up there is the attic ceiling. That bright window is the sun. Or a lamp. Probably the sun.", 'A forest. Inside an attic. Inside your house. You live in a very interesting house.'], 'sky', self.st)); } },
      { rect: [112, 114, 36, 16], stand: [130, 184], act: async () => { await say('n', cycle(['SPARKEE, says the sign.', 'They ran out of room for the S.'], 'sign', self.st)); } },
      { rect: [54, 164, 12, 10], act: async () => { await say('n', cycle(["A mushroom. It's minding its own business.", 'The mushroom would like some privacy.'], 'shroom', self.st)); } },
      { rect: [80, 14, 128, 82], when: () => self.met, stand: [154, 184], act: async () => { await say('n', save.stage === 'done' ? cycle(['The treehouse windows are glowing now. You did that.', 'Smoke is curling out of the crooked chimney. Cozy.'], 'house', self.st) : cycle(['The Sparkee treehouse. The windows are dark.', 'It looks like it really needs a story.'], 'house', self.st)); } },
      { rect: [146, 98, 20, 74], when: () => self.met, stand: [154, 182], act: () => self.climb() },
      { hit: (x, y) => !self.met && [self.greg, ...self.sps].some((s) => Math.hypot(s.x - x, s.y - 4 - y) < 10), act: () => self.meet() },
    ];
  },
  drawBg(g) {
    g.drawImage(this.bg, 0, 0);
    // light shafts
    g.save(); g.globalCompositeOperation = 'lighter';
    for (const [x0, x1, w, ph] of [[134, 60, 14, 0], [146, 150, 10, 2], [156, 236, 16, 4]]) {
      g.globalAlpha = 0.07 + 0.03 * Math.sin(T * 0.8 + ph);
      D.poly(g, [[x0, 18], [x0 + w * 0.4, 18], [x1 + w, 190], [x1, 190]], '#FFF0B0');
    }
    g.restore();
    drawLadder(g, 149, 101, 170, 1.3);
    if (save.stage === 'done') {
      D.glow(g, 112, 66, 16, '#FFC060', 0.3, 3); D.glow(g, 175, 67, 16, '#FFC060', 0.3, 3);
      drawLantern(g, 262, 72, T, 2);
    }
  },
  drawFg(g) { g.drawImage(this.fernsL, 0, 0); },
  update(dt) {
    if (Math.random() < dt * 0.9) emit({ kind: 'leaf', x: Math.random() * W, y: -2, vy: 8 + Math.random() * 6, life: 18, c: ['#C97034', '#DCA438', '#96490D', '#A1AF7C'][Math.floor(Math.random() * 4)] });
    if (Math.random() < dt * 4) emit({ kind: 'mote', x: 60 + Math.random() * 180, y: 30 + Math.random() * 150, life: 4, c: '#FFF6C8', a: 0.9 });
    if (save.stage === 'done' && Math.random() < dt * 2) emit({ kind: 'smoke', x: 179, y: 10, vy: -6, vx: 2, life: 3, c: '#E8DCCE' });
    for (const s of [this.greg, ...this.sps]) if (s.mode !== 'wander') s.look = zoe;
    if (this.meetReady && zoe.x > 74 && !isBusy()) this.meet();
  },
  async meet() {
    if (this.meeting) return;
    this.meeting = true; this.meetReady = false;
    return cut(() => this._meet());
  },
  async _meet() {
    zoe.target = null; zoe.onArrive = null; zoe.face(1);
    const all = [this.greg, ...this.sps];
    for (const s of all) { s.mode = 'idle'; s.tx = s.ty = null; s.look = zoe; }
    await sleep(250);
    AU.sfx('surprise');
    all.forEach((s, i) => setTimeout(() => { s.expr = 'wide'; s.emote = 1.4; s.jump(60); }, i * 70));
    await sleep(1300);
    const first = this.sps.slice().sort((a, b) => Math.abs(a.x - zoe.x) - Math.abs(b.x - zoe.x))[0];
    bubble(first, 'Hey! Visitor!', 1600, true);
    first.jump(90);
    await sleep(1600);
    AU.sfx('cheer');
    all.forEach((s) => { s.expr = 'happy'; s.arms = 'up'; s.hop(true); });
    bubble(this.sps[1], 'HOORAY!', 1500, true); setTimeout(() => bubble(this.sps[4], 'Hooray!', 1300), 300); setTimeout(() => bubble(this.sps[5], 'Yay!!', 1200), 600);
    await sleep(1900);
    all.forEach((s) => { s.hop(false); s.arms = 'down'; });
    // gather
    const gx = zoe.x;
    const spots = [[gx + 52, 176], [gx + 62, 188], [gx + 74, 172], [gx + 84, 184], [gx + 96, 192], [gx + 100, 174], [gx + 112, 186]];
    this.sps.forEach((s, i) => s.goto(spots[i][0], spots[i][1], 50));
    await this.greg.goto(gx + 30, zoe.y + 1, 40);
    all.forEach((s) => { s.expr = 'norm'; s.look = zoe; });
    await sleep(400);
    await this.talk();
  },
  async talk() {
    const G = this.greg, S = this.sps;
    await say('greg', 'Welcome, Visitor!');
    await say('greg', 'We are the Sparkees.');
    await say('greg', 'I am the one they call Greg.');
    G.expr = 'happy';
    await say('greg', "That's right. Greg.");
    G.expr = 'norm';
    await say('sp', "He's Greg.", { actor: S[0] });
    const n = await ask('greg', 'And what do they call you?', ['Zoe!', 'Visitor is fine.']);
    save.name = n === 0 ? 'Zoe' : 'Visitor'; persist();
    if (n === 0) { G.expr = 'happy'; await say('greg', 'Zoe! What a great name.'); await say('greg', 'Almost as good as Greg.'); }
    else { await say('greg', 'Visitor it is. Very mysterious.'); await say('greg', 'Greg likes mysterious.'); }
    G.expr = 'sad';
    await say('greg', '{name}, we have a problem.');
    await say('greg', 'Our magic has faded.');
    [...S, G].forEach((s) => tween(1200, (k) => { s.glow = 0.75 * (1 - k * 0.7); }));
    await say('sp', 'Fizzle.', { actor: S[2] });
    await say('greg', 'Our treehouse used to glow like a lantern. Now it is just... a house. In a tree.');
    G.expr = 'norm';
    await say('greg', 'But magic can come back...');
    G.expr = 'wide';
    await say('greg', '...with tales from the human world!');
    S.forEach((s) => { s.expr = 'wide'; });
    await say('all', 'Ooooooh.');
    S.forEach((s) => { s.expr = 'norm'; });
    G.expr = 'norm';
    let opts = ["I'll read to you!", "What's a tale?", 'Is your name really Greg?'];
    for (;;) {
      const c = await ask('greg', '{name}... could you read to us?', opts);
      const pick = opts[c];
      if (pick === "What's a tale?") {
        await say('greg', 'A tale is a story! Like in a book.');
        await say('greg', 'Books are the boxes that stories come in.');
        opts = opts.filter((o) => o !== pick);
      } else if (pick === 'Is your name really Greg?') {
        await say('greg', 'Yes.'); await say('greg', 'Greg is extremely my real name.'); await say('sp', 'His name is Greg.', { actor: S[3] });
        opts = opts.filter((o) => o !== pick);
      } else break;
    }
    AU.sfx('cheer');
    [...S, G].forEach((s) => { s.expr = 'happy'; s.arms = 'up'; s.hop(true); });
    bubble(S[0], 'HOORAY!', 1500, true); setTimeout(() => bubble(S[3], 'She said yes!', 1400), 350); setTimeout(() => bubble(S[6], 'Yaaay!', 1200), 700);
    await sleep(1800);
    [...S, G].forEach((s) => { s.hop(false); s.arms = 'down'; });
    await say('greg', 'To the library! It is up in the treehouse.');
    await say('greg', 'Follow me. Mind the ladder. It is mostly rope.');
    save.stage = 'met'; persist();
    this.met = true;
    // climb up
    const climbers = [G, ...S];
    climbers.forEach((s, i) => {
      setTimeout(async () => {
        s.mode = 'goto';
        await s.goto(154 + (Math.random() - 0.5) * 4, 172, 55);
        s.look = null;
        await s.goto(154, 104, 40);
        await s.goto(144, 98, 40);
        s.visible = false;
      }, i * 420);
    });
    await sleep(900);
  },
  async climb() {
    zoe.face(1);
    AU.sfx('climb');
    zoe.mode = 'side';
    await tween(900, (k) => { zoe.y = 182 - k * 70; });
    await irisOut(154, 100, 600);
    zoe.y = 182;
    goScene('library', { arrive: true });
    await irisIn(31, 188, 600);
  },
  start() {
    if (!this.met) {
      cut(async () => {
        FX.flash = 1; FX.flashColor = '#F8F4C8';
        await tween(1000, (k) => { FX.flash = 1 - k; });
        await zoe.walkTo(56, 182);
        await narrate("This isn't an attic.", "It's a FOREST.", 'Inside your house. Totally normal.');
        await narrate('Tiny yellow creatures are scurrying around.', "They haven't noticed you yet.");
        this.meetReady = true;
      });
    } else { FX.fade = 1; fadeIn(500); }
  },
};

// ---------------- Library ----------------
SCENES.library = {
  song: 'drab', walk: [40, 170, 250, 194],
  enter(o = {}) {
    this.alive = bgOf('libAlive', W, H, (g) => paintLibrary(g));
    this.drab = bgOf('libDrab', W, H, (g) => { g.drawImage(recolor(this.alive, drab), 0, 0); paintCobwebs(g); });
    const done = ['reward', 'done'].includes(save.stage);
    this.reveal = done ? 999 : 0; this.fireK = done ? 1 : 0; this.wiggle = false; this.bookShown = !!(save.book && done);
    this.flyBook = null; this.presents = null; this.preview = null; this.squash = 0; this.lightsK = save.item === 'lights' ? 1 : 0;
    this.st = {}; this.storyIcon = null;
    this.song = done ? 'warm' : 'drab';
    zoe.visible = true;
    if (o.arrive) { zoe.x = 31; zoe.y = 190; } else { zoe.x = 96; zoe.y = 186; }
    zoe.face(1);
    this.greg = new Sparkee({ r: 7, seed: 99, greg: true, x: 120, y: 184, name: 'greg' });
    this.sps = makeSparkees([{ x: 140, y: 178 }, { x: 206, y: 188 }, { x: 222, y: 174 }, { x: 246, y: 186 }, { x: 62, y: 174 }, { x: 160, y: 192 }]);
    const g0 = done ? 1 : 0.22;
    for (const s of [this.greg, ...this.sps]) { s.glow = g0; s.look = zoe; }
    if (done) this.sps.forEach((s, i) => { s.mode = 'wander'; s.area = [60 + i * 32, 170, 92 + i * 32, 194]; s.speed = 22; });
    if (save.item === 'headphones') { const s = this.sps[2]; s.x = 233; s.y = 136; s.acc = 'headphones'; s.mode = 'idle'; s.hop(true); this.dj = s; }
    if (save.item === 'beanbag') { const s = this.sps[0]; s.x = LIB.beanbag[0]; s.y = LIB.beanbag[1] - 10; s.mode = 'idle'; s.sitting = true; this.lounger = s; }
    this.actors = [zoe, this.greg, ...this.sps];
    const self = this;
    const isDone = () => save.stage === 'done';
    hints = [
      { x: 98, y: 82, strong: true, when: () => save.stage === 'library' },
      { x: 180, y: 156, strong: true, when: () => save.stage === 'quest' },
      { x: 142, y: 180, strong: true, when: () => save.stage === 'reward' && self.presents && !self.choosing },
    ];
    this.hotspots = [
      { rect: [12, 176, 38, 22], stand: [44, 188], act: () => self.leave() },
      { rect: [16, 38, 104, 114], stand: [70, 184], face: 'front', act: () => self.shelf() },
      { rect: [28, 44, 28, 26], when: () => self.bookShown, stand: [56, 184], face: 'front', act: () => openBookCard() },
      { rect: [142, 96, 72, 58], stand: [196, 178], act: async () => {
        if (self.fireK > 0) await say('n', cycle(['Crackle, crackle. The fire is showing off now.', 'Warm and cozy. Your story did that.'], 'fire', self.st));
        else await say('n', cycle(['The fireplace is cold. It looks bored.', 'A fire needs wood. This one also needs a story.'], 'fire0', self.st));
      } },
      { rect: [168, 74, 18, 18], stand: [180, 178], act: async () => { await say('n', cycle(['A portrait of Greg.', 'Painted by Greg.'], 'gp', self.st)); } },
      { rect: [218, 50, 32, 32], stand: [234, 184], act: async () => { await say('n', self.fireK > 0 ? 'The forest looks happier. Or it always looked like that. Hard to say.' : 'The forest outside is glowing. In here, not so much.'); } },
      { rect: [252, 80, 36, 72], stand: [250, 186], act: () => self.kitchen() },
      { rect: [170, 156, 20, 16], when: () => save.stage === 'quest', stand: [134, 186], face: 'front', act: () => self.tell() },
      { rect: [170, 156, 20, 16], when: () => save.stage !== 'quest', stand: [160, 184], act: async () => { await say('n', cycle(['The storytelling stool. A little wobbly.', "The wobble is part of its charm. That's what Greg says."], 'stool', self.st)); } },
      { rect: [112, 150, 34, 24], when: () => save.item === 'beanbag', stand: [104, 186], act: async () => { AU.sfx('squish'); self.squash = 3; await say('n', cycle(['The beanbag. Currently occupied.', 'Squish.'], 'bb', self.st)); } },
      { rect: [10, 26, 268, 20], when: () => save.item === 'lights', act: async () => { AU.sfx('twinkle'); await say('n', cycle(['Twinkle, twinkle.', 'The Sparkees named every single light. They are all named Greg.'], 'lt', self.st)); } },
      { hit: (x, y) => Math.hypot(self.greg.x - x, self.greg.y - 6 - y) < 11, when: () => !self.presents, stand: () => [self.greg.x - 22, clamp(self.greg.y, 170, 194)], act: () => self.talkGreg() },
      { hit: (x, y) => self.sps.some((s) => s.visible && Math.hypot(s.x - x, s.y - 5 - y) < 9), when: () => !self.presents, act: async () => {
        const s = self.sps.slice().sort((a, b) => Math.hypot(a.x - zoe.x, a.y - zoe.y) - Math.hypot(b.x - zoe.x, b.y - zoe.y))[0];
        s.jump(70);
        bubble(s, cycle(isDone() ? ['Hi!', 'Your book is my favorite book.', 'Is it tomorrow yet?', "I'm glowing! Look!", 'I love it here now.'] : ['Hi...', "It's chilly in here.", 'Do you like stories?', '*sniff*'], 'spk', self.st), 1600, true);
        await sleep(400);
      } },
      { hit: (x, y) => !!self.presents && self.presents.some((p) => !p.gone && Math.abs(p.x - x) < 9 && y > p.y - 18 && y < p.y + 2), act: async () => {
        const p = self.presents.find((pp) => !pp.gone);
        const hitP = self.presents.filter((pp) => !pp.gone).sort((a, b) => Math.abs(a.x - self._tapX) - Math.abs(b.x - self._tapX))[0] || p;
        await self.peek(hitP);
      } },
    ];
  },
  onTapEmpty() { return false; },
  async talkGreg() {
    const G = this.greg;
    G.expr = 'happy';
    if (save.stage === 'library') await say('greg', 'The bookshelf! Give it a tap. It knows what to do.');
    else if (save.stage === 'quest') { await say('greg', "Back already? Did you read your animal book?"); await say('greg', 'Sit on the storytelling stool and tell us everything!'); }
    else await say('greg', cycle(['Greg.', 'Greg is very proud of you.', 'Did you know that Greg means "Greg"?', 'Come back tomorrow. The bookshelf will have a new quest.'], 'greg', this.st));
    G.expr = 'norm';
  },
  async kitchen() {
    AU.sfx('rattle');
    await say('n', cycle(['A locked door. The sign says KITCHEN.', 'It smells like cookies in there. Locked cookies.'], 'kit', this.st));
    if (!this.st.kitGreg) {
      this.st.kitGreg = 1;
      await say('greg', 'That is the kitchen. It got locked when the magic faded.');
      await say('greg', 'Someday, maybe...');
    }
  },
  async leave() {
    if (!['done'].includes(save.stage)) { await say('greg', 'Wait! Not yet! The library needs you!'); return; }
    await irisOut(31, 188, 600);
    goScene('forest');
    await irisIn(154, 140, 600);
  },
  async shelf() {
    if (save.stage === 'library') return this.giveQuest();
    if (save.stage === 'quest') { await say('n', 'The bookshelf is waiting for your story.'); await openQuestPage(true); return; }
    if (save.stage === 'done') { await say('n', cycle(['Lots of empty shelves. Plenty of room for more stories.', 'Shh. The bookshelf is dreaming up your next quest.', '(Your grown-ups are helping it. Come back tomorrow.)'], 'shelf', this.st)); return; }
    await say('n', 'A big, empty bookshelf.');
  },
  async giveQuest() {
    this.wiggle = true; AU.sfx('rattle');
    await narrate('One dusty book is wiggling.', "Books aren't supposed to wiggle. Unless they really want something.");
    AU.sfx('rattle');
    this.wiggle = false;
    // book hops out and flies to Zoe
    AU.sfx('pop');
    burst(98, 80, 10, { speed: 24, c: '#CBBCA3', ay: 40 });
    this.flyBook = { x: 98, y: 76, t: 0, to: [zoe.x, zoe.y - 34], quest: true };
    await tween(700, (k) => { this.flyBook.t = k; });
    AU.sfx('page');
    this.flyBook = null;
    this.shelfBookGone = true;
    await openQuestPage(false);
    AU.sfx('chime');
    save.stage = 'quest'; persist(); updateHud(true);
    const G = this.greg;
    G.expr = 'happy';
    await say('greg', 'A quest! The bookshelf gave you a quest!');
    await say('greg', 'Go! Find your animal book! We will wait right here.');
    await say('sp', "We're great at waiting.", { actor: this.sps[0] });
    await say('sp2', "We're actually terrible at waiting.", { actor: this.sps[1] });
    G.expr = 'norm';
    await say('greg', 'Also, {name}... you are holding a big glowing rectangle.');
    await say('greg', 'You can put it down while you read. We will be right here.');
    await say('greg', 'When you are done, sit on the storytelling stool by the fire.');
  },
  async tell() {
    const G = this.greg, S = this.sps;
    zoe.face('front');
    const spots = [[96, 190], [84, 180], [196, 190], [208, 180], [110, 196], [222, 192]];
    S.forEach((s, i) => { s.mode = 'goto'; s.goto(spots[i][0], spots[i][1], 40); s.look = zoe; });
    await G.goto(108, 182, 40);
    G.look = zoe;
    G.expr = 'happy';
    await say('greg', '{name}! You are back!');
    G.expr = 'norm';
    const r = await ask('greg', 'Did you find a book with an animal on the cover? And read it?', ['Yes! I read it!', 'Not yet.']);
    if (r === 1) { await say('greg', 'No rush! The fire is not going anywhere.'); await say('greg', 'It is a fireplace. It is very bad at going places.'); return; }
    AU.sfx('cheer');
    S.forEach((s) => { s.expr = 'happy'; s.jump(70 + Math.random() * 30); });
    bubble(S[0], 'Story time!', 1500, true); setTimeout(() => bubble(S[3], 'Yay!', 1200), 300);
    await sleep(1200);
    await say('greg', 'Everybody sit!');
    S.forEach((s) => { s.sitting = true; s.expr = 'norm'; });
    await say('greg', 'First, the most important question...');
    const animal = await openAnimalPicker();
    this.storyIcon = animal;
    AU.sfx('sparkle');
    await this.reactAnimal(animal);
    const feel = await openFeelingPicker();
    await this.reactFeeling(feel);
    G.expr = 'norm'; S.forEach((s) => { s.expr = 'wide'; });
    await say('greg', 'Now the best part.');
    await say('greg', 'Tell us one thing that happened in the story. Say it out loud!');
    await say('sp', "We're listening!", { actor: S[1] });
    await say('sp2', 'We have very small ears, but we are doing our best.', { actor: S[2] });
    await ask('n', 'Tell the Sparkees about your book. Then tap the button.', ['I told them!']);
    S.forEach((s) => { s.expr = 'star'; });
    bubble(S[0], 'Wow.', 1400, true); setTimeout(() => bubble(S[2], 'No way!', 1400), 400); setTimeout(() => bubble(S[4], 'Tell it again!', 1500), 800);
    await sleep(1700);
    G.expr = 'happy';
    await say('greg', 'That is the best thing I have ever heard.');
    G.expr = 'wide';
    await say('greg', 'Stand back, everyone...');
    await this.magic(animal, feel);
  },
  async reactAnimal(a) {
    const G = this.greg, S = this.sps;
    const lines = {
      cat: ['A cat! Sparkees love cats.', 'Cats do not love Sparkees. It is complicated.'],
      dog: ['A DOG!', 'Did it have a ball? No, don\'t tell me. I will get too excited.'],
      bear: ['A bear! Big. Fuzzy.', 'Like a Sparkee, but less glowy.'],
      bunny: ['A bunny! Hop, hop.', 'That was Greg doing a bunny. Did you like it?'],
      fox: ['A fox! Sneaky. Clever.', 'Like you.'],
      bird: ['A bird! Tweet tweet.', 'Greg speaks a little bird.'],
      pig: ['A pig! Oink.', 'Sparkees think pigs are very fancy.'],
      mouse: ['A mouse! Squeak.', 'Sparkees and mice are about the same size. We have a lot in common.'],
      lion: ['A lion! ROAR!', 'Sorry. Greg got carried away.'],
      frog: ['A frog! Ribbit.', 'Frogs are the only animal Greg is jealous of. They can jump SO high.'],
      dragon: ['A DRAGON?!', 'Greg is not scared. Greg is just... sitting down for a minute.'],
      fish: ['A fish! Blub blub.', 'That means "nice book" in fish.'],
      elephant: ['An elephant!', 'Greg has never seen one. Greg assumes it is the size of a house.'],
      monkey: ['A monkey! Ooh ooh, ah ah!', 'Monkeys are excellent climbers. Like you on our ladder.'],
      penguin: ['A penguin!', 'A bird that wears a fancy suit. Very classy.'],
      other: ['A mystery animal!', 'Sparkees love mysteries.'],
    }[a] || ['Ooh!', 'What a great animal.'];
    if (a === 'dragon') { S.forEach((s) => (s.expr = 'wide')); G.expr = 'wide'; AU.sfx('surprise'); }
    else { S.forEach((s) => (s.expr = 'happy')); G.expr = 'happy'; }
    if (a === 'bunny' || a === 'frog') G.jump(110);
    await say('greg', lines[0]);
    if (a === 'dragon') G.sitting = true;
    await say('greg', lines[1]);
    G.sitting = false;
  },
  async reactFeeling(f) {
    const G = this.greg, S = this.sps;
    if (f === 'funny') { S.forEach((s) => (s.expr = 'laugh')); bubble(S[0], 'Hee hee!', 1300, true); setTimeout(() => bubble(S[3], 'Ha!', 1100), 300); G.expr = 'laugh'; await sleep(900); await say('greg', 'Funny ones are the best. Greg is laughing on the inside.'); }
    else if (f === 'exciting') { S.forEach((s) => (s.expr = 'star')); bubble(S[1], 'Ooooh!', 1300, true); G.expr = 'wide'; await sleep(900); await say('greg', "Exciting! Greg's heart is going thump-thump."); }
    else if (f === 'cozy') { S.forEach((s) => (s.expr = 'cozy')); bubble(S[2], 'Awwww.', 1300, true); G.expr = 'happy'; await sleep(900); await say('greg', "Cozy is Greg's favorite feeling. Second favorite is Tuesday."); }
    else { S.forEach((s) => { s.expr = 'sad'; s.tear = 1.2; }); G.expr = 'sad'; G.tear = 1.2; bubble(S[1], '*sniff*', 1300, true); await sleep(900); await say('greg', 'Sad stories count too.'); await say('greg', 'Look, Greg is already crying. In a good way.'); }
  },
  async magic(animal, feel) {
    const G = this.greg, S = this.sps;
    zoe.mode = 'cheer';
    AU.setSong(null); AU.songName = null;
    AU.sfx('whoosh');
    // story glyphs stream from Zoe into the fireplace
    const sx = zoe.x, sy = zoe.y - 24;
    for (let i = 0; i < 46; i++) {
      setTimeout(() => {
        const p0 = [sx + (Math.random() - 0.5) * 10, sy + (Math.random() - 0.5) * 8];
        const p1 = [lerp(sx, LIB.fire[0], 0.5) + (Math.random() - 0.5) * 50, 10 + Math.random() * 40];
        emit({ kind: 'glyph', gi: Math.floor(Math.random() * GLYPHS.length), p0, p1, p2: [LIB.fire[0] + (Math.random() - 0.5) * 16, LIB.fire[1] + (Math.random() - 0.5) * 6], life: 1.3 + Math.random() * 0.5, layer: 'front' });
        if (i % 6 === 0) AU.sfx('blip', 900 + Math.random() * 600);
      }, i * 45);
    }
    await sleep(2900);
    // FWOOMP
    AU.sfx('fwoomp');
    FX.flashColor = '#FFE9A8';
    tween(700, (k) => { FX.flash = 0.75 * (1 - k); });
    burst(LIB.fire[0], LIB.fire[1], 40, { speed: 70, c: '#FFD84A', up: 30, life: 1.2, extra: { layer: 'front' } });
    tween(700, (k) => { this.fireK = ease(k); });
    await sleep(250);
    AU.setSong('warm');
    const all = [G, ...S];
    await tween(2600, (k) => {
      this.reveal = ease(k) * 340;
      for (const s of all) {
        const d = Math.hypot(s.x - LIB.fire[0], s.y - LIB.fire[1]);
        if (d < this.reveal && s.glow < 1) { s.glow = 1; s.expr = 'happy'; s.sitting = false; s.jump(90); burst(s.x, s.y - 8, 6, { speed: 20, c: '#FFF6B8', extra: { layer: 'front' } }); AU.sfx('pop'); }
      }
    });
    this.reveal = 999;
    zoe.mode = 'front';
    // the book appears and flies onto the shelf
    AU.sfx('sparkle');
    burst(zoe.x, zoe.y - 40, 16, { speed: 26, c: '#FFF6C8', extra: { layer: 'front' } });
    this.flyBook = { x: zoe.x - 12, y: zoe.y - 56, t: 0, to: [LIB.shelfBook[0] - 6, LIB.shelfBook[1] - 1], animal };
    await sleep(500);
    await tween(1300, (k) => { this.flyBook.t = k; });
    this.flyBook = null; this.bookShown = true; this.storyIcon = null;
    AU.sfx('pop'); burst(LIB.shelfBook[0] + 6, LIB.shelfBook[1] + 12, 14, { speed: 22, c: '#FFE38A', extra: { layer: 'front' } });
    save.book = { animal, feel }; save.stage = 'reward'; persist(); updateHud();
    AU.sfx('cheer');
    S.forEach((s) => { s.arms = 'up'; s.hop(true); s.expr = 'happy'; });
    bubble(S[0], 'It is WARM!', 1600, true); setTimeout(() => bubble(S[2], 'Look at the fire!', 1500), 400); setTimeout(() => bubble(S[5], 'Hooray!', 1300), 800);
    await sleep(2200);
    S.forEach((s) => { s.arms = 'down'; s.hop(false); });
    G.expr = 'cozy';
    await say('greg', 'Do you feel that?');
    await say('greg', 'It is warm. It is... cozy.');
    G.expr = 'happy';
    await say('greg', 'That is what a story does.');
    await say('sp', 'Look! Your book is on our shelf now!', { actor: S[1] });
    await say('greg', 'Forever.');
    await say('greg', 'Or until we dust.');
    G.expr = 'norm';
    await say('greg', 'We never dust.');
    await this.reward();
  },
  async reward() {
    const G = this.greg;
    if (!this.presents) {
      G.expr = 'happy';
      await say('greg', 'The library wants to say thank you.');
      const side = [[196, 184], [210, 192], [224, 182], [238, 192], [182, 194], [250, 180]];
      this.sps.forEach((s, i) => { s.sitting = false; s.mode = 'goto'; s.goto(side[i][0], side[i][1], 55); });
      await G.goto(176, 178, 45);
      AU.sfx('poof');
      this.presents = [
        { x: 120, y: 192, wrap: '#DB95B5', ribbon: '#DCA438', item: 'beanbag', lid: 0 },
        { x: 142, y: 196, wrap: '#A1AF7C', ribbon: '#612C48', item: 'lights', lid: 0 },
        { x: 164, y: 192, wrap: '#7E93A3', ribbon: '#FE9B5B', item: 'headphones', lid: 0 },
      ];
      for (const p of this.presents) burst(p.x, p.y - 6, 10, { speed: 30, c: '#FFF6C8', extra: { layer: 'front' } });
      await zoe.walkTo(96, 188); zoe.face(1);
      await say('greg', 'Three presents! Pick one for the library.');
      await say('greg', 'Tap a present to peek inside.');
    }
  },
  async peek(p) {
    if (this.choosing) return;
    this.choosing = true;
    const G = this.greg;
    AU.sfx('pop');
    await tween(300, (k) => { p.lid = Math.round(k * 8); });
    this.preview = p.item;
    p.peeked = true;
    AU.sfx('sparkle');
    const info = {
      beanbag: ['A beanbag chair! For flopping.', 'Sparkees are excellent floppers.'],
      lights: ['Fairy lights! They twinkle.', 'Twinkling is our favorite thing to watch.'],
      headphones: ['Tiny headphones! Sparkee-sized.', 'For listening to very tiny music.'],
    }[p.item];
    G.expr = 'happy';
    await say('greg', info[0]);
    const c = await ask('greg', info[1], ['Keep it!', 'Peek at another one.']);
    if (c === 0) { await this.place(p); }
    else { this.preview = null; await tween(250, (k) => { p.lid = Math.round((1 - k) * 8); }); }
    this.choosing = false;
  },
  async place(p) {
    const G = this.greg, S = this.sps;
    this.preview = null;
    AU.sfx('poof');
    for (const q of this.presents) { q.gone = true; burst(q.x, q.y - 6, 12, { speed: 30, c: '#FFF6C8', extra: { layer: 'front' } }); }
    save.item = p.item; persist();
    const target = { beanbag: LIB.beanbag, lights: [144, 36], headphones: LIB.table }[p.item];
    burst(target[0], target[1] - 6, 22, { speed: 34, c: '#FFE38A', extra: { layer: 'front' } });
    this.presents = null;
    if (p.item === 'beanbag') {
      const s = S[0]; s.sitting = false; s.mode = 'goto';
      await s.goto(LIB.beanbag[0] - 22, 184, 60);
      s.jump(120); await s.goto(LIB.beanbag[0], LIB.beanbag[1] - 10, 50);
      AU.sfx('squish'); this.squash = 4; s.sitting = true; s.expr = 'cozy';
      bubble(s, 'I live here now.', 2000, true); this.lounger = s;
      await sleep(1800);
      await say('greg', 'Fair enough.');
    } else if (p.item === 'lights') {
      AU.sfx('twinkle');
      await tween(1600, (k) => { this.lightsK = k; });
      [G, ...S].forEach((s) => { s.expr = 'wide'; s.look = { x: s.x, y: 0 }; });
      bubble(S[1], 'Ooooh.', 1600, true); setTimeout(() => bubble(S[4], 'Pretty!', 1400), 500);
      await sleep(1800);
      [G, ...S].forEach((s) => { s.expr = 'happy'; s.look = zoe; });
      await say('greg', 'Pretty. So pretty.');
    } else {
      const s = S[2]; s.sitting = false; s.mode = 'goto';
      await s.goto(LIB.table[0] - 14, 168, 60);
      s.jump(150); await s.goto(LIB.table[0], LIB.table[1], 40);
      s.acc = 'headphones'; AU.sfx('notes'); s.expr = 'cozy'; s.hop(true); this.dj = s;
      await sleep(1600);
      await say('greg', 'He cannot hear us anymore.');
      await say('greg', 'He has never been happier.');
    }
    G.expr = 'happy';
    await say('greg', 'The library looks wonderful.');
    await say('greg', 'Come back tomorrow, {name}. The bookshelf will have a new quest for you.');
    G.expr = 'norm';
    await say('greg', 'It is the bookshelf\'s job. It takes it very seriously.');
    save.stage = 'done'; save.doneAt = Date.now(); persist(); updateHud();
    S.forEach((s, i) => { if (s !== this.dj && s !== this.lounger) { s.sitting = false; s.mode = 'wander'; s.area = [60 + i * 32, 170, 92 + i * 32, 194]; s.speed = 22; } });
    await openChapterCard();
  },
  drawBg(g) {
    if (this.reveal >= 340) g.drawImage(this.alive, 0, 0);
    else {
      g.drawImage(this.drab, 0, 0);
      if (this.reveal > 0) {
        const [cx, cy] = LIB.fire, r = this.reveal;
        for (let y = 0; y < H; y++) {
          const dy = y - cy; if (Math.abs(dy) >= r) continue;
          const dx = Math.round(Math.sqrt(r * r - dy * dy));
          const x0 = Math.max(0, cx - dx), x1 = Math.min(W, cx + dx);
          if (x1 > x0) g.drawImage(this.alive, x0, y, x1 - x0, 1, x0, y, x1 - x0, 1);
        }
        for (let i = 0; i < 3; i++) { const a = Math.random() * Math.PI * 2; emit({ kind: 'spark', x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, vy: -10, life: 0.6, c: '#FFF6B8', layer: 'front' }); }
      }
    }
    // the dusty quest book
    if (!this.shelfBookGone && ['new', 'met', 'library'].includes(save.stage)) drawShelfBook(g, 96, 76, this.wiggle);
    if (this.bookShown && save.book) drawBookCover(g, 30, 44, save.book.animal);
    // fire
    drawFire(g, LIB.fire[0], 147, T, this.fireK);
    if (this.fireK > 0 && this.reveal >= 340) {
      g.save(); g.globalCompositeOperation = 'lighter';
      g.globalAlpha = 0.05 + 0.02 * Math.sin(T * 7); D.poly(g, [[222, 70], [246, 70], [196, 196], [150, 196]], '#FFE9A8');
      g.restore();
    }
    // items
    if (save.item === 'beanbag' || this.preview === 'beanbag') {
      if (this.preview === 'beanbag') g.globalAlpha = 0.55 + 0.25 * Math.sin(T * 8);
      drawBeanbag(g, LIB.beanbag[0], LIB.beanbag[1], Math.round(this.squash));
      g.globalAlpha = 1;
    }
    if (save.item === 'headphones' && !this.dj) drawHeadphonesItem(g, LIB.table[0], LIB.table[1] - 2);
    if (this.preview === 'headphones') { g.globalAlpha = 0.55 + 0.25 * Math.sin(T * 8); drawHeadphonesItem(g, LIB.table[0], LIB.table[1] - 3); g.globalAlpha = 1; }
    // presents
    if (this.presents) for (const p of this.presents) if (!p.gone) {
      drawPresent(g, p.x, p.y, p.wrap, p.ribbon, p.lid);
      if (p.peeked && !p.lid) { D.r(g, p.x + 5, p.y - 6, 4, 4, C.parch); D.p(g, p.x + 6, p.y - 5, C.ink); }
    }
  },
  drawFg(g) {
    if (save.item === 'lights' || this.preview === 'lights') {
      if (this.preview === 'lights') g.globalAlpha = 0.5 + 0.3 * Math.sin(T * 8);
      drawLights(g, T, this.preview === 'lights' ? 1 : this.lightsK);
      g.globalAlpha = 1;
    }
    if (this.storyIcon) {
      const ic = ICONS['a_' + this.storyIcon];
      const y = Math.round(zoe.y - 56 + Math.sin(T * 2) * 1.5);
      D.glow(g, zoe.x, y + 11, 18, '#FFE38A', 0.3, 3);
      g.drawImage(ic, Math.round(zoe.x - 11), y);
    }
    if (this.flyBook) {
      const f = this.flyBook, t = ease(f.t);
      const x = lerp(f.x, f.to[0], t), y = lerp(f.y, f.to[1], t) - Math.sin(t * Math.PI) * (f.quest ? 20 : 40);
      if (f.quest) { drawShelfBook(g, x, y, false); }
      else { D.glow(g, x + 12, y + 12, 22, '#FFE38A', 0.35, 3); drawBookCover(g, Math.round(x), Math.round(y), f.animal); if (Math.random() < 0.5) emit({ kind: 'spark', x: x + 12, y: y + 12, vy: 6, life: 0.6, c: '#FFF6B8', layer: 'front' }); }
    }
  },
  update(dt) {
    if (this.squash > 0) this.squash = Math.max(0, this.squash - dt * 6);
    const done = this.reveal >= 340;
    if (done && Math.random() < dt * 3) emit({ kind: 'spark', x: LIB.fire[0] + (Math.random() - 0.5) * 16, y: 132, vy: -20 - Math.random() * 20, vx: (Math.random() - 0.5) * 8, life: 1, c: '#FFC060' });
    if (done && Math.random() < dt * 6) AU.sfx('crackle');
    if (!done && Math.random() < dt * 2) emit({ kind: 'mote', x: 20 + Math.random() * 250, y: 40 + Math.random() * 120, life: 5, c: '#B8B2C4', a: 0.6 });
    if (this.dj && Math.random() < dt * 1.5) emit({ kind: 'note', x: this.dj.x + (Math.random() - 0.5) * 8, y: this.dj.y - 14, vy: -10, vx: (Math.random() - 0.5) * 6, life: 1.4, c: ['#E8628A', '#FFD84A', '#9ACDE0'][Math.floor(Math.random() * 3)], layer: 'front' });
    if (save.stage === 'quest' && !isBusy() && !Dlg.active && !Modal.open) {
      this.waitT = (this.waitT || 8) - dt;
      if (this.waitT < 0) {
        this.waitT = 12 + Math.random() * 8;
        const s = this.sps[Math.floor(Math.random() * this.sps.length)];
        bubble(s, cycle(['Is she back yet?', 'How about now?', "I'm practicing waiting.", 'Greg, are we there yet?', 'I love waiting! (I do not.)', 'Zzz...'], 'wait', this.st), 2200);
      }
    }
  },
  start(o = {}) {
    if (save.stage === 'met') {
      cut(async () => {
        await zoe.walkTo(72, 186); zoe.face(1);
        const G = this.greg, S = this.sps;
        await say('greg', 'Welcome to the library!');
        G.expr = 'sad';
        await say('greg', 'It used to be nicer.');
        await say('sp', 'And warmer.', { actor: S[0] });
        await say('sp2', 'And it had books in it.', { actor: S[1] });
        await say('greg', 'Books would be good, yes.');
        await say('greg', 'When the stories stopped coming, the fire went out.');
        await say('greg', 'And everything got... blah.');
        await say('sp3', 'Blah.', { actor: S[4] });
        G.expr = 'happy';
        await say('greg', 'But you can fix it, {name}!');
        await say('greg', 'The bookshelf always knows what to do. Give it a tap.');
        save.stage = 'library'; persist();
      });
    } else if (save.stage === 'quest' && !o.arrive) {
      cut(async () => {
        FX.fade = 1; await fadeIn(600);
        this.greg.expr = 'happy';
        await say('greg', '{name}! You are back!');
        await say('greg', 'Did you read your animal book? Sit on the storytelling stool by the fire and tell us everything.');
        this.greg.expr = 'norm';
      });
    } else if (save.stage === 'reward') {
      cut(async () => { FX.fade = 1; await fadeIn(500); await this.reward(); });
    } else if (!o.arrive) { FX.fade = 1; fadeIn(500); }
  },
};
// record tap x for present picking
stage.addEventListener('pointerdown', (e) => { if (scene === SCENES.library) { const [x] = stageToWorld(e); SCENES.library._tapX = x; } }, true);
