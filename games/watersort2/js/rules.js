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
    <br>
    <p>Water Sort game rules are simple: pour liquids of the same color between tubes to group all colors together, but you can only pour a liquid onto another liquid of the exact same color or into an empty tube, and each tube has limited space. The goal is to get all the liquid in each tube to be a single color, often by using empty tubes strategically, without getting stuck. </p>

    <p>To play Water Sort Puzzle, you <b>tap on a any filled colored water tube to pick it up,<br>
    then tap on another tube to pour the water into it.</b> You can only pour colored water into another
    tube if both tubes have the same color at the top and <br>if the receiving tube has enough space. <br><br>
    <b>Here's a more detailed breakdown:</b><br> <br>
    <b>Tapping:</b> Tap on a tube to select it and then tap on another tube to pour the water.<br>
    <b>Pouring Rules:</b><br>
    You can only pour water if the top color in both tubes is the same. <br>
    You can only pour water into a tube that has enough space to accommodate the poured water. <br>
    <b>Winning:</b> The game is won when all the tubes contain water of only one color and the tubes are
    full. <br>
    <b>Restarting:</b> You can restart a level at any time if you get stuck.<br><br></p>


<b><u><p style="text-align:center">The Core Rules</b></u><br><br><p>
<b><u>Tap to Pour:</b></u> Tap a tube to pick up its top layer of liquid, then tap another tube to pour it.<br><br>
<b><u>Same Color Only:</b></u>  You can only pour liquid onto another layer of the exact same color or into a completely empty tube.<br><br>
<b><u>Full Tubes:</b></u>  Tubes have limited capacity; once full, no more liquid can be added.<br><br>
<b><u>Empty Tubes:</b></u> Use empty tubes as temporary storage to create space and maneuver colors. <br><br>



<b><u>How to Play</b></u><br><br>
<b><u>Filled Tubes:</b></u> Puzzles begin with some tubes already filled with 4 different colors lequid randomly. regardless of the difficulty level, begins with allocated tubes. The player should use these colors position as clues to find which colors lequid moves to empty tube.
<b><u>Filled Tubes:</b></u> Two tubes are empty in starting og game which is use to transfer lequid.<br><br>
<b><u>Top colors:</b></u> Look for top colors of filled tubes which can be transfed to empty tube<br><br>
<b><u>Second / other colors:</b></u> remainig tubes top colors can be transfred into top empty tube only is the both colors are same. <br>
<br><br>



<b>Buttons used in the game</b><br><br>
<u>No of tubes:</u> This dropdown menu to select no of tubes in puzzle. lesser the tubes easy the difficulty level and more tubes harder the difficulty level. the difficulty as per no of selected.<br>
the levels are Easy/Medium/Hard/Very Hard/Expert.<br>
<u>Easy:</u> 3-4 tubes.<br>
<u>Medium:</u> 5-6 tubes.<br>
<u>Hard:</u> 7-8 tubes.<br>
<u>Very Hard:</u> 9-11 tubes.<br>
<u>Expert:</u> 12-14 tubes.<br>
<u>Start:</u> This will display tubes with filled lequid according to no of tubes difficulty. the time is also start. and button renaimed as "Restart".Each time you press new puzzle is displayed.<br>
<u>Restart:</u> This will reset the current game puzzle and display again new puzzle.<br>
// <u>undo:</u> Undo the cell filled by you. By pressing this button again an again it will remove cell filled last by you continue till all filled cell are removed from game board. unnecessary press redo will also reduce your score.<br>
// <u>redo:</u> Redo the cell filled again which is undo by you. By pressing this button again and again it will filled all cell last undo by you continue till all undo are completed. unnecessary press undo will reduce your score.<br>

<u>Pause:</u> This button will stop timer till resume button is pressed. you cannot play puzzle in pause mode.<br>

<u>Theme:</u> this is toggle button for changing theme between light and dark theme.<br>
<u>Music:</u> this is also toggle button to stop and play background music during game play.
<u>View Rules:</u> This also toggle button to view and hide rules (current window).<br>
<u>Global leaderboard:</u> This toggle button to show and hide Global leaderboard (all any one who play and win).<br>
<u>Local leaderboard:</u> This toggle button to show and hide local leaderboard (The games played and win on you current device only).<br>
<u>Sharing:</u> this button used to share the current game link to any one on facebook/tweeter/instgram/whatapp/email etc.<br>
<u>Home:</u> Press this button bring you to Home screen (all game list) of Ravindra Games Hub. this will also loose your current game.<br>
<u>Feedback:</u> it will open feedback window to submit comments/feedback/suggestions/like/dislike/rating/report about the game/app/site etc.<br>
Information window display the filled/empty cell and time during the game play.
<u>Message:</u> display various message/instruction during game play. <br>
<u>Numpad:</u> this will diplay the buttons for number/alphbets according to grid size of game.<br>
<br>
<b><u>play:</b></u><br> 1. select grid size and level and pres new buttons.<br>
2. to fill cell with number/alphabts first select the number/aphabets in numpad. the selected show the different, then click cell to fille that number in the cell.<br>
3. to romove number/alphbets forn cell first select the cell, then click on back button in numpad to reomve the number/alphbets.<br>`;
    document.getElementById("rulesPopup").style.display = "block";
}

export function hideRules() {
    textToSpeechEng('Close Rules');
    document.getElementById("rulesPopup").style.display = "none";
    document.getElementById("toggle-rules").textContent = "📜View Rules";
}
