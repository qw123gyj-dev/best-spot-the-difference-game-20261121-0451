// scenes.js — original vector art for the three spot-the-difference scenes.
// Every scene is drawn in code with Canvas 2D (no image files, no network).
// drawScene(ctx, sceneIndex, side) draws one panel; 'left' and 'right' differ
// only in the scene's listed differences. Each difference has a spot (x, y, r)
// the player can click, and a draw rule: left-only, right-only, or changed.

export const PANEL_W = 560;
export const PANEL_H = 420;

function circle(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

function poly(ctx, pts, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
  ctx.fill();
}

function line(ctx, x1, y1, x2, y2, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function text(ctx, str, x, y, size, color, weight) {
  ctx.fillStyle = color;
  ctx.font = `${weight || 'bold'} ${size}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(str, x, y);
}

// ---------------------------------------------------------------- garden
const GARDEN_FLOWERS = [
  { x: 210, color: '#e84c4c' },
  { x: 250, color: '#f08c2e' },
  { x: 290, color: '#e84c4c' }, // middle flower: red left, blue right
  { x: 330, color: '#ef7fb0' },
  { x: 370, color: '#f2d13d' },
];

function drawGarden(ctx, side) {
  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#7ec3ee');
  sky.addColorStop(1, '#d9f1ff');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, PANEL_W, 300);
  rect(ctx, 0, 300, PANEL_W, 120, '#79c94f');
  ellipse(ctx, 280, 470, 430, 150, '#6db844');

  // sun (with sunglasses on the right panel)
  circle(ctx, 90, 70, 38, '#ffd94d');
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    line(ctx, 90 + Math.cos(a) * 46, 70 + Math.sin(a) * 46, 90 + Math.cos(a) * 58, 70 + Math.sin(a) * 58, '#f5b90d', 4);
  }
  if (side === 'right') {
    rect(ctx, 70, 64, 22, 14, '#22242a');
    rect(ctx, 102, 64, 22, 14, '#22242a');
    line(ctx, 92, 71, 102, 71, '#22242a', 4);
    circle(ctx, 76, 68, 3, '#ffffff');
    circle(ctx, 108, 68, 3, '#ffffff');
  }

  // clouds
  ellipse(ctx, 210, 60, 28, 16, '#ffffff');
  ellipse(ctx, 235, 52, 30, 18, '#ffffff');
  ellipse(ctx, 258, 62, 26, 14, '#ffffff');
  ellipse(ctx, 420, 95, 24, 13, '#ffffff');
  ellipse(ctx, 442, 88, 26, 15, '#ffffff');

  // bird (right panel only)
  if (side === 'right') {
    line(ctx, 458, 60, 468, 52, '#333333', 3);
    line(ctx, 468, 52, 478, 60, '#333333', 3);
    line(ctx, 478, 60, 488, 52, '#333333', 3);
    line(ctx, 488, 52, 498, 60, '#333333', 3);
  }

  // tree
  rect(ctx, 58, 180, 26, 125, '#8a5a2b');
  circle(ctx, 70, 150, 52, '#3f9e4d');
  circle(ctx, 30, 185, 34, '#4cb35c');
  circle(ctx, 112, 185, 34, '#3f9e4d');
  circle(ctx, 70, 118, 30, '#57b868');

  // fence
  for (let x = 200; x <= 380; x += 22) {
    rect(ctx, x, 295, 12, 42, '#f5f0e6');
    poly(ctx, [[x, 295], [x + 6, 285], [x + 12, 295]], '#f5f0e6');
  }
  rect(ctx, 195, 310, 197, 8, '#e8e0d0');

  // flower bed
  for (const f of GARDEN_FLOWERS) {
    line(ctx, f.x, 392, f.x, 360, '#3f8f3a', 4);
    const petal = side === 'right' && f.x === 290 ? '#4c8de8' : f.color;
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
      circle(ctx, f.x + Math.cos(a) * 9, 352 + Math.sin(a) * 9, 7, petal);
    }
    circle(ctx, f.x, 352, 6, '#ffcf3f');
  }

  // butterfly (left panel only)
  if (side === 'left') {
    ellipse(ctx, 288, 132, 14, 10, '#ff9f43');
    ellipse(ctx, 312, 132, 14, 10, '#ff9f43');
    ellipse(ctx, 290, 146, 10, 7, '#ff7f2e');
    ellipse(ctx, 310, 146, 10, 7, '#ff7f2e');
    line(ctx, 300, 136, 300, 152, '#5a3a1a', 3);
    line(ctx, 298, 134, 294, 126, '#5a3a1a', 2);
    line(ctx, 302, 134, 306, 126, '#5a3a1a', 2);
  }

  // watering can
  rect(ctx, 135, 320, 34, 26, '#3e9e5c');
  line(ctx, 169, 328, 192, 310, '#3e9e5c', 5);
  circle(ctx, 193, 308, 4, '#2e7e4a');
  line(ctx, 135, 326, 122, 318, '#2e7e4a', 4);

  // path stones
  ellipse(ctx, 250, 402, 26, 10, '#cbbfa8');
  ellipse(ctx, 302, 406, 22, 9, '#cbbfa8');
  ellipse(ctx, 352, 402, 26, 10, '#cbbfa8');

  // Mochi the cat, sitting
  ellipse(ctx, 410, 332, 42, 30, '#f2a541');
  circle(ctx, 410, 288, 26, '#f2a541');
  poly(ctx, [[390, 272], [396, 246], [406, 268]], '#f2a541');
  poly(ctx, [[414, 268], [424, 246], [430, 272]], '#f2a541');
  poly(ctx, [[393, 268], [396, 254], [402, 266]], '#f2a0a8');
  poly(ctx, [[418, 266], [424, 254], [427, 268]], '#f2a0a8');
  circle(ctx, 401, 286, 3, '#22242a');
  circle(ctx, 419, 286, 3, '#22242a');
  poly(ctx, [[406, 294], [414, 294], [410, 299]], '#e87f8a');
  line(ctx, 410, 299, 410, 304, '#c97a2b', 2);
  line(ctx, 384, 292, 398, 294, '#c97a2b', 1.5);
  line(ctx, 384, 298, 398, 297, '#c97a2b', 1.5);
  line(ctx, 422, 294, 436, 292, '#c97a2b', 1.5);
  line(ctx, 422, 297, 436, 298, '#c97a2b', 1.5);
  line(ctx, 398, 268, 404, 268, '#d98a2b', 2);
  line(ctx, 416, 268, 422, 268, '#d98a2b', 2);
  line(ctx, 396, 318, 402, 318, '#d98a2b', 2);
  line(ctx, 418, 318, 424, 318, '#d98a2b', 2);
  if (side === 'left') {
    // tail curled up
    ctx.strokeStyle = '#f2a541';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(448, 340);
    ctx.quadraticCurveTo(472, 336, 466, 302);
    ctx.stroke();
    circle(ctx, 466, 298, 6, '#f2a541');
  } else {
    // tail lying flat on the grass
    line(ctx, 448, 346, 488, 352, '#f2a541', 10);
    circle(ctx, 490, 352, 6, '#f2a541');
  }
}

// ---------------------------------------------------------------- market
const MARKET_STARS = [
  [60, 40], [150, 90], [200, 35], [260, 70], [320, 40], [380, 85], [500, 40],
  [90, 110], [180, 130], [520, 120], [40, 170], [540, 170],
];

function drawMarket(ctx, side) {
  const sky = ctx.createLinearGradient(0, 0, 0, 340);
  sky.addColorStop(0, '#141f3d');
  sky.addColorStop(1, '#2c3f6e');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, PANEL_W, 340);
  rect(ctx, 0, 340, PANEL_W, 80, '#3a2f28');

  // stars (one at 120,50 is left-only)
  for (const [x, y] of MARKET_STARS) {
    if (x === 120 && y === 50 && side === 'right') continue;
    circle(ctx, x, y, 2, '#ffffff');
  }
  circle(ctx, 90, 110, 1.5, '#ffffff');
  circle(ctx, 520, 120, 1.5, '#ffffff');

  // moon (full left, crescent right)
  circle(ctx, 450, 70, 30, '#f5eeda');
  if (side === 'right') circle(ctx, 462, 64, 26, '#2c3f6e');
  circle(ctx, 442, 62, 4, '#ddd2b0');
  circle(ctx, 458, 78, 3, '#ddd2b0');

  // string lights
  ctx.strokeStyle = '#0c1226';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 30);
  ctx.quadraticCurveTo(280, 58, 560, 30);
  ctx.stroke();
  const bulbColors = ['#ffd94d', '#ff7f7f', '#7fd0ff'];
  for (let i = 0; i < 13; i++) {
    const x = 20 + i * 42;
    const y = 30 + Math.sin((i / 12) * Math.PI) * 22;
    circle(ctx, x, y + 8, 5, bulbColors[i % 3]);
  }

  // left stall: red awning, tea sign, dumplings
  for (let i = 0; i < 5; i++) rect(ctx, 60 + i * 34, 150, 17, 26, i % 2 ? '#f5f0e6' : '#d94f4f');
  rect(ctx, 60, 176, 170, 10, '#8a3a3a');
  rect(ctx, 70, 186, 150, 90, '#7a4a21');
  rect(ctx, 70, 186, 150, 12, '#5e3618');
  rect(ctx, 105, 196, 80, 28, '#f5e6c8');
  text(ctx, side === 'left' ? '茶' : '酒', 145, 211, 19, '#7a4a21');
  // dumpling stack (one extra dumpling on the right)
  circle(ctx, 130, 258, 12, '#f5efe0');
  circle(ctx, 155, 258, 12, '#f5efe0');
  circle(ctx, 142, 240, 12, '#f5efe0');
  if (side === 'right') circle(ctx, 178, 244, 12, '#f5efe0');
  rect(ctx, 100, 270, 90, 8, '#e8d9b8');

  // right stall: teal awning, crates, cat
  for (let i = 0; i < 5; i++) rect(ctx, 330 + i * 34, 150, 17, 26, i % 2 ? '#f5f0e6' : '#2e8f8a');
  rect(ctx, 330, 176, 170, 10, '#1f6a66');
  rect(ctx, 340, 186, 150, 90, '#3a5a4a');
  rect(ctx, 340, 186, 150, 12, '#2a4536');
  // lanterns under the right awning (middle one changes color)
  for (const [lx, col] of [[352, '#e84c4c'], [400, side === 'left' ? '#e84c4c' : '#3e9e5c'], [448, '#e84c4c']]) {
    line(ctx, lx, 176, lx, 192, '#3a2a1a', 2);
    ellipse(ctx, lx, 206, 13, 16, col);
    rect(ctx, lx - 6, 188, 12, 5, '#f5c542');
    rect(ctx, lx - 6, 220, 12, 5, '#f5c542');
  }
  // crates
  rect(ctx, 350, 300, 44, 40, '#a06b3f');
  rect(ctx, 398, 300, 44, 40, '#8a5a2b');
  line(ctx, 350, 320, 394, 320, '#7a4a21', 2);
  line(ctx, 398, 320, 442, 320, '#6e3f18', 2);
  // cat on the crates (one ear folded on the right)
  ellipse(ctx, 420, 288, 24, 16, '#7a6a58');
  circle(ctx, 420, 268, 15, '#7a6a58');
  poly(ctx, [[408, 258], [411, 242], [418, 256]], '#7a6a58');
  if (side === 'left') {
    poly(ctx, [[422, 256], [429, 242], [432, 258]], '#7a6a58');
  } else {
    ellipse(ctx, 430, 258, 7, 4, '#7a6a58');
  }
  circle(ctx, 414, 267, 2, '#ffd94d');
  circle(ctx, 426, 267, 2, '#ffd94d');

  // bunting flags (one flag at x=300 is left-only)
  line(ctx, 240, 120, 340, 120, '#0c1226', 2);
  const flagColors = ['#ffd94d', '#ff7f7f', '#7fd0ff', '#9b7ede', '#7fd08a'];
  for (let i = 0; i < 5; i++) {
    const fx = 250 + i * 18;
    if (fx === 304 && side === 'right') continue;
    poly(ctx, [[fx, 120], [fx + 16, 120], [fx + 8, 138]], flagColors[i]);
  }

  // ground lantern
  ellipse(ctx, 270, 372, 16, 20, '#e84c4c');
  rect(ctx, 262, 350, 16, 6, '#f5c542');
  rect(ctx, 262, 390, 16, 6, '#f5c542');
}

// ---------------------------------------------------------------- window
const RAIN_LEFT = [[110, 90], [150, 160], [210, 110], [260, 200], [130, 230], [230, 260], [180, 280], [280, 120]];

function drawWindow(ctx, side) {
  rect(ctx, 0, 0, PANEL_W, PANEL_H, '#f2e6d0');
  rect(ctx, 0, 396, PANEL_W, 24, '#d9c9a8');

  // window frame and rainy night outside
  rect(ctx, 70, 50, 240, 260, '#8a5a2b');
  rect(ctx, 85, 65, 210, 230, '#1e2a4a');
  // moon outside (full left, half right)
  circle(ctx, 240, 110, 22, '#f5eeda');
  if (side === 'right') rect(ctx, 240, 88, 24, 44, '#1e2a4a');
  // rain streaks (one extra on the right)
  for (const [x, y] of RAIN_LEFT) line(ctx, x, y, x - 6, y + 18, '#9fc4e8', 2);
  if (side === 'right') line(ctx, 180, 150, 174, 168, '#9fc4e8', 2);
  line(ctx, 190, 65, 190, 295, '#8a5a2b', 6);
  line(ctx, 85, 180, 295, 180, '#8a5a2b', 6);

  // curtains (left tied, right straight)
  if (side === 'left') {
    poly(ctx, [[50, 40], [84, 40], [78, 200], [56, 200]], '#c96f5a');
    rect(ctx, 58, 196, 18, 8, '#8a3a2a');
    poly(ctx, [[56, 204], [78, 204], [72, 280], [62, 280]], '#c96f5a');
  } else {
    rect(ctx, 50, 40, 34, 240, '#c96f5a');
  }
  rect(ctx, 296, 40, 34, 240, '#c96f5a');
  line(ctx, 58, 40, 58, 280, '#a85442', 2);
  line(ctx, 76, 40, 76, 280, '#a85442', 2);
  line(ctx, 304, 40, 304, 280, '#a85442', 2);
  line(ctx, 322, 40, 322, 280, '#a85442', 2);

  // cat on the sill (whiskers: 3 a side left, 1 a side right)
  ellipse(ctx, 250, 296, 26, 16, '#3a3a3a');
  circle(ctx, 250, 276, 16, '#3a3a3a');
  poly(ctx, [[238, 266], [241, 250], [248, 264]], '#3a3a3a');
  poly(ctx, [[252, 264], [259, 250], [262, 266]], '#3a3a3a');
  circle(ctx, 244, 275, 2, '#ffd94d');
  circle(ctx, 256, 275, 2, '#ffd94d');
  const whiskers = side === 'left' ? [-6, 0, 6] : [0];
  for (const dy of whiskers) {
    line(ctx, 228, 280 + dy, 214, 278 + dy, '#dddddd', 1);
    line(ctx, 272, 280 + dy, 286, 278 + dy, '#dddddd', 1);
  }
  rect(ctx, 200, 310, 100, 10, '#8a5a2b');

  // bookshelf
  rect(ctx, 380, 120, 150, 220, '#a06b3f');
  rect(ctx, 388, 190, 134, 8, '#8a5a2b');
  rect(ctx, 388, 260, 134, 8, '#8a5a2b');
  const bookColors = ['#d94f4f', '#4c8de8', '#3e9e5c', '#f2d13d', '#9b7ede', '#ef7fb0'];
  for (let i = 0; i < 6; i++) {
    if (i === 2 && side === 'right') continue; // one book missing on the right
    rect(ctx, 392 + i * 22, 148, 18, 42, bookColors[i]);
  }
  for (let i = 0; i < 5; i++) rect(ctx, 392 + i * 26, 218, 20, 42, bookColors[(i + 2) % 6]);
  // vase (right panel only)
  if (side === 'right') {
    ellipse(ctx, 480, 248, 12, 16, '#7f9fd0');
    rect(ctx, 474, 228, 12, 8, '#7f9fd0');
  }

  // plant on the floor (5 leaves left, 3 right)
  rect(ctx, 322, 330, 30, 26, '#c96f5a');
  const leaves = side === 'left' ? 5 : 3;
  for (let i = 0; i < leaves; i++) {
    const a = -Math.PI / 2 + (i - (leaves - 1) / 2) * 0.45;
    ellipse(ctx, 337 + Math.cos(a) * 16, 322 + Math.sin(a) * 16, 7, 14, '#3e9e5c');
  }

  // table and mug (red left, green right)
  rect(ctx, 120, 340, 200, 12, '#8a5a2b');
  rect(ctx, 130, 352, 12, 40, '#6e4520');
  rect(ctx, 298, 352, 12, 40, '#6e4520');
  rect(ctx, 188, 312, 26, 28, side === 'left' ? '#e84c4c' : '#3e9e5c');
  ctx.strokeStyle = side === 'left' ? '#e84c4c' : '#3e9e5c';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(218, 326, 8, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();

  // rug (striped left, plain right)
  ellipse(ctx, 280, 385, 150, 20, '#d98a6a');
  if (side === 'left') {
    line(ctx, 180, 378, 380, 378, '#b96a4a', 3);
    line(ctx, 180, 392, 380, 392, '#b96a4a', 3);
  }

  // wall clock (3:00 left, 4:30 right)
  circle(ctx, 480, 80, 26, '#ffffff');
  ctx.strokeStyle = '#333333';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(480, 80, 26, 0, Math.PI * 2);
  ctx.stroke();
  if (side === 'left') {
    line(ctx, 480, 80, 480, 62, '#333333', 3); // minute up
    line(ctx, 480, 80, 494, 80, '#333333', 3); // hour right
  } else {
    line(ctx, 480, 80, 480, 98, '#333333', 3); // minute down
    line(ctx, 480, 80, 492, 90, '#333333', 3); // hour down-right
  }
  circle(ctx, 480, 80, 3, '#333333');
}

export const SCENES = [
  {
    id: 'garden',
    name: 'Sunny Garden',
    diffs: [
      { id: 'shades', x: 90, y: 70, r: 42 },
      { id: 'butterfly', x: 300, y: 140, r: 26 },
      { id: 'flower', x: 290, y: 352, r: 22 },
      { id: 'tail', x: 462, y: 330, r: 26 },
      { id: 'bird', x: 478, y: 58, r: 22 },
    ],
  },
  {
    id: 'market',
    name: 'Night Market',
    diffs: [
      { id: 'lantern', x: 400, y: 206, r: 24 },
      { id: 'star', x: 120, y: 50, r: 18 },
      { id: 'moon', x: 450, y: 70, r: 34 },
      { id: 'dumpling', x: 178, y: 244, r: 20 },
      { id: 'flag', x: 312, y: 122, r: 18 },
      { id: 'catear', x: 424, y: 252, r: 20 },
      { id: 'sign', x: 145, y: 210, r: 24 },
    ],
  },
  {
    id: 'window',
    name: 'Rainy Window',
    diffs: [
      { id: 'clock', x: 480, y: 80, r: 30 },
      { id: 'book', x: 425, y: 169, r: 20 },
      { id: 'mug', x: 201, y: 326, r: 22 },
      { id: 'rain', x: 177, y: 159, r: 20 },
      { id: 'plant', x: 337, y: 312, r: 24 },
      { id: 'curtain', x: 67, y: 200, r: 26 },
      { id: 'whiskers', x: 250, y: 280, r: 24 },
      { id: 'rug', x: 280, y: 385, r: 26 },
      { id: 'moon', x: 240, y: 110, r: 26 },
      { id: 'vase', x: 480, y: 244, r: 20 },
    ],
  },
];

export function drawScene(ctx, sceneIndex, side) {
  if (sceneIndex === 0) drawGarden(ctx, side);
  else if (sceneIndex === 1) drawMarket(ctx, side);
  else drawWindow(ctx, side);
}
