// game.js — the spot-the-difference engine: state machine, input, scoring,
// timer, hints, markers and the HUD. All art comes from scenes.js.

import { SCENES, drawScene, PANEL_W, PANEL_H } from './scenes.js';
import { sfx } from './audio.js';

export const LEVELS = [
  { scene: 0, time: 90, par: 5 },
  { scene: 1, time: 105, par: 7 },
  { scene: 2, time: 120, par: 10 },
];

const $ = (id) => document.getElementById(id);

export const game = {
  screen: 'title', // title | playing | levelDone | gameDone | timeUp
  level: 0,
  found: new Set(),
  wrongMarks: [], // {x, y, born}
  hintMark: null, // {diff, born}
  hintsLeft: 3,
  timeLeft: 90,
  score: 0,
  levelScore: 0,
  combo: 0,
  bestCombo: 0,
  frozen: false, // screenshot mode: timer does not run
  startedAt: 0,
  lastTick: 0,
};

let leftCtx = null;
let rightCtx = null;
let rafId = 0;

function scene() {
  return SCENES[LEVELS[game.level].scene];
}

function totalDiffs() {
  return scene().diffs.length;
}

function fmtTime(s) {
  const m = Math.floor(Math.max(0, s) / 60);
  const sec = Math.floor(Math.max(0, s) % 60);
  return `${m}:${String(sec).padStart(2, '0')}`;
}

export function startLevel(index, opts) {
  const level = LEVELS[index];
  game.level = index;
  game.found = new Set(opts && opts.found ? opts.found : []);
  game.wrongMarks = [];
  game.hintMark = null;
  game.hintsLeft = 3;
  game.timeLeft = (opts && opts.timeLeft != null) ? opts.timeLeft : level.time;
  game.levelScore = 0;
  game.combo = 0;
  if (opts && opts.score != null) {
    // screenshot presets: make the score match the pre-found differences
    game.score = opts.score;
    game.levelScore = opts.score;
    game.combo = game.found.size;
    game.bestCombo = Math.max(game.bestCombo, game.found.size);
  }
  game.screen = 'playing';
  game.startedAt = performance.now();
  game.lastTick = game.startedAt;
  hideOverlay();
  updateHud();
}

export function startGame() {
  game.score = 0;
  game.bestCombo = 0;
  startLevel(0);
}

function updateHud() {
  $('hud-level').textContent = `Level ${game.level + 1} · ${scene().name}`;
  $('hud-found').textContent = `${game.found.size} / ${totalDiffs()} found · ${totalDiffs() - game.found.size} left`;
  $('hud-time').textContent = fmtTime(game.timeLeft);
  $('hud-time').classList.toggle('danger', game.timeLeft <= 15 && game.screen === 'playing');
  $('hud-score').textContent = `Score ${game.score}`;
  $('hud-hints').textContent = `Hint (${game.hintsLeft})`;
  $('hud-hints').disabled = game.hintsLeft <= 0 || game.screen !== 'playing';
}

function showOverlay(html) {
  const ov = $('overlay');
  ov.innerHTML = html;
  ov.classList.remove('hidden');
}

function hideOverlay() {
  $('overlay').classList.add('hidden');
  $('overlay').innerHTML = '';
}

function levelComplete() {
  const bonus = Math.round(game.timeLeft) * 5;
  game.score += bonus;
  game.levelScore += bonus;
  game.screen = 'levelDone';
  sfx.levelDone();
  const last = game.level === LEVELS.length - 1;
  showOverlay(`
    <div class="card">
      <h2>${last ? 'All scenes cleared!' : 'Scene cleared!'}</h2>
      <p class="big">${scene().name} — ${totalDiffs()}/${totalDiffs()} differences found</p>
      <p>Time bonus +${bonus} · Level score ${game.levelScore} · Total ${game.score}</p>
      <button id="ov-next">${last ? 'See my result' : 'Next scene →'}</button>
      <button id="ov-replay" class="ghost">Replay this scene</button>
    </div>`);
  $('ov-next').addEventListener('click', () => {
    if (last) showGameDone();
    else startLevel(game.level + 1);
  });
  $('ov-replay').addEventListener('click', () => startLevel(game.level));
  updateHud();
}

function showGameDone() {
  game.screen = 'gameDone';
  sfx.gameDone();
  const stars = game.score >= 3200 ? 3 : game.score >= 2400 ? 2 : 1;
  showOverlay(`
    <div class="card">
      <h2>You found them all!</h2>
      <p class="stars">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</p>
      <p class="big">Final score ${game.score}</p>
      <p>22 differences · Best combo ×${game.bestCombo} · Mochi approves.</p>
      <button id="ov-again">Play again</button>
    </div>`);
  $('ov-again').addEventListener('click', startGame);
  updateHud();
}

function timeUp() {
  game.screen = 'timeUp';
  sfx.timeUp();
  showOverlay(`
    <div class="card">
      <h2>Time's up!</h2>
      <p class="big">${scene().name} — ${game.found.size}/${totalDiffs()} found</p>
      <p>${totalDiffs() - game.found.size} difference${totalDiffs() - game.found.size === 1 ? '' : 's'} still hiding. So close!</p>
      <button id="ov-retry">Try this scene again</button>
      <button id="ov-title" class="ghost">Back to title</button>
    </div>`);
  $('ov-retry').addEventListener('click', () => startLevel(game.level));
  $('ov-title').addEventListener('click', showTitle);
  updateHud();
}

export function showGameDoneShot(score, bestCombo) {
  game.score = score;
  game.bestCombo = bestCombo;
  game.level = LEVELS.length - 1;
  game.screen = 'gameDone';
  game.frozen = true;
  showGameDone();
}

export function showTitle() {
  game.screen = 'title';
  game.level = 0;
  game.found = new Set();
  game.wrongMarks = [];
  game.hintMark = null;
  game.timeLeft = LEVELS[0].time;
  showOverlay(`
    <div class="card title-card">
      <h1>Mochi's<br>Spot the Difference</h1>
      <p class="tag">Three cozy scenes. Twenty-two secrets.<br>Two pictures, one truth — find every change.</p>
      <p class="rules">Click a difference on either picture · Wrong click costs 3 seconds<br>
      <b>H</b> hint · <b>R</b> restart · <b>M</b> sound · <b>1–3</b> jump to a scene</p>
      <button id="ov-play">▶ Start hunting</button>
    </div>`);
  $('ov-play').addEventListener('click', () => {
    sfx.unlock();
    startGame();
  });
  updateHud();
}

function useHint() {
  if (game.screen !== 'playing' || game.hintsLeft <= 0) return;
  const remaining = scene().diffs.filter((d, i) => !game.found.has(i));
  if (!remaining.length) return;
  const pick = remaining[Math.floor(Math.random() * remaining.length)];
  game.hintsLeft -= 1;
  game.hintMark = { diff: pick, born: performance.now() };
  sfx.hint();
  updateHud();
}

function onPanelClick(ev, side) {
  if (game.screen !== 'playing') return;
  sfx.unlock();
  const canvas = ev.currentTarget;
  const rectBox = canvas.getBoundingClientRect();
  const x = ((ev.clientX - rectBox.left) / rectBox.width) * PANEL_W;
  const y = ((ev.clientY - rectBox.top) / rectBox.height) * PANEL_H;
  const diffs = scene().diffs;
  for (let i = 0; i < diffs.length; i++) {
    if (game.found.has(i)) continue;
    const d = diffs[i];
    if (Math.hypot(x - d.x, y - d.y) <= d.r) {
      game.found.add(i);
      game.combo += 1;
      game.bestCombo = Math.max(game.bestCombo, game.combo);
      const pts = 100 + (game.combo - 1) * 10;
      game.score += pts;
      game.levelScore += pts;
      sfx.found();
      updateHud();
      if (game.found.size === diffs.length) levelComplete();
      return;
    }
  }
  // miss
  game.combo = 0;
  game.timeLeft = Math.max(0, game.timeLeft - 3);
  game.wrongMarks.push({ x, y, born: performance.now(), side });
  sfx.wrong();
  updateHud();
  if (game.timeLeft <= 0) timeUp();
}

function drawMarkers(ctx, now) {
  const diffs = scene().diffs;
  diffs.forEach((d, i) => {
    if (!game.found.has(i)) return;
    const pulse = 1 + 0.12 * Math.sin((now - game.startedAt) / 220);
    ctx.strokeStyle = '#2fae4e';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r * pulse, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r * pulse + 3, 0, Math.PI * 2);
    ctx.stroke();
    // check mark
    ctx.strokeStyle = '#2fae4e';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(d.x - 8, d.y);
    ctx.lineTo(d.x - 2, d.y + 7);
    ctx.lineTo(d.x + 9, d.y - 7);
    ctx.stroke();
  });
  // hint pulse
  if (game.hintMark) {
    const age = now - game.hintMark.born;
    if (age < 2500) {
      const d = game.hintMark.diff;
      const p = 1 + 0.25 * Math.sin(age / 160);
      ctx.strokeStyle = '#ffd94d';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r * p + 4, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      game.hintMark = null;
    }
  }
  // wrong-click X marks (fade after 0.9s)
  game.wrongMarks = game.wrongMarks.filter((m) => now - m.born < 900);
}

function render(now) {
  if (!leftCtx || !rightCtx) return;
  drawScene(leftCtx, LEVELS[game.level].scene, 'left');
  drawScene(rightCtx, LEVELS[game.level].scene, 'right');
  if (game.screen === 'playing' || game.screen === 'levelDone' || game.screen === 'gameDone' || game.screen === 'timeUp') {
    drawMarkers(leftCtx, now);
    drawMarkers(rightCtx, now);
    // wrong marks live on the panel that was clicked; draw them on both for simplicity of state,
    // but only the panel whose side matches gets them
    for (const m of game.wrongMarks) {
      const c = m.side === 'left' ? leftCtx : rightCtx;
      const age = now - m.born;
      c.globalAlpha = 1 - age / 900;
      c.strokeStyle = '#e84c4c';
      c.lineWidth = 4;
      c.lineCap = 'round';
      c.beginPath();
      c.moveTo(m.x - 9, m.y - 9);
      c.lineTo(m.x + 9, m.y + 9);
      c.moveTo(m.x + 9, m.y - 9);
      c.lineTo(m.x - 9, m.y + 9);
      c.stroke();
      c.globalAlpha = 1;
    }
  }
}

function tick(now) {
  if (game.screen === 'playing' && !game.frozen) {
    const dt = (now - game.lastTick) / 1000;
    game.timeLeft -= dt;
    if (game.timeLeft <= 0) {
      game.timeLeft = 0;
      updateHud();
      timeUp();
    } else if (Math.floor(game.timeLeft) !== Math.floor(game.timeLeft + dt)) {
      updateHud();
    }
  }
  game.lastTick = now;
  render(now);
  rafId = requestAnimationFrame(tick);
}

export function init() {
  const left = $('panel-left');
  const right = $('panel-right');
  left.width = PANEL_W;
  left.height = PANEL_H;
  right.width = PANEL_W;
  right.height = PANEL_H;
  leftCtx = left.getContext('2d');
  rightCtx = right.getContext('2d');

  left.addEventListener('click', (ev) => onPanelClick(ev, 'left'));
  right.addEventListener('click', (ev) => onPanelClick(ev, 'right'));
  $('hud-hints').addEventListener('click', useHint);
  $('hud-restart').addEventListener('click', () => {
    if (game.screen === 'playing' || game.screen === 'timeUp') startLevel(game.level);
  });
  $('hud-mute').addEventListener('click', (ev) => {
    ev.currentTarget.textContent = sfx.toggleMute() ? '🔇 Muted' : '🔊 Sound';
  });
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'h' || ev.key === 'H') useHint();
    else if (ev.key === 'r' || ev.key === 'R') {
      if (game.screen === 'playing' || game.screen === 'timeUp') startLevel(game.level);
    } else if (ev.key === 'm' || ev.key === 'M') {
      $('hud-mute').textContent = sfx.toggleMute() ? '🔇 Muted' : '🔊 Sound';
    } else if (game.screen === 'title' && ['1', '2', '3'].includes(ev.key)) {
      startGame();
      if (ev.key !== '1') startLevel(Number(ev.key) - 1);
    } else if ((ev.key === 'Enter' || ev.key === ' ') && game.screen === 'title') {
      startGame();
    }
  });

  showTitle();
  rafId = requestAnimationFrame(tick);
  return game;
}
