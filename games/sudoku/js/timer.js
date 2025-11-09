import { state } from './script.js';
import { textToSpeechEng } from './speak.js';

export let sec = 0;
export let min = 0;
export let hrs = 0;

// export function startTimer() {
export function startTimer() {
    stopTimer();
    let timess = 0;
    let timemm = 0;
    let timehh = 0;
    state.timerStart = Date.now();
    state.paused = false;
    pauseBtn.textContent = '⏸ Pause';
    state.timerTick = setInterval(() => {
        if (!state.paused) {
            timess++;
            if (timess >= 60) {
                timess = 0;
                timemm++;
                if (timemm >= 60) {
                    timemm = 0;
                    timehh++;
                }
            }
            hrs = String(timehh).padStart(2, '0');
            min = String(timemm).padStart(2, '0');
            sec = String(timess % 60).padStart(2, '0');
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
