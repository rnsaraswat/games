import { shareScore } from './share.js';
import { textToSpeechEng } from './speak.js';
import { playSound } from './sound.js';
import { saveScore } from '../../../leaderboard/gbleaderboard.js';
import { lcrenderLeaderboard, lcsaveToLeaderboard } from '../../../leaderboard/lcleaderboard.js';

export let gameName = 'blocksort';
let paused = false;
let timerId = null;
let timeSec = 0;
export let score = 0;
export let noofFireWorks = 10;
const pad = (num) => num.toString().padStart(2, '0');
const date = new Date();
export let player1 = localStorage.getItem('player_name') || `Guest${pad(date.getDate())}${pad(date.getMonth() + 1)}${date.getFullYear().toString().slice(-2)}_${pad(date.getHours())}${pad(date.getMinutes())}`;

document.addEventListener('DOMContentLoaded', () => {
  const loading = document.getElementById('loading');
  loading.style.display = 'none';
  lcrenderLeaderboard();

  const timeDisplay = document.getElementById('timer-display');
  const movesDisplay = document.getElementById('moves');
  const startBtn = document.getElementById('startBtn');
  const restartBtn = document.getElementById('restartBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const resumeBtn = document.getElementById('resumeBtn');
  const undoBtn = document.getElementById('undoBtn');
  const colorCountBtn = document.getElementById("colorCount");


  let colors = [];
  let tubes = [];
  const MAX_HEIGHT = 4;

  let selected = null;
  let fromIndex = null;
  let history = [];
  let moves = 0;
  let seconds = 0;
  let isAnimating = false;


  let savedLevel;
  let undoCount = 2;
  let difficulty;
  let colorCount = 2;
  let TOTAL_TUBES = colorCount + 2;
  let currentMode = TOTAL_TUBES;

  const AVAILABLE_COLORS = ["#FFFF00", "#008080", "#FF0000", "#8b0000", "#00FF00", "#006400", "#00bfff", "#0000FF", "#000080", "#ffd700", "#bdb76b", "#00FFFF", "#FF00FF", "#800080", "#9932cc", "#808000", "#FFA500", "#fa8072", "#c71585", "#FFC0CB"];

  const statusText = document.getElementById("output");
  colorCount = parseInt(colorCountBtn.value);
  TOTAL_TUBES = colorCount + 2;
  currentMode = TOTAL_TUBES;
  updateUndoCount();
  toggleElement(pauseBtn, true);
  toggleElement(restartBtn, true);
  toggleElement(undoBtn, true);
  toggleElement(startBtn, false);
  toggleElement(colorCountBtn, false);


  colorCountBtn.onchange = () => {
    colorCount = parseInt(colorCountBtn.value)
    TOTAL_TUBES = colorCount + 2;
    stopTimer();
    newGame();
    statusText.innerHTML = `Level:${savedLevel} (${colorCount} colors selected), New game started, Click on the tube liquid transfer from`;
    document.getElementById("leveldisplay").textContent = `${savedLevel} (${difficulty.toUpperCase()})`;
  };

  startBtn.addEventListener('click', () => {
    stopTimer();
    newGame();
  });

  restartBtn.addEventListener('click', () => {
    window.Restart();
  });

  window.Restart = function () {
    playSound('loose');

    const newLevel = loadModeProgress(TOTAL_TUBES);

    moves = 0;
    movesDisplay.textContent = moves;
    timeSec = 0;
    updateUndoCount();
    startTimer();
    selected = null;
    history = [];
    render();
    calculateGrid();
  }

  function newGame() {
    moves = 0;
    timeSec = 0;
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

    const pickedColors = loadModeProgress(TOTAL_TUBES)
    for (let i = 0; i < pickedColors.length - 2; i++) {
        for (let j = 0; j < MAX_HEIGHT; j++) {
          tubes[i][j] = AVAILABLE_COLORS[pickedColors[i][j]];
          }
        }
    document.getElementById("leveldisplay").textContent = `${savedLevel} (${difficulty.toUpperCase()})`;

    statusText.innerHTML = `Click on the tube top block transfer`;

    toggleElement(pauseBtn, false);
    toggleElement(restartBtn, false);
    toggleElement(undoBtn, false);
    toggleElement(startBtn, true);
    toggleElement(colorCountBtn, true);

    history = [];
    render();
    calculateGrid();
  }

  function pickColorsForGame() {
    if (AVAILABLE_COLORS.length < colorCount) {
      throw new Error("Not enough colors in AVAILABLE_COLORS");
    }

    // shuffle available colors
    const shuffled = [...AVAILABLE_COLORS].sort(() => Math.random() - 0.5);

    // pick exact required colors
    return shuffled.slice(0, colorCount);
  }

  function calculateGrid() {

    const container = document.getElementById("game");
    const count = tubes.length;

    const cols = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / cols);

    container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  }

  // ---------------- CLICK ----------------
  game.addEventListener("click", function (e) {

    if (isAnimating) return;

    const tubeDiv = e.target.closest(".tube");
    if (!tubeDiv) return;

    const index = parseInt(tubeDiv.dataset.index);

    // SELECT
    if (selected === null) {
      if (tubes[index].length === 0) return;

      selected = tubes[index][tubes[index].length - 1];
      fromIndex = index;
      highlight(index);
      playSound("click");
      statusText.innerHTML = `Click on the tube where transfer block`;
    }

    // DROP
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

  function isMovePossible(){
    // Check if any tube is empty
    const hasEmpty = tubes.some(tube => tube.length === 0);
    // Check matching top colors
    for(let i=0;i<tubes.length;i++){
      for(let j=0;j<tubes.length;j++){
  
        if(i===j) continue;
  
        if(isValidMove(i,j)){
          return true;
        }
      }
    }
    return false;
  }

  function checkGameOver(){
    const hasEmpty = tubes.some(tube => tube.length === 0);
    const moveLeft = isMovePossible();
  
    if(!hasEmpty && !moveLeft){
      stopTimer();

      setTimeout(()=>{
        alert("❌ No Moves Left! Game Over");
      },300);
    }
  }

  function isTubeComplete(tube){

    if(tube.length !== MAX_HEIGHT) return false;
  
    return tube.every(color => color === tube[0]);
  }

  // ---------------- VALIDATION ----------------
  function isValidMove(from, to) {

    if (from === to) return false;
    if (tubes[to].length >= MAX_HEIGHT) return false;

    const movingColor = tubes[from][tubes[from].length - 1];
    const targetTop = tubes[to][tubes[to].length - 1];

    if (!targetTop) return true;
    return movingColor === targetTop;
  }

  // ---------------- ANIMATION ----------------
  function animateMove(from,to){
    isAnimating = true;
  
    const fromTube = document.querySelectorAll(".tube")[from];
    const toTube = document.querySelectorAll(".tube")[to];
    const blockEl = fromTube.lastElementChild;
  
    const startRect = blockEl.getBoundingClientRect();
    const fromRect = fromTube.getBoundingClientRect();
    const toRect = toTube.getBoundingClientRect();
  
    const clone = blockEl.cloneNode(true);
    document.body.appendChild(clone);
  
    clone.style.position="fixed";
    clone.style.left=startRect.left+"px";
    clone.style.top=startRect.top+"px";
    clone.style.width=startRect.width+"px";
    clone.style.height=startRect.height+"px";
    clone.style.margin=0;
    clone.style.zIndex=1000;
  
    blockEl.style.visibility="hidden";
  
    const highestTubeTop = Math.min(fromRect.top, toRect.top);
    const liftHeight = highestTubeTop - 80; // both tubes se upar
  
    const targetX = toRect.left + (toRect.width/2 - startRect.width/2);
  
    const blockHeight = startRect.height;
    const targetY = toRect.bottom - (tubes[to].length+1)*blockHeight - 5;
  
    const duration = 700;
    let startTime = null;
  
    function animate(time){
  
      if(!startTime) startTime = time;
      const progress = (time - startTime)/duration;
  
      if(progress < 0.33){
        // Phase 1 – Lift Up
        const p = progress / 0.33;
        clone.style.top =
          startRect.top - p*(startRect.top - liftHeight) + "px";
      }
      else if(progress < 0.66){
        // Phase 2 – Move Horizontal (at top)
        const p = (progress-0.33)/0.33;
        clone.style.top = liftHeight + "px";
        clone.style.left =
          startRect.left + p*(targetX - startRect.left) + "px";
      }
      else if(progress < 1){
        // Phase 3 – Drop Down
        const p = (progress-0.66)/0.34;
        clone.style.left = targetX + "px";
        clone.style.top =
          liftHeight + p*(targetY - liftHeight) + "px";
      }
      else{
        clone.remove();
        blockEl.style.visibility="visible";
  
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

  // function quadraticBezier(t, p0, p1, p2) {
  //   return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
  // }

  window.addEventListener("resize", () => {
    const game = document.getElementById("game");
    game.style.transform = "scale(0.95)";
    setTimeout(() => {
      game.style.transform = "scale(1)";
    }, 200);
  });

  function render(){
    const game = document.getElementById("game");
    game.innerHTML="";
  
    tubes.forEach((tube,i)=>{
  
      const div=document.createElement("div");
      div.className="tube";
      div.dataset.index=i;
  
      if(isTubeComplete(tube)){
        div.classList.add("complete");
        statusText.innerHTML = `One Color block completed. <br>Click on the tube top block transfer`;
        // textToSpeechEng("Color completed");
      }
  
      tube.forEach(color=>{
        const block=document.createElement("div");
        block.className="block";
        block.style.background=color;
        div.appendChild(block);
      });
  
      game.appendChild(div);
    });
  
    calculateGrid();
  }

  function updateInfo() {
    renderTimer();
    document.getElementById("moves").textContent = moves;
  }

  // ---------------- WIN ----------------
  function checkWin() {
    const win = tubes.every(tube => {
      if (tube.length === 0) return true;
      if (tube.length !== MAX_HEIGHT) return false;
      return tube.every(color => color === tube[0]);
    });

    if (win) {
      stopTimer();
      playSound('win');
      launchStarFireworks();
      setTimeout(() => {
        shareScore(gameName, score);
      }, 2500);
      updateleaderboard();
      toggleElement(pauseBtn, true);
      toggleElement(restartBtn, true);
      toggleElement(undoBtn, true);
      toggleElement(startBtn, false);
      toggleElement(colorCountBtn, false);

      savedLevel = parseInt(localStorage.getItem(`progress_mode_${currentMode}`) || 1);
      let nextLevel = savedLevel + 1;
      // Save progress of that mode
      localStorage.setItem(`progress_mode_${currentMode}`, nextLevel);

      statusText.innerHTML = `🎉 ${player1} Win! 🎉<br>Mode ${colorCount} Colors: Level ${savedLevel} Completed! Click New Game to play next Level`;

      loadModeProgress(currentMode);
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

  function updateUndoCount() {
    if (TOTAL_TUBES == 4) { undoCount = 1; }
    else if (TOTAL_TUBES == 5) { undoCount = 1; }
    else if (TOTAL_TUBES == 6) { undoCount = 2; }
    else if (TOTAL_TUBES == 7) { undoCount = 2; }
    else if (TOTAL_TUBES == 8) { undoCount = 2; }
    else if (TOTAL_TUBES == 9) { undoCount = 3; }
    else if (TOTAL_TUBES == 10) { undoCount = 3; }
    else if (TOTAL_TUBES == 11) { undoCount = 3; }
    else if (TOTAL_TUBES == 12) { undoCount = 4; }
    else if (TOTAL_TUBES == 13) { undoCount = 4; }
    else if (TOTAL_TUBES == 14) { undoCount = 4; }
    else if (TOTAL_TUBES == 15) { undoCount = 5; }
    else if (TOTAL_TUBES == 16) { undoCount = 5; }
    else if (TOTAL_TUBES == 17) { undoCount = 5; }
    else if (TOTAL_TUBES == 18) { undoCount = 6; }
    else if (TOTAL_TUBES == 19) { undoCount = 6; }
    else if (TOTAL_TUBES == 20) { undoCount = 6; }

    undoBtn.textContent = `↩️ Undo(${undoCount})`;
  }

  undoBtn.addEventListener('click', undo);

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

  // this code is for timer display and upadte including pause
  function startTimer() {
    stopTimer();
    timerId = setInterval(() => {
      if (!paused) { timeSec++; renderTimer(); }
    }, 1000);
  }

  function stopTimer() {
    if (timerId) { clearInterval(timerId); timerId = null; }
  }

  function renderTimer() {
    const h = String(Math.floor(timeSec / 3600)).padStart(2, '0');
    const m = String(Math.floor((timeSec % 3600) / 60)).padStart(2, '0');
    const s = String(timeSec % 60).padStart(2, '0');
    timeDisplay.textContent = `${h}:${m}:${s}`;
  }

  pauseBtn.onclick = () => {
    paused = !paused;
    document.getElementById("pauseModal").style.display = 'flex';
  };

  resumeBtn.onclick = () => {
    paused = !paused;
    document.getElementById("pauseModal").style.display = 'none';
  };
  // this code is for timer display and upadte including pause

  // this function is updated leader board
  function updateleaderboard() {
    let opponent = "-"
    let game_id = gameName;
    let gsize = `${TOTAL_TUBES}x${colorCount}`;
    let elapsed = timeSec;
    // let difficulty = level;
    // moves = 0;
    let filed1 = 0;
    let filed2 = 0
    let filed3 = `tube=${TOTAL_TUBES}`;
    let filed4 = `color=${TOTAL_TUBES - 2}`;
    let email = localStorage.getItem('email') || '-';
    const created_at = new Date();
    if (difficulty.toUpperCase() === "EASY") {
      score = (Number(TOTAL_TUBES) * (Number(TOTAL_TUBES) - 2) * 100 - moves * 1 - Number(elapsed) + undoCount * 10) * 1;
    } else if (difficulty.toUpperCase() === "MEDIUM") {
      score = (Number(TOTAL_TUBES) * (Number(TOTAL_TUBES) - 2) * 100 - moves * 1 - Number(elapsed) + undoCount * 10) * 1.5;
    } else if (difficulty.toUpperCase() === "HARD") {
      score = (Number(TOTAL_TUBES) * (Number(TOTAL_TUBES) - 2) * 100 - moves * 1 - Number(elapsed) + undoCount * 10) * 2;
    }

    lcsaveToLeaderboard(player1, opponent, email, gsize, difficulty, game_id, score, elapsed, moves, filed1, filed2, filed3, filed4, created_at)

    saveScore(player1, opponent, email, gsize, difficulty, game_id, score, elapsed, moves, filed1, filed2, filed3, filed4, created_at);
  }

  // stroe all level data
  let gameLevels = {};

  // load json file
  async function loadLevelsData(totaltubes) {
    try {
      const response = await fetch('js/multi_mode_levels.json');
      if (!response.ok) throw new Error("Jason file not found");

      gameLevels = await response.json();
      console.log("Levels Loaded Successfully!");

      loadModeProgress(totaltubes);
    } catch (error) {
      console.error("Error loading JSON:", error);
    }
  }

  function loadModeProgress(numTubes) {
    currentMode = numTubes;
    savedLevel = localStorage.getItem(`progress_mode_${numTubes}`) || 1;
    let levelIndex = parseInt(savedLevel) - 1;

    let levelData = gameLevels[`mode_${numTubes}_tubes`][levelIndex];
    if (!levelData) {
      statusText.innerHTML = `All Levels Are cleared ${numTubes} Tubes, play for other no of tubes`;
      retrun;
    }
    difficulty = levelData.difficulty;
    console.log(`Loading Mode: ${numTubes} Tubes, Episode: ${savedLevel}, Level: ${difficulty}`);
    return levelData.tubes;
  }

  // load level data after page load
  window.onload = loadLevelsData(TOTAL_TUBES);
});