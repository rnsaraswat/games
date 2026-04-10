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
    rule.innerHTML = `<h2>Block Sort Rules</h2>
    <br>
    <p>Block Sort game rules are simple: transfer block of the same color between container to group all colors together, but you can only transfer block onto another block of the exact same color or into an empty container, and each container has limited space. The goal is to get all the liquid in each container to be a single color, often by using empty container strategically, without getting stuck. </p>

    <p>To play Blick Sort Puzzle, you <br><b>click/tap on a any filled colored block container to pick it up,<br>
    then click/tap on another container to transfer block into it.</b> <br>You can only transfer colored block into another container if both container have the same color blocks at the top and <br>if the receiving container has enough space. <br><br>
    <b>Clicking/Tapping:</b> Click/Tap on a container/top block to select it (mooved up) and then click/tap on another container/top block to transfer block.<br>
    <b>Transfer Rules:</b><br>
    You can only Transfer block if the top color of blocks in both container is the same. <br>
    You can only transfer block into a container that has enough space to accommodate the coloured block. <br>
    <b>Winning:</b> The game is won when all the container contain blocks  of only one color and the container is full. <br>
    <b>Game Stuck:</b> 1. This game is stuck when no container is empty and top colours of all container blocks are different.<br>
    2. When block can be moved from one container to another, and possible to return back to previous container only, the game will also considered as stuck. However, since move is possible, the game will not report it as stuck.<br> 
    <b>Restarting:</b> You can restart a level at any time or if player game stuck.</p>


<h2>The Core Rules</h2>
<b><u>Click/Tap to Transfer:</b></u> Click/Tap a container to pick up its top block, then click/tap another container to transfer it.<br>
<b><u>Same Color Only:</b></u>  You can only transfer block onto another layer of the exact same color or into a completely empty container.<br>
<b><u>Full Container:</b></u>  Container have limited capacity; once full, no more block can be added.<br>
<b><u>Empty Container:</b></u> Use empty container as temporary storage to create space and maneuver colors blocks.



<h2>How to Play</h2>
<b><u>Filled Container:</b></u> Puzzles begin with some container already filled with 4 different colors blocks randomly (as per level). regardless of the difficulty level, begins with allocated containers. The player should use these colors position as clues to find which colors block moves to empty container.<br>
<b><u>Empty Container:</b></u> Two container are empty in starting of game which is use to transfer clocred blocks.<br>
<b><u>Top colors:</b></u> Look for top block colors of filled tubes which can be transfed to empty container<br>
<b><u>Second / other colors:</b></u> remainig container top colors block can be transfred into top empty tube only is the both colors are same. <br>
<b><u>Number on Blocks:</b></u> Number on blocks are color number and it only helping to playing semi or fully color blind players.

<h2>Buttons used in the game</h2>
<u>No of Colors(mode):</u> This dropdown menu to select no of colors (mode) in puzzle. 2 to 18 colors option are available in which 2 containers are empty. lesser the colors easy the difficulty level and more tubes harder the difficulty level.<br>
the levels are Easy/Medium/Hard<br>
<u>Easy:</u> game required lesser transfer of coloured blocks bewteen container.<br>
<u>Medium:</u> game required more transfer of coloured blocks between container then easy level<br>
<u>Hard:</u> game required more transfer of coloured blocks between container then medium level<br>
<b>all level are solveable.</b><br>

Player current game is saved and each time you start game (click new game) the current game is display until player win current.<br> 
<u>Restart:</u> This will reset the current game puzzle and display again same puzzle, your tranfer coloured blocks between container are lossed.<br>
<u>undo:</u> Undo return the last coloured block transfered from container by player. availabe undo are limited (shown on button) use the special case. unnecessary press undo will also reduce your score also.<br>
<u>Pause:</u> This button will cover the game screen and stop timer till resume button is pressed. you cannot play and not even think about puzzle block transfer sequence of puzzle in pause mode.<br>

<u>Theme:</u> this is toggle button for changing theme between light(orange) and dark(blue) theme.<br>
<u>Music:</u> this is also toggle button to stop and play background music during game play.<br>
<u>View Rules:</u> This also toggle button to view and hide rules (current window).<br>
<u>Global leaderboard:</u> This toggle button to show and hide Global leaderboard (all any one who play and win).<br>
<u>Local leaderboard:</u> This toggle button to show and hide local leaderboard (The games played and win on current device only).<br>
<u>Sharing:</u> this button used to share the current game link to any one on facebook/tweeter/instgram/whatapp/email etc.<br>
<u>Home:</u> Press this button bring you to Home screen (all game list) of Ravindra Games Hub. this will also loose your current game.<br>
<u>Feedback:</u> it will open feedback window to submit comments/feedback/suggestions/like/dislike/rating/report about the game/app/site etc.<br>
Information window display the moves (transfer blocks between container) and elapsed time of the game play.<br>
<u>Message:</u> display various message/instruction during game play. <br>
<br>
In starting select level screen will display. No of Colours drop down button and Difficulty dropdown button.<br>
List of level for default selected no of colors and all difficulty (easy/medium/hard) containers with filled coloured blocks according to no of colours, difficulty of level.<br>
1. To click on no colors to select/change no of colours.<br>
2. As you change the no of colours the list level also changed for that no of colours.<br>
3. As you change difficulty the level for that difficulty shwon.<br>
4. The levels shown in green are unlocked and already played by player on current device<br>
5. the level shown in orange is players current unlocked lavel and it is not cleared by player<br>
6. The levels shown gray colours are locked, player connot play until it is unlocked. level is unlocked only if previous level is win.<br><br> 
<b><u>play:</b></u><br> 
1. player can click/tap on any unlocked level to play, the game will display filled conatiners (as per no of colours) and 2 empty container<br>
2. Click/Tap a container to pick up its top block,<br>
3. Click/Tap another container to transfer block.<br>
4. As you win the current game the next level of that no colours and difficuly is unlocked<br>
5. the select level screen with that unlocked level is shown on you screen.<br>`;

    document.getElementById("rulesPopup").style.display = "block";
}

export function hideRules() {
    textToSpeechEng('Close Rules');
    document.getElementById("rulesPopup").style.display = "none";
    document.getElementById("toggle-rules").textContent = "📜View Rules";
}
