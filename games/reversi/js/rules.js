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

// Rules Display
function showRules() {
    let rule = document.getElementById("RulesBox");
    rule.style.textAlign = "left";
    // all rules are write here with required HTML tegs
    rule.innerHTML = `<h2>Reversi (or Othello) Game Rules</h2>
            <br>
            Reversi (or Othello) is a two-player strategy game played on a 
    
     board with 64 two-sided pieces (discs), black on one side and white on the other. <br>Players take turns placing a disc, aiming to "sandwich" opponent pieces to flip them to their colour. The game ends when no legal/valid moves remain, and the player with the most discs of their colour. facing up wins
        
        <h2>The Core Rules</h2>
        <b><u>Setup:</b></u> The game begins with four disc (2 white and 2 black) placed in the centre squares in a chequerboard pattern, with white on the top-left and bottom-right, and black on the top-right and bottom-left.<br>
        <b><u>Starting the Game:</b></u> Black moves first, followed by players alternating turns.<br>
        <b><u>Making a Move:</b></u> A player must place a piece with their colour. facing up so that at least one of the opponent’s pieces is trapped (sandwiched) in a straight line (horizontally, vertically, or diagonally).<br>
        <b><u>Flipping Discs:</b></u> All of the opponent's pieces directly sandwiched by the newly placed piece and another piece of the same colour. must be flipped to the player’s colour.<br>
        <b><u>Multiple Lines:</b></u> A single move can flip pieces along multiple rows, columns, or diagonals simultaneously.<br>
        <b><u>Passing Turns:</b></u> If a player cannot make a valid move that flips at least one piece, they must pass their turn.<br>
        <b><u>Game End:</b></u> The game ends when the board is filled or neither player can make a legal move.<br>
    
    <h2>Key Guidelines</h2>
        If a move is available, it must be played; you cannot voluntarily pass.<br>
        Once a piece is placed on a square, it can never be moved to another square later in the game.<br>
        If a player runs out of discs, the opponent is the winner of the game.<br>
        Corners are extremely valuable because, once placed, they can never be flipped or outflanked. 
     <h2>Winning the Game</h2>
        The player with the highest number of disc of their colour facing up. on the board at the end of the game wins.<br>
        If the game ends in a tie (32 pieces each), the result is a draw.<br>
        If a player runs out of discs (no disc on board), the opponent is the winner of the game.
        <h2>How to Play</h2>
        1. select level and press new game buttons to start game.<br>
        2. In starting four disc (2 white and 2 black) placed in the centre squares in a chequerboard pattern, with white on the top-left and bottom-right, and black on the top-right and bottom-left.<br>
        2. Player (black) turn first, the yellow dots are display indicate valid moves for player, player can play only in that square by click/tap.<br>
        3. As player click/tap at least one disc of the opponent’s (computer) or all disc are trapped (sandwiched) in a straight line (horizontally, vertically, or diagonally).<br>
        4. After player turn computer turn, computer place new disc and again at least one disc of the opponent’s (player) or all disc are trapped (sandwiched) in a straight line (horizontally, vertically, or diagonally).<br>
        5. process continue till end of game.<br>
        6. if no valid move for player/computer the turn passed to opponent automatically.
        <h2><b>Buttons used in the game</b></h2>
        <u>Easy:</u> computer think 2 turn depth<br>
        <u>Medium:</u> computer think 4 turn depth<br>
        <u>Hard:</u> computer think 6 turn depth<br>
        <u>New Game:</u> This will setup game board to play. the timer is also start.<br>
    

        <u>Theme:</u> this is toggle button for changing theme between light and dark theme.<br>
        <u>Music:</u> this is also toggle button to stop and play background music during game play.<br>
        <u>View Rules:</u> This also toggle button to view and hide rules (current window).<br>
        <u>Global leaderboard:</u> This toggle button to show and hide Global leaderboard (all any one who play and win).<br>
        <u>Local leaderboard:</u> This toggle button to show and hide local leaderboard (The games played and win on you current device only).<br>
        <u>Sharing:</u> this button used to share the current game link to any one on facebook/tweeter/instgram/whatapp/email etc.<br>
        <u>Home:</u> Press this button bring you to Home screen (all game list) of Ravindra Games Hub. this will also loose your current game.<br>
        <u>Feedback:</u> it will open feedback window to submit comments/feedback/suggestions/like/dislike/rating/report about the game/app/site etc.<br>
        <u><b>Black</b></u>This box display count <u>black</u> disc on game board<br>
        <u><b>White</b></u>This box display count <u>white</u> disc on game board<br>
        <u>Pause:</u> This button will stop timer till resume button is pressed. you cannot play puzzle in pause mode.<br>
        <u>Resume:</u> This button resume current game, timer will start.<br>
        <u>Timer:</u> This display the elapsed time of current game play excluding pause time<br>
        <u>Information window:</u>This window display the game status and action to be taken by player during the game play.<br><br>
        <b><u>play:</b></u><br>    1. select level and press new buttons to start game.<br>
        2. Player click/tap at yellow dots available on game board are valid moves and least one disc of the opponent’s or all disc are trapped (sandwiched) in a straight line (horizontally, vertically, or diagonally).<br>
        3. if no yellow dots available on game board then player turn pass automatically.<br><br>
        `;
    document.getElementById("rulesPopup").style.display = "block";
}

export function hideRules() {
    textToSpeechEng('Close Rules');
    document.getElementById("rulesPopup").style.display = "none";
    document.getElementById("toggle-rules").textContent = "📜View Rules";
}


// showRules();