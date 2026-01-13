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
    rule.innerHTML = `<b>Game Setup:</b><br>
    <br>
    <b>Slots/Pegs:</b> Click on no of slotsPegs to choose slots/pegs between 1 to 12. Slots/pags should be > 0 and <= 12 and also slots/pegs <= no of colors<br>
    <b>Colors:</b> Click on no of Colors to choose Colors between 1 to 20. Colors should be > 0 and <= 20 and also Colors >= no of slots<br>
    <b>Allow Duplicate colors:</b> Click to tick ☑ for duplicate Colors allowed or untick ◻ duplicate Colors not allowed. duplicates allowed is harder the Duplicate not allowed.<br>
    <b>Players:</b> Two (Code Maker & Code Breaker). Here You are Code breaker and other player is Computer (Code maker).
    <b>Board:</b> Placed between players with the Code Shield facing the Maker.<br> 
    <b>Computer (Code Maker):</b> Secretly places colored pegs in the slots/pegs (as per duplicates allowed or not) and covers with the shield (show ? only).<br> 
<br>
<b>Gameplay</b><br>
<br>
<b>Guess:</b> Click on white circle to to open submenu of colors to choose colors. the click on submenu colors to choose. You (Code Breaker) places your guess colored pegs in the first row (closest to them) as their guess. After select/choose all slots/pegs Colors click to submit button to submit toy guess.<br>
<b>Feedback:</b> The Computer (Code Maker) uses key pegs to give clues: <br>
<b>Black Key Peg:</b> Right color, right position (no indication of which peg). <br>
<b>White Key Peg:</b> Right color, wrong position (no indication). <br>
<b>No Peg:</b> guess Color not in the code. <br>
<br>
<b>Deduce:</b> The Code Breaker uses the feedback to make a more informed guess in the next row, using logic.<br> 
<b>Repeat:</b> Steps game play steps continue until the code is cracked or all rows are used.<br>
<br>
<b>Winning</b><br>
<br>
<b>Game Over:</b> if black key pegs equal to no of Slots/pegs then code is cracked by player and game over. if no of attempt remain zero and black key pegs not equal to no of Slots/pegs then code is not cracked by player and game over.<br>
<b>You (Code Breaker) wins:</b> By guessing the code in the fewest possible turns (max number attempt).
<b>Computer (Code Maker) wins:</b> If the You (Code Breaker) runs out of attempts(guesses) before cracking the code.<br>
`;
    document.getElementById("rulesPopup").style.display = "block";
}