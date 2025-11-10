import { timer } from './script.js';

export let seconds = 0;
export let minutes = 0;
export let hours = 0;
export let hrdsec = 0;

// display upadted time of game play
function displayTime() {
    document.getElementById('timer-display').textContent = '⏱️' + ((hours < 10) ? '0' + hours : hours) + ':' + ((minutes < 10) ? '0' + minutes : minutes) + ':' + ((seconds < 10) ? '0' + seconds : seconds);
}

// update of time para
export function updateTimer() {
    displayTime();
    setInterval(() => {
        if (timer) {
            hrdsec++
            if (hrdsec >= 100) {
                hrdsec = 0;
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
        }
        displayTime();
    }, 10);
}