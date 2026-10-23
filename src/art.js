// ===================== Art helpers =====================
const FONT3 = {
  A: ['010', '101', '111', '101', '101'], B: ['110', '101', '110', '101', '110'], C: ['011', '100', '100', '100', '011'],
  D: ['110', '101', '101', '101', '110'], E: ['111', '100', '110', '100', '111'], F: ['111', '100', '110', '100', '100'],
  G: ['011', '100', '101', '101', '011'], H: ['101', '101', '111', '101', '101'], I: ['111', '010', '010', '010', '111'],
  K: ['101', '101', '110', '101', '101'], L: ['100', '100', '100', '100', '111'], M: ['101', '111', '111', '101', '101'],
  N: ['110', '101', '101', '101', '101'], O: ['010', '101', '101', '101', '010'], P: ['110', '101', '110', '100', '100'],
  Q: ['010', '101', '101', '011', '001'], R: ['110', '101', '110', '101', '101'], S: ['011', '100', '010', '001', '110'],
  T: ['111', '010', '010', '010', '010'], U: ['101', '101', '101', '101', '111'], V: ['101', '101', '101', '101', '010'],
  W: ['101', '101', '111', '111', '101'], Y: ['101', '101', '010', '010', '010'], Z: ['111', '001', '010', '100', '111'],
  J: ['001', '001', '001', '101', '010'], X: ['101', '101', '010', '101', '101'],
  '!': ['1', '1', '1', '0', '1'], '.': ['0', '0', '0', '0', '1'], ' ': ['00', '00', '00', '00', '00'], '?': ['110', '001', '010', '000', '010'],
  "'": ['1', '1', '0', '0', '0'],
};
function text3(g, s, x, y, c) {
  let cx = Math.round(x);
  for (const ch of s.toUpperCase()) {
    const gl = FONT3[ch] || FONT3[' '];
    for (let r = 0; r < 5; r++) for (let i = 0; i < gl[r].length; i++) if (gl[r][i] === '1') D.p(g, cx + i, y + r, c);
    cx += gl[0].length + 1;
  }
  return cx - x - 1;
}
function text3w(s) { let w = 0; for (const ch of s.toUpperCase()) w += (FONT3[ch] || FONT3[' '])[0].length + 1; return w - 1; }

function planksV(g, x, y, w, h, pw, cols, rnd, nails = true) {
  let xx = x;
  while (xx < x + w) {
    const ww = Math.min(pw + (rnd() < 0.35 ? (rnd() < 0.5 ? -1 : 1) : 0), x + w - xx);
    const c = cols[Math.floor(rnd() * cols.length)];
    D.r(g, xx, y, ww, h, c);
    D.r(g, xx, y, 1, h, mix(c, '#000000', 0.38));
    D.r(g, xx + 1, y, 1, h, mix(c, '#ffffff', 0.08));
    for (let i = 0; i < h / 5; i++) {
      const gx = xx + 2 + Math.floor(rnd() * Math.max(1, ww - 3)), gy = y + Math.floor(rnd() * h), gl = 2 + Math.floor(rnd() * 7);
      D.r(g, gx, gy, 1, Math.min(gl, y + h - gy), mix(c, '#000000', 0.14));
    }
    if (rnd() < 0.22 && ww > 5) { const kx = xx + 2 + Math.floor(rnd() * (ww - 4)), ky = y + 3 + Math.floor(rnd() * (h - 8)); D.ell(g, kx, ky, 1, 2, mix(c, '#000000', 0.32)); }
    if (nails) { const nc = mix(c, '#000000', 0.55); D.p(g, xx + Math.floor(ww / 2), y + 2, nc); D.p(g, xx + Math.floor(ww / 2), y + h - 3, nc); }
    xx += ww;
  }
}
function planksH(g, x, y, w, rows, cols, rnd, seam = '#2E1A12') {
  let yy = y;
  for (const rh of rows) {
    let xx = x - Math.floor(rnd() * 40);
    while (xx < x + w) {
      const len = 30 + Math.floor(rnd() * 40);
      const c = cols[Math.floor(rnd() * cols.length)];
      D.r(g, Math.max(x, xx), yy, Math.min(len, x + w - Math.max(x, xx)), rh, c);
      D.r(g, Math.max(x, xx), yy, Math.min(len, x + w - Math.max(x, xx)), 1, mix(c, '#ffffff', 0.1));
      if (xx > x) D.r(g, xx, yy, 1, rh, seam);
      for (let i = 0; i < len / 10; i++) { const gx = xx + Math.floor(rnd() * len); if (gx > x && gx < x + w) D.r(g, gx, yy + 1 + Math.floor(rnd() * Math.max(1, rh - 2)), 3 + Math.floor(rnd() * 5), 1, mix(c, '#000000', 0.12)); }
      xx += len;
    }
    D.r(g, x, yy + rh - 1, w, 1, seam);
    yy += rh;
  }
}
function stones(g, x, y, w, h, rnd, cols, mortar) {
  D.r(g, x, y, w, h, mortar);
  let yy = y;
  while (yy < y + h) {
    const rh = 5 + Math.floor(rnd() * 3);
    let xx = x - Math.floor(rnd() * 6);
    while (xx < x + w) {
      const sw = 6 + Math.floor(rnd() * 7);
      const c = cols[Math.floor(rnd() * cols.length)];
      const x0 = Math.max(x, xx + 1), x1 = Math.min(x + w, xx + sw - 1), y0 = yy + 1, y1 = Math.min(y + h, yy + rh - 1);
      if (x1 > x0 + 1 && y1 > y0) {
        D.r(g, x0, y0, x1 - x0, y1 - y0, c);
        D.r(g, x0 + 1, y0, x1 - x0 - 2, 1, mix(c, '#ffffff', 0.18));
        D.r(g, x0, y1 - 1, x1 - x0, 1, mix(c, '#000000', 0.2));
        D.p(g, x0, y0, mortar); D.p(g, x1 - 1, y0, mortar);
      }
      xx += sw;
    }
    yy += rh;
  }
}
function skyBands(g, x, y, w, h, cols) {
  const bh = h / cols.length;
  cols.forEach((c, i) => D.r(g, x, y + Math.round(i * bh), w, Math.ceil(bh) + 1, c));
  for (let i = 1; i < cols.length; i++) { const yy = y + Math.round(i * bh); D.dith(g, x, yy - 2, w, 2, cols[i], 2); D.dith(g, x, yy, w, 2, cols[i - 1], 1); }
}
function leafMass(g, cx, cy, rx, ry, cols, rnd, n) {
  for (let i = 0; i < n; i++) {
    const a = rnd() * Math.PI * 2, d = Math.sqrt(rnd());
    const x = cx + Math.cos(a) * rx * d, y = cy + Math.sin(a) * ry * d;
    const r = 2 + Math.floor(rnd() * 4);
    const ci = clamp(Math.floor((y - cy + ry) / (2 * ry) * cols.length + (rnd() - 0.5) * 1.2), 0, cols.length - 1);
    D.ell(g, x, y, r + 1, r, cols[cols.length - 1 - ci]);
    D.p(g, x - 1, y - r + 1, mix(cols[cols.length - 1 - ci], '#FFF6C8', 0.25));
  }
}
function outlined(src, color) {
  const w = src.width + 2, h = src.height + 2;
  const [c, g] = mk(w, h);
  const sg = src.getContext('2d').getImageData(0, 0, src.width, src.height).data;
  const at = (x, y) => x >= 0 && y >= 0 && x < src.width && y < src.height && sg[(y * src.width + x) * 4 + 3] > 0;
  g.fillStyle = color;
  for (let y = -1; y <= src.height; y++) for (let x = -1; x <= src.width; x++) {
    if (at(x, y)) continue;
    if (at(x + 1, y) || at(x - 1, y) || at(x, y + 1) || at(x, y - 1)) g.fillRect(x + 1, y + 1, 1, 1);
  }
  g.drawImage(src, 1, 1);
  return c;
}

// ===================== Title =====================
function paintTitle(g) {
  const rnd = rand(11);
  skyBands(g, 0, 0, W, 170, ['#120D22', '#1A1330', '#24183A', '#311E44', '#42264C', '#593052', '#7A4058']);
  for (let i = 0; i < 90; i++) { const x = rnd() * W, y = rnd() * 120; D.p(g, x, y, rnd() < 0.7 ? '#C9B8D8' : '#FFF1C8'); }
  // moon
  D.glow(g, 252, 74, 30, '#B07AA0', 0.25, 4);
  D.disc(g, 252, 74, 11, '#FFF1C8');
  D.disc(g, 255, 71, 10, '#F6E4B8');
  D.disc(g, 248, 77, 2, '#E8D4A4'); D.disc(g, 256, 79, 2, '#E8D4A4'); D.disc(g, 254, 68, 1, '#EEDCAE');
  // clouds
  for (const [x, y, w] of [[200, 54, 50], [24, 70, 60], [120, 36, 30]]) { D.r(g, x, y, w, 2, '#4A2E52'); D.r(g, x + 6, y - 2, w - 18, 2, '#4A2E52'); D.dith(g, x, y + 2, w, 1, '#4A2E52', 2); }
  // hills
  D.poly(g, [[0, 140], [60, 128], [130, 136], [210, 124], [288, 132], [288, 200], [0, 200]], '#2A1B36');
  D.poly(g, [[0, 168], [80, 160], [180, 166], [288, 158], [288, 200], [0, 200]], '#191224');
  // trees
  const tree = (x, y, r) => { D.r(g, x - 1, y, 3, 22, '#120C1A'); leafMass(g, x, y - r / 2, r, r, ['#140E1E', '#1A1226', '#20162E'], rnd, r * 3); };
  tree(26, 150, 16); tree(52, 158, 11); tree(262, 148, 18); tree(236, 160, 10); tree(8, 166, 9);
  // house
  g.save(); g.translate(0, 18);
  const wall = '#3A2C46', wallD = '#2E2238', roof = '#22182E', roofL = '#2C2038';
  D.r(g, 102, 98, 88, 72, wall);
  for (let y = 100; y < 170; y += 3) D.r(g, 102, y, 88, 1, wallD);
  D.poly(g, [[94, 100], [146, 50], [198, 100]], roof);
  for (let y = 56; y < 100; y += 4) { const half = ((y - 50) / 50) * 52; D.r(g, 146 - half, y, half * 2, 1, roofL); }
  D.line(g, 94, 100, 146, 50, '#3A2C46'); D.line(g, 146, 50, 198, 100, '#3A2C46');
  D.r(g, 170, 54, 9, 24, '#2A1E34'); D.r(g, 168, 52, 13, 3, '#382A44');
  // attic window (hero)
  D.disc(g, 146, 76, 8, '#2A1E34');
  D.disc(g, 146, 76, 6, '#F2C25A');
  D.disc(g, 146, 76, 4, '#FFE38A');
  D.r(g, 146, 70, 1, 13, '#7A4A2A'); D.r(g, 140, 76, 13, 1, '#7A4A2A');
  // windows
  const win = (x, y, lit) => { D.r(g, x - 1, y - 1, 14, 18, '#4A3A58'); D.r(g, x, y, 12, 16, lit ? '#9A6A3A' : '#24304A'); D.r(g, x + 5, y, 1, 16, '#4A3A58'); D.r(g, x, y + 7, 12, 1, '#4A3A58'); if (!lit) D.p(g, x + 2, y + 2, '#3A4C6E'); };
  win(110, 108, false); win(170, 108, false); win(110, 140, true); win(170, 140, false);
  // porch + door
  D.r(g, 134, 134, 22, 36, '#2A1E34'); D.r(g, 138, 138, 14, 32, '#4A2E3A'); D.p(g, 149, 154, '#DCA438');
  D.r(g, 96, 128, 100, 4, '#2A1E34');
  for (const x of [100, 130, 160, 190]) D.r(g, x, 132, 2, 38, '#2A1E34');
  g.restore();
  // fence
  for (let x = 0; x < W; x += 6) { if (x > 120 && x < 172) continue; D.r(g, x, 174, 3, 12, '#120C1A'); D.p(g, x + 1, 173, '#120C1A'); }
  D.r(g, 0, 178, 120, 1, '#120C1A'); D.r(g, 172, 178, 120, 1, '#120C1A');
  D.r(g, 0, 186, W, 14, '#120C1A');
}

// ===================== Hallway =====================
function paintHall(g) {
  const rnd = rand(42);
  // wallpaper
  D.r(g, 0, 0, W, 114, '#5A2844');
  for (let x = 0; x < W; x += 16) D.r(g, x + 5, 0, 6, 114, '#622E4C');
  for (let y = 14, j = 0; y < 108; y += 18, j++) for (let x = (j % 2) * 8 + 8; x < W; x += 16) {
    D.p(g, x, y - 1, '#7E4A5E'); D.r(g, x - 1, y, 3, 1, '#7E4A5E'); D.p(g, x, y + 1, '#7E4A5E'); D.p(g, x, y, '#94606E');
  }
  D.dith(g, 0, 8, W, 6, C.ink2, 1);
  // crown molding
  D.r(g, 0, 0, W, 8, C.wood1);
  for (let x = 1; x < W; x += 4) D.r(g, x, 3, 2, 2, C.wood2);
  D.r(g, 0, 6, W, 1, C.wood3); D.r(g, 0, 7, W, 1, C.ink2);
  // chair rail + wainscot
  D.r(g, 0, 110, W, 5, C.wood3); D.r(g, 0, 110, W, 1, C.wood5); D.r(g, 0, 114, W, 1, C.ink2);
  D.r(g, 0, 115, W, 32, C.wood2);
  for (let x = 4; x < W; x += 40) {
    D.r(g, x, 119, 34, 23, '#6A4430');
    D.r(g, x, 119, 34, 1, '#8A5A3C'); D.r(g, x, 119, 1, 23, '#8A5A3C');
    D.r(g, x, 141, 34, 1, C.wood1); D.r(g, x + 33, 119, 1, 23, C.wood1);
  }
  // baseboard
  D.r(g, 0, 146, W, 6, C.wood1); D.r(g, 0, 146, W, 1, '#6A4430'); D.r(g, 0, 151, W, 1, C.ink2);
  // floor
  planksH(g, 0, 152, W, [4, 4, 5, 5, 6, 7, 8, 9], ['#6E4630', '#76492F', '#664028', '#7A4E33'], rnd, '#3B2418');
  // runner rug
  D.r(g, 0, 168, W, 26, '#7E2E4A');
  D.r(g, 0, 169, W, 1, '#C97034'); D.r(g, 0, 192, W, 1, '#C97034');
  D.r(g, 0, 171, W, 1, '#DCA438'); D.r(g, 0, 190, W, 1, '#DCA438');
  for (let x = 0; x < W; x += 12) { D.poly(g, [[x + 6, 174], [x + 11, 180.5], [x + 6, 187], [x + 1, 180.5]], '#9A3E5A'); D.p(g, x + 6, 180, '#DCA438'); D.p(g, x, 180, '#C97034'); }
  D.r(g, 0, 193, W, 1, C.ink2);
  // --- grandfather clock ---
  D.r(g, 15, 140, 30, 16, C.wood2); D.r(g, 15, 140, 30, 2, C.wood3); D.r(g, 16, 155, 4, 2, C.wood1); D.r(g, 40, 155, 4, 2, C.wood1);
  D.r(g, 19, 62, 22, 78, C.wood2); D.r(g, 19, 62, 1, 78, C.wood4); D.r(g, 40, 62, 1, 78, C.wood1);
  D.r(g, 23, 70, 14, 62, '#1E1216'); D.r(g, 22, 69, 16, 1, C.wood4); D.r(g, 22, 132, 16, 1, C.wood4); D.r(g, 22, 69, 1, 64, C.wood4); D.r(g, 37, 69, 1, 64, C.wood4);
  D.r(g, 16, 30, 28, 32, C.wood2); D.r(g, 16, 30, 1, 32, C.wood4); D.r(g, 43, 30, 1, 32, C.wood1);
  D.poly(g, [[13, 32], [30, 21], [47, 32]], C.wood3); D.line(g, 13, 32, 30, 21, C.wood4); D.r(g, 13, 31, 34, 2, C.wood1);
  D.disc(g, 30, 19, 2, C.gold); D.p(g, 29, 18, C.goldL);
  D.disc(g, 30, 46, 11, C.gold); D.disc(g, 30, 46, 10, '#B88A2E'); D.disc(g, 30, 46, 9, C.parch); D.disc(g, 31, 47, 8, '#EEE2C8');
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; D.p(g, 30 + Math.round(Math.cos(a) * 7), 46 + Math.round(Math.sin(a) * 7), C.ink); }
  D.line(g, 30, 46, 30, 40, C.ink); D.line(g, 30, 46, 27, 42, C.ink); D.p(g, 30, 46, C.rust);
  // --- portrait of Great-Great-Aunt Agnes ---
  D.r(g, 64, 28, 42, 56, '#96490D'); D.r(g, 64, 28, 41, 55, C.gold); D.r(g, 64, 28, 42, 1, C.goldL); D.r(g, 64, 28, 1, 56, C.goldL);
  D.r(g, 67, 31, 36, 50, '#7A3E0E'); D.r(g, 68, 32, 34, 48, '#2A3620');
  D.dith(g, 68, 32, 34, 48, '#36421B', 1);
  D.poly(g, [[72, 80], [76, 66], [94, 66], [98, 80]], '#3A1E30'); D.r(g, 80, 63, 10, 5, C.parch2); D.r(g, 82, 66, 6, 2, '#E8DCBE');
  D.disc(g, 85, 69, 1, C.rose);
  D.ell(g, 85, 54, 7, 9, '#E2C0A0'); D.r(g, 83, 61, 5, 3, '#E2C0A0'); D.ell(g, 86, 55, 5, 7, '#ECCDB0');
  D.ell(g, 85, 44, 8, 4, '#9A929C'); D.disc(g, 85, 39, 4, '#8A828C'); D.p(g, 84, 37, '#B4ACB6'); D.r(g, 77, 44, 2, 8, '#9A929C'); D.r(g, 92, 44, 2, 8, '#9A929C');
  D.line(g, 80, 50, 83, 51, C.ink); D.line(g, 87, 51, 90, 50, C.ink);
  D.r(g, 83, 58, 4, 1, '#8A4A48'); D.p(g, 85, 55, '#C89A84');
  D.r(g, 77, 88, 16, 4, C.gold); D.r(g, 77, 88, 16, 1, C.goldL); D.r(g, 80, 89, 10, 2, '#96490D');
  // --- table + lamp ---
  D.r(g, 118, 118, 30, 4, C.wood4); D.r(g, 118, 118, 30, 1, C.wood5); D.r(g, 119, 122, 28, 4, C.wood3);
  D.r(g, 121, 126, 2, 30, C.wood2); D.r(g, 143, 126, 2, 30, C.wood2); D.r(g, 121, 142, 24, 2, C.wood3);
  D.r(g, 124, 137, 16, 5, '#5D6A3E'); D.r(g, 124, 137, 16, 1, '#7A8A54'); D.r(g, 126, 133, 12, 4, '#96490D'); D.r(g, 126, 133, 12, 1, '#C97034');
  D.r(g, 130, 108, 6, 10, '#B8862E'); D.r(g, 129, 115, 8, 3, '#9A6A20'); D.r(g, 130, 108, 1, 10, '#E8B85A');
  D.r(g, 132, 104, 2, 4, '#7A5A20');
  // tiny door (frame + door)
  D.r(g, 164, 135, 13, 17, C.ink2);
  D.r(g, 165, 136, 11, 16, C.wood1);
  // --- mirror ---
  D.ell(g, 216, 72, 15, 23, '#96490D'); D.ell(g, 216, 72, 14, 22, C.gold); D.ell(g, 216, 72, 12, 20, '#7A4A12');
  D.ell(g, 216, 72, 11, 19, '#5E7282');
  skyClipEll(g, 216, 72, 11, 19, ['#8EA4B4', '#7E93A3', '#6E8494', '#5E7282', '#526676']);
  D.line(g, 209, 62, 213, 55, '#C8D8E0'); D.line(g, 210, 66, 216, 56, '#B0C4D0'); D.line(g, 220, 86, 223, 80, '#A8BCC8');
  D.disc(g, 216, 48, 3, C.gold); D.p(g, 215, 47, C.goldL);
  // --- window ---
  D.r(g, 244, 20, 40, 88, C.wood3); D.r(g, 244, 20, 40, 1, C.wood5);
  skyBands(g, 248, 24, 32, 78, ['#1A1A34', '#22243E', '#2C2E4C', '#383656']);
  D.disc(g, 271, 38, 5, '#FFF1C8'); D.disc(g, 273, 36, 5, '#262844');
  for (let i = 0; i < 9; i++) D.p(g, 249 + rnd() * 30, 26 + rnd() * 70, '#C9B8D8');
  D.r(g, 263, 24, 2, 78, C.wood3); D.r(g, 248, 60, 32, 2, C.wood3);
  D.r(g, 242, 104, 44, 4, C.wood4); D.r(g, 242, 104, 44, 1, C.wood5);
  D.r(g, 240, 14, 48, 4, C.wood1);
  const curtain = (x, dir) => {
    D.poly(g, [[x, 16], [x + 10 * dir, 16], [x + 4 * dir, 70], [x + 8 * dir, 112], [x, 112]], '#7A2E4A');
    for (let k = 2; k < 10; k += 3) D.line(g, x + k * dir, 18, x + Math.round(k * 0.4) * dir, 70, '#5E2038');
    D.r(g, dir > 0 ? x : x - 6, 68, 7, 3, C.gold);
  };
  curtain(240, 1); curtain(287, -1);
  // vignette
  D.dith(g, 0, 0, 6, 200, C.ink2, 1); D.dith(g, 282, 0, 6, 200, C.ink2, 1); D.dith(g, 0, 152, W, 2, C.ink2, 1);
}
function skyClipEll(g, cx, cy, rx, ry, cols) {
  for (let dy = -ry; dy <= ry; dy++) {
    const t = dy / ry, dx = Math.round(rx * Math.sqrt(Math.max(0, 1 - t * t)));
    const ci = clamp(Math.floor(((dy + ry) / (2 * ry + 1)) * cols.length), 0, cols.length - 1);
    D.r(g, cx - dx, cy + dy, dx * 2 + 1, 1, cols[ci]);
  }
}
function drawTinyDoor(g, open, glow) {
  // door slab: x165..175, y137..151, arched
  if (open > 0) {
    D.r(g, 165, 136, 11, 16, '#FFE7A0');
    D.r(g, 166, 138, 9, 13, '#FFF6D0');
    D.glow(g, 170, 146, 14, '#FFC93A', 0.35 + 0.1 * Math.sin(T * 3), 3);
    const w = Math.max(1, Math.round(9 * (1 - open)));
    D.r(g, 165, 137, w, 15, C.wood4); D.r(g, 165, 137, 1, 15, C.wood5);
    if (w > 3) D.r(g, 165 + w - 2, 143, 1, 1, C.gold);
  } else {
    D.r(g, 166, 138, 9, 14, C.wood4); D.r(g, 167, 137, 7, 1, C.wood4); D.r(g, 168, 136, 5, 1, C.wood4);
    D.r(g, 169, 138, 1, 14, C.wood3); D.r(g, 172, 138, 1, 14, C.wood3);
    D.r(g, 166, 138, 1, 14, C.wood5);
    D.p(g, 173, 145, C.goldL); D.p(g, 170, 142, C.ink2); D.p(g, 170, 143, C.ink2);
    const a = 0.5 + 0.5 * Math.sin(T * 2.2);
    g.globalAlpha = 0.55 + 0.45 * a; D.r(g, 166, 151, 9, 1, '#FFD86A'); D.p(g, 170, 142, '#FFE38A'); g.globalAlpha = 1;
    if (glow) D.glow(g, 170, 150, 8, '#FFC93A', 0.18 * a, 2);
  }
}

// ===================== Stairs (288 x 440) =====================
const STAIR = {
  flights: [[90, 404, 230, 334], [252, 334, 72, 254], [52, 254, 210, 174]],
  landings: [[222, 334, 268], [24, 254, 80], [196, 174, 288]],
  path: [[96, 404], [230, 334], [250, 334], [74, 254], [54, 254], [210, 174], [226, 174]],
};
function paintStairs(g) {
  const rnd = rand(7);
  const HH = 440;
  // trunk interior wall
  for (let x = 0; x < W; x++) {
    const edge = Math.min(x, W - 1 - x);
    const base = edge < 18 ? '#24140E' : edge < 40 ? '#33200F' : (x % 7 === 0 ? '#4A2E1C' : '#40281A');
    D.r(g, x, 0, 1, HH, base);
  }
  for (let i = 0; i < 260; i++) {
    const x = Math.floor(rnd() * W), y = Math.floor(rnd() * HH), l = 6 + Math.floor(rnd() * 30);
    const edge = Math.min(x, W - 1 - x);
    D.r(g, x, y, 1, l, edge < 30 ? '#2A180E' : rnd() < 0.5 ? '#553522' : '#2E1C12');
  }
  for (let y = 30; y < HH; y += 34) {
    for (let x = 0; x < W; x++) { const yy = y + Math.round(Math.pow((x - 144) / 144, 2) * -10); if (rnd() < 0.8) D.p(g, x, yy, '#2A1810'); }
  }
  // knotholes
  const knot = (x, y) => { D.ell(g, x, y, 5, 7, '#2A180E'); D.ell(g, x, y, 4, 6, '#120A08'); D.line(g, x - 5, y - 6, x - 3, y - 8, '#5A3826'); };
  knot(160, 292); knot(64, 182); knot(250, 386); knot(140, 60);
  // roots hanging
  for (let i = 0; i < 9; i++) { let x = 20 + rnd() * 250, y = 0; for (let k = 0; k < 20 + rnd() * 20; k++) { D.p(g, x, y, '#5A3826'); D.p(g, x + 1, y, '#3B2418'); y++; x += Math.round((rnd() - 0.5) * 1.4); } }
  // shelf fungus with glowing mushrooms
  const fungus = (x, y) => {
    D.ell(g, x, y, 10, 3, '#B89068'); D.r(g, x - 10, y, 21, 2, '#8A6A4A');
    for (let k = -6; k <= 6; k += 4) { const cx = x + k, cy = y - 4 - Math.floor(rnd() * 3); D.r(g, cx, cy, 1, y - cy, '#E8DCBE'); D.ell(g, cx, cy, 2, 1, rnd() < 0.5 ? '#E89AB8' : '#9ACDE0'); }
  };
  fungus(34, 366); fungus(196, 268); fungus(112, 126); fungus(272, 300);
  // bottom floor
  planksH(g, 0, 404, W, [5, 6, 7, 8, 10], ['#6E4630', '#7A4E33', '#664028'], rnd);
  // giant door (the tiny door, from inside)
  const dx = 10, dw = 64, dt = 300, db = 404;
  D.poly(g, [[dx - 4, db], [dx - 4, dt + 28], [dx + dw / 2, dt - 6], [dx + dw + 4, dt + 28], [dx + dw + 4, db]], '#1A100A');
  D.poly(g, [[dx, db], [dx, dt + 30], [dx + dw / 2, dt], [dx + dw, dt + 30], [dx + dw, db]], C.wood4);
  for (let x = dx + 10; x < dx + dw; x += 11) D.r(g, x, dt + 4, 2, db - dt - 4, C.wood3);
  D.r(g, dx, dt + 46, dw, 4, '#3A3036'); D.r(g, dx, dt + 84, dw, 4, '#3A3036');
  D.r(g, dx, dt + 46, dw, 1, '#6A5E66'); D.r(g, dx, dt + 84, dw, 1, '#6A5E66');
  D.disc(g, dx + dw - 12, 362, 4, C.gold); D.disc(g, dx + dw - 13, 361, 2, C.goldL);
  D.ell(g, dx + dw - 12, 372, 2, 2, C.ink2); D.r(g, dx + dw - 13, 373, 3, 6, C.ink2);
  // stairs
  for (const [x0, y0, x1, y1] of STAIR.flights) drawFlight(g, x0, y0, x1, y1);
  for (const [x0, y, x1] of STAIR.landings) {
    D.r(g, x0, y, x1 - x0, 4, C.wood4); D.r(g, x0, y, x1 - x0, 1, C.wood5); D.r(g, x0, y + 4, x1 - x0, 3, C.wood2); D.r(g, x0, y + 7, x1 - x0, 1, C.ink2);
    for (let x = x0 + 4; x < x1; x += 14) D.r(g, x, y + 8, 3, 10, C.wood2);
  }
  // top round door
  D.disc(g, 252, 152, 23, '#1A100A');
  D.disc(g, 252, 152, 21, C.wood2);
  D.disc(g, 252, 152, 18, C.wood4);
  for (let x = 236; x < 270; x += 6) { const half = Math.round(Math.sqrt(Math.max(0, 18 * 18 - (x - 252) * (x - 252)))); D.r(g, x, 152 - half, 1, half * 2, C.wood3); }
  D.disc(g, 262, 154, 2, C.gold);
  D.r(g, 229, 172, 46, 3, '#1A100A');
  // sign
  D.r(g, 188, 126, 36, 17, C.wood1); D.r(g, 189, 127, 34, 15, C.wood5); D.r(g, 189, 127, 34, 1, '#D8A878');
  text3(g, 'SECRET', 190 + (34 - text3w('SECRET')) / 2, 129, C.ink);
  text3(g, 'ATTIC', 190 + (34 - text3w('ATTIC')) / 2, 135, C.ink);
  D.r(g, 196, 143, 1, 4, C.wood1); D.r(g, 216, 143, 1, 4, C.wood1);
  // scribble under the sign
  D.r(g, 192, 148, 30, 7, '#E8DCBE'); D.dith(g, 192, 148, 30, 7, '#CBBCA3', 1);
  for (let x = 194; x < 220; x += 2) D.p(g, x, 150 + (x % 4 === 0 ? 0 : 1), '#7A4E33');
  for (let x = 196; x < 214; x += 2) D.p(g, x, 153 - (x % 4 === 0 ? 0 : 1), '#7A4E33');
}
function drawFlight(g, x0, y0, x1, y1) {
  const dir = x1 > x0 ? 1 : -1, len = Math.abs(x1 - x0), steps = Math.round(len / 7), rise = (y0 - y1) / steps;
  // stringer
  D.poly(g, [[x0, y0 + 4], [x1, y1 + 4], [x1, y1 + 12], [x0, y0 + 12]], C.wood2);
  D.line(g, x0, y0 + 12, x1, y1 + 12, C.ink2);
  for (let i = 0; i < steps; i++) {
    const sx = x0 + dir * i * 7, sy = Math.round(y0 - (i + 1) * rise);
    const lx = dir > 0 ? sx : sx - 7;
    D.r(g, lx, sy, 7, Math.ceil(rise) + 2, C.wood3);
    D.r(g, lx, sy, 7, 1, C.wood5); D.r(g, lx, sy + 1, 7, 1, C.wood4);
    D.r(g, dir > 0 ? lx + 6 : lx, sy, 1, Math.ceil(rise) + 2, C.wood2);
  }
  // railing
  for (let i = 0; i <= steps; i += 3) {
    const sx = x0 + dir * i * 7, sy = Math.round(y0 - i * rise);
    D.r(g, sx, sy - 18, 1, 18, C.wood2); D.p(g, sx, sy - 18, C.wood4);
  }
  D.line(g, x0, y0 - 18, x1, y1 - 18, C.wood4); D.line(g, x0, y0 - 17, x1, y1 - 17, C.wood2);
}
function drawLantern(g, x, y, t, seed) {
  D.r(g, x, y - 8, 1, 6, '#2A2020');
  D.r(g, x - 3, y - 3, 7, 2, '#2A2020'); D.r(g, x - 2, y - 1, 5, 7, '#FFD27A'); D.r(g, x - 3, y - 1, 1, 7, '#2A2020'); D.r(g, x + 3, y - 1, 1, 7, '#2A2020'); D.r(g, x - 3, y + 6, 7, 1, '#2A2020');
  const f = 0.8 + 0.2 * Math.sin(t * 9 + seed) + 0.1 * Math.sin(t * 23 + seed * 3);
  D.r(g, x, y + 1, 1, 3, '#FFFBE0');
  D.glow(g, x, y + 2, 26, '#FFB040', 0.22 * f, 4);
}

// ===================== Forest =====================
function paintForest(g, restored) {
  const rnd = rand(77);
  // sky = attic ceiling with golden haze
  skyBands(g, 0, 0, W, 120, ['#E2A860', '#E8B46A', '#EEC278', '#F2CE88', '#F2D294']);
  // rafters
  D.poly(g, [[0, 70], [0, 56], [144, -4], [144, 8]], C.wood2); D.line(g, 0, 56, 144, -4, C.wood4);
  D.poly(g, [[288, 70], [288, 56], [144, -4], [144, 8]], C.wood2); D.line(g, 288, 56, 144, -4, C.wood4);
  D.poly(g, [[0, 70], [144, 8], [144, 11], [0, 74]], '#3B2418'); D.poly(g, [[288, 70], [144, 8], [144, 11], [288, 74]], '#3B2418');
  D.r(g, 40, 30, 208, 5, C.wood2); D.r(g, 40, 30, 208, 1, C.wood4); D.r(g, 40, 35, 208, 1, '#3B2418');
  for (const x of [70, 218]) { D.r(g, x, 35, 5, 30, C.wood2); D.r(g, x, 35, 1, 30, C.wood4); }
  // skylight
  D.r(g, 118, 4, 52, 20, '#3B2418'); D.r(g, 121, 6, 46, 16, '#FFF8DC'); D.r(g, 143, 6, 2, 16, '#3B2418'); D.r(g, 121, 13, 46, 2, '#3B2418');
  D.glow(g, 144, 14, 40, '#FFF0B0', 0.35, 4);
  // distant forest
  const hz = ['#C9A56E', '#B89A64', '#A89060'];
  for (const [x, w, c] of [[14, 12, 0], [48, 9, 1], [230, 10, 0], [262, 14, 1], [196, 8, 2], [86, 7, 2], [104, 6, 1], [212, 5, 0]]) {
    D.r(g, x, 40, w, 120, hz[c]); D.r(g, x, 40, 1, 120, mix(hz[c], '#FFF6C8', 0.25)); D.r(g, x + w - 1, 40, 1, 120, mix(hz[c], '#000000', 0.12));
  }
  D.r(g, 0, 118, W, 34, '#7E8A4A'); D.dith(g, 0, 114, W, 4, '#7E8A4A', 2);
  for (let x = -10; x < W + 10; x += 14) leafMass(g, x, 132 + Math.sin(x) * 4, 14, 16, ['#6E7A44', '#7E8A4A', '#8E9A54', '#A8AE68'], rnd, 18);
  D.r(g, 0, 140, W, 12, '#7A8648'); D.dith(g, 0, 136, W, 4, '#7A8648', 2);
  // canopy
  const leaves = ['#36421B', '#4A5A2A', '#5D6A3E', '#7A8A4C', '#A1AF7C'];
  const autumn = ['#7A3A12', '#96490D', '#C97034', '#DCA438', '#F2D27A'];
  leafMass(g, 30, 14, 50, 26, leaves, rnd, 160);
  leafMass(g, 258, 12, 50, 26, leaves, rnd, 160);
  leafMass(g, 82, 4, 34, 14, autumn, rnd, 60);
  leafMass(g, 210, 6, 34, 14, autumn, rnd, 60);
  leafMass(g, 4, 50, 24, 20, leaves, rnd, 50);
  leafMass(g, 284, 50, 24, 20, leaves, rnd, 50);
  // ground
  skyBands(g, 0, 150, W, 50, ['#8E9A54', '#7E8A4A', '#6E7A40', '#5E6A36', '#4E5A2E']);
  D.dith(g, 60, 152, 170, 6, '#A8B062', 1);
  // path
  D.poly(g, [[0, 168], [30, 166], [70, 172], [120, 170], [150, 166], [162, 166], [170, 172], [130, 178], [80, 180], [30, 178], [0, 180]], '#B8946A');
  D.poly(g, [[0, 170], [30, 168], [70, 174], [120, 172], [148, 168], [160, 168], [166, 172], [128, 176], [80, 178], [30, 176], [0, 178]], '#C8A47A');
  // tufts & flowers
  for (let i = 0; i < 160; i++) {
    const x = Math.floor(rnd() * W), y = 152 + Math.floor(rnd() * 46);
    D.r(g, x, y, 1, 2, rnd() < 0.5 ? '#A8B468' : '#3E4A24');
  }
  for (let i = 0; i < 30; i++) {
    const x = Math.floor(rnd() * W), y = 156 + Math.floor(rnd() * 38);
    D.p(g, x, y + 1, '#4E5A2E'); D.p(g, x, y, ['#E89AB8', '#F2D27A', '#FFF1C8', '#FE9B5B'][i % 4]);
  }
  const shroom = (x, y) => { D.r(g, x, y - 3, 2, 3, '#F4EBD9'); D.ell(g, x + 0.5, y - 4, 3, 2, '#B8462A'); D.p(g, x - 1, y - 5, '#FFF1C8'); D.p(g, x + 2, y - 4, '#FFF1C8'); };
  shroom(60, 172); shroom(214, 178); shroom(236, 168); shroom(244, 171); shroom(98, 186);
  // arrival tree (left)
  D.r(g, 0, 0, 34, 178, '#5A3826'); D.r(g, 28, 0, 6, 178, '#3B2418'); D.r(g, 4, 0, 2, 178, '#7A4E33');
  for (let y = 10; y < 170; y += 9) D.r(g, 10 + (y % 3) * 4, y, 1, 6, '#3B2418');
  D.poly(g, [[0, 176], [44, 180], [34, 168], [0, 160]], '#5A3826');
  // its little door (open)
  D.ell(g, 17, 156, 10, 10, '#1A100A'); D.r(g, 7, 156, 21, 21, '#1A100A');
  D.ell(g, 17, 156, 8, 8, '#FFE9A8'); D.r(g, 9, 156, 17, 20, '#FFE9A8');
  D.ell(g, 17, 158, 5, 5, '#FFF6D8'); D.r(g, 12, 158, 11, 18, '#FFF6D8');
  D.poly(g, [[3, 178], [3, 152], [9, 150], [9, 176]], C.wood4); D.r(g, 4, 153, 1, 24, C.wood5); D.p(g, 7, 165, C.gold);
  D.poly(g, [[9, 177], [26, 177], [44, 186], [16, 186]], '#E8D088');
  leafMass(g, 18, 20, 30, 24, leaves, rnd, 70);
  // right tree
  D.r(g, 266, 0, 22, 176, '#5A3826'); D.r(g, 266, 0, 2, 176, '#7A4E33'); D.poly(g, [[256, 178], [288, 178], [288, 164], [268, 168]], '#5A3826');
  leafMass(g, 280, 18, 24, 22, leaves, rnd, 60);
  // great tree
  D.r(g, 128, 0, 32, 100, '#5E3C28');
  D.r(g, 122, 96, 44, 72, '#6A4430');
  for (let x = 126; x < 164; x += 6) D.r(g, x + (x % 4), 100, 1, 64, '#4A2E20');
  D.r(g, 124, 96, 2, 72, '#8A5E40');
  D.poly(g, [[104, 170], [122, 150], [122, 168]], '#6A4430'); D.poly(g, [[186, 170], [166, 150], [166, 168]], '#5A3826');
  D.poly(g, [[118, 172], [126, 156], [134, 172]], '#5E3C28');
  // trunk sign
  D.r(g, 114, 116, 32, 11, C.wood1); D.r(g, 115, 117, 30, 9, C.wood5); D.r(g, 115, 117, 30, 1, '#D8A878');
  text3(g, 'SPARKEE', 116 + (30 - text3w('SPARKEE')) / 2, 119, '#5A2844');
  D.r(g, 120, 127, 1, 3, C.wood1); D.r(g, 140, 127, 1, 3, C.wood1);
  // treehouse: struts
  D.line(g, 90, 102, 124, 128, C.wood2); D.line(g, 91, 102, 125, 128, C.wood2); D.line(g, 92, 102, 126, 128, '#3B2418');
  D.line(g, 198, 102, 164, 128, C.wood2); D.line(g, 197, 102, 163, 128, C.wood2); D.line(g, 196, 102, 162, 128, '#3B2418');
  // cabin walls
  planksV(g, 92, 46, 104, 50, 6, ['#9C6B45', '#B07848', '#7A8A54', '#A86070', '#C88A4A', '#8A6A58', '#9C6B45'], rnd);
  D.r(g, 92, 46, 104, 2, '#3B2418');
  D.line(g, 96, 90, 120, 82, '#C8A070'); D.line(g, 96, 91, 120, 83, '#8A6040');
  // door
  D.poly(g, [[136, 96], [136, 76], [144, 70], [152, 76], [152, 96]], '#3B2418');
  D.poly(g, [[138, 96], [138, 77], [144, 72], [150, 77], [150, 96]], '#7A4E33');
  D.r(g, 141, 76, 1, 20, '#5A3826'); D.r(g, 146, 76, 1, 20, '#5A3826'); D.p(g, 148, 86, C.gold);
  // windows
  D.disc(g, 112, 66, 9, '#3B2418'); D.disc(g, 112, 66, 7, restored ? '#FFD27A' : '#3A3236');
  if (restored) { D.disc(g, 112, 66, 5, '#FFE9A8'); }
  D.r(g, 112, 59, 1, 15, '#3B2418'); D.r(g, 105, 66, 15, 1, '#3B2418');
  D.r(g, 164, 56, 22, 22, '#3B2418'); D.r(g, 166, 58, 18, 18, restored ? '#FFD27A' : '#3A3236');
  D.r(g, 174, 58, 2, 18, '#3B2418'); D.r(g, 166, 66, 18, 2, '#3B2418');
  D.poly(g, [[186, 56], [194, 58], [192, 80], [186, 78]], '#7A8A54'); D.line(g, 189, 58, 189, 78, '#5D6A3E');
  // roof
  D.poly(g, [[82, 52], [144, 14], [206, 52], [206, 56], [144, 18], [82, 56]], '#3B2418');
  const shing = ['#7A3A2E', '#8A4A30', '#6A3A40', '#7A3A2E', '#8A4A30'];
  for (let y = 18; y < 52; y += 3) {
    const half = ((y - 14) / 38) * 62;
    for (let x = 144 - half; x < 144 + half; x += 5) {
      const c = (x > 160 && x < 176 && y > 30 && y < 42) ? '#5D6A3E' : shing[Math.floor(rnd() * shing.length)];
      D.r(g, x + ((y / 3) % 2) * 2, y, 5, 3, c); D.r(g, x + ((y / 3) % 2) * 2, y + 2, 5, 1, mix(c, '#000000', 0.3));
    }
  }
  D.line(g, 82, 52, 144, 14, C.wood4); D.line(g, 144, 14, 206, 52, C.wood4);
  // crooked chimney
  D.poly(g, [[170, 34], [174, 12], [184, 13], [181, 36]], '#8A4A3A');
  for (let y = 15; y < 34; y += 4) D.line(g, 172 + (34 - y) / 6, y, 182 + (34 - y) / 8, y + 1, '#6A3A2E');
  D.poly(g, [[172, 13], [173, 9], [186, 10], [185, 14]], '#5A2E24');
  // flag
  D.r(g, 96, 30, 1, 14, C.wood1); D.poly(g, [[97, 30], [106, 33], [97, 36]], '#DB95B5');
  // platform & railing
  D.r(g, 80, 96, 128, 5, C.wood4); D.r(g, 80, 96, 128, 1, C.wood5); D.r(g, 80, 101, 128, 2, C.wood2);
  for (const x of [82, 98, 114, 130, 166, 182, 198, 206]) D.r(g, x, 87, 2, 9, C.wood3);
  D.r(g, 80, 86, 66, 2, C.wood3); D.r(g, 162, 86, 46, 2, C.wood3); D.r(g, 80, 86, 66, 1, C.wood5); D.r(g, 162, 86, 46, 1, C.wood5);
  // hanging lantern on right tree
  D.r(g, 262, 60, 4, 1, C.wood1); D.r(g, 262, 60, 1, 8, '#2A2020');
}
function drawLadder(g, x, yTop, yBot, sway) {
  const rope = '#C8A06A', ropeD = '#8A6A40';
  for (let y = yTop; y < yBot; y++) {
    const k = (y - yTop) / (yBot - yTop), off = Math.round(Math.sin(T * 1.3) * sway * k);
    D.p(g, x + off, y, rope); D.p(g, x + 9 + off, y, rope); D.p(g, x + 1 + off, y, ropeD); D.p(g, x + 10 + off, y, ropeD);
  }
  for (let y = yTop + 4; y < yBot - 1; y += 6) {
    const k = (y - yTop) / (yBot - yTop), off = Math.round(Math.sin(T * 1.3) * sway * k);
    D.r(g, x + off, y, 11, 2, C.wood4); D.r(g, x + off, y + 1, 11, 1, C.wood2);
  }
}
function paintFerns(g, rnd, x0, y0, flip) {
  for (let i = 0; i < 7; i++) {
    const bx = x0 + (flip ? -1 : 1) * i * 6, by = y0 + 30;
    const len = 18 + rnd() * 16, ang = (flip ? -1 : 1) * (0.35 + rnd() * 0.6);
    for (let k = 0; k < len; k++) {
      const x = bx + Math.sin(ang) * k * (1 + k / 60), y = by - Math.cos(ang) * k + (k * k) / 40;
      D.p(g, x, y, '#24301A');
      if (k % 2 === 0 && k > 3) { D.p(g, x - 1, y + 1, '#2E3C1C'); D.p(g, x + 1, y + 1, '#2E3C1C'); D.p(g, x - 2, y + 2, '#24301A'); D.p(g, x + 2, y + 2, '#24301A'); }
    }
  }
}

// ===================== Library =====================
const LIB = {
  fire: [178, 138], shelfBook: [36, 46], beanbag: [128, 170], table: [233, 136], stool: [180, 166],
};
function paintLibrary(g, opts = {}) {
  const rnd = rand(5);
  // ceiling triangle
  D.r(g, 0, 0, W, 50, '#24140E');
  D.poly(g, [[0, 46], [144, 2], [288, 46], [288, 50], [0, 50]], '#4A2E20');
  for (let y = 6; y < 50; y += 4) { const half = ((y - 2) / 44) * 144; D.r(g, 144 - half, y, half * 2, 1, '#3B2418'); }
  D.poly(g, [[0, 42], [144, -2], [144, 6], [0, 50]], C.wood2); D.line(g, 0, 42, 144, -2, C.wood4);
  D.poly(g, [[288, 42], [144, -2], [144, 6], [288, 50]], C.wood2); D.line(g, 288, 42, 144, -2, C.wood4);
  // back wall
  planksV(g, 0, 40, W, 112, 8, ['#8A5A3A', '#9C6B45', '#7A4E33', '#A8754A', '#946240'], rnd);
  D.dith(g, 0, 40, W, 4, C.ink2, 2);
  // collar beam (fairy lights hang here)
  D.r(g, 8, 28, 272, 6, C.wood2); D.r(g, 8, 28, 272, 1, C.wood4); D.r(g, 8, 34, 272, 1, C.ink2);
  for (const x of [8, 274]) { D.r(g, x, 34, 6, 10, C.wood2); }
  // --- bookshelf ---
  D.r(g, 14, 38, 108, 6, C.wood2); D.r(g, 14, 38, 108, 1, C.wood4); D.r(g, 12, 42, 112, 2, C.wood1);
  D.r(g, 16, 44, 104, 106, '#2E1A12');
  D.dith(g, 20, 44, 96, 106, '#3B2418', 2);
  D.r(g, 16, 44, 4, 108, C.wood2); D.r(g, 116, 44, 4, 108, C.wood2); D.r(g, 16, 44, 1, 108, C.wood4); D.r(g, 119, 44, 1, 108, C.wood1);
  D.r(g, 67, 44, 3, 104, C.wood2); D.r(g, 67, 44, 1, 104, C.wood4);
  for (const y of [70, 92, 112, 132]) { D.r(g, 20, y, 96, 3, C.wood3); D.r(g, 20, y, 96, 1, C.wood5); D.r(g, 20, y + 3, 96, 1, '#1E100A'); }
  D.r(g, 16, 146, 104, 6, C.wood2); D.r(g, 16, 146, 104, 1, C.wood4);
  // a few old things on shelves
  D.r(g, 24, 142, 18, 4, '#6E5A70'); D.r(g, 24, 142, 18, 1, '#8A7690'); D.r(g, 26, 138, 15, 4, '#5D6A3E'); D.r(g, 26, 138, 15, 1, '#7A8A54');
  D.r(g, 100, 106, 4, 6, '#E8DCBE'); D.r(g, 101, 104, 2, 2, '#F4EBD9'); D.p(g, 101, 103, '#3A3036');
  D.r(g, 76, 127, 8, 5, '#B88A50'); D.r(g, 76, 126, 8, 1, '#CBBCA3'); D.r(g, 78, 123, 4, 3, '#7A9A5A');
  // wiggle book (the quest book), drawn dynamically when needed — slot at x96..100,y70..86
  // book stand on top shelf (left compartment)
  D.r(g, 28, 67, 28, 3, C.wood4); D.r(g, 28, 67, 28, 1, C.wood5); D.r(g, 30, 64, 2, 3, C.wood3); D.r(g, 52, 64, 2, 3, C.wood3);
  // rolling ladder
  for (const [ax, bx] of [[104, 112], [110, 118]]) D.line(g, ax, 154, bx, 40, C.wood4);
  for (let y = 50; y < 150; y += 10) { const k = (154 - y) / 114, x = 104 + k * 8; D.r(g, Math.round(x), y, 7, 2, C.wood3); D.r(g, Math.round(x), y, 7, 1, C.wood5); }
  // --- fireplace ---
  stones(g, 154, 0, 48, 96, rnd, ['#8A7E7A', '#7A6E6E', '#9A8E86', '#6E6260', '#847876'], '#4A4040');
  stones(g, 148, 96, 60, 54, rnd, ['#8A7E7A', '#7A6E6E', '#9A8E86', '#6E6260', '#847876'], '#4A4040');
  D.r(g, 142, 90, 72, 7, C.wood3); D.r(g, 142, 90, 72, 1, C.wood5); D.r(g, 142, 96, 72, 1, C.ink2);
  D.poly(g, [[162, 150], [162, 120], [170, 112], [186, 112], [194, 120], [194, 150]], '#1A0E0C');
  D.poly(g, [[164, 150], [164, 121], [171, 114], [185, 114], [192, 121], [192, 150]], '#2E1A16');
  for (let y = 118; y < 150; y += 4) for (let x = 165 + ((y / 4) % 2) * 3; x < 191; x += 6) D.r(g, x, y, 5, 3, '#3A2018');
  D.r(g, 144, 148, 68, 6, '#9A8E86'); D.r(g, 144, 148, 68, 1, '#B4A89E'); D.r(g, 144, 153, 68, 1, '#5A4E4C');
  // logs
  D.r(g, 168, 141, 22, 5, C.wood2); D.r(g, 168, 141, 22, 1, C.wood3); D.disc(g, 168, 143, 2, '#B88A5A'); D.p(g, 168, 143, '#7A4E33');
  D.r(g, 172, 137, 16, 4, '#4A2E20'); D.disc(g, 187, 139, 2, '#B88A5A');
  // mantel things
  D.r(g, 150, 86, 4, 4, '#B8862E'); D.r(g, 151, 79, 2, 7, '#F4EBD9');
  D.r(g, 170, 76, 14, 14, C.gold); D.r(g, 171, 77, 12, 12, '#3A4A5A'); D.disc(g, 177, 83, 4, '#FFD84A'); D.p(g, 175, 82, C.ink); D.p(g, 179, 82, C.ink); D.r(g, 174, 85, 7, 1, '#6E3B1A'); D.p(g, 173, 84, '#6E3B1A'); D.p(g, 181, 84, '#6E3B1A');
  D.r(g, 196, 82, 8, 8, '#7E93A3'); D.r(g, 196, 82, 8, 1, '#A8BCC8'); D.r(g, 197, 80, 6, 2, '#96490D');
  for (const [x, y, c] of [[198, 86, '#E89AB8'], [201, 85, '#F2D27A'], [199, 88, '#A1AF7C']]) D.p(g, x, y, c);
  // --- round window ---
  D.disc(g, 234, 66, 16, C.wood1); D.disc(g, 234, 66, 14, C.wood2);
  skyClipEll(g, 234, 66, 12, 12, ['#F2D294', '#E8C27A', '#A8B062', '#7A8A4C', '#5D6A3E']);
  leafMass(g, 228, 70, 7, 4, ['#36421B', '#4A5A2A', '#7A8A4C'], rnd, 14);
  D.r(g, 233, 54, 2, 25, C.wood2); D.r(g, 222, 65, 25, 2, C.wood2);
  // --- kitchen door (locked) ---
  D.r(g, 254, 90, 32, 62, C.wood1);
  planksV(g, 257, 94, 26, 58, 6, ['#A86A44', '#9A5E3A', '#B07448'], rnd, false);
  D.disc(g, 270, 104, 4, C.wood1); D.disc(g, 270, 104, 3, '#3A3236');
  D.r(g, 254, 82, 32, 8, C.wood1); D.r(g, 255, 83, 30, 6, C.wood5);
  text3(g, 'KITCHEN', 256, 84, '#5A2844');
  D.r(g, 278, 124, 1, 3, '#6A5E66'); D.ell(g, 278, 129, 3, 3, C.gold); D.r(g, 275, 129, 7, 4, C.gold); D.r(g, 275, 129, 7, 1, C.goldL); D.p(g, 278, 131, C.ink);
  // side table
  D.ell(g, 233, 137, 11, 2, C.wood4); D.r(g, 222, 137, 23, 1, C.wood5); D.r(g, 222, 139, 23, 1, C.wood2);
  D.r(g, 232, 140, 3, 14, C.wood2); D.r(g, 227, 153, 13, 2, C.wood2);
  // floor
  planksH(g, 0, 152, W, [4, 5, 5, 6, 7, 8, 7, 6], ['#6E4630', '#7A4E33', '#664028', '#82543A'], rnd);
  // rug
  D.ell(g, 150, 180, 50, 12, '#7E2E4A'); D.ell(g, 150, 180, 47, 10, '#C97034'); D.ell(g, 150, 180, 44, 9, '#8A3A52');
  D.ell(g, 150, 180, 30, 6, '#DB95B5'); D.ell(g, 150, 180, 27, 5, '#8A3A52'); D.ell(g, 150, 180, 12, 2, '#DCA438');
  // trapdoor
  D.r(g, 16, 182, 30, 13, C.wood1); D.r(g, 17, 183, 28, 11, C.wood3); for (let x = 23; x < 45; x += 7) D.r(g, x, 183, 1, 11, C.wood2);
  D.ring(g, 31, 188, 2, '#6A5E66');
  // stool
  D.r(g, 172, 160, 16, 3, C.wood4); D.r(g, 172, 160, 16, 1, C.wood5);
  D.line(g, 174, 163, 172, 172, C.wood2); D.line(g, 186, 163, 188, 171, C.wood2); D.line(g, 180, 163, 180, 170, C.wood3);
}
function paintCobwebs(g) {
  const web = '#B8B2C4';
  const corner = (x, y, dx, dy, s) => {
    g.fillStyle = web;
    for (let i = 0; i <= s; i += 3) { D.line(g, x, y, x + dx * s, y + dy * i, web); D.line(g, x, y, x + dx * i, y + dy * s, web); }
    for (let r = 4; r < s; r += 4) { for (let k = 0; k <= r; k++) D.p(g, x + dx * k, y + dy * (r - k + Math.round(Math.sin(k) * 0.6)), web); }
  };
  corner(20, 44, 1, 1, 12); corner(116, 44, -1, 1, 10); corner(70, 73, 1, 1, 8); corner(66, 115, -1, 1, 9); corner(20, 135, 1, 1, 7);
  corner(164, 114, 1, 1, 8); corner(192, 114, -1, 1, 7); corner(0, 50, 1, 1, 14); corner(287, 48, -1, 1, 14); corner(222, 52, 1, 1, 6);
  const r2 = rand(9); for (let i = 0; i < 50; i++) D.p(g, 20 + r2() * 96, 60 + r2() * 86, '#8A8494');
}
function drawFire(g, x, y, t, k) {
  if (k <= 0) return;
  const rows = 22;
  for (let i = 0; i < rows; i++) {
    const yy = y - i;
    const w = Math.max(0, (12 - i * 0.45 + Math.sin(t * 9 + i * 0.7) * 2.2) * k);
    const off = Math.sin(t * 6 + i * 0.5) * (i * 0.15);
    const c = i < 4 ? '#FFF6C8' : i < 9 ? '#FFD84A' : i < 15 ? '#FE9B5B' : '#C97034';
    if (w > 0.5) D.r(g, x - w + off, yy, w * 2, 1, c);
    if (i < 12 && w > 3) D.r(g, x - w * 0.4 + off, yy, w * 0.8, 1, i < 6 ? '#FFFFFF' : '#FFF6C8');
  }
  // tongues
  for (let j = 0; j < 4; j++) {
    const fx = x - 8 + j * 5 + Math.sin(t * 4 + j) * 1.5, h = (6 + ((Math.sin(t * 7 + j * 2) + 1) * 4)) * k;
    for (let i = 0; i < h; i++) D.p(g, fx + Math.sin(t * 10 + i + j) * 0.8, y - 14 * k - i, i < h / 2 ? '#FE9B5B' : '#C97034');
  }
  D.glow(g, x, y - 6, 60, '#FF9A3A', 0.3 * k * (0.9 + 0.1 * Math.sin(t * 13)), 5);
}

// ===================== Items =====================
function drawBeanbag(g, x, y, squash = 0) {
  const ry = 8 - squash, rx = 14 + squash;
  D.ell(g, x, y - ry, rx + 1, ry + 1, '#7A2E48');
  D.ell(g, x, y - ry, rx, ry, '#E98AA2');
  D.ell(g, x - 3, y - ry - 3, rx - 6, ry - 4, '#F7B6C6');
  D.ell(g, x + 4, y - ry + 3, rx - 7, ry - 5, '#C76580');
  D.ell(g, x + 1, y - ry * 1.5, 5, 1, '#C76580');
  D.p(g, x - 7, y - ry - 4, '#FFFFFF');
}
function drawLights(g, t, k = 1, from = 0) {
  const swags = [[14, 92], [92, 186], [186, 274]];
  let n = 0;
  const cols = ['#F2D27A', '#E98AA2', '#A1AF7C', '#FE9B5B', '#9ACDE0'];
  for (const [a, b] of swags) {
    for (let x = a; x <= b; x++) {
      const yy = 35 + Math.sin(((x - a) / (b - a)) * Math.PI) * 7;
      D.p(g, x, yy, '#3A2A20');
      if ((x - a) % 8 === 4) {
        n++;
        if (n / 32 > k) continue;
        const c = cols[n % cols.length];
        const on = 0.6 + 0.4 * Math.sin(t * 2.5 + n * 1.7);
        D.r(g, x, yy + 1, 1, 1, '#3A2A20');
        g.globalAlpha = 0.5 + 0.5 * on; D.r(g, x - 1, yy + 2, 3, 3, c); D.p(g, x, yy + 2, '#FFFFFF'); g.globalAlpha = 1;
        D.glow(g, x, yy + 3, 7, c, 0.22 * on, 2);
      }
    }
  }
}
function drawHeadphonesItem(g, x, y) {
  D.line(g, x - 4, y, x - 3, y - 4, C.ink); D.line(g, x - 3, y - 4, x + 3, y - 4, C.ink); D.line(g, x + 3, y - 4, x + 4, y, C.ink);
  D.r(g, x - 6, y - 1, 3, 4, '#E8628A'); D.r(g, x + 4, y - 1, 3, 4, '#E8628A'); D.p(g, x - 6, y - 1, '#F7A6BE'); D.p(g, x + 4, y - 1, '#F7A6BE');
}
function drawPresent(g, x, y, wrap, ribbon, lid = 0) {
  D.r(g, x - 7, y - 11, 14, 11, C.ink); D.r(g, x - 6, y - 10, 12, 9, wrap); D.r(g, x - 6, y - 10, 12, 1, mix(wrap, '#FFFFFF', 0.35));
  D.r(g, x - 1, y - 10, 2, 9, ribbon);
  const ly = y - 13 - lid;
  D.r(g, x - 8, ly, 16, 4, C.ink); D.r(g, x - 7, ly + 1, 14, 2, mix(wrap, '#FFFFFF', 0.15)); D.r(g, x - 1, ly + 1, 2, 2, ribbon);
  D.p(g, x - 3, ly - 1, ribbon); D.p(g, x - 2, ly - 2, ribbon); D.p(g, x + 2, ly - 1, ribbon); D.p(g, x + 1, ly - 2, ribbon); D.p(g, x - 2, ly - 1, mix(ribbon, '#000', 0.3));
}
// the quest book (dusty, on shelf)
function drawShelfBook(g, x, y, wig) {
  const dx = wig ? Math.round(Math.sin(T * 30) * 1) : 0;
  D.r(g, x + dx, y, 5, 16, '#4A3A50'); D.r(g, x + dx, y, 5, 1, '#6E5A70'); D.r(g, x + dx, y + 3, 5, 1, C.gold); D.r(g, x + dx, y + 12, 5, 1, C.gold);
  D.p(g, x + dx + 2, y + 7, C.goldL);
}

function drawBookCover(g, x, y, animal) {
  D.r(g, x, y, 24, 24, C.ink);
  D.r(g, x + 1, y + 1, 21, 22, '#612C48'); D.r(g, x + 22, y + 1, 1, 22, C.parch); D.r(g, x + 1, y + 1, 21, 1, '#864C69');
  D.r(g, x + 2, y + 2, 19, 1, C.gold); D.r(g, x + 2, y + 21, 19, 1, C.gold);
  const ic = ICONS['a_' + animal];
  if (ic) g.drawImage(ic, x + 1, y + 1);
  D.r(g, x + 17, y + 20, 2, 5, '#C8323C');
}
// ===================== Icons =====================
const ICONS = {};
function icon(name, w, h, fn) { const [c, g] = mk(w, h); fn(g); ICONS[name] = c; return c; }
function animalIcon(kind) {
  const [c, g] = mk(20, 20);
  const eye = (x, y) => { D.r(g, x, y, 1, 2, C.ink); };
  const ears = (lx, ly, rx, ry, col, inner) => { D.poly(g, lx, col); D.poly(g, rx, col); if (inner) { D.poly(g, ly, inner); D.poly(g, ry, inner); } };
  switch (kind) {
    case 'cat':
      ears([[3, 9], [5, 2], [9, 6]], [[5, 7], [6, 4], [8, 6]], [[16, 9], [14, 2], [10, 6]], [[14, 7], [13, 4], [11, 6]], '#E8A050', '#F2B6B6');
      D.ell(g, 10, 12, 7, 6, '#E8A050'); D.r(g, 6, 8, 2, 1, '#C97034'); D.r(g, 12, 8, 2, 1, '#C97034'); D.r(g, 9, 7, 2, 2, '#C97034');
      eye(7, 11); eye(12, 11); D.r(g, 9, 14, 2, 1, '#E8628A'); D.p(g, 9, 15, C.ink); D.p(g, 10, 15, C.ink);
      D.r(g, 2, 13, 4, 1, C.ink); D.r(g, 14, 13, 4, 1, C.ink); D.p(g, 3, 15, C.ink); D.p(g, 4, 15, C.ink); D.p(g, 15, 15, C.ink); D.p(g, 16, 15, C.ink); break;
    case 'dog':
      D.ell(g, 10, 11, 6, 6, '#C8965E'); D.ell(g, 4, 11, 2, 5, '#7A5030'); D.ell(g, 16, 11, 2, 5, '#7A5030');
      D.ell(g, 10, 15, 4, 2, '#F0DEC0'); D.r(g, 9, 13, 3, 2, C.ink); eye(7, 10); eye(12, 10); D.r(g, 10, 17, 2, 2, '#E8628A'); D.ell(g, 13, 7, 2, 1, '#A87040'); break;
    case 'bear':
      D.disc(g, 4, 5, 3, '#8A5A3A'); D.disc(g, 16, 5, 3, '#8A5A3A'); D.disc(g, 4, 5, 1, '#C8906A'); D.disc(g, 16, 5, 1, '#C8906A');
      D.ell(g, 10, 11, 7, 7, '#8A5A3A'); D.ell(g, 10, 14, 3, 2, '#D8A880'); D.r(g, 9, 12, 3, 2, C.ink); eye(6, 9); eye(13, 9); break;
    case 'bunny':
      D.ell(g, 7, 4, 2, 5, '#F2EEF4'); D.ell(g, 13, 4, 2, 5, '#F2EEF4'); D.ell(g, 7, 4, 1, 3, '#F2B6C6'); D.ell(g, 13, 4, 1, 3, '#F2B6C6');
      D.ell(g, 10, 13, 6, 5, '#F2EEF4'); eye(7, 12); eye(12, 12); D.r(g, 9, 14, 2, 1, '#E8628A'); D.p(g, 6, 15, '#F2B6C6'); D.p(g, 13, 15, '#F2B6C6'); D.r(g, 9, 16, 2, 2, '#FFFFFF'); break;
    case 'fox':
      ears([[3, 9], [4, 1], [9, 6]], [[4, 7], [5, 4], [7, 6]], [[17, 9], [16, 1], [11, 6]], [[16, 7], [15, 4], [13, 6]], '#E07030', '#3A2018');
      D.ell(g, 10, 11, 7, 5, '#E07030'); D.poly(g, [[3, 12], [10, 19], [17, 12], [13, 12], [10, 15], [7, 12]], '#FFF1E0'); D.r(g, 9, 17, 2, 2, C.ink); eye(6, 10); eye(13, 10); break;
    case 'bird':
      D.ell(g, 10, 11, 7, 7, '#9A7050'); D.ell(g, 10, 14, 4, 4, '#E8D0A8'); D.poly(g, [[3, 5], [6, 2], [7, 6]], '#7A5038'); D.poly(g, [[17, 5], [14, 2], [13, 6]], '#7A5038');
      D.disc(g, 7, 9, 3, '#FFFFFF'); D.disc(g, 13, 9, 3, '#FFFFFF'); D.disc(g, 7, 9, 1, C.ink); D.disc(g, 13, 9, 1, C.ink); D.poly(g, [[9, 11], [11, 11], [10, 14]], '#F2B030'); break;
    case 'pig':
      ears([[3, 7], [5, 2], [8, 5]], null, [[17, 7], [15, 2], [12, 5]], null, '#E88AA0');
      D.ell(g, 10, 11, 7, 6, '#F4A8B8'); D.ell(g, 10, 13, 4, 3, '#E07890'); D.r(g, 8, 13, 1, 2, C.ink); D.r(g, 11, 13, 1, 2, C.ink); eye(6, 9); eye(13, 9); break;
    case 'mouse':
      D.disc(g, 5, 6, 4, '#A8A0AC'); D.disc(g, 15, 6, 4, '#A8A0AC'); D.disc(g, 5, 6, 2, '#F2B6C6'); D.disc(g, 15, 6, 2, '#F2B6C6');
      D.ell(g, 10, 13, 5, 5, '#A8A0AC'); eye(8, 12); eye(11, 12); D.r(g, 9, 16, 2, 2, '#E8628A'); D.r(g, 3, 15, 4, 1, C.ink); D.r(g, 13, 15, 4, 1, C.ink); break;
    case 'lion':
      for (let a = 0; a < Math.PI * 2; a += 0.45) D.disc(g, 10 + Math.cos(a) * 6, 10 + Math.sin(a) * 6, 3, '#B8601E');
      D.disc(g, 10, 10, 6, '#C8782A'); D.ell(g, 10, 11, 5, 5, '#F2C060'); D.ell(g, 10, 13, 2, 2, '#FFF1C8'); D.r(g, 9, 12, 2, 1, C.ink); eye(7, 9); eye(12, 9); break;
    case 'frog':
      D.disc(g, 6, 7, 3, '#7AB050'); D.disc(g, 14, 7, 3, '#7AB050'); D.disc(g, 6, 7, 2, '#FFFFFF'); D.disc(g, 14, 7, 2, '#FFFFFF'); D.r(g, 6, 7, 1, 2, C.ink); D.r(g, 14, 7, 1, 2, C.ink);
      D.ell(g, 10, 13, 8, 5, '#7AB050'); D.ell(g, 10, 15, 6, 2, '#C8E08A'); D.line(g, 5, 13, 9, 15, C.ink); D.line(g, 15, 13, 11, 15, C.ink); D.r(g, 9, 15, 2, 1, C.ink); D.p(g, 4, 14, '#F2A0A0'); D.p(g, 16, 14, '#F2A0A0'); break;
    case 'dragon':
      D.poly(g, [[5, 6], [3, 0], [8, 4]], '#F2C060'); D.poly(g, [[15, 6], [17, 0], [12, 4]], '#F2C060');
      D.ell(g, 10, 10, 7, 6, '#4E9A78'); D.ell(g, 10, 15, 5, 3, '#4E9A78'); D.ell(g, 10, 16, 3, 2, '#9AD0A0');
      D.p(g, 8, 15, C.ink); D.p(g, 12, 15, C.ink); D.r(g, 6, 9, 2, 2, '#F2D040'); D.r(g, 12, 9, 2, 2, '#F2D040'); D.p(g, 7, 9, C.ink); D.p(g, 12, 9, C.ink);
      for (const x of [7, 10, 13]) D.p(g, x, 3, '#C84A3A'); break;
    case 'fish':
      D.poly(g, [[13, 10], [19, 5], [19, 15]], '#F08A4A'); D.ell(g, 9, 10, 7, 5, '#F08A4A'); D.r(g, 6, 6, 2, 9, '#FFFFFF'); D.r(g, 11, 6, 2, 9, '#FFFFFF');
      D.disc(g, 4, 9, 1, '#FFFFFF'); D.p(g, 4, 9, C.ink); D.poly(g, [[8, 5], [11, 2], [12, 6]], '#E06A2A'); break;
    case 'elephant':
      D.ell(g, 4, 10, 4, 6, '#8A9AAE'); D.ell(g, 16, 10, 4, 6, '#8A9AAE'); D.ell(g, 4, 10, 2, 4, '#E8B0C0'); D.ell(g, 16, 10, 2, 4, '#E8B0C0');
      D.ell(g, 10, 9, 5, 6, '#9AAABE'); D.r(g, 9, 12, 3, 6, '#9AAABE'); D.r(g, 10, 18, 3, 1, '#9AAABE'); eye(7, 8); eye(12, 8); D.p(g, 6, 13, '#FFFFFF'); D.p(g, 14, 13, '#FFFFFF'); break;
    case 'monkey':
      D.disc(g, 3, 10, 3, '#8A5A3A'); D.disc(g, 17, 10, 3, '#8A5A3A'); D.disc(g, 3, 10, 1, '#E8C8A0'); D.disc(g, 17, 10, 1, '#E8C8A0');
      D.ell(g, 10, 10, 7, 7, '#8A5A3A'); D.disc(g, 8, 9, 3, '#E8C8A0'); D.disc(g, 12, 9, 3, '#E8C8A0'); D.ell(g, 10, 14, 5, 3, '#E8C8A0');
      eye(8, 8); eye(11, 8); D.p(g, 9, 13, C.ink); D.p(g, 11, 13, C.ink); D.r(g, 8, 15, 5, 1, '#9C3B4A'); break;
    case 'penguin':
      D.ell(g, 10, 10, 7, 8, '#2E2A38'); D.ell(g, 10, 12, 5, 6, '#FFFFFF'); D.ell(g, 7, 7, 2, 2, '#FFFFFF'); D.ell(g, 13, 7, 2, 2, '#FFFFFF');
      eye(7, 8); eye(12, 8); D.poly(g, [[8, 11], [12, 11], [10, 14]], '#F2A030'); D.p(g, 6, 13, '#F2B6C6'); D.p(g, 14, 13, '#F2B6C6'); break;
    case 'other':
      D.disc(g, 10, 10, 8, '#9A6AB0'); D.disc(g, 10, 10, 7, '#B07AC8');
      for (const [x, y, w] of [[8, 5, 4], [12, 6, 1], [12, 7, 1], [10, 8, 2], [10, 9, 1], [10, 10, 1], [10, 13, 1]]) D.r(g, x, y, w, 1, C.cream);
      D.r(g, 8, 5, 4, 1, C.cream); D.p(g, 7, 6, C.cream); D.r(g, 10, 13, 1, 2, C.cream); break;
  }
  return outlined(c, C.ink);
}
const ANIMALS = [
  ['cat', 'Cat'], ['dog', 'Dog'], ['bear', 'Bear'], ['bunny', 'Bunny'], ['fox', 'Fox'], ['bird', 'Bird'], ['pig', 'Pig'], ['mouse', 'Mouse'],
  ['lion', 'Lion'], ['frog', 'Frog'], ['dragon', 'Dragon'], ['fish', 'Fish'], ['elephant', 'Elephant'], ['monkey', 'Monkey'], ['penguin', 'Penguin'], ['other', 'Something else'],
];
function sparkeeFace(expr) {
  const [c, g] = mk(26, 26);
  const s = new Sparkee({ x: 13, y: 24, r: 8, seed: 3, glow: 1, expr });
  s.t = 0; s.blinkT = 99;
  if (expr === 'sad') s.tear = 0.8;
  s.drawFace = s.drawFace.bind(s);
  s.draw(g);
  return c;
}
function makeIcons() {
  icon('scroll', 16, 16, (g) => {
    D.r(g, 3, 3, 10, 11, '#8A6A40'); D.r(g, 4, 3, 8, 11, C.parch); D.r(g, 2, 2, 12, 3, '#C8A878'); D.r(g, 2, 13, 12, 3, '#C8A878');
    D.r(g, 2, 2, 12, 1, '#E8D0A0'); D.r(g, 2, 15, 12, 1, '#8A6A40');
    for (const y of [6, 8, 10]) D.r(g, 5, y, 6, 1, '#8A7A6A'); D.r(g, 5, 10, 3, 1, '#8A7A6A'); D.disc(g, 11, 11, 1, '#C8323C');
  });
  icon('speaker', 16, 16, (g) => {
    D.r(g, 2, 6, 3, 4, C.cream); D.poly(g, [[5, 6], [9, 2], [9, 14], [5, 10]], C.cream);
    D.p(g, 11, 6, C.cream); D.p(g, 11, 9, C.cream); D.r(g, 12, 7, 1, 2, C.cream); D.p(g, 13, 4, C.cream); D.p(g, 13, 11, C.cream); D.r(g, 14, 5, 1, 6, C.cream);
  });
  icon('note', 16, 16, (g) => {
    D.r(g, 6, 2, 1, 10, C.cream); D.r(g, 12, 1, 1, 10, C.cream); D.r(g, 6, 2, 7, 2, C.cream); D.ell(g, 4, 12, 2, 2, C.cream); D.ell(g, 10, 11, 2, 2, C.cream);
  });
  icon('magnifier', 18, 18, (g) => { D.disc(g, 7, 7, 6, C.ink); D.disc(g, 7, 7, 4, '#BFE0EE'); D.p(g, 5, 5, '#FFFFFF'); D.p(g, 6, 4, '#FFFFFF'); D.line(g, 11, 11, 16, 16, C.ink); D.line(g, 12, 11, 16, 15, '#7A4E33'); D.line(g, 11, 12, 15, 16, '#7A4E33'); });
  icon('openbook', 20, 16, (g) => {
    D.poly(g, [[1, 3], [9, 2], [10, 4], [11, 2], [19, 3], [19, 14], [11, 13], [10, 15], [9, 13], [1, 14]], C.ink);
    D.poly(g, [[2, 4], [9, 3], [9, 13], [2, 13]], C.white); D.poly(g, [[11, 3], [18, 4], [18, 13], [11, 13]], C.white);
    for (const y of [6, 8, 10]) { D.r(g, 3, y, 5, 1, '#B0A090'); D.r(g, 12, y, 5, 1, '#B0A090'); }
  });
  icon('talk', 18, 16, (g) => { D.ell(g, 9, 7, 8, 6, C.ink); D.ell(g, 9, 7, 7, 5, '#FFD84A'); D.poly(g, [[4, 11], [3, 15], [8, 12]], C.ink); D.p(g, 6, 7, C.ink); D.p(g, 9, 7, C.ink); D.p(g, 12, 7, C.ink); });
  icon('seal', 22, 22, (g) => {
    for (let a = 0; a < Math.PI * 2; a += 0.5) D.disc(g, 11 + Math.cos(a) * 8, 11 + Math.sin(a) * 8, 2, '#A82A36');
    D.disc(g, 11, 11, 8, '#C8323C'); D.disc(g, 11, 11, 6, '#A82A36'); D.disc(g, 11, 11, 5, '#C8323C');
    D.twinkle(g, 11, 11, 2, '#FFD0B0'); D.p(g, 8, 7, '#E8606A');
  });
}
