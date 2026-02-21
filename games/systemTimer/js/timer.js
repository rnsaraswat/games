// ===============================
// Universal Game Timer Module
// Author: Reusable Version
// ===============================

class GameTimer {
    constructor(displayElementId) {
        this.displayElement = document.getElementById(displayElementId);

        this.startTime = 0;      // Game start system time
        this.elapsedTime = 0;    // Total milliseconds stored
        this.interval = null;    
        this.isRunning = false;
        this.isPaused = false;
    }

    // hh:mm:ss format converter
    formatTime(ms) {
        let totalSeconds = Math.floor(ms / 1000);

        let hours = Math.floor(totalSeconds / 3600);
        let minutes = Math.floor((totalSeconds % 3600) / 60);
        let seconds = totalSeconds % 60;

        return (
            String(hours).padStart(2, '0') + ":" +
            String(minutes).padStart(2, '0') + ":" +
            String(seconds).padStart(2, '0')
        );
    }

    // Display update
    updateDisplay() {
        let currentElapsed;

        if (this.isRunning) {
            currentElapsed = Date.now() - this.startTime + this.elapsedTime;
        } else {
            currentElapsed = this.elapsedTime;
        }

        this.displayElement.textContent = this.formatTime(currentElapsed);
    }

    // Start timer
    start() {
        if (this.isRunning) return;

        this.startTime = Date.now();
        this.isRunning = true;
        this.isPaused = false;

        this.interval = setInterval(() => {
            this.updateDisplay();
        }, 1000);
    }

    // Stop timer (Game End)
    stop() {
        if (!this.isRunning) return;

        clearInterval(this.interval);

        this.elapsedTime += Date.now() - this.startTime;

        this.isRunning = false;
        this.isPaused = false;

        this.updateDisplay();
    }

    // Pause timer
    pause() {
        if (!this.isRunning) return;

        clearInterval(this.interval);

        this.elapsedTime += Date.now() - this.startTime;

        this.isRunning = false;
        this.isPaused = true;

        this.updateDisplay();
    }

    // Resume timer
    resume() {
        if (!this.isPaused) return;

        this.startTime = Date.now();
        this.isRunning = true;
        this.isPaused = false;

        this.interval = setInterval(() => {
            this.updateDisplay();
        }, 1000);
    }

    // Restart timer
    restart() {
        clearInterval(this.interval);

        this.startTime = 0;
        this.elapsedTime = 0;
        this.isRunning = false;
        this.isPaused = false;

        this.displayElement.textContent = "00:00:00";
    }

    // Get total time in seconds
    getTotalSeconds() {
        if (this.isRunning) {
            return Math.floor((Date.now() - this.startTime + this.elapsedTime) / 1000);
        }
        return Math.floor(this.elapsedTime / 1000);
    }
}
