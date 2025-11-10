        import { updateTimer } from './timer.js';
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

        const colorList = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#fa8072", "#FF4500", "#8b0000", "#008000", "#006400", "#9acd32", "#008080", "#000080", "#00bfff", "#ffd700", "#bdb76b", "#00ced1", "#7fffd4", "#ee82ee", "#9932cc", "#800080", "#9370db",  "#800000", "#A52A2A", "#808000", "#FFC0CB", "#c71585", "#ff1493", "#ff69b4", "#FFA500", "#ff7f50", "#000000", "#808080", "#C0C0C0", "#2f4f4f", "#696969"];

        document.getElementById('output').textContent = "Please Click on slot to select/change your secreate colors and press Start solver";

        const output = document.getElementById('output');
        // export const timerDisplay = document.getElementById('timer-display');

        function el(q) {
            return document.querySelector(q)
        }

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

        //display colors
        function renderPalette() {
            paletteEl.innerHTML = '';
            colors.forEach((c, idx) => {
                const b = document.createElement('button');
                b.className = 'colorBtn';
                b.style.background = c;
                b.textContent = idx; 
                b.style.color = '#fff'; 
                b.style.textShadow='0 0.1vw 0.2vw rgba(0,0,0,.6)'; 
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
                secret[i] = null; renderSecret(); return
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
                if (secret[i] === null) s.classList.add('empty');
                else {
                    s.style.background = colors[secret[i]];
                    s.textContent = colors.indexOf(colors[secret[i]]); 
                    s.style.color = '#fff'; 
                    s.style.textShadow='0 0.1vw 0.2vw rgba(0,0,0,.6)'; 
                    s.style.fontWeight = 'bold'; 
                    s.style.display = 'grid'; 
                    s.style.textAlign = 'center'; 
                    s.style.alignItems = 'center'; 
                }
                s.onclick = () => {
                    playSound('beep');
                    let next = (secret[i] === null) ? 0 : (secret[i] + 1) % nColors;
                    if (!allowDuplicates) {
                        let tries = 0;
                        while (tries < nColors && secret.includes(next) && secret[i] !== next) {
                            next = (next + 1) % nColors; tries++
                        }
                        if (tries >= nColors) return
                    }
                    setSecretSlot(i, next)
                };
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

        // get feedback
        function feedbackForGuess(guess) {
            let blacks = 0;
            const sCopy = [], gCopy = [];
            for (let i = 0; i < slots; i++) {
                if (guess[i] === secret[i]) blacks++;
                else {
                    sCopy.push(secret[i]); gCopy.push(guess[i])
                }
            }
            let whites = 0;
            const counts = {};
            sCopy.forEach(c => counts[c] = (counts[c] || 0) + 1);
            gCopy.forEach(c => {
                if (counts[c]) {
                    whites++; counts[c]--
                }
            });
            return { black: blacks, white: whites }
        }

        // display guess and feedback
        function renderGuessRow(guess, fb) {
            const row = document.createElement('div');
            row.className = 'guessBoard';
            guess.forEach(c => {
                const peg = document.createElement('div');
                peg.className = 'slot';
                peg.textContent = colors.indexOf(colors[c]); 
                peg.style.width = 'var(--peg-size)'; 
                peg.style.height = 'var(--peg-size)'; 
                peg.style.borderRadius = '0.6vw'; 
                peg.style.color = '#fff'; 
                peg.style.textShadow='0 0.1vw 0.2vw rgba(0,0,0,.6)'; 
                peg.style.fontSize = '1.6vw';
                peg.style.fontWeight = 'bold'; 
                peg.style.display = 'grid'; 
                peg.style.textAlign = 'center'; 
                peg.style.alignItems = 'center'; 
                if(c === null || c === -1){
                    peg.classList.add('empty'); 
                } else {
                    peg.style.background = colors[c];
                }
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
            el('#slots').oninput = () => {
                slots = parseInt(el('#slots').value);
                // el('#slotsShow').textContent = slots; 
                // log("no of Slots are " + slots);
                initSecret();
            };
            el('#colors').oninput = () => {
                nColors = parseInt(el('#colors').value);
                // log(`no of Colors are ${nColors}`);
                generateColors();
                initSecret()
            };
            el('#buttonDuplicate').onchange = () => {
                allowDuplicates = el('#buttonDuplicate').checked; initSecret();
                if (allowDuplicates){
                    // log('allow Duplicates Colors');
                    textToSpeechEng('allow Duplicates Colors');
                } else {
                    textToSpeechEng('Duplicates Colors not allowed');
                    // log('Duplicates Colors not allowed');
                }
            };
            el('#resetSecret').onclick = () => {
                initSecret(); 
                textToSpeechEng('Reset secrate Colors');
                // log('Secret reset');
            }; el('#randomSecret').onclick = () => {
                textToSpeechEng('random secrate Colors');
                randomSecret(); 
                renderSecret(); 
                // log('Random secret chosen');
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
            updateTimer();

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
            // Phase 1: Probe each color, stop when all slots accounted for
            for (let c = 0; c < nColors; c++) {
                const guess = new Array(slots).fill(c);
                const fb = feedbackForGuess(guess);
                colorCounts[c] = fb.black;
                // totalBlackCount += fb.black;
                // log(`Probe color ${c} => B=${fb.black},W=${fb.white}`);
                renderGuessRow(guess, fb);
                await sleep(400);

                if (fb.black === slots) {
                    // Found the full secret in one guess
                    const msgColors = document.createElement('div');
                    msgColors.textContent = 'Colors found';
                    msgColors.style.fontWeight = 'bold';
                    msgColors.style.margin = '8px 0';
                    visualEl.appendChild(msgColors);
                    renderGuessRow(new Array(slots).fill(c), { black: slots, white: 0 });

                    const msgSecret = document.createElement('div');
                    msgSecret.textContent = 'Secret code found';
                    msgSecret.style.fontWeight = 'bold';
                    msgSecret.style.margin = '8px 0';
                    visualEl.appendChild(msgSecret);
                    renderGuessRow(new Array(slots).fill(c), fb);

                    solverRunning = false;
                    return;
                }
                if (colorCounts.reduce((a, b) => a + b, 0) >= slots) break;
            }

            const totalFound = colorCounts.reduce((a, b) => a + b, 0);
            if (totalFound >= slots) {
                // Visual message for colors found
                const msgRow = document.createElement('div');
                msgRow.textContent = 'Colors found';
                msgRow.style.fontWeight = 'bold';
                msgRow.style.margin = '8px 0';
                visualEl.appendChild(msgRow);

                const foundColors = [];
                for (let c = 0; c < nColors; c++) if (colorCounts[c] > 0) foundColors.push(c);
                renderGuessRow(foundColors, { black: 0, white: 0 });
                await sleep(600);
            }

            // log('Phase1 complete:', colorCounts.join(','));
            renderGuessRow(secret.map(s => s), {
                black: 0, white: 0
            });
            await sleep(800);

            // Phase 2: find position of Only colors found in Phase 1
            const present = [];
            for (let c = 0; c < nColors; c++)if (colorCounts[c] > 0) present.push({ c, count: colorCounts[c] });

            let filler = colorCounts.findIndex(x => x === 0);
            if (filler === -1) filler = present[0].c;

            const assign = new Array(slots).fill(null);
            let remaining = colorCounts.slice();

            function baseline(assignArr) {
                const g = assignArr.map(v => v === null ? filler : v);
                return feedbackForGuess(g).black
            }

            for (let pos = 0; pos < slots; pos++) {
                if (assign[pos] !== null) continue;
                const base = baseline(assign);
                for (let k = 0; k < nColors; k++) {
                    if (remaining[k] === 0) continue;
                    const test = assign.slice();
                    test[pos] = k;
                    const g = test.map(v => v === null ? filler : v);
                    const fb = feedbackForGuess(g);
                    renderGuessRow(g, fb);
                    await sleep(300);
                    if (fb.black > base) {
                        assign[pos] = k;
                        remaining[k]--;
                        break
                    }
                }
            }
            // Visual message for secret found
            const msgRow2 = document.createElement('div');
            msgRow2.textContent = 'your Secret colors code is as under';
            msgRow2.style.fontWeight = 'bold';
            msgRow2.style.margin = '8px 0';
            visualEl.appendChild(msgRow2);

            // log('Phase2 complete - Secret code found');
            renderGuessRow(assign,
            feedbackForGuess(assign));
            output.textContent = 'Solved';
            textToSpeechEng('Solved');
            solverRunning = false;
            timer = false;
        }

        function sleep(ms) {
            return new Promise(r => setTimeout(r, ms))
        }

        //toggle theme
        document.getElementById("dark").addEventListener("click", () => {
            document.body.classList.toggle("dark");
            if (document.body.classList.contains("dark")) {
                document.getElementById("dark").innerText = "☀️ Light";
                textToSpeechEng('Theme Dark');
            } else {
                document.getElementById("dark").innerText = "🌙 Dark";
                textToSpeechEng('Theme Light');
            }
        });