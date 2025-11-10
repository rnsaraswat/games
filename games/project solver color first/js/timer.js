// display timer
import { timer } from './script.js';

let seconds = 0;
let minutes = 0;
let hours = 0;
let hrdsec = 0;

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
