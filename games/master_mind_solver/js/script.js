import { startTimer } from './timer.js';
import { playSound } from './sound.js';
import { textToSpeechEng } from './speak.js';

// define variables
export let timer = false;

let slots = 4;
let nColors = 6;
let colors = [];
let secret = [];
let solverRunning = false;
let allowDuplicates = true;
let logsEl, secretBoardEl, paletteEl, visualEl;
const el = q => document.querySelector(q);
// function el(q) {
//     return document.querySelector(q)
// }

const colorList = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#fa8072", "#FF4500", "#8b0000", "#008000", "#006400", "#9acd32", "#008080", "#000080", "#00bfff", "#ffd700", "#bdb76b", "#00ced1", "#7fffd4", "#ee82ee", "#9932cc", "#800080", "#9370db", "#800000", "#A52A2A", "#808000", "#FFC0CB", "#c71585", "#ff1493", "#ff69b4", "#FFA500", "#ff7f50", "#000000", "#808080", "#C0C0C0", "#2f4f4f", "#696969"];

document.getElementById('output').textContent = "Please Click on slot to select/change your secreate colors and press Start solver";

const output = document.getElementById('output');
// export const displayTime = document.getElementById('displayTime');

document.getElementById("buttonDuplicate").onchange = (e) => {
    allowDuplicates = e.target.checked;
    if (allowDuplicates) {
        textToSpeechEng(`Duplicate Colors`);
    } else {
        textToSpeechEng(`Unique Colors`);
    }
};

// choose colors from array
function generateColors() {
    colors = [];
    for (let i = 0; i < nColors; i++) {
        colors.push(colorList[i]);
    }
    renderPalette()
}

// display colors list
function renderPalette() {
    paletteEl.innerHTML = '';
    colors.forEach((c, idx) => {
        const b = document.createElement('button');
        b.className = 'colorBtn';
        b.style.background = c;
        b.textContent = idx;
        b.style.color = '#fff';
        b.style.textShadow = '0 0.1vw 0.2vw rgba(0,0,0,.6)';
        b.style.fontWeight = 'bold';
        b.style.display = 'grid';
        b.style.textAlign = 'center';
        b.style.alignItems = 'center';
        b.onclick = () => {
            const empty = secret.findIndex(s => s === null);
            if (empty !== -1) setSecretSlot(empty, idx)
        };
        paletteEl.appendChild(b)
    });
}

// remove previous selected secrate colors
function initSecret() {
    secret = new Array(slots).fill(null);
    renderSecret()
}

// set secrate colors
function setSecretSlot(i, colorIdx) {
    if (colorIdx === null) {
        secret[i] = null;
        renderSecret();
        return
    }
    if (!allowDuplicates) {
        if (secret.includes(colorIdx) && secret[i] !== colorIdx) return
    }
    secret[i] = colorIdx;
    playSound('beep');
    renderSecret()
}

// display secrate color in slot (select/change by click)
function renderSecret() {
    secretBoardEl.innerHTML = '';
    for (let i = 0; i < slots; i++) {
        const s = document.createElement('div');
        s.className = 'slot';
        s.setAttribute('role', 'button');
        s.setAttribute('aria-label', `Slot ${i + 1}`);
        if (secret[i] === null) {
            s.classList.add('empty')
        } else {
            s.style.background = colors[secret[i]]
            s.textContent = colors.indexOf(colors[secret[i]]);
            s.style.color = '#fff';
            s.style.textShadow = '0 0.1vw 0.2vw rgba(0,0,0,.6)';
            s.style.fontWeight = 'bold';
            s.style.display = 'grid';
            s.style.textAlign = 'center';
            s.style.alignItems = 'center';
        } // tap to cycle
        s.onclick = () => {
            playSound('beep');
            let next = (secret[i] === null) ? 0 : (secret[i] + 1) % nColors;
            if (!allowDuplicates) {
                let tries = 0;
                while (tries < nColors && secret.includes(next) && secret[i] !== next) {
                    next = (next + 1) % nColors; tries++;
                }
                if (tries >= nColors) return;
            }
            setSecretSlot(i, next)
        }
        // long press to clear for touch
        let holdT = null;
        s.ontouchstart = s.onpointerdown = () => {
            holdT = setTimeout(() => { setSecretSlot(i, null) }, 500)
        }
        s.ontouchend = s.onpointerup = s.onpointercancel = () => {
            if (holdT) clearTimeout(holdT)
        }
        secretBoardEl.appendChild(s)
    }
}

// display log
function log(...a) {
    const row = document.createElement('div');
    row.textContent = a.join(' ');
    logsEl.appendChild(row);
    logsEl.scrollTop = logsEl.scrollHeight
}

// display guess and feedback
function renderGuessRow(guess, fb) {
    const row = document.createElement('div');
    row.className = 'guessBoard';
    row.style.background = 'rgba(255,255,255,0.02)';
    guess.forEach(val => {
        const peg = document.createElement('div'); peg.className = 'slot';
        peg.style.width = 'var(--peg-size)';
        peg.style.height = 'var(--peg-size)';
        peg.style.borderRadius = '0.6vw';
        if (val === null || val === -1) {
            peg.classList.add('empty');
        } else { peg.style.background = colors[val]; }
        row.appendChild(peg)
    });
    const fbText = document.createElement('div');
    fbText.className = 'feedback';
    fbText.textContent = `B=${fb.black} W=${fb.white}`;
    row.appendChild(fbText);
    visualEl.appendChild(row);
    visualEl.scrollTop = visualEl.scrollHeight
}

// button listener
window.addEventListener('DOMContentLoaded', () => {
    logsEl = el('#log');
    secretBoardEl = el('#secretBoard');
    paletteEl = el('#palette');
    visualEl = el('#visualGuesses');
    const slotsInput = el('#slots'), colorsInput = el('#colors'), allowDupInput = el('#buttonDuplicate');
    slotsInput.oninput = () => {
        slots = parseInt(slotsInput.value);
        initSecret();
    };
    colorsInput.oninput = () => {
        nColors = parseInt(colorsInput.value);
        generateColors();
        initSecret()
    };
    allowDupInput.onchange = () => {
        allowDuplicates = allowDupInput.checked;
        initSecret();
        if (allowDuplicates) {
            textToSpeechEng('allow Duplicates Colors');
        } else {
            textToSpeechEng('Duplicates Colors not allowed');
        }
    };
    el('#resetSecret').onclick = () => {
        initSecret();
        textToSpeechEng('Reset secrate Colors');
    }; el('#randomSecret').onclick = () => {
        textToSpeechEng('random secrate Colors');
        randomSecret();
        renderSecret();
    };
    el('#startSolve').onclick = () => {
        startSolver()
    };
    generateColors();
    initSecret()
});

// select random secrate colors
function randomSecret() {
    secret = new Array(slots).fill(null);
    if (allowDuplicates) {
        for (let i = 0; i < slots; i++) secret[i] = Math.floor(Math.random() * nColors)
    } else {
        let colors = [...Array(nColors).keys()];
        for (let i = 0; i < slots; i++) {
            secret[i] = colors.splice(Math.floor(Math.random() * colors.length), 1)[0]
        }
    }
}

// solve 
async function startSolver() {
    timer = true;
    startTimer();

    if (solverRunning) return;
    if (secret.some(s => s === null)) {
        textToSpeechEng('Choose all slots secret colors');
        output.style.color = 'red';
        output.textContent = 'Choose all slots secret colors';
        // alert('Complete the secret');
        return
    }
    output.style.color = 'var(--text)';
    output.textContent = 'Solving';
    textToSpeechEng('Solving');
    solverRunning = true;
    logsEl.innerHTML = '';
    visualEl.innerHTML = '';
    // log('Solver started - Phase 1 single color in each slot');
    const colorCounts = new Array(nColors).fill(0);

    const triedMap = Object.create(null); // key -> {black,white}

    const keyOf = arr => arr.join(',');

    // for display guess and get feed back
    async function getUserFeedback(internalGuess) {
        const k = keyOf(internalGuess);
        if (triedMap[k]) {
            // log('(cached) feedback for', k, '=>', JSON.stringify(triedMap[k]));
            renderGuessRow(internalGuess.map(v => v === null ? null : v), triedMap[k]);
            return triedMap[k];
        }
        return new Promise(resolve => {
            const feedbackDiv = document.createElement('div');
            feedbackDiv.className = 'fb-row';
            feedbackDiv.style.padding = '0.6vw';
            feedbackDiv.style.border = '0.1vw solid rgba(255,255,255,.04)';
            feedbackDiv.style.borderRadius = '0.8vw';
            feedbackDiv.style.background = 'rgba(255,255,255,0.01)';
            feedbackDiv.style.justifyContent = 'space-between';
            feedbackDiv.style.flexWrap = 'wrap';

            // left: guess display
            const left = document.createElement('div'); left.style.display = 'flex';
            left.style.alignItems = 'center';
            left.style.gap = '0.6vw';

            internalGuess.forEach(col => {
                const s = document.createElement('div');
                s.className = 'fb-slot';
                if (col === null || col === -1) {
                    s.style.background = 'transparent';
                    s.textContent = '';
                    s.style.border = '0.1vw dashed rgba(255,255,255,.06)';
                } else {
                    s.style.background = colors[col];
                    s.textContent = col;
                    s.style.color = '#fff';
                    s.style.textShadow = '0 0.1vw 0.2vw rgba(0,0,0,.6)';
                    s.style.fontWeight = 'bold';
                    s.style.display = 'grid';
                    s.style.textAlign = 'center';
                    s.style.alignItems = 'center';
                }
                left.appendChild(s);
            });
            feedbackDiv.appendChild(left);

            // right: inputs
            const right = document.createElement('div'); right.style.display = 'flex';
            right.style.alignItems = 'center';
            right.style.gap = '0.6vw';
            const blackInput = document.createElement('input');
            blackInput.type = 'number';
            blackInput.inputMode = 'numeric';
            blackInput.className = 'fb-input'; blackInput.placeholder = 'Black';
            blackInput.min = 0; blackInput.max = slots;
            const whiteInput = document.createElement('input');
            whiteInput.type = 'number';
            whiteInput.inputMode = 'numeric';
            whiteInput.className = 'fb-input';
            whiteInput.placeholder = 'White';
            whiteInput.min = 0;
            whiteInput.max = slots;
            const submitBtn = document.createElement('button');
            submitBtn.className = 'fb-submit';
            submitBtn.textContent = 'OK';

            submitBtn.onclick = () => {
                const fb = { black: parseInt(blackInput.value, 10) || 0, white: parseInt(whiteInput.value, 10) || 0 };
                triedMap[k] = fb; // cache
                feedbackDiv.remove();
                renderGuessRow(internalGuess, fb);
                // log('User feedback for', k, '=>', JSON.stringify(fb));
                resolve(fb);
            };
            right.appendChild(blackInput);
            right.appendChild(whiteInput);
            right.appendChild(submitBtn);
            feedbackDiv.appendChild(right);

            visualEl.appendChild(feedbackDiv);
            // focus first input on mobile
            setTimeout(() => blackInput.focus(), 80);
        });
    }

    // Phase 1: Probe each color, stop when all slots accounted for
    for (let c = 0; c < nColors; c++) {
        const guess = new Array(slots).fill(c);
        const fb = await getUserFeedback(guess);
        colorCounts[c] = (fb.black || 0) + (fb.white || 0);

        if ((fb.black || 0) === slots) {
            // Found the full secret in one guess
            const msgColors = document.createElement('div');
            msgColors.textContent = 'Colors found';
            msgColors.style.fontWeight = 'bold';
            visualEl.appendChild(msgColors);
            renderGuessRow(guess, fb);

            const msgSecret = document.createElement('div');
            msgSecret.textContent = 'Secret code found';
            msgSecret.style.fontWeight = 'bold';
            visualEl.appendChild(msgSecret);

            solverRunning = false;
            return;
        }
        if (colorCounts.reduce((a, b) => a + b, 0) >= slots) break;
        await sleep(120);
    }

    // Phase 2: find position of Only colors found in Phase 1
    const present = [];
    for (let c = 0; c < nColors; c++) {
        if (colorCounts[c] > 0) present.push({ c, count: colorCounts[c] });
    }

    if (present.length === 0) { log('No colors found in Phase1'); solverRunning = false; return; }

    // show found colors
    const foundMsg = document.createElement('div'); foundMsg.textContent = 'Colors found';
    foundMsg.style.fontWeight = '700';
    visualEl.appendChild(foundMsg);
    const foundArr = [];
    for (const p of present) for (let k = 0; k < p.count; k++) foundArr.push(p.c);
    renderGuessRow(foundArr, { black: 0, white: 0 });
    await sleep(300);

    // ----- Phase 2: determine positions using only present colors -----
    // pick filler that's NOT in present if possible
    let filler = colorCounts.findIndex(x => x === 0);
    if (filler === -1) filler = present[0].c;

    const assign = new Array(slots).fill(null);
    let remaining = colorCounts.slice();

    async function getBaseline(assignArr) {
        const internal = assignArr.map(v => v === null ? filler : v);
        const fb = await getUserFeedback(internal);
        return fb.black || 0;
    }

    for (let pos = 0; pos < slots; pos++) {
        if (assign[pos] !== null) continue;
        const base = await getBaseline(assign);
        // build candidate list (colors with remaining > 0) and randomize order
        let candidates = present.map(p => p.c).filter(c => remaining[c] > 0);
        shuffle(candidates);

        for (const c of candidates) {
            // test placing c at pos
            const testAssign = assign.slice();
            testAssign[pos] = c;
            const internalGuess = testAssign.map(v => v === null ? filler : v);

            // skip if we've already asked this exact internal guess
            const k = keyOf(internalGuess);
            if (triedMap[k]) {
                // log('Skipping already-known guess', k);
                const cached = triedMap[k];
                if ((cached.black || 0) > base) { assign[pos] = c; remaining[c]--; break; }
                else continue;
            }

            const fb = await getUserFeedback(internalGuess);
            await sleep(80);
            if ((fb.black || 0) > base) {
                assign[pos] = c;
                remaining[c]--;
                break;
            }
        }
    }

    // fill any remaining unassigned slots using remaining counts
    for (let i = 0; i < slots; i++) {
        if (assign[i] === null) {
            const idx = remaining.findIndex(x => x > 0);
            if (idx !== -1) { assign[i] = idx; remaining[idx]--; }
            else assign[i] = filler;
        }
    }

    // final verification / display
    const finalInternal = assign.map(v => v === null ? filler : v);
    const finalFb = await getUserFeedback(finalInternal);
    const finalMsg = document.createElement('div'); finalMsg.textContent = 'Secret code found';
    finalMsg.style.fontWeight = '700';
    visualEl.appendChild(finalMsg);

    // log('Phase2 complete - Secret code found');
    renderGuessRow(assign, finalFb);
    output.textContent = 'Solved';
    textToSpeechEng('Solved');
    solverRunning = false;
    timer = false;
    clearInterval(timerInterval);
}

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms))
}

// shuffle helper
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
}

//toggle theme
const themeToggle = document.getElementById('toggle-theme');
function setTheme(t) {
  if (t === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('rg_theme', t);
    themeToggle.textContent = '☀️ Light'
  }
  if (t === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('rg_theme', t);
    themeToggle.textContent = '🌙 Dark'
  }
}
if (themeToggle) themeToggle.addEventListener('click', () => setTheme(localStorage.getItem('rg_theme') === 'dark' ? 'light' : 'dark'));
setTheme(localStorage.getItem('rg_theme') === 'dark' ? 'dark' : 'light');
