import { textToSpeechEng } from './speak.js';

document.getElementById("toggle-rules").addEventListener("click", () => {
    if (document.getElementById("rulesPopup").style.display == "none") {
        document.getElementById("rulesPopup").style.display == "flex";
        textToSpeechEng('Open Rules');
        showRules();
    } else {
        // document.getElementById("rulesPopup").style.display == "flex";
        textToSpeechEng('Close Rules');
        document.getElementById("rulesPopup").style.display = "none";
    }
});

document.getElementById("rulesCloseBtn").addEventListener("click", () => {
    document.getElementById("toggle-rules").textContent = "📜View Rules"
    textToSpeechEng('Close Rules');
    document.getElementById("rulesPopup").style.display = "none";
});

function showRules() {
    let rule = document.getElementById("RulesBox");
    rule.style.textAlign = "left";
        rule.innerHTML = `<h2>5 in A Row General Rules</h2>
        this game is very similer to <b>TIC TAC TOE</b> but it has more the 9 square (more then 6 rows and more 6 column)<br> 
        5 in a row rules are simple and straightforward. It is precisely their simplicity that makes finding the solution and solving these puzzles a true challenge.<br>
        <br>
        To play 5 in  a row, the player only needs to be familiar with the X & O and be able to think logically.<br><b>The goal of this game is clear:</b> 5 in a row X or O in a row fill straight line — either horizontally, vertically, or diagonally.<br> The challenging part lies in the restrictions imposed on the player to be able to fill in the grid.<br>

        <b>How to Play</b><br>
        <b>Players and Board:</b> The game is for two players, typically assigned the symbols 'X' and 'O'. A grid is drawn, which has more then spaces (a square grid). <br>
        the availabe grid size is <br>
        5x5 = 25 square<br>
        6x6 = 36 square<br>
        7x7 = 49 square<br>
        8x8 = 64 square<br>
        9x9 = 81 square<br>
        10x10 = 100 square<br>
        11x11 = 121 square<br>
        12x12 = 144 square<br>
        13x13 = 169 square<br>
        14x14 = 196 square<br>
        15x15 = 225 square<br>
        16x16 = 256 square<br>
        17x17 = 289 square<br>
        18x18 = 324 square<br>
        19x19 = 361 square<br>
        20x20 = 400 square<br>

        <b>Taking Turns:</b> Players alternate placing their symbol (X or O) in an empty square on the grid. <br>
        <b>Winning:</b> The first player to successfully place five of their symbols in a straight <br>line — either horizontally, vertically, or diagonally—wins the game. <br>
        <b>Drawing:</b> If all spaces on the grid are filled, and no player has achieved five in a row, the game ends in a tie, draw or "cat's game"<br>
        <br>
        <b>Play Against Computer:</b> a single play can play against computer<br>
        <br>
        <b>level of games:</b> if play against computer it has three level<br>
        <b>easy:</b> computer will play randomly in empty space<br>
        <b>medium:</b> Computer will play to stop you win easily<br>
        <b>hard:</b> Computer will also try to win game<br>
        <br>
        <b>Buttons used in the game</b><br><br>
<u>Grid Size:</u> This dropdown menu to select grid size of puzzle. lesser the grid size easy the difficulty and more harder the difficulty.<br>
<u>Level Button:</u>This dropdown menu to select grid size of puzzle, the levels are Easy/Medium/Hard, level are only when play against Computer. It no effect when both player ar human.<br>
<u>Easy:</u> Computer place mark at random empty position only, nither stop to win nor try to win<br>
<u>Medium:</u> Computer place mark at random empty but stop to win other player<br>
<u>Hard:</u> Computer place mark at random empty but stop to win and also try win the game<br>
<u>New Game:</u> This will display grid with empty square board to play. the time is also start. When you again press it the current board placess marks was removed and new empty grid borad is displayed. the time is also restart. <br>
<u>undo:</u> Undo the cell filled by you. By pressing this button again an again it will remove cell filled last by you continue till all filled cell are removed from game board. unnecessary press undo will also reduce your score.<br>
<u>Player vs Computer</u>This dropdown menu to select two player game or single player play computer<br>
<u>Theme:</u> this is toggle button for changing theme between light and dark theme.<br>
<u>Sound:</u> this is also toggle button to stop and play background music during game play.
<u>View Rules:</u> This also toggle button to view and hide rules (current window).<br>
<u>Global leaderboard:</u> This toggle button to show and hide Global leaderboard (all any one who play and win).<br>
<u>Local leaderboard:</u> This toggle button to show and hide local leaderboard (The games played and win on you current device only).<br>
<u>Sharing:</u> this button used to share the current game link to any one on facebook/tweeter/instgram/whatapp/email etc.<br>
<u>Home:</u> Press this button bring you to Home screen (all game list) of Ravindra Games Hub. this will also loose your current game.<br>
<u>Feedback:</u> it will open feedback window to submit comments/feedback/suggestions/like/dislike/rating/report about the game/app/site etc.<br>
Information window display the filled/empty cell and time during the game play.
<u>Timer:</u> this will diplay the elapsed time of current game.<br>
<u>Message:</u> display various message/instruction during game play. <br>
<br>
<b><u>play:</b></u><br> 1. select grid size and level and pres new buttons.<br>
2. Click place mark X/O in squre, turn by turn n empty squre.<br>
`;
    document.getElementById("rulesPopup").style.display = "block";
}

export function hideRules() {
    textToSpeechEng('Close Rules');
    document.getElementById("rulesPopup").style.display = "none";
    document.getElementById("toggle-rules").textContent = "📜View Rules";
}