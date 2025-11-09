import { startTimer, seconds, minutes, hours} from './timer.js';
import { playSound } from './sound.js';
import { launchFireworks } from './randomFireWorks.js';
import { textToSpeechEng } from './speak.js';

export let timer = false;
export let winnerName;
export const modeEl = document.getElementById('mode');
export const difficultyEl = document.getElementById("difficulty");

window.addEventListener('load', function () {
  const loading = document.getElementById('loading');
  loading.style.display = 'none';

  const boardEl = document.getElementById("board");
  const toggleThemeBtn = document.getElementById("toggle-theme");
  const messageEl = document.getElementById('message');
  const canvas = document.getElementById('fireworksCanvas');

  let board = [];
  let size = 3;
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
  let player1;
  let player2;
  let difficulty = difficultyEl.value;

  document.getElementById("difficulty").addEventListener("click", () => {
    difficulty = difficultyEl.value;
});

  document.getElementById("toggle-theme").addEventListener("click", () => {
    toggleTheme();
  });

  function toggleTheme() {
    document.body.classList.toggle("dark");
    if (document.body.classList.contains("dark")) {
      toggleThemeBtn.innerText = "☀️ Light";
      textToSpeechEng('Theme Dark');
    } else {
      toggleThemeBtn.innerText = "🌙 Dark";
      textToSpeechEng('Theme Light');
    }
  }

  //start game
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

    if (checkWin(x, y)) {
      updateleaderboard();
      timer = false;
      gameOver = true;
      switchStartingPlayer();
      playSound('win');
      launchFireworks();
      return;
    }

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

  function updateleaderboard() {
    winnerName = currentPlayer === 'x' ? player1 : player2;
    let finalScore = score;
    let opponent = player2;
    let game_id = '3inarow';
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
        filed3 = 'Player vs Player';
        filed4 = currentPlayer.toUpperCase();
        winnerName = 'Computer';
        opponent = player1;
        finalScore = score + 50; 
    } else {
        messageEl.textContent = `${currentPlayer === 'x' ? player1 : player2} ${currentPlayer.toUpperCase()} wins!`;
        winnerName = currentPlayer === 'x' ? player1 : player2;
        opponent = currentPlayer !== 'x' ? player1 : player2;
        filed3 = 'Player vs Computer';
        filed4 = currentPlayer.toUpperCase();
        finalScore = score + 100;
    }

    const entry = {winnerName, opponent, email, gsize, difficulty, game_id, finalScore, elapsed, gameCount, filed1, filed2, filed3, filed4, created_at};
    const boardData = JSON.parse(localStorage.getItem("leaderboard") || "[]");
    boardData.push(entry);
    localStorage.setItem("leaderboard", JSON.stringify(boardData));
    
    window.submitScore &&
        window.submitScore(winnerName, opponent, email, gsize, difficulty, game_id, finalScore, elapsed, gameCount, filed1, filed2, filed3, filed4, created_at);
}


  function getWinner(b) {
    const wins = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let [a, b1, c] of wins) {
      if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
    }
    if (b.every(cell => cell !== "")) return "tie";
    return null;
  }

  function getBestMove(level) {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = ai;
        let score = minimax(board, 0, false, level);
        board[i] = "";
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  }

  function minimax(b, depth, isMax, level) {
    const winner = getWinner(b);
    if (winner !== null) {
      if (winner === ai) return 10 - depth;
      else if (winner === human) return depth - 10;
      return 0;
    }

    if ((level === "easy" && depth >= 1) || (level === "medium" && depth >= 2)) {
      return 0; // simulate bad or random move
    }

    if (isMax) {
      let best = -Infinity;
      for (let i = 0; i < b.length; i++) {
        if (b[i] === "") {
          b[i] = ai;
          best = Math.max(best, minimax(b, depth + 1, false, level));
          b[i] = "";
        }
      }
      return best;
    } else {
      let best = Infinity;
      for (let i = 0; i < b.length; i++) {
        if (b[i] === "") {
          b[i] = human;
          best = Math.min(best, minimax(b, depth + 1, true, level));
          b[i] = "";
        }
      }
      return best;
    }
  }

  function switchStartingPlayer() {
    startingPlayer = startingPlayer === 'x' ? 'o' : 'x';
  }
});