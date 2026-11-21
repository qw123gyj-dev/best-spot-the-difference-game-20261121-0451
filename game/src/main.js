// main.js — bootstrap: start the engine, then apply a screenshot preset
// (?shot=...) when one is present.

import { init } from './game.js';
import { applyShot } from './shots.js';

init();
applyShot();
