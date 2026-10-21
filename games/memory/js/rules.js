import { textToSpeechEng } from './speak.js';

/* ---------- Rules Toggle  ---------- */
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

/* ---------- Rules Display javaScript ---------- */
function showRules() {
    let rule = document.getElementById("RulesBox");
    rule.style.textAlign = "left";
    // all rules are write here with required HTML tegs
    rule.innerHTML = `<p>The Memory Game (often called Concentration or Match-Match) is a classic puzzle that tests your visual memory and focus. <br></p>
    <p>The core goal is to flip over pairs of matching cards until all matches are found.<br></p>
    <p>Players click on tile/card it take turns, flipping over two cards/tile at a time, trying to find matching pairs. <br></p>
    <p>If the cards match(identical), the cards/tiles remains up. player keeps them and gets another turn. <br></p>
    <p>If they don't match(not identical), the cards are flipped back face down immediately, and player click next tiles. <br></p>
    <p>The game continues until all pairs are matched, and the player wins when all pair matched.<br></p>
    <p>Players memorize their cards, in next turn try to match them.</p>

    <h2>🧠Strategies to Win</h2>
    <p>To reduce your move count and clear the board faster, use these mental techniques:<br></p>
    <p><u>Establish a Grid Coordinate System:</u> Mentally label the rows and columns (e.g., A1, B3). Attaching a spatial label to a card's location makes it much easier for your brain to store the information than just remembering "somewhere in the middle.<br></p>
    <p><u>"Don't Guess on the Second Card:</u> If you flip a card you haven't seen before, don't just blindly guess the second card. Instead, flip a card whose location you already know. Even if it doesn't match, you confirm its position without wasting a completely blind turn.<br></p>
    <p><u>Focus on Small Quadrants:</u> Instead of scattering your flips all over the board, master one corner or section first. Clearing out a specific quadrant reduces visual noise and narrows down where the remaining matches could be.<br></p>
    <p><u>Make Association Stories:</u> If you flip a card with a "Cat" at position A1 and an "Apple" at position B2, quickly tell yourself a short, silly phrase like "The cat ate the apple." Weird or funny mental associations stick in your short-term memory far better than raw placement data.<br></p>
    <p><u>Take Your Time:</u> Avoid clicking or flipping rapidly. When a mismatch occurs, stare at the cards for an extra second before making your next move to let the visual memory lock into your brain.<br></p>
            `;

    let ButtonBox = document.getElementById("ButtonBox");
    ButtonBox.style.textAlign = "left";
    // all rules are write here with required HTML tegs
    ButtonBox.innerHTML = `<p><u>1. Start:</u> This will display grid of card/tiles liquid according to difficulty level. the time is also start.<br></p>
    <p>As game start this button renamed as "End" and used to end the game by face up all tiles and player loses.<br><br></p>
    <p><u>2. Level:</u> level (size) a standard deck of 8 to 150 cards,<br></p>
    <p>player can select different levels like very easy/easy/medium/hard/expert.<br></p>
    <p>the level/size(no of card/tiles) as under:-<br></p>
    <p>very easy - 4x4 total 16 cards/times.<br></p>
    <p>easy - 6x6 total 36 cards/tiles.<br></p>
    <p>medium - 8x8 total 64 cards/tiles.<br></p>
    <p>hard - 10x10 total 100 cards/tiles.<br></p>
    <p>expert - 12x12 total 144 cards/tiles.<br><br></p>
    <p><u>3. Theme:</u> Player can also play with different themes (types of cards), like those with pictures or designs like fruits/animals... etc., as long as there are matching pairs.<br></p>
    <p>Following themes are available :-<br></p>
    <p>🦁Animals, 🏖️ Beach, 🐦 Bird, 🏙️ City Item, 👕 Cloth, 🏳️ Flags, Emoji, 🍎 Food, 🎃 Halloween,  🎭 Actor, 📺 House item, 🎭 Actress, 📦 Items,0️⃣ Number, 🧑‍🍳 Occupations, 🦈 Ocean Animals, Past tense, 🪐 Solar System, 🌱 Plant, 🛝 playground, 🤝 Social, 🧸 Toy, 🚗 Transportation, 🍅 Vegetable.<br><br></p>
    <p><u>4. UI Theme:</u> this is toggle button for changing theme between light and dark theme.<br><br></p>
    <p><u>5. Music:</u> this is also toggle button to stop and play background music during game play.<br><br></p>
    <p><u>6. View Rules:</u> This also toggle button to view and hide rules (current window).<br><br></p>
    <p><u>7. Global leaderboard:</u> This toggle button to show and hide Global leaderboard (all any one who play and win).<br><br></p>
    <p><u>8. Local leaderboard:</u> This toggle button to show and hide local leaderboard (The games played and win on current device only).<br><br></p>
    <p><u>9. Sharing:</u> this button used to share the current game link to any one on Facebook/tweeter/Instagram/WhatsApp/email etc.<br><br></p>
    <p><u>10. Home:</u> Press this button bring you to Home screen (all game list) of Ravindra Games Hub. this will also loose your current game.<br><br></p>
    <p><u>11. Feedback:</u> it will open feedback window to submit comments/feedback/suggestions/like/dislike/rating/report about the game/app/site etc.<br><br></p>
    <p><u>12. Information display:</u> display area where the moves and time during the game play.<br></p>
    <p><u>12. Game board tile:</u> Click/Tap any game board tiles it flip and face up its picture.<br></p>
    `;

    let HowtoPlayBox = document.getElementById("HowtoPlayBox");
    HowtoPlayBox.style.textAlign = "left";
    // all rules are write here with required HTML tegs
    HowtoPlayBox.innerHTML = `<p>1. select Level and Theme then press start buttons.<br></p>
    <p>2. click on tile to flip one(first) tile face up<br></p>
    <p>3. click on tile to flip one(second) tile face up.<br></p>
    <p>4. Repeat step step 2 and 3 until all slides are matches.<br></p>
    <p>5. Press "End" to end game if all slides are not matches to see the matched tiles.<br></p>
            `;

    let GameFeatureBox = document.getElementById("GameFeatureBox");
    GameFeatureBox.style.textAlign = "left";
    // all rules are write here with required HTML tegs
    GameFeatureBox.innerHTML = `
    <p>Modern digital memory games featured on Ravindra Games Hub are designed to expand upon the simple, classic tabletop card-matching layout. Integrate specific core modules to maximize replay value, improve brain training, and accommodate all age groups.<br> <br></p>
    <p>
            <b>🎮 Gameplay Configurations & Mechanics Grid and Level Scales:</b><br> Games scale from simple grids for quick casual play up to massive grids for a deep focus session.<br></p>
            <p>Grid options commonly level/size(no of card/tiles) as under:-<br></p>
             <p>    <u>very easy</u> - 4x4 total 16 cards/times.<br></p>
             <p>    <u>easy</u> - 6x6 total 36 cards/tiles.<br></p>
             <p>    <u>medium</u> - 8x8 total 64 cards/tiles.<br></p>
             <p>    <u>hard</u> - 10x10 total 100 cards/tiles.<br></p>
             <p>    <u>expert</u> - 12x12 total 144 cards/tiles.<br><br></p>
             <p><b>⏱️Varied Game Modes:</b><br></p>
             <p>    <u>Moves Mode:</u> Flips total number of card in minimum flips before a game over to get higher score.<br></p>
             <p>    <u>Time Attack Mode:</u> Players find every single pair in minimum time of  count up clock to get higher score.<br></p>
             <p>    <u>Endless / Relax Mode:</u> Player can play for casual practice layout without limits or timers to encourage stress-free focus by ignoring the moves and timer.<br><br></p>
             <p><b>🎨 Visual & Customization Features Extensive Deck Themes:</b> Instead of traditional playing cards, boards feature diverse icon types to challenge multi-categorical retention.<br> </p>
            <p>Theme categories include:<br></p>
            <p>    <u>Nature & Animals:</u> 🦁Animals, 🐦 Bird, 🦈 Ocean and Wildlife animals, 🌱 Plant.
                <u>Objects & Learning:</u> 🧸 Toy, 👕 Cloth, House Items, 🍎 Food, 📺 House item, 📦 Items, 🍅 Vegetable.<br></p>
            <p>    <u>Pop Culture & Fun:</u> 🎭 Actors, 🎭 Actress, Emojis.<br> </p>
            <p>    <u>Seasonal themes:</u>  🎃 Halloween, 🤝 Social. <br></p>
            <p>    <u>Education and Learning:</u>0️⃣ Number, 🧑‍🍳 Occupations, Past tense, 🪐 Solar System,  🛝 playground, 🚗 Transportation, 🏖️ Beach, 🏙️ City Item, 🏳️ Flags, <br><br></p>
            <p><b>🌙UI Themes:</b> Dark mode or customizable color profiles help limit digital eye strain during extended play sessions. <br><br></p>
            <p><b>🔊Audio Engineering:</b> Built-in sound effects provide distinct auditory cues for successful matches or mismatches, with options to toggle music off for absolute silence. <br><br></p>
            <p><b>📊 Tracking & Social Features Stat Integration:</b> An interactive counter tracks ongoing Moves and active Stopwatch Timers right on the display.<br><br></p>
            <p><b>🏆Leaderboard Systems:</b> Scores are processed locally or globally to rank high-performing players by the lowest elapsed time or absolute cleanest move efficiency. <br><br></p>
            <p><b>📤Social Sharing Platforms:</b> Direct hooks allow players to share their high scores, challenge friends, or provide immediate development feedback.<br><br></p>
            <p><b>💬Feedback System:</b> it will open feedback window to submit comments/feedback/suggestions/like/dislike/rating/report about the game/app/site etc.<br></p>
            `;


    let FeqBox = document.getElementById("FeqBox");
    FeqBox.style.textAlign = "left";
    // all rules are write here with required HTML tegs
    FeqBox.innerHTML = `<h3 class='slide-h3'>Is Ravindra Games Hub free?</h3>
            <p class='slide-p'>Yes, every game is free.</p>
            <h3 class='slide-h3'>Can I play offline?</h3>
            <p class='slide-p'>No, Memory game need internet connection for play.
            <h3 class='slide-h3'>How many themes in website?</h3>
            <p>Two themes are available - Dark(Blue), Light(Orange) in website.</p>
            <h3 class='slide-h3'>Does my game lost in website?</h3>
            <p class='slide-p'>Your game is lost in website when home, Brower back/refresh button is pressed.</p>
            <h3 class='slide-h3'>When my game is resume in website?</h3>
            <p class='slide-p'>Your games is resume in website when leaderboard, feedback, theme, sharing, music and pause is clicked.</p>
            <h3 class='slide-h3'>Can two players play game?</h3>
            <p class='slide-p'>No. Memory is individual player game.</p>
            <h3 class='slide-h3'>Can play game with AI?</h3>
            <p class='slide-p'>No. Memory is individual player game.</p>
            <h3 class='slide-h3'>Is games have different difficulty levels?</h3>
            <p class='slide-p'>Yes, All the games in app and website are 5 difficulty levels. Very easy, Easy, Medium, Hard and Expert</p>
            <h3 class='slide-h3'>is memory single player game?</h3>
            <p class='slide-p'>Yes, Memory is single player game.</p>
            <h3 class='slide-h3'>Can see all cards if lose game?</h3>
            <p class='slide-p'>Yes, As you press "End" button all cards are face up to see matching slides.</p>
            `;

    document.getElementById("rulesPopup").style.display = "block";
}

export function hideRules() {
    textToSpeechEng('Close Rules');
    document.getElementById("rulesPopup").style.display = "none";
    document.getElementById("toggle-rules").textContent = "View Rules";
}