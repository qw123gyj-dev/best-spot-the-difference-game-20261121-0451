// shots.js — deterministic screenshot presets for the maker's screenshots.
// ?shot=start  title screen
// ?shot=play   level 1 mid-play: 2 of 5 found, 3 still hidden, timer frozen at 1:14
// ?shot=market level 2 mid-play: 3 of 7 found, 4 still hidden, timer frozen at 0:58
// ?shot=win    game-complete screen with 3 stars
// The timer is frozen in shot mode so every capture is identical.

import { game, startLevel, startGame, showGameDoneShot } from './game.js';

export function applyShot() {
  const params = new URLSearchParams(window.location.search);
  const shot = params.get('shot');
  if (!shot) return false;
  game.frozen = true;
  if (shot === 'start') {
    // title screen is the default; nothing to do
    return true;
  }
  if (shot === 'play') {
    startGame();
    startLevel(0, { found: [0, 2], timeLeft: 74, score: 210 });
    game.frozen = true;
    return true;
  }
  if (shot === 'market') {
    startGame();
    startLevel(1, { found: [1, 3, 5], timeLeft: 58, score: 330 });
    game.frozen = true;
    return true;
  }
  if (shot === 'win') {
    startGame();
    startLevel(2, { found: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], timeLeft: 47 });
    showGameDoneShot(3400, 4);
    game.frozen = true;
    return true;
  }
  return false;
}
