
import { launchFireworks, showWinText } from './fireworks.js';
import { playSound } from './sound.js';
import { textToSpeechEng } from './speak.js';
import { shareScore } from './share.js';
import { saveScore } from '../../../leaderboard/gbleaderboard.js';
import { lcrenderLeaderboard, lcsaveToLeaderboard } from '../../../leaderboard/lcleaderboard.js';

export const diffSel = document.getElementById('diffSel');
export let timer = false;
export let winnerName;
export let gameName = 'slitherlink';
export let score = 0;

window.addEventListener('load', function () {
    const loading = document.getElementById('loading');
    loading.style.display = 'none';

    const svg = document.getElementById('board');
    const statusEl = document.getElementById('status');
    const timerEl = document.getElementById('timer-display');
    const canvas = document.getElementById('fireworksCanvas');

    const DOT_R = 0.4;
    const HIT_W = 6;
    const CELL = 10;
    let rows = 6, cols = 6, difficulty = 'easy';
    let puzzle = null; 
    let edgeState = {};
    let undoStack = [], redoStack = [];
    let SHOW_ERRORS = false;
    let SOUND_ON = true;
    let paused = false;
    let timeSec = 0, timerId = null;
    let player1 = localStorage.getItem('player_name') || 'Human1';
    setStatus('Click between dots to draw/remove line');

    function edgeKey(x1, y1, x2, y2) { 
        return `${x1},${y1}-${x2},${y2}`; 
    }
    
    function normalizeKey(k) { 
        const [a, b] = k.split('-'); 
        return a < b ? `${a}-${b}` : `${b}-${a}`; 
    }

    function setStatus(msg) { 
        statusEl.innerHTML = msg; 
    }

    function startTimer() {
        stopTimer();
        timerId = setInterval(() => {
            if (!paused) { timeSec++; renderTimer(); }
        }, 1000);
    }

    function stopTimer() {
        if (timerId) { clearInterval(timerId); timerId = null; }
    }

    function renderTimer() {
        const h = String(Math.floor(timeSec / 3600)).padStart(2, '0');
        const m = String(Math.floor((timeSec % 3600) / 60)).padStart(2, '0');
        const s = String(timeSec % 60).padStart(2, '0');
        timerEl.textContent = `${h}:${m}:${s}`;
    }

    let audioCtx = null;
    function beep(freq = 700, dur = 0.05) { 
        if (!SOUND_ON) return; 
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); const o = audioCtx.createOscillator(); 
        const g = audioCtx.createGain(); 
        o.frequency.value = freq; 
        o.connect(g); 
        g.connect(audioCtx.destination); 
        o.start(); 
        g.gain.setValueAtTime(0.1, audioCtx.currentTime); 
        g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur); 
        o.stop(audioCtx.currentTime + dur); }
    function winSound() { 
        beep(880, 0.15); 
        setTimeout(() => beep(1175, 0.15), 160); 
    }

    function drawBoard() {
        svg.innerHTML = '';
        svg.setAttribute('viewBox', `-2 -2 ${cols * CELL + 4} ${rows * CELL + 4}`);
        edgeState = {};
        lcrenderLeaderboard
        // dots
        for (let r = 0; r <= rows; r++)for (let c = 0; c <= cols; c++) {
            const dot = document.createElementNS(svg.namespaceURI, 'circle');
            dot.setAttribute('cx', c * CELL); dot.setAttribute('cy', r * CELL);
            dot.setAttribute('r', DOT_R); dot.setAttribute('fill', 'black');
            svg.appendChild(dot);
        }

        // numbers
        for (let r = 0; r < rows; r++)for (let c = 0; c < cols; c++) {
            const n = puzzle.numbers[r][c]; if (n == null) continue;
            const t = document.createElementNS(svg.namespaceURI, 'text');
            t.textContent = n; t.setAttribute('x', c * CELL + CELL / 2); t.setAttribute('y', r * CELL + CELL / 2);
            t.setAttribute('class', 'cell-number'); t.dataset.r = r; t.dataset.c = c;
            svg.appendChild(t);
        }

        // edges (horizontal)
        for (let r = 0; r <= rows; r++)for (let c = 0; c < cols; c++) makeEdge(c, r, c + 1, r);
        // edges (vertical)
        for (let r = 0; r < rows; r++)for (let c = 0; c <= cols; c++) makeEdge(c, r, c, r + 1);
    }

    function makeEdge(x1, y1, x2, y2) {
        const key = edgeKey(x1, y1, x2, y2); edgeState[key] = 0;

        // visible line
        const line = document.createElementNS(svg.namespaceURI, 'line');
        line.setAttribute('x1', x1 * CELL); line.setAttribute('y1', y1 * CELL);
        line.setAttribute('x2', x2 * CELL); line.setAttribute('y2', y2 * CELL);
        line.setAttribute('stroke-width', 0.8); line.setAttribute('stroke', 'transparent');
        line.dataset.key = key; svg.appendChild(line);

        // hit area
        const hit = document.createElementNS(svg.namespaceURI, 'line');
        hit.setAttribute('x1', x1 * CELL); hit.setAttribute('y1', y1 * CELL);
        hit.setAttribute('x2', x2 * CELL); hit.setAttribute('y2', y2 * CELL);
        hit.setAttribute('stroke-width', HIT_W); hit.setAttribute('stroke', 'transparent');
        hit.style.cursor = 'pointer'; hit.dataset.key = key;

        // tap / click
        hit.addEventListener('click', () => toggleEdge(key));

        // long-press = cross (mobile)
        let lp = null;
        hit.addEventListener('pointerdown', () => { lp = setTimeout(() => { setCross(key); }, 500); });
        hit.addEventListener('pointerup', () => clearTimeout(lp));
        hit.addEventListener('pointerleave', () => clearTimeout(lp));

        svg.appendChild(hit);
    }

    function getLineByKey(key) { 
        return [...svg.querySelectorAll('line')].find(l => l.dataset.key === key && l.getAttribute('stroke-width') == '0.8'); 
    }

    function toggleEdge(key) {
        saveUndo(); 
        beep(); 
        const st = edgeState[key];
        if (st === 0) { 
            edgeState[key] = 1; 
            paintLine(key); 
        } else if (st === 1) { 
            edgeState[key] = 2; 
            clearLine(key); 
            drawCross(key); 
        } else { 
            edgeState[key] = 0; 
            removeCross(key); 
        }
        autoCrossNumbers(); 
        reEvaluateErrors(); 
        checkWin();
    }

    function paintLine(key) { 
        const ok = isEdgeValid(key); 
        const line = getLineByKey(key); 
        line.setAttribute('stroke', ok ? getCss('--line') : getCss('--bad')); 
        playSound("click");
    }

    function clearLine(key) { 
        const line = getLineByKey(key); 
        line.setAttribute('stroke', 'transparent'); 
        playSound("click");
    }

    function setCross(key) { 
        if (edgeState[key] === 2) return; 
        saveUndo(); 
        edgeState[key] = 2; 
        clearLine(key); 
        drawCross(key); 
        playSound("click");
    }

    function drawCross(key) {
        const [a, b] = key.split('-'); 
        const [x1, y1] = a.split(',').map(n => n * CELL); 
        const [x2, y2] = b.split(',').map(n => n * CELL); 
        const cx = (x1 + x2) / 2, cy = (y1 + y2) / 2;
        [[-0.5, -0.5, 0.5, 0.5], [-0.5, 0.5, 0.5, -0.5]].forEach(d => { 
            const l = document.createElementNS(svg.namespaceURI, 'line'); 
            l.setAttribute('x1', cx + d[0]); 
            l.setAttribute('y1', cy + d[1]); 
            l.setAttribute('x2', cx + d[2]); 
            l.setAttribute('y2', cy + d[3]); 
            l.setAttribute('stroke', getCss('--cross')); l.setAttribute('stroke-width', 0.5); 
            l.dataset.cross = key; 
            svg.appendChild(l); 
        });
    }

    function removeCross(key) { 
        svg.querySelectorAll(`[data-cross="${key}"]`).forEach(e => e.remove()); 
    }

    function isEdgeValid(key) {
        if (!SHOW_ERRORS) return true;
        // vertex degree
        const [a, b] = key.split('-'); let da = 0, db = 0;
        for (const k in edgeState) if (edgeState[k] === 1) { if (k.includes(a)) da++; if (k.includes(b)) db++; }
        if (da > 2 || db > 2) return false;
        // cell exceed
        for (const cell of edgeToCells(key)) {
            const need = puzzle.numbers[cell.r][cell.c]; if (need == null) continue;
            if (countCellEdges(cell.r, cell.c) > need) return false;
        }
        return true;
    }

    function reEvaluateErrors() {
        for (const k in edgeState) if (edgeState[k] === 1) paintLine(k);
        highlightWrongNumbers();
    }

    function highlightWrongNumbers() {
        svg.querySelectorAll('.cell-number').forEach(t => {
            const r = +t.dataset.r, c = +t.dataset.c; const need = puzzle.numbers[r][c];
            const bad = SHOW_ERRORS && countCellEdges(r, c) > need;
            t.setAttribute('fill', bad ? getCss('--bad') : getCss('--fg'));
        });
    }

    function edgeToCells(key) {
        const [a, b] = key.split('-'); const [x1, y1] = a.split(',').map(Number); const [x2, y2] = b.split(',').map(Number); const cells = [];
        if (y1 === y2) { // horizontal
            const y = y1; const x = Math.min(x1, x2);
            if (y > 0) cells.push({ r: y - 1, c: x }); if (y < rows) cells.push({ r: y, c: x });
        } else { // vertical
            const x = x1; const y = Math.min(y1, y2);
            if (x > 0) cells.push({ r: y, c: x - 1 }); if (x < cols) cells.push({ r: y, c: x });
        }
        return cells;
    }

    function countCellEdges(r, c) {
        let n = 0;
        if (edgeState[edgeKey(c, r, c + 1, r)] === 1) n++;
        if (edgeState[edgeKey(c, r + 1, c + 1, r + 1)] === 1) n++;
        if (edgeState[edgeKey(c, r, c, r + 1)] === 1) n++;
        if (edgeState[edgeKey(c + 1, r, c + 1, r + 1)] === 1) n++;
        return n;
    }

    function autoCrossNumbers() {
        for (let r = 0; r < rows; r++)for (let c = 0; c < cols; c++) {
            const need = puzzle.numbers[r][c]; if (need == null) continue;
            const drawn = countCellEdges(r, c);
            if (drawn === need) { // cross remaining edges of THIS cell only
                const edges = [
                    edgeKey(c, r, c + 1, r), edgeKey(c, r + 1, c + 1, r + 1),
                    edgeKey(c, r, c, r + 1), edgeKey(c + 1, r, c + 1, r + 1)
                ];
                edges.forEach(k => { if (edgeState[k] === 0) { edgeState[k] = 2; drawCross(k); } });
            }
        }
    }

    function saveUndo() { 
        undoStack.push(JSON.stringify(edgeState)); 
        if (undoStack.length > 200) undoStack.shift(); redoStack.length = 0; 
    }

    function undo() { 
        if (!undoStack.length) return; 
        redoStack.push(JSON.stringify(edgeState)); edgeState = JSON.parse(undoStack.pop());
        redrawFromState(); 
        setStatus(`Undo last action <br> Click between dots to draw/remove line`);
    }

    function redo() { 
        if (!redoStack.length) return; 
        undoStack.push(JSON.stringify(edgeState));
        edgeState = JSON.parse(redoStack.pop());
        redrawFromState(); 
        setStatus(`Redo last action <br> Click between dots to draw/remove line`);
    }

    function redrawFromState() { 
        svg.querySelectorAll('[data-cross]').forEach(e => e.remove()); 
        for (const k in edgeState) { 
            if (edgeState[k] === 1) paintLine(k); else clearLine(k); 
            if (edgeState[k] === 2) drawCross(k); 
        } 
        reEvaluateErrors(); 
    }

    function checkErrors() {
        let err = 0;
        for (const k in edgeState) if (edgeState[k] === 1 && !isEdgeValid(k)) err++;
        svg.querySelectorAll('.cell-number').forEach(t => { 
            const r = +t.dataset.r, c = +t.dataset.c;
            if (countCellEdges(r, c) > puzzle.numbers[r][c]) err++; 
        });
        setStatus(err ? `${err} errors found` : 'No errors');
    }

    function checkWin() {
        // numbers satisfied
        for (let r = 0; r < rows; r++)for (let c = 0; c < cols; c++) {
            const n = puzzle.numbers[r][c];
            if (n != null && countCellEdges(r, c) !== n) return;
        }
        // vertex degree 0 or 2 and single loop
        const deg = {};
        const edges = [];
        for (const k in edgeState) if (edgeState[k] === 1) { edges.push(k); const [a, b] = k.split('-'); deg[a] = (deg[a] || 0) + 1; deg[b] = (deg[b] || 0) + 1; }
        for (const v in deg) if (!(deg[v] === 2)) return;
        // connectivity
        const adj = {}; 
        edges.forEach(k => { 
            const [a, b] = k.split('-'); 
            (adj[a] = adj[a] || []).push(b); 
            (adj[b] = adj[b] || []).push(a); 
        });
        const seen = new Set(); 
        const stack = [edges[0]?.split('-')[0]]; 
        while (stack.length) { 
            const v = stack.pop(); 
            if (!v || seen.has(v)) continue; 
            seen.add(v); 
            (adj[v] || []).forEach(n => stack.push(n)); 
        }
        if (seen.size !== Object.keys(deg).length) return;

        stopTimer();
        winnerName = player1;
        setStatus(`${winnerName} Wins!`); 
        playSound('win');
        updateleaderboard();
        launchFireworks();
        showWinText();
        setTimeout(() => {
            shareScore(gameName, score);
          }, 3000);
    }

    function generatePuzzle() { 
        puzzle = generateSlitherlink(rows, cols, difficulty); 
        console.log("puzzle", puzzle);
        timeSec = 0; 
        renderTimer(); 
        startTimer(); 
        undoStack.length = redoStack.length = 0; 
        drawBoard(); 
        setStatus('Click between dots to draw/remove line'); 
    }

    function generateSlitherlink(rows, cols, diff) { 
        let sol, nums; 
        do { sol = generateLoop(rows, cols); } 
        while (!validateLoop(sol)); 
        nums = deriveNumbers(sol, rows, cols, diff); 
        return { solution: sol, numbers: nums }; 
    }

    function generateLoop(rows, cols) {
        const edges = new Set(); 
        const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]]; 
        let x = Math.floor(Math.random() * cols), y = Math.floor(Math.random() * rows); 
        const start = `${x},${y}`; 
        let cur = start;
        for (let i = 0; i < rows * cols * 4; i++) { 
            const [dx, dy] = dirs[Math.floor(Math.random() * 4)]; 
            const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx > cols || ny > rows) continue; 
            const a = `${x},${y}`, b = `${nx},${ny}`; 
            const e = normalizeKey(`${a}-${b}`); 
            if (edges.has(e)) break; 
            edges.add(e); 
            x = nx; 
            y = ny; 
            cur = `${x},${y}`; 
            if (cur === start && edges.size > 4) break; 
        }
        return [...edges];
    }

    function validateLoop(edges) { 
        if (!edges.length) return false; 
        const deg = {}; 
        edges.forEach(e => { const [a, b] = e.split('-'); deg[a] = (deg[a] || 0) + 1; deg[b] = (deg[b] || 0) + 1; }); 
        for (const v in deg) if (deg[v] !== 2) return false; 
        const adj = {}; 
        edges.forEach(e => { const [a, b] = e.split('-'); (adj[a] = adj[a] || []).push(b); (adj[b] = adj[b] || []).push(a); }); 
        const seen = new Set(); 
        const st = [edges[0].split('-')[0]]; 
        while (st.length) { 
            const v = st.pop(); if (seen.has(v)) continue; seen.add(v); (adj[v] || []).forEach(n => st.push(n)); 
        } 
        return seen.size === Object.keys(deg).length; 
    }

    function deriveNumbers(edges, rows, cols, diff) {
        const set = new Set(edges); 
        const nums = Array.from({ length: rows }, () => Array(cols).fill(null)); 
        const rules = { easy: { maxZero: 1, allow: [0, 1, 2] }, medium: { maxZero: 1, allow: [0, 1, 2] }, hard: { maxZero: 1, allow: [0, 1, 2, 3] }, expert: { maxZero: 1, allow: [0, 1, 2, 3] } }[diff]; 
        let zeros = 0;
        function has(a, b) { return set.has(normalizeKey(`${a}-${b}`)); }
        for (let r = 0; r < rows; r++)for (let c = 0; c < cols; c++) {
            let cnt = 0; 
            if (has(`${c},${r}`, `${c + 1},${r}`)) cnt++; 
            if (has(`${c},${r + 1}`, `${c + 1},${r + 1}`)) cnt++; 
            if (has(`${c},${r}`, `${c},${r + 1}`)) cnt++; 
            if (has(`${c + 1},${r}`, `${c + 1},${r + 1}`)) cnt++;
            if (cnt === 4) cnt = 3; if (!rules.allow.includes(cnt)) continue; 
            if (cnt === 0) { if (zeros >= rules.maxZero) continue; zeros++; }
            nums[r][c] = cnt;
        }
        return nums;
    }

    const sizeSel = document.getElementById('sizeSel');
    [[4, 4], [6, 6], [7, 7], [8, 8], [9, 9], [10, 10], [12, 12], [14, 14], [15, 15], [16, 16], [18, 18], [20, 20], [21, 21], [22, 22], [24, 24], [25, 25], [25, 30]].forEach(s => { 
        const o = document.createElement('option'); 
        o.value = `${s[0]}x${s[1]}`; 
        o.textContent = `${s[0]}×${s[1]}`; 
        sizeSel.appendChild(o); 
    }); 
    sizeSel.value = '6x6';

    document.getElementById('newBtn').onclick = () => { generatePuzzle(); };
    document.getElementById('resetBtn').onclick = () => { 
        drawBoard();
        setStatus('Rest Board Play same game again <br> Click between dots to draw/remove line');  
    };

    document.getElementById('solveBtn').onclick = () => { 
        SHOW_ERRORS = false; 
        for (const k in edgeState) { 
            edgeState[k] = 0; 
            clearLine(k); 
            removeCross(k); 
        } 
        puzzle.solution.forEach(e => { 
            const k = normalizeKey(e); 
            edgeState[k] = 1; 
            paintLine(k); 
        }); 
        stopTimer(); 
        setStatus(`Puzzle Solved (game lost) <br> Press new Game play New Game`); 
    };

    document.getElementById('checkBtn').onclick = checkErrors;
    document.getElementById('undoBtn').onclick = undo;
    document.getElementById('redoBtn').onclick = redo;
        setStatus('Click between dots to draw/remove line'); 
    document.getElementById('pauseBtn').onclick = () => { paused = !paused; 
        if(document.getElementById('pauseBtn').textContent = paused){
            document.getElementById('pauseBtn').textContent = 'Resume';
            setStatus('Game Paused!, Press Resume to Resume');
        } else {
            document.getElementById('pauseBtn').textContent = 'Pause';
            setStatus('Click between dots to draw/remove line');
        }
    };
    document.getElementById('toggle-sound').onchange = e => { SOUND_ON = e.target.checked; };
    document.getElementById('errorToggle').onchange = e => { SHOW_ERRORS = e.target.checked; reEvaluateErrors(); 
    // 2. Label text बदलना (last child क्योंकि text input के बाद है)
    const label = e.target.parentElement;
    label.lastChild.textContent = SHOW_ERRORS ? " Show Errors" : " Hide Errors";
        };
    sizeSel.onchange = e => { 
        const [r, c] = e.target.value.split('x').map(Number); 
        rows = r; 
        cols = c; 
        setStatus(`Size change to ${rows}x${cols} <br> Click between dots to draw/remove line`);
        generatePuzzle(); 
    };

    document.getElementById('diffSel').onchange = e => { 
        difficulty = e.target.value;
        setStatus(`Difficulty change to ${difficulty} <br> Click between dots to draw/remove line`);
        generatePuzzle(); 
    };

    function getCss(v) { return getComputedStyle(document.documentElement).getPropertyValue(v); }

    // init
    rows = 6; cols = 6; difficulty = 'easy'; generatePuzzle();

    function updateleaderboard() {
        winnerName = player1;
        let opponent = "-";
        let game_id = 'slitherlink';
        let gsize = `${rows}x${cols}`;
        let elapsed = timeSec;
        let gameCount = undoStack.length;
        let filed1 = 0;
        let filed2 = 0
        let filed3 = "Player vs Computer";
        let filed4 = "-";
        let email = localStorage.getItem('email') || '-';
        const created_at = new Date();
        score = (rows * cols - history.length) * 10 + 100;

        if (difficulty == "esay") {
            score = (rows * cols * 100 - gameCount * 1 - Number(elapsed) + gameCount * 10) * 1;
        } else if (difficulty == "medium") {
            score = (rows * cols * 100 - gameCount * 1 - Number(elapsed) + gameCount * 10) * 1.5;
        } else if (difficulty == "hard") {
            score = (rows * cols * 100 - gameCount * 1 - Number(elapsed) + gameCount * 10) * 2;
        } else if (difficulty == "expert") {
            score = (rows * cols * 100 - gameCount * 1 - Number(elapsed) + gameCount * 10) * 2.5;
        }

        lcsaveToLeaderboard(winnerName, opponent, email, gsize, difficulty, game_id, score, elapsed, gameCount, filed1, filed2, filed3, filed4, created_at)

        saveScore(winnerName, opponent, email, gsize, difficulty, game_id, score, elapsed, gameCount, filed1, filed2, filed3, filed4, created_at);
    }

    document.addEventListener('DOMContentLoaded', () => {
        lcrenderLeaderboard();
    });
});