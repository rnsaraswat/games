// Standalone Chess timer. Does not depend on script.js.
export let seconds = 0;
export let minutes = 0;
export let hours = 0;
export let timerInterval = null;
export let elapsedTime = 0;
let startTime = null;
const timerDisplay = () => document.getElementById("timer-display");
function updateTimerDisplay() {
  if (startTime === null) return;
  elapsedTime = Date.now() - startTime;
  const totalSeconds = Math.floor(elapsedTime / 1000);
  hours = Math.floor(totalSeconds / 3600);
  minutes = Math.floor((totalSeconds % 3600) / 60);
  seconds = totalSeconds % 60;
  const pad = n => String(n).padStart(2, "0");
  const display = timerDisplay();
  if (display) display.textContent = `⏱️ ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}
export function startTimer() {
  stopTimer(); elapsedTime = 0; startTime = Date.now(); updateTimerDisplay();
  timerInterval = setInterval(updateTimerDisplay, 1000);
}
export function stopTimer() {
  if (timerInterval !== null) clearInterval(timerInterval);
  timerInterval = null;
  if (startTime !== null) elapsedTime = Date.now() - startTime;
  startTime = null;
}
export function resetTimer() {
  stopTimer(); seconds = minutes = hours = elapsedTime = 0;
  const display = timerDisplay(); if (display) display.textContent = "⏱️ 00:00:00";
}
