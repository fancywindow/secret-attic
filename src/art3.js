// ===================== Chapter three art: food icons, the kitchen, the Reading Tower, construction =====================
function emblemIcon3(kind) {
  const [c, g] = mk(20, 20);
  switch (kind) {
    case 'crunch': D.poly(g, [[2, 14], [6, 4], [10, 12], [14, 3], [18, 14]], '#E8A832'); D.r(g, 2, 14, 17, 3, '#C8862E'); for (const x of [4, 9, 14]) D.p(g, x, 1, '#F2C94C'); D.p(g, 1, 6, '#F2C94C'); D.p(g, 18, 7, '#F2C94C'); break;
    case 'squish': D.ell(g, 10, 13, 8, 5, '#E98AA2'); D.ell(g, 10, 11, 7, 4, '#F7B6C8'); D.p(g, 7, 10, '#FFFFFF'); D.p(g, 8, 10, '#FFFFFF'); for (const x of [2, 18]) { D.p(g, x, 9, '#E98AA2'); D.p(g, x, 7, '#E98AA2'); } break;
    case 'candy': D.disc(g, 10, 10, 5, '#E8628A'); D.poly(g, [[5, 10], [1, 6], [1, 14]], '#F2C94C'); D.poly(g, [[15, 10], [19, 6], [19, 14]], '#F2C94C'); D.line(g, 7, 8, 12, 13, '#FFFFFF'); D.p(g, 8, 8, '#FFD0DC'); break;
    case 'lemon': D.ell(g, 10, 11, 8, 6, '#F2D230'); D.p(g, 1, 11, '#E8C020'); D.p(g, 18, 11, '#E8C020'); D.r(g, 7, 8, 3, 1, '#FFF6A8'); D.r(g, 9, 3, 2, 3, '#6F9A45'); break;
    case 'salt': D.r(g, 6, 6, 9, 13, '#E8EEF4'); D.r(g, 6, 6, 9, 1, '#FFFFFF'); D.r(g, 6, 2, 9, 4, '#9AAABE'); for (const x of [8, 10, 12]) D.p(g, x, 3, C.ink); D.p(g, 3, 1, '#FFFFFF'); D.p(g, 17, 2, '#FFFFFF'); D.p(g, 2, 5, '#FFFFFF'); break;
    case 'pepper': D.poly(g, [[4, 6], [12, 4], [16, 9], [14, 17], [8, 18], [4, 12]], '#C8323C'); D.r(g, 6, 7, 2, 4, '#E8686A'); D.r(g, 10, 1, 2, 4, '#4A7A2E'); D.r(g, 8, 3, 6, 2, '#6F9A45'); break;
    case 'carrot': D.poly(g, [[6, 6], [14, 6], [11, 19], [9, 19]], '#E8893F'); for (const y of [9, 12, 15]) D.r(g, 8, y, 3, 1, '#C86A28'); D.poly(g, [[7, 6], [5, 0], [9, 4]], '#6F9A45'); D.poly(g, [[10, 6], [10, 0], [12, 5]], '#4A7A2E'); D.poly(g, [[13, 6], [16, 1], [14, 6]], '#6F9A45'); break;
    case 'broccoli': D.r(g, 8, 11, 4, 8, '#9AB860'); D.r(g, 8, 11, 1, 8, '#B8D080'); for (const [x, y, r] of [[6, 8, 4], [14, 8, 4], [10, 5, 5]]) D.disc(g, x, y, r, '#4A7A2E'); for (const [x, y] of [[6, 6], [10, 3], [14, 6], [12, 8]]) D.p(g, x, y, '#6F9A45'); break;
    case 'peas': D.ell(g, 10, 12, 9, 5, '#6F9A45'); D.ell(g, 10, 11, 8, 3, '#9AB860'); for (const x of [5, 10, 15]) { D.disc(g, x, 11, 2, '#4A7A2E'); D.p(g, x - 1, 10, '#B8D080'); } break;
    case 'corn': D.ell(g, 10, 10, 4, 8, '#F2C94C'); for (let y = 4; y < 17; y += 2) for (const x of [8, 10, 12]) D.p(g, x, y, '#E8A832'); D.poly(g, [[6, 18], [3, 6], [8, 14]], '#6F9A45'); D.poly(g, [[14, 18], [17, 6], [12, 14]], '#4A7A2E'); break;
    case 'cucumber': D.ell(g, 10, 10, 8, 4, '#4A7A2E'); D.ell(g, 10, 9, 7, 2, '#6F9A45'); for (const x of [5, 9, 13]) D.p(g, x, 11, '#2E5A1E'); D.disc(g, 16, 14, 3, '#C8E0A0'); D.ring(g, 16, 14, 3, '#4A7A2E'); D.p(g, 16, 14, '#9AB860'); break;
    case 'mystery': D.disc(g, 10, 10, 8, '#9A6AB0'); D.r(g, 8, 4, 5, 2, '#FFFFFF'); D.r(g, 12, 6, 2, 3, '#FFFFFF'); D.r(g, 10, 9, 2, 3, '#FFFFFF'); D.r(g, 10, 14, 2, 2, '#FFFFFF'); break;
    case 'spoon': D.ell(g, 6, 6, 4, 5, '#9C6B45'); D.ell(g, 6, 6, 3, 4, '#C8946A'); D.ell(g, 5, 5, 1, 2, '#E8C8A0'); for (let i = 0; i < 9; i++) D.r(g, 8 + i, 10 + i, 2, 2, '#9C6B45'); D.p(g, 9, 10, '#C8946A'); break;
    case 'cup': D.r(g, 4, 6, 10, 12, '#5ACDE0'); D.r(g, 4, 6, 10, 2, '#9AE8F0'); D.ring(g, 15, 11, 3, '#5ACDE0'); D.r(g, 5, 9, 8, 1, '#E8F6FA'); for (const x of [6, 9, 12]) { D.p(g, x, 3, '#E8DCCE'); D.p(g, x + 1, 1, '#E8DCCE'); } break;
    case 'egg': D.ell(g, 10, 11, 6, 8, '#F6EEDC'); D.ell(g, 9, 9, 3, 4, '#FFFFFF'); D.line(g, 4, 11, 7, 9, '#B8A890'); D.line(g, 7, 9, 10, 12, '#B8A890'); D.line(g, 10, 12, 13, 9, '#B8A890'); D.line(g, 13, 9, 16, 11, '#B8A890'); break;
    case 'apple': D.disc(g, 7, 11, 6, '#C8323C'); D.disc(g, 13, 11, 6, '#C8323C'); D.r(g, 4, 9, 2, 3, '#E8686A'); D.r(g, 10, 2, 1, 5, '#7A4E33'); D.ell(g, 13, 4, 3, 2, '#6F9A45'); break;
    case 'key': D.ring(g, 6, 9, 4, '#DCA438'); D.ring(g, 6, 9, 3, '#DCA438'); D.p(g, 4, 8, '#FFF1C8'); D.r(g, 10, 8, 9, 3, '#DCA438'); D.r(g, 10, 8, 9, 1, '#F2D27A'); D.r(g, 15, 11, 2, 3, '#DCA438'); D.r(g, 18, 11, 1, 4, '#DCA438'); break;
    case 'lock': D.r(g, 6, 2, 8, 9, '#2C1A1E'); D.r(g, 8, 4, 4, 7, 'rgba(0,0,0,0)'); g.clearRect(8, 4, 4, 7); D.r(g, 4, 9, 12, 10, '#DCA438'); D.r(g, 4, 9, 12, 2, '#F2D27A'); D.r(g, 9, 12, 2, 4, '#2C1A1E'); break;
    case 'map': D.poly(g, [[1, 4], [7, 2], [13, 4], [19, 2], [19, 16], [13, 18], [7, 16], [1, 18]], '#F4EBD9'); D.line(g, 7, 2, 7, 16, '#CBBCA3'); D.line(g, 13, 4, 13, 18, '#CBBCA3');
      D.line(g, 3, 13, 7, 10, '#C97034'); D.line(g, 7, 10, 11, 12, '#C97034'); D.line(g, 11, 12, 15, 8, '#C97034'); D.line(g, 14, 6, 17, 9, '#C8323C'); D.line(g, 17, 6, 14, 9, '#C8323C'); D.disc(g, 4, 6, 1, '#6F9A45'); break;
    case 'pencil': D.line(g, 3, 17, 15, 5, '#F2C94C'); D.line(g, 4, 17, 16, 5, '#E8A832'); D.line(g, 3, 16, 15, 4, '#F2C94C'); D.poly(g, [[15, 3], [18, 2], [17, 6]], '#E8C8A0'); D.p(g, 18, 2, C.ink); D.r(g, 2, 16, 3, 3, '#E98AA2'); break;
    case 'brushbig': D.line(g, 3, 18, 12, 9, '#9C6B45'); D.line(g, 4, 18, 13, 9, '#7A4E33'); D.r(g, 11, 6, 4, 4, '#C8D4DC'); D.poly(g, [[13, 4], [19, 0], [17, 6]], '#C8323C'); D.p(g, 18, 1, '#E8686A'); break;
    case 'hammer': D.line(g, 4, 18, 12, 8, '#9C6B45'); D.line(g, 5, 18, 13, 8, '#7A4E33'); D.poly(g, [[8, 4], [14, 0], [18, 5], [12, 9]], '#7E93A3'); D.line(g, 9, 4, 14, 1, '#A8BCC8'); break;
    case 'pot': D.r(g, 3, 8, 14, 9, '#B8562A'); D.r(g, 3, 8, 14, 2, '#D87444'); D.r(g, 1, 9, 2, 2, '#96490D'); D.r(g, 17, 9, 2, 2, '#96490D'); for (const x of [6, 10, 14]) { D.p(g, x, 5, '#E8DCCE'); D.p(g, x - 1, 3, '#E8DCCE'); } break;
  }
  return outlined(c, C.ink);
}
function makeIcons3() {
  for (const k of ['crunch', 'squish', 'candy', 'lemon', 'salt', 'pepper', 'carrot', 'broccoli', 'peas', 'corn', 'cucumber', 'mystery', 'spoon', 'cup', 'egg', 'apple', 'key', 'lock', 'map', 'pencil', 'brushbig', 'hammer', 'pot']) ICONS['e_' + k] = emblemIcon3(k);
}

// ===================== Library: kitchen door, construction, the bookcase door =====================
function drawKitchenDoorOpen(g, k) {
  // the padlock is gone and warm kitchen light spills out of the open door
  D.r(g, 257, 94, 26, 58, '#3A2016');
  D.r(g, 258, 95, 24, 57, '#FFD9A0'); D.dith(g, 258, 95, 24, 57, '#F2B870', 2);
  D.glow(g, 270, 130, 30, '#FFC878', 0.22 * k, 3);
  D.r(g, 258, 140, 24, 12, '#C8946A'); for (let x = 258; x < 282; x += 6) D.r(g, x, 140, 1, 12, '#B07A50');
  // the door, swung open against the wall
  D.r(g, 283, 92, 5, 60, C.wood1); D.r(g, 284, 94, 3, 56, '#A86A44');
}
// scaffolding in front of the bookshelf while the Sparkees build (stage 1..3)
function drawConstruction(g, stage, t) {
  if (stage <= 0) return;
  if (stage >= 2) {
    // a door shape glowing through the shelves
    const p = 0.5 + 0.5 * Math.sin(t * 2.4);
    for (const [x, y, w, h] of [[70, 76, 2, 70], [98, 76, 2, 70], [70, 74, 30, 2]]) { g.globalAlpha = 0.5 + 0.4 * p; D.r(g, x, y, w, h, '#FFE38A'); g.globalAlpha = 1; }
    D.ell(g, 85, 74, 15, 6, 'rgba(0,0,0,0)');
    D.glow(g, 85, 110, 26, '#FFE38A', 0.12 + 0.08 * p, 3);
  }
  const wood = '#C8A06A', dark = '#7A5A3A';
  for (const x of [64, 102]) { D.r(g, x, 40, 3, 112, dark); D.r(g, x, 40, 1, 112, wood); }
  for (const y of [62, 104, 138]) { D.r(g, 60, y, 50, 3, wood); D.r(g, 60, y + 3, 50, 1, dark); }
  D.line(g, 66, 104, 102, 62, dark); D.line(g, 66, 138, 102, 104, dark);
  // blueprint
  D.r(g, 72, 80, 20, 16, '#3E6AA8'); D.r(g, 73, 81, 18, 14, '#5A84C4');
  D.r(g, 75, 84, 6, 8, '#BFE0EE'); D.r(g, 76, 85, 4, 6, '#5A84C4'); D.line(g, 83, 92, 89, 84, '#BFE0EE'); D.p(g, 86, 83, '#BFE0EE');
  D.r(g, 81, 79, 2, 2, '#C8323C');
  // cones
  if (stage >= 1) for (const x of [58, 112]) { D.poly(g, [[x - 4, 152], [x + 4, 152], [x, 142]], '#E8893F'); D.r(g, x - 2, 147, 5, 1, '#FFFFFF'); D.r(g, x - 5, 152, 11, 1, '#B8562A'); }
  // a bucket and a hammer
  D.r(g, 88, 132, 8, 6, '#7E93A3'); D.r(g, 88, 132, 8, 1, '#A8BCC8');
  if (stage >= 3) { D.twinkle(g, 85, 66, 3, '#FFE38A'); }
}
// the finished secret door: a red book you pull, and when open, the stairs to the tower
function drawBookcaseDoor(g, open, t) {
  const glow = 0.5 + 0.5 * Math.sin(t * 2);
  if (open > 0) {
    const w = Math.round(30 * open);
    D.r(g, 70, 74, w, 74, '#2A160E');
    D.r(g, 71, 75, w - 2 > 0 ? w - 2 : 0, 72, '#FFD9A0');
    if (w > 6) {
      // spiral stairs going up into the light
      for (let i = 0; i < 6; i++) { const y = 140 - i * 12, x = 72 + ((i % 2) ? 8 : 2); if (x + 16 < 70 + w) { D.r(g, x, y, 16, 3, C.wood4); D.r(g, x, y, 16, 1, C.wood5); } }
      D.glow(g, 85, 90, 26, '#FFE9B8', 0.3 * open, 3);
    }
  }
  // the pull-me book, red with a gold band
  if (open < 0.2) {
    D.r(g, 90, 116, 5, 16, C.ink); D.r(g, 90, 117, 4, 15, '#C8323C'); D.r(g, 90, 117, 1, 15, '#E8686A'); D.r(g, 90, 120, 4, 1, C.gold); D.r(g, 90, 128, 4, 1, C.gold);
    D.glow(g, 92, 124, 7, '#FFE38A', 0.15 + 0.15 * glow, 2);
  }
}

// ===================== The Reading Tower (library level 2) =====================
const TOW = { door: [30, 150], seat: [144, 140], fish: [212, 140], dome: [144, 22] };
function paintTower(g) {
  const rnd = rand(77);
  D.r(g, 0, 0, W, H, '#24140E');
  // the domed ceiling
  D.ell(g, 144, 44, 150, 46, '#3B2418');
  for (let i = -6; i <= 6; i++) D.line(g, 144, 2, 144 + i * 26, 46, C.wood2);
  D.ell(g, 144, 46, 152, 4, C.wood2);
  // skylight
  D.disc(g, 144, 22, 22, C.wood1); D.disc(g, 144, 22, 20, '#1E2A50');
  for (let i = 0; i < 26; i++) { const a = rnd() * Math.PI * 2, r = rnd() * 18; D.p(g, 144 + Math.cos(a) * r, 22 + Math.sin(a) * r, rnd() < 0.3 ? '#FFF1C8' : '#9AA8D8'); }
  D.disc(g, 151, 16, 4, '#F6E4B8'); D.disc(g, 153, 15, 3, '#1E2A50');
  D.r(g, 143, 2, 2, 40, C.wood2); D.r(g, 124, 21, 40, 2, C.wood2);
  // curved stone walls
  stones(g, 0, 46, W, 108, rnd, ['#8A7E7A', '#7A6E6E', '#9A8E86', '#847876'], '#4A4040');
  D.dith(g, 0, 46, W, 6, '#2C1A1E', 2);
  // tall bookshelves that curve around the room
  const shelf = (x0, x1, top) => {
    D.r(g, x0, top, x1 - x0, 152 - top, '#2E1A12'); D.r(g, x0, top - 4, x1 - x0, 4, C.wood2); D.r(g, x0, top - 4, x1 - x0, 1, C.wood4);
    for (let y = top + 22; y < 150; y += 22) { D.r(g, x0, y, x1 - x0, 3, C.wood3); D.r(g, x0, y, x1 - x0, 1, C.wood5); }
    for (let x = x0; x <= x1; x += 26) { D.r(g, x, top, 3, 152 - top, C.wood2); D.r(g, x, top, 1, 152 - top, C.wood4); }
    // books, lots of them
    for (let y = top + 2; y < 150; y += 22) for (let x = x0 + 3; x < x1 - 3; x += 0) {
      const w = 3 + Math.floor(rnd() * 3), hgt = 14 + Math.floor(rnd() * 6);
      if (x + w > x1 - 2) break;
      if ((x - x0) % 26 < 3) { x += 3; continue; }
      const col = ['#C76580', '#5D6A3E', '#3E5AA8', '#B4502A', '#DCA438', '#7C5B85', '#2E6A5A', '#A86A44', '#E98AA2'][Math.floor(rnd() * 9)];
      D.r(g, x, y + 20 - hgt, w, hgt, col); D.r(g, x, y + 20 - hgt, 1, hgt, mix(col, '#FFFFFF', 0.25)); D.r(g, x, y + 22 - hgt, w, 1, C.gold);
      x += w + (rnd() < 0.15 ? 2 : 0);
    }
  };
  shelf(56, 112, 56); shelf(176, 236, 56);
  // the big arched window
  D.r(g, 116, 60, 56, 84, C.wood1); D.disc(g, 144, 70, 28, C.wood1);
  const sky = ['#9AC4E0', '#A8D0E8', '#BFE0EE', '#D8ECF2', '#F2E4C8'];
  for (let y = 44; y < 140; y++) { const k = (y - 44) / 96; const col = sky[Math.min(4, Math.floor(k * 5))]; const half = y < 70 ? Math.sqrt(Math.max(0, 25 * 25 - (70 - y) * (70 - y))) : 25; if (half > 0) D.r(g, 144 - half, y, half * 2, 1, col); }
  leafMass(g, 128, 120, 14, 10, ['#36421B', '#5D6A3E', '#7A8A4C'], rnd, 18); leafMass(g, 162, 116, 12, 12, ['#36421B', '#5D6A3E', '#7A8A4C'], rnd, 18);
  D.ell(g, 136, 70, 8, 3, '#FFFFFF'); D.ell(g, 154, 82, 6, 2, '#F4FAFC');
  D.r(g, 143, 46, 2, 96, C.wood2); D.r(g, 119, 92, 50, 2, C.wood2);
  // window seat with cushions
  D.r(g, 112, 136, 64, 12, C.wood3); D.r(g, 112, 136, 64, 1, C.wood5); D.r(g, 114, 130, 60, 7, '#B4502A'); D.r(g, 114, 130, 60, 1, '#D8743A');
  D.ell(g, 124, 128, 7, 4, '#DCA438'); D.ell(g, 164, 128, 7, 4, '#7C5B85');
  // the bookcase door back to the library (back of it: plain wood)
  D.r(g, 12, 84, 36, 68, C.wood1); planksV(g, 15, 88, 30, 64, 6, ['#9C6B45', '#8A5A3A', '#A8754A'], rnd, false); D.disc(g, 40, 120, 2, C.gold);
  D.r(g, 14, 76, 32, 8, C.wood1); D.r(g, 15, 77, 30, 6, C.wood5); text3(g, 'LIBRARY', 15 + (30 - text3w('LIBRARY')) / 2, 78, '#5A2844');
  // spiral stairs going up (somewhere even higher, someday)
  for (let i = 0; i < 9; i++) { const y = 150 - i * 13, x = 246 + Math.round(Math.sin(i * 1.1) * 14); D.r(g, x - 12, y, 26, 4, C.wood3); D.r(g, x - 12, y, 26, 1, C.wood5); D.r(g, x - 12, y + 4, 26, 1, C.wood1); }
  D.r(g, 245, 30, 3, 124, C.wood2); D.r(g, 245, 30, 1, 124, C.wood4);
  // floor
  planksH(g, 0, 152, W, [4, 5, 5, 6, 7, 8, 7, 6], ['#9C6B45', '#A8754A', '#8A5A3A', '#94643F'], rnd);
  D.ell(g, 144, 178, 70, 14, '#612C48'); D.ell(g, 144, 178, 66, 12, '#7C5B85'); D.ell(g, 144, 178, 50, 8, '#DB95B5'); D.ell(g, 144, 178, 46, 7, '#7C5B85');
  for (let a = 0; a < 16; a++) { const r = (a / 16) * Math.PI * 2; D.p(g, 144 + Math.cos(r) * 58, 178 + Math.sin(r) * 10, '#F2D27A'); }
}
function drawHammock(g, t) {
  const sw = Math.round(Math.sin(t * 1.4) * 2);
  D.r(g, 54, 120, 3, 46, C.wood2); D.r(g, 108, 120, 3, 46, C.wood2);
  for (let x = 56; x <= 108; x++) { const k = (x - 56) / 52; const y = 132 + Math.round(Math.sin(k * Math.PI) * 12) + Math.round(sw * Math.sin(k * Math.PI)); D.r(g, x, y, 1, 3, k * 10 % 2 < 1 ? '#E8628A' : '#F2C94C'); }
  D.line(g, 56, 122, 60, 134, '#C8A06A'); D.line(g, 108, 122, 104, 134, '#C8A06A');
}
function drawFishTank(g, t) {
  D.r(g, 196, 150, 34, 12, C.wood3); D.r(g, 196, 150, 34, 1, C.wood5); D.r(g, 198, 162, 3, 12, C.wood2); D.r(g, 225, 162, 3, 12, C.wood2);
  D.r(g, 196, 128, 34, 22, C.ink); D.r(g, 197, 129, 32, 20, '#5ACDE0'); D.r(g, 197, 129, 32, 3, '#9AE8F0'); D.r(g, 197, 145, 32, 4, '#E8D8A8');
  for (const x of [202, 222]) { D.line(g, x, 145, x - 1, 136, '#4A7A2E'); D.line(g, x + 1, 145, x + 2, 138, '#6F9A45'); }
  const fx = 206 + Math.round((Math.sin(t * 0.7) + 1) * 8), fy = 138 + Math.round(Math.sin(t * 1.9) * 2), dir = Math.cos(t * 0.7) > 0 ? 1 : -1;
  D.ell(g, fx, fy, 3, 2, '#E8893F'); D.poly(g, [[fx - 3 * dir, fy], [fx - 6 * dir, fy - 2], [fx - 6 * dir, fy + 2]], '#F2C94C'); D.p(g, fx + 2 * dir, fy - 1, C.ink);
  if (Math.sin(t * 3) > 0.7) D.ring(g, fx + 3 * dir, fy - 6, 1, '#FFFFFF');
}
function drawEggChair(g, t) {
  const sw = Math.round(Math.sin(t * 0.9) * 1.5);
  D.r(g, 84, 46, 1, 36, '#5A4A40');
  D.ell(g, 84 + sw, 102, 14, 18, C.ink); D.ell(g, 84 + sw, 102, 13, 17, '#F4EBD9'); D.ell(g, 86 + sw, 104, 9, 13, '#C76580'); D.ell(g, 86 + sw, 106, 7, 8, '#E98AA2');
}
function drawDragons(g, t) {
  // two little dragon bookends sitting on top of the bookshelves
  for (const [x, d] of [[70, 1], [222, -1]]) {
    const y = 52;
    D.ell(g, x, y - 4, 5, 4, '#2E5A1E'); D.ell(g, x, y - 4, 4, 3, '#4A7A2E');
    D.disc(g, x + d * 5, y - 9, 3, '#2E5A1E'); D.disc(g, x + d * 5, y - 9, 2, '#6F9A45');
    D.p(g, x + d * 6, y - 10, '#F2C94C'); D.p(g, x + d * 8, y - 9, '#2E5A1E');
    D.poly(g, [[x - d * 1, y - 7], [x - d * 4, y - 13], [x - d * 6, y - 7]], '#9AB860');
    D.line(g, x - d * 5, y - 2, x - d * 9, y - 5, '#4A7A2E');
    if (Math.sin(t * 0.8 + x) > 0.9) { D.p(g, x + d * 9, y - 10, '#E8893F'); D.p(g, x + d * 10, y - 11, '#F2C94C'); }
  }
}
function drawGramophone(g, t) {
  D.r(g, 192, 172, 22, 4, C.wood3); D.r(g, 194, 176, 3, 12, C.wood2); D.r(g, 209, 176, 3, 12, C.wood2);
  D.r(g, 194, 164, 18, 8, C.wood4); D.r(g, 194, 164, 18, 1, C.wood5); D.ell(g, 203, 164, 8, 2, '#2C1A1E');
  D.line(g, 206, 164, 214, 152, C.gold); D.poly(g, [[212, 154], [226, 140], [230, 150]], C.gold); D.poly(g, [[214, 152], [225, 142], [227, 149]], '#F2D27A');
  if (Math.sin(t * 4) > 0) { D.p(g, 230, 138, '#9A6AB0'); D.p(g, 230, 137, '#9A6AB0'); D.p(g, 231, 137, '#9A6AB0'); }
}
function drawConstellations(g, t) {
  const pts = [[60, 20], [74, 14], [88, 22], [100, 12], [190, 14], [204, 22], [220, 12], [234, 20], [40, 34], [252, 32]];
  for (let i = 0; i < pts.length; i++) { const [x, y] = pts[i]; D.twinkle(g, x, y, Math.sin(t * 2 + i) > 0.3 ? 2 : 1, '#FFE38A'); D.p(g, x, y, '#FFFFFF'); }
  g.globalAlpha = 0.4; for (const [a, b] of [[0, 1], [1, 2], [2, 3], [4, 5], [5, 6], [6, 7]]) D.line(g, pts[a][0], pts[a][1], pts[b][0], pts[b][1], '#FFE38A'); g.globalAlpha = 1;
}
function drawRocketLamp(g, t) {
  D.r(g, 64, 186, 12, 3, '#7E93A3');
  D.ell(g, 70, 172, 5, 12, '#E8EEF4'); D.poly(g, [[66, 160], [74, 160], [70, 152]], '#C8323C'); D.disc(g, 70, 170, 2, '#5ACDE0');
  D.poly(g, [[65, 178], [62, 186], [66, 184]], '#C8323C'); D.poly(g, [[75, 178], [78, 186], [74, 184]], '#C8323C');
  D.glow(g, 70, 170, 14, '#9AE8F0', 0.2 + 0.05 * Math.sin(t * 2), 3);
}
const TOWER_ITEMS = {
  glasses: { draw: () => {}, at: [144, 170] },
  hammock: { draw: (g) => drawHammock(g, T), at: [82, 140] },
  fishtank: { draw: (g) => drawFishTank(g, T), at: [212, 138] },
  eggchair: { draw: (g) => drawEggChair(g, T), at: [84, 100] },
  dragon: { draw: (g) => drawDragons(g, T), at: [146, 46] },
  gramophone: { draw: (g) => { g.save(); g.translate(46, 4); drawGramophone(g, T); g.restore(); }, at: [252, 168] },
  constellations: { fg: true, draw: (g) => drawConstellations(g, T), at: [144, 22] },
  rocket: { draw: (g) => drawRocketLamp(g, T), at: [70, 172] },
};

// ===================== The Kitchen =====================
const KIT = { stove: [88, 120], table: [150, 168], door: [20, 150], sink: [222, 122] };
function paintKitchen(g) {
  const rnd = rand(41);
  D.r(g, 0, 0, W, H, '#24140E');
  // ceiling with beams
  D.r(g, 0, 0, W, 30, '#4A2E20'); for (let x = 10; x < W; x += 48) { D.r(g, x, 0, 8, 30, C.wood2); D.r(g, x, 0, 1, 30, C.wood4); }
  D.r(g, 0, 28, W, 4, C.wood2); D.r(g, 0, 28, W, 1, C.wood4);
  // warm tiled walls
  D.r(g, 0, 32, W, 120, '#F2E2C2');
  for (let y = 32; y < 152; y += 8) for (let x = (y / 8) % 2 ? 0 : -6; x < W; x += 12) { D.r(g, x, y, 12, 1, '#E2CCA4'); D.r(g, x, y, 1, 8, '#E2CCA4'); }
  for (let x = 0; x < W; x += 12) D.r(g, x + 3, 96, 6, 6, '#C97034');
  D.r(g, 0, 100, W, 2, '#C97034');
  // door back to the library (left)
  D.r(g, 4, 88, 32, 64, C.wood1); planksV(g, 7, 92, 26, 60, 6, ['#A86A44', '#9A5E3A', '#B07448'], rnd, false); D.disc(g, 28, 122, 2, C.gold);
  D.r(g, 4, 80, 32, 8, C.wood1); D.r(g, 5, 81, 30, 6, C.wood5); text3(g, 'LIBRARY', 5 + (30 - text3w('LIBRARY')) / 2, 82, '#5A2844');
  // the big iron stove with a chimney pipe
  D.r(g, 82, 32, 12, 52, '#3A3442'); D.r(g, 82, 32, 3, 52, '#5A5462');
  D.r(g, 56, 84, 64, 68, '#2A2430'); D.r(g, 56, 84, 64, 3, '#4A4452'); D.r(g, 58, 87, 60, 1, '#1A1620');
  D.r(g, 62, 104, 52, 32, '#1E1A24'); D.r(g, 64, 106, 48, 28, '#3A3442');
  D.r(g, 70, 110, 36, 18, '#1A1418'); D.r(g, 72, 112, 32, 14, '#3A2A20');
  D.r(g, 74, 128, 28, 2, C.gold);
  for (const x of [66, 100]) { D.ell(g, x + 4, 88, 8, 2, '#1A1620'); D.ell(g, x + 4, 88, 6, 1, '#4A4452'); }
  D.r(g, 58, 140, 60, 2, '#4A4452'); D.r(g, 60, 150, 4, 2, '#1A1620'); D.r(g, 112, 150, 4, 2, '#1A1620');
  // pot rack above the stove (pots appear as a present)
  D.r(g, 50, 54, 76, 3, C.wood3); D.r(g, 50, 54, 76, 1, C.wood5); D.r(g, 54, 34, 1, 20, '#5A4A40'); D.r(g, 121, 34, 1, 20, '#5A4A40');
  // tall pantry cupboard
  D.r(g, 128, 50, 40, 102, C.wood2); D.r(g, 130, 52, 17, 98, C.wood3); D.r(g, 149, 52, 17, 98, C.wood3);
  D.r(g, 130, 52, 17, 1, C.wood5); D.r(g, 149, 52, 17, 1, C.wood5); D.disc(g, 145, 102, 1, C.gold); D.disc(g, 151, 102, 1, C.gold);
  D.r(g, 128, 46, 40, 4, C.wood4);
  // window above the sink
  D.r(g, 196, 44, 52, 44, C.wood2); D.r(g, 199, 47, 46, 38, '#BFE0EE');
  leafMass(g, 214, 72, 12, 8, ['#36421B', '#5D6A3E', '#7A8A4C'], rnd, 16); leafMass(g, 236, 62, 8, 10, ['#36421B', '#5D6A3E', '#7A8A4C'], rnd, 12);
  D.ell(g, 210, 54, 7, 2, '#FFFFFF');
  D.r(g, 221, 47, 2, 38, C.wood2); D.r(g, 199, 65, 46, 2, C.wood2); D.r(g, 194, 88, 56, 3, C.wood4);
  // counter with a sink
  D.r(g, 176, 116, 104, 6, '#E8DCCE'); D.r(g, 176, 116, 104, 1, '#FFFFFF'); D.r(g, 176, 122, 104, 30, C.wood3);
  for (const x of [178, 204, 230, 256]) { D.r(g, x, 124, 22, 26, C.wood4); D.r(g, x, 124, 22, 1, C.wood5); D.r(g, x + 9, 134, 4, 1, C.gold); }
  D.r(g, 208, 116, 30, 4, '#9AAABE'); D.r(g, 210, 117, 26, 2, '#6E7E92'); D.r(g, 221, 104, 3, 12, '#9AAABE'); D.r(g, 221, 104, 8, 2, '#9AAABE');
  // shelf with jars
  D.r(g, 252, 74, 32, 3, C.wood3); D.r(g, 252, 74, 32, 1, C.wood5);
  ['#E8893F', '#9AB860', '#E98AA2'].forEach((c, i) => { const x = 255 + i * 9; D.r(g, x, 64, 7, 10, '#E8F0F4'); D.r(g, x + 1, 67, 5, 7, c); D.r(g, x, 62, 7, 2, C.wood2); });
  // floor: checkered
  for (let y = 152, r = 0; y < H; r++) { const hh = 5 + r; for (let x = -(r % 2) * 7, i = 0; x < W; x += 14, i++) D.r(g, x, y, 14, hh, (i + r) % 2 ? '#EADCC0' : '#C98A60'); y += hh; }
  // table and stools (front)
  D.r(g, 116, 160, 68, 6, C.wood4); D.r(g, 116, 160, 68, 1, C.wood5); D.r(g, 116, 166, 68, 2, C.wood2);
  D.r(g, 120, 168, 4, 22, C.wood2); D.r(g, 176, 168, 4, 22, C.wood2);
  for (const x of [104, 194]) { D.r(g, x - 6, 176, 13, 3, C.wood4); D.r(g, x - 5, 179, 2, 12, C.wood2); D.r(g, x + 3, 179, 2, 12, C.wood2); }
}
function drawStoveGlow(g, k, t) {
  if (k <= 0) return;
  D.r(g, 72, 112, 32, 14, '#3A2A20');
  for (let i = 0; i < 6; i++) { const x = 76 + i * 5, h = 4 + Math.round((Math.sin(t * 9 + i * 1.7) + 1) * 2.5 * k); D.r(g, x, 126 - h, 3, h, i % 2 ? '#F2B030' : '#E8682A'); D.p(g, x + 1, 126 - h, '#FFE38A'); }
  D.glow(g, 88, 120, 26, '#FFB060', 0.16 * k, 3);
}
function drawPots(g) {
  [[60, 9, '#B8562A'], [78, 12, '#D87444'], [98, 8, '#B8562A'], [114, 6, '#C86A38']].forEach(([x, w, c]) => {
    D.r(g, x + w / 2, 57, 1, 4, '#5A4A40'); D.ell(g, x + w / 2, 64 + w / 2, w / 2 + 1, w / 2, c); D.r(g, x, 62, w, 2, mix(c, '#FFFFFF', 0.3)); D.p(g, x + 1, 64, '#FFE0C0');
  });
}
function drawCookieJar(g) {
  D.ell(g, 190, 108, 7, 8, C.ink); D.ell(g, 190, 108, 6, 7, '#E8F0F4'); D.r(g, 184, 99, 12, 3, '#C97034'); D.disc(g, 190, 97, 2, '#C97034');
  for (const [x, y] of [[187, 108], [192, 111], [190, 104]]) { D.disc(g, x, y, 2, '#C8946A'); D.p(g, x, y, '#5A2E12'); }
}
function drawHerbs(g) {
  D.r(g, 200, 84, 44, 6, '#B8562A'); D.r(g, 200, 84, 44, 1, '#D87444');
  for (let x = 203; x < 242; x += 4) { const h = 4 + (x * 7) % 5; D.r(g, x, 84 - h, 1, h, '#4A7A2E'); D.p(g, x - 1, 84 - h, '#6F9A45'); D.p(g, x + 1, 84 - h + 1, '#6F9A45'); }
}
function drawTablecloth(g) {
  D.r(g, 114, 158, 72, 8, '#FFFFFF'); for (let x = 114; x < 186; x += 4) for (let y = 158; y < 166; y += 4) if (((x - 114) / 4 + (y - 158) / 4) % 2 === 0) D.r(g, x, y, 4, 4, '#C8323C');
  for (let x = 114; x < 186; x += 4) D.r(g, x, 166, 4, 3, ((x - 114) / 4) % 2 ? '#C8323C' : '#FFFFFF');
}
function drawFruitBowl(g) {
  D.ell(g, 160, 158, 9, 3, '#7A9AD8'); D.ell(g, 160, 157, 8, 2, '#5A84C4');
  D.disc(g, 156, 154, 3, '#C8323C'); D.disc(g, 162, 153, 3, '#6F9A45'); D.ell(g, 160, 151, 5, 2, '#F2D230'); D.disc(g, 165, 155, 2, '#9A6AB0'); D.p(g, 155, 153, '#E8686A');
}
function drawKettle(g, t) {
  D.ell(g, 106, 82, 7, 5, C.ink); D.ell(g, 106, 82, 6, 4, '#5ACDE0'); D.r(g, 100, 84, 13, 2, '#3A9AB0'); D.disc(g, 106, 77, 1, C.ink);
  D.line(g, 112, 80, 116, 76, '#3A9AB0');
  if (Math.sin(t * 1.3) > 0.2) for (let i = 0; i < 3; i++) D.p(g, 117 + i, 73 - i * 2 + Math.round(Math.sin(t * 5 + i)), '#E8F0F4');
}
function drawToaster(g, t) {
  D.r(g, 260, 104, 16, 12, C.ink); D.r(g, 261, 105, 14, 11, '#C8D4DC'); D.r(g, 261, 105, 14, 2, '#E8EEF4'); D.r(g, 263, 103, 4, 2, C.ink); D.r(g, 269, 103, 4, 2, C.ink);
  const pop = Math.max(0, Math.sin(t * 0.6)) > 0.9 ? 4 : 0;
  D.r(g, 263, 100 - pop, 4, 4, '#E8B870'); D.r(g, 269, 100 - pop, 4, 4, '#E8B870');
}
function drawDishOfTheDay(g, kind, t) {
  if (!kind) return;
  const x = 140, y = 158;
  D.ell(g, x, y + 1, 9, 3, '#F4F0EA'); D.ell(g, x, y, 8, 2, '#FFFFFF');
  if (kind === 'pie') { D.ell(g, x, y - 2, 7, 3, '#C8946A'); D.ell(g, x, y - 3, 6, 2, '#E8B870'); for (const dx of [-3, 0, 3]) D.p(g, x + dx, y - 3, '#B8562A'); }
  else if (kind === 'cake') { D.r(g, x - 5, y - 8, 10, 7, '#F7B6C8'); D.r(g, x - 5, y - 8, 10, 2, '#FFFFFF'); D.r(g, x, y - 11, 1, 3, '#F2C94C'); D.p(g, x, y - 12, '#E8682A'); }
  else { D.ell(g, x, y - 2, 6, 3, '#F2D230'); D.p(g, x - 2, y - 3, '#FFF6A8'); D.ell(g, x + 3, y - 2, 2, 1, '#6F9A45'); }
  for (let i = 0; i < 2; i++) D.p(g, x - 2 + i * 4, y - 14 + Math.round(Math.sin(t * 4 + i) * 1.5), '#E8E0D8');
}
const KITCHEN_ITEMS = {
  pots: { draw: (g) => drawPots(g), at: [88, 66] },
  cookiejar: { draw: (g) => drawCookieJar(g), at: [190, 104] },
  herbs: { draw: (g) => drawHerbs(g), at: [222, 80] },
  tablecloth: { draw: (g) => drawTablecloth(g), at: [150, 162] },
  aprons: { draw: () => {}, at: [150, 176] },
  fruitbowl: { draw: (g) => drawFruitBowl(g), at: [160, 152] },
  kettle: { draw: (g) => drawKettle(g, T), at: [106, 80] },
  toaster: { draw: (g) => drawToaster(g, T), at: [268, 108] },
};
ROOM_ITEMS.tower = TOWER_ITEMS;
ROOM_ITEMS.kitchen = KITCHEN_ITEMS;
ROOM_ITEMS.library.kitchenkey = { draw: () => {}, at: [270, 120] };
// the telescope and cushions move so they no longer cover the kitchen door
LIB_ITEMS.telescope = { draw: (g) => drawTelescope(g, 228, 196), at: [222, 176] };
LIB_ITEMS.cushions = { draw: (g) => drawCushions(g, 70, 196), at: [70, 186] };
// the lights are a long string; show a short piece of it in the present card
LIB_ITEMS.lights.thumb = (g) => { for (let i = 0; i < 7; i++) { const x = 20 + i * 8, y = 20 + Math.round(Math.sin(i * 1.3) * 2); D.line(g, x - 8, 20, x, y, '#3A2A20'); D.r(g, x - 1, y, 3, 4, ['#F2C94C', '#E98AA2', '#5ACDE0', '#A1AF7C'][i % 4]); } };
LIB_ITEMS.mobile.thumb = (g) => drawMobile(g, 40, 10, 0);
STU_ITEMS.stars.thumb = (g) => { for (let i = 0; i < 5; i++) { D.twinkle(g, 20 + i * 10, 20 + (i % 2) * 4, 2, ['#E98AA2', '#F2C94C', '#9ACDE0', '#A1AF7C', '#FE9B5B'][i]); D.line(g, 20 + i * 10, 10, 20 + i * 10, 17 + (i % 2) * 4, '#8A7A60'); } };
TOWER_ITEMS.dragon.thumb = (g) => { g.save(); g.beginPath(); g.rect(55, 30, 30, 30); g.clip(); drawDragons(g, 0); g.restore(); };
TOWER_ITEMS.constellations.thumb = (g) => { D.disc(g, 40, 30, 22, '#1E2A50'); const pts = [[28, 22], [36, 18], [46, 26], [52, 36], [34, 38]]; g.globalAlpha = 0.5; for (let i = 0; i < 4; i++) D.line(g, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], '#FFE38A'); g.globalAlpha = 1; for (const [x, y] of pts) { D.twinkle(g, x, y, 2, '#FFE38A'); D.p(g, x, y, '#FFFFFF'); } };
