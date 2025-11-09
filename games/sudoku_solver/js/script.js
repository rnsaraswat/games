import { textToSpeechEng } from './speak.js';
import { startTimer, stopTimer } from './timer.js';
import { playSound } from './sound.js';

// sizes with box rows/cols 
const sizes = [
    { n: 25, box: [5, 5] }, { n: 24, box: [3, 4] }, { n: 22, box: [2, 11] }, { n: 21, box: [3, 7] }, { n: 20, box: [4, 5] },
    { n: 18, box: [3, 6] }, { n: 16, box: [4, 4] }, { n: 15, box: [3, 5] }, { n: 14, box: [2, 7] }, { n: 12, box: [3, 4] },
    { n: 10, box: [2, 5] }, { n: 9, box: [3, 3] }, { n: 8, box: [2, 4] }, { n: 6, box: [2, 3] }, { n: 4, box: [2, 2] }
];

/* Elements */
const el = {
    maxSols: document.getElementById('maxSolutions'),
    sizeSelect: document.getElementById('sizeSelect'),
    warnText: document.getElementById('warntext'),
    // startBtn: document.getElementById('startBtn'),
    // newBtn: document.getElementById('newBtn'),
    solveBtn: document.getElementById('solveBtn'),
    unsolveBtn: document.getElementById('unsolveBtn'),
    resetBtn: document.getElementById('resetBtn'),
    undoBtn: document.getElementById('undoBtn'),
    pauseBtn: document.getElementById('pauseBtn'),
    status: document.getElementById('status'),
    numpad: document.getElementById('numpad'),
    boardContainer: document.getElementById('boardContainer'),
    themeToggle: document.getElementById('themeToggle'),
    // notesToggle: document.getElementById('notesToggle'),
    timerEl: document.getElementById('timer'),
    prevSol: document.getElementById('prevSol'),
    nextSol: document.getElementById('nextSol'),
    solIndexEl: document.getElementById('solIndex'),
    filledInfo: document.getElementById('filledInfo'),
    remainInfo: document.getElementById('remainInfo'),
    totalInfo: document.getElementById('totalInfo'),

    yesBtn: document.getElementById('confirmYes'),
    noBtn: document.getElementById('confirmNo'),
    conformbar: document.getElementById('conformbar'),

};

sizes.sort((a, b) => a.n - b.n);
sizes.forEach(s => {
    const o = document.createElement('option'); o.value = s.n; o.textContent = `${s.n} (${s.box[0]}x${s.box[1]})`;
    el.sizeSelect.appendChild(o);
});
el.sizeSelect.value = 9;

// state ---------- */
let N = 9, boxR = 3, boxC = 3;            // current size & box dimensions
let grid = [], userGrid = [], notesGrid = []; // grid values and which are user-filled
let selectedDigit = null, selectedCell = null;
let undoStack = [];
let solutions = [], solIndex = 0, solvedMode = false;
export let timer = 0, timerInterval = null, paused = false;
let solverAbort = false, solvingInBackground = false;
let filledcell = 0;
let conform = false;
el.filledInfo.textContent = `Filled: ${filledcell}`;
el.remainInfo.textContent = `Empty: ${N * N - filledcell}`;
el.totalInfo.textContent = `Total: ${N * N}`;

// build board DOM (as per size)
function buildBoard(n, box) {
    N = n;
    boxR = box[0];
    boxC = box[1];
    grid = [];
    userGrid = [];
    notesGrid = [];
    undoStack = [];
    solutions = [];
    solIndex = 0;
    solvedMode = false;
    solverAbort = false;
    solvingInBackground = false;
    el.solIndexEl.textContent = '0 / 0';
    adjustSizes();
    el.boardContainer.style.gridTemplateColumns = `repeat(${N}, var(--cell-size))`;
    el.boardContainer.innerHTML = '';
    // el.boardContainer.style.gridTemplateColumns = `repeat(${N}, 1fr)`;
    // el.boardContainer.style.gridTemplateRows = `repeat(${N}, 1fr)`;
    for (let r = 0; r < N; r++) {
        grid[r] = Array(N).fill(0);
        userGrid[r] = Array(N).fill(0);
        notesGrid[r] = Array(N).fill([]);
    }
    for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.tabIndex = 0;
            cell.dataset.r = r;
            cell.dataset.c = c;
            cell.dataset.val = '';
            // subgrid alternate bg
            const br = Math.floor(r / boxR), bc = Math.floor(c / boxC);
            // console.log(el.altBgToggle.checked, br, bc, (br + bc) % 2)
            if ((br + bc) % 2 === 1) cell.classList.add('alt-bg');
            const input = document.createElement('input');
            input.readOnly = true;
            input.dataset.r = r;
            input.dataset.c = c;
            cell.appendChild(input);
            const noteWrap = document.createElement('div');
            noteWrap.className = 'notes';
            cell.appendChild(noteWrap);
            // thicker lines
            if (c % boxC === boxC - 1) cell.style.borderRightWidth = '0.3vw';
            if (r % boxR === boxR - 1) cell.style.borderBottomWidth = '0.3vw';
            if (c % boxC === 0) cell.style.borderLeftWidth = '0.3vw';
            if (r % boxR === 0) cell.style.borderTopWidth = '0.3vw';
            cell.addEventListener('click', () => onCellClick(r, c));
            cell.addEventListener('keydown', (e) => onCellKeydown(e, r, c));
            el.boardContainer.appendChild(cell);
        }
    }
    buildNumpad();
    updateCounters();
    setStatus('click numpad number first then a cell');
    setTimeout(adjustSizes, 50);
}

// grid sizing (auto-scale with game size)
function adjustSizes() {
    const wrap = document.querySelector('.board-wrap');
    const rect = wrap.getBoundingClientRect();
    const pad = 12;
    const availW = Math.max(40, rect.width - pad);
    const availH = Math.max(40, rect.height - pad);
    const gap = 3;
    const sizeW = Math.floor((availW - gap * N) / N);
    const sizeH = Math.floor((availH - gap * N) / N);
    let cellSize = Math.max(16, Math.floor(Math.min(sizeW, sizeH)));
    cellSize = Math.max(16, Math.min(cellSize, 96));
    const sizePx = cellSize;
    document.documentElement.style.setProperty('--cell-size', sizePx + 'px');
}

// numpad 
function buildNumpad() {
    el.numpad.innerHTML = '';
    for (let d = 1; d <= N; d++) {
        const btn = document.createElement('button');
        btn.className = 'nbtn';
        btn.dataset.d = d;
        btn.textContent = d;
        const cspan = document.createElement('span');
        cspan.className = 'counter';
        btn.appendChild(cspan);
        btn.addEventListener('click', () => {
            if (solvedMode) return;
            playSound('tap');
            selectedDigit = d;
            updateNumpadSelection();
            setStatus(`Numpad ${d} Selected, Click cell to mark ${d}, after fill click Solve`);
            highlightDigit(d);
        });
        el.numpad.appendChild(btn);
    }
    const back = document.createElement('button');
    back.className = 'nbtn';
    back.textContent = '⌫';
    back.title = 'Remove selected cell';
    back.addEventListener('click', () => {
        selectedDigit = 'back';
        updateNumpadSelection();
        textToSpeechEng('back selected');
        setStatus('back selected, click cell to remove number');
    });
    el.numpad.appendChild(back);
    updateNumpadSelection();
    updateCounters();
}

function updateNumpadSelection() {
    [...el.numpad.children].forEach(b => {
        const d = b.dataset.d;
        if ((selectedDigit === 'back' && b.textContent === '⌫') || (d && Number(d) === selectedDigit)) b.classList.add('selected'); else b.classList.remove('selected');
    });
}
function updateCounters() {
    const counts = Array(N + 1).fill(0);
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) { const v = userGrid[r][c]; if (v) counts[v]++; }
    for (let d = 1; d <= N; d++) { const btn = el.numpad.children[d - 1]; if (!btn) continue; const remain = (N - counts[d]); btn.querySelector('.counter').textContent = remain > 0 ? remain : ''; }
}

// cell interactions with mouse
function onCellClick(r, c) {
    if (solvedMode) return;
    playSound('tap');
    selectedCell = [r, c];
    refreshSelection();
    if (selectedDigit === 'back') { // clear
        if (userGrid[r][c]) {
            textToSpeechEng('number removed');
            pushUndo({ r, c, prev: userGrid[r][c] });
            userGrid[r][c] = 0;
            grid[r][c] = 0;
            filledcell--;
            el.filledInfo.textContent = `Filled: ${filledcell}`;
            el.remainInfo.textContent = `Empty: ${N * N - filledcell}`;
            el.totalInfo.textContent = `Total: ${N * N}`;
            refreshCell(r, c);
            updateCounters();
            checkConflicts();
        }
        return;
    }
    if (!selectedDigit) { setStatus('Select numpad number first to fill board'); return; }
    if (selectedDigit > 0 && userGrid[r][c] == 0) {
        pushUndo({ r, c, prev: userGrid[r][c] });
        userGrid[r][c] = selectedDigit;
        grid[r][c] = selectedDigit;
        filledcell++;
        refreshCell(r, c);
        updateCounters();
        checkConflicts();
        el.filledInfo.textContent = `Filled: ${filledcell}`;
        el.remainInfo.textContent = `Empty: ${N * N - filledcell}`;
        el.totalInfo.textContent = `Total: ${N * N}`;
    }
}

// cell interactions with keyboard
function onCellKeydown(e, r, c) {
    if (solvedMode) return;
    if (e.key >= '1' && e.key <= String(N)) {
        playSound('key');
        selectedDigit = parseInt(e.key); updateNumpadSelection(); onCellClick(r, c);
    } else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        playSound('key');
        e.preventDefault(); navigateArrow(r, c, e.key);
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
        if (e.key === 'Backspace') textToSpeechEng('Backspace');
        if (e.key === 'Delete') textToSpeechEng('Delete');
        pushUndo({ r, c, prev: userGrid[r][c] }); userGrid[r][c] = 0; grid[r][c] = 0; refreshCell(r, c); updateCounters(); checkConflicts();
        filledcell--;
        el.filledInfo.textContent = `Filled: ${filledcell}`;
        el.remainInfo.textContent = `Empty: ${N * N - filledcell}`;
        el.totalInfo.textContent = `Total: ${N * N}`;
    }
}

//arrow keys
function navigateArrow(r, c, key) {
    let nr = r, nc = c;
    if (key === 'ArrowUp') nr = (r - 1 + N) % N;
    if (key === 'ArrowDown') nr = (r + 1) % N;
    if (key === 'ArrowLeft') nc = (c - 1 + N) % N;
    if (key === 'ArrowRight') nc = (c + 1) % N;
    const idx = nr * N + nc; const cell = el.boardContainer.children[idx];
    if (cell) { cell.focus(); selectedCell = [nr, nc]; refreshSelection(); }
}

function refreshCell(r, c) {
    const idx = r * N + c;
    const elCell = el.boardContainer.children[idx];
    const val = grid[r][c];
    const input = elCell.querySelector('input');
    input.value = val ? val : '';
    elCell.dataset.val = val || '';
    elCell.classList.toggle('user', !!userGrid[r][c]);
    elCell.classList.toggle('solved', solvedMode && !userGrid[r][c] && val);

    //for notes
    // const noteWrap = elCell.querySelector('.notes'); 
    // noteWrap.innerHTML = '';
    // if (el.notesToggle.checked && !val) {
    // const maxCols = Math.ceil(Math.sqrt(N)); 
    // noteWrap.style.gridTemplateColumns = `repeat(${maxCols},1fr)`;
    // const cand = getCandidates(r, c);
    // for (let i = 1; i <= N; i++) { 
    //     const sp = document.createElement('span'); 
    //     sp.textContent = cand.includes(i) ? i : ''; 
    //     noteWrap.appendChild(sp); 
    // }
    // }
}

function refreshAll() {
    console.log(userGrid, grid);
    filledcell = 0;
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
        refreshCell(r, c);
        if (grid[r][c] > 0) filledcell++;
    }
    console.log(filledcell, N * N - filledcell);
    el.filledInfo.textContent = `Filled: ${filledcell}`;
    el.remainInfo.textContent = `Empty: ${N * N - filledcell}`;
    el.totalInfo.textContent = `Total: ${N * N}`;
    refreshSelection(); updateCounters(); checkConflicts();
}

function refreshSelection() {
    document.querySelectorAll('.cell').forEach(elc => elc.classList.remove('selected', 'row-highlight', 'col-highlight'));
    if (!selectedCell) return;
    const [r, c] = selectedCell;
    const idx = r * N + c;
    const elc = el.boardContainer.children[idx];
    if (elc) elc.classList.add('selected');
    for (let i = 0; i < N; i++) {
        el.boardContainer.children[r * N + i].classList.add('row-highlight');
        el.boardContainer.children[i * N + c].classList.add('col-highlight');
    }
}

// undo / status
function pushUndo(e) {
    undoStack.push(e);
    if (undoStack.length > 1000) undoStack.shift();
}

function doUndo() {
    if (solvedMode) return;
    const last = undoStack.pop(); if (!last) return; textToSpeechEng('Undo'); grid[last.r][last.c] = last.prev || 0; userGrid[last.r][last.c] = last.prev || 0; refreshCell(last.r, last.c); updateCounters(); checkConflicts();
}

function setStatus(t) {
    el.status.textContent = t;
}

// conflicts & candidates
function checkConflicts() {
    document.querySelectorAll('.cell').forEach(c => c.classList.remove('conflict'));
    // rows
    for (let r = 0; r < N; r++) {
        const seen = {};
        for (let c = 0; c < N; c++) { const v = userGrid[r][c]; if (!v) continue; if (seen[v]) { el.boardContainer.children[r * N + c].classList.add('conflict'); el.boardContainer.children[r * N + (seen[v] - 1)].classList.add('conflict'); } else seen[v] = c + 1; }
    }
    // cols
    for (let c = 0; c < N; c++) {
        const seen = {};
        for (let r = 0; r < N; r++) { const v = userGrid[r][c]; if (!v) continue; if (seen[v]) { el.boardContainer.children[r * N + c].classList.add('conflict'); el.boardContainer.children[(seen[v] - 1) * N + c].classList.add('conflict'); } else seen[v] = r + 1; }
    }
    // boxes
    for (let br = 0; br < boxR; br++) for (let bc = 0; bc < boxC; bc++) {
        const seen = {};
        for (let r = br * boxR; r < br * boxR + boxR; r++) for (let c = bc * boxC; c < bc * boxC + boxC; c++) {
            const v = userGrid[r][c]; if (!v) continue;
            const key = v;
            if (seen[key]) { el.boardContainer.children[r * N + c].classList.add('conflict'); const [pr, pc] = seen[key]; el.boardContainer.children[pr * N + pc].classList.add('conflict'); }
            else seen[key] = [r, c];
        }
    }
}

function getCandidates(r, c) {
    if (grid[r][c]) return [];
    const used = new Set();
    for (let i = 0; i < N; i++) { if (userGrid[r][i]) used.add(userGrid[r][i]); if (userGrid[i][c]) used.add(userGrid[i][c]); }
    const br = Math.floor(r / boxR) * boxR, bc = Math.floor(c / boxC) * boxC;
    for (let rr = br; rr < br + boxR; rr++) for (let cc = bc; cc < bc + boxC; cc++) if (userGrid[rr][cc]) used.add(userGrid[rr][cc]);
    const arr = []; for (let d = 1; d <= N; d++) if (!used.has(d)) arr.push(d); return arr;
}

function highlightDigit(d) {
    document.querySelectorAll('.cell').forEach(c => c.classList.remove('digit-highlight'));
    if (!d || d === 'back') return;
    document.querySelectorAll(`.cell[data-val="${d}"]`).forEach(c => c.classList.add('digit-highlight'));
}

// Solver (async, optimized)
function selectNextCellOptimized(g) {
    // choose empty cell with fewest candidates (MRV), tie-breaker: row+col+box fill count (higher better)
    let best = null; let bestCandCount = Infinity; let bestScore = -1;
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
        if (g[r][c]) continue;
        // candidates
        const cand = [];
        for (let d = 1; d <= N; d++) { if (validFor(g, r, c, d)) cand.push(d); }
        const candCount = cand.length;
        if (candCount === 0) return { r, c, cand: [] }; // dead end
        // score = how filled the row/col/box already are
        let rowFill = 0, colFill = 0, boxFill = 0;
        for (let k = 0; k < N; k++) { if (g[r][k]) rowFill++; if (g[k][c]) colFill++; }
        const br0 = Math.floor(r / boxR), bc0 = Math.floor(c / boxC);
        for (let rr = br0 * boxR; rr < br0 * boxR + boxR; rr++) for (let cc = bc0 * boxC; cc < bc0 * boxC + boxC; cc++) if (g[rr][cc]) boxFill++;
        const score = rowFill + colFill + boxFill;
        if (candCount < bestCandCount || (candCount === bestCandCount && score > bestScore)) {
            best = { r, c, cand }; bestCandCount = candCount; bestScore = score;
        }
    }
    return best; // {r,c,cand}
}

function validFor(g, r, c, v) {
    for (let i = 0; i < N; i++) { if (g[r][i] === v) return false; if (g[i][c] === v) return false; }
    const br0 = Math.floor(r / boxR) * boxR, bc0 = Math.floor(c / boxC) * boxC;
    for (let rr = br0; rr < br0 + boxR; rr++) for (let cc = bc0; cc < bc0 + boxC; cc++) if (g[rr][cc] === v) return false;
    return true;
}

async function solveAllAsync(maxSolutions, onProgress, onFirst) {
    solverAbort = false; solvingInBackground = true;
    const g = userGrid.map(r => r.slice());
    const solutionsLocal = [];
    let nodes = 0, lastYield = performance.now();

    // backtracking
    async function bt() {
        if (solverAbort) return;
        const pick = selectNextCellOptimized(g);
        if (!pick) { // solved
            solutionsLocal.push(g.map(row => row.slice()));
            if (onProgress) onProgress(solutionsLocal.length);
            if (solutionsLocal.length === 1 && onFirst) onFirst(solutionsLocal[0]);
            return;
        }
        // dead end check
        if (pick.cand.length === 0) return;
        // order candidates by frequency (most frequent first)
        const freq = Array(N + 1).fill(0);
        for (let rr = 0; rr < N; rr++) for (let cc = 0; cc < N; cc++) { const v = g[rr][cc]; if (v) freq[v]++; }
        pick.cand.sort((a, b) => freq[b] - freq[a]);

        const { r, c } = pick;
        for (const v of pick.cand) {
            if (solverAbort) return;
            g[r][c] = v; nodes++;
            // yield occasionally to keep UI responsive
            if (nodes % 3000 === 0 || (performance.now() - lastYield) > 120) {
                lastYield = performance.now();
                await new Promise(res => setTimeout(res, 0));
            }
            await bt();
            g[r][c] = 0;
            if (solverAbort) return;
            if (solutionsLocal.length >= maxSolutions) return;
        }
    }

    await bt();
    solvingInBackground = false;
    return solutionsLocal;
}

// Apply/clear solutions
function applySolution(sol) {
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (!userGrid[r][c]) grid[r][c] = sol[r][c];
    solvedMode = true; refreshAll();
}

function clearSolution() {
    solvedMode = false;
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (!userGrid[r][c]) grid[r][c] = 0;
    refreshAll();
}

// base solution for empty board
function generateBaseSolution(n, r, c) {
    const sol = Array.from({ length: n }, () => Array(n).fill(0));
    for (let row = 0; row < n; row++) {
        for (let col = 0; col < n; col++) {
            const num = ((row * c + Math.floor(row / r) + col) % n) + 1;
            sol[row][col] = num;
        }
    }
    return sol;
}

// Solve flow (first solution immediate + background)
async function startSolveFlow() {
    warnbar.classList.remove('show');
    const maxSol = Math.max(1, Math.min(1000, parseInt(el.maxSols.value) || 2));
    // check for 25% filled or not
    // if(N >= 12 && filled < Math.ceil(total * 0.25)){
    //     // el.warnText.textContent = "Bigger no of solution may and bigger the size may slow the solving process";
    //     // warnbar.classList.add('show');
    //     setStatus(`Too few clues for ${N}×${N}. Need at least ${Math.ceil(total*0.25)} clues (25%).`);
    //     textToSpeechEng(`Fill more ${Math.ceil(total*0.25) - filled} numbers`);
    //     return;
    // }
    const filled = userGrid.flat().filter(v => v).length;
    const total = N * N;
    if (filled === 0) {
        const base = generateBaseSolution(N, boxR, boxC);
        applySolution(base);
        setStatus('Empty Board - Only Base solution shown.');
        textToSpeechEng('Base Solition');
        return;
    }

    setStatus('Solving: searching (first solution will appear as soon as found)...');
    solutions = [];
    solIndex = 0;
    updateSolNav();
    solverAbort = false;
    solvingInBackground = true;

    // progress callback: update status live
    const onProgress = (count) => {
        setStatus(`Computer working — solutions found: ${count}`);
        el.solIndexEl.textContent = `${solIndex + 1} / ${Math.max(1, count)}`;
    };

    // first-solution callback: apply immediately
    const onFirst = (sol) => {
        applySolution(sol);
        stopTimer();
        setStatus('First solution shown. Continuing search in background...');
        textToSpeechEng('First Solition');
        el.filledInfo.textContent = `Filled: ${filledcell}`;
        el.remainInfo.textContent = `Empty: ${N * N - filledcell}`;
        el.totalInfo.textContent = `Total: ${N * N}`;
    };
    // run solver (async)
    const sols = await solveAllAsync(maxSol, onProgress, onFirst);

    solutions = sols;
    if (solutions.length === 0) {
        setStatus('No solution found.');
        textToSpeechEng('No solution found');
        solvingInBackground = false;
        return;
    }

    // ensure first solution is applied
    if (!solvedMode && solutions.length > 0) {
        applySolution(solutions[0]);
    }
    setStatus(`Search complete (found ${solutions.length} solution(s)`);
    solIndex = 0; updateSolNav();
    selectedCell = null;
    selectedDigit = null;
    document.querySelectorAll('.cell').forEach(c => c.classList.remove('selected', 'row-highlight', 'col-highlight'));
    document.querySelectorAll('.nbtn').forEach(elc => elc.classList.remove('selected'));
    stopTimer();
}

// update solution navigation
function updateSolNav() {
    el.solIndexEl.textContent = (solutions.length ? `${solIndex + 1} / ${solutions.length}` : '0 / 0');
}

//max solution change
el.maxSols.addEventListener('input', function () {
    let inputval = this.value;
    console.log(inputval);
    const maxSol = Math.max(1, Math.min(1000, parseInt(inputval) || 2));
    if (maxSol > 10) {
        el.warnText.textContent = "Higher the no of solution and Bigger the grid size may slow the solving process";
        warnbar.classList.add('show');
    } else {
        warnbar.classList.remove('show');
    }
});

//size change
el.sizeSelect.addEventListener('click', () => {
    const n = parseInt(el.sizeSelect.value);
    if (n > 12) {
        el.warnText.textContent = "Bigger the grid size and higher the no of solution may slow the solving process";
        warnbar.classList.add('show');
    } else {
        warnbar.classList.remove('show');
    }
    const opt = sizes.find(s => s.n === n);
    buildBoard(n, opt.box);
    setStatus('New board Ready — Click number to start fill board');
    refreshAll();
    startTimer();
});

//show warning popup
document.getElementById('warn').addEventListener('click', () => {
    warnbar.classList.remove('show');
});

// action to check after 25% number filledd or not
// click warning window ok button
// el.sizeSelect.addEventListener('click', () => {
//     const n = parseInt(el.sizeSelect.value); 
//     if (n>12) {
//         warnbar.classList.add('show');
//     }
//     const opt = sizes.find(s => s.n === n);
//     buildBoard(n, opt.box); 
//     startTimer();
// });

//new button
// el.newBtn.addEventListener('click', () => {
//     const n = parseInt(el.sizeSelect.value); 
//     const opt = sizes.find(s => s.n === n);
//     buildBoard(n, opt.box); 
//     setStatus('New board ready');
// });

// solve
el.solveBtn.addEventListener('click', () => startSolveFlow());

// unsolve
el.unsolveBtn.addEventListener('click', () => {
    if (!solvedMode) return;
    solverAbort = true;
    clearSolution();
    solutions = [];
    solIndex = 0;
    updateSolNav();
    textToSpeechEng('unsolve');
    setStatus('Unsolved / aborted, you can fill/reomve number from board');
});

//reset
el.resetBtn.addEventListener('click', () => {
    textToSpeechEng('reset');
    conformbar.style.display = 'block';
});

//undo
el.undoBtn.addEventListener('click', () => doUndo());

// prev or next solution
el.prevSol.addEventListener('click', () => { textToSpeechEng('Previous'); if (solutions.length === 0) return; solIndex = (solIndex - 1 + solutions.length) % solutions.length; applySolution(solutions[solIndex]); updateSolNav(); });
el.nextSol.addEventListener('click', () => { textToSpeechEng('Next'); if (solutions.length === 0) return; solIndex = (solIndex + 1) % solutions.length; applySolution(solutions[solIndex]); updateSolNav(); });

//theme change
el.themeToggle.addEventListener('click', () => {
    document.body.classList.toggle("dark");
    if (document.body.classList.contains("dark")) {
        el.themeToggle.innerText = "☀️ Light";
        textToSpeechEng('Theme Light');
    } else {
        el.themeToggle.innerText = "🌙 Dark";
        textToSpeechEng('Theme Dark');
    }
});

//reset yes button
el.yesBtn.addEventListener('click', () => {
    conformbar.style.display = 'none';
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) { userGrid[r][c] = 0; grid[r][c] = 0; }
    refreshAll();
    undoStack = [];
    setStatus('Board reset, Select numpad number first to fill');
    return;
});

//reset no button
el.noBtn.onclick = function () {
    conformbar.style.display = 'none';
    return;
}

// key's action
window.addEventListener('keydown', (e) => {
    if (solvedMode) return;
    if (!selectedCell) return;
    const [r, c] = selectedCell;
    if (e.key >= '0' && e.key <= String(Math.max(9, N))) { // numeric
        const val = Number(e.key);
        pushUndo({ r, c, prev: userGrid[r][c] });
        userGrid[r][c] = val || 0; grid[r][c] = val || 0; refreshCell(r, c); updateCounters(); checkConflicts();
        e.preventDefault();
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
        pushUndo({ r, c, prev: userGrid[r][c] }); userGrid[r][c] = 0; grid[r][c] = 0; refreshCell(r, c); updateCounters(); checkConflicts(); e.preventDefault();
    } else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        navigateArrow(r, c, e.key);
    }
});


/* initial build */
(function init() {
    // fill size select values (already populated above)
    const initial = sizes.find(s => s.n === 9);
    buildBoard(initial.n, initial.box);
    setStatus('Ready — Click number to start fill board');
    // window.addEventListener('resize', adjustSizes);
    window.addEventListener('resize', () => {
        // const n = parseInt(el.sizeSelect.value); 
        // const opt = sizes.find(s => s.n === n);
        adjustSizes();
        // buildBoard(n, opt.box);
        // refreshAll();
    });
    setInterval(() => { if (!solvingInBackground) adjustSizes(); }, 400);
})();