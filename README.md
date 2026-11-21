# Mochi's Spot the Difference

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/qw123gyj-dev/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/qw123gyj-dev/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

Two pictures, one truth. Find every difference between the two panels of
Mochi the cat's cozy world — a sunny garden, a night market, and a rainy
window — before the clock runs out.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

No build step, no network: `game/` is plain static files (HTML, CSS and
vanilla JS modules, all art drawn in code with Canvas 2D).

## How to play

- Click a difference on either picture to mark it (green circle + chime).
- Wrong click: red X, −3 seconds, combo resets.
- **H** hint (3 per scene, pulses one hidden difference), **R** restart,
  **M** sound on/off, **1–3** jump to a scene.
- Each find scores 100 + combo bonus; finishing a scene banks a time bonus.
- 3 scenes, 5 + 7 + 10 = 22 differences, 90 / 105 / 120 seconds each.

## Layout

- `game/index.html` — page shell, HUD, two panels, overlay
- `game/styles.css` — all styling
- `game/src/scenes.js` — the three original scenes and their differences
- `game/src/game.js` — state machine, input, scoring, timer, hints, HUD
- `game/src/audio.js` — synthesized WebAudio sound effects (no files)
- `game/src/shots.js` — deterministic `?shot=` presets for screenshots
- `game/src/main.js` — bootstrap
- `main.ts` — hands the game in: copies `game/` + `screenshots/` to
  `/output` and writes `dossier.json` with the vendored make.fun library

---

<sub>Entered on [make.fun](https://make.fun/?ref=z3g1zh14&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
