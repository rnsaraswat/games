import { textToSpeechEng } from './speak.js';

document.getElementById("toggle-rules").addEventListener("click", () => {
    if (document.getElementById("RulesModal").style.display == "none") {
        document.getElementById("RulesModal").style.display == "flex";
        textToSpeechEng('Open Rules');
        showRules();
    } else {
        // document.getElementById("rulesPopup").style.display == "flex";
        textToSpeechEng('Close Rules');
        document.getElementById("RulesModal").style.display = "none";
    }
});

document.getElementById("rulesCloseBtn").addEventListener("click", () => {
    document.getElementById("toggle-rules").textContent = "📜View Rules"
    textToSpeechEng('Close Rules');
    document.getElementById("RulesModal").style.display = "none";
});

function showRules() {
    let rule = document.getElementById("RulesBox");
    rule.style.textAlign = "left";
        rule.innerHTML = `<h2>Connect 3 General Rules</h2><br>
        <b>Game Setup:</b><br>
    <br>
    <b>Grid Size:</b> Click on Grid size to choose Grid size between 3 to 20.<br>

    <b>Palyer V/s:</b> Click on <b>Palyer V/s Player</b> to choose Play against Other player. When play with other player it will ask name of other player to save in leadderboard<br> or Choose <b>Palyer V/s Computer</b> to play against Computer<br>

    <b>Level:</b> Click on level to choose levels. there are 3 leves (levels are only used when play against computer In this game, difficulty levels like Easy, Medium, and Hard act as rule sets that modify the game's challenge<b>Easy:</b>/Medium/Hard</b> <b>Easy (Beginner):</b>This mode is designed for players who are new to game or those who want to enjoy/learn game. Novice game, computer moves randomly at any empty place.<br>
    <b>Medium / Normal Mode (Balanced):</b>This mode is designed for players who are new to game or those who want to play for enjoy and win game. It provides a fair challenge. Computer moves such a way to stop player to win easily.<br>
    <b>Hard:</b>This mode is designed for experienced players who have mastered the game mechanics. Computer moves such a way to stop player to win and also try to win.<br>

        this game is very similer to <b>TIC TAC TOE</b> but it has more the 9 square (more then 3 rows and more 3 column)<br> 
        3 in a row rules are simple and straightforward. It is precisely their simplicity that makes finding the solution and solving these puzzles a true challenge.<br>
        <br>
        To play, the player only needs to be familiar with the X & O and be able to think logically.<br><b>The goal of this game is clear:</b> 3 in a  row X or O in a row fill straight line — either horizontally, vertically, or diagonally.<br> The challenging part lies in the restrictions imposed on the player to be able to fill in the grid.<br>

        <b>How to Play<b><br>
        <b>Players and Board:<b> The game is for two players, typically assigned the symbols 'X' and 'O'. A grid is drawn, which has more then spaces (a square grid). <br>
        the availabe grid size is <br>
        3x3 = 9 square (similar to tic tac toe)<br>
        4x4 = 16 square<br>
        5x5 = 25 square<br>
        6x6 = 36 square<br>
        7x7 = 49 square<br>
        8x8 = 64 square<br>
        9x9 = 81 square<br>
        10x10 = 100 square<br>

        <b>Taking Turns:<b> Players alternate placing their symbol (X or O) in an empty square on the grid. <br>
        <b>Winning:<b> The first player to successfully place three of their symbols in a straight <br>line — either horizontally, vertically, or diagonally—wins the game. <br>
        <b>Drawing:<b> If all spaces on the grid are filled, and no player has achieved three in a row, the game ends in a tie, draw or "cat's game"<br>
        <br>
        <b>Play Against Computer:<b> a single play can play against computer<br>
        <br>
        <b>level of games:<b> if play against computer it has three level<br>
        <b>easy:<b> computer will play randomly in empty space<br>
        <b>medium:<b> Computer will play to stop you win easily<br>
        <b>hard:<b> Computer will also try to win game<br>`;
    document.getElementById("rulesPopup").style.display = "block";
}

export function hideRules() {
    textToSpeechEng('Close Rules');
    document.getElementById("rulesPopup").style.display = "none";
    document.getElementById("toggle-rules").textContent = "📜View Rules";
}