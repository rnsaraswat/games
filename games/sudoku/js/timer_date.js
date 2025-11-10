import { state } from './script.js';
import { textToSpeechEng } from './speak.js';

export let seconds = 0;
export let minutes = 0;
export let hours = 0;
// export let sec = 0;
// export let min = 0;
// export let hrs = 0;
export let totalSeconds;
let elapsedTime = 0;
// timer
export function startTimer() {
    stopTimer();
    state.timerStart = Date.now();
    state.paused = false;
    pauseBtn.textContent = '⏸ Pause';
    state.timerTick = setInterval(() => {
        if (!state.paused) {
            elapsedTime = Date.now() - state.timerStart;
            totalSeconds = Math.floor(elapsedTime / 1000);
            hours = Math.floor(totalSeconds / 3600);
            minutes = Math.floor((totalSeconds % 3600) / 60);
            seconds = totalSeconds % 60;
            const pad = (num) => String(num).padStart(2, '0');
            timerInfo.textContent  = `⏱️ ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
        
            // timerInfo.textContent = `⏱ ${String(hrs).padStart(2, '0')}:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
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