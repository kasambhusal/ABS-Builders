// Generates the illustrative placeholder artwork in /public/images.
// These are stand-ins: replace them with real project photos (same paths, or
// change the paths in src/data/site.json).   usage: node scripts/generate-placeholders.mjs
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const W = 1200;
const H = 800;
const OUT = "public/images";

// ---------- helpers ----------------------------------------------------------
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const f = (n) => Math.round(n * 10) / 10;

const THEMES = {
  day: { sky: ["#6fa8ff", "#cfe4ff", "#f4f9ff"], far: "#a9bddb", near: "#86a0c6", ground: "#6c8f68", road: "#4b5563", glow: "#fff4cc", lit: false, wall: "#f2f4f7", dark: "#2b3442", glass: ["#9fc6ee", "#5f8fc0"], shadow: 0.18 },
  dusk: { sky: ["#0a1d4a", "#46589b", "#f2a56a"], far: "#2a3d78", near: "#1a2c62", ground: "#1d2c3b", road: "#1b2430", glow: "#ffb877", lit: true, wall: "#cfd6e4", dark: "#10182a", glass: ["#ffd9a0", "#e9a24f"], shadow: 0.3 },
  night: { sky: ["#030a1e", "#0a1f4d", "#17316e"], far: "#10224f", near: "#0b1a3d", ground: "#0e1a2a", road: "#101923", glow: "#9fb8ff", lit: true, wall: "#9aa6bd", dark: "#070d1a", glass: ["#ffe2a8", "#f0b35a"], shadow: 0.35 },
};

function defs(t, id) {
  return `<defs>
  <linearGradient id="sky${id}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${t.sky[0]}"/><stop offset="0.6" stop-color="${t.sky[1]}"/><stop offset="1" stop-color="${t.sky[2]}"/>
  </linearGradient>
  <linearGradient id="gl${id}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${t.glass[0]}"/><stop offset="1" stop-color="${t.glass[1]}"/>
  </linearGradient>
  <linearGradient id="shade${id}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="${t.shadow}"/>
  </linearGradient>
  <radialGradient id="glow${id}" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="${t.glow}" stop-opacity="0.95"/><stop offset="1" stop-color="${t.glow}" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="vig${id}" cx="0.5" cy="0.5" r="0.75">
    <stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.38"/>
  </radialGradient>
  <filter id="blur${id}"><feGaussianBlur stdDeviation="14"/></filter>
</defs>`;
}

function backdrop(t, r, id, horizon = 600) {
  let s = `<rect width="${W}" height="${H}" fill="url(#sky${id})"/>`;
  if (t.lit) {
    for (let i = 0; i < 70; i++) {
      s += `<circle cx="${f(r() * W)}" cy="${f(r() * 330)}" r="${f(0.6 + r() * 1.4)}" fill="#fff" opacity="${f(0.25 + r() * 0.6)}"/>`;
    }
  }
  const gx = 160 + r() * 880;
  s += `<circle cx="${f(gx)}" cy="${f(horizon - 190 - r() * 60)}" r="230" fill="url(#glow${id})"/>`;
  // far + near mountain ridges (an echo of the logo)
  const ridge = (base, amp, step, col, op) => {
    let d = `M0 ${H} L0 ${base}`;
    let x = 0;
    while (x < W + step) {
      x += step * (0.6 + r() * 0.9);
      d += ` L${f(x)} ${f(base - r() * amp)}`;
    }
    return `<path d="${d} L${W} ${H} Z" fill="${col}" opacity="${op}"/>`;
  };
  s += ridge(horizon - 70, 150, 90, t.far, 0.9);
  s += ridge(horizon - 25, 90, 70, t.near, 0.95);
  s += `<rect y="${horizon}" width="${W}" height="${H - horizon}" fill="${t.ground}"/>`;
  return s;
}

function tree(x, y, s, t, r) {
  const col = t.lit ? "#0f2a24" : "#3f7a52";
  const col2 = t.lit ? "#15382f" : "#4f9264";
  return `<g><rect x="${f(x - 3 * s)}" y="${f(y - 34 * s)}" width="${f(6 * s)}" height="${f(34 * s)}" fill="${t.lit ? "#1a1410" : "#5b4636"}"/>
  <circle cx="${f(x)}" cy="${f(y - 58 * s)}" r="${f(28 * s)}" fill="${col}"/>
  <circle cx="${f(x - 14 * s)}" cy="${f(y - 46 * s)}" r="${f(20 * s)}" fill="${col2}"/>
  <circle cx="${f(x + 15 * s)}" cy="${f(y - 48 * s)}" r="${f(21 * s)}" fill="${col}"/></g>`;
}

function win(x, y, w, h, t, id, lit = t.lit) {
  const fill = lit ? `url(#gl${id})` : `url(#gl${id})`;
  return `<g><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="${fill}" opacity="${lit ? 1 : 0.9}"/>
  <rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="none" stroke="${t.dark}" stroke-width="3"/>
  <line x1="${f(x + w / 2)}" y1="${f(y)}" x2="${f(x + w / 2)}" y2="${f(y + h)}" stroke="${t.dark}" stroke-width="2"/>
  <path d="M${f(x)} ${f(y + h)} L${f(x + w * 0.45)} ${f(y)} L${f(x + w * 0.6)} ${f(y)} L${f(x + w * 0.1)} ${f(y + h)} Z" fill="#fff" opacity="0.14"/></g>`;
}

const finish = (id) => `<rect width="${W}" height="${H}" fill="url(#vig${id})"/>`;
const wrap = (id, t, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${defs(t, id)}${body}${finish(id)}</svg>`;

// ---------- scenes -----------------------------------------------------------
function villa(seed, themeName = "day") {
  const t = THEMES[themeName], r = rng(seed), id = "v" + seed;
  let s = backdrop(t, r, id, 610);
  s += `<polygon points="0,800 1200,800 1200,700 700,640 0,690" fill="${t.road}"/>`;
  s += `<polygon points="440,800 640,800 560,640 520,640" fill="${t.road}" opacity="0.0"/>`;
  // lower volume
  s += `<ellipse cx="560" cy="615" rx="430" ry="18" fill="#000" opacity="0.25" filter="url(#blur${id})"/>`;
  s += `<rect x="230" y="440" width="640" height="175" fill="${t.wall}"/>`;
  s += `<rect x="215" y="426" width="670" height="16" fill="${t.dark}"/>`;
  // upper volume (dark cladding)
  s += `<rect x="350" y="280" width="470" height="148" fill="${t.dark}"/>`;
  s += `<rect x="335" y="266" width="500" height="16" fill="${t.wall}"/>`;
  s += win(380, 305, 190, 100, t, id) + win(600, 305, 190, 100, t, id);
  // balcony rail
  for (let x = 350; x <= 820; x += 18) s += `<rect x="${x}" y="408" width="3" height="20" fill="#cbd5e1" opacity="0.8"/>`;
  // ground floor details
  s += win(262, 478, 230, 115, t, id);
  s += `<rect x="520" y="478" width="160" height="137" fill="${t.dark}"/>`;
  for (let y = 486; y < 612; y += 14) s += `<rect x="524" y="${y}" width="152" height="3" fill="#000" opacity="0.28"/>`;
  s += win(712, 478, 130, 115, t, id);
  // stone feature wall
  s += `<rect x="690" y="440" width="12" height="175" fill="#8b6f58"/>`;
  s += tree(150, 640, 1.5, t, r) + tree(1010, 645, 1.7, t, r) + tree(960, 655, 1.1, t, r);
  s += `<rect x="0" y="615" width="1200" height="14" fill="url(#shade${id})" opacity="0.7"/>`;
  for (let i = 0; i < 14; i++) s += `<circle cx="${f(120 + i * 70 + r() * 20)}" cy="${f(640 + r() * 12)}" r="${f(6 + r() * 6)}" fill="${t.lit ? "#18362c" : "#4c8a5c"}"/>`;
  return wrap(id, t, s);
}

function commercial(seed, themeName = "dusk") {
  const t = THEMES[themeName], r = rng(seed), id = "c" + seed;
  let s = backdrop(t, r, id, 620);
  s += `<rect y="620" width="1200" height="180" fill="${t.road}"/>`;
  s += `<rect y="700" width="1200" height="4" fill="#fff" opacity="0.18" stroke-dasharray="40 30"/>`;
  const block = (x, y, w, h, shade) => {
    let b = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${shade}"/>`;
    const cols = Math.floor(w / 36), rows = Math.floor(h / 46);
    for (let i = 0; i < cols; i++)
      for (let j = 0; j < rows; j++) {
        const on = t.lit ? r() > 0.35 : r() > 0.1;
        b += `<rect x="${x + 10 + i * 36}" y="${y + 14 + j * 46}" width="24" height="30" fill="${on ? `url(#gl${id})` : t.far}" opacity="${on ? 1 : 0.5}"/>`;
      }
    for (let i = 0; i <= cols; i++) b += `<rect x="${x + 4 + i * 36}" y="${y}" width="3" height="${h}" fill="#000" opacity="0.18"/>`;
    return b;
  };
  s += block(110, 330, 190, 290, t.far);
  s += block(900, 280, 200, 340, t.far);
  s += block(380, 130, 440, 490, t.dark);
  // glass curtain on main tower
  s += `<rect x="380" y="130" width="440" height="490" fill="url(#gl${id})" opacity="0.18"/>`;
  s += `<rect x="380" y="560" width="440" height="60" fill="${t.wall}"/>`;
  s += `<rect x="395" y="574" width="410" height="34" fill="#B50C1A"/>`;
  s += `<rect x="470" y="584" width="260" height="6" fill="#fff" opacity="0.85"/><rect x="520" y="596" width="160" height="4" fill="#fff" opacity="0.6"/>`;
  s += `<rect x="380" y="120" width="440" height="12" fill="${t.wall}"/>`;
  s += `<rect x="395" y="96" width="120" height="26" fill="${t.dark}"/>`;
  // cars
  for (let i = 0; i < 4; i++) {
    const x = 120 + i * 270 + r() * 60;
    s += `<g><rect x="${f(x)}" y="660" width="86" height="22" rx="8" fill="${["#B50C1A", "#e2e8f0", "#1e293b", "#94a3b8"][i]}"/><rect x="${f(x + 18)}" y="648" width="46" height="16" rx="6" fill="#0f172a" opacity="0.7"/><circle cx="${f(x + 20)}" cy="684" r="8" fill="#0b0f19"/><circle cx="${f(x + 66)}" cy="684" r="8" fill="#0b0f19"/></g>`;
  }
  s += tree(80, 640, 1.2, t, r) + tree(1130, 640, 1.3, t, r);
  return wrap(id, t, s);
}

function bridge(seed, themeName = "dusk") {
  const t = THEMES[themeName], r = rng(seed), id = "b" + seed;
  let s = backdrop(t, r, id, 520);
  // river
  s += `<rect y="520" width="1200" height="280" fill="${t.lit ? "#0b1c3a" : "#4f86b8"}"/>`;
  for (let i = 0; i < 26; i++) s += `<rect x="${f(r() * 1100)}" y="${f(540 + r() * 240)}" width="${f(60 + r() * 140)}" height="2" fill="#fff" opacity="${f(0.1 + r() * 0.2)}"/>`;
  // deck
  s += `<rect x="0" y="400" width="1200" height="22" fill="${t.wall}"/><rect x="0" y="422" width="1200" height="12" fill="${t.dark}"/>`;
  for (let x = 40; x < 1200; x += 56) s += `<rect x="${x}" y="384" width="3" height="16" fill="${t.dark}" opacity="0.9"/>`;
  // piers
  for (const x of [150, 450, 750, 1050]) s += `<rect x="${x - 18}" y="434" width="36" height="${f(150)}" fill="${t.wall}" opacity="0.9"/><rect x="${x - 30}" y="580" width="60" height="14" fill="${t.dark}"/>`;
  // cable-stayed tower
  s += `<polygon points="582,120 618,120 630,400 570,400" fill="${t.wall}"/><rect x="560" y="400" width="80" height="12" fill="${t.dark}"/>`;
  for (let i = 0; i < 9; i++) {
    const yy = 150 + i * 26;
    s += `<line x1="600" y1="${yy}" x2="${f(600 - 60 - i * 62)}" y2="400" stroke="${t.wall}" stroke-width="2.4" opacity="0.9"/>`;
    s += `<line x1="600" y1="${yy}" x2="${f(600 + 60 + i * 62)}" y2="400" stroke="${t.wall}" stroke-width="2.4" opacity="0.9"/>`;
  }
  // lamp posts
  for (let x = 90; x < 1200; x += 150) s += `<rect x="${x}" y="350" width="3" height="50" fill="${t.dark}"/><circle cx="${x + 1}" cy="348" r="${t.lit ? 14 : 4}" fill="${t.glow}" opacity="${t.lit ? 0.7 : 0.9}"/>`;
  // reflection hint
  s += `<rect y="520" width="1200" height="280" fill="url(#shade${id})"/>`;
  return wrap(id, t, s);
}

function living(seed, themeName = "day") {
  const r = rng(seed), id = "l" + seed;
  const warm = themeName !== "day";
  const t = { ...THEMES[themeName === "day" ? "day" : "dusk"] };
  const wall = warm ? "#d9d2c6" : "#ece8e0";
  let s = `<rect width="${W}" height="${H}" fill="${wall}"/>`;
  // window w/ sky
  s += `<rect x="740" y="90" width="360" height="360" fill="url(#sky${id})"/>`;
  s += `<path d="M740 450 L930 330 L1100 450 Z" fill="${t.near}"/>`;
  s += `<rect x="740" y="90" width="360" height="360" fill="none" stroke="#2b3442" stroke-width="10"/><line x1="920" y1="90" x2="920" y2="450" stroke="#2b3442" stroke-width="6"/><line x1="740" y1="270" x2="1100" y2="270" stroke="#2b3442" stroke-width="6"/>`;
  // floor
  s += `<rect y="560" width="1200" height="240" fill="#a47a58"/>`;
  for (let x = -40; x < 1240; x += 120) s += `<line x1="${x}" y1="560" x2="${x - 60}" y2="800" stroke="#7d5a40" stroke-width="2" opacity="0.55"/>`;
  s += `<rect y="548" width="1200" height="14" fill="#f8f6f1"/>`;
  // rug
  s += `<ellipse cx="560" cy="680" rx="380" ry="70" fill="#1c3a6e" opacity="0.9"/><ellipse cx="560" cy="680" rx="330" ry="52" fill="none" stroke="#c9d3ea" stroke-width="3" opacity="0.7"/>`;
  // sofa
  s += `<rect x="190" y="470" width="560" height="110" rx="28" fill="#2a3c63"/><rect x="170" y="500" width="70" height="110" rx="26" fill="#22335a"/><rect x="700" y="500" width="70" height="110" rx="26" fill="#22335a"/>`;
  s += `<rect x="215" y="440" width="510" height="80" rx="24" fill="#34497a"/>`;
  for (const [x, c] of [[250, "#B50C1A"], [640, "#e8eefc"]]) s += `<rect x="${x}" y="470" width="70" height="64" rx="14" fill="${c}"/>`;
  s += `<rect x="215" y="610" width="14" height="30" fill="#1c1c1c"/><rect x="715" y="610" width="14" height="30" fill="#1c1c1c"/>`;
  // coffee table
  s += `<ellipse cx="480" cy="660" rx="120" ry="26" fill="#f3efe7"/><rect x="470" y="660" width="20" height="40" fill="#3a3a3a"/><rect x="390" y="640" width="26" height="18" rx="4" fill="#B50C1A"/>`;
  // pendants
  for (const x of [330, 520, 710]) s += `<line x1="${x}" y1="0" x2="${x}" y2="${150 + (x % 3) * 12}" stroke="#222" stroke-width="2"/><path d="M${x - 34} ${180 + (x % 3) * 12} Q${x} ${120 + (x % 3) * 12} ${x + 34} ${180 + (x % 3) * 12} Z" fill="#1e293b"/><circle cx="${x}" cy="${186 + (x % 3) * 12}" r="22" fill="url(#glow${id})"/>`;
  // art + shelf
  s += `<rect x="190" y="130" width="200" height="140" fill="#fafafa" stroke="#1e293b" stroke-width="8"/><path d="M190 270 L270 190 L330 240 L390 170 L390 270 Z" fill="#082252"/><circle cx="330" cy="180" r="18" fill="#B50C1A"/>`;
  s += `<rect x="440" y="250" width="240" height="12" fill="#1e293b"/><rect x="460" y="212" width="26" height="38" fill="#B50C1A"/><rect x="496" y="200" width="22" height="50" fill="#e8eefc"/>`;
  // plant + lamp
  s += `<rect x="1010" y="540" width="70" height="90" rx="10" fill="#f1f5f9"/>` + [0, 1, 2, 3, 4].map((i) => `<path d="M1045 540 Q${1000 + i * 24} ${430 - i * 8} ${990 + i * 30} ${380 + (i % 2) * 20}" stroke="#2f7a52" stroke-width="10" fill="none" stroke-linecap="round"/>`).join("");
  s += `<rect x="858" y="360" width="5" height="250" fill="#222"/><path d="M826 372 L895 372 L880 330 L842 330 Z" fill="#f6e7c8"/><circle cx="860" cy="372" r="46" fill="url(#glow${id})" opacity="0.7"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${defs(t, id)}${s}${warm ? `<rect width="${W}" height="${H}" fill="#ff9a3c" opacity="0.07"/>` : ""}${finish(id)}</svg>`;
}

function institution(seed, themeName = "day") {
  const t = THEMES[themeName], r = rng(seed), id = "i" + seed;
  let s = backdrop(t, r, id, 600);
  s += `<polygon points="0,800 1200,800 1200,690 0,660" fill="#6b7280" opacity="0.9"/>`;
  const wing = (x, w, h, col) => {
    let b = `<rect x="${x}" y="${600 - h}" width="${w}" height="${h}" fill="${col}"/><rect x="${x - 10}" y="${590 - h}" width="${w + 20}" height="14" fill="${t.dark}"/>`;
    const cols = Math.floor((w - 20) / 70), rows = Math.floor(h / 100);
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) b += win(x + 20 + i * 70, 600 - h + 28 + j * 100, 46, 58, t, id);
    return b;
  };
  s += wing(120, 360, 230, t.wall) + wing(720, 360, 230, t.wall);
  s += wing(470, 260, 300, "#e9d9c4");
  s += `<rect x="560" y="450" width="80" height="150" fill="${t.dark}"/><rect x="535" y="430" width="130" height="14" fill="#B50C1A"/>`;
  s += `<polygon points="470,300 730,300 600,240" fill="#B50C1A"/>`;
  s += `<rect x="598" y="150" width="4" height="100" fill="#cbd5e1"/><polygon points="602,152 660,166 602,184" fill="#B50C1A"/>`;
  s += tree(80, 650, 1.4, t, r) + tree(1120, 655, 1.5, t, r) + tree(380, 660, 1, t, r) + tree(840, 660, 1, t, r);
  return wrap(id, t, s);
}

function resort(seed, themeName = "dusk") {
  const t = THEMES[themeName], r = rng(seed), id = "r" + seed;
  let s = backdrop(t, r, id, 580);
  // pool
  s += `<polygon points="120,690 1080,690 1130,780 70,780" fill="#2b8bc4"/><polygon points="120,690 1080,690 1100,720 100,720" fill="#7fd0f2" opacity="0.7"/>`;
  for (let i = 0; i < 18; i++) s += `<rect x="${f(140 + r() * 900)}" y="${f(700 + r() * 70)}" width="${f(40 + r() * 80)}" height="2" fill="#fff" opacity="0.3"/>`;
  // low blocks
  const blk = (x, y, w, h, c) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/><rect x="${x - 14}" y="${y - 14}" width="${w + 28}" height="14" fill="${t.dark}"/>`;
  s += blk(100, 470, 360, 130, "#d8c8b0") + blk(640, 430, 460, 170, "#e8dac6") + blk(380, 520, 360, 80, "#b69875");
  s += win(130, 495, 140, 80, t, id) + win(300, 495, 130, 80, t, id) + win(670, 460, 150, 110, t, id) + win(850, 460, 150, 110, t, id) + win(1020, 460, 60, 110, t, id) + win(410, 540, 130, 46, t, id) + win(570, 540, 130, 46, t, id);
  // palms
  for (const [x, h] of [[70, 280], [1130, 330], [600, 250]]) {
    s += `<path d="M${x} 640 Q${x + 18} ${640 - h / 2} ${x + 6} ${640 - h}" stroke="#5a4636" stroke-width="9" fill="none"/>`;
    for (let i = 0; i < 7; i++) {
      const a = -Math.PI / 2 + (i - 3) * 0.55;
      s += `<path d="M${x + 6} ${640 - h} Q${f(x + 6 + Math.cos(a) * 60)} ${f(640 - h + Math.sin(a) * 40 - 20)} ${f(x + 6 + Math.cos(a) * 110)} ${f(640 - h + Math.sin(a) * 70 + 25)}" stroke="${t.lit ? "#164a34" : "#2e8b57"}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
    }
  }
  // loungers + lights
  for (let i = 0; i < 6; i++) s += `<rect x="${150 + i * 150}" y="672" width="60" height="10" rx="4" fill="#f1f5f9"/><rect x="${150 + i * 150}" y="662" width="18" height="12" rx="4" fill="#f1f5f9"/>`;
  return wrap(id, t, s);
}

// before-states ---------------------------------------------------------------
function frame(seed) {
  // raw RCC frame under construction, grey/dusty
  const t = THEMES.day, r = rng(seed), id = "f" + seed;
  const dull = { ...t, sky: ["#b9c2cc", "#d8dde3", "#e8ebee"], far: "#aab1ba", near: "#99a1ab", ground: "#9a8f80", glow: "#ffffff" };
  let s = backdrop(dull, r, id, 610);
  s += `<polygon points="0,800 1200,800 1200,700 0,680" fill="#8a7f70"/>`;
  const cols = [250, 430, 610, 790], floors = [600, 470, 340];
  s += `<rect x="215" y="600" width="640" height="14" fill="#7c828a"/>`;
  for (const y of floors) s += `<rect x="215" y="${y - 14}" width="640" height="14" fill="#9aa0a8"/>`;
  for (const x of cols) s += `<rect x="${x - 10}" y="326" width="20" height="288" fill="#8c929a"/>`;
  // partial brick infill
  s += `<rect x="260" y="480" width="160" height="120" fill="#b76b4e" opacity="0.9"/>`;
  for (let y = 486; y < 600; y += 12) s += `<line x1="260" y1="${y}" x2="420" y2="${y}" stroke="#8c4f39" stroke-width="2"/>`;
  // scaffolding
  for (let x = 190; x <= 880; x += 70) s += `<line x1="${x}" y1="330" x2="${x}" y2="610" stroke="#c4a35a" stroke-width="4"/>`;
  for (let y = 350; y <= 600; y += 62) s += `<line x1="190" y1="${y}" x2="880" y2="${y}" stroke="#c4a35a" stroke-width="3"/>`;
  for (let x = 190; x < 880; x += 140) s += `<line x1="${x}" y1="350" x2="${x + 140}" y2="600" stroke="#c4a35a" stroke-width="2" opacity="0.8"/>`;
  // rebar stubs
  for (const x of cols) for (let i = -2; i <= 2; i++) s += `<line x1="${x + i * 4}" y1="326" x2="${x + i * 4}" y2="${300 - Math.abs(i) * 4}" stroke="#6b4a3a" stroke-width="2"/>`;
  // crane
  s += `<rect x="980" y="140" width="14" height="470" fill="#e0a526"/><rect x="760" y="140" width="400" height="12" fill="#e0a526"/><line x1="780" y1="152" x2="900" y2="152" stroke="#444" stroke-width="2"/><line x1="820" y1="152" x2="820" y2="260" stroke="#222" stroke-width="2"/><rect x="800" y="260" width="40" height="22" fill="#8c929a"/>`;
  // piles
  for (let i = 0; i < 6; i++) s += `<rect x="${60 + i * 28}" y="${640 - (i % 3) * 8}" width="26" height="20" fill="#b9a48a"/>`;
  s += `<ellipse cx="140" cy="660" rx="120" ry="22" fill="#a89a85"/>`;
  s += `<rect width="${W}" height="${H}" fill="#8a7f70" opacity="0.12"/>`;
  return wrap(id, dull, s);
}

function bareRoom(seed) {
  const id = "br" + seed, t = THEMES.day;
  let s = `<rect width="${W}" height="${H}" fill="#b8b2a7"/>`;
  s += `<rect x="740" y="110" width="330" height="330" fill="#d9e6f2"/><rect x="740" y="110" width="330" height="330" fill="none" stroke="#6b5b49" stroke-width="12"/>`;
  s += `<rect y="560" width="1200" height="240" fill="#8d887f"/>`;
  for (let i = 0; i < 40; i++) s += `<circle cx="${(i * 97) % 1200}" cy="${580 + ((i * 53) % 200)}" r="${2 + (i % 4)}" fill="#6f6a62" opacity="0.5"/>`;
  // patchy plaster
  s += `<path d="M120 120 L420 100 L460 260 L180 300 Z" fill="#a39c90" opacity="0.8"/><path d="M500 300 L700 280 L720 420 L520 440 Z" fill="#c9c3b6" opacity="0.7"/>`;
  s += `<rect y="548" width="1200" height="14" fill="#7a7468"/>`;
  s += `<line x1="400" y1="0" x2="400" y2="190" stroke="#222" stroke-width="3"/><circle cx="400" cy="200" r="14" fill="#f1e2b4"/><circle cx="400" cy="200" r="60" fill="url(#glow${id})" opacity="0.5"/>`;
  s += `<rect x="150" y="610" width="90" height="70" fill="#9b7b52"/><rect x="170" y="590" width="90" height="70" fill="#a98a5e"/>`;
  s += `<path d="M600 640 L760 640 L740 700 L620 700 Z" fill="#6f6a62"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${defs(t, id)}${s}<rect width="${W}" height="${H}" fill="#555" opacity="0.1"/>${finish(id)}</svg>`;
}

function oldFacade(seed) {
  const t = THEMES.day, r = rng(seed), id = "of" + seed;
  const dull = { ...t, sky: ["#b5bec8", "#d5dae0", "#e6e9ed"], far: "#a9b0b9", near: "#979ea8", ground: "#8f8a80", glow: "#ffffff" };
  let s = backdrop(dull, r, id, 620);
  s += `<rect y="620" width="1200" height="180" fill="#6b6f76"/>`;
  s += `<rect x="260" y="250" width="680" height="370" fill="#c8bfae"/>`;
  s += `<path d="M260 250 L940 250 L940 270 L260 270 Z" fill="#a39a88"/>`;
  for (let i = 0; i < 40; i++) s += `<rect x="${f(270 + r() * 650)}" y="${f(280 + r() * 330)}" width="${f(8 + r() * 40)}" height="${f(3 + r() * 14)}" fill="#a79d8a" opacity="0.6"/>`;
  s += `<rect x="300" y="470" width="260" height="150" fill="#6c5b3e"/><rect x="310" y="480" width="240" height="140" fill="#8e8068"/>`;
  s += `<rect x="610" y="470" width="300" height="150" fill="#6c5b3e"/>`;
  for (let x = 620; x < 900; x += 18) s += `<rect x="${x}" y="480" width="10" height="140" fill="#807257"/>`;
  s += `<rect x="330" y="300" width="130" height="110" fill="#8fa3b5"/><rect x="330" y="300" width="130" height="110" fill="none" stroke="#5c5646" stroke-width="6"/>`;
  s += `<rect x="520" y="300" width="130" height="110" fill="#8fa3b5"/><rect x="520" y="300" width="130" height="110" fill="none" stroke="#5c5646" stroke-width="6"/>`;
  s += `<rect x="710" y="300" width="130" height="110" fill="#8fa3b5"/><rect x="710" y="300" width="130" height="110" fill="none" stroke="#5c5646" stroke-width="6"/>`;
  s += `<rect x="360" y="430" width="440" height="26" fill="#9b8f78"/><text x="380" y="451" font-family="sans-serif" font-size="18" fill="#5c5646">STORE</text>`;
  s += `<line x1="150" y1="320" x2="260" y2="340" stroke="#222" stroke-width="2"/><line x1="150" y1="320" x2="140" y2="620" stroke="#44403c" stroke-width="6"/>`;
  return wrap(id, dull, s);
}

function modernFacade(seed) {
  const t = THEMES.day, r = rng(seed), id = "mf" + seed;
  let s = backdrop(t, r, id, 620);
  s += `<rect y="620" width="1200" height="180" fill="${t.road}"/>`;
  s += `<rect x="250" y="210" width="700" height="410" fill="#f4f6f9"/>`;
  s += `<rect x="250" y="210" width="700" height="62" fill="#082252"/><rect x="280" y="230" width="250" height="22" fill="#fff" opacity="0.9"/><rect x="760" y="226" width="150" height="8" fill="#B50C1A"/>`;
  s += `<rect x="640" y="272" width="310" height="348" fill="#3d4655"/>`;
  for (let x = 650; x < 950; x += 34) s += `<rect x="${x}" y="272" width="4" height="348" fill="#2a3240"/>`;
  s += `<rect x="290" y="310" width="300" height="220" fill="url(#gl${id})"/><rect x="290" y="310" width="300" height="220" fill="none" stroke="#1e293b" stroke-width="6"/><line x1="440" y1="310" x2="440" y2="530" stroke="#1e293b" stroke-width="3"/>`;
  s += `<path d="M290 530 L440 310 L470 310 L320 530 Z" fill="#fff" opacity="0.2"/>`;
  s += `<rect x="290" y="545" width="300" height="75" fill="#082252"/><rect x="310" y="565" width="260" height="8" fill="#fff" opacity="0.8"/><rect x="310" y="582" width="180" height="6" fill="#fff" opacity="0.55"/>`;
  s += `<rect x="640" y="260" width="310" height="14" fill="${t.dark}"/>`;
  s += `<rect x="250" y="200" width="700" height="12" fill="#1e293b"/>`;
  s += tree(180, 640, 1.2, t, r) + tree(1030, 640, 1.2, t, r);
  return wrap(id, t, s);
}

function blueprint(seed = 7) {
  const id = "bp" + seed, t = THEMES.night;
  let s = `<rect width="${W}" height="${H}" fill="#0a2a66"/>`;
  for (let x = 0; x < W; x += 40) s += `<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="#ffffff" stroke-opacity="${x % 200 === 0 ? 0.18 : 0.07}"/>`;
  for (let y = 0; y < H; y += 40) s += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="#ffffff" stroke-opacity="${y % 200 === 0 ? 0.18 : 0.07}"/>`;
  const st = `stroke="#dbe7ff" stroke-width="3" fill="none"`;
  // floor plan
  s += `<g ${st}><rect x="180" y="150" width="560" height="440"/><line x1="180" y1="340" x2="460" y2="340"/><line x1="460" y1="150" x2="460" y2="480"/><line x1="460" y1="480" x2="740" y2="480"/><line x1="320" y1="340" x2="320" y2="590"/>
  <path d="M460 200 A50 50 0 0 1 510 150" stroke-dasharray="6 6"/><path d="M320 590 A60 60 0 0 1 380 530" stroke-dasharray="6 6"/><rect x="560" y="150" width="120" height="8" stroke-width="5"/><rect x="180" y="440" width="8" height="90" stroke-width="5"/></g>`;
  // dimension lines
  s += `<g stroke="#ffb3b3" stroke-width="2" fill="none"><line x1="180" y1="640" x2="740" y2="640"/><line x1="180" y1="628" x2="180" y2="652"/><line x1="740" y1="628" x2="740" y2="652"/><line x1="790" y1="150" x2="790" y2="590"/><line x1="778" y1="150" x2="802" y2="150"/><line x1="778" y1="590" x2="802" y2="590"/></g>`;
  // elevation
  s += `<g ${st}><rect x="840" y="380" width="260" height="210"/><rect x="820" y="360" width="300" height="20"/><rect x="870" y="420" width="70" height="60"/><rect x="990" y="420" width="70" height="60"/><rect x="920" y="500" width="50" height="90"/></g>`;
  s += `<g ${st} opacity="0.7"><circle cx="980" cy="230" r="70"/><circle cx="980" cy="230" r="45"/><line x1="900" y1="230" x2="1060" y2="230"/><line x1="980" y1="150" x2="980" y2="310"/></g>`;
  // set-square + pencil
  s += `<polygon points="900,720 1080,720 900,560" fill="#ffffff" opacity="0.12" stroke="#fff" stroke-opacity="0.5" stroke-width="2"/>`;
  s += `<rect x="150" y="680" width="420" height="14" rx="7" fill="#e0a526" transform="rotate(-6 150 680)"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${defs(t, id)}${s}${finish(id)}</svg>`;
}

function portrait(seed) {
  const r = rng(seed), id = "p" + seed;
  const t = THEMES.dusk;
  const skin = ["#c58c68", "#b27a58", "#d9a07c"][seed % 3];
  const shirt = ["#1c3a6e", "#394150", "#B50C1A"][seed % 3];
  let s = `<rect width="${W}" height="${H}" fill="url(#sky${id})"/>`;
  s += `<circle cx="${400 + r() * 400}" cy="260" r="320" fill="url(#glow${id})" opacity="0.6"/>`;
  // site in background
  s += `<rect y="560" width="1200" height="240" fill="#1b2a3c"/>`;
  for (let i = 0; i < 6; i++) s += `<rect x="${60 + i * 200}" y="${380 - (i % 3) * 50}" width="90" height="${180 + (i % 3) * 50}" fill="#10203f" opacity="0.8"/>`;
  s += `<path d="M330 800 Q340 560 600 540 Q860 560 870 800 Z" fill="${shirt}"/>`;
  s += `<rect x="560" y="470" width="80" height="80" fill="${skin}"/>`;
  s += `<ellipse cx="600" cy="400" rx="92" ry="110" fill="${skin}"/>`;
  s += `<path d="M508 380 Q520 270 600 268 Q690 270 694 380 Q650 330 600 330 Q545 330 508 380 Z" fill="#161616"/>`;
  s += `<path d="M498 330 Q600 230 702 330 L702 342 L498 342 Z" fill="#f4c20d"/><rect x="486" y="338" width="228" height="14" rx="7" fill="#e0a526"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${defs(t, id)}${s}${finish(id)}</svg>`;
}

// ---------- render -------------------------------------------------------------
const jobs = [];
const add = (dir, name, svg, w = 1200, q = 78) => {
  mkdirSync(`${OUT}/${dir}`, { recursive: true });
  jobs.push(
    sharp(Buffer.from(svg), { density: 96 })
      .resize(w)
      .webp({ quality: q })
      .toFile(`${OUT}/${dir}/${name}.webp`),
  );
};

// projects: [slug, scene, theme] x 3 variants
const projects = [
  ["lumbini-heights-villa", villa, ["day", "dusk", "night"]],
  ["butwal-trade-tower", commercial, ["dusk", "day", "night"]],
  ["tinau-river-bridge", bridge, ["dusk", "day", "night"]],
  ["kapilvastu-heritage-school", institution, ["day", "dusk", "day"]],
  ["sunrise-residence-interior", living, ["day", "dusk", "night"]],
  ["dang-valley-resort", resort, ["dusk", "day", "night"]],
  ["sunwal-community-hospital", institution, ["dusk", "day", "night"]],
  ["parasi-modern-home", villa, ["dusk", "day", "night"]],
];
projects.forEach(([slug, scene, themes], i) => {
  themes.forEach((th, k) => add("projects", `${slug}-${k + 1}`, scene(100 + i * 17 + k * 5, th)));
});

// before / after
add("transform", "villa-before", frame(11));
add("transform", "villa-after", villa(11, "day"));
add("transform", "interior-before", bareRoom(12));
add("transform", "interior-after", living(12, "dusk"));
add("transform", "facade-before", oldFacade(13));
add("transform", "facade-after", modernFacade(13));

// misc
add("misc", "blueprint", blueprint(), 1200);
add("misc", "site-team", frame(31), 1200);
[1, 2, 3].forEach((n) => add("testimonials", `video-${n}`, portrait(n + 40), 1000));

await Promise.all(jobs);
console.log(`generated ${jobs.length} images`);
