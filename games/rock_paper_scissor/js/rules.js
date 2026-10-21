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
    rule.innerHTML = `<p>Rock Paper Scissors is the ultimate game of quick decisions and psychological warfare. While the rules are purely mathematical, the strategy is entirely human, relying on probability and reading your opponent’s behavior.</p>
    <p><b>The Core Rules</b><br></p>
    <p>The game uses a simple, three-way circular hierarchy where every choice has exactly one counter:<br></p>
    <p><u>Rock</u> (👊) crushes Scissors.<br></p>
    <p><u>Paper</u> (✋) covers Rock.<br></p>
    <p><u>Scissors</u> (✌️) cut Paper.<br></p>
    <p>The Loop: If both players throw the same gesture, it is a tie, and the round is replayed immediately. Matches are typically played as a Best-of-3 or Best-of-5 series.<br></p>
    <p>
    <p><u>Starting the Game:</u> Black moves first, followed by players alternating turns.<br></p>
    <p><u>Making a Move:</u> A player must place a piece with their colour. facing up so that at least one of the opponent’s pieces is trapped (sandwiched) in a straight line (horizontally, vertically, or diagonally).<br></p>
    <p><u>Flipping Discs:</u> All of the opponent's pieces directly sandwiched by the newly placed piece and another piece of the same colour. must be flipped to the player’s colour.<br></p>
    <p><u>Multiple Lines:</u> A single move can flip pieces along multiple rows, columns, or diagonals simultaneously.<br></p>
    <p><u>Passing Turns:</u> If a player cannot make a valid move that flips at least one piece, they must pass their turn.<br></p>
    <p><u>Game End:</u> The game ends when the board is filled or neither player can make a legal move.<br></p>
    <p><b>Key Guidelines</b><br></p>
    <p>If a move is available, it must be played; you cannot voluntarily pass.<br>
    Once a piece is placed on a square, it can never be moved to another square later in the game.<br>
    If a player runs out of discs, the opponent is the winner of the game.<br>
    Corners are extremely valuable because, once placed, they can never be flipped or outflanked.<br></p> 
    <p><b>Winning the Game</b><br></p>
    The player with the highest number of disc of their colour facing up. on the board at the end of the game wins.<br>
    If the game ends in a tie (32 pieces each), the result is a draw.<br>
    If a player runs out of discs (no disc on board), the opponent is the winner of the game.<br></p>
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
        <u>Sharing:</u> this button used to share the current game link to any one on Facebook/tweeter/Instagram/WhatsApp/email etc.<br>
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
        
    
    <h2><b>🧠 Winning Strategies (Psychological & Statistical)</b><br></p>
    <p>While the game seems like random chance, human psychology makes it highly predictable. Decades of competitive data (including studies by the World RPS Society) have revealed distinct patterns you can exploit:<br></p>
    <p>>u>1. The "Win-Stay, Lose-Shift" Rule (The Golden Strategy)</u><br></p>
    <p>Subconsciously, humans tend to repeat actions that bring success and abandon actions that cause failure. You can use this to predict your opponent's exact next move:<br></p>
    <p>If your opponent just WON a round: They are highly likely to throw the exact same sign again.<br></p>
    <p><u>Your counter:</u> Throw the sign that beats what they just used. (e.g., If they won with Rock, they will likely throw Rock again → You throw Paper).<br></p>
    <p><u>If your opponent just LOST a round:</u> They will almost always switch to a different sign. Usually, they subconciously switch to the sign that would have beaten your winning move.<br></p>
    <p><u>Your counter:</u> Anticipate this shift and throw the sign that beats their expected change.<br></p>
    <p><u>2. The "Rock" Bias in Beginners<u><br></p>
    <p>Statistically, casual or inexperienced male players open with Rock far more than any other option. This is because rock feels solid, powerful, and aggressive.<br></p>
    <p><u>The Counter:</u> Open your very first round of a casual match with Paper. It gives you a statistical edge right out of the gate.<br></p>
    <p><u>3. Look for the "Double" (The Repeat Trap)</u><br></p>
    <p>If your opponent throws the same sign twice in a row (e.g., Rock, then Rock again), they are highly unlikely to throw it a third time because it feels too predictable to them.<br></p>
    <p><u>The Counter:<u> If they throw Rock twice, assume their next move is either Paper or Scissors. By throwing Scissors, you will either win (against Paper) or tie (against Scissors), completely eliminating the risk of a loss.<br></p>
    <p><u>4. Telegraphing and Physical Cues</u><br></p>
    <p>Watch your opponent's hand tension as they pump their fist during the countdown:<br></p>
    <p>A tightly balled, tense fist often means they are committed to throwing Rock.<br></p>
    <p>A loose, slightly relaxed hand usually indicates they are preparing to transition into Paper or Scissors.<br></p>`;

    
    let ButtonBox = document.getElementById("ButtonBox");
    ButtonBox.style.textAlign = "left";
    // all rules are write here with required HTML tegs
    ButtonBox.innerHTML = `<p><u>1. Level:</u> level easy/medium/hard.<br></p><p>
    <u>2. New Game:</u> This will display 8×8 uncheckered board with four discs placed in a cross pattern in the center of the board (two Black, two White, alternating diagonally). the time is also start.<br></p>
    <p><u>3. Undo:</u>Player can undo last disc play by player or by computer.<br></p>
    <p><u>4. UI Theme:</u> this is toggle button for changing theme between light and dark theme.<br><br></p>
    <p><u>5. Music:</u> this is also toggle button to stop and play background music during game play.<br><br></p>
    <p><u>6. View Rules:</u> This also toggle button to view and hide rules (current window).<br><br></p>
    <p><u>7. Global leaderboard:</u> This toggle button to show and hide Global leaderboard (all any one who play and win).<br><br></p>
    <p><u>8. Local leaderboard:</u> This toggle button to show and hide local leaderboard (The games played and win on current device only).<br><br></p>
    <p><u>9. Sharing:</u> this button used to share the current game link to any one on Facebook/tweeter/Instagram/WhatsApp/email etc.<br><br></p>
    <p><u>10. Home:</u> Press this button bring you to Home screen (all game list) of Ravindra Games Hub. this will also loose your current game.<br><br></p>
    <p><u>11. Feedback:</u> it will open feedback window to submit comments/feedback/suggestions/like/dislike/rating/report about the game/app/site etc.<br><br></p>
    <p><u>12. Pause:</u> Press pause button pause game, it also pause timer also. but player cant think about game because it covered.<br><br></p>
    <p><u>13. Resume:</u> Press Resume button resume pause game, it also start timer also and game board is uncovered for play.<br><br></p>
    <p><u>12. Information display:</u> display area where the display no of black and white disc on game board and elapsed time of game play.<br></p>
    <p><u>12. Game board:</u> Click/Tap any game board box to place disc on empty square. yellow dots are indicates player valid moves.<br></p>
    `;

    let HowtoPlayBox = document.getElementById("HowtoPlayBox");
    HowtoPlayBox.style.textAlign = "left";
    // all rules are write here with required HTML tegs
    HowtoPlayBox.innerHTML = `<p>1. select Level and Theme then press New Game buttons.<br></p>
    <p>2. click on yellow dot to place player (black) disc on square. All trapped opponent discs are then flipped to your black color<br></p>
    <p>3. now computer place disc on empty square and All trapped your discs are then flipped to your white color.<br></p>
    <p>4. Repeat step 2 until game over.<br></p>
    <p>5. Game over only when all square filled or both player have not legal move.<br></p>
            `;

    let GameFeatureBox = document.getElementById("GameFeatureBox");
    GameFeatureBox.style.textAlign = "left";
    // all rules are write here with required HTML tegs
    GameFeatureBox.innerHTML = `
    <p>Modern digital versions and premium physical editions of Reversi (Othello) elevate the basic 8×8 grid framework with deep analytical tools, multiplayer lobbies, and accessibility options designed to sharpen strategic thinking<br> <br></p>
    <p>
            <b>🎮 Board Configurations & Game Modes</b><br> This will display 8×8 uncheckered board with four discs placed in a cross pattern in the center of the board (two Black, two White, alternating diagonally).<br></p>
            <p><b>Algorithmic AI Difficulty Levels:-</b><br>easy/medium/hard, Single-player engines offer scaling difficulties ranging from casual training AI (which intentionally avoids corners) to professional-grade Neural Network engines that calculate dozens of moves ahead<br></p>
             <p><b>⏱️Varied Game Modes:</b><br></p>
             <p><u>Time Attack Mode:</u> Players flips more disc of opponent in minimum time of count up clock to get higher score.<br></p>
             <p><u>Endless / Relax Mode:</u> Player can play for casual practice layout without timers to encourage stress-free focus by ignoring the moves and timer.<br><br></p>
             <p><b>Move Assist & Validity Indicators:</b><br></p>
             <p>Visual highlights map out every legally available square (with yellow dots) on your turn.<br><p/>
            <p><b>🌙UI Themes:</b> Dark mode or customizable color profiles help limit digital eye strain during extended play sessions. <br><br></p>
            <p><b>🔊Audio Engineering:</b> Built-in sound effects provide distinct auditory cues for successful matches or mismatches, with options to toggle music off for absolute silence. <br><br></p>
            <p><b>📊 Tracking & Social Features Stat Integration:</b> An interactive counter tracks ongoing Moves and active Stopwatch Timers right on the display.<br><br></p>
            <p><b>🏆Leaderboard Systems:</b> Scores are processed locally or globally to rank high-performing players by the lowest elapsed time or absolute cleanest move efficiency. <br><br></p>
            <p><b>📤Social Sharing Platforms:</b> Direct hooks allow players to share their high scores, challenge friends, or provide immediate development feedback.<br><br></p>
            <p><b>💬Feedback System:</b> it will open feedback window to submit comments/feedback/suggestions/like/dislike/rating/report about the game/app/site etc.<br></p>
            <p><b>Real-Time Disc Counters:</b> Dynamic UI counters track current discs counts alongside an integrated Match Progress that visually displays which color holds the majority board control.<br></p>
            `;


    let FeqBox = document.getElementById("FeqBox");
    FeqBox.style.textAlign = "left";
    // all rules are write here with required HTML tegs
    FeqBox.innerHTML = `<h3 class='slide-h3'>Is Ravindra Games Hub free?</h3>
            <p class='slide-p'>Yes, every game is free.</p>
            <h3 class='slide-h3'>Can I play offline?</h3>
            <p class='slide-p'>No, Reversi game need internet connection for play.
            <h3 class='slide-h3'>How many themes in website?</h3>
            <p>Two themes are available - Dark(Blue), Light(Orange) in website.</p>
            <h3 class='slide-h3'>Does my game lost in website?</h3>
            <p class='slide-p'>Your game is lost in website when home, Brower back/refresh button is pressed.</p>
            <h3 class='slide-h3'>When my game is resume in website?</h3>
            <p class='slide-p'>Your games is resume in website when leaderboard, feedback, theme, sharing, music and pause is clicked.</p>
            <h3 class='slide-h3'>Can two players play game?</h3>
            <p class='slide-p'>No. Reversi is individual player game.</p>
            <h3 class='slide-h3'>Can play game with AI?</h3>
            <p class='slide-p'>No. Riversi is individual player game, but other player is Itself AI </p>
            <h3 class='slide-h3'>Is games have different difficulty levels?</h3>
            <p class='slide-p'>Yes, Reversi games in app and website are 3 difficulty levels. Easy, Medium, Hard</p>
            `;

    document.getElementById("rulesPopup").style.display = "block";
}

export function hideRules() {
    textToSpeechEng('Close Rules');
    document.getElementById("rulesPopup").style.display = "none";
    document.getElementById("toggle-rules").textContent = "📜View Rules";
}


// showRules();