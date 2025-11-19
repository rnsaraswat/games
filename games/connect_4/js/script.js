import { startTimer, seconds, minutes, hours, timerInterval } from './timer.js';
import { launchFireworks } from './edgeFireWorks.js';
import { playSound } from './sound.js';
import { textToSpeechEng } from './speak.js';
// import { saveToLeaderboard, toggleLeaderboard, clearLeaderboard } from './leaderboard.js';
import { localrenderLeaderboard, saveToLeaderboard } from '../../../leaderboard/localleaderboard.js';

export const modeEl = document.getElementById('mode');
export const difficultyEl = document.getElementById('difficulty');
export let timer = false;
export let winnerName;

window.addEventListener('load', function () {
  const loading = document.getElementById('loading');
  loading.style.display = 'none';

  const boardEl = document.getElementById('board');
  const messageEl = document.getElementById('message');
  const toggleThemeBtn = document.getElementById("toggle-theme");


  let board = [];
  let gridSize = 15;
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
  //   document.body.classList.toggle("dark");
  //   if (document.body.classList.contains("dark")) {
  //     toggleThemeBtn.innerText = "☀️ Light";
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
    gridSize = parseInt(document.getElementById('gridSize').value);
    board = Array(gridSize).fill().map(() => Array(gridSize).fill(''));
    boardEl.innerHTML = '';
    boardEl.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    boardEl.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
    currentPlayer = 'x';
    currentPlayer = startingPlayer;
    gameOver = false;
    timer = true;

    // grid setup
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.row = r;
        cell.dataset.col = c;
        cell.addEventListener('click', () => handleMove(c));
        boardEl.appendChild(cell);
      }
    }
    startTimer();
    if (modeEl.value === 'pvc' && currentPlayer === 'o') {
      messageEl.textContent = `Computer (${currentPlayer === 'x' ? 'Red' : 'Yellow'}'s) turn`;
      setTimeout(computerMove, 300);
    } else {
      messageEl.innerHTML = `${currentPlayer === 'x' ? player1 : player2} (${currentPlayer === 'x' ? 'Red' : 'Yellow'}'s) turn <br> Click on square to play`;
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
      board[last.row][last.col] = '';
      const cell = document.querySelector(`.cell[data-row='${last.row}'][data-col='${last.col}']`);
      if (cell) cell.className = 'cell';
      currentPlayer = last.player;
      if (modeEl.value === 'pvc' && currentPlayer === 'o') {
        messageEl.textContent = `Computer (${currentPlayer === 'x' ? 'Red' : 'Yellow'}'s) turn`;
      } else {
        messageEl.textContent = `${currentPlayer === 'x' ? player1 : player2} (${currentPlayer === 'x' ? 'Red' : 'Yellow'}'s) turn`;
      }
      gameOver = false;
    }
  }

  // play game
  function handleMove(col) {
    if (gameOver) return;

    const row = getAvailableRow(col);
    if (row === -1) return;

    board[row][col] = currentPlayer;
    playSound('click');
    history.push({ row, col });
    // history.push({ row, col, player: currentPlayer });
    updateCell(row, col);

    if (checkWin(row, col)) {
      updateleaderboard();
      timer = false;
      gameOver = true;
      clearInterval(timerInterval);
      switchStartingPlayer();
      playSound('win');
      launchFireworks();
      return;
    }

    if (isBoardFull()) {
      gameOver = true;
      messageEl.textContent = "It's a draw!";
      timer = false;
      gameOver = true;
      playSound('draw');
      switchStartingPlayer();
      return;
    }

    currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
    messageEl.textContent = `Player (${currentPlayer === 'x' ? 'Red' : 'Yellow'}'s) turn`;

    if (modeEl.value === 'pvc' && currentPlayer === 'o') {
      setTimeout(computerMove, 300);
    }
  }

  function getAvailableRow(col) {
    for (let r = gridSize - 1; r >= 0; r--) {
      if (board[r][col] === '') return r;
    }
    return -1;
  }

  function updateCell(r, c) {
    const cell = document.querySelector(`.cell[data-row='${r}'][data-col='${c}']`);
    if (cell) {
      cell.classList.add(currentPlayer);
      // blink to indicate last played cell
      cell.classList.add('blink');

      if (history.length === 0 || gameOver) {
        return;
      } else {
        if (history.length > 1) {
          let last = history[history.length - 1];
          last = history[history.length - 2];
          const cell = document.querySelector(`.cell[data-row='${last.row}'][data-col='${last.col}']`);
          if (cell) {
            // remove blink from previous played cell
            cell.classList.remove('blink');
          }
        }
      }
    }
  }

  // check for winner
  function checkWin(r, c) {
    const directions = [
      { dr: 0, dc: 1 },
      { dr: 1, dc: 0 },
      { dr: 1, dc: 1 },
      { dr: 1, dc: -1 },
    ];
    for (let { dr, dc } of directions) {
      let count = 1, cells = [[r, c]];

      for (let i = 1; i < 4; i++) {
        const nr = r + dr * i, nc = c + dc * i;
        if (board[nr]?.[nc] === currentPlayer) {
          count++; cells.push([nr, nc]);
        } else break;
      }
      for (let i = 1; i < 4; i++) {
        const nr = r - dr * i, nc = c - dc * i;
        if (board[nr]?.[nc] === currentPlayer) {
          count++; cells.push([nr, nc]);
        } else break;
      }

      if (count >= 4) {
        cells.forEach(([rr, cc]) => {
          const el = document.querySelector(`.cell[data-row='${rr}'][data-col='${cc}']`);
          if (el) el.classList.add('win');
        });
        return true;
      }
    }
    return false;
  }

  // computer turn
  function computerMove() {
    const level = document.getElementById('difficulty').value;
    let col = -1;

    if (level === 'easy') {
      col = easy();
    } else if (level === 'medium') {
      col = medium();
    } else {
      col = hard();
    }

    if (col !== -1) handleMove(col);
  }

  // computer easy level
  function easy() {
    const available = [];
    for (let c = 0; c < 7; c++) {
      if (getAvailableRow(c) !== -1) available.push(c);
    }
    return available[Math.floor(Math.random() * available.length)];
  }

  // computer medium level
  function medium() {
    // computer try to win
    for (let c = 0; c < 7; c++) {
      const r = getAvailableRow(c);
      if (r === -1) continue;
      board[r][c] = 'o';
      if (checkWin(r, c)) {
        board[r][c] = '';
        return c;
      }
      board[r][c] = '';
    }

    // Computer try to block player
    for (let c = 0; c < 7; c++) {
      const r = getAvailableRow(c);
      if (r === -1) continue;
      board[r][c] = 'x';
      if (checkWin(r, c)) {
        board[r][c] = '';
        return c;
      }
      board[r][c] = '';
    }

    return easy();
  }

  // computer hard level
  function hard() {
    // Computer try to win
    for (let c = 0; c < 7; c++) {
      const r = getAvailableRow(c);
      if (r === -1) continue;
      board[r][c] = 'o';
      if (checkWin(r, c)) {
        board[r][c] = '';
        return c;
      }
      board[r][c] = '';
    }

    // computer block player winning move
    for (let c = 0; c < 7; c++) {
      const r = getAvailableRow(c);
      if (r === -1) continue;
      board[r][c] = 'x';
      if (checkWin(r, c)) {
        board[r][c] = '';
        return c;
      }
      board[r][c] = '';
    }

    // computer score all possible moves
    let bestScore = -Infinity;
    let bestCols = [];

    for (let c = 0; c < 7; c++) {
      const r = getAvailableRow(c);
      if (r === -1) continue;

      board[r][c] = 'o';
      const score = evaluateBoard('o') - evaluateBoard('x');
      board[r][c] = '';

      if (score > bestScore) {
        bestScore = score;
        bestCols = [c];
      } else if (score === bestScore) {
        bestCols.push(c);
      }
    }

    if (bestCols.length > 0) {
      return bestCols[Math.floor(Math.random() * bestCols.length)];
    }

    return easy();
  }

  // evluation of all moves of computer/player
  function evaluateBoard(player) {
    let score = 0;
    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];

    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 7; c++) {
        for (const [dr, dc] of directions) {
          let count = 0;
          let block = false;
          for (let i = 0; i < 4; i++) {
            const nr = r + dr * i, nc = c + dc * i;
            if (nr < 0 || nr >= 6 || nc < 0 || nc >= 7) {
              block = true;
              break;
            }
            if (board[nr][nc] === player) count++;
            else if (board[nr][nc] !== '') {
              block = true;
              break;
            }
          }
          if (!block) {
            if (count === 4) score += 1000;
            else if (count === 3) score += 100;
            else if (count === 2) score += 10;
          }
        }
      }
    }
    return score;
  }

  // check board is full for draw
  function isBoardFull() {
    return board.every(row => row.every(cell => cell));
  }

  // Change First player after game over
  function switchStartingPlayer() {
    startingPlayer = startingPlayer === 'x' ? 'o' : 'x';
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
    let game_id = 'connect4';
    let gsize = `${gridSize}x${gridSize}`;
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
      score = (gridSize * gridSize - history.length) * 10 + 100;
    } else {
      messageEl.textContent = `${currentPlayer === 'x' ? player1 : player2} ${currentPlayer.toUpperCase()} wins!`;
      winnerName = currentPlayer === 'x' ? player1 : player2;
      opponent = currentPlayer !== 'x' ? player1 : player2;
      filed3 = 'Player vs Player';
      filed4 = currentPlayer.toUpperCase();
      score = (gridSize * gridSize - history.length) * 10 + 50;
    }
    if (difficulty == 'hard') { score = score + 500 } else if (difficulty == 'medium') { score = score + 200 }
    let player_name = winnerName;
    let player_opponent = opponent;

    saveToLeaderboard(winnerName, opponent, email, gsize, difficulty, game_id, score, elapsed, gameCount, filed1, filed2, filed3, filed4, created_at)

    // const entry = { player_name, player_opponent, email, gsize, difficulty, game_id, score, elapsed, gameCount, filed1, filed2, filed3, filed4, created_at };
    // const boardData = JSON.parse(localStorage.getItem("leaderboard") || "[]");
    // boardData.push(entry);
    // localStorage.setItem("leaderboard", JSON.stringify(boardData));

    window.submitScore &&
      window.submitScore(player_name, player_opponent, email, gsize, difficulty, game_id, score, elapsed, gameCount, filed1, filed2, filed3, filed4, created_at);
  }
  document.addEventListener('DOMContentLoaded', () => {
    localrenderLeaderboard();
  });
});
