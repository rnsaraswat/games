import { textToSpeechEng } from './speak.js';
import { shareScore } from './share.js';
// import { saveScore } from '../../../leaderboard/gbleaderboard.js';
import { lcrenderLeaderboard, lcsaveToLeaderboard } from '../../../leaderboard/lcleaderboard.js';
import { db } from "./firebase-config.js";
import {
    collection,
    query,
    where,
    orderBy,
    limit,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export let gameName = 'watersort';
export let score = 0;
document.addEventListener('DOMContentLoaded', () => {
    lcrenderLeaderboard();
});
let heading = "EASY";
var game, level, water = [], w = [], currentLevel, clicked = [], transferring = false, t = false, size = 1, sizechange = 0.05, won = false, moves = 0;
var noOfTubes = 0;
var lequidTransferFromTube = 0;
var lequidReceivedtoTube = 0;
var color = ["#FF0000", "#8b0000", "#00FF00", "#006400", "#00bfff", "#0000FF", "#000080", "#ffd700", "#bdb76b", "#00FFFF", "#FF00FF", "#9932cc"];

// define test tube position ([left, top]) in 3 row
var testTubePosition = {
    0: [[-7, 6], [3, 6], [-7, 20], [3, 20]],
    1: [[-12, 6], [-2, 6], [8, 6], [-7, 20], [3, 20]],
    2: [[-12, 6], [-2, 6], [8, 6], [-12, 20], [-2, 20], [8, 20]],
    3: [[-12, 6], [-2, 6], [8, 6], [-7, 20], [3, 20], [-7, 34], [3, 34]],
    4: [[-12, 6], [-2, 6], [8, 6], [-12, 20], [-2, 20], [8, 20], [-7, 34], [3, 34]],
    5: [[-12, 6], [-2, 6], [8, 6], [-12, 20], [-2, 20], [8, 20], [-12, 34], [-2, 34], [8, 34]],
    6: [[-17, 6], [-7, 6], [3, 6], [13, 6], [-12, 20], [-2, 20], [8, 20], [-12, 34], [-2, 34], [8, 34]],
    7: [[-17, 6], [-7, 6], [3, 6], [13, 6], [-17, 20], [-7, 20], [3, 20], [13, 20], [-12, 34], [-2, 34], [8, 34]],
    8: [[-17, 6], [-7, 6], [3, 6], [13, 6], [-17, 20], [-7, 20], [3, 20], [13, 20], [-17, 34], [-7, 34], [3, 34], [13, 34]],
    9: [[-22, 6], [-12, 6], [-2, 6], [8, 6], [18, 6], [-17, 20], [-7, 20], [3, 20], [13, 20], [-17, 34], [-7, 34], [3, 34], [13, 34]],
    10: [[-22, 6], [-12, 6], [-2, 6], [8, 6], [18, 6], [-22, 20], [-12, 20], [-2, 20], [8, 20], [18, 20], [-17, 34], [-7, 34], [3, 34], [13, 34]],
}
let timer = false;
let hours = 0;
let minutes = 0;
let seconds = 0;
let hrdsec = 0;
let timerInterval;
let startTime;
let elapsedTime = 0;
let theme = localStorage.getItem('rg_theme') || 'dark';
let player1 = localStorage.getItem('player_name') || 'Human1';
const timerDisplay = document.getElementById('timerdisplay');

window.onload = function () {
    game = document.getElementById("game");
    level = document.getElementById("button-container");
}

// display upadted time of game play
function startTimer() {
    clearInterval(timerInterval);
    elapsedTime = 0;
    if (timer) {
        startTime = Date.now();
        timerInterval = setInterval(updateTimerDisplay, 1000);
    }
}

function updateTimerDisplay() {
    elapsedTime = Date.now() - startTime;
    const totalSeconds = Math.floor(elapsedTime / 1000);
    hours = Math.floor(totalSeconds / 3600);
    minutes = Math.floor((totalSeconds % 3600) / 60);
    seconds = totalSeconds % 60;

    const pad = (num) => String(num).padStart(2, '0');
    timerDisplay.textContent = `⏱️ ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

document.getElementById("startBtn").addEventListener('click', () => {
    if (document.getElementById('startBtn').textContent == "Start") {
        document.getElementById('startBtn').textContent = "Restart";
        start();
    } else {
        document.getElementById('startBtn').textContent = "Start";
        window.Restart();
    }
});

function start() {
    // document.getElementById('startBtn').textContent = "Restart";
    // document.getElementById('startBtn').setAttribute = "Restart()";
    // user input for tubes
    noOfTubes = parseInt(document.getElementById("tubeInput").value);

    // check user input
    if (isNaN(noOfTubes)) {
        document.getElementById('output').textContent = "Please fill number of tubes ";
    } else if (noOfTubes <= 1 || noOfTubes > 12) {
        document.getElementById('output').textContent = "please fill number of tubes between 2 to 12 only ";
    } else {
        document.getElementById('output').textContent = `No of tube selected (${noOfTubes})`;
        OpenLevel(noOfTubes - 2);
    }
}

window.OpenLevel = function (x) {
    // function OpenLevel(x) {
    playSound('start');
    timer = true;
    startTimer();
    hours = 0;
    minutes = 0;
    seconds = 0;
    hrdsec = 0;
    moves = 0;
    currentLevel = x;
    won = false;
    document.getElementById('button-container').style.visibility = "visible";
    // document.getElementById('levelButton').style.visibility = "hidden";
    // document.getElementById('levelButton').style.display = "block";

    water = [];
    let a = [], c = 0;
    // fill all test tube with single color 
    for (let i = 0; i < x + 2; i++) {
        for (let j = 0; j < 4; j++) {
            a.push(color[i]);
        }
    }
    // resuffle all test tube colors
    a = shuffle(a);
    // make water array of all test tube with filled all colors (each test tube has seperate array inside water array)
    for (let i = 0; i < x + 2; i++) {
        water[i] = [];
        for (let j = 0; j < 4; j++) {
            water[i].push(a[c]);
            c++;
        }
    }
    // add 2 empty test tube to water array
    water.push(["transparent", "transparent", "transparent", "transparent"], ["transparent", "transparent", "transparent", "transparent"]);
    // map seperate array w from water contain test [tube number 1 [color1, color2, color2, color3, color2],[tube number 2 [color1, color2, color2, color3, color2]...
    // 0- first, 1- second, 2- third, 3- fourth, 4-fifth ... tubes
    // 0- bottom color, 1- Ist color from bottom, 2- IInd from bottom (1st from top), 3- top color
    w = water.map((a) => [...a]);
    console.log(water, w);
    ApplyInfo();
    // updateTimer();
}

// window.ShowRules = function () {
// function ShowRules() {
//     document.getElementById("rules-page").style.display = "block";
//     setTimeout(function () {
//         document.getElementById("rules-page").style.opacity = "1";
//     }, 50);
// }

// window.HideRules = function () {
// function HideRules() {
//     setTimeout(function () {
//         document.getElementById("rules-page").style.display = "none";
//     }, 500);
//     document.getElementById("rules-page").style.opacity = "0";
// }

window.Restart = function () {
    playSound('loose');
    moves = 0;
    water = w.map((a) => [...a]);
    won = false;
    console.log(water, w);
    ApplyInfo(w);
}

//check for winner
function Won() {
    for (let i of water) {
        if (i[0] != i[1] || i[1] != i[2] || i[2] != i[3]) {
            return;
        }
    }
    playSound('win');
    timer = false;
    clearInterval(timerInterval);
    won = true;
    document.getElementById('startBtn').textContent = "Start";
    let heading = ["EASY", "EASY", "MEDIUM", "MEDIUM", "HARD", "HARD", "VERY HARD", "VERY HARD", "VERY HARD", "EXPERT", "EXPERT"][noOfTubes - 2];
    updateleaderboard();
    // disply winning message
    level.innerHTML = `<div id="won" class="msgr">${player1} WON!</div>`;
    score = (noOfTubes * noOfTubes) * 10 - moves * 1;
    shareScore(gameName, score);
}

// function to suffle colors in each test tube for game setup
function shuffle(x) {
    let a = [], len = x.length;
    // loop for each test tube
    for (let i = 0; i < len; i++) {
        // generate random numbers
        let n = Math.floor(Math.random() * x.length);
        a.push(x[n]);
        x.splice(n, 1);
    }
    return a;
}


function ApplyInfo(a = water) {
    console.log(water, w)
    if (!won) {
        let d = 0;
        heading = ["EASY", "EASY", "MEDIUM", "MEDIUM", "HARD", "HARD", "VERY HARD", "VERY HARD", "VERY HARD", "EXPERT", "EXPERT"][noOfTubes - 2];
        document.getElementById("leveldisplay").textContent = heading;
        level.innerHTML = "";
        level.style.display = "block";
        level.style.visibility = "visible";

        console.log(testTubePosition[currentLevel], currentLevel)
        for (let i of testTubePosition[currentLevel]) {
            level.innerHTML += `<div class = "test-tube" style="top:${i[1]}vw;left:calc(60vw + ${i[0]}vw);transform:rotate(0deg);" onclick="Clicked(${d});">
                    <div class="colors" style = "background-color:${a[d][0]};top:8.5vw;"></div>
                    <div class="colors" style = "background-color:${a[d][1]};top:6vw;"></div>
                    <div class="colors" style = "background-color:${a[d][2]};top:3.5vw;"></div>
                    <div class="colors" style = "background-color:${a[d][3]};top:1vw;"></div>
                </div>`;
            d++;
        }
    }
}

// check for test tube clicked
window.Clicked = function (x) {
    console.log(x)
    if (!transferring) {
        if (clicked.length == 0) {
            clicked.push(x);
            document.getElementsByClassName("test-tube")[x].style.transition = "0.2s linear";
            document.getElementsByClassName("test-tube")[x].style.transform = "scale(1.1)";
        }
        else {
            clicked.push(x);
            let el = document.getElementsByClassName("test-tube")[clicked[0]];
            el.style.transform = "scale(1) rotate(0deg)";
            if (clicked[0] != clicked[1]) {
                el.style.transition = "1s linear";
                moves++;
                document.getElementById("moves").textContent = moves;
                Transfer(...clicked);
            }
            clicked = [];
        }
    }
}

function TransferAnim(a, b) {
    let el = document.getElementsByClassName("test-tube")[a];
    transferring = true;
    el.style.zIndex = "100";
    //change vertical position to down
    el.style.top = `calc(${testTubePosition[currentLevel][b][1]}vw - 8vw)`;
    // el.style.left = `calc(50vw + ${testTubePosition[currentLevel][b][0]}vw - 10vw)`;
    el.style.left = `calc(60vw + ${testTubePosition[currentLevel][b][0]}vw - 6vw)`;
    el.style.transform = "rotate(75deg)";
    setTimeout(function () {
        el.style.transform = "rotate(90deg)";
    }, 1000)
    // this set left/top/angle of test tube after transfering lequid
    setTimeout(function () {
        el.style.left = `calc(60vw + ${testTubePosition[currentLevel][a][0]}vw)`;
        el.style.top = `calc(${testTubePosition[currentLevel][a][1]}vw)`;
        el.style.transform = "rotate(0deg)";
    }, 2000);
    setTimeout(function () {
        el.style.zIndex = "0";
        transferring = false;
    }, 3000)
}

function Transfer(a, b) {
    console.log(a,b)
    lequidTransferFromTube = a;
    lequidReceivedtoTube = b;

    if (!water[b].includes("transparent") || water[a] == ["transparent", "transparent", "transparent", "transparent"]) {
        moves -= 1;
        document.getElementById("moves").innerHTML = moves;
        return;
    }
    let p, q, r = false, s = false, count = 0, c = 0;
    for (let i = 0; i < 4; i++) {
        if (((water[a][i] != "transparent" && water[a][i + 1] == "transparent") || i === 3) && !r) {
            r = true;
            p = [water[a][i], i];
            if (water[a].map(function (x) {
                if (x == "transparent" || x == p[0]) { return 1; } else { return 0; }
            }).reduce((x, y) => x + y) === 4) {
                p.push(i + 1)
            }
            else {
                for (let j = 1; j < 4; j++) {
                    if (i - j >= 0 && water[a][i - j] != p[0]) {
                        p.push(j);
                        break;
                    }
                }
            }
        }
        if (((water[b][i] != "transparent" && water[b][i + 1] == "transparent") || water[b][0] == "transparent") && !s) {
            s = true;
            q = [water[b][i], i, water[b].map((x) => x = (x == "transparent") ? 1 : 0).reduce((x, y) => x + y)];
        }
    }
    if (q[0] != "transparent" && p[0] != q[0]) {
        moves -= 1;
        document.getElementById("moves").innerHTML = moves;
        return;
    }
    for (let i = 3; i >= 0; i--) {
        if ((water[a][i] == p[0] || water[a][i] == "transparent") && count < q[2]) {
            if (water[a][i] == p[0]) {
                count++;
            }
            water[a][i] = "transparent";
        }
        else {
            break;
        }
    }
    c = count;
    setTimeout(function () { WaterDec(p, q, a, c); }, 1010);
    setTimeout(function () { WaterInc(p, q, b, c); }, 1010);
    for (let i = 0; i < 4; i++) {
        if (water[b][i] == "transparent" && count > 0) {
            count--;
            water[b][i] = p[0];
        }
    }
    setTimeout(function () { ApplyInfo(); }, 3020);
    setTimeout(function () { TransferAnim(a, b); }, 10);
    setTimeout(Won, 3000);
}

function WaterDec(p, q, a, count) {
    playSound('water');

    p[1] = 3 - p[1];
    document.getElementsByClassName("test-tube")[a].innerHTML += `<div id = "white-bg" style = "top:calc(1vw + ${p[1] * 2.5}vw - 0.1vw);"></div>`;
    setTimeout(function () {
        document.getElementById("white-bg").style.height = count * 2.5 + 0.1 + "vw";
        level.innerHTML += `<div class="rain">
            <div class="drop" style = "top: calc(${testTubePosition[noOfTubes - 2][lequidReceivedtoTube][1]}vw - 8.5vw); left: calc(60vw + ${testTubePosition[noOfTubes - 2][lequidReceivedtoTube][0]}vw + 1.7vw); background-color: ${p[0]};"></div>
        </div>`
    }, 50);
    setTimeout(function () {
        document.getElementsByClassName("test-tube")[a].innerHTML = `
                <div class="colors" style = "background-color:${water[a][0]};top:8.5vw;"></div>
                <div class="colors" style = "background-color:${water[a][1]};top:6vw;"></div>
                <div class="colors" style = "background-color:${water[a][2]};top:3.5vw;"></div>
                <div class="colors" style = "background-color:${water[a][3]};top:1vw;"></div>`;
    }, 1050);
}

function WaterInc(p, q, b, count) {
    q[1] = 4 - q[1];
    q[1] -= (q[0] != "transparent" ? 1 : 0);
    document.getElementsByClassName("test-tube")[b].innerHTML += `<div id = "colorful-bg" style = "background-color:${p[0]};top:calc(1vw + ${q[1] * 2.5}vw);"></div>`;
    setTimeout(function () {
        document.getElementById("colorful-bg").style.height = count * 2.5 + 0.1 + "vw";
        document.getElementById("colorful-bg").style.top = `calc(1vw + ${q[1] * 2.5}vw - ${count * 2.5}vw)`;
    }, 50);
}

/* =========================
    Leaderboard update
 ========================= */
  // to add firebase leaderboard (save record)
  window.saveScore = async function () {
    text = `tubes:${TOTAL_TUBES}, Colors:${TOTAL_TUBES - 2}`;
    console.log("window.saveScore", text);
    let gsize = `${TOTAL_TUBES}x${TOTAL_TUBES - 2}`;
    if (difficulty.toUpperCase() === "EASY") {
      score = (Number(TOTAL_TUBES) * (Number(TOTAL_TUBES) - 2) * 100 - moves * 1 - Math.floor(Number(elapsedTime) / 1000) + undoCount * 10) * 1;
    } else if (difficulty.toUpperCase() === "MEDIUM") {
      score = (Number(TOTAL_TUBES) * (Number(TOTAL_TUBES) - 2) * 100 - moves * 1 - Math.floor(Number(elapsedTime) / 1000) + undoCount * 10) * 1.5;
    } else if (difficulty.toUpperCase() === "HARD") {
      score = (Number(TOTAL_TUBES) * (Number(TOTAL_TUBES) - 2) * 100 - moves * 1 - Math.floor(Number(elapsedTime) / 1000) + undoCount * 10) * 2;
    }
    try {
      await addDoc(collection(db, "leaderboard"), {
        game_id: game_id || 'watersort',
        game: game || 'watersort',
        name: player1 || 'Guast',
        opponent: opponent || "-",
        difficulty: difficulty || "-",
        size: `${TOTAL_TUBES}x${TOTAL_TUBES - 2}`,
        elapsed: Math.floor(Number(elapsedTime) / 1000) || 0,
        score: score || 0,
        moves: moves || 0,
        email: email || "-",
        level: currentLevel || "-",
        mode: playMode || '-',
        text: text || "-",
        createdAt: new Date()
      });

      console.log("Score Saved!");

    } catch (error) {
      console.error("Error:", error);
    }

  };

  // this function is updated leader board
function updateleaderboard() {
    // let opponent = player2;
    let game_id = gameName;
    let gsize = `${noOfTubes+2}x${color}`;
    let elapsed = hours * 3600 + minutes * 60 + seconds;
    let filed1 = 0;
    let filed2 = 0;
    let filed3 = `tube=${noOfTubes}`;
    let filed4 = `color=${color}`;
    let difficulty = heading;
    let email = localStorage.getItem('email') || '-';
    const created_at = new Date();
    // score = (noOfTubes * noOfTubes) * 10 - moves * 1;
    let player_name = player1;
    let player_opponent = "-";
    lcsaveToLeaderboard(player_name, player_opponent, email, gsize, difficulty, game_id, score, elapsed, moves, filed1, filed2, filed3, filed4, created_at)

    // saveScore(player_name, player_opponent, email, gsize, difficulty, game_id, score, elapsed, moves, filed1, filed2, filed3, filed4, created_at);
}

//these para to play sound
function playSound(sound) {
    if (sound == 'water') {
        var beep = new Audio('../../assets/sound/water-flow1.mp3');
    } else if (sound == 'win') {
        var beep = new Audio('../../assets/sound/winner-trumpets.mp3');
    } else if (sound == 'loose') {
        var beep = new Audio('../../assets/sound/Looser.mp3');
    } else if (sound == 'start') {
        var beep = new Audio('../../assets/sound/game-start-1.mp3');
    }
    beep.play();
}