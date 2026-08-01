import { startTimer, seconds, minutes, hours, timerInterval } from './timer.js';
import { launchFireworks } from './edgeFireWorks.js';
import { playSound } from './sound.js';
import { textToSpeechEng } from './speak.js';
import { shareScore } from './share.js';
// import { saveScore } from '../../../leaderboard/gbleaderboard.js';
import { lcrenderLeaderboard, lcsaveToLeaderboard } from '../../../leaderboard/lcleaderboard.js';
// to add firebase leaderboard
import { db } from "../../../leaderboard/firebase-config.js";
import { addDoc, collection, serverTimestamp } from
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export let timer = false;
export let gameName = 'mastermind';
export let score = 0;
export let slotCount = 4;
export let colorCount = 6;
export let maxAttempts = 10;
export let attemptsLeft = 0;
export let allowDuplicates = true;
export let player1 = localStorage.getItem('player_name') || 'Human1';

window.addEventListener('load', function () {
    const loading = document.getElementById('loading');
    loading.style.display = 'none';

    let colors = [];
    let secretCode = [];
    let currentGuess = [];
    let guesses = [];
    let gameOver = false;
    let difficulty = "-";

    function finddifficulty() {
        if (slotCount < 3) {
            if (colorCount < 4) { difficulty = 'very easy'; }
            else if (colorCount < 7) { difficulty = 'easy'; }
            else if (colorCount < 9) { difficulty = 'medium'; }
            else if (colorCount < 11) { difficulty = 'hard'; }
            else if (colorCount < 16) { difficulty = 'very hard'; }
            else { difficulty == 'expert'; }
        }
        else if (slotCount < 5) {
            if (colorCount < 7) { difficulty = 'easy'; }
            else if (colorCount < 9) { difficulty = 'medium'; }
            else if (colorCount < 11) { difficulty = 'hard'; }
            else if (colorCount < 16) { difficulty = 'very hard'; }
            else { difficulty == 'expert'; }
        }
        else if (slotCount < 7) {
            if (colorCount < 9) { difficulty = 'medium'; }
            else if (colorCount < 11) { difficulty = 'hard'; }
            else if (colorCount < 16) { difficulty = 'very hard'; }
            else { difficulty == 'expert'; }
        }
        else if (slotCount < 9) {
            if (colorCount < 11) { difficulty = 'hard'; }
            else if (colorCount < 16) { difficulty = 'very hard'; }
            else { difficulty = 'expert'; }
        }
        else if (slotCount < 11) {
            if (colorCount < 16) { difficulty = 'very hard'; }
            else { difficulty = 'expert'; }
        } else { difficulty = 'expert'; }
        document.getElementById("diffcultydisplay").textContent = difficulty;
    }

    const colorList = ["#FF0000", "#8b0000", "#fa8072", "#00FF00",
        "#008000", "#006400", "#9acd32", "#008080", "#0000FF", "#000080",
        "#00bfff", "#FFFF00", "#ffd700", "#bdb76b", "#00FFFF", "#00ced1",
        "#7fffd4", "#FF00FF", "#ee82ee", "#9932cc", "#800080", "#9370db",
        "#800000", "#A52A2A", "#808000", "#FFC0CB", "#c71585", "#ff1493",
        "#ff69b4", "#FFA500", "#FF4500", "#ff7f50", "#000000", "#808080",
        "#C0C0C0", "#2f4f4f", "#696969"];

    document.getElementById('output').textContent = "Please Select slots/colors/Duplicates/attempts, then Press New Game to play";

    const visualEl = document.getElementById('visualGuesses');
    const secretBoardEl = document.getElementById('secretBoard');
    const canvas = document.getElementById('fireworksCanvas');
    const ctx = canvas.getContext('2d');

    const slotInputBtn = document.getElementById("slotInput");
    const colorCountBtn = document.getElementById("colorInput");
    const maxAttemptsBtn = document.getElementById("maxAttempts");

    document.getElementById("buttonDuplicate").onchange = (e) => {
        allowDuplicates = e.target.checked;
        if (allowDuplicates) {
            textToSpeechEng(`Duplicate Colors`);
        } else if (slotCount > colorCount) {
            textToSpeechEng(`Duplicate Colors due less then slots`);
        } else {
            textToSpeechEng(`Unique Colors`);
        }
    };

    document.getElementById("buttonStart").onclick = startGame;
    document.getElementById("undo-last").onclick = undoLastMove;
    document.getElementById("buttonEnd").onclick = endGameManually;

    function generateColors(count) {
        const arr = [];
        for (let i = 0; i < count; i++) {
            arr.push(colorList[i]);
        }
        return arr;
    }

    function generateSecretCode() {
        secretCode = [];
        const used = new Set();
        while (secretCode.length < slotCount) {
            let colorIndex = Math.floor(Math.random() * colorCount);
            if (!allowDuplicates && used.has(colorIndex)) continue;
            secretCode.push(colorIndex);
            used.add(colorIndex);
        }
        renderSecret();
    }

    function renderSecret() {
        secretBoardEl.innerHTML = '';
        for (let i = 0; i < slotCount; i++) {
            const s = document.createElement('div');
            s.className = 'slot';
            if (gameOver) {
                s.style.background = colors[secretCode[i]];
                s.textContent = colors.indexOf(colors[secretCode[i]]);
                s.style.color = 'white';
            } else {
                s.style.backgroundColor = '#787878';
                s.textContent = '?';
                s.style.color = 'black';
            }
            s.style.textShadow = '0 0.1vw 0.2vw rgba(0,0,0,.6)';
            s.style.fontSize = '1.6vw';
            s.style.fontWeight = 'bold';
            s.style.display = 'grid';
            s.style.textAlign = 'center';
            s.style.alignItems = 'center';
            secretBoardEl.appendChild(s);
        };
    }

    function startGame() {
        slotCount = parseInt(document.getElementById("slotInput").value);
        colorCount = parseInt(document.getElementById("colorInput").value);
        maxAttempts = parseInt(document.getElementById("maxAttempts").value);
        attemptsLeft = maxAttempts;
        colors = generateColors(colorCount);
        generateSecretCode();
        finddifficulty();
        currentGuess = Array(slotCount).fill(null);
        guesses = [];
        gameOver = false;
        selectedIndex = null;
        timer = true;
        startTimer();
        updateScoreboard();
        renderSecret();
        renderGame();
    }

    function updateScoreboard(msg = "") {
        document.getElementById("output").innerHTML = `${msg}<br> Attempts Left: ${attemptsLeft}`;
    }

    function renderGame() {
        visualEl.innerHTML = "";

        guesses.forEach(entry => {
            const guessRow = document.createElement("div");
            guessRow.className = "row";

            entry.guess.forEach(colorIdx => {
                const slot = document.createElement("div");
                slot.className = "slot";
                slot.style.background = colors[colorIdx];
                slot.textContent = colorIdx;
                slot.style.color = '#fff';
                slot.style.textShadow = '0 0.1vw 0.2vw rgba(0,0,0,.6)';
                slot.style.fontSize = '1.6vw';
                slot.style.fontWeight = 'bold';
                slot.style.display = 'grid';
                slot.style.textAlign = 'center';
                slot.style.alignItems = 'center';
                guessRow.appendChild(slot);
            });

            const feedbackDiv = document.createElement("div");
            feedbackDiv.className = "color-feedback";
            for (let i = 0; i < entry.black; i++) {
                const peg = document.createElement("div");
                peg.style.background = "black";
                feedbackDiv.appendChild(peg);
            }
            for (let i = 0; i < entry.white; i++) {
                const peg = document.createElement("div");
                peg.style.background = "white";
                feedbackDiv.appendChild(peg);
            }

            guessRow.appendChild(feedbackDiv);
            visualEl.appendChild(guessRow);
        });

        if (!gameOver) {
            const guessRow = document.createElement("div");
            guessRow.className = "row";

            currentGuess.forEach((guess, idx) => {
                const slot = document.createElement("div");
                slot.className = "slot";
                slot.style.background = guess !== null ? colors[guess] : "white";
                if (guess !== null) {
                    slot.style.background = colors[guess];
                    slot.textContent = colors.indexOf(colors[guess]);
                    slot.style.color = '#fff';
                    slot.style.textShadow = '0 0.1vw 0.2vw rgba(0,0,0,.6)';
                    slot.style.fontSize = '1.6vw';
                    slot.style.fontWeight = 'bold';
                    slot.style.display = 'grid';
                    slot.style.textAlign = 'center';
                    slot.style.alignItems = 'center';
                } else {
                    slot.style.background = "white";
                }
                let pressTimer;
                slot.onmousedown = (e) => {
                    e.preventDefault();
                    pressTimer = setTimeout(() => {
                        currentGuess[idx] = null;
                        renderGame();
                    }, 600);
                };
                slot.onmouseup = () => clearTimeout(pressTimer);
                slot.ontouchstart = (e) => {
                    pressTimer = setTimeout(() => {
                        currentGuess[idx] = null;
                        renderGame();
                    }, 600);
                };
                slot.ontouchend = () => clearTimeout(pressTimer);
                slot.onclick = (e) => showColorPopup(e, idx);

                guessRow.appendChild(slot);
            });

            const submitB = document.createElement('button');
            submitB.className = 'fb-submit';
            submitB.textContent = 'Submit';
            submitB.onclick = checkGuess;
            guessRow.appendChild(submitB);

            visualEl.appendChild(guessRow);
        } else {
            const secretRow = document.createElement("div");
            secretRow.className = "row";
            secretCode.forEach(colorIdx => {
                const slot = document.createElement("div");
                slot.className = "slot";
                slot.style.background = colors[colorIdx];
                slot.textContent = colorIdx;
                slot.style.color = '#fff';
                slot.style.textShadow = '0 0.1vw 0.2vw rgba(0,0,0,.6)';
                slot.style.fontSize = '1.6vw';
                slot.style.fontWeight = 'bold';
                slot.style.display = 'grid';
                slot.style.textAlign = 'center';
                slot.style.alignItems = 'center';
                secretRow.appendChild(slot);
            });
            visualEl.appendChild(secretRow);
            renderSecret();
        }
        hidePopup();
    }

    function showColorPopup(event, slotIndex) {
        playSound('beep');
        const popup = document.getElementById("colorPopup");
        popup.innerHTML = "";
        popup.style.display = "flex";
        popup.style.left = `${event.pageX}px`;
        popup.style.top = `${event.pageY + 10}px`;
        colors.forEach((color, idx) => {
            const c = document.createElement("div");
            c.className = "color-option";
            c.style.background = color;
            c.textContent = idx;
            c.style.color = '#fff';
            c.style.textShadow = '0 0.1vw 0.2vw rgba(0,0,0,.6)';
            c.style.fontSize = '1.6vw';
            c.style.fontWeight = 'bold';
            c.style.display = 'grid';
            c.style.textAlign = 'center';
            c.style.alignItems = 'center';
            c.onclick = () => {
                playSound('beep');
                currentGuess[slotIndex] = idx;
                hidePopup();
                renderGame();
            };
            popup.appendChild(c);
        });
    }

    function hidePopup() {
        const popup = document.getElementById("colorPopup");
        popup.style.display = "none";
    }

    document.addEventListener("click", (e) => {
        const popup = document.getElementById("colorPopup");
        if (!popup.contains(e.target) && !e.target.classList.contains("slot")) {
            hidePopup();
        }
    });

    
    slotInputBtn.addEventListener('change', () => {
        slotCount = slotInputBtn.value;
        if (slotCount < 0 || slotCount > 12) {
            document.getElementById("output").textContent = "Maximum slot should not be < 0 or > 12";
            document.getElementById("buttonStart").disabled = true;
            slotCount = slotInputBtn.value;
        } else if (colorCount < slotCount) {
            document.getElementById("output").textContent = "No of Colors should not be < No of Slot";
            document.getElementById("buttonStart").disabled = true;
            slotCount = slotInputBtn.value;
        } else {
            document.getElementById("output").textContent = "Press New Game to start play Game";
            document.getElementById("buttonStart").disabled = false;
            slotCount = slotInputBtn.value;
        }
    });

    colorCountBtn.addEventListener('change', () => {
        colorCount = colorCountBtn.value;
        if (colorCount < 0 || colorCount > 20) {
            document.getElementById("output").textContent = "Maximum Colors should not be < 0 or > 20";
            document.getElementById("buttonStart").disabled = true;
            colorCount = colorCountBtn.value;
        } else if (colorCount < slotCount) {
            document.getElementById("output").textContent = "No of Colors should not be < No of Slots";
            document.getElementById("buttonStart").disabled = true;
            colorCount = colorCountBtn.value;
        } else {
            document.getElementById("output").textContent = "Press New Game to start play Game";
            document.getElementById("buttonStart").disabled = false;
            colorCount = colorCountBtn.value;
        }
    });

    let selectedIndex = null;

    function checkGuess() {
        if (gameOver) return;

        if (currentGuess.includes(null)) {
            alert("❗ Fill all slots first!");
            return;
        }

        if (!allowDuplicates) {
            const uniqueColors = new Set(currentGuess);
            if (uniqueColors.size < currentGuess.length) {
                alert("No duplicate colors allowed!");
                return;
            }
        }

        const guessCopy = [...currentGuess];
        const codeCopy = [...secretCode];

        let black = 0;
        let white = 0;

        for (let i = 0; i < slotCount; i++) {
            if (guessCopy[i] === codeCopy[i]) {
                black++;
                guessCopy[i] = codeCopy[i] = null;
            }
        }

        for (let i = 0; i < slotCount; i++) {
            if (guessCopy[i] !== null) {
                const index = codeCopy.indexOf(guessCopy[i]);
                if (index !== -1) {
                    white++;
                    codeCopy[index] = null;
                }
            }
        }

        guesses.push({ guess: [...currentGuess], black, white });
        attemptsLeft--;
        currentGuess = Array(slotCount).fill(null);
        selectedIndex = null;

        if (black === slotCount) {
            gameOver = true;
            updateScoreboard("🎉 You cracked the code!");
            clearInterval(timerInterval);
            updateleaderboard()
            timer = false;
            playSound('win');
            launchFireworks();
            shareScore(gameName, score);
        } else if (attemptsLeft <= 0) {
            gameOver = true;
            updateScoreboard("💥 Out of attempts! Code was revealed.");
            timer = false;
            playSound('loose');
            textToSpeechEng(`Out of attempts`);
        } else {
            updateScoreboard(`Exect ${black == 0 ? "nil" : black} and Misplace ${white == 0 ? "nil" : white}`);
            textToSpeechEng(`Exect ${black == 0 ? "nil" : black} and Misplace ${white == 0 ? "nil" : white}`);
            if (attemptsLeft == 2) {
                textToSpeechEng(`second Last attempt`);
            }
            if (attemptsLeft == 1) {
                textToSpeechEng(`Last attempt`);
            }
            playSound('submit');
        }

        renderGame();
    }

    function undoLastMove() {
        if (guesses.length === 0 || gameOver) return;
        const last = guesses.pop();
        attemptsLeft++;
        textToSpeechEng(`undo`);
        updateScoreboard();
        renderGame();
    }

    function endGameManually() {
        const secretRow = document.createElement("div");
        secretRow.className = "row";
        secretCode.forEach(colorIdx => {
            gameOver = true;
            const slot = document.createElement("div");
            slot.className = "slot";
            slot.style.background = colors[colorIdx];
            slot.textContent = colorIdx;
            slot.style.textShadow = '0 0.1vw 0.2vw rgba(0,0,0,.6)';
            slot.style.fontSize = '1.6vw';
            slot.style.fontWeight = 'bold';
            slot.style.display = 'grid';
            slot.style.textAlign = 'center';
            slot.style.alignItems = 'center';
            secretRow.appendChild(slot);
            renderSecret();
        });
        visualEl.appendChild(secretRow);
        updateScoreboard("💥 End game! Code was revealed.");
        timer = false;
        playSound('loose');
        disableGame();
    }

    function disableGame() {
        const slots = document.querySelectorAll(".slot");
        slots.forEach(slot => {
            slot.onclick = null;
        });
        document.getElementById("colorPopup").style.display = "none";
    }

        // to add firebase leaderboard (save record)
        window.saveScore = async function () {
            text = `Black=${b}, White=${w}`
    
            try {
                await addDoc(collection(db, "leaderboard"), {
                    game_id: game_id || 'mastermind',
                    game: game || 'mastermind',
                    name: winnerName || 'Guast',
                    opponent: opponent || "Computer",
                    difficulty: difficulty || "-",
                    size: size || `8x8`,
                    elapsed: Math.floor(Number(elapsedTime) / 1000) || 0,
                    score: score || 0,
                    moves: history.length || 0,
                    email: email || "-",
                    level: "-",
                    mode: playMode || 'pvc',
                    text: text || "-",
                    createdAt: new Date()
                });
                console.log("Score Saved!");
            } catch (error) {
                console.error("Error:", error);
            }
        };

    function updateleaderboard() {
        let player_name = player1;
        let player_opponent = "-";
        let game_id = 'mastermind';
        let gsize = `${slotCount}x${colorCount}`;
        let elapsed = hours * 3600 + minutes * 60 + seconds;
        let score = (slotCount * 10) + (colorCount * 10) - history.length * 2 - elapsed;
        let moves = guesses.length;
        let filed1 = 0;
        let filed2 = 0
        let filed3 = `slots:${slotCount}`;
        let filed4 = `colors:${colorCount}`;
        let email = localStorage.getItem('email') || '-';
        const created_at = new Date();

        let difficulty = "-";
        if (slotCount < 3) {
            if (colorCount < 4) { difficulty == 'very easy'; }
            else if (colorCount < 7) { difficulty == 'easy'; score = score + 100; }
            else if (colorCount < 9) { difficulty == 'medium'; score = score + 200; }
            else if (colorCount < 11) { difficulty == 'hard'; score = score + 300; }
            else if (colorCount < 16) { difficulty == 'very hard'; score = score + 400; }
            else { difficulty == 'expert'; score = score + 500; }
        }
        else if (slotCount < 5) {
            if (colorCount < 7) { difficulty == 'easy'; score = score + 100; }
            else if (colorCount < 9) { difficulty == 'medium'; score = score + 200; }
            else if (colorCount < 11) { difficulty == 'hard'; score = score + 300; }
            else if (colorCount < 16) { difficulty == 'very hard'; score = score + 400; }
            else { difficulty == 'expert'; score = score + 500; }
        }
        else if (slotCount < 7) {
            if (colorCount < 9) { difficulty == 'medium'; score = score + 200; }
            else if (colorCount < 11) { difficulty == 'hard'; score = score + 300; }
            else if (colorCount < 16) { difficulty == 'very hard'; score = score + 400; }
            else { difficulty == 'expert'; score = score + 500; }
        }
        else if (slotCount < 9) {
            if (colorCount < 11) { difficulty == 'hard'; score = score + 300; }
            else if (colorCount < 16) { difficulty == 'very hard'; score = score + 400; }
            else { difficulty == 'expert'; score = score + 500; }
        }
        else if (slotCount < 11) {
            if (colorCount < 16) { difficulty == 'very hard'; score = score + 400; }
            else { difficulty == 'expert'; score = score + 500; }
        } else { difficulty == 'expert'; score = score + 500; }

        lcsaveToLeaderboard(player_name, player_opponent, email, gsize, difficulty, game_id, score, elapsed, moves, filed1, filed2, filed3, filed4, created_at);

        // saveScore(player_name, player_opponent, email, gsize, difficulty, game_id, score, elapsed, moves, filed1, filed2, filed3, filed4, created_at);
    }
    document.addEventListener('DOMContentLoaded', () => {
        lcrenderLeaderboard();
    });
});