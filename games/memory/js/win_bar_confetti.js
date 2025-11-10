/* ---------- Win + Winbar + Confetti ---------- */

/* ---------- these lines added in index.html ---------- */
// Win controls panel (on main screen) 
//     <div class="winbar" id="winbar" aria-live="polite">
//         <div class="statsmini">🎉 Win! <span id="wintxt">(⏱00:00:00 • 0 moves)</span></div>
//         <div class="row">
//             <label for="colorMode">Color</label>
//             <select id="colorMode">
//                 <option value="multi">Multi</option>
//                 <option value="single">Single</option>
//             </select>
//         </div>
//         <div class="row" id="singleColorRow">
//             <label for="singleColor">Pick</label>
//             <input type="color" id="singleColor" value="#ff6a00">
//         </div>
//         <div class="row">
//             <label for="density">Density</label>
//             <input type="range" id="density" min="60" max="700" value="240">
//         </div>
//         <div class="row">
//             <label for="direction">Direction</label>
//             <select id="direction">
//                 <option value="up">Up</option>
//                 <option value="down">Down</option>
//                 <option value="left">Left</option>
//                 <option value="right">Right</option>
//             </select>
//             <button id="playAgain" class="primary">Play Again</button>
//         </div>
//     </div> 
/* ---------- these lines added in index.html ---------- */

/* ---------- these lines added in style.css ---------- */
/* Win panel on main screen */
/* .winbar {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 1vw;
    background: var(--bg);
    color: var(--fg);
    border: 0.1vw solid var(--cell-border);
    border-radius: 1.4vw;
    padding: 1vw;
    z-index: 10001;
    display: none;
    gap: 1vw;
    align-items: center;
    flex-wrap: wrap;
    box-shadow: 0 1vw 4vw rgba(0, 0, 0, .45);
}

.winbar.show {
    display: flex;
}

.winbar .row {
    display: flex;
    align-items: center;
    gap: 0.8vw;
    background: var(--bg);
    padding: 0.6vh 0.8vw;
    border-radius: 1vw;
}

.winbar label {
    color: var(--fg);
    font-size: 1.2vw;
}

.winbar select,
.winbar input[type="range"],
.winbar input[type="color"] {
    border: 0.1vw solid var(--cell-border);
    background: var(--bg);
    color: var(--fg);
    border-radius: 0.8vw;
    padding: 0.4vh 0.6vw;
}

.winbar input[type="color"] {
    padding: 0;
    width: 4.2vw;
    height: 2.8vw;
}

.winbar .statsmini {
    color: var(--fg);
    font-size: 1.2vw;
    margin-right: 0.6vw;
} */
/* ---------- these lines added in style.css ---------- */

/* ---------- these lines for javascript  ---------- */
const winbar = document.getElementById('winbar');
const wintxt = document.getElementById('winText');
document.getElementById('playAgain').addEventListener('click', () => {
    winbar.classList.remove('show');
    startGame();
});

const colorModeSel = document.getElementById('colorMode');
const singleColorRow = document.getElementById('singleColorRow');
const singleColorInp = document.getElementById('singleColor');
const densityInp = document.getElementById('density');
const directionSel = document.getElementById('direction');

colorModeSel.addEventListener('change', () => {
    singleColorRow.style.display = colorModeSel.value === 'single' ? 'flex' : 'none';
    restartConfetti();
});

singleColorInp.addEventListener('input', restartConfetti);
densityInp.addEventListener('input', restartConfetti);
directionSel.addEventListener('change', restartConfetti);