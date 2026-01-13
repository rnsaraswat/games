
import { levelSel, themeSel, moves} from './script.js';
import { hrs, min, sec } from './timer.js';

function storageKey() {
    return `mm_best_${levelSel.value}_${themeSel.value}`;
}

// load best score from local storage
export function loadBest() {
    const raw = localStorage.getItem(storageKey());
    document.getElementById('best').textContent = raw ? raw : '—';
}
export function saveBest() {
    //load previous best score from local storage
    const prev = localStorage.getItem(storageKey());
    // current score
    const cur = `${moves} moves, ⏱${hrs}:${min}:${sec}`;
    if (!prev) return localStorage.setItem(storageKey(), cur);
    //compare previous score with current score
    const m = /(\d+) moves, ⏱(\d+):(\d+):(d+)/.exec(prev);
    if (!m) return localStorage.setItem(storageKey(), cur);
    const pm = Number(m[1]), pth = Number(m[2]), ptm = Number(m[2]), pts = Number(m[2]);

    //store score if less move or less time
    if (moves < pm || (moves === pm && hrs < pth && min < ptm && sec < pts)) localStorage.setItem(storageKey(), cur);
}