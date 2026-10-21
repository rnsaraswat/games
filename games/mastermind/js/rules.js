import { textToSpeechEng } from './speak.js';

document.getElementById("toggle-rules").addEventListener("click", () => {
    if (document.getElementById("rulesPopup").style.display == "none") {
        document.getElementById("rulesPopup").style.display == "flex";
        textToSpeechEng('Open Rules');
        showRules();
    } else {
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
    rule.innerHTML = `<p>The game relies on a strict feedback loop between a guess and structural hints.<br></p>
    <p><b>The Setup:</b>The Codemaker(computer) secretly selects no of colored pegs and places them behind a shield as per selected number slots/pegs, number of colors and Duplicate colors allowed or not.<br></p>
    <p><b>Slots/Pegs:</b> Click on no of slots/Pegs to choose slots/pegs between 1 to 12. Slots/pegs should be > 0 and <= 12 and also slots/pegs <= no of colors<br></p>
    <p><b>Colors:</b> Click on no of Colors to choose Colors between 1 to 20. Colors should be > 0 and <= 20 and also Colors >= no of slots<br></p>
    <p><b>Allow Duplicate colors:</b> Click to tick ☑ for duplicate Colors allowed or untick ◻ duplicate Colors not allowed. duplicates allowed is harder the Duplicate not allowed.<br></p>
    <p><b>Players:</b> Two (Code Maker & Code Breaker). In Ravindra games hub player is Code breaker and other player is Computer (Code maker).<br></p>
    <p><b>Board:</b> Placed between players with the Code Shield facing the Maker.<br></p>
    <p><b>Computer (Code Maker):</b> Secretly places colored pegs in the slots/pegs (as per duplicates allowed or not) and covers with the shield (show ? only).<br><br></p>
<p><b>Gameplay</b><br><br></p>
<p><b>Guess:</b> Click on white circle to open submenu of colors to choose colors. the click on submenu colors to choose. You (Code Breaker) places your guess colored pegs in the first row (closest to them) as their guess. After select/choose all slots/pegs Colors click to submit button to submit toy guess.<br></p>
<p><b>Feedback:</b> The Computer (Code Maker) uses key pegs to give clues: <br></p>
<p><b>Black Key Peg:</b> Right color, right position (no indication of which peg). <br></p>
<p><b>White Key Peg:</b> Right color, wrong position (no indication). <br></p>
<p><b>No Peg:</b> guess Color not in the code. <br><br></p>
<p><b>Deduce:</b> The Code Breaker uses the feedback to make a more informed guess in the next row, using logic.<br></p>
<p><b>Repeat:</b> Steps game play steps continue until the code is cracked or all rows are used.<br><br></p>
<p><b>Winning</b><br><br></p>
<p><b>Game Over:</b> if black key pegs equal to no of Slots/pegs then code is cracked by player and game over. if no of attempt remain zero and black key pegs not equal to no of Slots/pegs then code is not cracked by player and game over.<br></p>
<p><b>You (Code Breaker) wins:</b> By guessing the code in the fewest possible turns (max number attempt).<br></p>
<p><b>Computer (Code Maker) wins:</b> If the You (Code Breaker) runs out of attempts(guesses) before cracking the code.<br></p>


<h2>🧠 Winning Strategies<br></h2>
<p>Because Mastermind is a game of pure logical elimination, you can use mathematical frameworks to guarantee a win in 5 moves or fewer.<br></p>
<p><b>1. The Phase Separation Method</b><br></p>
<p><b<Break the game into two clear objectives:</b> first find the colors, then find the positions.<br></p>
<p><u>Step 1:</u> Dedicate your first two rows to filtering down colors. Guess Color A / Color A / Color B / Color B on turn one, followed by Color C / Color C / Color D / Color D on turn two.<br></p>
<p><u>The Benefit:</u> This immediately tells you exactly how many pegs of those four colors exist in the final code, drastically shrinking the pool of possibilities.<br></p>
<p><b>2. The Powerful "All-One-Color" Opener</b><br></p>
<p>A popular alternative approach is to fill the entire first row with just one color (e.g., Red / Red / Red / Red).<br></p>
<p><u>How it helps:</u> The number of key pegs you receive tells you exactly how many times that color appears in the hidden code. If you get zero pegs, you have permanently eliminated that color from the game board.<br></p>
<p><b>3. Minimax Strategy</b><br></p>
<p>Computer scientist Donald Knuth proved that the optimal mathematical opener for a 4-hole, 6-color game is Color A / Color A / Color B / Color B (e.g., Red / Red / Blue / Blue).<br></p>
<p><u>For subsequent turns</u>, pick a guess that minimizes the worst-case number of remaining code options. Even if a guess is impossible based on your prior hints, playing it can sometimes isolate the correct colors faster than guessing a valid code.<br></p>
<p><b>4. The Shift Test</b><br></p>
<p>Once you know a color is in the code but don't know where, keep that color in the same spot for one turn while altering the rest, or deliberately shift it one space to the right on your next turn. Watch how the black/white peg counts react to isolate its exact coordinate.<br></p>
`;

    let ButtonBox = document.getElementById("ButtonBox");
    ButtonBox.style.textAlign = "left";
    // all rules are write here with required HTML tegs
    ButtonBox.innerHTML = `
<p><b>1. Slots/Pegs:</b> Click on no of slots/Pegs to choose slots/pegs between 1 to 12. Slots/pegs should be > 0 and <= 12 and also slots/pegs <= no of colors<br></p>
<p><b>2. No of Colors:</b> Click on no of Colors to choose Colors between 1 to 20. Colors should be > 0 and <= 20 and also Colors >= no of slots<br></p>
<p><b>3. Maximum Attempt:</b> Click on maximum attempt to finish game within limited attempt other wise lose game.<br></p>
<p><u>4. New Game:</u> This will display game slots according to difficulty level. the time is also start.<br></p>
<p>As game start this button renamed as "End" and used to end the game by face up all tiles and player loses.<br><br></p>
<p><u>5. Level:</u> display level according to selected slots/colors,<br></p>
<p>The different levels like very easy/easy/medium/hard/expert.<br></p>
<p>the level/size(no of card/tiles) as under:-<br></p>
<p>very easy - slots < 3 and colors < 4.<br></p>
<p>easy - slots < 5 and colors < 7.<br></p>
<p>medium - slots < 7 and colors < 9.<br></p>
<p>hard - slots < 9 and colors < 16.<br></p>
<p>expert - slots < 11 and colors > 16.<br><br></p>
<p><b>6. Allow Duplicate colors:</b> Click to tick ☑ for duplicate Colors allowed or untick ◻ duplicate Colors not allowed. duplicates allowed is harder the Duplicate not allowed.<br></p>
<p><u>7. Undo:</u> undo last guess submitted bay player.<br></p>
<p><u>8. End:</u> End button end the game and open the shield of secret colors and display them. Player lose the game<br></p>
<p><u>4. UI Theme:</u> this is toggle button for changing theme between light and dark theme.<br><br></p>
<p><u>5. Music:</u> this is also toggle button to stop and play background music during game play.<br><br></p>
<p><u>6. View Rules:</u> This also toggle button to view and hide rules (current window).<br><br></p>
<p><u>7. Global leaderboard:</u> This toggle button to show and hide Global leaderboard (all any one who play and win).<br><br></p>
<p><u>8. Local leaderboard:</u> This toggle button to show and hide local leaderboard (The games played and win on current device only).<br><br></p>
<p><u>9. Sharing:</u> this button used to share the current game link to any one on Facebook/tweeter/Instagram/WhatsApp/email etc.<br><br></p>
<p><u>10. Home:</u> Press this button bring you to Home screen (all game list) of Ravindra Games Hub. this will also loose your current game.<br><br></p>
<p><u>11. Feedback:</u> it will open feedback window to submit comments/feedback/suggestions/like/dislike/rating/report about the game/app/site etc.<br><br></p>
<p><u>12. Information display:</u> display area where the No of attempt left and elapsed time of the game play.<br></p>
<p><u>12. Game board slots/pegs:</u> Click/Tap any game board slots/pegs it display popup of colors. click on popup color to fill it in slots/pegs.<br></p>
`;

    let HowtoPlayBox = document.getElementById("HowtoPlayBox");
    HowtoPlayBox.style.textAlign = "left";
    // all rules are write here with required HTML tegs
    HowtoPlayBox.innerHTML = `<p>1. select number slots.<br></p>
<p>2. Select no of colors<br></p>
<p>3. Select Maximum Attempt<br></p>
<p>4. Check / uncheck to select duplicate colors allowed or not<br></p>
<p>5. Check new game button to start game it display game board slots and start timer<br></p>
<p>6. click on peg to display pop of available colors.<br></p>
<p>7. click on colors to select and fill in clicked slots.<br></p>
<p>8. Repeat step 6 and 7 until all slots are filled with colors.<br></p>
<p>9. click on submit button to submit your guess. it will display guess colors and result of your guess in feedback slots with black/white pegs or no pegs<br></p>
<p>10. Repeat step 6 to 9 until all click on submit button to submit your guess. it will display guess colors and result of your guess in feedback slots with black/white pegs or no pegs<br></p>
<p>11. Press "End" to end game and open the shield of secret colors and display them. Player lose the game.<br></p>
        `;

    let GameFeatureBox = document.getElementById("GameFeatureBox");
    GameFeatureBox.style.textAlign = "left";
    // all rules are write here with required HTML tegs
    GameFeatureBox.innerHTML = `
<p>Modern digital Mastermind games featured on Ravindra Games Hub are designed to expand upon the simple, standard board layout of slots and colors. Integrate specific customization, accessibility, and gameplay features to enhance its logical deduction challenges.<br> <br></p>
<p>
        <b>🎮 Board Configurations, Game Modes and Level Scales:</b><br> Games scale from simple grids for quick casual play up to massive grids for a deep focus session.<br></p>
        <p><b>Adjustable Difficulty Layouts</b><br></p>
        <p>Digital variants allow players to scale the logic puzzle by altering the parameters::-<br></p>
         <p>    <u>Peg Counts:</u> - Standard boards use 4 holes, but advanced settings offer 5 or 6 holes for extreme difficulty. Ravindra games hub use 1 to 12 holes.<br></p>
         <p>    <u>Color Pool</u> - Options range from a casual 6-color palette up to an expert 8 or 10-color selection. Ravindra games hub use 1 to 20 color selection.<br></p>
         <p>    <u>Duplicates Toggle</u> - An options switch allowing or banning duplicate colors within the hidden code.<br></p>
         <p><b>⏱️Varied Game Modes:</b><br></p>
         <p>    <u>No of attempt Mode:</u> Player find hidden code all matches the code exactly (receiving all black pegs) with in limited no attempt.<br></p>
         <p>    <u>Time Attack Mode:</u> Players find hidden code all matches the code exactly (receiving all black pegs) with in minimum time of count up clock to get higher score.<br></p>
         <p>    <u>Endless / Relax Mode:</u> Player can play for casual practice layout without attempt limits or timers to encourage stress-free focus and find hidden code all matches the code exactly (receiving all black pegs) by ignoring the attempt and timer.<br><br></p>
         <b>🎨 Visual & Accessibility Features</b><br>
         <p><u>Visual & Customization Features Extensive Deck Themes:</u> Instead of traditional playing cards, boards feature diverse icon types to challenge multi-categorical retention.<br> </p>
        <p><b>🔊Audio Engineering:</b> Built-in sound effects provide distinct auditory cues for successful matches or mismatches, with options to toggle music off for absolute silence. <br><br></p>
        <p><b>📊 Tracking & Social Features Stat Integration:</b> An interactive counter tracks ongoing attempts and active Stopwatch Timers right on the display.<br><br></p>
        <p><b>🏆Leaderboard Systems:</b> Scores are processed locally or globally to rank high-performing players by the lowest elapsed time or absolute cleanest move efficiency. <br><br></p>
        <p><b>Color Blind Accessibility:</b>Standard colored pegs are enhanced with distinct internal numbers, making the game fully playable for individuals with color vision deficiencies<br><br></p>
        <p><b>📤Social Sharing Platforms:</b> Direct hooks allow players to share their high scores, challenge friends, or provide immediate development feedback.<br><br></p>
        <p><b>💬Feedback System:</b> it will open feedback window to submit comments/feedback/suggestions/like/dislike/rating/report about the game/app/site etc.<br></p>
        `;


    let FeqBox = document.getElementById("FeqBox");
    FeqBox.style.textAlign = "left";
    // all rules are write here with required HTML tegs
    FeqBox.innerHTML = `<h3 class='slide-h3'>Is Mastermind in Ravindra Games Hub free?</h3>
        <p class='slide-p'>Yes, every game is free.</p>
        <h3 class='slide-h3'>Can I play offline?</h3>
        <p class='slide-p'>No, Mastermind game need internet connection for play.
        <h3 class='slide-h3'>How many themes in website?</h3>
        <p>Two themes are available - Dark(Blue), Light(Orange) in website.</p>
        <h3 class='slide-h3'>Does my game lost in website?</h3>
        <p class='slide-p'>Your game is lost in website when home, Brower back/refresh button is pressed.</p>
        <h3 class='slide-h3'>When my game is resume in website?</h3>
        <p class='slide-p'>Your games is resume in website when leaderboard, feedback, theme, sharing, music and pause is clicked.</p>
        <h3 class='slide-h3'>Can two players play game?</h3>
        <p class='slide-p'>No. Mastermind is individual player game.</p>
        <h3 class='slide-h3'>Can play game with AI?</h3>
        <p class='slide-p'>No. Mastermind is individual player game.</p>
        <h3 class='slide-h3'>Is games have different difficulty levels?</h3>
        <p class='slide-p'>Yes, Mastermind the games in website are Multi level difficulty. i.e. 1 to 12 slots and 1 to 20 colors</p>
        <h3 class='slide-h3'>Can I Learn mastermind during play?</h3>
        <p class='slide-p'>Yes, to learn start with lesser slots and lesser colors, but colors not less then no of slots.</p>
        <h3 class='slide-h3'>Can see solution if lose game?</h3>
        <p class='slide-p'>Yes, As you press "End" button the secrete colors display in secrete colors slots.</p>
        `;

    document.getElementById("rulesPopup").style.display = "block";
}

export function hideRules() {
    textToSpeechEng('Close Rules');
    document.getElementById("rulesPopup").style.display = "none";
    document.getElementById("toggle-rules").textContent = "View Rules";
}