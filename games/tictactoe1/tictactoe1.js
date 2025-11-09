window.addEventListener('load', function () {
    const loading = document.getElementById('loading');
    loading.style.display = 'none';

    const boardEl = document.getElementById("board");
    const difficultyEl = document.getElementById("difficulty");
    const toggleThemeBtn = document.getElementById("toggle-theme");
    const messageEl = document.getElementById('message');
    const modeEl = document.getElementById('mode');
    const leaderboardEl = document.getElementById('leaderboard');
    const canvas = document.getElementById('fireworksCanvas');

    let board = [];
    let gridSize = 3;
    let history = [];
    let currentPlayer = 'x';
    let startingPlayer = 'x';
    let turn = "X";
    let human = "X";
    let ai = "O";
    let gameOver = false;
    let timer = false;
    let humanScore = 0;
    let aiScore = 0;
    let draws = 0;
    let score = 0;
    let gameCount = 0;
    let winnerName;
    let player1;
    let player2;
    let difficulty = difficultyEl.value;

    document.getElementById("difficulty").addEventListener("click", () => {
        difficulty = difficultyEl.value;
    });

    //toggle theme
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
        board = Array(gridSize).fill().map(() => Array(gridSize).fill(''));
        boardEl.innerHTML = '';
        boardEl.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        boardEl.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
        currentPlayer = 'x';
        currentPlayer = startingPlayer;
        gameOver = false;
        timer = true;

        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
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
            updateleaderboard()
            timer = false;
            clearInterval(timerInterval);
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

        // easy level
        if (difficulty === 'easy') {
            const moves = [];
            for (let y = 0; y < gridSize; y++) {
                for (let x = 0; x < gridSize; x++) {
                    if (!board[y][x]) moves.push({ x, y });
                }
            }
            if (moves.length > 0) move = moves[Math.floor(Math.random() * moves.length)];

        } else if (difficulty === 'medium') {
            move = findMediumMove();

        } else {
            move = findBestMove();
            // move = getBestMove();
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

        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
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

        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
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

        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
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
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
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
        let game_id = 'tictactoe';
        let size = '3x3';
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

        const entry = {winnerName, opponent, email, size, difficulty, game_id, finalScore, elapsed, gameCount, filed1, filed2, filed3, filed4, created_at};
        const boardData = JSON.parse(localStorage.getItem("leaderboard") || "[]");
        boardData.push(entry);
        localStorage.setItem("leaderboard", JSON.stringify(boardData));
        
        window.submitScore &&
            window.submitScore(winnerName, opponent, email, size, difficulty, game_id, finalScore, elapsed, gameCount, filed1, filed2, filed3, filed4, created_at);
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
            return 0; 
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

    const sounds = {
        click: new Audio('../../assets/sound/tap-sound.mp3'),
        error: new Audio('../../assets/sound/error-sound.mp3'),
        win: new Audio('../../assets/sound/winner-trumpets.mp3'),
        draw: new Audio('../../assets/sound/game-over-classic.mp3'),
        bg: new Audio('../../assets/sound/bg-music.mp3'),
        fire: new Audio('../../assets/sound/fireworks.mp3')
    };

    let soundEnabled = false;

    document.getElementById("toggle-sound").addEventListener("click", () => {
        soundEnabled = !soundEnabled;
        document.getElementById("toggle-sound").textContent = soundEnabled ? "🔊 Music:On" : "🔇 Music:Off";
        if (soundEnabled) sounds.bg.play();
        else sounds.bg.pause();
    });

    function playSound(type) {
        if (sounds[type]) {
            sounds[type].currentTime = 0;
            sounds[type].play();
        }
    }

    window.addEventListener("load", () => {
        if (soundEnabled) playSound('bg');
    });

    // display timer
    let seconds = 0;
    let minutes = 0;
    let hours = 0;
    let timerInterval;
    let startTime;
    let elapsedTime = 0;
    const timerDisplay = document.getElementById('timer-display');

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
        timerDisplay.textContent  = `⏱️ ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }

    function textToSpeechEng(text) {
        let speechSynthesis = window.speechSynthesis;
        let utterance = new SpeechSynthesisUtterance();
        utterance.lang = "en-US";
        utterance.voice = speechSynthesis.getVoices().find(voice => voice.lang === 'en-US');
        utterance.text = text;
        speechSynthesis.speak(utterance);
    }

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

        drawStar1(ctx, x, y, points, rotation = 0) {
            ctx.beginPath();
            for (let i = 0; i < points * 2; i++) {
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
            ctx.stroke(); 
        }

        update(ctx) {
            this.dy += this.gravity;
            this.x += this.dx;
            this.y += this.dy;
            this.alpha -= 0.02;

            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
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

    function drawNeonText(ctx, canvas) {
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
        if (document.body.classList.contains("dark")) {
            ctx.shadowColor = 'rgb(128, 0, 128)';
            ctx.fillText(`🎉 ${winnerName} Won! 🎉`, canvas.width / 2, canvas.height / 2);
        } else {
            ctx.shadowColor = 'rgb(0, 255, 255)';
            ctx.fillText(`🎉 ${winnerName} Won! 🎉`, canvas.width / 2, canvas.height / 2);
        }
        ctx.restore();
    }

    function launchFireworks() {
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

        const edgeCrackers = 8;
        const padding = 60;

        for (let i = 0; i < edgeCrackers; i++) {
            crackers.push(new GroundCracker(
                padding + i * (window.innerWidth - 2 * padding) / (edgeCrackers - 1),
                padding
            ));
            crackers.push(new GroundCracker(
                padding + i * (window.innerWidth - 2 * padding) / (edgeCrackers - 1),
                window.innerHeight - padding
            ));
            crackers.push(new GroundCracker(
                padding,
                padding + i * (window.innerHeight - 2 * padding) / (edgeCrackers - 1)
            ));
            crackers.push(new GroundCracker(
                window.innerWidth - padding,
                padding + i * (window.innerHeight - 2 * padding) / (edgeCrackers - 1)
            ));
        }

        function animate() {
            if (document.body.classList.contains("dark")) {
                ctx.fillStyle = 'rgba(0,0,0,0.01)';
            } else {
                ctx.fillStyle = 'rgba(255,255,255,0.01)';
            }

            ctx.fillRect(0, 0, canvas.width, canvas.height);
            drawNeonText(ctx, canvas);
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
});
