import { playSound } from './sound.js';
import { textToSpeechEng } from './speak.js';
import { shareScore } from './share.js';
// import { saveScore } from '../../../leaderboard/gbleaderboard.js';
import { lcrenderLeaderboard, lcsaveToLeaderboard } from '../../../leaderboard/lcleaderboard.js';
// to add firebase leaderboard
import { db } from "../../../leaderboard/firebase-config.js";
import { addDoc, collection, serverTimestamp } from
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export let gameName = 'rockpaperscissor';
export let score = 0;

window.addEventListener('load', function () {
  const loading = document.getElementById('loading');
  loading.style.display = 'none';

  const choices = ['rock', 'paper', 'scissors'];
  const emoji = { rock: '🪨', paper: '📄', scissors: '✂️' };
  const emojiName = { rock: 'Rock', paper: 'Paper', scissors: 'Scissors' };

  const playerScoreEl = document.getElementById('player-score');
  const computerScoreEl = document.getElementById('computer-score');
  const playerPickEl = document.getElementById('player-pick');
  const playerPickNameEl = document.getElementById('player-pick-name');
  const computerPickEl = document.getElementById('computer-pick');
  const computerPickNameEl = document.getElementById('computer-pick-name');
  const resultEl = document.getElementById('result');
  const statusTextEl = document.getElementById('statusText');
  const matchWinnerEl = document.getElementById('match-winner');

  const picks = document.querySelectorAll('.pick');
  const matchLengthSelect = document.getElementById('match-length');
  const difficultySelect = document.getElementById('difficulty');
  const resetBtn = document.getElementById('reset');
  const toggleThemeBtn = document.getElementById('toggle-theme');
  const winTextel = document.getElementById('winText');
  winTextel.style.display = 'none';

  let playerScore = 0, computerScore = 0, rounds = 0;
  let matchLength = parseInt(matchLengthSelect.value);
  let maxWins = Math.ceil(matchLength / 2);
  let matchOver = false;
  let history = [];
  let userMoves = [];
  let theme = localStorage.getItem('rg_theme') || 'dark';
  let player1 = localStorage.getItem('player_name') || 'Human1';
  let difficulty = difficultySelect.value;

//   const themeToggle = document.getElementById('themeToggle');
//   function setTheme(t) {
//     if (t === 'dark') {
//       document.documentElement.setAttribute('data-theme', 'dark');
//       localStorage.setItem('rg_theme', t);
//       themeToggle.textContent = '☀️ Light'
//     }
//     if (t === 'light') {
//       document.documentElement.setAttribute('data-theme', 'light');
//       localStorage.setItem('rg_theme', t);
//       themeToggle.textContent = '🌙 Dark'
//     }
//   }
//   if (themeToggle) themeToggle.addEventListener('click', () => setTheme(localStorage.getItem('rg_theme') === 'dark' ? 'light' : 'dark'));
//   setTheme(localStorage.getItem('rg_theme') === 'dark' ? 'dark' : 'light');

  matchLengthSelect.addEventListener('change', () => {
    matchLength = parseInt(matchLengthSelect.value);
    maxWins = Math.ceil(matchLength / 2);
    resetMatch();
  });

  difficultySelect.addEventListener('change', () => resetMatch());

  function counterMove(move) {
    if (move === 'rock') return 'paper';
    if (move === 'paper') return 'scissors';
    return 'rock';
  }

  function getComputerMove() {
    difficulty = difficultySelect.value;

    if (userMoves.length === 0 || difficulty === 'easy') {
      return choices[Math.floor(Math.random() * 3)];
    }

    if (difficulty === 'medium') {
      if (Math.random() < 0.5) {
        const last = userMoves[userMoves.length - 1];
        return counterMove(last);
      }
      return choices[Math.floor(Math.random() * 3)];
    }

    if (difficulty === 'hard') {
      const lastTwo = userMoves.slice(-2);
      let predicted;
      if (lastTwo.length >= 2 && lastTwo[0] === lastTwo[1]) predicted = lastTwo[1];
      else predicted = userMoves[userMoves.length - 1];
      return counterMove(predicted);
    }

    return choices[Math.floor(Math.random() * 3)];
  }

  function decideWinner(p, c) {
    if (p === c) return 'draw';
    if ((p === 'rock' && c === 'scissors') || (p === 'paper' && c === 'rock') || (p === 'scissors' && c === 'paper')) return 'player';
    return 'computer';
  }

  function playRound(playerMove) {
    if (matchOver) return;
    const computerMove = getComputerMove();

    userMoves.push(playerMove);
    playerPickEl.textContent = emoji[playerMove];
    playerPickNameEl.textContent = emojiName[playerMove];
    computerPickEl.textContent = emoji[computerMove];
    computerPickNameEl.textContent = emojiName[computerMove];

    let aiMsg = '';
    const diff = difficultySelect.value;
    if (diff === 'medium' && Math.random() < 0.6) aiMsg = '⚙️ Smart counter!';
    if (diff === 'hard') aiMsg = '🤖 Computer predicted your move!';

    const winner = decideWinner(playerMove, computerMove);
    history.push({ winner, playerMove, computerMove });

    if (winner === 'draw') {
      resultEl.className = 'result muted';
      resultEl.textContent = `Equal – ${capitalize(playerMove)} both chose the same.।`;
      textToSpeechEng('Draw');
      flash('draw');
    } else if (winner === 'player') {
      playerScore++;
      playerScoreEl.textContent = playerScore;
      resultEl.className = 'result win';
      resultEl.innerHTML = `You Won! ${capitalize(playerMove)} beats ${capitalize(computerMove)}. <div class="muted">${aiMsg}</div>`;
      textToSpeechEng('You Won');
      showConfetti(80);
    } else {
      computerScore++;
      computerScoreEl.textContent = computerScore;
      resultEl.className = 'result lose';
      resultEl.innerHTML = `You Lose! — ${capitalize(computerMove)} beats ${capitalize(playerMove)}. <div class="muted">${aiMsg}</div>`;
      textToSpeechEng('You Lose');
      flash('lose');
    }

    rounds++;
    checkMatchWinner();
  }

  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  function checkMatchWinner() {
    if (playerScore >= maxWins || computerScore >= maxWins) {
      matchOver = true;
      if (playerScore > computerScore) {
        matchWinnerEl.style.color = 'var(--success)';
        matchWinnerEl.textContent = `🎉 ${player1} Won! (${playerScore}-${computerScore})`;
        updateleaderboard();
        playSound('win');
        showConfetti(150);
        shareScore(gameName, score);
      } else {
        matchWinnerEl.style.color = 'var(--danger)';
        matchWinnerEl.textContent = `Computer Won! (${computerScore}-${playerScore})`;
        playSound('loose');
      }
      resultEl.classList.add('muted');
    }
  }

  function resetMatch() {
    playerScore = 0; computerScore = 0; rounds = 0; matchOver = false; userMoves = [];
    playerScoreEl.textContent = '0'; computerScoreEl.textContent = '0';
    playerPickEl.textContent = '❓'; computerPickEl.textContent = '❔';
    resultEl.className = 'result muted';
    statusTextEl.textContent = `Best of ${matchLengthSelect.value} — who wins the first ${Math.ceil(matchLengthSelect.value / 2)} will win`;
    matchWinnerEl.textContent = '';
    history = [];
    userMoves = [];
  }

  resetBtn.addEventListener('click', () => {
    resetMatch();
  });

  picks.forEach(btn => btn.addEventListener('click', () => {
    const mv = btn.dataset.move;
    playRound(mv);
  }));

  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'r') playRound('rock');
    if (e.key.toLowerCase() === 'p') playRound('paper');
    if (e.key.toLowerCase() === 's') playRound('scissors');
  });

  function flash(type) {
    if (type === 'lose') {
      document.body.classList.add('loseEffect');
      setTimeout(() => document.body.classList.remove('loseEffect'), 450);
    } else if (type === 'draw') {
      document.body.classList.add('drawEffect');
      setTimeout(() => document.body.classList.remove('drawEffect'), 450);
    }
  }

      // to add firebase leaderboard (save record)
      window.saveScore = async function () {
        text = `Black=${b}, White=${w}`

        try {
            await addDoc(collection(db, "leaderboard"), {
                game_id: game_id || 'rockpaperscissors',
                game: game || 'rockpaperscissors',
                name: winnerName || 'Guast',
                opponent: opponent || "Computer",
                difficulty: difficulty || "-",
                size: size || `8x8`,
                elapsed: Math.floor(Number(elapsedTime) / 1000) || 0,
                score: score || 0,
                moves: history.length || 0,
                email: email || "-",
                level: "-",
                mode: playMode || 'pvc',
                text: text || "-",
                createdAt: new Date()
            });
            console.log("Score Saved!");
        } catch (error) {
            console.error("Error:", error);
        }
    };

  function updateleaderboard() {
    score = matchLengthSelect.value * 100 + (history.length - computerScore - playerScore) * 5 - computerScore * 10;
    if (computerScore == 0) { score = score + maxWins * 50 };
    let winnerName = localStorage.getItem('player_name') || 'Human1';
    let opponent = "Computer"
    let game_id = 'rockpaperscissors';
    let gsize = `Best of ${matchLengthSelect.value}`;
    let elapsed = 0;
    let gameCount = history.length;
    let filed1 = 0;
    let filed2 = 0
    let filed3 = "Player vs Computer";
    let filed4 = "-";
    let email = localStorage.getItem('email') || '-';
    const created_at = new Date();

    lcsaveToLeaderboard(winnerName, opponent, email, gsize, difficulty, game_id, score, elapsed, gameCount, filed1, filed2, filed3, filed4, created_at)
    // saveScore(player1, opponent, email, gsize, difficulty, game_id, score, elapsed, gameCount, filed1, filed2, filed3, filed4, created_at);
  }

  document.addEventListener('DOMContentLoaded', () => {
    lcrenderLeaderboard();
  });

  function createConfetti(amount = 20) {
    const colors = ["#FF0000", "#8b0000", "#fa8072", "#00FF00",
      "#008000", "#006400", "#9acd32", "#008080", "#0000FF", "#000080",
      "#00bfff", "#FFFF00", "#ffd700", "#bdb76b", "#00FFFF", "#00ced1",
      "#7fffd4", "#FF00FF", "#ee82ee", "#9932cc", "#800080", "#9370db",
      "#800000", "#A52A2A", "#808000", "#FFC0CB", "#c71585", "#ff1493",
      "#ff69b4", "#FFA500", "#FF4500", "#ff7f50", "#000000", "#808080",
      "#C0C0C0", "#2f4f4f", "#696969"];
    for (let i = 0; i < amount; i++) {
      const c = document.createElement('div');
      c.className = 'confetti';
      const size = 6 + Math.random() * 10;
      c.style.width = size + 'px'; c.style.height = size + 'px';
      c.style.left = Math.random() * 100 + 'vw';
      c.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      // c.style.background = `linear-gradient(45deg, hsl(${Math.random()*360} 80% 60%), hsl(${Math.random()*360} 70% 45%))`;
      c.style.transform = `translateY(-10vh) rotate(${Math.random() * 360}deg)`;
      c.style.animation = `fall ${2 + Math.random() * 2}s ease forwards`;
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 4200);
    }
  }

  function showConfetti(t) {
    const container = document.querySelector('.confetti-container');
    container.innerHTML = '';
    createConfetti(t)
    setTimeout(() => {
      winTextel.style.textContent = `🎉 ${player1} Won! (${playerScore}-${computerScore}) 🎉`;
      winTextel.style.display = 'block';
      }, 30000);
  }

  resetMatch();
});