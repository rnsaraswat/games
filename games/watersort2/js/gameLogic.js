import { shareScore } from './share.js';
import { startTimer, stopTimer, seconds, minutes, hours } from './timer_date.js';
import { launchFireworks } from './randomFireWorks.js';
import { playSound } from './sound.js';
import { saveScore } from '../../../leaderboard/gbleaderboard.js';
import { lcrenderLeaderboard, lcsaveToLeaderboard } from '../../../leaderboard/lcleaderboard.js';

export let gameName = 'watersort';
export let score = 0;
export let gameState = [];
export let noofFireWorks = 10;
document.addEventListener('DOMContentLoaded', () => {
  const loading = document.getElementById('loading');
  loading.style.display = 'none';
  lcrenderLeaderboard();
});

export let player1 = localStorage.getItem('player_name') || 'Human1';
const movesDisplay = document.getElementById('moves');

let selected = null;
let levels = ["EASY", "EASY", "MEDIUM", "MEDIUM", "HARD", "HARD", "VERY HARD", "VERY HARD", "VERY HARD", "EXPERT", "EXPERT"];
let level = levels[0];
console.log(level, levels);
let moves = 0;
let undoCount = 2;

const statusText = document.getElementById("output");
const select = document.getElementById("tubeSelect");
level = levels[select.value];
let TOTAL_TUBES = select.value;
updateUndoCount();

function newGame() {
  moves = 0;
  updateUndoCount();
  startTimer();
  level = levels[TOTAL_TUBES - 4];
  console.log(level, levels);

  document.getElementById("leveldisplay").textContent = level;
  gameState = [];

  for (let i = 0; i < TOTAL_TUBES; i++) gameState.push([]);

  const colors = TOTAL_TUBES - 2;
  const pool = [];

  for (let c = 0; c < colors; c++) {
    for (let i = 0; i < TUBE_SIZE; i++) {
      pool.push(`hsl(${c * 360 / colors},70%,55%)`);
    }
  }

  shuffle(pool);

  for (let i = 0; i < colors; i++) {
    for (let j = 0; j < TUBE_SIZE; j++) {
      gameState[i].push(pool.pop());
    }
  }

  statusText.innerHTML = `click on tube to select transfer lequid from`;

  history = [];
  buildBoard();
  renderGame();
}


select.onchange = () => {
  const count = parseInt(select.value);
  level = levels[select.value];
  TOTAL_TUBES = select.value
  stopTimer();
  newGame();
};

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

document.getElementById("startBtn").addEventListener('click', () => {
  if (document.getElementById('startBtn').textContent == "Start") {
      document.getElementById('startBtn').textContent = "Restart";
      stopTimer();
      newGame();
  } else {
      document.getElementById('startBtn').textContent = "Start";
      window.Restart();
  }
});

window.Restart = function () {
  playSound('loose');
  stopTimer();
  moves = 0;
  newGame();
}

function handleClick(i) {
  const tubes = document.querySelectorAll(".tube");

  // First selection
  if (selected === null) {
    if (!gameState[i].length) return;

    statusText.innerHTML = `click on tube to transfer lequid to`;

    playSound('click');
    selected = i;
    tubes[i].classList.add("selected");
    return;
  }

  if (selected === i) {
    playSound('error');
    tubes[selected].classList.remove("selected");
    selected = null;
    return;
  }

  if (!canPour(selected, i)) {
    playSound('error');
    statusText.innerHTML = `click on tube to select transfer lequid from`;
    tubes[selected].classList.remove("selected");
    selected = null;
    return;
  }

    playSound('click');
    animateTubePour(selected, i);
  selected = null;
  statusText.innerHTML = `click on tube to select transfer lequid from`;
}

function renderGame() {
  document.querySelectorAll(".tube").forEach((tube, i) => {
    tube.innerHTML = "";
    gameState[i].forEach((c, index) => {
      console.log(c, index);
      const d = document.createElement("div");
      if (index == 0) { d.classList.add("layerBottom");};
      // d.className = "layer";
      d.classList.add("layer");
      d.style.background = c;
      tube.appendChild(d);
    });
  });
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
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
  console.log(from,to)
  const tubes = document.querySelectorAll(".tube");
  const src = tubes[from];
  const tgt = tubes[to];

  src.classList.add("pouring");

  const s = src.getBoundingClientRect();
  const t = tgt.getBoundingClientRect();
  let dx = 0;
  let dy = 0;

  const angle = getRotateDirection(s, t);

  if (angle > 0){
    dx =
    (t.left + t.width / 2) -
    (s.left + s.width / 2) - 100;
  } else {
    dx =
    (t.left + t.width / 2) -
    (s.left + s.width / 2) + 100;
  }

  const MOUTH_OFFSET = 120; 
    dy =
    (t.top + 5) -   
    (s.top + MOUTH_OFFSET);


  src.style.transform = `
    translate(${dx}px, ${dy}px)
    rotate(${angle}deg)
  `;

  setTimeout(() => {
    playSound('flow');
    finalizePour(from, to);
  }, 300);

  setTimeout(() => {
    src.style.transform = "";
    src.classList.remove("pouring");
    src.classList.remove("selected");
  }, 600);
}


// finalizePour stays SAME (logic correct)
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
  checkTubeFilled(to);
  checkWin();
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
    statusText.innerHTML = `No undo left <br> click on tube to select transfer lequid from`;
  } else {
    undoBtn.textContent = `↩️ Undo(${undoCount})`;
    statusText.innerHTML = `Undo Last Move, Left only ${undoCount} undo <br> click on tube to select transfer lequid from`;
  }
  renderGame();
}

function updateUndoCount(){
  if (TOTAL_TUBES == 4) {undoCount = 1;}
  else if (TOTAL_TUBES == 5) {undoCount = 1;}
  else if (TOTAL_TUBES == 6) {undoCount = 2;}
  else if (TOTAL_TUBES == 7) {undoCount = 2;}
  else if (TOTAL_TUBES == 8) {undoCount = 3;}
  else if (TOTAL_TUBES == 9) {undoCount = 3;}
  else if (TOTAL_TUBES == 10) {undoCount = 4;}
  else if (TOTAL_TUBES == 11) {undoCount = 4;}
  else if (TOTAL_TUBES == 12) {undoCount = 4;}
  else if (TOTAL_TUBES == 13) {undoCount = 5;}
  else if (TOTAL_TUBES == 14) {undoCount = 5;}

  undoBtn.textContent = `↩️ Undo(${undoCount})`;
}

document.getElementById('undoBtn').addEventListener('click', undo);

function checkTubeFilled(index) {
  const t = gameState[index];
  if (
    t.length === TUBE_SIZE &&
    t.every(c => c === t[0])
  ) {
    noofFireWorks = 3;
      launchFireworks(noofFireWorks);
  }
}

function checkWin() {
    const win = gameState.every(t =>
      t.length === 0 ||
      (t.length === TUBE_SIZE && t.every(c => c === t[0]))
    );
  
    if (win) {
      stopTimer();
      playSound('win');
      noofFireWorks = 10;
    launchFireworks(noofFireWorks);

      setTimeout(() => shareScore(gameName, score), 100);
      updateleaderboard();
      statusText.textContent = "🎉 You Win!";
    }
  }

  function updateleaderboard() {
    let opponent = "-"
    let game_id = gameName;
    let gsize = `${TOTAL_TUBES}x${TOTAL_TUBES-2}`;
    let elapsed = hours * 3600 + minutes * 60 + seconds;
    let difficulty = level;
    moves = 0;
    let filed1 = 0;
    let filed2 = 0
    let filed3 = `tube=${TOTAL_TUBES}`;
    let filed4 = `color=${TOTAL_TUBES-2}`;
    let email = localStorage.getItem('email') || '-';
    const created_at = new Date();
    score = (TOTAL_TUBES * (TOTAL_TUBES - 2) * 10 - moves - elapsed);
  
    lcsaveToLeaderboard(player1, opponent, email, gsize, difficulty, game_id, score, elapsed, moves, filed1, filed2, filed3, filed4, created_at)

    saveScore(player1, opponent, email, gsize, difficulty, game_id, score, elapsed, moves, filed1, filed2, filed3, filed4, created_at);
  }