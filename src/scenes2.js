// ===================== The Art Studio =====================
const PAINTS = ['#E8628A', '#3E5AA8', '#F2C94C', '#6F9A45', '#9A6AB0', '#E8893F'];
SCENES.studio = {
  song: 'drab', walk: [30, 168, 262, 194], room: 'studio', host: 'dot',
  enter(o = {}) {
    save.lastRoom = 'studio';
    this.alive = bgOf('stuAlive', W, H, (g) => { paintStudio(g); drawClothesline(g); });
    this.drab = bgOf('stuDrab', W, H, (g) => { g.drawImage(recolor(this.alive, drab), 0, 0); });
    const awake = save.arts.length > 0;
    this.reveal = awake ? 999 : 0; this.song = awake ? 'warm' : 'drab';
    this.st = {}; this.presents = null; this.preview = null; this.choosing = false;
    this.canvasK = 0; this.easelArt = null; this.flyArt = null;
    zoe.visible = true;
    if (o.arrive) { zoe.x = 40; zoe.y = 188; } else { zoe.x = 120; zoe.y = 186; }
    zoe.face(1);
    this.dot = new Sparkee({ r: 6, seed: 77, x: 200, y: 182, name: 'dot', acc: 'paint' + (save.items.studio.includes('beret') ? ' beret' : '') });
    this.dot.glow = awake ? 1 : 0.22; this.dot.look = zoe;
    if (!save.flags.dotMet) { this.dot.visible = false; this.dot.x = 176; this.dot.y = 168; }
    this.sps = makeSparkees([{ x: 92, y: 186, seed: 41 }, { x: 232, y: 186, seed: 48 }, { x: 160, y: 194, seed: 55 }]);
    this.sps.forEach((s, i) => { s.visible = awake; s.look = zoe; s.mode = 'wander'; s.speed = 20; s.area = [[70, 176, 120, 194], [200, 176, 250, 194], [140, 186, 190, 196]][i]; });
    this.actors = [zoe, this.dot, ...this.sps];
    applyWearables(this);
    const self = this;
    const lineArts = () => save.arts.filter((a) => a.q !== 'family').slice(-CLOTHES.length);
    const famArt = () => save.arts.filter((a) => a.q === 'family').slice(-1)[0];
    this.lineArts = lineArts; this.famArt = famArt;
    hints = [
      { x: 170, y: 110, strong: true, when: () => save.flags.dotMet && !save.active.art && !dayDone('art') && !self.presents && !save.pending },
      { x: 170, y: 110, when: () => save.flags.dotMet && !!save.active.art && !self.presents },
      { x: 132, y: 186, strong: true, when: () => !!self.presents && !self.choosing },
      { x: 262, y: 118, off: 1.1, when: () => save.flags.dotMet && save.arts.length > 0 && !save.flags.bathMet && !self.presents },
    ];
    const line = (key, lines) => async () => { await say('n', cycle(lines, key, self.st)); };
    this.hotspots = [
      { rect: [12, 178, 34, 20], stand: [44, 188], act: () => self.down() },
      { rect: [194, 100, 46, 40], stand: [214, 184], act: line('jars', ['Paint jars. Pink, orange, yellow, green, blue, purple.', 'Dot keeps the lids on very tight. She says paint likes to escape.']) },
      { rect: [12, 118, 64, 22], stand: [48, 184], act: line('table', ['A worktable covered in crayons, brushes, and old paint.', 'There is a crayon here named Kevin. Nobody knows why.']) },
      { rect: [126, 20, 36, 36], stand: [144, 184], face: 'front', act: async () => { await say('n', self.reveal >= 340 ? 'Through the round window, the sky is very blue. The kind of blue you can only paint.' : 'A round window. The sky outside looks like it is waiting to be colored in.'); } },
      { rect: [124, 156, 22, 18], stand: [118, 186], act: line('stool', ['A paint-splattered stool.', 'Dot says every splatter is a memory. Most of them are memories of spilling.']) },
      { rect: [22, 74, 56, 44], stand: [52, 184], face: 'front', act: async () => {
        const f = famArt();
        if (f) return openArtCard(f);
        await say('n', save.active.art === 'family' ? 'An empty frame. It is saving a spot for your family tree.' : 'A big empty frame. It looks like it is waiting for something important.');
      } },
      { hit: (x, y) => self.clothesAt(x, y) >= 0, stand: () => [clamp(self._tapX, 40, 250), 184], face: 'front', act: () => openArtCard(lineArts()[self.clothesAt(self._tapX, self._tapY)]) },
      { rect: [148, 90, 46, 80], stand: [144, 186], act: () => self.easel() },
      { rect: [242, 84, 42, 70], stand: [252, 188], act: () => self.toBath() },
      ...studioItemSpots(self),
      { hit: (x, y) => self.dot.visible && Math.hypot(self.dot.x - x, self.dot.y - 6 - y) < 11, when: () => !self.presents, stand: () => [clamp(self.dot.x - 22, 40, 250), clamp(self.dot.y, 170, 194)], act: () => self.talkDot() },
      { hit: (x, y) => self.sps.some((s) => s.visible && Math.hypot(s.x - x, s.y - 5 - y) < 9), when: () => !self.presents, act: async () => {
        const s = self.sps.filter((q) => q.visible).sort((a, b) => Math.hypot(a.x - self._tapX, a.y - self._tapY) - Math.hypot(b.x - self._tapX, b.y - self._tapY))[0];
        s.jump(70);
        bubble(s, cycle(['I came up the ladder!', 'Dot let me hold a crayon.', 'I painted a dot. Dot was not impressed.', 'Is that your family? They look nice.', 'I love it up here.'], 'spk', self.st), 1600, true);
        await sleep(400);
      } },
      Presents.hotspot(self),
    ];
  },
  clothesAt(x, y) {
    const n = this.lineArts().length;
    for (let i = 0; i < n; i++) { const [cx, cy] = CLOTHES[i]; if (x >= cx - 1 && x < cx + 25 && y >= cy - 3 && y < cy + 19) return i; }
    return -1;
  },
  async down() {
    if (this.presents) { await say('dot', 'Wait! Your present!'); return; }
    await irisOut(28, 188, 600);
    goScene('library', { arrive: true, fromStudio: true });
    zoe.x = 114; zoe.y = 178; zoe.face('front');
    await irisIn(118, 30, 600);
  },
  async toBath() {
    if (this.presents) { await say('dot', 'Wait! Your present!'); return; }
    AU.sfx('creak');
    await fadeOut(400);
    goScene('bath', { arrive: true });
  },
  async talkDot() {
    const D0 = this.dot;
    D0.expr = 'happy';
    if (save.active.art) { const q = artQuest(save.active.art); await say('dot', `Your art quest is ${q.title}.`); await say('dot', 'When it is done, tap my easel and show me!'); }
    else await say('dot', cycle(['Dot. Like a dot. The smallest kind of art.', 'Every artist starts with one dot. Then another dot. Then, a giraffe.', 'Greg asked me to paint him once. I painted a potato. He cried. Happy tears, I think.', dayDone('art') ? 'Three art quests in one day! Dot is speechless. Dot is still talking, but Dot is speechless inside.' : 'My easel has three art quests today. Pick any one!', save.flags.bathMet ? 'Have you brushed your teeth today? Bubbles will ask. Bubbles always asks.' : 'The door with the sign? That is the bathroom. Bubbles lives there.'], 'dot', this.st));
    D0.expr = 'norm';
  },
  async easel() {
    if (!save.flags.dotMet) return;
    if (this.presents || save.pending) { await say('dot', 'Open your present first!'); return; }
    const pick = await openQuestBoard('art');
    if (!pick) { if (dayDone('art')) await say('dot', 'All three art quests done today! My easel needs a rest. Three new ones tomorrow.'); return; }
    if (pick === save.active.art) {
      const r = await openInProgress('art', artQuest(pick));
      if (r === 'done') await this.tellArt(true);
      return;
    }
    await this.giveArtQuest(artQuest(pick));
  },
  async giveArtQuest(q) {
    AU.sfx('sparkle');
    await tween(500, (k) => { this.canvasK = k * 0.9; });
    tween(500, (k) => { this.canvasK = 0.9 * (1 - k); });
    AU.sfx('chime');
    if (!(save.counts.art > 0)) {
      startQuest('art', q.id);
      const D0 = this.dot; D0.expr = 'star';
      await say('dot', 'Make it for real! Real paper, real crayons, at your real table. Then come back and show me!');
      D0.expr = 'norm';
    }
    await acceptAndGo('art', q);
  },
  async tellArt(skipAsk) {
    const q = artQuest(save.active.art), D0 = this.dot;
    if (Math.hypot(zoe.x - 144, zoe.y - 186) > 6) await zoe.walkTo(144, 186);
    zoe.face(1);
    await D0.goto(196, 184, 45);
    D0.look = zoe;
    if (!skipAsk) {
      D0.expr = 'happy';
      await say('dot', cycle(['You are back!', 'Is it done? Is it DONE?'], 'back', this.st));
      D0.expr = 'norm';
      const r = await ask('dot', q.ask, ['Yes! I made it!', 'Not yet.']);
      if (r === 1) { await say('dot', 'Art takes time. Dot once spent a hundred years painting a pear.'); await say('dot', 'It was a very good pear.'); return; }
    }
    D0.expr = 'star'; D0.jump(100); AU.sfx('cheer');
    this.sps.forEach((s) => { if (s.visible) { s.mode = 'goto'; s.goto(s.x < 144 ? 104 : 224, 190, 40); s.look = zoe; } });
    const art = { q: q.id, at: Date.now(), size: q.size };
    for (const step of q.tell) await this.tellStep(step, art, q);
    if (q.after) for (const [who, t] of q.after) await say(who, t);
    D0.expr = 'wide';
    await this.paintMagic(art);
  },
  async tellStep(step, art, q) {
    const D0 = this.dot;
    if (typeof step === 'object') {
      // a picture question with funny answers
      const k = await openPicker(step.q, step.options);
      art.picks = Object.assign({}, art.picks, { [step.key]: k });
      AU.sfx('sparkle'); D0.expr = 'happy';
      const lines = step.react[k] || ['Ooh!', 'Good answer.'];
      await say('dot', lines[0]); await say('dot', lines[1]);
    } else if (step === 'part') {
      const k = await openPicker("What's your favorite part?", ART_PARTS);
      art.part = k; AU.sfx('sparkle'); D0.expr = 'star';
      await say('dot', { colors: 'The colors! Dot loves them too. Especially the ones that are colors.', details: 'The tiny details! Dot found three and a half of them.', idea: 'The idea! Ideas are the seeds of art. And of trees.', built: 'How you made it! Building is a kind of magic.', all: 'All of it! Dot agrees. Every single bit.' }[k] || 'Dot loves that part too.');
    } else if (step === 'photo') {
      D0.expr = 'happy';
      const ph = await openPhotoModal(q);
      if (ph) {
        art.pix = ph.pix; art.photo = ph.photo;
        D0.expr = 'star'; AU.sfx('sparkle');
        await say('dot', cycle(['Oh! It is magnificent.', 'Oh my. Look at those colors!', 'OH. Dot needs to sit down. That is how good it is.'], 'mag', this.st));
      } else {
        D0.expr = 'happy';
        await say('dot', 'No picture? That is okay. Describe it with your hands. Dot will nod a lot.');
      }
    } else if (step === 'family') {
      D0.expr = 'happy';
      await say('dot', 'Who is on your family tree?');
      const people = await openPeoplePicker();
      art.people = people;
      AU.sfx('sparkle'); D0.expr = 'star';
      const n = people.length;
      if (n <= 1) await say('dot', 'A tree with one very important person on it!');
      else await say('dot', n >= 6 ? 'What a BIG family! That is a strong tree.' : 'What a wonderful family! That is a strong tree.');
      if (people.some((p) => ['dog', 'cat', 'fish'].includes(p))) await say('dot', 'And pets! Pets count. Pets are family with fur. Or fins.');
      if (people.includes('grandma') || people.includes('grandpa')) await say('dot', 'Grandparents are the roots. That is why the tree stands up so well.');
      D0.expr = 'happy';
    } else if (step === 'who') {
      await say('dot', 'Who is the card for?');
      const k = await openPicker('Who is the card for?', FAMILY.filter((f) => f[0] !== 'me'));
      art.who = k;
      const lbl = (FAMILY.find((f) => f[0] === k) || [0, 'them'])[1];
      D0.expr = 'cozy';
      await say('dot', k === 'other' ? 'For someone special! They are so lucky.' : `For ${lbl.toLowerCase().startsWith('mom') || lbl.toLowerCase().startsWith('dad') ? lbl : 'your ' + lbl.toLowerCase()}! They are so lucky.`);
      await say('dot', 'A card is a hug you can put on the fridge.');
    } else if (step === 'name') {
      await ask('dot', 'What is its name? Say it out loud!', ['I said it!']);
      D0.expr = 'star';
      await say('dot', cycle(['What a perfect name. Greg is going to be so jealous. Greg only has one name, and it is Greg.', 'A great name! Dot is going to name a crayon that. Sorry, Kevin.'], 'nm', this.st));
    } else if (step === 'feel') {
      const f = await openFeelingPicker(ART_FEELS, 'How did you feel while making it?');
      art.feel = f;
      D0.expr = { fun: 'laugh', proud: 'star', calm: 'cozy', tricky: 'happy' }[f] || 'happy';
      const [a, b] = ART_FEEL_REACT[f] || ['Wonderful.', 'Art is like that.'];
      if (f === 'fun') D0.hop(true);
      await say('dot', a); await say('dot', b);
      D0.hop(false);
    }
  },
  async paintMagic(art) {
    const D0 = this.dot, first = this.reveal < 340;
    zoe.mode = 'cheer';
    AU.sfx('whoosh');
    await streamMagic([zoe.x, zoe.y - 24], STU.easel, 36, { colors: PAINTS });
    this.easelArt = art;
    AU.sfx('fwoomp');
    tween(500, (k) => { this.canvasK = 1 - k; });
    if (first) {
      await wakeRoom(this, STU.easel[0], STU.easel[1], [D0]);
    } else {
      FX.flashColor = '#FFE9A8'; tween(600, (k) => { FX.flash = 0.45 * (1 - k); });
      for (const c of PAINTS) burst(STU.easel[0], STU.easel[1], 6, { speed: 50, c, up: 20, extra: { layer: 'front' } });
      D0.jump(100);
      await sleep(900);
    }
    zoe.mode = 'front';
    this.lastSize = art.size;
    save.arts.push(art); save.doneQ.art.push(art.q); markDayDone('art', art.q); save.active.art = null; save.counts.art = (save.counts.art || 0) + 1;
    persist(); updateHud();
    // the picture flies from the easel to its place
    const to = art.q === 'family' ? [26, 78, 48, 36] : (() => { const i = this.lineArts().length - 1; const [x, y] = CLOTHES[Math.max(0, i)]; return [x, y, 24, 18]; })();
    this.hideNew = art;
    this.flyArt = { from: [154, 98, 32, 27], to, art, t: 0 };
    this.easelArt = null;
    AU.sfx('sparkle');
    await tween(1100, (k) => { this.flyArt.t = k; });
    this.flyArt = null; this.hideNew = null;
    AU.sfx('pop'); burst(to[0] + to[2] / 2, to[1] + to[3] / 2, 16, { speed: 24, c: '#FFE38A', extra: { layer: 'front' } });
    if (first) {
      D0.expr = 'star'; D0.arms = 'up'; D0.hop(true);
      await say('dot', 'My colors! My colors are BACK!');
      D0.hop(false); D0.arms = 'down';
      // Sparkees from the library heard the commotion
      AU.sfx('pop');
      for (const [i, s] of this.sps.entries()) {
        s.visible = true; s.x = 28; s.y = 188; s.glow = 1; s.mode = 'goto';
        await sleep(250); s.jump(120); burst(28, 186, 6, { speed: 20, c: '#FFF6B8', extra: { layer: 'front' } });
        s.goto([96, 226, 160][i], [186, 186, 194][i], 70);
      }
      bubble(this.sps[0], 'We heard a FWOOMP!', 1800, true);
      await sleep(1600);
      await say('dot', 'Look at this place. Look at ME!');
    }
    D0.expr = 'happy';
    if (art.q === 'family') {
      await say('dot', 'Your family is on our wall now.');
      await say('dot', 'So now the treehouse has a family too.');
    } else await say('dot', cycle(['Another masterpiece for the clothesline!', 'The gallery is getting very fancy.', 'Dot will look at this every single day.'], 'hung', this.st));
    this.sps.forEach((s, i) => { s.mode = 'wander'; s.area = [[70, 176, 120, 194], [200, 176, 250, 194], [140, 186, 190, 196]][i]; });
    if (first && !save.flags.ch2) { save.flags.ch2 = true; persist(); await openChapterTwoCard(art); }
    await this.reward();
  },
  async reward() {
    const D0 = this.dot;
    if (this.presents) return;
    const project = this.lastSize === 'project';
    await D0.goto(214, 182, 45);
    const ok = Presents.offer(this, 'studio', [[110, 192], [132, 196], [154, 192]], project ? { golden: true, keep: 2 } : {});
    if (!ok) { await say('dot', 'The studio already has every present I know how to make.'); await say('dot', 'So here is a very fancy invisible present instead. It is a painting of the wind.'); return this.afterPresent(); }
    await zoe.walkTo(86, 188); zoe.face(1);
    await say('dot', save.pending.golden ? 'A big project gets GOLDEN presents! You can keep two!' : cycle(['Thank-you presents! Dot wrapped them herself. Badly. Tap them!', 'Presents! Tap them to see inside.'], 'thx', this.st));
  },
  async onPlaced(item, last) {
    const D0 = this.dot;
    if (!last) { AU.sfx('twinkle'); await Presents.admire(this, item, ['Ooh!', 'So fancy!']); return; }
    if (item === 'beret') {
      AU.sfx('twinkle'); D0.expr = 'star'; D0.jump(140);
      for (const s of [D0, ...this.sps]) { s.jump(100); burst(s.x, s.y - 14, 8, { speed: 22, c: '#FFE38A', extra: { layer: 'front' } }); }
      await sleep(600);
      await say('dot', 'Berets for everybody! I have waited four hundred years for this hat.');
      await say('dot', 'We are now officially fancy. All of us.');
    } else if (item === 'sunflower') {
      await Presents.admire(this, item, ['It is so tall!', 'Hello, sunflower!']);
      await say('dot', 'It is taller than me. I am naming it Kevin. Kevin the crayon will be confused.');
    } else {
      AU.sfx('twinkle');
      await Presents.admire(this, item, ['Ooh!', 'So colorful!', 'I love it!', 'Fancy!']);
    }
    await this.afterPresent();
  },
  async afterPresent() {
    const D0 = this.dot;
    D0.expr = 'happy';
    for (const t of leftLines('art')) await say('dot', t);
    if (!save.flags.bathMet) {
      await say('dot', 'Oh! And the door over there, with the sign?');
      D0.look = { x: 280, y: 120 };
      await say('dot', 'That is the bathroom. Bubbles lives in there. Bubbles is very, very clean.');
      D0.look = zoe;
    }
    D0.expr = 'norm';
  },
  drawBg(g) {
    drawReveal(g, this.drab, this.alive, STU.easel[0], STU.easel[1], this.reveal);
    const fam = this.famArt();
    if (fam && fam !== this.hideNew) drawArtPiece(g, artCanvas(fam), 26, 78, 48, 36, false);
    this.lineArts().forEach((a, i) => { if (a !== this.hideNew) { const [x, y] = CLOTHES[i]; drawArtPiece(g, artCanvas(a), x, y, 24, 18); } });
    if (this.easelArt) drawArtPiece(g, artCanvas(this.easelArt), 154, 98, 32, 27, false);
    drawCanvasGlow(g, this.canvasK);
    Presents.drawBg(this, g);
  },
  drawFg(g) {
    Presents.drawFg(this, g);
    if (this.flyArt) {
      const f = this.flyArt, t = ease(f.t), L = (i) => lerp(f.from[i], f.to[i], t);
      const lift = Math.sin(t * Math.PI) * 30;
      D.glow(g, L(0) + L(2) / 2, L(1) + L(3) / 2 - lift, 26, '#FFE38A', 0.3, 3);
      drawArtPiece(g, artCanvas(f.art), Math.round(L(0)), Math.round(L(1) - lift), Math.round(L(2)), Math.round(L(3)), false);
      if (Math.random() < 0.5) emit({ kind: 'spark', x: L(0) + L(2) / 2, y: L(1) - lift, vy: 6, life: 0.6, c: PAINTS[Math.floor(Math.random() * 6)], layer: 'front' });
    }
  },
  update(dt) {
    const awake = this.reveal >= 340;
    if (!awake && Math.random() < dt * 2) emit({ kind: 'mote', x: 20 + Math.random() * 250, y: 40 + Math.random() * 110, life: 5, c: '#B8B2C4', a: 0.6 });
    if (awake && Math.random() < dt * 0.8) emit({ kind: 'mote', x: 130 + Math.random() * 30, y: 30 + Math.random() * 30, vy: 3, life: 4, c: '#FFF1C8', a: 0.8 });
    if (save.active.art && !isBusy() && !Dlg.active && !Modal.open && !this.presents && this.dot.visible) {
      this.waitT = (this.waitT || 9) - dt;
      if (this.waitT < 0) { this.waitT = 14 + Math.random() * 8; bubble(this.dot, cycle(['Is it done yet?', 'Dot is practicing patience.', 'I bet it is beautiful.', 'Hmm hmm hmm.'], 'wait', this.st), 2200); }
    }
  },
  start(o = {}) {
    if (!save.flags.dotMet) {
      cut(async () => {
        await zoe.walkTo(70, 186); zoe.face(1);
        await narrate('You climb up through the hatch.', 'A long room with a round window.', 'It should be bright up here. But everything is grey.', 'Even the paint is grey. Grey paint is just sad paint.');
        const D0 = this.dot;
        D0.visible = true; AU.sfx('surprise'); D0.jump(130);
        await D0.goto(190, 182, 60);
        D0.expr = 'wide';
        await say('dot', 'A VISITOR!');
        D0.expr = 'happy';
        await say('dot', 'Hello! I am Dot. I am an artist.');
        D0.expr = 'sad';
        await say('dot', 'Well. I used to be. When the magic faded, all my colors went grey.');
        D0.expr = 'norm';
        await say('dot', 'Greg yelled up the ladder. He says you bring stories, and stories bring the magic back.');
        D0.expr = 'happy';
        await say('dot', 'Here is a secret: a picture is a kind of story. A story you can SEE.');
        await say('dot', 'Would you make some art for me? Real art, in your world, with real crayons?');
        await say('dot', 'Tap my easel. It always knows what to make next.');
        save.flags.dotMet = true; persist();
      });
    } else if (save.pending && save.pending.at === 'studio') {
      cut(async () => { if (!o.arrive) { FX.fade = 1; await fadeIn(500); } await say('dot', 'Your present is still here!'); await this.reward(); });
    } else if (o.tell && save.active.art) {
      cut(async () => { FX.fade = 1; await fadeIn(500); await this.tellArt(true); });
    } else cut(async () => { if (!o.arrive) { FX.fade = 1; await fadeIn(500); } await maybeResumeQuest(); });
  },
};
function studioItemSpots(S) {
  const has = (k) => () => save.items.studio.includes(k);
  const line = (key, lines) => async () => { await say('n', cycle(lines, key, S.st)); };
  return [
    { rect: [92, 162, 80, 28], when: has('rug'), stand: [132, 190], act: line('rug', ['A rainbow rug. Every color, in a circle.', 'You stand on purple. You feel fancy.']) },
    { rect: [100, 92, 24, 62], when: has('sunflower'), stand: [112, 184], act: line('sun', ['The sunflower is facing the round window. It knows where the sun is.', 'It is very tall. Dot pretends it is not.']) },
    { rect: [84, 136, 16, 24], when: has('crayons'), stand: [92, 184], act: line('cray', ['A giant jar of crayons. Every color. Even the weird ones.', 'You find a crayon called "Dragon Burp Green." Good name.']) },
  ];
}

// ===================== The Bathroom =====================
SCENES.bath = {
  song: 'drab', walk: [24, 162, 270, 194], room: 'bath', host: 'bubbles',
  enter(o = {}) {
    save.lastRoom = 'bath';
    this.alive = bgOf('bathAlive', W, H, paintBath);
    this.drab = bgOf('bathDrab', W, H, (g) => { g.drawImage(recolor(this.alive, drab), 0, 0); });
    const awake = !!save.flags.bathAwake;
    this.reveal = awake ? 999 : 0; this.song = awake ? 'warm' : 'drab';
    this.st = {}; this.presents = null; this.preview = null; this.choosing = false; this.jarK = 0;
    zoe.visible = true;
    if (o.arrive) { zoe.x = 250; zoe.y = 188; zoe.face(-1); } else { zoe.x = 150; zoe.y = 186; zoe.face(1); }
    this.bubbles = new Sparkee({ r: 5, seed: 63, x: 120, y: 184, name: 'bubbles', acc: 'crown' });
    this.bubbles.glow = awake ? 1 : 0.22; this.bubbles.look = zoe;
    if (!save.flags.bathMet) { this.bubbles.visible = false; this.bubbles.x = 60; this.bubbles.y = 140; }
    this.sps = [this.bubbles];
    this.actors = [zoe, this.bubbles];
    const self = this;
    const slotDone = () => !!todayRoutines()[slotNow() + '_brush'];
    hints = [
      { x: 176, y: 114, strong: true, when: () => save.flags.bathMet && !slotDone() && !self.presents },
      { x: 222, y: 72, off: 0.7, when: () => save.flags.bathMet && save.jar >= JAR_SIZE - 2 && !self.presents },
      { x: 132, y: 186, strong: true, when: () => !!self.presents && !self.choosing },
    ];
    const line = (key, lines) => async () => { await say('n', cycle(lines, key, self.st)); };
    this.hotspots = [
      { rect: [248, 86, 40, 68], stand: [256, 188], act: () => self.toStudio() },
      { rect: [12, 110, 96, 50], stand: [70, 186], act: line('tub', ['A big bathtub with golden feet.', 'Sparkees take baths in a teacup. This tub is for show.']) },
      { rect: [112, 114, 26, 42], stand: [128, 186], act: line('loo', ['A very small toilet.', 'Bubbles is very proud of it. Do not ask why.', 'You decide not to ask.']) },
      { rect: [34, 28, 50, 46], stand: [60, 186], act: line('win', ['A frosty window. You can see the forest through it. Sort of.', 'Someone drew a smiley face in the frost. It was Bubbles.']) },
      { rect: [206, 116, 30, 26], stand: [220, 186], act: line('towel', ['A pink towel. Very fluffy.', 'It is folded perfectly. Bubbles did that with no hands. Somehow.']) },
      { rect: [158, 58, 36, 46], stand: [176, 186], face: 'front', act: async () => { await say('n', cycle(["It's you! Your teeth look ready for anything.", 'You smile at the mirror. The mirror smiles back. It is very good at copying.'], 'mir', self.st)); await openMirror(); } },
      { rect: [160, 104, 34, 52], stand: [168, 186], face: 1, act: () => self.sink() },
      { rect: [210, 70, 24, 30], stand: [222, 186], face: 'front', act: () => self.jarTalk() },
      ...bathItemSpots(self),
      { hit: (x, y) => self.bubbles.visible && Math.hypot(self.bubbles.x - x, self.bubbles.y - 5 - y) < 10, when: () => !self.presents, stand: () => [clamp(self.bubbles.x - 20, 30, 250), clamp(self.bubbles.y, 170, 194)], act: () => self.talkBubbles() },
      Presents.hotspot(self),
    ];
  },
  async toStudio() {
    if (this.presents) { await say('bubbles', 'Wait! Your present!'); return; }
    AU.sfx('creak');
    await fadeOut(400);
    goScene('studio', {});
    zoe.x = 248; zoe.y = 186; zoe.face(-1);
  },
  async talkBubbles() {
    const B = this.bubbles, t = todayRoutines(), slot = slotNow();
    B.expr = 'happy';
    if (!t[slot + '_brush']) await say('bubbles', slot === 'am' ? 'Good morning! Did you brush your teeth yet?' : 'Have you brushed your teeth tonight? Bubbles is asking for a friend. The friend is your teeth.');
    else await say('bubbles', cycle(['Bubbles. Like the bubbles. The best part of a bath.', 'Fun fact: Sparkees have 32 teeth. Each one is the size of a grain of sugar.', 'Remember: little circles! Never scrub like a floor.', 'Floss gets the sneaky crumbs. The crumbs hate floss.', 'Captain Quack says hello. Captain Quack is a duck.'], 'bub', this.st));
    B.expr = 'norm';
  },
  async jarTalk() {
    const B = this.bubbles, n = save.jar, t = todayRoutines();
    AU.sfx('twinkle'); this.jarK = 1; tween(800, (k) => { this.jarK = 1 - k; });
    await say('n', `The Sparkle Jar. ${n} of ${JAR_SIZE} sparkles.`);
    const done = [t.am_brush && 'brushed this morning', t.pm_brush && 'brushed tonight', t.floss && 'flossed'].filter(Boolean);
    if (!save.flags.bathMet) return;
    if (done.length) await say('bubbles', `Today you ${done.length === 1 ? done[0] : done.slice(0, -1).join(', ') + ' and ' + done[done.length - 1]}!`);
    await say('bubbles', n >= JAR_SIZE - 1 ? 'One more sparkle and something golden happens!' : 'Brush or floss, then tap the sink, and a sparkle goes in.');
  },
  async sink() {
    if (!save.flags.bathMet) return;
    if (this.presents || save.pending) { await say('bubbles', 'Open your present first!'); return; }
    const r = await openSinkCard();
    if (!r) return;
    if (r === 'along') {
      const finished = await this.brushAlong();
      if (finished) await this.logRoutines(['brush']);
      return;
    }
    await this.logRoutines(r);
  },
  async brushAlong() {
    const B = this.bubbles;
    B.expr = 'happy';
    await say('bubbles', 'Brush along! Get your toothbrush and some toothpaste.');
    const ok = await ask('bubbles', 'Bubbles will brush too. Ready?', ['Ready!', 'Not right now.']);
    if (ok === 1) { await say('bubbles', 'Okay! Bubbles will keep the toothbrush warm.'); return false; }
    await B.goto(196, 184, 50); B.look = zoe;
    B.acc = 'crown brush foam';
    const parts = [
      ['Top teeth, this side', ['Little circles!', 'Swish swish swish.']],
      ['Top teeth, that side', ['Do not forget the back teeth!', 'All the way in the back!']],
      ['Bottom teeth, this side', ['Brush, brush, brush!', 'Bubbles is getting foamy.']],
      ['Bottom teeth, that side', ['Almost done!', 'Now your tongue! Bleh!']],
    ];
    const bar = brushBar();
    let stopped = false;
    bar.stop.addEventListener('click', (e) => { e.stopPropagation(); stopped = true; });
    AU.sfx('chime');
    const total = 120, t0 = performance.now();
    let part = -1;
    await new Promise((res) => {
      const step = () => {
        const sec = (performance.now() - t0) / 1000;
        if (stopped || sec >= total) return res();
        const p = Math.min(3, Math.floor(sec / 30));
        if (p !== part) {
          part = p; AU.sfx(p === 0 ? 'sparkle' : 'chime');
          bar.part.textContent = parts[p][0];
          [...bar.dots.children].forEach((d, i) => d.classList.toggle('on', i <= p));
          bubble(B, parts[p][1][0], 2400, true);
        } else if (Math.floor(sec) % 30 === 15 && !step.mid) { step.mid = true; bubble(B, parts[p][1][1], 2400, true); }
        if (Math.floor(sec) % 30 !== 15) step.mid = false;
        bar.fill.style.width = `${(sec / total) * 100}%`;
        bar.time.textContent = `${Math.max(0, Math.ceil(total - sec))}`;
        if (Math.random() < 0.15) emit({ kind: 'spark', x: B.x + (Math.random() - 0.5) * 8, y: B.y - 6, vy: -8, vx: (Math.random() - 0.5) * 10, life: 0.7, c: '#FFFFFF', layer: 'front' });
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
    bar.root.remove();
    B.acc = 'crown';
    if (stopped) {
      const r = await ask('bubbles', 'Done already? Did you finish brushing?', ['Yes, all done!', 'Not really.']);
      return r === 0;
    }
    AU.sfx('cheer'); B.expr = 'star'; B.hop(true);
    await say('bubbles', 'Two whole minutes! Your dentist would be so proud.');
    B.hop(false); B.expr = 'happy';
    await say('bubbles', 'Now spit! Into the sink, please. Not on Bubbles.');
    return true;
  },
  async logRoutines(kinds) {
    const B = this.bubbles, t = todayRoutines(), slot = slotNow();
    const keyOf = (k) => (k === 'brush' ? slot + '_brush' : 'floss');
    const fresh = kinds.filter((k) => !t[keyOf(k)]), old = kinds.filter((k) => t[keyOf(k)]);
    B.expr = 'happy';
    if (!fresh.length) {
      if (old.includes('brush')) await say('bubbles', slot === 'am' ? 'You already brushed this morning! Super brusher! Come back tonight for another sparkle.' : 'You already brushed tonight! Your teeth are SO clean. Come back in the morning for another sparkle.');
      else await say('bubbles', 'You already flossed today! Your gums are cheering. Floss again tomorrow for another sparkle.');
      return;
    }
    for (const k of fresh) { markRoutine(keyOf(k)); save.counts[k] = (save.counts[k] || 0) + 1; }
    persist();
    B.expr = 'star'; B.jump(110);
    if (fresh.length === 2) await say('bubbles', cycle(['Brushing AND flossing! A double sparkle!', 'Both! Your teeth are throwing a party.', 'Brush and floss! Bubbles is doing a happy splash.'], 'both', this.st));
    else if (fresh[0] === 'brush') await say('bubbles', cycle(['Sparkly teeth! Show me!', 'Look at those teeth. Bubbles is blinded!', 'Minty fresh! Bubbles can smell it from here.'], 'br', this.st));
    else await say('bubbles', cycle(['Flossing! The secret hero of teeth.', 'Floss: the tiny string that does big work.', 'In between! Where the sneaky crumbs hide.'], 'fl', this.st));
    if (old.length) await say('bubbles', old[0] === 'brush' ? '(Brushing already counted this time. The floss sparkle goes in!)' : '(Flossing already counted today. The brushing sparkle goes in!)');
    // sparkles fly into the jar, one per thing done
    for (let i = 0; i < fresh.length; i++) {
      await streamMagic([zoe.x, zoe.y - 30], [BATH.jar[0], BATH.jar[1] - 10], 6, { colors: ['#FFD84A', '#FFF6C8'], gap: 60 });
      save.jar = save.jar + 1; persist();
      AU.sfx('chime'); this.jarK = 1; tween(900, (k) => { this.jarK = 1 - k; });
      burst(BATH.jar[0], BATH.jar[1] - 10, 12, { speed: 22, c: '#FFE38A', extra: { layer: 'front' } });
    }
    if (!save.flags.bathAwake) {
      await sleep(400);
      await wakeRoom(this, BATH.sink[0], BATH.sink[1], [B]);
      save.flags.bathAwake = true; persist();
      B.expr = 'star';
      await say('bubbles', 'Whoa! The whole bathroom is sparkling! Clean teeth are a kind of magic.');
    }
    const now = todayRoutines();
    if (now.am_brush && now.pm_brush && now.floss && !this.st.perfect) { this.st.perfect = true; await say('bubbles', 'Morning, night, AND floss! That is a perfect teeth day.'); }
    if (save.jar >= JAR_SIZE) return this.golden();
    const left = JAR_SIZE - save.jar;
    await say('bubbles', left <= 3 ? `${left} more ${left === 1 ? 'sparkle' : 'sparkles'} until the jar is full!` : 'Into the Sparkle Jar!');
    B.expr = 'norm';
  },
  async golden() {
    const B = this.bubbles;
    B.expr = 'star'; B.arms = 'up'; B.hop(true);
    AU.sfx('surprise');
    await say('bubbles', 'The Sparkle Jar is FULL!');
    B.hop(false); B.arms = 'down';
    AU.sfx('whoosh');
    await streamMagic([BATH.jar[0], BATH.jar[1] - 12], [132, 186], 24, { colors: ['#FFD84A', '#FFF6C8', '#F2B030'], gap: 50 });
    save.jar = Math.max(0, save.jar - JAR_SIZE); persist();
    const ok = Presents.offer(this, 'bath', [[110, 192], [132, 196], [154, 192]], { golden: true });
    if (!ok) {
      await say('bubbles', 'The bathroom already has every present Bubbles can think of!');
      await say('bubbles', 'So these sparkles go up into the sky. Look!');
      for (let i = 0; i < 20; i++) emit({ kind: 'star', x: 120 + Math.random() * 40, y: 180, vy: -60 - Math.random() * 40, vx: (Math.random() - 0.5) * 30, life: 2, c: '#FFE38A', layer: 'front' });
      await sleep(1200);
      await say('bubbles', 'A brand-new jar starts now!');
      return;
    }
    await zoe.walkTo(90, 188); zoe.face(1);
    await say('bubbles', 'Golden presents! Pick one for the bathroom. Tap one to peek inside.');
  },
  async onPlaced(item) {
    const B = this.bubbles;
    AU.sfx('twinkle');
    if (item === 'duck') { await say('bubbles', 'Captain Quack! Welcome aboard!'); }
    else if (item === 'bubbles') { B.expr = 'star'; await say('bubbles', 'Bubbles loves bubbles. Obviously.'); }
    else await Presents.admire(this, item, ['Ooh!', 'So fancy!', 'Squeaky clean!']);
    B.expr = 'happy';
    await say('bubbles', 'The bathroom looks wonderful. A brand-new jar starts now!');
    B.expr = 'norm';
  },
  drawBg(g) {
    drawReveal(g, this.drab, this.alive, BATH.sink[0], BATH.sink[1], this.reveal);
    if (this.reveal >= 340) { D.glow(g, 120, 30, 70, '#FFE9A8', 0.07, 5); D.glow(g, 120, 24, 12, '#FFF1C8', 0.2, 3); }
    Presents.drawBg(this, g);
    drawJar(g, BATH.jar[0], BATH.jar[1], save.jar, T, this.jarK);
  },
  drawFg(g) { Presents.drawFg(this, g); },
  update(dt) {
    if (this.reveal < 340 && Math.random() < dt * 1.5) emit({ kind: 'mote', x: 20 + Math.random() * 250, y: 40 + Math.random() * 110, life: 5, c: '#B8B2C4', a: 0.6 });
    if (this.reveal >= 340 && Math.random() < dt * 0.7) { const x = 20 + Math.random() * 80; emit({ kind: 'spark', x, y: 126, vy: -8, vx: (Math.random() - 0.5) * 4, life: 1.6, c: '#FFFFFF', layer: 'front' }); }
  },
  start(o = {}) {
    if (!save.flags.bathMet) {
      cut(async () => {
        FX.fade = 1; await fadeIn(500);
        await zoe.walkTo(214, 186); zoe.face(-1);
        await narrate('A bathroom! In a treehouse!', 'There is a bathtub, a sink, and a very small toilet.', 'Everything is grey. Even the towel. Towels should never be grey.');
        const B = this.bubbles;
        B.visible = true; AU.sfx('pop'); B.jump(150);
        for (let i = 0; i < 12; i++) emit({ kind: 'spark', x: 50 + Math.random() * 30, y: 128, vy: -20 - Math.random() * 20, vx: (Math.random() - 0.5) * 20, life: 1.2, c: '#FFFFFF', layer: 'front' });
        await B.goto(150, 184, 60);
        B.expr = 'star';
        await say('bubbles', 'Ta-da!');
        B.expr = 'happy';
        await say('bubbles', 'I am Bubbles. I am in charge of teeth.');
        await say('n', '(Sparkees have teeth. Who knew?)');
        await say('bubbles', 'Every morning and every night, Sparkees brush their tiny teeth. And we floss!');
        B.expr = 'sad';
        await say('bubbles', 'But since the magic faded, this bathroom lost all its sparkle.');
        B.expr = 'happy';
        await say('bubbles', 'So here is the deal. When you brush YOUR teeth, or floss, tap the sink and tell me.');
        this.jarK = 1; tween(1500, (k) => { this.jarK = 1 - k; }); AU.sfx('twinkle');
        await say('bubbles', 'Every time, a sparkle goes in the Sparkle Jar. When the jar is full, something golden happens.');
        await say('bubbles', 'You can brush along with me, too. I count to two minutes. I am very good at counting. Mostly.');
        save.flags.bathMet = true; persist();
      });
    } else if (save.pending && save.pending.at === 'bath') {
      cut(async () => { FX.fade = 1; await fadeIn(500); await say('bubbles', 'Your golden present is still here! Tap it!'); Presents.offer(this, 'bath', [[110, 192], [132, 196], [154, 192]]); });
    } else cut(async () => { FX.fade = 1; await fadeIn(500); await maybeResumeQuest(); });
  },
};
function bathItemSpots(S) {
  const has = (k) => () => save.items.bath.includes(k);
  return [
    { rect: [88, 112, 20, 16], when: has('duck'), stand: [96, 186], act: async () => { AU.sfx('squish'); await say('n', cycle(['Squeak! Captain Quack salutes you.', 'Captain Quack is the bravest duck on the seven bathtubs.'], 'duck', S.st)); } },
    { rect: [150, 162, 52, 20], when: has('bathrug'), stand: [176, 190], act: async () => { await say('n', cycle(['A fluffy bath mat. Your toes say thank you.', 'So soft. Sparkees nap on it sometimes.'], 'rug', S.st)); } },
    { rect: [192, 136, 14, 16], when: has('nightlight'), stand: [196, 186], act: async () => { AU.sfx('twinkle'); await say('n', 'A little star nightlight. For brushing in the dark.'); } },
    { rect: [136, 120, 22, 34], when: has('fern'), stand: [146, 186], act: async () => { await say('n', cycle(['A fern! Ferns love bathrooms.', 'It is a fern fact. Bubbles has a lot of fern facts.'], 'fern', S.st)); } },
  ];
}
// the brush-along timer, drawn over the scene (not a modal, so the scene stays visible)
function brushBar() {
  const fill = h('div', { class: 'bfill' }), time = h('div', { class: 'btime' }, '120'), part = h('div', { class: 'bpart' }, 'Get ready...');
  const dots = h('div', { class: 'bdots' }, h('i'), h('i'), h('i'), h('i'));
  const stop = h('button', { class: 'bstop', type: 'button' }, 'Stop');
  const root = h('div', { class: 'brushbar ui' }, h('div', { class: 'btop' }, pixImg(ICONS.e_brush, 1, 'bicon'), part, dots, time), h('div', { class: 'btrack' }, fill), stop);
  $('#stage').append(root);
  return { root, fill, time, part, dots, stop };
}
