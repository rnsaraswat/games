// these line are added in index.html file display best score
// <div class="stats">
//     <div>⏱ Time: <b id="timer-display">00:00:00</b></div>
//     <div>🌀 Moves: <b id="moves">0</b></div>
//     <div>🏆 Best: <b id="best">—</b></div>
// </div> 

// these line are added in style.css file 
// :root {
//     --bg: #121212;
//     --fg: #e5e7eb;
// }
// [data-theme="light"] {
//     --bg: #f0f0f0;
//     --fg: #111;
// }
// .stats {
//     display: flex;
//     gap: 1.4vw;
//     color: var(--fg);
//     background: var(--bg);
//     font-size: .1.2vw;
//     margin-left: 0.8vw;
// }

// .stats b {
//     color: var(--fg);
//     background: var(--bg);
// }

// these line are added in script.js javascript file
/* ---------- Best Score (localStorage) ---------- */
import { state, diffSel} from './script.js';
import { hrs, min, sec } from './timer.js';

function storageKey() {
    return `mm_best_${state.N}_${diffSel.value}`;
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
    const cur = `${state.N}(${state.blockRows}x${state.blockCols}), ${diffSel.value}, ⏱${hrs}:${min}:${sec}`;
    if (!prev) return localStorage.setItem(storageKey(), cur);
    //compare previous score with current score
    const m = /(\d+)((\d+)x(\d+)), (\d+), ⏱(\d+):(\d+):(d+)/.exec(prev);
    if (!m) return localStorage.setItem(storageKey(), cur);
    const pm = Number(m[1]), pth = Number(m[2]), ptm = Number(m[2]), pts = Number(m[2]);

    //store score if less move or less time
    if (moves < pm || (moves === pm && hrs < pth && min < ptm && sec < pts)) localStorage.setItem(storageKey(), cur);
}