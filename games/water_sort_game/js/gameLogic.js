import { gameState } from "./levels.js";
import { TUBE_SIZE } from "./config.js";

export function isValidPour(from, to) {
  if (from === to) return false;
  const s = gameState[from];
  const t = gameState[to];
  if (!s.length || t.length === TUBE_SIZE) return false;
  if (!t.length) return true;
  return s[s.length - 1] === t[t.length - 1];
}

export function doPour(from, to) {
  const s = gameState[from];
  const t = gameState[to];
  const c = s[s.length - 1];

  while (
    s.length &&
    s[s.length - 1] === c &&
    t.length < TUBE_SIZE
  ) {
    t.push(s.pop());
  }
}
