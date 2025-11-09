// these line are added in javascript file
import { textToSpeechEng } from './speak.js';

// toggle Rules Listener
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
    rule.innerHTML = `<h2>Sudoku Rules</h2>
    Sudoku rules are simple and straightforward. It is precisely their simplicity that makes finding the solution and solving these puzzles a true challenge.<br>
    <br>
    To play Sudoku, the player only needs to be familiar with the numbers from 1 to 9 & A to Z and be able to think logically.<br><b>The goal of this game is clear:</b> to fill and complete the grid using the numbers from 1 to 9 & A to Z. The challenging part lies in the restrictions imposed on the player to be able to fill in the grid.<br>
    <br>
    <b>Rule 1</b> - Each row must contain the numbers from 1 to 9& A to Z, without repetitions
    The player must focus on filling each row of the grid while ensuring there are no duplicated numbers/alphabes. The placement order of the digits is irrelevant.<br>
    <br>
    Every puzzle, regardless of the difficulty level, begins with allocated numbers on the grid. The player should use these numbers as clues to find which digits are missing in each row.<br>
    <br>
    <b>Rule 2</b> - Each column must contain the numbers from 1 to 9 & A to Z, without repetitions
    The Sudoku rules for the columns on the grid are exactly the same as for the rows. The player must also fill these with the numbers from 1 to 9 & A to Z, making sure each digit occurs only once per column.<br>
    <br>
    The numbers allocated at the beginning of the puzzle work as clues to find which digits are missing in each column and their position.<br>
    <br>
    <b>Rule 3</b> - The digits can only occur once per block (nonet)<br>
    A regular 9 x 9 grid is divided into 9 smaller blocks of 3 x 3, also known as nonets. The numbers from 1 to 9 can only occur once per nonet.<br>
    <b>Other Grid size</b> nonet are as under<br>
                1 Grid Size 25x25 [nonets grid 5x5]<br>
                2 Grid Size 24x24 [nonets grid 4x6]<br>
                3 Grid Size 22x22 [nonets grid 11x2]<br>
                4 Grid Size 21x21 [nonets grid 7x3]<br>
                5 Grid Size 20x20 [nonets grid 5x4]<br>
                6 Grid Size 18x18 [nonets grid 6x6]<br>
                7 Grid Size 16x16 [nonets grid 4x4]<br>
                8 Grid Size 15x15 [nonets grid 5x3]<br>
                9 Grid Size 14x14 [nonets grid 7x2]<br>
                10 Grid Size 12x12 [nonets grid 4x3]<br>
                11 Grid Size 10x10 [nonets grid 5x2]<br>
                12 Grid Size 9x9 [nonets grid 3x3]<br>
                13 Grid Size 8x8 [nonets grid 4x2]<br>
                14 Grid Size 6x6 [nonets grid 3x2]<br>
                15 Grid Size 4x4 [nonets grid 2x2]<br>
                <br>
    In practice, this means that the process of filling the rows and columns without duplicated digits finds inside each block another restriction to the numbers’ positioning.<br>
    <br>
    <b>Rule 4</b> - The sum of every single row, column, and nonet must equal 45<br>
    To find out which numbers are missing from each row, column, or block or if there are any duplicates, the player can simply count or flex their math skills and sum the numbers. When the digits occur only once, the total of each row, column, and group must be 45.<br>
    <br>
    <b>Other Grid size</b> of sudoku sum of every single row, column, and nonet must equal as under:<br>
    1+2+3+4+5+6+7+8+9+10+11+12+13+14+15+16+17+18+19+20+21+22+23+24+25 = 325<br>
    1+2+3+4+5+6+7+8+9+10+11+12+13+14+15+16+17+18+19+20+21+22+23+24 = 300<br>
    1+2+3+4+5+6+7+8+9+10+11+12+13+14+15+16+17+18+19+20+21+22 = 253<br>
    1+2+3+4+5+6+7+8+9+10+11+12+13+14+15+16+17+18+19+20+21 = 231<br>
    1+2+3+4+5+6+7+8+9+10+11+12+13+14+15+16+17+18+19+20 = 210<br>
    1+2+3+4+5+6+7+8+9+10+11+12+13+14+15+16+17+18 = 171<br>
    1+2+3+4+5+6+7+8+9+10+11+12+13+14+15+16 = 136<br>
    1+2+3+4+5+6+7+8+9+10+11+12+13+14+15 = 120<br>
    1+2+3+4+5+6+7+8+9+10+11+12 = 78<br>
    1+2+3+4+5+6+7+8+9+10+11 = 66<br>
    1+2+3+4+5+6+7+8+9+10 = 55<br>
    1+2+3+4+5+6+7+8+9= 45<br>
    1+2+3+4+5+6+7+8 = 36<br>
    1+2+3+4+5+6 = 21<br>
    1+2+3+4 = 10<br>
    <br>
    <br>to make number single digit alphabest are used instead number<br>
    <br>
    Other details to take into consideration<br>
    <b>1. Each puzzle has a unique solution</b><br>
    Each Sudoku puzzle has only one possible solution that can only be achieved by following the Sudoku rules correctly.<br>
    <br>
    Multiple solutions only occur when the puzzle is poorly designed or, the most frequent reason, when the player makes a mistake in its resolution and a duplicate is hidden somewhere on the grid.<br>

    <b>2. Guessing is not allowed</b><br>
    Trying to guess the solution for each cell is not allowed under Sudoku rules. These are logical number puzzles.<br>
    <br>
    The numbers allocated at the beginning of the game are the only clues the player needs to solve the grid.<br>
    <br>
    <b>3. Notes and techniques</b><br>
    Writing down the numbers that are candidates for each cell is allowed by Sudoku rules and is even encouraged. These help the player keep track of their progress and keep their reasoning organized and clear.<br>
    <br>
    As the difficulty level of these puzzles increases, these notes also become essential to apply the advanced solving techniques required to complete the grid.<br>`;

    // rule.innerHTML = `<h2>Connect 3 General Rules</h2>
    //     this game is very similer to <b>TIC TAC TOE</b> but it has more the 9 square (more then 3 rows and more 3 column)<br> 
    //     Connect 3 rules are simple and straightforward. It is precisely their simplicity that makes finding the solution and solving these puzzles a true challenge.<br>
    //     <br>
    //     To play Connect 3, the player only needs to be familiar with the X & O and be able to think logically.<br><b>The goal of this game is clear:</b> connect 3 X or O in a row fill straight line — either horizontally, vertically, or diagonally.<br> The challenging part lies in the restrictions imposed on the player to be able to fill in the grid.<br>

    //     <b>How to Play<b><br>
    //     <b>Players and Board:<b> The game is for two players, typically assigned the symbols 'X' and 'O'. A grid is drawn, which has more then spaces (a square grid). <br>
    //     the availabe grid size is <br>
    //     3x3 = 9 square (similar to tic tac toe)<br>
    //     4x4 = 16 square<br>
    //     5x5 = 25 square<br>
    //     6x6 = 36 square<br>
    //     7x7 = 49 square<br>
    //     8x8 = 64 square<br>
    //     9x9 = 81 square<br>
    //     10x10 = 100 square<br>

    //     <b>Taking Turns:<b> Players alternate placing their symbol (X or O) in an empty square on the grid. <br>
    //     <b>Winning:<b> The first player to successfully place three of their symbols in a straight <br>line — either horizontally, vertically, or diagonally—wins the game. <br>
    //     <b>Drawing:<b> If all spaces on the grid are filled, and no player has achieved three in a row, the game ends in a tie, draw or "cat's game"<br>
    //     <br>
    //     <b>Play Against Computer:<b> a single play can play against computer<br>
    //     <br>
    //     <b>level of games:<b> if play against computer it has three level<br>
    //     <b>easy:<b> computer will play randomly in empty space<br>
    //     <b>medium:<b> Computer will play to stop you win easily<br>
    //     <b>hard:<b> Computer will also try to win game<br>`;
    document.getElementById("rulesPopup").style.display = "block";
}

// hide rules
export function hideRules() {
    textToSpeechEng('Close Rules');
    document.getElementById("rulesPopup").style.display = "none";
    document.getElementById("toggle-rules").textContent = "View Rules";
}