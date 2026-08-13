import { shareScore } from './share.js';
import { textToSpeechEng } from './speak.js';
// import { saveScore } from '../../../leaderboard/gbleaderboard.js';
import { lcrenderLeaderboard, lcsaveToLeaderboard } from '../../../leaderboard/lcleaderboard.js';
import { playSound } from './sound.js';
// to add firebase leaderboard
import { db } from "../../../leaderboard/firebase-config.js";
import { addDoc, collection, serverTimestamp } from
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export let winnerName = localStorage.getItem('player_name') || getUserName();
export let gameName = 'reversi';
let game = "reversi";
let game_id = "reversi";
let opponent, difficulty, moves, level, date;
export let score;
let size = '8x8';
let h = 0;
let m = 0;
let s = 0;
let b = 0;
let w = 0;
let text = "Shape Square";
let playMode = "pvc";

document.addEventListener("DOMContentLoaded", function () {
    const loading = document.getElementById('loading');
    loading.style.display = 'none';

    const startBtn = document.getElementById('startBtn');
    const undoBtn = document.getElementById('undoBtn');
    const boardDiv = document.getElementById('board');
    const difficultySelectBtn = document.getElementById('difficultySelect');
    const statusEl = document.getElementById('message');
    const bScore = document.getElementById("bScore");
    const wScore = document.getElementById("wScore");
    const resumeBtn = document.getElementById('resumeBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const pauseOverlay = document.getElementById("pauseOverlay");

    toggleElement(pauseBtn, true);
    toggleElement(undoBtn, true);

    const canvas = document.getElementById('fireworksCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let board = []
    let history = []
    let depth = difficultySelectBtn.value;
    let gameOver = false
    let currentPlayer = 1

    const dirs = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ]

    const weights = [
        [120, -20, 20, 5, 5, 20, -20, 120],
        [-20, -40, -5, -5, -5, -5, -40, -20],
        [20, -5, 15, 3, 3, 15, -5, 20],
        [5, -5, 3, 3, 3, 3, -5, 5],
        [5, -5, 3, 3, 3, 3, -5, 5],
        [20, -5, 15, 3, 3, 15, -5, 20],
        [-20, -40, -5, -5, -5, -5, -40, -20],
        [120, -20, 20, 5, 5, 20, -20, 120]
    ]

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

    //Timer Pause
    pauseBtn.onclick = () => {
        if (!isPaused) {
            // Pause logic
            clearInterval(timerInterval);
            isPaused = true;
            pauseOverlay.style.display = "flex"
        }
    }

    //Timer Stop function
    function stopTimer() {
        clearInterval(timerInterval);
        elapsedTime = 0;
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

    //change difficulty level
    difficultySelectBtn.onchange = () => {
        depth = difficultySelectBtn.value;
        if (depth == 2) {
            difficulty = "easy";
        } else if (depth == 4) {
            difficulty = "medium";
        } else if (depth == 6) {
            difficulty = "hard";
        }
    }

    // initial game setting / start game
    function init() {
        board = []
        for (let r = 0; r < 8; r++) {
            board[r] = []
            for (let c = 0; c < 8; c++) {
                board[r][c] = 0
            }
        }
        board[3][3] = 2
        board[3][4] = 1
        board[4][3] = 1
        board[4][4] = 2

        toggleElement(pauseBtn, false);
        toggleElement(undoBtn, false);
        toggleElement(startBtn, true);
        toggleElement(difficultySelectBtn, true);
        gameOver = false
        elapsedTime = 0
        startTimer()
        createBoard()
        drawBoard()
        showPreview()
        updateScore()
    }

    //create game board
    function createBoard() {
        boardDiv.innerHTML = ""
        statusEl.innerHTML = `${winnerName} (Black) Tuen <br> Click on yellow dots cell to play`
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                let cell = document.createElement("div")
                cell.className = "cell"
                cell.dataset.r = r
                cell.dataset.c = c
                cell.onclick = playerMove
                boardDiv.appendChild(cell)
            }
        }
    }

    // draw game board
    function drawBoard() {
        document.querySelectorAll(".cell").forEach(cell => {
            cell.innerHTML = ""
            let r = cell.dataset.r
            let c = cell.dataset.c
            if (board[r][c] != 0) {
                let disk = document.createElement("div")
                disk.className = "disk " + (board[r][c] == 1 ? "black" : "white")
                cell.appendChild(disk)
            }
        })
    }

    function getFlips(b, r, c, player) {
        let opp = player == 1 ? 2 : 1
        let flips = []
        dirs.forEach(d => {
            let rr = r + d[0]
            let cc = c + d[1]
            let temp = []
            while (rr >= 0 && rr < 8 && cc >= 0 && cc < 8 && b[rr][cc] == opp) {
                temp.push([rr, cc])
                rr += d[0]
                cc += d[1]
            }

            if (rr >= 0 && rr < 8 && cc >= 0 && cc < 8 && b[rr][cc] == player) {
                flips = flips.concat(temp)
            }
        })
        return flips
    }

    //check for game over
    function checkGameOver() {
        let humanMoves = getMoves(board, 1)
        let aiMoves = getMoves(board, 2)
        let empty = 0

        //count empty space
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (board[r][c] == 0) empty++
            }
        }
        if (empty == 0 || (humanMoves.length == 0 && aiMoves.length == 0)) {
            gameOver = true
            let black = 0
            let white = 0
            //count black and white disc
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    if (board[r][c] == 1) black++
                    if (board[r][c] == 2) white++
                }
            }
            if (black > white) {
                statusEl.textContent = `${winnerName} (Black) Wins`
                // launchFireworks();
                launchConfetti();
                playSound('win');
                updateleaderboard();
                window.saveScore();
                setTimeout(() => {
                    shareScore(gameName, score);
                }, 3000);
            } else if (white > black) {
                statusEl.textContent = `Computer (White) Wins`
                playSound('draw');

            } else {
                statusEl.textContent = "Draw Game"
                textToSpeechEng("its a Draw")
            }
            stopTimer()
            toggleElement(pauseBtn, true);
            toggleElement(undoBtn, true);
            toggleElement(startBtn, false);
            toggleElement(difficultySelect, false);
            return true
        }
        return false
    }

    // avaliable moves for both player nad computer
    function getMoves(b, player) {
        let moves = []
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (b[r][c] == 0) {
                    let flips = getFlips(b, r, c, player)
                    if (flips.length > 0) {
                        moves.push({ r, c, flips })
                    }
                }
            }
        }
        return moves
    }

    //player move function
    function playerMove() {
        if (gameOver) return
        playSound("click");

        // remove yellow dots
        clearPreview()

        let r = parseInt(this.dataset.r)
        let c = parseInt(this.dataset.c)
        if (board[r][c] != 0) return
        let flips = getFlips(board, r, c, 1)
        if (flips.length == 0) return
        history.push(copyBoard(board))
        let move = { r, c, flips }
        // state update
        applyMove(board, move, 1)
        // animation
        animateMove(move, 1, () => {
            drawBoard()
            updateScore()
            if (checkGameOver()) return
            currentPlayer = 2
            if (checkPassTurn()) return
            statusEl.innerHTML = `Computer (White) Turn <br> Thinking`
            setTimeout(aiMove, 300)
        })
    }

    //computer move function
    function aiMove() {
        let depth = parseInt(document.getElementById("difficultySelect").value)
        let move = findBestMove(board, depth)
        if (!move) {
            gameOver = true
            return
        }
        //state update
        applyMove(board, move, 2)
        //animation only (NO drawBoard here)
        animateMove(move, 2, () => {
            // clean redraw board AFTER animation
            drawBoard()
            updateScore()
            if (checkGameOver()) return
            statusEl.innerHTML = `${winnerName} (Black) Tuen <br> Click on yellow dots cell to play`
            currentPlayer = 1
            if (checkPassTurn()) return
            showPreview()
        })
    }

    //check pass (no valid move for player or computer)
    function checkPassTurn() {
        let humanMoves = getMoves(board, 1)
        let aiMoves = getMoves(board, 2)
        if (currentPlayer === 1 && humanMoves.length === 0) {
            // Human pass
            currentPlayer = 2
            textToSpeechEng("Human Pass")
            statusEl.textContent = `${winnerName} (Black) Pass`
            setTimeout(aiMove, 400)
            return true
        }
        if (currentPlayer === 2 && aiMoves.length === 0) {
            // AI pass
            textToSpeechEng("Computer Pass")
            statusEl.textContent = `Computer (White) Pass`
            currentPlayer = 1
            showPreview()
            return true
        }
        return false
    }

    //apply move for boath player nad computer
    function applyMove(b, move, player) {

        b[move.r][move.c] = player

        move.flips.forEach(p => {
            b[p[0]][p[1]] = player
        })

    }

    //computer turn find best move
    function findBestMove(b, depth) {
        let moves = getMoves(b, 2)
        let best = -Infinity
        let bestMove = null
        for (let m of moves) {
            let newBoard = copyBoard(b)
            applyMove(newBoard, m, 2)
            let score = minimax(newBoard, depth - 1, -Infinity, Infinity, false)
            if (score > best) {
                best = score
                bestMove = m
            }
        }
        return bestMove
    }

    //computer turn find best move as per level selected
    function minimax(b, depth, alpha, beta, isMax) {
        if (depth == 0) return evaluate(b)
        let player = isMax ? 2 : 1
        let moves = getMoves(b, player)
        if (moves.length == 0) return evaluate(b)
        if (isMax) {
            let best = -Infinity
            for (let m of moves) {
                let newBoard = copyBoard(b)
                applyMove(newBoard, m, player)
                let val = minimax(newBoard, depth - 1, alpha, beta, false)
                best = Math.max(best, val)
                alpha = Math.max(alpha, val)
                if (beta <= alpha) break
            }
            return best
        }
        else {
            let best = Infinity
            for (let m of moves) {
                let newBoard = copyBoard(b)
                applyMove(newBoard, m, player)
                let val = minimax(newBoard, depth - 1, alpha, beta, true)
                best = Math.min(best, val)
                beta = Math.min(beta, val)
                if (beta <= alpha) break
            }
            return best
        }
    }

    //evaluate score for bast move of computer turn
    function evaluate(b) {
        let score = 0
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (b[r][c] == 2) score += weights[r][c]
                if (b[r][c] == 1) score -= weights[r][c]
            }
        }
        return score
    }

    // copy board for evaluation of bast move for computer turn
    function copyBoard(b) {
        return JSON.parse(JSON.stringify(b))
    }

    //disc flip animation function
    function animateMove(move, player, callback) {
        let color = player == 1 ? "black" : "white"
        // NEW DISK
        let cell = document.querySelector(
            `.cell[data-r="${move.r}"][data-c="${move.c}"]`
        )
        let disk = document.createElement("div")
        disk.className = "disk " + color
        cell.appendChild(disk)
        // FLIP ANIMATION
        let delay = 0
        move.flips.forEach(p => {
            let flipCell = document.querySelector(
                `.cell[data-r="${p[0]}"][data-c="${p[1]}"]`
            )
            let flipDisk = flipCell.querySelector(".disk")
            setTimeout(() => {
                if (!flipDisk) return
                flipDisk.classList.add("flip")
                playSound("flip")
                setTimeout(() => {
                    flipDisk.className = "disk " + color
                }, 300)
            }, delay)
            delay += 120
        })
        // FINAL CLEAN RENDER
        setTimeout(() => {
            callback()
        }, delay + 400)
    }

    // show yellow dots where player can play
    function showPreview() {
        document.querySelectorAll(".cell").forEach(cell => {
            let r = parseInt(cell.dataset.r)
            let c = parseInt(cell.dataset.c)
            if (board[r][c] == 0) {
                let flips = getFlips(board, r, c, 1)
                if (flips.length > 0) {
                    let dot = document.createElement("div")
                    dot.className = "preview"
                    cell.appendChild(dot)
                }
            }
        })
    }

    // remove yellow dots where player can play
    function clearPreview() {
        document.querySelectorAll(".preview").forEach(dot => {
            dot.remove()
        })
    }

    //update score after each turn (player and computer)
    function updateScore() {
        b = 0
        w = 0
        //count black and hwite disc for score
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (board[r][c] == 1) b++
                if (board[r][c] == 2) w++
            }
        }
        bScore.textContent = b
        wScore.textContent = w
    }

    //undo
    undoBtn.addEventListener('click', () => {
        if (history.length == 0) return
        board = history.pop()
        drawBoard()
        currentPlayer = 1
        showPreview()
        updateScore()
    });

    // init()

    //start game
    startBtn.addEventListener('click', () => {
        init();
    });

    //resize game screen
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        drawBoard();
        showPreview();
    });

    //toggle disable buttons/select byid
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
    CONFETTI CELEBRATION
    ========================= */
    let confetti = [];
    function launchConfetti() {
        for (let i = 0; i < 150; i++) {
            confetti.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 5,
                vy: Math.random() * 5 + 2,
                size: Math.random() * 6 + 4,
                color: generateRandomNeonColor()

            });
        }
        animateConfetti();
    }

    function generateRandomNeonColor() {
        const hue = Math.floor(Math.random() * 361); // Random hue (0-360)
        const saturation = 100; // Full saturation (100%)
        const lightness = 50; // Moderate lightness (50%) for full color intensity
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    function animateConfetti() {
        let anim = setInterval(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // draw();
            confetti.forEach(c => {
                c.x += c.vx;
                c.y += c.vy;
                c.vy += 0.1;
                ctx.save();
                ctx.fillStyle = c.color;
                ctx.shadowColor = c.color;
                ctx.shadowBlur = 15;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.fillRect(c.x, c.y, c.size, c.size);
                ctx.restore();
            });

            if (confetti.length === 0) {
                clearInterval(anim);
            }
        }, 50);
    }

    // to add firebase leaderboard (save record)
    window.saveScore = async function () {
        text = `Black=${b}, White=${w}`

        try {
            await addDoc(collection(db, "leaderboard"), {
                game_id: game_id || 'reversi',
                game: game || 'reversi',
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

    // to add firebase leaderboard (save record)
    function updateleaderboard() {
        let opponent = "Computer";
        let game_id = 'reversi';
        let gsize = `9x9`;
        let elapsed = Math.floor(Number(elapsedTime) / 1000);
        let gameCount = history.length;
        let filed1 = 0;
        let filed2 = 0
        let filed3 = `Black=${b}, White=${w}`;
        let filed4 = playMode || 'pvc';
        let email = localStorage.getItem('email') || '-';
        const created_at = new Date();
        if (depth == 2) {
            score = (9 * 9 * 100 + (b - w > 0 ? b - w : w - b) - Math.floor(Number(elapsedTime) / 1000)) * 1;
            difficulty = "easy";
        } else if (depth == 4) {
            score = (9 * 9 * 100 + (b - w > 0 ? b - w : w - b) - Math.floor(Number(elapsedTime) / 1000)) * 2;
            difficulty = "medium";
        } else if (depth == 6) {
            score = (9 * 9 * 100 + (b - w > 0 ? b - w : w - b) - Math.floor(Number(elapsedTime) / 1000)) * 3;
            difficulty = "hard";
        }

        // to add local leaderboard (save record)
        lcsaveToLeaderboard(winnerName, opponent, email, gsize, difficulty, game_id, score, elapsed, gameCount, filed1, filed2, filed3, filed4, created_at)

        //save record to spabase global leaderboard
        // saveScore(winnerName, opponent, email, gsize, difficulty, game_id, score, elapsed, gameCount, filed1, filed2, filed3, filed4, created_at);
    }

});

//get user name from local storage
function getUserName() {
    const userData = localStorage.getItem("user");
    if (!userData) return `Guest`;

    const user = JSON.parse(userData);
    return user.name || `Guest`;
}