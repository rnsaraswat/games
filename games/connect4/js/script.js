import { startTimer, seconds, minutes, hours, timerInterval, elapsedTime } from './timer.js';
import { launchFireworks } from './edgeFireWorks.js';
import { playSound } from './sound.js';
import { textToSpeechEng } from './speak.js';
import { shareScore } from './share.js';
// import { saveScore } from '../../../leaderboard/gbleaderboard.js';
import { lcrenderLeaderboard, lcsaveToLeaderboard } from '../../../leaderboard/lcleaderboard.js';
// to add firebase leaderboard
import { db } from "../../../leaderboard/firebase-config.js";
import { addDoc, collection, serverTimestamp } from
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export let timer = false;
export let winnerName;
export let gameName = 'connect4';
export let score = 0;

window.addEventListener('load', function () {
    const loading = document.getElementById('loading');
    loading.style.display = 'none';

    const COLS = 7;
    const ROWS = 6;
    let board = [];
    let gameOver = false;
    let human = 1;
    let ai = 2;
    let currentPlayer = human;
    const boardHolder = document.getElementById('boardHolder');
    const statusEl = document.getElementById('status');
    const difficultySelect = document.getElementById('difficulty');

    // define variables also used to add firebase leaderboard
    const user = JSON.parse(localStorage.getItem("user"));
    let player = user ? user.name : localStorage.getItem('player_name');
    let email = user ? user.email : "";
    let opponent = localStorage.getItem('opponent') || 'Human2';
    let game = gameName;
    let game_id = gameName;
    let difficulty = difficultySelect.value;
    let elapsed, level, date;
    let size = 3;
    let gsize = '7x8';
    // let hours = 0;
    // let seconds = 0;
    // let minutes = 0;
    let text = "";
    let playMode = "-";

    function initBoard() {
        board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
        gameOver = false;
        currentPlayer = human;
        renderBoard();
        updateStatus("Your turn — click a column to drop a disc.");
    }

    function renderBoard() {
        boardHolder.innerHTML = '';
        for (let c = 0; c < COLS; c++) {
            const col = document.createElement('div');
            col.className = 'col';
            col.dataset.col = c;
            col.addEventListener('click', () => handleColClick(c));
            for (let r = 0; r < ROWS; r++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                const disc = document.createElement('span');
                disc.className = 'disc';
                const cellVal = board[r][c];
                if (cellVal === 1) disc.classList.add('r');
                else if (cellVal === 2) disc.classList.add('y');
                cell.appendChild(disc);
                col.appendChild(cell);
            }
            boardHolder.appendChild(col);
        }
    }

    function handleColClick(col) {
        if (gameOver) return;
        if (currentPlayer !== human) return;
        if (!isValidLocation(col)) {
            updateStatus('Column full — Click in other column');
            playSound('error');
            return;
        }
        const row = getNextOpenRow(col);
        dropPiece(row, col, human);
        renderBoard();
        if (winningMove(board, human)) {
            gameOver = true;
            updateStatus('🎉 You Won! 🎉');
            textToSpeechEng('You Won');
            winnerName = player;
            score = (ROWS * COLS) * 10 + 100;
            updateleaderboard();
            window.saveScore();
            timer = false;
            clearInterval(timerInterval);
            playSound('win');
            launchFireworks();
            shareScore(gameName, score);
            return;
        }
        if (isBoardFull()) { gameOver = true; updateStatus('Its a Draw!'); textToSpeechEng('Its a Draw'); return; }
        currentPlayer = ai;
        updateStatus('Computer Thinking...');
        setTimeout(() => aiMove(), 120);
    }

    function isValidLocation(col) {
        return board[ROWS - 1][col] === 0;
    }
    function getNextOpenRow(col) {
        for (let r = 0; r < ROWS; r++) if (board[r][col] === 0) return r;
        return null;
    }
    function dropPiece(row, col, player) { board[row][col] = player; }
    function isBoardFull() { return board.every(row => row.every(cell => cell !== 0)); }

    function winningMove(bd, piece) {
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS - 3; c++) {
                if (bd[r][c] === piece && bd[r][c + 1] === piece && bd[r][c + 2] === piece && bd[r][c + 3] === piece) return true;
            }
        }
        for (let c = 0; c < COLS; c++) {
            for (let r = 0; r < ROWS - 3; r++) {
                if (bd[r][c] === piece && bd[r + 1][c] === piece && bd[r + 2][c] === piece && bd[r + 3][c] === piece) return true;
            }
        }
        for (let r = 0; r < ROWS - 3; r++) {
            for (let c = 0; c < COLS - 3; c++) {
                if (bd[r][c] === piece && bd[r + 1][c + 1] === piece && bd[r + 2][c + 2] === piece && bd[r + 3][c + 3] === piece) return true;
            }
        }
        for (let r = 3; r < ROWS; r++) {
            for (let c = 0; c < COLS - 3; c++) {
                if (bd[r][c] === piece && bd[r - 1][c + 1] === piece && bd[r - 2][c + 2] === piece && bd[r - 3][c + 3] === piece) return true;
            }
        }
        return false;
    }

    function evaluateWindow(windowArr, piece) {
        const oppPiece = piece === ai ? human : ai;
        let score = 0;
        const countPiece = windowArr.filter(x => x === piece).length;
        const countEmpty = windowArr.filter(x => x === 0).length;
        const countOpp = windowArr.filter(x => x === oppPiece).length;
        if (countPiece === 4) score += 1000;
        else if (countPiece === 3 && countEmpty === 1) score += 50;
        else if (countPiece === 2 && countEmpty === 2) score += 10;
        if (countOpp === 3 && countEmpty === 1) score -= 80;
        return score;
    }

    function scorePosition(bd, piece) {
        let score = 0;
        const centerArray = [];
        for (let r = 0; r < ROWS; r++) centerArray.push(bd[r][Math.floor(COLS / 2)]);
        const centerCount = centerArray.filter(x => x === piece).length;
        score += centerCount * 6;

        for (let r = 0; r < ROWS; r++) {
            const rowArr = bd[r];
            for (let c = 0; c < COLS - 3; c++) {
                const windowArr = rowArr.slice(c, c + 4);
                score += evaluateWindow(windowArr, piece);
            }
        }
        for (let c = 0; c < COLS; c++) {
            const colArr = []; for (let r = 0; r < ROWS; r++) colArr.push(bd[r][c]);
            for (let r = 0; r < ROWS - 3; r++) {
                const windowArr = colArr.slice(r, r + 4);
                score += evaluateWindow(windowArr, piece);
            }
        }
        for (let r = 0; r < ROWS - 3; r++) {
            for (let c = 0; c < COLS - 3; c++) {
                const windowArr = [bd[r][c], bd[r + 1][c + 1], bd[r + 2][c + 2], bd[r + 3][c + 3]];
                score += evaluateWindow(windowArr, piece);
            }
        }
        for (let r = 3; r < ROWS; r++) {
            for (let c = 0; c < COLS - 3; c++) {
                const windowArr = [bd[r][c], bd[r - 1][c + 1], bd[r - 2][c + 2], bd[r - 3][c + 3]];
                score += evaluateWindow(windowArr, piece);
            }
        }
        return score;
    }

    function getValidLocations(bd) {
        const valid = [];
        for (let c = 0; c < COLS; c++) if (isValidLocationForBoard(bd, c)) valid.push(c);
        return valid;
    }
    function isValidLocationForBoard(bd, col) { return bd[ROWS - 1][col] === 0; }
    function getNextOpenRowForBoard(bd, col) { for (let r = 0; r < ROWS; r++) if (bd[r][col] === 0) return r; return null; }

    function copyBoard(bd) { return bd.map(row => row.slice()); }

    function minimax(bd, depth, alpha, beta, maximizingPlayer) {
        const validLocations = getValidLocations(bd);
        const isTerminal = winningMove(bd, human) || winningMove(bd, ai) || validLocations.length === 0;
        if (depth === 0 || isTerminal) {
            if (isTerminal) {
                if (winningMove(bd, ai)) return { score: 100000000000000 };
                else if (winningMove(bd, human)) return { score: -100000000000000 };
                else return { score: 0 };
            } else {
                return { score: scorePosition(bd, ai) };
            }
        }
        if (maximizingPlayer) {
            let value = -Infinity; let column = validLocations[Math.floor(Math.random() * validLocations.length)];
            for (const col of orderMoves(validLocations)) {
                const row = getNextOpenRowForBoard(bd, col);
                const tempBoard = copyBoard(bd);
                tempBoard[row][col] = ai;
                const newScore = minimax(tempBoard, depth - 1, alpha, beta, false).score;
                if (newScore > value) { value = newScore; column = col; }
                alpha = Math.max(alpha, value);
                if (alpha >= beta) break;
            }
            return { column, score: value };
        } else {
            let value = Infinity; let column = validLocations[Math.floor(Math.random() * validLocations.length)];
            for (const col of orderMoves(validLocations)) {
                const row = getNextOpenRowForBoard(bd, col);
                const tempBoard = copyBoard(bd);
                tempBoard[row][col] = human;
                const newScore = minimax(tempBoard, depth - 1, alpha, beta, true).score;
                if (newScore < value) { value = newScore; column = col; }
                beta = Math.min(beta, value);
                if (alpha >= beta) break;
            }
            return { column, score: value };
        }
    }

    function orderMoves(valid) {
        const center = Math.floor(COLS / 2);
        const order = valid.slice().sort((a, b) => Math.abs(a - center) - Math.abs(b - center));
        return order;
    }

    function aiMove() {
        if (gameOver) return;
        const difficulty = difficultySelect.value;
        let depth = 4;
        if (difficulty === 'medium') depth = 5;
        if (difficulty === 'hard') depth = 7;

        const validLocations = getValidLocations(board);
        for (const col of validLocations) {
            const row = getNextOpenRowForBoard(board, col);
            const temp = copyBoard(board);
            temp[row][col] = ai;
            if (winningMove(temp, ai)) {
                dropPiece(row, col, ai);
                renderBoard();
                gameOver = true;
                updateStatus('Computer Wins 😐');
                textToSpeechEng('Computer Wins');
                return;
            }
        }
        for (const col of validLocations) {
            const row = getNextOpenRowForBoard(board, col);
            const temp = copyBoard(board);
            temp[row][col] = human;
            if (winningMove(temp, human)) {
                dropPiece(row, col, ai);
                renderBoard();
                if (winningMove(board, ai)) { gameOver = true; updateStatus('Computer Wins 😐'); textToSpeechEng('Computer Wins'); return; }
                currentPlayer = human; updateStatus('Your turn'); return;
            }
        }

        const start = performance.now();
        const result = minimax(board, depth, -Infinity, Infinity, true);
        const end = performance.now();
        const chosenCol = result.column;
        if (chosenCol === undefined || !isValidLocation(chosenCol)) {
            const rnd = validLocations[Math.floor(Math.random() * validLocations.length)];
            const r = getNextOpenRowForBoard(board, rnd);
            dropPiece(r, rnd, ai);
        } else {
            const r = getNextOpenRowForBoard(board, chosenCol);
            dropPiece(r, chosenCol, ai);
        }
        renderBoard();
        if (winningMove(board, ai)) {
            gameOver = true; updateStatus('Computer Wins 😐'); textToSpeechEng('Computer Wins'); winnerName = "Computer"; return;
        }
        if (isBoardFull()) { gameOver = true; updateStatus('Its a Draw'); textToSpeechEng('Its a Draw'); return; }
        currentPlayer = human;
        playSound('ball');
        updateStatus(`Your turn ${(Math.round(end - start))} ms`);
    }

    function updateStatus(text) { statusEl.textContent = text; }

    document.getElementById('newBtn').addEventListener('click', () => initBoard());

    initBoard();

    // to add firebase leaderboard (save record)
    window.saveScore = async function () {
        playMode = 'Player vs Player';
        if (difficulty == 'hard') { score = score + 500 } else if (difficulty == 'medium') { score = score + 200 }

        try {
            await addDoc(collection(db, "leaderboard"), {
                game_id: gameName || 'connect4',
                game: gameName || 'connect4',
                name: winnerName || 'Guast',
                opponent: opponent || "Computer",
                difficulty: difficulty || "-",
                size: `${ROWS}x${COLS}` || `8x8`,
                elapsed: Math.floor(Number(elapsedTime) / 1000) || 0,
                score: score || 0,
                moves: 0,
                email: email || "-",
                level: "-",
                mode: '-',
                text: "-",
                createdAt: new Date()
            });
            console.log("Score Saved!");
        } catch (error) {
            console.error("Error:", error);
        }
    };

    function updateleaderboard() {
        let game_id = 'connect4';
        let gsize = `${ROWS}x${COLS}`;
        let elapsed = 0;
        let gameCount = 0;
        let filed1 = 0;
        let filed2 = 0
        let filed4 = "-";
        let filed3 = 'Player vs Computer';
        let email = localStorage.getItem('email') || '-';
        const created_at = new Date();
        if (difficulty == 'hard') { score = score + 500 } else if (difficulty == 'medium') { score = score + 200 }
        console.log(winnerName, opponent, email, gsize, difficulty, game_id, score, elapsed, gameCount, filed1, filed2, filed3, filed4, created_at);
        lcsaveToLeaderboard(winnerName, opponent, email, gsize, difficulty, game_id, score, elapsed, gameCount, filed1, filed2, filed3, filed4, created_at);
    }

    document.addEventListener('DOMContentLoaded', () => {
        lcrenderLeaderboard();
    });
});

