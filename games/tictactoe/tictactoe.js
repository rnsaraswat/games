import { localrenderLeaderboard, saveToLeaderboard } from '../../leaderboard/localleaderboard.js';

window.addEventListener('load', function () {
    const loading = document.getElementById('loading');
    loading.style.display = 'none';

    const modeEl = document.getElementById('mode');
    const boardEl = document.getElementById("board");
    const difficultyEl = document.getElementById("difficulty");
    const toggleThemeBtn = document.getElementById("toggle-theme");
    const messageEl = document.getElementById('message');
    const canvas = document.getElementById('fireworksCanvas');
    const timerDisplay = document.getElementById('timer-display');

    let board = Array(9).fill("");
    let history = [];
    let human = "X";
    let human1 = "O";
    let ai = "O";
    let gameOver = false;
    let currentPlayer = 'X';
    let turn = "X";
    let gameCount = 0;
    let score = 0;
    let timer = false;
    let seconds = 0;
    let minutes = 0;
    let hours = 0;
    let timerInterval;
    let startTime;
    let elapsedTime = 0;

    let theme = localStorage.getItem('rg_theme') || 'dark';
    let player1 = localStorage.getItem('player_name') || 'Human1';
    let mode = modeEl.value;
    let player2 = localStorage.getItem('player_opponent') || 'Human2';
    let winnerName;
    let difficulty = difficultyEl.value;

    document.getElementById("difficulty").addEventListener("click", () => {
        difficulty = difficultyEl.value;
        createBoard();
    });

    namebar.classList.remove('show');
    modeEl.addEventListener('change', function (e) {
        console.log("change mode", mode);
        mode = e.target.value;
        console.log("change mode", mode);
        document.getElementById("player1").textContent = player1;
        document.getElementById("nameInput").placeholder = player2 || 'Human2';
        // player2 = localStorage.getItem('player_opponent') || 'Human2';
        player2 = document.getElementById("nameInput").value;
        // namebar.classList.add('show');
        if (mode == 'pvp') {
            namebar.classList.add('show');
        } else {
            namebar.classList.remove('show');
            player2 = "Computer";
        }
        console.log(player1, player2);
    });

    document.getElementById("name").addEventListener("click", () => {
        namebar.classList.remove('show');
        player2 = document.getElementById("nameInput").value;
        messageEl.innerText = "Click New game to play";
    });

    //start game
    document.getElementById("startGame").addEventListener("click", () => {
        if (gameOver) {
            resetGame();
        } else {
            createBoard();
        }
    });

    function createBoard() {
        boardEl.innerHTML = "";
        if (!timer) {
            timer = true;
            startTimer();
        }
        messageEl.innerText = `Click in cell to play (${player1} turn (X)`;
        board.forEach((val, i) => {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.index = i;

            if (val === human) {
                cell.classList.add("x");
            } else if (val === ai) {
                cell.classList.add("o");
            } else if (val === human1) {
                cell.classList.add("o");
            }


            if (val !== "" || gameOver) {
                cell.classList.add("disabled");
            } else {
                cell.addEventListener("click", onCellClick);
            }

            boardEl.appendChild(cell);
        });
    }

    function onCellClick(e) {
        const index = e.target.dataset.index;
        if (gameOver) { return }
        if (board[index] !== "") {
            playSound('error');
            return;
        }
        // if (board[index] === "" && !gameOver) {
        if (board[index] === "") {
            if (modeEl.value === 'pvp') {
                if (currentPlayer === 'X') {
                    makeMove(index, human);
                    currentPlayer = 'O';
                } else {
                    makeMove(index, human1);
                    currentPlayer = 'X';
                }
                checkGameOver();
            } else {
                makeMove(index, human);
                checkGameOver();
                if (!gameOver) {
                    setTimeout(() => {
                        let bestMove = getBestMove(difficultyEl.value);
                        makeMove(bestMove, ai);
                        checkGameOver();
                    }, 300);
                }
            }
        }
    }

    function makeMove(index, player) {
        board[index] = player;
        playSound('click');
        history.push([...board]);
        createBoard();
    }

    // undo move
    document.getElementById("undo-last").addEventListener("click", () => {
        textToSpeechEng('Undo');
        undoMove();
    });

    function undoMove() {
        if (history.length >= 2 && !gameOver) {
            history.pop(); // human1 or computer move
            history.pop(); // Human move
            board = history[history.length - 1] || Array(9).fill("");
            createBoard();
        }
    }

    function checkGameOver() {
        const winner = getWinner(board);
        if (winner) {
            gameOver = true;
            timer = false;
            clearInterval(timerInterval);
            if (modeEl.value === 'pvp') {
                if (winner === human) {
                    winnerName = winner;
                    playSound('win');
                    launchFireworks(player1);
                    messageEl.innerText = `${player1} Win! 😊`;
                    updateleaderboard();
                } else if (winner === ai) {
                    winnerName = winner;
                    playSound('win');
                    launchFireworks(player2);
                    messageEl.innerText = `${player2} Wins! 🤖`;
                } else {
                    playSound('draw');
                    messageEl.innerText = "It's a Draw! 😆 press new game to play again";
                }
            } else if (modeEl.value === 'pvc') {
                if (winner === human) {
                    winnerName = winner;
                    playSound('win');
                    launchFireworks(player1);
                    messageEl.innerText = `${player1} Win! 😊`;
                    updateleaderboard();
                } else if (winner === ai) {
                    winnerName = winner;
                    playSound('win');
                    launchFireworks("Computer");
                    messageEl.innerText = `Computer Wins! 🤖`;
                } else {
                    playSound('draw');
                    messageEl.innerText = "It's a Draw! 😆 press new game to play again";
                }
            }
        } else {
            if (currentPlayer === 'O') {
                messageEl.innerText = `${player2} Turn (O)`;
            } else {
                messageEl.innerText = `${player1} Turn (X)`;
            }
        }
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

    function resetGame() {
        board = Array(9).fill("");
        history = [];
        gameOver = false;
        gameCount++;
        turn = gameCount % 2 === 0 ? "X" : "O";

        if (mode == 'pvc' && turn === ai) {
            board[getBestMove(difficultyEl.value)] = ai;
        }


        history.push([...board]);
        createBoard();
        if (mode == 'pvc') {
            if (turn === ai) {
                messageEl.innerText = `Computer Played! ${player1} Turn (X)`;
            } else if (turn === human) {
                messageEl.innerText = `${player1} Turn (X)`;
            }
        } else if (mode == 'pvp') {
            if (turn === human) {
                messageEl.innerText = `${player1} Turn (X)`;
            } else if (turn === human1) {
                messageEl.innerText = `${player2} Turn (X)`;
            }
        }
    }

    //toggle theme
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

    // display timer


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

    // para to speeach in english
    function textToSpeechEng(text) {
        let speechSynthesis = window.speechSynthesis;
        let utterance = new SpeechSynthesisUtterance();
        utterance.lang = "en-US";
        utterance.voice = speechSynthesis.getVoices().find(voice => voice.lang === 'en-US');
        utterance.text = text;
        speechSynthesis.speak(utterance);
    }
    // Sound objects
    const sounds = {
        click: new Audio('../../assets/sound/tap-sound.mp3'),
        error: new Audio('../../assets/sound/error-sound.mp3'),
        win: new Audio('../../assets/sound/winner-trumpets.mp3'),
        draw: new Audio('../../assets/sound/game-over-classic.mp3'),
        bg: new Audio('../../assets/sound/bg-music.mp3'),
        fire: new Audio('../../assets/sound/fireworks.mp3')
    };

    // sounds.bg.loop = true;
    let soundEnabled = false;

    document.getElementById("toggle-sound").addEventListener("click", () => {
        soundEnabled = !soundEnabled;
        document.getElementById("toggle-sound").textContent = soundEnabled ? "🔊 Sound: On" : "🔇 Sound: Off";
        if (soundEnabled) sounds.bg.play();
        else sounds.bg.pause();
    });

    // Play sound helper
    function playSound(type) {
        if (sounds[type]) {
            sounds[type].currentTime = 0;
            sounds[type].play();
        }
    }

    function updateleaderboard() {
        console.log("update leader board")
        let player_name = player1;
        let finalScore = 0;
        let player_opponent = player2;
        let game_id = 'tictactoe';
        let size = '3x3';
        let elapsed = hours * 3600 + minutes * 60 + seconds;
        let moves = history.length;;
        let filed1 = 0;
        let filed2 = 0
        let filed3 = "-";
        let filed4 = "-";
        let email = localStorage.getItem('email') || '-';
        const created_at = new Date();
        if (mode === 'pvc' && winnerName === human) {
            filed3 = 'Player vs Computer';
            filed4 = currentPlayer.toUpperCase();
            player_name = player1;
            player_opponent = 'Computer';
            finalScore = 9 * 10 - history.length * 2 + 100;
        } else if (mode === 'pvc' && winnerName === ai) {
            filed3 = 'Player vs Computer';
            filed4 = currentPlayer.toUpperCase();
            player_name = 'Computer';
            player_opponent = player2;
            finalScore = 9 * 10 - history.length * 2 + 100;
        } else if (winnerName === human) {
            player_name = player1;
            player_opponent = player2;
            filed3 = 'Player vs Player';
            filed4 = currentPlayer.toUpperCase();
            finalScore = 9 * 10 - history.length * 2 + 50;
        } else {
            player_name = player2;
            player_opponent = player1;
            filed3 = 'Player vs Player';
            filed4 = currentPlayer.toUpperCase();
            finalScore = 9 * 10 - history.length * 2 + 50;
        }

        saveToLeaderboard(player_name, player_opponent, email, size, difficulty, game_id, finalScore, elapsed, moves, filed1, filed2, filed3, filed4, created_at)
        window.submitScore &&
            window.submitScore(player_name, player_opponent, email, size, difficulty, game_id, finalScore, elapsed, moves, filed1, filed2, filed3, filed4, created_at);
    }
    document.addEventListener('DOMContentLoaded', () => {
        localrenderLeaderboard();
    });

    // import { winnerName } from './script.js';
    class FireParticle {
        constructor(x, y, color, dx, dy, shape) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.dx = dx;
            this.dy = dy;
            this.shape = shape;
            this.alpha = 1;
            this.gravity = 0.08;
            this.size = 4 + Math.random() * 4;
        }

        drawPolygon(ctx, sides) {
            const step = (Math.PI * 2) / sides;
            ctx.moveTo(this.size, 0);
            for (let i = 1; i <= sides; i++) {
                ctx.lineTo(this.size * Math.cos(i * step), this.size * Math.sin(i * step));
            }
        }

        drawStar(ctx, points, innerRatio = 0.5) {
            const step = Math.PI / points;
            ctx.moveTo(this.size, 0);
            for (let i = 0; i < 2 * points; i++) {
                const radius = i % 2 === 0 ? this.size : this.size * innerRatio;
                const angle = i * step;
                ctx.lineTo(radius * Math.cos(angle), radius * Math.sin(angle));
            }
            ctx.closePath();
        }

        // drawStar1(ctx, x, y, outerRadius, innerRadius, points, rotation = 0) {
        drawStar1(ctx, x, y, points, rotation = 0) {
            ctx.beginPath();
            for (let i = 0; i < points * 2; i++) {
                // const radius = i % 2 === 0 ? outerRadius : innerRadius;
                const radius = i % 2 === 0 ? this.size : this.size * 0.5;
                const angle = rotation + (i * Math.PI / points);
                const currentX = x + radius * Math.cos(angle);
                const currentY = y + radius * Math.sin(angle);
                if (i === 0) {
                    ctx.moveTo(currentX, currentY);
                } else {
                    ctx.lineTo(currentX, currentY);
                }
            }
            ctx.closePath();
            ctx.stroke(); // or ctx.fill()
        }

        update(ctx) {
            this.dy += this.gravity;
            this.x += this.dx;
            this.y += this.dy;
            this.alpha -= 0.02;

            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            // for neon display
            ctx.shadowBlur = 20;
            ctx.shadowColor = this.color;
            ctx.strokeStyle = this.color;
            ctx.translate(this.x, this.y);
            ctx.beginPath();
            switch (this.shape) {
                case 'freehandOpen':
                    ctx.moveTo(-this.size, -this.size / 2);
                    for (let i = 0; i < 4; i++) {
                        const dx = (Math.random() - 0.5) * this.size;
                        const dy = (Math.random() - 0.5) * this.size;
                        ctx.lineTo(dx, dy);
                    }
                    break;
                case 'freehandClosed':
                    ctx.moveTo(-this.size, -this.size / 2);
                    for (let i = 0; i < 4; i++) {
                        const dx = (Math.random() - 0.5) * this.size;
                        const dy = (Math.random() - 0.5) * this.size;
                        ctx.lineTo(dx, dy);
                    }
                    ctx.closePath();
                    break;
                case 'circle': ctx.arc(0, 0, this.size, 0, 2 * Math.PI); break;
                case 'square': ctx.rect(-this.size / 2, -this.size / 2, this.size, this.size); break;
                case 'triangle':
                    ctx.moveTo(0, -this.size);
                    ctx.lineTo(this.size, this.size);
                    ctx.lineTo(-this.size, this.size);
                    ctx.closePath(); break;
                case 'ellipse':
                    ctx.ellipse(0, 0, this.size, this.size * 0.6, 0, 0, Math.PI * 2); break;
                case 'zigzag':
                    for (let i = 0; i < 5; i++) {
                        const x = i * this.size / 5 - this.size / 2;
                        const y = (i % 2 === 0 ? -1 : 1) * this.size / 2;
                        ctx.lineTo(x, y);
                    } break;
                case 'pentagon': this.drawPolygon(ctx, 5); break;
                case 'hexagon': this.drawPolygon(ctx, 6); break;
                case 'heptagon': this.drawPolygon(ctx, 7); break;
                case 'octagon': this.drawPolygon(ctx, 8); break;
                case 'nonagon': this.drawPolygon(ctx, 9); break;
                case 'decagon': this.drawPolygon(ctx, 10); break;
                case 'star5': this.drawStar(ctx, 5); break;
                case 'star6': this.drawStar(ctx, 6); break;
                case 'star7': this.drawStar(ctx, 7); break;
                case 'star8': this.drawStar(ctx, 8); break;
                case 'star9': this.drawStar(ctx, 9); break;
                case 'star10': this.drawStar(ctx, 10); break;
                case 'star15': this.drawStar1(ctx, 5); break;
                case 'star16': this.drawStar1(ctx, 6); break;
                case 'star17': this.drawStar1(ctx, 7); break;
                case 'star18': this.drawStar1(ctx, 8); break;
                case 'star19': this.drawStar1(ctx, 9); break;
                case 'star20': this.drawStar1(ctx, 10); break;
                default: ctx.arc(0, 0, this.size, 0, 2 * Math.PI);
            }
            ctx.fill();
            ctx.restore();
        }

        isAlive() {
            return this.alpha > 0;
        }
    }

    class GroundCracker {
        constructor(x, y) {
            this.particles = [];
            this.colors = ['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#ff00ff', '#ffffff'];
            this.shapes = [
                'freehandOpen', 'freehandClosed',
                'circle', 'square', 'triangle', 'ellipse', 'zigzag',
                'pentagon', 'hexagon', 'heptagon', 'octagon', 'nonagon', 'decagon',
                'pentagon', 'hexagon', 'heptagon', 'octagon', 'nonagon', 'decagon',
                'star5', 'star6', 'star7', 'star8', 'star9', 'star10',
                'star15', 'star16', 'star17', 'star18', 'star19', 'star20',
                'freehandOpen', 'freehandClosed'
            ]; for (let i = 0; i < 60; i++) {
                const angle = Math.random() * 2 * Math.PI;
                const speed = Math.random() * 4 + 1.5;
                const dx = Math.cos(angle) * speed;
                const dy = Math.sin(angle) * speed;
                const color = this.colors[Math.floor(Math.random() * this.colors.length)];
                const shape = this.shapes[Math.floor(Math.random() * this.shapes.length)];
                this.particles.push(new FireParticle(x, y, color, dx, dy, shape));
            }
        }

        update(ctx) {
            this.particles.forEach(p => p.update(ctx));
            this.particles = this.particles.filter(p => p.isAlive());
        }

        isAlive() {
            return this.particles.length > 0;
        }
    }

    // show wining text using canvas
    function drawNeonText(ctx, canvas, name) {
        ctx.save();
        ctx.font = "bold 4vw EnglishFontBangers";
        if (document.body.classList.contains("dark")) {
            ctx.fillStyle = 'rgba(255,255,255,0.15)';
        } else {
            ctx.fillStyle = 'rgba(0,0,0,0.15)';
        }
        ctx.textAlign = "center";
        ctx.letterSpacing = "5px";

        ctx.textBaseline = "middle";
        ctx.shadowColor = "lightblue";
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.shadowBlur = 5;
        // ctx.fillText("YOU WIN!", canvas.width / 2, canvas.height / 2);
        // ctx.fillText(`🎉 ${winnerName} Won! 🎉`, canvas.width / 2, canvas.height / 2);
        if (document.body.classList.contains("dark")) {
            ctx.shadowColor = 'rgb(128, 0, 128)';
            ctx.fillText(`🎉 ${name} Won! 🎉`, canvas.width / 2, canvas.height / 2);
        } else {
            ctx.shadowColor = 'rgb(0, 255, 255)';
            ctx.fillText(`🎉 ${name} Won! 🎉`, canvas.width / 2, canvas.height / 2);
        }
        ctx.restore();
    }

    function launchFireworks(name) {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = 0;
        canvas.style.left = 0;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.zIndex = 9999;
        canvas.style.pointerEvents = 'none';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        const crackers = [];

        // Edges only - top, bottom, left, right (not center)
        const edgeCrackers = 8;
        const padding = 60;

        for (let i = 0; i < edgeCrackers; i++) {
            // Top
            crackers.push(new GroundCracker(
                padding + i * (window.innerWidth - 2 * padding) / (edgeCrackers - 1),
                padding
            ));
            crackers.push(new GroundCracker(
                padding + i * (window.innerWidth - 1 * padding) / (edgeCrackers - 1),
                padding
            ));
            // Bottom
            crackers.push(new GroundCracker(
                padding + i * (window.innerWidth - 2 * padding) / (edgeCrackers - 1),
                window.innerHeight - padding
            ));
            // // Left
            // crackers.push(new GroundCracker(
            //     padding,
            //     padding + i * (window.innerHeight - 2 * padding) / (edgeCrackers - 1)
            // ));
            // // Right
            // crackers.push(new GroundCracker(
            //     window.innerWidth - padding,
            //     padding + i * (window.innerHeight - 2 * padding) / (edgeCrackers - 1)
            // ));
        }

        function animate() {
            if (document.body.classList.contains("dark")) {
                ctx.fillStyle = 'rgba(0,0,0,0.01)';
            } else {
                ctx.fillStyle = 'rgba(255,255,255,0.01)';
            }

            // ctx.fillStyle = 'rgba(255,255,255,0.15)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            // show wining text using canvas
            drawNeonText(ctx, canvas, name);
            crackers.forEach(c => c.update(ctx));
            for (let i = crackers.length - 1; i >= 0; i--) {
                if (!crackers[i].isAlive()) crackers.splice(i, 1);
            }

            if (crackers.length > 0) {
                requestAnimationFrame(animate);
            } else {
                document.body.removeChild(canvas);
            }
        }

        animate();
    }
    // background music during page load and play
    window.addEventListener("load", () => {
        if (soundEnabled) playSound('bg');
    });
});