import { timer } from './script.js';

export let seconds = 0;
export let minutes = 0;
export let hours = 0;
export let timerInterval;
let startTime;
let elapsedTime = 0;
const timerDisplay = document.getElementById('timer-display');

export function startTimer() {
    clearInterval(timerInterval);
    elapsedTime = 0;
    if (timer) {
        startTime = Date.now();
        timerInterval = setInterval(updateTimerDisplay, 1000);
    }
}

function updateTimerDisplay() {
    elapsedTime = Date.now() - startTime;
    const totalSeconds = Math.floor(elapsedTime / 1000);
    hours = Math.floor(totalSeconds / 3600);
    minutes = Math.floor((totalSeconds % 3600) / 60);
    seconds = totalSeconds % 60;

    const pad = (num) => String(num).padStart(2, '0');
    timerDisplay.textContent  = `⏱️ ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}
