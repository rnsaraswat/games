// // import { startTime, running  } from './gameLogic.js';
// import { textToSpeechEng } from './speak.js';

// export let seconds = 0;
// export let minutes = 0;
// export let hours = 0;
// let elapsedTime = 0;
// export let timerInterval = null;
// let startTime = 0;
// let running = false;

// const timeDisplay = document.getElementById("timer-display");
// const pausebutton = document.getElementById("pauseBtn");
// const closePaused = document.getElementById("closePaused");

// function formatTime(ms) {
//     let totalSeconds = Math.floor(ms / 1000);

//     hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
//     minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
//     seconds = String(totalSeconds % 60).padStart(2, '0');

//     return `${hours}:${minutes}:${seconds}`;
// }

// function updateTimer() {
//     const now = Date.now();
//     elapsedTime = now - startTime;
//     timeDisplay.textContent = "⏱️" + formatTime(elapsedTime);
// }

// export function startTimer() {
//     if (!running) {
//         // ▶ START
//         startTime = Date.now() - elapsedTime;
//         timerInterval = setInterval(updateTimer, 200);
//         pausebutton.textContent = "⏸Pause";
//         running = true;
//     } else {
//         document.getElementById("pauseModal").style.display = 'flex';
//     }
// }

// export function stopTimer() {
//     clearInterval(timerInterval);
//     running = false;
// }

// pausebutton.addEventListener("click", () => {
//     if (!running) {
//         // ▶ RESUME
//         startTime = Date.now() - elapsedTime;
//         timerInterval = setInterval(updateTimer, 200);
//         document.getElementById("pauseModal").style.display = 'none';
//         // button.textContent = "⏸Pause";
//         // textToSpeechEng('Resume');
//         running = true;
//     } else {
//         // ⏸ PAUSE
//         clearInterval(timerInterval);
//         document.getElementById("pauseModal").style.display = 'flex';
//         // button.textContent = "▶Resume";
//         // textToSpeechEng('Pause');
//         // running = false;
//     }
// });

// closePaused.addEventListener("click", () => {
//     if (!running) {
//         // ▶ RESUME
//         startTime = Date.now() - elapsedTime;
//         timerInterval = setInterval(updateTimer, 200);
//         document.getElementById("pauseModal").style.display = 'none';
//         // button.textContent = "⏸Pause";
//         // textToSpeechEng('Resume');
//         running = true;
//     } else {
//         // ⏸ PAUSE
//         clearInterval(timerInterval);
//         document.getElementById("pauseModal").style.display = 'none';
//         // button.textContent = "▶Resume";
//         // textToSpeechEng('Pause');
//         running = false;
//     }
// });