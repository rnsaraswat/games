import { shareScore } from './share.js';
import { textToSpeechEng } from './speak.js';
import { playSound } from './sound.js';
import { saveScore } from '../../../leaderboard/gbleaderboard.js';
import { lcrenderLeaderboard, lcsaveToLeaderboard } from '../../../leaderboard/lcleaderboard.js';
// to add firebase leaderboard
import { db } from "../../../leaderboard/firebase-config.js";
import { addDoc, collection, serverTimestamp } from
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let gameFullName = "Block Sort";
let game_id = "blocksort";
let opponent, difficulty, elapsed, moves, level, date;
export let gameName = 'blocksort';
export let score = 0;
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

  const movesDisplay = document.getElementById('moves');
  const restartBtn = document.getElementById('restartBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const resumeBtn = document.getElementById('resumeBtn');
  const undoBtn = document.getElementById('undoBtn');
  const modeSelectBtn = document.getElementById("modeSelect");
  const difficultySel = document.getElementById("difficultySel");
  const pauseOverlay = document.getElementById("pauseOverlay");

  let colors = [];
  let tubes = [];
  const MAX_HEIGHT = 4;

  let selected = null;
  let fromIndex = null;
  let history = [];
  let moves = 0;
  let isAnimating = false;


  let levelData;
  let currentLevel = 1;
  let undoCount = 2;
  let currentDifficulty = difficultySel.value;
  let colorCount = 2;
  let currentMode = colorCount + 2;

  const AVAILABLE_COLORS = ["#FFFF00", "#008080", "#FF0000", "#8b0000", "#00FF00", "#006400", "#00bfff", "#0000FF", "#000080", "#ffd700", "#bdb76b", "#00FFFF", "#FF00FF", "#800080", "#9932cc", "#808000", "#FFA500", "#fa8072", "#c71585", "#FFC0CB"];

  const statusText = document.getElementById("output");
  colorCount = parseInt(modeSelectBtn.value);
  currentMode = currentMode = colorCount + 2;
  statusText.innerHTML = `Level:${currentLevel} (${currentMode} ${currentDifficulty.toUpperCase()}), New game started, Click on the tube liquid transfer from`;
  document.getElementById("leveldisplay").textContent = `${currentLevel} ${currentDifficulty.toUpperCase()}`;
  updateUndoCount();
  toggleElement(pauseBtn, true);
  toggleElement(restartBtn, true);
  toggleElement(undoBtn, true);

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

  //Timer Stop function
  function stopTimer() {
    clearInterval(timerInterval);
    elapsedTime = 0;
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

  //change mode (no of colors)
  modeSelectBtn.onchange = () => {
    colorCount = parseInt(modeSelectBtn.value);
    currentDifficulty = difficultySel.value;
    currentMode = colorCount + 2;
    if (currentMode == 4) {
      if (currentDifficulty == "medium" || currentDifficulty == "hard") {
        currentDifficulty = "easy";
      }
    } else if (currentMode == 5) {
      if (currentDifficulty == "hard") {
        currentDifficulty = "medium";
      }
    }
    renderLevels();
  };

  // change difficulty
  difficultySel.onchange = () => {
    // const diff = this.value;
    currentDifficulty = difficultySel.value;
    if (currentMode == 4) {
      if (currentDifficulty == "medium" || currentDifficulty == "hard") {
        currentDifficulty = "easy";
      }
    } else if (currentMode == 5) {
      if (currentDifficulty == "hard") {
        currentDifficulty = "medium";
      }
    }
    const section = document.getElementById(`section_${currentDifficulty}`);

    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    // renderLevels();
  };

  //restart game
  restartBtn.addEventListener('click', () => {
    window.Restart();
  });

  window.Restart = function () {
    playSound('loose');
    stopTimer();

    // const newLevel = loadModeProgress(TOTAL_TUBES);

    moves = 0;
    movesDisplay.textContent = moves;
    elapsedTime = 0;
    updateUndoCount();
    startTimer();
    selected = null;
    const pickedColors = startGame(currentMode, currentDifficulty, currentLevel);
    for (let i = 0; i < pickedColors.tubes.length - 2; i++) {
      for (let j = 0; j < MAX_HEIGHT; j++) {
        tubes[i][j] = AVAILABLE_COLORS[pickedColors.tubes[i][j]];
      }
    }
    history = [];
    render();
    calculateGrid();
  }

  //start game
  function newGame() {
    moves = 0;
    updateUndoCount();
    startTimer();

    colors = [];
    colors = pickColorsForGame();

    tubes = [];
    // solved state
    colors.forEach(color => {
      tubes.push([color, color, color, color]);
    });

    // add 2 empty tubes
    tubes.push([]);
    tubes.push([]);

    const pickedColors = levelData;
    currentLevel = levelData.level;
    currentDifficulty = levelData.difficulty;
    currentMode = levelData.tubes.length;

    for (let i = 0; i < pickedColors.tubes.length - 2; i++) {
      for (let j = 0; j < MAX_HEIGHT; j++) {
        tubes[i][j] = AVAILABLE_COLORS[pickedColors.tubes[i][j]];
      }
    }
    document.getElementById("leveldisplay").textContent = `${currentLevel} (${currentDifficulty.toUpperCase()}) ${currentMode - 2} colors`;

    statusText.innerHTML = `Click/tap on the tube/top color block to transfer`;

    toggleElement(pauseBtn, false);
    toggleElement(restartBtn, false);
    toggleElement(undoBtn, false);

    history = [];
    render();
    calculateGrid();
  }

  //pick random colors from array
  function pickColorsForGame() {
    if (AVAILABLE_COLORS.length < colorCount) {
      throw new Error("Not enough colors in AVAILABLE_COLORS");
    }

    // shuffle available colors
    const shuffled = [...AVAILABLE_COLORS].sort(() => Math.random() - 0.5);

    // pick exact required colors
    return shuffled.slice(0, colorCount);
  }

  //set size as per no of tubes
  function calculateGrid() {

    const container = document.getElementById("game");
    const count = tubes.length;

    const cols = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / cols);

    container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  }

  // ---------------- CLICK on tube ----------------
  game.addEventListener("click", function (e) {

    if (isAnimating) return;

    const tubeDiv = e.target.closest(".tube");
    if (!tubeDiv) return;

    const index = parseInt(tubeDiv.dataset.index);

    // SELECT block
    if (selected === null) {
      if (tubes[index].length === 0) return;

      selected = tubes[index][tubes[index].length - 1];
      fromIndex = index;
      highlight(index);
      playSound("click");
      statusText.innerHTML = `Click on the tube where transfer block`;
    }

    // DROP block
    else {
      if (isValidMove(fromIndex, index)) {
        animateMove(fromIndex, index);
      }
      clearHighlight();
      selected = null;
      fromIndex = null;
      playSound("error")
      statusText.innerHTML = `Click on the tube top block transfer`;

    }
  });

  //check both top block are same colors
  function isMovePossible() {
    // Check if any tube is empty
    const hasEmpty = tubes.some(tube => tube.length === 0);
    // Check matching top colors
    for (let i = 0; i < tubes.length; i++) {
      for (let j = 0; j < tubes.length; j++) {

        if (i === j) continue;

        if (isValidMove(i, j)) {
          return true;
        }
      }
    }
    return false;
  }

  //check no move possibe (no empty tube and tap colors are not same)
  function checkGameOver() {
    const hasEmpty = tubes.some(tube => tube.length === 0);
    const moveLeft = isMovePossible();

    if (!hasEmpty && !moveLeft) {
      stopTimer();

      // setTimeout(() => {
        // alert("❌ No Moves Left! Game Over");
        statusText.innerHTML = `No Moves Left! Game Over, Press restart to play again`;
      // }, 300);
    }
  }

  //check tube full with smae colors
  function isTubeComplete(tube) {

    if (tube.length !== MAX_HEIGHT) return false;

    return tube.every(color => color === tube[0]);
  }

  // ---------------- VALIDATION for top colors ----------------
  function isValidMove(from, to) {

    if (from === to) return false;
    if (tubes[to].length >= MAX_HEIGHT) return false;

    const movingColor = tubes[from][tubes[from].length - 1];
    const targetTop = tubes[to][tubes[to].length - 1];

    if (!targetTop) return true;
    return movingColor === targetTop;
  }

  // ---------------- BLOCK ANIMATION ----------------
  function animateMove(from, to) {
    isAnimating = true;

    const fromTube = document.querySelectorAll(".tube")[from];
    const toTube = document.querySelectorAll(".tube")[to];
    const blockEl = fromTube.lastElementChild;

    const startRect = blockEl.getBoundingClientRect();
    const fromRect = fromTube.getBoundingClientRect();
    const toRect = toTube.getBoundingClientRect();

    const clone = blockEl.cloneNode(true);
    document.body.appendChild(clone);

    clone.style.position = "fixed";
    clone.style.left = startRect.left + "px";
    clone.style.top = startRect.top + "px";
    clone.style.width = startRect.width + "px";
    clone.style.height = startRect.height + "px";
    clone.style.margin = 0;
    clone.style.zIndex = 1000;

    blockEl.style.visibility = "hidden";

    const highestTubeTop = Math.min(fromRect.top, toRect.top);
    const liftHeight = highestTubeTop - 80; // both tubes se upar

    const targetX = toRect.left + (toRect.width / 2 - startRect.width / 2);

    const blockHeight = startRect.height;
    const targetY = toRect.bottom - (tubes[to].length + 1) * blockHeight - 5;

    const duration = 700;
    let startTime = null;

    function animate(time) {

      if (!startTime) startTime = time;
      const progress = (time - startTime) / duration;

      if (progress < 0.33) {
        // Phase 1 – Lift Up
        const p = progress / 0.33;
        clone.style.top =
          startRect.top - p * (startRect.top - liftHeight) + "px";
      }
      else if (progress < 0.66) {
        // Phase 2 – Move Horizontal (at top)
        const p = (progress - 0.33) / 0.33;
        clone.style.top = liftHeight + "px";
        clone.style.left =
          startRect.left + p * (targetX - startRect.left) + "px";
      }
      else if (progress < 1) {
        // Phase 3 – Drop Down
        const p = (progress - 0.66) / 0.34;
        clone.style.left = targetX + "px";
        clone.style.top =
          liftHeight + p * (targetY - liftHeight) + "px";
      }
      else {
        clone.remove();
        blockEl.style.visibility = "visible";

        history.push(JSON.stringify(tubes));
        const color = tubes[from].pop();
        tubes[to].push(color);

        moves++;
        updateInfo();
        render();
        checkWin();
        checkGameOver();
        playSound('ton');

        isAnimating = false;
        return;
      }

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }

  //resize window
  window.addEventListener("resize", () => {
    const game = document.getElementById("game");
    game.style.transform = "scale(0.95)";
    setTimeout(() => {
      game.style.transform = "scale(1)";
    }, 200);
  });

  // render game
  function render() {
    const game = document.getElementById("game");
    game.innerHTML = "";

    tubes.forEach((tube, i) => {

      const div = document.createElement("div");
      div.className = "tube";
      div.dataset.index = i;

      if (isTubeComplete(tube)) {
        div.classList.add("complete");
        statusText.innerHTML = `One Color block completed. <br>Click on the tube top block transfer`;
        // textToSpeechEng("Color completed");
      }

      tube.forEach(color => {
        const block = document.createElement("div");
        block.className = "block";
        block.style.background = color;
        div.appendChild(block);
      });

      game.appendChild(div);
    });

    calculateGrid();
  }

  //update moves
  function updateInfo() {
    document.getElementById("moves").textContent = moves;
  }

  // ---------------- Check WIN ----------------
  function checkWin() {
    const win = tubes.every(tube => {
      if (tube.length === 0) return true;
      if (tube.length !== MAX_HEIGHT) return false;
      return tube.every(color => color === tube[0]);
    });

    if (win) {
      playSound('win');
      launchStarFireworks();
      setTimeout(() => {
        shareScore(gameName, score);
      }, 2500);
      updateleaderboard();
      stopTimer();
      window.saveScore();
      toggleElement(pauseBtn, true);
      toggleElement(restartBtn, true);
      toggleElement(undoBtn, true);

      levelCompleted(currentMode, currentDifficulty, currentLevel);

      statusText.innerHTML = `🎉 ${player1} Win! 🎉<br>Mode ${colorCount} Colors: Level ${currentLevel} Completed! <br> Click New Game to play next Level ${currentLevel + 1} ${currentDifficulty.toUpperCase()}`;
    }
  }

  // ---------------- UI ----------------
  function highlight(index) {
    render();
    const tubeDiv = document.querySelectorAll(".tube")[index];
    tubeDiv.lastElementChild.classList.add("selected");
  }

  function clearHighlight() {
    render();
  }

  //undo
  function undo() {
    if (!history.length) return;
    if (undoCount < 0) return;
    tubes = JSON.parse(history.pop());
    undoCount--;
    if (undoCount < 0) {
      undoBtn.textContent = `↩️ Undo(0)`;
      statusText.innerHTML = `No undo left <br> Click on the tube liquid transfer  from`;
    } else {
      undoBtn.textContent = `↩️ Undo(${undoCount})`;
      statusText.innerHTML = `Undo Last Move, Left only ${undoCount} undo <br> Click on the tube liquid transfer from`;
    }
    render();
  }

  //fix undo count for each no colors
  function updateUndoCount() {
    if (currentMode == 4) { undoCount = 1; }
    else if (currentMode == 5) { undoCount = 1; }
    else if (currentMode == 6) { undoCount = 2; }
    else if (currentMode == 7) { undoCount = 2; }
    else if (currentMode == 8) { undoCount = 2; }
    else if (currentMode == 9) { undoCount = 3; }
    else if (currentMode == 10) { undoCount = 3; }
    else if (currentMode == 11) { undoCount = 3; }
    else if (currentMode == 12) { undoCount = 4; }
    else if (currentMode == 13) { undoCount = 4; }
    else if (currentMode == 14) { undoCount = 4; }
    else if (currentMode == 15) { undoCount = 5; }
    else if (currentMode == 16) { undoCount = 5; }
    else if (currentMode == 17) { undoCount = 5; }
    else if (currentMode == 18) { undoCount = 6; }
    else if (currentMode == 19) { undoCount = 6; }
    else if (currentMode == 20) { undoCount = 6; }

    undoBtn.textContent = `↩️ Undo(${undoCount})`;
  }

  undoBtn.addEventListener('click', undo);

  //button enable/disable
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

  /* =========================
  Leaderboard update
  ========================= */
  // to add firebase leaderboard (save record)
  window.saveScore = async function () {
    text = `tubes:${currentMode}, Colors:${currentMode - 2}`;

    try {
      await addDoc(collection(db, "leaderboard"), {
        game_id: game_id || 'blocksort',
        game: gameFullName || 'Block Sort',
        name: player1 || 'Guast',
        opponent: opponent || "-",
        difficulty: currentDifficulty || "-",
        size: `${currentMode}x${currentMode - 2}`,
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
    let gsize = `${currentMode}x${colorCount}`;
    let elapsed = Math.floor(Number(elapsedTime) / 1000);;
    difficulty = currentDifficulty;
    // moves = 0;
    let filed1 = 0;
    let filed2 = 0
    let filed3 = `tube=${currentMode}`;
    let filed4 = `color=${currentMode - 2}`;
    let email = localStorage.getItem('email') || '-';
    const created_at = new Date();
    if (currentDifficulty.toUpperCase() === "EASY") {
      score = (Number(currentMode) * (Number(currentMode) - 2) * 100 - moves * 1 - Math.floor(Number(elapsedTime) / 1000) + undoCount * 10) * 1;
    } else if (currentDifficulty.toUpperCase() === "MEDIUM") {
      score = (Number(currentMode) * (Number(currentMode) - 2) * 100 - moves * 1 - Math.floor(Number(elapsedTime) / 1000) + undoCount * 10) * 1.5;
    } else if (currentDifficulty.toUpperCase() === "HARD") {
      score = (Number(currentMode) * (Number(currentMode) - 2) * 100 - moves * 1 - Math.floor(Number(elapsedTime) / 1000) + undoCount * 10) * 2;
    }

    lcsaveToLeaderboard(player1, opponent, email, gsize, difficulty, game_id, score, elapsed, moves, filed1, filed2, filed3, filed4, created_at)

    saveScore(player1, opponent, email, gsize, difficulty, game_id, score, elapsed, moves, filed1, filed2, filed3, filed4, created_at);
  }

  //levels display code
  // store all level data
  let gameLevels = {};

  // get game progress from local storage
  function getProgress(currentMode, difficulty) {
    const key = `current_${currentMode}_${difficulty}`;
    if (difficulty == "easy") {
      return parseInt(localStorage.getItem(key)) || 1;
    } else if (difficulty == "medium") {
      return parseInt(localStorage.getItem(key)) || 51;
    } else if (difficulty == "hard") {
      return parseInt(localStorage.getItem(key)) || 101;
    }
  }

  // save game progress
  function setProgress(mode, difficulty, level) {
    localStorage.setItem(`current_${mode}_${difficulty}`, level);
  }

  //get current level saved on device
  function getCurrentLevel(mode, difficulty) {
    console.log(localStorage.getItem(`current_${mode}_${difficulty}`))
    return parseInt(localStorage.getItem(`current_${mode}_${difficulty}`)) || 1;
  }

  //set current level on device
  function setCurrentLevel(mode, difficulty, level) {
    localStorage.setItem(`current_${mode}_${difficulty}`, level);
  }

  //display levels
  function renderLevels() {
    const mode = Number(modeSelectBtn.value) + 2;
    const container = document.getElementById("levelsContainer");

    container.innerHTML = "";

    const difficulties = ["easy", "medium", "hard"];

    difficulties.forEach(diff => {

      const section = document.createElement("div");
      section.className = "level-section";

      // 🔥 id add (scroll के लिए)
      section.id = `section_${diff}`;

      if (diff == "easy"){
        section.innerHTML = `<div class="level-title">${diff.toUpperCase()} (1 to 50)</div>`;
      } else if (diff == "medium"){
        section.innerHTML = `<div class="level-title">${diff.toUpperCase()} (51 to 100)</div>`;
      } else if (diff == "hard"){
        if (mode < 5){
          section.innerHTML = `<div class="level-title">${diff.toUpperCase()} (101 to 200)</div>`;
        } else if (mode < 11){
          section.innerHTML = `<div class="level-title">${diff.toUpperCase()} (101 to 500)</div>`;
        } else if (mode == 11){
          section.innerHTML = `<div class="level-title">${diff.toUpperCase()} (101 to 1000)</div>`;
        } else if (mode == 12){
          section.innerHTML = `<div class="level-title">${diff.toUpperCase()} (101 to 2000)</div>`;
        } else if (mode == 13){
          section.innerHTML = `<div class="level-title">${diff.toUpperCase()} (101 to 3000)</div>`;
        } else if (mode == 14){
          section.innerHTML = `<div class="level-title">${diff.toUpperCase()} (101 to 4000)</div>`;
        } else {
          section.innerHTML = `<div class="level-title">${diff.toUpperCase()} (101 to 5000)</div>`;
        }
      }

      const grid = document.createElement("div");
      grid.className = "level-grid";

      const levels = gameLevels[`mode_${mode}_tubes`]
        .filter(l => l.difficulty === diff);

      const unlockedLevel = getProgress(mode, diff);
      currentLevel = getCurrentLevel(mode, diff);

      levels.forEach(level => {

        const box = document.createElement("div");
        box.className = "level-box";

        if (level.level <= unlockedLevel) {
          box.classList.add("unlocked");
        } else {
          box.classList.add("locked");
        }

        // current level mark
        if (level.level === currentLevel) {
          box.classList.add("current");
          // auto scroll target mark
          box.id = "currentLevelBox";
        }
        box.innerText = level.level;
        if (level.level <= unlockedLevel) {
          box.onclick = () => {
            startGame(mode, diff, level.level);
            playSound("click");
          }
        }
        grid.appendChild(box);
      });
      section.appendChild(grid);
      container.appendChild(section);
    });
    // auto scroll
    autoScrollToCurrent();
  }

  function autoScrollToCurrent() {

    setTimeout(() => {
      const currentBox = document.getElementById("currentLevelBox");

      if (currentBox) {
        currentBox.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }
    }, 100); // DOM render wait
  }

  //load current level data from jason file
  function startGame(mode, difficulty, levelNumber) {

    const modeKey = `mode_${mode}_tubes`;
    // check lavels loaded
    if (!gameLevels || !gameLevels[modeKey]) {
      console.error("GameData missing:", modeKey);
      return;
    }
    //find level data
    levelData = gameLevels[`mode_${mode}_tubes`]
      .find(l => l.level === levelNumber && l.difficulty === difficulty);

    if (!levelData) {
      console.error("Level not found:", mode, difficulty, levelNumber);
      return;
    }
    //set current level
    setCurrentLevel(mode, difficulty, levelNumber);
    //hide level screen
    document.getElementById("levelPopup").style.display = "none";

    // start game
    stopTimer();
    newGame();
  }

  //change next level save and unlock next level
  function levelCompleted(mode, difficulty, currentLevel) {
    // increase level
    let nextLevel = currentLevel + 1;
    // ulocked next level
    textToSpeechEng("unlocked level" + nextLevel)
    let unlocked = getProgress(mode, difficulty);

    if (nextLevel > unlocked) {
      setProgress(mode, difficulty, nextLevel);
    }

    setCurrentLevel(mode, difficulty, nextLevel);

    renderLevels();
    document.getElementById("levelPopup").style.display = "flex";
    //auto scroll again
    renderLevels(); 
  }

  // load json file data
  async function loadLevelsData() {
    try {
      const response = await fetch('js/multi_mode_levels.json');
      if (!response.ok) throw new Error("Jason file not found");

      gameLevels = await response.json();
      console.log("Levels Loaded Successfully!");
      console.log(gameLevels)
      renderLevels();

    } catch (error) {
      console.error("Error loading JSON:", error);
    }
  }

  // load level data after page load
  window.onload = loadLevelsData();
});

//get local user name
function getUserName() {
  const userData = localStorage.getItem("user");
  if (!userData) return `Guest`;

  const user = JSON.parse(userData);
  return user.name || `Guest`;
}