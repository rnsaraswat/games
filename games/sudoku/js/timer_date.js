import { state } from './script.js';
import { textToSpeechEng } from './speak.js';

export let sec = 0;
export let min = 0;
export let hrs = 0;
// timer
export function startTimer() {
    stopTimer();
    state.timerStart = Date.now();
    state.paused = false;
    pauseBtn.textContent = '⏸ Pause';
    state.timerTick = setInterval(() => {
        if (!state.paused) {
            const s = Math.floor((Date.now() - state.timerStart) / 1000);
            hrs = Math.floor(s / 3600), min = (Math.floor(s / 60)) % 60, sec = s % 60;
            timerInfo.textContent = `⏱ ${String(hrs).padStart(2, '0')}:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
        }
    }, 1000);
}

export function stopTimer() {
    if (state.timerTick) {
        clearInterval(state.timerTick);
        state.timerTick = null;
    }
}

//pause/resume timer
export function pauseResumeTimer(){
    if (state.revealMode) return;
    state.paused = !state.paused;
    pauseBtn.textContent = state.paused ? '▶ Resume' : '⏸ Pause';
    if (!state.paused && !state.timerTick) startTimer();
    if (state.paused) {
        textToSpeechEng('Pause');
    } else {
        textToSpeechEng('Resume');
    }
}