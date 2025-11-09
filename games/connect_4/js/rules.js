// these line are added in javascript file
import { textToSpeechEng } from './speak.js';

// Rules Toggle 
document.getElementById("toggle-rules").addEventListener("click", () => {
    if (document.getElementById("toggle-rules").textContent === "View Rules") {
        document.getElementById("toggle-rules").textContent = "Hide Rules";
        textToSpeechEng('Open Rules');
        showRules();
    } else {
        document.getElementById("toggle-rules").textContent = "View Rules"
        textToSpeechEng('Close Rules');
        document.getElementById("rulesPopup").style.display = "none";
    }
});
//hide rules
document.getElementById("hide-rules").addEventListener("click", () => {
    document.getElementById("toggle-rules").textContent = "View Rules"
    textToSpeechEng('Close Rules');
    document.getElementById("rulesPopup").style.display = "none";
});

// Rules Display
function showRules() {
    let rule = document.getElementById("RulesBox");
    rule.style.textAlign = "left";
    // all rules are write here with required HTML tegs
 


        rule.innerHTML = `<h2>Connect 3 General Rules</h2>
        this game is very similer to <b>TIC TAC TOE</b> but it has more the 9 square (more then 3 rows and more 3 column)<br> 
        Connect 3 rules are simple and straightforward. It is precisely their simplicity that makes finding the solution and solving these puzzles a true challenge.<br>
        <br>
        To play Connect 3, the player only needs to be familiar with the X & O and be able to think logically.<br><b>The goal of this game is clear:</b> connect 3 X or O in a row fill straight line — either horizontally, vertically, or diagonally.<br> The challenging part lies in the restrictions imposed on the player to be able to fill in the grid.<br>

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

// hide rules
export function hideRules() {
    textToSpeechEng('Close Rules');
    document.getElementById("rulesPopup").style.display = "none";
    document.getElementById("toggle-rules").textContent = "View Rules";
}