import { shareScore } from './share.js';
import { textToSpeechEng } from './speak.js';
import { playSound } from './sound.js';
import { saveScore } from '../../../leaderboard/gbleaderboard.js';
import { lcrenderLeaderboard, lcsaveToLeaderboard } from '../../../leaderboard/lcleaderboard.js';
// to add firebase leaderboard
import { db } from "../../../leaderboard/firebase-config.js";
import { addDoc, collection, serverTimestamp } from
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let game = "Water Sort";
let game_id = "watersort";
let opponent, difficulty, elapsed, moves, level, date;

export let gameName = 'watersort';
export let score = 0;
export let gameState = [];
export let noofFireWorks = 10;
export let player1 = localStorage.getItem('player_name') || getUserName();
export let winnerName = player1;
let h = 0;
let m = 0;
let s = 0;
let text = `tubes:4, Colors:2`;
let playMode = "-";

document.addEventListener('DOMContentLoaded', () => {
  const loading = document.getElementById('loading');
  loading.style.display = 'none';
  lcrenderLeaderboard();

  // const timeDisplay = document.getElementById('timer-display');
  const movesDisplay = document.getElementById('moves');
  const startBtn = document.getElementById('startBtn');
  const restartBtn = document.getElementById('restartBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const resumeBtn = document.getElementById('resumeBtn');
  const undoBtn = document.getElementById('undoBtn');
  const difficultySel = document.getElementById("difficultySel");
  const pauseOverlay = document.getElementById("pauseOverlay");
  const fireworkscanvas = document.getElementById('fireworksCanvas');
  const ctxfireworks = fireworkscanvas.getContext('2d');
  fireworkscanvas.width = window.innerWidth;
  fireworkscanvas.height = window.innerHeight;

  let selected = null;
  // let savedLevel = 1;
  let currentLevel = 1;
  let moves = 0;
  let undoCount = 2;
  let difficulty = difficultySel.value;
  let TUBE_SIZE = 4;
  let TOTAL_TUBES;
  let currentMode = TOTAL_TUBES;
  let originalLevelData = null;
  let levelData;

  const AVAILABLE_COLORS = ["#FF0000", "#8b0000", "#00FF00", "#006400", "#00bfff", "#0000FF", "#000080", "#ffd700", "#bdb76b", "#00FFFF", "#FF00FF", "#9932cc"];
  const statusText = document.getElementById("output");
  const select = document.getElementById("tubeSelect");
  TOTAL_TUBES = select.value;
  currentMode = TOTAL_TUBES;
  let colors = select.value - 2;
  statusText.innerHTML = `Level:${currentLevel} (${TOTAL_TUBES} ${difficulty.toUpperCase()}), New game started, Click on the tube liquid transfer from`;
  document.getElementById("leveldisplay").textContent = `${currentLevel} ${difficulty.toUpperCase()}`;
  updateUndoCount();
  toggleElement(pauseBtn, true);
  toggleElement(restartBtn, true);
  toggleElement(undoBtn, true);
  toggleElement(startBtn, false);
  toggleElement(select, false);
  toggleElement(difficultySel, false);

  // timer function with system time and pasue resume
  // timer function variables
  let startTime;
  let elapsedTime = 0;
  let timerInterval;
  let isPaused = false;

  //Timer Start Function
  function startTimer() {
    clearInterval(timerInterval);
    isPaused = false;

    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(function () {
      elapsedTime = Date.now() - startTime;
      print(timeToString(elapsedTime));
    }, 1000);
  }

  //Timer Pause
  pauseBtn.onclick = () => {
    if (!isPaused) {
      // Pause logic
      clearInterval(timerInterval);
      isPaused = true;
      pauseOverlay.style.display = "flex"
    }
  }

  //Timer Stop function
  function stopTimer() {
    clearInterval(timerInterval);
    elapsedTime = 0;
  }

  //Timer resume
  resumeBtn.onclick = () => {
    // Resume logic
    isPaused = false;

    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(() => {
      elapsedTime = Date.now() - startTime;
      print(timeToString(elapsedTime));
    }, 1000);
    pauseOverlay.style.display = "none"
  }

  // prepare time to display in hh:mm:ss
  function timeToString(time) {
    h = Math.floor(time / 3600000);
    m = Math.floor((time % 3600000) / 60000);
    s = Math.floor((time % 60000) / 1000);

    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  //display time
  function print(txt) {
    document.getElementById("timer-display").innerHTML = txt;
  }

  // change no of tube
  select.onchange = () => {
    const count = parseInt(select.value);
    TOTAL_TUBES = select.value;
    difficulty = difficultySel.value;
    currentMode = TOTAL_TUBES;
    colors = select.value - 2;
    if (TOTAL_TUBES == 4) {
      if (difficulty == "medium" || difficulty == "hard") {
        difficulty = "easy";
        statusText.innerHTML = `No of tubes Changed to ${TOTAL_TUBES} tubes only easy difficulty availabe<br> Level:${currentLevel} (${TOTAL_TUBES} tubes Easy), Press new game button to start game`;
        document.getElementById("leveldisplay").textContent = `${currentLevel} ${difficulty.toUpperCase()}`;
      } else {
        statusText.innerHTML = `No of tubes Changed to ${TOTAL_TUBES} tubes <br> Level:${currentLevel} (${TOTAL_TUBES} ${difficulty.toUpperCase()}), press New game button to start game`;
        document.getElementById("leveldisplay").textContent = `${currentLevel} ${difficulty.toUpperCase()}`;
      }
    } else if (TOTAL_TUBES == 5) {
      if (difficulty == "hard") {
        difficulty = "medium";
        statusText.innerHTML = `No of tubes Changed to ${TOTAL_TUBES} tubes hard difficulty not availabe<br> Level:${currentLevel} (no of tubes = ${TOTAL_TUBES} medium), Press new game button to start game`;
        document.getElementById("leveldisplay").textContent = `${currentLevel} ${difficulty.toUpperCase()}`;
      } else {
        statusText.innerHTML = `No of tubes Changed to ${TOTAL_TUBES} tubes <br> Level:${currentLevel} (${TOTAL_TUBES} ${difficulty.toUpperCase()}), press New game button to start game`;
        document.getElementById("leveldisplay").textContent = `${currentLevel} ${difficulty.toUpperCase()}`;
      }
    } else {
      statusText.innerHTML = `No of tubes Changed to ${TOTAL_TUBES} tubes <br> Level:${currentLevel} (${TOTAL_TUBES} ${difficulty.toUpperCase()}), press New game button to start game`;
      document.getElementById("leveldisplay").textContent = `${currentLevel} ${difficulty.toUpperCase()}`;
    }
  };

  // change difficulty
  difficultySel.onchange = () => {
    difficulty = difficultySel.value;
    if (TOTAL_TUBES == 4) {
      if (difficulty == "medium" || difficulty == "hard") {
        statusText.innerHTML = `Difficulty level medium/hard not availabe in no of tubes = ${TOTAL_TUBES}<br> Level:${currentLevel} (${TOTAL_TUBES} tubes Easy), Press new game button to start game`;
        document.getElementById("leveldisplay").textContent = `Level ${currentLevel}`;
        difficulty = "easy";
      }
    } else if (TOTAL_TUBES == 5) {
      if (difficulty == "hard") {
        difficulty = "medium";
        statusText.innerHTML = `Difficulty level hard not availabe in no of tubes = ${TOTAL_TUBES} medium)<br> Level:${currentLevel} (no of tubes = ${TOTAL_TUBES}), Press new game button to start game`;
        document.getElementById("leveldisplay").textContent = `${currentLevel} ${difficulty.toUpperCase()}`;
      }
    } else {
      statusText.innerHTML = `Difficulty level change to ${difficulty.toUpperCase()} <br> Level:${currentLevel} (${TOTAL_TUBES} tubes ${difficulty.toUpperCase()}), Press new game button to start game`;
      document.getElementById("leveldisplay").textContent = `${currentLevel} ${difficulty.toUpperCase()}`;
    }
  };

  //start game
  startBtn.addEventListener('click', () => {
    moves = 0;
    movesDisplay.textContent = moves;
    stopTimer();
    newGame();
  });

  //restart game
  restartBtn.addEventListener('click', () => {
    playSound('loose');

    const newLevel = startGame(gameLevels, currentMode, difficulty)

    moves = 0;
    movesDisplay.textContent = moves;
    elapsedTime = 0;
    updateUndoCount();
    startTimer();
    gameState = [];

    if (!originalLevelData) return;

    console.log("Restarting Level:", currentLevel);

    // 🔥 fresh copy फिर से load करो
    gameState = JSON.parse(JSON.stringify(originalLevelData));
    history = [];
    selected = null;
    buildBoard();
    renderGame();
  });

  //new game setup
  function newGame() {
    moves = 0;
    elapsedTime = 0;
    updateUndoCount();
    startTimer();

    gameState = [];
    const pickedColors = pickColorsForGame();

    for (let i = 0; i < TOTAL_TUBES; i++) gameState.push([]);

    const newLevel = startGame(gameLevels, currentMode, difficulty)
    document.getElementById("leveldisplay").textContent = `${currentLevel} (${difficulty.toUpperCase()})`;

    console.log(newLevel);

    for (let i = 0; i < newLevel.tubes.length - 2; i++) {
      for (let j = 0; j < TUBE_SIZE; j++) {
        gameState[i][j] = pickedColors[newLevel.tubes[i][j]];
      }
    }

    //ORIGINAL GAME SAVE (deep copy)
    originalLevelData = JSON.parse(JSON.stringify(gameState));

    statusText.innerHTML = `Click on the tube liquid transfer from`;

    toggleElement(pauseBtn, false);
    toggleElement(restartBtn, false);
    toggleElement(undoBtn, false);
    toggleElement(startBtn, true);
    toggleElement(select, true);
    toggleElement(difficultySel, true);

    history = [];
    buildBoard();
    renderGame();
  }

  function pickColorsForGame() {
    const colorCount = TOTAL_TUBES - 2;

    if (AVAILABLE_COLORS.length < colorCount) {
      throw new Error("Not enough colors in AVAILABLE_COLORS");
    }

    // shuffle available colors
    const shuffled = [...AVAILABLE_COLORS].sort(() => Math.random() - 0.5);

    // pick exact required colors
    return shuffled.slice(0, colorCount);
  }

  function buildBoard() {
    const board = document.getElementById("board");
    board.innerHTML = "";

    gameState.forEach((_, i) => {
      const tube = document.createElement("div");
      tube.className = "tube";
      tube.dataset.index = i;
      tube.onclick = () => handleClick(i);
      board.appendChild(tube);
    });
  }

  //when click on tube
  function handleClick(i) {
    const tubes = document.querySelectorAll(".tube");

    // First selection
    if (selected === null) {
      if (!gameState[i].length) return;

      statusText.innerHTML = `Click on the tube liquid transfer to`;

      playSound('click');
      selected = i;
      tubes[i].classList.add("selected");
      return;
    }

    // if clicked on previous selected
    if (selected === i) {
      playSound('error');
      tubes[selected].classList.remove("selected");
      selected = null;
      return;
    }

    //if top color of boath tube not same
    if (!canPour(selected, i)) {
      playSound('error');
      statusText.innerHTML = `Click on the tube liquid transfer from`;
      tubes[selected].classList.remove("selected");
      selected = null;
      return;
    }

    //if top color of both tube ise same
    playSound('click');
    animateTubePour(selected, i);
    selected = null;
    statusText.innerHTML = `Click on the tube liquid transfer from`;
  }

  function renderGame() {
    document.querySelectorAll(".tube").forEach((tube, i) => {
      tube.innerHTML = "";
      gameState[i].forEach((c, index) => {
        const d = document.createElement("div");
        if (index == 0) { d.classList.add("layerBottom"); };
        d.classList.add("layer");
        // d.style.background = c;
        const color1 = changeHexColor(c, 10);
        const color2 = changeHexColor(c, 40);
        const color3 = "#2980b9";
        // const color4 = "#2c3e50";
        let angle = Math.floor(Math.random() * (145 - 125 + 1)) + 125;
        d.style.backgroundImage = `linear-gradient(${angle}deg, ${color1}, ${color2}, ${color3})`
        d.textContent = AVAILABLE_COLORS.indexOf(c);
        tube.appendChild(d);
      });
    });
  }

  function changeHexColor(hex, amount) {
    // '#' ko hatayein agar hai to
    hex = hex.replace('#', '');

    // Red, Green, Blue ko integer mein badlein
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // Sankhya jodein ya ghatayein (0-255 ki limit mein)
    r = Math.min(255, Math.max(0, r + amount));
    g = Math.min(255, Math.max(0, g + amount));
    b = Math.min(255, Math.max(0, b + amount));

    // Wapas Hex string banayein
    const newHex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return newHex;
  }

  function getTopColor(i) {
    const t = gameState[i];
    return t.length ? t[t.length - 1] : null;
  }

  function canPour(from, to) {
    if (from === to) return false;
    if (!gameState[from].length) return false;
    if (gameState[to].length === TUBE_SIZE) return false;

    const c1 = getTopColor(from);
    const c2 = getTopColor(to);

    return !c2 || c1 === c2;
  }

  function animateTubePour(from, to) {
    const tubes = document.querySelectorAll(".tube");
    const src = tubes[from];
    const tgt = tubes[to];

    src.classList.add("pouring");

    const s = src.getBoundingClientRect();
    const t = tgt.getBoundingClientRect();
    let dx = 0;
    let dy = 0;

    const angle = getRotateDirection(s, t);

    if (angle > 0) {
      dx =
        (t.left + t.width / 2) -
        (s.left + s.width / 2) - 90;
    } else {
      dx =
        (t.left + t.width / 2) -
        (s.left + s.width / 2) + 90;
    }

    const MOUTH_OFFSET = 150;
    dy =
      (t.top + 5) -
      (s.top + MOUTH_OFFSET);

    src.style.transform = `
    translate(${dx}px, ${dy}px)
    rotate(${angle}deg)
  `;

    setTimeout(() => {
      finalizePour(from, to);
      finalizePour(from, to);
      finalizePour(from, to);
    }, 300);

    setTimeout(() => {
      src.style.transform = "";
      src.classList.remove("pouring");
      src.classList.remove("selected");
    }, 600);
  }

  function finalizePour(from, to) {
    const fromTube = gameState[from];
    const toTube = gameState[to];

    if (!fromTube.length || toTube.length === TUBE_SIZE) return;

    const color = fromTube[fromTube.length - 1];
    if (toTube.length && toTube[toTube.length - 1] !== color) return;

    saveUndo();
    playSound('flow');
    fromTube.pop();
    toTube.push(color);

    moves++;
    movesDisplay.textContent = moves;
    renderGame();
    checkTubeCompleted(to);
    checkWin();

    if (checkNoMovesLeft()) {
      handleGameOver();
    }
  }

  function getRotateDirection(srcRect, tgtRect) {
    const dropPosition = window.innerWidth - (window.innerWidth - (tgtRect.left + tgtRect.width / 2));
    const diff = (window.innerWidth - 20) - dropPosition;

    return diff < 200 ? 90 : -90;
  }

  let history = [];

  function saveUndo() {
    history.push(JSON.stringify(gameState));
  }

  function undo() {
    if (!history.length) return;
    if (undoCount < 0) return;
    gameState = JSON.parse(history.pop());
    undoCount--;
    if (undoCount < 0) {
      undoBtn.textContent = `↩️ Undo(0)`;
      statusText.innerHTML = `No undo left <br> Click on the tube liquid transfer  from`;
    } else {
      undoBtn.textContent = `↩️ Undo(${undoCount})`;
      statusText.innerHTML = `Undo Last Move, Left only ${undoCount} undo <br> Click on the tube liquid transfer from`;
    }
    renderGame();
  }

  function updateUndoCount() {
    if (TOTAL_TUBES == 4) { undoCount = 1; }
    else if (TOTAL_TUBES == 5) { undoCount = 1; }
    else if (TOTAL_TUBES == 6) { undoCount = 2; }
    else if (TOTAL_TUBES == 7) { undoCount = 2; }
    else if (TOTAL_TUBES == 8) { undoCount = 3; }
    else if (TOTAL_TUBES == 9) { undoCount = 3; }
    else if (TOTAL_TUBES == 10) { undoCount = 4; }
    else if (TOTAL_TUBES == 11) { undoCount = 4; }
    else if (TOTAL_TUBES == 12) { undoCount = 4; }
    else if (TOTAL_TUBES == 13) { undoCount = 5; }
    else if (TOTAL_TUBES == 14) { undoCount = 5; }

    undoBtn.textContent = `↩️ Undo(${undoCount})`;
  }

  undoBtn.addEventListener('click', undo);

  function checkWin() {
    const win = gameState.every(t =>
      t.length === 0 ||
      (t.length === TUBE_SIZE && t.every(c => c === t[0]))
    );

    if (win) {
      playSound('win');
      launchConfetti();
      setTimeout(() => {
        shareScore(gameName, score);
      }, 2500);
      updateleaderboard();
      stopTimer();
      window.saveScore();
      statusText.textContent = `🎉 ${player1}Win! 🎉`;
      toggleElement(pauseBtn, true);
      toggleElement(restartBtn, true);
      toggleElement(undoBtn, true);
      toggleElement(startBtn, false);
      toggleElement(select, false);
      toggleElement(difficultySel, false);

      let nextLevel = levelCompleted(currentMode, difficulty);
      let newLevelData = getLevelData(gameLevels, currentMode, difficulty, nextLevel);

      statusText.innerHTML = `Mode ${TOTAL_TUBES} Tubes: Level ${currentLevel} ${difficulty.toUpperCase()} Completed! <br> Click New Game to play next Level ${nextLevel} ${difficulty.toUpperCase()}`;
    }
  }

  function checkNoMovesLeft() {
    const n = gameState.length;

    for (let i = 0; i < n; i++) {
      const src = gameState[i];
      if (!Array.isArray(src) || src.length === 0) continue;

      const srcTop = src[src.length - 1];

      for (let j = 0; j < n; j++) {
        if (i === j) continue;

        const tgt = gameState[j];
        if (!Array.isArray(tgt)) continue;

        if (tgt.length >= TUBE_SIZE) continue;

        if (tgt.length === 0) {
          return false;
        }

        const tgtTop = tgt[tgt.length - 1];

        if (tgtTop === srcTop) {
          return false;
        }
      }
    }

    return true;
  }

  function handleGameOver() {
    playSound("loose");

    setTimeout(() => {
      statusText.textContent = "😢 You Loose! No moves left! Press Restart to play same game again.";
    }, 300);
  }

  // button disable/enable
  function toggleElement(elementId, isDisable) {

    if (elementId) {
      elementId.disabled = isDisable;
      if (isDisable) {
        elementId.style.opacity = "0.5";
        elementId.style.cursor = "not-allowed";
        elementId.style.pointerEvents = "visiable";
      } else {
        elementId.style.opacity = "1";
        elementId.style.cursor = "pointer";
        elementId.style.pointerEvents = "auto";
      }
    } else {
      console.error(`Element with ID=${elementId} not found.`);
    }
  }

  //che any one tube is full with all same colors
  function checkTubeCompleted(index) {
    const tube = gameState[index];
    if (
      tube.length === TUBE_SIZE &&
      tube.every(c => c === tube[0])
    ) {
      const tubeEl = document.querySelector(
        `.tube[data-index='${index}']`
      );
      if (tubeEl) {
        tubeCracker(tubeEl);
        // playSound("fire3");
        textToSpeechEng("tube completed");
      }
    }
  }

  //resize window
  window.addEventListener("resize", () => {
    fireworkscanvas.width = window.innerWidth;
    fireworkscanvas.height = window.innerHeight;
  });

  /* =========================
   CONFETTI CELEBRATION
========================= */
  let confetti = [];
  function launchConfetti() {
    for (let i = 0; i < 250; i++) {
      confetti.push({
        x: Math.random() * fireworkscanvas.width,
        y: Math.random() * -fireworkscanvas.height,
        vx: (Math.random() - 0.5) * 5,
        vy: Math.random() * 5 + 2,
        size: Math.random() * 6 + 4,
        color: generateRandomNeonColor()
      });
    }
    animateConfetti();
  }

  function generateRandomNeonColor() {
    const hue = Math.floor(Math.random() * 361); // Random hue (0-360)
    const saturation = 100; // Full saturation (100%)
    const lightness = 50; // Moderate lightness (50%) for full color intensity
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  function animateConfetti() {
    let anim = setInterval(() => {
      ctxfireworks.clearRect(0, 0, fireworkscanvas.width, fireworkscanvas.height);
      confetti.forEach(c => {
        c.x += c.vx;
        c.y += c.vy;
        c.vy += 0.1;
        ctxfireworks.save();
        ctxfireworks.fillStyle = c.color;
        ctxfireworks.shadowColor = c.color;
        ctxfireworks.shadowBlur = 15;
        ctxfireworks.shadowOffsetX = 0;
        ctxfireworks.shadowOffsetY = 0;
        if (Math.floor(Math.random() * 10) < 5) {
          //darw rectangle
          ctxfireworks.fillRect(c.x, c.y, c.size, c.size);
        } else {
          //darw circle
          ctxfireworks.beginPath();
          ctxfireworks.arc(c.x, c.y, 5, 0, Math.PI * 2);
          ctxfireworks.fill();
        }
        //draw riangle
        // drawPolygon(ctx, this.x, this.y, 3, 4);
        //draw square
        //drawPolygon(ctx, this.x, this.y, 4, 4); 
        ctxfireworks.restore();
      });

      if (confetti.length === 0) {
        clearInterval(anim);
      }
    }, 50);
  }

  /* =========================
    Leaderboard update
 ========================= */
  // to add firebase leaderboard (save record)
  window.saveScore = async function () {
    text = `tubes:${TOTAL_TUBES}, Colors:${TOTAL_TUBES - 2}`;

    try {
      await addDoc(collection(db, "leaderboard"), {
        game_id: game_id || 'watersort',
        game: game || 'Water Sort',
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
    let opponent = "-"
    let game_id = gameName;
    let gsize = `${TOTAL_TUBES}x${TOTAL_TUBES - 2}`;
    let elapsed = Math.floor(Number(elapsedTime) / 1000);
    // let difficulty = level;
    // moves = 0;
    let filed1 = 0;
    let filed2 = 0
    let filed3 = `Level=${currentLevel}`;
    let filed4 = `tube=${TOTAL_TUBES}, color=${TOTAL_TUBES - 2}`;
    let email = localStorage.getItem('email') || '-';
    const created_at = new Date();
    if (difficulty.toUpperCase() === "EASY") {
      score = (Number(TOTAL_TUBES) * (Number(TOTAL_TUBES) - 2) * 100 - moves * 1 - Math.floor(Number(elapsedTime) / 1000) + undoCount * 10) * 1;
    } else if (difficulty.toUpperCase() === "MEDIUM") {
      score = (Number(TOTAL_TUBES) * (Number(TOTAL_TUBES) - 2) * 100 - moves * 1 - Math.floor(Number(elapsedTime) / 1000) + undoCount * 10) * 1.5;
    } else if (difficulty.toUpperCase() === "HARD") {
      score = (Number(TOTAL_TUBES) * (Number(TOTAL_TUBES) - 2) * 100 - moves * 1 - Math.floor(Number(elapsedTime) / 1000) + undoCount * 10) * 2;
    }

    lcsaveToLeaderboard(player1, opponent, email, gsize, difficulty, game_id, score, elapsed, moves, filed1, filed2, filed3, filed4, created_at)

    saveScore(player1, opponent, email, gsize, difficulty, game_id, score, elapsed, moves, filed1, filed2, filed3, filed4, created_at);
  }

  // this code for load/get/save levels dat from json file
  // variable to strore all level data
  let gameLevels = {};
  //get current level data (as per tubes & difficulty) 
  function getLevelData(data, currentMode, difficulty, levelNumber = 1) {
    console.log(data, currentMode, difficulty, levelNumber)

    const modeKey = `mode_${currentMode}_tubes`;

    const levels = data[modeKey];

    // difficulty filter
    const filtered = levels.filter(l => l.difficulty === difficulty);

    // specific level
    const levelData = filtered.find(l => l.level === levelNumber);
    console.log(levelData)

    return levelData;
  }
  //save level played progress on level completd
  function saveProgress(currentMode, difficulty, level) {
    const key = `progress_${currentMode}_${difficulty}`;
    localStorage.setItem(key, level);
  }
  //load level progress on current device or start initial level
  function loadProgress(currentMode, difficulty) {
    const key = `progress_${currentMode}_${difficulty}`;
    if (difficulty == "easy") {
      return parseInt(localStorage.getItem(key)) || 1;
    } else if (difficulty == "medium") {
      return parseInt(localStorage.getItem(key)) || 51;
    } else if (difficulty == "hard") {
      return parseInt(localStorage.getItem(key)) || 101;
    }
  }
  //load current level data before start game 
  function startGame(data, currentMode, difficulty) {
    currentLevel = loadProgress(currentMode, difficulty);

    let levelData = getLevelData(data, currentMode, difficulty, currentLevel);

    return levelData;
  }
  //level completed function - load next level and save progress
  function levelCompleted(currentMode, difficulty) {
    let currentLevel = loadProgress(currentMode, difficulty);

    currentLevel++;

    console.log("Completed Level:", currentLevel);

    saveProgress(currentMode, difficulty, currentLevel);

    return currentLevel;
  }

  // load json file data
  async function loadLevelsData() {
    try {
      const response = await fetch('js/multi_mode_levels.json');
      if (!response.ok) throw new Error("Jason file not found");

      gameLevels = await response.json();
      console.log("Levels Loaded Successfully!");

    } catch (error) {
      console.error("Error loading JSON:", error);
    }
  }

  window.onload = loadLevelsData();

});

function getUserName() {
  const userData = localStorage.getItem("user");
  if (!userData) return `Guest`;

  const user = JSON.parse(userData);
  return user.name || `Guest`;
}