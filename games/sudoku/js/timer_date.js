import { state } from './script.js';
import { textToSpeechEng } from './speak.js';

export let seconds = 0;
export let minutes = 0;
export let hours = 0;
let elapsedTime = 0;
export let timerInterval = null;

const timeDisplay = document.getElementById("timer-display");
const button = document.getElementById("pauseBtn");

function formatTime(ms) {
    let totalSeconds = Math.floor(ms / 1000);

    hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    seconds = String(totalSeconds % 60).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
}

function updateTimer() {
    const now = Date.now();
    elapsedTime = now - state.startTime;
    timeDisplay.textContent = formatTime(elapsedTime);
}

export function startTimer() {
    if (!state.running) {
        // ▶ START
        state.startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateTimer, 200);
        button.textContent = "⏸Pause";
        state.running = true;
    }
}

export function stopTimer() {
    clearInterval(timerInterval);
    state.running = false;
}

button.addEventListener("click", () => {
    if (!state.running) {
        // ▶ RESUME
        state.startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateTimer, 200);
        button.textContent = "⏸Pause";
        textToSpeechEng('Resume');
        state.running = true;
    } else {
        // ⏸ PAUSE
        clearInterval(timerInterval);
        button.textContent = "▶Resume";
        textToSpeechEng('Pause');
        state.running = false;
    }
});