import { startTimer, seconds, minutes, hours } from './timer.js';
import { launchFireworks, showWinText } from './fireworks.js';
import { playSound } from './sound.js';
import { textToSpeechEng } from './speak.js';
// import { saveToLeaderboard, toggleLeaderboard } from './leaderboard.js';

export const modeEl = document.getElementById('mode');
export const difficultyEl = document.getElementById('difficulty');
export let timer = false;
export let winnerName;

window.addEventListener('load', function () {
  const loading = document.getElementById('loading');
  loading.style.display = 'none';

const boardEl = document.getElementById('grid');
const messageEl = document.getElementById('message');
const toggleThemeBtn = document.getElementById("toggle-theme");

let board = [];
let size = 15;
let currentPlayer = 'x';
let startingPlayer = 'x';
let gameOver = false;
let history = [];
  let theme = localStorage.getItem('rg_theme') || 'dark';
  let player1 = localStorage.getItem('player_name') || 'Human1';
  let player2 = localStorage.getItem('player_opponent') || 'Human2';
  let score = 0;
  let gameCount = 0;
  let difficulty = difficultyEl.value;
  let mode = modeEl.value;

  this.document.getElementById("player1").textContent = player1;

  document.getElementById("difficulty").addEventListener("click", () => {
    difficulty = difficultyEl.value;
  });

  modeEl.addEventListener('change', function (e) {
    mode = e.target.value;
    document.getElementById("nameInput").placeholder = player2 || 'Human2';
    player2 = localStorage.getItem('player_opponent') || 'Human2';
    document.getElementById("nameInput").value = player2 || 'Human2';
    // namebar.classList.add('show');
    if (mode == 'pvp') {
      namebar.classList.add('show');
    } else {
      namebar.classList.remove('show');
    }
  });


//toggle theme
// document.getElementById("toggle-theme").addEventListener("click", () => {
//   toggleTheme();
// });

// // change theme
// function toggleTheme() {
//   document.body.classList.toggle(theme);
//   if (document.body.classList.contains("dark")) {
//       localStorage.setItem('rg_theme')
//       toggleThemeBtn.innerText = "☀️ Light";
//     textToSpeechEng('Theme Dark');
//   } else {
//     toggleThemeBtn.innerText = "🌙 Dark";
//     textToSpeechEng('Theme Light');
//   }
// }
const themeToggle = document.getElementById('toggle-theme');
function setTheme(t) {
  if (t === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('rg_theme', t);
    themeToggle.textContent = '☀️ Light'
  }
  if (t === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('rg_theme', t);
    themeToggle.textContent = '🌙 Dark'
  }
}
if (themeToggle) themeToggle.addEventListener('click', () => setTheme(localStorage.getItem('rg_theme') === 'dark' ? 'light' : 'dark'));
setTheme(localStorage.getItem('rg_theme') === 'dark' ? 'dark' : 'light');


//start game
document.getElementById("startGame").addEventListener("click", () => {
  startGame();
});

// grid setup and start new game
function startGame() {
  // Ask Player Name
  if (modeEl.value === 'pvc') {
    player1 = localStorage.getItem('player_name') || "Human";
    player2 = "Computer";
  } else if (modeEl.value === 'pvp') {
    player1 = localStorage.getItem('player_name') || "Human1";
    player2 = localStorage.getItem('player_opponent') || "Human";
  }

  board = Array(size).fill().map(() => Array(size).fill(''));
  boardEl.innerHTML = '';
  size = parseInt(document.getElementById('gridSize').value);
  // grid size setup
  boardEl.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  boardEl.style.gridTemplateRows = `repeat(${size}, 1fr)`;
  currentPlayer = 'x';
  currentPlayer = startingPlayer;
  gameOver = false;
  timer = true;
  // grid setup
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.x = x;
      cell.dataset.y = y;
      cell.addEventListener('click', onCellClick);
      boardEl.appendChild(cell);
    }
  }
  startTimer();

  if (modeEl.value === 'pvc' && currentPlayer === 'o') {
    messageEl.textContent = `Computer ${currentPlayer.toUpperCase()}'s turn`;
    setTimeout(computerMove, 300);
  } else {
    messageEl.innerHTML = `${currentPlayer === 'x' ? player1 : player2} ${currentPlayer.toUpperCase()}'s turn <br> Click on square to play`;
  }
}

// undo move
document.getElementById("undo-last").addEventListener("click", () => {
    textToSpeechEng('Undo');
    undoLast();
});

// undo move
function undoLast() {
  if (history.length === 0 || gameOver) return;
  let undoCount = (modeEl.value === 'pvc') ? 2 : 1;

  while (undoCount-- > 0 && history.length > 0) {
    const last = history.pop();
    board[last.y][last.x] = '';
    document.querySelector(`.cell[data-y='${last.y}'][data-x='${last.x}']`).textContent = '';
    if (cell) cell.className = 'cell';
    currentPlayer = last.player;
    if (modeEl.value === 'pvc' && currentPlayer === 'o') {
      messageEl.textContent = `Computer ${currentPlayer.toUpperCase()}'s turn`;
    } else {
      messageEl.textContent = `${currentPlayer === 'x' ? player1 : player2} ${currentPlayer.toUpperCase()}'s turn`;
    }
    gameOver = false;
  }
}

// play game
function onCellClick(e) {
  if (gameOver) return;

  const x = +e.target.dataset.x;
  const y = +e.target.dataset.y;
  // click on filled cell
  if (board[y][x]) {
    playSound('error');
    return;
  }

  board[y][x] = currentPlayer;
  playSound('click');
  history.push({ y, x, player: currentPlayer });
  e.target.textContent = currentPlayer.toUpperCase();
  e.target.classList.add(currentPlayer);

  if (checkWin(x, y)) {
    updateleaderboard();
    timer = false;
    gameOver = true;
    clearInterval(timerInterval);
    switchStartingPlayer();
    playSound('win');
    launchFireworks();
    showWinText();
    return;
  }

  //check draw
  if (isBoardFull()) {
    messageEl.textContent = `It's a draw!`;
    timer = false;
    gameOver = true;
    playSound('draw');
    switchStartingPlayer();
    return;
  }

  currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
  if (modeEl.value === 'pvc' && currentPlayer === 'o') {
    messageEl.textContent = `Computer ${currentPlayer.toUpperCase()}'s turn`;
    setTimeout(computerMove, 300);
  } else {
    messageEl.textContent = `${currentPlayer === 'x' ? player1 : player2} ${currentPlayer.toUpperCase()}'s turn`;
  }
}

// check board is full for draw
function isBoardFull() {
  return board.every(row => row.every(cell => cell));
}

// Change First player after game over
function switchStartingPlayer() {
  startingPlayer = startingPlayer === 'x' ? 'o' : 'x';
}

// Computer Turn
function computerMove() {
  const difficulty = difficultyEl.value;
  let move = null;

  // easy level
  if (difficulty === 'easy') {
    const moves = [];
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (!board[y][x]) moves.push({ x, y });
      }
    }
    if (moves.length > 0) move = moves[Math.floor(Math.random() * moves.length)];

  } else if (difficulty === 'medium') {
    move = findMediumMove();

  } else {
    move = findBestMove(); // hard mode
  }

  if (move) {
    const cell = document.querySelector(`.cell[data-x='${move.x}'][data-y='${move.y}']`);
    if (cell) cell.click();
  }
}

// check for winner
function checkWin(x, y) {
  const dirs = [
    { dx: 1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: 1, dy: 1 },
    { dx: 1, dy: -1 }
  ];
  for (const { dx, dy } of dirs) {
    let count = 1;
    let cells = [[x, y]];

    for (let i = 1; i < 5; i++) {
      const nx = x + dx * i, ny = y + dy * i;
      if (board[ny]?.[nx] === currentPlayer) {
        count++;
        cells.push([nx, ny]);
      } else break;
    }
    for (let i = 1; i < 5; i++) {
      const nx = x - dx * i, ny = y - dy * i;
      if (board[ny]?.[nx] === currentPlayer) {
        count++;
        cells.push([nx, ny]);
      } else break;
    }

    if (count >= 5) {
      cells.forEach(([cx, cy]) => {
        const el = document.querySelector(`.cell[data-x='${cx}'][data-y='${cy}']`);
        if (el) el.classList.add('win');
      });
      return true;
    }
  }
  return false;
}

// medium level
function findMediumMove() {
  // Try to win
  let move = findStrategicMove('o');
  if (move) return move;

  // Try to block opponent
  move = findStrategicMove('x');
  if (move) return move;

  // Fallback: pick first empty
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!board[y][x]) return { x, y };
    }
  }
  return null;
}

// medium level (try to win or stop to win opponent)
function findStrategicMove(player) {
  const directions = [
    { dx: 1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: 1, dy: 1 },
    { dx: 1, dy: -1 }
  ];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (board[y][x]) continue;

      for (const { dx, dy } of directions) {
        let count = 0;
        for (let i = 1; i <= 4; i++) {
          const nx = x + dx * i;
          const ny = y + dy * i;
          if (board[ny]?.[nx] === player) count++;
          else break;
        }
        for (let i = 1; i <= 4; i++) {
          const nx = x - dx * i;
          const ny = y - dy * i;
          if (board[ny]?.[nx] === player) count++;
          else break;
        }

        if (count >= 4) return { x, y };
      }
    }
  }
  return null;
}

// Hard level
function findBestMove() {
  let bestScore = -Infinity;
  let bestMove = null;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!board[y][x]) {
        let scoreO = getScore(x, y, 'o'); // computer's score
        let scoreX = getScore(x, y, 'x'); // Player's score
        let totalScore = scoreO + scoreX * 1.1; // defensive + offensive

        if (totalScore > bestScore) {
          bestScore = totalScore;
          bestMove = { x, y };
        }
      }
    }
  }
  return bestMove || getRandomMove();
}

// hard level
function getScore(x, y, player) {
  let score = 0;
  const directions = [
    { dx: 1, dy: 0 },   // Horizontal
    { dx: 0, dy: 1 },   // Vertical
    { dx: 1, dy: 1 },   // Diagonal \
    { dx: 1, dy: -1 }   // Diagonal /
  ];

  for (const { dx, dy } of directions) {
    let count = 0;
    for (let i = 1; i < 5; i++) {
      const nx = x + dx * i;
      const ny = y + dy * i;
      if (board[ny]?.[nx] === player) count++;
      else break;
    }
    for (let i = 1; i < 5; i++) {
      const nx = x - dx * i;
      const ny = y - dy * i;
      if (board[ny]?.[nx] === player) count++;
      else break;
    }
    score += Math.pow(10, count);
  }
  return score;
}

// for random mobve after not found any best move in hard level
function getRandomMove() {
  const moves = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!board[y][x]) moves.push({ x, y });
    }
  }
  return moves.length ? moves[Math.floor(Math.random() * moves.length)] : null;
}

const namebar = document.getElementById('namebar');
if (mode == 'pvp') {
  document.getElementById("nameInput").placeholder = player2 || 'Human2';
  document.getElementById("nameInput").value = player2 || 'Human2';
  namebar.classList.add('show');
}
document.getElementById('name').addEventListener('click', () => {
  player2 = document.getElementById("nameInput").value;
  namebar.classList.remove('show');
});

function updateleaderboard() {
  winnerName = currentPlayer === 'x' ? player1 : player2;
  // let score = 0;
  let opponent = player2;
  let game_id = '5inarow';
  let gsize = `${size}x${size}`;
  let elapsed = hours * 3600 + minutes * 60 + seconds;
  gameCount = history.length;
  // let moves = 0;
  let filed1 = 0;
  let filed2 = 0
  let filed3 = "-";
  let filed4 = "-";
  let email = localStorage.getItem('email') || '-';
  const created_at = new Date();
  if (modeEl.value === 'pvc' && currentPlayer === 'o') {
    messageEl.textContent = `Computer ${currentPlayer.toUpperCase()} wins!`;
    filed3 = 'Player vs Computer';
    filed4 = currentPlayer.toUpperCase();
    winnerName = 'Computer';
    opponent = player1;
    score = (size * size - history.length) * 10 + 50;
  } else {
    messageEl.textContent = `${currentPlayer === 'x' ? player1 : player2} ${currentPlayer.toUpperCase()} wins!`;
    winnerName = currentPlayer === 'x' ? player1 : player2;
    opponent = currentPlayer !== 'x' ? player1 : player2;
    filed3 = 'Player vs Player';
    filed4 = currentPlayer.toUpperCase();
    score = (size * size - history.length) * 10 + 50;
  }
  let player_name = winnerName;
  let player_opponent = opponent;
  const entry = { player_name, player_opponent, email, gsize, difficulty, game_id, score, elapsed, gameCount, filed1, filed2, filed3, filed4, created_at };
  const boardData = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  boardData.push(entry);
  localStorage.setItem("leaderboard", JSON.stringify(boardData));

  window.submitScore &&
    window.submitScore(player_name, player_opponent, email, gsize, difficulty, game_id, score, elapsed, gameCount, filed1, filed2, filed3, filed4, created_at);
}
});
