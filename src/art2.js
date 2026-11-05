// ===================== Icons for answers & family =====================
function emblemIcon(kind) {
  const [c, g] = mk(20, 20);
  const face = (col, mouth) => { D.disc(g, 10, 10, 8, col); D.r(g, 7, 7, 1, 2, C.ink); D.r(g, 12, 7, 1, 2, C.ink); if (mouth) mouth(); };
  switch (kind) {
    case 'heart': D.disc(g, 6, 7, 4, '#E8628A'); D.disc(g, 13, 7, 4, '#E8628A'); D.poly(g, [[2, 8], [17, 8], [10, 17]], '#E8628A'); D.p(g, 5, 5, '#FFD0DC'); D.p(g, 6, 5, '#FFD0DC'); break;
    case 'tent': D.poly(g, [[1, 17], [10, 2], [19, 17]], '#E8893F'); D.poly(g, [[7, 17], [10, 9], [13, 17]], '#5A2E10'); D.line(g, 10, 2, 10, 0, C.ink); D.poly(g, [[10, 0], [15, 1], [10, 3]], '#DB95B5'); D.r(g, 0, 17, 20, 2, '#5D6A3E'); break;
    case 'bed': D.r(g, 1, 10, 18, 6, '#5A84C4'); D.r(g, 1, 7, 6, 4, C.white); D.r(g, 1, 6, 2, 12, '#7A4E33'); D.r(g, 17, 9, 2, 9, '#7A4E33'); D.r(g, 7, 10, 10, 2, '#7A9AD8'); break;
    case 'pillow': D.ell(g, 10, 13, 9, 4, '#9A6AB0'); D.ell(g, 9, 9, 8, 4, '#F2C94C'); D.ell(g, 11, 5, 6, 3, '#E98AA2'); D.p(g, 7, 4, C.white); break;
    case 'table': D.r(g, 1, 6, 18, 3, '#9C6B45'); D.r(g, 2, 9, 2, 10, '#7A4E33'); D.r(g, 16, 9, 2, 10, '#7A4E33'); D.disc(g, 10, 15, 3, '#FFD84A'); D.p(g, 9, 14, C.ink); D.p(g, 11, 14, C.ink); break;
    case 'sun': for (let a = 0; a < 8; a++) { const r = a * Math.PI / 4; D.line(g, 10 + Math.cos(r) * 6, 10 + Math.sin(r) * 6, 10 + Math.cos(r) * 9, 10 + Math.sin(r) * 9, '#F2B030'); } D.disc(g, 10, 10, 5, '#FFD84A'); break;
    case 'star': D.poly(g, [[10, 1], [12.5, 7], [19, 7.5], [14, 11.5], [16, 18], [10, 14.5], [4, 18], [6, 11.5], [1, 7.5], [7.5, 7]], '#FFD84A'); D.p(g, 9, 5, C.white); break;
    case 'splash': for (const [x, y, r, col] of [[7, 8, 5, '#E98AA2'], [13, 7, 4, '#3E5AA8'], [11, 13, 5, '#F2C94C'], [5, 14, 3, '#6F8A45'], [16, 14, 2, '#E8893F']]) D.disc(g, x, y, r, col); break;
    case 'yes': D.disc(g, 10, 10, 9, '#6F9A45'); D.line(g, 5, 10, 8, 14, C.white); D.line(g, 5, 11, 8, 15, C.white); D.line(g, 8, 14, 15, 5, C.white); D.line(g, 8, 15, 15, 6, C.white); break;
    case 'maybe': D.disc(g, 10, 10, 9, '#E8A832'); for (let x = 4; x < 16; x++) { D.p(g, x, 10 + Math.round(Math.sin(x) * 1.5), C.white); D.p(g, x, 11 + Math.round(Math.sin(x) * 1.5), C.white); } break;
    case 'no': D.disc(g, 10, 10, 9, '#C8323C'); D.line(g, 6, 6, 14, 14, C.white); D.line(g, 7, 6, 15, 14, C.white); D.line(g, 14, 6, 6, 14, C.white); D.line(g, 15, 6, 7, 14, C.white); break;
    case 'shield': D.poly(g, [[3, 2], [17, 2], [17, 10], [10, 19], [3, 10]], '#3E5AA8'); D.poly(g, [[5, 4], [15, 4], [15, 10], [10, 16], [5, 10]], '#5A84C4'); D.poly(g, [[10, 5], [11.5, 9], [15, 9], [12, 11], [13, 15], [10, 12.5], [7, 15], [8, 11], [5, 9], [8.5, 9]], '#FFD84A'); break;
    case 'bulb': D.disc(g, 10, 8, 6, '#FFE38A'); D.r(g, 7, 13, 6, 3, '#FFE38A'); D.r(g, 7, 16, 6, 3, '#8A8494'); D.r(g, 7, 17, 6, 1, '#6A6474'); D.p(g, 8, 5, C.white); D.p(g, 7, 6, C.white); break;
    case 'smile': face('#FFD84A', () => { D.p(g, 6, 12, C.ink); D.r(g, 7, 13, 6, 1, C.ink); D.p(g, 13, 12, C.ink); }); break;
    case 'laugh': D.disc(g, 10, 10, 8, '#FFD84A'); D.line(g, 5, 7, 7, 6, C.ink); D.line(g, 7, 6, 9, 7, C.ink); D.line(g, 11, 7, 13, 6, C.ink); D.line(g, 13, 6, 15, 7, C.ink); D.ell(g, 10, 13, 4, 2, '#9A3A14'); D.r(g, 8, 14, 4, 1, '#E86A6A'); D.p(g, 3, 8, '#8FD0F0'); D.p(g, 16, 8, '#8FD0F0'); break;
    case 'floor': D.disc(g, 10, 10, 8, '#FFD84A'); D.line(g, 6, 12, 8, 13, C.ink); D.line(g, 12, 13, 14, 12, C.ink); D.ell(g, 10, 7, 3, 2, '#9A3A14'); D.r(g, 0, 18, 20, 2, '#9C6B45'); D.p(g, 3, 3, '#8FD0F0'); D.p(g, 17, 4, '#8FD0F0'); break;
    case 'friends': D.disc(g, 6, 9, 5, '#FFD84A'); D.disc(g, 14, 10, 5, '#F2A0B0'); D.p(g, 4, 8, C.ink); D.p(g, 7, 8, C.ink); D.p(g, 12, 9, C.ink); D.p(g, 15, 9, C.ink); D.r(g, 5, 11, 2, 1, C.ink); D.r(g, 13, 12, 2, 1, C.ink); D.r(g, 9, 15, 3, 2, '#E8628A'); break;
    case 'robot': D.r(g, 4, 5, 12, 11, '#9AAABE'); D.r(g, 9, 1, 2, 4, '#6A7A8E'); D.disc(g, 10, 1, 1, '#C8323C'); D.r(g, 6, 8, 3, 3, '#5ACDE0'); D.r(g, 11, 8, 3, 3, '#5ACDE0'); D.r(g, 7, 13, 6, 1, C.ink); D.r(g, 2, 9, 2, 4, '#6A7A8E'); D.r(g, 16, 9, 2, 4, '#6A7A8E'); break;
    case 'moon': D.disc(g, 10, 10, 8, '#F6E4B8'); D.disc(g, 14, 7, 7, 'rgba(0,0,0,0)'); g.globalCompositeOperation = 'destination-out'; D.disc(g, 14, 7, 7, '#000'); g.globalCompositeOperation = 'source-over'; D.p(g, 5, 9, '#E0C890'); break;
    case 'dark': D.disc(g, 10, 10, 9, '#2E2A50'); for (const [x, y] of [[6, 6], [13, 5], [10, 12], [15, 13], [5, 14]]) D.p(g, x, y, '#FFF1C8'); D.twinkle(g, 13, 5, 1, '#FFF1C8'); break;
    case 'cloud': D.disc(g, 7, 11, 5, '#E8E2F2'); D.disc(g, 12, 8, 6, '#F2EEF8'); D.disc(g, 15, 12, 4, '#E8E2F2'); D.r(g, 4, 12, 14, 4, '#F2EEF8'); D.p(g, 9, 12, '#9A90B0'); D.p(g, 13, 11, '#9A90B0'); break;
    case 'note': D.r(g, 6, 4, 1, 11, '#5A3A6A'); D.r(g, 14, 3, 1, 11, '#5A3A6A'); D.line(g, 6, 4, 14, 2, '#5A3A6A'); D.line(g, 6, 5, 14, 3, '#5A3A6A'); D.line(g, 6, 6, 14, 4, '#5A3A6A'); D.ell(g, 4, 15, 3, 2, '#9A6AB0'); D.ell(g, 12, 14, 3, 2, '#9A6AB0'); D.p(g, 3, 14, '#C8A0D8'); D.p(g, 11, 13, '#C8A0D8'); break;
    case 'book': D.poly(g, [[1, 4], [9, 3], [10, 5], [11, 3], [19, 4], [19, 16], [11, 15], [10, 17], [9, 15], [1, 16]], C.ink); D.poly(g, [[2, 5], [9, 4], [9, 15], [2, 15]], C.white); D.poly(g, [[11, 4], [18, 5], [18, 15], [11, 15]], C.white); for (const y of [7, 9, 11]) { D.r(g, 3, y, 5, 1, '#B0A090'); D.r(g, 12, y, 5, 1, '#B0A090'); } break;
    case 'eyes': D.ell(g, 6, 10, 4, 5, C.white); D.ell(g, 14, 10, 4, 5, C.white); D.disc(g, 7, 11, 2, C.ink); D.disc(g, 15, 11, 2, C.ink); D.p(g, 6, 10, C.white); D.p(g, 14, 10, C.white); break;
    case 'brush': D.r(g, 2, 12, 14, 3, '#5ACDE0'); D.r(g, 2, 12, 14, 1, '#9AE8F0'); D.r(g, 12, 7, 6, 5, C.white); for (let x = 12; x < 18; x += 2) D.r(g, x, 7, 1, 5, '#C8E8F0'); D.disc(g, 15, 5, 2, '#FFFFFF'); D.disc(g, 12, 4, 1, '#E8F6FA'); break;
    case 'floss': D.r(g, 3, 9, 10, 8, '#9ACDE0'); D.r(g, 3, 9, 10, 2, '#E8F6FA'); D.line(g, 12, 9, 18, 2, '#FFFFFF'); D.line(g, 13, 9, 19, 3, '#C8D8E0'); D.r(g, 5, 13, 6, 1, '#5A8AA0'); break;
    case 'tree': D.r(g, 9, 11, 3, 8, '#7A4E33'); D.r(g, 6, 18, 9, 1, '#6F9A45'); D.disc(g, 10, 8, 7, '#6F9A45'); D.disc(g, 8, 6, 3, '#8EB05A'); for (const [x, y, c] of [[6, 8, '#E8628A'], [13, 6, '#F2C94C'], [11, 11, '#5A84C4']]) { D.disc(g, x, y, 1, c); } break;
    case 'camera': D.r(g, 1, 6, 18, 12, '#3A3442'); D.r(g, 6, 3, 8, 3, '#3A3442'); D.disc(g, 10, 12, 5, '#9ACDE0'); D.disc(g, 10, 12, 3, '#2E3D4A'); D.p(g, 9, 11, C.white); D.r(g, 15, 8, 2, 2, '#E8628A'); break;
  }
  return outlined(c, C.ink);
}
function personIcon(kind, skin) {
  if (kind === 'me') {
    const F = zoeFrames(save.look); const [c, g] = mk(22, 22); g.drawImage(F.front, -1, 0); return c;
  }
  const [c, g] = mk(20, 20);
  const sk = skin.s, sh = skin.S;
  const hair = { mom: '#5A3220', dad: '#3A2A22', brother: '#8C5A34', sister: '#5A3220', baby: '#B88A5A', grandma: '#C8C2CC', grandpa: '#C8C2CC', aunt: '#B4502A', uncle: '#2A2230', cousin: '#D9A848' }[kind];
  const shirt = { mom: '#E98AA2', dad: '#5A84C4', brother: '#7D9A4C', sister: '#F0903E', baby: '#F2C94C', grandma: '#9A6AB0', grandpa: '#7A6E6E', aunt: '#DCA438', uncle: '#B4502A', cousin: '#5ACDE0' }[kind];
  const small = kind === 'baby';
  const r = small ? 5 : 6, cy = small ? 11 : 9;
  if (kind === 'mom' || kind === 'aunt') D.ell(g, 10, cy + 3, r + 2, r + 3, hair);
  if (kind === 'sister') { D.disc(g, 3, cy + 2, 3, hair); D.disc(g, 17, cy + 2, 3, hair); }
  if (kind === 'cousin') D.ell(g, 16, cy + 4, 2, 5, hair);
  D.r(g, small ? 6 : 4, 17, small ? 8 : 12, 3, shirt);
  D.disc(g, 10, cy, r, sk);
  D.p(g, 10 + r - 1, cy + 1, sh);
  // hair on top
  if (kind === 'mom' || kind === 'sister' || kind === 'cousin') { D.ell(g, 10, cy - r + 2, r, 2, hair); D.r(g, 10 - r + 1, cy - r + 1, 2 * r - 1, 2, hair); }
  if (kind === 'dad' || kind === 'uncle') { D.ell(g, 10, cy - r + 2, r, 2, hair); }
  if (kind === 'brother') { for (let x = 5; x <= 15; x += 2) D.r(g, x, cy - r - 1, 1, 3, hair); D.ell(g, 10, cy - r + 2, r, 2, hair); }
  if (kind === 'aunt') { for (let a = 0; a < 7; a++) D.disc(g, 4 + a * 2, cy - r + 1 + (a % 2), 2, hair); }
  if (kind === 'grandma') { D.disc(g, 10, cy - r - 1, 3, hair); D.ell(g, 10, cy - r + 2, r, 2, hair); }
  if (kind === 'grandpa') { D.r(g, 10 - r, cy - 2, 2, 4, hair); D.r(g, 10 + r - 1, cy - 2, 2, 4, hair); D.r(g, 8, cy + 3, 5, 1, hair); }
  if (kind === 'baby') { D.p(g, 10, cy - r - 1, hair); D.p(g, 11, cy - r - 2, hair); D.p(g, 9, cy - r, hair); }
  if (kind === 'uncle') { D.ell(g, 10, cy + 4, 4, 2, hair); }
  // face
  D.r(g, 8, cy - 1, 1, 2, C.ink); D.r(g, 12, cy - 1, 1, 2, C.ink);
  if (kind !== 'uncle') { D.p(g, 9, cy + 3, C.ink); D.p(g, 10, cy + 3, C.ink); D.p(g, 11, cy + 3, C.ink); D.p(g, 8, cy + 2, C.ink); D.p(g, 12, cy + 2, C.ink); }
  if (kind === 'grandma' || kind === 'grandpa') { D.ring(g, 8, cy, 2, '#6A5E66'); D.ring(g, 12, cy, 2, '#6A5E66'); D.p(g, 10, cy, '#6A5E66'); }
  if (!small) { D.p(g, 6, cy + 2, '#EFA196'); D.p(g, 14, cy + 2, '#EFA196'); } else { D.p(g, 7, cy + 2, '#EFA196'); D.p(g, 13, cy + 2, '#EFA196'); }
  return outlined(c, C.ink);
}
const EMBLEMS = ['tree', 'heart', 'tent', 'bed', 'pillow', 'table', 'sun', 'star', 'splash', 'yes', 'maybe', 'no', 'shield', 'bulb', 'smile', 'laugh', 'floor', 'friends', 'robot', 'moon', 'dark', 'cloud', 'note', 'book', 'eyes', 'brush', 'floss', 'camera'];
const PEOPLE = ['me', 'mom', 'dad', 'brother', 'sister', 'baby', 'grandma', 'grandpa', 'aunt', 'uncle', 'cousin'];
function makeIcons2() {
  for (const e of EMBLEMS) ICONS['e_' + e] = emblemIcon(e);
  rebuildPeopleIcons();
}
function rebuildPeopleIcons() { const sk = SKINS[save.look.skin] || SKINS[0]; for (const p of PEOPLE) ICONS['p_' + p] = personIcon(p, sk); }

// ===================== Books =====================
function readQuest(id) { return READ_QUESTS.find((q) => q.id === id) || READ_QUESTS[0]; }
function bookColor(b) {
  const q = readQuest(b.q || 'animal');
  if (q.cover.fromColor && b.color) { const c = COVER_COLORS.find((x) => x[0] === b.color); if (c) return c[2]; }
  return q.cover.color;
}
function bookIcon(b) { if (b.animal) return ICONS['a_' + b.animal]; return ICONS['e_' + readQuest(b.q).cover.emblem]; }
// book can be a book record or (legacy) an animal key
function drawBookCover(g, x, y, b) {
  if (typeof b === 'string') b = { q: 'animal', animal: b };
  const col = bookColor(b), light = mix(col, '#FFFFFF', 0.25);
  D.r(g, x, y, 24, 24, C.ink);
  D.r(g, x + 1, y + 1, 21, 22, col); D.r(g, x + 22, y + 1, 1, 22, C.parch); D.r(g, x + 1, y + 1, 21, 1, light);
  D.r(g, x + 2, y + 2, 19, 1, C.gold); D.r(g, x + 2, y + 21, 19, 1, C.gold);
  const ic = bookIcon(b);
  if (ic) g.drawImage(ic, x + 1, y + 1);
  D.r(g, x + 17, y + 20, 2, 5, '#C8323C');
}
function drawSpine(g, x, y, h, col) {
  D.r(g, x, y, 4, h, C.ink); D.r(g, x, y + 1, 3, h - 1, col); D.r(g, x, y + 1, 1, h - 1, mix(col, '#FFFFFF', 0.25));
  D.r(g, x, y + 3, 3, 1, C.gold); D.r(g, x, y + h - 4, 3, 1, C.gold);
}
// spine slots in the library bookshelf, oldest first
const SPINE_SLOTS = (() => {
  const s = [];
  for (const [x0, y, h, n] of [[22, 76, 16, 8], [22, 98, 14, 8], [66, 76, 16, 5], [22, 118, 14, 8], [86, 118, 14, 5], [44, 138, 8, 4]]) for (let i = 0; i < n; i++) s.push([x0 + i * 5, y, h]);
  return s;
})();

// ===================== Library items =====================
// the hatch in the library ceiling, with the rolling ladder reaching up to it
function drawHatch(g, k, bright) {
  const x = 106, y = 9, w = 24, h = 11;
  const open = Math.round(h * k);
  D.r(g, x - 2, y - 2, w + 4, h + 4, C.wood1);
  D.r(g, x, y, w, h, bright ? '#FFE9B8' : '#B8AE9C');
  if (bright) D.glow(g, x + w / 2, y + h, 26, '#FFE38A', 0.18 + 0.05 * Math.sin(T * 2), 3);
  else D.dith(g, x, y, w, h, '#8A8070', 2);
  // the trapdoor swings down
  D.r(g, x, y + h - (h - open), w, Math.max(1, h - open), C.wood3);
  D.r(g, x + w - 3, y + h, 3, Math.round(12 * k), C.wood3); D.r(g, x + w - 3, y + h, 1, Math.round(12 * k), C.wood5);
  // ladder extension, above the collar beam
  if (k > 0.5) {
    const top = y + h - 1;
    D.line(g, 112, 40, 114, top, C.wood4); D.line(g, 118, 40, 120, top, C.wood4);
    for (let yy = top + 3; yy < 38; yy += 8) { D.r(g, 113, yy, 7, 2, C.wood3); D.r(g, 113, yy, 7, 1, C.wood5); }
  }
}
function drawPlant(g, x, y) {
  D.poly(g, [[x - 6, y - 12], [x + 6, y - 12], [x + 4, y], [x - 4, y]], '#B8562A'); D.r(g, x - 7, y - 13, 14, 2, '#D87444'); D.r(g, x - 4, y - 1, 8, 1, '#7E3218');
  for (let i = 0; i < 9; i++) { const a = -Math.PI / 2 + (i - 4) * 0.32, len = 12 + (i % 3) * 4; for (let k = 2; k < len; k++) { const px = x + Math.cos(a) * k, py = y - 13 + Math.sin(a) * k + (k * k) / 40; D.p(g, px, py, k % 3 ? '#4A6A2E' : '#6E9A44'); if (k % 2 === 0) D.p(g, px + 1, py, '#5D7A3A'); } }
}
function drawGlobe(g, x, y) {
  D.r(g, x - 3, y - 1, 7, 2, '#B8862E'); D.r(g, x, y - 4, 1, 3, '#9A6A20');
  D.disc(g, x, y - 10, 6, '#3E7AB8'); D.ell(g, x - 2, y - 12, 2, 2, '#6F9A45'); D.ell(g, x + 2, y - 8, 3, 2, '#6F9A45'); D.p(g, x - 2, y - 14, '#BFE0EE');
  D.ring(g, x, y - 10, 7, '#B8862E');
}
function drawMobile(g, x, y, t) {
  D.r(g, x - 12, y + 6, 25, 1, '#7A4E33');
  D.r(g, x, y, 1, 6, '#3A2A20');
  [[-10, 14, 'star'], [-3, 20, 'moon'], [4, 12, 'star'], [11, 18, 'star']].forEach(([dx, len, k], i) => {
    const sw = Math.round(Math.sin(t * 1.2 + i) * 1.5);
    D.r(g, x + dx, y + 7, 1, len - 4, '#5A4A40');
    const sx = x + dx + sw, sy = y + 6 + len;
    if (k === 'star') { D.twinkle(g, sx, sy, 2, '#FFD84A'); D.p(g, sx, sy, '#FFF6C8'); }
    else { D.disc(g, sx, sy, 3, '#F6E4B8'); D.disc(g, sx + 2, sy - 1, 2, mix('#7A4E33', '#9C6B45', 0.5)); }
    D.glow(g, sx, sy, 6, '#FFD84A', 0.15, 2);
  });
}
function drawTelescope(g, x, y) {
  D.line(g, x, y - 18, x - 7, y, '#5A3826'); D.line(g, x, y - 18, x + 7, y, '#5A3826'); D.line(g, x, y - 18, x, y, '#3B2418');
  D.poly(g, [[x - 14, y - 30], [x - 12, y - 33], [x + 6, y - 18], [x + 4, y - 15]], '#B8862E');
  D.line(g, x - 13, y - 31, x + 4, y - 17, '#F2CF7C'); D.disc(g, x - 13, y - 32, 2, '#9A6A20'); D.p(g, x - 13, y - 32, '#9ACDE0');
}
function drawPortraitItem(g, x, y) {
  D.r(g, x, y, 28, 30, '#96490D'); D.r(g, x, y, 27, 29, C.gold); D.r(g, x, y, 28, 1, C.goldL);
  D.r(g, x + 2, y + 2, 24, 26, '#E8C8D0'); D.dith(g, x + 2, y + 2, 24, 26, '#DB95B5', 1);
  if (zoe.F) g.drawImage(zoe.F.front, 0, 0, 24, 25, x + 2, y + 3, 24, 25);
}
function drawCushions(g, x, y) {
  D.ell(g, x, y - 3, 12, 4, '#7A2E48'); D.ell(g, x, y - 3, 11, 3, '#9A6AB0');
  D.ell(g, x - 2, y - 8, 9, 3, '#2C1A1E'); D.ell(g, x - 2, y - 8, 8, 3, '#F2C94C'); D.p(g, x - 6, y - 10, '#FFF1C8');
  D.ell(g, x + 3, y - 12, 7, 3, '#2C1A1E'); D.ell(g, x + 3, y - 12, 6, 2, '#5ACDE0');
}
// where each library item draws; 'fg' items draw over actors
const LIB_ITEMS = {
  beanbag: { draw: (g, s) => drawBeanbag(g, LIB.beanbag[0], LIB.beanbag[1], Math.round(s.squash || 0)), at: [128, 162] },
  headphones: { draw: (g, s) => { if (!s.dj) drawHeadphonesItem(g, LIB.table[0], LIB.table[1] - 2); }, at: [233, 132] },
  lights: { fg: true, draw: (g, s) => drawLights(g, T, s.lightsK ?? 1), at: [144, 36] },
  plant: { draw: (g) => drawPlant(g, 8, 152), at: [8, 136] },
  globe: { draw: (g) => drawGlobe(g, 94, 70), at: [94, 60] },
  mobile: { fg: true, draw: (g) => drawMobile(g, 200, 34, T), at: [200, 50] },
  telescope: { draw: (g) => drawTelescope(g, 270, 172), at: [262, 150] },
  portrait: { draw: (g) => drawPortraitItem(g, 220, 86), at: [234, 100] },
  cushions: { draw: (g) => drawCushions(g, 236, 192), at: [236, 184] },
};

// ===================== Studio =====================
const STU = { easel: [170, 111], frame: [28, 80], line: [64, 224], hatch: [14, 182], door: [246, 96], dotHome: [200, 182] };
const CLOTHES = [[70, 62], [102, 62], [170, 62], [202, 62]];
function paintStudio(g) {
  const rnd = rand(31);
  D.r(g, 0, 0, W, H, '#24140E');
  planksV(g, 0, 0, W, 152, 8, ['#E2CFA8', '#D8C29A', '#E8D8B6', '#DCC8A0', '#E0CCA4'], rnd);
  D.poly(g, [[0, 0], [144, 0], [144, 6], [0, 92]], '#24140E');
  D.poly(g, [[288, 0], [144, 0], [144, 6], [288, 92]], '#24140E');
  D.poly(g, [[0, 86], [144, 0], [144, 8], [0, 94]], C.wood2); D.line(g, 0, 86, 144, 0, C.wood4);
  D.poly(g, [[288, 86], [144, 0], [144, 8], [288, 94]], C.wood2); D.line(g, 288, 86, 144, 0, C.wood4);
  D.dith(g, 0, 140, W, 12, '#B8A07A', 1);
  // round window
  D.disc(g, 144, 38, 17, C.wood1); D.disc(g, 144, 38, 15, C.wood2);
  skyClipEll(g, 144, 38, 13, 13, ['#F2C89A', '#F2D8A8', '#BFE0EE', '#A8D0E8', '#9AC4E0']);
  D.r(g, 143, 25, 2, 27, C.wood2); D.r(g, 131, 37, 27, 2, C.wood2);
  // gallery frame (family tree goes here)
  D.r(g, 22, 74, 56, 44, C.wood1); D.r(g, 23, 75, 54, 42, C.wood4); D.r(g, 23, 75, 54, 1, C.wood5); D.r(g, 26, 78, 48, 36, '#EFE4CC');
  // shelves with paint jars
  for (const y of [112, 132]) { D.r(g, 196, y, 42, 3, C.wood3); D.r(g, 196, y, 42, 1, C.wood5); D.r(g, 198, y + 3, 2, 4, C.wood2); D.r(g, 234, y + 3, 2, 4, C.wood2); }
  ['#E8628A', '#E8893F', '#F2C94C', '#6F9A45', '#3E5AA8', '#9A6AB0'].forEach((c, i) => { const x = 199 + i * 6; D.r(g, x, 104, 5, 8, '#C8D8E0'); D.r(g, x, 106, 5, 6, c); D.r(g, x, 103, 5, 1, C.wood2); });
  D.r(g, 200, 126, 18, 6, '#F4EBD9'); D.ell(g, 200, 129, 1, 3, '#CBBCA3'); D.ell(g, 218, 129, 1, 3, '#CBBCA3'); D.r(g, 222, 124, 10, 8, '#7A9AD8'); D.r(g, 222, 124, 10, 1, '#9ACDE0');
  // bathroom door
  D.r(g, 244, 94, 36, 58, C.wood1); planksV(g, 247, 98, 30, 54, 6, ['#7AA8A0', '#6A9890', '#82B0A8'], rnd, false);
  D.disc(g, 272, 126, 1, C.gold); D.r(g, 248, 86, 28, 8, C.wood1); D.r(g, 249, 87, 26, 6, '#E8F4F0');
  text3(g, 'BATH', 249 + (26 - text3w('BATH')) / 2, 88, '#2E5A54');
  // work table with supplies
  D.r(g, 12, 136, 62, 4, C.wood4); D.r(g, 12, 136, 62, 1, C.wood5); D.r(g, 14, 140, 3, 18, C.wood2); D.r(g, 69, 140, 3, 18, C.wood2);
  ['#E8628A', '#3E5AA8', '#F2C94C'].forEach((c, i) => { const x = 16 + i * 7; D.r(g, x, 130, 6, 6, '#C8D8E0'); D.r(g, x, 131, 6, 4, c); D.r(g, x, 130, 6, 1, '#E8F0F4'); });
  D.r(g, 40, 128, 6, 8, '#9ACDE0'); for (const [dx, c] of [[0, '#E8893F'], [2, '#6F9A45'], [4, '#9A6AB0']]) { D.r(g, 41 + dx, 121, 1, 8, C.wood3); D.p(g, 41 + dx, 120, c); }
  D.r(g, 52, 131, 14, 5, '#E8893F'); for (let i = 0; i < 6; i++) D.r(g, 53 + i * 2, 128, 1, 3, ['#C8323C', '#3E5AA8', '#F2C94C', '#6F9A45', '#9A6AB0', '#E98AA2'][i]);
  // floor + splatters
  planksH(g, 0, 152, W, [4, 5, 5, 6, 7, 8, 7, 6], ['#B8946A', '#C8A47A', '#AA8660', '#BC9A70'], rnd);
  for (let i = 0; i < 26; i++) { const c = ['#E8628A', '#3E5AA8', '#F2C94C', '#6F9A45', '#9A6AB0', '#E8893F'][i % 6]; const x = 20 + rnd() * 250, y = 156 + rnd() * 40; D.ell(g, x, y, 1 + rnd() * 2, 1, c); if (rnd() < 0.5) D.p(g, x + 3, y + 1, c); }
  // hatch down
  D.r(g, 14, 182, 28, 13, C.wood1); D.r(g, 15, 183, 26, 11, C.wood3); for (let x = 21; x < 41; x += 7) D.r(g, x, 183, 1, 11, C.wood2); D.ring(g, 28, 188, 2, '#6A5E66');
  // easel
  D.line(g, 156, 168, 168, 92, C.wood3); D.line(g, 157, 168, 169, 92, C.wood2); D.line(g, 184, 168, 172, 92, C.wood3); D.line(g, 185, 168, 173, 92, C.wood2);
  D.line(g, 170, 96, 170, 160, C.wood2); D.r(g, 150, 126, 40, 3, C.wood4); D.r(g, 150, 126, 40, 1, C.wood5);
  D.r(g, 153, 97, 34, 29, C.wood1); D.r(g, 154, 98, 32, 27, '#F6EEDC');
  // stool
  D.r(g, 128, 160, 14, 3, C.wood4); D.line(g, 130, 163, 128, 172, C.wood2); D.line(g, 140, 163, 142, 172, C.wood2);
}
function drawClothesline(g) {
  for (let x = STU.line[0]; x <= STU.line[1]; x++) { const k = (x - STU.line[0]) / (STU.line[1] - STU.line[0]); D.p(g, x, 58 + Math.round(Math.sin(k * Math.PI) * 4), '#B89060'); }
  D.r(g, STU.line[0] - 2, 54, 3, 6, C.wood2); D.r(g, STU.line[1], 54, 3, 6, C.wood2);
}
// art pieces: pix is a 48x36 canvas
function drawArtPiece(g, pix, x, y, w, h, pin = true) {
  D.r(g, x - 1, y - 1, w + 2, h + 2, '#4A3A30'); D.r(g, x, y, w, h, '#F6EEDC');
  if (pix) g.drawImage(pix, 0, 0, pix.width, pix.height, x, y, w, h);
  if (pin) { D.r(g, x + 3, y - 3, 2, 4, '#C8A06A'); D.r(g, x + w - 5, y - 3, 2, 4, '#C8A06A'); }
}
function drawCanvasGlow(g, k) {
  if (k <= 0) return;
  g.save(); g.globalAlpha = k; D.r(g, 154, 98, 32, 27, '#FFF8E8'); g.restore();
  D.glow(g, 170, 111, 28, '#FFE38A', 0.25 * k, 3);
}
function drawRainbowRug(g) { const cols = ['#C8323C', '#E8893F', '#F2C94C', '#6F9A45', '#3E5AA8', '#9A6AB0']; cols.forEach((c, i) => D.ell(g, 132, 184, 40 - i * 6, 10 - i * 1.5, c)); D.ell(g, 132, 184, 4, 1, '#F4EBD9'); }
function drawSunflower(g, x, y) {
  D.poly(g, [[x - 5, y - 10], [x + 5, y - 10], [x + 4, y], [x - 4, y]], '#B8562A'); D.r(g, x - 6, y - 11, 12, 2, '#D87444');
  D.r(g, x, y - 46, 1, 36, '#4A6A2E'); D.ell(g, x - 4, y - 26, 4, 2, '#6E9A44'); D.ell(g, x + 4, y - 34, 4, 2, '#6E9A44');
  for (let a = 0; a < 12; a++) { const r = (a / 12) * Math.PI * 2; D.ell(g, x + Math.cos(r) * 6, y - 50 + Math.sin(r) * 6, 2, 2, '#F2C94C'); }
  D.disc(g, x, y - 50, 4, '#7A4E33'); D.p(g, x - 1, y - 51, '#9C6B45');
}
function drawPaperStars(g, t) {
  const cols = ['#E98AA2', '#F2C94C', '#9ACDE0', '#A1AF7C', '#FE9B5B'];
  for (const side of [-1, 1]) {
    for (let i = 0; i < 7; i++) {
      const d = 18 + i * 17, x = side < 0 ? d : W - d, roof = 86 - d * (86 / 144);
      const y = Math.round(roof + 8 + Math.round(Math.sin(t * 1.5 + i + side) * 0.7));
      D.line(g, x, roof + 2, x, y - 2, '#8A7A60');
      const c = cols[(i + (side > 0 ? 2 : 0)) % 5]; D.twinkle(g, x, y, 2, c); D.p(g, x, y, '#FFFFFF');
    }
  }
}
function drawCrayonJar(g, x, y) {
  D.r(g, x - 6, y - 14, 12, 14, '#BFE0EE'); D.r(g, x - 6, y - 14, 12, 1, '#E8F6FA'); D.r(g, x - 7, y - 1, 14, 1, '#7E93A3');
  ['#C8323C', '#E8893F', '#F2C94C', '#6F9A45', '#3E5AA8', '#9A6AB0', '#E98AA2'].forEach((c, i) => { const cx = x - 5 + i * 1.6; D.r(g, cx, y - 20 + (i % 3), 1.6, 12, c); D.p(g, cx, y - 21 + (i % 3), mix(c, '#000', 0.3)); });
}
const STU_ITEMS = {
  rug: { draw: (g) => drawRainbowRug(g), at: [132, 180] },
  sunflower: { draw: (g) => drawSunflower(g, 112, 152), at: [112, 110] },
  stars: { fg: true, draw: (g) => drawPaperStars(g, T), at: [60, 60] },
  beret: {
    draw: () => {},
    preview: (g, S) => { const d = S.dot; if (!d) return; const x = Math.round(d.x) + 1, y = Math.round(d.y - 30 + Math.sin(T * 3) * 1.5); D.ell(g, x, y, 7, 3, '#2C1A1E'); D.ell(g, x, y, 6, 2, '#C8323C'); D.r(g, x, y - 4, 1, 2, '#2C1A1E'); },
    get at() { const d = SCENES.studio && SCENES.studio.dot; return d ? [d.x, d.y - 10] : [200, 170]; },
  },
  crayons: { draw: (g) => drawCrayonJar(g, 92, 158), at: [92, 146] },
};
// fallback picture when there is no photo
function makeFallbackArt(kind, people = [], seed = 7) {
  const [c, g] = mk(48, 36);
  D.r(g, 0, 0, 48, 36, '#F6EEDC');
  if (kind === 'family') {
    D.r(g, 22, 20, 5, 14, '#7A4E33'); D.r(g, 16, 33, 17, 2, '#6F9A45');
    D.ell(g, 24, 13, 18, 11, '#6F9A45'); D.ell(g, 20, 10, 9, 6, '#8EB05A');
    const n = Math.max(1, Math.min(12, people.length));
    const cols = ['#F2C94C', '#E98AA2', '#5A84C4', '#E8893F', '#9A6AB0', '#5ACDE0'];
    for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2, x = 24 + Math.cos(a) * 12, y = 13 + Math.sin(a) * 6; D.disc(g, x, y, 2, cols[i % cols.length]); D.p(g, x - 1, y, C.ink); D.p(g, x + 1, y, C.ink); }
  } else {
    const rnd = rand(seed);
    for (let k = 0; k < 4; k++) { const col = ['#E8628A', '#3E5AA8', '#F2C94C', '#6F9A45', '#9A6AB0'][k]; let x = 6 + rnd() * 36, y = 6 + rnd() * 24; for (let i = 0; i < 40; i++) { x = clamp(x + (rnd() - 0.5) * 6, 2, 45); y = clamp(y + (rnd() - 0.5) * 5, 2, 33); D.r(g, x, y, 2, 1, col); } }
    D.twinkle(g, 38, 8, 2, '#E8A832');
  }
  return c;
}
// photo -> pixel art
const PIXPAL = ['#2C1A1E', '#4A3A30', '#6E5A50', '#9A8A80', '#C8BCB0', '#F6EEDC', '#FFFFFF', '#C8323C', '#E8628A', '#F2A0B0', '#E8893F', '#F2B060', '#F2C94C', '#F8E08A',
  '#6F8A45', '#9AB860', '#2E6A3A', '#3E5AA8', '#5A84C4', '#9ACDE0', '#7C5B85', '#B08AC0', '#7A4E33', '#B8865A', '#E8C8A0', '#2A2A3A'].map(hex2rgb);
function quantize(canvas) {
  const g = canvas.getContext('2d'), id = g.getImageData(0, 0, canvas.width, canvas.height), d = id.data;
  for (let i = 0; i < d.length; i += 4) {
    // lift paper toward white a little, then snap to the nearest palette color
    let r = d[i], gg = d[i + 1], b = d[i + 2];
    const l = (r + gg + b) / 3; if (l > 150) { r = lerp(r, 255, 0.35); gg = lerp(gg, 255, 0.35); b = lerp(b, 255, 0.35); }
    let best = 0, bd = 1e9;
    for (let k = 0; k < PIXPAL.length; k++) { const p = PIXPAL[k]; const dd = (p[0] - r) ** 2 * 0.3 + (p[1] - gg) ** 2 * 0.59 + (p[2] - b) ** 2 * 0.11; if (dd < bd) { bd = dd; best = k; } }
    d[i] = PIXPAL[best][0]; d[i + 1] = PIXPAL[best][1]; d[i + 2] = PIXPAL[best][2]; d[i + 3] = 255;
  }
  g.putImageData(id, 0, 0);
  return canvas;
}
function photoToArt(img) {
  const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
  const target = 4 / 3;
  let sw = iw, sh = ih;
  if (iw / ih > target) sw = ih * target; else sh = iw / target;
  const sx = (iw - sw) / 2, sy = (ih - sh) / 2;
  const big = document.createElement('canvas'); big.width = 400; big.height = 300;
  const bg = big.getContext('2d'); bg.imageSmoothingQuality = 'high'; bg.drawImage(img, sx, sy, sw, sh, 0, 0, 400, 300);
  // crayon on paper photographs pale: lift contrast and color before shrinking
  try { const id = bg.getImageData(0, 0, 400, 300), d = id.data; for (let i = 0; i < d.length; i += 4) { const l = (d[i] + d[i + 1] + d[i + 2]) / 3; for (let k = 0; k < 3; k++) d[i + k] = clamp((l + (d[i + k] - l) * 1.6 - 128) * 1.25 + 140, 0, 255); } bg.putImageData(id, 0, 0); } catch (e) { /* tainted canvas: skip */ }
  const small = document.createElement('canvas'); small.width = 48; small.height = 36;
  const sg = small.getContext('2d'); sg.imageSmoothingQuality = 'high'; sg.drawImage(big, 0, 0, 48, 36);
  quantize(small);
  return { pix: small.toDataURL('image/png'), photo: big.toDataURL('image/jpeg', 0.72) };
}
const PIX_CACHE = {};
function artCanvas(a) {
  if (!a) return null;
  const k = a.pix || (a.q + ':' + (a.people || []).join(',') + ':' + (a.at || 0));
  if (PIX_CACHE[k]) return PIX_CACHE[k];
  if (a.pix) {
    const img = new Image();
    const [c, g] = mk(48, 36);
    img.onload = () => { g.drawImage(img, 0, 0); };
    img.src = a.pix;
    PIX_CACHE[k] = c;
    return c;
  }
  let seed = (a.at || 0) % 9973; for (const ch of a.q) seed = (seed * 31 + ch.charCodeAt(0)) % 99991;
  return (PIX_CACHE[k] = makeFallbackArt(a.q === 'family' ? 'family' : 'scribble', a.people || [], seed + 1));
}

// ===================== Bathroom =====================
const BATH = { sink: [176, 120], cup: [189, 112], jar: [222, 96], tub: [60, 146], door: [252, 92], toilet: [124, 150], mirror: [176, 84] };
function paintBath(g) {
  const rnd = rand(13);
  D.r(g, 0, 0, W, 112, '#CFE6DE');
  for (let x = 0; x < W; x += 12) D.r(g, x, 0, 6, 112, '#C6DFD6');
  D.r(g, 0, 0, W, 8, '#8FB8AC'); D.r(g, 0, 7, W, 1, '#6E9A8E');
  // tiles
  D.r(g, 0, 112, W, 40, '#9CC4B8');
  for (let y = 113; y < 152; y += 7) for (let x = (y % 2) * 3; x < W; x += 7) { D.r(g, x, y, 6, 6, (x + y) % 3 ? '#F2F8F4' : '#DCEEE8'); D.p(g, x, y, '#FFFFFF'); }
  D.r(g, 0, 110, W, 3, '#7AA89A'); D.r(g, 0, 110, W, 1, '#B8DCD0');
  // floor
  for (let y = 152, r = 0; y < H; r++) { const hh = 5 + r; for (let x = -(r % 2) * 6, i = 0; x < W; x += 12, i++) D.r(g, x, y, 12, hh, (i + r) % 2 ? '#F4EBD9' : '#EDBBC4'); y += hh; }
  D.r(g, 0, 152, W, 1, '#7AA89A');
  // window above tub
  D.r(g, 36, 30, 44, 40, '#E8F4F0'); D.r(g, 38, 32, 40, 36, '#BFE0EE'); D.dith(g, 38, 32, 40, 36, '#F4FAF8', 2);
  D.r(g, 57, 32, 2, 36, '#E8F4F0'); D.r(g, 38, 49, 40, 2, '#E8F4F0'); D.r(g, 64, 64, 6, 6, '#B8562A'); D.disc(g, 67, 61, 3, '#6E9A44'); D.p(g, 66, 59, '#8EB05A');
  D.r(g, 34, 70, 48, 3, '#F4FAF8');
  // tub
  D.ell(g, 60, 146, 44, 13, '#B8C8D0'); D.r(g, 16, 128, 88, 18, '#F6F8F8'); D.ell(g, 60, 146, 43, 12, '#F6F8F8');
  D.r(g, 14, 126, 92, 4, '#FFFFFF'); D.r(g, 14, 129, 92, 1, '#C8D8E0'); D.r(g, 18, 131, 84, 4, '#DCE8EC');
  for (const x of [24, 94]) { D.r(g, x - 2, 156, 5, 4, C.gold); D.p(g, x - 2, 156, C.goldL); }
  D.r(g, 16, 114, 3, 12, '#B8C8D0'); D.r(g, 16, 114, 8, 3, '#B8C8D0'); D.p(g, 23, 118, '#9ACDE0');
  // toilet
  D.r(g, 116, 118, 18, 14, '#F6F8F8'); D.r(g, 116, 118, 18, 2, '#FFFFFF'); D.ell(g, 125, 140, 11, 5, '#F6F8F8'); D.ell(g, 125, 139, 9, 3, '#DCE8EC'); D.r(g, 120, 144, 10, 10, '#E8EEF0'); D.r(g, 132, 122, 3, 2, '#B8C8D0');
  // sink + mirror
  D.r(g, 160, 60, 32, 44, C.gold); D.r(g, 162, 62, 28, 40, '#9AB8C8'); D.line(g, 165, 70, 172, 64, '#E8F4F8'); D.line(g, 166, 76, 176, 66, '#D0E4EC'); D.r(g, 160, 60, 32, 1, C.goldL);
  D.ell(g, 176, 118, 18, 5, '#F6F8F8'); D.ell(g, 176, 117, 14, 3, '#C8DCE4'); D.r(g, 170, 122, 12, 32, '#F6F8F8'); D.r(g, 170, 122, 3, 32, '#FFFFFF'); D.r(g, 166, 152, 20, 3, '#E8EEF0');
  D.r(g, 175, 106, 2, 8, '#B8C8D0'); D.r(g, 175, 106, 6, 2, '#B8C8D0');
  // cup with toothbrushes
  D.r(g, 186, 108, 6, 7, '#9ACDE0'); D.r(g, 186, 108, 6, 1, '#E8F6FA');
  D.line(g, 187, 108, 185, 100, '#E8628A'); D.r(g, 184, 99, 2, 2, '#FFFFFF'); D.line(g, 190, 108, 193, 101, '#F2C94C'); D.r(g, 192, 100, 2, 2, '#FFFFFF');
  // shelf for jar
  D.r(g, 206, 98, 36, 3, '#E8F4F0'); D.r(g, 206, 101, 36, 1, '#8FB0A6'); D.r(g, 208, 102, 2, 4, '#B8C8D0'); D.r(g, 238, 102, 2, 4, '#B8C8D0');
  D.r(g, 232, 92, 6, 6, '#F2A0B0'); D.r(g, 232, 92, 6, 1, '#FFD0DC');
  // towel rack
  D.r(g, 206, 118, 30, 2, '#B8C8D0'); D.r(g, 210, 120, 22, 20, '#E8628A'); D.r(g, 210, 120, 22, 2, '#F7A6BE'); for (let y = 126; y < 140; y += 4) D.r(g, 210, y, 22, 1, '#C84A70');
  // a little hanging lamp
  D.r(g, 120, 0, 1, 14, '#6E9A8E'); D.poly(g, [[113, 22], [127, 22], [124, 14], [116, 14]], '#F2C94C'); D.r(g, 113, 22, 15, 1, '#C89A30'); D.r(g, 118, 23, 4, 2, '#FFF6C8');
  // door back to the studio
  D.r(g, 250, 90, 34, 62, '#6E9A8E'); planksV(g, 253, 94, 28, 58, 7, ['#E2CFA8', '#D8C29A', '#E8D8B6'], rnd, false); D.disc(g, 256, 124, 1, C.gold);
}
function drawJar(g, x, y, n, t, glowK = 0) {
  // a round glass jar, 18 wide x 22 tall, standing on (x, y)
  D.ell(g, x, y - 9, 9, 10, '#2C1A1E'); D.ell(g, x, y - 9, 8, 9, '#DCEEF4');
  D.r(g, x - 5, y - 21, 10, 4, '#2C1A1E'); D.r(g, x - 4, y - 20, 8, 3, '#C8A06A'); D.r(g, x - 4, y - 20, 8, 1, '#E8C890');
  const spots = [[-4, -3], [1, -2], [5, -5], [-2, -7], [3, -9], [-5, -10], [0, -12], [4, -14]];
  for (let i = 0; i < Math.min(n, spots.length); i++) {
    const [dx, dy] = spots[i]; const sx = x + dx, sy = y + dy;
    D.r(g, sx - 1, sy, 3, 1, '#F2B030'); D.r(g, sx, sy - 1, 1, 3, '#F2B030'); D.p(g, sx, sy, Math.sin(t * 3 + i * 1.7) > 0.4 ? '#FFFFFF' : '#FFE38A');
  }
  if (n > 0) D.glow(g, x, y - 9, 14, '#FFD84A', 0.06 + 0.025 * n + glowK * 0.3, 3);
  D.r(g, x - 6, y - 14, 1, 7, '#FFFFFF'); D.p(g, x - 5, y - 15, '#FFFFFF');
}
function drawDuck(g, x, y) { D.ell(g, x, y - 3, 5, 3, '#F2C94C'); D.disc(g, x + 3, y - 7, 3, '#F2C94C'); D.p(g, x + 4, y - 8, C.ink); D.r(g, x + 6, y - 7, 2, 1, '#E8893F'); D.p(g, x - 2, y - 4, '#F8E08A'); }
function drawBubbleBath(g, t) {
  for (let i = 0; i < 22; i++) { const x = 22 + (i * 37) % 78, y = 128 - ((i * 13) % 7) + Math.round(Math.sin(t * 1.5 + i) * 0.7); D.disc(g, x, y, 3 + (i % 3), '#FFFFFF'); D.ring(g, x, y, 3 + (i % 3), '#C8DCE4'); D.p(g, x - 1, y - 1, '#E8F6FA'); }
}
function drawBathRug(g) { D.ell(g, 176, 172, 22, 6, '#9A6AB0'); D.ell(g, 176, 172, 20, 5, '#B08AC0'); for (let x = 156; x < 198; x += 3) D.p(g, x, 178, '#9A6AB0'); }
function drawNightlight(g, t) { D.r(g, 195, 140, 7, 9, '#E8F4F0'); D.r(g, 195, 140, 7, 1, '#FFFFFF'); D.twinkle(g, 198, 144, 2, '#FFD84A'); D.p(g, 198, 144, '#FFFFFF'); D.glow(g, 198, 144, 16, '#FFE38A', 0.15 + 0.05 * Math.sin(t * 2), 3); }
function drawFern(g) { drawPlant(g, 146, 152); }
const BATH_ITEMS = {
  duck: { draw: (g) => drawDuck(g, 97, 126), at: [97, 120] },
  bubbles: { fg: true, draw: (g) => drawBubbleBath(g, T), at: [60, 126] },
  bathrug: { draw: (g) => drawBathRug(g), at: [176, 172] },
  nightlight: { draw: (g) => drawNightlight(g, T), at: [198, 144] },
  fern: { draw: (g) => drawFern(g), at: [146, 136] },
};
const ROOM_ITEMS = { library: LIB_ITEMS, studio: STU_ITEMS, bath: BATH_ITEMS };
