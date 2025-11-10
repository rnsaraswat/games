/* ---------- Timer display ---------- */

// this added in index.html for timer display
// <div>⏱ Time: <b id="timer-display">00:00:00</b></div>

// this added in style.css timer display with theme
// these lines added in :root of style.css
// :root {
//     --bg: #f0f0f0;
//     --fg: #222;
// }

// these lines added in body.dark of style.css
// body.dark {
//     --bg: #454545;
//     --fg: #eee;
// }

// .stats {
//     display: flex;
//     gap: 1.4vw;
//     color: var(--fg);
//     background: var(--bg);
//     font-size: .1.2vw;
//     margin-left: 0.8vw;
// }

// .stats b {
//     color: var(--fg);
//     background: var(--bg);
// }


// these lines added in javascript in which for timer update and display requied 
// import { startTimer, hrs, min, sec, timerDisplay, timerInterval } from './timer.js';

// these lines for timer update and display javascript timer.js
let timess = 0;
let timemm = 0;
let timehh = 0;
export let sec = 0;
export let min = 0;
export let hrs = 0;
export let timerInterval;
export const timerDisplay = document.getElementById('timer-display');

// export function startTimer() {
export function startTimer() {
    clearInterval(timerInterval);
    timess = 0;
    timemm = 0;
    timehh = 0;
    timerInterval = setInterval(() => {
        timess++;
        if (timess >= 60) {
            timess = 0;
            timemm++;
            if (timemm >= 60) {
                timemm = 0;
                timehh++;
            }
        }
        updateTimerDisplay();
    }, 1000);
}

function updateTimerDisplay() {
    hrs = String(timehh).padStart(2, '0');
    min = String(timemm).padStart(2, '0');
    sec = String(timess % 60).padStart(2, '0');
    timerDisplay.textContent = `⏱ ${hrs}:${min}:${sec}`;
}
