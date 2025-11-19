import { textToSpeechEng } from './speak.js';
// import { loadBest, saveBest } from './best_score.js';
import { startTimer, stopTimer, pauseResumeTimer, seconds, minutes, hours } from './timer_date.js';
import { launchConfetti } from './confetti.js';
import { playSound } from './sound.js';
// import { saveToLeaderboard } from './leaderboard.js';
import { localrenderLeaderboard, saveToLeaderboard } from '../../../leaderboard/localleaderboard.js';

export const sizeSel = document.getElementById('sizeSel');
export const diffSel = document.getElementById('diffSel');
export let timer = false;
export let winnerName;

// export let player1 = "ABC";
export const state = {
    N: 9,
    blockRows: 3,   // R
    blockCols: 3,   // C
    symbols: [],
    puzzle: [],
    solution: [],
    fixed: [],
    notes: [],
    selected: -1,
    notesMode: false,
    // fastMode: true,
    undo: [],
    redo: [],
    mistakes: 0,
    timerStart: 0,
    timerTick: null,
    paused: false,
    highlightDigit: null,
    revealMode: false,
    numSelected: -1,
    hintCount: 0,
    conflitMode: false
};

// (() => {
    window.addEventListener('load', function () {
        const loading = document.getElementById('loading');
        loading.style.display = 'none';

    let board;
    // let sec = 0;
    // let min = 0;
    // let hrs = 0;
    let fix = 0, empty = 0, wrg = 0, rgt = 0;
    let theme = localStorage.getItem('rg_theme') || 'dark';
    let player1 = localStorage.getItem('player_name') || 'Human1';
    let score = 0;
    let difficulty = diffSel.value;
    // let player1 = "ABC";
    // let bestScore = JSON.parse(localStorage.getItem("bestScore") || "[]");

    // theme images used directly
    const size = {
        25: [[1, 17, 8, 14, 5, 6, 22, 18, 4, 10, 11, 2, 23, 9, 15, 16, 12, 3, 19, 25, 21, 7, 13, 24, 20], [6, 22, 18, 4, 10, 16, 12, 3, 19, 25, 1, 17, 8, 14, 5, 21, 7, 13, 24, 20, 11, 2, 23, 9, 15],[21, 7, 13, 24, 20, 1, 17, 8, 14, 5, 6, 22, 18, 4, 10, 11, 2, 23, 9, 15, 16, 12, 3, 19, 25],[11, 2, 23, 9, 15, 21, 7, 13, 24, 20, 16, 12, 3, 19, 25, 1, 17, 8, 14, 5, 6, 22, 18, 4, 10],[16, 12, 3, 19, 25, 11, 2, 23, 9, 15, 21, 7, 13, 24, 20, 6, 22, 18, 4, 10, 1, 17, 8, 14, 5],[5, 21, 12, 18, 9, 10, 1, 22, 8, 14, 15, 6, 2, 13, 19, 20, 16, 7, 23, 4, 25, 11, 17, 3, 24],[10, 1, 22, 8, 14, 20, 16, 7, 23, 4, 5, 21, 12, 18, 9, 25, 11, 17, 3, 24, 15, 6, 2, 13, 19],[25, 11, 17, 3, 24, 5, 21, 12, 18, 9, 10, 1, 22, 8, 14, 15, 6, 2, 13, 19, 20, 16, 7, 23, 4],[15, 6, 2, 13, 19, 25, 11, 17, 3, 24, 20, 16, 7, 23, 4, 5, 21, 12, 18, 9, 10, 1, 22, 8, 14],[20, 16, 7, 23, 4, 15, 6, 2, 13, 19, 25, 11, 17, 3, 24, 10, 1, 22, 8, 14, 5, 21, 12, 18, 9],[2, 18, 9, 15, 6, 7, 23, 19, 5, 11, 12, 3, 24, 10, 16, 17, 13, 4, 20, 1, 22, 8, 14, 25, 21],[7, 23, 19, 5, 11, 17, 13, 4, 20, 1, 2, 18, 9, 15, 6, 22, 8, 14, 25, 21, 12, 3, 24, 10, 16],[22, 8, 14, 25, 21, 2, 18, 9, 15, 6, 7, 23, 19, 5, 11, 12, 3, 24, 10, 16, 17, 13, 4, 20, 1],[12, 3, 24, 10, 16, 22, 8, 14, 25, 21, 17, 13, 4, 20, 1, 2, 18, 9, 15, 6, 7, 23, 19, 5, 11],[17, 13, 4, 20, 1, 12, 3, 24, 10, 16, 22, 8, 14, 25, 21, 7, 23, 19, 5, 11, 2, 18, 9, 15, 6],[4, 20, 11, 17, 8, 9, 25, 21, 7, 13, 14, 5, 1, 12, 18, 19, 15, 6, 22, 3, 24, 10, 16, 2, 23],[9, 25, 21, 7, 13, 19, 15, 6, 22, 3, 4, 20, 11, 17, 8, 24, 10, 16, 2, 23, 14, 5, 1, 12, 18],[24, 10, 16, 2, 23, 4, 20, 11, 17, 8, 9, 25, 21, 7, 13, 14, 5, 1, 12, 18, 19, 15, 6, 22, 3],[14, 5, 1, 12, 18, 24, 10, 16, 2, 23, 19, 15, 6, 22, 3, 4, 20, 11, 17, 8, 9, 25, 21, 7, 13],[19, 15, 6, 22, 3, 14, 5, 1, 12, 18, 24, 10, 16, 2, 23, 9, 25, 21, 7, 13, 4, 20, 11, 17, 8],[3, 19, 10, 16, 7, 8, 24, 20, 6, 12, 13, 4, 25, 11, 17, 18, 14, 5, 21, 2, 23, 9, 15, 1, 22],[8, 24, 20, 6, 12, 18, 14, 5, 21, 2, 3, 19, 10, 16, 7, 23, 9, 15, 1, 22, 13, 4, 25, 11, 17],[23, 9, 15, 1, 22, 3, 19, 10, 16, 7, 8, 24, 20, 6, 12, 13, 4, 25, 11, 17, 18, 14, 5, 21, 2],[13, 4, 25, 11, 17, 23, 9, 15, 1, 22, 18, 14, 5, 21, 2, 3, 19, 10, 16, 7, 8, 24, 20, 6, 12],[18, 14, 5, 21, 2, 13, 4, 25, 11, 17, 23, 9, 15, 1, 22, 8, 24, 20, 6, 12, 3, 19, 10, 16, 7],],

        24: [[1, 5, 2, 4, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 11, 19, 3, 20, 21, 22, 23, 24],[3, 23, 20, 22, 24, 21, 5, 16, 17, 18, 11, 19, 8, 9, 10, 12, 13, 14, 2, 4, 6, 7, 1, 15],[8, 9, 11, 10, 12, 13, 3, 15, 23, 20, 22, 1, 2, 4, 6, 7, 21, 24, 5, 14, 16, 17, 18, 19],[14, 15, 16, 17, 18, 19, 2, 4, 6, 7, 24, 21, 1, 5, 3, 20, 23, 22, 8, 9, 10, 11, 12, 13],[4, 1, 19, 24, 20, 6, 7, 12, 3, 21, 2, 18, 11, 14, 9, 10, 5, 8, 13, 15, 23, 16, 17, 22],[7, 3, 12, 13, 5, 15, 14, 20, 24, 17, 10, 22, 21, 19, 23, 16, 2, 6, 1, 11, 4, 9, 8, 18],[11, 18, 9, 8, 23, 16, 1, 13, 5, 4, 6, 15, 17, 20, 22, 24, 3, 12, 7, 10, 14, 19, 2, 21],[22, 10, 21, 14, 2, 17, 11, 8, 9, 23, 19, 16, 4, 1, 7, 15, 18, 13, 12, 24, 20, 3, 5, 6],[6, 12, 3, 7, 17, 11, 23, 24, 18, 13, 16, 8, 10, 2, 21, 5, 14, 4, 22, 1, 19, 15, 20, 9],[10, 16, 5, 15, 21, 4, 6, 19, 22, 9, 20, 11, 3, 17, 18, 1, 24, 7, 23, 2, 12, 13, 14, 8],[18, 24, 1, 9, 8, 23, 15, 2, 21, 5, 14, 4, 12, 22, 19, 13, 20, 11, 6, 3, 17, 10, 16, 7],[2, 20, 13, 19, 14, 22, 10, 1, 7, 3, 17, 12, 6, 8, 15, 23, 9, 16, 18, 5, 24, 21, 11, 4],[5, 17, 15, 1, 4, 9, 22, 7, 14, 10, 12, 6, 13, 23, 24, 21, 16, 2, 20, 8, 3, 18, 19, 11],[23, 6, 8, 3, 16, 2, 24, 11, 1, 15, 5, 13, 18, 10, 20, 19, 22, 17, 21, 7, 9, 12, 4, 14],[19, 14, 18, 20, 22, 12, 17, 3, 4, 8, 21, 2, 5, 7, 1, 11, 6, 9, 10, 13, 15, 23, 24, 16],[13, 11, 7, 21, 10, 24, 20, 23, 19, 16, 18, 9, 14, 3, 4, 8, 12, 15, 17, 22, 1, 5, 6, 2],[21, 2, 24, 11, 1, 3, 16, 18, 13, 19, 7, 10, 23, 6, 8, 17, 15, 5, 4, 12, 22, 14, 9, 20],[15, 4, 14, 6, 7, 5, 21, 17, 20, 1, 9, 23, 24, 12, 13, 22, 19, 18, 11, 16, 2, 8, 10, 3],
        [16, 8, 17, 12, 19, 10, 4, 22, 11, 2, 3, 5, 7, 21, 14, 9, 1, 20, 15, 6, 18, 24, 13, 23],[20, 13, 22, 23, 9, 18, 12, 6, 8, 14, 15, 24, 16, 11, 2, 3, 4, 10, 19, 17, 7, 1, 21, 5],
        [12, 19, 4, 2, 11, 1, 18, 10, 15, 22, 8, 20, 9, 24, 5, 14, 7, 21, 16, 23, 13, 6, 3, 17],[17, 22, 6, 18, 3, 14, 19, 5, 16, 24, 1, 7, 20, 13, 11, 4, 10, 23, 9, 21, 8, 2, 15, 12],[24, 7, 23, 16, 13, 8, 9, 21, 2, 11, 4, 3, 19, 15, 12, 6, 17, 1, 14, 18, 5, 20, 22, 10],[9, 21, 10, 5, 15, 20, 13, 14, 12, 6, 23, 17, 22, 18, 16, 2, 8, 3, 24, 19, 11, 4, 7, 1],],

        22: [[2, 11, 9, 17, 8, 4, 10, 1, 12, 14, 15, 3, 5, 13, 22, 16, 6, 18, 7, 19, 20, 21],[7, 3, 13, 22, 6, 5, 16, 18, 19, 20, 21, 1, 8, 11, 2, 4, 17, 9, 10, 12, 14, 15],[5, 9, 20, 21, 14, 19, 11, 2, 22, 17, 16, 8, 18, 6, 1, 7, 15, 12, 13, 4, 10, 3],[8, 1, 18, 6, 12, 3, 7, 15, 4, 10, 13, 5, 20, 19, 9, 14, 21, 2, 22, 17, 11, 16],[9, 15, 12, 19, 2, 14, 17, 22, 11, 13, 4, 10, 21, 5, 18, 3, 7, 16, 20, 6, 8, 1],[10, 5, 21, 18, 1, 16, 3, 20, 8, 6, 7, 15, 9, 2, 19, 17, 14, 13, 12, 11, 22, 4],
        [1, 16, 14, 4, 17, 6, 12, 10, 5, 2, 11, 21, 7, 3, 15, 18, 13, 22, 19, 8, 9, 20],[21, 22, 7, 9, 19, 18, 15, 3, 13, 8, 20, 16, 1, 14, 17, 2, 5, 4, 11, 10, 12, 6],[11, 18, 4, 8, 10, 13, 21, 9, 2, 19, 22, 17, 12, 15, 7, 1, 3, 14, 6, 20, 16, 5],[12, 17, 3, 5, 15, 7, 20, 16, 6, 1, 14, 18, 11, 4, 8, 13, 9, 10, 21, 22, 19, 2],[3, 7, 1, 11, 16, 9, 22, 21, 17, 15, 2, 19, 10, 8, 6, 12, 18, 20, 5, 14, 4, 13],[6, 10, 19, 12, 18, 8, 14, 13, 20, 4, 5, 9, 3, 7, 16, 15, 2, 11, 17, 1, 21, 22],[14, 12, 11, 1, 7, 20, 6, 19, 16, 3, 18, 4, 15, 21, 5, 9, 22, 17, 8, 2, 13, 10],[15, 4, 5, 2, 9, 21, 13, 17, 10, 22, 8, 7, 14, 12, 20, 11, 1, 19, 16, 3, 6, 18],[4, 19, 8, 14, 20, 22, 18, 5, 15, 11, 3, 6, 16, 17, 12, 21, 10, 1, 2, 13, 7, 9],[13, 6, 16, 10, 21, 2, 9, 7, 1, 12, 17, 11, 4, 22, 14, 20, 8, 15, 3, 18, 5, 19],[19, 2, 15, 16, 3, 1, 4, 11, 18, 5, 6, 12, 22, 9, 13, 10, 20, 7, 14, 21, 17, 8],[20, 13, 17, 7, 22, 12, 8, 14, 21, 9, 10, 2, 19, 1, 3, 5, 4, 6, 15, 16, 18, 11],[16, 14, 10, 3, 5, 11, 2, 6, 9, 21, 12, 13, 17, 20, 4, 22, 19, 8, 18, 15, 1, 7],[17, 20, 22, 13, 4, 15, 1, 8, 7, 18, 19, 14, 2, 16, 10, 6, 11, 21, 9, 5, 3, 12],[18, 21, 2, 10, 13, 17, 19, 12, 3, 7, 1, 22, 6, 10, 11, 8, 16, 5, 4, 9, 15, 14],[22, 8, 6, 15, 11, 10, 5, 4, 14, 16, 9, 20, 13, 18, 21, 19, 12, 3, 1, 7, 2, 17],],
        21: [[1, 9, 2, 3, 21, 4, 17, 5, 6, 10, 13, 15, 16, 11, 11, 18, 14, 7, 8, 19, 20],[16, 11, 18, 19, 8, 7, 20, 9, 14, 1, 2, 3, 4, 17, 5, 6, 10, 21, 12, 13, 15],[5, 14, 6, 10, 12, 13, 15, 18, 11, 20, 21, 7, 19, 8, 9, 1, 2, 3, 4, 16, 17],[8, 13, 17, 20, 18, 1, 5, 4, 10, 14, 15, 2, 12, 7, 3, 11, 9, 19, 21, 6, 16],[14, 2, 9, 4, 3, 21, 6, 16, 1, 11, 13, 20, 5, 19, 15, 8, 12, 18, 17, 10, 7],[10, 16, 11, 15, 19, 12, 7, 8, 9, 17, 3, 6, 18, 21, 4, 20, 13, 14, 2, 1, 5],[21, 7, 1, 5, 10, 19, 8, 17, 12, 13, 16, 18, 9, 15, 14, 2, 11, 4, 20, 3, 6],[2, 17, 20, 6, 15, 3, 18, 14, 7, 21, 4, 8, 11, 1, 13, 19, 5, 9, 16, 12, 10],[9, 4, 13, 11, 14, 16, 12, 2, 3, 6, 10, 19, 20, 5, 17, 21, 18, 1, 15, 7, 8],[4, 10, 12, 16, 6, 15, 13, 1, 2, 7, 14, 17, 21, 11, 18, 9, 3, 20, 5, 8, 19],[7, 20, 5, 9, 17, 14, 21, 13, 18, 19, 8, 15, 3, 12, 1, 16, 6, 2, 10, 4, 11],[18, 1, 19, 2, 11, 8, 3, 6, 4, 16, 5, 9, 10, 20, 7, 12, 17, 15, 14, 21, 13],[11, 18, 4, 7, 9, 17, 14, 10, 5, 12, 20, 16, 13, 3, 6, 15, 1, 8, 19, 2, 21],[12, 15, 16, 21, 20, 6, 19, 11, 8, 9, 1, 14, 2, 4, 10, 5, 7, 13, 3, 17, 18],[13, 3, 8, 1, 2, 5, 10, 15, 19, 18, 7, 21, 17, 6, 16, 4, 20, 11, 9, 14, 12],[3, 8, 21, 18, 13, 9, 1, 7, 15, 4, 6, 10, 16, 14, 20, 17, 19, 12, 11, 5, 2],[17, 6, 7, 12, 16, 11, 4, 19, 20, 2, 9, 5, 8, 13, 21, 3, 15, 10, 1, 18, 14],[15, 19, 10, 14, 5, 20, 2, 21, 17, 3, 11, 12, 1, 18, 8, 7, 16, 6, 13, 9, 4],[20, 5, 14, 8, 4, 18, 9, 12, 16, 15, 19, 1, 6, 10, 2, 13, 21, 17, 7, 11, 3],
        [19, 21, 3, 17, 7, 2, 11, 20, 13, 5, 18, 4, 14, 9, 12, 10, 8, 16, 6, 15, 1],[6, 12, 15, 13, 1, 10, 16, 3, 21, 8, 17, 11, 7, 2, 19, 14, 4, 5, 18, 20, 9],],
        20: [[19, 18, 5, 2, 6, 9, 10, 17, 14, 1, 15, 13, 8, 20, 11, 7, 16, 12, 4, 3],[12, 17, 13, 4, 16, 15, 7, 5, 2, 3, 18, 10, 9, 14, 1, 20, 6, 19, 11, 8],[1, 14, 7, 8, 15, 11, 6, 13, 20, 4, 3, 5, 16, 19, 12, 9, 10, 17, 2, 18],[20, 11, 10, 9, 3, 19, 18, 16, 8, 12, 6, 7, 2, 4, 17, 5, 13, 14, 1, 15],[18, 13, 2, 6, 19, 16, 17, 14, 10, 15, 7, 9, 20, 11, 3, 12, 1, 4, 8, 5],[16, 5, 4, 17, 12, 7, 13, 11, 3, 9, 10, 8, 14, 1, 18, 6, 19, 2, 15, 20],[14, 7, 8, 3, 1, 6, 5, 20, 4, 2, 13, 16, 19, 12, 15, 10, 17, 11, 18, 9],[11, 10, 9, 15, 20, 18, 8, 1, 12, 19, 5, 2, 4, 17, 6, 13, 3, 16, 14, 7],[7, 2, 6, 19, 18, 17, 16, 12, 15, 10, 9, 20, 11, 3, 13, 1, 4, 8, 5, 14],[13, 4, 16, 12, 17, 5, 2, 3, 9, 7, 8, 14, 1, 15, 10, 19, 11, 18, 20, 6],[5, 8, 15, 1, 14, 13, 20, 4, 11, 6, 16, 19, 12, 18, 7, 17, 2, 3, 9, 10],[10, 9, 3, 20, 11, 14, 1, 8, 19, 18, 2, 4, 17, 6, 5, 16, 12, 15, 7, 13],[4, 12, 19, 18, 7, 10, 14, 15, 16, 17, 20, 11, 3, 13, 9, 2, 8, 5, 6, 1],[2, 6, 17, 16, 5, 4, 3, 9, 7, 13, 14, 1, 15, 10, 8, 11, 18, 20, 12, 19],[8, 3, 1, 14, 13, 20, 11, 2, 6, 5, 19, 12, 18, 7, 16, 4, 15, 9, 10, 17],[9, 15, 20, 11, 10, 1, 12, 19, 18, 8, 4, 17, 6, 5, 2, 3, 14, 7, 13, 16],[6, 16, 18, 13, 2, 12, 15, 7, 17, 20, 11, 3, 10, 9, 14, 8, 5, 1, 19, 4],[17, 1, 14, 5, 4, 3, 9, 10, 13, 11, 12, 15, 7, 8, 19, 18, 20, 6, 16, 2],[3, 19, 12, 7, 8, 2, 4, 6, 5, 14, 1, 18, 13, 16, 20, 15, 9, 10, 17, 11],[15, 20, 11, 10, 9, 8, 19, 18, 1, 16, 17, 6, 5, 2, 4, 14, 7, 13, 3, 12],],
        18: [[18, 16, 6, 1, 3, 2, 7, 13, 15, 8, 9, 12, 17, 4, 5, 11, 10, 14],[10, 11, 4, 14, 8, 9, 17, 18, 6, 5, 1, 2, 3, 13, 7, 15, 16, 12],[17, 7, 5, 13, 15, 12, 4, 11, 3, 10, 14, 16, 1, 18, 6, 8, 2, 9],[7, 17, 10, 2, 1, 4, 15, 12, 13, 6, 18, 5, 11, 8, 16, 9, 14, 3],[3, 5, 18, 9, 6, 14, 11, 16, 1, 7, 2, 8, 10, 15, 17, 12, 4, 13],[13, 12, 11, 15, 16, 8, 10, 17, 14, 9, 4, 3, 6, 5, 1, 18, 7, 2],[16, 1, 8, 7, 14, 5, 2, 3, 10, 11, 12, 6, 15, 9, 13, 4, 18, 17],[12, 2, 3, 10, 11, 17, 9, 5, 18, 4, 13, 15, 8, 1, 14, 7, 6, 16],[4, 9, 15, 18, 13, 6, 16, 1, 8, 14, 7, 17, 2, 12, 10, 3, 11, 5],[9, 6, 13, 11, 5, 18, 3, 15, 17, 1, 10, 4, 14, 2, 8, 16, 12, 7],[2, 8, 14, 16, 4, 3, 6, 9, 12, 18, 5, 7, 13, 17, 11, 10, 1, 15],[15, 10, 1, 12, 17, 7, 8, 14, 2, 16, 11, 13, 5, 3, 18, 6, 9, 4],[1, 14, 7, 8, 10, 13, 12, 4, 11, 2, 15, 9, 16, 6, 3, 5, 17, 18],[11, 3, 12, 5, 2, 15, 14, 6, 16, 13, 17, 18, 9, 7, 4, 1, 8, 10],[6, 4, 9, 17, 18, 16, 1, 7, 5, 3, 8, 10, 12, 14, 2, 13, 15, 11],[14, 18, 2, 3, 7, 1, 13, 10, 9, 12, 6, 11, 4, 16, 15, 17, 5, 8],
        [8, 13, 17, 4, 9, 10, 5, 2, 7, 15, 16, 1, 18, 11, 12, 14, 3, 6],[5, 15, 16, 6, 12, 11, 18, 8, 4, 17, 3, 14, 7, 10, 9, 2, 13, 1],],
        16: [[11, 4, 7, 9, 8, 10, 13, 5, 14, 1, 6, 3, 2, 12, 15, 16],[16, 2, 5, 10, 4, 3, 15, 14, 8, 11, 7, 12, 9, 13, 6, 1],[6, 13, 14, 12, 1, 16, 11, 7, 2, 9, 15, 5, 10, 3, 8, 4],[1, 3, 8, 15, 9, 6, 12, 2, 10, 16, 4, 13, 5, 7, 11, 14],[13, 15, 12, 11, 6, 1, 9, 3, 4, 8, 10, 7, 16, 2, 14, 5],[14, 16, 2, 1, 7, 8, 10, 4, 3, 5, 12, 11, 6, 15, 13, 9],[10, 7, 9, 3, 14, 15, 5, 11, 16, 6, 13, 2, 8, 1, 4, 12],[4, 8, 6, 5, 13, 2, 16, 12, 1, 15, 9, 14, 7, 11, 3, 10],[8, 14, 1, 2, 10, 7, 4, 15, 11, 13, 5, 9, 12, 6, 16, 3],[12, 10, 16, 13, 5, 11, 8, 9, 6, 7, 3, 4, 15, 14, 1, 2],[5, 6, 3, 7, 16, 12, 2, 13, 15, 14, 1, 10, 4, 8, 9, 11],[15, 9, 11, 4, 3, 14, 1, 6, 12, 2, 16, 8, 13, 5, 10, 7],[9, 1, 15, 16, 12, 5, 3, 8, 7, 10, 11, 6, 14, 4, 2, 13],[2, 11, 10, 14, 15, 4, 7, 1, 13, 12, 8, 16, 3, 9, 5, 6],[7, 5, 4, 6, 11, 13, 14, 16, 9, 3, 2, 15, 1, 10, 12, 8],[3, 12, 13, 8, 2, 9, 6, 10, 5, 4, 14, 1, 11, 16, 7, 15],],
        15: [[14, 6, 2, 11, 3, 12, 4, 13, 7, 10, 9, 15, 1, 8, 5],[8, 10, 15, 13, 12, 11, 2, 1, 5, 9, 4, 6, 3, 14, 7],[5, 4, 9, 1, 7, 6, 14, 15, 3, 8, 10, 11, 2, 13, 12],[4, 2, 12, 9, 14, 10, 15, 3, 13, 5, 7, 8, 11, 1, 6],[11, 13, 8, 15, 1, 4, 7, 14, 12, 6, 5, 10, 9, 2, 3],[6, 3, 10, 7, 5, 9, 1, 8, 11, 2, 14, 4, 12, 15, 13],[10, 12, 4, 5, 2, 3, 13, 11, 9, 15, 8, 14, 6, 7, 1],[7, 14, 13, 8, 11, 1, 5, 2, 6, 4, 3, 12, 10, 9, 15],[3, 9, 1, 6, 15, 8, 10, 7, 14, 12, 2, 13, 4, 5, 11],[15, 5, 7, 2, 4, 14, 8, 10, 1, 11, 12, 3, 13, 6, 9],[12, 8, 11, 3, 9, 15, 6, 5, 2, 13, 1, 7, 14, 4, 10],[13, 1, 6, 14, 10, 7, 9, 12, 4, 3, 15, 5, 8, 11, 2],[2, 11, 14, 4, 13, 5, 12, 9, 10, 7, 6, 1, 15, 3, 8],[9, 15, 5, 10, 6, 13, 3, 4, 8, 1, 11, 2, 7, 12, 14],[1, 7, 3, 12, 8, 2, 11, 6, 15, 14, 13, 9, 5, 10, 4],],
        14: [[2, 14, 8, 1, 5, 12, 3, 6, 10, 7, 11, 9, 4, 13], [7, 11, 10, 6, 9, 4, 13, 8, 3, 2, 14, 12, 5, 1], [12, 1, 9, 8, 2, 5, 6, 11, 13, 14, 10, 4, 7, 3], [11, 10, 13, 3, 14, 7, 4, 5, 1, 12, 8, 2, 9, 6], [14, 4, 3, 12, 10, 2, 5, 7, 6, 13, 1, 11, 8, 9], [13, 9, 1, 7, 8, 6, 11, 2, 12, 3, 5, 10, 14, 4], [4, 2, 7, 5, 12, 3, 1, 13, 9, 10, 6, 14, 11, 8], [8, 13, 11, 9, 6, 10, 14, 4, 2, 5, 12, 1, 3, 7], [9, 12, 2, 11, 1, 14, 8, 3, 4, 6, 13, 7, 10, 5], [5, 6, 4, 10, 3, 13, 7, 14, 11, 9, 2, 8, 1, 12], [3, 8, 14, 4, 11, 9, 2, 12, 5, 1, 7, 13, 6, 10], [10, 5, 6, 13, 7, 1, 12, 9, 14, 8, 4, 3, 2, 11], [6, 3, 12, 14, 4, 8, 10, 1, 7, 11, 9, 5, 13, 2], [1, 7, 5, 2, 13, 11, 9, 10, 8, 4, 3, 6, 12, 14],],
        12: [[4, 7, 2, 8, 1, 9, 11, 10, 5, 3, 6, 0], [1, 0, 9, 3, 4, 8, 5, 6, 2, 11, 7, 10], [5, 6, 10, 11, 7, 0, 3, 2, 4, 8, 1, 9], [9, 1, 5, 6, 0, 11, 2, 4, 7, 10, 8, 3], [3, 4, 11, 10, 6, 5, 7, 8, 9, 1, 0, 2], [8, 2, 0, 7, 3, 1, 10, 9, 11, 5, 4, 6], [0, 3, 8, 5, 10, 6, 9, 11, 1, 7, 2, 4], [11, 9, 7, 4, 2, 3, 8, 1, 6, 0, 10, 5], [6, 10, 1, 2, 5, 7, 4, 0, 8, 9, 3, 11], [7, 8, 6, 9, 11, 2, 0, 3, 10, 4, 5, 1], [10, 11, 3, 1, 8, 4, 6, 5, 0, 2, 9, 7], [2, 5, 4, 0, 9, 10, 1, 7, 3, 6, 11, 8],],
        10: [[9, 5, 6, 7, 8, 3, 10, 1, 4, 2], [10, 4, 3, 1, 2, 9, 6, 7, 5, 8], [2, 8, 10, 6, 4, 1, 9, 5, 7, 3], [7, 1, 5, 3, 9, 6, 4, 2, 8, 10], [4, 6, 1, 10, 5, 7, 3, 8, 2, 9], [3, 2, 9, 8, 7, 5, 1, 4, 10, 6], [6, 7, 8, 9, 10, 4, 2, 3, 1, 5], [5, 3, 4, 2, 1, 10, 8, 9, 6, 7], [8, 9, 7, 4, 6, 2, 5, 10, 3, 1], [1, 10, 2, 5, 3, 8, 7, 6, 9, 4],],
        9: [[3, 1, 6, 5, 7, 8, 4, 9, 2], [5, 2, 9, 1, 3, 4, 7, 6, 8], [4, 8, 7, 6, 2, 9, 5, 3, 1], [2, 6, 3, 4, 1, 5, 9, 8, 7], [9, 7, 4, 8, 6, 3, 1, 2, 5], [8, 5, 1, 7, 9, 2, 6, 4, 3], [1, 3, 8, 9, 4, 7, 2, 5, 6], [6, 9, 2, 3, 5, 1, 8, 7, 4], [7, 4, 5, 2, 8, 6, 3, 1, 9],],
        8: [[8, 6, 1, 4, 3, 5, 7, 2], [5, 3, 2, 7, 8, 4, 1, 6], [4, 1, 5, 8, 7, 6, 2, 3], [2, 7, 3, 6, 1, 8, 5, 4], [1, 8, 4, 3, 2, 7, 6, 5], [7, 5, 6, 2, 4, 3, 8, 1], [6, 4, 7, 1, 5, 2, 3, 8], [3, 2, 8, 5, 6, 1, 4, 7],],
        6: [[1, 6, 4, 5, 2, 3], [3, 5, 2, 1, 4, 6], [2, 3, 1, 6, 5, 4], [6, 4, 5, 3, 1, 2], [4, 1, 6, 2, 3, 5], [5, 2, 3, 4, 6, 1],],
        4: [[2, 4, 3, 1], [1, 3, 4, 2], [4, 2, 1, 3], [3, 1, 2, 4],],
    };
    // DOM refs
    // const sizeSel = document.getElementById('sizeSel');
    // const diffSel = document.getElementById('diffSel');
    const newBtn = document.getElementById('newBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');
    const hintBtn = document.getElementById('hintBtn');
    const checkBtn = document.getElementById('checkBtn');
    const errorBtn = document.getElementById('errorBtn');
    const solveBtn = document.getElementById('solveBtn');
    const themeBtn = document.getElementById('themeBtn');
    const notesToggle = document.getElementById('notesToggle');
    const wintxt = document.getElementById('winText');
    const grid = document.getElementById('gridContainer');
    const gridWrap = document.querySelector('.board-wrap');
    const numpad = document.getElementById('numpad');
    const timerInfo = document.getElementById('timerInfo');
    const mistakeInfo = document.getElementById('mistakeInfo');
    const filledInfo = document.getElementById('filledInfo');
    const remainInfo = document.getElementById('remainInfo');
    const statusText = document.getElementById('statusText');
    updateHint();

    // this.document.getElementById("player1").textContent = player1;

    document.getElementById("diffSel").addEventListener("click", () => {
      difficulty = diffSel.value;
    });


    // helpers
    function SYMBOLS(n) {
        const out = [];
        for (let i = 1; i <= Math.min(n, 9); i++) out.push(String(i));
        for (let i = 10; i <= n; i++) {
            // 10 -> 'A' (65), so char = 55 + i; when i=10 => 65 -> 'A'
            out.push(String.fromCharCode(55 + i));
        }
        return out;
    }

    function symbolOf(v) {
        return v ? state.symbols[v - 1] : '';
    }

    function valFromKey(k) {
        if (!k) return 0;
        if (k >= '1' && k <= '9') return Number(k);
        const u = k.toUpperCase();
        if (u >= 'A' && u <= 'Z') return 10 + (u.charCodeAt(0) - 65);
        return 0;
    }

    function idx(r, c) {
        return r * state.N + c;
    }

    function rowOf(i) {
        return Math.floor(i / state.N);
    }

    function colOf(i) {
        return i % state.N;
    }

    function shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
    }

    function gcd(a, b) {
        while (b) {
            [a, b] = [b, a % b];
        } return a;
    }

    function randInt(n) {
        return Math.floor(Math.random() * n);
    }

    function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = randInt(i + 1);
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    // Create random puzzle from base puzzle
    function fastPuzzle(N, R, C, diff) {
        board = size[N];
        generateBoard();
        updateHint();
        const solved = board.flat();
        // set diffculty level as per percentage
        const ratios = { learner: 0.75, easy: 0.55, medium: 0.45, hard: 0.35, expert: 0.25 };
        const total = N * N;
        const clues = Math.max(1, Math.round(total * (ratios[diff] ?? 0.45)));
        const indices = [...Array(total).keys()]; shuffle(indices);
        const puzzle = new Array(total).fill(0);
        for (let k = 0; k < clues; k++) puzzle[indices[k]] = solved[indices[k]];
        return { puzzle, solved };
    }

    // generated random puzzle from base puzzle
    function generateBoard() {
        let error = "";
        let random10 = Math.floor((Math.random() * (state.N - 1)) + 1);

        // loop to generate new puzzle board
        // r is used to how many times each number is added 1 in it
        for (let r = 0; r < random10; r++) {
            // these 2 loops to select each element of array (board) and add 1 to each element
            for (let i = 0; i < state.N; i++) {
                for (let j = 0; j < state.N; j++) {
                    board[i][j] = board[i][j] + 1;
                    if (board[i][j] == (state.N + 1)) {
                        board[i][j] = 1;
                    }
                }
            }
        }
    }

    // compute cell size so grid fits its container without scrollbars
    function computeCellSize() {
        const rect = gridWrap.getBoundingClientRect();
        const availW = Math.max(40, rect.width - 12);
        const availH = Math.max(40, rect.height - 12);
        const N = state.N;
        const gap = 3;
        const sizeW = Math.floor((availW - gap * (N - 1)) / N);
        const sizeH = Math.floor((availH - gap * (N - 1)) / N);
        let size = Math.max(16, Math.min(sizeW, sizeH));
        size = Math.max(16, Math.min(size, 96));
        document.documentElement.style.setProperty('--cell-size', size + 'px');
    }

    // Build grid DOM
    function buildGrid() {
        computeCellSize();
        grid.style.gridTemplateColumns = `repeat(${state.N}, var(--cell-size))`;
        grid.innerHTML = '';

        for (let r = 0; r < state.N; r++) {
            for (let c = 0; c < state.N; c++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.tabIndex = 0;
                cell.dataset.i = idx(r, c);
                // Checkerboard shading
                let subgridRows = Math.floor(r / state.blockRows);
                let subgridCols = Math.floor(c / state.blockCols);
                if ((subgridRows + subgridCols) % 2 === 0) {
                    cell.classList.add("subgrid-light");
                } else {
                    cell.classList.add("subgrid-dark");
                }
                cell.addEventListener('click', () => selectCell(idx(r, c)));
                cell.addEventListener('keydown', (e) => cellKeyHandler(e, idx(r, c)));
                grid.appendChild(cell);
            }
        }
    }

    // Render numpad with counts
    function renderNumpad() {
        numpad.innerHTML = '';
        state.symbols = SYMBOLS(state.N);
        for (let v = 1; v <= state.N; v++) {
            const btn = document.createElement('button');
            btn.className = 'nbtn';
            btn.dataset.val = state.symbols[v - 1]
            btn.textContent = state.symbols[v - 1];
            const sp = document.createElement('span');
            sp.className = 'count';
            sp.textContent = countRemaining(v);
            btn.appendChild(sp);

            btn.addEventListener('click', () => {
                if (state.revealMode) return;
                handleNumpadClick(btn.dataset.val);
                state.numSelected = btn.dataset.val;

                if (btn.dataset.val == state.symbols[v - 1]) { btn.classList.add("highlight"); }
                else { btn.classList.remove("highlight"); }
                state.highlightDigit = state.symbols[v - 1];
                updateDigitHighlight();
                // if (!state.selected && !state.fixed[state.selected]) placeAt(state.selected, v);
                // if (state.selected >= 0 && !state.fixed[state.selected]) {
                // state.highlightDigit = state.symbols[v - 1];
                // updateDigitHighlight();
                //     placeAt(state.selected, v);
                // }
            });

            // long-press toggles note
            let t;
            btn.addEventListener('pointerdown', () => {
                t = setTimeout(() => {
                    if (state.selected >= 0 && !state.fixed[state.selected]) {
                        toggleNote(state.selected, v);
                        drawBoard();
                    }
                }, 550);
            });
            btn.addEventListener('pointerup', () => clearTimeout(t));
            btn.addEventListener('pointerleave', () => clearTimeout(t));

            numpad.appendChild(btn);
        }
        // erase
        const er = document.createElement('button');
        er.className = 'nbtn';
        er.textContent = '⌫';
        er.addEventListener('click', () => {
            if (state.selected >= 0 && !state.fixed[state.selected]) placeAt(state.selected, 0);
        });
        numpad.appendChild(er);
    }

    function updateNumpadCounts() {
        const btns = Array.from(numpad.querySelectorAll('.nbtn'));
        for (let v = 1; v <= state.N; v++) {
            const btn = btns[v - 1];
            const sp = btn.querySelector('.count');
            if (sp) sp.textContent = countRemaining(v);
        }
    }
    function countRemaining(v) {
        let used = 0;
        for (let i = 0; i < state.puzzle.length; i++) if (state.puzzle[i] === v) used++;
        return state.N - used;
    }

    // Draw board (normal or reveal)
    function drawBoard() {
        computeCellSize();

        for (let i = 0; i < state.N * state.N; i++) {
            const el = grid.children[i];
            // el.className = 'cell';
                el.classList.add("cell");
                const r = rowOf(i), c = colOf(i);
            //   if (r % state.blockRows === 0) el.classList.add('top-border');
            //   if (c % state.blockCols === 0) el.classList.add('left-border');
            let subgridRows = Math.floor(r / state.blockRows);
            let subgridCols = Math.floor(c / state.blockCols);
            if ((subgridRows + subgridCols) % 2 === 0) {
                el.classList.add("subgrid-light");
            } else {
                el.classList.add("subgrid-dark");
            }
            if (state.fixed[i]) el.classList.add('fixed');
            el.innerHTML = '';

            if (state.revealMode) {
                const user = state.puzzle[i], sol = state.solution[i];
                if (state.fixed[i]) {
                    el.textContent = symbolOf(sol);
                    fix++;
                } else {
                    // empty -> show correct only (red)
                    const wrap = document.createElement('div');
                    wrap.className = 'reveal';
                    if (user === 0) {
                        const right = document.createElement('div');
                        right.className = 'right';
                        right.textContent = symbolOf(sol);
                        wrap.appendChild(right);
                        el.appendChild(wrap);
                        el.textContent = symbolOf(sol);
                        el.classList.add('solved-wrong');
                        empty++;
                    } else if (user === sol) {
                        el.appendChild(wrap);
                        el.classList.add('solved-correct');
                        el.textContent = symbolOf(sol);
                        rgt++;
                    } else {
                        // wrong -> show user's red small above, correct green big below
                        // const wrap = document.createElement('div');
                        // wrap.className = 'reveal';
                        const wrong = document.createElement('div');
                        wrong.className = 'wrong';
                        wrong.textContent = symbolOf(user);
                        const right = document.createElement('div');
                        right.className = 'right';
                        right.textContent = symbolOf(sol);
                        wrap.appendChild(wrong);
                        wrap.appendChild(right);
                        el.appendChild(wrap);
                        el.classList.add('solved-wrong');
                        wrg++;
                    }
                }
                statusText.textContent = `Looser! Empty:${empty}, Wrong:${wrg}, Right:${rgt}, fixed:${fix}`;
                continue;
            }

            if (state.puzzle[i]) {
                el.textContent = symbolOf(state.puzzle[i]);
            } else if (state.notes[i]) {
                const n = document.createElement('div');
                n.className = 'notes';
                n.textContent = state.notes[i];
                el.appendChild(n);
            } else {
                el.textContent = '';
            }
        }
        updateDigitHighlight();
        // mark Conflict detection
        if(state.conflitMode) markConflicts();
        updateNumpadCounts();
        refreshInfo();
    }

    //highlight all selected number in board which num selected in numpad
    function updateDigitHighlight() {
        const hd = state.highlightDigit;
        for (let i = 0; i < grid.children.length; i++) {
            const el = grid.children[i];
            el.classList.toggle('highlight', !!(state.puzzle[i] && symbolOf(state.puzzle[i]) === hd));
        }
    }

    // Conflict detection using blockRows (R) and blockCols (C)
    function markConflicts() {
        const N = state.N;
        for (let i = 0; i < N * N; i++) grid.children[i].classList.remove('conflict');
        // rows
        for (let r = 0; r < N; r++) {
            const seen = new Map();
            for (let c = 0; c < N; c++) {
                const i = idx(r, c), v = state.puzzle[i];
                if (!v) continue;
                if (seen.has(v)) {
                    grid.children[i].classList.add('conflict');
                    grid.children[seen.get(v)].classList.add('conflict');
                } else seen.set(v, i);
            }
        }
        // cols
        for (let c = 0; c < N; c++) {
            const seen = new Map();
            for (let r = 0; r < N; r++) {
                const i = idx(r, c), v = state.puzzle[i];
                if (!v) continue;
                if (seen.has(v)) {
                    grid.children[i].classList.add('conflict');
                    grid.children[seen.get(v)].classList.add('conflict');
                } else seen.set(v, i);
            }
        }
        // boxes: iterate over block row groups and block col groups
        const R = state.blockRows, C = state.blockCols;
        const boxRows = Math.floor(state.N / R);
        const boxCols = Math.floor(state.N / C);
        for (let br = 0; br < boxRows; br++) {
            for (let bc = 0; bc < boxCols; bc++) {
                const seen = new Map();
                for (let r = br * R; r < br * R + R; r++) {
                    for (let c = bc * C; c < bc * C + C; c++) {
                        const i = idx(r, c), v = state.puzzle[i];
                        if (!v) continue;
                        if (seen.has(v)) { grid.children[i].classList.add('conflict'); grid.children[seen.get(v)].classList.add('conflict'); }
                        else seen.set(v, i);
                    }
                }
            }
        }
    }

    // selection by mouse
    function selectCell(i) {
        if(state.numSelected < 0) {
            statusText.textContent = "please Click Numpad number first ";
            return;
        }
        if (state.revealMode) return;
        state.selected = i;
        Array.from(grid.children).forEach(c => c.classList.remove('selected'));
        grid.children[i].classList.add('selected');
        if (valFromKey(state.numSelected) >= 0 && state.puzzle[i] == 0) {
            placeAt(i, valFromKey(state.numSelected));
            playSound('tap');
        }
    }

    // selection by keyboard (number keys)
    function cellKeyHandler(e, i) {
        if (state.revealMode) return;
        if (e.key === 'Backspace' || e.key === 'Delete') { placeAt(i, 0); return; }
        if (e.key.startsWith('Arrow')) {
            e.preventDefault();
            navArrow(i, e.key);
            return;
        }
        const v = valFromKey(e.key);
        if (v >= 1 && v <= state.N) {
            playSound('key');
            placeAt(i, v);
            return;
        }
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { doUndo(); }
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') { doRedo(); }
    }

    // selection by keyboard (Arrow keys)
    function navArrow(i, arrow) {
        const N = state.N;
        let r = rowOf(i), c = colOf(i);
        if (arrow === 'ArrowLeft') c = (c - 1 + N) % N;
        if (arrow === 'ArrowRight') c = (c + 1) % N;
        if (arrow === 'ArrowUp') r = (r - 1 + N) % N;
        if (arrow === 'ArrowDown') r = (r + 1) % N;
        selectCell(idx(r, c));
    }

    // place / notes / undo / redo numbers
    function placeAt(i, v) {
        if (state.fixed[i] || state.revealMode) return;
        const prevV = state.puzzle[i], prevNotes = state.notes[i];
        if (!state.notesMode) {
            state.puzzle[i] = v;
            state.notes[i] = '';
            state.undo.push({ i, prevV, prevNotes });
            state.redo.length = 0;
            if (v !== 0 && v !== state.solution[i]) {
                state.mistakes++; updateMistakeUI();
            }
        } else {
            if (v === 0) state.notes[i] = '';
            else {
                const s = symbolOf(v);
                const set = new Set((state.notes[i] || '').split(/\s+/).filter(Boolean));
                if (set.has(s)) set.delete(s); else set.add(s);
                state.notes[i] = Array.from(set).join(' ');
            }
            state.undo.push({ i, prevV, prevNotes });
            state.redo.length = 0;
        }
        drawBoard();
        checkCompletion(false);
    }

    // numpad number selection
    function handleNumpadClick(n) {
        playSound('tap');
        state.numSelected = n;
        statusText.textContent = "Click cell to fill number " + n;
        const btns = Array.from(numpad.querySelectorAll('.nbtn'));
        btns.forEach(element => {
            state.highlightDigit = n;
            element.classList.remove("highlight");
        });
        for (let v = 1; v <= state.N; v++) {
            const btn = btns[v - 1];
            const sp = btn.querySelector('.count');
            if (sp) sp.textContent = countRemaining(v);
        }
        // highlight numpad number on board
        updateDigitHighlight();
        if (state.selected == -1) return;
        // ignore for fixed cell
        if (state.fixed[state.selected]) return;
    }

    function toggleNote(i, v) {
        if (state.fixed[i] || state.revealMode) return;
        const s = symbolOf(v);
        const set = new Set((state.notes[i] || '').split(/\s+/).filter(Boolean));
        if (set.has(s)) set.delete(s); else set.add(s);
        state.notes[i] = Array.from(set).join(' ');
    }

    function doUndo() {
        const a = state.undo.pop(); if (!a) return;
        state.redo.push({ i: a.i, prevV: state.puzzle[a.i], prevNotes: state.notes[a.i] });
        state.puzzle[a.i] = a.prevV; state.notes[a.i] = a.prevNotes;
        textToSpeechEng('Undo');
        drawBoard();
    }

    function doRedo() {
        const a = state.redo.pop(); if (!a) return;
        state.undo.push({ i: a.i, prevV: state.puzzle[a.i], prevNotes: state.notes[a.i] });
        state.puzzle[a.i] = a.prevV;
        state.notes[a.i] = a.prevNotes;
        textToSpeechEng('Redo');
        drawBoard();
    }

    // hint one
    function hintOne() {
        if (state.revealMode) return;
        if(state.hintCount > 0){
            state.hintCount--;
            hintBtn.textContent = `💡 Hint(${state.hintCount})`;
            textToSpeechEng(state.hintCount + 'hint remaining');
            const empties = [];
            for (let i = 0; i < state.solution.length; i++) if (!state.fixed[i] && state.puzzle[i] === 0) empties.push(i);
            if (!empties.length) return;
            const i = empties[Math.floor(Math.random() * empties.length)];
            placeAt(i, state.solution[i]);
        }
    }

    function updateHint(){
        if (diffSel.value == 'learner') {
            state.hintCount = 1;
        } else if (diffSel.value == 'easy') {
            state.hintCount = 2;
        } else if (diffSel.value == 'medium') {
            state.hintCount = 3;
        } else if (diffSel.value == 'hard') {
            state.hintCount = 4;
        } else if (diffSel.value == 'expert') {
            state.hintCount = 5;
        } 
        hintBtn.textContent = `💡 Hint(${state.hintCount})`;
    }

    // reset board
    function resetBoard() {
        for (let i = 0; i < state.puzzle.length; i++) {
            if (!state.fixed[i]) {
                const prevV = state.puzzle[i], prevNotes = state.notes[i];
                if (prevV !== 0 || prevNotes !== '') state.undo.push({ i, prevV, prevNotes });
                state.puzzle[i] = 0; state.notes[i] = '';
            }
        }
        textToSpeechEng('reset');
        state.redo.length = 0;
        state.numSelected = -1;
        state.highlightDigit = null;
        state.mistakes = 0; updateMistakeUI();
        const btns = Array.from(numpad.querySelectorAll('.nbtn'));
        btns.forEach(element => {
            element.classList.remove("highlight");
        });
        drawBoard();
        updateHint();
    }

    // check current progress
    function checkProgress() {
        if (state.revealMode) return;
        let wrong = 0;
        for (let i = 0; i < state.solution.length; i++) {
            const v = state.puzzle[i];
            if (v && v !== state.solution[i]) wrong++;
        }
        if (wrong === 0) { statusText.textContent = '✅ Looks good'; flash(statusText, 'ok'); }
        else { statusText.textContent = `⚠️ ${wrong} incorrect`; flash(statusText, 'warn'); }
        setTimeout(() => statusText.textContent = 'Ready', 1400);
    }

    // reveal solution
    function revealSolution() {
        state.revealMode = true;
        drawBoard();
        stopTimer();
    }

    // solve puzzle
    function solveAll() {
        // state.puzzle = state.solution.slice();
        state.hintCount = 0;
        state.highlightDigit = null;
        state.numSelected = -1;
        const btns = Array.from(numpad.querySelectorAll('.nbtn'));
        btns.forEach(element => {
            element.classList.remove("highlight");
        });
        const grids = Array.from(grid.querySelectorAll('.cell'));
        grids.forEach(element => {
            element.classList.remove("highlight");
        });
        state.revealMode = true;
        drawBoard();
        playSound('loose');
        stopTimer();
    }

    //check puzzle completed
    function checkCompletion(revealIfWrong = true) {
        if (state.revealMode) return false;
        if (state.puzzle.some(v => v === 0)) return false;
        for (let i = 0; i < state.solution.length; i++) {
            if (state.puzzle[i] !== state.solution[i]) {
                if (revealIfWrong) revealSolution();
                return false;
            }
        }
        state.revealMode = true;
        updateleaderboard();
        drawBoard();
        stopTimer();
        // saveBest();
        // loadBest();
        statusText.textContent = `🎉${player1} Won!🎉(⏱️${hours * 3600}:${minutes * 60}:${seconds})`;
        wintxt.innerHTML = `🎉${player1} Won!🎉(⏱️${hours * 3600}:${minutes * 60}:${seconds})`;
        playSound('win');
        // saveToLeaderboard(hrs, min, sec);
        flash(statusText, 'ok');
        launchConfetti();
        return true;
    }


    // show no of mistakes
    function updateMistakeUI() {
        mistakeInfo.textContent = `❌ ${state.mistakes}`;
    }

    // update information filled/empty cells
    function refreshInfo() {
        const filled = state.puzzle.reduce((s, v) => s + (v ? 1 : 0), 0);
        filledInfo.textContent = `Filled: ${filled}`;
        remainInfo.textContent = `Empty: ${state.N * state.N - filled}`;
    }

    //display status
    function flash(el, cls) {
        el.classList.add(cls);
        setTimeout(() => el.classList.remove(cls), 900);
    }

    // newGame
    function parseSizeValue(val) {
        // expected format "N|R|C"
        const parts = val.split('|').map(x => Number(x));
        return { N: parts[0], R: parts[1], C: parts[2] };
    }

    //create new game puzzle
    function newGame() {
        // player1 = document.getElementById("nameInput").value;
        // namebar.classList.remove('show');
        const parsed = parseSizeValue(sizeSel.value);
        state.N = parsed.N;
        state.blockRows = parsed.R;
        state.blockCols = parsed.C;
        state.symbols = SYMBOLS(state.N);
        wintxt.innerHTML = '';
        // build grid and numpad
        buildGrid();
        renderNumpad();

        statusText.textContent = 'Generating...';
        setTimeout(() => {
            const { puzzle, solved } = fastPuzzle(state.N, state.blockRows, state.blockCols, diffSel.value);
            state.puzzle = puzzle.slice();
            state.solution = solved.slice();
            state.fixed = state.puzzle.map(v => v !== 0);
            state.notes = new Array(state.N * state.N).fill('');
            state.undo = []; state.redo = []; state.mistakes = 0; updateMistakeUI();
            state.revealMode = false;
            state.numSelected = -1;
            state.highlightDigit = null;
            drawBoard();
            statusText.textContent = 'Good luck!, click numpad number then click cell to fill';
            startTimer();
        }, 8);
        // loadBest();
        updateHint();
    }

    // attach events
    function attachEvents() {
        newBtn.addEventListener('click', newGame);
        resetBtn.addEventListener('click', resetBoard);
        undoBtn.addEventListener('click', doUndo);
        redoBtn.addEventListener('click', doRedo);
        hintBtn.addEventListener('click', hintOne);
        checkBtn.addEventListener('click', checkProgress);
        solveBtn.addEventListener('click', solveAll);
        notesToggle.addEventListener('change', () => state.notesMode = notesToggle.checked);
        errorBtn.addEventListener('click', () => {
            state.conflitMode = !state.conflitMode;
            errorBtn.textContent = state.conflitMode ? 'Error On' : 'Error Off';
            if(state.conflitMode) {
                markConflicts();
                textToSpeechEng('Conflict On');
            } else {
                textToSpeechEng('Conflict Off');
                for (let i = 0; i < state.N * state.N; i++) grid.children[i].classList.remove('conflict');
            }
        });
        themeBtn.addEventListener('click', () => {
            const cur = document.documentElement.getAttribute('data-theme') || 'dark';
            document.documentElement.setAttribute('data-theme', cur === 'dark' ? 'light' : 'dark');
            themeBtn.innerText = (cur === 'dark' ? '🌙dark' : '☀️light');
        });
        document.addEventListener('keydown', (e) => {
            if (state.selected < 0) return;
            if (state.revealMode) return;
            if (e.key === 'Backspace' || e.key === 'Delete') { placeAt(state.selected, 0); e.preventDefault(); return; }
            const v = valFromKey(e.key);
            if (v >= 1 && v <= state.N) { placeAt(state.selected, v); e.preventDefault(); return; }
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { doUndo(); e.preventDefault(); return; }
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') { doRedo(); e.preventDefault(); return; }
        });

        window.addEventListener('resize', () => { computeCellSize(); drawBoard(); });
    }

    // init
    function init() {
        document.documentElement.setAttribute('data-theme', 'dark');
        attachEvents();
        statusText.textContent = 'Enter Name and click <ok>/<new game> Button to start';
    }

    function updateleaderboard() {
        winnerName = player1;
        // let score = 0;
        let opponent = "-"
        let game_id = 'sudoku';
        let gsize = `${state.N}x${state.N}`;
        let elapsed = hours * 3600 + minutes * 60 + seconds;
        let gameCount = history.length;
        // let moves = 0;
        let filed1 = 0;
        let filed2 = 0
        let filed3 = "-";
        let filed4 = "-";
        let email = localStorage.getItem('email') || '-';
        const created_at = new Date();
        score = (state.N * state.N - state.hintCount - state.undo.length - state.redo.length) * 10;
      
        saveToLeaderboard(winnerName, opponent, email, gsize, difficulty, game_id, score, elapsed, gameCount, filed1, filed2, filed3, filed4, created_at)

        // const entry = { winnerName, opponent, email, gsize, difficulty, game_id, score, elapsed, gameCount, filed1, filed2, filed3, filed4, created_at };
        // const boardData = JSON.parse(localStorage.getItem("leaderboard") || "[]");
        // boardData.push(entry);
        // localStorage.setItem("leaderboard", JSON.stringify(boardData));
      
        window.submitScore &&
          window.submitScore(winnerName, opponent, email, gsize, difficulty, game_id, score, elapsed, gameCount, filed1, filed2, filed3, filed4, created_at);
      }

    // get player name
    // const namebar = document.getElementById('namebar');
    // namebar.classList.add('show');
    // document.getElementById('name').addEventListener('click', () => {
    //     player1 = document.getElementById("nameInput").value;
    //     namebar.classList.remove('show');
    // });

    // // Rules Toggle 
    // document.getElementById("toggle-rules").addEventListener("click", () => {
    //     if (document.getElementById("toggle-rules").textContent === "View Rules") {
    //         document.getElementById("toggle-rules").textContent = "Hide Rules";
    //         textToSpeechEng('Open Rules');
    //         showRules();
    //     } else {
    //         document.getElementById("toggle-rules").textContent = "View Rules"
    //         textToSpeechEng('Close Rules');
    //         document.getElementById("rulesPopup").style.display = "none";
    //     }
    // });
    // //hide rules
    // document.getElementById("hide-rules").addEventListener("click", () => {
    //     document.getElementById("toggle-rules").textContent = "View Rules"
    //     textToSpeechEng('Close Rules');
    //     document.getElementById("rulesPopup").style.display = "none";
    // });

    // // Rules Display
    // function showRules() {
    //     let rule = document.getElementById("RulesBox");
    //     rule.style.textAlign = "left";
    //     // all rules are write here with required HTML tegs
    //     rule.innerHTML = `<h2>Sudoku Rules</h2>
    //     Sudoku rules are simple and straightforward. It is precisely their simplicity that makes finding the solution and solving these puzzles a true challenge.<br>
    //     <br>
    //     To play Sudoku, the player only needs to be familiar with the numbers from 1 to 9 & A to Z and be able to think logically.<br><b>The goal of this game is clear:</b> to fill and complete the grid using the numbers from 1 to 9 & A to Z. The challenging part lies in the restrictions imposed on the player to be able to fill in the grid.<br>
    //     <br>
    //     <b>Rule 1</b> - Each row must contain the numbers from 1 to 9& A to Z, without repetitions
    //     The player must focus on filling each row of the grid while ensuring there are no duplicated numbers/alphabes. The placement order of the digits is irrelevant.<br>
    //     <br>
    //     Every puzzle, regardless of the difficulty level, begins with allocated numbers on the grid. The player should use these numbers as clues to find which digits are missing in each row.<br>
    //     <br>
    //     <b>Rule 2</b> - Each column must contain the numbers from 1 to 9 & A to Z, without repetitions
    //     The Sudoku rules for the columns on the grid are exactly the same as for the rows. The player must also fill these with the numbers from 1 to 9 & A to Z, making sure each digit occurs only once per column.<br>
    //     <br>
    //     The numbers allocated at the beginning of the puzzle work as clues to find which digits are missing in each column and their position.<br>
    //     <br>
    //     <b>Rule 3</b> - The digits can only occur once per block (nonet)<br>
    //     A regular 9 x 9 grid is divided into 9 smaller blocks of 3 x 3, also known as nonets. The numbers from 1 to 9 can only occur once per nonet.<br>
    //     <b>Other Grid size</b> nonet are as under<br>
    //                 1 Grid Size 25x25 [nonets grid 5x5]<br>
    //                 2 Grid Size 24x24 [nonets grid 4x6]<br>
    //                 3 Grid Size 22x22 [nonets grid 11x2]<br>
    //                 4 Grid Size 21x21 [nonets grid 7x3]<br>
    //                 5 Grid Size 20x20 [nonets grid 5x4]<br>
    //                 6 Grid Size 18x18 [nonets grid 6x6]<br>
    //                 7 Grid Size 16x16 [nonets grid 4x4]<br>
    //                 8 Grid Size 15x15 [nonets grid 5x3]<br>
    //                 9 Grid Size 14x14 [nonets grid 7x2]<br>
    //                 10 Grid Size 12x12 [nonets grid 4x3]<br>
    //                 11 Grid Size 10x10 [nonets grid 5x2]<br>
    //                 12 Grid Size 9x9 [nonets grid 3x3]<br>
    //                 13 Grid Size 8x8 [nonets grid 4x2]<br>
    //                 14 Grid Size 6x6 [nonets grid 3x2]<br>
    //                 15 Grid Size 4x4 [nonets grid 2x2]<br>
    //                 <br>
    //     In practice, this means that the process of filling the rows and columns without duplicated digits finds inside each block another restriction to the numbers’ positioning.<br>
    //     <br>
    //     <b>Rule 4</b> - The sum of every single row, column, and nonet must equal 45<br>
    //     To find out which numbers are missing from each row, column, or block or if there are any duplicates, the player can simply count or flex their math skills and sum the numbers. When the digits occur only once, the total of each row, column, and group must be 45.<br>
    //     <br>
    //     <b>Other Grid size</b> of sudoku sum of every single row, column, and nonet must equal as under:<br>
    //     1+2+3+4+5+6+7+8+9+10+11+12+13+14+15+16+17+18+19+20+21+22+23+24+25 = 325<br>
    //     1+2+3+4+5+6+7+8+9+10+11+12+13+14+15+16+17+18+19+20+21+22+23+24 = 300<br>
    //     1+2+3+4+5+6+7+8+9+10+11+12+13+14+15+16+17+18+19+20+21+22 = 253<br>
    //     1+2+3+4+5+6+7+8+9+10+11+12+13+14+15+16+17+18+19+20+21 = 231<br>
    //     1+2+3+4+5+6+7+8+9+10+11+12+13+14+15+16+17+18+19+20 = 210<br>
    //     1+2+3+4+5+6+7+8+9+10+11+12+13+14+15+16+17+18 = 171<br>
    //     1+2+3+4+5+6+7+8+9+10+11+12+13+14+15+16 = 136<br>
    //     1+2+3+4+5+6+7+8+9+10+11+12+13+14+15 = 120<br>
    //     1+2+3+4+5+6+7+8+9+10+11+12 = 78<br>
    //     1+2+3+4+5+6+7+8+9+10+11 = 66<br>
    //     1+2+3+4+5+6+7+8+9+10 = 55<br>
    //     1+2+3+4+5+6+7+8+9= 45<br>
    //     1+2+3+4+5+6+7+8 = 36<br>
    //     1+2+3+4+5+6 = 21<br>
    //     1+2+3+4 = 10<br>
    //     <br>
    //     <br>to make number single digit alphabest are used instead number<br>
    //     <br>
    //     Other details to take into consideration<br>
    //     <b>1. Each puzzle has a unique solution</b><br>
    //     Each Sudoku puzzle has only one possible solution that can only be achieved by following the Sudoku rules correctly.<br>
    //     <br>
    //     Multiple solutions only occur when the puzzle is poorly designed or, the most frequent reason, when the player makes a mistake in its resolution and a duplicate is hidden somewhere on the grid.<br>

    //     <b>2. Guessing is not allowed</b><br>
    //     Trying to guess the solution for each cell is not allowed under Sudoku rules. These are logical number puzzles.<br>
    //     <br>
    //     The numbers allocated at the beginning of the game are the only clues the player needs to solve the grid.<br>
    //     <br>
    //     <b>3. Notes and techniques</b><br>
    //     Writing down the numbers that are candidates for each cell is allowed by Sudoku rules and is even encouraged. These help the player keep track of their progress and keep their reasoning organized and clear.<br>
    //     <br>
    //     As the difficulty level of these puzzles increases, these notes also become essential to apply the advanced solving techniques required to complete the grid.<br>`;
    //     document.getElementById("rulesPopup").style.display = "block";
    // }

    // // hide rules
    // function hideRules() {
    //     textToSpeechEng('Close Rules');
    //     document.getElementById("rulesPopup").style.display = "none";
    //     document.getElementById("toggle-rules").textContent = "View Rules";
    // }



    //best score
    // function storageKey() {
    //     return `mm_best_${state.N}_${diffSel.value}`;
    // }

    // run
    init();

});
