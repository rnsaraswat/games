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
    rule.innerHTML = `<h2>Jigsaw Puzzle Rules</h2>
            <br>
            start by Sort pieces by group interior pieces by colour, pattern, or texture to build the inner sections systematically. Frequently refer to the hint picture for guidance
        
        <h2>The Core Rules</h2>
        <b><u>Tap/click to hold piece:</b></u> Tap a piece to hold and move to place where you want.<br><br>
        <b><u>Drop piece:</b></u> release tap/click to drop piece.<br><br>
        <b><u>Snap mode:</b></u><br>
            <b><u>Smart Threshold:</b></u>When a piece is moved close to its correct location or an adjacent piece, it "snaps" or jumps into the precise, locked position.<br>
            <b><u>Exact Grid:</b></u>When a piece is moved close to its correct location or an adjacent piece, it "snaps" or jumps into the precise, locked position.<br>
            <b><u>OFF:</b></u>No smart threshold, player need to place piece using drag/drop When a piece is moved close to its correct location or an adjacent piece, it "snaps" or jumps into the precise, locked position.
        
        <h2><b><u>How to Play</b></u></h2>
        1. select grid size (level) and click thumbnail from gallery to select image to start new puzzle.<br>
        2. Last thumbnail in image gallery to select random image from internet for play.<br>
        2. Click/Tap a piece to hold and move to place where you want.<br>
        3. release tap/click to drop piece.<br>
        4. double click on on piece to rotate 90 degrees if rotation is ON.
        
        <h2><b>Buttons used in the game</b></h2>
        <u>Size:</u> This drop-down menu to select grid size (level) of puzzle. lesser the size easy the difficulty level and more grid size harder the difficulty level. the difficulty as per grid size selected.<br>
        the levels are Easy/Medium/Hard/Extreme.<br>
        <u>Easy:</u> 3x4 pieces.<br>
        <u>Medium:</u> 4x6 pieces.<br>
        <u>Hard:</u> 6x8 pieces.<br>
        <u>Extreme:</u> 10x14 pieces.<br>
        <u>Reshuffle:</u>This will reshuffle the current game all pieces and spread over puzzle if no piece is placed on correct position, but Reshuffle unplaced pieces if some pieces are placed on correct position<br>
        <u>Hint:</u>This a drop down menu to select hint type.<br> 
        <u>OFF:</u> no image is shown behind pieces.<br>
        <u>Easy:</u> very light image (25% opacity) shown in backside of pieces.<br>
        <u>Medium:</u>light image shown (50% opacity) in backside of pieces.<br>
        <u>Hard:</u>clear image is shown in backside of pieces.<br>
        <u>Rotation piece:</u>This a drop down menu to select rotation of pieces. if it s ON pieces are rotated 90 degree by double click and during rotation off no effect of double click. <br>
        <u>Piece Shape:</u>This a drop down menu to select piece type. Only rectangle pieces are available in this game. <br>
        <u>Pause:</u> This button will stop timer till resume button is pressed. you cannot play puzzle in pause mode.<br>
        <u>Resume:</u> This button resume current game, timer will start.<br>
        <u>Gallery:</u> Click on gallery image thumbnail to select image to play puzzle.<br>
        Random image thumbnail in last of gallery will select random image from internet for play<br>
        <u>URL Image:</u> Paste URL image link in the input and click load image URL button to play with your selected URL image.<br>
        <u>Device Image:</u> click on choose image to select image from your device, after selecting image from your device click load your image button to play with your selected image.<br>
        <u>Theme:</u> this is toggle button for changing theme between light and dark theme.<br>
        <u>Music:</u> this is also toggle button to stop and play background music during game play.<br>
        <u>View Rules:</u> This also toggle button to view and hide rules (current window).<br>
        <u>Global leaderboard:</u> This toggle button to show and hide Global leaderboard (all any one who play and win).<br>
        <u>Local leaderboard:</u> This toggle button to show and hide local leaderboard (The games played and win on you current device only).<br>
        <u>Sharing:</u> this button used to share the current game link to any one on facebook/tweeter/instgram/whatapp/email etc.<br>
        <u>Home:</u> Press this button bring you to Home screen (all game list) of Ravindra Games Hub. this will also loose your current game.<br>
        <u>Feedback:</u> it will open feedback window to submit comments/feedback/suggestions/like/dislike/rating/report about the game/app/site etc.<br>
        Information window display the filled/empty cell and time during the game play.<br><br>
        <b><u>play:</b></u><br> 
        1. select grid size (level) and click thumbnail from gallery to select image to start new puzzle.<br>
        2. Last thumbnail in image gallery to select random image from internet for play.<br>
        2. Click/Tap a piece to hold and move to place where you want.<br>
        3. release tap/click to drop piece.<br>
        <br>
    `;
    document.getElementById("rulesPopup").style.display = "block";
}

export function hideRules() {
    textToSpeechEng('Close Rules');
    document.getElementById("rulesPopup").style.display = "none";
    document.getElementById("toggle-rules").textContent = "📜View Rules";
}


// showRules();