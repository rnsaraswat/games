// Timer object create
const timer = new GameTimer("timer");

const pausePopup = document.getElementById("pausePopup");

document.getElementById("startBtn").onclick = function () {
    timer.start();
};

document.getElementById("pauseBtn").onclick = function () {
    timer.pause();
    pausePopup.style.display = "flex";
};

document.getElementById("resumeBtn").onclick = function () {
    timer.resume();
    pausePopup.style.display = "none";
};

document.getElementById("endBtn").onclick = function () {
    timer.stop();

    let totalSeconds = timer.getTotalSeconds();

    alert("Game Over! Total Time: " + totalSeconds + " seconds");

    console.log("Total Time in Seconds:", totalSeconds);
};

document.getElementById("restartBtn").onclick = function () {
    timer.restart();
};
