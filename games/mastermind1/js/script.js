import { updateTimer } from './timer.js';
import { launchFireworks } from './edgeFireWorks.js';
import { playSound } from './sound.js';
import { textToSpeechEng } from './speak.js';
import { saveToLeaderboard, toggleLeaderboard, clearLeaderboard } from './leaderboard.js';

// define variables
export let timer = false;
// let hours = 0;
// let minutes = 0;
// let seconds = 0;
// let hrdsec = 0;
export let slotCount = 4;
export let colorCount = 6;
export let maxAttempts = 10;
export let attemptsLeft = 0;
let colors = [];
let secretCode = [];
let currentGuess = [];
let guesses = [];
let gameOver = false;
export let allowDuplicates = true;

const colorList = ["#FF0000", "#8b0000", "#fa8072", "#00FF00",
    "#008000", "#006400", "#9acd32", "#008080", "#0000FF", "#000080",
    "#00bfff", "#FFFF00", "#ffd700", "#bdb76b", "#00FFFF", "#00ced1",
    "#7fffd4", "#FF00FF", "#ee82ee", "#9932cc", "#800080", "#9370db",
    "#800000", "#A52A2A", "#808000", "#FFC0CB", "#c71585", "#ff1493",
    "#ff69b4", "#FFA500", "#FF4500", "#ff7f50", "#000000", "#808080",
    "#C0C0C0", "#2f4f4f", "#696969"];

document.getElementById('output').textContent = "Please Select slots/colors/Duplicates/attempts, then Press New Game to play";

const visualEl = document.getElementById('visualGuesses');
// const output = document.getElementById('output');
// const toggleThemeBtn = document.getElementById("toggleTheme");
const secretBoardEl = document.getElementById('secretBoard');
// const leaderboardEl = document.getElementById('leaderboard');
document.getElementById("clearleaderboard").style.display = 'none';
const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');

// set default Player Name or ask player name
export let player1 = "Human";
player1 = prompt("Enter Player Name (default Human?") || player1;

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

// chhose colors from array
function generateColors(count) {
    const arr = [];
    for (let i = 0; i < count; i++) {
        arr.push(colorList[i]);
    }
    // console.log(arr)
    return arr;
}

// generate secrate code for find it
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
    // console.log("Secret Code:", secretCode); // For testing
}
// display secrate color in slot (select/change by click)
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
            s.classList.add('empty');
            s.textContent = '?';
            s.style.color = 'black';
        }
        s.style.textShadow = '0 0.1vw 0.2vw rgba(0,0,0,.6)';
        s.style.fontWeight = 'bold';
        s.style.display = 'grid';
        s.style.textAlign = 'center';
        s.style.alignItems = 'center';
        secretBoardEl.appendChild(s);
    };
}

// start game
function startGame() {
    slotCount = parseInt(document.getElementById("slotInput").value);
    colorCount = parseInt(document.getElementById("colorInput").value);
    maxAttempts = parseInt(document.getElementById("maxAttempts").value);
    attemptsLeft = maxAttempts;
    colors = generateColors(colorCount);
    generateSecretCode();
    currentGuess = Array(slotCount).fill(null);
    guesses = [];
    gameOver = false;
    selectedIndex = null;
    if (!timer) {
        timer = true;
        updateTimer();
    }
    updateScoreboard();
    renderGame();
}

// update message
function updateScoreboard(msg = "") {
    document.getElementById("output").textContent = `${msg} Attempts Left: ${attemptsLeft}`;
}

// display game slots
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
        feedbackDiv.className = "feedback";
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
            //

            guessRow.appendChild(slot);
        });

        const submitB = document.createElement('button');
        submitB.className = 'fb-submit';
        submitB.textContent = 'OK';
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

    hidePopup(); // hide old popup on re-render
}

// display submenu
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

// hide submenu
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


let selectedIndex = null;

// check user guess
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
        saveToLeaderboard(player1);
        timer = false;
        playSound('win');
        launchFireworks();
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

// undo
function undoLastMove() {
    if (guesses.length === 0 || gameOver) return;
    const last = guesses.pop();
    attemptsLeft++;
    textToSpeechEng(`undo`);
    updateScoreboard();
    renderGame();
}

// end game by use if not played
function endGameManually() {
    const secretRow = document.createElement("div");
    secretRow.className = "row";
    secretCode.forEach(colorIdx => {
        const slot = document.createElement("div");
        slot.className = "slot";
        slot.style.background = colors[colorIdx];
        secretRow.appendChild(slot);
    });
    visualEl.appendChild(secretRow);
    updateScoreboard("💥 End game! Code was revealed.");
    timer = false;
    playSound('loose');
    disableGame();
}

// disable submenu display
function disableGame() {
    const slots = document.querySelectorAll(".slot");
    slots.forEach(slot => {
        slot.onclick = null;
    });
    document.getElementById("colorPopup").style.display = "none";
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

document.getElementById("toggle-leaderboard").addEventListener("click", () => {
    toggleLeaderboard();
});

document.getElementById("clearleaderboard").addEventListener("click", () => {
    clearLeaderboard();
});