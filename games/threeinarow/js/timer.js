// display timer
import { timer } from './script.js';

export let seconds = 0;
export let minutes = 0;
export let hours = 0;
export let sec = 0;
export let min = 0;
export let hrs = 0;
let timerInterval;
const timerDisplay = document.getElementById('timer-display');

export function startTimer() {
    clearInterval(timerInterval);
    seconds = 0;
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        if (timer) {
            seconds++;
            if (seconds >= 60) {
                seconds = 0;
                minutes++;
                if (minutes >= 60) {
                    minutes = 0;
                    hours++;
                }
            }
        }
        updateTimerDisplay();
    }, 1000);
}

function updateTimerDisplay() {
    hrs = String(hours).padStart(2, '0');
    min = String(minutes).padStart(2, '0');
    sec = String(seconds % 60).padStart(2, '0');
    timerDisplay.textContent = `⏱️ ${hrs}:${min}:${sec}`;
}
