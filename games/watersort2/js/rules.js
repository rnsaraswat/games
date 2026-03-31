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
    rule.innerHTML = `<h2>Water Sort Rules</h2>
       
        <p>Water Sort game rules are simple: pour liquids of the same colour between tubes to group all colours together, but you can only pour a liquid onto another liquid of the exact same colour or into an empty tube, and each tube has limited space. The goal is to get all the liquid in each tube to be a single colour, often by using empty tubes strategically, without getting stuck. </p><br><br>
    
        <p><b>To play Water Sort Puzzle</b>, <br>    you tap on an any filled coloured water tube to pick it up,<br>
        then tap on another tube to pour the water into it. <br>    You can only pour coloured water into another tube if both tubes have the same colour at the top and <br>    if the receiving tube has enough space. <br><br>
        <b>Tapping:</b> Tap on a tube to select it and then tap on another tube to pour the water.<br>
        <b>Pouring Rules:</b><br>
        You can only pour water if the top colour in both tubes is the same. <br>
        You can only pour water into a tube that has enough space to accommodate the poured water. <br>
        <b>Winning:</b> The game is won when all the tubes contain water of only one colour and the tubes are full. <br>
        <b>Restarting:</b> You can restart a level at any time if you get stuck.</p>
    <h2>The Core Rules</h2>
        <b><u>Tap to Pour:</b></u> Tap a tube to pick up its top layer of liquid, then tap another tube to pour it.<br>
        <b><u>Same Colour Only:</b></u>  You can only pour liquid onto another layer of the exact same colour or into a completely empty tube.<br>
        <b><u>Full Tubes:</b></u>  Tubes have limited capacity; once full, no more liquid can be added.<br>
        <b><u>Empty Tubes:</b></u> Use empty tubes as temporary storage to create space and manoeuvrer colours.
    <h2>How to Play</h2>
        <b><u>Filled Tubes:</b></u> Puzzles begin with some tubes already filled with 4 different colours liquid randomly. regardless of the difficulty level, begins with allocated tubes. The player should use these colours position as clues to find which colours liquid moves to empty tube.<br>
        <b><u>Empty Tubes:</b></u> Two tubes are empty in starting of game which is use to transfer liquid.<br>
        <b><u>Top colours:</b></u> Look for top colours of filled tubes which can be transfer to empty tube<br>
        <b><u>Second / other colours:</b></u> remaining tubes top colours can be transferred into top empty tube only is the both colours are same.
    
    <h2>Buttons used in the game</h2>
        <u>No of tubes(mode):</u> This dropdown menu to select no of tubes (mode) in puzzle. 4 to 14 tubes option are available in which 2 tubes are empty. lesser the tubes easy the difficulty level and more tubes harder the difficulty level.<br>
        the levels are Easy/Medium/Hard<br>
        <u>Easy:</u> game required lesser transfer of liquid between tubes.<br>
        <u>Medium:</u> game required more transfer of liquid between tubes then easy level<br>
        <u>Hard:</u> game required more transfer of liquid between tubes then medium level<br>
        <b>all level are solvable.</b><br>
        <u>Start:</u> This will display tubes with filled liquid according to no of tubes difficulty of level. the time is also start.     <br>     - Game started with easy level 1 of each no of tubes (modes).    <br>     - As the game completed (win) by user Next game is displayed by clicking new game button.<br>    - Your game played progress is saved in local storage for each difficulty and no tubes.<br>    - As you changed difficulty or no tubes your progress for that is restored.<br>    - If you played first time game 1 for easy, 51 for medium and 101 for hard for that no of tubes is loaded for playing.<br>
        - Player current game is saved and each time you start game (click new game) the current game is display until player win current game.<br> 
        <u>Restart:</u> This will restart the current game puzzle and again display same puzzle from initial state. (any pouring of liquid by player is loose<br>
            <u>undo:</u> Undo return the last liquid transferred from tube by player. available undo are limited (shown in bracket) use in the special case. unnecessary press undo will also reduce your score.<br>
            <u>Pause:</u> This button will cover the game screen and stop timer till resume button is pressed. you cannot play and not even think about puzzle liquid transfer sequence of puzzle in pause mode.<br>
    
            <u>Theme:</u> this is toggle button for changing theme between light and dark theme.<br>
            <u>Music:</u> this is also toggle button to stop and play background music during game play.<br>
            <u>View Rules:</u> This also toggle button to view and hide rules (current window).<br>
            <u>Global leaderboard:</u> This toggle button to show and hide Global leaderboard (all any one who play and win).<br>
            <u>Local leaderboard:</u> This toggle button to show and hide local leaderboard (The games played and win on current device only).<br>
            <u>Sharing:</u> this button used to share the current game link to any one on facebook/tweeter/instgram/whatapp/email etc.<br>
            <u>Home:</u> Press this button bring you to Home screen (all game list) of Ravindra Games Hub. this will also loose your current game.<br>
            <u>Feedback:</u> it will open feedback window to submit comments/feedback/suggestions/like/dislike/rating/report about the game/app/site etc.<br>
            Information window display the filled/empty cell and time during the game play.<br>
            <u>Message:</u> display various message/instruction during game play. <br>
    <br>
        <b><u>play:</b></u><br> 
        1. select no of tubes and level and then press new game buttons.<br>
        2. to click on tube from which liquid transferred from tube, the tube displayed little up<br>
        3. to click on tube to liquid transferred into.<br>
    `;
    document.getElementById("rulesPopup").style.display = "block";
}

export function hideRules() {
    textToSpeechEng('Close Rules');
    document.getElementById("rulesPopup").style.display = "none";
    document.getElementById("toggle-rules").textContent = "📜View Rules";
}
