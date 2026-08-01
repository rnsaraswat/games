import { startTimer, seconds, minutes, hours, timerInterval, elapsedTime } from './timer.js';
import { playSound } from './sound.js';
import { launchFireworks } from './randomFireWorks.js';
import { textToSpeechEng } from './speak.js';
import { shareScore } from './share.js';
// import { saveScore } from '../../../leaderboard/gbleaderboard.js';
import { lcrenderLeaderboard, lcsaveToLeaderboard } from '../../../leaderboard/lcleaderboard.js';
// to add firebase leaderboard
import { db } from "../../../leaderboard/firebase-config.js";
import { addDoc, collection, serverTimestamp } from
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export const modeEl = document.getElementById('mode');
export const difficultyEl = document.getElementById("difficulty");
export let timer = false;
export let winnerName;
export let gameName = '3inARow';
export let score = 0;

window.addEventListener('load', function () {
  const loading = document.getElementById('loading');
  loading.style.display = 'none';

  const boardEl = document.getElementById("board");
  const messageEl = document.getElementById('message');
  const canvas = document.getElementById('fireworksCanvas');

  let board = [];
  let history = [];
  let currentPlayer = 'x';
  let startingPlayer = 'x';
  let human = "X";
  let ai = "O";
  let gameOver = false;

  let humanScore = 0;
  let aiScore = 0;
  let draws = 0;
  let score = 0;
  let gameCount = 0;
  let player1 = localStorage.getItem('player_name') || 'Human1';
  let player2 = localStorage.getItem('player_opponent') || 'Human2';
  let mode = modeEl.value;

  // define variables also used to add firebase leaderboard
  const user = JSON.parse(localStorage.getItem("user"));
  let player = user ? user.name : localStorage.getItem('player_name');
  let email = user ? user.email : "";
  let opponent = localStorage.getItem('opponent') || 'Human2';
  let game = gameName;
  let game_id = gameName;
  let difficulty = difficultyEl.value;
  let elapsed, level, date;
  let size = 3;
  let gsize = '8x8';
  // let hours = 0;
  // let seconds = 0;
  // let minutes = 0;
  let text = "";
  let playMode = "-";

  this.document.getElementById("player1").textContent = player1;


  document.getElementById("difficulty").addEventListener("click", () => {
    difficulty = difficultyEl.value;
  });

  modeEl.addEventListener('change', function (e) {
    mode = e.target.value;
    document.getElementById("nameInput").placeholder = player2 || 'Human2';
    player2 = localStorage.getItem('player_opponent') || 'Human2';
    document.getElementById("nameInput").value = player2 || 'Human2';
    if (mode == 'pvp') {
      namebar.classList.add('show');
    } else {
      namebar.classList.remove('show');
    }
  });

  document.getElementById("startGame").addEventListener("click", () => {
    startGame();
  });

  function startGame() {
    if (modeEl.value === 'pvc') {
      player1 = localStorage.getItem('player_name') || "Human";
      player2 = "Computer";
    } else if (modeEl.value === 'pvp') {
      player1 = localStorage.getItem('player_name') || "Human1";
      player2 = localStorage.getItem('player_opponent') || "Human";
    }
    // createBoard();
    size = parseInt(document.getElementById('gridSize').value);
    board = Array(size).fill().map(() => Array(size).fill(''));
    boardEl.innerHTML = '';

    boardEl.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    boardEl.style.gridTemplateRows = `repeat(${size}, 1fr)`;
    currentPlayer = 'x';
    currentPlayer = startingPlayer;
    gameOver = false;
    timer = true;

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
      messageEl.textContent = `Computer (${currentPlayer === 'x' ? 'Red' : 'Yellow'}'s) turn`;
      setTimeout(computerMove, 300);
    } else {
      messageEl.innerHTML = `${currentPlayer === 'x' ? player1 : player2} (${currentPlayer === 'x' ? 'Red' : 'Yellow'}'s) turn <br> Click on square to play`;
    }
  }

  document.getElementById("undo-last").addEventListener("click", () => {
    textToSpeechEng('Undo');
    undoLast();
  });

  function undoLast() {
    if (history.length === 0 || gameOver) return;
    let undoCount = (modeEl.value === 'pvc') ? 2 : 1;

    while (undoCount-- > 0 && history.length > 0) {
      const last = history.pop();
      board[last.y][last.x] = '';
      const cell = document.querySelector(`.cell[data-y='${last.y}'][data-x='${last.x}']`).textContent = '';
      if (cell) cell.className = 'cell';
      currentPlayer = last.player;
      if (modeEl.value === 'pvc' && currentPlayer === 'o') {
        messageEl.textContent = `Computer (${currentPlayer}'s) turn`;
      } else {
        messageEl.textContent = `${currentPlayer === 'x' ? player1 : player2} (${currentPlayer}'s) turn`;
      }
      gameOver = false;
    }
  }

  function onCellClick(e) {
    if (gameOver) return;

    const x = +e.target.dataset.x;
    const y = +e.target.dataset.y;
    if (board[y][x]) {
      playSound('error');
      return;
    }

    board[y][x] = currentPlayer;
    playSound('click');
    history.push({ y, x, player: currentPlayer });
    e.target.textContent = currentPlayer.toUpperCase();
    e.target.classList.add(currentPlayer);
    // launchFireworks();

    if (checkWin(x, y)) {
      updateleaderboard();
      window.saveScore();
      timer = false;
      gameOver = true;
      clearInterval(timerInterval);
      switchStartingPlayer();
      playSound('win');
      launchFireworks();
      shareScore(gameName, score);
      return;
    }

    if (isBoardFull()) {
      messageEl.textContent = `It's a draw!`;
      timer = false;
      clearInterval(timerInterval);
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

  function isBoardFull() {
    return board.every(row => row.every(cell => cell));
  }

  function switchStartingPlayer() {
    startingPlayer = startingPlayer === 'x' ? 'o' : 'x';
  }

  function computerMove() {
    const difficulty = difficultyEl.value;
    let move = null;

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
      move = findBestMove();
    }

    if (move) {
      const cell = document.querySelector(`.cell[data-x='${move.x}'][data-y='${move.y}']`);
      if (cell) cell.click();
    }
  }

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

      for (let i = 1; i < 3; i++) {
        const nx = x + dx * i, ny = y + dy * i;
        if (board[ny]?.[nx] === currentPlayer) {
          count++;
          cells.push([nx, ny]);
        } else break;
      }
      for (let i = 1; i < 3; i++) {
        const nx = x - dx * i, ny = y - dy * i;
        if (board[ny]?.[nx] === currentPlayer) {
          count++;
          cells.push([nx, ny]);
        } else break;
      }

      if (count >= 3) {
        cells.forEach(([cx, cy]) => {
          const el = document.querySelector(`.cell[data-x='${cx}'][data-y='${cy}']`);
          if (el) el.classList.add('win');
        });
        return true;
      }
    }
    return false;
  }

  function findMediumMove() {
    let move = findStrategicMove('o');
    if (move) return move;

    move = findStrategicMove('x');
    if (move) return move;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (!board[y][x]) return { x, y };
      }
    }
    return null;
  }

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
          for (let i = 1; i <= 2; i++) {
            const nx = x + dx * i;
            const ny = y + dy * i;
            if (board[ny]?.[nx] === player) count++;
            else break;
          }
          for (let i = 1; i <= 2; i++) {
            const nx = x - dx * i;
            const ny = y - dy * i;
            if (board[ny]?.[nx] === player) count++;
            else break;
          }

          if (count >= 2) return { x, y };
        }
      }
    }
    return null;
  }

  function findBestMove() {
    let bestScore = -Infinity;
    let bestMove = null;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (!board[y][x]) {
          let scoreO = getScore(x, y, 'o');
          let scoreX = getScore(x, y, 'x');
          let totalScore = scoreO + scoreX * 1.1;

          if (totalScore > bestScore) {
            bestScore = totalScore;
            bestMove = { x, y };
          }
        }
      }
    }
    return bestMove || getRandomMove();
  }

  function getScore(x, y, player) {
    let score = 0;
    const directions = [
      { dx: 1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: 1, dy: 1 },
      { dx: 1, dy: -1 }
    ];

    for (const { dx, dy } of directions) {
      let count = 0;
      for (let i = 1; i < 3; i++) {
        const nx = x + dx * i;
        const ny = y + dy * i;
        if (board[ny]?.[nx] === player) count++;
        else break;
      }
      for (let i = 1; i < 3; i++) {
        const nx = x - dx * i;
        const ny = y - dy * i;
        if (board[ny]?.[nx] === player) count++;
        else break;
      }
      score += Math.pow(10, count);
    }
    return score;
  }

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

      // to add firebase leaderboard (save record)
      window.saveScore = async function () {
        if (modeEl.value === 'pvc' && currentPlayer === 'o') {
          mode = 'Player vs Computer';
          winnerName = 'Computer';
          opponent = player1;
          score = (size * size - history.length) * 10 + 100;
        } else {
          winnerName = currentPlayer === 'x' ? player1 : player2;
          opponent = currentPlayer !== 'x' ? player1 : player2;
          mode = 'Player vs Player';
          score = (size * size - history.length) * 10 + 50;
        }
        if (difficulty == 'hard') { score = score + 500 } else if (difficulty == 'medium') { score = score + 200 }

        try {
            await addDoc(collection(db, "leaderboard"), {
                game_id: gameName || '3inARow',
                game: gameName || '3inARow',
                name: winnerName || 'Guast',
                opponent: opponent || "Computer",
                difficulty: difficulty || "-",
                size: `${size}x${size}` || `8x8`,
                elapsed: Math.floor(Number(elapsedTime) / 1000) || 0,
                score: score || 0,
                moves: history.length || 0,
                email: email || "-",
                level: "-",
                mode: playMode || 'pvc',
                text: currentPlayer.toUpperCase() || "-",
                createdAt: new Date()
            });
            console.log("Score Saved!");
        } catch (error) {
            console.error("Error:", error);
        }
    };

  function updateleaderboard() {
    winnerName = currentPlayer === 'x' ? player1 : player2;
    let opponent = player2;
    game_id = gameName;
    gsize = `${size}x${size}`;
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
      score = (size * size - history.length) * 10 + 100;
    } else {
      messageEl.textContent = `${currentPlayer === 'x' ? player1 : player2} ${currentPlayer.toUpperCase()} wins!`;
      winnerName = currentPlayer === 'x' ? player1 : player2;
      opponent = currentPlayer !== 'x' ? player1 : player2;
      filed3 = 'Player vs Player';
      filed4 = currentPlayer.toUpperCase();
      score = (size * size - history.length) * 10 + 50;
    }
    if (difficulty == 'hard') { score = score + 500 } else if (difficulty == 'medium') { score = score + 200 }
    let player_name = winnerName;
    let player_opponent = opponent;

    lcsaveToLeaderboard(winnerName, opponent, email, gsize, difficulty, game_id, score, elapsed, gameCount, filed1, filed2, filed3, filed4, created_at);

    // saveScore(player_name, player_opponent, email, gsize, difficulty, game_id, score, elapsed, gameCount, filed1, filed2, filed3, filed4, created_at);
  }
  document.addEventListener('DOMContentLoaded', () => {
    lcrenderLeaderboard();
  });
});